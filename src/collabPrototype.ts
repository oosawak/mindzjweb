import * as Y from "yjs";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { history, historyKeymap, defaultKeymap } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { yCollab } from "y-codemirror.next";

const form = document.querySelector<HTMLFormElement>("#connect-form")!;
const status = document.querySelector<HTMLElement>("#status")!;
const button = document.querySelector<HTMLButtonElement>("#connect-button")!;
const host = document.querySelector<HTMLElement>("#editor")!;
let socket: WebSocket | undefined;
let doc: Y.Doc | undefined;
let editor: EditorView | undefined;
const remoteOrigin = Symbol("remote-update");

function setStatus(message: string) { status.textContent = message; }

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (socket) return;
  button.disabled = true;
  setStatus("Vaultを開いています…");
  const values = new FormData(form);
  const vaultPath = String(values.get("vaultPath") || "").trim();
  const vaultName = String(values.get("vaultName") || "Collaboration").trim();
  const relativePath = String(values.get("relativePath") || "").trim().replaceAll("\\", "/");
  const displayName = String(values.get("displayName") || "Guest").trim() || "Guest";

  try {
    const opened = await fetch("/api/commands/open_vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: vaultPath, name: vaultName }),
    });
    if (!opened.ok) throw new Error(await responseError(opened));

    const scheme = location.protocol === "https:" ? "wss:" : "ws:";
    const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");
    const ws = new WebSocket(`${scheme}//${location.host}/api/collab/${encodedPath}`);
    ws.binaryType = "arraybuffer";
    socket = ws;
    const ydoc = new Y.Doc();
    doc = ydoc;
    const ytext = ydoc.getText("markdown");
    ydoc.on("update", (update: Uint8Array, origin: unknown) => {
      if (origin === remoteOrigin || ws.readyState !== WebSocket.OPEN) return;
      const frame = new Uint8Array(update.length + 1);
      frame[0] = 1;
      frame.set(update, 1);
      ws.send(frame);
    });

    ws.addEventListener("open", () => setStatus("接続しました。同期状態を受信中…"), { once: true });
    ws.addEventListener("message", (message) => {
      if (!(message.data instanceof ArrayBuffer)) return;
      const frame = new Uint8Array(message.data);
      const kind = frame[0];
      if (kind !== 0 && kind !== 1) return;
      Y.applyUpdate(ydoc, frame.subarray(1), remoteOrigin);
      if (kind === 0 && !editor) {
        editor = new EditorView({
          state: EditorState.create({
            doc: ytext.toString(),
            extensions: [lineNumbers(), history(), keymap.of([...defaultKeymap, ...historyKeymap]), markdown(), yCollab(ytext, null, { undoManager: false })],
          }),
          parent: host,
        });
        form.querySelectorAll("input, button").forEach((element) => (element as HTMLInputElement).disabled = true);
        setStatus(`同期中 · ${displayName} · ${relativePath}`);
      }
    });
    ws.addEventListener("close", () => setStatus("サーバーとの接続が切れました。ページを再読み込みして再接続してください。"));
    ws.addEventListener("error", () => setStatus("接続に失敗しました。Ubuntu ServerのAPIとWebSocketを確認してください。"));
  } catch (error) {
    socket = undefined;
    doc?.destroy();
    doc = undefined;
    button.disabled = false;
    setStatus(error instanceof Error ? error.message : String(error));
  }
});

async function responseError(response: Response): Promise<string> {
  const payload = await response.json().catch(() => null) as { message?: string; error?: string } | null;
  return payload?.message ?? payload?.error ?? `HTTP ${response.status}`;
}

window.addEventListener("pagehide", () => {
  editor?.destroy();
  doc?.destroy();
  socket?.close();
});
