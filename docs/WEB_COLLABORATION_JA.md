# Ubuntu Server版の共同編集プロトタイプ

## 対象

この検討は、Ubuntu Server上で稼働するMindZJWebを対象にします。GitHub Pages版はサーバー上のVaultを書き換えないため、共同編集の対象外です。

## 試作の起動

RustサーバーとWebフロントエンドを起動し、`/collab-prototype.html`を開きます。

- 開発環境: `./dev-web.sh` を起動して `https://localhost:3000/collab-prototype.html` を開く
- ビルド済みUbuntu Server: サーバーのURLに `/collab-prototype.html` を付けて開く
- 2つのブラウザーで同じVaultの絶対パスとVault内Markdownパスを指定して接続

WebSocketでYjs更新を同期し、サーバーは更新をVaultのMarkdownファイルへ保存します。接続中の共同編集ノートは、通常の編集ロック経由の保存を拒否します。最後の参加者が切断すると共同編集セッションを閉じ、次回はMarkdownファイルから新しいセッションを開始します。

このページは独立した実験用エディタで、MindZJの通常のノート画面にはまだ統合されていません。カーソルや参加者一覧、切断中のオフライン編集には対応していません。

## 構成

複数人が同じMarkdownノートを同時に編集し、変更を自動で統合する構成を追加しました。現在のCodeMirror 6とRust/Axumサーバーを使っています。

- ブラウザー側: YjsとCodeMirror 6用バインディングで編集操作を同期
- Ubuntu Server側: Yrs（Yjs互換のRust CRDT）で更新を受け取り、AxumのWebSocket経由で同じノートの編集者へ配信
- ファイル保存: 共同編集状態をサーバー側に永続化しつつ、Markdownファイルにも反映

CodeMirror公式の共同編集パッケージは、共同編集のためのクライアント処理を提供しますが、サーバーとの通信や権威サーバーはアプリ側で用意する設計です。[CodeMirror共同編集資料](https://codemirror.net/examples/collab/)

YjsはWebSocket Providerで変更と参加者の状態を配信でき、YrsはYjs互換のCRDTをRustで提供しています。[Yjs WebSocket Provider](https://docs.yjs.dev/ecosystem/connection-provider/y-websocket)・[Yrs](https://docs.rs/yrs/latest/yrs/)

## GitHub Pages版を対象外にする理由

GitHub Pagesは静的ホスティングで、Ubuntu ServerのVaultへ書き込むAPIもWebSocketサーバーもありません。Pages上のブラウザー内保存は共同編集サーバーと別の機能なので、今回の共同編集設計には含めません。

## 既存実装との関係

- フロントエンドはCodeMirror 6を使用しています。
- Ubuntu Server版はRust/AxumのHTTP APIを持ち、現在はMarkdownの`write_file`時に編集ロックを検証します。
- ロックは45秒のリースで、編集中は15秒ごとに延長します。
- 共同編集対象のノートでは、各ユーザーがロックを取り合う仕組みを使わず、CRDTで変更を統合する必要があります。
- 共同編集を利用しないノートや添付ファイルでは、既存の編集ロックを維持できます。

## 永続化

Markdownファイルだけを共同編集状態の保存先にすると、サーバー再起動後に編集中ブラウザーが持つ古いCRDT状態を安全に再接続できない場合があります。再起動前後で文書の履歴が別系統になると、再接続時に内容が重複するおそれがあります。

編集中はVault内の`.mindzj/collab/`にノートごとのCRDT状態を一時保存し、Markdownファイルにも更新を反映します。最後の参加者が正常に切断するとCRDT状態を削除します。サーバー異常終了後に状態が残り、その間にMarkdownが外部変更されていた場合は、外部版を別ファイルに退避して共同編集版を復元します。

## 次の段階

- 通常のノート画面へ統合し、参加者名とリモートカーソルを表示
- 切断後の再接続とオフライン中の変更同期
- MindZJエディタのUndo/Redo、Markdown拡張、任意の自動保存との統合
- サーバー再起動後の復元や外部エディタ更新との競合を確認

## 先に決める仕様

- 共同編集を全ノートで有効にするか、ノート単位で有効にするか
- ユーザー名とカーソル表示に使う参加者情報
- `.mindzj`内の共同編集データをバックアップ・削除する方法
- サーバー外からMarkdownが変更された場合の取り込み方
- 接続できない間の編集を許可するか、読み取り専用にするか

## 推奨する初期範囲

試作はUbuntu Server上のMarkdownノートだけを対象にしています。画像・添付ファイル、GitHub Pages、Tauriデスクトップ、グループ認証は対象外です。

## 参考資料

- [CodeMirror共同編集](https://codemirror.net/examples/collab/)
- [Yjs CodeMirror連携](https://docs.yjs.dev/ecosystem/editor-bindings/codemirror)
- [Yjs WebSocket Provider](https://docs.yjs.dev/ecosystem/connection-provider/y-websocket)
- [Yrs Rustドキュメント](https://docs.rs/yrs/latest/yrs/)
- [yrs-axum: Yrs WebSocket protocol for Axum](https://github.com/vagmi/yrs-axum)
