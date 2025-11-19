const SW_VERSION = "sw-2025-11-19";
const CACHE = "delowar-cache-v3";
const OFFLINE_URL = "/offline.html";
const PRECACHE = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  OFFLINE_URL,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const networkFirst = async (request) => {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    if (request.mode === "navigate") {
      return cache.match(OFFLINE_URL);
    }
    throw new Error("Network request failed and no cache.");
  }
};

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  const respondFromCache = async () => {
    const cached = await caches.match(event.request);
    if (cached) {
      return cached;
    }

    try {
      const networkResponse = await fetch(event.request);
      if (
        networkResponse &&
        networkResponse.status === 200 &&
        networkResponse.type === "basic"
      ) {
        const cache = await caches.open(CACHE);
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch {
      if (event.request.destination === "document") {
        const offlinePage = await caches.match(OFFLINE_URL);
        if (offlinePage) {
          return offlinePage;
        }
      }

      if (event.request.destination === "image") {
        const fallbackIcon =
          (await caches.match("/favicon.ico")) ||
          (await caches.match("/icon-192.png"));
        if (fallbackIcon) {
          return fallbackIcon;
        }
      }

      return new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }
  };

  event.respondWith(respondFromCache());
});

self.addEventListener("message", (event) => {
  if (!event.data) return;
  const { type } = event.data;
  if (type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (type === "GET_SW_STATUS" && event.ports[0]) {
    event.ports[0].postMessage({
      version: SW_VERSION,
      cacheKeys: [CACHE],
      precached: PRECACHE,
    });
  }
});
