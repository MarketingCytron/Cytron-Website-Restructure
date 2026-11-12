// ---- Design H: Cytron AI Assistant (scripted mockup, 11 Nov 2026)
// Opens from the header search ("Ask AI") and from the homepage "Ask Cytron AI" box.
// Answers are pre-written for 5 sample questions; typed questions are matched by keyword.
// Products, prices and links are real my.cytron.io items as shown elsewhere in this mockup (prices as of 3 Nov 2026).
// The real assistant would read the live catalogue (price, stock, compatibility) instead of this list.
(function () {
  var openers = document.querySelectorAll('[data-h-ai-open]');
  if (!openers.length) return;

  var IMG = 'https://static.cytron.io/image/cache/catalog/products/';
  var P = {
    ioc_mqtt: { n: 'IRIV IO Controller MQTT', p: 'RM334.95', u: 'https://my.cytron.io/p-iriv-io-controller-mqtt-ir4.0-industrial-i-o-controller-with-mqtt-ready', i: IMG + 'IRIV-IOC-MQTT/ppp3.1-268x268.png' },
    acrel: { n: 'Acrel ADL Power Meter', p: 'RM149.00++', u: 'https://my.cytron.io/p-adl-power-meter', i: IMG + 'V-ADL-PMETER/v-adl-pmeter-main-800x800.jpg' },
    rs485usb: { n: 'USB to RS485 Converter', p: 'RM29.00', u: 'https://my.cytron.io/p-usb-to-rs485-converter', i: IMG + 'CA-RS485-USB/ca-rs485-usb-a-268x268.jpg' },
    ug56: { n: 'UG56 Industrial LoRaWAN® Gateway', p: 'RM998.75', u: 'https://my.cytron.io/p-ug56-industrial-lorawan-gateway-without-cellular', i: IMG + 'LR-UG56-NC/lr56-h-268x268.png' },
    uc100: { n: 'UC100 IoT Controller (Modbus RTU to LoRaWAN)', p: 'RM223.85++', u: 'https://my.cytron.io/p-uc100-iot-controller-modbus-rtu-to-lorawan', i: IMG + 'V-LR-UC100/milesight-uc100-002-800x800-268x268.jpg' },
    sht40: { n: 'SHT40 Temperature & Humidity Sensor (RS485)', p: 'RM35.00++', u: 'https://my.cytron.io/p-sht40-rs485-temperature-and-humidity-sensor', i: IMG + 'V-SN-HUTE-RS485/v-sn-hute-rs485-main-268x268.png' },
    safetybox: { n: 'IRIV EdgeAI Safety Box: PPE and Zone Monitoring', p: 'RM7,999.00', u: 'https://my.cytron.io/p-iriv-edgeai-safety-box-kit', i: IMG + 'KIT-IRIV-EAI-PPE/safety-box-b-268x268.png' },
    edgeai: { n: 'IRIV EdgeAI CM5 Industrial AI Controller', p: 'RM2,487.00++', u: 'https://my.cytron.io/p-iriv-edge-ai-cm5', i: IMG + 'V-IRIV-EAI5/iriv-edgeai-cm5-view-1-1-268x268.png' },
    eaitrain: { n: 'IRIV EdgeAI Training: Getting Started with EdgeAI Vision', p: 'RM5,000.00', u: 'https://my.cytron.io/iriv-edge-ai-training-page', i: IMG + 'V-KIT-IRIV-EAI/edge-ai-kit-a-268x268.png' },
    imd16: { n: '16Amp 7-30V Industrial DC Motor Driver', p: 'RM163.80', u: 'https://my.cytron.io/p-16amp-7-30v-industrial-dc-motor-driver', i: IMG + 'IMD16/imd16-a-268x268.png' },
    md20a: { n: '20Amp 6V-30V DC Motor Driver', p: 'RM97.44', u: 'https://my.cytron.io/p-20amp-6v-30v-dc-motor-driver', i: IMG + 'MD20A/MD20A%20-%20800x800-268x268.jpeg' },
    md25hv: { n: '25Amp 7V-58V High Voltage DC Motor Driver', p: 'RM273.00', u: 'https://my.cytron.io/p-25amp-7v-58v-high-voltage-dc-motor-driver', i: IMG + 'MD25HV/High%20Voltage%20Motor%20Driver%20MD25HV-268x268.jpg' },
    hatplus: { n: 'Industrial IO HAT+ for Raspberry Pi 5 and Argon Industria Case', p: 'RM138.60', u: 'https://my.cytron.io/p-industry-hat-plus-for-raspberry-pi-5', i: IMG + 'HAT-IND-AG/hat-ind-ag-a-268x268.png' },
    rpi5: { n: 'Raspberry Pi 5', p: '', u: 'https://my.cytron.io/p-raspberry-pi-5', i: IMG + 'V-RASPBERRY-PI-5/v-raspberry-pi-5-main-800x800.jpg' }
  };
  var MEET = 'design-h-meet-engineers.html';
  var S = {
    energy: {
      q: 'Read a Modbus energy meter and send the data to the cloud',
      kw: /energy|meter|kwh|power|elektrik|tenaga|bil|modbus/,
      a: 'You need three parts: a power meter with an RS485 Modbus output, a controller that reads it, and a way to send the readings to your dashboard. This is a simple starting setup:',
      items: [['acrel', 'Measures voltage, current and energy, with an RS485 Modbus output.'], ['ioc_mqtt', 'Industrial I/O controller, MQTT ready, to send readings to your dashboard.'], ['rs485usb', 'Handy for testing the meter from a laptop before you install it.']],
      guide: ['How Raspberry Pi Reads Data from Industrial Sensors', 'design-h-industry-article.html?slug=how-raspberry-pi-reads-industrial-sensors'],
      meet: 'Monitoring many meters or a whole building? Our engineers can plan it with you.',
      next: ['lorawan', 'compat']
    },
    lorawan: {
      q: 'Monitor temperature in 3 warehouses without running cables',
      kw: /temp|suhu|warehouse|gudang|lorawan|wireless|wayar|humid|cold room|cold-room/,
      a: 'For wireless sensing across several buildings, LoRaWAN is the usual choice. Sensors send their readings by radio to a gateway, and the gateway passes them to your network or dashboard.',
      items: [['ug56', 'Collects data from your LoRaWAN sensors and sends it on to your network.'], ['uc100', 'Turns an RS485 Modbus sensor into a wireless LoRaWAN node.'], ['sht40', 'Temperature and humidity sensor to pair with the UC100.']],
      guide: ['Milesight IoT Kits & Solutions', 'https://my.cytron.io/milesight-iot-kits-solutions'],
      meet: 'Gateway coverage depends on walls and the distance between your warehouses. Our engineers can check your layout.',
      next: ['energy', 'safety']
    },
    safety: {
      q: 'Detect workers without safety helmets on the factory floor',
      kw: /helmet|ppe|safety|keselamatan|topi|camera|kamera|vision|detect|zone/,
      a: 'This is an edge AI vision job: cameras watch the area and an AI controller on site flags anyone without PPE. You can start from a ready-made kit or build your own.',
      items: [['safetybox', 'Ready-made kit for PPE and zone monitoring.'], ['edgeai', 'Build your own vision application on our industrial AI controller.'], ['eaitrain', 'Hands-on training for your team to get started with edge AI vision.']],
      guide: ['Real-Time PPE Detection on Raspberry Pi With Edge AI', 'design-h-industry-article.html?slug=real-time-ppe-detection-raspberry-pi'],
      meet: 'Want to see it working first? Book a Meet & Greet and our engineers will walk you through it.',
      next: ['energy', 'motor']
    },
    motor: {
      q: 'Which motor driver for a 24V DC motor drawing up to 15A?',
      kw: /motor|driver|pemandu|24 ?v|amp/,
      a: 'For a 24 V brushed DC motor at up to 15 A, pick a driver rated above your running current. Check the motor’s stall current too, because it can be several times higher.',
      items: [['imd16', 'Industrial version, rated 16 A at 7–30 V. Covers your motor with a little headroom.'], ['md20a', 'More headroom (20 A) at a lower price, for general use.'], ['md25hv', 'Pick this if you may move to 36 V or 48 V motors later.']],
      guide: ['All Motor Drivers', 'https://my.cytron.io/c-motor-driver'],
      next: ['compat', 'energy']
    },
    compat: {
      q: 'Does the Industrial IO HAT+ work with Raspberry Pi 5?',
      kw: /hat|pi ?5|compatib|serasi|work with|fit/,
      a: 'Yes. The Industrial IO HAT+ is made for Raspberry Pi 5, to add industrial inputs and outputs. Check the product page for exactly what comes in the box.',
      items: [['hatplus', 'Industrial inputs and outputs for Raspberry Pi 5.'], ['rpi5', 'The board it is made for, if you don’t have one yet.']],
      guide: ['How Raspberry Pi Reads Data from Industrial Sensors', 'design-h-industry-article.html?slug=how-raspberry-pi-reads-industrial-sensors'],
      next: ['energy', 'motor']
    }
  };
  var ORDER = ['energy', 'lorawan', 'safety', 'motor', 'compat'];

  // --- icons
  var SPARK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M11 2.5l1.9 5.2 5.2 1.9-5.2 1.9L11 16.7l-1.9-5.2-5.2-1.9 5.2-1.9z"/><path d="M18.5 13.5l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" opacity=".75"/></svg>';
  var SEND = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CLOSE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var CART = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>';
  var BOOK = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg>';
  var PEOPLE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14c2.6 0 4.4 1.6 5 4"/></svg>';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  // --- the drawer
  var dlg = el('div', 'hai');
  dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'hai-title'); dlg.hidden = true;
  dlg.innerHTML =
    '<div class="hai__scrim" data-hai-close></div>' +
    '<div class="hai__panel">' +
      '<div class="hai__head"><span class="hai__logo">' + SPARK + '</span><div><h2 id="hai-title">Cytron AI Assistant</h2><p>Find the right product for your project</p></div>' +
      '<button type="button" class="hai__new" data-hai-new>New chat</button><button type="button" class="hai__x" data-hai-close aria-label="Close assistant">' + CLOSE + '</button></div>' +
      '<div class="hai__log" role="log" aria-live="polite" tabindex="0"></div>' +
      '<form class="hai__form" novalidate><label class="sr" for="hai-in">Ask about a product or project</label>' +
        '<input id="hai-in" type="text" autocomplete="off" placeholder="Describe your project or ask a question">' +
        '<button type="submit" class="hai__send" aria-label="Send">' + SEND + '</button></form>' +
      '<p class="hai__note">Mockup with sample answers. AI can make mistakes, so check the product page for the latest price and stock.</p>' +
    '</div>';
  document.body.appendChild(dlg);
  var log = dlg.querySelector('.hai__log'), form = dlg.querySelector('.hai__form'), input = dlg.querySelector('#hai-in');
  var lastFocus = null, busy = false;

  function scrollEnd() { log.scrollTop = log.scrollHeight; }
  function chips(ids, cls) {
    var w = el('div', cls || 'hai__chips');
    ids.forEach(function (id) {
      var b = el('button', 'hai__chip', esc(S[id].q)); b.type = 'button'; b.setAttribute('data-hai-ask', id); w.appendChild(b);
    });
    return w;
  }
  function welcome() {
    log.innerHTML = '';
    var m = el('div', 'hai__msg hai__msg--ai');
    m.appendChild(el('span', 'hai__av', SPARK));
    var b = el('div', 'hai__bub');
    b.appendChild(el('p', null, 'Hi! Tell me what you’re building or the problem you need to solve, in your own words. I’ll suggest products, check what works together and point you to a guide.'));
    b.appendChild(el('p', 'hai__lbl', 'Try one of these:'));
    b.appendChild(chips(ORDER, 'hai__chips hai__chips--col'));
    m.appendChild(b); log.appendChild(m);
  }
  function userMsg(text) {
    var m = el('div', 'hai__msg hai__msg--me'); m.appendChild(el('div', 'hai__bub', esc(text))); log.appendChild(m); scrollEnd();
  }
  function card(key, why) {
    var p = P[key], opt = /\+\+$/.test(p.p) || !p.p;
    var c = el('div', 'hai__pc');
    c.innerHTML = '<span class="hai__pimg"><img src="' + p.i + '" alt="" width="64" height="64" loading="lazy"></span>' +
      '<span class="hai__pbody"><a class="hai__pname" href="' + p.u + '" target="_blank" rel="noopener">' + esc(p.n) + '</a>' +
      '<span class="hai__pwhy">' + esc(why) + '</span>' +
      '<span class="hai__prow"><b class="hai__price">' + (p.p ? esc(p.p) : '') + '</b>' +
      (opt ? '<a class="hai__cart" href="' + p.u + '" target="_blank" rel="noopener">' + (p.p ? 'View options' : 'View price') + '</a>'
           : '<button type="button" class="hai__cart" data-h-cart="' + esc(p.n) + '">' + CART + '<span>Add to Cart</span></button>') +
      '</span></span>';
    return c;
  }
  function aiReply(build) {
    busy = true;
    var m = el('div', 'hai__msg hai__msg--ai'); m.appendChild(el('span', 'hai__av', SPARK));
    var t = el('div', 'hai__bub hai__typing', '<i></i><i></i><i></i>'); t.setAttribute('aria-label', 'Assistant is typing');
    m.appendChild(t); log.appendChild(m); scrollEnd();
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () {
      var b = el('div', 'hai__bub'); build(b); m.replaceChild(b, t); busy = false;
      // keep the question and the top of the answer in view
      var q = m.previousElementSibling || m;
      log.scrollTop = Math.max(0, q.offsetTop - log.offsetTop - 8);
    }, reduce ? 150 : 900);
  }
  function answer(id) {
    var s = S[id];
    aiReply(function (b) {
      b.appendChild(el('p', null, esc(s.a)));
      var list = el('div', 'hai__pcs'); s.items.forEach(function (it) { list.appendChild(card(it[0], it[1])); }); b.appendChild(list);
      var g = el('a', 'hai__guide', BOOK + '<span><small>Related guide</small>' + esc(s.guide[0]) + '</span>');
      g.href = s.guide[1]; if (/^https?:/.test(s.guide[1])) { g.target = '_blank'; g.rel = 'noopener'; }
      b.appendChild(g);
      if (s.meet) {
        var mt = el('div', 'hai__meet', '<p>' + esc(s.meet) + '</p>');
        var a = el('a', 'hai__meetbtn', PEOPLE + '<span>Book a Meet &amp; Greet</span>'); a.href = MEET; mt.appendChild(a); b.appendChild(mt);
      }
      b.appendChild(el('p', 'hai__lbl', 'You could also ask:'));
      b.appendChild(chips(s.next));
    });
  }
  function fallback(text) {
    aiReply(function (b) {
      b.appendChild(el('p', null, 'In this mockup I can only answer the sample questions. The real assistant would search the whole catalogue for this.'));
      var a = el('a', 'hai__guide', '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span><small>Search the store instead</small>“' + esc(text) + '”</span>');
      a.href = 'https://my.cytron.io/search?search=' + encodeURIComponent(text); a.target = '_blank'; a.rel = 'noopener';
      b.appendChild(a);
      b.appendChild(el('p', 'hai__lbl', 'Try one of these:'));
      b.appendChild(chips(ORDER, 'hai__chips hai__chips--col'));
    });
  }
  function match(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < ORDER.length; i++) if (S[ORDER[i]].kw.test(t)) return ORDER[i];
    return null;
  }
  function ask(text, id) {
    if (busy) return;
    text = (text || '').trim(); if (!text && !id) return;
    if (!text) text = S[id].q;
    userMsg(text);
    var hit = id || match(text);
    if (hit) answer(hit); else fallback(text);
  }

  function open(text, id) {
    if (dlg.hidden) {
      lastFocus = document.activeElement;
      dlg.hidden = false; document.documentElement.classList.add('hai-open');
      if (!log.children.length) welcome();
      requestAnimationFrame(function () { dlg.classList.add('is-in'); });
    }
    if (text || id) ask(text, id);
    setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    dlg.classList.remove('is-in'); dlg.hidden = true; document.documentElement.classList.remove('hai-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
  dlg.addEventListener('click', function (e) {
    var q = e.target.closest('[data-hai-ask]'); if (q) { ask('', q.getAttribute('data-hai-ask')); return; }
    if (e.target.closest('[data-hai-close]')) { close(); return; }
    if (e.target.closest('[data-hai-new]')) { if (!busy) { welcome(); input.focus(); } }
  });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    var f = dlg.querySelectorAll('.hai__panel a[href], .hai__panel button, .hai__panel input, .hai__log');
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // --- openers: header "Ask AI" pill (takes what's typed in the search box), mobile icon, homepage box
  openers.forEach(function (o) {
    o.addEventListener('click', function (e) {
      e.preventDefault();
      var src = o.getAttribute('data-h-ai-open'), text = '';
      if (src) { var f = document.querySelector(src); if (f) { text = f.value; f.value = ''; } }
      open(text, o.getAttribute('data-hai-ask'));
    });
  });
  document.querySelectorAll('[data-h-ai-form]').forEach(function (f) {
    var fi = f.querySelector('input');
    if (window.matchMedia && matchMedia('(max-width:600px)').matches && fi) fi.placeholder = 'Describe your project';
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var i = f.querySelector('input'); var v = i.value; i.value = ''; open(v);
    });
  });
})();
