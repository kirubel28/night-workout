/* sw.js – service worker for Night Workout app */

const CACHE_VERSION = "v1";
const STATIC_CACHE = `nightcut-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `nightcut-runtime-${CACHE_VERSION}`;

// Core files needed for the app shell to load offline
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./sw-register.js",
  "./manifest.json",
  // icons (optional but recommended)
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Optionally cache Chart.js CDN once it's requested
const CDN_HOSTS = ["cdn.jsdelivr.net"];

// Install: cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate new worker immediately
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("nightcut-static-") ||
              key.startsWith("nightcut-runtime-")
          )
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // For app shell and same‑origin HTML/CSS/JS → cache‑first
  if (url.origin === self.location.origin) {
    if (APP_SHELL.some((path) => url.pathname.endsWith(path.replace("./", "/")))) {
      event.respondWith(cacheFirst(req));
      return;
    }

    // For other same‑origin GETs, use network‑first with fallback
    event.respondWith(networkFirst(req));
    return;
  }

  // For CDN assets like Chart.js → network‑first with cache fallback
  if (CDN_HOSTS.includes(url.host)) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Default: just let it go through
});

// Simple cache‑first strategy
async function cacheFirst(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    return cached || Promise.reject(err);
  }
}

// Network‑first strategy with runtime caching
async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    throw err;
  }
}

// Allow the page to trigger skipWaiting via postMessage
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});