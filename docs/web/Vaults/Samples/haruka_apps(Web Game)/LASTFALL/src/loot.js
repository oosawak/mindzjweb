// 物資（ルート）
import * as THREE from 'three';
import { G } from './state.js';
import { WEAPONS, buildGun, TIER_COLORS } from './weapons.js';
import { tex } from './textures.js';
import { rand, pick } from './util.js';

const WEIGHTS = [['pistol', 18], ['smg', 16], ['shotgun', 13], ['ar', 14], ['dmr', 7], ['lmg', 5], ['sniper', 4]];
function randomWeapon() { const tot = WEIGHTS.reduce((s, w) => s + w[1], 0); let r = Math.random() * tot; for (const [id, w] of WEIGHTS) { if ((r -= w) <= 0) return id; } return 'pistol'; }

let medTex = null;
function medkitTex() {
  if (medTex) return medTex;
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  g.fillStyle = '#eee'; g.fillRect(0, 0, 64, 64); g.fillStyle = '#c21'; g.fillRect(26, 12, 12, 40); g.fillRect(12, 26, 40, 12);
  medTex = new THREE.CanvasTexture(c); medTex.colorSpace = THREE.SRGBColorSpace; return medTex;
}

export const ITEM_NAMES = { ammo: '弾薬箱', bandage: '包帯 ×2', medkit: '救急キット', grenade: 'グレネード', armor1: 'アーマー Lv1', armor2: 'アーマー Lv2', armor3: 'アーマー Lv3' };

export class Loot {
  constructor() { this.items = []; this.group = new THREE.Group(); G.scene.add(this.group); this.t = 0; this.glowMat = {}; }
  itemName(it) { return it.type === 'weapon' ? WEAPONS[it.id].name : ITEM_NAMES[it.type === 'armor' ? 'armor' + it.level : it.type]; }
  itemColor(it) {
    if (it.type === 'weapon') return TIER_COLORS[WEAPONS[it.id].tier];
    if (it.type === 'armor') return TIER_COLORS[it.level + 1];
    return { ammo: '#d8c040', bandage: '#ffffff', medkit: '#ff5050', grenade: '#80c060' }[it.type];
  }
  spawn(x, y, z, data) {
    const it = { ...data, pos: new THREE.Vector3(x, y, z), taken: false, phase: Math.random() * 6 };
    const m = new THREE.Group();
    let obj;
    if (it.type === 'weapon') { obj = buildGun(WEAPONS[it.id], false); obj.rotation.set(0, 0, Math.PI / 2); obj.position.y = 0.05; obj.scale.setScalar(1.1); }
    else if (it.type === 'ammo') { obj = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0x3a4a2a, roughness: 0.6, metalness: 0.3 })); const s = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.21), new THREE.MeshStandardMaterial({ color: 0xd8b020 })); obj.add(b, s); obj.position.y = 0.1; }
    else if (it.type === 'medkit') { obj = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.26), new THREE.MeshStandardMaterial({ map: medkitTex(), roughness: 0.5 })); obj.position.y = 0.07; }
    else if (it.type === 'bandage') { obj = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0xf0ece0, roughness: 0.9 })); obj.position.y = 0.05; }
    else if (it.type === 'grenade') { obj = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshStandardMaterial({ color: 0x3a4a30, metalness: 0.3, roughness: 0.6 })); obj.scale.y = 1.25; obj.position.y = 0.08; }
    else if (it.type === 'armor') { obj = new THREE.Group(); const v = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.14), new THREE.MeshStandardMaterial({ color: [0x5a5a48, 0x2a3a5a, 0x3a2a4a][it.level - 1], roughness: 0.7 })); const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.02), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.4 })); p.position.z = -0.08; obj.add(v, p); obj.rotation.x = -Math.PI / 2; obj.position.y = 0.08; }
    obj.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    m.add(obj);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('glow').map, color: this.itemColor(it), blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55 }));
    glow.scale.set(0.9, 0.9, 1); glow.position.y = 0.15; m.add(glow);
    m.position.copy(it.pos);
    it.mesh = m; it.obj = obj; it.glow = glow;
    this.group.add(m);
    this.items.push(it);
    return it;
  }
  randomItem(rich = 1) {
    const r = Math.random();
    if (r < 0.42 * rich) return { type: 'weapon', id: randomWeapon() };
    if (r < 0.6) return { type: 'ammo' };
    if (r < 0.74) return { type: 'bandage' };
    if (r < 0.82) return { type: 'medkit' };
    if (r < 0.9) return { type: 'grenade' };
    return { type: 'armor', level: Math.random() < 0.55 ? 1 : Math.random() < 0.75 ? 2 : 3 };
  }
  populate(map, density = 1) {
    for (const s of map.loot) {
      if (Math.random() > 0.8 * density) continue;
      const n = Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const x = s[0] + rand(-0.7, 0.7), z = s[1] + rand(-0.7, 0.7);
        const y = G.world.groundAt(x, z, s[2] + 0.5, 0.1, 0.8);
        const it = this.spawn(x, y + 0.02, z, this.randomItem()); it.house = s[3] ?? null; it.floor = s[4] || 0;
      }
    }
  }
  nearest(actor, r = 2.3) {
    let best = null, bs = -1e9;
    const e = actor.eyePos(new THREE.Vector3()), f = actor.forward(new THREE.Vector3());
    for (const it of this.items) {
      if (it.taken) continue;
      const dx = it.pos.x - actor.pos.x, dz = it.pos.z - actor.pos.z, dy = it.pos.y - actor.pos.y;
      const d = Math.hypot(dx, dz);
      if (d > r || Math.abs(dy) > 1.6) continue;
      const to = new THREE.Vector3(it.pos.x - e.x, it.pos.y + 0.1 - e.y, it.pos.z - e.z).normalize();
      const sc = to.dot(f) * 2 - d * 0.5;
      if (sc > bs) { bs = sc; best = it; }
    }
    return best;
  }
  nearestFor(a, r) {
    let best = null, bd = 1e9;
    for (const it of this.items) {
      if (it.taken) continue;
      const d = it.pos.distanceTo(a.pos);
      if (d > r) continue;
      let want = 1;
      if (it.type === 'weapon') want = a.weapons.some((w) => w && w.def.id === it.id) ? 0.6 : !a.weapon ? 3 : (!a.weapons[1] || WEAPONS[it.id].tier > a.weapon.def.tier) ? 1.5 : 0;
      else if (it.type === 'armor') want = it.level * 25 > a.armor ? 1.5 : 0;
      else if (it.type === 'ammo') want = a.weapon ? 0.6 : 0;
      else want = 0.7;
      if (want <= 0) continue;
      const s = d / want;
      if (s < bd) { bd = s; best = it; }
    }
    return best;
  }
  tryPickup(actor) {
    const it = this.nearest(actor);
    if (it) this.pickup(actor, it);
  }
  pickup(a, it) {
    if (it.taken) return false;
    const isP = a.isPlayer;
    if (it.type === 'weapon') {
      if (G.mode.rangeRack && it.rack) { // 訓練場の武器棚
        const slot = a.weapons[0] && a.weapons[1] ? a.cur : a.weapons[0] ? 1 : 0;
        a.giveWeapon(it.id, slot); if (isP) { G.player.onWeaponChanged(); G.audio.play('pickup'); G.hud.toast(WEAPONS[it.id].name + ' を装備'); }
        return true;
      }
      const same = a.weapons.find((w) => w && w.def.id === it.id);
      if (same) {
        const add = (it.mag ?? same.def.mag) + (it.reserve ?? Math.round(same.def.reserve * 0.5));
        same.reserve += add;
        it.taken = true; this.group.remove(it.mesh);
        if (isP) { G.audio.play('pickup'); G.audio.play('magIn'); G.hud.toast(`${same.def.name} の弾薬 +${add}`); }
        return true;
      }
      let slot = !a.weapons[0] ? 0 : !a.weapons[1] ? 1 : a.cur;
      const old = a.weapons[slot];
      a.giveWeapon(it.id, slot, it.mag, it.reserve);
      if (old) this.spawn(a.pos.x + rand(-0.5, 0.5), it.pos.y, a.pos.z + rand(-0.5, 0.5), { type: 'weapon', id: old.def.id, mag: old.mag, reserve: old.reserve });
      if (isP) G.player.onWeaponChanged();
    } else if (it.type === 'ammo') {
      for (const w of a.weapons) if (w) w.reserve += Math.ceil(w.def.mag * 1.5);
      if (!a.weapons[0] && !a.weapons[1] && isP) { G.hud.toast('武器を持っていません'); return false; }
    } else if (it.type === 'bandage') a.bandages += 2;
    else if (it.type === 'medkit') a.medkits += 1;
    else if (it.type === 'grenade') a.grenades += 1 + (Math.random() < 0.3 ? 1 : 0);
    else if (it.type === 'armor') {
      const v = [0, 50, 75, 100][it.level];
      if (a.armor >= v) { if (isP) G.hud.toast('より良いアーマーを装備中'); return false; }
      a.armor = v; a.armorMax = v; if (isP) G.audio.play('armorEquip');
    }
    it.taken = true;
    this.group.remove(it.mesh);
    if (isP) { G.audio.play('pickup'); G.hud.toast(this.itemName(it) + ' を入手'); }
    return true;
  }
  dropAll(a) {
    const p = a.pos;
    const drop = (d) => { const x = p.x + rand(-1, 1), z = p.z + rand(-1, 1); const y = G.world.groundAt(x, z, p.y + 0.8, 0.1, 1); this.spawn(x, y + 0.02, z, d); };
    for (const w of a.weapons) if (w) drop({ type: 'weapon', id: w.def.id, mag: w.mag, reserve: w.reserve });
    if (a.medkits > 0) drop({ type: 'medkit' });
    if (a.bandages > 0) drop({ type: 'bandage' });
    if (a.armor > 40) drop({ type: 'armor', level: a.armorMax >= 100 ? 3 : a.armorMax >= 75 ? 2 : 1 });
    if (a.weapons[0] || a.weapons[1]) drop({ type: 'ammo' });
  }
  update(dt) {
    this.t += dt;
    for (const it of this.items) {
      if (it.taken) continue;
      it.obj.rotation.y = it.type === 'armor' ? 0 : this.t * 0.8 + it.phase;
      if (it.type === 'weapon') { it.obj.rotation.set(0, this.t * 0.8 + it.phase, Math.PI / 2); it.obj.position.y = 0.12 + Math.sin(this.t * 2 + it.phase) * 0.03; }
      it.glow.material.opacity = 0.4 + Math.sin(this.t * 3 + it.phase) * 0.15;
    }
    if (this.items.length > 600) this.items = this.items.filter((i) => !i.taken);
  }
  dispose() { G.scene.remove(this.group); this.items = []; }
}
