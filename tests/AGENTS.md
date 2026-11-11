# tests/

## Purpose
- Guards the graph, quiz data, and export contracts so content and bundle edits do not silently break the site.
- Uses only the Python standard library; no test framework dependency.

## Ownership
- `test_indexer.py` — `fold`/`tokenize` (Turkish casing, diacritics, Arabic script) and `GraphBuilder` upsert/dedup.
- `test_past_exams.py` — unit configs, keyword extraction, unit classification.
- `test_graph.py` — `CourseGraph` query layer on a temporary fixture graph (search ranking, explore, impact, overview, chapter detail, missing-index error).
- `test_quiz_data.py` — the quiz checker's own behavior on synthetic bad input, plus real-data integrity and `site/unit_quizzes.js` consistency.
- `test_exports.py` — `chapter_meta`/`build_solution`, the unit-quiz export in a sandboxed `ROOT`, the `past_exams.js`/`unit_quizzes.js` bundle contracts, the OKF export's "a broken input leaves the bundle intact" guarantee, and the grounding helpers plus `audit_sources.audit`.
- `test_common.py` — `generator/scripts/common.py`: the pipeline `Lock` (second runner refused, stale lock cleared), `_pid_alive` (Windows needs `OpenProcess`, `os.kill(pid, 0)` is a `CTRL_C_EVENT` there), `source_tier` (type, title and URL matching, `exclude_titles`), `excluded_from_grounding` and `with_authority` (an excluded source never grounds a chapter, `max_add`), the per-course config (`courses.json` → `config`) and `generator/scripts/quiz_types.py` with its agreement with the site's `GRADED` set. Also checks that the technical course's unit titles equal its chapter titles.
- `test_site_copy.py` — the site template's copy contract: the Turkish noun table
  (`NOUN_FORMS`/`nounForm`: "0 kaynak", "kaynağı", "kaynakların"), the absence of glued suffixes
  (`noun(c, n) + "yı"`), the "puanlık soru" quiz header, and the both-paths copy
  (`HAS_NOTEBOOK`/`HAS_QUIZ` guard every NotebookLM credit, a course only promises the exam it has).
  It also checks `site/app.js` is the built template. The behavioural test runs the extracted JS
  block with `node` and skips itself when `node` is not on PATH. It also locks the closed quiz path:
  a course with no questions hides `Final (oyun)`, the `Sınav` row and `Sınavı çöz`, and its quiz
  route renders `viewNoQuiz()`, the exam hub's final card has no link, and the mixed test page
  refuses an empty pool, and the bilingual reading view only appears for a course whose `pair` exists and
  whose counterpart has that chapter, plus the glossary deck's route, pick action and Leitner schedule.
- `test_build.py` — `generator/scripts/build.py`'s `clean()`: numbered and by-title citation markers are dropped, markdown links and the reference list survive, and an escaped product identifier (`V\\(CLUSTER_INTERCONNECTS`) is restored to `V$CLUSTER_INTERCONNECTS` while real LaTeX is kept.
- `test_mcp_server.py` — the MCP server's JSON-RPC contract over stdio: `initialize`, `tools/list`, `tools/call`, unknown tool → `-32602`, malformed JSON → `-32700`.
- `__init__.py` — package marker for discovery.

## Local Contracts
- Tests load `scripts/` modules by file path (`importlib.util.spec_from_file_location`) because `scripts/` is not a package.
- Tests that touch the filesystem monkeypatch module-level `ROOT`/`SLUGS` to a temp directory; never write into the real `data/` or `site/`.
- Tests that need `generator/scripts/` put it on `sys.path` (it is not a package either).
- Assertions must reflect real behavior; fix a wrong expectation rather than weakening the assertion.

## Work Guidance
- Add a test when introducing a new export contract, graph relation, or quiz invariant.
- Keep the suite stdlib-only (`unittest`); do not add pytest.

## Verification
- `py -3 -m unittest discover -s tests` — 136 tests, must exit 0. Run after any change to `data/`, `coursegraph/`, or the export scripts.
- CI runs the same command on every push to `main` and on every pull request (`.github/workflows/tests.yml`).

## Child DOX Index
- None. Flat set of test modules.
