// Design E: mobile menu, media galleries (auto-advance with dots and pause),
// hero video pause/play, and ?compare mode for the comparison page.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- ?compare: no mockup badge, links between Design E pages keep the flag
  if (/[?&]compare\b/.test(location.search)) {
    document.documentElement.classList.add('is-compare');
    $$('a[href]').forEach(function (a) {
      var m = a.getAttribute('href').match(/^(design-e(?:-education|-industry|-product)?)\.html(?:\?[^#]*)?(#.*)?$/);
      if (m) a.setAttribute('href', m[1] + '.html?compare' + (m[2] || ''));
    });
  }

  // ---- mobile menu
  var burger = $('[data-burger]'), menu = $('#e-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.hidden;
      menu.hidden = !open; burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; burger.focus(); }
    });
  }

  // ---- galleries
  $$('[data-egal]').forEach(function (gal) {
    var track = $('.e-gal__track', gal), slides = $$('.e-slide', track);
    var dotsBox = $('.e-dots', gal), play = $('.e-play', gal);
    if (!slides.length) return;
    var cur = 0, timer = null, playing = !reduce;
    var dots = slides.map(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('aria-label', 'Show item ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(b); return b;
    });
    function mark(i) {
      cur = i;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
    }
    function go(i) {
      i = (i + slides.length) % slides.length;
      var s = slides[i];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      mark(i);
    }
    var st;
    track.addEventListener('scroll', function () {
      clearTimeout(st);
      st = setTimeout(function () {
        var mid = track.scrollLeft + track.clientWidth / 2, best = 0, dist = 1e9;
        slides.forEach(function (s, k) { var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid); if (d < dist) { dist = d; best = k; } });
        mark(best);
      }, 80);
    }, { passive: true });
    function restart() { clearInterval(timer); if (playing) timer = setInterval(function () { if (!document.hidden) go(cur + 1); }, 5000); }
    function setPlay(p) {
      playing = p; restart();
      if (play) {
        play.setAttribute('aria-label', p ? 'Pause gallery' : 'Play gallery');
        play.innerHTML = p
          ? '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>'
          : '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
      }
    }
    if (play) play.addEventListener('click', function () { setPlay(!playing); });
    gal.addEventListener('mouseenter', function () { clearInterval(timer); });
    gal.addEventListener('mouseleave', restart);
    gal.addEventListener('focusin', function () { clearInterval(timer); });
    mark(0); setPlay(playing);
    // centre the first slide once laid out
    requestAnimationFrame(function () { track.scrollLeft = 0; });
  });

  // ---- hero video pause / play
  $$('[data-evideo]').forEach(function (tile) {
    var v = $('video', tile), b = $('.e-vbtn', tile);
    if (!v || !b) return;
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    function label() {
      b.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video');
      b.innerHTML = v.paused
        ? '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>'
        : '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>';
    }
    b.addEventListener('click', function (e) { e.preventDefault(); if (v.paused) v.play(); else v.pause(); label(); });
    v.addEventListener('play', label); v.addEventListener('pause', label); label();
  });
})();
