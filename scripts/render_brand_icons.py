#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Marka amblemini uretir: acik kitap + isik.

Amblem: lacivert disk, arkasi cikan altin gunes ve isinlari, onunde fildisi sayfali
acik kitap. "Bilgiyi paylasmak" fikri, hicbir okulun armasina ya da bayraga
dayanmaz; bu yuzden proje adinin degismesiyle birlikte yenilendi.

Ayni geometri iki bicimde uretilir: `favicon.svg` ve PWA ikonlari (Pillow).
Boylece favicon ile ikonlar birbirinden ayrilmaz.

Kullanim (depo koku):
    py -3 scripts/render_brand_icons.py
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "generator" / "site-template"

NAVY = "#1b2a4a"
GOLD = "#b08d4a"
IVORY = "#f8f4ea"
NAVY_RGB = (27, 42, 74)
GOLD_RGB = (176, 141, 74)
IVORY_RGB = (248, 244, 234)

# Amblem 100x100 birimlik karede taslanir; her bicim bu koordinatlari kullanir.
DISC = (50.0, 50.0, 46.5)          # merkez x, merkez y, yaricap
SUN = (50.0, 37.0, 17.0)           # merkez x, merkez y, yaricap
RAY_ANGLES = (0, 26, -26, 50, -50)  # dikeyden sapma (derece)
RAY_INNER, RAY_OUTER = 21.0, 31.0
RAY_WIDTH = 2.6
BOOK = {
    "spine_top": (50.0, 58.0),
    "spine_bottom": (50.0, 80.0),
    "outer_top": (19.0, 47.0),
    "outer_bottom": (19.0, 70.0),
    "top_ctrl": (34.5, 54.5),
    "bottom_ctrl": (34.5, 76.0),
}
STROKE = 2.2


def qbez(p0, p1, p2, n=14):
    """Iki noktali Bézier egrisi: n örnek nokta."""
    out = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        out.append((u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
                    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]))
    return out


def page_polygon(side):
    """Acik kitabin bir sayfasi (side: -1 sol, +1 sag)."""
    b = BOOK
    sp_t = (50.0 + side * (b["spine_top"][0] - 50.0), b["spine_top"][1])
    sp_b = (50.0 + side * (b["spine_bottom"][0] - 50.0), b["spine_bottom"][1])
    ou_t = (50.0 + side * (b["outer_top"][0] - 50.0), b["outer_top"][1])
    ou_b = (50.0 + side * (b["outer_bottom"][0] - 50.0), b["outer_bottom"][1])
    ct = (50.0 + side * (b["top_ctrl"][0] - 50.0), b["top_ctrl"][1])
    cb = (50.0 + side * (b["bottom_ctrl"][0] - 50.0), b["bottom_ctrl"][1])
    pts = qbez(sp_t, ct, ou_t)                       # ust kenar: kitapliktan disa
    pts += [ou_b]                                   # dis kenar
    pts += qbez(ou_b, cb, sp_b)[1:]                  # alt kenar: disa kitapliga
    pts.append(sp_t)                                # kitaplik
    return pts


def rays():
    """Gunesin isinlari: ucgenler (merkezden disariya)."""
    out = []
    cx, cy, _ = SUN
    for a in RAY_ANGLES:
        rad = math.radians(a)
        ux, uy = math.sin(rad), -math.cos(rad)
        px, py = -uy, ux                               # dik vektor
        base = (cx + ux * RAY_INNER, cy + uy * RAY_INNER)
        tip = (cx + ux * RAY_OUTER, cy + uy * RAY_OUTER)
        w = RAY_WIDTH / 2
        out.append([(base[0] + px * w, base[1] + py * w),
                    tip,
                    (base[0] - px * w, base[1] - py * w)])
    return out


def path_d(pts, close=True):
    """Nokta listesinden SVG yolu."""
    d = "M" + " L".join("%.2f %.2f" % (x, y) for x, y in pts)
    return d + (" Z" if close else "")


def emblem_svg(scale=1.0, cx=50.0, cy=50.0, year=None):
    """Amblemi SVG olarak dondurur (viewBox 100x118, yil yaziyla)."""
    def tx(p):
        return (cx + (p[0] - 50.0) * scale, cy + (p[1] - 50.0) * scale)

    def tp(pts):
        return [tx(p) for p in pts]

    d = tx((DISC[0], DISC[1]))
    s = tx((SUN[0], SUN[1]))
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 118" role="img" '
        f'aria-label="Açık Akademi amblemi">',
        f'<circle cx="{d[0]:.2f}" cy="{d[1]:.2f}" r="{DISC[2] * scale:.2f}" fill="{NAVY}"/>',
        f'<circle cx="{s[0]:.2f}" cy="{s[1]:.2f}" r="{SUN[2] * scale:.2f}" fill="{GOLD}"/>',
        f'<g fill="{GOLD}">',
    ]
    for r in rays():
        parts.append(f'<path d="{path_d(tp(r))}"/>')
    parts.append("</g>")
    parts.append(f'<g stroke="{GOLD}" stroke-width="{STROKE * scale:.2f}" '
                 f'stroke-linejoin="round" fill="{IVORY}">')
    for side in (-1, 1):
        parts.append(f'<path d="{path_d(tp(page_polygon(side)))}"/>')
    parts.append("</g>")
    sp_t = tx(BOOK["spine_top"])
    sp_b = tx(BOOK["spine_bottom"])
    parts.append(f'<path d="M{sp_t[0]:.2f} {sp_t[1]:.2f} L{sp_b[0]:.2f} {sp_b[1]:.2f}" '
                 f'stroke="{GOLD}" stroke-width="{STROKE * scale:.2f}" fill="none"/>')
    if year:
        parts.append(f'<text x="50" y="112" text-anchor="middle" '
                     f'font-family="EB Garamond, Georgia, serif" font-size="9" '
                     f'letter-spacing="2" fill="{GOLD}">{year}</text>')
    parts.append("</svg>")
    return "\n".join(parts)


def favicon_svg():
    """Kare favicon: amblem kareye tam oturur."""
    s = 46.5 / DISC[2]          # disk kenara degsin
    body = emblem_svg(scale=s, cx=50.0, cy=50.0)
    body = body.replace('viewBox="0 0 100 118"', 'viewBox="0 0 100 100"')
    # Yil yazisi ve 118'lik kutuyu kirp.
    body = "\n".join(line for line in body.splitlines() if "<text" not in line)
    return body.replace("</svg>", "</svg>")


def render_png(path: Path, size: int, maskable: bool = False) -> None:
    """Pillow ile amblemi PNG olarak cizer (4x supersampling)."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        sys.exit("Pillow gerekli: py -3 -m pip install Pillow")

    S = 4
    big = size * S
    bg = NAVY_RGB if maskable else (255, 255, 255)
    img = Image.new("RGB", (big, big), bg)
    d = ImageDraw.Draw(img)
    unit = big / 100.0
    scale = 0.86 if maskable else 1.0
    cx = cy = 50.0

    def px(p):
        return (cx + (p[0] - 50.0) * scale, cy + (p[1] - 50.0) * scale)

    def sp(p):
        x, y = px(p)
        return (x * unit, y * unit)

    d.ellipse([sp((DISC[0] - DISC[2], DISC[1] - DISC[2])), sp((DISC[0] + DISC[2], DISC[1] + DISC[2]))],
              fill=NAVY_RGB)
    d.ellipse([sp((SUN[0] - SUN[2], SUN[1] - SUN[2])), sp((SUN[0] + SUN[2], SUN[1] + SUN[2]))],
              fill=GOLD_RGB)
    for r in rays():
        d.polygon([sp(p) for p in r], fill=GOLD_RGB)
    w = max(1, int(round(STROKE * scale * unit)))
    for side in (-1, 1):
        pts = [sp(p) for p in page_polygon(side)]
        d.polygon(pts, fill=IVORY_RGB)
        d.line(pts + [pts[0]], fill=GOLD_RGB, width=w, joint="curve")
    st, sb = sp(BOOK["spine_top"]), sp(BOOK["spine_bottom"])
    d.line([st, sb], fill=GOLD_RGB, width=w)
    img = img.resize((size, size), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


def main() -> int:
    fav = TEMPLATE / "favicon.svg"
    fav.write_text(favicon_svg() + "\n", encoding="utf-8", newline="\n")
    print(f"wrote {fav.relative_to(ROOT)}")
    crest = TEMPLATE / "crest.svg"
    crest.write_text(emblem_svg(year="{{YEAR}}") + "\n", encoding="utf-8", newline="\n")
    print(f"wrote {crest.relative_to(ROOT)}")
    icons = TEMPLATE / "icons"
    render_png(icons / "icon-512.png", 512)
    render_png(icons / "icon-192.png", 192)
    render_png(icons / "apple-touch-icon.png", 180)
    render_png(icons / "icon-maskable-512.png", 512, maskable=True)
    for f in ("icon-512.png", "icon-192.png", "apple-touch-icon.png", "icon-maskable-512.png"):
        print("wrote icons/%s" % f)
    return 0


if __name__ == "__main__":
    sys.exit(main())
