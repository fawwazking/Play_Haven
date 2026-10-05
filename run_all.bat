@echo off
title PlayHaven Launcher
echo ========================================================
echo        PLAYHAVEN E-COMMERCE - ALL IN ONE LAUNCHER       
echo ========================================================
echo Menjalankan Backend (Django) dan Frontend (Next.js)...
echo.

start "PlayHaven Backend (Django)" cmd /k "cd /d C:\Sem5\E Commerce\PlayHaven\backend && run_backend.bat"
start "PlayHaven Frontend (Next.js)" cmd /k "cd /d C:\Sem5\E Commerce\PlayHaven\frontend && run_frontend.bat"

echo [OK] Backend berjalan di:  http://127.0.0.1:8000
echo [OK] Frontend berjalan di: http://localhost:3000
echo ========================================================
pause
