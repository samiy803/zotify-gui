"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { join } from "path";
import { Store } from "tauri-plugin-store-api";
import {
    Button,
    Modal,
    Table,
    TableProps,
    Tabs,
    Input,
    Divider,
    Alert,
    InputRef,
} from "antd";
import { LockOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

function configDirectory() {
    // Linux: $XDG_CONFIG_HOME or $HOME/.config
    // macOS: $HOME/Library/Application Support
    // Windows: %APPDATA%

    if (process.env.NEXT_PUBLIC_OS == "darwin") {
        return process.env.NEXT_PUBLIC_HOME
            ? join(process.env.NEXT_PUBLIC_HOME, "Library/Application Support")
            : "";
    } else if (process.env.NEXT_PUBLIC_OS == "win32") {
        return process.env.NEXT_PUBLIC_APPDATA
            ? process.env.NEXT_PUBLIC_APPDATA
            : "";
    } else {
        return (
            process.env.NEXT_PUBLIC_XDG_CONFIG_HOME ||
            (process.env.NEXT_PUBLIC_HOME
                ? join(process.env.NEXT_PUBLIC_HOME, ".config")
                : "")
        );
    }
}

/*
CONFIG_VALUES = {
    SAVE_CREDENTIALS:           { 'default': 'True',  'type': bool, 'arg': '--save-credentials'           },
    CREDENTIALS_LOCATION:       { 'default': '',      'type': str,  'arg': '--credentials-location'       },
    OUTPUT:                     { 'default': '',      'type': str,  'arg': '--output'                     },
    SONG_ARCHIVE:               { 'default': '',      'type': str,  'arg': '--song-archive'               },
    ROOT_PATH:                  { 'default': '',      'type': str,  'arg': '--root-path'                  },
    ROOT_PODCAST_PATH:          { 'default': '',      'type': str,  'arg': '--root-podcast-path'          },
    SPLIT_ALBUM_DISCS:          { 'default': 'False', 'type': bool, 'arg': '--split-album-discs'          },
    DOWNLOAD_LYRICS:            { 'default': 'True',  'type': bool, 'arg': '--download-lyrics'            },
    MD_SAVE_GENRES:             { 'default': 'False', 'type': bool, 'arg': '--md-save-genres'             },
    MD_ALLGENRES:               { 'default': 'False', 'type': bool, 'arg': '--md-allgenres'               },
    MD_GENREDELIMITER:          { 'default': ',',     'type': str,  'arg': '--md-genredelimiter'          },
    DOWNLOAD_FORMAT:            { 'default': 'ogg',   'type': str,  'arg': '--download-format'            },
    DOWNLOAD_QUALITY:           { 'default': 'auto',  'type': str,  'arg': '--download-quality'           },
    TRANSCODE_BITRATE:          { 'default': 'auto',  'type': str,  'arg': '--transcode-bitrate'          },
    SKIP_EXISTING:              { 'default': 'True',  'type': bool, 'arg': '--skip-existing'              },
    SKIP_PREVIOUSLY_DOWNLOADED: { 'default': 'False', 'type': bool, 'arg': '--skip-previously-downloaded' },
    RETRY_ATTEMPTS:             { 'default': '1',     'type': int,  'arg': '--retry-attempts'             },
    BULK_WAIT_TIME:             { 'default': '1',     'type': int,  'arg': '--bulk-wait-time'             },
    OVERRIDE_AUTO_WAIT:         { 'default': 'False', 'type': bool, 'arg': '--override-auto-wait'         },
    CHUNK_SIZE:                 { 'default': '20000', 'type': int,  'arg': '--chunk-size'                 },
    DOWNLOAD_REAL_TIME:         { 'default': 'False', 'type': bool, 'arg': '--download-real-time'         },
    LANGUAGE:                   { 'default': 'en',    'type': str,  'arg': '--language'                   },
    PRINT_SPLASH:               { 'default': 'False', 'type': bool, 'arg': '--print-splash'               },
    PRINT_SKIPS:                { 'default': 'True',  'type': bool, 'arg': '--print-skips'                },
    PRINT_DOWNLOAD_PROGRESS:    { 'default': 'True',  'type': bool, 'arg': '--print-download-progress'    },
    PRINT_ERRORS:               { 'default': 'True',  'type': bool, 'arg': '--print-errors'               },
    PRINT_DOWNLOADS:            { 'default': 'False', 'type': bool, 'arg': '--print-downloads'            },
    PRINT_API_ERRORS:           { 'default': 'True',  'type': bool, 'arg': '--print-api-errors'           },
    PRINT_PROGRESS_INFO:        { 'default': 'True',  'type': bool, 'arg': '--print-progress-info'        },
    PRINT_WARNINGS:             { 'default': 'True',  'type': bool, 'arg': '--print-warnings'             },
    TEMP_DOWNLOAD_DIR:          { 'default': '',      'type': str,  'arg': '--temp-download-dir'          }
}
*/

function Accounts({ store }: { store: Store }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [config, setConfig] = useState<any>();
    const userNameRef = useRef<InputRef>(null);
    const passwordRef = useRef<InputRef>(null);

    useEffect(() => {
        store.load().then(async () => {
            const config = (await store.get("config")) as any;
            setConfig(config);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    interface DataType {
        key: string;
        id: string;
        name: string;
    }

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "Username",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
            width: "90%",
        },
        {
            title: "Delete",
            key: "action",
            render: (_, record) => (
                <Button
                    danger
                    onClick={() =>
                        deleteAccount(store, record.id).then(() => {
                            store.get("config").then((config) => {
                                setConfig(config);
                            });
                        })
                    }
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
            >
                Add Account
            </Button>
            <Table
                className="mt-4"
                columns={columns}
                dataSource={(config && config.accounts) ?? []}
                pagination={{
                    hideOnSinglePage: true,
                }}
                locale={{
                    emptyText: "No accounts added",
                }}
            />
            <Modal
                title="Add Account"
                open={isModalOpen}
                footer={
                    <div className="flex flex-row justify-between">
                        <Button
                            key="back"
                            type="text"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <div className="flex flex-row space-x-2">
                            <Button key="back" type="default">
                                Test
                            </Button>
                            <Button
                                key="add"
                                type="primary"
                                onClick={() => {
                                    addAccount(
                                        store,
                                        userNameRef.current?.input?.value ?? "",
                                        passwordRef.current?.input?.value ?? ""
                                    ).then(() => {
                                        setIsModalOpen(false);
                                        store.get("config").then((config) => {
                                            setConfig(config);
                                        });
                                    });
                                }}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                }
            >
                <Divider style={{ marginTop: "0" }} />
                <Input
                    placeholder="Username"
                    className="!my-1"
                    size="large"
                    prefix={<UserOutlined />}
                    ref={userNameRef}
                />
                <Input
                    placeholder="Password"
                    className="!my-1"
                    size="large"
                    prefix={<LockOutlined />}
                    ref={passwordRef}
                />
                <Alert
                    message="Passwords are stored locally in plain text"
                    className="!my-2"
                    type="warning"
                    showIcon
                />
            </Modal>
        </div>
    );
}

function DownloadSettings() {
    return (
        <div>
            <h2>Download Settings</h2>
        </div>
    );
}

async function addAccount(store: Store, username: string, password: string) {
    await store.load();
    const config = (await store.get("config")) as any;
    const accounts = config.accounts ?? [];
    const id = uuidv4();

    accounts.push({
        id,
        name: username,
        password: password,
    });

    await store.set("config", {
        ...config,
        accounts,
    });

    await store.save();
}

async function deleteAccount(store: Store, id: string) {
    await store.load();
    const config = (await store.get("config")) as any;
    const accounts = config.accounts ?? [];
    const index = accounts.findIndex((account: any) => account.id === id);

    if (index !== -1) {
        accounts.splice(index, 1);
    }

    await store.set("config", {
        ...config,
        accounts,
    });

    await store.save();
}

export default function Settings() {
    const config_path = join(configDirectory(), "zotify-gui.bin");
    const store = new Store(config_path);

    return (
        <div className="mx-8 my-4">
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800" }}>Settings</h1>
            <div className="mt-4">
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: "1",
                            label: "Download Settings",
                            children: <DownloadSettings />,
                        },
                        {
                            key: "2",
                            label: "Accounts",
                            children: <Accounts store={store} />,
                        },
                    ]}
                    onChange={() => {}}
                />
            </div>
        </div>
    );
}
