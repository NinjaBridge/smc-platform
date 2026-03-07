// assets/js/data/alerts.js
// SMC Unified Intelligence Platform — Alert queue mockup data
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
window.SMC_DATA = window.SMC_DATA || {};

window.SMC_DATA.alerts = [
  {
    id: 'a1',
    severity: 'watch',
    icon: '📦',
    dept: 'Fulfillment',
    deptColor: 'var(--dept-fulfill)',
    title: 'International Shipping Backlog',
    desc: '31 orders pending carrier pickup. Worldwide SLA at risk for 8 items.',
    time: '2h ago',
  },
  {
    id: 'a2',
    severity: 'watch',
    icon: '🔧',
    dept: 'Customer Care',
    deptColor: 'var(--dept-care)',
    title: 'Tech Support Queue Elevated',
    desc: '22 open tickets, 5 regarding fitment verification for 996 turbo parts.',
    time: '4h ago',
  },
  {
    id: 'a3',
    severity: 'info',
    icon: '⚙️',
    dept: 'Digital IT',
    deptColor: 'var(--dept-digital)',
    title: 'N8N Batch Run Scheduled',
    desc: 'Supplier PO sync and inventory reconciliation queued for tonight 10 PM.',
    time: 'Tonight 10 PM',
  },
  {
    id: 'a4',
    severity: 'ok',
    icon: '✅',
    dept: 'Digital IT',
    deptColor: 'var(--dept-digital)',
    title: 'Shopify Platform Nominal',
    desc: '99.8% uptime. Last incident resolved 21 days ago. Cloudflare CDN healthy.',
    time: 'Continuous',
  },
  {
    id: 'a5',
    severity: 'watch',
    icon: '📅',
    dept: 'Finance',
    deptColor: 'var(--dept-finance)',
    title: 'Month-End Close — Mar 31',
    desc: '4 vendor payments pending reconciliation before close.',
    time: '6 days',
  },
];
