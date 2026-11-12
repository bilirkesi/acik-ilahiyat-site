#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""data/<slug>/chat.json -> site/chat.js (window.CHAT)

Korporus, NotebookLM ile uretilmis soru-cevap ciftlerini icerir; site bunu yerel getirme ile
kullanir (site statiktir, tarayici NotebookLM'e canli soramaz).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))
from common import course_slugs  # noqa: E402

SLUGS = course_slugs(ROOT)


def main() -> int:
    out: dict[str, dict] = {}
    total = 0
    for slug in SLUGS:
        f = ROOT / "data" / slug / "chat.json"
        if not f.exists():
            continue
        try:
            data = json.loads(f.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError as e:
            print(f"skip {f}: {e}")
            continue
        items = [it for it in (data.get("items") or [])
                 if it.get("q") and it.get("a") and it.get("chapter")]
        if not items:
            continue
        out[slug] = {
            "language": data.get("language") or "tr",
            "items": [{
                "chapter": it["chapter"],
                "title": it.get("chapterTitle", ""),
                "q": it["q"],
                "a": it["a"],
                "sources": it.get("sources") or [],
            } for it in items],
        }
        total += len(items)
    dest = ROOT / "site" / "chat.js"
    dest.parent.mkdir(exist_ok=True)
    # newline="\n": paket her platformda ayni baytlari uretsin (Windows'ta varsayilan CRLF olur).
    with open(dest, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("window.CHAT = " + json.dumps(out, ensure_ascii=False) + ";\n")
    print(f"site/chat.js: {len(out)} course(s), {total} question(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
