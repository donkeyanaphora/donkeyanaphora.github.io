/* ======================================================================
   site.js — safe on every page (2025-05-15)
   • Guards each feature block so it only runs when its anchor element is
     present, eliminating null-reference crashes on article pages.
====================================================================== */

/* ----------------------------------------------------------------------
   Helper utilities
---------------------------------------------------------------------- */
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* no-op: gets redefined by whiteboard if canvas exists */
function updateCanvasBackground () {}

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
   3.  Whiteboard modal (landing page only)
---------------------------------------------------------------------- */
(function () {
  const sketchButton = $('#sketchBtn');
  if (!sketchButton) return;                // skip on article pages

  const modal        = $('#sketchModal');
  const modalContent = $('#modalContent');
  const closeButton  = $('.close');
  const fullscreenBtn= $('#fullscreenBtn');
  const canvas       = $('#sketchpad');
  const strokeSlider = $('#strokeSizeSlider');

  /* 3-state */
  let ctx, isDrawing=false, isEraser=false, currentColor='#000000';
  let lastFocus=null, isFS=false;

  /* ── slider live preview ────────────────────────────────────────── */
  if (strokeSlider) strokeSlider.addEventListener('input', () => { if (ctx) resetStrokeStyle(); });

  /* ── open / close helpers ───────────────────────────────────────── */
  function openModal () {
    modal.style.display='block';
    modal.setAttribute('aria-hidden','false');
    lastFocus = document.activeElement;
    modalContent.focus();
    initCanvas();
  }
  function closeModal(){
    modal.style.display='none';
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    lastFocus?.focus();
  }

  sketchButton.addEventListener('click', openModal);
  closeButton  .addEventListener('click', closeModal);
  window.addEventListener('keydown', e => { if(e.key==='Escape'&&modal.style.display==='block') closeModal(); });

  /* backdrop click */
  let backPress=false;
  modal.addEventListener('pointerdown',e=>{backPress=(e.target===modal);});
  modal.addEventListener('pointerup',e=>{if(backPress&&e.target===modal)closeModal();backPress=false;});

  /* fullscreen toggle */
  fullscreenBtn.addEventListener('click',()=>{
    isFS=!isFS;
    modalContent.classList.toggle('fullscreen',isFS);
    fullscreenBtn.textContent=isFS?'⛌':'⛶';
    document.body.style.overflow=isFS?'hidden':'';
    requestAnimationFrame(initCanvas);
  });

  /* ── canvas helpers ─────────────────────────────────────────────── */
  function resetStrokeStyle(){
    const size = strokeSlider ? +strokeSlider.value : (isEraser?20:2);
    ctx.lineWidth=size;
    ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.strokeStyle=isEraser?'#ffffff':currentColor;
  }

  updateCanvasBackground = function (){
    if(!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation='destination-over';
    ctx.fillStyle='#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
  };

  /* init / resize */
  function initCanvas(){
    ctx = canvas.getContext('2d');
    const r=canvas.parentElement.getBoundingClientRect();
    const hCtrl=$('.sketch-controls').offsetHeight;
    const W=Math.round(r.width), H=Math.max(100,Math.round(r.height-hCtrl-20));
    if(canvas.width!==W||canvas.height!==H){
      const copy=document.createElement('canvas');
      copy.width=canvas.width; copy.height=canvas.height;
      copy.getContext('2d').drawImage(canvas,0,0);
      canvas.width=W; canvas.height=H;
      ctx.drawImage(copy,0,0);
    }
    updateCanvasBackground(); resetStrokeStyle();
    attachCanvasListeners(); attachUiListeners();
  }

  function pos(e){const r=canvas.getBoundingClientRect(),c=e.touches?e.touches[0]:e;return{x:c.clientX-r.left,y:c.clientY-r.top};}
  function begin(e){e.preventDefault();isDrawing=true;const {x,y}=pos(e);ctx.beginPath();ctx.moveTo(x,y);}
  function draw(e){ if(!isDrawing)return; e.preventDefault();const {x,y}=pos(e);ctx.lineTo(x,y);ctx.stroke();}
  function end(){isDrawing=false;}

  function attachCanvasListeners(){
    if(canvas.dataset.wired) return; canvas.dataset.wired='yes';
    canvas.addEventListener('mousedown',begin);
    canvas.addEventListener('mousemove',draw);
    canvas.addEventListener('mouseup',end);
    canvas.addEventListener('mouseout',end);

    canvas.addEventListener('touchstart',begin,{passive:false});
    canvas.addEventListener('touchmove',draw,{passive:false});
    canvas.addEventListener('touchend',end);
  }

  function attachUiListeners(){
    $$('.color-btn').forEach(btn=>{
      if(btn.dataset.wired) return;
      btn.dataset.wired='yes';
      btn.addEventListener('click',ev=>{
        $$('.color-btn.active').forEach(b=>b.classList.remove('active'));
        ev.currentTarget.classList.add('active');
        const c=ev.currentTarget.dataset.color;
        isEraser=(c==='eraser'); if(!isEraser) currentColor=c;
        resetStrokeStyle();
      });
    });

    const clearBtn=$('#clearBtn');
    if(!clearBtn.dataset.wired){
      clearBtn.dataset.wired='yes';
      clearBtn.addEventListener('click',()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        updateCanvasBackground();
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
