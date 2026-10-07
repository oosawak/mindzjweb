import { invoke } from "../backend";
import { vaultStore } from "../stores/vault";
import { toVaultAssetUrl } from "./vaultPaths";
import { t } from "../i18n";

type FilmCraftWindow = Window & typeof globalThis & { filmcraftLoad?: { readyMs?: number } };

/** Open the bundled, unmodified FilmCraft web app and bridge the selected Vault video. */
export function openVideoInFilmCraft(relativePath: string): void {
  const vault = vaultStore.vaultInfo();
  const assetUrl = toVaultAssetUrl(vault?.path ?? "", relativePath);
  const fileName = relativePath.split(/[\\/]/).pop() || "video";
  const appBase = new URL(import.meta.env.BASE_URL, window.location.origin);
  const url = new URL("filmcraft/index.html", appBase);
  const sourceDirectory = relativePath.split(/[\\/]/).slice(0, -1).join("/");
  const sourceName = relativePath.split(/[\\/]/).pop() || fileName;
  let disposed = false;
  let imported = false;
  let attachedDocument: Document | null = null;
  const timers = new Set<number>();
  const cleanupListeners: Array<() => void> = [];

  const saveExport = async (blob: Blob, requestedName: string) => {
    const exportedName = requestedName.split(/[\\/]/).pop() || "filmcraft-export";
    const isProject = exportedName.toLowerCase().endsWith(".fcproj");
    const sameAsSource = exportedName.toLowerCase() === sourceName.toLowerCase();
    const lastDot = exportedName.lastIndexOf(".");
    const stem = lastDot > 0 ? exportedName.slice(0, lastDot) : exportedName;
    const extension = lastDot > 0 ? exportedName.slice(lastDot) : "";
    const outputName = sameAsSource && !isProject ? `${stem}_FilmCraft${extension}` : exportedName;
    const outputPath = sourceDirectory ? `${sourceDirectory}/${outputName}` : outputName;
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    await invoke("write_binary_file", { relativePath: outputPath, base64Data: btoa(binary) });
    await vaultStore.refreshFileTree();
    document.dispatchEvent(new CustomEvent("mindzj:show-toast", { detail: { message: t("filmcraft.saved", { fileName: outputName }) } }));
  };

  const connect = (frame: HTMLIFrameElement) => {
    const child = frame.contentWindow as FilmCraftWindow | null;
    const childDocument = frame.contentDocument;
    if (!child || !childDocument || disposed) return;

    if (attachedDocument !== childDocument) {
      attachedDocument = childDocument;
      const handleDownload = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        const anchor = target?.closest?.("a[download]") as HTMLAnchorElement | null;
        if (!anchor?.href || anchor.dataset.mindzjBypassDownload === "true") return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const name = anchor.download || "filmcraft-export";
        void child.fetch(anchor.href)
          .then((response) => {
            if (!response.ok) throw new Error(`FilmCraft export request failed (${response.status})`);
            return response.blob();
          })
          .then((blob) => saveExport(blob, name))
          .catch((error) => {
            console.error("Could not save FilmCraft output to the Vault:", error);
            document.dispatchEvent(new CustomEvent("mindzj:show-toast", { detail: { message: t("filmcraft.saveFailed", { fileName: name }) } }));
            anchor.dataset.mindzjBypassDownload = "true";
            anchor.click();
            setTimeout(() => delete anchor.dataset.mindzjBypassDownload, 0);
          });
      };
      childDocument.addEventListener("click", handleDownload, true);
      cleanupListeners.push(() => childDocument.removeEventListener("click", handleDownload, true));
    }

    const waitUntilReady = () => {
      if (disposed || frame.contentDocument !== childDocument) return;
      if (!child.filmcraftLoad?.readyMs) {
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          waitUntilReady();
        }, 100);
        timers.add(timer);
        return;
      }
      if (imported) return;
      imported = true;
      void fetch(assetUrl, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error(`Video request failed (${response.status})`);
          return response.blob();
        })
        .then((blob) => {
          const canvas = childDocument.getElementById("filmcraft_canvas");
          if (!canvas) throw new Error("FilmCraft canvas was not found");
          const transfer = new child.DataTransfer();
          transfer.items.add(new child.File([blob], fileName, { type: blob.type || "application/octet-stream" }));
          for (const type of ["dragenter", "dragover", "drop"]) {
            canvas.dispatchEvent(new child.DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: transfer }));
          }
        })
        .catch((error) => {
          console.error("Could not open the selected video in FilmCraft:", error);
          document.dispatchEvent(new CustomEvent("mindzj:show-toast", { detail: { message: t("filmcraft.openFailed", { fileName }) } }));
        });
    };
    waitUntilReady();
  };

  window.dispatchEvent(new CustomEvent("mindzj:open-filmcraft", {
    detail: {
      url: url.toString(),
      fileName,
      editor: "FilmCraft" as const,
      connect,
      close: () => {
        disposed = true;
        for (const timer of timers) window.clearTimeout(timer);
        timers.clear();
        cleanupListeners.splice(0).forEach((cleanup) => cleanup());
      },
    },
  }));
}
