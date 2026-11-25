#!/usr/bin/env python3
"""Yayın sözleşmesi: `site/` gerçekten yayına uygun mu?

`static.yml` bu betiği yayından hemen önce (`--deploy`) ve yayından sonra (`--url`)
çalıştırır. Böylece "testler yeşil ama canlıda eski sürüm var" durumu sessiz kalmaz.

Kontroller:
- kabuk dosyaları ve yerel KaTeX dosyaları var mı
- CSP `script-src` yalnızca `'self'` mi (dış betik kaynağı yok)
- satır içi `<script>` var mı (CSP onu engeller, sessiz kırılma üretir)
- `pu-version` ile `sw.js` sürümü aynı mı; kabuktaki her yol diskte var mı
- toplam boyut ve tek dosya sınırı (Pages artefaktı 1 GiB, tek dosya 100 MiB)
- `--deploy`: yayına iç doküman (`AGENTS.md`) sızıyor mu
- `--url`: canlı `pu-version` yerel derlemenin damgasıyla aynı mı

Kullanım:
    py -3 scripts/verify_site.py site
    py -3 scripts/verify_site.py site --deploy
    py -3 scripts/verify_site.py site --deploy --url https://ornek.github.io/repo
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

# Pages'in yüklediği artefakt sınırları.
TOTAL_LIMIT = 1 << 30
FILE_LIMIT = 100 << 20

REQUIRED = [
    "index.html", "boot.js", "styles.css", "app.js", "data.js", "sw.js",
    "manifest.webmanifest", "favicon.svg",
]
# CSP `script-src 'self'` diyorsa bu dosyalar kendi kaynağımızdan gelmek zorunda.
VENDOR_REQUIRED = [
    "vendor/katex/katex.min.js",
    "vendor/katex/katex.min.css",
    "vendor/katex/contrib/auto-render.min.js",
]


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.scripts: list[dict[str, str]] = []
        self.metas: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        item = {k.lower(): (v or "") for k, v in attrs}
        if tag == "script":
            self.scripts.append(item)
        elif tag == "meta":
            self.metas.append(item)


def parse_page(text: str) -> Page:
    page = Page()
    page.feed(text)
    return page


def csp_of(page: Page) -> str:
    for meta in page.metas:
        if meta.get("http-equiv", "").lower() == "content-security-policy":
            return meta.get("content", "")
    return ""


def version_of(page: Page) -> str:
    for meta in page.metas:
        if meta.get("name") == "pu-version":
            return meta.get("content", "").strip()
    return ""


def directive(csp: str, name: str) -> list[str] | None:
    for part in csp.split(";"):
        tokens = part.split()
        if tokens and tokens[0].lower() == name:
            return tokens[1:]
    return None


def check_page(html: str, where: str, problems: list[str]) -> str:
    """CSP ve satır içi betik sözleşmesi; sayfanın sürüm damgasını döndürür."""
    page = parse_page(html)
    csp = csp_of(page)
    if not csp:
        problems.append(f"{where}: Content-Security-Policy meta etiketi yok")
    else:
        src = directive(csp, "script-src")
        if src is None:
            problems.append(f"{where}: CSP'de script-src yok (default-src'e düşer)")
        elif src != ["'self'"]:
            problems.append(f"{where}: script-src yalnızca 'self' olmalı, bulunan: {' '.join(src)}")
        default = directive(csp, "default-src")
        if default is None or "'self'" not in default:
            problems.append(f"{where}: CSP default-src 'self' değil")
    inline = [s for s in page.scripts if not s.get("src")]
    if inline:
        problems.append(f"{where}: {len(inline)} satır içi <script> var; CSP onu engeller")
    version = version_of(page)
    if not version:
        problems.append(f"{where}: pu-version meta etiketi yok")
    elif not version.isdigit():
        problems.append(f"{where}: pu-version sayı değil: {version!r}")
    return version


def check_shell(site: Path, version: str, problems: list[str]) -> None:
    sw_path = site / "sw.js"
    if not sw_path.exists():
        return
    text = sw_path.read_text(encoding="utf-8")
    found = re.search(r'^const VERSION = "([^"]*)";', text, re.M)
    if not found:
        problems.append("sw.js: VERSION sabiti okunamadı")
    elif found.group(1) != version:
        problems.append(f"sw.js VERSION ({found.group(1)}) ile pu-version ({version}) farklı")
    shell = re.search(r"const SHELL = (\[.*?\]);", text, re.S)
    if not shell:
        problems.append("sw.js: SHELL listesi okunamadı")
        return
    try:
        entries = json.loads(shell.group(1))
    except ValueError as exc:
        problems.append(f"sw.js: SHELL listesi JSON değil: {exc}")
        return
    if not entries:
        problems.append("sw.js: SHELL listesi boş")
    for entry in entries:
        rel = entry[0] if isinstance(entry, list) and entry else str(entry)
        if not (site / rel).is_file():
            problems.append(f"sw.js: kabuk dosyası yok: {rel}")
        if rel.startswith("vendor/"):
            problems.append(f"sw.js: KaTeX kabuğa girmemeli (ölü önbellek): {rel}")


def check_sizes(site: Path, problems: list[str]) -> tuple[int, int]:
    total = 0
    count = 0
    for path in site.rglob("*"):
        if not path.is_file():
            continue
        count += 1
        size = path.stat().st_size
        total += size
        if size > FILE_LIMIT:
            problems.append(
                f"tek dosya sınırı aşıldı ({size / (1 << 20):.1f} MiB): "
                f"{path.relative_to(site).as_posix()}"
            )
    if total > TOTAL_LIMIT:
        problems.append(f"artefakt 1 GiB sınırını aşıyor: {total / (1 << 30):.2f} GiB")
    return count, total


def check_deploy(site: Path, problems: list[str]) -> None:
    for path in site.rglob("AGENTS.md"):
        problems.append(f"iç doküman yayına gidiyor: {path.relative_to(site).as_posix()}")


def check_webp(site: Path, problems: list[str]) -> None:
    """WebP kopyaları varsa `data.js` onları listelemeli.

    `build.py` bu kopyaları yalnızca Pillow varsa üretir; onsuz derleme sessizce
    `data.js`'i JPG'lere düşürür ve yayındaki site hafif görselleri kaybeder.
    """
    data = site / "data.js"
    assets = site / "assets"
    if not data.is_file() or not assets.is_dir():
        return
    has_webp = any(p.suffix == ".webp" for p in assets.rglob("*"))
    if has_webp and ".webp" not in data.read_text(encoding="utf-8", errors="replace"):
        problems.append("data.js WebP kopyalarını listelemiyor: derleme Pillow olmadan çalışmış olabilir")


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url, headers={"User-Agent": "acik-ilahiyat-site/verify", "Cache-Control": "no-cache", "Pragma": "no-cache"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", "replace")


def check_live(base: str, want: str, attempts: int, delay: float, problems: list[str]) -> None:
    url = base.rstrip("/") + "/index.html?build=" + want
    last = ""
    for i in range(1, attempts + 1):
        try:
            html = fetch(url)
        except (urllib.error.URLError, OSError) as exc:
            last = f"istek başarısız: {exc}"
        else:
            page = parse_page(html)
            got = version_of(page)
            if got == want:
                live_csp = csp_of(page)
                src = directive(live_csp, "script-src")
                if src != ["'self'"]:
                    problems.append(f"canlı CSP script-src 'self' değil: {' '.join(src or []) or '(yok)'}")
                print(f"canlı sürüm doğrulandı: {want} ({url})")
                return
            last = f"canlı pu-version {got or '(yok)'}, beklenen {want}"
        if i < attempts:
            print(f"bekleniyor {i}/{attempts}: {last}")
            time.sleep(delay)
    problems.append(f"canlı yayın yerel derlemeyi göstermiyor: {last}")


def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description="Yayın artefaktı sözleşmesini doğrular.")
    ap.add_argument("site", nargs="?", default="site", help="derlenmiş site klasörü (varsayılan: site)")
    ap.add_argument("--deploy", action="store_true", help="yayına özel kontroller (iç doküman sızması)")
    ap.add_argument("--url", default="", help="yayın sonrası canlı adres (ör. https://x.github.io/repo)")
    ap.add_argument("--attempts", type=int, default=30, help="canlı kontrol deneme sayısı")
    ap.add_argument("--delay", type=float, default=10.0, help="denemeler arası saniye")
    args = ap.parse_args(argv)

    site = Path(args.site)
    problems: list[str] = []
    if not site.is_dir():
        print(f"HATA: {site} yok; önce build.py çalıştırılmalı", file=sys.stderr)
        return 1
    for rel in REQUIRED + VENDOR_REQUIRED:
        if not (site / rel).is_file():
            problems.append(f"gerekli dosya yok: {rel}")

    version = ""
    index = site / "index.html"
    if index.is_file():
        version = check_page(index.read_text(encoding="utf-8", errors="replace"), "index.html", problems)
    if version:
        check_shell(site, version, problems)
    count, total = check_sizes(site, problems)
    check_webp(site, problems)
    if args.deploy:
        check_deploy(site, problems)
    if args.url and version:
        check_live(args.url, version, args.attempts, args.delay, problems)

    if problems:
        for problem in problems:
            print("HATA:", problem)
        return 1
    print(f"site doğrulandı: {count} dosya, {total / (1 << 20):.1f} MiB, sürüm {version}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
