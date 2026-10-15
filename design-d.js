// Design D: carousels, hero video control, and ?compare links between the four pages.
(function () {
  // ---- Carousels: arrows page through the track; a thin bar shows position
  document.querySelectorAll('.d-car').forEach(function (car) {
    var track = car.querySelector('.d-car__track');
    var head = car.id ? document.querySelector('[data-car="' + car.id + '"]') : null;
    var prev = head && head.querySelector('[data-dir="-1"]'), next = head && head.querySelector('[data-dir="1"]');
    var bar = car.querySelector('.d-bar i');
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
      if (bar) {
        var vis = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
        bar.style.width = Math.max(8, Math.min(100, vis * 100)) + '%';
        bar.style.transform = 'translateX(' + (max > 0 ? (track.scrollLeft / max) * (1 / vis - 1) * 100 : 0) + '%)';
      }
    }
    function go(dir) { track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // ---- Footer: on phones (<=600px) each column folds into a tap-to-open section, like the live site
  document.documentElement.classList.add('d-js');
  var fmq = window.matchMedia('(max-width:600px)');
  var fcols = Array.prototype.slice.call(document.querySelectorAll('.d-fcol'));
  function fsync() {
    fcols.forEach(function (col) {
      var b = col.querySelector('.d-fcol__btn'); if (!b) return;
      if (fmq.matches) { b.removeAttribute('tabindex'); b.setAttribute('aria-expanded', col.classList.contains('is-open') ? 'true' : 'false'); }
      else { b.setAttribute('tabindex', '-1'); b.removeAttribute('aria-expanded'); }
    });
  }
  fcols.forEach(function (col) {
    var b = col.querySelector('.d-fcol__btn'); if (!b) return;
    b.addEventListener('click', function () {
      if (!fmq.matches) return;
      var open = !col.classList.contains('is-open');
      col.classList.toggle('is-open', open); b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  if (fmq.addEventListener) fmq.addEventListener('change', fsync); else if (fmq.addListener) fmq.addListener(fsync);
  fsync();

  // ---- Hero video: pause / play (autoplays muted, like the live page)
  var vid = document.querySelector('.d-video video'), vbtn = document.querySelector('.d-video__btn');
  if (vid && vbtn) {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { vid.pause(); vid.removeAttribute('autoplay'); }
    function label() { vbtn.textContent = vid.paused ? 'Play video' : 'Pause video'; }
    vbtn.addEventListener('click', function () { if (vid.paused) vid.play(); else vid.pause(); label(); });
    vid.addEventListener('play', label); vid.addEventListener('pause', label); label();
  }

  // ---- Keep ?compare on links between the pages (inside compare.html)
  var compare = /[?&]compare\b/.test(location.search);
  if (compare) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var m = a.getAttribute('href').match(/^(index|education|industry|product)\.html(?:\?[^#]*)?(#.*)?$/);
      if (m) a.setAttribute('href', m[1] + '.html?compare' + (m[2] || ''));
    });
  }

  // ---- Chooser "Continue as Guest" returns to the Store page
  document.addEventListener('click', function (ev) {
    var g = ev.target.closest && ev.target.closest('[data-guest]');
    if (!g) return;
    ev.stopPropagation(); ev.preventDefault();
    try { localStorage.setItem('cytron_audience', 'guest'); } catch (e) {}
    if (document.body.getAttribute('data-dd') === 'store') {
      var x = document.querySelector('#welcome [data-close]'); if (x) x.click();
    } else {
      location.href = 'index.html' + (compare ? '?compare' : '');
    }
  }, true);
})();
