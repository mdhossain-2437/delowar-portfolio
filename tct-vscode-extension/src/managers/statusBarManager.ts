import * as vscode from "vscode";

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.statusBarItem.command = "tct.openDashboard";
    this.statusBarItem.text = "$(circle-outline) TCT: Idle";
    this.statusBarItem.tooltip = "Click to open TCT Dashboard";
    this.statusBarItem.show();
  }

  updateStatus(status: "running" | "paused" | "stopped"): void {
    switch (status) {
      case "running":
        this.statusBarItem.text = "$(play-circle) TCT: Running";
        this.statusBarItem.backgroundColor = undefined;
        break;
      case "paused":
        this.statusBarItem.text = "$(debug-pause) TCT: Paused";
        this.statusBarItem.backgroundColor = new vscode.ThemeColor(
          "statusBarItem.warningBackground"
        );
        break;
      case "stopped":
        this.statusBarItem.text = "$(circle-outline) TCT: Stopped";
        this.statusBarItem.backgroundColor = undefined;
        break;
    }
  }

  updateCommitCount(count: number): void {
    const currentText = this.statusBarItem.text;
    const baseText = currentText.split("|")[0].trim();
    this.statusBarItem.text = `${baseText} | ${count} commits`;
  }

  getStatusBarItem(): vscode.StatusBarItem {
    return this.statusBarItem;
  }
}
