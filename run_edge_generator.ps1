$htmlPath = 'c:\Users\ADMIN\Desktop\e-commerce\generate_canvas.html'
$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

if (-not (Test-Path $edgePath)) {
    $edgePath = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}

Write-Host "Running Edge headless with virtual time budget on $htmlPath..."
$outArr = & $edgePath --headless --disable-gpu --virtual-time-budget=5000 --dump-dom $htmlPath 2>&1
$out = $outArr -join "`n"

$outputDir = 'c:\Users\ADMIN\Desktop\e-commerce\assets\images'
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir
}

# Parse out the data-filename and base64 strings
$pattern = 'data-filename="([^"]+)">(data:image/webp;base64,[^<]+)'
$matches = [regex]::Matches($out, $pattern)

Write-Host "Found $($matches.Count) WebP images in DOM output."

foreach ($match in $matches) {
    $fileName = $match.Groups[1].Value
    $dataUrl = $match.Groups[2].Value
    $base64 = $dataUrl.Replace('data:image/webp;base64,', '').Trim()
    $bytes = [System.Convert]::FromBase64String($base64)
    $filePath = Join-Path $outputDir $fileName
    [System.IO.File]::WriteAllBytes($filePath, $bytes)
    $sizeKb = [math]::Round(($bytes.Length / 1KB), 2)
    Write-Host "Saved $fileName ($sizeKb KB)"
}
