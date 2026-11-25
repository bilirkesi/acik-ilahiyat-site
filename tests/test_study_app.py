"""The standalone study app and the flashcard parser behind it.

`scripts/build_study_app.py` turns one course's pipeline data into a single HTML file; the checks
here pin what that file may contain (no external asset, no script break-out) and what it must show.
"""
import importlib.util
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))


def load(name, folder="scripts"):
    spec = importlib.util.spec_from_file_location(f"_{name}", ROOT / folder / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


app = load("build_study_app")


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")


def fixture(tmp, *, plan=True, quiz=True, flashcards=True, chat=True, rich_quiz=False):
    """A minimal project folder the builder can read."""
    root = Path(tmp)
    write(root / "university.json", {"name": "Test Üniversitesi", "shortName": "Test",
                                     "tagline": "Ücretsiz dersler", "passMark": 70,
                                     "language": "Turkish", "storageKey": "test-key",
                                     "siteUrl": "https://example.org/",
                                     "colors": {"primary": "#1b2a4a", "accent": "#b08d4a", "paper": "#f8f4ea"}})
    write(root / "courses.json", {"x": {"subject": "Türk Dili", "course": "TÜR201U - Türk Dili I",
                                        "config": {"language": "Turkish"}}})
    data = root / "data" / "x"
    # `sources` is keyed by a local key and `order` lists those keys, not the ids: that is how the
    # Ottoman Turkish course stores a book split into chapters.
    write(data / "state.json", {"sources": {
        "kitap-1": {"id": "s1", "title": "Kitap.pdf", "type": "book", "status": "ready", "url": ""},
        "video-1": {"id": "s2", "title": "Ünite 1 videosu", "type": "youtube", "status": "ready",
                    "url": "https://www.youtube.com/watch?v=abc"},
        "bozuk-1": {"id": "s3", "title": "Bozuk kaynak", "type": "youtube", "status": "error", "url": ""},
    }, "order": ["kitap-1", "video-1", "bozuk-1"]})
    if plan:
        write(data / "study_plan.json", {"chapters": [
            {"title": "Dil ve Kültür", "summary": "Dilin toplumla ilişkisi.",
             "objectives": ["Dilin işlevini açıklar."],
             "source_ids": ["s1", "s2"],
             "grounding": {"answer": "## Giriş\nDil kültürü taşır [1].\n- Altay dilleri\n- Ural dilleri\n\n"
                                      "Kapanış cümlesi.\nBitiş </script><b>x</b>"}},
            {"title": "Yazı Sistemleri", "summary": "Alfabeler.", "objectives": [], "source_ids": [],
             "grounding": {"answer": "İkinci bölümün notu."}},
        ]})
    if quiz:
        questions = [
            {"type": "multiple_choice", "question": "Dil nedir?", "answerOptions": [
                {"text": "Bir iletişim dizgesi", "isCorrect": True, "rationale": "Tanım budur."},
                {"text": "Bir yazı tipi", "isCorrect": False, "rationale": ""}]},
        ]
        if rich_quiz:  # NotebookLM'in boşluk doldurma / çoktan seçmeli / kısa cevap tipleri
            questions += [
                {"type": "fill_in_the_blank", "question": "Dil ___ ile aktarılır.",
                 "bestAnswer": "söz", "acceptableAnswers": ["söz"], "rationale": "Sözlü kültür."},
                {"type": "multiple_select", "question": "Hangileri dil becerisidir?",
                 "answerOptions": [{"text": "Konuşma", "isCorrect": True},
                                   {"text": "Yazma", "isCorrect": True},
                                   {"text": "Yüzme", "isCorrect": False}]},
                {"type": "short_answer", "question": "Lehçe nedir?",
                 "grading": {"modelAnswer": "Bir dilin büyük kollarından her biri."}},
            ]
        write(data / "quiz.json", {"title": "Test", "questions": questions})
        write(data / "unit_quizzes" / "unit-1.json", {"unit": 1, "unitTitle": "Dil", "questions": [
            {"question": "Kültür nedir?", "answerOptions": [
                {"text": "Aktarılan birikim", "isCorrect": True, "rationale": ""},
                {"text": "Bir alfabe", "isCorrect": False, "rationale": ""}]},
        ]})
    if flashcards:
        write(data / "flashcards.json", {"cards": [
            {"chapter": 1, "chapterTitle": "Dil ve Kültür", "front": "Dil nedir?",
             "back": "İnsanların anlaşmak için kullandığı dizge."}]})
    if chat:
        write(data / "chat.json", {"items": [
            {"chapter": 1, "chapterTitle": "Dil ve Kültür", "q": "Argo nedir?",
             "a": "Prestiji düşük özel dil tutumu.", "sources": []}]})
    return root


def embedded(page):
    """The JSON the page ships in its data script."""
    raw = re.search(r'<script id="app-data" type="application/json">(.*?)</script>', page, re.S).group(1)
    return json.loads(raw.replace("\\u003c", "<"))


class StudyAppTest(unittest.TestCase):
    def build(self, **kw):
        with tempfile.TemporaryDirectory() as tmp:
            root = fixture(tmp, **kw)
            dest = app.build_app(root, "x")
            self.assertIsNotNone(dest)
            return dest.read_text(encoding="utf-8"), dest

    def test_writes_one_self_contained_html_file(self):
        page, dest = self.build()
        self.assertEqual(dest.name, "x.html")
        self.assertIn("<!doctype html>", page)
        self.assertIn('lang="tr"', page)
        self.assertNotIn("<link ", page)
        self.assertNotIn('src="http', page)
        self.assertNotIn('href="http', page.replace('href="https://www.youtube.com/watch?v=abc"', ""))

    def test_carries_the_course_plan_questions_and_cards(self):
        page, _ = self.build()
        data = embedded(page)
        self.assertEqual(data["course"]["title"], "TÜR201U - Türk Dili I")
        self.assertEqual(data["counts"], {"chapters": 2, "cards": 1, "quiz": 2, "sources": 2})
        self.assertEqual(data["quiz"][0]["o"][0]["ok"], True)
        self.assertEqual(data["cards"][0]["front"], "Dil nedir?")
        self.assertEqual([s["title"] for s in data["sources"]], ["Kitap.pdf", "Ünite 1 videosu"])
        self.assertIn("Dil nedir?", page)
        self.assertIn("Kültür nedir?", page)

    def test_notes_are_structured_and_citations_dropped(self):
        page, _ = self.build()
        notes = embedded(page)["chapters"][0]["notes"]
        self.assertEqual(notes[0], {"h": "Giriş"})
        self.assertEqual(notes[1], {"p": "Dil kültürü taşır."})
        self.assertEqual(notes[2], {"li": "Altay dilleri"})
        self.assertNotIn("[1]", json.dumps(embedded(page), ensure_ascii=False))

    def test_a_note_cannot_close_the_data_script(self):
        page, _ = self.build()
        self.assertEqual(page.count("</script>"), 2)
        self.assertIn("\\u003c/script", page)

    def test_chat_fills_the_deck_when_no_card_file_exists(self):
        page, _ = self.build(flashcards=False)
        cards = embedded(page)["cards"]
        self.assertEqual(len(cards), 1)
        self.assertEqual(cards[0]["front"], "Argo nedir?")

    def test_a_quiz_without_cards_still_gives_a_deck(self):
        page, _ = self.build(flashcards=False, chat=False)
        cards = embedded(page)["cards"]
        self.assertTrue(cards)
        self.assertIn("Bir iletişim dizgesi", cards[0]["back"])

    def test_every_question_type_reaches_the_app(self):
        """Boşluk doldurma ve kısa cevap soruları cevaplarıyla birlikte gelir, kaybolmaz."""
        page, _ = self.build(rich_quiz=True)
        quiz = embedded(page)["quiz"]
        self.assertEqual(len(quiz), 5)  # quiz.json'un 4 sorusu + unit-1.json'un 1 sorusu
        self.assertEqual([q["type"] for q in quiz],
                         ["multiple_choice", "fill_in_the_blank", "multiple_select",
                          "short_answer", "multiple_choice"])
        self.assertEqual(quiz[1]["a"], "söz")
        self.assertEqual(sum(1 for o in quiz[2]["o"] if o["ok"]), 2)
        self.assertEqual(quiz[3]["a"], "Bir dilin büyük kollarından her biri.")

    def test_a_partly_correct_option_keeps_its_mark(self):
        """Kaynak şıkkı "kısmen doğru" işaretlediyse uygulama onu yanlıştan ayırır."""
        with tempfile.TemporaryDirectory() as tmp:
            root = fixture(tmp)
            write(root / "data" / "x" / "quiz.json", {"questions": [
                {"question": "Hangisi?", "answerOptions": [
                    {"text": "Doğru", "isCorrect": True},
                    {"text": "Kısmen", "isCorrect": False, "isPartiallyCorrect": True},
                    {"text": "Yanlış", "isCorrect": False}]}]})
            page = app.build_app(root, "x").read_text(encoding="utf-8")
        options = embedded(page)["quiz"][0]["o"]
        self.assertTrue(options[1]["p"])
        self.assertNotIn("p", options[0])
        self.assertNotIn("p", options[2])
        self.assertIn("Kısmen doğru", page)
        self.assertIn("Kısmen doğru: bu seçenek doğru bilgi içeriyor", page)
        self.assertIn("Tamamlandı işaretle", page)

    def test_every_question_gets_a_stable_id(self):
        """Soru kimliği kökten türetilir: boşluk ve büyük/küçük harf farkı kimliği değiştirmez."""
        page, _ = self.build()
        quiz = embedded(page)["quiz"]
        qids = [q["qid"] for q in quiz]
        self.assertEqual(len(qids), len(set(qids)))
        for qid in qids:
            self.assertRegex(qid, r"^[0-9a-z]+$")
        self.assertEqual(app._qid("  Dil   NEDİR? "), app._qid("Dil NEDİR?"))
        self.assertEqual(app._qid("Dil nedir?"), qids[0])

    def test_unit_titles_travel_at_the_payload_level(self):
        """Ünite başlığı her soruda değil, bir kez `units` haritasında taşınır."""
        page, _ = self.build()
        data = embedded(page)
        self.assertEqual(data["units"], {"1": "Dil"})
        self.assertEqual([q["ch"] for q in data["quiz"]], [0, 1])
        self.assertEqual(sorted(data["quiz"][1]), sorted(data["quiz"][0]))

    def test_the_page_carries_the_review_tab_and_option_log(self):
        """Tekrar sekmesi, günlük tekrar takvimi ve şık analitiği sayfada yer alır."""
        page, _ = self.build()
        data = embedded(page)
        self.assertIn("units", data)
        self.assertIn('data-view="tekrar"', page)
        self.assertIn('id="view-tekrar"', page)
        self.assertIn("Tekrarı başlat", page)
        self.assertIn("Soru analizi", page)
        self.assertIn("En çok yanıltan seçenekler", page)
        self.assertIn("Kısmen doğru seçenekler", page)
        self.assertIn("STEPS = [0, 1, 3, 7, 16]", page)
        self.assertIn("st.pick", page)  # şık sayacı
        self.assertIn("Tekrara dön", page)  # biten tekrar koşusu boş kuyruğa yeniden dalmaz
        self.assertIn("st.q[q.qid]", page)  # soru günlüğü
        self.assertIn("e && e.n && e.due <= now", page)  # tekrar kuyruğu: yalnız cevaplanmış ve vadesi gelmiş

    def test_a_course_without_a_plan_is_skipped(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = fixture(tmp, plan=False)
            self.assertIsNone(app.build_app(root, "x"))

    def test_a_minimal_course_still_builds(self):
        page, _ = self.build(quiz=False, flashcards=False, chat=False)
        data = embedded(page)
        self.assertEqual(data["counts"]["quiz"], 0)
        self.assertEqual(data["counts"]["cards"], 0)
        self.assertIn('data-view="test"', page)


class FlashcardParserTest(unittest.TestCase):
    def setUp(self):
        self.pipeline = load("pipeline", "generator/scripts")

    def test_reads_the_cards_object(self):
        cards = self.pipeline.parse_cards('Here you go:\n{"cards": [{"front": "A", "back": "B"}]}')
        self.assertEqual(cards, [{"front": "A", "back": "B"}])

    def test_repairs_the_invalid_escapes_the_model_writes(self):
        cards = self.pipeline.parse_cards('{"cards": [{"front": "V$ROOT", "back": "CDB\\$ROOT"}]}')
        self.assertEqual(cards[0]["back"], "CDB$ROOT")

    def test_drops_empty_and_oversized_cards(self):
        long_back = "x" * 601
        raw = json.dumps({"cards": [{"front": "", "back": "b"}, {"front": "f", "back": ""},
                                    {"front": "f", "back": long_back}, {"front": "ok", "back": "fine"}]})
        self.assertEqual(self.pipeline.parse_cards(raw), [{"front": "ok", "back": "fine"}])

    def test_unparsable_answer_is_no_cards(self):
        self.assertEqual(self.pipeline.parse_cards("Kartları yazamam."), [])


if __name__ == "__main__":
    unittest.main()
