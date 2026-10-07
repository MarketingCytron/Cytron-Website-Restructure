/* Cytron audience homepages (Design 3, letterhead palette) - shared by index, education, industry */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Hero slider: auto-advance every 6s with progress bars; pauses on hover/focus
  var slides = [].slice.call(document.querySelectorAll('.hero__slide'));
  var dots = [].slice.call(document.querySelectorAll('.hero__dot'));
  var cur = 0, timer = null;
  function show(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-on', i === cur); s.setAttribute('aria-hidden', i === cur ? 'false' : 'true'); });
    dots.forEach(function (d, i) {
      d.classList.remove('is-on'); void d.offsetWidth; // restart progress animation
      d.classList.toggle('is-on', i === cur);
    });
  }
  function start() { if (!reduce) { stop(); timer = setInterval(function () { show(cur + 1); }, 6000); } }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  dots.forEach(function (d) { d.addEventListener('click', function () { show(+d.dataset.i); start(); }); });
  var hero = document.querySelector('.hero');
  if (hero && slides.length > 1) {
    hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop); hero.addEventListener('focusout', start);
    start();
  }

  // ---- Use-case tabs
  var tabs = [].slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  // ---- Accordions inside each tab (one open at a time)
  document.querySelectorAll('.uc__list').forEach(function (list) {
    var items = [].slice.call(list.querySelectorAll('.acc'));
    items.forEach(function (it) {
      it.querySelector('.acc__head').addEventListener('click', function () {
        items.forEach(function (o) {
          var on = o === it;
          o.classList.toggle('is-open', on);
          o.querySelector('.acc__head').setAttribute('aria-expanded', on ? 'true' : 'false');
        });
      });
    });
  });

  // ---- Stats count-up when visible
  var stats = document.querySelectorAll('[data-count]');
  function run(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', plain = el.hasAttribute('data-plain');
    if (reduce) { el.textContent = end + suf; return; }
    var startV = plain ? end - 22 : 0, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1400), v = Math.round(startV + (end - startV) * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } });
    }, { threshold: .6 });
    stats.forEach(function (s) { io.observe(s); });
  }

  // ---- Mobile menu + tap dropdowns
  var burger = document.querySelector('[data-burger]'), nav = document.getElementById('nav');
  if (burger) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  function closeAll() { document.querySelectorAll('.dd.open').forEach(function (d) { d.classList.remove('open'); }); }
  document.querySelectorAll('.dd > button').forEach(function (b) {
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      var dd = b.parentElement, open = !dd.classList.contains('open');
      closeAll(); dd.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
})();

// ---- Audience personalisation: welcome chooser + "switch anytime" bar
(function () {
  var KEY = 'cytron_audience';                 // 'edu' | 'ind' | 'guest'
  var PAGES = { edu: 'education.html', ind: 'industry.html', guest: 'index.html' };
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var page = document.body.getAttribute('data-aud');   // all | edu | ind
  var qs = location.search;
  var dlg = document.getElementById('welcome');
  var lastFocus = null;

  // Any link with data-aud remembers the choice before navigating
  document.querySelectorAll('[data-aud]').forEach(function (a) {
    if (a === document.body) return;
    a.addEventListener('click', function () { set(a.getAttribute('data-aud')); });
  });

  function openDlg() {
    if (!dlg) return;
    lastFocus = document.activeElement;
    dlg.hidden = false; document.body.classList.add('wel-open');
    var first = dlg.querySelector('.wel__opt'); if (first) first.focus();
  }
  function closeDlg(asGuest) {
    if (!dlg || dlg.hidden) return;
    if (asGuest && !get()) set('guest');
    dlg.hidden = true; document.body.classList.remove('wel-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('[data-welcome]').forEach(function (b) { b.addEventListener('click', openDlg); });
  if (dlg) {
    dlg.querySelectorAll('[data-guest]').forEach(function (b) {
      b.addEventListener('click', function () {
        set('guest');
        if (page !== 'all') { location.href = PAGES.guest; return; }
        closeDlg(false);
      });
    });
    dlg.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { closeDlg(true); }); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(true); });
    document.addEventListener('keydown', function (e) {
      if (dlg.hidden) return;
      if (e.key === 'Escape') { closeDlg(true); return; }
      if (e.key === 'Tab') {   // keep focus inside the dialog
        var f = dlg.querySelectorAll('a[href],button'); var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
  }

  // General homepage: first visit -> show chooser; returning visitor -> their homepage
  if (page === 'all') {
    var pref = get();
    if (/[?&]welcome\b/.test(qs) || !pref) openDlg();
    else if ((pref === 'edu' || pref === 'ind') && !/[?&]stay\b/.test(qs)) location.replace(PAGES[pref]);
  }
})();
