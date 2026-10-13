/* Kişisel Üniversite: statik çalışma sitesi. window.UNIVERSITY ve window.COURSES'u data.js'ten okur. Arka uç yoktur. */
(function () {
  "use strict";

  const U = window.UNIVERSITY || {};
  const COURSES = window.COURSES || [];
  const INTERACTIVE = window.INTERACTIVE || {};
  const CG = window.CG || { items: [], edges: {} };
  const MINDMAPS = window.MINDMAPS || {};
  const DEFAULT_COLORS = { primary: "#1b2a4a", accent: "#b08d4a", paper: "#f8f4ea" };
  const slugify = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // ---- yapılandırma (university.json'dan, build.py tarafından enjekte edilir) ----
  const CONFIG = {
    name: U.name || "Kişisel Üniversite",
    tagline: U.tagline || "",
    headline: U.headline || "",
    issuer: U.issuer || U.name || "Kişisel Üniversite",
    passMark: typeof U.passMark === "number" ? (U.passMark > 1 ? U.passMark / 100 : U.passMark) : 0.7,
    codePrefix: U.codePrefix || "PU",
    colors: Object.assign({}, DEFAULT_COLORS, U.colors || {}),
    showNotebookLinks: U.showNotebookLinks !== false,
    totalCourses: Math.max(COURSES.length, U.plannedCourses || 0),
    storageKey: "pu." + (slugify(U.name) || "university") + ".v1",
  };

  // Kapı kancası. Herkese true döner. Dersleri veya belgeyi üyelere özel
  // yapmak için gövdeyi değiştirin (örneğin URL'de veya çerezde bir token kontrolü).
  function canAccess(feature) { // feature: "quiz" | "certificate"
    return true;
  }

  // Paleti uygula. Varsayılanlar sayfanın tam stil değerlerini korur.
  (function applyColors() {
    const r = document.documentElement.style, c = CONFIG.colors;
    if (c.primary !== DEFAULT_COLORS.primary) { r.setProperty("--navy", c.primary); r.setProperty("--navy-2", `color-mix(in srgb, ${c.primary} 80%, white)`); }
    if (c.accent !== DEFAULT_COLORS.accent) { r.setProperty("--gold", c.accent); r.setProperty("--gold-soft", `color-mix(in srgb, ${c.accent} 32%, white)`); }
    if (c.paper !== DEFAULT_COLORS.paper) r.setProperty("--ivory", c.paper);
  })();

  const bySlug = Object.fromEntries(COURSES.map((c) => [c.slug, c]));
  const app = document.getElementById("app");

  // ---- CourseGraph yerel arama (coursegraph.js) -----------------------------
  const TYPE_LABEL = {
    course: "Ders",
    chapter: "Bölüm",
    concept: "Kavram",
    event: "Olay",
    quiz_question: "Test",
    exam_question: "Sınav",
    quiz: "Quiz",
    exam: "Sınav",
    artifact: "Kaynak",
    past_exam: "Çıkmış Vize",
    past_question: "Çıkmış Soru",
    unit: "Ünite",
    keyword: "Anahtar",
  };
  const TYPE_RANK = { course: 0, chapter: 1, concept: 2, quiz_question: 3, exam_question: 4, past_question: 5, unit: 6, keyword: 7, event: 8, artifact: 9, past_exam: 10, quiz: 11, exam: 12 };

  const CG_FOLD = { "ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "I": "i", "ö": "o", "Ö": "o", "ş": "s", "Ş": "s", "ü": "u", "Ü": "u", "â": "a", "Â": "a", "î": "i", "Î": "i", "û": "u", "Û": "u" };
  const fold = (s) => String(s || "").replace(/[çÇğĞıİIöÖşŞüÜâÂîÎûÛ]/g, (ch) => CG_FOLD[ch]).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const tokenize = (s) => fold(s).split(/\s+/).filter(Boolean);
  const hayOf = (it) => it.hay || tokenize([it.title, it.snippet, it.definition, it.answer, it.course].filter(Boolean).join(" ")).join(" ");

  // ---- zihin haritası (mindmaps.js) ------------------------------------------
  function courseMaps(slug) {
    const d = MINDMAPS[slug];
    return (d && d.mindmaps) || [];
  }
  function pickMap(slug, preferId) {
    const maps = courseMaps(slug);
    if (!maps.length) return null;
    const byPref = maps.find((m) => m.id === preferId);
    if (byPref) return byPref;
    return maps.find((m) => m.id === "panel-chapters") || maps.find((m) => m.id === "graph-derived") || maps[0];
  }
  function mapTabsHtml(slug, activeId) {
    const maps = courseMaps(slug);
    if (maps.length < 2) return "";
    return `<div class="mm-tabs" role="tablist">` + maps.map((m) =>
      `<button type="button" class="mm-tab${m.id === activeId ? " active" : ""}" role="tab" data-mm="${esc(m.id)}" aria-selected="${m.id === activeId}">${esc(m.title || m.id)}</button>`
    ).join("") + `</div>`;
  }
  function mindmapSectionHtml(slug, opts) {
    const o = opts || {};
    const maps = courseMaps(slug);
    if (!maps.length) return "";
    const active = pickMap(slug, o.preferId || "panel-chapters");
    const focusCh = o.chapter || null;
    return `<section class="mindmap-section" data-mm-course="${esc(slug)}" data-mm-id="${esc(active.id)}"${focusCh ? ` data-mm-chapter="${focusCh}"` : ""}>
      <div class="mm-head">
        <h2>${esc(o.title || "Zihin haritası")}</h2>
        <p class="muted">${esc(o.lead || "Bölümler, kavramlar ve ilişkiler. Düğüm tıklayınca ilgili bölüme geçin.")}</p>
      </div>
      ${mapTabsHtml(slug, active.id)}
      <div class="mm-canvas" id="mm-canvas" aria-label="Zihin haritası"></div>
      <p class="mm-detail muted" id="mm-detail">Düğüm seçin.</p>
    </section>`;
  }

  function scoreItem(it, terms, raw) {
    const hay = hayOf(it);
    const title = fold(it.title || "");
    let score = 0;
    for (const t of terms) {
      if (!hay.includes(t)) return 0;
      if (title.includes(t)) score += title === t ? 12 : 6;
      else score += 2;
    }
    if (raw && hay.includes(raw)) score += 3;
    score += (TYPE_RANK[it.type] !== undefined ? 8 - TYPE_RANK[it.type] : 0);
    if (it.course && bySlug[it.course]) score += 1;
    return score;
  }

  function cgSearch(q, opts) {
    const o = opts || {};
    const raw = fold(q || "").trim();
    if (!raw) return [];
    const terms = raw.split(/\s+/).filter((t) => t.length >= 2);
    if (!terms.length) return [];
    const limit = o.limit || 40;
    const hits = [];
    for (const it of CG.items || []) {
      if (o.type && it.type !== o.type) continue;
      if (o.course && it.course !== o.course) continue;
      const s = scoreItem(it, terms, raw);
      if (s > 0) hits.push({ item: it, score: s });
    }
    hits.sort((a, b) => b.score - a.score || (a.item.title || "").localeCompare(b.item.title || "", "tr"));
    return hits.slice(0, limit);
  }

  function cgRelated(id, limit) {
    const n = limit || 6;
    const ids = (CG.edges && CG.edges[id]) || [];
    const out = [];
    const seen = new Set();
    for (const other of ids) {
      if (seen.has(other)) continue;
      seen.add(other);
      const it = (CG.items || []).find((x) => x.id === other);
      if (it) out.push(it);
      if (out.length >= n) break;
    }
    return out;
  }

  // ---- yardımcılar ----------------------------------------------------------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const pct = (x) => Math.round(x * 100) + "%";
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const code = (i) => `${CONFIG.codePrefix} ${101 + i * 10}`;
  const noun = (c, n) => (c.kind === "sources" ? "kaynak" : "ders");
  const byline = (c) => [c.professor, c.school].filter(Boolean).join(", ");
  const isYouTube = (u) => /youtube\.com|youtu\.be/.test(u || "");

  function load() {
    try { return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {}; } catch (e) { return {}; }
  }
  function save(p) {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(p)); } catch (e) { /* özel mod: ilerleme yalnızca bu sekmede yaşar */ }
  }
  let progress = load();

  function courseStatus(slug) {
    const r = progress[slug];
    if (!r) return { label: "Başlanmadı", cls: "none" };
    return r.passed ? { label: "Geçti " + pct(r.best), cls: "pass" } : { label: "En iyi " + pct(r.best), cls: "fail" };
  }
  const passedCount = () => COURSES.filter((c) => progress[c.slug] && progress[c.slug].passed).length;

  function typeset(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }, { left: "$", right: "$", display: false }],
        throwOnError: false,
        output: "mathml", // yerel MathML: KaTeX stil sayfası veya font gerekmez
      });
    }
  }

  // NotebookLM notları için en küçük markdown: başlıklar, madde imleri, kalın.
  function md(text) {
    const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    let html = "", inList = false;
    for (const raw of String(text || "").split("\n")) {
      const line = raw.trim();
      const bullet = line.match(/^[*-]\s+(.*)/);
      if (bullet) { if (!inList) { html += "<ul>"; inList = true; } html += "<li>" + inline(bullet[1]) + "</li>"; continue; }
      if (inList) { html += "</ul>"; inList = false; }
      if (!line || /^[-*_]{3,}$/.test(line)) continue;
      const h = line.match(/^#{1,6}\s+(.*)/);
      html += h ? "<h4>" + inline(h[1]) + "</h4>" : "<p>" + inline(line) + "</p>";
    }
    return html + (inList ? "</ul>" : "");
  }

  // ---- arma ----------------------------------------------------------------
  // Özgün marka: kalkan, açık kitap, on uçlu yıldız. Hiçbir okulun armasına dayanmaz.
  function crest() {
    const P = CONFIG.colors.primary, A = CONFIG.colors.accent;
    const star = Array.from({ length: 20 }, (_, i) => {
      const r = i % 2 ? 7 : 16, a = (Math.PI / 10) * i - Math.PI / 2;
      return (60 + r * Math.cos(a)).toFixed(1) + "," + (40 + r * Math.sin(a)).toFixed(1);
    }).join(" ");
    return `<svg viewBox="0 0 120 144" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(CONFIG.name)} arması">
      <path d="M8 6h104v62c0 38-26 60-52 72C34 128 8 106 8 68z" fill="${P}" stroke="${A}" stroke-width="4"/>
      <path d="M16 14h88v54c0 32-21 51-44 61-23-10-44-29-44-61z" fill="none" stroke="${A}" stroke-width="1.2" opacity=".7"/>
      <polygon points="${star}" fill="${A}"/>
      <path d="M26 78c12-6 24-6 34 0v34c-10-6-22-6-34 0z" fill="#f8f4ea"/>
      <path d="M94 78c-12-6-24-6-34 0v34c10-6 22-6 34 0z" fill="#efe6d2"/>
      <path d="M60 78v34" stroke="${A}" stroke-width="1.5"/>
      <g stroke="${P}" stroke-width="1" opacity=".35"><path d="M32 86c8-3 16-3 22 0M32 93c8-3 16-3 22 0M32 100c8-3 16-3 22 0M66 86c6-3 14-3 22 0M66 93c6-3 14-3 22 0M66 100c6-3 14-3 22 0"/></g>
      <text x="60" y="132" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="9" letter-spacing="2" fill="${A}">${new Date().getFullYear()}</text>
    </svg>`;
  }
  document.querySelectorAll("[data-crest]").forEach((el) => (el.innerHTML = crest()));

  function notebookButton(c, ghost) {
    return CONFIG.showNotebookLinks && c.notebook ? `<a class="btn${ghost ? " ghost" : ""}" href="${esc(c.notebook)}" target="_blank" rel="noopener">NotebookLM'de aç</a>` : "";
  }

  // ---- görünümler ------------------------------------------------------------
  function viewCatalog() {
    const sources = COURSES.reduce((n, c) => n + c.sourceCount, 0);
    const allLectures = COURSES.every((c) => c.kind !== "sources");
    const chapters = COURSES.reduce((n, c) => n + c.chapters.length, 0);
    const total = CONFIG.totalCourses;
    const cards = COURSES.map((c, i) => {
      const s = courseStatus(c.slug);
      return `<a class="card" href="#/course/${c.slug}">
        <span class="code">${esc(code(i))} · ${esc(c.subject)}</span>
        <h3>${esc(c.course)}</h3>
        ${byline(c) ? `<span class="by">${esc(byline(c))}</span>` : ""}
        <span class="meta"><span>${c.sourceCount} ${noun(c, c.sourceCount)} · ${c.chapters.length} bölüm</span><span class="badge ${s.cls}">${s.label}</span></span>
      </a>`;
    }).join("");
    const pending = Math.max(0, total - COURSES.length);
    const ghost = Array.from({ length: pending }, () => `<div class="card pending"><span class="code">Hazırlanıyor</span><h3>Ders yakında</h3><span class="by">Defter hazırlanıyor</span></div>`).join("");
    const headline = CONFIG.headline ? esc(CONFIG.headline) : `${total} ders.<br>Tek bir çalışma masası.`;
    const finish = total === 1 ? "Onu geç" : `Hepsini (${total} dersi) tamamla`;
    return `<section class="hero">
        <div>
          <p class="eyebrow">Ders kataloğu</p>
          <h1>${headline}</h1>
          <p class="lead">Buradaki her ders kendi NotebookLM defterinde yaşar. Ders planını oku. Her bölümü çalış. Sınavı geç. ${finish} ve Tamamlama Belgesi'ni kazan.</p>
          <div class="stats">
            <div class="stat"><b>${COURSES.length}</b><span>Açık ders</span></div>
            <div class="stat"><b>${sources}</b><span>${allLectures ? "Ders" : "Kaynak"}</span></div>
            <div class="stat"><b>${chapters}</b><span>Bölüm</span></div>
            <div class="stat"><b>${passedCount()}</b><span>Geçilen</span></div>
          </div>
        </div>
        <div class="crest-lg">${crest()}</div>
      </section>
      <div class="catalog">${cards}${ghost}</div>`;
  }

  function courseLead(c) {
    const parts = [];
    if (c.professor && c.school) parts.push(`Ders ${esc(c.professor)} tarafından ${esc(c.school)} bünyesinde verilmektedir.`);
    else if (byline(c)) parts.push(`${esc(byline(c))} kaynağından derlenmiştir.`);
    if (c.kind !== "sources" && isYouTube(c.playlist)) parts.push("Her ders YouTube'da ücretsizdir.");
    parts.push(`Bu sayfa ${c.sourceCount} ${noun(c, c.sourceCount)}yı ${c.chapters.length} bölüme düzenler; çalışma notları ve bir final sınavı içerir.`);
    return parts.join(" ");
  }

  function viewCourse(c) {
    const s = courseStatus(c.slug);
    const chapters = c.chapters.map((ch, i) => `<li>
        <div class="ch-text">
          <h3><a href="#/course/${c.slug}/chapter/${i + 1}">${esc(ch.title)}</a></h3>
          <p class="count">${ch.lectures.length} ${noun(c, ch.lectures.length)}</p>
          <p>${esc(ch.summary)}</p>
          <ul class="objectives">${ch.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
          ${ch.image ? `<figure class="plate"><img src="${esc(ch.image)}" alt="${esc(ch.title)} infografiği" data-zoom loading="lazy"><figcaption><b>Şekil ${i + 1}.</b> ${esc(ch.title)}. Bu bölümün ${ch.lectures.length} ${noun(c, ch.lectures.length)}ından NotebookLM ile üretildi.</figcaption></figure>` : ""}
        </div>
      </li>`).join("");
    const credit = c.playlist
      ? `<p class="muted" style="font-size:.82rem;margin:.9rem 0 0">${c.kind === "sources" ? "Kaynaklar" : "Dersler"}: <a href="${esc(c.playlist)}" target="_blank" rel="noopener">özgün kaynak</a>.${byline(c) ? ` Tüm hakları ${esc(byline(c))}ye aittir.` : " Tüm hakları özgün sahiplerine aittir."}</p>`
      : `<p class="muted" style="font-size:.82rem;margin:.9rem 0 0">Bu ${noun(c, 2)}lerin tüm hakları özgün sahiplerine aittir.</p>`;
    return `<p class="crumbs"><a href="#/">Katalog</a> / ${esc(c.subject)}</p>
      <section class="course-head">
        <div>
          <p class="eyebrow">${esc(c.subject)} · Ders planı</p>
          <h1>${esc(c.course)}</h1>
          <p class="lead muted">${courseLead(c)}</p>
          ${c.note ? `<p class="muted"><em>${esc(c.note)}</em></p>` : ""}
        </div>
        <aside class="panel">
          <dl>
            ${c.professor ? `<dt>Öğretim üyesi</dt><dd>${esc(c.professor)}</dd>` : ""}
            ${c.school ? `<dt>Özgün ders</dt><dd>${esc(c.school)}</dd>` : ""}
            <dt>${cap(noun(c, 2))}</dt><dd>${c.sourceCount}</dd>
            <dt>Sınav</dt><dd>${c.quiz.length} soru</dd>
            <dt>Durum</dt><dd><span class="badge ${s.cls}">${s.label}</span></dd>
          </dl>
          <div class="btn-row">
            ${notebookButton(c)}
            <a class="btn ghost" href="#/ozet">Ders özeti</a>
            <a class="btn ghost" href="#/course/${c.slug}/quiz">Final (oyun)</a>
            <a class="btn ghost" href="#/course/${c.slug}/exams">Çıkmış / sınavlar</a>
          </div>
          ${credit}
        </aside>
      </section>
      ${mindmapSectionHtml(c.slug, { title: "Ders zihin haritası", lead: "Bölüm başlıkları ve alt kavramlar. Bölüm düğümüne tıklayınca o bölüme geçilir." })}
      <h2>Bölümler</h2>
      <ol class="syllabus">${chapters}</ol>`;
  }

  function viewChapter(c, n) {
    const ch = c.chapters[n - 1];
    if (!ch) return viewNotFound();
    // Bir kaynağı yalnızca URL'si varsa bağla. Belgelerin, PDF'lerin ve yapıştırılmış metinlerin çoğu URL taşımaz.
    const lectures = ch.lectures.map((l, i) => {
      const inner = `<span class="n">${i + 1}</span><span>${esc(l.title)}</span>`;
      return `<li>${l.url ? `<a href="${esc(l.url)}" target="_blank" rel="noopener">${inner}</a>` : `<span class="src">${inner}</span>`}</li>`;
    }).join("");
    const prev = n > 1 ? `<a class="btn ghost" href="#/course/${c.slug}/chapter/${n - 1}">Önceki bölüm</a>` : `<a class="btn ghost" href="#/course/${c.slug}">Ders planına dön</a>`;
    const next = n < c.chapters.length ? `<a class="btn" href="#/course/${c.slug}/chapter/${n + 1}">Sonraki bölüm</a>` : `<a class="btn" href="#/course/${c.slug}/quiz">Sınavı çöz</a>`;
    const nb = notebookButton(c);
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / ${n}. Bölüm</p>
      <p class="eyebrow">${esc(c.course)} · ${n}. Bölüm</p>
      <h1>${esc(ch.title)}</h1>
      <p class="lead muted" style="font:1.15rem/1.6 var(--serif)">${esc(ch.summary)}</p>
      ${ch.image ? `<figure class="figure"><img src="${esc(ch.image)}" alt="${esc(ch.title)} infografiği" data-zoom><figcaption><b>Şekil ${n}.</b> Yalnızca bu bölümün ${noun(c, 2)}lerinden NotebookLM ile üretildi.</figcaption></figure>` : ""}
      ${chapterPanel(c, n)}
      ${mindmapSectionHtml(c.slug, {
        title: n + ". bölüm zihin haritası",
        lead: "Bu bölümün konu ağacı. Vurgulu düğüm aktif bölümdür; komşularına tıklayarak gezinin.",
        chapter: n,
        preferId: "panel-chapters",
      })}
      <div class="two-col">
        <div>
          <h2>Çalışma notları</h2>
          <div class="notes">${ch.notes ? md(ch.notes) : `<p class="muted">Bu bölümün çalışma notları henüz hazır değil.</p>`}</div>
        </div>
        <aside>
          <div class="panel">
            <h3>Öğrenme amaçları</h3>
            <ul class="objectives">${ch.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
          </div>
          <h3 style="margin-top:1.8rem">Bu bölümdeki ${noun(c, 2)}ler</h3>
          <ul class="lectures">${lectures}</ul>
          ${nb ? `<div class="btn-row">${nb}</div>` : ""}
        </aside>
      </div>
      <div class="pager">${prev}${next}</div>`;
  }

  // ---- sınav ----------------------------------------------------------------
  const GRADED = new Set(["multiple_choice", "multiple_select", "fill_in_the_blank"]);
  // Türkçe karakterleri ASCII karşılıklarına çevirip küçük harfe çevirerek karşılaştır.
  const TR_FOLD = { "ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "I": "i", "ö": "o", "Ö": "o", "ş": "s", "Ş": "s", "ü": "u", "Ü": "u", "â": "a", "Â": "a", "î": "i", "Î": "i", "û": "u", "Û": "u" };
  const norm = (s) => String(s || "").replace(/[çÇğĞıİIöÖşŞüÜâÂîÎûÛ]/g, (ch) => TR_FOLD[ch]).toLowerCase().replace(/\$/g, "").replace(/[^a-z0-9.%-]+/g, " ").trim();

  function questionHTML(q, i) {
    const head = `<div class="qn">Soru ${i + 1}${GRADED.has(q.type) ? "" : " · Tartışma, puanlanmaz"}</div><p class="qt">${esc(q.question || q.stem || "")}</p>`;
    if ((q.type === "multiple_choice" || q.type === "multiple_select") && Array.isArray(q.answerOptions)) {
      const type = q.type === "multiple_choice" ? "radio" : "checkbox";
      const opts = q.answerOptions.map((o, j) => `<label class="opt" data-opt="${j}"><input type="${type}" name="q${i}" value="${j}"><span>${esc(o.text)}</span></label><div class="rationale" data-rat="${j}" hidden>${esc(o.rationale || "")}</div>`).join("");
      return head + (q.type === "multiple_select" ? `<p class="muted" style="font-size:.85rem;margin-top:-.4rem">Doğru olan tüm seçenekleri işaretleyin.</p>` : "") + opts + (q.hint ? `<details class="hint"><summary>İpucu</summary>${esc(q.hint)}</details>` : "");
    }
    if (q.type === "fill_in_the_blank") {
      return head + `<input type="text" name="q${i}" autocomplete="off" placeholder="Cevabınız">` + (q.hint ? `<details class="hint"><summary>İpucu</summary>${esc(q.hint)}</details>` : "");
    }
    return head + `<textarea name="q${i}" placeholder="Cevabınızı yazın, gönderdikten sonra örnek cevapla karşılaştırın."></textarea>`;
  }

  function grade(q, i, form) {
    if ((q.type === "multiple_choice" || q.type === "multiple_select") && Array.isArray(q.answerOptions)) {
      const chosen = new Set([...form.querySelectorAll(`[name=q${i}]:checked`)].map((x) => +x.value));
      const right = new Set(q.answerOptions.map((o, j) => (o.isCorrect ? j : -1)).filter((j) => j >= 0));
      return chosen.size === right.size && [...right].every((j) => chosen.has(j));
    }
    if (q.type === "fill_in_the_blank") {
      const v = norm(form.querySelector(`[name=q${i}]`).value);
      return [q.bestAnswer, ...(q.acceptableAnswers || [])].some((a) => norm(a) === v);
    }
    return null;
  }

  function showFeedback(q, i, ok, box) {
    if ((q.type === "multiple_choice" || q.type === "multiple_select") && Array.isArray(q.answerOptions)) {
      q.answerOptions.forEach((o, j) => {
        const lab = box.querySelector(`[data-opt="${j}"]`);
        const picked = lab.querySelector("input").checked;
        if (o.isCorrect) lab.classList.add("correct");
        else if (picked) lab.classList.add("wrong");
        if (o.isCorrect || picked) box.querySelector(`[data-rat="${j}"]`).hidden = false;
      });
    }
    let fb = "";
    if (q.type === "fill_in_the_blank") fb = `<strong>Cevap:</strong> ${esc(q.bestAnswer)}. ${esc(q.rationale || "")}`;
    if (q.type === "short_answer" && q.grading) {
      fb = `<strong>Örnek cevap:</strong> ${esc(q.grading.modelAnswer)}` +
        (q.grading.requiredAttributes ? `<ul style="margin:.5rem 0 0">${q.grading.requiredAttributes.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : "");
    }
    if ((q.type === "multiple_choice" || q.type === "multiple_select") && q.solution) {
      fb = esc(q.solution);
    }
    if (fb || ok !== null) {
      const d = document.createElement("div");
      d.className = "feedback " + (ok === true ? "ok" : ok === false ? "no" : "");
      d.innerHTML = (ok === true ? "<strong>Doğru.</strong> " : ok === false ? "<strong>Tam değil.</strong> " : "") + fb;
      box.appendChild(d);
      typeset(d);
    }
    if (Array.isArray(q.chapterMeta) && q.chapterMeta.length) {
      const wrap = document.createElement("div");
      wrap.className = "solution-links";
      wrap.innerHTML = `<p class="solution-label">Çözüm · ilgili bölüm</p>` + q.chapterMeta.map((m) => {
        const slug = q._slug || q.course || "";
        const href = `#/course/${slug}/chapter/${m.n}`;
        return `<a class="solution-link" href="${href}">${esc(m.n)}. ${esc(m.title)}${m.summary ? `<span>${esc(m.summary)}</span>` : ""}</a>`;
      }).join("");
      box.appendChild(wrap);
    }
    box.querySelectorAll("input,textarea").forEach((x) => (x.disabled = true));
  }

  // ---- oyun modu sınavı (learnGitBranching golf ilhamlı) --------------------
  // progress[slug].game = { bestXp, bestStreak, bestTimeMs, runs }
  function gameStats(slug) {
    const r = progress[slug];
    return (r && r.game) || { bestXp: 0, bestStreak: 0, bestTimeMs: 0, runs: 0 };
  }
  function saveGameStats(slug, run) {
    const rec = progress[slug] || (progress[slug] = { best: 0, attempts: 0, passed: false, read: [] });
    const g = rec.game || (rec.game = { bestXp: 0, bestStreak: 0, bestTimeMs: 0, runs: 0 });
    g.bestXp = Math.max(g.bestXp, run.xp);
    g.bestStreak = Math.max(g.bestStreak, run.streak);
    if (run.timeMs > 0 && (g.bestTimeMs === 0 || run.timeMs < g.bestTimeMs)) g.bestTimeMs = run.timeMs;
    g.runs += 1;
    rec.best = Math.max(rec.best || 0, run.score);
    rec.passed = rec.passed || run.passed;
    rec.attempts = (rec.attempts || 0) + 1;
    rec.lastAt = new Date().toISOString();
    save(progress);
    return g;
  }

  function fmtMs(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
  }

  function quizHudHtml(c, idx, total) {
    const g = gameStats(c.slug);
    return `<div class="hud" id="quiz-hud" aria-live="polite">
      <div class="hud-item"><span class="hud-k">Soru</span><span class="hud-v" id="hud-idx">${idx + 1}/${total}</span></div>
      <div class="hud-item"><span class="hud-k">Doğru</span><span class="hud-v" id="hud-right">0</span></div>
      <div class="hud-item"><span class="hud-k">Seri</span><span class="hud-v" id="hud-streak">0</span></div>
      <div class="hud-item"><span class="hud-k">Puan</span><span class="hud-v" id="hud-xp">0</span></div>
      <div class="hud-item"><span class="hud-k">Süre</span><span class="hud-v" id="hud-time">0s</span></div>
      <div class="hud-item hud-best"><span class="hud-k">Rekor</span><span class="hud-v">${g.bestXp} XP · seri ${g.bestStreak}</span></div>
      <div class="hud-bar" aria-hidden="true"><i id="hud-bar" style="width:${(idx / total) * 100}%"></i></div>
    </div>`;
  }

  function viewQuiz(c) {
    if (!canAccess("quiz")) return viewGate("quiz");
    const graded = c.quiz.filter((q) => GRADED.has(q.type)).length;
    const r = progress[c.slug];
    const g = gameStats(c.slug);
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / Sınav</p>
      <div class="quiz-head">
        <div><p class="eyebrow">Oyun modu · Final</p><h1 style="margin:0">${esc(c.course)}</h1></div>
        <div class="muted" style="font-size:.9rem">${graded} puanlı soru · geçme ${pct(CONFIG.passMark)}${r ? ` · en iyi ${pct(r.best)}` : ""}</div>
      </div>
      <p class="muted">Sorular sırayla gelir. Her doğru <strong>+10</strong>; seri katlayarak bonus verir. Yanlış seriyi sıfırlar.</p>
      <div id="game-root" data-course="${esc(c.slug)}">
        ${quizHudHtml(c, 0, c.quiz.length)}
        <div id="game-stage"></div>
        <div id="result"></div>
      </div>`;
  }

  function bindQuiz(c) {
    const root = document.getElementById("game-root");
    const stage = document.getElementById("game-stage");
    if (!root || !stage) return;

    const questions = c.quiz;
    let idx = 0;
    let right = 0;
    let streak = 0;
    let bestStreakRun = 0;
    let xp = 0;
    let gradedDone = 0;
    let gradedRight = 0;
    const t0 = Date.now();
    let timer = null;
    const perQ = {}; // süreler

    const hud = (id) => document.getElementById(id);
    function paintHud() {
      hud("hud-idx").textContent = `${Math.min(idx + 1, questions.length)}/${questions.length}`;
      hud("hud-right").textContent = String(right);
      hud("hud-streak").textContent = String(streak);
      hud("hud-xp").textContent = String(xp);
      hud("hud-time").textContent = fmtMs(Date.now() - t0);
      const bar = hud("hud-bar");
      if (bar) bar.style.width = (idx / questions.length) * 100 + "%";
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(paintHud, 500);
    }

    function showQuestion(i) {
      const q = questions[i];
      if (!q) { finish(); return; }
      const qStart = Date.now();
      stage.innerHTML = `<div class="q game-q" data-q="${i}">${questionHTML(q, i)}
        <div class="btn-row game-actions">
          <button class="btn" type="button" id="check-ans">Kontrol et</button>
          <button class="btn ghost" type="button" id="skip-q" style="display:none">Sonraki</button>
        </div>
      </div>`;
      paintHud();
      const box = stage.querySelector(".game-q");
      const check = document.getElementById("check-ans");
      const skip = document.getElementById("skip-q");
      check.focus();
      check.onclick = () => {
        const ok = grade(q, i, stage);
        showFeedback(q, i, ok, box);
        perQ[i] = Date.now() - qStart;
        const isGraded = GRADED.has(q.type);
        if (isGraded) {
          gradedDone++;
          if (ok === true) {
            gradedRight++;
            right++;
            streak++;
            bestStreakRun = Math.max(bestStreakRun, streak);
            const bonus = streak >= 3 ? streak * 2 : 0;
            xp += 10 + bonus;
            box.classList.add("hit");
          } else {
            streak = 0;
            box.classList.add("miss");
          }
        } else {
          box.classList.add("skip-note");
        }
        check.hidden = true;
        skip.hidden = false;
        skip.textContent = i < questions.length - 1 ? "Sonraki soru" : "Sonucu gör";
        skip.focus();
        skip.onclick = () => { idx++; showQuestion(idx); };
        paintHud();
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
      skip.onclick = () => {
        if (!check.hidden) {
          // bilerek geç: seriyi bozmadan, puan yok
          streak = 0;
          paintHud();
        }
        idx++;
        showQuestion(idx);
      };
      startTimer();
    }

    function finish() {
      clearInterval(timer);
      const totalGraded = questions.filter((q) => GRADED.has(q.type)).length;
      const score = gradedDone ? gradedRight / gradedDone : 0;
      const passed = totalGraded > 0 && score >= CONFIG.passMark;
      const timeMs = Date.now() - t0;
      const avgMs = gradedDone ? Math.round(timeMs / Math.max(1, idx)) : 0;
      const run = { xp, streak: bestStreakRun, score, passed, timeMs, right: gradedRight, total: gradedDone };
      const g = saveGameStats(c.slug, run);
      const isRecord = xp >= g.bestXp && xp > 0;
      const box = document.getElementById("result");
      box.innerHTML = `<div class="result ${passed ? "pass" : "fail"} game-result">
        <p class="eyebrow" style="color:var(--gold-soft)">${passed ? "Geçti" : "Henüz geçemedi"}${isRecord ? " · Yeni rekor!" : ""}</p>
        <h2>${xp} XP · ${gradedRight}/${gradedDone} doğru · ${pct(score)}</h2>
        <ul class="game-stats">
          <li><b>${bestStreakRun}</b> en uzun seri</li>
          <li><b>${fmtMs(timeMs)}</b> toplam süre</li>
          <li><b>${fmtMs(avgMs)}</b> soru başına</li>
          <li><b>${g.bestXp}</b> rekor XP (${g.runs} deneme)</li>
        </ul>
        <p>${passed ? "Bu ders artık transkriptinizde." : `Geçmek için ${pct(CONFIG.passMark)} gerekir. Özet sayfasından tekrar edin.`}</p>
        <div class="btn-row"><a class="btn ghost" style="color:var(--ivory);border-color:var(--gold)" href="#/transcript">Transkript</a>
        <button class="btn ghost" style="color:var(--ivory);border-color:var(--gold)" type="button" id="retry">Tekrar oyna</button></div></div>`;
      document.getElementById("retry").onclick = () => route();
      const hudBar = document.getElementById("hud-bar");
      if (hudBar) hudBar.style.width = "100%";
      paintHud();
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showQuestion(0);
  }

  // ---- sınav hub + çıkmış vize/final/yaz (self-graded anımsama) --------------
  const PAST = () => (window.PAST_EXAMS || {});

  function pastFor(slug) {
    return (PAST()[slug] || []).slice().sort((a, b) => String(b.year || b.exam_id).localeCompare(String(a.year || a.exam_id)));
  }

  function examKindMeta(kind) {
    if (kind === "vize") return { title: "Vize", note: "Dönem içi üniteler; çıkmış vize arşivi varsa burada." };
    if (kind === "final") return { title: "Final", note: "Ders quiz bankası; oyun modunda puanlanır." };
    if (kind === "yaz") return { title: "Yaz Okulu", note: "Yaz dönemi hızlı tekrar testi." };
    return { title: kind, note: "" };
  }

  function viewExamHub(c) {
    const sessions = pastFor(c.slug);
    const totalPast = sessions.reduce((n, s) => n + (s.questions || []).length, 0);
    const quizN = (c.quiz || []).length;
    const cards = [
      {
        kind: "final",
        title: "Final (oyun modu)",
        desc: `${quizN} soru · anlık HUD, seri ve XP. Geçme notu ${pct(CONFIG.passMark)}.`,
        href: `#/course/${c.slug}/quiz`,
        badge: "Puanlanır",
      },
      {
        kind: "vize",
        title: "Çıkmış vize arşivi",
        desc: totalPast
          ? `${sessions.length} oturum · ${totalPast} soru · cevap anahtarlı puanlı mod.`
          : "Bu ders için çıkmış vize arşivi henüz yok.",
        href: sessions.length ? `#/course/${c.slug}/past/${encodeURIComponent(sessions[0].exam_id)}` : null,
        badge: totalPast ? "Puanlı" : "Yakında",
      },
      {
        kind: "yaz",
        title: "Yaz okulu tekrarı",
        desc: "Yaz dönemi için hızlı final turu; aynı oyun motorunu kullanır.",
        href: quizN ? `#/course/${c.slug}/quiz` : null,
        badge: "Tekrar",
      },
    ];
    const pastList = sessions.map((s) => {
      const n = (s.questions || []).length;
      return `<li class="past-row">
        <div>
          <a href="#/course/${c.slug}/past/${encodeURIComponent(s.exam_id)}"><strong>${esc(s.year || s.exam_id)}</strong>${s.group ? " · " + esc(s.group) + " grup" : ""} · ${esc(String(s.term || "guz").replace("guz", "Güz").replace("bahar", "Bahar").replace("yaz", "Yaz"))} vize</a>
          <div class="muted" style="font-size:.82rem">${n} soru${s.hasAnswerKey === false ? "" : " · cevap anahtarı var"}</div>
        </div>
        <a class="btn ghost" href="#/course/${c.slug}/past/${encodeURIComponent(s.exam_id)}">Çöz</a>
      </li>`;
    }).join("");
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / Sınavlar</p>
      <p class="eyebrow">Sınav modları</p>
      <h1>${esc(c.subject)}</h1>
      <p class="muted">Cevap anahtarı PDF'in son sayfasından alınmıştır. Puan, süre ve seri anlık HUD'da izlenir.</p>
      <div class="exam-cards">
        ${cards.map((x) => `<a class="exam-card${x.href ? "" : " disabled"}" ${x.href ? `href="${x.href}"` : 'aria-disabled="true"'}>
          <span class="exam-badge">${esc(x.badge)}</span>
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.desc)}</p>
        </a>`).join("")}
      </div>
      ${sessions.length ? `<h2>Çıkmış vize dönemleri</h2><ul class="past-list">${pastList}</ul>` : ""}`;
  }

  function viewPastExam(c, examId) {
    const sessions = pastFor(c.slug);
    const exam = sessions.find((s) => s.exam_id === examId) || sessions[0];
    if (!exam) return viewNotFound();
    const n = (exam.questions || []).length;
    const hasKey = exam.hasAnswerKey !== false && (exam.questions || []).some((q) => q.correct || (q.options || []).some((o) => o.isCorrect));
    const grp = exam.group && exam.group !== "A" ? ` · ${exam.group} grup` : "";
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / <a href="#/course/${c.slug}/exams">Sınavlar</a> / Çıkmış vize</p>
      <div class="quiz-head">
        <div><p class="eyebrow">Çıkmış vize${hasKey ? " · puanlı" : " · anımsama"}</p><h1 style="margin:0">${esc(exam.year || exam.exam_id)}${esc(grp)}</h1></div>
        <div class="muted" style="font-size:.9rem">${n} soru · ${hasKey ? "cevap anahtarı var (PDF son sayfa)" : "cevap anahtarı yok"}${exam.group ? " · grup " + esc(exam.group) : ""}</div>
      </div>
      <p class="muted">${hasKey ? "Doğru cevap otomatik işaretlenir. Puan, süre ve seri anlık HUD'da." : "Seçenekler PDF OCR olabilir; kendinizi işaretleyin."}</p>
      <div id="game-root" data-course="${esc(c.slug)}" data-exam="${esc(exam.exam_id)}" data-mode="past">
        ${quizHudHtml(c, 0, n)}
        <div id="game-stage"></div>
        <div id="result"></div>
      </div>`;
  }

  function pastQuestionHtml(q, i) {
    const letters = ["A", "B", "C", "D", "E", "F"];
    const opts = (q.options || []).map((o, j) => `<label class="opt" data-opt="${j}"><input type="radio" name="q${i}" value="${j}"><span><b>${esc(o.key || letters[j])})</b> ${esc(o.text || "")}</span></label>`).join("");
    const chLinks = (q.chapters || []).map((n) => `<a href="#/course/${q._slug}/chapter/${n}">${n}. bölüm</a>`).join(" · ");
    const kw = (q.keywords || []).map((k) => `<span class="chip">${esc(k)}</span>`).join("");
    return `<div class="qn">Soru ${i + 1}${q.unit ? ` · Ünite ${q.unit}` : ""}</div>
      <p class="qt">${esc(q.stem)}</p>
      ${opts ? opts : `<p class="muted">Bu soru için okunabilir seçenek metni yok. Aklınızdaki cevabı düşünüp alttaki butonla işaretleyin.</p>`}
      ${q.unitTitle ? `<p class="muted" style="font-size:.85rem;margin:.6rem 0 0">İlgili ünite: <strong>${esc(q.unitTitle)}</strong>${chLinks ? " · " + chLinks : ""}</p>` : ""}
      ${kw ? `<div class="chip-row">${kw}</div>` : ""}`;
  }

  function bindPastExam(c, examId) {
    const root = document.getElementById("game-root");
    const stage = document.getElementById("game-stage");
    if (!root || !stage) return;
    const exam = pastFor(c.slug).find((s) => s.exam_id === examId) || pastFor(c.slug)[0];
    if (!exam) return;
    const questions = (exam.questions || []).map((q) => ({
      ...q,
      _slug: c.slug,
      course: c.slug,
      type: "multiple_choice",
      question: q.question || q.stem || "",
      solution: q.solution || "",
      chapterMeta: q.chapterMeta || [],
      answerOptions: (q.options || []).map((o) => ({
        text: o.text,
        rationale: o.rationale || "",
        isCorrect: !!(o.isCorrect || (q.correct && o.key === q.correct)),
      })),
    }));
    const hasKey = questions.some((q) => q.answerOptions.some((o) => o.isCorrect));
    let idx = 0, right = 0, streak = 0, bestStreakRun = 0, xp = 0, gradedDone = 0, gradedRight = 0;
    const t0 = Date.now();
    let timer = null;
    const hud = (id) => document.getElementById(id);

    function paintHud() {
      hud("hud-idx").textContent = `${Math.min(idx + 1, questions.length)}/${questions.length}`;
      hud("hud-right").textContent = String(right);
      hud("hud-streak").textContent = String(streak);
      hud("hud-xp").textContent = String(xp);
      hud("hud-time").textContent = fmtMs(Date.now() - t0);
      const bar = hud("hud-bar");
      if (bar) bar.style.width = (idx / questions.length) * 100 + "%";
    }

    function advance(box, i) {
      const next = document.createElement("div");
      next.className = "btn-row game-actions";
      const b = document.createElement("button");
      b.className = "btn";
      b.type = "button";
      b.textContent = i < questions.length - 1 ? "Sonraki soru" : "Sonucu gör";
      b.onclick = () => { idx++; showQuestion(idx); };
      next.appendChild(b);
      box.appendChild(next);
      b.focus();
      paintHud();
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function showQuestion(i) {
      clearInterval(timer);
      const q = questions[i];
      if (!q) { finish(); return; }
      if (hasKey) {
        stage.innerHTML = `<div class="q game-q" data-q="${i}">${questionHTML(q, i)}
          <div class="btn-row game-actions">
            <button class="btn" type="button" id="check-ans">Kontrol et</button>
            <button class="btn ghost" type="button" id="skip-q">Geç</button>
          </div>
        </div>`;
        paintHud();
        const box = stage.querySelector(".game-q");
        const check = document.getElementById("check-ans");
        const skip = document.getElementById("skip-q");
        check.focus();
        check.onclick = () => {
          const ok = grade(q, i, stage);
          showFeedback(q, i, ok, box);
          check.hidden = true;
          skip.hidden = true;
          gradedDone++;
          if (ok === true) {
            gradedRight++;
            right++;
            streak++;
            bestStreakRun = Math.max(bestStreakRun, streak);
            const bonus = streak >= 3 ? streak * 2 : 0;
            xp += 10 + bonus;
            box.classList.add("hit");
          } else {
            streak = 0;
            box.classList.add("miss");
          }
          advance(box, i);
        };
        skip.onclick = () => { streak = 0; paintHud(); idx++; showQuestion(idx); };
      } else {
        // self-graded fallback
        stage.innerHTML = `<div class="q game-q" data-q="${i}">
          ${pastQuestionHtml(q, i)}
          <div class="btn-row game-actions">
            <button class="btn" type="button" id="check-ans">Seçimi göster</button>
            <button class="btn ghost" type="button" id="skip-q">Geç</button>
          </div>
          <div class="self-grade" id="self-grade" hidden>
            <p class="muted" style="margin:.2rem 0 .5rem;font-size:.9rem">Bu sorunun cevap anahtarı yok. Kendinizi dürüstçe işaretleyin.</p>
            <div class="btn-row">
              <button class="btn" type="button" data-mark="ok">Bildim (+10 XP)</button>
              <button class="btn ghost" type="button" data-mark="no">Bilemedim</button>
            </div>
          </div>
        </div>`;
        paintHud();
        const box = stage.querySelector(".game-q");
        const check = document.getElementById("check-ans");
        const skip = document.getElementById("skip-q");
        const self = document.getElementById("self-grade");
        check.onclick = () => {
          check.hidden = true;
          skip.hidden = true;
          self.hidden = false;
          box.classList.add("revealed");
          self.querySelector("[data-mark=ok]").focus();
        };
        skip.onclick = () => { streak = 0; paintHud(); idx++; showQuestion(idx); };
        self.querySelectorAll("[data-mark]").forEach((btn) => {
          btn.onclick = () => {
            const ok = btn.dataset.mark === "ok";
            gradedDone++;
            if (ok) {
              gradedRight++;
              right++;
              streak++;
              bestStreakRun = Math.max(bestStreakRun, streak);
              const bonus = streak >= 3 ? streak * 2 : 0;
              xp += 10 + bonus;
              box.classList.add("hit");
            } else {
              streak = 0;
              box.classList.add("miss");
            }
            self.hidden = true;
            advance(box, i);
          };
        });
      }
      timer = setInterval(paintHud, 500);
    }

    function finish() {
      clearInterval(timer);
      const score = gradedDone ? gradedRight / gradedDone : 0;
      const timeMs = Date.now() - t0;
      const avgMs = gradedDone ? Math.round(timeMs / Math.max(1, idx)) : 0;
      const run = { xp, streak: bestStreakRun, score, passed: score >= 0.7, timeMs, right: gradedRight, total: gradedDone };
      const g = saveGameStats(c.slug, run);
      const isRecord = xp >= g.bestXp && xp > 0;
      document.getElementById("result").innerHTML = `<div class="result ${score >= 0.7 ? "pass" : "fail"} game-result">
        <p class="eyebrow" style="color:var(--gold-soft)">Çıkmış vize tamamlandı${isRecord ? " · Yeni rekor!" : ""}</p>
        <h2>${xp} XP · ${gradedRight}/${gradedDone} bildim · ${pct(score)}</h2>
        <ul class="game-stats">
          <li><b>${bestStreakRun}</b> en uzun seri</li>
          <li><b>${fmtMs(timeMs)}</b> toplam süre</li>
          <li><b>${fmtMs(avgMs)}</b> soru başına</li>
          <li><b>${g.bestXp}</b> rekor XP</li>
        </ul>
        <div class="btn-row">
          <a class="btn ghost" style="color:var(--ivory);border-color:var(--gold)" href="#/course/${c.slug}/exams">Sınavlar</a>
          <button class="btn ghost" style="color:var(--ivory);border-color:var(--gold)" type="button" id="retry">Tekrar oyna</button>
        </div></div>`;
      document.getElementById("retry").onclick = () => route();
      const bar = document.getElementById("hud-bar");
      if (bar) bar.style.width = "100%";
      paintHud();
      document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showQuestion(0);
  }

  // ---- transkript ------------------------------------------------------------
  function viewTranscript() {
    const done = passedCount(), total = CONFIG.totalCourses;
    const rows = COURSES.map((c, i) => {
      const r = progress[c.slug], s = courseStatus(c.slug);
      return `<tr><td>${esc(code(i))}</td><td><a href="#/course/${c.slug}">${esc(c.course)}</a>${byline(c) ? `<div class="muted" style="font-size:.82rem">${esc(byline(c))}</div>` : ""}</td>
        <td>${r ? pct(r.best) : "-"}</td><td>${r ? r.attempts : 0}</td><td><span class="badge ${s.cls}">${r ? (r.passed ? "Geçti" : "Devam ediyor") : "Başlanmadı"}</span></td></tr>`;
    }).join("");
    return `<p class="eyebrow">Akademik kayıt</p><h1>Transkriptiniz</h1>
      <p class="muted">İlerleme yalnızca bu tarayıcıda saklanır. Site verilerini temizlerseniz sıfırlanır.</p>
      <div class="progress" aria-label="${total} dersten ${done} geçildi"><i style="width:${total ? (done / total) * 100 : 0}%"></i></div>
      <p><strong>${total} dersten ${done}</strong> ders geçildi. ${done >= total && total ? `<a href="#/certificate">Belgenizi alın.</a>` : `Belgenizi açmak için ${total === 1 ? "bu dersi" : `tüm ${total} dersi`} geçin.`}</p>
      <div class="table-wrap"><table class="transcript"><thead><tr><th>Kod</th><th>Ders</th><th>En iyi puan</th><th>Deneme</th><th>Durum</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="btn-row" style="max-width:280px"><button class="btn ghost" id="reset">İlerlememi sıfırla</button></div>`;
  }
  function bindTranscript() {
    const b = document.getElementById("reset");
    if (!b) return;
    b.onclick = () => {
      if (b.dataset.armed) { progress = {}; save(progress); route(); return; }
      b.dataset.armed = "1";
      b.textContent = "Tüm sonuçları silmek için tekrar tıklayın";
      setTimeout(() => { if (document.body.contains(b)) { delete b.dataset.armed; b.textContent = "İlerlememi sıfırla"; } }, 4000);
    };
  }

  // ---- özet (mobil uyumlu interaktif ders özeti) ---------------------------
  // İlerleme şeması: progress[slug] = { best, attempts, passed, lastAt, read: [bölüm no] }
  function readSet(slug) {
    const r = progress[slug];
    return new Set(Array.isArray(r && r.read) ? r.read : []);
  }
  function setRead(slug, n, on) {
    const rec = progress[slug] || (progress[slug] = { best: 0, attempts: 0, passed: false, read: [] });
    const s = new Set(rec.read || []);
    if (on) s.add(n); else s.delete(n);
    rec.read = Array.from(s).sort((a, b) => a - b);
    save(progress);
  }
  const readCount = (c) => {
    const s = readSet(c.slug);
    return c.chapters.reduce((n, ch, i) => n + (s.has(i + 1) ? 1 : 0), 0);
  };

  // Rapordaki interaktif çalışma paneli: kavram kartları, karşılaştırma, akış, matris, sâikler, şecere, test.
  // Veri window.INTERACTIVE[slug] altında; bölüm panelleri d.chapters["n"] altındadır.
  // Etiketler ve matris satır başlığı veriden gelir (labels, matrix.rowTerm); gelmezse varsayılan kullanılır.
  function panelHTML(d, prefix) {
    const L = d.labels || {};
    // Yalnızca verisi olan görünümler sekmelenir; ilki açık başlar.
    const tabs = [
      ["kavramlar", L.concepts || "Kavramlar", (d.concepts || []).length > 0],
      ["karsilastirma", L.compare || "Karşılaştırma", !!(d.compare && d.compare.left && d.compare.right)],
      ["akis", L.timeline || "Tarihsel akış", (d.timeline || []).length > 0],
      ["matris", L.matrix || "Karşılaştırma matrisi", (d.matrix && d.matrix.rows || []).length > 0],
      ["sainler", L.factors || "İç ve dış sâikler", (d.factors && d.factors.items || []).length > 0],
      ["secere", L.tree || "Şecere", (d.tree || []).length > 0],
      ["test", L.quiz || "Pekiştirme testi", (d.quiz || []).length > 0],
    ].filter((t) => t[2]);
    if (!tabs.length && !(d.takeaways || []).length) return "";
    const tabbar = tabs.map(([id, label], i) => `<button class="sm-tab${i === 0 ? " active" : ""}" type="button" role="tab" aria-selected="${i === 0}" data-tab="${id}" aria-controls="${esc(prefix)}-${id}">${esc(label)}</button>`).join("");

    const takeaways = (d.takeaways || []).length
      ? `<div class="sm-take"><p class="sm-label">Ana çıkarımlar</p><ul>${d.takeaways.map((k) => `<li><strong>${esc(k.t)}:</strong> ${esc(k.d)}</li>`).join("")}</ul></div>`
      : "";

    const first = tabs.length ? tabs[0][0] : "";
    const vis = (id) => (id === first ? "" : " hidden");
    const pane = (id, inner) => `<div class="sm-pane" data-pane="${id}" role="tabpanel" id="${esc(prefix)}-${id}"${vis(id)}>${inner}</div>`;

    const cards = (d.concepts || []).length
      ? pane("kavramlar", `<p class="sm-hint">Karta dokunup çevirin.</p>
           <div class="sm-cards">${d.concepts.map((k) => `<button class="k-card" type="button" aria-label="${esc(k.term)} kartını çevir"><span class="k-inner"><span class="k-face k-front">${esc(k.term)}</span><span class="k-face k-back">${esc(k.def)}</span></span></button>`).join("")}</div>`)
      : "";

    const cmp = d.compare && d.compare.left && d.compare.right
      ? pane("karsilastirma", `<div class="sm-compare">
           <div class="cmp-card cmp-a"><h4>${esc(d.compare.left.title || "Din")}</h4><ul>${(d.compare.left.points || []).map((p) => `<li><strong>${esc(p.k)}:</strong> ${esc(p.v)}</li>`).join("")}</ul></div>
           <div class="cmp-card cmp-b"><h4>${esc(d.compare.right.title || "Mezhep")}</h4><ul>${(d.compare.right.points || []).map((p) => `<li><strong>${esc(p.k)}:</strong> ${esc(p.v)}</li>`).join("")}</ul></div>
         </div>`)
      : "";

    const timeline = (d.timeline || []).length
      ? pane("akis", `<ol class="sm-timeline">${d.timeline.map((m, i) => `<li class="tl-item">
             <button class="tl-head" type="button" aria-expanded="false" aria-controls="tl-${esc(prefix)}-${i}">
               <span class="tl-year">${esc(m.year)}</span><span class="tl-name">${esc(m.name)}</span><span class="sm-caret" aria-hidden="true"></span>
             </button>
             <div class="tl-desc" id="tl-${esc(prefix)}-${i}" hidden>${esc(m.desc)}</div>
           </li>`).join("")}</ol>`)
      : "";

    const matrix = d.matrix && (d.matrix.rows || []).length
      ? pane("matris", `<p class="sm-hint">${esc(d.matrix.hint || "Karşılaştırmalı tablo. Mobilde tabloyu yana kaydırın.")}</p>
           <div class="table-wrap"><table class="sm-matrix">
             <thead><tr><th>${esc(d.matrix.rowTerm || "Öğe")}</th>${d.matrix.axes.map((a) => `<th>${esc(a)}</th>`).join("")}</tr></thead>
             <tbody>${d.matrix.rows.map((r) => `<tr><th scope="row">${esc(r.label || r.school || "")}</th>${r.cells.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
           </table></div>`)
      : "";

    const factors = d.factors && (d.factors.items || []).length
      ? pane("sainler", `<div class="sm-chips sm-fchips" role="group" aria-label="Sâik filtresi">
             <button class="chip sm-fchip active" type="button" data-f="all" aria-pressed="true">Tümü</button>
             <button class="chip sm-fchip" type="button" data-f="ic" aria-pressed="false">İç sâikler</button>
             <button class="chip sm-fchip" type="button" data-f="dis" aria-pressed="false">Dış sâikler</button>
           </div>
           <ul class="sm-factors">${d.factors.items.map((f) => `<li class="sf-item" data-side="${esc(f.side)}">
             <span class="sf-tag sf-${esc(f.side)}">${f.side === "ic" ? "İç" : "Dış"}</span>
             <div><strong>${esc(f.t)}</strong><p>${esc(f.d)}</p></div>
           </li>`).join("")}</ul>`)
      : "";

    const tree = (d.tree || []).length
      ? pane("secere", `<p class="sm-hint">Detay için ekol kutusuna dokunun.</p>
           <div class="sm-tree" role="group" aria-label="Ekoller">${d.tree.map((n, i) => `<button class="tree-node" type="button" data-node="${i}" aria-pressed="false">${esc(n.label)}</button>`).join("")}</div>
           <div class="tree-detail" data-tree-detail hidden></div>`)
      : "";

    const quiz = (d.quiz || []).length
      ? pane("test", (d.quiz).map((q, i) => `<div class="smq" data-smq="${i}">
             <p class="smq-q"><strong>${i + 1}.</strong> ${esc(q.q)}</p>
             ${(q.options || []).map((o, j) => `<label class="smq-opt"><input type="radio" name="${esc(prefix)}-q${i}" value="${j}"><span>${esc(o)}</span></label>`).join("")}
             <div class="smq-actions"><button class="btn ghost sm-mini smq-check" type="button">Kontrol et</button></div>
             <div class="smq-fb" hidden></div>
           </div>`).join(""))
      : "";

    return `<div class="sm-panel" data-panel="${esc(prefix)}" data-json="${esc(JSON.stringify(d))}">
      ${takeaways ? `<p class="sm-panel-title">${esc(d.title || "İnteraktif çalışma paneli")}</p>${takeaways}` : ""}
      ${tabs.length ? `<div class="sm-tabs" role="tablist" aria-label="Panel görünümleri">${tabbar}</div>` : ""}
      ${cards}${cmp}${timeline}${matrix}${factors}${tree}${quiz}
    </div>`;
  }

  function interactivePanel(c) {
    const d = INTERACTIVE[c.slug];
    return d ? panelHTML(d, "pnl-" + c.slug) : "";
  }
  function chapterPanel(c, n) {
    const d = INTERACTIVE[c.slug];
    const ch = d && d.chapters && d.chapters[String(n)];
    return ch ? panelHTML(ch, `chp-${c.slug}-${n}`) : "";
  }

  // Panel etkileşimleri: tek global delegation; bölüm sayfasında da özet sekmesinde de çalışır.
  document.addEventListener("click", (e) => {
    const tab = e.target.closest(".sm-tab");
    if (tab) {
      const panel = tab.closest(".sm-panel");
      panel.querySelectorAll(".sm-tab").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-selected", "false"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      panel.querySelectorAll(".sm-pane").forEach((p) => (p.hidden = p.dataset.pane !== tab.dataset.tab));
      return;
    }
    const tl = e.target.closest(".tl-head");
    if (tl) {
      const open = tl.getAttribute("aria-expanded") === "true";
      tl.setAttribute("aria-expanded", String(!open));
      document.getElementById(tl.getAttribute("aria-controls")).hidden = open;
      return;
    }
    const card = e.target.closest(".k-card");
    if (card) { card.classList.toggle("flipped"); return; }
    const node = e.target.closest(".tree-node");
    if (node) {
      const panel = node.closest(".sm-panel");
      const data = JSON.parse(panel.dataset.json || "{}");
      const item = (data.tree || [])[+node.dataset.node];
      panel.querySelectorAll(".tree-node").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
      node.classList.add("active");
      node.setAttribute("aria-pressed", "true");
      const detail = panel.querySelector("[data-tree-detail]");
      detail.innerHTML = item ? `<h4>${esc(item.label)}</h4><p>${esc(item.desc)}</p>` +
        ((item.branches || []).length ? `<ul class="tree-branches">${item.branches.map((b) => `<li><strong>${esc(b.label)}:</strong> ${esc(b.d)}</li>`).join("")}</ul>` : "") : "";
      detail.hidden = !item;
      return;
    }
    // Sâik filtresi (iç / dış / tümü)
    const fchip = e.target.closest(".sm-fchip");
    if (fchip) {
      const paneEl = fchip.closest(".sm-pane");
      paneEl.querySelectorAll(".sm-fchip").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
      fchip.classList.add("active");
      fchip.setAttribute("aria-pressed", "true");
      const f = fchip.dataset.f;
      paneEl.querySelectorAll(".sf-item").forEach((li) => { li.hidden = f !== "all" && li.dataset.side !== f; });
      return;
    }
    // Pekiştirme testi: anında doğru/yanlış geri bildirimi.
    const check = e.target.closest(".smq-check");
    if (check) {
      const q = check.closest(".smq");
      const data = JSON.parse(q.closest(".sm-panel").dataset.json || "{}");
      const item = (data.quiz || [])[+q.dataset.smq];
      const fb = q.querySelector(".smq-fb");
      if (!item || !fb) return;
      const picked = q.querySelector("input:checked");
      if (!picked) { fb.hidden = false; fb.className = "smq-fb"; fb.textContent = "Lütfen bir seçenek işaretleyin."; return; }
      const ok = +picked.value === item.answer;
      fb.hidden = false;
      fb.className = "smq-fb " + (ok ? "ok" : "no");
      fb.innerHTML = `<strong>${ok ? "Doğru." : "Yanlış."}</strong> ${esc(item.why || "")}`;
      q.querySelectorAll("input").forEach((x) => (x.disabled = true));
      check.disabled = true;
      return;
    }
  });

  function viewSummary() {
    if (!COURSES.length) return `<p class="eyebrow">Hızlı tekrar</p><h1>Ders özetleri</h1><p class="muted">Henüz ders eklenmemiş.</p>`;
    const totalCh = COURSES.reduce((n, c) => n + c.chapters.length, 0);
    const done = COURSES.reduce((n, c) => n + readCount(c), 0);
    const chips = COURSES.map((c, i) => `<button class="chip${i === 0 ? " active" : ""}" type="button" data-filter="${esc(c.slug)}" aria-pressed="${i === 0}">${esc(c.subject)}</button>`).join("");
    const sections = COURSES.map((c) => {
      const rs = readSet(c.slug);
      const items = c.chapters.map((ch, i) => {
        const n = i + 1, isRead = rs.has(n);
        const hay = norm([ch.title, ch.summary, (ch.objectives || []).join(" ")].join(" "));
        return `<div class="sm-item${isRead ? " is-read" : ""}" data-course="${esc(c.slug)}" data-n="${n}" data-hay="${esc(hay)}">
          <button class="sm-head" type="button" aria-expanded="false" aria-controls="sm-${esc(c.slug)}-${n}">
            <span class="sm-num">${n}</span>
            <span class="sm-title">${esc(ch.title)}</span>
            <span class="sm-flag" aria-hidden="true">${isRead ? "✓" : ""}</span>
            <span class="sm-caret" aria-hidden="true"></span>
          </button>
          <div class="sm-body" id="sm-${esc(c.slug)}-${n}" hidden>
            <p class="sm-sum">${esc(ch.summary)}</p>
            ${chapterPanel(c, n)}
            ${(ch.objectives || []).length ? `<p class="sm-label">Öğrenme amaçları</p><ul class="objectives">${ch.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>` : ""}
            <div class="btn-row">
              <button class="btn ghost sm-read" type="button" data-read="${n}" aria-pressed="${isRead}">${isRead ? "Okundu, geri al" : "Okundu olarak işaretle"}</button>
              <a class="btn" href="#/course/${esc(c.slug)}/chapter/${n}">Bölümü aç</a>
            </div>
          </div>
        </div>`;
      }).join("");
      return `<details class="sm-course" data-course="${esc(c.slug)}">
        <summary><span>${esc(c.subject)}</span><span class="sm-count">${readCount(c)} / ${c.chapters.length} okundu</span></summary>
        ${interactivePanel(c)}
        <div class="sm-list">${items}</div>
      </details>`;
    }).join("");
    return `<p class="eyebrow">Hızlı tekrar</p><h1>Ders özetleri</h1>
      <p class="lead muted">Tüm derslerin bölüm özetleri tek yerde. Dokunarak açın, okuduklarınızı işaretleyin; ilerleme yalnızca bu tarayıcıda saklanır.</p>
      <div class="sm-progress" aria-hidden="true"><i style="width:${totalCh ? (done / totalCh) * 100 : 0}%"></i></div>
      <p class="sm-progress-label">${done} / ${totalCh} bölüm okundu</p>
      <div class="sm-tools">
        <input class="sm-search" type="search" id="sm-search" placeholder="Özetlerde ara…" aria-label="Ders özetlerinde ara" autocomplete="off">
        <div id="sm-cg" class="cg-box" hidden></div>
        <div class="sm-chips" role="group" aria-label="Ders filtresi">
          <button class="chip active" type="button" data-filter="" aria-pressed="true">Tümü</button>${chips}
        </div>
        <div class="sm-bulk">
          <button class="btn ghost sm-mini" type="button" id="sm-expand">Tümünü aç</button>
          <button class="btn ghost sm-mini" type="button" id="sm-collapse">Tümünü kapat</button>
          <button class="btn ghost sm-mini" type="button" id="sm-unread">Okunmamışları göster</button>
        </div>
      </div>
      <div class="sm-sections">${sections}</div>
      <p class="sm-empty" hidden>Aramanızla eşleşen bölüm yok.</p>`;
  }

  function bindSummary() {
    const wrap = document.querySelector(".sm-sections");
    if (!wrap) return;
    const search = document.getElementById("sm-search");
    const empty = document.querySelector(".sm-empty");
    const cgBox = document.getElementById("sm-cg");
    let filter = "";

    function renderCg(q) {
      if (!cgBox) return;
      if (!q || q.length < 2) { cgBox.hidden = true; cgBox.innerHTML = ""; return; }
      const hits = cgSearch(q, { limit: 12 }).filter((h) => h.item.type !== "chapter" || !filter || h.item.course === filter);
      if (!hits.length) { cgBox.hidden = true; cgBox.innerHTML = ""; return; }
      cgBox.hidden = false;
      cgBox.innerHTML = `<p class="sm-label">İlgili kavram, test ve sınav</p><ul class="cg-hits">` +
        hits.map((h) => {
          const it = h.item;
          return `<li><a href="${esc(it.href)}"><span class="cg-type">${esc(TYPE_LABEL[it.type] || it.type)}</span><span class="cg-title">${esc(it.title)}</span>${it.course && bySlug[it.course] ? `<span class="cg-course">${esc(bySlug[it.course].subject)}</span>` : ""}</a></li>`;
        }).join("") + `</ul>`;
    }

    function apply() {
      const q = norm(search.value);
      let visible = 0;
      const chapterHits = q ? new Set(cgSearch(q, { type: "chapter", limit: 200 }).map((h) => h.item.id)) : null;
      wrap.querySelectorAll(".sm-item").forEach((it) => {
        let ok = (!filter || it.dataset.course === filter) && (!q || it.dataset.hay.includes(q));
        if (ok && q && chapterHits) {
          const id = `chapter:${it.dataset.course}:${it.dataset.n}`;
          ok = chapterHits.has(id) || it.dataset.hay.includes(q);
        }
        it.hidden = !ok;
        if (ok) visible++;
      });
      wrap.querySelectorAll(".sm-course").forEach((d) => {
        d.hidden = !d.querySelector(".sm-item:not([hidden])");
      });
      if (empty) empty.hidden = visible > 0;
      renderCg(search.value.trim());
    }

    function refreshCounts() {
      let totalDone = 0;
      wrap.querySelectorAll(".sm-course").forEach((d) => {
        const c = bySlug[d.dataset.course];
        if (!c) return;
        const n = readCount(c);
        totalDone += n;
        d.querySelector(".sm-count").textContent = `${n} / ${c.chapters.length} okundu`;
      });
      const totalCh = COURSES.reduce((n, c) => n + c.chapters.length, 0);
      const bar = document.querySelector(".sm-progress > i");
      const label = document.querySelector(".sm-progress-label");
      if (bar) bar.style.width = (totalCh ? (totalDone / totalCh) * 100 : 0) + "%";
      if (label) label.textContent = `${totalDone} / ${totalCh} bölüm okundu`;
    }

    search.addEventListener("input", apply);

    document.querySelectorAll(".sm-chips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".sm-chips .chip").forEach((x) => { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        filter = chip.dataset.filter || "";
        apply();
      });
    });

    document.getElementById("sm-expand").onclick = () => wrap.querySelectorAll(".sm-course").forEach((d) => (d.open = true));
    document.getElementById("sm-collapse").onclick = () => wrap.querySelectorAll(".sm-course").forEach((d) => (d.open = false));

    // "Okunmamışları göster": okunmuşları gizleyip yalnızca tekrar gerekenleri bırakır; etiket duruma göre değişir.
    const unreadBtn = document.getElementById("sm-unread");
    let unreadOnly = false;
    unreadBtn.onclick = () => {
      unreadOnly = !unreadOnly;
      unreadBtn.textContent = unreadOnly ? "Tümünü göster" : "Okunmamışları göster";
      unreadBtn.setAttribute("aria-pressed", String(unreadOnly));
      wrap.querySelectorAll(".sm-item").forEach((it) => {
        if (unreadOnly && it.classList.contains("is-read")) it.hidden = true;
      });
      apply();
    };

    wrap.addEventListener("click", (e) => {
      const readBtn = e.target.closest(".sm-read");
      if (!readBtn) return;
      const item = readBtn.closest(".sm-item");
      const on = !item.classList.contains("is-read");
      item.classList.toggle("is-read", on);
      setRead(item.dataset.course, +item.dataset.n, on);
      readBtn.textContent = on ? "Okundu, geri al" : "Okundu olarak işaretle";
      readBtn.setAttribute("aria-pressed", String(on));
      item.querySelector(".sm-flag").textContent = on ? "✓" : "";
      if (unreadOnly && on) item.hidden = true;
      refreshCounts();
    });
  }

  // ---- belge ------------------------------------------------------------------
  function viewCertificate() {
    if (!canAccess("certificate")) return viewGate("certificate");
    const done = passedCount(), total = CONFIG.totalCourses;
    if (!total || done < total) {
      return `<div class="locked"><div class="crest-lg">${crest()}</div><p class="eyebrow">Tamamlama Belgesi</p>
        <h1>Kilitli</h1><p class="muted">Belgenizi açmak için ${total === 1 ? "ders sınavını" : `tüm ${total} ders sınavını`} ${pct(CONFIG.passMark)} veya üzeri ile geçin. Şu ana kadar ${done} ders geçtiniz.</p>
        <div class="btn-row" style="justify-content:center"><a class="btn" href="#/transcript">Transkripti görüntüle</a></div></div>`;
    }
    return `<p class="eyebrow">Tamamlama Belgesi</p><h1>${total === 1 ? "Dersi tamamladınız." : `Tüm ${total} dersi tamamladınız.`}</h1>
      <div class="field"><label for="cname">Belgede görünecek isim</label><input id="cname" maxlength="48" placeholder="Adınız soyadınız"></div>
      <div class="cert-wrap"><canvas id="cert" width="2000" height="1414" hidden></canvas><img id="cert-img" alt="Tamamlama Belgeniz"></div>
      <p class="muted" style="font-size:.88rem">Kaydetmek için belgeye sağ tıklayıp Görsele Kaydet'i seçin veya telefonda uzun basın.</p>`;
  }

  function certId(name, date) {
    let h = 2166136261;
    for (const ch of name + "|" + date) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return CONFIG.codePrefix.replace(/\s+/g, "") + "-" + (h >>> 0).toString(36).toUpperCase().padStart(7, "0");
  }

  // Metni ortala, sığana kadar puntoyu küçült.
  function fitText(x, text, cx, y, maxW, font, size) {
    let s = size;
    do { x.font = font.replace("{s}", s + "px"); s -= 2; } while (x.measureText(text).width > maxW && s > 12);
    x.fillText(text, cx, y);
  }

  async function drawCert(name) {
    const cv = document.getElementById("cert");
    if (!cv) return;
    const x = cv.getContext("2d"), W = cv.width, H = cv.height, P = CONFIG.colors.primary, A = CONFIG.colors.accent;
    try { await Promise.all(["500 96px 'EB Garamond'", "italic 400 60px 'EB Garamond'", "500 24px Inter"].map((f) => document.fonts.load(f))); } catch (e) { /* Georgia'ya düş */ }
    const date = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
    const total = COURSES.length, maxW = W - 360;
    x.fillStyle = "#fffdf7"; x.fillRect(0, 0, W, H);
    x.strokeStyle = P; x.lineWidth = 18; x.strokeRect(40, 40, W - 80, H - 80);
    x.strokeStyle = A; x.lineWidth = 3; x.strokeRect(78, 78, W - 156, H - 156);
    x.lineWidth = 1; x.strokeRect(92, 92, W - 184, H - 184);
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(crest());
    await new Promise((r) => { img.onload = r; img.onerror = r; });
    x.drawImage(img, W / 2 - 75, 140, 150, 180);
    x.textAlign = "center"; x.fillStyle = A;
    fitText(x, CONFIG.name.toUpperCase().split("").join(" "), W / 2, 380, maxW, "600 {s} Inter, sans-serif", 26);
    x.fillStyle = P; fitText(x, "Tamamlama Belgesi", W / 2, 510, maxW, "500 {s} 'EB Garamond', Georgia, serif", 104);
    x.fillStyle = "#5d6475"; x.font = "italic 400 40px 'EB Garamond', Georgia, serif"; x.fillText("Bu belge şunu gösterir ki", W / 2, 610);
    x.fillStyle = "#1d2433"; fitText(x, name || "Adınız", W / 2, 730, maxW, "italic 400 {s} 'EB Garamond', Georgia, serif", 92);
    x.strokeStyle = A; x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2 - 420, 765); x.lineTo(W / 2 + 420, 765); x.stroke();
    x.fillStyle = "#1d2433";
    const line1 = total === 1 ? `${CONFIG.name} çalışma programını tamamladığını` : `${CONFIG.name} çalışma programının tüm ${total} dersini tamamladığını`;
    const line2 = total === 1 ? `ve final sınavını ${pct(CONFIG.passMark)} veya üzeri puanla geçtiğini` : `ve her final sınavını ${pct(CONFIG.passMark)} veya üzeri puanla geçtiğini`;
    fitText(x, line1, W / 2, 840, maxW, "400 {s} 'EB Garamond', Georgia, serif", 36);
    fitText(x, line2, W / 2, 890, maxW, "400 {s} 'EB Garamond', Georgia, serif", 36);
    x.fillStyle = "#5d6475";
    fitText(x, COURSES.map((c) => c.subject).join("  ·  "), W / 2, 970, maxW, "400 {s} Inter, sans-serif", 26);
    const foot = (label, val, cx) => {
      x.strokeStyle = P; x.lineWidth = 1.5; x.beginPath(); x.moveTo(cx - 220, 1150); x.lineTo(cx + 220, 1150); x.stroke();
      x.fillStyle = "#1d2433"; fitText(x, val, cx, 1135, 440, "500 {s} 'EB Garamond', Georgia, serif", 34);
      x.fillStyle = "#5d6475"; x.font = "500 20px Inter, sans-serif"; x.fillText(label.toUpperCase(), cx, 1188);
    };
    foot("Tarih", date, W / 2 - 520);
    foot("Veren", CONFIG.issuer, W / 2 + 520);
    x.fillStyle = "#8a8f9c";
    fitText(x, `Belge No ${certId(name || "", date)}. Ücretsiz bir özgün çalışma programıdır. Herhangi bir üniversite ile bağlantılı değildir.`, W / 2, H - 130, maxW, "400 {s} Inter, sans-serif", 18);
    const out = document.getElementById("cert-img");
    if (out) out.src = cv.toDataURL("image/png");
  }
  function bindCertificate() {
    const input = document.getElementById("cname");
    if (!input) return;
    const saved = (() => { try { return localStorage.getItem(CONFIG.storageKey + ".name") || ""; } catch (e) { return ""; } })();
    input.value = saved;
    drawCert(saved);
    input.addEventListener("input", () => { try { localStorage.setItem(CONFIG.storageKey + ".name", input.value); } catch (e) {} drawCert(input.value.trim()); });
  }

  function viewGate(feature) {
    return `<div class="locked"><div class="crest-lg">${crest()}</div><h1>Yalnızca üyelere</h1><p class="muted">${esc(CONFIG.issuer)} üyelerine açıktır.</p></div>`;
  }
  const viewNotFound = () => `<h1>Sayfa bulunamadı</h1><p><a href="#/">Kataloğa dön</a></p>`;

  // ---- CourseGraph arama sayfası (#/ara) ------------------------------------
  function searchResultsHtml(q) {
    const hits = cgSearch(q, { limit: 60 });
    if (!q || q.length < 2) {
      return `<p class="muted">En az 2 karakter yazın. Ders, bölüm, kavram, test ve sınav sorularında aranır.</p>`;
    }
    if (!hits.length) return `<p class="sm-empty">Aramanızla eşleşen sonuç yok.</p>`;
    const byType = {};
    for (const h of hits) (byType[h.item.type] = byType[h.item.type] || []).push(h);
    const order = ["course", "chapter", "concept", "quiz_question", "past_question", "exam_question", "unit", "keyword", "event", "artifact", "past_exam"];
    let out = `<p class="sm-progress-label">${hits.length} sonuç</p>`;
    for (const t of order) {
      const list = byType[t];
      if (!list) continue;
      out += `<section class="cg-section"><h2>${esc(TYPE_LABEL[t] || t)} <span class="sm-count">${list.length}</span></h2><ul class="cg-hits">`;
      for (const h of list) {
        const it = h.item;
        const courseSub = it.course && bySlug[it.course] ? esc(bySlug[it.course].subject) : "";
        const chap = it.chapter ? ` · B${it.chapter}` : "";
        out += `<li><a href="${esc(it.href)}"><span class="cg-title">${esc(it.title)}</span><span class="cg-course">${courseSub}${chap}</span></a>${it.snippet ? `<p class="cg-snippet">${esc(it.snippet)}</p>` : ""}${it.answer ? `<p class="cg-snippet">Cevap: ${esc(it.answer)}</p>` : ""}</li>`;
      }
      out += `</ul></section>`;
    }
    return out;
  }

  function viewSearch() {
    const q = new URLSearchParams(location.hash.split("?")[1] || "").get("q") || "";
    return `<p class="eyebrow">CourseGraph</p><h1>Arama</h1>
      <p class="lead muted">Dersler, bölümler, kavramlar, test ve sınav soruları tek indekste.</p>
      <div class="sm-tools">
        <input class="sm-search" type="search" id="cg-q" placeholder="Örn. Lozan, iman, üslup..." aria-label="Ara" autocomplete="off" value="${esc(q)}">
      </div>
      <div id="cg-results">${searchResultsHtml(q)}</div>`;
  }

  function bindSearch() {
    const input = document.getElementById("cg-q");
    const box = document.getElementById("cg-results");
    if (!input || !box) return;
    let timer = null;
    input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const q = input.value.trim();
        box.innerHTML = searchResultsHtml(q);
        const base = "#/ara";
        history.replaceState(null, "", q ? `${base}?q=${encodeURIComponent(q)}` : base);
      }, 120);
    });
    if (!input.value) input.focus();
  }

  // zihin haritası bağlayıcı (Cytoscape lazy load)
  function ensureCytoscape() {
    if (window.cytoscape) return Promise.resolve(window.cytoscape);
    if (window.__cyPromise) return window.__cyPromise;
    window.__cyPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/cytoscape@3.30.2/dist/cytoscape.min.js";
      s.onload = () => resolve(window.cytoscape);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window.__cyPromise;
  }

  function bindMindmaps() {
    const root = document.querySelector(".mindmap-section");
    if (!root) return;
    const slug = root.dataset.mmCourse;
    const maps = courseMaps(slug);
    if (!maps.length) return;
    let activeId = root.dataset.mmId || "panel-chapters";
    let cy = null;
    const canvas = root.querySelector("#mm-canvas");
    const detail = root.querySelector("#mm-detail");

    function mapById(id) {
      return maps.find((m) => m.id === id) || maps[0];
    }

    function draw() {
      const map = mapById(activeId);
      if (!map || !canvas) return;
      root.dataset.mmId = activeId;
      const focusCh = +(root.dataset.mmChapter || 0);
      const elements = [];
      const nodeById = {};
      for (const n of map.nodes || []) {
        nodeById[n.id] = n;
        const data = { id: n.id, label: n.label, depth: n.depth || 0, chapter: n.chapter || 0, href: n.href || "", desc: n.desc || "" };
        elements.push({ group: "nodes", data });
      }
      for (const e of map.edges || []) {
        elements.push({ group: "edges", data: { source: e.source, target: e.target } });
      }
      ensureCytoscape().then((cytoscape) => {
        if (cy) { cy.destroy(); cy = null; }
        cy = cytoscape({
          container: canvas,
          elements,
          style: [
            { selector: "node", style: {
              "background-color": "#f8f4ea",
              "border-width": 2,
              "border-color": "#1b2a4a",
              label: "data(label)",
              "text-valign": "bottom",
              "text-margin-y": 6,
              "font-size": 11,
              "text-wrap": "wrap",
              "text-max-width": 120,
              color: "#1b2a4a",
              width: "label",
              height: "label",
              padding: 8,
              shape: "round-rectangle",
            } },
            { selector: "node[depth = 0]", style: {
              "background-color": "#1b2a4a",
              color: "#f8f4ea",
              "border-color": "#b08d4a",
              "font-weight": 600,
              "text-wrap": "wrap",
              "text-max-width": 140,
            } },
            { selector: "node[depth = 1]", style: {
              "background-color": "#e9dcbf",
              "border-color": "#b08d4a",
              color: "#1b2a4a",
            } },
            { selector: "node.mm-focus", style: {
              "border-width": 4,
              "border-color": "#b08d4a",
              "background-color": "#b08d4a",
              color: "#1b2a4a",
              "font-weight": 700,
            } },
            { selector: "edge", style: {
              width: 1.5,
              "line-color": "#c9b896",
              "curve-style": "bezier",
            } },
          ],
          layout: { name: "cose", animate: false, padding: 24 },
        });
        if (focusCh) {
          const target = cy.nodes().filter((el) => +el.data("chapter") === focusCh);
          if (target.length) {
            cy.elements().addClass("mm-dim");
            target.removeClass("mm-dim");
            target.addClass("mm-focus");
            // komşular da belirgin
            target.connectedEdges().removeClass("mm-dim");
            target.neighborhood().removeClass("mm-dim");
            cy.fit(target.closedNeighborhood(), 48);
          }
        }
        cy.on("tap", "node", (evt) => {
          const d = evt.target.data();
          if (detail) detail.innerHTML = `<strong>${esc(d.label)}</strong>${d.desc ? " · " + esc(d.desc) : ""}`;
          if (d.href) location.hash = d.href.replace(/^#/, "");
        });
        cy.on("mouseover", "node", () => { canvas.style.cursor = "pointer"; });
        cy.on("mouseout", "node", () => { canvas.style.cursor = "default"; });
      }).catch(() => {
        // CDN yoksa: düz liste
        canvas.innerHTML = '<ul class="mm-fallback">' + (map.nodes || []).filter((n) => n.depth === 0).map((n) =>
          `<li>${n.href ? `<a href="${esc(n.href)}">${esc(n.label)}</a>` : esc(n.label)}</li>`
        ).join("") + '</ul>';
      });
    }

    root.querySelectorAll(".mm-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        root.querySelectorAll(".mm-tab").forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        activeId = btn.dataset.mm;
        draw();
      });
    });
    draw();
  }

  // üst cubuk arama + Ctrl/Cmd+K
  (function bindNavSearch() {
    const form = document.getElementById("nav-search");
    const input = document.getElementById("nav-q");
    if (!form || !input) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      location.hash = q ? `#/ara?q=${encodeURIComponent(q)}` : "#/ara";
      if (location.hash.startsWith("#/ara")) route();
    });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
  })();

  // ---- zoom ------------------------------------------------------
  const zoom = document.createElement("div");
  zoom.className = "zoom";
  zoom.hidden = true;
  zoom.setAttribute("role", "dialog");
  zoom.setAttribute("aria-label", "Büyütülmüş şekil. Kapatmak için tıklayın veya Escape tuşuna basın.");
  zoom.innerHTML = "<img alt=\"\">";
  document.body.appendChild(zoom);
  const closeZoom = () => { zoom.hidden = true; document.body.style.overflow = ""; };
  document.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-zoom]");
    if (img) { zoom.querySelector("img").src = img.src; zoom.querySelector("img").alt = img.alt; zoom.hidden = false; document.body.style.overflow = "hidden"; return; }
    if (!zoom.hidden && e.target.closest(".zoom")) closeZoom();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !zoom.hidden) closeZoom(); });

  // ---- yönlendirici ---------------------------------------------------------------
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("?")[0].split("/").filter(Boolean);
    let html, bind = () => {};
    if (!parts.length) html = viewCatalog();
    else if (parts[0] === "ozet") { html = viewSummary(); bind = bindSummary; }
    else if (parts[0] === "ara") { html = viewSearch(); bind = bindSearch; }
    else if (parts[0] === "transcript") { html = viewTranscript(); bind = bindTranscript; }
    else if (parts[0] === "certificate") { html = viewCertificate(); bind = bindCertificate; }
    else if (parts[0] === "course" && bySlug[parts[1]]) {
      const c = bySlug[parts[1]];
      if (parts[2] === "chapter") { html = viewChapter(c, +parts[3]); bind = bindMindmaps; }
      else if (parts[2] === "quiz") { html = viewQuiz(c); bind = () => bindQuiz(c); }
      else if (parts[2] === "exams") { html = viewExamHub(c); bind = () => {}; }
      else if (parts[2] === "past") { const id = decodeURIComponent(parts[3] || ""); html = viewPastExam(c, id); bind = () => bindPastExam(c, id); }
      else { html = viewCourse(c); bind = bindMindmaps; }
    } else html = viewNotFound();
    closeZoom();
    app.innerHTML = html;
    bind();
    typeset(app);
    document.querySelectorAll(".nav a").forEach((a) => {
      const href = a.getAttribute("href");
      const key = parts[0] || "";
      a.classList.toggle("active", href === "#/" + key || (key === "ara" && href === "#/ara"));
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
