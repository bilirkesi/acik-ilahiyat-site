#!/usr/bin/env python3
"""Check a built Personal University site before sharing it.

Usage: qa.py PROJECT

FAIL (exit 1): em dashes anywhere in the site, 'MBA' / 'degree' / 'accredited' in the site chrome or
university.json, a chapter image that is referenced but missing, a course with no quiz or no chapters,
a missing disclaimer, the university name or pass mark not applied.
WARN: banned words inside course data (often fine, e.g. '45 degrees' in a math quiz; read them),
plan validation issues, chapters without notes or images, quiz questions of unknown type.
"""
import json, re, sys
from common import Project

BANNED = re.compile(r"\b(MBA|degrees?|accredited)\b", re.I)
GRADED = {"multiple_choice", "multiple_select", "fill_in_the_blank", "short_answer"}

proj = Project(sys.argv[1]) if len(sys.argv) > 1 else sys.exit(__doc__)
site = proj.root / "site"
fails, warns = [], []

js = (site / "data.js").read_text() if (site / "data.js").exists() else sys.exit("No site/data.js. Run build.py first.")
# data.js birden fazla global içerir (UNIVERSITY, COURSES, OFFLINE); her birini sırayla çöz.
dec = json.JSONDecoder()


def js_global(name):
    prefix = f"window.{name} = "
    i = js.index(prefix)
    obj, _ = dec.raw_decode(js, i + len(prefix))
    return obj


try:
    uni, courses = js_global("UNIVERSITY"), js_global("COURSES")
except (ValueError, json.JSONDecodeError):
    sys.exit("data.js does not have the expected shape")

for name in ("index.html", "app.js", "styles.css", "data.js"):
    text = (site / name).read_text()
    if "\u2014" in text:
        fails.append(f"em dash in {name} ({text.count(chr(0x2014))}x)")
for name in ("index.html", "app.js"):
    for hit in BANNED.findall((site / name).read_text()):
        fails.append(f"banned word '{hit}' in {name}")
for k in ("name", "tagline", "issuer"):
    if BANNED.search(str(uni.get(k, ""))):
        fails.append(f"banned word in university.json {k}: {uni[k]!r}")

page = (site / "index.html").read_text()
if "{{" in page:
    fails.append("unfilled placeholder in index.html")
if uni["name"] not in page.replace("&amp;", "&").replace("&#x27;", "'"):
    fails.append("university name not applied to index.html")
if "ilişkilendirilen değildir" not in page and "not affiliated with" not in page:
    fails.append("disclaimer footer missing")
if abs(uni["passMark"] - proj.uni["passMark"]) > 1e-9:
    fails.append(f"pass mark mismatch: site {uni['passMark']} vs config {proj.uni['passMark']}")
if not courses:
    fails.append("no courses on the site (run the manifest stage)")

for c in courses:
    tag = c["slug"]
    if not c["chapters"]:
        fails.append(f"{tag}: no chapters")
    if not c["quiz"]:
        fails.append(f"{tag}: no quiz questions")
    types = {q.get("type") for q in c["quiz"]} - GRADED
    if types:
        warns.append(f"{tag}: unknown quiz types {types} (shown as reflection questions)")
    for i, ch in enumerate(c["chapters"], 1):
        if ch["image"] and not (site / ch["image"]).exists():
            fails.append(f"{tag} ch{i}: image {ch['image']} missing")
        if not ch["image"]:
            warns.append(f"{tag} ch{i}: no infographic")
        if not ch["notes"]:
            warns.append(f"{tag} ch{i}: no study notes (ground stage)")
        if not ch["lectures"]:
            warns.append(f"{tag} ch{i}: no sources mapped")
    plan = json.loads((proj.root / "data" / tag / "study_plan.json").read_text())
    bad = {k: v for k, v in plan.get("validation", {}).items() if v}
    if bad:
        warns.append(f"{tag}: plan validation {bad}")
    blob = json.dumps(c, ensure_ascii=False)
    for mm in BANNED.finditer(blob):
        ctx = blob[max(0, mm.start() - 50): mm.end() + 50].replace("\n", " ")
        warns.append(f"{tag}: '{mm.group(0)}' in course data: ...{ctx}...")

print(f"{uni['name']}: {len(courses)} course(s), pass mark {round(uni['passMark'] * 100)}%, "
      f"{sum(len(c['chapters']) for c in courses)} chapters, {sum(len(c['quiz']) for c in courses)} questions")
for w in warns:
    print("WARN", w)
for f in fails:
    print("FAIL", f)
print("QA passed" if not fails else f"QA failed: {len(fails)} problem(s)")
sys.exit(1 if fails else 0)
