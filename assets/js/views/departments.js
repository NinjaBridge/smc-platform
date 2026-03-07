// assets/js/views/departments.js
// SMC Unified Intelligence Platform — Departments grid + drill-down renderer
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
// Security: all dynamic values escaped via esc(); addEventListener used throughout

let _activeDept = null; // tracks currently open dept detail

function renderDepartments(container) {
  _activeDept = null;
  _renderDeptGrid(container);

  // Listen for cross-view openDept events (from command.js dept table clicks)
  document.addEventListener('openDept', function handler(e) {
    document.removeEventListener('openDept', handler);
    _renderDeptDetail(container, e.detail.id);
  });
}

function _renderDeptGrid(container) {
  const { departments } = window.SMC_DATA;

  // Journey filter buttons
  const journeySteps = [
    { id: 'all',      label: 'All Departments', color: 'var(--smc-red)' },
    { id: 'discover', label: 'Discover',         color: 'var(--j-discover)' },
    { id: 'shop',     label: 'Shop',             color: 'var(--j-shop)' },
    { id: 'order',    label: 'Order',            color: 'var(--j-order)' },
    { id: 'fulfill',  label: 'Fulfill',          color: 'var(--j-fulfill)' },
    { id: 'service',  label: 'Service',          color: 'var(--j-service)' },
    { id: 'retain',   label: 'Retain',           color: 'var(--j-retain)' },
  ];

  const filterHtml = journeySteps.map(s => `
    <button class="filter-btn${s.id === 'all' ? ' active' : ''}"
            style="--filter-color:${esc(s.color)}"
            data-filter="${esc(s.id)}">
      ${esc(s.label)}
    </button>
  `).join('');

  const cardsHtml = departments.map(d => _deptCardHtml(d)).join('');

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title">Departments</div>
      <div class="section-sub">7 business units · click a card to drill down</div>
    </div>

    <div class="filter-bar">
      <span class="filter-label">Journey Stage:</span>
      ${filterHtml}
    </div>

    <div class="dept-grid stagger-fade" id="dept-grid">${cardsHtml}</div>
  `;

  // Bind filter buttons
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      container.querySelectorAll('.dept-card').forEach(card => {
        const steps = card.dataset.journeySteps ? card.dataset.journeySteps.split(',') : [];
        const visible = filter === 'all' || steps.includes(filter);
        card.style.display = visible ? '' : 'none';
      });
    });
  });

  // Bind dept card clicks → drill-down
  container.querySelectorAll('.dept-card').forEach(card => {
    card.addEventListener('click', () => {
      _renderDeptDetail(container, card.dataset.deptId);
    });
  });
}

function _deptCardHtml(d) {
  const metricsHtml = d.metrics.map(m => `
    <div class="dept-metric-item">
      <div class="dept-metric-val" style="color:${esc(d.hex)}">${esc(m.value)}</div>
      <div class="dept-metric-label">${esc(m.label)}</div>
      <div class="dept-metric-sub">${esc(m.sub)}</div>
    </div>
  `).join('');

  return `
    <div class="dept-card" style="--dept-accent:${esc(d.hex)}"
         data-dept-id="${esc(d.id)}"
         data-journey-steps="${esc(d.journeySteps.join(','))}">
      <div class="dept-card-header">
        <span class="dept-card-icon">${esc(d.icon)}</span>
        ${pill(d.status)}
      </div>
      <div class="dept-card-name">${esc(d.name)}</div>
      <div class="dept-card-desc">${esc(d.description)}</div>
      <div class="dept-card-metrics">${metricsHtml}</div>
      <div style="margin-bottom:var(--space-sm);">
        <div class="score-bar-wrap">
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width:${esc(String(d.healthScore))}%;background:${esc(d.hex)}"></div>
          </div>
          <div class="score-bar-val">${esc(String(d.healthScore))}/100</div>
        </div>
      </div>
      <div class="dept-card-footer">
        <div class="dept-card-counts">
          <span><span>${esc(String(d.openItems))}</span> open</span>
          <span><span>${esc(String(d.inProgress))}</span> active</span>
          <span><span>${esc(String(d.automations))}</span> autos</span>
        </div>
        <span style="font-size:11px;color:var(--text-4);">→</span>
      </div>
    </div>
  `;
}

function _renderDeptDetail(container, deptId) {
  const { departments } = window.SMC_DATA;
  const d = departments.find(x => x.id === deptId);
  if (!d) { _renderDeptGrid(container); return; }

  _activeDept = deptId;

  const tasksHtml = d.tasks.map(t => `
    <tr>
      <td class="task-name">${esc(t.name)}</td>
      <td class="task-val">${esc(t.value)}</td>
      <td class="task-urgency">${urgencyPill(t.urgency)}</td>
    </tr>
  `).join('');

  const workflowHtml = d.workflows.map(w => `
    <div class="workflow-row">
      <span class="workflow-stage">${esc(w.stage)}</span>
      <span class="workflow-count">${esc(w.count)}</span>
    </div>
  `).join('');

  const autoHtml = d.automationList.map(a => `
    <div class="auto-row">
      ${pill(a.status)}
      <span class="auto-name">${esc(a.name)}</span>
      <span class="auto-runs">${esc(a.runs)}</span>
    </div>
  `).join('');

  // Journey steps this dept covers
  const journeyStepNames = d.journeySteps.map(s =>
    s.charAt(0).toUpperCase() + s.slice(1)
  ).join(' → ');

  container.innerHTML = `
    <!-- DETAIL PANEL -->
    <div class="detail-panel" style="--dept-accent:${esc(d.hex)}">
      <div class="detail-header">
        <span class="detail-icon">${esc(d.icon)}</span>
        <div class="detail-title-block">
          <div class="detail-title">${esc(d.name)}</div>
          <div class="detail-subtitle">${esc(d.description)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-md);">
          ${pill(d.status)}
          <button class="detail-back-btn" id="back-btn">← All Departments</button>
        </div>
      </div>

      <div class="detail-body">

        <!-- LEFT: Tasks + Metrics -->
        <div style="display:flex;flex-direction:column;gap:var(--space-lg);">

          <!-- METRICS -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">Key Metrics</div>
              <div class="panel-badge">Health: ${esc(String(d.healthScore))}/100</div>
            </div>
            <div class="panel-body">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-md);">
                ${d.metrics.map(m => `
                  <div style="background:var(--c3);border-radius:var(--r-md);padding:var(--space-md);">
                    <div style="font-family:var(--font-display);font-size:28px;color:${esc(d.hex)};line-height:1;">${esc(m.value)}</div>
                    <div style="font-family:var(--font-condensed);font-weight:700;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-3);margin-top:2px;">${esc(m.label)}</div>
                    <div style="font-size:11px;color:var(--text-4);">${esc(m.sub)}</div>
                  </div>
                `).join('')}
              </div>
              <div class="score-bar-wrap">
                <div class="score-bar-track" style="flex:1;">
                  <div class="score-bar-fill" style="width:${esc(String(d.healthScore))}%;background:${esc(d.hex)}"></div>
                </div>
                <div class="score-bar-val">${esc(String(d.healthScore))}/100</div>
              </div>
            </div>
          </div>

          <!-- OPEN TASKS -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">Open Tasks</div>
              <div class="panel-badge">${esc(String(d.openItems))} items</div>
            </div>
            <table class="tasks-table">
              <tbody>${tasksHtml}</tbody>
            </table>
          </div>

          <!-- JOURNEY COVERAGE -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">Journey Coverage</div>
            </div>
            <div class="panel-body" style="font-family:var(--font-condensed);font-size:13px;color:var(--text-2);">
              ${esc(journeyStepNames)}
            </div>
          </div>

        </div>

        <!-- RIGHT: Workflow + Automations -->
        <div style="display:flex;flex-direction:column;gap:var(--space-lg);">

          <!-- WORKFLOW -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">Workflow Pipeline</div>
            </div>
            <div class="panel-body">
              <div class="workflow-list">${workflowHtml}</div>
            </div>
          </div>

          <!-- AUTOMATIONS -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">Automations</div>
              <div class="panel-badge">${esc(String(d.automationList.length))} workflows</div>
            </div>
            <div class="panel-body">
              <div class="auto-list">${autoHtml}</div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- BACK TO GRID -->
    <div style="margin-top:var(--space-lg);">
      <button class="detail-back-btn" id="back-btn-2">← All Departments</button>
    </div>
  `;

  // Bind back buttons
  ['back-btn', 'back-btn-2'].forEach(id => {
    const btn = container.querySelector('#' + id);
    if (btn) {
      btn.addEventListener('click', () => {
        _activeDept = null;
        _renderDeptGrid(container);
      });
    }
  });
}
