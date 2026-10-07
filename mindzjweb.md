# MindZJ Ubuntu Server版 引継ぎ資料

## 1. 対象プロジェクト

元リポジトリ：

https://github.com/zjok/mindzj.git

プロジェクト名：

MindZJ

ライセンス：

AGPL-3.0-or-later

現在のMindZJは、Tauri 2.0 + Rust + SolidJS + TypeScript + Viteで作られたローカルファーストのノートアプリ。

主な構成：

```text
mindzj/
├── src-tauri/
│   └── src/
│       ├── kernel/
│       └── api/
├── src/
│   ├── components/
│   ├── stores/
│   └── plugin-api/
├── cli/
├── docs/
└── package.json
```

フロントエンド：

- SolidJS
- TypeScript
- Vite
- CodeMirror 6
- UnoCSS
- Mermaid
- KaTeX

バックエンド：

- Rust
- Tauri 2
- Tantivy検索
- ローカルファイルシステム
- AI連携
- CLI

---

# 2. 今回の目的

MindZJをUbuntu Server上で動作するWebアプリとして利用できるようにする。

Tauriデスクトップ版は可能な限り壊さず維持する。

最終的には以下の構成を目指す。

```text
PC / Smartphone / Tablet
          ↓
       Browser
          ↓
     MindZJ Web UI
          ↓
    HTTP / WebSocket
          ↓
   Rust Web Server
          ↓
     MindZJ Kernel
          ↓
 Markdown Vault / Search / AI
```

例：

```text
http://ubuntu-server:3000/
```

LAN内のPCやスマートフォンからブラウザでアクセスできるようにする。

---

# 3. 基本方針

現在のMindZJではフロントエンドからTauriの

```ts
invoke(...)
```

を多数使用している。

例：

```ts
invoke("read_file")
invoke("write_file")
invoke("create_dir")
invoke("delete_file")
invoke("rename_file")
invoke("search_vault")
invoke("get_backlinks")
invoke("save_workspace")
invoke("update_settings")
```

現状は、

```text
SolidJS
 ↓
Tauri invoke()
 ↓
Rust
```

となっている。

これを直接全部HTTPに書き換えるのではなく、バックエンドアクセスを抽象化する。

目標：

```text
SolidJS UI
    ↓
Backend Adapter
    ├─ TauriAdapter
    │    ↓
    │  invoke()
    │
    └─ WebAdapter
         ↓
       HTTP API
```

UIやストアからは可能な限り同じAPIを使用する。

例：

```ts
backend.readFile(path)
backend.writeFile(path, content)
backend.search(query)
```

Tauri版：

```ts
backend = new TauriBackend()
```

Web版：

```ts
backend = new WebBackend()
```

この設計を優先する。

---

# 4. 最重要事項

既存Tauri版を壊さないこと。

以下を維持する。

- デスクトップTauri版
- Rust Kernel
- Markdown Vault
- Wiki Link
- Backlink
- File Tree
- CodeMirror
- Live Preview
- Markdown
- Mermaid
- KaTeX
- Tabs
- Split View
- Settings
- Plugin機能
- Search
- AI機能
- CLI

Ubuntu Server版を追加する形にする。

---

# 5. Ubuntu Server版で優先する機能

第一段階では以下を実装する。

## 必須

- Web UIをブラウザで表示
- Vault選択またはVaultパス指定
- ファイル一覧
- Markdownファイル読込
- Markdown編集
- Markdown保存
- 新規ファイル作成
- ファイル削除
- フォルダ作成
- ファイル名変更
- Wiki Link
- Backlink
- 全文検索
- 設定保存
- Workspace保存

---

# 6. Rust Web Server

Rust側にHTTPサーバーを追加する。

候補：

- Axum推奨
- Tokio
- tower-http

可能なら既存のKernelをそのまま利用する。

例えば新規に：

```text
server/
```

または

```text
src-server/
```

を作成してもよい。

ただしRust Kernelの重複実装は避ける。

理想：

```text
Rust Kernel
   ↑      ↑
Tauri   Web Server
```

---

# 7. HTTP API案

最低限以下を用意する。

```text
GET    /api/health

GET    /api/files
GET    /api/file
POST   /api/file
DELETE /api/file

POST   /api/file/create
POST   /api/file/rename

POST   /api/dir/create
DELETE /api/dir

POST   /api/search

GET    /api/backlinks

GET    /api/settings
POST   /api/settings

GET    /api/workspace
POST   /api/workspace
```

必要に応じてJSON bodyを使用する。

例：

```json
{
  "relativePath": "notes/test.md"
}
```

ファイル保存：

```json
{
  "relativePath": "notes/test.md",
  "content": "# Hello"
}
```

---

# 8. API設計上の注意

Vault外へのアクセスを絶対に許可しない。

現在のMindZJにあるPath Traversal防止を維持すること。

以下を拒否する。

```text
../
../../
absolute path
symbolic link escape
```

Rust側でVault Rootに対する安全なパス解決を行う。

---

# 9. Vault

Ubuntu ServerではVaultを実フォルダとして扱う。

例：

```text
/var/lib/mindzj/vault
```

またはユーザー指定：

```text
/home/<user>/mindzj-vault
```

Markdownは普通の`.md`ファイルとして保存する。

MindZJ固有データ：

```text
.mindzj/
```

も既存形式を可能な限り維持する。

---

# 10. フロントエンド

現在のSolidJS UIをできる限りそのまま使用する。

Web版ではTauri依存コードを直接呼ばない。

以下のようなBackend interfaceを作る。

例：

```ts
export interface MindZjBackend {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  createFile(path: string, content?: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  createDir(path: string): Promise<void>;
  deleteDir(path: string): Promise<void>;
  renameFile(from: string, to: string): Promise<void>;
  searchVault(query: string): Promise<SearchResult[]>;
  getBacklinks(path: string): Promise<Backlink[]>;
}
```

---

# 11. Tauri判定

ブラウザ版とTauri版を自動判定できるようにする。

例：

```ts
const isTauri =
  typeof window !== "undefined" &&
  "__TAURI_INTERNALS__" in window;
```

またはビルド時環境変数でもよい。

例：

```text
VITE_MINDZJ_BACKEND=tauri
VITE_MINDZJ_BACKEND=web
```

できれば両方対応する。

---

# 12. Vite

Ubuntu ServerではVite buildした静的ファイルをRustサーバー側から配信してよい。

構成例：

```text
dist/
 ↓
Axum static files
```

つまり最終的には単一Rustプロセスで、

```text
/
```

Web UI、

```text
/api/
```

Rust API

を提供できる構成が望ましい。

---

# 13. 開発時

開発中は、

```bash
npm run dev
```

でVite、

```bash
cargo run
```

でRust API

を動かしてよい。

Vite側にproxy設定を追加する。

例：

```ts
server: {
  proxy: {
    "/api": "http://localhost:3000"
  }
}
```

本番ではRustから`dist`を配信する。

---

# 14. 検索

現在のMindZJはRust側でTantivyを使用している。

これはUbuntu Server版でもできればそのまま使用する。

ブラウザ側に検索処理を移す必要はない。

構成：

```text
Browser
 ↓
POST /api/search
 ↓
Rust
 ↓
Tantivy
```

この構成を優先する。

---

# 15. AI

現在のMindZJは以下を想定している。

- Ollama
- Claude
- OpenAI

Ubuntu Server版では特にOllamaと相性が良い。

理想：

```text
Browser
 ↓
MindZJ Server
 ↓
Ollama
```

例：

```text
http://localhost:11434
```

ただし第一段階ではAI対応は後回しでもよい。

まず基本的なVault操作を完成させる。

---

# 16. CLI

既存CLIはできる限り維持する。

WebサーバーとCLIが同じRust Kernelを共有する。

目標：

```text
        Rust Kernel
       /     |      \
    Tauri   CLI   Web Server
```

---

# 17. セキュリティ

第一段階はLAN内利用を想定する。

ただしAPIを無認証でインターネット公開しないこと。

最低限：

- デフォルトbindは127.0.0.1またはLAN向け設定
- Vault外アクセス禁止
- Path Traversal防止
- API入力値検証
- 任意コマンド実行禁止

外部公開は後で検討。

候補：

- Tailscale
- Cloudflare Tunnel
- Reverse Proxy
- HTTPS
- Login/Auth

---

# 18. Ubuntu Server運用

最終的にはsystemd対応したい。

例：

```text
/etc/systemd/system/mindzj.service
```

実行：

```bash
sudo systemctl enable mindzj
sudo systemctl start mindzj
```

設定ファイル例：

```text
/etc/mindzj/config.toml
```

または：

```text
~/.config/mindzj/
```

---

# 19. 設定案

例：

```toml
bind = "0.0.0.0"
port = 3000
vault = "/home/user/mindzj-vault"
```

環境変数にも対応すると良い。

例：

```bash
MINDZJ_BIND=0.0.0.0
MINDZJ_PORT=3000
MINDZJ_VAULT=/home/user/mindzj-vault
```

---

# 20. GitHub Pages対応について

将来的にGitHub Pages版も作れるよう、フロントエンドとBackend Adapterを分離しておく。

最終的には：

```text
MindZJ UI
   ↓
Backend Adapter
   ├─ Tauri
   ├─ Ubuntu Server
   └─ Browser Local Storage / IndexedDB
```

まで拡張可能な設計が望ましい。

ただし今回の最優先はUbuntu Server版。

---

# 21. 作業優先順位

以下の順で進める。

## Phase 1

バックエンド抽象化。

- Tauri invoke直呼びを整理
- Backend interface作成
- TauriBackend作成
- 既存Tauri版が動くことを確認

## Phase 2

Rust Web Server追加。

- Axum導入
- health API
- read/write
- create/delete/rename
- file tree
- settings
- workspace

## Phase 3

WebBackend追加。

SolidJSからHTTP APIへアクセス。

## Phase 4

Web UIをUbuntu Server上で表示。

ブラウザから：

- ファイル作成
- 編集
- 保存
- 削除
- フォルダ操作

ができることを確認。

## Phase 5

検索・Backlink。

Tantivyと既存Kernelを利用。

## Phase 6

AI対応。

Ollama優先。

## Phase 7

systemd化。

---

# 22. 重要な禁止事項

以下は避ける。

- Tauri版を削除しない
- Rust KernelをWeb用にコピーして二重実装しない
- UIを全面的に書き直さない
- Markdown形式を独自DB形式だけに変更しない
- SQLite必須構成にしない
- Vault外を操作できるAPIを作らない
- GitHub Pages専用構成にしない

---

# 23. まず確認してほしいこと

作業開始時に以下を確認する。

```bash
git status
git branch
git log --oneline -10
node --version
npm --version
rustc --version
cargo --version
```

その後：

```bash
npm install
npm run typecheck
npm run build
cargo check
```

可能なら現行Tauri版のビルド状態も確認する。

---

# 24. 最初の実装目標

最初の完成条件は非常にシンプルでよい。

Ubuntu Serverで：

```bash
cargo run
```

または：

```bash
./mindzj-server
```

を実行。

別PCのブラウザから：

```text
http://SERVER_IP:3000/
```

へアクセス。

以下ができれば第一段階成功。

1. MindZJ UIが表示される
2. Vaultのファイル一覧が見える
3. Markdownを開ける
4. 編集できる
5. 保存できる
6. 新規Markdownを作れる

この時点で一度コミットする。

---

# 25. コミット方針

大きな変更を1コミットにまとめない。

例：

```text
feat: add backend abstraction
feat: add tauri backend adapter
feat: add axum web server
feat: add web backend adapter
feat: serve frontend from rust server
feat: add web vault operations
```

各段階で既存Tauri版が壊れていないことを確認する。

---

# 26. 最終目標

最終的に以下の3形態を同じプロジェクトから提供できる状態を目指す。

```text
1. Desktop
   Tauri + Rust

2. Ubuntu Server
   Rust Web Server + SolidJS

3. Browser
   Ubuntu ServerへHTTP接続
```

将来的にはさらに：

```text
4. GitHub Pages
   Browser Local Storage / IndexedDB
```

も追加可能な設計にする。

最優先はUbuntu Server版。

既存機能を壊さず、Rust Kernelを共有する構成で実装を進めてください。