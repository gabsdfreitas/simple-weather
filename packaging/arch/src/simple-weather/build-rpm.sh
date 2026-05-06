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
npx tauri build --bundles rpm

echo "RPM package created at src-tauri/target/release/bundle/rpm/*.rpm"
