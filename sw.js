importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyAA6lRUU7wMduCyalwp5jJMaZQpTRmF6FQ",authDomain:"mawad-naseer-store.firebaseapp.com",projectId:"mawad-naseer-store",storageBucket:"mawad-naseer-store.firebasestorage.app",messagingSenderId:"404783403260",appId:"1:404783403260:web:19802d8aaee25ce27f0779"});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  const notification = payload.notification || {};
  self.registration.showNotification(notification.title || "معوض نصير ستور", {
    body: notification.body || "لديك تحديث جديد.",
    icon: "./icon.svg",
    data: payload.data || { url: "./" }
  });
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url ? event.notification.data.url : "./";
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const client of list) {
      if ("focus" in client) { client.navigate(target); return client.focus(); }
    }
    return clients.openWindow(target);
  }));
});
const CACHE_NAME = "mawad-naseer-store-v38";
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
