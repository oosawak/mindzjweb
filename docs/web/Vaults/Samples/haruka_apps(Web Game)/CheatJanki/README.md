# イカサマ☆雀姫 — CHEAT JANKI!

**無法地帯の3D麻雀。** 全員イカサマし放題、卓は大回転、隕石が降って、役はでっち上げ。
いちばん派手にやった者が、反則王だ！

制作: **haruka_apps**　／　[MIT License](LICENSE) © 2026 haruka_apps


---

## 遊び方（すぐ始める）

▶ **ブラウザで今すぐ遊ぶ: https://harukaappscreate.github.io/CheatJanki/** (Play in your browser)

- **ローカルサーバー**: `python3 -m http.server` を実行して http://localhost:8000 を開く（サウンドは Web Audio で再生）。
- **そのまま**: `index.html` をブラウザで開いても遊べます（file:// 対応）。
- **公開**: フォルダごと静的ホスティング（itch.io の HTML5 など）に置くだけで動きます。

PC（マウス・キーボード）とスマホ（縦・横）の両方に対応しています。日本語 / English 切り替えはタイトル右上か設定から。

### ルール（無法地帯）
- 東風戦のリーチ麻雀（4人: 東1〜東4局／3人: 東1〜東3局・北抜きあり）。赤ドラ・喰いタンあり。
- **全員イカサマし放題**。バレることも罰もありません。
- 自分の番ごとに **技ゲージ** が1たまり（最大5）、コスト（●）を払えば反則技は **必ず成功**。

| 技 | キー | ● | 効果 |
|---|---|---|---|
| 燕返し | 1 | 1 | 手牌1枚を山の次の6枚の好きな牌とすり替え |
| 千里眼 | 2 | 1 | 相手全員の手牌が透けて見える（次の自分の番まで） |
| 河拾い | 3 | 2 | 誰かの捨て牌を磁力で回収して手牌と入れ替え |
| 強打 | 4 | 2 | 衝撃波で相手の牌を3枚ずつ表向きに。相手はしばらく鳴けない |
| ドラ爆弾 | 5 | 2 | 自分の手に一番多い牌がドラになる表示牌を追加でめくる |
| 固有技 | 6 | 3 | キャラごとの必殺技（猫の手で盗む、札束でドラ買い、全員凍結…） |
| ちゃぶ台返し | F | 4 | 相手が和了った瞬間だけ。卓ごと返してその局を無効に |

- 相手12人も **固有技** を派手に使ってきます。
- 1局に2回、**卓が荒れるイベント**: 卓が大回転／重力反転／隕石ドラ／牌の大移動／謎ルールルーレット／熱波で牌が溶ける／時間が巻き戻る／言葉カードの雨。
- 和了ったら、毎巡もらえる **言葉カード** を最大4枚組み合わせて **役をでっち上げ**ます（手牌と噛み合う言葉は+2翻）。役なしの手でも和了れます。
- 終局後に派手さで決まる **反則王ランク**（S / A / B / C）と称号。スタッフロール付き。

---

## サウンド（ElevenLabs v4 で生成 → あとから結合）

仮サウンドはありません。音のファイルが無い間は無音で遊べます。生成して置くだけで自動的に鳴ります。

```
assets/audio/
  bgm/<id>.mp3                 … 6曲
  sfx/<id>.mp3                 … 39種
  voice/ja/<キャラ>/<キー>.mp3   … 日本語ボイス（基本11種は JANKI STARLIGHT から流用済み）
  voice/en/<キャラ>/<キー>.mp3   … 英語ボイス
  voice/<ja|en>/announcer/<キー>.mp3 … 審判
  available.js                 … 実在するファイルの一覧（自動生成）
```


---

## フォルダ構成（拡張しやすさ重視・ES モジュールなし／file:// で動作）

```
index.html            読み込み順の定義だけ
css/base.css          共通部品（JANKI STARLIGHT 由来）
css/cheat.css         反則HUD・でっち上げ役・カットイン・レスポンシブ
js/engine/            ルール層（UI 非依存・Node でテスト可）
  mahjong.js ai.js game.js tile-layout.js   … 麻雀エンジン（JANKI STARLIGHT から流用、フック追加）
  riot.js             … 無法地帯ルール層 RiotGame（技ゲージ・固有技・イベント・でっち上げ役・ランク）
js/data/              キャラ・セリフ(日英)・反則技・固有技/イベント(chaos.js)・言葉カード(words.js)・英語用語・クレジット
js/core/              i18n・共通ヘルパー・セーブ
js/audio/             サウンドID表（manifest.js）と再生（audio.js）
js/render/            3D卓（scene3d.js）と反則VFX（cheat3d.js）、2D牌
js/ui/                カットイン（fx.js / fx-cheat.js）・対局画面（game-ui.js）
js/app.js             画面遷移・設定・対局の開始/終了
assets/chars/         立ち絵（WebP）
```

### 新しい反則技を足すには
1. `js/data/cheats.js` に表示データ（漢字・色・名前・説明）
2. `js/engine/riot.js` の `CHEAT_RULES` に数値、必要なら `doXxx()` を追加
3. `js/ui/game-ui.js` の `applyCheat()` に処理、`js/render/cheat3d.js` に演出
4. `js/data/lines.js` の審判セリフ、音声を生成して `assets/audio/` に追加


---

## English

**CHEAT JANKI!** is a 3D riichi mahjong game where cheating is the point. Everyone cheats freely, the table spins, meteors make dora,
and you make up your own yaku when you win. The flashiest player becomes the Cheat King.

Open `index.html` (or run `python3 -m http.server`). Works on PC and phones, in Japanese and English.

Created by **haruka_apps** ([GitHub](https://github.com/harukaappscreate)). Released under the [MIT License](LICENSE). See `CREDITS.md`.
