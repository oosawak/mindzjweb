import { editLockStore } from "../stores/editLock";
import { editorStore, type ViewMode } from "../stores/editor";
import { confirmDialog } from "../components/common/ConfirmDialog";
import { t } from "../i18n";
import { isCollaborativeWebNote } from "./collaboration";

export async function saveDraftBeforeLeaving(path: string): Promise<boolean> {
  if (!editorStore.isDirtyPath(path)) return true;
  const save = await confirmDialog(t("editLock.unsavedChanges"), {
    confirmLabel: t("editLock.saveChanges"),
    cancelLabel: t("editLock.stayEditing"),
    variant: "primary",
  });
  if (!save) return false;
  try {
    await editorStore.savePendingManually(path);
    return true;
  } catch (error) {
    console.error("Could not save before leaving edit mode:", error);
    return false;
  }
}

export async function requestViewModeChange(path: string, mode: ViewMode): Promise<boolean> {
  const current = editorStore.getViewModeForFile(path);
  if (current === mode) return true;

  if (mode !== "reading" && current === "reading") {
    try {
      if (!isCollaborativeWebNote(path) && !(await editLockStore.acquire(path))) return false;
    } catch (error) {
      console.error("Could not acquire edit lock:", error);
      return false;
    }
  }

  if (mode === "reading" && current !== "reading") {
    if (!(await saveDraftBeforeLeaving(path))) return false;
    if (!isCollaborativeWebNote(path)) await editLockStore.release(path);
  }

  editorStore.setViewMode(mode, path);
  return true;
}
