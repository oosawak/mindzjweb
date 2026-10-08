#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
INKFALL — ElevenLabs 音声いっかつ生成スクリプト
© 2026 haruka_apps

ゲームが読み込む場所(assets/audio/...)に、正しいファイル名で mp3 を保存します。
生成したら そのまま ゲームを ひらけば 自動で 使われます(コードの変更は不要)。

  必要なもの: Python 3.9+(追加ライブラリ不要)
  API キー  : 環境変数 ELEVENLABS_API_KEY  または  tools/elevenlabs/.env に
              ELEVENLABS_API_KEY=xxxxx と書く(.env は git に入りません)

つかいかた:
  python generate_audio.py status                 # どのファイルが まだ無いか 一覧
  python generate_audio.py voice --lang ja        # 日本語ボイス(ぜんぶ)
  python generate_audio.py voice --lang en        # 英語ボイス
  python generate_audio.py voice --lang ja --only intro_01,intro_02
  python generate_audio.py sfx                    # 効果音
  python generate_audio.py bgm                    # BGM(Eleven Music)
  python generate_audio.py all --lang ja,en       # ぜんぶ
  python generate_audio.py export                 # 手作業用 CSV を書き出す
  python generate_audio.py check-text             # 日本語の読み上げ文が ひらがな だけか確認

  共通オプション:
    --force     すでにある ファイルも 作りなおす
    --dry-run   API を呼ばずに 何を作るか だけ 表示

設定(ボイス ID / モデル名など)は voices.json を編集してください。
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]                      # sky-cube-kororin/
MANIFEST = ROOT / "assets" / "audio" / "manifest.json"
SCRIPT = ROOT / "data" / "script.json"
VOICES = HERE / "voices.json"
API = "https://api.elevenlabs.io/v1"


# ---------------------------------------------------------------------------
# 読み込み
# ---------------------------------------------------------------------------
def load_json(p: Path) -> dict:
    with p.open(encoding="utf-8") as f:
        return json.load(f)


def load_api_key(cli_key: str | None) -> str | None:
    if cli_key:
        return cli_key
    if os.environ.get("ELEVENLABS_API_KEY"):
        return os.environ["ELEVENLABS_API_KEY"]
    env = HERE / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def audio_base(manifest: dict) -> Path:
    return ROOT / manifest.get("basePath", "assets/audio/")


def voice_path(manifest: dict, lang: str, line_id: str) -> Path:
    pattern = manifest.get("voice", {}).get("pattern", "voice/{lang}/{id}.mp3")
    return audio_base(manifest) / pattern.replace("{lang}", lang).replace("{id}", line_id)


# ---------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------
def post_audio(url: str, body: dict, api_key: str, retries: int = 4) -> bytes:
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    delay = 2.0
    for attempt in range(retries + 1):
        req = urllib.request.Request(url, data=data, method="POST", headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        })
        try:
            with urllib.request.urlopen(req, timeout=300) as res:
                ctype = res.headers.get("Content-Type", "")
                payload = res.read()
                if "json" in ctype:
                    raise RuntimeError(f"audio ではなく JSON が返りました: {payload[:300]!r}")
                return payload
        except urllib.error.HTTPError as e:
            msg = e.read().decode("utf-8", "replace")[:500]
            if e.code in (429, 500, 502, 503, 504) and attempt < retries:
                print(f"    … {e.code} のため {delay:.0f}秒 まって リトライします")
                time.sleep(delay)
                delay *= 2
                continue
            raise RuntimeError(f"HTTP {e.code}: {msg}") from None
        except urllib.error.URLError as e:
            if attempt < retries:
                print(f"    … 通信エラー({e.reason})。{delay:.0f}秒 まって リトライします")
                time.sleep(delay)
                delay *= 2
                continue
            raise
    raise RuntimeError("リトライ回数を こえました")


FAILED: list[str] = []


def fetch_and_save(label: str, url: str, body: dict, api_key: str, out: Path) -> bool:
    """1 件ぶん 生成して 保存。失敗しても 止めずに 記録して 次へ 進む。"""
    try:
        save(out, post_audio(url, body, api_key))
        return True
    except (RuntimeError, urllib.error.URLError, OSError) as e:
        print(f"    ✖ {label}: {e}")
        FAILED.append(f"{label}: {e}")
        return False


def save(path: Path, payload: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(payload)
    print(f"    ✔ 保存: {path.relative_to(ROOT)}  ({len(payload) // 1024} KB)")


# ---------------------------------------------------------------------------
# 生成
# ---------------------------------------------------------------------------
def gen_voice(args, manifest, script, cfg, api_key):
    langs = [l.strip() for l in args.lang.split(",") if l.strip()]
    only = set(filter(None, (args.only or "").split(",")))
    model = cfg["models"]["tts"]
    fmt = cfg.get("output_format", "mp3_44100_128")
    use_tags = cfg.get("use_emotion_tags", False)
    for lang in langs:
        print(f"\n■ ボイス [{lang}]  model={model}")
        for line in script["lines"]:
            lid = line["id"]
            if only and lid not in only:
                continue
            out = voice_path(manifest, lang, lid)
            if out.exists() and not args.force:
                print(f"  - {lid}: すでに あります(--force で作りなおし)")
                continue
            spk = cfg["speakers"].get(line["speaker"], {})
            vid = (spk.get(lang) or {}).get("voice_id", "")
            if not vid or vid.startswith("PUT_"):
                print(f"  ! {lid}: voices.json の speakers.{line['speaker']}.{lang}.voice_id を設定してください")
                continue
            text = line["tts"][lang]
            if use_tags and line.get("emotion"):
                text = f"[{line['emotion']}] {text}"
            body = {"text": text, "model_id": model}
            if cfg.get("send_language_code", True):
                body["language_code"] = lang
            vs = spk.get("voice_settings")
            if vs:
                body["voice_settings"] = vs
            if cfg.get("seed") is not None:
                body["seed"] = cfg["seed"]
            print(f"  ▶ {lid} ({line['speaker']}): {text}")
            if args.dry_run:
                continue
            fetch_and_save(f"voice/{lang}/{lid}", f"{API}/text-to-speech/{vid}?output_format={fmt}", body, api_key, out)
            time.sleep(cfg.get("wait_seconds", 0.4))


def gen_sfx(args, manifest, cfg, api_key):
    only = set(filter(None, (args.only or "").split(",")))
    fmt = cfg.get("output_format", "mp3_44100_128")
    print(f"\n■ 効果音  model={cfg['models'].get('sfx')}")
    for sid, e in manifest["sfx"].items():
        if only and sid not in only:
            continue
        out = audio_base(manifest) / e["file"]
        if out.exists() and not args.force:
            print(f"  - {sid}: すでに あります")
            continue
        body = {"text": e["prompt"], "prompt_influence": cfg.get("sfx_prompt_influence", 0.5)}
        if e.get("duration"):
            body["duration_seconds"] = max(0.5, float(e["duration"]))
        if cfg["models"].get("sfx"):
            body["model_id"] = cfg["models"]["sfx"]
        print(f"  ▶ {sid}: {e['prompt'][:70]}…")
        if args.dry_run:
            continue
        fetch_and_save(f"sfx/{sid}", f"{API}/sound-generation?output_format={fmt}", body, api_key, out)
        time.sleep(cfg.get("wait_seconds", 0.4))


def gen_bgm(args, manifest, cfg, api_key):
    only = set(filter(None, (args.only or "").split(",")))
    fmt = cfg.get("output_format", "mp3_44100_128")
    print(f"\n■ BGM  model={cfg['models'].get('music')}")
    for bid, e in manifest["bgm"].items():
        if only and bid not in only:
            continue
        out = audio_base(manifest) / e["file"]
        if out.exists() and not args.force:
            print(f"  - {bid}: すでに あります")
            continue
        body = {"prompt": e["prompt"], "music_length_ms": int(e.get("length_ms", 60000))}
        if cfg["models"].get("music"):
            body["model_id"] = cfg["models"]["music"]
        if cfg.get("force_instrumental", True):
            body["force_instrumental"] = True
        print(f"  ▶ {bid} ({body['music_length_ms'] // 1000}s): {e['prompt'][:70]}…")
        if args.dry_run:
            continue
        fetch_and_save(f"bgm/{bid}", f"{API}/music?output_format={fmt}", body, api_key, out)
        time.sleep(cfg.get("wait_seconds", 1.0))


# ---------------------------------------------------------------------------
# ユーティリティ
# ---------------------------------------------------------------------------
def status(manifest, script):
    base = audio_base(manifest)
    rows = []
    for bid, e in manifest["bgm"].items():
        rows.append(("BGM", bid, base / e["file"]))
    for sid, e in manifest["sfx"].items():
        rows.append(("SFX", sid, base / e["file"]))
    for lang in ("ja", "en"):
        for line in script["lines"]:
            rows.append((f"VOICE-{lang}", line["id"], voice_path(manifest, lang, line["id"])))
    ok = sum(1 for _, _, p in rows if p.exists())
    for kind, rid, p in rows:
        mark = "✔" if p.exists() else "・"
        print(f" {mark} {kind:9} {rid:16} {p.relative_to(ROOT)}")
    print(f"\n  {ok} / {len(rows)} ファイル が そろっています(無いものは ゲーム内の 簡易シンセ音 / 字幕のみ に なります)")


def export_csv(manifest, script):
    outdir = HERE / "export"
    outdir.mkdir(exist_ok=True)
    for lang in ("ja", "en"):
        p = outdir / f"voice_{lang}.csv"
        with p.open("w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f)
            w.writerow(["filename", "speaker", "tts_text", "subtitle_text", "emotion", "speaker_direction"])
            for line in script["lines"]:
                spk = script["speakers"][line["speaker"]]
                w.writerow([voice_path(manifest, lang, line["id"]).relative_to(ROOT).as_posix(), line["speaker"],
                            line["tts"][lang], line["text"][lang], line.get("emotion", ""), spk.get("direction", "")])
        print(f"  ✔ {p.relative_to(ROOT)}")
    for kind in ("sfx", "bgm"):
        p = outdir / f"{kind}.csv"
        with p.open("w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f)
            w.writerow(["filename", "id", "prompt", "duration_or_length"])
            for rid, e in manifest[kind].items():
                w.writerow([(audio_base(manifest) / e["file"]).relative_to(ROOT).as_posix(), rid, e["prompt"],
                            e.get("duration", e.get("length_ms", ""))])
        print(f"  ✔ {p.relative_to(ROOT)}")


HIRAGANA_OK = re.compile(r"^[ぁ-ゟー\s、。!?!?…,.ー〜~]+$")


def check_text(script):
    bad = 0
    for line in script["lines"]:
        s = line["tts"]["ja"]
        if not HIRAGANA_OK.match(s):
            bad += 1
            odd = "".join(sorted(set(ch for ch in s if not HIRAGANA_OK.match(ch))))
            print(f"  ! {line['id']}: ひらがな いがいの 文字 → {odd!r}  「{s}」")
    print("  ✔ 日本語の 読み上げ文は すべて ひらがな です" if bad == 0 else f"  {bad} 件 なおしてください")
    return bad == 0


# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="INKFALL — ElevenLabs audio generator")
    ap.add_argument("command", choices=["status", "voice", "sfx", "bgm", "all", "export", "check-text"])
    ap.add_argument("--lang", default="ja", help="ja / en / ja,en")
    ap.add_argument("--only", help="ID を カンマ区切りで 指定(例: intro_01,jump)")
    ap.add_argument("--force", action="store_true", help="既存ファイルも 上書き")
    ap.add_argument("--dry-run", action="store_true", help="API を呼ばずに 内容だけ 表示")
    ap.add_argument("--api-key", help="ElevenLabs API キー(環境変数より優先)")
    args = ap.parse_args()

    manifest = load_json(MANIFEST)
    script = load_json(SCRIPT)
    cfg = load_json(VOICES)

    if args.command == "status":
        return status(manifest, script)
    if args.command == "export":
        return export_csv(manifest, script)
    if args.command == "check-text":
        sys.exit(0 if check_text(script) else 1)

    api_key = load_api_key(args.api_key)
    if not api_key and not args.dry_run:
        sys.exit("ELEVENLABS_API_KEY が ありません。環境変数か tools/elevenlabs/.env に 設定してください。")

    try:
        if args.command in ("voice", "all"):
            if "ja" in args.lang:
                check_text(script)
            gen_voice(args, manifest, script, cfg, api_key)
        if args.command in ("sfx", "all"):
            gen_sfx(args, manifest, cfg, api_key)
        if args.command in ("bgm", "all"):
            gen_bgm(args, manifest, cfg, api_key)
    except KeyboardInterrupt:
        sys.exit("\n中断しました。もう一度 実行すると、できた ファイルは とばして つづきから 作ります。")
    if FAILED:
        print(f"\n✖ {len(FAILED)} 件 失敗しました(ほかは 保存ずみ):")
        for f in FAILED:
            print(f"   - {f[:200]}")
        sys.exit("\nもう一度 実行すると 失敗した ものだけ 作りなおします。"
                 "(モデル名や パラメータは voices.json で 変更できます)")
    print("\nおわり! ゲームを ひらきなおすと 新しい 音が つかわれます。")


if __name__ == "__main__":
    main()
