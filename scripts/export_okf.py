#!/usr/bin/env python3
"""Ders verisini OKF (Open Knowledge Format) v0.2 bundle'ına çevirir.

Kaynak:
  courses.json, data/<slug>/{study_plan,quiz,manifest,unit_infographics}.json,
  site/interactive.js (window.INTERACTIVE), artifacts/catalog.json

assets/ ve artifacts/ git'e girmez. Bulunmadıklarında (ör. temiz bir klon)
infoğrafikler site/assets/<slug>/ altındaki JPG'lerden, artifact katalogları
mevcut okf/courses/<slug>/artifacts.md'den korunur.

Çıktı: okf/ dizini (bundle root; index.md ile okf_version: "0.2")
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
OKF = ROOT / "okf"
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
ACTOR = "acik-ilahiyat-exporter/1.0"

# Ders listesi courses.json'dan gelir (sıra: main() içinde)
SLUGS: list[str] = []

SEMESTER_TR = {
    "guz": "Güz",
    "bahar": "Bahar",
    "yaz": "Yaz",
}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def university_label(unis: dict, uid: str) -> str:
    u = unis.get(uid, {})
    short = u.get("short") or u.get("name") or uid
    return short


def semester_label(code: str) -> str:
    return SEMESTER_TR.get(code, code or "-")


def dump_interactive() -> dict:
    js = r"""
global.window = {};
require(process.argv[2]);
process.stdout.write(JSON.stringify(global.window.INTERACTIVE));
"""
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js)
        tmp = f.name
    interactive_path = str(ROOT / "site" / "interactive.js").replace("\\", "/")
    out = subprocess.check_output(
        ["node", tmp, interactive_path], text=True, encoding="utf-8"
    )
    Path(tmp).unlink(missing_ok=True)
    return json.loads(out)


def clean_grounding(text: str) -> str:
    """NotebookLM sohbet artıklarını ve em dash'i OKF gövdesinden temizle."""
    text = re.sub(r"\s*\u2014\s*", ", ", text or "")
    lines = [ln.rstrip() for ln in (text or "").splitlines()]
    drop_re = re.compile(
        r"^(?:📚|Bu ünite|Bu bölüm|Bu ders|Hazırlamamı|ister misiniz|"
        r"Ek olarak|İsterseniz|Aşağıdaki|Not:|Tip:|İpucu:)",
        re.I,
    )
    cleaned: list[str] = []
    for ln in lines:
        s = ln.strip()
        if drop_re.match(s) and s.endswith("?"):
            continue
        if s.startswith("📚"):
            continue
        cleaned.append(ln)
    out = "\n".join(cleaned).strip()
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out


def aof_infographic_block(slug: str, unit: int, title: str) -> str:
    """Çok sayfalı ünitelerde sayfa PNG'lerini, tek sayfada stitch'i listeler."""
    assets = ROOT / "assets" / slug
    ext = "png"
    if not any(assets.glob(f"aof-infographic-{unit}*.png")):
        # temiz klonda kaynak PNG'ler yok; sitede yayınlanan JPG'leri kullan
        assets = ROOT / "site" / "assets" / slug
        ext = "jpg"
    pages = sorted(
        assets.glob(f"aof-infographic-{unit}-p*.{ext}"),
        key=lambda p: int(re.search(r"-p(\d+)\.", p.name).group(1)),
    )
    stitched = assets / f"aof-infographic-{unit}.{ext}"
    lines = ["# AÖF Ünite İnfoğrafik\n"]
    if pages:
        lines.append(f"Ünite {unit} infoğrafik sayfaları:\n")
        for pi, p in enumerate(pages, 1):
            rel = f"/assets/{slug}/{p.name}"
            lines.append(f"![{title} AÖF infoğrafik sayfa {pi}/{len(pages)}]({rel})\n")
    elif stitched.exists():
        rel = f"/assets/{slug}/{stitched.name}"
        lines.append(f"![{title} AÖF infoğrafik]({rel})\n")
    else:
        return ""
    lines.append(
        f"Kaynak PDF: `assets/{slug}/aof/` (Anadolu Üniversitesi ünite infoğrafikleri).\n"
    )
    return "\n".join(lines)


def load_unit_quizzes(slug: str) -> list[dict]:
    """data/<slug>/unit_quizzes/unit-N.json; şıklar sitedeki sırayla karıştırılır."""
    from scripts.export_unit_quizzes_site import shuffle_options

    d = ROOT / "data" / slug / "unit_quizzes"
    out = []
    for f in sorted(d.glob("unit-*.json"), key=lambda f: int(f.stem.split("-")[-1])):
        data = load_json(f)
        qs = data.get("questions") or []
        if qs:
            out.append({**data, "unit": int(data.get("unit") or f.stem.split("-")[-1]),
                        "questions": [shuffle_options(q) for q in qs]})
    return out


def load_book_units(slug: str) -> list[dict]:
    path = ROOT / "data" / slug / "unit_infographics.json"
    if not path.exists():
        return []
    return load_json(path).get("units", [])


def book_unit_image(slug: str, unit: int) -> str:
    img = ROOT / "site" / "assets" / slug / f"kitap-unite-{unit}.jpg"
    return f"/assets/{slug}/{img.name}" if img.exists() else ""


def render_book_unit(slug: str, u: dict, level: str = "##") -> str:
    lines = [f"{level} Ünite {u['unit']}: {u.get('title', '')}\n"]
    if u.get("lead"):
        lines.append(f"{u['lead']}\n")
    img = book_unit_image(slug, u["unit"])
    if img:
        lines.append(f"![Ünite {u['unit']} ders kitabı infoğrafiği]({img})\n")
    for sec in u.get("sections", []):
        lines.append(f"**{sec.get('heading', '')}**\n")
        lines.append("\n".join(f"* {pt}" for pt in sec.get("points", [])) + "\n")
    if u.get("keywords"):
        lines.append(f"*Anahtar kelimeler:* {', '.join(u['keywords'])}\n")
    return "\n".join(lines)


def slugify(text: str, maxlen: int = 48) -> str:
    import unicodedata

    repl = {
        "ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g",
        "ü": "u", "Ü": "u", "ö": "o", "Ö": "o", "ç": "c", "Ç": "c",
        "â": "a", "î": "i", "û": "u",
    }
    s = text
    for a, b in repl.items():
        s = s.replace(a, b)
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:maxlen].strip("-") or "concept"


def yaml_str(v: str) -> str:
    if v is None:
        return '""'
    s = str(v)
    # flow mappings like { by: ..., at: ... } stay unquoted YAML
    if re.fullmatch(r"\{[^}]+\}", s):
        return s
    if any(c in s for c in ":#{}[]&*?|><=!%@`") or s != s.strip() or s == "":
        return json.dumps(s, ensure_ascii=False)
    return s


def fm(lines: list[tuple[str, str]]) -> str:
    body = "\n".join(f"{k}: {yaml_str(v)}" for k, v in lines)
    return f"---\n{body}\n---\n\n"


def render_fm(lines: list[tuple[str, str]], sources_entries: list[str] | None = None) -> str:
    parts = [f"{k}: {yaml_str(v)}" for k, v in lines]
    if sources_entries:
        parts.append("sources:")
        parts.extend(sources_entries)
    return "---\n" + "\n".join(parts) + "\n---\n\n"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # OKF ve site house rule: em dash yasak
    content = content.replace("\u2014", "-")
    path.write_text(content, encoding="utf-8")


def md_escape_cell(s: str) -> str:
    return str(s).replace("|", "\\|").replace("\n", " ")


def render_question_block(n: int, q: dict) -> str:
    lines = [f"## {n}. {q.get('question', '')}\n"]
    if q.get("hint"):
        lines.append(f"*İpucu:* {q['hint']}\n")
    for j, opt in enumerate(q.get("answerOptions", [])):
        mark = " *" if opt.get("isCorrect") else ""
        letter = chr(ord("A") + j)
        lines.append(f"{letter}) {opt.get('text', '')}{mark}")
    lines.append("")
    correct = [chr(ord("A") + j) for j, o in enumerate(q.get("answerOptions", [])) if o.get("isCorrect")]
    if correct:
        lines.append(f"**Cevap anahtarı:** {', '.join(correct)}\n")
    for j, opt in enumerate(q.get("answerOptions", [])):
        if opt.get("isCorrect") and opt.get("rationale"):
            letter = chr(ord("A") + j)
            lines.append(f"**Gerekçe ({letter}):** {opt['rationale']}\n")
    solution = q.get("solution") or q.get("explanation") or q.get("why") or ""
    if solution:
        lines.append(f"### Çözüm\n\n{solution}\n")
    tags = q.get("tags") or []
    if tags:
        lines.append(f"*Etiketler:* {', '.join(str(t) for t in tags)}\n")
    return "\n".join(lines)


def main() -> int:
    # artifacts/ yoksa (temiz klon) mevcut katalog sayfalarını koru
    prev_artifacts = {
        p.parent.name: p.read_text(encoding="utf-8")
        for p in (OKF / "courses").glob("*/artifacts.md")
    }
    prev_log = (OKF / "log.md").read_text(encoding="utf-8") if (OKF / "log.md").exists() else ""

    # temiz yeniden üretim
    if OKF.exists():
        import shutil

        shutil.rmtree(OKF)

    courses = load_json(ROOT / "courses.json")
    SLUGS[:] = [s for s in courses if (ROOT / "data" / s / "study_plan.json").exists()]
    unis = load_json(ROOT / "universities.json") if (ROOT / "universities.json").exists() else {}
    interactive = dump_interactive()
    catalog = load_json(ROOT / "artifacts" / "catalog.json") if (ROOT / "artifacts" / "catalog.json").exists() else []
    by_course_cat: dict[str, dict[str, list]] = {}
    for e in catalog:
        by_course_cat.setdefault(e["course"], {}).setdefault(e["category"], []).append(e)

    # dersleri üniversite + döneme göre grupla
    by_uni: dict[str, list[str]] = {}
    by_term: dict[tuple[str, str], list[str]] = {}
    for s in SLUGS:
        if s not in courses:
            continue
        c = courses[s]
        uid = c.get("university_id") or "aof"
        year = c.get("academic_year") or "bilinmiyor"
        sem = c.get("semester") or "guz"
        by_uni.setdefault(uid, []).append(s)
        by_term.setdefault((year, sem), []).append(s)

    write(
        OKF / "index.md",
        fm(
            [
                ("okf_version", '"0.2"'),
                ("type", "Bundle Index"),
                ("title", "Açık İlahiyat Ders Bilgisi"),
                ("description", "AÖF / İÜ gibi kaynak üniversitelere göre ayrılmış ders bilgisi: yıl, dönem, bölümler, sınavlar, artifact kataloğu."),
                ("language", "tr"),
                ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
            ]
        )
        + "# Üniversiteler\n\n"
        + "\n".join(
            f"* [{university_label(unis, uid)}](/universities/{uid}.md) - {len(slugs)} ders"
            for uid, slugs in sorted(by_uni.items())
        )
        + "\n\n# Dönemler\n\n"
        + "\n".join(
            f"* [{year} {semester_label(sem)}](/terms/{year}/{sem}.md) - {len(slugs)} ders"
            for (year, sem), slugs in sorted(by_term.items())
        )
        + "\n\n# Dersler\n\n"
        + "\n".join(
            f"* [{courses[s]['subject']}](/courses/{s}.md) - "
            f"{university_label(unis, courses[s].get('university_id', 'aof'))} · "
            f"{courses[s].get('academic_year', '')} {semester_label(courses[s].get('semester', 'guz'))} · "
            f"{courses[s].get('course_code', '')}"
            for s in SLUGS
            if s in courses
        )
        + "\n\n# Yardımcılar\n\n"
        + "* [Artifact kataloğu](/artifacts/index.md) - NotebookLM çıktıları\n"
        + "* [Dizin](/courses/index.md)\n",
    )

    history = prev_log.split("\n", 1)[1].lstrip("\n") if prev_log.startswith("# Bundle Log") else (
        "## 2026-10-13\n"
        "* **Update**: Üniversite + yıl + dönem (güz/bahar) hiyerarşisi eklendi.\n"
        "* **Creation**: İlk OKF export (courses.json, study_plan, quiz, interactive panel, artifact catalog).\n"
    )
    entry = (
        f"## {NOW[:10]}\n"
        f"* **Update**: Yeniden export; dersler: {', '.join(SLUGS)}.\n"
    )
    if history.startswith(entry):
        history = history[len(entry):].lstrip("\n")
    write(OKF / "log.md", f"# Bundle Log\n\n{entry}\n{history}")

    # universities index + pages
    uni_lines = ["# Üniversiteler\n"]
    for uid in sorted(by_uni):
        u = unis.get(uid, {})
        name = u.get("name", uid)
        short = u.get("short", uid)
        faculty = u.get("faculty", "")
        uni_lines.append(f"* [{short} - {name}]({uid}.md) - {faculty}, {len(by_uni[uid])} ders")
        course_rows = []
        for s in by_uni[uid]:
            c = courses[s]
            course_rows.append(
                f"* [{c.get('subject', s)}](/courses/{s}.md) - "
                f"{c.get('course_code', '')} · {c.get('academic_year', '')} "
                f"{semester_label(c.get('semester', 'guz'))} · seviye {c.get('level', '-')}"
            )
        write(
            OKF / "universities" / f"{uid}.md",
            fm(
                [
                    ("type", "University"),
                    ("title", name),
                    ("description", f"{faculty}. {u.get('note', '')}".strip()),
                    ("university_id", uid),
                    ("short_name", short),
                    ("program", u.get("program", "")),
                    ("language", "tr"),
                    ("status", "stable"),
                    ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
                ]
                + ([("resource", u["url"])] if u.get("url") else [])
            )
            + f"# Dersler ({len(by_uni[uid])})\n\n" + "\n".join(course_rows) + "\n",
        )
    write(OKF / "universities" / "index.md", "\n".join(uni_lines) + "\n")

    # terms index + pages
    term_lines = ["# Akademik Dönemler\n"]
    for (year, sem), slugs in sorted(by_term.items()):
        tdir = OKF / "terms" / year / f"{sem}.md"
        rows = []
        for s in slugs:
            c = courses[s]
            rows.append(
                f"* [{c.get('subject', s)}](/courses/{s}.md) - "
                f"{university_label(unis, c.get('university_id', 'aof'))} · {c.get('course_code', '')}"
            )
        write(
            tdir,
            fm(
                [
                    ("type", "Academic Term"),
                    ("title", f"{year} {semester_label(sem)}"),
                    ("description", f"{year} öğretim yılı {semester_label(sem)} dönemi ders listesi."),
                    ("academic_year", year),
                    ("semester", sem),
                    ("term_code", courses[slugs[0]].get("term_code", "") if slugs else ""),
                    ("course_count", str(len(slugs))),
                    ("language", "tr"),
                    ("status", "stable"),
                    ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
                ]
            )
            + f"# Dersler ({len(slugs)})\n\n" + "\n".join(rows) + "\n",
        )
        term_lines.append(
            f"* [{year} {semester_label(sem)}]({year}/{sem}.md) - {len(slugs)} ders"
        )
    write(OKF / "terms" / "index.md", "\n".join(term_lines) + "\n")

    write(
        OKF / "courses" / "index.md",
        "# Dersler\n\n"
        "University ve dönem bilgisi her dersin frontmatter'ındadır.\n\n"
        + "\n".join(
            f"* [{courses[s]['subject']}]({s}.md) - "
            f"{university_label(unis, courses[s].get('university_id', 'aof'))} · "
            f"{courses[s].get('academic_year', '')} {semester_label(courses[s].get('semester', 'guz'))}"
            for s in SLUGS
            if s in courses
        )
        + "\n",
    )

    for slug in SLUGS:
        if slug not in courses:
            continue
        meta = courses[slug]
        manifest_path = ROOT / "data" / slug / "manifest.json"
        plan_path = ROOT / "data" / slug / "study_plan.json"
        quiz_path = ROOT / "data" / slug / "quiz.json"
        manifest = load_json(manifest_path) if manifest_path.exists() else {}
        plan = load_json(plan_path) if plan_path.exists() else {}
        quiz = load_json(quiz_path) if quiz_path.exists() else {}
        chapters = plan.get("chapters", [])
        references = plan.get("references", [])
        panel = interactive.get(slug, {})
        book_units = load_book_units(slug)
        unit_quizzes = load_unit_quizzes(slug)

        notebook_id = meta.get("notebook_id") or manifest.get("notebook_id")
        notebook_url = (
            f"https://notebooklm.google.com/notebook/{notebook_id}" if notebook_id else ""
        )
        resource = meta.get("playlist") or notebook_url

        course_fm = [
            ("type", "Course"),
            ("title", meta.get("subject", slug)),
            ("description", f"{meta.get('course', '')}. {meta.get('note', '')}".strip()[:300]),
            ("slug", slug),
            ("university", meta.get("university_id", "aof")),
            ("university_name", university_label(unis, meta.get("university_id", "aof"))),
            ("program", meta.get("program", "")),
            ("academic_year", meta.get("academic_year", "")),
            ("semester", meta.get("semester", "")),
            ("term_code", meta.get("term_code", "")),
            ("level", str(meta.get("level", ""))),
            ("ects_credits", str(meta.get("ects_credits", ""))),
            ("course_code", meta.get("course_code") or meta.get("course", "")),
            ("course_name", meta.get("course_name") or meta.get("subject", slug)),
            ("professor", meta.get("professor", "")),
            ("school", meta.get("school", "")),
            ("mode", meta.get("mode", "")),
            ("language", "tr"),
            ("status", meta.get("status", "stable")),
            ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
        ]
        if meta.get("source_provider"):
            course_fm.append(("source_provider", meta["source_provider"]))
        if resource:
            course_fm.append(("resource", resource))
        if notebook_url:
            course_fm.append(("notebook", notebook_url))

        body_parts = [
            f"# Üniversite ve Dönem\n\n"
            f"* Üniversite: [{university_label(unis, meta.get('university_id', 'aof'))}](/universities/{meta.get('university_id', 'aof')}.md)\n"
            f"* Program: {meta.get('program', '')}\n"
            f"* Akademik yıl: {meta.get('academic_year', '')}\n"
            f"* Dönem: {semester_label(meta.get('semester', 'guz'))}\n"
            f"* Kod: {meta.get('course_code', '')} - {meta.get('course_name', '')}\n"
            f"* AKTS: {meta.get('ects_credits', '')} | Seviye: {meta.get('level', '')}\n\n",
            f"# Özet\n\n{meta.get('note', '')}\n",
            f"# Yapı\n\n* [Bölümler](/courses/{slug}/chapters/index.md) ({len(chapters)})\n"
            + (f"* [Ders kitabı üniteleri](/courses/{slug}/units.md) ({len(book_units)})\n" if book_units else "")
            + f"* [Quiz](/courses/{slug}/quiz.md)\n"
            + (f"* [Ünite quizleri](/courses/{slug}/unit-quizzes/index.md) "
               f"({len(unit_quizzes)} ünite, {sum(len(u['questions']) for u in unit_quizzes)} soru)\n" if unit_quizzes else "")
            + f"* [Sınavlar](/courses/{slug}/exams/index.md) - vize, final, yaz kursu\n"
            f"* [Çıkmış vizeler](/courses/{slug}/exams/past/index.md)\n"
            f"* [Artifact'ler](/courses/{slug}/artifacts.md)\n",
        ]
        if panel.get("takeaways"):
            body_parts.append("# Panel Öne Çıkanları\n\n")
            for t in panel["takeaways"]:
                body_parts.append(f"* **{t.get('t', '')}** - {t.get('d', '')}\n")
        if panel.get("concepts"):
            body_parts.append("# Kavramlar\n\n| Terim | Tanım |\n| --- | --- |\n")
            for c in panel["concepts"]:
                body_parts.append(f"| {md_escape_cell(c.get('term', ''))} | {md_escape_cell(c.get('def', ''))} |\n")
        if panel.get("timeline"):
            body_parts.append("# Zaman Çizelgesi\n\n| Yıl | Olay | Açıklama |\n| --- | --- | --- |\n")
            for ev in panel["timeline"]:
                body_parts.append(
                    f"| {md_escape_cell(ev.get('year', ''))} | {md_escape_cell(ev.get('name', ''))} | {md_escape_cell(ev.get('desc', ''))} |\n"
                )
        if panel.get("matrix"):
            body_parts.append("# İhtilaf Matrisi\n\n")
            mx = panel["matrix"]
            if mx.get("rowTerm") or mx.get("hint"):
                body_parts.append(f"{mx.get('rowTerm', '')} {mx.get('hint', '')}\n\n")
            axes = mx.get("axes", [])
            rows = mx.get("rows", [])
            if axes and rows:
                body_parts.append("| " + " | ".join([""] + [md_escape_cell(a) for a in axes]) + " |\n")
                body_parts.append("| " + " | ".join(["---"] * (len(axes) + 1)) + " |\n")
                for r in rows:
                    cells = r.get("cells", [])
                    body_parts.append(
                        "| " + " | ".join([md_escape_cell(r.get("label", ""))] + [md_escape_cell(c) for c in cells]) + " |\n"
                    )
        if panel.get("tree"):
            body_parts.append("# Ekoller Ağacı\n\n")
            for node in panel["tree"]:
                body_parts.append(f"* **{node.get('label', '')}** - {node.get('desc', '')}\n")
                for br in node.get("branches", []):
                    body_parts.append(f"  * **{br.get('label', '')}** - {br.get('d', '')}\n")

        sources_entries = []
        if meta.get("playlist"):
            sources_entries.append(
                "  - id: playlist\n"
                f"    resource: {meta['playlist']}\n"
                "    title: Ders playlist\n"
                f"    author: {yaml_str(meta.get('school', ''))}"
            )
        if notebook_url:
            sources_entries.append(
                "  - id: notebooklm\n"
                f"    resource: {notebook_url}\n"
                "    title: NotebookLM çalışma notu\n"
                f"    author: {ACTOR}"
            )
        write(
            OKF / "courses" / f"{slug}.md",
            render_fm(course_fm, sources_entries) + "\n".join(body_parts),
        )

        # chapters
        ch_index = [f"# {meta.get('subject', slug)} Bölümleri\n"]
        for i, ch in enumerate(chapters, 1):
            title = ch.get("title", f"Bölüm {i}")
            fname = f"{i:02d}-{slugify(title)}.md"
            ch_index.append(f"* [{title}]({fname}) - {ch.get('summary', '')[:120]}")

            obj_list = "\n".join(f"{n}. {o}" for n, o in enumerate(ch.get("objectives", []), 1))
            lec_list = "\n".join(f"* {l}" for l in ch.get("lectures", [])) or "* (ders listesi yok)"

            aof_block = aof_infographic_block(slug, i, title)
            ch_units = [u for u in book_units if u.get("chapter") == i]
            book_block = ""
            if ch_units:
                book_block = "# Ders Kitabı Ünite Özeti\n\n" + "\n".join(
                    render_book_unit(slug, u) for u in ch_units
                )

            ch_body = [
                f"# Özet\n\n{ch.get('summary', '')}\n",
                aof_block,
                book_block,
                f"# Öğrenme Hedefleri\n\n{obj_list}\n" if obj_list else "",
                f"# Dersler\n\n{lec_list}\n",
            ]

            # per-chapter interactive: only course-level panel for now;
            # attach related concepts/timeline when chapter number is in title prefix
            # (panels are course-wide; embed course panel reference)
            ch_body.append(
                f"# İnteraktif Panel\n\nBu bölümün içinde yaşadığı ders paneli: "
                f"[{meta.get('subject', slug)} paneli](/courses/{slug}.md#panel-öne-çıkanları).\n"
            )

            grounding = ch.get("grounding") or {}
            if grounding.get("answer"):
                g = clean_grounding(grounding["answer"])
                if g:
                    ch_body.append(f"# Kaynak Temellendirme\n\n{g}\n")

            src_ids = ch.get("source_ids", [])
            if src_ids:
                ch_body.append(
                    "# Kaynaklar\n\n"
                    + "\n".join(f"* NotebookLM kaynağı `{sid}`" for sid in src_ids)
                    + "\n"
                )

            ch_fm = [
                ("type", "Chapter"),
                ("title", title),
                ("description", ch.get("summary", "")[:200]),
                ("course", slug),
                ("chapter", str(i)),
                ("status", "stable"),
                ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
            ]
            if notebook_url:
                ch_fm.append(("notebook", notebook_url))
            write(OKF / "courses" / slug / "chapters" / fname, fm(ch_fm) + "\n".join(x for x in ch_body if x))

        write(
            OKF / "courses" / slug / "chapters" / "index.md",
            "\n".join(ch_index) + "\n",
        )

        # ders kitabı ünite özetleri (unit_infographics.json)
        if book_units:
            spec = load_json(ROOT / "data" / slug / "unit_infographics.json")
            ch_files = {
                i: f"{i:02d}-{slugify(ch.get('title', f'Bölüm {i}'))}.md"
                for i, ch in enumerate(chapters, 1)
            }
            u_lines = [f"# {meta.get('subject', slug)} Ders Kitabı Üniteleri\n"]
            if spec.get("note"):
                u_lines.append(f"{spec['note']}\n")
            for u in book_units:
                u_lines.append(render_book_unit(slug, u))
                cn = u.get("chapter")
                if cn in ch_files:
                    u_lines.append(f"İlgili bölüm: [{cn}. bölüm](chapters/{ch_files[cn]})\n")
            u_fm = [
                ("type", "Book Units"),
                ("title", f"{meta.get('subject', slug)} ders kitabı üniteleri"),
                ("description", spec.get("source", "")),
                ("course", slug),
                ("unit_count", str(len(book_units))),
                ("status", "stable"),
                ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
            ]
            write(OKF / "courses" / slug / "units.md", fm(u_fm) + "\n".join(u_lines))

        # quiz
        questions = quiz.get("questions", [])
        q_lines = [
            f"# {quiz.get('title', 'Quiz')}\n",
            f"Toplam {len(questions)} soru. Doğru cevaplar `*` ile işaretli seçeneklerdir; gerekçe ve çözüm seçenek altındadır.\n",
        ]
        for n, q in enumerate(questions, 1):
            q_lines.append(render_question_block(n, q))
        quiz_fm = [
            ("type", "Quiz"),
            ("title", quiz.get("title", f"{meta.get('subject', slug)} Testi")),
            ("description", f"{meta.get('subject', slug)} dersi için {len(questions)} soruluk test."),
            ("course", slug),
            ("question_count", str(len(questions))),
            ("pass_mark", "0.7"),
            ("status", "stable"),
            ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
            ("resource", f"/courses/{slug}/quiz.md"),
        ]
        write(OKF / "courses" / slug / "quiz.md", fm(quiz_fm) + "\n".join(q_lines))

        # ünite quizleri
        if unit_quizzes:
            uq_index = [f"# {meta.get('subject', slug)} Ünite Quizleri\n",
                        "Doğru cevaplar `*` ile işaretlidir; şık sırası sitedekiyle aynıdır.\n"]
            for uq in unit_quizzes:
                n_u = uq["unit"]
                qs = uq["questions"]
                u_title = uq.get("unitTitle") or f"Ünite {n_u}"
                lines = [f"# Ünite {n_u}: {u_title}\n", f"Toplam {len(qs)} soru.\n"]
                lines += [render_question_block(k, q) for k, q in enumerate(qs, 1)]
                uq_fm = [
                    ("type", "Quiz"),
                    ("title", f"Ünite {n_u} quizi: {u_title}"),
                    ("description", f"{meta.get('subject', slug)} {n_u}. ünite için {len(qs)} soruluk quiz."),
                    ("course", slug),
                    ("unit", str(n_u)),
                    ("question_count", str(len(qs))),
                    ("status", "stable"),
                    ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
                    ("resource", f"/courses/{slug}/unit-quizzes/unit-{n_u}.md"),
                ]
                write(OKF / "courses" / slug / "unit-quizzes" / f"unit-{n_u}.md", fm(uq_fm) + "\n".join(lines))
                uq_index.append(f"* [Ünite {n_u}: {u_title}](unit-{n_u}.md) - {len(qs)} soru")
            write(OKF / "courses" / slug / "unit-quizzes" / "index.md", "\n".join(uq_index) + "\n")

        # exams: vize / final / yaz-kursu
        exam_dir = ROOT / "data" / slug / "exams"
        exam_index = [f"# {meta.get('subject', slug)} Sınavları\n"]
        exam_ids = ["vize", "final", "yaz-kursu"]
        exam_tr = {"vize": "Vize", "final": "Final", "yaz-kursu": "Yaz Kursu"}
        for eid in exam_ids:
            epath = exam_dir / f"{eid}.json"
            if not epath.exists():
                continue
            edata = load_json(epath)
            eqs = edata.get("questions", [])
            has_key = any(o.get("isCorrect") for q in eqs for o in q.get("answerOptions", []))
            has_sol = any(q.get("solution") or q.get("explanation") for q in eqs)
            e_lines = [
                f"# {edata.get('title', exam_tr.get(eid, eid))}\n",
                f"Ders: {meta.get('subject', slug)} · "
                f"{university_label(unis, meta.get('university_id', 'aof'))} · "
                f"{meta.get('academic_year', '')} {semester_label(meta.get('semester', 'guz'))}. "
                f"Toplam {len(eqs)} soru. "
                "Doğru cevaplar `*`; her soruda gerekçe ve çözüm vardır.\n",
            ]
            for n, q in enumerate(eqs, 1):
                e_lines.append(render_question_block(n, q))
            if not eqs:
                e_lines.append("_Bu sınav için henüz soru eklenmedi. JSON şeması için `data/_exam_schema.md` dosyasına bakın._\n")
            e_fm = [
                ("type", "Exam"),
                ("title", edata.get("title", f"{meta.get('subject', slug)} {exam_tr.get(eid, eid)}")),
                ("description", edata.get("description", "")),
                ("course", slug),
                ("university", meta.get("university_id", "aof")),
                ("academic_year", meta.get("academic_year", "")),
                ("semester", meta.get("semester", "")),
                ("exam_id", eid),
                ("exam_window", edata.get("exam_window", "")),
                ("exam_type", eid),
                ("question_count", str(len(eqs))),
                ("pass_mark", str(edata.get("pass_mark", 0.7))),
                ("has_answer_key", "true" if has_key else "false"),
                ("has_solutions", "true" if has_sol else "false"),
                ("status", "draft" if not eqs else "stable"),
                ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
                ("resource", f"/courses/{slug}/exams/{eid}.md"),
            ]
            write(OKF / "courses" / slug / "exams" / f"{eid}.md", fm(e_fm) + "\n".join(e_lines))
            exam_index.append(
                f"* [{edata.get('title', exam_tr.get(eid, eid))}]({eid}.md) "
                f"- {len(eqs)} soru, cevap anahtarı: "
                f"{'var' if has_key else 'yok'}, çözümler: "
                f"{'var' if has_sol else 'yok'}"
            )
        if exam_index and len(exam_index) > 1:
            write(OKF / "courses" / slug / "exams" / "index.md", "\n".join(exam_index) + "\n")

        # çıkmış vize arşivi (self-graded anımsama; OCR seçenekleri eksik olabilir)
        past_path = ROOT / "data" / slug / "past_exams.json"
        if past_path.exists():
            from coursegraph.past_exams import annotate_questions, unit_titles, unit_to_chapters

            past_index = [f"# {meta.get('subject', slug)} Çıkmış Vizeler\n",
                          "Sorular PDF OCR'dan; cevap anahtarı PDF'in son sayfasındandır. Ünite etiketi eklenmiştir.\n"]
            titles_map = unit_titles(slug)
            ch_map = unit_to_chapters(slug)
            for exam in annotate_questions(slug):
                eid = str(exam.get("exam_id") or "past")
                qs = exam.get("questions") or []
                lines = [
                    f"# Çıkmış Vize {exam.get('year', '')} {semester_label(exam.get('term', 'guz'))}\n",
                    f"Ders: {meta.get('subject', slug)} · {university_label(unis, meta.get('university_id', 'aof'))}. "
                    f"{len(qs)} soru. Cevap anahtarı var (PDF son sayfa).\n",
                ]
                plan_path = ROOT / "data" / slug / "study_plan.json"
                plan = load_json(plan_path) if plan_path.exists() else {}
                ch_titles = {i: (ch.get("title") or f"Bölüm {i}") for i, ch in enumerate(plan.get("chapters") or [], 1)}
                for n, q in enumerate(qs, 1):
                    u = q.get("unit")
                    unit_t = titles_map.get(u, f"Ünite {u}") if u else "Bilinmiyor"
                    kws = ", ".join(q.get("keywords") or [])
                    ch_nums = list(ch_map.get(u, []) if u else [])
                    lines.append(f"## {n}. {q.get('stem', '')}\n")
                    for part in q.get("stemParts") or []:
                        if part.get("img"):
                            lines.append(f"![Soru {n} görseli](/{part['img'].lstrip('/')})\n")
                    lines.append(f"*Ünite:* {unit_t}\n")
                    if ch_nums:
                        ch_bits = []
                        for cn in ch_nums:
                            title = ch_titles.get(cn, "")
                            ch_bits.append(f"{cn}. bölüm{f' ({title})' if title else ''}")
                        lines.append("*İlgili bölümler:* " + "; ".join(ch_bits) + "\n")
                    if kws:
                        lines.append(f"*Anahtar kelimeler:* {kws}\n")
                    letters = ["A", "B", "C", "D", "E", "F"]
                    correct = q.get("correct")
                    correct_opt = next((o for o in (q.get("options") or []) if o.get("key") == correct), None)
                    if correct and correct_opt:
                        lines.append(f"**Cevap anahtarı:** {correct}) {correct_opt.get('text', '')}\n")
                    for j, o in enumerate(q.get("options") or []):
                        letter = o.get("key") or letters[j]
                        mark = " *" if letter == correct or o.get("isCorrect") else ""
                        img = f"![{letter} şıkkı](/{o['image'].lstrip('/')})" if o.get("image") else ""
                        body = " ".join(x for x in (o.get("text", ""), img) if x)
                        lines.append(f"{letter}) {body}{mark}")
                    lines.append("")
                    sol_parts = []
                    if correct and correct_opt:
                        sol_parts.append(f"Doğru cevap {correct}) {correct_opt.get('text', '')}")
                    if unit_t and unit_t != "Bilinmiyor":
                        sol_parts.append(f"konu ünitesi {unit_t}")
                    if ch_nums:
                        sol_parts.append("ilgili ders bölümleri " + ", ".join(f"{cn}. bölüm" for cn in ch_nums))
                    if sol_parts:
                        lines.append("**Çözüm:** " + "; ".join(sol_parts) + ".\n")
                    if q.get("explanation"):
                        lines.append(f"**Açıklama:** {q['explanation']}\n")
                p_fm = [
                    ("type", "Past Exam"),
                    ("title", f"Çıkmış vize {exam.get('year', '')}"),
                    ("description", f"{meta.get('subject', slug)} çıkmış vize arşivi; cevap anahtarı PDF son sayfasından alınmıştır."),
                    ("course", slug),
                    ("exam_id", eid),
                    ("exam_window", str(exam.get("year") or "")),
                    ("exam_type", "vize"),
                    ("term", str(exam.get("term") or "")),
                    ("question_count", str(len(qs))),
                    ("has_answer_key", "true" if any(q.get("correct") for q in qs) else "false"),
                    ("status", "stable"),
                    ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
                    ("resource", f"/courses/{slug}/exams/past/{eid}.md"),
                ]
                write(OKF / "courses" / slug / "exams" / "past" / f"{eid}.md", fm(p_fm) + "\n".join(lines))
                past_index.append(f"* [{exam.get('year', eid)}]({eid}.md) - {len(qs)} soru")
            if len(past_index) > 2:
                write(OKF / "courses" / slug / "exams" / "past" / "index.md", "\n".join(past_index) + "\n")
            exam_index.append("* [Çıkmış vizeler](past/index.md) - arşiv, cevap anahtarı var")
            if exam_index and len(exam_index) > 1:
                write(OKF / "courses" / slug / "exams" / "index.md", "\n".join(exam_index) + "\n")

        # course body: sınav linkleri
        # (yukarıdaki course.md çoktan yazıldı; exams/ linkleri için course.md'yi güncelle)
        course_path = OKF / "courses" / f"{slug}.md"
        if course_path.exists():
            ctext = course_path.read_text(encoding="utf-8")
            marker = f"* [Artifact'ler](/courses/{slug}/artifacts.md)"
            exam_links = (
                f"\n* [Sınavlar](/courses/{slug}/exams/index.md) - vize, final, yaz kursu"
            )
            if marker in ctext and "/exams/" not in ctext:
                course_path.write_text(ctext.replace(marker, marker + exam_links), encoding="utf-8")


        # artifacts catalog page for course
        cats = by_course_cat.get(slug, {})
        if not catalog and slug in prev_artifacts:
            write(OKF / "courses" / slug / "artifacts.md", prev_artifacts[slug])
            continue
        art_lines = [f"# {meta.get('subject', slug)} Artifact'leri\n"]
        CAT_TR = {
            "hazirlik-donemi": "Hazırlık Dönemi",
            "milli-mucadele": "Milli Mücadele",
            "lozan-ve-cumhuriyet": "Lozan ve Cumhuriyet",
            "donem-politikasi": "Dönem Politikası",
            "dil-kultur-ve-tarihce": "Dil, Kültür ve Tarihçe",
            "ses-ve-bicim": "Ses ve Biçim",
            "cumle-ve-anlatim": "Cümle Bilgisi",
            "soz-varligi-ve-kullanim": "Söz Varlığı ve Kullanım",
            "dil-etkilesimi": "Dil Etkileşimi",
            "giris-ve-olusum": "Giriş ve Oluşum",
            "erken-ayrilmalar": "Erken Ayrılımlar",
            "sia-ve-imamet": "Şia ve İmamet",
            "sehristani-analizi": "Şehristânî Analizi",
            "genel": "Genel",
        }
        for cat, items in sorted(cats.items()):
            art_lines.append(f"## {CAT_TR.get(cat, cat)}\n")
            for e in sorted(items, key=lambda x: x["filename"]):
                name = e["filename"]
                if "__" in name:
                    name = name.split("__", 1)[1]
                for ext in (".md", ".json", ".png", ".pdf", ".wav", ".mp3", ".csv"):
                    if name.endswith(ext):
                        name = name[: -len(ext)]
                        break
                art_lines.append(f"* [{e['type']}] {name}")
            art_lines.append("")
        art_fm = [
            ("type", "Artifact Catalog"),
            ("title", f"{meta.get('subject', slug)} artifact kataloğu"),
            ("description", f"{slug} için NotebookLM artifact listesi ve kategori dağılımı."),
            ("course", slug),
            ("artifact_count", str(sum(len(v) for v in cats.values()))),
            ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
        ]
        write(OKF / "courses" / slug / "artifacts.md", fm(art_fm) + "\n".join(art_lines))
        # fix artifacts index to link course pages
        # (written below once more)

    # rewrite artifacts/index.md with proper links
    art_index = ["# Artifact Kataloğu\n", "NotebookLM çıktı kataloğu. Fiziksel dosyalar repo kökündeki `artifacts/` altındadır.\n"]
    for slug in SLUGS:
        if slug in courses:
            art_index.append(f"* [{courses[slug]['subject']}](/courses/{slug}/artifacts.md)")
    write(OKF / "artifacts" / "index.md", "\n".join(art_index) + "\n")

    # log add
    n_files = len(list(OKF.rglob("*.md")))
    print(f"OKF bundle written: {OKF} ({n_files} md files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
