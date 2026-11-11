"""Shared helpers for Personal University scripts. Standard library only."""
import contextlib
import json, os, re, shutil, subprocess, sys, time
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "site-template"
UUID_RE = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.I)

INSTALL_HELP = """The NotebookLM CLI (notebooklm-py) is not installed or not on PATH.
Install it with ONE of these:
  uv tool install "notebooklm-py[browser]"
  pipx install "notebooklm-py[browser]"
Then:
  notebooklm skill install      # optional, teaches your agent the CLI
  notebooklm login              # YOU run this. It opens a browser to sign in to Google.
Then run the preflight again."""

DEFAULT_FIGURE_STYLE = ("light ivory background, deep navy text and shapes, muted gold accents only, "
                        "flat vector icons, two-column layout")

DEFAULT_UNIVERSITY = {
    "name": "My Personal University",
    "tagline": "Free courses. One study desk.",
    "issuer": "Personal University",
    "issuerUrl": "",
    "passMark": 0.7,
    "codePrefix": "PU",
    "audience": "curious adult learners",
    "chapters": {"min": 3, "max": 5},
    "quiz": {"difficulty": "medium", "quantity": "standard"},
    "colors": {"primary": "#1b2a4a", "accent": "#b08d4a", "paper": "#f8f4ea"},
    "figureStyle": DEFAULT_FIGURE_STYLE,
    "showNotebookLinks": True,
    "plannedCourses": 0,
    "grounding": {"tiers": [], "rules": []},
}


def find_cli():
    """Locate the notebooklm binary.

    PATH first, then the folder of the running interpreter (pip installs console scripts
    there), then the usual uv/pipx install folders. Machine-specific absolute paths are
    never hardcoded, so the repo works on every machine that has the CLI installed.
    """
    hit = shutil.which("notebooklm")
    if hit:
        return hit
    base = Path(sys.executable).resolve().parent
    for p in (base / "notebooklm.exe", base / "notebooklm",
              base / "Scripts" / "notebooklm.exe", base / "Scripts" / "notebooklm"):
        if p.exists():
            return str(p)
    for p in (Path.home() / ".local/bin/notebooklm", Path.home() / ".cargo/bin/notebooklm"):
        if p.exists():
            return str(p)
    return None


def require_cli():
    cli = find_cli()
    if not cli:
        print(INSTALL_HELP, file=sys.stderr)
        sys.exit(2)
    return cli


def notebook_id(value):
    """Accept a bare ID or a full https://notebooklm.google.com/notebook/<id> URL."""
    m = UUID_RE.search(str(value or ""))
    return m.group(0).lower() if m else None


class Project:
    """A university project folder: university.json, courses.json, data/, assets/, logs/, site/."""

    def __init__(self, path):
        self.root = Path(path).expanduser().resolve()
        if not (self.root / "university.json").exists():
            sys.exit(f"Not a Personal University project: {self.root} (no university.json). Run new_project.py first.")
        self.uni = load_university(self.root)
        cpath = self.root / "courses.json"
        self.courses = json.loads(cpath.read_text()) if cpath.exists() else {}

    def save_courses(self):
        (self.root / "courses.json").write_text(json.dumps(self.courses, indent=2, ensure_ascii=False))

    def uni_for(self, slug: str) -> dict:
        """The university config with this course's own overrides applied (see `course_config`)."""
        return load_university(self.root, slug)

    def data(self, slug):
        d = self.root / "data" / slug
        d.mkdir(parents=True, exist_ok=True)
        return d

    def assets(self, slug):
        d = self.root / "assets" / slug
        d.mkdir(parents=True, exist_ok=True)
        return d

    def log(self, slug, msg):
        line = f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] [{slug}] {msg}"
        print(line, flush=True)
        (self.root / "logs").mkdir(exist_ok=True)
        with open(self.root / "logs" / f"{slug}.log", "a") as f:
            f.write(line + "\n")


def load_university(root, course: str | None = None):
    u = dict(DEFAULT_UNIVERSITY)
    u.update(json.loads((Path(root) / "university.json").read_text(encoding="utf-8-sig")))
    u.update(course_config(root, course))
    pm = float(u.get("passMark", 0.7))
    u["passMark"] = pm / 100 if pm > 1 else pm
    ch = u.get("chapters") or {}
    if isinstance(ch, int):
        ch = {"min": ch, "max": ch}
    u["chapters"] = {"min": int(ch.get("min", 3)), "max": int(ch.get("max", ch.get("min", 5)))}
    u["quiz"] = {**DEFAULT_UNIVERSITY["quiz"], **(u.get("quiz") or {})}
    u["colors"] = {**DEFAULT_UNIVERSITY["colors"], **(u.get("colors") or {})}
    return u


def course_slugs(root) -> list[str]:
    """The slugs in courses.json, the single source of truth for which courses exist."""
    path = Path(root) / "courses.json"
    if not path.exists():
        return []
    try:
        return list(json.loads(path.read_text(encoding="utf-8-sig")))
    except (OSError, ValueError):
        return []


def course_config(root, course: str | None) -> dict:
    """Per-course overrides from `courses.json[course]["config"]`.

    A course may override the university-wide settings its own material needs: the language and audience
    of the notes, how many chapters it has, and the source ranking (`grounding`) its notes and questions
    are built on. Everything it does not override keeps the university value.
    """
    if not course:
        return {}
    path = Path(root) / "courses.json"
    if not path.exists():
        return {}
    try:
        courses = json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, ValueError):
        return {}
    return (courses.get(course) or {}).get("config") or {}


def _pid_alive(pid: int) -> bool:
    """True if a process with this pid is running.

    POSIX'te os.kill(pid, 0) yalnızca erişim kontrolü yapar, süreci etkilemez. Windows'ta
    aynı çağrı süreci sonlandırır (TerminateProcess), bu yüzden orada OpenProcess +
    GetExitCodeProcess ile sorgulanır.
    """
    if os.name == "nt":
        import ctypes

        PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
        STILL_ACTIVE = 259
        kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
        kernel32.OpenProcess.argtypes = [ctypes.c_uint32, ctypes.c_int, ctypes.c_uint32]
        kernel32.OpenProcess.restype = ctypes.c_void_p
        kernel32.GetExitCodeProcess.argtypes = [ctypes.c_void_p, ctypes.POINTER(ctypes.c_uint32)]
        kernel32.GetExitCodeProcess.restype = ctypes.c_int
        kernel32.CloseHandle.argtypes = [ctypes.c_void_p]
        kernel32.CloseHandle.restype = ctypes.c_int
        handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid)
        if not handle:
            return False
        try:
            code = ctypes.c_uint32()
            if not kernel32.GetExitCodeProcess(handle, ctypes.byref(code)):
                return False
            return code.value == STILL_ACTIVE
        finally:
            kernel32.CloseHandle(handle)
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True  # var ama başka kullanıcıya ait
    return True


class Lock:
    """One pipeline runner per project. A second runner doubles NotebookLM generations, so refuse it.

    The lock file is created with O_CREAT|O_EXCL, which is atomic everywhere. A leftover file
    from a crashed run is cleared after checking the recorded pid with _pid_alive (which does
    not kill the process on Windows, unlike os.kill(pid, 0)).
    """

    def __init__(self, root):
        self.path = Path(root) / ".pipeline.lock"

    def __enter__(self):
        if self.path.exists():
            try:
                pid = int(self.path.read_text(encoding="utf-8").split()[0])
            except (OSError, ValueError, IndexError):
                pid = 0
            if pid and _pid_alive(pid):
                sys.exit(
                    f"Another pipeline runner is active (pid {pid}). "
                    f"Wait for it, or remove {self.path} if it is dead."
                )
            self.path.unlink(missing_ok=True)  # stale lock from a crashed run
        try:
            fd = os.open(self.path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        except FileExistsError:
            sys.exit(
                f"Another pipeline runner is active. Wait for it, or remove {self.path} "
                "if it is dead."
            )
        try:
            os.write(fd, f"{os.getpid()} {time.strftime('%Y-%m-%d %H:%M:%S')}\n".encode())
        finally:
            os.close(fd)
        return self

    def __exit__(self, *exc):
        self.path.unlink(missing_ok=True)


def source_tier(src, tiers):
    """Rank of a source in `grounding.tiers` (0 = most authoritative). The source `type` decides first (a
    YouTube "özet" video is still captions), then a case-insensitive title or URL substring; a source no tier
    matches ranks after the last tier. A tier's optional `exclude_titles` keeps a source out of that tier
    (third-party write-ups and personal screenshots share the type of the official documentation)."""
    title = (src.get("title") or "").casefold()
    url = (src.get("url") or "").casefold()
    haystack = title + " " + url
    typ = src.get("type") or ""
    for i, t in enumerate(tiers):
        if typ in t.get("types", []) and not _excluded(haystack, t):
            return i
    for i, t in enumerate(tiers):
        if any(m.casefold() in haystack for m in t.get("titles", [])):
            return i
    return len(tiers)


def _excluded(haystack: str, tier: dict) -> bool:
    return any(m.casefold() in haystack for m in tier.get("exclude_titles", []))


def excluded_from_grounding(src, tiers):
    """True when a source must not ground a chapter at all. A tier's `exclude_titles` lists the sources
    that share its type without sharing its authority (third-party write-ups, personal screenshots, video
    uploads of other people's slides). Ranking them below every tier is not enough: they are still handed
    to NotebookLM with `-s` and end up cited, so they are dropped from the source list instead."""
    haystack = ((src.get("title") or "") + " " + (src.get("url") or "")).casefold()
    return any(_excluded(haystack, t) for t in tiers)


def with_authority(ids, sources, tiers):
    """`ids` plus every ready top-tier source when none of `ids` is top tier, so a chapter built from
    lecture captions is still checked against the textbook. Order of `ids` is kept. The top tier's optional
    `max_add` caps how many of its sources are added, so a course with many top-tier documents does not
    flood every chapter. Sources a tier's `exclude_titles` rules out are dropped: they are never handed
    to NotebookLM, so they can never be cited."""
    if not tiers:
        return list(ids)
    by_id = {s.get("id"): s for s in sources}
    ids = [i for i in ids if not excluded_from_grounding(by_id.get(i, {}), tiers)]
    if any(source_tier(by_id.get(i, {}), tiers) == 0 for i in ids):
        return list(ids)
    top = [s["id"] for s in sources if s.get("status") == "ready" and s.get("id") not in ids
           and source_tier(s, tiers) == 0]
    limit = (tiers[0] or {}).get("max_add")
    return list(ids) + (top[:limit] if limit else top)


def grounding_rules(u):
    """One prompt paragraph from `grounding`: the source ranking plus the extra rules. Empty if unset."""
    g = u.get("grounding") or {}
    tiers, rules = g.get("tiers") or [], g.get("rules") or []
    parts = []
    if tiers:
        parts.append("Source ranking, most authoritative first: " + "; ".join(
            f"{i}) {t['label']}" + (f" ({t['note']})" if t.get("note") else "") for i, t in enumerate(tiers, 1))
            + ". When sources conflict, follow the higher-ranked source and say so; never blend them.")
    parts += rules
    return " ".join(parts)


def run_cli(cli, args, timeout=900):
    """Every call closes stdin: notebooklm ask dies with EndOfStream otherwise."""
    try:
        p = subprocess.run([cli, *args], stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=timeout)
        return p.returncode, p.stdout, p.stderr
    except subprocess.TimeoutExpired:
        return 124, "", f"timeout after {timeout}s"


def run_cli_json(cli, args, timeout=900):
    code, out, err = run_cli(cli, [*args, "--json"], timeout)
    try:
        data = json.loads(out) if out.strip() else None
    except json.JSONDecodeError:
        data = None
    return code, data, out, err


def normalize_quiz_questions(questions, default_type="multiple_choice", extra=()) -> list[dict]:
    """The site's question shape for questions that come from NotebookLM.

    The site auto-grades only the types in `quiz_types.GRADED`; a question without a type
    would be shown as a free text box and could not be scored. NotebookLM's quiz export
    carries no type at all, so it is set here. Fields named in `extra` are kept as they are.
    """
    out = []
    for q in questions or []:
        if not isinstance(q, dict):
            continue
        opts = []
        for o in q.get("answerOptions") or q.get("options") or []:
            if isinstance(o, str):
                opts.append({"text": o, "isCorrect": False, "rationale": ""})
            elif isinstance(o, dict):
                opts.append({
                    "text": o.get("text") or "",
                    "isCorrect": bool(o.get("isCorrect") or o.get("correct")),
                    "rationale": o.get("rationale") or o.get("explanation") or "",
                })
        correct = q.get("correct") or q.get("answer")
        if correct and not any(o["isCorrect"] for o in opts) and isinstance(correct, str):
            idx = ord(correct.strip().upper()[:1]) - ord("A")
            if 0 <= idx < len(opts):
                opts[idx]["isCorrect"] = True
        item = {
            "question": q.get("question") or q.get("stem") or q.get("prompt") or "",
            "answerOptions": opts,
            "hint": q.get("hint") or "",
            "type": q.get("type") or default_type,
        }
        for k in extra:
            if q.get(k):
                item[k] = q[k]
        out.append(item)
    return out


def language_code(uni) -> str:
    """The artifact language code of a course ('tr', 'en', ...).

    The notebooklm CLI keeps one global output language for artifact generation, so a course
    that is written in another language has to set it while it generates.
    """
    lang = (uni.get("language") or "Turkish").casefold().replace("-", " ").split(" ")[0]
    if lang.startswith(("tr", "turk")):
        return "tr"
    if lang.startswith("en"):
        return "en"
    return lang[:2]


def cli_language_get(cli) -> str:
    """The CLI's current global output language ('' when it cannot be read)."""
    code, out, err = run_cli(cli, ["language", "get"], timeout=60)
    m = re.search(r"Language:\s*(\S+)", out or "")
    return m.group(1) if m else ""


def cli_language_set(cli, lang: str) -> bool:
    """Set the CLI's global output language and confirm it took effect."""
    for _ in range(2):
        code, out, err = run_cli(cli, ["language", "set", lang], timeout=60)
        if code == 0:
            now = cli_language_get(cli)
            if now and now.lower().startswith(lang.lower()[:2]):
                return True
    return False


@contextlib.contextmanager
def cli_language(cli, lang: str):
    """Set the CLI's global output language for the duration, then restore the old one.

    The setting is account wide, so it is put back even when the generation fails. The language is
    always set, even when the old value cannot be read: skipping it left the CLI on its previous
    language and the artifact came out in the wrong one.
    """
    old = cli_language_get(cli)
    cli_language_set(cli, lang)
    try:
        yield
    finally:
        if old and old != lang:
            cli_language_set(cli, old)


# Türkçeye özgü harfler; İngilizce metinde hiç bulunmazlar.
_TR_CHARS = set("ğüşıöçĞÜŞİÖÇ")


def text_language(text: str) -> str:
    """Rough language of a text: 'tr', 'en' or '' when it cannot be told."""
    letters = sum(1 for c in text if c.isalpha())
    if not letters:
        return ""
    tr = sum(1 for c in text if c in _TR_CHARS)
    if tr / letters >= 0.02:
        return "tr"
    return "en"
