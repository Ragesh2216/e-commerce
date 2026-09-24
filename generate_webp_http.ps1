$port = 8899
$url = "http://localhost:${port}/"
$htmlPath = 'c:\Users\ADMIN\Desktop\e-commerce\generate_canvas.html'

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "Local HTTP listener started on $url"

# Start listener in background thread / async job
$asyncResult = $listener.BeginGetContext({
    param($result)
    try {
        $context = $listener.EndGetContext($result)
        $response = $context.Response
        $content = [System.IO.File]::ReadAllBytes($htmlPath)
        $response.ContentType = "text/html"
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
        $response.Close()
    } catch {}
}, $null)

Start-Sleep -Milliseconds 500

$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edgePath)) {
    $edgePath = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
}

Write-Host "Running Edge headless on $url..."
$outArr = & $edgePath --headless --disable-gpu --virtual-time-budget=3000 --dump-dom $url 2>&1
$out = $outArr -join "`n"

$listener.Stop()
$listener.Close()

$outputDir = 'c:\Users\ADMIN\Desktop\e-commerce\assets\images'
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir
}

$pattern = 'data-filename="([^"]+)">(data:image/webp;base64,[^<]+)'
$matches = [regex]::Matches($out, $pattern)

Write-Host "Extracted $($matches.Count) WebP images from Edge DOM."

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
