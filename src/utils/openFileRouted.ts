import { invoke } from "../backend";
import { vaultStore } from "../stores/vault";
import { hasPluginViewForExtension } from "../stores/plugins";
import { getFileHandler } from "./fileTypes";

/**
 * Unified "open a file in the vault" entry point used by every
 * user-facing click site in the app (file tree, search results,
 * wikilink clicks, backlinks panel, command palette, calendar daily
 * note, etc.).
 *
 * Routes the file based on its extension:
 *
 *   - Text / markdown / source code → in-app CodeMirror editor via
 *     `vaultStore.openFile(path)`. The editor can handle any text
 *     encoding that `read_file` returns.
 *
 *   - Plugin-registered extensions (e.g. `.mindzj`) → also through
 *     `vaultStore.openFile(path)`, because the editor area delegates
 *     to a `PluginViewHost` when it detects a registered extension.
 *
 *   - Images (`.png`, `.jpg`, `.gif`, `.webp`, `.svg`, ...) → an
 *     in-app preview tab.
 *
 *   - PDFs → an in-app PDF viewer tab.
 *   - `.doc/.docx` → an in-app document placeholder tab so the file
 *     stays in the workspace rather than jumping out to another app.
 *
 *   - Office documents, archives, A/V files → the OS default
 *     application (Word, Excel, Acrobat, the system media player).
 *     We can't render these inside WebView2 usefully.
 *
 * Errors are logged but NOT thrown, so a single broken file click
 * never crashes the UI — each click site can `void openFileRouted(...)`.
 */
export async function openFileRouted(relativePath: string): Promise<void> {
    if (/\.url$/i.test(relativePath)) {
        // Windows Internet Shortcut files are small INI-like text files.
        // Open a blank tab synchronously so browsers allow the later URL
        // navigation after the shortcut content has been read.
        const isTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
        const popup = !isTauri && typeof window !== "undefined"
            ? window.open("about:blank", "_blank")
            : null;
        if (popup) popup.opener = null;

        try {
            const shortcut = await invoke<{ content: string }>("read_file", { relativePath });
            const content = shortcut.content.replace(/^\uFEFF/, "");
            const match = content
                .match(/^\s*URL\s*=\s*(.*?)\s*$/im);
            const target = match?.[1] || content.split(/\r?\n/).map((line) => line.trim())
                .find((line) => /^https?:\/\//i.test(line));
            if (!target) throw new Error("The .url file does not contain a URL entry");

            const url = new URL(target);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                throw new Error("Only HTTP and HTTPS links are allowed in .url files");
            }

            if (isTauri) {
                const shell = await import("@tauri-apps/plugin-shell");
                await shell.open(url.toString());
            } else if (popup) {
                popup.location.replace(url.toString());
            } else {
                console.warn("[openFileRouted] browser blocked the .url popup");
            }
        } catch (e) {
            popup?.close();
            console.error("[openFileRouted] failed to open Internet Shortcut:", e);
        }
        return;
    }

    const handler = getFileHandler(relativePath, hasPluginViewForExtension);

    switch (handler) {
        case "image": {
            try {
                vaultStore.openPreviewFile(relativePath, "image");
            } catch (e) {
                console.error("[openFileRouted] openPreviewFile(image) failed:", e);
            }
            return;
        }

        case "preview": {
            try {
                vaultStore.openPreviewFile(relativePath, "document");
            } catch (e) {
                console.error("[openFileRouted] openPreviewFile(document) failed:", e);
            }
            return;
        }

        case "external": {
            // Delegate to the OS default app: Word/Writer for .doc,
            // Excel/Calc for .xlsx/.csv,
            // system media player for .mp4/.mp3, etc. The Rust
            // `open_in_default_app` command does `cmd /C start "" …`
            // on Windows, `open` on macOS, `xdg-open` on Linux.
            try {
                await invoke("open_in_default_app", { relativePath });
            } catch (e) {
                console.error("[openFileRouted] open_in_default_app failed:", e);
            }
            return;
        }

        case "editor":
        case "plugin":
        case "unknown":
        default: {
            // In-app editor or plugin view — the existing flow.
            // `unknown` falls through to the editor because most
            // unknown extensions are still text files of some kind
            // (readme, config, script), and showing garbled bytes
            // is strictly better than silently swallowing the click.
            try {
                await vaultStore.openFile(relativePath);
            } catch (e) {
                console.error("[openFileRouted] openFile failed:", e);
            }
            return;
        }
    }
}
