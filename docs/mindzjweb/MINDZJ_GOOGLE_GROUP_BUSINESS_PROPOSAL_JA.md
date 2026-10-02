# Google Group対応MindZJ 検討資料

## 1. 目的

企業内のGoogle Groupに登録されたメンバーだけが利用できるMindZJを構築する。
MindZJのローカルVault管理と、Google Sheetsのリアルタイム共同編集を組み合わせ、
個人利用とチーム利用を両立させる。

## 2. 提案概要

MindZJを、次の2つの領域を扱うワークスペースとして位置付ける。

| 領域 | 保存先 | 主な用途 |
| --- | --- | --- |
| ノート・資料・添付ファイル | MindZJ Vault | Markdown、PDF、画像、業務資料の蓄積 |
| 共同編集データ | Google Sheets | 台帳、進捗表、集計表、申請一覧など |

利用者はGoogleアカウントでMindZJにログインする。対象のGoogle Groupに所属している
ユーザーだけが利用できるようにし、スプレッドシート自体の編集権限はGoogle Driveの
Group共有で管理する。

## 3. 想定利用イメージ

1. 管理者がGoogle Groupを作成する
2. Google Drive上の対象フォルダーまたはスプレッドシートをGroupに共有する
3. 利用者がMindZJへGoogleアカウントでログインする
4. MindZJから対象のスプレッドシートを開く
5. Groupメンバー同士でリアルタイム編集する
6. ノートや議事録、関連資料はMindZJ Vaultに保存する

Google Driveでは、フォルダーをGoogle Groupに共有すると、メンバーの追加・削除に
応じてアクセス権が反映される。編集者権限を付与した場合は、メンバーがファイルを
編集できる。  
参照: https://support.google.com/drive/answer/7166529

## 4. 推奨アーキテクチャ

```text
利用者のブラウザ
        │
        ├─ Google OAuthログイン
        │       └─ Googleアカウントを確認
        │
        └─ MindZJ Web
                ├─ Markdown・添付ファイル → MindZJ Vault
                └─ 共同編集表 → Google Sheets
                                └─ Google Drive / Group権限
```

### 権限の考え方

MindZJが独自にGroupメンバー一覧を持つのではなく、最初はGoogle側の権限を正とする。
対象ファイルがGroup共有されていれば、Google Sheets APIまたはGoogle Sheets本体が
Google側でアクセス可否を判定する。

この方式では、Groupからユーザーを削除した際に、MindZJ側の権限データを手動更新する
必要がない。

## 5. 認証・API方式

### MVP: Google Sheetsへのリンク連携

MindZJにGoogleログインを追加し、権限があるシートを新しいタブで開く。

- 実装が最も簡単
- Google Sheetsの共同編集機能をそのまま利用できる
- 数式、複数シート、コメント、変更履歴などの互換性が高い
- MindZJ内への完全な埋め込みではない

企業導入の初期段階では、この方式が最も安全で短期間に導入しやすい。

### 拡張: Google Sheets API連携

MindZJの画面からファイル一覧、シート情報、読み書きを扱う方式。

- MindZJのUIに統合しやすい
- Google Drive内の対象ファイルだけを扱う構成にできる
- OAuth同意画面とAPIスコープの管理が必要
- APIのスコープは慎重に選ぶ必要がある

Googleは、可能な場合はアプリが使用する特定ファイルに限定できる
`drive.file` スコープを推奨している。  
参照: https://developers.google.com/workspace/sheets/api/scopes

### Groupメンバーシップの直接照会

MindZJがGoogle Directory APIでGroupメンバーを直接確認する方式も可能だが、初期段階では
推奨しない。

- Google Workspace管理者権限や追加API設定が必要
- 管理者によるドメイン委任の検討が必要
- メンバー情報をMindZJ側で扱うため、個人情報・監査要件が増える

まずはGoogle DriveのGroup共有を権限の正とし、必要になった場合のみ直接照会を追加する。

## 6. Google Sheetsを「公開埋め込み」しない理由

Google Sheetsの「Webに公開」機能は、閲覧用の簡単な埋め込みには使えるが、企業向けの
権限制御には適さない。Group外のユーザーにも見える公開設定になり得るため、編集用途では
利用しない。

非公開のファイルをGoogleアカウントで開き、Google Driveの共有権限で制御する。

## 7. 企業利用でのメリット

- Google Groupの追加・削除だけで利用者を管理できる
- 退職・異動時の権限停止をGoogle側で一元化できる
- Google Sheetsのリアルタイム共同編集を利用できる
- MindZJ Vaultで議事録、仕様書、画像、PDFをまとめて管理できる
- ExcelやGoogle Sheetsの既存資産を活用できる
- Google Sheets側の変更履歴やコメント機能を利用できる

## 8. 注意点・リスク

### Google依存

共同編集部分はGoogleのサービス、アカウント、ネットワークに依存する。Google Workspaceが
利用できない場合、共同編集機能も利用できない。

### データの保存場所

Google SheetsはMindZJ VaultではなくGoogle Driveに保存される。機密情報の保存場所、保持期間、
バックアップ、監査ログについて、会社の情報管理規程との確認が必要である。

### OAuth審査

Google Sheets APIで機密性の高いスコープを使う場合、OAuth同意画面やアプリ確認の対応が
必要になる場合がある。

### 埋め込みの制約

Google Sheets本体をMindZJの画面内に完全に埋め込むより、新しいタブで開く方が互換性と
運用安定性が高い。完全統合UIは第2段階以降とする。

## 9. 段階導入案

### Phase 1: Group制限とリンク連携

- Google OAuthログイン
- 許可されたGoogle Workspaceアカウントだけ利用可能
- MindZJから対象Sheetsを開く
- Group共有はGoogle Driveで管理
- Vault機能は従来通り

### Phase 2: MindZJ内のSheets一覧

- Google Drive / Sheets APIで対象ファイルを取得
- Group共有済みファイルだけ一覧表示
- 新規シート作成・リンク登録
- MindZJのノートからSheetsへリンク

### Phase 3: MindZJ UIへの統合

- MindZJ内にSheetsビューを表示
- 保存・更新状態を表示
- Vault内の資料とSheetsを関連付け
- 監査ログ・利用状況の確認

## 10. 推奨結論

「Google Group対応MindZJ」は企業利用に有効である。特に、既にGoogle Workspaceを導入して
いる企業では、Groupを利用者管理の入口にできるため、独自のアカウント管理を大きく減らせる。

最初からGoogle Sheetsを完全にMindZJへ埋め込むのではなく、次の構成で始めることを推奨する。

> Google OAuth + Google Group共有 + MindZJからのSheets起動 + MindZJ Vault

この構成で利用価値を検証し、利用者数・機密性・共同編集の頻度を見たうえで、Sheets API連携や
MindZJ内埋め込みへ拡張する。
