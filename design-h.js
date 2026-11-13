// Design H: personalised homepage, imitating my.cytron.io.
// One address (design-h.html), three homepages: store (guest), education, industry.
// - First visit: the welcome popup opens.
// - Picking a mode saves it, shows "Loading your personalized content", then reloads the same address.
// - The header icon shows the mode ("Industry Content Personalized") and reopens the popup.
// The live site saves the choice on the server; this mockup keeps it in localStorage ('cytron_h_ctx').
// Add ?reset to the address to clear the choice and see the first-visit popup again.
(function () {
  var KEY = 'cytron_h_ctx';
  var MODES = {
    store:     { tip: 'Personalize Your Content',        badge: 'Guest / Store' },
    education: { tip: 'Personalized Education Content',  badge: 'Education' },
    industry:  { tip: 'Industry Content Personalized',   badge: 'Industry' }
  };
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var saved = get();
  var ctx = MODES[saved] ? saved : 'store';
  // The Industry page always shows the Industry header and nav; the saved homepage choice stays as it is
  var hp = document.body.getAttribute('data-h-page');
  if (hp === 'industry' || hp === 'industry-articles') ctx = 'industry';
  document.documentElement.setAttribute('data-ctx', ctx);

  // Mockup badge
  var mock = document.querySelector('[data-h-mock]');
  var page = document.body.getAttribute('data-h-page');   // 'industry' on design-h-industry.html, 'tutorials' on the tutorial pages
  if (mock) mock.textContent = page === 'industry' ? 'DESIGN H · Industry page · internal mockup'
    : page === 'industry-articles' ? 'DESIGN H · ' + (document.body.getAttribute('data-h-badge') || 'Industry Articles') + ' · internal mockup'
    : page === 'tutorials' ? 'DESIGN H · Tutorials · ' + MODES[ctx].badge + ' view · internal mockup'
    : 'DESIGN H · ' + MODES[ctx].badge + ' homepage · internal mockup';

  // Header icon: blue with a dot when Education or Industry is on, tooltip names the mode
  var pz = document.querySelector('[data-h-pz]');
  if (pz) {
    var tip = pz.querySelector('.pz__tip');
    if (tip) tip.textContent = MODES[ctx].tip;
    pz.setAttribute('aria-label', MODES[ctx].tip + '. Change');
    if (ctx !== 'store') pz.classList.add('pz--on');
    // Right after switching, show the tooltip for a moment
    try {
      if (sessionStorage.getItem('cytron_h_hint')) {
        sessionStorage.removeItem('cytron_h_hint');
        if (ctx !== 'store') {
          pz.classList.add('pz--hint');
          setTimeout(function () { pz.classList.remove('pz--hint'); }, 2600);
        }
      }
    } catch (e) {}
  }

  // ---- Popup
  var dlg = document.getElementById('pzh');
  if (!dlg) {
    // Pages without the popup (Industry page): the header icon opens the homepage chooser
    if (pz) pz.addEventListener('click', function (e) { e.preventDefault(); location.href = 'design-h.html?welcome'; });
    return;
  }
  var init = dlg.querySelector('.hz__init');
  var done = dlg.querySelector('.hz__done');
  var lastFocus = null, busy = false;

  // Mark the current mode's card (only once a mode has been chosen)
  dlg.querySelectorAll('.hz__opt').forEach(function (b) {
    var on = !!saved && b.getAttribute('data-ctx') === ctx;
    b.classList.toggle('is-cur', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  function open() {
    lastFocus = document.activeElement;
    dlg.hidden = false; document.body.classList.add('wel-open');
    // Focus the popup itself, so no card looks pre-selected
    var box = dlg.querySelector('.wel__box'); if (box) box.focus();
  }
  function close() {
    if (dlg.hidden || busy) return;
    dlg.hidden = true; document.body.classList.remove('wel-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function choose(v) {
    if (busy) return;
    // Same mode as now: just close (as the live site does)
    if (saved && v === ctx) { close(); return; }
    if (!saved && v === 'store') { set('store'); close(); return; }   // first visit, Continue as Guest
    set(v);
    try { sessionStorage.setItem('cytron_h_hint', '1'); } catch (e) {}
    busy = true;
    if (init) init.hidden = true;
    if (done) done.hidden = false;
    setTimeout(function () { location.reload(); }, 1500);
  }

  if (pz) pz.addEventListener('click', function (e) { e.preventDefault(); open(); });
  // Switch bar in the page body: same flow as the popup (loading message, then reload in the new mode)
  document.querySelectorAll('[data-h-switch]').forEach(function (b) {
    b.addEventListener('click', function () { open(); choose(b.getAttribute('data-h-switch')); });
  });
  dlg.querySelectorAll('[data-ctx]').forEach(function (b) {
    b.addEventListener('click', function () { choose(b.getAttribute('data-ctx')); });
  });
  // X: closes and counts as Guest on a first visit, so the popup does not come back
  var x = dlg.querySelector('[data-h-x]');
  if (x) x.addEventListener('click', function () { if (!saved) set('store'); close(); });
  // Backdrop click or Esc: close only (on a first visit the popup returns next time)
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  document.addEventListener('keydown', function (e) {
    if (dlg.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {   // keep focus inside the popup
      var f = [].filter.call(dlg.querySelectorAll('button'), function (n) { return n.offsetParent; });
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  // First visit (or ?welcome): open the popup
  if (!saved || /[?&]welcome\b/.test(location.search)) open();
})();

// ---- Tabs (brand showcase): click or arrow keys switch panels
(function () {
  document.querySelectorAll('[data-h-tabs]').forEach(function (box) {
    var tabs = [].slice.call(box.querySelectorAll('[role="tab"]'));
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      // Items that belong to one tab (e.g. View More link and arrows for the product tabs)
      var cur = t.getAttribute('aria-controls');
      box.querySelectorAll('[data-tab-for]').forEach(function (el) { el.hidden = el.getAttribute('data-tab-for') !== cur; });
      // Carousels in a panel that was hidden measure 0 wide: let them recalculate
      try { window.dispatchEvent(new Event('resize')); } catch (e) {}
      if (focus) t.focus();
      // Keep the tab row in view sideways only; never scroll the page up or down
      var row = t.parentNode;
      if (row.scrollWidth > row.clientWidth) row.scrollLeft = t.offsetLeft - row.offsetLeft - 16;
    }
    // Tabs whose panels are link targets (Solutions: header links #sol-manufacturing etc.)
    if (box.hasAttribute('data-h-hash')) {
      var openHash = function (h, scroll) {
        if (!h || h.length < 2) return;
        var t = tabs.filter(function (x) { return '#' + x.getAttribute('aria-controls') === h; })[0];
        if (!t) return;
        select(t, false);
        if (scroll) {
          var sec = box.closest('section') || box;
          sec.scrollIntoView({ behavior: scroll === 'jump' ? 'auto' : 'smooth', block: 'start' });
        }
      };
      // On page load, images above can still change the layout: jump now, and again once everything has loaded
      if (location.hash) {
        openHash(location.hash, 'jump');
        window.addEventListener('load', function () { setTimeout(function () { openHash(location.hash, 'jump'); }, 150); });
      }
      window.addEventListener('hashchange', function () { openHash(location.hash, true); });
      // Clicking the same menu link twice does not change the hash, so handle clicks too
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var h = a.getAttribute('href');
        if (!tabs.some(function (x) { return '#' + x.getAttribute('aria-controls') === h; })) return;
        a.addEventListener('click', function (e) {
          e.preventDefault();
          if (history.replaceState) history.replaceState(null, '', h);
          openHash(h, true);
          var dd = a.closest('.dd'); if (dd && document.activeElement) document.activeElement.blur();
        });
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });
})();

// ---- Add to Cart (mockup): counts on the header cart icon and shows a short message.
// Products with options (price ends in "++") link to the product page instead, as on the live site.
(function () {
  // Delegated, so buttons added later (for example by the AI assistant) also work.
  var btns = document.querySelectorAll('[data-h-cart]');
  if (!btns.length && !document.querySelector('[data-h-notify]') && !document.querySelector('[data-h-ai]')) return;
  var ico = document.querySelector('[data-h-cartico]');
  var toast = document.querySelector('.hz-toast'), tt, count = 0, badge = null;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(tt); tt = setTimeout(function () { toast.hidden = true; }, 2600);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-h-cart]');
    if (!b) return;
    (function () {
      e.preventDefault(); e.stopPropagation();
      count++;
      if (ico) {
        if (!badge) { badge = document.createElement('span'); badge.className = 'hz-cartico__n'; ico.appendChild(badge); }
        badge.textContent = count;
        ico.setAttribute('aria-label', 'Cart, ' + count + (count === 1 ? ' item' : ' items'));
      }
      var label = b.querySelector('span');
      b.classList.add('is-added'); if (label) label.textContent = 'Added';
      setTimeout(function () { b.classList.remove('is-added'); if (label) label.textContent = 'Add to Cart'; }, 1600);
      say('Added to cart: ' + b.getAttribute('data-h-cart') + ' (mockup only)');
    })();
  });
  // Out of stock: Notify Me (mockup: confirms only; the live site would ask for an email)
  document.querySelectorAll('[data-h-notify]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var label = b.querySelector('span');
      b.classList.add('is-added'); if (label) label.textContent = "You'll be notified";
      setTimeout(function () { b.classList.remove('is-added'); if (label) label.textContent = 'Notify Me'; }, 1800);
      say("We'll let you know when " + b.getAttribute('data-h-notify') + ' is back in stock (mockup only)');
    });
  });
})();

/* Industry page 1: hero carousel. The active tab's progress bar drives auto-advance (animationend). */
(function () {
  var hero = document.querySelector('.hzh');
  if (!hero) return;
  hero.classList.add('hzh--js');
  var car = hero.querySelector('.hzh-car');
  var slides = [].slice.call(car.querySelectorAll('.hzh-slide'));
  var tabs = [].slice.call(car.querySelectorAll('.hzh-tab'));
  var pause = car.querySelector('.hzh-pause');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, userPaused = false, hoverPaused = false;
  function sync() { car.classList.toggle('is-paused', userPaused || hoverPaused); }
  function show(i, focus) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (sl, k) {
      var on = k === cur;
      sl.classList.toggle('is-active', on);
      if (on) { sl.removeAttribute('aria-hidden'); sl.inert = false; } else { sl.setAttribute('aria-hidden', 'true'); sl.inert = true; }
    });
    tabs.forEach(function (t, k) {
      var on = k === cur;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var b = t.querySelector('.hzh-tab__bar b');
      if (on) { b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; }
    });
    var t = tabs[cur], list = t.parentNode;
    if (focus) t.focus();
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: t.offsetLeft - list.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = cur + 1; else if (k === 'ArrowLeft') n = cur - 1; else if (k === 'Home') n = 0; else if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); show(n, true); }
    });
    t.querySelector('.hzh-tab__bar b').addEventListener('animationend', function (e) {
      if (e.animationName === 'hzhProgress' && t.getAttribute('aria-selected') === 'true') show(cur + 1);
    });
  });
  if (reduce) {
    pause.hidden = true;
  } else {
    car.classList.add('is-auto');
    pause.addEventListener('click', function () {
      userPaused = !userPaused;
      pause.setAttribute('aria-pressed', String(userPaused));
      pause.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
      sync();
    });
    var box = car.querySelector('.hzh-slides');
    box.addEventListener('mouseenter', function () { hoverPaused = true; sync(); });
    box.addEventListener('mouseleave', function () { hoverPaused = false; sync(); });
    car.addEventListener('focusin', function () { hoverPaused = true; sync(); });
    car.addEventListener('focusout', function (e) { if (!car.contains(e.relatedTarget)) { hoverPaused = false; sync(); } });
  }
  var tx = null;
  car.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  car.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50 && !e.target.closest('.hzh-tabs')) show(cur + (dx < 0 ? 1 : -1));
  });
  show(0);
})();

/* Industry page 2: numbers strip. Fade in and count up once, when it scrolls into view. */
(function () {
  var box = document.querySelector('.hzs');
  if (!box) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = [].slice.call(box.querySelectorAll('[data-hzs]'));
  if (reduce || !('IntersectionObserver' in window)) return;
  box.classList.add('hzs--js');
  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10), suf = el.getAttribute('data-suffix') || '', t0 = null, dur = 1400;
    if (!end) return;
    el.textContent = '0' + suf;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      [].forEach.call(en.target.querySelectorAll('[data-count]'), countUp);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();

/* Industry page 5: white-label options. Tiles, arrows and arrow keys switch the option;
   it auto-advances every 6 s (paused on hover/focus) until a visitor picks one. */
(function () {
  var box = document.querySelector('.hzl');
  if (!box) return;
  var tabs = [].slice.call(box.querySelectorAll('.hzl-thumb'));
  var pans = [].slice.call(box.querySelectorAll('.hzl-panel'));
  var imgs = [].slice.call(box.querySelectorAll('.hzl-media img'));
  var cur = 0, n = tabs.length, timer = null, stopped = false, hover = false;
  var curEl = box.querySelector('[data-hzl-cur]'), bar = box.querySelector('[data-hzl-bar]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(i, focus) {
    cur = (i + n) % n;
    tabs.forEach(function (t, k) { var on = k === cur; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
    pans.forEach(function (p, k) { var on = k === cur; p.hidden = !on; p.classList.toggle('is-active', on); });
    imgs.forEach(function (im, k) { im.classList.toggle('is-active', k === cur); });
    curEl.textContent = (cur < 9 ? '0' : '') + (cur + 1);
    bar.style.transform = 'scaleX(' + ((cur + 1) / n) + ')';
    if (focus) tabs[cur].focus();
  }
  function stop() { stopped = true; clearInterval(timer); }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { stop(); show(i); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, m = null;
      if (k === 'ArrowRight') m = cur + 1; else if (k === 'ArrowLeft') m = cur - 1; else if (k === 'Home') m = 0; else if (k === 'End') m = n - 1;
      if (m !== null) { e.preventDefault(); stop(); show(m, true); }
    });
  });
  [].forEach.call(box.querySelectorAll('[data-hzl]'), function (b) {
    b.addEventListener('click', function () { stop(); show(cur + parseInt(b.getAttribute('data-hzl'), 10)); });
  });
  var grid = box.querySelector('.hzl-grid');
  grid.addEventListener('mouseenter', function () { hover = true; });
  grid.addEventListener('mouseleave', function () { hover = false; });
  grid.addEventListener('focusin', function () { hover = true; });
  grid.addEventListener('focusout', function (e) { if (!grid.contains(e.relatedTarget)) hover = false; });
  show(0);
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        clearInterval(timer);
        if (x.isIntersecting && !stopped) timer = setInterval(function () { if (!hover && !document.hidden) show(cur + 1); }, 6000);
      });
    }, { threshold: 0.35 });
    io.observe(grid);
  }
})();


/* Industry page 8: interactive ecosystem map (ported from design-f.js, 10 Nov) */
(function () {
  var dataEl = document.getElementById('eco-data'), map = document.getElementById('eco-map'), panel = document.getElementById('eco-panel');
  if (!dataEl || !map || !panel) return;
  var D = JSON.parse(dataEl.textContent);
  var nodes = Array.prototype.slice.call(map.querySelectorAll('.eco__node'));
  var spokes = Array.prototype.slice.call(map.querySelectorAll('[data-l]'));
  var pulses = Array.prototype.slice.call(map.querySelectorAll('[data-p]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.eco__chip'));
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function link(href, cls, text) { var a = el('a', cls, text); a.href = href; return a; }
  function setHighlight(list) {
    var on = function (k) { return !list || list.indexOf(k) > -1; };
    map.classList.toggle('eco--focus', !!list);
    nodes.forEach(function (n) { var k = n.getAttribute('data-node'); n.classList.toggle('is-on', !!list && (k === 'hub' || on(k))); });
    spokes.forEach(function (s) { s.classList.toggle('is-on', !!list && on(s.getAttribute('data-l'))); });
    pulses.forEach(function (p) { p.style.display = on(p.getAttribute('data-p')) ? '' : 'none'; });
  }
  function showNode(k) {
    var n = D.nodes[k]; if (!n) return;
    nodes.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-node') === k ? 'true' : 'false'); });
    panel.innerHTML = '';
    panel.appendChild(el('h3', 'eco__title', n.title));
    panel.appendChild(el('p', 'eco__text', n.text));
    var ul = el('ul', 'eco__items');
    n.items.forEach(function (it) { var li = el('li'); var a = link(it[2], 'eco__item'); a.appendChild(el('span', 'eco__item-n', it[0])); if (it[1]) a.appendChild(el('span', 'eco__item-p', it[1])); else a.appendChild(el('span', 'eco__item-go', '→')); li.appendChild(a); ul.appendChild(li); });
    panel.appendChild(ul);
    if (n.brands.length) {
      var br = el('div', 'eco__brands');
      n.brands.forEach(function (b) { var a = link(D.brandUrl[b], 'eco__brand'); a.setAttribute('aria-label', 'Shop ' + D.brandName[b]); var img = el('img'); img.src = D.logos[b]; img.alt = D.brandName[b]; a.appendChild(img); br.appendChild(a); });
      panel.appendChild(br);
    }
    panel.appendChild(link(n.more[1], 'more', n.more[0] + ' →'));
  }
  function showScenario(id) {
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-scn') === id ? 'true' : 'false'); });
    if (!id) { setHighlight(null); showNode('hub'); return; }
    var s = D.scenarios[id]; setHighlight(s.nodes);
    nodes.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    panel.innerHTML = '';
    panel.appendChild(el('p', 'eco__role', s.tag));
    panel.appendChild(el('h3', 'eco__title', s.title));
    var ol = el('ol', 'eco__steps');
    s.steps.forEach(function (t) { ol.appendChild(el('li', null, t)); });
    panel.appendChild(ol);
    panel.appendChild(link(s.link[1], 'more', s.link[0] + ' →'));
  }
  var narrow = window.matchMedia ? matchMedia('(max-width:640px)') : null;
  function reveal() { if (narrow && narrow.matches) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  nodes.forEach(function (b) { b.addEventListener('click', function () { reveal(); chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-scn') === '' ? 'true' : 'false'); }); setHighlight(null); showNode(b.getAttribute('data-node')); }); });
  chips.forEach(function (c) { c.addEventListener('click', function () { showScenario(c.getAttribute('data-scn')); }); });
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) map.classList.add('eco--still');
  showScenario('');
})();

/* Homepage hero slider (12 Nov). The active dot's progress bar drives auto-advance (animationend), like the Industry page hero. */
(function () {
  [].forEach.call(document.querySelectorAll('[data-hz-slider]'), function (sl) {
    var slides = [].slice.call(sl.querySelectorAll('.hz-sl__slide'));
    var dots = [].slice.call(sl.querySelectorAll('.hz-sl__dot'));
    var pause = sl.querySelector('.hz-sl__pause');
    var track = sl.querySelector('.hz-sl__track');
    if (slides.length < 2) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur = 0, userPaused = false, hoverPaused = false;
    function sync() {
      var p = userPaused || hoverPaused || document.hidden;
      sl.classList.toggle('is-paused', p);
      track.setAttribute('aria-live', userPaused || reduce ? 'polite' : 'off');
    }
    function show(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === cur;
        s.classList.toggle('is-active', on);
        if (on) { s.removeAttribute('aria-hidden'); s.inert = false; } else { s.setAttribute('aria-hidden', 'true'); s.inert = true; }
      });
      dots.forEach(function (d, k) {
        var b = d.querySelector('b');
        if (k === cur) { d.setAttribute('aria-current', 'true'); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; }
        else d.removeAttribute('aria-current');
      });
    }
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); });
      d.querySelector('b').addEventListener('animationend', function (e) {
        if (e.animationName === 'hzSlProg' && d.getAttribute('aria-current') === 'true') show(cur + 1);
      });
    });
    sl.querySelector('[data-hz-sl-prev]').addEventListener('click', function () { show(cur - 1); });
    sl.querySelector('[data-hz-sl-next]').addEventListener('click', function () { show(cur + 1); });
    sl.addEventListener('keydown', function (e) {
      if (e.target.closest('.hz-sl__nav') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        e.preventDefault(); show(cur + (e.key === 'ArrowRight' ? 1 : -1)); dots[cur].focus();
      }
    });
    if (reduce) {
      pause.hidden = true;
    } else {
      sl.classList.add('is-auto');
      pause.addEventListener('click', function () {
        userPaused = !userPaused;
        pause.setAttribute('aria-pressed', String(userPaused));
        pause.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
        sync();
      });
      sl.addEventListener('mouseenter', function () { hoverPaused = true; sync(); });
      sl.addEventListener('mouseleave', function () { hoverPaused = false; sync(); });
      sl.addEventListener('focusin', function () { hoverPaused = true; sync(); });
      sl.addEventListener('focusout', function (e) { if (!sl.contains(e.relatedTarget)) { hoverPaused = false; sync(); } });
      document.addEventListener('visibilitychange', sync);
    }
    var tx = null, ty = null;
    track.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); show(cur + (dx < 0 ? 1 : -1)); }
    });
    sync();
    show(0);
  });
})();

/* Banner photo cut-out (mockup only, 13 Nov). Product photos from static.cytron.io sit on white; on the navy slides
   the white is flood-filled from the edges and made transparent, and its light-grey shadow becomes a soft dark shadow.
   If the photo can't be read (no CORS), the original photo is shown. The real site uses one designed image per slide. */
(function () {
  var els = [].slice.call(document.querySelectorAll('.hz-bn[data-cutout]'));
  if (!els.length) return;
  function cut(img) {
    var w = img.width, h = img.height, c = document.createElement('canvas');
    c.width = w; c.height = h;
    var x = c.getContext('2d'); x.drawImage(img, 0, 0);
    var im = x.getImageData(0, 0, w, h), d = im.data, n = w * h;
    var seen = new Uint8Array(n), stack = new Int32Array(n), sp = 0;
    function bg(i) { var o = i * 4, r = d[o], g = d[o + 1], b = d[o + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mn >= 178 && mx - mn <= 28; }
    function push(i) { if (!seen[i] && bg(i)) { seen[i] = 1; stack[sp++] = i; } }
    for (var k = 0; k < w; k++) { push(k); push(n - w + k); }
    for (k = 0; k < h; k++) { push(k * w); push(k * w + w - 1); }
    while (sp) {
      var i = stack[--sp], px = i % w;
      if (px > 0) push(i - 1);
      if (px < w - 1) push(i + 1);
      if (i >= w) push(i - w);
      if (i < n - w) push(i + w);
    }
    for (i = 0; i < n; i++) {
      var edge = !seen[i] && ((i % w > 0 && seen[i - 1]) || (i % w < w - 1 && seen[i + 1]) || (i >= w && seen[i - w]) || (i < n - w && seen[i + w]));
      if (!seen[i] && !edge) continue;
      var o = i * 4, l = 0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2];
      if (edge && l < 200) continue;
      var a = Math.max(0, Math.min(255, (255 - l) * 1.6));
      d[o] = d[o + 1] = d[o + 2] = 0; d[o + 3] = edge ? Math.max(a, 90) : a;
    }
    x.putImageData(im, 0, 0);
    return c;
  }
  els.forEach(function (el) {
    var m = /--bn-art:\s*url\(([^)]+)\)/.exec(el.getAttribute('style') || '');
    if (!m) { el.classList.add('is-cut'); return; }
    var src = m[1].replace(/^['"]|['"]$/g, '');
    fetch(src, { mode: 'cors' }).then(function (r) { if (!r.ok) throw 0; return r.blob(); })
      .then(function (b) { return createImageBitmap(b); })
      .then(function (img) {
        cut(img).toBlob(function (out) {
          if (out) el.style.setProperty('--bn-art', 'url(' + URL.createObjectURL(out) + ')');
          el.classList.add('is-cut');
        }, 'image/png');
      })
      .catch(function () { el.classList.add('is-cut'); });
  });
})();
