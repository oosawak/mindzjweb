# PrintCraft連携

MindZJのPDF編集画面は [PrintCraft](https://github.com/storytold/printcraft) v0.2.1 を基にしています。取得元コミットは `55c581760ab389b88f08997ab235eecdf1a1b002` です。

## MindZJで加えた変更

- Vaultで選択したPDFを、左のファイル一覧を残したまま中央ペインで開く。
- PrintCraftの保存操作から `BroadcastChannel` でPDFデータをMindZJへ返し、同じVaultパスへ保存する。
- 保存名を変えた場合はブラウザーのダウンロードを使う。
- ArtCraftのロゴとブランド名を変更版のWeb UIから除外する。

上流との差分は [`printcraft-mindzj.patch`](printcraft-mindzj.patch) にあります。再ビルドは、上記コミットのPrintCraftソースへこのパッチを適用し、`apps/printcraft-web` で `trunk build --release` を実行してください。成果物は `dist/web` から `public/printcraft` と `docs/web/printcraft` へ配置します。

## ライセンスと帰属表示

PrintCraftはMITまたはApache-2.0を選択できるデュアルライセンスです。Web配布物には上流の `LICENSE-MIT`、`LICENSE-APACHE`、`NOTICE`、`ATTRIBUTION.md` を含めています。各素材に個別ライセンスがある場合は、`ATTRIBUTION.md` を参照してください。

MindZJはAGPL-3.0-or-laterです。PrintCraftのライセンス文書と帰属表示は、MindZJ本体のライセンスとは別に保ちます。ArtCraftのブランド素材は含めません。

日本語UI用フォントには [craft-fonts](https://github.com/storytold/craft-fonts) の BIZ UDPGothic Regular を同梱しています。フォントのOFL 1.1と帰属情報もWeb配布物に含めました。ビルド時は `CRAFT_FONTS_DIR=/path/to/craft-fonts CRAFT_FONTS_REQUIRED=1 trunk build --release` を使います。

上流PrintCraftコード・更新情報: <https://github.com/storytold/printcraft>
日本語フォントの取得元コミット: `8dcdacd5153e64560d109541a47d806f26f048c0`
