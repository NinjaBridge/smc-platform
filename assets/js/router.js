// assets/js/router.js
// SMC Unified Intelligence Platform — Hash-based SPA routing
// CR-001 · 2026-03-07 · ASAP Digital Platforms · KnCO IT Ops

const VIEWS = {
  '#command':     renderCommand,
  '#departments': renderDepartments,
  '#journey':     renderJourney,
  '#operations':  renderOperations,
};

function navigate(hash) {
  const targetHash = hash || '#command';

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.getAttribute('href') === targetHash);
  });

  // Clear main content
  const main = document.getElementById('main-content');
  if (!main) return;
  main.innerHTML = '';
  main.className = 'main-content view-enter';

  // Render the matching view
  const renderer = VIEWS[targetHash] || renderCommand;
  renderer(main);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => main.classList.add('view-visible'));
  });

  // Update URL hash without page reload
  history.replaceState(null, '', targetHash);
}

// Listen for hash changes (browser back/forward)
window.addEventListener('hashchange', () => navigate(window.location.hash || '#command'));

// Bind nav links via addEventListener (no inline onclick — CB-H02 compliance)
function bindNavLinks() {
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(el.dataset.view);
    });
  });
}

// Initial load — deferred until Clerk auth confirms user
window._routerReady = function() {
  bindNavLinks();
  navigate(window.location.hash || '#command');
};
