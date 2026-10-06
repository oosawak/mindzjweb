const clientIdKey = "mindzj-web-client-id-v1";
const tokenPrefix = "mindzj-web-edit-lock-v1:";

export function getBrowserClientId(): string {
  let id = localStorage.getItem(clientIdKey);
  if (!id) {
    id = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(clientIdKey, id);
  }
  return id;
}

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\/+/, "");
}

export function editLockStorageKey(path: string): string {
  return `${tokenPrefix}${encodeURIComponent(normalizePath(path))}`;
}

export function getEditLockToken(path: string): string | null {
  return localStorage.getItem(editLockStorageKey(path));
}

export function setEditLockToken(path: string, token: string | null): void {
  const key = editLockStorageKey(path);
  if (token) localStorage.setItem(key, token);
  else localStorage.removeItem(key);
}
