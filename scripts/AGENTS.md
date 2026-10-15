# scripts/

## Purpose
- Flat collection of Python scripts that move content between sources, `data/`, `site/`, `okf/`, and NotebookLM.
- `scripts/` is **not** a package (no `__init__.py`); run scripts as files (`py -3 scripts/<name>.py`) or load them by path in tests.

## Ownership
Extraction (PDF → `data/`):
- `extract_turk_dili_exams.py`, `extract_ataturk_exams.py`, `extract_osmanlica_exams.py` — past-exam PDFs → `data/<slug>/past_exams.json`.
- `extract_aof_infographics.py` — AÖF infographic PDFs → high-DPI page PNGs.

Generation (`data/` → richer content):
- `generate_unit_quizzes.py` — past-exam sources → `data/<slug>/unit_quizzes/unit-N.json`. Shuffles options; holds per-course NotebookLM ids and unit titles.
- `render_unit_infographics.py` — book unit summaries → unit infographics.
- `update_notes_from_kitap.py` — refreshes study notes from `Kitap.pdf`, embedding citations.

Export (`data/` → site/bundle):
- `export_unit_quizzes_site.py` — `unit_quizzes/*.json` → `site/unit_quizzes.js` (`window.UNIT_QUIZZES`).
- `export_past_exams_site.py` — `past_exams.json` → `site/past_exams.js` (`window.PAST_EXAMS`); adds unit/chapter tags, answer key, and auto-generated solutions.
- `export_okf.py` — course data → the `okf/` Markdown bundle; wipes `okf/` except `okf/AGENTS.md`.

Infographic QA/repair:
- `compare_nlm_infographics.py`, `fix_infographic_text.py`, `generate_nlm_infographics.py`.
- `recreate_structure.py`, `recreate_build_manifest.py`, `recreate_render_html.py`, `recreate_chrome_shot.py` — rebuild infographic HTML/PNG from a structure manifest.

NotebookLM maintenance (needs the `notebooklm-py` CLI):
- `add_aof_sources_to_notebooks.py`, `dedupe_notebook_sources.py`.

Validation:
- `check_quiz_answers.py` — integrity check across all quiz JSON plus `site/unit_quizzes.js` consistency.

## Local Contracts
- Most export scripts define `ROOT` and a `SLUGS` list at module level; tests monkeypatch these to run against a temp directory. Keep them module-level and reassignable.
- Readers use `encoding="utf-8-sig"`; writers use `ensure_ascii=False`.
- Several scripts depend on `coursegraph.past_exams` (imported after a `sys.path.insert(0, ROOT)`); keep that import order.

## Work Guidance
- After editing `data/`, re-run the relevant extract/generate/export script, then regenerate the graph (see `coursegraph/AGENTS.md`) so `site/` and the index stay in sync.
- Do not add third-party dependencies; the scripts target Python 3 stdlib (Pillow only where noted for image work).

## Verification
- `py -3 scripts/check_quiz_answers.py` exits 0 when all quiz data and the site bundle agree.
- `py -3 -m unittest discover -s tests` covers `chapter_meta`/`build_solution` and the unit-quiz export (`tests/test_exports.py`).

## Child DOX Index
- None. Scripts are a flat list, not nested boundaries.
