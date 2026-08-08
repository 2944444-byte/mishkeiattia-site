(function () {
  var CSS = [
    '[data-nav-toggle]{display:none;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid #d8dee5;border-radius:8px;background:#fff;cursor:pointer;padding:0;color:#1F3A5F}',
    '[data-nav-toggle]:hover{border-color:#2E7D52}',
    '[data-nav-toggle]:focus-visible{outline:3px solid #ffe600;outline-offset:2px}',
    '@media (max-width:820px){',
    '  [data-nav]{display:none!important}',
    '  [data-nav].nav-open{display:flex!important;flex-basis:100%;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 0 4px;border-top:1px solid #eef1f4;margin-top:6px}',
    '  [data-nav].nav-open>a{width:100%;padding:11px 2px;font-size:16px;min-height:44px;display:flex;align-items:center}',
    '  [data-nav-toggle]{display:flex!important;margin-inline-start:auto}',
    '  [data-nav-cta]{margin-inline-start:0!important}',
    '}'
  ].join('\n');

  var st = document.createElement('style');
  st.id = 'nav-responsive';
  st.textContent = CSS;
  document.head.appendChild(st);

  function wire() {
    var btn = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!btn || !nav || btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var tries = 0;
  var iv = setInterval(function () {
    wire();
    if (++tries > 40 || document.querySelector('[data-nav-toggle][data-wired]')) clearInterval(iv);
  }, 150);
  document.addEventListener('DOMContentLoaded', wire);
})();
