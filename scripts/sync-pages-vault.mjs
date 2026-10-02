import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repoRoot, "Vaults");
const outputRoot = path.join(repoRoot, "docs", "web", "docs");

async function collectFiles(directory, relative = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    // Vault internals contain settings, plugins, snapshots and local state.
    // Only visible project notes and their resources are part of the Pages copy.
    if (entry.name.startsWith(".")) continue;
    const source = path.join(directory, entry.name);
    const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await collectFiles(source, childRelative));
    else if (entry.isFile()) files.push({ source, relative: childRelative });
  }
  return files;
}

await stat(sourceRoot);
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
const files = await collectFiles(sourceRoot);
const notes = [];
for (const file of files) {
  const target = path.join(outputRoot, ...file.relative.split("/"));
  await mkdir(path.dirname(target), { recursive: true });
  await cp(file.source, target);
  if (/\.(md|html?)$/i.test(file.relative)) {
    const text = (await readFile(file.source, "utf8"))
      .replace(/[\t ]+$/gm, "")
      .replace(/\n+$/, "");
    await writeFile(target, `${text}\n`);
  }
  if (/\.md$/i.test(file.relative)) {
    const text = await readFile(file.source, "utf8");
    const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim()
      || path.basename(file.relative, path.extname(file.relative));
    notes.push({ path: file.relative, title });
  }
}
notes.sort((a, b) => a.path.localeCompare(b.path, "ja"));
await writeFile(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify({ notes, files: files.map((file) => file.relative).sort((a, b) => a.localeCompare(b, "ja")) }, null, 2)}\n`,
);
console.log(`Synced ${files.length} Vault files (${notes.length} Markdown notes) to docs/web/docs.`);
