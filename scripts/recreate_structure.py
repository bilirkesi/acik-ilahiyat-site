#!/usr/bin/env python3
"""Manifest'ten (ham satır listesi) ünite yapısını çıkarır.

Yapı sezgisi:
- İlk satır(lar) ünite başlığı (ÜNİTE n ...).
- Ardından içerik blokları: kalın başlık satırı + altında gövde satır(lar)ı.
- Bazı satırlar tek başına duran yıl/etiket satırıdır (zaman çizelgesi).
"""
import json
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Selahattin\NotebookProjects\acik-ilahiyat-poc")
NL = ROOT / "artifacts" / "nlm-infographics"
OUT = NL / "recreate"

# Kısa, büyük harfli, nokta içermeyen satırlar "başlık" adayı.
HEAD_RE = re.compile(r"^[^.]*(?:[A-ZÇĞİÖŞÜ]{3,}|[a-zçğıöşü]{3,}\s+[A-ZÇĞİÖŞÜ])[^.]*$")
YEARISH = re.compile(r"\b(?:MS\s*)?\d{3,4}\b|\b\d{1,2}\.\s")


def classify_unit(lines):
    title_lines = []
    i = 0
    while i < len(lines) and (
        "ÜNİTE" in lines[i].upper() or (title_lines and len(lines[i]) > 12)
        and i < 2 and not YEARISH.search(lines[i])
    ):
        title_lines.append(lines[i])
        i += 1
        if i >= 3:
            break
    blocks = []
    cur = None
    for ln in lines[i:]:
        is_head = (
            len(ln) <= 60
            and not ln.endswith((".", ",", ";", ":"))
            and (ln.isupper() or HEAD_RE.match(ln))
        )
        if is_head:
            if cur:
                blocks.append(cur)
            cur = {"head": ln, "body": []}
        else:
            if cur is None:
                cur = {"head": "", "body": []}
            cur["body"].append(ln)
    if cur:
        blocks.append(cur)
    return title_lines, blocks


def main():
    manifest = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    out = []
    for m in manifest:
        title, blocks = classify_unit(m["lines"])
        out.append(
            {
                "slug": m["slug"],
                "unit": m["unit"],
                "title": title,
                "blocks": blocks,
                "n_blocks": len(blocks),
            }
        )
    (OUT / "structure.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    for o in out:
        print(o["slug"], o["unit"], "title:", o["title"][:1], "blocks:", o["n_blocks"])


if __name__ == "__main__":
    main()
