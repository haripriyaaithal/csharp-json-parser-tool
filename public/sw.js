// Install service worker
self.addEventListener("install", (event) => {
  console.log("Service worker installed.");
  evt.wait;
});

// Listen for activate event
self.addEventListener("activate", (event) => {
  console.log("Service worker has been activated.");
});

// Intercept fetch events
self.addEventListener("fetch", (event) => {
  console.log("Fetch performed");
});
