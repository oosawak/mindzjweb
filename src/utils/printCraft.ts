import { invoke } from "../backend";
import { vaultStore } from "../stores/vault";
import { toVaultAssetUrl } from "./vaultPaths";
import { t } from "../i18n";

/** Open a Vault PDF in the embedded PrintCraft editor. */
export function openPdfInPrintCraft(relativePath: string): void {
  const vault = vaultStore.vaultInfo();
  const pdfUrl = toVaultAssetUrl(vault?.path ?? "", relativePath);
  const fileName = relativePath.split(/[\\/]/).pop() || "document.pdf";
  const appBase = new URL(import.meta.env.BASE_URL, window.location.origin);
  const url = new URL("printcraft/index.html", appBase);
  const token = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  url.searchParams.set("file", new URL(pdfUrl, window.location.href).toString());
  const channel = typeof BroadcastChannel === "undefined"
    ? undefined
    : new BroadcastChannel(`mindzj-printcraft:${token}`);
  if (channel) {
    url.searchParams.set("mindzj_filename", fileName);
    url.searchParams.set("mindzj_token", token);
    channel.onmessage = (event: MessageEvent<{ type?: string; fileName?: string; bytes?: Uint8Array }>) => {
      const data = event.data;
      if (data?.type !== "saved-file" || !(data.bytes instanceof Uint8Array)) return;
      if (data.fileName !== fileName) {
        channel.postMessage({ type: "save-result", ok: false, message: "The saved PDF name did not match the opened file." });
        return;
      }
      let binary = "";
      const bytes = data.bytes;
      for (let offset = 0; offset < bytes.length; offset += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
      }
      void invoke("write_binary_file", { relativePath, base64Data: btoa(binary) })
        .then(async () => {
          await vaultStore.refreshFileTree();
          document.dispatchEvent(new CustomEvent("mindzj:show-toast", { detail: { message: t("printcraft.saved", { fileName }) } }));
          channel.postMessage({ type: "save-result", ok: true, fileName });
        })
        .catch((error) => {
          console.error("Could not save the PrintCraft PDF to the Vault:", error);
          document.dispatchEvent(new CustomEvent("mindzj:show-toast", { detail: { message: t("printcraft.saveFailed", { fileName }) } }));
          channel.postMessage({ type: "save-result", ok: false, message: String(error) });
        });
    };
  }

  if (vault?.path) url.searchParams.set("vault_path", vault.path);
  if (vault?.name) url.searchParams.set("vault_name", vault.name);
  window.dispatchEvent(new CustomEvent("mindzj:open-printcraft", {
    detail: { url: url.toString(), fileName, editor: "MindZJ PDF", close: () => channel?.close() },
  }));
}
