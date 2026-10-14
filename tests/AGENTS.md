# tests/

## Purpose
- Guards the graph, quiz data, and export contracts so content and bundle edits do not silently break the site.
- Uses only the Python standard library; no test framework dependency.

## Ownership
- `test_indexer.py` — `fold`/`tokenize` (Turkish casing, diacritics, Arabic script) and `GraphBuilder` upsert/dedup.
- `test_past_exams.py` — unit configs, keyword extraction, unit classification.
- `test_graph.py` — `CourseGraph` query layer on a temporary fixture graph (search ranking, explore, impact, overview, chapter detail, missing-index error).
- `test_quiz_data.py` — the quiz checker's own behavior on synthetic bad input, plus real-data integrity and `site/unit_quizzes.js` consistency.
- `test_exports.py` — `chapter_meta`/`build_solution`, the unit-quiz export in a sandboxed `ROOT`, and the `past_exams.js`/`unit_quizzes.js` bundle contracts.
- `__init__.py` — package marker for discovery.

## Local Contracts
- Tests load `scripts/` modules by file path (`importlib.util.spec_from_file_location`) because `scripts/` is not a package.
- Tests that touch the filesystem monkeypatch module-level `ROOT`/`SLUGS` to a temp directory; never write into the real `data/` or `site/`.
- Assertions must reflect real behavior; fix a wrong expectation rather than weakening the assertion.

## Work Guidance
- Add a test when introducing a new export contract, graph relation, or quiz invariant.
- Keep the suite stdlib-only (`unittest`); do not add pytest.

## Verification
- `py -3 -m unittest discover -s tests` — 63 tests, must exit 0. Run after any change to `data/`, `coursegraph/`, or the export scripts.

## Child DOX Index
- None. Flat set of test modules.
