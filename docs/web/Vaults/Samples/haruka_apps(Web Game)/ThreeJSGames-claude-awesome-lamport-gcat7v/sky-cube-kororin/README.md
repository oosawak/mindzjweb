# そらキューブ ころりん / SKY CUBE KORORIN

> かべを ぽちっと すると、そこが「した」になる!
> 3D じゅうりょく きりかえ アクション(プレイ時間 約3〜5分)

© 2026 haruka_apps — Three.js r186 / HTML + ES Modules(ビルド不要)

---

## あそびかた

| | スマホ | PC |
|---|---|---|
| いどう | 画面の **ひだりがわ** をなぞる(バーチャルスティック) | `W A S D` / やじるしキー |
| ジャンプ | 右下の **ジャンプ** ボタン | `Space` |
| じゅうりょく きりかえ | かべ・てんじょうを **タップ** | かべ・てんじょうを **クリック** |
| カメラ | 画面の **みぎがわ** をなぞる | マウスで ドラッグ / `Q` `E` |
| ひとやすみ | 右上の ⏸ ボタン | `Esc` / `P` |

ゲームパッドにも対応しています(左スティック移動 / A ジャンプ / 右スティック カメラ / RB で画面中央を「ぽちっ」)。

### ながれ
タイトル → イントロ(ムービー)→ ステージ1〜3 → アウトロ(けっか はっぴょう)→ エンディング → スタッフロール

- **ステージ1「はじまりの へや」** — チュートリアル。へやの かべ・てんじょう すべてが ゆか になる
- **ステージ2「ねじれ タワー」** — うえに おちて とうを のぼる。ビリビリ と うごく ブロック
- **ステージ3「ほしの めいろ」** — よぞらに うかぶ しまを とびうつる。くずれる しま

---

## うごかしかた(ローカル)

ES Modules を使っているので、**ファイルを直接ダブルクリックでは動きません**。かんたんな Web サーバーで開いてください。

```bash
cd sky-cube-kororin
python3 -m http.server 8000
# → ブラウザで http://localhost:8000/
```

GitHub Pages などの静的ホスティングにそのまま置けます(three.js は `vendor/` に同梱済み)。

### デバッグ用 URL パラメータ
- `?scene=game&stage=2` … ステージ2から
- `?scene=intro` / `outro` / `ending` / `credits` … 各シーンを直接ひらく
- `?autostart=1` … 「タップして はじめる」を省略(音は鳴りません)

---

## フォルダ構成

```
sky-cube-kororin/
├─ index.html              … 画面の骨組み + importmap
├─ css/style.css           … UI(レスポンシブ / セーフエリア対応)
├─ js/
│  ├─ main.js              … 起動・読み込み・シーン登録
│  ├─ config.js            … 手ざわり・画質・ランクの調整値
│  ├─ core/                … Engine / SceneManager / Input / AudioManager / SynthFallback / Settings / I18n / Tween
│  ├─ scenes/              … Title / Intro / Game / Outro / Ending / Credits(+ 共通の BaseScene / CineScene / CineWorld)
│  ├─ game/                … Player / CameraRig / Level / Kororin(キャラ)/ Entities / StarGeometry
│  │  └─ levels/           … stage1.js 〜 stage3.js(ステージデータ)
│  ├─ vfx/                 … PostFX / Particles / Rings / Sky / Decor / Materials / Textures
│  └─ ui/                  … UI / Panels / Subtitles / TouchControls / Icons
├─ data/
│  ├─ script.json          … セリフ台本(字幕 + 読み上げ用ひらがな)
│  ├─ credits.json         … クレジット
│  └─ i18n/ja.json, en.json
├─ assets/
│  ├─ icon.svg
│  └─ audio/
│     ├─ manifest.json     … 音の ID ↔ ファイル と ElevenLabs 用プロンプト
│     ├─ bgm/  sfx/  voice/ja/  voice/en/
├─ tools/elevenlabs/
│  ├─ generate_audio.py    … ElevenLabs で mp3 を いっかつ生成
│  └─ voices.json          … ボイス ID / モデル名 の設定
└─ vendor/three/           … three.js r186(MIT License)
```

### ステージを追加するには
1. `js/game/levels/stage4.js` を作る(stage1.js をコピーすると早い)
2. `js/game/levels/index.js` に import を追加
3. `js/config.js` の `stageOrder` に `'stage4'` を追加
4. セリフを使う場合は `data/script.json` に行を追加

ステージは「軸にそった箱」を並べるだけのデータです。`b.block()`, `b.room()`, `b.slabY()`, `b.hazard()`, `b.mover()`, `b.crumble()`, `b.star()`, `b.goal()` が使えます。

---

## 🎵 BGM / SFX / Voice(ElevenLabs)との結合

音はすべて **ID** で呼び出しています。決められた場所に mp3 を置くだけで、コードを変えずに差し替わります。
ファイルが無い間は、ゲーム内の簡易シンセ音(BGM / 効果音)と字幕だけで動きます。

| 種類 | 置き場所 | ID の一覧 |
|---|---|---|
| BGM | `assets/audio/bgm/bgm_<id>.mp3` | `assets/audio/manifest.json` の `bgm` |
| 効果音 | `assets/audio/sfx/<id>.mp3` | `assets/audio/manifest.json` の `sfx` |
| ボイス | `assets/audio/voice/ja/<id>.mp3`, `voice/en/<id>.mp3` | `data/script.json` の `lines[].id` |

### スクリプトで いっかつ生成(おすすめ)

```bash
cd sky-cube-kororin/tools/elevenlabs
# 1) API キーを設定(どちらか)
export ELEVENLABS_API_KEY=xxxxxxxx            # または .env ファイルに ELEVENLABS_API_KEY=xxxxxxxx
# 2) voices.json の voice_id を 自分の ElevenLabs ボイスに 書きかえる
# 3) 生成
python3 generate_audio.py check-text           # 日本語の読み上げ文が ひらがな だけか確認
python3 generate_audio.py voice --lang ja --dry-run   # 何を作るか 確認だけ
python3 generate_audio.py voice --lang ja
python3 generate_audio.py voice --lang en
python3 generate_audio.py sfx
python3 generate_audio.py bgm
python3 generate_audio.py status               # そろっているか 確認
```

- 追加ライブラリ不要(Python 3.9+ の標準ライブラリのみ)
- すでにあるファイルは スキップ(`--force` で作りなおし、`--only id1,id2` で一部だけ)
- モデル名(`eleven_v4` など)やパラメータは `voices.json` で変更できます。API の仕様が変わった場合も ここを直せば OK
- 日本語の読み上げ文(`data/script.json` の `tts.ja`)は **すべて ひらがな** にしてあります(読み間違い防止)。字幕は `text.ja` を表示します

### 手作業で生成する場合
`python3 generate_audio.py export` で `tools/elevenlabs/export/*.csv` に「ファイル名・読み上げ文・プロンプト」の一覧を書き出せます。
ElevenLabs の画面で生成したら、CSV の `filename` の場所・名前で保存してください。

### 生成した mp3 を反映するには
ファイルを置いたら、そのまま `git add` → `commit` → `push` すれば OK です。ゲーム側の設定変更は不要です。

---

## 設定(タイトル → せってい)
おんがく / こうかおん / こえ の音量、ことば(にほんご / English)、やさしいモード、ゆれを へらす、じまく、がしつ(おまかせ / ひくい / ふつう / たかい)。
設定とベスト記録はブラウザの localStorage に保存されます。

---

## ライセンス・クレジット
- ゲームのコード・キャラクター(ころりん / ゆめぼし)・ステージ・演出: **© 2026 haruka_apps. All Rights Reserved.**
- 3D モデル・テクスチャはすべてコードで生成したオリジナルです(外部の画像・モデル素材は使っていません)
- 使用しているライブラリ・フォントは [CREDITS.md](CREDITS.md) を見てください
