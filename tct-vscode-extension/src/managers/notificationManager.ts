import * as vscode from "vscode";
import axios from "axios";

export class NotificationManager {
  showSuccess(message: string): void {
    vscode.window.showInformationMessage(`✅ ${message}`);
  }

  showError(message: string): void {
    vscode.window.showErrorMessage(`❌ ${message}`);
  }

  showWarning(message: string): void {
    vscode.window.showWarningMessage(`⚠ ${message}`);
  }

  async sendWebhook(webhookUrl: string, data: any): Promise<void> {
    try {
      // Detect webhook type
      if (webhookUrl.includes("discord.com")) {
        await this.sendDiscordWebhook(webhookUrl, data);
      } else if (webhookUrl.includes("slack.com")) {
        await this.sendSlackWebhook(webhookUrl, data);
      } else {
        // Generic webhook
        await axios.post(webhookUrl, data);
      }
    } catch (error) {
      console.error(`Webhook failed: ${error}`);
    }
  }

  private async sendDiscordWebhook(
    webhookUrl: string,
    data: any
  ): Promise<void> {
    const embed = {
      embeds: [
        {
          title: "✅ Auto-Commit Success",
          description: data.message,
          color: 0x00ff00,
          fields: [
            { name: "Branch", value: data.branch, inline: true },
            { name: "Files", value: data.files.toString(), inline: true },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    await axios.post(webhookUrl, embed);
  }

  private async sendSlackWebhook(webhookUrl: string, data: any): Promise<void> {
    const payload = {
      text: `✅ Auto-Commit Success`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${data.message}*`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Branch:*\n${data.branch}`,
            },
            {
              type: "mrkdwn",
              text: `*Files:*\n${data.files}`,
            },
          ],
        },
      ],
    };

    await axios.post(webhookUrl, payload);
  }
}
