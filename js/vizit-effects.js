/* ════════════════════════════════════════════════════════════
   VIZIT FX — interactive proof moments.
   Self-mounting: give a container one of
     .fx[data-fx="blink"] | "carousel" | "h2h" | "bleed"
   and set data-root="../" when the page lives in a subfolder.
   Widgets mount when scrolled into view.
   ════════════════════════════════════════════════════════════ */
(() => {
'use strict';
const ce = t => document.createElement(t);
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const lerp = (a,b,t) => a + (b-a)*t;
const NS = 'http://www.w3.org/2000/svg';

const PRODUCTS = [
  { name:'Vizzy V-Shaped Chips',    img:'assets/products/vizzy.png',        score:91, price:'$4.29',  stars:'★★★★★', n:'2,981' },
  { name:'CeraVe SPF 50 Fluid',     img:'assets/products/cerave.png',       score:87, price:'$13.99', stars:'★★★★★', n:'4,812' },
  { name:'hismile PAP+ Strips',     img:'assets/products/hismile.png',      score:82, price:'$29.00', stars:'★★★★☆', n:'1,204' },
  { name:'VIZ·BONE Dog Biscuits',   img:'assets/products/vizbone.png',      score:69, price:'$8.49',  stars:'★★★★☆', n:'903' },
  { name:'V-ZERO Orange 20oz',      img:'assets/products/vzero-orange.png', score:63, price:'$2.19',  stars:'★★★☆☆', n:'421' },
  { name:'Infallible Foundation',   img:'assets/products/foundation.png',   score:55, price:'$11.97', stars:'★★★☆☆', n:'688' },
];
const scoreCls = s => s>=80 ? 'fx-hi' : s>=66 ? 'fx-md' : 'fx-lo';
const tileHTML = (p, root) =>
  `<div class="fx-tile"><span class="fx-score ${scoreCls(p.score)}">${p.score}</span>` +
  `<div class="ph"><img src="${root}${p.img}" alt="${p.name}"></div>` +
  `<div class="nm">${p.name}</div><div class="pr"><b>${p.price}</b><span>${p.stars}</span></div></div>`;

/* ══════════ 1. BLINK TEST ══════════ */
function mountBlink(el){
  const root = el.dataset.root || '';
  el.innerHTML =
    `<div class="fx-frame">
      <div class="fx-chrome"><span class="dot"></span><span>Vizit · the 2-second blink test</span><span style="margin-left:auto">search grid · live scoring</span></div>
      <div class="fx-blink-stage">
        <div class="fx-blink-shelf"></div>
        <svg class="fx-blink-path"></svg>
        <div class="fx-blink-veil"><div class="count"></div></div>
      </div>
      <div class="fx-controls">
        <button class="fx-btn" type="button">▶ Run the blink test</button>
        <span class="fx-note">screen blacks out · only what was seen returns</span>
        <span class="fx-blink-meter">survived first glance <b>—</b>/6</span>
      </div>
    </div>`;
  const shelf = el.querySelector('.fx-blink-shelf'),
        veil  = el.querySelector('.fx-blink-veil'),
        count = el.querySelector('.count'),
        path  = el.querySelector('.fx-blink-path'),
        meter = el.querySelector('.fx-blink-meter b'),
        btn   = el.querySelector('.fx-btn');
  let timers = [], cells = [];
  function build(){
    shelf.innerHTML=''; cells=[];
    PRODUCTS.forEach(p => {
      const w = ce('div'); w.innerHTML = tileHTML(p, root);
      const c = w.firstChild; shelf.appendChild(c); cells.push({el:c, p});
    });
  }
  const clearT = () => { timers.forEach(clearTimeout); timers=[]; };
  function run(){
    clearT(); path.innerHTML='';
    cells.forEach(c => c.el.classList.remove('lost','win'));
    veil.style.opacity='0';
    count.textContent='2';
    timers.push(setTimeout(()=>{ count.textContent='1'; }, 700));
    timers.push(setTimeout(()=>{ veil.style.opacity='1'; count.textContent=''; }, 1350));
    timers.push(setTimeout(()=>{
      const winners = cells.filter(c => c.p.score >= 80);
      cells.forEach(c => c.el.classList.add(c.p.score >= 80 ? 'win' : 'lost'));
      meter.textContent = winners.length;
      veil.style.opacity='0';
      const order = [...winners].sort((a,b)=>b.p.score-a.p.score);
      const host = shelf.getBoundingClientRect();
      let prev = null;
      order.forEach((c,k)=>{
        timers.push(setTimeout(()=>{
          const r = c.el.getBoundingClientRect();
          const x = r.left-host.left+r.width/2, y = r.top-host.top+r.height/2;
          if (prev){
            const ln = document.createElementNS(NS,'line');
            ln.setAttribute('x1',prev.x); ln.setAttribute('y1',prev.y);
            ln.setAttribute('x2',x); ln.setAttribute('y2',y);
            ln.setAttribute('stroke','#0174d9'); ln.setAttribute('stroke-width','2');
            ln.setAttribute('stroke-dasharray','5 5'); ln.setAttribute('opacity','.7');
            path.appendChild(ln);
          }
          const g = document.createElementNS(NS,'circle');
          g.setAttribute('cx',x); g.setAttribute('cy',y); g.setAttribute('r','13');
          g.setAttribute('fill','rgba(1,116,217,.12)'); g.setAttribute('stroke','#0174d9'); g.setAttribute('stroke-width','2');
          path.appendChild(g);
          const t = document.createElementNS(NS,'text');
          t.setAttribute('x',x); t.setAttribute('y',y+4); t.setAttribute('text-anchor','middle');
          t.setAttribute('fill','#00213d'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','700');
          t.textContent = k+1;
          path.appendChild(t);
          prev = {x,y};
        }, k*230));
      });
    }, 1900));
  }
  btn.onclick = run;
  build();
  timers.push(setTimeout(run, 600));
}

/* ══════════ 2. SELF-SORTING CAROUSEL ══════════ */
function mountCarousel(el){
  const root = el.dataset.root || '';
  el.innerHTML =
    `<div class="fx-frame">
      <div class="fx-chrome"><span class="dot"></span><span>Vizit · the self-sorting carousel</span><span style="margin-left:auto">PDP gallery · predicted order</span></div>
      <div class="fx-car-stage"><div class="fx-car-row"></div></div>
      <div class="fx-controls">
        <button class="fx-btn" type="button" data-a="opt">✦ Optimize order</button>
        <button class="fx-btn ghost" type="button" data-a="shuf">Shuffle</button>
        <span class="fx-note">order drives conversion · strongest first 3</span>
        <span class="fx-blink-meter">carousel effectiveness <b>—</b>%</span>
      </div>
    </div>`;
  const row = el.querySelector('.fx-car-row'), out = el.querySelector('.fx-blink-meter b');
  const set = PRODUCTS;
  let order = set.map((_,i)=>i);
  const W = [1,.85,.7,.4,.3,.2];
  const calc = () => { let s=0,w=0; order.forEach((idx,pos)=>{ s+=set[idx].score*W[pos]; w+=W[pos]; }); return Math.round(s/w); };
  function render(animate){
    const first = {};
    [...row.children].forEach(c => first[c.dataset.k] = c.getBoundingClientRect().left);
    row.innerHTML = '';
    order.forEach((idx,pos)=>{
      const p = set[idx];
      const slot = ce('div'); slot.className = 'slot' + (pos<3 ? ' first3' : ''); slot.dataset.k = idx;
      slot.innerHTML = `<div class="pos">#${pos+1}</div>` + tileHTML(p, root);
      row.appendChild(slot);
    });
    if (animate){
      [...row.children].forEach(c => {
        const last = c.getBoundingClientRect().left, f = first[c.dataset.k];
        if (f != null){
          const dx = f - last;
          c.style.transition = 'none'; c.style.transform = `translateX(${dx}px)`;
          requestAnimationFrame(()=>{ c.style.transition = 'transform .7s cubic-bezier(.2,.85,.25,1)'; c.style.transform = 'translateX(0)'; });
        }
      });
    }
  }
  function animateScore(){
    const target = calc(), from = +out.textContent || 60, t0 = performance.now();
    (function tick(){ const k = clamp((performance.now()-t0)/800, 0, 1);
      out.textContent = Math.round(lerp(from, target, k)); if (k<1) requestAnimationFrame(tick); })();
  }
  function optimize(){
    order = set.map((_,i)=>i).sort((a,b)=>set[b].score-set[a].score);
    render(true); animateScore();
    setTimeout(()=>[...row.children].forEach(c=>c.classList.add('lit')), 500);
  }
  function shuffle(){ order.sort(()=>Math.random()-.5); render(true); animateScore(); }
  el.querySelector('[data-a="opt"]').onclick = optimize;
  el.querySelector('[data-a="shuf"]').onclick = shuffle;
  order.sort(()=>Math.random()-.5);
  render(false); out.textContent = calc();
  setTimeout(optimize, 1200);
}

/* ══════════ 3. HEAD-TO-HEAD ══════════ */
function mountH2H(el){
  const root = el.dataset.root || '';
  el.innerHTML =
    `<div class="fx-frame">
      <div class="fx-chrome"><span class="dot"></span><span>Vizit · the head-to-head</span><span style="margin-left:auto">results for "snacks" · ranked by predicted conversion</span></div>
      <div class="fx-h2h-serp"><div class="fx-h2h-row"></div></div>
      <div class="fx-controls">
        <button class="fx-btn" type="button" data-a="apply">✦ Apply winning move</button>
        <button class="fx-btn ghost" type="button" data-a="reset">↺ Reset</button>
        <span class="fx-note" data-a="move"></span>
        <span class="fx-h2h-board">you <b data-a="you">—</b><span data-a="vs"></span></span>
      </div>
    </div>`;
  const row = el.querySelector('.fx-h2h-row'),
        youEl = el.querySelector('[data-a="you"]'), vsEl = el.querySelector('[data-a="vs"]'),
        moveEl = el.querySelector('[data-a="move"]');
  const BASE = 71, GAIN = 14;
  let state, applied, t;
  function init(){
    state = [
      { ...PRODUCTS[4], name:'V-ZERO Orange', score:BASE, you:true },
      { ...PRODUCTS[0], name:'Vizzy Chips', score:82 },
      { ...PRODUCTS[2], name:'hismile Strips', score:78 },
      { ...PRODUCTS[3], name:'VIZ·BONE', score:66 },
    ];
    applied = false; moveEl.textContent = '';
  }
  function render(animate){
    const first = {};
    if (animate) [...row.children].forEach(c => first[c.dataset.k] = c.getBoundingClientRect().left);
    const sorted = [...state].sort((a,b)=>b.score-a.score);
    row.innerHTML = sorted.map((p,i)=>
      `<div class="h2c${p.you?' you':''}${i===0?' win':''}" data-k="${p.name}">
        <div class="rank">#${i+1}</div>
        <div class="vz ${scoreCls(p.score)}">vizit ${p.score}</div>
        <div class="youtag">YOU</div><div class="ribbon">Top result</div>
        <div class="thumb"><img src="${root}${p.img}" alt=""></div>
        <div class="t">${p.name}</div>
        <div class="stars">${p.stars} <span>(${p.n})</span></div>
        <div class="price">${p.price}</div>
        <button class="cart" type="button">Add to cart</button>
      </div>`).join('');
    if (animate){
      [...row.children].forEach(c=>{
        const last = c.getBoundingClientRect().left, f = first[c.dataset.k];
        if (f != null){
          const dx = f - last;
          c.style.transition='none'; c.style.transform=`translateX(${dx}px)`;
          requestAnimationFrame(()=>{ c.style.transition='transform .7s cubic-bezier(.2,.85,.25,1)'; c.style.transform='translateX(0)'; });
        }
      });
    }
    const you = state.find(p=>p.you).score, top = Math.max(...state.filter(p=>!p.you).map(p=>p.score));
    youEl.textContent = you;
    vsEl.textContent = you>top ? ` · wins by ${you-top}` : ` · losing by ${top-you}`;
  }
  function apply(){
    if (applied) return; applied = true;
    state.find(p=>p.you).score = BASE + GAIN;
    moveEl.textContent = `move applied · distinctive hero + legible logo → +${GAIN} vizit`;
    render(true);
    const yc = [...row.children].find(c=>c.classList.contains('you'));
    if (yc){ yc.classList.add('flash'); setTimeout(()=>yc.classList.remove('flash'), 900); }
  }
  el.querySelector('[data-a="apply"]').onclick = apply;
  el.querySelector('[data-a="reset"]').onclick = () => { init(); render(true); };
  init(); render(false);
  t = setTimeout(apply, 1800);
}

/* ══════════ 4. BLEED MAP ══════════ */
function mountBleed(el){
  const root = el.dataset.root || '';
  const N = +(el.dataset.count || 96), SCALE = 12;
  el.innerHTML =
    `<div class="fx-frame fx-bleed">
      <div class="fx-chrome"><span class="dot"></span><span>Vizit · the bleed map</span><span style="margin-left:auto">your catalog · scored live</span></div>
      <div class="fx-bleed-banner">
        <div class="bcol"><div class="bk">bleeding right now</div><div class="bv" data-b="rate">$0<span>/hr</span></div></div>
        <div class="bcol grow"><div class="bk">annual revenue at risk · modeled across <span data-b="tot"></span> SKUs</div><div class="bv big" data-b="annual">$0</div></div>
        <div class="bcol"><div class="bk">SKUs bleeding</div><div class="bv" data-b="count">0</div></div>
        <div class="bcol"><div class="bk">recovered</div><div class="bv ok" data-b="rec">$0</div></div>
      </div>
      <div class="fx-bleed-wall"></div>
      <div class="fx-bleed-hint">click any red SKU to diagnose and recover it</div>
      <div class="fx-bleed-drill"><div class="dcard"></div></div>
      <div class="fx-toast"></div>
    </div>`;
  const wall = el.querySelector('.fx-bleed-wall'), drill = el.querySelector('.fx-bleed-drill'),
        dcard = el.querySelector('.dcard'), toastEl = el.querySelector('.fx-toast');
  const B = k => el.querySelector(`[data-b="${k}"]`);
  const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
  const DIAG = [
    { t:'Hero too small',        d:'Product fills under <b>40%</b> of the frame. Shoppers can\u2019t identify it at thumbnail scale.', fix:'Crop to a dominant hero pack',          gain:14 },
    { t:'Logo not legible',      d:'Brand mark <b>disappears</b> below ~120px. Near-zero recognition in the search grid.',             fix:'Enlarge and reposition the logo',       gain:11 },
    { t:'Low distinctiveness',   d:'Reads as a <b>generic category</b> product. Nothing signals it\u2019s yours.',                    fix:'Lead with distinctive brand assets',    gain:16 },
    { t:'Cluttered background',  d:'Competing elements <b>steal fixation</b> away from the pack.',                                     fix:'Clean to a high-contrast background',   gain:9 },
    { t:'Claim buried',          d:'Key benefit sits <b>below the fold</b> of the first carousel image.',                              fix:'Surface the claim in the hero',         gain:12 },
    { t:'Weak shelf contrast',   d:'Pack <b>blends into</b> the retailer\u2019s white background.',                                    fix:'Add separation and depth',              gain:10 },
  ];
  let tiles = [], annual = 0, recovered = 0, dispAnnual = 0, raf = null, toastT = null;
  function build(){
    wall.innerHTML=''; tiles=[]; annual=0; recovered=0;
    for (let i=0;i<N;i++){
      const p = PRODUCTS[i % PRODUCTS.length];
      const roll = Math.random();
      const score = roll<0.38 ? (40+Math.random()*15|0) : roll<0.66 ? (58+Math.random()*12|0) : (80+Math.random()*16|0);
      const rev  = 0.1 + Math.random()*2.9;
      const loss = rev*1e6 * Math.max(0,(88-score))/100 * 0.12;
      const diag = DIAG[(Math.random()*DIAG.length)|0];
      const state = score<55 ? 'bleed' : score<66 ? 'warn' : 'ok';
      const col = state==='bleed' ? 'var(--risk-red,#c8453a)' : state==='warn' ? '#8a6500' : 'var(--accent,#0174d9)';
      const t = ce('div'); t.className = 'fx-btile ' + state;
      t.style.animationDelay = (Math.random()*1.8).toFixed(2)+'s';
      t.innerHTML = `<img src="${root}${p.img}" alt="" loading="lazy"><div class="ov"></div><div class="s" style="color:${col}">${score}</div>`;
      const rec = { el:t, p, score, loss, diag, state };
      t.onclick = () => openDrill(rec);
      wall.appendChild(t); tiles.push(rec);
      if (state !== 'ok') annual += loss*SCALE;
    }
    B('tot').textContent = (N*SCALE).toLocaleString('en-US');
    recompute();
  }
  const recompute = () => { B('count').textContent = (tiles.filter(t=>t.state==='bleed').length*SCALE).toLocaleString('en-US'); };
  function openDrill(rec){
    const proj = Math.min(94, rec.score + rec.diag.gain);
    const gainRec = rec.loss*SCALE * (rec.diag.gain / Math.max(8, 88-rec.score));
    dcard.innerHTML =
      `<div class="pack"><img src="${root}${rec.p.img}" alt=""></div>
      <div class="info">
        <div class="nm">${rec.p.name}</div>
        <div class="diag">diagnosis · <b>${rec.diag.t}.</b> ${rec.diag.d}</div>
        <div class="arc"><span class="n from">${rec.score}</span><span class="ar">→</span><span class="n to">${proj}</span><span class="cap">vizit score after fix</span></div>
        <div class="rec">recover ≈ ${fmt(gainRec)} / yr · ${rec.diag.fix}</div>
        <div class="acts"><button class="fx-btn" type="button" data-d="apply">✓ Apply fix · recover ${fmt(gainRec)}</button><button class="fx-btn ghost" type="button" data-d="close">Close</button></div>
      </div>`;
    drill.classList.add('open');
    dcard.querySelector('[data-d="close"]').onclick = closeDrill;
    dcard.querySelector('[data-d="apply"]').onclick = () => { applyFix(rec, gainRec); closeDrill(); };
  }
  const closeDrill = () => drill.classList.remove('open');
  drill.addEventListener('click', e => { if (e.target === drill) closeDrill(); });
  function applyFix(rec, gainRec){
    if (rec.state === 'ok') return;
    annual = Math.max(0, annual - gainRec); recovered += gainRec;
    rec.state = 'ok'; rec.el.className = 'fx-btile ok fixed';
    const s = rec.el.querySelector('.s');
    s.textContent = Math.min(94, rec.score + rec.diag.gain);
    s.style.color = 'var(--accent,#0174d9)';
    recompute(); toast('recovered ' + fmt(gainRec) + ' / yr');
  }
  function toast(msg){
    toastEl.textContent = '✓ ' + msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(()=>toastEl.classList.remove('show'), 2200);
  }
  function loop(){
    dispAnnual += (annual - dispAnnual)*0.08;
    B('annual').textContent = fmt(dispAnnual);
    B('rate').innerHTML = fmt(dispAnnual/8760) + '<span>/hr</span>';
    B('rec').textContent = fmt(recovered);
    raf = requestAnimationFrame(loop);
  }
  build();
  raf = requestAnimationFrame(loop);
  setTimeout(()=>{ const r = tiles.find(t=>t.state==='bleed'); if (r) openDrill(r); }, 1600);
  setTimeout(closeDrill, 4600);
}

/* ══════════ 5. SEARCH → SHELF ══════════ */
function mountSearch(el){
  const root = el.dataset.root || '';
  const query = el.dataset.query || 'lotion';
  const custom = (el.dataset.images||'').split(',').map(s=>s.trim()).filter(Boolean);
  const set = custom.length ? custom.map(img=>({img, name:''})) : [PRODUCTS[1], PRODUCTS[5], PRODUCTS[3], PRODUCTS[4], PRODUCTS[2], PRODUCTS[0]];
  const tile = p => `<div class="fx-tile"><div class="ph"><img src="${root}${p.img}" alt="${p.name}"></div><span class="ln"></span><span class="ln s"></span></div>`;
  el.innerHTML =
    `<div class="fx-frame fx-search">
      <div class="fx-search-stage">
        <div class="fx-sbar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg><span class="q"><span class="txt"></span><span class="caret"></span></span><span class="go">Search</span></div>
        <div class="fx-sgrid">${set.map(tile).join('')}</div>
        <div class="fx-toast fx-atc"><i></i>Added to cart</div>
        <div class="fx-cur"><svg viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.3L16 20l-2.6 1.1-3.2-7.2L5 18z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg></div>
      </div>
    </div>`;
  const stage = el.querySelector('.fx-search-stage'), txt = el.querySelector('.txt'), go = el.querySelector('.go'),
        toast = el.querySelector('.fx-atc'), cur = el.querySelector('.fx-cur'), tiles = [...el.querySelectorAll('.fx-tile')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let timers=[], alive=false, raf=null, cx=0, cy=0;
  const clearT=()=>{timers.forEach(clearTimeout);timers=[]; if(raf) cancelAnimationFrame(raf); raf=null;};
  const wait=(ms,fn)=>timers.push(setTimeout(()=>{ if(alive) fn(); },ms));
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const place=(x,y)=>{ cx=x; cy=y; cur.style.transform='translate('+x+'px,'+y+'px)'; };
  const center=n=>{ const r=stage.getBoundingClientRect(), b=n.getBoundingClientRect(); return {x:b.left-r.left+b.width/2, y:b.top-r.top+b.height/2}; };
  function moveTo(tx,ty,done){
    if(raf) cancelAnimationFrame(raf);
    const sx=cx, sy=cy, dx=tx-sx, dy=ty-sy, dist=Math.hypot(dx,dy)||1;
    const dur=Math.max(420,Math.min(1100,260+dist*1.6)), bend=Math.min(90,dist*.22)*(Math.random()<.5?-1:1);
    const qx=sx+dx*.5-dy/dist*bend, qy=sy+dy*.5+dx/dist*bend, ox=tx+dx/dist*Math.min(7,dist*.04), oy=ty+dy/dist*Math.min(7,dist*.04);
    let t0=null; const ph=Math.random()*6.28, ease=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
    const step=ts=>{ if(!t0)t0=ts; const p=Math.min((ts-t0)/dur,1), ev=ease(p); let x,y;
      if(p<.88){ const q=ev/.97,u=1-q; x=u*u*sx+2*u*q*qx+q*q*ox; y=u*u*sy+2*u*q*qy+q*q*oy; } else { const k=(p-.88)/.12; x=ox+(tx-ox)*k; y=oy+(ty-oy)*k; }
      const tr=(1-p)*1.2; place(x+Math.sin(ts/38+ph)*tr, y+Math.cos(ts/47+ph)*tr);
      if(p<1) raf=requestAnimationFrame(step); else { raf=null; done&&done(); } };
    raf=requestAnimationFrame(step);
  }
  const toNode=(n,dx,dy,done)=>{ const c=center(n); moveTo(c.x+(dx||0)+rnd(-4,4), c.y+(dy||0)+rnd(-4,4), done); };
  const click=()=>{ cur.classList.add('click'); setTimeout(()=>cur.classList.remove('click'),140); };
  function reset(){ stage.classList.remove('docked'); go.classList.remove('press'); txt.textContent=''; toast.classList.remove('on'); cur.classList.remove('show'); tiles.forEach(t=>t.classList.remove('in','win','lost','press')); }
  function run(){
    reset();
    const r=stage.getBoundingClientRect(); place(r.width*.55, r.height*.6);
    wait(300,()=>{ cur.classList.add('show'); toNode(txt,36,0,()=>{ click();
      [...query].forEach((ch,i)=>wait(140+i*95,()=>{ txt.textContent+=ch; }));
      wait(140+query.length*95+220,()=>{ toNode(go,0,0,()=>{ click(); go.classList.add('press');
        wait(180,()=>{ go.classList.remove('press'); stage.classList.add('docked'); moveTo(cx-rnd(60,120), cy+rnd(100,160));
          tiles.forEach((tl,i)=>wait(600+i*90,()=>tl.classList.add('in')));
          wait(600+tiles.length*90+500,()=>{ tiles.forEach((tl,i)=>tl.classList.add(i===0?'win':'lost'));
            wait(420,()=>{ toNode(tiles[0],rnd(-8,8),rnd(-4,8),()=>{ wait(rnd(160,260),()=>{ click(); tiles[0].classList.add('press');
              wait(140,()=>{ tiles[0].classList.remove('press'); const tc=center(tiles[0]); toast.style.setProperty('--tx',tc.x+'px'); toast.style.setProperty('--ty',(tc.y-tiles[0].offsetHeight*.42)+'px'); toast.classList.add('on'); moveTo(cx+rnd(10,24), cy+rnd(10,20));
                wait(1500,()=>{ toast.classList.remove('on'); cur.classList.remove('show');
                  wait(500,()=>run());
                });
              });
            }); });
            });
          });
        });
      }); });
    }); });
  }
  if(reduced){ reset(); stage.classList.add('docked'); txt.textContent=query; tiles.forEach((tl,i)=>tl.classList.add('in',i===0?'win':'lost')); cur.style.display='none'; return; }
  const io=new IntersectionObserver(en=>{ if(en[0].isIntersecting&&!alive){ alive=true; run(); } else if(!en[0].isIntersecting&&alive){ alive=false; clearT(); } },{threshold:.3});
  io.observe(el);
}

const MOUNTS = { blink: mountBlink, carousel: mountCarousel, h2h: mountH2H, bleed: mountBleed, search: mountSearch };
function boot(){
  const els = document.querySelectorAll('.fx[data-fx]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting && !en.target.dataset.fxMounted){
        en.target.dataset.fxMounted = '1';
        const fn = MOUNTS[en.target.dataset.fx];
        if (fn) fn(en.target);
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '80px' });
  els.forEach(e => io.observe(e));
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
