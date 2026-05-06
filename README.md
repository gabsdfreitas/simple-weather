# Simple Weather
A lightweight, cross-platform desktop weather application built with SvelteKit, Tauri, and TypeScript. Simple Weather features dynamic sky visuals, local forecast displays, and comprehensive native packaging support for both Linux and Windows.
Features

    Cross-Platform: Native desktop builds for Linux and Windows.

    Dynamic UI: SvelteKit frontend with reactive weather themes and animations.

    Local API Integration: Built-in weather routing and data lookup.

    Extensive Packaging: Automated build scripts for Flatpak, AppImage, DEB, RPM, Pacman, and MSI.

## Screenshot:

<img width="1457" height="871" alt="image" src="https://github.com/user-attachments/assets/cf436bdd-bf15-4b87-b831-ac44a3dc35a1" />


Prerequisites

Ensure the following system dependencies are installed before building:

Global Requirements

    Node.js (v18+) & npm

    Rust toolchain (stable) & Cargo

Linux Build Requirements

    patchelf (Required for Tauri bundling)

    makepkg (For Arch Linux package builds)

    appimagetool (Optional fallback for AppImage generation)

    Flatpak: flatpak, flatpak-builder, and the GNOME 50 SDK/Platform.
    Bash

    flatpak install flathub org.gnome.Sdk//50 org.gnome.Platform//50

Windows Build Requirements

    Windows 10/11 (x86_64)

    Visual Studio Build Tools (with MSVC and Windows SDK)

Building from Source

First, install the Node dependencies and build the SvelteKit frontend:
Bash

npm ci
npm run build

Linux Packaging

The repository includes dedicated shell scripts to streamline the Linux packaging process. You can run these directly or via their corresponding npm aliases (e.g., npm run build:deb).
Bash

./build-deb.sh        # Build Debian package (.deb)
./build-rpm.sh        # Build RPM package (.rpm)
./build-appimage.sh   # Build AppImage package
./build-pacman.sh     # Build Arch Linux package
./build-flatpak.sh    # Build Flatpak bundle (.flatpak)

# Or, generate all Linux formats sequentially:
./build-all.sh

Running the Flatpak Locally:
Once built, you can install and run the Flatpak bundle using:
Bash

flatpak install --user -y build-flatpak/simple-weather-0.1.0.flatpak
flatpak run com.simpleWeather.app

(Note: If you encounter a libwebkit2gtk-4.1.so.0 error, ensure the GNOME 50 Platform is installed via Flathub as specified in the prerequisites).
Windows Packaging

Windows builds utilize a dedicated batch script that targets MSI generation via src-tauri/tauri.windows.conf.json.
DOS

build-windows.bat

Package Outputs

Successfully compiled installers and binaries are deposited into the following directories:

    DEB: src-tauri/target/release/bundle/deb/

    RPM: src-tauri/target/release/bundle/rpm/

    AppImage: src-tauri/target/release/bundle/appimage/

    Arch/Pacman: packaging/arch/

    Flatpak: build-flatpak/

    Windows MSI: src-tauri\target\release\bundle\msi\
