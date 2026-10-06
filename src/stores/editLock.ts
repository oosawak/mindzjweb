import { createSignal } from "solid-js";
import { getBackendKind, invoke, isPagesDemo } from "../backend";
import {
  getBrowserClientId,
  setEditLockToken,
} from "../backend/clientIdentity";
import { confirmDialog } from "../components/common/ConfirmDialog";
import { t } from "../i18n";

interface LockReply {
  acquired: boolean;
  ownerName?: string;
  token?: string;
  expiresInSeconds?: number;
}

const [ownedTokens, setOwnedTokens] = createSignal<Record<string, string>>({});
let heartbeatTimer: ReturnType<typeof setInterval> | undefined;

function remember(path: string, token: string | null) {
  setOwnedTokens((previous) => {
    const next = { ...previous };
    if (token) next[path] = token;
    else delete next[path];
    return next;
  });
  setEditLockToken(path, token);
}

function ensureHeartbeat() {
  if (heartbeatTimer || typeof window === "undefined") return;
  heartbeatTimer = setInterval(() => {
    for (const [path, token] of Object.entries(ownedTokens())) {
      void invoke<LockReply>("renew_edit_lock", { relativePath: path, token })
        .then((reply) => {
          if (!reply.acquired) {
            remember(path, null);
            document.dispatchEvent(new CustomEvent("mindzj:edit-lock-lost", { detail: { path } }));
            void confirmDialog(t("editLock.lost"), {
              confirmLabel: t("common.confirm"),
              variant: "danger",
            });
          }
        })
        .catch(() => {
          // The lease expires on the server if this browser remains disconnected.
          // Keep the local token until the next heartbeat can confirm ownership.
        });
    }
  }, 15_000);
}

async function acquire(path: string, force = false): Promise<LockReply> {
  return invoke<LockReply>("acquire_edit_lock", {
    relativePath: path,
    ownerName: `MindZJ ${getBrowserClientId().slice(0, 6)}`,
    force,
  });
}

async function confirmTakeover(path: string, ownerName: string): Promise<boolean> {
  let reply = await acquire(path);
  if (reply.acquired) {
    if (reply.token) remember(path, reply.token);
    ensureHeartbeat();
    return true;
  }

  const owner = reply.ownerName || ownerName;
  for (let check = 1; check <= 3; check += 1) {
    const retry = await confirmDialog(
      t("editLock.held", { owner }),
      {
        confirmLabel: t("editLock.checkAgain", { count: check }),
        cancelLabel: t("editLock.keepReading"),
        variant: "primary",
      },
    );
    if (!retry) return false;
    reply = await acquire(path);
    if (reply.acquired) {
      if (reply.token) remember(path, reply.token);
      ensureHeartbeat();
      return true;
    }
  }

  const take = await confirmDialog(
    t("editLock.takeoverWarning", { owner: reply.ownerName || owner }),
    {
      confirmLabel: t("editLock.takeover"),
      cancelLabel: t("editLock.keepReading"),
    },
  );
  if (!take) return false;
  reply = await acquire(path, true);
  if (!reply.acquired || !reply.token) return false;
  remember(path, reply.token);
  ensureHeartbeat();
  return true;
}

export const editLockStore = {
  token(path: string): string | null {
    return ownedTokens()[path] ?? null;
  },
  owns(path: string): boolean {
    return getBackendKind() === "tauri" || isPagesDemo() || !!ownedTokens()[path];
  },
  async acquire(path: string): Promise<boolean> {
    if (getBackendKind() === "tauri" || isPagesDemo()) return true;
    return confirmTakeover(path, "別のユーザー");
  },
  async release(path: string): Promise<void> {
    const token = ownedTokens()[path];
    if (!token) return;
    remember(path, null);
    try {
      await invoke("release_edit_lock", { relativePath: path, token });
    } catch (error) {
      console.warn("Failed to release edit lock:", error);
    }
  },
  async releaseAll(): Promise<void> {
    await Promise.all(Object.keys(ownedTokens()).map((path) => this.release(path)));
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    if (getBackendKind() !== "web" || isPagesDemo()) return;
    for (const [relativePath, token] of Object.entries(ownedTokens())) {
      void fetch("/api/commands/release_edit_lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relativePath, token, clientId: getBrowserClientId() }),
        keepalive: true,
      });
    }
  });
}
