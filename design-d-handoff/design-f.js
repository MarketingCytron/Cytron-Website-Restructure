(function () {
  // mobile menu
  var burger = document.querySelector('[data-burger]'), nav = document.getElementById('nav');
  if (burger && nav) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false'); } });

  // buttons that preset "How can we help?"
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-help]'); if (!a) return;
    var sel = document.getElementById('f-help'); if (sel) sel.value = a.getAttribute('data-help');
  });

  // header search: mockup only
  var fs = document.getElementById('f-search'); if (fs) fs.addEventListener('submit', function (e) { e.preventDefault(); });

  // strategy notes toggle
  var nb = document.getElementById('f-notebtn');
  function setNotes(on) {
    document.documentElement.classList.toggle('f-notes-on', on);
    nb.setAttribute('aria-pressed', on ? 'true' : 'false');
    nb.lastChild.textContent = on ? 'Hide strategy notes' : 'Show strategy notes';
    try { localStorage.setItem('f-notes', on ? '1' : '0'); } catch (e) {}
  }
  nb.addEventListener('click', function () { setNotes(nb.getAttribute('aria-pressed') !== 'true'); });
  var saved = null; try { saved = localStorage.getItem('f-notes'); } catch (e) {}
  setNotes(saved === '1');

  // mockup forms
  var form = document.getElementById('f-form'), done = document.getElementById('f-done');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('f-name'), m = document.getElementById('f-email');
    done.hidden = false;
    if (!n.value.trim() || !/^\S+@\S+\.\S+$/.test(m.value)) {
      done.textContent = 'Please add your name and a valid work email so our team can reply.';
      (!n.value.trim() ? n : m).focus(); return;
    }
    done.textContent = 'Mockup only: on the live site this would go to the Cytron industry team.';
  });
})();

// ---- Interactive ecosystem map
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
    panel.appendChild(el('p', 'eco__role', n.role));
    panel.appendChild(el('h3', 'eco__title', n.title));
    panel.appendChild(el('p', 'eco__text', n.text));
    var ul = el('ul', 'eco__items');
    n.items.forEach(function (it) { var li = el('li'); var a = link(it[2], 'eco__item'); a.appendChild(el('span', 'eco__item-n', it[0])); a.appendChild(el('span', 'eco__item-p', it[1])); li.appendChild(a); ul.appendChild(li); });
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
