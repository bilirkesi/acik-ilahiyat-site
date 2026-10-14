#!/usr/bin/env python3
"""Add a course to a project, or verify a playlist.

Verify only (prints title, channel, video count; exit 1 if it does not resolve):
  add_course.py --check URL

Own NotebookLM notebook (read only, nothing is added or removed in the notebook):
  add_course.py PROJECT SLUG --notebook URL_OR_ID [--subject S] [--course C] [--professor P] [--school X]

Free lecture playlist (verified with yt-dlp first, then stored as a video list):
  add_course.py PROJECT SLUG --playlist URL [--playlist URL2] --subject S --course C [--professor P] [--school X] [--max 50]

Extra web or PDF links (any mode without --notebook) can be added with --url URL (repeatable).
"""
import argparse, json, re, shutil, subprocess, sys
from common import Project, find_cli, notebook_id, run_cli_json

SKIP = re.compile(r"^\[(private|deleted) video\]$", re.I)


def resolve_playlist(url, limit):
    if not shutil.which("yt-dlp"):
        sys.exit("yt-dlp is not installed. Install: brew install yt-dlp  or  pipx install yt-dlp")
    p = subprocess.run(["yt-dlp", "--flat-playlist", "-J", "--no-warnings", url],
                       stdin=subprocess.DEVNULL, capture_output=True, text=True, timeout=300)
    if p.returncode != 0 or not p.stdout.strip():
        return None, f"yt-dlp failed: {(p.stderr or p.stdout).strip()[-300:]}"
    info = json.loads(p.stdout)
    entries = info.get("entries")
    if entries is None:  # a single video URL
        entries = [{"id": info.get("id"), "title": info.get("title")}]
    vids = [[e["id"], e.get("title") or e["id"]] for e in entries
            if e and e.get("id") and not SKIP.match(e.get("title") or "")]
    if not vids:
        return None, "playlist resolved but has no playable videos"
    meta = {"title": info.get("title"), "channel": info.get("channel") or info.get("uploader"),
            "count": len(vids), "truncated_to": min(len(vids), limit) if len(vids) > limit else None}
    return (meta, vids[:limit]), None


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:40] or "course"


ap = argparse.ArgumentParser()
ap.add_argument("project", nargs="?")
ap.add_argument("slug", nargs="?")
ap.add_argument("--check")
ap.add_argument("--notebook")
ap.add_argument("--playlist", action="append", default=[], help="repeatable: several playlists merge into one course")
ap.add_argument("--url", action="append", default=[])
ap.add_argument("--subject")
ap.add_argument("--course")
ap.add_argument("--professor", default="")
ap.add_argument("--school", default="")
ap.add_argument("--note", default="")
ap.add_argument("--max", type=int, default=50, help="NotebookLM caps sources per notebook (50 on the free plan)")
a = ap.parse_args()

if a.check:
    res, err = resolve_playlist(a.check, a.max)
    if err:
        print(f"FAIL {a.check}: {err}")
        sys.exit(1)
    meta, vids = res
    print(json.dumps({"ok": True, "url": a.check, **meta, "first": vids[0][1], "last": vids[-1][1]}, ensure_ascii=False))
    sys.exit(0)

if not (a.project and a.slug):
    ap.error("PROJECT and SLUG are required unless --check is used")
proj = Project(a.project)
slug = slugify(a.slug)
c = proj.courses.get(slug, {})

if a.notebook:
    nid = notebook_id(a.notebook)
    if not nid:
        sys.exit(f"Could not find a notebook ID in {a.notebook!r}")
    title = a.course
    if not title:
        cli = find_cli()
        if cli:
            code, data, out, err = run_cli_json(cli, ["source", "list", "-n", nid], timeout=120)
            if code == 0 and data:
                title = data.get("notebook_title")
                print(f"notebook {nid}: {title!r}, {len(data.get('sources', []))} sources")
            else:
                sys.exit(f"Could not read notebook {nid}: {(err or out).strip()[-300:]}")
    c.update({"mode": "own", "notebook_id": nid, "subject": a.subject or title or slug.title(),
              "course": title or a.subject or slug.title(), "professor": a.professor, "school": a.school,
              "playlist": "", "note": a.note})
elif a.playlist or a.url:
    if not (a.subject and a.course):
        sys.exit("--subject and --course are required for lecture courses")
    c.update({"mode": "lectures", "subject": a.subject, "course": a.course, "professor": a.professor,
              "school": a.school, "note": a.note, "playlist": (a.playlist or a.url or [""])[0]})
    if a.playlist:
        vids, seen = [], set()
        for pl in a.playlist:
            res, err = resolve_playlist(pl, a.max)
            if err:
                sys.exit(f"Playlist does not resolve, nothing added: {pl}: {err}")
            meta, got = res
            vids += [v for v in got if v[0] not in seen and not seen.add(v[0])]
            print(f"playlist ok: {meta['title']!r} by {meta['channel']}, {meta['count']} videos"
                  + (f", kept first {meta['truncated_to']}" if meta["truncated_to"] else ""))
        if len(vids) > a.max:
            print(f"merged list has {len(vids)} videos, keeping the first {a.max}")
        c["videos"] = vids[:a.max]
    if a.url:
        c["urls"] = sorted(set(c.get("urls", []) + a.url), key=(c.get("urls", []) + a.url).index)
else:
    sys.exit("Give --notebook, --playlist or --url")

proj.courses[slug] = c
proj.save_courses()
print(f"saved course '{slug}' in {proj.root / 'courses.json'}")
