import { Component, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { vaultStore, type VaultEntry } from "../../stores/vault";
import { toVaultAssetUrl } from "../../utils/vaultPaths";
import { t } from "../../i18n";
import { invoke } from "../../backend";
import { settingsStore } from "../../stores/settings";

const IMAGE_EXTENSIONS = new Set([
  "avif", "bmp", "gif", "ico", "jpeg", "jpg", "png", "svg", "tif", "tiff", "webp",
]);

interface ImageItem {
  name: string;
  path: string;
}

export const ImagePicker: Component<{
  onClose: () => void;
  onSelect: (path: string) => void;
}> = (props) => {
  const [query, setQuery] = createSignal("");
  const [attachmentImages, setAttachmentImages] = createSignal<ImageItem[]>([]);
  let searchInput: HTMLInputElement | undefined;

  onMount(async () => {
    searchInput?.focus();
    // The default screenshot/paste attachment folder is hidden (.mindzj/images),
    // so it is intentionally absent from the normal file tree. Ask the backend
    // for that configured folder explicitly and include its images in the picker.
    const folder = settingsStore.settings().attachment_folder || ".mindzj/images";
    try {
      const entries = await invoke<VaultEntry[]>("list_entries", { relativeDir: folder });
      setAttachmentImages(entries
        .filter((entry) => !entry.is_dir && IMAGE_EXTENSIONS.has(entry.extension.toLowerCase()))
        .map((entry) => ({ name: entry.name, path: entry.relative_path })));
    } catch {
      // A not-yet-created attachment folder is normal; visible Vault images
      // remain available from the file tree below.
    }
  });

  const images = createMemo(() => {
    const result: ImageItem[] = [];
    const visit = (entries: VaultEntry[]) => {
      for (const entry of entries) {
        if (entry.is_dir) {
          visit(entry.children ?? []);
        } else if (IMAGE_EXTENSIONS.has(entry.extension.toLowerCase())) {
          result.push({ name: entry.name, path: entry.relative_path });
        }
      }
    };
    visit(vaultStore.fileTree());
    for (const image of attachmentImages()) {
      if (!result.some((item) => item.path === image.path)) result.push(image);
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  });

  const filteredImages = createMemo(() => {
    const search = query().trim().toLocaleLowerCase();
    return search
      ? images().filter((image) => `${image.name} ${image.path}`.toLocaleLowerCase().includes(search))
      : images();
  });

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      props.onClose();
    }
  };
  onMount(() => {
    document.addEventListener("keydown", closeOnEscape, true);
    onCleanup(() => document.removeEventListener("keydown", closeOnEscape, true));
  });

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) props.onClose();
      }}
      style={{
        position: "fixed",
        inset: "0",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        padding: "24px",
        background: "rgba(0,0,0,0.55)",
        "z-index": "12000",
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={t("toolbar.imagePicker")}
        style={{
          width: "min(900px, 100%)",
          height: "min(680px, 100%)",
          display: "flex",
          "flex-direction": "column",
          overflow: "hidden",
          background: "var(--mz-bg-primary)",
          color: "var(--mz-text-primary)",
          border: "1px solid var(--mz-border-strong)",
          "border-radius": "var(--mz-radius-lg)",
          "box-shadow": "0 18px 60px rgba(0,0,0,0.4)",
        }}
      >
        <header style={{ display: "flex", "align-items": "center", gap: "12px", padding: "16px 20px", "border-bottom": "1px solid var(--mz-border)" }}>
          <strong style={{ flex: "1", "font-size": "var(--mz-font-size-lg)" }}>{t("toolbar.imagePicker")}</strong>
          <span style={{ color: "var(--mz-text-muted)", "font-size": "var(--mz-font-size-xs)" }}>{t("toolbar.imageCount", { count: images().length })}</span>
          <button onClick={props.onClose} aria-label={t("common.close")} title={t("common.close")} style={closeButtonStyle}>×</button>
        </header>

        <div style={{ padding: "14px 20px", "border-bottom": "1px solid var(--mz-border)" }}>
          <input
            ref={searchInput}
            type="search"
            value={query()}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder={t("toolbar.searchImages")}
            aria-label={t("toolbar.searchImages")}
            style={{ width: "100%", "box-sizing": "border-box", padding: "10px 12px", color: "var(--mz-text-primary)", background: "var(--mz-bg-secondary)", border: "1px solid var(--mz-border-strong)", "border-radius": "var(--mz-radius-md)", "font-size": "var(--mz-font-size-sm)" }}
          />
        </div>

        <div style={{ flex: "1", overflow: "auto", padding: "16px 20px" }}>
          {filteredImages().length > 0 ? (
            <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
              {filteredImages().map((image) => (
                <button
                  onClick={() => props.onSelect(image.path)}
                  title={`${t("toolbar.insertImage")}: ${image.path}`}
                  style={{ display: "flex", "flex-direction": "column", gap: "8px", "min-width": "0", padding: "8px", color: "var(--mz-text-primary)", background: "var(--mz-bg-secondary)", border: "1px solid var(--mz-border)", "border-radius": "var(--mz-radius-md)", cursor: "pointer", "text-align": "left" }}
                  onMouseEnter={(event) => { event.currentTarget.style.borderColor = "var(--mz-accent)"; }}
                  onMouseLeave={(event) => { event.currentTarget.style.borderColor = "var(--mz-border)"; }}
                >
                  <div style={{ width: "100%", height: "112px", display: "flex", "align-items": "center", "justify-content": "center", overflow: "hidden", background: "var(--mz-bg-primary)", "border-radius": "var(--mz-radius-sm)" }}>
                    <img src={toVaultAssetUrl(vaultStore.vaultInfo()?.path ?? "", image.path)} alt="" loading="lazy" style={{ width: "100%", height: "100%", "object-fit": "contain" }} />
                  </div>
                  <span style={{ width: "100%", overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", "font-size": "var(--mz-font-size-sm)" }}>{image.name}</span>
                  <span style={{ width: "100%", overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap", color: "var(--mz-text-muted)", "font-size": "var(--mz-font-size-xs)" }}>{image.path}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: "56px 16px", color: "var(--mz-text-muted)", "text-align": "center" }}>
              {images().length === 0 ? t("toolbar.noImages") : t("toolbar.noImageMatches")}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const closeButtonStyle = {
  width: "30px", height: "30px", padding: "0", color: "var(--mz-text-muted)",
  background: "transparent", border: "none", "border-radius": "var(--mz-radius-sm)",
  cursor: "pointer", "font-size": "24px", "line-height": "1",
} as const;
