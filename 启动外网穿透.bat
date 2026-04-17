@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   Ngrok 外网穿透启动工具 (v3.37.6)
echo ========================================
echo.

set NGROK=ngrok\ngrok.exe

if not exist "%NGROK%" (
    echo [错误] 找不到 ngrok.exe
    pause
    exit /b 1
)

echo ✓ Ngrok 3.37.6 就绪
echo.

echo [步骤 1/2] 配置 Token
echo.
echo 如果首次使用，需要配置 authtoken:
echo 1. 访问: https://ngrok.com
echo 2. 注册/登录账号
echo 3. 复制您的 authtoken
echo.
set /p CONFIGURE=是否配置 token? (Y/N，如已配置按N): 

if /i "%CONFIGURE%"=="Y" (
    set /p TOKEN=请输入您的 Ngrok authtoken: 
    if "%TOKEN%"=="" (
        echo [错误] Token 不能为空
        pause
        exit /b 1
    )
    echo.
    echo 正在配置...
    %NGROK% config add-authtoken %TOKEN%
    if %errorlevel% neq 0 (
        echo [错误] 配置失败
        pause
        exit /b 1
    )
    echo ✓ Token 配置成功
    echo.
)

echo [步骤 2/2] 启动外网穿透
echo.
echo 请选择要穿透的服务:
echo   1. 后端服务 (端口 8082) - API接口
echo   2. 前端服务 (端口 3000) - 网页界面
echo   3. 同时穿透前后端（推荐）
echo   4. 自定义端口
echo.
set /p CHOICE=请输入选项 (1-4): 

if "%CHOICE%"=="1" (
    echo.
    echo 启动后端穿透 (端口 8082)...
    echo 外网地址将在下方显示
    echo 按 Ctrl+C 停止
    echo.
    %NGROK% http 8082 --region=ap
) else if "%CHOICE%"=="2" (
    echo.
    echo 启动前端穿透 (端口 3000)...
    echo 外网地址将在下方显示
    echo 按 Ctrl+C 停止
    echo.
    %NGROK% http 3000 --region=ap
) else if "%CHOICE%"=="3" (
    echo.
    echo 同时穿透前后端...
    echo 将打开两个窗口
    echo.
    
    REM 创建配置文件
    (
    echo version: "3"
    echo authtoken: your-token-here
    echo tunnels:
    echo   backend:
    echo     addr: 8082
    echo     proto: http
    echo     domain:
    echo   frontend:
    echo     addr: 3000
    echo     proto: http
    echo     domain:
    ) > ngrok-temp.yml
    
    echo 正在启动后端穿透...
    start "Ngrok-后端(8082)" cmd /k "%NGROK% http 8082 --region=ap"
    
    timeout /t 2 /nobreak >nul
    
    echo 正在启动前端穿透...
    start "Ngrok-前端(3000)" cmd /k "%NGROK% http 3000 --region=ap"
    
    echo.
    echo ✓ 已启动两个穿透服务
    echo.
    echo 请在新窗口中查看外网地址
    echo 地址格式: https://xxxxx.ngrok.io
    echo.
    echo 后端API: https://xxxxx.ngrok.io/api/test/ping
    echo 前端页面: https://yyyyy.ngrok.io
    echo.
    pause
) else if "%CHOICE%"=="4" (
    set /p PORT=请输入端口号: 
    echo.
    echo 启动穿透 (端口 %PORT%)...
    echo.
    %NGROK% http %PORT% --region=ap
) else (
    echo [错误] 无效选项
    pause
    exit /b 1
)
