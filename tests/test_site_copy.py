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

    def test_a_course_without_questions_has_no_quiz_path(self) -> None:
        """Soru bankası boşsa "Final (oyun)" düğmesi, "Sınav" satırı ve sınav rotası kapalı olmalı."""
        src = template_source()
        for line in src.splitlines():
            if "Final (oyun)" in line:
                self.assertIn("(c.quiz || []).length", line)
        self.assertIn("viewNoQuiz(c)", src)
        guarded = [ln for ln in src.splitlines() if "viewQuiz(c)" in ln and "parts[2]" not in ln]
        self.assertTrue(guarded, "sınav rotası viewQuiz çağırmıyor")
        for line in guarded:
            self.assertIn("(c.quiz || []).length", line)

    def test_the_exam_hub_does_not_offer_a_missing_final(self) -> None:
        """Soru yoksa sınav merkezindeki "Final (oyun modu)" kartı bağlantısız olmalı."""
        src = template_source()
        self.assertIn("href: quizN ? `#/course/${c.slug}/quiz` : null,", src)
        self.assertIn('"Bu ders için final soruları henüz yok."', src)
        # Statik kart özelliği kalmamalı; soru bankasındaki `href` yalnız var olan sorulara takılır.
        self.assertNotIn("href: `#/course/${c.slug}/quiz`,", src)
        self.assertNotIn("Cevap anahtarı PDF'in son sayfasından alınmıştır. Puan", src)

    def test_the_mixed_test_page_refuses_an_empty_pool(self) -> None:
        """Karışık testte havuz boşsa "Teste başla" kapalı kalmalı."""
        src = template_source()
        self.assertIn('"Bu seçimde soru yok."', src)
        self.assertIn("go.disabled = !pool.length", src)

    def test_the_parallel_reading_view_only_appears_for_a_paired_course(self) -> None:
        """Çift dilli okuma yalnız `pair` taşıyan ve karşı bölümü olan derste görünür."""
        src = template_source()
        self.assertIn("function viewParallel(c, n) {", src)
        self.assertIn("return p && p.chapters[n - 1] ? p : null;", src)
        self.assertIn('else if (parts[2] === "cift") html = viewParallel(c, +parts[3]);', src)
        self.assertIn("Çift dilli oku", src)

    def test_the_paired_courses_are_exported_with_their_counterpart(self) -> None:
        """Kardeş dersler birbirini `pair` ile gösterir ve build bunu data.js'e yazar."""
        import json
        from pathlib import Path

        data = (Path(__file__).resolve().parents[1] / "site" / "data.js").read_text(encoding="utf-8")
        start = data.index("window.COURSES = ") + len("window.COURSES = ")
        courses, _ = json.JSONDecoder().raw_decode(data[start:])
        by = {c["slug"]: c for c in courses}
        self.assertEqual(by["teknik-gelistirim"].get("pair"), "teknik-gelistirim-tr")
        self.assertEqual(by["teknik-gelistirim-tr"].get("pair"), "teknik-gelistirim")
        self.assertEqual(by["teknik-gelistirim"]["language"], "en")
        self.assertEqual(by["teknik-gelistirim-tr"]["language"], "tr")

    def test_the_glossary_deck_is_wired_to_the_course(self) -> None:
        """Kelime destesi dersten açılır ve seçim çubuğundan kelime alır."""
        src = template_source()
        self.assertIn("function viewGloss(c) {", src)
        self.assertIn('else if (parts[2] === "sozluk") { html = viewGloss(c); bind = () => bindGloss(c); }', src)
        self.assertIn('data-hl="word"', src)
        self.assertIn("Sözlük destesi", src)

    def test_the_glossary_deck_schedules_with_growing_intervals(self) -> None:
        """Tekrar kutuları büyür, deste yedekle birleşir ve varsayılan olarak boştur."""
        src = template_source()
        self.assertIn("const GLOSS_STEPS = [0, 1, 3, 7, 16, 35];", src)
        self.assertIn("harf: null, gloss: {},", src)
        self.assertIn("for (const [slug, list] of Object.entries(b.gloss || {})) {", src)
        self.assertIn("item.due = addDays(Date.now(), GLOSS_STEPS[item.box]);", src)

    def test_a_reviewed_word_counts_as_the_day_and_reaches_the_desk(self) -> None:
        """Sözlük tekrarı seriye sayar ve çalışma masasında sırada görünür."""
        src = template_source()
        self.assertIn("r.kav || r.game || r.gl", src)
        self.assertIn("day.gl = (day.gl || 0) + 1;", src)
        self.assertIn("${glossDeskHtml()}", src)
        self.assertIn("kelime bugün tekrar bekliyor", src)
        # Masa kartı ders ders ayrılır: her ders kendi destesine bağlanır.
        self.assertIn("gl-desk-list", src)
        self.assertIn("href=\"#/course/${x.c.slug}/sozluk\"", src)
        self.assertIn("${x.due ? `${x.due} sırada` : \"bugün yok\"} · ${x.total} kelime", src)

    def test_the_published_copy_is_the_built_template(self) -> None:
        """site/ elle düzenlenmez: yayınlanan kopya şablonun aynısı olmalı."""
        if not BUILT.exists():
            self.skipTest("site/app.js yok: önce build.py çalıştırılmalı")
        self.assertEqual(BUILT.read_text(encoding="utf-8").replace("\r\n", "\n"),
                         template_source().replace("\r\n", "\n"))


if __name__ == "__main__":
    unittest.main()
