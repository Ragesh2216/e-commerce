Write-Host "=== VERIFYING E-COMMERCE WEBSITE PROJECT ===" -ForegroundColor Cyan

$baseDir = 'c:\Users\ADMIN\Desktop\e-commerce'
$htmlFiles = @('index.html', 'about.html', 'service.html', 'blog.html', 'contact.html', 'login.html', '404.html', 'client-dashboard.html', 'admin-dashboard.html')

$missingFiles = 0
foreach ($file in $htmlFiles) {
    $path = Join-Path $baseDir $file
    if (Test-Path $path) {
        Write-Host " [OK] Found HTML Page: $file" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] Missing HTML Page: $file" -ForegroundColor Red
        $missingFiles++
    }
}

Write-Host "`n--- CHECKING WEBP IMAGES (< 100 KB REQUIREMENT) ---" -ForegroundColor Cyan
$imgDir = Join-Path $baseDir 'assets\images'
$webpFiles = Get-ChildItem -Path $imgDir -Filter '*.webp'

$oversizedCount = 0
foreach ($img in $webpFiles) {
    $sizeKb = [math]::Round(($img.Length / 1KB), 2)
    if ($img.Length -lt 102400) {
        Write-Host " [OK] $($img.Name) -> $sizeKb KB (< 100 KB)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] $($img.Name) -> $sizeKb KB (EXCEEDS 100 KB limit!)" -ForegroundColor Red
        $oversizedCount++
    }
}

Write-Host "`n--- SUMMARY RESULTS ---" -ForegroundColor Cyan
Write-Host "Total HTML Pages Checked: $($htmlFiles.Count) (Missing: $missingFiles)"
Write-Host "Total WebP Images Verified: $($webpFiles.Count) (Oversized: $oversizedCount)"

if ($missingFiles -eq 0 -and $oversizedCount -eq 0) {
    Write-Host "SUCCESS: ALL TESTS PASSED PERFECTLY!" -ForegroundColor Green
} else {
    Write-Host "ERROR: VERIFICATION ISSUES FOUND!" -ForegroundColor Red
}
