"""scripts/check_quiz_answers.py testleri: denetçi mantığı + gerçek veri bütünlüğü.

scripts/ bir paket olmadığı için modül dosya yolundan import edilir.
"""
from __future__ import annotations

import importlib.util
import sys
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _load_checker():
    spec = importlib.util.spec_from_file_location(
        "check_quiz_answers", ROOT / "scripts" / "check_quiz_answers.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


chk = _load_checker()


def _q(stem: str, opts: list[tuple[str, bool]], qtype: str = "multiple_choice") -> dict:
    return {
        "question": stem,
        "answerOptions": [{"text": t, "isCorrect": c} for t, c in opts],
        "type": qtype,
    }


class TestCheckQuestions(unittest.TestCase):
    """check_questions(): sentinel/sentetik vakalar."""

    def _run(self, questions):
        problems: list[str] = []
        dupes = chk.check_questions(questions, "test", problems)
        return problems, dupes

    def test_valid_question_passes(self) -> None:
        problems, dupes = self._run([_q("Soru?", [("A", True), ("B", False)])])
        self.assertEqual(problems, [])
        self.assertEqual(dupes, Counter())

    def test_zero_correct_flagged(self) -> None:
        problems, _ = self._run([_q("Soru?", [("A", False), ("B", False)])])
        self.assertTrue(any("0 doğru şık" in p for p in problems), problems)

    def test_two_correct_flagged(self) -> None:
        problems, _ = self._run([_q("Soru?", [("A", True), ("B", True)])])
        self.assertTrue(any("2 doğru şık" in p for p in problems), problems)

    def test_empty_stem_flagged(self) -> None:
        problems, _ = self._run([_q("   ", [("A", True)])])
        self.assertTrue(any("soru metni boş" in p for p in problems), problems)

    def test_duplicate_option_text_flagged(self) -> None:
        problems, _ = self._run([_q("Soru?", [("A", True), ("A", False)])])
        self.assertTrue(any("yinelenen şık" in p for p in problems), problems)

    def test_empty_option_text_flagged(self) -> None:
        problems, _ = self._run([_q("Soru?", [("", True), ("B", False)])])
        self.assertTrue(any("boş şık metni" in p for p in problems), problems)

    def test_unknown_type_flagged(self) -> None:
        problems, _ = self._run([_q("Soru?", [("A", True)], qtype="acik_ufuk")])
        self.assertTrue(any("bilinmeyen type" in p for p in problems), problems)

    def test_duplicate_stems_counted_not_problemed(self) -> None:
        same = _q("Aynı soru?", [("A", True)])
        problems, dupes = self._run([same, dict(same)])
        self.assertEqual(problems, [])
        self.assertTrue(dupes, "yinelenen soru stem'i dupes'e düşmeli")

    def test_osmanlic_options_not_false_positive(self) -> None:
        # Şedde/şerif farkı taşıyan Osmanlıca şıklar yinelenmemeli
        problems, _ = self._run(
            [_q("Soru?", [("mütefâ‘il", True), ("mütefa‘‘il", False)])]
        )
        self.assertEqual(problems, [], problems)

    def test_options_key_fallback(self) -> None:
        # Bazı sınav dosyaları "options" + "text" kullanır
        q = {"stem": "Soru?", "options": [{"text": "A", "isCorrect": True}]}
        problems, _ = self._run([q])
        self.assertEqual(problems, [])


class TestRealDataIntegrity(unittest.TestCase):
    """Depodaki tüm quiz JSON'ları denetçiden geçmeli."""

    def test_main_returns_zero(self) -> None:
        self.assertEqual(chk.main(), 0)

    def test_all_quiz_files_have_questions(self) -> None:
        files = sorted((ROOT / "data").glob("*/unit_quizzes/unit-*.json"))
        files += sorted((ROOT / "data").glob("*/quiz.json"))
        self.assertGreater(len(files), 0)
        for f in files:
            import json

            data = json.loads(f.read_text(encoding="utf-8-sig"))
            qs = data.get("questions") if isinstance(data, dict) else data
            self.assertTrue(qs, f"{f} boş")

    def test_site_bundle_matches_data(self) -> None:
        """site/unit_quizzes.js her ünite quiz'ini içermeli."""
        import json
        import re

        bundle = (ROOT / "site" / "unit_quizzes.js").read_text(encoding="utf-8")
        m = re.match(r"window\.UNIT_QUIZZES = (.*);\s*$", bundle, re.S)
        self.assertIsNotNone(m, "UNIT_QUIZZES tanımı okunamadı")
        b = json.loads(m.group(1))
        for slug_dir in sorted((ROOT / "data").glob("*/unit_quizzes")):
            slug = slug_dir.parent.name
            n_disk = len(list(slug_dir.glob("unit-*.json")))
            self.assertIn(slug, b, f"{slug} bundle'da yok")
            self.assertEqual(len(b[slug]), n_disk, f"{slug} ünite sayısı tutarsız")


if __name__ == "__main__":
    unittest.main()
