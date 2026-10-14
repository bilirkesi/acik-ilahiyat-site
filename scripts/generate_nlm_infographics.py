"""NotebookLM'e yüklenen AÖF infografik PDF'lerinden infographic artifact üretir + indirir.

Kullanım:
  python scripts/generate_nlm_infographics.py            # eksikleri üret
  python scripts/generate_nlm_infographics.py --force    # hepsini yeniden üret
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOGS = ROOT / "logs"
OUT = ROOT / "artifacts" / "nlm-infographics"
NLM = Path.home() / "AppData/Local/Python/pythoncore-3.14-64/Scripts/notebooklm.exe"

COURSES = {
    "turk-dili-1": {
        "nb": "c702ed26-fe17-463d-b217-202acd0c3d26",
        "sources": "sources_turk.json",
        "subject": "TÜRK DİLİ I",
    },
    "ataturk-ilkeleri-1": {
        "nb": "436f4e9d-25d4-4441-98f1-ed97d01b9b7f",
        "sources": "sources_ataturk.json",
        "subject": "ATATÜRK İLKELERİ VE İNKILAP TARİHİ I",
    },
}


def read_json(path):
    raw = Path(path).read_bytes()
    return json.loads(raw.decode("utf-16" if raw[:2] == b"\xff\xfe" else "utf-8"))


def chapter_titles():
    import re as _re
    raw = (ROOT / "site" / "data.js").read_text(encoding="utf-8")
    m = _re.search(r"window\.COURSES = (.*?);\s*\nwindow\.", raw, _re.S) or _re.search(
        r"window\.COURSES = (.*);", raw, _re.S
    )
    return {c["slug"]: [ch["title"] for ch in c["chapters"]] for c in json.loads(m.group(1))}


def run(args, timeout=900):
    env = {"PYTHONUTF8": "1", "PATH": ""}
    proc = subprocess.run(
        [str(NLM), *[str(a) for a in args]],
        capture_output=True,
        timeout=timeout,
        encoding="utf-8",
        errors="replace",
    )
    out = proc.stdout or ""
    if proc.returncode != 0:
        raise RuntimeError(f"exit {proc.returncode}: {out[-800:]} {(proc.stderr or '')[-800:]}")
    return out


def parse_json(text):
    i = text.find("{")
    if i < 0:
        raise RuntimeError("no json: " + text[:400])
    dec = json.JSONDecoder()
    obj, _ = dec.raw_decode(text[i:])
    return obj


def main():
    force = "--force" in sys.argv
    titles = chapter_titles()
    OUT.mkdir(parents=True, exist_ok=True)

    for slug, cfg in COURSES.items():
        srcs = read_json(LOGS / cfg["sources"])["sources"]
        info = {}
        for s in srcs:
            t = s.get("title", "")
            if "nfografik" not in t:
                continue
            m = re.search(r"(\d+)\.pdf$", t)
            if m:
                info[int(m.group(1))] = s["id"]
        dest = OUT / slug
        dest.mkdir(parents=True, exist_ok=True)
        for unit in sorted(info):
            png = dest / f"unit-{unit}.png"
            if png.exists() and not force:
                print(f"[skip] {slug} u{unit} (exists)")
                continue
            src_id = info[unit]
            title = titles.get(slug, [])[unit - 1] if unit <= len(titles.get(slug, [])) else f"Ünite {unit}"
            desc = (
                f"AÖF {cfg['subject']} {unit}. ünite ({title}) özet infografiği: "
                "ünitenin ana kavramlarını, tanımlarını, kronolojisi veya örneklerini "
                "dikey tek sayfada görselleştir; başlık olarak ünite numarası ve adını yaz."
            )
            print(f"[gen ] {slug} u{unit} ...", flush=True)
            out = run([
                "generate", "infographic", desc,
                "-n", cfg["nb"],
                "-s", src_id,
                "--orientation", "portrait",
                "--detail", "detailed",
                "--language", "tr",
                "--wait", "--timeout", "600",
                "--json",
            ])
            res = parse_json(out)
            aid = res.get("artifact_id") or res.get("id") or res.get("task_id")
            print(f"[gen ] {slug} u{unit} -> {res.get('status')} {aid}")
            run([
                "download", "infographic", str(png),
                "-n", cfg["nb"],
                "-a", aid,
                "--json", "--force",
            ])
            print(f"[done] {png} ({png.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
