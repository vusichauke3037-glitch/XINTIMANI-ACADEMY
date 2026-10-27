const CACHE_NAME = "academy-excellence-v2-6";
const FILES_TO_CACHE = ["/", "/index.html", "/manifest.json", "/logo.png"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null))));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("firestore") || event.request.url.includes("firebase") || event.request.url.includes("googleapis")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      }).catch(() => caches.match("/index.html"));
    })
  );
});
