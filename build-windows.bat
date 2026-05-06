@echo off
setlocal enabledelayedexpansion

if not exist package.json (
  echo package.json not found. Run this from the repository root.
  exit /b 1
)

echo Installing npm dependencies...
call npm install
if errorlevel 1 (
  echo npm install failed.
  exit /b 1
)

echo Building the frontend...
call npm run build
if errorlevel 1 (
  echo Frontend build failed.
  exit /b 1
)

echo Building the Tauri Windows installer...
call npx tauri build --bundles msi
if errorlevel 1 (
  echo Tauri Windows build failed. Check the output above for errors.
  exit /b 1
)

echo Build complete.
echo Installer output:
if exist src-tauri\target\release\bundle\msi (
  dir src-tauri\target\release\bundle\msi
) else (
  echo No MSI output folder found at src-tauri\target\release\bundle\msi
)
