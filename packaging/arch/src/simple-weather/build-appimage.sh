#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if command -v rustup >/dev/null 2>&1; then
  if ! rustup show active-toolchain >/dev/null 2>&1; then
    echo "No default Rust toolchain configured. Setting stable as default..."
    rustup default stable
  fi
fi

npm ci
npm run build

if npx tauri build --bundles appimage; then
  echo "AppImage package created by Tauri at src-tauri/target/release/bundle/appimage/*.AppImage"
  exit 0
fi

# Fallback: use the generated AppDir and appimagetool when Tauri bundles fail.
cd src-tauri/target/release/bundle/appimage
if [ -d "Simple Weather.AppDir" ]; then
  cp "Simple Weather.AppDir/Simple Weather.png" "Simple Weather.AppDir/simple-weather.png" 2>/dev/null || true
  appimagetool "Simple Weather.AppDir" "simple-weather-0.1.0-x86_64.AppImage"
  echo "AppImage package created at src-tauri/target/release/bundle/appimage/simple-weather-0.1.0-x86_64.AppImage"
else
  echo "AppDir not found; AppImage build failed." >&2
  exit 1
fi
