"""CourseGraph indeksinden site için kompakt arama JS'i üretir.

Çıktı: site/coursegraph.js → window.CG
  items[]: { id, type, title, course, chapter?, href, hay, snippet, answer?, definition? }
  edges:   { [nodeId]: string[] }  // ilgili düğümler (related/impact)
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

from .graph import CourseGraph
from .indexer import fold, tokenize

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "coursegraph.js"

# site içi hash yolları
def _href(n: dict) -> str:
    t = n.get("type")
    c = n.get("course", "")
    if t == "course":
        return f"#/course/{c}"
    if t == "chapter":
        return f"#/course/{c}/chapter/{n.get('chapter', 1)}"
    if t == "quiz_question":
        return f"#/course/{c}/quiz"
    if t == "exam_question":
        return f"#/course/{c}/quiz"  # exam sayfası yok; quiz'e götür
    if t in ("concept", "event"):
        # en yakın chapter linki yoksa course
        return f"#/course/{c}"
    if t == "artifact":
        return f"#/course/{c}"
    if t == "quiz":
        return f"#/course/{c}/quiz"
    if t == "past_exam":
        return f"#/course/{c}/quiz"
    if t == "past_question":
        u = n.get("unit")
        # ünite -> site bölüm (yaklaşık)
        ch_map = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}
        ch = ch_map.get(u or 0)
        if ch:
            return f"#/course/{c}/chapter/{ch}"
        return f"#/course/{c}"
    if t == "unit":
        ch_map = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}
        ch = ch_map.get(n.get("unit") or 0)
        return f"#/course/{c}/chapter/{ch}" if ch else f"#/course/{c}"
    if t == "keyword":
        return f"#/ara?q={quote(n.get('title') or '')}"
    return f"#/course/{c}"


KEEP = {
    "course",
    "chapter",
    "concept",
    "event",
    "quiz_question",
    "exam_question",
    "quiz",
    "exam",
    "artifact",
    "past_exam",
    "past_question",
    "unit",
    "keyword",
}


def build_site_cg(g: CourseGraph | None = None) -> dict:
    if g is None:
        g = CourseGraph()

    items = []
    for n in g.nodes.values():
        t = n.get("type")
        if t not in KEEP:
            continue
        title = n.get("title") or ""
        snippet = (
            n.get("summary")
            or n.get("definition")
            or n.get("question")
            or n.get("description")
            or n.get("note")
            or ""
        )
        if t == "chapter":
            snippet = n.get("summary") or ""
            # hedefleri de hay'e ekle
            objs = " ".join(n.get("objectives") or [])
            lec = " ".join(n.get("lectures") or [])
            hay_src = f"{title} {snippet} {objs} {lec}"
        elif t == "concept":
            hay_src = f"{title} {n.get('definition') or ''}"
            snippet = n.get("definition") or ""
        elif t in ("quiz_question", "exam_question"):
            hay_src = f"{title} {n.get('question') or ''} {n.get('answer') or ''}"
            snippet = n.get("question") or title
        elif t == "event":
            hay_src = f"{n.get('year','')} {title} {n.get('description') or ''}"
            snippet = n.get("description") or ""
        elif t == "course":
            hay_src = f"{title} {n.get('course_code') or ''} {n.get('course_name') or ''} {n.get('note') or ''}"
            snippet = n.get("note") or ""
        elif t == "past_question":
            kws = " ".join(n.get("keywords") or [])
            hay_src = f"{title} {n.get('question') or ''} {kws} ünite {n.get('unit') or ''} vize {n.get('year') or ''}"
            snippet = n.get("question") or title
        elif t == "past_exam":
            hay_src = f"{title} çıkmış vize {n.get('year') or ''} {n.get('exam_id') or ''}"
            snippet = f"{n.get('year', '')} Güz ara sınav · {n.get('question_count', 0)} soru"
        elif t == "unit":
            hay_src = f"{title} ünite {n.get('unit') or ''} {n.get('unit_title') or ''}"
            snippet = n.get("unit_title") or title
        elif t == "keyword":
            hay_src = f"{title} anahtar kelime"
            snippet = title
        else:
            hay_src = f"{title} {snippet}"

        item = {
            "id": n["id"],
            "type": t,
            "title": title,
            "course": n.get("course") or n.get("slug") or "",
            "href": _href(n),
            "hay": " ".join(tokenize(hay_src)),
            "snippet": (snippet or "")[:280],
        }
        if n.get("chapter"):
            item["chapter"] = n["chapter"]
        if n.get("answer"):
            item["answer"] = n["answer"][:200]
        if n.get("definition"):
            item["definition"] = n["definition"][:280]
        if n.get("year"):
            item["year"] = n["year"]
        if n.get("exam_id"):
            item["examId"] = n["exam_id"]
        if n.get("category"):
            item["category"] = n["category"]
        if n.get("unit"):
            item["unit"] = n["unit"]
        if n.get("keywords"):
            item["keywords"] = n["keywords"][:8]
        items.append(item)

    # edges: sadece related çıkarımı için out-neighbors
    edges: dict[str, list[str]] = {}
    interesting = {
        "has_chapter",
        "defines_concept",
        "mentions_concept",
        "has_timeline_event",
        "mentions_event",
        "has_quiz",
        "has_exam",
        "has_question",
        "cites_source",
        "has_past_exam",
        "in_unit",
        "in_chapter",
        "has_keyword",
        "covers_unit",
        "covers_chapter",
        "has_unit",
    }
    for e in g.edges:
        if e["rel"] not in interesting:
            continue
        edges.setdefault(e["src"], []).append(e["dst"])
        # reverse için de
        edges.setdefault(e["dst"], []).append(e["src"])

    # phrase keys: client araması için
    return {
        "v": 1,
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "items": items,
        "edges": edges,
    }


def write_site_cg(data: dict | None = None) -> Path:
    if data is None:
        data = build_site_cg()
    js = (
        "/* CourseGraph site arama indeksi. python -m coursegraph.site_export ile üretilir. */\n"
        "window.CG = "
        + json.dumps(data, ensure_ascii=False)
        + ";\n"
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(js, encoding="utf-8")
    return OUT


if __name__ == "__main__":
    p = write_site_cg()
    data = json.loads(p.read_text(encoding="utf-8").split("window.CG = ", 1)[1].rsplit(";", 1)[0])
    print(f"wrote {p} items={len(data['items'])} edge_keys={len(data['edges'])}")
