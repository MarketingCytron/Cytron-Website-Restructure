/* Design H · Industry Articles
   design-h-industry-articles.html            list: featured, topic chips + search, latest grid, use cases
   design-h-industry-article.html?slug=S      article: header, hero, body, side rail (contents, products, engineers)
   Data: design-h/ia/articles.js (window.HIA, window.HIA_TOPICS), the posts on my.cytron.io/industry-articles.
   The same posts stay on the Tutorials pages too; this is a reading view for industry. */
(function () {
  var A = window.HIA || [], TOPICS = window.HIA_TOPICS || [];
  var LIST = 'design-h-industry-articles.html', ART = 'design-h-industry-article.html';
  var topicName = {}; TOPICS.forEach(function (t) { topicName[t.id] = t.name; });
  var bySlug = {}; A.forEach(function (a) { bySlug[a.slug] = a; });
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function qs(k) { return new URLSearchParams(location.search).get(k) || ''; }
  function mins(a) { return Math.max(1, Math.round(a.words / 200)) + ' min read'; }
  function href(a) { return ART + '?slug=' + encodeURIComponent(a.slug); }
  function topicHref(id) { return LIST + '?topic=' + id + '#ia-all'; }
  var I = {
    arrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>'
  };
  function label(a) { return '<span class="ia-label"><span class="ia-kind">' + esc(a.kind) + '</span><span aria-hidden="true">·</span><span>' + esc(topicName[a.topic]) + '</span></span>'; }
  function meta(a) { return '<span class="ia-meta"><span>' + esc(a.date) + '</span><span>' + esc(a.author) + '</span><span>' + mins(a) + '</span></span>'; }
  function card(a) {
    return '<article class="ia-card"><a class="ia-card__img" href="' + href(a) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(a.cover) + '" alt="" loading="lazy" width="320" height="180"></a>' +
      '<div class="ia-card__body">' + label(a) + '<h3><a href="' + href(a) + '">' + esc(a.title) + '</a></h3><p>' + esc(a.desc) + '</p>' + meta(a) + '</div></article>';
  }

  /* ---------- list ---------- */
  function renderList() {
    var root = document.getElementById('ia-app'); if (!root) return;
    var arts = A.filter(function (a) { return !a.useCase; }), uses = A.filter(function (a) { return a.useCase; });
    var lead = arts[0], side = arts.slice(1, 4);
    var st = { topic: qs('topic'), q: qs('q') };
    if (st.topic && !topicName[st.topic]) st.topic = '';
    root.innerHTML =
      '<section class="wrap ia-feat" aria-label="Featured articles">' +
        '<a class="ia-lead" href="' + href(lead) + '"><span class="ia-lead__img"><img src="' + esc(lead.hero) + '" alt="" width="960" height="540"></span>' +
          '<span class="ia-lead__body"><span class="ia-new">Latest</span>' + label(lead) + '<b>' + esc(lead.title) + '</b><span class="ia-lead__desc">' + esc(lead.desc) + '</span>' + meta(lead) + '<span class="ia-more">Read article ' + I.arrow + '</span></span></a>' +
        '<div class="ia-side"><p class="ia-side__h">Also new</p>' + side.map(function (a) {
          return '<a class="ia-mini" href="' + href(a) + '"><img src="' + esc(a.cover) + '" alt="" loading="lazy" width="320" height="180"><span>' + label(a) + '<b>' + esc(a.title) + '</b><span class="ia-meta"><span>' + esc(a.date) + '</span><span>' + mins(a) + '</span></span></span></a>';
        }).join('') + '</div>' +
      '</section>' +
      '<section class="wrap ia-all" id="ia-all" aria-labelledby="ia-all-h">' +
        '<div class="d-head"><div><p class="eyebrow">Browse by topic</p><h2 id="ia-all-h">All Articles</h2></div></div>' +
        '<div class="ia-tools"><div class="ia-chips" role="group" aria-label="Topics"></div>' +
        '<label class="ia-search"><span class="sr">Search articles</span>' + I.search + '<input type="search" placeholder="Search articles" value="' + esc(st.q) + '" data-ia-q></label></div>' +
        '<p class="ia-count" aria-live="polite"></p><div class="ia-grid" data-ia-grid></div>' +
      '</section>' +
      '<section class="wrap ia-uses" aria-labelledby="ia-uses-h">' +
        '<div class="d-head"><div><p class="eyebrow">Use Cases</p><h2 id="ia-uses-h">Raspberry Pi in the Field</h2><p class="d-intro">How IRIV PiControl and Raspberry Pi improve efficiency, energy use and monitoring on real sites.</p></div></div>' +
        '<div class="ia-grid">' + uses.map(card).join('') + '</div>' +
      '</section>';
    var chips = root.querySelector('.ia-chips'), grid = root.querySelector('[data-ia-grid]'), count = root.querySelector('.ia-count'), q = root.querySelector('[data-ia-q]');
    function draw() {
      // No filter: the latest articles (use cases have their own section below). With a topic or search: everything that matches.
      var pool = A.filter(function (a) { return st.topic || st.q ? (!st.topic || a.topic === st.topic) : !a.useCase; });
      var term = st.q.toLowerCase();
      if (term) pool = pool.filter(function (a) { return (a.title + ' ' + a.desc + ' ' + a.tags.join(' ') + ' ' + a.author).toLowerCase().indexOf(term) > -1; });
      chips.innerHTML = [{ id: '', name: 'All' }].concat(TOPICS).map(function (t) {
        var n = A.filter(function (a) { return !t.id || a.topic === t.id; }).length;
        return '<button type="button" class="ia-chip" data-topic="' + t.id + '" aria-pressed="' + (st.topic === t.id) + '">' + esc(t.name) + '<small>' + n + '</small></button>';
      }).join('');
      count.textContent = pool.length + (pool.length === 1 ? ' article' : ' articles') + (st.topic ? ' in ' + topicName[st.topic] : '') + (st.q ? ' matching “' + st.q + '”' : '');
      grid.innerHTML = pool.map(card).join('') || '<div class="ia-empty"><b>No articles match.</b><span>Try another topic or a shorter search.</span></div>';
      var p = new URLSearchParams(); if (st.topic) p.set('topic', st.topic); if (st.q) p.set('q', st.q);
      history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '') + location.hash);
    }
    chips.addEventListener('click', function (e) { var b = e.target.closest('[data-topic]'); if (!b) return; st.topic = b.getAttribute('data-topic'); draw(); });
    var tm; q.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { st.q = q.value.trim(); draw(); }, 180); });
    draw();
    if ((st.topic || st.q) && location.hash !== '#ia-all') document.getElementById('ia-all').scrollIntoView();
  }

  /* ---------- article ---------- */
  function renderArticle() {
    var root = document.getElementById('ia-app'); if (!root) return;
    var a = bySlug[qs('slug')];
    var crumb = document.querySelector('[data-ia-crumb]');
    if (!a) {
      root.innerHTML = '<section class="wrap ia-404"><h1>Article not found</h1><p><a href="' + LIST + '">Back to Industry Articles</a></p></section>';
      return;
    }
    document.title = a.title + ' - Cytron Industry Articles';
    if (crumb) crumb.innerHTML = '<a href="design-h.html">Home</a><span aria-hidden="true">/</span><a href="design-h-industry.html">Industry</a><span aria-hidden="true">/</span><a href="' + LIST + '">Articles</a><span aria-hidden="true">/</span><a href="' + topicHref(a.topic) + '">' + esc(topicName[a.topic]) + '</a>';
    var toc = [];
    var body = a.body.replace(/<h2>(.*?)<\/h2>/g, function (m, t) { var id = 'ia-s' + toc.length; toc.push([id, t.replace(/<[^>]+>/g, '')]); return '<h2 id="' + id + '">' + t + '</h2>'; });
    var i = A.indexOf(a);
    var related = A.filter(function (x) { return x !== a && x.topic === a.topic; });
    if (related.length < 3) related = related.concat(A.filter(function (x) { return x !== a && x.topic !== a.topic && !x.useCase; })).slice(0, 3); else related = related.slice(0, 3);
    var newer = A[i - 1] && !A[i - 1].useCase === !a.useCase ? A[i - 1] : null, older = A[i + 1] && !A[i + 1].useCase === !a.useCase ? A[i + 1] : null;
    root.innerHTML =
      '<header class="ia-ahead"><div class="wrap ia-ahead__in">' + label(a) +
        '<h1>' + esc(a.title) + '</h1><p class="ia-deck">' + esc(a.desc) + '</p>' +
        '<div class="ia-byline">' + meta(a) + '<button type="button" class="ia-copy" data-ia-copy>' + I.link + '<span>Copy link</span></button></div>' +
      '</div></header>' +
      '<div class="wrap ia-layout">' +
        '<article class="ia-article"><img class="ia-hero" src="' + esc(a.hero) + '" alt="" width="960" height="540">' +
          '<div class="ia-prose">' + body + '</div>' +
          (a.tags.length ? '<div class="ia-tags"><span>Topics</span>' + a.tags.map(function (t) { return '<a href="' + LIST + '?q=' + encodeURIComponent(t) + '#ia-all">' + esc(t) + '</a>'; }).join('') + '</div>' : '') +
          '<p class="ia-source">Mockup copy of the article on my.cytron.io. <a href="https://my.cytron.io/tutorial/' + esc(a.slug) + '" target="_blank" rel="noopener">Open the live article</a></p>' +
          '<nav class="ia-pn" aria-label="More articles">' +
            (older ? '<a href="' + href(older) + '"><small>Previous</small>' + esc(older.title) + '</a>' : '<span></span>') +
            (newer ? '<a class="ia-pn__next" href="' + href(newer) + '"><small>Next</small>' + esc(newer.title) + '</a>' : '') +
          '</nav>' +
        '</article>' +
        '<aside class="ia-rail">' +
          (toc.length > 1 ? '<div class="ia-panel"><p class="ia-panel__h">In this article</p><ol class="ia-toc">' + toc.map(function (t) { return '<li><a href="#' + t[0] + '">' + t[1] + '</a></li>'; }).join('') + '</ol></div>' : '') +
          (a.products.length ? '<div class="ia-panel"><p class="ia-panel__h">Products in this article</p><ul class="ia-prods">' + a.products.map(function (p) {
            return '<li><img src="' + esc(p.img) + '" alt="" loading="lazy" width="56" height="56"><span><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a><small>' + esc(p.price || '') + (p.old ? ' <s>' + esc(p.old) + '</s>' : '') + '</small></span></li>';
          }).join('') + '</ul></div>' : '') +
          '<div class="ia-panel ia-panel--talk"><p class="ia-panel__h">Planning a project like this?</p><p>Our engineers in Malaysia can help you choose the hardware and prepare a quotation.</p>' +
            '<a class="btn btn--primary" href="https://my.cytron.io/contact">Get a Quote</a><a class="ia-panel__link" href="https://my.cytron.io/ind-meetNGreet-general2">Book a meeting ' + I.arrow + '</a></div>' +
        '</aside>' +
      '</div>' +
      '<section class="wrap ia-related" aria-labelledby="ia-rel-h"><div class="d-head"><div><p class="eyebrow">Keep reading</p><h2 id="ia-rel-h">More in ' + esc(topicName[a.topic]) + '</h2></div><div class="d-head__act"><a class="more" href="' + LIST + '">All Articles ' + I.arrow + '</a></div></div>' +
        '<div class="ia-grid">' + related.map(card).join('') + '</div></section>';
    var copy = root.querySelector('[data-ia-copy]');
    copy.addEventListener('click', function () {
      var url = location.href; var done = function () { copy.classList.add('is-done'); copy.querySelector('span').textContent = 'Link copied'; setTimeout(function () { copy.classList.remove('is-done'); copy.querySelector('span').textContent = 'Copy link'; }, 1600); };
      try { navigator.clipboard.writeText(url).then(done, done); } catch (e) { done(); }
    });
  }

  // The side rail and in-page links sit below the sticky Design H header
  function setTop() { var h = document.querySelector('.hdr'); if (h) document.documentElement.style.setProperty('--ia-top', Math.round(h.getBoundingClientRect().height) + 'px'); }
  setTop(); addEventListener('resize', setTop);

  window.HIA_PAGE = { renderList: renderList, renderArticle: renderArticle };
})();
