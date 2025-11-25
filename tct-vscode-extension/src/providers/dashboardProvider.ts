import * as vscode from "vscode";
import { AutoCommitEngine } from "../engine/autoCommitEngine";

export class DashboardProvider
  implements vscode.TreeDataProvider<DashboardItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    DashboardItem | undefined | null | void
  > = new vscode.EventEmitter<DashboardItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    DashboardItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private engine: AutoCommitEngine) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DashboardItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: DashboardItem): Thenable<DashboardItem[]> {
    if (!element) {
      const stats = this.engine.getStats();
      return Promise.resolve([
        new DashboardItem(
          "💾 Total Commits",
          stats.totalCommits.toString(),
          vscode.TreeItemCollapsibleState.None
        ),
        new DashboardItem(
          "⚠ Total Errors",
          stats.totalErrors.toString(),
          vscode.TreeItemCollapsibleState.None
        ),
        new DashboardItem(
          "⏱ Uptime",
          stats.uptime,
          vscode.TreeItemCollapsibleState.None
        ),
        new DashboardItem(
          "📦 Memory Usage",
          stats.memoryUsage,
          vscode.TreeItemCollapsibleState.None
        ),
        new DashboardItem(
          "🌿 Current Branch",
          stats.currentBranch || "unknown",
          vscode.TreeItemCollapsibleState.None
        ),
        new DashboardItem(
          "📝 Last Commit",
          stats.lastCommit || "None",
          vscode.TreeItemCollapsibleState.None,
          stats.lastCommit
        ),
      ]);
    }
    return Promise.resolve([]);
  }
}

class DashboardItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly value: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly tooltip?: string
  ) {
    super(label, collapsibleState);
    this.description = value;
    this.tooltip = tooltip || `${label}: ${value}`;
  }
}
