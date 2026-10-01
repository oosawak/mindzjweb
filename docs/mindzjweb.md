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

## Run

Start with a vault that already exists on the server:

```bash
MINDZJ_BIND=0.0.0.0 \
MINDZJ_PORT=3000 \
MINDZJ_VAULT=../mindzjweb \
cargo run -p mindzj --bin mindzj-server
```

When run from `/home/oosawak/Workspace/mindzj`, `../mindzjweb` resolves to
`/home/oosawak/Workspace/mindzjweb`.

Then open `http://SERVER_IP:3000/` in a browser on the same network. If
`MINDZJ_VAULT` is not set, select or enter a server-side vault path on the
welcome screen.

The default bind address is `127.0.0.1`; set `MINDZJ_BIND=0.0.0.0` to allow
connections from other devices. `MINDZJ_PORT` defaults to `3000`.

## Security

The web server currently has no login or authentication. It can open and
modify any vault path that the server process can access. Keep it on a trusted
private network and do not expose it directly to the public internet. The
kernel validates vault-relative paths and rejects traversal and symlink escapes.
