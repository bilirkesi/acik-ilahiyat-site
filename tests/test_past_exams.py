"""coursegraph.past_exams birim testleri: ünite konfigürasyonu ve soru eşleme."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from coursegraph.past_exams import (
    COURSE_UNIT_CONFIGS,
    classify_unit,
    course_unit_cfg,
    extract_keywords,
    unit_keywords,
    unit_titles,
    unit_to_chapters,
)


class TestUnitConfigs(unittest.TestCase):
    def test_all_four_courses_configured(self) -> None:
        for slug in ("islam-mezhepleri-tarihi", "turk-dili-1", "ataturk-ilkeleri-1", "osmanlica-1"):
            self.assertIn(slug, COURSE_UNIT_CONFIGS)

    def test_unit_titles_counts(self) -> None:
        self.assertEqual(len(unit_titles("islam-mezhepleri-tarihi")), 10)
        self.assertEqual(len(unit_titles("turk-dili-1")), 8)
        self.assertEqual(len(unit_titles("ataturk-ilkeleri-1")), 8)
        self.assertEqual(len(unit_titles("osmanlica-1")), 8)

    def test_unknown_slug_falls_back_to_islam(self) -> None:
        # Geriye uyumluluk: bilinmeyen slug islam konfigürasyonuna düşer
        self.assertEqual(course_unit_cfg("yok-ders"), COURSE_UNIT_CONFIGS["islam-mezhepleri-tarihi"])

    def test_islam_unit3_maps_to_two_chapters(self) -> None:
        self.assertEqual(unit_to_chapters("islam-mezhepleri-tarihi")[3], [3, 4])

    def test_td_units_map_one_to_one(self) -> None:
        self.assertEqual(unit_to_chapters("turk-dili-1"), {i: [i] for i in range(1, 9)})

    def test_every_course_has_keywords_for_each_unit(self) -> None:
        # Not: anahtar kelime listeleri çıkmış vize sınıflandırması içindir; bazı
        # yeni derslerde (osmanlica-1) tüm üniteler henüz covered değil.
        for slug, cfg in COURSE_UNIT_CONFIGS.items():
            kws = unit_keywords(slug)
            for u in kws:
                self.assertIn(u, cfg["titles"], f"{slug} ünite {u} titles'ta yok")
                self.assertTrue(kws[u], f"{slug} ünite {u} anahtar kelime listesi boş")

    def test_islam_has_full_keyword_coverage(self) -> None:
        # İslam mezhepleri (varsayılan) her ünite için anahtar kelime içermeli
        kws = unit_keywords("islam-mezhepleri-tarihi")
        self.assertEqual(set(kws), set(range(1, 11)))


class TestExtractKeywords(unittest.TestCase):
    def test_known_terms_extracted(self) -> None:
        kw = extract_keywords("Mu'tezile mezhebinin kurucusu Vâsıl b. Atâ kimdir?")
        folded = [k.lower() for k in kw]
        self.assertTrue(any("tezile" in k or "tezile" in k.replace("'", "") for k in folded), kw)
        self.assertTrue(any("vâsıl" in k for k in folded), kw)

    def test_stopwords_excluded(self) -> None:
        kw = extract_keywords("Aşağıdakilerden hangisi doğrudur? hangilerinin değildir?")
        self.assertEqual(kw, [])

    def test_max_n_respected(self) -> None:
        stem = " ".join(f"Kelime{i}â{i}" for i in range(12))
        self.assertLessEqual(len(extract_keywords(stem, max_n=3)), 3)

    def test_short_tokens_skipped(self) -> None:
        self.assertEqual(extract_keywords("Ali vefat etti"), [])


class TestClassifyUnit(unittest.TestCase):
    def test_islam_tahkim_maps_to_unit3(self) -> None:
        best, scores = classify_unit(
            "Sıffîn Savaşı sonrası Tahkim Hadisesi'nde Hâriciler ne yaptı?", slug="islam-mezhepleri-tarihi"
        )
        self.assertEqual(best, 3)
        self.assertIn(3, scores)

    def test_no_keywords_returns_none(self) -> None:
        best, scores = classify_unit("xyzabc qqqwww zzzrrr")
        self.assertIsNone(best)
        self.assertEqual(scores, {})

    def test_stem_weighted_over_options(self) -> None:
        # Stem'de ünite 1 anahtarı, seçeneklerde ünite 2 anahtarı → stem kazanmalı
        best, _ = classify_unit(
            "Lale Devri ıslahatçılarından Katip Çelebi'nin eseri nedir?",
            options_text="montrö boğazlar sözleşmesi imzalandı",
            slug="ataturk-ilkeleri-1",
        )
        self.assertEqual(best, 1)


if __name__ == "__main__":
    unittest.main()
