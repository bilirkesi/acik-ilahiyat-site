"""generator/scripts/common.py ve quiz_types.py testleri: pipeline kilidi + soru tipi sözleşmesi.

generator/scripts/ bir paket değil; modüller sys.path'e eklenerek import edilir.
"""
from __future__ import annotations

import json
import os
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))

import common  # noqa: E402
import quiz_types  # noqa: E402


class TestLock(unittest.TestCase):
    """Pipeline kilidi: ikinci çalıştırıcı reddedilir, çökmüş çalıştırıcının kilidi temizlenir."""

    def test_second_holder_is_refused(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            with common.Lock(td):
                with self.assertRaises(SystemExit):
                    with common.Lock(td):
                        pass

    def test_lock_is_released_on_exit(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            with common.Lock(td):
                pass
            with common.Lock(td):  # yeniden alınabiliyor
                pass

    def test_lock_file_is_removed_on_exit(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / ".pipeline.lock"
            with common.Lock(td):
                self.assertTrue(path.exists())
            self.assertFalse(path.exists())

    def test_stale_lock_is_cleared(self) -> None:
        """Çökmüş bir çalıştırıcının bıraktığı kilit, süreç ölü olduğu için temizlenmeli."""
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / ".pipeline.lock"
            path.write_text("999999 2020-01-01 00:00:00\n", encoding="utf-8")
            with common.Lock(td):
                self.assertNotEqual(path.read_text(encoding="utf-8").split()[0], "999999")

    def test_live_lock_is_not_cleared(self) -> None:
        """Çalışan bir sürecin kilidi temizlenmemeli."""
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / ".pipeline.lock"
            path.write_text(f"{os.getpid()} 2020-01-01 00:00:00\n", encoding="utf-8")
            with self.assertRaises(SystemExit):
                with common.Lock(td):
                    pass
            self.assertTrue(path.exists())


class TestPidAlive(unittest.TestCase):
    """_pid_alive(): Windows'ta os.kill(pid, 0) bir CTRL_C_EVENT gönderir ve ölü pid'de
    ProcessLookupError değil WinError 87 verir; bu yüzden ayrı bir sorgu kullanılır."""

    def test_dead_pid(self) -> None:
        self.assertFalse(common._pid_alive(999999))

    def test_own_pid(self) -> None:
        self.assertTrue(common._pid_alive(os.getpid()))


class TestQuizTypes(unittest.TestCase):
    """Soruların tip listesi tek kaynaktan gelir: generator/scripts/quiz_types.py."""

    def test_site_and_legacy_types_are_known(self) -> None:
        for t in ("multiple_choice", "multiple_select", "fill_in_the_blank", "short_answer",
                  "test", "true_false", None):
            self.assertIn(t, quiz_types.KNOWN)

    def test_unknown_type_is_not_known(self) -> None:
        self.assertNotIn("acik_ufuk", quiz_types.KNOWN)

    def test_graded_set_matches_the_site(self) -> None:
        """app.js'in GRADED kümesi ile Python tarafı ayrışmamalı."""
        app = (ROOT / "generator" / "site-template" / "app.js").read_text(encoding="utf-8")
        m = re.search(r"const GRADED = new Set\(\[([^\]]*)\]\)", app)
        if not m:
            self.skipTest("app.js'te GRADED kümesi bulunamadı")
        site = set(re.findall(r'"([^"]+)"', m.group(1)))
        self.assertEqual(site, quiz_types.GRADED)


class TestCourseConfig(unittest.TestCase):
    """Ders bazlı yapılandırma: courses.json -> config -> load_university(root, course)."""

    def test_university_values_are_untouched_without_a_course(self) -> None:
        plain = common.load_university(ROOT)
        self.assertEqual(plain["language"], "Turkish")
        self.assertEqual(plain["chapters"], {"min": 5, "max": 10})
        self.assertEqual(plain["grounding"]["tiers"][0]["types"], ["book"])

    def test_course_config_overrides_only_what_it_defines(self) -> None:
        cfg = common.course_config(ROOT, "teknik-gelistirim")
        self.assertEqual(cfg["language"], "English")
        self.assertIn("grounding", cfg)
        plain = common.load_university(ROOT)
        self.assertEqual(plain["language"], "Turkish", "ders yapilandirmasi universiteyi degistirmemeli")

    def test_course_config_of_an_unknown_course_is_empty(self) -> None:
        self.assertEqual(common.course_config(ROOT, "olmayan-ders"), {})
        self.assertEqual(common.course_config(ROOT, None), {})

    def test_technical_course_loads_its_own_settings(self) -> None:
        u = common.load_university(ROOT, "teknik-gelistirim")
        self.assertEqual(u["language"], "English")
        self.assertEqual(u["chapters"], {"min": 8, "max": 10})
        self.assertTrue(u["grounding"]["tiers"])
        self.assertTrue(u["grounding"]["rules"])


class TestSourceTier(unittest.TestCase):
    """source_tier: tip once, sonra baslik ya da URL; tier'in exclude_titles'i disarida tutar."""

    TIERS = [
        {"label": "resmi", "types": ["web_page"], "exclude_titles": ["slideshare"]},
        {"label": "notlar", "types": ["gemini_chat"]},
    ]

    def test_type_decides(self) -> None:
        self.assertEqual(common.source_tier({"type": "web_page", "title": "x"}, self.TIERS), 0)
        self.assertEqual(common.source_tier({"type": "gemini_chat", "title": "x"}, self.TIERS), 1)

    def test_exclude_titles_push_a_source_down(self) -> None:
        src = {"type": "web_page", "title": "Advanced Architectures | PDF - Slideshare"}
        self.assertEqual(common.source_tier(src, self.TIERS), len(self.TIERS))

    def test_url_is_matched_too(self) -> None:
        src = {"type": "web_page", "title": "Bir yazi", "url": "https://www.slideshare.net/x"}
        self.assertEqual(common.source_tier(src, self.TIERS), len(self.TIERS))

    def test_tiers_without_exclusions_behave_as_before(self) -> None:
        tiers = [{"label": "a", "types": ["book"]}, {"label": "b", "titles": ["Kitap"]}]
        self.assertEqual(common.source_tier({"type": "book", "title": "x"}, tiers), 0)
        self.assertEqual(common.source_tier({"type": "file", "title": "AÖF Kitap PDF"}, tiers), 1)
        self.assertEqual(common.source_tier({"type": "file", "title": "başka"}, tiers), 2)


class TestWithAuthority(unittest.TestCase):
    """with_authority: ust katman kaynaklari; tier'in max_add'i kacagini sinirlar."""

    SOURCES = [
        {"id": "t1", "type": "web_page", "title": "a", "status": "ready"},
        {"id": "t2", "type": "web_page", "title": "b", "status": "ready"},
        {"id": "t3", "type": "web_page", "title": "c", "status": "ready"},
        {"id": "n1", "type": "gemini_chat", "title": "d", "status": "ready"},
    ]

    def test_top_tier_is_added_when_the_chapter_has_none(self) -> None:
        tiers = [{"label": "resmi", "types": ["web_page"]}]
        self.assertEqual(common.with_authority(["n1"], self.SOURCES, tiers),
                         ["n1", "t1", "t2", "t3"])

    def test_max_add_caps_the_added_sources(self) -> None:
        tiers = [{"label": "resmi", "types": ["web_page"], "max_add": 2}]
        self.assertEqual(common.with_authority(["n1"], self.SOURCES, tiers), ["n1", "t1", "t2"])

    def test_a_chapter_with_its_own_top_tier_gets_nothing_added(self) -> None:
        tiers = [{"label": "resmi", "types": ["web_page"]}]
        self.assertEqual(common.with_authority(["t2"], self.SOURCES, tiers), ["t2"])


class TestExcludedFromGrounding(unittest.TestCase):
    """exclude_titles: kacirilan kaynak hem tier'a giremez hem de notlari beslemez."""

    TIERS = [
        {"label": "resmi", "types": ["web_page"], "exclude_titles": ["slideshare"]},
        {"label": "notlar", "types": ["gemini_chat"]},
    ]

    SOURCES = [
        {"id": "t1", "type": "web_page", "title": "Oracle Data Guard Concepts", "status": "ready"},
        {"id": "g1", "type": "web_page", "title": "Advanced Architectures | PDF - Slideshare", "status": "ready"},
        {"id": "n1", "type": "gemini_chat", "title": "Calisma notlari", "status": "ready"},
    ]

    def test_a_listed_source_is_excluded(self) -> None:
        self.assertTrue(common.excluded_from_grounding(self.SOURCES[1], self.TIERS))

    def test_an_official_source_is_not_excluded(self) -> None:
        self.assertFalse(common.excluded_from_grounding(self.SOURCES[0], self.TIERS))

    def test_the_url_is_matched_too(self) -> None:
        src = {"type": "web_page", "title": "Bir yazi", "url": "https://www.slideshare.net/x"}
        self.assertTrue(common.excluded_from_grounding(src, self.TIERS))

    def test_a_source_without_tiers_is_never_excluded(self) -> None:
        self.assertFalse(common.excluded_from_grounding(self.SOURCES[1], []))

    def test_with_authority_drops_the_excluded_source(self) -> None:
        """Gurultu kaynagi bolumun kaynak listesinde kalirsa NotebookLM'e verilir ve atif alir."""
        self.assertEqual(common.with_authority(["t1", "g1", "n1"], self.SOURCES, self.TIERS), ["t1", "n1"])

    def test_with_authority_adds_the_top_tier_when_only_the_excluded_one_is_left(self) -> None:
        self.assertEqual(common.with_authority(["g1"], self.SOURCES, self.TIERS), ["t1"])

    def test_the_excluded_source_is_not_offered_as_top_tier(self) -> None:
        self.assertNotIn("g1", common.with_authority(["n1"], self.SOURCES, self.TIERS))


class TestTechnicalCourseUnits(unittest.TestCase):
    """coursegraph'teki unite basliklari dersin bolum basliklariyla ayni olmali."""

    def test_unit_titles_match_the_study_plan(self) -> None:
        from coursegraph.past_exams import unit_titles

        plan_path = ROOT / "data" / "teknik-gelistirim" / "study_plan.json"
        if not plan_path.exists():
            self.skipTest("teknik-gelistirim study plan yok")
        plan = json.loads(plan_path.read_text(encoding="utf-8-sig"))
        chapters = plan.get("chapters", [])
        titles = unit_titles("teknik-gelistirim")
        self.assertEqual(len(titles), len(chapters), "bolum sayisi ile unite sayisi farkli")
        for i, ch in enumerate(chapters, 1):
            self.assertEqual(titles[i], ch["title"], f"{i}. bolum basligi degismis")


if __name__ == "__main__":
    unittest.main()
