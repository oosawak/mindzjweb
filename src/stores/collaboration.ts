import { createSignal } from "solid-js";

export interface CollaborationStatus {
  connection: "idle" | "connecting" | "connected" | "disconnected" | "error";
  participants: number;
  input: "idle" | "editing" | "updated";
  save: "idle" | "pending" | "saved" | "error";
}

const [statuses, setStatuses] = createSignal<Record<string, CollaborationStatus>>({});

export const collaborationStore = {
  status(path: string): CollaborationStatus {
    return statuses()[path] ?? {
      connection: "idle",
      participants: 0,
      input: "idle",
      save: "idle",
    };
  },
  update(path: string, patch: Partial<CollaborationStatus>) {
    setStatuses((previous) => {
      const current = previous[path] ?? {
        connection: "idle" as const,
        participants: 0,
        input: "idle" as const,
        save: "idle" as const,
      };
      return { ...previous, [path]: { ...current, ...patch } };
    });
  },
  clear(path: string) {
    setStatuses((previous) => {
      const next = { ...previous };
      delete next[path];
      return next;
    });
  },
};
