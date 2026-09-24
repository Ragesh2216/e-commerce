Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$htmlPath = 'c:\Users\ADMIN\Desktop\e-commerce\generate_canvas.html'
$outputDir = 'c:\Users\ADMIN\Desktop\e-commerce\assets\images'

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir
}

$wb = New-Object System.Windows.Forms.WebBrowser
$wb.ScriptErrorsSuppressed = $true
$wb.Navigate((New-Object System.Uri($htmlPath)).AbsoluteUri)

while ($wb.ReadyState -ne 'Complete') {
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Milliseconds 100
}

# Give canvas extra time to render
Start-Sleep -Seconds 2

$doc = $wb.Document
$divs = $doc.GetElementsByTagName('div')

foreach ($div in $divs) {
    if ($div.GetAttribute('className') -eq 'img-data') {
        $fileName = $div.GetAttribute('data-filename')
        $dataUrl = $div.InnerText
        if ($dataUrl -and $dataUrl.StartsWith('data:image/webp;base64,')) {
            $base64 = $dataUrl.Replace('data:image/webp;base64,', '')
            $bytes = [System.Convert]::FromBase64String($base64)
            $filePath = Join-Path $outputDir $fileName
            [System.IO.File]::WriteAllBytes($filePath, $bytes)
            $sizeKb = [math]::Round(($bytes.Length / 1KB), 2)
            Write-Host "Generated $fileName ($sizeKb KB)"
        }
    }
}

$wb.Dispose()
