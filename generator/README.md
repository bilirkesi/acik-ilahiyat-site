# Site generator (Personal University)

This folder is a copy of the `personal-university` opencode skill that builds `site/`.
It used to live only in `NotebookProjects/.opencode/skills/personal-university` on one machine.

Rebuild the site from the repo root:

```bash
python3 generator/scripts/build.py .
```

`build.py` reads `university.json`, `courses.json` and `data/<slug>/`, copies `site-template/`
into `site/`, and writes `site/data.js`, `index.html`, `manifest.webmanifest` and `sw.js`.
Source PNGs in `assets/` are git-ignored; when they are missing, the build reuses the JPGs
already in `site/assets/<slug>/`. Python 3.8+ with the standard library is enough for that;
Pillow is only needed to compress new PNGs.

Offline (PWA): `build.py` also writes `sw.js` with a list of app-shell files and their content hashes,
and appends `window.OFFLINE` (per-course image packs with sizes) to `data.js`. The shell (HTML, CSS, all
JS data bundles, fonts in `fonts/`, icons in `icons/`) is cached on the first
visit; course images are downloaded per course from the `#/cevrimdisi` page. New versions wait until
the student taps "Yenile" on the update toast.

---

# Personal University

Turn NotebookLM notebooks into your own university website.

Each course gets chapters, cited study notes, one infographic per chapter and a quiz.
The site keeps a transcript and gives a Certificate of Completion when every quiz is passed.
Bring your own notebooks, or let the skill find free lecture playlists for you.

## What you need

- A Mac or Linux computer with Python 3.8 or newer.
- Claude Code or Codex.
- A Google account with NotebookLM.
- The NotebookLM CLI (`notebooklm-py`). Install steps are below.
- `yt-dlp`, only if you want the skill to find lectures for you.
- Pillow, optional. It makes contact sheets for checking infographics. (`python3 -m pip install pillow`)

## Install

1. Download this folder (`personal-university`).
2. Put it where your agent reads skills:
   - Claude Code: `~/.claude/skills/personal-university`
   - Codex: `~/.codex/skills/personal-university` (or keep it anywhere and point Codex at `SKILL.md`)
3. Install the NotebookLM CLI and log in. You run the login yourself. It opens a browser.
   ```bash
   uv tool install "notebooklm-py[browser]"      # or: pipx install "notebooklm-py[browser]"
   notebooklm skill install                      # optional
   notebooklm login
   ```
4. Optional, for finding lectures: `brew install yt-dlp` (or `pipx install yt-dlp`).
5. Open Claude Code or Codex and paste the prompt from `INSTALL_PROMPT.md`.

## Use it

Start with "Use Personal University." Then say what you want. Examples:

- "Use Personal University. Here are my 4 NotebookLM links. Turn them into a university called Atlas with one quiz per course and a certificate at 80%."
- "Use Personal University. Build me a free first year of computer science from MIT and Stanford lectures on YouTube. 6 courses, 3 chapters each."
- "Use Personal University. My team joins next month. Turn these 3 NotebookLM notebooks of our internal docs into an onboarding university with a quiz per notebook."
- "Use Personal University. Build a summer school for my 12-year-old from Khan Academy and Crash Course playlists. Math, biology and world history. Keep the quizzes easy."
- "Use Personal University. I am preparing for the CFA Level 1. Find a free lecture series for each topic, build one notebook per topic, and give me a quiz for every topic."

The agent asks about 5 questions, checks every playlist, shows you a course table, and waits for your OK.
Then it builds the notebooks, the quizzes and the infographics. It checks every infographic and redoes the bad ones.
At the end it opens the site on your computer.

## How long and how much

NotebookLM has a rolling usage limit. Each course uses 1 quiz plus 1 infographic per chapter.
Five courses with 4 chapters each is 25 generations. The agent tells you the count before it starts.
If NotebookLM says stop, the run saves its place. Run it again later and it continues.

## Scripts (if you want to run them by hand)

| Script | What it does |
|---|---|
| `scripts/preflight.py` | Checks the CLI, your login, yt-dlp and Pillow |
| `scripts/new_project.py` | Creates the project folder and `university.json` |
| `scripts/add_course.py` | Adds a course from a notebook link or a playlist. `--check URL` verifies a playlist |
| `scripts/pipeline.py` | Builds one course or all: create, sources, plan, ground, quiz, infographics, manifest |
| `scripts/sheet.py` | Contact sheet of a course's infographics for a visual check |
| `scripts/redo.py` | Regenerates chosen chapter infographics. Old files move to `rejected/` |
| `scripts/build.py` | Builds the static site in `PROJECT/site/` |
| `scripts/qa.py` | Checks the built site before you share it |

Preview the site: `cd my-university/site && python3 -m http.server 8000`, then open http://localhost:8000.

## Share it

The `site/` folder is plain HTML. Upload it to any static host (Netlify Drop, GitHub Pages, Cloudflare Pages)
or publish it as a Claude artifact. Your notebooks stay private unless you share them in NotebookLM.

## Good to know

- The skill never deletes a notebook and never makes one public without asking you.
- With your own notebooks, it only reads the source list. It adds and removes nothing.
- Progress and certificates live in each visitor's browser. There is no server and no login.
- The site says it is not affiliated with any university. Keep that line.
- Lectures belong to their schools and professors. The site links back to them.
