"""`scripts/check_chat_corpus.py`: soru-cevap korpusu denetimi."""
from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))


def _load(path, name):
    spec = importlib.util.spec_from_file_location(name, ROOT / path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


check = _load("scripts/check_chat_corpus.py", "check_chat_corpus")

GOOD = {
    "items": [
        {"chapter": 1, "q": "sga_target nedir?", "a": "SGA belleğini yönetir [1]. ASMM ile ayarlanır.", "sources": [{"title": "a", "url": "u"}]},
        {"chapter": 2, "q": "ASM nedir?", "a": "Otomatik depolama yöneticisidir [1]. Disk gruplarını yönetir.", "sources": [{"title": "a", "url": "u"}]},
    ]
}


class TestTheCorpusChecks(unittest.TestCase):
    def test_a_clean_corpus_has_no_findings(self) -> None:
        res = check.check_corpus(GOOD, chapters=2)
        self.assertEqual(res["errors"], [])
        self.assertEqual(res["warnings"], [])
        self.assertEqual(res["items"], 2)

    def test_a_missing_answer_or_source_is_an_error(self) -> None:
        corpus = {"items": [{"chapter": 1, "q": "soru?", "a": "", "sources": []}]}
        res = check.check_corpus(corpus)
        self.assertTrue(any("cevap" in e for e in res["errors"]), res["errors"])
        self.assertTrue(any("kaynak" in e for e in res["errors"]), res["errors"])

    def test_a_citation_outside_the_source_list_is_an_error(self) -> None:
        corpus = {"items": [{"chapter": 1, "q": "soru?", "a": "Cevap [2]. Ikinci cumle.", "sources": [{"title": "a", "url": "u"}]}]}
        res = check.check_corpus(corpus)
        self.assertTrue(any("atif" in e for e in res["errors"]), res["errors"])

    def test_a_repeated_question_is_an_error(self) -> None:
        corpus = {"items": [
            {"chapter": 1, "q": "Aynı soru?", "a": "Bir [1]. Iki.", "sources": [{"title": "a", "url": "u"}]},
            {"chapter": 1, "q": "  aynı   SORU? ", "a": "Bir [1]. Iki.", "sources": [{"title": "a", "url": "u"}]},
        ]}
        res = check.check_corpus(corpus)
        self.assertTrue(any("tekrar" in e for e in res["errors"]), res["errors"])

    def test_a_placeholder_answer_is_an_error(self) -> None:
        corpus = {"items": [{"chapter": 1, "q": "soru?", "a": "Bilmiyorum [1]. Emin degilim.", "sources": [{"title": "a", "url": "u"}]}]}
        res = check.check_corpus(corpus)
        self.assertTrue(any("yer tutucu" in e for e in res["errors"]), res["errors"])

    def test_a_chapter_beyond_the_plan_and_a_long_answer_warn(self) -> None:
        corpus = {"items": [{"chapter": 4, "q": "soru?", "a": "Bir [1]. Iki. Uc. Dort. Bes. Alti.", "sources": [{"title": "a", "url": "u"}]}]}
        res = check.check_corpus(corpus, chapters=3)
        self.assertTrue(any("plan" in e for e in res["errors"]), res["errors"])
        self.assertTrue(any("cumle" in w for w in res["warnings"]), res["warnings"])
        self.assertTrue(any("bolum 1" in w for w in res["warnings"]), res["warnings"])

    def test_cite_numbers_expands_ranges(self) -> None:
        self.assertEqual(check.cite_numbers("X [1, 3] Y [2-4]"), [1, 3, 2, 3, 4])

    def test_the_real_corpora_have_no_errors(self) -> None:
        """Depodaki korpuslar hatasız olmalı (uyarı serbest)."""
        for slug in check.SLUGS:
            corpus, chapters = check.load(slug)
            if corpus is None:
                continue
            res = check.check_corpus(corpus, chapters)
            self.assertEqual(res["errors"], [], f"{slug}: {res['errors'][:3]}")


if __name__ == "__main__":
    unittest.main()
