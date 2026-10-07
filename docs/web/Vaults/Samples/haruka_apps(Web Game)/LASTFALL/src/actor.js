// アクター（プレイヤー・ボット・モンスター共通）: 移動物理、装備、被ダメージ、死亡とゴア
import * as THREE from 'three';
import { G } from './state.js';
import { buildBody, animateBody, computeHitboxes, Ragdoll, KINDS } from './humanoid.js';
import { WEAPONS, buildGun } from './weapons.js';
import { clamp, rand, pick, dampAngle, angleDiff } from './util.js';

export const MONSTER_STATS = {
  ghoul: { hp: 90, speed: 6.6, dmg: 14, range: 1.9, cd: 0.9, windup: 0.3, name: 'グール', score: 100 },
  crawler: { hp: 55, speed: 7.8, dmg: 10, range: 1.7, cd: 0.7, windup: 0.2, leap: true, name: 'クローラー', score: 120 },
  brute: { hp: 480, speed: 4.2, dmg: 34, range: 2.8, cd: 1.6, windup: 0.55, slam: true, name: 'ブルート', score: 400 },
  boss: { hp: 3200, speed: 4.6, dmg: 45, range: 4.2, cd: 1.8, windup: 0.7, slam: true, boss: true, name: 'アボミネーション', score: 2500 },
};

let ACTOR_ID = 0;
const _v = new THREE.Vector3();
export class Actor {
  constructor(o) {
    this.id = ++ACTOR_ID;
    this.kind = o.kind || 'soldier';
    this.isMonster = this.kind !== 'soldier';
    this.isPlayer = !!o.isPlayer;
    this.name = o.name || 'Unknown';
    this.team = o.team ?? this.id;
    this.body = buildBody(this.kind, o.look || { seed: this.id });
    G.scene.add(this.body.root);
    this.K = KINDS[this.kind];
    this.scale = this.K.s;
    this.pos = new THREE.Vector3(); this.vel = new THREE.Vector3();
    this.yaw = 0; this.pitch = 0; this.bodyYaw = 0;
    this.radius = this.isMonster ? 0.35 * Math.max(1, this.scale * 0.85) : 0.35;
    this.height = 1.8 * this.scale;
    this.onGround = false; this.crouch = 0; this.crouching = false; this.sprinting = false;
    this.stepH = this.isMonster ? 0.9 : 0.55;
    if (this.isMonster) { this.stats = MONSTER_STATS[this.kind]; this.maxHealth = this.stats.hp; }
    else this.maxHealth = 100;
    this.health = this.maxHealth;
    this.armor = 0; this.armorMax = 0;
    this.alive = true;
    this.weapons = [null, null]; this.cur = 0;
    this.bandages = 0; this.medkits = 0; this.grenades = 0;
    this.kills = 0; this.damageDealt = 0;
    this.fireCd = 0; this.reloading = 0; this.recoil = 0; this.healing = 0;
    this.anim = { speed: 0, moveAng: 0, crouch: 0, air: false, pitch: 0, t: 0, recoil: 0, reload: false, attack: 0, stagger: 0, sprint: false, hasGun: false };
    this.hbFrame = -1; this.hb = [];
    this.stepAcc = 0; this.lastDamage = 0; this.lastAttacker = null;
    this.ragdoll = null; this.deathTime = 0;
    this.dropState = null;
    this.gunModel = null;
    this.visibleModel = true;
    this.rollT = -1; this.rollDur = 0.75; this.swimming = false;
    this.fallV = 0; this.bank = 0; this.diving = false; this.chuteTilt = 0;
    this.inWater = false;
  }
  get weapon() { return this.weapons[this.cur]; }
  setPos(x, y, z) { this.pos.set(x, y, z); this.vel.set(0, 0, 0); this.body.root.position.copy(this.pos); }
  giveWeapon(id, slot = null, mag = null, reserve = null) {
    const def = WEAPONS[id];
    const w = { def, mag: mag ?? def.mag, reserve: reserve ?? def.reserve };
    let s = slot;
    if (s === null) s = this.weapons[0] ? (this.weapons[1] ? this.cur : 1) : 0;
    const old = this.weapons[s];
    this.weapons[s] = w;
    this.cur = s;
    this.refreshGunModel();
    return old;
  }
  switchTo(s) {
    if (!this.weapons[s] || s === this.cur) return false;
    this.cur = s; this.reloading = 0; this.fireCd = 0.35;
    this.refreshGunModel();
    return true;
  }
  refreshGunModel() {
    if (this.gunModel) { this.body.gunMount.remove(this.gunModel); this.gunModel = null; }
    const w = this.weapon;
    if (w) { this.gunModel = buildGun(w.def, false); this.body.gunMount.add(this.gunModel); }
  }
  eyePos(out = new THREE.Vector3()) {
    const h = this.isMonster ? 1.55 * this.scale : 1.62 - this.crouch * 0.55;
    return out.set(this.pos.x, this.pos.y + h, this.pos.z);
  }
  center(out = new THREE.Vector3()) { return out.set(this.pos.x, this.pos.y + (this.isMonster && this.kind === 'crawler' ? 0.5 : 0.95 * this.scale - this.crouch * 0.3), this.pos.z); }
  forward(out = new THREE.Vector3()) { return out.set(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch)); }
  muzzlePos(out = new THREE.Vector3()) {
    if (this.gunModel && this.gunModel.userData.muzzle) { this.gunModel.userData.muzzle.getWorldPosition(out); return out; }
    return this.eyePos(out);
  }
  hitboxes() {
    if (this.hbFrame !== G.frame) { this.body.root.updateMatrixWorld(true); computeHitboxes(this.body, this.hb); this.hbFrame = G.frame; }
    return this.hb;
  }

  // ---- 移動物理 ----
  physics(dt, wx, wz, maxSpeed, jump) {
    const W = G.world;
    const accel = this.onGround ? 14 : 2.5;
    const tx = wx * maxSpeed, tz = wz * maxSpeed;
    const k = 1 - Math.exp(-accel * dt);
    this.vel.x += (tx - this.vel.x) * k; this.vel.z += (tz - this.vel.z) * k;
    if (jump && this.onGround) { this.vel.y = this.isMonster ? 7 : 5.6 * (this.isPlayer && G.admin && G.admin.on ? G.admin.jump : 1); this.onGround = false; if (this.isPlayer) G.audio.play('jump'); }
    this.vel.y -= (this.isMonster ? 22 : 18) * dt;
    if (this.vel.y < -55) this.vel.y = -55;
    const px = this.pos.x, pz = this.pos.z;
    this.pos.x += this.vel.x * dt; this.pos.z += this.vel.z * dt;
    this.pos.y += this.vel.y * dt;
    const h = this.height - this.crouch * 0.6;
    W.collide(this.pos, this.radius, h, this.stepH);
    // 実際の速度を反映（壁で止まる）
    if (dt > 0) { this.vel.x = (this.pos.x - px) / dt * 0.5 + this.vel.x * 0.5; this.vel.z = (this.pos.z - pz) / dt * 0.5 + this.vel.z * 0.5; }
    const g = W.groundAt(this.pos.x, this.pos.z, this.pos.y + (this.onGround ? 0 : Math.max(0, -this.vel.y * dt)), this.radius, this.stepH);
    const wasGround = this.onGround;
    if (this.pos.y <= g + 0.001) {
      if (!wasGround) this.onLand(-this.vel.y);
      this.pos.y = g; if (this.vel.y < 0) this.vel.y = 0; this.onGround = true;
    } else if (wasGround && this.pos.y - g < 0.45 && this.vel.y <= 0) { this.pos.y = g; this.vel.y = 0; this.onGround = true; }
    else this.onGround = false;
    const ceil = W.ceilingAt(this.pos.x, this.pos.z, this.pos.y + 0.5, this.radius * 0.8);
    if (this.pos.y + h > ceil) { this.pos.y = Math.min(this.pos.y, ceil - h); if (this.vel.y > 0) this.vel.y = 0; }
    this.inWater = W.waterLevel > -900 && this.pos.y < W.waterLevel - 0.4;
    // 泳ぎ：深い水では水面に浮く
    const floatY = W.waterLevel - 1.35 * this.scale;
    this.swimming = false;
    if (W.waterLevel > -900 && W.height(this.pos.x, this.pos.z) < floatY - 0.05 && this.pos.y <= floatY + 0.05) {
      this.pos.y += (floatY - this.pos.y) * Math.min(1, dt * 8);
      if (this.pos.y > floatY - 0.02) this.pos.y = Math.max(this.pos.y, floatY);
      if (this.vel.y < 0) this.vel.y = 0;
      this.onGround = true; this.swimming = true; this.inWater = true;
    }
    if (this.rollT >= 0) { this.rollT += dt; if (this.rollT > this.rollDur) this.rollT = -1; }
  }
  onLand(v) {
    if (v > 4 && !this.isMonster) {
      const surf = G.world.surfaceAt(this.pos.x, this.pos.z, this.pos.y);
      G.audio.play('land', this.isPlayer ? null : this.pos, { surf });
      if (this.isPlayer) { G.engine.addShake(Math.min(0.4, v * 0.02)); G.player && G.player.onLand(v); }
    }
    const thr = !this.isMonster && v > 9.5 ? 23 : 15; // 前転で落下ダメージ軽減
    if (v > thr && !this.dropStateLanding) this.takeDamage({ amount: (v - thr) * 7, part: 'leg', dir: new THREE.Vector3(0, -1, 0), fall: true });
  }
  footsteps(dt, speed) {
    if (!this.onGround || speed < 1) return;
    this.stepAcc += dt * speed * (this.isMonster ? 0.45 / this.scale : 0.55);
    if (this.stepAcc > 1.4) {
      this.stepAcc = 0;
      if (this.isMonster) { G.audio.play('monsterStep', this.pos, { vol: 0.4 * this.scale }); if (this.scale > 1.4) G.engine && this.distToPlayer() < 25 && G.engine.addShake(0.08 * this.scale / Math.max(1, this.distToPlayer() / 5)); }
      else {
        const surf = G.world.surfaceAt(this.pos.x, this.pos.z, this.pos.y);
        G.audio.play('step', this.isPlayer ? null : this.pos, { surf, vol: this.isPlayer ? (this.crouching ? 0.15 : 0.35) : this.crouching ? 0.3 : 0.7, maxDist: 60 });
      }
    }
  }
  distToPlayer() { return G.player ? this.pos.distanceTo(G.player.actor.pos) : 999; }

  updateVisual(dt) {
    const b = this.body;
    b.root.position.copy(this.pos);
    if (!this.isPlayer && G.camera) {
      const cd = G.cullDist || 250;
      const dx = this.pos.x - G.camera.position.x, dz = this.pos.z - G.camera.position.z;
      const far = dx * dx + dz * dz > cd * cd;
      b.root.visible = !far && this.dropState !== 'plane';
      if (far) { this.bodyYaw = this.yaw; return; }
      const near = dx * dx + dz * dz < 55 * 55;
      if (near !== this._shadowNear) { this._shadowNear = near; b.root.traverse((o) => { if (o.isMesh) o.castShadow = near; }); }
    }
    // 下半身の向きは視線方向に追従
    this.bodyYaw = dampAngle(this.bodyYaw, this.yaw, 14, dt);
    b.root.rotation.order = 'YXZ';
    b.root.rotation.y = this.bodyYaw;
    const ff = this.dropState === 'freefall', ch = this.dropState === 'chute';
    const tt = this.anim.t;
    this.bankS = (this.bankS || 0) + ((this.bank || 0) - (this.bankS || 0)) * Math.min(1, dt * 3);
    this.diveS = (this.diveS || 0) + ((ff && this.diving ? 1 : 0) - (this.diveS || 0)) * Math.min(1, dt * 2.5);
    const tp = ff ? -1.3 - this.diveS * 0.35 + Math.sin(tt * 2.3) * 0.04 : ch ? Math.sin(tt * 0.9) * 0.07 + this.chuteTilt * 0.12 : 0;
    const tz = ff ? -this.bankS * 0.55 + Math.sin(tt * 3.1) * 0.03 : ch ? Math.sin(tt * 1.3) * 0.09 - this.bankS * 0.25 : 0;
    b.root.rotation.x += (tp - b.root.rotation.x) * Math.min(1, dt * 4);
    if (this.anim.emerge !== undefined && this.anim.emerge < 1) { const e = this.anim.emerge; b.root.position.y -= (1 - e * e * (3 - 2 * e)) * 1.9 * this.scale; }
    if (this.swimming) { b.root.rotation.x = -1.15; b.root.position.y += 0.75 * this.scale; }
    if (this.rollT >= 0) {
      const k = Math.min(1, this.rollT / this.rollDur), e = k * k * (3 - 2 * k);
      const ang = -Math.PI * 2 * e; b.root.rotation.x = ang;
      // 体の中心(高さ0.5)を軸に回転
      b.root.position.y += 0.5 - 0.5 * Math.cos(ang) + Math.sin(Math.PI * k) * 0.1;
      b.root.position.x += 0; b.root.position.z += 0;
    }
    b.root.rotation.z += (tz - b.root.rotation.z) * Math.min(1, dt * 4);
    if (ff) b.root.position.y += 0.9;
    if (this.chute) { const c = this.chute; c.rotation.z = Math.sin(tt * 1.3 + 0.6) * 0.07 - this.bankS * 0.35; c.rotation.x = Math.sin(tt * 0.9 + 0.4) * 0.05 + this.chuteTilt * 0.2; const k = Math.min(1, (this.chuteT || 0) / 0.9); const e = 1 - Math.pow(1 - k, 3); c.scale.set(0.2 + 0.8 * e + Math.sin(tt * 2.2) * 0.015, 0.3 + 0.7 * e, 0.2 + 0.8 * e + Math.cos(tt * 2.0) * 0.015); this.chuteT = (this.chuteT || 0) + dt; }
    const hs = this.dropState ? 0 : Math.hypot(this.vel.x, this.vel.z);
    const mAng = hs > 0.3 ? angleDiff(this.bodyYaw, Math.atan2(-this.vel.x, -this.vel.z)) : 0;
    const A = this.anim;
    A.speed = hs; A.moveAng = mAng; A.crouch = this.crouch; A.air = !this.onGround && this.vel.y > -20 && !this.dropState; A.pitch = this.pitch; A.t += dt;
    A.recoil = this.recoil; A.reload = this.reloading > 0 || this.healing > 0; A.sprint = this.sprinting; A.hasGun = !!this.weapon;
    A.swim = this.swimming; A.roll = this.rollT >= 0;
    A.falling = ff; A.chute = ch; A.dive = this.diveS; A.pull = Math.max(0, this.bankS); A.pullL = Math.max(0, -this.bankS);
    if (this.gunModel) { A.gunGrip = this.gunModel.userData.grip; A.gunGuard = this.gunModel.userData.guard; }
    animateBody(b, A, dt);
    this.recoil = Math.max(0, this.recoil - dt * 6);
  }

  // ---- ダメージ ----
  takeDamage(info) {
    if (!this.alive) return 0;
    if (this.invuln) return 0;
    if (this.isPlayer && G.admin && G.admin.on && G.admin.god) return 0;
    let dmg = info.amount;
    if (!this.isMonster && this.armor > 0 && info.part !== 'head' && !info.fall && !info.zone) {
      const absorb = Math.min(this.armor, dmg * 0.45);
      this.armor -= absorb; dmg -= absorb;
      if (info.attacker && info.attacker.isPlayer) G.audio.play('armorHit', this.pos);
    }
    this.health -= dmg;
    this.lastDamage = G.time;
    if (info.attacker && info.attacker !== this) { this.lastAttacker = info.attacker; info.attacker.damageDealt += dmg; }
    this.onDamaged && this.onDamaged(info, dmg);
    if (this.health <= 0) { this.health = 0; this.die(info); }
    return dmg;
  }
  die(info) {
    if (!this.alive) return;
    this.alive = false;
    this.deathTime = G.time;
    this.healing = 0; this.reloading = 0;
    const dir = info.dir ? info.dir.clone() : new THREE.Vector3(0, 0, 0);
    const force = info.explosive ? 14 : info.melee ? 5 : clamp(info.amount * 0.09, 1.5, 9);
    const imp = dir.clone().multiplyScalar(force);
    if (info.explosive) imp.y += 6;
    // 銃は落とす
    if (this.gunModel) { this.body.gunMount.remove(this.gunModel); this.gunModel = null; }
    this.body.root.updateMatrixWorld(true);
    const rd = this.ragdoll = new Ragdoll(this.body, this.vel.clone(), imp, info.point);
    G.scene.remove(this.body.root);
    G.corpses.push(this);
    if (G.corpses.length > 22) { const old = G.corpses.shift(); old.disposeCorpse(); }
    const gore = G.settings.gore;
    const mon = this.isMonster;
    G.audio.play(mon ? 'mdeath' : 'death', this.pos, { big: this.kind === 'boss' ? 2 : this.kind === 'brute' ? 1 : 0 });
    // ゴア
    if (gore >= 1) {
      const heavy = info.weapon && ['sniper', 'shotgun', 'dmr'].includes(info.weapon.type);
      if (info.part === 'head' && gore === 2 && (heavy || info.amount >= 60 || Math.random() < 0.3)) this.dismember('head', dir, true);
      if (info.explosive) {
        const limbs = ['armL', 'armR', 'legL', 'legR', 'head'];
        const n = gore === 2 ? 1 + Math.floor(Math.random() * 3) : Math.random() < 0.5 ? 1 : 0;
        for (let i = 0; i < n; i++) this.dismember(pick(limbs), imp.clone().normalize(), false);
        G.vfx.gibBurst(this.center(), new THREE.Vector3(0, 1, 0), gore === 2 ? 14 : 5, mon);
      }
      if (gore === 2 && info.weapon && info.weapon.type === 'shotgun' && info.dist < 6 && Math.random() < 0.55) {
        const map = { arm: pick(['armL', 'armR']), leg: pick(['legL', 'legR']) };
        this.dismember(map[info.part] || pick(['armL', 'armR', 'legL', 'legR']), dir, false);
      }
      // 死体の下に血だまり
      const c = this.center();
      setTimeout(() => { if (this.ragdoll) { const p = this.ragdoll.point('pelvis'); const gy = G.world.groundAt(p.x, p.z, p.y + 0.3, 0.1, 0.5); G.vfx.bloodDecal(new THREE.Vector3(p.x, gy, p.z), new THREE.Vector3(0, 1, 0), rand(1.2, 2.0) * this.scale); } }, 1500);
    }
    G.mode && G.mode.onDeath(this, info);
    if (this.isPlayer && G.player && G.player.actor === this) G.player.onDeath(info);
  }
  dismember(limb, dir, explode) {
    const rd = this.ragdoll; if (!rd) return;
    const objs = rd.detach(limb);
    if (!objs) return;
    const attachName = { head: 'neck', armL: 'shL', armR: 'shR', legL: 'hipL', legR: 'hipR' }[limb];
    const pt = rd.point(limb === 'head' ? 'head' : { armL: 'elL', armR: 'elR', legL: 'knL', legR: 'knR' }[limb]).clone();
    if (explode) {
      for (const o of objs) G.scene.remove(o);
      G.vfx.headExplode(pt, dir, this.isMonster);
      G.audio.play('splat', pt, { vol: 1.3 });
    } else {
      const v = dir.clone().multiplyScalar(rand(4, 8)).add(new THREE.Vector3(rand(-2, 2), rand(3, 6), rand(-2, 2)));
      G.vfx.addRigid(objs, pt, v, this.isMonster);
      G.vfx.blood(pt, dir, 50, { monster: this.isMonster });
      G.audio.play('splat', pt);
    }
    // 切断面から噴出
    const anchor = rd.point(attachName);
    const other = rd.point(limb === 'head' ? 'pelvis' : 'pelvis');
    G.vfx.addEmitter(() => anchor, () => _v.subVectors(anchor, other).normalize(), limb === 'head' ? 4 : 2.5, limb === 'head' ? 60 : 35, this.isMonster);
  }
  disposeCorpse() {
    if (this.ragdoll) { this.ragdoll.dispose(); this.ragdoll = null; }
    this.disposed = true;
  }
  dispose() {
    if (this.ragdoll) this.ragdoll.dispose();
    G.scene.remove(this.body.root);
    this.disposed = true;
  }
}
