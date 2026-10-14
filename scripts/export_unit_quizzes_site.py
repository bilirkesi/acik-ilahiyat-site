#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""data/<slug>/unit_quizzes/unit-N.json -> site/unit_quizzes.js (window.UNIT_QUIZZES)"""
from __future__ import annotations

import hashlib
import json
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SLUGS = ["turk-dili-1", "ataturk-ilkeleri-1", "islam-mezhepleri-tarihi", "osmanlica-1"]


def shuffle_options(q: dict) -> dict:
    """NotebookLM doğru şıkkı hep başa koyuyor; şıkları soru metnine bağlı sabit bir sırayla karıştır."""
    opts = list(q.get("answerOptions") or [])
    seed = int(hashlib.sha256((q.get("question") or "").encode("utf-8")).hexdigest()[:16], 16)
    random.Random(seed).shuffle(opts)
    return {**q, "answerOptions": opts}


def main() -> int:
    out: dict[str, dict[str, dict]] = {}
    total_q = 0
    for slug in SLUGS:
        d = ROOT / "data" / slug / "unit_quizzes"
        if not d.is_dir():
            continue
        units: dict[str, dict] = {}
        for f in sorted(d.glob("unit-*.json")):
            try:
                data = json.loads(f.read_text(encoding="utf-8-sig"))
            except json.JSONDecodeError as e:
                print(f"skip {f}: {e}")
                continue
            qs = data.get("questions") or []
            if not qs:
                continue
            data["questions"] = [shuffle_options(q) for q in qs]
            units[str(data.get("unit") or f.stem.split("-")[-1])] = data
            total_q += len(qs)
        if units:
            out[slug] = units
    dest = ROOT / "site" / "unit_quizzes.js"
    dest.parent.mkdir(exist_ok=True)
    dest.write_text(
        "window.UNIT_QUIZZES = " + json.dumps(out, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    n = sum(len(v) for v in out.values())
    print(f"site/unit_quizzes.js: {len(out)} course(s), {n} unit quiz(es), {total_q} question(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
