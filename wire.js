/* Pattaya Namaste — homepage helper.
   Loaded once from index.html: <script src="/wire.js" defer></script>
   1) Rebrands the app name.
   2) Renames selected service buttons.
   3) Routes service buttons to their category listings on /services.html. */
(function () {
  var BASE = '/services.html?cat=';

  // Old button label -> new label (exact text incl. emoji)
  var RENAME = {
    '🍛 Late-Night Desi Feast': '🍛 Indian Food — Only Veg Delivery',
    '🚀 Zoom VIP Ride': '🛵 Cars & Bikes for Rent',
    '🏰 Jomtien Party Villa': '🏝️ Villa & Pool Parties',
    '📸 Screen Spotlight': '📸 Display Your Photo on Screen',
    '🔥 Squad & Buddy Match': '🍻 Find Strangers to Split Club Bill',
    '🎁 Secret Admirer Gift': '🎁 Send Gift to Anyone in Pattaya 24/7',
    '🫚 Desi Chai & Spices': '🫚 Indian Groceries Delivery',
    '🚨 SOS Fast Lifeline': '🚨 Emergency Numbers'
  };

  // Distinctive phrase in a (renamed) button -> category page to open.
  var LINKS = [
    { kw: 'indian groceries', cat: 'Desi Chai & Spices (Indian Groceries)' },
    { kw: 'indian food', cat: 'Indian Restaurants' },
    { kw: 'bikes for rent', cat: 'Cars & Bikes Rental' },
    { kw: 'villa', cat: 'Event & Party Planning' },
    { kw: 'mall loot', cat: 'Shopping & Markets' }
  ];

  function applyBranding() {
    try { document.title = 'Namaste Pattaya Reservations Super-App'; } catch (e) {}
    // favicon / tab icon
    try {
      var fav = document.querySelector('link[rel="icon"]');
      if (!fav) { fav = document.createElement('link'); fav.rel = 'icon'; document.head.appendChild(fav); }
      fav.href = '/logo.png';
    } catch (e) {}
    var brandEl = null;
    var nodes = document.querySelectorAll('span, h1, h2, div, a, p, button');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length !== 0) continue;
      var t = (el.textContent || '').trim();
      if (t.toUpperCase() === 'PATTAYA NAMASTE') { el.textContent = 'NAMASTE PATTAYA RESERVATIONS SUPER-APP'; brandEl = el; continue; }
      if (RENAME[t]) { el.textContent = RENAME[t]; }
    }
    // insert app logo image next to the brand name
    try {
      if (brandEl && !document.getElementById('pnLogo')) {
        var img = document.createElement('img');
        img.id = 'pnLogo'; img.src = '/logo.png'; img.alt = 'logo';
        img.style.cssText = 'width:44px;height:44px;border-radius:12px;object-fit:cover;vertical-align:middle;margin-right:8px;box-shadow:0 2px 10px rgba(0,0,0,.4)';
        img.onerror = function () { this.remove(); };
        brandEl.parentNode.insertBefore(img, brandEl);
      }
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyBranding);
  else applyBranding();

  function clickable(el) {
    return el.closest('button, a, [onclick], [role="button"], .card, .service-card, .grid > div, .cursor-pointer');
  }
  document.addEventListener('click', function (e) {
    var el = clickable(e.target);
    if (!el) return;
    var text = (el.innerText || el.textContent || '').toLowerCase();
    if (text.length > 60) return;
    for (var i = 0; i < LINKS.length; i++) {
      if (text.indexOf(LINKS[i].kw) >= 0) {
        e.preventDefault(); e.stopPropagation();
        window.location.href = BASE + encodeURIComponent(LINKS[i].cat);
        return;
      }
    }
  }, true);
})();
