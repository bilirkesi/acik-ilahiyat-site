# okf/

## Purpose
- Open Knowledge Format (OKF) v0.2 Markdown bundle: a portable, human-readable export of the same course content the site serves.
- Lets the material be read, diffed, or reused outside the site.

## Ownership
- **Generated output.** Written by `py -3 scripts/export_okf.py` from `courses.json` and `data/<slug>/`. Do not hand-edit; change the data and re-export.
- `AGENTS.md` — the only hand-maintained file; the export keeps it (`KEEP` in `export_okf.py`) when it wipes and rewrites the bundle.
- `index.md` — bundle index with front matter (`okf_version: "0.2"`, universities, terms, courses).
- `universities/`, `terms/` — one page per source university and per academic term.
- `courses/<slug>.md` — the course page; `courses/index.md` lists all courses.
- `courses/<slug>/chapters/` — one page per study-plan chapter, with AÖF and book-unit infographics and the chapter audio overview when the course has them.
- `courses/<slug>/exams/` — practice exams (vize/final/yaz-kursu) as Markdown.
- `courses/<slug>/unit-quizzes/` — unit quizzes, one page per unit plus an index.
- `courses/<slug>/quiz.md`, `units.md`, `sozluk.md`, `artifacts.md` — final quiz, book unit summaries (from `unit_infographics.json`), letter-workshop glossary (from `sozluk.json`), and artifact catalog.
- `log.md` — export log.
- `artifacts/` — artifact catalog index.

## Local Contracts
- Front matter is YAML-ish key/value lines; keep `okf_version: "0.2"` stable.
- Paths inside the bundle are root-relative Markdown links (`/courses/...`); keep them rooted so the bundle renders from any host.
- Media links use the site root instead: `/assets/<slug>/…` for images and `/audio/<slug>/…` for chapter audio, matching `site/`. The export only links files that exist there.
- Exam content follows the same schema as `data/_exam_schema.md`; solutions appear as `### Çözüm` sections.

## Work Guidance
- Re-export through the OKF pass in the root `AGENTS.md`.
- `assets/` and `artifacts/` are git-ignored. Without them the export links infographics to the published `site/assets/<slug>/*.jpg` and keeps the existing `courses/<slug>/artifacts.md`, so a clean clone still regenerates a complete bundle.
- Commit only files whose content changed; a re-export rewrites every `generated:` timestamp.
- Site-only views (concept decks `#/kavram`, word games `#/oyunlar`) are built in the browser from data the bundle already exports; they have no OKF pages.

## Verification
- `py -3 -m unittest discover -s tests` guards the quiz data the bundle is derived from.

## Child DOX Index
- None. Subdirectories are generated content, not code boundaries.
