import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultRoot = path.join(repoRoot, "docs", "web", "Vaults");
const manifestPath = path.join(vaultRoot, "manifest.json");

async function collectFiles(directory, relative = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const source = path.join(directory, entry.name);
    const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...await collectFiles(source, childRelative));
    } else if (entry.isFile() && childRelative !== "manifest.json") {
      files.push({ source, relative: childRelative });
    }
  }
  return files;
}

const files = await collectFiles(vaultRoot);
const notes = [];
for (const file of files) {
  if (!/\.md$/i.test(file.relative)) continue;
  const content = await readFile(file.source, "utf8");
  const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
    || path.basename(file.relative, path.extname(file.relative));
  notes.push({ path: file.relative, title });
}

notes.sort((a, b) => a.path.localeCompare(b.path, "ja"));
files.sort((a, b) => a.relative.localeCompare(b.relative, "ja"));
await writeFile(
  manifestPath,
  `${JSON.stringify({ notes, files: files.map((file) => file.relative) }, null, 2)}\n`,
);
console.log(`Indexed ${files.length} Vault files (${notes.length} Markdown notes) for Pages.`);
