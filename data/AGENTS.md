# data/

## Purpose
- Single source of truth for course content. Everything the site shows and every export starts here.
- One directory per course, keyed by the slug used in `courses.json`.

## Ownership
- `data/<slug>/study_plan.json` — chapters with `title`, `summary`, `objectives`, `lectures`, `source_ids`, optional `grounding` and `cites`. The site's chapter pages are built from this.
- The Oracle/IFS training programme (`teknik-gelistirim`, `teknik-gelistirim-tr`) is published from a separate repository (`bilirkesi/acik-akademi`); this folder holds only the four İlahiyat courses. The repositories are independent: no course data is shared.
- A chapter's `source_ids` holds only sources that may ground it. In `turk-dili-1`, `ataturk-ilkeleri-1` and `islam-mezhepleri-tarihi` every chapter also lists the course's `Kitap`: the notes were built from `Kitap.pdf`, so a chapter that assigned only lecture captions claimed a grounding it did not have and `scripts/audit_sources.py` reported it as weak. The technical courses' `grounding.tiers[0].exclude_titles` names the sources that must not ground a chapter: third-party write-ups, personal screenshots, and IFS techdocs pages that NotebookLM indexed as a bot-protection page instead of the document. Those sources stay in the notebook but never reach a chapter, so they can never be cited. `generator/scripts/common.py`'s `excluded_from_grounding()` is the single rule.
- `data/<slug>/quiz.json` — the final "game" quiz.
- `data/<slug>/exams/{vize,final,yaz-kursu}.json` — practice exams; schema in `_exam_schema.md`.
- `data/<slug>/unit_quizzes/unit-N.json` — per-unit quizzes generated from past-exam questions plus the textbook.
- `data/<slug>/past_exams.json` — extracted AÖF past midterm questions; `past_exams_notes.json` adds per-question notes (incl. the unit for `osmanlica-1`, whose questions are mostly images) where present.
- `data/<slug>/manifest.json`, `failed_sources.json`, `study_plan_raw.json` — provenance and generation records.
- `data/<slug>/state.json` — generation state: the notebook's `sources` (`id`, `title`, `type`, `status`, optional `nlm_id` = the NotebookLM source id when `id` is a local key such as `osm1-kitap-1`), their `order`, and artifact ids. `scripts/audit_sources.py` and the generators rank these sources with `grounding.tiers`. A `type: "audio"` source is a lecture video's audio uploaded to the notebook when the video has no captions (`url` = the YouTube watch URL, `id` = the notebook source id); it ranks with captions. A `type: "pdf"` source such as `osmanlica-1`'s `ozturk-corak` is a supplementary non-AÖF reference and stays unranked.
- `data/<slug>/okunus.json` — Arabic-script run → Latin reading; makes `.ota` runs tappable with Turkish TTS. Only `osmanlica-1` has one.
- `data/<slug>/sozluk.json` — glossary keyed like `okunus.json`: `{tr, ornek, okunus, anlam, kaynak?}` (modern Turkish meaning, example sentence in Arabic script, its reading, its meaning). Drives the `#/harfler` word-reading drill and Sözlük tab; only keys that also exist in `okunus.json` are used. `kaynak` (`"Öztürk-Çorak s. N"`, printed page) is set only when `ornek` is quoted from the reference book `ozturk-corak` in `state.json` (Ali Öztürk, Reyhan Çorak, *Osmanlı Türkçesi*, İÜ AUZEF); entries without it have hand-written practice examples. Quote only phrases whose Arabic script is in the PDF text layer (the reading texts' Ottoman script is image-only) and never guess a page.
- `data/<slug>/interactive.json`, `unit_infographics.json` — interactive panel and infographic metadata for the courses that have them.
- `data/<slug>/flashcards.json` — the study app's deck, written by `py -3 generator/scripts/pipeline.py . <slug> flashcards` (one `ask` per chapter, scoped to that chapter's sources): `cards[]` of `{chapter, chapterTitle, front, back}`. It costs no Studio generation. `scripts/build_study_app.py` ships it; without the file the deck falls back to `chat.json`, then to the quiz's correct options.
- `data/<slug>/audio.json` — chapter audio overviews (`chapters[]`: `chapter`, `file`, `duration`, `bytes`, `generated`) written by `scripts/generate_chapter_audio.py`; the MP3s live in `site/audio/<slug>/`.
- `data/<slug>/chat.json` — the question-answer corpus (`items[]`: `chapter`, `chapterTitle`, `q`, `a`, `sources`) written by `scripts/generate_chat.py` from the notebook's own sources; `scripts/export_chat_site.py` turns it into `site/chat.js`, which the `#/soru` page retrieves from. An item's `sources` should include the course's top-tier source; `scripts/check_chat_corpus.py` checks that and warns until the corpus is regenerated under the grounding rule.
- `_exam_schema.md` — the exam JSON field reference; keep it in sync with any schema change.

## Local Contracts
- Every option question uses `questions[].answerOptions[]` with `isCorrect`: **exactly one** correct option for `multiple_choice`, one or more for `multiple_select` (the site grades the whole set). `fill_in_the_blank` carries `bestAnswer` plus optional `acceptableAnswers`, `short_answer` carries `grading.modelAnswer`; neither has options. `generator/scripts/common.py`'s `normalize_quiz_questions()` keeps each type with its payload.
- An option may carry `isPartiallyCorrect: true` (also read as `partiallyCorrect`/`partial`/`status: "partial"`) when it holds a correct element but is not the answer. It stays `isCorrect: false`, so the one-correct-option rule is unchanged; `scripts/build_study_app.py` reports a click on it as `kısmen doğru` and awards no point. The marks in `data/<slug>/quiz.json` and `data/<slug>/unit_quizzes/unit-N.json` are the ones the course's own NotebookLM notebook confirmed against its sources when asked to label each option `dogru`/`kismen`/`yanlis`, and the option's own `rationale` must back the mark: it has to carry a component of the answer itself (one of two asked terms, or the right bâb/structure with the wrong voice), not merely a true fact about a neighbouring sign or a pair whose halves the rationale reverses. Do not add one from the rationale alone. A unit quiz may carry none (the `ataturk-ilkeleri-1` unit quizzes have none confirmed so far).
- The notes, summaries and objectives talk about the subject, not about a student: the reader is never addressed as "öğrenci" / "the student" (write "bu bölümde öğrenilenler", "This chapter covers ..."). Historical uses — "Ebû Hanife'nin öğrencileri", a student in a classroom example — stay as they are. `tests/test_brand.py` guards the rule.
- Question `type` is one of `multiple_choice`, `multiple_select`, `fill_in_the_blank`, `short_answer`, `test`, `true_false` (or omitted). The canonical list is `generator/scripts/quiz_types.py` (`KNOWN`), shared by `scripts/check_quiz_answers.py` and `generator/scripts/qa.py`. The site auto-grades `multiple_choice`, `multiple_select` and `fill_in_the_blank` (`GRADED` in `app.js`); `short_answer` is graded by hand and `test`/`true_false` are legacy names kept for compatibility.
- Option text is compared exactly for duplicate detection, so Ottoman Turkish diacritics (şedde/şerif) that distinguish meaning must be preserved — do not normalize them away.
- Slugs are stable: `islam-mezhepleri-tarihi`, `turk-dili-1`, `ataturk-ilkeleri-1`, `osmanlica-1`. The Oracle/IFS slugs (`teknik-gelistirim`, `teknik-gelistirim-tr`) belong to the other repository.

## Work Guidance
- Add or edit content here, then regenerate downstream artifacts (see `scripts/AGENTS.md` and `coursegraph/AGENTS.md`) rather than editing `site/` or `okf/` by hand.
- Preserve `utf-8-sig` readability: readers use `encoding="utf-8-sig"` to tolerate a BOM.

## Verification
- `py -3 scripts/check_quiz_answers.py` — validates all quiz JSON (one correct option, no duplicate stems/options, `site/unit_quizzes.js` matches data). Exits 0 when clean.
- `py -3 -m unittest discover -s tests` — `tests/test_quiz_data.py` re-checks real-data integrity and site-bundle consistency.

## Child DOX Index
- None. Course directories are data, not code boundaries; their rules live in this doc.
