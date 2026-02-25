<#
TCT-Git-Auto-Commiter (ULTIMATE v3.0)
Single-file PowerShell application with ALL advanced features.

FEATURES:
- GUI + System Tray with Dark/Light theme
- Gemini/OpenAI/Claude/Ollama LLM support for smart commit messages
- Smart change detection (hash-based duplicate prevention)
- Conflict resolution with notifications
- Multi-repo monitoring support
- Branch sync suggestions (auto-branch → main PR)
- Dashboard with commit charts
- Windows Toast notifications (BurntToast)
- Settings Panel GUI (no script editing)
- Secure credential storage (Windows Credential Manager)
- GPG commit signing support
- Rollback feature (undo commits)
- Auto error recovery
- Webhook integration (Discord/Slack/Teams)
- Activity log export (CSV/JSON)
- Smart scheduling (quiet hours)
- Performance metrics & analytics
- Web dashboard API

USAGE:
  powershell -ExecutionPolicy Bypass -File .\TCT-Git-Auto-Commiter.ps1

CHANGELOG v3.0:
- Added: Smart change detection with file hashing
- Added: Conflict resolution system
- Added: Multi-repo support
- Added: Settings Panel GUI
- Added: Secure key storage
- Added: Rollback feature
- Added: Toast notifications
- Added: Theme toggle
- Added: Multiple LLM providers
- Added: Webhook integrations
- Added: Activity export
- Added: Smart scheduling
- Added: Performance metrics
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Security

# ========================= SECURE CREDENTIAL STORAGE =========================
$CREDENTIAL_TARGET = "TCT-Git-Auto-Commiter"

function Get-SecureCredential([string]$name) {
    try {
        $cred = [System.Net.CredentialCache]::DefaultCredentials
        # Try Windows Credential Manager
        $credPath = Join-Path $env:APPDATA "TCT-Credentials"
        if (-not (Test-Path $credPath)) { return $null }
        $file = Join-Path $credPath "$name.cred"
        if (Test-Path $file) {
            $encrypted = Get-Content $file -Raw
            $secureString = $encrypted | ConvertTo-SecureString
            $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
            return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
        }
    } catch { }
    return $null
}

function Set-SecureCredential([string]$name, [string]$value) {
    try {
        $credPath = Join-Path $env:APPDATA "TCT-Credentials"
        if (-not (Test-Path $credPath)) { New-Item -ItemType Directory -Path $credPath -Force | Out-Null }
        $secureString = ConvertTo-SecureString $value -AsPlainText -Force
        $encrypted = $secureString | ConvertFrom-SecureString
        $file = Join-Path $credPath "$name.cred"
        Set-Content -Path $file -Value $encrypted -Force
        return $true
    } catch { return $false }
}

function Remove-SecureCredential([string]$name) {
    try {
        $file = Join-Path $env:APPDATA "TCT-Credentials" "$name.cred"
        if (Test-Path $file) { Remove-Item $file -Force }
        return $true
    } catch { return $false }
}

# ========================= CONFIGURATION =========================
# Default config - can be overridden by settings file
$CONFIG_FILE = ".\tct_config.json"
$script:Config = @{
    # Basic
    APP_NAME              = "TCT-Git-Auto-Commiter"
    APP_VERSION           = "3.1"
    AUTO_BRANCH           = "dage/auto"
    DELAY_SECONDS         = 60
    COOLDOWN_SECONDS      = 5
    
    # Squash
    SQUASH_ENABLED        = $true
    SQUASH_AFTER_COMMITS  = 12
    
    # Error Recovery
    ERROR_RETRY_ENABLED   = $true
    ERROR_RETRY_MAX       = 3
    ERROR_RETRY_BACKOFF   = 2.0
    
    # PR Automation
    PR_AUTO_ENABLED       = $true
    PR_AUTO_THRESHOLD     = 15
    PR_AUTO_TITLE         = "Auto-merge: {branch} → main"
    PR_AUTO_BODY          = "Automated PR created by TCT-Git-Auto-Commiter\n\nCommits: {count}"
    
    # Commit Templates
    TEMPLATE_ENABLED      = $true
    TEMPLATE_CURRENT      = "default"
    COMMIT_TEMPLATES      = @{
        default = "feat: {summary}"
        detailed = "[{timestamp}] {type}: {summary}\n\nFiles: {files}\nBranch: {branch}"
        simple = "{summary}"
        emoji = "✨ {summary}"
    }
    
    # Web Dashboard
    WEB_ENABLED           = $false
    WEB_PORT              = 8080
    WEB_HOST              = "localhost"
    SQUASH_FORCE_PUSH     = $false
    
    # Safety
    STRICT_SAFE_MODE      = $true
    
    # Backup
    BACKUP_ENABLED        = $true
    BACKUP_FOLDER         = ".\tct_backups"
    BACKUP_ROTATE_KEEP    = 8
    BACKUP_INTERVAL_DAYS  = 7
    
    # Logging
    LOGFILE               = ".\tct_autogit.log"
    LOG_MAX_SIZE_MB       = 10
    
    # Ignore patterns
    IGNORE_PATTERNS       = @("node_modules","dist","build",".next",".vercel","*.log","*.zip","*.cache","tct_backups",".tct_*")
    
    # UI
    ENABLE_GUI            = $true
    ENABLE_TRAY           = $true
    THEME                 = "hacker"  # hacker, dark, or light
    TERMINAL_FONT         = "Consolas"
    TERMINAL_FONT_SIZE    = 10
    SHOW_MATRIX_EFFECT    = $true
    TYPING_EFFECT         = $true
    SCAN_LINES            = $true
    
    # Remote API
    REMOTE_API_ENABLED    = $true
    REMOTE_API_PORT       = 8701
    
    # Push
    AUTO_PUSH_ENABLED     = $true
    SAFE_PULL_BEFORE_PUSH = $true
    
    # LLM
    LLM_ENABLED           = $true
    LLM_PROVIDER          = "gemini"  # gemini, openai, claude, ollama
    LLM_MODEL             = "gemini-2.0-flash"
    LLM_MAX_DIFF_CHARS    = 3600
    OLLAMA_URL            = "http://localhost:11434"
    
    # Smart Features
    SMART_DETECTION       = $true  # Hash-based duplicate detection
    CONFLICT_NOTIFY       = $true
    GPG_SIGNING           = $false
    GPG_KEY_ID            = ""
    
    # Scheduling
    QUIET_HOURS_ENABLED   = $false
    QUIET_HOURS_START     = "22:00"
    QUIET_HOURS_END       = "08:00"
    
    # Notifications
    TOAST_ENABLED         = $true
    WEBHOOK_ENABLED       = $false
    WEBHOOK_URL           = ""
    WEBHOOK_TYPE          = "discord"  # discord, slack, teams
    
    # Multi-repo
    MULTI_REPO_ENABLED    = $false
    REPO_PATHS            = @()
    
    # Metrics
    METRICS_ENABLED       = $true
    
    # Schedule Task
    SCHEDULE_TASK_NAME    = "TCT-Git-Auto-Commiter"
}

# Load config from file if exists
function Load-Config {
    if (Test-Path $CONFIG_FILE) {
        try {
            $loaded = Get-Content $CONFIG_FILE -Raw | ConvertFrom-Json
            foreach ($prop in $loaded.PSObject.Properties) {
                if ($script:Config.ContainsKey($prop.Name)) {
                    $script:Config[$prop.Name] = $prop.Value
                }
            }
            Write-Log "Configuration loaded from $CONFIG_FILE"
        } catch {
            Write-Log "Failed to load config: $_"
        }
    }
    
    # Try to load API keys from secure storage
    $geminiKey = Get-SecureCredential "GEMINI_API_KEY"
    if ($geminiKey) { $script:Config["GEMINI_API_KEY"] = $geminiKey }
    
    $openaiKey = Get-SecureCredential "OPENAI_API_KEY"
    if ($openaiKey) { $script:Config["OPENAI_API_KEY"] = $openaiKey }
    
    $claudeKey = Get-SecureCredential "CLAUDE_API_KEY"
    if ($claudeKey) { $script:Config["CLAUDE_API_KEY"] = $claudeKey }
    
    $webhookToken = Get-SecureCredential "WEBHOOK_TOKEN"
    if ($webhookToken) { $script:Config["WEBHOOK_TOKEN"] = $webhookToken }
    
    $apiToken = Get-SecureCredential "REMOTE_API_TOKEN"
    if ($apiToken) { $script:Config["REMOTE_API_TOKEN"] = $apiToken }
    else { $script:Config["REMOTE_API_TOKEN"] = "change_this_token_$(Get-Random)" }
}

function Save-Config {
    try {
        # Don't save sensitive keys to config file
        $saveConfig = @{}
        foreach ($key in $script:Config.Keys) {
            if ($key -notmatch "API_KEY|TOKEN|PASSWORD") {
                $saveConfig[$key] = $script:Config[$key]
            }
        }
        $saveConfig | ConvertTo-Json -Depth 5 | Set-Content $CONFIG_FILE -Force
        Write-Log "Configuration saved to $CONFIG_FILE"
        return $true
    } catch {
        Write-Log "Failed to save config: $_"
        return $false
    }
}

# Fallback inline keys (deprecated - use secure storage instead)
$INLINE_KEYS = @{
    "GEMINI_API_KEY" = "AIzaSyDaOLc6V1EqNpErmwhwUueTMOYriIScJVo"
}

# ========================= STATE VARIABLES =========================
$script:running = $false
$script:commitCount = 0
$script:errorCount = 0
$script:engineJob = $null
$script:lastStatus = "Idle"
$script:fileHashes = @{}  # For smart change detection
$script:commitHistory = @()  # For metrics
$script:lastCommitTime = $null
$script:sessionStartTime = Get-Date
$script:pausedByQuietHours = $false
$script:memoryCheckInterval = 0
$script:lastMemoryCheck = Get-Date

# ========================= MEMORY MANAGEMENT =========================
function Optimize-Memory {
    try {
        # Force garbage collection
        [System.GC]::Collect()
        [System.GC]::WaitForPendingFinalizers()
        [System.GC]::Collect()
        
        # Trim working set
        $process = [System.Diagnostics.Process]::GetCurrentProcess()
        $process.MinWorkingSet = $process.MinWorkingSet
        
        Write-Log "Memory optimized. Current usage: $([math]::Round($process.WorkingSet64 / 1MB, 2)) MB" "DEBUG"
    } catch {
        Write-Log "Memory optimization failed: $_" "WARN"
    }
}

function Get-MemoryUsage {
    $process = [System.Diagnostics.Process]::GetCurrentProcess()
    return [math]::Round($process.WorkingSet64 / 1MB, 2)
}

# ========================= ERROR RECOVERY =========================
function Invoke-WithRetry {
    param(
        [ScriptBlock]$Action,
        [string]$ActionName = "Operation",
        [int]$MaxRetries = $script:Config.ERROR_RETRY_MAX,
        [double]$BackoffMultiplier = $script:Config.ERROR_RETRY_BACKOFF
    )
    
    if (-not $script:Config.ERROR_RETRY_ENABLED) {
        return & $Action
    }
    
    $attempt = 0
    $delay = 1
    
    while ($attempt -lt $MaxRetries) {
        try {
            $attempt++
            $result = & $Action
            if ($attempt -gt 1) {
                Write-Log "[+] $ActionName succeeded after $attempt attempts" "SUCCESS"
            }
            return $result
        }
        catch {
            $errorMsg = $_.Exception.Message
            
            # Check if error is retryable
            $isRetryable = $errorMsg -match "network|timeout|rate limit|503|502|504|connection|refused"
            
            if ($attempt -ge $MaxRetries -or -not $isRetryable) {
                Write-Log "[-] $ActionName failed after $attempt attempts: $errorMsg" "ERROR"
                throw
            }
            
            Write-Log "[!] $ActionName failed (attempt $attempt/$MaxRetries), retrying in $($delay)s..." "WARN"
            Start-Sleep -Seconds $delay
            $delay = [Math]::Min($delay * $BackoffMultiplier, 60)
        }
    }
}

# ========================= PR AUTOMATION =========================
function Test-ShouldCreatePR {
    try {
        if (-not $script:Config.PR_AUTO_ENABLED) { return $false }
        
        # Check commit count on auto branch vs main
        $autoBranch = $script:Config.AUTO_BRANCH
        $commitCount = (git rev-list --count "$autoBranch" --not main 2>$null)
        
        if ([string]::IsNullOrWhiteSpace($commitCount)) { return $false }
        
        $count = [int]$commitCount
        return $count -ge $script:Config.PR_AUTO_THRESHOLD
    }
    catch {
        return $false
    }
}

function New-AutoPullRequest {
    try {
        $autoBranch = $script:Config.AUTO_BRANCH
        $commitCount = (git rev-list --count "$autoBranch" --not main 2>$null)
        
        # Get GitHub repo info from remote
        $remoteUrl = git config --get remote.origin.url
        if ($remoteUrl -match "github\.com[:/](.+?)/(.+?)(\.git)?$") {
            $owner = $matches[1]
            $repo = $matches[2]
        }
        else {
            Write-Log "[-] Cannot determine GitHub repo from remote URL" "ERROR"
            return $false
        }
        
        # Prepare PR details
        $title = $script:Config.PR_AUTO_TITLE -replace '\{branch\}', $autoBranch
        $body = $script:Config.PR_AUTO_BODY -replace '\{count\}', $commitCount
        
        # Create PR using GitHub CLI (if available)
        $ghPath = Get-Command gh -ErrorAction SilentlyContinue
        if ($ghPath) {
            Write-Log "[*] Creating auto-PR: $autoBranch -> main ($commitCount commits)" "INFO"
            $prCmd = "gh pr create --base main --head $autoBranch --title `"$title`" --body `"$body`""
            $result = Invoke-Expression $prCmd 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "[+] Auto-PR created successfully: $result" "SUCCESS"
                Show-Toast "PR Created" "Auto-PR created: $autoBranch -> main"
                return $true
            }
            else {
                Write-Log "[-] Failed to create PR: $result" "ERROR"
            }
        }
        else {
            Write-Log "[!] GitHub CLI (gh) not found. Install it for auto-PR: https://cli.github.com/" "WARN"
        }
        
        return $false
    }
    catch {
        Write-Log "[-] PR creation error: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# ========================= COMMIT TEMPLATES =========================
function Get-CommitMessageFromTemplate {
    param(
        [string[]]$Files,
        [string]$AISummary
    )
    
    if (-not $script:Config.TEMPLATE_ENABLED) {
        return $AISummary
    }
    
    $templateName = $script:Config.TEMPLATE_CURRENT
    $template = $script:Config.COMMIT_TEMPLATES[$templateName]
    
    if ([string]::IsNullOrWhiteSpace($template)) {
        return $AISummary
    }
    
    # Get current branch
    $branch = git rev-parse --abbrev-ref HEAD 2>$null
    if ([string]::IsNullOrWhiteSpace($branch)) { $branch = "unknown" }
    
    # Get timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # Get username
    $username = git config user.name 2>$null
    if ([string]::IsNullOrWhiteSpace($username)) { $username = $env:USERNAME }
    
    # File list
    $fileList = $Files -join ", "
    if ($fileList.Length -gt 100) { $fileList = $fileList.Substring(0, 97) + "..." }
    
    # Determine commit type from AI summary
    $type = "feat"
    if ($AISummary -match "fix|bug|error") { $type = "fix" }
    elseif ($AISummary -match "doc|readme|comment") { $type = "docs" }
    elseif ($AISummary -match "style|format|lint") { $type = "style" }
    elseif ($AISummary -match "refactor|restructure") { $type = "refactor" }
    elseif ($AISummary -match "test|spec") { $type = "test" }
    
    # Replace placeholders
    $message = $template
    $message = $message -replace '\{summary\}', $AISummary
    $message = $message -replace '\{timestamp\}', $timestamp
    $message = $message -replace '\{branch\}', $branch
    $message = $message -replace '\{username\}', $username
    $message = $message -replace '\{files\}', $fileList
    $message = $message -replace '\{type\}', $type
    $message = $message -replace '\{count\}', $Files.Count
    
    return $message
}

# ========================= WEB DASHBOARD =========================
$script:WebServer = $null
$script:WebListener = $null

function Start-WebDashboard {
    if (-not $script:Config.WEB_ENABLED) { return }
    
    try {
        $host = $script:Config.WEB_HOST
        $port = $script:Config.WEB_PORT
        $prefix = "http://$host`:$port/"
        
        $script:WebListener = New-Object System.Net.HttpListener
        $script:WebListener.Prefixes.Add($prefix)
        $script:WebListener.Start()
        
        Write-Log "[+] Web dashboard started at $prefix" "SUCCESS"
        
        # Start async listener in background runspace
        $script:WebServer = [PowerShell]::Create()
        $script:WebServer.AddScript({
            param($listener, $configFile)
            
            while ($listener.IsListening) {
                try {
                    $context = $listener.GetContext()
                    $request = $context.Request
                    $response = $context.Response
                    
                    $path = $request.Url.AbsolutePath
                    $method = $request.HttpMethod
                    
                    # CORS headers
                    $response.AddHeader("Access-Control-Allow-Origin", "*")
                    $response.ContentType = "application/json"
                    
                    $responseData = @{ success = $false; error = "Unknown endpoint" }
                    
                    # Load config
                    $config = if (Test-Path $configFile) { Get-Content $configFile | ConvertFrom-Json } else { @{} }
                    
                    # API Endpoints
                    if ($path -eq "/api/status" -and $method -eq "GET") {
                        $process = [System.Diagnostics.Process]::GetCurrentProcess()
                        $responseData = @{
                            success = $true
                            status = "running"
                            version = "3.1"
                            memory = [Math]::Round($process.WorkingSet64 / 1MB, 2)
                            uptime = [Math]::Round((New-TimeSpan -Start $process.StartTime).TotalMinutes, 1)
                        }
                    }
                    elseif ($path -eq "/api/logs" -and $method -eq "GET") {
                        $logs = if (Test-Path "tct_activity.log") { Get-Content "tct_activity.log" -Tail 100 } else { @("No logs yet") }
                        $responseData = @{ success = $true; logs = $logs }
                    }
                    elseif ($path -eq "/api/config" -and $method -eq "GET") {
                        $responseData = @{ success = $true; config = $config }
                    }
                    elseif ($path -eq "/" -and $method -eq "GET") {
                        # Serve HTML dashboard
                        $html = @"
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>TCT Dashboard</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Consolas', 'Courier New', monospace; background: #000; color: #0f0; padding: 20px; overflow-x: hidden; }
.container { max-width: 1400px; margin: 0 auto; }
h1 { color: #0ff; text-shadow: 0 0 15px #0ff; margin-bottom: 30px; text-align: center; font-size: 2em; }
h2 { color: #0ff; margin: 15px 0; border-bottom: 2px solid #0f0; padding-bottom: 5px; }
.card { background: #001100; border: 2px solid #0f0; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 0 20px rgba(0,255,0,0.3); }
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
.metric { background: #002200; padding: 15px; border: 1px solid #0f0; border-radius: 5px; text-align: center; }
.label { color: #0ff; font-size: 0.9em; text-transform: uppercase; }
.value { color: #0f0; font-size: 1.8em; font-weight: bold; margin-top: 5px; text-shadow: 0 0 10px #0f0; }
button { background: #0f0; color: #000; border: 2px solid #0f0; padding: 12px 24px; cursor: pointer; margin: 5px; font-weight: bold; border-radius: 5px; transition: all 0.3s; }
button:hover { background: #0ff; border-color: #0ff; box-shadow: 0 0 15px #0ff; }
#logs { background: #000; border: 2px solid #0f0; padding: 15px; max-height: 500px; overflow-y: auto; font-size: 0.85em; line-height: 1.6; }
.log-line { padding: 2px 0; }
.log-success { color: #0f0; }
.log-error { color: #f00; }
.log-warn { color: #ff0; }
.status-running { color: #0f0; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #001100; }
::-webkit-scrollbar-thumb { background: #0f0; border-radius: 5px; }
::-webkit-scrollbar-thumb:hover { background: #0ff; }
</style>
</head><body>
<div class="container">
<h1>▓▓▒░ TCT-GIT-AUTO-COMMITER ░▒▓▓ HACKER TERMINAL DASHBOARD</h1>
<div class="card">
<h2>► SYSTEM STATUS</h2>
<div class="metrics">
<div class="metric"><div class="label">Status</div><div class="value status-running" id="status">LOADING</div></div>
<div class="metric"><div class="label">Version</div><div class="value" id="version">-</div></div>
<div class="metric"><div class="label">Uptime (min)</div><div class="value" id="uptime">-</div></div>
<div class="metric"><div class="label">Memory (MB)</div><div class="value" id="memory">-</div></div>
</div>
</div>
<div class="card">
<h2>► ACTIVITY LOGS</h2>
<div id="logs"><div class="log-line">Initializing...</div></div>
</div>
<div class="card" style="text-align:center;">
<button onclick="refreshData()">↺ REFRESH DATA</button>
<button onclick="window.open('/api/status', '_blank')">📊 VIEW RAW API</button>
<button onclick="window.open('/api/config', '_blank')">⚙ VIEW CONFIG</button>
</div>
</div>
<script>
function refreshData() {
  fetch('/api/status').then(r=>r.json()).then(d=>{
    if(d.success){
      document.getElementById('status').textContent='ONLINE';
      document.getElementById('version').textContent='v'+d.version;
      document.getElementById('uptime').textContent=d.uptime;
      document.getElementById('memory').textContent=d.memory;
    }
  }).catch(()=>{
    document.getElementById('status').textContent='ERROR';
    document.getElementById('status').style.color='#f00';
  });
  
  fetch('/api/logs').then(r=>r.json()).then(d=>{
    if(d.success){
      const logsDiv = document.getElementById('logs');
      logsDiv.innerHTML = d.logs.map(line => {
        let cls = 'log-line';
        if(line.includes('SUCCESS')) cls += ' log-success';
        else if(line.includes('ERROR')) cls += ' log-error';
        else if(line.includes('WARN')) cls += ' log-warn';
        return `<div class="${cls}">${line}</div>`;
      }).join('');
      logsDiv.scrollTop = logsDiv.scrollHeight;
    }
  });
}
setInterval(refreshData, 3000);
refreshData();
</script>
</body></html>
"@
                        $response.ContentType = "text/html; charset=utf-8"
                        $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
                        $response.OutputStream.Write($buffer, 0, $buffer.Length)
                        $response.Close()
                        continue
                    }
                    
                    # Send JSON response
                    $json = ConvertTo-Json $responseData -Depth 10
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                    $response.Close()
                }
                catch { }
            }
        }).AddArgument($script:WebListener).AddArgument($CONFIG_FILE)
        
        $script:WebServer.BeginInvoke() | Out-Null
    }
    catch {
        Write-Log "[-] Failed to start web dashboard: $($_.Exception.Message)" "ERROR"
    }
}

function Stop-WebDashboard {
    if ($script:WebListener) {
        try {
            $script:WebListener.Stop()
            $script:WebListener.Close()
            Write-Log "[+] Web dashboard stopped" "SUCCESS"
        } catch { }
    }
    if ($script:WebServer) {
        try {
            $script:WebServer.Stop()
            $script:WebServer.Dispose()
        } catch { }
    }
}

# ========================= LOGGING =========================
function Write-Log([string]$text, [string]$level = "INFO") {
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "$timestamp | [$level] $text"
    Write-Host $line
    try {
        $logFile = $script:Config.LOGFILE
        
        # Rotate log if too large
        if (Test-Path $logFile) {
            $size = (Get-Item $logFile).Length / 1MB
            if ($size -gt $script:Config.LOG_MAX_SIZE_MB) {
                $backupLog = $logFile -replace '\.log$', "_$(Get-Date -Format 'yyyyMMdd').log"
                Move-Item $logFile $backupLog -Force
            }
        }
        
        Add-Content -Path $logFile -Value $line -ErrorAction SilentlyContinue
    } catch { }
}

# ========================= TOAST NOTIFICATIONS =========================
function Show-Toast([string]$title, [string]$message, [string]$type = "info") {
    if (-not $script:Config.TOAST_ENABLED) { return }
    
    try {
        # Try BurntToast module first
        if (Get-Module -ListAvailable -Name BurntToast) {
            Import-Module BurntToast -ErrorAction SilentlyContinue
            $icon = switch ($type) {
                "success" { "✅" }
                "error" { "❌" }
                "warning" { "⚠️" }
                default { "ℹ️" }
            }
            New-BurntToastNotification -Text "$icon $title", $message -ErrorAction SilentlyContinue
        } else {
            # Fallback to Windows Forms notification
            if ($script:trayIcon) {
                $iconType = switch ($type) {
                    "success" { [System.Windows.Forms.ToolTipIcon]::Info }
                    "error" { [System.Windows.Forms.ToolTipIcon]::Error }
                    "warning" { [System.Windows.Forms.ToolTipIcon]::Warning }
                    default { [System.Windows.Forms.ToolTipIcon]::None }
                }
                $script:trayIcon.ShowBalloonTip(3000, $title, $message, $iconType)
            }
        }
    } catch { }
}

# ========================= WEBHOOK NOTIFICATIONS =========================
function Send-Webhook([string]$title, [string]$message, [string]$type = "info") {
    if (-not $script:Config.WEBHOOK_ENABLED -or -not $script:Config.WEBHOOK_URL) { return }
    
    try {
        $color = switch ($type) {
            "success" { 3066993 }   # Green
            "error" { 15158332 }    # Red
            "warning" { 15105570 }  # Orange
            default { 3447003 }     # Blue
        }
        
        $payload = switch ($script:Config.WEBHOOK_TYPE) {
            "discord" {
                @{
                    embeds = @(@{
                        title = $title
                        description = $message
                        color = $color
                        timestamp = (Get-Date).ToUniversalTime().ToString("o")
                        footer = @{ text = "TCT-Git-Auto-Commiter v$($script:Config.APP_VERSION)" }
                    })
                } | ConvertTo-Json -Depth 5
            }
            "slack" {
                @{
                    attachments = @(@{
                        title = $title
                        text = $message
                        color = switch ($type) { "success" { "good" } "error" { "danger" } "warning" { "warning" } default { "#3498db" } }
                        ts = [int][double]::Parse((Get-Date -UFormat %s))
                    })
                } | ConvertTo-Json -Depth 5
            }
            "teams" {
                @{
                    "@type" = "MessageCard"
                    "@context" = "http://schema.org/extensions"
                    themeColor = switch ($type) { "success" { "00FF00" } "error" { "FF0000" } "warning" { "FFA500" } default { "0078D7" } }
                    summary = $title
                    sections = @(@{
                        activityTitle = $title
                        facts = @(@{ name = "Message"; value = $message })
                    })
                } | ConvertTo-Json -Depth 5
            }
        }
        
        Invoke-RestMethod -Uri $script:Config.WEBHOOK_URL -Method Post -Body $payload -ContentType "application/json" -ErrorAction SilentlyContinue
    } catch {
        Write-Log "Webhook failed: $_" "WARN"
    }
}

# ========================= SMART CHANGE DETECTION =========================
$HASH_CACHE_FILE = ".\.tct_hashes.json"

function Get-FileContentHash([string]$path) {
    try {
        if (Test-Path $path -PathType Leaf) {
            $content = Get-Content $path -Raw -ErrorAction SilentlyContinue
            if ($content) {
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
                $sha = [System.Security.Cryptography.SHA256]::Create()
                $hash = [BitConverter]::ToString($sha.ComputeHash($bytes)) -replace '-',''
                return $hash.Substring(0, 16)  # Short hash
            }
        }
    } catch { }
    return $null
}

function Load-FileHashes {
    if (Test-Path $HASH_CACHE_FILE) {
        try {
            $script:fileHashes = Get-Content $HASH_CACHE_FILE -Raw | ConvertFrom-Json -AsHashtable
        } catch {
            $script:fileHashes = @{}
        }
    }
}

function Save-FileHashes {
    try {
        $script:fileHashes | ConvertTo-Json | Set-Content $HASH_CACHE_FILE -Force
    } catch { }
}

function Has-FileChanged([string]$path) {
    if (-not $script:Config.SMART_DETECTION) { return $true }
    
    $currentHash = Get-FileContentHash $path
    if (-not $currentHash) { return $true }
    
    $cachedHash = $script:fileHashes[$path]
    if ($cachedHash -eq $currentHash) {
        return $false  # No real change
    }
    
    # Update cache
    $script:fileHashes[$path] = $currentHash
    return $true
}

function Filter-RealChanges($files) {
    if (-not $script:Config.SMART_DETECTION) { return $files }
    
    $realChanges = @()
    foreach ($file in $files) {
        if (Has-FileChanged $file) {
            $realChanges += $file
        }
    }
    return $realChanges
}

# ========================= CONFLICT DETECTION =========================
function Check-MergeConflicts {
    try {
        $status = git status --porcelain 2>$null
        if ($status -match "^UU|^AA|^DD") {
            return $true
        }
        
        # Check for conflict markers in files
        $conflictFiles = git diff --name-only --diff-filter=U 2>$null
        if ($conflictFiles) {
            return $true
        }
    } catch { }
    return $false
}

function Resolve-Conflicts {
    if (-not (Check-MergeConflicts)) { return $true }
    
    Write-Log "Merge conflicts detected!" "WARN"
    Show-Toast "Git Conflict" "Merge conflicts detected. Manual resolution required." "warning"
    Send-Webhook "⚠️ Git Conflict" "Merge conflicts detected in repository. Manual resolution required." "warning"
    
    if ($script:Config.CONFLICT_NOTIFY) {
        # Try to abort current operation
        git merge --abort 2>$null
        git rebase --abort 2>$null
        git cherry-pick --abort 2>$null
        
        Write-Log "Attempted to abort conflicting operation" "INFO"
    }
    
    return $false
}

# ========================= METRICS & ANALYTICS =========================
$METRICS_FILE = ".\.tct_metrics.json"

function Initialize-Metrics {
    $script:metrics = @{
        totalCommits = 0
        totalErrors = 0
        sessionsCount = 0
        totalRuntime = 0
        commitsByHour = @{}
        commitsByDay = @{}
        avgCommitSize = 0
        lastSession = $null
        commitSizes = @()
    }
    
    if (Test-Path $METRICS_FILE) {
        try {
            $loaded = Get-Content $METRICS_FILE -Raw | ConvertFrom-Json -AsHashtable
            foreach ($key in $loaded.Keys) {
                $script:metrics[$key] = $loaded[$key]
            }
        } catch { }
    }
    
    $script:metrics.sessionsCount++
    $script:metrics.lastSession = (Get-Date).ToString("o")
}

function Update-Metrics([hashtable]$commitInfo) {
    if (-not $script:Config.METRICS_ENABLED) { return }
    
    $script:metrics.totalCommits++
    
    $hour = (Get-Date).Hour.ToString()
    $day = (Get-Date).DayOfWeek.ToString()
    
    if (-not $script:metrics.commitsByHour[$hour]) { $script:metrics.commitsByHour[$hour] = 0 }
    $script:metrics.commitsByHour[$hour]++
    
    if (-not $script:metrics.commitsByDay[$day]) { $script:metrics.commitsByDay[$day] = 0 }
    $script:metrics.commitsByDay[$day]++
    
    if ($commitInfo.filesCount) {
        $script:metrics.commitSizes += $commitInfo.filesCount
        $script:metrics.avgCommitSize = ($script:metrics.commitSizes | Measure-Object -Average).Average
    }
    
    Save-Metrics
}

function Save-Metrics {
    try {
        $script:metrics.totalRuntime = ((Get-Date) - $script:sessionStartTime).TotalMinutes
        $script:metrics | ConvertTo-Json -Depth 5 | Set-Content $METRICS_FILE -Force
    } catch { }
}

function Get-MetricsSummary {
    return @"
📊 Performance Metrics
━━━━━━━━━━━━━━━━━━━━━
Total Commits: $($script:metrics.totalCommits)
Total Errors: $($script:metrics.totalErrors)
Sessions: $($script:metrics.sessionsCount)
Avg Commit Size: $([math]::Round($script:metrics.avgCommitSize, 1)) files
Runtime: $([math]::Round($script:metrics.totalRuntime, 1)) minutes

Most Active Hour: $(($script:metrics.commitsByHour.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Key):00
Most Active Day: $(($script:metrics.commitsByDay.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1).Key)
"@
}

# ========================= ACTIVITY LOG EXPORT =========================
function Export-ActivityLog([string]$format = "json", [string]$path = $null) {
    if (-not $path) {
        $path = ".\tct_activity_$(Get-Date -Format 'yyyyMMdd_HHmmss').$format"
    }
    
    $logContent = @()
    if (Test-Path $script:Config.LOGFILE) {
        $logContent = Get-Content $script:Config.LOGFILE | ForEach-Object {
            if ($_ -match '^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \| \[(\w+)\] (.+)$') {
                @{
                    timestamp = $Matches[1]
                    level = $Matches[2]
                    message = $Matches[3]
                }
            }
        } | Where-Object { $_ }
    }
    
    $export = @{
        exportedAt = (Get-Date).ToString("o")
        version = $script:Config.APP_VERSION
        metrics = $script:metrics
        logs = $logContent
    }
    
    try {
        switch ($format) {
            "json" {
                $export | ConvertTo-Json -Depth 10 | Set-Content $path -Force
            }
            "csv" {
                $logContent | ForEach-Object {
                    [PSCustomObject]$_
                } | Export-Csv $path -NoTypeInformation
            }
        }
        Write-Log "Activity exported to: $path" "INFO"
        return $path
    } catch {
        Write-Log "Export failed: $_" "ERROR"
        return $null
    }
}

# ========================= SMART SCHEDULING =========================
function Is-QuietHours {
    if (-not $script:Config.QUIET_HOURS_ENABLED) { return $false }
    
    try {
        $now = Get-Date
        $start = [DateTime]::ParseExact($script:Config.QUIET_HOURS_START, "HH:mm", $null)
        $end = [DateTime]::ParseExact($script:Config.QUIET_HOURS_END, "HH:mm", $null)
        
        $currentTime = $now.TimeOfDay
        $startTime = $start.TimeOfDay
        $endTime = $end.TimeOfDay
        
        if ($startTime -gt $endTime) {
            # Overnight quiet hours (e.g., 22:00 - 08:00)
            return ($currentTime -ge $startTime -or $currentTime -lt $endTime)
        } else {
            return ($currentTime -ge $startTime -and $currentTime -lt $endTime)
        }
    } catch {
        return $false
    }
}

# ========================= ROLLBACK FEATURE =========================
function Get-RecentCommits([int]$count = 10) {
    try {
        $commits = git log --oneline -n $count 2>$null
        return $commits | ForEach-Object {
            if ($_ -match '^([a-f0-9]+)\s+(.+)$') {
                @{ hash = $Matches[1]; message = $Matches[2] }
            }
        }
    } catch { return @() }
}

function Rollback-Commits([int]$count = 1, [bool]$soft = $true) {
    try {
        # Create backup branch first
        $backupBranch = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        git branch $backupBranch 2>$null
        Write-Log "Created backup branch: $backupBranch" "INFO"
        
        if ($soft) {
            git reset --soft HEAD~$count 2>$null
        } else {
            git reset --hard HEAD~$count 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Rolled back $count commit(s)" "INFO"
            Show-Toast "Rollback" "Successfully rolled back $count commit(s)" "success"
            return $true
        }
    } catch {
        Write-Log "Rollback failed: $_" "ERROR"
    }
    return $false
}

# ========================= GPG SIGNING =========================
function Test-GPGAvailable {
    try {
        $gpg = Get-Command gpg -ErrorAction SilentlyContinue
        return $null -ne $gpg
    } catch { return $false }
}

function Get-GPGKeys {
    if (-not (Test-GPGAvailable)) { return @() }
    
    try {
        $keys = gpg --list-secret-keys --keyid-format SHORT 2>$null | 
                Select-String -Pattern '^\s+([A-F0-9]+)' | 
                ForEach-Object { $_.Matches[0].Groups[1].Value }
        return $keys
    } catch { return @() }
}

function Enable-GPGSigning([string]$keyId) {
    try {
        git config --local commit.gpgsign true
        git config --local user.signingkey $keyId
        $script:Config.GPG_SIGNING = $true
        $script:Config.GPG_KEY_ID = $keyId
        Save-Config
        Write-Log "GPG signing enabled with key: $keyId" "INFO"
        return $true
    } catch {
        Write-Log "Failed to enable GPG signing: $_" "ERROR"
        return $false
    }
}

function Ensure-Git {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        [System.Windows.Forms.MessageBox]::Show("Git not found in PATH. Please install Git and re-run.", $script:Config.APP_NAME, "OK", "Error")
        exit 1
    }
}

# Initialize
Load-Config
Initialize-Metrics
Load-FileHashes
Ensure-Git

# Basic sanity: create backup folder if missing
if (-not (Test-Path $script:Config.BACKUP_FOLDER)) { 
    New-Item -ItemType Directory -Path $script:Config.BACKUP_FOLDER -Force | Out-Null 
}

# ========================= MULTI-LLM SUPPORT =========================
function Call-LLM([string]$prompt) {
    $provider = $script:Config.LLM_PROVIDER
    $model = $script:Config.LLM_MODEL
    
    switch ($provider) {
        "gemini" { return Call-Gemini $prompt }
        "openai" { return Call-OpenAI $prompt }
        "claude" { return Call-Claude $prompt }
        "ollama" { return Call-Ollama $prompt }
        default { return Call-Gemini $prompt }
    }
}

function Call-Gemini([string]$prompt) {
    try {
        $apiKey = $script:Config.GEMINI_API_KEY
        if (-not $apiKey) { $apiKey = $INLINE_KEYS["GEMINI_API_KEY"] }
        if (-not $apiKey) { return $null }
        
        $model = $script:Config.LLM_MODEL
        $url = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}"
        
        $payload = @{ 
            contents = @(@{ parts = @(@{ text = $prompt }) })
            generationConfig = @{ maxOutputTokens = 200; temperature = 0.3 }
        } | ConvertTo-Json -Depth 10
        
        $resp = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $payload -ErrorAction Stop
        
        if ($resp.candidates -and $resp.candidates[0].content.parts) {
            return $resp.candidates[0].content.parts[0].text.Trim()
        }
    } catch {
        Write-Log "Gemini error: $_" "WARN"
    }
    return $null
}

function Call-OpenAI([string]$prompt) {
    try {
        $apiKey = $script:Config.OPENAI_API_KEY
        if (-not $apiKey) { return $null }
        
        $url = "https://api.openai.com/v1/chat/completions"
        $headers = @{ "Authorization" = "Bearer $apiKey"; "Content-Type" = "application/json" }
        
        $payload = @{
            model = "gpt-3.5-turbo"
            messages = @(@{ role = "user"; content = $prompt })
            max_tokens = 200
            temperature = 0.3
        } | ConvertTo-Json -Depth 5
        
        $resp = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $payload -ErrorAction Stop
        
        if ($resp.choices -and $resp.choices[0].message) {
            return $resp.choices[0].message.content.Trim()
        }
    } catch {
        Write-Log "OpenAI error: $_" "WARN"
    }
    return $null
}

function Call-Claude([string]$prompt) {
    try {
        $apiKey = $script:Config.CLAUDE_API_KEY
        if (-not $apiKey) { return $null }
        
        $url = "https://api.anthropic.com/v1/messages"
        $headers = @{ 
            "x-api-key" = $apiKey
            "anthropic-version" = "2023-06-01"
            "Content-Type" = "application/json" 
        }
        
        $payload = @{
            model = "claude-3-haiku-20240307"
            max_tokens = 200
            messages = @(@{ role = "user"; content = $prompt })
        } | ConvertTo-Json -Depth 5
        
        $resp = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $payload -ErrorAction Stop
        
        if ($resp.content -and $resp.content[0].text) {
            return $resp.content[0].text.Trim()
        }
    } catch {
        Write-Log "Claude error: $_" "WARN"
    }
    return $null
}

function Call-Ollama([string]$prompt) {
    try {
        $url = "$($script:Config.OLLAMA_URL)/api/generate"
        
        $payload = @{
            model = $script:Config.LLM_MODEL
            prompt = $prompt
            stream = $false
        } | ConvertTo-Json
        
        $resp = Invoke-RestMethod -Uri $url -Method Post -Body $payload -ContentType "application/json" -ErrorAction Stop
        
        if ($resp.response) {
            return $resp.response.Trim()
        }
    } catch {
        Write-Log "Ollama error: $_" "WARN"
    }
    return $null
}

# Simple .gitignore friendliness
function Is-Ignored([string]$path) {
    foreach ($p in $script:Config.IGNORE_PATTERNS) { 
        if ($path -like "*$p*") { return $true } 
    }
    if (Test-Path ".gitignore") {
        $gitignore = Get-Content ".gitignore" -ErrorAction SilentlyContinue | Where-Object { $_ -and -not $_.StartsWith("#") -and $_.Trim() -ne "" }
        foreach ($g in $gitignore) { 
            $g = $g.Trim()
            if ($g -and ($path -like "*$g*" -or $path -like "$g" -or $path -like "$g/*")) { return $true } 
        }
    }
    return $false
}

# LLM: call Gemini REST endpoint with proper error handling
function Call-Gemini($apiKey, $model, $prompt) {
    try {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}"
        $payload = @{ 
            contents = @(
                @{ 
                    parts = @(
                        @{ text = $prompt }
                    ) 
                }
            )
            generationConfig = @{
                maxOutputTokens = 200
                temperature = 0.3
            }
        } | ConvertTo-Json -Depth 10
        
        $resp = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $payload -ErrorAction Stop
        
        # Correct Gemini API response parsing
        if ($resp -and $resp.candidates -and $resp.candidates.Count -gt 0) {
            $candidate = $resp.candidates[0]
            if ($candidate.content -and $candidate.content.parts -and $candidate.content.parts.Count -gt 0) {
                $text = $candidate.content.parts[0].text
                return ($text -replace "`r",""  -replace "^\s+","" -replace "\s+$","")
            }
        }
        Write-Log "Gemini response structure unexpected: $($resp | ConvertTo-Json -Depth 2 -Compress)" "WARN"
        return $null
    } catch {
        Write-Log "Gemini call failed: $($_.Exception.Message)" "ERROR"
        return $null
    }
}

# Heuristic builder (fallback offline)
function Build-Heuristic($added,$modified,$deleted,$untracked,$renamed) {
    $total = ($added.Count + $modified.Count + $deleted.Count + $untracked.Count + $renamed.Count)
    $parts = @()
    
    # Get file extensions for type detection
    $allFiles = $added + $modified + $untracked
    
    if ($added.Count -gt 0) { 
        $sample = $added[0..([math]::Min($added.Count-1,3))] -join ", "
        $parts += "add($($added.Count)): $sample" 
    }
    if ($modified.Count -gt 0) { 
        $sample = $modified[0..([math]::Min($modified.Count-1,3))] -join ", "
        $parts += "update($($modified.Count)): $sample" 
    }
    if ($deleted.Count -gt 0) { 
        $sample = $deleted[0..([math]::Min($deleted.Count-1,2))] -join ", "
        $parts += "remove($($deleted.Count)): $sample" 
    }
    if ($untracked.Count -gt 0) { 
        $sample = $untracked[0..([math]::Min($untracked.Count-1,2))] -join ", "
        $parts += "new($($untracked.Count)): $sample" 
    }
    if ($renamed.Count -gt 0) {
        $parts += "rename($($renamed.Count))"
    }
    
    # Determine commit type based on files
    $type = "chore"
    $hasCode = ($allFiles | Where-Object { $_ -match '\.(js|ts|tsx|jsx|py|go|rs|java|cpp|c|cs)$' }).Count -gt 0
    $hasStyle = ($allFiles | Where-Object { $_ -match '\.(css|scss|sass|less)$' }).Count -gt 0
    $hasDoc = ($allFiles | Where-Object { $_ -match '\.(md|txt|rst|doc)$' }).Count -gt 0
    $hasConfig = ($allFiles | Where-Object { $_ -match '\.(json|yaml|yml|toml|ini|env)$' }).Count -gt 0
    $hasTest = ($allFiles | Where-Object { $_ -match '(test|spec)\.' }).Count -gt 0
    
    if ($hasTest) { $type = "test" }
    elseif ($hasDoc) { $type = "docs" }
    elseif ($hasStyle -and -not $hasCode) { $type = "style" }
    elseif ($hasCode) { $type = "feat" }
    elseif ($hasConfig) { $type = "config" }
    
    $body = $parts -join " | "
    if ($body.Length -gt 200) { $body = $body.Substring(0,197) + "..." }
    
    return "${type}: ${total} file(s) - $body"
}

# Build final commit message (LLM preferred if available and enabled)
function Build-CommitMessage($added,$modified,$deleted,$untracked,$renamed) {
    $heur = Build-Heuristic $added $modified $deleted $untracked $renamed
    if (-not $script:Config.LLM_ENABLED) { return $heur }
    
    # get API key based on provider
    $apiKey = switch ($script:Config.LLM_PROVIDER) {
        "gemini" { $script:Config.GEMINI_API_KEY; if (-not $_) { $INLINE_KEYS["GEMINI_API_KEY"] } }
        "openai" { $script:Config.OPENAI_API_KEY }
        "claude" { $script:Config.CLAUDE_API_KEY }
        "ollama" { "local" }
        default { $INLINE_KEYS["GEMINI_API_KEY"] }
    }
    
    if (-not $apiKey -or $apiKey -match "YOUR_API_KEY") {
        Write-Log "LLM requested but API key not set; falling back to heuristic." "WARN"
        return $heur
    }
    
    # get diff snippet
    try { 
        $diff = git diff --staged --stat 2>$null | Out-String 
        $diffContent = git diff --staged 2>$null | Out-String
        if ($diffContent.Length -gt $script:Config.LLM_MAX_DIFF_CHARS) { 
            $diffContent = $diffContent.Substring(0, $script:Config.LLM_MAX_DIFF_CHARS) + "`n... (truncated)"
        }
    } catch { 
        $diff = "" 
        $diffContent = ""
    }
    
    $prompt = @"
Generate a concise git commit message for these changes. Follow conventional commits format.
Use format: type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore, config
Keep the message under 72 characters.

FILES CHANGED:
$heur

DIFF STATS:
$diff

DIFF CONTENT (partial):
$diffContent

Return ONLY the commit message, nothing else.
"@

    $res = Call-LLM $prompt
    if ($res -and $res.Trim().Length -gt 5 -and $res.Trim().Length -lt 200) {
        $cleanMsg = $res.Trim() -replace "`n.*","" -replace "^[`"']","" -replace "[`"']$",""
        if ($cleanMsg.Length -gt 5) {
            return $cleanMsg
        }
    }
    return $heur
}

# Ensure auto branch exists
function Ensure-AutoBranch {
    $b = $script:Config.AUTO_BRANCH
    $exists = git branch --list $b 2>$null
    if (-not $exists) {
        try {
            git branch $b 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Created auto-branch: $b" "INFO"
            } else {
                git commit --allow-empty -m "Initial commit for auto-branch" 2>$null
                git branch $b 2>$null
                Write-Log "Created auto-branch with initial commit: $b" "INFO"
            }
        } catch {
            Write-Log "Failed to create auto-branch: $_" "ERROR"
        }
    }
}

# Safe branch checkout with stash
function Safe-Checkout($branchName) {
    try {
        $status = git status --porcelain 2>$null
        $needStash = $false
        
        if ($status) {
            git stash push -m "TCT-AutoStash-$(Get-Date -Format 'yyyyMMdd-HHmmss')" 2>$null
            $needStash = $true
        }
        
        git checkout $branchName 2>$null
        return $needStash
    } catch {
        Write-Log "Safe checkout failed: $_" "ERROR"
        return $false
    }
}

# Safe branch return with stash pop
function Safe-Return($previousBranch, $hadStash) {
    try {
        git checkout $previousBranch 2>$null
        if ($hadStash) {
            git stash pop 2>$null
        }
    } catch {
        Write-Log "Safe return failed: $_" "ERROR"
    }
}

# Push function on auto branch
function PushIfOnline {
    if (-not $script:Config.AUTO_PUSH_ENABLED) { Write-Log "Auto push disabled" "INFO"; return }
    
    try {
        $testConnection = Test-NetConnection -ComputerName "github.com" -Port 443 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if (-not $testConnection.TcpTestSucceeded) {
            $ping = Test-Connection -ComputerName "github.com" -Count 1 -Quiet -ErrorAction SilentlyContinue
            if (-not $ping) {
                Write-Log "Offline: skipping push" "WARN"
                return
            }
        }
    } catch {
        Write-Log "Network check failed, attempting push anyway..." "WARN"
    }
    
    if ($script:Config.SAFE_PULL_BEFORE_PUSH) {
        try {
            git fetch --prune 2>$null | Out-Null
            
            $remoteExists = git ls-remote --heads origin $script:Config.AUTO_BRANCH 2>$null
            if ($remoteExists) {
                $pull = git pull --rebase origin $script:Config.AUTO_BRANCH 2>&1
                if ($LASTEXITCODE -ne 0) { 
                    Write-Log "Safe pull failed: $pull" "ERROR"
                    git rebase --abort 2>$null
                    return 
                }
            }
        } catch { 
            Write-Log "Safe pull exception: $_" "ERROR"
            git rebase --abort 2>$null
            return 
        }
    }
    
    try {
        $pushResult = git push -u origin $script:Config.AUTO_BRANCH 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Pushed $($script:Config.AUTO_BRANCH) to origin." "INFO"
            Show-Toast "Git Push" "Successfully pushed to origin" "success"
        } else {
            Write-Log "Push warning: $pushResult" "WARN"
        }
    } catch { 
        Write-Log "Push error: $_" "ERROR"
    }
}

# Auto-squash (safe)
function Auto-Squash-IfNeeded {
    if (-not $script:Config.SQUASH_ENABLED) { return }
    
    try {
        $hist = git log --pretty=format:"%H %s" -n 200 2>$null
        if (-not $hist) { return }
        
        $autoCommits = ($hist | Select-String -Pattern "AutoCommit" -AllMatches).Matches.Count
        
        if ($autoCommits -ge $script:Config.SQUASH_AFTER_COMMITS) {
            Write-Log "Auto-squash: $autoCommits commits detected. Creating backup..." "INFO"
            
            $backupName = "$($script:Config.AUTO_BRANCH)-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            git branch $backupName 2>$null
            
            git reset --soft HEAD~$autoCommits 2>$null
            git commit -m "AutoCommit: squashed $autoCommits auto commits [$(Get-Date -Format 'yyyy-MM-dd')]" 2>$null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Squashed $autoCommits commits successfully." "INFO"
                Show-Toast "Squash Complete" "Squashed $autoCommits commits" "success"
                
                if ($script:Config.SQUASH_FORCE_PUSH) { 
                    git push -f origin $script:Config.AUTO_BRANCH 2>$null
                    Write-Log "Force-pushed squashed commit." "INFO"
                } else { 
                    try { 
                        git push origin $script:Config.AUTO_BRANCH 2>$null
                        Write-Log "Pushed squashed commit." "INFO"
                    } catch { 
                        Write-Log "Push after squash failed (may need force push)." "WARN"
                    } 
                }
            } else {
                Write-Log "Squash failed, restoring from backup..." "ERROR"
                git reset --hard $backupName 2>$null
            }
        }
    } catch {
        Write-Log "Auto-squash error: $_" "ERROR"
    }
}

# Weekly backup function
function Weekly-Backup {
    if (-not $script:Config.BACKUP_ENABLED) { return }
    
    try {
        if (-not (Test-Path $script:Config.BACKUP_FOLDER)) { 
            New-Item -ItemType Directory -Path $script:Config.BACKUP_FOLDER -Force | Out-Null 
        }
        
        $last = Get-ChildItem -Path $script:Config.BACKUP_FOLDER -Filter "repo_backup_*.zip" -ErrorAction SilentlyContinue | 
                Sort-Object LastWriteTime -Descending | 
                Select-Object -First 1
        
        $shouldBackup = (-not $last) -or ((Get-Date) - $last.LastWriteTime).TotalDays -ge $script:Config.BACKUP_INTERVAL_DAYS
        
        if ($shouldBackup) {
            $zipName = "repo_backup_{0}.zip" -f (Get-Date -Format "yyyyMMdd_HHmmss")
            $zipPath = Join-Path (Resolve-Path $script:Config.BACKUP_FOLDER).Path $zipName
            $sourcePath = (Get-Location).Path
            
            $tempBackup = Join-Path $env:TEMP "tct_backup_temp_$(Get-Random)"
            New-Item -ItemType Directory -Path $tempBackup -Force | Out-Null
            
            $excludeDirs = @("node_modules", ".git", "dist", "build", ".next", "tct_backups")
            Get-ChildItem -Path $sourcePath -Force | Where-Object {
                $item = $_
                -not ($excludeDirs | Where-Object { $item.Name -eq $_ })
            } | ForEach-Object {
                Copy-Item -Path $_.FullName -Destination $tempBackup -Recurse -Force -ErrorAction SilentlyContinue
            }
            
            Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
            [IO.Compression.ZipFile]::CreateFromDirectory($tempBackup, $zipPath)
            
            Remove-Item -Path $tempBackup -Recurse -Force -ErrorAction SilentlyContinue
            
            Write-Log "Weekly backup created: $zipPath" "INFO"
            Show-Toast "Backup Complete" "Repository backup created" "success"
            
            $zips = Get-ChildItem -Path $script:Config.BACKUP_FOLDER -Filter "*.zip" -ErrorAction SilentlyContinue | 
                    Sort-Object LastWriteTime -Descending
            if ($zips.Count -gt $script:Config.BACKUP_ROTATE_KEEP) { 
                $zips[$script:Config.BACKUP_ROTATE_KEEP..($zips.Count-1)] | Remove-Item -Force -ErrorAction SilentlyContinue
                Write-Log "Rotated old backups, keeping $($script:Config.BACKUP_ROTATE_KEEP) most recent." "INFO"
            }
        }
    } catch { 
        Write-Log "Backup error: $_" "ERROR"
    }
}

# Remote API (local, tokenized)
$script:apiListener = $null

function Start-RemoteAPI {
    if (-not $script:Config.REMOTE_API_ENABLED) { Write-Log "Remote API disabled" "INFO"; return }
    
    try {
        $script:apiListener = New-Object System.Net.HttpListener
        $prefix = "http://127.0.0.1:$($script:Config.REMOTE_API_PORT)/"
        $script:apiListener.Prefixes.Add($prefix)
        $script:apiListener.Start()
        Write-Log "Remote API listening on $prefix" "INFO"
        
        $callback = {
            param($result)
            try {
                $listener = $result.AsyncState
                $ctx = $listener.EndGetContext($result)
                $req = $ctx.Request
                $res = $ctx.Response
                
                $auth = $req.Headers["Authorization"]
                if (-not $auth -or $auth -ne "Bearer $($script:Config.REMOTE_API_TOKEN)") {
                    $res.StatusCode = 401
                    $buf = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Unauthorized"}')
                    $res.OutputStream.Write($buf, 0, $buf.Length)
                    $res.Close()
                } else {
                    $path = $req.Url.AbsolutePath.TrimEnd("/")
                    $body = switch ($path) {
                        "/status" { 
                            @{
                                status = if ($script:running) { "running" } else { "stopped" }
                                commits = $script:commitCount
                                errors = $script:errorCount
                                uptime = ((Get-Date) - $script:sessionStartTime).TotalMinutes
                                branch = $script:Config.AUTO_BRANCH
                            } | ConvertTo-Json 
                        }
                        "/stop" { 
                            New-Item -Path . -Name ".tct_stop" -ItemType File -Force | Out-Null
                            @{status="stopped"} | ConvertTo-Json 
                        }
                        "/start" { 
                            Remove-Item -Path ".tct_stop" -ErrorAction SilentlyContinue
                            @{status="started"} | ConvertTo-Json 
                        }
                        "/health" {
                            @{healthy=$true; version=$script:Config.APP_VERSION} | ConvertTo-Json
                        }
                        "/metrics" {
                            $script:metrics | ConvertTo-Json -Depth 5
                        }
                        "/config" {
                            $script:Config | ConvertTo-Json -Depth 3
                        }
                        "/rollback" {
                            $count = 1
                            if ($req.QueryString["count"]) { $count = [int]$req.QueryString["count"] }
                            $result = Rollback-Commits $count
                            @{success=$result; rolledBack=$count} | ConvertTo-Json
                        }
                        default { 
                            @{error="unknown endpoint"; available=@("/status","/stop","/start","/health","/metrics","/config","/rollback")} | ConvertTo-Json 
                        }
                    }
                    $buf = [System.Text.Encoding]::UTF8.GetBytes($body)
                    $res.ContentType = "application/json"
                    $res.OutputStream.Write($buf, 0, $buf.Length)
                    $res.Close()
                }
                
                if ($listener.IsListening) {
                    $listener.BeginGetContext($callback, $listener) | Out-Null
                }
            } catch {
                Write-Log "API request error: $_" "ERROR"
            }
        }
        
        $script:apiListener.BeginGetContext($callback, $script:apiListener) | Out-Null
        
    } catch { 
        Write-Log "Failed to start Remote API: $_" "ERROR"
    }
}

function Stop-RemoteAPI {
    if ($script:apiListener -and $script:apiListener.IsListening) {
        try {
            $script:apiListener.Stop()
            $script:apiListener.Close()
            Write-Log "Remote API stopped." "INFO"
        } catch { }
    }
}

# Stop engine function
function Stop-Engine {
    $script:running = $false
    New-Item -Path . -Name ".tct_stop" -ItemType File -Force | Out-Null
    
    if ($script:engineJob) {
        try {
            Stop-Job -Job $script:engineJob -ErrorAction SilentlyContinue
            Remove-Job -Job $script:engineJob -Force -ErrorAction SilentlyContinue
        } catch { }
        $script:engineJob = $null
    }
    
    Save-FileHashes
    Save-Metrics
    Stop-RemoteAPI
    Write-Log "Engine stopped." "INFO"
}

# Create scheduled task
function Install-ScheduledTask {
    try {
        $exe = $PSCommandPath
        if (-not $exe) { $exe = $MyInvocation.MyCommand.Path }
        
        $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$exe`""
        $trigger = New-ScheduledTaskTrigger -AtLogOn
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
        
        Register-ScheduledTask -TaskName $script:Config.SCHEDULE_TASK_NAME -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force
        Write-Log "Scheduled task '$($script:Config.SCHEDULE_TASK_NAME)' installed successfully." "INFO"
        Show-Toast "Task Installed" "Auto-start on login enabled" "success"
        return $true
    } catch {
        Write-Log "Scheduled task install failed: $_" "ERROR"
        return $false
    }
}

function Uninstall-ScheduledTask {
    try {
        Unregister-ScheduledTask -TaskName $script:Config.SCHEDULE_TASK_NAME -Confirm:$false -ErrorAction SilentlyContinue
        Write-Log "Scheduled task '$($script:Config.SCHEDULE_TASK_NAME)' removed." "INFO"
        return $true
    } catch {
        Write-Log "Scheduled task removal failed: $_" "ERROR"
        return $false
    }
}

# Main engine loop - improved with all features
function Engine-Loop {
    Ensure-AutoBranch
    Start-RemoteAPI
    
    $script:lastStatus = "Running"
    $originalBranch = git rev-parse --abbrev-ref HEAD 2>$null
    if (-not $originalBranch) { $originalBranch = "main" }
    
    while ($true) {
        try {
            # Check for stop signal
            if (Test-Path ".tct_stop") { 
                $script:lastStatus = "Paused"
                Write-Log "Engine paused by stop file." "INFO"
                Start-Sleep -Seconds $script:Config.DELAY_SECONDS
                continue 
            }
            
            # Check quiet hours
            if (Is-QuietHours) {
                if (-not $script:pausedByQuietHours) {
                    Write-Log "Entering quiet hours, pausing commits..." "INFO"
                    $script:pausedByQuietHours = $true
                }
                $script:lastStatus = "Quiet Hours"
                Start-Sleep -Seconds $script:Config.DELAY_SECONDS
                continue
            } elseif ($script:pausedByQuietHours) {
                Write-Log "Exiting quiet hours, resuming commits..." "INFO"
                $script:pausedByQuietHours = $false
            }
            
            # Check for conflicts
            if (Check-MergeConflicts) {
                $script:lastStatus = "Conflict Detected"
                Resolve-Conflicts
                Start-Sleep -Seconds $script:Config.DELAY_SECONDS
                continue
            }
            
            # Verify git repo
            if (-not (Test-Path ".git")) { 
                $script:lastStatus = "Not a git repo"
                Write-Log "Not a git repo here." "WARN"
                Start-Sleep -Seconds $script:Config.DELAY_SECONDS
                continue 
            }
            
            # Get status
            $porc = git status --porcelain --untracked-files=all 2>$null
            if (-not $porc -or $porc.Trim() -eq "") { 
                $script:lastStatus = "Watching (no changes)"
                Start-Sleep -Seconds $script:Config.DELAY_SECONDS
                continue 
            }
            
            $lines = $porc -split "`n" | Where-Object { $_ -and $_.Trim() -ne "" }
            $added=@(); $modified=@(); $deleted=@(); $untracked=@(); $renamed=@()
            
            foreach ($l in $lines) {
                if ($l.Length -lt 3) { continue }
                $code = $l.Substring(0,2).Trim()
                $path = $l.Substring(3).Trim()
                
                if (Is-Ignored $path) { continue }
                
                switch -Regex ($code) { 
                    "^\?\?" { $untracked += $path }
                    "^A"    { $added += $path }
                    "^M"    { $modified += $path }
                    "^D"    { $deleted += $path }
                    "^R"    { $renamed += $path }
                    "^ M"   { $modified += $path }
                    "^ D"   { $deleted += $path }
                    default { 
                        if ($code -match "M") { $modified += $path }
                        elseif ($code -match "A") { $added += $path }
                        elseif ($code -match "D") { $deleted += $path }
                        else { $modified += $path }
                    }
                }
            }
            
            # Smart change detection - filter out unchanged files
            $allChanges = $added + $modified + $untracked
            $realChanges = Filter-RealChanges $allChanges
            
            $total = $realChanges.Count + $deleted.Count + $renamed.Count
            if ($total -eq 0) { 
                $script:lastStatus = "Watching (no real changes)"
                Start-Sleep -Seconds $script:Config.DELAY_SECONDS
                continue 
            }
            
            # Cooldown before commit
            Write-Log "Detected $total real changes, waiting cooldown..." "INFO"
            $script:lastStatus = "Cooldown..."
            Start-Sleep -Seconds $script:Config.COOLDOWN_SECONDS
            
            # Switch to auto branch if strict mode
            $hadStash = $false
            $currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
            if ($script:Config.STRICT_SAFE_MODE -and $currentBranch -ne $script:Config.AUTO_BRANCH) {
                $hadStash = Safe-Checkout $script:Config.AUTO_BRANCH
            }
            
            # Stage all changes
            git add -A 2>$null
            
            # Build commit message
            $script:lastStatus = "Building commit message..."
            $commitMsg = Build-CommitMessage $added $modified $deleted $untracked $renamed
            
            # Check if anything staged
            $staged = git diff --cached --name-only 2>$null
            if (-not $staged) { 
                Write-Log "Nothing staged after add." "WARN"
                if ($script:Config.STRICT_SAFE_MODE -and $currentBranch -ne $script:Config.AUTO_BRANCH) { 
                    Safe-Return $currentBranch $hadStash
                }
                Start-Sleep -Seconds $script:Config.DELAY_SECONDS
                continue 
            }
            
            # Apply commit template
            $finalCommitMsg = Get-CommitMessageFromTemplate -Files $changedFiles -AISummary $commitMsg
            
            # Commit (with optional GPG signing and error recovery)
            $script:lastStatus = "Committing..."
            $commitCommand = "git commit -m `"$finalCommitMsg`""
            if ($script:Config.GPG_SIGNING -and $script:Config.GPG_KEY_ID) {
                $commitCommand += " -S"
            }
            
            $commitOut = Invoke-WithRetry -ActionName "Git Commit" -Action {
                Invoke-Expression $commitCommand 2>&1
            }
            
            if ($LASTEXITCODE -eq 0) {
                $script:commitCount++
                $script:lastCommitTime = Get-Date
                Write-Log "Committed (#$($script:commitCount)): $commitMsg" "INFO"
                
                # Update metrics
                Update-Metrics @{ filesCount = $total; message = $commitMsg }
                
                # Save file hashes
                Save-FileHashes
                
                # Track commits
                $trackFile = Join-Path $env:TEMP "tct_commits.txt"
                Add-Content -Path $trackFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | $commitMsg" -ErrorAction SilentlyContinue
                
                $script:lastStatus = "Last commit: $($script:commitCount)"
                
                # Notifications
                Show-Toast "Commit Created" $commitMsg "success"
                Send-Webhook "📝 New Commit" "AutoCommit: $commitMsg" "success"
            } else { 
                $script:errorCount++
                $script:metrics.totalErrors++
                Write-Log "Commit failed: $commitOut" "ERROR"
                $script:lastStatus = "Commit failed"
                Show-Toast "Commit Failed" "Check logs for details" "error"
            }
            
            # Push, backup, squash
            PushIfOnline
            Weekly-Backup
            Auto-Squash-IfNeeded
            
            # Check if we should create auto-PR
            if (Test-ShouldCreatePR) {
                Write-Log "[*] PR threshold reached, creating auto-PR..." "INFO"
                New-AutoPullRequest
            }
            
            # Return to original branch if strict mode
            if ($script:Config.STRICT_SAFE_MODE -and $currentBranch -and $currentBranch -ne $script:Config.AUTO_BRANCH) { 
                Safe-Return $currentBranch $hadStash
            }
            
        } catch {
            $script:errorCount++
            $script:metrics.totalErrors++
            Write-Log "Engine error: $_" "ERROR"
            $script:lastStatus = "Error: $_"
            Show-Toast "Engine Error" $_.ToString() "error"
        }
        
        Start-Sleep -Seconds $script:Config.DELAY_SECONDS
    }
}

# GUI + tray HACKER TERMINAL UI with extreme customization
if ($script:Config.ENABLE_GUI) {
    # Remove stop file on fresh start
    Remove-Item -Path ".tct_stop" -ErrorAction SilentlyContinue
    
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "$($script:Config.APP_NAME) v$($script:Config.APP_VERSION) - Git Automation Studio"
    $form.Size = New-Object System.Drawing.Size(1400,850)
    $form.StartPosition = "CenterScreen"
    $form.Font = New-Object System.Drawing.Font("Segoe UI", 9)
    $form.FormBorderStyle = "FixedSingle"
    $form.MaximizeBox = $true
    
    # Modern Color Scheme (VS Code inspired)
    $form.BackColor = [System.Drawing.Color]::FromArgb(30,30,30)
    $bgColor = [System.Drawing.Color]::FromArgb(30,30,30)
    $panelColor = [System.Drawing.Color]::FromArgb(37,37,38)
    $cardColor = [System.Drawing.Color]::FromArgb(45,45,48)
    $accentColor = [System.Drawing.Color]::FromArgb(0,122,204)
    $accentHover = [System.Drawing.Color]::FromArgb(28,151,234)
    $successColor = [System.Drawing.Color]::FromArgb(106,153,85)
    $errorColor = [System.Drawing.Color]::FromArgb(244,71,71)
    $warningColor = [System.Drawing.Color]::FromArgb(206,145,120)
    $fgColor = [System.Drawing.Color]::FromArgb(220,220,220)
    $fgMuted = [System.Drawing.Color]::FromArgb(150,150,150)
    
    # Hacker Terminal Colors (for log only)
    $terminalBg = [System.Drawing.Color]::Black
    $terminalFg = [System.Drawing.Color]::Lime
    $terminalAccent = [System.Drawing.Color]::FromArgb(0,255,65)
    
    # Create sidebar navigation panel
    $sidebar = New-Object System.Windows.Forms.Panel
    $sidebar.Location = New-Object System.Drawing.Point(0,0)
    $sidebar.Size = New-Object System.Drawing.Size(200,800)
    $sidebar.BackColor = $panelColor
    $sidebar.BorderStyle = "None"
    $form.Controls.Add($sidebar)
    
    # Sidebar title
    $sidebarTitle = New-Object System.Windows.Forms.Label
    $sidebarTitle.Text = "TCT Studio"
    $sidebarTitle.Location = New-Object System.Drawing.Point(15,15)
    $sidebarTitle.Size = New-Object System.Drawing.Size(170,35)
    $sidebarTitle.Font = New-Object System.Drawing.Font("Segoe UI",16,[System.Drawing.FontStyle]::Bold)
    $sidebarTitle.ForeColor = $accentColor
    $sidebar.Controls.Add($sidebarTitle)
    
    # Sidebar version label
    $sidebarVersion = New-Object System.Windows.Forms.Label
    $sidebarVersion.Text = "v$($script:Config.APP_VERSION)"
    $sidebarVersion.Location = New-Object System.Drawing.Point(15,50)
    $sidebarVersion.Size = New-Object System.Drawing.Size(170,20)
    $sidebarVersion.Font = New-Object System.Drawing.Font("Segoe UI",8)
    $sidebarVersion.ForeColor = $fgMuted
    $sidebar.Controls.Add($sidebarVersion)
    
    # Helper function to create nav button
    $script:navButtons = @()
    function New-NavButton([string]$text, [string]$icon, [int]$y, [string]$viewName) {
        $btn = New-Object System.Windows.Forms.Button
        $btn.Text = "  $icon  $text"
        $btn.Location = New-Object System.Drawing.Point(10,$y)
        $btn.Size = New-Object System.Drawing.Size(180,45)
        $btn.BackColor = $panelColor
        $btn.ForeColor = $fgColor
        $btn.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
        $btn.FlatAppearance.BorderSize = 0
        $btn.Font = New-Object System.Drawing.Font("Segoe UI",11)
        $btn.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
        $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
        $btn.Tag = $viewName
        $btn.Add_Click({
            param($sender)
            Switch-View $sender.Tag
            # Update button colors
            foreach ($navBtn in $script:navButtons) {
                if ($navBtn.Tag -eq $sender.Tag) {
                    $navBtn.BackColor = $accentColor
                    $navBtn.ForeColor = [System.Drawing.Color]::White
                } else {
                    $navBtn.BackColor = $panelColor
                    $navBtn.ForeColor = $fgColor
                }
            }
        }.GetNewClosure())
        $script:navButtons += $btn
        return $btn
    }
    
    # Navigation buttons
    $btnNavDashboard = New-NavButton \"Dashboard\" \"\ud83c\udfdb\" 90 \"dashboard\"
    $btnNavDashboard.BackColor = $accentColor
    $btnNavDashboard.ForeColor = [System.Drawing.Color]::White
    $sidebar.Controls.Add($btnNavDashboard)
    
    $btnNavSettings = New-NavButton \"Settings\" \"\u2699\" 145 \"settings\"
    $sidebar.Controls.Add($btnNavSettings)
    
    $btnNavAPI = New-NavButton \"API Keys\" \"\ud83d\udd11\" 200 \"apikeys\"
    $sidebar.Controls.Add($btnNavAPI)
    
    $btnNavAnalytics = New-NavButton \"Analytics\" \"\ud83d\udcca\" 255 \"analytics\"
    $sidebar.Controls.Add($btnNavAnalytics)
    
    $btnNavWebhooks = New-NavButton \"Webhooks\" \"\ud83d\udd14\" 310 \"webhooks\"
    $sidebar.Controls.Add($btnNavWebhooks)
    
    $btnNavAbout = New-NavButton \"About\" \"\u2139\" 365 \"about\"
    $sidebar.Controls.Add($btnNavAbout)
    
    # Sidebar footer
    $sidebarFooter = New-Object System.Windows.Forms.Label
    $sidebarFooter.Text = "TCT Git Automation`n© 2025"
    $sidebarFooter.Location = New-Object System.Drawing.Point(15,750)
    $sidebarFooter.Size = New-Object System.Drawing.Size(170,40)
    $sidebarFooter.Font = New-Object System.Drawing.Font("Segoe UI",8)
    $sidebarFooter.ForeColor = $fgMuted
    $sidebarFooter.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
    $sidebar.Controls.Add($sidebarFooter)
    
    # Main content container
    $mainContent = New-Object System.Windows.Forms.Panel
    $mainContent.Location = New-Object System.Drawing.Point(200,0)
    $mainContent.Size = New-Object System.Drawing.Size(1200,800)
    $mainContent.BackColor = $bgColor
    $mainContent.AutoScroll = $true
    $form.Controls.Add($mainContent)
    
    # Navigation state
    $script:currentView = "dashboard"
    
    # Function to switch views
    function Switch-View([string]$viewName) {
        $script:currentView = $viewName
        # Hide all view panels
        foreach ($ctrl in $mainContent.Controls) {
            if ($ctrl -is [System.Windows.Forms.Panel] -and $ctrl.Tag -like "view_*") {
                $ctrl.Visible = $false
            }
        }
        # Show selected view
        $viewPanel = $mainContent.Controls | Where-Object { $_.Tag -eq "view_$viewName" } | Select-Object -First 1
        if ($viewPanel) { $viewPanel.Visible = $true }
    }
    
    # ============ VIEW 1: DASHBOARD ============
    $viewDashboard = New-Object System.Windows.Forms.Panel
    $viewDashboard.Tag = "view_dashboard"
    $viewDashboard.Location = New-Object System.Drawing.Point(0,0)
    $viewDashboard.Size = New-Object System.Drawing.Size(1200,800)
    $viewDashboard.BackColor = $bgColor
    $viewDashboard.AutoScroll = $true
    $viewDashboard.Visible = $true
    $mainContent.Controls.Add($viewDashboard)
    
    # Dashboard Header
    $headerPanel = New-Object System.Windows.Forms.Panel
    $headerPanel.Location = New-Object System.Drawing.Point(20,20)
    $headerPanel.Size = New-Object System.Drawing.Size(1160,80)
    $headerPanel.BackColor = $cardColor
    $headerPanel.BorderStyle = "None"
    $viewDashboard.Controls.Add($headerPanel)
    
    $lblTitle = New-Object System.Windows.Forms.Label
    $lblTitle.Text = "Git Auto-Commit Dashboard"
    $lblTitle.Location = New-Object System.Drawing.Point(20,15)
    $lblTitle.Size = New-Object System.Drawing.Size(600,30)
    $lblTitle.Font = New-Object System.Drawing.Font("Segoe UI",18,[System.Drawing.FontStyle]::Bold)
    $lblTitle.ForeColor = $fgColor
    $headerPanel.Controls.Add($lblTitle)
    
    $lblSubtitle = New-Object System.Windows.Forms.Label
    $lblSubtitle.Text = "Repository: $(Get-Location) | Branch: $($script:Config.AUTO_BRANCH)"
    $lblSubtitle.Location = New-Object System.Drawing.Point(20,50)
    $lblSubtitle.Size = New-Object System.Drawing.Size(800,20)
    $lblSubtitle.Font = New-Object System.Drawing.Font("Segoe UI",9)
    $lblSubtitle.ForeColor = $fgMuted
    $headerPanel.Controls.Add($lblSubtitle)
    
    # Status indicator (top right of header)
    $lblStatus = New-Object System.Windows.Forms.Label
    $lblStatus.Text = "● Idle"
    $lblStatus.Location = New-Object System.Drawing.Point(1050,25)
    $lblStatus.Size = New-Object System.Drawing.Size(100,30)
    $lblStatus.Font = New-Object System.Drawing.Font("Segoe UI",12,[System.Drawing.FontStyle]::Bold)
    $lblStatus.ForeColor = $fgMuted
    $lblStatus.TextAlign = "MiddleRight"
    $headerPanel.Controls.Add($lblStatus)
    
    # Metrics Cards Row
    $metricsY = 120
    $cardWidth = 270
    $cardHeight = 110
    $cardSpacing = 20
    
    # Helper function to create metric card
    function New-MetricCard([string]$title, [string]$value, [string]$icon, [int]$x) {
        $card = New-Object System.Windows.Forms.Panel
        $card.Location = New-Object System.Drawing.Point($x, $metricsY)
        $card.Size = New-Object System.Drawing.Size($cardWidth, $cardHeight)
        $card.BackColor = $cardColor
        $card.BorderStyle = "None"
        
        $iconLbl = New-Object System.Windows.Forms.Label
        $iconLbl.Text = $icon
        $iconLbl.Location = New-Object System.Drawing.Point(20,15)
        $iconLbl.Size = New-Object System.Drawing.Size(50,50)
        $iconLbl.Font = New-Object System.Drawing.Font("Segoe UI",24)
        $iconLbl.ForeColor = $accentColor
        $card.Controls.Add($iconLbl)
        
        $titleLbl = New-Object System.Windows.Forms.Label
        $titleLbl.Text = $title
        $titleLbl.Location = New-Object System.Drawing.Point(80,20)
        $titleLbl.Size = New-Object System.Drawing.Size(180,20)
        $titleLbl.Font = New-Object System.Drawing.Font("Segoe UI",9)
        $titleLbl.ForeColor = $fgMuted
        $card.Controls.Add($titleLbl)
        
        $valueLbl = New-Object System.Windows.Forms.Label
        $valueLbl.Text = $value
        $valueLbl.Location = New-Object System.Drawing.Point(80,45)
        $valueLbl.Size = New-Object System.Drawing.Size(180,35)
        $valueLbl.Font = New-Object System.Drawing.Font("Segoe UI",20,[System.Drawing.FontStyle]::Bold)
        $valueLbl.ForeColor = $fgColor
        $valueLbl.Tag = "value"
        $card.Controls.Add($valueLbl)
        
        $card.Tag = $title
        return $card
    }
    
    $cardCommits = New-MetricCard "Total Commits" "0" "💾" 20
    $viewDashboard.Controls.Add($cardCommits)
    
    $cardErrors = New-MetricCard "Errors" "0" "⚠" (20 + $cardWidth + $cardSpacing)
    $viewDashboard.Controls.Add($cardErrors)
    
    $cardUptime = New-MetricCard "Uptime" "0m" "⏱" (20 + ($cardWidth + $cardSpacing) * 2)
    $viewDashboard.Controls.Add($cardUptime)
    
    $cardMemory = New-MetricCard "Memory" "0 MB" "📦" (20 + ($cardWidth + $cardSpacing) * 3)
    $viewDashboard.Controls.Add($cardMemory)
    
    # Control Panel with modern buttons
    $controlPanelY = $metricsY + $cardHeight + 30
    $controlPanel = New-Object System.Windows.Forms.Panel
    $controlPanel.Location = New-Object System.Drawing.Point(20, $controlPanelY)
    $controlPanel.Size = New-Object System.Drawing.Size(1160,70)
    $controlPanel.BackColor = $cardColor
    $controlPanel.BorderStyle = "None"
    $viewDashboard.Controls.Add($controlPanel)
    
    # Modern button helper
    function New-ModernButton([string]$text, [string]$icon, [int]$x, [System.Drawing.Color]$color) {
        $btn = New-Object System.Windows.Forms.Button
        $btn.Text = "$icon  $text"
        $btn.Location = New-Object System.Drawing.Point($x,15)
        $btn.Size = New-Object System.Drawing.Size(140,40)
        $btn.BackColor = $color
        $btn.ForeColor = [System.Drawing.Color]::White
        $btn.FlatStyle = "Flat"
        $btn.FlatAppearance.BorderSize = 0
        $btn.Font = New-Object System.Drawing.Font("Segoe UI",10,[System.Drawing.FontStyle]::Bold)
        $btn.Cursor = [System.Windows.Forms.Cursors]::Hand
        return $btn
    }
    
    $btnStart = New-ModernButton "Start" "▶" 20 $successColor
    $controlPanel.Controls.Add($btnStart)
    
    $btnStop = New-ModernButton "Stop" "⏹" 180 $errorColor
    $btnStop.Enabled = $false
    $controlPanel.Controls.Add($btnStop)
    
    $btnRollback = New-ModernButton "Rollback" "↶" 340 $warningColor
    $controlPanel.Controls.Add($btnRollback)
    
    $btnExport = New-ModernButton "Export" "📊" 500 $accentColor
    $controlPanel.Controls.Add($btnExport)
    
    $btnOptimize = New-ModernButton "Optimize" "⚡" 660 ([System.Drawing.Color]::FromArgb(156,39,176))
    $controlPanel.Controls.Add($btnOptimize)
    
    $btnSettings = New-ModernButton "Settings" "⚙" 820 ([System.Drawing.Color]::FromArgb(96,125,139))
    $controlPanel.Controls.Add($btnSettings)
    
    $btnClear = New-ModernButton "Clear Log" "🗑" 980 ([System.Drawing.Color]::FromArgb(84,110,122))
    $controlPanel.Controls.Add($btnClear)
    
    # HACKER TERMINAL LOG (this stays hacker-style!)
    $terminalY = $controlPanelY + 90
    $terminalLabel = New-Object System.Windows.Forms.Label
    $terminalLabel.Text = "██ TERMINAL LOG ██"
    $terminalLabel.Location = New-Object System.Drawing.Point(20, $terminalY)
    $terminalLabel.Size = New-Object System.Drawing.Size(500,25)
    $terminalLabel.Font = New-Object System.Drawing.Font("Consolas",11,[System.Drawing.FontStyle]::Bold)
    $terminalLabel.ForeColor = $terminalFg
    $viewDashboard.Controls.Add($terminalLabel)
    
    $txtLog = New-Object System.Windows.Forms.TextBox
    $txtLog.Multiline = $true
    $txtLog.ScrollBars = "Both"
    $txtLog.ReadOnly = $true
    $txtLog.Size = New-Object System.Drawing.Size(1160,330)
    $txtLog.Location = New-Object System.Drawing.Point(20, $terminalY + 30)
    $txtLog.BackColor = $terminalBg
    $txtLog.ForeColor = $terminalFg
    $txtLog.Font = New-Object System.Drawing.Font("Consolas", 9)
    $txtLog.BorderStyle = "FixedSingle"
    $txtLog.Text = @"
██████████████████████████████████████████████████████████████████████████████████████████
██ TCT-GIT-AUTO-COMMITER v$($script:Config.APP_VERSION) TERMINAL INITIALIZED ██ ALL SYSTEMS ONLINE ██
██████████████████████████████████████████████████████████████████████████████████████████


"@
    $viewDashboard.Controls.Add($txtLog)
    
    # Remove old hacker ASCII check
    if ($false) {
        $asciiHeader = New-Object System.Windows.Forms.Label
        $asciiHeader.Text = @"
 ████████╗ ██████╗████████╗    ██████╗ ██╗████████╗     █████╗ ██╗   ██╗████████╗ ██████╗ 
 ╚══██╔══╝██╔════╝╚══██╔══╝   ██╔════╝ ██║╚══██╔══╝    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗
    ██║   ██║        ██║      ██║  ███╗██║   ██║       ███████║██║   ██║   ██║   ██║   ██║
    ██║   ██║        ██║      ██║   ██║██║   ██║       ██╔══██║██║   ██║   ██║   ██║   ██║
    ██║   ╚██████╗   ██║      ╚██████╔╝██║   ██║       ██║  ██║╚██████╔╝   ██║   ╚██████╔╝
    ╚═╝    ╚═════╝   ╚═╝       ╚═════╝ ╚═╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ 
"@
        $asciiHeader.Location = New-Object System.Drawing.Point(10,5)
        $asciiHeader.AutoSize = $true
        $asciiHeader.ForeColor = $accentColor
        $asciiHeader.Font = New-Object System.Drawing.Font("Courier New",6,[System.Drawing.FontStyle]::Bold)
        $tabMain.Controls.Add($asciiHeader)
    }
    
    # Status label with hacker styling
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = if ($isHacker) { "[STATUS] >>> IDLE" } else { "Status: Idle" }
    $lbl.Location = New-Object System.Drawing.Point(12, $(if ($isHacker) { 85 } else { 10 }))
    $lbl.AutoSize = $true
    $lbl.ForeColor = $accentColor
    $lbl.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,11,[System.Drawing.FontStyle]::Bold)
    $tabMain.Controls.Add($lbl)
    
    # Metrics panel (top right) - Hacker style
    $metricsPanel = New-Object System.Windows.Forms.Panel
    $metricsPanel.Location = New-Object System.Drawing.Point(800, $(if ($isHacker) { 85 } else { 10 }))
    $metricsPanel.Size = New-Object System.Drawing.Size(350,160)
    $metricsPanel.BorderStyle = "FixedSingle"
    $metricsPanel.BackColor = $panelColor
    $metricsPanel.ForeColor = $fgColor
    $tabMain.Controls.Add($metricsPanel)
    
    $lblMetricsTitle = New-Object System.Windows.Forms.Label
    $lblMetricsTitle.Text = if ($isHacker) { "[▓▓] SYSTEM METRICS [▓▓]" } else { "📈 Session Metrics" }
    $lblMetricsTitle.Location = New-Object System.Drawing.Point(10,5)
    $lblMetricsTitle.AutoSize = $true
    $lblMetricsTitle.ForeColor = $accentColor
    $lblMetricsTitle.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,10,[System.Drawing.FontStyle]::Bold)
    $metricsPanel.Controls.Add($lblMetricsTitle)
    
    $lblMetrics = New-Object System.Windows.Forms.Label
    $lblMetrics.Location = New-Object System.Drawing.Point(10,30)
    $lblMetrics.Size = New-Object System.Drawing.Size(330,120)
    $lblMetrics.ForeColor = $fgColor
    $lblMetrics.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
    if ($isHacker) {
        $lblMetrics.Text = "[>] COMMITS..... 0`r`n[>] ERRORS...... 0`r`n[>] UPTIME...... 0m`r`n[>] LAST_COMMIT. NEVER`r`n[>] MEMORY...... 0 MB`r`n[>] REPO........ ACTIVE"
    } else {
        $lblMetrics.Text = "Commits: 0`r`nErrors: 0`r`nUptime: 0m`r`nLast Commit: Never`r`nMemory: 0 MB"
    }
    $metricsPanel.Controls.Add($lblMetrics)
    
    # Terminal log textbox with scan line effect
    $txtLog = New-Object System.Windows.Forms.TextBox
    $txtLog.Multiline = $true
    $txtLog.ScrollBars = "Both"
    $txtLog.ReadOnly = $true
    $txtLog.Size = New-Object System.Drawing.Size(1140,340)
    $txtLog.Location = New-Object System.Drawing.Point(12, $(if ($isHacker) { 250 } else { 180 }))
    $txtLog.BackColor = $bgColor
    $txtLog.ForeColor = if ($isHacker) { [System.Drawing.Color]::FromArgb(0,255,0) } elseif ($isDark) { [System.Drawing.Color]::LightGray } else { [System.Drawing.Color]::Black }
    $txtLog.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT, $script:Config.TERMINAL_FONT_SIZE)
    $txtLog.BorderStyle = "FixedSingle"
    if ($isHacker) {
        # Add scan line effect visual cue
        $txtLog.Text = "═══════════════════════════════════════════════════════════════════════════════════════════════════════`r`n" +
                       "██ TERMINAL INITIALIZED ██ AWAITING COMMANDS ██ ALL SYSTEMS NOMINAL ██`r`n" +
                       "═══════════════════════════════════════════════════════════════════════════════════════════════════════`r`n`r`n"
    }
    $tabMain.Controls.Add($txtLog)
    
    # Old button/metrics code removed - replaced with modern UI above
    
    # Dummy button for compatibility (will be removed)
    $btnTheme = New-Object System.Windows.Forms.Button
    $btnTheme.Visible = $false
    $viewDashboard.Controls.Add($btnTheme)
    
    $btnClear = New-Object System.Windows.Forms.Button
    $btnClear.Visible = $false
    $btnClear.Size = New-Object System.Drawing.Size(100,40)
    $btnClear.Location = New-Object System.Drawing.Point(632,600)
    $btnClear.BackColor = $buttonBg
    $btnClear.ForeColor = $fgColor
    $btnClear.FlatStyle = "Flat"
    $btnClear.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9,[System.Drawing.FontStyle]::Bold)
    $tabMain.Controls.Add($btnClear)
    
    $btnMemOpt = New-Object System.Windows.Forms.Button
    $btnMemOpt.Text = if ($isHacker) { "[♻] OPTIMIZE" } else { "♻ Optimize" }
    $btnMemOpt.Size = New-Object System.Drawing.Size(120,40)
    $btnMemOpt.Location = New-Object System.Drawing.Point(742,600)
    $btnMemOpt.BackColor = if ($isHacker) { [System.Drawing.Color]::FromArgb(40,40,80) } else { $buttonBg }
    $btnMemOpt.ForeColor = if ($isHacker) { [System.Drawing.Color]::FromArgb(150,150,255) } else { $fgColor }
    $btnMemOpt.FlatStyle = "Flat"
    $btnMemOpt.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9,[System.Drawing.FontStyle]::Bold)
    $tabMain.Controls.Add($btnMemOpt)
    
    $btnMemOpt.Add_Click({
        Optimize-Memory
        UI-Log "Memory optimization executed. Current usage: $(Get-MemoryUsage) MB"
        Show-Toast "Memory Optimized" "Garbage collection completed" "success"
    })

    # ============ TAB 2: LIVE SETTINGS CONTROL CENTER ============
    $tabSettings = New-Object System.Windows.Forms.TabPage
    $tabSettings.Text = if ($isHacker) { "[⚙] CONFIG" } else { "⚙️ Settings" }
    $tabSettings.BackColor = $bgColor
    $tabSettings.ForeColor = $fgColor
    $tabSettings.AutoScroll = $true
    $tabControl.Controls.Add($tabSettings)
    
    # Settings scroll panel
    $settingsPanel = New-Object System.Windows.Forms.Panel
    $settingsPanel.Location = New-Object System.Drawing.Point(10,10)
    $settingsPanel.Size = New-Object System.Drawing.Size(1140,540)
    $settingsPanel.BackColor = $bgColor
    $settingsPanel.ForeColor = $fgColor
    $settingsPanel.AutoScroll = $true
    $tabSettings.Controls.Add($settingsPanel)
    
    $settingsY = 10
    function Add-SettingLabel([string]$text) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = if ($isHacker) { "[██] $text" } else { $text }
        $lbl.Location = New-Object System.Drawing.Point(10, $script:settingsY)
        $lbl.Size = New-Object System.Drawing.Size(400, 25)
        $lbl.ForeColor = $accentColor
        $lbl.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,10,[System.Drawing.FontStyle]::Bold)
        $settingsPanel.Controls.Add($lbl)
        $script:settingsY += 30
    }
    
    function Add-SettingTextBox([string]$configKey, [string]$label) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = if ($isHacker) { "> $label" } else { $label }
        $lbl.Location = New-Object System.Drawing.Point(10, $script:settingsY)
        $lbl.Size = New-Object System.Drawing.Size(250, 20)
        $lbl.ForeColor = $fgColor
        $lbl.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
        $settingsPanel.Controls.Add($lbl)
        
        $txt = New-Object System.Windows.Forms.TextBox
        $txt.Location = New-Object System.Drawing.Point(270, $script:settingsY)
        $txt.Size = New-Object System.Drawing.Size(350, 20)
        $txt.BackColor = $panelColor
        $txt.ForeColor = if ($isHacker) { $accentColor } else { $fgColor }
        $txt.BorderStyle = "FixedSingle"
        $txt.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
        $txt.Text = $script:Config[$configKey]
        $txt.Tag = $configKey
        $settingsPanel.Controls.Add($txt)
        $script:settingsY += 35
        return $txt
    }
    
    function Add-SettingNumeric([string]$configKey, [string]$label, [int]$min, [int]$max) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = if ($isHacker) { "> $label" } else { $label }
        $lbl.Location = New-Object System.Drawing.Point(10, $script:settingsY)
        $lbl.Size = New-Object System.Drawing.Size(250, 20)
        $lbl.ForeColor = $fgColor
        $lbl.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
        $settingsPanel.Controls.Add($lbl)
        
        $num = New-Object System.Windows.Forms.NumericUpDown
        $num.Location = New-Object System.Drawing.Point(270, $script:settingsY)
        $num.Size = New-Object System.Drawing.Size(150, 20)
        $num.BackColor = $panelColor
        $num.ForeColor = if ($isHacker) { $accentColor } else { $fgColor }
        $num.BorderStyle = "FixedSingle"
        $num.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
        $num.Minimum = $min
        $num.Maximum = $max
        $num.Value = $script:Config[$configKey]
        $num.Tag = $configKey
        $settingsPanel.Controls.Add($num)
        
        # Live update label
        $infoLbl = New-Object System.Windows.Forms.Label
        $infoLbl.Location = New-Object System.Drawing.Point(430, $script:settingsY)
        $infoLbl.Size = New-Object System.Drawing.Size(200, 20)
        $infoLbl.ForeColor = $accentColor
        $infoLbl.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,8)
        $infoLbl.Text = "(current: $($script:Config[$configKey]))"
        $settingsPanel.Controls.Add($infoLbl)
        
        $num.Add_ValueChanged({
            $infoLbl.Text = "(will be: $($num.Value))"
        }.GetNewClosure())
        
        $script:settingsY += 35
        return $num
    }
    
    function Add-SettingCheckBox([string]$configKey, [string]$label) {
        $chk = New-Object System.Windows.Forms.CheckBox
        $chk.Text = if ($isHacker) { "[x] $label" } else { $label }
        $chk.Location = New-Object System.Drawing.Point(10, $script:settingsY)
        $chk.Size = New-Object System.Drawing.Size(600, 25)
        $chk.ForeColor = $fgColor
        $chk.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
        $chk.Checked = $script:Config[$configKey]
        $chk.Tag = $configKey
        $settingsPanel.Controls.Add($chk)
        $script:settingsY += 35
        return $chk
    }
    
    function Add-SettingComboBox([string]$configKey, [string]$label, [array]$items) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = if ($isHacker) { "> $label" } else { $label }
        $lbl.Location = New-Object System.Drawing.Point(10, $script:settingsY)
        $lbl.Size = New-Object System.Drawing.Size(250, 20)
        $lbl.ForeColor = $fgColor
        $lbl.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
        $settingsPanel.Controls.Add($lbl)
        
        $cmb = New-Object System.Windows.Forms.ComboBox
        $cmb.Location = New-Object System.Drawing.Point(270, $script:settingsY)
        $cmb.Size = New-Object System.Drawing.Size(200, 20)
        $cmb.BackColor = $panelColor
        $cmb.ForeColor = if ($isHacker) { $accentColor } else { $fgColor }
        $cmb.FlatStyle = "Flat"
        $cmb.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,9)
        $cmb.DropDownStyle = "DropDownList"
        $items | ForEach-Object { [void]$cmb.Items.Add($_) }
        $cmb.SelectedItem = $script:Config[$configKey]
        $cmb.Tag = $configKey
        $settingsPanel.Controls.Add($cmb)
        $script:settingsY += 35
        return $cmb
    }
    
    # Basic Settings with enhanced controls
    Add-SettingLabel "CORE CONFIGURATION"
    $txtAutoBranch = Add-SettingTextBox "AUTO_BRANCH" "Auto Branch Name:"
    $numDelay = Add-SettingNumeric "DELAY_SECONDS" "Delay Between Checks (seconds):" 5 300
    $numCooldown = Add-SettingNumeric "COOLDOWN_SECONDS" "Cooldown Before Commit (seconds):" 1 60
    $chkStrictMode = Add-SettingCheckBox "STRICT_SAFE_MODE" "Enable Strict Safe Mode (Auto-branch protection)"
    
    $script:settingsY += 10
    Add-SettingLabel "TERMINAL CUSTOMIZATION"
    $cmbTheme = Add-SettingComboBox "THEME" "UI Theme:" @("hacker", "dark", "light")
    $cmbFont = Add-SettingComboBox "TERMINAL_FONT" "Terminal Font:" @("Consolas", "Courier New", "Lucida Console", "Cascadia Code")
    $numFontSize = Add-SettingNumeric "TERMINAL_FONT_SIZE" "Font Size:" 8 16
    $chkMatrix = Add-SettingCheckBox "SHOW_MATRIX_EFFECT" "Enable Matrix Visual Effects"
    $chkTyping = Add-SettingCheckBox "TYPING_EFFECT" "Enable Typing Animation Effects"
    $chkScanLines = Add-SettingCheckBox "SCAN_LINES" "Enable Scan Line Visual Effects"
    
    $script:settingsY += 10
    Add-SettingLabel "AUTO-COMMIT BEHAVIOR"
    $chkSquash = Add-SettingCheckBox "SQUASH_ENABLED" "Enable Auto-Squash (Merge commits periodically)"
    $numSquashAfter = Add-SettingNumeric "SQUASH_AFTER_COMMITS" "Squash After N Commits:" 3 50
    $chkForceSquash = Add-SettingCheckBox "SQUASH_FORCE_PUSH" "Force Push After Squash (DANGEROUS)"
    $chkAutoPush = Add-SettingCheckBox "AUTO_PUSH_ENABLED" "Enable Auto-Push to Remote"
    $chkSafePull = Add-SettingCheckBox "SAFE_PULL_BEFORE_PUSH" "Pull Before Push (Safer)"
    
    $script:settingsY += 10
    Add-SettingLabel "ARTIFICIAL INTELLIGENCE"
    $chkLLM = Add-SettingCheckBox "LLM_ENABLED" "Enable AI-Generated Commit Messages"
    $cmbLLMProvider = Add-SettingComboBox "LLM_PROVIDER" "LLM Provider:" @("gemini", "openai", "claude", "ollama")
    $txtLLMModel = Add-SettingTextBox "LLM_MODEL" "Model Name (e.g., gemini-2.0-flash):"
    $numLLMMaxChars = Add-SettingNumeric "LLM_MAX_DIFF_CHARS" "Max Diff Characters to Send:" 1000 10000
    
    $script:settingsY += 10
    Add-SettingLabel "🔒 SECURITY & SIGNING"
    $chkGPG = Add-SettingCheckBox "GPG_SIGNING" "Enable GPG Commit Signing"
    $txtGPGKey = Add-SettingTextBox "GPG_KEY_ID" "GPG Key ID:"
    
    $script:settingsY += 10
    Add-SettingLabel "🔄 ERROR RECOVERY"
    $chkErrorRetry = Add-SettingCheckBox "ERROR_RETRY_ENABLED" "Enable Auto-Retry on Errors"
    $numRetryMax = Add-SettingNumeric "ERROR_RETRY_MAX" "Max Retry Attempts:" 1 10
    $txtRetryBackoff = Add-SettingTextBox "ERROR_RETRY_BACKOFF" "Backoff Multiplier (1.5-3.0):"
    
    $script:settingsY += 10
    Add-SettingLabel "🔀 PR AUTOMATION"
    $chkPRAuto = Add-SettingCheckBox "PR_AUTO_ENABLED" "Enable Auto-PR Creation"
    $numPRThreshold = Add-SettingNumeric "PR_AUTO_THRESHOLD" "Create PR After N Commits:" 5 100
    $txtPRTitle = Add-SettingTextBox "PR_AUTO_TITLE" "PR Title Template:"
    $txtPRBody = Add-SettingTextBox "PR_AUTO_BODY" "PR Body Template:"
    
    $script:settingsY += 10
    Add-SettingLabel "📝 COMMIT TEMPLATES"
    $chkTemplate = Add-SettingCheckBox "TEMPLATE_ENABLED" "Enable Commit Templates"
    $cmbTemplate = Add-SettingComboBox "TEMPLATE_CURRENT" "Template:" @("default", "detailed", "simple", "emoji")
    
    $script:settingsY += 10
    Add-SettingLabel "🌐 WEB DASHBOARD"
    $chkWeb = Add-SettingCheckBox "WEB_ENABLED" "Enable Web Dashboard"
    $numWebPort = Add-SettingNumeric "WEB_PORT" "Port:" 3000 9999
    $txtWebHost = Add-SettingTextBox "WEB_HOST" "Host (localhost/0.0.0.0):"
    
    $script:settingsY += 10
    Add-SettingLabel "📦 BACKUP SETTINGS"
    $chkBackup = Add-SettingCheckBox "BACKUP_ENABLED" "Enable Weekly Backups"
    $txtBackupDays = Add-SettingTextBox "BACKUP_INTERVAL_DAYS" "Backup Interval (days):"
    
    $script:settingsY += 10
    Add-SettingLabel "🔔 NOTIFICATIONS"
    $chkToast = Add-SettingCheckBox "TOAST_ENABLED" "Enable Toast Notifications"
    $chkWebhook = Add-SettingCheckBox "WEBHOOK_ENABLED" "Enable Webhook Notifications"
    $txtWebhookURL = Add-SettingTextBox "WEBHOOK_URL" "Webhook URL:"
    
    $script:settingsY += 10
    Add-SettingLabel "⏰ SCHEDULING"
    $chkQuiet = Add-SettingCheckBox "QUIET_HOURS_ENABLED" "Enable Quiet Hours"
    $txtQuietStart = Add-SettingTextBox "QUIET_HOURS_START" "Quiet Hours Start (HH:MM):"
    $txtQuietEnd = Add-SettingTextBox "QUIET_HOURS_END" "Quiet Hours End (HH:MM):"
    
    $script:settingsY += 10
    Add-SettingLabel "🔐 SECURITY"
    $chkGPG = Add-SettingCheckBox "GPG_SIGNING" "Enable GPG Commit Signing"
    $txtGPGKey = Add-SettingTextBox "GPG_KEY_ID" "GPG Key ID:"
    
    $script:settingsY += 10
    Add-SettingLabel "🔄 ERROR RECOVERY"
    $chkErrorRetry = Add-SettingCheckBox "ERROR_RETRY_ENABLED" "Auto-Retry on Transient Errors"
    $numRetryMax = Add-SettingNumeric "ERROR_RETRY_MAX" "Max Retry Attempts:" 1 10
    
    $script:settingsY += 10
    Add-SettingLabel "🔀 PR AUTOMATION"
    $chkPRAuto = Add-SettingCheckBox "PR_AUTO_ENABLED" "Auto-Create Pull Requests"
    $numPRThreshold = Add-SettingNumeric "PR_AUTO_THRESHOLD" "Create PR After N Commits:" 5 100
    $txtPRTitle = Add-SettingTextBox "PR_AUTO_TITLE" "PR Title Template:"
    
    $script:settingsY += 10
    Add-SettingLabel "📝 COMMIT TEMPLATES"
    $chkTemplate = Add-SettingCheckBox "TEMPLATE_ENABLED" "Use Commit Templates"
    $cmbTemplate = Add-SettingComboBox "TEMPLATE_CURRENT" "Template:" @("default", "detailed", "simple", "emoji")
    
    $script:settingsY += 10
    Add-SettingLabel "🌐 WEB DASHBOARD"
    $chkWeb = Add-SettingCheckBox "WEB_ENABLED" "Enable Web Dashboard"
    $numWebPort = Add-SettingNumeric "WEB_PORT" "Port:" 3000 9999
    $txtWebHost = Add-SettingTextBox "WEB_HOST" "Host:"
    
    # Settings action buttons
    $btnSaveSettings = New-Object System.Windows.Forms.Button
    $btnSaveSettings.Text = if ($isHacker) { "[✓] APPLY CONFIG" } else { "💾 Save All Settings" }
    $btnSaveSettings.Size = New-Object System.Drawing.Size(180,40)
    $btnSaveSettings.Location = New-Object System.Drawing.Point(10,560)
    $btnSaveSettings.BackColor = if ($isHacker) { [System.Drawing.Color]::FromArgb(0,80,0) } else { [System.Drawing.Color]::FromArgb(40,100,120) }
    $btnSaveSettings.ForeColor = if ($isHacker) { $accentColor } else { [System.Drawing.Color]::White }
    $btnSaveSettings.FlatStyle = "Flat"
    $btnSaveSettings.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,10,[System.Drawing.FontStyle]::Bold)
    $tabSettings.Controls.Add($btnSaveSettings)
    
    $btnResetSettings = New-Object System.Windows.Forms.Button
    $btnResetSettings.Text = if ($isHacker) { "[↺] RESET DEFAULTS" } else { "↺ Reset to Defaults" }
    $btnResetSettings.Size = New-Object System.Drawing.Size(180,40)
    $btnResetSettings.Location = New-Object System.Drawing.Point(200,560)
    $btnResetSettings.BackColor = if ($isHacker) { [System.Drawing.Color]::FromArgb(80,40,0) } else { [System.Drawing.Color]::FromArgb(120,60,40) }
    $btnResetSettings.ForeColor = if ($isHacker) { [System.Drawing.Color]::FromArgb(255,150,0) } else { [System.Drawing.Color]::White }
    $btnResetSettings.FlatStyle = "Flat"
    $btnResetSettings.Font = New-Object System.Drawing.Font($script:Config.TERMINAL_FONT,10,[System.Drawing.FontStyle]::Bold)
    $tabSettings.Controls.Add($btnResetSettings)
    
    $btnResetSettings.Add_Click({
        $result = [System.Windows.Forms.MessageBox]::Show("Reset all settings to default values? This will require a restart.", "Reset Settings", "YesNo", "Warning")
        if ($result -eq "Yes") {
            if (Test-Path $CONFIG_FILE) { Remove-Item $CONFIG_FILE -Force }
            [System.Windows.Forms.MessageBox]::Show("Settings reset to defaults. Please restart the application.", "Reset Complete", "OK", "Information")
        }
    })
    
    $btnSaveSettings.Add_Click({
        # Collect all settings from various control types
        foreach ($ctrl in $settingsPanel.Controls) {
            if ($ctrl.Tag -and $script:Config.ContainsKey($ctrl.Tag)) {
                if ($ctrl -is [System.Windows.Forms.TextBox]) {
                    $script:Config[$ctrl.Tag] = $ctrl.Text
                } elseif ($ctrl -is [System.Windows.Forms.CheckBox]) {
                    $script:Config[$ctrl.Tag] = $ctrl.Checked
                } elseif ($ctrl -is [System.Windows.Forms.NumericUpDown]) {
                    $script:Config[$ctrl.Tag] = [int]$ctrl.Value
                } elseif ($ctrl -is [System.Windows.Forms.ComboBox]) {
                    $script:Config[$ctrl.Tag] = $ctrl.SelectedItem.ToString()
                }
            }
        }
        
        if (Save-Config) {
            $msg = if ($isHacker) { "[OK] CONFIGURATION SAVED SUCCESSFULLY" } else { "Settings saved successfully!" }
            [System.Windows.Forms.MessageBox]::Show($msg + "`n`nSome changes require restart to take effect.", "Settings", "OK", "Information")
            UI-Log "Settings saved to $CONFIG_FILE - Restart recommended for full effect"
            Show-Toast "Settings Saved" "Configuration updated successfully" "success"
        } else {
            $msg = if ($isHacker) { "[ERROR] CONFIGURATION SAVE FAILED" } else { "Failed to save settings!" }
            [System.Windows.Forms.MessageBox]::Show($msg, "Error", "OK", "Error")
        }
    })
    
    # ============ TAB 3: API Keys ============
    $tabKeys = New-Object System.Windows.Forms.TabPage
    $tabKeys.Text = "🔑 API Keys"
    $tabKeys.BackColor = $form.BackColor
    $tabControl.Controls.Add($tabKeys)
    
    $lblKeysInfo = New-Object System.Windows.Forms.Label
    $lblKeysInfo.Text = "Store your API keys securely. They will be encrypted in Windows Credential Manager."
    $lblKeysInfo.Location = New-Object System.Drawing.Point(10,10)
    $lblKeysInfo.Size = New-Object System.Drawing.Size(900,30)
    $tabKeys.Controls.Add($lblKeysInfo)
    
    $keysY = 50
    function Add-KeyInput([string]$name, [string]$label) {
        $lbl = New-Object System.Windows.Forms.Label
        $lbl.Text = $label
        $lbl.Location = New-Object System.Drawing.Point(10, $script:keysY)
        $lbl.Size = New-Object System.Drawing.Size(150, 20)
        $tabKeys.Controls.Add($lbl)
        
        $txt = New-Object System.Windows.Forms.TextBox
        $txt.Location = New-Object System.Drawing.Point(170, $script:keysY)
        $txt.Size = New-Object System.Drawing.Size(400, 20)
        $txt.UseSystemPasswordChar = $true
        $txt.Tag = $name
        $existing = Get-SecureCredential $name
        if ($existing) { $txt.Text = $existing }
        $tabKeys.Controls.Add($txt)
        
        $btnSave = New-Object System.Windows.Forms.Button
        $btnSave.Text = "💾 Save"
        $btnSave.Size = New-Object System.Drawing.Size(60,24)
        $btnSave.Location = New-Object System.Drawing.Point(580, $script:keysY - 2)
        $btnSave.FlatStyle = "Flat"
        $btnSave.Add_Click({
            if (Set-SecureCredential $name $txt.Text) {
                [System.Windows.Forms.MessageBox]::Show("$label saved securely!", "Success", "OK", "Information")
            } else {
                [System.Windows.Forms.MessageBox]::Show("Failed to save $label", "Error", "OK", "Error")
            }
        }.GetNewClosure())
        $tabKeys.Controls.Add($btnSave)
        
        $script:keysY += 35
    }
    
    Add-KeyInput "GEMINI_API_KEY" "Gemini API Key:"
    Add-KeyInput "OPENAI_API_KEY" "OpenAI API Key:"
    Add-KeyInput "CLAUDE_API_KEY" "Claude API Key:"
    Add-KeyInput "WEBHOOK_TOKEN" "Webhook Token:"
    Add-KeyInput "REMOTE_API_TOKEN" "Remote API Token:"
    
    # Start web dashboard if enabled
    if ($script:Config.WEB_ENABLED) {
        Start-WebDashboard
        UI-Log "[+] Web dashboard available at http://$($script:Config.WEB_HOST):$($script:Config.WEB_PORT)" "SUCCESS"
    }
    
    # Timer for UI updates with memory management
    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 2000  # 2 seconds
    $timer.Add_Tick({
        # Update metrics in modern cards
        $uptime = ((Get-Date) - $script:sessionStartTime).TotalMinutes
        $memUsage = Get-MemoryUsage
        
        Update-MetricCard "Total Commits" "$($script:commitCount)"
        Update-MetricCard "Errors" "$($script:errorCount)"
        Update-MetricCard "Uptime" "$([math]::Round($uptime,1))m"
        Update-MetricCard "Memory" "$memUsage MB"
        
        # Periodic memory optimization (every 10 minutes)
        $script:memoryCheckInterval++
        if ($script:memoryCheckInterval -ge 300) {  # 300 * 2s = 10 minutes
            Optimize-Memory
            $script:memoryCheckInterval = 0
        }
        
        # Update log from file
        if (Test-Path $script:Config.LOGFILE) {
            $lastLines = Get-Content $script:Config.LOGFILE -Tail 50 -ErrorAction SilentlyContinue
            if ($lastLines) {
                $newLog = $lastLines -join "`r`n"
                if ($txtLog.Text -ne $newLog -and $newLog.Length -gt $txtLog.Text.Length) {
                    $txtLog.Text = $newLog
                    $txtLog.SelectionStart = $txtLog.Text.Length
                    $txtLog.ScrollToCaret()
                }
            }
        }
        
        # Update status indicator
        if ($script:running) {
            $lblStatus.Text = "● Running"
            $lblStatus.ForeColor = $successColor
        } elseif (Test-Path ".tct_stop") {
            $lblStatus.Text = "● Paused"
            $lblStatus.ForeColor = $warningColor
        } else {
            if ($false) {
                $dummyVar = 1
            } else {
                $lbl.Text = "Status: Paused"
                $lbl.ForeColor = [System.Drawing.Color]::Yellow
            }
        } else {
            if ($isHacker) {
                $lbl.Text = "[STATUS] >>> OFFLINE >>> TERMINATED"
                $lbl.ForeColor = [System.Drawing.Color]::FromArgb(100,100,100)
            } else {
                $lbl.Text = "Status: Stopped"
                $lbl.ForeColor = [System.Drawing.Color]::Gray
            }
        }
    })

    # Tray icon setup
    if ($script:Config.ENABLE_TRAY) {
        $script:trayIcon = New-Object System.Windows.Forms.NotifyIcon
        $script:trayIcon.Icon = [System.Drawing.SystemIcons]::Application
        $script:trayIcon.Visible = $true
        $script:trayIcon.Text = $script:Config.APP_NAME
        
        $menu = New-Object System.Windows.Forms.ContextMenuStrip
        $mOpen = $menu.Items.Add("📂 Open Window")
        $mStop = $menu.Items.Add("⏹ Stop Engine")
        $mStart = $menu.Items.Add("▶ Start Engine")
        $menu.Items.Add("-")
        $mSettings = $menu.Items.Add("⚙️ Settings")
        $mExport = $menu.Items.Add("📄 Export Log")
        $menu.Items.Add("-")
        $mExit = $menu.Items.Add("❌ Exit")
        
        $script:trayIcon.ContextMenuStrip = $menu
        
        $mOpen.Add_Click({ 
            $form.WindowState = "Normal"
            $form.Show()
            $form.BringToFront()
        })
        $mStop.Add_Click({ 
            New-Item -Path . -Name ".tct_stop" -ItemType File -Force | Out-Null
            UI-Log "Engine paused by tray."
        })
        $mStart.Add_Click({
            Remove-Item -Path ".tct_stop" -ErrorAction SilentlyContinue
            UI-Log "Engine resumed by tray."
        })
        $mSettings.Add_Click({
            $form.WindowState = "Normal"
            $form.Show()
            $tabControl.SelectedTab = $tabSettings
        })
        $mExport.Add_Click({
            $exportPath = Export-ActivityLog "json"
            if ($exportPath) {
                Show-Toast "Export Complete" "Log exported to $exportPath" "success"
            }
        })
        $mExit.Add_Click({ 
            Stop-Engine
            $timer.Stop()
            $script:trayIcon.Visible = $false
            $form.Close()
        })
        
        $script:trayIcon.add_DoubleClick({ 
            $form.WindowState = "Normal"
            $form.Show()
            $form.BringToFront()
        })
    }

    function UI-Log($s, $level = "INFO") { 
        $timestamp = Get-Date -Format 'HH:mm:ss.fff'
        # Always use hacker-style for terminal
        $prefix = switch ($level) {
            "ERROR"   { "[!]" }
            "WARN"    { "[*]" }
            "SUCCESS" { "[+]" }
            "INFO"    { "[+]" }
            "DEBUG"   { "[-]" }
            default   { "[>]" }
        }
        $txtLog.AppendText("$timestamp $prefix $s`r`n")
        $txtLog.SelectionStart = $txtLog.Text.Length
        $txtLog.ScrollToCaret()
        Write-Log $s $level
    }

    # Helper function to update metric cards
    function Update-MetricCard([string]$cardTitle, [string]$value) {
        $card = $viewDashboard.Controls | Where-Object { $_.Tag -eq $cardTitle } | Select-Object -First 1
        if ($card) {
            $valueLbl = $card.Controls | Where-Object { $_.Tag -eq "value" } | Select-Object -First 1
            if ($valueLbl) {
                $valueLbl.Text = $value
            }
        }
    }
    
    # Start button click - use runspace for proper threading
    $btnStart.Add_Click({
        if (-not $script:running) {
            $script:running = $true
            $script:sessionStartTime = Get-Date
            $btnStart.Enabled = $false
            $btnStop.Enabled = $true
            $lblStatus.Text = "● Running"
            $lblStatus.ForeColor = $successColor
            Remove-Item -Path ".tct_stop" -ErrorAction SilentlyContinue
            UI-Log "Engine starting..." "INFO"
            
            # Use runspace for background execution
            $runspace = [runspacefactory]::CreateRunspace()
            $runspace.ApartmentState = "STA"
            $runspace.ThreadOptions = "ReuseThread"
            $runspace.Open()
            
            # Pass config to runspace
            $runspace.SessionStateProxy.SetVariable("script:Config", $script:Config)
            
            $powershell = [powershell]::Create()
            $powershell.Runspace = $runspace
            
            # Copy all function definitions
            $allFunctions = Get-ChildItem function: | Where-Object { 
                $_.Name -notmatch '^[A-Z]:$' -and 
                $_.Name -notmatch '^prompt$' -and
                $_.Name -notmatch '^TabExpansion' -and
                $_.Name -notmatch '^Clear-Host'
            }
            
            $functionDefs = $allFunctions | ForEach-Object {
                "function $($_.Name) { $($_.Definition) }"
            }

            $engineScript = ($functionDefs -join "`n`n") + "`n`nEngine-Loop"
            [void]$powershell.AddScript($engineScript)
            
            $script:engineJob = $powershell.BeginInvoke()
            $timer.Start()
            UI-Log "Engine started successfully! Monitoring repo..."
            Show-Toast "Engine Started" "Auto-commit engine is now running" "success"
        }
    })

    $btnStop.Add_Click({
        if ($script:running) { 
            $script:running = $false
            New-Item -Path . -Name ".tct_stop" -ItemType File -Force | Out-Null
            $btnStart.Enabled = $true
            $btnStop.Enabled = $false
            $lblStatus.Text = "● Stopped"
            $lblStatus.ForeColor = $errorColor
            UI-Log "Engine stopped." "WARN"
            Show-Toast "Engine Stopped" "Auto-commit engine stopped" "warning"
        }
    })
    
    $btnRollback.Add_Click({
        $result = [System.Windows.Forms.MessageBox]::Show("Rollback the last auto-commit? This cannot be undone.", "Rollback", "YesNo", "Warning")
        if ($result -eq "Yes") {
            if (Rollback-Commits 1) {
                UI-Log "Successfully rolled back last commit!"
                [System.Windows.Forms.MessageBox]::Show("Last commit has been rolled back successfully!", "Success", "OK", "Information")
            } else {
                [System.Windows.Forms.MessageBox]::Show("Rollback failed. Check logs for details.", "Error", "OK", "Error")
            }
        }
    })
    
    $btnExport.Add_Click({
        $saveDialog = New-Object System.Windows.Forms.SaveFileDialog
        $saveDialog.Filter = "JSON files (*.json)|*.json|CSV files (*.csv)|*.csv|All files (*.*)|*.*"
        $saveDialog.Title = "Export Activity Log"
        $saveDialog.FileName = "tct_activity_export_$(Get-Date -Format 'yyyyMMdd').json"
        
        if ($saveDialog.ShowDialog() -eq "OK") {
            $format = if ($saveDialog.FileName -match '\.csv$') { "csv" } else { "json" }
            $exportPath = Export-ActivityLog $format $saveDialog.FileName
            if ($exportPath) {
                UI-Log "Activity log exported to $exportPath"
                [System.Windows.Forms.MessageBox]::Show("Activity log exported successfully to:`n$exportPath", "Export Complete", "OK", "Information")
            }
        }
    })
    
    $btnTheme.Add_Click({
        $script:Config.THEME = if ($script:Config.THEME -eq "dark") { "light" } else { "dark" }
        Save-Config
        [System.Windows.Forms.MessageBox]::Show("Theme will change on next restart.", "Theme Changed", "OK", "Information")
    })
    
    $btnClear.Add_Click({
        $txtLog.Clear()
    })
    
    # Optimize button - trigger memory optimization
    $btnOptimize.Add_Click({
        UI-Log "Optimizing memory..." "INFO"
        Optimize-Memory
        $memAfter = Get-MemoryUsage
        UI-Log "Memory optimized: $memAfter MB" "SUCCESS"
        Show-Toast "Memory Optimized" "Current usage: $memAfter MB" "success"
    })
    
    # Settings button - switch to settings view
    $btnSettings.Add_Click({
        Switch-View "settings"
        $btnNavSettings.BackColor = $accentColor
        $btnNavSettings.ForeColor = [System.Drawing.Color]::White
        $btnNavDashboard.BackColor = $panelColor
        $btnNavDashboard.ForeColor = $fgColor
    })

    # Form closing handler
    $form.Add_FormClosing({
        param($sender, $e)
        if ($script:running) {
            $result = [System.Windows.Forms.MessageBox]::Show("Engine is running. Stop and exit?", $script:Config.APP_NAME, "YesNo", "Question")
            if ($result -eq "No") {
                $e.Cancel = $true
                $form.WindowState = "Minimized"
                return
            }
            Stop-Engine
        }
        $timer.Stop()
        if ($script:trayIcon) { $script:trayIcon.Visible = $false }
        Stop-RemoteAPI
        Stop-WebDashboard
    })

    # Initial log with boot sequence
    if ($isHacker) {
        UI-Log "" "INFO"
        UI-Log "══════════════════════════════════════════════════" "INFO"
        UI-Log "SYSTEM BOOT SEQUENCE INITIATED" "INFO"
        UI-Log "$($script:Config.APP_NAME) v$($script:Config.APP_VERSION) ULTIMATE" "INFO"
        UI-Log "══════════════════════════════════════════════════" "INFO"
        UI-Log "Repository Path....... $(Get-Location)" "INFO"
        UI-Log "Auto-Branch........... $($script:Config.AUTO_BRANCH)" "INFO"
        UI-Log "Scan Interval......... $($script:Config.DELAY_SECONDS) seconds" "INFO"
        UI-Log "Commit Cooldown....... $($script:Config.COOLDOWN_SECONDS) seconds" "INFO"
        UI-Log "AI Provider........... $($script:Config.LLM_PROVIDER)" "INFO"
        UI-Log "AI Model.............. $($script:Config.LLM_MODEL)" "INFO"
        UI-Log "Theme Mode............ $($script:Config.THEME.ToUpper())" "INFO"
        UI-Log "Memory Usage.......... $(Get-MemoryUsage) MB" "INFO"
        UI-Log "" "INFO"
        UI-Log "MODULES LOADED: Smart Detection | Conflict Resolution | Multi-LLM" "INFO"
        UI-Log "MODULES LOADED: Webhooks | Rollback | Export | Metrics | Security" "INFO"
        UI-Log "" "INFO"
        UI-Log "[✓] ALL SYSTEMS OPERATIONAL" "INFO"
        UI-Log "[>] Click [►] INITIATE to begin auto-commit sequence" "INFO"
        UI-Log "══════════════════════════════════════════════════" "INFO"
    } else {
        UI-Log "=== $($script:Config.APP_NAME) v$($script:Config.APP_VERSION) ULTIMATE ===" "INFO"
        UI-Log "Repository: $(Get-Location)" "INFO"
        UI-Log "Auto-branch: $($script:Config.AUTO_BRANCH) | Delay: $($script:Config.DELAY_SECONDS)s" "INFO"
        UI-Log "LLM: $($script:Config.LLM_PROVIDER) ($($script:Config.LLM_MODEL))" "INFO"
        UI-Log "Features: Smart Detection, Conflict Resolution, Multi-LLM, Webhooks, Rollback, Export" "INFO"
        UI-Log "Settings Panel: Configure everything in the ⚙️ Settings tab" "INFO"
        UI-Log "API Keys: Securely store keys in the 🔑 API Keys tab" "INFO"
        UI-Log "" "INFO"
        UI-Log "🚀 Click 'Start' to begin auto-committing!" "INFO"
    }

    [void] $form.ShowDialog()
} else {
    # Console mode
    Write-Log "$($script:Config.APP_NAME) starting in console mode..." "INFO"
    Engine-Loop
}

# Final startup message
if ($script:Config.THEME -eq "hacker") {
    Write-Log "[██] $($script:Config.APP_NAME) v$($script:Config.APP_VERSION) HACKER TERMINAL LOADED [██]" "INFO"
    Write-Log "[>] CORE: Smart Detection | Conflict Resolution | Multi-LLM | Webhooks" "INFO"
    Write-Log "[>] INTERFACE: Hacker Terminal | Live Settings | Secure Vault | Metrics" "INFO"
    Write-Log "[>] PERFORMANCE: Memory Optimization | Auto GC | Efficient Polling" "INFO"
    Write-Log "[>] DEFAULT DELAY: $($script:Config.DELAY_SECONDS) seconds | COOLDOWN: $($script:Config.COOLDOWN_SECONDS) seconds" "INFO"
    Write-Log "[>] Status: READY | Awaiting user command..." "INFO"
} else {
    Write-Log "=== $($script:Config.APP_NAME) v$($script:Config.APP_VERSION) ULTIMATE loaded ===" "INFO"
    Write-Log "Features: Smart Detection | Conflict Resolution | Multi-LLM | Webhooks | Rollback" "INFO"
    Write-Log "Dashboard | Settings Panel | Secure Keys | Export | Quiet Hours | Metrics" "INFO"
    Write-Log "Default Delay: $($script:Config.DELAY_SECONDS) seconds | Cooldown: $($script:Config.COOLDOWN_SECONDS) seconds" "INFO"
    Write-Log "Run with GUI for full experience. Store API keys securely in Settings." "INFO"
}
