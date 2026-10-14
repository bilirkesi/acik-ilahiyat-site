"""Export script'lerinin saf fonksiyonları + site bundle sözleşmesi testleri."""
from __future__ import annotations

import importlib.util
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _load(name: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


pe = _load("export_past_exams_site")
uq = _load("export_unit_quizzes_site")


class TestChapterMeta(unittest.TestCase):
    def setUp(self) -> None:
        self.plan = {
            "chapters": [
                {"title": "Birinci Bölüm", "summary": "Özet metni."},
                {"title": "İkinci Bölüm", "summary": "x" * 400},
            ]
        }

    def test_in_range(self) -> None:
        m = pe.chapter_meta(self.plan, 1)
        self.assertEqual(m, {"n": 1, "title": "Birinci Bölüm", "summary": "Özet metni."})

    def test_out_of_range_defaults(self) -> None:
        m = pe.chapter_meta(self.plan, 99)
        self.assertEqual(m["title"], "Bölüm 99")
        self.assertEqual(m["summary"], "")

    def test_long_summary_truncated(self) -> None:
        m = pe.chapter_meta(self.plan, 2)
        self.assertLessEqual(len(m["summary"]), 280)
        self.assertTrue(m["summary"].endswith("..."))


class TestBuildSolution(unittest.TestCase):
    def test_contains_correct_answer(self) -> None:
        s = pe.build_solution(
            {"correct": "A"}, {"key": "A", "text": "Doğru Şık"}, None, []
        )
        self.assertIn("Doğru cevap: A) Doğru Şık", s)

    def test_includes_unit_and_chapters(self) -> None:
        s = pe.build_solution(
            {"correct": "B"},
            {"key": "B", "text": "Cevap"},
            "Ünite Başlığı",
            [{"n": 1, "title": "Bölüm 1", "summary": "Özet burada."}],
        )
        self.assertIn("Konu ünitesi: Ünite Başlığı.", s)
        self.assertIn("İlgili ders bölümleri: 1. Bölüm 1.", s)
        self.assertIn("Özet burada.", s)


class TestExportUnitQuizzes(unittest.TestCase):
    """uq.main(): ROOT/SLUGS modül seviyesinde değiştirilebilir → izole tmp test."""

    def test_main_writes_valid_bundle(self) -> None:
        import tempfile

        with tempfile.TemporaryDirectory() as td:
            troot = Path(td)
            qdir = troot / "data" / "demo-course" / "unit_quizzes"
            qdir.mkdir(parents=True)
            (qdir / "unit-1.json").write_text(
                json.dumps(
                    {
                        "unit": 1,
                        "unitTitle": "Ünite 1",
                        "questions": [
                            {
                                "question": "Soru?",
                                "answerOptions": [
                                    {"text": "A", "isCorrect": True},
                                    {"text": "B", "isCorrect": False},
                                ],
                            }
                        ],
                    },
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            old_root, old_slugs = uq.ROOT, uq.SLUGS
            uq.ROOT, uq.SLUGS = troot, ["demo-course"]
            try:
                rc = uq.main()
            finally:
                uq.ROOT, uq.SLUGS = old_root, old_slugs

            self.assertEqual(rc, 0)
            out = (troot / "site" / "unit_quizzes.js").read_text(encoding="utf-8")
            m = re.match(r"window\.UNIT_QUIZZES = (.*);\s*$", out, re.S)
            self.assertIsNotNone(m)
            payload = json.loads(m.group(1))
            self.assertEqual(payload["demo-course"]["1"]["unitTitle"], "Ünite 1")
            self.assertEqual(len(payload["demo-course"]["1"]["questions"]), 1)

    def test_slugs_cover_all_courses(self) -> None:
        courses = json.loads((ROOT / "courses.json").read_text(encoding="utf-8"))
        self.assertEqual(set(uq.SLUGS), set(courses))


class TestSiteBundleContracts(unittest.TestCase):
    def test_past_exams_bundle_parses(self) -> None:
        raw = (ROOT / "site" / "past_exams.js").read_text(encoding="utf-8")
        m = re.match(r"window\.PAST_EXAMS = (.*);\s*$", raw, re.S)
        self.assertIsNotNone(m)
        data = json.loads(m.group(1))
        self.assertIsInstance(data, dict)
        for slug, exams in data.items():
            for e in exams:
                self.assertIn("exam_id", e)
                self.assertIn("questions", e)
                for q in e["questions"]:
                    self.assertIn("stem", q)
                    self.assertIsInstance(q.get("options"), list)

    def test_unit_quizzes_bundle_parses(self) -> None:
        raw = (ROOT / "site" / "unit_quizzes.js").read_text(encoding="utf-8")
        m = re.match(r"window\.UNIT_QUIZZES = (.*);\s*$", raw, re.S)
        self.assertIsNotNone(m)
        data = json.loads(m.group(1))
        for slug, units in data.items():
            for ukey, u in units.items():
                self.assertIn("questions", u)
                self.assertGreater(len(u["questions"]), 0, f"{slug} ünite {ukey} boş")


if __name__ == "__main__":
    unittest.main()
