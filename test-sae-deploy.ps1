# SAE 部署测试脚本
# 使用方法: .\test-sae-deploy.ps1 -SAE_IP "你的SAE公网IP"

param(
    [Parameter(Mandatory=$true)]
    [string]$SAE_IP
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SAE Deployment Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing SAE IP: $SAE_IP" -ForegroundColor Yellow
Write-Host ""

$baseUrl = "http://${SAE_IP}:8082"
$testResults = @()

# Test 1: API Health Check
Write-Host "[1/5] Testing API Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get -TimeoutSec 10
    if ($response.code -eq 200) {
        Write-Host "  ✓ API Health Check PASSED" -ForegroundColor Green
        $testResults += @{Test="API Health"; Status="PASSED"}
    } else {
        Write-Host "  ✗ API Health Check FAILED" -ForegroundColor Red
        $testResults += @{Test="API Health"; Status="FAILED"}
    }
} catch {
    Write-Host "  ✗ API Health Check ERROR: $_" -ForegroundColor Red
    $testResults += @{Test="API Health"; Status="ERROR"}
}
Write-Host ""

# Test 2: Admin Login
Write-Host "[2/5] Testing Admin Login..." -ForegroundColor Yellow
$loginBody = @{
    username = "ADMIN001"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResult = Invoke-RestMethod `
        -Uri "$baseUrl/api/auth/admin-login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json" `
        -TimeoutSec 10
    
    if ($loginResult.code -eq 200 -and $loginResult.data.accessToken) {
        Write-Host "  ✓ Admin Login PASSED" -ForegroundColor Green
        $token = $loginResult.data.accessToken
        $testResults += @{Test="Admin Login"; Status="PASSED"}
    } else {
        Write-Host "  ✗ Admin Login FAILED: $($loginResult.message)" -ForegroundColor Red
        $testResults += @{Test="Admin Login"; Status="FAILED"}
    }
} catch {
    Write-Host "  ✗ Admin Login ERROR: $_" -ForegroundColor Red
    $testResults += @{Test="Admin Login"; Status="ERROR"}
    $token = $null
}
Write-Host ""

# Test 3: Get User Info (with token)
if ($token) {
    Write-Host "[3/5] Testing Get User Info..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $userInfo = Invoke-RestMethod `
            -Uri "$baseUrl/api/user/profile" `
            -Method Get `
            -Headers $headers `
            -TimeoutSec 10
        
        if ($userInfo.code -eq 200) {
            Write-Host "  ✓ Get User Info PASSED" -ForegroundColor Green
            Write-Host "  User: $($userInfo.data.name)" -ForegroundColor Gray
            $testResults += @{Test="Get User Info"; Status="PASSED"}
        } else {
            Write-Host "  ✗ Get User Info FAILED" -ForegroundColor Red
            $testResults += @{Test="Get User Info"; Status="FAILED"}
        }
    } catch {
        Write-Host "  ✗ Get User Info ERROR: $_" -ForegroundColor Red
        $testResults += @{Test="Get User Info"; Status="ERROR"}
    }
} else {
    Write-Host "[3/5] Skipping Get User Info (no token)" -ForegroundColor Gray
    $testResults += @{Test="Get User Info"; Status="SKIPPED"}
}
Write-Host ""

# Test 4: Frontend Static Resources
Write-Host "[4/5] Testing Frontend Access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -Method Get -TimeoutSec 10
    if ($response.StatusCode -eq 200 -and $response.Content -match "Course Management") {
        Write-Host "  ✓ Frontend Access PASSED" -ForegroundColor Green
        $testResults += @{Test="Frontend Access"; Status="PASSED"}
    } else {
        Write-Host "  ✗ Frontend Access FAILED (Status: $($response.StatusCode))" -ForegroundColor Red
        $testResults += @{Test="Frontend Access"; Status="FAILED"}
    }
} catch {
    Write-Host "  ✗ Frontend Access ERROR: $_" -ForegroundColor Red
    $testResults += @{Test="Frontend Access"; Status="ERROR"}
}
Write-Host ""

# Test 5: Database Connection (via API)
Write-Host "[5/5] Testing Database Connection..." -ForegroundColor Yellow
if ($token) {
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        # Try to get classes list (requires database)
        $classes = Invoke-RestMethod `
            -Uri "$baseUrl/api/class/list?page=1&size=10" `
            -Method Get `
            -Headers $headers `
            -TimeoutSec 10
        
        if ($classes.code -eq 200) {
            Write-Host "  ✓ Database Connection PASSED" -ForegroundColor Green
            $testResults += @{Test="Database Connection"; Status="PASSED"}
        } else {
            Write-Host "  ✗ Database Connection FAILED" -ForegroundColor Red
            $testResults += @{Test="Database Connection"; Status="FAILED"}
        }
    } catch {
        Write-Host "  ✗ Database Connection ERROR: $_" -ForegroundColor Red
        $testResults += @{Test="Database Connection"; Status="ERROR"}
    }
} else {
    Write-Host "  ✗ Database Connection SKIPPED (no token)" -ForegroundColor Gray
    $testResults += @{Test="Database Connection"; Status="SKIPPED"}
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($testResults | Where-Object {$_.Status -eq "PASSED"}).Count
$failed = ($testResults | Where-Object {$_.Status -eq "FAILED" -or $_.Status -eq "ERROR"}).Count
$skipped = ($testResults | Where-Object {$_.Status -eq "SKIPPED"}).Count

foreach ($result in $testResults) {
    $statusColor = switch ($result.Status) {
        "PASSED" { "Green" }
        "FAILED" { "Red" }
        "ERROR" { "Red" }
        "SKIPPED" { "Gray" }
    }
    Write-Host ("  {0,-25} : " -f $result.Test) -NoNewline
    Write-Host $result.Status -ForegroundColor $statusColor
}

Write-Host ""
Write-Host "Total: $($testResults.Count) | Passed: $passed | Failed: $failed | Skipped: $skipped" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✓ All tests passed! Deployment is successful!" -ForegroundColor Green
} else {
    Write-Host "✗ Some tests failed. Please check the errors above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Check SAE application logs" -ForegroundColor White
    Write-Host "2. Verify environment variables" -ForegroundColor White
    Write-Host "3. Check RDS database connection" -ForegroundColor White
    Write-Host "4. Ensure RDS whitelist includes SAE" -ForegroundColor White
}
Write-Host ""
