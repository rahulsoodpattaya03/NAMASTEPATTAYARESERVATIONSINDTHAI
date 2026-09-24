/* Namaste Pattaya Reservations — offline service worker (PWA).
   - App pages/data: network-first (fresh when online, cached when offline).
   - Map tiles + libraries: cache-first (fast + offline).
   Free & legal: OpenStreetMap-based CARTO tiles. */
var CACHE = 'npr-cache-v2';
var SHELL = [
  '/', '/services.html', '/map.html', '/games.html', '/radar.html', '/wire.js',
  '/pn-catalog.json', '/menus.json', '/clubs.json', '/logo.png', '/logo-mark.svg', '/logo-192.png', '/logo-512.png',
  '/games/game1.html', '/games/game2.html', '/games/game3.html', '/games/game4.html', '/games/game5.html'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () {}); }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = e.request.url;
  if (u.indexOf('/webhook/') >= 0 || u.indexOf('wa.me') >= 0 || u.indexOf('google.com/maps') >= 0) return; // never cache live/actions
  var isTile = u.indexOf('basemaps.cartocdn.com') >= 0;
  var isLib = u.indexOf('unpkg.com') >= 0 || u.indexOf('cdnjs.cloudflare.com') >= 0 || u.indexOf('fonts.g') >= 0;
  var sameOrigin = u.indexOf(self.location.origin) === 0;
  if (!(isTile || isLib || sameOrigin)) return;

  if (isTile || isLib) {
    // cache-first
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(e.request).then(function (hit) {
        if (hit) return hit;
        return fetch(e.request).then(function (resp) {
          if (resp && (resp.ok || resp.type === 'opaque')) c.put(e.request, resp.clone());
          return resp;
        }).catch(function () { return hit; });
      });
    }));
    return;
  }
  // same-origin app pages/data: network-first, fall back to cache offline
  e.respondWith(
    fetch(e.request).then(function (resp) {
      if (resp && resp.ok) { caches.open(CACHE).then(function (c) { c.put(e.request, resp.clone()); }); }
      return resp;
    }).catch(function () { return caches.match(e.request); })
  );
});
