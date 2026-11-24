# extensions/notebooklm-study-app/

## Purpose
- Chrome extension (Manifest V3) that exports the open NotebookLM notebook as one self-contained study app HTML file, the same page `scripts/build_study_app.py` writes.

## Ownership
- `manifest.json` — MV3. Permissions stay `activeTab` and `scripting`; host permissions stay limited to `notebooklm.google.com` and `notebook.google.com`. No background worker and no always-on content script: `capture.js` is injected on demand.
- `popup.html`, `popup.css`, `popup.js` — the form, the capture call and the download (blob URL plus an anchor; no `downloads` permission).
- `capture.js` — injected page script; its last expression is the value the popup receives. Best-effort selectors for the notebook title, source rows and notes.
- `core.js` — pure functions only (`blocksFrom`, `parseSources`, `parseNotes`, `normalizeQuestions`, `normalizeCards`, `questionId`, `slugify`, `buildPayload`, `renderPage`), assigned to `NLMApp` so `node` can run them.
- `normalizeQuestions()` stamps every question with `qid`: its normalized stem hashed as UTF-8 bytes with djb2/32-bit into base36, the same id `_qid()` in `scripts/build_study_app.py` writes, so review history survives an export through either route. `buildPayload()` writes `units: {}`; the extension reads one quiz file, so it has no unit titles to carry.
- `app-shell.js` — **generated** by `py -3 scripts/export_app_shell.py` from `scripts/build_study_app.py`. Never hand-edit; `tests/test_extension.py` fails when it is stale.
- `README.md` — install, use, output tabs and limits.

## Local Contracts
- One source of truth for the app's look: the CSS, HTML skeleton and page script in `scripts/build_study_app.py`. Changing them means re-running `py -3 scripts/export_app_shell.py` and rebuilding the site zip.
- `renderPage()` must stay byte-identical to `render_app()` apart from the JSON block's whitespace; the test compares the two pages.
- No remote code and no runtime selector list: the extension must work from its own files only.
- Everything is local. Do not add analytics, a server call, or a permission beyond the two above.
- `generator/scripts/build.py` zips this folder (minus `AGENTS.md`) into `site/downloads/notebooklm-study-app.zip`.

## Work Guidance
- Read `README.md` for the user-facing contract before changing what the popup exports.
- The capture heuristics are deliberately tolerant: a wrong guess must only cost an edit in the popup, never a broken export.

## Verification
- `node --check capture.js`, `node --check core.js`, `node --check popup.js`.
- `py -3 -m unittest tests.test_extension` — manifest shape, the generated shell matching the builder, and the `node` run of `core.js`.
- Load unpacked in Chrome and open a course notebook once after a change; the popup cannot be exercised by the test suite.

## Child DOX Index
- None.
