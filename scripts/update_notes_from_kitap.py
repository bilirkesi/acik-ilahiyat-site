#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kitap.pdf'ten çalışma notlarını güncelle; citation'ları not gövdesine göm.

- assets/<slug>/aof/*Kitap*.pdf unit/bolum bazlı parse edilir
- data/<slug>/study_plan.json chapters[].grounding.answer kitap notu olur
- Inline marker: ⟦k⟧  (build.clean() bunu silmez; app.js site linkine çevirir)
- chapters[].cites: [{exam_id, year, num, stem}]  site citation listesi için
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
ASSETS = ROOT / "assets"
DATA = ROOT / "data"

SLUGS = ["turk-dili-1", "ataturk-ilkeleri-1", "islam-mezhepleri-tarihi"]

# study plan chapter index -> book unit/bolum numbers
MERGE_MAP = {
    "turk-dili-1": {i: [i] for i in range(1, 9)},
    "ataturk-ilkeleri-1": {i: [i] for i in range(1, 9)},
    "islam-mezhepleri-tarihi": {
        1: [1],
        2: [2, 3],
        3: [4, 5],
        4: [6, 7],
        5: [8, 9],
        6: [10],
    },
}

NOISE_FOLD = {
    "infografik",
    "etkilesimli icerik",
    "bilgilendirme panosu",
    "sorularla ogrenelim",
    "ders kitabi pdf",
    "sesli ozet",
    "sesli kitap",
    "deneme sinavi",
    "sinav giris bilgisi",
    "canli ders",
    "ogrenci topluluklari",
    "unite ozeti",
    "sinav sonuclari",
}


def fold(s: str) -> str:
    tr = str.maketrans(
        {
            "ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g",
            "ü": "u", "Ü": "u", "ö": "o", "Ö": "o", "ç": "c", "Ç": "c",
            "â": "a", "Â": "a", "î": "i", "Î": "i", "û": "u", "Û": "u",
            "\u00ad": "",
        }
    )
    s = (s or "").translate(tr).lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def kitap_for(slug: str) -> Path:
    hits = sorted((ASSETS / slug / "aof").glob("*Kitap*.pdf"))
    if not hits:
        raise FileNotFoundError(f"Kitap.pdf yok: {slug}")
    return hits[0]


def parse_header_units(doc: pymupdf.Document) -> dict[int, dict]:
    """Turk dili + Islam: her sayfada 'N. Ünite - Başlık' running header."""
    header_re = re.compile(
        r"^\s*(\d+)\.?\s*Ünite\s*[-–—:]*\s*(.+?)\s*$", re.I
    )
    page_unit: list[int | None] = [None] * doc.page_count
    titles: dict[int, str] = {}
    for i in range(doc.page_count):
        for line in doc[i].get_text("text").splitlines():
            m = header_re.match(line.strip())
            if m and len(m.group(2).strip()) >= 3:
                u = int(m.group(1))
                titles[u] = m.group(2).strip()
                page_unit[i] = u
    return _spans_from_page_unit(doc, page_unit, titles, kind="Ünite")


def parse_bolum_units(doc: pymupdf.Document) -> dict[int, dict]:
    """Atatürk: gerçek bölüm giriş sayfalarını bul ('Bölüm N' + Anahtar Sözcük)."""
    starts: dict[int, tuple[int, str]] = {}
    for i in range(doc.page_count):
        text = doc[i].get_text("text")
        if "Anahtar Sözcük" not in text and "Anahtar sözcük" not in text:
            continue
        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        for j, ln in enumerate(lines):
            m = re.fullmatch(r"Bölüm\s*(\d+)", ln, re.I)
            if not m:
                continue
            u = int(m.group(1))
            nxt = [x for x in lines[j + 1 : j + 6] if x and not re.fullmatch(r"Bölüm\s*\d+", x, re.I)]
            if not nxt:
                continue
            title = " ".join(nxt[:4])
            title = re.split(r"Anahtar Sözcük|Giriş\s*\.{3,}|\.{4,}", title)[0].strip()
            title = re.sub(r"\s+", " ", title)
            if len(title) < 8:
                continue
            # en erken gerçek giriş sayfasını tut
            if u not in starts or i < starts[u][0]:
                starts[u] = (i, title)
    page_unit: list[int | None] = [None] * doc.page_count
    titles: dict[int, str] = {}
    order = sorted(starts.items(), key=lambda x: x[1][0])
    for idx, (u, (page, title)) in enumerate(order):
        titles[u] = title
        end = order[idx + 1][1][0] if idx + 1 < len(order) else doc.page_count
        for p in range(page, end):
            page_unit[p] = u
    return _spans_from_page_unit(doc, page_unit, titles, kind="Bölüm")


def _spans_from_page_unit(doc, page_unit, titles, kind) -> dict[int, dict]:
    spans: dict[int, list[int]] = {}
    for i, u in enumerate(page_unit):
        if u is None or not (1 <= u <= 10):
            continue
        spans.setdefault(u, [i, i])
        spans[u][1] = i
    out: dict[int, dict] = {}
    for u, (a, b) in spans.items():
        chunks = []
        for i in range(a, b + 1):
            t = clean_page(doc[i].get_text("text"), titles.get(u, ""), kind)
            if t:
                chunks.append(t)
        out[u] = {
            "title": titles.get(u, f"{kind} {u}"),
            "start": a,
            "end": b,
            "text": "\n\n".join(chunks),
        }
    return out


def clean_page(text: str, unit_title: str, kind: str) -> str:
    ut = fold(unit_title)
    lines_out: list[str] = []
    for raw in text.splitlines():
        s = raw.rstrip()
        t = s.strip()
        if not t:
            if lines_out and lines_out[-1] != "":
                lines_out.append("")
            continue
        f = fold(t)
        if not f or f in NOISE_FOLD:
            continue
        if ut and f == ut:
            continue
        if kind == "Ünite" and re.match(r"^\d+\.?\s*Unite\b", f):
            if ut and (f == ut or len(f) <= len(ut) + 6):
                continue
        if kind == "Bölüm" and re.fullmatch(r"bolum\s*\d+", f):
            continue
        # sayfa üstbilgisi: ders adı veya sayfa numarası
        if f in {"ataturk ilkeleri ve inkilap tarihi i", "turk dili i", "islam mezhepleri tarihi"}:
            continue
        if re.fullmatch(r"\d{1,3}", t):
            continue
        if re.fullmatch(r"[\d\s|./\-–—]+", t):
            continue
        if "Yayın No" in t or "YAYINI NO" in t:
            continue
        lines_out.append(s)
    text = "\n".join(lines_out)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def sectionize(text: str, kind: str) -> list[tuple[str, str]]:
    """Büyük başlıklara göre (heading, body) blokları üret."""
    lines = text.splitlines()
    sections: list[list[str]] = [[]]
    heading = ""
    for ln in lines:
        s = ln.strip()
        is_head = False
        if s and len(s) < 90 and not s.endswith(".") and not s.endswith(","):
            # ALL CAPS veya Title Case kısa satır
            letters = [c for c in s if c.isalpha()]
            if letters:
                upper = sum(1 for c in letters if c.isupper()) / len(letters)
                if upper > 0.7 and len(letters) >= 6:
                    is_head = True
                elif (
                    upper < 0.15
                    and len(s.split()) <= 10
                    and s[0].isupper()
                    and not s.startswith("•")
                ):
                    # olası alt başlık (Türkçe sentence değil)
                    if re.search(r"(Tarihi|Süreci|Dönemi|Dönemleri|Sorunları|Etkileşim|Bilgisi|Hakkında|Meseleleri|Özellikleri|Kavramı|Anlamı|Önemi)", s):
                        is_head = True
        if is_head:
            sections.append([s])
            heading = s
        else:
            sections[-1].append(ln)
    out: list[tuple[str, str]] = []
    # pre-heading
    if sections and sections[0]:
        body = "\n".join(sections[0]).strip()
        if len(body) > 200:
            out.append(("", body))
    for sec in sections[1:]:
        h = sec[0].strip()
        body = "\n".join(sec[1:]).strip()
        if len(body) < 80:
            continue
        out.append((h, body))
    if not out:
        out.append(("", text[:6000]))
    return out


STOP_HEAD = (
    "kazanim", "kazanım", "unite ozeti", "ünite özeti", "degerlendirme",
    "sorularla", "etkinlik", "kavramlar", "kaynakca", "kaynakça",
    "icindekiler", "içindekiler", "ozet", "özet", "giris", "giriş",
)


def pick_paragraphs(body: str, max_chars: int = 4800) -> str:
    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    picked: list[str] = []
    total = 0
    for p in paras:
        # tek satır listeleri / tabloları atla
        if p.count("\n") >= 4 and len(p) < 400:
            continue
        if len(p) < 140:
            continue
        f = fold(p.splitlines()[0][:40])
        if any(f.startswith(x) for x in STOP_HEAD):
            continue
        # çok kısa cümle kalabalığı
        if p.count(".") >= 12 and len(p) < 200:
            continue
        picked.append(p)
        total += len(p)
        if total >= max_chars:
            break
    text = "\n\n".join(picked)
    if len(text) > max_chars:
        text = text[:max_chars].rsplit("\n", 1)[0].rstrip() + "…"
    return text


def related_cites(slug: str, chapter_n: int, past: list[dict], limit: int = 12) -> list[dict]:
    # annotate_questions ile ünite -> bölüm eşlemesi (export_past_exams_site ile aynı)
    try:
        from coursegraph.past_exams import annotate_questions, unit_to_chapters

        ch_map = unit_to_chapters(slug)
        rows = annotate_questions(slug)
    except Exception:
        rows, ch_map = past, {}

    def q_chapters(q):
        if q.get("chapters"):
            return list(q["chapters"])
        u = q.get("unit")
        return list(ch_map.get(u, [])) if u else []

    out: list[dict] = []
    sessions = sorted(
        rows,
        key=lambda s: str(s.get("year") or s.get("exam_id") or ""),
        reverse=True,
    )
    for exam in sessions:
        if len(out) >= limit:
            break
        for i, q in enumerate(exam.get("questions") or []):
            if len(out) >= limit:
                break
            if chapter_n in q_chapters(q):
                out.append(
                    {
                        "exam_id": exam.get("exam_id"),
                        "year": exam.get("year") or exam.get("exam_id"),
                        "num": i + 1,
                        "stem": (q.get("stem") or q.get("question") or "").strip()[:140],
                    }
                )
    return out


def embed_inline_markers(body: str, n_cites: int, n_markers: int = 6) -> str:
    """Paragraflar arasına ⟦k⟧ citation göm."""
    if n_cites <= 0 or not body.strip():
        return body
    paras = body.split("\n\n")
    idxs = [i for i, p in enumerate(paras) if len(p) > 100]
    if not idxs:
        return body
    k_max = min(n_markers, n_cites)
    step = max(1, len(idxs) // k_max)
    used = 0
    for j in range(k_max):
        pi = idxs[min(j * step, len(idxs) - 1)]
        marker = f"⟦{j + 1}⟧"
        if marker not in paras[pi]:
            paras[pi] = paras[pi].rstrip() + " " + marker
            used += 1
    return "\n\n".join(paras)


def build_notes(slug: str, idx: int, ch: dict, units: dict[int, dict], cites: list[dict]) -> str:
    unit_nos = MERGE_MAP.get(slug, {}).get(idx, [idx])
    parts: list[str] = [f"## {idx}. {ch['title']}", ""]
    if ch.get("summary"):
        parts += [ch["summary"].strip(), ""]
    objs = ch.get("objectives") or []
    if objs:
        parts += ["### Öğrenme hedefleri"]
        parts += [f"- {o}" for o in objs]
        parts.append("")

    for u in unit_nos:
        ud = units.get(u)
        if not ud:
            continue
        parts.append(f"### {ud['kind']} {u}: {ud['title']}")
        parts.append(
            f"*AÖF ders kitabı, {ud['kind']} {u}, PDF sayfa ~{ud['start'] + 1}-{ud['end'] + 1}.*"
        )
        parts.append("")
        secs = sectionize(ud["text"], ud["kind"])
        body_blocks: list[str] = []
        budget = 5200
        for h, body in secs:
            if fold(h).startswith(STOP_HEAD):
                continue
            if budget <= 800:
                break
            picked = pick_paragraphs(body, max_chars=min(3200, budget))
            budget -= len(picked)
            if not picked:
                continue
            if h:
                body_blocks.append(f"**{h}**\n\n{picked}")
            else:
                body_blocks.append(picked)
        if not body_blocks:
            body_blocks.append(pick_paragraphs(ud["text"], max_chars=4000))
        chapter_body = "\n\n".join(b for b in body_blocks if b)
        # not gövdesine citation göm
        chapter_body = embed_inline_markers(chapter_body, len(cites), n_markers=min(6, max(0, len(cites))))
        parts.append(chapter_body)
        parts.append("")

    if cites:
        parts.append("### İlgili çıkmış vize soruları")
        parts.append(
            "Metindeki ⟦n⟧ işaretleri bu listeye açılır. Alıntıya tıklayınca "
            "çözüm rehberinde soru açılır ve çözümü vurgulanır."
        )
        for j, ct in enumerate(cites, 1):
            stem = re.sub(r"\s+", " ", ct["stem"]).strip()
            parts.append(f"- [{j}] **{ct['year']} · Soru {ct['num']}**: {stem}")
        parts.append("")

    text = "\n".join(parts).strip() + "\n"
    text = text.replace("—", "-").replace("\u2014", "-")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def main() -> int:
    for slug in SLUGS:
        plan_path = DATA / slug / "study_plan.json"
        past_path = DATA / slug / "past_exams.json"
        if not plan_path.exists():
            print("skip", slug)
            continue
        plan = load_json(plan_path)
        past = load_json(past_path) if past_path.exists() else []
        if isinstance(past, dict):
            past = past.get("exams") or past.get("sessions") or []
        path = kitap_for(slug)
        print(f"=== {slug}: {path.name}", flush=True)
        doc = pymupdf.open(path)
        if slug == "ataturk-ilkeleri-1":
            units = parse_bolum_units(doc)
        else:
            units = parse_header_units(doc)
        for u in sorted(units):
            ud = units[u]
            ud["kind"] = "Bölüm" if slug == "ataturk-ilkeleri-1" else "Ünite"
            print(f"  {ud['kind']} {u}: {ud['title'][:50]} pages {ud['start']}-{ud['end']}")
        doc.close()

        chapters = plan["chapters"]
        for i, ch in enumerate(chapters, 1):
            cites = related_cites(slug, i, past)
            notes = build_notes(slug, i, ch, units, cites)
            ch["cites"] = cites
            ch.setdefault("grounding", {})
            ch["grounding"]["answer"] = notes
            ch["grounding"]["book_notes"] = {
                "source": path.name,
                "method": "unit-extract+v1",
                "inline_marker": "⟦k⟧",
            }
            print(f"  ch{i}: notes={len(notes)} cites={len(cites)} units={MERGE_MAP[slug][i]}")
        plan_path.write_text(
            json.dumps(plan, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print("wrote", plan_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
