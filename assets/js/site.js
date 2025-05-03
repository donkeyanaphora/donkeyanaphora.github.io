/* ----------------------------------------------------------------------
   Helper utilities
---------------------------------------------------------------------- */
const $          = selector => document.querySelector(selector);
const $$         = selector => document.querySelectorAll(selector);
const isDarkMode = () => document.documentElement.classList.contains('theme-dark');

/* ----------------------------------------------------------------------
   1.  Quote rotator in the header
---------------------------------------------------------------------- */
(function rotateQuotes() {
  const quotes = [
    'Man is something that shall be overcome'
  ];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % quotes.length;
    $('#quip').textContent = `"${quotes[index]}"`;
  }, 10_000);
})();

/* ----------------------------------------------------------------------
   2.  Dark‑/light‑mode toggle with localStorage persistence
---------------------------------------------------------------------- */
(function darkModeToggle() {
  const btn          = $('#toggleDark');
  const rootElement  = document.documentElement;
  const storageKey   = 'theme';

  // –— initialise -------------------------------------------------------
  try {
    if (localStorage.getItem(storageKey) === 'dark') {
      rootElement.classList.add('theme-dark');
    }
  } catch (_) {/* localStorage may be blocked – ignore */}

  const updateIcon = () => {
    btn.textContent = isDarkMode() ? '☀️' : '🌙';
  };
  updateIcon();

  // –— click handler ----------------------------------------------------
  btn.addEventListener('click', () => {
    rootElement.classList.toggle('theme-dark');
    updateIcon();

    try {
      localStorage.setItem(storageKey, isDarkMode() ? 'dark' : 'light');
    } catch (_) {/* ignore quota / privacy errors */}

    // update canvas background to match new theme
    updateCanvasBackground();
  });
})();

/* ----------------------------------------------------------------------
   3.  Whiteboard modal logic
---------------------------------------------------------------------- */
const modal          = $('#sketchModal');
const modalContent   = $('#modalContent');
const sketchButton   = $('#sketchBtn');
const closeButton    = $('.close');
const fullscreenBtn  = $('#fullscreenBtn');
const canvas         = $('#sketchpad');

let ctx;                       // 2‑D context (set in initWhiteboard)
let isDrawing     = false;     // pointer is pressed
let isEraserMode  = false;     // eraser vs. pen
let currentColor  = '#000000'; // default ink colour
let lastFocusEl   = null;      // element that had focus before opening
let isFullscreen  = false;     // fullscreen toggle state

/* ---------- 3a. modal open / close ----------------------------------- */
function openModal() {
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  lastFocusEl = document.activeElement;
  modalContent.focus();
  initWhiteboard();
}

function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusEl) lastFocusEl.focus();
}

sketchButton.addEventListener('click', openModal);
closeButton.   addEventListener('click', closeModal);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
});
window.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

/* ---------- 3b. fullscreen toggle ------------------------------------ */
fullscreenBtn.addEventListener('click', () => {
  isFullscreen = !isFullscreen;
  modalContent.classList.toggle('fullscreen', isFullscreen);
  fullscreenBtn.textContent = isFullscreen ? '⛌' : '⛶';
  document.body.style.overflow = isFullscreen ? 'hidden' : '';
  requestAnimationFrame(initWhiteboard); // rebuild canvas after resize
});

/* ----------------------------------------------------------------------
   4.  Canvas helpers
---------------------------------------------------------------------- */
function strokeSize() {
  // scale line width to device size for a consistent feel
  return isEraserMode ? Math.max(4, canvas.width / 40)
                      : Math.max(2, canvas.width / 200);
}

function resetStrokeStyle() {
  // Always draw black (or chosen colour) on a white board; no dark‑mode magic
  const lw = isEraserMode ? Math.max(4, canvas.width / 40)
                          : Math.max(2, canvas.width / 200);
  ctx.lineWidth  = lw;
  ctx.lineCap    = 'round';
  ctx.lineJoin   = 'round';
  ctx.strokeStyle = isEraserMode ? '#ffffff' : currentColor;
}

function updateCanvasBackground() {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = '#ffffff';      // white board regardless of theme
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

/* ----------------------------------------------------------------------
   5.  Whiteboard initialisation & resize logic
---------------------------------------------------------------------- */
function initWhiteboard() {
  ctx = canvas.getContext('2d');

  // ---- resize canvas to fit container --------------------------------
  const containerRect = canvas.parentElement.getBoundingClientRect();
  const controlsH     = $('.sketch-controls').offsetHeight;
  const targetW       = Math.round(containerRect.width);
  const targetH       = Math.max(100, Math.round(containerRect.height - controlsH - 20));

  if (canvas.width !== targetW || canvas.height !== targetH) {
    // preserve drawing when resizing: copy → resize → draw back
    const copy = document.createElement('canvas');
    copy.width  = canvas.width;
    copy.height = canvas.height;
    copy.getContext('2d').drawImage(canvas, 0, 0);

    canvas.width  = targetW;
    canvas.height = targetH;
    ctx.drawImage(copy, 0, 0);
  }

  updateCanvasBackground();
  resetStrokeStyle();
  attachCanvasListeners();
  attachUiListeners();
}

/* ----------------------------------------------------------------------
   6.  Pointer / touch drawing handlers
---------------------------------------------------------------------- */
function canvasPos(evt) {
  const rect = canvas.getBoundingClientRect();
  const x    = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
  const y    = (evt.touches ? evt.touches[0].clientY : evt.clientY) - rect.top;
  return { x, y };
}

function beginStroke(evt) {
  evt.preventDefault();
  isDrawing = true;
  const { x, y } = canvasPos(evt);
  ctx.beginPath();
  ctx.moveTo(x, y);
}
function continueStroke(evt) {
  if (!isDrawing) return;
  evt.preventDefault();
  const { x, y } = canvasPos(evt);
  ctx.lineTo(x, y);
  ctx.stroke();
}
function endStroke() { isDrawing = false; }

function attachCanvasListeners() {
  if (canvas.dataset.listenersAttached) return; // idempotent
  canvas.dataset.listenersAttached = 'true';

  /* mouse */
  canvas.addEventListener('mousedown', beginStroke);
  canvas.addEventListener('mousemove', continueStroke);
  canvas.addEventListener('mouseup',   endStroke);
  canvas.addEventListener('mouseout',  endStroke);

  /* touch */
  canvas.addEventListener('touchstart', beginStroke, { passive:false });
  canvas.addEventListener('touchmove',  continueStroke, { passive:false });
  canvas.addEventListener('touchend',   endStroke);
}

/* ----------------------------------------------------------------------
   7.  UI controls – colour palette, eraser, clear button
---------------------------------------------------------------------- */
function attachUiListeners() {
  // colour / eraser buttons
  $$('.color-btn').forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = 'true';

    btn.addEventListener('click', evt => {
      $$('.color-btn.active').forEach(b => b.classList.remove('active'));
      evt.currentTarget.classList.add('active');

      const colour = evt.currentTarget.dataset.color;
      isEraserMode = (colour === 'eraser');
      if (!isEraserMode) currentColor = colour;
      resetStrokeStyle();
    });
  });

  // clear button
  const clearBtn = $('#clearBtn');
  if (!clearBtn.dataset.wired) {
    clearBtn.dataset.wired = 'true';
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateCanvasBackground();
    });
  }
}

/* ----------------------------------------------------------------------
   8.  Pseudo‑code pad modal
---------------------------------------------------------------------- */
const codeModal      = $('#codeModal');
const codeContent    = $('#codeContent');
const codeBtn        = $('#codeBtn');
const codeClose      = $('.code-close');
const codeFullBtn    = $('#codeFullscreen');
const codeArea       = $('#codeArea');

let codeFullscreen = false;
const CODE_KEY = 'pseudoCode';        // localStorage key

function openCode(){
  codeModal.style.display='block';
  codeModal.setAttribute('aria-hidden','false');
  lastFocusEl=document.activeElement;
  codeContent.focus();
  try{ codeArea.value=localStorage.getItem(CODE_KEY)||'Howdy! '; }catch(_){}
}
function closeCode(){
  codeModal.style.display='none';
  codeModal.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  lastFocusEl?.focus();
  try{ localStorage.setItem(CODE_KEY,codeArea.value); }catch(_){}
}

codeBtn.addEventListener('click', openCode);
codeClose.addEventListener('click', closeCode);
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && codeModal.style.display === 'block') closeCode();
});
window.addEventListener('click', e => {
  if (e.target === codeModal) closeCode();
});

codeFullBtn.addEventListener('click', () => {
  codeFullscreen = !codeFullscreen;
  codeContent.classList.toggle('fullscreen', codeFullscreen);
  codeFullBtn.textContent = codeFullscreen ? '⛌' : '⛶';
  document.body.style.overflow = codeFullscreen ? 'hidden' : '';
  setTimeout(() => codeArea.focus(), 50);
});
