#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if command -v rustup >/dev/null 2>&1; then
  if ! rustup show active-toolchain >/dev/null 2>&1; then
    echo "No default Rust toolchain configured. Setting stable as default..."
    rustup default stable
  fi
fi

command -v flatpak-builder >/dev/null 2>&1 || {
  echo "flatpak-builder is required but not installed." >&2
  exit 1
}
command -v flatpak >/dev/null 2>&1 || {
  echo "flatpak is required but not installed." >&2
  exit 1
}

if ! flatpak info org.gnome.Sdk//50 >/dev/null 2>&1; then
  echo "Flatpak SDK org.gnome.Sdk//50 is not installed." >&2
  echo "Install it with: flatpak install flathub org.gnome.Sdk//50" >&2
  exit 1
fi

if ! flatpak info org.gnome.Platform//50 >/dev/null 2>&1; then
  echo "Flatpak runtime org.gnome.Platform//50 is not installed." >&2
  echo "Install it with: flatpak install flathub org.gnome.Platform//50" >&2
  exit 1
fi

npm ci
npm run build
npx tauri build --no-bundle

rm -rf build-flatpak
mkdir -p build-flatpak
repo_dir="build-flatpak/repo"
build_dir="build-flatpak/build"

mkdir -p "$repo_dir"
flatpak-builder --force-clean --repo="$repo_dir" "$build_dir" src-tauri/flatpak.json
flatpak build-bundle "$repo_dir" build-flatpak/simple-weather-0.1.0.flatpak com.simpleWeather.app --arch=x86_64

echo "Flatpak bundle created at build-flatpak/simple-weather-0.1.0.flatpak"
