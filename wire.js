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
    '📍 Radar & Split Bill': '📍 Radar GPS & Bill Splitter',
    '📸 Screen Spotlight': '📸 Display Your Photo on Screen',
    '🔥 Squad & Buddy Match': '🎮 Party Games',
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

  // Distinctive phrase -> a tool page to open.
  var NAV = [
    { kw: 'party games', path: '/games.html' },
    { kw: 'radar', path: '/radar.html' }
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
  // Rewrite discount text: no specific number, use "up to".
  function fixDiscounts() {
    try {
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      var nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
      nodes.forEach(function (tn) {
        var v = tn.nodeValue; if (!v || v.indexOf('%') < 0) return;
        var nv = v;
        nv = nv.replace(/up to\s+\d+%\s*/gi, 'up to ');
        nv = nv.replace(/\d+%\s*OFF/gi, 'UP TO discounts');
        nv = nv.replace(/\d+%\s*(billing\s*)?discount/gi, 'up to $1discount');
        nv = nv.replace(/\d+%/g, 'up to');
        if (nv !== v) tn.nodeValue = nv;
      });
    } catch (e) {}
  }

  // Homepage tidy-up: hide duplicate category cards + ensure pictures.
  function fixHome() {
    try {
      var hide = ['10. Elite Security on Rent', '14. Luxury Cars & Super Bikes Rentals'];
      var pics = {
        '15. Special Day Packages': 'https://loremflickr.com/600/400/celebration%2Cparty?lock=15',
        "16. Girls Night: Don't Tell My Mamma": 'https://loremflickr.com/600/400/nightlife%2Cfriends%2Cparty?lock=16'
      };
      var hs = document.querySelectorAll('h2, h3');
      for (var i = 0; i < hs.length; i++) {
        var t = (hs[i].textContent || '').trim();
        var card = hs[i];
        while (card && card !== document.body && !(card.querySelector && card.querySelector('img'))) card = card.parentElement;
        if (hide.indexOf(t) >= 0) { if (card && card !== document.body) card.style.display = 'none'; }
        else if (pics[t]) { var img = (card && card.querySelector) ? card.querySelector('img') : null; if (img) { img.onerror = null; img.src = pics[t]; } }
      }
    } catch (e) {}
  }

  // Remove stray/broken bits: a leftover "CLOSE STORE" control and a leaked "-->" comment marker.
  function cleanStray() {
    try {
      var els = document.querySelectorAll('button, a, div, span, p');
      for (var i = 0; i < els.length; i++) {
        var el = els[i]; if (el.children.length) continue;
        var t = (el.textContent || '').trim().toUpperCase();
        if (t === 'CLOSE STORE' || t === 'OPEN STORE') el.style.display = 'none';
      }
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      while (w.nextNode()) { var tn = w.currentNode; var v = tn.nodeValue; if (v && v.replace(/\s/g, '') === '-->') tn.nodeValue = ''; }
    } catch (e) {}
  }

  // Raju — AI virtual guide chat widget (calls the secure n8n endpoint; Raju answers from the catalog).
  function injectConcierge() {
    try {
      if (document.getElementById('pnConciergeBtn')) return;
      var EP = 'https://namastepattayareservation.app.n8n.cloud/webhook/concierge';
      var btn = document.createElement('button');
      btn.id = 'pnConciergeBtn';
      btn.innerHTML = '\uD83D\uDCAC Ask Raju';
      btn.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:99998;border:none;border-radius:30px;padding:12px 16px;font-weight:800;font-size:14px;color:#06121f;background:linear-gradient(90deg,#22d3ee,#a78bfa,#f59e0b);box-shadow:0 6px 20px rgba(0,0,0,.4);cursor:pointer;font-family:system-ui,Arial,sans-serif';
      document.body.appendChild(btn);
      var panel = document.createElement('div');
      panel.id = 'pnConciergePanel';
      panel.style.cssText = 'position:fixed;left:16px;bottom:74px;z-index:99999;width:min(360px,calc(100vw - 32px));height:min(70vh,520px);background:#0e1524;border:1px solid #26314d;border-radius:16px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.55);font-family:system-ui,Arial,sans-serif';
      panel.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#12121a;border-bottom:1px solid #26314d"><div style="font-weight:800;color:#e8e8ef">\uD83D\uDE4F Raju · Your Pattaya Guide</div><button id="pnCcClose" style="background:none;border:none;color:#aaa;font-size:22px;cursor:pointer;line-height:1">&times;</button></div><div id="pnCcMsgs" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;background:#0b0f19"></div><div style="display:flex;gap:8px;padding:10px;border-top:1px solid #26314d;background:#12121a"><input id="pnCcInput" placeholder="Ask Raju anything about Pattaya..." style="flex:1;padding:10px 12px;border-radius:10px;border:1px solid #26314d;background:#0d1424;color:#e8e8ef;font-size:14px"><button id="pnCcSend" style="border:none;border-radius:10px;padding:0 14px;font-weight:800;background:#25D366;color:#04351a;cursor:pointer">Send</button></div>';
      document.body.appendChild(panel);
      var msgs = panel.querySelector('#pnCcMsgs');
      function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
      function fmt(s){ return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(https?:\/\/[^\s<]+|\/[A-Za-z0-9_\-]+\.html[^\s<]*)/g,'<a href="$1" style="color:#22d3ee;font-weight:700;text-decoration:underline">$1</a>').replace(/\n/g,'<br>'); }
      function add(who, html){ var b=document.createElement('div'); b.style.cssText='max-width:85%;padding:9px 12px;border-radius:12px;font-size:14px;line-height:1.45;'+(who==='me'?'align-self:flex-end;background:#22d3ee;color:#06121f':'align-self:flex-start;background:#1a2336;color:#e8e8ef'); b.innerHTML=html; msgs.appendChild(b); msgs.scrollTop=msgs.scrollHeight; return b; }
      add('bot','Namaste! \uD83D\uDE4F Ask me anything — I am Raju, your virtual guide in Pattaya. Clubs, food, hotels, rentals, spa, tours and more.');
      function send(){ var inp=panel.querySelector('#pnCcInput'); var q=(inp.value||'').trim(); if(!q) return; inp.value=''; add('me',esc(q)); var typing=add('bot','<span style="opacity:.7">Typing...</span>'); fetch(EP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q})}).then(function(r){return r.json();}).then(function(d){ typing.innerHTML=fmt((d&&d.reply)||'Sorry, no reply.'); msgs.scrollTop=msgs.scrollHeight; }).catch(function(){ typing.innerHTML='Sorry, I could not connect. Please try again.'; }); }
      panel.querySelector('#pnCcSend').onclick=send;
      panel.querySelector('#pnCcInput').addEventListener('keydown',function(e){ if(e.key==='Enter') send(); });
      panel.querySelector('#pnCcClose').onclick=function(){ panel.style.display='none'; };
      btn.onclick=function(){ panel.style.display = (panel.style.display==='flex'?'none':'flex'); if(panel.style.display==='flex') panel.querySelector('#pnCcInput').focus(); };
    } catch (e) {}
  }

  function runAll(){ applyBranding(); fixDiscounts(); fixHome(); cleanStray(); injectConcierge(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runAll);
  else runAll();
  setTimeout(function(){ fixHome(); cleanStray(); }, 900);

  function clickable(el) {
    return el.closest('button, a, [onclick], [role="button"], .card, .service-card, .grid > div, .cursor-pointer');
  }
  document.addEventListener('click', function (e) {
    var el = clickable(e.target);
    if (!el) return;
    var text = (el.innerText || el.textContent || '').toLowerCase();
    if (text.length > 60) return;
    for (var n = 0; n < NAV.length; n++) {
      if (text.indexOf(NAV[n].kw) >= 0) { e.preventDefault(); e.stopPropagation(); window.location.href = NAV[n].path; return; }
    }
    for (var i = 0; i < LINKS.length; i++) {
      if (text.indexOf(LINKS[i].kw) >= 0) {
        e.preventDefault(); e.stopPropagation();
        window.location.href = BASE + encodeURIComponent(LINKS[i].cat);
        return;
      }
    }
  }, true);
})();
