# Simple Weather

Simple Weather is a lightweight desktop weather app built with SvelteKit, Tauri, and TypeScript. It provides dynamic sky visuals, local weather forecast display, and native Linux packaging support.

## Features

- Tauri-based desktop app for Linux
- SvelteKit front-end with dynamic weather themes
- Local weather lookup via built-in API route
- Builds to multiple Linux package formats

## Requirements

### System requirements

- Linux x86_64
- Node.js 18+ / npm
- Rust toolchain (stable)
- `cargo`
- `makepkg` (for Arch package build)
- `appimagetool` (optional fallback for AppImage)
- `patchelf` (used by Tauri bundling)

### Dev dependencies

- `@tauri-apps/cli`
- `@sveltejs/kit`
- `vite`
- `typescript`

## Build scripts

This repo includes helper scripts for packaging the app.

- `./build-deb.sh` — build a Debian package (`.deb`)
- `./build-rpm.sh` — build an RPM package (`.rpm`)
- `./build-appimage.sh` — build an AppImage package
- `./build-pacman.sh` — build a Pacman package for Arch Linux
- `./build-all.sh` — run all package builds sequentially

## How to build

From the repo root:

```bash
npm ci
npm run build
```

Then use one of the package scripts:

```bash
./build-deb.sh
./build-rpm.sh
./build-appimage.sh
./build-pacman.sh
```

Or run them all:

```bash
./build-all.sh
```

### npm shortcuts

The following npm scripts are available in `package.json`:

- `npm run build:deb`
- `npm run build:rpm`
- `npm run build:appimage`
- `npm run build:pacman`
- `npm run build:flatpak`
- `npm run build:all`

## Flatpak build

The Flatpak workflow uses `flatpak-builder` and a local manifest at `src-tauri/flatpak.json`.

Requirements for Flatpak packaging:

- `flatpak`
- `flatpak-builder`
- `org.gnome.Sdk//50`
- `org.gnome.Platform//50`

Install the Flatpak SDK/runtime if missing:

```bash
flatpak install flathub org.gnome.Sdk//50
flatpak install flathub org.gnome.Platform//50
```

Build the Flatpak bundle from the repo root:

```bash
./build-flatpak.sh
```

Install the built bundle locally:

```bash
flatpak install --user -y build-flatpak/simple-weather-0.1.0.flatpak
```

Run the installed Flatpak app:

```bash
flatpak run com.simpleWeather.app
```

If a runtime error occurs for `libwebkit2gtk-4.1.so.0`, reinstall the bundle after installing the GNOME runtime:

```bash
flatpak install flathub org.gnome.Platform//50
flatpak install --user -y build-flatpak/simple-weather-0.1.0.flatpak
```

This produces:

- `build-flatpak/simple-weather-0.1.0.flatpak`

## Windows build

This repo now uses a Windows batch script for building on Windows.
On Windows, Tauri will also load `src-tauri/tauri.windows.conf.json` so the MSI bundle target is enabled.

Requirements for building on Windows:

- Windows 10/11 x86_64
- Node.js 18+ / npm
- Rust toolchain (stable)
- `cargo`
- `npm install`
- `@tauri-apps/cli`
- `tauri` Windows prerequisites:
  - Visual Studio Build Tools with MSVC and Windows SDK
  - `dotnet` runtime if required by current Tauri toolchain
  - `python` if needed by Rust toolchain/build scripts

Run the build from the repo root in Windows:

```bat
build-windows.bat
```

If the build succeeds, the MSI installer is created under:

- `src-tauri\target\release\bundle\msi\`

If no installer appears, review the batch output for the failing step.

## Package outputs

Built packages are placed in:

- `src-tauri/target/release/bundle/deb/`
- `src-tauri/target/release/bundle/rpm/`
- `src-tauri/target/release/bundle/appimage/`
- `build-flatpak/`
- `packaging/arch/`

## Notes

- The Arch package source is stored in `packaging/arch/`.
- Existing package artifacts are preserved during cleanup.
- If AppImage packaging fails via Tauri, the fallback script uses `appimagetool` on the generated AppDir.
