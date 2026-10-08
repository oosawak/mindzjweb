// 人型リグ（兵士・モンスター共通）、手続きアニメーション、ヒットボックス、ラグドール
import * as THREE from 'three';
import { camoTex, tex } from './textures.js';
import { G } from './state.js';
import { clamp, lerp, rand, pick } from './util.js';
import { mergeChildren } from './merge.js';

export const KINDS = {
  soldier: { s: 1, thigh: 0.45, shin: 0.45, ankle: 0.08, spine: 0.22, chest: 0.28, headR: 0.115, shW: 0.2, hipW: 0.1, uarm: 0.29, farm: 0.27, bulk: 1 },
  ghoul: { s: 1.03, thigh: 0.47, shin: 0.5, ankle: 0.07, spine: 0.22, chest: 0.27, headR: 0.11, shW: 0.19, hipW: 0.09, uarm: 0.38, farm: 0.42, bulk: 0.72 },
  crawler: { s: 0.95, thigh: 0.42, shin: 0.46, ankle: 0.06, spine: 0.3, chest: 0.3, headR: 0.12, shW: 0.18, hipW: 0.09, uarm: 0.46, farm: 0.5, bulk: 0.7 },
  brute: { s: 1.5, thigh: 0.42, shin: 0.42, ankle: 0.08, spine: 0.24, chest: 0.34, headR: 0.1, shW: 0.3, hipW: 0.14, uarm: 0.36, farm: 0.4, bulk: 1.7 },
  boss: { s: 2.5, thigh: 0.42, shin: 0.42, ankle: 0.08, spine: 0.24, chest: 0.34, headR: 0.11, shW: 0.3, hipW: 0.14, uarm: 0.4, farm: 0.46, bulk: 1.8 },
};

const CAMOS = [
  ['#56683e', '#7a8a52', '#3c4430', '#8b7d5e'], ['#c0aa80', '#9a8560', '#d8c5a0', '#7a6a50'],
  ['#6a7078', '#8e949a', '#4c5058', '#b0b4ba'], ['#3a3e46', '#4c515a', '#2c3036', '#60666e'],
  ['#6a5a7a', '#8a7a9a', '#4a4058', '#a898b8'], ['#3c5068', '#50667e', '#2c3a4a', '#7a8c9e'],
  ['#8a4a3a', '#a06a50', '#5a3a2e', '#c09070'],
];
const VESTS = ['#4a5038', '#6a5e46', '#3a3e44', '#7a6a50', '#4c5a3e'];

const DOWN = new THREE.Vector3(0, -1, 0);
function limb(r0, r1, len, mat, seg = 8) {
  const g = new THREE.CylinderGeometry(r0, r1, len, seg, 1);
  g.translate(0, -len / 2, 0);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; return m;
}
function ball(r, mat, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, seg = 12) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg * 0.7 | 0)), mat);
  m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; return m;
}
function boxm(w, h, d, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; return m; }

// ---- モデル生成 ---------------------------------------------------------------
export function buildBody(kind, look = {}) {
  const K = KINDS[kind];
  const root = new THREE.Group();
  const J = {};
  const segs = [];
  const mk = (name, parent, x, y, z) => { const o = new THREE.Object3D(); o.name = name; o.position.set(x, y, z); parent.add(o); J[name] = o; return o; };
  const seg = (joint, part) => { const s = new THREE.Group(); joint.add(s); segs.push({ obj: s, part, joint }); return s; };
  const legLen = K.thigh + K.shin + K.ankle;
  mk('hips', root, 0, legLen, 0);
  mk('spine', J.hips, 0, 0.06, 0);
  mk('chest', J.spine, 0, K.spine, 0);
  mk('neck', J.chest, 0, K.chest, 0);
  for (const [side, sx] of [['R', 1], ['L', -1]]) {
    mk('sh' + side, J.chest, sx * K.shW, K.chest - 0.05, 0);
    mk('el' + side, J['sh' + side], 0, -K.uarm, 0);
    mk('ha' + side, J['el' + side], 0, -K.farm, 0);
    mk('hip' + side, J.hips, sx * K.hipW, -0.03, 0);
    mk('kn' + side, J['hip' + side], 0, -K.thigh, 0);
    mk('ft' + side, J['kn' + side], 0, -K.shin, 0);
  }
  const b = K.bulk;
  const mats = {};
  const S = { hips: seg(J.hips, 'torso'), spine: seg(J.spine, 'torso'), chest: seg(J.chest, 'torso'), head: seg(J.neck, 'head') };
  for (const s of ['R', 'L']) { S['uarm' + s] = seg(J['sh' + s], 'uarm' + s); S['farm' + s] = seg(J['el' + s], 'farm' + s); S['thigh' + s] = seg(J['hip' + s], 'thigh' + s); S['shin' + s] = seg(J['kn' + s], 'shin' + s); }

  if (kind === 'soldier') {
    const camo = look.camo || pick(CAMOS);
    const cloth = new THREE.MeshStandardMaterial({ map: camoTex(camo, look.seed || 1), roughness: 0.9 });
    const vest = new THREE.MeshStandardMaterial({ color: look.vest || pick(VESTS), roughness: 0.8, map: tex('fabric').map });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.7 });
    const boot = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.8 });
    const skin = new THREE.MeshStandardMaterial({ color: look.skin || pick([0xc89878, 0x8a5a3a, 0xe0b090, 0x6a4028]), roughness: 0.7 });
    const helmetM = new THREE.MeshStandardMaterial({ color: look.helmet || pick([0x3a4030, 0x5a5040, 0x2a2c30, 0x4a4a3a]), roughness: 0.6, metalness: 0.2 });
    const lens = new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.1, metalness: 0.9, emissive: look.lens || 0x331a00, emissiveIntensity: 0.6 });
    Object.assign(mats, { cloth, vest, dark, boot, skin, helmetM, lens });
    // 骨盤・胴
    S.hips.add(ball(0.17, cloth, 0, 0, 0, 1.05, 0.7, 0.8));
    S.hips.add(boxm(0.34, 0.06, 0.22, dark, 0, 0.05, 0)); // ベルト
    S.hips.add(boxm(0.08, 0.12, 0.08, vest, 0.16, -0.02, -0.06)); // ホルスター
    S.spine.add(ball(0.16, cloth, 0, 0.12, 0, 1.05, 1.1, 0.8));
    S.chest.add(ball(0.19, cloth, 0, 0.12, 0, 1.08, 1.05, 0.78));
    const v = boxm(0.38, 0.36, 0.28, vest, 0, 0.1, 0); S.chest.add(v);
    for (let i = -1; i <= 1; i++) S.chest.add(boxm(0.09, 0.12, 0.06, vest, i * 0.11, 0.0, -0.165)); // マガジンポーチ
    S.chest.add(boxm(0.12, 0.08, 0.04, dark, 0.1, 0.2, -0.15)); // 無線
    if (look.backpack !== false) { S.chest.add(boxm(0.32, 0.42, 0.18, vest, 0, 0.1, 0.22)); S.chest.add(boxm(0.26, 0.12, 0.14, cloth, 0, 0.36, 0.22)); }
    // 肩パッド
    S.chest.add(ball(0.09, vest, 0.2, 0.24, 0, 1, 0.7, 1)); S.chest.add(ball(0.09, vest, -0.2, 0.24, 0, 1, 0.7, 1));
    // 頭
    S.head.add(limb(0.055, 0.06, 0.1, dark).translateY(0.1));
    S.head.add(ball(K.headR, dark, 0, 0.14, 0, 0.92, 1.05, 1)); // バラクラバ
    S.head.add(ball(0.05, skin, 0, 0.15, -0.095, 1.4, 0.5, 0.6)); // 目元
    const hm = look.hat === 'cap' ? boxm(0.22, 0.07, 0.25, helmetM, 0, 0.23, -0.02) : ball(0.135, helmetM, 0, 0.18, 0.005, 1, 0.78, 1.08, 14);
    S.head.add(hm);
    if (look.hat !== 'cap') S.head.add(boxm(0.17, 0.045, 0.05, lens, 0, 0.215, -0.115)); // ゴーグル
    else S.head.add(boxm(0.2, 0.02, 0.1, helmetM, 0, 0.2, -0.15));
    // 腕
    for (const s of ['R', 'L']) {
      S['uarm' + s].add(limb(0.065, 0.056, K.uarm, cloth));
      S['uarm' + s].add(ball(0.066, cloth, 0, -K.uarm, 0));
      S['farm' + s].add(limb(0.055, 0.047, K.farm, cloth));
      S['farm' + s].add(ball(0.052, dark, 0, -K.farm - 0.04, 0, 0.9, 1.3, 0.8)); // 手袋
      S['thigh' + s].add(limb(0.095, 0.075, K.thigh, cloth));
      S['thigh' + s].add(boxm(0.06, 0.12, 0.14, vest, (s === 'R' ? 1 : -1) * 0.09, -0.2, 0)); // カーゴポケット
      S['shin' + s].add(ball(0.07, vest, 0, 0, -0.05, 1, 1, 0.7)); // 膝パッド
      S['shin' + s].add(limb(0.072, 0.058, K.shin, cloth));
      S['shin' + s].add(boxm(0.11, 0.12, 0.26, boot, 0, -K.shin - 0.03, -0.05));
    }
  } else {
    // モンスター
    const fl = tex('flesh');
    const tint = { ghoul: 0x9a948c, crawler: 0xb8aaa2, brute: 0x8a6058, boss: 0x604040 }[kind];
    const flesh = new THREE.MeshStandardMaterial({ map: fl.map, normalMap: fl.normal, color: tint, roughness: 0.55, metalness: 0.05 });
    const wound = new THREE.MeshStandardMaterial({ color: 0x3a0404, roughness: 0.3, emissive: kind === 'boss' ? 0xff3300 : 0x000000, emissiveIntensity: kind === 'boss' ? 2.5 : 0 });
    const bone = new THREE.MeshStandardMaterial({ color: 0xd8ceb0, roughness: 0.5 });
    const eye = new THREE.MeshBasicMaterial({ color: kind === 'crawler' ? new THREE.Color(3, 3, 2) : kind === 'boss' ? new THREE.Color(8, 2, 0.5) : new THREE.Color(6, 0.6, 0.2) });
    const rag = new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 1, map: tex('fabric').map });
    Object.assign(mats, { flesh, wound, bone, eye, rag });
    S.hips.add(ball(0.16 * b, flesh, 0, 0, 0, 1.05, 0.7, 0.85));
    if (kind !== 'boss') S.hips.add(boxm(0.34 * b, 0.2, 0.24 * b, rag, 0, -0.04, 0));
    S.spine.add(ball(0.14 * b, flesh, 0, 0.11, 0, 1, 1.1, 0.8));
    S.chest.add(ball(0.18 * b, flesh, 0, 0.13, 0, 1.1, 1.05, 0.8));
    // 肋骨・傷
    for (let i = 0; i < 4; i++) { const r = boxm(0.2 * b, 0.018, 0.03, bone, 0, 0.04 + i * 0.05, -0.13 * b); r.rotation.z = (i % 2 ? 0.1 : -0.1); S.chest.add(r); }
    S.chest.add(ball(0.08 * b, wound, 0.06, 0.1, -0.12 * b, 1, 1.3, 0.4));
    S.spine.add(ball(0.06 * b, wound, -0.05, 0.1, -0.11 * b, 1.2, 1, 0.4));
    if (kind === 'brute' || kind === 'boss') {
      for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.035 * b, 0.22 * b, 6), bone); c.position.set((i % 2 ? 0.08 : -0.08) * b, 0.02 + i * 0.05, 0.14 * b); c.rotation.x = 1.2; c.castShadow = true; S.chest.add(c); }
      S.chest.add(ball(0.13 * b, flesh, 0.2, 0.24, 0, 1.2, 0.9, 1)); S.chest.add(ball(0.13 * b, flesh, -0.2, 0.24, 0, 1.2, 0.9, 1));
    }
    // 頭
    const hr = K.headR * (kind === 'brute' || kind === 'boss' ? 1.25 : 1);
    S.head.add(limb(0.05 * b, 0.06 * b, 0.1, flesh).translateY(0.1));
    const skull = ball(hr, flesh, 0, 0.13, 0, 0.9, kind === 'crawler' ? 1.3 : 1.1, 1.05); S.head.add(skull);
    // 顎（開いた口）
    const jaw = boxm(hr * 1.4, hr * 0.45, hr * 1.1, flesh, 0, 0.04, -0.03); jaw.rotation.x = 0.35; S.head.add(jaw); J.jaw = jaw;
    S.head.add(boxm(hr * 1.1, hr * 0.5, 0.02, wound, 0, 0.08, -hr * 0.95)); // 口内
    for (let i = 0; i < 6; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.008 * b + 0.006, 0.04, 4), bone); t.position.set(-hr * 0.45 + i * hr * 0.18, 0.1, -hr * 0.93); t.rotation.x = Math.PI; S.head.add(t); }
    if (kind !== 'crawler') { S.head.add(ball(0.02, eye, 0.04, 0.16, -hr * 0.88, 1, 0.7, 0.5, 6)); S.head.add(ball(0.02, eye, -0.04, 0.16, -hr * 0.88, 1, 0.7, 0.5, 6)); }
    else for (let i = 0; i < 4; i++) S.head.add(ball(0.012, eye, -0.05 + (i % 2) * 0.1, 0.22 + Math.floor(i / 2) * 0.04, -hr * 0.9, 1, 1, 0.5, 6));
    if (kind === 'boss') for (const sx of [-1, 1]) { const h = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.25, 8), bone); h.position.set(sx * 0.08, 0.25, 0); h.rotation.z = -sx * 0.6; S.head.add(h); }
    for (const s of ['R', 'L']) {
      S['uarm' + s].add(limb(0.06 * b, 0.05 * b, K.uarm, flesh));
      S['uarm' + s].add(ball(0.055 * b, flesh, 0, -K.uarm, 0));
      S['farm' + s].add(limb(0.05 * b, 0.04 * b, K.farm, flesh));
      // 爪
      for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.012 * b, 0.12 * (kind === 'crawler' ? 1.6 : 1) * Math.min(b, 1.3), 5), bone); c.position.set(-0.03 + i * 0.02, -K.farm - 0.08, -0.02); c.rotation.x = Math.PI + 0.3; S['farm' + s].add(c); }
      S['farm' + s].add(ball(0.045 * b, flesh, 0, -K.farm - 0.02, 0, 1, 1.2, 0.7));
      S['thigh' + s].add(limb(0.085 * b, 0.065 * b, K.thigh, flesh));
      S['shin' + s].add(limb(0.065 * b, 0.05 * b, K.shin, flesh));
      S['shin' + s].add(boxm(0.09 * b, 0.07, 0.2 * b, flesh, 0, -K.shin - 0.02, -0.05));
      if (Math.random() < 0.5) S['thigh' + s].add(ball(0.05 * b, wound, 0.05, -0.2, -0.06, 0.8, 1.4, 0.4));
    }
    if (kind === 'boss' || kind === 'brute') { const glow = new THREE.PointLight(kind === 'boss' ? 0xff4010 : 0xff2000, kind === 'boss' ? 6 : 1.5, kind === 'boss' ? 10 : 4); glow.position.set(0, 0.15, -0.3); S.head.add(glow); }
  }
  // セグメント単位でメッシュ結合（ドローコール削減）
  const ex = new Set(J.jaw ? [J.jaw] : []);
  for (const sg of segs) mergeChildren(sg.obj, ex);
  root.scale.setScalar(K.s);
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  // 銃のマウント（兵士）
  const gunMount = new THREE.Object3D(); gunMount.position.set(0.1, 0.12, -0.22); J.chest.add(gunMount);
  return { root, J, segs, mats, K, kind, gunMount, legLen, phase: Math.random() * 10, twitch: 0 };
}

// ---- IK ---------------------------------------------------------------------------
const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _v4 = new THREE.Vector3(), _q1 = new THREE.Quaternion();
function ik2(sh, el, T, a, bl, pole) {
  const S = sh.position;
  const d = _v1.subVectors(T, S);
  let L = d.length();
  L = clamp(L, Math.abs(a - bl) + 0.01, a + bl - 0.002);
  d.normalize();
  const cosA = clamp((a * a + L * L - bl * bl) / (2 * a * L), -1, 1);
  const A = Math.acos(cosA);
  const pd = _v2.copy(pole).addScaledVector(d, -pole.dot(d)).normalize();
  const E = _v3.copy(S).addScaledVector(d, Math.cos(A) * a).addScaledVector(pd, Math.sin(A) * a);
  const ud = _v4.subVectors(E, S).normalize();
  sh.quaternion.setFromUnitVectors(DOWN, ud);
  const Tn = _v2.copy(S).addScaledVector(d, L);
  const fd = _v4.subVectors(Tn, E).normalize().applyQuaternion(_q1.copy(sh.quaternion).invert());
  el.quaternion.setFromUnitVectors(DOWN, fd);
}

// ---- アニメーション -----------------------------------------------------------------
// st: { speed, moveAng, crouch, air, pitch, t, recoil, reload, attack, stagger, sprint, gunGrip, gunGuard, falling, chute }
const _t = new THREE.Vector3(), _pole = new THREE.Vector3();
export function animateBody(bd, st, dt) {
  const J = bd.J, K = bd.K;
  const sp = st.speed;
  const run = clamp(sp / 6.5, 0, 1.4);
  const isS = bd.kind === 'soldier';
  // 走り度合い（0=歩き 1=全力疾走）
  bd.sprintK = lerp(bd.sprintK || 0, isS ? clamp((sp - 4.0) / 3.0, 0, 1) : 0, 1 - Math.exp(-8 * dt));
  const R = bd.sprintK;
  if (isS) bd.phase += dt * (sp > 0.2 ? 0.8 + sp * 1.2 : 0);
  else { const freq = bd.kind === 'brute' || bd.kind === 'boss' ? 5.2 : bd.kind === 'crawler' ? 9 : 7.2; bd.phase += dt * (sp > 0.2 ? (1.4 + sp * 0.9) * (freq / 7.2) : 0); }
  const ph = bd.phase;
  const amp = isS ? clamp(sp / 4.5, 0, 1) * lerp(0.5, 1.0, R) : clamp(sp / 5, 0, 1) * (0.45 + run * 0.25);
  // 移動方向に合わせて下半身を捻る
  let legYaw = 0, dir = 1;
  if (sp > 0.3) {
    let a = st.moveAng;
    if (Math.abs(a) > Math.PI * 0.6) { dir = -1; a = a > 0 ? a - Math.PI : a + Math.PI; }
    legYaw = clamp(a, -1.1, 1.1);
  }
  bd.legYaw = lerp(bd.legYaw || 0, legYaw, 1 - Math.exp(-10 * dt));
  const twist = Math.sin(ph) * 0.2 * R * amp;
  J.hips.rotation.set(0, bd.legYaw + twist, 0);
  J.spine.rotation.set(0, -bd.legYaw * 0.6 - twist * 0.8, Math.sin(ph) * 0.04 * R);
  J.chest.rotation.set(0, -bd.legYaw * 0.4 - twist * 0.6, 0);
  const crouch = st.crouch || 0;
  let hipY = isS
    ? bd.legLen - crouch * 0.42 - (0.025 + 0.075 * R) * (1 - Math.abs(Math.sin(ph))) * clamp(sp / 3, 0, 1) - R * 0.05
    : bd.legLen - Math.abs(Math.sin(ph)) * 0.05 * amp - crouch * 0.42;
  for (const [s, off] of [['R', 0], ['L', Math.PI]]) {
    const p = ph * dir + off;
    let th, kn;
    if (isS) {
      th = Math.sin(p) * amp + R * 0.15;
      kn = -(0.05 + R * 0.2 + Math.max(0, Math.cos(p)) * (amp * 1.1 + R * 1.15));
    } else { th = Math.sin(p) * amp; kn = -Math.max(0, Math.cos(p)) * amp * 1.4 - 0.05; }
    th += crouch * 1.25; kn -= crouch * 1.9;
    if (st.air) { th = 0.7 + (s === 'R' ? 0.3 : -0.1); kn = -1.2; }
    J['hip' + s].rotation.set(th, 0, (s === 'R' ? -1 : 1) * 0.04);
    J['kn' + s].rotation.set(kn, 0, 0);
    J['ft' + s].rotation.set(-th - kn * 0.7, 0, 0);
  }
  if (isS) {
    J.hips.position.y = hipY;
    const pitch = st.pitch || 0;
    const lean = -0.05 - R * 0.32 - crouch * 0.15;
    J.spine.rotation.x = lean + pitch * 0.35 * (1 - R * 0.5);
    J.chest.rotation.x = pitch * 0.55 * (1 - R * 0.5) - (st.recoil || 0) * 0.08;
    J.neck.rotation.set(pitch * 0.25 - lean * 0.8, bd.legYaw * 0.3 - twist * 0.5, 0);
    const gm = bd.gunMount;
    const t = st.t;
    // ---- スカイダイブ ----
    if (st.falling) {
      const dv = st.dive || 0;
      const fl = Math.sin(t * 9.1) * 0.05, fl2 = Math.sin(t * 7.3 + 1) * 0.06, fl3 = Math.sin(t * 11.7 + 2) * 0.04;
      J.hips.position.y = bd.legLen; J.hips.rotation.set(0, 0, 0);
      J.spine.rotation.set(0.28 * (1 - dv), 0, 0); J.chest.rotation.set(0.12 * (1 - dv), 0, 0);
      J.neck.rotation.set(0.95 - dv * 0.5, 0, 0);
      J.shR.quaternion.setFromEuler(new THREE.Euler(0.15 * (1 - dv) + fl3, 0, lerp(1.95, 0.3, dv) + fl));
      J.shL.quaternion.setFromEuler(new THREE.Euler(0.15 * (1 - dv) - fl3, 0, -lerp(1.95, 0.3, dv) - fl2));
      J.elR.quaternion.setFromEuler(new THREE.Euler(0, 0, lerp(1.35, 0.05, dv)));
      J.elL.quaternion.setFromEuler(new THREE.Euler(0, 0, -lerp(1.35, 0.05, dv)));
      J.hipR.rotation.set(lerp(-0.1, 0, dv) + fl2 * 0.5, 0, lerp(0.38, 0.06, dv));
      J.hipL.rotation.set(lerp(-0.1, 0, dv) - fl * 0.5, 0, -lerp(0.38, 0.06, dv));
      J.knR.rotation.set(lerp(-1.45, -0.1, dv) + fl, 0, 0); J.knL.rotation.set(lerp(-1.45, -0.1, dv) + fl2, 0, 0);
      J.ftR.rotation.set(0.6, 0, 0); J.ftL.rotation.set(0.6, 0, 0);
      gm.visible = false; return;
    }
    // ---- 前転（体を丸める） ----
    if (st.roll) {
      J.hips.position.y = bd.legLen * 0.55; J.spine.rotation.set(-0.9, 0, 0); J.chest.rotation.set(-0.4, 0, 0); J.neck.rotation.set(-0.5, 0, 0);
      J.hipR.rotation.set(1.9, 0, -0.1); J.hipL.rotation.set(1.8, 0, 0.1); J.knR.rotation.set(-2.2, 0, 0); J.knL.rotation.set(-2.1, 0, 0);
      J.shR.quaternion.setFromEuler(new THREE.Euler(1.0, 0, 0.3)); J.shL.quaternion.setFromEuler(new THREE.Euler(1.0, 0, -0.3));
      J.elR.quaternion.setFromEuler(new THREE.Euler(1.4, 0, 0)); J.elL.quaternion.setFromEuler(new THREE.Euler(1.4, 0, 0));
      gm.visible = false; return;
    }
    // ---- 平泳ぎ ----
    if (st.swim) {
      const c = t * 3.2, s1 = Math.sin(c), s2 = Math.cos(c);
      J.hips.position.y = bd.legLen; J.spine.rotation.set(0.2, 0, 0); J.chest.rotation.set(0.1, 0, 0); J.neck.rotation.set(0.9, 0, 0);
      J.shR.quaternion.setFromEuler(new THREE.Euler(2.4 + s1 * 0.5, 0, 0.6 + s2 * 0.7)); J.shL.quaternion.setFromEuler(new THREE.Euler(2.4 + s1 * 0.5, 0, -0.6 - s2 * 0.7));
      J.elR.quaternion.setFromEuler(new THREE.Euler(0.4 + Math.max(0, s2) * 0.9, 0, 0)); J.elL.quaternion.setFromEuler(new THREE.Euler(0.4 + Math.max(0, s2) * 0.9, 0, 0));
      J.hipR.rotation.set(-0.1 + s1 * 0.25, 0, 0.25 + s2 * 0.2); J.hipL.rotation.set(-0.1 + s1 * 0.25, 0, -0.25 - s2 * 0.2);
      J.knR.rotation.set(-0.6 - Math.max(0, s1) * 0.9, 0, 0); J.knL.rotation.set(-0.6 - Math.max(0, s1) * 0.9, 0, 0);
      gm.visible = false; return;
    }
    // ---- パラシュート ----
    if (st.chute) {
      const sw = Math.sin(t * 1.1);
      J.hips.position.y = bd.legLen; J.spine.rotation.set(0.05, 0, 0); J.neck.rotation.set(-0.15, 0, 0);
      J.shR.quaternion.setFromEuler(new THREE.Euler(Math.PI - 0.25, 0, 0.35)); J.shL.quaternion.setFromEuler(new THREE.Euler(Math.PI - 0.25, 0, -0.35));
      J.elR.quaternion.setFromEuler(new THREE.Euler(0.35 + (st.pull || 0) * 0.8, 0, 0)); J.elL.quaternion.setFromEuler(new THREE.Euler(0.35 + (st.pullL || 0) * 0.8, 0, 0));
      J.hipR.rotation.set(0.15 + sw * 0.12, 0, -0.05); J.hipL.rotation.set(0.1 - sw * 0.12, 0, 0.05);
      J.knR.rotation.set(-0.3 - Math.max(0, sw) * 0.2, 0, 0); J.knL.rotation.set(-0.25 - Math.max(0, -sw) * 0.2, 0, 0);
      J.ftR.rotation.set(0.5, 0, 0); J.ftL.rotation.set(0.5, 0, 0);
      gm.visible = false; return;
    }
    gm.visible = !!st.hasGun;
    const pump = R > 0.45 && !st.reload;
    if (pump) {
      const b2 = Math.sin(ph * 2) * 0.025 * R;
      gm.position.set(0.06, 0.02 + b2, -0.16); gm.rotation.set(-0.55, 0.85, 0.35 + Math.sin(ph) * 0.12);
    } else { gm.position.set(0.1, 0.13 - (st.reload ? 0.08 : 0), -0.22 + (st.recoil || 0) * 0.05); gm.rotation.set(st.reload ? -0.5 : 0, st.reload ? 0.3 : 0, st.reload ? 0.3 : 0); }
    gm.updateMatrix();
    if (st.hasGun) {
      const grip = st.gunGrip || [0, -0.06, 0.08], guard = st.gunGuard || [0, -0.04, -0.2];
      _t.set(...grip).applyMatrix4(gm.matrix);
      ik2(J.shR, J.elR, _t, K.uarm, K.farm + 0.04, _pole.set(0.6, -1, 0.3));
      if (pump) {
        // 左腕を大きく振る
        J.shL.quaternion.setFromEuler(new THREE.Euler(Math.sin(ph) * 1.0 * amp + 0.15, 0, -0.18));
        J.elL.quaternion.setFromEuler(new THREE.Euler(1.35 + Math.max(0, Math.sin(ph)) * 0.35, 0, 0));
      } else {
        _t.set(...guard).applyMatrix4(gm.matrix);
        if (st.reload) _t.y -= 0.12 + Math.sin(st.t * 8) * 0.05;
        ik2(J.shL, J.elL, _t, K.uarm, K.farm + 0.04, _pole.set(-0.8, -1, 0.1));
      }
    } else {
      const aa = amp * (0.8 + R * 0.4);
      J.shR.quaternion.setFromEuler(new THREE.Euler(-Math.sin(ph) * aa + R * 0.1, 0, 0.12)); J.shL.quaternion.setFromEuler(new THREE.Euler(Math.sin(ph) * aa + R * 0.1, 0, -0.12));
      J.elR.quaternion.setFromEuler(new THREE.Euler(0.3 + R * 1.1, 0, 0)); J.elL.quaternion.setFromEuler(new THREE.Euler(0.3 + R * 1.1, 0, 0));
    }
  } else {
    // モンスターのポーズ
    const atk = st.attack || 0, strike = !!st.atkStrike;
    const t = st.t;
    // 痙攣（ランダムな目標へ素早く追従）
    bd.spT = (bd.spT || 0) - dt;
    if (bd.spT <= 0) { bd.spT = Math.random() < 0.25 ? rand(0.05, 0.15) : rand(0.4, 1.6); bd.spA = [rand(-1, 1), rand(-1, 1), rand(-1, 1)].map((v) => v * (Math.random() < 0.3 ? 0.7 : 0.15)); }
    bd.sp = bd.sp || [0, 0, 0];
    for (let i = 0; i < 3; i++) bd.sp[i] += (bd.spA[i] - bd.sp[i]) * Math.min(1, dt * 22);
    const [s0, s1, s2] = bd.sp;
    if (bd.tilt === undefined) bd.tilt = rand(-0.5, 0.5);
    const moving = clamp(sp / 2, 0, 1);
    const roar = st.roar || 0;
    const emerge = st.emerge ?? 1;
    if (bd.kind === 'crawler') {
      // 蜘蛛のような四つ足の這い
      J.hips.position.y = bd.legLen * (st.air ? 0.8 : 0.58) + Math.abs(Math.sin(ph * 2)) * 0.05 * moving;
      J.hips.rotation.z = Math.sin(ph) * 0.12 * moving;
      J.spine.rotation.set(-1.4 + Math.sin(ph * 2) * 0.06, 0, Math.sin(ph) * 0.15 * moving + s0 * 0.3);
      J.chest.rotation.set(-0.15 + atk * 0.5 - roar * 0.6, s1 * 0.3, -Math.sin(ph) * 0.12);
      // 首を逆さまにねじる
      J.neck.rotation.set(1.25 + s1 * 0.4 - roar * 0.5, s2 * 0.5, Math.PI * 0.82 + bd.tilt * 0.4 + s0);
      for (const [sd, off] of [['R', Math.PI], ['L', 0]]) {
        const p = ph + off, side = sd === 'R' ? 1 : -1;
        const sw = Math.sin(p) * amp * 1.1;
        let ax = 1.45 + sw, ez = -0.35 - Math.max(0, Math.cos(p)) * amp * 1.2;
        if (st.air) { ax = 2.6; ez = -0.1; }
        if (atk > 0) { ax = strike ? lerp(0.6, 2.8, atk) : lerp(ax, 2.9, atk); ez = -0.2 - atk * 0.5; }
        J['sh' + sd].quaternion.setFromEuler(new THREE.Euler(ax, 0, side * (0.45 + Math.max(0, -Math.cos(p)) * 0.3 * moving)));
        J['el' + sd].quaternion.setFromEuler(new THREE.Euler(ez, 0, 0));
        J['hip' + sd].rotation.x += 0.85 + (st.air ? -0.8 : 0); J['hip' + sd].rotation.z = side * -0.35; J['kn' + sd].rotation.x -= 1.35;
      }
    } else {
      const heavy = bd.kind === 'brute' || bd.kind === 'boss';
      if (heavy) {
        // 重い踏み込み：胴体を左右に大きく揺らす
        J.hips.position.y = hipY - 0.06 - Math.abs(Math.cos(ph)) * 0.05 * moving;
        J.hips.rotation.z = Math.sin(ph) * 0.1 * moving;
        J.spine.rotation.set(-0.3 - atk * (strike ? 0.6 : -0.2) + roar * 0.35, Math.sin(ph) * 0.15 * moving, -Math.sin(ph) * 0.12 * moving);
        J.chest.rotation.set(-0.2 + Math.sin(t * 1.3) * 0.04 + roar * 0.3, s0 * 0.15, Math.sin(ph) * 0.1 * moving);
        J.neck.rotation.set(0.35 - roar * 0.9 + s1 * 0.15, s2 * 0.2 + Math.sin(t * 0.7) * 0.2, bd.tilt * 0.3);
        for (const [sd, off] of [['R', Math.PI], ['L', 0]]) {
          const side = sd === 'R' ? 1 : -1;
          const sw = Math.sin(ph + off) * amp * 1.1;
          let ax = 0.25 + sw, az = side * (0.45 + Math.abs(sw) * 0.2), ex = -0.7;
          if (atk > 0) { ax = strike ? lerp(0.1, 3.0, atk) : lerp(ax, 3.1, atk); az = side * lerp(0.45, 0.15, atk); ex = -0.3 - atk * 0.4; }
          if (roar > 0) { ax = lerp(ax, 1.3, roar); az = side * lerp(0.45, 1.3, roar); ex = -1.2 * roar - 0.3; }
          J['sh' + sd].quaternion.setFromEuler(new THREE.Euler(ax, 0, az));
          J['el' + sd].quaternion.setFromEuler(new THREE.Euler(ex, 0, 0));
        }
      } else {
        // グール：前のめりでよろめきながら突進、腕を振り乱す
        const lurch = Math.sin(ph * 2 + 0.5) * 0.12 * moving;
        J.hips.position.y = hipY - 0.1 - lurch * 0.3;
        J.hips.rotation.z = Math.sin(ph) * 0.12 * moving;
        const idle = 1 - moving;
        J.spine.rotation.set(-0.45 - run * 0.35 + lurch - atk * (strike ? 0.5 : -0.15) + roar * 0.5 + Math.sin(t * 1.1) * 0.06 * idle, s0 * 0.25 + Math.sin(t * 0.8) * 0.15 * idle, Math.sin(ph) * 0.2 * moving + s1 * 0.25 + Math.sin(t * 0.9) * 0.12 * idle);
        J.chest.rotation.set(-0.2 + roar * 0.4, s2 * 0.2, -Math.sin(ph) * 0.15 * moving);
        J.neck.rotation.set(0.6 + Math.sin(ph * 2) * 0.15 * moving + s1 * 0.6 - roar * 1.1, s2 * 0.6, bd.tilt + s0 * 0.8 + Math.sin(t * 0.6) * 0.2 * idle);
        for (const [sd, off] of [['R', Math.PI], ['L', 0]]) {
          const side = sd === 'R' ? 1 : -1;
          const p = ph + off;
          // 腕は遅れて振られる（だらりとした揺れ）
          let ax = lerp(0.15 + Math.sin(t * 1.3 + off) * 0.1, 1.0 - run * 0.2, moving) + Math.sin(p) * amp * 1.3 + (sd === 'R' ? s0 : s2) * 0.5;
          let az = side * (0.15 + Math.max(0, Math.cos(p)) * 0.4 * moving);
          let ex = -0.25 - Math.max(0, Math.sin(p - 0.8)) * 1.2 * moving;
          if (atk > 0) {
            if (strike) { ax = lerp(-0.3, 2.9, atk); az = side * lerp(-0.5, 0.3, atk); ex = -0.2; } // 振り下ろし（交差）
            else { ax = lerp(ax, 2.9, atk); az = side * lerp(0.2, 0.5, atk); ex = -0.4 - atk * 0.6; } // 振りかぶり
          }
          if (roar > 0) { ax = lerp(ax, 0.8, roar); az = side * lerp(Math.abs(az), 1.4, roar); ex = lerp(ex, -0.9, roar); }
          J['sh' + sd].quaternion.setFromEuler(new THREE.Euler(ax, 0, az));
          J['el' + sd].quaternion.setFromEuler(new THREE.Euler(ex, 0, 0));
        }
      }
    }
    // 地面から這い出す
    if (emerge < 1) {
      const e = emerge;
      J.spine.rotation.x = lerp(-1.2, J.spine.rotation.x, e); J.neck.rotation.x = lerp(1.2, J.neck.rotation.x, e);
      for (const [sd, side] of [['R', 1], ['L', -1]]) {
        const claw = Math.sin(t * 7 + (side > 0 ? 0 : 1.5));
        J['sh' + sd].quaternion.setFromEuler(new THREE.Euler(2.4 + claw * 0.5, 0, side * 0.4)); J['el' + sd].quaternion.setFromEuler(new THREE.Euler(-0.8 - claw * 0.4, 0, 0));
      }
    }
    if (J.jaw) J.jaw.rotation.x = 0.3 + Math.abs(Math.sin(t * (bd.kind === 'crawler' ? 14 : 3))) * (bd.kind === 'crawler' ? 0.35 : 0.2) + atk * 0.6 + roar * 0.9 + Math.abs(s1) * 0.5;
    if (st.stagger > 0) { J.spine.rotation.x += st.stagger * 0.7; J.neck.rotation.x -= st.stagger * 0.6; J.spine.rotation.z += st.stagger * 0.3 * (bd.tilt > 0 ? 1 : -1); }
  }
}

// ---- ヒットボックス ------------------------------------------------------------------
const HB = [
  ['neck', 0, 0.14, 0, 1.15, 'head'], ['chest', 0, 0.13, 0, 1.75, 'torso'], ['spine', 0, 0.1, 0, 1.55, 'torso'], ['hips', 0, 0, 0, 1.5, 'torso'],
  ['shR', 0, -0.15, 0, 0.65, 'arm'], ['elR', 0, -0.14, 0, 0.6, 'arm'], ['shL', 0, -0.15, 0, 0.65, 'arm'], ['elL', 0, -0.14, 0, 0.6, 'arm'],
  ['hipR', 0, -0.22, 0, 0.95, 'leg'], ['knR', 0, -0.22, 0, 0.75, 'leg'], ['hipL', 0, -0.22, 0, 0.95, 'leg'], ['knL', 0, -0.22, 0, 0.75, 'leg'],
];
export function computeHitboxes(bd, out) {
  const s = bd.K.s, b = bd.K.bulk;
  out.length = 0;
  for (const [j, x, y, z, r, part] of HB) {
    const p = new THREE.Vector3(x, y, z).applyMatrix4(bd.J[j].matrixWorld);
    out.push({ p, r: r * 0.1 * s * (part === 'head' ? (bd.kind === 'brute' || bd.kind === 'boss' ? 1.25 : 1) : b > 1 ? b * 0.8 : Math.max(0.8, b)), part });
  }
  return out;
}

// ---- ラグドール ------------------------------------------------------------------------
const PT = ['head', 'neck', 'pelvis', 'shL', 'shR', 'elL', 'elR', 'haL', 'haR', 'hipL', 'hipR', 'knL', 'knR', 'ftL', 'ftR'];
const PI_ = Object.fromEntries(PT.map((n, i) => [n, i]));
export class Ragdoll {
  constructor(bd, vel, impulse, hitPoint) {
    this.bd = bd;
    const J = bd.J, s = bd.K.s;
    bd.root.updateMatrixWorld(true);
    const wp = (o, x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z).applyMatrix4(o.matrixWorld);
    const pos = [wp(J.neck, 0, 0.14), wp(J.neck), wp(J.hips), wp(J.shL), wp(J.shR), wp(J.elL), wp(J.elR), wp(J.haL), wp(J.haR), wp(J.hipL), wp(J.hipR), wp(J.knL), wp(J.knR), wp(J.ftL), wp(J.ftR)];
    this.p = pos;
    const dt = 1 / 60;
    this.o = pos.map((p) => p.clone().addScaledVector(vel, -dt));
    // 被弾点付近に衝撃
    if (impulse) {
      pos.forEach((p, i) => {
        const d = hitPoint ? p.distanceTo(hitPoint) : 0.5;
        const k = clamp(1.2 - d * 1.5, 0.25, 1.2);
        this.o[i].addScaledVector(impulse, -dt * k);
      });
    }
    this.r = PT.map((n) => (n === 'head' ? 0.12 : n === 'pelvis' ? 0.13 : 0.07) * s * Math.max(1, bd.K.bulk * 0.8));
    // 拘束
    this.c = [];
    const L = (a, b, stiff = 1) => { const i = PI_[a], j = PI_[b]; this.c.push([i, j, pos[i].distanceTo(pos[j]), stiff, 0]); };
    const torso = ['neck', 'pelvis', 'shL', 'shR', 'hipL', 'hipR'];
    for (let i = 0; i < torso.length; i++) for (let j = i + 1; j < torso.length; j++) L(torso[i], torso[j]);
    L('head', 'neck'); L('head', 'shL', 0.6); L('head', 'shR', 0.6);
    for (const s2 of ['L', 'R']) { L('sh' + s2, 'el' + s2); L('el' + s2, 'ha' + s2); L('hip' + s2, 'kn' + s2); L('kn' + s2, 'ft' + s2); }
    // 最小距離（折り畳み防止）
    this.min = [];
    const K = bd.K;
    for (const s2 of ['L', 'R']) { this.min.push([PI_['sh' + s2], PI_['ha' + s2], (K.uarm + K.farm) * s * 0.45]); this.min.push([PI_['hip' + s2], PI_['ft' + s2], (K.thigh + K.shin) * s * 0.55]); this.min.push([PI_['ft' + s2], PI_.pelvis, (K.thigh + K.shin) * s * 0.5]); }
    this.min.push([PI_.head, PI_.pelvis, 0.4 * s]);
    this.min.push([PI_.haL, PI_.head, 0.12 * s]); this.min.push([PI_.haR, PI_.head, 0.12 * s]);
    // セグメント → フレーム
    this.frames = { torso: null, head: null, uarmL: null, uarmR: null, farmL: null, farmR: null, thighL: null, thighR: null, shinL: null, shinR: null };
    this.computeFrames();
    this.segs = [];
    for (const sg of bd.segs) {
      const F = this.frames[sg.part];
      sg.obj.updateMatrixWorld(true);
      const rel = new THREE.Matrix4().copy(F).invert().multiply(sg.obj.matrixWorld);
      G.scene.attach(sg.obj);
      sg.obj.matrixAutoUpdate = false;
      this.segs.push({ obj: sg.obj, part: sg.part, rel, detached: false });
    }
    this.sleep = 0; this.age = 0; this.asleep = false;
    this.detached = new Set();
  }
  computeFrames() {
    const p = this.p;
    const X = new THREE.Vector3(), Y = new THREE.Vector3(), Z = new THREE.Vector3();
    const make = (o, yFrom, yTo, xRef) => {
      Y.subVectors(yTo, yFrom); if (Y.lengthSq() < 1e-8) Y.set(0, 1, 0); Y.normalize();
      X.copy(xRef).addScaledVector(Y, -xRef.dot(Y));
      if (X.lengthSq() < 1e-6) X.set(1, 0, 0).addScaledVector(Y, -Y.x);
      X.normalize(); Z.crossVectors(X, Y).normalize();
      const m = new THREE.Matrix4().makeBasis(X, Y, Z); m.setPosition(o); return m;
    };
    const tx = new THREE.Vector3().subVectors(p[PI_.shR], p[PI_.shL]).add(new THREE.Vector3().subVectors(p[PI_.hipR], p[PI_.hipL])).normalize();
    const F = this.frames;
    F.torso = make(p[PI_.pelvis], p[PI_.pelvis], p[PI_.neck], tx);
    const txx = new THREE.Vector3().setFromMatrixColumn(F.torso, 0);
    F.head = make(p[PI_.neck], p[PI_.neck], p[PI_.head], txx);
    for (const s of ['L', 'R']) {
      F['uarm' + s] = make(p[PI_['sh' + s]], p[PI_['el' + s]], p[PI_['sh' + s]], txx);
      F['farm' + s] = make(p[PI_['el' + s]], p[PI_['ha' + s]], p[PI_['el' + s]], txx);
      F['thigh' + s] = make(p[PI_['hip' + s]], p[PI_['kn' + s]], p[PI_['hip' + s]], txx);
      F['shin' + s] = make(p[PI_['kn' + s]], p[PI_['ft' + s]], p[PI_['kn' + s]], txx);
    }
  }
  point(name) { return this.p[PI_[name]]; }
  velocity(name) { const i = PI_[name]; return new THREE.Vector3().subVectors(this.p[i], this.o[i]).multiplyScalar(60); }
  push(point, imp) {
    this.asleep = false; this.sleep = 0;
    this.p.forEach((p, i) => { const d = p.distanceTo(point); const k = clamp(1 - d * 1.2, 0, 1); this.o[i].addScaledVector(imp, -k / 60); });
  }
  update(dt) {
    if (this.asleep) return;
    this.age += dt;
    const W = G.world;
    const sub = 2, h = Math.min(dt, 1 / 30) / sub;
    const g = -9.8 * h * h;
    let motion = 0;
    for (let s = 0; s < sub; s++) {
      for (let i = 0; i < this.p.length; i++) {
        const p = this.p[i], o = this.o[i];
        const vx = (p.x - o.x) * 0.995, vy = (p.y - o.y) * 0.995, vz = (p.z - o.z) * 0.995;
        o.copy(p);
        p.x += vx; p.y += vy + g; p.z += vz;
        motion += Math.abs(vx) + Math.abs(vy) + Math.abs(vz);
      }
      for (let it = 0; it < 7; it++) {
        for (const c of this.c) {
          if (c[4]) continue;
          const a = this.p[c[0]], b = this.p[c[1]];
          const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          const diff = ((d - c[2]) / d) * 0.5 * c[3];
          a.x += dx * diff; a.y += dy * diff; a.z += dz * diff;
          b.x -= dx * diff; b.y -= dy * diff; b.z -= dz * diff;
        }
        for (const [i, j, m] of this.min) {
          const a = this.p[i], b = this.p[j];
          const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          if (d >= m) continue;
          const diff = ((d - m) / d) * 0.5;
          a.x += dx * diff; a.y += dy * diff; a.z += dz * diff;
          b.x -= dx * diff; b.y -= dy * diff; b.z -= dz * diff;
        }
        for (let i = 0; i < this.p.length; i++) {
          const p = this.p[i];
          if (W.pushPoint(p, this.r[i])) {
            // 摩擦
            const o = this.o[i];
            o.x = lerp(o.x, p.x, 0.25); o.z = lerp(o.z, p.z, 0.25);
            if (o.y < p.y - 0.02) o.y = lerp(o.y, p.y, 0.5);
          }
        }
      }
    }
    if (motion < 0.02 * this.p.length) this.sleep += dt; else this.sleep = 0;
    if (this.sleep > 1.0 && this.age > 1.5) this.asleep = true;
    this.computeFrames();
    for (const sg of this.segs) {
      if (sg.detached) continue;
      sg.obj.matrix.multiplyMatrices(this.frames[sg.part], sg.rel);
      sg.obj.matrixWorldNeedsUpdate = true;
    }
  }
  // 四肢切断: 対応セグメントを返す
  detach(limb) {
    const parts = { head: ['head'], armL: ['uarmL', 'farmL'], armR: ['uarmR', 'farmR'], legL: ['thighL', 'shinL'], legR: ['thighR', 'shinR'] }[limb];
    if (!parts || this.detached.has(limb)) return null;
    this.detached.add(limb);
    const out = [];
    for (const sg of this.segs) if (parts.includes(sg.part) && !sg.detached) { sg.detached = true; out.push(sg.obj); }
    // 拘束を外す
    const idx = { head: [PI_.head], armL: [PI_.elL, PI_.haL], armR: [PI_.elR, PI_.haR], legL: [PI_.knL, PI_.ftL], legR: [PI_.knR, PI_.ftR] }[limb];
    for (const c of this.c) if (idx.includes(c[0]) !== idx.includes(c[1])) c[4] = 1;
    this.min = this.min.filter(([i, j]) => !idx.includes(i) && !idx.includes(j));
    return out;
  }
  dispose() {
    for (const sg of this.segs) { if (sg.obj.parent) sg.obj.parent.remove(sg.obj); }
  }
}
