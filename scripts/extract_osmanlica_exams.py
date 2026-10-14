#!/usr/bin/env python3
"""Osmanlı Türkçesi I çıkmış sınav PDF'lerinden data/osmanlica-1/past_exams.json üretir.

Bu derste soru gövdelerinin ve şıkların çoğu Arap harfli; PDF'te metin değil, gömülü
resim olarak durur. Script her resmi konumuna göre ilgili soruya/şıkka bağlar, şeffaf
PNG olarak site/assets/osmanlica-1/sinav/ altına yazar ve JSON'a yolunu koyar:

  question: {n, stem, stemParts: [{text}|{img}], options: [{key, text, image?}], correct}

Elle yazılmış alanlar (unit, stem, explanation) data/osmanlica-1/past_exams_notes.json'dan
okunur; böylece PDF'ler yeniden işlenince kaybolmaz.

Kullanım: python3 scripts/extract_osmanlica_exams.py [aof-klasörü]
Gereksinim: pip install pymupdf pillow
"""
from __future__ import annotations

import hashlib
import io
import json
import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SLUG = "osmanlica-1"
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "assets" / SLUG / "aof"
OUT = ROOT / "data" / SLUG / "past_exams.json"
NOTES = ROOT / "data" / SLUG / "past_exams_notes.json"
IMG_DIR = ROOT / "site" / "assets" / SLUG / "sinav"
IMG_URL = f"assets/{SLUG}/sinav"

TOP, BOTTOM = 92, 772  # başlık ve alt bilgi dışı
MID = 297  # iki sütunun sınırı
PX_PER_PT = 2.7  # PNG çözünürlüğü; CSS genişliği bunun yarısı

HEAD_RE = re.compile(r"(20\d{2}(?:-20\d{2})?)\s+GÜZ\s+ARA\s*-\s*([AB])")
KEY_RE = re.compile(r"([AB])\s+Grubu\s+Cevap\s+Anahtar")


def horizontal_spans(page):
    """Filigran (eğik) metni atlayarak yatay satırları (bbox, text) döndürür."""
    out = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            if abs(line["dir"][1]) > 0.01:
                continue
            text = "".join(s["text"] for s in line["spans"]).strip()
            if text:
                out.append((pymupdf.Rect(line["bbox"]), text))
    return out


def save_image(doc, xref, rect, cache):
    if xref in cache:
        return cache[xref]
    pix = pymupdf.Pixmap(doc, xref)
    info = doc.extract_image(xref)
    if info.get("smask"):
        pix = pymupdf.Pixmap(pix, pymupdf.Pixmap(doc, info["smask"]))
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
    # Siyah mürekkep: koyuluğu alfaya çevir, beyaz zemini şeffaf yap.
    r, g, b, a = img.split()
    gray = Image.merge("RGB", (r, g, b)).convert("L")
    alpha = Image.eval(gray, lambda v: 255 - v)
    alpha = Image.composite(alpha, Image.new("L", img.size, 0), a)
    box = alpha.getbbox()
    if not box:
        cache[xref] = None
        return None
    pad = 6
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(img.width, box[2] + pad), min(img.height, box[3] + pad))
    alpha = alpha.crop(box)
    ink = Image.new("LA", alpha.size, 0)
    ink.putalpha(alpha)
    # Sayfadaki boyutun ~2.7 katı (CSS'te 2x keskinlik): 1pt = 1.33px.
    scale = rect.height * PX_PER_PT / max(img.height, 1)
    if scale < 1:
        ink = ink.resize((max(1, round(ink.width * scale)), max(1, round(ink.height * scale))), Image.LANCZOS)
    buf = io.BytesIO()
    ink.save(buf, "PNG", optimize=True)
    data = buf.getvalue()
    name = hashlib.sha1(data).hexdigest()[:12] + ".png"
    (IMG_DIR / name).write_bytes(data)
    cache[xref] = {"src": f"{IMG_URL}/{name}", "w": ink.width, "h": ink.height}
    return cache[xref]


def ordered_parts(items):
    """[(rect, kind, value)] -> satır sırasıyla birleşik parçalar."""
    items = sorted(items, key=lambda it: ((it[0].y0 + it[0].y1) / 2, it[0].x0))
    rows = []
    for it in items:
        cy = (it[0].y0 + it[0].y1) / 2
        if rows and abs(rows[-1][0] - cy) < 7:
            rows[-1][1].append(it)
        else:
            rows.append([cy, [it]])
    parts = []
    for _, row in rows:
        for rect, kind, value in sorted(row, key=lambda it: it[0].x0):
            if kind == "text" and parts and "text" in parts[-1]:
                parts[-1]["text"] += " " + value
            elif kind == "text":
                parts.append({"text": value})
            else:
                parts.append({"img": value["src"], "w": value["w"], "h": value["h"]})
    for p in parts:
        if "text" in p:
            p["text"] = re.sub(r"\s+", " ", p["text"].replace("­", "")).strip()
            p["text"] = re.sub(r"(\w)- (\w)", r"\1\2", p["text"])
    return [p for p in parts if p.get("img") or p.get("text")]


def page_questions(doc, page, cache):
    spans = [(r, t) for r, t in horizontal_spans(page) if TOP < r.y0 < BOTTOM]
    images = []
    for im in page.get_image_info(xrefs=True):
        rect = pymupdf.Rect(im["bbox"])
        if TOP < rect.y0 < BOTTOM and im["xref"]:
            images.append((rect, im["xref"]))
    # Soru numarası: satır başındaki "N." (satır "N. metin" olarak da gelebilir)
    starts = []
    for r, t in spans:
        m = re.match(r"^(\d{1,2})\.(?:\s|$)", t)
        if m and (r.x0 < 80 or MID < r.x0 < MID + 30):
            starts.append((r, int(m.group(1))))
    out = []
    for col in (0, 1):
        in_col = lambda r: (r.x0 < MID) if col == 0 else (r.x0 >= MID)
        col_starts = sorted([s for s in starts if in_col(s[0])], key=lambda s: s[0].y0)
        for i, (r, n) in enumerate(col_starts):
            y0 = r.y0 - 3
            y1 = col_starts[i + 1][0].y0 - 3 if i + 1 < len(col_starts) else BOTTOM
            q_spans = [(sr, st) for sr, st in spans if in_col(sr) and y0 <= sr.y0 < y1]
            q_imgs = [(ir, x) for ir, x in images if in_col(ir) and y0 <= (ir.y0 + ir.y1) / 2 < y1]
            labels = []
            for sr, st in q_spans:
                m = re.match(r"^([A-E])\)\s*(.*)$", st)
                if m:
                    labels.append((sr, m.group(1), m.group(2)))
            labels.sort(key=lambda l: l[0].y0)
            first_opt = labels[0][0].y0 - 4 if labels else y1
            stem_items = []
            for sr, st in q_spans:
                if sr.y0 >= first_opt:
                    continue
                st = re.sub(r"^\d{1,2}\.\s*", "", st) if sr == r else st
                if st:
                    stem_items.append((sr, "text", st))
            for ir, x in q_imgs:
                if (ir.y0 + ir.y1) / 2 < first_opt:
                    url = save_image(doc, x, ir, cache)
                    if url:
                        stem_items.append((ir, "img", url))
            options = []
            for j, (lr, key, rest) in enumerate(labels):
                ly0 = lr.y0 - 4
                ly1 = labels[j + 1][0].y0 - 4 if j + 1 < len(labels) else y1
                texts = [(lr, rest)] if rest else []
                for sr, st in q_spans:
                    if sr is lr or not (ly0 <= sr.y0 < ly1) or re.match(r"^[A-E]\)", st):
                        continue
                    texts.append((sr, st))
                texts.sort(key=lambda t: (round(t[0].y0 / 4), t[0].x0))
                opt = {"key": key, "text": re.sub(r"\s+", " ", " ".join(t for _, t in texts)).strip()}
                for ir, x in q_imgs:
                    cy = (ir.y0 + ir.y1) / 2
                    if ly0 - 4 <= cy < ly1 or (j + 1 == len(labels) and ly0 - 4 <= cy < y1):
                        url = save_image(doc, x, ir, cache)
                        if url:
                            opt["image"] = url["src"]
                            opt["imageSize"] = [url["w"], url["h"]]
                            break
                options.append(opt)
            parts = ordered_parts(stem_items)
            stem = " ".join(p.get("text") or "[Osmanlıca]" for p in parts)
            q = {"n": n, "stem": stem, "options": options}
            if any("img" in p for p in parts):
                q["stemParts"] = parts
            out.append(q)
    return out


def answer_key(page):
    words = page.get_text("words")
    rows = {}
    for w in words:
        if re.fullmatch(r"[A-E]", w[4]):
            rows.setdefault(round(w[1]), []).append(w)
    best = max(rows.values(), key=len)
    best.sort(key=lambda w: w[0])
    return {str(i + 1): w[4] for i, w in enumerate(best)}


def main() -> int:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    for old in IMG_DIR.glob("*.png"):
        old.unlink()
    notes = json.loads(NOTES.read_text(encoding="utf-8")) if NOTES.exists() else {}
    exams = []
    for pdf in sorted(SRC.glob("*Sınav Soruları*.pdf")):
        doc = pymupdf.open(pdf)
        cache: dict[int, dict | None] = {}
        current = None
        for page in doc:
            text = page.get_text()
            key = KEY_RE.search(text)
            head = HEAD_RE.search(text)
            if key and current:
                current["answer_key"] = answer_key(page)
                continue
            if not head:
                continue
            year, group = head.group(1), head.group(2)
            if "-" not in year:
                # "2022 GÜZ" başlıklı oturumların filigranı "2021-2022 Güz Dönemi" der.
                year = f"{int(year) - 1}-{year}"
            exam_id = f"{year.replace('-', '')}-guz-vize-{group.lower()}"
            if not current or current["exam_id"] != exam_id:
                current = {"year": year, "term": "guz", "exam_id": exam_id, "group": group,
                           "file": pdf.name, "answer_key": {}, "questions": []}
                exams.append(current)
            current["questions"].extend(page_questions(doc, page, cache))
    for exam in exams:
        exam["questions"].sort(key=lambda q: q["n"])
        for q in exam["questions"]:
            q["correct"] = exam["answer_key"].get(str(q["n"]))
            for o in q["options"]:
                o["isCorrect"] = o["key"] == q["correct"]
            extra = notes.get(exam["exam_id"], {}).get(str(q["n"]), {})
            q.update({k: v for k, v in extra.items() if k in ("unit", "stem", "explanation")})
    exams.sort(key=lambda e: (e["year"], e["group"]), reverse=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(exams, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    nq = sum(len(e["questions"]) for e in exams)
    ni = len(list(IMG_DIR.glob("*.png")))
    print(f"{OUT.relative_to(ROOT)}: {len(exams)} exam(s), {nq} question(s), {ni} image(s)")
    for e in exams:
        bad = [q["n"] for q in e["questions"] if len(q["options"]) != 5 or not q["correct"]]
        print(f"  {e['exam_id']}: {len(e['questions'])} q, key={len(e['answer_key'])}, check={bad}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
