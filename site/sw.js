/* Kişisel Üniversite service worker: çevrimdışı çalışma.
 *
 * - Uygulama kabuğu (HTML, CSS, JS veri paketleri, fontlar, ikonlar) kurulumda önbelleğe alınır.
 *   Liste ve her dosyanın içerik özeti (rev) build.py tarafından aşağıya yazılır; içerik değişince
 *   bu dosya da değişir ve tarayıcı yeni sürümü kurar.
 * - Ders görselleri (assets/<ders>/) kullanıcı "Çevrimdışı" sayfasından indirirse "pu-pack-<ders>"
 *   önbelleğine girer. Gezinirken görülen görseller sınırlı bir çalışma önbelleğinde tutulur.
 * - Önbellek anahtarları sorgu dizesi olmadan tutulur (app.js?v=... ile app.js aynı kayıttır).
 * - Yeni sürüm kendiliğinden devreye girmez; sayfa "Yeni sürüm hazır" der ve kullanıcı onaylayınca
 *   SKIP_WAITING mesajı gelir.
 */
const VERSION = "1792016263";
const SHELL = [["index.html", "8292d0c587"], ["styles.css", "01b77c06a4"], ["app.js", "9e1cd713c1"], ["data.js", "db72ddf824"], ["interactive.js", "96bd801555"], ["coursegraph.js", "f168bc6420"], ["past_exams.js", "097d3a6827"], ["unit_quizzes.js", "1e7154c66c"], ["manifest.webmanifest", "367a1f17e6"], ["favicon.svg", "a87be0e6df"], ["fonts/eb-garamond-latin-ext-wght-italic.woff2", "fa866520f8"], ["fonts/eb-garamond-latin-ext-wght-normal.woff2", "f8d3fa06e2"], ["fonts/eb-garamond-latin-wght-italic.woff2", "c664773f7e"], ["fonts/eb-garamond-latin-wght-normal.woff2", "8860338416"], ["fonts/inter-latin-ext-wght-normal.woff2", "34b9c504ca"], ["fonts/inter-latin-wght-normal.woff2", "3100e775e8"], ["fonts/noto-naskh-arabic-arabic-wght-normal.woff2", "2a10d33e1f"], ["icons/apple-touch-icon.png", "d020f54934"], ["icons/icon-192.png", "abb211f492"], ["icons/icon-512.png", "0704b90520"], ["icons/icon-maskable-512.png", "d818a378b3"]];
const SHELL_PREFIX = "pu-shell-";
const SHELL_CACHE = SHELL_PREFIX + VERSION;
const PACK_PREFIX = "pu-pack-";
const RUNTIME_CACHE = "pu-runtime";
const RUNTIME_MAX = 60;
const REV_HEADER = "X-PU-Rev";

const scope = () => self.registration.scope;
const abs = (path) => new URL(path, scope()).href;

async function withRev(res, rev) {
  const headers = new Headers(res.headers);
  headers.set(REV_HEADER, rev);
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers });
}

// Önceki sürümün kabuğunda aynı içerik varsa yeniden indirme.
async function previousCopy(url, rev) {
  for (const name of await caches.keys()) {
    if (!name.startsWith(SHELL_PREFIX) || name === SHELL_CACHE) continue;
    const hit = await (await caches.open(name)).match(url);
    if (hit && hit.headers.get(REV_HEADER) === rev) return hit;
  }
  return null;
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    const queue = SHELL.slice();
    const worker = async () => {
      while (queue.length) {
        const [path, rev] = queue.shift();
        const url = abs(path);
        let res = await previousCopy(url, rev);
        if (!res) {
          const net = await fetch(url + "?v=" + rev, { cache: "reload" });
          if (!net.ok) throw new Error("Önbelleğe alınamadı: " + path + " (" + net.status + ")");
          res = await withRev(net, rev);
        }
        await cache.put(url, res);
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const old = (await caches.keys()).filter((name) =>
      (name.startsWith(SHELL_PREFIX) && name !== SHELL_CACHE) || name === RUNTIME_CACHE || /^pu-\d+$/.test(name));
    await Promise.all(old.map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

async function match(key) {
  const own = await (await caches.open(SHELL_CACHE)).match(key);
  if (own) return own;
  for (const name of await caches.keys()) {
    if (!name.startsWith(PACK_PREFIX) && name !== RUNTIME_CACHE) continue;
    const hit = await (await caches.open(name)).match(key);
    if (hit) return hit;
  }
  return null;
}

async function remember(key, res) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(key, res);
    const keys = await cache.keys();
    for (const old of keys.slice(0, Math.max(0, keys.length - RUNTIME_MAX))) await cache.delete(old);
  } catch (e) { /* kota dolu: yalnızca bu görsel önbelleğe girmez */ }
}

async function respond(req, url) {
  const key = url.origin + url.pathname;
  const hit = await match(key);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok && url.pathname.includes("/assets/")) remember(key, res.clone());
    return res;
  } catch (e) {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function navigate(req) {
  const page = await (await caches.open(SHELL_CACHE)).match(abs("index.html"));
  if (page) return page;
  try {
    return await fetch(req);
  } catch (e) {
    return new Response("<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width'>" +
      "<p style='font:16px system-ui;padding:2rem'>İnternet bağlantısı yok ve site henüz bu cihaza kaydedilmedi. " +
      "Bağlantı gelince sayfayı yenileyin.</p>", { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!url.href.startsWith(scope())) return; // başka sitelere giden istekler olduğu gibi geçer
  // Sayfanın ders paketi indirirken yaptığı istekler (assets/...?v=rev) doğrudan ağa gider.
  if (url.pathname.includes("/assets/") && url.searchParams.has("v")) return;
  const path = url.pathname.slice(new URL(scope()).pathname.length);
  if (req.mode === "navigate" && (path === "" || path === "index.html")) {
    event.respondWith(navigate(req));
    return;
  }
  event.respondWith(respond(req, url));
});
