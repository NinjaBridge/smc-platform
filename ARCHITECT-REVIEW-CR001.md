# ARCHITECT REVIEW — CR-001: SMC Unified Intelligence Platform v3
**Document ID**: ARCH-REV-CR001
**Date**: 2026-03-07
**Reviewer**: Architect Agent — ASAP Digital Platform
**Subject**: CR-001 Build Specification — SMC Unified Intelligence Platform v3 (Dept Command Centre)
**Proposed URL**: smc-ops.kncocpa-bayarea.com
**Proposed Project**: smc-platform (CF Pages)
**Source Evidence**:
- `C:\Users\Sheena\Projects\smc-auth-worker\index.js` (existing auth worker pattern)
- `C:\Users\Sheena\Projects\smc-auth-worker\wrangler.toml` (worker naming convention)
- `C:\Users\Sheena\Projects\smc-combined-v3\HACKER-MIGRATION-SECURITY-REVIEW-2026-03-05.md` (security baseline)
- `C:\Users\Sheena\Projects\smc-combined-v3\HACKER-RETEST-REPORT-2026-03-05.md` (pentest findings)
- `C:\Users\Sheena\Projects\asap-command-bridge\ENGINEERING-DESIGN.md` (platform architecture precedent)
- MEMORY.md (ADR-034, ADR-035, platform registry, DNS state)

---

## Overall Verdict

**GO** — with 3 Conditions that must be resolved before Sprint CR-1 starts.

No blockers to the architecture itself. The stack is sound, coexistence is clean, and the data layer design is future-proof. The three conditions are security surface items that must be addressed at the build stage, not after.

---

## Review Item 1: Stack Validation (ADR-034 Compliance)

**Verdict: APPROVED**

The proposed stack — Static HTML + Vanilla JS + Clerk JS SDK v5 + Cloudflare Pages + CF Worker (auth proxy) — is a direct implementation of ADR-034 (platform standard: CF Pages + CF Worker auth, Netlify retired). Every structural element matches the established pattern:

| Spec Element | ADR-034 Requirement | Match? |
|---|---|---|
| CF Pages deployment | Required for all portals | YES |
| CF Worker auth proxy | Required for protected portals | YES |
| Clerk v5 sign-in | Production instance standard | YES |
| No Netlify | Netlify retired (ADR-034) | YES |
| _redirects file | CF Pages SPA routing standard | YES |
| Static HTML + Vanilla JS | Matches smc-combined-v3 pattern | YES |

The split into separate CSS files (tokens.css, layout.css, components.css, animations.css) and separate JS data files (departments.js, journey.js, kpis.js, alerts.js, automations.js) is a significant improvement over the monolithic smc-combined-v3 index.html (~2,491 lines). This is architecturally better and should be noted as a positive deviation from the existing pattern.

Hash-based SPA routing (`#command`, `#departments`, etc.) is the correct choice for a CF Pages static deployment. No server-side rendering means no cold starts, no function execution costs, and instant global edge delivery.

**No conditions.**

---

## Review Item 2: Coexistence Validation

**Verdict: APPROVED**

The proposed subdomain `smc-ops.kncocpa-bayarea.com` does not conflict with any existing deployment.

Current DNS registrations on kncocpa-bayarea.com:

| Subdomain | CF Pages Project | Auth | Purpose |
|---|---|---|---|
| www | knco-landing | PUBLIC | KnCO marketing site |
| v3 | knco-landing-v3 | PUBLIC | KnCO landing v3 |
| bra | bra-ninjaops | Worker: bra-auth | BRA demo |
| smc-wireframe | smc-dome-wireframe | Worker: smc-wireframe-auth | SMC wireframe |
| smc-journey | smc-dome-journey | Worker: smc-journey-auth | Journey orchestration |
| smc-asap-dome | smc-asap-dome | Worker: smc-dome | SMC DOME portal |
| research | (ninja-bot Worker) | Clerk JWT | Ninja Deep Researcher |
| clerk | CNAME → Clerk CDN | (DNS only) | Clerk FAPI |
| **smc-ops** | **smc-platform (proposed)** | **Worker: smc-ops-auth (new)** | **THIS BUILD** |

`smc-ops` is unregistered. Clean addition. The CF Pages project `smc-platform` does not collide with any existing project name in the registry.

One naming note: the directory `C:\Users\Sheena\Projects\smc-platform\` already exists on disk (created pre-build), which confirms the intent. The directory contains only empty asset subdirectory stubs, consistent with spec.

**One advisory** (not a condition): Confirm with Noel that `smc-ops` is the desired end-user-facing subdomain name before DNS CNAME is created. `smc-asap-dome` used a product-branded name. `smc-ops` is more operations-oriented (appropriate for a dept command centre) but less brand-visible. Alternative `smc-command` or `smc-platform` could be considered. This is a naming preference, not an architecture decision.

---

## Review Item 3: Clerk Key Reuse

**Verdict: CONDITIONAL APPROVED**

**Condition CR1-C1 (MUST resolve before build):**

Reusing `pk_live_Y2xlcmsua25jb2NwYS1iYXlhcmVhLmNvbSQ` (the same Clerk Production instance used by `smc-asap-dome.kncocpa-bayarea.com`) is architecturally acceptable with a critical dependency: the Clerk application must be configured to allow both origins.

Clerk SDK v5 validates that the sign-in request originates from an authorised domain. The existing instance was configured for `smc-asap-dome.kncocpa-bayarea.com`. Adding `smc-ops.kncocpa-bayarea.com` requires adding that domain to the Clerk application's "Allowed Origins" list in the Clerk dashboard before the new site goes live.

If this is not done, Clerk will reject sign-in attempts from the new subdomain with an origin mismatch error. This will manifest as a blank Clerk component or a silent auth failure — exactly the class of ISS-041 that caused the DOME outage (root cause: CSP + origin mismatch chain).

**Resolution steps for CR1-C1:**
1. Clerk Dashboard > Applications > (SMC Production instance) > Domains
2. Add `smc-ops.kncocpa-bayarea.com` to Allowed Origins
3. Verify `clerk.kncocpa-bayarea.com` FAPI CNAME is already registered (it is, per MEMORY.md DNS table — 5/5 verified)
4. No new DNS record needed for Clerk itself — the FAPI domain is shared

**Security consideration on shared instance**: All users invited to the Clerk instance have accounts that are technically valid credentials for both `smc-asap-dome` and `smc-ops`. The auth Worker is the enforcement layer that restricts access per-site (different Worker, different session cookie name, different KV namespace). This is the correct design — Clerk handles identity, the Worker handles access scope. There is no cross-site session risk because:
- Each Worker sets its own named cookie (existing: `smc-dome-session`; new: must be a different name, e.g. `smc-ops-session`)
- Cookies are scoped to their domain by the browser
- SameSite=Strict prevents cross-origin cookie transmission

**The new Worker's COOKIE_NAME must not be `smc-dome-session`** — it must be a distinct value. Flag this in the build spec.

---

## Review Item 4: Data Architecture — window.SMC_DATA.* Pattern

**Verdict: APPROVED**

The `window.SMC_DATA.*` pattern as a client-side data layer is sound for the current scope and the stated N8N integration path. Assessment by layer:

**Present state (static JS data files):**
The spec calls for five data files — `departments.js`, `journey.js`, `kpis.js`, `alerts.js`, `automations.js` — each exporting into `window.SMC_DATA`. This is the correct pattern for a static SPA. It is a clean improvement over the monolithic approach in `smc-combined-v3/index.html` where all data was inline in the HTML file.

Populating `window.SMC_DATA` from separate `<script src="...">` tags means:
- Each data domain is independently updateable without touching view logic
- Browser caches the JS files separately (good for performance on repeat visits)
- N8N can write updated data files to the CF Pages repo via GitHub API and trigger a redeploy — this is a legitimate JAMstack integration pattern and requires zero refactoring of the view layer

**Future state (CF Worker KV + N8N):**
When the platform evolves to live data, the transition path is:
```
window.SMC_DATA.departments = [/* static */]
            ↓ (future)
fetch('/api/data/departments')
  .then(r => r.json())
  .then(d => window.SMC_DATA.departments = d)
```
The Worker already handles `/api/*` routes (see existing auth worker pattern with `/api/auth-callback`, `/api/track`, `/api/logs`). Adding `/api/data/*` endpoints that read from KV requires no change to the view layer HTML — only the data initialization code changes from static assignment to a fetch call.

This is exactly "zero refactoring needed by design" as claimed in the spec, and the claim is correct.

**One discipline requirement**: All 5 data files must namespace strictly under `window.SMC_DATA.*` and never pollute the global scope with bare variable names. The build must enforce this via a namespace guard at the top of each data file:
```js
window.SMC_DATA = window.SMC_DATA || {};
window.SMC_DATA.departments = [ ... ];
```

The 42-automation `automations.js` dataset is the highest-complexity file. If automations have nested trigger/action/condition structures, document the schema in a comment block at the top of the file now. This schema becomes the contract for N8N when it writes to KV.

**No conditions** — but note the discipline requirement above as a build-time standard.

---

## Review Item 5: Security Surface

**Verdict: CONDITIONAL APPROVED**

**Condition CR1-C2 (MUST resolve before build):**

The existing auth worker (`smc-auth-worker/index.js`) has a confirmed reflected XSS vulnerability documented in the pentest report as N-001 (HIGH severity, currently unresolved per the retest sign-off). The pattern involves unescaped interpolation of a POST body parameter into an HTML template:

```js
// Vulnerable pattern in existing worker
<input type="hidden" name="ref" value="${ref}">  // ref is user-controlled
```

The new auth Worker for smc-ops must NOT copy this vulnerable pattern. If the new Worker is generated by copying the existing `smc-auth-worker/index.js` as a base (which is the natural thing to do), the N-001 vulnerability will be carried forward into the new worker.

**Required fix in new Worker build**: Any `ref` or redirect-target parameter read from POST body must be validated against an allowlist before HTML interpolation. The pentest report specifies the exact fix:
```js
// Allowlist validation — do this in new Worker, not raw interpolation
const ALLOWED_REFS = ['', 'dashboard', 'departments', 'journey', 'operations'];
const safeRef = ALLOWED_REFS.includes(ref) ? ref : '';
```

This is a build-time requirement. Do not ship the new Worker without this guard.

**Condition CR1-C3 (MUST resolve before build):**

The new CF Pages project will have a public `.pages.dev` origin URL (e.g. `smc-platform.pages.dev`). Per H-006 (documented known gap on the existing smc-asap-dome deployment), the pages.dev URL bypasses the auth Worker entirely — anyone who discovers `smc-platform.pages.dev` gets unauthenticated access to the full dashboard.

For the existing `smc-asap-dome.pages.dev`, this was accepted as an architectural gap (ADR-033) because the site contains only static demo data. The new `smc-platform` / CR-001 build contains 7-department operational KPIs, 42 automations, and journey data — a richer set of confidential SMC business intelligence than the existing demo.

**Required mitigation for CR1-C3** (choose one before Sprint CR-1):
- Option A (Recommended): Enable Cloudflare Access on the Pages project to restrict `.pages.dev` access. Free tier supports this. ADR-035 already scoped Clerk JWT auth for BRA Phase 2 — apply the same pattern here from the start.
- Option B (Minimum): The new `smc-platform` Pages project must have a robots.txt (`Disallow: /`) deployed at root. This is already platform standard (all 5 migrated sites have it) and must also apply here. This does not prevent direct access but eliminates search engine indexing.

Option A should be the default given the higher data sensitivity of this build versus the existing wireframe demo. Raise this as a sprint-zero task, not a post-launch cleanup.

**Additional security notes (non-blocking):**

1. **Cookie name isolation**: As noted in Item 3, the new Worker's `COOKIE_NAME` constant must differ from `smc-dome-session`. Suggest `smc-ops-session`.

2. **KV namespace isolation**: The new Worker must have its own KV namespace (not share `SMC_USAGE_LOG` with the existing smc-dome worker). Isolate usage logs per-portal for auditability.

3. **CSP header**: The existing worker's `addSecurityHeaders()` sets `frame-ancestors 'self'` but does not set a full Content-Security-Policy. For a new build, add a `default-src` CSP that allowlists Google Fonts CDN and the Clerk JS CDN as the minimum. This prevents unexpected third-party script injection. Reference the ISS-041 post-mortem — the DOME outage was partly caused by a missing CSP `connect-src` directive for `*.clerk.accounts.dev`.

4. **No hardcoded data in HTML**: The N8N integration design is clean, but confirm the static data files do not contain real SMC customer PII. Names like "Marcus Wellenbacher" in the existing wireframe (flagged as WF-03 / CJ-02 in the hacker report) were a risk item. If the new 7-department dataset includes named customers or real financial figures, they must be clearly fictionalized personas only.

5. **Automations.js — 42 entries**: This is the file most likely to contain operationally sensitive information (trigger conditions, thresholds, business rules). It must not reference real vendor names, internal system credentials, webhook URLs, or N8N workflow IDs in the static placeholder data.

---

## Review Item 6: CF Pages Project Naming

**Verdict: RECOMMENDATION — use `smc-ops`**

Evaluate against the three candidates:

| Candidate | Assessment |
|---|---|
| `smc-platform` | Too generic. The directory on disk is already named `smc-platform` so it is the natural default — but as a CF Pages project name it lacks specificity. Future SMC builds could also claim "platform." |
| `smc-ops` | Matches the subdomain (`smc-ops.kncocpa-bayarea.com`). Consistent with the naming pattern where CF Pages project name mirrors the subdomain prefix (precedents: `bra-ninjaops` → `bra.kncocpa-bayarea.com`, `smc-dome-wireframe` → `smc-wireframe.kncocpa-bayarea.com`). Clear and purpose-specific. |
| Other (e.g. `smc-command`) | Only if the subdomain changes to `smc-command.kncocpa-bayarea.com`. Keep project name and subdomain prefix in sync. |

**Recommendation**: CF Pages project name = `smc-ops`. Worker name = `smc-ops-auth` (consistent with `bra-auth`, `smc-wireframe-auth`, `smc-journey-auth` naming convention).

Local project directory can remain `smc-platform` (directory name does not affect deployment).

---

## Review Item 7: ADR-Worthy Decisions

**Verdict: 2 ADRs required, 1 optional**

### ADR-037 (Required): Clerk Multi-Origin Single Instance Pattern

**Context**: CR-001 is the second portal to reuse the Clerk Production instance `ins_3AbQkYhPmRfewiajmBpfVonXwhT`. This establishes a pattern: one Clerk instance serves multiple subdomains, with per-portal access scoping handled at the CF Worker layer rather than by creating separate Clerk instances per portal.

**Decision to record**: Single Clerk Production instance is the ASAP platform standard. New portals add their subdomain to Allowed Origins. Separate Clerk instances are only created for separate client organisations (e.g. a non-SMC client tenant would get a new instance). Worker layer is the access control boundary; Clerk is the identity layer only.

**Why ADR is needed**: Without this decision recorded, future builders may create new Clerk instances per portal unnecessarily, fragmenting identity management and creating invite-management overhead. This ADR codifies the architecture intent.

### ADR-038 (Required): window.SMC_DATA Static Data Layer as N8N Integration Contract

**Context**: CR-001 introduces a structured client-side data layer (`window.SMC_DATA.*`) with five named data domains. This is the first platform build to deliberately architect for a future N8N → KV → fetch migration path without requiring view-layer changes.

**Decision to record**: For all SMC static-to-live data migration paths, `window.SMC_DATA.*` is the stable namespace contract. Static `.js` data files initialize the namespace. When live data is needed, a `fetchSMCData()` bootstrap function replaces static initialization — views do not change. N8N writes to CF Worker KV; Worker exposes `/api/data/*` endpoints; client fetches on load. This is the approved migration pattern.

**Why ADR is needed**: Without this recorded, a future developer might refactor the data layer when adding live data, breaking the "zero refactoring" guarantee and creating unnecessary rework.

### ADR-039 (Optional / Recommended): CF Access on Pages Origin as Standard for Operational Dashboards

**Context**: H-006 (pages.dev bypass) was accepted for the demo-data wireframe (ADR-033). CR-001 is the first build with operational KPI data, not just demo placeholders. The risk calculus changes.

**Decision to record**: For any CF Pages deployment containing real or operationally representative KPI data (not purely demo/marketing data), CF Access must be enabled on the `.pages.dev` origin before go-live. Demo-only sites (BRA, smc-wireframe) may retain the accepted-gap status. This closes the H-006 class of vulnerability by policy rather than site-by-site workaround.

**Why ADR is needed**: Establishes the boundary between "demo gap accepted" and "operational data requires origin lockdown" — prevents future builds from defaulting to the demo-gap pattern when the data sensitivity does not permit it.

---

## Conditions Summary

| ID | Item | Severity | Resolution |
|---|---|---|---|
| CR1-C1 | Add `smc-ops.kncocpa-bayarea.com` to Clerk Allowed Origins AND use a distinct `COOKIE_NAME` (`smc-ops-session`) in the new auth Worker | BLOCKER — build will silently fail auth without this | Before Sprint CR-1 Day 1 |
| CR1-C2 | New auth Worker must NOT carry forward N-001 XSS vulnerability. Implement POST body `ref` allowlist validation. | BLOCKER — security regression if unresolved | Before first Worker deploy |
| CR1-C3 | Enable Cloudflare Access on `smc-platform.pages.dev` origin OR confirm acceptance and document as known gap with ADR reference. Given higher data sensitivity than wireframe, Option A (CF Access) is recommended. | CONDITIONAL — acceptable if documented, but recommended to close | Before go-live URL is shared with SMC |

---

## Overall GO/NO-GO

**OVERALL: GO (Conditional)**

All conditions are solvable in < 2 hours of setup time before Sprint CR-1 begins. None require architectural changes to the build spec. The spec itself is architecturally sound.

**Pre-sprint checklist:**

- [ ] CR1-C1: Clerk dashboard → add `smc-ops.kncocpa-bayarea.com` to Allowed Origins
- [ ] CR1-C1: Confirm new Worker COOKIE_NAME = `smc-ops-session` in build spec
- [ ] CR1-C2: N-001 XSS fix documented in new Worker spec (ref allowlist pattern)
- [ ] CR1-C3: Decision made on CF Access for pages.dev origin (recommend: YES, enable)
- [ ] ADR-037 raised in ADR-LOG.md
- [ ] ADR-038 raised in ADR-LOG.md
- [ ] ADR-039 raised or CR1-C3 accepted-gap documented

**Implementation recommendation**: Build in the sequence below to match the pattern from ISS-041 post-mortem (which taught us that auth wiring failures are more painful to debug after the dashboard is built than before):

1. Auth Worker first — deploy `smc-ops-auth` to Workers, verify Clerk sign-in works at `smc-ops.kncocpa-bayarea.com` before any dashboard HTML is written
2. Data files second — `departments.js`, `kpis.js`, `alerts.js`, `automations.js`, `journey.js` with `window.SMC_DATA` namespace structure
3. CSS token system — `tokens.css` (design tokens) before any component CSS, so all subsequent CSS has the correct variable names
4. Views in dependency order — Command Center (no dependencies) → Departments (depends on departments.js) → Journey (depends on journey.js) → Operations (depends on all data files)
5. Smoke test auth + data layer + view routing end-to-end before finalising dashboard content

---

*Architect Review complete.*
*Next action: Raise ADR-037, ADR-038, (ADR-039) in ADR-LOG.md. Then proceed to Sprint CR-1.*
