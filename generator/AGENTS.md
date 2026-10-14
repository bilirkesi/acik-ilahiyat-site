# generator/

## Purpose
- The `personal-university` opencode skill that rebuilds `site/` from a template plus course data.
- Keeps the site builder self-contained so it can be reused for a different project.

## Ownership
- `scripts/build.py` — the entry point. Copies `site-template/` into `site/`, injects `university.json` branding, bundles every course that has a `data/<slug>/manifest.json` into `site/data.js`, writes `index.html`, `manifest.webmanifest`, and `sw.js`, and compresses chapter infographics.
- `scripts/common.py` — shared project/course helpers.
- `scripts/pipeline.py`, `preflight.py`, `qa.py`, `redo.py`, `sheet.py` — full generation, validation, and contact-sheet tooling.
- `scripts/add_course.py`, `new_project.py` — scaffold a course or a new project.
- `scripts/okunus.py` — builds `data/<slug>/okunus.json` (Arabic-script → Latin reading) for tap-to-pronounce.
- `site-template/` — the SPA source that becomes `site/`: `app.js`, `index.html`, `styles.css`, `interactive.js`, `sw.js`, `manifest.webmanifest`, `favicon.svg`, `fonts/`, `icons/`.
- `README.md`, `INSTALL_PROMPT.md` — upstream skill docs.

## Local Contracts
- Run from the repo root: `py -3 generator/scripts/build.py .` (Python 3.8+ stdlib; Pillow only to compress new PNGs).
- `build.py` reads `university.json`, `courses.json`, and `data/<slug>/`; it does **not** read `okf/` or `coursegraph/index/`.
- `SHELL_FILES` in `build.py` lists the PWA app shell hashed into `sw.js`: `index.html`, `styles.css`, `app.js`, `data.js`, `interactive.js`, `coursegraph.js`, `past_exams.js`, `unit_quizzes.js`, `manifest.webmanifest`, `favicon.svg`. Adding a new lazy bundle means adding it here too.
- Cache busting uses a single `{{V}}` token stamped into `index.html`, `styles.css?v=`, and `sw.js`.
- `build.py` writes a **stub** for a shell bundle that does not exist yet, so a fresh build never 404s.

## Work Guidance
- Change SPA behavior or styling in `site-template/`, then rebuild — do not hand-edit the generated `site/` copy (see `site/AGENTS.md`).
- `site-template/interactive.js` is course data the builder does not overwrite; the other template JS files are pure code.

## Verification
- Rebuild and confirm `site/` regenerates cleanly: `py -3 generator/scripts/build.py .`
- `py -3 -m unittest discover -s tests` guards the site bundle contracts the build depends on.

## Child DOX Index
- None. `site-template/` is the SPA source described under Ownership; its behavior/styling rules live in `site/AGENTS.md`.
