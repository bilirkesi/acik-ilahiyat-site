#!/usr/bin/env python3
"""Ders kitabı ünite özetlerinden ünite infografikleri üretir.

AÖF'ün ünite infografiği yayınlamadığı dersler için (ör. İslâm Mezhepleri
Tarihi) kullanılır. İçerik elle hazırlanmış JSON'dan gelir:

data/<slug>/unit_infographics.json
  -> site/assets/<slug>/kitap-unite-<n>.jpg
  -> site/data.js içinde ilgili kursa "bookUnits" alanı

Gereksinim: pip install playwright pillow; Chromium (playwright install chromium
ya da PLAYWRIGHT_CHROMIUM yolu).
"""
from __future__ import annotations

import html
import io
import json
import os
import re
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
WIDTH = 900  # CSS px; 2x device scale -> 1800 px wide image
JPEG_QUALITY = 86
ACCENTS = ["#b08d4a", "#3f6f8f", "#8a4b5c", "#4f7a55", "#6b5b95"]

CSS = """
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: %(w)dpx; background: #f8f4ea; color: #1f2633;
  font-family: Inter, 'Segoe UI', 'Liberation Sans', Arial, sans-serif; }
.sheet { padding: 44px 46px 30px; }
header { border-bottom: 2px solid #1b2a4a; padding-bottom: 18px; margin-bottom: 22px; }
.course { font: 600 15px/1 Inter, sans-serif; letter-spacing: .14em; color: #b08d4a; }
h1 { font-family: 'EB Garamond', Georgia, 'DejaVu Serif', serif; font-weight: 600;
  color: #1b2a4a; font-size: 40px; line-height: 1.12; margin-top: 10px; }
h1 .no { display: block; font-size: 22px; letter-spacing: .08em; color: #5d6576; margin-bottom: 2px; }
.lead { margin-top: 12px; font-size: 17px; line-height: 1.5; color: #3a4252; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.card { background: #fffdf8; border: 1px solid #e4dccb; border-top: 5px solid var(--a);
  border-radius: 10px; padding: 16px 18px 14px; }
.card.wide { grid-column: 1 / -1; }
.card h2 { font-family: 'EB Garamond', Georgia, serif; font-weight: 600; font-size: 23px;
  color: #1b2a4a; margin-bottom: 8px; display: flex; gap: 10px; align-items: baseline; }
.card h2 .n { font: 600 13px/1 Inter, sans-serif; color: #fff; background: var(--a);
  border-radius: 99px; padding: 5px 8px; }
ul { list-style: none; }
li { position: relative; padding-left: 16px; font-size: 15.5px; line-height: 1.45; margin: 6px 0; }
li::before { content: ''; position: absolute; left: 0; top: .6em; width: 7px; height: 7px;
  border-radius: 50%%; background: var(--a); }
.keys { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.keys b { font-size: 13px; letter-spacing: .1em; color: #5d6576; margin-right: 4px; }
.chip { font-size: 14px; background: #1b2a4a; color: #f8f4ea; border-radius: 99px; padding: 5px 12px; }
footer { margin-top: 22px; padding-top: 12px; border-top: 1px solid #d9d0bd;
  font-size: 12.5px; color: #6b7280; display: flex; justify-content: space-between; gap: 20px; }
"""


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def unit_html(course: str, source: str, u: dict, total: int) -> str:
    cards = []
    secs = u["sections"]
    for i, sec in enumerate(secs):
        accent = ACCENTS[i % len(ACCENTS)]
        # odd count: last card spans both columns so the grid has no hole
        wide = " wide" if (len(secs) % 2 == 1 and i == len(secs) - 1) else ""
        pts = "".join(f"<li>{esc(p)}</li>" for p in sec["points"])
        cards.append(
            f'<section class="card{wide}" style="--a:{accent}">'
            f'<h2><span class="n">{i + 1}</span>{esc(sec["heading"])}</h2><ul>{pts}</ul></section>'
        )
    chips = "".join(f'<span class="chip">{esc(k)}</span>' for k in u.get("keywords", []))
    return f"""<!doctype html><html lang="tr"><head><meta charset="utf-8">
<style>{CSS % {"w": WIDTH}}</style></head><body><div class="sheet">
<header><p class="course">{esc(course)}</p>
<h1><span class="no">ÜNİTE {u["unit"]}</span>{esc(u["title"])}</h1>
<p class="lead">{esc(u["lead"])}</p></header>
<div class="grid">{"".join(cards)}</div>
<div class="keys"><b>ANAHTAR KAVRAMLAR</b>{chips}</div>
<footer><span>Kaynak: {esc(source)}. Resmî AÖF infografiği değildir.</span><span>Açık İlahiyat · {u["unit"]}/{total}</span></footer>
</div></body></html>"""


def patch_data_js(slug: str, book_units: list[dict]) -> None:
    path = ROOT / "site" / "data.js"
    text = path.read_text(encoding="utf-8")
    m = re.search(r"^window\.COURSES = (.*);\s*$", text, re.M)
    if not m:
        raise SystemExit("site/data.js: window.COURSES satırı bulunamadı")
    courses = json.loads(m.group(1))
    course = next((c for c in courses if c.get("slug") == slug), None)
    if course is None:
        raise SystemExit(f"site/data.js: {slug} yok")
    course["bookUnits"] = book_units
    line = "window.COURSES = " + json.dumps(courses, ensure_ascii=False) + ";"
    text = text[: m.start()] + line + text[m.end():]
    path.write_text(text, encoding="utf-8")


def render(slug: str) -> int:
    spec = json.loads((ROOT / "data" / slug / "unit_infographics.json").read_text(encoding="utf-8"))
    out_dir = ROOT / "site" / "assets" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    units = spec["units"]
    book_units = []
    launch = {}
    if os.environ.get("PLAYWRIGHT_CHROMIUM"):
        launch["executable_path"] = os.environ["PLAYWRIGHT_CHROMIUM"]
    with sync_playwright() as p:
        browser = p.chromium.launch(**launch)
        page = browser.new_page(viewport={"width": WIDTH, "height": 800}, device_scale_factor=2)
        for u in units:
            page.set_content(unit_html(spec["course"], spec["source"], u, len(units)), wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            png = page.screenshot(full_page=True)
            im = Image.open(io.BytesIO(png)).convert("RGB")
            name = f"kitap-unite-{u['unit']}.jpg"
            im.save(out_dir / name, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
            print(f"  {slug} Ü{u['unit']}: {name} {im.width}x{im.height}")
            book_units.append({
                "unit": u["unit"],
                "title": u["title"],
                "chapter": u.get("chapter"),
                "image": f"assets/{slug}/{name}",
            })
        browser.close()
    patch_data_js(slug, book_units)
    print(f"site/data.js: {slug} bookUnits = {len(book_units)}")
    return len(book_units)


def main() -> int:
    slugs = sys.argv[1:] or ["islam-mezhepleri-tarihi"]
    for slug in slugs:
        render(slug)
    return 0


if __name__ == "__main__":
    sys.exit(main())
