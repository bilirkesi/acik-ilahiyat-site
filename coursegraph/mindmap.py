"""Canlı zihin haritası: CourseGraph'tan HTML/JSON üretir.

Kaynaklar:
  - interactive.js tree (ders paneli ekolleri)
  - interactive.js chapters
  - NotebookLM mind-map artifact JSON (name/children)
  - concept / chapter kenarları

Çıktı:
  coursegraph/index/mindmaps/<slug>.json
  coursegraph/index/mindmaps/<slug>.html   (self-contained, CDN Cytoscape)
  coursegraph/index/mindmaps/index.html    (tüm dersler)
"""
from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

from .graph import CourseGraph
from .indexer import dump_interactive, fold, load_json

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent / "index" / "mindmaps"


def _tree_to_nodes_edges(
    tree: list,
    course: str,
    mindmap_id: str,
    parent: str | None = None,
    depth: int = 0,
) -> tuple[list, list]:
    nodes, edges = [], []
    for i, item in enumerate(tree, 1):
        label = item.get("label") or item.get("name") or f"node{i}"
        desc = item.get("d") or item.get("desc") or item.get("definition") or ""
        nid = f"mm:{course}:{mindmap_id}:{depth}:{i}:{fold(label)[:32]}"
        nodes.append(
            {
                "id": nid,
                "label": label,
                "desc": desc,
                "depth": depth,
                "mindmap": mindmap_id,
                "course": course,
            }
        )
        if parent:
            edges.append({"source": parent, "target": nid})
        children = item.get("branches") or item.get("children") or []
        if children:
            child_nodes, child_edges = _tree_to_nodes_edges(
                children, course, mindmap_id, parent=nid, depth=depth + 1
            )
            nodes.extend(child_nodes)
            edges.extend(child_edges)
    return nodes, edges


def _load_nl_mindmaps(course: str) -> list[dict]:
    """NotebookLM mind-map artifact JSON'larını bulur."""
    out = []
    base = ROOT / "artifacts" / course
    if not base.exists():
        return out
    for f in base.rglob("mind-map__*.json"):
        try:
            data = load_json(f)
        except Exception:
            continue
        if not isinstance(data, dict) or "name" not in data:
            continue
        out.append(
            {
                "file": f.name,
                "title": data.get("name", f.stem),
                "tree": [data],  # tek kök
            }
        )
    return out


def build_mindmaps(g: CourseGraph | None = None) -> dict:
    if g is None:
        g = CourseGraph()
    interactive = dump_interactive()
    OUT.mkdir(parents=True, exist_ok=True)

    # course slug listesi
    courses = sorted(
        {n.get("course") or n.get("slug") for n in g.nodes.values() if n.get("type") == "course" and (n.get("course") or n.get("slug"))}
    )

    index_rows = []
    for course in courses:
        mindmaps: list[dict] = []

        # 1) panel tree (ekoller vs.)
        panel = interactive.get(course, {})
        tree = panel.get("tree") or []
        if tree:
            nodes, edges = _tree_to_nodes_edges(tree, course, "panel-tree")
            mindmaps.append(
                {
                    "id": "panel-tree",
                    "title": panel.get("title", f"{course} ağacı"),
                    "source": "interactive.tree",
                    "nodes": nodes,
                    "edges": edges,
                }
            )

        # 2) panel chapters as shallow tree
        chapters = panel.get("chapters") or []
        if chapters:
            # chapters: dict n -> {title, takeaways...} veya liste
            if isinstance(chapters, dict):
                ch_list = [{"label": v.get("title", k), "d": (v.get("takeaways") or [{}])[0].get("d", "") if v.get("takeaways") else "", "children": [
                    {"name": t.get("t", ""), "children": [{"name": t.get("d", "")}]} for t in (v.get("takeaways") or [])
                ]} for k, v in chapters.items()]
                nodes, edges = _tree_to_nodes_edges(ch_list, course, "panel-chapters")
                mindmaps.append(
                    {
                        "id": "panel-chapters",
                        "title": f"{course} bölüm ağacı",
                        "source": "interactive.chapters",
                        "nodes": nodes,
                        "edges": edges,
                    }
                )

        # 3) NotebookLM mind-map artifacts
        for i, nl in enumerate(_load_nl_mindmaps(course), 1):
            mmid = f"nl-{i:02d}"
            nodes, edges = _tree_to_nodes_edges(nl["tree"], course, mmid)
            mindmaps.append(
                {
                    "id": mmid,
                    "title": nl["title"],
                    "source": f"artifact:{nl['file']}",
                    "nodes": nodes,
                    "edges": edges,
                }
            )

        # 4) graph-derived: course -> chapters -> concepts (canlı özet)
        cnid = f"course:{course}"
        if cnid in g.nodes:
            derived = [{"label": g.nodes[cnid].get("title", course), "children": []}]
            for e in g.out[cnid]:
                if e["rel"] != "has_chapter" or e["dst"] not in g.nodes:
                    continue
                ch = g.nodes[e["dst"]]
                ch_node = {"label": ch.get("title", e["dst"]), "children": []}
                for ce in g.out[e["dst"]]:
                    if ce["rel"] in ("defines_concept", "mentions_concept") and ce["dst"] in g.nodes:
                        con = g.nodes[ce["dst"]]
                        ch_node["children"].append(
                            {"name": con.get("title", ""), "children": [{"name": (con.get("definition") or "")[:200]}]}
                        )
                derived[0]["children"].append(ch_node)
            nodes, edges = _tree_to_nodes_edges(derived, course, "graph-derived")
            mindmaps.append(
                {
                    "id": "graph-derived",
                    "title": f"{course} kavram ağacı (graf)",
                    "source": "coursegraph",
                    "nodes": nodes,
                    "edges": edges,
                }
            )

        payload = {
            "course": course,
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "mindmaps": mindmaps,
        }
        (OUT / f"{course}.json").write_text(
            json.dumps(payload, ensure_ascii=False), encoding="utf-8"
        )
        (OUT / f"{course}.html").write_text(
            render_html(course, mindmaps), encoding="utf-8"
        )
        index_rows.append(
            {
                "course": course,
                "title": g.nodes.get(cnid, {}).get("title", course),
                "mindmaps": [
                    {"id": m["id"], "title": m["title"], "nodes": len(m["nodes"]), "source": m["source"]}
                    for m in mindmaps
                ],
            }
        )

    (OUT / "index.json").write_text(
        json.dumps(
            {
                "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "courses": index_rows,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    (OUT / "index.html").write_text(render_index_html(index_rows), encoding="utf-8")
    return {"out": str(OUT), "courses": len(index_rows), "maps": sum(len(r["mindmaps"]) for r in index_rows)}


def render_html(course: str, mindmaps: list[dict]) -> str:
    data = json.dumps({"course": course, "mindmaps": mindmaps}, ensure_ascii=False)
    # Cytoscape CDN; data embedded
    return f"""<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8"/>
<title>{course} zihin haritası</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<script src="https://unpkg.com/cytoscape@3.30.2/dist/cytoscape.min.js"></script>
<style>
  body {{ margin:0; font-family: system-ui, sans-serif; background:#f8f4ea; color:#1b2a4a; }}
  header {{ padding:12px 16px; background:#1b2a4a; color:#f8f4ea; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }}
  header select {{ font-size:14px; padding:4px 8px; }}
  #cy {{ width:100vw; height:calc(100vh - 52px); }}
  #detail {{ position:fixed; right:12px; bottom:12px; max-width:360px; background:#fff; border:1px solid #b08d4a; border-radius:8px; padding:12px; display:none; box-shadow:0 4px 16px rgba(0,0,0,.12); }}
  #detail h3 {{ margin:0 0 6px; font-size:14px; color:#b08d4a; }}
  #detail p {{ margin:0; font-size:13px; line-height:1.4; }}
</style>
</head>
<body>
<header>
  <strong>{course}</strong>
  <select id="mapSel"></select>
  <span id="meta" style="opacity:.8;font-size:12px"></span>
</header>
<div id="cy"></div>
<div id="detail"><h3 id="dTitle"></h3><p id="dBody"></p></div>
<script>
const DATA = {data};
const sel = document.getElementById('mapSel');
DATA.mindmaps.forEach((m, i) => {{
  const o = document.createElement('option');
  o.value = i; o.textContent = m.title + ' (' + m.nodes.length + ')';
  sel.appendChild(o);
}});
let cy;
function build(idx) {{
  const m = DATA.mindmaps[idx];
  document.getElementById('meta').textContent = m.source;
  const nodes = m.nodes.map(n => ({{
    data: {{ id: n.id, label: n.label, desc: n.desc || '' }},
    classes: 'd' + Math.min(n.depth || 0, 4)
  }}));
  const edges = m.edges.map((e, i) => ({{ data: {{ id: 'e'+i, source: e.source, target: e.target }} }}));
  if (cy) cy.destroy();
  cy = cytoscape({{
    container: document.getElementById('cy'),
    elements: nodes.concat(edges),
    style: [
      {{ selector: 'node', style: {{
        'label': 'data(label)', 'text-wrap':'wrap', 'text-max-width':'140px',
        'font-size':'11px', 'text-valign':'bottom', 'text-margin-y':'6px',
        'background-color':'#1b2a4a', 'color':'#1b2a4a',
        'width': 18, 'height': 18, 'shape':'ellipse'
      }} }},
      {{ selector: 'edge', style: {{ 'curve-style':'bezier', 'target-arrow-shape':'triangle', 'line-color':'#b08d4a', 'target-arrow-color':'#b08d4a', 'width':1.5 }} }},
      {{ selector: 'node.d0', style: {{ 'background-color':'#b08d4a', 'width':28, 'height':28, 'font-weight':'bold', 'font-size':'13px' }} }},
      {{ selector: 'node.d2', style: {{ 'background-color':'#3d5a80' }} }},
      {{ selector: 'node.d3, node.d4', style: {{ 'background-color':'#6b7c93', 'width':12, 'height':12 }} }},
      {{ selector: '.highlight', style: {{ 'border-width':3, 'border-color':'#b08d4a' }} }}
    ],
    layout: {{ name:'cose', animate:false, padding:40 }}
  }});
  cy.on('tap', 'node', evt => {{
    const n = evt.target;
    document.getElementById('dTitle').textContent = n.data('label');
    document.getElementById('dBody').textContent = n.data('desc') || '';
    document.getElementById('detail').style.display = 'block';
  }});
  cy.on('tap', evt => {{ if (evt.target === cy) document.getElementById('detail').style.display = 'none'; }});
}}
sel.onchange = () => build(+sel.value);
build(0);
</script>
</body>
</html>
"""


def render_index_html(rows: list[dict]) -> str:
    items = []
    for r in rows:
        links = ", ".join(
            f'<a href="{r["course"]}.html#{m["id"]}">{m["title"]}</a>' for m in r["mindmaps"]
        )
        # html fragment hash selection needs support; keep simple links to course html
        links = ", ".join(
            f'<a href="{r["course"]}.html">{m["title"]}</a>' for m in r["mindmaps"]
        )
        items.append(f"<li><strong>{r['title']}</strong> ({r['course']})<br/>{links}</li>")
    return f"""<!DOCTYPE html>
<html lang="tr"><head><meta charset="utf-8"/><title>CourseGraph Zihin Haritaları</title>
<style>body{{font-family:system-ui;max-width:720px;margin:2rem auto;padding:0 1rem;background:#f8f4ea;color:#1b2a4a}}</style>
</head><body>
<h1>Canlı zihin haritaları</h1>
<p>CourseGraph indeksinden üretildi. Ders verisi değişince <code>python -m coursegraph.indexer</code> + <code>python -m coursegraph.mindmap</code> yeniler (veya watcher).</p>
<ul>{''.join(items)}</ul>
</body></html>
"""


def main() -> int:
    from .graph import load

    # rebuild graph first for graph-derived maps
    from .indexer import write_index

    write_index()
    load.cache_clear if False else None
    import coursegraph.graph as gg

    gg._cache = None
    g = gg.load()
    result = build_mindmaps(g)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
