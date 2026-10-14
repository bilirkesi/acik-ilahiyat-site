/* Kişisel Üniversite: statik çalışma sitesi. window.UNIVERSITY ve window.COURSES'u data.js'ten okur. Arka uç yoktur. */
(function () {
  "use strict";

  const U = window.UNIVERSITY || {};
  const COURSES = window.COURSES || [];
  // Ağır veri paketleri (interactive/coursegraph/past_exams/unit_quizzes) rota
  // bazlı olarak sonradan yüklenir; bu yüzden window'dan her seferinde okunur.
  const INTERACTIVE = () => window.INTERACTIVE || {};
  const CG = () => window.CG || { items: [], edges: {} };
  const VERSION = (document.querySelector('meta[name="pu-version"]') || {}).content || "";
  const LAZY_BUNDLES = {
    interactive: "interactive.js",
    coursegraph: "coursegraph.js",
    past_exams: "past_exams.js",
    unit_quizzes: "unit_quizzes.js",
  };
  const loadedBundles = {};
  function ensureBundle(name) {
    if (loadedBundles[name]) return loadedBundles[name];
    loadedBundles[name] = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = LAZY_BUNDLES[name] + (VERSION ? "?v=" + VERSION : "");
      s.onload = () => resolve();
      s.onerror = () => { loadedBundles[name] = null; reject(new Error("bundle: " + name)); };
      document.head.appendChild(s);
    });
    return loadedBundles[name];
  }
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
    // Sabit anahtar (university.json storageKey): site adı değişse de öğrencinin ilerlemesi kaybolmaz.
    storageKey: "pu." + (U.storageKey || slugify(U.name) || "university") + ".v1",
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
    unit_quiz: "Ünite Quiz'i",
    unit_quiz_question: "Ünite Sorusu",
  };
  const TYPE_RANK = { course: 0, chapter: 1, concept: 2, quiz_question: 3, unit_quiz_question: 4, exam_question: 5, past_question: 6, unit: 7, unit_quiz: 8, keyword: 9, event: 10, artifact: 11, past_exam: 12, quiz: 13, exam: 14 };

  const CG_FOLD = { "ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "I": "i", "ö": "o", "Ö": "o", "ş": "s", "Ş": "s", "ü": "u", "Ü": "u", "â": "a", "Â": "a", "î": "i", "Î": "i", "û": "u", "Û": "u" };
  const fold = (s) => String(s || "").replace(/[çÇğĞıİIöÖşŞüÜâÂîÎûÛ]/g, (ch) => CG_FOLD[ch]).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const tokenize = (s) => fold(s).split(/\s+/).filter(Boolean);
  const hayOf = (it) => it.hay || tokenize([it.title, it.snippet, it.definition, it.answer, it.course].filter(Boolean).join(" ")).join(" ");

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
    for (const it of CG().items || []) {
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
    const cg = CG();
    const ids = (cg.edges && cg.edges[id]) || [];
    const out = [];
    const seen = new Set();
    for (const other of ids) {
      if (seen.has(other)) continue;
      seen.add(other);
      const it = (cg.items || []).find((x) => x.id === other);
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
  // Görseller: build.py her JPG için boyutu ve WebP kopyalarını (tam boy + varsa 640px -sm)
  // window.OFFLINE.images içine yazar. WebP'yi destekleyen tarayıcı onu, diğerleri JPG'yi alır;
  // width/height sayfa kaymasını önler. data-full yakınlaştırmada açılacak tam boy dosyadır.
  const IMAGES = (window.OFFLINE && window.OFFLINE.images) || {};
  const fullImage = (src) => (IMAGES[src] ? String(src).replace(/\.jpg$/i, ".webp") : src);
  function imgTag(src, alt, extra) {
    if (!src) return "";
    const info = IMAGES[src];
    const img = (attrs) => `<img src="${esc(src)}"${attrs} alt="${esc(alt)}" loading="lazy" decoding="async" data-full="${esc(fullImage(src))}"${extra || ""}>`;
    if (!info) return img("");
    const [w, h, hasSmall] = info;
    const base = String(src).replace(/\.jpg$/i, "");
    const set = (hasSmall ? `${base}-sm.webp 640w, ` : "") + `${base}.webp ${w}w`;
    return `<picture><source type="image/webp" srcset="${esc(set)}" sizes="(max-width: 760px) 100vw, 720px">${img(` width="${w}" height="${h}"`)}</picture>`;
  }

  // Çok sayfalı infografik setleri: ilk sayfa hemen, kalanlar "Devamını yükle" ile (template içinde
  // durdukları için o ana kadar indirilmezler).
  function pagedHtml(items) {
    if (items.length < 2) return items.join("");
    const rest = items.length - 1;
    return `${items[0]}<template>${items.slice(1).join("")}</template><button type="button" class="btn ghost more-pages" data-more-pages>Devamını yükle (${rest} sayfa daha)</button>`;
  }

  // Arap harfli (Osmanlıca) metin: kaçışlı HTML içindeki Arapça dizileri sağdan sola bir span'e sarar.
  const OTA_RUN = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+(?:[\s\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]*[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF])?/g;
  // Sesli okunuş: data/<slug>/okunus.json (Arap harfli dizi → Latin okunuş). Okunuşu bilinen dizi
  // dokunulabilir olur; cihazın Türkçe metin okuma sesiyle okunur (ek dosya indirmez, internetsiz çalışır).
  const otaKey = (s) => String(s).replace(/ی/g, "ى").replace(/ک/g, "ك").replace(/\s+/g, " ").trim();
  const otaBare = (s) => s.replace(/[\u064B-\u0652\u0670]/g, "");
  const OKUNUS = new Map();
  for (const c of COURSES) for (const [k, v] of Object.entries(c.okunus || {})) {
    OKUNUS.set(otaKey(k), v);
    if (!OKUNUS.has(otaBare(otaKey(k)))) OKUNUS.set(otaBare(otaKey(k)), v);
  }
  const otaSay = (m) => { const k = otaKey(m); return OKUNUS.get(k) || OKUNUS.get(otaBare(k)) || ""; };
  const ota = (html) => String(html).replace(OTA_RUN, (m) => {
    const say = "speechSynthesis" in window ? otaSay(m) : "";
    return say
      ? `<span class="ota say" lang="ota" dir="rtl" data-say="${esc(say)}" role="button" tabindex="0" title="Dinle: ${esc(say)}">${m}</span>`
      : `<span class="ota" lang="ota" dir="rtl">${m}</span>`;
  });
  const txt = (s) => ota(esc(s));
  // Düğme/etiket içinde iç içe dokunulabilir öğe olmasın: okunuşsuz sarma.
  const txtPlain = (s) => esc(s).replace(OTA_RUN, (m) => `<span class="ota" lang="ota" dir="rtl">${m}</span>`);
  // Sınav kâğıdından kırpılmış Osmanlıca görsel; boyut [genişlik, yükseklik] 2x çözünürlüktedir.
  function otaImg(src, size, alt, scale) {
    if (!src) return "";
    const w = size && size[0] ? ` width="${Math.round(size[0] * (scale || 0.4))}"` : "";
    return `<img class="ota-img" src="${esc(src)}"${w} alt="${esc(alt || "Osmanlıca ifade")}" loading="lazy" decoding="async">`;
  }
  // Soru gövdesi: stemParts varsa (metin + görsel parçaları) onları, yoksa düz metni basar.
  function stemHtml(q) {
    if (!Array.isArray(q.stemParts) || !q.stemParts.length) return txt(q.question || q.stem || "");
    // Sınav PDF'inde soru gövdesi resim: okunur olsun diye çeviriyazıyı göster, aslını açılır kutuda ver.
    const src = q.stemParts.map((p) => (p.img ? otaImg(p.img, [p.w, p.h], "", 0.5) : txt(p.text))).join(" ");
    return `${txt(q.question || q.stem || "")}<details class="ota-src"><summary>Sınav kâğıdındaki hâli</summary><div>${src}</div></details>`;
  }
  function optHtml(o, plain) {
    return (o.image ? otaImg(o.image, o.imageSize, "", 0.62) + (o.text ? " " : "") : "") + (plain ? txtPlain : txt)(o.text || "");
  }

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

  let katexP = null;
  function ensureKatex() {
    if (window.renderMathInElement) return Promise.resolve();
    if (katexP) return katexP;
    const base = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/";
    katexP = Promise.all([
      new Promise((res, rej) => { const s = document.createElement("script"); s.src = base + "katex.min.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); }),
      new Promise((res, rej) => { const s = document.createElement("script"); s.src = base + "contrib/auto-render.min.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); }),
    ]).catch(() => { katexP = null; });
    return katexP;
  }

  function typeset(el) {
    // KaTeX yalnızca metinde formül işareti varsa yüklenir (dış sunucuya gereksiz istek ve çevrimdışı hata olmasın).
    if (!/\$|\\\(|\\\[/.test(el.textContent || "")) return;
    ensureKatex().then(() => {
      if (window.renderMathInElement) {
        window.renderMathInElement(el, {
          delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }, { left: "$", right: "$", display: false }],
          throwOnError: false,
          output: "mathml",
        });
      }
    });
  }

  // NotebookLM notları için en küçük markdown: başlıklar, madde imleri, kalın.
  // Kitaptan (PDF) alınmış notlarda satırlar sayfa genişliğinde kırılmış, kelimeler yumuşak tire (U+00AD)
  // ile ikiye bölünmüş olabilir. Bölünmüş kelimeleri birleştir, cümle ortasında kırılan satırları aynı
  // paragrafa al; böylece metin hem düzgün görünür hem de sesli okumada kesik kesik okunmaz.
  const LIST_LINE = /^\s*(?:[*•-]\s|#|\d+[.)]\s|[A-ZÇĞİÖŞÜ][.)]\s|---)/;
  function unwrap(text) {
    const lines = String(text || "").replace(/\u00ad[ \t]*\n[ \t]*/g, "").split("\n");
    const out = [];
    for (const raw of lines) {
      const prev = out.length ? out[out.length - 1] : "";
      const line = raw.trim();
      const p = prev.trim();
      const join = p && line && !LIST_LINE.test(line) && !/^#/.test(p) && !/[.!?:;…"”)]$|⟧$/.test(p)
        && (/^\p{Ll}/u.test(line) || (/[\p{L},]$/u.test(p) && p.length >= 45));
      if (join) out[out.length - 1] = /\p{L}-$/u.test(p) ? p + line : p + " " + line;
      else out.push(raw);
    }
    return out.join("\n");
  }
  function md(text) {
    const inline = (s) => ota(esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    let html = "", inList = false;
    for (const raw of unwrap(text).split("\n")) {
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
    const vids = courseVideos(c);
    const chapters = c.chapters.map((ch, i) => `<li>
        <div class="ch-text">
          <h3><a href="#/course/${c.slug}/chapter/${i + 1}">${esc(ch.title)}</a></h3>
          <p class="count">${ch.lectures.length} ${noun(c, ch.lectures.length)}</p>
          <p>${esc(ch.summary)}</p>
          <ul class="objectives">${ch.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
          ${ch.image ? `<figure class="plate">${imgTag(ch.image, ch.title + " infografiği", " data-zoom")}<figcaption><b>Şekil ${i + 1}.</b> ${esc(ch.title)}. Bu bölümün ${ch.lectures.length} ${noun(c, ch.lectures.length)}ından NotebookLM ile üretildi.</figcaption></figure>` : ""}
          ${aofFiguresHtml(ch, i + 1, "plate")}
          ${bookUnitFiguresHtml(c, i + 1, "plate")}
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
            ${vids.length ? `<a class="btn ghost" href="#/course/${c.slug}/videolar">Ders videoları (${vids.length})</a>` : ""}
            <a class="btn ghost" href="#/ozet">Ders özeti</a>
            <a class="btn ghost" href="#/course/${c.slug}/quiz">Final (oyun)</a>
            <a class="btn ghost" href="#/course/${c.slug}/exams">Çıkmış / sınavlar</a>
          </div>
          ${credit}
        </aside>
      </section>
      ${offlineCourseCardHtml(c)}
      <h2>Bölümler</h2>
      <ol class="syllabus">${chapters}</ol>
      ${bookUnitsExtraHtml(c)}`;
  }

  // Ders kitabı ünite özetlerinden üretilen infografikler (AÖF'ün yayınlamadığı dersler için).
  function bookUnitFigure(c, u, cls) {
    return `<figure class="${cls} aof-figure">${imgTag(u.image, `${u.title} ünite infografiği`, " data-zoom")}<figcaption><b>Ünite ${u.unit} özeti.</b> ${esc(u.title)}. AÖF ders kitabının ünite özetinden bu site için hazırlandı; resmî AÖF infografiği değildir.</figcaption></figure>`;
  }

  function bookUnitFiguresHtml(c, n, cls) {
    return (c.bookUnits || []).filter((u) => u.chapter === n).map((u) => bookUnitFigure(c, u, cls)).join("");
  }

  function bookUnitsExtraHtml(c) {
    const rest = (c.bookUnits || []).filter((u) => !u.chapter);
    if (!rest.length) return "";
    return `<h2>Diğer üniteler</h2>
      <p class="muted">Ders kitabında olup bölümlerde henüz işlenmeyen ünitelerin özet infografikleri.</p>
      ${rest.map((u) => bookUnitFigure(c, u, "plate")).join("")}`;
  }

  function aofFiguresHtml(ch, n, cls) {
    const raw = ch.aofInfographic;
    const nlmRaw = ch.nlmInfographic;
    if (!raw && !nlmRaw) return "";
    const aofList = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
    const nlmList = nlmRaw ? (Array.isArray(nlmRaw) ? nlmRaw : [nlmRaw]) : [];
    if (!aofList.length && !nlmList.length) return "";
    const uid = `inf-${n}-${Math.random().toString(36).slice(2, 7)}`;
    const tabs = [];
    const panes = [];
    if (nlmList.length) {
      tabs.push(`<button type="button" class="inf-tab is-active" data-pane="${uid}-nlm">Düzeltilmiş Infografik</button>`);
      panes.push(`<div class="inf-pane is-active" id="${uid}-nlm">${pagedHtml(nlmList.map((src, j) => infFigureHtml(src, ch, n, j, nlmList.length, cls, "nlm")))}</div>`);
    }
    if (aofList.length) {
      tabs.push(`<button type="button" class="inf-tab${nlmList.length ? "" : " is-active"}" data-pane="${uid}-aof">AÖF Infografik</button>`);
      panes.push(`<div class="inf-pane${nlmList.length ? "" : " is-active"}" id="${uid}-aof">${pagedHtml(aofList.map((src, j) => infFigureHtml(src, ch, n, j, aofList.length, cls, "aof")))}</div>`);
    }
    if (tabs.length < 2) return panes.join("");
    return `<div class="inf-toggle" data-uid="${uid}"><div class="inf-tabs">${tabs.join("")}</div>${panes.join("")}</div>`;
  }

  function infFigureHtml(src, ch, n, j, total, cls, kind) {
    const label = kind === "nlm" ? "Düzeltilmiş infografik" : "AÖF infografik";
    const cap = total > 1
      ? `<b>${label} ${j + 1}/${total}.</b> Ünite özet grafiği (yüksek çözünürlük).`
      : `<b>${label}.</b> Ünite özet grafiği (yüksek çözünürlük).`;
    return `<figure class="${cls} aof-figure">${imgTag(src, `${ch.title} ${label} ${j + 1}`, ` data-zoom`)}<figcaption>${cap}</figcaption></figure>`;
  }

  // Konu anlatımındaki citation için: bu bölüme bağlı çıkmış vize soruları.
  function chapterPastCites(c, n, limit) {
    const ch = (c.chapters || [])[n - 1];
    if (Array.isArray(ch && ch.cites) && ch.cites.length) {
      return ch.cites.slice(0, limit || 14).map((ct) => ({
        examId: ct.exam_id || ct.examId,
        year: ct.year,
        num: ct.num,
        stem: ct.stem || "",
      }));
    }
    const max = limit || 14;
    const out = [];
    for (const exam of pastFor(c.slug)) {
      if (out.length >= max) break;
      (exam.questions || []).forEach((q, i) => {
        if (out.length >= max) return;
        const chs = Array.isArray(q.chapters) && q.chapters.length
          ? q.chapters
          : (q.chapterMeta || []).map((m) => m.n);
        if (chs.indexOf(n) >= 0) {
          out.push({
            examId: exam.exam_id,
            year: exam.year || exam.exam_id,
            num: i + 1,
            stem: q.stem || q.question || "",
          });
        }
      });
    }
    return out;
  }

  function citeHref(slug, ct) {
    return `#/course/${slug}/past/${encodeURIComponent(ct.examId || ct.exam_id)}?mod=rehber&soru=${ct.num}&hl=sol`;
  }

  // Not gövdesindeki ⟦k⟧ marker'ları satır içi citation linklerine çevirir.
  function notesHtmlWithCites(ch, cites, slug) {
    let html = ch.notes ? md(ch.notes) : `<p class="muted">Bu bölümün çalışma notları henüz hazır değil.</p>`;
    if (!cites.length) {
      return html.replace(/⟦(\d+)⟧/g, "");
    }
    return html.replace(/⟦(\d+)⟧/g, (_, k) => {
      const idx = parseInt(k, 10) - 1;
      const ct = cites[idx];
      if (!ct) return "";
      const title = (ct.stem || "").replace(/"/g, "&quot;");
      return `<a class="inline-cite" href="${citeHref(slug, ct)}" title="${esc(title)}" aria-label="Kaynak ${k}: ${esc(title)}"><sup>[${k}]</sup></a>`;
    });
  }

  function chapterCiteHtml(c, n) {
    const cites = chapterPastCites(c, n);
    if (!cites.length) return "";
    const items = cites.map((ct, j) => {
      const href = citeHref(c.slug, ct);
      const short = ct.stem.length > 88 ? ct.stem.slice(0, 85).trimEnd() + "…" : ct.stem;
      return `<li class="cite-item"><a class="cite-link" href="${href}" title="${esc(ct.stem)}"><sup class="cite-num">[${j + 1}]</sup> <span class="cite-year">${esc(ct.year)}</span> · Soru ${ct.num}<span class="cite-stem">${esc(short)}</span></a></li>`;
    }).join("");
    return `<section class="cite-block">
      <h2>Çıkmış vize alıntıları</h2>
      <p class="muted" style="margin-top:-.3rem">Notlar içindeki <sup>[n]</sup> işaretleri bu listeye açılır. Alıntıya tıklayın; çözüm rehberinde soru açılır ve çözümü vurgulanır.</p>
      <ol class="cite-list">${items}</ol>
    </section>`;
  }

  function viewChapter(c, n) {
    const ch = c.chapters[n - 1];
    if (!ch) return viewNotFound();
    // Bir kaynağı yalnızca URL'si varsa bağla. Belgelerin, PDF'lerin ve yapıştırılmış metinlerin çoğu URL taşımaz.
    const lectures = ch.lectures.map((l, i) => {
      const inner = `<span class="n">${i + 1}</span><span>${esc(l.title)}</span>`;
      const yt = ytId(l.url);
      return `<li>${l.url ? `<a href="${esc(l.url)}" target="_blank" rel="noopener"${yt ? ` data-yt="${yt}"` : ""}>${inner}</a>` : `<span class="src">${inner}</span>`}</li>`;
    }).join("");
    const prev = n > 1 ? `<a class="btn ghost" href="#/course/${c.slug}/chapter/${n - 1}">Önceki bölüm</a>` : `<a class="btn ghost" href="#/course/${c.slug}">Ders planına dön</a>`;
    const next = n < c.chapters.length ? `<a class="btn" href="#/course/${c.slug}/chapter/${n + 1}">Sonraki bölüm</a>` : `<a class="btn" href="#/course/${c.slug}/quiz">Sınavı çöz</a>`;
    const nb = notebookButton(c);
    const allVids = courseVideos(c), chVids = allVids.filter((v) => v.ch === n);
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / ${n}. Bölüm</p>
      <p class="eyebrow">${esc(c.course)} · ${n}. Bölüm</p>
      <h1>${esc(ch.title)}</h1>
      <p class="lead muted" style="font:1.15rem/1.6 var(--serif)">${esc(ch.summary)}</p>
      ${ch.image ? `<figure class="figure">${imgTag(ch.image, ch.title + " infografiği", " data-zoom")}<figcaption><b>Şekil ${n}.</b> Yalnızca bu bölümün ${noun(c, 2)}lerinden NotebookLM ile üretildi.</figcaption></figure>` : ""}
      ${aofFiguresHtml(ch, n, "figure")}
      ${bookUnitFiguresHtml(c, n, "figure")}
      ${chVids.length ? `<h2 id="videolar">Bu bölümün videoları</h2>${videoPlayerHtml(c, chVids, { chapter: n })}${allVids.length > chVids.length ? `<p class="muted small" data-noprint><a href="#/course/${c.slug}/videolar">Dersin tüm videoları (${allVids.length})</a></p>` : ""}` : ""}
      <div class="two-col">
        <div>
          ${chapterReportHtml(c, n)}
          ${chapterCiteHtml(c, n)}
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
      <div class="ch-read-row" data-noprint>${chapterReadHtml(c, n)}</div>
      <div class="pager">${prev}${next}</div>`;
  }

  // ---- sınav ----------------------------------------------------------------
  const GRADED = new Set(["multiple_choice", "multiple_select", "fill_in_the_blank"]);
  // Türkçe karakterleri ASCII karşılıklarına çevirip küçük harfe çevirerek karşılaştır.
  const TR_FOLD = { "ç": "c", "Ç": "c", "ğ": "g", "Ğ": "g", "ı": "i", "İ": "i", "I": "i", "ö": "o", "Ö": "o", "ş": "s", "Ş": "s", "ü": "u", "Ü": "u", "â": "a", "Â": "a", "î": "i", "Î": "i", "û": "u", "Û": "u" };
  const norm = (s) => String(s || "").replace(/[çÇğĞıİIöÖşŞüÜâÂîÎûÛ]/g, (ch) => TR_FOLD[ch]).toLowerCase().replace(/\$/g, "").replace(/[^a-z0-9.%-]+/g, " ").trim();

  function questionHTML(q, i) {
    const head = `<div class="qn">Soru ${i + 1}${GRADED.has(q.type) ? "" : " · Tartışma, puanlanmaz"}</div><div class="qt">${stemHtml(q)}</div>`;
    if ((q.type === "multiple_choice" || q.type === "multiple_select") && Array.isArray(q.answerOptions)) {
      const type = q.type === "multiple_choice" ? "radio" : "checkbox";
      const opts = q.answerOptions.map((o, j) => `<label class="opt" data-opt="${j}"><input type="${type}" name="q${i}" value="${j}"><span>${optHtml(o, true)}</span></label><div class="rationale" data-rat="${j}" hidden>${txt(o.rationale || "")}</div>`).join("");
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
      fb = txt(q.solution);
    }
    if (fb || ok !== null) {
      const d = document.createElement("div");
      d.className = "feedback " + (ok === true ? "ok" : ok === false ? "no" : "");
      d.setAttribute("role", "status");
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
      }).join("") + (q._examId ? `<button type="button" class="sol-copy sol-game-copy" data-q="${q._pos || (i || 0) + 1}">Bu sorunun linkini kopyala</button>` : "");
      box.appendChild(wrap);
      const copyBtn = wrap.querySelector(".sol-game-copy");
      if (copyBtn && q._examId) {
        const path = `#/course/${q._slug || q.course}/past/${encodeURIComponent(q._examId)}?soru=${q._pos || (i || 0) + 1}`;
        copyBtn.dataset.link = path;
        copyBtn.onclick = async () => {
          const abs = location.href.split("#")[0] + path;
          try { await navigator.clipboard.writeText(abs); copyBtn.textContent = "Kopyalandı"; }
          catch (_) { copyBtn.textContent = abs; }
          setTimeout(() => { copyBtn.textContent = "Bu sorunun linkini kopyala"; }, 2000);
        };
      }
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
    return `<div class="hud" id="quiz-hud">
      <div class="hud-item"><span class="hud-k">Soru</span><span class="hud-v" id="hud-idx">${idx + 1}/${total}</span></div>
      <div class="hud-item"><span class="hud-k">Doğru</span><span class="hud-v" id="hud-right">0</span></div>
      <div class="hud-item"><span class="hud-k">Seri</span><span class="hud-v" id="hud-streak">0</span></div>
      <div class="hud-item"><span class="hud-k">Puan</span><span class="hud-v" id="hud-xp">0</span></div>
      <div class="hud-item"><span class="hud-k">Süre</span><span class="hud-v" id="hud-time">0s</span></div>
      <div class="hud-item hud-best"><span class="hud-k">Rekor</span><span class="hud-v">${g.bestXp} XP · seri ${g.bestStreak}</span></div>
      <div class="hud-bar" aria-hidden="true"><i id="hud-bar" style="width:${(idx / total) * 100}%"></i></div>
    </div>`;
  }

  function viewQuiz(c, opts) {
    if (!canAccess("quiz")) return viewGate("quiz");
    const o = opts || {};
    const questions = o.questions || c.quiz;
    const title = o.title || "Final";
    const eyebrow = o.eyebrow || "Oyun modu · Final";
    const graded = questions.filter((q) => GRADED.has(q.type)).length;
    const r = progress[c.slug];
    const g = gameStats(c.slug);
    return `<p class="crumbs">${o.crumbs || `<a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / Sınav`}</p>
      <div class="quiz-head">
        <div><p class="eyebrow">${esc(eyebrow)}</p><h1 style="margin:0">${esc(o.heading || c.course)}</h1></div>
        <div class="muted" style="font-size:.9rem">${graded} puanlı soru · geçme ${pct(CONFIG.passMark)}${r ? ` · en iyi ${pct(r.best)}` : ""}</div>
      </div>
      <p class="muted">${o.lead || "Sorular sırayla gelir. Her doğru <strong>+10</strong>; seri katlayarak bonus verir. Yanlış seriyi sıfırlar."}</p>
      <div id="game-root" data-course="${esc(c.slug)}">
        ${quizHudHtml(c, 0, questions.length)}
        <div id="game-stage"></div>
        <div id="result"></div>
      </div>`;
  }

  function bindQuiz(c, opts) {
    const o = opts || {};
    const root = document.getElementById("game-root");
    const stage = document.getElementById("game-stage");
    if (!root || !stage) return;

    const questions = o.questions || c.quiz;
    const gameKey = o.gameKey || c.slug;
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
      if (!hud("hud-idx")) return clearInterval(timer); // başka sayfaya geçildi
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
          <button class="btn ghost" type="button" id="skip-q" hidden>Sonraki</button>
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
          recordAnswer(q._qid, ok, null, "exam");
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
      const g = saveGameStats(gameKey, run);
      const isRecord = xp >= g.bestXp && xp > 0;
      const box = document.getElementById("result");
      box.innerHTML = `<div class="result ${passed ? "pass" : "fail"} game-result">
        <p class="eyebrow">${passed ? "Geçti" : "Henüz geçemedi"}${isRecord ? " · Yeni rekor!" : ""}</p>
        <h2>${xp} XP · ${gradedRight}/${gradedDone} doğru · ${pct(score)}</h2>
        <ul class="game-stats">
          <li><b>${bestStreakRun}</b> en uzun seri</li>
          <li><b>${fmtMs(timeMs)}</b> toplam süre</li>
          <li><b>${fmtMs(avgMs)}</b> soru başına</li>
          <li><b>${g.bestXp}</b> rekor XP (${g.runs} deneme)</li>
        </ul>
        <p>${passed ? "Bu ders artık transkriptinizde." : `Geçmek için ${pct(CONFIG.passMark)} gerekir. Özet sayfasından tekrar edin.`}</p>
        <div class="btn-row"><a class="btn ghost on-dark" href="#/transcript">Transkript</a>
        <button class="btn ghost on-dark" type="button" id="retry">Tekrar oyna</button></div></div>`;
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
      const id = encodeURIComponent(s.exam_id);
      return `<li class="past-row">
        <div>
          <a href="#/course/${c.slug}/past/${id}"><strong>${esc(s.year || s.exam_id)}</strong>${s.group ? " · " + esc(s.group) + " grup" : ""} · ${esc(String(s.term || "guz").replace("guz", "Güz").replace("bahar", "Bahar").replace("yaz", "Yaz"))} vize</a>
          <div class="muted" style="font-size:.82rem">${n} soru${s.hasAnswerKey === false ? "" : " · cevap anahtarı var"}</div>
        </div>
        <div class="btn-row" style="margin:0">
          <a class="btn ghost" href="#/course/${c.slug}/past/${id}?mod=rehber">Çözüm rehberi</a>
          <a class="btn ghost" href="#/course/${c.slug}/past/${id}">Çöz</a>
        </div>
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
        ${unitQuizCard(c)}
        <a class="exam-card" href="#/karisik?ders=${c.slug}"><span class="exam-badge">Karışık</span><h3>Karışık test</h3><p>Bu dersten ünite seçerek alıştırma ya da süreli deneme sınavı.</p></a>
      </div>
      ${sessions.length ? `<h2>Çıkmış vize dönemleri</h2><ul class="past-list">${pastList}</ul>` : ""}`;
  }

  // ---- ünite quiz'leri (NotebookLM çıkmış soru üretimi) --------------------
  const UQ = () => (window.UNIT_QUIZZES || {});

  function unitQuizMap(slug) {
    return UQ()[slug] || {};
  }

  function viewUnitQuizList(c) {
    const map = unitQuizMap(c.slug);
    const units = Object.keys(map).map((k) => +k).sort((a, b) => a - b);
    if (!units.length) return viewNotFound();
    const rows = units.map((u) => {
      const q = map[String(u)];
      const n = (q.questions || []).length;
      return `<li class="past-row">
        <div>
          <a href="#/course/${c.slug}/unit-quiz/${u}"><strong>Ünite ${u}</strong> · ${esc(q.unitTitle || q.title || "")}</a>
          <div class="muted" style="font-size:.82rem">${n} soru · çıkmış vize kaynaklı · oyun modu</div>
        </div>
        <div class="btn-row" style="margin:0">
          <a class="btn ghost" href="#/course/${c.slug}/unit-quiz/${u}">Çöz</a>
          <a class="btn ghost" href="#/course/${c.slug}/chapter/${u}">Konu anlatımı</a>
        </div>
      </li>`;
    }).join("");
    const total = units.reduce((n, u) => n + ((map[String(u)].questions || []).length), 0);
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / <a href="#/course/${c.slug}/exams">Sınavlar</a> / Ünite quiz'leri</p>
      <div class="quiz-head">
        <div><p class="eyebrow">Ünite quiz'leri</p><h1 style="margin:0">${esc(c.course)}</h1></div>
        <div class="muted" style="font-size:.9rem">${units.length} ünite · ${total} soru · NotebookLM çıkmış vize kaynaklı</div>
      </div>
      <p class="muted">Her ünite için 10-15 soruluk oyun modu. Sorular NotebookLM'de yüklenen çıkmış vize PDF'lerinden üretildi.</p>
      <ul class="past-list">${rows}</ul>`;
  }

  function viewUnitQuiz(c, n) {
    const q = unitQuizMap(c.slug)[String(n)];
    if (!q || !(q.questions || []).length) return viewNotFound();
    const questions = q.questions;
    const eyebrow = `Ünite quiz · ${n}`;
    const heading = q.unitTitle || `Ünite ${n}`;
    return viewQuiz(c, {
      questions,
      eyebrow,
      heading,
      crumbs: `<a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / <a href="#/course/${c.slug}/unit-quiz">Ünite quiz'leri</a> / Ünite ${n}`,
      lead: `${questions.length} soru · çıkmış vize kaynaklı. Her doğru <strong>+10</strong>; seri bonusu verir.`,
    });
  }

  function bindUnitQuiz(c, n) {
    const q = unitQuizMap(c.slug)[String(n)];
    if (!q) return;
    tagUnitQuizzes();
    bindQuiz(c, { questions: q.questions, gameKey: `${c.slug}:u${n}` });
  }

  function unitQuizCard(c) {
    const units = Object.keys(unitQuizMap(c.slug)).length;
    if (!units) return "";
    const total = Object.values(unitQuizMap(c.slug)).reduce((n, x) => n + ((x.questions || []).length), 0);
    return `<a class="exam-card" href="#/course/${c.slug}/unit-quiz">
      <span class="exam-badge">Yeni</span>
      <h3>Ünite quiz'leri</h3>
      <p>${units} ünite · ${total} soru · çıkmış vize kaynaklı, her ünite 10-15 soru.</p>
    </a>`;
  }

  // ---- global sınav sayfası (tüm dersler tek yerde) -------------------------
  function viewSinavlar() {
    if (!COURSES.length) return `<p class="eyebrow">Sınavlar</p><h1>Sınav merkezi</h1><p class="muted">Henüz ders eklenmemiş.</p>`;
    const rows = COURSES.map((c) => {
      const sessions = pastFor(c.slug);
      const totalPast = sessions.reduce((n, s) => n + (s.questions || []).length, 0);
      const uq = unitQuizMap(c.slug);
      const unitKeys = Object.keys(uq).map((k) => +k).sort((a, b) => a - b);
      const unitQ = unitKeys.reduce((n, u) => n + ((uq[String(u)].questions || []).length), 0);
      const quizN = (c.quiz || []).length;
      const r = progress[c.slug];
      const g = gameStats(c.slug);
      const chips = [
        quizN ? `<a class="btn ghost sm-mini" href="#/course/${c.slug}/quiz">Final (${quizN})</a>` : "",
        unitKeys.length ? `<a class="btn ghost sm-mini" href="#/course/${c.slug}/unit-quiz">Ünite quiz (${unitKeys.length} · ${unitQ})</a>` : "",
        totalPast ? `<a class="btn ghost sm-mini" href="#/course/${c.slug}/exams">Çıkmış vize (${sessions.length} · ${totalPast})</a>` : "",
      ].filter(Boolean).join("");
      return `<li class="past-row">
        <div>
          <a href="#/course/${c.slug}/exams"><strong>${esc(c.subject)}</strong></a>
          <div class="muted" style="font-size:.82rem">
            ${quizN ? `final ${quizN} soru` : ""}
            ${unitKeys.length ? ` · ${unitKeys.length} ünite quiz (${unitQ} soru)` : ""}
            ${totalPast ? ` · ${sessions.length} çıkmış oturum (${totalPast} soru)` : ""}
            ${r && r.best ? ` · en iyi ${pct(r.best)}` : ""}
            ${g.runs ? ` · ${g.bestXp} XP rekor` : ""}
          </div>
        </div>
        <div class="btn-row" style="margin:0;flex-wrap:wrap;justify-content:flex-end">${chips}</div>
      </li>`;
    }).join("");
    const totalSessions = COURSES.reduce((n, c) => n + pastFor(c.slug).length, 0);
    const totalPastQ = COURSES.reduce((n, c) => n + pastFor(c.slug).reduce((m, s) => m + (s.questions || []).length, 0), 0);
    const totalUnits = COURSES.reduce((n, c) => n + Object.keys(unitQuizMap(c.slug)).length, 0);
    const totalQuizQ = COURSES.reduce((n, c) => n + COURSES.find((x) => x.slug === c.slug).quiz.length, 0);
    const passedN = passedCount();
    return `${todayStripHtml()}<p class="eyebrow">Sınav merkezi</p><h1>Tüm sınavlar</h1>
      <p class="lead muted">Final quiz'leri, ünite quiz'leri ve çıkmış vize arşivleri tek listede. Puan, XP ve seri ilerlemesi bu tarayıcıda saklanır.</p>
      <div class="stat" style="display:flex;gap:1.5rem;flex-wrap:wrap;margin:.5rem 0 1.4rem">
        <span><b>${COURSES.length}</b>ders</span>
        <span><b>${totalQuizQ}</b>final sorusu</span>
        <span><b>${totalUnits}</b>ünite quiz</span>
        <span><b>${totalSessions}</b>çıkmış oturum</span>
        <span><b>${totalPastQ}</b>arşiv sorusu</span>
        <span><b>${passedN}/${COURSES.length}</b>geçilen ders</span>
      </div>
      <div class="exam-cards">
        <a class="exam-card" href="#/karisik?mod=deneme"><span class="exam-badge">AÖF formatı</span><h3>Deneme sınavı</h3><p>Seçtiğin derslerden 20 soru, 30 dakika. Sonunda net ve puan; 4 yanlış 1 doğruyu götürür.</p></a>
        <a class="exam-card" href="#/karisik?mod=alistirma"><span class="exam-badge">Karışık</span><h3>Karışık test</h3><p>Ders, kaynak ve ünite seçerek kendi testini oluştur; yanlışlarından ya da hiç çözmediklerinden.</p></a>
        <a class="exam-card" href="#/analiz"><span class="exam-badge">Analiz</span><h3>Gelişim paneli</h3><p>Ünite ünite doğruluk, en zayıf 10 konu ve deneme puanlarının gelişimi.</p></a>
      </div>
      <h2>Dersler</h2>
      <ul class="past-list">${rows}</ul>`;
  }

  function viewPastExam(c, examId, query) {
    const sessions = pastFor(c.slug);
    const exam = sessions.find((s) => s.exam_id === examId) || sessions[0];
    if (!exam) return viewNotFound();
    const n = (exam.questions || []).length;
    const hasKey = exam.hasAnswerKey !== false && (exam.questions || []).some((q) => q.correct || (q.options || []).some((o) => o.isCorrect));
    const grp = exam.group && exam.group !== "A" ? ` · ${exam.group} grup` : "";
    const eid = encodeURIComponent(exam.exam_id);
    const rehber = String(query.mod || "") === "rehber";
    if (rehber) {
      return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / <a href="#/course/${c.slug}/exams">Sınavlar</a> / <a href="#/course/${c.slug}/past/${eid}">Çıkmış vize</a> / Çözüm rehberi</p>
        <div class="quiz-head">
          <div><p class="eyebrow">Çözüm rehberi</p><h1 style="margin:0">${esc(exam.year || exam.exam_id)}${esc(grp)}</h1></div>
          <div class="muted" style="font-size:.9rem">${n} soru · her sorunun kalıcı linki var</div>
        </div>
        <div class="btn-row"><a class="btn ghost" href="#/course/${c.slug}/past/${eid}">Oyun moduna geç</a></div>
        <ol class="sol-toc" id="sol-toc">
          ${Array.from({ length: n }, (_, i) => `<li><a href="#/course/${c.slug}/past/${eid}?mod=rehber&amp;soru=${i + 1}">${i + 1}. soru</a></li>`).join("")}
        </ol>
        <div id="sol-guide" data-exam="${esc(exam.exam_id)}" data-course="${esc(c.slug)}" data-n="${n}"></div>`;
    }
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / <a href="#/course/${c.slug}/exams">Sınavlar</a> / Çıkmış vize</p>
      <div class="quiz-head">
        <div><p class="eyebrow">Çıkmış vize${hasKey ? " · puanlı" : " · anımsama"}</p><h1 style="margin:0">${esc(exam.year || exam.exam_id)}${esc(grp)}</h1></div>
        <div class="muted" style="font-size:.9rem">${n} soru · ${hasKey ? "cevap anahtarı var (PDF son sayfa)" : "cevap anahtarı yok"}${exam.group ? " · grup " + esc(exam.group) : ""}</div>
      </div>
      <p class="muted">${hasKey ? "Doğru cevap otomatik işaretlenir. Puan, süre ve seri anlık HUD'da." : "Seçenekler PDF OCR olabilir; kendinizi işaretleyin."}</p>
      <div class="btn-row"><a class="btn ghost" href="#/course/${c.slug}/past/${eid}?mod=rehber">Çözüm rehberi (tüm sorular)</a></div>
      <div id="game-root" data-course="${esc(c.slug)}" data-exam="${esc(exam.exam_id)}" data-mode="past">
        ${quizHudHtml(c, 0, n)}
        <div id="game-stage"></div>
        <div id="result"></div>
      </div>`;
  }

  function pastQuestionHtml(q, i) {
    const letters = ["A", "B", "C", "D", "E", "F"];
    const opts = (q.options || []).map((o, j) => `<label class="opt" data-opt="${j}"><input type="radio" name="q${i}" value="${j}"><span><b>${esc(o.key || letters[j])})</b> ${optHtml(o, true)}</span></label>`).join("");
    const chLinks = (q.chapters || []).map((n) => `<a href="#/course/${q._slug}/chapter/${n}">${n}. bölüm</a>`).join(" · ");
    const kw = (q.keywords || []).map((k) => `<span class="chip">${esc(k)}</span>`).join("");
    return `<div class="qn">Soru ${i + 1}${q.unit ? ` · Ünite ${q.unit}` : ""}</div>
      <div class="qt">${stemHtml(q)}</div>
      ${opts ? opts : `<p class="muted">Bu soru için okunabilir seçenek metni yok. Aklınızdaki cevabı düşünüp alttaki butonla işaretleyin.</p>`}
      ${q.unitTitle ? `<p class="muted" style="font-size:.85rem;margin:.6rem 0 0">İlgili ünite: <strong>${esc(q.unitTitle)}</strong>${chLinks ? " · " + chLinks : ""}</p>` : ""}
      ${kw ? `<div class="chip-row">${kw}</div>` : ""}`;
  }

  function solutionGuideItemHtml(q, i, c, examId) {
    const letters = ["A", "B", "C", "D", "E", "F"];
    const correctIdx = (q.options || []).findIndex((o) => o.isCorrect || o.key === q.correct);
    const opts = (q.options || []).map((o, j) => {
      const letter = o.key || letters[j];
      const cls = j === correctIdx ? "opt sol-correct" : "opt";
      const mark = j === correctIdx ? " · doğru" : "";
      return `<div class="${cls}"><span><b>${esc(letter)})</b> ${optHtml(o)}${mark}</span></div>`;
    }).join("");
    const link = "#/course/" + c.slug + "/past/" + encodeURIComponent(examId) + "?mod=rehber&soru=" + (i + 1);
    const metas = Array.isArray(q.chapterMeta) && q.chapterMeta.length
      ? q.chapterMeta
      : (q.chapters || []).map((n) => ({ n: n, title: n + ". bölüm", summary: "" }));
    const chHtml = metas.map((m) => {
      const sum = m.summary ? `<span>${esc(m.summary)}</span>` : "";
      return `<a class="solution-link" href="#/course/${c.slug}/chapter/${m.n}">${esc(m.n)}. ${esc(m.title || "")}${sum}</a>`;
    }).join("");
    const solHtml = q.solution
      ? `<div class="feedback ok sol-feedback"><strong>Çözüm.</strong> ${txt(q.solution)}</div>`
      : "";
    return `<article class="q sol-item" id="soru-${i + 1}" data-soru="${i + 1}">
      <div class="sol-item-head">
        <div class="qn">Soru ${i + 1}${q.unit ? ` · Ünite ${q.unit}` : ""}</div>
        <button type="button" class="sol-copy" data-link="${esc(link)}" title="Bu sorunun linkini kopyala">Linki kopyala</button>
      </div>
      <div class="qt">${stemHtml(q)}</div>
      ${opts}
      ${solHtml}
      <div class="solution-links">
        <p class="solution-label">İlgili bölüm</p>
        ${chHtml}
        <a class="solution-link sol-self" href="${esc(link)}">Bu sorunun kalıcı linki<span>${esc(link)}</span></a>
      </div>
    </article>`;
  }

  function bindSolutionGuide(c, examId) {
    const root = document.getElementById("sol-guide");
    if (!root) return;
    const exam = pastFor(c.slug).find((s) => s.exam_id === examId) || pastFor(c.slug)[0];
    if (!exam) return;
    const questions = exam.questions || [];
    root.innerHTML = questions.map((q, i) => {
      const n = Object.assign({}, q, { _slug: c.slug });
      return solutionGuideItemHtml(n, i, c, exam.exam_id);
    }).join("");
    root.querySelectorAll(".sol-copy").forEach((btn) => {
      btn.onclick = async () => {
        const abs = location.href.split("#")[0] + btn.dataset.link;
        try {
          await navigator.clipboard.writeText(abs);
          btn.textContent = "Kopyalandı";
        } catch (_) {
          btn.textContent = abs;
        }
        setTimeout(() => { btn.textContent = "Linki kopyala"; }, 2000);
      };
    });
    const qraw = parseLoc().query.soru;
    const qnum = parseInt(String(qraw || "").split("#")[0], 10);
    const hl = String(parseLoc().query.hl || "") === "sol";
    if (qnum >= 1 && qnum <= questions.length) {
      const el = root.querySelector(`#soru-${qnum}`);
      if (el) {
        el.classList.add("sol-focus");
        if (hl) {
          const sol = el.querySelector(".sol-feedback");
          if (sol) sol.classList.add("sol-highlight");
        }
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }
  }

  function bindPastExam(c, examId) {
    const root = document.getElementById("game-root");
    const stage = document.getElementById("game-stage");
    if (!root || !stage) return;
    const exam = pastFor(c.slug).find((s) => s.exam_id === examId) || pastFor(c.slug)[0];
    if (!exam) return;
    const questions = (exam.questions || []).map((q, i) => pastToQuiz(q, c.slug, exam, i));
    const hasKey = questions.some((q) => q.answerOptions.some((o) => o.isCorrect));
    const startQ = Math.max(1, Math.min(questions.length || 1, parseInt(String(parseLoc().query.soru || "1").split("#")[0], 10) || 1));
    let idx = startQ - 1, right = 0, streak = 0, bestStreakRun = 0, xp = 0, gradedDone = 0, gradedRight = 0;
    const t0 = Date.now();
    let timer = null;
    const hud = (id) => document.getElementById(id);

    function paintHud() {
      if (!hud("hud-idx")) return clearInterval(timer); // başka sayfaya geçildi
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
      if (q._examId == null) q._examId = exam.exam_id;
      const hashQ = `?soru=${i + 1}`;
      const base = `#/course/${c.slug}/past/${encodeURIComponent(exam.exam_id)}`;
      history.replaceState(null, "", location.pathname + location.search + base + hashQ);
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
          recordAnswer(q._qid, ok, null, "exam");
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
            recordAnswer(q._qid, ok, null, "exam");
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
        <p class="eyebrow">Çıkmış vize tamamlandı${isRecord ? " · Yeni rekor!" : ""}</p>
        <h2>${xp} XP · ${gradedRight}/${gradedDone} bildim · ${pct(score)}</h2>
        <ul class="game-stats">
          <li><b>${bestStreakRun}</b> en uzun seri</li>
          <li><b>${fmtMs(timeMs)}</b> toplam süre</li>
          <li><b>${fmtMs(avgMs)}</b> soru başına</li>
          <li><b>${g.bestXp}</b> rekor XP</li>
        </ul>
        <div class="btn-row">
          <a class="btn ghost on-dark" href="#/course/${c.slug}/exams">Sınavlar</a>
          <button class="btn ghost on-dark" type="button" id="retry">Tekrar oyna</button>
        </div></div>`;
      document.getElementById("retry").onclick = () => route();
      const bar = document.getElementById("hud-bar");
      if (bar) bar.style.width = "100%";
      paintHud();
      document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showQuestion(idx);
  }

  // ---- öğrenme döngüsü: aralıklı tekrar, hatalarım, günlük seri ve hedef ------------
  // Her puanlı cevap (final, ünite quiz'i, çıkmış vize, tekrar) bir "kart"a işlenir. Kartlar FSRS-4.5
  // (açık kaynak aralıklı tekrar algoritması, varsayılan ağırlıklar) ile planlanır; bir sonraki
  // tekrar, unutma olasılığı %10'a çıktığı gün gelir. Yanlış cevaplanan sorular "Hatalarım"da durur.
  // Veri ayrı anahtarda saklanır: localStorage[storageKey + ".study"].
  //   cards[id] = { s, d, due, last, reps, lapses, ok, wrong, right, fixedAt }
  //   days["YYYY-MM-DD"] = { n: cevap, ok: doğru, rev: tekrar, fresh: yeni kart, read: okunan bölüm }
  const STUDY_KEY = CONFIG.storageKey + ".study";
  const DAY_MS = 86400000;
  const GOAL_OPTIONS = [10, 20, 30, 50];
  const NEW_OPTIONS = [0, 5, 10, 20, 30];
  function loadStudy() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(STUDY_KEY)) || {}; } catch (e) { s = {}; }
    return Object.assign({ v: 1, cards: {}, days: {}, frozen: [], goal: 20, newPerDay: 10, courses: null, goalDone: "", log: [], mocks: [], videos: {}, vrate: 1, listen: {}, lrate: 1, plan: null }, s);
  }
  function saveStudy() {
    try { localStorage.setItem(STUDY_KEY, JSON.stringify(study)); } catch (e) { /* özel mod */ }
  }
  let study = loadStudy();

  // -- tarih yardımcıları (yerel gün) --
  const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const dayStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const addDays = (t, n) => { const d = new Date(t); d.setDate(d.getDate() + n); return d.getTime(); };
  const todayKey = () => dayKey(Date.now());
  const TR_MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const fmtDay = (key) => { const [y, m, d] = key.split("-").map(Number); return `${d} ${TR_MONTHS[m - 1]}`; };
  function dayRec(key) {
    return study.days[key] || (study.days[key] = { n: 0, ok: 0, rev: 0, fresh: 0, read: 0 });
  }
  const isActive = (key) => { const r = study.days[key]; return !!(r && (r.n || r.read || r.vid || r.lis)) || study.frozen.includes(key); };

  // Seri: bugünden (bugün henüz çalışılmadıysa dünden) geriye kesintisiz aktif gün sayısı.
  function streakInfo() {
    let t = Date.now();
    const today = isActive(dayKey(t));
    if (!today) t = addDays(t, -1);
    let n = 0;
    while (isActive(dayKey(t))) { n++; t = addDays(t, -1); }
    return { n, today };
  }
  function bestStreak() {
    const keys = Object.keys(study.days).filter(isActive).concat(study.frozen).sort();
    let best = 0, run = 0, prev = null;
    for (const k of Array.from(new Set(keys))) {
      const t = new Date(k + "T12:00:00").getTime();
      run = prev !== null && dayKey(addDays(prev, 1)) === k ? run + 1 : 1;
      best = Math.max(best, run);
      prev = t;
    }
    return best;
  }
  // Seri dondurma: ayda bir kez, tek bir boş gün seriyi bozmaz (dün boşsa ve önceki gün aktifse).
  function applyFreeze() {
    const y = addDays(Date.now(), -1), yk = dayKey(y);
    const month = yk.slice(0, 7);
    if (isActive(yk) || !isActive(dayKey(addDays(y, -1)))) return;
    if (study.frozen.some((k) => k.slice(0, 7) === month)) return;
    study.frozen.push(yk);
    saveStudy();
  }
  const freezeUsedThisMonth = () => study.frozen.find((k) => k.slice(0, 7) === todayKey().slice(0, 7)) || "";

  // -- FSRS-4.5 --
  const FSRS_W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
  const FSRS_DECAY = -0.5, FSRS_FACTOR = 19 / 81;
  const clampD = (d) => Math.min(10, Math.max(1, d));
  const initD = (g) => clampD(FSRS_W[4] - (g - 3) * FSRS_W[5]);
  const retrievability = (days, s) => Math.pow(1 + FSRS_FACTOR * days / s, FSRS_DECAY);
  const intervalDays = (s) => Math.min(365, Math.max(1, Math.round(s))); // %90 hedef tutmada aralık = kararlılık
  // Kararlılık (gün): g = 1 Tekrar (bilemedim), 2 Zor, 3 İyi, 4 Kolay.
  function fsrsStability(c, g, now) {
    if (!c.reps || !c.s) return FSRS_W[g - 1];
    const elapsed = Math.max(0, (now - c.last) / DAY_MS);
    const r = retrievability(elapsed, c.s);
    if (g === 1) return Math.min(c.s, FSRS_W[11] * Math.pow(c.d, -FSRS_W[12]) * (Math.pow(c.s + 1, FSRS_W[13]) - 1) * Math.exp(FSRS_W[14] * (1 - r)));
    // Aynı gün içindeki ikinci bakış: FSRS-5'in kısa dönem formülü (uzun dönem formülü burada neredeyse hiç büyümez).
    if (elapsed < 1) return c.s * Math.exp(0.5425 * (g - 3 + 0.0912));
    return c.s * (1 + Math.exp(FSRS_W[8]) * (11 - c.d) * Math.pow(c.s, -FSRS_W[9]) * (Math.exp(FSRS_W[10] * (1 - r)) - 1)
      * (g === 2 ? FSRS_W[15] : 1) * (g === 4 ? FSRS_W[16] : 1));
  }
  // Kartın yeni hâlini döndürür (eskisini değiştirmez). ivl: gün cinsinden aralık; Zor < İyi < Kolay sırası korunur.
  function fsrsNext(card, g, now) {
    const c = Object.assign({ reps: 0, lapses: 0 }, card);
    const s = Math.max(0.1, fsrsStability(c, g, now));
    let ivl = g === 1 ? 0 : intervalDays(s);
    if (g === 3) ivl = Math.max(ivl, intervalDays(fsrsStability(c, 2, now)) + 1);
    if (g === 4) ivl = Math.max(ivl, intervalDays(fsrsStability(c, 3, now)) + 2);
    ivl = Math.min(365, ivl);
    c.d = !c.reps || !c.d ? initD(g) : clampD(FSRS_W[7] * initD(3) + (1 - FSRS_W[7]) * (c.d - FSRS_W[6] * (g - 3)));
    if (g === 1 && c.reps) c.lapses++;
    c.s = s;
    c.ivl = ivl;
    c.reps++;
    c.last = now;
    // Bilemediğin kart 10 dakika sonra aynı oturumda yeniden gelir; diğerleri gün başında açılır.
    c.due = g === 1 ? now + 10 * 60000 : addDays(dayStart(now), ivl);
    return c;
  }
  const fmtInterval = (card, g) => {
    if (g === 1) return "10 dk";
    const days = fsrsNext(card, g, Date.now()).ivl;
    return days < 30 ? `${days} g` : days < 365 ? `${Math.round(days / 30)} ay` : "1 yıl";
  };

  // -- soru bankası: her puanlı sorunun kalıcı kimliği ve oynatılabilir hâli --
  function hashStr(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(36);
  }
  const termName = (t) => String(t || "guz").replace("guz", "Güz").replace("bahar", "Bahar").replace("yaz", "Yaz");
  // Çıkmış vize sorusunu oyun motorunun beklediği biçime çevirir (cevap anahtarı seçeneklerde işaretli).
  function pastToQuiz(q, slug, exam, i) {
    return {
      ...q,
      _slug: slug,
      course: slug,
      _examId: exam.exam_id,
      _qid: `p:${slug}:${exam.exam_id}:${q.n || i + 1}`,
      _pos: i + 1,
      type: "multiple_choice",
      question: q.question || q.stem || "",
      solution: q.solution || "",
      chapterMeta: q.chapterMeta || [],
      answerOptions: (q.options || []).map((o) => ({
        text: o.text,
        image: o.image,
        imageSize: o.imageSize,
        rationale: o.rationale || "",
        isCorrect: !!(o.isCorrect || (q.correct && o.key === q.correct)),
      })),
    };
  }
  COURSES.forEach((c) => (c.quiz || []).forEach((q) => { q._qid = `f:${c.slug}:${hashStr(q.question || "")}`; q._slug = c.slug; }));
  function tagUnitQuizzes() {
    for (const c of COURSES) {
      for (const [u, set] of Object.entries(unitQuizMap(c.slug))) {
        (set.questions || []).forEach((q) => { if (!q._qid) { q._qid = `u:${c.slug}:${u}:${hashStr(q.question || q.stem || "")}`; q._slug = c.slug; } });
      }
    }
  }
  let bankCache = null, bankSig = "";
  // id -> { q, slug, unit, label, href } ; çıkmış sorular past_exams.js yüklüyse eklenir.
  function questionBank() {
    const sig = Object.keys(PAST()).length + ":" + Object.keys(UQ()).length;
    if (bankCache && sig === bankSig) return bankCache;
    tagUnitQuizzes();
    const bank = new Map();
    for (const c of COURSES) {
      (c.quiz || []).forEach((q, i) => {
        if (GRADED.has(q.type)) bank.set(q._qid, { q, slug: c.slug, unit: 0, label: `Final · ${i + 1}. soru`, href: `#/course/${c.slug}/quiz` });
      });
      for (const [u, set] of Object.entries(unitQuizMap(c.slug))) {
        (set.questions || []).forEach((q, i) => {
          if (GRADED.has(q.type)) bank.set(q._qid, { q, slug: c.slug, unit: +u, label: `Ünite ${u} quiz · ${i + 1}. soru`, href: `#/course/${c.slug}/unit-quiz/${u}` });
        });
      }
      for (const exam of pastFor(c.slug)) {
        (exam.questions || []).forEach((raw, i) => {
          const q = pastToQuiz(raw, c.slug, exam, i);
          if (!q.answerOptions.some((o) => o.isCorrect)) return;
          bank.set(q._qid, {
            q, slug: c.slug, unit: +raw.unit || 0,
            label: `${exam.year || exam.exam_id} ${termName(exam.term)} vize${exam.group && exam.group !== "A" ? " " + exam.group + " grup" : ""} · ${i + 1}. soru`,
            href: `#/course/${c.slug}/past/${encodeURIComponent(exam.exam_id)}?mod=rehber&soru=${i + 1}`,
          });
        });
      }
    }
    bankCache = bank; bankSig = sig;
    return bank;
  }

  // -- cevap kaydı: tüm sınav modları buradan geçer --
  // g verilmezse doğru=İyi(3), yanlış=Tekrar(1) sayılır. kind: "exam" | "review" | "fresh"
  function recordAnswer(id, ok, g, kind) {
    if (!id || ok === null || ok === undefined) return;
    const now = Date.now();
    const key = dayKey(now);
    const wasActive = isActive(key);
    const prev = study.cards[id];
    const card = fsrsNext(prev, g || (ok ? 3 : 1), now);
    card.right = (prev && prev.right || 0) + (ok ? 1 : 0);
    card.wrong = (prev && prev.wrong || 0) + (ok ? 0 : 1);
    if (ok && prev && prev.ok === false) card.fixedAt = now;
    card.ok = !!ok;
    study.cards[id] = card;
    // Son cevaplar (karışık testte "son 50 cevapta yanlışlarım" süzgeci için), en fazla 3000 kayıt.
    study.log.push([now, id, ok ? 1 : 0]);
    if (study.log.length > 3000) study.log.splice(0, study.log.length - 3000);
    const day = dayRec(key);
    day.n++;
    if (ok) day.ok++;
    if (kind === "review") day.rev++;
    if (kind === "fresh" || (!prev && kind === "review")) day.fresh++;
    saveStudy();
    afterActivity(wasActive, key);
  }
  function recordRead() {
    const key = todayKey();
    const wasActive = isActive(key);
    dayRec(key).read++;
    saveStudy();
    afterActivity(wasActive, key);
  }
  function afterActivity(wasActive, key) {
    const day = study.days[key];
    if (!wasActive) {
      const s = streakInfo().n;
      if (s > 1) showToast(`Seri ${s} gün oldu. Böyle devam!`);
    }
    if (day.n >= study.goal && study.goalDone !== key) {
      study.goalDone = key;
      saveStudy();
      showToast(`Günlük hedef tamam: bugün ${day.n} soru çözdün.`, "Çalışma masası", () => { location.hash = "#/calisma"; });
    }
    paintStudyBadges();
  }

  // -- sayımlar --
  const dueCards = (now) => Object.entries(study.cards).filter(([, c]) => c.due <= (now || Date.now()));
  const openMistakes = () => Object.entries(study.cards).filter(([, c]) => c.ok === false);
  const courseOfId = (id) => id.split(":")[1];
  const studyCourses = () => (Array.isArray(study.courses) && study.courses.length ? study.courses.filter((s) => bySlug[s]) : COURSES.map((c) => c.slug));
  const freshLeftToday = () => Math.max(0, study.newPerDay - ((study.days[todayKey()] || {}).fresh || 0));
  function paintStudyBadges() {
    const n = dueCards().filter(([id]) => bySlug[courseOfId(id)]).length;
    document.querySelectorAll("[data-due-badge]").forEach((b) => { b.hidden = !n; b.textContent = n > 99 ? "99+" : String(n); });
  }

  // Yeni kartlar: seçili derslerden sırayla (ders ders karışık), ünite sırasına göre; hiç görülmemiş sorular.
  function freshCandidates(limit, bank) {
    const lists = studyCourses().map((slug) => [...bank.entries()]
      .filter(([id, x]) => x.slug === slug && !study.cards[id])
      .sort((a, b) => (a[1].unit || 99) - (b[1].unit || 99) || a[0].localeCompare(b[0])));
    const out = [];
    for (let i = 0; out.length < limit && lists.some((l) => i < l.length); i++) {
      for (const l of lists) if (i < l.length && out.length < limit) out.push(l[i][0]);
    }
    return out;
  }

  // -- ana sayfa şeridi --
  const FLAME = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2c1 3.5-1.6 5.3-2.8 7.4C8 11.5 8.3 14 10 15c-.3-1.7.6-3 2-4 .2 2.4 2.8 3.4 2.8 6 0 2.1-1.6 3.8-3.8 4C7.5 21.3 5 18.6 5 15.3 5 9.6 11 7.6 12 2zm3.3 6.2c2.6 1.9 3.7 4.6 3.7 7 0 3.2-2.3 6-5.5 6.7 1.6-1 2.6-2.7 2.6-4.6 0-3.2-2.4-4.3-2-7.3.4-.6.8-1.2 1.2-1.8z"/></svg>`;
  function todayStripHtml() {
    const st = streakInfo();
    const day = study.days[todayKey()] || { n: 0 };
    const due = dueCards().filter(([id]) => bySlug[courseOfId(id)]).length;
    const mist = openMistakes().length;
    const goalPct = Math.min(100, Math.round((day.n / study.goal) * 100));
    const plan = activePlan();
    return `<section class="today-strip" aria-label="Bugünkü çalışma">
      <a class="ts-item ts-streak${st.today ? " lit" : ""}" href="#/calisma">${FLAME}<span><b>${st.n}</b> gün seri</span></a>
      <a class="ts-item ts-goal" href="#/calisma"><span class="ring" style="--p:${goalPct}"><i>${goalPct}%</i></span><span><b>${day.n}/${study.goal}</b> bugünkü hedef</span></a>
      <a class="ts-item" href="#/tekrar"><span><b>${due}</b> tekrar bekliyor</span></a>
      <a class="ts-item" href="#/hatalar"><span><b>${mist}</b> açık hata</span></a>
      ${plan ? `<a class="ts-item ts-plan" href="#/plan" title="${esc(plan.exam.name)}"><span>${plan.days === 0 ? "<b>Sınav bugün</b>" : `${plan.scope === "vize" ? "Vizeye" : "Finale"} <b>${plan.days}</b> gün`}</span></a>` : ""}
      <a class="btn ts-cta" href="#/tekrar">${due ? "Tekrara başla" : "Yeni kart öğren"}</a>
    </section>`;
  }

  // -- #/calisma: çalışma masası (seri, hedef, haftalık özet, ısı haritası, ayarlar) --
  function weekStats(offsetWeeks) {
    const now = new Date();
    const monday = dayStart(addDays(now.getTime(), -((now.getDay() + 6) % 7) - 7 * offsetWeeks));
    const s = { n: 0, ok: 0, rev: 0, read: 0, active: 0 };
    for (let i = 0; i < 7; i++) {
      const k = dayKey(addDays(monday, i));
      const r = study.days[k];
      if (r) { s.n += r.n; s.ok += r.ok; s.rev += r.rev; s.read += r.read; }
      if (isActive(k)) s.active++;
    }
    return s;
  }
  function trend(a, b) {
    if (a === b) return `<span class="trend">aynı</span>`;
    return a > b ? `<span class="trend up">▲ ${a - b}</span>` : `<span class="trend down">▼ ${b - a}</span>`;
  }
  function heatmapHtml(weeks) {
    const today = Date.now();
    const start = addDays(dayStart(today), -((new Date(today).getDay() + 6) % 7) - 7 * (weeks - 1));
    let cells = "";
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const t = addDays(start, w * 7 + d);
        const k = dayKey(t);
        if (t > today) { cells += `<i class="hm-cell future"></i>`; continue; }
        const r = study.days[k];
        const n = r ? r.n + r.read * 3 + (r.vid || 0) * 3 + (r.lis || 0) * 3 : 0;
        const lvl = study.frozen.includes(k) && !n ? "frz" : n === 0 ? 0 : n < 10 ? 1 : n < 25 ? 2 : n < 50 ? 3 : 4;
        cells += `<i class="hm-cell l${lvl}" title="${fmtDay(k)}: ${r ? `${r.n} soru, ${r.read} bölüm${r.vid ? `, ${r.vid} video` : ""}${r.lis ? `, ${r.lis} dinleme` : ""}` : lvl === "frz" ? "seri donduruldu" : "çalışılmadı"}"></i>`;
      }
    }
    return `<div class="heatmap" style="--weeks:${weeks}" role="img" aria-label="Son ${weeks} haftanın çalışma takvimi">${cells}</div>
      <div class="hm-legend"><span>Az</span><i class="hm-cell l0"></i><i class="hm-cell l1"></i><i class="hm-cell l2"></i><i class="hm-cell l3"></i><i class="hm-cell l4"></i><span>Çok</span><i class="hm-cell lfrz"></i><span>Dondurma</span></div>`;
  }
  function forecastHtml() {
    const start = dayStart(Date.now());
    const counts = Array.from({ length: 7 }, (_, i) => {
      const from = i === 0 ? -Infinity : addDays(start, i), to = addDays(start, i + 1);
      return Object.values(study.cards).filter((c) => c.due >= from && c.due < to).length;
    });
    const max = Math.max(1, ...counts);
    const names = ["Bugün", "Yarın"].concat(Array.from({ length: 5 }, (_, i) => ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"][new Date(addDays(start, i + 2)).getDay()]));
    return `<div class="forecast">${counts.map((n, i) => `<div class="fc-col"><span class="fc-n">${n}</span><i style="height:${Math.round((n / max) * 100)}%"></i><span class="fc-d">${names[i]}</span></div>`).join("")}</div>`;
  }
  function deckLevels() {
    const out = { learning: 0, young: 0, mature: 0 };
    for (const c of Object.values(study.cards)) {
      if (c.ok === false || c.s < 3) out.learning++;
      else if (c.s < 21) out.young++;
      else out.mature++;
    }
    return out;
  }
  function viewStudyDesk() {
    const st = streakInfo();
    const day = study.days[todayKey()] || { n: 0, ok: 0, rev: 0, read: 0 };
    const due = dueCards().filter(([id]) => bySlug[courseOfId(id)]).length;
    const mist = openMistakes().length;
    const goalPct = Math.min(100, Math.round((day.n / study.goal) * 100));
    const w = weekStats(0), pw = weekStats(1);
    const acc = w.n ? pct(w.ok / w.n) : "-";
    const lv = deckLevels();
    const total = Object.keys(study.cards).length;
    const frz = freezeUsedThisMonth();
    const sel = new Set(studyCourses());
    return `<p class="eyebrow">Öğrenme döngüsü</p><h1>Çalışma masan</h1>
      <p class="lead muted">Her gün biraz: unutmak üzere olduğun sorular tekrar kuyruğuna gelir, yanlışların ayrı bir listede toplanır, serin ve hedefin burada izlenir.</p>
      ${planCardHtml() || `<a class="desk-card plan-card plan-empty" href="#/plan"><div><span class="desk-k">Sınav planı</span><p class="plan-today">Sınav tarihini seç, her gün ne çalışacağını planlayalım.</p></div><span class="btn ghost">Plan oluştur</span></a>`}
      <div class="desk-grid">
        <section class="desk-card desk-streak${st.today ? " lit" : ""}">
          <div class="desk-big">${FLAME}<b>${st.n}</b><span>gün seri</span></div>
          <p class="muted">${st.today ? "Bugün çalıştın, seri güvende." : st.n ? "Seriyi korumak için bugün en az bir soru çöz ya da bir bölüm oku." : "Bir soru çözerek ya da bir bölüm okuyarak seriyi başlat."}</p>
          <p class="desk-meta">En uzun seri: <b>${Math.max(bestStreak(), st.n)}</b> gün · Seri dondurma: ${frz ? `bu ay ${fmtDay(frz)} günü kullanıldı` : "bu ay 1 hakkın var (tek boş gün seriyi bozmaz)"}</p>
        </section>
        <section class="desk-card desk-goal">
          <div class="goal-ring" style="--p:${goalPct}"><div><b>${day.n}</b><span>/ ${study.goal} soru</span></div></div>
          <div>
            <h3>Bugünkü hedef</h3>
            <p class="muted">${day.n >= study.goal ? "Hedef tamam. Ekstra her soru bir sonraki tekrarı kolaylaştırır." : `Hedefe ${study.goal - day.n} soru kaldı.`}</p>
            <p class="desk-meta">${day.ok} doğru · ${day.rev} tekrar · ${day.read} bölüm okundu${day.vid ? ` · ${day.vid} video` : ""}${day.lis ? ` · ${day.lis} bölüm dinlendi` : ""}</p>
          </div>
        </section>
        <a class="desk-card desk-action" href="#/tekrar">
          <span class="desk-k">Aralıklı tekrar</span>
          <b class="desk-n">${due}</b>
          <span>${due ? "kart bugün tekrar bekliyor" : "kart bekliyor, bugünlük tamam"}${freshLeftToday() ? ` · ${freshLeftToday()} yeni kart hakkı` : ""}</span>
          <span class="btn">${due ? "Tekrara başla" : "Yeni kart öğren"}</span>
        </a>
        <a class="desk-card desk-action" href="#/hatalar">
          <span class="desk-k">Hatalarım</span>
          <b class="desk-n">${mist}</b>
          <span>${mist ? "soruyu henüz düzeltmedin" : "açık hata yok"}</span>
          <span class="btn ghost">${mist ? "Yanlışlarımı çöz" : "Listeye bak"}</span>
        </a>
      </div>
      <div class="btn-row desk-links"><a class="btn ghost" href="#/karisik">Karışık test</a><a class="btn ghost" href="#/karisik?mod=deneme">Deneme sınavı</a><a class="btn ghost" href="#/analiz">Gelişim analizi</a></div>
      ${resumeVideoHtml()}
      <h2>Bu hafta</h2>
      <div class="week-grid">
        <div class="stat"><b>${w.n}</b><span>soru</span> ${trend(w.n, pw.n)}</div>
        <div class="stat"><b>${acc}</b><span>doğruluk</span></div>
        <div class="stat"><b>${w.rev}</b><span>tekrar</span> ${trend(w.rev, pw.rev)}</div>
        <div class="stat"><b>${w.read}</b><span>bölüm</span> ${trend(w.read, pw.read)}</div>
        <div class="stat"><b>${w.active}/7</b><span>aktif gün</span></div>
      </div>
      <p class="muted small">Geçen hafta: ${pw.n} soru, ${pw.rev} tekrar, ${pw.read} bölüm, ${pw.active} aktif gün.</p>
      <div class="desk-two">
        <section class="desk-card">
          <h3>Son 16 hafta</h3>
          ${heatmapHtml(16)}
        </section>
        <section class="desk-card">
          <h3>Önümüzdeki 7 gün</h3>
          ${total ? forecastHtml() : `<p class="muted">Kart desteğin boş. Bir sınav çöz ya da tekrar sayfasından yeni kart öğren.</p>`}
          <p class="desk-meta">Destede <b>${total}</b> kart: ${lv.learning} öğreniliyor · ${lv.young} pekişiyor · ${lv.mature} oturmuş (3 haftadan uzun aralık)</p>
        </section>
      </div>
      <h2>Ayarlar</h2>
      <form class="desk-card desk-settings" id="study-settings">
        <label>Günlük hedef
          <select name="goal">${GOAL_OPTIONS.map((n) => `<option value="${n}"${n === study.goal ? " selected" : ""}>${n} soru</option>`).join("")}</select>
        </label>
        <label>Günde yeni kart
          <select name="newPerDay">${NEW_OPTIONS.map((n) => `<option value="${n}"${n === study.newPerDay ? " selected" : ""}>${n ? n + " kart" : "Kapalı"}</option>`).join("")}</select>
        </label>
        <fieldset><legend>Tekrara katılan dersler</legend>
          ${COURSES.map((c) => `<label class="chk"><input type="checkbox" name="course" value="${esc(c.slug)}"${sel.has(c.slug) ? " checked" : ""}> ${esc(c.subject)}</label>`).join("")}
        </fieldset>
        <p class="muted small">Ayarlar ve tekrar geçmişi bu tarayıcıda saklanır; <a href="#/cevrimdisi?b=yedek">yedek koduna</a> dahildir.</p>
      </form>`;
  }
  function bindStudyDesk() {
    const f = document.getElementById("study-settings");
    if (!f) return;
    f.addEventListener("change", () => {
      study.goal = +f.goal.value || 20;
      study.newPerDay = +f.newPerDay.value;
      const picked = [...f.querySelectorAll("[name=course]:checked")].map((x) => x.value);
      study.courses = picked.length === COURSES.length ? null : picked;
      saveStudy();
      showToast("Ayarlar kaydedildi.");
    });
  }

  // -- #/tekrar ve #/hatalar oturumları (aynı motor) --
  // ---- #/plan: sınav geri sayımı ve günlük plan ------------------------------------
  // Sınav tarihleri university.json "exams" listesinden gelir; öğrenci kendi tarihini de girebilir.
  // Plan kalan güne göre her gün yeniden hesaplanır: kapsamdaki okunmamış bölümler son haftadan önce
  // bitecek şekilde günlere bölünür, hiç çözülmemiş sorular sınav gününe kadar dağıtılır, son hafta
  // deneme sınavı önerilir. Vize kapsamı varsayılan olarak ünitelerin ilk yarısı, final tümüdür.
  //   study.plan = { exam: id | "ozel" | "kapali", date, name, scope: "vize"|"final", units: { slug: [n] }, courses: [slug] | null }
  const EXAMS = (Array.isArray(U.exams) ? U.exams : []).filter((e) => e && /^\d{4}-\d{2}-\d{2}$/.test(e.date));
  const parseDay = (s) => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d).getTime(); };
  const daysUntil = (s) => Math.round((parseDay(s) - dayStart(Date.now())) / DAY_MS);
  const fmtDate = (s) => { const t = parseDay(s); return `${fmtDay(dayKey(t))} ${new Date(t).getFullYear()}`; };
  const unitCount = (c) => c.chapters.length;
  const defaultUnits = (c, scope) => Array.from({ length: scope === "vize" ? Math.ceil(unitCount(c) / 2) : unitCount(c) }, (_, i) => i + 1);
  const nextPreset = () => EXAMS.find((e) => daysUntil(e.end || e.date) >= 0) || null;

  // Geçerli plan: kayıtlı seçim, yoksa takvimdeki ilk yaklaşan sınav. Geçmiş sınav seçiliyse bir sonrakine geçer.
  function activePlan() {
    const p = study.plan || {};
    if (p.exam === "kapali") return null;
    let exam = p.exam === "ozel" ? (p.date ? { id: "ozel", name: p.name || "Sınavım", date: p.date, scope: p.scope || "vize" } : null) : EXAMS.find((e) => e.id === p.exam);
    if (exam && exam.id !== "ozel" && daysUntil(exam.end || exam.date) < 0) exam = null;
    if (!exam) exam = nextPreset();
    if (!exam) return null;
    const scope = exam.id === "ozel" || exam.id === p.exam ? p.scope || exam.scope || "vize" : exam.scope || "vize";
    const courses = (Array.isArray(p.courses) && p.courses.length ? p.courses : studyCourses()).filter((s) => bySlug[s]);
    const units = {};
    for (const slug of courses) {
      const c = bySlug[slug];
      const saved = exam.id === p.exam && p.units && Array.isArray(p.units[slug]) ? p.units[slug].filter((n) => n >= 1 && n <= unitCount(c)) : null;
      units[slug] = saved && saved.length ? saved : defaultUnits(c, scope);
    }
    return { exam, scope, courses, units, days: daysUntil(exam.date), saved: !!p.exam };
  }

  // Bir soru plan kapsamında mı? Ünitesi bilinmeyen çıkmış vize soruları her zaman, final soruları finalde sayılır.
  function inPlanScope(plan, x, id) {
    if (!plan.units[x.slug]) return false;
    const u = x.unit || 0;
    if (u) return plan.units[x.slug].includes(u);
    return sourceOf(id) === "p" || plan.scope === "final";
  }

  // Okuma planı: kapsamdaki okunmamış bölümler, derslere sırayla dağıtılarak. Soru bankası gerektirmez.
  function planReading(plan) {
    const today = study.days[todayKey()] || { n: 0, read: 0 };
    const lists = plan.courses.map((slug) => {
      const read = readSet(slug);
      return plan.units[slug].filter((n) => !read.has(n)).map((n) => ({ slug, n }));
    });
    const unread = [];
    for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) unread.push(l[i]);
    const days = Math.max(0, plan.days);
    // Son hafta (uzun planlarda) ya da son iki gün tekrara ayrılır; okuma ondan önce biter.
    const buffer = days > 14 ? 7 : days > 4 ? 2 : 0;
    const readDays = Math.max(1, days - buffer);
    const readToday = Math.min(today.read || 0, unread.length + (today.read || 0));
    const perDay = Math.ceil((unread.length + readToday) / readDays);
    const toRead = days > buffer || !buffer ? unread.slice(0, Math.max(0, perDay - readToday)) : unread.slice(0, 2);
    const mockToday = (study.mocks || []).some((m) => dayKey(m.t) === todayKey());
    return { unread, toRead, perDay, readToday, buffer, days, mockToday, done: today.n || 0, rev: today.rev || 0 };
  }

  function planNumbers(plan) {
    const bank = questionBank();
    const now = Date.now();
    const r = planReading(plan);
    const days = r.days;
    const perCourse = {};
    let unseen = 0, due = 0, seen = 0, total = 0, ok = 0, answered = 0, firstToday = 0;
    for (const [id, x] of bank) {
      if (!inPlanScope(plan, x, id)) continue;
      const pc = perCourse[x.slug] || (perCourse[x.slug] = { total: 0, seen: 0, ok: 0, answered: 0 });
      const card = study.cards[id];
      total++; pc.total++;
      if (!card) { unseen++; continue; }
      seen++; pc.seen++;
      const a = (card.right || 0) + (card.wrong || 0);
      ok += card.right || 0; answered += a; pc.ok += card.right || 0; pc.answered += a;
      if (card.due <= now) due++;
      if (card.reps === 1 && dayKey(card.last) === todayKey()) firstToday++;
    }
    // Hedef gün başındaki duruma göre sabit kalsın: bugün ilk kez çözülenler ve bugünkü tekrarlar geri eklenir.
    const fresh = Math.ceil((unseen + firstToday) / Math.max(1, days));
    const target = Math.min(150, Math.max(study.goal, due + r.rev + fresh));
    const weak = unitStats()
      .filter((u) => plan.units[u.slug] && plan.units[u.slug].includes(u.unit) && u.cards.length >= 3 && u.acc < 0.7)
      .sort((a, b) => a.acc - b.acc)[0] || null;
    return Object.assign(r, { unseen, due, seen, total, ok, answered, fresh, target, weak, perCourse });
  }

  const planVerb = (plan) => (plan.days === 0 ? "bugün" : plan.days === 1 ? "yarın" : `${plan.days} gün kaldı`);
  const examShort = (e) => e.name.replace(/\s*\(.*\)$/, "");

  // Ana sayfa şeridi ve çalışma masası için kısa geri sayım kartı.
  function planCardHtml() {
    const plan = activePlan();
    if (!plan) return "";
    const k = planReading(plan);
    const due = dueCards().filter(([id]) => plan.units[courseOfId(id)]).length;
    const tasks = [];
    if (k.toRead.length) tasks.push(`${k.toRead.length} bölüm oku`);
    else if (k.unread.length && k.readToday) tasks.push("bugünkü okuma tamam");
    if (due) tasks.push(`${due} tekrar`);
    if (plan.days <= 7) tasks.push(k.mockToday ? "deneme tamam" : "1 deneme sınavı");
    if (!tasks.length) tasks.push(k.done >= study.goal ? "hedef tamam" : `${study.goal - k.done} soru çöz`);
    return `<a class="desk-card plan-card" href="#/plan">
      <div class="plan-count"><b>${plan.days}</b><span>${plan.days === 0 ? "sınav bugün" : "gün kaldı"}</span></div>
      <div>
        <span class="desk-k">${esc(plan.exam.name)} · ${fmtDate(plan.exam.date)}</span>
        <p class="plan-today"><b>Bugünün işi:</b> ${esc(tasks.join(", "))}</p>
        <p class="desk-meta">${plan.scope === "vize" ? "Vize" : "Final"} kapsamında ${k.unread.length ? `${k.unread.length} okunmamış bölüm` : "okunmamış bölüm kalmadı"}</p>
      </div>
      <span class="btn">Planı aç</span>
    </a>`;
  }

  function planTaskHtml(done, title, body, cta) {
    return `<li class="plan-task${done ? " done" : ""}"><span class="plan-check" aria-hidden="true">${done ? "✓" : ""}</span><div><b>${title}</b>${body ? `<p class="muted">${body}</p>` : ""}</div>${cta || ""}</li>`;
  }

  function viewPlan() {
    const plan = activePlan();
    const p = study.plan || {};
    const sel = p.exam === "kapali" ? "kapali" : plan ? plan.exam.id : "ozel";
    const upcoming = EXAMS.filter((e) => daysUntil(e.end || e.date) >= 0);
    const form = `<h2>Sınavın</h2>
      <form class="desk-card mix-form plan-form" id="plan-form">
        <label>Sınav
          <select name="exam">
            ${upcoming.map((e) => `<option value="${esc(e.id)}"${sel === e.id ? " selected" : ""}>${esc(e.name)} · ${fmtDate(e.date)}</option>`).join("")}
            <option value="ozel"${sel === "ozel" ? " selected" : ""}>Kendi tarihimi gireceğim</option>
            <option value="kapali"${sel === "kapali" ? " selected" : ""}>Plan kapalı</option>
          </select>
        </label>
        <div class="plan-own" ${sel === "ozel" ? "" : "hidden"}>
          <label>Sınav adı <input name="ename" type="text" maxlength="60" value="${esc(p.name || "")}" placeholder="Örneğin bütünleme"></label>
          <label>Tarih <input name="date" type="date" value="${esc(p.exam === "ozel" ? p.date || "" : "")}" min="${todayKey()}"></label>
        </div>
        ${plan ? `<fieldset class="seg"><legend>Kapsam</legend>
          <label class="seg-opt"><input type="radio" name="scope" value="vize"${plan.scope === "vize" ? " checked" : ""}><span><b>Vize</b><small>Varsayılan: ünitelerin ilk yarısı</small></span></label>
          <label class="seg-opt"><input type="radio" name="scope" value="final"${plan.scope === "final" ? " checked" : ""}><span><b>Final</b><small>Tüm üniteler</small></span></label>
        </fieldset>
        <fieldset><legend>Dersler</legend><div class="chk-row">
          ${COURSES.map((c) => `<label class="chk-chip"><input type="checkbox" name="course" value="${esc(c.slug)}"${plan.courses.includes(c.slug) ? " checked" : ""}><span>${esc(c.subject)}</span></label>`).join("")}
        </div></fieldset>
        <details class="plan-units"><summary>Kapsamdaki üniteleri düzenle</summary>
          ${plan.courses.map((slug) => {
            const c = bySlug[slug];
            return `<fieldset><legend>${esc(c.subject)}</legend><div class="chk-row">${c.chapters.map((ch, i) => `<label class="chk-chip" title="${esc(ch.title)}"><input type="checkbox" name="u:${esc(slug)}" value="${i + 1}"${plan.units[slug].includes(i + 1) ? " checked" : ""}><span>Ünite ${i + 1}</span></label>`).join("")}</div></fieldset>`;
          }).join("")}
          <p class="muted small">AÖF her dönem sınav kapsamını duyurur; farklıysa buradan düzelt. Ünite numaraları ders kitabıyla aynıdır.</p>
        </details>` : ""}
      </form>`;
    const head = `<p class="crumbs"><a href="#/calisma">Çalışma masası</a> / Sınav planı</p>
      <p class="eyebrow">Sınav planı</p>`;
    if (!plan) {
      return `${head}<h1>Sınavına kaç gün kaldı?</h1>
        <p class="lead muted">Sınav tarihini seç; kalan güne göre her gün ne okuyacağını ve kaç soru çözeceğini planlayalım.</p>${form}`;
    }
    const k = planNumbers(plan);
    const e = plan.exam;
    const readList = k.toRead.map(({ slug, n }) => `<li><a href="#/course/${slug}/chapter/${n}">${esc(bySlug[slug].subject)} · ${n}. bölüm: ${esc(bySlug[slug].chapters[n - 1].title)}</a></li>`).join("");
    const qLeft = Math.max(0, k.target - k.done);
    const tasks = [];
    tasks.push(k.unread.length
      ? planTaskHtml(!k.toRead.length, k.toRead.length ? `${k.toRead.length} bölüm oku` : "Bugünün okuması tamam",
        k.toRead.length ? `Okuduğun bölümü sayfanın sonundaki "Okudum" düğmesiyle işaretle. Notları dinleyerek de çalışabilirsin.<ol class="plan-read">${readList}</ol>` : `Kapsamda ${k.unread.length} okunmamış bölüm kaldı; yarın plana gelecek.`)
      : planTaskHtml(true, "Kapsamdaki tüm bölümleri okudun", "Kalan günleri soru çözmeye ve tekrara ayır."));
    tasks.push(planTaskHtml(qLeft === 0, `${k.target} soru çöz`,
      `Bugün ${k.done} soru çözdün.${k.due ? ` ${k.due} tekrar kartı bekliyor; önce onları bitir.` : ""}${k.fresh ? ` Kapsamda ${k.unseen} hiç çözülmemiş soru var; ${k.fresh > k.target ? "hepsine yetişmek zor; önce yanlışlarını ve tekrarlarını bitir." : `sınava kadar günde yaklaşık ${k.fresh} yeni soru yeter.`}` : ""}`,
      `<a class="btn${qLeft ? "" : " ghost"}" href="${k.due ? "#/tekrar" : "#/karisik?kapsam=1&havuz=yeni"}">${k.due ? "Tekrara başla" : "Soru çöz"}</a>`));
    if (k.weak) {
      const wc = bySlug[k.weak.slug];
      tasks.push(planTaskHtml(false, `Zayıf ünite: ${esc(wc.subject)} · Ünite ${k.weak.unit}`,
        `Bu ünitede doğruluğun ${pct(k.weak.acc)}. 10 soruluk kısa bir alıştırma iyi gelir.`,
        `<a class="btn ghost" href="#/karisik?ders=${encodeURIComponent(k.weak.slug)}&unite=${k.weak.unit}&n=10">Alıştırma</a>`));
    }
    if (plan.days <= 7) {
      tasks.push(planTaskHtml(k.mockToday, k.mockToday ? "Bugünün denemesi tamam" : "Deneme sınavı çöz",
        "Son hafta her gün bir deneme: AÖF formatında, süreli, 4 yanlış 1 doğruyu götürür. Yanlışların Hatalarım'a düşer.",
        k.mockToday ? `<a class="btn ghost" href="#/hatalar">Hatalarım</a>` : `<a class="btn" href="#/karisik?mod=deneme&kapsam=1">Denemeyi başlat</a>`));
    }
    const rows = plan.courses.map((slug) => {
      const c = bySlug[slug], pc = k.perCourse[slug] || { total: 0, seen: 0, ok: 0, answered: 0 };
      const read = readSet(slug), units = plan.units[slug];
      const r = units.filter((n) => read.has(n)).length;
      return `<tr><th scope="row">${esc(c.subject)}<small>Ünite ${units.length === unitCount(c) ? "tümü" : units.join(", ")}</small></th>
        <td>${r}/${units.length}</td><td>${pc.seen}/${pc.total}</td><td>${pc.answered ? pct(pc.ok / pc.answered) : "-"}</td></tr>`;
    }).join("");
    const phase = plan.days === 0 ? "Sınav günü: yeni konu açma, Hatalarım'a göz at ve dinlen."
      : plan.days <= k.buffer ? "Tekrar dönemindesin: okuma bitti sayılır, soru çöz, deneme yap, yanlışlarını kapat."
      : k.unread.length ? `Okuma dönemindesin: kapsamdaki ${k.unread.length} bölümü günde ${k.perDay} bölümle ${k.buffer ? `sınavdan ${k.buffer} gün önce` : "sınava kadar"} bitirirsin.`
      : "Okuma bitti; şimdi soru ve tekrarla pekiştir.";
    return `${head}<h1>${esc(examShort(e))}: ${planVerb(plan)}</h1>
      <p class="lead muted">${fmtDate(e.date)}${e.end ? ` – ${fmtDate(e.end)}` : ""} · ${plan.scope === "vize" ? "Vize kapsamı" : "Final kapsamı"}. ${phase}</p>
      <div class="plan-hero">
        <div class="plan-count big"><b>${plan.days}</b><span>${plan.days === 0 ? "sınav bugün" : "gün kaldı"}</span></div>
        <div class="btn-row"><button class="btn ghost" type="button" id="plan-ics">Takvimime ekle</button><a class="btn ghost" href="#/karisik?mod=deneme&kapsam=1">Kapsamdan deneme</a></div>
      </div>
      <h2>Bugünün işi</h2>
      <ul class="plan-tasks">${tasks.join("")}</ul>
      <h2>Kapsamdaki durumun</h2>
      <div class="table-wrap"><table class="plan-table"><thead><tr><th scope="col">Ders</th><th scope="col">Okunan bölüm</th><th scope="col">Görülen soru</th><th scope="col">Doğruluk</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${form}
      <p class="muted small">Plan her gün kalan güne göre yeniden hesaplanır. Ayarlar bu tarayıcıda saklanır ve <a href="#/cevrimdisi?b=yedek">yedek koduna</a> dahildir.</p>`;
  }

  // Takvim dosyası (.ics): sınav günü tüm gün etkinlik, bir hafta ve bir gün önce hatırlatma.
  function planIcs(plan) {
    const e = plan.exam;
    const d = (s) => s.replace(/-/g, "");
    const endDay = dayKey(addDays(parseDay(e.end || e.date), 1));
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const fold = (s) => s.replace(/[\\;,]/g, (m) => "\\" + m);
    const alarm = (tr, msg) => ["BEGIN:VALARM", "ACTION:DISPLAY", `TRIGGER:${tr}`, `DESCRIPTION:${fold(msg)}`, "END:VALARM"];
    const courses = plan.courses.map((s) => bySlug[s].subject).join(", ");
    return ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//${fold(CONFIG.name)}//Sinav plani//TR`, "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT", `UID:${e.id}-${e.date}@${CONFIG.storageKey}`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d(e.date)}`, `DTEND;VALUE=DATE:${d(endDay)}`,
      `SUMMARY:${fold("AÖF " + e.name)}`, `DESCRIPTION:${fold(courses + ". Plan: " + location.origin + location.pathname + "#/plan")}`,
      ...alarm("-P7D", "Sınava bir hafta kaldı: deneme sınavı zamanı"), ...alarm("-PT12H", "Sınav yarın"),
      "END:VEVENT", "END:VCALENDAR"].join("\r\n") + "\r\n";
  }

  function bindPlan() {
    const ics = document.getElementById("plan-ics");
    if (ics) ics.addEventListener("click", () => {
      const plan = activePlan();
      if (!plan) return;
      const url = URL.createObjectURL(new Blob([planIcs(plan)], { type: "text/calendar;charset=utf-8" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: `sinav-${plan.exam.date}.ics` });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      showToast("Takvim dosyası indirildi. Açınca sınav günü telefon takvimine eklenir.");
    });
    const f = document.getElementById("plan-form");
    if (!f) return;
    f.addEventListener("change", (ev) => {
      const prev = study.plan || {};
      const exam = f.exam.value;
      const next = { exam };
      if (exam === "ozel") {
        f.querySelector(".plan-own").hidden = false;
        next.name = f.elements.ename.value.trim();
        next.date = f.elements.date.value;
        if (!next.date) { study.plan = Object.assign({}, prev, next); saveStudy(); return; }
      }
      const examChanged = exam !== prev.exam;
      const scopeEl = f.querySelector("[name=scope]:checked");
      const preset = EXAMS.find((e) => e.id === exam);
      next.scope = examChanged && preset ? preset.scope : scopeEl ? scopeEl.value : (prev.scope || "vize");
      const picked = [...f.querySelectorAll("[name=course]:checked")].map((x) => x.value);
      if (picked.length) next.courses = picked.length === COURSES.length ? null : picked;
      // Kapsam ya da sınav değişince üniteler varsayılana döner; aksi hâlde işaretlenenler saklanır.
      if (!examChanged && ev.target.name !== "scope" && ev.target.name !== "exam") {
        next.units = {};
        for (const c of COURSES) {
          const boxes = f.querySelectorAll(`[name="u:${c.slug}"]`);
          if (boxes.length) next.units[c.slug] = [...boxes].filter((x) => x.checked).map((x) => +x.value);
        }
        for (const [slug, u] of Object.entries(prev.units || {})) if (!(slug in next.units)) next.units[slug] = u;
      }
      study.plan = next;
      saveStudy();
      const open = !!(f.querySelector(".plan-units") || {}).open;
      const y = window.scrollY;
      route().then(() => {
        const d = document.querySelector(".plan-units");
        if (d && open) d.open = true;
        window.scrollTo(0, y);
      });
    });
  }

  function courseFilterHtml(mode, active, counts) {
    const href = (slug) => `#/${mode}${slug ? "?ders=" + slug : ""}`;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return `<div class="chip-row filter-row" role="tablist">
      <a class="chip${!active ? " active" : ""}" href="${href("")}">Tümü · ${total}</a>
      ${COURSES.filter((c) => counts[c.slug]).map((c) => `<a class="chip${active === c.slug ? " active" : ""}" href="${href(c.slug)}">${esc(c.subject)} · ${counts[c.slug]}</a>`).join("")}
    </div>`;
  }
  function countBy(entries) {
    const out = {};
    for (const [id] of entries) { const s = courseOfId(id); if (bySlug[s]) out[s] = (out[s] || 0) + 1; }
    return out;
  }

  function viewReview(query) {
    const slug = bySlug[query.ders] ? query.ders : "";
    const due = dueCards().filter(([id]) => bySlug[courseOfId(id)]);
    const mine = due.filter(([id]) => !slug || courseOfId(id) === slug);
    const fresh = freshLeftToday();
    return `<p class="crumbs"><a href="#/calisma">Çalışma masan</a> / Aralıklı tekrar</p>
      <div class="quiz-head">
        <div><p class="eyebrow">Aralıklı tekrar</p><h1 style="margin:0">Bugünün tekrarları</h1></div>
        <div class="muted" style="font-size:.9rem">${mine.length} bekleyen kart · ${fresh} yeni kart hakkı</div>
      </div>
      <p class="muted">Soruyu çöz, sonra ne kadar kolay geldiğini işaretle. Zorlandığın kart yakında, kolay bildiğin kart haftalar sonra yeniden gelir. Kısayol: 1-4 tuşları.</p>
      ${due.length ? courseFilterHtml("tekrar", slug, countBy(due)) : ""}
      <div id="session" data-mode="tekrar" data-course="${esc(slug)}"></div>`;
  }

  function viewMistakes(query) {
    const slug = bySlug[query.ders] ? query.ders : "";
    const all = openMistakes().filter(([id]) => bySlug[courseOfId(id)]);
    const list = all.filter(([id]) => !slug || courseOfId(id) === slug).sort((a, b) => (b[1].wrong - a[1].wrong) || (b[1].last - a[1].last));
    const fixedWeek = Object.values(study.cards).filter((c) => c.ok && c.fixedAt && c.fixedAt > addDays(Date.now(), -7)).length;
    const bank = questionBank();
    const units = {};
    for (const [id] of list) { const x = bank.get(id); const u = x && x.unit ? x.unit : 0; units[u] = (units[u] || 0) + 1; }
    const weakest = !slug ? [] : Object.entries(units).filter(([u]) => +u).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const rows = list.map(([id, card]) => {
      const x = bank.get(id);
      if (!x) return "";
      const c = bySlug[x.slug];
      const stem = String(x.q.question || x.q.stem || "").replace(/\s+/g, " ");
      return `<li class="mistake" data-id="${esc(id)}">
        <div class="mistake-body">
          <p class="mistake-meta">${esc(c.subject)} · ${esc(x.label)}${x.unit ? ` · Ünite ${x.unit}` : ""}</p>
          <p class="mistake-q">${txt(stem.length > 180 ? stem.slice(0, 177) + "…" : stem)}</p>
          <p class="mistake-meta">${card.wrong} kez yanlış${card.right ? `, ${card.right} kez doğru` : ""} · son: ${fmtDay(dayKey(card.last))}</p>
        </div>
        <div class="mistake-actions">
          <button class="btn sm-mini" type="button" data-ask="${esc(id)}">Soruyu sor</button>
          <a class="btn ghost sm-mini" href="${esc(x.href)}">Çözüme bak</a>
          <button class="btn ghost sm-mini" type="button" data-drop="${esc(id)}">Listeden çıkar</button>
        </div>
      </li>`;
    }).join("");
    return `<p class="crumbs"><a href="#/calisma">Çalışma masan</a> / Hatalarım</p>
      <div class="quiz-head">
        <div><p class="eyebrow">Hatalarım</p><h1 style="margin:0">Yanlış çözdüğün sorular</h1></div>
        <div class="muted" style="font-size:.9rem">${all.length} açık hata · son 7 günde ${fixedWeek} düzeltildi</div>
      </div>
      <p class="muted">Bir soruyu yanlış cevapladığında buraya düşer, doğru cevapladığında listeden çıkar. Pasif okumak yerine yanlışlarını yeniden çözmek en hızlı kazanımdır.</p>
      ${all.length ? courseFilterHtml("hatalar", slug, countBy(all)) : ""}
      ${weakest.length ? `<p class="weak-units">En çok hata: ${weakest.map(([u, n]) => `<span class="chip">Ünite ${u} · ${n}</span>`).join(" ")}${slug ? ` <a href="#/course/${slug}/chapter/${weakest[0][0]}">Ünite ${weakest[0][0]} konu anlatımına git</a>` : ""}</p>` : ""}
      <div id="session" data-mode="hatalar" data-course="${esc(slug)}" hidden></div>
      ${list.length
        ? `<div class="btn-row" id="mistake-start"><button class="btn" type="button" data-start>Yanlışlarımı çöz (${list.length})</button></div><ol class="mistake-list">${rows}</ol>`
        : `<div class="desk-card empty-state"><h3>${all.length ? "Bu derste açık hata yok" : "Henüz hata yok"}</h3><p class="muted">Sınav, ünite quiz'i ya da çıkmış vize çözdükçe yanlışların burada toplanır.</p><div class="btn-row"><a class="btn" href="#/sinavlar">Sınavlara git</a></div></div>`}`;
  }

  function bindMistakes() {
    document.querySelectorAll("[data-drop]").forEach((b) => {
      b.onclick = () => {
        const card = study.cards[b.dataset.drop];
        if (card) { card.ok = null; saveStudy(); }
        b.closest(".mistake").remove();
        paintStudyBadges();
      };
    });
    // Tüm listeyi ya da (Soruyu sor ile) tek bir soruyu oturum olarak aç.
    const open = (only) => {
      document.getElementById("mistake-start").remove();
      document.querySelector(".mistake-list").remove();
      const s = document.getElementById("session");
      if (only) s.dataset.only = only;
      s.hidden = false;
      runSession(s);
      s.scrollIntoView({ block: "start" });
    };
    const start = document.querySelector("[data-start]");
    if (start) start.onclick = () => open("");
    document.querySelectorAll("[data-ask]").forEach((b) => (b.onclick = () => open(b.dataset.ask)));
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // Oturum: tekrar kipinde kuyruk = vadesi gelen kartlar + günlük yeni kart hakkı; "Tekrar" denen
  // kart birkaç soru sonra yeniden gelir. Hatalar kipinde kuyruk = açık hatalar (karışık sırada).
  function runSession(root) {
    const mode = root.dataset.mode;
    const slug = root.dataset.course;
    const bank = questionBank();
    const inScope = (id) => bank.has(id) && (!slug || courseOfId(id) === slug);
    let queue, freshIds = new Set();
    if (mode === "tekrar") {
      const due = dueCards(Date.now() + 20 * 60000).filter(([id]) => inScope(id)).sort((a, b) => a[1].due - b[1].due).map(([id]) => id);
      const fresh = freshCandidates(freshLeftToday(), slug ? new Map([...bank].filter(([, x]) => x.slug === slug)) : bank);
      fresh.forEach((id) => freshIds.add(id));
      queue = due.concat(fresh);
    } else if (root.dataset.only) {
      queue = inScope(root.dataset.only) ? [root.dataset.only] : [];
    } else {
      queue = shuffle(openMistakes().filter(([id]) => inScope(id)).map(([id]) => id));
    }
    const total0 = queue.length;
    const tally = { done: 0, ok: 0, again: 0 };
    const t0 = Date.now();

    if (!queue.length) {
      root.innerHTML = mode === "tekrar"
        ? `<div class="desk-card empty-state"><h3>Bugünlük bu kadar</h3><p class="muted">${Object.keys(study.cards).length ? "Bekleyen kart yok. Yeni kart hakkını da kullandın ya da kapattın." : "Desten henüz boş. Ayarlardan günlük yeni kart sayısını aç ya da bir sınav çöz; çözdüğün her soru desteye girer."}</p>
            <div class="btn-row"><a class="btn" href="#/calisma">Çalışma masası</a><a class="btn ghost" href="#/sinavlar">Sınavlar</a></div></div>`
        : "";
      return;
    }

    function hudHtml() {
      const left = queue.length;
      return `<div class="hud session-hud">
        <div class="hud-item"><span class="hud-k">Kalan</span><span class="hud-v">${left}</span></div>
        <div class="hud-item"><span class="hud-k">Çözülen</span><span class="hud-v">${tally.done}</span></div>
        <div class="hud-item"><span class="hud-k">Doğru</span><span class="hud-v">${tally.ok}</span></div>
        <div class="hud-item"><span class="hud-k">Bugün</span><span class="hud-v">${(study.days[todayKey()] || { n: 0 }).n}/${study.goal}</span></div>
        <div class="hud-bar" aria-hidden="true"><i style="width:${total0 ? Math.min(100, (tally.done / (tally.done + left)) * 100) : 0}%"></i></div>
      </div>`;
    }

    let keyHandler = null;
    function setKeys(fn) {
      if (keyHandler) document.removeEventListener("keydown", keyHandler);
      keyHandler = fn;
      if (fn) document.addEventListener("keydown", fn);
    }

    function next() {
      if (!document.body.contains(root)) return setKeys(null);
      const id = queue.shift();
      if (!id) return finish();
      const x = bank.get(id);
      if (!x) return next();
      const c = bySlug[x.slug];
      const card = study.cards[id];
      const isFresh = !card;
      const q = x.q;
      root.innerHTML = `${hudHtml()}
        <div class="q game-q review-q" data-q="0">
          <p class="review-src"><span class="chip">${esc(c.subject)}</span> <span>${esc(x.label)}</span>${isFresh ? ` <span class="badge none">Yeni kart</span>` : card.ok === false ? ` <span class="badge fail">Hata</span>` : ""}</p>
          ${questionHTML(q, 0)}
          <div class="btn-row game-actions" id="rv-actions">
            <button class="btn" type="button" id="rv-check">Kontrol et</button>
            <button class="btn ghost" type="button" id="rv-skip">Bilmiyorum, cevabı göster</button>
          </div>
        </div>`;
      typeset(root);
      const box = root.querySelector(".review-q");
      const actions = root.querySelector("#rv-actions");
      const reveal = (forced) => {
        let ok = forced ? false : grade(q, 0, root);
        if (ok === null) ok = false;
        showFeedback(q, 0, ok, box);
        box.classList.add(ok ? "hit" : "miss");
        tally.done++;
        if (ok) tally.ok++;
        if (mode === "hatalar") {
          recordAnswer(id, ok, ok ? 3 : 1, "exam");
          if (!ok) tally.again++;
          // Tek soru (Soruyu sor): sonuç ekranı yerine doğrudan hata listesine dön.
          const go = root.dataset.only ? () => { setKeys(null); route(); } : next;
          actions.innerHTML = `<button class="btn" type="button" id="rv-next">${root.dataset.only ? "Hata listesine dön" : queue.length ? "Sonraki soru" : "Bitir"}</button>`;
          const b = root.querySelector("#rv-next");
          b.onclick = go;
          b.focus();
          setKeys((e) => { if (e.key === "Enter" && e.target.tagName !== "BUTTON") { e.preventDefault(); go(); } });
          return;
        }
        const base = card || {};
        const grades = ok
          ? [[2, "Zor"], [3, "İyi"], [4, "Kolay"]]
          : [[1, "Tekrar"]];
        actions.innerHTML = `<p class="rate-q">${ok ? "Ne kadar kolay hatırladın?" : "Bu kart birkaç soru sonra yeniden gelecek."}</p>
          <div class="rate-row">${grades.map(([g, label]) => `<button class="btn${g === 3 || g === 1 ? "" : " ghost"} rate" type="button" data-g="${g}"><span>${label}</span><small>${fmtInterval(base, g)}</small></button>`).join("")}</div>`;
        const rate = (g) => {
          recordAnswer(id, ok, g, isFresh ? "fresh" : "review");
          if (g === 1) { tally.again++; queue.splice(Math.min(queue.length, 3), 0, id); }
          next();
        };
        actions.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => rate(+b.dataset.g)));
        (actions.querySelector('[data-g="3"]') || actions.querySelector('[data-g="1"]')).focus();
        setKeys((e) => {
          const g = +e.key;
          if (grades.some(([x]) => x === g)) { e.preventDefault(); rate(g); }
        });
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
      root.querySelector("#rv-check").onclick = () => {
        const answered = root.querySelector(`[name=q0]:checked`) || (root.querySelector(`input[type=text][name=q0]`) || {}).value;
        if (!answered) { root.querySelector("#rv-check").textContent = "Önce bir seçenek işaretle"; return; }
        reveal(false);
      };
      root.querySelector("#rv-skip").onclick = () => reveal(true);
      setKeys((e) => {
        if (/^[1-6]$/.test(e.key) && e.target.tagName !== "INPUT") {
          const opt = root.querySelectorAll("[name=q0]")[+e.key - 1];
          if (opt && opt.type !== "text") { opt.checked = true; e.preventDefault(); }
        } else if (e.key === "Enter" && e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
          e.preventDefault();
          root.querySelector("#rv-check").click();
        }
      });
    }

    function finish() {
      setKeys(null);
      const mins = Math.max(1, Math.round((Date.now() - t0) / 60000));
      const tomorrow = Object.values(study.cards).filter((c) => c.due < addDays(dayStart(Date.now()), 2)).length;
      const left = openMistakes().filter(([id]) => inScope(id)).length;
      root.innerHTML = `<div class="result pass game-result">
        <p class="eyebrow">${mode === "tekrar" ? "Tekrar oturumu bitti" : "Hata turu bitti"}</p>
        <h2>${tally.done} soru · ${tally.ok} doğru · ${tally.done ? pct(tally.ok / tally.done) : "0%"}</h2>
        <ul class="game-stats">
          <li><b>${mins} dk</b> süre</li>
          <li><b>${streakInfo().n}</b> gün seri</li>
          <li><b>${(study.days[todayKey()] || { n: 0 }).n}/${study.goal}</b> günlük hedef</li>
          <li><b>${mode === "tekrar" ? tomorrow : left}</b> ${mode === "tekrar" ? "kart yarına kadar" : "hata kaldı"}</li>
        </ul>
        <div class="btn-row">
          <a class="btn ghost on-dark" href="#/calisma">Çalışma masası</a>
          ${mode === "tekrar" && openMistakes().length ? `<a class="btn ghost on-dark" href="#/hatalar">Hatalarım</a>` : ""}
          ${mode === "hatalar" && left ? `<button class="btn ghost on-dark" type="button" id="again">Kalanları yeniden çöz</button>` : ""}
        </div></div>`;
      const again = document.getElementById("again");
      if (again) again.onclick = () => route();
      paintStudyBadges();
    }
    next();
  }

  function bindReview() {
    const s = document.getElementById("session");
    if (s) runSession(s);
  }

  applyFreeze();

  // ---- karışık test ve AÖF formatı deneme sınavı (#/karisik) ------------------------
  // Havuz: soru bankası (final, ünite quiz'i, çıkmış vize) ders, kaynak, ünite ve geçmişe göre süzülür.
  // Alıştırma: her sorudan sonra açıklama. Deneme: süre, soru gezgini, sonda puan (4 yanlış 1 doğruyu götürür).
  const MIX_SOURCES = [["p", "Çıkmış vize"], ["f", "Final"], ["u", "Ünite quiz'i"]];
  const MIX_POOLS = [
    ["hepsi", "Tüm sorular"],
    ["yeni", "Hiç çözmediklerim"],
    ["hata", "Yanlışlarım"],
    ["zayif", "Zorlandıklarım"],
    ["son", "Son 50 cevapta yanlışlarım"],
  ];
  const MIX_COUNTS = [10, 20, 30, 50];
  const MOCK_MIN_PER_Q = 1.5; // AÖF vize: 20 soru 30 dakika
  const sourceOf = (id) => id.split(":")[0];

  function mixDefaults(query) {
    const saved = study.mix || {};
    const plan = query.kapsam ? activePlan() : null;
    const courses = query.ders && bySlug[query.ders] ? [query.ders] : plan ? plan.courses : (saved.courses || []).filter((s) => bySlug[s]);
    return {
      mode: query.mod === "deneme" || query.mod === "alistirma" ? query.mod : saved.mode || "alistirma",
      courses: courses.length ? courses : COURSES.map((c) => c.slug),
      sources: saved.sources && saved.sources.length ? saved.sources : ["p", "f", "u"],
      units: query.unite ? [+query.unite] : [],
      pool: MIX_POOLS.some(([k]) => k === query.havuz) ? query.havuz : (query.ders || query.unite ? "hepsi" : saved.pool || "hepsi"),
      count: MIX_COUNTS.includes(+query.n) ? +query.n : saved.count || 20,
      scope: !!(query.kapsam && activePlan()),
    };
  }

  function recentWrong(limit) {
    const out = new Set();
    for (const [, id, ok] of (study.log || []).slice(-limit)) if (!ok) out.add(id);
    return out;
  }

  function mixPool(o) {
    const bank = questionBank();
    const recent = o.pool === "son" ? recentWrong(50) : null;
    const courses = new Set(o.courses), sources = new Set(o.sources), units = new Set(o.units);
    const plan = o.scope ? activePlan() : null;
    const out = [];
    for (const [id, x] of bank) {
      if (!courses.has(x.slug) || !sources.has(sourceOf(id))) continue;
      if (units.size && !units.has(x.unit)) continue;
      if (plan && !inPlanScope(plan, x, id)) continue;
      const card = study.cards[id];
      if (o.pool === "yeni" && card) continue;
      if (o.pool === "hata" && !(card && card.ok === false)) continue;
      if (o.pool === "zayif" && !(card && (card.wrong > card.right || card.lapses > 0 || card.s < 3))) continue;
      if (o.pool === "son" && !recent.has(id)) continue;
      out.push(id);
    }
    return out;
  }

  // Ünitelere dengeli dağıtarak seç: her üniteden sırayla birer soru (ünite içi karışık).
  function stratifiedPick(ids, n) {
    const bank = questionBank();
    const groups = new Map();
    for (const id of shuffle(ids.slice())) {
      const x = bank.get(id);
      const k = x.slug + ":" + x.unit;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(id);
    }
    const lists = shuffle([...groups.values()]);
    const out = [];
    for (let i = 0; out.length < n && lists.some((l) => i < l.length); i++) {
      for (const l of lists) if (i < l.length && out.length < n) out.push(l[i]);
    }
    return shuffle(out);
  }

  function unitsFor(courses) {
    const bank = questionBank();
    const m = new Map();
    for (const [, x] of bank) {
      if (!courses.includes(x.slug) || !x.unit) continue;
      if (!m.has(x.unit)) m.set(x.unit, x.q.unitTitle || "");
      else if (!m.get(x.unit) && x.q.unitTitle) m.set(x.unit, x.q.unitTitle);
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }

  function viewMix(query) {
    const o = mixDefaults(query);
    return `<p class="crumbs"><a href="#/sinavlar">Sınavlar</a> / Karışık test</p>
      <p class="eyebrow">Karışık test</p><h1>Kendi testini oluştur</h1>
      <p class="lead muted">Dersleri, kaynakları ve üniteleri seç; havuzdan ünitelere dengeli dağılmış sorular gelsin. Alıştırma modunda her sorudan sonra açıklamayı görürsün, deneme modunda gerçek sınav gibi süreyle çözüp sonunda puanını alırsın.</p>
      <form class="mix-form desk-card" id="mix-form">
        <fieldset class="seg"><legend>Mod</legend>
          <label class="seg-opt"><input type="radio" name="mode" value="alistirma"${o.mode === "alistirma" ? " checked" : ""}><span><b>Alıştırma</b><small>Anında geri bildirim, süre yok</small></span></label>
          <label class="seg-opt"><input type="radio" name="mode" value="deneme"${o.mode === "deneme" ? " checked" : ""}><span><b>Deneme sınavı</b><small>AÖF vize formatı: süreli, 4 yanlış 1 doğruyu götürür</small></span></label>
        </fieldset>
        <fieldset><legend>Dersler</legend><div class="chk-row">
          ${COURSES.map((c) => `<label class="chk-chip"><input type="checkbox" name="course" value="${esc(c.slug)}"${o.courses.includes(c.slug) ? " checked" : ""}><span>${esc(c.subject)}</span></label>`).join("")}
        </div></fieldset>
        <fieldset><legend>Kaynak</legend><div class="chk-row">
          ${MIX_SOURCES.map(([k, label]) => `<label class="chk-chip"><input type="checkbox" name="source" value="${k}"${o.sources.includes(k) ? " checked" : ""}><span>${label}</span></label>`).join("")}
        </div></fieldset>
        <fieldset id="mix-units"><legend>Üniteler</legend><div class="chk-row" data-units></div></fieldset>
        ${activePlan() ? `<label class="chk-inline"><input type="checkbox" name="scope"${o.scope ? " checked" : ""}> Yalnızca sınav planımın kapsamı (${esc(activePlan().scope === "vize" ? "vize" : "final")} üniteleri)</label>` : ""}
        <div class="mix-row">
          <label>Soru havuzu
            <select name="pool">${MIX_POOLS.map(([k, label]) => `<option value="${k}"${o.pool === k ? " selected" : ""}>${label}</option>`).join("")}</select>
          </label>
          <label>Soru sayısı
            <select name="count">${MIX_COUNTS.map((n) => `<option value="${n}"${o.count === n ? " selected" : ""}>${n} soru</option>`).join("")}</select>
          </label>
        </div>
        <p class="mix-info" id="mix-info" aria-live="polite"></p>
        <div class="btn-row"><button class="btn" type="submit" id="mix-go">Teste başla</button></div>
      </form>
      ${mockHistoryHtml()}
      <div id="mix-root"></div>`;
  }

  function mockHistoryHtml() {
    const mocks = (study.mocks || []).slice(-5).reverse();
    if (!mocks.length) return "";
    return `<section class="mock-hist"><h2>Son denemelerin</h2><ul class="past-list">${mocks.map((m) => `<li class="past-row"><div>
        <strong>${Math.round(m.score)} puan</strong> · net ${m.net.toFixed(2)} · ${m.d} D / ${m.y} Y / ${m.b} B
        <div class="muted" style="font-size:.82rem">${fmtDay(dayKey(m.t))} · ${m.n} soru · ${fmtMs(m.dur)} · ${(m.courses || []).map((s) => bySlug[s] ? esc(bySlug[s].subject) : "").filter(Boolean).join(", ")}</div>
      </div></li>`).join("")}</ul><p class="muted small"><a href="#/analiz">Tüm gelişimini analiz sayfasında gör</a>.</p></section>`;
  }

  function readMixForm(f) {
    return {
      mode: (f.querySelector("[name=mode]:checked") || {}).value || "alistirma",
      courses: [...f.querySelectorAll("[name=course]:checked")].map((x) => x.value),
      sources: [...f.querySelectorAll("[name=source]:checked")].map((x) => x.value),
      units: [...f.querySelectorAll("[name=unit]:checked")].map((x) => +x.value),
      pool: f.pool.value,
      count: +f.count.value,
      scope: !!(f.scope && f.scope.checked),
    };
  }

  function bindMix() {
    const f = document.getElementById("mix-form");
    if (!f) return;
    const query = parseLoc().query;
    let preUnits = query.unite ? [+query.unite] : [];
    const paintUnits = () => {
      const o = readMixForm(f);
      const box = f.querySelector("[data-units]");
      const wrap = document.getElementById("mix-units");
      if (o.courses.length !== 1) {
        wrap.hidden = true;
        box.innerHTML = "";
        return;
      }
      const keep = new Set(box.innerHTML ? o.units : preUnits);
      preUnits = [];
      const units = unitsFor(o.courses);
      wrap.hidden = !units.length;
      box.innerHTML = units.map(([u, title]) => `<label class="chk-chip" title="${esc(title)}"><input type="checkbox" name="unit" value="${u}"${keep.has(u) ? " checked" : ""}><span>Ünite ${u}</span></label>`).join("")
        + `<p class="muted small" style="flex-basis:100%;margin:.3rem 0 0">Hiçbirini seçmezsen tüm üniteler katılır.</p>`;
    };
    const paintInfo = () => {
      const o = readMixForm(f);
      const pool = mixPool(o);
      const info = document.getElementById("mix-info");
      const go = document.getElementById("mix-go");
      const n = Math.min(o.count, pool.length);
      if (!o.courses.length || !o.sources.length) info.textContent = "En az bir ders ve bir kaynak seç.";
      else if (!pool.length) info.textContent = o.pool === "hata" ? "Bu seçimde açık hatan yok." : o.pool === "son" ? "Son 50 cevabında bu seçimde yanlış yok." : "Bu seçimde soru yok.";
      else info.innerHTML = `Havuzda <b>${pool.length}</b> soru. Test <b>${n}</b> sorudan oluşacak${o.mode === "deneme" ? `, süre <b>${Math.round(n * MOCK_MIN_PER_Q)} dakika</b>` : ""}.`;
      go.disabled = !pool.length || !o.courses.length || !o.sources.length;
      go.textContent = o.mode === "deneme" ? "Denemeyi başlat" : "Alıştırmaya başla";
    };
    paintUnits();
    paintInfo();
    f.addEventListener("change", (e) => {
      if (e.target.name === "course") paintUnits();
      paintInfo();
    });
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const o = readMixForm(f);
      study.mix = { mode: o.mode, courses: o.courses, sources: o.sources, pool: o.pool, count: o.count };
      saveStudy();
      const ids = stratifiedPick(mixPool(o), o.count);
      if (!ids.length) return;
      f.hidden = true;
      const hist = document.querySelector(".mock-hist");
      if (hist) hist.hidden = true;
      const root = document.getElementById("mix-root");
      (o.mode === "deneme" ? runMock : runPractice)(root, ids, o);
    });
  }

  // Sonuç: üniteye göre doğru/yanlış/boş tablosu + soru soru inceleme.
  function unitBreakdownHtml(ids, answers) {
    const bank = questionBank();
    const rows = new Map();
    ids.forEach((id, i) => {
      const x = bank.get(id);
      const k = x.slug + ":" + x.unit;
      if (!rows.has(k)) rows.set(k, { slug: x.slug, unit: x.unit, title: x.q.unitTitle || "", d: 0, y: 0, b: 0 });
      const r = rows.get(k);
      const a = answers[i];
      if (a.ok === true) r.d++; else if (a.ok === false) r.y++; else r.b++;
    });
    const list = [...rows.values()].sort((a, b) => (a.d / (a.d + a.y + a.b)) - (b.d / (b.d + b.y + b.b)));
    return `<div class="table-wrap"><table class="transcript unit-table"><thead><tr><th>Ders · ünite</th><th>D</th><th>Y</th><th>B</th><th>Başarı</th><th></th></tr></thead><tbody>
      ${list.map((r) => {
        const tot = r.d + r.y + r.b;
        const p = tot ? r.d / tot : 0;
        return `<tr><td>${esc(bySlug[r.slug].subject)}${r.unit ? ` · Ünite ${r.unit}` : " · Final"}${r.title ? `<div class="muted" style="font-size:.8rem">${esc(r.title)}</div>` : ""}</td>
          <td>${r.d}</td><td>${r.y}</td><td>${r.b}</td><td><span class="acc-bar" style="--p:${Math.round(p * 100)}"><i></i></span> ${pct(p)}</td>
          <td>${r.unit ? `<a href="#/karisik?ders=${r.slug}&unite=${r.unit}">Çalış</a>` : ""}</td></tr>`;
      }).join("")}
    </tbody></table></div>`;
  }

  function reviewListHtml(ids) {
    return `<div class="chip-row filter-row" id="rv-filter">
        <button class="chip active" type="button" data-f="all">Tüm sorular</button>
        <button class="chip" type="button" data-f="y">Yanlışlar</button>
        <button class="chip" type="button" data-f="b">Boşlar</button>
      </div>
      <div id="rv-list">${ids.map((id, i) => `<div class="q review-item" data-i="${i}"></div>`).join("")}</div>`;
  }
  function paintReviewList(ids, answers) {
    const bank = questionBank();
    document.querySelectorAll("#rv-list .review-item").forEach((box) => {
      const i = +box.dataset.i;
      const x = bank.get(ids[i]);
      const a = answers[i];
      box.dataset.state = a.ok === true ? "d" : a.ok === false ? "y" : "b";
      box.innerHTML = `<p class="review-src"><span class="chip">${esc(bySlug[x.slug].subject)}</span> <span>${esc(x.label)}</span> <span class="badge ${a.ok === true ? "pass" : a.ok === false ? "fail" : "none"}">${a.ok === true ? "Doğru" : a.ok === false ? "Yanlış" : "Boş"}</span></p>${questionHTML(x.q, i)}`;
      (a.picked || []).forEach((j) => { const inp = box.querySelector(`[name=q${i}][value="${j}"]`); if (inp) inp.checked = true; });
      showFeedback(x.q, i, a.ok === undefined ? null : a.ok, box);
    });
    const filter = document.getElementById("rv-filter");
    if (filter) filter.onclick = (e) => {
      const b = e.target.closest("[data-f]");
      if (!b) return;
      filter.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === b));
      document.querySelectorAll("#rv-list .review-item").forEach((box) => { box.hidden = b.dataset.f !== "all" && box.dataset.state !== b.dataset.f; });
    };
    typeset(document.getElementById("rv-list"));
  }

  function pickedOf(root, i) {
    return [...root.querySelectorAll(`[name=q${i}]:checked`)].map((x) => +x.value);
  }

  function runPractice(root, ids, o) {
    const bank = questionBank();
    const answers = ids.map(() => ({}));
    let idx = 0;
    const t0 = Date.now();
    const show = () => {
      if (idx >= ids.length) return done();
      const x = bank.get(ids[idx]);
      const right = answers.filter((a) => a.ok === true).length;
      root.innerHTML = `<div class="hud session-hud">
          <div class="hud-item"><span class="hud-k">Soru</span><span class="hud-v">${idx + 1}/${ids.length}</span></div>
          <div class="hud-item"><span class="hud-k">Doğru</span><span class="hud-v">${right}</span></div>
          <div class="hud-item"><span class="hud-k">Bugün</span><span class="hud-v">${(study.days[todayKey()] || { n: 0 }).n}/${study.goal}</span></div>
          <div class="hud-bar" aria-hidden="true"><i style="width:${(idx / ids.length) * 100}%"></i></div>
        </div>
        <div class="q game-q" data-q="${idx}">
          <p class="review-src"><span class="chip">${esc(bySlug[x.slug].subject)}</span> <span>${esc(x.label)}</span></p>
          ${questionHTML(x.q, idx)}
          <div class="btn-row game-actions" id="px-actions">
            <button class="btn" type="button" id="px-check">Kontrol et</button>
            <button class="btn ghost" type="button" id="px-skip">Boş bırak</button>
          </div>
        </div>`;
      typeset(root);
      const box = root.querySelector(".game-q");
      const actions = root.querySelector("#px-actions");
      const after = (ok) => {
        showFeedback(x.q, idx, ok, box);
        box.classList.add(ok === true ? "hit" : ok === false ? "miss" : "skip-note");
        actions.innerHTML = `<button class="btn" type="button" id="px-next">${idx < ids.length - 1 ? "Sonraki soru" : "Sonucu gör"}</button>`;
        const nx = root.querySelector("#px-next");
        nx.onclick = () => { idx++; show(); };
        nx.focus();
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };
      root.querySelector("#px-check").onclick = () => {
        const picked = pickedOf(root, idx);
        if (!picked.length) { root.querySelector("#px-check").textContent = "Önce bir seçenek işaretle"; return; }
        const ok = grade(x.q, idx, root);
        answers[idx] = { ok, picked };
        recordAnswer(ids[idx], ok, null, "exam");
        after(ok);
      };
      root.querySelector("#px-skip").onclick = () => { answers[idx] = { picked: [] }; after(undefined); };
    };
    const done = () => {
      const d = answers.filter((a) => a.ok === true).length, y = answers.filter((a) => a.ok === false).length;
      const b = ids.length - d - y;
      root.innerHTML = `<div class="result ${d / ids.length >= CONFIG.passMark ? "pass" : "fail"} game-result">
          <p class="eyebrow">Alıştırma bitti</p>
          <h2>${d}/${ids.length} doğru · ${pct(d / ids.length)}</h2>
          <ul class="game-stats"><li><b>${y}</b> yanlış</li><li><b>${b}</b> boş</li><li><b>${fmtMs(Date.now() - t0)}</b> süre</li></ul>
          <div class="btn-row"><button class="btn ghost on-dark" type="button" id="mx-again">Yeni test</button><a class="btn ghost on-dark" href="#/analiz">Analiz</a>${y ? `<a class="btn ghost on-dark" href="#/hatalar">Hatalarım</a>` : ""}</div>
        </div>
        <h2>Ünitelere göre</h2>${unitBreakdownHtml(ids, answers)}`;
      root.querySelector("#mx-again").onclick = () => route();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    show();
  }

  function runMock(root, ids, o) {
    const bank = questionBank();
    const answers = ids.map(() => ({ picked: [] }));
    const flags = new Set();
    let idx = 0;
    const t0 = Date.now();
    const limit = Math.round(ids.length * MOCK_MIN_PER_Q) * 60000;
    let timer = null, finished = false;
    root.classList.add("mock");
    root.innerHTML = `<div class="hud mock-hud">
        <div class="hud-item"><span class="hud-k">Soru</span><span class="hud-v" id="mk-idx"></span></div>
        <div class="hud-item"><span class="hud-k">Cevaplanan</span><span class="hud-v" id="mk-done"></span></div>
        <div class="hud-item"><span class="hud-k">Kalan süre</span><span class="hud-v" id="mk-time" role="timer"></span></div>
        <button class="btn mock-finish" type="button" id="mk-finish">Sınavı bitir</button>
        <div class="hud-bar" aria-hidden="true"><i id="mk-bar"></i></div>
      </div>
      <nav class="mock-nav" aria-label="Soru gezgini" id="mk-nav">${ids.map((_, i) => `<button type="button" data-go="${i}" aria-label="${i + 1}. soru">${i + 1}</button>`).join("")}</nav>
      <div id="mk-stage"></div>
      <p class="sr-only" id="mk-live" aria-live="polite"></p>`;
    const stage = root.querySelector("#mk-stage");
    const save = () => { answers[idx].picked = pickedOf(stage, idx); };
    const paintNav = () => {
      root.querySelectorAll("#mk-nav [data-go]").forEach((b) => {
        const i = +b.dataset.go;
        b.classList.toggle("done", answers[i].picked.length > 0);
        b.classList.toggle("flag", flags.has(i));
        b.classList.toggle("cur", i === idx);
        if (i === idx) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
      const doneN = answers.filter((a) => a.picked.length).length;
      root.querySelector("#mk-idx").textContent = `${idx + 1}/${ids.length}`;
      root.querySelector("#mk-done").textContent = `${doneN}/${ids.length}`;
      root.querySelector("#mk-bar").style.width = (doneN / ids.length) * 100 + "%";
    };
    const tick = () => {
      if (!document.body.contains(root)) return clearInterval(timer);
      const left = Math.max(0, limit - (Date.now() - t0));
      const el = root.querySelector("#mk-time");
      const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
      el.textContent = `${m}:${String(s).padStart(2, "0")}`;
      el.classList.toggle("warn", left < 5 * 60000);
      if (left < 5 * 60000 && !root.dataset.warned) { root.dataset.warned = "1"; root.querySelector("#mk-live").textContent = "Son 5 dakika."; }
      if (!left) finish(true);
    };
    const show = (i) => {
      if (finished) return;
      save();
      idx = Math.max(0, Math.min(ids.length - 1, i));
      const x = bank.get(ids[idx]);
      stage.innerHTML = `<div class="q game-q mock-q" data-q="${idx}">
          <p class="review-src"><span class="chip">${esc(bySlug[x.slug].subject)}</span>${x.unit ? ` <span>Ünite ${x.unit}</span>` : ""}</p>
          ${questionHTML(x.q, idx)}
          <div class="btn-row mock-actions">
            <button class="btn ghost" type="button" id="mk-prev"${idx ? "" : " disabled"}>Önceki</button>
            <button class="btn ghost" type="button" id="mk-flag" aria-pressed="${flags.has(idx)}">${flags.has(idx) ? "İşareti kaldır" : "Sonra bak"}</button>
            <button class="btn ghost" type="button" id="mk-clear">Cevabı sil</button>
            <button class="btn" type="button" id="mk-next">${idx < ids.length - 1 ? "Sonraki" : "Bitir"}</button>
          </div>
        </div>`;
      answers[idx].picked.forEach((j) => { const inp = stage.querySelector(`[name=q${idx}][value="${j}"]`); if (inp) inp.checked = true; });
      typeset(stage);
      stage.querySelector("#mk-prev").onclick = () => show(idx - 1);
      stage.querySelector("#mk-next").onclick = () => (idx < ids.length - 1 ? show(idx + 1) : finish(false));
      stage.querySelector("#mk-flag").onclick = () => { flags.has(idx) ? flags.delete(idx) : flags.add(idx); show(idx); };
      stage.querySelector("#mk-clear").onclick = () => { stage.querySelectorAll(`[name=q${idx}]`).forEach((x) => (x.checked = false)); save(); paintNav(); };
      stage.onchange = () => { save(); paintNav(); };
      paintNav();
    };
    root.querySelector("#mk-nav").onclick = (e) => { const b = e.target.closest("[data-go]"); if (b) show(+b.dataset.go); };
    root.querySelector("#mk-finish").onclick = () => finish(false);
    const keys = (e) => {
      if (finished || !document.body.contains(root)) return document.removeEventListener("keydown", keys);
      if (e.target.tagName === "INPUT" && e.target.type === "text") return;
      if (/^[1-6]$/.test(e.key)) {
        const inp = stage.querySelectorAll(`[name=q${idx}]`)[+e.key - 1];
        if (inp) { inp.checked = inp.type === "checkbox" ? !inp.checked : true; save(); paintNav(); e.preventDefault(); }
      } else if (e.key === "ArrowRight" && e.target.tagName !== "SELECT") { show(idx + 1); e.preventDefault(); }
      else if (e.key === "ArrowLeft" && e.target.tagName !== "SELECT") { show(idx - 1); e.preventDefault(); }
    };
    document.addEventListener("keydown", keys);

    function finish(timeUp) {
      if (finished) return;
      save();
      const blanks = answers.filter((a) => !a.picked.length).length;
      if (!timeUp && !window.confirm(blanks ? `${blanks} soru boş. Sınavı bitirmek istiyor musun?` : "Sınavı bitirmek istiyor musun?")) return;
      finished = true;
      clearInterval(timer);
      document.removeEventListener("keydown", keys);
      // Puanla: soruları görünmez bir kapta işaretleyip ortak grade() ile değerlendir.
      const tmp = document.createElement("div");
      ids.forEach((id, i) => {
        const a = answers[i];
        if (!a.picked.length) { a.ok = undefined; return; }
        const x = bank.get(id);
        tmp.innerHTML = questionHTML(x.q, i);
        a.picked.forEach((j) => { const inp = tmp.querySelector(`[name=q${i}][value="${j}"]`); if (inp) inp.checked = true; });
        a.ok = grade(x.q, i, tmp);
        recordAnswer(id, a.ok, null, "exam");
      });
      const d = answers.filter((a) => a.ok === true).length, y = answers.filter((a) => a.ok === false).length, b = ids.length - d - y;
      const net = d - y / 4;
      const score = Math.max(0, (net / ids.length) * 100);
      const dur = Math.min(limit, Date.now() - t0);
      study.mocks = (study.mocks || []).concat([{ t: Date.now(), n: ids.length, d, y, b, net, score, dur, courses: o.courses }]).slice(-100);
      saveStudy();
      const prev = (study.mocks || []).slice(-2, -1)[0];
      root.classList.remove("mock");
      root.innerHTML = `<div class="result ${score >= 50 ? "pass" : "fail"} game-result">
          <p class="eyebrow">${timeUp ? "Süre doldu · " : ""}Deneme sınavı sonucu</p>
          <h2>${Math.round(score)} puan · net ${net.toFixed(2)}</h2>
          <ul class="game-stats"><li><b>${d}</b> doğru</li><li><b>${y}</b> yanlış</li><li><b>${b}</b> boş</li><li><b>${fmtMs(dur)}</b> süre</li>${prev ? `<li><b>${score >= prev.score ? "▲" : "▼"} ${Math.abs(Math.round(score - prev.score))}</b> önceki denemeye göre</li>` : ""}</ul>
          <p>Puan, AÖF'deki gibi net üzerinden hesaplandı: her 4 yanlış 1 doğruyu götürür, boşlar puan kaybettirmez. Yanlışların Hatalarım listesine eklendi.</p>
          <div class="btn-row"><button class="btn ghost on-dark" type="button" id="mx-again">Yeni deneme</button><a class="btn ghost on-dark" href="#/analiz">Analiz</a>${y ? `<a class="btn ghost on-dark" href="#/hatalar">Hatalarım</a>` : ""}</div>
        </div>
        <h2>Ünitelere göre</h2>${unitBreakdownHtml(ids, answers)}
        <h2>Soru soru inceleme</h2>${reviewListHtml(ids)}`;
      paintReviewList(ids, answers);
      root.querySelector("#mx-again").onclick = () => route();
      window.scrollTo(0, 0);
    }
    show(0);
    tick();
    timer = setInterval(tick, 1000);
  }

  // ---- analiz paneli (#/analiz) ---------------------------------------------------
  function accuracyOf(list) {
    let r = 0, w = 0;
    for (const c of list) { r += c.right || 0; w += c.wrong || 0; }
    return { r, w, n: r + w, p: r + w ? r / (r + w) : 0 };
  }
  // Günlük sütun (çözülen) + doğruluk çizgisi, saf SVG.
  function dailyChartSvg(days) {
    const W = 640, H = 200, P = { l: 30, r: 34, t: 14, b: 26 };
    const keys = Array.from({ length: days }, (_, i) => dayKey(addDays(Date.now(), i - days + 1)));
    const rows = keys.map((k) => study.days[k] || { n: 0, ok: 0 });
    const max = Math.max(5, ...rows.map((r) => r.n));
    const bw = (W - P.l - P.r) / days;
    const y = (v) => P.t + (H - P.t - P.b) * (1 - v / max);
    const yp = (p) => P.t + (H - P.t - P.b) * (1 - p);
    const bars = rows.map((r, i) => r.n ? `<rect class="ch-bar" x="${(P.l + i * bw + bw * 0.15).toFixed(1)}" y="${y(r.n).toFixed(1)}" width="${(bw * 0.7).toFixed(1)}" height="${(H - P.b - y(r.n)).toFixed(1)}"><title>${fmtDay(keys[i])}: ${r.n} soru, ${r.ok} doğru</title></rect>` : "").join("");
    const pts = rows.map((r, i) => (r.n ? `${(P.l + i * bw + bw / 2).toFixed(1)},${yp(r.ok / r.n).toFixed(1)}` : null)).filter(Boolean);
    const dots = rows.map((r, i) => (r.n ? `<circle class="ch-dot" cx="${(P.l + i * bw + bw / 2).toFixed(1)}" cy="${yp(r.ok / r.n).toFixed(1)}" r="2.6"/>` : "")).join("");
    const step = days <= 7 ? 1 : days <= 30 ? 5 : 15;
    const labels = keys.map((k, i) => ((days - 1 - i) % step === 0 ? `<text class="ch-lbl" x="${(P.l + i * bw + bw / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${fmtDay(k).replace(/ (\S{3})\S*/, " $1")}</text>` : "")).join("");
    const total = rows.reduce((a, r) => a + r.n, 0);
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Son ${days} gün: toplam ${total} soru">
      <line class="ch-grid" x1="${P.l}" x2="${W - P.r}" y1="${y(max)}" y2="${y(max)}"/><line class="ch-grid" x1="${P.l}" x2="${W - P.r}" y1="${y(max / 2)}" y2="${y(max / 2)}"/><line class="ch-axis" x1="${P.l}" x2="${W - P.r}" y1="${H - P.b}" y2="${H - P.b}"/>
      <text class="ch-lbl" x="${P.l - 6}" y="${y(max) + 4}" text-anchor="end">${max}</text><text class="ch-lbl" x="${P.l - 6}" y="${y(max / 2) + 4}" text-anchor="end">${Math.round(max / 2)}</text>
      <text class="ch-lbl ch-acc" x="${W - P.r + 6}" y="${yp(1) + 4}">%100</text><text class="ch-lbl ch-acc" x="${W - P.r + 6}" y="${yp(0.5) + 4}">%50</text>
      ${bars}${pts.length > 1 ? `<polyline class="ch-line" points="${pts.join(" ")}"/>` : ""}${dots}${labels}
    </svg>
    <p class="chart-legend"><span class="lg-bar"></span> Çözülen soru <span class="lg-line"></span> Doğruluk</p>`;
  }
  function mockChartSvg(mocks) {
    const W = 640, H = 170, P = { l: 30, r: 12, t: 14, b: 22 };
    const n = mocks.length;
    const x = (i) => P.l + (n === 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (n - 1));
    const y = (v) => P.t + (H - P.t - P.b) * (1 - v / 100);
    const pts = mocks.map((m, i) => `${x(i).toFixed(1)},${y(m.score).toFixed(1)}`);
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Deneme puanları: ${mocks.map((m) => Math.round(m.score)).join(", ")}">
      ${[0, 50, 100].map((v) => `<line class="ch-grid" x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ch-lbl" x="${P.l - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("")}
      ${n > 1 ? `<polyline class="ch-line" points="${pts.join(" ")}"/>` : ""}
      ${mocks.map((m, i) => `<circle class="ch-dot" cx="${x(i).toFixed(1)}" cy="${y(m.score).toFixed(1)}" r="4"><title>${fmtDay(dayKey(m.t))}: ${Math.round(m.score)} puan, net ${m.net.toFixed(2)}</title></circle>`).join("")}
    </svg>`;
  }

  function unitStats() {
    const bank = questionBank();
    const units = new Map();
    for (const [id, card] of Object.entries(study.cards)) {
      const x = bank.get(id);
      if (!x || !x.unit) continue;
      const k = x.slug + ":" + x.unit;
      if (!units.has(k)) units.set(k, { slug: x.slug, unit: x.unit, title: "", chapter: 0, cards: [] });
      const u = units.get(k);
      u.cards.push(card);
      if (!u.title && x.q.unitTitle) u.title = x.q.unitTitle;
      if (!u.chapter && Array.isArray(x.q.chapters) && x.q.chapters.length) u.chapter = x.q.chapters[0];
    }
    for (const u of units.values()) Object.assign(u, accuracyOf(u.cards), { open: u.cards.filter((c) => c.ok === false).length });
    return [...units.values()];
  }
  const accClass = (p) => (p >= 0.8 ? "a4" : p >= 0.65 ? "a3" : p >= 0.5 ? "a2" : "a1");

  function viewAnalysis(query) {
    const range = [7, 30, 90].includes(+query.gun) ? +query.gun : 30;
    const cards = Object.entries(study.cards).filter(([id]) => bySlug[courseOfId(id)]);
    const all = accuracyOf(cards.map(([, c]) => c));
    if (!all.n) {
      return `<p class="eyebrow">Analiz</p><h1>Gelişim paneli</h1>
        <div class="desk-card empty-state"><h3>Henüz veri yok</h3><p class="muted">Soru çözdükçe burada derslere ve ünitelere göre doğruluk, zayıf konular ve gelişim grafikleri oluşur.</p>
        <div class="btn-row"><a class="btn" href="#/karisik">Karışık test çöz</a><a class="btn ghost" href="#/tekrar">Tekrar et</a></div></div>`;
    }
    const keys = Array.from({ length: range }, (_, i) => dayKey(addDays(Date.now(), -i)));
    const inRange = keys.map((k) => study.days[k]).filter(Boolean);
    const rN = inRange.reduce((a, r) => a + r.n, 0), rOk = inRange.reduce((a, r) => a + r.ok, 0);
    const activeDays = keys.filter(isActive).length;
    const mature = cards.filter(([, c]) => c.s >= 21).length;
    const units = unitStats();
    const weakest = units.filter((u) => u.n >= 3).sort((a, b) => a.p - b.p || b.open - a.open).slice(0, 10);
    const perCourse = COURSES.map((c) => {
      const cs = cards.filter(([id]) => courseOfId(id) === c.slug).map(([, x]) => x);
      const bankN = [...questionBank().values()].filter((x) => x.slug === c.slug).length;
      return { c, ...accuracyOf(cs), seen: cs.length, bankN, open: cs.filter((x) => x.ok === false).length, lv: { m: cs.filter((x) => x.s >= 21).length, y: cs.filter((x) => x.ok !== false && x.s >= 3 && x.s < 21).length } };
    }).filter((r) => r.seen);
    const bySource = MIX_SOURCES.map(([k, label]) => ({ label, ...accuracyOf(cards.filter(([id]) => sourceOf(id) === k).map(([, c]) => c)) })).filter((s) => s.n);
    const mocks = (study.mocks || []).slice(-20);
    const tabs = [7, 30, 90].map((d) => `<a class="chip${d === range ? " active" : ""}" href="#/analiz?gun=${d}">${d} gün</a>`).join("");
    return `<p class="eyebrow">Analiz</p><h1>Gelişim paneli</h1>
      <p class="lead muted">Hangi derste ve ünitede güçlü, nerede zayıf olduğunu gör; zayıf konulara tek dokunuşla karışık test başlat.</p>
      <div class="chip-row filter-row">${tabs}</div>
      <div class="kpi-grid">
        <div class="desk-card kpi"><span class="desk-k">Çözülen soru</span><b>${rN}</b><span class="muted small">son ${range} gün · toplam ${all.n}</span></div>
        <div class="desk-card kpi"><span class="desk-k">Doğruluk</span><b>${rN ? pct(rOk / rN) : "-"}</b><span class="muted small">son ${range} gün · genel ${pct(all.p)}</span></div>
        <div class="desk-card kpi"><span class="desk-k">Aktif gün</span><b>${activeDays}/${range}</b><span class="muted small">günde ort. ${activeDays ? Math.round(rN / activeDays) : 0} soru</span></div>
        <div class="desk-card kpi"><span class="desk-k">Oturmuş bilgi</span><b>${mature}</b><span class="muted small">${cards.length} karttan, 3+ hafta aralıklı</span></div>
      </div>
      <section class="desk-card chart-card"><h3>Günlük çalışma ve doğruluk</h3>${dailyChartSvg(range)}</section>
      <h2>En zayıf 10 konu</h2>
      ${weakest.length ? `<ol class="weak-list">${weakest.map((u) => `<li>
          <div><b>${esc(bySlug[u.slug].subject)} · Ünite ${u.unit}</b>${u.title ? ` <span class="muted">${esc(u.title)}</span>` : ""}
            <div class="muted small"><span class="acc-bar" style="--p:${Math.round(u.p * 100)}"><i></i></span> ${pct(u.p)} doğru · ${u.n} cevap · ${u.open} açık hata</div></div>
          <div class="weak-actions"><a class="btn sm-mini" href="#/karisik?ders=${u.slug}&unite=${u.unit}&mod=alistirma">Bu üniteden test</a>${u.chapter || u.unit <= bySlug[u.slug].chapters.length ? `<a class="btn ghost sm-mini" href="#/course/${u.slug}/chapter/${u.chapter || u.unit}">Konu anlatımı</a>` : ""}</div>
        </li>`).join("")}</ol>` : `<p class="muted">Zayıf konu çıkarmak için ünite başına en az 3 cevap gerekiyor.</p>`}
      <h2>Derslere göre</h2>
      <div class="table-wrap"><table class="transcript"><thead><tr><th>Ders</th><th>Görülen soru</th><th>Doğruluk</th><th>Açık hata</th><th>Kart durumu</th></tr></thead><tbody>
        ${perCourse.map((r) => `<tr><td><a href="#/course/${r.c.slug}">${esc(r.c.subject)}</a></td>
          <td>${r.seen}<span class="muted small"> / ${r.bankN}</span></td>
          <td><span class="acc-bar" style="--p:${Math.round(r.p * 100)}"><i></i></span> ${pct(r.p)}</td>
          <td>${r.open ? `<a href="#/hatalar?ders=${r.c.slug}">${r.open}</a>` : 0}</td>
          <td><span class="stack-bar" role="img" aria-label="${r.lv.m} oturmuş, ${r.lv.y} pekişiyor, ${r.seen - r.lv.m - r.lv.y} öğreniliyor"><i class="m" style="flex:${r.lv.m}"></i><i class="y" style="flex:${r.lv.y}"></i><i class="l" style="flex:${r.seen - r.lv.m - r.lv.y}"></i></span></td></tr>`).join("")}
      </tbody></table></div>
      <p class="muted small"><span class="lg-sq m"></span> oturmuş <span class="lg-sq y"></span> pekişiyor <span class="lg-sq l"></span> öğreniliyor</p>
      <h2>Ünite haritası</h2>
      <p class="muted">Her kutu bir ünite; renk doğruluk oranını gösterir. Kutuya dokununca o üniteden test başlar.</p>
      ${perCourse.map((r) => {
        const us = units.filter((u) => u.slug === r.c.slug).sort((a, b) => a.unit - b.unit);
        if (!us.length) return "";
        return `<div class="unit-map"><h3>${esc(r.c.subject)}</h3><div class="unit-grid">${us.map((u) => `<a class="unit-cell ${accClass(u.p)}" href="#/karisik?ders=${u.slug}&unite=${u.unit}&mod=alistirma" title="${esc(u.title)}"><b>${u.unit}</b><span>${pct(u.p)}</span><small>${u.n} cevap</small></a>`).join("")}</div></div>`;
      }).join("")}
      <p class="muted small acc-legend"><span class="unit-cell a1"></span> %50 altı <span class="unit-cell a2"></span> %50-65 <span class="unit-cell a3"></span> %65-80 <span class="unit-cell a4"></span> %80 üstü</p>
      ${bySource.length > 1 ? `<h2>Kaynağa göre</h2><div class="week-grid">${bySource.map((s) => `<div class="stat"><b>${pct(s.p)}</b><span>${esc(s.label)} · ${s.n} cevap</span></div>`).join("")}</div>` : ""}
      <h2>Deneme sınavları</h2>
      ${mocks.length ? `<section class="desk-card chart-card">${mockChartSvg(mocks)}<p class="desk-meta">Son ${mocks.length} deneme · en yüksek ${Math.round(Math.max(...mocks.map((m) => m.score)))} puan · ortalama ${Math.round(mocks.reduce((a, m) => a + m.score, 0) / mocks.length)} puan</p></section>`
        : `<p class="muted">Henüz deneme sınavı çözmedin. <a href="#/karisik?mod=deneme">AÖF formatında bir deneme başlat</a>.</p>`}`;
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
      <p class="muted">İlerleme yalnızca bu tarayıcıda saklanır. Site verilerini temizlerseniz sıfırlanır. <a href="#/cevrimdisi?b=yedek">İlerlemenizi yedekleyin</a>.</p>
      <div class="progress" aria-label="${total} dersten ${done} geçildi"><i style="width:${total ? (done / total) * 100 : 0}%"></i></div>
      <p><strong>${total} dersten ${done}</strong> ders geçildi. ${done >= total && total ? `<a href="#/certificate">Belgenizi alın.</a>` : `Belgenizi açmak için ${total === 1 ? "bu dersi" : `tüm ${total} dersi`} geçin.`}</p>
      <div class="table-wrap"><table class="transcript"><thead><tr><th>Kod</th><th>Ders</th><th>En iyi puan</th><th>Deneme</th><th>Durum</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="btn-row" style="max-width:280px"><button class="btn ghost" id="reset">İlerlememi sıfırla</button></div>`;
  }
  function bindTranscript() {
    const b = document.getElementById("reset");
    if (!b) return;
    b.onclick = () => {
      if (b.dataset.armed) { progress = {}; save(progress); study = loadStudy(); study.cards = {}; study.days = {}; study.frozen = []; study.log = []; study.mocks = []; saveStudy(); route(); return; }
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
    if (on && !s.has(n)) recordRead();
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
    const tabbar = tabs.map(([id, label], i) => `<button class="sm-tab${i === 0 ? " active" : ""}" type="button" role="tab" aria-selected="${i === 0}" data-tab="${id}" aria-controls="${esc(prefix)}-${id}">${txtPlain(label)}</button>`).join("");

    const takeaways = (d.takeaways || []).length
      ? `<div class="sm-take"><p class="sm-label">Ana çıkarımlar</p><ul>${d.takeaways.map((k) => `<li><strong>${txtPlain(k.t)}:</strong> ${txtPlain(k.d)}</li>`).join("")}</ul></div>`
      : "";

    const first = tabs.length ? tabs[0][0] : "";
    const vis = (id) => (id === first ? "" : " hidden");
    const pane = (id, inner) => `<div class="sm-pane" data-pane="${id}" role="tabpanel" id="${esc(prefix)}-${id}"${vis(id)}>${inner}</div>`;

    const cards = (d.concepts || []).length
      ? pane("kavramlar", `<p class="sm-hint">Karta dokunup çevirin.</p>
           <div class="sm-cards">${d.concepts.map((k) => `<button class="k-card" type="button" aria-label="${esc(k.term)} kartını çevir"><span class="k-inner"><span class="k-face k-front">${txtPlain(k.term)}</span><span class="k-face k-back">${txtPlain(k.def)}</span></span></button>`).join("")}</div>`)
      : "";

    const cmp = d.compare && d.compare.left && d.compare.right
      ? pane("karsilastirma", `<div class="sm-compare">
           <div class="cmp-card cmp-a"><h4>${txtPlain(d.compare.left.title || "Din")}</h4><ul>${(d.compare.left.points || []).map((p) => `<li><strong>${txtPlain(p.k)}:</strong> ${txtPlain(p.v)}</li>`).join("")}</ul></div>
           <div class="cmp-card cmp-b"><h4>${txtPlain(d.compare.right.title || "Mezhep")}</h4><ul>${(d.compare.right.points || []).map((p) => `<li><strong>${txtPlain(p.k)}:</strong> ${txtPlain(p.v)}</li>`).join("")}</ul></div>
         </div>`)
      : "";

    const timeline = (d.timeline || []).length
      ? pane("akis", `<ol class="sm-timeline">${d.timeline.map((m, i) => `<li class="tl-item">
             <button class="tl-head" type="button" aria-expanded="false" aria-controls="tl-${esc(prefix)}-${i}">
               <span class="tl-year">${txtPlain(m.year)}</span><span class="tl-name">${txtPlain(m.name)}</span><span class="sm-caret" aria-hidden="true"></span>
             </button>
             <div class="tl-desc" id="tl-${esc(prefix)}-${i}" hidden>${txtPlain(m.desc)}</div>
           </li>`).join("")}</ol>`)
      : "";

    const matrix = d.matrix && (d.matrix.rows || []).length
      ? pane("matris", `<p class="sm-hint">${txtPlain(d.matrix.hint || "Karşılaştırmalı tablo. Mobilde tabloyu yana kaydırın.")}</p>
           <div class="table-wrap"><table class="sm-matrix">
             <thead><tr><th>${txtPlain(d.matrix.rowTerm || "Öğe")}</th>${d.matrix.axes.map((a) => `<th>${txtPlain(a)}</th>`).join("")}</tr></thead>
             <tbody>${d.matrix.rows.map((r) => `<tr><th scope="row">${txtPlain(r.label || r.school || "")}</th>${r.cells.map((cell) => `<td>${txtPlain(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
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
             <div><strong>${txtPlain(f.t)}</strong><p>${txtPlain(f.d)}</p></div>
           </li>`).join("")}</ul>`)
      : "";

    const tree = (d.tree || []).length
      ? pane("secere", `<p class="sm-hint">Detay için ekol kutusuna dokunun.</p>
           <div class="sm-tree" role="group" aria-label="Ekoller">${d.tree.map((n, i) => `<button class="tree-node" type="button" data-node="${i}" aria-pressed="false">${txtPlain(n.label)}</button>`).join("")}</div>
           <div class="tree-detail" data-tree-detail hidden></div>`)
      : "";

    const quiz = (d.quiz || []).length
      ? pane("test", (d.quiz).map((q, i) => `<div class="smq" data-smq="${i}">
             <p class="smq-q"><strong>${i + 1}.</strong> ${txtPlain(q.q)}</p>
             ${(q.options || []).map((o, j) => `<label class="smq-opt"><input type="radio" name="${esc(prefix)}-q${i}" value="${j}"><span>${txtPlain(o)}</span></label>`).join("")}
             <div class="smq-actions"><button class="btn ghost sm-mini smq-check" type="button">Kontrol et</button></div>
             <div class="smq-fb" hidden></div>
           </div>`).join(""))
      : "";

    return `<div class="sm-panel" data-panel="${esc(prefix)}" data-json="${esc(JSON.stringify(d))}">
      ${takeaways ? `<p class="sm-panel-title">${txtPlain(d.title || "İnteraktif çalışma paneli")}</p>${takeaways}` : ""}
      ${tabs.length > 1 ? `<div class="sm-tabs" role="tablist" aria-label="Panel görünümleri">${tabbar}</div>` : ""}
      ${cards}${cmp}${timeline}${matrix}${factors}${tree}${quiz}
    </div>`;
  }

  function interactivePanel(c) {
    const d = INTERACTIVE()[c.slug];
    return d ? panelHTML(d, "pnl-" + c.slug) : "";
  }
  function chapterPanel(c, n) {
    const d = INTERACTIVE()[c.slug];
    const ch = d && d.chapters && d.chapters[String(n)];
    return ch ? panelHTML(ch, `chp-${c.slug}-${n}`) : "";
  }

  // ---- interaktif bölüm raporu ---------------------------------------------
  // NotebookLM'in "Learning Overview" raporunun mantığı: çalışma notları başlıklarına göre
  // kısımlara ayrılır ve paneldeki her etkinlik (kavram kartı, test sorusu, akış, karşılaştırma,
  // matris, sâikler, şecere) metinde en çok geçtiği kısmın hemen altına yerleşir. Etkinlikler
  // kapalı kart olarak başlar, okur açınca çalışır. Hepsi data.js ve interactive.js'ten gelir,
  // bu yüzden çevrimdışı da çalışır.
  function splitNotes(text) {
    const parts = [];
    let cur = { title: "", lines: [] };
    for (const raw of String(text || "").split("\n")) {
      const line = raw.trim();
      const h = line.match(/^#{1,6}\s+(.+)$/) || line.match(/^\*\*([^*].*?)\*\*:?$/);
      if (h) {
        if (cur.title || cur.lines.some((l) => l.trim())) parts.push(cur);
        cur = { title: h[1].replace(/\*\*/g, "").trim(), lines: [] };
      } else cur.lines.push(raw);
    }
    if (cur.title || cur.lines.some((l) => l.trim())) parts.push(cur);
    return parts.map((p) => ({ title: p.title, body: p.lines.join("\n").trim() }));
  }

  // Bir etkinliği metnine en çok benzeyen kısma bağla (uzun kelimelerin kısımda geçme oranı).
  function bestSection(secTokens, text, fallback) {
    const words = [...new Set(tokenize(text).filter((w) => w.length >= 4))];
    if (!words.length) return fallback;
    let best = fallback, bestScore = 0;
    secTokens.forEach((set, i) => {
      let hit = 0;
      for (const w of words) if (set.has(w) || [...set].some((t) => t.length >= 5 && (t.startsWith(w) || w.startsWith(t)))) hit++;
      const score = hit / words.length;
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return bestScore >= 0.34 ? best : fallback;
  }

  const ACT_KIND = {
    concepts: ["Kavram kartları", (d) => `${d.concepts.length} kart`],
    quiz: ["Kendini dene", (d) => `${d.quiz.length} soru`],
    compare: ["Karşılaştırma", (d) => `${d.compare.left.title || ""} / ${d.compare.right.title || ""}`],
    timeline: ["Tarihsel akış", (d) => `${d.timeline.length} adım`],
    matrix: ["Karşılaştırma matrisi", (d) => `${d.matrix.rows.length} satır`],
    factors: ["Sâikler", (d) => `${d.factors.items.length} etken`],
    tree: ["Şecere", (d) => `${d.tree.length} kol`],
  };

  function reportActivities(d, sections) {
    const secTokens = sections.map((s) => new Set(tokenize(s.title + " " + s.body)));
    const last = Math.max(0, sections.length - 1);
    const L = d.labels || {};
    const acts = [];
    const add = (kind, sec, data) => acts.push({ kind, sec, data });
    // Kartlar ve sorular tek tek dağıtılır; aynı kısma düşenler tek kartta toplanır.
    const spread = (kind, items, textOf) => {
      const groups = new Map();
      items.forEach((it, i) => {
        const fb = Math.min(last, Math.floor((i * sections.length) / items.length));
        const sec = bestSection(secTokens, textOf(it), fb);
        if (!groups.has(sec)) groups.set(sec, []);
        groups.get(sec).push(it);
      });
      groups.forEach((list, sec) => add(kind, sec, { labels: L, [kind]: list }));
    };
    if ((d.concepts || []).length) spread("concepts", d.concepts, (k) => k.term);
    // Sorular her zaman kısmın sonunda dursun diye en sona eklenir (aşağıda sıralanır).
    const whole = [
      ["compare", d.compare && d.compare.left && d.compare.right, (x) => [x.left.title, x.right.title, ...(x.left.points || []).map((p) => p.k), ...(x.right.points || []).map((p) => p.k)].join(" ")],
      ["timeline", (d.timeline || []).length, (x) => x.map((m) => m.name).join(" ")],
      ["matrix", d.matrix && (d.matrix.rows || []).length, (x) => x.rows.map((r) => r.label || r.school || "").join(" ") + " " + (x.axes || []).join(" ")],
      ["factors", d.factors && (d.factors.items || []).length, (x) => x.items.map((f) => f.t).join(" ")],
      ["tree", (d.tree || []).length, (x) => x.map((n) => n.label).join(" ")],
    ];
    whole.forEach(([kind, ok, textOf], i) => {
      if (!ok) return;
      const fb = Math.min(last, Math.round(((i + 1) * last) / (whole.length + 1)));
      add(kind, bestSection(secTokens, textOf(d[kind]), fb), { labels: L, [kind]: d[kind] });
    });
    if ((d.quiz || []).length) spread("quiz", d.quiz, (q) => q.q + " " + (q.options || [])[q.answer]);
    const order = { concepts: 0, compare: 1, timeline: 2, matrix: 3, factors: 4, tree: 5, quiz: 6 };
    return acts.sort((a, b) => a.sec - b.sec || order[a.kind] - order[b.kind]);
  }

  function activityHtml(act, prefix) {
    const [kindLabel, sub] = ACT_KIND[act.kind];
    const L = act.data.labels || {};
    const named = { concepts: L.concepts, quiz: L.quiz, compare: L.compare, timeline: L.timeline, matrix: L.matrix, factors: L.factors, tree: L.tree }[act.kind];
    return `<details class="rp-act" data-kind="${act.kind}">
      <summary><span class="rp-act-kind">${esc(named || kindLabel)}</span><span class="rp-act-sub">${esc(sub(act.data))}</span><span class="rp-act-cta" aria-hidden="true"></span></summary>
      <div class="rp-act-body">${panelHTML(act.data, prefix)}</div>
    </details>`;
  }

  function chapterReportHtml(c, n) {
    const ch = c.chapters[n - 1];
    const cites = chapterPastCites(c, n);
    if (!ch.notes) return `<h2>Çalışma notları</h2><div class="notes"><p class="muted">Bu bölümün çalışma notları henüz hazır değil.</p></div>`;
    const d = (INTERACTIVE()[c.slug] || {}).chapters || {};
    const data = d[String(n)] || {};
    const sections = splitNotes(ch.notes);
    const acts = reportActivities(data, sections);
    const id = (i) => `rp-${c.slug}-${n}-${i}`;
    const actsIn = (i) => acts.filter((a) => a.sec === i);
    const title = (s, i) => s.title || (i === 0 ? "Giriş" : `${i + 1}. kısım`);
    const toc = sections.length > 1 ? `<nav class="rp-toc" aria-label="Raporun ana hatları">
        <p class="rp-label">Ana hatlar</p>
        <ol>${sections.map((s, i) => {
          const k = actsIn(i).length;
          return `<li><button type="button" class="rp-goto" data-goto="${id(i)}"><span>${txtPlain(title(s, i))}</span>${k ? `<span class="rp-count">${k} etkinlik</span>` : ""}</button></li>`;
        }).join("")}</ol>
      </nav>` : "";
    const take = (data.takeaways || []).length
      ? `<div class="rp-take"><p class="rp-label">Ana çıkarımlar</p><ul>${data.takeaways.map((k) => `<li><strong>${txtPlain(k.t)}:</strong> ${txtPlain(k.d)}</li>`).join("")}</ul></div>`
      : "";
    const body = sections.map((s, i) => {
      const text = notesHtmlWithCites({ notes: s.body }, cites, c.slug);
      const head = sections.length > 1 || s.title ? `<h3 class="rp-h" id="${id(i)}" tabindex="-1">${ota(esc(title(s, i)))}</h3>` : "";
      return `<section class="rp-sec">${head}<div class="notes">${text}</div>${actsIn(i).map((a, j) => activityHtml(a, `${id(i)}-${a.kind}-${j}`)).join("")}</section>`;
    }).join("");
    const total = acts.length;
    return `<div class="rp" data-rp-total="${total}">
      <div class="rp-head">
        <h2>Bölüm raporu</h2>
        <p class="muted rp-lead">Çalışma notları kısımlara ayrıldı${total ? `; ${total} etkinlik ilgili kısmın altında. Açmak için karta dokunun.` : "."}</p>
        ${listenBarHtml(c, n)}
        ${c.okunus && "speechSynthesis" in window ? `<p class="muted rp-lead ota-hint">Altı noktalı Osmanlıca kelimelere dokununca okunuşunu dinleyebilirsin.</p>` : ""}
        ${total ? `<div class="rp-progress" aria-live="polite"><span class="rp-bar"><span style="width:0%"></span></span><span class="rp-done">0/${total} etkinlik açıldı</span></div>` : ""}
      </div>
      ${take}${toc}${body}
    </div>`;
  }

  function bindReport() {
    const rp = document.querySelector(".rp");
    if (!rp) return;
    const total = +rp.dataset.rpTotal || 0;
    const paint = () => {
      const done = rp.querySelectorAll(".rp-act.seen").length;
      const bar = rp.querySelector(".rp-bar > span"), lab = rp.querySelector(".rp-done");
      if (bar) bar.style.width = (total ? Math.round((done / total) * 100) : 0) + "%";
      if (lab) lab.textContent = `${done}/${total} etkinlik açıldı`;
    };
    rp.querySelectorAll(".rp-act").forEach((el) => el.addEventListener("toggle", () => {
      if (el.open) { el.classList.add("seen"); paint(); }
    }));
    rp.addEventListener("click", (e) => {
      const go = e.target.closest(".rp-goto");
      if (!go) return;
      const h = document.getElementById(go.dataset.goto);
      if (!h) return;
      h.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      h.focus({ preventScroll: true });
    });
  }

  // Osmanlıca okunuş: .ota.say öğesine dokununca cihazın Türkçe sesiyle okur.
  // Önce cihazda kurulu (localService) Türkçe ses seçilir; o, internetsiz de çalışır.
  function trVoice() {
    const all = speechSynthesis.getVoices().filter((v) => /^tr\b/i.test(v.lang.replace("_", "-")));
    return all.find((v) => v.localService) || all[0] || null;
  }
  // Çeviriyazı işaretlerini sese uygun hâle getirir: ñ → n, ez-ber → ezber, çık- → çık.
  const sayText = (s) => s.replace(/ñ/g, "n").replace(/Ñ/g, "N").replace(/(\p{L})-(?=\p{L})/gu, "$1").replace(/-/g, "");
  let saying = null;
  function speakOta(el) {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (lis && lis.playing) lisStop();
    synth.cancel();
    if (saying) saying.classList.remove("speaking");
    if (saying === el) { saying = null; return; }
    const u = new SpeechSynthesisUtterance(sayText(el.dataset.say));
    u.lang = "tr-TR";
    u.rate = 0.85;
    const v = trVoice();
    if (v) u.voice = v;
    else if (synth.getVoices().length) showToast("Bu cihazda Türkçe okuma sesi bulunamadı. Telefon ayarlarındaki Metin okuma (TTS) bölümünden Türkçe sesi indirebilirsin.");
    const done = () => { el.classList.remove("speaking"); if (saying === el) saying = null; };
    u.onend = done;
    u.onerror = done;
    el.classList.add("speaking");
    saying = el;
    synth.speak(u);
  }
  if ("speechSynthesis" in window) speechSynthesis.getVoices();
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".ota.say");
    if (!el || el.closest("button, label, a, summary")) return;
    e.preventDefault();
    speakOta(el);
  });
  document.addEventListener("keydown", (e) => {
    if ((e.key !== "Enter" && e.key !== " ") || !e.target.matches || !e.target.matches(".ota.say")) return;
    e.preventDefault();
    speakOta(e.target);
  });

  // ---- notları dinle: bölüm raporunu cihazın Türkçe sesiyle okur ---------------------
  // Metin notların paragraflarından toplanır (etkinlik kartları, kaynak işaretleri ve formüller atlanır;
  // Arap harfli Osmanlıca diziler atlanır). Her cümle ayrı okunur, çünkü bazı tarayıcılar uzun metni
  // yarıda keser. Duraklatma, paragraf başından devam eder (Android'de pause/resume güvenilir değil).
  // Konum study.listen["slug:n"] (paragraf sırası), hız study.lrate'te saklanır. Dinlerken ekran
  // açık tutulur (Wake Lock); telefon kilitlenince okuma çoğu tarayıcıda durur.
  const LISTEN_RATES = [0.8, 1, 1.2, 1.5];
  const ICON_PLAY = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l10.5-6.5z"/></svg>`;
  const ICON_PAUSE = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z"/></svg>`;
  const ICON_PREV = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M6 5h2.2v14H6zm3.5 7L19 5.5v13z"/></svg>`;
  const ICON_NEXT = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M15.8 5H18v14h-2.2zM5 5.5l9.5 6.5L5 18.5z"/></svg>`;
  let lis = null; // { key, slug, n, blocks: [{ el, text }], i, playing, token, lock, counted }

  function listenBarHtml(c, n) {
    if (!("speechSynthesis" in window)) return "";
    const pos = (study.listen || {})[`${c.slug}:${n}`] || 0;
    return `<div class="lp" data-lp="${esc(c.slug)}:${n}" data-noprint>
      <button class="btn lp-play" type="button" data-lp-act="play" aria-pressed="false">${ICON_PLAY}<span>${pos ? "Dinlemeye devam et" : "Notları dinle"}</span></button>
      <button class="lp-btn" type="button" data-lp-act="prev" aria-label="Önceki paragraf" disabled>${ICON_PREV}</button>
      <button class="lp-btn" type="button" data-lp-act="next" aria-label="Sonraki paragraf" disabled>${ICON_NEXT}</button>
      <button class="lp-btn lp-rate" type="button" data-lp-act="rate" aria-label="Okuma hızı">${String(study.lrate || 1).replace(".", ",")}×</button>
      <span class="lp-status" aria-live="polite"></span>
    </div>`;
  }

  // Okunacak metin parçaları: rapordaki notların başlık, paragraf, madde ve tablo satırları.
  function listenBlocks(rp) {
    const out = [];
    const textOf = (el) => {
      const clone = el.cloneNode(true);
      clone.querySelectorAll(".inline-cite, sup, .katex, .rp-act, script, style").forEach((x) => x.remove());
      // Notlarda Arap harfli dizinin yanında okunuşu zaten yazılı; diziyi atla (dokununca ayrıca dinlenir).
      clone.querySelectorAll(".ota").forEach((x) => x.replaceWith(" "));
      return clone.textContent.replace(/\u00ad/g, "").replace(/\s+/g, " ").trim();
    };
    rp.querySelectorAll(".rp-sec").forEach((sec) => {
      sec.querySelectorAll(".rp-h, .notes p, .notes li, .notes h1, .notes h2, .notes h3, .notes h4, .notes tr, .notes blockquote").forEach((el) => {
        if (el.closest(".rp-act")) return;
        if (el.matches("li") && el.querySelector("li")) return; // iç içe listede yalnızca yapraklar
        if (el.matches("p") && el.closest("li, blockquote")) return;
        const t = textOf(el);
        if (t && /\p{L}/u.test(t)) out.push({ el, text: t });
      });
    });
    return out;
  }

  // Cümlelere böl, çok kısa cümleleri birleştir, uzunları virgülden kır.
  function listenChunks(text) {
    // Cümle sonu: noktalama + boşluk + büyük harf/tırnak. "16. yüzyıl", "Hz. Ali", "vb." gibi yerlerde bölme.
    const parts = text.split(/(?<=(?<![\s(]\d{1,4}|\b(?:Hz|vb|vs|bkz|Dr|Prof|Doç|Av|yy|s|c|a\.g\.e|M\.Ö|M\.S))[.!?…]["”’)\]]*)\s+(?=["“‘(]?\p{Lu})|(?<=[;:])\s+/u);
    const out = [];
    for (const p of parts) {
      const s = p.trim();
      if (!s) continue;
      if (out.length && (out[out.length - 1].length < 40 || s.length < 12) && out[out.length - 1].length + s.length < 220) out[out.length - 1] += " " + s;
      else if (s.length > 260) out.push(...(s.match(/[^,]{1,240}(,|$)/g) || [s]).map((x) => x.trim()).filter(Boolean));
      else out.push(s);
    }
    return out;
  }

  function lisPaint() {
    const bar = document.querySelector(".lp");
    if (!bar || !lis || bar.dataset.lp !== lis.key) return;
    const play = bar.querySelector(".lp-play");
    play.innerHTML = lis.playing ? `${ICON_PAUSE}<span>Duraklat</span>` : `${ICON_PLAY}<span>${lis.i ? "Dinlemeye devam et" : "Notları dinle"}</span>`;
    play.setAttribute("aria-pressed", String(!!lis.playing));
    bar.querySelector("[data-lp-act=prev]").disabled = !lis.i;
    bar.querySelector("[data-lp-act=next]").disabled = lis.i >= lis.blocks.length - 1;
    bar.querySelector(".lp-status").textContent = `${Math.min(lis.i + 1, lis.blocks.length)}/${lis.blocks.length} paragraf`;
    bar.classList.toggle("on", !!lis.playing);
  }

  async function lisLock(on) {
    if (!lis) return;
    try {
      if (on && !lis.lock && navigator.wakeLock) {
        lis.lock = await navigator.wakeLock.request("screen");
        lis.lock.addEventListener("release", () => { if (lis) lis.lock = null; });
      } else if (!on && lis.lock) { const l = lis.lock; lis.lock = null; await l.release(); }
    } catch (e) { /* desteklenmiyor ya da pil tasarrufu */ }
  }

  function lisSavePos() {
    if (!lis) return;
    study.listen = study.listen || {};
    if (lis.i > 0 && lis.i < lis.blocks.length) study.listen[lis.key] = lis.i;
    else delete study.listen[lis.key];
    saveStudy();
  }

  function lisMark(on) {
    document.querySelectorAll(".lp-on").forEach((x) => x.classList.remove("lp-on"));
    const b = on && lis && lis.blocks[lis.i];
    if (!b) return;
    b.el.classList.add("lp-on");
    const r = b.el.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight - 40) {
      b.el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }
  }

  function lisSpeak() {
    const synth = window.speechSynthesis;
    if (!lis || !synth) return;
    const token = ++lis.token;
    synth.cancel();
    if (lis.i >= lis.blocks.length) return lisFinish();
    lis.playing = true;
    lisMark(true);
    lisPaint();
    const chunks = listenChunks(lis.blocks[lis.i].text);
    const v = trVoice();
    chunks.forEach((t, j) => {
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "tr-TR";
      u.rate = study.lrate || 1;
      if (v) u.voice = v;
      if (j === chunks.length - 1) u.onend = () => {
        if (!lis || lis.token !== token) return;
        lis.i++;
        if (lis.i - (lis.start || 0) >= 3 && !lis.counted) lisCount();
        lisSavePos();
        lisSpeak();
      };
      u.onerror = (e) => {
        if (!lis || lis.token !== token) return;
        // Başka bir okuma (ör. Osmanlıca kelimeye dokunma) araya girdi: dur, konumu koru.
        lis.token++;
        lis.playing = false;
        lisMark(false);
        lisPaint();
        lisLock(false);
        if (e.error && e.error !== "interrupted" && e.error !== "canceled") showToast("Okuma durdu. Tekrar başlatmak için Notları dinle düğmesine dokun.");
      };
      synth.speak(u);
    });
  }

  // Seri ve günlük çalışma için: bir oturumda en az 3 paragraf dinlemek o günü aktif sayar.
  function lisCount() {
    lis.counted = true;
    const key = todayKey(), wasActive = isActive(key);
    const day = dayRec(key);
    day.lis = (day.lis || 0) + 1;
    saveStudy();
    afterActivity(wasActive, key);
  }

  function lisFinish() {
    const { slug, n } = lis;
    lis.playing = false;
    lis.i = 0;
    lisSavePos();
    lisMark(false);
    lisPaint();
    lisLock(false);
    if (!lis.counted) lisCount();
    const c = bySlug[slug];
    const read = readSet(slug).has(n);
    if (!read) showToast("Bölümün notlarını dinleyerek bitirdin.", "Okundu işaretle", () => { setRead(slug, n, true); paintChapterRead(); });
    else if (n < c.chapters.length) showToast("Bölüm bitti.", "Sonraki bölümü dinle", () => { location.hash = `#/course/${slug}/chapter/${n + 1}?dinle=1`; });
  }

  function lisStop() {
    if (!lis) return;
    lis.token++;
    lis.playing = false;
    if (window.speechSynthesis) speechSynthesis.cancel();
    lisSavePos();
    lisMark(false);
    lisPaint();
    lisLock(false);
  }

  function lisInit(bar) {
    const rp = document.querySelector(".rp");
    if (!rp) return false;
    const key = bar.dataset.lp;
    if (!lis || lis.key !== key || !lis.blocks[0] || !document.contains(lis.blocks[0].el)) {
      const [slug, n] = [key.slice(0, key.lastIndexOf(":")), +key.slice(key.lastIndexOf(":") + 1)];
      const blocks = listenBlocks(rp);
      const pos = (study.listen || {})[key] || 0;
      lis = { key, slug, n, blocks, i: pos < blocks.length ? pos : 0, playing: false, token: 0, lock: null, counted: false };
    }
    return lis.blocks.length > 0;
  }
  function lisStart(bar) {
    if (!lisInit(bar)) return;
    lis.start = lis.i;
    if (window.speechSynthesis.getVoices().length && !trVoice()) showToast("Bu cihazda Türkçe okuma sesi bulunamadı. Telefon ayarlarındaki Metin okuma (TTS) bölümünden Türkçe sesi indirebilirsin.");
    lisLock(true);
    lisSpeak();
  }

  function bindListen(query) {
    const bar = document.querySelector(".lp");
    if (!bar) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lp-act]");
      if (!btn) return;
      const act = btn.dataset.lpAct;
      if (act === "rate") {
        const i = LISTEN_RATES.indexOf(study.lrate || 1);
        study.lrate = LISTEN_RATES[(i + 1) % LISTEN_RATES.length];
        saveStudy();
        btn.textContent = String(study.lrate).replace(".", ",") + "×";
        if (lis && lis.playing) lisSpeak();
        return;
      }
      if (act === "play") {
        if (lis && lis.key === bar.dataset.lp && lis.playing) lisStop();
        else lisStart(bar);
        return;
      }
      if (!lis || lis.key !== bar.dataset.lp) return;
      lis.i = Math.max(0, Math.min(lis.blocks.length - 1, lis.i + (act === "next" ? 1 : -1)));
      lisSavePos();
      if (lis.playing) lisSpeak();
      else { lisMark(true); lisPaint(); }
    });
    // Bir paragrafa uzun basmadan, çift dokunarak oradan dinlemeye başla.
    document.querySelector(".rp").addEventListener("dblclick", (e) => {
      if (e.target.closest("a, button, summary, .rp-act, .ota.say") || !lisInit(bar)) return;
      const i = lis.blocks.findIndex((b) => b.el.contains(e.target));
      if (i < 0) return;
      lis.i = lis.start = i;
      lisLock(true);
      lisSpeak();
    });
    if (lis && lis.key === bar.dataset.lp) lisPaint();
    if (query && query.dinle) lisStart(bar);
  }

  // Sekme arka plana geçip geri gelince okuma kesilmişse kaldığı paragraftan sürdür.
  document.addEventListener("visibilitychange", () => {
    if (!lis || !lis.playing) return;
    if (document.visibilityState === "visible") {
      lisLock(true);
      setTimeout(() => { if (lis && lis.playing && !speechSynthesis.speaking) lisSpeak(); }, 400);
    }
  });

  // Bölüm sayfasının sonundaki "Okudum" düğmesi (sınav planı okunan bölümleri buradan sayar).
  function chapterReadHtml(c, n) {
    const on = readSet(c.slug).has(n);
    return `<button class="btn ghost ch-read${on ? " is-read" : ""}" type="button" data-ch-read="${esc(c.slug)}:${n}" aria-pressed="${on}">${on ? "✓ Okudum, geri al" : "Bu bölümü okudum"}</button>`;
  }
  function paintChapterRead() {
    document.querySelectorAll("[data-ch-read]").forEach((b) => {
      const [slug, n] = [b.dataset.chRead.slice(0, b.dataset.chRead.lastIndexOf(":")), +b.dataset.chRead.split(":").pop()];
      const on = readSet(slug).has(n);
      b.classList.toggle("is-read", on);
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "✓ Okudum, geri al" : "Bu bölümü okudum";
    });
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ch-read]");
    if (!b) return;
    const key = b.dataset.chRead, i = key.lastIndexOf(":");
    const slug = key.slice(0, i), n = +key.slice(i + 1);
    setRead(slug, n, !readSet(slug).has(n));
    paintChapterRead();
  });

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
      detail.innerHTML = item ? `<h4>${txtPlain(item.label)}</h4><p>${txtPlain(item.desc)}</p>` +
        ((item.branches || []).length ? `<ul class="tree-branches">${item.branches.map((b) => `<li><strong>${txtPlain(b.label)}:</strong> ${txtPlain(b.d)}</li>`).join("")}</ul>` : "") : "";
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
      fb.innerHTML = `<strong>${ok ? "Doğru." : "Yanlış."}</strong> ${txtPlain(item.why || "")}`;
      q.querySelectorAll("input").forEach((x) => (x.disabled = true));
      check.disabled = true;
      return;
    }
  });

  function viewSummary() {
    if (!COURSES.length) return `<p class="eyebrow">Hızlı tekrar</p><h1>Ders özetleri</h1><p class="muted">Henüz ders eklenmemiş.</p>`;

    // Not gövdesinden düz metin alıntı: markdown işaretlerini temizler, uzunlukta keser.
    function notesExcerpt(ch, max) {
      const raw = String(ch.notes || "").replace(/⟦\d+⟧/g, "");
      const lines = raw.split(/\n+/)
        .map((l) => l.replace(/^#{1,6}\s*/, "").replace(/\*\*/g, "").replace(/^\s*[-*]\s+/, "").trim())
        .filter((l) => l.length > 24); // başlık/etiket kısayollarını at
      let out = lines.join(" · ");
      if (!out) return "";
      if (out.length > (max || 520)) out = out.slice(0, max || 520).replace(/\s+\S*$/, "") + "…";
      return out;
    }

    // Açılan bölümün altını dolduran içerik: not alıntısı, çıkmış vize linkleri, ünite quiz.
    function bodyFooter(c, n) {
      const ch = c.chapters[n - 1];
      const excerpt = notesExcerpt(ch, 520);
      const cites = chapterPastCites(c, n, 4);
      const uq = unitQuizMap(c.slug)[String(n)];
      const bits = [];
      if (excerpt) bits.push(`<p class="sm-label">Çalışma notundan</p><p class="sm-note-excerpt">${esc(excerpt)}</p>`);
      if (cites.length) {
        const items = cites.map((ct, j) => {
          const short = ct.stem.length > 92 ? ct.stem.slice(0, 89).trimEnd() + "…" : ct.stem;
          return `<li class="cite-item"><a class="cite-link" href="${citeHref(c.slug, ct)}" title="${esc(ct.stem)}"><sup class="cite-num">[${j + 1}]</sup> <span class="cite-year">${esc(ct.year)}</span> · Soru ${ct.num}<span class="cite-stem">${esc(short)}</span></a></li>`;
        }).join("");
        bits.push(`<p class="sm-label">Çıkmış vize alıntıları</p><ul class="cite-list">${items}</ul>`);
      }
      const links = [
        uq ? `<a class="btn ghost" href="#/course/${c.slug}/unit-quiz/${n}">Ünite ${n} quiz (${(uq.questions || []).length} soru)</a>` : "",
        cites.length ? `<a class="btn ghost" href="${citeHref(c.slug, cites[0])}">Çıkmış vize çöz</a>` : "",
        (c.quiz || []).length ? `<a class="btn ghost" href="#/course/${c.slug}/quiz">Final sınavı</a>` : "",
      ].filter(Boolean);
      return bits.join("") + (links.length ? `<div class="btn-row sm-quick">${links.join("")}</div>` : "");
    }

    const totalCh = COURSES.reduce((n, c) => n + c.chapters.length, 0);
    const done = COURSES.reduce((n, c) => n + readCount(c), 0);
    const chips = COURSES.map((c, i) => `<button class="chip${i === 0 ? " active" : ""}" type="button" data-filter="${esc(c.slug)}" aria-pressed="${i === 0}">${esc(c.subject)}</button>`).join("");
    const sections = COURSES.map((c) => {
      const rs = readSet(c.slug);
      const items = c.chapters.map((ch, i) => {
        const n = i + 1, isRead = rs.has(n);
        const hay = norm([ch.title, ch.summary, (ch.objectives || []).join(" "), String(ch.notes || "").replace(/⟦\d+⟧/g, "")].join(" "));
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
            ${bodyFooter(c, n)}
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
      const head = e.target.closest(".sm-head");
      if (head) {
        const open = head.getAttribute("aria-expanded") === "true";
        head.setAttribute("aria-expanded", String(!open));
        const body = document.getElementById(head.getAttribute("aria-controls"));
        if (body) body.hidden = open;
        return;
      }
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
      <div class="btn-row"><button class="btn" type="button" id="cert-share">Belgeyi paylaş</button><a class="btn ghost" id="cert-dl" download="tamamlama-belgesi.png" href="#">PNG olarak indir</a></div>
      <p class="muted" style="font-size:.88rem">Paylaş düğmesi telefonunda WhatsApp, Instagram gibi uygulamaları açar. Bilgisayarda belge indirilir.</p>`;
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
    const dl = document.getElementById("cert-dl");
    dl.addEventListener("click", () => { dl.href = document.getElementById("cert").toDataURL("image/png"); });
    document.getElementById("cert-share").onclick = () => {
      document.getElementById("cert").toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "tamamlama-belgesi.png", { type: "image/png" });
        const text = `${CONFIG.name} çalışma programını tamamladım.`;
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], title: "Tamamlama Belgesi", text }); return; } catch (e) { if (e && e.name === "AbortError") return; }
        }
        dl.href = URL.createObjectURL(blob);
        dl.click();
        showToast("Belge indirildi.");
      }, "image/png");
    };
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
    const order = ["course", "chapter", "concept", "quiz_question", "unit_quiz_question", "past_question", "exam_question", "unit", "unit_quiz", "keyword", "event", "artifact", "past_exam"];
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

  // ---- zoom (popup pencere) --------------------------------------
  function openZoomPopup(src, alt) {
    const w = 1100, h = 900;
    const left = Math.max(0, (screen.width - w) / 2);
    const top = Math.max(0, (screen.height - h) / 2);
    const win = window.open("", "infografik_zoom", `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
    if (!win) return;
    const dl = esc(src);
    const safeAlt = esc(alt || "İnfografik");
    win.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${safeAlt}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:#1a1f2e;color:#e8ecf4;min-height:100vh}
.bar{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:8px;padding:10px 16px;background:#232a3b;border-bottom:1px solid #36405a}
.bar .title{flex:1;font-size:13px;font-weight:600;opacity:.85;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
button,a.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;border:1px solid #4a5570;background:#2d3548;color:#e8ecf4;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none}
button:hover,a.btn:hover{background:#39435c}
a.btn{background:#2563eb;border-color:#2563eb}
a.btn:hover{background:#1d4ed8}
.wrap{display:flex;justify-content:center;padding:20px;overflow:auto}
img{max-width:none;transform-origin:top center;transition:transform .12s ease;border-radius:4px;box-shadow:0 8px 32px rgba(0,0,0,.5)}
</style></head><body>
<div class="bar">
  <span class="title">${safeAlt}</span>
  <button type="button" id="zout" title="Uzaklaştır">−</button>
  <span id="pct" style="min-width:44px;text-align:center;font-size:13px;font-weight:700">100%</span>
  <button type="button" id="zin" title="Yakınlaştır">+</button>
  <button type="button" id="zreset" title="Sıfırla">1:1</button>
  <a class="btn" href="${dl}" download>İndir</a>
</div>
<div class="wrap"><img id="zimg" src="${dl}" alt="${safeAlt}"></div>
<script>
var s=1,img=document.getElementById("zimg"),pct=document.getElementById("pct");
function ap(){img.style.transform="scale("+s+")";pct.textContent=Math.round(s*100)+"%"}
document.getElementById("zin").onclick=function(){s=Math.min(6,s*1.25);ap()};
document.getElementById("zout").onclick=function(){s=Math.max(.2,s/1.25);ap()};
document.getElementById("zreset").onclick=function(){s=1;ap()};
document.addEventListener("keydown",function(e){
  if(e.key==="+"||e.key==="="){s=Math.min(6,s*1.25);ap()}
  else if(e.key==="-"||e.key==="_"){s=Math.max(.2,s/1.25);ap()}
  else if(e.key==="0"){s=1;ap()}
});
img.ondblclick=function(e){e.preventDefault();var r=img.getBoundingClientRect();var f=s>1?1:2;s=f;ap()};
document.addEventListener("keydown",function(e){if(e.key==="Escape")window.close()});
document.getElementById("zin").focus();
</script></body></html>`);
    win.document.close();
  }

  document.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-zoom]");
    if (img) {
      e.preventDefault();
      openZoomPopup(img.getAttribute("data-full") || img.src, img.alt);
      return;
    }
    const more = e.target.closest("[data-more-pages]");
    if (more) {
      const tpl = more.previousElementSibling;
      if (tpl && tpl.tagName === "TEMPLATE") tpl.replaceWith(tpl.content);
      more.remove();
      return;
    }
    const tab = e.target.closest(".inf-tab");
    if (tab) {
      const group = tab.closest(".inf-toggle");
      if (!group) return;
      group.querySelectorAll(".inf-tab").forEach((b) => b.classList.remove("is-active"));
      group.querySelectorAll(".inf-pane").forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      const pane = group.querySelector("#" + CSS.escape(tab.dataset.pane));
      if (pane) pane.classList.add("is-active");
    }
  });

  // ---- çevrimdışı kullanım: ders paketleri, kurulum, yedek ---------------------------
  // Görseller ders başına "pu-pack-<ders>" önbelleğine indirilir; sw.js oradan sunar.
  // Paket listesi (yol, içerik özeti, bayt) build.py tarafından window.OFFLINE içine yazılır.
  const PACKS = (window.OFFLINE && window.OFFLINE.packs) || {};
  const PACK_PREFIX = "pu-pack-";
  const REV_HEADER = "X-PU-Rev";
  const canCache = "caches" in window && /^https?:$/.test(location.protocol);
  const packUrl = (path) => new URL(path, location.origin + location.pathname).href;
  const mb = (bytes) => (bytes / 1048576).toLocaleString("tr-TR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + " MB";
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let installEvent = null;
  const activeDownloads = {}; // slug -> { done, total }

  async function packStatus(slug) {
    const pack = PACKS[slug];
    if (!pack || !canCache) return null;
    const files = pack.files.length;
    if (!(await caches.has(PACK_PREFIX + slug))) return { ready: 0, files, missingBytes: pack.bytes };
    const cache = await caches.open(PACK_PREFIX + slug);
    let ready = 0, missingBytes = 0;
    for (const [path, rev, bytes] of pack.files) {
      const hit = await cache.match(packUrl(path));
      if (hit && hit.headers.get(REV_HEADER) === rev) ready++;
      else missingBytes += bytes;
    }
    return { ready, files, missingBytes };
  }

  async function requestPersist() {
    try {
      if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist();
    } catch (e) { /* desteklenmiyor */ }
  }

  async function downloadPack(slug, onProgress) {
    const pack = PACKS[slug];
    const cache = await caches.open(PACK_PREFIX + slug);
    const queue = [];
    let total = 0, done = 0;
    for (const f of pack.files) {
      const hit = await cache.match(packUrl(f[0]));
      if (!(hit && hit.headers.get(REV_HEADER) === f[1])) { queue.push(f); total += f[2]; }
    }
    onProgress(0, total);
    const worker = async () => {
      while (queue.length) {
        const [path, rev, bytes] = queue.shift();
        const res = await fetch(path + "?v=" + rev, { cache: "no-store" });
        if (!res.ok) throw new Error("İndirilemedi: " + path);
        const headers = new Headers(res.headers);
        headers.set(REV_HEADER, rev);
        await cache.put(packUrl(path), new Response(await res.blob(), { status: 200, headers }));
        done += bytes;
        onProgress(done, total);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    const keep = new Set(pack.files.map((f) => packUrl(f[0])));
    for (const req of await cache.keys()) if (!keep.has(req.url)) await cache.delete(req);
    await requestPersist();
  }

  function packRowHtml(c) {
    const pack = PACKS[c.slug];
    if (!pack) return "";
    return `<div class="pack" data-pack="${esc(c.slug)}">
        <div class="pack-text"><b>${esc(c.subject)}</b><span class="muted" data-pack-info>${pack.files.length} görsel · ${mb(pack.bytes)}</span></div>
        <div class="pack-bar" hidden><i></i></div>
        <div class="pack-actions" data-pack-actions></div>
      </div>`;
  }

  function offlineCourseCardHtml(c) {
    if (!PACKS[c.slug] || !canCache) return "";
    return `<section class="offline-card"><p class="eyebrow">Çevrimdışı</p>
      <p>Ders notları, testler ve çıkmış sorular siteyi bir kez açınca bu cihaza kaydedilir. Görselleri de internetsiz görmek için dersi indirin.</p>
      ${packRowHtml(c)}
      <p class="muted small"><a href="#/cevrimdisi">Tüm dersler, yedek ve kurulum</a></p></section>`;
  }

  async function paintPack(el) {
    const slug = el.dataset.pack;
    const info = el.querySelector("[data-pack-info]");
    const actions = el.querySelector("[data-pack-actions]");
    const bar = el.querySelector(".pack-bar");
    const pack = PACKS[slug];
    const dl = activeDownloads[slug];
    if (dl) {
      bar.hidden = false;
      bar.querySelector("i").style.width = (dl.total ? (dl.done / dl.total) * 100 : 0) + "%";
      info.textContent = `İndiriliyor: ${mb(dl.done)} / ${mb(dl.total)}`;
      actions.innerHTML = "";
      return;
    }
    bar.hidden = true;
    let st = null;
    try { st = await packStatus(slug); } catch (e) { st = null; }
    if (!st) { info.textContent = "Bu tarayıcı indirmeyi desteklemiyor."; actions.innerHTML = ""; return; }
    if (st.ready === st.files) {
      info.innerHTML = `<span class="badge pass">İndirildi</span> ${pack.files.length} görsel · ${mb(pack.bytes)}`;
      actions.innerHTML = `<button class="btn ghost" data-pack-del>Sil</button>`;
    } else if (st.ready > 0) {
      info.innerHTML = `<span class="badge fail">Güncelleme var</span> ${mb(st.missingBytes)} indirilecek`;
      actions.innerHTML = `<button class="btn" data-pack-get>Güncelle</button><button class="btn ghost" data-pack-del>Sil</button>`;
    } else {
      info.textContent = `${pack.files.length} görsel · ${mb(pack.bytes)}`;
      actions.innerHTML = `<button class="btn" data-pack-get>İndir</button>`;
    }
  }

  function paintPacks() {
    document.querySelectorAll("[data-pack]").forEach((el) => { paintPack(el); });
  }

  document.addEventListener("click", async (e) => {
    const get = e.target.closest("[data-pack-get]");
    const del = e.target.closest("[data-pack-del]");
    if (!get && !del) return;
    const slug = e.target.closest("[data-pack]").dataset.pack;
    if (del) {
      await caches.delete(PACK_PREFIX + slug);
      paintPacks();
      paintStorage();
      return;
    }
    if (activeDownloads[slug]) return;
    if (navigator.onLine === false) { showToast("İndirmek için internet bağlantısı gerekiyor."); return; }
    activeDownloads[slug] = { done: 0, total: 0 };
    paintPacks();
    try {
      await downloadPack(slug, (done, total) => { activeDownloads[slug] = { done, total }; paintPacks(); });
      delete activeDownloads[slug];
      showToast(`${bySlug[slug] ? bySlug[slug].subject : "Ders"} indirildi. Görseller artık internetsiz de açılır.`);
    } catch (err) {
      delete activeDownloads[slug];
      const full = err && (err.name === "QuotaExceededError" || /quota/i.test(String(err.message)));
      showToast(full ? "Cihazda yer kalmadı. Başka bir dersi silip tekrar deneyin."
        : "İndirme yarıda kaldı. Bağlantı gelince tekrar dokunun; indirilenler korunur.");
    }
    paintPacks();
    paintStorage();
  });

  async function paintStorage() {
    const el = document.getElementById("storage-info");
    if (!el) return;
    const parts = [];
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        parts.push(`Bu site cihazınızda ${mb(est.usage || 0)} yer kullanıyor.`);
      }
      if (navigator.storage && navigator.storage.persisted) {
        parts.push((await navigator.storage.persisted())
          ? "Tarayıcı bu verileri kalıcı olarak saklıyor."
          : "Tarayıcı yer açmak için bu verileri silebilir; ana ekrana eklemek bunu önler.");
      }
    } catch (e) { /* bilgi yok */ }
    el.textContent = parts.join(" ");
  }

  function installHtml() {
    if (isStandalone()) return `<p><span class="badge pass">Kurulu</span> Site uygulama olarak açık.</p>`;
    if (installEvent) return `<p>Siteyi telefonunuza uygulama gibi kurun. Ana ekrandan tek dokunuşla, internetsiz açılır.</p>
      <div class="btn-row"><button class="btn" id="install-btn">Uygulamayı yükle</button></div>`;
    if (isIOS) return `<p>iPhone ve iPad'de siteyi ana ekrana ekleyin. Safari, ana ekrana eklenmemiş sitelerin kayıtlı verilerini bir süre girilmeyince silebiliyor; ana ekrandaki uygulama bundan korunur.</p>
      <ol class="steps"><li>Safari'de alttaki <b>Paylaş</b> düğmesine dokunun.</li><li><b>Ana Ekrana Ekle</b>'yi seçin.</li><li>Sonra siteyi ana ekrandaki simgeden açın ve dersleri oradan indirin.</li></ol>`;
    return `<p>Tarayıcı menüsünden <b>Uygulamayı yükle</b> ya da <b>Ana ekrana ekle</b>'yi seçerek siteyi uygulama gibi kurabilirsiniz.</p>`;
  }

  function viewOffline() {
    const rows = COURSES.map(packRowHtml).join("");
    return `<p class="eyebrow">İnternetsiz çalışma</p><h1>Çevrimdışı kullanım</h1>
      <p class="lead muted">Siteyi bir kez açtığınızda ders notları, testler, çıkmış sorular ve arama bu cihaza kaydedilir. İnfografikler büyük olduğu için ders ders indirilir.</p>
      <p id="shell-state" class="muted">${canCache ? "Kontrol ediliyor…" : "Bu tarayıcı çevrimdışı kaydı desteklemiyor."}</p>
      <h2>Ders görselleri</h2>
      ${canCache ? `<div class="packs">${rows}</div><p class="muted small" id="storage-info"></p>` : ""}
      <h2>Uygulama olarak kurun</h2>
      <div id="install-box">${installHtml()}</div>
      <h2 id="yedek">İlerleme yedeği</h2>
      <p>Test sonuçlarınız ve okuduğunuz bölümler yalnızca bu tarayıcıda durur. Telefon değiştirirken ya da tarayıcı verileri silinmeden önce yedek alın.</p>
      <div class="btn-row"><button class="btn" id="backup-dl">Yedek dosyası indir</button><button class="btn ghost" id="backup-copy">Yedek kodunu kopyala</button></div>
      <details class="backup-in"><summary>Yedeği geri yükle</summary>
        <p class="muted small">Yedek dosyasını seçin ya da kopyaladığınız kodu yapıştırın. Mevcut ilerlemenizle birleştirilir; hiçbir sonuç silinmez.</p>
        <input type="file" id="backup-file" accept="application/json,.json">
        <textarea id="backup-text" rows="4" placeholder="Yedek kodunu buraya yapıştırın"></textarea>
        <div class="btn-row"><button class="btn" id="backup-restore">Geri yükle</button></div>
        <p id="backup-msg" class="muted small" role="status"></p>
      </details>`;
  }

  function backupJson() {
    let name = "";
    try { name = localStorage.getItem(CONFIG.storageKey + ".name") || ""; } catch (e) { /* yok */ }
    return JSON.stringify({ app: CONFIG.storageKey, savedAt: new Date().toISOString(), progress, name, study });
  }

  // Aynı dersin iki kaydını birleştirir: sayılarda büyük olan, listelerde birleşim; bestTimeMs'te küçük olan.
  function mergeRecord(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) return Array.from(new Set(a.concat(b))).sort((x, y) => x - y);
    if (a && b && typeof a === "object" && typeof b === "object") {
      const out = Object.assign({}, a);
      for (const k of Object.keys(b)) {
        if (!(k in a)) out[k] = b[k];
        else if (k === "bestTimeMs" && typeof a[k] === "number" && typeof b[k] === "number") out[k] = Math.min(a[k] || b[k], b[k] || a[k]);
        else if (typeof a[k] === "number" && typeof b[k] === "number") out[k] = Math.max(a[k], b[k]);
        else if (typeof a[k] === "boolean") out[k] = a[k] || !!b[k];
        else out[k] = mergeRecord(a[k], b[k]);
      }
      return out;
    }
    return a === undefined ? b : a;
  }

  // Tekrar geçmişi: kartta en son tekrar edilen sürüm, günlerde alan alan büyük olan kazanır.
  function mergeStudy(b) {
    for (const [id, card] of Object.entries(b.cards || {})) {
      const a = study.cards[id];
      if (!a || (card && card.last > a.last)) study.cards[id] = card;
    }
    for (const [k, day] of Object.entries(b.days || {})) study.days[k] = study.days[k] ? mergeRecord(study.days[k], day) : day;
    study.frozen = Array.from(new Set(study.frozen.concat(b.frozen || []))).sort();
    const byT = (list) => Array.from(new Map(list.map((x) => [Array.isArray(x) ? x[0] + x[1] : x.t, x])).values()).sort((x, y) => (x.t || x[0]) - (y.t || y[0]));
    study.log = byT(study.log.concat(b.log || [])).slice(-3000);
    study.mocks = byT(study.mocks.concat(b.mocks || [])).slice(-100);
    // Videolar: konumda en son izlenen kayıt kazanır, notlar birleşir.
    for (const [id, v] of Object.entries(b.videos || {})) {
      const a = study.videos[id];
      if (!v || typeof v !== "object") continue;
      const notes = Array.from(new Map(((a && a.notes) || []).concat(v.notes || []).map((n) => [n.t + "|" + n.s, n])).values()).sort((x, y) => x.t - y.t);
      study.videos[id] = Object.assign({}, !a || (v.at || 0) > (a.at || 0) ? v : a, { done: !!((a && a.done) || v.done), notes });
    }
    // Sınav planı ve dinleme konumu: bu cihazda yoksa yedekten gelir.
    if (!study.plan && b.plan && typeof b.plan === "object") study.plan = b.plan;
    study.listen = Object.assign({}, b.listen || {}, study.listen || {});
    saveStudy();
  }

  function restoreBackup(text) {
    let data;
    try { data = JSON.parse(String(text).trim()); } catch (e) { return "Bu bir yedek kodu değil. Kodun tamamını yapıştırdığınızdan emin olun."; }
    if (!data || typeof data.progress !== "object" || data.progress === null) return "Yedekte ilerleme bilgisi bulunamadı.";
    for (const [slug, rec] of Object.entries(data.progress)) {
      if (!rec || typeof rec !== "object") continue;
      progress[slug] = progress[slug] ? mergeRecord(progress[slug], rec) : rec;
    }
    save(progress);
    if (data.study && typeof data.study === "object") mergeStudy(data.study);
    try {
      if (data.name && !localStorage.getItem(CONFIG.storageKey + ".name")) localStorage.setItem(CONFIG.storageKey + ".name", data.name);
    } catch (e) { /* yok */ }
    return "";
  }

  function bindOffline() {
    paintPacks();
    paintStorage();
    const shell = document.getElementById("shell-state");
    if (shell && canCache && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        shell.innerHTML = reg && reg.active
          ? `<span class="badge pass">Hazır</span> Notlar, testler ve çıkmış sorular bu cihazda kayıtlı.`
          : "Site bu cihaza kaydediliyor. Birkaç saniye sonra bu sayfayı yeniden açın.";
      });
    }
    const ib = document.getElementById("install-btn");
    if (ib) ib.onclick = async () => {
      if (!installEvent) return;
      installEvent.prompt();
      try { await installEvent.userChoice; } catch (e) { /* kapatıldı */ }
      installEvent = null;
      const box = document.getElementById("install-box");
      if (box) box.innerHTML = installHtml();
    };
    const dl = document.getElementById("backup-dl");
    if (dl) dl.onclick = () => {
      const blob = new Blob([backupJson()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "acik-ilahiyat-yedek-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    };
    const cp = document.getElementById("backup-copy");
    if (cp) cp.onclick = async () => {
      const text = backupJson();
      try { await navigator.clipboard.writeText(text); showToast("Yedek kodu kopyalandı. Kendinize WhatsApp'tan ya da e-postayla gönderebilirsiniz."); }
      catch (e) { const t = document.getElementById("backup-text"); t.value = text; t.closest("details").open = true; t.select(); showToast("Kod aşağıda seçili; kopyalayın."); }
    };
    const file = document.getElementById("backup-file");
    if (file) file.onchange = () => {
      const f = file.files && file.files[0];
      if (!f) return;
      f.text().then((t) => { document.getElementById("backup-text").value = t; });
    };
    const rs = document.getElementById("backup-restore");
    if (rs) rs.onclick = () => {
      const msg = document.getElementById("backup-msg");
      const err = restoreBackup(document.getElementById("backup-text").value);
      msg.textContent = err || "Yedek yüklendi. Transkriptinizde görebilirsiniz.";
    };
    const q = parseLoc().query;
    if (q.b) { const t = document.getElementById(q.b); if (t) setTimeout(() => t.scrollIntoView(), 0); }
  }

  // Katalogda bir kez gösterilen kurulum ipucu (iOS'ta veri silinmesine karşı en etkili önlem).
  function installBannerHtml() {
    let dismissed = false;
    try { dismissed = localStorage.getItem(CONFIG.storageKey + ".installHint") === "0"; } catch (e) { /* yok */ }
    if (dismissed || isStandalone() || !(isIOS || installEvent)) return "";
    return `<div class="notice" id="install-hint"><span>Siteyi ana ekrana ekleyin: internetsiz açılır, ilerlemeniz korunur.</span>
      <a class="btn" href="#/cevrimdisi">Nasıl?</a><button class="btn ghost" id="install-hint-x" aria-label="İpucunu kapat">Kapat</button></div>`;
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#install-hint-x")) return;
    try { localStorage.setItem(CONFIG.storageKey + ".installHint", "0"); } catch (err) { /* yok */ }
    const h = document.getElementById("install-hint");
    if (h) h.remove();
  });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installEvent = e;
    const box = document.getElementById("install-box");
    if (box) { box.innerHTML = installHtml(); bindOffline(); }
  });
  window.addEventListener("appinstalled", () => { installEvent = null; });

  let toastTimer = null;
  function showToast(message, actionLabel, action) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.innerHTML = `<span>${esc(message)}</span>${actionLabel ? `<button class="btn" type="button">${esc(actionLabel)}</button>` : ""}<button class="toast-x" type="button" aria-label="Kapat">×</button>`;
    t.hidden = false;
    const btn = t.querySelector(".btn");
    if (btn) btn.onclick = () => { t.hidden = true; action(); };
    t.querySelector(".toast-x").onclick = () => { t.hidden = true; };
    clearTimeout(toastTimer);
    if (!actionLabel) toastTimer = setTimeout(() => { t.hidden = true; }, 6000);
  }

  function setupServiceWorker() {
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
    let updating = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (updating) location.reload();
    });
    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).then((reg) => {
      const offer = (w) => showToast("Sitenin yeni sürümü hazır.", "Yenile", () => {
        updating = true;
        w.postMessage({ type: "SKIP_WAITING" });
      });
      if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const w = reg.installing;
        if (!w) return;
        w.addEventListener("statechange", () => {
          if (w.state !== "installed") return;
          if (navigator.serviceWorker.controller) offer(w);
          else showToast("Site bu cihaza kaydedildi; artık internet olmadan da açılır.", "Görseller", () => { location.hash = "#/cevrimdisi"; });
        });
      });
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reg.update().catch(() => {});
      });
    }).catch(() => { /* kayıt başarısız: site yine çalışır */ });
  }

  // ---- ders videoları: tıklayınca yüklenen YouTube oynatıcısı ----------------------
  // Sayfa açılırken yalnızca kapak resmi gelir; oynatıcı ancak "Oynat"a basınca yüklenir
  // (youtube-nocookie). Kaldığın yer, hız ve zaman damgalı notlar study.videos içinde, yedeğe dahil.
  const ytId = (u) => { const m = String(u || "").match(/(?:[?&]v=|youtu\.be\/|\/embed\/|\/shorts\/)([\w-]{11})/); return m ? m[1] : ""; };
  function ytStart(u) {
    const m = String(u || "").match(/[?&#](?:t|start)=([0-9hms]+)/);
    if (!m) return 0;
    if (/^\d+$/.test(m[1])) return +m[1];
    const p = m[1].match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/) || [];
    return (+p[1] || 0) * 3600 + (+p[2] || 0) * 60 + (+p[3] || 0);
  }
  function fmtClock(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
  }
  // Dersin YouTube videoları, bölüm sırasıyla (aynı video iki bölümde geçiyorsa bir kez).
  function courseVideos(c) {
    const seen = new Set(), out = [];
    c.chapters.forEach((ch, i) => (ch.lectures || []).forEach((l) => {
      const id = ytId(l.url);
      if (!id || seen.has(id)) return;
      seen.add(id);
      out.push({ id, title: l.title || "Video", url: l.url, ch: i + 1, chTitle: ch.title, start: ytStart(l.url) });
    }));
    return out;
  }
  const vidRec = (id) => (study.videos[id] || (study.videos[id] = { t: 0, d: 0, done: false, at: 0, notes: [] }));
  const vidPeek = (id) => study.videos[id] || null;
  const vidFrac = (r) => (r && r.done ? 1 : r && r.d ? Math.min(1, r.t / r.d) : 0);
  const VID_RATES = [1, 1.25, 1.5, 1.75, 2];
  const PLAY_SVG = `<svg viewBox="0 0 68 48" aria-hidden="true"><path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.3 34 .3 34 .3s-21.2 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.8 47.7 34 47.7 34 47.7s21.2 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" fill="currentColor"/><path d="M45 24 27 14v20z" fill="#fff"/></svg>`;

  function videoListHtml(list, current, grouped) {
    let lastCh = 0;
    return list.map((v, i) => {
      const r = vidPeek(v.id), f = vidFrac(r);
      const head = grouped && v.ch !== lastCh ? `<li class="vid-group">${v.ch}. bölüm · ${esc(v.chTitle)}</li>` : "";
      lastCh = v.ch;
      const state = r && r.done ? "izlendi" : f > 0.02 ? fmtClock(r.t) + " / " + fmtClock(r.d) : "";
      return `${head}<li><button type="button" class="vid-item${v.id === current ? " on" : ""}${r && r.done ? " done" : ""}" data-pick="${v.id}"${v.id === current ? ' aria-current="true"' : ""}>
        <span class="vid-n" aria-hidden="true">${r && r.done ? "✓" : i + 1}</span>
        <span class="vid-t">${esc(v.title)}${state ? `<small>${state}</small>` : ""}<i class="vid-prog" style="--p:${Math.round(f * 100)}%"></i></span>
      </button></li>`;
    }).join("");
  }

  function videoNotesHtml(id) {
    const r = vidPeek(id);
    const notes = (r && r.notes) || [];
    return notes.length
      ? `<ul class="vid-notes">${notes.map((n, i) => `<li><button type="button" class="vid-stamp" data-seek="${n.t}" aria-label="${fmtClock(n.t)} anına git">${fmtClock(n.t)}</button><span>${txt(n.s)}</span><button type="button" class="vid-del" data-del-note="${i}" aria-label="Notu sil">×</button></li>`).join("")}</ul>`
      : `<p class="muted small">Henüz not yok. Video oynarken bir şey yazıp "Not ekle"ye bas; not o saniyeyle kaydedilir, dokununca videoda oraya gidersin.</p>`;
  }

  // Oynatıcı kutusu: önce yalnızca kapak (thumbnail + oynat düğmesi), iframe tıklamada gelir.
  function videoPlayerHtml(c, list, opts) {
    if (!list.length) return "";
    opts = opts || {};
    const cur = list.find((v) => v.id === opts.current) || list.find((v) => !(vidPeek(v.id) || {}).done) || list[0];
    const r = vidPeek(cur.id);
    const resume = opts.t != null ? opts.t : r && !r.done && r.t > 5 ? r.t : cur.start;
    const watched = list.filter((v) => (vidPeek(v.id) || {}).done).length;
    return `<section class="vid" data-vid-root data-course="${c.slug}"${opts.chapter ? ` data-chapter="${opts.chapter}"` : ""} data-current="${cur.id}" data-start="${Math.floor(resume || 0)}"${opts.page ? " data-page" : ""}>
      <div class="vid-main">
        <div class="vid-frame" data-vid-frame>${videoFacadeHtml(cur, resume)}</div>
        <div class="vid-bar">
          <p class="vid-title" data-vid-title>${esc(cur.title)}</p>
          <div class="vid-ctl">
            <div class="pill-group vid-rate" role="group" aria-label="Oynatma hızı">${VID_RATES.map((x) => `<button type="button" data-rate="${x}" aria-pressed="${x === (study.vrate || 1)}">${String(x).replace(".", ",")}×</button>`).join("")}</div>
            <a class="btn ghost sm-mini" data-vid-yt href="https://www.youtube.com/watch?v=${cur.id}" target="_blank" rel="noopener">YouTube'da aç</a>
          </div>
          <form class="vid-note-form" data-vid-note autocomplete="off">
            <label class="sr-only" for="vid-note-in">Bu ana not</label>
            <input id="vid-note-in" maxlength="200" placeholder="Bu ana not yaz…">
            <button class="btn sm-mini" type="submit">Not ekle <span data-vid-now>${fmtClock(resume)}</span></button>
          </form>
          <div data-vid-notes>${videoNotesHtml(cur.id)}</div>
        </div>
      </div>
      <div class="vid-side">
        <p class="vid-sum"><b>${watched}/${list.length}</b> video izlendi${list.length > 1 ? `<label class="chk-inline"><input type="checkbox" data-autonext${study.vauto !== false ? " checked" : ""}> sonrakine otomatik geç</label>` : ""}</p>
        <ol class="vid-list" data-vid-list>${videoListHtml(list, cur.id, opts.page)}</ol>
      </div>
    </section>`;
  }

  function videoFacadeHtml(v, t) {
    return `<button type="button" class="vid-facade" data-vid-play aria-label="${esc(v.title)} videosunu oynat${t > 5 ? ", " + fmtClock(t) + " anından devam" : ""}">
      <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      <span class="vid-play">${PLAY_SVG}</span>
      <span class="vid-cap">${t > 5 ? `Kaldığın yerden devam · ${fmtClock(t)}` : "Oynat"}</span>
    </button>`;
  }

  let vp = null; // etkin oynatıcı: { root, iframe, id, t, d, state, ready, lastSave }
  function vpPost(func, args) {
    if (!vp || !vp.iframe || !vp.iframe.contentWindow) return;
    vp.iframe.contentWindow.postMessage(JSON.stringify(func === "listening" ? { event: "listening", id: 1, channel: "widget" } : { event: "command", func, args: args || [] }), "*");
  }
  function vidSave(force) {
    if (!vp || !vp.id) return;
    const now = Date.now();
    if (!force && now - (vp.lastSave || 0) < 5000) return;
    vp.lastSave = now;
    const r = vidRec(vp.id);
    if (vp.d > 0) r.d = Math.round(vp.d);
    r.t = Math.round(vp.t || 0);
    r.at = now;
    if (r.d && r.t >= r.d * 0.9 && !r.done) {
      r.done = true;
      const key = todayKey(), wasActive = isActive(key);
      dayRec(key).vid = (dayRec(key).vid || 0) + 1;
      saveStudy();
      showToast("Video tamamlandı, izlediklerine eklendi.");
      afterActivity(wasActive, key);
      refreshVidList();
      return;
    }
    if (r.d && r.t > r.d - 20) r.t = 0; // sonuna gelmiş: bir dahaki sefere baştan
    saveStudy();
  }
  function refreshVidList() {
    if (!vp || !vp.root || !document.body.contains(vp.root)) return;
    const c = bySlug[vp.root.dataset.course];
    const list = vp.list || [];
    const box = vp.root.querySelector("[data-vid-list]");
    if (box) box.innerHTML = videoListHtml(list, vp.id, vp.root.hasAttribute("data-page"));
    const sum = vp.root.querySelector(".vid-sum b");
    if (sum) sum.textContent = list.filter((v) => (vidPeek(v.id) || {}).done).length + "/" + list.length;
    if (c) paintVideoLinks(c);
  }
  function vidLoad(root, v, start) {
    const frame = root.querySelector("[data-vid-frame]");
    if (navigator.onLine === false) {
      frame.innerHTML = `<div class="vid-offline"><b>Video için internet gerekiyor.</b><span>Notların ve kaldığın yer bu cihazda duruyor; bağlanınca buradan devam edersin.</span><button type="button" class="btn ghost sm-mini" data-vid-play>Yeniden dene</button></div>`;
      return;
    }
    vidSave(true);
    const q = new URLSearchParams({ enablejsapi: "1", rel: "0", modestbranding: "1", playsinline: "1", autoplay: "1", start: String(Math.floor(start || 0)) });
    if (/^https?:/.test(location.origin)) q.set("origin", location.origin);
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?${q}" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    const iframe = frame.querySelector("iframe");
    vp = { root, iframe, id: v.id, t: start || 0, d: (vidPeek(v.id) || {}).d || 0, state: -1, ready: false, lastSave: Date.now(), list: root._vidList };
    iframe.addEventListener("load", () => {
      // YouTube oynatıcısı "listening" mesajını alınca durumunu (süre, konum) göndermeye başlar.
      let n = 0;
      const ping = setInterval(() => { if (!vp || vp.iframe !== iframe || vp.ready || ++n > 20) return clearInterval(ping); vpPost("listening"); }, 250);
    });
  }
  window.addEventListener("message", (e) => {
    if (!vp || !vp.iframe || e.source !== vp.iframe.contentWindow) return;
    if (!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(String(e.origin))) return;
    let d;
    try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (_) { return; }
    if (!d || typeof d !== "object") return;
    if (d.event === "onReady" || (d.event === "infoDelivery" && !vp.ready)) {
      vp.ready = true;
      if ((study.vrate || 1) !== 1) vpPost("setPlaybackRate", [study.vrate]);
    }
    const info = d.info || {};
    if (typeof info.currentTime === "number") vp.t = info.currentTime;
    if (typeof info.duration === "number" && info.duration > 0) vp.d = info.duration;
    const now = vp.root.querySelector("[data-vid-now]");
    if (now) now.textContent = fmtClock(vp.t);
    if (typeof info.playerState === "number") {
      const was = vp.state;
      vp.state = info.playerState;
      if (vp.state === 2 && was !== 2) vidSave(true);
      if (vp.state === 0 && was !== 0) { vp.t = vp.d || vp.t; vidSave(true); vidNext(); }
    }
    vidSave(false);
  });
  function vidNext() {
    if (!vp || study.vauto === false) return;
    const list = vp.list || [];
    const i = list.findIndex((v) => v.id === vp.id);
    const next = list.slice(i + 1).find((v) => !(vidPeek(v.id) || {}).done) || list[i + 1];
    if (next) setTimeout(() => vidPick(vp.root, next.id, true), 1200);
  }
  function vidPick(root, id, play, t) {
    const list = root._vidList || [];
    const v = list.find((x) => x.id === id);
    if (!v) return;
    root.dataset.current = id;
    const r = vidPeek(id);
    const start = t != null ? t : r && !r.done && r.t > 5 ? r.t : v.start;
    root.dataset.start = Math.floor(start || 0);
    root.querySelector("[data-vid-title]").textContent = v.title;
    root.querySelector("[data-vid-yt]").href = "https://www.youtube.com/watch?v=" + id;
    root.querySelector("[data-vid-notes]").innerHTML = videoNotesHtml(id);
    const now = root.querySelector("[data-vid-now]");
    if (now) now.textContent = fmtClock(start);
    if (play) vidLoad(root, v, start);
    else {
      vidSave(true);
      if (vp && vp.root === root) vp = null;
      root.querySelector("[data-vid-frame]").innerHTML = videoFacadeHtml(v, start);
    }
    if (vp && vp.root === root) vp.list = list;
    const box = root.querySelector("[data-vid-list]");
    if (box) box.innerHTML = videoListHtml(list, id, root.hasAttribute("data-page"));
  }
  function bindVideos(c) {
    const root = document.querySelector("[data-vid-root]");
    if (!root) return;
    const ch = +root.dataset.chapter || 0;
    const list = ch ? courseVideos(c).filter((v) => v.ch === ch) : courseVideos(c);
    root._vidList = list;
    if (parseLoc().query.oynat) vidPick(root, root.dataset.current, true, +root.dataset.start);
    root.addEventListener("click", (e) => {
      const t = e.target.closest("button, a");
      if (!t || !root.contains(t)) return;
      if (t.matches("[data-vid-play]")) { const v = list.find((x) => x.id === root.dataset.current); if (v) vidLoad(root, v, +root.dataset.start || 0); }
      else if (t.matches("[data-pick]")) { vidPick(root, t.dataset.pick, true); root.scrollIntoView({ behavior: "smooth", block: "start" }); }
      else if (t.matches("[data-rate]")) {
        study.vrate = +t.dataset.rate; saveStudy();
        root.querySelectorAll("[data-rate]").forEach((b) => b.setAttribute("aria-pressed", String(b === t)));
        if (vp && vp.root === root) vpPost("setPlaybackRate", [study.vrate]);
      }
      else if (t.matches("[data-seek]")) {
        const s = +t.dataset.seek;
        if (vp && vp.root === root && vp.id === root.dataset.current) { vpPost("seekTo", [s, true]); vpPost("playVideo"); }
        else vidPick(root, root.dataset.current, true, s);
      }
      else if (t.matches("[data-del-note]")) {
        const r = vidRec(root.dataset.current);
        r.notes.splice(+t.dataset.delNote, 1); saveStudy();
        root.querySelector("[data-vid-notes]").innerHTML = videoNotesHtml(root.dataset.current);
      }
    });
    root.addEventListener("change", (e) => {
      if (e.target.matches("[data-autonext]")) { study.vauto = e.target.checked; saveStudy(); }
    });
    const form = root.querySelector("[data-vid-note]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input");
      const s = input.value.trim();
      if (!s) { input.focus(); return; }
      const id = root.dataset.current;
      const t = vp && vp.root === root && vp.id === id ? vp.t : +root.dataset.start || 0;
      const r = vidRec(id);
      r.notes.push({ t: Math.floor(t), s });
      r.notes.sort((a, b) => a.t - b.t);
      r.at = r.at || Date.now();
      saveStudy();
      input.value = "";
      root.querySelector("[data-vid-notes]").innerHTML = videoNotesHtml(id);
    });
    // Bölüm sayfasındaki kaynak listesi: YouTube bağlantısı sitedeki oynatıcıda açılır (Ctrl/orta tık yine YouTube'a gider).
    document.querySelectorAll(".lectures a[data-yt]").forEach((a) => {
      a.addEventListener("click", (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
        e.preventDefault();
        vidPick(root, a.dataset.yt, true);
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    paintVideoLinks(c);
  }
  // Kaynak listesindeki videoların yanına izlenme durumunu yaz.
  function paintVideoLinks() {
    document.querySelectorAll(".lectures a[data-yt]").forEach((a) => {
      const r = vidPeek(a.dataset.yt);
      a.classList.toggle("watched", !!(r && r.done));
      const n = a.querySelector(".n");
      if (n && r && r.done) n.textContent = "✓";
    });
  }
  document.addEventListener("error", (e) => {
    if (e.target && e.target.matches && e.target.matches(".vid-facade img")) e.target.remove(); // çevrimdışı: kapak resmi yok
  }, true);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") vidSave(true); });
  window.addEventListener("pagehide", () => vidSave(true));

  // Çalışma masası: yarıda kalan son video.
  function resumeVideoHtml() {
    let best = null;
    for (const c of COURSES) for (const v of courseVideos(c)) {
      const r = vidPeek(v.id);
      if (r && !r.done && r.t > 30 && (!best || r.at > best.r.at)) best = { c, v, r };
    }
    if (!best) return "";
    const { c, v, r } = best;
    return `<a class="desk-card vid-resume" href="#/course/${c.slug}/videolar?v=${v.id}">
      <span class="vid-resume-ic">${PLAY_SVG}</span>
      <span><b>Kaldığın videoya devam et</b><small>${esc(c.subject)} · ${esc(v.title)}</small><i class="vid-prog" style="--p:${Math.round(vidFrac(r) * 100)}%"></i><small>${fmtClock(r.t)} / ${fmtClock(r.d)}</small></span>
    </a>`;
  }

  function viewVideos(c, query) {
    const list = courseVideos(c);
    if (!list.length) return viewNotFound();
    const watched = list.filter((v) => (vidPeek(v.id) || {}).done).length;
    const noteCount = list.reduce((n, v) => n + (((vidPeek(v.id) || {}).notes || []).length), 0);
    const cur = list.find((v) => v.id === query.v) ? query.v : null;
    const t = query.t != null && /^\d+$/.test(query.t) ? +query.t : null;
    return `<p class="crumbs"><a href="#/">Katalog</a> / <a href="#/course/${c.slug}">${esc(c.subject)}</a> / Ders videoları</p>
      <div class="quiz-head">
        <div><p class="eyebrow">Ders videoları</p><h1 style="margin:0">${esc(c.course)}</h1></div>
        <div class="muted" style="font-size:.9rem">${list.length} video · ${watched} izlendi${noteCount ? ` · ${noteCount} not` : ""}</div>
      </div>
      <p class="muted">Videolar sitede açılır ve kaldığın yeri hatırlar. Hızı ayarlayabilir, izlerken o saniyeye not düşebilirsin. Oynatıcı yalnızca dokununca yüklenir; video izlemek için internet gerekir.</p>
      ${videoPlayerHtml(c, list, { current: cur, t, page: true })}
      ${c.playlist ? `<p class="muted small">Kaynak: <a href="${esc(c.playlist)}" target="_blank" rel="noopener">YouTube oynatma listesi</a>. Videoların tüm hakları sahiplerine aittir.</p>` : ""}`;
  }

  // ---- yazdırma: bu sayfa, sınav kâğıdı (cevap anahtarıyla) ve ders notları kitapçığı ----
  const PRINT_KEY = CONFIG.storageKey + ".print";
  function printPrefs() {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(PRINT_KEY)) || {}; } catch (e) { p = {}; }
    return Object.assign({ img: true, big: false, answers: "end" }, p);
  }
  const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

  // Soruyu yazdırmaya uygun tek biçime getirir: kök, şıklar, doğru şık(lar), çözüm.
  function printQ(q) {
    const opts = Array.isArray(q.answerOptions) ? q.answerOptions : null;
    const right = opts ? opts.map((o, j) => (o.isCorrect ? j : -1)).filter((j) => j >= 0) : [];
    const keyText = right.length ? right.map((j) => LETTERS[j]).join(", ")
      : q.type === "fill_in_the_blank" ? String(q.bestAnswer || "")
      : q.grading && q.grading.modelAnswer ? "Örnek cevap" : "";
    const why = q.solution || (right.length && opts[right[0]].rationale) || q.rationale || (q.grading && q.grading.modelAnswer) || "";
    return { q, opts, right, keyText, why };
  }
  function printQuestionHtml(x, i, mode, meta) {
    const { q, opts, right } = x;
    let body = "";
    if (opts) body = `<ol class="ps-opts">${opts.map((o, j) => `<li class="${mode === "inline" && right.includes(j) ? "ps-right" : ""}"><b>${LETTERS[j]})</b> ${optHtml(o)}</li>`).join("")}</ol>`;
    else if (q.type === "fill_in_the_blank") body = `<p class="ps-line">Cevap: ______________________________</p>`;
    else body = `<div class="ps-lines"><span></span><span></span><span></span></div>`;
    const sol = mode === "inline" && (x.keyText || x.why)
      ? `<div class="ps-sol"><b>Cevap: ${esc(x.keyText || "-")}</b>${x.why ? " · " + txt(x.why) : ""}</div>` : "";
    return `<li class="ps-q">${meta ? `<p class="ps-meta">${esc(meta)}</p>` : ""}<div class="ps-stem">${stemHtml(q)}</div>${body}${sol}</li>`;
  }
  function printSheetHtml(o) {
    const items = o.questions.map((q) => printQ(q));
    const date = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
    const mc = items.filter((x) => x.opts).length;
    const maxOpts = Math.max(4, ...items.map((x) => (x.opts ? x.opts.length : 0)));
    const grid = o.answers !== "inline" && mc
      ? `<section class="ps-form"><h2>Cevap formu</h2><p class="ps-note">Cevabını yuvarlağı karalayarak işaretle. Çözdükten sonra ${o.answers === "end" ? "son sayfadaki anahtarla" : "sitede"} kontrol et.</p>
        <ol class="ps-bubbles">${items.map((x, i) => `<li><b>${i + 1}</b>${x.opts ? LETTERS.slice(0, x.opts.length || maxOpts).map((l) => `<span>${l}</span>`).join("") : "<em>yazılı</em>"}</li>`).join("")}</ol></section>` : "";
    const key = o.answers === "end"
      ? `<section class="ps-key"><h2>Cevap anahtarı</h2>
        <ol class="ps-key-grid">${items.map((x, i) => `<li><b>${i + 1}</b> ${esc(x.keyText || "-")}</li>`).join("")}</ol>
        ${items.some((x) => x.why) ? `<h3>Kısa çözümler</h3><ol class="ps-whys">${items.map((x, i) => `<li value="${i + 1}"><b>${esc(x.keyText || "-")}.</b> ${x.why ? txt(x.why) : ""}</li>`).join("")}</ol>` : ""}
      </section>` : "";
    const score = o.scoring ? `<span>Doğru: ____</span><span>Yanlış: ____</span><span>Net: ____</span>` : `<span>Doğru: ____ / ${items.length}</span>`;
    return `<article class="ps">
      <header class="ps-head">
        <p class="ps-brand">${esc(CONFIG.name)}</p>
        <h1>${esc(o.title)}</h1>
        <p class="ps-sub">${esc(o.sub || "")}${o.sub ? " · " : ""}${items.length} soru${o.minutes ? ` · ${o.minutes} dakika` : ""} · ${date}</p>
        <div class="ps-fields"><span>Ad Soyad: ______________________</span>${score}</div>
      </header>
      <ol class="ps-qs">${items.map((x, i) => printQuestionHtml(x, i, o.answers, o.metas ? o.metas[i] : "")).join("")}</ol>
      ${grid}${key}
      <p class="ps-foot">${esc(CONFIG.name)} · ${esc(location.href.split("#")[0])}</p>
    </article>`;
  }
  function printBookletHtml(c, prefs) {
    const date = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
    const chapters = c.chapters.map((ch, i) => {
      const notes = (ch.notes ? md(ch.notes) : `<p class="muted">Bu bölümün notları henüz hazır değil.</p>`).replace(/⟦(\d+)⟧/g, "");
      const vids = (ch.lectures || []).map((l) => `<li>${esc(l.title)}</li>`).join("");
      return `<section class="pb-ch">
        <p class="pb-eyebrow">${i + 1}. Bölüm</p>
        <h2>${esc(ch.title)}</h2>
        <p class="pb-sum">${esc(ch.summary)}</p>
        ${ch.objectives && ch.objectives.length ? `<div class="pb-obj"><b>Öğrenme amaçları</b><ul>${ch.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>` : ""}
        ${prefs.img && ch.image ? `<figure class="pb-fig">${imgTag(ch.image, ch.title + " infografiği", "")}</figure>` : ""}
        <div class="pb-notes">${notes}</div>
        ${vids ? `<p class="pb-src-h">Kaynaklar</p><ol class="pb-src">${vids}</ol>` : ""}
      </section>`;
    }).join("");
    return `<article class="pb">
      <section class="pb-cover">
        <div class="pb-crest">${crest()}</div>
        <p class="ps-brand">${esc(CONFIG.name)}</p>
        <h1>${esc(c.course)}</h1>
        <p class="pb-kind">Ders notları kitapçığı</p>
        ${byline(c) ? `<p class="pb-by">${esc(byline(c))}</p>` : ""}
        <p class="pb-date">${c.chapters.length} bölüm · ${date}</p>
        <p class="pb-url">${esc(location.href.split("#")[0])}</p>
      </section>
      <section class="pb-toc"><h2>İçindekiler</h2><ol>${c.chapters.map((ch) => `<li>${esc(ch.title)}</li>`).join("")}</ol></section>
      ${chapters}
      <p class="ps-foot">Notlar NotebookLM ile ders kaynaklarından üretilmiştir. Kaynakların tüm hakları sahiplerine aittir.</p>
    </article>`;
  }

  // Bulunulan sayfaya göre yazdırılabilecek şeyler.
  function printTargets() {
    const { parts, query } = parseLoc();
    const out = { sheet: null, booklet: null };
    const c = parts[0] === "course" ? bySlug[parts[1]] : null;
    if (c) {
      if (parts[2] === "quiz") out.sheet = { title: c.course + " · Final", sub: "Final deneme sınavı", questions: (c.quiz || []).filter((q) => GRADED.has(q.type)) };
      else if (parts[2] === "unit-quiz" && +parts[3]) {
        const set = unitQuizMap(c.slug)[String(+parts[3])];
        if (set) out.sheet = { title: `${c.subject} · Ünite ${+parts[3]}`, sub: set.unitTitle || "Ünite quiz'i", questions: set.questions || [] };
      } else if (parts[2] === "past") {
        const exam = pastFor(c.slug).find((s) => s.exam_id === decodeURIComponent(parts[3] || "")) || pastFor(c.slug)[0];
        if (exam) out.sheet = {
          title: `${c.subject} · ${exam.year || exam.exam_id} ${termName(exam.term)} vize${exam.group && exam.group !== "A" ? " " + exam.group + " grup" : ""}`,
          sub: "Çıkmış sınav", minutes: Math.round((exam.questions || []).length * MOCK_MIN_PER_Q), scoring: true,
          questions: (exam.questions || []).map((q, i) => pastToQuiz(q, c.slug, exam, i)),
        };
      }
      if (["chapter", undefined, "videolar"].includes(parts[2])) out.booklet = c;
    }
    if (parts[0] === "hatalar") {
      const bank = questionBank();
      const slug = bySlug[query.ders] ? query.ders : "";
      const ids = openMistakes().filter(([id]) => bank.has(id) && (!slug || courseOfId(id) === slug)).map(([id]) => id);
      if (ids.length) out.sheet = {
        title: "Hatalarım" + (slug ? " · " + bySlug[slug].subject : ""), sub: "Yanlış çözdüğün sorular",
        questions: ids.map((id) => bank.get(id).q), metas: ids.map((id) => { const x = bank.get(id); return bySlug[x.slug].subject + " · " + x.label; }),
      };
    }
    if (out.sheet && !out.sheet.questions.length) out.sheet = null;
    return out;
  }

  function printDialogHtml(t, p) {
    const what = [["page", "Bu sayfa", "Ekranda gördüğün içerik, menüler olmadan."]];
    if (t.sheet) what.push(["sheet", `Sınav kâğıdı (${t.sheet.questions.length} soru)`, "Tüm sorular alt alta, cevap formu ile."]);
    if (t.booklet) what.push(["booklet", "Ders notları kitapçığı", `${t.booklet.chapters.length} bölümün notları, kapak ve içindekilerle.`]);
    const def = t.sheet ? "sheet" : "page";
    return `<form method="dialog" class="pd" id="print-form">
      <h2 id="pd-h">Yazdır</h2>
      <fieldset><legend>Ne yazdırılsın?</legend>
        ${what.map(([v, l, d]) => `<label class="pd-opt"><input type="radio" name="what" value="${v}"${v === def ? " checked" : ""}><span><b>${l}</b><small>${d}</small></span></label>`).join("")}
      </fieldset>
      ${t.sheet ? `<fieldset data-for="sheet"><legend>Cevaplar</legend>
        <div class="pill-group">${[["none", "Cevapsız"], ["end", "Sonda anahtar"], ["inline", "Soru altında"]].map(([v, l]) => `<label><input type="radio" name="answers" value="${v}"${p.answers === v ? " checked" : ""}><span>${l}</span></label>`).join("")}</div>
      </fieldset>` : ""}
      <fieldset><legend>Seçenekler</legend>
        <label class="chk-inline"><input type="checkbox" name="img"${p.img ? " checked" : ""}><span>Görselleri dahil et<small class="muted">Kapatırsan mürekkep ve kâğıt tasarrufu olur.</small></span></label>
        <label class="chk-inline"><input type="checkbox" name="big"${p.big ? " checked" : ""}><span>Büyük yazı</span></label>
      </fieldset>
      <p class="muted small">PDF olarak kaydetmek için yazıcı listesinden "PDF olarak kaydet"i seç.</p>
      <div class="btn-row"><button class="btn" value="ok">Yazdır</button><button class="btn ghost" value="cancel" formnovalidate>Vazgeç</button></div>
    </form>`;
  }

  function openPrintDialog() {
    cleanupPrint();
    const t = printTargets(), p = printPrefs();
    let dlg = document.getElementById("print-dlg");
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.id = "print-dlg";
      dlg.className = "dlg";
      dlg.setAttribute("aria-labelledby", "pd-h");
      document.body.appendChild(dlg);
      dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close("cancel"); }); // dışına dokununca kapan
    }
    dlg.innerHTML = printDialogHtml(t, p);
    const form = dlg.querySelector("form");
    const sync = () => {
      const what = form.what.value;
      form.querySelectorAll("[data-for]").forEach((f) => (f.hidden = f.dataset.for !== what));
    };
    form.addEventListener("change", sync);
    sync();
    dlg.onclose = () => {
      if (dlg.returnValue !== "ok") return;
      const prefs = { img: form.img.checked, big: form.big.checked, answers: form.answers ? form.answers.value : p.answers };
      try { localStorage.setItem(PRINT_KEY, JSON.stringify(prefs)); } catch (e) { /* yok */ }
      runPrint(form.what.value, t, prefs);
    };
    if (typeof dlg.showModal === "function") dlg.showModal(); else runPrint("page", t, p);
  }

  let printPrep = null;
  function preparePrint(kind, t, prefs) {
    if (printPrep) return;
    const body = document.body;
    printPrep = { opened: [], kind };
    body.classList.toggle("print-noimg", !prefs.img);
    body.classList.toggle("print-big", !!prefs.big);
    if (kind === "sheet" || kind === "booklet") {
      let root = document.getElementById("print-root");
      if (!root) { root = document.createElement("div"); root.id = "print-root"; body.appendChild(root); }
      root.innerHTML = kind === "sheet" ? printSheetHtml(Object.assign({ answers: prefs.answers }, t.sheet)) : printBookletHtml(t.booklet, prefs);
      body.classList.add("print-doc");
      typeset(root);
    } else {
      // Bu sayfa: kapalı açılır kutular, "Devamını yükle" sayfaları ve tembel görseller de kâğıda girsin.
      app.querySelectorAll("details:not([open])").forEach((d) => { d.open = true; printPrep.opened.push(d); });
      if (prefs.img) app.querySelectorAll("[data-more-pages]").forEach((b) => b.click());
      const h1 = app.querySelector("h1");
      const head = document.createElement("div");
      head.className = "print-head";
      head.innerHTML = `<b>${esc(CONFIG.name)}</b><span>${esc(h1 ? h1.textContent.trim() : "")}</span><span>${esc(new Date().toLocaleDateString("tr-TR"))} · ${esc(location.href)}</span>`;
      app.prepend(head);
      printPrep.head = head;
    }
    document.querySelectorAll(kind === "page" ? "#app img" : "#print-root img").forEach((img) => { img.loading = "eager"; });
  }
  function cleanupPrint() {
    if (!printPrep) return;
    printPrep.opened.forEach((d) => { d.open = false; });
    if (printPrep.head) printPrep.head.remove();
    document.body.classList.remove("print-doc", "print-noimg", "print-big");
    const root = document.getElementById("print-root");
    if (root) root.innerHTML = "";
    printPrep = null;
  }
  async function runPrint(kind, t, prefs) {
    preparePrint(kind, t, prefs);
    const scope = kind === "page" ? app : document.getElementById("print-root");
    const imgs = prefs.img ? [...scope.querySelectorAll("img")].filter((i) => !i.complete) : [];
    if (imgs.length) {
      showToast("Görseller hazırlanıyor…");
      await Promise.race([
        Promise.all(imgs.map((i) => new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); }))),
        new Promise((r) => setTimeout(r, 6000)),
      ]);
    }
    window.print(); // temizlik afterprint'te; göndermeyen mobil tarayıcılarda bir sonraki sayfa geçişinde
  }
  // Tarayıcının kendi menüsünden (Ctrl+P) yazdırınca da sayfa düzgün çıksın.
  window.addEventListener("beforeprint", () => preparePrint("page", {}, printPrefs()));
  window.addEventListener("afterprint", () => setTimeout(cleanupPrint, 100));

  // ---- paylaşım: sistem paylaşım menüsü, yoksa bağlantıyı kopyala ----
  async function shareCurrent() {
    let url = location.href;
    // Video sayfasında paylaşılan bağlantı o videonun o saniyesine açılır.
    if (vp && vp.root && document.body.contains(vp.root) && vp.root.hasAttribute("data-page")) {
      url = location.href.split("#")[0] + `#/course/${vp.root.dataset.course}/videolar?v=${vp.id}&t=${Math.floor(vp.t || 0)}`;
    }
    const h1 = app.querySelector("h1");
    const title = (h1 ? h1.textContent.trim() + " · " : "") + CONFIG.name;
    const data = { title, text: title, url };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(url); showToast("Bağlantı kopyalandı."); }
    catch (e) { window.prompt("Bağlantıyı kopyala:", url); }
  }

  function pageToolsHtml() {
    return `<div class="page-tools" data-noprint>
      <button type="button" class="tool-btn" data-print aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="M7 9V3h10v6M7 17H4.5A1.5 1.5 0 0 1 3 15.5v-5A1.5 1.5 0 0 1 4.5 9h15a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H17M7 14h10v7H7z"/></svg><span>Yazdır</span></button>
      <button type="button" class="tool-btn" data-share><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12"/></svg><span>Paylaş</span></button>
    </div>`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-print], [data-share]");
    if (!b) return;
    if (b.hasAttribute("data-print")) openPrintDialog(); else shareCurrent();
  });

  // Sayfa değişince paylaşım önizlemesi için başlık/açıklama etiketlerini güncelle.
  function updateMeta(parts) {
    const h1 = app.querySelector("h1");
    const lead = app.querySelector(".lead, .quiz-head + p.muted, h1 + p");
    const title = (h1 && parts.length ? h1.textContent.trim() + " · " : "") + CONFIG.name;
    const desc = (lead && lead.textContent.trim().replace(/\s+/g, " ").slice(0, 200)) || (document.querySelector('meta[name="description"]') || {}).content || "";
    const set = (sel, v) => { const m = document.querySelector(sel); if (m && v) m.setAttribute("content", v); };
    set('meta[property="og:title"]', title);
    set('meta[name="twitter:title"]', title);
    set('meta[property="og:description"]', desc);
    set('meta[name="twitter:description"]', desc);
    set('meta[property="og:url"]', location.href);
  }

  // ---- yönlendirici ---------------------------------------------------------------
  function parseLoc() {
    // "##/..." biçimindeki eski kalıcı linkler de açılsın diye baştaki tüm # işaretleri atılır.
    const raw = location.hash.replace(/^#+\/?/, "");
    const [pathPart, queryPart] = raw.split("?");
    const parts = pathPart.split("/").filter(Boolean);
    const query = {};
    if (queryPart) {
      queryPart.split("&").forEach((kv) => {
        if (!kv) return;
        const eq = kv.indexOf("=");
        const k = decodeURIComponent(eq < 0 ? kv : kv.slice(0, eq));
        const v = eq < 0 ? "1" : decodeURIComponent(kv.slice(eq + 1).replace(/\+/g, " "));
        query[k] = v;
      });
    }
    return { parts, query, path: parts.join("/") };
  }

  let routeSeq = 0, routed = false;
  async function route() {
    const seq = ++routeSeq;
    vidSave(true);
    vp = null;
    lisStop();
    cleanupPrint();
    const { parts, query } = parseLoc();
    const need = new Set();
    const needExamData = () => { need.add("past_exams"); need.add("unit_quizzes"); };
    if (!parts.length) { /* katalog: yalnızca data.js */ }
    else if (parts[0] === "sinavlar") needExamData();
    else if (parts[0] === "ozet") { need.add("interactive"); need.add("coursegraph"); needExamData(); }
    else if (parts[0] === "ara") need.add("coursegraph");
    else if (parts[0] === "transcript" || parts[0] === "certificate" || parts[0] === "calisma") { /* data.js yeterli */ }
    else if (["tekrar", "hatalar", "karisik", "analiz", "plan"].includes(parts[0])) needExamData();
    else if (parts[0] === "course" && bySlug[parts[1]]) {
      if (parts[2] === "chapter") { need.add("interactive"); need.add("past_exams"); }
      else if (parts[2] === "quiz") { /* data.js quiz yeterli */ }
      else if (parts[2] === "unit-quiz") need.add("unit_quizzes");
      else if (parts[2] === "exams") needExamData();
      else if (parts[2] === "past") need.add("past_exams");
    }
    let missing = [];
    if (need.size) {
      const results = await Promise.allSettled([...need].map(ensureBundle));
      missing = results.filter((r) => r.status === "rejected");
      if (seq !== routeSeq) return;
    }
    let html, bind = () => {};
    if (!parts.length) html = viewCatalog();
    else if (parts[0] === "sinavlar") { html = viewSinavlar(); bind = () => {}; }
    else if (parts[0] === "ozet") { html = viewSummary(); bind = bindSummary; }
    else if (parts[0] === "ara") { html = viewSearch(); bind = bindSearch; }
    else if (parts[0] === "transcript") { html = viewTranscript(); bind = bindTranscript; }
    else if (parts[0] === "certificate") { html = viewCertificate(); bind = bindCertificate; }
    else if (parts[0] === "cevrimdisi") { html = viewOffline(); bind = bindOffline; }
    else if (parts[0] === "calisma") { html = viewStudyDesk(); bind = bindStudyDesk; }
    else if (parts[0] === "tekrar") { html = viewReview(query); bind = bindReview; }
    else if (parts[0] === "hatalar") { html = viewMistakes(query); bind = bindMistakes; }
    else if (parts[0] === "karisik") { html = viewMix(query); bind = bindMix; }
    else if (parts[0] === "analiz") { html = viewAnalysis(query); bind = () => {}; }
    else if (parts[0] === "plan") { html = viewPlan(); bind = bindPlan; }
    else if (parts[0] === "course" && bySlug[parts[1]]) {
      const c = bySlug[parts[1]];
      if (parts[2] === "chapter") { html = viewChapter(c, +parts[3]); bind = () => { bindReport(); bindListen(query); bindVideos(c); }; }
      else if (parts[2] === "videolar") { html = viewVideos(c, query); bind = () => bindVideos(c); }
      else if (parts[2] === "quiz") { html = viewQuiz(c); bind = () => bindQuiz(c); }
      else if (parts[2] === "unit-quiz") {
        const n = +parts[3];
        if (n >= 1) { html = viewUnitQuiz(c, n); bind = () => bindUnitQuiz(c, n); }
        else { html = viewUnitQuizList(c); bind = () => {}; }
      }
      else if (parts[2] === "exams") { html = viewExamHub(c); bind = () => {}; }
      else if (parts[2] === "past") {
        const id = decodeURIComponent(parts[3] || "");
        html = viewPastExam(c, id, query);
        bind = () => (String(query.mod || "") === "rehber" ? bindSolutionGuide(c, id) : bindPastExam(c, id));
      }
      else { html = viewCourse(c); }
    } else html = viewNotFound();
    if (missing.length) html = `<div class="notice warn" role="alert"><b>Bu sayfanın bir kısmı yüklenemedi.</b> ${navigator.onLine === false ? "İnternet bağlantınız yok ve bu içerik henüz cihaza kaydedilmemiş." : "Bağlantı sorunu olabilir."} İnternete bağlanınca sayfayı yenileyin. Bir kez çevrimiçi açtıktan sonra site çevrimdışı da çalışır.</div>` + html;
    if (!parts.length) html = installBannerHtml() + todayStripHtml() + html;
    app.innerHTML = pageToolsHtml() + html;
    bind();
    paintPacks();
    paintStudyBadges();
    typeset(app);
    document.querySelectorAll(".nav a").forEach((a) => {
      const href = a.getAttribute("href");
      const key = parts[0] || "";
      const on = href === "#/" + key || (href === "#/calisma" && ["tekrar", "hatalar", "analiz", "plan"].includes(key)) || (href === "#/sinavlar" && key === "karisik");
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    // Sayfa değişince başlığı güncelle ve odağı içeriğe taşı (ekran okuyucu yeni sayfayı okusun).
    const h1 = app.querySelector("h1");
    document.title = (h1 && parts.length ? h1.textContent.trim() + " · " : "") + CONFIG.name;
    updateMeta(parts);
    if (routed) app.focus({ preventScroll: true });
    routed = true;
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();

  // ---- PWA: service worker kaydı ve güncelleme bildirimi (offline.js bölümü yukarıda) ----
  setupServiceWorker();

  // ---- tema: sistem / açık / koyu (index.html'deki küçük betik ilk boyamadan önce uygular) ----
  const THEME_KEY = "pu.theme";
  const THEME_LABEL = { "": "Tema: sistem", light: "Tema: açık", dark: "Tema: koyu" };
  const THEME_ICON = {
    "": `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 1 0 0 18V3z"/><circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
    light: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>`,
    dark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>`,
  };
  function currentTheme() { try { return localStorage.getItem(THEME_KEY) || ""; } catch (e) { return ""; } }
  function applyTheme(t) {
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
    const dark = t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#0d121d" : CONFIG.colors.primary;
    const btn = document.getElementById("theme-toggle");
    if (btn) { btn.innerHTML = THEME_ICON[t] + `<span>${THEME_LABEL[t].replace("Tema: ", "")}</span>`; btn.setAttribute("aria-label", THEME_LABEL[t] + ". Değiştirmek için dokun."); }
  }
  (function setupTheme() {
    const btn = document.getElementById("theme-toggle");
    applyTheme(currentTheme());
    if (btn) btn.onclick = () => {
      const next = { "": "light", light: "dark", dark: "" }[currentTheme()];
      try { if (next) localStorage.setItem(THEME_KEY, next); else localStorage.removeItem(THEME_KEY); } catch (e) { /* yok */ }
      applyTheme(next);
      showToast(THEME_LABEL[next] + (next ? "" : " (cihazın ayarını izler)"));
    };
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => applyTheme(currentTheme()));
  })();

  // ---- bağlantı rozeti: çevrimdışıyken köşede "Çevrimdışı çalışıyorsun" ----
  function updateNetBadge() {
    const badge = document.getElementById("net-badge");
    if (badge) badge.hidden = navigator.onLine !== false;
  }
  window.addEventListener("online", updateNetBadge);
  window.addEventListener("offline", updateNetBadge);
  updateNetBadge();
})();
