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
