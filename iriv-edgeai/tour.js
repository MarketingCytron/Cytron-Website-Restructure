// IRIV EdgeAI CM5 product page (Design G): film player, live AI demo, pin maps, compatible parts,
// system builder, recipes and specs. Adapted from the IRIV EdgeAI CM5 tour by Dinesh Pal Singh (Cytron industry team).

// Page chrome, as on the Design F/G industry page: mobile menu, header search mockup, strategy notes
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
})();

/* ---------- player ---------- */
const cv = document.getElementById('film-canvas'), fctx = cv.getContext('2d');
const screen = document.getElementById('screen'), seek = document.getElementById('seek'), timeEl = document.getElementById('time');
const playBtn = document.getElementById('play');
const ICON = { play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>', pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>' };
let t = 2.2, playing = false, last = 0, scrubbing = false;
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
// The film only redraws while it is playing and on screen, or after a seek; a paused or
// scrolled-away film costs nothing, so the rest of the page scrolls smoothly.
let dirty = true, onScreen = true;
function setPlaying(on) { playing = on; screen.classList.toggle('playing', on); playBtn.innerHTML = on ? ICON.pause : ICON.play; playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play'); if (on && t >= TOTAL - .05) t = 0; dirty = true; }
function sizeCanvas() {
  const w = Math.max(320, Math.min(FW, Math.round(cv.clientWidth * Math.min(2, devicePixelRatio || 1))));
  if (cv.width !== w) { cv.width = w; cv.height = Math.round(w * FH / FW); }
  dirty = true;
}
addEventListener('resize', sizeCanvas);
new IntersectionObserver(es => { onScreen = es[0].isIntersecting; dirty = true; }).observe(screen);
const chapters = SCENES.map((s, i) => ({ i, label: s.g ? G[s.g].name : i === 0 ? 'Intro' : i === SCENES.length - 1 ? 'Outro' : s.kicker })).filter((c, i) => i > 0 && i < SCENES.length - 1);
document.getElementById('chapters').innerHTML = chapters.map(c => `<button data-i="${c.i}">${c.label}</button>`).join('');
document.getElementById('chapters').onclick = e => { const b = e.target.closest('button'); if (!b) return; t = SCENES[+b.dataset.i].t0; setPlaying(true); };
const chapBtns = [...document.querySelectorAll('#chapters button')];
let curScene = -1;
function loop(now) {
  const dt = Math.min(.1, (now - last) / 1000); last = now;
  const live = onScreen && !document.hidden;
  if (playing && !scrubbing && live) { t += dt; dirty = true; if (t >= TOTAL) { t = TOTAL - .001; setPlaying(false); } }
  if (dirty && live) {
    dirty = false;
    render(fctx, t, cv.width / FW);
    if (!scrubbing) seek.value = Math.round(t / TOTAL * 1000);
    timeEl.textContent = `${fmt(t)} / ${fmt(TOTAL)}`;
    const cur = sceneAt(t);
    if (cur !== curScene) { curScene = cur; chapBtns.forEach(b => b.classList.toggle('on', +b.dataset.i === cur)); }
  }
  requestAnimationFrame(loop);
}
filmReady.then(() => { sizeCanvas(); requestAnimationFrame(n => { last = n; loop(n); }); });
screen.onclick = () => setPlaying(!playing);
playBtn.onclick = () => setPlaying(!playing);
document.getElementById('restart').onclick = () => { t = 0; setPlaying(true); };
seek.oninput = () => { scrubbing = true; t = seek.value / 1000 * TOTAL; dirty = true; };
seek.onchange = () => { scrubbing = false; };
setPlaying(false);
// start playing once the film scrolls into view
new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting && !matchMedia('(prefers-reduced-motion: reduce)').matches) { setPlaying(true); ob.disconnect(); } }), { threshold: .6 }).observe(screen);

const dl = document.getElementById('dl'), note = document.getElementById('dlnote');
dl.onclick = async () => {
  dl.disabled = true; note.textContent = 'Rendering the video… 0%';
  try {
    const blob = await exportVideo(p => { note.textContent = `Rendering the video… ${Math.round(p * 100)}%`; });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'IRIV-EdgeAI-CM5-tour.' + (blob.type.includes('mp4') ? 'mp4' : 'webm'); a.click();
    note.textContent = `Saved ${a.download} (${(blob.size / 1e6).toFixed(1)} MB, 1920×1080).`;
  } catch (e) {
    note.textContent = 'This browser could not render the video. Use the ready-made MP4 link instead.';
  }
  dl.disabled = false;
};

/* ---------- interactive maps ---------- */
function termList(g) {
  const ts = TERMINALS.filter(x => x.group === g.id), seen = new Set();
  const rows = ts.filter(x => !seen.has(x.name + x.fn) && seen.add(x.name + x.fn));
  return rows.length ? `<ul class="terms">${rows.map(x => `<li><b>${x.name}</b><span>${x.fn}</span></li>`).join('')}</ul>` : '';
}
function buildMap(el, img, vb, ids) {
  const hot = ids.map(id => { const g = G[id]; return `<g class="hot" data-id="${id}" style="--c:${g.color}" tabindex="0" role="button" aria-label="${g.name}">${g.rects.map(([x0, y0, x1, y1]) => `<rect x="${x0 - 3}" y="${y0 - 3}" width="${x1 - x0 + 6}" height="${y1 - y0 + 6}" rx="5"/>`).join('')}</g>`; }).join('');
  const cards = ids.map(id => { const g = G[id]; return `<button class="card" data-id="${id}" style="--c:${g.color}" aria-expanded="false"><div class="nm"><i></i>${g.name}</div><div class="more"><h3>${g.title}</h3><p>${g.body}</p><div class="chips">${g.chips.map(c => `<span>${c}</span>`).join('')}</div>${termList(g)}</div></button>`; }).join('');
  el.innerHTML = `<div class="stage"><svg viewBox="${vb}" role="group" aria-label="${img} view"><image href="${IMG[img]}" width="800" height="800"/>${hot}</svg></div><div class="list">${cards}</div>`;
  const select = id => el.querySelectorAll('[data-id]').forEach(n => { const on = n.dataset.id === id; n.classList.toggle('on', on); if (n.classList.contains('card')) n.setAttribute('aria-expanded', on); });
  el.addEventListener('click', e => { const n = e.target.closest('[data-id]'); if (n) select(n.dataset.id); });
  el.addEventListener('keydown', e => { const n = e.target.closest('.hot'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(n.dataset.id); } });
  select(ids[0]);
  return select;
}
const selectFront = buildMap(document.getElementById('map-front'), 'front', '15 145 775 505', ['power', 'rs485', 'di', 'do', 'led', 'lan', 'status', 'boot', 'wifi']);
buildMap(document.getElementById('map-side'), 'iso', '440 470 300 260', ['cams', 'usb', 'cell']);

/* ---------- terminal diagram ---------- */
const blockHtml = b => {
  const ts = TERMINALS.filter(x => x.block === b), cell = x => `<button class="pin" data-g="${x.group}" style="--c:${G[x.group].color}" title="${x.fn}"><i></i><span>${x.name.replace('RS485 ', '').replace('RS232 ', '')}</span></button>`;
  return `<div class="block"><h4>Terminal block · power, RS485, inputs, outputs, lights</h4><div class="row">${ts.filter(x => x.row === 'top').map(cell).join('')}</div><div class="row">${ts.filter(x => x.row === 'bottom').map(cell).join('')}</div></div>`;
};
const blocks = document.getElementById('blocks');
blocks.innerHTML = blockHtml(1);
blocks.onclick = e => {
  const p = e.target.closest('.pin'); if (!p) return;
  blocks.querySelectorAll('.pin').forEach(n => n.classList.toggle('on', n.dataset.g === p.dataset.g));
  selectFront(p.dataset.g);
};
document.getElementById('legend').innerHTML = ['power', 'rs485', 'di', 'do', 'led'].map(id => `<span style="--c:${G[id].color}"><i></i>${G[id].name}</span>`).join('');

/* ---------- what you can connect ---------- */
const TAB_COLOR = Object.fromEntries(CONNECT.map(c => [c.id, c.color]));
const tabOf = k => CONNECT.find(c => c.items.includes(k));
const usesText = k => k === CONTROLLER ? 'The controller' : USES[k].length ? USES[k].map(r => RES[r][1]).join(' + ') : 'No port needed';
const VIEWBOX = { front: '165 468 625 185', iso: '470 530 270 200' };
// The real product photo with the tab's port highlighted.
function portView(c, color) {
  const [img, gids] = c.view, gs = gids.map(id => G[id]);
  const rects = gs.flatMap(g => g.rects).map(([x0, y0, x1, y1]) => `<rect x="${x0 - 3}" y="${y0 - 3}" width="${x1 - x0 + 6}" height="${y1 - y0 + 6}" rx="4"/>`).join('');
  const rings = gs.flatMap(g => g.pins || []).flatMap(p => (p.pair || [p.x]).map(x => `<circle cx="${x}" cy="${p.y}" r="5.5"/>`)).join('');
  return `<div class="portview" style="--c:${color}"><svg viewBox="${VIEWBOX[img]}" role="img" aria-label="${c.label} on the ${PRODUCT}">
      <image href="${IMG[img]}" width="800" height="800"/>
      <mask id="pvmask"><rect width="800" height="800" fill="#fff"/><g fill="#000">${rects}</g></mask>
      <rect width="800" height="800" fill="#fff" fill-opacity=".38" mask="url(#pvmask)"/>
      <g class="pv-hot">${rects}${rings}</g></svg>
    <div class="pvcap"><span>Lands on <b>${c.ports}</b></span>${c.devices.map((d, i) => `<span class="dev">${icon(c.icons[i], 16)}${d}</span>`).join('')}</div></div>`;
}
function prodCard(k, showTag) {
  const p = PRODUCTS[k], t = tabOf(k), color = TAB_COLOR[t.id], n = sys[k] || 0;
  return `<div class="prod${n ? ' in-sys' : ''}" data-k="${k}" style="--c:${color}"><div class="top"><div class="ic">${icon(p.icon, 26)}</div>${showTag ? `<span class="ptag">${t.label}</span>` : ''}</div>
    <b><a href="${p.url}" target="_blank" rel="noopener">${p.name}</a></b><p>${p.note}</p><div class="uses">Uses <span>${usesText(k)}</span></div>
    <div class="ft"><span class="price">${rm(p.price)}</span><a href="${p.url}" target="_blank" rel="noopener">Cytron ↗</a><button class="add${n ? ' on' : ''}" data-add="${k}">${n ? `✓ ${n} added` : '+ Add'}</button></div></div>`;
}
const tabs = document.getElementById('tabs'), cpanel = document.getElementById('cpanel'), psearch = document.getElementById('psearch');
tabs.innerHTML = CONNECT.map(c => `<button class="tab" role="tab" data-id="${c.id}" style="--c:${TAB_COLOR[c.id]}"><i></i>${c.label}</button>`).join('');
let curTab = CONNECT[0].id, curTopic = 'All';
function showTab(id, topic = 'All') {
  curTab = id; curTopic = topic;
  const c = CONNECT.find(x => x.id === id), color = TAB_COLOR[id];
  tabs.querySelectorAll('.tab').forEach(b => { const on = b.dataset.id === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  const items = topic === 'All' || !c.topics ? c.items : c.topics[topic];
  cpanel.innerHTML = `<div class="cpanel">${portView(c, color)}
    <div class="tipcard" style="--c:${color}"><h3>${c.label}</h3><p>${c.lede}</p><ul>${c.tips.map(t => `<li>${t}</li>`).join('')}</ul>
    ${c.generic ? `<div class="generic"><b>Typical devices</b><div class="chips">${c.generic.map(g => `<span>${g}</span>`).join('')}</div></div>` : ''}</div></div>
    ${c.topics ? `<div class="filters">${['All', ...Object.keys(c.topics)].map(t => `<button data-topic="${t}" class="${t === topic ? 'on' : ''}">${t}</button>`).join('')}</div>` : ''}
    <div class="products">${items.map(k => prodCard(k)).join('')}</div>`;
}
function showSearch(q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = Object.keys(USES).filter(k => tabOf(k)).filter(k => { const p = PRODUCTS[k], hay = `${p.name} ${p.note} ${tabOf(k).label} ${usesText(k)}`.toLowerCase(); return words.every(w => hay.includes(w)); });
  tabs.querySelectorAll('.tab').forEach(b => b.classList.remove('on'));
  cpanel.innerHTML = hits.length ? `<div class="products">${hits.map(k => prodCard(k, true)).join('')}</div>` : `<div class="empty">No parts match “${q.replace(/[<&]/g, '')}”. Try “camera”, “light” or “4G”.</div>`;
}
psearch.placeholder = `Search all ${new Set(CONNECT.flatMap(c => c.items)).size} parts`;
tabs.onclick = e => { const b = e.target.closest('.tab'); if (b) { psearch.value = ''; showTab(b.dataset.id); } };
cpanel.addEventListener('click', e => { const f = e.target.closest('[data-topic]'); if (f) showTab(curTab, f.dataset.topic); });
psearch.oninput = () => psearch.value.trim() ? showSearch(psearch.value.trim()) : showTab(curTab, curTopic);

/* ---------- my system builder ---------- */
const SYS_KEY = 'iriv.edgeai.mysystem.v1';
let sys = {};
try { sys = JSON.parse(localStorage.getItem(SYS_KEY)) || {}; } catch { sys = {}; }
for (const k in sys) if (!PRODUCTS[k] || !(sys[k] > 0)) delete sys[k];
const saveSys = () => { try { localStorage.setItem(SYS_KEY, JSON.stringify(sys)); } catch { /* storage may be blocked */ } };
const drawer = document.getElementById('drawer'), scrim = document.getElementById('scrim'), sysbtn = document.getElementById('sysbtn');
function addPart(k, q = 1) {
  if (!sys[CONTROLLER] && k !== CONTROLLER && q > 0) sys[CONTROLLER] = 1;   // every system starts with the controller
  sys[k] = (sys[k] || 0) + q;
  if (sys[k] <= 0) delete sys[k];
  saveSys(); refreshSys();
}
function usage() {
  const ctl = Math.max(1, sys[CONTROLLER] || 0), cap = {}, used = {};
  for (const r in BUDGET) cap[r] = BUDGET[r] * ctl;
  for (const [k, q] of Object.entries(sys)) {
    for (const r of USES[k]) used[r] = (used[r] || 0) + q;
    for (const [r, n] of Object.entries(ADDS[k] || {})) cap[r] += n * q;
  }
  return { ctl, cap, used };
}
const sysTotal = () => Object.keys(sys).reduce((s, k) => s + PRODUCTS[k].price * sys[k], 0);
function renderDrawer() {
  const keys = Object.keys(sys).sort((a, b) => (b === CONTROLLER) - (a === CONTROLLER)), { ctl, cap, used } = usage();
  const meters = Object.keys(BUDGET).filter(r => r !== 'vin' && used[r]).map(r => { const over = used[r] > cap[r]; return `<div class="meter${over ? ' over' : ''}"><div><b>${RES[r][0]}</b><span>${used[r]} / ${cap[r]}</span></div><i><b style="width:${Math.min(100, used[r] / cap[r] * 100)}%"></b></i></div>`; }).join('');
  const warns = Object.keys(FIX).filter(r => (used[r] || 0) > cap[r]).map(r => `<div><b>${RES[r][0]} full.</b> ${FIX[r][0].toUpperCase() + FIX[r].slice(1)}.</div>`);
  warns.push(...extraChecks(sys, used));
  if (!used.vin && keys.length > 1) warns.push('<div><b>No power supply yet.</b> Add the Meanwell 24 V DIN-rail supply.</div>');
  if ((used.vin || 0) > ctl) warns.push('<div><b>More supplies than controllers.</b> One 24 V supply usually runs the controller, its lights and sensors.</div>');
  if (!warns.length && keys.length > 1) warns.push(`<div class="ok">✓ Everything fits on ${ctl === 1 ? 'one ' + PRODUCT : ctl + ' × ' + PRODUCT}.</div>`);
  document.getElementById('dbody').innerHTML = keys.length ? keys.map(k => `<div class="sitem"><div><b>${PRODUCTS[k].name}</b><br><small>${usesText(k)}</small></div>
      <div class="qty"><button data-q="${k}" data-d="-1" aria-label="One fewer">−</button><span>${sys[k]}</span><button data-q="${k}" data-d="1" aria-label="One more">+</button></div>
      <div></div><div class="lp">${rm(PRODUCTS[k].price * sys[k])}</div></div>`).join('') +
      (meters ? `<h4>Ports used</h4><div class="meters">${meters}</div>` : '') + `<div class="warn">${warns.join('')}</div>`
    : '<div class="empty">Nothing here yet. Press <b>+ Add</b> on any part, or load a ready-made system.</div>';
  document.getElementById('dfoot').innerHTML = `<div class="sum"><b>${rm(Math.round(sysTotal()))}</b><br><small>excluding tax, from listed prices</small></div>
    <div class="tbtns"><button class="ghostbtn" id="sclear"${keys.length ? '' : ' disabled'}>Clear</button><button class="ghostbtn" id="scopy"${keys.length ? '' : ' disabled'}>Copy parts list</button></div>
    <button class="quote" id="squote"${keys.length ? '' : ' disabled'}>Request a quotation</button><div class="qnote" id="qnote"></div>`;
  return keys;
}
function refreshSys(bump = true) {
  const keys = renderDrawer(), count = keys.reduce((s, k) => s + sys[k], 0);
  sysbtn.classList.toggle('show', count > 0);
  sysbtn.innerHTML = `My system <em>${count}</em> ${rm(Math.round(sysTotal()))}`;
  if (bump) { sysbtn.classList.remove('bump'); void sysbtn.offsetWidth; sysbtn.classList.add('bump'); }
  document.querySelectorAll('.prod[data-k]').forEach(card => {
    const k = card.dataset.k, n = sys[k] || 0, b = card.querySelector('.add');
    card.classList.toggle('in-sys', !!n); b.classList.toggle('on', !!n); b.textContent = n ? `✓ ${n} added` : '+ Add';
  });
}
const openSys = on => { drawer.classList.toggle('open', on); scrim.classList.toggle('open', on); if (on) document.getElementById('dclose').focus(); };
sysbtn.onclick = () => openSys(true);
scrim.onclick = document.getElementById('dclose').onclick = () => openSys(false);
addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) openSys(false); });
document.addEventListener('click', e => { const a = e.target.closest('[data-add]'); if (a) addPart(a.dataset.add); });
drawer.addEventListener('click', async e => {
  const q = e.target.closest('[data-q]'); if (q) { addPart(q.dataset.q, +q.dataset.d); return; }
  if (e.target.id === 'sclear') { sys = {}; saveSys(); refreshSys(false); }
  const sysText = () => `My ${PRODUCT} system\n` + Object.keys(sys).map(k => `${sys[k]} x ${PRODUCTS[k].name} (${usesText(k)}) - ${rm(PRODUCTS[k].price * sys[k])} - ${PRODUCTS[k].url}`).join('\n') + `\nTotal about ${rm(Math.round(sysTotal()))} excluding tax`;
  if (e.target.id === 'scopy') {
    try { await navigator.clipboard.writeText(sysText()); e.target.textContent = 'Copied ✓'; } catch { e.target.textContent = 'Copy failed'; }
    setTimeout(() => { e.target.textContent = 'Copy parts list'; }, 1800);
  }
  // Request a quotation: copy the list, then open Cytron's quotation form in a new tab
  if (e.target.id === 'squote') {
    let copied = true; try { await navigator.clipboard.writeText(sysText()); } catch { copied = false; }
    window.open('https://my.cytron.io/accept-lo', '_blank', 'noopener');
    document.getElementById('qnote').textContent = copied ? 'Parts list copied. Paste it into the quotation form that just opened.' : 'Use Copy parts list, then paste it into the quotation form.';
  }
});
showTab(CONNECT[0].id);
refreshSys(false);

/* ---------- ready-made systems ---------- */
document.getElementById('recipes').innerHTML = RECIPES.map(r => {
  const total = r.parts.reduce((s, [k, q]) => s + PRODUCTS[k].price * q, 0);
  return `<div class="recipe" style="--c:${r.color}"><div class="hd"><span>${icon(r.icon, 24)}</span><h3>${r.name}</h3></div><p>${r.blurb}</p>
    <ul class="parts">${r.parts.map(([k, q, port]) => `<li><span class="q">${q}×</span><span><a href="${PRODUCTS[k].url}" target="_blank" rel="noopener">${PRODUCTS[k].name}</a><small>${port}</small></span><span class="pr">${rm(PRODUCTS[k].price * q)}</span></li>`).join('')}</ul>
    <div class="total"><b>About ${rm(Math.round(total))}<small>excluding tax, from listed prices</small></b></div>
    <div class="tbtns"><button class="ghostbtn" data-load="${r.id}">Add to my system</button><button class="copy" data-id="${r.id}">Copy parts list</button></div></div>`;
}).join('');
document.getElementById('recipes').onclick = async e => {
  const l = e.target.closest('[data-load]');
  if (l) { RECIPES.find(x => x.id === l.dataset.load).parts.forEach(([k, q]) => { if (k !== CONTROLLER || !sys[CONTROLLER]) addPart(k, q); }); openSys(true); return; }
  const b = e.target.closest('.copy'); if (!b) return;
  const r = RECIPES.find(x => x.id === b.dataset.id);
  const text = `${r.name} with ${PRODUCT}\n` + r.parts.map(([k, q, port]) => `${q} x ${PRODUCTS[k].name} (${port}) - ${rm(PRODUCTS[k].price * q)} - ${PRODUCTS[k].url}`).join('\n');
  try { await navigator.clipboard.writeText(text); b.textContent = 'Copied ✓'; } catch { b.textContent = 'Copy failed'; }
  setTimeout(() => { b.textContent = 'Copy parts list'; }, 1800);
};

/* ---------- live demo ---------- */
const DSTEPS = {
  factory: [['Trigger', 'DI0', 'A photoelectric sensor sees each bottle arrive.', G.di.color], ['Capture', 'MIPI0 + L0', 'The light strobes and the camera grabs a frame.', G.led.color],
    ['Decide', 'AI accelerator', 'The model checks the cap, label and fill in a few milliseconds.', G.cams.color], ['Act', 'DO0 + ETH1', 'Faulty bottles are blown off, and every result goes out over MQTT.', G.do.color]],
  gate: [['Stream', 'ETH0', 'The IP camera streams video over RTSP.', G.lan.color], ['Detect', 'AI accelerator', 'Cars and people are found and tracked in every frame.', G.cams.color],
    ['Read', 'OCR model', 'The plate is read as the car crosses the line.', G.usb.color], ['Act', 'DO0 + ETH1', 'The barrier opens, and the read is logged over MQTT.', G.do.color]]
};
const dcv = document.getElementById('demo-canvas'), dctx = dcv.getContext('2d');
let demoMode = 'factory', demoT = 5, demoOn = false, demoLast = 0;
function showSteps() { document.getElementById('dsteps').innerHTML = DSTEPS[demoMode].map(([t, p, d, c], i) => `<div class="dstep" style="--c:${c}"><small>${i + 1} · ${p}</small><b>${t}</b><p>${d}</p></div>`).join(''); }
function sizeDemo() { const w = Math.max(480, Math.min(2400, Math.round(dcv.clientWidth * Math.min(2, devicePixelRatio || 1)))); if (dcv.width !== w) { dcv.width = w; dcv.height = Math.round(w * 9 / 16); } }
function demoLoop(now) {
  const dt = Math.min(.1, (now - demoLast) / 1000); demoLast = now;
  if (demoOn && !document.hidden) { demoT += dt; dctx.setTransform(dcv.width / 1600, 0, 0, dcv.width / 1600, 0, 0); DEMOS[demoMode](dctx, demoT, 1600, 900); }
  requestAnimationFrame(demoLoop);
}
document.getElementById('dtabs').onclick = e => {
  const b = e.target.closest('[data-demo]'); if (!b) return;
  demoMode = b.dataset.demo; demoT = demoMode === 'gate' ? 8 : 5; showSteps();
  document.querySelectorAll('#dtabs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
};
new IntersectionObserver(es => { demoOn = es[0].isIntersecting; }).observe(dcv);
addEventListener('resize', sizeDemo);
showSteps();
filmReady.then(() => { sizeDemo(); requestAnimationFrame(n => { demoLast = n; demoLoop(n); }); });

/* ---------- specs ---------- */
document.getElementById('cm').innerHTML = [1, 2].map(k => `<div class="cmcard"><h3>${SPECS[0][k].replace('Raspberry Pi ', '')}</h3><dl>${SPECS.slice(1).map(r => `<div><dt>${r[0]}</dt><dd>${r[k]}</dd></div>`).join('')}</dl></div>`).join('');
document.getElementById('kits').innerHTML = KITS.map(([k, v]) => `<div><b>${k}</b><p>${v}</p></div>`).join('');
document.getElementById('feat').innerHTML = FEATURES.map(([k, v]) => `<div><b>${k}</b>${v}</div>`).join('');

/* ---------- scroll reveal ---------- */
const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(n => ro.observe(n));

/* ---------- product bar: price and the section you are in ---------- */
document.getElementById('pb-price').innerHTML = 'From <strong>' + rm(PRODUCTS[CONTROLLER].price) + '</strong>';
const pbLinks = [...document.querySelectorAll('.pbar .links a')];
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) pbLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
pbLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
