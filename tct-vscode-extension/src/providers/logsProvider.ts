import * as vscode from "vscode";

export class LogsProvider implements vscode.TreeDataProvider<LogItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    LogItem | undefined | null | void
  > = new vscode.EventEmitter<LogItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    LogItem | undefined | null | void
  > = this._onDidChangeTreeData.event;
  private logs: string[] = [];
  private maxLogs: number = 1000;

  constructor(private outputChannel: vscode.OutputChannel) {
    // Register command for logging
    vscode.commands.registerCommand("tct.logMessage", (message: string) => {
      this.addLog(message);
    });
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: LogItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: LogItem): Promise<LogItem[]> {
    if (!element) {
      const recentLogs = this.logs.slice(-50).reverse();
      return Promise.resolve(recentLogs.map((log) => new LogItem(log, log)));
    }
    return Promise.resolve([]);
  }

  addLog(message: string): void {
    this.logs.push(message);
    this.outputChannel.appendLine(message);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.refresh();
  }

  clearLogs(): void {
    this.logs = [];
    this.refresh();
  }

  clearOldLogs(): void {
    if (this.logs.length > this.maxLogs / 2) {
      this.logs = this.logs.slice(-(this.maxLogs / 2));
      this.refresh();
    }
  }

  getAllLogs(): string {
    return this.logs.join("\n");
  }
}

class LogItem extends vscode.TreeItem {
  constructor(public readonly label: string, public readonly tooltip: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = tooltip;

    // Color code based on log level
    if (label.includes("[✓]")) {
      this.iconPath = new vscode.ThemeIcon(
        "check",
        new vscode.ThemeColor("testing.iconPassed")
      );
    } else if (label.includes("[✗]") || label.includes("[!]")) {
      this.iconPath = new vscode.ThemeIcon(
        "error",
        new vscode.ThemeColor("testing.iconFailed")
      );
    } else if (label.includes("[i]")) {
      this.iconPath = new vscode.ThemeIcon(
        "info",
        new vscode.ThemeColor("notificationsInfoIcon.foreground")
      );
    } else if (label.includes("[+]")) {
      this.iconPath = new vscode.ThemeIcon(
        "arrow-right",
        new vscode.ThemeColor("terminal.ansiGreen")
      );
    }
  }
}
