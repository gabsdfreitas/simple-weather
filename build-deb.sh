#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

npm ci
npm run build
npx tauri build --bundles deb

echo "Deb package created at src-tauri/target/release/bundle/deb/*.deb"
