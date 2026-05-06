#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

./build-deb.sh
./build-rpm.sh
./build-appimage.sh
./build-flatpak.sh
./build-pacman.sh
