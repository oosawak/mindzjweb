import { getBackendKind, isPagesDemo } from "../backend";

export function isCollaborativeWebNote(path: string | null | undefined): boolean {
  return getBackendKind() === "web" && !isPagesDemo() && /\.(md|markdown|mdx)$/i.test(path ?? "");
}
