/* The Adversarial System — light/dark theme.
   Applies the saved preference immediately on load, then defines
   <tas-theme-toggle>, the small ☾/☀ button used in the running header. */
(function () {
  var KEY = 'tas-theme';
  var root = document.documentElement;

  function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function apply(t) { root.setAttribute('data-theme', t); }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* blocked */ }
  apply((saved === 'dark' || saved === 'light') ? saved
    : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  // Follow OS changes only until the visitor chooses explicitly.
  if (!saved && window.matchMedia) {
    try {
      matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var chosen = null;
        try { chosen = localStorage.getItem(KEY); } catch (err) { /* blocked */ }
        if (!chosen) apply(e.matches ? 'dark' : 'light');
      });
    } catch (e) { /* older browsers */ }
  }

  if (!customElements.get('tas-theme-toggle')) {
    var TasThemeToggle = function () { return Reflect.construct(HTMLElement, [], TasThemeToggle); };
    TasThemeToggle.prototype = Object.create(HTMLElement.prototype, {
      connectedCallback: { value: function () {
        if (this._btn) return;
        var self = this;
        var b = document.createElement('button');
        this._btn = b;
        b.type = 'button';
        b.style.cssText = "display:flex;align-items:center;justify-content:center;width:34px;height:30px;padding:0;cursor:pointer;background:transparent;border:1px solid var(--line);color:var(--muted);font:500 13px/1 'IBM Plex Mono',monospace;transition:color .2s,border-color .2s";
        b.addEventListener('mouseenter', function () { b.style.borderColor = 'var(--ink)'; b.style.color = 'var(--ink)'; });
        b.addEventListener('mouseleave', function () { b.style.borderColor = 'var(--line)'; b.style.color = 'var(--muted)'; });
        var sync = function () {
          var dark = current() === 'dark';
          b.textContent = dark ? '\u2600' : '\u263E'; // ☀ / ☾
          b.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
          b.setAttribute('aria-label', b.title);
        };
        b.addEventListener('click', function () {
          var next = current() === 'dark' ? 'light' : 'dark';
          apply(next);
          try { localStorage.setItem(KEY, next); } catch (e) { /* blocked */ }
        });
        sync();
        self.style.display = 'flex';
        self.appendChild(b);
        this._obs = new MutationObserver(sync);
        this._obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
      } },
      disconnectedCallback: { value: function () { if (this._obs) this._obs.disconnect(); } }
    });
    Object.setPrototypeOf(TasThemeToggle, HTMLElement);
    customElements.define('tas-theme-toggle', TasThemeToggle);
  }
})();
