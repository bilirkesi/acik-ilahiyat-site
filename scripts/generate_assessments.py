#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bir dersin bölümlerinden ünite quizleri ve pratik sınavlar üretir.

AÖF dersleri `generate_unit_quizzes.py` ile çıkmış vize sorularından ve ders kitabından
beslenir. Bu script defterin kendi kaynaklarından beslenen dersler içindir: her bölüm için
bölümün kendi kaynaklarına sınırlı bir quiz, sonra vize / final / yaz-kursu pratik sınavları.

Kullanım (depo kökü):
    py -3 scripts/generate_assessments.py <slug>            # hepsi
    py -3 scripts/generate_assessments.py <slug> --only 3   # sadece 3. bölümün ünite quizi
    py -3 scripts/generate_assessments.py <slug> --force    # var olanları yeniden üret
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "generator" / "scripts"))

from common import (cli_language, find_cli, grounding_rules, language_code, load_university,  # noqa: E402
                    normalize_quiz_questions, require_cli, with_authority)
from scripts.generate_unit_quizzes import download_quiz, normalize_quiz  # noqa: E402

LIMIT_HINTS = re.compile(r"limit|quota|rate.?limit|too many|capacity", re.I)

# Pratik sınavlar: id -> (başlık, açıklama, soru sayısı, kapsam)
EXAMS = {
    "vize": ("Midterm Assessment", "Covers the first half of the program.", 20, "first half"),
    "final": ("Final Assessment", "Covers the whole program.", 25, "whole"),
    "yaz-kursu": ("Practical Assessment", "Scenario questions across the whole program.", 20, "whole"),
}


def run(args, timeout=1200):
    p = subprocess.run(args, capture_output=True, text=True, encoding="utf-8",
                       errors="replace", timeout=timeout)
    return p.returncode, p.stdout or "", p.stderr or ""


def generate_quiz(cli, nb: str, desc: str, source_ids: list[str], attempts: int = 3):
    """One `generate quiz` call; returns the artifact id."""
    args = [cli, "generate", "quiz", desc, "-n", nb,
            "--quantity", "more", "--difficulty", "medium",
            "--wait", "--timeout", "900", "--retry", "1", "--json"]
    for sid in source_ids:
        args.extend(["-s", sid])
    last = ""
    for attempt in range(1, attempts + 1):
        code, out, err = run(args, timeout=1500)
        decoder = json.JSONDecoder()
        data = None
        for i, ch in enumerate(out):
            if ch != "{":
                continue
            try:
                obj, _ = decoder.raw_decode(out[i:])
            except json.JSONDecodeError:
                continue
            if isinstance(obj, dict):
                data = obj
                break
        if data:
            aid = data.get("artifact_id") or data.get("task_id") or (data.get("artifact") or {}).get("id")
            status = data.get("status") or ""
            if aid and status not in ("failed", "error"):
                return aid, status
            last = f"status={status} {json.dumps(data)[:200]}"
        else:
            last = (err or out)[-400:]
        if LIMIT_HINTS.search(last):
            print(f"    usage limit? {last[:160]}", flush=True)
            time.sleep(420)
        elif attempt < attempts:
            time.sleep(20 * attempt)
    raise RuntimeError(f"generate failed: {last}")


def chapter_sources(ch, sources, tiers):
    """The chapter's own sources plus the top-tier ones when it has none of its own."""
    return with_authority(ch.get("source_ids", []), sources, tiers)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("--only", type=int, help="only this chapter's unit quiz")
    ap.add_argument("--force", action="store_true", help="regenerate what already exists")
    ap.add_argument("--attempts", type=int, default=3)
    args = ap.parse_args()

    d = ROOT / "data" / args.slug
    plan = json.loads((d / "study_plan.json").read_text(encoding="utf-8-sig"))
    state = json.loads((d / "state.json").read_text(encoding="utf-8-sig"))
    uni = load_university(ROOT, args.slug)
    tiers = (uni.get("grounding") or {}).get("tiers") or []
    rules = grounding_rules(uni)
    lang = uni.get("language") or "English"
    nb = state.get("notebook_id")
    if not nb:
        sys.exit(f"{args.slug}: state.json has no notebook_id")
    cli = find_cli() or require_cli()
    lang = language_code(uni)
    sources = [s for s in state.get("sources", {}).values() if s.get("status") == "ready"]
    chapters = plan.get("chapters", [])

    tmp = ROOT / "artifacts" / "quiz-drafts" / args.slug
    tmp.mkdir(parents=True, exist_ok=True)
    out_dir = d / "unit_quizzes"
    out_dir.mkdir(parents=True, exist_ok=True)

    # ---- unit quizzes: one per chapter ----
    for n, ch in enumerate(chapters, 1):
        if args.only and n != args.only:
            continue
        dest = out_dir / f"unit-{n}.json"
        if dest.exists() and not args.force:
            print(f"  unit {n}: exists, skipped", flush=True)
            continue
        ids = chapter_sources(ch, sources, tiers)
        desc = (
            f"Chapter {n}: {ch['title']}. "
            "Write 10 to 15 multiple choice questions that measure exactly the objectives of this chapter. "
            "Every question has four options, exactly one correct option, a short rationale and a hint. "
            "Keep every question inside this chapter's scope and do not repeat another chapter's material. "
            "Use the terminology of the sources and name the version a fact belongs to when the sources "
            f"distinguish versions. Write every question, option, rationale and hint in {lang}. "
            + rules
        )
        print(f"  unit {n}: {ch['title'][:60]} ({len(ids)} sources)", flush=True)
        with cli_language(cli, lang):
            aid, _ = generate_quiz(cli, nb, desc, ids, attempts=args.attempts)
        raw = tmp / f"unit-{n}.json"
        download_quiz(nb, aid, raw)
        data = normalize_quiz(raw, n, ch["title"], title_prefix="Unit")
        if not data.get("questions"):
            print(f"  unit {n}: no questions came back, skipped", flush=True)
            continue
        dest.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  unit {n}: {len(data['questions'])} questions -> {dest.name}", flush=True)

    # ---- practice exams ----
    exam_dir = d / "exams"
    exam_dir.mkdir(parents=True, exist_ok=True)
    half = max(1, len(chapters) // 2)
    for eid, (title, descr, count, scope) in EXAMS.items():
        dest = exam_dir / f"{eid}.json"
        if dest.exists() and not args.force:
            print(f"  exam {eid}: exists, skipped", flush=True)
            continue
        if scope == "first half":
            picked = chapters[:half]
            scope_note = f"only the first {half} chapters"
        else:
            picked = chapters
            scope_note = "every chapter"
        ids = []
        for ch in picked:
            for sid in chapter_sources(ch, sources, tiers):
                if sid not in ids:
                    ids.append(sid)
        desc = (
            f"{title}. Cover {scope_note}. "
            f"Write {count} multiple choice questions with four options each, exactly one correct option, "
            "a short rationale, a hint and a step by step solution per question. "
            "Distribute the questions evenly over the chapters. "
            "Use the terminology of the sources and name the version a fact belongs to when the sources "
            f"distinguish versions. Write every question, option, rationale, hint and solution in {lang}. "
            + rules
        )
        print(f"  exam {eid}: {title} ({len(ids)} sources)", flush=True)
        with cli_language(cli, lang):
            aid, _ = generate_quiz(cli, nb, desc, ids, attempts=args.attempts)
        raw = tmp / f"exam-{eid}.json"
        download_quiz(nb, aid, raw)
        try:
            rawdata = json.loads(raw.read_text(encoding="utf-8-sig"))
        except json.JSONDecodeError:
            print(f"  exam {eid}: download is not json, skipped", flush=True)
            continue
        qs = rawdata.get("questions") if isinstance(rawdata, dict) else rawdata
        if isinstance(qs, dict):
            qs = qs.get("questions") or []
        exam = {
            "id": eid,
            "type": eid,
            "title": title,
            "description": descr,
            "exam_window": "midterm" if eid == "vize" else ("summer" if eid == "yaz-kursu" else "final"),
            "pass_mark": 0.7,
            "questions": [],
        }
        normalized = normalize_quiz_questions(qs, default_type="test", extra=("solution",))
        for i, item in enumerate(normalized):
            # sorular bolumlere dengeli dagitildigi icin siradan bolumu etiketle
            ch_no = min(len(picked), max(1, (i + 1) * len(picked) // len(normalized)))
            item["points"] = 1
            item["tags"] = [f"chapter-{ch_no}"]
        exam["questions"] = normalized
        if not exam["questions"]:
            print(f"  exam {eid}: no questions came back, skipped", flush=True)
            continue
        dest.write_text(json.dumps(exam, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  exam {eid}: {len(exam['questions'])} questions -> {dest.name}", flush=True)

    return 0


if __name__ == "__main__":
    sys.exit(main())
