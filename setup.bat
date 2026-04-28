@echo off
echo ============================================
echo  Grocery Pathfinding - Setup and Launch
echo ============================================
echo.

:: Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo.
    echo Please install Node.js from https://nodejs.org
    echo Download the LTS version, run the installer, then re-run this script.
    echo.
    pause
    start https://nodejs.org
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

:: Check for pnpm, install if missing
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [SETUP] pnpm not found. Installing pnpm...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install pnpm. Check your Node.js installation.
        pause
        exit /b 1
    )
    echo [OK] pnpm installed.
    echo.
)

echo [OK] pnpm found:
pnpm --version
echo.

:: Install dependencies
echo [SETUP] Installing dependencies...
pnpm install
if %errorlevel% neq 0 (
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
)
echo.

:: Launch the app
echo [LAUNCH] Starting the app - it will open in your browser automatically.
echo          Press Ctrl+C in this window to stop the server.
echo.
pnpm run dev
