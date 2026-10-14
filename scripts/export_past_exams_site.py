#!/usr/bin/env python3
"""data/<slug>/past_exams.json -> site/past_exams.js (window.PAST_EXAMS)

Çıkmış vize sorularına ünite/bölüm etiketi, cevap anahtarı ve
bölüm özeti temelli otomatik çözüm açıklaması ekler.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from coursegraph.past_exams import annotate_questions, unit_titles, unit_to_chapters  # noqa: E402

SLUGS = ["ataturk-ilkeleri-1", "turk-dili-1", "islam-mezhepleri-tarihi", "osmanlica-1"]


def load_plan(slug: str) -> dict:
    path = ROOT / "data" / slug / "study_plan.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8-sig"))


def chapter_meta(plan: dict, n: int) -> dict:
    chs = plan.get("chapters") or []
    if not (1 <= n <= len(chs)):
        return {"n": n, "title": f"Bölüm {n}", "summary": ""}
    ch = chs[n - 1]
    summary = (ch.get("summary") or "").strip()
    if len(summary) > 280:
        summary = summary[:277].rsplit(" ", 1)[0] + "..."
    return {"n": n, "title": ch.get("title") or f"Bölüm {n}", "summary": summary}


def build_solution(q: dict, correct_opt: dict | None, unit_title: str | None, ch_metas: list[dict]) -> str:
    letter = q.get("correct") or (correct_opt or {}).get("key") or ""
    text = (correct_opt or {}).get("text") or ""
    parts = [f"Doğru cevap: {letter}) {text}".strip()]
    if q.get("explanation"):
        parts[0] = parts[0].rstrip(".") + "."
        parts.append(q["explanation"])
    if unit_title:
        parts.append(f"Konu ünitesi: {unit_title}.")
    if ch_metas:
        titles = "; ".join(f"{m['n']}. {m['title']}" for m in ch_metas)
        parts.append(f"İlgili ders bölümleri: {titles}.")
        lead = next((m["summary"] for m in ch_metas if m.get("summary")), "")
        if lead:
            parts.append(f"Bu bölümün özeti: {lead}")
    return " ".join(parts)


def main() -> int:
    out: dict[str, list[dict]] = {}
    for slug in SLUGS:
        rows = annotate_questions(slug)
        if not rows:
            continue
        plan = load_plan(slug)
        titles = unit_titles(slug)
        ch_map = unit_to_chapters(slug)
        exams = []
        for exam in rows:
            qs = []
            for q in exam.get("questions") or []:
                u = q.get("unit")
                correct = q.get("correct")
                ch_nums = list(ch_map.get(u, []) if u else [])
                ch_metas = [chapter_meta(plan, n) for n in ch_nums]
                correct_opt = next(
                    (o for o in (q.get("options") or []) if o.get("key") == correct),
                    None,
                )
                opts = []
                for o in q.get("options") or []:
                    oi = dict(o)
                    is_c = bool(o.get("isCorrect")) or (correct is not None and o.get("key") == correct)
                    oi["isCorrect"] = is_c
                    if is_c:
                        oi["rationale"] = build_solution(
                            {"correct": correct, "explanation": q.get("explanation")}, oi,
                            titles.get(u) if u else None, ch_metas
                        )
                    opts.append(oi)
                unit_title = titles.get(u) if u else None
                solution = build_solution(q, correct_opt, unit_title, ch_metas)
                qs.append(
                    {
                        "n": q.get("n") or q.get("index"),
                        "stem": q.get("stem") or "",
                        "options": opts,
                        "correct": correct,
                        "unit": u,
                        "unitTitle": unit_title,
                        "chapters": ch_nums,
                        "chapterMeta": ch_metas,
                        "solution": solution,
                        "keywords": (q.get("keywords") or [])[:6],
                    }
                )
                if q.get("stemParts"):  # Arap harfli gövde görselleri (Osmanlıca)
                    qs[-1]["stemParts"] = q["stemParts"]
            has_key = any(q.get("correct") for q in qs)
            exams.append(
                {
                    "exam_id": exam.get("exam_id"),
                    "year": exam.get("year"),
                    "term": exam.get("term"),
                    "group": exam.get("group"),
                    "file": exam.get("file"),
                    "hasAnswerKey": has_key,
                    "questions": qs,
                }
            )
        out[slug] = exams

    site = ROOT / "site"
    site.mkdir(exist_ok=True)
    payload = "window.PAST_EXAMS = " + json.dumps(out, ensure_ascii=False) + ";\n"
    (site / "past_exams.js").write_text(payload, encoding="utf-8")
    n = sum(len(e["questions"]) for rows in out.values() for e in rows)
    sol = sum(1 for rows in out.values() for e in rows for q in e["questions"] if q.get("solution"))
    print(f"site/past_exams.js: {len(out)} course(s), {n} question(s), {sol} with solution")
    return 0


if __name__ == "__main__":
    sys.exit(main())
