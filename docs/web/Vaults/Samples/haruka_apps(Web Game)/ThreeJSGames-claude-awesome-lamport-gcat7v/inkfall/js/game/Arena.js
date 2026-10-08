// =========================================================
// Arena — キューブ型スタジアム
//  ・すべての面(外殻の内側 6 面 + 浮遊ブロックの全面)を 1m マスに分割
//  ・マスの持ち主(0=なし / 1=A / 2=B)を Uint8Array で管理
//  ・塗りは 1 枚のアトラステクスチャ(1 テクセル=1 マス)に書き込み、
//    シェーダーでノイズをかけて「インクらしい」境界にする
// =========================================================
import * as THREE from 'three';

const AXES = ['x', 'y', 'z'];
const DISABLED = 255;
const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);

// 法線ごとの u / v 軸(cross(u, v) = normal)
const UV_TABLE = {
  '+y': [[1, 0, 0], [0, 0, -1]],
  '-y': [[1, 0, 0], [0, 0, 1]],
  '+x': [[0, 0, -1], [0, 1, 0]],
  '-x': [[0, 0, 1], [0, 1, 0]],
  '+z': [[1, 0, 0], [0, 1, 0]],
  '-z': [[-1, 0, 0], [0, 1, 0]],
};
const nKey = (n) => (n.x > 0.5 ? '+x' : n.x < -0.5 ? '-x' : n.y > 0.5 ? '+y' : n.y < -0.5 ? '-y' : n.z > 0.5 ? '+z' : '-z');

export class Arena {
  /**
   * @param {object} def  arenas/*.js のデータ
   */
  constructor(def) {
    this.def = def;
    this.boxes = [];
    this.faces = [];
    this.group = new THREE.Group();
    const [X, Y, Z] = def.size; // 内側の大きさ(偶数)
    this.inner = { min: new THREE.Vector3(-X / 2, 0, -Z / 2), max: new THREE.Vector3(X / 2, Y, Z / 2) };
    this.center = new THREE.Vector3(0, Y / 2, 0);

    // 外殻(厚さ 2 の壁)
    const t = 2, mn = this.inner.min, mx = this.inner.max;
    this._box([mn.x - t, mn.y - t, mn.z - t], [mx.x + t, mn.y, mx.z + t], 'shell');
    this._box([mn.x - t, mx.y, mn.z - t], [mx.x + t, mx.y + t, mx.z + t], 'shell');
    this._box([mn.x - t, mn.y, mn.z - t], [mn.x, mx.y, mx.z + t], 'shell');
    this._box([mx.x, mn.y, mn.z - t], [mx.x + t, mx.y, mx.z + t], 'shell');
    this._box([mn.x, mn.y, mn.z - t], [mx.x, mx.y, mn.z], 'shell');
    this._box([mn.x, mn.y, mx.z], [mx.x, mx.y, mx.z + t], 'shell');
    for (const b of def.blocks) this._box(b.min, b.max, 'block', b.color);

    // 面を作る(外殻は内向き、ブロックは外向き)
    const room = { min: this.inner.min, max: this.inner.max };
    for (const a of AXES) {
      this._face(room, a, 'min', +1, def.colors.floorWall[a] || '#24283c', 'shell');
      this._face(room, a, 'max', -1, def.colors.ceilWall[a] || '#24283c', 'shell');
    }
    for (const b of this.boxes.filter((x) => x.kind === 'block')) {
      for (const a of AXES) {
        this._face(b, a, 'min', -1, b.color || def.colors.block, 'block');
        this._face(b, a, 'max', +1, b.color || def.colors.block, 'block');
      }
    }
    this._buildCells();
    this._buildAtlas();
    this._buildMesh();
  }

  _box(min, max, kind, color) {
    this.boxes.push({ min: V(min), max: V(max), kind, color });
  }

  _face(box, axis, side, sign, color, kind) {
    const normal = new THREE.Vector3();
    normal[axis] = sign;
    const key = nKey(normal);
    const [ua, va] = UV_TABLE[key];
    const u = V(ua), v = V(va);
    const plane = side === 'min' ? box.min[axis] : box.max[axis];
    const origin = new THREE.Vector3();
    origin[axis] = plane;
    let w = 0, h = 0;
    for (const a of AXES) {
      if (a === axis) continue;
      if (u[a] !== 0) { origin[a] = u[a] > 0 ? box.min[a] : box.max[a]; w = Math.round(box.max[a] - box.min[a]); }
      if (v[a] !== 0) { origin[a] = v[a] > 0 ? box.min[a] : box.max[a]; h = Math.round(box.max[a] - box.min[a]); }
    }
    this.faces.push({ normal, key, axis, plane, u, v, origin, w, h, color: new THREE.Color(color), kind, start: 0 });
  }

  _buildCells() {
    let n = 0;
    for (const f of this.faces) { f.start = n; n += f.w * f.h; }
    this.cellCount = n;
    this.owner = new Uint8Array(n);
    this.cellPos = new Float32Array(n * 3);
    this.cellNormal = new Int8Array(n * 3);
    this.cellFace = new Uint16Array(n);
    this.counts = [0, 0, 0];
    const p = new THREE.Vector3(), probe = new THREE.Vector3();
    let paintable = 0;
    this.faces.forEach((f, fi) => {
      for (let j = 0; j < f.h; j++) {
        for (let i = 0; i < f.w; i++) {
          const c = f.start + j * f.w + i;
          p.copy(f.origin).addScaledVector(f.u, i + 0.5).addScaledVector(f.v, j + 0.5);
          this.cellPos[c * 3] = p.x; this.cellPos[c * 3 + 1] = p.y; this.cellPos[c * 3 + 2] = p.z;
          this.cellNormal[c * 3] = f.normal.x; this.cellNormal[c * 3 + 1] = f.normal.y; this.cellNormal[c * 3 + 2] = f.normal.z;
          this.cellFace[c] = fi;
          // ほかの箱に埋まっているマスは塗れない
          probe.copy(p).addScaledVector(f.normal, 0.25);
          if (this.insideAny(probe)) this.owner[c] = DISABLED;
          else paintable++;
        }
      }
    });
    this.paintable = paintable;
    this.counts = [paintable, 0, 0];
    // 空間ハッシュ(2m バケット)
    this.hash = new Map();
    for (let c = 0; c < n; c++) {
      if (this.owner[c] === DISABLED) continue;
      const k = this._hkey(Math.floor(this.cellPos[c * 3] / 2), Math.floor(this.cellPos[c * 3 + 1] / 2), Math.floor(this.cellPos[c * 3 + 2] / 2));
      let arr = this.hash.get(k);
      if (!arr) { arr = []; this.hash.set(k, arr); }
      arr.push(c);
    }
  }

  _hkey(x, y, z) { return ((x + 64) * 4096) + ((y + 64) * 64) + (z + 64); }

  insideAny(p) {
    for (const b of this.boxes) {
      if (p.x > b.min.x && p.x < b.max.x && p.y > b.min.y && p.y < b.max.y && p.z > b.min.z && p.z < b.max.z) return true;
    }
    return false;
  }

  // ---------- アトラス(1 テクセル = 1 マス、周囲 1px のふち) ----------
  _buildAtlas() {
    const W = 256;
    let x = 0, y = 0, rowH = 0;
    const sorted = [...this.faces].sort((a, b) => b.h - a.h);
    for (const f of sorted) {
      const fw = f.w + 2, fh = f.h + 2;
      if (x + fw > W) { x = 0; y += rowH; rowH = 0; }
      f.ax = x; f.ay = y;
      x += fw;
      rowH = Math.max(rowH, fh);
    }
    let H = 1;
    while (H < y + rowH) H *= 2;
    this.atlasW = W;
    this.atlasH = H;
    this.paintData = new Uint8Array(W * H * 4);
    this.paintTex = new THREE.DataTexture(this.paintData, W, H, THREE.RGBAFormat);
    this.paintTex.magFilter = THREE.LinearFilter;
    this.paintTex.minFilter = THREE.LinearFilter;
    this.paintTex.generateMipmaps = false;
    this.paintTex.needsUpdate = true;
    this.fresh = new Map(); // cell → 残りの光
    this.dirtyTex = false;
  }

  _texel(f, i, j, r, g, b) {
    const W = this.atlasW;
    const put = (tx, ty) => {
      const o = (ty * W + tx) * 4;
      this.paintData[o] = r; this.paintData[o + 1] = g; this.paintData[o + 2] = b; this.paintData[o + 3] = 255;
    };
    const tx = f.ax + 1 + i, ty = f.ay + 1 + j;
    put(tx, ty);
    // ふちのテクセルも同じ値に(バイリニアのにじみ対策)
    const L = i === 0, R = i === f.w - 1, B = j === 0, T = j === f.h - 1;
    if (L) put(tx - 1, ty);
    if (R) put(tx + 1, ty);
    if (B) put(tx, ty - 1);
    if (T) put(tx, ty + 1);
    if (L && B) put(tx - 1, ty - 1);
    if (L && T) put(tx - 1, ty + 1);
    if (R && B) put(tx + 1, ty - 1);
    if (R && T) put(tx + 1, ty + 1);
  }

  _writeCell(c, fresh) {
    const f = this.faces[this.cellFace[c]];
    const local = c - f.start;
    const i = local % f.w, j = Math.floor(local / f.w);
    const o = this.owner[c];
    this._texel(f, i, j, o === 1 ? 255 : 0, o === 2 ? 255 : 0, Math.round(fresh * 255));
    this.dirtyTex = true;
  }

  // ---------- 塗り ----------
  /** マスの持ち主を変える。変わったら true */
  setOwner(c, owner, fresh = 1) {
    const prev = this.owner[c];
    if (prev === DISABLED || prev === owner) return false;
    this.counts[prev]--;
    this.counts[owner]++;
    this.owner[c] = owner;
    if (owner && fresh > 0) this.fresh.set(c, fresh);
    this._writeCell(c, owner ? fresh : 0);
    return true;
  }

  /**
   * 球の範囲を塗る
   * @returns {number[]} 変化したマス
   */
  paintSphere(center, radius, owner, out = []) {
    const r2 = radius * radius;
    const x0 = Math.floor((center.x - radius) / 2), x1 = Math.floor((center.x + radius) / 2);
    const y0 = Math.floor((center.y - radius) / 2), y1 = Math.floor((center.y + radius) / 2);
    const z0 = Math.floor((center.z - radius) / 2), z1 = Math.floor((center.z + radius) / 2);
    const P = this.cellPos, N = this.cellNormal;
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
      const arr = this.hash.get(this._hkey(x, y, z));
      if (!arr) continue;
      for (const c of arr) {
        const dx = center.x - P[c * 3], dy = center.y - P[c * 3 + 1], dz = center.z - P[c * 3 + 2];
        if (dx * dx + dy * dy + dz * dz > r2) continue;
        if (dx * N[c * 3] + dy * N[c * 3 + 1] + dz * N[c * 3 + 2] < -0.35) continue; // 裏側は塗らない
        if (this.setOwner(c, owner)) out.push(c);
      }
    }
    return out;
  }

  /** 位置 + 法線から、その場所のマスを探す(無ければ -1) */
  cellAt(point, normal) {
    const key = nKey(normal);
    for (const f of this.faces) {
      if (f.key !== key || Math.abs(point[f.axis] - f.plane) > 0.08) continue;
      const d = point.clone().sub(f.origin);
      const i = Math.floor(d.dot(f.u)), j = Math.floor(d.dot(f.v));
      if (i < 0 || j < 0 || i >= f.w || j >= f.h) continue;
      return f.start + j * f.w + i;
    }
    return -1;
  }

  ownerAt(point, normal) {
    const c = this.cellAt(point, normal);
    return c < 0 ? 0 : (this.owner[c] === DISABLED ? 0 : this.owner[c]);
  }

  reset() {
    for (let c = 0; c < this.cellCount; c++) {
      if (this.owner[c] !== DISABLED && this.owner[c] !== 0) { this.owner[c] = 0; this._writeCell(c, 0); }
    }
    this.counts = [this.paintable, 0, 0];
    this.fresh.clear();
  }

  coverage() {
    const total = this.paintable || 1;
    return { a: this.counts[1] / total, b: this.counts[2] / total, none: this.counts[0] / total };
  }

  update(dt) {
    if (this.fresh.size) {
      for (const [c, v] of this.fresh) {
        const nv = v - dt * 1.6;
        if (nv <= 0) { this.fresh.delete(c); this._writeCell(c, 0); } else { this.fresh.set(c, nv); this._writeCell(c, nv); }
      }
    }
    if (this.dirtyTex) { this.paintTex.needsUpdate = true; this.dirtyTex = false; }
    if (this.material) this.material.userData.uniforms.uTime.value += dt;
  }

  // ---------- 見た目 ----------
  _buildMesh() {
    const pos = [], nor = [], col = [], paint = [], cell = [], size = [], idx = [];
    const W = this.atlasW, H = this.atlasH;
    let base = 0;
    const tmp = new THREE.Vector3();
    for (const f of this.faces) {
      const corners = [[0, 0], [f.w, 0], [f.w, f.h], [0, f.h]];
      for (const [i, j] of corners) {
        tmp.copy(f.origin).addScaledVector(f.u, i).addScaledVector(f.v, j);
        pos.push(tmp.x, tmp.y, tmp.z);
        nor.push(f.normal.x, f.normal.y, f.normal.z);
        col.push(f.color.r, f.color.g, f.color.b);
        paint.push((f.ax + 1 + i) / W, (f.ay + 1 + j) / H);
        cell.push(i, j);
        size.push(f.w, f.h);
      }
      idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      base += 4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute('aPaint', new THREE.Float32BufferAttribute(paint, 2));
    g.setAttribute('aCell', new THREE.Float32BufferAttribute(cell, 2));
    g.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 2));
    g.setIndex(idx);
    g.computeBoundingSphere();
    this.material = createPaintMaterial(this.paintTex, this.def.colors);
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.group.add(this.mesh);
  }

  setTeamColors(a, b) {
    const u = this.material.userData.uniforms;
    u.uTeamA.value.set(a);
    u.uTeamB.value.set(b);
  }

  // ---------- あたり判定 ----------
  collideSphere(pos, r, vel, up, out) {
    out.grounded = false;
    out.groundNormal = null;
    const r2 = r * r;
    for (let iter = 0; iter < 2; iter++) {
      for (const b of this.boxes) {
        const cx = Math.max(b.min.x, Math.min(pos.x, b.max.x));
        const cy = Math.max(b.min.y, Math.min(pos.y, b.max.y));
        const cz = Math.max(b.min.z, Math.min(pos.z, b.max.z));
        const dx = pos.x - cx, dy = pos.y - cy, dz = pos.z - cz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= r2) continue;
        let nx, ny, nz, pen;
        if (d2 > 1e-10) {
          const d = Math.sqrt(d2);
          nx = dx / d; ny = dy / d; nz = dz / d; pen = r - d;
        } else {
          let best = Infinity;
          for (const a of AXES) {
            const toMin = pos[a] - b.min[a], toMax = b.max[a] - pos[a];
            if (toMin < best) { best = toMin; nx = a === 'x' ? -1 : 0; ny = a === 'y' ? -1 : 0; nz = a === 'z' ? -1 : 0; }
            if (toMax < best) { best = toMax; nx = a === 'x' ? 1 : 0; ny = a === 'y' ? 1 : 0; nz = a === 'z' ? 1 : 0; }
          }
          pen = best + r;
        }
        pos.x += nx * pen; pos.y += ny * pen; pos.z += nz * pen;
        const vn = vel.x * nx + vel.y * ny + vel.z * nz;
        if (vn < 0) { vel.x -= nx * vn; vel.y -= ny * vn; vel.z -= nz * vn; }
        if (nx * up.x + ny * up.y + nz * up.z > 0.65) {
          out.grounded = true;
          out.groundNormal = (out.groundNormal || new THREE.Vector3()).set(nx, ny, nz);
        }
      }
    }
    return out;
  }

  /** 箱へのレイキャスト(面の法線つき) */
  raycast(o, d, maxDist = 200) {
    let best = null, bestT = maxDist;
    for (const b of this.boxes) {
      let tmin = -Infinity, tmax = bestT, nAxis = null, nSign = 0, ok = true;
      for (const a of AXES) {
        const da = d[a];
        if (Math.abs(da) < 1e-9) {
          if (o[a] < b.min[a] || o[a] > b.max[a]) { ok = false; break; }
          continue;
        }
        let t1 = (b.min[a] - o[a]) / da, t2 = (b.max[a] - o[a]) / da, sign = -1;
        if (t1 > t2) { const tt = t1; t1 = t2; t2 = tt; sign = 1; }
        if (t1 > tmin) { tmin = t1; nAxis = a; nSign = sign; }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) { ok = false; break; }
      }
      if (!ok || nAxis === null || tmin <= 0 || tmin >= bestT) continue;
      bestT = tmin;
      const normal = new THREE.Vector3();
      normal[nAxis] = nSign;
      best = { t: tmin, box: b, normal, point: o.clone().addScaledVector(d, tmin) };
    }
    return best;
  }

  /** 2 点の間が見通せるか */
  lineOfSight(a, b) {
    const d = b.clone().sub(a);
    const len = d.length();
    if (len < 1e-4) return true;
    d.divideScalar(len);
    const hit = this.raycast(a, d, len);
    return !hit || hit.t >= len - 0.05;
  }

  /** ランダムな塗れるマス */
  randomCell(rng = Math.random) {
    for (let k = 0; k < 40; k++) {
      const c = Math.floor(rng() * this.cellCount);
      if (this.owner[c] !== DISABLED) return c;
    }
    return 0;
  }

  cellCenter(c, out = new THREE.Vector3()) { return out.set(this.cellPos[c * 3], this.cellPos[c * 3 + 1], this.cellPos[c * 3 + 2]); }
  cellNormalVec(c, out = new THREE.Vector3()) { return out.set(this.cellNormal[c * 3], this.cellNormal[c * 3 + 1], this.cellNormal[c * 3 + 2]); }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.paintTex.dispose();
  }
}

Arena.DISABLED = DISABLED;

// ---------------------------------------------------------
// インクを描くマテリアル
// ---------------------------------------------------------
function createPaintMaterial(paintTex, colors) {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0.15 });
  const uniforms = {
    uPaint: { value: paintTex },
    uTeamA: { value: new THREE.Color('#ff3fa4') },
    uTeamB: { value: new THREE.Color('#25d9ff') },
    uGrid: { value: new THREE.Color(colors.grid || '#5f6cff') },
    uEdge: { value: new THREE.Color(colors.edge || '#9fe8ff') },
    uTime: { value: 0 },
  };
  mat.userData.uniforms = uniforms;
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute vec2 aPaint; attribute vec2 aCell; attribute vec2 aSize;
        varying vec2 vPaint; varying vec2 vCell; varying vec2 vSize; varying vec3 vWPos;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vPaint = aPaint; vCell = aCell; vSize = aSize;
        vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D uPaint; uniform vec3 uTeamA; uniform vec3 uTeamB; uniform vec3 uGrid; uniform vec3 uEdge; uniform float uTime;
        varying vec2 vPaint; varying vec2 vCell; varying vec2 vSize; varying vec3 vWPos;
        float h3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float vnoise(vec3 x) {
          vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z);
        }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec4 pt = texture2D(uPaint, vPaint);
        float nz = vnoise(vWPos * 1.7) * 0.62 + vnoise(vWPos * 4.3) * 0.38;
        float en = (nz - 0.5) * 0.55;
        float inkA = smoothstep(0.40, 0.56, pt.r + en);
        float inkB = smoothstep(0.40, 0.56, pt.g + en);
        float inkAmt = clamp(inkA + inkB, 0.0, 1.0);
        vec3 inkCol = (uTeamA * inkA + uTeamB * inkB) / max(inkA + inkB, 1e-3);
        vec2 gc = abs(fract(vCell) - 0.5);
        vec2 gw = (0.5 - gc) / max(fwidth(vCell), vec2(1e-4));
        float grid = 1.0 - min(min(gw.x, gw.y), 1.0);
        float ed = min(min(vCell.x, vCell.y), min(vSize.x - vCell.x, vSize.y - vCell.y));
        float edge = 1.0 - smoothstep(0.02, 0.16, ed);
        diffuseColor.rgb = mix(diffuseColor.rgb, inkCol * 0.9, inkAmt);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.16, inkAmt);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += inkCol * inkAmt * (0.16 + pt.b * 1.4);
        totalEmissiveRadiance += uGrid * grid * (1.0 - inkAmt) * 0.32;
        totalEmissiveRadiance += uEdge * edge * (0.9 + 0.25 * sin(uTime * 2.0 + vWPos.y * 0.4));`);
  };
  mat.customProgramCacheKey = () => 'inkfall-paint';
  return mat;
}
