#!/usr/bin/env python3
"""Build a standalone study app for a course, as one self-contained HTML file.

Usage:
  py -3 scripts/build_study_app.py SLUG [SLUG ...] [--out DIR]
  py -3 scripts/build_study_app.py --all

Reads what the NotebookLM pipeline already produced for a course (`study_plan.json`, `quiz.json`,
`unit_quizzes/`, `chat.json`, `flashcards.json`, `state.json`) and writes `site/apps/<slug>.html`:
one file with inline CSS and JavaScript, no server and no external assets. It opens from a file://
path, from any static host, and offline; progress (known cards, completed chapters, best test) lives
in the reader's localStorage. A quiz answer gets one of three verdicts: correct, partly correct
(`kısmen doğru`, no point) or wrong.
"""
import argparse, html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "generator" / "scripts"))
from build import clean, dash  # noqa: E402  (the site's NotebookLM text cleaner, not a package)
from common import course_slugs  # noqa: E402

SLUGS = course_slugs(ROOT)
MAX_CARDS = 400
MAX_QUIZ = 200


# ---- reading ----------------------------------------------------------------
def load(path, default=None):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8-sig"))
    except (OSError, ValueError):
        return default


def _text(value):
    """NotebookLM text as the app shows it: no citation markers, no em dashes."""
    return dash(clean(str(value or "")))


def _color(value, default):
    value = str(value or "").strip()
    return value if re.fullmatch(r"#[0-9a-fA-F]{3,8}", value) else default


def _http(url):
    url = str(url or "").strip()
    return url if re.match(r"^https?://", url, re.I) else ""


def notes_blocks(text):
    """A chapter's grounded answer as blocks the app can paint without a markdown parser."""
    out = []
    for raw in (text or "").splitlines():
        line = raw.strip()
        if not line:
            continue
        heading = re.match(r"^#{1,6}\s+(.+)$", line)
        bullet = re.match(r"^(?:[-*\u2022]|\d+[.)])\s+(.+)$", line)
        if heading:
            out.append({"h": _text(heading.group(1))})
        elif bullet:
            out.append({"li": _text(bullet.group(1))})
        else:
            out.append({"p": _text(line)})
    return [b for b in out if b.get("h") or b.get("p") or b.get("li")]


def _questions(data):
    """The app's question shape from a quiz JSON file (quiz.json or unit_quizzes/unit-N.json).

    NotebookLM's export carries four types. Two hold options; `fill_in_the_blank` holds
    `bestAnswer` and `short_answer` a model answer. All four are kept and the answer travels with
    the question, so the app never silently drops a question it could still show.
    """
    questions = data.get("questions") if isinstance(data, dict) else data
    out = []
    for q in questions or []:
        if not isinstance(q, dict):
            continue
        stem = _text(q.get("question") or q.get("stem") or q.get("prompt"))
        grading = q.get("grading") if isinstance(q.get("grading"), dict) else {}
        options = []
        for o in q.get("answerOptions") or q.get("options") or []:
            if isinstance(o, str):
                options.append({"t": _text(o), "ok": False, "why": ""})
            elif isinstance(o, dict):
                option = {"t": _text(o.get("text")), "ok": bool(o.get("isCorrect")),
                          "why": _text(o.get("rationale") or o.get("explanation"))}
                if not option["ok"] and _partial(o):
                    option["p"] = True  # yalnız işaretliyse yazılır: işaretsiz payload aynı kalır
                options.append(option)
        options = [o for o in options if o["t"]]
        answer = _text(q.get("bestAnswer") or grading.get("modelAnswer"))
        why = _text(q.get("rationale") or grading.get("rationale"))
        if stem and (options or answer):
            out.append({"q": stem, "o": options, "hint": _text(q.get("hint")),
                        "type": str(q.get("type") or "multiple_choice"),
                        "a": answer, "why": "" if options else why})
    return out


def _qid(stem):
    """A question's stable id: its normalized stem hashed with djb2 (32-bit), in base36.

    The id must survive a rebuilt app and match the extension's own copy, so it is derived from the
    stem alone (whitespace collapsed, casefolded) rather than from an index or a file position: a
    quiz reordered or shortened keeps every other question's review history. A cryptographic hash
    was not an option in the page, where `crypto.subtle` is asynchronous.
    """
    text = re.sub(r"\s+", " ", str(stem or "")).strip().lower()
    h = 5381
    for byte in text.encode("utf-8"):
        h = (h * 33 + byte) & 0xFFFFFFFF
    return _base36(h)


def _base36(number):
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = ""
    while number:
        number, rest = divmod(number, 36)
        out = digits[rest] + out
    return out or "0"


def _partial(option):
    """The source's own "partly correct" mark on one option, in the spellings it appears in.

    NotebookLM writes a plain `isCorrect` today; a quiz that marks a distractor as partly right
    (`isPartiallyCorrect`, `partial`, or `status: "partial"`) keeps that information instead of
    flattening it into "wrong".
    """
    if option.get("isPartiallyCorrect") or option.get("partiallyCorrect") or option.get("partial"):
        return True
    return str(option.get("status") or "").strip().casefold() == "partial"


def _cards(doc):
    out = []
    for c in (doc or {}).get("cards") or []:
        if not isinstance(c, dict):
            continue
        front, back = _text(c.get("front")), _text(c.get("back"))
        if front and back:
            out.append({"front": front, "back": back, "ch": c.get("chapter") or 0,
                        "chTitle": _text(c.get("chapterTitle"))})
    return out


def course_app(root, slug):
    """Everything one course's app needs, from the files the pipeline already wrote."""
    root = Path(root)
    uni = load(root / "university.json", {}) or {}
    courses = load(root / "courses.json", {}) or {}
    meta = courses.get(slug) or {}
    data = root / "data" / slug
    plan = load(data / "study_plan.json", {}) or {}
    state = load(data / "state.json", {}) or {}
    # `sources` is keyed by a local key ("kitap-bolum-1") that is not always the source id; `order`
    # lists those keys, and a chapter's `source_ids` lists the ids. Resolve both.
    by_key = {k: s for k, s in (state.get("sources") or {}).items() if isinstance(s, dict)}
    by_id = {s.get("id"): s for s in by_key.values()}

    chapters = []
    for i, ch in enumerate(plan.get("chapters") or [], 1):
        if not isinstance(ch, dict):
            continue
        sources = []
        for sid in ch.get("source_ids") or []:
            src = by_id.get(sid) or {}
            title = _text(src.get("title")) or _text(sid)
            sources.append({"title": title, "url": _http(src.get("url"))})
        chapters.append({
            "n": i,
            "title": _text(ch.get("title")) or f"{i}. bölüm",
            "summary": _text(ch.get("summary")),
            "objectives": [_text(o) for o in ch.get("objectives") or [] if _text(o)],
            "notes": notes_blocks((ch.get("grounding") or {}).get("answer")),
            "sources": [s for s in sources if s["title"]],
        })
    if not chapters:
        return None

    quiz = []
    seen = set()
    units = {}  # unit number -> title, once per unit instead of on every question
    book = load(data / "quiz.json")
    for q in _questions(book):
        key = re.sub(r"\s+", " ", q["q"]).casefold()
        if key not in seen:
            seen.add(key)
            quiz.append({**q, "qid": _qid(q["q"]), "ch": 0})
    for path in sorted((data / "unit_quizzes").glob("unit-*.json"),
                       key=lambda p: int(re.sub(r"\D", "", p.stem) or 0)):
        unit = load(path, {}) or {}
        number = unit.get("unit") or 0
        title = _text(unit.get("unitTitle"))
        if number and title:
            units[str(number)] = title
        for q in _questions(unit):
            key = re.sub(r"\s+", " ", q["q"]).casefold()
            if key not in seen:
                seen.add(key)
                quiz.append({**q, "qid": _qid(q["q"]), "ch": number})
    quiz = quiz[:MAX_QUIZ]

    cards = _cards(load(data / "flashcards.json"))
    if not cards:  # no card artifact yet: the question-and-answer corpus is the next best deck
        chat = load(data / "chat.json", {}) or {}
        cards = [{"front": _text(it.get("q")), "back": _text(it.get("a")),
                  "ch": it.get("chapter") or 0, "chTitle": _text(it.get("chapterTitle"))}
                 for it in chat.get("items") or [] if it.get("q") and it.get("a")]
    if not cards:  # no corpus either: the quiz's correct options are the definitions
        for q in quiz:
            right = next((o for o in q["o"] if o["ok"]), None)
            if right:
                cards.append({"front": q["q"], "back": right["t"] + (". " + right["why"] if right["why"] else ""),
                              "ch": q["ch"] or 0, "chTitle": ""})
    for i, c in enumerate(cards, 1):
        c["id"] = f"{slug}:{i}"
    cards = cards[:MAX_CARDS]

    source_list = []
    for key in state.get("order") or list(by_key):
        src = by_key.get(key) or by_id.get(key) or {}
        sid = src.get("id") or key
        if src.get("status") != "ready":
            continue
        source_list.append({"title": _text(src.get("title")) or _text(key), "url": _http(src.get("url")),
                            "type": _text(src.get("type"))})

    colors = uni.get("colors") or {}
    payload = {
        "storageKey": str(uni.get("storageKey") or slug),
        "brand": {"name": _text(uni.get("name")), "short": _text(uni.get("shortName")),
                  "tagline": _text(uni.get("tagline")), "siteUrl": _http(uni.get("siteUrl"))},
        "course": {"slug": slug, "title": _text(meta.get("course")) or slug,
                   "subject": _text(meta.get("subject")), "code": _text(meta.get("code"))},
        "passMark": round(float(uni.get("passMark") or 0.7), 3),
        "colors": {"primary": _color(colors.get("primary"), "#1b2a4a"),
                   "accent": _color(colors.get("accent"), "#b08d4a"),
                   "paper": _color(colors.get("paper"), "#f8f4ea")},
        "chapters": chapters,
        "cards": cards,
        "quiz": quiz,
        "units": units,
        "sources": source_list,
        "counts": {"chapters": len(chapters), "cards": len(cards), "quiz": len(quiz),
                   "sources": len(source_list)},
    }
    payload["lang"] = "tr" if _is_turkish(meta, uni) else "en"
    return dash(payload)


def _is_turkish(meta, uni):
    lang = str((meta.get("config") or {}).get("language") or uni.get("language") or "Turkish").casefold()
    return lang.startswith("tr") or lang.startswith("turk")


# ---- rendering --------------------------------------------------------------
CSS = """
:root{--primary:__PRIMARY__;--accent:__ACCENT__;--paper:__PAPER__;--ink:#16181d;--muted:#5d6470;
--card:#fff;--line:rgba(20,24,34,.12);--ok:#1f7a4d;--bad:#b3382f;--warn:#8a5e0c;
--warnbg:rgba(138,94,12,.10);--okbg:rgba(31,122,77,.10)}
@media (prefers-color-scheme:dark){:root{--paper:#12151a;--ink:#e8e5de;--muted:#a3a9b4;--card:#1a1f27;
--line:rgba(255,255,255,.16);--ok:#5ec98f;--bad:#ef8b82;--warn:#e0b055;
--warnbg:rgba(224,176,85,.14);--okbg:rgba(94,201,143,.16)}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);
font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--primary);color:#fff;padding:14px 18px 0}
header .brand{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.72}
header h1{margin:2px 0 12px;font-size:19px;line-height:1.3;font-weight:650}
nav{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none}
nav::-webkit-scrollbar{display:none}
nav button{flex:0 0 auto;background:none;border:0;color:#fff;opacity:.68;font:inherit;font-size:14px;
padding:9px 12px;border-bottom:3px solid transparent;cursor:pointer}
nav button[aria-selected=true]{opacity:1;border-bottom-color:var(--accent)}
main{max-width:860px;margin:0 auto;padding:18px 18px 72px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin:0 0 14px}
h2{font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:26px 0 10px;font-weight:600}
h3{margin:0 0 8px;font-size:19px;line-height:1.35}
h4{margin:18px 0 6px;font-size:16px}
p{margin:0 0 10px}
.muted{color:var(--muted)}
ul.obj{margin:0;padding-left:22px;color:var(--muted);font-size:15px}
ul.notes{margin:0 0 10px;padding-left:22px}
a{color:var(--primary)}
@media (prefers-color-scheme:dark){a{color:#9db8ef}}
input[type=search]{width:100%;padding:11px 14px;border-radius:11px;border:1px solid var(--line);
background:var(--card);color:var(--ink);font:inherit;margin:0 0 16px}
button.act{border:0;border-radius:11px;padding:11px 18px;font:inherit;font-weight:600;cursor:pointer}
button.primary{background:var(--accent);color:#221a06}
button.ghost{background:none;border:1px solid var(--line);color:var(--ink)}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.stat b{display:block;font-size:24px;line-height:1.2;color:var(--primary)}
@media (prefers-color-scheme:dark){.stat b{color:#c9d7f5}}
.stat span{font-size:12px;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}
.bar{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin:8px 0 0}
.bar i{display:block;height:100%;background:var(--accent);width:0}
.flash{min-height:190px;display:flex;flex-direction:column;justify-content:center;gap:12px;cursor:pointer}
.flash .front{font-size:20px;font-weight:600;line-height:1.35}
.flash .back{font-size:16px;color:var(--muted);border-top:1px solid var(--line);padding-top:12px}
.kicker{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.opt{display:block;width:100%;text-align:left;background:none;border:1px solid var(--line);border-radius:11px;
padding:12px 14px;margin:0 0 9px;font:inherit;color:inherit;cursor:pointer}
.opt:hover{border-color:var(--accent)}
.opt[data-state=ok]{border-color:var(--ok);background:rgba(31,122,77,.08)}
.opt[data-state=bad]{border-color:var(--bad);background:rgba(179,56,47,.08)}
.opt[data-state=partial]{border-color:var(--warn);background:var(--warnbg)}
.why{margin:10px 0 0;padding:10px 12px;border-left:3px solid var(--accent);background:rgba(176,141,74,.09);
border-radius:0 8px 8px 0;font-size:15px}
.why.partial{border-left-color:var(--warn);background:var(--warnbg)}
.prog{margin:0 0 14px}
.prog:last-child{margin-bottom:0}
.bar.b1 i{background:var(--ok)}
.chhead{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.chdone{flex:0 0 auto;border:1px solid var(--line);background:none;color:var(--muted);border-radius:999px;
padding:5px 12px;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.chdone[aria-pressed=true]{border-color:var(--ok);color:var(--ok);background:var(--okbg)}
.card[data-done="1"]{border-left:4px solid var(--ok)}
.list{margin:0;padding:0;list-style:none}
.list li{padding:7px 0;border-top:1px solid var(--line);font-size:15px}
.list li:first-child{border-top:0}
.empty{color:var(--muted);margin:0}
footer{max-width:860px;margin:0 auto;padding:0 18px 34px;color:var(--muted);font-size:13px}
"""

JS = """
(function () {
  var DATA = JSON.parse(document.getElementById("app-data").textContent);
  var KEY = DATA.storageKey + ".app";
  var st = {known: {}, best: 0, seen: 0, done: {}, q: {}, pick: {}};
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  st.q = st.q || {}; st.pick = st.pick || {};
  // A rebuilt course can retire a question: its log entry and option counts go with it.
  (function prune() {
    var ids = {};
    DATA.quiz.forEach(function (q) { ids[q.qid] = 1; });
    Object.keys(st.q).forEach(function (k) { if (!ids[k]) delete st.q[k]; });
    Object.keys(st.pick).forEach(function (k) {
      if (!ids[k.slice(0, k.lastIndexOf(":"))]) delete st.pick[k];
    });
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function $(s) { return document.querySelector(s); }
  function norm(s) { return (s || "").toLocaleLowerCase(); }
  var query = "";

  function cut(text, n) {
    text = String(text || "");
    return text.length > n ? text.slice(0, n - 1) + "…" : text;
  }

  function unitName(q) {
    return (DATA.units && DATA.units[String(q.ch || 0)]) || "";
  }

  // ---- review schedule -----------------------------------------------------
  // Each answered question keeps a box and a due day (days since the epoch). A right answer moves
  // it up one box; a partly right answer stays where it is and comes back tomorrow; a wrong answer
  // drops to the first box and comes back tomorrow. A question never returns inside one run.
  var STEPS = [0, 1, 3, 7, 16];
  function today() { return Math.floor(Date.now() / 86400000); }
  function entry(qid) {
    var e = st.q[qid];
    if (!e || typeof e !== "object") e = st.q[qid] = {n: 0, ok: 0, part: 0, bad: 0, box: 0, due: 0};
    return e;
  }
  function record(q, verdict, picked) {
    var e = entry(q.qid);
    e.n += 1;
    if (verdict === "ok") {
      e.ok += 1;
      e.box = Math.min(e.box + 1, STEPS.length - 1);
      e.due = today() + STEPS[e.box];
    } else if (verdict === "partial") {
      e.part += 1;
      e.due = today() + 1;
    } else {
      e.bad += 1;
      e.box = 0;
      e.due = today() + 1;
    }
    (picked || []).forEach(function (j) {
      if (!q.o[j] || q.o[j].ok) return;
      var key = q.qid + ":" + j;
      st.pick[key] = (st.pick[key] || 0) + 1;
    });
    save();
  }
  // Only a question that has been answered already can be due: an unseen one belongs to Test, not
  // to the review queue, or Tekrar would just repeat the whole quiz.
  function dueQuestions() {
    var now = today();
    return DATA.quiz.filter(function (q) {
      var e = st.q[q.qid];
      return e && e.n && e.due <= now;
    });
  }

  function blocks(parent, list) {
    var ul = null;
    list.forEach(function (b) {
      if (b.h) { ul = null; parent.appendChild(el("h4", null, b.h)); }
      else if (b.li) {
        if (!ul) { ul = el("ul", "notes"); parent.appendChild(ul); }
        ul.appendChild(el("li", null, b.li));
      } else { ul = null; parent.appendChild(el("p", null, b.p)); }
    });
  }

  // ---- progress ------------------------------------------------------------
  function progressRow(name, n, total, unitText, cls) {
    var wrap = el("div", "prog");
    wrap.appendChild(el("p", "muted", name + ": " + n + " / " + total + " " + unitText));
    var bar = el("div", "bar" + (cls ? " " + cls : ""));
    var fill = el("i");
    fill.style.width = (total ? Math.round(100 * n / total) : 0) + "%";
    bar.appendChild(fill);
    wrap.appendChild(bar);
    return wrap;
  }

  function paintChapterDone(btn, card, n) {
    var done = Boolean(st.done[n]);
    btn.textContent = done ? "Tamamlandı ✓" : "Tamamlandı işaretle";
    btn.setAttribute("aria-pressed", done ? "true" : "false");
    card.dataset.done = done ? "1" : "0";
  }

  function toggleChapter(btn, card, n) {
    if (st.done[n]) delete st.done[n]; else st.done[n] = 1;
    save();
    paintChapterDone(btn, card, n);
    paintPanel();
  }

  // ---- panel ---------------------------------------------------------------
  function paintPanel() {
    var v = $("#view-panel");
    v.textContent = "";
    var stats = el("div", "stats");
    [["Bölüm", DATA.counts.chapters], ["Kart", DATA.counts.cards],
     ["Soru", DATA.counts.quiz], ["Kaynak", DATA.counts.sources]].forEach(function (s) {
      var d = el("div", "stat");
      d.appendChild(el("b", null, String(s[1])));
      d.appendChild(el("span", null, s[0]));
      stats.appendChild(d);
    });
    v.appendChild(stats);

    var doneCh = DATA.chapters.filter(function (c) { return st.done[c.n]; }).length;
    var known = DATA.cards.filter(function (c) { return st.known[c.id]; }).length;
    var box = el("div", "card");
    box.appendChild(el("h3", null, "İlerleme"));
    box.appendChild(progressRow("Bölüm", doneCh, DATA.counts.chapters, "bölüm tamamlandı", "b1"));
    box.appendChild(progressRow("Kart", known, DATA.counts.cards, "kart biliniyor", ""));
    if (st.best) box.appendChild(el("p", "muted", "En iyi test: " + st.best + "%"));
    var row = el("div", "row");
    row.style.marginTop = "14px";
    var b1 = el("button", "act primary", "Kartlara başla");
    b1.onclick = function () { show("kartlar"); };
    var b2 = el("button", "act ghost", "Teste gir");
    b2.onclick = function () { show("test"); };
    row.appendChild(b1); row.appendChild(b2);
    box.appendChild(row);
    v.appendChild(box);

    var answered = DATA.quiz.filter(function (q) { return st.q[q.qid] && st.q[q.qid].n; });
    if (answered.length) {
      var hits = answered.reduce(function (a, q) { return a + st.q[q.qid].ok; }, 0);
      var tries = answered.reduce(function (a, q) { return a + st.q[q.qid].n; }, 0);
      var an = el("div", "card");
      an.appendChild(el("h3", null, "Soru analizi"));
      an.appendChild(el("p", "muted", answered.length + " soru cevaplandı · " + tries + " denemede "
        + hits + " doğru (" + Math.round(100 * hits / tries) + "%)"));
      var hard = answered.slice().sort(function (a, b) {
        return st.q[b.qid].bad - st.q[a.qid].bad;
      }).filter(function (q) { return st.q[q.qid].bad; }).slice(0, 3);
      if (hard.length) {
        an.appendChild(el("div", "kicker", "En çok yanlış yapılan sorular"));
        var ul = el("ul", "list");
        hard.forEach(function (q) {
          ul.appendChild(el("li", null, cut(q.q, 100) + " · " + st.q[q.qid].bad + " yanlış"));
        });
        an.appendChild(ul);
      }
      // A partly correct option is not a trap: it is worth seeing on its own, because picking it
      // repeatedly means the learner knows part of the answer and stops there.
      var picks = Object.keys(st.pick).map(function (k) {
        var at = k.lastIndexOf(":"), id = k.slice(0, at), index = Number(k.slice(at + 1));
        var q = DATA.quiz.filter(function (x) { return x.qid === id; })[0];
        return q && q.o[index] ? {text: q.o[index].t, n: st.pick[k], part: Boolean(q.o[index].p)} : null;
      }).filter(Boolean).sort(function (a, b) { return b.n - a.n; });
      [["Kısmen doğru seçenekler", picks.filter(function (t) { return t.part; })],
       ["En çok yanıltan seçenekler", picks.filter(function (t) { return !t.part; })]]
        .forEach(function (group) {
          if (!group[1].length) return;
          an.appendChild(el("div", "kicker", group[0]));
          var ul2 = el("ul", "list");
          group[1].slice(0, 3).forEach(function (t) {
            ul2.appendChild(el("li", null, t.text + " · " + t.n + " kez seçildi"));
          });
          an.appendChild(ul2);
        });
      var due = dueQuestions();
      if (due.length) {
        var row2 = el("div", "row");
        row2.style.marginTop = "14px";
        var rb = el("button", "act ghost", "Tekrar (" + due.length + ")");
        rb.onclick = function () { quizKind = "tekrar"; show("test"); };
        row2.appendChild(rb);
        an.appendChild(row2);
      }
      v.appendChild(an);
    }

    if (DATA.brand.tagline) v.appendChild(el("p", "muted", DATA.brand.tagline));
  }

  // ---- cards ---------------------------------------------------------------
  var queue = [], qIndex = 0, revealed = false;
  function startCards() {
    queue = DATA.cards.filter(function (c) { return !st.known[c.id]; });
    if (!queue.length) queue = DATA.cards.slice();
    queue = queue.filter(function (c) {
      return !query || norm(c.front + " " + c.back + " " + c.chTitle).indexOf(query) >= 0;
    });
    qIndex = 0; revealed = false;
    paintCard();
  }
  function paintCard() {
    var v = $("#view-kartlar");
    v.textContent = "";
    if (!queue.length) {
      v.appendChild(el("p", "empty", DATA.counts.cards
        ? "Aramanıza uyan kart yok." : "Bu ders için henüz kart üretilmedi. Defterden kart üretmek için pipeline'ın flashcards aşamasını çalıştırın."));
      return;
    }
    var c = queue[qIndex % queue.length];
    var box = el("div", "card flash");
    box.appendChild(el("div", "kicker", (c.chTitle || "Kart") + " · " + (qIndex + 1) + "/" + queue.length));
    box.appendChild(el("div", "front", c.front));
    if (revealed) box.appendChild(el("div", "back", c.back));
    else box.appendChild(el("div", "muted", "Cevabı görmek için karta dokunun."));
    box.onclick = function () { revealed = true; paintCard(); };
    v.appendChild(box);

    var row = el("div", "row");
    var know = el("button", "act primary", "Biliyorum");
    know.onclick = function () {
      st.known[c.id] = 1; save(); revealed = false;
      queue.splice(qIndex % queue.length, 1);
      if (!queue.length) { paintPanel(); paintCard(); return; }
      paintCard();
    };
    var again = el("button", "act ghost", "Tekrar");
    again.onclick = function () {
      revealed = false; qIndex = (qIndex + 1) % queue.length; paintCard();
    };
    row.appendChild(know); row.appendChild(again);
    v.appendChild(row);
  }

  // ---- chapters ------------------------------------------------------------
  function paintChapters() {
    var v = $("#view-konular");
    v.textContent = "";
    var shown = DATA.chapters.filter(function (ch) {
      if (!query) return true;
      var hay = ch.title + " " + ch.summary + " " + ch.objectives.join(" ");
      ch.notes.forEach(function (b) { hay += " " + (b.p || b.h || b.li || ""); });
      return norm(hay).indexOf(query) >= 0;
    });
    if (!shown.length) { v.appendChild(el("p", "empty", "Aramanıza uyan bölüm yok.")); return; }
    shown.forEach(function (ch) {
      var card = el("section", "card");
      var head = el("div", "chhead");
      var left = el("div");
      left.appendChild(el("div", "kicker", "Bölüm " + ch.n));
      left.appendChild(el("h3", null, ch.title));
      var mark = el("button", "chdone", "");
      mark.type = "button";
      mark.title = "Bu bölümü bitirdiniz mi?";
      mark.onclick = function () { toggleChapter(mark, card, ch.n); };
      paintChapterDone(mark, card, ch.n);
      head.appendChild(left);
      head.appendChild(mark);
      card.appendChild(head);
      if (ch.summary) card.appendChild(el("p", "muted", ch.summary));
      if (ch.objectives.length) {
        var ul = el("ul", "obj");
        ch.objectives.forEach(function (o) { ul.appendChild(el("li", null, o)); });
        card.appendChild(ul);
      }
      if (ch.notes.length) blocks(card, ch.notes);
      if (ch.sources.length) {
        var k = el("div", "kicker", "Kaynaklar");
        k.style.marginTop = "14px";
        card.appendChild(k);
        ch.sources.forEach(function (s) {
          if (s.url) {
            var a = el("a", null, s.title);
            a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer";
            card.appendChild(a);
            card.appendChild(document.createElement("br"));
          } else card.appendChild(el("div", "muted", s.title));
        });
      }
      v.appendChild(card);
    });
  }

  // ---- quiz ----------------------------------------------------------------
  var pool = [], qi = 0, right = 0, partialRight = 0, answered = false, quizKind = "all";
  function startQuiz() {
    var source = quizKind === "tekrar" ? dueQuestions() : DATA.quiz;
    pool = source.filter(function (q) {
      if (!query) return true;
      return norm(q.q + " " + (q.a || "") + " "
        + q.o.map(function (o) { return o.t; }).join(" ")).indexOf(query) >= 0;
    });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    qi = 0; right = 0; partialRight = 0; answered = false;
    paintQuiz();
  }
  function paintQuiz() {
    var v = $("#view-test");
    v.textContent = "";
    if (!pool.length) {
      v.appendChild(el("p", "empty", DATA.counts.quiz
        ? "Aramanıza uyan soru yok." : "Bu ders için henüz test sorusu yok."));
      return;
    }
    if (qi >= pool.length) {
      var pct = Math.round(100 * right / pool.length);
      if (quizKind !== "tekrar") {  // a review run is not a new best score
        st.seen = (st.seen || 0) + 1;
        if (pct > (st.best || 0)) st.best = pct;
        save();
      }
      var box = el("div", "card");
      box.appendChild(el("div", "kicker", quizKind === "tekrar" ? "Tekrar bitti" : "Test bitti"));
      box.appendChild(el("h3", null, right + " / " + pool.length + " doğru · " + pct + "%" +
        (partialRight ? " · " + partialRight + " kısmen doğru" : "")));
      box.appendChild(el("p", "muted", pct >= Math.round(DATA.passMark * 100)
        ? "Geçme sınırının üstündesiniz." : "Geçme sınırı " + Math.round(DATA.passMark * 100) + "%."));
      if (quizKind !== "tekrar") box.appendChild(el("p", "muted",
        "Yanlış ve kısmen doğru cevaplar yarın Tekrar sekmesinde geri gelir."));
      var row = el("div", "row");
      var again = el("button", "act primary", "Yeniden çöz");
      again.onclick = startQuiz;
      var cards = el("button", "act ghost", "Kartlara dön");
      cards.onclick = function () { show("kartlar"); };
      row.appendChild(again); row.appendChild(cards);
      box.appendChild(row);
      v.appendChild(box);
      paintPanel();
      return;
    }
    var q = pool[qi];
    var card = el("section", "card");
    card.appendChild(el("div", "kicker", "Soru " + (qi + 1) + " / " + pool.length
      + (unitName(q) ? " · " + unitName(q) : "")));
    card.appendChild(el("h3", null, q.q));
    if (q.hint) card.appendChild(el("p", "muted", q.hint));
    if (!q.o.length) {  // boşluk doldurma / kısa cevap: cevap açılır, okuyucu kendi karar verir
      var rev = el("button", "act primary", "Cevabı göster");
      rev.onclick = function () { revealAnswer(card, q); };
      card.appendChild(rev);
      v.appendChild(card);
      return;
    }
    var selected = {}, labels = q.o.map(function (o) {
      var b = el("button", "opt", o.t);
      card.appendChild(b);
      return b;
    });
    // Tek doğru: tıklanan şık cevabı verir. Çoktan seçmeli: şıklar işaretlenir, küme "Kontrol et"te karşılaştırılır.
    // Üç sonuç var: doğru, kısmen doğru, yanlış. Kısmen doğru puan kazandırmaz; seçim doğru bilgi
    // içeriyor ama sorunun tam yanıtı değil.
    function pickedIndexes() {
      return q.o.map(function (o, j) { return j; }).filter(function (j) { return selected[j]; });
    }
    function settle(verdict, note) {
      answered = true;
      if (verdict === "ok") right += 1;
      if (verdict === "partial") partialRight += 1;
      record(q, verdict, pickedIndexes());
      q.o.forEach(function (o, j) {
        if (verdict === "partial" && selected[j]) labels[j].dataset.state = "partial";
        else labels[j].dataset.state = o.ok ? "ok" : (selected[j] ? "bad" : "");
      });
      var picked = q.o.filter(function (o, j) { return selected[j] && o.why; })[0];
      var why = verdict === "partial" ? picked : q.o.filter(function (x) { return x.ok && x.why; })[0];
      if (why) card.appendChild(el("p", verdict === "partial" ? "why partial" : "why", why.why));
      if (note) card.appendChild(el("p", "muted", note));
      card.appendChild(nextButton());
    }
    if (q.type === "multiple_select") {
      card.appendChild(el("p", "muted", "Doğru olan tüm seçenekleri işaretleyin."));
      labels.forEach(function (b, j) {
        b.onclick = function () {
          if (answered) return;
          selected[j] = !selected[j];
          b.dataset.state = selected[j] ? "ok" : "";
        };
      });
      var check = el("button", "act primary", "Kontrol et");
      check.style.marginTop = "6px";
      check.onclick = function () {
        if (answered) return;
        var hits = 0, misses = 0;
        q.o.forEach(function (o, j) {
          if (!selected[j]) return;
          if (o.ok) hits += 1; else misses += 1;
        });
        if (q.o.every(function (o, j) { return Boolean(o.ok) === Boolean(selected[j]); })) {
          settle("ok", "Doğru.");
        } else if (hits && !misses) {
          settle("partial", "Kısmen doğru: doğru seçeneklerin bir kısmını işaretlediniz.");
        } else if (hits) {
          settle("partial", "Kısmen doğru: doğru seçeneklerden bazılarını işaretlediniz, ayrıca yanlış seçenek var.");
        } else {
          settle("bad", "Yanlış: doğru seçeneklerden hiçbirini işaretlemediniz.");
        }
      };
      card.appendChild(check);
    } else {
      labels.forEach(function (b, j) {
        b.onclick = function () {
          if (answered) return;
          selected[j] = true;
          if (q.o[j].ok) settle("ok");
          else if (q.o[j].p) settle("partial", "Kısmen doğru: bu seçenek doğru bilgi içeriyor, ama sorunun tam yanıtı değil.");
          else settle("bad");
        };
      });
    }
    v.appendChild(card);
  }

  function nextButton() {
    var next = el("button", "act primary", qi + 1 >= pool.length ? "Sonucu gör" : "Sonraki soru");
    next.style.marginTop = "12px";
    next.onclick = function () { qi += 1; answered = false; paintQuiz(); };
    return next;
  }

  function revealAnswer(card, q) {
    if (answered) return;
    answered = true;
    if (q.a) card.appendChild(el("p", "why", q.why ? q.a + " " + q.why : q.a));
    else if (q.why) card.appendChild(el("p", "why", q.why));
    var row = el("div", "row");
    var know = el("button", "act primary", "Bildim");
    know.onclick = function () { right += 1; record(q, "ok"); qi += 1; answered = false; paintQuiz(); };
    var mid = el("button", "act ghost", "Kısmen bildim");
    mid.onclick = function () { partialRight += 1; record(q, "partial"); qi += 1; answered = false; paintQuiz(); };
    var no = el("button", "act ghost", "Bilemedim");
    no.onclick = function () { record(q, "bad"); qi += 1; answered = false; paintQuiz(); };
    row.appendChild(know); row.appendChild(mid); row.appendChild(no);
    card.appendChild(row);
  }

  // ---- review ---------------------------------------------------------------
  function paintTekrar() {
    var v = $("#view-tekrar");
    v.textContent = "";
    var box = el("div", "card");
    box.appendChild(el("h3", null, "Tekrar"));
    if (!DATA.counts.quiz) {
      box.appendChild(el("p", "empty", "Bu ders için henüz test sorusu yok."));
      v.appendChild(box);
      return;
    }
    var due = dueQuestions();
    box.appendChild(el("p", "muted", due.length
      ? due.length + " soru tekrar sırasında. Doğru cevap soruyu 1, 3, 7 ve 16 gün sonraya taşır; "
        + "yanlış ve kısmen doğru cevap yarın geri gelir."
      : "Şu an tekrar sırasında soru yok. Yanlış cevaplar ertesi gün burada görünür."));
    if (due.length) {
      var start = el("button", "act primary", "Tekrarı başlat (" + due.length + ")");
      start.onclick = function () { quizKind = "tekrar"; show("test"); };
      box.appendChild(start);
      var ul = el("ul", "list");
      ul.style.marginTop = "14px";
      due.slice(0, 12).forEach(function (q) {
        var e = st.q[q.qid];
        ul.appendChild(el("li", null, cut(q.q, 100)
          + " · " + (e.bad ? e.bad + " yanlış · " : "") + (e.part ? e.part + " kısmen · " : "")
          + e.n + " deneme"));
      });
      if (due.length > 12) {
        ul.appendChild(el("li", "muted", "+" + (due.length - 12) + " soru daha"));
      }
      box.appendChild(ul);
    }
    v.appendChild(box);
  }

  // ---- sources -------------------------------------------------------------
  function paintSources() {
    var v = $("#view-kaynaklar");
    v.textContent = "";
    var list = DATA.sources.filter(function (s) { return !query || norm(s.title).indexOf(query) >= 0; });
    if (!list.length) { v.appendChild(el("p", "empty", "Kaynak bulunamadı.")); return; }
    list.forEach(function (s) {
      var card = el("div", "card");
      card.appendChild(el("div", "kicker", s.type || "kaynak"));
      if (s.url) {
        var a = el("a", null, s.title);
        a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer";
        card.appendChild(a);
      } else card.appendChild(el("div", null, s.title));
      v.appendChild(card);
    });
  }

  // ---- shell ---------------------------------------------------------------
  var VIEWS = {panel: paintPanel, kartlar: startCards, konular: paintChapters, test: startQuiz,
              tekrar: paintTekrar, kaynaklar: paintSources};
  var current = "panel";
  function show(name) {
    current = name;
    Object.keys(VIEWS).forEach(function (k) {
      $("#view-" + k).hidden = k !== name;
      var b = $('#tabs button[data-view="' + k + '"]');
      if (b) b.setAttribute("aria-selected", k === name ? "true" : "false");
    });
    VIEWS[name]();
    window.scrollTo(0, 0);
  }
  Array.prototype.forEach.call(document.querySelectorAll("#tabs button"), function (b) {
    b.onclick = function () {
      query = ""; $("#q").value = "";
      if (b.dataset.view === "test") quizKind = "all";
      show(b.dataset.view);
    };
  });
  var timer = null;
  $("#q").oninput = function (e) {
    clearTimeout(timer);
    var value = e.target.value;
    timer = setTimeout(function () { query = norm(value.trim()); VIEWS[current](); }, 120);
  };
  if (!DATA.counts.cards) document.querySelector('#tabs button[data-view="kartlar"]').hidden = true;
  if (!DATA.counts.quiz) {
    document.querySelector('#tabs button[data-view="test"]').hidden = true;
    document.querySelector('#tabs button[data-view="tekrar"]').hidden = true;
  }
  show("panel");
})();
"""

HTML = """<!doctype html>
<html lang="__LANG__">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>__TITLE__ · __BRAND__</title>
<meta name="description" content="__DESCRIPTION__">
<style>__CSS__</style>
</head>
<body>
<header>
  <div class="brand">__BRAND__</div>
  <h1>__TITLE__</h1>
  <nav id="tabs" aria-label="Bölümler">
    <button type="button" data-view="panel" aria-selected="true">Panel</button>
    <button type="button" data-view="kartlar">Kartlar</button>
    <button type="button" data-view="konular">Konular</button>
    <button type="button" data-view="test">Test</button>
    <button type="button" data-view="tekrar">Tekrar</button>
    <button type="button" data-view="kaynaklar">Kaynaklar</button>
  </nav>
</header>
<main>
  <input id="q" type="search" placeholder="Kart, konu veya soru ara" aria-label="Ara">
  <section id="view-panel"></section>
  <section id="view-kartlar" hidden></section>
  <section id="view-konular" hidden></section>
  <section id="view-test" hidden></section>
  <section id="view-tekrar" hidden></section>
  <section id="view-kaynaklar" hidden></section>
</main>
<footer>__FOOTER__</footer>
<script id="app-data" type="application/json">__DATA__</script>
<script>__JS__</script>
</body>
</html>
"""


def render_app(payload):
    """The app as HTML. Data goes in as JSON with `<` escaped, so no note can close the script tag."""
    data = json.dumps(payload, ensure_ascii=False)
    data = data.replace("<", "\\u003c").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    colors = payload["colors"]
    css = (CSS.replace("__PRIMARY__", colors["primary"]).replace("__ACCENT__", colors["accent"])
           .replace("__PAPER__", colors["paper"]))
    title = payload["course"]["title"]
    brand = payload["brand"]["name"] or "Çalışma uygulaması"
    source_note = ("Kaynak: NotebookLM defteri, ders notları ve testler. İlerleme yalnızca bu cihazda tutulur."
                   if payload["lang"] == "tr" else
                   "Source: the NotebookLM notebook, its notes and quizzes. Progress stays on this device.")
    page = (HTML.replace("__LANG__", "tr" if payload["lang"] == "tr" else "en")
            .replace("__TITLE__", html.escape(title)).replace("__BRAND__", html.escape(brand))
            .replace("__DESCRIPTION__", html.escape(f"{title} · {brand}"))
            .replace("__CSS__", css).replace("__DATA__", data)
            .replace("__JS__", JS).replace("__FOOTER__", html.escape(source_note)))
    return page


def build_app(root, slug, out_dir=None):
    """Write <out_dir>/<slug>.html. Returns the path, or None when the course has no plan yet."""
    payload = course_app(root, slug)
    if payload is None:
        return None
    dest_dir = Path(out_dir) if out_dir else Path(root) / "site" / "apps"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / f"{slug}.html"
    with dest.open("w", encoding="utf-8", newline="\n") as f:
        f.write(render_app(payload))
    return dest


def main(argv=None):
    ap = argparse.ArgumentParser(description="Build a standalone study app (one HTML file) for a course.")
    ap.add_argument("slugs", nargs="*", help="course slugs (default: every course in courses.json)")
    ap.add_argument("--all", action="store_true", help="every course in courses.json")
    ap.add_argument("--out", help="output folder (default: site/apps)")
    a = ap.parse_args(argv)
    known = course_slugs(ROOT) or SLUGS
    slugs = list(known) if a.all or not a.slugs else a.slugs
    unknown = [s for s in slugs if s not in known]
    if unknown:
        sys.exit(f"Unknown course(s): {', '.join(unknown)}. Known: {', '.join(known) or 'none'}")
    built = 0
    for slug in slugs:
        dest = build_app(ROOT, slug, a.out)
        if dest is None:
            print(f"{slug}: no study plan yet, skipped")
            continue
        built += 1
        print(f"{slug}: {dest} ({dest.stat().st_size // 1024} KB)")
    if not built:
        sys.exit(1)


if __name__ == "__main__":
    main()
