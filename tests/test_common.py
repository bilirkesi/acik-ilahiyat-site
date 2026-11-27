"""generator/scripts/common.py ve quiz_types.py testleri: pipeline kilidi + soru tipi sözleşmesi.

generator/scripts/ bir paket değil; modüller sys.path'e eklenerek import edilir.
"""
from __future__ import annotations

import importlib.util
import json
import os
import re
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))

import common  # noqa: E402
import pipeline  # noqa: E402
import quiz_types  # noqa: E402


def _load_script(rel, name):
    """scripts/ bir paket değil: betikler dosya yolundan yüklenir."""
    spec = importlib.util.spec_from_file_location(name, ROOT / rel)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


audio = _load_script("scripts/generate_chapter_audio.py", "generate_chapter_audio")


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

    def test_course_config_of_an_unknown_course_is_empty(self) -> None:
        self.assertEqual(common.course_config(ROOT, "olmayan-ders"), {})
        self.assertEqual(common.course_config(ROOT, None), {})

    def test_a_course_without_a_config_keeps_the_university_settings(self) -> None:
        plain = common.load_university(ROOT)
        self.assertEqual(common.course_config(ROOT, "turk-dili-1"), {})
        self.assertEqual(plain["language"], "Turkish")


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


class TestNotebookSourceId(unittest.TestCase):
    """`notebook_source_id`: once `nlm_id`, yoksa kaydin kendi `id`'si.

    Uc ders (turk-dili-1, ataturk-ilkeleri-1, islam-mezhepleri-tarihi) defterin UUID'sini dogrudan
    `id` alaninda tutar ve `nlm_id` yazmaz; osm1-kitap-1 gibi yerel anahtar kullanan ders UUID'yi
    `nlm_id`'de tutar. Iki sekil de ayni id'ye cozulur.
    """

    def test_a_local_key_is_mapped_to_its_nlm_id(self) -> None:
        self.assertEqual(common.notebook_source_id({"id": "osm1-kitap-1", "nlm_id": "uuid-1"}), "uuid-1")

    def test_a_state_without_nlm_id_keeps_its_own_id(self) -> None:
        self.assertEqual(
            common.notebook_source_id({"id": "817b5ed4-4b8c-45a3-905d-dea47e9a1ec8", "title": "TÜRK DİLİ I - Kitap"}),
            "817b5ed4-4b8c-45a3-905d-dea47e9a1ec8")

    def test_a_source_without_an_id_is_empty(self) -> None:
        self.assertEqual(common.notebook_source_id({}), "")


class TestChapterSources(unittest.TestCase):
    """`pipeline.Runner.chapter_sources`: bölümün kaynakları NotebookLM'in bildiği id'ye çözülür.

    `Runner.__init__` `require_cli()` çağırdığı için örnek `__new__` ile kurulup yalnız
    `chapter_sources`ın okuduğu iki üye (`tiers`, `ready_sources`) verilir.
    """

    TIERS = [{"label": "kitap", "types": ["book"]}]
    UUID = "3f2b6c1e-8a44-4d47-9c1e-2b0e5a7d9f10"

    def _runner(self, sources):
        r = pipeline.Runner.__new__(pipeline.Runner)
        r.tiers = self.TIERS
        r.ready_sources = lambda: sources
        return r

    def test_a_local_key_is_sent_as_its_nlm_id(self) -> None:
        sources = [{"id": "osm1-kitap-1", "nlm_id": self.UUID, "type": "book", "status": "ready"}]
        self.assertEqual(self._runner(sources).chapter_sources({"source_ids": ["osm1-kitap-1"]}), [self.UUID])

    def test_a_source_that_holds_the_uuid_in_id_is_sent_as_it_is(self) -> None:
        sources = [{"id": self.UUID, "type": "file", "title": "TÜRK DİLİ I - Kitap", "status": "ready"}]
        self.assertEqual(self._runner(sources).chapter_sources({"source_ids": [self.UUID]}), [self.UUID])

    def test_an_id_that_matches_no_source_is_passed_through(self) -> None:
        """İkisi de yoksa çözülecek bir id yoktur: plan id'si olduğu gibi CLI'ya gider ve NotebookLM onu
        reddeder, `ground` o bölümü atlar. Ses betiği aynı durumda durur (aşağıdaki test)."""
        runner = self._runner([{"id": self.UUID, "type": "file", "status": "ready"}])
        self.assertEqual(runner.chapter_sources({"source_ids": ["osm1-kitap-1"]}), ["osm1-kitap-1"])


class TestChapterAudioSourceIds(unittest.TestCase):
    """`generate_chapter_audio.generate`: `-s` id'si NotebookLM'in bildiği id'dir.

    Yerel anahtar (`osm1-kitap-1`) `nlm_id`'ye, doğrudan UUID tutan `id` kendisine çözülür; ikisi de
    yoksa yerel anahtar CLI'ya verilemez, betik `SystemExit` ile durur.
    """

    UUID = "817b5ed4-4b8c-45a3-905d-dea47e9a1ec8"
    UNI = {"language": "Turkish", "audience": "öğrenciler",
           "grounding": {"tiers": [{"label": "kitap", "types": ["book"]}]}}

    def _args(self):
        return SimpleNamespace(nlm=["notebooklm"], format="deep-dive", length="short", language="tr")

    def _generate(self, sources, chapter):
        """`generate`ı sahte bir `run` ile çalıştırır; yapılan CLI çağrılarını döndürür."""
        calls = []

        def fake_run(cmd, **kw):
            calls.append([str(c) for c in cmd])
            return SimpleNamespace(stdout="")

        old = audio.run
        audio.run = fake_run
        try:
            with tempfile.TemporaryDirectory() as td:
                audio.generate("notebook-1", chapter, Path(td) / "chapter-1.mp4", self._args(), sources, self.UNI)
        finally:
            audio.run = old
        return calls

    @staticmethod
    def _source_args(cmd):
        return [cmd[i + 1] for i, a in enumerate(cmd) if a == "-s"]

    def test_a_local_key_is_sent_as_its_nlm_id(self) -> None:
        sources = [{"id": "osm1-kitap-1", "nlm_id": self.UUID, "type": "book", "status": "ready"}]
        cmd = self._generate(sources, {"title": "Bölüm 1", "source_ids": ["osm1-kitap-1"]})[0]
        self.assertEqual(self._source_args(cmd), [self.UUID])

    def test_a_source_that_holds_the_uuid_in_id_is_sent_as_it_is(self) -> None:
        sources = [{"id": self.UUID, "type": "file", "status": "ready"}]
        cmd = self._generate(sources, {"title": "Bölüm 1", "source_ids": [self.UUID]})[0]
        self.assertEqual(self._source_args(cmd), [self.UUID])

    def test_a_source_without_a_notebook_id_stops_before_any_cli_call(self) -> None:
        calls = []

        def fake_run(cmd, **kw):
            calls.append(cmd)
            return SimpleNamespace(stdout="{}")

        old = audio.run
        audio.run = fake_run
        try:
            with tempfile.TemporaryDirectory() as td, self.assertRaises(SystemExit) as cm:
                audio.generate("notebook-1", {"title": "Bölüm 1", "source_ids": ["osm1-kitap-1"]},
                               Path(td) / "chapter-1.mp4", self._args(),
                               [{"id": "osm1-kitap-1", "type": "book", "status": "ready"}], self.UNI)
        finally:
            audio.run = old
        self.assertIn("has no NotebookLM id", str(cm.exception))
        self.assertEqual(calls, [])


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


class TestFixJsonEscapes(unittest.TestCase):
    """Modelin plan JSON'unda yazdigi gecersiz kacislar duzeltilir; gecerli olanlar korunur."""

    def test_an_invalid_dollar_escape_is_dropped(self) -> None:
        self.assertEqual(pipeline.fix_json_escapes(r"CDB\$ROOT"), "CDB$ROOT")

    def test_a_valid_backslash_escape_survives(self) -> None:
        self.assertEqual(pipeline.fix_json_escapes(r"CDB\\(ROOT"), r"CDB\\(ROOT")

    def test_ordinary_json_escapes_survive(self) -> None:
        for s in (r'\"', r"\\", r"\n", r"\t", r"\u00e9"):
            self.assertEqual(pipeline.fix_json_escapes(s), s)

    def test_the_result_is_valid_json(self) -> None:
        raw = '{"a": "CDB\\$ROOT ve PDB\\\\)SEED", "b": "satir\\niki"}'
        data = json.loads(pipeline.fix_json_escapes(raw))
        self.assertEqual(data["a"], "CDB$ROOT ve PDB\\)SEED")
        self.assertEqual(data["b"], "satir\niki")


class TestNormalizeQuizQuestions(unittest.TestCase):
    """NotebookLM'in dort soru tipi kendi cevabiyla korunur (canli EDBO defteri bunu gosterdi).

    Bosluk doldurma ve kisa cevap sik tasimaz; `normalize_quiz_questions` onlari `bestAnswer` /
    `grading` olmadan yazinca site ve calisma uygulamasi sorulari gosteremiyordu.
    """

    RAW = [
        {"type": "multiple_choice", "question": "A?",
         "answerOptions": [{"text": "a", "isCorrect": True}, {"text": "b", "isCorrect": False}]},
        {"type": "multiple_select", "question": "B?",
         "answerOptions": [{"text": "a", "isCorrect": True}, {"text": "b", "isCorrect": True}]},
        {"type": "fill_in_the_blank", "question": "C? ___", "bestAnswer": "v$backup_set",
         "acceptableAnswers": ["v$backup_set", "V$BACKUP_SET"], "rationale": "Cunku."},
        {"type": "short_answer", "question": "D?", "grading": {"modelAnswer": "Ornek cevap."}},
        {"type": "test", "question": "E?",
         "answerOptions": [{"text": "a", "isCorrect": True}]},
        {"question": "F?", "answerOptions": [{"text": "a", "isCorrect": True}]},
    ]

    def setUp(self) -> None:
        self.qs = common.normalize_quiz_questions(self.RAW)

    def test_the_type_is_kept(self) -> None:
        self.assertEqual([q["type"] for q in self.qs],
                         ["multiple_choice", "multiple_select", "fill_in_the_blank",
                          "short_answer", "test", "multiple_choice"])

    def test_a_select_question_keeps_every_correct_option(self) -> None:
        self.assertEqual(sum(1 for o in self.qs[1]["answerOptions"] if o["isCorrect"]), 2)

    def test_the_blank_keeps_its_answers(self) -> None:
        self.assertEqual(self.qs[2]["bestAnswer"], "v$backup_set")
        self.assertEqual(self.qs[2]["acceptableAnswers"], ["v$backup_set", "V$BACKUP_SET"])

    def test_the_short_answer_keeps_its_grading(self) -> None:
        self.assertEqual(self.qs[3]["grading"]["modelAnswer"], "Ornek cevap.")

    def test_a_blank_without_an_answer_gets_no_best_answer(self) -> None:
        q = common.normalize_quiz_questions([{"type": "fill_in_the_blank", "question": "x"}])[0]
        self.assertNotIn("bestAnswer", q)


class TestTechnicalCourseUnits(unittest.TestCase):
    """coursegraph'teki unite basliklari dersin bolum basliklariyla ayni olmali."""

    def _check(self, slug):
        from coursegraph.past_exams import unit_titles

        plan_path = ROOT / "data" / slug / "study_plan.json"
        if not plan_path.exists():
            self.skipTest(f"{slug} study plan yok")
        plan = json.loads(plan_path.read_text(encoding="utf-8-sig"))
        chapters = plan.get("chapters", [])
        titles = unit_titles(slug)
        self.assertEqual(len(titles), len(chapters), "bolum sayisi ile unite sayisi farkli")
        for i, ch in enumerate(chapters, 1):
            self.assertEqual(titles[i], ch["title"], f"{slug} {i}. bolum basligi degismis")

    def test_unit_titles_match_the_study_plan(self) -> None:
        self._check("teknik-gelistirim")

    def test_turkish_unit_titles_match_the_study_plan(self) -> None:
        self._check("teknik-gelistirim-tr")


if __name__ == "__main__":
    unittest.main()
