// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;
use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
struct WindowState {
    width: f64,
    height: f64,
    maximized: bool,
}

fn get_state_path(app: &tauri::App) -> PathBuf {
    app.path().app_config_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
        .join("window_state.json")
}

fn load_window_state(app: &tauri::App) -> Option<WindowState> {
    let path = get_state_path(app);
    let data = fs::read_to_string(path).ok()?;
    serde_json::from_str(&data).ok()
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_title("Simple Weather");

                if let Some(state) = load_window_state(app) {
                    if state.maximized {
                        let _ = window.maximize();
                    } else {
                        let _ = window.set_size(tauri::LogicalSize {
                            width: state.width,
                            height: state.height,
                        });
                    }
                }

                let app_handle = app.handle().clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::Resized(_) = event {
                        if let Some(win) = app_handle.get_webview_window("main") {
                            let path = app_handle.path().app_config_dir()
                                .unwrap_or_else(|_| PathBuf::from("."))
                                .join("window_state.json");
                            
                            let state = WindowState {
                                width: win.outer_size().unwrap().width as f64,
                                height: win.outer_size().unwrap().height as f64,
                                maximized: win.is_maximized().unwrap_or(false),
                            };
                            if let Ok(data) = serde_json::to_string(&state) {
                                let _ = fs::write(path, data);
                            }
                        }
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
