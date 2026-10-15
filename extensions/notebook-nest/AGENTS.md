# extensions/notebook-nest/

## Purpose
- Modified copy of the Notebook-Nest Chrome extension ("NotebookLM Pro Tree") for organizing NotebookLM notebook sources into folders. Editors download it from the site's `#/eklenti` page.

## Ownership
- Vendored from upstream https://github.com/benju66/Notebook-Nest commit `55f44c8` (v17.9), GPL-3.0. Local version `17.9.1`.
- Local changes (keep listed in the README notice): `manifest.json` also matches `https://notebook.google.com/*`; `content.js` re-runs `safeProcessItems` after folder rename and color change; garbled toast/icon strings fixed.

## Local Contracts
- Keep `LICENSE` and the README modification notice; GPL-3.0 requires both when the zip ships.
- `generator/scripts/build.py` zips this folder (minus `AGENTS.md`) into `site/downloads/notebook-nest.zip`; rebuild after any change.
- `content.js` fetches selector overrides at runtime from the upstream author's gist (`REMOTE_CONFIG_URL`).

## Work Guidance
- Keep edits minimal and listed in the README notice so upstream updates can be re-applied.

## Verification
- `node --check content.js`, then load unpacked in Chrome and open a course notebook.

## Child DOX Index
- None.
