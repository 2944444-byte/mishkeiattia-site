(function () {
  if (customElements.get('a11y-widget')) return;

  var KEY = 'mishkei-a11y';
  var STATEMENT = 'Accessibility.dc.html';

  var GLOBAL_CSS = [
    'html.a11y-grayscale{filter:grayscale(1)!important}',
    'html.a11y-contrast-dark{filter:invert(1) hue-rotate(180deg)!important;background:#000!important}',
    'html.a11y-contrast-dark img,html.a11y-contrast-dark video,html.a11y-contrast-dark iframe{filter:invert(1) hue-rotate(180deg)!important}',
    'html.a11y-contrast-high body,html.a11y-contrast-high body *{background-color:#000!important;color:#fff!important;border-color:#fff!important;text-shadow:none!important;box-shadow:none!important}',
    'html.a11y-contrast-high a,html.a11y-contrast-high a *{color:#ffe600!important}',
    'html.a11y-contrast-high img,html.a11y-contrast-high iframe{opacity:.85}',
    'html.a11y-links a{text-decoration:underline!important;text-underline-offset:3px!important;outline:1px dashed currentColor!important;outline-offset:2px!important}',
    'html.a11y-readable body,html.a11y-readable body *{font-family:Arial,"Helvetica Neue",Helvetica,sans-serif!important;letter-spacing:normal!important}',
    'html.a11y-spacing body,html.a11y-spacing body *{line-height:1.9!important;letter-spacing:.06em!important;word-spacing:.14em!important}',
    'html.a11y-still *,html.a11y-still *::before,html.a11y-still *::after{animation:none!important;transition:none!important}',
    'html.a11y-still{scroll-behavior:auto!important}',
    'html.a11y-cursor,html.a11y-cursor *{cursor:url("data:image/svg+xml;utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 48 48\'%3E%3Cpath d=\'M6 2 L6 40 L16 31 L22 45 L30 41 L24 28 L38 28 Z\' fill=\'%23fff\' stroke=\'%23000\' stroke-width=\'2\'/%3E%3C/svg%3E") 4 2, auto!important}',
    'a11y-widget:focus-visible{outline:none}',
    '.a11y-skip{position:absolute;inset-inline-start:-9999px;top:0;z-index:100000;background:#1F3A5F;color:#fff;padding:12px 20px;border-radius:0 0 6px 0;font:600 15px/1 Heebo,Arial,sans-serif}',
    '.a11y-skip:focus{inset-inline-start:0}',
    'html.a11y-focus :focus{outline:3px solid #ffe600!important;outline-offset:2px!important}'
  ].join('');

  var s = document.createElement('style');
  s.id = 'a11y-global';
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);

  var TOGGLES = [
    { k: 'contrastHigh', cls: 'a11y-contrast-high', label: 'ניגודיות גבוהה' },
    { k: 'contrastDark', cls: 'a11y-contrast-dark', label: 'היפוך צבעים' },
    { k: 'grayscale', cls: 'a11y-grayscale', label: 'גווני אפור' },
    { k: 'links', cls: 'a11y-links', label: 'הדגשת קישורים' },
    { k: 'readable', cls: 'a11y-readable', label: 'גופן קריא' },
    { k: 'spacing', cls: 'a11y-spacing', label: 'ריווח שורות מוגדל' },
    { k: 'cursor', cls: 'a11y-cursor', label: 'סמן עכבר גדול' },
    { k: 'still', cls: 'a11y-still', label: 'עצירת אנימציות' },
    { k: 'focus', cls: 'a11y-focus', label: 'הדגשת מיקוד מקלדת' }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(st) {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }

  function apply(st) {
    var root = document.documentElement;
    TOGGLES.forEach(function (t) { root.classList.toggle(t.cls, !!st[t.k]); });
    var z = st.zoom || 1;
    document.body.style.zoom = z === 1 ? '' : String(z);
  }

  var CSS = [
    ':host{position:fixed;bottom:18px;left:18px;right:auto;z-index:99999;font-family:Heebo,Assistant,Arial,sans-serif}',
    '*{box-sizing:border-box}',
    '.fab{width:54px;height:54px;border-radius:50%;border:2px solid #fff;background:#1F3A5F;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.28);padding:0}',
    '.fab:hover{background:#2E7D52}',
    '.fab:focus-visible{outline:3px solid #ffe600;outline-offset:3px}',
    '.panel{position:absolute;bottom:66px;left:0;right:auto;width:290px;max-width:calc(100vw - 36px);max-height:calc(100vh - 120px);overflow:auto;background:#fff;color:#16202c;border:1px solid #d8dee5;border-radius:12px;box-shadow:0 18px 44px rgba(31,58,95,.24);padding:16px;direction:rtl;text-align:right}',
    '.panel[hidden]{display:none}',
    '.hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}',
    '.hd h2{margin:0;font-size:16px;font-weight:700;color:#1F3A5F}',
    '.x{background:none;border:none;font-size:20px;line-height:1;cursor:pointer;color:#6b7783;padding:4px 6px;border-radius:4px}',
    '.x:hover{background:#f1f4f7;color:#16202c}',
    '.row{display:flex;align-items:center;gap:8px;margin-bottom:12px}',
    '.zbtn{flex:1;background:#f5f7f9;border:1px solid #d8dee5;border-radius:6px;padding:9px 0;font-size:15px;font-weight:600;color:#1F3A5F;cursor:pointer;min-height:40px}',
    '.zbtn:hover{background:#e9f0f7}',
    '.zval{min-width:56px;text-align:center;font-size:14px;font-weight:600;color:#6b7783}',
    'ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.t{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff;border:1px solid #e2e7ec;border-radius:6px;padding:10px 12px;font-size:14px;font-weight:500;color:#2b3642;cursor:pointer;text-align:right;min-height:44px}',
    '.t:hover{border-color:#2E7D52}',
    '.t[aria-pressed="true"]{background:#eaf6ef;border-color:#2E7D52;color:#1F3A5F;font-weight:700}',
    '.dot{width:11px;height:11px;border-radius:50%;border:1px solid #c3cdd6;background:#fff;flex:0 0 auto}',
    '.t[aria-pressed="true"] .dot{background:#2E7D52;border-color:#2E7D52}',
    '.ft{margin-top:14px;padding-top:12px;border-top:1px solid #eef1f4;display:flex;flex-direction:column;gap:8px}',
    '.reset{background:#1F3A5F;color:#fff;border:none;border-radius:6px;padding:11px;font-size:14px;font-weight:600;cursor:pointer;min-height:44px}',
    '.reset:hover{background:#16283f}',
    '.link{font-size:13px;color:#2E7D52;font-weight:600;text-decoration:none}',
    '.link:hover{text-decoration:underline}',
    '.note{font-size:11px;color:#8b96a2;line-height:1.5}'
  ].join('');

  var ICON = '<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="4" r="2" fill="currentColor"/>' +
    '<path d="M12 7.5 L4.5 9 M12 7.5 L19.5 9 M12 7.5 V14 M12 14 L8.5 21 M12 14 L15.5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' +
    '</svg>';

  class A11yWidget extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.state = load();
      if (!this.state.zoom) this.state.zoom = 1;

      var sh = this.attachShadow({ mode: 'open' });
      var st = document.createElement('style');
      st.textContent = CSS;
      sh.appendChild(st);

      var wrap = document.createElement('div');
      wrap.innerHTML =
        '<button class="fab" type="button" aria-label="פתיחת תפריט נגישות" aria-expanded="false">' + ICON + '</button>' +
        '<div class="panel" role="dialog" aria-label="הגדרות נגישות" hidden>' +
          '<div class="hd"><h2>נגישות</h2><button class="x" type="button" aria-label="סגירת תפריט הנגישות">&#215;</button></div>' +
          '<div class="row">' +
            '<button class="zbtn" type="button" data-z="-1" aria-label="הקטנת גודל הטקסט">א−</button>' +
            '<span class="zval" aria-live="polite">100%</span>' +
            '<button class="zbtn" type="button" data-z="1" aria-label="הגדלת גודל הטקסט">א+</button>' +
          '</div>' +
          '<ul></ul>' +
          '<div class="ft">' +
            '<button class="reset" type="button">איפוס הגדרות</button>' +
            '<a class="link" href="' + STATEMENT + '">הצהרת נגישות ←</a>' +
            '<p class="note">נתקלתם בבעיית נגישות? נשמח לשמוע — dalit@attia.co.il</p>' +
          '</div>' +
        '</div>';
      sh.appendChild(wrap);

      var self = this;
      var fab = sh.querySelector('.fab');
      var panel = sh.querySelector('.panel');
      var zval = sh.querySelector('.zval');
      var ul = sh.querySelector('ul');

      TOGGLES.forEach(function (t) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 't';
        b.setAttribute('aria-pressed', self.state[t.k] ? 'true' : 'false');
        b.innerHTML = '<span>' + t.label + '</span><span class="dot"></span>';
        b.addEventListener('click', function () {
          self.state[t.k] = !self.state[t.k];
          if (t.k === 'contrastHigh' && self.state[t.k]) self.state.contrastDark = false;
          if (t.k === 'contrastDark' && self.state[t.k]) self.state.contrastHigh = false;
          self.commit();
        });
        li.appendChild(b);
        ul.appendChild(li);
      });

      sh.querySelectorAll('.zbtn').forEach(function (b) {
        b.addEventListener('click', function () {
          var d = Number(b.getAttribute('data-z')) * 0.1;
          var z = Math.round((self.state.zoom + d) * 10) / 10;
          self.state.zoom = Math.min(1.6, Math.max(0.9, z));
          self.commit();
        });
      });

      sh.querySelector('.reset').addEventListener('click', function () {
        self.state = { zoom: 1 };
        self.commit();
      });

      function toggle(open) {
        panel.hidden = !open;
        fab.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) panel.querySelector('.zbtn').focus();
      }
      fab.addEventListener('click', function () { toggle(panel.hidden); });
      sh.querySelector('.x').addEventListener('click', function () { toggle(false); fab.focus(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !panel.hidden) { toggle(false); fab.focus(); }
      });
      document.addEventListener('click', function (e) {
        if (!panel.hidden && !self.contains(e.target) && e.composedPath().indexOf(self) === -1) toggle(false);
      });

      this.sync = function () {
        sh.querySelectorAll('.t').forEach(function (b, i) {
          b.setAttribute('aria-pressed', self.state[TOGGLES[i].k] ? 'true' : 'false');
        });
        zval.textContent = Math.round((self.state.zoom || 1) * 100) + '%';
      };
      this.commit = function () { apply(self.state); save(self.state); self.sync(); };

      var skip = document.querySelector('.a11y-skip');
      if (!skip) {
        skip = document.createElement('a');
        skip.className = 'a11y-skip';
        skip.href = '#a11y-main';
        skip.textContent = 'דילוג לתוכן הראשי';
        document.body.insertBefore(skip, document.body.firstChild);
        var main = document.querySelector('main, section');
        if (main && !document.getElementById('a11y-main')) main.id = main.id || 'a11y-main';
      }

      this.commit();
    }
  }

  customElements.define('a11y-widget', A11yWidget);
})();
