// assets/js/views/operations.js
// SMC Unified Intelligence Platform — Operations view renderer (automations + integrations)
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
// Security: all dynamic values escaped via esc(); addEventListener used throughout

function renderOperations(container) {
  const { automations, departments } = window.SMC_DATA;

  // Build dept color map
  const deptColorMap = {};
  departments.forEach(d => { deptColorMap[d.id] = d.hex; });

  // Summary counts
  const activeCount = automations.filter(a => a.status === 'active').length;
  const pausedCount = automations.filter(a => a.status === 'paused').length;

  // Filter state
  let _currentFilter = 'all';

  function renderTable(filter) {
    const filtered = filter === 'all' ? automations : automations.filter(a => a.deptId === filter);
    return filtered.map(a => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:var(--space-sm);">
            <span class="ops-dept-badge" style="border-left:2px solid ${esc(deptColorMap[a.deptId] || '#888')}">
              ${esc(a.dept)}
            </span>
          </div>
        </td>
        <td style="font-weight:500;color:var(--text-1);">${esc(a.name)}</td>
        <td>${pill(a.status)}</td>
        <td><span class="ops-runs">${esc(a.runs)}</span></td>
      </tr>
    `).join('');
  }

  // Dept filter options
  const deptFilters = [{ id: 'all', shortName: 'All', hex: '#E30613' }, ...departments.map(d => ({ id: d.id, shortName: d.shortName, hex: d.hex }))];

  const filterBtns = deptFilters.map(d => `
    <button class="filter-btn${d.id === 'all' ? ' active' : ''}"
            style="--filter-color:${esc(d.hex)}"
            data-filter="${esc(d.id)}">
      ${esc(d.shortName)}
    </button>
  `).join('');

  // Integration status cards
  const integrations = [
    { name: 'Shopify Admin API',   desc: 'Orders, products, inventory, customers sync. 284 orders/day throughput.', status: 'active', type: 'REST API' },
    { name: 'N8N Automation',      desc: '42 active workflows. PO sync, carrier selection, SEO generation, CRM updates.', status: 'active', type: 'Workflow Engine' },
    { name: 'UPS / FedEx / DHL',  desc: 'Carrier rate selection, label generation, tracking. Worldwide shipping.', status: 'active', type: 'Shipping API' },
    { name: 'Google Shopping',     desc: 'Product feed sync for 10,000+ SKUs. Hourly refresh. CPC optimization.', status: 'active', type: 'Feed API' },
    { name: 'Cloudflare Workers',  desc: 'Edge auth, routing, KV storage. Zero cold starts. 99.8% uptime.', status: 'active', type: 'Edge Infrastructure' },
    { name: 'Clerk Auth',          desc: 'User identity, JWT sessions, role management for all ASAP platforms.', status: 'active', type: 'Auth Platform' },
    { name: 'Zoho CRM',            desc: 'Customer records, review sync, CSAT capture.', status: 'active', type: 'CRM' },
    { name: 'Supplier EDI',        desc: '7 German/European manufacturer data feeds. Daily 6am sync.', status: 'active', type: 'EDI' },
    { name: 'Car Storage System', desc: 'Booking system for SMC storage service. Under development.', status: 'paused', type: 'Internal App' },
  ];

  const integrationsHtml = integrations.map(i => `
    <div class="integration-card">
      <div class="integration-name">${esc(i.name)}</div>
      <div class="integration-desc">${esc(i.desc)}</div>
      <div class="integration-status">
        ${pill(i.status)}
        <span class="integration-type">${esc(i.type)}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title">Operations Center</div>
      <div class="section-sub">N8N automation inventory · integration status</div>
    </div>

    <!-- SUMMARY KPIs -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-md);margin-bottom:var(--space-xl);">
      <div class="kpi-tile" style="--kpi-color:var(--ok)">
        <div class="kpi-label">Active Automations</div>
        <div class="kpi-value">${esc(String(activeCount))}</div>
        <div class="kpi-delta up">Running now</div>
        <div class="kpi-bar-wrap"><div class="kpi-bar-fill" style="width:${Math.round(activeCount/42*100)}%;background:var(--ok)"></div></div>
      </div>
      <div class="kpi-tile" style="--kpi-color:var(--watch)">
        <div class="kpi-label">In Development</div>
        <div class="kpi-value">${esc(String(pausedCount))}</div>
        <div class="kpi-delta">Paused / building</div>
        <div class="kpi-bar-wrap"><div class="kpi-bar-fill" style="width:${Math.round(pausedCount/42*100)}%;background:var(--watch)"></div></div>
      </div>
      <div class="kpi-tile" style="--kpi-color:var(--dept-digital)">
        <div class="kpi-label">Integrations</div>
        <div class="kpi-value">9</div>
        <div class="kpi-delta up">8 active · 1 building</div>
        <div class="kpi-bar-wrap"><div class="kpi-bar-fill" style="width:88%;background:var(--dept-digital)"></div></div>
      </div>
      <div class="kpi-tile" style="--kpi-color:var(--smc-gold)">
        <div class="kpi-label">N8N Engine</div>
        <div class="kpi-value">42</div>
        <div class="kpi-delta up">+7 this quarter</div>
        <div class="kpi-bar-wrap"><div class="kpi-bar-fill" style="width:84%;background:var(--smc-gold)"></div></div>
      </div>
    </div>

    <!-- AUTOMATION TABLE -->
    <div class="panel mb-xl">
      <div class="panel-header">
        <div class="panel-title">Automation Inventory</div>
        <div class="panel-badge">${esc(String(automations.length))} total</div>
      </div>
      <div style="padding:var(--space-md) var(--space-lg);border-bottom:1px solid rgba(244,242,238,0.06);">
        <div class="filter-bar" style="margin-bottom:0;">
          <span class="filter-label">Dept:</span>
          ${filterBtns}
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table class="ops-table">
          <thead>
            <tr>
              <th style="width:120px;">Department</th>
              <th>Automation Name</th>
              <th style="width:100px;">Status</th>
              <th style="width:160px;">Cadence</th>
            </tr>
          </thead>
          <tbody id="ops-table-body">${renderTable('all')}</tbody>
        </table>
      </div>
    </div>

    <!-- INTEGRATION GRID -->
    <div class="section-header">
      <div class="section-title">Integration Status</div>
      <div class="section-sub">Live connections · API health</div>
    </div>
    <div class="integration-grid">${integrationsHtml}</div>
  `;

  // Bind filter buttons
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _currentFilter = btn.dataset.filter;
      const tbody = container.querySelector('#ops-table-body');
      if (tbody) tbody.innerHTML = renderTable(_currentFilter);
    });
  });
}
