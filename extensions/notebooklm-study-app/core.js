/**
 * NotebookLM Study App Exporter - pure functions.
 *
 * `buildPayload()` turns what the popup collected (captured page text, or JSON files from this
 * repository's pipeline) into the payload `scripts/build_study_app.py` emits; `renderPage()` fills
 * the app shell in `app-shell.js` with it. No extension API is touched here, so `node` can test it.
 */
(function (root) {
  "use strict";

  var COLORS = { primary: "#1b2a4a", accent: "#b08d4a", paper: "#f8f4ea" };

  function str(value) {
    return value == null ? "" : String(value);
  }

  function oneLine(text) {
    return str(text).replace(/\s+/g, " ").trim();
  }

  /** NotebookLM's citation markers, dropped the same way the site's builder drops them. */
  function stripCitations(text) {
    return str(text)
      .replace(/\s*\[\d+(?:\s*[-,]\s*\d+)*\]/g, "")
      .replace(/\s*\[(?![^\]\n]*\]\()[^\]\n]*[ ,][^\]\n]*\]/g, "");
  }

  /** A chapter's text as the blocks the app paints: headings, list items and paragraphs. */
  function blocksFrom(text) {
    var out = [];
    str(text).split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;
      var heading = line.match(/^#{1,6}\s+(.+)$/);
      var item = line.match(/^(?:[-*\u2022]|\d+[.)])\s+(.+)$/);
      var clean = stripCitations(heading ? heading[1] : item ? item[1] : line);
      clean = oneLine(clean);
      if (!clean) return;
      if (heading) out.push({ h: clean });
      else if (item) out.push({ li: clean });
      else out.push({ p: clean });
    });
    return out;
  }

  /** "Başlık | https://..." per line; a bare URL keeps the URL as its title. */
  function parseSources(text) {
    var out = [], seen = {};
    str(text).split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;
      var cut = line.lastIndexOf("|");
      var title = cut >= 0 ? line.slice(0, cut).trim() : line;
      var url = cut >= 0 ? line.slice(cut + 1).trim() : "";
      if (/^https?:\/\//i.test(title) && !url) {
        url = title;
        title = title.replace(/^https?:\/\/(www\.)?/i, "").replace(/[?#].*$/, "").slice(0, 80);
      }
      if (!/^https?:\/\//i.test(url)) url = "";
      if (!title) return;
      var key = title.toLowerCase();
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ title: oneLine(title), url: url, type: "" });
    });
    return out;
  }

  /** UTF-8 bytes of a string, so the page's hash of a Turkish stem matches the builder's. */
  function utf8(text) {
    var out = [];
    for (var i = 0; i < text.length; i += 1) {
      var c = text.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length) {
        var pair = 0x10000 + ((c - 0xd800) << 10) + (text.charCodeAt(i + 1) - 0xdc00);
        i += 1;
        out.push(0xf0 | (pair >> 18), 0x80 | ((pair >> 12) & 63),
          0x80 | ((pair >> 6) & 63), 0x80 | (pair & 63));
      } else out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }

  /**
   * A question's stable id: its normalized stem hashed with djb2 (32-bit), in base36.
   * `scripts/build_study_app.py`'s `_qid()` writes the same id, so a learner's review history
   * survives whether the page came from the builder or from this extension.
   */
  function questionId(stem) {
    var bytes = utf8(oneLine(stem).toLowerCase()), h = 5381;
    for (var i = 0; i < bytes.length; i += 1) h = (h * 33 + bytes[i]) >>> 0;
    return h.toString(36);
  }

  /** Notes separated by a line holding only `---`; the first line is the note's heading. */
  function parseNotes(text) {
    return str(text).split(/\r?\n\s*-{3,}\s*\r?\n/).map(function (chunk) {
      var lines = chunk.split(/\r?\n/).filter(function (l) { return l.trim(); });
      if (!lines.length) return null;
      var first = lines[0].replace(/^#{1,6}\s+/, "").trim();
      var body = lines.slice(1).join("\n");
      if (!body.trim()) return { title: first.slice(0, 80), body: body || first };
      return { title: first, body: body };
    }).filter(Boolean);
  }

  /**
   * A quiz JSON file (quiz.json, unit_quizzes/unit-N.json or a bare question array).
   * NotebookLM's four types keep their payload: options for multiple choice and select,
   * `bestAnswer` for a blank, the model answer for a short answer.
   */
  function normalizeQuestions(doc) {
    var questions = Array.isArray(doc) ? doc : (doc && doc.questions) || [];
    var out = [];
    questions.forEach(function (q) {
      if (!q || typeof q !== "object") return;
      var stem = oneLine(stripCitations(q.question || q.stem || q.prompt));
      var grading = (q.grading && typeof q.grading === "object") ? q.grading : {};
      var options = [];
      (q.answerOptions || q.options || []).forEach(function (o) {
        if (typeof o === "string") options.push({ t: oneLine(o), ok: false, why: "" });
        else if (o && typeof o === "object") options.push({
          t: oneLine(stripCitations(o.text)),
          ok: Boolean(o.isCorrect),
          why: oneLine(stripCitations(o.rationale || o.explanation))
        });
      });
      options = options.filter(function (o) { return o.t; });
      var answer = oneLine(stripCitations(q.bestAnswer || grading.modelAnswer));
      var why = oneLine(stripCitations(q.rationale || grading.rationale));
      if (stem && (options.length || answer)) out.push({
        q: stem, o: options, hint: oneLine(stripCitations(q.hint)),
        type: q.type || "multiple_choice", a: answer, why: options.length ? "" : why, ch: 0,
        qid: questionId(stem)
      });
    });
    return out;
  }

  /** data/<slug>/flashcards.json (`cards[]` with chapter, chapterTitle, front, back). */
  function normalizeCards(doc) {
    var out = [];
    ((doc && doc.cards) || []).forEach(function (c) {
      if (!c || typeof c !== "object") return;
      var front = oneLine(stripCitations(c.front));
      var back = oneLine(stripCitations(c.back));
      if (!front || !back) return;
      out.push({
        front: front,
        back: back,
        ch: c.chapter || 0,
        chTitle: oneLine(stripCitations(c.chapterTitle))
      });
    });
    return out;
  }

  function turkish(text) {
    var letters = 0, special = 0;
    str(text).split("").forEach(function (c) {
      if (/[a-zA-Z\u00c0-\u024f]/.test(c)) letters += 1;
      if (/[\u011f\u00fc\u015f\u0131\u00f6\u00e7\u011e\u00dc\u015e\u0130\u00d6\u00c7]/.test(c)) special += 1;
    });
    if (!letters) return "tr";
    return special / letters >= 0.02 ? "tr" : "en";
  }

  function slugify(text) {
    var map = { "\u00e7": "c", "\u011f": "g", "\u0131": "i", "\u00f6": "o", "\u015f": "s", "\u00fc": "u",
                "\u00e2": "a", "\u00ee": "i", "\u00fb": "u" };
    var slug = str(text).toLowerCase().replace(/[\u00e7\u011f\u0131\u00f6\u015f\u00fc\u00e2\u00ee\u00fb]/g,
      function (c) { return map[c]; })
      .replace(/[\u0300-\u036f]/g, "")  // "İ".toLowerCase() is "i" plus a combining dot
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
    return slug || "notebooklm-app";
  }

  /**
   * The payload the app renders. `input`:
   *   title, sourcesText, notesText            what the popup shows and the user can edit
   *   plan, quiz, chat, cards                  optional JSON files from this repository's pipeline
   */
  function buildPayload(input) {
    input = input || {};
    var title = oneLine(input.title) || "NotebookLM defteri";
    var slug = slugify(input.title || input.notebookId || title);
    var sources = parseSources(input.sourcesText);
    var chapters = [];

    var plan = input.plan;
    if (plan && Array.isArray(plan.chapters)) {
      plan.chapters.forEach(function (ch, i) {
        if (!ch || typeof ch !== "object") return;
        chapters.push({
          n: i + 1,
          title: oneLine(stripCitations(ch.title)) || "Bölüm " + (i + 1),
          summary: oneLine(stripCitations(ch.summary)),
          objectives: (ch.objectives || []).map(function (o) { return oneLine(stripCitations(o)); })
            .filter(Boolean),
          notes: blocksFrom((ch.grounding && ch.grounding.answer) || ch.notes || ""),
          sources: []
        });
      });
    }

    if (!chapters.length) {
      parseNotes(input.notesText).forEach(function (n, i) {
        chapters.push({
          n: i + 1,
          title: n.title || "Not " + (i + 1),
          summary: "",
          objectives: [],
          notes: blocksFrom(n.body),
          sources: []
        });
      });
    }

    if (!chapters.length) {
      chapters.push({
        n: 1,
        title: title,
        summary: "",
        objectives: [],
        notes: sources.map(function (s) { return { li: s.title }; }),
        sources: sources
      });
    }

    var quiz = normalizeQuestions(input.quiz);
    var cards = normalizeCards(input.cards);
    if (!cards.length && input.chat && Array.isArray(input.chat.items)) {
      cards = input.chat.items.filter(function (it) { return it && it.q && it.a; })
        .map(function (it) {
          return {
            front: oneLine(stripCitations(it.q)),
            back: oneLine(stripCitations(it.a)),
            ch: it.chapter || 0,
            chTitle: oneLine(stripCitations(it.chapterTitle))
          };
        });
    }
    if (!cards.length) {
      cards = quiz.filter(function (q) {
        return q.o.some(function (o) { return o.ok; });
      }).map(function (q) {
        var right = q.o.filter(function (o) { return o.ok; })[0];
        return {
          front: q.q,
          back: right.t + (right.why ? ". " + right.why : ""),
          ch: q.ch || 0,
          chTitle: ""
        };
      });
    }
    cards.forEach(function (c, i) { c.id = slug + ":" + (i + 1); });

    var haystack = title + " " + chapters.map(function (ch) { return ch.title + " " + ch.summary; }).join(" ");
    return {
      storageKey: slug,
      brand: { name: "NotebookLM", short: "NLM", tagline: "", siteUrl: "" },
      course: { slug: slug, title: title, subject: "", code: "" },
      passMark: 0.7,
      colors: COLORS,
      chapters: chapters,
      cards: cards,
      quiz: quiz,
      units: {},
      sources: sources,
      counts: { chapters: chapters.length, cards: cards.length, quiz: quiz.length },
      lang: turkish(haystack)
    };
  }

  function escapeHtml(text) {
    return str(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }

  /** The page `scripts/build_study_app.py`'s render_app() writes, with the extension's data. */
  function renderPage(payload, shell) {
    shell = shell || root.STUDY_SHELL;
    if (!shell) throw new Error("app shell missing");
    var data = JSON.stringify(payload).replace(/</g, "\\u003c")
      .replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    var colors = payload.colors || COLORS;
    var css = shell.css.split("__PRIMARY__").join(colors.primary)
      .split("__ACCENT__").join(colors.accent).split("__PAPER__").join(colors.paper);
    var tr = payload.lang === "tr";
    var note = tr
      ? "Kaynak: NotebookLM defteri, ders notları ve testler. İlerleme yalnızca bu cihazda tutulur."
      : "Source: the NotebookLM notebook, its notes and quizzes. Progress stays on this device.";
    return shell.html
      .split("__LANG__").join(tr ? "tr" : "en")
      .split("__TITLE__").join(escapeHtml(payload.course.title))
      .split("__BRAND__").join(escapeHtml(payload.brand.name))
      .split("__DESCRIPTION__").join(escapeHtml(payload.course.title + " · " + payload.brand.name))
      .split("__CSS__").join(css)
      .split("__DATA__").join(data)
      .split("__JS__").join(shell.js)
      .split("__FOOTER__").join(escapeHtml(note));
  }

  root.NLMApp = {
    COLORS: COLORS,
    blocksFrom: blocksFrom,
    parseSources: parseSources,
    parseNotes: parseNotes,
    normalizeQuestions: normalizeQuestions,
    normalizeCards: normalizeCards,
    slugify: slugify,
    buildPayload: buildPayload,
    renderPage: renderPage,
    escapeHtml: escapeHtml
  };
})(typeof window !== "undefined" ? window : globalThis);
