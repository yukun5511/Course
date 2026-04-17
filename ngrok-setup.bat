@echo off
chcp 65001 >nul
echo ========================================
echo   Ngrok 外网穿透配置工具
echo ========================================
echo.

echo [步骤 1/3] 检查 ngrok 安装...
echo.

REM 尝试启动 ngrok
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] ngrok 已安装，但需要重启命令行才能使用
    echo.
    echo 请关闭当前窗口，重新运行此脚本
    echo 或手动打开新的 PowerShell 窗口运行:
    echo   ngrok version
    echo.
    pause
    exit /b 0
)

echo ✓ ngrok 已安装
ngrok version
echo.

echo [步骤 2/3] 配置 Ngrok Token
echo.
echo 您需要 Ngrok 账号的 authtoken
echo 1. 访问: https://ngrok.com
echo 2. 注册/登录账号
echo 3. 获取 authtoken（在 Dashboard 中）
echo.
set /p TOKEN=请输入您的 Ngrok authtoken: 

if "%TOKEN%"=="" (
    echo [错误] Token 不能为空
    pause
    exit /b 1
)

echo.
echo 正在配置 token...
ngrok config add-authtoken %TOKEN%
if %errorlevel% neq 0 (
    echo [错误] Token 配置失败
    pause
    exit /b 1
)

echo ✓ Token 配置成功
echo.

echo [步骤 3/3] 启动外网穿透
echo.
echo 请选择要穿透的服务:
echo   1. 后端服务 (端口 8082)
echo   2. 前端服务 (端口 3000)
echo   3. 同时穿透前后端
echo   4. 自定义端口
echo.
set /p CHOICE=请输入选项 (1-4): 

if "%CHOICE%"=="1" (
    echo.
    echo 启动后端穿透 (端口 8082)...
    echo.
    ngrok http 8082
) else if "%CHOICE%"=="2" (
    echo.
    echo 启动前端穿透 (端口 3000)...
    echo.
    ngrok http 3000
) else if "%CHOICE%"=="3" (
    echo.
    echo 同时穿透前后端...
    echo 将在两个窗口中启动
    echo.
    start "Ngrok-Backend" cmd /k "ngrok http 8082"
    timeout /t 2 /nobreak >nul
    start "Ngrok-Frontend" cmd /k "ngrok http 3000"
    echo ✓ 已启动两个穿透服务
    echo.
    echo 请在新窗口中查看外网地址
    echo.
    pause
) else if "%CHOICE%"=="4" (
    set /p PORT=请输入端口号: 
    echo.
    echo 启动穿透 (端口 %PORT%)...
    echo.
    ngrok http %PORT%
) else (
    echo [错误] 无效选项
    pause
    exit /b 1
)
