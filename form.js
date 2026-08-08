(function () {
  var THANKS = '<div style="padding:40px 10px;text-align:center">' +
    '<div style="font-size:22px;font-weight:700;color:#1F3A5F">תודה, הפנייה נשלחה</div>' +
    '<div style="margin-top:8px;font-size:16px;color:#4b5663;font-family:Assistant,sans-serif">נחזור אליכם בהקדם.</div></div>';

  function err(form, msg) {
    var box = form.querySelector('[data-form-error]');
    if (!box) {
      box = document.createElement('div');
      box.setAttribute('data-form-error', '1');
      box.setAttribute('role', 'alert');
      box.style.cssText = 'background:#fdecec;border:1px solid #f0c2c2;border-radius:6px;padding:12px 14px;font-size:14px;color:#8f2727';
      form.appendChild(box);
    }
    box.textContent = msg;
  }

  function wire(form) {
    if (form.dataset.wired) return;
    form.dataset.wired = '1';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'שולח…'; }
      var box = form.querySelector('[data-form-error]');
      if (box) box.remove();

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.success) {
            var host = form.parentNode;
            host.innerHTML = THANKS;
          } else {
            if (btn) { btn.disabled = false; btn.textContent = label; }
            err(form, 'השליחה נכשלה. אפשר להתקשר אלינו או לנסות שוב.');
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          err(form, 'אין חיבור לרשת. אפשר להתקשר אלינו או לנסות שוב.');
        });
    });
  }

  function init() {
    document.querySelectorAll('form[action*="web3forms"]').forEach(wire);
    var sync = function () {
      var h = document.querySelector('header');
      if (h) document.documentElement.style.scrollPaddingTop = (h.offsetHeight + 14) + 'px';
    };
    sync();
    window.addEventListener('resize', sync);
    if (window.ResizeObserver) {
      var hd = document.querySelector('header');
      if (hd) new ResizeObserver(sync).observe(hd);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
