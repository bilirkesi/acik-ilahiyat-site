#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Aynı başlıklı yinelenen NotebookLM kaynaklarını temizle (birini bırak).

Not: notebooklm source delete kullanır. Silmeden önce title+id loglanır.
"""
from __future__ import annotations

import json
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

CLI = r"C:\Users\Selahattin\AppData\Local\Python\pythoncore-3.14-64\Scripts\notebooklm.exe"

COURSES = {
    "turk-dili-1": "c702ed26-fe17-463d-b217-202acd0c3d26",
    "ataturk-ilkeleri-1": "436f4e9d-25d4-4441-98f1-ed97d01b9b7f",
    "islam-mezhepleri-tarihi": "ad4a99c9-cc96-4f29-92f5-ca8638bc42c2",
}


def run(args, timeout=180):
    p = subprocess.run(
        [CLI, *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    return p.returncode, p.stdout or "", p.stderr or ""


def list_sources(nb):
    code, out, err = run(["source", "list", "-n", nb, "--json"])
    if code != 0:
        raise RuntimeError(err or out)
    return json.loads(out).get("sources") or []


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for slug, nb in COURSES.items():
        if only and slug != only:
            continue
        srcs = list_sources(nb)
        groups = defaultdict(list)
        for s in srcs:
            # PDF kaynakları: title .pdf uzantılı olabilir
            key = (s.get("title") or "").strip()
            groups[key].append(s)
        print(f"=== {slug} sources={len(srcs)}")
        deleted = 0
        for title, items in groups.items():
            if len(items) < 2:
                continue
            # ready优先, sonra daha eski id
            items_sorted = sorted(
                items,
                key=lambda s: (0 if s.get("status") == "ready" else 1, s.get("created_at") or "", s.get("id") or ""),
            )
            keep = items_sorted[0]
            for dup in items_sorted[1:]:
                print(f"  del [{dup.get('status')}] {title} {dup.get('id')} (keep {keep.get('id')})")
                code, out, err = run(["source", "delete", dup["id"], "-n", nb, "--json", "--yes"])
                if code != 0:
                    print(f"    HATA: {(err or out)[-200:]}")
                else:
                    deleted += 1
        print(f"  silinen: {deleted}, kalan: {len(list_sources(nb))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
