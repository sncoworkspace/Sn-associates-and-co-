@echo off
echo Starting SN Associates & Co...

:: Start Backend
start "SN Backend Server" cmd /k "cd server && node index.js"

:: Wait a moment for backend
timeout /t 2 /nobreak >nul

:: Start Frontend (using direct node to bypass PowerShell restrictions)
echo Starting Frontend...
node node_modules/vite/bin/vite.js
