// JS/contact.js
// 1) Mount the reusable social-buttons component anywhere a node has
//    [data-social-buttons], with a robust fallback for file:// previews.
// 2) Handle the Contact Me toggle (outside pill -> bridge -> collapsible form).

(function () {


  /* ---------------------------------------
     Contact pill -> bridge -> form card
     --------------------------------------- */
  const section = document.getElementById('contact-section');
  const toggle  = document.getElementById('contact-toggle');
  const bridge  = document.getElementById('contact-bridge');
  const card    = document.getElementById('contact-card');

  function slideOpen(el){ el.style.maxHeight = el.scrollHeight + 'px'; el.style.opacity = '1'; }
  function slideClose(el){ el.style.maxHeight = '0px'; el.style.opacity = '0'; }

  function openContact() {
    section.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    card.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      bridge.classList.add('grow');
      setTimeout(() => { card.classList.add('revealed'); slideOpen(card); }, 220);
    });
  }

  function closeContact() {
    card.classList.remove('revealed'); slideClose(card);
    setTimeout(() => {
      bridge.classList.remove('grow');
      section.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-hidden', 'true');
    }, 320);
  }

  function initContactToggle() {
    if (!toggle || !section || !card || !bridge) return;
    toggle.addEventListener('click', () => {
      section.classList.contains('open') ? closeContact() : openContact();
    });

    // Keep height correct after resize
    window.addEventListener('resize', () => {
      if (section.classList.contains('open')) card.style.maxHeight = 'none';
    });

    // After expansion, let content grow naturally
    card.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'max-height' && section.classList.contains('open')) {
        card.style.maxHeight = 'none';
      }
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {  initContactToggle(); });
  } else {
    initContactToggle();
  }
})();

/* ==========================================================
   CONTACT: Asteroid Belt (Canvas) — v3.1
   - Transparent, blends into page (feathered edges), never blocks clicks
   - True elliptical orbits centered on the Contact button
   - Many small asteroids with neon aura + short smoky tails
   - Variety: paths / sizes / shapes / directions / slower speeds
   - Soft elliptical “hole” over the button (no overlap)
   - Fades out + pauses when .contact-section has .open; resumes on close
   ========================================================== */
(function setupAsteroidBelt(){
  const pill    = document.querySelector('.contact-pill');
  const section = document.querySelector('.contact-section');
  if (!pill || !section) return;

  // ---------- Config ----------
  const DPR_CAP         = 2;         // clamp DPR for perf
  const BELT_COUNT      = 36;        // number of asteroids
  const SPEED_MIN       = 0.06;      // rad/s
  const SPEED_MAX       = 0.14;
  const ECC_MIN         = 0.12;      // eccentricity (0=circle)
  const ECC_MAX         = 0.55;
  const TAIL_MIN        = 16;        // trail samples
  const TAIL_MAX        = 34;
  const BODY_MIN        = 1.8;       // px (pre-DPR)
  const BODY_MAX        = 3.8;
  const TILT_RANGE_DEG  = 30;        // ± tilt of orbital plane
  const PERSPECTIVE_Y   = 0.92;      // vertical compress for “3D”
  // ----------------------------

  // Create canvas anchored to the pill (around it)
  const canvas = document.createElement('canvas');
  canvas.className = 'orbit-canvas';
  pill.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const DPR   = Math.max(1, Math.min(DPR_CAP, window.devicePixelRatio || 1));
  const orbit = { cx: 0, cy: 0 };

  // Clearance so nothing draws over the button
  let minClearRadius = 0;   // device px
  let pillW_px = 0, pillH_px = 0;

  function resizeCanvas(){
    const pillRect = pill.getBoundingClientRect();

    // Halo size scales with button size
    const pad = Math.max(140, Math.min(260, Math.floor(Math.max(pillRect.width, pillRect.height)*0.85)));
    const w = Math.floor(pillRect.width  + pad*2);
    const h = Math.floor(pillRect.height + pad*2);

    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width  = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);

    orbit.cx = canvas.width  / 2;
    orbit.cy = canvas.height / 2;

    pillW_px = pillRect.width  * DPR;
    pillH_px = pillRect.height * DPR;

    // Soft “no-fly” hole will be punched; this is a safety radius for paths
    const halfDiag = Math.sqrt(pillW_px*pillW_px + pillH_px*pillH_px) / 2;
    minClearRadius = halfDiag * 0.70 + 12 * DPR;
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  // Tiny irregular polygon rock
  function makeRock(radius){
    const pts = [];
    const n = 6 + Math.floor(Math.random()*4); // 6..9 vertices
    for(let i=0;i<n;i++){
      const ang = (i/n)*Math.PI*2;
      const r = radius * (0.75 + Math.random()*0.5);
      pts.push({ x: Math.cos(ang)*r, y: Math.sin(ang)*r });
    }
    return pts;
  }

  // Per-asteroid orbit (true ellipse)
  function makeOrbit(){
    // Periapsis outside the hole, then spread to a ring
    const baseMin = minClearRadius + rand(10, 60)*DPR;
    const a = baseMin + rand(40, 160)*DPR;       // semi-major
    const e = rand(ECC_MIN, ECC_MAX);            // eccentricity
    const b = a * Math.sqrt(1 - e*e);            // semi-minor
    const tilt = (rand(-TILT_RANGE_DEG, TILT_RANGE_DEG) * Math.PI/180);
    const dir  = Math.random() < 0.5 ? -1 : 1;   // CW/CCW
    const w    = rand(SPEED_MIN, SPEED_MAX) * dir; // angular speed (slow)
    const precession = rand(-0.03, 0.03);        // slow wobble
    return { a, b, e, tilt, w, precession };
  }

  function createAsteroid(){
    const bodyRadius = rand(BODY_MIN, BODY_MAX) * DPR;
    const verts      = makeRock(bodyRadius);
    const orb        = makeOrbit();
    const trailCap   = Math.floor(rand(TAIL_MIN, TAIL_MAX));
    const trail      = new Array(trailCap).fill(null);
    const theta0     = Math.random()*Math.PI*2;
    const color      = { r:45, g:212, b:191 };   // emerald
    const flickerAmp = rand(0.06, 0.18);

    return {
      bodyRadius, verts, orbit: orb, trail,
      theta: theta0, phase: Math.random()*Math.PI*2,
      color, flickerAmp
    };
  }

  const belt = [];
  function seedBelt(){
    belt.length = 0;
    for(let i=0;i<BELT_COUNT;i++) belt.push(createAsteroid());
  }

  // r(θ) = a(1 - e^2) / (1 + e cos θ), with tilt + perspective
  function ellipsePos(theta, orb, tSec){
    const { a, b, e, tilt, precession } = orb;
    const pre = precession * tSec;
    const r   = (a * (1 - e*e)) / (1 + e * Math.cos(theta));

    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta) * (b/a);

    // Keep outside “hole”
    const rad = Math.hypot(x, y);
    if (rad < minClearRadius){
      const s = (minClearRadius + 6*DPR) / Math.max(1, rad);
      x *= s; y *= s;
    }

    // Tilt + gentle precession
    const rot = tilt + pre;
    const ct = Math.cos(rot), st = Math.sin(rot);
    const rx = x*ct - y*st;
    const ry = x*st + y*ct;

    // Perspective for 3D feel
    const ryp = ry * PERSPECTIVE_Y;

    // Depth for painter’s order
    const depth = (ry + b) / (2*b);

    // Keep inside canvas bounds (visual clip is section)
    const margin = 6 * DPR;
    const maxX = (canvas.width/2) - margin;
    const maxY = (canvas.height/2) - margin;
    const cx = Math.max(-maxX, Math.min(maxX, rx));
    const cy = Math.max(-maxY, Math.min(maxY, ryp));

    return { x: orbit.cx + cx, y: orbit.cy + cy, depth };
  }

  // Draw short smoky tail (head → outward)
  function drawTail(a){
    const { r,g,b } = a.color;
    const t = a.trail;
    if(!t[0] || !t[1]) return;

    for(let i=1;i<t.length;i++){
      const head = t[i-1], seg = t[i];
      if(!head || !seg) continue;

      const dx = seg.x - head.x, dy = seg.y - head.y;
      const dist = Math.hypot(dx, dy); if(dist < 0.3) continue;

      const tx = dx/dist, ty = dy/dist;         // tangent
      const px = -ty,     py = tx;              // normal

      const k = 1 - (i / t.length);             // 1 near head → 0 at end
      const base = a.bodyRadius * 0.9;

      const wCore  = Math.max(0.5, base * (k*k));
      const wSmoke = Math.max(0.9, base * 1.8 * k);
      const aCore  = 0.20 * Math.pow(k, 0.60);
      const aSmoke = 0.12 * Math.pow(k, 0.78);

      // Gentle wave, larger near the end
      const wave = Math.sin((i*0.23) + a.theta*0.9) * (1.2 + 4.5*(1-k));
      const ox = px * wave, oy = py * wave;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      // Core filament
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${aCore})`;
      ctx.lineWidth = wCore;
      ctx.beginPath();
      ctx.moveTo(head.x + ox, head.y + oy);
      ctx.lineTo(seg.x  + ox, seg.y  + oy);
      ctx.stroke();

      // Soft smoky envelope
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${aSmoke})`;
      ctx.lineWidth = wSmoke;
      ctx.beginPath();
      ctx.moveTo(head.x + ox*0.7, head.y + oy*0.7);
      ctx.lineTo(seg.x  + ox*0.7, seg.y  + oy*0.7);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Neon rocky body
  function drawBody(a, pos, tSec){
    const { r,g,b } = a.color;
    const flicker = 0.85 + a.flickerAmp * Math.sin(tSec*2.2 + a.phase);

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(0.9 + pos.depth*0.25, 0.9 + pos.depth*0.25);

    // Subtle neon aura
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const auraR = a.bodyRadius * 2.0;
    const aura = ctx.createRadialGradient(0,0,a.bodyRadius*0.3, 0,0,auraR);
    aura.addColorStop(0.00, `rgba(${r}, ${g}, ${b}, ${0.30*flicker})`);
    aura.addColorStop(1.00, `rgba(${r}, ${g}, ${b}, 0.02)`);
    ctx.fillStyle = aura;
    ctx.beginPath(); ctx.arc(0,0,auraR,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // Rocky fill with inner gradient
    const fill = ctx.createRadialGradient(0,0,a.bodyRadius*0.2, 0,0,a.bodyRadius*1.05);
    fill.addColorStop(0, `rgba(${(r*0.32)|0}, ${(g*0.45)|0}, ${(b*0.55)|0}, ${0.95*flicker})`);
    fill.addColorStop(1, `rgba(${(r*0.18)|0}, ${(g*0.26)|0}, ${(b*0.30)|0}, 0.95)`);
    ctx.fillStyle = fill;

    ctx.beginPath();
    ctx.moveTo(a.verts[0].x, a.verts[0].y);
    for(let i=1;i<a.verts.length;i++) ctx.lineTo(a.verts[i].x, a.verts[i].y);
    ctx.closePath();
    ctx.fill();

    // Neon rim
    ctx.lineWidth = 1 * DPR;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.40*flicker})`;
    ctx.stroke();

    ctx.restore();
  }

  // Soft elliptical hole over the pill (so nothing crosses the button)
  function punchCenterHole(){
    const rx = pillW_px/2, ry = pillH_px/2;
    const feather = 16 * DPR; // softness of the hole edge

    // Scale context so a circle becomes an ellipse
    ctx.save();
    ctx.translate(orbit.cx, orbit.cy);
    ctx.scale(rx, ry);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    // destination-out: 1 removes, 0 keeps
    grad.addColorStop(0.00, 'rgba(0,0,0,1)');
    grad.addColorStop(Math.min(1, feather/Math.max(rx,ry)), 'rgba(0,0,0,1)');
    grad.addColorStop(1.00, 'rgba(0,0,0,0)');

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Feather outer edges so there’s no rectangular “box” feel
  function featherEdges(){
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2;

    const fade = Math.max(32, Math.min(120, Math.floor(Math.max(w,h)*0.06)));

    ctx.save();
    const rMax = Math.hypot(cx, cy);
    const grad = ctx.createRadialGradient(cx, cy, Math.max(0, rMax - fade), cx, cy, rMax);
    // destination-in keeps alpha: 1 keep → 0 discard
    grad.addColorStop(0.00, 'rgba(0,0,0,1)');
    grad.addColorStop(1.00, 'rgba(0,0,0,0)');

    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);
    ctx.restore();
  }

  // Animation + pause when section opens
  let last = performance.now();
  let paused = section.classList.contains('open');

  // Auto-sync with any code that toggles the form
  const mo = new MutationObserver(()=> {
    paused = section.classList.contains('open');
  });
  mo.observe(section, { attributes:true, attributeFilter:['class'] });

  function frame(now){
    requestAnimationFrame(frame);
    let dt = Math.min(0.05, (now - last)/1000);
    last = now;
    if (paused) dt = 0;

    ctx.clearRect(0,0,canvas.width, canvas.height);

    const tSec = now/1000;
    const ordered = [];

    for(const a of belt){
      a.theta += (a.orbit.w + a.orbit.precession*0.15) * dt;
      const pos = ellipsePos(a.theta, a.orbit, tSec);

      // Head first so tail “sticks” to asteroid
      a.trail.unshift({ x: pos.x, y: pos.y });
      if (a.trail.length > (a.trail.capacity || a.trail.length)) a.trail.pop();
      if (!a.trail.capacity) a.trail.capacity = a.trail.length;

      ordered.push({ a, pos });
    }

    // Painter’s order: far → near
    ordered.sort((p,q)=> p.pos.depth - q.pos.depth);

    // Draw tails then bodies
    for(const { a } of ordered)        drawTail(a);
    for(const { a, pos } of ordered)   drawBody(a, pos, tSec);

    // Soft hole over button, then dissolve canvas edges
    punchCenterHole();
    featherEdges();
  }

  // Mount + resize
  const ro = new ResizeObserver(()=>{
    resizeCanvas();
    seedBelt(); // rebuild ring distribution for new size
  });
  ro.observe(pill);
  window.addEventListener('resize', ()=>{ resizeCanvas(); seedBelt(); }, { passive:true });

  resizeCanvas();
  seedBelt();
  requestAnimationFrame(frame);
})();

