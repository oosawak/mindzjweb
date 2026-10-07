# 日本語ファイル名と文字表示

PhotoCraftとPrintCraftのWeb版に、日本語文字を表示するためのBIZ UDPGothic Regularを組み込みました。両方のライセンス画面からフォントのOFL 1.1と帰属情報を確認できます。

ファイル名はURLのクエリ値としてUTF-8で渡し、PrintCraftではURLSearchParamsで復元してから文書名に使います。PDF保存では元の名前を維持し、Vaultへ書き戻します。

フォントは画面上の文字の形を表示するためのものです。内部データ自体が別の文字コードで壊れて保存されたファイルを自動修復するものではありません。PDFやPSDなど、対象ファイルと文字が崩れる画面の例によっては、形式ごとのデコード処理も調査が必要です。

上流ソースへ加えたWebフォント対応差分:

- [PhotoCraft差分](photocraft-japanese-font.patch)
- [PrintCraft差分](printcraft-mindzj.patch)

日本語フォントの取得元: [craft-fonts](https://github.com/storytold/craft-fonts), commit `8dcdacd5153e64560d109541a47d806f26f048c0`.
