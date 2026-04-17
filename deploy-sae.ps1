# SAE 部署脚本 - Windows PowerShell
# 用途：一键构建前后端并打包到SAE部署格式

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Course Management SAE Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build frontend
Write-Host "[1/4] Building frontend..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
}
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend build success!" -ForegroundColor Green
Write-Host ""

# Step 2: Copy frontend to backend static resources
Write-Host "[2/4] Copying frontend to backend static..." -ForegroundColor Yellow
Set-Location ..\backend\src\main\resources
if (Test-Path "static") {
    Remove-Item -Recurse -Force static
}
Copy-Item -Recurse ..\..\..\..\frontend\dist static
Write-Host "Frontend copied successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Build backend JAR
Write-Host "[3/4] Building backend JAR..." -ForegroundColor Yellow
Set-Location ..\..\..
mvn clean package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Backend build success!" -ForegroundColor Green
Write-Host ""

# Step 4: Check build result
Write-Host "[4/4] Checking build result..." -ForegroundColor Yellow
$jarFile = "target\course-management-1.0.0.jar"
if (Test-Path $jarFile) {
    $fileSize = (Get-Item $jarFile).Length / 1MB
    Write-Host "JAR file generated: $jarFile" -ForegroundColor Green
    Write-Host "File size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Deploy Ready!" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Login SAE Console: https://sae.console.aliyun.com/" -ForegroundColor White
    Write-Host "2. Create or select application" -ForegroundColor White
    Write-Host "3. Upload JAR: backend\target\course-management-1.0.0.jar" -ForegroundColor White
    Write-Host "4. Configure environment variables" -ForegroundColor White
    Write-Host "5. Click Deploy" -ForegroundColor White
    Write-Host ""
    Write-Host "Environment Variables:" -ForegroundColor Yellow
    Write-Host "SPRING_PROFILES_ACTIVE=sae" -ForegroundColor White
    Write-Host "SPRING_DATASOURCE_URL=jdbc:mysql://<RDS-internal-address>:3306/course_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=true" -ForegroundColor White
    Write-Host "SPRING_DATASOURCE_USERNAME=course_user" -ForegroundColor White
    Write-Host "SPRING_DATASOURCE_PASSWORD=<your-password>" -ForegroundColor White
    Write-Host "JWT_SECRET=your-production-secret-key-2024" -ForegroundColor White
    Write-Host "FILE_UPLOAD_PATH=/tmp/uploads" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: You need to create RDS MySQL separately" -ForegroundColor Yellow
    Write-Host "See DEPLOYMENT-SAE-QUICK.md for details" -ForegroundColor White
} else {
    Write-Host "JAR file not found!" -ForegroundColor Red
    exit 1
}

Set-Location ..\..\..
