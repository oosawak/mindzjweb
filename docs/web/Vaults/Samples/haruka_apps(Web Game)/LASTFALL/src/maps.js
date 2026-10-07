// マップ定義: ダストバレー / ブラックウッド / ネオンルイン / 射撃訓練場
import * as THREE from 'three';
import { World } from './world.js';
import { Heightmap, Builder, makeMaterials, house, container, sandbags, watchtower, car, crate, terrainMesh, TreeGeos, instanced, grassField } from './builder.js';
import { makeNoise2D, fbm, mulberry32, smoothstep, lerp, clamp } from './util.js';
import { tex, neonTex, signTex, targetTex } from './textures.js';
import { G } from './state.js';

const col = (h) => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const segDist = (px, pz, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az; const t = clamp(((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz), 0, 1); return Math.hypot(px - ax - dx * t, pz - az - dz * t); };

export const MAPS = {
  dust: { id: 'dust', name: 'ダストバレー', en: 'DUST VALLEY', desc: '灼熱の砂漠渓谷。開けた地形と軍事基地、廃れた町。長距離戦が鍵。', color: '#d9a55a' },
  forest: { id: 'forest', name: 'ブラックウッド', en: 'BLACKWOOD', desc: '霧に包まれた深い森と湖。視界が悪く、奇襲と近距離戦が多発する。', color: '#4f8a5a' },
  city: { id: 'city', name: 'ネオンルイン', en: 'NEON RUINS', desc: '雨に濡れた夜の廃都市。ネオンが照らす路地と高層ビル群での市街戦。', color: '#c050ff' },
  range: { id: 'range', name: '射撃訓練場', en: 'FIRING RANGE', desc: '', color: '#aaa' },
};

// 環境プリセット
const ENV = {
  dust: { sunDir: new THREE.Vector3(0.55, 0.42, -0.45), sunColor: '#ffd6a0', sunInt: 3.3, hemiSky: '#cfe0ff', hemiGround: '#a07a50', hemiInt: 0.85,
    skyTop: '#2f6fc4', skyHorizon: '#ecd0a6', skyBottom: '#c8a878', fog: '#dcc6a2', fogDensity: 0.0032, exposure: 0.85, clouds: 0.25, cloudColor: '#fff6ea',
    gain: [1.05, 1.0, 0.92], lift: [0.02, 0.01, 0], sat: 1.1, contrast: 1.1, envInt: 0.55, bloom: 0.35 },
  forest: { sunDir: new THREE.Vector3(-0.6, 0.22, 0.55), sunColor: '#ffb07a', sunInt: 1.9, hemiSky: '#9fb2c8', hemiGround: '#2e3622', hemiInt: 0.75,
    skyTop: '#465a78', skyHorizon: '#d8a17e', skyBottom: '#6d7478', fog: '#7a8288', fogDensity: 0.011, exposure: 1.0, clouds: 0.75, cloudColor: '#c8b0a8',
    gain: [1.0, 1.0, 1.02], lift: [0.0, 0.01, 0.02], sat: 0.95, contrast: 1.1, envInt: 0.5, bloom: 0.45 },
  city: { sunDir: new THREE.Vector3(0.3, 0.55, 0.5), sunColor: '#9ab4ff', sunInt: 0.85, sunDisk: '#dfe8ff', sunSize: 0.9992, moon: true, hemiSky: '#4a5a98', hemiGround: '#2a2030', hemiInt: 0.95,
    skyTop: '#04050d', skyHorizon: '#2d1f45', skyBottom: '#150f20', fog: '#241e38', fogDensity: 0.0085, exposure: 1.35, clouds: 0.5, cloudColor: '#2a2440', stars: 0.8,
    gain: [1.0, 0.97, 1.08], lift: [0.01, 0.0, 0.03], sat: 1.15, contrast: 1.12, envInt: 0.35, bloom: 0.85, bloomThreshold: 0.55 },
  range: { sunDir: new THREE.Vector3(0.4, 0.7, 0.3), sunColor: '#fff0dd', sunInt: 2.6, hemiSky: '#cfe0ff', hemiGround: '#6a6258', hemiInt: 0.9,
    skyTop: '#3a7ad0', skyHorizon: '#c8d8e8', fog: '#c0ccd8', fogDensity: 0.003, exposure: 0.95, clouds: 0.35, envInt: 0.6, bloom: 0.3 },
  horror: { sunDir: new THREE.Vector3(-0.3, 0.35, 0.6), sunColor: '#ff7a60', sunDisk: '#ff2a1a', sunSize: 0.9985, moon: true, sunInt: 1.0, hemiSky: '#8a7894', hemiGround: '#3a2426', hemiInt: 1.1,
    skyTop: '#050206', skyHorizon: '#3a0c0a', skyBottom: '#0e0608', fog: '#1c1012', fogDensity: 0.021, exposure: 1.45, clouds: 0.6, cloudColor: '#1a0808', stars: 0.3,
    gain: [1.05, 0.92, 0.9], lift: [0.015, 0.0, 0.01], sat: 0.8, contrast: 1.2, envInt: 0.2, bloom: 0.7, bloomThreshold: 0.92, vignette: 0.55 },
};

class Placer {
  constructor(S) { this.rects = []; this.S = S; }
  add(x, z, hw, hd, m = 3) { this.rects.push({ x, z, hw: hw + m, hd: hd + m }); }
  free(x, z, pad = 0) {
    if (Math.abs(x) > this.S - 8 || Math.abs(z) > this.S - 8) return false;
    for (const r of this.rects) if (Math.abs(x - r.x) < r.hw + pad && Math.abs(z - r.z) < r.hd + pad) return false;
    return true;
  }
}

export function buildMap(id, pve = false) {
  const scene = G.scene;
  const root = new THREE.Group(); root.name = 'map';
  scene.add(root);
  const fn = { dust: buildDust, forest: buildForest, city: buildCity, range: buildRange }[id];
  const t0 = performance.now();
  const info = fn(root);
  console.log('[map] ' + id + ' built in ' + Math.round(performance.now() - t0) + 'ms');
  info.id = id; info.root = root; info.pve = pve;
  info.env = pve && id !== 'range' ? { ...ENV.horror, ...(info.horrorTweak || {}) } : ENV[id];
  info.minimap = makeMinimap(info);
  info.dispose = () => {
    scene.remove(root);
    root.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose && !o.material.userData.shared) o.material.dispose(); });
    if (info.rain) { scene.remove(info.rain); }
  };
  return info;
}

function finishCommon(root, info) {
  // 水面
  if (info.waterLevel !== undefined) {
    const d = tex('detail');
    const nm = d.normal.clone(); nm.needsUpdate = true; nm.repeat.set(60, 60);
    const wm = new THREE.MeshStandardMaterial({ color: 0x1a3038, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.88, normalMap: nm, normalScale: new THREE.Vector2(0.25, 0.25) });
    const w = new THREE.Mesh(new THREE.PlaneGeometry(info.S * 2, info.S * 2), wm);
    w.rotation.x = -Math.PI / 2; w.position.y = info.waterLevel; w.receiveShadow = true;
    root.add(w);
    info.water = { mesh: w, nm };
    info.world.waterLevel = info.waterLevel;
  }
}

// ============================================================================
// ダストバレー（砂漠）
// ============================================================================
function buildDust(root) {
  const S = 280, n = makeNoise2D(101), rng = mulberry32(2024);
  const mesas = [[-190, 40, 32, 16], [60, -200, 38, 14], [200, 30, 30, 18], [-60, 200, 26, 12], [-210, -200, 30, 15]];
  const roads = [[0, 0, 150, -130], [0, 0, -130, 110], [0, 0, -150, -120], [0, 0, 140, 140], [150, -130, 140, 140]];
  const base = (x, z) => {
    let h = fbm(n, x / 150, z / 150, 4) * 7 + fbm(n, x / 35 + 50, z / 35, 3) * 1.0;
    h += Math.pow(Math.abs(n(x / 70 + 9, z / 110)), 1.6) * 5;
    const r = Math.hypot(x, z);
    h += smoothstep(195, 275, r) * (28 + n(x / 40, z / 40) * 8);
    for (const [mx, mz, mr, mh] of mesas) { const d = Math.hypot(x - mx, z - mz); h += smoothstep(mr, mr - 9, d) * mh * (1 + n(x / 15, z / 15) * 0.08); }
    return h;
  };
  const P = new Placer(S);
  const flats = [];
  const flat = (x, z, hw, hd, m = 12) => { flats.push({ x, z, hw, hd, m }); P.add(x, z, hw, hd); };
  flat(0, 0, 48, 48); flat(150, -130, 45, 40); flat(-130, 110, 26, 20); flat(-150, -120, 28, 28); flat(140, 140, 32, 28);
  const lone = [];
  for (let i = 0; i < 14; i++) {
    for (let t = 0; t < 30; t++) {
      const x = (rng() - 0.5) * 380, z = (rng() - 0.5) * 380;
      if (Math.hypot(x, z) > 190 || !P.free(x, z, 12)) continue;
      if (mesas.some(([mx, mz, mr]) => Math.hypot(x - mx, z - mz) < mr + 10)) continue;
      lone.push([x, z]); flat(x, z, 7, 7, 8); break;
    }
  }
  const hm = new Heightmap(S, base, flats);
  const surface = (x, z) => 'sand';
  const world = new World(S, hm.sample, surface);
  world.terrainMax = hm.max + 1;
  const M = makeMaterials(false);
  const B = new Builder(root, world, M);
  const loot = [];
  const Y = (x, z) => hm.sample(x, z);
  const sand = col(0xcfa76c), sand2 = col(0xb88a55), rock = col(0x8a5a3e), rock2 = col(0xa87a58), road = col(0x8c7050);
  const colorFn = (x, z, h, sl) => {
    let c = mix3(sand, sand2, n(x / 25, z / 25) * 0.5 + 0.5);
    c = mix3(c, mix3(rock, rock2, n(x / 8, z / 8) * 0.5 + 0.5), smoothstep(0.35, 0.8, sl));
    let rd = 1e9; for (const r of roads) rd = Math.min(rd, segDist(x, z, ...r));
    c = mix3(c, road, smoothstep(5, 2.5, rd) * 0.7);
    return c;
  };
  root.add(terrainMesh(hm, colorFn, 2, 100));

  // 町（中央）
  const wallMats = ['plaster', 'plasterWhite', 'plaster', 'concrete'];
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
    if (Math.abs(i) <= 0 && Math.abs(j) <= 0) continue;
    if (rng() < 0.15) continue;
    const x = i * 19 + (rng() - 0.5) * 3, z = j * 19 + (rng() - 0.5) * 3;
    const w = 8 + Math.floor(rng() * 5), d = 7 + Math.floor(rng() * 4);
    loot.push(...house(B, x, Y(x, z), z, Math.floor(rng() * 4), { w, d, floors: rng() < 0.45 ? 2 : 1, wall: wallMats[Math.floor(rng() * 4)], seed: i * 10 + j + 100 }));
  }
  // 市場の屋台
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2, x = Math.cos(a) * 7, z = Math.sin(a) * 7, y = Y(x, z);
    B.setT(x, y, z, k);
    for (const [px, pz] of [[-1.4, -1], [1.4, -1], [-1.4, 1], [1.4, 1]]) B.box(px, 0, pz, 0.12, 2.4, 0.12, 'woodDark');
    B.mesh(new THREE.BoxGeometry(3.4, 0.05, 2.6), 'tarp', 0, 2.5, 0, 0.12, 0, 0, 1, 1, 1);
    B.box(0, 0, -0.4, 2.6, 0.9, 1.0, 'wood');
    B.resetT();
    loot.push([x, z + 1.5, y]);
  }
  // 給水塔
  { const x = 12, z = -8, y = Y(x, z); B.setT(x, y, z, 0);
    for (const [a, b] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) B.box(a, 0, b, 0.25, 9, 0.25, 'darkMetal');
    const tank = new THREE.CylinderGeometry(2.6, 2.6, 3.5, 20); B.mesh(tank, 'rust', 0, 10.75, 0);
    const cap = new THREE.ConeGeometry(2.8, 1.2, 20); B.mesh(cap, 'rust', 0, 13.1, 0);
    B.world.addBox(x - 2.4, y + 9, z - 2.4, x + 2.4, y + 12.5, z + 2.4, 'metal');
    B.resetT(); }
  car(B, -8, Y(-8, 14), 14, 1, 'carRust'); car(B, 22, Y(22, 30), 30, 0, 'carWhite'); car(B, -30, Y(-30, -12), -12, 1, 'carRust');

  // 軍事基地
  { const cx = 150, cz = -130, y = Y(cx, cz);
    const cm = ['contRed', 'contBlue', 'contGreen', 'contYellow', 'contGray'];
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) {
      if (rng() < 0.25) continue;
      const x = cx - 30 + i * 8, z = cz + 14 + j * 5;
      const open = rng() < 0.4;
      loot.push(...container(B, x, y, z, 1 + (rng() < 0.5 ? 0 : 2), cm[Math.floor(rng() * 5)], open));
      if (!open && rng() < 0.4) container(B, x, y + 2.6, z, 1, cm[Math.floor(rng() * 5)]);
    }
    // 格納庫
    B.setT(cx + 15, y, cz - 18, 0);
    B.box(0, -0.3, 0, 26, 0.4, 18, 'concrete');
    B.wall('x', -13, 13, 9, 0.1, 9, 0.3, [{ at: 13, w: 3, y0: 0, h: 2.5 }], 'metal');
    B.wall('z', -9, 9, -13, 0.1, 9, 0.3, [], 'metal'); B.wall('z', -9, 9, 13, 0.1, 9, 0.3, [{ at: 9, w: 2, y0: 0, h: 2.4 }], 'metal');
    B.wall('x', -13, -5, -9, 0.1, 9, 0.3, [], 'metal'); B.wall('x', 5, 13, -9, 0.1, 9, 0.3, [], 'metal');
    B.box(0, 7, -9, 10, 2.1, 0.3, 'metal');
    B.box(0, 9.1, 0, 26.4, 0.3, 18.4, 'metal');
    for (let k = 0; k < 6; k++) B.box(-9 + k * 3.6, 0.1, 4, 1.2, 1.2, 1.2, 'wood');
    B.box(8, 0.1, 3, 3, 3.5, 1.2, 'darkMetal');
    B.resetT();
    loot.push([cx + 10, cz - 18, y + 0.2], [cx + 20, cz - 16, y + 0.2], [cx + 15, cz - 12, y + 0.2]);
    loot.push(...house(B, cx - 25, y, cz - 20, 0, { w: 14, d: 7, floors: 1, wall: 'concreteDark', seed: 55 }));
    loot.push(...house(B, cx - 25, y, cz - 6, 0, { w: 14, d: 7, floors: 1, wall: 'concreteDark', seed: 56 }));
    loot.push(...watchtower(B, cx - 40, y, cz - 35), ...watchtower(B, cx + 38, y, cz + 30));
    for (let k = 0; k < 8; k++) sandbags(B, cx - 38 + k * 10, y, cz - 38 + (k % 2) * 3, 0, 4);
    // フェンス
    for (let k = -4; k <= 4; k++) { B.box(cx + k * 10, y, cz + 40, 0.1, 2.4, 0.1, 'darkMetal', { collide: false }); }
  }
  // ガソリンスタンド
  { const cx = -130, cz = 110, y = Y(cx, cz);
    B.setT(cx, y, cz, 0);
    for (const [a, b] of [[-6, -3], [6, -3], [-6, 3], [6, 3]]) B.box(a, 0, b, 0.4, 5, 0.4, 'white');
    B.box(0, 5, 0, 15, 0.6, 9, 'red');
    for (const a of [-3, 3]) { B.box(a, 0, 0, 0.8, 1.6, 0.6, 'white'); B.box(a, 1.6, 0, 0.9, 0.4, 0.7, 'red', { collide: false }); }
    B.resetT();
    loot.push(...house(B, cx, y, cz + 12, 2, { w: 12, d: 8, floors: 1, wall: 'plasterWhite', seed: 77 }));
    car(B, cx - 4, y, cz - 7, 0, 'carBlue'); car(B, cx + 12, y, cz + 2, 1, 'carRust');
    loot.push([cx, cz, y + 0.1]);
  }
  // 廃墟
  { const cx = -150, cz = -120, y = Y(cx, cz);
    for (let k = 0; k < 14; k++) {
      const x = cx + (rng() - 0.5) * 44, z = cz + (rng() - 0.5) * 44;
      B.setT(x, Y(x, z), z, Math.floor(rng() * 4));
      B.box(0, 0, 0, 3 + rng() * 6, 0.8 + rng() * 2.6, 0.5, rng() < 0.5 ? 'plaster' : 'brick');
      B.resetT();
    }
    loot.push(...house(B, cx - 8, y, cz + 6, 1, { w: 10, d: 8, floors: 2, wall: 'brick', seed: 91 }));
    loot.push(...house(B, cx + 12, y, cz - 10, 0, { w: 9, d: 9, floors: 1, wall: 'plaster', seed: 92 }));
    for (let k = 0; k < 6; k++) loot.push([cx + (rng() - 0.5) * 30, cz + (rng() - 0.5) * 30, y + 0.1]);
  }
  // 農場
  { const cx = 140, cz = 140, y = Y(cx, cz);
    loot.push(...house(B, cx - 6, y, cz, 0, { w: 16, d: 12, floors: 1, wall: 'woodDark', roof: 'gable', roofMat: 'rust', seed: 33 }));
    loot.push(...house(B, cx + 16, y, cz + 12, 3, { w: 9, d: 8, floors: 2, wall: 'plaster', seed: 34 }));
    for (const [a, b] of [[12, -12], [18, -12]]) { B.setT(cx + a, y, cz + b, 0); B.mesh(new THREE.CylinderGeometry(2.4, 2.4, 11, 20), 'metal', 0, 5.5, 0); B.mesh(new THREE.SphereGeometry(2.4, 20, 8, 0, 6.3, 0, 1.6), 'metal', 0, 11, 0); B.resetT(); world.addBox(cx + a - 2, y, cz + b - 2, cx + a + 2, y + 12, cz + b + 2, 'metal'); }
    for (let k = 0; k < 6; k++) crate(B, cx - 20 + k * 1.3, y, cz - 16, 1.2, 'wood');
  }
  // 点在する家
  lone.forEach(([x, z], i) => loot.push(...house(B, x, Y(x, z), z, i % 4, { w: 7 + (i % 3), d: 6 + (i % 2) * 2, floors: i % 4 === 0 ? 2 : 1, wall: i % 2 ? 'plaster' : 'brick', seed: 300 + i })));
  B.finish();

  // 植生・岩
  const rocks = [], cacti = [], deads = [], bushes = [];
  for (let i = 0; i < 320; i++) {
    const x = (rng() - 0.5) * 2 * (S - 10), z = (rng() - 0.5) * 2 * (S - 10);
    if (!P.free(x, z, 2)) continue;
    const s = rng() < 0.12 ? 3 + rng() * 5 : 0.5 + rng() * 1.8;
    rocks.push({ x, y: Y(x, z) - s * 0.2, z, s, ry: rng() * 6, sy: s * (0.6 + rng() * 0.5), c: 0.55 + rng() * 0.2 });
    if (s > 1.2) world.addBox(x - s * 0.7, Y(x, z) - 1, z - s * 0.7, x + s * 0.7, Y(x, z) + s * 0.5, z + s * 0.7, 'concrete');
  }
  for (let i = 0; i < 200; i++) {
    const x = (rng() - 0.5) * 2 * (S - 20), z = (rng() - 0.5) * 2 * (S - 20);
    if (!P.free(x, z, 2) || Math.hypot(x, z) > 230) continue;
    const s = 0.8 + rng() * 0.6;
    cacti.push({ x, y: Y(x, z), z, s, ry: rng() * 6 });
    world.addBox(x - 0.3 * s, Y(x, z), z - 0.3 * s, x + 0.3 * s, Y(x, z) + 4 * s, z + 0.3 * s, 'foliage');
  }
  for (let i = 0; i < 60; i++) {
    const x = (rng() - 0.5) * 2 * (S - 20), z = (rng() - 0.5) * 2 * (S - 20);
    if (!P.free(x, z, 2)) continue;
    deads.push({ x, y: Y(x, z), z, s: 0.8 + rng() * 0.7, ry: rng() * 6 });
    world.addBox(x - 0.25, Y(x, z), z - 0.25, x + 0.25, Y(x, z) + 5, z + 0.25, 'wood');
  }
  for (let i = 0; i < 500; i++) {
    const x = (rng() - 0.5) * 2 * (S - 10), z = (rng() - 0.5) * 2 * (S - 10);
    if (!P.free(x, z, 1)) continue;
    bushes.push({ x, y: Y(x, z) - 0.1, z, s: 0.4 + rng() * 0.6, ry: rng() * 6 });
  }
  instanced(root, TreeGeos.rock(), rocks, { color: 0xb07e5c, flatShading: true });
  instanced(root, TreeGeos.cactus(), cacti);
  instanced(root, TreeGeos.dead(), deads);
  instanced(root, TreeGeos.bush(0x7a7040), bushes, {}, false);
  const q = G.settings.quality;
  const grass = grassField(root, [0, 6000, 14000, 24000][q], () => {
    const x = (rng() - 0.5) * 2 * (S - 10), z = (rng() - 0.5) * 2 * (S - 10);
    if (n(x / 30, z / 30) < 0.25 || !P.free(x, z, -2)) return null;
    return [x, Y(x, z), z];
  }, 0x6a5a30, 0xc8b070, 0.55);
  const info = { S, world, hm, loot, grass, P, colorFn, roads, houses: B.houses,
    randomOutdoor: () => { for (;;) { const x = (Math.random() - 0.5) * 2 * (S - 30), z = (Math.random() - 0.5) * 2 * (S - 30); if (P.free(x, z, 1)) return [x, Y(x, z), z]; } } };
  finishCommon(root, info);
  // 屋外ルート
  for (let i = 0; i < 40; i++) { const p = info.randomOutdoor(); loot.push([p[0], p[2], p[1]]); }
  return info;
}

// ============================================================================
// ブラックウッド（森林）
// ============================================================================
function buildForest(root) {
  const S = 280, n = makeNoise2D(202), rng = mulberry32(777);
  const lake = [70, 50, 60];
  const base = (x, z) => {
    let h = fbm(n, x / 170, z / 170, 4) * 22 + fbm(n, x / 45 + 20, z / 45, 3) * 3.5 + 6;
    const d = Math.hypot(x - lake[0], z - lake[1]);
    h = lerp(h, -4, smoothstep(lake[2] + 25, lake[2] - 20, d + n(x / 30, z / 30) * 14));
    h += smoothstep(215, 275, Math.hypot(x, z)) * 25;
    return h;
  };
  const P = new Placer(S);
  const flats = [];
  const flat = (x, z, hw, hd, m = 12) => { flats.push({ x, z, hw, hd, m }); P.add(x, z, hw, hd); };
  const pois = { lodge: [-100, -80], tower: [-160, 110], camp: [150, -120], village: [-40, 150], site: [10, -40], station: [175, 150], church: [-175, -175], dock: [70 - 58, 50 + 30] };
  flat(...pois.lodge, 26, 20); flat(...pois.tower, 10, 10); flat(...pois.camp, 32, 26); flat(...pois.village, 40, 30); flat(...pois.site, 16, 16);
  flat(...pois.station, 18, 18); flat(...pois.church, 16, 20);
  const cabins = [];
  for (let i = 0; i < 12; i++) for (let t = 0; t < 40; t++) {
    const x = (rng() - 0.5) * 420, z = (rng() - 0.5) * 420;
    if (Math.hypot(x - lake[0], z - lake[1]) < lake[2] + 25 || Math.hypot(x, z) > 200 || !P.free(x, z, 14)) continue;
    cabins.push([x, z]); flat(x, z, 6, 6, 8); break;
  }
  const hm = new Heightmap(S, base, flats);
  const surface = (x, z) => (hm.sample(x, z) < 0.3 ? 'water' : n(x / 20, z / 20) > 0.2 ? 'dirt' : 'grass');
  const world = new World(S, hm.sample, surface);
  world.terrainMax = hm.max + 1;
  const M = makeMaterials(false);
  const B = new Builder(root, world, M);
  const loot = [];
  const Y = (x, z) => hm.sample(x, z);
  const roads = [[...pois.lodge, ...pois.site], [...pois.site, ...pois.camp], [...pois.site, ...pois.village], [...pois.lodge, ...pois.church], [...pois.village, ...pois.tower], [...pois.camp, ...pois.station]];
  const grassC = col(0x3d5a26), grass2 = col(0x56702e), dirt = col(0x5a4632), rockC = col(0x6a6a64), mud = col(0x3a3024), pine = col(0x2d3a1e);
  const colorFn = (x, z, h, sl) => {
    let c = mix3(grassC, grass2, n(x / 18, z / 18) * 0.5 + 0.5);
    c = mix3(c, pine, smoothstep(0.1, 0.6, n(x / 60 + 5, z / 60)) * 0.6);
    c = mix3(c, dirt, smoothstep(0.3, 0.7, n(x / 12, z / 12)) * 0.4);
    c = mix3(c, rockC, smoothstep(0.45, 0.9, sl));
    c = mix3(c, mud, smoothstep(1.5, 0.2, h));
    let rd = 1e9; for (const r of roads) rd = Math.min(rd, segDist(x, z, ...r));
    c = mix3(c, dirt, smoothstep(4, 2, rd) * 0.8);
    return c;
  };
  root.add(terrainMesh(hm, colorFn, 2, 110));

  // ロッジ
  { const [x, z] = pois.lodge, y = Y(x, z);
    loot.push(...house(B, x, y, z, 0, { w: 18, d: 12, floors: 2, wall: 'woodDark', floor: 'wood', roof: 'gable', seed: 1 }));
    loot.push(...house(B, x + 16, y, z + 10, 1, { w: 8, d: 7, floors: 1, wall: 'wood', floor: 'wood', roof: 'gable', seed: 2 }));
    car(B, x - 14, y, z + 12, 1, 'carBlue');
    for (let k = 0; k < 10; k++) B.setT(x - 12 + k * 2.6, y, z - 12, 0), B.box(0, 0, 0, 0.15, 1.1, 0.15, 'woodDark', { collide: false }), B.resetT();
  }
  // 監視塔
  { const [x, z] = pois.tower; loot.push(...watchtower(B, x, Y(x, z), z, 12)); loot.push([x + 4, z + 4, Y(x, z) + 0.1]); }
  // 伐採キャンプ
  { const [cx, cz] = pois.camp, y = Y(cx, cz);
    for (let k = 0; k < 5; k++) { // 丸太の山
      const x = cx - 20 + k * 9, z = cz + 14;
      B.setT(x, y, z, 0);
      for (let r = 0; r < 3; r++) for (let q = 0; q < 4 - r; q++) { const g = new THREE.CylinderGeometry(0.35, 0.35, 6, 10); g.rotateZ(Math.PI / 2); g.rotateY(Math.PI / 2); B.mesh(g, 'bark', -1.05 + q * 0.7 + r * 0.35, 0.35 + r * 0.6, 0); }
      B.box(0, 0, 0, 2.8, 1.9, 6, null, { col: 'wood' });
      B.resetT();
    }
    // 小屋（開放型）
    for (let k = 0; k < 2; k++) {
      B.setT(cx - 10 + k * 22, y, cz - 8, 0);
      for (const [a, b] of [[-5, -3], [5, -3], [-5, 3], [5, 3]]) B.box(a, 0, b, 0.3, 4, 0.3, 'woodDark');
      B.box(0, 4, 0, 11, 0.25, 7, 'rust');
      B.box(0, 0, 2.8, 10, 1.2, 0.8, 'wood'); B.box(-3, 0, -1, 1.2, 1.2, 1.2, 'wood');
      B.resetT();
      loot.push([cx - 10 + k * 22, cz - 8, y + 0.1]);
    }
    loot.push(...container(B, cx + 20, y, cz + 2, 0, 'contGreen', true), ...container(B, cx + 20, y, cz - 6, 0, 'contRed'));
    loot.push(...house(B, cx - 22, y, cz - 16, 1, { w: 8, d: 6, wall: 'metal', seed: 7 }));
    car(B, cx + 4, y, cz + 2, 0, 'carRust');
  }
  // キャビン村
  { const [cx, cz] = pois.village;
    for (let i = 0; i < 6; i++) { const x = cx - 28 + (i % 3) * 26 + (rng() - 0.5) * 4, z = cz - 12 + Math.floor(i / 3) * 24; loot.push(...house(B, x, Y(x, z), z, Math.floor(rng() * 4), { w: 8 + Math.floor(rng() * 3), d: 7, floors: i === 4 ? 2 : 1, wall: 'wood', floor: 'wood', roof: 'gable', seed: 40 + i })); }
  }
  // キャンプ場
  const fires = [];
  { const [cx, cz] = pois.site, y = Y(cx, cz);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2, x = cx + Math.cos(a) * 9, z = cz + Math.sin(a) * 9;
      B.setT(x, Y(x, z), z, 0);
      const tg = new THREE.ConeGeometry(1.8, 2.2, 4); tg.rotateY(Math.PI / 4 + a);
      B.mesh(tg, 'tarp', 0, 1.1, 0);
      B.box(0, 0, 0, 2, 1.6, 2, null, { col: 'foliage' });
      B.resetT();
      loot.push([cx + Math.cos(a) * 6, cz + Math.sin(a) * 6, Y(x, z)]);
    }
    fires.push([cx, y + 0.3, cz]);
    B.setT(cx, y, cz, 0);
    for (let k = 0; k < 8; k++) { const g = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 6); B.mesh(g, 'stone', Math.cos(k * 0.785) * 0.8, 0.15, Math.sin(k * 0.785) * 0.8); }
    B.resetT();
  }
  // 無線局
  { const [cx, cz] = pois.station, y = Y(cx, cz);
    loot.push(...house(B, cx, y, cz, 2, { w: 12, d: 9, floors: 2, wall: 'concreteDark', seed: 81 }));
    B.setT(cx + 10, y, cz - 8, 0);
    for (let k = 0; k < 10; k++) { B.box(0, k * 3, 0, 1.6, 0.12, 1.6, 'darkMetal', { collide: false }); }
    for (const [a, b] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) B.box(a, 0, b, 0.1, 30, 0.1, 'darkMetal', { collide: false });
    B.box(0, 30, 0, 0.3, 0.3, 0.3, 'lamp', { collide: false });
    B.resetT();
    world.addBox(cx + 9.2, y, cz - 8.8, cx + 10.8, y + 30, cz - 7.2, 'metal');
  }
  // 廃教会
  { const [cx, cz] = pois.church, y = Y(cx, cz);
    loot.push(...house(B, cx, y, cz, 1, { w: 20, d: 11, floors: 1, wall: 'stone', floor: 'stone', roof: 'gable', roofMat: 'woodDark', seed: 99 }));
    B.setT(cx + 12, y, cz, 0);
    B.box(0, 0, 0, 4, 14, 4, 'stone'); const sp = new THREE.ConeGeometry(3, 6, 4); sp.rotateY(Math.PI / 4); B.mesh(sp, 'roof', 0, 17, 0);
    B.resetT();
    for (let k = 0; k < 12; k++) { const x = cx - 14 + (k % 4) * 3, z = cz - 12 + Math.floor(k / 4) * 3; B.setT(x, Y(x, z), z, 0); B.box(0, 0, 0, 0.6, 1.0, 0.2, 'stone'); B.resetT(); }
  }
  // 桟橋
  { const [x, z] = pois.dock; B.setT(x, 0.4, z, 0); B.box(0, 0, 0, 3, 0.2, 18, 'wood'); for (let k = 0; k < 5; k++) { B.box(-1.4, -3, -8 + k * 4, 0.2, 3, 0.2, 'woodDark', { collide: false }); B.box(1.4, -3, -8 + k * 4, 0.2, 3, 0.2, 'woodDark', { collide: false }); } B.resetT(); loot.push([x, z + 6, 0.6]); }
  cabins.forEach(([x, z], i) => loot.push(...house(B, x, Y(x, z), z, i % 4, { w: 7 + (i % 3), d: 6, wall: i % 2 ? 'wood' : 'woodDark', floor: 'wood', roof: 'gable', seed: 500 + i })));
  B.finish();

  // 森
  const pines = [], birches = [], bushes = [], rocks = [];
  const inLake = (x, z) => Y(x, z) < 1.2;
  for (let i = 0; i < 3200 && pines.length < 1700; i++) {
    const x = (rng() - 0.5) * 2 * (S - 6), z = (rng() - 0.5) * 2 * (S - 6);
    if (!P.free(x, z, 3) || inLake(x, z)) continue;
    if (n(x / 50, z / 50) < -0.35 && rng() < 0.8) continue; // 空き地
    let rd = 1e9; for (const r of roads) rd = Math.min(rd, segDist(x, z, ...r)); if (rd < 5) continue;
    const s = 0.8 + rng() * 0.8;
    if (rng() < 0.13) { birches.push({ x, y: Y(x, z), z, s, ry: rng() * 6 }); world.addBox(x - 0.2, Y(x, z), z - 0.2, x + 0.2, Y(x, z) + 7 * s, z + 0.2, 'wood'); }
    else { pines.push({ x, y: Y(x, z) - 0.2, z, s, ry: rng() * 6, c: 0.75 + rng() * 0.35 }); world.addBox(x - 0.28 * s, Y(x, z), z - 0.28 * s, x + 0.28 * s, Y(x, z) + 9 * s, z + 0.28 * s, 'wood'); }
  }
  for (let i = 0; i < 700; i++) { const x = (rng() - 0.5) * 2 * (S - 6), z = (rng() - 0.5) * 2 * (S - 6); if (!P.free(x, z, 1) || inLake(x, z)) continue; bushes.push({ x, y: Y(x, z) - 0.15, z, s: 0.6 + rng() * 0.8, ry: rng() * 6, c: 0.8 + rng() * 0.3 }); }
  for (let i = 0; i < 220; i++) {
    const x = (rng() - 0.5) * 2 * (S - 6), z = (rng() - 0.5) * 2 * (S - 6); if (!P.free(x, z, 2)) continue;
    const s = rng() < 0.15 ? 2.5 + rng() * 3 : 0.5 + rng() * 1.5;
    rocks.push({ x, y: Y(x, z) - s * 0.25, z, s, sy: s * 0.7, ry: rng() * 6, c: 0.45 + rng() * 0.2 });
    if (s > 1.2) world.addBox(x - s * 0.7, Y(x, z) - 1, z - s * 0.7, x + s * 0.7, Y(x, z) + s * 0.45, z + s * 0.7, 'concrete');
  }
  instanced(root, TreeGeos.pine(), pines);
  instanced(root, TreeGeos.birch(), birches);
  instanced(root, TreeGeos.bush(0x2f4a22), bushes, {}, false);
  instanced(root, TreeGeos.rock(), rocks, { color: 0x9a9a92, flatShading: true });
  const q = G.settings.quality;
  const grass = grassField(root, [0, 12000, 28000, 45000][q], () => {
    const x = (rng() - 0.5) * 2 * (S - 6), z = (rng() - 0.5) * 2 * (S - 6);
    if (!P.free(x, z, -3) || Y(x, z) < 0.6 || n(x / 22 + 3, z / 22) < -0.1) return null;
    return [x, Y(x, z), z];
  }, 0x1e3314, 0x6a8a3a, 0.75);
  const info = { S, world, hm, loot, grass, P, colorFn, roads, houses: B.houses, fires, waterLevel: 0,
    randomOutdoor: () => { for (;;) { const x = (Math.random() - 0.5) * 2 * (S - 30), z = (Math.random() - 0.5) * 2 * (S - 30); if (P.free(x, z, 1) && Y(x, z) > 0.8) return [x, Y(x, z), z]; } } };
  finishCommon(root, info);
  for (let i = 0; i < 40; i++) { const p = info.randomOutdoor(); loot.push([p[0], p[2], p[1]]); }
  return info;
}

// ============================================================================
// ネオンルイン（夜の都市）
// ============================================================================
function facadeTex(seed, lit) {
  const r = mulberry32(seed);
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  const e = document.createElement('canvas'); e.width = 256; e.height = 256; const ge = e.getContext('2d');
  const baseC = ['#4a4a52', '#5a524a', '#3c4450', '#52484a'][seed % 4];
  g.fillStyle = baseC; g.fillRect(0, 0, 256, 256);
  ge.fillStyle = '#000'; ge.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const x = i * 64 + 10, y = j * 64 + 14;
    g.fillStyle = '#15181e'; g.fillRect(x, y, 44, 36);
    g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(x, y, 44, 4);
    g.fillStyle = '#222'; g.fillRect(x - 2, y + 36, 48, 4);
    if (r() < lit) { const cc = ['#ffd9a0', '#fff0c8', '#a0c8ff', '#ffb070', '#e0ffe8'][Math.floor(r() * 5)]; ge.fillStyle = cc; ge.globalAlpha = 0.4 + r() * 0.6; ge.fillRect(x + 2, y + 2, 40, 32); ge.globalAlpha = 1; }
  }
  const t1 = new THREE.CanvasTexture(c); t1.colorSpace = THREE.SRGBColorSpace; t1.wrapS = t1.wrapT = THREE.RepeatWrapping;
  const t2 = new THREE.CanvasTexture(e); t2.colorSpace = THREE.SRGBColorSpace; t2.wrapS = t2.wrapT = THREE.RepeatWrapping;
  return [t1, t2];
}
function buildCity(root) {
  const S = 240, n = makeNoise2D(303), rng = mulberry32(4242);
  const base = (x, z) => n(x / 60, z / 60) * 0.15 + smoothstep(200, 238, Math.max(Math.abs(x), Math.abs(z))) * 22;
  const hm = new Heightmap(S, base, []);
  const surface = () => 'concrete';
  const world = new World(S, hm.sample, surface);
  world.terrainMax = hm.max + 1;
  const M = makeMaterials(true);
  for (let i = 0; i < 4; i++) {
    const [m, e] = facadeTex(i, 0.35);
    M['facade' + i] = new THREE.MeshStandardMaterial({ map: m, emissiveMap: e, emissive: 0xffffff, emissiveIntensity: 1.6, roughness: 0.6, metalness: 0.3 });
    M['facade' + i].userData.uv = 8;
  }
  M.sidewalk = M.concreteDark;
  const B = new Builder(root, world, M);
  const loot = [];
  const P = new Placer(S);
  const colorFn = (x, z, h, sl) => mix3(col(0x5a5a60), col(0x40403e), smoothstep(0.5, 3, h));
  const ground = terrainMesh(hm, colorFn, 2, 90);
  ground.material = new THREE.MeshStandardMaterial({ vertexColors: true, map: tex('asphalt').map, normalMap: tex('asphalt').normal, normalScale: new THREE.Vector2(0.35, 0.35), roughness: 0.42, metalness: 0.1 });
  root.add(ground);
  const blockSize = 46, pitch = 60;
  const neonTexts = [['ラーメン', '#ff3060', 'RAMEN'], ['ホテル', '#30c0ff', 'HOTEL'], ['カラオケ', '#ff40ff', 'KARAOKE'], ['薬局', '#40ff90', 'PHARMACY'], ['居酒屋', '#ffb020', 'IZAKAYA'], ['BAR', '#ff4040', 'OPEN'], ['24H', '#40e0ff', 'CONVENIENCE'], ['ゲーム', '#b060ff', 'ARCADE']];
  const neons = [];
  const lamps = [];
  const glowMat = new THREE.MeshBasicMaterial({ map: tex('glow').map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xffa050, opacity: 0.35 });
  for (let bi = -3; bi <= 3; bi++) for (let bj = -3; bj <= 3; bj++) {
    const cx = bi * pitch, cz = bj * pitch;
    // 歩道
    B.setT(cx, 0, cz, 0); B.box(0, -0.5, 0, blockSize + 3, 0.65, blockSize + 3, 'sidewalk'); B.resetT();
    const y = 0.15;
    const r = rng();
    const type = bi === 0 && bj === 0 ? 'plaza' : Math.abs(bi) === 3 || Math.abs(bj) === 3 ? (r < 0.5 ? 'tower' : r < 0.8 ? 'shops' : 'ruin') : r < 0.3 ? 'tower' : r < 0.65 ? 'shops' : r < 0.8 ? 'parking' : r < 0.9 ? 'ruin' : 'park';
    if (type === 'tower') {
      const nT = rng() < 0.5 ? 1 : 2;
      for (let k = 0; k < nT; k++) {
        const w = nT === 1 ? 30 + rng() * 10 : 18 + rng() * 4, d = nT === 1 ? 30 + rng() * 10 : 38;
        const x = nT === 1 ? cx : cx - 11 + k * 22, z = cz;
        const h = 25 + rng() * 55;
        B.setT(x, y, z, 0); B.box(0, 0, 0, w, h, d, 'facade' + Math.floor(rng() * 4)); B.box(0, h, 0, w + 0.6, 0.6, d + 0.6, 'trim'); B.box(0, 0, 0, w + 0.4, 4, d + 0.4, 'concreteDark', { collide: false });
        if (rng() < 0.6) B.box((rng() - 0.5) * w * 0.5, h + 0.6, (rng() - 0.5) * d * 0.5, 4, 3, 4, 'darkMetal', { collide: false });
        B.resetT();
        P.add(x, z, w / 2, d / 2, 1);
        // ネオン看板
        const nt = neonTexts[Math.floor(rng() * neonTexts.length)];
        neons.push({ x, z: z - d / 2 - 0.3, y: y + 6 + rng() * 6, t: nt, ry: 0 });
      }
      // 通用口の横に遮蔽物
      for (let k = 0; k < 3; k++) crate(B, cx + (rng() - 0.5) * 40, y, cz - blockSize / 2 + 1, 1.2, 'contGray');
    } else if (type === 'shops' || type === 'plaza') {
      if (type === 'plaza') {
        B.setT(cx, y, cz, 0);
        B.box(0, 0, 0, 10, 0.6, 10, 'stone'); B.box(0, 0.6, 0, 2, 3, 2, 'stone');
        B.resetT();
        for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.78; car(B, cx + Math.cos(a) * 16, y, cz + Math.sin(a) * 16, k, ['carRed', 'carBlue', 'carWhite', 'carRust'][k]); }
        for (let k = 0; k < 6; k++) loot.push([cx + (rng() - 0.5) * 36, cz + (rng() - 0.5) * 36, y]);
      } else {
        const cnt = 4;
        for (let k = 0; k < cnt; k++) {
          const qx = (k % 2) * 2 - 1, qz = Math.floor(k / 2) * 2 - 1;
          const x = cx + qx * 11, z = cz + qz * 11;
          const rot = qz < 0 ? 0 : 2;
          loot.push(...house(B, x, y, z, rot, { w: 16, d: 14, floors: 1 + Math.floor(rng() * 3), wall: rng() < 0.5 ? 'brick' : 'concrete', seed: bi * 100 + bj * 10 + k }));
          P.add(x, z, 8, 7, 1);
          const nt = neonTexts[Math.floor(rng() * neonTexts.length)];
          neons.push({ x, z: z + (qz < 0 ? -7.3 : 7.3), y: y + 4.2, t: nt, ry: qz < 0 ? 0 : Math.PI, small: true });
        }
      }
    } else if (type === 'parking') {
      for (let k = 0; k < 8; k++) car(B, cx - 16 + (k % 4) * 10, y, cz - 8 + Math.floor(k / 4) * 16, 1, ['carRed', 'carBlue', 'carWhite', 'carRust'][Math.floor(rng() * 4)]);
      B.setT(cx, y, cz, 0); B.box(0, 0, -22, 44, 1.1, 0.4, 'concreteDark'); B.box(0, 0, 22, 44, 1.1, 0.4, 'concreteDark'); B.resetT();
      loot.push(...container(B, cx + 14, y, cz, 1, 'contBlue', true));
      for (let k = 0; k < 4; k++) loot.push([cx + (rng() - 0.5) * 36, cz + (rng() - 0.5) * 30, y]);
    } else if (type === 'ruin') {
      for (let k = 0; k < 16; k++) {
        const x = cx + (rng() - 0.5) * 40, z = cz + (rng() - 0.5) * 40;
        B.setT(x, y, z, Math.floor(rng() * 4)); B.box(0, 0, 0, 2 + rng() * 8, 0.6 + rng() * 3.5, 0.6, rng() < 0.5 ? 'brick' : 'concrete'); B.resetT();
      }
      loot.push(...house(B, cx + 8, y, cz + 8, 1, { w: 12, d: 10, floors: 2, wall: 'brick', seed: 700 + bi * 7 + bj }));
      for (let k = 0; k < 5; k++) loot.push([cx + (rng() - 0.5) * 36, cz + (rng() - 0.5) * 36, y]);
    } else if (type === 'park') {
      const trees = [];
      for (let k = 0; k < 14; k++) { const x = cx + (rng() - 0.5) * 38, z = cz + (rng() - 0.5) * 38; trees.push({ x, y, z, s: 0.9 + rng() * 0.5, ry: rng() * 6 }); world.addBox(x - 0.25, y, z - 0.25, x + 0.25, y + 5, z + 0.25, 'wood'); }
      instanced(root, TreeGeos.tree(), trees);
      for (let k = 0; k < 4; k++) { B.setT(cx + (rng() - 0.5) * 30, y, cz + (rng() - 0.5) * 30, k); B.box(0, 0, 0, 2, 0.5, 0.6, 'wood'); B.resetT(); }
      for (let k = 0; k < 3; k++) loot.push([cx + (rng() - 0.5) * 30, cz + (rng() - 0.5) * 30, y]);
    }
    // 街灯
    for (const [a, b] of [[-1, -1], [1, 1]]) {
      const x = cx + a * (blockSize / 2 + 0.8), z = cz + b * (blockSize / 2 + 0.8);
      B.setT(x, y, z, 0); B.box(0, 0, 0, 0.18, 7, 0.18, 'darkMetal'); B.box(-a * 0.8, 7, 0, 1.8, 0.15, 0.3, 'darkMetal', { collide: false }); B.box(-a * 1.4, 6.85, 0, 0.6, 0.15, 0.3, 'lamp', { collide: false }); B.resetT();
      lamps.push([x - a * 1.4, z]);
    }
  }
  // 道路上の障害物
  for (let k = 0; k < 60; k++) {
    const onX = rng() < 0.5; const lane = (Math.floor(rng() * 7) - 3) * pitch + pitch / 2;
    const along = (rng() - 0.5) * 2 * 190;
    const x = onX ? along : lane, z = onX ? lane : along;
    if (Math.abs(x) > 200 || Math.abs(z) > 200) continue;
    const t = rng();
    if (t < 0.5) car(B, x + (rng() - 0.5) * 6, 0, z + (rng() - 0.5) * 6, onX ? 0 : 1, ['carRed', 'carBlue', 'carWhite', 'carRust'][Math.floor(rng() * 4)]);
    else if (t < 0.8) { B.setT(x, 0, z, onX ? 1 : 0); B.box(0, 0, 0, 3, 0.9, 0.6, 'concrete'); B.box(0, 0.9, 0, 3, 0.2, 0.3, 'concrete'); B.resetT(); }
    else { B.setT(x, 0, z, onX ? 0 : 1); B.box(0, 0, 0, 11, 3, 2.6, 'carRust'); B.box(0, 1.4, 0, 10.8, 1.0, 2.62, 'glass', { collide: false }); B.resetT(); }
    loot.push([x + 3, z + 3, 0.05]);
  }
  B.finish();
  // ネオンと街灯の光
  const signG = new THREE.PlaneGeometry(1, 1);
  const neonLights = [];
  neons.forEach((ne, i) => {
    const m = new THREE.MeshBasicMaterial({ map: neonTex(ne.t[0], ne.t[1], ne.t[2]), color: new THREE.Color(2.2, 2.2, 2.2) });
    const s = new THREE.Mesh(signG, m);
    const w = ne.small ? 4.5 : 9; s.scale.set(w, w * 0.375, 1);
    s.position.set(ne.x, ne.y, ne.z); s.rotation.y = ne.ry === 0 ? Math.PI : 0;
    root.add(s);
    const gl = new THREE.Mesh(signG, new THREE.MeshBasicMaterial({ map: tex('glow').map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: ne.t[1], opacity: 0.5 }));
    gl.scale.set(w * 1.8, w * 1.2, 1); gl.position.copy(s.position); gl.rotation.copy(s.rotation); gl.position.z += ne.ry === 0 ? -0.1 : 0.1;
    root.add(gl);
    // 地面の反射光
    const pool = new THREE.Mesh(signG, new THREE.MeshBasicMaterial({ map: tex('glow').map, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: ne.t[1], opacity: 0.35 }));
    pool.rotation.x = -Math.PI / 2; pool.scale.set(w * 1.5, 8, 1); pool.position.set(ne.x, 0.2, ne.z + (ne.ry === 0 ? -4 : 4));
    root.add(pool);
    neonLights.push({ mesh: s, glow: gl, phase: Math.random() * 10, flicker: Math.random() < 0.25 });
  });
  for (const [x, z] of lamps) {
    const pool = new THREE.Mesh(signG, glowMat); pool.rotation.x = -Math.PI / 2; pool.scale.set(12, 12, 1); pool.position.set(x, 0.2, z); root.add(pool);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow').map, color: 0xffb060, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8 }));
    halo.scale.set(3, 3, 1); halo.position.set(x, 7.1, z); root.add(halo);
  }
  // 実ライト（中央付近のみ）
  const pls = [];
  for (let i = 0; i < 6; i++) { const [x, z] = lamps[Math.floor(rng() * lamps.length)]; const pl = new THREE.PointLight(0xffa860, 30, 22, 1.6); pl.position.set(x, 6.5, z); root.add(pl); pls.push(pl); }
  // 雨
  const rain = makeRain(G.settings.quality);
  const info = { S, world, hm, loot, P, colorFn, neonLights, rainMesh: rain, houses: B.houses, horrorTweak: { fogDensity: 0.022 },
    randomOutdoor: () => { for (;;) { const x = (Math.random() - 0.5) * 2 * (S - 40), z = (Math.random() - 0.5) * 2 * (S - 40); if (P.free(x, z, 1)) return [x, hm.sample(x, z) + (Math.abs(x % pitch) < 25 && Math.abs(z % pitch) < 25 ? 0.15 : 0), z]; } } };
  root.add(rain);
  finishCommon(root, info);
  return info;
}
function makeRain(q) {
  const N = [1500, 3000, 6000, 9000][q];
  const pos = new Float32Array(N * 6), seed = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    const x = (Math.random() - 0.5) * 60, y = Math.random() * 30, z = (Math.random() - 0.5) * 60;
    pos.set([x, y, z, x, y, z], i * 6);
    seed[i * 2] = 0; seed[i * 2 + 1] = 1;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('end', new THREE.BufferAttribute(seed, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uColor: { value: new THREE.Color(0.16, 0.18, 0.26) } },
    vertexShader: `attribute float end; uniform float uTime; uniform vec3 uCam; varying float vA;
      void main(){ vec3 p=position; p.y=mod(p.y-uTime*22.0,30.0); p.x=mod(p.x-uCam.x+30.0,60.0)-30.0+uCam.x; p.z=mod(p.z-uCam.z+30.0,60.0)-30.0+uCam.z; p.y+=uCam.y-12.0;
        p.y+=end*0.7; p.x+=end*0.08; vA=end; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
    fragmentShader: `uniform vec3 uColor; varying float vA; void main(){ gl_FragColor=vec4(uColor*(0.3+vA*0.7),1.0); }`,
  });
  const l = new THREE.LineSegments(g, m); l.frustumCulled = false;
  return l;
}

// ============================================================================
// 射撃訓練場
// ============================================================================
function buildRange(root) {
  const S = 110;
  const hm = new Heightmap(S, (x, z) => smoothstep(90, 108, Math.max(Math.abs(x), Math.abs(z))) * 12, []);
  const world = new World(S, hm.sample, () => 'concrete');
  world.terrainMax = hm.max + 1;
  const M = makeMaterials(false);
  const B = new Builder(root, world, M);
  const colorFn = (x, z, h) => (Math.abs(x) < 42 && z < 45 && z > -170 ? col(0x9a968e) : col(0x6a7a4a));
  root.add(terrainMesh(hm, colorFn, 2, 60));
  // 射撃レーン床
  B.setT(0, 0, 0, 0);
  B.box(0, -0.5, 42, 60, 0.55, 14, 'concrete'); // 射座
  for (let i = -5; i <= 5; i++) B.box(i * 5, 0.05, 36.6, 0.12, 1.1, 1.2, 'concrete'); // 仕切り
  B.box(0, 0.05, 35.6, 56, 1.0, 0.4, 'wood'); // カウンター
  B.box(0, 4.2, 42, 60, 0.3, 8, 'concrete', { collide: false }); // 屋根
  for (const x of [-29, 29]) for (const z of [38.5, 45.5]) B.box(x, 0, z, 0.3, 4.2, 0.3, 'darkMetal');
  // 奥の防弾壁
  B.box(0, 0, -105, 90, 12, 3, 'concreteDark');
  B.box(-44, 0, -30, 2, 5, 150, 'concreteDark'); B.box(44, 0, -30, 2, 5, 150, 'concreteDark');
  // 武器テーブル
  B.box(-20, 0, 47, 22, 0.9, 1.5, 'woodDark');
  // 障害物コース（右側）
  for (let k = 0; k < 6; k++) { B.box(30 + (k % 2) * 6, 0, 20 - k * 10, 3, 1.1 + (k % 3) * 0.6, 0.6, 'concrete'); }
  container(B, 34, 0, -45, 1, 'contBlue', true); container(B, 34, 0, -60, 1, 'contRed');
  house(B, -32, 0, -40, 1, { w: 10, d: 8, floors: 2, wall: 'concrete', seed: 5 });
  B.resetT();
  B.finish();
  // 距離看板
  const dists = [10, 25, 50, 75, 100];
  for (const d of dists) {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshStandardMaterial({ map: signTex(d + 'm') }));
    s.position.set(-40, 3, 35 - d); root.add(s);
    const s2 = s.clone(); s2.position.x = 40; root.add(s2);
    const line = new THREE.Mesh(new THREE.PlaneGeometry(80, 0.15), new THREE.MeshBasicMaterial({ color: 0xd8b020 }));
    line.rotation.x = -Math.PI / 2; line.position.set(0, 0.02, 35 - d); root.add(line);
  }
  const info = { S, world, hm, loot: [], P: new Placer(S), colorFn, isRange: true, houses: B.houses,
    randomOutdoor: () => [0, 0, 20], spawn: [0, 0.05, 41], lanes: dists.map((d) => 35 - d) };
  finishCommon(root, info);
  return info;
}

// ミニマップ画像
function makeMinimap(info) {
  const N = 512, S = info.S;
  const c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d');
  const img = g.createImageData(N, N);
  const toS = (v) => Math.pow(Math.max(0, v), 1 / 2.2) * 255;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = (i / N) * 2 * S - S, z = (j / N) * 2 * S - S;
    const h = info.hm.sample(x, z);
    const e = 2, sl = (info.hm.sample(x - e, z) - info.hm.sample(x + e, z)) / (2 * e);
    let cc = info.colorFn(x, z, h, Math.abs(sl));
    const shade = clamp(0.85 + sl * 1.2, 0.5, 1.3);
    let r = toS(cc[0] * shade), gg = toS(cc[1] * shade), b = toS(cc[2] * shade);
    if (info.waterLevel !== undefined && h < info.waterLevel) { r = 40; gg = 70; b = 90; }
    const k = (j * N + i) * 4; img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const sc = N / (2 * S);
  for (const bx of info.world.boxes) {
    const hgt = bx.max[1] - bx.min[1];
    if (hgt < 1.5 || bx.mat === 'foliage') continue;
    const w = (bx.max[0] - bx.min[0]) * sc, d = (bx.max[2] - bx.min[2]) * sc;
    if (w * d < 1.2 && bx.mat === 'wood') { g.fillStyle = 'rgba(20,40,20,0.35)'; g.fillRect((bx.min[0] + S) * sc - 1, (bx.min[2] + S) * sc - 1, 3, 3); continue; }
    g.fillStyle = `rgba(${bx.mat === 'metal' ? '90,100,110' : '70,70,74'},0.85)`;
    g.fillRect((bx.min[0] + S) * sc, (bx.min[2] + S) * sc, Math.max(1, w), Math.max(1, d));
  }
  return c;
}

// 毎フレームの環境アニメーション
export function updateMap(info, dt, t) {
  if (info.grass && info.grass.material.userData.shader) info.grass.material.userData.shader.uniforms.uTime.value = t;
  if (info.water) { info.water.nm.offset.x = t * 0.01; info.water.nm.offset.y = t * 0.006; }
  if (info.rainMesh) { info.rainMesh.material.uniforms.uTime.value = t; info.rainMesh.material.uniforms.uCam.value.copy(G.camera.position); }
  if (info.neonLights) for (const nl of info.neonLights) {
    if (!nl.flicker) continue;
    const on = Math.sin(t * 13 + nl.phase) + Math.sin(t * 7.3 + nl.phase * 3) > -1.2;
    nl.mesh.material.color.setScalar(on ? 2.2 : 0.3); nl.glow.visible = on;
  }
}
