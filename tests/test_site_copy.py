"""Site kopyası sözleşmesi: şablon metinleri Türkçe çekimi ve iki içerik yolunu doğru anlatır.

Şablon JavaScript; bu testler onu metin olarak okur, çekim tablosunu ayrıştırır ve
`noun`/`NOUN_FORMS`/`nounForm` bloğunu node varsa gerçekten çalıştırır. Amaç, elle
yazılmış derslerin ("0 kaynak", "2 puanlık soru", NotebookLM'siz site) geri bozulmaması.
"""
from __future__ import annotations

import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "generator" / "site-template" / "app.js"
BUILT = ROOT / "site" / "app.js"

# Ad çekimi tek yerde: kaynak → kaynağı/kaynakların, ders → dersi/derslerin.
EXPECTED_FORMS = {
    "kaynak": {"acc": "kaynağı", "abl": "kaynağından", "pl": "kaynaklar",
               "plGen": "kaynakların", "plAbl": "kaynaklarından"},
    "ders": {"acc": "dersi", "abl": "dersinden", "pl": "dersler",
             "plGen": "derslerin", "plAbl": "derslerinden"},
}


def template_source() -> str:
    return TEMPLATE.read_text(encoding="utf-8")


def noun_block(src: str) -> str:
    """`const noun` ile başlayan çekim bloğu; iki içerik yolu bayrakları dışarıda kalır."""
    start = src.index("const noun =")
    ends = [src.index(marker, start) for marker in ("const HAS_NOTEBOOK =", "const byline =")
            if marker in src]
    return src[start:min(ends)]


def parse_forms(src: str) -> dict:
    """JS'teki NOUN_FORMS nesne literalinin kendisi (JSON'a çevrilerek okunur)."""
    match = re.search(r"const NOUN_FORMS = \{(.*?)\n  \};", noun_block(src), re.S)
    if not match:
        raise AssertionError("NOUN_FORMS bulunamadı")
    body = re.sub(r"(\w+)\s*:", r'"\1":', match.group(1)).rstrip()
    if body.endswith(","):
        body = body[:-1]
    return json.loads("{" + body + "}")


class TestTurkishNounForms(unittest.TestCase):
    """Şablonun ad çekimi: ekler adın yapısına ve sayıya göre değişir."""

    def test_forms_match_the_suffix_table(self) -> None:
        self.assertEqual(parse_forms(template_source()), EXPECTED_FORMS)

    def test_no_call_site_glues_a_suffix_onto_the_noun(self) -> None:
        """Ek string birleştirmeyle eklenmemeli: `noun(c, n) + "yı"` = "kaynakyı"."""
        src = template_source()
        glued = re.search(r"noun\(c,[^)]*\)\s*[a-zçğıöşü]", src)
        self.assertIsNone(glued, glued.group(0) if glued else "")

    def test_the_quiz_header_counts_points(self) -> None:
        src = template_source()
        self.assertIn("puanlık soru", src)
        self.assertIsNone(re.search(r"puanlı soru(?![a-zçğıöşü])", src))

    @unittest.skipUnless(shutil.which("node"), "node yok: çekim davranışı koşulamıyor")
    def test_zero_drops_the_suffix_and_counts_keep_it(self) -> None:
        """0 kaynak (eki düşer), 3 kaynağı, kaynaklarından; ders tarafı da aynı kural."""
        script = noun_block(template_source()) + """
const k = { kind: "sources" }, d = { kind: "lectures" };
console.log(JSON.stringify([
  nounForm(k, "acc", 0), nounForm(k, "acc", 1), nounForm(k, "acc", 3),
  nounForm(k, "abl", 0), nounForm(k, "abl", 2), nounForm(k, "plGen", 2),
  nounForm(k, "plAbl", 2), nounForm(k, "pl", 2),
  nounForm(d, "acc", 0), nounForm(d, "acc", 4), nounForm(d, "abl", 1),
  nounForm(d, "plGen", 2), nounForm(d, "pl", 2)
]));
"""
        run = subprocess.run(["node", "-e", script], capture_output=True, text=True, timeout=60)
        self.assertEqual(run.returncode, 0, run.stderr)
        self.assertEqual(json.loads(run.stdout), [
            "kaynak", "kaynağı", "kaynağı",
            "kaynak", "kaynağından", "kaynakların",
            "kaynaklarından", "kaynaklar",
            "ders", "dersi", "dersinden",
            "derslerin", "dersler",
        ])


class TestBothContentPaths(unittest.TestCase):
    """NotebookLM'siz proje, sahip olmadığı defteri iddia etmemeli."""

    def test_notebook_claims_sit_behind_the_flag(self) -> None:
        src = template_source()
        self.assertIn("const HAS_NOTEBOOK = COURSES.some((c) => !!c.notebook);", src)
        self.assertIn("const HAS_QUIZ = COURSES.some((c) => (c.quiz || []).length > 0);", src)
        for line in src.splitlines():
            if "NotebookLM defterinde yaşar" in line or "NotebookLM ile ders kaynaklarından üretilmiştir" in line:
                self.assertIn("HAS_NOTEBOOK", line, line.strip())

    def test_a_course_only_promises_an_exam_it_has(self) -> None:
        src = template_source()
        lead = re.search(r"parts\.push\(`Bu sayfa .*?içerir\.`\);", src)
        self.assertIsNotNone(lead)
        self.assertIn("(c.quiz || []).length", lead.group(0))

    def test_the_published_copy_is_the_built_template(self) -> None:
        """site/ elle düzenlenmez: yayınlanan kopya şablonun aynısı olmalı."""
        if not BUILT.exists():
            self.skipTest("site/app.js yok: önce build.py çalıştırılmalı")
        self.assertEqual(BUILT.read_text(encoding="utf-8").replace("\r\n", "\n"),
                         template_source().replace("\r\n", "\n"))


if __name__ == "__main__":
    unittest.main()
