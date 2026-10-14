#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""assets/<slug>/aof/*.pdf dosyalarını ilgili NotebookLM defterine kaynak olarak ekler.

- Mevcut kaynak başlıkları kontrol edilir; aynı isim tekrar eklenmez.
- state.json güncellenir (sources + order).
"""
from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CLI = r"C:\Users\Selahattin\AppData\Local\Python\pythoncore-3.14-64\Scripts\notebooklm.exe"

COURSES = {
    "turk-dili-1": "c702ed26-fe17-463d-b217-202acd0c3d26",
    "ataturk-ilkeleri-1": "436f4e9d-25d4-4441-98f1-ed97d01b9b7f",
    "islam-mezhepleri-tarihi": "ad4a99c9-cc96-4f29-92f5-ca8638bc42c2",
}


def run(args: list[str], timeout: int = 300) -> tuple[int, str, str]:
    p = subprocess.run(
        [CLI, *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout,
    )
    return p.returncode, p.stdout or "", p.stderr or ""


def list_sources(nb: str) -> list[dict]:
    code, out, err = run(["source", "list", "-n", nb, "--json"], timeout=180)
    if code != 0:
        raise RuntimeError(f"source list failed: {err[-400:] or out[-400:]}")
    data = json.loads(out)
    return data.get("sources") or []


def add_file(nb: str, path: Path, title: str, timeout: int = 600) -> dict:
    args = [
        "source", "add",
        str(path),
        "-n", nb,
        "--type", "file",
        "--title", title,
        "--json",
        "--timeout", str(timeout),
    ]
    code, out, err = run(args, timeout=timeout + 60)
    # CLI bazen exit!=0 döner ama kaynak eklenmiş olabilir; önce JSON'a bak
    decoder = json.JSONDecoder()
    data = None
    for i, ch in enumerate(out):
        if ch != "{":
            continue
        try:
            obj, _ = decoder.raw_decode(out[i:])
        except json.JSONDecodeError:
            continue
        if isinstance(obj, dict) and ("source" in obj or "id" in obj or "error" in obj):
            data = obj
            break
    if data is None:
        raise RuntimeError(f"add failed {path.name}: {(err or out)[-500:]}")
    if data.get("error") and code != 0:
        raise RuntimeError(f"add error {path.name}: {data}")
    if "source" in data and isinstance(data["source"], dict):
        return data["source"]
    return data


def norm_title(s: str) -> str:
    return (s or "").strip().lower().removesuffix(".pdf")


def wait_ready(nb: str, sid: str, timeout: int = 180) -> str:
    code, out, err = run(["source", "wait", sid, "-n", nb, "--json"], timeout=timeout)
    if code == 0:
        try:
            data = json.loads(out)
            return data.get("status") or "ready"
        except json.JSONDecodeError:
            return "ready"
    return "unknown"


def main() -> int:
    if not Path(CLI).exists():
        print("notebooklm CLI yok", file=sys.stderr)
        return 2
    for slug, nb in COURSES.items():
        aof = ROOT / "assets" / slug / "aof"
        pdfs = sorted(aof.glob("*.pdf"))
        if not pdfs:
            print(f"[{slug}] aof PDF yok")
            continue
        print(f"=== {slug} ({len(pdfs)} pdf) nb={nb}", flush=True)
        existing = list_sources(nb)
        by_title = { norm_title(s.get("title") or "") for s in existing }
        print(f"  mevcut kaynak: {len(existing)}")
        st_path = DATA / slug / "state.json"
        st = json.loads(st_path.read_text(encoding="utf-8-sig")) if st_path.exists() else {"sources": {}}
        st.setdefault("sources", {})
        order = st.get("order") or list(st["sources"])
        added = 0
        for pdf in pdfs:
            title = pdf.stem  # uzantısız
            if norm_title(title) in by_title:
                print(f"  skip (var): {title}")
                continue
            if len(existing) + added >= 50:
                print("  DUR: 50 kaynak limiti")
                break
            print(f"  + {title} ({pdf.stat().st_size // 1024} KB)", flush=True)
            try:
                data = add_file(nb, pdf, title, timeout=600)
            except Exception as e:
                print(f"    HATA: {e}")
                continue
            sid = data.get("id") or data.get("source_id") or ""
            status = "processing"
            if sid:
                print(f"    id={sid} wait...", flush=True)
                status = wait_ready(nb, sid, timeout=240)
            if not sid:
                time.sleep(2)
                for s in list_sources(nb):
                    if norm_title(s.get("title") or "") == norm_title(title):
                        sid = s["id"]
                        status = s.get("status") or "ready"
                        break
            if sid:
                st["sources"][sid] = {
                    "id": sid,
                    "title": title,
                    "url": "",
                    "type": "file",
                    "status": status if status in ("ready", "processing") else "ready",
                    "origin": "aof",
                }
                if sid not in order:
                    order.append(sid)
                by_title.add(norm_title(title))
                added += 1
            print(f"    -> {status}")
            time.sleep(1.5)
        st["order"] = order
        st["notebook_id"] = nb
        st_path.write_text(json.dumps(st, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  eklendi: {added}, toplam state sources: {len(st['sources'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
