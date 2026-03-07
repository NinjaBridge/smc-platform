// assets/js/data/automations.js
// SMC Unified Intelligence Platform — Full 42-automation inventory
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
//
// Schema (this becomes the KV contract for future N8N integration):
// { name: string, dept: string, deptId: string, status: 'active'|'paused', runs: string }
window.SMC_DATA = window.SMC_DATA || {};

window.SMC_DATA.automations = [
  // ECOMMERCE (7)
  { name: 'Porsche Year/Model Selector',       dept: 'Ecom',       deptId: 'ecommerce',     status: 'active', runs: 'Live on all PDPs' },
  { name: 'Product SEO Auto-Generator',        dept: 'Ecom',       deptId: 'ecommerce',     status: 'active', runs: 'On new listing' },
  { name: 'Abandoned Cart Recovery Email',     dept: 'Ecom',       deptId: 'ecommerce',     status: 'active', runs: '~140/week' },
  { name: 'Back-in-Stock Notifier',            dept: 'Ecom',       deptId: 'ecommerce',     status: 'active', runs: 'Event-driven' },
  { name: 'Google Shopping Feed Sync',         dept: 'Ecom',       deptId: 'ecommerce',     status: 'active', runs: 'Hourly' },
  { name: 'Blog Post SEO Scheduler',           dept: 'Ecom',       deptId: 'ecommerce',     status: 'active', runs: 'Weekly' },
  { name: 'Cross-sell Recommendation Engine', dept: 'Ecom',       deptId: 'ecommerce',     status: 'paused', runs: 'In development' },
  // PURCHASING (6)
  { name: 'Reorder Point Monitor',             dept: 'Purchasing', deptId: 'purchasing',    status: 'active', runs: 'Real-time' },
  { name: 'Supplier EDI Auto-Sync',            dept: 'Purchasing', deptId: 'purchasing',    status: 'active', runs: 'Daily 6am' },
  { name: 'PO Auto-Draft from Threshold',     dept: 'Purchasing', deptId: 'purchasing',    status: 'active', runs: 'Trigger-based' },
  { name: 'German Mfr Sample Tracker',        dept: 'Purchasing', deptId: 'purchasing',    status: 'active', runs: 'Weekly' },
  { name: 'SMC Own-Line Production Queue',    dept: 'Purchasing', deptId: 'purchasing',    status: 'active', runs: 'Monthly' },
  { name: 'Stock Aging Alert',                 dept: 'Purchasing', deptId: 'purchasing',    status: 'active', runs: 'Weekly' },
  // FULFILLMENT (8)
  { name: 'Shopify Order → Pick Ticket',       dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: '284/day' },
  { name: 'Auto Carrier Rate Selection',       dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: 'Per order' },
  { name: 'Shipping Label Print Trigger',      dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: 'Continuous' },
  { name: 'Tracking # → Customer Email',       dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: 'On scan' },
  { name: 'Intl Customs Doc Builder',          dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: 'On export order' },
  { name: 'Delivery Confirmation → CRM',       dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: 'On delivery' },
  { name: 'Carrier Backlog Alert',             dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: 'Every 2hr · WATCH' },
  { name: 'Return Label Generator',            dept: 'Fulfill',    deptId: 'fulfillment',   status: 'active', runs: 'On request' },
  // CUSTOMER CARE (6)
  { name: 'Ticket Auto-Triage by Topic',       dept: 'Care',       deptId: 'customer-care', status: 'active', runs: 'On submission' },
  { name: 'Tracking Query Auto-Reply',         dept: 'Care',       deptId: 'customer-care', status: 'active', runs: '~60/week' },
  { name: 'Fitment Escalation to Expert',      dept: 'Care',       deptId: 'customer-care', status: 'active', runs: 'Real-time' },
  { name: 'Return Authorization Workflow',     dept: 'Care',       deptId: 'customer-care', status: 'active', runs: 'On request' },
  { name: 'Google Review Sync → CRM',          dept: 'Care',       deptId: 'customer-care', status: 'active', runs: 'Daily' },
  { name: 'CSAT Survey Post-Delivery',         dept: 'Care',       deptId: 'customer-care', status: 'active', runs: '3 days post-ship' },
  // PRODUCT DEV (4)
  { name: 'Competitor Price Tracker',          dept: 'Product',    deptId: 'product-dev',   status: 'active', runs: 'Daily' },
  { name: 'New SKU → Shopify Publish',         dept: 'Product',    deptId: 'product-dev',   status: 'active', runs: 'On approval' },
  { name: 'Sample Status Tracker',             dept: 'Product',    deptId: 'product-dev',   status: 'active', runs: 'Weekly' },
  { name: 'Car Storage Booking System',        dept: 'Product',    deptId: 'product-dev',   status: 'paused', runs: 'In development' },
  // DIGITAL IT (8)
  { name: 'Shopify Uptime Health Monitor',     dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Continuous' },
  { name: 'N8N Workflow Health Check',         dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Every 5min' },
  { name: 'API Error Alert → Slack',           dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Real-time' },
  { name: 'Backup Verification',               dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Daily' },
  { name: 'SSL Certificate Monitor',           dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Daily' },
  { name: 'Cloudflare Worker Health',          dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Every 5min' },
  { name: 'Performance Audit Reporter',        dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Weekly' },
  { name: 'User Access Audit (Clerk)',         dept: 'Digital',    deptId: 'digital-it',    status: 'active', runs: 'Monthly' },
  // FINANCE (5)
  { name: 'Shopify Revenue → Ledger Sync',     dept: 'Finance',    deptId: 'finance',       status: 'active', runs: 'Real-time' },
  { name: 'Invoice Auto-Generator',            dept: 'Finance',    deptId: 'finance',       status: 'active', runs: 'On order' },
  { name: 'Vendor Payment Scheduler',          dept: 'Finance',    deptId: 'finance',       status: 'active', runs: 'Net 30 terms' },
  { name: 'Weekly P&L Auto-Report',            dept: 'Finance',    deptId: 'finance',       status: 'active', runs: 'Every Monday' },
  { name: 'Month-End Close Checklist',         dept: 'Finance',    deptId: 'finance',       status: 'active', runs: 'Monthly' },
];
