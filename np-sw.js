/* np-sw.js (9 Oct 2026): saves the app on the phone so it opens almost instantly, and updates itself in the background.
   - App files (pages, scripts, images) are shown from the phone right away, then refreshed from the internet for next time.
   - Supabase, Raju, payments and all other online services are never cached (always live).
   - New versions replace old ones automatically, so "Delete & reset" is no longer needed. */
const CACHE = "np-app-v1";
const CORE = ["/", "/index.html", "/np-friends.js", "/manifest.json", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png", "/open-gradient.jpg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(CORE.map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => null)))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;              // Supabase, Google, ElevenLabs etc. stay live
  if (url.pathname.startsWith("/api/")) return;
  const key = req.mode === "navigate" ? "/index.html" : req;    // every page open uses the saved app page
  e.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(key, { ignoreSearch: req.mode === "navigate" }).then((saved) => {
        const fresh = fetch(req).then((res) => {
          if (res && res.ok && (res.type === "basic" || res.type === "default")) c.put(key, res.clone());
          return res;
        }).catch(() => saved);
        if (saved) { e.waitUntil(fresh.catch(() => null)); return saved; }
        return fresh;
      })
    )
  );
});
