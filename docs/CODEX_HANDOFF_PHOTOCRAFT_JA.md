# Codex 引継ぎ: 画像を PhotoCraft に自動読み込み

更新日: 2026-10-06

## やりたいこと

ノートまたはファイル一覧でVault内の画像を選び、PhotoCraftを開いたときに、その画像を自動で読み込ませる。PhotoCraft本体はVault内のファイルではなくMindZJ共通のアプリ資材として配置する。

対象となる想定操作は、ノート内のローカル画像を右クリックし、コンテキストメニューの「PhotoCraftで編集」を選ぶこと。

## 現在の実装

未コミットの作業ツリーに以下の変更がある。

- `src/components/editor/extensions/livePreview.ts`
  - ローカル画像のコンテキストメニューに「PhotoCraftで編集」を追加。
  - MindZJ共通のPhotoCraft URLを開き、選んだVault画像のURLを渡す。
- `src/components/sidebar/FileTree.tsx`
  - ファイル一覧の画像コンテキストメニューにも「PhotoCraftで編集」を追加。
- `src/utils/photoCraft.ts`
  - `BASE_URL` に対応した共通PhotoCraft起動URLを生成し、Vault画像URLを渡す。Pages Demoのブラウザー内ローカル画像はBroadcastChannelでBlobを渡す。
- `public/photocraft/`
  - PhotoCraftのWebアプリとライセンスをMindZJ共通資材として配置。Vaultを問わず起動できる。
- `public/photocraft/mindzj-loader.js`
  - 画像を取得し、PhotoCraftのWeb runner起動完了後にCanvasへドロップする。
- `src/components/common/FilePreview.tsx`
  - 旧Vault内PhotoCraft HTMLを開くURL形式との互換用。
- `src-tauri/src/server.rs`
  - JS/MJS/WASM/CSS/JSONのContent-Typeを追加。
  - HTMLをsandbox iframeから読み込む際、JS/MJS/WASMにCORSヘッダーを付与。
  - 旧Vault内PhotoCraft起動URLの互換ブリッジも保持。
- `src/i18n/index.ts`
  - 「PhotoCraftで編集」の翻訳を追加。

PhotoCraftはViteの `public` から配信され、ビルド時にTauriの `dist` とPages Demoにもコピーされる。

## 動作確認状況

- `cargo check -p mindzj --bin mindzj-server`: 成功。
- `npm run typecheck`: 成功。
- `git diff --check`: 成功。
- 実ブラウザーでPhotoCraftが画像を受け取るところは未確認。したがって、機能完成の判断前に次の手動確認が必要。
- 共通PhotoCraftを使う新しいメニューは `public/photocraft` へ直接遷移する。Viteの開発サーバーは `public` の変更を反映する。配布版ではビルドし直す必要がある。

## 再開時の確認手順

1. `git status --short` と `git diff` を確認する。下記の未追跡ファイルは今回のPhotoCraft変更と関係ない可能性があるので、内容を確認せずに追加・削除しない。
   - `mindzjweb.md`
   - `src-tauri/gen/schemas/linux-schema.json`
   - `tauri.sh`
   - `test/`
2. 開発サーバーを起動する。ユーザーの構成では画面がHTTPSの `:3000`、APIが `:1430` とされている。既に起動中ならポート設定を変更せず、その構成を維持する。
3. Vault内のノートを開き、ローカル画像を右クリックして「PhotoCraftで編集」を選ぶ。
4. 新しいタブでPhotoCraftが開き、画像が編集画面に読み込まれることを確認する。
5. 失敗時はPhotoCraftのコンソール、`mindzj_image_url`、画像取得URLのステータスを確認する。

## 注意点・次の作業

- 画像読込はPhotoCraftのCanvasへブラウザー合成のdrag/dropイベントを送る方式。PhotoCraftのWeb側コードはドロップファイルを非同期で読み、受信Inboxへ渡す実装。実ブラウザーでの動作確認は引き続き必要。
- PhotoCraft本体をVaultごとにコピーする必要はない。新しい起動メニューはMindZJ共通の `public/photocraft` を利用する。
- PhotoCraftの編集結果を元のVault画像へ保存し直す機能は今回の範囲に含まれていない。今回の要望は「選んだ画像を自動で読み込ませる」まで。
- HTMLプレビューのMIME/CORS修正も同じRust差分に含まれている。PhotoCraftだけでなく、既存のHTMLゲームや他のHTMLリソース表示も回帰確認する。
- 作業は未コミット。今回の変更だけを選んで扱い、無関係な作業ツリーのファイルを巻き込まない。

## ユーザーが報告した元のエラー

PhotoCraftのHTMLをVault内で表示したときに、JS/WASMへのCORSエラー、`read_file` の400、`get_hotkeys` / `list_plugins` の未対応コマンド404が報告された。今回のCORS/MIME修正はJS/WASMの読み込みに対するもの。コマンド404は別のWeb対応範囲であり、この引継ぎ差分で修正したものではない。
