#!/usr/bin/env python3
"""HTML'leri Chrome headless ile 1536x2752 PNG'ye render eder."""
import subprocess
from pathlib import Path

ROOT = Path(r"C:\Users\Selahattin\NotebookProjects\acik-ilahiyat-poc")
NL = ROOT / "artifacts" / "nlm-infographics"
RECREATE = NL / "recreate"
HTML = RECREATE / "html"
OUT = RECREATE / "png"
OUT.mkdir(parents=True, exist_ok=True)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def shot(src: Path, dst: Path):
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1536,2752",
        f"--screenshot={dst}",
        src.resolve().as_uri(),
    ]
    subprocess.run(cmd, check=True, capture_output=True, timeout=90)


def main():
    files = sorted(HTML.glob("*.html"))
    for f in files:
        dst = OUT / (f.stem + ".png")
        shot(f, dst)
        print("ok", f.stem, dst.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
