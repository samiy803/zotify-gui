"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
    DashboardOutlined,
    SearchOutlined,
    HeartOutlined,
    UserOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { TbPlaylist } from "react-icons/tb";
import { IoAlbumsOutline } from "react-icons/io5";
import { LuPodcast } from "react-icons/lu";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, ConfigProvider } from "antd";

import {Dashboard, Search, LikedSongs, Playlists, Albums, Artists, Podcasts, Settings} from "../components";

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const TitleBar = dynamic(() => import("../components/TitleBar"), {
    ssr: false,
});

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

// Dashboard, Search, Liked Songs, Playlists, Albums, Artists, Podcasts, Settings
const items: MenuItem[] = [
    getItem("Dashboard", "dashboard", <DashboardOutlined />),
    getItem("Search", "search", <SearchOutlined />),
    getItem("Liked Songs", "liked", <HeartOutlined />),
    getItem("Playlists", "playlists", <TbPlaylist />),
    getItem("Albums", "albums", <IoAlbumsOutline />),
    getItem("Artists", "artists", <UserOutlined />),
    getItem("Podcasts", "podcasts", <LuPodcast />),
    getItem("Settings", "settings", <SettingOutlined />),
];

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const [selected, setSelected] = useState("dashboard");
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#469f55",
                        colorInfo: "#469f55",
                        sizeUnit: 4,
                        sizeStep: 5,
                        fontSize: 16,
                        colorBgBase: "#121212",
                        colorBgContainer: "#121212",
                        borderRadius: 12,
                    },
                    algorithm: theme.darkAlgorithm,
                    components: {
                        Layout: {
                            triggerBg: "#171D17",
                            siderBg: "#121212",
                        },
                        Menu: {
                            popupBg: "#121212",
                            darkItemBg: "#121212",
                        },
                    },
                }}
            >
                <Layout style={{ height: "100vh" }}>
                    <Sider
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                        style={{ borderRight: "1px solid rgba(100, 255, 100, 0.05)" }}
                    >
                        <Menu
                            defaultSelectedKeys={["1"]}
                            mode="inline"
                            items={items}
                            style={{ border: "none" }}
                            onSelect={({ key }) => setSelected(key as string)}
                            selectedKeys={[selected]}
                        />
                    </Sider>
                    <Layout>
                        <Content>
                            <TitleBar />
                            {selected === "dashboard" && <Dashboard />}
                            {selected === "search" && <Search />}
                            {selected === "liked" && <LikedSongs />}
                            {selected === "playlists" && <Playlists />}
                            {selected === "albums" && <Albums />}
                            {selected === "artists" && <Artists />}
                            {selected === "podcasts" && <Podcasts />}
                            {selected === "settings" && <Settings />}
                        </Content>
                        <Footer
                            className="text-center"
                            style={{ fontSize: "0.75rem", color: "#538851" }}
                        >
                            Made with ❤️ by Hazy Hues ©
                            {new Date().getFullYear()}
                        </Footer>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </>
    );
}
