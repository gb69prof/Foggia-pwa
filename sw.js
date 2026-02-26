const CACHE = "foggia-tour-v3";
const PRECACHE = [
  "./",
  "./index.html",
  "./campi.html",
  "./offline.html",
  "./css/app.css",
  "./js/app.js",
  "./js/campi.js",
  "./app.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/Copertina.PNG",
  "./assets/campi-diomedei-scavo-panorama.jpg",
  "./assets/campi-diomedei-ricostruzione.jpg",
  "./assets/campi-diomedei-park.jpg",
  "./assets/campi-diomedei-compound.jpg",
  "./txt/Diomedei.txt"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE ? null : caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => {
        if (req.headers.get("accept") && req.headers.get("accept").includes("text/html")) {
          return caches.match("./offline.html");
        }
      });
    })
  );
});
