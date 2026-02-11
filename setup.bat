@echo off
echo ========================================
echo HR Management System Setup Script
echo ========================================
echo.

echo Installing Node.js dependencies...
echo.

echo Installing Backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Frontend dependencies...
cd ../frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the application:
echo 1. Backend: cd backend && npm start
echo 2. Frontend: cd frontend && npm start
echo.
echo Or run start-servers.bat to start both servers
echo.
pause
