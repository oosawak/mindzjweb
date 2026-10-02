<h1 align="center">MindZJWeb</h1>

<p align="center">
  MindZJのMarkdown Vaultを、ブラウザから利用・編集するためのWeb版です。
</p>

MindZJWebは既存のSolidJS UIとMindZJのRustカーネルをWebサーバー上で動かします。
Vaultはサーバー上の通常のファイルとして保存され、Markdown、画像、PDF、音声、動画、
スプレッドシートなどを同じVault内で管理できます。

## 主な機能

- ブラウザからMarkdownを編集
- Live Preview、Source、Readingの表示モード
- Wikiリンク、検索、アウトライン、カレンダー
- 画像、PDF、音声、動画、Officeファイルなどのリソース追加
- `.xlsx`、`.xls`、`.ods`、`.csv`などのVault保存
- 複数デバイスから同じサーバー上のVaultへアクセス
- GitHub Pages向けのブラウザデモ

## GitHub Pagesデモ

<https://oosawak.github.io/mindzjweb/web/>

Pages版はRustサーバーを必要としません。編集内容はブラウザのローカルストレージに
保存され、公開Vaultのファイルは変更されません。

## 開発環境で起動

### 1. 依存関係をインストール

```bash
npm install
```

### 2. Web UIを起動

```bash
npm run dev -- --host 0.0.0.0
```

開発用HTTPSで次のURLにアクセスします。

- ローカル: <https://localhost:1430/>
- 同一ネットワーク: `https://SERVER_IP:1430/`

自己署名証明書の警告が表示された場合は、開発環境として証明書を許可してください。
画面共有など一部のブラウザAPIはHTTPSまたはlocalhostでのみ利用できます。

### 3. Rust APIサーバーを起動

別ターミナルで実行します。

```bash
MINDZJ_BIND=0.0.0.0 \
MINDZJ_PORT=3000 \
MINDZJ_VAULT=/absolute/path/to/Vaults/test \
cargo run -p mindzj --bin mindzj-server
```

`MINDZJ_VAULT` を指定しない場合は、Web画面からサーバー上のVaultを選択できます。

## 本番ビルド

```bash
npm install
npm run build:web
```

本番環境ではRustのreleaseバイナリをsystemdなどで常時起動し、Nginxなどのリバース
プロキシでHTTPSと認証を設定してください。

詳細は次の資料を参照してください。

- [Ubuntu / systemd / Nginxでのデプロイ手順](docs/mindzjweb/WEB_SERVER_DEPLOYMENT_JA.md)
- [Google Group対応MindZJの企業利用検討資料](docs/mindzjweb/MINDZJ_GOOGLE_GROUP_BUSINESS_PROPOSAL_JA.md)
- [MindZJWebの詳細仕様](docs/mindzjweb.md)

## セキュリティ上の注意

MindZJWebサーバーは、構成によっては認証なしでVaultを読み書きできます。公開インター
ネットへ直接公開せず、信頼できるネットワーク内で使用してください。本番環境では
HTTPS、Basic認証またはGoogle OAuth、ファイアウォール、バックアップを設定してください。

## 関連README

デスクトップ版MindZJの説明は [MindZJ-README.md](MindZJ-README.md) を参照してください。

## ライセンス

AGPL-3.0-or-later
