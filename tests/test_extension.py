"""The NotebookLM study app Chrome extension.

It must ask for no permission it does not need, ship no remote code, keep its generated app shell
identical to `scripts/build_study_app.py`, and render the same page from `core.js` as the builder
writes. The popup and the page capture need a real Chrome, so they are checked for syntax only.
"""
import importlib.util
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXT = ROOT / "extensions" / "notebooklm-study-app"
sys.path.insert(0, str(ROOT / "scripts"))


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


builder = load(ROOT / "scripts" / "build_study_app.py", "_b")
exporter = load(ROOT / "scripts" / "export_app_shell.py", "_e")
NODE = shutil.which("node")


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")


def fixture(tmp):
    root = Path(tmp)
    write(root / "university.json", {"name": "Test Üniversitesi", "shortName": "Test", "passMark": 70,
                                     "language": "Turkish", "storageKey": "test-key",
                                     "colors": {"primary": "#1b2a4a", "accent": "#b08d4a", "paper": "#f8f4ea"}})
    write(root / "courses.json", {"x": {"subject": "Türk Dili", "course": "TÜR201U - Türk Dili I",
                                        "config": {"language": "Turkish"}}})
    data = root / "data" / "x"
    write(data / "state.json", {"sources": {"k1": {"id": "s1", "title": "Kitap.pdf", "type": "book",
                                                   "status": "ready", "url": ""}},
                                "order": ["k1"]})
    write(data / "study_plan.json", {"chapters": [
        {"title": "Dil ve Kültür", "summary": "Dilin toplumla ilişkisi.", "objectives": ["Dilin işlevi."],
         "source_ids": ["s1"], "grounding": {"answer": "## Giriş\nDil kültürü taşır [1].\n- Altay dilleri"}},
    ]})
    return root


def strip_data(page):
    """The page without its JSON block: that block's whitespace differs between Python and JS."""
    return re.sub(r'(<script id="app-data" type="application/json">).*?(</script>)',
                  r"\1<DATA>\2", page, flags=re.S)


class ManifestTest(unittest.TestCase):
    def setUp(self):
        self.manifest = json.loads((EXT / "manifest.json").read_text(encoding="utf-8"))

    def test_is_manifest_v3_with_the_popup(self):
        self.assertEqual(self.manifest["manifest_version"], 3)
        self.assertTrue((EXT / self.manifest["action"]["default_popup"]).is_file())
        self.assertEqual(self.manifest["version"], "1.0.0")

    def test_asks_only_for_what_it_uses(self):
        self.assertEqual(sorted(self.manifest["permissions"]), ["activeTab", "scripting"])
        self.assertEqual(sorted(self.manifest["host_permissions"]),
                         ["https://notebook.google.com/*", "https://notebooklm.google.com/*"])
        self.assertNotIn("background", self.manifest)
        self.assertNotIn("content_scripts", self.manifest)

    def test_every_file_it_names_exists(self):
        page = (EXT / "popup.html").read_text(encoding="utf-8")
        for name in re.findall(r'(?:src|href)="([^"]+)"', page):
            self.assertTrue((EXT / name).is_file(), name)


class ShellTest(unittest.TestCase):
    def test_generated_app_shell_matches_the_builder(self):
        on_disk = (EXT / "app-shell.js").read_text(encoding="utf-8")
        self.assertEqual(on_disk, exporter.shell_text(),
                         "app-shell.js is stale: run py -3 scripts/export_app_shell.py")

    def test_shell_carries_the_three_pieces(self):
        shell = json.loads((EXT / "app-shell.js").read_text(encoding="utf-8").split("=", 1)[1].rstrip(";\n"))
        for key in ("css", "html", "js"):
            self.assertEqual(shell[key], getattr(builder, "CSS" if key == "css" else
                                                 "HTML" if key == "html" else "JS"))


class NoRemoteCodeTest(unittest.TestCase):
    def test_extension_files_load_nothing_from_the_network(self):
        for name in ("popup.html", "popup.js", "core.js", "capture.js"):
            text = (EXT / name).read_text(encoding="utf-8")
            self.assertNotRegex(text, r'(?:src|href)="https?://', name)
            self.assertNotIn("eval(", text, name)
            self.assertNotIn("new Function(", text, name)

    def test_manifest_allows_no_other_host(self):
        text = (EXT / "manifest.json").read_text(encoding="utf-8")
        self.assertNotIn("gist.githubusercontent", text)
        self.assertNotIn("<all_urls>", text)


@unittest.skipUnless(NODE, "node is not on PATH")
class CoreTest(unittest.TestCase):
    def run_node(self, source, *args):
        with tempfile.TemporaryDirectory() as tmp:
            harness = Path(tmp) / "harness.js"
            harness.write_text(source, encoding="utf-8")
            out = Path(tmp) / "out.txt"
            proc = subprocess.run([NODE, str(harness), str(EXT / "core.js"), str(EXT / "app-shell.js"),
                                   *args, str(out)], capture_output=True, text=True, timeout=60)
            self.assertEqual(proc.returncode, 0, proc.stderr)
            return out.read_text(encoding="utf-8") if out.exists() else proc.stdout

    def test_core_builds_the_payload_from_typed_fields(self):
        script = """
const fs = require("fs");
require(process.argv[2]);
const core = globalThis.NLMApp;
const payload = core.buildPayload({
  title: "İslam Mezhepleri Tarihi",
  sourcesText: "Kitap.pdf\\nÜnite 1 | https://www.youtube.com/watch?v=abc\\nKitap.pdf",
  notesText: "Giriş\\n## Tanım\\nMezhep bir yorumdur [2].\\n- Fırka\\n---\\nİkinci not\\nKısa gövde."
});
console.log(JSON.stringify({p: payload, slug: core.slugify("İslam Mezhepleri Tarihi!")}));
"""
        data = json.loads(self.run_node(script))
        payload = data["p"]
        self.assertEqual(payload["course"]["title"], "İslam Mezhepleri Tarihi")
        self.assertEqual(data["slug"], "islam-mezhepleri-tarihi")
        self.assertEqual(payload["counts"]["chapters"], 2)
        self.assertEqual([s["title"] for s in payload["sources"]], ["Kitap.pdf", "Ünite 1"])
        self.assertEqual(payload["chapters"][0]["notes"][0], {"h": "Tanım"})
        self.assertEqual(payload["chapters"][0]["notes"][1], {"p": "Mezhep bir yorumdur."})
        self.assertEqual(payload["chapters"][0]["notes"][2], {"li": "Fırka"})
        self.assertEqual(payload["lang"], "tr")

    def test_core_reads_the_pipeline_json(self):
        script = """
require(process.argv[2]);
const core = globalThis.NLMApp;
const payload = core.buildPayload({
  title: "Test", notesText: "",
  plan: {chapters: [{title: "Bölüm", summary: "s", objectives: ["o"], grounding: {answer: "Metin"}}]},
  quiz: {questions: [{question: "Soru?", answerOptions: [{text: "Doğru", isCorrect: true, rationale: "Çünkü"},
                                                        {text: "Yanlış", isCorrect: false}]}]},
  cards: {cards: [{chapter: 1, chapterTitle: "Bölüm", front: "Ön", back: "Arka"}]}
});
console.log(JSON.stringify(payload));
"""
        payload = json.loads(self.run_node(script))
        self.assertEqual(payload["counts"], {"chapters": 1, "cards": 1, "quiz": 1})
        self.assertEqual(payload["quiz"][0]["o"][0], {"t": "Doğru", "ok": True, "why": "Çünkü"})
        self.assertEqual(payload["cards"][0]["back"], "Arka")
        self.assertEqual(payload["chapters"][0]["notes"], [{"p": "Metin"}])

    def test_core_keeps_the_question_types(self):
        """Boşluk doldurma ve çoktan seçmeli sorular cevaplarıyla taşınır (canlı EDBO defteri)."""
        script = """
require(process.argv[2]);
const payload = globalThis.NLMApp.buildPayload({
  title: "T", notesText: "",
  quiz: {questions: [
    {type: "fill_in_the_blank", question: "Soru ___", bestAnswer: "v$backup_set"},
    {type: "multiple_select", question: "Hangileri?", answerOptions: [
      {text: "a", isCorrect: true}, {text: "b", isCorrect: true}, {text: "c", isCorrect: false}]}
  ]}
});
console.log(JSON.stringify(payload.quiz));
"""
        quiz = json.loads(self.run_node(script))
        self.assertEqual(quiz[0]["type"], "fill_in_the_blank")
        self.assertEqual(quiz[0]["a"], "v$backup_set")
        self.assertEqual(quiz[1]["type"], "multiple_select")
        self.assertEqual(sum(1 for o in quiz[1]["o"] if o["ok"]), 2)

    def test_an_unparsed_answer_cannot_close_the_data_script(self):
        script = """
require(process.argv[2]);
require(process.argv[3]);
const payload = globalThis.NLMApp.buildPayload({
  title: "T", sourcesText: "", notesText: "Not\\nBitiş </script><b>x</b>"
});
console.log(globalThis.NLMApp.renderPage(payload, globalThis.STUDY_SHELL));
"""
        page = self.run_node(script)
        self.assertEqual(page.count("</script>"), 2)
        self.assertIn("\\u003c/script", page)

    def test_core_renders_the_same_page_as_the_builder(self):
        script = """
const fs = require("fs");
require(process.argv[2]);
require(process.argv[3]);
const payload = JSON.parse(fs.readFileSync(process.argv[4], "utf8"));
fs.writeFileSync(process.argv[5], globalThis.NLMApp.renderPage(payload, globalThis.STUDY_SHELL));
"""
        with tempfile.TemporaryDirectory() as tmp:
            payload = builder.course_app(fixture(tmp), "x")
            self.assertIsNotNone(payload)
            src = Path(tmp) / "payload.json"
            src.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
            page = self.run_node(script, str(src))
        self.assertEqual(strip_data(page), strip_data(builder.render_app(payload)))

    def test_popup_and_capture_parse(self):
        for name in ("popup.js", "capture.js", "core.js"):
            proc = subprocess.run([NODE, "--check", str(EXT / name)], capture_output=True, text=True)
            self.assertEqual(proc.returncode, 0, name + ": " + proc.stderr)


if __name__ == "__main__":
    unittest.main()
