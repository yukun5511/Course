@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   启动前端 Ngrok 穿透
echo ========================================
echo.

set NGROK=ngrok\ngrok.exe

if not exist "%NGROK%" (
    echo [错误] 找不到 ngrok.exe
    pause
    exit /b 1
)

echo 正在启动前端穿透 (端口 3000)...
echo.
echo 注意：免费版ngrok每次会生成新域名
echo.

%NGROK% http 3000
