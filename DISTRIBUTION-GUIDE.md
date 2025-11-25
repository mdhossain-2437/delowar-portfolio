# TCT Git Auto-Commiter - EXE & Extension Distribution

## 🎉 What You Got!

### 1. **TCTGitAutomation.exe** ✅

- Standalone Windows executable
- No PowerShell window
- Professional with icon and metadata
- Ready to distribute!

### 2. **VS Code Extension** ✅

- Full TypeScript implementation
- All features from PowerShell version
- Modern VS Code UI
- Ready to install or publish!

---

## 📦 Files Created

### EXE Files:

- `TCTGitAutomation.exe` - Main executable (3-5 MB)
- `tct-icon.ico` - Icon file
- `tct-icon.png` - PNG icon
- `create-icon.ps1` - Icon generator script

### Extension Files:

- `tct-vscode-extension/` - Complete extension folder
  - `package.json` - Extension manifest
  - `src/` - TypeScript source code
  - `resources/` - Icons and assets
  - `README.md` - User documentation

---

## 🚀 How to Use the EXE

### Method 1: Double-Click

Just double-click `TCTGitAutomation.exe` - it will open the modern UI!

### Method 2: Run from Terminal

```powershell
.\TCTGitAutomation.exe
```

### Method 3: Add to PATH

1. Move EXE to a permanent location (e.g., `C:\Tools\TCT\`)
2. Add to PATH:
   ```powershell
   $env:Path += ";C:\Tools\TCT"
   [Environment]::SetEnvironmentVariable("Path", $env:Path, "Machine")
   ```
3. Run from anywhere: `TCTGitAutomation`

### Method 4: Create Shortcut

1. Right-click `TCTGitAutomation.exe` → Send to → Desktop
2. Pin to Start Menu or Taskbar

---

## 🔌 How to Install the VS Code Extension

### Option 1: Install from Folder (Easiest)

1. Open VS Code
2. Press `F5` or Run → Start Debugging
3. This opens Extension Development Host with your extension loaded
4. Test all features!

### Option 2: Package and Install

```bash
cd tct-vscode-extension

# Install packaging tool
npm install -g @vscode/vsce

# Package extension
vsce package

# This creates: tct-git-automation-5.0.0.vsix
```

Then install:

1. In VS Code: Extensions view (`Ctrl+Shift+X`)
2. Click `...` (three dots) → Install from VSIX
3. Select `tct-git-automation-5.0.0.vsix`

### Option 3: Development Mode

```bash
cd tct-vscode-extension
npm install
npm run compile
code .
# Press F5 to launch
```

---

## 🎯 Quick Start - EXE

1. **Run** `TCTGitAutomation.exe`
2. **Modern UI appears** with sidebar + dashboard
3. **Click "▶ Start"** button
4. **Watch the terminal log** (green text, black background)
5. **Monitor metrics** in the card dashboard

That's it! Your Git repo is now auto-committing!

---

## 🎯 Quick Start - VS Code Extension

1. **Install extension** (see above)
2. **Open a Git repository** in VS Code
3. **Click TCT icon** in Activity Bar (left sidebar)
4. **Configure AI provider** in settings (optional)
5. **Click "▶ Start Auto-Commit"**

Done! Watch the logs in the Terminal Logs panel.

---

## ⚙️ Configuration (Extension)

Open Settings (`Ctrl+,`) and search for "TCT":

**Must Configure:**

- `tct.geminiApiKey` - Get free key at https://makersuite.google.com/app/apikey
- `tct.autoBranch` - Branch name (default: `dage/auto`)
- `tct.delaySeconds` - Time between checks (default: 60)

**Optional:**

- AI providers (OpenAI, Claude, Ollama)
- Webhook URL (Discord, Slack)
- Commit message template
- Error recovery settings

---

## 📊 Features Comparison

| Feature             | EXE               | Extension     |
| ------------------- | ----------------- | ------------- |
| Auto-Commit         | ✅                | ✅            |
| AI Messages         | ✅                | ✅            |
| Modern UI           | ✅                | ✅            |
| Terminal Log        | ✅ (Hacker style) | ✅ (TreeView) |
| Dashboard           | ✅ (Cards)        | ✅ (Sidebar)  |
| Error Recovery      | ✅                | ✅            |
| Webhooks            | ✅                | ✅            |
| Rollback            | ✅                | ✅            |
| VS Code Integration | ❌                | ✅            |
| Standalone          | ✅                | ❌            |
| Status Bar          | ❌                | ✅            |
| Command Palette     | ❌                | ✅            |

---

## 🎨 UI Features

### EXE Modern UI:

- **Sidebar Navigation** (Dashboard, Settings, API Keys, Analytics, Webhooks, About)
- **Metric Cards** (Commits, Errors, Uptime, Memory)
- **Modern Buttons** (Start, Stop, Rollback, Export, Optimize, Settings, Clear)
- **Hacker Terminal Log** (Black background, green text)
- **VS Code Theme** (Dark professional colors)

### Extension UI:

- **Activity Bar Icon** (TCT logo)
- **Three Sidebar Panels:**
  1. Dashboard - Real-time metrics
  2. Controls - Action buttons
  3. Terminal Logs - Color-coded logs
- **Status Bar Item** (Shows running status)
- **Webview Dashboard** (Full stats page)
- **Native VS Code Design**

---

## 🔧 Troubleshooting

### EXE Issues:

**"Windows protected your PC"**

- Click "More info" → "Run anyway"
- This is normal for unsigned EXE files

**Antivirus blocking**

- Add exception for `TCTGitAutomation.exe`
- PowerShell scripts converted to EXE can trigger false positives

**Modern UI not showing**

- Check if running as Administrator
- Verify Git is installed and in PATH

### Extension Issues:

**Extension won't activate**

- Check VS Code version (must be >= 1.80.0)
- Open Output panel: View → Output → "TCT Git Automation"
- Look for error messages

**"Cannot find module 'vscode'"**

- Run `npm install` in extension folder
- This installs @types/vscode

**Git commands failing**

- Ensure workspace has a Git repository
- Check Git is installed: `git --version`
- Verify you have commit access

---

## 📤 Distribution Options

### EXE Distribution:

1. **Direct sharing** - Just send the `.exe` file
2. **GitHub Release** - Upload to releases page
3. **Website download** - Host on your website
4. **Microsoft Store** - Package as MSIX (advanced)

### Extension Distribution:

1. **VSIX file** - Share the `.vsix` package
2. **VS Code Marketplace** - Publish officially:
   ```bash
   vsce publish
   ```
3. **Private gallery** - Host internally
4. **GitHub** - Share via repository

---

## 🎓 Next Steps

### For EXE:

1. ✅ **Test thoroughly** on different machines
2. 📝 **Get code signing certificate** (optional, $100-500/year)
3. 🚀 **Create GitHub release**
4. 📢 **Announce on social media**

### For Extension:

1. ✅ **Test all commands**
2. 📸 **Take screenshots** for marketplace
3. 📝 **Write CHANGELOG.md**
4. 🌟 **Create demo video** (optional)
5. 🚀 **Publish to marketplace**:
   ```bash
   # Create publisher account first
   vsce login your-publisher-name
   vsce publish
   ```

---

## 🎁 Bonus: Both Working Together!

You can use **BOTH** simultaneously:

- **EXE** for standalone automation (dedicated window)
- **Extension** for VS Code integration (sidebar panel)

They won't conflict - they're independent!

---

## 📧 Support

If you need help:

1. Check the README files
2. Open GitHub issues
3. Email support

---

## 🎉 Congratulations!

You now have:

- ✅ Professional Windows EXE
- ✅ Full-featured VS Code extension
- ✅ Modern UI with hacker terminal
- ✅ AI-powered commits
- ✅ Ready to distribute!

**You're all set! Go automate your Git workflow! 🚀**

---

Made with ❤️ by TCT Studio
