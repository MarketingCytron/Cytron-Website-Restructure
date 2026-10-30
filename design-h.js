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
  document.documentElement.setAttribute('data-ctx', ctx);

  // Mockup badge
  var mock = document.querySelector('[data-h-mock]');
  if (mock) mock.textContent = 'DESIGN H · ' + MODES[ctx].badge + ' homepage · internal mockup';

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
  if (!dlg) return;
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
