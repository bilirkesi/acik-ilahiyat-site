#!/usr/bin/env python3
"""Regenerate specific chapter infographics after visual QA.

Usage: redo.py PROJECT SLUG N [N ...]

The bad PNG moves to assets/<slug>/rejected/ (never deleted), its saved artifact id is cleared,
then the pipeline regenerates only those chapters and refreshes the manifest. Uses AI usage: one
generation per chapter.
"""
import json, subprocess, sys, time
from pathlib import Path
from common import Project

if len(sys.argv) < 4:
    sys.exit(__doc__)
proj, slug, nums = Project(sys.argv[1]), sys.argv[2], [int(n) for n in sys.argv[3:]]
assets = proj.assets(slug)
rejected = assets / "rejected"
rejected.mkdir(exist_ok=True)
state_path = proj.root / "data" / slug / "state.json"
st = json.loads(state_path.read_text())
for n in nums:
    f = assets / f"chapter-{n}.png"
    if f.exists():
        f.rename(rejected / f"chapter-{n}-{time.strftime('%Y%m%d-%H%M%S')}.png")
    for jpg in (proj.root / "site" / "assets" / slug).glob(f"chapter-{n}.*"):
        jpg.unlink()  # derived copy only; the build recreates it from the new PNG
    st.setdefault("infographics", {}).pop(f"infographic-{n}", None)
    st.setdefault("tries", {}).pop(f"infographic-{n}", None)
state_path.write_text(json.dumps(st, indent=2, ensure_ascii=False))
here = Path(__file__).resolve().parent
py = sys.executable
rc = subprocess.call([py, str(here / "pipeline.py"), str(proj.root), slug, "infographics",
                      "--chapters", ",".join(map(str, nums))])
subprocess.call([py, str(here / "pipeline.py"), str(proj.root), slug, "manifest"])
sys.exit(rc)
