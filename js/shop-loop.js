/* <shop-loop> — retailer-agnostic PDP journey: search → PDP → carousel → add to cart → confetti → loop */
(function(){
  var ROOT = (document.currentScript && document.currentScript.getAttribute('data-root')) || '';
  var CSS = '\
.sl{position:relative;width:100%;aspect-ratio:1/1.05;background:#fff;color:#1a1a1a;font-family:var(--font-sans,system-ui,sans-serif);overflow:hidden;--sl-ink:#1a1a1a;--sl-mute:#6b7280;--sl-line:#e5e7eb;--sl-acc:#0174d9}\
.sl *{box-sizing:border-box}\
.sl .view{position:absolute;inset:0;padding:18px;display:flex;flex-direction:column;gap:12px;opacity:0;transform:translateX(24px);transition:opacity .45s ease,transform .45s ease;pointer-events:none}\
.sl .view.on{opacity:1;transform:none}\
.sl .view.out{opacity:0;transform:translateX(-24px)}\
.sl .top{display:flex;align-items:center;gap:10px}\
.sl .logo{width:22px;height:22px;border-radius:6px;background:var(--sl-ink)}\
.sl .search{flex:1;height:30px;border:1px solid var(--sl-line);border-radius:999px;display:flex;align-items:center;padding:0 12px;font-size:11.5px;color:var(--sl-ink);background:#f9fafb}\
.sl .search i{display:inline-block;width:8px;height:8px;border:1.5px solid var(--sl-mute);border-radius:50%;margin-right:8px}\
.sl .grid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px}\
.sl .card{border:1px solid var(--sl-line);border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:8px;min-height:0;transition:box-shadow .3s,border-color .3s,transform .3s}\
.sl .card.hot{border-color:var(--sl-acc);box-shadow:0 10px 24px -14px rgba(1,116,217,.5);transform:translateY(-2px)}\
.sl .img{flex:1;min-height:0;background:#f3f4f6;border-radius:6px;position:relative;overflow:hidden}\
.sl .img img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:10%}\
.sl .img.dull img{filter:grayscale(1) contrast(.75) brightness(1.1);opacity:.7}\
.sl .ln{height:6px;flex:none;border-radius:3px;background:#e5e7eb}\
.sl .ln.s{width:55%}\
.sl .pdp{display:grid;grid-template-columns:1.15fr 1fr;gap:14px;flex:1;min-height:0}\
.sl .gal{display:flex;flex-direction:column;gap:8px;min-height:0}\
.sl .main{flex:1;border:1px solid var(--sl-line);border-radius:10px;position:relative;overflow:hidden;background:#fff;min-height:0}\
.sl .main img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:8%;transition:opacity .35s}\
.sl .main .alt{position:absolute;inset:0;opacity:0;transition:opacity .35s;display:grid;place-items:center}\
.sl .main .alt span{width:62%;aspect-ratio:1;border-radius:14%;background:var(--p,#0174d9)}\
.sl .main .alt img{position:static;width:100%;height:100%;object-fit:cover;padding:0;opacity:1!important}\
.sl .th.pic img{padding:0;object-fit:cover}\
.sl .main:not([data-show="0"]) img.h{opacity:0}\
.sl .main[data-show="1"] .alt.a1,.sl .main[data-show="2"] .alt.a2,.sl .main[data-show="3"] .alt.a3{opacity:1}\
.sl .thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}\
.sl .th{aspect-ratio:1;border:1px solid var(--sl-line);border-radius:6px;position:relative;overflow:hidden;background:#fff;transition:border-color .25s,box-shadow .25s}\
.sl .th.on{border-color:var(--sl-acc);box-shadow:0 0 0 1px var(--sl-acc)}\
.sl .th img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:12%}\
.sl .th.ls::after{content:"";position:absolute;inset:24%;border-radius:14%;background:var(--p,#0174d9)}\
.sl .th.ls{background:linear-gradient(160deg,#eef6ff,#d6eaff)}\
.sl .alt.a1{background:linear-gradient(160deg,#eef6ff,#d6eaff)}\
.sl .alt.a2{background:linear-gradient(160deg,#f4f7fa,#e2e8f0)}\
.sl .info{display:flex;flex-direction:column;gap:10px}\
.sl .t{height:10px;border-radius:4px;background:#1f2937;width:80%}\
.sl .stars{display:flex;gap:2px}.sl .stars b{width:9px;height:9px;background:#f59e0b;clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}\
.sl .price{font-weight:600;font-size:18px;letter-spacing:-.02em;margin-top:2px}\
.sl .atc{margin-top:auto;height:34px;border-radius:999px;background:var(--sl-ink);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;transition:transform .15s,background .2s}\
.sl .atc.press{transform:scale(.96);background:var(--sl-acc)}\
.sl .toast{position:absolute;left:50%;bottom:22px;transform:translate(-50%,16px);background:var(--sl-ink);color:#fff;font-size:12px;padding:10px 16px;border-radius:999px;opacity:0;transition:opacity .35s,transform .35s;white-space:nowrap;z-index:5;display:flex;align-items:center;gap:8px}\
.sl .toast.on{opacity:1;transform:translate(-50%,0)}\
.sl .toast i{width:14px;height:14px;border-radius:50%;background:#22c55e;display:inline-grid;place-items:center}\
.sl .toast i::after{content:"";width:4px;height:7px;border:solid #fff;border-width:0 2px 2px 0;transform:translateY(-1px) rotate(45deg)}\
.sl .cur{position:absolute;left:0;top:0;width:18px;height:18px;z-index:6;pointer-events:none;will-change:transform}\
.sl .cur svg{width:18px;height:18px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}\
.sl .cur svg{transition:transform .12s}.sl .cur.click svg{transform:scale(.82) translate(1px,1px)}\
.sl .conf{position:absolute;inset:0;pointer-events:none;z-index:4;overflow:hidden}\
.sl .conf b{position:absolute;left:var(--cx);top:var(--cy);width:6px;height:10px;background:var(--c);border-radius:1px;opacity:0;animation:slConf 1.3s ease-out forwards;animation-delay:var(--d,0s)}\
@keyframes slConf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}\
@media (prefers-reduced-motion:reduce){.sl .view{transition:none}}';

  function el(tag, cls, html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }

  var CURSOR = '<svg viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.3L16 20l-2.6 1.1-3.2-7.2L5 18z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg>';

  var P = ROOT + 'assets/products/';
  var SEARCH_ITEMS = [
    {src:P+'vzero-orange.png', dull:true},
    {src:P+'vizzy.png', dull:false, hero:true},
    {src:P+'foundation.png', dull:true},
    {src:P+'cerave.png', dull:true}
  ];

  function build(host){
    var style = el('style', null, CSS);
    var root = el('div','sl');
    var q = host.getAttribute('data-query') || 'sparkling water';
    var si = host.getAttribute('data-search'); var items = SEARCH_ITEMS;
    if(si){ items = si.split(',').map(function(s,i){ s=s.trim(); var hero=s.charAt(0)==='*'; if(hero) s=s.slice(1); return {src:ROOT+s, dull:!hero, hero:hero}; }); }
    var heroIdx = Math.max(0, items.findIndex(function(it){return it.hero;}));
    var heroSrc = items[heroIdx] ? items[heroIdx].src : P+'vizzy.png';
    var car = (host.getAttribute('data-carousel')||'').split(',').map(function(s){return s.trim();}).filter(Boolean).map(function(s){return ROOT+s;});
    var alts = car.length ? car.map(function(s,i){ return '<div class="alt a'+(i+1)+'"><img src="'+s+'" alt=""></div>'; }).join('') : '<div class="alt a1" style="--p:#0174d9"><span></span></div><div class="alt a2" style="--p:#34a0fe"><span></span></div>';
    var ths = car.length ? '<div class="th on pic"><img src="'+heroSrc+'" alt=""></div>'+car.map(function(s){ return '<div class="th pic"><img src="'+s+'" alt=""></div>'; }).join('') : '<div class="th on"><img src="'+heroSrc+'" alt=""></div><div class="th ls" style="--p:#0174d9"></div><div class="th ls" style="--p:#34a0fe;background:linear-gradient(160deg,#f4f7fa,#e2e8f0)"></div><div class="th ls" style="--p:#015fb2"></div>';
    root.__heroIdx = heroIdx; root.__slides = car.length || 2;
    root.innerHTML =
      '<div class="view search-v on">'+
        '<div class="top"><span class="logo"></span><div class="search"><i></i>'+q+'</div></div>'+
        '<div class="grid">'+ items.map(function(it,i){ return '<div class="card" data-i="'+i+'"><div class="img'+(it.dull?' dull':'')+'"><img src="'+it.src+'" alt=""></div><span class="ln"></span><span class="ln s"></span></div>'; }).join('') +'</div>'+
      '</div>'+
      '<div class="view pdp-v">'+
        '<div class="top"><span class="logo"></span><div class="search"><i></i>'+q+'</div></div>'+
        '<div class="pdp">'+
          '<div class="gal">'+
            '<div class="main" data-show="0"><img class="h" src="'+heroSrc+'" alt="">'+alts+'</div>'+
            '<div class="thumbs">'+ths+'</div>'+
          '</div>'+
          '<div class="info"><span class="t"></span><span class="ln" style="width:60%"></span><div class="stars"><b></b><b></b><b></b><b></b><b></b></div><span class="price">$24.99</span><span class="ln"></span><span class="ln" style="width:90%"></span><span class="ln s"></span><div class="atc">Add to cart</div></div>'+
        '</div>'+
      '</div>'+
      '<div class="toast"><i></i>Added to cart</div>'+
      '<div class="conf"></div>'+
      '<div class="cur">'+CURSOR+'</div>';
    host.appendChild(style); host.appendChild(root);
    return root;
  }

  function center(root, node){
    var r=root.getBoundingClientRect(), n=node.getBoundingClientRect();
    return {x:n.left-r.left+n.width/2, y:n.top-r.top+n.height/2};
  }
  function Mover(root, cur){
    var self=this; this.x=0; this.y=0; this.raf=null;
    this.place=function(x,y){ self.x=x; self.y=y; cur.style.transform='translate('+x+'px,'+y+'px)'; };
    this.cancel=function(){ if(self.raf) cancelAnimationFrame(self.raf); self.raf=null; };
    // Curved path with ease-in-out, slight overshoot/settle and micro hand tremor
    this.to=function(tx,ty,dur,done){
      self.cancel();
      var sx=self.x, sy=self.y, dx=tx-sx, dy=ty-sy, dist=Math.hypot(dx,dy);
      dur = dur || Math.max(420, Math.min(1100, 260 + dist*1.6));
      var side=(Math.random()<.5?-1:1), bend=Math.min(90, dist*.22)*side;
      var cx=sx+dx*.5 - dy/(dist||1)*bend, cy=sy+dy*.5 + dx/(dist||1)*bend;
      var ox=tx+dx/(dist||1)*Math.min(7,dist*.04), oy=ty+dy/(dist||1)*Math.min(7,dist*.04);
      var t0=null, ph=Math.random()*6.28;
      function ease(p){ return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2; }
      function step(ts){
        if(!t0) t0=ts; var p=Math.min((ts-t0)/dur,1), e=ease(p);
        var x,y;
        if(p<.88){ var q=e/ .97; var u=1-q; x=u*u*sx+2*u*q*cx+q*q*ox; y=u*u*sy+2*u*q*cy+q*q*oy; }
        else { var k=(p-.88)/.12; x=ox+(tx-ox)*k; y=oy+(ty-oy)*k; }
        var tr=(1-p)*1.2; x+=Math.sin(ts/38+ph)*tr; y+=Math.cos(ts/47+ph)*tr;
        self.place(x,y);
        if(p<1) self.raf=requestAnimationFrame(step); else { self.raf=null; done&&done(); }
      }
      self.raf=requestAnimationFrame(step);
    };
    this.toNode=function(node,dx,dy,dur,done){ var c=center(root,node); self.to(c.x+(dx||0)+(Math.random()*6-3), c.y+(dy||0)+(Math.random()*6-3), dur, done); };
    this.click=function(){ cur.classList.add('click'); setTimeout(function(){cur.classList.remove('click')},140); };
  }
  function confetti(root, node){
    var c=center(root,node), box=root.querySelector('.conf'); box.innerHTML='';
    var cols=['#0174d9','#34a0fe','#f59e0b','#22c55e','#ef4444','#a855f7'];
    for(var i=0;i<26;i++){ var b=document.createElement('b'); var a=Math.random()*Math.PI*2, d=60+Math.random()*110;
      b.style.cssText='--cx:'+c.x+'px;--cy:'+c.y+'px;--c:'+cols[i%cols.length]+';--dx:'+(Math.cos(a)*d)+'px;--dy:'+(Math.sin(a)*d-50)+'px;--r:'+(Math.random()*720-360)+'deg;--d:'+(Math.random()*.12)+'s';
      box.appendChild(b); }
  }

  function run(root){
    var reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    var sv=root.querySelector('.search-v'), pv=root.querySelector('.pdp-v'), cur=root.querySelector('.cur'), toast=root.querySelector('.toast');
    var hero=sv.querySelector('.card[data-i="'+(root.__heroIdx||0)+'"]'), main=pv.querySelector('.main'), ths=pv.querySelectorAll('.th'), atc=pv.querySelector('.atc');
    var mv=new Mover(root,cur), timers=[], alive=false;
    function wait(ms,fn){ timers.push(setTimeout(function(){ if(alive) fn(); }, ms)); }
    function rnd(a,b){ return a+Math.random()*(b-a); }
    function reset(){ sv.classList.add('on'); sv.classList.remove('out'); pv.classList.remove('on','out'); hero.classList.remove('hot'); main.dataset.show='0'; ths.forEach(function(t,i){t.classList.toggle('on',i===0)}); toast.classList.remove('on'); root.querySelector('.conf').innerHTML=''; }
    function pick(i,then){ mv.toNode(ths[i],0,0,null,function(){ wait(rnd(140,260),function(){ mv.click(); ths.forEach(function(t){t.classList.remove('on')}); ths[i].classList.add('on'); main.dataset.show=String(i); wait(rnd(700,1100),then); }); }); }
    function cycle(){
      reset();
      var r=root.getBoundingClientRect(); mv.place(r.width*.72, r.height*.9);
      wait(rnd(600,900), function(){
        // drift toward the hero, hover, then click
        mv.toNode(hero,rnd(-14,14),rnd(-10,14),null,function(){
          hero.classList.add('hot');
          wait(rnd(260,420),function(){ mv.to(mv.x+rnd(-6,6), mv.y+rnd(-5,5), 260, function(){
            wait(rnd(120,220),function(){ mv.click();
              wait(180,function(){ sv.classList.remove('on'); sv.classList.add('out'); pv.classList.add('on');
                wait(rnd(650,900),function(){ pick(1,function(){ pick(2,function(){ (root.__slides>=3?function(n){pick(3,n)}:function(n){n()})(function(){
                  // settle on main image briefly, then go to add to cart
                  mv.to(mv.x+rnd(-20,20), mv.y+rnd(-30,-10), 380, function(){
                    wait(rnd(300,500),function(){ mv.toNode(atc,rnd(-18,18),rnd(-4,4),null,function(){
                      wait(rnd(200,340),function(){ mv.click(); atc.classList.add('press'); confetti(root,atc);
                        wait(180,function(){ atc.classList.remove('press'); toast.classList.add('on');
                          mv.to(mv.x+rnd(10,30), mv.y+rnd(10,24), 500);
                          wait(1900,function(){ toast.classList.remove('on');
                            wait(500,function(){ pv.classList.remove('on'); pv.classList.add('out');
                              wait(420,function(){ pv.classList.remove('out'); sv.classList.remove('out'); sv.classList.add('on'); var rr=root.getBoundingClientRect(); mv.to(rr.width*.72, rr.height*.9, 900);
                                wait(1200,cycle);
                              });
                            });
                          });
                        });
                      });
                    }); });
                  });
                }); }); }); });
              });
            });
          }); });
        });
      });
    }
    if(reduced){ reset(); pv.classList.add('on'); sv.classList.remove('on'); cur.style.display='none'; return; }
    var io=new IntersectionObserver(function(e){
      if(e[0].isIntersecting && !alive){ alive=true; cycle(); }
      else if(!e[0].isIntersecting && alive){ alive=false; timers.forEach(clearTimeout); timers=[]; mv.cancel(); }
    },{threshold:.3});
    io.observe(root);
  }

  function init(){ document.querySelectorAll('[data-shop-loop]').forEach(function(h){ if(h.__sl) return; h.__sl=true; run(build(h)); }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
