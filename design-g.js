// ---- Design G: smart city dashboard window
(function () {
  var box = document.getElementById('g-dash'), frame = document.getElementById('g-dash-frame'), cover = document.getElementById('g-dash-cover');
  if (!box || !frame || !cover) return;
  var wide = window.matchMedia ? matchMedia('(min-width: 720px)') : { matches: true };
  // Only load the 3D demo where it is shown (not on phones), and only when it nears the screen
  function load() { if (!frame.src && wide.matches) frame.src = frame.getAttribute('data-src'); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { load(); io.disconnect(); } }, { rootMargin: '400px' });
    io.observe(box);
  } else { load(); }
  if (wide.addEventListener) wide.addEventListener('change', load);
  // The cover stops the page scroll from being caught by the map until the visitor chooses to explore
  cover.addEventListener('click', function () { load(); box.classList.add('is-live'); try { frame.focus(); } catch (e) {} });
  box.querySelector('.g-dash__frame').addEventListener('mouseleave', function () { box.classList.remove('is-live'); });
})();
