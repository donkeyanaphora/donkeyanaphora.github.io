/* ======================================================================
   article.js — standalone JavaScript for article pages (2025-05-30)
   • Only includes dark mode toggle functionality
   • Safe guards to prevent errors if button doesn't exist
====================================================================== */

/* ----------------------------------------------------------------------
   Helper utilities
---------------------------------------------------------------------- */
const $ = s => document.querySelector(s);

/* no-op: article pages don't have canvas, but function is called by dark mode toggle */
function updateCanvasBackground() {
  // No canvas on article pages, so this does nothing
}

/* ----------------------------------------------------------------------
   Dark-/light-mode toggle (works if toggle button present)
---------------------------------------------------------------------- */
(function () {
  const btn = $('#toggleDark');
  if (!btn) return;                         // this page has no toggle

  const root = document.documentElement;
  const KEY  = 'theme';
  let isToggling = false;  // Debounce flag
  
  try { if (localStorage.getItem(KEY) === 'dark') root.classList.add('theme-dark'); } catch {}

  const syncIcon = () => { btn.textContent = root.classList.contains('theme-dark') ? '☀️' : '🌙'; };
  syncIcon();

  btn.addEventListener('click', () => {
    if (isToggling) return;  // Prevent spam clicking
    isToggling = true;
    
    root.classList.toggle('theme-dark');
    syncIcon();
    try { localStorage.setItem(KEY, root.classList.contains('theme-dark') ? 'dark' : 'light'); } catch {}
    updateCanvasBackground();               // noop since no canvas on article pages
    
    // Reset debounce after transition completes
    setTimeout(() => { isToggling = false; }, 300);
  });
})();

const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () =>
  document.body.classList.toggle('menu-open')
);