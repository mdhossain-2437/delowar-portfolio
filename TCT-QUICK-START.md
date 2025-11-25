# 🚀 TCT-Git-Auto-Commiter v3.0 - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Run the Script
```powershell
cd "c:\Users\mdhos\Projects\portfolio-up\delowar-portfolio"
powershell -ExecutionPolicy Bypass -File .\TCT-Git-Auto-Commiter.ps1
```

### Step 2: Setup API Key (Choose ONE)

**Option A: Gemini (Recommended - Free)**
1. Click "🔑 API Keys" tab
2. Enter your Gemini API key: `AIzaSyDaOLc6V1EqNpErmwhwUueTMOYriIScJVo` (or get yours from https://makersuite.google.com/app/apikey)
3. Click "💾 Save"

**Option B: OpenAI**
1. Click "🔑 API Keys" tab
2. Enter your OpenAI API key
3. Click "💾 Save"
4. Go to "⚙️ Settings" tab
5. Change "Provider" to `openai`
6. Click "💾 Save All Settings"

**Option C: Ollama (Local, No API Key)**
1. Install Ollama: https://ollama.ai
2. Run: `ollama serve`
3. Go to "⚙️ Settings" tab
4. Change "Provider" to `ollama`
5. Change "Model Name" to `llama2` or `codellama`
6. Click "💾 Save All Settings"

### Step 3: Start Auto-Committing
1. Click "📊 Dashboard" tab
2. Click "▶ Start" button
3. **Done!** The engine will now monitor your repo and create smart commits automatically

## 🎯 What Happens Now?

- **Every 10 seconds**: Script checks for file changes
- **When changes detected**: Waits 2 seconds (cooldown)
- **Then**: Creates AI-generated commit message and commits
- **After 12 commits**: Automatically squashes into one clean commit
- **Weekly**: Creates backup of entire repo

## 🎨 GUI Overview

### 📊 Dashboard Tab
- **Green Status**: Engine running
- **Metrics Panel**: Shows commits, errors, uptime, last commit
- **Activity Log**: Real-time log of all operations
- **Buttons**:
  - ▶ Start: Begin auto-committing
  - ⏹ Stop: Pause engine
  - ↶ Rollback: Undo last commit
  - 📄 Export Log: Save activity history
  - 🎨 Toggle Theme: Switch dark/light
  - 🗑 Clear: Clear log display

### ⚙️ Settings Tab
Configure everything here:
- **Auto Branch Name**: Branch for auto-commits (default: `dage/auto`)
- **Delay**: Time between checks (default: 10s)
- **Cooldown**: Wait before commit (default: 2s)
- **LLM Provider**: Choose `gemini`, `openai`, `claude`, or `ollama`
- **Quiet Hours**: Pause commits during specified times

### 🔑 API Keys Tab
Store your API keys securely:
- Gemini API Key
- OpenAI API Key
- Claude API Key
- Webhook Token
- Remote API Token

## 🔔 System Tray Features

Minimize to tray and use these options:
- **📂 Open Window**: Restore GUI
- **⏹ Stop Engine**: Pause commits
- **▶ Start Engine**: Resume commits
- **⚙️ Settings**: Jump to settings
- **📄 Export Log**: Quick export
- **❌ Exit**: Close application

## 💡 Pro Tips

### Tip 1: Install Start-on-Boot
Want auto-commit to start with Windows?
1. Run PowerShell **as Administrator**
2. Launch the script
3. Click "📅 Install Start-on-Boot" button

### Tip 2: Use Quiet Hours
Don't want commits at night?
1. Go to Settings tab
2. Check "Enable Quiet Hours"
3. Set start time: `22:00`
4. Set end time: `08:00`
5. Save settings

### Tip 3: Enable Webhooks
Get commit notifications in Discord/Slack:
1. Create webhook in Discord/Slack
2. Copy webhook URL
3. Go to Settings tab
4. Check "Enable Webhook Notifications"
5. Paste webhook URL
6. Select type (discord/slack/teams)
7. Save settings

### Tip 4: Rollback Mistakes
Made a bad commit?
1. Click "↶ Rollback" button
2. Confirm dialog
3. Last commit is undone (changes preserved)

### Tip 5: Export Your History
Want to analyze commits?
1. Click "📄 Export Log"
2. Choose JSON or CSV format
3. Save file
4. Open in Excel or analyze programmatically

## ⚙️ Common Configurations

### Fast Mode (for rapid development)
```
Delay: 5 seconds
Cooldown: 1 second
Squash After: 20 commits
```

### Safe Mode (for production)
```
Delay: 30 seconds
Cooldown: 5 seconds
Strict Safe Mode: ON
Squash After: 5 commits
```

### Silent Mode (minimal notifications)
```
Toast Notifications: OFF
Webhook Notifications: OFF
LLM Enabled: OFF (uses heuristic messages)
```

## 🌐 Remote API Usage

Control from another terminal/app:

```powershell
# Set your token
$token = "YOUR_REMOTE_API_TOKEN"

# Get status
curl http://localhost:8701/status

# Pause engine
curl -X POST http://localhost:8701/pause -H "Authorization: Bearer $token"

# Resume engine
curl -X POST http://localhost:8701/resume -H "Authorization: Bearer $token"

# Rollback last commit
Invoke-RestMethod -Uri "http://localhost:8701/rollback" `
  -Method POST `
  -Headers @{"Authorization"="Bearer $token"} `
  -Body (@{"count"=1} | ConvertTo-Json) `
  -ContentType "application/json"
```

## 🐛 Quick Fixes

### Problem: "Script won't run"
**Fix**: Run PowerShell with execution policy bypass:
```powershell
powershell -ExecutionPolicy Bypass -File .\TCT-Git-Auto-Commiter.ps1
```

### Problem: "LLM API error"
**Fix**: 
1. Check API key in 🔑 API Keys tab
2. Test with different provider
3. Disable LLM temporarily (uses smart heuristic messages)

### Problem: "No commits happening"
**Fix**:
1. Check status shows "Running"
2. Make sure files aren't in ignore patterns
3. Verify not in quiet hours
4. Check log for specific errors

### Problem: "Too many commits"
**Fix**:
1. Increase delay (e.g., 30s instead of 10s)
2. Increase cooldown (e.g., 5s instead of 2s)
3. Lower squash threshold (e.g., 5 instead of 12)

## 📋 File Structure

After first run, you'll have:

```
your-repo/
├── TCT-Git-Auto-Commiter.ps1     # Main script
├── tct_config.json                # Your settings
├── tct_autogit.log               # Activity log
├── tct_backups/                  # Weekly backups
│   └── repo_backup_20250112.zip
└── .tct_stop                     # Created when paused
```

## 🎓 Next Steps

1. ✅ **Customize Settings**: Tune delays, branch names, etc.
2. ✅ **Enable Notifications**: Setup webhooks for team awareness
3. ✅ **Export Analytics**: Analyze your commit patterns
4. ✅ **Setup Scheduled Task**: Auto-start on Windows boot
5. ✅ **Explore Remote API**: Control from other scripts/apps

## ❓ Need Help?

- **View Logs**: Check `tct_autogit.log` for detailed errors
- **Check Status**: Look at Dashboard metrics panel
- **Test Settings**: Start/stop engine to test changes
- **Rollback**: Any mistake can be undone with Rollback button

## 🎉 You're Ready!

**TCT-Git-Auto-Commiter v3.0 ULTIMATE** is now running and will:
- ✅ Monitor your files 24/7
- ✅ Create smart AI-generated commit messages
- ✅ Auto-push to remote
- ✅ Create weekly backups
- ✅ Squash commits to keep history clean
- ✅ Notify you of important events
- ✅ Recover from errors automatically

**Happy Coding! 🚀**

---

**Quick Links**:
- Full Documentation: `TCT-UPGRADE-DOCUMENTATION.md`
- Settings Location: `tct_config.json`
- Logs: `tct_autogit.log`
- API Keys: Stored securely in Windows Credential Manager
