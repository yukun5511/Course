@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   NATAPP 外网穿透启动
echo ========================================
echo.

set NATAPP=natapp\natapp.exe

if not exist "%NATAPP%" (
    echo [错误] 找不到 natapp.exe
    echo.
    echo 请先完成以下步骤：
    echo 1. 访问 https://natapp.cn 下载 Windows 版本
    echo 2. 解压到 natapp\ 目录
    echo 3. 编辑 natapp\config.ini 填入您的 Authtoken
    echo.
    pause
    exit /b 1
)

echo [提示] 请确保已在 natapp\config.ini 中填写 Authtoken
echo.
echo 正在启动 NATAPP 穿透 (端口 3000)...
echo.
echo 外网地址将在下方显示
echo 按 Ctrl+C 停止
echo.

%NATAPP% -config=natapp\config.ini
