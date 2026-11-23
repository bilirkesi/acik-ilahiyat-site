/**
 * NotebookLM Study App Exporter - popup.
 *
 * Flow: capture the open notebook tab (best effort) -> the fields stay editable -> build the same
 * single-file app `scripts/build_study_app.py` writes and download it. Nothing leaves the browser.
 */
(function () {
  "use strict";

  var NOTEBOOK_URL = /^https:\/\/(notebooklm|notebook)\.google\.com\//;
  var state = { plan: null, quiz: null, chat: null, cards: null };
  var tab = null;

  function $(id) { return document.getElementById(id); }

  function status(message, kind) {
    var el = $("status");
    el.textContent = message;
    el.className = "status" + (kind ? " " + kind : "");
  }

  async function findTab() {
    try {
      var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = tabs && tabs[0];
    } catch (e) {
      tab = null;
    }
    var where = $("where");
    if (tab && NOTEBOOK_URL.test(tab.url || "")) {
      where.textContent = "Açık defter: " + (tab.title || tab.url);
      return true;
    }
    where.textContent = "NotebookLM sekmesi açık değil. Bir defter açın, alanları elle doldurun ya da ders verisi yükleyin.";
    $("capture").disabled = true;
    return false;
  }

  async function capture() {
    if (!tab) return;
    status("Sayfa okunuyor…");
    try {
      var result = await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["capture.js"] });
      var got = result && result[0] && result[0].result;
      if (!got || got.error) {
        status("Bu sayfa okunamadı. Alanları elle doldurabilirsiniz.", "bad");
        return;
      }
      if (got.title) $("title").value = got.title;
      $("sources").value = (got.sources || []).map(function (s) {
        return s.url ? s.title + " | " + s.url : s.title;
      }).join("\n");
      $("notes").value = (got.notes || []).map(function (n) {
        return (n.title ? n.title + "\n" : "") + n.text;
      }).join("\n\n---\n\n");
      var found = (got.sources || []).length + " kaynak, " + (got.notes || []).length + " not";
      status(found + " bulundu. Gerekirse düzeltip indirin.", "good");
    } catch (e) {
      status("Sayfa okunamadı: " + (e && e.message ? e.message : e), "bad");
    }
  }

  /** The pipeline's JSON files, merged by name; the popup never uploads them anywhere. */
  async function readFiles(event) {
    var files = Array.prototype.slice.call(event.target.files || []);
    if (!files.length) return;
    var names = [];
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var doc;
      try {
        doc = JSON.parse(await file.text());
      } catch (e) {
        status(file.name + " okunamadı (geçerli JSON değil).", "bad");
        return;
      }
      var name = file.name.toLowerCase();
      if (name.indexOf("study_plan") >= 0 || (doc && doc.chapters)) state.plan = doc;
      else if (name.indexOf("quiz") >= 0 || (doc && doc.questions)) state.quiz = doc;
      else if (name.indexOf("chat") >= 0 || (doc && doc.items)) state.chat = doc;
      else if (name.indexOf("flashcard") >= 0 || (doc && doc.cards)) state.cards = doc;
      else continue;
      names.push(file.name);
    }
    if (state.plan && !$("title").value && state.plan.course) $("title").value = state.plan.course;
    status(names.length ? names.join(", ") + " yüklendi." : "Tanınan dosya yok.", names.length ? "good" : "bad");
  }

  function download(html, name) {
    var url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }

  function build() {
    var payload = NLMApp.buildPayload({
      title: $("title").value,
      sourcesText: $("sources").value,
      notesText: $("notes").value,
      plan: state.plan,
      quiz: state.quiz,
      chat: state.chat,
      cards: state.cards,
      notebookId: tab && NOTEBOOK_URL.test(tab.url || "") ? tab.url : ""
    });
    var html = NLMApp.renderPage(payload, window.STUDY_SHELL);
    download(html, payload.course.slug + ".html");
    status(payload.counts.chapters + " bölüm, " + payload.counts.cards + " kart, " +
      payload.counts.quiz + " soru indirildi. Dosya çevrimdışı açılır.", "good");
  }

  document.addEventListener("DOMContentLoaded", async function () {
    await findTab();
    $("capture").addEventListener("click", capture);
    $("files").addEventListener("change", readFiles);
    $("download").addEventListener("click", build);
  });
})();
