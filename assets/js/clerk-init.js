// assets/js/clerk-init.js
// SMC Unified Intelligence Platform — Clerk v5 auth init (dashboard.html)
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops
// DEF-0013 fix · 2026-03-11: Portal link + UserButton z-index
// CR-210 quick-win · 2026-03-11: Logout, Admin Console, Invite User (admin) header actions

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
    window.location.href = '/';
    return;
  }

  const user = clerk.user;
  const role = user.publicMetadata?.role || '';
  const isAdmin = ['super_admin', 'site_admin'].includes(role);
  const isSuperAdmin = role === 'super_admin';

  // Populate user name in topbar
  const nameEl = document.getElementById('user-name');
  if (nameEl) {
    nameEl.textContent = user.firstName
      ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
      : (user.emailAddresses?.[0]?.emailAddress || 'User');
  }

  // Render admin action buttons (role-gated)
  const adminActionsEl = document.getElementById('admin-actions');
  if (adminActionsEl) {
    // Admin Console link — visible to site_admin + super_admin
    if (isAdmin) {
      const adminLink = document.createElement('a');
      adminLink.href = 'https://admin.kncocpa-bayarea.com';
      adminLink.className = 'portal-link';
      adminLink.title = 'Go to Admin Console';
      adminLink.textContent = '⬡ Admin';
      adminActionsEl.appendChild(adminLink);
    }

    // Invite User — visible to super_admin only
    if (isSuperAdmin) {
      const inviteLink = document.createElement('a');
      inviteLink.href = 'https://admin.kncocpa-bayarea.com/#users';
      inviteLink.className = 'portal-link portal-link--invite';
      inviteLink.title = 'Invite a user via Admin Console';
      inviteLink.textContent = '+ Invite';
      adminActionsEl.appendChild(inviteLink);
    }
  }

  // Sign Out button — always visible
  const signOutEl = document.getElementById('sign-out-btn');
  if (signOutEl) {
    signOutEl.addEventListener('click', async () => {
      await clerk.signOut();
      window.location.href = 'https://bridge.kncocpa-bayarea.com';
    });
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
