/* ════════════════════════════════════════════════════════════
   Spark pages motion layer — scroll reveals, score count-ups,
   and the flywheel node stagger. Shared by spark-ai.html and
   spark-studio.html.

   Progressive enhancement: every animated element is legible with
   JS off (the CSS only hides things that this script reveals, and
   a fallback pass below un-hides anything still hidden).
   ════════════════════════════════════════════════════════════ */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = target; return; }
    var dur = 900, t0 = performance.now();
    (function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function activate(el) {
    el.classList.add('in');
    [].forEach.call(el.querySelectorAll('[data-count]'), countUp);
  }

  var targets = [].slice.call(document.querySelectorAll('.sp-reveal, .sp-pull, .sp-fly'));
  if (!targets.length) return;

  // No IntersectionObserver (or reduced motion): show everything immediately.
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(activate);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      activate(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.18 });

  targets.forEach(function (el) { io.observe(el); });

  // Safety net: never leave above-the-fold content stuck invisible.
  setTimeout(function () {
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) activate(el);
    });
  }, 1800);
})();
