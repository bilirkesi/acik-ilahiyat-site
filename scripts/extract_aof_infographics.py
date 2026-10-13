#!/usr/bin/env python3
"""AÖF infografik PDF'lerini yüksek çözünürlüklü sayfa PNG'lerine çevirir.

assets/<slug>/aof/*Infografik*Ünite N*.pdf
  -> assets/<slug>/aof-infographic-<n>-p<i>.png  (sayfa bazlı)
  -> assets/<slug>/aof-infographic-<n>.png       (1 sayfalık üniteler için)
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SLUGS = ["turk-dili-1", "ataturk-ilkeleri-1", "islam-mezhepleri-tarihi"]
ZOOM = 3.0  # ~216 dpi-equivalent for A4-ish pages; keeps text sharp


def unit_from_name(name: str) -> int | None:
    m = re.search(r"[ÜU]nite\s*(\d+)", name, re.I)
    return int(m.group(1)) if m else None


def is_infographic(name: str) -> bool:
    low = name.lower()
    return ("nfo" in low and "grafik" in low) or "İnfografik" in name


def convert(slug: str) -> int:
    aof = ROOT / "assets" / slug / "aof"
    if not aof.exists():
        print(f"{slug}: no aof dir")
        return 0
    out_dir = ROOT / "assets" / slug
    n_ok = 0
    for pdf in sorted(aof.glob("*.pdf")):
        if not is_infographic(pdf.name):
            continue
        unit = unit_from_name(pdf.name)
        if not unit:
            print(f"  skip (no unit): {pdf.name}")
            continue
        doc = pymupdf.open(str(pdf))
        try:
            mat = pymupdf.Matrix(ZOOM, ZOOM)
            page_paths = []
            for pi, page in enumerate(doc, 1):
                pix = page.get_pixmap(matrix=mat, alpha=False)
                # lossless high-quality PNG; build.py will JPEG for site
                if len(doc) == 1:
                    dest = out_dir / f"aof-infographic-{unit}.png"
                else:
                    dest = out_dir / f"aof-infographic-{unit}-p{pi}.png"
                pix.save(str(dest))
                page_paths.append(dest)
                print(f"  {slug} U{unit} p{pi}: {dest.name} {pix.width}x{pix.height}")
            # multi-page convenience: also write stitched at readable width
            if len(page_paths) > 1:
                from PIL import Image
                import io
                ims = [Image.open(p) for p in page_paths]
                gap = 16
                W = max(im.width for im in ims)
                H = sum(im.height for im in ims) + gap * (len(ims) - 1)
                canvas = Image.new("RGB", (W, H), (248, 244, 234))
                yy = 0
                for im in ims:
                    x = (W - im.width) // 2
                    canvas.paste(im, (x, yy))
                    yy += im.height + gap
                stitch = out_dir / f"aof-infographic-{unit}.png"
                canvas.save(stitch, "PNG", optimize=True)
                print(f"  {slug} U{unit}: stitched {stitch.name} {W}x{H}")
            n_ok += 1
        finally:
            doc.close()
    return n_ok


def main() -> int:
    total = 0
    for slug in SLUGS:
        total += convert(slug)
    print(f"wrote {total} infographic unit(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
