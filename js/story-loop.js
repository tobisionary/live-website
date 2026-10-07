/* <div data-story-loop> — phone: Instagram-style stories → sponsored Amazon ad with two products → finger taps the winner → Buy now → fade → loop */
(function(){
  var ROOT=(document.currentScript&&document.currentScript.getAttribute('data-root'))||'';
  var P=ROOT+'assets/products/';
  var CSS='\
.stl{position:relative;width:100%;max-width:300px;aspect-ratio:9/19.2;margin:0 auto;background:#0b0f14;border-radius:48px;padding:12px;box-shadow:0 40px 80px rgba(0,0,0,.45),inset 0 0 0 2px #2a333d,inset 0 0 0 5px #0b0f14,inset 0 0 0 6px #3a4550;font-family:var(--font-sans,system-ui,sans-serif)}\
.stl *{box-sizing:border-box}\
.stl .island{position:absolute;top:22px;left:50%;transform:translateX(-50%);width:84px;height:24px;background:#000;border-radius:999px;z-index:6}\
.stl .scr{position:absolute;inset:12px;border-radius:38px;background:#000;overflow:hidden}\
.stl .story{position:absolute;inset:0;opacity:0;transition:opacity .45s ease;display:flex;flex-direction:column}\
.stl .story.s1{opacity:1;transition:none}\
.stl .story.ad{z-index:2}\
.stl .story.on{opacity:1}\
.stl .bars{position:absolute;top:54px;left:12px;right:12px;display:flex;gap:4px;z-index:5}\
.stl .bars i{flex:1;height:2.5px;border-radius:2px;background:rgba(255,255,255,.35);overflow:hidden;position:relative}\
.stl .bars i::after{content:"";position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left}\
.stl .bars i.done::after{transform:scaleX(1)}\
.stl .bars i.run::after{animation:stlBar var(--d,2.4s) linear forwards}\
@keyframes stlBar{to{transform:scaleX(1)}}\
.stl .hdr{position:absolute;top:64px;left:12px;right:12px;display:flex;align-items:center;gap:8px;z-index:5;color:#fff;font-size:11px;font-weight:500}\
.stl .hdr .av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7);padding:2px;flex:none}\
.stl .hdr .av i{display:block;width:100%;height:100%;border-radius:50%;border:2px solid #000;background:var(--face,#c98b6b);position:relative;overflow:hidden}\
.stl .hdr .av i::before{content:"";position:absolute;left:50%;top:22%;width:40%;aspect-ratio:1;border-radius:50%;background:rgba(0,0,0,.35);transform:translateX(-50%)}\
.stl .hdr .av i::after{content:"";position:absolute;left:50%;top:62%;width:72%;height:60%;border-radius:50% 50% 0 0;background:rgba(0,0,0,.35);transform:translateX(-50%)}\
.stl .hdr .av.amz{background:#fff;padding:0}\
.stl .hdr .av.amz i{border:2px solid #fff;background:#fff}\
.stl .hdr .av.amz i::before,.stl .hdr .av.amz i::after{display:none}\
.stl .hdr .av.amz svg{position:absolute;inset:0;width:100%;height:100%;padding:4px}\
.stl .hdr .nm{display:flex;flex-direction:column;line-height:1.15}\
.stl .hdr .nm small{font-weight:400;opacity:.7;font-size:10px}\
.stl .hdr .sp{margin-left:auto;font-size:9.5px;font-weight:500;letter-spacing:.04em;padding:3px 7px;border-radius:999px;background:rgba(255,255,255,.18)}\
.stl .fill{position:absolute;inset:0}\
.stl .s1 .fill{background:radial-gradient(80% 60% at 20% 15%,rgba(255,153,0,.55),transparent 60%),radial-gradient(70% 60% at 85% 80%,rgba(1,116,217,.5),transparent 60%),linear-gradient(170deg,#1b2a3d,#0b1119)}\
.stl .adart{position:absolute;inset:0;overflow:hidden}\
.stl .adart .blob{position:absolute;border-radius:50%;filter:blur(28px);opacity:.85;animation:stlDrift 9s ease-in-out infinite alternate}\
.stl .adart .b1{width:70%;aspect-ratio:1;left:-15%;top:12%;background:#ff9900}\
.stl .adart .b2{width:60%;aspect-ratio:1;right:-18%;top:38%;background:#34a0fe;animation-delay:-3s}\
.stl .adart .b3{width:55%;aspect-ratio:1;left:20%;bottom:-20%;background:#ffd814;animation-delay:-6s;opacity:.6}\
@keyframes stlDrift{to{transform:translate(8%,-6%) scale(1.08)}}\
.stl .stcap.big{bottom:auto;top:38%;font-size:30px;line-height:1.05;font-weight:700;letter-spacing:-.03em;text-shadow:0 2px 20px rgba(0,0,0,.45)}\
.stl .pr{opacity:0;transform:translateY(10px);transition:opacity .6s ease,transform .6s ease}\
.stl .story.on .pr{opacity:1;transform:none}\
.stl .story.on .pr:nth-child(2){transition-delay:.15s}\
.stl .reply{display:flex;gap:10px}\
.stl .reply .hrt{margin-left:auto;width:16px;height:16px;position:relative}\
.stl .reply .hrt::before,.stl .reply .hrt::after{content:"";position:absolute;top:0;left:8px;width:7px;height:12px;border:1.5px solid rgba(255,255,255,.85);border-radius:7px 7px 0 0;transform:rotate(-45deg);transform-origin:0 100%;border-bottom:none}\
.stl .reply .hrt::after{left:0;transform:rotate(45deg);transform-origin:100% 100%}\
.stl .fill::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 30%,transparent 60%,rgba(0,0,0,.55))}\
.stl .grain{position:absolute;inset:0;opacity:.18;background-image:radial-gradient(rgba(255,255,255,.6) .6px,transparent .7px);background-size:3px 3px;mix-blend-mode:overlay}\
.stl .stcap{position:absolute;left:14px;right:14px;bottom:76px;background:none;border:none;padding:0;border-radius:0;display:block;color:#fff;font-size:12px;font-weight:500;text-shadow:0 1px 8px rgba(0,0,0,.5)}\
.stl .reply{position:absolute;left:12px;right:12px;bottom:22px;height:34px;border-radius:999px;background:none;border:1px solid rgba(255,255,255,.5);color:rgba(255,255,255,.75);font-size:11px;display:flex;align-items:center;padding:0 14px}\
.stl .ad .fill{background:radial-gradient(80% 60% at 20% 15%,rgba(255,153,0,.55),transparent 60%),radial-gradient(70% 60% at 85% 80%,rgba(1,116,217,.5),transparent 60%),linear-gradient(170deg,#1b2a3d,#0b1119)}\
.stl .adb{position:absolute;top:110px;left:14px;right:14px;bottom:68px;display:flex;flex-direction:column;gap:12px;justify-content:center}\
.stl .adb .lead{font-size:16px;font-weight:600;color:#fff;letter-spacing:-.02em;line-height:1.2;text-shadow:0 1px 10px rgba(0,0,0,.4)}\
.stl .adb .lead small{display:block;font-weight:400;color:rgba(255,255,255,.75);font-size:11px;margin-top:4px}\
.stl .prods{display:grid;grid-template-columns:1fr 1fr;gap:8px}\
.stl .pr{border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:8px;display:flex;flex-direction:column;gap:6px;background:rgba(255,255,255,.96)}\
.stl .pr .pic{aspect-ratio:1;border-radius:6px;background:#f7f8fa;position:relative;overflow:hidden}\
.stl .pr .pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:10%}\
.stl .pr.dull .pic img{filter:grayscale(1) contrast(.8);opacity:.7}\
.stl .pr i{display:block;height:5px;border-radius:3px;background:#e5e7eb}.stl .pr i.s{width:55%}\
.stl .pr .px{font-size:12px;font-weight:600;color:#111;margin-top:2px}\
.stl .story.on .pr.hot{border-color:var(--accent,#0174d9);box-shadow:0 0 0 1px var(--accent,#0174d9),0 10px 24px -14px rgba(1,116,217,.6);transform:translateY(-2px);transition:opacity .6s,transform .3s,box-shadow .3s,border-color .3s}\
.stl .story.on .pr.press{transform:scale(.97)}\
.stl .buy{margin-top:4px;height:40px;border-radius:999px;background:#ffd814;color:#111;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s,background .15s}\
.stl .buy.on{opacity:1;transform:none}\
.stl .buy.press{transform:scale(.96);background:#f7ca00}\
.stl .done{position:absolute;inset:0;display:grid;place-items:center;background:rgba(11,17,25,.94);opacity:0;transition:opacity .35s;z-index:7}\
.stl .done>div{display:flex;flex-direction:column;align-items:center}\
.stl .done.on{opacity:1}\
.stl .done .chk{width:52px;height:52px;border-radius:50%;background:#ffd814;display:grid;place-items:center}\
.stl .done .chk::after{content:"";width:11px;height:20px;border:solid #111;border-width:0 3px 3px 0;transform:translate(0,-3px) rotate(45deg)}\
.stl .done span{display:block;margin-top:12px;font-size:13px;font-weight:600;color:#fff;text-align:center;width:100%}\
.stl .fin{position:absolute;left:0;top:0;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.35);border:1.5px solid rgba(255,255,255,.9);box-shadow:0 4px 14px rgba(0,0,0,.35);z-index:9;pointer-events:none;opacity:0;transform:translate(-50%,-50%) scale(1);transition:opacity .3s;will-change:left,top}\
.stl .fin.show{opacity:1}\
.stl .fin.tap{animation:stlTap .28s ease}\
@keyframes stlTap{0%{transform:translate(-50%,-50%) scale(1)}40%{transform:translate(-50%,-50%) scale(.72);background:rgba(255,255,255,.6)}100%{transform:translate(-50%,-50%) scale(1)}}\
.stl .fade{position:absolute;inset:0;background:#000;opacity:0;transition:opacity .5s;z-index:8;pointer-events:none}\
.stl .fade.on{opacity:1}\
';

  function build(host){
    var st=document.createElement('style'); st.textContent=CSS;
    var root=document.createElement('div'); root.className='stl'; root.setAttribute('aria-hidden','true');
    var lose=host.getAttribute('data-lose')?ROOT+host.getAttribute('data-lose'):P+'vzero-orange.png';
    var win=host.getAttribute('data-win')?ROOT+host.getAttribute('data-win'):P+'vizzy.png';
    var lead=host.getAttribute('data-lead')||'Snack time, sorted.';
    root.innerHTML=
      '<div class="island"></div><div class="scr">'+
        '<div class="story s1 adimg"><div class="fill"></div><div class="grain"></div><div class="bars"><i></i><i></i></div><div class="hdr"><span class="av amz"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 15.5c3.2 2.3 7 3.5 10.6 3.5 2.6 0 5.2-.6 7.4-1.7.4-.2.8.3.4.6-2.4 1.8-5.6 2.8-8.6 2.8-4 0-7.6-1.5-10.3-4-.3-.3 0-.6.5-.2z" fill="#f90"/><path d="M20.7 14.6c-.3-.4-2.2-.2-3-.1-.3 0-.3-.2-.1-.4 1.5-1 3.9-.7 4.2-.4.3.4-.1 2.8-1.5 4-.2.2-.4.1-.3-.2.3-.8 1-2.5.7-2.9z" fill="#f90"/><path d="M13.1 10.2c0 1-.1 1.9-.5 2.5-.4.6-1 .9-1.7.9-.9 0-1.5-.7-1.5-1.8 0-2.1 1.9-2.4 3.7-2.4v.8zm2.5 5.5c-.2.1-.4.2-.6 0-.8-.7-1-1-1.4-1.6-1.3 1.4-2.3 1.8-4 1.8-2 0-3.6-1.3-3.6-3.8 0-2 1.1-3.3 2.6-4 1.3-.6 3.1-.7 4.5-.8v-.3c0-.6 0-1.3-.3-1.8-.3-.4-.8-.6-1.3-.6-.9 0-1.7.5-1.9 1.4-.1.2-.2.4-.4.4L7 6.2c-.2 0-.4-.2-.4-.5C7.2 3 9.5 2 11.6 2c1.1 0 2.5.3 3.3 1.1 1.1 1 1 2.3 1 3.8v3.4c0 1 .4 1.5.8 2.1.1.2.2.4 0 .6l-1.6 1.4z" fill="#111"/></svg></i></span><span class="nm">amazon<small>Sponsored</small></span><span class="sp">Ad</span></div><div class="adart"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span></div><div class="stcap big">Snack time,<br>sorted.</div><div class="reply">Send message<span class="hrt"></span></div></div>'+
        '<div class="story ad"><div class="fill"></div><div class="bars"><i></i><i></i></div><div class="hdr"><span class="av amz"><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 15.5c3.2 2.3 7 3.5 10.6 3.5 2.6 0 5.2-.6 7.4-1.7.4-.2.8.3.4.6-2.4 1.8-5.6 2.8-8.6 2.8-4 0-7.6-1.5-10.3-4-.3-.3 0-.6.5-.2z" fill="#f90"/><path d="M20.7 14.6c-.3-.4-2.2-.2-3-.1-.3 0-.3-.2-.1-.4 1.5-1 3.9-.7 4.2-.4.3.4-.1 2.8-1.5 4-.2.2-.4.1-.3-.2.3-.8 1-2.5.7-2.9z" fill="#f90"/><path d="M13.1 10.2c0 1-.1 1.9-.5 2.5-.4.6-1 .9-1.7.9-.9 0-1.5-.7-1.5-1.8 0-2.1 1.9-2.4 3.7-2.4v.8zm2.5 5.5c-.2.1-.4.2-.6 0-.8-.7-1-1-1.4-1.6-1.3 1.4-2.3 1.8-4 1.8-2 0-3.6-1.3-3.6-3.8 0-2 1.1-3.3 2.6-4 1.3-.6 3.1-.7 4.5-.8v-.3c0-.6 0-1.3-.3-1.8-.3-.4-.8-.6-1.3-.6-.9 0-1.7.5-1.9 1.4-.1.2-.2.4-.4.4L7 6.2c-.2 0-.4-.2-.4-.5C7.2 3 9.5 2 11.6 2c1.1 0 2.5.3 3.3 1.1 1.1 1 1 2.3 1 3.8v3.4c0 1 .4 1.5.8 2.1.1.2.2.4 0 .6l-1.6 1.4z" fill="#111"/></svg></i></span><span class="nm">amazon<small>Sponsored</small></span><span class="sp">Ad</span></div>'+
          '<div class="adb"><div class="lead">'+lead+'</div>'+
            '<div class="prods">'+
              '<div class="pr dull"><div class="pic"><img src="'+lose+'" alt=""></div><i></i><i class="s"></i><span class="px">$3.49</span></div>'+
              '<div class="pr win"><div class="pic"><img src="'+win+'" alt=""></div><i></i><i class="s"></i><span class="px">$4.29</span></div>'+
            '</div>'+
            '<div class="buy">Buy now</div>'+
          '</div>'+
          '<div class="reply">Send message<span class="hrt"></span></div>'+
          '<div class="done"><div><div class="chk"></div><span>Order placed</span></div></div>'+
        '</div>'+
        '<div class="fin"></div><div class="fade"></div>'+
      '</div>';
    host.appendChild(st); host.appendChild(root); return root;
  }

  function run(root){
    var reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
    var scr=root.querySelector('.scr'), stories=[].slice.call(root.querySelectorAll('.story')), ad=root.querySelector('.ad'),
        win=root.querySelector('.pr.win'), buy=root.querySelector('.buy'), done=root.querySelector('.done'), fin=root.querySelector('.fin'), fade=root.querySelector('.fade');
    var timers=[], alive=false, raf=null, fx=0, fy=0;
    function wait(ms,fn){ timers.push(setTimeout(function(){ if(alive) fn(); },ms)); }
    function rnd(a,b){ return a+Math.random()*(b-a); }
    function place(x,y){ fx=x; fy=y; fin.style.left=x+'px'; fin.style.top=y+'px'; }
    function center(n){ var r=scr.getBoundingClientRect(), b=n.getBoundingClientRect(); return {x:b.left-r.left+b.width/2,y:b.top-r.top+b.height/2}; }
    function moveTo(tx,ty,done){
      if(raf) cancelAnimationFrame(raf);
      var sx=fx, sy=fy, dx=tx-sx, dy=ty-sy, dist=Math.hypot(dx,dy)||1, dur=Math.max(380,Math.min(900,240+dist*1.4)), bend=Math.min(60,dist*.2)*(Math.random()<.5?-1:1);
      var qx=sx+dx*.5-dy/dist*bend, qy=sy+dy*.5+dx/dist*bend, t0=null;
      function ease(p){ return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2; }
      function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1), e=ease(p), u=1-e; place(u*u*sx+2*u*e*qx+e*e*tx, u*u*sy+2*u*e*qy+e*e*ty); if(p<1) raf=requestAnimationFrame(step); else { raf=null; done&&done(); } }
      raf=requestAnimationFrame(step);
    }
    function tap(){ fin.classList.remove('tap'); void fin.offsetWidth; fin.classList.add('tap'); }
    function bars(story,idx){ var b=story.querySelectorAll('.bars i'); b.forEach(function(x,i){ x.classList.remove('done','run'); if(i<idx) x.classList.add('done'); }); if(b[idx]) b[idx].classList.add('run'); }
    function show(i){ stories.forEach(function(s,k){ s.classList.toggle('on',k===i); }); bars(stories[i],i); }
    function reset(){ stories.forEach(function(s){ s.classList.remove('on'); }); win.classList.remove('hot','press'); buy.classList.remove('on','press'); done.classList.remove('on'); fin.classList.remove('show'); fade.classList.remove('on'); }
    function cycle(){
      reset();
      var r=scr.getBoundingClientRect(); place(r.width*.62, r.height*.72);
      show(0);
      wait(600,function(){ fin.classList.add('show'); });
      wait(2200,function(){ moveTo(r.width*.8+rnd(-10,10), r.height*.52+rnd(-30,30), function(){ wait(rnd(120,220),function(){ tap(); wait(120,function(){ show(1); }); }); }); });
      wait(4000,function(){ var c=center(win); moveTo(c.x+rnd(-6,6), c.y+rnd(-6,6), function(){ wait(rnd(180,300),function(){ tap(); win.classList.add('press','hot'); wait(140,function(){ win.classList.remove('press'); buy.classList.add('on'); }); }); }); });
      wait(5800,function(){ var c=center(buy); moveTo(c.x+rnd(-10,10), c.y, function(){ wait(rnd(160,280),function(){ tap(); buy.classList.add('press'); wait(140,function(){ buy.classList.remove('press'); done.classList.add('on'); fin.classList.remove('show'); }); }); }); });
      wait(8100,function(){ fade.classList.add('on'); });
      wait(8800,function(){ reset(); show(0); wait(80,function(){ fade.classList.remove('on'); }); });
      wait(9300,cycle);
    }
    if(reduced){ reset(); show(1); win.classList.add('hot'); buy.classList.add('on'); return; }
    var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting&&!alive){ alive=true; cycle(); } else if(!e[0].isIntersecting&&alive){ alive=false; timers.forEach(clearTimeout); timers=[]; if(raf) cancelAnimationFrame(raf); raf=null; } },{threshold:.05});
    io.observe(root);
  }
  function init(){ document.querySelectorAll('[data-story-loop]').forEach(function(h){ if(h.__stl) return; h.__stl=true; run(build(h)); }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
