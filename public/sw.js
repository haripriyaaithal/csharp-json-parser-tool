const CACHE_NAME = "cache-v3";

const assets = [
  "/",
  "/index.html",
  "/offline.html",
  "/privacy-policy.html",
  "/js/app.js",
  "/js/common.js",
  "/js/firebase-data.js",
  "/css/style.css",
  "/images/csharp.png",
  "/images/json.png",
  "/images/settings.png",
  "/images/logo.png",
  "/images/f.png",
  "/images/teams.png",
  "/images/t.png",
  "/images/copy.png",
  "/images/cs-file.png",
  "/images/json-file.png",
  "/images/favicon.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
];

// Install service worker
self.addEventListener("install", (event) => {
  console.log("Service worker installed.");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets");
      cache.addAll(assets);
    })
  );
});

// Listen for activate event
self.addEventListener("activate", (event) => {
  console.log("Service worker has been activated.");
  // Remove old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Intercept fetch events
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cacheResponse) => {
        // Return asset if it's present in the cache.
        // If not, make the request to the server, cache it and then return it.
        return (
          cacheResponse ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request.url, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
      .catch(() => caches.match("/offline.html"))
  );
});
