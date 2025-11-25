import * as vscode from "vscode";
import { AutoCommitEngine } from "../engine/autoCommitEngine";

export class ControlsProvider implements vscode.TreeDataProvider<ControlItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ControlItem | undefined | null | void
  > = new vscode.EventEmitter<ControlItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ControlItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private engine: AutoCommitEngine) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ControlItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ControlItem): Promise<ControlItem[]> {
    if (!element) {
      const stats = this.engine.getStats();
      const items: ControlItem[] = [];

      if (!stats.isRunning) {
        items.push(
          new ControlItem(
            "▶ Start Auto-Commit",
            "tct.startAutoCommit",
            "Start the auto-commit engine"
          )
        );
      } else if (stats.isPaused) {
        items.push(
          new ControlItem(
            "▶ Resume",
            "tct.pauseAutoCommit",
            "Resume auto-commit"
          )
        );
        items.push(
          new ControlItem("⏹ Stop", "tct.stopAutoCommit", "Stop auto-commit")
        );
      } else {
        items.push(
          new ControlItem("⏸ Pause", "tct.pauseAutoCommit", "Pause auto-commit")
        );
        items.push(
          new ControlItem("⏹ Stop", "tct.stopAutoCommit", "Stop auto-commit")
        );
      }

      items.push(
        new ControlItem(
          "↶ Rollback",
          "tct.rollbackLastCommit",
          "Rollback last commit"
        )
      );
      items.push(
        new ControlItem(
          "📊 Export Logs",
          "tct.exportLogs",
          "Export logs to file"
        )
      );
      items.push(
        new ControlItem("🗑 Clear Logs", "tct.clearLogs", "Clear all logs")
      );
      items.push(
        new ControlItem(
          "⚡ Optimize",
          "tct.optimizeMemory",
          "Optimize memory usage"
        )
      );
      items.push(
        new ControlItem("⚙ Settings", "tct.openSettings", "Open TCT settings")
      );

      return Promise.resolve(items);
    }
    return Promise.resolve([]);
  }
}

class ControlItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly commandId: string,
    public readonly tooltip: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command: commandId,
      title: label,
    };
    this.tooltip = tooltip;
  }
}
