import * as vscode from "vscode";
import simpleGit, { SimpleGit, StatusResult } from "simple-git";

export class GitService {
  private git: SimpleGit | undefined;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      const rootPath = workspaceFolders[0].uri.fsPath;
      this.git = simpleGit(rootPath);
    }
  }

  async hasChanges(): Promise<boolean> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    const status: StatusResult = await this.git.status();
    return !status.isClean();
  }

  async getChangedFiles(): Promise<string[]> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    const status: StatusResult = await this.git.status();
    const files: string[] = [
      ...status.modified,
      ...status.created,
      ...status.deleted,
      ...status.renamed.map((r) => r.to),
    ];

    // Apply exclude patterns
    const config = vscode.workspace.getConfiguration("tct");
    const excludePatterns = config.get<string[]>("excludePatterns", []);

    return files.filter((file) => {
      return !excludePatterns.some((pattern) => file.includes(pattern));
    });
  }

  async getCurrentBranch(): Promise<string> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    const status: StatusResult = await this.git.status();
    return status.current || "unknown";
  }

  async switchBranch(branchName: string): Promise<void> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    try {
      // Check if branch exists
      const branches = await this.git.branch();
      const branchExists = branches.all.includes(branchName);

      if (branchExists) {
        await this.git.checkout(branchName);
      } else {
        // Create and checkout new branch
        await this.git.checkoutLocalBranch(branchName);
      }
    } catch (error) {
      throw new Error(`Failed to switch branch: ${error}`);
    }
  }

  async stageAll(): Promise<void> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    await this.git.add(".");
  }

  async commit(message: string): Promise<void> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    await this.git.commit(message);
  }

  async push(): Promise<void> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    try {
      const currentBranch = await this.getCurrentBranch();
      await this.git.push("origin", currentBranch);
    } catch (error) {
      // If push fails, try to set upstream
      const currentBranch = await this.getCurrentBranch();
      await this.git.push(["-u", "origin", currentBranch]);
    }
  }

  async rollbackLastCommit(): Promise<void> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    // Soft reset to keep changes
    await this.git.reset(["--soft", "HEAD~1"]);
  }

  async getLatestCommits(count: number = 10): Promise<any[]> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    const log = await this.git.log({ maxCount: count });
    return Array.from(log.all);
  }

  async getDiff(): Promise<string> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    return await this.git.diff();
  }

  async getFileContent(filePath: string): Promise<string> {
    if (!this.git) {
      throw new Error("Git not initialized");
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error("No workspace folder");
    }

    const fullPath = vscode.Uri.joinPath(workspaceFolders[0].uri, filePath);
    const content = await vscode.workspace.fs.readFile(fullPath);
    return Buffer.from(content).toString("utf8");
  }
}
