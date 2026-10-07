// マップ構築ヘルパー: ハイトマップ、ジオメトリ結合、建物生成、植生インスタンシング
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { tex } from './textures.js';
import { mulberry32, smoothstep, clamp, lerp } from './util.js';

// ---- ハイトマップ ----------------------------------------------------------
export class Heightmap {
  constructor(S, baseFn, flats = []) {
    this.S = S; this.n = S * 2 + 1;
    const n = this.n;
    this.data = new Float32Array(n * n);
    for (const f of flats) if (f.h === undefined) f.h = baseFn(f.x, f.z);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = i - S, z = j - S;
      let h = baseFn(x, z);
      for (const f of flats) {
        const dx = Math.max(Math.abs(x - f.x) - f.hw, 0), dz = Math.max(Math.abs(z - f.z) - f.hd, 0);
        const d = Math.hypot(dx, dz);
        if (d < f.m) h = lerp(h, f.h, smoothstep(f.m, 0, d));
      }
      this.data[j * n + i] = h;
    }
    let mx = -1e9; for (const v of this.data) if (v > mx) mx = v;
    this.max = mx;
    this.sample = this.sample.bind(this);
  }
  sample(x, z) {
    const S = this.S, n = this.n;
    let fx = x + S, fz = z + S;
    if (fx < 0) fx = 0; if (fz < 0) fz = 0; if (fx > n - 1.001) fx = n - 1.001; if (fz > n - 1.001) fz = n - 1.001;
    const i = fx | 0, j = fz | 0, tx = fx - i, tz = fz - j;
    const d = this.data, k = j * n + i;
    const a = d[k] + (d[k + 1] - d[k]) * tx, b = d[k + n] + (d[k + n + 1] - d[k + n]) * tx;
    return a + (b - a) * tz;
  }
}

// ---- マテリアル ----------------------------------------------------------------
export function makeMaterials(night = false) {
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const t = (n) => tex(n);
  const M = {};
  const withTex = (name, o, uv = 4) => { const tt = t(name); const m = std({ map: tt.map, normalMap: tt.normal || null, ...o }); m.userData.uv = uv; return m; };
  M.concrete = withTex('concrete', { roughness: 0.92, color: 0xd8d4cc }, 4);
  M.concreteDark = withTex('concrete', { roughness: 0.9, color: 0x807a74 }, 4);
  M.plaster = withTex('plaster', { roughness: 0.95 }, 4);
  M.plasterWhite = withTex('plaster', { roughness: 0.95, color: 0xfff4ea }, 4);
  M.brick = withTex('brick', { roughness: 0.9 }, 3);
  M.wood = withTex('wood', { roughness: 0.85 }, 2.5);
  M.woodDark = withTex('wood', { roughness: 0.85, color: 0x6a5040 }, 2.5);
  M.metal = withTex('metal', { roughness: 0.55, metalness: 0.6, color: 0xb8b8b8 }, 3);
  M.rust = withTex('metal', { roughness: 0.8, metalness: 0.4, color: 0xa0603a }, 3);
  M.asphalt = withTex('asphalt', { roughness: night ? 0.35 : 0.85, color: 0x9a9a9a }, 6);
  M.roof = withTex('roof', { roughness: 0.8 }, 3);
  M.trim = std({ color: 0x2a2a2c, roughness: 0.6, metalness: 0.3 });
  M.darkMetal = std({ color: 0x3a3d40, roughness: 0.45, metalness: 0.8 });
  M.sandbag = withTex('fabric', { color: 0xb09a70, roughness: 1 }, 1);
  M.tarp = withTex('fabric', { color: 0x4f6b3a, roughness: 1 }, 2);
  M.glass = std({ color: 0x223040, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.55 });
  for (const [k, c] of [['contRed', 0xa8392c], ['contBlue', 0x2c5a8a], ['contGreen', 0x3d7045], ['contYellow', 0xc8962a], ['contGray', 0x8a8f94]]) {
    const tt = t('container'); M[k] = std({ map: tt.map, normalMap: tt.normal, color: c, roughness: 0.6, metalness: 0.45 }); M[k].userData.uv = 3;
  }
  M.carRed = std({ color: 0x7a1a14, roughness: 0.35, metalness: 0.6 });
  M.carBlue = std({ color: 0x1d3050, roughness: 0.35, metalness: 0.6 });
  M.carWhite = std({ color: 0xb8b8b0, roughness: 0.35, metalness: 0.6 });
  M.carRust = withTex('metal', { color: 0x8a5030, roughness: 0.85, metalness: 0.3 }, 2);
  M.rubber = std({ color: 0x151515, roughness: 0.9 });
  M.lamp = std({ color: 0xffe0a0, emissive: 0xffc070, emissiveIntensity: 3 });
  M.red = std({ color: 0xaa2222, roughness: 0.6 });
  M.white = std({ color: 0xeeeeee, roughness: 0.6 });
  M.yellow = std({ color: 0xd8b020, roughness: 0.6 });
  M.bark = withTex('bark', { roughness: 0.95 }, 2);
  M.stone = withTex('concrete', { color: 0x8a847c, roughness: 0.95 }, 3);
  return M;
}

// ---- ジオメトリ結合ビルダー ----------------------------------------------------
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler();
export class Builder {
  constructor(scene, world, M) {
    this.scene = scene; this.world = world; this.M = M;
    this.batches = new Map();
    this.T = { x: 0, y: 0, z: 0, rot: 0 };
    this.group = new THREE.Group();
    scene.add(this.group);
    this.houses = [];
  }
  setT(x, y, z, rot = 0) { this.T = { x, y, z, rot: ((rot % 4) + 4) % 4 }; }
  resetT() { this.T = { x: 0, y: 0, z: 0, rot: 0 }; }
  tp(lx, lz) {
    const r = this.T.rot;
    let x = lx, z = lz;
    if (r === 1) { x = lz; z = -lx; } else if (r === 2) { x = -lx; z = -lz; } else if (r === 3) { x = -lz; z = lx; }
    return [this.T.x + x, this.T.z + z];
  }
  addGeo(geo, matKey, matrix, shadow = true) {
    if (matrix) geo.applyMatrix4(matrix);
    const key = matKey + (shadow ? '' : '|ns');
    if (!this.batches.has(key)) this.batches.set(key, []);
    // 属性統一
    if (!geo.index) geo = geo; // 非インデックスはそのまま
    for (const a of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(a)) geo.deleteAttribute(a);
    if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    this.batches.get(key).push(geo.index ? geo.toNonIndexed() : geo);
  }
  // ローカル座標の箱（w=x幅, h=高さ, d=z奥行き）。y は T.y 基準の底面
  box(lx, ly, lz, w, h, d, matKey, opts = {}) {
    const odd = this.T.rot % 2 === 1;
    const [x, z] = this.tp(lx, lz);
    const W = odd ? d : w, D = odd ? w : d;
    const y0 = this.T.y + ly;
    if (matKey) {
      const g = new THREE.BoxGeometry(W, h, D);
      const mat = this.M[matKey];
      const s = 1 / ((mat && mat.userData.uv) || 4);
      const uv = g.attributes.uv;
      // 面ごとにワールドサイズでUVスケール
      const dims = [[D, h], [D, h], [W, D], [W, D], [W, h], [W, h]];
      for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] * s, uv.getY(i) * dims[f][1] * s); }
      g.translate(x, y0 + h / 2, z);
      this.addGeo(g, matKey, null, opts.shadow !== false);
    }
    if (opts.collide !== false) this.world.addBox(x - W / 2, y0, z - D / 2, x + W / 2, y0 + h, z + D / 2, opts.col || colMat(matKey));
  }
  // 見た目のみ（回転可）
  mesh(geo, matKey, lx, ly, lz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1, shadow = true) {
    const [x, z] = this.tp(lx, lz);
    _e.set(rx, ry - this.T.rot * Math.PI / 2, rz);
    _m.compose(_p.set(x, this.T.y + ly, z), _q.setFromEuler(_e), _s.set(sx, sy, sz));
    this.addGeo(geo, matKey, _m, shadow);
  }
  // 壁: 軸平行、開口部付き。axis='x'なら x方向に伸びる
  wall(axis, a0, a1, c, y, h, t, openings, matKey) {
    const L = a1 - a0;
    const ops = (openings || []).slice().sort((p, q) => p.at - q.at);
    let cur = 0;
    const piece = (s, e, py, ph) => {
      if (e - s < 0.02 || ph < 0.02) return;
      const mid = a0 + (s + e) / 2, len = e - s;
      if (axis === 'x') this.box(mid, y + py, c, len, ph, t, matKey); else this.box(c, y + py, mid, t, ph, len, matKey);
    };
    for (const o of ops) {
      const s = o.at - o.w / 2, e = o.at + o.w / 2;
      piece(cur, s, 0, h);
      piece(s, e, 0, o.y0);
      piece(s, e, o.y0 + o.h, h - o.y0 - o.h);
      // 窓枠
      if (o.y0 > 0.1 && this.M.trim) {
        if (axis === 'x') this.box(a0 + o.at, y + o.y0 - 0.06, c, o.w + 0.1, 0.08, t + 0.12, 'trim', { collide: false });
        else this.box(c, y + o.y0 - 0.06, a0 + o.at, t + 0.12, 0.08, o.w + 0.1, 'trim', { collide: false });
      }
      cur = e;
    }
    piece(cur, L, 0, h);
  }
  finish() {
    for (const [key, geos] of this.batches) {
      const [mk, ns] = key.split('|');
      // 大量ジオメトリを分割して結合（カリング効率）
      const chunks = new Map();
      for (const g of geos) {
        g.computeBoundingBox();
        const c = g.boundingBox.getCenter(_p);
        const ck = Math.floor(c.x / 120) + ',' + Math.floor(c.z / 120);
        if (!chunks.has(ck)) chunks.set(ck, []);
        chunks.get(ck).push(g);
      }
      for (const list of chunks.values()) {
        const merged = mergeGeometries(list, false);
        if (!merged) continue;
        const mesh = new THREE.Mesh(merged, this.M[mk]);
        mesh.castShadow = !ns; mesh.receiveShadow = true;
        mesh.matrixAutoUpdate = false; mesh.updateMatrix();
        this.group.add(mesh);
      }
      geos.forEach((g) => g.dispose());
    }
    this.batches.clear();
  }
}
function colMat(k) {
  if (!k) return 'concrete';
  if (k.startsWith('wood') || k === 'bark') return 'wood';
  if (k.startsWith('cont') || k.startsWith('car') || k === 'metal' || k === 'rust' || k === 'darkMetal') return 'metal';
  if (k === 'sandbag') return 'sand';
  return 'concrete';
}

// ---- 建物 -------------------------------------------------------------------
// 返り値: 屋内のルートスポット [x, z, y, house, floor]
export function house(B, x, y, z, rot, o) {
  const w = Math.max(8, o.w || 10), d = Math.max(7, o.d || 8), floors = o.floors || 1, fh = 3.2, t = 0.25;
  const wm = o.wall || 'plaster', fm = o.floor || 'concrete';
  const rng = mulberry32(o.seed || (x * 73 + z * 31) | 0);
  B.setT(x, y, z, rot);
  const loot = [];
  const hw = w / 2, hd = d / 2;
  // 基礎
  B.box(0, -1.5, 0, w + 0.4, 1.62, d + 0.4, fm);
  // 階段: 右壁沿いの2レーンを交互に使う（上階の階段が頭上を塞がないように）
  const laneX = (f) => hw - t - 0.8 - (f % 2) * 1.6;
  const stairZ0 = -hd + t + 1.0;
  const rise = fh / 13, run = Math.min(0.3, (d - 2 * t - 2.2) / 13);
  const holeZ1 = stairZ0 + 13 * run + 0.15;
  const midX = hw - t - 4.0;
  const H = { rect: [], floors, fh, y, doors: [], chain: [] };
  { const a = B.tp(-hw, -hd), b = B.tp(hw, hd); H.rect = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])]; }
  H.doors.push({ out: B.tp(0, -hd - 1.2), in: B.tp(0, -hd + 1.3) });
  if (o.backDoor !== false) H.doors.push({ out: B.tp(-hw + w * 0.3, hd + 1.2), in: B.tp(-hw + w * 0.3, hd - 1.3) });
  for (let f = 0; f < floors - 1; f++) {
    const lx = laneX(f), nx = laneX(f + 1);
    H.chain.push({ p: B.tp(midX, stairZ0 - 0.55), fl: f }, { p: B.tp(lx, stairZ0 - 0.55), fl: f }, { p: B.tp(lx, holeZ1 + 0.45), fl: f + 1 }, { p: B.tp(midX, holeZ1 + 0.45), fl: f + 1 });
  }
  const hi = B.houses.length; B.houses.push(H);
  for (let f = 0; f < floors; f++) {
    const fy = 0.12 + f * fh;
    const windows = (L) => { const n = Math.max(1, Math.floor(L / 3.4)); const arr = []; for (let i = 0; i < n; i++) arr.push({ at: (L / n) * (i + 0.5), w: 1.35, y0: 0.95, h: 1.35 }); return arr; };
    const frontOps = windows(w), backOps = windows(w);
    if (f === 0) {
      frontOps.splice(0, frontOps.length, ...frontOps.filter((q) => Math.abs(q.at - w / 2) > 1.6), { at: w / 2, w: 1.5, y0: 0, h: 2.3 });
      if (o.backDoor !== false) backOps.splice(0, backOps.length, ...backOps.filter((q) => Math.abs(q.at - w * 0.3) > 1.6), { at: w * 0.3, w: 1.4, y0: 0, h: 2.3 });
    }
    B.wall('x', -hw, hw, -hd + t / 2, fy, fh, t, frontOps, wm);
    B.wall('x', -hw, hw, hd - t / 2, fy, fh, t, backOps, wm);
    const sideOpsL = windows(d - 2 * t), sideOpsR = windows(d - 2 * t);
    B.wall('z', -hd + t, hd - t, -hw + t / 2, fy, fh, t, sideOpsL, wm);
    B.wall('z', -hd + t, hd - t, hw - t / 2, fy, fh, t, floors > 1 ? [] : sideOpsR, wm);
    // 床（上階は下の階段の真上だけ穴）
    if (f > 0) {
      const lx = laneX(f - 1), h0 = lx - 0.75, h1 = lx + 0.75;
      B.box((-hw + h0) / 2, fy - 0.2, 0, h0 + hw, 0.2, d, fm);
      if (hw - h1 > 0.02) B.box((h1 + hw) / 2, fy - 0.2, 0, hw - h1, 0.2, d, fm);
      B.box(lx, fy - 0.2, (holeZ1 + hd) / 2, 1.5, 0.2, hd - holeZ1, fm);
      B.box(lx, fy - 0.2, (-hd + stairZ0) / 2, 1.5, 0.2, stairZ0 + hd, fm);
      // 手すり
      B.box(h0 - 0.04, fy, (stairZ0 + holeZ1) / 2, 0.07, 1.0, holeZ1 - stairZ0, 'trim');
    }
    if (f < floors - 1) {
      const lx = laneX(f);
      for (let s = 0; s < 13; s++) B.box(lx, fy, stairZ0 + s * run + run / 2, 1.4, (s + 1) * rise, run, 'woodDark');
    }
    // 家具（階段レーンと入口を避ける）
    const maxX = floors > 1 ? hw - t - 3.5 : hw - 1.2;
    const nF = 1 + Math.floor(rng() * 3);
    for (let k = 0; k < nF; k++) {
      const fx = lerp(-hw + 1.2, maxX - 0.8, rng()), fz = lerp(-hd + 1.6, hd - 1.6, rng());
      if (Math.abs(fx) < 1.5 && fz < -hd + 2.8) continue;
      if (Math.abs(fx - (-hw + w * 0.3)) < 1.5 && fz > hd - 2.8) continue;
      const kind = rng();
      if (kind < 0.4) B.box(fx, fy, fz, 1.6, 0.78, 0.9, 'wood');
      else if (kind < 0.7) { B.box(fx, fy, fz, 1, 1, 1, 'wood'); if (rng() < 0.5) B.box(fx + 0.1, fy + 1, fz, 0.8, 0.8, 0.8, 'wood'); }
      else if (fz > -hd + 3) B.box(-hw + 0.55, fy, fz, 0.6, 2, 1.6, 'woodDark');
    }
    const lx0 = -hw + 1.3, lx1 = Math.max(lx0 + 0.5, maxX - 0.5);
    loot.push([...B.tp(lerp(lx0, lx1, rng()), lerp(-hd + 1.5, hd - 1.5, rng())), y + fy, hi, f]);
    loot.push([...B.tp(lerp(lx0, lx1, rng()), lerp(-hd + 1.5, hd - 1.5, rng())), y + fy, hi, f]);
  }
  const top = 0.12 + floors * fh;
  // 屋根
  if (o.roof === 'gable') {
    B.box(0, top - 0.2, 0, w + 0.4, 0.2, d + 0.4, 'woodDark');
    const rh = d * 0.35, sl = Math.hypot(d / 2 + 0.6, rh);
    const ang = Math.atan2(rh, d / 2 + 0.6);
    const g1 = new THREE.BoxGeometry(w + 1, 0.15, sl);
    B.mesh(g1, o.roofMat || 'roof', 0, top + rh / 2, -(d / 4 + 0.3), -ang, 0, 0);
    B.mesh(new THREE.BoxGeometry(w + 1, 0.15, sl), o.roofMat || 'roof', 0, top + rh / 2, d / 4 + 0.3, ang, 0, 0);
    // 妻壁
    const tri = new THREE.BufferGeometry();
    const v = new Float32Array([-d / 2, 0, 0, d / 2, 0, 0, 0, rh, 0]);
    tri.setAttribute('position', new THREE.BufferAttribute(v, 3)); tri.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 1, 1]), 2));
    tri.computeVertexNormals();
    const triB = tri.clone(); triB.index = null;
    B.mesh(tri, wm, -hw + 0.05, top, 0, 0, -Math.PI / 2, 0);
    B.mesh(triB, wm, hw - 0.05, top, 0, 0, Math.PI / 2, 0);
    B.world.addBox(...(() => { const [ax, az] = B.tp(-hw, -hd); const [bx, bz] = B.tp(hw, hd); return [ax, y + top, az, bx, y + top + rh * 0.7, bz]; })(), 'wood');
  } else {
    B.box(0, top - 0.25, 0, w, 0.25, d, fm);
    // パラペット
    B.box(0, top, -hd + 0.1, w, 0.8, 0.2, wm); B.box(0, top, hd - 0.1, w, 0.8, 0.2, wm);
    B.box(-hw + 0.1, top, 0, 0.2, 0.8, d - 0.4, wm); B.box(hw - 0.1, top, 0, 0.2, 0.8, d - 0.4, wm);
    if (rng() < 0.6) B.box(lerp(-hw + 2, hw - 2, rng()), top, lerp(-hd + 2, hd - 2, rng()), 1.4, 1, 1.1, 'metal'); // 室外機
  }
  B.resetT();
  return loot;
}

// コンテナ
export function container(B, x, y, z, rot, mat, open = false) {
  B.setT(x, y, z, rot);
  const L = 6.1, W = 2.44, H = 2.6;
  if (!open) B.box(0, 0, 0, L, H, W, mat);
  else {
    B.box(0, 0, -W / 2 + 0.05, L, H, 0.1, mat); B.box(0, 0, W / 2 - 0.05, L, H, 0.1, mat);
    B.box(0, H - 0.1, 0, L, 0.1, W, mat); B.box(-L / 2 + 0.05, 0, 0, 0.1, H, W, mat); B.box(0, 0, 0, L, 0.08, W, mat);
  }
  // リブ
  for (let i = -2; i <= 2; i++) B.box(i * 1.4, 0, 0, 0.08, H + 0.02, W + 0.06, 'darkMetal', { collide: false });
  B.resetT();
  return open ? [B.tp(1, 0).concat(y + 0.1)] : [];
}
export function sandbags(B, x, y, z, rot, len = 4) {
  B.setT(x, y, z, rot);
  for (let r = 0; r < 3; r++) for (let i = 0; i < len; i++) {
    const g = new THREE.CapsuleGeometry(0.2, 0.5, 3, 8); g.rotateZ(Math.PI / 2);
    B.mesh(g, 'sandbag', -len * 0.4 + i * 0.8 + (r % 2) * 0.4, 0.2 + r * 0.33, 0, 0, 0, 0, 1, 0.8, 1.2);
  }
  B.box(0, 0, 0, len * 0.8, 1.1, 0.6, null, { col: 'sand' });
  B.resetT();
}
export function watchtower(B, x, y, z, h = 7) {
  B.setT(x, y, z, 0);
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) B.box(a * 1.4, 0, b * 1.4, 0.25, h, 0.25, 'woodDark');
  B.box(0, h, 0, 3.6, 0.2, 3.6, 'wood');
  B.wall('x', -1.8, 1.8, -1.75, h + 0.2, 1.1, 0.1, [], 'wood'); B.wall('x', -1.8, 1.8, 1.75, h + 0.2, 1.1, 0.1, [], 'wood');
  B.wall('z', -1.7, 1.7, -1.75, h + 0.2, 1.1, 0.1, [], 'wood'); B.wall('z', -1.7, 1.7, 1.75, h + 0.2, 1.1, 0.1, [], 'wood');
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) B.box(a * 1.7, h + 0.2, b * 1.7, 0.15, 2.4, 0.15, 'woodDark', { collide: false });
  const rg = new THREE.ConeGeometry(2.8, 1.2, 4); rg.rotateY(Math.PI / 4);
  B.mesh(rg, 'metal', 0, h + 3.2, 0);
  // はしご（ステップ）
  const steps = Math.floor(h / 0.45);
  for (let i = 0; i < steps; i++) B.box(0, 0, -1.95 - (steps - i) * 0.32, 0.9, 0.45 * (i + 1), 0.32, i % 2 ? 'woodDark' : 'wood', { collide: true });
  B.resetT();
  return [[x, z, y + h + 0.2]];
}
export function car(B, x, y, z, rot, mat) {
  B.setT(x, y, z, rot);
  B.box(0, 0.35, 0, 4.3, 0.75, 1.8, mat);
  B.box(-0.2, 1.1, 0, 2.3, 0.62, 1.64, mat, { collide: false });
  B.box(-0.2, 1.12, 0, 2.2, 0.56, 1.66, 'glass', { collide: false });
  for (const [a, b] of [[-1.35, -0.85], [1.35, -0.85], [-1.35, 0.85], [1.35, 0.85]]) {
    const wg = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 14); wg.rotateX(Math.PI / 2);
    B.mesh(wg, 'rubber', a, 0.36, b);
  }
  B.world.addBox(...(() => { const [ax, az] = B.tp(-2.15, -0.9); const [bx, bz] = B.tp(2.15, 0.9); return [ax, y, az, bx, y + 1.25, bz]; })(), 'metal');
  B.resetT();
}
export function crate(B, x, y, z, s = 1.2, mat = 'wood') { B.setT(x, y, z, 0); B.box(0, 0, 0, s, s, s, mat); B.resetT(); }

// ---- 地形メッシュ ----------------------------------------------------------------
export function terrainMesh(hm, colorFn, step = 2, detailRepeat = 90) {
  const S = hm.S, seg = Math.floor((S * 2) / step);
  const g = new THREE.PlaneGeometry(S * 2, S * 2, seg, seg);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = hm.sample(x, z);
    pos.setY(i, h);
    const e = 1.5;
    const slope = Math.hypot(hm.sample(x + e, z) - hm.sample(x - e, z), hm.sample(x, z + e) - hm.sample(x, z - e)) / (2 * e);
    const c = colorFn(x, z, h, slope);
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * detailRepeat, uv.getY(i) * detailRepeat);
  const d = tex('detail');
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, map: d.map, normalMap: d.normal, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.95 });
  const m = new THREE.Mesh(g, mat);
  m.receiveShadow = true;
  m.matrixAutoUpdate = false; m.updateMatrix();
  return m;
}

// ---- 植生 -----------------------------------------------------------------------
function jitter(g, amt, seed = 1) {
  const r = mulberry32(seed); const p = g.attributes.position; const map = new Map();
  for (let i = 0; i < p.count; i++) {
    const k = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;
    if (!map.has(k)) map.set(k, [(r() - 0.5) * amt, (r() - 0.5) * amt, (r() - 0.5) * amt]);
    const j = map.get(k); p.setXYZ(i, p.getX(i) + j[0], p.getY(i) + j[1], p.getZ(i) + j[2]);
  }
  g.computeVertexNormals(); return g;
}
function colorize(g, c) { const n = g.attributes.position.count; const a = new Float32Array(n * 3); const col = new THREE.Color(c); for (let i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; }
function mergeC(list) { return mergeGeometries(list.map((g) => { g = g.index ? g.toNonIndexed() : g; for (const a of Object.keys(g.attributes)) if (!['position', 'normal', 'color'].includes(a)) g.deleteAttribute(a); return g; })); }

export const TreeGeos = {
  pine() {
    const parts = [];
    const trunk = new THREE.CylinderGeometry(0.16, 0.32, 9, 7); trunk.translate(0, 4.5, 0); parts.push(colorize(trunk, 0x4a3526));
    for (let i = 0; i < 5; i++) {
      const r = 2.6 - i * 0.45, h = 3.2 - i * 0.3;
      const c = new THREE.ConeGeometry(r, h, 9, 2); c.translate(0, 3.2 + i * 1.55, 0);
      jitter(c, 0.45, i + 3); parts.push(colorize(c, [0x1f3a24, 0x24422a, 0x2a4a2e, 0x2c4d30, 0x325636][i]));
    }
    return mergeC(parts);
  },
  birch() {
    const parts = [];
    const trunk = new THREE.CylinderGeometry(0.12, 0.2, 8, 6); trunk.translate(0, 4, 0); parts.push(colorize(trunk, 0xcfc8b8));
    for (let i = 0; i < 4; i++) { const s = new THREE.IcosahedronGeometry(1.6 - i * 0.15, 1); s.translate(Math.sin(i * 2.1) * 1, 5.5 + i * 0.9, Math.cos(i * 2.1) * 1); jitter(s, 0.5, i + 9); parts.push(colorize(s, [0x5a7a30, 0x6a8a38, 0x4f6e2a, 0x7a9440][i])); }
    return mergeC(parts);
  },
  dead() {
    const parts = [];
    const trunk = new THREE.CylinderGeometry(0.1, 0.25, 5, 6); trunk.translate(0, 2.5, 0); parts.push(colorize(trunk, 0x5a4636));
    for (let i = 0; i < 5; i++) { const b = new THREE.CylinderGeometry(0.03, 0.09, 2.2, 5); b.translate(0, 1.1, 0); b.rotateZ(0.6 + i * 0.1); b.rotateY(i * 1.3); b.translate(0, 2.2 + i * 0.5, 0); parts.push(colorize(b, 0x5a4636)); }
    return mergeC(parts);
  },
  cactus() {
    const parts = [];
    const c = new THREE.CapsuleGeometry(0.3, 3.2, 4, 10); c.translate(0, 1.9, 0); parts.push(colorize(c, 0x4c6b35));
    const a1 = new THREE.CapsuleGeometry(0.2, 1.0, 4, 8); a1.translate(0.65, 2.4, 0); parts.push(colorize(a1, 0x557a3a));
    const a2 = new THREE.CapsuleGeometry(0.18, 0.4, 4, 8); a2.rotateZ(Math.PI / 2); a2.translate(0.4, 1.9, 0); parts.push(colorize(a2, 0x557a3a));
    const a3 = new THREE.CapsuleGeometry(0.18, 0.8, 4, 8); a3.translate(-0.6, 2.8, 0); parts.push(colorize(a3, 0x4c6b35));
    const a4 = new THREE.CapsuleGeometry(0.16, 0.4, 4, 8); a4.rotateZ(Math.PI / 2); a4.translate(-0.35, 2.4, 0); parts.push(colorize(a4, 0x4c6b35));
    return mergeC(parts);
  },
  bush(c = 0x3d5a2a) {
    const parts = [];
    for (let i = 0; i < 3; i++) { const s = new THREE.IcosahedronGeometry(0.7 - i * 0.1, 1); s.translate(Math.sin(i * 2) * 0.5, 0.45, Math.cos(i * 2) * 0.5); jitter(s, 0.3, i + 20); parts.push(colorize(s, c)); }
    return mergeC(parts);
  },
  rock() { const g = new THREE.IcosahedronGeometry(1, 1); jitter(g, 0.5, 5); g.scale(1, 0.7, 1); return colorize(g, 0xffffff); },
  tree() { // 広葉樹（街路樹）
    const parts = [];
    const trunk = new THREE.CylinderGeometry(0.15, 0.25, 4, 6); trunk.translate(0, 2, 0); parts.push(colorize(trunk, 0x4a3526));
    for (let i = 0; i < 5; i++) { const s = new THREE.IcosahedronGeometry(1.4, 1); s.translate(Math.sin(i * 1.3) * 1.1, 4.2 + (i % 2) * 0.8, Math.cos(i * 1.3) * 1.1); jitter(s, 0.5, i + 40); parts.push(colorize(s, [0x2f5a24, 0x3a6a2c, 0x2a4a20, 0x40702e, 0x355f28][i])); }
    return mergeC(parts);
  },
};

export function instanced(scene, geo, list, matOpts = {}, shadow = true) {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, ...matOpts });
  const im = new THREE.InstancedMesh(geo, mat, list.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
  list.forEach((it, i) => {
    q.setFromEuler(new THREE.Euler(it.rx || 0, it.ry || 0, it.rz || 0));
    m.compose(p.set(it.x, it.y, it.z), q, s.set(it.sx || it.s, it.sy || it.s, it.sz || it.s));
    im.setMatrixAt(i, m);
    if (it.c !== undefined) im.setColorAt(i, c.setScalar(it.c));
  });
  im.castShadow = shadow; im.receiveShadow = true;
  im.computeBoundingSphere();
  scene.add(im);
  return im;
}

// 風になびく草
export function grassField(scene, count, placeFn, colorA = 0x2b4a1c, colorB = 0x8aa04a, height = 0.7) {
  if (count <= 0) return null;
  const blades = [];
  const r = mulberry32(99);
  for (let i = 0; i < 7; i++) {
    const a = r() * Math.PI * 2, d = r() * 0.35, h = height * (0.7 + r() * 0.6), w = 0.06;
    const bx = Math.cos(a) * d, bz = Math.sin(a) * d, ang = r() * Math.PI;
    const lean = (r() - 0.5) * 0.3;
    const dx = Math.cos(ang) * w, dz = Math.sin(ang) * w;
    blades.push(bx - dx, 0, bz - dz, bx + dx, 0, bz + dz, bx + lean, h, bz + lean * 0.5);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(blades), 3));
  const cols = []; const A = new THREE.Color(colorA), Bc = new THREE.Color(colorB);
  for (let i = 0; i < blades.length / 3; i++) { const c = i % 3 === 2 ? Bc : A; cols.push(c.r, c.g, c.b); }
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3));
  const n = new Float32Array(blades.length); for (let i = 0; i < n.length; i += 3) { n[i] = 0; n[i + 1] = 1; n[i + 2] = 0; }
  g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = { value: 0 };
    mat.userData.shader = sh;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      vec4 wp0 = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
      float wv = sin(uTime*1.8 + wp0.x*0.18 + wp0.z*0.11)*0.6 + sin(uTime*3.1 + wp0.x*0.5)*0.25;
      transformed.x += wv * position.y * 0.35; transformed.z += wv * position.y * 0.15;`);
  };
  const im = new THREE.InstancedMesh(g, mat, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), e = new THREE.Euler();
  let k = 0, tries = 0;
  while (k < count && tries < count * 6) {
    tries++;
    const pt = placeFn();
    if (!pt) continue;
    q.setFromEuler(e.set(0, r() * 6.28, 0));
    const sc = 0.7 + r() * 0.8;
    m.compose(p.set(pt[0], pt[1], pt[2]), q, s.set(sc, sc * (0.8 + r() * 0.5), sc));
    im.setMatrixAt(k++, m);
  }
  im.count = k;
  im.receiveShadow = true; im.castShadow = false;
  im.frustumCulled = false;
  scene.add(im);
  return im;
}
