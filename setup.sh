#!/bin/bash
echo "============================================"
echo " Grocery Pathfinding - Setup and Launch"
echo "============================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo ""
    echo "Install it using one of the following:"
    echo "  Mac:   brew install node     (requires Homebrew: https://brew.sh)"
    echo "  Linux: sudo apt install nodejs npm   (Debian/Ubuntu)"
    echo "  Or download from: https://nodejs.org"
    echo ""
    exit 1
fi

echo "[OK] Node.js found: $(node --version)"
echo ""

# Check for pnpm, install if missing
if ! command -v pnpm &> /dev/null; then
    echo "[SETUP] pnpm not found. Installing pnpm..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install pnpm. Check your Node.js installation."
        exit 1
    fi
    echo "[OK] pnpm installed."
    echo ""
fi

echo "[OK] pnpm found: $(pnpm --version)"
echo ""

# Install dependencies
echo "[SETUP] Installing dependencies..."
pnpm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Dependency installation failed."
    exit 1
fi
echo ""

# Launch the app
echo "[LAUNCH] Starting the app - it will open in your browser automatically."
echo "         Press Ctrl+C to stop the server."
echo ""
pnpm run dev
