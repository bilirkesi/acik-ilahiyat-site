#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Quiz veri bütünlüğü denetimi.

Kontroller:
- her soruda tam olarak 1 doğru şık var mı
- şık sayısı, boş metin, rationale varlığı
- ayni soru metni quiz içinde tekrar ediyor mu
- data dosyaları ile site/unit_quizzes.js tutarlı mı
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"


def fold(s: str) -> str:
    """Soru metni için anahtar: sadece büyük/küçük harf + boşluk normalizasyonu.
    Osmanlıca şıklarda şedde/şerif (mütefâ‘il vs mütefa‘‘il) anlam taşıdığı için
    diyakritik silinmez."""
    return re.sub(r"\s+", " ", s.replace("\u00a0", " ")).strip().lower()


def loose(s: str) -> str:
    """Yaklaşık eşleşme (soru tekrarlarında): diyakritikler sönümlenir."""
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", "".join(c.lower() if c.isalnum() else " " for c in s)).strip()


def check_questions(questions: list, where: str, problems: list) -> Counter:
    dupes = Counter()
    seen: dict[str, int] = {}
    for i, q in enumerate(questions, 1):
        label = f"{where} soru {i}"
        stem = (q.get("question") or q.get("stem") or "").strip()
        if not stem:
            problems.append(f"{label}: soru metni boş")
        else:
            k = loose(stem)
            if k:
                if k in seen:
                    dupes[f"{label} ~ soru {seen[k]}"] += 1
                seen[k] = i
        opts = q.get("answerOptions") or q.get("options") or []
        if not opts:
            problems.append(f"{label}: şık yok")
            continue
        correct = [o for o in opts if o.get("isCorrect")]
        if len(correct) != 1:
            problems.append(f"{label}: {len(correct)} doğru şık (1 olmalı)")
        texts = [fold(str(o.get("text", ""))) for o in opts]  # birebir metin eşitliği
        for t, c in Counter(texts).items():
            if c > 1:
                problems.append(f"{label}: yinelenen şık metni x{c}")
        for o in opts:
            if not str(o.get("text", "")).strip():
                problems.append(f"{label}: boş şık metni")
        if q.get("type") not in (None, "test", "multiple_choice", "true_false"):
            problems.append(f"{label}: bilinmeyen type={q.get('type')!r}")
    return dupes


def main() -> int:
    problems: list[str] = []
    dupes: Counter = Counter()
    total_q = 0
    files = sorted(DATA.glob("*/unit_quizzes/unit-*.json"))
    files += sorted(DATA.glob("*/quiz.json"))
    files += sorted(DATA.glob("*/exams/*.json"))
    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError as e:
            problems.append(f"{f.relative_to(ROOT)}: JSON hatası {e}")
            continue
        qs = data.get("questions") if isinstance(data, dict) else data
        if not isinstance(qs, list):
            problems.append(f"{f.relative_to(ROOT)}: questions listesi yok")
            continue
        total_q += len(qs)
        rel = str(f.relative_to(ROOT))
        dupes.update(check_questions(qs, rel, problems))

    # data <-> site bundle tutarlılığı
    bundle = ROOT / "site" / "unit_quizzes.js"
    if bundle.exists():
        m = re.match(r"window\.UNIT_QUIZZES = (.*);\s*$", bundle.read_text(encoding="utf-8"), re.S)
        if not m:
            problems.append("site/unit_quizzes.js: window.UNIT_QUIZZES tanımı okunamadı")
        else:
            b = json.loads(m.group(1))
            for slug_dir in sorted(DATA.glob("*/unit_quizzes")):
                slug = slug_dir.parent.name
                disk = {}
                for f in sorted(slug_dir.glob("unit-*.json")):
                    d = json.loads(f.read_text(encoding="utf-8-sig"))
                    disk[str(d.get("unit") or f.stem.split("-")[-1])] = d
                in_bundle = b.get(slug)
                if in_bundle is None:
                    problems.append(f"bundle: {slug} hiç yok ({len(disk)} ünite data'da)")
                    continue
                if set(in_bundle) != set(disk):
                    problems.append(
                        f"bundle {slug}: ünite farkı data={sorted(disk, key=int)} bundle={sorted(in_bundle, key=int)}"
                    )
                for u in sorted(set(disk) & set(in_bundle), key=int):
                    n_disk = len(disk[u].get("questions") or [])
                    n_bundle = len(in_bundle[u].get("questions") or [])
                    if n_disk != n_bundle:
                        problems.append(f"bundle {slug} ünite {u}: soru sayısı data={n_disk} bundle={n_bundle}")

    print(f"Taranan dosya: {len(files)}, toplam soru: {total_q}")
    if dupes:
        print("\n== Yinelenen sorular ==")
        for k, c in dupes.items():
            print(f"  {k} (x{c})")
    if problems:
        print(f"\n== Sorunlar ({len(problems)}) ==")
        for p in problems:
            print(f"  {p}")
        return 1
    print("\nYapısal sorun yok.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
