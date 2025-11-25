import * as vscode from "vscode";
import { GitService } from "../services/gitService";
import { AIService } from "../services/aiService";
import { NotificationManager } from "../managers/notificationManager";
import { StatusBarManager } from "../managers/statusBarManager";

export interface EngineStats {
  totalCommits: number;
  totalErrors: number;
  uptime: string;
  memoryUsage: string;
  isRunning: boolean;
  isPaused: boolean;
  lastCommit?: string;
  currentBranch?: string;
}

export class AutoCommitEngine {
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private intervalId: NodeJS.Timeout | undefined;
  private stats: EngineStats;
  private startTime: Date | undefined;
  private retryCount: number = 0;

  constructor(
    private gitService: GitService,
    private aiService: AIService,
    private notificationManager: NotificationManager,
    private statusBarManager: StatusBarManager
  ) {
    this.stats = {
      totalCommits: 0,
      totalErrors: 0,
      uptime: "0m",
      memoryUsage: "0MB",
      isRunning: false,
      isPaused: false,
    };
  }

  async start(): Promise<void> {
    if (this.isRunning && !this.isPaused) {
      throw new Error("Auto-commit is already running");
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error("No workspace folder open");
    }

    const config = vscode.workspace.getConfiguration("tct");
    const delaySeconds = config.get<number>("delaySeconds", 60);

    if (this.isPaused) {
      this.isPaused = false;
      this.statusBarManager.updateStatus("running");
      return;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = new Date();
    this.stats.isRunning = true;
    this.stats.isPaused = false;

    this.statusBarManager.updateStatus("running");
    this.log("[+] Auto-commit engine started");

    // Initial check
    await this.performCommitCycle();

    // Schedule periodic checks
    this.intervalId = setInterval(async () => {
      if (!this.isPaused) {
        await this.performCommitCycle();
      }
      this.updateStats();
    }, delaySeconds * 1000);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      throw new Error("Auto-commit is not running");
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.isRunning = false;
    this.isPaused = false;
    this.stats.isRunning = false;
    this.stats.isPaused = false;
    this.startTime = undefined;

    this.statusBarManager.updateStatus("stopped");
    this.log("[+] Auto-commit engine stopped");
  }

  async pause(): Promise<void> {
    if (!this.isRunning) {
      throw new Error("Auto-commit is not running");
    }

    this.isPaused = !this.isPaused;
    this.stats.isPaused = this.isPaused;

    this.statusBarManager.updateStatus(this.isPaused ? "paused" : "running");
    this.log(
      this.isPaused ? "[+] Auto-commit paused" : "[+] Auto-commit resumed"
    );
  }

  async rollback(): Promise<void> {
    this.log("[+] Rolling back last commit...");
    try {
      await this.gitService.rollbackLastCommit();
      this.stats.totalCommits = Math.max(0, this.stats.totalCommits - 1);
      this.log("[✓] Rollback successful");

      if (
        vscode.workspace
          .getConfiguration("tct")
          .get<boolean>("enableNotifications")
      ) {
        this.notificationManager.showSuccess("Rollback successful");
      }
    } catch (error) {
      this.stats.totalErrors++;
      this.log(`[✗] Rollback failed: ${error}`);
      throw error;
    }
  }

  getStats(): EngineStats {
    this.updateStats();
    return { ...this.stats };
  }

  private async performCommitCycle(): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration("tct");
      const enableErrorRecovery = config.get<boolean>(
        "enableErrorRecovery",
        true
      );
      const maxRetries = config.get<number>("maxRetries", 3);

      this.log("[+] Checking for changes...");

      // Check if there are changes
      const hasChanges = await this.gitService.hasChanges();
      if (!hasChanges) {
        this.log("[i] No changes detected");
        return;
      }

      // Get current branch
      const currentBranch = await this.gitService.getCurrentBranch();
      this.stats.currentBranch = currentBranch;

      // Check if we need to switch to auto branch
      const autoBranch = config.get<string>("autoBranch", "dage/auto");
      if (currentBranch !== autoBranch) {
        this.log(`[+] Switching to branch: ${autoBranch}`);
        await this.gitService.switchBranch(autoBranch);
      }

      // Get changed files
      const changedFiles = await this.gitService.getChangedFiles();
      this.log(`[+] Found ${changedFiles.length} changed file(s)`);

      // Generate AI commit message
      this.log("[+] Generating AI commit message...");
      const aiMessage = await this.aiService.generateCommitMessage(
        changedFiles
      );

      const template = config.get<string>(
        "commitMessageTemplate",
        "Auto: {message}"
      );
      const commitMessage = template.replace("{message}", aiMessage);

      // Stage and commit
      this.log("[+] Staging changes...");
      await this.gitService.stageAll();

      this.log(`[+] Committing: "${commitMessage}"`);
      await this.gitService.commit(commitMessage);

      this.stats.totalCommits++;
      this.stats.lastCommit = commitMessage;
      this.retryCount = 0;

      // Push if enabled
      if (config.get<boolean>("enablePushAfterCommit", true)) {
        this.log("[+] Pushing to remote...");
        await this.gitService.push();
        this.log("[✓] Push successful");
      }

      this.log("[✓] Commit successful");

      // Send webhook notification
      const webhookUrl = config.get<string>("webhookUrl");
      if (webhookUrl) {
        await this.notificationManager.sendWebhook(webhookUrl, {
          message: commitMessage,
          branch: autoBranch,
          files: changedFiles.length,
        });
      }

      // Show notification
      if (config.get<boolean>("enableNotifications")) {
        this.notificationManager.showSuccess(`Committed: ${commitMessage}`);
      }
    } catch (error) {
      this.stats.totalErrors++;
      this.log(`[✗] Error: ${error}`);

      const config = vscode.workspace.getConfiguration("tct");
      const enableErrorRecovery = config.get<boolean>(
        "enableErrorRecovery",
        true
      );
      const maxRetries = config.get<number>("maxRetries", 3);

      if (enableErrorRecovery && this.retryCount < maxRetries) {
        this.retryCount++;
        this.log(`[!] Retrying... (${this.retryCount}/${maxRetries})`);

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.performCommitCycle();
      } else {
        this.retryCount = 0;
        if (config.get<boolean>("enableNotifications")) {
          this.notificationManager.showError(`Commit failed: ${error}`);
        }
      }
    }
  }

  private updateStats(): void {
    if (this.startTime) {
      const uptime = Date.now() - this.startTime.getTime();
      const minutes = Math.floor(uptime / 60000);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        this.stats.uptime = `${hours}h ${minutes % 60}m`;
      } else {
        this.stats.uptime = `${minutes}m`;
      }
    }

    const memoryUsage = process.memoryUsage();
    this.stats.memoryUsage = `${Math.round(
      memoryUsage.heapUsed / 1024 / 1024
    )}MB`;
  }

  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);

    // Emit event for logs provider
    vscode.commands.executeCommand("tct.logMessage", logMessage);
  }
}
