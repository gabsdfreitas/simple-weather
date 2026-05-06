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

tarball="simple-weather-0.1.0.tar.gz"
rm -f "packaging/arch/$tarball"
tar -czf "packaging/arch/$tarball" \
  --exclude='./packaging/arch/*' \
  --exclude='./node_modules' \
  --exclude='./build' \
  --exclude='./build-flatpak' \
  --exclude='./src-tauri/target' \
  --exclude='./.git' \
  --transform 's|^./|simple-weather/|' \
  .

cd packaging/arch
makepkg -f

echo "Pacman package created at packaging/arch/*.pkg.tar.zst"
