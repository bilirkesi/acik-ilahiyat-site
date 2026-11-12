"""Marka: ad, amblem ve notlarin ogrenciye hitap bicimi."""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "generator" / "site-template" / "app.js"
CREST = ROOT / "generator" / "site-template" / "crest.svg"
FAVICON = ROOT / "generator" / "site-template" / "favicon.svg"
ICONS = ROOT / "generator" / "site-template" / "icons"


def numbers(text):
    """SVG/JS icindeki sayilar: sirayla, tek ondalik (adresler ve renkler haric)."""
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"#[0-9a-fA-F]{3,8}\b", "", text)
    return [round(float(x), 1) for x in re.findall(r"-?\d+\.?\d*", text)]


def body_of(text):
    """<svg ...> acilis etiketini at: viewBox sayilari karsilastirmaya girmez."""
    return re.sub(r"<svg\b[^>]*>", "", text)


class TestBrandName(unittest.TestCase):
    """Marka adi university.json'da; depoda tek yerde tutulur."""

    def setUp(self) -> None:
        self.uni = json.loads((ROOT / "university.json").read_text(encoding="utf-8-sig"))
        self.unis = json.loads((ROOT / "universities.json").read_text(encoding="utf-8-sig"))

    def test_the_platform_is_named_acik_akademi(self) -> None:
        self.assertEqual(self.uni["name"], "Açık Akademi")
        self.assertEqual(self.uni["shortName"], "Açık Akademi")
        self.assertEqual(self.uni["issuer"], "Açık Akademi")
        self.assertEqual(self.uni["codePrefix"], "AAK")

    def test_the_registry_entry_matches(self) -> None:
        self.assertEqual(self.unis["aiu"]["name"], "Açık Akademi")
        self.assertEqual(self.unis["aiu"]["short"], "AAK")

    def test_the_storage_key_is_unchanged(self) -> None:
        """Yerel ilerleme anahtari adla degismemeli; ogrencilerin ilerlemesi korunur."""
        self.assertEqual(self.uni["storageKey"], "a-k-i-lahiyat-niversitesi")

    def test_the_old_name_is_gone_from_the_sources(self) -> None:
        files = ["university.json", "universities.json", "README.md", "AGENTS.md",
                 "generator/site-template/app.js", "generator/site-template/index.html",
                 "scripts/export_okf.py", "coursegraph/server.py"]
        for rel in files:
            text = (ROOT / rel).read_text(encoding="utf-8-sig")
            self.assertNotIn("Açık İlahiyat", text, rel)


class TestBrandEmblem(unittest.TestCase):
    """Amblem tek bir kaynaktan uretilir: favicon, crest ve PWA ikonlari."""

    def test_the_crest_and_the_favicon_use_the_same_geometry(self) -> None:
        self.assertTrue(CREST.exists())
        self.assertTrue(FAVICON.exists())
        crest = numbers(body_of(CREST.read_text(encoding="utf-8")))
        favicon = numbers(body_of(FAVICON.read_text(encoding="utf-8")))
        # favicon kare: ayni amblem, farkli cerceve.
        self.assertEqual(favicon[:6], [50.0, 50.0, 46.5, 50.0, 37.0, 17.0])
        self.assertEqual(crest[:6], favicon[:6])

    def test_the_crest_in_the_app_matches_the_crest_file(self) -> None:
        """app.js'teki arma, crest.svg ile ayni koordinatlari kullanir."""
        app = APP.read_text(encoding="utf-8")
        m = re.search(r"function crest\(\).*?\n  \}", app, re.S)
        self.assertIsNotNone(m, "crest() bulunamadi")
        body = m.group(0)
        body = body[:body.index("</svg>")]
        app_numbers = numbers(body_of(body))
        crest_numbers = numbers(body_of(CREST.read_text(encoding="utf-8")))
        self.assertEqual(app_numbers, crest_numbers)

    def test_the_pwa_icons_exist(self) -> None:
        for name in ("icon-192.png", "icon-512.png", "icon-maskable-512.png",
                     "apple-touch-icon.png"):
            self.assertTrue((ICONS / name).exists(), name)


class TestLearnerWording(unittest.TestCase):
    """Notlar ogrenciye hitap etmez; tarihsel anlam tasiyan kullanimlar korunur."""

    LEARNER_PATTERNS = ("The student ", "Öğrenci, ", "öğrencinin ne öğrendiği",
                        "The student can ", "Students also ", "Additionally, students ")

    def test_the_notes_do_not_address_the_learner(self) -> None:
        for slug in ("teknik-gelistirim", "teknik-gelistirim-tr", "turk-dili-1",
                     "islam-mezhepleri-tarihi", "ataturk-ilkeleri-1", "osmanlica-1"):
            path = ROOT / "data" / slug / "study_plan.json"
            if not path.exists():
                continue
            plan = json.loads(path.read_text(encoding="utf-8-sig"))
            text = json.dumps(plan, ensure_ascii=False)
            for pattern in self.LEARNER_PATTERNS:
                self.assertNotIn(pattern, text, f"{slug}: {pattern}")

    def test_the_historical_use_survives(self) -> None:
        """Ebû Hanife'nin ogrencileri bir tarihsel olgudur; degistirilmez."""
        path = ROOT / "data" / "islam-mezhepleri-tarihi" / "study_plan.json"
        text = path.read_text(encoding="utf-8-sig")
        self.assertIn("öğrencileri", text)

    def test_the_chat_corpus_does_not_address_the_learner(self) -> None:
        """Soru-cevap korpusu da okura "ogrenci" diye hitap etmez."""
        for slug in ("teknik-gelistirim", "teknik-gelistirim-tr", "turk-dili-1",
                     "islam-mezhepleri-tarihi", "ataturk-ilkeleri-1", "osmanlica-1"):
            path = ROOT / "data" / slug / "chat.json"
            if not path.exists():
                continue
            corpus = json.loads(path.read_text(encoding="utf-8-sig"))
            for item in corpus.get("items", []):
                text = (item.get("q") or "") + " " + (item.get("a") or "")
                for pattern in ("öğrencinin dikkat", "öğrencinin ne", "Öğrenci, ",
                                "The student ", "Öğrencinin "):
                    self.assertNotIn(pattern, text, f"{slug}: {pattern}")


if __name__ == "__main__":
    unittest.main()
