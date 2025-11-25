import * as vscode from "vscode";
import axios from "axios";

export class AIService {
  async generateCommitMessage(files: string[]): Promise<string> {
    const config = vscode.workspace.getConfiguration("tct");
    const provider = config.get<string>("llmProvider", "gemini");

    if (provider === "none") {
      return this.generateSimpleMessage(files);
    }

    try {
      switch (provider) {
        case "gemini":
          return await this.generateWithGemini(files);
        case "openai":
          return await this.generateWithOpenAI(files);
        case "claude":
          return await this.generateWithClaude(files);
        case "ollama":
          return await this.generateWithOllama(files);
        default:
          return this.generateSimpleMessage(files);
      }
    } catch (error) {
      console.error(`AI generation failed: ${error}`);
      return this.generateSimpleMessage(files);
    }
  }

  private async generateWithGemini(files: string[]): Promise<string> {
    const config = vscode.workspace.getConfiguration("tct");
    const apiKey = config.get<string>("geminiApiKey");

    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = this.buildPrompt(files);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.data.candidates[0]?.content?.parts[0]?.text;
    return text ? text.trim() : this.generateSimpleMessage(files);
  }

  private async generateWithOpenAI(files: string[]): Promise<string> {
    const config = vscode.workspace.getConfiguration("tct");
    const apiKey = config.get<string>("openaiApiKey");

    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = this.buildPrompt(files);
    const url = "https://api.openai.com/v1/chat/completions";

    const response = await axios.post(
      url,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates concise git commit messages.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0]?.message?.content;
    return text ? text.trim() : this.generateSimpleMessage(files);
  }

  private async generateWithClaude(files: string[]): Promise<string> {
    const config = vscode.workspace.getConfiguration("tct");
    const apiKey = config.get<string>("claudeApiKey");

    if (!apiKey) {
      throw new Error("Claude API key not configured");
    }

    const prompt = this.buildPrompt(files);
    const url = "https://api.anthropic.com/v1/messages";

    const response = await axios.post(
      url,
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 100,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.content[0]?.text;
    return text ? text.trim() : this.generateSimpleMessage(files);
  }

  private async generateWithOllama(files: string[]): Promise<string> {
    const config = vscode.workspace.getConfiguration("tct");
    const model = config.get<string>("ollamaModel", "llama3.2:latest");

    const prompt = this.buildPrompt(files);
    const url = "http://localhost:11434/api/generate";

    const response = await axios.post(url, {
      model: model,
      prompt: prompt,
      stream: false,
    });

    const text = response.data.response;
    return text ? text.trim() : this.generateSimpleMessage(files);
  }

  private buildPrompt(files: string[]): string {
    const fileList = files.slice(0, 10).join(", ");
    const moreFiles = files.length > 10 ? ` and ${files.length - 10} more` : "";

    return `Generate a concise git commit message (max 50 characters) for these changes:
Files modified: ${fileList}${moreFiles}

Rules:
- Start with a verb (Add, Update, Fix, Remove, Refactor, etc.)
- Be specific but brief
- No period at the end
- Return only the commit message, nothing else

Commit message:`;
  }

  private generateSimpleMessage(files: string[]): string {
    if (files.length === 0) {
      return "Update repository";
    }

    const extensions = new Set(
      files.map((f) => {
        const parts = f.split(".");
        return parts.length > 1 ? parts[parts.length - 1] : "file";
      })
    );

    const fileTypes = Array.from(extensions).slice(0, 3).join(", ");
    const verb = files.some((f) => f.includes("delete"))
      ? "Remove"
      : files.some((f) => f.includes("new") || f.includes("add"))
      ? "Add"
      : "Update";

    if (files.length === 1) {
      return `${verb} ${files[0]}`;
    } else {
      return `${verb} ${files.length} files (${fileTypes})`;
    }
  }
}
