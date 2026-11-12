"""Soru-cevap korpusu: uretim betigi, disa aktarma ve site getirmesi."""
from __future__ import annotations

import importlib.util
import json
import math
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))


def _load(path, name):
    spec = importlib.util.spec_from_file_location(name, ROOT / path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


gen = _load("scripts/generate_chat.py", "generate_chat")
exp = _load("scripts/export_chat_site.py", "export_chat_site")
eokf = _load("scripts/export_okf.py", "export_okf")


class TestChatCorpus(unittest.TestCase):
    """Korporus JSON okunur, soru-cevap ciftleri ve kaynaklari eksiksiz olur."""

    def test_parse_json_reads_the_questions(self) -> None:
        obj = gen.parse_json('metin {"questions": [{"q": "soru?", "a": "cevap"}]} son')
        self.assertEqual(obj["questions"][0]["q"], "soru?")

    def test_parse_json_fixes_invalid_escapes(self) -> None:
        # "CDB\\$ROOT" JSON'da gecersiz kacis; duzeltilip cozulmeli.
        obj = gen.parse_json('{"questions": [{"q": "CDB\\$ROOT nedir?", "a": "kok container"}]}')
        self.assertIsNotNone(obj)
        self.assertIn("CDB$ROOT", obj["questions"][0]["q"])

    def test_parse_json_returns_none_without_questions(self) -> None:
        self.assertIsNone(gen.parse_json("JSON yok"))
        self.assertIsNone(gen.parse_json('{"baska": 1}'))

    def test_the_prompt_asks_for_citations(self) -> None:
        """Atif isareti istenir; yoksa cevapta [1] baglantilari olusmaz."""
        for lang in ("tr", "en"):
            self.assertIn("[1]", gen.PROMPT[lang])

    def test_the_prompt_is_json_shaped(self) -> None:
        for lang in ("tr", "en"):
            self.assertIn('"questions"', gen.PROMPT[lang])


class TestChatExport(unittest.TestCase):
    """data/<slug>/chat.json -> site/chat.js."""

    def test_export_writes_the_bundle(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "data" / "x").mkdir(parents=True)
            (root / "data" / "x" / "chat.json").write_text(json.dumps({
                "slug": "x", "language": "tr",
                "items": [{"chapter": 1, "chapterTitle": "B1", "q": "soru?", "a": "cevap",
                           "sources": [{"title": "kaynak", "url": "https://k"}]},
                          {"chapter": 2, "q": "eksik", "a": ""}],
            }, ensure_ascii=False), encoding="utf-8")
            old_root, old_slugs = exp.ROOT, exp.SLUGS
            exp.ROOT = root
            exp.SLUGS = ["x"]
            try:
                self.assertEqual(exp.main(), 0)
                text = (root / "site" / "chat.js").read_text(encoding="utf-8")
            finally:
                exp.ROOT, exp.SLUGS = old_root, old_slugs
            self.assertTrue(text.startswith("window.CHAT = "))
            self.assertTrue(text.endswith(";\n"))
            data = json.loads(text[len("window.CHAT = "):-2])
            self.assertEqual(len(data["x"]["items"]), 1)      # cevapsiz olan dusuruldu
            self.assertEqual(data["x"]["items"][0]["q"], "soru?")
            self.assertEqual(data["x"]["items"][0]["sources"][0]["title"], "kaynak")


class TestChatRetrieval(unittest.TestCase):
    """Sitenin getirme kurali: zayif eslesmeler reddedilir."""

    APP = ROOT / "generator" / "site-template" / "app.js"

    @classmethod
    def setUpClass(cls) -> None:
        src = cls.APP.read_text(encoding="utf-8")
        m = re.search(r"const CHAT_STOP = new Set\(\[(.*?)\]\)", src, re.S)
        assert m, "CHAT_STOP bulunamadi"
        cls.stop = set(re.findall(r'"([^"]+)"', m.group(1)))
        f = re.search(r"const floor = totalIdf \* ([0-9.]+);", src)
        assert f, "esik sabiti bulunamadi"
        cls.floor = float(f.group(1))
        c = re.search(r"hitIdf / totalIdf >= ([0-9.]+)", src)
        assert c, "kapsam sabiti bulunamadi"
        cls.coverage = float(c.group(1))

    def _search(self, items, q, slug=None):
        """app.js'teki chatSearch ile ayni kurali Python'da tekrarlar.

        Doner: [(puan, soru-cevap), ...] en iyiden zayifa.
        """
        def norm(s):
            s = re.sub(r"[^a-z0-9_ ]+", " ", str(s or "").casefold())
            return re.sub(r"\s+", " ", s).strip()

        def toks(s):
            return {w for w in norm(s).split(" ") if len(w) > 1 and w not in self.stop}

        docs = [{"q": toks(it["q"]), "a": toks(it["a"])} for it in items]
        df = {}
        for d in docs:
            for t in d["q"] | d["a"]:
                df[t] = df.get(t, 0) + 1
        n = max(1, len(docs))
        query = toks(q)
        if not query:
            return []
        max_score = sum(math.log(1 + n / (df.get(t) or 1)) for t in query)
        floor = max_score * self.floor
        out = []
        for it, d in zip(items, docs):
            if slug and it.get("slug") != slug:
                continue
            score = 0.0
            hit_idf = 0.0
            q_idf = 0.0
            for t in query:
                idf = math.log(1 + n / (df.get(t) or 1))
                if t in d["q"]:
                    score += 3 * idf
                    hit_idf += idf
                    q_idf += idf
                elif t in d["a"]:
                    score += 1 * idf
                    hit_idf += idf
            if score >= floor and hit_idf / max_score >= self.coverage:
                out.append((score, q_idf, it))
        out.sort(key=lambda x: (-x[0], -x[1]))
        return [(score, it) for score, _, it in out]

    ITEMS = [
        {"q": "sga_target parametresi ne işe yarar?", "a": "SGA belleğini ASMM ile ayarlar."},
        {"q": "ASM DATA disk grubu nedir?", "a": "Veri dosyalarını tutan disk grubudur."},
        {"q": "Lozan'ın ilkeleri nelerdir?", "a": "Dokuz ilke vardır."},
    ]

    def test_the_stop_words_are_normalized(self) -> None:
        """Durak kelimeler normalize edilmis halde olmali: "cok" -> "cok" gibi."""
        for w in self.stop:
            self.assertEqual(w, w.lower(), w)
            self.assertNotRegex(w, r"[çğıöşüâîû]", w)
        self.assertTrue({"bu", "ne", "nedir", "var", "icin", "cok"} <= self.stop)

    def test_a_matching_question_is_found(self) -> None:
        self.assertTrue(self._search(self.ITEMS, "sga_target ne yarar"))

    def test_an_unrelated_question_is_rejected(self) -> None:
        self.assertEqual(self._search(self.ITEMS, "tamamen alakasız bir soru xyz"), [])

    def test_a_word_only_in_the_answer_still_matches(self) -> None:
        self.assertTrue(self._search(self.ITEMS, "Lozan ilkeleri"))

    def test_the_floor_rejects_a_weak_match(self) -> None:
        """Yalnizca ortak bir kelimeyle eslesen kayit, en iyi olasi puanin altinda kalir."""
        items = [
            {"q": "sga_target parametresi ne işe yarar?", "a": "Bellek yönetimi."},
            {"q": "veritabani nedir?", "a": "Veri saklama sistemi."},
            {"q": "veritabani nasil kurulur?", "a": "Kurulum adimlari."},
            {"q": "veritabani ne turdur?", "a": "Iliskisel tur."},
            {"q": "Disk nedir?", "a": "Bu konu veritabani ile ilgilidir."},
        ]
        hits = self._search(items, "sga_target veritabani")
        questions = [it["q"] for _, it in hits]
        self.assertTrue(hits)
        # "veritabani" yalnizca cevapta gecen zayif kayit reddedilir.
        self.assertNotIn("Disk nedir?", questions)
        self.assertIn("sga_target parametresi ne işe yarar?", questions)

    def test_the_course_filter_keeps_only_that_course(self) -> None:
        """Ders filtresi secilince o dersin kayitlari gelir."""
        items = [
            {"slug": "a", "q": "sga_target nedir?", "a": "Bellek yonetimi."},
            {"slug": "b", "q": "sga_target nedir?", "a": "Bellek yonetimi."},
        ]
        self.assertEqual(len(self._search(items, "sga_target")), 2)
        only_a = self._search(items, "sga_target", "a")
        self.assertEqual(len(only_a), 1)
        self.assertEqual(only_a[0][1]["slug"], "a")

    def test_a_word_absent_from_the_corpus_lowers_the_coverage(self) -> None:
        """Korpusta hic bulunmayan bir kelime, kapsami dusurur: alakasiz soru eslesmez."""
        items = [
            {"q": "Mezheplerden tamamen kurtulmak nedir?", "a": "Reform söylemi."},
            {"q": "tamamen katılım", "a": "Katılım."},
            {"q": "tamamen başka", "a": "Başka."},
            {"q": "tamamen bir", "a": "Bir."},
            {"q": "tamamen iki", "a": "İki."},
        ]
        # "tamamen" geciyor ama "xyz" korpusta hic yok: kapsam dusuk, eslesme reddedilir.
        self.assertEqual(self._search(items, "tamamen xyz"), [])
        # Gercek bir soruda bulunmayan kelime yok: eslesme gelir.
        self.assertTrue(self._search(items, "tamamen kurtulmak"))

    def test_a_key_word_in_the_question_wins_over_an_answer_match(self) -> None:
        """Esit puanda anahtar kelimeyi soru basliginda gecen kayit one cikar."""
        items = [
            {"q": "TAC modunda servis nasil yonetilir?", "a": "pga_aggregate_target ayarlanir."},
            {"q": "pga_aggregate_target nasil ayarlanir?", "a": "Program Global Area."},
        ]
        hits = self._search(items, "pga_aggregate_target ayarlanir")
        self.assertTrue(hits)
        self.assertEqual(hits[0][1]["q"], "pga_aggregate_target nasil ayarlanir?")


class TestChatCitations(unittest.TestCase):
    """Atif numaralari kaynak listesine gore duzeltilir."""

    SRC = [{"title": "Oracle", "url": "https://o"}, {"title": "IFS", "url": "https://i"}]

    def test_cite_numbers_reads_a_list(self) -> None:
        self.assertEqual(gen.cite_numbers("1, 2"), [1, 2])

    def test_cite_numbers_expands_a_range(self) -> None:
        self.assertEqual(gen.cite_numbers("3-5"), [3, 4, 5])

    def test_a_marker_outside_the_list_is_removed(self) -> None:
        answer, sources = gen.renumber_citations("SGA ayarlanir [28].", self.SRC)
        self.assertEqual(answer, "SGA ayarlanir.")
        # Isaret oturmadiysa bolumun kaynaklari (burada ayni liste) gecerlidir.
        self.assertEqual(sources, self.SRC)

    def test_the_fallback_fills_the_sources_when_no_marker_fits(self) -> None:
        answer, sources = gen.renumber_citations("SGA ayarlanir [28].", [], [{"title": "Bolum", "url": "b"}])
        self.assertEqual(answer, "SGA ayarlanir.")
        self.assertEqual([s["title"] for s in sources], ["Bolum"])

    def test_the_markers_are_renumbered_from_one(self) -> None:
        """Bosluk varsa isaretler ardisik degil; ilk atif 1 olur."""
        src = [{"title": "A", "url": "a"}, {"title": "B", "url": "b"}, {"title": "C", "url": "c"}]
        answer, sources = gen.renumber_citations("X [3]. Y [1].", src)
        self.assertEqual(answer, "X [1]. Y [2].")
        self.assertEqual([s["title"] for s in sources], ["C", "A"])

    def test_several_markers_in_one_bracket_are_kept(self) -> None:
        answer, sources = gen.renumber_citations("A [1, 2].", self.SRC)
        self.assertEqual(answer, "A [1, 2].")
        self.assertEqual(len(sources), 2)

    def test_a_range_is_expanded(self) -> None:
        src = [{"title": "A", "url": "a"}, {"title": "B", "url": "b"}, {"title": "C", "url": "c"}]
        answer, sources = gen.renumber_citations("A [1-3].", src)
        self.assertEqual(answer, "A [1, 2, 3].")
        self.assertEqual(len(sources), 3)

    def test_a_partly_valid_bracket_keeps_the_valid_part(self) -> None:
        answer, sources = gen.renumber_citations("A [1, 28].", self.SRC)
        self.assertEqual(answer, "A [1].")
        self.assertEqual(len(sources), 1)

    def test_the_same_source_is_listed_once(self) -> None:
        """Ayni kaynak birden cok numarayla atif yapilmis olabilir; listede bir kez durur."""
        src = [{"title": "A", "url": "u1"}, {"title": "A", "url": "u1"}, {"title": "B", "url": "u2"}]
        answer, sources = gen.renumber_citations("X [1] Y [2] Z [3].", src)
        self.assertEqual(answer, "X [1] Y [1] Z [2].")
        self.assertEqual([s["title"] for s in sources], ["A", "B"])

    def test_an_answer_without_a_marker_keeps_its_sources(self) -> None:
        answer, sources = gen.renumber_citations("Kaynak vermeden bir cevap.", self.SRC)
        self.assertEqual(answer, "Kaynak vermeden bir cevap.")
        self.assertEqual(sources, self.SRC)

    def test_the_corpus_normalizer_fixes_every_item(self) -> None:
        corpus = {"items": [
            {"q": "s", "chapter": 1, "a": "X [28].", "sources": []},
            {"q": "s", "chapter": 1, "a": "Y [2].", "sources": self.SRC},
        ]}
        gen.normalize_corpus(corpus, {1: [{"title": "Bolum", "url": "b"}]})
        self.assertEqual(corpus["items"][0]["a"], "X.")
        self.assertEqual([s["title"] for s in corpus["items"][0]["sources"]], ["Bolum"])
        self.assertEqual(corpus["items"][1]["a"], "Y [1].")
        self.assertEqual(len(corpus["items"][1]["sources"]), 1)


class TestChatSources(unittest.TestCase):
    """Bolum kaynaklari defterdeki kaynaklara baglanir."""

    SOURCES = [
        {"id": "osm1-kitap-1", "nlm_id": "uuid-1", "title": "Osmanlı Türkçesi I ders kitabı, Bölüm 1:"},
        {"id": "osm1-kitap-2", "nlm_id": "uuid-1", "title": "Osmanlı Türkçesi I ders kitabı, Bölüm 2:"},
        {"id": "v1", "nlm_id": "uuid-2", "title": "Ünite 1 Özet videosu"},
        {"id": "v3", "nlm_id": "uuid-3", "title": "Ünite 3 Özet videosu"},
        {"id": "a3", "nlm_id": None, "title": "Ünite 3 özet videosu (ses)"},
    ]

    def test_a_known_id_is_used_as_is(self) -> None:
        chapter = {"source_ids": ["v3"]}
        self.assertEqual([s["id"] for s in gen.resolve_chapter_sources(chapter, self.SOURCES)], ["v3"])

    def test_a_local_id_is_matched_by_keyword_and_number(self) -> None:
        chapter = {"source_ids": ["osm1-kitap-2"]}
        got = gen.resolve_chapter_sources(chapter, self.SOURCES)
        self.assertEqual([s["id"] for s in got], ["osm1-kitap-2"])

    def test_a_local_video_id_skips_the_audio_copy(self) -> None:
        chapter = {"source_ids": ["x-video-3"]}
        got = gen.resolve_chapter_sources(chapter, self.SOURCES)
        self.assertEqual([s["id"] for s in got], ["v3"])

    def test_an_unresolvable_id_is_dropped(self) -> None:
        chapter = {"source_ids": ["bilinmeyen-9"]}
        self.assertEqual(gen.resolve_chapter_sources(chapter, self.SOURCES), [])


class TestChatBuild(unittest.TestCase):
    """build.py: katalog sayfasinin sayiyi chat.js'i yuklemeden gostermesi."""

    def test_the_summary_counts_the_questions(self) -> None:
        import tempfile
        build = _load("generator/scripts/build.py", "build")
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "data" / "a").mkdir(parents=True)
            (root / "data" / "a" / "chat.json").write_text(json.dumps({
                "items": [{"q": "s", "a": "c"}, {"q": "s2", "a": "c2"}, {"q": "", "a": "c3"}],
            }), encoding="utf-8")
            (root / "data" / "b").mkdir(parents=True)
            summary = build.chat_summary(root, ["a", "b", "yok"])
        self.assertEqual(summary["questions"], 2)
        self.assertEqual(summary["courses"], 1)

    def test_the_summary_is_empty_without_a_corpus(self) -> None:
        import tempfile
        build = _load("generator/scripts/build.py", "build")
        with tempfile.TemporaryDirectory() as td:
            summary = build.chat_summary(Path(td), ["a"])
        self.assertEqual(summary, {"questions": 0, "courses": 0})


class TestChatOkf(unittest.TestCase):
    """OKF paketindeki soru-cevap sayfasi."""

    ITEMS = [
        {"chapter": 1, "chapterTitle": "Bellek", "q": "sga_target nedir?",
         "a": "SGA belleğini ASMM ile ayarlar [1].", "sources": [{"title": "Oracle", "url": "https://o"}]},
        {"chapter": 1, "chapterTitle": "Bellek", "q": "pga nedir?",
         "a": "Program Global Area.", "sources": [{"title": "Oracle", "url": "https://o"}]},
        {"chapter": 2, "chapterTitle": "Depolama", "q": "ASM nedir?",
         "a": "Otomatik depolama yöneticisi.", "sources": []},
    ]

    def test_the_page_groups_by_chapter(self) -> None:
        md = eokf.render_chat_page("Teknik Gelişim", self.ITEMS)
        self.assertIn("# Teknik Gelişim Soru & Cevap", md)
        self.assertIn("## 1. Bölüm: Bellek", md)
        self.assertIn("## 2. Bölüm: Depolama", md)
        self.assertIn("### sga_target nedir?", md)
        self.assertIn("**Kaynaklar:** [Oracle](https://o)", md)

    def test_load_chat_drops_incomplete_items(self) -> None:
        import tempfile
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "data" / "x").mkdir(parents=True)
            (root / "data" / "x" / "chat.json").write_text(json.dumps({
                "items": [{"q": "s", "a": "c"}, {"q": "", "a": "c"}, {"q": "s", "a": ""}],
            }), encoding="utf-8")
            old_root = eokf.ROOT
            eokf.ROOT = root
            try:
                items = eokf.load_chat("x")
            finally:
                eokf.ROOT = old_root
            self.assertEqual(len(items), 1)
            self.assertEqual(items[0]["q"], "s")

    def test_load_chat_without_a_file_is_empty(self) -> None:
        import tempfile
        with tempfile.TemporaryDirectory() as td:
            old_root = eokf.ROOT
            eokf.ROOT = Path(td)
            try:
                self.assertEqual(eokf.load_chat("yok"), [])
            finally:
                eokf.ROOT = old_root


if __name__ == "__main__":
    unittest.main()
