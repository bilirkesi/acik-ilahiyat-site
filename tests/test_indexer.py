"""coursegraph.indexer birim testleri: fold, tokenize, GraphBuilder."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from coursegraph.indexer import GraphBuilder, fold, tokenize


class TestFold(unittest.TestCase):
    def test_turkish_lowercasing(self) -> None:
        self.assertEqual(fold("Türkçe ŞeKÂYET İlahiyat"), "turkce sekayet ilahiyat")

    def test_dotless_i_and_dotted_capital_i(self) -> None:
        # ı -> i, İ -> i; aksi halde arama "ışık"/"İlahiyat" için kırılır
        self.assertEqual(fold("Irkçılık"), "irkcilik")
        self.assertEqual(fold("İstanbul"), "istanbul")

    def test_translate_table_circumflex(self) -> None:
        # fold maketrans tablosu â/î/û harflerini i/i/u'ya eşler (NFD öncesi)
        self.assertEqual(fold("Mâbed"), "mibed")
        self.assertEqual(fold("Hâlid"), "hilid")

    def test_combining_marks_stripped(self) -> None:
        # Tabloda olmayan aksanlı harfler NFD ile soyulur (é→e, ā→a)
        self.assertEqual(fold("café"), "cafe")
        self.assertEqual(fold("kâr"), "kir")  # â tabloda i'ye eşlenir

    def test_arabic_script_preserved(self) -> None:
        # Osmanlıca Arap harfleri silinmemeli (arama bunları da kapsar)
        self.assertEqual(fold("ط - ت"), "ط - ت")

    def test_non_string_input(self) -> None:
        self.assertEqual(fold(123), "123")


class TestTokenize(unittest.TestCase):
    def test_splits_on_non_alnum(self) -> None:
        self.assertEqual(tokenize("Misak-ı Millî 1920!"), ["misak", "i", "milli", "1920"])

    def test_empty_and_punctuation_only(self) -> None:
        self.assertEqual(tokenize(""), [])
        self.assertEqual(tokenize("?!..."), [])


class TestGraphBuilder(unittest.TestCase):
    def test_node_upsert_merges_properties(self) -> None:
        g = GraphBuilder()
        g.node("a", "course", "Ders", slug="x")
        g.node("a", "course", "Ders", level=1)  # aynı id: günceller, kopyalamaz
        self.assertEqual(len(g.nodes), 1)
        self.assertEqual(g.nodes["a"]["slug"], "x")
        self.assertEqual(g.nodes["a"]["level"], 1)

    def test_duplicate_edges_deduped(self) -> None:
        g = GraphBuilder()
        g.node("a", "t", "A")
        g.node("b", "t", "B")
        g.edge("a", "b", "rel")
        g.edge("a", "b", "rel")  # tekrar: atlanmalı
        g.edge("a", "b", "other")  # farklı rel: kalmalı
        self.assertEqual(len(g.edges), 2)

    def test_to_dict_shape(self) -> None:
        g = GraphBuilder()
        g.node("a", "t", "A")
        d = g.to_dict()
        self.assertEqual(d["version"], 1)
        self.assertIn("generated_at", d)
        self.assertEqual(len(d["nodes"]), 1)
        self.assertIsInstance(d["edges"], list)


if __name__ == "__main__":
    unittest.main()
