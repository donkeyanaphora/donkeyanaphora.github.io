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
// new stroke‑size slider reference

const strokeSlider = document.getElementById('strokeSizeSlider');

if (strokeSlider) {
  strokeSlider.addEventListener('input', () => {
    if (ctx) resetStrokeStyle();
  });
}

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

let wbBackDropPress = false;              // separate flag for the whiteboard

modal.addEventListener('pointerdown', e => {
  wbBackDropPress = (e.target === modal); // true only if press starts on backdrop
});
modal.addEventListener('pointerup', e => {
  if (wbBackDropPress && e.target === modal) closeModal();
  wbBackDropPress = false;                // reset every pointer sequence
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
  const size = strokeSlider
    ? parseInt(strokeSlider.value, 10)
    : (isEraserMode ? 20 : 2);

  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
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
   8.  Pseudo-code pad modal
---------------------------------------------------------------------- */
const codeModal   = $('#codeModal');
const codeContent = $('#codeContent');
const codeBtn     = $('#codeBtn');
const codeClose   = $('.code-close');
const codeFullBtn = $('#codeFullscreen');
const codeArea    = $('#codeArea');

let codeFullscreen = false;
const CODE_KEY = 'pseudoCode';   // localStorage key

function openCode () {
  codeModal.style.display = 'block';
  codeModal.setAttribute('aria-hidden', 'false');
  lastFocusEl = document.activeElement;
  codeContent.focus();
  try { codeArea.value = localStorage.getItem(CODE_KEY) || 'Howdy! '; } catch (_) {}
}
function closeCode () {
  codeModal.style.display = 'none';
  codeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusEl?.focus();
  try { localStorage.setItem(CODE_KEY, codeArea.value); } catch (_) {}
}

codeBtn.addEventListener('click', openCode);
codeClose.addEventListener('click', closeCode);

/* --- Escape key ----------------------------------------------------- */
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && codeModal.style.display === 'block') closeCode();
});

/* --- Back-drop press begins + ends on backdrop → close -------------- */
let cdbackDropPress = false;

codeModal.addEventListener('pointerdown', e => {
  cdbackDropPress = (e.target === codeModal);          // true only if press starts on backdrop
});
codeModal.addEventListener('pointerup', e => {
  if (cdbackDropPress && e.target === codeModal) closeCode();
  cdbackDropPress = false;                             // reset for next pointer sequence
});

/* --- Fullscreen toggle --------------------------------------------- */
codeFullBtn.addEventListener('click', () => {
  codeFullscreen = !codeFullscreen;
  codeContent.classList.toggle('fullscreen', codeFullscreen);
  codeFullBtn.textContent = codeFullscreen ? '⛌' : '⛶';
  document.body.style.overflow = codeFullscreen ? 'hidden' : '';
  setTimeout(() => codeArea.focus(), 50);
});

/* --- TAB / SHIFT-TAB indent / un-indent ---------------------------- */
codeArea.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const tab = '  ';                                   // or '\t'
    const [s, t] = [e.target.selectionStart, e.target.selectionEnd];

    if (e.shiftKey) {
      const before = e.target.value.slice(s - tab.length, s);
      if (before === tab) e.target.setRangeText('', s - tab.length, s, 'end');
    } else {
      e.target.setRangeText(tab, s, t, 'end');
    }
  }
});

/* --- UNDO / REDO  (⌘Z / ⌘⇧Z  or  Ctrl-Z / Ctrl-Y) ------------------- */
(() => {
  const undo = [];
  const redo = [];
  const MAX  = 100;

  undo.push(codeArea.value);                           // initial snapshot

  codeArea.addEventListener('input', () => {
    if (undo.length >= MAX) undo.shift();
    undo.push(codeArea.value);
    redo.length = 0;                                   // clear redo chain
  });

  codeArea.addEventListener('keydown', e => {
    const z   = e.key.toLowerCase() === 'z';
    const y   = e.key.toLowerCase() === 'y';
    const mod = e.metaKey || e.ctrlKey;

    /* undo */
    if (mod && z && !e.shiftKey) {
      if (undo.length > 1) {
        e.preventDefault();
        redo.push(undo.pop());
        codeArea.value = undo[undo.length - 1];
      }
    }
    /* redo */
    if ((mod && z && e.shiftKey) || (mod && y && !e.shiftKey)) {
      if (redo.length) {
        e.preventDefault();
        const next = redo.pop();
        undo.push(next);
        codeArea.value = next;
      }
    }
  });
})();


