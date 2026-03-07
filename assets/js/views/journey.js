// assets/js/views/journey.js
// SMC Unified Intelligence Platform — Customer Journey view renderer
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
// Security: all dynamic values escaped via esc(); addEventListener used throughout

function renderJourney(container) {
  const { journey, conversionFunnel } = window.SMC_DATA;

  // ── JOURNEY CARDS ────────────────────────────────
  const cardsHtml = journey.map(j => `
    <div class="journey-card" style="--step-color:${esc(j.color)}">
      <div class="journey-card-header">
        <div class="journey-card-num">0${esc(String(j.stepNumber))}</div>
        <div>
          <div class="journey-card-label">${esc(j.label)}</div>
          <div style="font-family:var(--font-condensed);font-size:11px;color:var(--text-3);margin-top:2px;">${esc(j.deptNames)}</div>
        </div>
      </div>

      <div class="journey-card-score">${esc(String(j.healthScore))}</div>
      <div class="journey-card-score-label">Health Score / 100</div>

      <div style="margin-top:var(--space-sm);">
        <div class="score-bar-wrap">
          <div class="score-bar-track" style="flex:1;">
            <div class="score-bar-fill" style="width:${esc(String(j.healthScore))}%;background:${esc(j.color)}"></div>
          </div>
          <span style="font-family:var(--font-mono);font-size:11px;color:${j.delta >= 0 ? 'var(--ok)' : 'var(--alert)'};">
            ${j.delta >= 0 ? '+' : ''}${esc(String(j.delta))}
          </span>
        </div>
      </div>

      <div class="journey-card-desc">${esc(j.description)}</div>

      <div class="journey-card-conv">
        <div class="journey-conv-item">
          <div class="journey-conv-val">${esc(j.convIn.toLocaleString())}</div>
          <div class="journey-conv-label">In</div>
        </div>
        <div class="journey-conv-arrow">→</div>
        <div class="journey-conv-item">
          <div class="journey-conv-val">${esc(j.convOut.toLocaleString())}</div>
          <div class="journey-conv-label">Out</div>
        </div>
        <div class="journey-conv-item">
          <div class="journey-conv-val" style="color:${esc(j.color)};">
            ${j.convIn > 0 ? Math.round(j.convOut / j.convIn * 100) : 0}%
          </div>
          <div class="journey-conv-label">Rate</div>
        </div>
      </div>
    </div>
  `).join('');

  // ── FUNNEL VISUALIZATION ──────────────────────────
  const funnelHtml = conversionFunnel.map(f => `
    <div class="funnel-row">
      <div class="funnel-label">${esc(f.step)}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar-fill" style="width:${esc(String(f.pct))}%;background:${esc(f.color)}">
          <span class="funnel-count">${esc(f.count.toLocaleString())}</span>
        </div>
      </div>
      <div class="funnel-pct">${esc(String(f.pct))}%</div>
    </div>
  `).join('');

  // ── JOURNEY OVERVIEW BAR ──────────────────────────
  const overviewBarHtml = journey.map(j => `
    <div class="journey-step-cell" style="--step-color:${esc(j.color)}" data-journey="${esc(j.id)}">
      <div class="journey-step-num">0${esc(String(j.stepNumber))}</div>
      <div class="journey-step-name">${esc(j.label)}</div>
      <div class="journey-step-score">${esc(String(j.healthScore))}</div>
      <div class="journey-step-delta ${j.delta >= 0 ? 'pos' : 'neg'}">${j.delta >= 0 ? '+' : ''}${esc(String(j.delta))}</div>
      <div class="journey-step-depts">${esc(j.deptNames)}</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title">Customer Journey Map</div>
      <div class="section-sub">6 stages · Discover → Retain · SMC Porsche Parts</div>
    </div>

    <!-- Overview bar -->
    <div class="journey-bar stagger-fade mb-xl">${overviewBarHtml}</div>

    <!-- Journey cards grid -->
    <div class="journey-grid stagger-fade">${cardsHtml}</div>

    <!-- Conversion funnel -->
    <div class="grid-2 mt-lg">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Conversion Funnel</div>
          <div class="panel-badge">Monthly traffic volume</div>
        </div>
        <div class="panel-body">
          <div class="funnel-container">${funnelHtml}</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Journey Intelligence</div>
        </div>
        <div class="panel-body">
          <div style="display:flex;flex-direction:column;gap:var(--space-md);">
            <div style="background:var(--c3);border-radius:var(--r-md);padding:var(--space-md);">
              <div style="font-family:var(--font-condensed);font-weight:700;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--space-sm);">Top Performing Stage</div>
              <div style="font-family:var(--font-display);font-size:22px;color:var(--j-order);">ORDER</div>
              <div style="font-size:12px;color:var(--text-3);">Health Score 94/100 · +3.0 WoW</div>
            </div>
            <div style="background:var(--c3);border-radius:var(--r-md);padding:var(--space-md);">
              <div style="font-family:var(--font-condensed);font-weight:700;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--space-sm);">Needs Attention</div>
              <div style="font-family:var(--font-display);font-size:22px;color:var(--watch);">FULFILL</div>
              <div style="font-size:12px;color:var(--text-3);">Health Score 87/100 · −0.8 WoW · Intl backlog</div>
            </div>
            <div style="background:var(--c3);border-radius:var(--r-md);padding:var(--space-md);">
              <div style="font-family:var(--font-condensed);font-weight:700;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--space-sm);">Overall Journey Health</div>
              <div style="font-family:var(--font-display);font-size:36px;color:var(--text-1);">89.3</div>
              <div style="font-size:12px;color:var(--ok);">↑ +2.5 vs last week · Platform trending positive</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
