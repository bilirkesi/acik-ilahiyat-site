# okf/

## Purpose
- Open Knowledge Format (OKF) v0.2 Markdown bundle: a portable, human-readable export of the same course content the site serves.
- Lets the material be read, diffed, or reused outside the site.

## Ownership
- **Generated output.** Written by `py -3 scripts/export_okf.py` from `courses.json` and `data/<slug>/`. Do not hand-edit; change the data and re-export.
- `index.md` — bundle index with front matter (`okf_version: "0.2"`, universities, terms, courses).
- `universities/`, `terms/` — one page per source university and per academic term.
- `courses/<slug>.md` — the course page; `courses/index.md` lists all courses.
- `courses/<slug>/chapters/` — one page per study-plan chapter.
- `courses/<slug>/exams/` — practice exams (vize/final/yaz-kursu) as Markdown.
- `courses/<slug>/unit-quizzes/` — unit quizzes, one page per unit plus an index.
- `courses/<slug>/quiz.md`, `units.md`, `artifacts.md` — final quiz, unit index, and artifact catalog.
- `log.md` — export log.
- `artifacts/` — artifact catalog index.

## Local Contracts
- Front matter is YAML-ish key/value lines; keep `okf_version: "0.2"` stable.
- Paths inside the bundle are root-relative Markdown links (`/courses/...`); keep them rooted so the bundle renders from any host.
- Exam content follows the same schema as `data/_exam_schema.md`; solutions appear as `### Çözüm` sections.

## Work Guidance
- Re-export after any change to `data/` or `courses.json`: `py -3 scripts/export_okf.py`.
- The export preserves existing infographic/artifact references when `assets/` and `artifacts/` are absent (they are git-ignored), so a clean clone still regenerates a complete bundle.

## Verification
- `py -3 -m unittest discover -s tests` guards the quiz data the bundle is derived from.

## Child DOX Index
- None. Subdirectories are generated content, not code boundaries.
