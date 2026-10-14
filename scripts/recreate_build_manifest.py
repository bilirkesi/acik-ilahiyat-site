#!/usr/bin/env python3
"""16 infografiğin temiz metnini yapılandırılmış JSON'a dönüştürür.

Girdi: artifacts/nlm-infographics/clean-text/<slug>__unit-<n>.txt
Çıktı: artifacts/nlm-infographics/recreate/manifest.json
"""
import json
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Selahattin\NotebookProjects\acik-ilahiyat-poc")
NL = ROOT / "artifacts" / "nlm-infographics"
CLEAN = NL / "clean-text"
OUT = NL / "recreate"
OUT.mkdir(parents=True, exist_ok=True)

YEAR_RE = re.compile(
    r"^(?:\d{4}(?:\s*&\s*\d{4})?\s*[-–]\s*|MS\s*\d+.*|.*\d{4}.*)$"
)


def load(slug, u):
    p = CLEAN / f"{slug}__unit-{u}.txt"
    return p.read_text(encoding="utf-8").splitlines()


def build():
    manifest = []
    for slug in ("turk-dili-1", "ataturk-ilkeleri-1"):
        for u in range(1, 9):
            lines = [ln.strip() for ln in load(slug, u)]
            lines = [ln for ln in lines if ln and ln != "Gemini Notebook"]
            manifest.append({"slug": slug, "unit": u, "lines": lines})
    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print("units:", len(manifest))
    for m in manifest[:2]:
        print(m["slug"], m["unit"], "lines:", len(m["lines"]))


if __name__ == "__main__":
    build()
