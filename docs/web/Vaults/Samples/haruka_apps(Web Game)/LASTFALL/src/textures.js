// 手続き型テクスチャ生成（Canvas）
import * as THREE from 'three';
import { makeNoise2D, fbm, mulberry32 } from './util.js';

const cache = {};
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function toTex(c, repeat = true, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8; t.generateMipmaps = true;
  return t;
}
// 高さ（グレースケール）Canvasから法線マップ生成
function normalFrom(hc, strength = 2) {
  const w = hc.width, h = hc.height;
  const src = hc.getContext('2d').getImageData(0, 0, w, h).data;
  const [c, g] = mk(w, h);
  const img = g.createImageData(w, h); const d = img.data;
  const H = (x, y) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H(x - 1, y) - H(x + 1, y)) * strength, dy = (H(x, y - 1) - H(x, y + 1)) * strength;
    const l = Math.hypot(dx, dy, 1);
    const i = (y * w + x) * 4;
    d[i] = (dx / l * 0.5 + 0.5) * 255; d[i + 1] = (dy / l * 0.5 + 0.5) * 255; d[i + 2] = (1 / l * 0.5 + 0.5) * 255; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return toTex(c, true, false);
}
// タイル可能な値ノイズ（周期境界）
function hash2(i, j, seed) {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function pnoise(x, y, period, seed) {
  const xi = Math.floor(x), yi = Math.floor(y); const xf = x - xi, yf = y - yi;
  const w = (v) => ((v % period) + period) % period;
  const a = hash2(w(xi), w(yi), seed), b = hash2(w(xi + 1), w(yi), seed), c = hash2(w(xi), w(yi + 1), seed), d = hash2(w(xi + 1), w(yi + 1), seed);
  const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function noiseCanvas(w, h, seed, scale, oct, fn) {
  const [c, g] = mk(w, h);
  const img = g.createImageData(w, h); const d = img.data;
  const base = Math.max(2, Math.round(scale * 2));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0, amp = 1, n = 0, f = base;
    for (let o = 0; o < oct; o++) { s += amp * pnoise((x / w) * f, (y / h) * f, f, seed + o * 17); n += amp; amp *= 0.5; f *= 2; }
    const v = Math.min(1, Math.max(0, (s / n - 0.5) * 1.8 + 0.5));
    const [r, gg, bb] = fn(v, x, y);
    const i = (y * w + x) * 4; d[i] = r; d[i + 1] = gg; d[i + 2] = bb; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}

export function tex(name) {
  if (cache[name]) return cache[name];
  let res;
  switch (name) {
    case 'detail': { // 地形用ディテール
      const c = noiseCanvas(256, 256, 7, 2.5, 5, (v) => { const k = 150 + v * 105; return [k, k, k]; });
      res = { map: toTex(c), normal: normalFrom(c, 3) }; break;
    }
    case 'concrete': {
      const c = noiseCanvas(256, 256, 11, 3, 5, (v, x, y) => { const k = 150 + v * 60 + (Math.random() * 14 - 7); return [k, k * 0.99, k * 0.96]; });
      const g = c.getContext('2d'); g.strokeStyle = 'rgba(40,40,40,0.35)'; g.lineWidth = 2; g.strokeRect(0, 0, 256, 256);
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(60,55,50,${Math.random() * 0.12})`; g.beginPath(); g.arc(Math.random() * 256, Math.random() * 256, Math.random() * 20, 0, 7); g.fill(); }
      res = { map: toTex(c), normal: normalFrom(c, 1.5) }; break;
    }
    case 'plaster': {
      const c = noiseCanvas(256, 256, 21, 4, 5, (v) => { const k = v; return [190 + k * 50, 160 + k * 45, 120 + k * 40]; });
      const g = c.getContext('2d');
      for (let i = 0; i < 25; i++) { g.fillStyle = `rgba(120,90,60,${Math.random() * 0.15})`; g.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 60, Math.random() * 30); }
      res = { map: toTex(c), normal: normalFrom(c, 2.5) }; break;
    }
    case 'brick': {
      const [c, g] = mk(256, 256);
      g.fillStyle = '#5a4a40'; g.fillRect(0, 0, 256, 256);
      const r = mulberry32(3);
      for (let row = 0; row < 16; row++) for (let col = 0; col < 5; col++) {
        const off = row % 2 ? 25 : 0; const x = col * 51 + off, y = row * 16;
        const k = 0.75 + r() * 0.35;
        g.fillStyle = `rgb(${130 * k | 0},${62 * k | 0},${45 * k | 0})`; g.fillRect(x + 1, y + 1, 48, 13);
        if (x + 49 > 256) g.fillRect(x - 256 + 1, y + 1, 48, 13);
      }
      const n = noiseCanvas(256, 256, 5, 5, 4, (v) => { const k = v * 255; return [k, k, k]; });
      g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.5; g.drawImage(n, 0, 0);
      const [hc, hg] = mk(256, 256); hg.fillStyle = '#000'; hg.fillRect(0, 0, 256, 256); hg.fillStyle = '#fff';
      for (let row = 0; row < 16; row++) for (let col = 0; col < 6; col++) { const off = row % 2 ? 25 : 0; hg.fillRect(col * 51 + off - 51 + 2, row * 16 + 2, 46, 11); }
      res = { map: toTex(c), normal: normalFrom(hc, 4) }; break;
    }
    case 'wood': {
      const [c, g] = mk(256, 256);
      const r = mulberry32(9);
      for (let i = 0; i < 8; i++) {
        const k = 0.7 + r() * 0.4;
        g.fillStyle = `rgb(${110 * k | 0},${78 * k | 0},${50 * k | 0})`; g.fillRect(0, i * 32, 256, 31);
        for (let j = 0; j < 30; j++) { g.strokeStyle = `rgba(40,25,15,${r() * 0.3})`; g.beginPath(); const y = i * 32 + r() * 31; g.moveTo(0, y); g.bezierCurveTo(80, y + r() * 4 - 2, 160, y + r() * 4 - 2, 256, y); g.stroke(); }
        g.fillStyle = 'rgba(20,12,6,0.8)'; g.fillRect(0, i * 32 + 31, 256, 1);
      }
      const [hc, hg] = mk(256, 256); hg.fillStyle = '#fff'; hg.fillRect(0, 0, 256, 256); hg.fillStyle = '#000';
      for (let i = 0; i < 8; i++) hg.fillRect(0, i * 32 + 30, 256, 2);
      res = { map: toTex(c), normal: normalFrom(hc, 3) }; break;
    }
    case 'metal': { // 波板
      const [c, g] = mk(256, 256);
      const grd = g.createLinearGradient(0, 0, 32, 0);
      grd.addColorStop(0, '#888'); grd.addColorStop(0.5, '#ccc'); grd.addColorStop(1, '#888');
      for (let i = 0; i < 8; i++) { g.fillStyle = grd; g.save(); g.translate(i * 32, 0); g.fillRect(0, 0, 32, 256); g.restore(); }
      const n = noiseCanvas(256, 256, 13, 4, 5, (v) => [150 + v * 100, 110 + v * 60, 80 + v * 30]);
      g.globalCompositeOperation = 'multiply'; g.drawImage(n, 0, 0);
      const [hc, hg] = mk(256, 256);
      for (let x = 0; x < 256; x++) { const k = (Math.sin(x / 32 * Math.PI * 2) * 0.5 + 0.5) * 255; hg.fillStyle = `rgb(${k},${k},${k})`; hg.fillRect(x, 0, 1, 256); }
      res = { map: toTex(c), normal: normalFrom(hc, 1.5) }; break;
    }
    case 'asphalt': {
      const c = noiseCanvas(256, 256, 31, 8, 4, (v) => { const k = 40 + v * 35 + Math.random() * 25; return [k, k, k * 1.05]; });
      res = { map: toTex(c), normal: normalFrom(c, 2) }; break;
    }
    case 'roof': {
      const [c, g] = mk(256, 256);
      for (let r = 0; r < 8; r++) for (let q = 0; q < 8; q++) {
        const k = 0.7 + Math.random() * 0.3;
        g.fillStyle = `rgb(${90 * k | 0},${40 * k | 0},${32 * k | 0})`;
        g.fillRect(q * 32 + (r % 2) * 16, r * 32, 31, 30);
        g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(q * 32 + (r % 2) * 16, r * 32 + 24, 31, 6);
      }
      res = { map: toTex(c) }; break;
    }
    case 'bark': {
      const c = noiseCanvas(128, 256, 41, 3, 4, (v, x) => { const k = 50 + v * 50 + Math.sin(x * 0.4 + v * 8) * 12; return [k * 1.1, k * 0.85, k * 0.6]; });
      res = { map: toTex(c), normal: normalFrom(c, 4) }; break;
    }
    case 'flesh': { // モンスター皮膚（血管）
      const c = noiseCanvas(256, 256, 51, 3, 5, (v) => { const k = v; return [150 + k * 70, 120 + k * 50, 115 + k * 45]; });
      const g = c.getContext('2d'); const r = mulberry32(5);
      for (let i = 0; i < 45; i++) {
        g.strokeStyle = `rgba(${60 + r() * 60},${10 + r() * 20},${30 + r() * 40},${0.25 + r() * 0.35})`; g.lineWidth = 0.5 + r() * 2;
        g.beginPath(); let x = r() * 256, y = r() * 256; g.moveTo(x, y);
        for (let j = 0; j < 8; j++) { x += r() * 30 - 15; y += r() * 30 - 15; g.lineTo(x, y); } g.stroke();
      }
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(90,10,10,${r() * 0.35})`; g.beginPath(); g.arc(r() * 256, r() * 256, r() * 12, 0, 7); g.fill(); }
      res = { map: toTex(c), normal: normalFrom(c, 5) }; break;
    }
    case 'fabric': {
      const c = noiseCanvas(128, 128, 61, 6, 3, (v, x, y) => { const k = 180 + v * 50 + ((x + y) % 4 < 2 ? 12 : -12); return [k, k, k]; });
      res = { map: toTex(c), normal: normalFrom(c, 1.2) }; break;
    }
    case 'container': {
      const [c, g] = mk(256, 256);
      g.fillStyle = '#bbb'; g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#999' : '#d0d0d0'; g.fillRect(i * 16, 0, 10, 256); }
      const n = noiseCanvas(256, 256, 71, 5, 5, (v) => [200 + v * 55, 180 + v * 60, 160 + v * 70]);
      g.globalCompositeOperation = 'multiply'; g.drawImage(n, 0, 0);
      const [hc, hg] = mk(256, 256);
      for (let i = 0; i < 16; i++) { hg.fillStyle = '#fff'; hg.fillRect(i * 16, 0, 10, 256); hg.fillStyle = '#000'; hg.fillRect(i * 16 + 10, 0, 6, 256); }
      res = { map: toTex(c), normal: normalFrom(hc, 2) }; break;
    }
    case 'blood': { // 血痕デカール（4種・アトラス2x2）
      const [c, g] = mk(512, 512);
      const r = mulberry32(77);
      for (let k = 0; k < 4; k++) {
        const ox = (k % 2) * 256 + 128, oy = Math.floor(k / 2) * 256 + 128;
        const splat = (x, y, rad, a) => {
          const grd = g.createRadialGradient(x, y, 0, x, y, rad);
          grd.addColorStop(0, `rgba(70,0,0,${a})`); grd.addColorStop(0.6, `rgba(95,2,2,${a * 0.95})`); grd.addColorStop(1, 'rgba(90,0,0,0)');
          g.fillStyle = grd; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
        };
        splat(ox, oy, 45 + r() * 25, 0.95);
        for (let i = 0; i < 26; i++) {
          const a = r() * Math.PI * 2, d = 20 + r() * 90 * (k === 3 ? 0.6 : 1);
          const rad = 3 + r() * 16 * (1 - d / 130);
          splat(ox + Math.cos(a) * d, oy + Math.sin(a) * d, rad, 0.9);
          if (r() < 0.5) { g.strokeStyle = 'rgba(80,0,0,0.85)'; g.lineWidth = rad * 0.6; g.beginPath(); g.moveTo(ox + Math.cos(a) * 30, oy + Math.sin(a) * 30); g.lineTo(ox + Math.cos(a) * d, oy + Math.sin(a) * d); g.stroke(); }
        }
      }
      const t = toTex(c, false); res = { map: t }; break;
    }
    case 'bullethole': {
      const [c, g] = mk(64, 64);
      let grd = g.createRadialGradient(32, 32, 0, 32, 32, 30);
      grd.addColorStop(0, 'rgba(0,0,0,1)'); grd.addColorStop(0.18, 'rgba(10,8,6,1)'); grd.addColorStop(0.3, 'rgba(40,35,30,0.8)'); grd.addColorStop(1, 'rgba(60,55,50,0)');
      g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
      res = { map: toTex(c, false) }; break;
    }
    case 'scorch': {
      const [c, g] = mk(128, 128);
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 62);
      grd.addColorStop(0, 'rgba(5,5,5,0.95)'); grd.addColorStop(0.5, 'rgba(15,12,10,0.7)'); grd.addColorStop(1, 'rgba(20,20,20,0)');
      g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
      res = { map: toTex(c, false) }; break;
    }
    case 'particles': { // パーティクルアトラス 2x2: 円, 煙, 血滴, 火花
      const [c, g] = mk(256, 256);
      let grd = g.createRadialGradient(64, 64, 0, 64, 64, 62); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.4, 'rgba(255,255,255,0.6)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
      const n = makeNoise2D(3);
      const img = g.createImageData(128, 128);
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        const dx = (x - 64) / 64, dy = (y - 64) / 64; const d = Math.hypot(dx, dy);
        const v = fbm(n, x / 24, y / 24, 4) * 0.5 + 0.5;
        const a = Math.max(0, 1 - d) * v * 1.6;
        const i = (y * 128 + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = Math.min(255, a * 255);
      }
      g.putImageData(img, 128, 0);
      // 血滴
      grd = g.createRadialGradient(64, 192, 0, 64, 192, 50); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.7, 'rgba(255,255,255,0.9)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(64, 192, 50, 0, 7); g.fill();
      for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(64 + Math.cos(i) * 40, 192 + Math.sin(i * 1.7) * 40, 8, 0, 7); g.fill(); }
      // 火花（縦長）
      grd = g.createRadialGradient(192, 192, 0, 192, 192, 60); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.2, 'rgba(255,255,255,0.8)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.save(); g.translate(192, 192); g.scale(0.35, 1); g.translate(-192, -192); g.beginPath(); g.arc(192, 192, 60, 0, 7); g.fill(); g.restore();
      res = { map: toTex(c, false) }; break;
    }
    case 'flash': { // マズルフラッシュ
      const [c, g] = mk(128, 128);
      g.translate(64, 64);
      for (let i = 0; i < 7; i++) {
        g.rotate(Math.PI * 2 / 7 + Math.random() * 0.3);
        const grd = g.createLinearGradient(0, 0, 60, 0); grd.addColorStop(0, 'rgba(255,240,200,1)'); grd.addColorStop(1, 'rgba(255,120,20,0)');
        g.fillStyle = grd; g.beginPath(); g.moveTo(0, -6); g.lineTo(55 + Math.random() * 8, 0); g.lineTo(0, 6); g.fill();
      }
      const grd = g.createRadialGradient(0, 0, 0, 0, 0, 30); grd.addColorStop(0, 'rgba(255,255,230,1)'); grd.addColorStop(1, 'rgba(255,160,40,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(0, 0, 30, 0, 7); g.fill();
      res = { map: toTex(c, false) }; break;
    }
    case 'glow': {
      const [c, g] = mk(64, 64);
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32); grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.3, 'rgba(255,255,255,0.4)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
      res = { map: toTex(c, false) }; break;
    }
    default: throw new Error('unknown tex ' + name);
  }
  cache[name] = res;
  return res;
}

// 迷彩テクスチャ
export function camoTex(colors, seed) {
  const key = 'camo' + colors.join() + seed;
  if (cache[key]) return cache[key];
  const n = makeNoise2D(seed);
  const [c, g] = mk(128, 128);
  const img = g.createImageData(128, 128);
  const cols = colors.map((h) => new THREE.Color(h));
  for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
    const a = (x / 128) * Math.PI * 2, b = (y / 128) * Math.PI * 2;
    const v = fbm(n, Math.cos(a) * 1.5 + Math.cos(b), Math.sin(a) * 1.5 + Math.sin(b) * 1.3, 3) * 0.5 + 0.5;
    const idx = Math.min(cols.length - 1, Math.floor(v * cols.length * 1.1));
    const col = cols[idx]; const k = 0.9 + Math.random() * 0.15;
    const i = (y * 128 + x) * 4;
    img.data[i] = col.r * 255 * k; img.data[i + 1] = col.g * 255 * k; img.data[i + 2] = col.b * 255 * k; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = toTex(c); t.colorSpace = THREE.SRGBColorSpace;
  cache[key] = t; return t;
}

// ネオン看板
export function neonTex(text, color, sub) {
  const [c, g] = mk(512, 192);
  g.fillStyle = '#050508'; g.fillRect(0, 0, 512, 192);
  g.strokeStyle = color; g.lineWidth = 6; g.shadowColor = color; g.shadowBlur = 25; g.strokeRect(12, 12, 488, 168);
  g.font = 'bold 84px "Hiragino Sans", "Yu Gothic", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#fff'; g.shadowBlur = 30; g.fillText(text, 256, sub ? 82 : 96);
  g.fillStyle = color; g.shadowBlur = 10; g.fillText(text, 256, sub ? 82 : 96);
  if (sub) { g.font = 'bold 30px sans-serif'; g.fillStyle = color; g.fillText(sub, 256, 150); }
  return toTex(c, false);
}
// 距離看板
export function signTex(text, bg = '#d8b020', fg = '#111') {
  const [c, g] = mk(256, 128);
  g.fillStyle = bg; g.fillRect(0, 0, 256, 128);
  g.fillStyle = fg; g.font = 'bold 64px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 128, 66);
  g.strokeStyle = fg; g.lineWidth = 6; g.strokeRect(6, 6, 244, 116);
  return toTex(c, false);
}
// 射撃ターゲット
export function targetTex() {
  if (cache.target) return cache.target;
  const [c, g] = mk(256, 256);
  g.fillStyle = '#eee'; g.fillRect(0, 0, 256, 256);
  for (let i = 5; i > 0; i--) { g.fillStyle = i % 2 ? '#c22' : '#eee'; g.beginPath(); g.arc(128, 128, i * 24, 0, 7); g.fill(); }
  g.fillStyle = '#111'; g.beginPath(); g.arc(128, 128, 8, 0, 7); g.fill();
  cache.target = toTex(c, false); return cache.target;
}
