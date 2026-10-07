@echo off
setlocal
if "%PORT%"=="" set "PORT=8001"
echo ========================================================
echo Starting HealthFeast Django Backend (Port %PORT%)...
echo ========================================================
cd backend
if not exist .venv (
    echo Virtual environment not found. Please create it first.
    exit /b 1
)
call .venv\Scripts\activate
echo Applying database migrations...
python manage.py migrate --noinput
if errorlevel 1 (
    echo Database migration failed.
    exit /b 1
)
echo Seeding the local database...
python manage.py seed_data
if errorlevel 1 (
    echo Database seeding failed.
    exit /b 1
)
python manage.py runserver 127.0.0.1:%PORT%
endlocal
