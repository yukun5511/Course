@echo off
chcp 65001 >nul
echo ========================================
echo   重启前端+NATAPP
echo ========================================
echo.

echo [1/3] 停止所有进程...
taskkill /F /IM natapp.exe >nul 2>&1
taskkill /F /IM serve.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] 启动前端服务(端口3000)...
start "前端服务" cmd /k "cd /d d:\Myproject\Course\frontend && serve -s dist -l 3000"
timeout /t 3 /nobreak >nul

echo [3/3] 启动NATAPP穿透(前端3000)...
start "NATAPP穿透" cmd /k "cd /d d:\Myproject\Course && natapp\natapp.exe -config=natapp\config-final.ini"

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo 等待3秒后访问：
echo http://vc9abe67.natappfree.cc/admin/login
echo.
timeout /t 3 /nobreak >nul

pause
