// assets/js/data/kpis.js
// SMC Unified Intelligence Platform — KPI + brand stats mockup data
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
window.SMC_DATA = window.SMC_DATA || {};

window.SMC_DATA.kpis = [
  {
    id: 'platform-health',
    label: 'Platform Health',
    value: '89', unit: '/100',
    delta: '+3.4 vs last wk', dir: 'up',
    bar: 89, accentColor: 'var(--smc-red)',
  },
  {
    id: 'active-orders',
    label: 'Active Orders',
    value: '284', unit: '',
    delta: '+22 this week', dir: 'up',
    bar: 71, accentColor: 'var(--dept-ecom)',
  },
  {
    id: 'fulfillment-rate',
    label: 'Fulfillment Rate',
    value: '97', unit: '%',
    delta: 'On target', dir: 'neutral',
    bar: 97, accentColor: 'var(--dept-fulfill)',
  },
  {
    id: 'csat',
    label: 'CSAT Score',
    value: '4.5', unit: '★',
    delta: '380 reviews', dir: 'up',
    bar: 90, accentColor: 'var(--dept-care)',
  },
  {
    id: 'shopify-uptime',
    label: 'Shopify Uptime',
    value: '99.8', unit: '%',
    delta: 'SLA met', dir: 'up',
    bar: 99.8, accentColor: 'var(--dept-digital)',
  },
  {
    id: 'automations',
    label: 'Active Automations',
    value: '42', unit: '',
    delta: '+7 this quarter', dir: 'up',
    bar: 84, accentColor: 'var(--smc-gold)',
  },
];

window.SMC_DATA.brandStats = [
  { num: '17+',   label: 'Years in Business',   sub: 'Founded 2007, Eagle Rock LA' },
  { num: '15.5K', label: 'Square Foot Facility', sub: '1669 Colorado Blvd, LA 90041' },
  { num: '356→',  label: 'Model Coverage',       sub: 'Pre-A to 992 · All generations' },
  { num: '10K+',  label: 'SKUs in Catalog',      sub: 'Genuine · OEM · Aftermarket · SMC Line' },
];

window.SMC_DATA.conversionFunnel = [
  { step: 'Discover', color: 'var(--j-discover)', count: 12400, pct: 100 },
  { step: 'Shop',     color: 'var(--j-shop)',     count: 8400,  pct: 68 },
  { step: 'Order',    color: 'var(--j-order)',    count: 2700,  pct: 22 },
  { step: 'Fulfill',  color: 'var(--j-fulfill)',  count: 2620,  pct: 21 },
  { step: 'Service',  color: 'var(--j-service)',  count: 780,   pct: 6 },
  { step: 'Retain',   color: 'var(--j-retain)',   count: 1630,  pct: 13 },
];
