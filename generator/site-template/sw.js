/* Kişisel Üniversite service worker: çevrimdışı çalışma.
 *
 * - Uygulama kabuğu (HTML, CSS, JS veri paketleri, fontlar, ikonlar) kurulumda önbelleğe alınır.
 *   Liste ve her dosyanın içerik özeti (rev) build.py tarafından aşağıya yazılır; içerik değişince
 *   bu dosya da değişir ve tarayıcı yeni sürümü kurar.
 * - Ders görselleri (assets/<ders>/) kullanıcı "Çevrimdışı" sayfasından indirirse "pu-pack-<ders>"
 *   önbelleğine girer. Gezinirken görülen görseller sınırlı bir çalışma önbelleğinde tutulur.
 * - Sesli dersler (audio/<ders>/) indirilirse "pu-pack-<ders>-ses" önbelleğinden aralıklı (206) yanıtla
 *   sunulur; Safari ses öğesine tam dosya değil Range yanıtı ister. İndirilmemiş ses ağdan gelir.
 * - Önbellek anahtarları sorgu dizesi olmadan tutulur (app.js?v=... ile app.js aynı kayıttır).
 * - Yeni sürüm kendiliğinden devreye girmez; sayfa "Yeni sürüm hazır" der ve kullanıcı onaylayınca
 *   SKIP_WAITING mesajı gelir.
 */
const VERSION = "{{V}}";
const SHELL = /*SHELL*/[];
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

async function audio(req, url) {
  const hit = await match(url.origin + url.pathname);
  if (!hit) {
    try { return await fetch(req); } catch (e) { return new Response("", { status: 504, statusText: "Offline" }); }
  }
  const range = req.headers.get("range");
  if (!range) return hit;
  const blob = await hit.blob();
  const size = blob.size;
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start = m[1] ? +m[1] : 0, end = m[2] ? +m[2] : size - 1;
  if (!m[1] && m[2]) { start = Math.max(0, size - +m[2]); end = size - 1; }
  end = Math.min(end, size - 1);
  if (start > end) return new Response("", { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  return new Response(blob.slice(start, end + 1), { status: 206, headers: {
    "Content-Type": hit.headers.get("Content-Type") || "audio/mp4",
    "Content-Range": `bytes ${start}-${end}/${size}`,
    "Content-Length": String(end - start + 1),
    "Accept-Ranges": "bytes",
  } });
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
  if (path.startsWith("audio/")) {
    if (url.searchParams.has("v")) return; // paket indirmesi doğrudan ağa gider
    event.respondWith(audio(req, url));
    return;
  }
  if (req.mode === "navigate" && (path === "" || path === "index.html")) {
    event.respondWith(navigate(req));
    return;
  }
  event.respondWith(respond(req, url));
});
