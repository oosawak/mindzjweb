// =========================================================
// Textures — 画像ファイルを使わず、コードで生成するテクスチャ
// =========================================================
import * as THREE from 'three';

const cache = new Map();

function canvasTexture(key, size, draw) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

/** ふんわり光る円 */
export function glowTexture() {
  return canvasTexture('glow', 128, (g, s) => {
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    grd.addColorStop(0.6, 'rgba(255,255,255,0.12)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
  });
}

/** もくもく雲 */
export function cloudTexture() {
  return canvasTexture('cloud', 256, (g, s) => {
    const puffs = [
      [0.5, 0.58, 0.3], [0.32, 0.62, 0.22], [0.68, 0.62, 0.22], [0.42, 0.45, 0.22], [0.6, 0.46, 0.2], [0.2, 0.68, 0.14], [0.8, 0.68, 0.14],
    ];
    for (const [x, y, r] of puffs) {
      const grd = g.createRadialGradient(x * s, y * s, 0, x * s, y * s, r * s);
      grd.addColorStop(0, 'rgba(255,255,255,0.95)');
      grd.addColorStop(0.7, 'rgba(255,255,255,0.6)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(x * s, y * s, r * s, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** キラッと光る十字 */
export function sparkleTexture() {
  return canvasTexture('sparkle', 128, (g, s) => {
    const c = s / 2;
    const grd = g.createRadialGradient(c, c, 0, c, c, c * 0.5);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    g.globalCompositeOperation = 'lighter';
    for (const [w, h] of [[s, 6], [6, s]]) {
      const lg = w > h ? g.createLinearGradient(0, 0, s, 0) : g.createLinearGradient(0, 0, 0, s);
      lg.addColorStop(0, 'rgba(255,255,255,0)');
      lg.addColorStop(0.5, 'rgba(255,255,255,1)');
      lg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = lg;
      g.fillRect(c - w / 2, c - h / 2, w, h);
    }
  });
}
