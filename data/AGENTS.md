# data/

## Purpose
- Single source of truth for course content. Everything the site shows and every export starts here.
- One directory per course, keyed by the slug used in `courses.json`.

## Ownership
- `data/<slug>/study_plan.json` — chapters with `title`, `summary`, `objectives`, `lectures`, `source_ids`, optional `grounding` and `cites`. The site's chapter pages are built from this.
- `data/<slug>/quiz.json` — the final "game" quiz.
- `data/<slug>/exams/{vize,final,yaz-kursu}.json` — practice exams; schema in `_exam_schema.md`.
- `data/<slug>/unit_quizzes/unit-N.json` — per-unit quizzes generated from past-exam questions plus the textbook.
- `data/<slug>/past_exams.json` — extracted AÖF past midterm questions; `past_exams_notes.json` adds per-question notes where present.
- `data/<slug>/manifest.json`, `failed_sources.json`, `study_plan_raw.json` — provenance and generation records.
- `data/<slug>/state.json` — generation state: the notebook's `sources` (`id`, `title`, `type`, `status`, optional `nlm_id` = the NotebookLM source id when `id` is a local key such as `osm1-kitap-1`), their `order`, and artifact ids. `scripts/audit_sources.py` and the generators rank these sources with `grounding.tiers`. A `type: "audio"` source is a lecture video's audio uploaded to the notebook when the video has no captions (`url` = the YouTube watch URL, `id` = the notebook source id); it ranks with captions.
- `data/<slug>/okunus.json` — Arabic-script run → Latin reading; makes `.ota` runs tappable with Turkish TTS. Only `osmanlica-1` has one.
- `data/<slug>/interactive.json`, `unit_infographics.json` — interactive panel and infographic metadata for the courses that have them.
- `data/<slug>/audio.json` — chapter audio overviews (`chapters[]`: `chapter`, `file`, `duration`, `bytes`, `generated`) written by `scripts/generate_chapter_audio.py`; the MP3s live in `site/audio/<slug>/`.
- `_exam_schema.md` — the exam JSON field reference; keep it in sync with any schema change.

## Local Contracts
- Every quiz-style file uses `questions[].answerOptions[]` with `isCorrect`; a question must have **exactly one** correct option.
- Question `type` is one of `test`, `multiple_choice`, `true_false` (or omitted).
- Option text is compared exactly for duplicate detection, so Ottoman Turkish diacritics (şedde/şerif) that distinguish meaning must be preserved — do not normalize them away.
- Slugs are stable: `islam-mezhepleri-tarihi`, `turk-dili-1`, `ataturk-ilkeleri-1`, `osmanlica-1`.

## Work Guidance
- Add or edit content here, then regenerate downstream artifacts (see `scripts/AGENTS.md` and `coursegraph/AGENTS.md`) rather than editing `site/` or `okf/` by hand.
- Preserve `utf-8-sig` readability: readers use `encoding="utf-8-sig"` to tolerate a BOM.

## Verification
- `py -3 scripts/check_quiz_answers.py` — validates all quiz JSON (one correct option, no duplicate stems/options, `site/unit_quizzes.js` matches data). Exits 0 when clean.
- `py -3 -m unittest discover -s tests` — `tests/test_quiz_data.py` re-checks real-data integrity and site-bundle consistency.

## Child DOX Index
- None. Course directories are data, not code boundaries; their rules live in this doc.
