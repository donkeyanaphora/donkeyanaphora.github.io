/* ======================================================================
   article.js — standalone JavaScript for article pages (2025-05-30)
   • Only includes dark mode toggle functionality
   • Safe guards to prevent errors if button doesn't exist
====================================================================== */

/* ----------------------------------------------------------------------
   Helper utilities
---------------------------------------------------------------------- */
const $ = s => document.querySelector(s);

/* ----------------------------------------------------------------------
   Dark-/light-mode toggle (works if toggle button present)
---------------------------------------------------------------------- */
(function () {
  const btn = $('#toggleDark');
  if (!btn) return;                         // this page has no toggle

  const root = document.documentElement;
  const KEY  = 'theme';
  try { if (localStorage.getItem(KEY) === 'dark') root.classList.add('theme-dark'); } catch {}

  const syncIcon = () => { btn.textContent = root.classList.contains('theme-dark') ? '☀️' : '🌙'; };
  syncIcon();

  btn.addEventListener('click', () => {
    root.classList.toggle('theme-dark');
    syncIcon();
    try { localStorage.setItem(KEY, root.classList.contains('theme-dark') ? 'dark' : 'light'); } catch {}
    updateCanvasBackground();               // noop if no canvas yet
  });
})();