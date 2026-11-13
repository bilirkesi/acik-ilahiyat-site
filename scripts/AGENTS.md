# scripts/

## Purpose
- Flat collection of Python scripts that move content between sources, `data/`, `site/`, `okf/`, and NotebookLM.
- `scripts/` is **not** a package (no `__init__.py`); run scripts as files (`py -3 scripts/<name>.py`) or load them by path in tests.

## Ownership
Extraction (PDF → `data/`):
- `extract_turk_dili_exams.py`, `extract_ataturk_exams.py`, `extract_osmanlica_exams.py` — past-exam PDFs → `data/<slug>/past_exams.json`.
- `extract_aof_infographics.py` — AÖF infographic PDFs → high-DPI page PNGs.

Generation (`data/` → richer content):
- `generate_unit_quizzes.py` — past-exam + textbook (`Kitap`) sources → `data/<slug>/unit_quizzes/unit-N.json`. Shuffles options; holds per-course NotebookLM ids and unit titles. Only for the AÖF courses; a course that has no past exams uses `generate_assessments.py`.
- `generate_assessments.py` — for a course whose units are its chapters: one unit quiz per chapter, limited to that chapter's own sources, plus the three practice exams (`vize`, `final`, `yaz-kursu`) → `data/<slug>/unit_quizzes/unit-N.json` and `data/<slug>/exams/*.json`. Reads the plan, the sources and the course's own `grounding` from `courses.json`. Exam titles and the unit-quiz title prefix follow the course's language (`Turkish` → "Ara Sınav", "Bölüm N"). The questions' language is checked after the download: the CLI's output language is a global setting, so a quiz can come out in the wrong language; it is then regenerated.
- `render_unit_infographics.py` — book unit summaries → unit infographics.
- `update_notes_from_kitap.py` — refreshes study notes from `Kitap.pdf`, embedding citations.
- `generate_chat.py` — a course's chapters → a question-answer corpus in `data/<slug>/chat.json`. One
  `notebooklm ask` per chapter (scoped to that chapter's sources with `-s`) returns the questions a student
  would ask and the answers; the prompt asks for source citations, and the answer's `references` become the
  item's source list. The site is static, so the corpus is built here rather than asked live in the browser.
  `--only N` limits it to one chapter, `--force` regenerates, `--count` sets the questions per chapter,
  `--normalize` only repairs the citation numbers of an existing corpus. The chapter's sources come from the
  plan's `source_ids`; they are matched against `state.json` by the source's `id` field and sent to the CLI as
  `nlm_id`, and an id that matches nothing is resolved by keyword and number (e.g. `osm1-kitap-2`).
  `renumber_citations()` drops the citation markers that point outside the source list (NotebookLM sometimes
  numbers a source of the whole notebook), renumbers the rest from 1, and falls back to the chapter's sources
  when no marker fits.
- `render_brand_icons.py` — the brand emblem (an open book with light behind it) from one geometry: writes
  `generator/site-template/favicon.svg` and `crest.svg` plus the PWA icons (`icons/*.png`, Pillow). The crest
  in `app.js` carries the same coordinates; `tests/test_brand.py` compares them.
- `export_chat_site.py` — `data/<slug>/chat.json` → `site/chat.js` (`window.CHAT`), the bundle the
  question-and-answer page retrieves from.
- `generate_chapter_audio.py` — per chapter, a NotebookLM audio overview limited to the chapter's `source_ids` plus the textbook when the chapter has none (the course's own language, `deep-dive`/`short` by default) → raw `assets/audio/<slug>/chapter-N.mp4` → ffmpeg mono 64 kbps `site/audio/<slug>/chapter-N.mp3` + `data/<slug>/audio.json`. Needs the `notebooklm` CLI (logged in) and ffmpeg with libmp3lame (ffprobe optional; on the owner PC ffmpeg is not on PATH, pass `--ffmpeg`); skips existing MP3s unless `--force`; `--transcode-only` re-encodes downloaded files; `--profile` picks a notebooklm-py profile (a second Google account with the notebook shared to it, for its own audio quota). A source whose state `id` is local (not a NotebookLM UUID) is sent as its `nlm_id`; the script exits if neither is a UUID. A chapter that cannot be generated (quota, expired session) is skipped and the run continues; the script then exits non-zero and lists the chapters it could not produce.

Export (`data/` → site/bundle):
- `export_unit_quizzes_site.py` — `unit_quizzes/*.json` → `site/unit_quizzes.js` (`window.UNIT_QUIZZES`).
- `export_past_exams_site.py` — `past_exams.json` → `site/past_exams.js` (`window.PAST_EXAMS`); adds unit/chapter tags, answer key, and auto-generated solutions.
- `export_okf.py` — course data → the `okf/` Markdown bundle; wipes `okf/` except `okf/AGENTS.md`. Every input is read before the wipe, so a broken JSON file or a missing `node` leaves the previous bundle intact instead of a half-written one. It also writes each course's question-and-answer page (`courses/<slug>/chat.md`) from `data/<slug>/chat.json`.

Infographic QA/repair:
- `compare_nlm_infographics.py`, `fix_infographic_text.py`, `generate_nlm_infographics.py`.
- `recreate_structure.py`, `recreate_build_manifest.py`, `recreate_render_html.py`, `recreate_chrome_shot.py` — rebuild infographic HTML/PNG from a structure manifest.

NotebookLM maintenance (needs the `notebooklm-py` CLI):
- `add_aof_sources_to_notebooks.py`, `dedupe_notebook_sources.py`.

OCR (Windows-only, for image-based PDFs that NotebookLM indexes as page images only):
- `ocr_pdf_win.ps1` — rasterizes PDF pages with `Windows.Data.Pdf` and recognizes them with `Windows.Media.Ocr`, so no poppler/ghostscript/tesseract is needed. `-Path` (one or many), `-Dpi` (200), `-MaxWidth` (3000), `-Pages "1-10"`, `-Lang` (defaults to the first installed recognizer), `-OutDir`/`-OutFile`; stdout carries `=== <file> | sayfa N/M ===` page markers.
- `ocr_win.ps1` — the same WinRT bridge for a single image file.
- Both are PowerShell 5.1 scripts (the WinRT `IAsyncOperation`→`Task` bridging is why they are not Python) and need a Windows OCR language pack; the owner PC has only `tr`, which reads Latin text but turns `I` into `İ`.
- To make an already-uploaded image-only source searchable, pipe the text back into it: `powershell -File scripts/ocr_pdf_win.ps1 -Path belge.pdf | notebooklm source append <source-id> -` (no extra source slot is used).
- These two scripts are currently listed in `.git/info/exclude`, so they exist only on this machine.

Validation:
- `check_quiz_answers.py` — integrity check across all quiz JSON plus `site/unit_quizzes.js` consistency. Question types come from `generator/scripts/quiz_types.py`; a type outside that list is reported as unknown.
- `check_chat_corpus.py` — validates every `data/<slug>/chat.json`: each item needs a question, an answer, a chapter
  inside the plan and at least one source; the answer's `[n]` markers must index that source list; questions must not
  repeat within a course; placeholder answers ("bilmiyorum", "as an ai") fail. Answers outside 2–5 sentences, short
  answers and chapters without questions are warnings. Errors exit 1; `--slug` limits the run, `--quiet` hides warnings.
- `audit_sources.py` — per chapter, the `grounding.tiers` rank of assigned and cited sources; flags chapters with no textbook source. `--strict` exits 1 when a course notebook has no textbook at all.

## Local Contracts
- Most export scripts define `ROOT` and a `SLUGS` list at module level; tests monkeypatch these to run against a temp directory. Keep them module-level and reassignable. `SLUGS` comes from `courses.json` (`course_slugs()` in `generator/scripts/common.py`), so a new course needs no edit in the export scripts.
- Readers use `encoding="utf-8-sig"`; writers use `ensure_ascii=False`.
- Bundle writers use `newline="\n"`, so a published bundle is the same bytes on every platform.
- Several scripts depend on `coursegraph.past_exams` (imported after a `sys.path.insert(0, ROOT)`); keep that import order.
- NotebookLM generation prompts end with `grounding_rules(university)` and pick sources through `with_authority` (both in `generator/scripts/common.py`, imported after a `sys.path.insert` of `generator/scripts`). New generators must do the same.
- The NotebookLM CLI's output language is a global, account-wide setting: `cli_language()` in `common.py` always sets it (even when the old value cannot be read — skipping that produced artifacts in the wrong language) and restores it afterwards; `cli_language_set()` does the setting and confirms it took effect. `text_language()` in `common.py` guesses a text's language (`tr`/`en`) so a generator can check what came back.
- The NotebookLM CLI comes from `notebooklm-py` (`py -3 -m pip install "notebooklm-py[browser]"`, then `notebooklm login` once; the browser download happens on first login). Scripts never hardcode a machine-specific path: `add_aof_sources_to_notebooks.py`, `dedupe_notebook_sources.py`, `generate_unit_quizzes.py`, and `generate_nlm_infographics.py` resolve it with `find_cli()` from `generator/scripts/common.py` (PATH, then the running interpreter's `Scripts` folder, then `~/.local/bin` and `~/.cargo/bin`) and fall back to `require_cli()`, which prints the install instructions. `generate_chapter_audio.py` resolves `notebooklm` from PATH instead (override with `--notebooklm`).

## Work Guidance
- After editing `data/`, re-run the relevant extract/generate/export script, then regenerate the graph (see `coursegraph/AGENTS.md`) so `site/` and the index stay in sync.
- Do not add third-party dependencies; the scripts target Python 3 stdlib (Pillow only where noted for image work).

## Verification
- `py -3 scripts/check_quiz_answers.py` exits 0 when all quiz data and the site bundle agree.
- `py -3 scripts/audit_sources.py` before regenerating a course's content, to see which chapters rest only on lecture captions.
- `py -3 -m unittest discover -s tests` covers `chapter_meta`/`build_solution`, the unit-quiz export, and the OKF export's "a broken input leaves the bundle intact" guarantee (`tests/test_exports.py`).

## Child DOX Index
- None. Scripts are a flat list, not nested boundaries.
