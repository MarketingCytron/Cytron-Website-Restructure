// Industry shop (Design G): shop by job, IRIV row, kits, filters (job, type, brand, price), search and sort.
// Product data is in products.js. Filters are kept in the address (#g=sens&t=LoRaWAN&q=...) so a view can be linked.

// ---- page chrome, as on the Design F/G pages: mobile menu, header search mockup, strategy notes
(function () {
  var burger = document.querySelector('[data-burger]'), nav = document.getElementById('nav');
  if (burger && nav) burger.addEventListener('click', function () { var open = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); if (burger) burger.setAttribute('aria-expanded', 'false'); } });
  var fs = document.getElementById('f-search'); if (fs) fs.addEventListener('submit', function (e) { e.preventDefault(); var q = document.getElementById('s-q'); var v = document.getElementById('q').value; q.value = v; q.dispatchEvent(new Event('input')); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); });
  var nb = document.getElementById('f-notebtn');
  function setNotes(on) {
    document.documentElement.classList.toggle('f-notes-on', on);
    nb.setAttribute('aria-pressed', on ? 'true' : 'false');
    nb.lastChild.textContent = on ? 'Hide strategy notes' : 'Show strategy notes';
    try { localStorage.setItem('f-notes', on ? '1' : '0'); } catch (e) {}
  }
  if (nb) { nb.addEventListener('click', function () { setNotes(nb.getAttribute('aria-pressed') !== 'true'); }); var saved = null; try { saved = localStorage.getItem('f-notes'); } catch (e) {} setNotes(saved === '1'); }
})();

(function () {
  const ICONS = {
    ctrl: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h3M8 14h8M15 10h1"/><path d="M8 3v3M16 3v3M8 18v3M16 18v3"/>',
    io: '<path d="M4 7h10M4 12h16M4 17h10"/><circle cx="17" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
    sens: '<path d="M12 3v11"/><circle cx="12" cy="17" r="3.5"/><path d="M6 8a8 8 0 0 0 0 8M18 8a8 8 0 0 1 0 8"/>',
    conn: '<path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0"/><circle cx="12" cy="18.5" r="1.3"/><path d="M2 9.5a14 14 0 0 1 20 0"/>',
    hmi: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/><path d="M7 12l3-3 2 2 4-4"/>',
    motion: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    vision: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    comp: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    power: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    kits: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>'
  };
  const svg = (k, s) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
  const P = SHOP.map(([g, t, b, n, u, i, p, from, old, badge], k) => ({ k, g, t, b, n, u, i, p, from: !!from, old, badge }));
  const G = Object.fromEntries(SHOP_GROUPS.map(([id, name, verb, desc]) => [id, { id, name, verb, desc }]));
  const ORDER = SHOP_GROUPS.map(x => x[0]);
  const rm = v => 'RM' + v.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const url = p => SHOP_URL + p.u;
  const PRICES = [['u100', 'Under RM100', 0, 100], ['100', 'RM100 – RM500', 100, 500], ['500', 'RM500 – RM2,000', 500, 2000], ['2k', 'Over RM2,000', 2000, 1e9]];
  const BRANDS = ['Cytron', 'Milesight', 'Teltonika', 'Seeed', 'Meanwell', 'Argon', 'Edatec', 'Raspberry Pi', 'Other'];

  function card(p) {
    const tour = SHOP_TOURS[p.u];
    const badge = p.badge ? `<span class="s-badge${p.badge === 'Out of stock' ? ' s-badge--out' : p.badge === 'New' ? ' s-badge--new' : ''}">${p.badge}</span>` : '';
    return `<article class="s-card">${badge}<a class="s-card__img" href="${tour || url(p)}"${tour ? '' : ' target="_blank" rel="noopener"'}><img src="${SHOP_IMG + p.i}" alt="" loading="lazy" width="268" height="268"></a>
      <div class="s-card__body"><span class="s-card__brand">${p.b === 'Other' ? '&nbsp;' : p.b}</span>
      <a class="s-card__name" href="${url(p)}" target="_blank" rel="noopener" title="${esc(p.n)}">${esc(p.n)}</a><span class="s-card__sub">${p.t}</span>
      <div class="s-card__price">${p.from ? '<small>From </small>' : ''}${rm(p.p)}${p.old ? `<s>${rm(p.old)}</s>` : ''}</div>
      <div class="s-card__acts"><a class="s-card__buy" href="${url(p)}" target="_blank" rel="noopener">View &amp; buy</a>${tour ? `<a class="s-card__tour" href="${tour}">Tour</a>` : ''}</div></div></article>`;
  }

  // ---- shop by job tiles
  const tiles = document.getElementById('s-tiles');
  tiles.innerHTML = SHOP_GROUPS.map(([id, name, verb]) => `<button type="button" class="s-tile" data-g="${id}">${svg(id, 28)}<i>${verb}</i><b>${name}</b><small>${P.filter(p => p.g === id).length} products</small></button>`).join('');
  tiles.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; state.g = b.dataset.g; state.t = ''; render(); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); });

  // ---- IRIV row
  const IRIV_TXT = { 'p-iriv-picontrol-cm4-industrial-controller': 'Raspberry Pi CM4/CM5 controller with RS485, RS232, isolated I/O and 2 Ethernet.',
    'p-iriv-edge-ai-cm5': 'AI vision controller with camera ports and up to 26 TOPS.',
    'p-iriv-smarthub-cm5': 'Gateway and data hub for collecting and forwarding plant data.',
    'p-iriv-io-controller': 'Compact I/O controller for simple monitoring and switching.' };
  document.getElementById('s-iriv').innerHTML = P.filter(p => p.g === 'ctrl' && p.t === 'IRIV').map(p => {
    const tour = SHOP_TOURS[p.u];
    return `<article class="s-feat"><div class="s-feat__img"><img src="${SHOP_IMG + p.i}" alt="${esc(p.n)}" loading="lazy" width="268" height="268"></div>
      <div class="s-feat__body"><b>${esc(p.n.split(' - ')[0])}</b><p>${IRIV_TXT[p.u] || ''}</p><div class="s-feat__price">${p.from ? '<small style="font-weight:400;color:var(--muted)">From </small>' : ''}${rm(p.p)}</div>
      <div class="s-feat__acts">${tour ? `<a class="btn btn--outline" href="${tour}">Take the tour</a>` : ''}<a class="btn btn--primary" href="${url(p)}" target="_blank" rel="noopener">View &amp; buy</a></div></div></article>`;
  }).join('');

  // ---- kits strip
  document.getElementById('s-kits').innerHTML = P.filter(p => p.g === 'kits').map(card).join('');

  // ---- filters
  const state = { g: '', t: '', b: [], pr: '', q: '', sort: 'rec' };
  function readHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    state.g = G[h.get('g')] ? h.get('g') : ''; state.t = h.get('t') || ''; state.b = (h.get('b') || '').split(',').filter(x => BRANDS.includes(x));
    state.pr = PRICES.some(x => x[0] === h.get('p')) ? h.get('p') : ''; state.q = h.get('q') || ''; state.sort = h.get('s') || 'rec';
    document.getElementById('s-q').value = state.q; document.getElementById('s-sort').value = state.sort;
  }
  function writeHash() {
    const h = new URLSearchParams();
    if (state.g) h.set('g', state.g); if (state.t) h.set('t', state.t); if (state.b.length) h.set('b', state.b.join(',')); if (state.pr) h.set('p', state.pr); if (state.q) h.set('q', state.q); if (state.sort !== 'rec') h.set('s', state.sort);
    const s = h.toString(); history.replaceState(null, '', s ? '#' + s : location.pathname + location.search);
  }
  const words = () => state.q.toLowerCase().split(/\s+/).filter(Boolean);
  const match = (p, skip) => {
    if (skip !== 'g' && state.g && p.g !== state.g) return false;
    if (skip !== 'g' && state.t && p.t !== state.t) return false;
    if (skip !== 'b' && state.b.length && !state.b.includes(p.b)) return false;
    if (skip !== 'p' && state.pr) { const r = PRICES.find(x => x[0] === state.pr); if (p.p < r[2] || p.p >= r[3]) return false; }
    const hay = `${p.n} ${p.b} ${p.t} ${G[p.g].name}`.toLowerCase();
    return words().every(w => hay.includes(w));
  };
  function side() {
    const base = P.filter(p => match(p, 'g'));
    let h = '<div class="s-sidehead"><b>Filters</b><button type="button" data-close aria-label="Close filters">×</button></div><h3>Shop by job</h3>';
    h += `<button type="button" class="s-opt${state.g ? '' : ' on'}" data-fg="">All industrial products <small>${base.length}</small></button>`;
    for (const id of ORDER) {
      const n = base.filter(p => p.g === id).length;
      h += `<button type="button" class="s-opt${state.g === id ? ' on' : ''}" data-fg="${id}">${G[id].name} <small>${n}</small></button>`;
      if (state.g === id) {
        const types = [...new Set(P.filter(p => p.g === id).map(p => p.t))];
        h += '<div class="s-subs">' + types.map(t => `<button type="button" class="s-opt${state.t === t ? ' on' : ''}" data-ft="${esc(t)}">${t} <small>${base.filter(p => p.g === id && p.t === t).length}</small></button>`).join('') + '</div>';
      }
    }
    const bb = P.filter(p => match(p, 'b'));
    h += '<h3>Brand</h3>' + BRANDS.map(b => `<label class="s-check"><input type="checkbox" data-fb="${b}"${state.b.includes(b) ? ' checked' : ''}>${b === 'Other' ? 'Other brands' : b}<small>${bb.filter(p => p.b === b).length}</small></label>`).join('');
    const pb = P.filter(p => match(p, 'p'));
    h += '<h3>Price</h3>' + PRICES.map(([id, label, lo, hi]) => `<label class="s-check"><input type="radio" name="s-price" data-fp="${id}"${state.pr === id ? ' checked' : ''}>${label}<small>${pb.filter(p => p.p >= lo && p.p < hi).length}</small></label>`).join('');
    h += '<button type="button" class="s-reset" data-reset>Clear all filters</button>';
    document.getElementById('s-side').innerHTML = h;
  }
  function sorted(list) {
    const L = list.slice();
    if (state.sort === 'lo') L.sort((a, b) => a.p - b.p);
    else if (state.sort === 'hi') L.sort((a, b) => b.p - a.p);
    else if (state.sort === 'az') L.sort((a, b) => a.n.localeCompare(b.n));
    return L;
  }
  function render() {
    writeHash(); side();
    const list = P.filter(p => match(p));
    document.getElementById('s-count').innerHTML = `<b>${list.length}</b> of ${P.length} industrial products`;
    document.querySelectorAll('.s-tile').forEach(t => t.classList.toggle('on', t.dataset.g === state.g));
    const chips = [];
    if (state.g) chips.push(['g', G[state.g].name + (state.t ? ' · ' + state.t : '')]);
    state.b.forEach(b => chips.push(['b:' + b, b === 'Other' ? 'Other brands' : b]));
    if (state.pr) chips.push(['p', PRICES.find(x => x[0] === state.pr)[1]]);
    if (state.q) chips.push(['q', '“' + esc(state.q) + '”']);
    document.getElementById('s-chips').innerHTML = chips.map(([k, l]) => `<button type="button" class="s-chip" data-chip="${k}">${l} <span aria-hidden="true">×</span></button>`).join('');
    const out = document.getElementById('s-results');
    if (!list.length) { out.innerHTML = '<div class="s-empty">No products match. Try another word, or <button type="button" class="s-chip" data-reset>clear all filters</button></div>'; return; }
    const filtered = state.g || state.b.length || state.pr || state.q || state.sort !== 'rec';
    if (filtered) { out.innerHTML = `<div class="s-grid">${sorted(list).map(card).join('')}</div>`; return; }
    // no filters: one section per job, in system order
    out.innerHTML = ORDER.map(id => {
      const L = list.filter(p => p.g === id); if (!L.length) return '';
      return `<section class="s-group" id="g-${id}"><div class="s-group__head"><div><h3><i>${G[id].verb}</i>${G[id].name}</h3><p>${G[id].desc}</p></div><button type="button" data-fg="${id}">Only these (${L.length}) →</button></div><div class="s-grid">${L.map(card).join('')}</div></section>`;
    }).join('');
  }

  // ---- events
  const sideEl = document.getElementById('s-side'), scrim = document.getElementById('s-scrim');
  const openSide = on => { sideEl.classList.toggle('open', on); scrim.classList.toggle('open', on); };
  document.getElementById('s-filterbtn').addEventListener('click', () => openSide(true));
  scrim.addEventListener('click', () => openSide(false));
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-fg],[data-ft],[data-reset],[data-chip],[data-close],[data-quick]'); if (!t) return;
    if (t.hasAttribute('data-close')) { openSide(false); return; }
    if (t.hasAttribute('data-fg')) { e.preventDefault(); state.g = t.dataset.fg; state.t = ''; if (t.closest('.s-group__head, .s-head')) document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }
    else if (t.hasAttribute('data-ft')) state.t = state.t === t.dataset.ft ? '' : t.dataset.ft;
    else if (t.hasAttribute('data-reset')) { state.g = state.t = state.pr = state.q = ''; state.b = []; state.sort = 'rec'; document.getElementById('s-q').value = ''; document.getElementById('s-sort').value = 'rec'; }
    else if (t.hasAttribute('data-quick')) { const [g, ty] = t.dataset.quick.split('|'); state.g = g; state.t = ty || ''; state.q = ''; document.getElementById('s-q').value = ''; document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }
    else if (t.hasAttribute('data-chip')) {
      const c = t.dataset.chip;
      if (c === 'g') { state.g = state.t = ''; } else if (c === 'p') state.pr = ''; else if (c === 'q') { state.q = ''; document.getElementById('s-q').value = ''; } else state.b = state.b.filter(b => 'b:' + b !== c);
    }
    render();
  });
  sideEl.addEventListener('change', e => {
    const b = e.target.dataset.fb, p = e.target.dataset.fp;
    if (b) state.b = e.target.checked ? [...state.b, b] : state.b.filter(x => x !== b);
    if (p) state.pr = p;
    render();
  });
  let qt; document.getElementById('s-q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 120); });
  document.getElementById('s-q').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); });
  document.getElementById('s-sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  addEventListener('hashchange', () => { readHash(); render(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') openSide(false); });

  document.getElementById('s-total').textContent = P.length;
  readHash(); render();
})();
