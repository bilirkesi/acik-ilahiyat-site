#!/usr/bin/env python3
"""HTML/CSS yeniden üretim: yapı JSON'undan infographic HTML üretir."""
import html
import json
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Selahattin\NotebookProjects\acik-ilahiyat-poc")
NL = ROOT / "artifacts" / "nlm-infographics"
RECREATE = NL / "recreate"
OUT_HTML = RECREATE / "html"
OUT_HTML.mkdir(parents=True, exist_ok=True)

YEAR_RE = re.compile(r"\b(1[5-9]\d{2}|20\d{2})\b")


def item_year(it):
    for key in ("label", "heading"):
        m = YEAR_RE.search(it.get(key) or "")
        if m:
            return int(m.group(1))
    m = YEAR_RE.search(it.get("text") or "")
    return int(m.group(1)) if m else 9999


def sort_items(items):
    return sorted(items, key=item_year)

CSS = """
@font-face{font-family:Roboto;src:url(_fonts/Roboto-Regular.ttf);font-weight:400}
@font-face{font-family:Roboto;src:url(_fonts/Roboto-Medium.ttf);font-weight:500}
@font-face{font-family:Roboto;src:url(_fonts/Roboto-Bold.ttf);font-weight:700}
@font-face{font-family:Roboto;src:url(_fonts/Roboto-Black.ttf);font-weight:900}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Roboto,'Segoe UI',sans-serif;background:#f4f6f8;color:#1a1a1a}
.page{width:1536px;min-height:2752px;margin:0 auto;background:#fff;padding:64px 72px}
.hero{border-radius:20px;padding:52px 56px;color:#fff;background:var(--accent);
  box-shadow:0 10px 30px rgba(0,0,0,.14)}
.hero h1{font-size:52px;font-weight:900;line-height:1.1;letter-spacing:-.5px}
.hero .sub{margin-top:14px;font-size:26px;font-weight:500;opacity:.92}
.section{margin-top:44px}
.section>h2{font-size:32px;font-weight:900;color:var(--accent);
  border-left:10px solid var(--accent);padding-left:18px;margin-bottom:22px;
  text-transform:uppercase;letter-spacing:.3px}
.grid{display:grid;gap:20px}
.grid.g1{grid-template-columns:1fr}
.grid.g2{grid-template-columns:1fr 1fr}
.grid.g3{grid-template-columns:1fr 1fr 1fr}
.card{background:#fff;border:2px solid #e6ebf0;border-radius:16px;padding:22px 24px;
  box-shadow:0 3px 10px rgba(0,0,0,.05)}
.card .label{display:inline-block;font-size:19px;font-weight:900;color:#fff;
  background:var(--accent);border-radius:999px;padding:5px 16px;margin-bottom:12px}
.card h3{font-size:25px;font-weight:700;line-height:1.22;margin-bottom:10px;color:#12202e}
.card p{font-size:20px;line-height:1.5;color:#33414f}
.card ul{margin:8px 0 0 20px;font-size:20px;line-height:1.5;color:#33414f}
.footer{margin-top:52px;text-align:right;font-size:18px;color:#8a97a3;font-weight:500}
/* ---- timeline ---- */
.timeline{position:relative;margin-top:30px;padding:10px 0}
.timeline:before{content:'';position:absolute;left:50%;top:0;bottom:0;width:14px;
  transform:translateX(-50%);border-radius:999px;
  background:linear-gradient(180deg,var(--accent),#d97706 55%,var(--accent));opacity:.9}
.tl-item{position:relative;width:50%;padding:18px 56px 18px 0}
.tl-item:nth-child(even){margin-left:50%;padding:18px 0 18px 56px}
.tl-item:before{content:'';position:absolute;top:34px;width:26px;height:26px;border-radius:50%;
  background:#fff;border:7px solid var(--accent);z-index:2}
.tl-item:nth-child(odd):before{right:-13px}
.tl-item:nth-child(even):before{left:-13px}
.tl-card{background:#fff;border:2px solid #e6ebf0;border-radius:16px;padding:20px 24px;
  box-shadow:0 4px 14px rgba(0,0,0,.07)}
.tl-item:nth-child(odd) .tl-card{text-align:right}
.tl-card .label{display:inline-block;font-size:20px;font-weight:900;color:#fff;
  background:var(--accent);border-radius:999px;padding:5px 18px;margin-bottom:10px}
.tl-card h3{font-size:25px;font-weight:900;line-height:1.2;margin-bottom:8px;color:#12202e}
.tl-card p{font-size:20px;line-height:1.5;color:#33414f}
"""


def cols_for(n):
    return 1 if n <= 3 else (2 if n <= 8 else 3)


def render_timeline_section(sec):
    items = sort_items(sec.get("items", []))
    parts = ["<div class='timeline'>"]
    for it in items:
        parts.append("<div class='tl-item'><div class='tl-card'>")
        lab = html.escape(it.get("label") or "")
        if lab:
            parts.append(f"<span class='label'>{lab}</span>")
        h = html.escape(it.get("heading") or "")
        if h:
            parts.append(f"<h3>{h}</h3>")
        t = html.escape(it.get("text") or "")
        if t:
            parts.append(f"<p>{t}</p>")
        parts.append("</div></div>")
    parts.append("</div>")
    return "".join(parts)


def render_unit(u):
    accent = u.get("accent") or "#2e75b6"
    title = html.escape(u.get("title") or f"Ünite {u['unit']}")
    sub = html.escape(u.get("subtitle") or "")
    layout = (u.get("layout") or "panels").lower()
    is_timeline = layout == "timeline"
    parts = [
        "<!doctype html><html lang='tr'><head><meta charset='utf-8'>",
        f"<title>{title}</title><style>{CSS}</style></head><body>",
        "<div class='page' style='--accent:%s'>" % accent,
        "<div class='hero'>",
        f"<h1>{title}</h1>",
    ]
    if sub:
        parts.append(f"<div class='sub'>{sub}</div>")
    parts.append("</div>")
    for sec in u.get("sections", []):
        sh = html.escape(sec.get("heading") or "")
        if sh:
            parts.append(f"<div class='section'><h2>{sh}</h2>")
        else:
            parts.append("<div class='section'>")
        if is_timeline:
            parts.append(render_timeline_section(sec))
        else:
            items = sec.get("items", [])
            g = cols_for(len(items))
            parts.append(f"<div class='grid g{g}'>")
            for it in items:
                parts.append("<div class='card'>")
                lab = html.escape(it.get("label") or "")
                if lab:
                    parts.append(f"<span class='label'>{lab}</span>")
                h = html.escape(it.get("heading") or "")
                if h:
                    parts.append(f"<h3>{h}</h3>")
                t = html.escape(it.get("text") or "")
                if t:
                    parts.append(f"<p>{t}</p>")
                parts.append("</div>")
            parts.append("</div>")
        parts.append("</div>")
    parts.append("<div class='footer'>Gemini Notebook · AÖF</div>")
    parts.append("</div></body></html>")
    return "".join(parts)


def main():
    made = []
    for slug in ("turk-dili-1", "ataturk-ilkeleri-1"):
        data = json.loads((RECREATE / f"structure_{slug}.json").read_text(encoding="utf-8"))
        for u in data:
            p = OUT_HTML / f"{slug}-unit-{u['unit']}.html"
            p.write_text(render_unit(u), encoding="utf-8")
            made.append(p)
    print("html ->", len(made), "files in", OUT_HTML)


if __name__ == "__main__":
    main()
