"""coursegraph.graph sorgu katmanı testleri (geçici mini graf üzerinde)."""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from coursegraph.graph import CourseGraph


def _mini_graph() -> dict:
    nodes = [
        {"id": "course:demo", "type": "course", "title": "Demo Ders", "course": "demo",
         "slug": "demo", "summary": "Deneme dersi", "text": "demo dersi deneme"},
        {"id": "chapter:demo:01", "type": "chapter", "title": "Giriş Kavramları", "course": "demo",
         "chapter": 1, "summary": "Kavramlara giriş", "text": "giriş kavramları kavramlara giriş"},
        {"id": "concept:demo:kavram", "type": "concept", "title": "Kavram", "course": "demo",
         "definition": "Denenek kavram tanımı", "text": "kavram denenek tanimi"},
        {"id": "quizq:demo:001", "type": "quiz_question", "title": "Kavram nedir?", "course": "demo",
         "question": "Kavram nedir?", "answer": "Denenek cevap", "text": "kavram nedir"},
        {"id": "unit:demo:1", "type": "unit", "title": "Ünite 1: Giriş", "course": "demo",
         "unit": 1, "text": "unit 1 giris"},
    ]
    edges = [
        {"src": "course:demo", "dst": "chapter:demo:01", "rel": "has_chapter"},
        {"src": "chapter:demo:01", "dst": "concept:demo:kavram", "rel": "mentions_concept"},
        {"src": "course:demo", "dst": "quizq:demo:001", "rel": "has_quiz"},
        {"src": "quizq:demo:001", "dst": "unit:demo:1", "rel": "in_unit"},
    ]
    return {
        "generated_at": "2026-01-01T00:00:00Z",
        "nodes": nodes,
        "edges": edges,
        # build() her düğüm için katlanmış başlıktan bir phrase-key üretir;
        # search() bunu +10 puanla öne alır. Fixture bu sözleşmeyi yansıtır.
        "inverted": {
            "__phr__kavram": ["concept:demo:kavram"],
            "__phr__giris kavramlari": ["chapter:demo:01"],
            "kavram": ["concept:demo:kavram", "chapter:demo:01"],
            "demo": ["course:demo"],
        },
    }


class GraphFixture(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        p = Path(self._tmp.name) / "graph.json"
        p.write_text(json.dumps(_mini_graph(), ensure_ascii=False), encoding="utf-8")
        self.g = CourseGraph(p)

    def tearDown(self) -> None:
        self._tmp.cleanup()


class TestBasics(GraphFixture):
    def test_nodes_loaded(self) -> None:
        self.assertEqual(len(self.g.nodes), 5)
        self.assertIsNotNone(self.g.get("course:demo"))
        self.assertIsNone(self.g.get("yok"))

    def test_stats_counts(self) -> None:
        s = self.g.stats()
        self.assertEqual(s["nodes"], 5)
        self.assertEqual(s["edges"], 4)
        self.assertEqual(s["by_type"]["chapter"], 1)
        self.assertEqual(s["by_rel"]["has_chapter"], 1)

    def test_neighbors_rel_filter_and_direction(self) -> None:
        out = self.g.neighbors("course:demo", rel="has_chapter")
        self.assertEqual([e["dst"] for e in out], ["chapter:demo:01"])
        inc = self.g.neighbors("chapter:demo:01", direction="in")
        self.assertEqual(inc[0]["src"], "course:demo")

    def test_related_nodes_both_directions(self) -> None:
        ids = {n["id"] for n in self.g.related_nodes("chapter:demo:01")}
        self.assertEqual(ids, {"course:demo", "concept:demo:kavram"})


class TestSearch(GraphFixture):
    def test_exact_title_ranks_first(self) -> None:
        hits = self.g.search("Kavram")
        self.assertTrue(hits)
        self.assertEqual(hits[0]["id"], "concept:demo:kavram")

    def test_empty_query_returns_nothing(self) -> None:
        self.assertEqual(self.g.search("   "), [])

    def test_result_fields_present(self) -> None:
        hit = self.g.search("Demo")[0]
        for k in ("id", "type", "title", "course", "score", "snippet"):
            self.assertIn(k, hit)

    def test_limit_respected(self) -> None:
        self.assertLessEqual(len(self.g.search("kavram demo", limit=2)), 2)


class TestExploreAndImpact(GraphFixture):
    def test_explore_returns_context(self) -> None:
        out = self.g.explore("Kavram")
        self.assertEqual(out["query"], "Kavram")
        self.assertTrue(out["hits"])
        self.assertTrue(out["context"])

    def test_explore_no_match_message(self) -> None:
        out = self.g.explore("zzzzqqqq")
        self.assertEqual(out["hits"], [])
        self.assertIn("message", out)

    def test_impact_counts_shape(self) -> None:
        out = self.g.impact("Kavram")
        self.assertEqual(out["term"], "Kavram")
        for k in ("chapters", "concepts", "quiz_questions", "counts"):
            self.assertIn(k, out)


class TestOverviewAndDetail(GraphFixture):
    def test_course_overview_lists_chapters(self) -> None:
        out = self.g.course_overview("demo")
        self.assertNotIn("error", out)
        self.assertEqual(out["chapters"][0]["title"], "Giriş Kavramları")

    def test_course_overview_unknown_slug(self) -> None:
        self.assertIn("error", self.g.course_overview("yok"))

    def test_chapter_detail_concepts(self) -> None:
        out = self.g.chapter_detail("demo", 1)
        self.assertNotIn("error", out)
        self.assertEqual(out["concepts"][0]["term"], "Kavram")

    def test_chapter_detail_unknown(self) -> None:
        self.assertIn("error", self.g.chapter_detail("demo", 99))


class TestMissingIndex(unittest.TestCase):
    def test_missing_graph_raises(self) -> None:
        with self.assertRaises(FileNotFoundError):
            CourseGraph(Path("/nonexistent/graph.json"))


if __name__ == "__main__":
    unittest.main()
