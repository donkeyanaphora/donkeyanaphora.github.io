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


// Replace the whiteboard section (section 3) in your site.js with this optimized version:

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
  
  // Performance optimization variables
  let isApplePencil = false;
  let rafId = null;
  let pendingRender = false;
  
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
    
    // Cancel any pending renders
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    
    // Clean up cached values
    window.cachedBrushWidth = 5;
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
          fabricCanvas.requestRenderAll();
        }
      }
    }
  }

  sketchButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);

  // Helper function to resize canvas
  function resizeCanvas() {
    if (!fabricCanvas) return;
    
    const container = modalContent.querySelector('.canvas-viewport');
    if (container) {
      // Use timeout to ensure container has finished resizing
      setTimeout(() => {
        const rect = container.getBoundingClientRect();
        const newWidth = Math.floor(rect.width - 4);  // Subtract border
        const newHeight = Math.floor(rect.height - 4);
        
        // Store current canvas content
        const canvasData = fabricCanvas.toJSON();
        
        // Resize the canvas
        fabricCanvas.setDimensions({
          width: newWidth,
          height: newHeight
        });
        
        // Restore canvas content
        fabricCanvas.loadFromJSON(canvasData, () => {
          fabricCanvas.requestRenderAll();
        });
      }, 100);
    }
  }

  // Handle orientation changes
  let orientationTimer;
  window.addEventListener('orientationchange', () => {
    if (modal.style.display === 'block') {
      // Clear any existing timer
      clearTimeout(orientationTimer);
      
      // Wait for orientation change to complete
      orientationTimer = setTimeout(() => {
        resizeCanvas();
      }, 300);
    }
  });

  // Also handle resize events for better coverage
  window.addEventListener('resize', () => {
    if (modal.style.display === 'block') {
      clearTimeout(orientationTimer);
      orientationTimer = setTimeout(() => {
        resizeCanvas();
      }, 300);
    }
  });

  // Fullscreen toggle
  fullscreenBtn.addEventListener('click', () => {
    isFS = !isFS;
    modalContent.classList.toggle('fullscreen', isFS);
    fullscreenBtn.textContent = isFS ? '⛌' : '⛶';
    
    // Resize canvas after fullscreen toggle
    resizeCanvas();
  });

  // Optimized render function
  function scheduleRender() {
    if (!pendingRender && fabricCanvas) {
      pendingRender = true;
      rafId = requestAnimationFrame(() => {
        fabricCanvas.renderAll();
        pendingRender = false;
      });
    }
  }

  // Canvas initialization
  function initCanvas() {
    if (fabricCanvas) return;

    // Get the existing canvas element
    const canvasEl = document.getElementById('sketchpad');
    const canvasContainer = document.querySelector('.canvas-viewport');
    
    if (!canvasEl || !canvasContainer) {
      return; // Exit silently if elements not found
    }
    
    // Ensure canvas has proper touch handling styles
    canvasEl.style.touchAction = 'none';
    canvasEl.style.webkitTouchCallout = 'none';
    canvasEl.style.webkitUserSelect = 'none';
    canvasEl.style.userSelect = 'none';
    
    // Wait for modal to be fully visible, then size canvas to container
    requestAnimationFrame(() => {
      // Get the actual size of the container
      const rect = canvasContainer.getBoundingClientRect();
      const canvasWidth = Math.floor(rect.width - 4);  // Subtract border width
      const canvasHeight = Math.floor(rect.height - 4);
      
      // Set canvas dimensions
      canvasEl.width = canvasWidth;
      canvasEl.height = canvasHeight;
      
      // Initialize Fabric canvas
      const isIPad = /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      fabricCanvas = new fabric.Canvas('sketchpad', {
        // Enable touch events for Apple Pencil support
        allowTouchScrolling: false,
        enablePointerEvents: true,
        enableRetinaScaling: true,
        renderOnAddRemove: false, // We'll handle rendering manually
        skipTargetFind: true,
        // Performance optimizations
        perPixelTargetFind: false,
        targetFindTolerance: 5,
        hasControls: false,
        hasBorders: false,
        enableSelection: false,
        preserveObjectStacking: true,
        renderTop: false,
        // Disable features we don't need
        fireRightClick: false,
        stopContextMenu: true,
        uniformScaling: false,
        // iPad-specific optimizations
        stateful: false,
        // Use passive event listeners for better performance
        interactive: isIPad ? false : true
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
      
      // Use a simpler brush for better performance
      const brush = new fabric.PencilBrush(fabricCanvas);
      brush.width = 5;
      brush.color = '#000000';
      brush.strokeLineCap = 'round';
      brush.strokeLineJoin = 'round';
      
      // Disable decimation for maximum accuracy
      brush.decimate = 0;
      
      // Additional optimizations for smooth drawing
      brush.strokeMiterLimit = 10;
      brush.shadow = null; // No shadows for performance
      
      fabricCanvas.freeDrawingBrush = brush;
      
      // Ensure canvas handles touch properly
      const upperCanvas = fabricCanvas.upperCanvasEl;
      if (upperCanvas) {
        upperCanvas.style.touchAction = 'none';
        upperCanvas.style.webkitTouchCallout = 'none';
        upperCanvas.style.webkitUserSelect = 'none';
        upperCanvas.style.userSelect = 'none';
        // Force GPU acceleration
        upperCanvas.style.willChange = 'transform';
        
        // Use native pointer events for better performance
        upperCanvas.addEventListener('pointerdown', handlePointerDown, { passive: false });
        upperCanvas.addEventListener('pointermove', handlePointerMove, { passive: false });
        upperCanvas.addEventListener('pointerup', handlePointerUp, { passive: false });
        upperCanvas.addEventListener('pointercancel', handlePointerUp, { passive: false });
        upperCanvas.addEventListener('pointerleave', handlePointerUp, { passive: false });
      }
      
      // Make it globally accessible
      window.fabricCanvas = fabricCanvas;
      window.cachedBrushWidth = 5;
      
      fabricCanvas.renderAll();
      
      // Optimized path handler
      fabricCanvas.on('path:created', function(e) {
        if (e.path) {
          // Only set absolutely necessary properties
          e.path.set({
            selectable: false,
            evented: false
          });
          
          // Render immediately on iPad for responsiveness
          if (isIPad) {
            scheduleRender();
          }
        }
      });
      
      // Set up control event listeners
      setupControlListeners();
    });
  }
  
  // Simplified pointer event handlers for better performance
  let activePointerId = null;
  
  function handlePointerDown(e) {
    // Only track one pointer at a time
    if (activePointerId !== null && e.pointerId !== activePointerId) {
      e.preventDefault();
      return;
    }
    
    // Only allow pen or mouse
    if (e.pointerType === 'pen' || e.pointerType === 'mouse') {
      activePointerId = e.pointerId;
      isApplePencil = e.pointerType === 'pen';
      
      // Ensure drawing mode is on
      fabricCanvas.isDrawingMode = true;
      
      // Set initial pressure
      if (isApplePencil && e.pressure > 0) {
        const baseWidth = window.cachedBrushWidth || 5;
        fabricCanvas.freeDrawingBrush.width = Math.max(1, baseWidth * (0.3 + e.pressure * 0.7));
      }
    } else {
      // Reject touch input
      e.preventDefault();
      e.stopPropagation();
      fabricCanvas.isDrawingMode = false;
    }
  }
  
  function handlePointerMove(e) {
    // Only process if it's the active pointer
    if (e.pointerId !== activePointerId) return;
    
    // Update pressure for Apple Pencil
    if (isApplePencil && e.pressure > 0) {
      const baseWidth = window.cachedBrushWidth || 5;
      fabricCanvas.freeDrawingBrush.width = Math.max(1, baseWidth * (0.3 + e.pressure * 0.7));
    }
  }
  
  function handlePointerUp(e) {
    if (e.pointerId === activePointerId) {
      activePointerId = null;
      isApplePencil = false;
      
      // Reset brush width
      fabricCanvas.freeDrawingBrush.width = window.cachedBrushWidth || 5;
      
      // Keep drawing mode on
      fabricCanvas.isDrawingMode = true;
    }
  }
  
  // Separate function to set up control listeners
  function setupControlListeners() {
    const strokeSlider = document.querySelector('#strokeSizeSlider');
    if (strokeSlider) {
      strokeSlider.addEventListener('input', () => {
        if (fabricCanvas) {
          const newWidth = parseInt(strokeSlider.value);
          fabricCanvas.freeDrawingBrush.width = newWidth;
          // Update cached value
          window.cachedBrushWidth = newWidth;
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
          
          // Reset eraser if it was active
          const eraserBtn = document.querySelector('.eraser-btn');
          if (eraserBtn && eraserBtn.classList.contains('active')) {
            eraserBtn.classList.remove('active');
            eraserBtn.style.background = 'var(--nav-bg)';
            // Restore active color
            const activeColorBtn = document.querySelector('.color-btn.active');
            if (activeColorBtn) {
              fabricCanvas.freeDrawingBrush.color = activeColorBtn.dataset.color;
            }
          }
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
            const lastObject = objects[objects.length - 1];
            fabricCanvas.remove(lastObject);
            fabricCanvas.renderAll();
          }
        }
      });
    }
    
    // Eraser button functionality
    const eraserBtn = document.querySelector('.eraser-btn');
    if (eraserBtn) {
      eraserBtn.addEventListener('click', () => {
        if (fabricCanvas) {
          const isErasing = eraserBtn.classList.contains('active');
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