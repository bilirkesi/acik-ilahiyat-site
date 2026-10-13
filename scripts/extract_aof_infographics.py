#!/usr/bin/env python3
"""AÖF infografik PDF'lerini ünite başına PNG'ye çevirir.

assets/<slug>/aof/*Infografik*Ünite*.pdf -> assets/<slug>/aof-infographic-<n>.png
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
SLUGS = ["turk-dili-1", "ataturk-ilkeleri-1", "islam-mezhepleri-tarihi"]


def unit_from_name(name: str) -> int | None:
    m = re.search(r"[ÜU]nite\s*(\d+)", name, re.I)
    return int(m.group(1)) if m else None


def convert(slug: str) -> int:
    aof = ROOT / "assets" / slug / "aof"
    if not aof.exists():
        print(f"{slug}: no aof dir")
        return 0
    out_dir = ROOT / "assets" / slug
    n_ok = 0
    for pdf in sorted(aof.glob("*.pdf")):
        if "nfografik" not in pdf.name and "İnfografik" not in pdf.name and "Infografik" not in pdf.name:
            # also match by unicode NFKD-ish
            low = pdf.name.lower()
            if "nfo" not in low or "grafik" not in low:
                continue
        unit = unit_from_name(pdf.name)
        if not unit:
            print(f"  skip (no unit): {pdf.name}")
            continue
        dest = out_dir / f"aof-infographic-{unit}.png"
        # also multi-page: stitch vertically
        doc = pymupdf.open(str(pdf))
        try:
            pages = []
            zoom = 2.0
            mat = pymupdf.Matrix(zoom, zoom)
            for page in doc:
                pix = page.get_pixmap(matrix=mat, alpha=False)
                pages.append(pix)
            if not pages:
                continue
            if len(pages) == 1:
                pages[0].save(str(dest))
            else:
                # stitch
                w = max(p.width for p in pages)
                h = sum(p.height for p in pages) + 8 * (len(pages) - 1)
                out = pymupdf.Pixmap(pymupdf.csRGB, pymupdf.IRect(0, 0, w, h), False)
                out.clear_with(248)  # ivory-ish white
                y = 0
                for p in pages:
                    out.copy(p, p.irect + (0, y, 0, y))
                    # fallback manual if copy offset form fails
                    y += p.height + 8
                # simpler: use Pillow stitch
                from PIL import Image
                import io
                ims = [Image.open(io.BytesIO(p.tobytes("png"))) for p in pages]
                W = max(im.width for im in ims)
                H = sum(im.height for im in ims) + 12 * (len(ims) - 1)
                canvas = Image.new("RGB", (W, H), (248, 244, 234))
                yy = 0
                for im in ims:
                    x = (W - im.width) // 2
                    canvas.paste(im, (x, yy))
                    yy += im.height + 12
                canvas.save(dest, "PNG", optimize=True)
            print(f"  {slug} U{unit}: {dest.name} pages={len(pages)}")
            n_ok += 1
        finally:
            doc.close()
    return n_ok


def main() -> int:
    total = 0
    for slug in SLUGS:
        total += convert(slug)
    print(f"wrote {total} infographic png(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
