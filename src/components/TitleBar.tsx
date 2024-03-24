import { CloseOutlined, MinusOutlined } from "@ant-design/icons";
import { appWindow } from "@tauri-apps/api/window";
import { Button } from "antd";

export default function TitleBar() {
    return (
        <div
            className="flex flex-row justify-end"
            style={{
                position: "relative",
                top: 0,
                left: 0,
                maxWidth: "100vw",
                pointerEvents: "auto",
                padding: "0.33rem",
                borderBottom: "1px solid rgba(100, 255, 100, 0.05)",
            }}
            data-tauri-drag-region
        >
            <div className="flex flex-row space-x-2 p-2">
                <span className="dot" style={{backgroundColor: "#4CD964"}} onClick={() => appWindow.maximize()} />
                <span className="dot" style={{backgroundColor: "#FFD700"}} onClick={() => appWindow.minimize()} />
                <span className="dot" style={{backgroundColor: "#FF605C"}} onClick={() => appWindow.close()} />
            </div>
        </div>
    );
}
