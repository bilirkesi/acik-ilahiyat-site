"""İndirilen NotebookLM infografikleri ile orijinal AÖF infografik PDF'leri karşılaştırır.

Çıktı: artifacts/nlm-infographics/compare.html (yan yana görsel + tablo)
"""
import html
import re
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ORIG = ROOT / "assets"
NEW = ROOT / "artifacts" / "nlm-infographics"
THUMB_W = 640


def thumbs():
    cache = NEW / "_thumbs"
    cache.mkdir(parents=True, exist_ok=True)
    return cache


def pdf_page_img(pdf_path, page_no, dest):
    doc = pymupdf.open(pdf_path)
    page = doc[page_no]
    pix = page.get_pixmap(matrix=pymupdf.Matrix(150 / 72, 150 / 72))
    pix.save(str(dest))
    doc.close()
    return dest


def shrink(src, dest, w=THUMB_W):
    im = Image.open(src)
    if im.width != w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    if im.mode in ("RGBA", "P"):
        im = im.convert("RGB")
    im.save(dest, quality=85)
    return dest


def main():
    tc = thumbs()
    rows = []
    for slug in ("turk-dili-1", "ataturk-ilkeleri-1"):
        aof = ORIG / slug / "aof"
        for u in range(1, 9):
            pdfs = sorted(aof.glob(f"*Ünite {u}.pdf"))
            png = NEW / slug / f"unit-{u}.png"
            if not pdfs or not png.exists():
                continue
            pdf = pdfs[0]
            orig_thumb = tc / f"{slug}-u{u}-orig.jpg"
            shrink(pdf_page_img(pdf, 0, tc / f"{slug}-u{u}-orig.png"), orig_thumb)
            new_thumb = tc / f"{slug}-u{u}-new.jpg"
            shrink(png, new_thumb)
            doc = pymupdf.open(pdf)
            pages = len(doc)
            rect = doc[0].rect
            doc.close()
            im = Image.open(png)
            rows.append({
                "slug": slug,
                "u": u,
                "pages": pages,
                "orig_pt": f"{rect.width:.0f}×{rect.height:.0f}",
                "orig_kb": pdf.stat().st_size // 1024,
                "new_px": f"{im.width}×{im.height}",
                "new_kb": png.stat().st_size // 1024,
                "orig_thumb": orig_thumb.relative_to(NEW).as_posix(),
                "new_thumb": new_thumb.relative_to(NEW).as_posix(),
            })

    cards = []
    for r in rows:
        cards.append(f"""
    <section class="card">
      <h2>{r['slug'].upper()} · Ünite {r['u']}</h2>
      <table>
        <tr><th></th><th>Orijinal AÖF PDF</th><th>NotebookLM artifact</th></tr>
        <tr><th>Boyut</th><td>{r['orig_pt']} pt · {r['pages']} sayfa · {r['orig_kb']} KB</td><td>{r['new_px']} px · {r['new_kb']} KB</td></tr>
      </table>
      <div class="pair">
        <figure><img src="{r['orig_thumb']}" alt="orijinal" loading="lazy"><figcaption>Orijinal (1. sayfa)</figcaption></figure>
        <figure><img src="{r['new_thumb']}" alt="notebooklm" loading="lazy"><figcaption>NotebookLM üretilen</figcaption></figure>
      </div>
    </section>""")

    doc = f"""<!doctype html><html lang="tr"><head><meta charset="utf-8">
<title>İnfografik karşılaştırma</title>
<style>
body{{font:15px/1.5 system-ui,sans-serif;background:#f4f1ea;color:#1d2433;margin:0;padding:1.5rem}}
h1{{font-size:1.4rem}} .card{{background:#fffdf7;border:1px solid #d9d2c2;border-top:4px solid #1b2a4a;padding:1rem 1.2rem;margin:1rem 0}}
h2{{font-size:1rem;margin:.2rem 0 .6rem}}
table{{border-collapse:collapse;font-size:.85rem;margin-bottom:.7rem}}
th,td{{border:1px solid #d9d2c2;padding:.3rem .6rem;text-align:left}}
.pair{{display:grid;grid-template-columns:1fr 1fr;gap:1rem}}
figure{{margin:0}} img{{width:100%;border:1px solid #d9d2c2}}
figcaption{{font-size:.78rem;color:#5d6475;text-align:center;padding-top:.3rem}}
</style></head><body>
<h1>İnfografik karşılaştırma — Orijinal AÖF vs NotebookLM ({len(rows)} ünite)</h1>
{"".join(cards)}
</body></html>"""
    out = NEW / "compare.html"
    out.write_text(doc, encoding="utf-8")
    print(out)


if __name__ == "__main__":
    main()
