#!/usr/bin/env python3
"""Build the static site for a Personal University project.

Usage: build.py PROJECT

Copies site-template/ into PROJECT/site/, injects university.json, bundles every course that has a
manifest.json into site/data.js, and compresses chapter infographics (sips, else Pillow, else PNG copy).
Cleans NotebookLM text: drops citation markers, fixes doubled LaTeX delimiters, removes em dashes.
"""
import html, json, re, shutil, subprocess, sys, time
from pathlib import Path
from common import TEMPLATE_DIR, Project


def dash(obj):
    """House rule: no em dashes anywhere in site copy."""
    if isinstance(obj, str):
        return re.sub(r"\s*\u2014\s*", ", ", obj)
    if isinstance(obj, list):
        return [dash(x) for x in obj]
    if isinstance(obj, dict):
        return {k: dash(v) for k, v in obj.items()}
    return obj


def clean(text):
    """Drop NotebookLM citation markers like [1], [2-4], [1, 3]; keep markdown list refs and ⟦k⟧."""
    out_lines = []
    for ln in (text or "").splitlines():
        s = ln.strip()
        # referans listesi satırları: "- [1] ..." veya "[1] ..."
        if re.match(r"^(?:[-*]\s+)?\[\d+\]", s):
            out_lines.append(ln)
            continue
        ln = re.sub(r"\s*\[\d+(?:\s*[-,]\s*\d+)*\]", "", ln)
        out_lines.append(ln)
    text = "\n".join(out_lines)
    text = re.sub(r"\\\\([()\[\]])", r"\\\1", text)
    lines = text.strip().split("\n")
    if lines and lines[0].rstrip().endswith(":") and re.match(r"(Here is|Here are|Based on)", lines[0]):
        lines = lines[1:]
    return re.sub(r"[ \t]+", " ", "\n".join(lines)).strip()


def _save_pillow(png, dest, max_side, quality, tall_max_width):
    try:
        from PIL import Image
    except ImportError:
        return None
    im = Image.open(png).convert("RGB")
    w, h = im.size
    if tall_max_width and h > w * 1.6 and w > tall_max_width:
        ratio = tall_max_width / float(w)
        im = im.resize((tall_max_width, max(1, int(h * ratio))), Image.LANCZOS)
    else:
        im.thumbnail((max_side, max_side), Image.LANCZOS)
    im.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
    return dest.name


def compress_one(png, out_dir, max_side=1800, quality=78, tall_max_width=None):
    """Return (full_name, sm_name_or_None) written into out_dir.

    Dikey (çok sayfalı stitch) görsellerde max_side her iki kenara uygulanmaz;
    yalnızca genişlik sınırı kullanılır (yoksa 13k px görsel 158 px'e düşer).
    Yanında <stem>-sm.jpg (640px genişlik) da üretilir; app.js srcset ile kullanır.
    """
    png = Path(png)
    is_aof = png.name.startswith("aof-infographic-")
    if is_aof:
        max_side = 2400
        quality = 90
        tall_max_width = tall_max_width or 2200
    jpg = out_dir / (png.stem + ".jpg")
    sm = out_dir / (png.stem + "-sm.jpg")
    if not (jpg.exists() and jpg.stat().st_mtime >= png.stat().st_mtime):
        full = None
        if shutil.which("sips") and not is_aof:
            r = subprocess.run(["sips", "-Z", str(max_side), "-s", "format", "jpeg", "-s", "formatOptions", str(quality), str(png), "--out", str(jpg)],
                               capture_output=True)
            if r.returncode == 0:
                full = jpg.name
        if full is None:
            full = _save_pillow(png, jpg, max_side, quality, tall_max_width)
            if full is None:  # Pillow yok: PNG kopyası
                shutil.copy2(png, out_dir / png.name)
                full = png.name
    else:
        full = jpg.name
    sm_name = None
    if not (sm.exists() and sm.stat().st_mtime >= png.stat().st_mtime):
        sm_name = _save_pillow(png, sm, 640, 72, None)
    else:
        sm_name = sm.name
    return full, sm_name


def site_images(proj, slug, pattern, out_dir):
    """Yield (stem, "assets/<slug>/<file>") for a glob like "chapter-*".

    Kaynak PNG'ler (assets/<slug>/, .gitignore'da) varsa sıkıştırır. Yoksa (ör. temiz bir repo
    klonu) site/assets/<slug>/ altında daha önce üretilmiş JPG'leri kullanır; böylece site,
    kaynak görseller olmadan da yeniden kurulabilir.
    """
    pngs = sorted((proj.root / "assets" / slug).glob(pattern + ".png"))
    if pngs:
        for png in pngs:
            full, _sm = compress_one(png, out_dir)
            yield png.stem, f"assets/{slug}/{full}"
        return
    for jpg in sorted(out_dir.glob(pattern + ".jpg")):
        if not jpg.stem.endswith("-sm"):
            yield jpg.stem, f"assets/{slug}/{jpg.name}"


def lecture_url(key, s, course):
    if s.get("url"):
        return s["url"]
    if course.get("mode", "lectures") == "lectures" and re.fullmatch(r"[\w-]{11}", key):
        return f"https://www.youtube.com/watch?v={key}"
    return ""


def course_data(proj, slug):
    d = proj.root / "data" / slug
    if not (d / "manifest.json").exists():
        return None
    c, m = proj.courses[slug], json.loads((d / "manifest.json").read_text())
    st = json.loads((d / "state.json").read_text())
    plan = json.loads((d / "study_plan.json").read_text())
    quiz = json.loads((d / "quiz.json").read_text()) if (d / "quiz.json").exists() else {"questions": []}
    questions = quiz.get("questions", []) if isinstance(quiz, dict) else quiz
    by_sid = {s["id"]: {"title": s["title"], "url": lecture_url(k, s, c), "type": s.get("type", "")}
              for k, s in st["sources"].items() if s.get("status") == "ready" and s.get("id")}
    out_dir = proj.root / "site" / "assets" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    images = dict(site_images(proj, slug, "chapter-*", out_dir))
    aof_infographics = {}
    aof_pages = {}
    for stem, path in site_images(proj, slug, "aof-infographic-*", out_dir):
        # aof-infographic-3-p2 veya aof-infographic-2
        aof_infographics[stem] = path
        pm = re.fullmatch(r"aof-infographic-(\d+)-p(\d+)", stem)
        if pm:
            aof_pages.setdefault(int(pm.group(1)), []).append((int(pm.group(2)), path))
    # düzeltilmiş NLM infografikleri (varsa)
    nlm_infographics = {}
    for stem, path in site_images(proj, slug, "nlm-infographic-*", out_dir):
        nm = re.fullmatch(r"nlm-infographic-(\d+)", stem)
        if nm:
            nlm_infographics[int(nm.group(1))] = path
    chapters = []
    for i, ch in enumerate(plan["chapters"], 1):
        pages = [p for _, p in sorted(aof_pages.get(i, []))]
        single = aof_infographics.get(f"aof-infographic-{i}")
        aof = pages if pages else (single and [single]) or None
        chapters.append({
            "title": ch["title"], "summary": ch.get("summary", ""), "objectives": ch.get("objectives", []),
            "lectures": [by_sid[s] for s in ch.get("source_ids", []) if s in by_sid],
            "notes": clean(ch.get("grounding", {}).get("answer", "")),
            "cites": ch.get("cites") or [],
            "image": images.get(f"chapter-{i}"),
            "aofInfographic": aof,
            "nlmInfographic": nlm_infographics.get(i),
        })
    mode = c.get("mode", "lectures")
    return {"slug": slug, "subject": c["subject"], "course": c["course"], "professor": c.get("professor", ""),
            "school": c.get("school", ""), "playlist": c.get("playlist", ""), "note": c.get("note", ""),
            "kind": "lectures" if mode == "lectures" else "sources",
            "notebook": m["notebook_url"], "sourceCount": m["source_count"],
            "chapters": chapters, "quiz": questions}


def public_config(u):
    keys = ["name", "tagline", "headline", "issuer", "issuerUrl", "passMark", "codePrefix", "colors",
            "showNotebookLinks", "plannedCourses"]
    return {k: u[k] for k in keys if k in u}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    proj = Project(sys.argv[1])
    site = proj.root / "site"
    site.mkdir(exist_ok=True)
    order = proj.uni.get("order") or list(proj.courses)
    data = [dash(x) for x in (course_data(proj, s) for s in order if s in proj.courses) if x]
    uni = dash(public_config(proj.uni))
    (site / "data.js").write_text("window.UNIVERSITY = " + json.dumps(uni, ensure_ascii=False) + ";\n"
                                  + "window.COURSES = " + json.dumps(data, ensure_ascii=False) + ";\n")
    v = str(int(time.time()))
    shutil.copy2(TEMPLATE_DIR / "app.js", site / "app.js")
    shutil.copy2(TEMPLATE_DIR / "styles.css", site / "styles.css")
    shutil.copy2(TEMPLATE_DIR / "favicon.svg", site / "favicon.svg")
    # interactive.js proje verisidir: varsa koru, yoksa şablondan boş iskelet kopyala.
    if not (site / "interactive.js").exists() and (TEMPLATE_DIR / "interactive.js").exists():
        shutil.copy2(TEMPLATE_DIR / "interactive.js", site / "interactive.js")
    # coursegraph.js / mindmaps.js proje verisidir: site export üretir; yoksa boş stub.
    for name, stub in (
        ("coursegraph.js", "window.CG = { items: [], edges: {} };\\n"),
        ("mindmaps.js", "window.MINDMAPS = {};\\n"),
        ("past_exams.js", "window.PAST_EXAMS = {};\\n"),
        ("unit_quizzes.js", "window.UNIT_QUIZZES = {};\\n"),
    ):
        if not (site / name).exists():
            (site / name).write_text(stub, encoding="utf-8")
    issuer = html.escape(uni.get("issuer") or uni["name"])
    if uni.get("issuerUrl"):
        issuer = f'<a href="{html.escape(uni["issuerUrl"])}" target="_blank" rel="noopener">{issuer}</a>'
    n = len(data)
    desc = (f"{n} ücretsiz ders; her biri kendi NotebookLM defterinden çalışma planı, infografikler ve bir sınavla "
            "hazırlanmıştır.")
    colors = uni.get("colors") or {}
    primary = colors.get("primary", "#1b2a4a")
    paper = colors.get("paper", "#f8f4ea")
    short = uni["name"].split()[0] if uni.get("name") else "PU"
    page = (TEMPLATE_DIR / "index.html").read_text()
    for k, val in {"{{NAME}}": html.escape(uni["name"]), "{{TAGLINE}}": html.escape(uni.get("tagline", "")),
                   "{{DESCRIPTION}}": html.escape(desc), "{{ISSUER}}": issuer, "{{V}}": v,
                   "{{PRIMARY}}": primary}.items():
        page = page.replace(k, val)
    (site / "index.html").write_text(page)
    # PWA: manifest + service worker (aynı {{V}} ile önbellek kırılır).
    manifest = (TEMPLATE_DIR / "manifest.webmanifest").read_text()
    for k, val in {"{{NAME}}": uni["name"], "{{SHORT}}": short, "{{DESCRIPTION}}": desc,
                   "{{PAPER}}": paper, "{{PRIMARY}}": primary}.items():
        manifest = manifest.replace(k, val)
    (site / "manifest.webmanifest").write_text(manifest, encoding="utf-8")
    sw = (TEMPLATE_DIR / "sw.js").read_text().replace("{{V}}", v)
    (site / "sw.js").write_text(sw, encoding="utf-8")
    print(f"built {site}: {n} course(s):",
          ", ".join(f"{x['slug']}({len(x['chapters'])}ch/{len(x['quiz'])}q/"
                    f"{sum(1 for ch in x['chapters'] if ch['image'])}img)" for x in data) or "none yet")
    skipped = [s for s in proj.courses if s not in {x["slug"] for x in data}]
    if skipped:
        print("not on the site yet (no manifest):", ", ".join(skipped))
