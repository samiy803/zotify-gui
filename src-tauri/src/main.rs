// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::json;
use tauri_plugin_store::StoreBuilder;

#[tauri::command]
fn say_hello() -> String {
    "Hello from Rust!".to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let home = dirs::config_dir().unwrap();
            let path = home.join("zotify-gui.bin");

            let mut store = StoreBuilder::new(app.handle(), path.clone()).build();

            if !path.exists() {
                store.insert("config".to_string(), json!({})).unwrap();
                store.save().unwrap();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![say_hello])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
