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
- `test_common.py` — `generator/scripts/common.py`: the pipeline `Lock` (second runner refused, stale lock cleared), `_pid_alive` (Windows needs `OpenProcess`, `os.kill(pid, 0)` is a `CTRL_C_EVENT` there), `source_tier` (type, title and URL matching, `exclude_titles`), `notebook_source_id` (`nlm_id`, else the source's own `id`), `excluded_from_grounding` and `with_authority` (an excluded source never grounds a chapter, `max_add`), the per-course config (`courses.json` → `config`) and `generator/scripts/quiz_types.py` with its agreement with the site's `GRADED` set. Also checks that the technical course's unit titles equal its chapter titles.
- `test_site_copy.py` — the site template's copy contract: the Turkish noun table
  (`NOUN_FORMS`/`nounForm`: "0 kaynak", "kaynağı", "kaynakların"), the absence of glued suffixes
  (`noun(c, n) + "yı"`), the "puanlık soru" quiz header, and the both-paths copy
  (`HAS_NOTEBOOK`/`HAS_QUIZ` guard every NotebookLM credit, a course only promises the exam it has).
  It also checks `site/app.js` is the built template. The behavioural test runs the extracted JS
  block with `node` and skips itself when `node` is not on PATH. It also locks the closed quiz path:
  a course with no questions hides `Final (oyun)`, the `Sınav` row and `Sınavı çöz`, and its quiz
  route renders `viewNoQuiz()`, the exam hub's final card has no link, and the mixed test page
  refuses an empty pool, the bilingual reading path is gone (no `pair` in the data, no view, route or CSS in
  the template), plus the glossary deck's route, pick action, Leitner schedule and its share of the streak. A second
  node-run check drives the word queue: with an exam plan the in-scope word comes first, without a plan the
  oldest review wins, and a word with no recorded chapter never counts as in scope.
- `test_study_app.py` — `scripts/build_study_app.py`: one self-contained HTML file (no `<link>`, no external `src`/`href`), the embedded data the page ships (chapters, cards, quiz, sources), the deck fallback (`flashcards.json` → `chat.json` → quiz), citation markers dropped from notes, a note containing `</script>` that cannot break out of the data block, and all four question types reaching the page with their answer (option, blank, select, short answer), and a source option marked `isPartiallyCorrect` reaching the app as a partly correct option. It also pins the review contract: every question gets a `qid` derived from its normalized stem (whitespace and case do not change it), unit titles travel once in `units`, and the page ships the Tekrar tab, the `STEPS = [0, 1, 3, 7, 16]` schedule, the `q`/`pick` log, a due queue that only takes already answered questions, and   the panel's question analysis with its two option lists (partly correct kept apart from traps), the JSON
  backup the panel downloads and restores (`app`/`st` envelope, `readAsText`, the reload after a restore) and
  today's due count on the Tekrar tab's label, and the per-course progress key with its one-time move
  from the old shared key (two courses of one `storageKey` get different keys, and the shared key is
  removed after the move). Also `pipeline.parse_cards` (card JSON, invalid escapes,
  empty/oversized cards, an unparsable answer).
- `test_extension.py` — `extensions/notebooklm-study-app/`: the MV3 manifest (popup exists, only `activeTab`/`scripting`, only the two NotebookLM hosts, no background worker or content script), no remote code or `eval` in the extension files, the generated `app-shell.js` equal to `scripts/export_app_shell.py`'s output, and a `node` run of `core.js` (payload from typed fields and from the pipeline's JSON, the question types it carries, the `qid` its `questionId()` computes against the builder's `_qid()` plus the empty `units` map, `</script>` escaping, `slugify` on Turkish letters, and a rendered page that matches `build_study_app.render_app`). The node checks skip when `node` is missing.
- `test_build.py` — `generator/scripts/build.py`'s `clean()`: numbered and by-title citation markers are dropped, markdown links and the reference list survive, and an escaped product identifier (`V\\(CLUSTER_INTERCONNECTS`) is restored to `V$CLUSTER_INTERCONNECTS` while real LaTeX is kept. It also pins the offline split: `chat.js` is not in `SHELL_FILES`, and the built `data.js`
  offers it as its own `soru` pack.
- `test_chat.py` — the question-and-answer corpus: the generator reads the model's JSON (including the invalid escapes it writes), the prompt asks for source citations, the export drops incomplete items, the OKF page groups the corpus by chapter, and the retrieval rule rejects a hit below a third of the best possible score or below 40% question-term coverage. The stop words and both thresholds are read from `app.js`, so the test cannot drift from the site.
- `test_check_chat_corpus.py` — `scripts/check_chat_corpus.py`: a clean corpus has no findings, a missing answer or
  source, a citation outside the source list, a repeated question (case and spacing ignored), a placeholder answer and a
  chapter past the plan are errors, an over-long answer and an uncovered chapter are warnings, a source list without the tier-0 textbook warns (an error under `strict`), and the corpora in the repository must stay error-free.
- `test_mcp_server.py` — the MCP server's JSON-RPC contract over stdio: `initialize`, `tools/list`, `tools/call`, unknown tool → `-32602`, malformed JSON → `-32700`.
- `test_brand.py` — the brand: the name in `university.json`/`universities.json`, the stable `storageKey`
  (a rename must not wipe a reader's progress), the emblem geometry shared by `crest.svg`, `favicon.svg`
  and `app.js`'s `crest()`, and the notes' wording (they do not address the reader as a student; historical
  uses such as "Ebû Hanife'nin öğrencileri" survive).
- `test_site_artifact.py` — the release contract: the template's CSP is `script-src 'self'`, has no inline
  `<script>`, and `app.js` loads KaTeX from `vendor/katex/` (no `cdnjs` left); `scripts/vendor_katex.py --check`
  matches every pinned digest; `build.py` copies `vendor/` but keeps it out of `SHELL_DIRS`; and
  `scripts/verify_site.py` accepts a good synthetic tree while rejecting an external `script-src`, an inline
  script, a missing `pu-version`, a stale `sw.js` `VERSION`, a shell entry that is not on disk, KaTeX inside
  the shell, an oversized file, WebP files that `data.js` does not list (a Pillow-less build), a leaked
  `AGENTS.md` under `--deploy`, and a live release that still serves the old `pu-version`. The real built
  `site/` must also pass the contract.
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
- `py -3 -m unittest discover -s tests` — 254 tests, must exit 0. Run after any change to `data/`, `coursegraph/`, or the export scripts.
- CI runs the same command on every push to `main` and on every pull request (`.github/workflows/tests.yml`).

## Child DOX Index
- None. Flat set of test modules.
