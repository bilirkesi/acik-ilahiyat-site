#!/usr/bin/env python3
"""Report how authoritative each chapter's sources are, using the `grounding.tiers` ranking in university.json.

For every course it reads `data/<slug>/state.json` (the notebook's sources) and `study_plan.json`, then prints,
per chapter, the tier of each assigned source and of the citations in `grounding.references`. A chapter is
flagged WEAK when none of its sources is top tier (the textbook); generation scripts then add the textbook via
`with_authority`, but only if the notebook has one, which the course line reports.

Usage (repo root):
    py -3 scripts/audit_sources.py                  # all courses
    py -3 scripts/audit_sources.py turk-dili-1      # one course
    py -3 scripts/audit_sources.py --strict         # exit 1 if a course has no textbook source
"""
import argparse
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))
from common import load_university, source_tier  # noqa: E402

SLUGS = ["turk-dili-1", "ataturk-ilkeleri-1", "islam-mezhepleri-tarihi", "osmanlica-1"]


def read(path):
    return json.loads(path.read_text(encoding="utf-8-sig")) if path.exists() else {}


def audit(slug, tiers):
    """Return {"slug", "sources": Counter of tier names, "has_top", "chapters": [...]} for one course."""
    names = [t["label"] for t in tiers] + ["unranked"]
    d = ROOT / "data" / slug
    srcs = [s for s in read(d / "state.json").get("sources", {}).values() if s.get("status", "ready") == "ready"]
    tier = {s.get("id"): source_tier(s, tiers) for s in srcs}
    chapters = []
    for i, ch in enumerate(read(d / "study_plan.json").get("chapters", []), 1):
        assigned = [tier.get(sid, len(tiers)) for sid in ch.get("source_ids", [])]
        cited = [tier.get(r.get("source_id"), len(tiers)) for r in (ch.get("grounding") or {}).get("references", [])]
        chapters.append({"chapter": i, "title": ch.get("title", ""),
                         "assigned": Counter(names[t] for t in assigned),
                         "cited": Counter(names[t] for t in cited),
                         "weak": 0 not in assigned})
    return {"slug": slug, "sources": Counter(names[t] for t in tier.values()),
            "has_top": 0 in tier.values(), "chapters": chapters}


def fmt(counter):
    return ", ".join(f"{n} x{c}" for n, c in counter.most_common()) or "-"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slugs", nargs="*")
    ap.add_argument("--strict", action="store_true", help="exit 1 when a course notebook has no top-tier source")
    args = ap.parse_args()
    tiers = (load_university(ROOT).get("grounding") or {}).get("tiers") or []
    if not tiers:
        sys.exit("university.json has no grounding.tiers; nothing to audit.")
    missing = []
    for slug in args.slugs or SLUGS:
        r = audit(slug, tiers)
        flag = "" if r["has_top"] else f"  << no '{tiers[0]['label']}' source in the notebook"
        print(f"\n== {slug}: {fmt(r['sources'])}{flag}")
        for ch in r["chapters"]:
            mark = "WEAK " if ch["weak"] else "ok   "
            print(f"  {mark}ch{ch['chapter']} {ch['title'][:50]}")
            print(f"        assigned: {fmt(ch['assigned'])}")
            if ch["cited"]:
                print(f"        cited:    {fmt(ch['cited'])}")
        if not r["has_top"]:
            missing.append(slug)
    if args.strict and missing:
        sys.exit(f"\nno top-tier source: {', '.join(missing)}")


if __name__ == "__main__":
    main()
