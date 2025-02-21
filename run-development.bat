@echo off
chcp 65001 > nul
NET SESSION >nul 2>&1
if %errorlevel% neq 0 (
    echo !ESC![1;31m[CẢNH BÁO]!ESC![0m Script cần quyền quản trị để chạy!
    echo !ESC![1;34m[HÀNH ĐỘNG]!ESC![0m Đang yêu cầu quyền quản trị...
    PowerShell Start-Process "%~f0" -Verb RunAs
    exit /b
)

@echo off
chcp 65001 > nul
title Khởi động dự án TANK TRAVEL (Development)

setlocal EnableDelayedExpansion
set "ESC="
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set "ESC=%%b"
)

color 0B
echo.
echo ╔════════════════════════════════════════════════╗
echo ║                                                ║
echo ║  !ESC![93m████████╗ █████╗ ███╗  ██╗██╗  ██╗!ESC![0m            ║
echo ║  !ESC![93m╚══██╔══╝██╔══██╗████╗ ██║██║ ██╔╝!ESC![0m            ║
echo ║  !ESC![93m   ██║   ███████║██╔██╗██║█████╔╝ !ESC![0m            ║
echo ║  !ESC![93m   ██║   ██╔══██║██║╚████║██╔═██╗ !ESC![0m            ║
echo ║  !ESC![93m   ██║   ██║  ██║██║ ╚███║██║  ██╗!ESC![0m            ║
echo ║  !ESC![93m   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚══╝╚═╝  ╚═╝!ESC![0m            ║
echo ║  !ESC![36m████████╗██████╗  █████╗ ██╗   ██╗███████╗██╗!ESC![0m ║
echo ║  !ESC![36m╚══██╔══╝██╔══██╗██╔══██╗██║   ██║██╔════╝██║!ESC![0m ║
echo ║  !ESC![36m   ██║   ██████╔╝███████║██║   ██║█████╗  ██║!ESC![0m ║
echo ║  !ESC![36m   ██║   ██╔══██╗██╔══██║╚██╗ ██╔╝██╔══╝  ██║!ESC![0m ║
echo ║  !ESC![36m   ██║   ██║  ██║██║  ██║ ╚████╔╝ ███████╗██║!ESC![0m ║
echo ║  !ESC![36m   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝!ESC![0m ║
echo ║                                                ║
echo ╚════════════════════════════════════════════════╝
echo.

echo !ESC![1;33m[KIỂM TRA]!ESC![0m Kiểm tra thư mục node_modules...
if not exist node_modules\ (
    echo !ESC![1;31m[LỖI]!ESC![0m Không tìm thấy thư mục node_modules! Cần chạy "npm install" trước.
    pause
    exit /b 1
)

set HAS_PACKAGE=0
for /D %%D in (node_modules\*) do set HAS_PACKAGE=1
if %HAS_PACKAGE%==0 (
    echo !ESC![1;31m[LỖI]!ESC![0m Thư mục node_modules không có package nào! Cần chạy "npm install" trước.
    pause
    exit /b 1
)

echo !ESC![1;32m[OK]!ESC![0m Mọi thứ đã sẵn sàng. Đang khởi động ứng dụng...
npm run dev
if %errorlevel% neq 0 (
    echo !ESC![1;31m[LỖI]!ESC![0m Khởi động ứng dụng thất bại!
    pause
    exit /b 1
)

echo !ESC![1;32m[THÀNH CÔNG]!ESC![0m Ứng dụng đã khởi động thành công!
pause
