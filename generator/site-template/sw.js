/* Kişisel Üniversite service worker: çevrimdışı çalışma için cache-first statik varlıklar. */
const VERSION = "{{V}}";
const CACHE = "pu-" + VERSION;
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./manifest.webmanifest",
  "./favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k.startsWith("pu-")).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Aynı origin: cache-first + arka planda tazele. Cross-origin (CDN, font): cache-first.
  const sameOrigin = url.origin === self.location.origin;
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      if (cached) {
        // Arka planda güncelle; anında cache'ten dön (stale-while-revalidate).
        event.waitUntil(network.catch(() => {}));
        return cached;
      }
      return network;
    }).catch(() => {
      if (req.mode === "navigate") return caches.match("./index.html");
      return new Response("", { status: 504, statusText: "Offline" });
    })
  );
});
