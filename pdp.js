// Product page mockups: gallery + video, bundle picker, quantity, collapsibles,
// section nav and sticky buy bar. Nothing here talks to a real cart.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- header height, for sticky offsets
  var hdr = $('.hdr');
  function setHdr() { if (hdr) document.documentElement.style.setProperty('--hdr', hdr.offsetHeight + 'px'); }
  setHdr(); addEventListener('resize', setHdr);

  // ---- toast
  var toast = $('.p-toast'), tt;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg || 'Mockup only. Nothing was added to a cart.';
    toast.hidden = false; clearTimeout(tt); tt = setTimeout(function () { toast.hidden = true; }, 2600);
  }
  $$('[data-toast]').forEach(function (b) { b.addEventListener('click', function () { say(); }); });

  // ---- gallery: video tile first, then photos
  var gal = $('[data-gal]');
  var stage = gal && $('.p-gal__stage', gal), vid = gal && $('.p-gal__video', gal), img = gal && $('.p-gal__img', gal);
  var thumbs = gal ? $$('.p-thumb', gal) : [];
  function stopVideo() { var f = stage && $('iframe', stage); if (f) f.remove(); }
  function press(btn) { thumbs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === btn)); t.classList.toggle('is-on', t === btn); }); }
  function showImage(src, btn) {
    stopVideo(); vid.hidden = true; img.hidden = false; img.src = src; press(btn || null);
  }
  function showVideo() { stopVideo(); img.hidden = true; vid.hidden = false; press(thumbs[0]); }
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () { if (t.hasAttribute('data-video')) showVideo(); else showImage(t.getAttribute('data-src'), t); });
  });
  if (vid) vid.addEventListener('click', function () {
    var id = vid.getAttribute('data-play');
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    f.title = 'Maker ESP32 video'; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
    vid.hidden = true; stage.appendChild(f);
  });
  // Design D thumbnail arrows
  var track = gal && $('.p-thumbs__track', gal);
  var tPrev = gal && $('[data-tscroll="-1"]', gal), tNext = gal && $('[data-tscroll="1"]', gal);
  function tUpdate() {
    if (!track || !tPrev) return;
    tPrev.disabled = track.scrollLeft <= 2;
    tNext.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }
  [tPrev, tNext].forEach(function (b) {
    if (b) b.addEventListener('click', function () { track.scrollBy({ left: Number(b.getAttribute('data-tscroll')) * track.clientWidth * 0.8, behavior: 'smooth' }); });
  });
  if (track) { track.addEventListener('scroll', tUpdate, { passive: true }); addEventListener('resize', tUpdate); tUpdate(); }

  // ---- bundle picker
  var radios = $$('input[name="bundle"]');
  var addBtns = $$('[data-add]'), hint = $('[data-hint]');
  var stockEl = $('[data-stock]');
  var shortStock = stockEl && stockEl.hasAttribute('data-stock-short');
  function current() { for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i]; return null; }
  function apply(r) {
    var d = r.dataset, out = d.avail === 'out';
    $$('[data-price]').forEach(function (el) { el.textContent = d.price; });
    $$('[data-code]').forEach(function (el) { el.textContent = d.code; });
    if (stockEl) {
      stockEl.setAttribute('data-state', out ? 'out' : 'in');
      stockEl.textContent = shortStock ? (out ? 'Out of Stock' : 'In Stock') : (out ? 'Out of stock' : 'In stock');
    }
    addBtns.forEach(function (b) {
      b.disabled = out;
      var s = $('span', b) || b; s.textContent = out ? 'Out of Stock' : 'Add to Cart';
    });
    if (hint) hint.hidden = true;
    if (img && d.img) showImage(d.img, null);
    $$('[data-box]').forEach(function (bx) { bx.classList.toggle('is-on', bx.getAttribute('data-box') === d.i); });
  }
  radios.forEach(function (r) { r.addEventListener('change', function () { if (r.checked) apply(r); }); });
  addBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      if (!current()) {
        if (hint) hint.hidden = false;
        var fs = $('.p-opts, .pd-opts'); if (fs) fs.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (radios[0]) setTimeout(function () { radios[0].focus({ preventScroll: true }); }, 350);
        return;
      }
      say();
    });
  });
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = radios[Number(b.getAttribute('data-pick'))]; if (!r) return;
      r.checked = true; apply(r);
      var buy = $('#buy') || $('.pd-top'); if (buy) buy.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---- quantity
  $$('[data-qty]').forEach(function (q) {
    var inp = $('input', q);
    $$('[data-step]', q).forEach(function (b) {
      b.addEventListener('click', function () { inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + Number(b.getAttribute('data-step'))); });
    });
    inp.addEventListener('change', function () { inp.value = Math.max(1, parseInt(inp.value, 10) || 1); });
  });

  // ---- Design D: Read More / Read Less
  $$('[data-clip-btn]').forEach(function (b) {
    var box = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', function () {
      var open = !box.classList.contains('is-open');
      box.classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Read Less' : 'Read More';
      if (!open) box.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  // Design D: See More products
  $$('[data-seemore-btn]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-extra]').forEach(function (x) { x.hidden = false; }); b.parentElement.hidden = true;
    });
  });
  // Design 3: show all overview images
  $$('[data-showmore]').forEach(function (b) {
    var items = $$('[data-more]'), label = b.textContent;
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true';
      items.forEach(function (x) { x.hidden = !open; });
      b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Show fewer images' : label;
    });
  });

  // ---- Design 3: section nav highlight + sticky buy bar
  var links = $$('.p-subnav a');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {}; links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = map[en.target.id]; if (a) {
          a.setAttribute('aria-current', 'true');
          var ul = a.closest('ul'), l = a.offsetLeft, r = l + a.offsetWidth;   // keep the active tab visible (phones)
          if (l < ul.scrollLeft || r > ul.scrollLeft + ul.clientWidth) ul.scrollTo({ left: l - 16, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }
  var bar = $('[data-stickybar]'), buy = $('#buy');
  if (bar && buy && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { bar.hidden = es[0].isIntersecting || es[0].boundingClientRect.top > 0; }).observe(buy);
  }
})();
