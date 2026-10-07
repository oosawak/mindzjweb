// ===== Procedural canvas textures =====
import * as THREE from 'three';
import { mulberry32, makeNoise2D } from './util.js';

function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function tex(c, repeat = true, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

function noiseFill(ctx, w, h, base, amp, seed, scale = 1) {
  const img = ctx.getImageData(0, 0, w, h);
  const rnd = mulberry32(seed);
  const nz = makeNoise2D(seed);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const n = (rnd() - 0.5) * amp + nz(x / (18 * scale), y / (18 * scale)) * amp * 0.6;
    img.data[i] = Math.max(0, Math.min(255, base[0] + n));
    img.data[i + 1] = Math.max(0, Math.min(255, base[1] + n));
    img.data[i + 2] = Math.max(0, Math.min(255, base[2] + n));
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

export function asphaltTexture() {
  const c = canvas(512, 512), ctx = c.getContext('2d');
  noiseFill(ctx, 512, 512, [58, 58, 62], 26, 11);
  // patches / cracks
  const rnd = mulberry32(5);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${20 + rnd() * 30},${20 + rnd() * 30},${24 + rnd() * 30},${0.08 + rnd() * 0.12})`;
    ctx.beginPath(); ctx.ellipse(rnd() * 512, rnd() * 512, 20 + rnd() * 70, 10 + rnd() * 40, rnd() * 3, 0, 7); ctx.fill();
  }
  ctx.strokeStyle = 'rgba(15,15,15,0.35)'; ctx.lineWidth = 1;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath(); let x = rnd() * 512, y = rnd() * 512; ctx.moveTo(x, y);
    for (let k = 0; k < 8; k++) { x += (rnd() - 0.5) * 40; y += (rnd() - 0.5) * 40; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  return tex(c);
}

// Highway / connector texture. u across road, v along.
export function roadTexture(lanesPerDir, highway) {
  const W = 512, H = 1024;
  const c = canvas(W, H), ctx = c.getContext('2d');
  noiseFill(ctx, W, H, [52, 52, 56], 24, 21);
  // tire wear darker bands
  const laneW = (W * 0.86) / (lanesPerDir * 2);
  const x0 = W * 0.07;
  for (let l = 0; l < lanesPerDir * 2; l++) {
    for (const f of [0.28, 0.72]) {
      const g = ctx.createLinearGradient(x0 + laneW * (l + f) - 14, 0, x0 + laneW * (l + f) + 14, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, 'rgba(10,10,12,0.28)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(x0 + laneW * (l + f) - 14, 0, 28, H);
    }
  }
  // edge lines
  ctx.fillStyle = '#e8e8e0';
  ctx.fillRect(x0 - 8, 0, 7, H); ctx.fillRect(W - x0 + 1, 0, 7, H);
  // center double yellow
  ctx.fillStyle = '#e0b020';
  ctx.fillRect(W / 2 - 9, 0, 6, H); ctx.fillRect(W / 2 + 3, 0, 6, H);
  // dashed lane lines
  ctx.fillStyle = '#e8e8e0';
  for (let l = 1; l < lanesPerDir * 2; l++) {
    if (l === lanesPerDir) continue;
    const x = x0 + laneW * l;
    for (let y = 0; y < H; y += 256) ctx.fillRect(x - 3, y, 6, 110);
  }
  // shoulder rumble strip
  if (highway) {
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let y = 0; y < H; y += 16) { ctx.fillRect(x0 - 26, y, 14, 8); ctx.fillRect(W - x0 + 12, y, 14, 8); }
  }
  // outside edge dirt
  ctx.fillStyle = 'rgba(70,62,50,0.9)';
  ctx.fillRect(0, 0, x0 - 30, H); ctx.fillRect(W - x0 + 30, 0, x0 - 30, H);
  const t = tex(c);
  return t;
}

export function grassDetailTexture() {
  const c = canvas(512, 512), ctx = c.getContext('2d');
  noiseFill(ctx, 512, 512, [150, 150, 150], 70, 31, 0.4);
  const t = tex(c, true, false);
  return t;
}

export function concreteTexture() {
  const c = canvas(256, 256), ctx = c.getContext('2d');
  noiseFill(ctx, 256, 256, [150, 148, 142], 22, 41);
  ctx.strokeStyle = 'rgba(60,60,60,0.5)'; ctx.lineWidth = 2;
  for (let i = 0; i <= 256; i += 64) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke(); }
  return tex(c);
}

export function waterNormalTexture() {
  const S = 256;
  const c = canvas(S, S), ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  const nz = makeNoise2D(99);
  const hgt = (x, y) => {
    // tileable by sampling on torus-ish via sin/cos combos
    const a = (x / S) * Math.PI * 2, b = (y / S) * Math.PI * 2;
    return nz(Math.cos(a) * 2 + 10, Math.sin(a) * 2 + Math.cos(b) * 2) * 0.6 + nz(Math.cos(a) * 5, Math.sin(b) * 5 + Math.sin(a)) * 0.3 + nz(Math.sin(b) * 9 + 3, Math.cos(a) * 9) * 0.15;
  };
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = hgt(x + 1, y) - hgt(x - 1, y), dy = hgt(x, y + 1) - hgt(x, y - 1);
    const nx = -dx * 4, ny = -dy * 4, nzv = 1; const l = Math.hypot(nx, ny, nzv);
    const i = (y * S + x) * 4;
    img.data[i] = ((nx / l) * 0.5 + 0.5) * 255; img.data[i + 1] = ((ny / l) * 0.5 + 0.5) * 255; img.data[i + 2] = ((nzv / l) * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return tex(c, true, false);
}

export function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 128) {
  const c = canvas(size, size), ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner); g.addColorStop(0.25, inner.replace(/[\d.]+\)$/, '0.5)')); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  return tex(c, false, true);
}

export function smokeTexture() {
  const S = 128; const c = canvas(S, S), ctx = c.getContext('2d');
  const img = ctx.createImageData(S, S);
  const nz = makeNoise2D(7);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = (x - S / 2) / (S / 2), dy = (y - S / 2) / (S / 2);
    const r = Math.sqrt(dx * dx + dy * dy);
    const n = nz(x / 20, y / 20) * 0.5 + nz(x / 9, y / 9) * 0.25;
    const a = Math.max(0, 1 - r) ** 1.5 * (0.7 + n);
    const i = (y * S + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = Math.max(0, Math.min(255, a * 255));
  }
  ctx.putImageData(img, 0, 0);
  return tex(c, false, true);
}

export function textTexture(text, opts = {}) {
  const { w = 512, h = 128, bg = '#0b5d2a', fg = '#fff', font = 'bold 64px Arial', border = true, sub = null } = opts;
  const c = canvas(w, h), ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  if (border) { ctx.strokeStyle = fg; ctx.lineWidth = 6; ctx.strokeRect(8, 8, w - 16, h - 16); }
  ctx.fillStyle = fg; ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, sub ? h * 0.38 : h / 2);
  if (sub) { ctx.font = 'bold 34px Arial'; ctx.fillText(sub, w / 2, h * 0.75); }
  return tex(c, false, true);
}
