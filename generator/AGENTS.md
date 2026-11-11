# generator/

## Purpose
- The `personal-university` opencode skill that rebuilds `site/` from a template plus course data.
- Keeps the site builder self-contained so it can be reused for a different project.

## Ownership
- `scripts/build.py` — the entry point. Copies `site-template/` into `site/`, injects `university.json` branding, bundles every course that has a `data/<slug>/manifest.json` into `site/data.js`, writes `index.html`, `manifest.webmanifest`, and `sw.js`, compresses chapter infographics, and zips each `extensions/<name>/` into `site/downloads/<name>.zip`.
- `scripts/common.py` — shared project/course helpers, incl. the grounding helpers `source_tier`, `excluded_from_grounding`, `with_authority`, `grounding_rules` that read `university.json` → `grounding`, the `Lock` that keeps a single pipeline runner per project, and `find_cli`/`require_cli` that locate the `notebooklm` CLI without hardcoded machine paths.
- `scripts/quiz_types.py` — the canonical list of quiz question types (`GRADED`, `KNOWN`); `qa.py` and `scripts/check_quiz_answers.py` both import it, and a test asserts it matches the site's `GRADED` set in `app.js`.
- `scripts/pipeline.py`, `preflight.py`, `qa.py`, `redo.py`, `sheet.py` — full generation, validation, and contact-sheet tooling.
- `scripts/add_course.py`, `new_project.py` — scaffold a course or a new project. `add_course.py --offline`
  writes `data/<slug>/{state,study_plan,manifest}.json` so `build.py` lists a hand-written course before
  any NotebookLM run.
- `chapter_audio()` in `build.py` reads `data/<slug>/audio.json` and adds `course.audio` for MP3s that exist under `site/audio/<slug>/`; `offline_packs()` exposes them as the separate `<slug>-ses` pack.
- `scripts/okunus.py` — builds `data/<slug>/okunus.json` (Arabic-script → Latin reading) for tap-to-pronounce.
- `site-template/` — the SPA source that becomes `site/`: `app.js`, `index.html`, `styles.css`, `interactive.js`, `sw.js`, `manifest.webmanifest`, `favicon.svg`, `fonts/`, `icons/`.
- `README.md`, `INSTALL_PROMPT.md` — upstream skill docs.

## Local Contracts
- Run from the repo root: `py -3 generator/scripts/build.py .` (Python 3.8+ stdlib; Pillow only to compress new PNGs).
- `add_course.py --offline` writes the data files only when they are missing, so it can be re-run after the
  chapters are written. Such a course is `mode: "manual"` with `notebook_url: ""`; `build.py` treats it as a
  `sources` course and the site hides the NotebookLM buttons for it.
- `grounding` in `university.json` ranks source kinds (`tiers`: `label`, `note`, `types`, `titles`, `exclude_titles`; first = textbook) and adds prompt `rules`. The `pipeline.py` ground, quiz and infographic stages append `grounding_rules()` to their prompts and add the textbook to a chapter that has none. It is build-time only and stays out of `public_config`.
- A tier's `exclude_titles` marks sources that share its type without sharing its authority (third-party write-ups, personal screenshots, uploads of other people's slides). `excluded_from_grounding()` drops them from the source list: ranking them below every tier is not enough, because they would still be handed to NotebookLM with `-s` and end up cited in the notes. The `plan` stage does not offer them to the model either, so they never reach a chapter's source list.
- `public_config` in `build.py` whitelists the `university.json` keys that reach `window.UNIVERSITY` (incl. `exams`, `grading`); a new config key must be added there.
- `build.py` reads `university.json`, `courses.json`, and `data/<slug>/`; it does **not** read `okf/` or `coursegraph/index/`.
- `SHELL_FILES` in `build.py` lists the PWA app shell hashed into `sw.js`: `index.html`, `styles.css`, `app.js`, `data.js`, `interactive.js`, `coursegraph.js`, `past_exams.js`, `unit_quizzes.js`, `manifest.webmanifest`, `favicon.svg`. Adding a new lazy bundle means adding it here too.
- Cache busting uses a single `{{V}}` token stamped into `index.html`, `styles.css?v=`, and `sw.js`.
- `build.py` writes a **stub** for a shell bundle that does not exist yet, so a fresh build never 404s.
- `pipeline.py` keeps the plan ask under `MAX_PLAN_PROMPT` characters: NotebookLM's chat rejects a prompt that is too long (around 6000 characters for a multi-line prompt), so the source listing is shortened when a course has many sources. The model answers with the source numbers, so the titles only have to stay recognisable.
- The plan answer is JSON the model writes by hand, and it sometimes escapes characters JSON does not allow (`"CDB\$ROOT"`). `fix_json_escapes()` in `pipeline.py` drops those escapes before parsing; the valid ones (`\\`, `\"`, `\n`, `\uXXXX`) are kept, and a leftover `\$` in the text is repaired by `clean()` in `build.py`.
- `pipeline.py ground --chapters 5,6 --force` re-asks the listed chapters even when they already have notes; `--chapters` alone limits the stage, `--force` overwrites.
- `build.py`'s `clean()` prepares NotebookLM text for the site: it drops citation markers (numbered `[1]`, `[2-4]`, `[1, 3]` and by-title `[Recovering Tables and Table Partitions]`), restores a product identifier whose `$` NotebookLM wrote as a LaTeX escape (`V\\(CLUSTER_INTERCONNECTS` → `V$CLUSTER_INTERCONNECTS`), and keeps markdown links, the reference list and real LaTeX. It runs on `notes`, `summary` and `objectives` — every field the site renders.
- `build.py` writes each course's `language` ("tr"/"en") into `data.js`, taken from `courses.json` → `config.language` (`language_code()` in `common.py`). The site reads it for the read-aloud voice (`voiceFor()` in `app.js` picks the voice of that language; the Ottoman Turkish word reading stays Turkish) and for the `lang` attribute on the notes, so a screen reader reads English notes in English.- `common.Lock` creates `.pipeline.lock` with `O_CREAT|O_EXCL` (atomic everywhere) and clears a leftover file only after checking the recorded pid with `_pid_alive`. `_pid_alive` uses `os.kill(pid, 0)` on POSIX and `OpenProcess`/`GetExitCodeProcess` on Windows, where `os.kill(pid, 0)` is a `CTRL_C_EVENT` and raises `WinError 87` for a dead pid.

## Work Guidance
- Change SPA behavior or styling in `site-template/`, then rebuild — do not hand-edit the generated `site/` copy (see `site/AGENTS.md`).
- `site-template/interactive.js` is course data the builder does not overwrite; the other template JS files are pure code.

## Verification
- Rebuild and confirm `site/` regenerates cleanly: `py -3 generator/scripts/build.py .`
- `py -3 -m unittest discover -s tests` guards the site bundle contracts the build depends on.

## Child DOX Index
- None. `site-template/` is the SPA source described under Ownership; its behavior/styling rules live in `site/AGENTS.md`.
