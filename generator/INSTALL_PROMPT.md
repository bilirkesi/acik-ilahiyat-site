# Install prompt

Download the `personal-university` folder. Open Claude Code or Codex in the folder where you want your
university to live. Paste this prompt. Replace the path if you saved the folder somewhere else.

```
Install the Personal University skill from ~/Downloads/personal-university.

1. Copy the folder to ~/.claude/skills/personal-university (Claude Code) or ~/.codex/skills/personal-university (Codex). Do not change any file inside it.
2. Read its SKILL.md fully.
3. Run scripts/preflight.py --lectures from the skill folder and show me the result.
4. If the notebooklm CLI is missing, install it with uv tool install "notebooklm-py[browser]" (or pipx if uv is missing). Then stop and tell me to run notebooklm login myself. Never open or print my NotebookLM auth files.
5. If yt-dlp is missing, tell me the install command. Do not install anything else without asking.
6. When preflight passes, say "Personal University is ready" and show me the 5 example requests from README.md.
```

After that, start any request with "Use Personal University." For example:

```
Use Personal University. Build a summer school for my 12-year-old from Khan Academy and Crash Course playlists. Math, biology and world history. Keep the quizzes easy.
```
