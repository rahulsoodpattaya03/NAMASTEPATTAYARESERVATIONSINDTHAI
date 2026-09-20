/* Pattaya Namaste — auto-wire homepage service buttons to category listings.
   Loaded once from index.html: <script src="/wire.js" defer></script>
   It maps a button's visible text to a service category and opens
   /services.html?cat=<category>. Non-matching buttons are left untouched. */
(function () {
  var BASE = '/services.html?cat=';

  // Ordered: more specific keywords first so they win over generic ones.
  var MAP = [
    { cat: 'Desi Chai & Spices (Indian Groceries)', kw: ['chai', 'spice', 'masala', 'grocery', 'groceries', 'namkeen'] },
    { cat: 'Indian Restaurants', kw: ['desi feast', 'indian food', 'indian restaurant', 'tandoor', 'curry', 'biryani', 'thali', 'feast'] },
    { cat: 'Nightlife & Bars', kw: ['nightlife', 'night club', 'nightclub', 'walking street', 'bar', 'club', 'party night'] },
    { cat: 'Yacht & Boat Charter', kw: ['yacht', 'boat', 'catamaran', 'cruise', 'sail'] },
    { cat: 'Water Sports', kw: ['water sport', 'jet ski', 'jetski', 'parasail', 'scuba', 'dive', 'snorkel', 'flyboard', 'wakeboard'] },
    { cat: 'Golf Courses', kw: ['golf'] },
    { cat: 'Spa & Massage', kw: ['spa', 'massage', 'wellness', 'reflexology'] },
    { cat: 'Airport Transfers', kw: ['airport transfer', 'airport pickup', 'transfer', 'pickup'] },
    { cat: 'Cars & Bikes Rental', kw: ['ride', 'car rental', 'bike', 'scooter', 'rent a car', 'rental', 'taxi', 'cab', 'drive'] },
    { cat: 'Hotels & Resorts', kw: ['hotel', 'resort', 'stay', 'room booking', 'accommodation'] },
    { cat: 'Tours & Excursions', kw: ['tour', 'excursion', 'sightsee', 'island', 'day trip', 'cabaret', 'show ticket'] },
    { cat: 'Event & Party Planning', kw: ['villa', 'party', 'event', 'celebration', 'birthday', 'bachelor'] },
    { cat: 'Shopping & Markets', kw: ['mall', 'shopping', 'loot', 'market', 'shop'] },
    { cat: 'Medical & Pharmacy', kw: ['medical', 'pharmacy', 'doctor', 'hospital', 'clinic', 'dental'] },
    { cat: 'Concierge & VIP Services', kw: ['concierge', 'vip service', 'personal assistant', 'butler', 'vip'] },
    { cat: 'Restaurants', kw: ['restaurant', 'dining', 'eat', 'food'] }
  ];

  function matchCategory(text) {
    var t = (text || '').toLowerCase();
    for (var i = 0; i < MAP.length; i++) {
      for (var j = 0; j < MAP[i].kw.length; j++) {
        if (t.indexOf(MAP[i].kw[j]) >= 0) return MAP[i].cat;
      }
    }
    return null;
  }

  // Find the clickable "card/button" the user actually tapped.
  function clickable(el) {
    return el.closest('button, a, [onclick], [role="button"], .card, .service-card, .grid > div, .cursor-pointer');
  }

  // --- Rebrand the app name (safe, runs on load) ---
  function applyBranding() {
    try { document.title = 'Namaste Pattaya Reservations Super-App'; } catch (e) {}
    var NEW = 'NAMASTE PATTAYA RESERVATIONS SUPER-APP';
    var nodes = document.querySelectorAll('span, h1, h2, div, a, p');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children.length === 0 && (el.textContent || '').trim().toUpperCase() === 'PATTAYA NAMASTE') {
        el.textContent = NEW;
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyBranding);
  else applyBranding();

  // Capture-phase listener so we run before the page's own modal handlers.
  document.addEventListener('click', function (e) {
    var el = clickable(e.target);
    if (!el) return;
    var text = el.innerText || el.textContent || '';
    // Ignore very long text blocks (containers), only act on button-sized labels.
    if (text.length > 60) return;
    var cat = matchCategory(text);
    if (!cat) return;
    e.preventDefault();
    e.stopPropagation();
    window.location.href = BASE + encodeURIComponent(cat);
  }, true);
})();
