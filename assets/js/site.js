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
    window.fabricCanvas.renderAll();
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


/* ----------------------------------------------------------------------
   3.  Whiteboard modal with Fabric.js (landing page only)
---------------------------------------------------------------------- */
(function () {
  const sketchButton = $('#sketchBtn');
  if (!sketchButton) return;

  const modal        = $('#sketchModal');
  const modalContent = $('#modalContent');
  const closeButton  = $('.close');
  const fullscreenBtn= $('#fullscreenBtn');

  let fabricCanvas = null;
  let isFS = false;
  
  // Make fabricCanvas globally accessible for updateCanvasBackground
  window.fabricCanvas = null;

  // Open/close helpers
  function openModal() {
    modal.style.display = 'block';
    initCanvas();
    
    // Add keyboard shortcuts when modal is open
    window.addEventListener('keydown', handleKeyboardShortcuts);
  }

  function closeModal() {
    modal.style.display = 'none';
    
    // Remove keyboard shortcuts when modal is closed
    window.removeEventListener('keydown', handleKeyboardShortcuts);
  }
  
  // Keyboard shortcuts handler
  function handleKeyboardShortcuts(e) {
    // Close modal: Escape
    if (e.key === 'Escape') {
      closeModal();
    }
    
    // Undo: Cmd/Ctrl + Z
    if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (fabricCanvas) {
        const objects = fabricCanvas.getObjects();
        if (objects.length > 0) {
          const lastObject = objects[objects.length - 1];
          fabricCanvas.remove(lastObject);
          fabricCanvas.renderAll();
        }
      }
    }
  }

  sketchButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);

  // Fullscreen toggle
  fullscreenBtn.addEventListener('click', () => {
    isFS = !isFS;
    modalContent.classList.toggle('fullscreen', isFS);
    fullscreenBtn.textContent = isFS ? '⛌' : '⛶';
    
    // Resize canvas after fullscreen toggle
    if (fabricCanvas) {
      setTimeout(() => {
        const container = modalContent.querySelector('.canvas-viewport');
        if (container) {
          const rect = container.getBoundingClientRect();
          const newWidth = Math.floor(rect.width - 4);  // Subtract border
          const newHeight = Math.floor(rect.height - 4);
          
          fabricCanvas.setDimensions({
            width: newWidth,
            height: newHeight
          });
          fabricCanvas.renderAll();
          
          console.log('Resized canvas for fullscreen:', newWidth, 'x', newHeight);
        }
      }, 300); // Wait for CSS transition
    }
  });

  // Canvas initialization
  function initCanvas() {
    if (fabricCanvas) return;

    // Get the existing canvas element
    const canvasEl = document.getElementById('sketchpad');
    const canvasContainer = document.querySelector('.canvas-viewport');
    
    if (!canvasEl || !canvasContainer) {
      console.error('Canvas elements not found!');
      return;
    }
    
    // Ensure canvas has proper touch handling styles
    canvasEl.style.touchAction = 'none';
    canvasEl.style.webkitTouchCallout = 'none';
    canvasEl.style.webkitUserSelect = 'none';
    canvasEl.style.userSelect = 'none';
    
    // Wait for modal to be fully visible, then size canvas to container
    setTimeout(() => {
      // Get the actual size of the container
      const rect = canvasContainer.getBoundingClientRect();
      const canvasWidth = Math.floor(rect.width - 4);  // Subtract border width
      const canvasHeight = Math.floor(rect.height - 4);
      
      // Set canvas dimensions
      canvasEl.width = canvasWidth;
      canvasEl.height = canvasHeight;
      
      console.log('Canvas container size:', rect.width, 'x', rect.height);
      console.log('Setting canvas size:', canvasWidth, 'x', canvasHeight);
      
      // Initialize Fabric canvas
      fabricCanvas = new fabric.Canvas('sketchpad', {
        // Enable touch events for Apple Pencil support
        allowTouchScrolling: false,
        enablePointerEvents: true,
        enableRetinaScaling: true,
        renderOnAddRemove: true,
        skipTargetFind: true,
        // Ensure drawing mode works with touch
        perPixelTargetFind: false,
        targetFindTolerance: 5,
        // Force Fabric to use pointer events on iOS
        hasControls: false,
        hasBorders: false
      });
      
      // Set the internal canvas dimensions to match
      fabricCanvas.setWidth(canvasWidth);
      fabricCanvas.setHeight(canvasHeight);
      
      // Set background
      const isDark = document.documentElement.classList.contains('theme-dark');
      fabricCanvas.backgroundColor = isDark ? '#222' : '#ffffff';
      
      // Enable drawing
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
      
      // Configure brush
      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.width = 5;
      fabricCanvas.freeDrawingBrush.color = '#000000';
      fabricCanvas.freeDrawingBrush.strokeLineCap = 'round';
      fabricCanvas.freeDrawingBrush.strokeLineJoin = 'round';
      
      // Ensure canvas handles touch properly without custom handlers
      const upperCanvas = fabricCanvas.upperCanvasEl;
      if (upperCanvas) {
        upperCanvas.style.touchAction = 'none';
        upperCanvas.style.webkitTouchCallout = 'none';
        upperCanvas.style.webkitUserSelect = 'none';
        upperCanvas.style.userSelect = 'none';
      }
      
      // Enable pressure sensitivity for Apple Pencil (if supported)
      const originalOnMouseMove = fabricCanvas.freeDrawingBrush.onMouseMove;
      fabricCanvas.freeDrawingBrush.onMouseMove = function(pointer, options) {
        // Check for pressure data from pointer events
        if (options && options.e) {
          const evt = options.e;
          if (evt.pressure !== undefined && evt.pressure > 0 && evt.pointerType === 'pen') {
            // Adjust brush width based on pressure (0.1 to 1.0)
            const baseBrushWidth = parseInt(document.querySelector('#strokeSizeSlider').value);
            this.width = Math.max(1, baseBrushWidth * (0.3 + evt.pressure * 0.7));
          }
        }
        return originalOnMouseMove.call(this, pointer, options);
      };
      
      // Make it globally accessible
      window.fabricCanvas = fabricCanvas;
      
      fabricCanvas.renderAll();
      
      // Path handler - ensure paths are preserved
      fabricCanvas.on('path:created', function(e) {
        if (e.path) {
          e.path.set({
            selectable: false,
            evented: false,
            perPixelTargetFind: false
          });
          fabricCanvas.renderAll();
          console.log('Path created, total objects:', fabricCanvas.getObjects().length);
        }
      });
      
      // Set up control event listeners
      setupControlListeners();
      
      console.log('Whiteboard initialized successfully');
      console.log('Canvas actual size:', fabricCanvas.width, 'x', fabricCanvas.height);
      
      // Log input device support
      console.log('Touch support:', 'ontouchstart' in window);
      console.log('Pointer events support:', 'onpointerdown' in window);
      console.log('Apple device:', /iPad|iPhone|iPod/.test(navigator.userAgent));
      
      // Add a listener to detect what type of input is being used
      if (fabricCanvas.upperCanvasEl) {
        fabricCanvas.upperCanvasEl.addEventListener('pointerdown', function(e) {
          console.log('Input detected - Type:', e.pointerType, 'Pressure:', e.pressure);
        }, { once: true });
      }
    }, 100);
  }
  
  // Separate function to set up control listeners
  function setupControlListeners() {
    const strokeSlider = document.querySelector('#strokeSizeSlider');
    if (strokeSlider) {
      strokeSlider.addEventListener('input', () => {
        if (fabricCanvas) {
          fabricCanvas.freeDrawingBrush.width = parseInt(strokeSlider.value);
        }
      });
    }

    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
      btn.addEventListener('click', ev => {
        const color = ev.currentTarget.dataset.color;
        if (fabricCanvas) {
          fabricCanvas.freeDrawingBrush.color = color;
        }
        // Update active state
        colorButtons.forEach(b => b.classList.remove('active'));
        ev.currentTarget.classList.add('active');
        
        // Reset eraser button if it was active
        const eraserBtn = document.querySelector('.eraser-btn');
        if (eraserBtn) {
          eraserBtn.classList.remove('active');
          eraserBtn.style.background = 'var(--nav-bg)';
        }
      });
    });

    const clearBtn = document.querySelector('#clearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (fabricCanvas) {
          fabricCanvas.clear();
          fabricCanvas.backgroundColor = document.documentElement.classList.contains('theme-dark') ? '#222' : '#ffffff';
          fabricCanvas.renderAll();
        }
      });
    }
    
    // Undo button functionality
    const undoBtn = document.querySelector('#undoBtn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (fabricCanvas) {
          const objects = fabricCanvas.getObjects();
          if (objects.length > 0) {
            // Remove the last object (most recent path)
            const lastObject = objects[objects.length - 1];
            fabricCanvas.remove(lastObject);
            fabricCanvas.renderAll();
            console.log('Undo: removed last stroke');
          }
        }
      });
    }
    
    // Eraser button functionality
    const eraserBtn = document.querySelector('.eraser-btn');
    if (eraserBtn) {
      eraserBtn.addEventListener('click', () => {
        if (fabricCanvas) {
          // Toggle eraser mode by setting brush color to background color
          const isErasing = fabricCanvas.freeDrawingBrush.color === fabricCanvas.backgroundColor;
          if (isErasing) {
            // Switch back to last selected color
            const activeColorBtn = document.querySelector('.color-btn.active');
            const color = activeColorBtn ? activeColorBtn.dataset.color : '#000000';
            fabricCanvas.freeDrawingBrush.color = color;
            eraserBtn.classList.remove('active');
            eraserBtn.style.background = 'var(--nav-bg)';
          } else {
            // Switch to eraser (background color)
            fabricCanvas.freeDrawingBrush.color = fabricCanvas.backgroundColor;
            eraserBtn.classList.add('active');
            eraserBtn.style.background = 'var(--link)';
          }
        }
      });
    }
  }

  // Basic controls - these are not needed anymore as they're handled in setupControlListeners
})();

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