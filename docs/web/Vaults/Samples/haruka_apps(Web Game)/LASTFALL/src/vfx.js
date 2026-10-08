// VFX: パーティクル、トレーサー、デカール、ゴア（血しぶき・肉片・切断部位）、爆発
import * as THREE from 'three';
import { G } from './state.js';
import { tex } from './textures.js';
import { rand, pick, clamp, lerp } from './util.js';

const PVS = `
attribute vec3 color; attribute float alpha; attribute float size; attribute float tile; attribute float rot;
uniform float uScale; varying vec3 vC; varying float vA; varying float vT; varying float vR;
void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=min(size*uScale/max(-mv.z,0.1),512.0); vC=color; vA=alpha; vT=tile; vR=rot; }`;
const PFS = `
uniform sampler2D map; uniform float uLight; varying vec3 vC; varying float vA; varying float vT; varying float vR;
void main(){ vec2 pc=gl_PointCoord-0.5; float c=cos(vR),s=sin(vR); pc=vec2(c*pc.x-s*pc.y,s*pc.x+c*pc.y)+0.5; if(pc.x<0.0||pc.y<0.0||pc.x>1.0||pc.y>1.0) discard;
  float col=mod(vT,2.0), row=floor(vT/2.0); vec2 uv=vec2((col+pc.x)*0.5, 1.0-(row+pc.y)*0.5);
  vec4 t=texture2D(map,uv); float a=t.a*vA; if(a<0.01) discard; gl_FragColor=vec4(vC*t.rgb*uLight,a); }`;

class Particles {
  constructor(max, additive) {
    this.max = max; this.n = 0;
    const g = this.geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(max * 3); this.col = new Float32Array(max * 3); this.alpha = new Float32Array(max); this.size = new Float32Array(max); this.tile = new Float32Array(max); this.rotA = new Float32Array(max);
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('tile', new THREE.BufferAttribute(this.tile, 1).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('rot', new THREE.BufferAttribute(this.rotA, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: tex('particles').map }, uScale: { value: 500 }, uLight: { value: 1 } },
      vertexShader: PVS, fragmentShader: PFS, transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, this.mat); this.points.frustumCulled = false; this.points.renderOrder = additive ? 3 : 2;
    // CPUデータ
    this.vel = new Float32Array(max * 3); this.life = new Float32Array(max); this.maxLife = new Float32Array(max);
    this.s0 = new Float32Array(max); this.s1 = new Float32Array(max); this.a0 = new Float32Array(max); this.grav = new Float32Array(max); this.drag = new Float32Array(max);
    this.flags = new Uint8Array(max); this.spin = new Float32Array(max); this.c0 = new Float32Array(max * 3); this.fadeIn = new Float32Array(max);
  }
  spawn(x, y, z, vx, vy, vz, o) {
    let i = this.n;
    if (i >= this.max) i = Math.floor(Math.random() * this.max); else this.n++;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    const c = o.color;
    this.c0[i * 3] = c[0]; this.c0[i * 3 + 1] = c[1]; this.c0[i * 3 + 2] = c[2];
    this.col[i * 3] = c[0]; this.col[i * 3 + 1] = c[1]; this.col[i * 3 + 2] = c[2];
    this.life[i] = this.maxLife[i] = o.life;
    this.s0[i] = o.size; this.s1[i] = o.size1 ?? o.size; this.size[i] = o.size;
    this.a0[i] = o.alpha ?? 1; this.alpha[i] = o.alpha ?? 1;
    this.grav[i] = o.grav ?? 0; this.drag[i] = o.drag ?? 0; this.tile[i] = o.tile ?? 0;
    this.flags[i] = o.flags || 0; this.rotA[i] = Math.random() * 6.28; this.spin[i] = o.spin ?? 0; this.fadeIn[i] = o.fadeIn || 0;
  }
  update(dt, vfx) {
    const P = this.pos, V = this.vel;
    const W = G.world;
    for (let i = 0; i < this.n; i++) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.kill(i); i--; continue; }
      const k = i * 3;
      const dr = Math.max(0, 1 - this.drag[i] * dt);
      V[k] *= dr; V[k + 1] = V[k + 1] * dr - this.grav[i] * dt; V[k + 2] *= dr;
      P[k] += V[k] * dt; P[k + 1] += V[k + 1] * dt; P[k + 2] += V[k + 2] * dt;
      const t = 1 - this.life[i] / this.maxLife[i];
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      let a = this.a0[i] * (1 - t * t);
      if (this.fadeIn[i] > 0) a *= Math.min(1, t / this.fadeIn[i]);
      this.alpha[i] = a;
      this.rotA[i] += this.spin[i] * dt;
      const f = this.flags[i];
      if (f & 2) { const h = 1 - t; this.col[k] = this.c0[k] * (0.4 + h); this.col[k + 1] = this.c0[k + 1] * h * h; this.col[k + 2] = this.c0[k + 2] * h * h * h; } // 火の冷却
      if ((f & 1) && V[k + 1] < 0) { // 血滴が地面に落ちたら血痕
        const gy = W ? W.groundAt(P[k], P[k + 2], P[k + 1] + 0.3, 0.02, 0.3) : 0;
        if (P[k + 1] <= gy + 0.02) {
          if (Math.random() < 0.22) vfx.bloodDecal(new THREE.Vector3(P[k], gy, P[k + 2]), new THREE.Vector3(0, 1, 0), rand(0.15, 0.45));
          this.kill(i); i--; continue;
        }
      }
    }
    const g = this.geo;
    g.setDrawRange(0, this.n);
    for (const a of ['position', 'color', 'alpha', 'size', 'tile', 'rot']) g.attributes[a].needsUpdate = true;
  }
  kill(i) {
    const j = --this.n;
    if (i === j) return;
    const c3 = (arr) => { arr[i * 3] = arr[j * 3]; arr[i * 3 + 1] = arr[j * 3 + 1]; arr[i * 3 + 2] = arr[j * 3 + 2]; };
    c3(this.pos); c3(this.vel); c3(this.col); c3(this.c0);
    for (const arr of [this.alpha, this.size, this.tile, this.rotA, this.life, this.maxLife, this.s0, this.s1, this.a0, this.grav, this.drag, this.flags, this.spin, this.fadeIn]) arr[i] = arr[j];
  }
  clear() { this.n = 0; }
}

const BLOOD = [[0.32, 0.01, 0.01], [0.42, 0.02, 0.02], [0.25, 0.0, 0.0], [0.5, 0.04, 0.03]];
const MONSTER_BLOOD = [[0.2, 0.02, 0.01], [0.28, 0.05, 0.02], [0.12, 0.02, 0.02], [0.35, 0.08, 0.03]];

export class VFX {
  constructor(scene) {
    this.scene = scene;
    this.norm = new Particles(4000, false);
    this.add = new Particles(2500, true);
    scene.add(this.norm.points, this.add.points);
    // トレーサー
    this.tracers = [];
    const tg = new THREE.CylinderGeometry(0.012, 0.012, 1, 4, 1, true); tg.translate(0, 0.5, 0); tg.rotateX(Math.PI / 2);
    const tm = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 3.5, 1.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    for (let i = 0; i < 64; i++) { const m = new THREE.Mesh(tg, tm); m.visible = false; m.frustumCulled = false; scene.add(m); this.tracers.push({ m, active: false }); }
    // デカール
    const dg = new THREE.PlaneGeometry(1, 1);
    this.decalGeo = dg;
    const btex = tex('blood').map;
    this.bloodMats = [0, 1, 2, 3].map((k) => { const t = btex.clone(); t.needsUpdate = true; t.repeat.set(0.5, 0.5); t.offset.set((k % 2) * 0.5, 0.5 - Math.floor(k / 2) * 0.5); return new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, roughness: 0.15, metalness: 0.1 }); });
    this.holeMat = new THREE.MeshStandardMaterial({ map: tex('bullethole').map, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, roughness: 0.9 });
    this.scorchMat = new THREE.MeshStandardMaterial({ map: tex('scorch').map, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, roughness: 1 });
    this.decals = { blood: [], hole: [], scorch: [] };
    this.decalMax = { blood: 260, hole: 160, scorch: 20 };
    // 肉片
    this.gibs = [];
    this.gibGeos = [new THREE.DodecahedronGeometry(0.06, 0), new THREE.IcosahedronGeometry(0.045, 0), new THREE.BoxGeometry(0.03, 0.03, 0.14), new THREE.TetrahedronGeometry(0.07, 0)];
    this.fleshMat = new THREE.MeshStandardMaterial({ color: 0x5a0808, roughness: 0.25, metalness: 0.1 });
    this.fleshMat2 = new THREE.MeshStandardMaterial({ color: 0x8a2a24, roughness: 0.35 });
    this.boneMat = new THREE.MeshStandardMaterial({ color: 0xe0d6c0, roughness: 0.5 });
    this.rigid = [];
    this.emitters = [];
    // フラッシュ
    this.flashes = [];
    const fm = new THREE.SpriteMaterial({ map: tex('flash').map, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xffc080 });
    for (let i = 0; i < 20; i++) { const s = new THREE.Sprite(fm.clone()); s.visible = false; scene.add(s); this.flashes.push({ s, t: 0 }); }
    this.lights = [];
    for (let i = 0; i < 4; i++) { const l = new THREE.PointLight(0xffa050, 0, 14, 2); l.visible = true; scene.add(l); this.lights.push({ l, t: 0, dur: 0.05, peak: 0 }); }
    this.rings = [];
    this.monsterColors = false;
  }
  get gore() { return G.settings.gore; }
  setLight(v) { this.norm.mat.uniforms.uLight.value = v; }
  resize() {
    const h = G.renderer.domElement.height;
    const s = h / (2 * Math.tan((G.camera.fov * Math.PI) / 360));
    this.norm.mat.uniforms.uScale.value = s; this.add.mat.uniforms.uScale.value = s;
  }
  clear() {
    this.norm.clear(); this.add.clear();
    for (const k of Object.keys(this.decals)) { for (const d of this.decals[k]) this.scene.remove(d.m); this.decals[k] = []; }
    for (const g of this.gibs) this.scene.remove(g.m); this.gibs = [];
    for (const r of this.rigid) this.scene.remove(r.obj); this.rigid = [];
    this.emitters = [];
    for (const t of this.tracers) { t.active = false; t.m.visible = false; }
    for (const r of this.rings) this.scene.remove(r.m); this.rings = [];
  }

  // ---- 基本 ----
  light(pos, color, peak, dur, range = 14) {
    const L = this.lights.reduce((a, b) => (a.t < b.t ? a : b));
    L.l.position.copy(pos); L.l.color.set(color); L.l.distance = range; L.t = dur; L.dur = dur; L.peak = peak; L.l.intensity = peak;
  }
  muzzle(pos, dir, big = false, light = true) {
    const f = this.flashes.find((x) => x.t <= 0) || this.flashes[0];
    f.s.position.copy(pos); f.t = 0.05; f.s.visible = true;
    const s = big ? 1.1 : 0.7; f.s.scale.set(s * rand(0.8, 1.2), s * rand(0.8, 1.2), 1); f.s.material.rotation = Math.random() * 6.28;
    if (light) this.light(pos, 0xffa050, big ? 40 : 25, 0.05, 12);
    // 煙
    for (let i = 0; i < 2; i++) this.norm.spawn(pos.x, pos.y, pos.z, dir.x * 2 + rand(-0.3, 0.3), dir.y * 2 + rand(0, 0.5), dir.z * 2 + rand(-0.3, 0.3), { color: [0.6, 0.6, 0.6], life: rand(0.4, 0.8), size: 0.15, size1: 0.6, alpha: 0.25, tile: 1, drag: 3, spin: 1 });
  }
  tracer(from, to, speed = 700) {
    const t = this.tracers.find((x) => !x.active);
    if (!t) return;
    const d = new THREE.Vector3().subVectors(to, from); const dist = d.length(); if (dist < 2) return;
    t.active = true; t.from = from.clone(); t.dir = d.normalize(); t.dist = dist; t.t = 0; t.speed = speed; t.m.visible = true;
  }

  // ---- 着弾 ----
  impact(p, n, mat) {
    const x = p.x, y = p.y, z = p.z;
    const N = this.norm, A = this.add;
    const col = { concrete: [0.55, 0.53, 0.5], metal: [0.4, 0.4, 0.42], wood: [0.45, 0.3, 0.18], sand: [0.75, 0.6, 0.4], dirt: [0.35, 0.28, 0.2], grass: [0.25, 0.3, 0.15], foliage: [0.2, 0.35, 0.12], water: [0.8, 0.85, 0.9] }[mat] || [0.5, 0.5, 0.5];
    const cnt = mat === 'water' ? 12 : 7;
    for (let i = 0; i < cnt; i++) {
      const s = mat === 'water' ? 5 : 3;
      N.spawn(x, y, z, n.x * rand(1, s) + rand(-1, 1), n.y * rand(1, s) + rand(0, mat === 'water' ? 5 : 2), n.z * rand(1, s) + rand(-1, 1), { color: col, life: rand(0.3, 0.8), size: rand(0.03, 0.07), grav: 9, tile: mat === 'water' ? 0 : 3, alpha: 0.9 });
    }
    // 粉塵
    for (let i = 0; i < 3; i++) N.spawn(x + n.x * 0.05, y + n.y * 0.05, z + n.z * 0.05, n.x * rand(0.5, 1.5), n.y * rand(0.5, 1.5) + 0.3, n.z * rand(0.5, 1.5), { color: col, life: rand(0.6, 1.4), size: 0.12, size1: rand(0.5, 0.9), alpha: 0.45, tile: 1, drag: 2.5, spin: rand(-1, 1) });
    if (mat === 'metal' || mat === 'concrete') {
      const sc = mat === 'metal' ? 10 : 3;
      for (let i = 0; i < sc; i++) A.spawn(x, y, z, n.x * rand(2, 7) + rand(-3, 3), n.y * rand(2, 7) + rand(0, 3), n.z * rand(2, 7) + rand(-3, 3), { color: [4, 2.4, 0.9], life: rand(0.15, 0.4), size: 0.035, grav: 12, tile: 3 });
      A.spawn(x, y, z, 0, 0, 0, { color: [3, 2, 1], life: 0.05, size: 0.35, tile: 0 });
    }
    if (mat !== 'water' && mat !== 'foliage' && !['sand', 'dirt', 'grass'].includes(mat)) this.decal('hole', p, n, rand(0.07, 0.11));
  }
  // ---- 血 ----
  blood(p, dir, dmg, opts = {}) {
    const gore = this.gore;
    const N = this.norm;
    const cols = opts.monster ? MONSTER_BLOOD : BLOOD;
    if (gore === 0) { for (let i = 0; i < 4; i++) N.spawn(p.x, p.y, p.z, rand(-1, 1), rand(0, 1), rand(-1, 1), { color: [0.5, 0.5, 0.5], life: 0.4, size: 0.1, size1: 0.3, alpha: 0.4, tile: 1 }); return; }
    const k = clamp(dmg / 30, 0.5, 3) * (gore === 2 ? 1.6 : 1);
    // 射出口からの噴出
    const n = Math.floor(14 * k);
    for (let i = 0; i < n; i++) {
      const sp = rand(2, 9) * (gore === 2 ? 1.3 : 1);
      N.spawn(p.x, p.y, p.z, dir.x * sp + rand(-1.5, 1.5), dir.y * sp + rand(-0.5, 2.5), dir.z * sp + rand(-1.5, 1.5), { color: pick(cols), life: rand(0.5, 1.2), size: rand(0.03, 0.09), grav: 11, tile: 2, flags: 1, drag: 0.5 });
    }
    // 入射側の飛沫
    for (let i = 0; i < n * 0.4; i++) N.spawn(p.x, p.y, p.z, -dir.x * rand(1, 3) + rand(-1, 1), rand(0, 2), -dir.z * rand(1, 3) + rand(-1, 1), { color: pick(cols), life: rand(0.3, 0.7), size: rand(0.03, 0.06), grav: 10, tile: 2, flags: 1 });
    // 血煙
    for (let i = 0; i < 3 * k; i++) N.spawn(p.x + dir.x * 0.1, p.y, p.z + dir.z * 0.1, dir.x * rand(0.5, 2) + rand(-0.3, 0.3), rand(-0.2, 0.4), dir.z * rand(0.5, 2) + rand(-0.3, 0.3), { color: pick(cols), life: rand(0.35, 0.8), size: 0.15, size1: rand(0.5, 1.0) * k * 0.7, alpha: 0.55, tile: 1, drag: 3, spin: rand(-2, 2) });
    // 背後の壁に血痕
    const hit = G.world.raycast(p, dir, 3.5);
    if (hit) this.bloodDecal(new THREE.Vector3(hit.x, hit.y, hit.z), new THREE.Vector3(hit.nx, hit.ny, hit.nz), rand(0.4, 1.0) * Math.min(k, 1.8));
    if (Math.random() < 0.6) {
      const gy = G.world.groundAt(p.x, p.z, p.y, 0.1, 0.1);
      if (p.y - gy < 2.5) this.bloodDecal(new THREE.Vector3(p.x + dir.x * rand(0.3, 1.2), gy, p.z + dir.z * rand(0.3, 1.2)), new THREE.Vector3(0, 1, 0), rand(0.3, 0.8) * k);
    }
    // 過激: 肉片
    if (gore === 2 && dmg >= 40) this.gibBurst(p, dir, Math.floor(dmg / 25), opts.monster);
  }
  bloodDecal(p, n, size) { if (this.gore > 0) this.decal('blood', p, n, size); }
  decal(kind, p, n, size) {
    const list = this.decals[kind];
    let d;
    if (list.length >= this.decalMax[kind]) { d = list.shift(); }
    else {
      const mat = kind === 'blood' ? pick(this.bloodMats) : kind === 'hole' ? this.holeMat : this.scorchMat;
      const m = new THREE.Mesh(this.decalGeo, mat); m.receiveShadow = true; m.renderOrder = 1; m.matrixAutoUpdate = true;
      this.scene.add(m); d = { m };
    }
    if (kind === 'blood') d.m.material = pick(this.bloodMats);
    const nn = n.clone().normalize();
    // 地形の法線に合わせる
    if (Math.abs(nn.y) > 0.9 && G.world) {
      const e = 0.4, h = (x, z) => G.world.height(x, z);
      const gt = h(p.x, p.z);
      if (Math.abs(p.y - gt) < 0.1) { nn.set(h(p.x - e, p.z) - h(p.x + e, p.z), 2 * e, h(p.x, p.z - e) - h(p.x, p.z + e)).normalize(); }
    }
    d.m.position.copy(p).addScaledVector(nn, 0.015 + Math.random() * 0.01);
    d.m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nn);
    d.m.rotateZ(Math.random() * 6.28);
    d.size = size; d.grow = kind === 'blood' ? 0 : 1;
    d.m.scale.setScalar(size * (d.grow < 1 ? 0.2 : 1));
    list.push(d);
  }
  gibBurst(p, dir, count, monster) {
    if (this.gore < 2) return;
    for (let i = 0; i < count; i++) {
      if (this.gibs.length > 110) { const g = this.gibs.shift(); this.scene.remove(g.m); }
      const bone = Math.random() < 0.25;
      const m = new THREE.Mesh(pick(this.gibGeos), bone ? this.boneMat : Math.random() < 0.5 ? this.fleshMat : this.fleshMat2);
      const s = rand(0.7, 1.8); m.scale.set(s, s * rand(0.6, 1.2), s);
      m.position.copy(p).add(new THREE.Vector3(rand(-0.1, 0.1), rand(-0.1, 0.1), rand(-0.1, 0.1)));
      m.castShadow = true;
      this.scene.add(m);
      const sp = rand(3, 9);
      this.gibs.push({ m, v: new THREE.Vector3(dir.x * sp + rand(-3, 3), dir.y * sp + rand(1, 6), dir.z * sp + rand(-3, 3)), w: new THREE.Vector3(rand(-15, 15), rand(-15, 15), rand(-15, 15)), life: 25, landed: false, trail: 0.6 });
    }
  }
  // 頭部破裂
  headExplode(p, dir, monster) {
    const N = this.norm;
    const cols = monster ? MONSTER_BLOOD : BLOOD;
    for (let i = 0; i < 70; i++) {
      const v = new THREE.Vector3(rand(-1, 1), rand(-0.2, 1.2), rand(-1, 1)).normalize().multiplyScalar(rand(2, 8)).addScaledVector(dir, rand(2, 6));
      N.spawn(p.x, p.y, p.z, v.x, v.y, v.z, { color: pick(cols), life: rand(0.6, 1.4), size: rand(0.04, 0.12), grav: 10, tile: 2, flags: 1 });
    }
    for (let i = 0; i < 8; i++) N.spawn(p.x, p.y, p.z, rand(-2, 2) + dir.x * 2, rand(-0.5, 1.5), rand(-2, 2) + dir.z * 2, { color: pick(cols), life: rand(0.6, 1.2), size: 0.3, size1: rand(1.2, 2), alpha: 0.6, tile: 1, drag: 2.5, spin: rand(-2, 2) });
    this.gibBurst(p, dir, 12, monster);
    const hit = G.world.raycast(p, dir, 5);
    if (hit) for (let i = 0; i < 2; i++) this.bloodDecal(new THREE.Vector3(hit.x, hit.y, hit.z).add(new THREE.Vector3(rand(-0.3, 0.3), rand(-0.3, 0.3), rand(-0.3, 0.3))), new THREE.Vector3(hit.nx, hit.ny, hit.nz), rand(0.8, 1.6));
  }
  // 切断された部位を剛体として飛ばす
  addRigid(objs, center, vel, monster) {
    if (this.rigid.length > 24) { const r = this.rigid.shift(); this.scene.remove(r.obj); }
    const grp = new THREE.Group();
    grp.position.copy(center);
    this.scene.add(grp); grp.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(grp.matrixWorld).invert();
    for (const o of objs) { o.matrix.premultiply(inv); o.matrixAutoUpdate = false; grp.add(o); }
    this.rigid.push({ obj: grp, v: vel.clone(), w: new THREE.Vector3(rand(-10, 10), rand(-10, 10), rand(-10, 10)), life: 40, bleed: 2.5, monster, r: 0.1 });
  }
  // 出血エミッター（首・切断面）
  addEmitter(getPos, getDir, life, rate, monster) { if (this.gore > 0) this.emitters.push({ getPos, getDir, life, rate, acc: 0, t: 0, monster }); }

  explosion(p, radius = 6, small = false) {
    const k = small ? 0.4 : 1;
    const N = this.norm, A = this.add;
    this.light(p, 0xff8030, 400, 0.35, 30);
    A.spawn(p.x, p.y + 0.5, p.z, 0, 0, 0, { color: [6, 4, 2], life: 0.15, size: 8, size1: 14, tile: 0 });
    for (let i = 0; i < 45 * k; i++) {
      const v = new THREE.Vector3(rand(-1, 1), rand(0, 1.3), rand(-1, 1)).normalize().multiplyScalar(rand(2, 9));
      A.spawn(p.x, p.y + 0.3, p.z, v.x, v.y, v.z, { color: [4, 1.8, 0.5], life: rand(0.3, 0.9), size: rand(0.8, 1.8), size1: rand(2, 3.5), tile: 1, drag: 4, flags: 2, spin: rand(-3, 3) });
    }
    for (let i = 0; i < 40 * k; i++) A.spawn(p.x, p.y + 0.3, p.z, rand(-18, 18), rand(3, 20), rand(-18, 18), { color: [5, 2.5, 0.8], life: rand(0.5, 1.5), size: 0.06, grav: 14, tile: 3 });
    for (let i = 0; i < 30 * k; i++) {
      const v = new THREE.Vector3(rand(-1, 1), rand(0.2, 1.5), rand(-1, 1)).normalize().multiplyScalar(rand(1, 5));
      N.spawn(p.x, p.y + 0.5, p.z, v.x, v.y, v.z, { color: [0.18, 0.16, 0.15], life: rand(2.5, 5), size: 1.2, size1: rand(4, 7), alpha: 0.7, tile: 1, drag: 1.2, grav: -0.6, spin: rand(-0.5, 0.5), fadeIn: 0.08 });
    }
    for (let i = 0; i < 40 * k; i++) N.spawn(p.x, p.y + 0.2, p.z, rand(-8, 8), rand(4, 14), rand(-8, 8), { color: [0.3, 0.25, 0.2], life: rand(1, 2), size: rand(0.04, 0.12), grav: 12, tile: 3 });
    const gy = G.world.groundAt(p.x, p.z, p.y + 0.5, 0.2, 1);
    if (p.y - gy < 1.5) this.decal('scorch', new THREE.Vector3(p.x, gy, p.z), new THREE.Vector3(0, 1, 0), radius * 0.8);
    // 衝撃波リング
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(2, 1.5, 1.1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(p.x, gy + 0.3, p.z); this.scene.add(ring);
    this.rings.push({ m: ring, t: 0 });
  }
  // モンスター出現・死亡の黒煙など
  smokePuff(p, color = [0.1, 0.05, 0.05], n = 12, size = 1.5) {
    for (let i = 0; i < n; i++) this.norm.spawn(p.x + rand(-0.5, 0.5), p.y + rand(0, 1), p.z + rand(-0.5, 0.5), rand(-1, 1), rand(0.2, 1.5), rand(-1, 1), { color, life: rand(1, 2.5), size: size * 0.5, size1: size * 2, alpha: 0.6, tile: 1, drag: 1, spin: rand(-1, 1), fadeIn: 0.1 });
  }
  fire(p, dt) { // 焚き火・燃えるドラム缶
    if (Math.random() < dt * 30) this.add.spawn(p.x + rand(-0.2, 0.2), p.y, p.z + rand(-0.2, 0.2), rand(-0.2, 0.2), rand(1, 2.2), rand(-0.2, 0.2), { color: [3, 1.2, 0.3], life: rand(0.4, 0.9), size: rand(0.3, 0.6), size1: 0.05, tile: 1, flags: 2, spin: rand(-2, 2) });
    if (Math.random() < dt * 6) this.norm.spawn(p.x, p.y + 1, p.z, rand(-0.2, 0.2), rand(0.8, 1.5), rand(-0.2, 0.2), { color: [0.2, 0.2, 0.2], life: rand(2, 3), size: 0.4, size1: 2, alpha: 0.3, tile: 1, drag: 0.5, fadeIn: 0.2 });
    if (Math.random() < dt * 4) this.add.spawn(p.x, p.y + 0.3, p.z, rand(-0.5, 0.5), rand(2, 4), rand(-0.5, 0.5), { color: [4, 1.5, 0.4], life: rand(1, 2), size: 0.03, tile: 3, drag: 0.5 });
  }

  update(dt) {
    this.norm.update(dt, this); this.add.update(dt, this);
    for (const f of this.flashes) if (f.t > 0) { f.t -= dt; if (f.t <= 0) f.s.visible = false; }
    for (const L of this.lights) { if (L.t > 0) { L.t -= dt; L.l.intensity = L.peak * Math.max(0, L.t / L.dur); } else L.l.intensity = 0; }
    for (const t of this.tracers) {
      if (!t.active) continue;
      t.t += dt;
      const head = Math.min(t.dist, t.t * t.speed), tail = Math.max(0, t.t * t.speed - 14);
      if (tail >= t.dist) { t.active = false; t.m.visible = false; continue; }
      t.m.position.copy(t.from).addScaledVector(t.dir, tail);
      t.m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), t.dir);
      t.m.scale.set(1, 1, Math.max(0.01, head - tail));
    }
    for (const k of ['blood']) for (const d of this.decals[k]) if (d.grow < 1) { d.grow = Math.min(1, d.grow + dt * 3); d.m.scale.setScalar(d.size * (0.2 + 0.8 * Math.sqrt(d.grow))); }
    // 肉片
    const W = G.world;
    const tmp = new THREE.Vector3();
    for (let i = this.gibs.length - 1; i >= 0; i--) {
      const g = this.gibs[i];
      g.life -= dt;
      if (g.life <= 0) { this.scene.remove(g.m); this.gibs.splice(i, 1); continue; }
      if (g.rest) continue;
      g.v.y -= 11 * dt;
      g.m.position.addScaledVector(g.v, dt);
      g.m.rotation.x += g.w.x * dt; g.m.rotation.y += g.w.y * dt; g.m.rotation.z += g.w.z * dt;
      if (g.trail > 0 && Math.random() < 0.5) { g.trail -= dt; const p = g.m.position; this.norm.spawn(p.x, p.y, p.z, rand(-0.3, 0.3), 0, rand(-0.3, 0.3), { color: pick(BLOOD), life: 0.5, size: 0.03, grav: 9, tile: 2, flags: 1 }); }
      tmp.copy(g.m.position);
      if (W.pushPoint(g.m.position, 0.04)) {
        if (!g.landed) { g.landed = true; this.bloodDecal(new THREE.Vector3(g.m.position.x, g.m.position.y - 0.04, g.m.position.z), new THREE.Vector3(0, 1, 0), rand(0.15, 0.35)); }
        g.v.y = Math.abs(g.v.y) * 0.25; g.v.x *= 0.6; g.v.z *= 0.6; g.w.multiplyScalar(0.6);
        if (g.v.lengthSq() < 0.3) g.rest = true;
      } else if (tmp.distanceToSquared(g.m.position) > 1e-6) { g.v.multiplyScalar(0.4); }
    }
    // 剛体部位
    const q = new THREE.Quaternion();
    for (let i = this.rigid.length - 1; i >= 0; i--) {
      const r = this.rigid[i];
      r.life -= dt;
      if (r.life <= 0) { this.scene.remove(r.obj); this.rigid.splice(i, 1); continue; }
      if (r.rest) continue;
      r.v.y -= 10 * dt;
      r.obj.position.addScaledVector(r.v, dt);
      const wl = r.w.length();
      if (wl > 0.001) { q.setFromAxisAngle(tmp.copy(r.w).divideScalar(wl), wl * dt); r.obj.quaternion.premultiply(q); }
      if (r.bleed > 0) { r.bleed -= dt; const p = r.obj.position; if (Math.random() < 0.7) this.norm.spawn(p.x, p.y, p.z, rand(-0.5, 0.5), rand(0, 1), rand(-0.5, 0.5), { color: pick(r.monster ? MONSTER_BLOOD : BLOOD), life: 0.7, size: 0.05, grav: 10, tile: 2, flags: 1 }); }
      if (W.pushPoint(r.obj.position, r.r)) {
        if (!r.landed) { r.landed = true; this.bloodDecal(new THREE.Vector3(r.obj.position.x, r.obj.position.y - r.r, r.obj.position.z), new THREE.Vector3(0, 1, 0), rand(0.4, 0.8)); }
        r.v.y = Math.abs(r.v.y) * 0.2; r.v.x *= 0.7; r.v.z *= 0.7; r.w.multiplyScalar(0.7);
        if (r.v.lengthSq() < 0.2 && r.w.lengthSq() < 0.5) r.rest = true;
      }
    }
    // 出血エミッター
    for (let i = this.emitters.length - 1; i >= 0; i--) {
      const e = this.emitters[i];
      e.t += dt; e.life -= dt;
      if (e.life <= 0) { this.emitters.splice(i, 1); continue; }
      const pulse = 0.5 + 0.5 * Math.sin(e.t * 9);
      e.acc += dt * e.rate * pulse * Math.min(1, e.life);
      const p = e.getPos(), d = e.getDir();
      while (e.acc > 1) {
        e.acc -= 1;
        const sp = rand(1.5, 4) * pulse + 0.5;
        this.norm.spawn(p.x, p.y, p.z, d.x * sp + rand(-0.4, 0.4), d.y * sp + rand(-0.2, 0.6), d.z * sp + rand(-0.4, 0.4), { color: pick(e.monster ? MONSTER_BLOOD : BLOOD), life: rand(0.5, 1), size: rand(0.03, 0.07), grav: 10, tile: 2, flags: 1 });
      }
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]; r.t += dt;
      r.m.scale.setScalar(1 + r.t * 40); r.m.material.opacity = Math.max(0, 1 - r.t * 3);
      if (r.t > 0.35) { this.scene.remove(r.m); r.m.geometry.dispose(); r.m.material.dispose(); this.rings.splice(i, 1); }
    }
  }
}
