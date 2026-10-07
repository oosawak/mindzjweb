// 射撃・ヒット判定・ダメージ・グレネード
import * as THREE from 'three';
import { G } from './state.js';
import { raySphere, rand, clamp, smoothstep, lerp } from './util.js';
const adm = (k) => G.admin && G.admin.on && G.admin[k];

const _c = new THREE.Vector3(), _d = new THREE.Vector3(), _p = new THREE.Vector3(), _v = new THREE.Vector3();

export function traceShot(o, d, maxD, ignore) {
  const wh = G.world.raycast(o, d, maxD);
  let best = wh ? wh.t : maxD;
  let res = { t: best, world: wh };
  for (const a of G.actors) {
    if (!a.alive || a === ignore || a.dropState === 'plane') continue;
    a.center(_c);
    const vx = _c.x - o.x, vy = _c.y - o.y, vz = _c.z - o.z;
    const t = vx * d.x + vy * d.y + vz * d.z;
    if (t < -1 || t > best + 2) continue;
    const r = 1.3 * a.scale;
    if (vx * vx + vy * vy + vz * vz - t * t > r * r) continue;
    for (const hb of a.hitboxes()) {
      const ts = raySphere(o, d, hb.p, hb.r);
      if (ts >= 0 && ts < best) { best = ts; res = { t: ts, actor: a, part: hb.part }; }
    }
  }
  for (const c of G.corpses) {
    if (!c.ragdoll) continue;
    const pts = c.ragdoll.p;
    for (let i = 0; i < pts.length; i++) {
      const ts = raySphere(o, d, pts[i], (i === 0 ? 0.13 : 0.12) * c.scale);
      if (ts >= 0 && ts < best) { best = ts; res = { t: ts, corpse: c, pi: i }; }
    }
  }
  for (const tg of G.targets) {
    const ts = tg.ray(o, d, best);
    if (ts !== null && ts >= 0 && ts < best) { best = ts; res = { t: ts, target: tg }; }
  }
  res.point = new THREE.Vector3(o.x + d.x * res.t, o.y + d.y * res.t, o.z + d.z * res.t);
  return res;
}

export function damageFor(def, dist, part, victim) {
  const [n, f, m] = def.fall;
  let dmg = def.dmg * lerp(1, m, smoothstep(n, f, dist));
  if (part === 'head') dmg *= victim && victim.isMonster ? Math.max(2, def.head) : def.head;
  else if (part === 'arm' || part === 'leg') dmg *= 0.78;
  return dmg;
}

// 汎用の射撃
export function fire(shooter, def, origin, aim, spread, opts = {}) {
  const isP = shooter && shooter.isPlayer;
  const muzzle = opts.muzzle || origin;
  let anyHit = false;
  const pel = def.pellets;
  for (let i = 0; i < pel; i++) {
    _d.copy(aim);
    if (spread > 0) {
      // 円錐内の一様分布
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * spread;
      const up = Math.abs(_d.y) > 0.95 ? _v.set(1, 0, 0) : _v.set(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(_d, up).normalize();
      const up2 = new THREE.Vector3().crossVectors(right, _d);
      _d.addScaledVector(right, Math.cos(a) * r).addScaledVector(up2, Math.sin(a) * r).normalize();
    }
    const dir = _d.clone();
    const res = traceShot(origin, dir, def.range, shooter);
    const end = res.point;
    // トレーサー
    if (pel === 1 || i % 3 === 0) G.vfx.tracer(muzzle, end, isP ? 750 : 600);
    // 自分の弾の飛翔音（バレットウィズ）
    if (isP && i === 0 && res.t > 9) { const k = Math.min(res.t * 0.55, 22); const wp = origin.clone().addScaledVector(dir, k); wp.x += (Math.random() - 0.5) * 2; G.audio.play('whizAway', wp, { delay: k / 700, vol: def.type === 'sniper' || def.type === 'dmr' ? 1.3 : 0.9 }); }
    if (isP && adm('explosive') && (pel === 1 || i === 0) && res.t < def.range - 1 && G.time - (G._lastExpl || -1) > 0.06 && (G._lastExpl = G.time)) explode(end.clone(), shooter, def.pellets > 1 ? 6 : 4.5, def.type === 'sniper' ? 200 : 110, { skipOwner: true, small: true });
    if (res.actor) {
      anyHit = true;
      hitActor(shooter, res.actor, res.part, end, dir, def, res.t);
    } else if (res.corpse) {
      const c = res.corpse;
      c.ragdoll.push(end, dir.clone().multiplyScalar(def.dmg * 0.1 + 1));
      G.vfx.blood(end, dir, def.dmg * 0.8, { monster: c.isMonster });
      G.audio.play('flesh', end, { vol: 0.7 });
      if (G.settings.gore === 2 && (def.type === 'shotgun' || def.type === 'sniper') && res.t < 20 && Math.random() < 0.35) {
        const map = [null, 'head', null, 'armL', 'armR', 'armL', 'armR', 'armL', 'armR', null, null, 'legL', 'legR', 'legL', 'legR'];
        const limb = map[res.pi];
        if (limb) c.dismember(limb, dir, limb === 'head');
      }
    } else if (res.target) {
      anyHit = true;
      res.target.hit(end, dir, def, res.t, shooter);
    } else if (res.world) {
      const w = res.world;
      const n = new THREE.Vector3(w.nx, w.ny, w.nz);
      G.vfx.impact(end, n, w.mat);
      if (i === 0 || Math.random() < 0.3) G.audio.play('impact', end, { mat: w.mat, maxDist: 60 });
    }
    // 弾がプレイヤーの近くを通過
    if (!isP && G.player && G.player.actor.alive && !res.actor?.isPlayer) {
      const pe = G.player.actor.eyePos(_p);
      const t = (pe.x - origin.x) * dir.x + (pe.y - origin.y) * dir.y + (pe.z - origin.z) * dir.z;
      if (t > 3 && t < res.t) {
        const cx = origin.x + dir.x * t - pe.x, cy = origin.y + dir.y * t - pe.y, cz = origin.z + dir.z * t - pe.z;
        if (cx * cx + cy * cy + cz * cz < 4 * 4 && (i === 0 || Math.random() < 0.3)) { G.audio.play('whiz', new THREE.Vector3(pe.x + cx, pe.y + cy, pe.z + cz), { crack: def.type !== 'pistol' && def.type !== 'smg' && t > 15 }); G.player.suppress(0.3); }
      }
    }
  }
  // 発砲音と騒音イベント
  G.audio.play('gun', isP ? null : origin, { type: def.type, self: isP, maxDist: 450 });
  G.noises.push({ pos: origin.clone(), r: def.type === 'pistol' ? 70 : 140, t: G.time, src: shooter });
  if (!isP || opts.tp) G.vfx.muzzle(muzzle, aim, def.type === 'shotgun' || def.type === 'sniper' || def.type === 'lmg', isP || shooter.distToPlayer() < 60);
  return anyHit;
}

export function hitActor(shooter, victim, part, point, dir, def, dist) {
  if (shooter && victim.team === shooter.team && victim !== shooter && !G.mode.friendlyFire) return;
  let dmg = damageFor(def, dist, part, victim);
  if (shooter && shooter.isPlayer && adm('onehit')) dmg = victim.health + (victim.armor || 0) * 2 + 10;
  const wasAlive = victim.alive;
  const hp0 = victim.health;
  victim.takeDamage({ amount: dmg, part, dir, point, attacker: shooter, weapon: def, dist });
  const killed = wasAlive && !victim.alive;
  G.vfx.blood(point, dir, dmg, { monster: victim.isMonster });
  G.audio.play('flesh', point, { vol: part === 'head' ? 1.2 : 0.9 });
  if (victim.isMonster && victim.alive) { victim.stagger = Math.min(1, (victim.stagger || 0) + dmg / (victim.kind === 'boss' ? 400 : victim.kind === 'brute' ? 150 : 45)); }
  if (shooter && shooter.isPlayer) {
    if (G.mode.hits !== undefined) G.mode.hits++;
    G.hud.hitmarker(killed, part === 'head');
    G.hud.damageNumber(point, Math.round(Math.min(dmg, hp0 + (victim.armor || 0))), part === 'head', killed);
    if (!killed) G.audio.play(part === 'head' ? 'headshot' : 'hit');
  }
  if (victim.isPlayer) G.player.onHit(dir, dmg, shooter);
  if (victim.brain && shooter) victim.brain.onHurt(shooter);
}

// 近接攻撃（モンスター）
export function melee(attacker, victim, dmg, knock = 4) {
  const dir = new THREE.Vector3().subVectors(victim.pos, attacker.pos).setY(0).normalize();
  const p = victim.center();
  victim.takeDamage({ amount: dmg, part: 'torso', dir, point: p, attacker, melee: true });
  victim.vel.addScaledVector(dir, knock); victim.vel.y += knock * 0.4;
  G.vfx.blood(p, dir, dmg * 1.3, {});
  G.audio.play('flesh', p, { vol: 1.2 });
  if (dmg > 30) G.audio.play('splat', p, { vol: 0.8 });
  if (victim.isPlayer) G.player.onHit(dir.clone().negate(), dmg, attacker, true);
}

// ---- グレネード ----
export class Grenade {
  constructor(owner, pos, vel) {
    this.owner = owner; this.fuse = 3.2; this.pos = pos.clone(); this.vel = vel.clone(); this.dead = false;
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), new THREE.MeshStandardMaterial({ color: 0x3a4a30, roughness: 0.6, metalness: 0.3 }));
    body.scale.y = 1.25; g.add(body);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.04, 8), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1, roughness: 0.3 })); top.position.y = 0.075; g.add(top);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    this.mesh = g; G.scene.add(g);
    this.spin = new THREE.Vector3(rand(-10, 10), rand(-10, 10), rand(-10, 10));
    this.bounces = 0;
  }
  update(dt) {
    this.fuse -= dt;
    this.vel.y -= 14 * dt;
    const prev = this.pos.clone();
    this.pos.addScaledVector(this.vel, dt);
    // 衝突
    const d = new THREE.Vector3().subVectors(this.pos, prev); const L = d.length();
    if (L > 0) {
      d.divideScalar(L);
      const hit = G.world.raycast(prev, d, L + 0.06);
      if (hit) {
        this.pos.set(hit.x, hit.y, hit.z).addScaledVector(new THREE.Vector3(hit.nx, hit.ny, hit.nz), 0.07);
        const n = new THREE.Vector3(hit.nx, hit.ny, hit.nz);
        this.vel.reflect(n).multiplyScalar(0.38);
        if (this.vel.length() > 1.5 && this.bounces++ < 6) G.audio.play('clink', this.pos);
        this.spin.multiplyScalar(0.5);
      }
    }
    this.mesh.position.copy(this.pos);
    this.mesh.rotation.x += this.spin.x * dt; this.mesh.rotation.z += this.spin.z * dt;
    if (this.fuse <= 0) this.explode();
  }
  explode() {
    this.dead = true; G.scene.remove(this.mesh);
    explode(this.pos, this.owner, 8.5, 135);
  }
}
export function explode(pos, owner, R, maxDmg, opts = {}) {
  G.vfx.explosion(pos, R, opts.small);
  G.audio.play('explosion', pos, { maxDist: 600 });
  G.noises.push({ pos: pos.clone(), r: 200, t: G.time, src: owner });
  if (G.player) {
    const dp = G.player.actor.pos.distanceTo(pos);
    G.engine.addShake(clamp(1.4 - dp / 30, 0, 1.4) * (opts.small ? 0.3 : 1));
    if (dp < 12 && !opts.small) G.engine.final.uniforms.uFlash.value = clamp(0.6 - dp / 20, 0, 0.6);
  }
  const eye = new THREE.Vector3();
  const p2 = pos.clone(); p2.y += 0.3;
  for (const a of G.actors) {
    if (!a.alive || a.dropState) continue;
    if (opts.skipOwner && a === owner) continue;
    const c = a.center(eye);
    const d = c.distanceTo(pos);
    if (d > R) continue;
    if (!G.world.lineOfSight(p2, c)) continue;
    const dmg = maxDmg * Math.pow(1 - d / R, 1.3) * (a.isMonster ? 1.4 : 1);
    const dir = new THREE.Vector3().subVectors(c, pos).normalize();
    const hp0 = a.health;
    a.takeDamage({ amount: dmg, part: 'torso', dir, point: c, attacker: owner, explosive: true, weapon: { type: 'grenade', name: 'グレネード' } });
    a.vel.addScaledVector(dir, 12 * (1 - d / R)); a.vel.y += 5 * (1 - d / R);
    if (owner && owner.isPlayer && a !== owner) { G.hud.hitmarker(!a.alive, false); G.hud.damageNumber(c, Math.round(Math.min(dmg, hp0 + a.armor)), false, !a.alive); }
    if (a.isPlayer) G.player.onHit(dir.clone().negate(), dmg, owner);
    if (a.isMonster && a.alive) a.stagger = 1;
    if (a.brain && owner && owner !== a) a.brain.onHurt(owner);
  }
  for (const c of G.corpses) {
    if (!c.ragdoll) continue;
    const p = c.ragdoll.point('pelvis'); const d = p.distanceTo(pos);
    if (d > R) continue;
    c.ragdoll.push(p, new THREE.Vector3().subVectors(p, pos).normalize().multiplyScalar(18 * (1 - d / R)).add(new THREE.Vector3(0, 8 * (1 - d / R), 0)));
    if (G.settings.gore === 2 && d < R * 0.5) { const l = ['armL', 'armR', 'legL', 'legR', 'head']; c.dismember(l[Math.floor(Math.random() * 5)], new THREE.Vector3(0, 1, 0), false); }
  }
  for (const tg of G.targets) if (tg.explode) tg.explode(pos, R);
}
