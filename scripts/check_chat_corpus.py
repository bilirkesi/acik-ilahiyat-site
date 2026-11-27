#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Soru-cevap korpuslarini denetler: `data/<slug>/chat.json`.

Kontroller (hata: cikis kodu 1, uyari: yalnizca yazilir):
- her ogede soru, cevap ve bolum numarasi var mi, bolum planin icinde mi;
- ayni ders icinde ayni soru iki kez gecmiyor mu;
- her ogede kaynak listesi var mi, cevaptaki [n] isaretleri bu listeye sigiyor mu, liste ogede
  dersin ust katman kaynagini (ders kitabini) iceriyor mu (uyari; `--strict` hataya cevirir);
- cevap bir yer tutucu ("bilmiyorum", "as an ai") degil mi;
- cevap 2-5 cumle araliginda mi (uyari), bolum basina en az bir soru var mi (uyari).

Kullanim (depo koku):
    py -3 scripts/check_chat_corpus.py               # tum dersler
    py -3 scripts/check_chat_corpus.py --slug x      # tek ders
    py -3 scripts/check_chat_corpus.py --quiet       # yalnizca sorunlar
    py -3 scripts/check_chat_corpus.py --strict      # ders kitabi kaynakta yoksa hata
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))
from common import course_slugs, load_university, source_tier  # noqa: E402

SLUGS = course_slugs(ROOT)
CITE = re.compile(r"\[(\d+(?:\s*[-,]\s*\d+)*)\]")
PLACEHOLDER = re.compile(r"\b(bilmiyorum|emin değilim|emin degilim|as an ai|i don'?t know)\b", re.I)
SENTENCE_END = re.compile(r"[.!?…](?=\s|$)")


def sentences(text: str) -> int:
    """Kaba cumle sayimi: sonu noktalama ile biten parcalar (kisaltmalar sayilmaz)."""
    body = re.sub(r"\b\d+\.\s", " ", str(text or ""))
    return len(SENTENCE_END.findall(body.strip()))


def cite_numbers(text: str) -> list[int]:
    """`[2]`, `[1, 3]`, `[1-3]` gibi isaretlerdeki numaralar."""
    out: list[int] = []
    for group in CITE.findall(str(text or "")):
        for part in group.split(","):
            part = part.strip()
            if "-" in part:
                a, b = part.split("-", 1)
                if a.strip().isdigit() and b.strip().isdigit():
                    lo, hi = int(a), int(b)
                    if 0 < hi - lo <= 20:
                        out.extend(range(lo, hi + 1))
            elif part.isdigit():
                out.append(int(part))
    return out


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip().casefold()


def has_top_source(sources, tiers) -> bool:
    """Kaynak listesinde en ust katman (ders kitabi) var mi?"""
    return any(source_tier(s, tiers) == 0 for s in sources)


def check_corpus(corpus: dict, chapters: int | None = None, tiers: list | None = None,
                 strict: bool = False) -> dict:
    """Bir korpusu denetler; {"errors": [...], "warnings": [...], "items": n} dondurur.

    `tiers` verilirse her ogenin kaynak listesinde en ust katman (ders kitabi) aranir: eksik bolum
    uyari olarak yazilir, `strict` ile hata olur.
    """
    errors: list[str] = []
    warnings: list[str] = []
    items = corpus.get("items") or []
    seen: dict[str, int] = {}
    per_chapter: dict[int, int] = {}
    missing_top: dict[int, int] = {}
    for i, it in enumerate(items, 1):
        tag = f"#{i}"
        q = str(it.get("q") or "").strip()
        a = str(it.get("a") or "").strip()
        ch = it.get("chapter")
        if not q:
            errors.append(f"{tag}: soru bos")
        if not a:
            errors.append(f"{tag}: cevap bos")
        if not isinstance(ch, int) or ch < 1:
            errors.append(f"{tag}: bolum numarasi yok")
        else:
            per_chapter[ch] = per_chapter.get(ch, 0) + 1
            if chapters and ch > chapters:
                errors.append(f"{tag}: bolum {ch}, plan {chapters} bolum")
        if q:
            key = normalize(q)
            if key in seen:
                errors.append(f"{tag}: soru tekrar ediyor (#{seen[key]})")
            else:
                seen[key] = i
        sources = it.get("sources") or []
        if not sources:
            errors.append(f"{tag}: kaynak yok")
        if sources:
            bad = [n for n in cite_numbers(a) if not 1 <= n <= len(sources)]
            if bad:
                errors.append(f"{tag}: atif {bad} kaynak listesinde yok ({len(sources)} kaynak)")
        if sources and tiers and isinstance(ch, int) and not has_top_source(sources, tiers):
            missing_top[ch] = missing_top.get(ch, 0) + 1
        if a and PLACEHOLDER.search(a):
            errors.append(f"{tag}: cevap yer tutucu iceriyor")
        n_sent = sentences(a)
        if a and not 2 <= n_sent <= 5:
            warnings.append(f"{tag}: cevap {n_sent} cumle (beklenen 2-5)")
        if a and len(a) < 40:
            warnings.append(f"{tag}: cevap cok kisa ({len(a)} karakter)")
    if missing_top:
        label = (tiers[0] or {}).get("label") or "tier 0"
        target = errors if strict else warnings
        for ch, n in sorted(missing_top.items()):
            target.append(f"bolum {ch}: {n} ogede ust katman kaynak yok: {label}")
    if chapters:
        for ch in range(1, chapters + 1):
            if ch not in per_chapter:
                warnings.append(f"bolum {ch}: soru yok")
    return {"errors": errors, "warnings": warnings, "items": len(items)}


def load(slug: str) -> tuple[dict | None, int | None]:
    path = ROOT / "data" / slug / "chat.json"
    if not path.exists():
        return None, None
    corpus = json.loads(path.read_text(encoding="utf-8-sig"))
    plan = ROOT / "data" / slug / "study_plan.json"
    chapters = None
    if plan.exists():
        try:
            chapters = len(json.loads(plan.read_text(encoding="utf-8-sig")).get("chapters") or [])
        except (json.JSONDecodeError, AttributeError):
            chapters = None
    return corpus, chapters


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--slug", action="append", help="yalnizca bu ders (tekrarlanabilir)")
    ap.add_argument("--quiet", action="store_true", help="uyarilari yazma")
    ap.add_argument("--strict", action="store_true",
                    help="kaynak listesinde ders kitabi yoksa hata ver")
    args = ap.parse_args()

    slugs = args.slug or SLUGS
    failed = False
    for slug in slugs:
        corpus, chapters = load(slug)
        if corpus is None:
            print(f"{slug}: chat.json yok")
            continue
        tiers = (load_university(ROOT, slug).get("grounding") or {}).get("tiers") or []
        res = check_corpus(corpus, chapters, tiers, args.strict)
        head = f"{slug}: {res['items']} soru"
        if res["errors"]:
            failed = True
            print(f"{head} · {len(res['errors'])} hata")
            for e in res["errors"][:40]:
                print("  HATA " + e)
        elif res["warnings"]:
            print(f"{head} · uyari var")
        else:
            print(f"{head} · temiz")
        if res["warnings"] and not args.quiet:
            for w in res["warnings"][:20]:
                print("  uyari " + w)
    print("Sorun yok." if not failed else "Hatalar var: yukaridaki satirlara bakin.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
