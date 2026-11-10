// Small visual helpers: typing, shaking, toasts, confetti.
window.FX = (() => {
  'use strict';
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function type(el, text, speed = 22) {
    if (reduced) { el.textContent = text; return; }
    el.textContent = '';
    for (const ch of Array.from(text)) {
      el.textContent += ch;
      await sleep(ch === '.' || ch === '!' ? speed * 3 : speed);
    }
  }

  // lines: strings or { t, cls, pause }
  async function typeLines(container, lines, opts = {}) {
    for (const line of lines) {
      const o = typeof line === 'string' ? { t: line } : line;
      const p = document.createElement('p');
      if (o.cls) p.className = o.cls;
      container.appendChild(p);
      await type(p, o.t, opts.speed);
      await sleep(reduced ? 60 : (o.pause ?? opts.pause ?? 300));
    }
  }

  function shake(el) {
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }

  function vibrate(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch { /* ignore */ }
  }

  function toast(a, kind = 'ach') {
    const box = document.getElementById('toasts');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = a.icon || '🏆';
    const body = document.createElement('div');
    const head = document.createElement('small');
    head.textContent = kind === 'ach' ? 'TROFEU DEBLOCAT' : 'ALERTĂ DE SISTEM';
    const name = document.createElement('strong');
    name.textContent = a.name;
    const desc = document.createElement('span');
    desc.textContent = a.desc || '';
    body.append(head, name, desc);
    t.append(icon, body);
    box.appendChild(t);
    vibrate(30);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3400);
  }

  // ── Pixel confetti ────────────────────────────────────────
  const cv = document.getElementById('confetti');
  const ctx = cv ? cv.getContext('2d') : null;
  let parts = [];
  let running = false;

  function resize() {
    if (!cv) return;
    const d = window.devicePixelRatio || 1;
    cv.width = innerWidth * d;
    cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener('resize', resize);
  resize();

  function confetti({ count = 120, colors = ['#39ff88', '#ffc83d', '#ff5a36', '#ff4fd8', '#4fc3ff'] } = {}) {
    if (!ctx) return;
    if (reduced) count = Math.min(count, 25);
    for (let i = 0; i < count; i++) {
      parts.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.4,
        y: innerHeight * 0.4,
        vx: (Math.random() - 0.5) * 13,
        vy: -Math.random() * 13 - 4,
        s: 5 + Math.random() * 6,
        c: colors[i % colors.length],
        r: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.3,
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.33; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    }
    parts = parts.filter((p) => p.y < innerHeight + 30);
    if (parts.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  return { reduced, sleep, type, typeLines, shake, vibrate, toast, confetti };
})();
