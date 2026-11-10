# Açık İlahiyat Üniversitesi

**Açık İlahiyat** — AÖF (Anadolu Üniversitesi) İlahiyat ön lisans dersleri için ücretsiz, internetsiz
çalışan bir ders sitesi. Statik bir PWA: sunucu tarafı yok, her şey `window.*` veri paketleriyle
tarayıcıda çalışıyor.

**Live site:** <https://bilirkesi.github.io/acik-ilahiyat-site/>

---

## What is in it

| Course | Code | Chapters | Unit quizzes | Questions | Practice exams | Chapter audio |
|---|---|---|---|---|---|---|
| İslam Mezhepleri Tarihi | İLH207U | 6 | 6 | 90 | 3 | 6 |
| Türk Dili I | TÜR201U | 8 | 8 | 115 | 3 | 8 |
| Atatürk İlkeleri ve İnkılap Tarihi I | TAR201U | 8 | 8 | 108 | 3 | 8 |
| Osmanlı Türkçesi I | TAR111U | 8 | 8 | 123 | – | 8 |

30 chapters, 436 questions, and every past midterm (çıkmış vize) of the last five academic years.

On the site a student can:

- read the chapter notes with the AÖF infographics and the book unit summaries side by side,
- drill the unit quizzes and the past exams, with an answer key and per-question solutions,
- review with an FSRS-4.5 spaced-repetition desk, wrong-answer list and daily streak,
- play the word games and the Ottoman Turkish letter workshop,
- highlight and annotate the notes, export them as a printed booklet,
- share a challenge with a friend (no server involved),
- install it as an app and download each course for offline use.

## How it is put together

```
courses.json + university.json + data/<slug>/
        │
        ├── generator/scripts/build.py ─────► site/          static SPA (the published site)
        │                                        ├── data.js           window.UNIVERSITY / COURSES / OFFLINE
        │                                        ├── app.js            the whole SPA
        │                                        └── past_exams.js, unit_quizzes.js, coursegraph.js
        │
        ├── coursegraph/indexer.py ─────────► coursegraph/index/graph.json
        │       └── site_export.py ─────────► site/coursegraph.js   browser search index
        │       └── mindmap.py ─────────────► coursegraph/index/mindmaps/
        │
        └── scripts/export_okf.py ──────────► okf/          Open Knowledge Format v0.2 Markdown bundle
```

`data/<slug>/` is the single source of truth for course content. `site/` and `okf/` are **build
output** — change the data or the template and rebuild, never edit the generated copy by hand.

Study material is generated with [NotebookLM](https://notebooklm.google.com) from the AÖF textbook
PDFs and YouTube lecture captions, through the `notebooklm` CLI of `notebooklm-py`. The ranking of
source kinds (textbook first, lecture captions last) lives in `university.json` → `grounding`.

## Requirements

- **Python 3.8+**, standard library only — no third-party packages are needed for the site, the
  graph, the exports or the tests.
- **Node.js** — only to rebuild the graph and the OKF bundle (`dump_interactive()` reads
  `site/interactive.js` through `node`).
- Optional, for content generation only: `notebooklm-py` (`notebooklm login` once), `ffmpeg` for
  the chapter audio, and Pillow for the image variants.

On Windows the working launcher is `py -3`; `python` is usually not on PATH.

## Common commands

Run from the repository root.

```sh
# serve the site locally
py -3 -m http.server 8000 --bind 127.0.0.1     # then open http://127.0.0.1:8000/ from site/

# rebuild site/ from data/ + generator/site-template/
py -3 generator/scripts/build.py .

# rebuild the knowledge graph, the mind maps and the browser search index
py -3 -m coursegraph.indexer
py -3 -m coursegraph.mindmap
py -3 -m coursegraph.site_export

# rebuild the exam bundles and the OKF bundle
py -3 scripts/export_past_exams_site.py
py -3 scripts/export_unit_quizzes_site.py
py -3 scripts/export_okf.py

# checks
py -3 -m unittest discover -s tests        # the test suite
py -3 scripts/check_quiz_answers.py         # quiz data integrity
py -3 scripts/audit_sources.py              # how authoritative each chapter's sources are
py -3 generator/scripts/qa.py .             # pre-publish QA of the built site
```

### The knowledge graph as an MCP server

`coursegraph/server.py` exposes the graph to an agent over MCP (stdio, JSON-RPC 2.0, standard
library only). It is already wired up in `opencode.json`:

```sh
py -3 -m coursegraph.server
```

Tools: `coursegraph_stats`, `course_explore`, `course_search`, `course_impact`,
`course_overview`, `chapter_detail`, `coursegraph_rebuild`, `course_mindmap`,
`course_mindmap_index`, `past_exam_coverage`.

## Repository layout

| Path | What it is |
|---|---|
| `data/<slug>/` | course content: study plan, quizzes, exams, past exams, learner state |
| `site/` | the generated static SPA (published to GitHub Pages) |
| `generator/` | the `personal-university` skill: build scripts and the SPA template |
| `coursegraph/` | knowledge-graph indexer, query layer, MCP server |
| `scripts/` | extraction, generation and export scripts |
| `okf/` | the Open Knowledge Format v0.2 Markdown bundle |
| `tests/` | the `unittest` suite |
| `extensions/notebook-nest/` | a patched Notebook-Nest Chrome extension, offered for download |

`artifacts/`, `assets/` and `logs/` hold large local-only material and are git-ignored.

## Contributing

`AGENTS.md` is the working contract for the whole repository, and each top-level folder has its
own. Read the root file and the one that owns the path you are about to change before editing
anything; keep them current when you change a contract.

The content pipeline is `data/` → `site/` + `okf/`. Any change to course content needs the graph,
the site and the OKF bundle regenerated, and the test suite green.

## License

GPL-3.0 — see [`LICENSE`](LICENSE). The vendored `extensions/notebook-nest/` keeps its own
GPL-3.0 notice. The course material is derived from the published AÖF textbooks and is used for
private study.
