(function () {
  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');

  function sync() {
    var dark = root.getAttribute('data-theme') === 'dark';
    button.textContent = dark ? '☀' : '☾';
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  sync();
  button.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(root.dataset.themeStorageKey, next);
    sync();
  });
})();
