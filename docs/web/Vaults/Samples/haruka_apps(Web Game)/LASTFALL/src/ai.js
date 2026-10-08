// AI: 人型ボット（PvP）とモンスター（PvE）
import * as THREE from 'three';
import { G } from './state.js';
import { fire, melee, Grenade } from './combat.js';
import { rand, pick, clamp, angleDiff, dampAngle, lerp } from './util.js';

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3();

// ---- 建物内の経路（ドア・階段） ----
export function houseAt(p) {
  const hs = G.map && G.map.houses; if (!hs) return null;
  for (const H of hs) { const r = H.rect; if (p.x > r[0] && p.x < r[2] && p.z > r[1] && p.z < r[3] && p.y > H.y - 1.2 && p.y < H.y + H.floors * H.fh + 0.5) return H; }
  return null;
}
const floorOf = (H, y) => clamp(Math.floor((y - H.y + 0.8) / H.fh), 0, H.floors - 1);
function chainPts(H, a, b) { // 階aから階bへ
  const out = [];
  if (a < b) { for (let f = a; f < b; f++) for (let k = 0; k < 4; k++) out.push(H.chain[f * 4 + k]); }
  else if (a > b) { for (let f = a - 1; f >= b; f--) for (let k = 3; k >= 0; k--) out.push(H.chain[f * 4 + k]); }
  return out.map((c) => ({ x: c.p[0], z: c.p[1] }));
}
function nearestDoor(H, x, z) { let best = H.doors[0], bd = 1e9; for (const d of H.doors) { const dd = Math.hypot(d.out[0] - x, d.out[1] - z); if (dd < bd) { bd = dd; best = d; } } return best; }
export function planPath(from, to, toHouse, toFloor) {
  const path = [];
  const hs = houseAt(from), fs = hs ? floorOf(hs, from.y) : 0;
  const ht = toHouse !== undefined && toHouse !== null ? G.map.houses[toHouse] : houseAt(to);
  const ft = ht ? (toFloor ?? floorOf(ht, to.y)) : 0;
  if (hs && hs === ht) path.push(...chainPts(hs, fs, ft));
  else {
    if (hs) { path.push(...chainPts(hs, fs, 0)); const d = nearestDoor(hs, to.x, to.z); path.push({ x: d.in[0], z: d.in[1] }, { x: d.out[0], z: d.out[1] }); }
    if (ht) { const lp = path.length ? path[path.length - 1] : from; const d = nearestDoor(ht, lp.x, lp.z); path.push({ x: d.out[0], z: d.out[1] }, { x: d.in[0], z: d.in[1] }); path.push(...chainPts(ht, 0, ft)); }
  }
  path.push({ x: to.x, z: to.z });
  return path;
}

// ---- ナビゲーション（障害物回避のステアリング） ----
class Nav {
  constructor(actor) { this.a = actor; this.probeT = 0; this.dir = 0; this.side = Math.random() < 0.5 ? 1 : -1; this.stuckT = 0; this.lastPos = actor.pos.clone(); this.checkT = 0; this.unstuck = 0; this.unstuckDir = 0; this.jump = false; }
  route(x, y, z, house, floor) {
    const a = this.a, d = this.dest;
    if (!d || Math.hypot(d.x - x, d.z - z) > 1.5 || Math.abs(d.y - y) > 1.5 || G.time - this.pathT > 8 || this.repath) {
      this.dest = { x, y, z }; this.path = planPath(a.pos, this.dest, house, floor); this.pi = 0; this.pathT = G.time; this.repath = false;
    }
    while (this.pi < this.path.length - 1) { const p = this.path[this.pi]; if (Math.hypot(p.x - a.pos.x, p.z - a.pos.z) < 0.75) this.pi++; else break; }
    return this.path[this.pi];
  }
  steer(tx, tz, dt) {
    const a = this.a;
    const dx = tx - a.pos.x, dz = tz - a.pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.3) return { wx: 0, wz: 0, dist, jump: false };
    let want = Math.atan2(dx, dz);
    this.jump = false;
    if (this.unstuck > 0) { this.unstuck -= dt; want = this.unstuckDir; }
    this.probeT -= dt;
    if (this.probeT <= 0) {
      this.probeT = 0.12 + Math.random() * 0.05;
      const tryA = [0, 0.45, -0.45, 0.9, -0.9, 1.4, -1.4, 2.0, -2.0];
      this.dir = want;
      for (let i = 0; i < tryA.length; i++) {
        const ang = want + tryA[i] * (i % 2 ? this.side : -this.side);
        const res = this.probe(ang, Math.min(2.4, dist));
        if (res === 'free') { this.dir = ang; if (i > 2 && Math.random() < 0.02) this.side *= -1; break; }
        if (res === 'jump' && i === 0) { this.dir = ang; this.jump = true; break; }
      }
      // スタック判定
      this.checkT += this.probeT;
      if (this.checkT > 1.5) {
        const moved = this.lastPos.distanceTo(a.pos);
        if (moved < 0.8) { this.stuckT += this.checkT; if (this.stuckT > 3) this.repath = true; this.unstuck = rand(0.8, 1.6); this.unstuckDir = want + rand(1.2, 2.5) * (Math.random() < 0.5 ? 1 : -1); this.jump = true; this.side *= -1; }
        else this.stuckT = 0;
        this.lastPos.copy(a.pos); this.checkT = 0;
      }
    }
    return { wx: Math.sin(this.dir), wz: Math.cos(this.dir), dist, jump: this.jump };
  }
  probe(ang, len) {
    const a = this.a, W = G.world;
    const d = _a.set(Math.sin(ang), 0, Math.cos(ang));
    const lowH = a.stepH + 0.05, highH = 1.3 * a.scale;
    const o1 = _b.set(a.pos.x, a.pos.y + lowH, a.pos.z);
    const h1 = W.raycast(o1, d, len + a.radius);
    if (!h1) {
      // 崖チェック（前方の地面）
      const fx = a.pos.x + d.x * 1.5, fz = a.pos.z + d.z * 1.5;
      if (W.groundAt(fx, fz, a.pos.y + 0.5, 0.2, 1) < a.pos.y - 4 && !a.isMonster) return 'blocked';
      if (!a.isMonster && W.waterLevel > -900 && W.height(fx, fz) < W.waterLevel - 1.0) return 'blocked';
      return 'free';
    }
    const o2 = _c.set(a.pos.x, a.pos.y + highH, a.pos.z);
    const h2 = W.raycast(o2, d, len + a.radius);
    if (!h2 && h1.t < 1.4) return 'jump';
    return 'blocked';
  }
}

// ============================================================================
// 人型ボット
// ============================================================================
const IDEAL = { pistol: 14, smg: 14, shotgun: 7, ar: 28, lmg: 30, dmr: 55, sniper: 80 };
export class BotBrain {
  constructor(actor, diff = 1) {
    this.a = actor; actor.brain = this;
    this.nav = new Nav(actor);
    const D = [{ react: 0.7, err: 0.036, turn: 4.5, sight: 0.75, burst: 0.55 }, { react: 0.42, err: 0.022, turn: 7, sight: 1, burst: 0.4 }, { react: 0.26, err: 0.014, turn: 11, sight: 1.2, burst: 0.28 }][+diff] || { react: 0.45, err: 0.03, turn: 7, sight: 1, burst: 0.4 };
    this.D = D;
    this.target = null; this.lastSeen = new THREE.Vector3(); this.lastSeenT = -99; this.visible = false;
    this.percT = Math.random() * 0.3; this.reactT = 0; this.err = new THREE.Vector3(); this.errMag = 0.1;
    this.way = null; this.wayT = 0; this.strafeT = 0; this.strafe = 1; this.burstLeft = 0; this.burstPause = 0;
    this.lootTarget = null; this.investigate = null; this.healWant = false; this.crouchT = 0;
    this.personality = { aggro: rand(0.3, 1), camper: Math.random() < 0.25 };
    this.grenadeT = rand(5, 15);
  }
  onHurt(attacker) {
    if (!attacker || attacker === this.a || attacker.team === this.a.team) return;
    if (!this.target || !this.visible || Math.random() < 0.5) { this.target = attacker; this.lastSeen.copy(attacker.pos); this.lastSeenT = G.time; }
    this.reactT = Math.min(this.reactT, this.D.react * 0.6);
  }
  sightRange() { return (G.map.id === 'forest' ? 80 : G.map.id === 'city' ? 110 : 170) * this.D.sight; }
  perceive() {
    const a = this.a;
    const eye = a.eyePos(_a);
    let best = null, bd = 1e9;
    const R = this.sightRange();
    const fwd = _d.set(-Math.sin(a.yaw), 0, -Math.cos(a.yaw));
    for (const o of G.actors) {
      if (!o.alive || o === a || o.team === a.team || o.dropState) continue;
      const dx = o.pos.x - a.pos.x, dz = o.pos.z - a.pos.z, dy = o.pos.y - a.pos.y;
      const d = Math.hypot(dx, dy, dz);
      if (d > R || d > bd) continue;
      const dot = (dx * fwd.x + dz * fwd.z) / (Math.hypot(dx, dz) || 1);
      const inFov = dot > 0.2 || d < 10 || (this.target === o);
      if (!inFov) continue;
      // しゃがみは発見されにくい
      if (o.crouch > 0.5 && d > R * 0.55 && this.target !== o) continue;
      const c = o.center(_b); c.y += 0.3;
      if (!G.world.lineOfSight(eye, c)) continue;
      best = o; bd = d;
    }
    const was = this.visible;
    this.visible = !!best;
    if (best) {
      if (best !== this.target || !was) { this.reactT = this.D.react * rand(0.7, 1.4) * (bd > 60 ? 1.4 : 1); this.errMag = this.D.err * rand(1.5, 2.5); }
      this.target = best; this.lastSeen.copy(best.pos); this.lastSeenT = G.time;
    }
  }
  pickWaypoint() {
    const Z = G.zone;
    const m = G.map;
    // 未探索の屋内スポットを優先
    for (let i = 0; i < 8; i++) {
      let x, z;
      let y = 0, house = null, floor = 0;
      if (m.loot.length && Math.random() < 0.6) { const s = pick(m.loot); x = s[0]; z = s[1]; y = s[2]; house = s[3] ?? null; floor = s[4] || 0; }
      else { const p = m.randomOutdoor(); x = p[0]; z = p[2]; y = p[1]; }
      if (Z && Z.active) { const zc = Z.targetCenter, zr = Z.targetRadius; if (Math.hypot(x - zc.x, z - zc.y) > zr * 0.85) continue; }
      if (Math.hypot(x - this.a.pos.x, z - this.a.pos.z) > 120 && Math.random() < 0.7) continue;
      this.way = new THREE.Vector3(x, y, z); this.way.house = house; this.way.floor = floor; this.wayT = rand(20, 45); return;
    }
    if (Z && Z.active) { const a = Math.random() * 6.28, r = Math.random() * Z.targetRadius * 0.6; const x = Z.targetCenter.x + Math.cos(a) * r, z = Z.targetCenter.y + Math.sin(a) * r; this.way = new THREE.Vector3(x, G.world.height(x, z), z); }
    else { const p = m.randomOutdoor(); this.way = new THREE.Vector3(p[0], p[1], p[2]); }
    this.wayT = 30;
  }
  update(dt) {
    const a = this.a;
    if (!a.alive) return;
    if (a.dropState) { G.mode.drop.botSteer(a, dt); a.updateVisual(dt); return; }
    this.percT -= dt;
    if (this.percT <= 0) { this.percT = 0.22 + Math.random() * 0.1; this.perceive(); }
    const w = a.weapon;
    let tx = null, tz = null, speed = 4.6, lookAt = null, wantFire = false, dest = null;
    if (!w && a.landT !== undefined && G.time - a.landT > 40 && !a.gaveFallback) { a.gaveFallback = true; a.giveWeapon(pick(['pistol', 'smg', 'shotgun'])); }
    a.sprinting = false;
    const Z = G.zone;
    const outside = Z && Z.active && Z.dist(a.pos) > -2;
    const tgt = this.target && this.target.alive ? this.target : null;
    if (!tgt) this.visible = false;
    // 回復
    if (a.healing > 0) {
      a.healing -= dt;
      if (a.healing <= 0) { a.health = Math.min(100, a.health + (this.healKind === 'medkit' ? 80 : 25)); if (this.healKind === 'medkit') a.medkits--; else a.bandages--; }
      if (this.visible && a.health > 30) a.healing = 0;
    } else if (a.health < 55 && (a.medkits > 0 || a.bandages > 0) && G.time - a.lastDamage > 3 && !this.visible && !outside) {
      this.healKind = a.medkits > 0 && a.health < 60 ? 'medkit' : 'bandage';
      a.healing = this.healKind === 'medkit' ? 5 : 3;
    }
    if (tgt && this.visible && w) {
      // 戦闘
      const d = a.pos.distanceTo(tgt.pos);
      const ideal = IDEAL[w.def.type] * lerp(0.7, 1.3, 1 - this.personality.aggro);
      this.strafeT -= dt;
      if (this.strafeT <= 0) { this.strafeT = rand(0.5, 1.6); this.strafe = Math.random() < 0.5 ? -1 : 1; if (Math.random() < 0.15) this.strafe = 0; }
      const toT = _a.subVectors(tgt.pos, a.pos).setY(0).normalize();
      const side = _b.set(-toT.z, 0, toT.x).multiplyScalar(this.strafe);
      const adv = d > ideal * 1.3 ? 1 : d < ideal * 0.6 ? -0.7 : 0;
      const mv = side.addScaledVector(toT, adv);
      tx = a.pos.x + mv.x * 5; tz = a.pos.z + mv.z * 5;
      speed = 4.2;
      this.crouchT -= dt;
      if (this.crouchT <= 0) { this.crouchT = rand(1, 3); a.crouching = d > 25 && Math.random() < 0.4; }
      if (a.crouching) speed = 2.3;
      // 狙い
      const aimPart = Math.random() < 0.18 + (this.D.err < 0.03 ? 0.15 : 0) ? 'head' : 'body';
      const ap = tgt.center(_c); ap.y += (aimPart === 'head' ? 0.76 : 0.28) * tgt.scale * (1 - tgt.crouch * 0.3);
      // 誤差は時間とともに収束
      this.errMag = Math.max(this.D.err * (1 + Math.hypot(tgt.vel.x, tgt.vel.z) * 0.12), this.errMag - dt * this.D.err * 0.9);
      if (Math.random() < dt * 4) this.err.set(rand(-1, 1), rand(-0.6, 0.6), rand(-1, 1));
      ap.addScaledVector(this.err, this.errMag * d);
      lookAt = ap;
      this.reactT -= dt;
      wantFire = this.reactT <= 0 && d < w.def.range * 0.9;
      // グレネード
      this.grenadeT -= dt;
    } else if (tgt && G.time - this.lastSeenT < 7 && w) {
      // 最後に見た位置へ
      dest = { x: this.lastSeen.x, y: this.lastSeen.y, z: this.lastSeen.z }; speed = 4.8;
      lookAt = _c.set(this.lastSeen.x, this.lastSeen.y + 1.3, this.lastSeen.z);
      a.crouching = false;
      this.grenadeT -= dt;
      if (a.grenades > 0 && this.grenadeT <= 0 && a.pos.distanceTo(this.lastSeen) < 30 && a.pos.distanceTo(this.lastSeen) > 8) {
        this.grenadeT = rand(10, 20); a.grenades--;
        const o = a.eyePos(new THREE.Vector3());
        const dv = new THREE.Vector3().subVectors(this.lastSeen, o); const hd = Math.hypot(dv.x, dv.z);
        const v = new THREE.Vector3(dv.x / hd, 0, dv.z / hd).multiplyScalar(Math.min(20, hd * 0.75)); v.y = 3 + hd * 0.25;
        G.grenades.push(new Grenade(a, o, v)); G.audio.play('throw', a.pos);
      }
    } else {
      a.crouching = false;
      if (tgt && !w) { // 武器なし → 逃げる
        const away = _a.subVectors(a.pos, tgt.pos).setY(0).normalize();
        tx = a.pos.x + away.x * 10; tz = a.pos.z + away.z * 10; speed = 7; a.sprinting = true;
      }
      // 騒音
      if (tx === null && w && !outside) {
        for (let i = G.noises.length - 1; i >= 0; i--) {
          const n = G.noises[i];
          if (n.src === a || G.time - n.t > 2) continue;
          if (n.pos.distanceTo(a.pos) < n.r * this.personality.aggro) { this.investigate = n.pos.clone(); this.invT = rand(6, 12); break; }
        }
      }
      if (this.investigate && !outside) {
        this.invT -= dt;
        dest = { x: this.investigate.x, y: this.investigate.y, z: this.investigate.z }; speed = 4.8; tx = dest.x; tz = dest.z;
        if (this.invT <= 0 || a.pos.distanceTo(this.investigate) < 3) this.investigate = null;
      }
      if (tx === null) {
        // 物資漁り
        const L = G.loot;
        if (!this.lootTarget || this.lootTarget.taken || this.lootT <= 0) {
          this.lootTarget = null;
          const need = !w || (a.armor < 30) || Math.random() < 0.3;
          if (need && L && !outside) this.lootTarget = L.nearestFor(a, w ? 35 : 70);
          this.lootT = 12;
        }
        if (this.lootTarget) {
          this.lootT -= dt;
          const lp = this.lootTarget.pos;
          dest = { x: lp.x, y: lp.y, z: lp.z, house: this.lootTarget.house, floor: this.lootTarget.floor }; tx = lp.x; tz = lp.z; speed = 5.5;
          if (Math.hypot(lp.x - a.pos.x, lp.z - a.pos.z) < 1.4 && Math.abs(lp.y - a.pos.y) < 1.5) { L.pickup(a, this.lootTarget); this.lootTarget = null; }
        } else {
          this.wayT -= dt;
          if (!this.way || this.wayT <= 0 || Math.hypot(this.way.x - a.pos.x, this.way.z - a.pos.z) < 3 || (outside && Z && Math.hypot(this.way.x - Z.targetCenter.x, this.way.z - Z.targetCenter.y) > Z.targetRadius)) this.pickWaypoint();
          if (this.personality.camper && !outside && Math.random() < 0.002) this.wayT = rand(8, 20);
          dest = { x: this.way.x, y: this.way.y, z: this.way.z, house: this.way.house, floor: this.way.floor }; tx = this.way.x; tz = this.way.z; speed = outside ? 7.2 : 5; a.sprinting = outside || Math.hypot(tx - a.pos.x, tz - a.pos.z) > 40;
          if (a.sprinting) speed = 7.2;
        }
      }
    }
    if (outside && (!this.visible || a.health < 60)) { tx = Z.targetCenter.x; tz = Z.targetCenter.y; dest = { x: tx, y: G.world.height(tx, tz), z: tz }; speed = 7.2; a.sprinting = true; }
    if (dest && !(tgt && this.visible && w)) { const p = this.nav.route(dest.x, dest.y, dest.z, dest.house, dest.floor); tx = p.x; tz = p.z; }
    if (a.healing > 0) speed = Math.min(speed, 2);
    // 移動
    let st = { wx: 0, wz: 0, jump: false, dist: 0 };
    if (tx !== null) st = this.nav.steer(tx, tz, dt);
    if (st.dist < 0.6) { st.wx = st.wz = 0; }
    a.physics(dt, st.wx, st.wz, speed, st.jump);
    a.crouch = lerp(a.crouch, a.crouching ? 1 : 0, 1 - Math.exp(-10 * dt));
    a.footsteps(dt, Math.hypot(a.vel.x, a.vel.z));
    // 視線
    if (lookAt) {
      const e = a.eyePos(_d);
      const dx = lookAt.x - e.x, dy = lookAt.y - e.y, dz = lookAt.z - e.z;
      const yawT = Math.atan2(-dx, -dz), pitchT = Math.atan2(dy, Math.hypot(dx, dz));
      const t = this.D.turn;
      const dy_ = angleDiff(a.yaw, yawT);
      a.yaw += clamp(dy_, -t * dt, t * dt);
      a.pitch += clamp(pitchT - a.pitch, -t * dt, t * dt);
      if (wantFire && Math.abs(dy_) < 0.08 + 0.4 / Math.max(3, a.pos.distanceTo(lookAt))) this.tryFire(dt);
    } else if (Math.hypot(a.vel.x, a.vel.z) > 0.5) {
      a.yaw = dampAngle(a.yaw, Math.atan2(-a.vel.x, -a.vel.z), 6, dt); a.pitch *= 0.9;
    }
    // リロード
    if (w) {
      a.fireCd -= dt;
      if (a.reloading > 0) { a.reloading -= dt; if (a.reloading <= 0) { const need = w.def.mag - w.mag; const take = Math.min(need, w.reserve); w.mag += take; w.reserve -= take; } }
      else if (w.mag === 0) { if (w.reserve > 0) { a.reloading = w.def.shellReload ? w.def.reload * w.def.mag * 0.7 : w.def.reload; G.audio.play('magOut', a.pos, { maxDist: 30 }); } else if (a.weapons[1 - a.cur] && a.weapons[1 - a.cur].mag + a.weapons[1 - a.cur].reserve > 0) a.switchTo(1 - a.cur); }
      else if (!this.visible && w.mag < w.def.mag * 0.4 && w.reserve > 0) a.reloading = w.def.reload;
    }
    a.updateVisual(dt);
  }
  tryFire(dt) {
    const a = this.a, w = a.weapon;
    if (!w || a.reloading > 0 || a.healing > 0 || a.fireCd > 0 || w.mag <= 0) return;
    if (this.burstPause > 0) { this.burstPause -= dt; return; }
    const d = w.def;
    // 近距離の味方以外は気にしない
    w.mag--;
    a.fireCd = 60 / d.rpm * (d.auto ? 1 : rand(1.4, 2.6));
    const o = a.eyePos(new THREE.Vector3()); const dir = a.forward(new THREE.Vector3());
    const hs = Math.hypot(a.vel.x, a.vel.z);
    const dist = this.target ? this.target.pos.distanceTo(a.pos) : 20;
    const spread = d.pellets > 1 ? d.hip : (dist > 12 ? d.ads * 1.5 : d.hip * 0.5) + hs * d.move * 0.05;
    fire(a, d, o, dir, spread, { muzzle: a.muzzlePos(new THREE.Vector3()) });
    a.recoil = 1;
    a.pitch += d.rv * 0.3;
    if (d.auto) { this.burstLeft--; if (this.burstLeft <= 0) { this.burstLeft = Math.floor(rand(3, 9)); this.burstPause = rand(0.15, 0.5) * (this.D.burst / 0.4); } }
  }
}

// ============================================================================
// モンスター
// ============================================================================
export class MonsterBrain {
  constructor(actor) {
    this.a = actor; actor.brain = this;
    this.nav = new Nav(actor);
    this.st = actor.stats;
    this.atkT = -1; this.cd = 0; this.growlT = rand(1, 5); this.noticed = false;
    this.leapT = rand(2, 4); this.roarT = 10; this.chargeT = 0; this.hitDone = false;
    this.roarAnim = 0; this.emerge = -1;
    actor.stagger = 0;
  }
  voice(kind) {
    const k = this.a.kind;
    const V = {
      idle: { ghoul: ['mgrowl', 'mbreath', 'mgrowl', 'mgurgle'], crawler: ['mclick', 'mclick', 'mscream'], brute: ['mroar', 'mgrowl', 'mbreath'], boss: ['mroar', 'mgrowl'] },
      notice: { ghoul: ['mscream'], crawler: ['mscream'], brute: ['mroar'], boss: ['mroar'] },
      attack: { ghoul: ['mgrowl', 'mscream'], crawler: ['mclick', 'mscream'], brute: ['mroar'], boss: ['mroar'] },
    }[kind][k];
    G.audio.play(pick(V), this.a.pos, { maxDist: 110, big: k === 'brute' || k === 'boss' ? (k === 'boss' ? 2 : 1) : 0, short: kind === 'attack' });
  }
  startEmerge() { this.emerge = 0; }
  onHurt(attacker) { if (attacker && !attacker.isMonster) this.target = attacker; }
  update(dt) {
    const a = this.a;
    if (!a.alive) return;
    const S = this.st;
    // ターゲット
    if (!this.target || !this.target.alive || Math.random() < dt * 0.5) {
      let best = null, bd = 1e9;
      for (const o of G.actors) { if (!o.alive || o.isMonster || o.dropState) continue; const d = o.pos.distanceTo(a.pos); if (d < bd) { bd = d; best = o; } }
      this.target = best;
    }
    const t = this.target;
    // 地面から這い出す演出
    if (this.emerge >= 0 && this.emerge < 1) {
      this.emerge = Math.min(1, this.emerge + dt / (a.kind === 'boss' ? 2.4 : 1.5));
      a.anim.emerge = this.emerge;
      if (Math.random() < dt * 25) G.vfx.impact(a.pos.clone().add(new THREE.Vector3(rand(-0.6, 0.6), 0.05, rand(-0.6, 0.6))), new THREE.Vector3(0, 1, 0), 'dirt');
      if (t) a.yaw = dampAngle(a.yaw, Math.atan2(-(t.pos.x - a.pos.x), -(t.pos.z - a.pos.z)), 3, dt);
      a.physics(dt, 0, 0, 0, false); a.updateVisual(dt);
      return;
    }
    a.anim.emerge = 1;
    this.roarAnim = Math.max(0, this.roarAnim - dt);
    a.anim.roar = Math.min(1, this.roarAnim * 2.5);
    a.anim.atkStrike = this.atkT >= S.windup;
    a.stagger = Math.max(0, (a.stagger || 0) - dt * 1.4);
    a.anim.stagger = a.stagger;
    this.cd -= dt;
    this.growlT -= dt;
    if (this.growlT <= 0) { this.growlT = rand(2.5, 6.5); this.voice('idle'); }
    let wx = 0, wz = 0, speed = S.speed, jump = false;
    if (t) {
      const d = a.pos.distanceTo(t.pos);
      if (!this.noticed && d < 40) { this.noticed = true; this.voice('notice'); this.roarAnim = a.kind === 'crawler' ? 0.5 : 0.9; }
      const dx = t.pos.x - a.pos.x, dz = t.pos.z - a.pos.z;
      const face = Math.atan2(-dx, -dz);
      // 攻撃
      if (this.atkT >= 0) {
        this.atkT += dt;
        const w = S.windup;
        a.anim.attack = this.atkT < w ? this.atkT / w : Math.max(0, 1 - (this.atkT - w) / 0.35);
        a.yaw = dampAngle(a.yaw, face, 5, dt);
        if (this.atkT >= w && !this.hitDone) {
          this.hitDone = true;
          G.audio.play('swipe', a.pos);
          const reach = S.range + 0.6;
          if (S.slam) {
            G.vfx.impact(a.pos.clone().add(new THREE.Vector3(-Math.sin(a.yaw) * 1.5 * a.scale, 0.1, -Math.cos(a.yaw) * 1.5 * a.scale)), new THREE.Vector3(0, 1, 0), 'dirt');
            G.audio.play('slam', a.pos);
            if (G.player) G.engine.addShake(clamp(1.2 - a.distToPlayer() / 20, 0, 0.9));
            for (const o of G.actors) if (o.alive && !o.isMonster && o.pos.distanceTo(a.pos) < reach + 0.8) melee(a, o, S.dmg, a.kind === 'boss' ? 14 : 9);
          } else if (d < reach && Math.abs(angleDiff(a.yaw, face)) < 1.1) melee(a, t, S.dmg, 3);
        }
        if (this.atkT > w + 0.4) { this.atkT = -1; this.cd = S.cd; a.anim.attack = 0; }
        speed *= 0.25;
        if (a.stagger > 0.6) { this.atkT = -1; a.anim.attack = 0; }
      } else if (d < S.range && this.cd <= 0 && a.stagger < 0.4) { this.atkT = 0; this.hitDone = false; if (Math.random() < 0.7) this.voice('attack'); }
      // 跳躍（クローラー）
      if (S.leap) { this.leapT -= dt; if (this.leapT <= 0 && d > 3 && d < 9 && a.onGround && this.atkT < 0) { this.leapT = rand(2.5, 4.5); a.vel.set(dx / d * 11, 5.5, dz / d * 11); a.onGround = false; this.voice('notice'); this.atkT = 0; this.hitDone = false; } }
      // ボス: 咆哮と召喚・突進
      if (S.boss) {
        this.roarT -= dt;
        if (this.roarT <= 0) { this.roarT = rand(14, 20); this.voice('notice'); this.roarAnim = 1.4; G.engine.addShake(0.5); G.mode.bossSummon && G.mode.bossSummon(a); this.atkT = -1; }
        this.chargeT -= dt;
        if (this.chargeT < -6 && d > 12 && d < 40) this.chargeT = 2.2;
        if (this.chargeT > 0) speed *= 2.1;
      }
      if (d > S.range * 0.7 || this.atkT < 0) {
        const rp = d < 6 && Math.abs(t.pos.y - a.pos.y) < 1.2 ? t.pos : this.nav.route(t.pos.x, t.pos.y, t.pos.z);
        const s = this.nav.steer(rp.x, rp.z, dt);
        wx = s.wx; wz = s.wz; jump = s.jump;
        if (d < S.range * 0.8) { wx = wz = 0; }
      }
      if (this.atkT < 0) a.yaw = dampAngle(a.yaw, Math.hypot(a.vel.x, a.vel.z) > 1 ? Math.atan2(-a.vel.x, -a.vel.z) : face, 8, dt);
    } else {
      // うろつく
      if (!this.wander || a.pos.distanceTo(this.wander) < 3) { const p = G.map.randomOutdoor(); this.wander = new THREE.Vector3(p[0], p[1], p[2]); }
      const s = this.nav.steer(this.wander.x, this.wander.z, dt); wx = s.wx; wz = s.wz; speed *= 0.4;
      a.yaw = dampAngle(a.yaw, Math.atan2(-a.vel.x, -a.vel.z), 5, dt);
    }
    if (a.stagger > 0.5) speed *= 0.15;
    if (this.roarAnim > 0) { speed = 0; wx = wz = 0; }
    if (!a.onGround && S.leap) { wx = a.vel.x / 11; wz = a.vel.z / 11; speed = 11; }
    a.physics(dt, wx, wz, speed, jump);
    a.footsteps(dt, Math.hypot(a.vel.x, a.vel.z));
    a.updateVisual(dt);
  }
}
