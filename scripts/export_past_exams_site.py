#!/usr/bin/env python3
"""data/<slug>/past_exams.json -> site/past_exams.js (window.PAST_EXAMS)

Çıkmış vize sorularına ünite/bölüm etiketi ekler (coursegraph.past_exams).
OCR seçenekleri eksik olabilir; site self-graded anımsama modu kullanır.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from coursegraph.past_exams import UNIT_TITLES, UNIT_TO_CHAPTERS, annotate_questions  # noqa: E402

SLUGS = ["ataturk-ilkeleri-1", "turk-dili-1", "islam-mezhepleri-tarihi"]


def main() -> int:
    out: dict[str, list[dict]] = {}
    for slug in SLUGS:
        rows = annotate_questions(slug)
        if not rows:
            continue
        exams = []
        for exam in rows:
            qs = []
            for q in exam.get("questions") or []:
                u = q.get("unit")
                qs.append(
                    {
                        "n": q.get("n") or q.get("index"),
                        "stem": q.get("stem") or "",
                        "options": q.get("options") or [],
                        "unit": u,
                        "unitTitle": UNIT_TITLES.get(u) if u else None,
                        "chapters": UNIT_TO_CHAPTERS.get(u, []) if u else [],
                        "keywords": (q.get("keywords") or [])[:6],
                    }
                )
            exams.append(
                {
                    "exam_id": exam.get("exam_id"),
                    "year": exam.get("year"),
                    "term": exam.get("term"),
                    "file": exam.get("file"),
                    "questions": qs,
                }
            )
        out[slug] = exams

    site = ROOT / "site"
    site.mkdir(exist_ok=True)
    payload = "window.PAST_EXAMS = " + json.dumps(out, ensure_ascii=False) + ";\n"
    (site / "past_exams.js").write_text(payload, encoding="utf-8")
    n = sum(len(e["questions"]) for rows in out.values() for e in rows)
    print(f"site/past_exams.js: {len(out)} course(s), {n} question(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
