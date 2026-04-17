@echo off
echo ========================================
echo   课程管理系统 - 快速启动脚本
echo ========================================
echo.

echo [1/3] 检查环境...
echo.

REM 检查 Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Java，请先安装 Java 17+
    pause
    exit /b 1
)
echo ✓ Java 已安装

REM 检查 Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 18+
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

REM 检查 MySQL
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未检测到 MySQL，请确保 MySQL 服务已启动
) else (
    echo ✓ MySQL 已安装
)

echo.
echo [2/3] 启动后端服务...
echo.

cd backend
start "后端服务" cmd /k "mvn spring-boot:run"
cd ..

echo ✓ 后端服务启动中...
echo   访问地址: http://localhost:8080
echo   API文档: http://localhost:8080/swagger-ui.html
echo.

timeout /t 3 /nobreak >nul

echo [3/3] 启动前端服务...
echo.

cd frontend
start "前端服务" cmd /k "npm run dev"
cd ..

echo ✓ 前端服务启动中...
echo   访问地址: http://localhost:3000
echo.

timeout /t 2 /nobreak >nul

echo ========================================
echo   启动完成！
echo ========================================
echo.
echo 管理后台登录:
echo   地址: http://localhost:3000/admin/login
echo   账号: ADMIN001
echo   密码: admin123
echo.
echo 小程序端登录:
echo   地址: http://localhost:3000/mini/login
echo.
echo 按任意键退出...
pause >nul
