"""generator/scripts/build.py'nin clean() fonksiyonu: NotebookLM atif isaretlerini temizler."""
from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))

spec = importlib.util.spec_from_file_location("build_mod", ROOT / "generator" / "scripts" / "build.py")
build_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build_mod)


class TestClean(unittest.TestCase):
    """clean(): sayisal ve adla atif isaretlerini siler, markdown linki ve referans listesini birakir."""

    def test_numbered_citation_is_dropped(self) -> None:
        self.assertEqual(build_mod.clean("The student learns X [1]."), "The student learns X.")

    def test_a_list_of_numbers_is_dropped(self) -> None:
        self.assertEqual(build_mod.clean("Cite [2, 3] here."), "Cite here.")

    def test_a_range_is_dropped(self) -> None:
        self.assertEqual(build_mod.clean("Range [2-4] here."), "Range here.")

    def test_a_title_citation_is_dropped(self) -> None:
        """NotebookLM bazen kaynak adini atif olarak yazar; o da temizlenmeli."""
        self.assertEqual(
            build_mod.clean("The student learns [Recovering Tables and Table Partitions] here."),
            "The student learns here.")

    def test_several_title_citations_are_dropped(self) -> None:
        self.assertEqual(build_mod.clean("Both [A & B, C] apply."), "Both apply.")

    def test_a_markdown_link_survives(self) -> None:
        self.assertEqual(build_mod.clean("See [the guide](https://example.com)."),
                         "See [the guide](https://example.com).")

    def test_a_single_word_in_brackets_survives(self) -> None:
        self.assertEqual(build_mod.clean("The [CDB] holds."), "The [CDB] holds.")

    def test_the_reference_list_survives(self) -> None:
        self.assertEqual(build_mod.clean("- [1] Oracle Database Concepts"), "- [1] Oracle Database Concepts")

    def test_the_lead_in_is_dropped(self) -> None:
        self.assertEqual(build_mod.clean("Here is what the student learns:\n\nBody."),
                         "Body.")

    def test_an_escaped_product_identifier_becomes_a_dollar(self) -> None:
        """NotebookLM bazen urun tanimlayicisindaki "$" yerine LaTeX kacisi yazar; KaTeX ayraci gibi
        gorunur ve tanimlayiciyi bozar."""
        self.assertEqual(
            build_mod.clean("views V\\\\(CLUSTER_INTERCONNECTS and V\\\\)CONFIGURED_INTERCONNECTS here."),
            "views V$CLUSTER_INTERCONNECTS and V$CONFIGURED_INTERCONNECTS here.")

    def test_an_escaped_container_identifier_becomes_a_dollar(self) -> None:
        self.assertEqual(build_mod.clean("root (CDB\\\\(ROOT) and PDB\\\\)SEED)"),
                         "root (CDB$ROOT) and PDB$SEED)")

    def test_real_latex_survives(self) -> None:
        self.assertEqual(build_mod.clean("the formula \\\\(x^2\\\\) here"),
                         "the formula \\(x^2\\) here")
