// 武器定義・銃モデル・一人称ビューモデル
import * as THREE from 'three';
import { G } from './state.js';
import { tex } from './textures.js';
import { clamp, lerp, damp, rand } from './util.js';
import { mergeChildren } from './merge.js';

export const WEAPONS = {
  pistol: { id: 'pistol', name: 'P-9 ヴァイパー', cls: 'ハンドガン', type: 'pistol', dmg: 26, rpm: 420, auto: false, mag: 15, reserve: 60, reload: 1.45, hip: 0.028, ads: 0.007, move: 0.02,
    rv: 0.028, rh: 0.012, range: 150, fall: [20, 60, 0.6], pellets: 1, head: 2.0, zoom: 1.15, adsTime: 0.14, tier: 0,
    model: { recv: [0.2, 0.05, 0.035], barrel: 0.02, stock: 'none', mag: 'pistol', optic: 'none', color: 0x222326, pistol: true } },
  smg: { id: 'smg', name: 'VX-9 ホーネット', cls: 'SMG', type: 'smg', dmg: 19, rpm: 900, auto: true, mag: 32, reserve: 160, reload: 1.9, hip: 0.035, ads: 0.013, move: 0.012,
    rv: 0.012, rh: 0.011, range: 160, fall: [15, 45, 0.55], pellets: 1, head: 1.7, zoom: 1.25, adsTime: 0.16, tier: 1,
    model: { recv: [0.28, 0.07, 0.045], barrel: 0.1, stock: 'folding', mag: 'straight', optic: 'red', color: 0x1e1f22, guard: 0.12 } },
  ar: { id: 'ar', name: 'K7 ケストレル', cls: 'アサルトライフル', type: 'ar', dmg: 27, rpm: 660, auto: true, mag: 30, reserve: 150, reload: 2.2, hip: 0.045, ads: 0.0055, move: 0.02,
    rv: 0.0165, rh: 0.0085, range: 400, fall: [50, 150, 0.7], pellets: 1, head: 2.0, zoom: 1.4, adsTime: 0.22, tier: 2,
    model: { recv: [0.36, 0.075, 0.05], barrel: 0.2, stock: 'full', mag: 'curved', optic: 'holo', color: 0x2a2b2e, guard: 0.22, accent: 0x6a5a40 } },
  shotgun: { id: 'shotgun', name: 'B12 ブリーチャー', cls: 'ショットガン', type: 'shotgun', dmg: 14, rpm: 72, auto: false, mag: 6, reserve: 36, reload: 0.5, shellReload: true, hip: 0.075, ads: 0.055, move: 0.02,
    rv: 0.085, rh: 0.02, range: 70, fall: [8, 30, 0.2], pellets: 10, head: 1.6, zoom: 1.15, adsTime: 0.2, tier: 1, pump: true,
    model: { recv: [0.3, 0.075, 0.05], barrel: 0.34, stock: 'full', mag: 'tube', optic: 'none', color: 0x252525, wood: true, guard: 0.2 } },
  dmr: { id: 'dmr', name: 'M21 セントリー', cls: 'マークスマン', type: 'dmr', dmg: 50, rpm: 250, auto: false, mag: 10, reserve: 50, reload: 2.6, hip: 0.06, ads: 0.0015, move: 0.03,
    rv: 0.045, rh: 0.012, range: 600, fall: [120, 300, 0.8], pellets: 1, head: 2.2, zoom: 3, scope: true, adsTime: 0.26, tier: 3,
    model: { recv: [0.42, 0.075, 0.05], barrel: 0.34, stock: 'full', mag: 'straight', optic: 'scope', color: 0x3a3a30, guard: 0.26, accent: 0x5a5a48 } },
  sniper: { id: 'sniper', name: 'L338 ロングボウ', cls: 'スナイパー', type: 'sniper', dmg: 110, rpm: 44, auto: false, mag: 5, reserve: 25, reload: 3.0, hip: 0.12, ads: 0.0, move: 0.05,
    rv: 0.11, rh: 0.02, range: 900, fall: [300, 700, 0.9], pellets: 1, head: 2.6, zoom: 6.5, scope: true, adsTime: 0.32, tier: 4, bolt: true,
    model: { recv: [0.46, 0.08, 0.055], barrel: 0.5, stock: 'full', mag: 'box', optic: 'scope', color: 0x3c4a34, guard: 0.3, bolt: true } },
  lmg: { id: 'lmg', name: 'HX-60 ジャガー', cls: 'LMG', type: 'lmg', dmg: 25, rpm: 720, auto: true, mag: 80, reserve: 160, reload: 4.2, hip: 0.06, ads: 0.012, move: 0.035,
    rv: 0.014, rh: 0.012, range: 400, fall: [50, 150, 0.7], pellets: 1, head: 1.8, zoom: 1.35, adsTime: 0.3, tier: 3,
    model: { recv: [0.44, 0.1, 0.06], barrel: 0.3, stock: 'full', mag: 'drum', optic: 'red', color: 0x2e2e2a, guard: 0.26, accent: 0x5a5040 } },
};
export const TIER_COLORS = ['#c8c8c8', '#5ad06a', '#4aa0ff', '#b060ff', '#ffb020'];

// ---- 銃モデル ---------------------------------------------------------------------------
const matCache = {};
function M(key, o) { if (!matCache[key]) { matCache[key] = new THREE.MeshStandardMaterial(o); matCache[key].userData.shared = true; } return matCache[key]; }
function bx(w, h, d, mat, x, y, z) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; return m; }
function cyl(r, len, mat, x, y, z, seg = 12) { const g = new THREE.CylinderGeometry(r, r, len, seg); g.rotateX(Math.PI / 2); const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = true; return m; }

export function buildGun(def, hi = true) {
  const d = def.model;
  const g = new THREE.Group();
  const body = M('gb' + d.color, { color: d.color, roughness: 0.5, metalness: 0.55 });
  const poly = M('poly', { color: 0x151517, roughness: 0.8, metalness: 0.1 });
  const acc = d.accent ? M('acc' + d.accent, { color: d.accent, roughness: 0.7, metalness: 0.1 }) : poly;
  const wood = M('wood', { color: 0x6a4428, roughness: 0.6, map: tex('wood').map });
  const steel = M('steel', { color: 0x55585c, roughness: 0.35, metalness: 0.9 });
  const glass = M('lens', { color: 0x0a1a28, roughness: 0.05, metalness: 1, emissive: 0x06121a });
  const [L, H, W] = d.recv;
  // レシーバー（原点=グリップ上部）
  g.add(bx(W, H, L, body, 0, 0, -L * 0.35));
  if (!d.pistol) g.add(bx(W * 0.7, 0.01, L * 0.9, poly, 0, H / 2 + 0.005, -L * 0.35)); // レール
  else { g.add(bx(W * 1.02, H * 0.45, L * 0.98, body, 0, H * 0.22, -L * 0.35)); } // スライド
  if (hi && !d.pistol) g.add(bx(W * 1.01, H * 0.25, L * 0.5, poly, 0, -H * 0.3, -L * 0.3)); // 下部レシーバー
  // エジェクションポート
  g.add(bx(0.002, H * 0.35, L * 0.25, steel, W / 2 + 0.001, H * 0.1, -L * 0.25));
  const front = -L * 0.85;
  // ハンドガード
  if (d.guard) {
    g.add(bx(W * 1.1, H * 0.85, d.guard, d.wood ? wood : acc, 0, -H * 0.05, front - d.guard / 2));
    if (hi && !d.wood) for (let i = 0; i < 4; i++) g.add(bx(W * 1.14, 0.012, 0.02, poly, 0, -H * 0.05 + 0.012, front - 0.03 - i * d.guard * 0.24));
  }
  // バレル
  const bl = d.barrel + (d.guard || 0) + 0.02;
  g.add(cyl(d.pistol ? 0.009 : 0.011, bl, steel, 0, H * 0.12, front - bl / 2));
  const muzzleZ = front - bl;
  if (!d.pistol) g.add(cyl(0.017, 0.06, body, 0, H * 0.12, muzzleZ + 0.03, 8)); // マズル
  if (d.mag === 'tube') g.add(cyl(0.014, bl * 0.8, body, 0, -H * 0.3, front - bl * 0.4));
  // グリップ
  const grip = bx(W * 0.85, 0.11, 0.05, d.wood ? wood : poly, 0, -H / 2 - 0.05, 0.02); grip.rotation.x = 0.28; g.add(grip);
  // トリガーガード
  g.add(bx(W * 0.4, 0.008, 0.07, body, 0, -H / 2 - 0.028, -0.04));
  // マガジン
  let mag = null;
  if (d.mag === 'curved') { mag = bx(W * 0.75, 0.2, 0.06, body, 0, -H / 2 - 0.09, -L * 0.42); mag.rotation.x = -0.25; }
  else if (d.mag === 'straight') mag = bx(W * 0.7, 0.17, 0.05, poly, 0, -H / 2 - 0.08, -L * 0.4);
  else if (d.mag === 'box') mag = bx(W * 0.8, 0.09, 0.08, poly, 0, -H / 2 - 0.04, -L * 0.45);
  else if (d.mag === 'drum') { mag = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.07, 18), poly); mag.rotation.z = Math.PI / 2; mag.position.set(0.0, -H / 2 - 0.08, -L * 0.45); }
  else if (d.mag === 'pistol') mag = bx(W * 0.7, 0.03, 0.035, poly, 0, -H / 2 - 0.11, 0.035);
  if (mag) { mag.castShadow = true; g.add(mag); }
  // ストック
  if (d.stock === 'full') { const s = bx(W * 0.9, H * 1.2, 0.22, d.wood ? wood : poly, 0, -H * 0.2, 0.2); g.add(s); g.add(bx(W, H * 1.4, 0.03, poly, 0, -H * 0.25, 0.32)); }
  else if (d.stock === 'folding') { g.add(bx(0.01, 0.01, 0.2, steel, 0.015, 0, 0.15)); g.add(bx(0.01, 0.01, 0.2, steel, -0.015, 0, 0.15)); g.add(bx(W, 0.06, 0.015, poly, 0, -0.02, 0.25)); }
  // 光学機器
  let sightY = H / 2 + 0.03;
  if (d.optic === 'red') { g.add(bx(0.03, 0.035, 0.05, poly, 0, H / 2 + 0.03, -L * 0.3)); const dot = new THREE.Mesh(new THREE.SphereGeometry(0.0018, 6, 4), M('dot', { color: 0xff0000, emissive: 0xff2020, emissiveIntensity: 8 })); dot.position.set(0, H / 2 + 0.035, -L * 0.3 - 0.02); g.add(dot); sightY = H / 2 + 0.035; }
  else if (d.optic === 'holo') {
    g.add(bx(0.04, 0.012, 0.07, poly, 0, H / 2 + 0.018, -L * 0.28));
    g.add(bx(0.006, 0.04, 0.06, poly, 0.018, H / 2 + 0.04, -L * 0.28)); g.add(bx(0.006, 0.04, 0.06, poly, -0.018, H / 2 + 0.04, -L * 0.28));
    g.add(bx(0.04, 0.006, 0.06, poly, 0, H / 2 + 0.06, -L * 0.28));
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.004, 0.0055, 16), M('holo', { color: 0xff3030, emissive: 0xff2020, emissiveIntensity: 6, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    ring.position.set(0, H / 2 + 0.038, -L * 0.28 - 0.03); g.add(ring);
    sightY = H / 2 + 0.038;
  } else if (d.optic === 'scope') {
    g.add(cyl(0.022, 0.24, body, 0, H / 2 + 0.05, -L * 0.3, 16));
    g.add(cyl(0.028, 0.05, body, 0, H / 2 + 0.05, -L * 0.3 - 0.13, 16));
    g.add(cyl(0.026, 0.04, body, 0, H / 2 + 0.05, -L * 0.3 + 0.12, 16));
    const ln = cyl(0.024, 0.005, glass, 0, H / 2 + 0.05, -L * 0.3 - 0.156, 16); g.add(ln);
    g.add(bx(0.012, 0.03, 0.02, body, 0, H / 2 + 0.02, -L * 0.3 - 0.06)); g.add(bx(0.012, 0.03, 0.02, body, 0, H / 2 + 0.02, -L * 0.3 + 0.06));
    sightY = H / 2 + 0.05;
  } else {
    g.add(bx(0.006, 0.015, 0.01, steel, 0, H / 2 + 0.008, muzzleZ + 0.04)); // フロントサイト
    g.add(bx(0.02, 0.012, 0.01, steel, 0, H / 2 + 0.006, -0.02));
    sightY = H / 2 + 0.014;
  }
  if (d.bolt) { const b = bx(0.05, 0.012, 0.012, steel, W / 2 + 0.02, H * 0.2, -0.02); g.add(b); g.userData.bolt = b; }
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, H * 0.12, muzzleZ - 0.02); g.add(muzzle);
  g.userData = { ...g.userData, muzzle, sightY, mag, magPos: mag ? mag.position.clone() : null, grip: [0, -H / 2 - 0.06, 0.03], guard: [0, -H * 0.3, d.guard ? front - d.guard * 0.5 : (d.pistol ? 0.0 : -L * 0.6)], eject: new THREE.Vector3(W / 2, H * 0.15, -L * 0.25), len: L + bl };
  if (d.pistol) g.userData.guard = [-0.01, -H / 2 - 0.08, 0.02];
  if (!hi) { const ud = g.userData; mergeChildren(g, new Set(), true); g.userData = ud; ud.mag = null; ud.bolt = null; }
  return g;
}

// ---- ビューモデル ------------------------------------------------------------------------
export class ViewModel {
  constructor(engine) {
    this.engine = engine;
    this.root = new THREE.Group();
    engine.vmCamera.add(this.root);
    this.pivot = new THREE.Group(); this.root.add(this.pivot);
    this.gun = null; this.def = null;
    this.sleeve = new THREE.MeshStandardMaterial({ color: 0x3a4030, roughness: 0.9, map: tex('fabric').map });
    this.glove = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.7 });
    this.armR = this.makeArm(); this.armL = this.makeArm();
    this.pivot.add(this.armR, this.armL);
    // マズルフラッシュ
    const fm = new THREE.SpriteMaterial({ map: tex('flash').map, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xffd0a0 });
    this.flash = new THREE.Sprite(fm); this.flash.visible = false;
    const fm2 = new THREE.MeshBasicMaterial({ map: tex('flash').map, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, side: THREE.DoubleSide, color: 0xffc080 });
    this.flash2 = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.25), fm2); this.flash2.visible = false;
    this.shells = [];
    this.shellGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.022, 6);
    this.shellMat = new THREE.MeshStandardMaterial({ color: 0xc89040, metalness: 1, roughness: 0.3 });
    // 状態
    this.ads = 0; this.bob = 0; this.swayX = 0; this.swayY = 0; this.kick = 0; this.kickRot = 0; this.kickSide = 0;
    this.equipT = 0; this.reloadT = -1; this.reloadDur = 1; this.actionT = -1; this.sprint = 0; this.throwT = -1; this.healT = -1;
    this.land = 0; this.visible = true;
  }
  makeArm() {
    const g = new THREE.Group();
    const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.045, 1, 10), this.sleeve);
    fore.geometry.translate(0, 0.5, 0); fore.geometry.rotateX(Math.PI / 2); // +z方向に伸びる
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 8), this.glove); hand.scale.set(0.9, 0.8, 1.3);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 10), this.glove); cuff.rotation.x = Math.PI / 2; cuff.position.z = 0.05;
    g.add(fore, hand, cuff);
    g.userData = { fore, hand, cuff };
    return g;
  }
  placeArm(arm, hand, elbow) {
    const { fore, hand: h, cuff } = arm.userData;
    const d = new THREE.Vector3().subVectors(elbow, hand);
    const len = d.length();
    h.position.copy(hand); cuff.position.copy(hand).addScaledVector(d.clone().normalize(), 0.05);
    fore.position.copy(hand); fore.scale.set(1, 1, len);
    fore.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.normalize());
    cuff.quaternion.copy(fore.quaternion); h.quaternion.copy(fore.quaternion);
  }
  setWeapon(def) {
    if (this.gun) { this.pivot.remove(this.gun); }
    this.def = def;
    if (!def) { this.gun = null; this.armR.visible = this.armL.visible = false; return; }
    this.armR.visible = this.armL.visible = true;
    this.gun = buildGun(def, true);
    this.gun.traverse((o) => { if (o.isMesh) o.castShadow = false; });
    this.pivot.add(this.gun);
    this.gun.userData.muzzle.add(this.flash); this.flash.scale.set(0.16, 0.16, 1);
    this.flash2.rotation.y = Math.PI / 2; this.gun.userData.muzzle.add(this.flash2); this.flash2.position.z = -0.08; this.flash2.scale.set(1.6, 0.6, 1);
    this.equipT = 0.45; this.reloadT = -1; this.actionT = -1;
  }
  fire() {
    const d = this.def; if (!d) return;
    this.kick += d.type === 'sniper' || d.type === 'shotgun' ? 0.07 : d.type === 'pistol' ? 0.035 : 0.022;
    this.kickRot += (d.rv * 2.2 + 0.02) * (d.type === 'pistol' ? 1.4 : 1);
    this.kickSide += (Math.random() - 0.5) * d.rh * 3;
    this.flashT = 0.045;
    this.flash.material.rotation = Math.random() * 6.28;
    const s = (d.type === 'shotgun' || d.type === 'sniper' ? 0.26 : 0.17) * (0.85 + Math.random() * 0.3);
    this.flash.scale.set(s, s, 1);
    this.engine.vmFlash.intensity = 4;
    this.engine.vmFlash.position.set(0.1, -0.05, -0.6);
    if (!d.pump && !d.bolt) this.ejectShell();
    if (d.pump || d.bolt) this.actionT = 0;
  }
  ejectShell() {
    if (this.shells.length > 12) { const s = this.shells.shift(); this.root.remove(s.m); }
    const m = new THREE.Mesh(this.shellGeo, this.shellMat);
    const p = this.gun.userData.eject.clone().applyMatrix4(this.gun.matrix).applyMatrix4(this.pivot.matrix);
    m.position.copy(p);
    this.root.add(m);
    this.shells.push({ m, v: new THREE.Vector3(rand(0.8, 1.4), rand(0.9, 1.5), rand(-0.1, 0.3)), life: 0.7, spin: new THREE.Vector3(rand(-20, 20), rand(-20, 20), rand(-20, 20)) });
  }
  startReload(dur) { this.reloadT = 0; this.reloadDur = dur; }
  update(dt, st) {
    // st: { ads, moving, sprint, speed, mouseDX, mouseDY, reloading, t, crouch, air, visible, bobScale }
    this.root.visible = st.visible && !!this.gun && !(st.scoped);
    const d = this.def; if (!d || !this.gun) return;
    const U = this.gun.userData;
    this.ads = st.ads;
    this.sprint = damp(this.sprint, st.sprint ? 1 : 0, 10, dt);
    this.equipT = Math.max(0, this.equipT - dt);
    this.kick = damp(this.kick, 0, 18, dt); this.kickRot = damp(this.kickRot, 0, 12, dt); this.kickSide = damp(this.kickSide, 0, 14, dt);
    this.land = damp(this.land, 0, 8, dt);
    // 揺れ
    const bs = st.bobScale;
    if (st.moving && !st.air) this.bob += dt * (st.sprint ? 13 : 9) * (st.crouch ? 0.7 : 1);
    const bobA = (st.moving && !st.air ? (st.sprint ? 1.6 : 1) : 0.15) * (1 - this.ads * 0.85) * bs;
    const bx_ = Math.sin(this.bob) * 0.012 * bobA, by_ = -Math.abs(Math.cos(this.bob)) * 0.01 * bobA;
    const idle = Math.sin(st.t * 1.6) * 0.002 * (1 - this.ads * 0.8);
    this.swayX = damp(this.swayX, clamp(-st.mouseDX * 0.0006, -0.04, 0.04), 8, dt);
    this.swayY = damp(this.swayY, clamp(st.mouseDY * 0.0006, -0.04, 0.04), 8, dt);
    // 位置
    const hip = d.model.pistol ? new THREE.Vector3(0.14, -0.14, -0.4) : new THREE.Vector3(0.15, -0.155, -0.4);
    const adsP = new THREE.Vector3(0, -U.sightY, d.model.pistol ? -0.36 : d.model.optic === 'scope' ? -0.26 : -0.3);
    const p = hip.lerp(adsP, this.ads);
    p.x += bx_ + this.swayX * (1 - this.ads * 0.7); p.y += by_ + idle - this.land * 0.03 + this.swayY * (1 - this.ads * 0.7);
    p.z += this.kick * (1 - this.ads * 0.4);
    const sp = this.sprint * (1 - this.ads);
    p.x -= sp * 0.06; p.y -= sp * 0.04;
    const eq = this.equipT / 0.45;
    p.y -= eq * eq * 0.3;
    let rx = this.kickRot * (1 - this.ads * 0.5) - sp * 0.35 - eq * 0.6, ry = this.kickSide + sp * 0.7 + this.swayX * 2, rz = sp * 0.35 + bx_ * 3;
    // リロードアニメ
    let magOff = 0;
    if (this.reloadT >= 0) {
      this.reloadT += dt;
      const r = clamp(this.reloadT / this.reloadDur, 0, 1);
      const env = Math.sin(r * Math.PI);
      if (d.shellReload) { rz += 0.25 * env; rx += 0.15 * env; p.y -= 0.02 * env; }
      else {
        rz += 0.55 * env; rx += 0.25 * env; p.y -= 0.05 * env; p.x -= 0.02 * env;
        magOff = r < 0.25 ? r / 0.25 : r < 0.6 ? 1 : 1 - (r - 0.6) / 0.25;
        magOff = clamp(magOff, 0, 1);
      }
      if (r >= 1) this.reloadT = -1;
    }
    // ボルト/ポンプ
    if (this.actionT >= 0) {
      this.actionT += dt;
      const a = clamp(this.actionT / 0.55, 0, 1), e = Math.sin(a * Math.PI);
      if (d.bolt) { rz += 0.3 * e; if (U.bolt) U.bolt.position.z = -0.02 + e * 0.08; }
      else { p.z += 0.0; rx += 0.08 * e; }
      if (a === 1 && this.actionT > 0.2 && !this._ejected) { this._ejected = true; }
      if (a >= 1) { this.actionT = -1; this._ejected = false; this.ejectShell(); }
      this.pumpE = e;
    } else this.pumpE = 0;
    // 投擲/回復
    if (this.throwT >= 0) { this.throwT += dt; const e = Math.sin(clamp(this.throwT / 0.5, 0, 1) * Math.PI); p.y -= 0.25 * e; rx -= 0.5 * e; if (this.throwT > 0.5) this.throwT = -1; }
    if (this.healT >= 0) { p.y -= 0.22; rx -= 0.4; }
    this.pivot.position.copy(p);
    this.pivot.rotation.set(rx, ry, rz);
    if (U.mag) U.mag.position.set(U.magPos.x, U.magPos.y - magOff * 0.25, U.magPos.z + magOff * 0.05);
    if (U.mag) U.mag.visible = magOff < 0.95;
    // 腕
    const gm = this.gun.matrix; this.gun.updateMatrix();
    const handR = new THREE.Vector3(...U.grip).applyMatrix4(gm);
    let handL = new THREE.Vector3(...U.guard).applyMatrix4(gm);
    if (magOff > 0 && U.mag) handL = handL.lerp(U.mag.position.clone().applyMatrix4(gm).add(new THREE.Vector3(0, -0.05, 0)), clamp(magOff * 1.5, 0, 1));
    if (d.pump && this.pumpE) handL.z += this.pumpE * 0.08;
    this.placeArm(this.armR, handR, new THREE.Vector3(0.22, -0.32, 0.25));
    this.placeArm(this.armL, handL, new THREE.Vector3(-0.2, -0.38, 0.05));
    // フラッシュ
    this.flashT = Math.max(0, (this.flashT || 0) - dt);
    this.flash.visible = this.flash2.visible = this.flashT > 0;
    // 薬莢
    for (let i = this.shells.length - 1; i >= 0; i--) {
      const s = this.shells[i];
      s.v.y -= 6 * dt; s.m.position.addScaledVector(s.v, dt);
      s.m.rotation.x += s.spin.x * dt; s.m.rotation.y += s.spin.y * dt;
      s.life -= dt;
      if (s.life <= 0) { this.root.remove(s.m); this.shells.splice(i, 1); }
    }
  }
}
