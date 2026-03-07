// assets/js/data/journey.js
// SMC Unified Intelligence Platform — Customer Journey mockup data
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
window.SMC_DATA = window.SMC_DATA || {};

window.SMC_DATA.journey = [
  {
    id: 'discover', stepNumber: 1, label: 'DISCOVER',
    color: 'var(--j-discover)', hex: '#E30613',
    depts: ['ecommerce'],
    deptNames: 'Ecom & Sales',
    healthScore: 92,
    delta: +5.1,
    convIn: 12400, convOut: 8400,
    description: 'Porsche enthusiast finds SMC via Google, forums, referral or blog. Year/Model selector. SEO-optimized catalog.',
  },
  {
    id: 'shop', stepNumber: 2, label: 'SHOP',
    color: 'var(--j-shop)', hex: '#D4A843',
    depts: ['ecommerce','customer-care'],
    deptNames: 'Ecom · Customer Care',
    healthScore: 88,
    delta: +2.3,
    convIn: 8400, convOut: 2700,
    description: 'Browse 10,000+ SKUs. VIN/fitment lookup. Pre-purchase Porsche expert support. Genuine vs aftermarket guidance.',
  },
  {
    id: 'order', stepNumber: 3, label: 'ORDER',
    color: 'var(--j-order)', hex: '#5B8DB8',
    depts: ['purchasing','finance'],
    deptNames: 'Purchasing · Finance',
    healthScore: 94,
    delta: +3.0,
    convIn: 2700, convOut: 2620,
    description: 'Checkout on Shopify. Worldwide shipping options. Payment processing. Order confirmation automation.',
  },
  {
    id: 'fulfill', stepNumber: 4, label: 'FULFILL',
    color: 'var(--j-fulfill)', hex: '#D4A843',
    depts: ['fulfillment','digital-it'],
    deptNames: 'Fulfillment · Digital IT',
    healthScore: 87,
    delta: -0.8,
    convIn: 2620, convOut: 2540,
    description: 'Eagle Rock warehouse — pick, pack, ship worldwide. UPS/FedEx/DHL. Label automation. Tracking notifications.',
  },
  {
    id: 'service', stepNumber: 5, label: 'SERVICE',
    color: 'var(--j-service)', hex: '#2E8B57',
    depts: ['customer-care'],
    deptNames: 'Customer Care',
    healthScore: 85,
    delta: +1.2,
    convIn: 780, convOut: 680,
    description: 'Post-delivery support. Returns & exchanges. Technical fitment help. Porsche-expert team. 4.5★ / 380 Google reviews.',
  },
  {
    id: 'retain', stepNumber: 6, label: 'RETAIN',
    color: 'var(--j-retain)', hex: '#8B5CF6',
    depts: ['product-dev','ecommerce'],
    deptNames: 'Product Dev · Ecom',
    healthScore: 90,
    delta: +4.7,
    convIn: 2540, convOut: 1630,
    description: 'Repeat buyers. SMC own product line exclusivity. Car storage services. New arrivals. Porsche community trust.',
  },
];
