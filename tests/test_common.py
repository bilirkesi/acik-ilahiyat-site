"""generator/scripts/common.py ve quiz_types.py testleri: pipeline kilidi + soru tipi sözleşmesi.

generator/scripts/ bir paket değil; modüller sys.path'e eklenerek import edilir.
"""
from __future__ import annotations

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


if __name__ == "__main__":
    unittest.main()
