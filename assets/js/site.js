/* ======================================================================
   site.js — safe on every page (2025-05-15)
   • Guards each feature block so it only runs when its anchor element is
     present, eliminating null-reference crashes on article pages.
====================================================================== */

/* ----------------------------------------------------------------------
   Helper utilities
---------------------------------------------------------------------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));  // Convert to Array for forEach compatibility

/* no-op: gets redefined by whiteboard if canvas exists */
function updateCanvasBackground () {
  if (window.fabricCanvas) {
    const isDark = document.documentElement.classList.contains('theme-dark');
    window.fabricCanvas.backgroundColor = isDark ? '#222' : '#ffffff';
    window.fabricCanvas.requestRenderAll();
  }
}

/* ----------------------------------------------------------------------
   1.  Quote rotator (landing page only)
---------------------------------------------------------------------- */
(function () {
  const quip = $('#quip');
  if (!quip) return;                        // page has no quote

  const quotes = ['Man is something that shall be overcome'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % quotes.length;
    quip.textContent = `"${quotes[i]}"`;
  }, 10_000);
})();

/* ----------------------------------------------------------------------
   2.  Dark-/light-mode toggle (works everywhere if button present)
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
    updateCanvasBackground();               // noop if no canvas yet
    
    // Reset debounce after transition completes
    setTimeout(() => { isToggling = false; }, 300);
  });
})();


/* ----------------------------------------------------------------------
   3.  Whiteboard modal with Fabric.js (landing page only)
   Patched 2025‑07‑04
   •  Removes unused `isDesktop` variable warning
   •  Keeps every Apple Pencil sample (decimate = 0 on iPad)
   •  Minor cleanup + lint fixes
---------------------------------------------------------------------- */
(function () {
  /* -------------------- Helpers -------------------- */
  const $ = sel => document.querySelector(sel);
  const isIPad = /iPad/.test(navigator.userAgent) ||
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
                     .test(navigator.userAgent);

  /* -------------------- Elements ------------------- */
  const sketchButton   = $('#sketchBtn');
  if (!sketchButton) return;          // whiteboard only on landing page

  const modal          = $('#sketchModal');
  const modalContent   = $('#modalContent');
  const closeButton    = $('.close');
  const fullscreenBtn  = $('#fullscreenBtn');

  let fabricCanvas = null;
  let isFS = false;                   // fullscreen toggle state

  // Expose globally for other modules (e.g. updateCanvasBackground)
  window.fabricCanvas = null;

  /* ---------------- Modal open / close -------------- */
  const openModal = () => {
    modal.style.display = 'block';
    initCanvas();
    window.addEventListener('keydown', handleShortcuts);
  };

  const closeModal = () => {
    modal.style.display = 'none';
    window.removeEventListener('keydown', handleShortcuts);
    window.cachedBrushWidth = 5;      // reset
  };

  sketchButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);

  /* --------------- Keyboard shortcuts --------------- */
  function handleShortcuts (e) {
    if (e.key === 'Escape') closeModal();

    // Undo — Cmd/Ctrl + Z
    if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey && fabricCanvas) {
      e.preventDefault();
      const objs = fabricCanvas.getObjects();
      if (objs.length) {
        fabricCanvas.remove(objs[objs.length - 1]);
        fabricCanvas.requestRenderAll();
      }
    }
  }

  /* ---------------- Canvas resize ------------------ */
  let orientationTimer;
  const debounceResize = () => {
    clearTimeout(orientationTimer);
    orientationTimer = setTimeout(resizeCanvas, 300);
  };

  window.addEventListener('orientationchange', () => modal.style.display === 'block' && debounceResize());
  window.addEventListener('resize', () => modal.style.display === 'block' && debounceResize());

  fullscreenBtn.addEventListener('click', () => {
    isFS = !isFS;
    modalContent.classList.toggle('fullscreen', isFS);
    fullscreenBtn.textContent = isFS ? '⛌' : '⛶';
    resizeCanvas();
  });

  function resizeCanvas () {
    if (!fabricCanvas) return;
    const container = modalContent.querySelector('.canvas-viewport');
    if (!container) return;

    // wait until container finishes animation (e.g. fullscreen)
    setTimeout(() => {
      const { width, height } = container.getBoundingClientRect();
      const w = Math.floor(width  - 4);
      const h = Math.floor(height - 4);
      const json = fabricCanvas.toJSON();
      fabricCanvas.setDimensions({ width: w, height: h });
      fabricCanvas.loadFromJSON(json, () => fabricCanvas.requestRenderAll());
    }, 100);
  }

  /* ---------------- Canvas init -------------------- */
  function initCanvas () {
    if (fabricCanvas) return;         // already initialised

    const canvasEl       = document.getElementById('sketchpad');
    const canvasViewport = document.querySelector('.canvas-viewport');
    if (!canvasEl || !canvasViewport) return;

    // Touch‑handling CSS
    ['touchAction','webkitTouchCallout','webkitUserSelect','userSelect']
      .forEach(p => { canvasEl.style[p] = 'none'; });

    // Size canvas to viewport *after* modal render
    requestAnimationFrame(() => {
      const { width, height } = canvasViewport.getBoundingClientRect();
      canvasEl.width  = Math.floor(width  - 4);
      canvasEl.height = Math.floor(height - 4);

      /* -------- Fabric.js setup -------- */
      fabricCanvas = new fabric.Canvas('sketchpad', {
        allowTouchScrolling: false,
        enablePointerEvents: true,
        enableRetinaScaling: window.devicePixelRatio > 1,
        renderOnAddRemove:   true,
        skipTargetFind:      true,
        perPixelTargetFind:  false,
        targetFindTolerance: 5,
        hasControls:         false,
        hasBorders:          false,
        selection:           false,
        preserveObjectStacking: true,
        stopContextMenu:     true
      });

      // Retina up‑scaling for crisp lines
      const ratio = window.devicePixelRatio || 1;
      fabricCanvas.setWidth(canvasEl.width * ratio);
      fabricCanvas.setHeight(canvasEl.height * ratio);
      fabricCanvas.getContext().scale(ratio, ratio);

      // Theme‑aware background
      fabricCanvas.backgroundColor =
        document.documentElement.classList.contains('theme-dark') ? '#222' : '#fff';

      // Drawing mode & brush
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = '#000';
      fabricCanvas.freeDrawingBrush.width = 5;
      fabricCanvas.freeDrawingBrush.strokeLineCap   = 'round';
      fabricCanvas.freeDrawingBrush.strokeLineJoin  = 'round';
      // **Keep every sample on iPad for Apple Pencil**
      fabricCanvas.freeDrawingBrush.decimate = isIPad ? 0 : (isMobile ? 3 : 2);

      // Ensure upper canvas also blocks gestures
      const upper = fabricCanvas.upperCanvasEl;
      if (upper) {
        ['touchAction','webkitTouchCallout','webkitUserSelect','userSelect']
          .forEach(p => { upper.style[p] = 'none'; });
        upper.style.willChange = 'transform';
      }

      /* ----- High‑frequency input patch (coalesced events) ----- */
      const orig = fabricCanvas._onMouseMove.bind(fabricCanvas);
      const handle = ev => {
        const events = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [ev];
        events.forEach(e => orig(e));
      };
      upper.addEventListener('pointerrawupdate', handle, { passive: false });
      upper.addEventListener('pointermove',      handle, { passive: false });

      // Path post‑processing (cache & immutability)
      fabricCanvas.on('path:created', ({ path }) => {
        if (!path) return;
        path.set({ selectable: false, evented: false, objectCaching: true, strokeUniform: true });
      });

      // expose globally
      window.fabricCanvas = fabricCanvas;
      window.cachedBrushWidth = 5;

      fabricCanvas.requestRenderAll();
      setupControls();
    });
  }

  /* ---------------- UI controls ------------------- */
  function setupControls () {
    const strokeSlider = $('#strokeSizeSlider');
    strokeSlider?.addEventListener('input', () => {
      const w = parseInt(strokeSlider.value, 10);
      fabricCanvas.freeDrawingBrush.width = w;
      window.cachedBrushWidth = w;
    });

    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => btn.addEventListener('click', e => {
      colorBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      if (fabricCanvas) fabricCanvas.freeDrawingBrush.color = e.currentTarget.dataset.color;
      // reset eraser UI
      document.querySelector('.eraser-btn')?.classList.remove('active');
    }));

    $('#clearBtn')?.addEventListener('click', () => {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor =
        document.documentElement.classList.contains('theme-dark') ? '#222' : '#fff';
      fabricCanvas.requestRenderAll();
    });

    $('#undoBtn')?.addEventListener('click', () => {
      const objs = fabricCanvas.getObjects();
      if (objs.length) {
        fabricCanvas.remove(objs[objs.length - 1]);
        fabricCanvas.requestRenderAll();
      }
    });

    const eraserBtn = document.querySelector('.eraser-btn');
    eraserBtn?.addEventListener('click', () => {
      const active = eraserBtn.classList.toggle('active');
      fabricCanvas.freeDrawingBrush.color = active ? fabricCanvas.backgroundColor :
        (document.querySelector('.color-btn.active')?.dataset.color || '#000');
    });
  }
})();


/* ------------------------------Whiteboard END----------------------------------------*/
/* ----------------------------------------------------------------------
   4.  Code-pad modal (landing page only)
---------------------------------------------------------------------- */
(function () {
  const codeBtn = $('#codeBtn');
  if (!codeBtn) return;                     // skip on article pages

  const codeModal  = $('#codeModal');
  const codeCont   = $('#codeContent');
  const codeClose  = $('.code-close');
  const codeFSBtn  = $('#codeFullscreen');
  const codeArea   = $('#codeArea');
  let codeFS = false, lastFocus=null;
  const KEY='pseudoCode';

  function openCode(){
    codeModal.style.display='block';
    codeModal.setAttribute('aria-hidden','false');
    lastFocus=document.activeElement;
    codeCont.focus();
    try{codeArea.value=localStorage.getItem(KEY)||'Howdy! ';}catch{}
  }
  function closeCode(){
    codeModal.style.display='none';
    codeModal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    lastFocus?.focus();
    try{localStorage.setItem(KEY,codeArea.value);}catch{}
  }

  codeBtn  .addEventListener('click',openCode);
  codeClose.addEventListener('click',closeCode);
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&codeModal.style.display==='block')closeCode();});

  /* backdrop */
  let cdBack=false;
  codeModal.addEventListener('pointerdown',e=>{cdBack=(e.target===codeModal);});
  codeModal.addEventListener('pointerup',  e=>{if(cdBack&&e.target===codeModal)closeCode();cdBack=false;});

  /* fullscreen */
  codeFSBtn.addEventListener('click',()=>{
    codeFS=!codeFS;
    codeCont.classList.toggle('fullscreen',codeFS);
    codeFSBtn.textContent=codeFS?'⛌':'⛶';
    document.body.style.overflow=codeFS?'hidden':'';
    setTimeout(()=>codeArea.focus(),50);
  });

  /* TAB indent / unindent */
  codeArea.addEventListener('keydown',e=>{
    if(e.key==='Tab'){e.preventDefault();
      const tab='  ';
      const [s,t]=[e.target.selectionStart,e.target.selectionEnd];
      if(e.shiftKey){
        const before=e.target.value.slice(s-tab.length,s);
        if(before===tab) e.target.setRangeText('',s-tab.length,s,'end');
      }else{e.target.setRangeText(tab,s,t,'end');}
    }
  });

  /* undo / redo chain */
  (function(){
    const undo=[], redo=[], MAX=100;
    undo.push(codeArea.value);
    codeArea.addEventListener('input',()=>{
      if(undo.length>=MAX)undo.shift();
      undo.push(codeArea.value); redo.length=0;
    });
    codeArea.addEventListener('keydown',e=>{
      const z=e.key.toLowerCase()==='z', y=e.key.toLowerCase()==='y', mod=e.metaKey||e.ctrlKey;
      if(mod&&z&&!e.shiftKey){if(undo.length>1){e.preventDefault();redo.push(undo.pop());codeArea.value=undo.at(-1);}}
      if((mod&&z&&e.shiftKey)||(mod&&y&&!e.shiftKey)){if(redo.length){e.preventDefault();const next=redo.pop();undo.push(next);codeArea.value=next;}}
    });
  })();
})();

const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () =>
  document.body.classList.toggle('menu-open')
);