# CourseGraph

Ders verisi için CodeGraph mantığında yerel bilgi grafiği + MCP sunucusu + **canlı zihin haritaları**.

## Düğüm / kenar

| Tip | İçerik |
|-----|--------|
| university, term, course | AÖF/İÜ, 2026-2027 Güz, dersler |
| chapter, concept, event | Bölüm, kavram, timeline olayı |
| quiz_question, exam_question | Test ve vize/final/yaz soruları |
| artifact, source | NotebookLM çıktıları, kaynaklar |

Kenarlar: `has_course`, `has_chapter`, `defines_concept`, `mentions_concept`, `has_quiz`, `has_exam`, `has_question`, `has_artifact`, …

## Kurulum

```bash
# indeks + zihin haritaları + site arama JS (veri değiştikten sonra)
python -m coursegraph.mindmap
python -m coursegraph.site_export

# canlı izleyici (debounce 1.5s; interactive.js, data/, courses.json, catalog.json)
python -m coursegraph.watch

# tek sefer rebuild
python -m coursegraph.watch --once

# MCP sunucusu (stdio) — opencode.json zaten kayıtlı
python -m coursegraph.server
```

opencode için: `opencode.json` → `mcp.coursegraph`. Değişiklikten sonra **opencode'u yeniden başlat**.

## Canlı zihin haritaları

Kaynak: `interactive.tree`, `interactive.chapters`, NotebookLM `mind-map__*.json`, graf türevi (bölüm→kavram).

Çıktı: `coursegraph/index/mindmaps/`

| Dosya | İçerik |
|-------|--------|
| `<slug>.html` | Cytoscape interaktif harita (self-contained) |
| `<slug>.json` | Harita nodes/edges |
| `index.html` / `index.json` | Tüm dersler |

`watch` çalışırken `interactive.js` veya `data/` değişince graf + harita otomatik yenilenir.

## Site arama (`coursegraph.site_export`)

`site/coursegraph.js` → `window.CG` (items + edges). Sitede `#/ara`, üst çubuk araması ve özet sayfasındaki "İlgili kavram, test ve sınav" kutusu bu indeksi kullanır. `build.py` siteyi yeniden kurarken `coursegraph.js`'i korur; indeks tazelendikten sonra `site_export` + `build.py` çalıştırın.

## MCP araçları

| Araç | Ne yapar |
|------|----------|
| `course_explore(query)` | Surgical context: en iyi bölüm/kavram/quiz + komşular |
| `course_search(query)` | Hızlı arama |
| `course_impact(term)` | Terimin etkilediği bölümler/sorular |
| `course_overview(slug)` | Ders: üniversite, dönem, bölümler, sınavlar |
| `chapter_detail(course, n)` | Bölüm + kavramlar + timeline |
| `course_mindmap(course[, id])` | Zihin haritası JSON |
| `course_mindmap_index()` | Tüm haritaların listesi |
| `coursegraph_stats()` | Graf boyutu |
| `coursegraph_rebuild()` | Graf + mindmap yeniden üret |

## Python API

```python
from coursegraph.graph import load
g = load()
g.explore("Lozan")
g.impact("mezhep")
```

İndeks: `coursegraph/index/graph.json` + `mindmaps/` (commit edilir).
