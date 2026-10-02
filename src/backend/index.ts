import { invoke as tauriInvoke } from "@tauri-apps/api/core";

/** Backend boundary shared by the Tauri desktop app and browser builds. */
export interface MindZjBackend {
  invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
}

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

class TauriBackend implements MindZjBackend {
  invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
    return tauriInvoke<T>(command, args);
  }
}

class WebBackend implements MindZjBackend {
  async invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
    if (command === "list_web_vaults") {
      const root = typeof args?.root === "string" ? args.root : "Vaults";
      const response = await fetch(`/api/vaults?root=${encodeURIComponent(root)}`);
      if (!response.ok) throw new Error(`Backend request failed (${response.status})`);
      return response.json() as Promise<T>;
    }
    const response = await fetch(`/api/commands/${encodeURIComponent(command)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args ?? {}),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null) as
        | { message?: string; error?: string }
        | null;
      throw new Error(payload?.message ?? payload?.error ?? `Backend request failed (${response.status})`);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}

const backend: MindZjBackend = isTauriRuntime()
  ? new TauriBackend()
  : new WebBackend();

/** Drop-in invoke function; keeps store and component call sites backend-neutral. */
export const invoke = <T>(command: string, args?: Record<string, unknown>): Promise<T> =>
  backend.invoke<T>(command, args);

export function getBackendKind(): "tauri" | "web" {
  return isTauriRuntime() ? "tauri" : "web";
}
