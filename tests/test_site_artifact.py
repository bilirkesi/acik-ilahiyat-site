"""Yayın sözleşmesi testleri: KaTeX yerelden gelir, CSP tek kaynaktır, kapı çalışır.

`scripts/verify_site.py` yayını bloklayan kapıdır; bu testler onun hem iyi hem kötü
ağaçlarda doğru karar verdiğini ve şablonun gerçekten `script-src 'self'` dediğini
doğrular. KaTeX dosyaları pinlenmiş SHA-256 ile depoda durur (`scripts/vendor_katex.py`).
"""
from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "generator" / "site-template"


def load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


verify = load("verify_site_under_test", ROOT / "scripts" / "verify_site.py")
vendor = load("vendor_katex_under_test", ROOT / "scripts" / "vendor_katex.py")


def quiet(fn, *args):
    """Betikler ilerlemeyi stdout'a yazar; test çıktısını kirletmesin."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        code = fn(*args)
    return code, buf.getvalue()


def make_tree(root: Path, *, script_src: str = "'self'", inline: bool = False,
              version: str = "1700000000", sw_version: str | None = None,
              shell: tuple[str, ...] = ("app.js", "styles.css")) -> Path:
    site = root / "site"
    site.mkdir(parents=True)
    for name in ("app.js", "boot.js", "styles.css", "data.js", "manifest.webmanifest", "favicon.svg"):
        (site / name).write_text("/* x */\n", encoding="utf-8")
    vendor_dir = site / "vendor" / "katex"
    (vendor_dir / "contrib").mkdir(parents=True)
    for rel in ("katex.min.js", "katex.min.css", "contrib/auto-render.min.js"):
        (vendor_dir / rel).write_text("/* x */\n", encoding="utf-8")
    inline_tag = "<script>var a = 1;</script>" if inline else ""
    (site / "index.html").write_text(
        "<!doctype html><html><head>"
        "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; "
        f"script-src {script_src}\">"
        f'<meta name="pu-version" content="{version}">'
        "</head><body>"
        '<script src="app.js"></script>'
        + inline_tag
        + "</body></html>\n",
        encoding="utf-8",
    )
    entries = [[name, "abc123"] for name in shell]
    (site / "sw.js").write_text(
        f'const VERSION = "{sw_version or version}";\nconst SHELL = {json.dumps(entries)};\n',
        encoding="utf-8",
    )
    return site


class TestTemplateCsp(unittest.TestCase):
    def test_scripts_come_only_from_own_origin(self) -> None:
        """KaTeX depoda: CSP artık dış betik kaynağına izin vermez."""
        page = verify.parse_page((TEMPLATE / "index.html").read_text(encoding="utf-8"))
        src = verify.directive(verify.csp_of(page), "script-src")
        self.assertEqual(src, ["'self'"])

    def test_the_template_has_no_inline_script(self) -> None:
        page = verify.parse_page((TEMPLATE / "index.html").read_text(encoding="utf-8"))
        self.assertEqual([s for s in page.scripts if not s.get("src")], [])

    def test_app_loads_katex_from_the_vendored_copy(self) -> None:
        source = (TEMPLATE / "app.js").read_text(encoding="utf-8")
        self.assertIn('const base = "vendor/katex/";', source)
        self.assertNotIn("cdnjs.cloudflare.com", source)
        self.assertIn('css.href = base + "katex.min.css"', source)


class TestVendoredKatex(unittest.TestCase):
    def test_every_file_matches_its_pinned_hash(self) -> None:
        code, output = quiet(vendor.main, ["--check"])
        self.assertEqual(code, 0, output)

    def test_the_builder_copies_the_vendor_folder_but_keeps_it_out_of_the_shell(self) -> None:
        build = (ROOT / "generator" / "scripts" / "build.py").read_text(encoding="utf-8")
        self.assertIn('VENDOR_DIRS = ["vendor"]', build)
        self.assertNotIn("vendor", build.split("SHELL_DIRS = ", 1)[1].split("\n", 1)[0])
        self.assertTrue(all(rel.startswith("vendor/") for rel in verify.VENDOR_REQUIRED))

    def test_the_built_site_ships_the_vendored_files(self) -> None:
        site = ROOT / "site"
        if not (site / "index.html").exists():
            self.skipTest("site/ yok: önce build.py çalıştırılmalı")
        for rel in verify.VENDOR_REQUIRED:
            self.assertTrue((site / rel).is_file(), rel)


class TestVerifySite(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def run_verify(self, site: Path, *extra: str):
        return quiet(verify.main, [str(site), *extra])

    def test_a_good_tree_passes(self) -> None:
        site = make_tree(self.tmp)
        code, output = self.run_verify(site, "--deploy")
        self.assertEqual(code, 0, output)

    def test_an_external_script_source_is_rejected(self) -> None:
        site = make_tree(self.tmp, script_src="'self' https://cdnjs.cloudflare.com")
        code, output = self.run_verify(site)
        self.assertEqual(code, 1)
        self.assertIn("script-src", output)

    def test_an_inline_script_is_rejected(self) -> None:
        site = make_tree(self.tmp, inline=True)
        code, output = self.run_verify(site)
        self.assertEqual(code, 1)
        self.assertIn("satır içi", output)

    def test_a_missing_version_marker_is_rejected(self) -> None:
        site = make_tree(self.tmp)
        html = (site / "index.html").read_text(encoding="utf-8").replace("pu-version", "pu-stale")
        (site / "index.html").write_text(html, encoding="utf-8")
        code, output = self.run_verify(site)
        self.assertEqual(code, 1)
        self.assertIn("pu-version", output)

    def test_a_stale_service_worker_is_rejected(self) -> None:
        site = make_tree(self.tmp, sw_version="1699999999")
        code, output = self.run_verify(site)
        self.assertEqual(code, 1)
        self.assertIn("sw.js VERSION", output)

    def test_a_shell_entry_that_is_not_on_disk_is_rejected(self) -> None:
        site = make_tree(self.tmp, shell=("app.js", "eksik.js"))
        code, output = self.run_verify(site)
        self.assertEqual(code, 1)
        self.assertIn("kabuk dosyası yok", output)

    def test_katex_in_the_shell_is_rejected(self) -> None:
        site = make_tree(self.tmp, shell=("app.js", "vendor/katex/katex.min.js"))
        code, output = self.run_verify(site)
        self.assertEqual(code, 1)
        self.assertIn("kabuğa girmemeli", output)

    def test_an_oversized_file_is_rejected(self) -> None:
        site = make_tree(self.tmp)
        original = verify.FILE_LIMIT
        verify.FILE_LIMIT = 4
        try:
            code, output = self.run_verify(site)
        finally:
            verify.FILE_LIMIT = original
        self.assertEqual(code, 1)
        self.assertIn("dosya sınırı", output)

    def test_webp_files_without_references_are_rejected(self) -> None:
        """Pillow'suz derleme WebP kopyalarını üretir ama data.js'ten düşürür."""
        site = make_tree(self.tmp)
        assets = site / "assets" / "ders"
        assets.mkdir(parents=True)
        (assets / "x.webp").write_bytes(b"RIFF")
        (site / "data.js").write_text("window.OFFLINE = {};\n", encoding="utf-8")
        code, output = self.run_verify(site)
        self.assertEqual(code, 1)
        self.assertIn("WebP", output)

    def test_deploy_mode_rejects_internal_docs(self) -> None:
        site = make_tree(self.tmp)
        (site / "AGENTS.md").write_text("# iç doküman\n", encoding="utf-8")
        self.assertEqual(self.run_verify(site)[0], 0)
        code, output = self.run_verify(site, "--deploy")
        self.assertEqual(code, 1)
        self.assertIn("AGENTS.md", output)

    def test_live_check_accepts_the_local_version(self) -> None:
        site = make_tree(self.tmp, version="1700000042")
        live = (site / "index.html").read_text(encoding="utf-8")
        original = verify.fetch
        seen: list[str] = []

        def fake(url: str) -> str:
            seen.append(url)
            return live

        verify.fetch = fake
        try:
            code, output = self.run_verify(site, "--url", "https://ornek.test/repo/",
                                           "--attempts", "1", "--delay", "0")
        finally:
            verify.fetch = original
        self.assertEqual(code, 0, output)
        self.assertEqual(seen, ["https://ornek.test/repo/index.html?build=1700000042"])

    def test_live_check_rejects_a_stale_release(self) -> None:
        site = make_tree(self.tmp, version="1700000042")
        stale = (site / "index.html").read_text(encoding="utf-8").replace("1700000042", "1700000001")
        original = verify.fetch
        verify.fetch = lambda url: stale
        try:
            code, output = self.run_verify(site, "--url", "https://ornek.test/repo",
                                           "--attempts", "2", "--delay", "0")
        finally:
            verify.fetch = original
        self.assertEqual(code, 1)
        self.assertIn("canlı yayın yerel derlemeyi göstermiyor", output)


class TestBuiltArtifact(unittest.TestCase):
    def test_the_built_site_passes_the_contract(self) -> None:
        """Commit'li site/ bu derlemenin çıktısı olmalı (CSP, kabuk, sürüm, boyut)."""
        site = ROOT / "site"
        if not (site / "index.html").exists():
            self.skipTest("site/ yok: önce build.py çalıştırılmalı")
        code, output = quiet(verify.main, [str(site)])
        self.assertEqual(code, 0, output)


if __name__ == "__main__":
    unittest.main()
