"""Kaynak izleyici: değişiklikte CourseGraph + mindmap + site arama JS yeniden üretir.

Çalıştırma:
  python -m coursegraph.watch
  python -m coursegraph.watch --once
"""
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from .indexer import ROOT, write_index

WATCH_PATHS = [
    ROOT / "courses.json",
    ROOT / "universities.json",
    ROOT / "site" / "interactive.js",
    ROOT / "artifacts" / "catalog.json",
    ROOT / "data",
]

DEBOUNCE_S = 1.5


def _snapshot() -> dict[str, float]:
    """izlenebilir dosya/dizinlerin (path, mtime) özeti."""
    snap: dict[str, float] = {}
    for p in WATCH_PATHS:
        if not p.exists():
            continue
        if p.is_file():
            snap[str(p)] = p.stat().st_mtime
        else:
            for f in p.rglob("*"):
                if f.is_file() and f.suffix in {".json", ".js", ".md"}:
                    try:
                        snap[str(f)] = f.stat().st_mtime
                    except OSError:
                        pass
    return snap


def rebuild_all() -> dict:
    path = write_index()
    import coursegraph.graph as gg
    from .mindmap import build_mindmaps
    from .site_export import write_site_cg, build_site_cg

    gg._cache = None
    g = gg.load()
    mm = build_mindmaps(g)
    site_path = write_site_cg(build_site_cg(g))
    meta = json.loads((Path(path).parent / "meta.json").read_text(encoding="utf-8"))
    return {"graph": meta, "mindmap": mm, "site": str(site_path)}


def run_once() -> dict:
    return rebuild_all()


def watch_loop(interval: float = 0.4) -> None:
    print("coursegraph.watch: izleniyor (Ctrl+C durdurur)")
    print("paths:", ", ".join(str(p) for p in WATCH_PATHS))
    last = _snapshot()
    print("initial index up to date" if last else "nothing to watch")
    pending_since: float | None = None
    while True:
        time.sleep(interval)
        cur = _snapshot()
        if cur != last:
            if pending_since is None:
                pending_since = time.time()
                print("change detected, debouncing...")
            if time.time() - pending_since >= DEBOUNCE_S:
                last = cur
                pending_since = None
                print("rebuilding graph + mindmaps...")
                try:
                    r = rebuild_all()
                    print(json.dumps(r, ensure_ascii=False))
                except Exception as e:
                    print("rebuild failed:", e)
        else:
            pending_since = None


def main() -> int:
    ap = argparse.ArgumentParser(description="CourseGraph canlı izleyici")
    ap.add_argument("--once", action="store_true", help="tek sefer rebuild")
    args = ap.parse_args()
    if args.once:
        print(json.dumps(run_once(), ensure_ascii=False))
        return 0
    try:
        watch_loop()
    except KeyboardInterrupt:
        print("\nstopped")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
