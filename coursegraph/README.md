# CourseGraph

Ders verisi için CodeGraph mantığında yerel bilgi grafiği + MCP sunucusu.

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
# indeksi üret (veri değiştikten sonra)
python -m coursegraph.indexer

# MCP sunucusu (stdio) — opencode.json zaten kayıtlı
python -m coursegraph.server
```

opencode için: `opencode.json` → `mcp.coursegraph`. Değişiklikten sonra **opencode'u yeniden başlat**.

## MCP araçları

| Araç | Ne yapar |
|------|----------|
| `course_explore(query)` | Surgical context: en iyi bölüm/kavram/quiz + komşular |
| `course_search(query)` | Hızlı arama |
| `course_impact(term)` | Terimin etkilediği bölümler/sorular |
| `course_overview(slug)` | Ders: üniversite, dönem, bölümler, sınavlar |
| `chapter_detail(course, n)` | Bölüm + kavramlar + timeline |
| `coursegraph_stats()` | Graf boyutu |
| `coursegraph_rebuild()` | Grafiği yeniden üret |

## Python API

```python
from coursegraph.graph import load
g = load()
g.explore("Lozan")
g.impact("mezhep")
```

İndeks: `coursegraph/index/graph.json` (~800KB, commit edilir).
