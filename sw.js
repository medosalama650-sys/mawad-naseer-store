const CACHE_NAME = "mawad-naseer-store-v34";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg", "./admin.html", "./order-view.html", "./firebase-config.js", "./offline.html", "./privacy.html", "./terms.html", "./404.html"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request, { cache: "no-store" }).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./offline.html"))));
    return;
  }
  const freshFiles = url.pathname.endsWith("/admin.html") || url.pathname.endsWith("/firebase-config.js") || url.pathname.endsWith("/sw.js") || url.pathname.endsWith("/index.html");
  if (freshFiles) {
    event.respondWith(fetch(event.request, { cache: "no-store" }).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("./offline.html") : caches.match("./index.html"))));
});
