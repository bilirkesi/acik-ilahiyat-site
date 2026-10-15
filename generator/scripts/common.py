"""Shared helpers for Personal University scripts. Standard library only."""
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
    """Locate the notebooklm binary: PATH first, then the usual uv/pipx install folders."""
    hit = shutil.which("notebooklm")
    if hit:
        return hit
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


def load_university(root):
    u = dict(DEFAULT_UNIVERSITY)
    u.update(json.loads((Path(root) / "university.json").read_text(encoding="utf-8-sig")))
    pm = float(u.get("passMark", 0.7))
    u["passMark"] = pm / 100 if pm > 1 else pm
    ch = u.get("chapters") or {}
    if isinstance(ch, int):
        ch = {"min": ch, "max": ch}
    u["chapters"] = {"min": int(ch.get("min", 3)), "max": int(ch.get("max", ch.get("min", 5)))}
    u["quiz"] = {**DEFAULT_UNIVERSITY["quiz"], **(u.get("quiz") or {})}
    u["colors"] = {**DEFAULT_UNIVERSITY["colors"], **(u.get("colors") or {})}
    return u


class Lock:
    """One pipeline runner per project. A second runner doubles NotebookLM generations, so refuse it."""

    def __init__(self, root):
        self.path = Path(root) / ".pipeline.lock"

    def __enter__(self):
        if self.path.exists():
            try:
                pid = int(self.path.read_text().split()[0])
                os.kill(pid, 0)
                sys.exit(f"Another pipeline runner is active (pid {pid}). Wait for it, or remove {self.path} if it is dead.")
            except (ValueError, ProcessLookupError, IndexError):
                self.path.unlink(missing_ok=True)  # stale lock from a crashed run
            except PermissionError:
                sys.exit(f"Lock held by pid in {self.path}. Wait for that runner to finish.")
        fd = os.open(self.path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.write(fd, f"{os.getpid()} {time.strftime('%Y-%m-%d %H:%M:%S')}\n".encode())
        os.close(fd)
        return self

    def __exit__(self, *exc):
        self.path.unlink(missing_ok=True)


def source_tier(src, tiers):
    """Rank of a source in `grounding.tiers` (0 = most authoritative). The source `type` decides first (a
    YouTube "özet" video is still captions), then a case-insensitive title substring; a source no tier
    matches ranks after the last tier."""
    title, typ = (src.get("title") or "").casefold(), src.get("type") or ""
    for i, t in enumerate(tiers):
        if typ in t.get("types", []):
            return i
    for i, t in enumerate(tiers):
        if any(m.casefold() in title for m in t.get("titles", [])):
            return i
    return len(tiers)


def with_authority(ids, sources, tiers):
    """`ids` plus every ready top-tier source when none of `ids` is top tier, so a chapter built from
    lecture captions is still checked against the textbook. Order of `ids` is kept."""
    if not tiers:
        return list(ids)
    by_id = {s.get("id"): s for s in sources}
    if any(source_tier(by_id.get(i, {}), tiers) == 0 for i in ids):
        return list(ids)
    top = [s["id"] for s in sources if s.get("status") == "ready" and s.get("id") not in ids
           and source_tier(s, tiers) == 0]
    return list(ids) + top


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
