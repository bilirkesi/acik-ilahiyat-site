# data/

## Purpose
- Single source of truth for course content. Everything the site shows and every export starts here.
- One directory per course, keyed by the slug used in `courses.json`.

## Ownership
- `data/<slug>/study_plan.json` — chapters with `title`, `summary`, `objectives`, `lectures`, `source_ids`, optional `grounding` and `cites`. The site's chapter pages are built from this.
- `data/teknik-gelistirim/` — the IFS Cloud and Oracle DBA training program, not a university course. Its material is in English, its units are its chapters (the unit titles live in `coursegraph/past_exams.py` and must equal the chapter titles here), it has no past exams, and its `state.json` records the 94 sources of an existing NotebookLM notebook in `mode: own`. The pipeline reads that notebook and adds official Oracle documents to it when a topic has no official coverage; it never edits or removes a source there.
- `data/teknik-gelistirim-tr/` — the Turkish version of the same program. It reads the **same** NotebookLM notebook but keeps its own `state.json`, plan, notes, quizzes and exams; its `courses.json` entry carries `config.language: "Turkish"` and Turkish grounding rules, so the notes, questions and exam titles come out in Turkish. Its chapter titles live in `coursegraph/past_exams.py` as `TEK_TR_UNIT_TITLES`.
- A chapter's `source_ids` holds only sources that may ground it. The technical courses' `grounding.tiers[0].exclude_titles` names the sources that must not ground a chapter: third-party write-ups, personal screenshots, and IFS techdocs pages that NotebookLM indexed as a bot-protection page instead of the document. Those sources stay in the notebook but never reach a chapter, so they can never be cited. `generator/scripts/common.py`'s `excluded_from_grounding()` is the single rule.
- `data/<slug>/quiz.json` — the final "game" quiz.
- `data/<slug>/exams/{vize,final,yaz-kursu}.json` — practice exams; schema in `_exam_schema.md`.
- `data/<slug>/unit_quizzes/unit-N.json` — per-unit quizzes generated from past-exam questions plus the textbook.
- `data/<slug>/past_exams.json` — extracted AÖF past midterm questions; `past_exams_notes.json` adds per-question notes (incl. the unit for `osmanlica-1`, whose questions are mostly images) where present.
- `data/<slug>/manifest.json`, `failed_sources.json`, `study_plan_raw.json` — provenance and generation records.
- `data/<slug>/state.json` — generation state: the notebook's `sources` (`id`, `title`, `type`, `status`, optional `nlm_id` = the NotebookLM source id when `id` is a local key such as `osm1-kitap-1`), their `order`, and artifact ids. `scripts/audit_sources.py` and the generators rank these sources with `grounding.tiers`. A `type: "audio"` source is a lecture video's audio uploaded to the notebook when the video has no captions (`url` = the YouTube watch URL, `id` = the notebook source id); it ranks with captions. A `type: "pdf"` source such as `osmanlica-1`'s `ozturk-corak` is a supplementary non-AÖF reference and stays unranked.
- `data/<slug>/okunus.json` — Arabic-script run → Latin reading; makes `.ota` runs tappable with Turkish TTS. Only `osmanlica-1` has one.
- `data/<slug>/sozluk.json` — glossary keyed like `okunus.json`: `{tr, ornek, okunus, anlam, kaynak?}` (modern Turkish meaning, example sentence in Arabic script, its reading, its meaning). Drives the `#/harfler` word-reading drill and Sözlük tab; only keys that also exist in `okunus.json` are used. `kaynak` (`"Öztürk-Çorak s. N"`, printed page) is set only when `ornek` is quoted from the reference book `ozturk-corak` in `state.json` (Ali Öztürk, Reyhan Çorak, *Osmanlı Türkçesi*, İÜ AUZEF); entries without it have hand-written practice examples. Quote only phrases whose Arabic script is in the PDF text layer (the reading texts' Ottoman script is image-only) and never guess a page.
- `data/<slug>/interactive.json`, `unit_infographics.json` — interactive panel and infographic metadata for the courses that have them.
- `data/<slug>/audio.json` — chapter audio overviews (`chapters[]`: `chapter`, `file`, `duration`, `bytes`, `generated`) written by `scripts/generate_chapter_audio.py`; the MP3s live in `site/audio/<slug>/`.
- `data/<slug>/chat.json` — the question-answer corpus (`items[]`: `chapter`, `chapterTitle`, `q`, `a`, `sources`) written by `scripts/generate_chat.py` from the notebook's own sources; `scripts/export_chat_site.py` turns it into `site/chat.js`, which the `#/soru` page retrieves from.
- `_exam_schema.md` — the exam JSON field reference; keep it in sync with any schema change.

## Local Contracts
- Every quiz-style file uses `questions[].answerOptions[]` with `isCorrect`; a question must have **exactly one** correct option.
- Question `type` is one of `multiple_choice`, `multiple_select`, `fill_in_the_blank`, `short_answer`, `test`, `true_false` (or omitted). The canonical list is `generator/scripts/quiz_types.py` (`KNOWN`), shared by `scripts/check_quiz_answers.py` and `generator/scripts/qa.py`. The site auto-grades `multiple_choice`, `multiple_select` and `fill_in_the_blank` (`GRADED` in `app.js`); `short_answer` is graded by hand and `test`/`true_false` are legacy names kept for compatibility.
- Option text is compared exactly for duplicate detection, so Ottoman Turkish diacritics (şedde/şerif) that distinguish meaning must be preserved — do not normalize them away.
- Slugs are stable: `islam-mezhepleri-tarihi`, `turk-dili-1`, `ataturk-ilkeleri-1`, `osmanlica-1`, `teknik-gelistirim`, `teknik-gelistirim-tr`.

## Work Guidance
- Add or edit content here, then regenerate downstream artifacts (see `scripts/AGENTS.md` and `coursegraph/AGENTS.md`) rather than editing `site/` or `okf/` by hand.
- Preserve `utf-8-sig` readability: readers use `encoding="utf-8-sig"` to tolerate a BOM.

## Verification
- `py -3 scripts/check_quiz_answers.py` — validates all quiz JSON (one correct option, no duplicate stems/options, `site/unit_quizzes.js` matches data). Exits 0 when clean.
- `py -3 -m unittest discover -s tests` — `tests/test_quiz_data.py` re-checks real-data integrity and site-bundle consistency.

## Child DOX Index
- None. Course directories are data, not code boundaries; their rules live in this doc.
