# PhotoCraft web bundle in MindZJ

This folder contains a prebuilt PhotoCraft WebAssembly application from
[storytold/photocraft](https://github.com/storytold/photocraft), based on upstream
revision `a96a621deea97d4b1ecd173b8b921587e33f3ca5` (PhotoCraft 0.2.0).

The upstream browser shell was modified to support MindZJ's Vault workflow:

- MindZJ sends the selected Vault image to PhotoCraft and opens the editor in the main pane,
  leaving MindZJ's file list visible.
- PhotoCraft keeps the selected image's Vault-relative path. Saving with the original name writes
  the result back to that path; saving under a different name downloads a copy through the browser.
- MindZJ supplies the bridge between PhotoCraft and the active Vault backend.

These changes are separate from MindZJ's own code and are distributed under PhotoCraft's upstream
MIT or Apache-2.0 license. See `LICENSE-MIT`, `LICENSE-APACHE`, `NOTICE`, and `ATTRIBUTION.md`.
MindZJ's repository license does not replace these notices or relicense the PhotoCraft bundle.

PhotoCraft source and project: <https://github.com/storytold/photocraft>.
