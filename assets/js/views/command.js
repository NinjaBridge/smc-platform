// assets/js/views/command.js
// SMC Unified Intelligence Platform — Command Center view renderer
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
// Security: all dynamic values escaped via esc(); no inline event handlers

function renderCommand(container) {
  const { kpis, brandStats, conversionFunnel, departments, journey, alerts } = window.SMC_DATA;

  // ── KPI STRIP ────────────────────────────────────
  const kpiHtml = kpis.map(k => `
    <div class="kpi-tile" style="--kpi-color:${esc(k.accentColor)}">
      <div class="kpi-label">${esc(k.label)}</div>
      <div class="kpi-value">${esc(k.value)}<span class="kpi-unit">${esc(k.unit)}</span></div>
      <div class="kpi-delta ${k.dir === 'up' ? 'up' : k.dir === 'down' ? 'down' : ''}">${esc(k.delta)}</div>
      <div class="kpi-bar-wrap"><div class="kpi-bar-fill" style="width:${esc(String(k.bar))}%"></div></div>
    </div>
  `).join('');

  // ── BRAND STATS ───────────────────────────────────
  const brandHtml = brandStats.map(s => `
    <div class="brand-stat">
      <div class="brand-stat-num">${esc(s.num)}</div>
      <div class="brand-stat-label">${esc(s.label)}</div>
      <div class="brand-stat-sub">${esc(s.sub)}</div>
    </div>
  `).join('');

  // ── JOURNEY BAR ───────────────────────────────────
  const journeyBarHtml = journey.map(j => `
    <div class="journey-step-cell" style="--step-color:${esc(j.color)}" data-journey="${esc(j.id)}">
      <div class="journey-step-num">0${esc(String(j.stepNumber))}</div>
      <div class="journey-step-name">${esc(j.label)}</div>
      <div class="journey-step-score">${esc(String(j.healthScore))}</div>
      <div class="journey-step-delta ${j.delta >= 0 ? 'pos' : 'neg'}">${j.delta >= 0 ? '+' : ''}${esc(String(j.delta))}</div>
      <div class="journey-step-depts">${esc(j.deptNames)}</div>
    </div>
  `).join('');

  // ── DEPT TABLE ────────────────────────────────────
  const deptRows = departments.map(d => `
    <tr data-dept-id="${esc(d.id)}" class="dept-table-row" style="cursor:pointer;">
      <td>
        <div class="dept-name-cell">
          <span class="dept-icon">${esc(d.icon)}</span>
          <span class="dept-color-dot" style="background:${esc(d.hex)}"></span>
          <div>
            <div class="dept-name-text">${esc(d.name)}</div>
            <div class="dept-desc">${esc(d.description)}</div>
          </div>
        </div>
      </td>
      <td>
        <div class="score-bar-wrap">
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width:${esc(String(d.healthScore))}%;background:${esc(d.hex)}"></div>
          </div>
          <div class="score-bar-val">${esc(String(d.healthScore))}</div>
        </div>
      </td>
      <td>${pill(d.status)}</td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-2);">${esc(String(d.openItems))}</td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--text-2);">${esc(String(d.inProgress))}</td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--smc-gold);">${esc(String(d.automations))}</td>
    </tr>
  `).join('');

  // ── ALERT LIST ────────────────────────────────────
  const alertColor = { watch: 'var(--watch)', alert: 'var(--alert)', ok: 'var(--ok)', info: 'var(--info)' };
  const alertsHtml = alerts.map((a, i) => `
    <div class="alert-card" style="--alert-color:${alertColor[a.severity] || 'var(--text-4)'};--alert-dept-color:${esc(a.deptColor)};animation-delay:${i * 60}ms">
      <div class="alert-icon">${esc(a.icon)}</div>
      <div class="alert-body">
        <div class="alert-top">
          <span class="alert-dept">${esc(a.dept)}</span>
          ${pill(a.severity)}
          <span class="alert-time">${esc(a.time)}</span>
        </div>
        <div class="alert-title">${esc(a.title)}</div>
        <div class="alert-desc">${esc(a.desc)}</div>
      </div>
    </div>
  `).join('');

  // ── CONVERSION FUNNEL ─────────────────────────────
  const funnelHtml = conversionFunnel.map(f => `
    <div class="funnel-row">
      <div class="funnel-label">${esc(f.step)}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar-fill" style="width:${esc(String(f.pct))}%;background:${esc(f.color)}">
          <span class="funnel-count">${esc(String(f.count.toLocaleString()))}</span>
        </div>
      </div>
      <div class="funnel-pct">${esc(String(f.pct))}%</div>
    </div>
  `).join('');

  container.innerHTML = `
    <!-- KPI STRIP -->
    <div class="kpi-strip stagger-fade">${kpiHtml}</div>

    <!-- BRAND STATS -->
    <div class="brand-stats stagger-fade">${brandHtml}</div>

    <!-- JOURNEY BAR -->
    <div class="section-header">
      <div class="section-title">Customer Journey</div>
      <div class="section-sub">Health scores by stage</div>
    </div>
    <div class="journey-bar stagger-fade" id="journey-bar">${journeyBarHtml}</div>

    <!-- LOWER GRID: dept table + right column -->
    <div class="grid-2 mt-lg">

      <!-- DEPT TABLE -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Department Status</div>
          <div class="panel-badge">7 departments</div>
        </div>
        <div style="overflow-x:auto;">
          <table class="dept-table">
            <thead>
              <tr>
                <th>Department</th>
                <th style="min-width:120px;">Health</th>
                <th>Status</th>
                <th>Open</th>
                <th>Active</th>
                <th>Autos</th>
              </tr>
            </thead>
            <tbody id="dept-table-body">${deptRows}</tbody>
          </table>
        </div>
      </div>

      <!-- RIGHT COLUMN: alerts + funnel -->
      <div style="display:flex;flex-direction:column;gap:var(--space-lg);">

        <!-- ALERTS -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Intelligence Feed</div>
            <div class="panel-badge">${esc(String(alerts.length))} items</div>
          </div>
          <div class="panel-body">
            <div class="alert-list stagger-fade">${alertsHtml}</div>
          </div>
        </div>

        <!-- CONVERSION FUNNEL -->
        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">Conversion Funnel</div>
            <div class="panel-badge">Monthly traffic</div>
          </div>
          <div class="panel-body">
            <div class="funnel-container">${funnelHtml}</div>
          </div>
        </div>

      </div>
    </div>
  `;

  // Bind dept row clicks → navigate to dept detail
  container.querySelectorAll('.dept-table-row').forEach(row => {
    row.addEventListener('click', () => {
      navigate('#departments');
      // After navigation, open the dept detail
      setTimeout(() => {
        const evt = new CustomEvent('openDept', { detail: { id: row.dataset.deptId } });
        document.dispatchEvent(evt);
      }, 100);
    });
  });

  // Bind journey cell clicks → navigate to journey view
  container.querySelectorAll('.journey-step-cell').forEach(cell => {
    cell.addEventListener('click', () => navigate('#journey'));
  });
}
