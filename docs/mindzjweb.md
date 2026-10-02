# MindZJWeb

オフラインノートをWebでつかえるようにしました。

MindZJWeb serves the existing SolidJS interface and uses the MindZJ Rust
kernel to access a Markdown vault on the server. Vault files remain ordinary
files on disk.

## Build

From the repository root, build the web UI and server binary:

```bash
npm install
npm run build:web
```

For a production Ubuntu deployment with HTTPS, Basic authentication, systemd,
and GitHub clone/update steps, see [WEB_SERVER_DEPLOYMENT_JA.md](WEB_SERVER_DEPLOYMENT_JA.md).

## GitHub Pages Vault viewer

`docs/web/` is a static, read-only viewer that works without the Rust server.
Browser-only sample notes are stored in that browser's local storage and do not
change the published Vault. Before publishing Vault updates, run
`npm run sync:pages-vault`; this copies visible Vault files and resources to
`docs/web/docs/` and refreshes its note manifest. Hidden `.mindzj` app data,
settings, and snapshots are excluded. Pushing changes to `main` deploys the
viewer and copied Vault through the Pages workflow.

## Run

Start the server from the repository root:

```bash
MINDZJ_BIND=0.0.0.0 \
MINDZJ_PORT=3000 \
cargo run -p mindzj --bin mindzj-server
```

The welcome screen lists subfolders of `Vaults` under the server's working
directory. With the server started from `/home/oosawak/Workspace/mindzj`, the
standard parent folder is `/home/oosawak/Workspace/mindzj/Vaults`. Use
**Select Vaults Server** to enter a different server-side parent folder. New
Vaults are created under the currently selected parent folder.

Then open `http://SERVER_IP:3000/` in a browser on the same network. To open a
Vault outside `Vaults`, enter its server-side path on the welcome screen.

The default bind address is `127.0.0.1`; set `MINDZJ_BIND=0.0.0.0` to allow
connections from other devices. `MINDZJ_PORT` defaults to `3000`.

## Security

The web server currently has no login or authentication. It can open and
modify any vault path that the server process can access. Keep it on a trusted
private network and do not expose it directly to the public internet. The
kernel validates vault-relative paths and rejects traversal and symlink escapes.
