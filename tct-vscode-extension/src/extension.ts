import * as vscode from "vscode";
import { GitService } from "./services/gitService";
import { AIService } from "./services/aiService";
import { DashboardProvider } from "./providers/dashboardProvider";
import { ControlsProvider } from "./providers/controlsProvider";
import { LogsProvider } from "./providers/logsProvider";
import { StatusBarManager } from "./managers/statusBarManager";
import { NotificationManager } from "./managers/notificationManager";
import { AutoCommitEngine } from "./engine/autoCommitEngine";

let autoCommitEngine: AutoCommitEngine | undefined;
let gitService: GitService | undefined;
let aiService: AIService | undefined;
let statusBarManager: StatusBarManager | undefined;
let notificationManager: NotificationManager | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log("TCT Git Auto-Commiter extension is now active!");

  // Initialize services
  gitService = new GitService();
  aiService = new AIService();
  notificationManager = new NotificationManager();
  statusBarManager = new StatusBarManager();
  autoCommitEngine = new AutoCommitEngine(
    gitService,
    aiService,
    notificationManager,
    statusBarManager
  );

  // Create output channel
  const outputChannel = vscode.window.createOutputChannel("TCT Git Automation");
  context.subscriptions.push(outputChannel);

  // Register tree view providers
  const dashboardProvider = new DashboardProvider(autoCommitEngine);
  const controlsProvider = new ControlsProvider(autoCommitEngine);
  const logsProvider = new LogsProvider(outputChannel);

  vscode.window.registerTreeDataProvider("tct-dashboard", dashboardProvider);
  vscode.window.registerTreeDataProvider("tct-controls", controlsProvider);
  vscode.window.registerTreeDataProvider("tct-logs", logsProvider);

  // Register status bar
  context.subscriptions.push(statusBarManager.getStatusBarItem());

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("tct.startAutoCommit", async () => {
      try {
        await autoCommitEngine?.start();
        dashboardProvider.refresh();
        controlsProvider.refresh();
        vscode.window.showInformationMessage("✅ TCT Auto-Commit started");
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to start: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.stopAutoCommit", async () => {
      try {
        await autoCommitEngine?.stop();
        dashboardProvider.refresh();
        controlsProvider.refresh();
        vscode.window.showInformationMessage("⏹ TCT Auto-Commit stopped");
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to stop: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.pauseAutoCommit", async () => {
      try {
        await autoCommitEngine?.pause();
        dashboardProvider.refresh();
        controlsProvider.refresh();
        vscode.window.showInformationMessage("⏸ TCT Auto-Commit paused");
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to pause: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.rollbackLastCommit", async () => {
      const confirm = await vscode.window.showWarningMessage(
        "Are you sure you want to rollback the last commit?",
        { modal: true },
        "Yes",
        "No"
      );
      if (confirm === "Yes") {
        try {
          await autoCommitEngine?.rollback();
          dashboardProvider.refresh();
          vscode.window.showInformationMessage("↶ Rollback successful");
        } catch (error) {
          vscode.window.showErrorMessage(`Rollback failed: ${error}`);
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.openSettings", () => {
      vscode.commands.executeCommand("workbench.action.openSettings", "tct");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.openDashboard", () => {
      const panel = vscode.window.createWebviewPanel(
        "tctDashboard",
        "TCT Dashboard",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );
      panel.webview.html = getWebviewContent(autoCommitEngine);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.exportLogs", async () => {
      try {
        const logs = logsProvider.getAllLogs();
        const uri = await vscode.window.showSaveDialog({
          defaultUri: vscode.Uri.file("tct-logs.txt"),
          filters: { "Text Files": ["txt"], "JSON Files": ["json"] },
        });
        if (uri) {
          await vscode.workspace.fs.writeFile(uri, Buffer.from(logs, "utf8"));
          vscode.window.showInformationMessage("📊 Logs exported successfully");
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Export failed: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.clearLogs", () => {
      logsProvider.clearLogs();
      outputChannel.clear();
      vscode.window.showInformationMessage("🗑 Logs cleared");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.optimizeMemory", async () => {
      try {
        // Trigger garbage collection hint
        if (global.gc) {
          global.gc();
        }
        logsProvider.clearOldLogs();
        vscode.window.showInformationMessage("⚡ Memory optimized");
      } catch (error) {
        vscode.window.showErrorMessage(`Optimization failed: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("tct.refreshDashboard", () => {
      dashboardProvider.refresh();
      controlsProvider.refresh();
      logsProvider.refresh();
    })
  );

  // Auto-start if enabled in settings
  const config = vscode.workspace.getConfiguration("tct");
  if (config.get<boolean>("enableAutoCommit")) {
    autoCommitEngine?.start();
  }

  // Refresh dashboard every 2 seconds
  const refreshInterval = setInterval(() => {
    dashboardProvider.refresh();
  }, 2000);

  context.subscriptions.push({
    dispose: () => clearInterval(refreshInterval),
  });

  console.log("TCT extension fully activated!");
}

export function deactivate() {
  if (autoCommitEngine) {
    autoCommitEngine.stop();
  }
}

function getWebviewContent(engine: AutoCommitEngine | undefined): string {
  const stats = engine?.getStats() || {
    totalCommits: 0,
    totalErrors: 0,
    uptime: "0m",
    memoryUsage: "0MB",
    isRunning: false,
    isPaused: false,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TCT Dashboard</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: var(--vscode-textLink-foreground);
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .card {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 15px;
        }
        .card-title {
            font-size: 12px;
            opacity: 0.7;
            margin-bottom: 5px;
        }
        .card-value {
            font-size: 28px;
            font-weight: bold;
        }
        .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 12px;
            font-weight: bold;
            margin-top: 10px;
        }
        .status.running { background: #6A9955; color: white; }
        .status.paused { background: #CE9178; color: white; }
        .status.stopped { background: #858585; color: white; }
    </style>
</head>
<body>
    <div class="header">📊 TCT Git Automation Dashboard</div>
    <div class="metrics">
        <div class="card">
            <div class="card-title">💾 Total Commits</div>
            <div class="card-value">${stats.totalCommits}</div>
        </div>
        <div class="card">
            <div class="card-title">⚠ Total Errors</div>
            <div class="card-value">${stats.totalErrors}</div>
        </div>
        <div class="card">
            <div class="card-title">⏱ Uptime</div>
            <div class="card-value">${stats.uptime}</div>
        </div>
        <div class="card">
            <div class="card-title">📦 Memory</div>
            <div class="card-value">${stats.memoryUsage}</div>
        </div>
    </div>
    <div class="status ${
      stats.isRunning ? (stats.isPaused ? "paused" : "running") : "stopped"
    }">
        ${
          stats.isRunning
            ? stats.isPaused
              ? "⏸ Paused"
              : "● Running"
            : "⏹ Stopped"
        }
    </div>
</body>
</html>`;
}
