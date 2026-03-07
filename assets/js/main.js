// assets/js/main.js
// SMC Unified Intelligence Platform — Clock tick + global init
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops

function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
}

// Start clock
updateClock();
setInterval(updateClock, 1000);

// Utility: escape HTML to prevent XSS in rendered strings
window.esc = function(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Utility: status pill HTML
window.pill = function(status) {
  const map = {
    healthy: { cls: 'ok',    label: 'Healthy' },
    ok:      { cls: 'ok',    label: 'OK' },
    watch:   { cls: 'watch', label: 'Watch' },
    alert:   { cls: 'alert', label: 'Alert' },
    active:  { cls: 'ok',    label: 'Active' },
    paused:  { cls: 'paused',label: 'Paused' },
    info:    { cls: 'info',  label: 'Info' },
  };
  const s = map[status] || { cls: 'info', label: status };
  return `<span class="pill ${s.cls}"><span class="pill-dot"></span>${esc(s.label)}</span>`;
};

// Utility: urgency pill HTML
window.urgencyPill = function(urgency) {
  return window.pill(urgency === 'normal' ? 'info' : urgency);
};

// ── Email watermark overlay (P2 · Security Review 2026-03-07) ────────────
// Reads window.ASAP_USER.email (injected by CF Worker) and renders a
// fixed-position semi-transparent overlay for visual attribution.
// MutationObserver re-inserts if removed via DevTools.
(function() {
  var email = (window.ASAP_USER && window.ASAP_USER.email) || 'CONFIDENTIAL';
  var txt   = Array(50).fill(email + '\u00A0\u00B7\u00A0CONFIDENTIAL\u00A0\u00B7\u00A0').join('');

  function createOverlay() {
    var el = document.createElement('div');
    el.id = 'smc-watermark';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = txt;
    el.style.cssText =
      'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden;' +
      'font-family:monospace;font-size:11px;line-height:2.4;' +
      'color:rgba(227,6,19,0.065);word-break:break-all;' +
      'transform:rotate(-32deg);transform-origin:center;' +
      'user-select:none;-webkit-user-select:none;' +
      'top:-40%;left:-20%;width:140%;height:180%;padding:60px;';
    return el;
  }

  function mountWatermark() {
    if (document.getElementById('smc-watermark')) return;
    document.body.appendChild(createOverlay());
    // Re-mount if removed (tamper resistance)
    new MutationObserver(function(_, obs) {
      if (!document.getElementById('smc-watermark')) {
        obs.disconnect();
        mountWatermark();
      }
    }).observe(document.body, { childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWatermark);
  } else {
    mountWatermark();
  }
})();
