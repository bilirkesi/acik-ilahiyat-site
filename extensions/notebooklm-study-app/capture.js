/**
 * NotebookLM Study App Exporter - page capture.
 *
 * Injected into the open notebook tab by the popup (`chrome.scripting.executeScript`), so its last
 * expression is the value the popup receives. The page is a web app whose markup Google changes;
 * everything here is a best effort that only pre-fills the popup's editable fields. A wrong guess
 * costs one edit, never a broken export.
 */
(function () {
  "use strict";

  var NOTEBOOK_HOST = /(^|\.)notebooklm\.google\.com$|(^|\.)notebook\.google\.com$/;
  if (!NOTEBOOK_HOST.test(location.hostname)) {
    return { error: "not a NotebookLM page" };
  }

  var UI_WORDS = [
    "add source", "kaynak ekle", "add note", "not ekle", "discover sources", "keşfet",
    "create notebook", "defter oluştur", "upload", "yükle", "notebook guide", "defter kılavuzu",
    "select all", "tümünü seç", "search", "ara", "settings", "ayarlar"
  ];

  function text(el) {
    return (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  }

  function usable(title) {
    if (!title || title.length < 3 || title.length > 160) return false;
    var low = title.toLowerCase();
    return !UI_WORDS.some(function (word) { return low === word || low.indexOf(word) === 0; });
  }

  var id = (location.pathname.match(/\/notebook\/([^\/?#]+)/) || [])[1] || "";
  var title = (document.title || "").replace(/\s*[-\u2013|]\s*(NotebookLM|Gemini Notebook).*$/i, "").trim();
  if (!title) {
    var h1 = document.querySelector("h1");
    title = h1 ? text(h1) : "";
  }

  // Sources: real links first (they carry the URL), then the source list's own rows.
  var sources = [], seen = {};
  function addSource(name, url) {
    name = (name || "").replace(/\s+/g, " ").trim();
    if (!usable(name)) return;
    var key = name.toLowerCase();
    if (seen[key]) return;
    seen[key] = 1;
    sources.push({ title: name, url: /^https?:\/\//i.test(url || "") ? url : "" });
  }

  Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (a) {
    var href = a.href || "";
    if (!/^https?:\/\//i.test(href)) return;
    if (/google\.com\/(notebook|accounts|support|search)/i.test(href)) return;
    var label = text(a) || a.getAttribute("aria-label") || "";
    addSource(label, href);
  });

  Array.prototype.forEach.call(
    document.querySelectorAll('[class*="source" i], [data-test-id*="source" i]'),
    function (el) {
      if (el.children.length > 3) return;  // a container, not a row
      var name = text(el);
      if (!usable(name)) return;
      var link = el.querySelector("a[href^='http']");
      addSource(name, link ? link.href : "");
    }
  );

  // Notes: the notes panel's cards. Only blocks long enough to be a note, never the chat.
  var notes = [], seenNotes = {};
  Array.prototype.forEach.call(
    document.querySelectorAll('[class*="note" i], [role="article"], [data-test-id*="note" i]'),
    function (el) {
      var body = (el.innerText || "").replace(/[ \t]+/g, " ").trim();
      if (body.length < 200 || body.length > 20000) return;
      if (/notebooklm|gemini/i.test(body.slice(0, 40)) && body.length < 260) return;
      var head = body.split(/\r?\n/)[0].replace(/^#+\s*/, "").slice(0, 120);
      var key = body.slice(0, 120).toLowerCase();
      if (seenNotes[key]) return;
      seenNotes[key] = 1;
      notes.push({ title: head, text: body });
    }
  );

  var selection = "";
  try { selection = String(window.getSelection() || "").trim(); } catch (e) { selection = ""; }
  if (selection.length > 200 && !notes.length) {
    notes.push({ title: selection.split(/\r?\n/)[0].slice(0, 120), text: selection });
  }

  return {
    ok: true,
    id: id,
    url: location.href,
    title: title,
    sources: sources.slice(0, 200),
    notes: notes.slice(0, 40)
  };
})();
