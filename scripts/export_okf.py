#!/usr/bin/env python3
"""Ders verisini OKF (Open Knowledge Format) v0.2 bundle'ına çevirir.

Kaynak:
  courses.json, data/<slug>/{study_plan,quiz,manifest}.json,
  site/interactive.js (window.INTERACTIVE), artifacts/catalog.json

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
OKF = ROOT / "okf"
NOW = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
ACTOR = "acik-ilahiyat-exporter/1.0"

SLUGS = ["ataturk-ilkeleri-1", "turk-dili-1", "islam-mezhepleri-tarihi"]


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


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


def main() -> int:
    # temiz yeniden üretim
    if OKF.exists():
        import shutil

        shutil.rmtree(OKF)

    courses = load_json(ROOT / "courses.json")
    interactive = dump_interactive()
    catalog = load_json(ROOT / "artifacts" / "catalog.json") if (ROOT / "artifacts" / "catalog.json").exists() else []
    by_course_cat: dict[str, dict[str, list]] = {}
    for e in catalog:
        by_course_cat.setdefault(e["course"], {}).setdefault(e["category"], []).append(e)

    write(
        OKF / "index.md",
        fm(
            [
                ("okf_version", '"0.2"'),
                ("type", "Bundle Index"),
                ("title", "Açık İlahiyat Ders Bilgisi"),
                ("description", "AÖF İlahiyat ön lisans dersleri için OKF v0.2 bilgi paketi: dersler, bölümler, quiz ve artifact kataloğu."),
                ("language", "tr"),
                ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
            ]
        )
        + "# Dersler\n\n"
        + "\n".join(
            f"* [{courses[s]['subject']}](/courses/{s}.md) - {courses[s].get('course', '')}"
            for s in SLUGS
            if s in courses
        )
        + "\n\n# Yardımcılar\n\n"
        + "* [Artifact kataloğu](/artifacts/index.md) - NotebookLM çıktıları (rapor, infografik, quiz, slayt)\n"
        + "* [Dizin](/courses/index.md)\n",
    )

    write(
        OKF / "log.md",
        f"# Bundle Log\n\n## {NOW[:10]}\n* **Creation**: İlk OKF export (courses.json, study_plan, quiz, interactive panel, artifact catalog).\n",
    )

    write(
        OKF / "courses" / "index.md",
        "# Dersler\n\n"
        + "\n".join(f"* [{courses[s]['subject']}]({s}.md)" for s in SLUGS if s in courses)
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
            ("course_code", meta.get("course", "")),
            ("professor", meta.get("professor", "")),
            ("school", meta.get("school", "")),
            ("mode", meta.get("mode", "")),
            ("language", "tr"),
            ("status", "stable"),
            ("generated", f"{{ by: {ACTOR}, at: {NOW} }}"),
        ]
        if resource:
            course_fm.append(("resource", resource))
        if notebook_url:
            course_fm.append(("notebook", notebook_url))

        body_parts = [
            f"# Özet\n\n{meta.get('note', '')}\n",
            f"# Yapı\n\n* [Bölümler](/{slug}/chapters/index.md) ({len(chapters)})\n"
            f"* [Quiz](/{slug}/quiz.md)\n"
            f"* [Artifact'ler](/{slug}/artifacts.md)\n",
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

            ch_body = [
                f"# Özet\n\n{ch.get('summary', '')}\n",
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
                ch_body.append(f"# Kaynak Temellendirme\n\n{grounding['answer']}\n")

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

        # quiz
        questions = quiz.get("questions", [])
        q_lines = [
            f"# {quiz.get('title', 'Quiz')}\n",
            f"Toplam {len(questions)} soru. Doğru cevaplar `*` ile işaretli seçeneklerdir.\n",
        ]
        for n, q in enumerate(questions, 1):
            q_lines.append(f"## {n}. {q.get('question', '')}\n")
            for j, opt in enumerate(q.get("answerOptions", [])):
                mark = " *" if opt.get("isCorrect") else ""
                letter = chr(ord("A") + j)
                q_lines.append(f"{letter}) {opt.get('text', '')}{mark}")
            why = q.get("explanation") or q.get("why") or ""
            if why:
                q_lines.append(f"\n> {why}")
            q_lines.append("")
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

        # artifacts catalog page for course
        cats = by_course_cat.get(slug, {})
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
