@echo off
TITLE TechPrep Matrix Launcher
echo =================================================
echo Starting TechPrep Matrix Interview Website
echo =================================================

SET PORT=8080
SET URL=http://localhost:%PORT%

echo Opening browser at %URL%...
start %URL%

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Launching Python HTTP Server...
    python -m http.server %PORT%
    goto END
)

where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Launching Node npx serve...
    npx -y serve -l %PORT% .
    goto END
)

echo Opening index.html directly...
start index.html

:END
