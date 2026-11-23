# NotebookLM Study App Exporter

A Chrome extension (Manifest V3) that turns the NotebookLM notebook you have open into **one
self-contained study app**: a single HTML file with chapters, cards, a scored quiz when quiz data
exists, a source list, search and offline progress. The same file `scripts/build_study_app.py`
writes for the site, produced from the browser instead of a terminal.

Nothing is uploaded. The page is read locally, the file is built in the popup and saved with a
normal download.

## Install (unpacked)

1. Download and unpack `notebooklm-study-app.zip` (the site's `#/eklenti` page, or
   `site/downloads/notebooklm-study-app.zip`), or use this folder from the repository.
2. Open `chrome://extensions`, turn on **Developer mode**.
3. **Load unpacked** → pick the folder that holds `manifest.json`.
4. Open a notebook at `notebooklm.google.com` (or `notebook.google.com`).

## Use

1. Click the toolbar icon.
2. **Sayfadan topla** reads the open notebook: title, source names and links, notes. The page is a
   web app, so this is best effort; the fields stay editable, fix anything that came out wrong.
3. Optionally load the pipeline's own JSON (`study_plan.json`, `quiz.json`, `chat.json`,
   `flashcards.json` from `data/<slug>/`). With a study plan you get the real chapters; with a quiz
   you get the scored test; with flashcards the deck.
4. **Uygulamayı indir** saves `<slug>.html`. Open it by double-clicking, put it on any static host,
   or send it to a classmate; it needs no server and no network.

## What the app contains

| Tab | Source |
| --- | --- |
| Panel | counts and card progress |
| Kartlar | `flashcards.json`, else `chat.json`, else the quiz's correct options |
| Konular | `study_plan.json` chapters (notes, objectives), else the notes you captured or pasted |
| Test | `quiz.json` / unit quizzes, with instant feedback and a score against the pass mark |
| Kaynaklar | the notebook's source list, linked when a link is known |

Progress lives in the page's `localStorage`, under the file's own key, so it never touches the
site's saved progress.

## Limits

- NotebookLM's markup is Google's and changes. Capture is a convenience, not a contract: if the
  selectors stop matching you get fewer prefilled fields, and the export still works from typed or
  pasted text. There is no remote selector list and no code fetched at runtime.
- Quizzes and flashcards live in the Studio canvases; the extension does not click through them.
  Load the pipeline's JSON for those, or the app simply has no test/cards tab.
- Chrome only (unpacked or a personal Web Store listing); no Firefox build, no account, no quota.

## Files

- `manifest.json` — MV3, `activeTab` + `scripting`, host permissions limited to the two NotebookLM
  origins; no background worker, no always-on content script.
- `popup.html`, `popup.css`, `popup.js` — the form and the download.
- `capture.js` — injected into the tab on demand; returns the notebook's title, sources and notes.
- `core.js` — pure functions (parsing, payload, page rendering); tested by `node` in `tests/`.
- `app-shell.js` — **generated** by `py -3 scripts/export_app_shell.py` from
  `scripts/build_study_app.py`; do not edit it by hand.
