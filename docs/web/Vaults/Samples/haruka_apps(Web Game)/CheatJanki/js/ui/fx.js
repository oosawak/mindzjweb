/* =========================================================
 *  演出: カットイン / 2Dパーティクル / 画面効果
 * ========================================================= */
(function (root) {
  'use strict';
  const FX = {};
  let cv, g, layer, W = 0, H = 0, dpr = 1;
  const parts = [];
  const lines = { t: 0, until: 0, color: '#fff' };
  let skipResolver = null;
  FX.lite = false;

  FX.init = function (canvas, rootEl) {
    cv = canvas; g = cv.getContext('2d'); layer = rootEl;
    resize(); root.addEventListener('resize', resize);
    layer.addEventListener('click', () => { if (skipResolver) skipResolver(); });
    requestAnimationFrame(loop);
  };
  function resize() {
    dpr = Math.min(2, root.devicePixelRatio || 1);
    W = root.innerWidth; H = root.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------------- 2Dパーティクル ---------------- */
  FX.confetti = function (count, colors) {
    colors = colors || ['#ff5fa2', '#ffd24d', '#6fd5ff', '#8b5cff', '#5fffa0', '#ffffff'];
    const n = FX.lite ? count / 3 : count;
    for (let i = 0; i < n; i++) parts.push({ k: 'conf', x: rnd(0, W), y: rnd(-H * 0.3, -10), vx: rnd(-60, 60), vy: rnd(80, 260), r: rnd(0, 6.28), vr: rnd(-8, 8), w: rnd(6, 12), h: rnd(10, 18), c: pick(colors), life: 0, max: rnd(3, 5) });
  };
  FX.sparkles = function (x, y, count, colors, speed) {
    colors = colors || ['#ffffff', '#ffe066', '#ff8fd0'];
    for (let i = 0; i < count; i++) { const a = rnd(0, 6.28), s = rnd(0.2, 1) * (speed || 400); parts.push({ k: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, size: rnd(4, 12), c: pick(colors), life: 0, max: rnd(0.5, 1.2), drag: 0.92 }); }
  };
  FX.firework = function (x, y, colors) {
    colors = colors || [pick(['#ff5fa2', '#ffd24d', '#6fd5ff', '#8b5cff', '#5fffa0'])];
    const n = FX.lite ? 30 : 70;
    for (let i = 0; i < n; i++) { const a = i / n * 6.28, s = rnd(220, 380); parts.push({ k: 'fw', x, y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, c: pick(colors), life: 0, max: rnd(1, 1.6), drag: 0.95 }); }
  };
  FX.fireworksShow = function (dur, colors) {
    const t0 = performance.now();
    const f = () => { if (performance.now() - t0 > dur * 1000) return; FX.firework(rnd(W * 0.15, W * 0.85), rnd(H * 0.12, H * 0.5), colors); setTimeout(f, rnd(180, 420)); };
    f();
  };
  FX.petals = function (count) {
    for (let i = 0; i < count; i++) parts.push({ k: 'petal', x: rnd(-50, W), y: rnd(-H, 0), vx: rnd(20, 80), vy: rnd(40, 110), r: rnd(0, 6.28), vr: rnd(-2, 2), size: rnd(6, 11), c: pick(['#ffc2d9', '#ffd9e8', '#ffffff']), life: 0, max: rnd(5, 8) });
  };
  FX.speedLines = function (dur, color) { lines.until = performance.now() + dur * 1000; lines.color = color || '#ffffff'; };

  function loop(ts) {
    const now = performance.now();
    const dt = Math.min(0.05, (now - (loop.last || now)) / 1000); loop.last = now;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    // 集中線
    if (now < lines.until) {
      g.save(); g.translate(W / 2, H / 2);
      g.strokeStyle = lines.color; g.globalAlpha = 0.55;
      const R = Math.hypot(W, H) / 2;
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * 6.28, r0 = rnd(R * 0.35, R * 0.7);
        g.lineWidth = rnd(1, 4);
        g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * R, Math.sin(a) * R); g.stroke();
      }
      g.restore();
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life += dt;
      if (p.life > p.max || p.y > H + 60) { parts.splice(i, 1); continue; }
      const k = p.life / p.max;
      if (p.k === 'conf') {
        p.vy += 30 * dt; p.x += (p.vx + Math.sin(p.life * 3 + i) * 40) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.scale(1, Math.cos(p.life * 6 + i));
        g.fillStyle = p.c; g.globalAlpha = k > 0.8 ? (1 - k) * 5 : 1;
        g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore();
      } else if (p.k === 'spark') {
        p.vx *= Math.pow(p.drag, dt * 60); p.vy *= Math.pow(p.drag, dt * 60); p.vy += 120 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        g.save(); g.globalAlpha = 1 - k; g.fillStyle = p.c; g.translate(p.x, p.y); g.rotate(p.life * 4);
        const s = p.size * (1 - k * 0.5);
        g.beginPath(); for (let q = 0; q < 8; q++) { const a = q / 8 * 6.28, r = q % 2 ? s * 0.28 : s; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill();
        g.restore();
      } else if (p.k === 'fw') {
        p.px = p.x; p.py = p.y;
        p.vx *= Math.pow(p.drag, dt * 60); p.vy *= Math.pow(p.drag, dt * 60); p.vy += 90 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        g.save(); g.globalAlpha = 1 - k; g.strokeStyle = p.c; g.lineWidth = 3; g.shadowColor = p.c; g.shadowBlur = 10;
        g.beginPath(); g.moveTo(p.px - p.vx * 0.04, p.py - p.vy * 0.04); g.lineTo(p.x, p.y); g.stroke(); g.restore();
      } else if (p.k === 'petal') {
        p.x += (p.vx + Math.sin(p.life * 2 + i) * 30) * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        g.save(); g.globalAlpha = Math.min(1, (1 - k) * 3); g.fillStyle = p.c; g.translate(p.x, p.y); g.rotate(p.r);
        g.beginPath(); g.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, 6.28); g.fill(); g.restore();
      }
    }
    requestAnimationFrame(loop);
  }

  /* ---------------- 画面効果 ---------------- */
  FX.flash = function (color, dur) {
    const d = document.createElement('div');
    d.className = 'fx-flash'; d.style.background = color || '#fff';
    d.style.animationDuration = (dur || 0.5) + 's';
    layer.appendChild(d);
    setTimeout(() => d.remove(), (dur || 0.5) * 1000 + 50);
  };
  FX.shakeScreen = function (el, amt) {
    el = el || document.body;
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
    el.style.setProperty('--shake', (amt || 10) + 'px');
    setTimeout(() => el.classList.remove('shake'), 600);
  };
  FX.floatText = function (x, y, text, color, big) {
    const d = document.createElement('div');
    d.className = 'fx-float' + (big ? ' big' : '');
    d.textContent = text; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.color = color || '#fff';
    layer.appendChild(d);
    setTimeout(() => d.remove(), 1800);
  };

  function wait(ms) {
    return new Promise(res => {
      const t = setTimeout(done, ms);
      function done() { clearTimeout(t); if (skipResolver === done) skipResolver = null; res(); }
      skipResolver = done;
    });
  }
  FX.wait = wait;

  function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  /**
   * キャラクターカットイン
   * o: { kind:'call'|'riichi'|'win'|'yakuman'|'banner'|'fever'|'stamp', char, art, text, sub, line, color, foil, names[] }
   */
  FX.cutIn = async function (o) {
    const color = o.color || (o.char && o.char.color) || '#ff5fa2';
    const S = root.Sound;
    const speed = FX.speed || 1;
    const T = (ms) => ms / speed;
    if (o.kind === 'call') {
      const d = el(`<div class="cutin ci-call" style="--c:${color}">
        <div class="ci-band"><div class="ci-stripes"></div>
          <img class="ci-art" src="${o.art}"><div class="ci-text">${esc(o.text)}</div></div></div>`);
      layer.appendChild(d);
      S && S.sfx('call');
      await wait(T(1000));
      d.remove();
      return;
    }
    if (o.kind === 'riichi') {
      const d = el(`<div class="cutin ci-riichi" style="--c:${color}">
        <div class="ci-dim"></div>
        <div class="ci-band"><div class="ci-stripes"></div></div>
        <img class="ci-art${o.foil ? ' foil' : ''}" src="${o.art}">
        <div class="ci-bigtext">${esc(o.text || 'リーチ')}</div>
        ${o.line ? `<div class="ci-bubble">${esc(o.line)}</div>` : ''}
      </div>`);
      layer.appendChild(d);
      S && S.sfx('riichi');
      FX.speedLines(0.9, color);
      await wait(T(1700));
      d.classList.add('out');
      await wait(T(250));
      d.remove();
      return;
    }
    if (o.kind === 'win') {
      const d = el(`<div class="cutin ci-win" style="--c:${color}">
        <div class="ci-rays"></div>
        <img class="ci-art${o.foil ? ' foil' : ''}" src="${o.art}">
        <div class="ci-wintext"><span>${esc(o.text)}</span></div>
        ${o.line ? `<div class="ci-bubble">${esc(o.line)}</div>` : ''}
      </div>`);
      FX.flash('#fff', 0.45);
      layer.appendChild(d);
      S && S.sfx('impact');
      FX.speedLines(0.6, '#fff');
      FX.sparkles(W * 0.5, H * 0.45, 80, ['#fff', '#ffe066', color], 700);
      setTimeout(() => FX.shakeScreen(document.getElementById('app'), 14), 250);
      await wait(T(2300));
      d.classList.add('out');
      await wait(T(300));
      d.remove();
      return;
    }
    if (o.kind === 'yakuman') {
      const names = o.names || [];
      const d = el(`<div class="cutin ci-yakuman" style="--c:${color}">
        <div class="ci-dark"></div>
        <div class="ci-rays rainbow"></div>
        <img class="ci-art${o.foil ? ' foil' : ''}" src="${o.art}">
        <div class="ci-ykanji"><span>役</span><span>満</span></div>
        <div class="ci-ynames">${names.map((nm, i) => `<div class="ci-yname" style="animation-delay:${(1.5 + i * 0.45) / speed}s">${esc(nm)}</div>`).join('')}</div>
        ${o.line ? `<div class="ci-bubble">${esc(o.line)}</div>` : ''}
      </div>`);
      layer.appendChild(d);
      S && S.sfx('thunder');
      FX.flash('#fff', 0.2);
      setTimeout(() => FX.flash('#b8f', 0.25), T(250));
      setTimeout(() => { FX.flash('#fff', 0.5); S && S.sfx('stamp'); FX.shakeScreen(document.getElementById('app'), 22); FX.sparkles(W / 2, H * 0.4, 160, ['#fff', '#ffe066', '#ff8fd0', '#8be9ff'], 900); }, T(900));
      setTimeout(() => { FX.fireworksShow(3.2); FX.confetti(260); }, T(1300));
      for (let i = 0; i < names.length; i++) setTimeout(() => S && S.sfx('stamp'), T(1500 + i * 450));
      await wait(T(4800));
      d.classList.add('out');
      await wait(T(350));
      d.remove();
      return;
    }
    if (o.kind === 'banner') {
      const d = el(`<div class="cutin ci-banner" style="--c:${color}"><div class="ci-bn-band"><div class="ci-bn-main">${esc(o.text)}</div><div class="ci-bn-sub">${esc(o.sub || '')}</div></div></div>`);
      layer.appendChild(d);
      S && S.sfx('whoosh');
      await wait(T(1400));
      d.remove();
      return;
    }
    if (o.kind === 'fever') {
      const d = el(`<div class="cutin ci-fever"><div class="ci-fv-title">役満チャンス！</div><div class="ci-fv-name">${esc(o.text)}</div><div class="ci-fv-sub">${esc(o.sub || '')}</div></div>`);
      layer.appendChild(d);
      S && S.sfx('fever');
      FX.sparkles(W / 2, H / 2, 90, ['#fff', '#ffe066', '#ff8fd0', '#8be9ff'], 600);
      await wait(T(1900));
      d.remove();
      return;
    }
    if (o.kind === 'stamp') {
      const d = el(`<div class="cutin ci-stamp" style="--c:${color}"><div class="ci-stamp-text">${esc(o.text)}</div>${o.sub ? `<div class="ci-stamp-sub">${esc(o.sub)}</div>` : ''}</div>`);
      layer.appendChild(d);
      S && S.sfx('stamp');
      await wait(T(1400));
      d.remove();
      return;
    }
  };

  root.FX = FX;
})(typeof window !== 'undefined' ? window : globalThis);
