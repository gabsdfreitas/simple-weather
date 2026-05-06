#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

npm ci
npm run build

cd packaging/arch
makepkg -f

echo "Pacman package created at packaging/arch/*.pkg.tar.zst"
