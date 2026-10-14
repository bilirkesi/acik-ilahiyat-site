# coursegraph/

## Purpose
- Builds and serves a local knowledge graph over course content so the agent can query it precisely instead of scanning raw JSON.
- Provides the MCP server (`opencode.json` → `mcp.coursegraph`) and the browser search index the site loads lazily.

## Ownership
- `indexer.py` — reads `courses.json`, `universities.json`, `data/*/`, `site/interactive.js`, `artifacts/catalog.json`; writes `index/graph.json` + `index/meta.json`. Exports `fold`, `tokenize`, `GraphBuilder`.
- `graph.py` — `CourseGraph` query layer: `search`, `explore`, `impact`, `course_overview`, `chapter_detail`, `stats`, `related_nodes`. Loads `index/graph.json`, memoized via `load()`.
- `past_exams.py` — unit/keyword config per course (`COURSE_UNIT_CONFIGS`), `classify_unit`, `extract_keywords`, `annotate_questions`, `unit_coverage`. Consumed by `indexer.py` and the export scripts.
- `mindmap.py` — writes `index/mindmaps/<slug>.json|.html` and `index.json`/`index.html` (Cytoscape) from NotebookLM `mind-map__*.json` plus interactive trees.
- `site_export.py` — writes `site/coursegraph.js` (`window.CG`), the browser search index.
- `server.py` — stdio MCP server exposing the graph to the agent.
- `watch.py` — polling watcher that rebuilds on change (`--once` for a single pass).
- `index/` — generated but **tracked**. Treat it as build output; regenerate rather than hand-edit.

## Local Contracts
- `fold(s)` lowercases Turkish correctly (`ı→i`, `İ→i`) and maps `â/î/û→i/i/u` **before** NFD; `tokenize` splits on non-alphanumerics.
- Node ids are `type:course:qualifier`, zero-padded: `course:{slug}`, `chapter:{slug}:{NN}`, `unit:{slug}:{u}`, `uquiz:{slug}:{u}`, `uquizq:{slug}:{u}:{NNN}`, `quizq:{slug}:{NNN}`, `examq:{slug}:{exam}:{NNN}`, `pastexam:{slug}:{exam_id}`, `pastq:{slug}:{exam_id}:{NN}`, `concept:{slug}:{fold(term)[:40]}`, `kw:{slug}:{fold(kw)[:40]}`.
- Relation names: `has_course`, `contains_course`, `has_chapter`, `cites_source`, `defines_concept`, `mentions_concept`, `has_timeline_event`, `mentions_event`, `has_quiz`, `has_exam`, `has_unit`, `has_unit_quiz`, `in_unit`, `in_chapter`, `unit_chapter`, `has_question`, `has_past_exam`, `covers_unit`, `covers_chapter`, `has_keyword`, `cites_past_question`, `has_artifact`.
- `search()` adds `+10` for an exact folded-title phrase key (`inverted["__phr__…"]`), `+3` for title substring, `+1` per inverted-index token hit.
- `build()` shells out to `node` via `dump_interactive()` to read `site/interactive.js`; `node` must be on PATH to rebuild.
- Unknown course slug in `course_unit_cfg()` falls back to the islam-mezhepleri-tarihi config (backward compatibility).

## Work Guidance
- After changing `data/*/`, `courses.json`, or `site/interactive.js`, regenerate: `py -3 -m coursegraph.indexer`, then `py -3 -m coursegraph.mindmap` and `py -3 -m coursegraph.site_export`.
- Keep `fold`/`tokenize` behavior stable — `graph.py`, `mindmap.py`, `past_exams.py`, and `site/app.js` all depend on it.
- When adding a course, add its unit titles/chapters/keywords to `COURSE_UNIT_CONFIGS` in `past_exams.py` before building.

## Verification
- `py -3 -m unittest discover -s tests` covers `indexer` (`test_indexer.py`), `past_exams` (`test_past_exams.py`), and the `CourseGraph` query layer (`test_graph.py`).

## Child DOX Index
- None. `index/` is generated graph output (see Ownership), not a code boundary.
