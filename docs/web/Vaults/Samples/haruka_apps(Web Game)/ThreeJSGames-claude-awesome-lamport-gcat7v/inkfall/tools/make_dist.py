#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
INKFALL — Wavedash 登録用の dist/ と ZIP を作る
© 2026 haruka_apps

  python3 tools/make_dist.py
    → dist/(Wavedash の upload_dir)と artifacts/inkfall-wavedash-YYYYMMDD.zip

ZIP の直下に index.html が来るようにまとめます。
ツール・テスト・秘密情報(.env / credentials.json)は含めません。
Wavedash の SDK は本番では自動で注入されるので含めません。
"""
import datetime
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ART = ROOT / "artifacts"
INCLUDE = ["index.html", "css", "js", "data", "assets", "vendor", "CREDITS.md"]
SKIP_NAMES = {".DS_Store", ".gitkeep", ".env", "credentials.json"}


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    count = 0
    for item in INCLUDE:
        src = ROOT / item
        if src.is_dir():
            for f in src.rglob("*"):
                if f.is_file() and f.name not in SKIP_NAMES:
                    dst = DIST / f.relative_to(ROOT)
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(f, dst)
                    count += 1
        elif src.exists():
            shutil.copy2(src, DIST / item)
            count += 1
    ART.mkdir(exist_ok=True)
    name = f"inkfall-wavedash-{datetime.date.today():%Y%m%d}.zip"
    out = ART / name
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(DIST.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(DIST).as_posix())
    size = out.stat().st_size / 1024 / 1024
    print(f"dist/: {count} files")
    print(f"ZIP : {out.relative_to(ROOT)} ({size:.1f} MB)")
    with zipfile.ZipFile(out) as z:
        assert "index.html" in z.namelist(), "index.html must be at the ZIP root"
        assert not any(n.endswith((".env", "credentials.json")) for n in z.namelist())
    print("OK: index.html is at the ZIP root, no secrets included.")


if __name__ == "__main__":
    main()
