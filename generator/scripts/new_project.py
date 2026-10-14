#!/usr/bin/env python3
"""Create a Personal University project folder.

Usage:
  new_project.py DIR --name "Atlas University" [--tagline "..."] [--issuer "..."] [--issuer-url URL]
                 [--pass 80] [--prefix AU] [--difficulty easy|medium|hard] [--quantity fewer|standard|more]
                 [--chapters 3-5] [--audience "a 12-year-old"] [--planned 6]

Writes DIR/university.json and an empty DIR/courses.json. Never overwrites an existing project.
"""
import argparse, json, re
from pathlib import Path
from common import DEFAULT_UNIVERSITY

BANNED = re.compile(r"\b(MBA|degree|accredited)\b", re.I)

ap = argparse.ArgumentParser()
ap.add_argument("dir")
ap.add_argument("--name", required=True)
ap.add_argument("--tagline")
ap.add_argument("--issuer")
ap.add_argument("--issuer-url", default="")
ap.add_argument("--pass", dest="passmark", type=float, default=70)
ap.add_argument("--prefix")
ap.add_argument("--difficulty", choices=["easy", "medium", "hard"], default="medium")
ap.add_argument("--quantity", choices=["fewer", "standard", "more"], default="standard")
ap.add_argument("--chapters", default="3-5", help="'3' or '3-5'")
ap.add_argument("--audience", default=DEFAULT_UNIVERSITY["audience"])
ap.add_argument("--planned", type=int, default=0, help="how many courses you plan in total (shows 'coming soon' cards)")
a = ap.parse_args()

for field in (a.name, a.tagline or "", a.issuer or ""):
    if BANNED.search(field) or "\u2014" in field:
        raise SystemExit(f"Please avoid 'MBA', 'degree', 'accredited' and em dashes in site copy: {field!r}")

root = Path(a.dir).expanduser().resolve()
if (root / "university.json").exists():
    raise SystemExit(f"Project already exists: {root}")
for sub in ("data", "assets", "logs", "site"):
    (root / sub).mkdir(parents=True, exist_ok=True)

lo, _, hi = a.chapters.partition("-")
prefix = a.prefix or "".join(w[0] for w in re.findall(r"[A-Za-z]+", a.name)[:3]).upper() or "PU"
uni = {**DEFAULT_UNIVERSITY,
       "name": a.name,
       "tagline": a.tagline or DEFAULT_UNIVERSITY["tagline"],
       "issuer": a.issuer or a.name,
       "issuerUrl": a.issuer_url,
       "passMark": a.passmark / 100 if a.passmark > 1 else a.passmark,
       "codePrefix": prefix,
       "audience": a.audience,
       "chapters": {"min": int(lo), "max": int(hi or lo)},
       "quiz": {"difficulty": a.difficulty, "quantity": a.quantity},
       "plannedCourses": a.planned}
(root / "university.json").write_text(json.dumps(uni, indent=2, ensure_ascii=False))
if not (root / "courses.json").exists():
    (root / "courses.json").write_text("{}\n")
print(f"Created {root}\n  university.json: {uni['name']}, pass mark {round(uni['passMark'] * 100)}%, "
      f"prefix {prefix}, chapters {uni['chapters']['min']}-{uni['chapters']['max']}, quiz {a.difficulty}")
print("Next: add courses to courses.json (see SKILL.md, step 3).")
