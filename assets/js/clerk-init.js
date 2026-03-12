// assets/js/clerk-init.js
// SMC Unified Intelligence Platform — Clerk v5 auth init (dashboard.html)
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
// Architect CR1-C1: smc-ops.kncocpa-bayarea.com must be added to Clerk Allowed Origins

window.addEventListener('load', async () => {
  const clerk = window.Clerk;

  if (!clerk) {
    // Auth unavailable — show error, do not redirect
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;min-height:400px;flex-direction:column;gap:16px;">
          <div style="font-family:var(--font-display);font-size:24px;color:var(--alert);">Auth Service Unavailable</div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-3);">Please refresh or contact IT Operations.</div>
        </div>`;
    }
    return;
  }

  await clerk.load();

  // Redirect to login if not authenticated
  if (!clerk.user) {
    window.location.href = '/index.html';
    return;
  }

  // Populate user name in topbar
  const nameEl = document.getElementById('user-name');
  if (nameEl) {
    const user = clerk.user;
    nameEl.textContent = user.firstName
      ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
      : (user.emailAddresses?.[0]?.emailAddress || 'User');
  }

  // Mount user button (avatar + sign-out menu)
  const userButtonEl = document.getElementById('clerk-user-button');
  if (userButtonEl) {
    clerk.mountUserButton(userButtonEl, {
      afterSignOutUrl: 'https://bridge.kncocpa-bayarea.com',
      appearance: {
        variables: {
          colorPrimary:    '#E30613',
          colorBackground: '#1C1F22',
          colorText:       '#F4F2EE',
        },
        elements: {
          // Ensure dropdown escapes sticky header stacking context (DEF-0013 fix)
          userButtonPopoverCard: { zIndex: 9999 },
          userButtonPopoverRootBox: { zIndex: 9999 },
        }
      }
    });
  }

  // Boot the router now that auth is confirmed
  if (typeof window._routerReady === 'function') {
    window._routerReady();
  }
});
