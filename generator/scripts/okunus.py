#!/usr/bin/env python3
"""Osmanlıca sesli okunuş sözlüğünün eksiklerini listeler.

Kullanım: python3 generator/scripts/okunus.py PROJE SLUG [--ekle]

data/SLUG/*.json içindeki Arap harfli dizilerden data/SLUG/okunus.json'da olmayanları, yanındaki
metinden tahmin edilen okunuşla birlikte yazar. --ekle tahmini olanları sözlüğe ekler; eklenenleri
gözden geçirip yanlışları düzeltin. Site, sözlükteki okunuşu cihazın Türkçe sesiyle okur.
"""
import json
import re
import sys
from pathlib import Path

AR = "؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿"
RUN = re.compile(f"[{AR}]+(?:[\\s{AR}]*[{AR}])?")
WORD = "a-zçğıöşüâîûñ'’\\-"


def guess(before, after):
    """Dizinin hemen ardındaki "(okunuş)" ya da Latin kelime, yoksa önündeki **kalın** ya da düz kelime."""
    m = re.match(r"\s?\(\s*([^()؀-ۿ]+?)\s*\)", after)
    if m and not m.group(1).startswith("-"):
        return m.group(1)
    m = re.match(f" ([{WORD}]+)(?=[\\s·,.;:)/]|$)", after)
    if m:
        return m.group(1)
    m = re.search(r"\*\*([^*؀-ۿ]+)\*\*\s?$", before)
    if m:
        return m.group(1)
    m = re.search(f"(?:^|[\\s(·])([{WORD}]+) $", before)
    return m.group(1) if m else ""


def strings(x):
    if isinstance(x, dict):
        for v in x.values():
            yield from strings(v)
    elif isinstance(x, list):
        for v in x:
            yield from strings(v)
    elif isinstance(x, str):
        yield x


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    d = Path(sys.argv[1]) / "data" / sys.argv[2]
    path = d / "okunus.json"
    known = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    found = {}
    for f in sorted(d.glob("*.json")):
        if f.name == "okunus.json":
            continue
        for s in strings(json.loads(f.read_text(encoding="utf-8"))):
            for m in RUN.finditer(s):
                k = m.group()
                if k not in known and not found.get(k):
                    found[k] = guess(s[max(0, m.start() - 60):m.start()], s[m.end():m.end() + 60])
    for k, v in found.items():
        print(f"{k}\t{v or '?'}")
    print(f"{len(known)} kayıtlı, {len(found)} eksik ({sum(1 for v in found.values() if v)} tahminli).", file=sys.stderr)
    if "--ekle" in sys.argv:
        known.update({k: v for k, v in found.items() if v})
        path.write_text(json.dumps(dict(sorted(known.items())), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
