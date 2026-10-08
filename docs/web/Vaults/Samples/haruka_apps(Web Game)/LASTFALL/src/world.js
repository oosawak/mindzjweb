// 衝突ワールド（AABB + 地形ハイトフィールド、グリッド加速）
export class World {
  constructor(size, heightFn, surfaceFn) {
    this.size = size; // 半径（-size..size）
    this.height = heightFn;
    this.surfaceFn = surfaceFn || (() => 'dirt');
    this.boxes = [];
    this.cell = 8;
    this.gw = Math.ceil((size * 2) / this.cell);
    this.grid = Array.from({ length: this.gw * this.gw }, () => []);
    this.stamp = 0;
    this.terrainMax = 60;
    this.waterLevel = -999;
  }
  addBox(x0, y0, z0, x1, y1, z1, mat = 'concrete', extra = null) {
    const b = { min: [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)], max: [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)], mat, s: 0, extra };
    this.boxes.push(b);
    this.forCells(b.min[0], b.min[2], b.max[0], b.max[2], (c) => c.push(b));
    return b;
  }
  forCells(x0, z0, x1, z1, fn) {
    const cs = this.cell, off = this.size, gw = this.gw;
    const a = Math.max(0, Math.floor((x0 + off) / cs)), b = Math.min(gw - 1, Math.floor((x1 + off) / cs));
    const c = Math.max(0, Math.floor((z0 + off) / cs)), d = Math.min(gw - 1, Math.floor((z1 + off) / cs));
    for (let i = a; i <= b; i++) for (let j = c; j <= d; j++) fn(this.grid[j * gw + i]);
  }
  query(x0, z0, x1, z1) {
    const st = ++this.stamp, out = [];
    this.forCells(x0, z0, x1, z1, (cell) => { for (const b of cell) if (b.s !== st) { b.s = st; out.push(b); } });
    return out;
  }
  // 足元の支持高さ
  groundAt(x, z, y, r = 0.3, step = 0.55) {
    let g = this.height(x, z);
    const rr = r * 0.8;
    const bs = this.query(x - rr, z - rr, x + rr, z + rr);
    let mat = null;
    for (const b of bs) {
      if (x + rr < b.min[0] || x - rr > b.max[0] || z + rr < b.min[2] || z - rr > b.max[2]) continue;
      const top = b.max[1];
      if (top <= y + step && top > g) { g = top; mat = b.mat; }
    }
    this._lastMat = mat;
    return g;
  }
  surfaceAt(x, z, y) {
    this.groundAt(x, z, y + 0.05, 0.3, 0.2);
    if (this._lastMat) return this._lastMat === 'concrete' ? 'concrete' : this._lastMat;
    if (this.height(x, z) < this.waterLevel) return 'water';
    return this.surfaceFn(x, z);
  }
  // 頭上の天井
  ceilingAt(x, z, y, r = 0.3) {
    let c = Infinity;
    const bs = this.query(x - r, z - r, x + r, z + r);
    for (const b of bs) {
      if (x + r * 0.7 < b.min[0] || x - r * 0.7 > b.max[0] || z + r * 0.7 < b.min[2] || z - r * 0.7 > b.max[2]) continue;
      if (b.min[1] >= y && b.min[1] < c) c = b.min[1];
    }
    return c;
  }
  // 円柱の水平押し出し
  collide(pos, r, h, step = 0.55) {
    let hit = false;
    for (let it = 0; it < 2; it++) {
      const bs = this.query(pos.x - r, pos.z - r, pos.x + r, pos.z + r);
      for (const b of bs) {
        if (b.max[1] <= pos.y + step || b.min[1] >= pos.y + h) continue;
        const cx = Math.max(b.min[0], Math.min(pos.x, b.max[0]));
        const cz = Math.max(b.min[2], Math.min(pos.z, b.max[2]));
        let dx = pos.x - cx, dz = pos.z - cz;
        const d2 = dx * dx + dz * dz;
        if (d2 >= r * r) continue;
        hit = true;
        if (d2 > 1e-8) {
          const d = Math.sqrt(d2), p = r - d;
          pos.x += (dx / d) * p; pos.z += (dz / d) * p;
        } else {
          // 中心が箱内: 最小貫通軸で押し出し
          const px0 = pos.x - b.min[0] + r, px1 = b.max[0] - pos.x + r, pz0 = pos.z - b.min[2] + r, pz1 = b.max[2] - pos.z + r;
          const m = Math.min(px0, px1, pz0, pz1);
          if (m === px0) pos.x -= px0; else if (m === px1) pos.x += px1; else if (m === pz0) pos.z -= pz0; else pos.z += pz1;
        }
      }
    }
    const lim = this.size - 2;
    if (pos.x < -lim) pos.x = -lim; if (pos.x > lim) pos.x = lim;
    if (pos.z < -lim) pos.z = -lim; if (pos.z > lim) pos.z = lim;
    return hit;
  }
  // 点を押し出す（ラグドール・破片用）: 戻り値 = 接地したか
  pushPoint(p, r) {
    let ground = false;
    const h = this.height(p.x, p.z);
    if (p.y < h + r) { p.y = h + r; ground = true; }
    const bs = this.query(p.x - r, p.z - r, p.x + r, p.z + r);
    for (const b of bs) {
      if (p.x + r < b.min[0] || p.x - r > b.max[0] || p.y + r < b.min[1] || p.y - r > b.max[1] || p.z + r < b.min[2] || p.z - r > b.max[2]) continue;
      const pen = [p.x + r - b.min[0], b.max[0] - p.x + r, p.y + r - b.min[1], b.max[1] - p.y + r, p.z + r - b.min[2], b.max[2] - p.z + r];
      let mi = 0; for (let i = 1; i < 6; i++) if (pen[i] < pen[mi]) mi = i;
      if (mi === 0) p.x -= pen[0]; else if (mi === 1) p.x += pen[1];
      else if (mi === 2) p.y -= pen[2]; else if (mi === 3) { p.y += pen[3]; ground = true; }
      else if (mi === 4) p.z -= pen[4]; else p.z += pen[5];
    }
    const lim = this.size - 1;
    p.x = Math.max(-lim, Math.min(lim, p.x)); p.z = Math.max(-lim, Math.min(lim, p.z));
    return ground;
  }
  // レイキャスト（d は正規化済み）
  raycast(o, d, maxD, opts = {}) {
    let best = maxD, hit = null;
    const cs = this.cell, off = this.size, gw = this.gw;
    let cx = Math.floor((o.x + off) / cs), cz = Math.floor((o.z + off) / cs);
    const sx = d.x > 0 ? 1 : -1, sz = d.z > 0 ? 1 : -1;
    const tdx = d.x !== 0 ? Math.abs(cs / d.x) : Infinity, tdz = d.z !== 0 ? Math.abs(cs / d.z) : Infinity;
    let tmx = d.x !== 0 ? (((cx + (d.x > 0 ? 1 : 0)) * cs - off) - o.x) / d.x : Infinity;
    let tmz = d.z !== 0 ? (((cz + (d.z > 0 ? 1 : 0)) * cs - off) - o.z) / d.z : Infinity;
    const st = ++this.stamp;
    let t = 0, guard = 0;
    const ix = 1 / d.x, iy = 1 / d.y, iz = 1 / d.z;
    while (t <= best && guard++ < 400) {
      if (cx >= 0 && cz >= 0 && cx < gw && cz < gw) {
        const cell = this.grid[cz * gw + cx];
        for (const b of cell) {
          if (b.s === st) continue; b.s = st;
          if (opts.ignoreFoliage && b.mat === 'foliage') continue;
          let t0x = (b.min[0] - o.x) * ix, t1x = (b.max[0] - o.x) * ix; if (t0x > t1x) { const q = t0x; t0x = t1x; t1x = q; }
          let t0y = (b.min[1] - o.y) * iy, t1y = (b.max[1] - o.y) * iy; if (t0y > t1y) { const q = t0y; t0y = t1y; t1y = q; }
          let t0z = (b.min[2] - o.z) * iz, t1z = (b.max[2] - o.z) * iz; if (t0z > t1z) { const q = t0z; t0z = t1z; t1z = q; }
          const tn = Math.max(t0x, t0y, t0z), tf = Math.min(t1x, t1y, t1z);
          if (tn <= tf && tf >= 0 && tn < best) {
            const tt = Math.max(0, tn);
            best = tt;
            let nx = 0, ny = 0, nz = 0;
            if (tn === t0x) nx = -Math.sign(d.x); else if (tn === t0y) ny = -Math.sign(d.y); else nz = -Math.sign(d.z);
            hit = { t: tt, nx, ny, nz, mat: b.mat, box: b };
          }
        }
      } else if ((cx < 0 && sx < 0) || (cx >= gw && sx > 0) || (cz < 0 && sz < 0) || (cz >= gw && sz > 0)) break;
      if (tmx < tmz) { t = tmx; tmx += tdx; cx += sx; } else { t = tmz; tmz += tdz; cz += sz; }
    }
    // 地形
    const th = this.rayTerrain(o, d, best);
    if (th !== null && th < best) {
      best = th;
      const px = o.x + d.x * th, pz = o.z + d.z * th;
      const e = 0.5, hL = this.height(px - e, pz), hR = this.height(px + e, pz), hD = this.height(px, pz - e), hU = this.height(px, pz + e);
      let nx = hL - hR, ny = 2 * e, nz = hD - hU; const l = Math.hypot(nx, ny, nz);
      hit = { t: th, nx: nx / l, ny: ny / l, nz: nz / l, mat: this.surfaceFn(px, pz), terrain: true };
    }
    if (hit) { hit.x = o.x + d.x * hit.t; hit.y = o.y + d.y * hit.t; hit.z = o.z + d.z * hit.t; }
    return hit;
  }
  rayTerrain(o, d, maxD) {
    let t = 0, prevT = 0;
    let px = o.x, py = o.y, pz = o.z;
    if (py < this.height(px, pz) - 0.05) return 0;
    for (let i = 0; i < 300 && t < maxD; i++) {
      const h = this.height(px, pz);
      const gap = py - h;
      if (gap < 0) {
        // 二分探索
        let a = prevT, b = t;
        for (let k = 0; k < 8; k++) { const m = (a + b) * 0.5; const qx = o.x + d.x * m, qy = o.y + d.y * m, qz = o.z + d.z * m; if (qy < this.height(qx, qz)) b = m; else a = m; }
        return b;
      }
      if (d.y > 0 && py > this.terrainMax) return null;
      prevT = t;
      t += Math.max(0.3, gap * 0.5);
      px = o.x + d.x * t; py = o.y + d.y * t; pz = o.z + d.z * t;
    }
    return null;
  }
  lineOfSight(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
    const L = Math.hypot(dx, dy, dz);
    if (L < 0.01) return true;
    const d = { x: dx / L, y: dy / L, z: dz / L };
    return !this.raycast(a, d, L - 0.1);
  }
}
