(function () {
  var root = document.documentElement;
  var saved = localStorage.getItem(root.dataset.themeStorageKey);
  var theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);
})();
