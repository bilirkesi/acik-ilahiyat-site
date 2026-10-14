#!/usr/bin/env python3
"""Contact sheet of a course's chapter infographics, for visual QA.

Usage: sheet.py PROJECT SLUG [OUT.jpg]   (default OUT: PROJECT/logs/sheet-<slug>.jpg)

Needs Pillow. Without it, the script lists the PNGs so the agent can open each one directly.
Look at EVERY image: typos, a heading shown twice, cut-off text, wrong palette. Fix with redo.py.
"""
import sys
from common import Project

if len(sys.argv) < 3:
    sys.exit(__doc__)
proj, slug = Project(sys.argv[1]), sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else str(proj.root / "logs" / f"sheet-{slug}.jpg")
pngs = sorted((proj.root / "assets" / slug).glob("chapter-*.png"), key=lambda p: int(p.stem.split("-")[1]))
if not pngs:
    sys.exit(f"No infographics yet in {proj.root / 'assets' / slug}")
try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Pillow not installed (python3 -m pip install pillow). Open these one by one instead:")
    print("\n".join(str(p) for p in pngs))
    sys.exit(0)
ims = [Image.open(p) for p in pngs]
w = 1100
h = int(w * ims[0].height / ims[0].width)
cols = 2 if len(ims) > 1 else 1
rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (w * cols, h * rows), "white")
for i, (p, im) in enumerate(zip(pngs, ims)):
    x, y = (i % cols) * w, (i // cols) * h
    S.paste(im.convert("RGB").resize((w, h)), (x, y))
    ImageDraw.Draw(S).rectangle([x, y + h - 34, x + 120, y + h], fill="black")
    ImageDraw.Draw(S).text((x + 10, y + h - 24), p.stem, fill="white")
S.save(out, quality=85)
print(out)
