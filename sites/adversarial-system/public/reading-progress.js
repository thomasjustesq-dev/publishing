(function () {
  var bar = document.getElementById('reading-progress');
  if (!bar) return;
  bar.hidden = false;
  function update() {
    var el = document.documentElement;
    var scrollTop = el.scrollTop || document.body.scrollTop;
    var height = el.scrollHeight - el.clientHeight;
    var pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
