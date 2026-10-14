---
name: personal-university
description: Personal University turns NotebookLM notebooks (your own, or new ones built from free lecture playlists) into a static course website with chapters, cited study notes, one infographic per chapter, one auto-graded quiz per course, a transcript and a Certificate of Completion. Use when the user says "use Personal University", "personal university", "build my university", "turn my notebooks into a course site", "make a course site from NotebookLM", "onboarding university", "summer school from YouTube playlists", or wants free university lectures turned into quizzes and a certificate.
---

# Personal University

You build a small static university site from NotebookLM. One course = one NotebookLM notebook.
Every course gets 3 to 5 chapters, cited study notes per chapter, one infographic per chapter,
one quiz, and the site adds a transcript and a Certificate of Completion.

All scripts live next to this file in `scripts/`. Call them with `python3 <skill>/scripts/<name>.py`.
`<skill>` is the folder that holds this SKILL.md. `PROJECT` is the user's project folder
(default `./my-university` in the current directory, or a path the user gives).

## Hard rules

- Never print, copy, read aloud or upload NotebookLM auth files (`~/.notebooklm/...`, `storage_state.json`).
- Never delete a notebook. Never remove sources from a notebook the user brought.
- Never make a notebook public or share it (`notebooklm share ...`) without the user's explicit yes in chat.
- Always pass explicit notebook IDs (`-n`). Never run `notebooklm use`.
- The scripts close stdin on every CLI call. If you run `notebooklm ask` by hand, add `</dev/null` or it dies with EndOfStream.
- Only one pipeline runner per project. The scripts hold a lock file. Never start a second runner in parallel, never loop courses in parallel shells.
- Site copy: never write "MBA", "degree" or "accredited". No em dashes. Keep the disclaimer footer. The award is a "Certificate of Completion".
- Generations (quiz, infographic) spend the user's NotebookLM AI usage. Run them one at a time. Tell the user how many you are about to run before you start.

## Step 1. Preflight

```bash
python3 <skill>/scripts/preflight.py            # add --lectures for find-lectures mode (needs yt-dlp)
```

If `notebooklm` is missing, give the user these steps and stop until they confirm:

```
uv tool install "notebooklm-py[browser]"     # or: pipx install "notebooklm-py[browser]"
notebooklm skill install                     # optional
notebooklm login                             # the USER runs this; it opens a browser
```

If the auth check fails, ask the user to run `notebooklm login` themselves. Do not try to log in for them.

## Step 2. Interview (one message, about 5 questions)

Ask everything in ONE batch. Fill sensible defaults for anything the user's request already answers.

1. What program or subject should the university cover? Who is the learner? (adult, a 12-year-old, new hires)
2. How many courses, and how many chapters per course? (default 3 to 5 chapters)
3. Do you bring your own NotebookLM notebook links, or should I find free lecture series for you
   (YouTube playlists from top universities, Khan Academy, Crash Course, MIT OpenCourseWare and similar)?
4. What is the university called? (also: who issues the certificate, optional tagline)
5. Quiz difficulty (easy, medium, hard) and pass mark? (default medium, 70%)

Then create the project:

```bash
python3 <skill>/scripts/new_project.py PROJECT --name "NAME" --issuer "ISSUER" --tagline "TAGLINE" \
  --pass 70 --difficulty medium --quantity standard --chapters 3-5 --audience "curious adult learners"
```

`university.json` also holds `colors` (primary, accent, paper: the crest and site palette), `codePrefix`
(course codes like "AU 101"), `figureStyle` (the locked infographic palette), `showNotebookLinks`
(set false if visitors cannot open the notebooks) and `plannedCourses` (shows "coming soon" cards).
Edit the JSON directly if the user asks for any of these.

## Step 3. Sources (two modes)

### Mode A: own notebook links

For each link or ID, register it. This only reads the notebook. It adds and removes nothing.

```bash
python3 <skill>/scripts/add_course.py PROJECT SLUG --notebook "https://notebooklm.google.com/notebook/<id>" \
  --subject "Short subject" --course "Course title"
```

Sources can be docs, PDFs, web pages, pasted text or YouTube. The site shows each source title and
links it only when it has a URL. Course pages say "sources" instead of "lectures" in this mode.
Remind the user: their notebooks stay private, so site visitors cannot open "Open in NotebookLM"
unless the user shares the notebook. Offer `"showNotebookLinks": false` for a public site.

### Mode B: find free lectures

1. Propose a course table to the user: subject, course, professor, school, lecture count, playlist link.
   Prefer complete official playlists (MIT OpenCourseWare, Stanford Online, Yale Courses, Khan Academy,
   CrashCourse, university channels). Keep each course at 50 videos or fewer (NotebookLM's free source cap).
2. Verify EVERY playlist before showing the final table:
   ```bash
   python3 <skill>/scripts/add_course.py --check "PLAYLIST_URL"     # uses yt-dlp --flat-playlist
   ```
   Drop or replace anything that fails. Put the real video counts in the table.
3. Wait for the user's OK on the table. Then register each course:
   ```bash
   python3 <skill>/scripts/add_course.py PROJECT SLUG --playlist URL [--playlist URL2] \
     --subject "Biology" --course "Crash Course Biology" --professor "Hank Green" --school "CrashCourse" [--max 30]
   ```
   Several `--playlist` flags merge into one course. `--url` adds a web page or PDF link as a source.

## Step 4. Run the pipeline, per course

Stages: `create` (lectures mode only), `sources`, `plan`, `ground`, `quiz`, `infographics`, `manifest`.

```bash
python3 <skill>/scripts/pipeline.py PROJECT SLUG create      # Mode B only. Mode A skips it.
python3 <skill>/scripts/pipeline.py PROJECT SLUG sources     # A: reads the source list. B: adds videos, waits
python3 <skill>/scripts/pipeline.py PROJECT SLUG plan        # chapters via ask (JSON, no citations)
python3 <skill>/scripts/pipeline.py PROJECT SLUG ground      # one cited ask per chapter, -s limited to its sources
python3 <skill>/scripts/pipeline.py PROJECT SLUG quiz        # 1 generation
python3 <skill>/scripts/pipeline.py PROJECT SLUG infographics   # 1 generation per chapter
python3 <skill>/scripts/pipeline.py PROJECT SLUG manifest
```

Or `pipeline.py PROJECT all all` to run every stage for every course in order (one at a time).
Run long jobs in the background and check the log in `PROJECT/logs/<slug>.log`.

- After `sources`, read `data/<slug>/failed_sources.json`. Videos without captions often fail. Tell the user.
- After `plan`, read the logged `validation`. Unassigned or unmatched sources or an empty chapter: rerun `plan`
  (delete nothing, it overwrites `study_plan.json`) or edit `study_plan.json` by hand.
- Pure-JSON asks return 0 citations. That is why `ground` exists. Do not skip it.
- Every stage resumes from `data/<slug>/state.json`. Rerunning is always safe.

**Usage limit.** NotebookLM has a rolling AI usage limit. Before generating, count the work:
courses x (1 quiz + chapters). Tell the user the number. The pipeline retries a failed generation with
`--retry`, backs off 7 minutes, and stops with exit code 3 when it looks rate limited. When that
happens, tell the user and stop. Do not loop. The same command resumes later.
`PROJECT/logs/generations.jsonl` records every generation.

## Step 5. QA (mandatory)

1. For every course, build a contact sheet and LOOK at every infographic yourself:
   ```bash
   python3 <skill>/scripts/sheet.py PROJECT SLUG          # writes PROJECT/logs/sheet-SLUG.jpg
   ```
   Open the image. Zoom into each panel (or open each `assets/SLUG/chapter-N.png`). Reject any with a
   spelling mistake, a heading shown twice, cut-off text, the wrong palette (dark when the rest are light),
   or school logos. About 1 in 5 has a problem.
2. Regenerate only the bad ones. The old PNG moves to `assets/SLUG/rejected/`, nothing is deleted:
   ```bash
   python3 <skill>/scripts/redo.py PROJECT SLUG 2 4
   ```
   Look again after the redo.
3. Build and check the site:
   ```bash
   python3 <skill>/scripts/build.py PROJECT
   python3 <skill>/scripts/qa.py PROJECT
   ```
   `qa.py` fails on em dashes, banned words in the site chrome, missing images, courses without a quiz,
   and a name or pass mark that did not apply. It warns about banned words inside course data
   (for example "45 degrees" in a geometry quiz is fine). Read every warning.

## Step 6. Open and share

```bash
cd PROJECT/site && python3 -m http.server 8000      # then open http://localhost:8000
```

Open it in a browser and click through: catalog, one syllabus, one chapter, one quiz, transcript, certificate.
Tell the user how to share: upload the `site/` folder to any static host (Netlify Drop, GitHub Pages,
Cloudflare Pages, Vercel) or publish it as a Claude artifact. Ask before you publish anywhere.
The site has `noindex` by default. Progress lives in each visitor's browser.

## Request patterns

- "Here are my 4 NotebookLM links. University called X, one quiz per course, certificate at 80%":
  Mode A, 4 courses, `--name X --pass 80`. Skip interview questions already answered.
- "Free first year of computer science from MIT and Stanford on YouTube. 6 courses, 3 chapters each":
  Mode B, `--chapters 3`, 6 verified playlists from MIT OCW and Stanford channels, table first.
- "My team joins next month. Turn these 3 notebooks of internal docs into an onboarding university":
  Mode A, 3 courses, `--audience "new team members"`, suggest `"showNotebookLinks": false` unless the team
  already shares those notebooks. Sources are docs, so the site shows titles without links.
- "Summer school for my 12-year-old from Khan Academy and Crash Course. Math, biology, world history. Easy quizzes":
  Mode B, 3 courses, `--difficulty easy --audience "a 12-year-old" --quantity fewer`. Merge a Khan Academy and a
  Crash Course playlist per subject when it helps (repeat `--playlist`).
- "CFA Level 1. Free lecture series per topic, one notebook per topic, a quiz for every topic":
  Mode B, one course per topic (Ethics, Quantitative Methods, Economics, Financial Statement Analysis,
  Corporate Issuers, Equity, Fixed Income, Derivatives, Alternative Investments, Portfolio Management),
  `--difficulty hard`. Tell the user free playlists are third-party prep, not official CFA Institute material,
  and that this is about 10 quizzes plus 30 to 50 infographics, so it may take several sessions of usage.

## Files in a project

```
PROJECT/university.json   site name, tagline, issuer, pass mark, prefix, colors, chapters, quiz settings
PROJECT/courses.json      one entry per course (mode own or lectures)
PROJECT/data/<slug>/      state.json, study_plan.json, quiz.json, manifest.json, failed_sources.json
PROJECT/assets/<slug>/    chapter-N.png originals (rejected/ keeps redone ones)
PROJECT/logs/             per-course logs, generations.jsonl, contact sheets
PROJECT/site/             the built static site (rebuilt by build.py, do not hand-edit)
```

Other gotchas: `notebooklm source fulltext` truncates at 2000 characters unless you pass `-o FILE`.
Infographic PNGs are about 5 MB; `build.py` compresses them to JPG (sips, else Pillow, else keeps PNG).
Quiz text contains LaTeX (`$...$`, `\(...\)`); the site renders it with KaTeX as MathML.
