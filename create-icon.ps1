# Create TCT Icon for EXE
Add-Type -AssemblyName System.Drawing

# Create 256x256 bitmap
$size = 256
$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# Fill background with dark gray
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 30, 30))
$graphics.FillRectangle($bgBrush, 0, 0, $size, $size)

# Draw blue circle background
$blueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 122, 204))
$graphics.FillEllipse($blueBrush, 20, 20, 216, 216)

# Draw TCT text
$font = New-Object System.Drawing.Font("Arial", 72, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$graphics.DrawString("TCT", $font, $textBrush, 128, 128, $format)

# Save as PNG first
$pngPath = Join-Path $PSScriptRoot "tct-icon.png"
$bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "PNG icon created: $pngPath" -ForegroundColor Green

# Convert PNG to ICO using .NET
try {
    # Create ICO file manually with multiple sizes
    $icoPath = Join-Path $PSScriptRoot "tct-icon.ico"
    
    # Create smaller versions
    $sizes = @(256, 128, 64, 48, 32, 16)
    $icons = @()
    
    foreach ($s in $sizes) {
        $smallBitmap = New-Object System.Drawing.Bitmap $s, $s
        $smallGraphics = [System.Drawing.Graphics]::FromImage($smallBitmap)
        $smallGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $smallGraphics.DrawImage($bitmap, 0, 0, $s, $s)
        $icons += $smallBitmap
        $smallGraphics.Dispose()
    }
    
    # Save as ICO
    $icon = [System.Drawing.Icon]::FromHandle($bitmap.GetHicon())
    $stream = [System.IO.File]::Create($icoPath)
    $icon.Save($stream)
    $stream.Close()
    
    Write-Host "ICO icon created: $icoPath" -ForegroundColor Green
    
    # Cleanup
    foreach ($ico in $icons) { $ico.Dispose() }
    
} catch {
    Write-Host "Note: ICO creation requires admin rights or use online converter" -ForegroundColor Yellow
    Write-Host "You can convert $pngPath to ICO at: https://icoconvert.com/" -ForegroundColor Yellow
}

# Cleanup
$graphics.Dispose()
$bitmap.Dispose()
$bgBrush.Dispose()
$blueBrush.Dispose()
$textBrush.Dispose()
$font.Dispose()

Write-Host "`nIcon generation complete!" -ForegroundColor Green
