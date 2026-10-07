@echo off
set "PORT=8001"
echo ========================================================
echo Starting HealthFeast Full Stack in separate windows...
echo ========================================================
start "HealthFeast Backend (Django)" cmd /k "set PORT=%PORT% && run_backend.bat"
start "HealthFeast Frontend (Vite)" cmd /k "set PORT=%PORT% && run_frontend.bat"
echo Services starting...
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://127.0.0.1:%PORT%
