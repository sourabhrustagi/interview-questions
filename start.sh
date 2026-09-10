#!/usr/bin/env bash

# =========================================================
# TechPrep Matrix - Website Startup Script
# =========================================================

PORT=8081
URL="http://localhost:${PORT}"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR"

# Kill any process already listening on our port before starting a new server
echo "🔪 Checking for existing server on port ${PORT}..."
EXISTING_PIDS="$(lsof -ti tcp:${PORT} 2>/dev/null)"
if [[ -n "$EXISTING_PIDS" ]]; then
    echo "   Found process(es) on port ${PORT}: ${EXISTING_PIDS} — killing..."
    kill -9 $EXISTING_PIDS 2>/dev/null
    sleep 0.5
else
    echo "   No existing server found."
fi

echo "================================================="
echo "🚀 Starting TechPrep Matrix Interview Website"
echo "   Directory: $DIR"
echo "   Target URL: $URL"
echo "================================================="

# Function to open URL in default browser
open_browser() {
    sleep 1.5
    echo "🌐 Opening web browser at $URL ..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$URL"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v xdg-open > /dev/null; then
            xdg-open "$URL"
        elif command -v gnome-open > /dev/null; then
            gnome-open "$URL"
        fi
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        cmd.exe /c start "$URL"
    else
        echo "Please open $URL in your browser manually."
    fi
}

# Launch browser in background task
open_browser &

# Detect available HTTP web servers and launch.
# npx is tried first but its cache can be broken by root-owned files
# (a known old npm bug) — if it fails, fall back instead of giving up.
NPX_FAILED=0
if command -v npx > /dev/null 2>&1; then
    echo "⚡ Launching using Node npx serve..."
    npx -y serve -l $PORT . || NPX_FAILED=1
fi

if [[ "$NPX_FAILED" == "1" ]]; then
    echo "⚠️  npx serve failed (often an npm cache permission issue —"
    echo "    fix permanently with: sudo chown -R \$(id -u):\$(id -g) ~/.npm)"
    echo "    Falling back to another server..."
fi

if command -v npx > /dev/null 2>&1 && [[ "$NPX_FAILED" == "0" ]]; then
    : # already served successfully above
elif command -v python3 > /dev/null 2>&1; then
    echo "🐍 Launching using Python 3 http.server..."
    python3 -m http.server $PORT
elif command -v python > /dev/null 2>&1; then
    echo "🐍 Launching using Python SimpleHTTPServer..."
    python -m SimpleHTTPServer $PORT
elif command -v php > /dev/null 2>&1; then
    echo "🐘 Launching using PHP built-in web server..."
    php -S "localhost:$PORT"
else
    echo "❌ No default HTTP server found (npx, python3, or php)."
    echo "👉 You can double-click index.html directly or open it in your browser:"
    echo "   file://$DIR/index.html"
fi
