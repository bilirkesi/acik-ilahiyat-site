#!/usr/bin/env python3
"""NotebookLM infografik PNG'lerindeki Türkçe hataları piksel düzeyinde düzeltir.

OCR gövde satırları çoğu zaman tek bir görsel/typografik satırı 2-3 OCR satırına böler
(kelime sarma). Bu yüzden düzeltme GREPFAIL birimindeki tam görsel satırı (görseldeki
gerçek satır yüksekliğiyle) siler ve düzeltilmiş metni aynı punto/renk/hizada yeniden yazar.
Orijinaller artifacts/nlm-infographics/_backup-orig/ altında durur.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"C:\Users\Selahattin\NotebookProjects\acik-ilahiyat-poc")
NL = ROOT / "artifacts" / "nlm-infographics"
FIXES = ROOT / "logs" / "fixes"
FONTS = {
    "regular": NL / "_fonts" / "Roboto-Regular.ttf",
    "medium": NL / "_fonts" / "Roboto-Medium.ttf",
    "bold": NL / "_fonts" / "Roboto-Bold.ttf",
}
DIST = 60
IMG_W = 1536


def ring_median(im: Image.Image, rect: tuple[int, int, int, int]) -> tuple[int, int, int]:
    x0, y0, x1, y1 = rect
    w, h = im.size
    samples: list[tuple[int, int, int]] = []
    s = 8
    strips = [
        (max(0, x0 - s), max(0, y0 - s), min(w, x1 + s), max(0, y0 - 2)),
        (max(0, x0 - s), min(h, y1 + 2), min(w, x1 + s), min(h, y1 + s)),
        (max(0, x0 - s), max(0, y0 - s), max(0, x0 - 2), min(h, y1 + s)),
        (min(w, x1 + 2), max(0, y0 - s), min(w, x1 + s), min(h, y1 + s)),
    ]
    for sx0, sy0, sx1, sy1 in strips:
        if sx1 - sx0 >= 2 and sy1 - sy0 >= 2:
            samples.extend(im.crop((sx0, sy0, sx1, sy1)).getdata())
    if not samples:
        return (255, 255, 255)
    return tuple(sorted(p[c] for p in samples)[len(samples) // 2] for c in range(3))  # type: ignore[return-value]


def text_color_and_ratio(
    im: Image.Image, box: tuple[int, int, int, int], bg: tuple[int, int, int]
) -> tuple[tuple[int, int, int] | None, float]:
    x0, y0, x1, y1 = box
    px = im.crop((x0, y0, x1, y1)).getdata()
    far = [p for p in px if abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) > DIST]
    ratio = len(far) / max(1, len(px))
    if len(far) < 12:
        return None, ratio
    return tuple(sorted(p[c] for p in far)[len(far) // 2] for c in range(3)), ratio  # type: ignore[return-value]


def ink_ratio(path: Path, text: str, color, bg, size: int) -> float:
    f = ImageFont.truetype(str(path), size)
    tmp = Image.new("RGB", (size * max(4, len(text)), size * 2), bg)
    ImageDraw.Draw(tmp).text((10, 10), text, font=f, fill=color)
    bb = tmp.getbbox()
    if not bb:
        return 0.0
    crop = tmp.crop(bb)
    far = sum(
        1
        for p in crop.getdata()
        if abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) > DIST
    )
    return far / max(1, crop.size[0] * crop.size[1])


def pick_weight(orig_ratio: float, text: str, color, bg, size: int) -> str:
    best, best_d = "regular", 1e9
    for name in ("regular", "medium", "bold"):
        r = ink_ratio(FONTS[name], text, color, bg, size)
        d = abs(r - orig_ratio)
        if d < best_d:
            best, best_d = name, d
    return best


def line_box(words: list[dict]) -> tuple[int, int, int, int]:
    return (
        min(w["x"] for w in words),
        min(w["y"] for w in words),
        max(w["x"] + w["w"] for w in words),
        max(w["y"] + w["h"] for w in words),
    )


def ink_height_at(path: Path, text: str, size: int) -> int:
    f = ImageFont.truetype(str(path), size)
    tmp = Image.new("L", (size * max(6, len(text) * 2), size * 3), 0)
    ImageDraw.Draw(tmp).text((20, size // 2), text, font=f, fill=255)
    bb = tmp.getbbox()
    return 0 if not bb else bb[3] - bb[1]


def estimate_size(path: Path, text: str, target_ink_h: int) -> int:
    lo, hi = 6, max(8, target_ink_h * 3)
    best = 8
    while lo <= hi:
        mid = (lo + hi) // 2
        if ink_height_at(path, text, mid) <= target_ink_h:
            best = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return best


def rewrite_visual_line(
    im: Image.Image,
    words: list[dict],
    text: str,
    note: str,
    report: list[str],
) -> None:
    x0, y0, x1, y1 = line_box(words)
    target_h = y1 - y0
    er = (max(0, x0 - 2), max(0, y0 - 2), min(im.size[0], x1 + 2), min(im.size[1], y1 + 2))
    bg = ring_median(im, er)
    color, ratio = text_color_and_ratio(im, (x0, y0, x1, y1), bg)
    if color is None:
        report.append(f"skip(no text px) {note}")
        return
    ImageDraw.Draw(im).rectangle(er, fill=bg)
    size = estimate_size(FONTS["regular"], text, target_h)
    size = max(8, size)
    weight = pick_weight(ratio, text, color, bg, size)
    font = ImageFont.truetype(str(FONTS[weight]), size)
    scratch = Image.new("L", (size * max(20, len(text) * 2), size * 3), 0)
    ImageDraw.Draw(scratch).text((20, size // 2), text, font=font, fill=255)
    bb = scratch.getbbox()
    if not bb:
        report.append(f"skip(empty render) {note}")
        return
    crop = scratch.crop(bb)
    tw, th = crop.size
    tx = x0 + max(0, (x1 - x0 - tw) // 2) if abs((x0 + x1) / 2 - IMG_W / 2) < 220 else x0
    ty = y0 + max(0, (target_h - th) // 2)
    overlay = Image.new("RGB", crop.size, color)
    im.paste(overlay, (tx, ty), crop)


def visual_line_words(lines: list[dict], start_idx: int, target_tokens: int) -> tuple[list[dict], int]:
    """Bir OCR satırının başladığı görsel/typografik satırın tüm kelime kutularını toplar.

    OCR gövde satırları tek görsel satırı 2-3 satıra böler. Y-ardışık OCR satırlarını,
    toplam kelime kutusu sayısı `target_tokens`'a ulaşana veya y-boşluğu > 3px olana
    kadar birleştirir. Böylece farklı stilde bitişik satırlar (ör. kalın başlık +
    gövde) yanlışlıkla birleştirilmez.
    """
    words = list(lines[start_idx]["words"])
    y1 = max(w["y"] + w["h"] for w in words)
    li = start_idx + 1
    while li < len(lines) and len(words) < target_tokens:
        nxt = lines[li]
        ny0 = min(w["y"] for w in nxt["words"])
        if ny0 - y1 > 3:
            break
        words.extend(nxt["words"])
        y1 = max(y1, max(w["y"] + w["h"] for w in nxt["words"]))
        li += 1
    return words, li


def best_line_index(lines: list[dict], hinted_i: int, actual: str) -> int:
    """`actual` metnini OCR satır metinleriyle karşılaştırıp en iyi başlangıç satırını bulur.

    Verilen ipucu `(hinted_i)` çevresinde (±3 satır) en yüksek benzerlikli satırı seçer;
    hiçbiri anlamlı eşleşmezse ipucunu olduğu gibi kullanır.
    """
    from difflib import SequenceMatcher

    hint = max(0, min(len(lines) - 1, hinted_i - 1))
    atoks = actual.lower().split()
    if not atoks:
        return hint
    best, best_score = hint, -1.0
    lo = max(0, hint - 3)
    hi = min(len(lines), hint + 4)
    for li in range(lo, hi):
        ltoks = lines[li]["text"].lower().split()
        if not ltoks:
            continue
        score = SequenceMatcher(a=atoks, b=ltoks).ratio()
        if score > best_score:
            best, best_score = li, score
    return best if best_score >= 0.30 else hint


def process_image(slug: str, unit: int) -> dict:
    fix_file = FIXES / f"{slug}__unit-{unit}.json"
    ocr_file = NL / "ocr" / f"{slug}__unit-{unit}.json"
    png = NL / slug / f"unit-{unit}.png"
    fixes = json.loads(fix_file.read_text(encoding="utf-8"))["fixes"]
    ocr = json.loads(ocr_file.read_text(encoding="utf-8-sig"))
    lines = ocr["lines"]
    backup = NL / "_backup-orig" / slug / f"unit-{unit}.png"
    src = backup if backup.exists() else png
    im = Image.open(src).convert("RGB")
    report: list[str] = []
    applied = skipped = 0

    seen_spans: set[tuple[int, int]] = set()
    for fx in fixes:
        idx = int(fx["i"]) - 1
        if not (0 <= idx < len(lines)):
            skipped += 1
            report.append(f"skip(out of range i={fx['i']})")
            continue
        idx = best_line_index(lines, idx + 1, fx["actual"])
        words, end = visual_line_words(lines, idx, len(fx["actual"].split()))
        span = (idx, end)
        if any(span[0] < e and s < span[1] for s, e in seen_spans):
            skipped += 1
            report.append(f"skip(overlap span i={fx['i']})")
            continue
        seen_spans.add(span)
        rewrite_visual_line(im, words, fx["correct"], f"i={fx['i']}", report)
        applied += 1

    im.save(png, "PNG", optimize=True)
    return {
        "image": f"{slug}/unit-{unit}.png",
        "fixes": len(fixes),
        "rewritten": applied,
        "skipped": skipped,
        "log": report,
    }


def main() -> None:
    only = sys.argv[1:]
    jobs = []
    if len(only) == 2:
        jobs = [(only[0], int(only[1]))]
    else:
        for slug in ("turk-dili-1", "ataturk-ilkeleri-1"):
            for u in range(1, 9):
                if (FIXES / f"{slug}__unit-{u}.json").exists():
                    jobs.append((slug, u))
    summary = []
    for slug, u in jobs:
        r = process_image(slug, u)
        summary.append(r)
        print(f"{r['image']}: fixes={r['fixes']} rewritten={r['rewritten']} skip={r['skipped']}")
        for lg in r["log"][:8]:
            print("   ", lg)
    out = ROOT / "logs" / "fix_infographics_report.json"
    out.write_text(json.dumps(summary, ensure_ascii=False, indent=1), encoding="utf-8")
    print("report ->", out)


if __name__ == "__main__":
    main()
