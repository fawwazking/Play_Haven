@echo off
title PlayHaven Django Backend Server
cd /d "%~dp0"
echo ===================================================
echo   Menjalankan PlayHaven Django Backend...
echo ===================================================
venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
pause
