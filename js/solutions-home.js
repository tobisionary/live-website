/* Solutions pages — home page interactions: button cursor glow + animated stats */
(function(){
  document.querySelectorAll('.btn').forEach(function(btn){
    btn.addEventListener('pointermove',function(e){var r=btn.getBoundingClientRect();btn.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');btn.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');});
    btn.addEventListener('pointerleave',function(){btn.style.setProperty('--mx','50%');btn.style.setProperty('--my','50%');});
  });
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var strips=document.querySelectorAll('.stat-strip,.statline');
  strips.forEach(function(wrap){
    var noCount=wrap.hasAttribute('data-no-count');
    if(!noCount)wrap.querySelectorAll('.n').forEach(function(n){
      var txt=n.textContent.replace(/\s+/g,' ').trim();
      var m=txt.match(/(\d+(?:\.\d+)?)/);
      if(!m){return;}
      var i=txt.indexOf(m[1]);
      var pre=txt.slice(0,i),suf=txt.slice(i+m[1].length);
      n.innerHTML=esc(pre)+'<span class="cnt" data-target="'+m[1]+'">'+(reduced?m[1]:'0')+'</span>'+esc(suf);
    });
    if(reduced){wrap.classList.add('play');return;}
    var io=new IntersectionObserver(function(en){en.forEach(function(e){
      if(e.isIntersecting&&!wrap.classList.contains('play')){
        wrap.classList.add('play');
        wrap.querySelectorAll('.cnt').forEach(function(c,i){count(c,1600,i*800);});
        io.disconnect();
      }
    });},{threshold:0.3});
    io.observe(wrap);
  });
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function count(el,dur,delay){
    var target=parseFloat(el.dataset.target),dec=(el.dataset.target.indexOf('.')>-1)?1:0;
    setTimeout(function(){
      var t0=null;
      function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var e=1-Math.pow(1-p,3);el.textContent=(e*target).toFixed(dec);if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);
    },delay);
  }
})();
