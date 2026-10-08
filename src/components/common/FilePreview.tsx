import { Component, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { invoke } from "../../backend";
import { editorStore } from "../../stores/editor";
import { vaultStore } from "../../stores/vault";
import { displayName } from "../../utils/displayName";
import { getFileExtension } from "../../utils/fileTypes";
import { toVaultAssetUrl } from "../../utils/vaultPaths";
import { readInternetShortcutUrl } from "../../utils/openFileRouted";
import { t } from "../../i18n";
import { editLockStore } from "../../stores/editLock";
import type { FileContent } from "../../stores/vault";

export const FilePreview: Component<{
    filePath: string;
    kind: "image" | "document";
    active?: boolean;
}> = (props) => {
    const fileName = createMemo(() => displayName(props.filePath));
    const extension = createMemo(() => getFileExtension(props.filePath).toUpperCase() || "FILE");
    const isInternetShortcut = createMemo(() => extension() === "URL");
    const [shortcutUrl, setShortcutUrl] = createSignal<string | null>(null);
    const [shortcutError, setShortcutError] = createSignal("");
    const [editingSource, setEditingSource] = createSignal(false);
    const [sourceContent, setSourceContent] = createSignal("");
    const [sourceError, setSourceError] = createSignal("");
    const [sourceBusy, setSourceBusy] = createSignal(false);
    const [sourceLockAcquired, setSourceLockAcquired] = createSignal(false);
    const [previewRevision, setPreviewRevision] = createSignal(0);
    const previewableMedia = createMemo(() => ["HTML", "HTM", "URL", "PDF", "MP3", "M4A", "WAV", "OGG", "FLAC", "AAC", "OPUS", "MP4", "M4V", "MOV", "AVI", "MKV", "WEBM", "OGV", "GLB", "GLTF"].includes(extension()));
    const supportsSourceEdit = createMemo(() => ["HTML", "HTM", "URL"].includes(extension()));
    const isAudio = createMemo(() => ["MP3", "M4A", "WAV", "OGG", "FLAC", "AAC", "OPUS"].includes(extension()));
    const isVideo = createMemo(() => ["MP4", "M4V", "MOV", "AVI", "MKV", "WEBM", "OGV"].includes(extension()));
    const isModel = createMemo(() => ["GLB", "GLTF"].includes(extension()));
    const assetUrl = createMemo(() => {
        const root = vaultStore.vaultInfo()?.path ?? "";
        if (!root) return "";
        try {
            return toVaultAssetUrl(root, props.filePath);
        } catch (error) {
            console.warn("[FilePreview] failed to build asset URL:", error);
            return "";
        }
    });
    const photoCraftImagePath = () => {
        if (props.filePath.replace(/\\/g, "/").toLowerCase() !== "photocraft/index.html") return null;
        return new URLSearchParams(window.location.search).get("photocraft_image");
    };
    const htmlAssetUrl = createMemo(() => {
        const url = assetUrl();
        if (!url || !photoCraftImagePath()) return url;
        return `${url}?mindzj_photocraft_bridge=1`;
    });
    const htmlPreviewUrl = createMemo(() => {
        const url = htmlAssetUrl();
        if (!url) return url;
        const query = [`mindzj_preview_policy=2`];
        if (previewRevision() > 0) query.push(`mindzj_preview=${previewRevision()}`);
        return `${url}${url.includes("?") ? "&" : "?"}${query.join("&")}`;
    });

    async function beginSourceEdit() {
        setSourceBusy(true);
        setSourceError("");
        try {
            if (!(await editLockStore.acquire(props.filePath))) return;
            setSourceLockAcquired(true);
            const file = await invoke<FileContent>("read_file", { relativePath: props.filePath });
            setSourceContent(file.content);
            setEditingSource(true);
        } catch (error) {
            console.error("Could not open source editor:", error);
            setSourceError(error instanceof Error ? error.message : String(error));
            if (sourceLockAcquired()) await editLockStore.release(props.filePath);
            setSourceLockAcquired(false);
        } finally {
            setSourceBusy(false);
        }
    }

    async function cancelSourceEdit() {
        setEditingSource(false);
        if (sourceLockAcquired()) await editLockStore.release(props.filePath);
        setSourceLockAcquired(false);
    }

    async function saveSource() {
        if (sourceBusy()) return;
        setSourceBusy(true);
        setSourceError("");
        try {
            const saved = await invoke<FileContent>("write_file", {
                relativePath: props.filePath,
                content: sourceContent(),
            });
            vaultStore.applySavedFileContent({ ...saved, kind: "document" });
            setPreviewRevision((revision) => revision + 1);
            setEditingSource(false);
            if (sourceLockAcquired()) await editLockStore.release(props.filePath);
            setSourceLockAcquired(false);
        } catch (error) {
            console.error("Could not save source file:", error);
            setSourceError(error instanceof Error ? error.message : String(error));
        } finally {
            setSourceBusy(false);
        }
    }

    onCleanup(() => {
        if (sourceLockAcquired()) void editLockStore.release(props.filePath);
    });

    onMount(() => {
        const handleForceSave = () => {
            if (editingSource() && props.active !== false) void saveSource();
        };
        document.addEventListener("mindzj:force-save", handleForceSave);
        onCleanup(() => document.removeEventListener("mindzj:force-save", handleForceSave));
    });

    async function sendPhotoCraftImage(frame: HTMLIFrameElement) {
        const path = photoCraftImagePath();
        const root = vaultStore.vaultInfo()?.path;
        if (!path || !root || !frame.contentWindow) return;
        if (path.startsWith("/") || path.split(/[\\/]/).includes("..")) {
            console.warn("Rejected unsafe PhotoCraft image path:", path);
            return;
        }
        try {
            const response = await fetch(toVaultAssetUrl(root, path));
            if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`);
            const blob = await response.blob();
            frame.contentWindow.postMessage({
                type: "mindzj:photocraft-open-image",
                fileName: path.split(/[\\/]/).pop() || "image",
                file: blob,
            }, "*");
        } catch (error) {
            console.error("Could not send image to PhotoCraft:", error);
        }
    }

    const openInDefaultApp = async () => {
        try {
            await invoke("open_in_default_app", { relativePath: props.filePath });
        } catch (error) {
            console.warn("[FilePreview] open_in_default_app failed:", error);
        }
    };

    const revealInExplorer = async () => {
        try {
            await invoke("reveal_in_file_manager", { relativePath: props.filePath });
        } catch (error) {
            console.warn("[FilePreview] reveal_in_file_manager failed:", error);
        }
    };

    createEffect(() => {
        if (!props.active) return;
        editorStore.updateStats("");
        editorStore.setCursorLine(1);
        editorStore.setCursorCol(1);
    });

    createEffect(() => {
        if (!isInternetShortcut() || !props.active) return;
        previewRevision();
        const relativePath = props.filePath;
        let cancelled = false;
        setShortcutUrl(null);
        setShortcutError("");
        void readInternetShortcutUrl(relativePath)
            .then((url) => {
                if (!cancelled) setShortcutUrl(url);
            })
            .catch((error) => {
                console.error("Could not read Internet Shortcut:", error);
                if (!cancelled) setShortcutError(t("filePreview.urlShortcutError"));
            });
        onCleanup(() => { cancelled = true; });
    });

    return (
        <div
            style={{
                flex: "1",
                display: "flex",
                "flex-direction": "column",
                "min-width": "0",
                "min-height": "0",
                overflow: "hidden",
                background: "var(--mz-bg-primary)",
            }}
        >
            <Show when={editingSource()} fallback={<Show
                when={props.kind === "image"}
                fallback={
                    <Show
                        when={previewableMedia()}
                        fallback={<div
                            style={{
                                flex: "1",
                                display: "flex",
                                "align-items": "center",
                                "justify-content": "center",
                                padding: "32px",
                            }}
                        >
                        <div
                            style={{
                                width: "min(460px, 100%)",
                                display: "flex",
                                "flex-direction": "column",
                                gap: "16px",
                                padding: "28px",
                                border: "1px solid var(--mz-border)",
                                "border-radius": "16px",
                                background: "var(--mz-bg-secondary)",
                                "box-shadow": props.active
                                    ? "0 0 0 1px color-mix(in srgb, var(--mz-accent) 40%, transparent)"
                                    : "none",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    "align-items": "center",
                                    gap: "14px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        "border-radius": "14px",
                                        background: "var(--mz-bg-tertiary)",
                                        border: "1px solid var(--mz-border)",
                                        display: "flex",
                                        "align-items": "center",
                                        "justify-content": "center",
                                        color: "var(--mz-text-secondary)",
                                        "font-size": "13px",
                                        "font-weight": "700",
                                        "letter-spacing": "0.06em",
                                        "flex-shrink": "0",
                                    }}
                                >
                                    {extension()}
                                </div>
                                <div style={{ "min-width": "0" }}>
                                    <div
                                        style={{
                                            "font-size": "var(--mz-font-size-md)",
                                            "font-weight": "600",
                                            color: "var(--mz-text-primary)",
                                            overflow: "hidden",
                                            "text-overflow": "ellipsis",
                                            "white-space": "nowrap",
                                        }}
                                    >
                                        {fileName()}
                                    </div>
                                    <div
                                        style={{
                                            "font-size": "var(--mz-font-size-sm)",
                                            color: "var(--mz-text-muted)",
                                            "margin-top": "4px",
                                        }}
                                    >
                                        {t("filePreview.documentDescription")}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", "flex-wrap": "wrap" }}>
                                <button onClick={() => void openInDefaultApp()} style={actionButtonStyle(true)}>
                                    {t("livePreview.openInDefaultApp")}
                                </button>
                                <button onClick={() => void revealInExplorer()} style={actionButtonStyle(false)}>
                                    {t("context.showInExplorer")}
                                </button>
                            </div>
                        </div>
                        </div>}
                    >
                        <>
                        <Show when={supportsSourceEdit()}>
                            <div style={{ display: "flex", "align-items": "center", gap: "8px", padding: "8px 12px", "border-bottom": "1px solid var(--mz-border)", background: "var(--mz-bg-secondary)" }}>
                                <strong style={{ flex: "1", overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", color: "var(--mz-text-primary)" }}>{fileName()}</strong>
                                <button disabled={sourceBusy()} onClick={() => void beginSourceEdit()} style={actionButtonStyle(false)}>
                                    {sourceBusy() ? t("filePreview.loadingSource") : t("filePreview.editSource")}
                                </button>
                            </div>
                        </Show>
                        <div style={{ display: "flex", "flex-direction": "column", flex: "1", "min-height": "0" }}>
                        <Show when={isInternetShortcut()}>
                            <Show
                                when={shortcutUrl()}
                                fallback={
                                    <div style={{ flex: "1", display: "grid", "place-items": "center", color: "var(--mz-text-muted)", "font-size": "var(--mz-font-size-sm)" }}>
                                        {shortcutError() || t("filePreview.urlShortcutLoading")}
                                    </div>
                                }
                            >
                                {(url) => (
                                    <iframe
                                        src={url()}
                                        title={fileName()}
                                        sandbox="allow-scripts allow-forms allow-popups allow-downloads"
                                        referrerPolicy="no-referrer"
                                        style={{ flex: "1", width: "100%", height: "100%", border: "0", background: "var(--mz-bg-primary)" }}
                                    />
                                )}
                            </Show>
                        </Show>
                        <Show when={extension() === "HTML" || extension() === "HTM"}>
                            <iframe
                                src={htmlPreviewUrl()}
                                title={fileName()}
                                sandbox="allow-scripts allow-forms allow-popups allow-downloads allow-modals allow-pointer-lock"
                                referrerPolicy="no-referrer"
                                onLoad={(event) => {
                                    if (photoCraftImagePath()) void sendPhotoCraftImage(event.currentTarget);
                                }}
                                style={{ flex: "1", width: "100%", height: "100%", border: "0", background: "var(--mz-bg-primary)" }}
                            />
                        </Show>
                        <Show when={extension() === "PDF"}>
                            <iframe
                                src={assetUrl()}
                                title={fileName()}
                                style={{ flex: "1", width: "100%", height: "100%", border: "0", background: "var(--mz-bg-primary)" }}
                            />
                        </Show>
                        <Show when={isAudio()}>
                            <div style={mediaStageStyle}>
                                <div style={{ color: "var(--mz-text-primary)", "font-size": "var(--mz-font-size-lg)", "font-weight": "600", "text-align": "center", "overflow-wrap": "anywhere" }}>{fileName()}</div>
                                <audio controls preload="metadata" src={assetUrl()} aria-label={fileName()} style={{ width: "min(640px, 100%)" }} />
                            </div>
                        </Show>
                        <Show when={isVideo()}>
                            <div style={mediaStageStyle}>
                                <video controls preload="metadata" src={assetUrl()} aria-label={fileName()} style={{ "max-width": "100%", "max-height": "80vh", "border-radius": "10px", background: "#000" }} />
                            </div>
                        </Show>
                        <Show when={isModel()}>
                            <ModelPreview src={assetUrl()} title={fileName()} />
                        </Show>
                        </div>
                        </>
                    </Show>
                }
            >
                <div
                    class="mz-file-preview-scroll"
                    style={{
                        flex: "1",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        padding: "20px",
                        overflow: "auto",
                        background:
                            "radial-gradient(circle at center, color-mix(in srgb, var(--mz-accent) 10%, transparent) 0%, transparent 55%)",
                    }}
                >
                    <img
                        src={assetUrl()}
                        alt={fileName()}
                        draggable={false}
                        style={{
                            display: "block",
                            "max-width": "100%",
                            "max-height": "100%",
                            width: "auto",
                            height: "auto",
                            "object-fit": "contain",
                            "border-radius": "10px",
                            "box-shadow": "0 12px 40px rgba(0,0,0,0.22)",
                            background: "transparent",
                        }}
                    />
                </div>
            </Show>}>
                <div style={{ display: "flex", "flex-direction": "column", flex: "1", "min-height": "0" }}>
                    <div style={{ display: "flex", "align-items": "center", gap: "8px", padding: "8px 12px", "border-bottom": "1px solid var(--mz-border)", background: "var(--mz-bg-secondary)" }}>
                        <strong style={{ flex: "1", overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", color: "var(--mz-text-primary)" }}>{fileName()}</strong>
                        <button disabled={sourceBusy()} onClick={() => void saveSource()} style={actionButtonStyle(true)}>{t("common.save")}</button>
                        <button disabled={sourceBusy()} onClick={() => void cancelSourceEdit()} style={actionButtonStyle(false)}>{t("common.cancel")}</button>
                    </div>
                    <Show when={sourceError()}>
                        <div role="alert" style={{ padding: "8px 12px", color: "var(--mz-danger, #ef6b73)", "font-size": "var(--mz-font-size-sm)" }}>{sourceError()}</div>
                    </Show>
                    <textarea
                        aria-label={`${fileName()} source`}
                        spellcheck={false}
                        value={sourceContent()}
                        onInput={(event) => setSourceContent(event.currentTarget.value)}
                        style={{ flex: "1", width: "100%", "min-height": "0", resize: "none", border: "0", outline: "none", padding: "16px", color: "var(--mz-text-primary)", background: "var(--mz-bg-primary)", "font-family": "var(--mz-font-mono, monospace)", "font-size": "13px", "line-height": "1.55", "tab-size": "4" }}
                    />
                </div>
            </Show>
        </div>
    );
};

const mediaStageStyle = {
    flex: "1",
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
    "justify-content": "center",
    gap: "24px",
    padding: "24px",
    background: "radial-gradient(circle at center, color-mix(in srgb, var(--mz-accent) 10%, transparent) 0%, transparent 55%)",
} as const;

const ModelPreview: Component<{ src: string; title: string }> = (props) => {
    const [error, setError] = createSignal(false);
    let container: HTMLDivElement | undefined;
    let viewer: HTMLElement | undefined;

    onMount(() => {
        let cancelled = false;
        void import("@google/model-viewer").then(() => {
            if (cancelled || !container) return;
            viewer = document.createElement("model-viewer");
            viewer.setAttribute("src", props.src);
            viewer.setAttribute("alt", props.title);
            viewer.setAttribute("camera-controls", "");
            viewer.setAttribute("auto-rotate", "");
            viewer.setAttribute("interaction-prompt", "auto");
            viewer.style.width = "100%";
            viewer.style.height = "100%";
            viewer.style.minHeight = "320px";
            viewer.style.backgroundColor = "transparent";
            viewer.addEventListener("error", () => setError(true));
            container.append(viewer);
        }).catch((cause) => {
            console.error("Failed to load 3D model viewer:", cause);
            setError(true);
        });
        onCleanup(() => {
            cancelled = true;
            viewer?.remove();
        });
    });

    return (
        <div ref={container} style={{ flex: "1", width: "100%", "min-height": "0", position: "relative" }}>
            <Show when={error()}>
                <div style={{ position: "absolute", inset: "0", display: "grid", "place-items": "center", color: "var(--mz-text-muted)", "font-size": "var(--mz-font-size-sm)" }}>
                    {t("filePreview.modelError")}
                </div>
            </Show>
        </div>
    );
};

function actionButtonStyle(primary: boolean) {
    return {
        height: "34px",
        padding: "0 14px",
        border: primary ? "1px solid var(--mz-accent)" : "1px solid var(--mz-border)",
        background: primary ? "var(--mz-accent)" : "transparent",
        color: primary ? "var(--mz-text-on-accent)" : "var(--mz-text-secondary)",
        cursor: "pointer",
        "border-radius": "10px",
        "font-size": "var(--mz-font-size-sm)",
        "font-family": "var(--mz-font-sans)",
    } as const;
}
