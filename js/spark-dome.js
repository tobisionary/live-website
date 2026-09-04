/* ════════════════════════════════════════════════════════════
   Spark Studio disc fields — discs on concentric arcs around one
   origin, so a field reads as a dome rising out of an edge.

   Two of them on the page, both from this file:

     data-spark-dome           a half dome off the bottom middle
                               (the hero)
     data-spark-dome="corner"  a quarter of one, off the bottom
                               right corner (the closing card)

   Each mount is laid out, handed each disc's hue, size and its
   phase in the light sweep, and wired to the cursor. The tilt,
   the sweep and the glow itself are CSS (.dm-dot / .dm-i in
   spark-studio.html).

   Two things this file owns that CSS cannot:

   1. The light sweep's phase. Each disc's animation-delay is its
      angle round the field, so the bright band is always at one
      angle and travels round it — a rotating gradient out of a
      single keyframe rule, with no extra elements over the top.

   2. The light under the cursor. Every disc holds an energy
      value: the cursor's pass sets it, and it decays a little
      every frame, so the lit discs trail behind the pointer and
      settle back late — a stroke of light, not a spotlight. CSS
      turns that value into a near-white fill, a bloom and a
      little scale. Energy is taken from the disc's distance to
      the segment the cursor travelled since the last frame, so a
      fast flick paints a continuous line instead of a dotted
      one. Disc centres are cached in pixels at build time, so a
      frame is one pass of cheap maths over that cache, writing
      only the discs whose value actually changed.

   Positions are percentages, so a field scales with its box. The
   ring pitch is pixels, so the disc count follows the rendered
   size — hence the rebuild on a meaningful resize.
   ════════════════════════════════════════════════════════════ */
(function () {
  var mounts = document.querySelectorAll('[data-spark-dome]');
  if (!mounts.length) return;

  var SWEEP = 7;      // seconds for the light to travel once round a field
  var FULL = 58;      // px from the stroke: this close, a disc is full lit
  var FADE = 200;     // px from the stroke: past this, the cursor misses it
  var DECAY = 0.93;   // per frame: what is left of a lit disc's energy

  [].forEach.call(mounts, function (mount) { field(mount); });

  function field(mount) {
    // The cursor is tracked on whatever the field sits in — the hero, or
    // the closing card — not on the discs, which take no pointer events.
    var host = mount.parentElement || mount;
    var corner = mount.getAttribute('data-spark-dome') === 'corner';
    var dots = [];    // { el, x, y, e, q } — centre in px, energy, written value
    var lastW = 0;

    function build() {
      var w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      lastW = w;

      // The arc: a half circle off the bottom middle, or a quarter off the
      // bottom right corner. `reach` is how far the outermost ring runs
      // sideways, which is also what sets the ring pitch.
      var cx = corner ? 100 : 50;
      var a0 = corner ? Math.PI / 2 : 0;
      var span = corner ? Math.PI / 2 : Math.PI;
      var reach = corner ? w : w / 2;

      // A fixed ring count keeps the disc total steady at any size, so a
      // wider box gets bigger discs rather than hundreds more of them.
      // Every disc is an animated element and a cursor-distance test every
      // frame, so the count is the main thing holding this smooth.
      // The corner field is set on a finer grain than the hero's: it is a
      // quarter of the arc in a smaller box, and at the hero's pitch the
      // discs came out coarse and few. More rings means a smaller pitch,
      // and the disc size is a fraction of the pitch.
      // The count is a function of the ring count alone — (span / pitch) x
      // the sum of the radii cancels the pitch out — so more rings is both
      // finer discs and more of them.
      var rings = corner ? (w < 560 ? 15 : w < 900 ? 19 : 24)
                         : (w < 560 ? 9 : w < 900 ? 11 : 14);
      var pitch = reach / (rings + 0.6);
      // The box is flatter than the arc is tall, so the rings land as
      // ellipse arcs. `squash` is how much closer they sit vertically, and
      // it caps the disc size — without it the crown rings would overlap.
      var squash = h / reach;
      var cap = Math.min(0.94, 0.94 * squash);
      var out = [], geo = [];

      for (var i = 1; i <= rings; i++) {
        var k = i / rings;                           // 0 at the origin, 1 at the rim
        var r = k * reach;
        // one disc per pitch of arc, so spacing along a ring matches the
        // spacing between rings
        var n = Math.max(2, Math.round((span * r) / pitch));

        for (var j = 0; j <= n; j++) {
          var t = j / n;                             // 0 at the arc's start, 1 at its end
          var a = a0 + t * span;
          var xp = cx + Math.cos(a) * k * (reach / w * 100);
          var yp = 100 - Math.sin(a) * k * 100;

          // one blue family — cyan-blue at one end of the arc, the brand
          // blue through the middle, indigo at the other
          var hue = 188 + 36 * t;
          // biggest discs nearest the origin, tapering to the rim, where
          // size, lightness and opacity together let the field dissolve
          // into the dark behind it
          var sz = pitch * (cap - 0.42 * k) * (0.94 + Math.random() * 0.12);
          var light = Math.max(15, Math.min(70, 58 - 26 * k + (Math.random() * 7 - 3.5)));

          geo.push([xp / 100 * w, yp / 100 * h]);
          out.push(
            '<span class="dm-dot" style="left:' + xp.toFixed(2) + '%;top:' + yp.toFixed(2) + '%' +
            ';--sz:' + sz.toFixed(2) + 'px' +
            ';--h:' + hue.toFixed(1) +
            ';--l:' + light.toFixed(1) +
            ';--o:' + Math.max(0.1, 1 - 0.85 * Math.pow(k, 1.25)).toFixed(2) +
            ';--sw:-' + (t * SWEEP).toFixed(2) + 's' +
            '"><i class="dm-i"></i></span>'
          );
        }
      }

      mount.innerHTML = out.join('');

      var els = mount.children;
      dots = [];
      for (var m = 0; m < els.length && m < geo.length; m++) {
        dots.push({ el: els[m], x: geo[m][0], y: geo[m][1], e: 0, q: 0 });
      }
    }

    build();

    /* ── the light, brushed on by the cursor ── */
    var at = null;      // where the cursor is now, in field pixels
    var from = null;    // where it was last frame, so a flick paints a segment
    var running = false;

    // distance from a disc to the segment the cursor covered this frame
    function segDist(x, y, p, q) {
      var vx = q[0] - p[0], vy = q[1] - p[1];
      var len = vx * vx + vy * vy;
      var t = len ? ((x - p[0]) * vx + (y - p[1]) * vy) / len : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      var dx = x - (p[0] + vx * t), dy = y - (p[1] + vy * t);
      return Math.sqrt(dx * dx + dy * dy);
    }

    function frame() {
      var live = false;

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var e = d.e * DECAY;                       // what the last pass left behind

        if (at) {
          var dist = from ? segDist(d.x, d.y, from, at)
                          : Math.sqrt((d.x - at[0]) * (d.x - at[0]) + (d.y - at[1]) * (d.y - at[1]));
          var f = dist <= FULL ? 1 : dist >= FADE ? 0 : (FADE - dist) / (FADE - FULL);
          f = f * f * (3 - 2 * f);                 // ease the edge of the stroke
          if (f > e) e = f;
        }

        if (e < 0.02) e = 0;
        d.e = e;                                   // energy stays a float...

        // ...and only the written value is quantised, to 5% steps, so a few
        // hundred discs are not each taking a style write every frame.
        // Rounding the energy itself would strand the tail: below about
        // 0.36 a frame's decay is smaller than half a step, so it would
        // round back to where it started and the trail would never fade.
        var q = e ? Math.round(e * 20) / 20 : 0;
        if (q < 0.05) q = 0;
        if (q !== d.q) {
          d.q = q;
          if (q) d.el.style.setProperty('--e', q);
          else d.el.style.removeProperty('--e');
        }
        if (e) live = true;
      }

      from = at;                                   // this frame's segment is spent
      // Keep running while anything is still lit, so the trail has time to
      // settle back even after the cursor has stopped or left.
      if (live) requestAnimationFrame(frame);
      else { running = false; from = null; }
    }

    function run() {
      if (!running) { running = true; requestAnimationFrame(frame); }
    }

    host.addEventListener('pointermove', function (e) {
      var r = mount.getBoundingClientRect();
      at = [e.clientX - r.left, e.clientY - r.top];
      run();
    });
    host.addEventListener('pointerleave', function () {
      at = null;
      run();
    });

    // The sweep only runs while the field is on screen — a few hundred
    // discs repainting is not worth it once it has scrolled away. No
    // observer (or nothing to observe): leave it running.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { mount.classList.toggle('is-live', e.isIntersecting); });
      }, { threshold: 0 }).observe(mount);
    } else {
      mount.classList.add('is-live');
    }

    var t;
    window.addEventListener('resize', function () {
      if (Math.abs(mount.clientWidth - lastW) < 80) return;
      clearTimeout(t);
      t = setTimeout(build, 180);
    });
  }
})();
