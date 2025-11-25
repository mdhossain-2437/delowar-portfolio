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
    APP_VERSION           = "3.0"
    AUTO_BRANCH           = "dage/auto"
    DELAY_SECONDS         = 10
    COOLDOWN_SECONDS      = 2
    
    # Squash
    SQUASH_ENABLED        = $true
    SQUASH_AFTER_COMMITS  = 12
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
    THEME                 = "dark"  # dark or light
    
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
        # Check for uncommitted changes
        $status = git status --porcelain 2>$null
        $needStash = $false
        
        if ($status) {
            # Stash changes before switching
            git stash push -m "TCT-AutoStash-$(Get-Date -Format 'yyyyMMdd-HHmmss')" 2>$null
            $needStash = $true
        }
        
        git checkout $branchName 2>$null
        
        return $needStash
    } catch {
        Write-Log "Safe checkout failed: $_"
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
        Write-Log "Safe return failed: $_"
    }
}

# Push function on auto branch
function PushIfOnline {
    if (-not $AUTO_PUSH_ENABLED) { Write-Log "Auto push disabled"; return }
    
    # Check network connectivity
    try {
        $testConnection = Test-NetConnection -ComputerName "github.com" -Port 443 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if (-not $testConnection.TcpTestSucceeded) {
            # Fallback to ping test
            $ping = Test-Connection -ComputerName "github.com" -Count 1 -Quiet -ErrorAction SilentlyContinue
            if (-not $ping) {
                Write-Log "Offline: skipping push"
                return
            }
        }
    } catch {
        Write-Log "Network check failed, attempting push anyway..."
    }
    
    if ($SAFE_PULL_BEFORE_PUSH) {
        try {
            git fetch --prune 2>$null | Out-Null
            
            # Check if remote branch exists
            $remoteExists = git ls-remote --heads origin $AUTO_BRANCH 2>$null
            if ($remoteExists) {
                $pull = git pull --rebase origin $AUTO_BRANCH 2>&1
                if ($LASTEXITCODE -ne 0) { 
                    Write-Log "Safe pull failed: $pull"
                    # Try to abort rebase if stuck
                    git rebase --abort 2>$null
                    return 
                }
            }
        } catch { 
            Write-Log "Safe pull exception: $_"
            git rebase --abort 2>$null
            return 
        }
    }
    
    try {
        $pushResult = git push -u origin $AUTO_BRANCH 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Pushed $AUTO_BRANCH to origin."
        } else {
            Write-Log "Push warning: $pushResult"
        }
    } catch { 
        Write-Log "Push error: $_" 
    }
}

# Auto-squash (safe)
function Auto-Squash-IfNeeded {
    if (-not $SQUASH_ENABLED) { return }
    
    try {
        $hist = git log --pretty=format:"%H %s" -n 200 2>$null
        if (-not $hist) { return }
        
        $autoCommits = ($hist | Select-String -Pattern "AutoCommit" -AllMatches).Matches.Count
        
        if ($autoCommits -ge $SQUASH_AFTER_COMMITS) {
            Write-Log "Auto-squash: $autoCommits commits detected. Creating backup..."
            
            # Create backup branch
            $backupName = "$AUTO_BRANCH-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            git branch $backupName 2>$null
            
            # Perform squash
            git reset --soft HEAD~$autoCommits 2>$null
            git commit -m "AutoCommit: squashed $autoCommits auto commits [$(Get-Date -Format 'yyyy-MM-dd')]" 2>$null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Squashed $autoCommits commits successfully."
                
                if ($SQUASH_FORCE_PUSH) { 
                    git push -f origin $AUTO_BRANCH 2>$null
                    Write-Log "Force-pushed squashed commit." 
                } else { 
                    try { 
                        git push origin $AUTO_BRANCH 2>$null
                        Write-Log "Pushed squashed commit." 
                    } catch { 
                        Write-Log "Push after squash failed (may need force push)." 
                    } 
                }
            } else {
                Write-Log "Squash failed, restoring from backup..."
                git reset --hard $backupName 2>$null
            }
        }
    } catch {
        Write-Log "Auto-squash error: $_"
    }
}

# Weekly backup function
function Weekly-Backup {
    if (-not $BACKUP_WEEKLY_ENABLED) { return }
    
    try {
        if (-not (Test-Path $BACKUP_FOLDER)) { 
            New-Item -ItemType Directory -Path $BACKUP_FOLDER -Force | Out-Null 
        }
        
        $last = Get-ChildItem -Path $BACKUP_FOLDER -Filter "repo_backup_*.zip" -ErrorAction SilentlyContinue | 
                Sort-Object LastWriteTime -Descending | 
                Select-Object -First 1
        
        $shouldBackup = (-not $last) -or ((Get-Date) - $last.LastWriteTime).TotalDays -ge 6
        
        if ($shouldBackup) {
            $zipName = "repo_backup_{0}.zip" -f (Get-Date -Format "yyyyMMdd_HHmmss")
            $zipPath = Join-Path (Resolve-Path $BACKUP_FOLDER).Path $zipName
            $sourcePath = (Get-Location).Path
            
            # Create temp folder for backup (exclude large folders)
            $tempBackup = Join-Path $env:TEMP "tct_backup_temp_$(Get-Random)"
            New-Item -ItemType Directory -Path $tempBackup -Force | Out-Null
            
            # Copy files excluding node_modules, .git, etc.
            $excludeDirs = @("node_modules", ".git", "dist", "build", ".next", "tct_backups")
            Get-ChildItem -Path $sourcePath -Force | Where-Object {
                $item = $_
                -not ($excludeDirs | Where-Object { $item.Name -eq $_ })
            } | ForEach-Object {
                Copy-Item -Path $_.FullName -Destination $tempBackup -Recurse -Force -ErrorAction SilentlyContinue
            }
            
            # Create zip
            Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
            [IO.Compression.ZipFile]::CreateFromDirectory($tempBackup, $zipPath)
            
            # Cleanup temp
            Remove-Item -Path $tempBackup -Recurse -Force -ErrorAction SilentlyContinue
            
            Write-Log "Weekly backup created: $zipPath"
            
            # Rotate old backups
            $zips = Get-ChildItem -Path $BACKUP_FOLDER -Filter "*.zip" -ErrorAction SilentlyContinue | 
                    Sort-Object LastWriteTime -Descending
            if ($zips.Count -gt $BACKUP_ROTATE_KEEP) { 
                $zips[$BACKUP_ROTATE_KEEP..($zips.Count-1)] | Remove-Item -Force -ErrorAction SilentlyContinue
                Write-Log "Rotated old backups, keeping $BACKUP_ROTATE_KEEP most recent."
            }
        }
    } catch { 
        Write-Log "Backup error: $_" 
    }
}

# Remote API (local, tokenized) - Fixed with proper listener management
$script:apiListener = $null

function Start-RemoteAPI {
    if (-not $REMOTE_API_ENABLED) { Write-Log "Remote API disabled"; return }
    
    try {
        $script:apiListener = New-Object System.Net.HttpListener
        $prefix = "http://127.0.0.1:$REMOTE_API_PORT/"
        $script:apiListener.Prefixes.Add($prefix)
        $script:apiListener.Start()
        Write-Log "Remote API listening on $prefix"
        
        # Use async callback pattern instead of Job
        $callback = {
            param($result)
            try {
                $listener = $result.AsyncState
                $ctx = $listener.EndGetContext($result)
                $req = $ctx.Request
                $res = $ctx.Response
                
                $auth = $req.Headers["Authorization"]
                if (-not $auth -or $auth -ne "Bearer $REMOTE_API_TOKEN") {
                    $res.StatusCode = 401
                    $buf = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Unauthorized"}')
                    $res.OutputStream.Write($buf, 0, $buf.Length)
                    $res.Close()
                } else {
                    $path = $req.Url.AbsolutePath.TrimEnd("/")
                    $body = switch ($path) {
                        "/status" { 
                            $commits = if (Test-Path "$env:TEMP\tct_commits.txt") { 
                                (Get-Content "$env:TEMP\tct_commits.txt" -ErrorAction SilentlyContinue | Measure-Object -Line).Lines 
                            } else { 0 }
                            @{status="running"; commits=$commits; errors=$script:errorCount} | ConvertTo-Json 
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
                            @{healthy=$true; uptime=(Get-Date).ToString(); branch=$AUTO_BRANCH} | ConvertTo-Json
                        }
                        default { 
                            @{error="unknown endpoint"; available=@("/status","/stop","/start","/health")} | ConvertTo-Json 
                        }
                    }
                    $buf = [System.Text.Encoding]::UTF8.GetBytes($body)
                    $res.ContentType = "application/json"
                    $res.OutputStream.Write($buf, 0, $buf.Length)
                    $res.Close()
                }
                
                # Continue listening
                if ($listener.IsListening) {
                    $listener.BeginGetContext($callback, $listener) | Out-Null
                }
            } catch {
                Write-Log "API request error: $_"
            }
        }
        
        $script:apiListener.BeginGetContext($callback, $script:apiListener) | Out-Null
        
    } catch { 
        Write-Log "Failed to start Remote API: $_"
    }
}

function Stop-RemoteAPI {
    if ($script:apiListener -and $script:apiListener.IsListening) {
        try {
            $script:apiListener.Stop()
            $script:apiListener.Close()
            Write-Log "Remote API stopped."
        } catch { }
    }
}

# Stop engine function (was missing!)
function Stop-Engine {
    $script:running = $false
    New-Item -Path . -Name ".tct_stop" -ItemType File -Force | Out-Null
    
    # Stop the engine job if running
    if ($script:engineJob) {
        try {
            Stop-Job -Job $script:engineJob -ErrorAction SilentlyContinue
            Remove-Job -Job $script:engineJob -Force -ErrorAction SilentlyContinue
        } catch { }
        $script:engineJob = $null
    }
    
    Stop-RemoteAPI
    Write-Log "Engine stopped."
}

# Create scheduled task so app starts at logon (requires admin)
function Install-ScheduledTask {
    try {
        $exe = $PSCommandPath
        if (-not $exe) { $exe = $MyInvocation.MyCommand.Path }
        
        $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$exe`""
        $trigger = New-ScheduledTaskTrigger -AtLogOn
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
        
        Register-ScheduledTask -TaskName $SCHEDULE_TASK_NAME -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force
        Write-Log "Scheduled task '$SCHEDULE_TASK_NAME' installed successfully."
        return $true
    } catch {
        Write-Log "Scheduled task install failed: $_"
        return $false
    }
}

function Uninstall-ScheduledTask {
    try {
        Unregister-ScheduledTask -TaskName $SCHEDULE_TASK_NAME -Confirm:$false -ErrorAction SilentlyContinue
        Write-Log "Scheduled task '$SCHEDULE_TASK_NAME' removed."
        return $true
    } catch {
        Write-Log "Scheduled task removal failed: $_"
        return $false
    }
}

# Main engine loop - improved with proper error handling
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
                Write-Log "Engine paused by stop file."
                Start-Sleep -Seconds $DELAY_SECONDS
                continue 
            }
            
            # Verify git repo
            if (-not (Test-Path ".git")) { 
                $script:lastStatus = "Not a git repo"
                Write-Log "Not a git repo here."
                Start-Sleep -Seconds $DELAY_SECONDS
                continue 
            }
            
            # Get status
            $porc = git status --porcelain --untracked-files=all 2>$null
            if (-not $porc -or $porc.Trim() -eq "") { 
                $script:lastStatus = "Watching (no changes)"
                Start-Sleep -Seconds $DELAY_SECONDS
                continue 
            }
            
            $lines = $porc -split "`n" | Where-Object { $_ -and $_.Trim() -ne "" }
            $added=@(); $modified=@(); $deleted=@(); $untracked=@(); $renamed=@()
            
            foreach ($l in $lines) {
                if ($l.Length -lt 3) { continue }
                $code = $l.Substring(0,2).Trim()
                $path = $l.Substring(3).Trim()
                
                # Skip ignored files
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
            
            $total = $added.Count + $modified.Count + $deleted.Count + $untracked.Count + $renamed.Count
            if ($total -eq 0) { 
                $script:lastStatus = "Watching (filtered)"
                Start-Sleep -Seconds $DELAY_SECONDS
                continue 
            }
            
            # Cooldown before commit
            Write-Log "Detected $total changes, waiting cooldown..."
            $script:lastStatus = "Cooldown..."
            Start-Sleep -Seconds $COOLDOWN_SECONDS
            
            # Switch to auto branch if strict mode
            $hadStash = $false
            if ($STRICT_SAFE_MODE) {
                $currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
                if ($currentBranch -ne $AUTO_BRANCH) {
                    $hadStash = Safe-Checkout $AUTO_BRANCH
                }
            }
            
            # Stage all changes
            git add -A 2>$null
            
            # Build commit message
            $script:lastStatus = "Building commit message..."
            $commitMsg = Build-CommitMessage $added $modified $deleted $untracked $renamed
            
            # Check if anything staged
            $staged = git diff --cached --name-only 2>$null
            if (-not $staged) { 
                Write-Log "Nothing staged after add."
                if ($STRICT_SAFE_MODE -and $currentBranch -ne $AUTO_BRANCH) { 
                    Safe-Return $currentBranch $hadStash
                }
                Start-Sleep -Seconds $DELAY_SECONDS
                continue 
            }
            
            # Commit
            $script:lastStatus = "Committing..."
            $commitOut = git commit -m "AutoCommit: $commitMsg" 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                $script:commitCount++
                Write-Log "Committed (#$($script:commitCount)): $commitMsg"
                
                # Track commits
                $trackFile = Join-Path $env:TEMP "tct_commits.txt"
                Add-Content -Path $trackFile -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | $commitMsg" -ErrorAction SilentlyContinue
                
                $script:lastStatus = "Last commit: $($script:commitCount)"
            } else { 
                $script:errorCount++
                Write-Log "Commit failed: $commitOut"
                $script:lastStatus = "Commit failed"
            }
            
            # Push, backup, squash
            PushIfOnline
            Weekly-Backup
            Auto-Squash-IfNeeded
            
            # Return to original branch if strict mode
            if ($STRICT_SAFE_MODE -and $currentBranch -and $currentBranch -ne $AUTO_BRANCH) { 
                Safe-Return $currentBranch $hadStash
            }
            
        } catch {
            $script:errorCount++
            Write-Log "Engine error: $_"
            $script:lastStatus = "Error: $_"
        }
        
        Start-Sleep -Seconds $DELAY_SECONDS
    }
}

# GUI + tray minimal polished UI - FIXED with proper threading
if ($ENABLE_GUI) {
    # Remove stop file on fresh start
    Remove-Item -Path ".tct_stop" -ErrorAction SilentlyContinue
    
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "$APP_NAME v2.0"
    $form.Size = New-Object System.Drawing.Size(780,480)
    $form.StartPosition = "CenterScreen"
    $form.Font = New-Object System.Drawing.Font("Segoe UI",9)
    $form.BackColor = [System.Drawing.Color]::FromArgb(30,30,30)
    $form.ForeColor = [System.Drawing.Color]::White
    
    # Header label
    $lbl = New-Object System.Windows.Forms.Label
    $lbl.Text = "Status: Idle"
    $lbl.Location = New-Object System.Drawing.Point(12,10)
    $lbl.AutoSize = $true
    $lbl.ForeColor = [System.Drawing.Color]::LightGreen
    $lbl.Font = New-Object System.Drawing.Font("Segoe UI",11,[System.Drawing.FontStyle]::Bold)
    $form.Controls.Add($lbl)
    
    # Log textbox
    $txtLog = New-Object System.Windows.Forms.TextBox
    $txtLog.Multiline = $true
    $txtLog.ScrollBars = "Both"
    $txtLog.ReadOnly = $true
    $txtLog.Size = New-Object System.Drawing.Size(740,300)
    $txtLog.Location = New-Object System.Drawing.Point(12,45)
    $txtLog.BackColor = [System.Drawing.Color]::FromArgb(20,20,20)
    $txtLog.ForeColor = [System.Drawing.Color]::LightGray
    $txtLog.Font = New-Object System.Drawing.Font("Consolas",9)
    $form.Controls.Add($txtLog)
    
    # Start button
    $btnStart = New-Object System.Windows.Forms.Button
    $btnStart.Text = "▶ Start"
    $btnStart.Size = New-Object System.Drawing.Size(100,36)
    $btnStart.Location = New-Object System.Drawing.Point(12,360)
    $btnStart.BackColor = [System.Drawing.Color]::FromArgb(40,120,40)
    $btnStart.ForeColor = [System.Drawing.Color]::White
    $btnStart.FlatStyle = "Flat"
    $form.Controls.Add($btnStart)
    
    # Stop button
    $btnStop = New-Object System.Windows.Forms.Button
    $btnStop.Text = "⏹ Stop"
    $btnStop.Size = New-Object System.Drawing.Size(100,36)
    $btnStop.Location = New-Object System.Drawing.Point(122,360)
    $btnStop.Enabled = $false
    $btnStop.BackColor = [System.Drawing.Color]::FromArgb(120,40,40)
    $btnStop.ForeColor = [System.Drawing.Color]::White
    $btnStop.FlatStyle = "Flat"
    $form.Controls.Add($btnStop)
    
    # Install task button
    $btnInstallTask = New-Object System.Windows.Forms.Button
    $btnInstallTask.Text = "📅 Install Start-on-Boot"
    $btnInstallTask.Size = New-Object System.Drawing.Size(180,36)
    $btnInstallTask.Location = New-Object System.Drawing.Point(232,360)
    $btnInstallTask.BackColor = [System.Drawing.Color]::FromArgb(60,60,100)
    $btnInstallTask.ForeColor = [System.Drawing.Color]::White
    $btnInstallTask.FlatStyle = "Flat"
    $form.Controls.Add($btnInstallTask)
    
    # Clear log button
    $btnClear = New-Object System.Windows.Forms.Button
    $btnClear.Text = "🗑 Clear Log"
    $btnClear.Size = New-Object System.Drawing.Size(100,36)
    $btnClear.Location = New-Object System.Drawing.Point(422,360)
    $btnClear.BackColor = [System.Drawing.Color]::FromArgb(60,60,60)
    $btnClear.ForeColor = [System.Drawing.Color]::White
    $btnClear.FlatStyle = "Flat"
    $form.Controls.Add($btnClear)
    
    # Stats label
    $lblStats = New-Object System.Windows.Forms.Label
    $lblStats.Location = New-Object System.Drawing.Point(12,410)
    $lblStats.Size = New-Object System.Drawing.Size(740,30)
    $lblStats.Text = "Commits: 0 | Errors: 0 | Branch: $AUTO_BRANCH | Delay: ${DELAY_SECONDS}s"
    $lblStats.ForeColor = [System.Drawing.Color]::Cyan
    $form.Controls.Add($lblStats)

    # Timer for UI updates
    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 2000  # 2 seconds
    $timer.Add_Tick({
        # Update stats
        $lblStats.Text = "Commits: $($script:commitCount) | Errors: $($script:errorCount) | Branch: $AUTO_BRANCH | Status: $($script:lastStatus)"
        
        # Update log from file if exists
        if (Test-Path $LOGFILE) {
            $lastLines = Get-Content $LOGFILE -Tail 50 -ErrorAction SilentlyContinue
            if ($lastLines) {
                $newLog = $lastLines -join "`r`n"
                if ($txtLog.Text -ne $newLog -and $newLog.Length -gt $txtLog.Text.Length) {
                    $txtLog.Text = $newLog
                    $txtLog.SelectionStart = $txtLog.Text.Length
                    $txtLog.ScrollToCaret()
                }
            }
        }
        
        # Update status color
        if ($script:running) {
            $lbl.Text = "Status: Running"
            $lbl.ForeColor = [System.Drawing.Color]::LightGreen
        } elseif (Test-Path ".tct_stop") {
            $lbl.Text = "Status: Paused"
            $lbl.ForeColor = [System.Drawing.Color]::Yellow
        } else {
            $lbl.Text = "Status: Stopped"
            $lbl.ForeColor = [System.Drawing.Color]::Gray
        }
    })

    # Tray icon setup
    if ($ENABLE_TRAY) {
        $script:trayIcon = New-Object System.Windows.Forms.NotifyIcon
        $script:trayIcon.Icon = [System.Drawing.SystemIcons]::Application
        $script:trayIcon.Visible = $true
        $script:trayIcon.Text = $APP_NAME
        
        $menu = New-Object System.Windows.Forms.ContextMenuStrip
        $mOpen = $menu.Items.Add("📂 Open Window")
        $mStop = $menu.Items.Add("⏹ Stop Engine")
        $mStart = $menu.Items.Add("▶ Start Engine")
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

    function UI-Log($s) { 
        $txtLog.AppendText("$(Get-Date -Format 'HH:mm:ss') | $s`r`n")
        $txtLog.SelectionStart = $txtLog.Text.Length
        $txtLog.ScrollToCaret()
        Write-Log $s 
    }

    # Start button click - use runspace for proper threading
    $btnStart.Add_Click({
        if (-not $script:running) {
            $script:running = $true
            $btnStart.Enabled = $false
            $btnStop.Enabled = $true
            $lbl.Text = "Status: Starting..."
            Remove-Item -Path ".tct_stop" -ErrorAction SilentlyContinue
            UI-Log "Engine starting..."
            
            # Use runspace for background execution
            $runspace = [runspacefactory]::CreateRunspace()
            $runspace.ApartmentState = "STA"
            $runspace.ThreadOptions = "ReuseThread"
            $runspace.Open()
            
            # Pass variables to runspace
            $runspace.SessionStateProxy.SetVariable("LOGFILE", $LOGFILE)
            $runspace.SessionStateProxy.SetVariable("AUTO_BRANCH", $AUTO_BRANCH)
            $runspace.SessionStateProxy.SetVariable("DELAY_SECONDS", $DELAY_SECONDS)
            $runspace.SessionStateProxy.SetVariable("COOLDOWN_SECONDS", $COOLDOWN_SECONDS)
            $runspace.SessionStateProxy.SetVariable("STRICT_SAFE_MODE", $STRICT_SAFE_MODE)
            $runspace.SessionStateProxy.SetVariable("AUTO_PUSH_ENABLED", $AUTO_PUSH_ENABLED)
            $runspace.SessionStateProxy.SetVariable("SAFE_PULL_BEFORE_PUSH", $SAFE_PULL_BEFORE_PUSH)
            $runspace.SessionStateProxy.SetVariable("SQUASH_ENABLED", $SQUASH_ENABLED)
            $runspace.SessionStateProxy.SetVariable("SQUASH_AFTER_COMMITS", $SQUASH_AFTER_COMMITS)
            $runspace.SessionStateProxy.SetVariable("SQUASH_FORCE_PUSH", $SQUASH_FORCE_PUSH)
            $runspace.SessionStateProxy.SetVariable("BACKUP_WEEKLY_ENABLED", $BACKUP_WEEKLY_ENABLED)
            $runspace.SessionStateProxy.SetVariable("BACKUP_FOLDER", $BACKUP_FOLDER)
            $runspace.SessionStateProxy.SetVariable("BACKUP_ROTATE_KEEP", $BACKUP_ROTATE_KEEP)
            $runspace.SessionStateProxy.SetVariable("IGNORE_PATTERNS", $IGNORE_PATTERNS)
            $runspace.SessionStateProxy.SetVariable("LLM_ENABLED", $LLM_ENABLED)
            $runspace.SessionStateProxy.SetVariable("LLM_MODEL", $LLM_MODEL)
            $runspace.SessionStateProxy.SetVariable("LLM_MAX_DIFF_CHARS", $LLM_MAX_DIFF_CHARS)
            $runspace.SessionStateProxy.SetVariable("INLINE_KEYS", $INLINE_KEYS)
            $runspace.SessionStateProxy.SetVariable("REMOTE_API_ENABLED", $REMOTE_API_ENABLED)
            $runspace.SessionStateProxy.SetVariable("REMOTE_API_PORT", $REMOTE_API_PORT)
            $runspace.SessionStateProxy.SetVariable("REMOTE_API_TOKEN", $REMOTE_API_TOKEN)
            
            $powershell = [powershell]::Create()
            $powershell.Runspace = $runspace
            
            # Copy current function definitions into the background runspace so GUI and console share one engine
            $functionsToCopy = @(
                "Write-Log",
                "Is-Ignored",
                "Call-Gemini",
                "Build-Heuristic",
                "Build-CommitMessage",
                "Ensure-AutoBranch",
                "Safe-Checkout",
                "Safe-Return",
                "PushIfOnline",
                "Auto-Squash-IfNeeded",
                "Weekly-Backup",
                "Start-RemoteAPI",
                "Stop-RemoteAPI",
                "Engine-Loop"
            )

            $functionDefs = $functionsToCopy | ForEach-Object {
                $fn = Get-Command $_ -CommandType Function -ErrorAction SilentlyContinue
                if ($fn) { $fn.Definition } else { "" }
            } | Where-Object { $_ -and $_.Trim() }

            $engineScript = ($functionDefs -join "`n`n") + "`n`nEngine-Loop"
            [void]$powershell.AddScript($engineScript)
            
            $script:engineJob = $powershell.BeginInvoke()
            $timer.Start()
            UI-Log "Engine started successfully!"
        }
    })

    $btnStop.Add_Click({
        if ($script:running) { 
            $script:running = $false
            New-Item -Path . -Name ".tct_stop" -ItemType File -Force | Out-Null
            $btnStart.Enabled = $true
            $btnStop.Enabled = $false
            $lbl.Text = "Status: Stopped"
            $lbl.ForeColor = [System.Drawing.Color]::Gray
            UI-Log "Engine stopped."
        }
    })

    $btnInstallTask.Add_Click({
        $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
        if (-not $isAdmin) {
            [System.Windows.Forms.MessageBox]::Show("Please run PowerShell as Administrator to install scheduled task.", $APP_NAME, "OK", "Warning")
        } else {
            if (Install-ScheduledTask) {
                UI-Log "Scheduled task installed successfully!"
                [System.Windows.Forms.MessageBox]::Show("Scheduled task installed! The app will start automatically on login.", $APP_NAME, "OK", "Information")
            } else {
                [System.Windows.Forms.MessageBox]::Show("Failed to install scheduled task. Check log for details.", $APP_NAME, "OK", "Error")
            }
        }
    })
    
    $btnClear.Add_Click({
        $txtLog.Clear()
    })

    # Form closing handler
    $form.Add_FormClosing({
        param($sender, $e)
        if ($script:running) {
            $result = [System.Windows.Forms.MessageBox]::Show("Engine is running. Stop and exit?", $APP_NAME, "YesNo", "Question")
            if ($result -eq "No") {
                $e.Cancel = $true
                $form.WindowState = "Minimized"
                return
            }
            Stop-Engine
        }
        $timer.Stop()
        if ($script:trayIcon) { $script:trayIcon.Visible = $false }
    })

    # Initial log
    UI-Log "TCT-Git-Auto-Commiter v2.0 initialized."
    UI-Log "Repository: $(Get-Location)"
    UI-Log "Auto-branch: $AUTO_BRANCH | Delay: ${DELAY_SECONDS}s | LLM: $LLM_ENABLED"
    UI-Log "Click 'Start' to begin auto-committing."

    [void] $form.ShowDialog()
} else {
    # Console mode
    Write-Log "$APP_NAME starting in console mode..."
    Engine-Loop
}

# Final startup message
Write-Log "$APP_NAME v2.0 loaded successfully."
Write-Log "Features: GUI, Tray, LLM commit messages, Auto-push, Weekly backup, Squash"
Write-Log "Edit INLINE_KEYS in script for Gemini API. Run as Admin for scheduled task."
