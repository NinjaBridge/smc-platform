# CR-001 — SMC Unified Intelligence Platform v3
## Change Record · ASAP Digital Platform · KnCO IT Ops

---

| Field              | Value                                                               |
|--------------------|---------------------------------------------------------------------|
| **CR Number**      | CR-001                                                              |
| **Title**          | SMC Unified Intelligence Platform — Dept Command Centre v3          |
| **Requested by**   | Noel / GNM Consulting Project                                       |
| **Assigned to**    | Ninja (ASAP Agent Workforce)                                        |
| **Date Raised**    | 2026-03-07                                                          |
| **Priority**       | High — GNM client demo deliverable                                  |
| **Status**         | BUILT — PENDING DEPLOY                                              |
| **Source Brief**   | SMC-Dep-Comm-Cent-ClaudeCode-Build-Instructions-v3.md               |
| **CF Pages Project** | `smc-ops`                                                         |
| **Target URL**     | https://smc-ops.kncocpa-bayarea.com                                 |
| **Auth Worker**    | `smc-ops-auth` (CF Workers)                                         |
| **Coexistence**    | YES — separate from smc-asap-dome.kncocpa-bayarea.com (no conflict) |

---

## 1. What Is This?

A new SMC demo portal — the **Unified Intelligence Platform** — showing Sierra Madre Collection's 7-department operational intelligence dashboard with:

- **4 views**: Command Center · Departments · Customer Journey · Operations
- **7 departments**: Ecom, Purchasing, Fulfillment, Care, Product Dev, Digital IT, Finance
- **42 N8N automations** across all departments
- **6-stage customer journey** (Discover → Shop → Order → Fulfill → Service → Retain)
- **Design system**: Guards Red (#E30613) + Carbon fiber dark palette + Bebas Neue display font
- **Auth**: Clerk v5 (Production instance) via CF Worker proxy
- **Data**: Mockup JS data files (window.SMC_DATA.*) — N8N-ready integration contract

This is **version 3** of the SMC Departmental Command Centre concept. Versions 1 and 2 were wireframe and journey orchestration demos respectively. This is the full multi-view operations platform.

---

## 2. Agentic Review Summary

Three agents ran in parallel before implementation:

### Architect Review — GO (Conditional)
File: `ARCHITECT-REVIEW-CR001.md`

| Item                    | Verdict    | Notes |
|-------------------------|------------|-------|
| Stack (ADR-034)         | APPROVED   | CF Pages + Clerk v5 + Vanilla JS matches standard |
| Coexistence             | APPROVED   | smc-ops subdomain free, no conflicts |
| Clerk key reuse         | CONDITIONAL| CR1-C1: Add origin to Clerk Allowed Origins, cookie name = smc-ops-session |
| Data architecture       | APPROVED   | window.SMC_DATA.* is sound N8N integration contract |
| Security surface        | CONDITIONAL| CR1-C2: Worker proxy required (CB-C01); CR1-C3: CF Access on .pages.dev |
| CF Pages project name   | smc-ops    | Consistent with existing naming convention |
| ADRs required           | ADR-037/038/039 | To be raised post-deploy |

### Hacker Pre-Build — DESIGN HOLD → RESOLVED
File: `C:\Users\Sheena\Projects\smc-combined-v3\HACKER-PRE-BUILD-CR001-2026-03-07.md`

**14 findings: 2 CRITICAL, 4 HIGH, 4 MEDIUM, 3 LOW, 1 INFO**

| Finding | Severity | Resolution |
|---------|----------|------------|
| CB-C01: Client-side auth not access control | CRITICAL | ✅ FIXED — CF Worker proxy implemented (smc-ops-auth) |
| CB-C02: dashboard.html accessible without auth | CRITICAL | ✅ FIXED — Worker intercepts all requests |
| CB-H01: No CSP | HIGH | ✅ FIXED — Full CSP in Worker + _headers file |
| CB-H02: Inline event handlers | HIGH | ✅ FIXED — All handlers use addEventListener, esc() escaping |
| CB-H03: Clerk dashboard config | HIGH | ⚠️ MANUAL — Add smc-ops.kncocpa-bayarea.com to Clerk Allowed Origins |
| CB-H04: No server-side JWT validation | HIGH | ✅ FIXED — Worker verifies RS256 JWT via WebCrypto |
| CB-M01: innerHTML XSS debt | MEDIUM | ✅ FIXED — esc() function applied to all interpolated values |
| CB-M02: Open redirect risk | MEDIUM | ✅ FIXED — Hash-based routing only, no ?redirect= params |
| CB-M03: No robots.txt | MEDIUM | ✅ FIXED — robots.txt: Disallow:/ added |
| CB-M04: Google Fonts privacy | MEDIUM | KNOWN GAP — acceptable for demo |
| CB-L01: Clerk JS no SRI | LOW | KNOWN GAP — floating @5 tag acceptable for demo |
| CB-L02: sessionStorage gate bypassable | LOW | N/A — not used in v3 |
| CB-L03: PII in hash fragments | LOW | ✅ FIXED — hash fragments are view names only |

### QA Definition of Done
File: `C:\Users\Sheena\Projects\asap-command-bridge\QA-DOD-CR001.md`

20 acceptance criteria across 9 categories. 12-item smoke test checklist. Ready for post-deploy execution.

---

## 3. File Manifest (22 files)

```
smc-platform/
├── CR-001-CHANGE-RECORD.md       ← This document
├── ARCHITECT-REVIEW-CR001.md     ← Architect review output
├── index.html                    ← Login/auth gate (Clerk sign-in)
├── dashboard.html                ← Main app shell (protected)
├── _headers                      ← CF Pages security headers (full CSP — CB-H01)
├── _redirects                    ← CF Pages routing rules
├── robots.txt                    ← Disallow:/ (demo site — CB-M03)
│
├── assets/css/
│   ├── tokens.css                ← SMC design system (Guards Red, Carbon palette)
│   ├── layout.css                ← TopBar, nav, main shell, login page, footer
│   ├── components.css            ← KPI tiles, panels, dept cards, alerts, tables
│   └── animations.css            ← View transitions, stagger, hover lifts, pulses
│
└── assets/js/
    ├── main.js                   ← Clock tick, esc() escaping, pill() utilities
    ├── router.js                 ← Hash-based SPA routing (no inline onclick)
    ├── clerk-init.js             ← Clerk v5 auth init, user injection, router boot
    │
    ├── data/
    │   ├── departments.js        ← 7 departments + metrics + automations
    │   ├── journey.js            ← 6 journey stages + health scores + conversion
    │   ├── kpis.js               ← 6 KPI tiles + brand stats + funnel data
    │   ├── alerts.js             ← 5 alert items (Intelligence Feed)
    │   └── automations.js        ← 42 automations (N8N KV contract)
    │
    └── views/
        ├── command.js            ← Command Center (KPI strip + journey bar + dept table + alerts + funnel)
        ├── departments.js        ← Dept grid + journey filter + drill-down detail
        ├── journey.js            ← Journey map grid + cards + conversion funnel
        └── operations.js         ← Automation inventory + integration status
```

Auth Worker (separate repo section):
```
smc-auth-worker/smc-ops/
├── index.js     ← CF Worker (JWT verify + session + proxy) — CB-C01/CB-C02 resolved
└── wrangler.toml
```

---

## 4. Security Decisions

All security decisions are per Hacker pre-build review CB-C01/CB-C02:

1. **CF Worker proxy is the ONLY auth gate** — `smc-ops-auth` Worker intercepts every request, verifies Clerk RS256 JWT, issues HMAC-SHA256 session cookie before proxying to CF Pages
2. **Client-side `window.Clerk.user`** check in clerk-init.js is a UX redirect only — secondary to the Worker
3. **COOKIE_NAME = `smc-ops-session`** (not smc-dome-session — per Architect CR1-C1)
4. **Full CSP** in both `_headers` file and Worker response headers (belt-and-suspenders)
5. **esc() escaping** applied to every dynamic value in innerHTML renderers
6. **addEventListener** used throughout — zero inline `onclick=""` handlers

---

## 5. Known Gaps (Accepted)

| Gap       | Class  | Decision |
|-----------|--------|----------|
| Google Fonts CDN privacy leak | CB-M04 | Accepted — demo site, not production |
| Clerk JS no SRI hash pinning | CB-L01 | Accepted — floating @5 tag matches existing smc-dome pattern |
| .pages.dev origin bypass (H-006 class) | CR1-C3 | OWNER ACTION: Enable CF Access on smc-ops.pages.dev — Noel to do |

---

## 6. Manual Pre-Deploy Actions (Noel / Ninja)

**Before going live, these must be done by a human:**

1. **Clerk Dashboard** → Settings → Allowed Origins → Add: `https://smc-ops.kncocpa-bayarea.com`
   (Without this, sign-in will fail with origin mismatch — ISS-041 lesson)

2. **CF Pages** → Create new Pages project named `smc-ops`
   - Connect GitHub repo (push smc-platform/ to a repo first)
   - Build command: (blank)
   - Build output: /
   - Framework: None

3. **CF Worker deploy** — from `smc-auth-worker/smc-ops/`:
   ```
   wrangler secret put UPSTREAM           # https://smc-ops.pages.dev
   wrangler secret put CLERK_FRONTEND_API # clerk.kncocpa-bayarea.com
   wrangler secret put CLERK_PK           # pk_live_Y2xlcmsua25jb2NwYS1iYXlhcmVhLmNvbSQ
   wrangler secret put ACCESS_SECRET      # <random 32+ char string>
   wrangler secret put ADMIN_KEY          # <random secret>
   wrangler deploy
   ```

4. **CF DNS** → Add CNAME: `smc-ops` → `smc-ops-auth.sheena-215.workers.dev`
   (or configure route in CF dashboard matching `smc-ops.kncocpa-bayarea.com/*`)

5. **CF Pages** → Custom domain → Add `smc-ops.kncocpa-bayarea.com`

6. **CF Access** (recommended) → Enable on `smc-ops.pages.dev` origin to close H-006 gap

---

## 7. Post-Deploy QA

Run the 12-item smoke test from QA-DOD-CR001.md:
- Open Incognito → smc-ops.kncocpa-bayarea.com
- Verify auth gate (not dashboard.html served raw)
- Sign in, verify all 4 views, all 7 departments
- Check Clerk watermark (should be absent — Production instance)
- Verify no 404s on assets, no Clerk console errors

---

## 8. ADRs to Raise Post-Deploy

- **ADR-037**: Clerk Multi-Origin Single Instance Pattern
- **ADR-038**: window.SMC_DATA Static Data Layer as N8N Integration Contract
- **ADR-039**: CF Access Required for Operational Data Deployments

---

*CR-001 · SMC Unified Intelligence Platform v3*
*Built: 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops*
*Stack: Cloudflare Pages + Workers + Clerk v5 + Vanilla JS*
