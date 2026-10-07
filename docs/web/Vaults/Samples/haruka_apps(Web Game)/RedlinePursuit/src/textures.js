// ===== Terrain height model =====
import { makeNoise2D, fbm, smoothstep, lerp, clamp } from './util.js';

export const WORLD_HALF = 2000;
export const CITY_HALF = 600;
export const STREET_SPACING = 120;
export const STREET_HALF_W = 10;
export const WATER_LEVEL = -1.5;
export const HF_N = 400; // cells per side
export const HF_CELL = (WORLD_HALF * 2) / HF_N;

const n1 = makeNoise2D(1337);
const n2 = makeNoise2D(4242);
const n3 = makeNoise2D(777);

export function rawHeight(x, z) {
  const dCity = Math.max(Math.abs(x), Math.abs(z));
  const mask = smoothstep(680, 1050, dCity);
  let h = (fbm(n1, x / 750, z / 750, 4) * 60 + 22 + fbm(n2, x / 210, z / 210, 3) * 9) * mask;
  // mountains on west/north/south borders
  const e = Math.max(-x, Math.abs(z));
  const eastFade = 1 - smoothstep(1250, 1600, x);
  const me = smoothstep(1580, 2050, e) * eastFade;
  h += me * (200 + 140 * fbm(n3, x / 260, z / 260, 4));
  // ocean to the east
  const coast = x + 45 * Math.sin(z / 170) + 25 * Math.sin(z / 61);
  const o = smoothstep(1510, 1720, coast);
  h = lerp(h, -28, o);
  return h;
}

// Heightfield with road flattening. Built once.
export class HeightField {
  constructor() {
    this.n = HF_N + 1;
    this.data = new Float32Array(this.n * this.n);
    this.rd = new Float32Array(this.n * this.n).fill(999); // distance from nearest road edge
  }
  roadDist(x, z) {
    const n = this.n;
    let fx = (x + WORLD_HALF) / HF_CELL, fz = (z + WORLD_HALF) / HF_CELL;
    fx = clamp(fx, 0, n - 1.001); fz = clamp(fz, 0, n - 1.001);
    const i = Math.floor(fx), j = Math.floor(fz), tx = fx - i, tz = fz - j;
    const d = this.rd;
    const a = d[j * n + i], b = d[j * n + i + 1], c = d[(j + 1) * n + i], e = d[(j + 1) * n + i + 1];
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + e * tx) * tz;
  }
  // true if position is on paved surface
  onRoad(x, z) {
    if (Math.abs(x) < 612 && Math.abs(z) < 612) return true;
    return this.roadDist(x, z) < 0.5;
  }
  build(roads) {
    const n = this.n;
    // spatial hash of road segments
    const CS = 64;
    const grid = new Map();
    const key = (i, j) => i * 100003 + j;
    for (const r of roads) {
      const pts = r.pts;
      const segN = r.closed ? pts.length : pts.length - 1;
      for (let s = 0; s < segN; s++) {
        const a = pts[s], b = pts[(s + 1) % pts.length];
        const minx = Math.floor((Math.min(a.x, b.x) - 50) / CS), maxx = Math.floor((Math.max(a.x, b.x) + 50) / CS);
        const minz = Math.floor((Math.min(a.z, b.z) - 50) / CS), maxz = Math.floor((Math.max(a.z, b.z) + 50) / CS);
        for (let i = minx; i <= maxx; i++) for (let j = minz; j <= maxz; j++) {
          const k = key(i, j);
          let arr = grid.get(k); if (!arr) grid.set(k, (arr = []));
          arr.push({ a, b, hw: r.halfW });
        }
      }
    }
    for (let j = 0; j < n; j++) {
      const z = -WORLD_HALF + j * HF_CELL;
      for (let i = 0; i < n; i++) {
        const x = -WORLD_HALF + i * HF_CELL;
        let h = rawHeight(x, z);
        const arr = grid.get(key(Math.floor(x / CS), Math.floor(z / CS)));
        if (arr) {
          let best = 1e9, bh = 0, bhw = 10;
          for (const s of arr) {
            const dx = s.b.x - s.a.x, dz = s.b.z - s.a.z;
            const l2 = dx * dx + dz * dz || 1e-6;
            let t = ((x - s.a.x) * dx + (z - s.a.z) * dz) / l2; t = clamp(t, 0, 1);
            const cx = s.a.x + dx * t, cz = s.a.z + dz * t;
            const d = Math.hypot(x - cx, z - cz) - s.hw;
            if (d < best) { best = d; bh = lerp(s.a.h, s.b.h, t); bhw = s.hw; }
          }
          this.rd[j * n + i] = Math.min(best, 999);
          if (best < 42) {
            const w = smoothstep(2, 42, best);
            h = lerp(bh - 0.05, h, w);
          }
        }
        this.data[j * n + i] = h;
      }
    }
  }
  get(x, z) {
    const n = this.n;
    let fx = (x + WORLD_HALF) / HF_CELL, fz = (z + WORLD_HALF) / HF_CELL;
    fx = clamp(fx, 0, n - 1.001); fz = clamp(fz, 0, n - 1.001);
    const i = Math.floor(fx), j = Math.floor(fz);
    const tx = fx - i, tz = fz - j;
    const d = this.data;
    // match triangle interpolation used by PlaneGeometry (diagonal split)
    const h00 = d[j * n + i], h10 = d[j * n + i + 1], h01 = d[(j + 1) * n + i], h11 = d[(j + 1) * n + i + 1];
    if (tx + tz <= 1) return h00 + (h10 - h00) * tx + (h01 - h00) * tz;
    return h11 + (h01 - h11) * (1 - tx) + (h10 - h11) * (1 - tz);
  }
  normal(x, z, out) {
    const e = 2;
    const hx = this.get(x + e, z) - this.get(x - e, z);
    const hz = this.get(x, z + e) - this.get(x, z - e);
    out.set(-hx, 2 * e, -hz).normalize();
    return out;
  }
}
