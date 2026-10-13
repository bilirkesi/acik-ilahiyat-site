#!/usr/bin/env python3
"""Atatürk İlkeleri ve İnkılap Tarihi I - Çıkmış sınav PDF'lerinden past_exams.json.

Aynı gecikmeli etiket formatı (Türk Dili I): gövde, "N.", seçenek metinleri, sonra A)...
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
SLUG = "ataturk-ilkeleri-1"
ASSETS = ROOT / "assets" / SLUG / "aof"
OUT = ROOT / "data" / SLUG / "past_exams.json"

BOILER_SNIPS = [
    "Açıköğretim Sistemi ile ilgili merak ettiğiniz her şey AOSDESTEK Sisteminde.",
    "AOSDESTEK Sistemine aosdestek.anadolu.edu.tr adresinden ulaşabilirsiniz.",
    "Anadolu Üniversitesi tarafından hazırlanmış olan bu testlerin her hakkı saklıdır.",
    "peşinen kabullenmiş sayılır.",
    "Turnusol",
    "Anadolu Üniversitesi Açıköğretim Sistemi",
    "Bu derste öğrenme çıktılarına/amaçlarına",
    "göre bilgisayar sistemleriyle aşağıdaki",
    "sorulardan seçkisiz (random) yöntemle",
    "testler oluşturulmuştur.",
]

_HEADER_PATTERNS = [
    re.compile(r"20\d{2}\s*-\s*20\d{2}\s*(?:Öğretim\s+Yılı)?"),
    re.compile(r"Güz\s+Dönemi\s+Ara\s+Sınav[ıi]?"),
    re.compile(r"Bahar\s+Dönemi\s+(?:Ara\s+Sınav[ıi]?|Final)"),
    re.compile(r"Yaz\s+(?:Okulu|Dönemi)\s+.*(?:Ara|Final|Sınav)?"),
    re.compile(r"Ara\s+Sınav[ıi]?"),
    re.compile(r"Final\s+Sınav[ıi]?"),
    re.compile(r"ATAT[ÜU]RK\s+[İI]LKELER[İI]\s+VE\s+[İI]NKILAP\s+TAR[İI]H[İI]-?I\b"),
    re.compile(r"Anadolu\s+Üniversitesi", re.I),
    re.compile(r"testlerin\s+haz\s+.*külfeti"),
    re.compile(r"Hangi\s+amaçla\s+olursa\s+olursun.*?yasakt[ıi]r\.?", re.S),
    re.compile(r"Bu\s+yasağa\s+uymayanlar.*?külfeti"),
]

FILE_META = {
    "ATATÜRK İLKELERİ VE İNKILAP TARİHİ I - Çıkmış Sınav Soruları.pdf": {"year": 2021, "term": "guz"},
    "ATATÜRK İLKELERİ VE İNKILAP TARİHİ I - Çıkmış Sınav Soruları (1).pdf": {"year": 2022, "term": "guz"},
    "ATATÜRK İLKELERİ VE İNKILAP TARİHİ I - Çıkmış Sınav Soruları (2).pdf": {"year": 2023, "term": "guz"},
    "ATATÜRK İLKELERİ VE İNKILAP TARİHİ I - Çıkmış Sınav Soruları (3).pdf": {"year": 2024, "term": "guz"},
    "ATATÜRK İLKELERİ VE İNKILAP TARİHİ I - Çıkmış Sınav Soruları (4).pdf": {"year": 2025, "term": "guz"},
}

OPT_LINE = re.compile(r"^([A-F])\)\s*$")
OPT_INLINE = re.compile(r"^([A-F])\)\s*(.+)$")
QNUM_LINE = re.compile(r"^(\d{1,2})\.\s*$")
# AÖF Atatürk formatında soru numaraları daima tek satırda; "9. Ordu" gibi
# seçenek metinlerinin yanlış qnum olmasını engellemek için inline kapalı.
QNUM_INLINE = re.compile(r"(?!)")  # never matches
YEAR_RE = re.compile(r"(20\d{2})\s*-\s*(20\d{2})")
KEY_HEADER = re.compile(r"([AB])\s*Grubu\s*Cevap\s*Anahtarı", re.I)


def strip_boiler(text: str) -> str:
    for s in BOILER_SNIPS:
        text = text.replace(s, " ")
    text = re.sub(r"Hangi amaçla olursa olsun.*?mali külfeti", " ", text, flags=re.S)
    text = re.sub(r"peşinen kabullenmiş sayılır\.", " ", text)
    return text


def strip_header_noise(text: str) -> str:
    """Soru gövdesinden oturum başlıklarını ve rastgele grup harfini temizle."""
    out_lines = []
    for ln in text.splitlines():
        s = ln.strip()
        if not s:
            continue
        if re.fullmatch(r"[AB]", s):
            continue
        s = re.sub(r"testler oluşturulmuştur\.\s*[AB]\s*$", " ", s)
        s = re.sub(r"\btestler oluşturulmuştur\.\s*$", " ", s)
        drop = False
        for pat in _HEADER_PATTERNS:
            if pat.fullmatch(s) or pat.match(s) and len(s) < 80:
                # drop pure header lines
                if pat.search(s) and len(s) < 90:
                    drop = True
                    break
        if drop:
            continue
        # strip leftover year/term tokens from mixed lines
        for pat in (
            re.compile(r"20\d{2}\s*-\s*20\d{2}\s*(?:Öğretim\s+Yılı)?"),
            re.compile(r"Güz\s+Dönemi\s+Ara\s+Sınav[ıi]?"),
            re.compile(r"ATAT[ÜU]RK\s+[İI]LKELER[İI]\s+VE\s+[İI]NKILAP\s+TAR[İI]H[İI]-?I\b"),
            re.compile(r"Anadolu\s+Üniversitesi", re.I),
        ):
            s = pat.sub(" ", s)
        s = re.sub(r"\s+", " ", s).strip()
        if s:
            out_lines.append(s)
    return "\n".join(out_lines)


def page_lines(page) -> list[str]:
    raw = page.extract_text() or ""
    raw = strip_boiler(raw)
    raw = strip_header_noise(raw)
    lines = []
    for ln in raw.splitlines():
        ln = ln.strip()
        if not ln:
            continue
        if re.fullmatch(r"\d{1,2}/\d{1,2}", ln):
            continue
        if re.fullmatch(r"20\d{2}(?:[- ]\d{2})?\s+GÜZ\s+ARA\s*-\s*[AB](?:\s*\d*)?", ln, re.I):
            continue
        if re.fullmatch(r"20\d{2}[- ]\d{2}\s+GÜZ\s+ARA\s*-\s*[AB]", ln, re.I):
            continue
        if "AOSDESTEK" in ln or "aosdestek" in ln:
            continue
        if "Anadolu Üniversitesi tarafından hazırlanmış" in ln:
            continue
        if "Hangi amaçla olursa olsun" in ln:
            continue
        if "peşinen kabullenmiş" in ln:
            continue
        if re.fullmatch(r"\d{1,2}", ln) and not QNUM_LINE.match(ln):
            # bare page number
            continue
        lines.append(ln)
    return lines


def parse_answer_key(text: str) -> dict[int, str] | None:
    text = strip_boiler(text)
    # Grid rows + short tail rows (e.g. "61 62" / "C D")
    nums_re = re.compile(r"(?m)^\s*((?:\d{1,2}\s*){2,}\d{1,2})\s*$")
    lets_re = re.compile(r"(?m)^\s*((?:[A-EİI]\s*){2,}[A-EİI])\s*$")
    nums_groups = [[int(x) for x in row.split()] for row in nums_re.findall(text)]
    let_rows = lets_re.findall(text)
    nums: list[int] = []
    for g in nums_groups:
        nums.extend(g)
    letters: list[str] = []
    for row in let_rows:
        for tok in row.split():
            letters.append("I" if tok in ("İ", "I") else tok)
    if len(letters) < len(nums):
        key_section = text[text.find("Cevap Anahtarı") :] if "Cevap Anahtarı" in text else text
        seq = []
        for tok in re.findall(r"\b([A-EİI])\b", key_section):
            seq.append("I" if tok in ("İ", "I") else tok)
        if len(seq) >= len(nums):
            letters = seq[-len(nums) :]
    if not nums or len(letters) < len(nums):
        key: dict[int, str] = {}
        for nrow, lrow in zip(nums_groups, let_rows):
            ns = [int(x) for x in nrow]
            ls = ["I" if t in ("İ", "I") else t for t in lrow.split()]
            for n, l in zip(ns, ls):
                key[n] = l
        return key if key else None
    key = dict(zip(nums, letters))
    return key if key else None


def parse_question_pages(lines: list[str]) -> list[dict]:
    """Stem-first, delayed option labels. Returns questions with n, stem, options."""
    # Build event stream of numbers and option markers
    events: list[tuple] = []  # (kind, value, idx_in_lines)
    for i, ln in enumerate(lines):
        m = OPT_LINE.match(ln)
        if m:
            events.append(("opt", m.group(1), i))
            continue
        m = OPT_INLINE.match(ln)
        if m:
            events.append(("opt_inline", (m.group(1), m.group(2)), i))
            continue
        m = QNUM_LINE.match(ln)
        if m:
            events.append(("qnum", int(m.group(1)), i))
            continue
        m = QNUM_INLINE.match(ln)
        if m:
            events.append(("qnum_inline", (int(m.group(1)), m.group(2)), i))
            continue

    # Walk: when we see qnum, stem is non-option text between previous option end and qnum
    questions: list[dict] = []
    qnum_positions = [e for e in events if e[0] in ("qnum", "qnum_inline")]
    if not qnum_positions:
        return questions

    for qi, (kind, val, li) in enumerate(qnum_positions):
        if kind == "qnum":
            n = val
            stem_lines = []
            # lines after previous question's last option / before this qnum
            start = 0
            if qi > 0:
                prev = qnum_positions[qi - 1]
                start = prev[2] + 1
                # find last option marker of prev in events after prev
                last_opt = None
                for e in events:
                    if e[0] in ("opt", "opt_inline") and e[2] > prev[2] and e[2] < li:
                        last_opt = e[2]
                if last_opt is not None:
                    start = last_opt + 1
            for j in range(start, li):
                ln = lines[j]
                if OPT_LINE.match(ln) or OPT_INLINE.match(ln):
                    continue
                # skip group letter alone
                if re.fullmatch(r"[AB]", ln):
                    continue
                stem_lines.append(ln)
            stem = " ".join(stem_lines).strip()
            # options after this qnum until next qnum
            end = qnum_positions[qi + 1][2] if qi + 1 < len(qnum_positions) else len(lines)
            options = _collect_options(lines, li + 1, end)
        else:
            n, first_opt_text = val
            stem_lines = []
            start = 0
            if qi > 0:
                prev = qnum_positions[qi - 1]
                start = prev[2] + 1
                last_opt = None
                for e in events:
                    if e[0] in ("opt", "opt_inline") and e[2] > prev[2] and e[2] < li:
                        last_opt = e[2]
                if last_opt is not None:
                    start = last_opt + 1
            for j in range(start, li):
                ln = lines[j]
                if OPT_LINE.match(ln) or OPT_INLINE.match(ln):
                    continue
                if re.fullmatch(r"[AB]", ln):
                    continue
                stem_lines.append(ln)
            stem = " ".join(stem_lines).strip()
            end = qnum_positions[qi + 1][2] if qi + 1 < len(qnum_positions) else len(lines)
            options = _collect_options(lines, li, end)
            # first option text may be on same line as qnum
            if options and first_opt_text and not options[0].get("text"):
                options[0]["text"] = first_opt_text.strip()
            elif first_opt_text:
                # qnum line holds first option body; label comes next
                if options:
                    options[0]["text"] = (options[0].get("text") or first_opt_text).strip()

        # Deduplicate consecutive option texts; drop empties
        clean_opts = []
        seen = set()
        for o in options:
            t = re.sub(r"\s+", " ", (o.get("text") or "")).strip()
            if not t:
                continue
            if t in seen:
                continue
            seen.add(t)
            clean_opts.append({"key": o["key"], "text": t})
        # Ensure 5 options A-E if we have at least 4
        keys = [o["key"] for o in clean_opts]
        if len(clean_opts) >= 4:
            stem = clean_stem(stem)
            if len(stem) < 8:
                continue
            questions.append({"n": n, "stem": stem, "options": clean_opts})
    return questions


def clean_stem(stem: str) -> str:
    stem = re.sub(r"\s+", " ", stem or "").strip()
    stem = re.sub(
        r"^(?:20\d{2}\s*-\s*20\d{2}\s*)?(?:Öğretim\s+Yılı\s*)?(?:Güz|Bahar|Yaz)\s*(?:Dönemi)?\s*(?:Ara\s*)?Sınav[ıi]?\s*",
        "",
        stem,
    )
    stem = re.sub(r"^ATAT[ÜU]RK\s+[İI]LKELER[İI]\s+VE\s+[İI]NKILAP\s+TAR[İI]H[İI]-?I\s*", "", stem)
    stem = re.sub(r"^Bu derste öğrenme çıktlarına/amaçlarına.*?testler oluşturulmuştur\.?\s*", "", stem)
    stem = re.sub(r"^Bu derste öğrenme çıktlarına/amaçlarına göre bilgisayar sistemleriyle aşağıdaki sorulardan seçkisiz \(random\) yöntemle testler oluşturulmuştur\.?\s*", "", stem)
    stem = re.sub(r"\s+", " ", stem).strip(" ,-")
    return stem


def _collect_options(lines: list[str], start: int, end: int) -> list[dict]:
    """Parse options where label line may follow option text (delayed labels)."""
    opts: list[dict] = []
    pending_text: list[str] = []
    labels = "ABCDEF"
    for ln in lines[start:end]:
        m = OPT_LINE.match(ln)
        if m:
            text = " ".join(pending_text).strip()
            pending_text = []
            opts.append({"key": m.group(1), "text": text})
            continue
        m = OPT_INLINE.match(ln)
        if m:
            key, text = m.group(1), m.group(2).strip()
            if pending_text:
                # previous text belongs to this option? unlikely with inline
                pass
            opts.append({"key": key, "text": text})
            continue
        if re.fullmatch(r"[AB]", ln):
            continue
        if QNUM_LINE.match(ln) or QNUM_INLINE.match(ln):
            break
        pending_text.append(ln)
    # If last labels without text, attach leftover
    if pending_text and opts and not opts[-1].get("text"):
        opts[-1]["text"] = " ".join(pending_text).strip()
    # If texts exist without matching labels (delayed: text then label on own line handled),
    # re-pair when pattern is: text, label for next option.
    # Already handled: text lines accumulate, label closes them.
    return opts


def detect_group(pages_text: list[str]) -> str:
    for t in pages_text:
        if re.search(r"\bGrubu\b", t) and re.search(r"\bA\b", t):
            if "B Grubu" in t:
                return "B"
        if re.search(r"^\s*B\s*$", t, re.M):
            return "B"
        if re.search(r"\bB\s*Grubu\b", t):
            return "B"
        if re.search(r"^\s*A\s*$", t, re.M) or "A Grubu" in t:
            return "A"
    return "A"


def extract_pdf(path: Path) -> list[dict]:
    meta = FILE_META.get(path.name, {"year": None, "term": "guz"})
    reader = PdfReader(str(path))
    pages = [page_lines(p) for p in reader.pages]
    raw_pages = [strip_boiler(p.extract_text() or "") for p in reader.pages]

    sessions: list[dict] = []
    # Split by answer-key pages: questions accumulate until key, then flush
    current_lines: list[str] = []
    current_group = "A"
    pending: list[dict] = []
    group_pages: dict[str, list[str]] = {"A": [], "B": []}
    # Determine if multi-group file
    has_b = any(re.search(r"B Grubu|^\s*B\s*$", t, re.M) for t in raw_pages)
    has_a_key = any("A Grubu Cevap Anahtarı" in t for t in raw_pages)
    has_b_key = any("B Grubu Cevap Anahtarı" in t for t in raw_pages)

    # Assign pages to groups: before B section -> A, after -> B
    in_b = False
    for pi, (lns, raw) in enumerate(zip(pages, raw_pages)):
        if re.search(r"B Grubu Cevap Anahtarı", raw) or (
            has_b and re.search(r"(?m)^\s*B\s*$", raw) and "Cevap Anahtarı" not in raw and pi > 0
        ):
            # page starts B group questions (bare B near top)
            top = "\n".join(raw.splitlines()[:12])
            if re.search(r"(?m)^\s*B\s*$", top) or "B Grubu" in top:
                in_b = True
        grp = "B" if in_b else "A"
        # key page?
        if "Cevap Anahtarı" in raw:
            key = parse_answer_key(raw)
            group_pages[grp] = current_lines[:]
            current_lines = []
            if key:
                questions = parse_question_pages(group_pages[grp])
                # apply corrections note
                corr = re.search(r"(\d{1,2})\.Sorunun cevabı\s*([A-E])\s*olarak güncellenmiştir", raw)
                corrections = {}
                if corr:
                    corrections[int(corr.group(1))] = corr.group(2)
                for q in questions:
                    letter = key.get(q["n"]) or corrections.get(q["n"])
                    if letter:
                        q["correct"] = letter
                        for o in q["options"]:
                            o["isCorrect"] = o["key"] == letter
                year = meta["year"]
                # try from raw
                ym = YEAR_RE.search(raw)
                if ym:
                    year = int(ym.group(1))
                sessions.append(
                    {
                        "exam_id": f"{year}{year+1}-{meta['term']}-vize-{grp.lower()}",
                        "year": f"{year}/{year + 1}",
                        "term": meta["term"],
                        "group": grp,
                        "file": path.name,
                        "questions": questions,
                        "corrections": corrections or None,
                    }
                )
            in_b = False
            group_pages["B"] = []
            continue
        current_lines.extend(lns)

    # leftover without key page
    if current_lines:
        questions = parse_question_pages(current_lines)
        if questions:
            ym = YEAR_RE.search(" ".join(raw_pages[:1]))
            year = int(ym.group(1)) if ym else meta["year"]
            sessions.append(
                {
                    "exam_id": f"{year}{year + 1}-{meta['term']}-vize-{current_group.lower()}",
                    "year": f"{year}/{year + 1}" if year else "",
                    "term": meta["term"],
                    "group": current_group,
                    "file": path.name,
                    "questions": questions,
                }
            )
    return sessions


def main() -> int:
    if not ASSETS.exists():
        print("missing", ASSETS)
        return 1
    all_sessions: list[dict] = []
    for path in sorted(ASSETS.glob("*Sınav*.pdf")):
        print("extract", path.name)
        sessions = extract_pdf(path)
        for s in sessions:
            n = len(s["questions"])
            keyed = sum(1 for q in s["questions"] if q.get("correct"))
            print(f"  {s['exam_id']}: {n} soru, {keyed} anahtarlı")
            if n == 0:
                continue
            all_sessions.append(s)
    # sort newest first
    all_sessions.sort(key=lambda s: str(s.get("year") or ""), reverse=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(all_sessions, ensure_ascii=False, indent=1),
        encoding="utf-8-sig",
    )
    total = sum(len(s["questions"]) for s in all_sessions)
    keyed = sum(1 for s in all_sessions for q in s["questions"] if q.get("correct"))
    print(f"wrote {OUT} sessions={len(all_sessions)} questions={total} keyed={keyed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
