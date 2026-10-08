# INKFALL

> 重力を制し、6 面すべてを塗りつぶせ。
> 重力 × インク 陣取りバトル(オンライン 2〜8 人 / CPU 戦 / ソロ練習)

© 2026 haruka_apps — three.js r186 / ES Modules(ビルド不要)/ Wavedash SDK 対応

---

## ゲーム内容

夜空に浮かぶキューブ型スタジアム「THE CUBE」が舞台です。床・壁・天井、さらに浮遊ブロックの**すべての面が陣地**になっています。
どの面でも狙えば重力が切り替わり、そこが「床」になります。

| モード | 人数 | 内容 |
|---|---|---|
| 陣取りバトル(オンライン / CPU) | 2 チーム・最大 4 対 4 | 120 秒 × 2 ラウンド。最後の 20 秒は塗りが 1.5 倍になる **OVERDRIVE** |
| 重力ばくだん鬼(オンライン / CPU) | 4〜8 人の個人戦 | 爆弾をタッチで押しつけ合い、時間切れで持っていた人が脱落。最後の 1 人が勝ち |
| トレーニング | ソロ | ダミー相手に、移動 → 視点 → 塗り → 重力 → スタンプ → ボム → 撃破 を順番に練習 |
| スコアチャレンジ | ソロ | 60 秒で塗ったマス数を競う。**Wavedash のリーダーボード**に送信 |

### 重力ならではのアクション
- **重力フリップ**:狙った面へ「落ちる」移動。
- **インクスタンプ**:長い距離を落ちて着地すると大きく塗れて、真下の相手をインクアウトできる。
- **グラビティボム**:塗るとたまるスペシャル。当たった周りの相手の重力を反転させる。

### 操作
| | PC | スマホ | ゲームパッド |
|---|---|---|---|
| 移動 | WASD | 左側スティック | 左スティック |
| 視点 | マウス(画面クリックでロック) | 右側ドラッグ / 射撃ボタンをドラッグ | 右スティック |
| 射撃(鬼では突き飛ばし) | 左クリック | 射撃ボタン | RT |
| 重力フリップ | 右クリック / Shift | 重力ボタン / 面をタップ | LT / RB |
| ジャンプ | Space | ジャンプボタン | A |
| グラビティボム | Q | ボムボタン | Y / LB |
| メニュー | Esc | 右上 ⏸ | Start |

### 流れ
タイトル → イントロ(初回のみ・スキップ可)→ ロビー or ソロ → 試合 → アウトロ(結果・表彰台)→ エンディング → スタッフロール

---

## 起動方法

```bash
cd inkfall
python3 -m http.server 8766
# → http://localhost:8766/
```

- **ソロモード**は、どこで開いても遊べます(GitHub Pages も可)。
- **オンライン**は Wavedash 上で動きます。SDK は Wavedash が実行時に `window.Wavedash` として注入するため、リポジトリには含めていません。

### 開発用:にせ Wavedash で 2 タブ対戦
同じブラウザで次の 2 つのタブを開くと、ロビー・P2P 通信をタブ間で再現できます(本番では使われません)。
```
http://localhost:8766/?fakesdk=alice
http://localhost:8766/?fakesdk=bob
```
- 自動テストも用意しています。
  - `npm test`(通信形式の単体テスト)
  - `npm run e2e`(Playwright で 2 タブ対戦:ロビー → 開始 → 同期チェック)
- にせ SDK は本物と同じく、入室から少し遅れて P2P がつながります(既定 1.5 秒。`&p2pdelay=4000` で変更)。つながる前の送信は捨てられます。
- その他の URL パラメータ:`?scene=match&mode=turf|tag|training|challenge`、`?autostart=1`

---

## Wavedash への登録

1. `wavedash.toml` の `game_id` に、Developer Portal のプロジェクト ID を入れる。
2. `python3 tools/make_dist.py` を実行する。`dist/` と `artifacts/inkfall-wavedash-YYYYMMDD.zip` ができる(ZIP の直下に `index.html`)。
3. Developer Portal → Builds → Upload new build で ZIP を登録し、入口に `index.html` を指定する。
4. プレビューで、別端末・別アカウントの 2 人以上で動作を確認してから公開する。

> ⚠ API キー(`WAVEDASH_TOKEN` / `credentials.json`)は絶対にコミットしないでください。`.gitignore` 済みです。

### オンラインの仕組み(LASTFALL と同じ方針)
- **ホスト固定**です。ホストが抜けたら試合は終了します。参加者が抜けた枠は CPU が引き継ぎます。
- **ホストが判定するもの**:弾の当たり、塗り、インクアウト、スタンプ、ボム、スコア、時間、ばくだん。
- **各プレイヤーが送るもの**:自分の移動(20Hz・信頼しない通信)。
- **通信の形式**:
  - 塗りはマス単位の差分(信頼する通信、10Hz)。加えて全マスを少しずつ再送し、ずれを自動で修正します。
  - 1 パケット 2004 バイト以内(SDK の上限)。超える分は分割します。
- **使っている SDK の機能**:ロビー(作成 / 一覧 / ID 参加 / 招待リンク / 起動パラメータからの参加)、P2P、プレゼンス、リーダーボード(スコアチャレンジのみ)、読み込み進捗。

---

## 🎵 BGM / SFX / Voice(ElevenLabs)

前作と同じ方式です。ID ごとに決まった場所へ mp3 を置けば、そのまま使われます。

| 種類 | 置き場所 | ID 一覧 |
|---|---|---|
| BGM | `assets/audio/bgm/bgm_<id>.mp3` | `assets/audio/manifest.json` の `bgm` |
| 効果音 | `assets/audio/sfx/<id>.mp3` | `assets/audio/manifest.json` の `sfx` |
| ボイス | `assets/audio/voice/{ja,en}/<id>.mp3` | `data/script.json` の `lines[].id` |

```bash
cd inkfall/tools/elevenlabs
export ELEVENLABS_API_KEY=xxxx           # または .env に記入
# voices.json の voice_id(実況 announcer / ナビ navi × 日本語・英語)を設定
python3 generate_audio.py check-text     # 日本語の読み上げ文がひらがなだけか確認
python3 generate_audio.py all --lang ja,en
python3 generate_audio.py status
```

- 種類ごとに作る場合:`python3 generate_audio.py voice --lang ja,en` / `sfx` / `bgm`
- できたファイルは飛ばすので、途中で止まっても同じコマンドをもう一度実行すれば続きから作れます。失敗したものは最後に一覧表示されます。

日本語の読み上げ文(`tts.ja`)はすべてひらがなです。字幕(`text.ja`)は漢字かな交じりで表示します。

---

## フォルダ構成

```
inkfall/
├─ index.html / css/style.css / assets/(icon, fonts, audio)
├─ js/
│  ├─ main.js, config.js
│  ├─ core/   Engine / Input / AudioManager / SynthFallback / SceneManager / Settings / I18n / Tween
│  ├─ net/    Wavedash(SDK との境界)/ NetSession(ロビー・配送)/ Wire(パケット形式)/ FakeSdk(開発用)
│  ├─ game/   Match(ルールとホスト判定)/ Arena(塗れる面)/ Actor / Bot(CPU)/ Robot(キャラ)/ CameraRig / arenas/
│  ├─ scenes/ Title / Intro / Lobby / Match / Outro / Ending / Credits(+ Base / Backdrop)
│  ├─ vfx/    PostFX / InkFX / Particles / Rings / Stadium / Sky / Decor / Textures
│  └─ ui/     UI / Panels / Subtitles / TouchControls / Icons
├─ data/      script.json(セリフ)/ credits.json / i18n/{en,ja}.json
├─ tools/     make_dist.py / elevenlabs/(generate_audio.py, voices.json)
├─ tests/     wire.test.mjs / mp-fake-sdk.mjs
├─ vendor/three/(r186・MIT)
└─ wavedash.toml
```

### 拡張のしかた
- **アリーナの追加**:`js/game/arenas/` に定義を追加し、`Match.js` の `ARENAS` に登録します。ブロックは整数座標の箱で、面とマスは自動で生成されます。
- **ルール・バランス**:`js/config.js`(移動・射撃・スタンプ・ラウンド時間・人数など)で調整できます。
- **セリフ・文言**:`data/script.json`、`data/i18n/*.json` を編集します。

---

## 確認済み / 未確認
- **確認済み(ヘッドレスブラウザ・ソフトウェア描画)**
  - 全モード(CPU 陣取り / ばくだん鬼 / トレーニング / スコアチャレンジ)が結果画面まで進むこと。
  - 2 タブの模擬 SDK 対戦で、ロビー → 開始 → 移動 → 塗りの同期が取れること(時間・位置・塗りが一致)。
  - PC / スマホ縦 / スマホ横の画面配置。
- **未確認**
  - 本番の Wavedash SDK での通信。
  - 実機のスマホ。
  - 3 人以上の人間による対戦や、長時間の安定性。
  - アップロード後のプレビューで必ず確認してください。

## ライセンス
- ゲームのコード・キャラクター・アリーナ・演出:**© 2026 haruka_apps. All Rights Reserved.**
- 第三者のライブラリ・フォントは [CREDITS.md](CREDITS.md) にまとめています。
