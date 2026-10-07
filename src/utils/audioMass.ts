import { invoke } from "../backend";
import { vaultStore } from "../stores/vault";
import { toVaultAssetUrl } from "./vaultPaths";
import { t } from "../i18n";

type AudioMassWindow = Window & typeof globalThis & {
  PKAudioEditor?: { engine?: { LoadArrayBuffer?: (input: Blob) => void } };
};

/** Open the bundled AudioMass editor with a Vault audio file and save exports back beside it. */
export function openAudioInAudioMass(relativePath: string): void {
  const vault = vaultStore.vaultInfo();
  const assetUrl = toVaultAssetUrl(vault?.path ?? "", relativePath);
  const fileName = relativePath.split(/[\\/]/).pop() || "audio";
  const appBase = new URL(import.meta.env.BASE_URL, window.location.origin);
  const url = new URL("audiomass/index.html", appBase);
  const sourceDirectory = relativePath.split(/[\\/]/).slice(0, -1).join("/");
  const sourceStem = fileName.replace(/\.[^.]+$/, "");
  let disposed = false;
  let imported = false;
  let attachedDocument: Document | null = null;
  const timers = new Set<number>();
  const cleanupListeners: Array<() => void> = [];

  const saveExport = async (blob: Blob, requestedName: string) => {
    let outputName = requestedName.split(/[\\/]/).pop() || "audio-export.wav";
    if (/^(audiomass-output|output)\.(wav|mp3|flac)$/i.test(outputName)) {
      const extension = outputName.slice(outputName.lastIndexOf("."));
      outputName = `${sourceStem}_edited${extension}`;
    }
    const outputPath = sourceDirectory ? `${sourceDirectory}/${outputName}` : outputName;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    await invoke("write_binary_file", { relativePath: outputPath, base64Data: btoa(binary) });
    await vaultStore.refreshFileTree();
    document.dispatchEvent(new CustomEvent("mindzj:show-toast", {
      detail: { message: t("audiomass.saved", { fileName: outputName }) },
    }));
  };

  const connect = (frame: HTMLIFrameElement) => {
    const child = frame.contentWindow as AudioMassWindow | null;
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
        const name = anchor.download || "audio-export.wav";
        void child.fetch(anchor.href)
          .then((response) => {
            if (!response.ok) throw new Error(`AudioMass export request failed (${response.status})`);
            return response.blob();
          })
          .then((blob) => saveExport(blob, name))
          .catch((error) => {
            console.error("Could not save the AudioMass export to the Vault:", error);
            document.dispatchEvent(new CustomEvent("mindzj:show-toast", {
              detail: { message: t("audiomass.saveFailed", { fileName: name }) },
            }));
            anchor.dataset.mindzjBypassDownload = "true";
            anchor.click();
            setTimeout(() => delete anchor.dataset.mindzjBypassDownload, 0);
          });
      };
      childDocument.addEventListener("click", handleDownload, true);
      cleanupListeners.push(() => childDocument.removeEventListener("click", handleDownload, true));
    }

    const loadWhenReady = () => {
      if (disposed || frame.contentDocument !== childDocument || imported) return;
      const editor = child.PKAudioEditor;
      if (!editor?.engine?.LoadArrayBuffer) {
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          loadWhenReady();
        }, 50);
        timers.add(timer);
        return;
      }
      imported = true;
      void fetch(assetUrl, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error(`Audio request failed (${response.status})`);
          return response.blob();
        })
        .then((blob) => {
          if (blob.size === 0) throw new Error("The selected audio file is empty");
          editor.engine!.LoadArrayBuffer!(blob);
        })
        .catch((error) => {
          console.error("Could not open the selected audio in AudioMass:", error);
          document.dispatchEvent(new CustomEvent("mindzj:show-toast", {
            detail: { message: t("audiomass.openFailed", { fileName }) },
          }));
        });
    };
    loadWhenReady();
  };

  window.dispatchEvent(new CustomEvent("mindzj:open-audiomass", {
    detail: {
      url: url.toString(),
      fileName,
      editor: "AudioMass" as const,
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
