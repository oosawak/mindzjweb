// プレイヤー操作・カメラ（一人称/三人称）・武器操作
import * as THREE from 'three';
import { G } from './state.js';
import { ViewModel, WEAPONS } from './weapons.js';
import { fire, traceShot, Grenade } from './combat.js';
import { clamp, lerp, damp, rand, angleDiff } from './util.js';
import { on as adminOn, mul as adminMul, annihilating } from './admin.js';

const _f = new THREE.Vector3(), _r = new THREE.Vector3(), _u = new THREE.Vector3(), _p = new THREE.Vector3(), _q = new THREE.Vector3();

export class Player {
  constructor(actor) {
    this.actor = actor;
    actor.isPlayer = true;
    this.vm = new ViewModel(G.engine);
    this.view = G.settings.view;
    this.ads = 0; this.adsHeld = false;
    this.bloom = 0; this.recoilP = 0; this.recoilY = 0; this.recoilRecover = 0;
    this.shake = new THREE.Vector2();
    this.camBob = 0; this.landDip = 0;
    this.shellLoop = false; this.healType = null;
    this.grenadeCd = 0; this.lastSlot = 1;
    this.suppression = 0; this.damageFlash = 0;
    this.heartT = 0; this.deadT = 0;
    this.tpDist = 2.6;
    // フラッシュライト：遠くまで届く主光＋広い補助光＋光の筋（ボリューム風）
    this.flash = new THREE.SpotLight(0xfff4e6, 0, 120, 0.6, 0.5, 0.95);
    this.flash.position.set(0.25, -0.2, 0); this.flash.target.position.set(0.1, -0.3, -10);
    this.flashFill = new THREE.SpotLight(0xffe8d0, 0, 38, 1.15, 0.9, 1.3);
    this.flashFill.position.set(0.25, -0.15, 0); this.flashFill.target.position.set(0.05, -0.6, -10);
    G.camera.add(this.flash, this.flash.target, this.flashFill, this.flashFill.target);
    const bg = new THREE.ConeGeometry(9, 42, 32, 1, true); bg.translate(0, -21, 0); bg.rotateX(-Math.PI / 2);
    this.beam = new THREE.Mesh(bg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
      uniforms: { uI: { value: 0 } },
      vertexShader: `varying float vZ; varying vec3 vN; varying vec3 vV; void main(){ vZ=-position.z/42.0; vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform float uI; varying float vZ; varying vec3 vN; varying vec3 vV; void main(){ float e=pow(1.0-abs(dot(vN,vV)),2.0); float a=uI*(1.0-vZ)*(1.0-vZ)*smoothstep(0.0,0.08,vZ)*(1.0-e*0.7); gl_FragColor=vec4(vec3(1.0,0.93,0.82)*a,1.0); }`,
    }));
    this.beam.position.set(0.25, -0.22, -0.3); this.beam.rotation.x = -0.02; this.beam.frustumCulled = false; this.beam.visible = false;
    G.camera.add(this.beam);
    this.flashOn = false; G.engine.vmLamp.intensity = 0;
    this.freeLookYaw = 0;
    this.onWeaponChanged();
  }
  dispose() {
    G.camera.remove(this.flash, this.flash.target, this.flashFill, this.flashFill.target, this.beam);
    this.vm.root.parent && this.vm.root.parent.remove(this.vm.root);
  }
  onWeaponChanged() {
    const w = this.actor.weapon;
    this.vm.setWeapon(w ? w.def : null);
    this.shellLoop = false; this.actor.reloading = 0;
  }
  setFlashlight(on) {
    this.flashOn = on; this.flash.intensity = on ? 95 : 0; this.flashFill.intensity = on ? 14 : 0; G.engine.vmLamp.intensity = on ? 1.4 : 0;
    this.beam.visible = on; this.beam.material.uniforms.uI.value = G.map && G.map.pve ? 0.05 : 0.025;
  }
  onKill(victim, info) {
    const now = G.time;
    this.streak = now - (this.lastKillT ?? -99) < 4.5 ? (this.streak || 1) + 1 : 1;
    this.lastKillT = now;
    const head = info.part === 'head' && !info.explosive;
    G.audio.play('kill', null, { delay: 0.04, streak: this.streak, head });
    if (this.streak >= 2) G.audio.play('multikill', null, { streak: this.streak });
    G.hud.killConfirm(this.streak, head, victim.isMonster);
    G.hitstop = Math.max(G.hitstop || 0, head ? 0.11 : 0.07);
    G.engine.final.uniforms.uKill.value = head ? 1 : 0.75;
    G.engine.addShake(0.12);
  }
  // エイムアシスト（オートエイム）
  aimAssist(dt, I) {
    const A = this.actor, S = G.settings, lvl = S.aimAssist | 0, w = A.weapon;
    this.assistFric = 1;
    if (!lvl || !w || A.dropState || A.sprinting || A.healing > 0) { this.assistTarget = null; return; }
    const cone = [0, 0.1, 0.17, 0.42][lvl] * (this.ads > 0.5 ? 1.25 : 1);
    const origin = this.view === 'tp' && !this.scoped ? G.camera.position.clone() : A.eyePos(new THREE.Vector3());
    const fwd = A.forward(new THREE.Vector3());
    const range = Math.min(w.def.range * 0.9, 160);
    let best = null, bestA = cone, bestP = null;
    const tp = new THREE.Vector3();
    for (const o of G.actors) {
      if (!o.alive || o === A || o.team === A.team || o.dropState) continue;
      o.center(tp); tp.y += (o.isMonster ? 0.35 : 0.3) * o.scale * (1 - o.crouch * 0.3);
      const d = tp.distanceTo(origin);
      if (d > range || d < 0.5) continue;
      const dir = tp.clone().sub(origin).divideScalar(d);
      const ang = Math.acos(clamp(dir.dot(fwd), -1, 1));
      // 近い敵ほど許容角を広げる
      const allow = cone * (1 + clamp(8 / d, 0, 1.5));
      if (ang > allow || ang / allow > bestA / cone) continue;
      if (this.assistCheckT > 0 && this.assistTarget !== o) continue;
      if (!G.world.lineOfSight(origin, tp)) continue;
      best = o; bestA = (ang / allow) * cone; bestP = tp.clone();
    }
    this.assistTarget = best;
    if (!best) return;
    const dx = bestP.x - origin.x, dy = bestP.y - origin.y, dz = bestP.z - origin.z;
    const yawT = Math.atan2(-dx, -dz), pitchT = Math.atan2(dy, Math.hypot(dx, dz));
    const firing = I.mouse.left, moving = Math.abs(I.mouse.dx) + Math.abs(I.mouse.dy) > 0 || Math.hypot(A.vel.x, A.vel.z) > 0.5;
    if (I.mouse.rightPressed && lvl >= 2) this.snapT = 0.16;
    this.snapT = Math.max(0, (this.snapT || 0) - dt);
    let rate = [0, 2.2, 4.5, 12][lvl] * (this.ads > 0.5 ? 1 : 0.6) * (firing || moving || lvl === 3 ? 1 : 0.4);
    if (this.snapT > 0) rate = 22;
    if (lvl === 3 && (this.adsHeld || firing)) rate = Math.max(rate, 18);
    const k = Math.min(1, rate * dt);
    A.yaw += angleDiff(A.yaw, yawT) * k;
    A.pitch += (pitchT - A.pitch) * k;
    this.assistFric = [1, 0.8, 0.6, 0.45][lvl];
  }
  suppress(v) { this.suppression = Math.min(1, this.suppression + v); }
  onLand(v) {
    this.landDip = Math.min(0.25, v * 0.012); this.vm.land = Math.min(1, v * 0.06);
    const A = this.actor;
    // 高所からの着地で前転（受け身）
    if (v > 9.5 && !A.swimming && !A.dropState) {
      const hv = Math.hypot(A.vel.x, A.vel.z);
      this.rollDir = hv > 1 ? new THREE.Vector3(A.vel.x / hv, 0, A.vel.z / hv) : new THREE.Vector3(-Math.sin(A.yaw), 0, -Math.cos(A.yaw));
      A.rollT = 0; A.rollDur = 0.75;
      G.audio.play('land'); G.audio.play('jump', null, { delay: 0.25 });
    }
  }
  tryVault(wantIt) {
    const A = this.actor, W = G.world;
    if (!wantIt) return false;
    const f = new THREE.Vector3(-Math.sin(A.yaw), 0, -Math.cos(A.yaw));
    const hv = Math.hypot(A.vel.x, A.vel.z);
    const feet = A.pos.y;
    const o = new THREE.Vector3(A.pos.x, feet + 0.35, A.pos.z);
    const low = W.raycast(o, f, 1.35);
    if (!low || Math.abs(low.ny) > 0.5) return false;
    const dL = low.t;
    let top = null;
    for (let h = 0.45; h <= 1.75; h += 0.1) {
      o.y = feet + h;
      const r = W.raycast(o, f, dL + 0.5);
      if (!r) { top = h; break; }
    }
    if (top === null || top < 0.5) return false;
    // 上に体を通す空間があるか（窓の開口）
    o.y = feet + top + 0.8;
    const up = W.raycast(o, f, dL + 1.3);
    if (up && up.t < dL + 1.1) return false;
    // 向こう側の着地点
    const dx = A.pos.x + f.x * (dL + 1.15), dz = A.pos.z + f.z * (dL + 1.15);
    const gy = W.groundAt(dx, dz, feet + top + 0.4, 0.3, 0.6);
    if (gy < feet - 4.5) return false;
    const probe = new THREE.Vector3(dx, gy, dz); W.collide(probe, 0.3, 1.1, 0.4);
    if (Math.hypot(probe.x - dx, probe.z - dz) > 0.2) return false;
    const edge = new THREE.Vector3(A.pos.x + f.x * (dL + 0.15), feet + top + 0.2, A.pos.z + f.z * (dL + 0.15));
    this.vault = { t: 0, dur: top > 1.1 ? 0.62 : 0.48, p0: A.pos.clone(), p1: edge, p2: probe.clone(), f };
    A.vel.set(0, 0, 0);
    G.audio.play('jump'); G.audio.play('step', null, { surf: 'wood', vol: 0.6, delay: 0.15 });
    return true;
  }
  updateVault(dt) {
    const A = this.actor, V = this.vault;
    V.t += dt;
    const k = Math.min(1, V.t / V.dur), e = k * k * (3 - 2 * k);
    // 2次ベジェで弧を描いて乗り越える
    const a = new THREE.Vector3().lerpVectors(V.p0, V.p1, e), b = new THREE.Vector3().lerpVectors(V.p1, V.p2, e);
    A.pos.lerpVectors(a, b, e);
    this.vm.land = Math.sin(k * Math.PI) * 0.5;
    if (k >= 1) { this.vault = null; A.vel.set(V.f.x * 3, 0, V.f.z * 3); A.onGround = true; }
  }
  onHit(dir, dmg, attacker, melee = false) {
    this.damageFlash = Math.min(1, this.damageFlash + dmg / 40);
    G.hud.damageIndicator(dir, attacker);
    G.hud.screenBlood(dmg, melee);
    G.audio.play('hurt');
    G.engine.addShake(clamp(dmg / 60, 0.08, 0.6));
    this.recoilP += (Math.random() - 0.3) * dmg * 0.002; this.recoilY += (Math.random() - 0.5) * dmg * 0.002;
    if (this.actor.healing > 0) { this.actor.healing = 0; this.vm.healT = -1; G.hud.progress(null); }
  }
  get scoped() { const w = this.actor.weapon; return w && w.def.scope && this.ads > 0.9 && !this.actor.reloading; }

  update(dt, I) {
    const A = this.actor, S = G.settings;
    if (!A.alive) { this.updateDeathCam(dt); return; }
    // 視点切替
    if (I.hit('KeyV')) { this.view = this.view === 'fp' ? 'tp' : 'fp'; G.hud.toast(this.view === 'fp' ? '一人称視点' : '三人称視点'); }
    if (I.hit('KeyF')) { this.setFlashlight(!this.flashOn); G.audio.play('flashlight'); }
    // マウス
    const w = A.weapon;
    const zoom = w ? lerp(1, w.def.zoom, this.ads) : 1;
    const sens = 0.0021 * S.sens * (this.ads > 0.5 ? S.adsSens / Math.sqrt(zoom) : 1) * (this.assistFric ?? 1);
    if (A.dropState === 'plane') { this.freeLookYaw -= I.mouse.dx * sens; A.pitch = clamp(A.pitch - I.mouse.dy * sens * (S.invertY ? -1 : 1), -1.2, 0.6); A.yaw = this.freeLookYaw; }
    else {
      A.yaw -= I.mouse.dx * sens;
      A.pitch = clamp(A.pitch - I.mouse.dy * sens * (S.invertY ? -1 : 1), -1.45, 1.45);
    }
    if (!A.dropState && !annihilating()) this.aimAssist(dt, I);
    // 反動の回復
    const rec = Math.min(1, dt * 7);
    const rp = this.recoilRecover * rec; this.recoilRecover -= rp; A.pitch -= rp;
    this.recoilP = damp(this.recoilP, 0, 20, dt); this.recoilY = damp(this.recoilY, 0, 20, dt);
    // ドロップ中
    if (A.dropState) { this.updateDrop(dt, I); this.updateCamera(dt, I); return; }
    // 移動
    let mx = 0, mz = 0;
    if (I.down('KeyW')) mz -= 1; if (I.down('KeyS')) mz += 1; if (I.down('KeyA')) mx -= 1; if (I.down('KeyD')) mx += 1;
    const ml = Math.hypot(mx, mz); if (ml > 0) { mx /= ml; mz /= ml; }
    if (I.hit('KeyC')) A.crouching = !A.crouching;
    const crouchHeld = I.down('ControlLeft') || I.down('ControlRight');
    let wantCrouch = A.crouching || crouchHeld;
    if (A.swimming) { A.crouching = false; wantCrouch = false; }
    A.sprinting = I.down('ShiftLeft') && mz < 0 && !wantCrouch && A.healing <= 0 && this.ads < 0.5 && !A.swimming;
    if (A.sprinting && A.crouching) A.crouching = false;
    A.crouch = damp(A.crouch, wantCrouch || this.vault || A.rollT >= 0 ? 1 : 0, 12, dt);
    const sy = Math.sin(A.yaw), cy = Math.cos(A.yaw);
    const wx = mx * cy + mz * sy, wz = -mx * sy + mz * cy;
    // 窓・低い壁の乗り越え（ジャンプで入る）
    if (this.vault) { this.updateVault(dt); A.updateVisual(dt); this.updateWeapon(dt, I); this.updateCamera(dt, I); return; }
    if (!A.swimming && ((I.hit('Space') && A.onGround) || (!A.onGround && mz < 0 && A.vel.y > -7)) && this.tryVault(mz < 0 || I.hit('Space'))) { A.updateVisual(dt); this.updateCamera(dt, I); return; }
    let speed = A.sprinting ? 7.3 : 4.8;
    if (A.crouch > 0.5) speed = 2.5;
    if (this.ads > 0.5) speed = Math.min(speed, 3.2);
    if (A.healing > 0) speed = Math.min(speed, 2.2);
    if (A.inWater) speed *= 0.55;
    if (A.swimming) speed = I.down('ShiftLeft') ? 3.4 : 2.6;
    speed *= adminMul('speed');
    // 受け身の前転中は前方へ勢いを保つ
    if (A.rollT >= 0) { const f = this.rollDir; A.physics(dt, f.x, f.z, 5.2, false); }
    else A.physics(dt, wx, wz, speed, I.hit('Space') && !wantCrouch && !A.swimming);
    if (A.swimming && Math.hypot(A.vel.x, A.vel.z) > 0.8 && Math.random() < dt * 6) { G.vfx.impact(new THREE.Vector3(A.pos.x, G.world.waterLevel, A.pos.z), new THREE.Vector3(0, 1, 0), 'water'); if (Math.random() < 0.3) G.audio.play('step', null, { surf: 'water', vol: 0.5 }); }
    if (I.hit('Space') && A.crouching) A.crouching = false;
    const hs = Math.hypot(A.vel.x, A.vel.z);
    A.footsteps(dt, hs);
    // 武器
    this.updateWeapon(dt, I);
    // アイテム
    if (I.hit('KeyE')) G.loot && G.loot.tryPickup(A);
    if (I.hit('KeyH') || I.hit('Digit4')) this.startHeal();
    if (I.hit('KeyG') || I.hit('Digit5')) this.throwGrenade();
    this.updateHeal(dt);
    this.grenadeCd -= dt;
    if (this.throwPending > 0) { this.throwPending -= dt; if (this.throwPending <= 0) this.releaseGrenade(); }
    A.updateVisual(dt);
    this.updateCamera(dt, I);
  }
  updateWeapon(dt, I) {
    const A = this.actor;
    let w = A.weapon;
    // 切替
    let sw = -1;
    if (I.hit('Digit1')) sw = 0; if (I.hit('Digit2')) sw = 1; if (I.hit('KeyQ')) sw = 1 - A.cur;
    if (I.mouse.wheel) sw = 1 - A.cur;
    if (sw >= 0 && A.weapons[sw] && sw !== A.cur && A.healing <= 0) { A.switchTo(sw); this.onWeaponChanged(); w = A.weapon; }
    if (!w) { this.ads = damp(this.ads, 0, 15, dt); this.vm.update(dt, this.vmState(dt, I)); return; }
    const d = w.def;
    this.adsHeld = I.mouse.right && !A.sprinting && A.healing <= 0;
    const adsSpeed = 1 / d.adsTime;
    this.ads = clamp(this.ads + (this.adsHeld ? adsSpeed : -adsSpeed * 1.3) * dt, 0, 1);
    A.fireCd -= dt;
    // リロード
    if (A.reloading > 0) {
      A.reloading -= dt;
      if (d.shellReload) {
        if (A.reloading <= 0) {
          const need = d.mag - w.mag;
          if (need > 0 && w.reserve > 0) { w.mag++; w.reserve--; G.audio.play('magIn'); }
          if (w.mag < d.mag && w.reserve > 0 && this.shellLoop) { A.reloading = d.reload; this.vm.startReload(d.reload); }
          else { A.reloading = 0; this.shellLoop = false; this.vm.actionT = 0; G.audio.play('pump', null, { delay: 0.05 }); }
        }
        if (I.mouse.leftPressed && w.mag > 0) { this.shellLoop = false; A.reloading = 0; this.vm.reloadT = -1; }
      } else if (A.reloading <= 0) {
        const need = d.mag - w.mag, take = Math.min(need, w.reserve);
        w.mag += take; w.reserve -= take; A.reloading = 0;
      } else if (A.reloading < d.reload * 0.45 && !this._magInPlayed) { this._magInPlayed = true; G.audio.play('magIn'); }
    }
    const canFire = A.reloading <= 0 && A.healing <= 0 && !A.sprinting && this.vm.equipT < 0.1 && this.vm.throwT < 0 && !this.vault && !(A.rollT >= 0) && !A.swimming;
    if ((I.hit('KeyR') || (w.mag === 0 && I.mouse.leftPressed)) && A.reloading <= 0 && w.mag < d.mag && (w.reserve > 0 || G.mode.infiniteAmmo)) this.startReload();
    const trig = d.auto ? I.mouse.left : I.mouse.leftPressed;
    if (A.sprinting && I.mouse.leftPressed) A.sprinting = false;
    if (trig && canFire && A.fireCd <= 0 && (this.vm.actionT < 0)) {
      if (w.mag > 0) this.shoot();
      else if (I.mouse.leftPressed) { G.audio.play('dry'); A.fireCd = 0.2; }
    }
    this.bloom = Math.max(0, this.bloom - dt * (d.auto ? 0.12 : 0.2));
    this.vm.update(dt, this.vmState(dt, I));
  }
  vmState(dt, I) {
    const A = this.actor;
    const hs = Math.hypot(A.vel.x, A.vel.z);
    return { ads: this.ads, moving: hs > 0.5, sprint: A.sprinting || A.swimming || !!this.vault || A.rollT >= 0, mouseDX: I.mouse.dx, mouseDY: I.mouse.dy, t: G.time, crouch: A.crouch > 0.5, air: !A.onGround, visible: this.view === 'fp' && A.alive && !A.dropState, scoped: this.scoped, bobScale: 0.6 + G.settings.headBob };
  }
  startReload() {
    const A = this.actor, w = A.weapon; if (!w) return;
    if (G.mode.infiniteAmmo) w.reserve = Math.max(w.reserve, w.def.mag * 2);
    if (w.reserve <= 0) return;
    A.reloading = w.def.reload; this._magInPlayed = false;
    this.shellLoop = !!w.def.shellReload;
    this.vm.startReload(w.def.reload);
    G.audio.play(w.def.shellReload ? 'magIn' : 'magOut');
    if (w.def.bolt) G.audio.play('bolt', null, { delay: w.def.reload - 0.5 });
  }
  currentSpread() {
    const A = this.actor, d = A.weapon.def;
    const hs = Math.hypot(A.vel.x, A.vel.z);
    let s = lerp(d.hip, d.ads, this.ads);
    s += clamp(hs / 5, 0, 1.3) * d.move * (1 - this.ads * 0.6);
    if (!A.onGround) s += 0.06;
    if (A.crouch > 0.5) s *= 0.75;
    s += this.bloom;
    return s;
  }
  aimRay(origin, dir) {
    const A = this.actor;
    A.forward(dir);
    if (this.view === 'tp' && !this.scoped) {
      // カメラ中心の照準点へ向けて目から撃つ
      const cam = G.camera.position;
      const res = traceShot(cam, dir, A.weapon ? A.weapon.def.range : 300, A);
      A.eyePos(origin);
      const tgt = res.point;
      // 近すぎる/背後の場合はそのまま
      const toT = _q.subVectors(tgt, origin);
      if (toT.dot(dir) > 0.5) dir.copy(toT.normalize());
    } else A.eyePos(origin);
  }
  shoot() {
    const A = this.actor, w = A.weapon, d = w.def;
    if (!adminOn('ammo')) w.mag--;
    A.fireCd = 60 / d.rpm / adminMul('rof');
    const origin = new THREE.Vector3(), dir = new THREE.Vector3();
    this.aimRay(origin, dir);
    const spread = adminOn('norecoil') ? 0 : this.currentSpread();
    // マズル位置（見た目用）
    const muzzle = new THREE.Vector3();
    if (this.view === 'fp') {
      _f.copy(dir); _r.set(Math.cos(A.yaw), 0, -Math.sin(A.yaw)); _u.crossVectors(_r, _f);
      muzzle.copy(origin).addScaledVector(_f, 0.7).addScaledVector(_r, 0.13 * (1 - this.ads)).addScaledVector(_u, -0.1 + this.ads * 0.05);
    } else A.muzzlePos(muzzle);
    fire(A, d, origin, dir, spread, { muzzle, tp: this.view === 'tp' });
    this.bloom = Math.min(0.06, this.bloom + (d.auto ? 0.0035 : 0.012));
    // 反動
    const rv = adminOn('norecoil') ? 0 : d.rv * (1 - this.ads * 0.35) * (A.crouch > 0.5 ? 0.8 : 1);
    A.pitch += rv; this.recoilRecover += rv * (d.auto ? 0.55 : 0.8);
    if (!adminOn('norecoil')) A.yaw += (Math.random() - 0.5) * d.rh * 2 + d.rh * 0.3;
    this.recoilP += rv * 0.6;
    A.recoil = 1;
    this.vm.fire();
    if (d.pump) G.audio.play('pump', null, { delay: 0.28 });
    if (d.bolt) G.audio.play('bolt', null, { delay: 0.25 });
    if (!d.pump && !d.bolt && Math.random() < 0.5) G.audio.play('shell', null, { delay: 0.3 + Math.random() * 0.2 });
    G.engine.addShake(d.type === 'sniper' || d.type === 'shotgun' ? 0.12 : 0.03);
    if (w.mag === 0 && G.mode.infiniteAmmo) w.reserve = Math.max(w.reserve, d.mag);
    G.hud.crosshairKick();
  }
  startHeal() {
    const A = this.actor;
    if (A.healing > 0 || A.health >= A.maxHealth) return;
    if (A.medkits > 0 && (A.health < 75 || A.bandages === 0)) { this.healType = 'medkit'; A.healing = 4.5; }
    else if (A.bandages > 0) { this.healType = 'bandage'; A.healing = 2.6; }
    else { G.hud.toast('回復アイテムがありません'); return; }
    A.reloading = 0; this.vm.healT = 0;
    this.healTotal = A.healing;
    G.audio.play('heal');
  }
  updateHeal(dt) {
    const A = this.actor;
    if (A.healing <= 0) return;
    A.healing -= dt;
    G.hud.progress(this.healType === 'medkit' ? '救急キット使用中' : '包帯使用中', 1 - A.healing / this.healTotal);
    if (A.healing <= 0) {
      if (this.healType === 'medkit') { A.medkits--; A.health = Math.min(A.maxHealth, A.health + 80); }
      else { A.bandages--; A.health = Math.min(A.maxHealth, A.health + 25); }
      this.vm.healT = -1; G.hud.progress(null); G.audio.play('healDone');
    }
  }
  throwGrenade() {
    const A = this.actor;
    if (A.grenades <= 0) { G.hud.toast('グレネードがありません'); return; }
    if (this.grenadeCd > 0) return;
    this.grenadeCd = 1.2; A.grenades--;
    G.audio.play('pin');
    this.vm.throwT = 0;
    this.throwPending = 0.25;
  }
  releaseGrenade() {
    const A = this.actor;
    if (!A.alive) return;
    const o = A.eyePos(new THREE.Vector3()); const d = A.forward(new THREE.Vector3());
    o.addScaledVector(d, 0.5);
    const v = d.clone().multiplyScalar(19).add(new THREE.Vector3(0, 3.5, 0)).add(new THREE.Vector3(A.vel.x, 0, A.vel.z));
    G.grenades.push(new Grenade(A, o, v));
    G.audio.play('throw');
  }
  updateDrop(dt, I) {
    const A = this.actor;
    const ds = G.mode.drop;
    if (A.dropState === 'plane') { if (I.hit('Space')) ds.jump(A); return; }
    let mx = 0, mz = 0;
    if (I.down('KeyW')) mz -= 1; if (I.down('KeyS')) mz += 1; if (I.down('KeyA')) mx -= 1; if (I.down('KeyD')) mx += 1;
    const sy = Math.sin(A.yaw), cy = Math.cos(A.yaw);
    const wx = mx * cy + mz * sy, wz = -mx * sy + mz * cy;
    ds.steer(A, dt, wx, wz, I.hit('Space'), I.down('KeyW'));
    A.updateVisual(dt);
  }

  // ---- カメラ ----
  updateCamera(dt, I) {
    const A = this.actor, cam = G.camera, S = G.settings;
    const w = A.weapon;
    const zoom = w && this.ads > 0 ? lerp(1, w.def.scope && this.ads > 0.9 ? w.def.zoom : Math.min(w.def.zoom, 1.5), this.ads) : 1;
    const baseFov = S.fov;
    const tf = A.dropState === 'freefall' ? baseFov + 10 + (A.diving ? 10 : 0) : A.sprinting ? baseFov + 8 : baseFov;
    // スカイダイブ中の風の粒子（上へ流れる）
    if (A.dropState === 'freefall') {
      const cp = cam.position, n = A.diving ? 6 : 3;
      for (let i = 0; i < n; i++) G.vfx.norm.spawn(cp.x + (Math.random() - 0.5) * 14, cp.y - 8 - Math.random() * 14, cp.z + (Math.random() - 0.5) * 14, 0, 0, 0, { color: [0.9, 0.92, 1], life: 0.45, size: 0.06, alpha: 0.35, tile: 3 });
      G.engine.shake = Math.max(G.engine.shake, A.diving ? 0.28 : 0.15);
    }
    const fov = tf / zoom;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = damp(cam.fov, fov, 16, dt); cam.updateProjectionMatrix(); }
    G.engine.vmCamera.fov = 58 - this.ads * 8; G.engine.vmCamera.updateProjectionMatrix();
    // 揺れ
    const eng = G.engine;
    eng.shake = Math.max(0, eng.shake - dt * 2.2);
    const sh = eng.shake * eng.shake;
    const t = G.time;
    const shx = (Math.sin(t * 37) + Math.sin(t * 61) * 0.5) * sh * 0.03, shy = (Math.sin(t * 43 + 1) + Math.sin(t * 71) * 0.5) * sh * 0.03;
    this.landDip = damp(this.landDip, 0, 7, dt);
    const tp = this.view === 'tp' || A.dropState;
    const scoped = this.scoped;
    const hs = Math.hypot(A.vel.x, A.vel.z);
    if (A.onGround && hs > 0.5) this.camBob += dt * hs * 1.9;
    const bobAmt = S.headBob * (1 - this.ads) * (tp ? 0 : 1);
    const bobY = Math.abs(Math.sin(this.camBob)) * 0.045 * bobAmt * clamp(hs / 5, 0, 1.4);
    const bobX = Math.cos(this.camBob) * 0.025 * bobAmt * clamp(hs / 5, 0, 1.4);
    let rollSpin = 0;
    if (A.rollT >= 0) { const k = Math.min(1, A.rollT / A.rollDur); rollSpin = -Math.PI * 2 * (k * k * (3 - 2 * k)); }
    cam.rotation.set(A.pitch + this.recoilP + shy + rollSpin, A.yaw + this.recoilY + shx, bobX * 0.3 * (1 - this.ads));
    A.body.root.visible = true;
    if (!tp || scoped) {
      A.eyePos(cam.position);
      cam.position.y += bobY - this.landDip;
      if (A.rollT >= 0) cam.position.y -= Math.sin(Math.min(1, A.rollT / A.rollDur) * Math.PI) * 0.55;
      if (A.swimming) cam.position.y = G.world.waterLevel + 0.22 + Math.sin(G.time * 2.1) * 0.05;
      _r.set(Math.cos(A.yaw), 0, -Math.sin(A.yaw));
      cam.position.addScaledVector(_r, bobX);
      A.body.root.visible = false;
    } else {
      const piv = _p.set(A.pos.x, A.pos.y + (A.dropState === 'plane' ? 0 : 1.55 - A.crouch * 0.5), A.pos.z);
      const adsK = this.ads;
      const back = A.dropState === 'plane' ? 22 : A.dropState ? 5.5 : lerp(2.7, 1.7, adsK);
      const right = A.dropState ? 0 : lerp(0.62, 0.72, adsK) * (S.shoulder || 1);
      const up = A.dropState === 'plane' ? 5 : lerp(0.28, 0.22, adsK);
      A.forward(_f);
      _r.set(Math.cos(cam.rotation.y), 0, -Math.sin(cam.rotation.y));
      const desired = _q.copy(piv).addScaledVector(_r, right).addScaledVector(_f, -back); desired.y += up;
      const dv = new THREE.Vector3().subVectors(desired, piv); const L = dv.length(); dv.divideScalar(L);
      const hit = G.world.raycast(piv, dv, L + 0.3);
      let dist = hit ? Math.max(0.2, hit.t - 0.3) : L;
      this.tpDist = dist < this.tpDist ? dist : damp(this.tpDist, dist, 6, dt);
      cam.position.copy(piv).addScaledVector(dv, this.tpDist);
      if (this.tpDist < 0.7 && !A.dropState) A.body.root.visible = false;
    }
    if (A.dropState === 'plane') A.body.root.visible = false;
    // ポストエフェクト
    const u = eng.final.uniforms;
    this.damageFlash = Math.max(0, this.damageFlash - dt * 1.6);
    this.suppression = Math.max(0, this.suppression - dt * 0.8);
    u.uDamage.value = this.damageFlash * 0.8 + this.suppression * 0.25;
    const low = clamp((35 - A.health) / 35, 0, 1);
    u.uLowHealth.value = damp(u.uLowHealth.value, low, 3, dt);
    if (low > 0 && A.alive) { this.heartT -= dt; if (this.heartT <= 0) { this.heartT = 1.2 - low * 0.5; G.audio.play('heartbeat', null, { vol: 0.4 + low * 0.6 }); } }
    G.hud.setScope(scoped, w && w.def);
  }
  onDeath(info) {
    // ハイライト風デスカメラ：死亡地点付近に固定し、倒れる体を映す
    const A = this.actor;
    const c = A.center(new THREE.Vector3());
    const killer = info.attacker && info.attacker !== A ? info.attacker : null;
    let best = null, bs = -1e9;
    const base = killer ? Math.atan2(killer.pos.x - c.x, killer.pos.z - c.z) : A.yaw + Math.PI;
    for (let i = 0; i < 12; i++) {
      const ang = base + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.5 + 0.6;
      const p = new THREE.Vector3(c.x + Math.sin(ang) * 3.6, c.y + 1.9, c.z + Math.cos(ang) * 3.6);
      const gy = G.world.groundAt(p.x, p.z, p.y + 1, 0.2, 2); if (p.y < gy + 0.8) p.y = gy + 0.8;
      let sc = -i * 0.1;
      if (!G.world.lineOfSight(c.clone().setY(c.y + 0.3), p)) sc -= 10;
      if (sc > bs) { bs = sc; best = p; }
    }
    this.death = { pos: best, t: 0, killer, wname: info.weapon ? info.weapon.name : info.zone ? 'ストーム' : info.fall ? '落下' : '' };
    G.slowmo = 1.6;
    G.hud.deathBanner(killer ? killer.name : null, this.death.wname, info.part === 'head');
    G.audio.play('deathHit');
  }
  updateDeathCam(dt) {
    const A = this.actor, cam = G.camera;
    this.deadT += dt;
    this.vm.root.visible = false;
    const D = this.death;
    const c = A.ragdoll ? A.ragdoll.point('pelvis').clone() : A.pos.clone();
    c.y += 0.25;
    if (D && D.pos) {
      D.t += dt;
      cam.position.copy(D.pos);
      const tf = Math.max(34, 60 - D.t * 6); // ゆっくりズームイン
      cam.fov += (tf - cam.fov) * Math.min(1, dt * 2); cam.updateProjectionMatrix();
      const m = new THREE.Matrix4().lookAt(cam.position, c, new THREE.Vector3(0, 1, 0));
      const q = new THREE.Quaternion().setFromRotationMatrix(m);
      if (D.t < 0.05) cam.quaternion.copy(q); else cam.quaternion.slerp(q, Math.min(1, dt * 6));
    } else { cam.position.set(c.x + 3, c.y + 2, c.z + 3); cam.lookAt(c); }
    const u = G.engine.final.uniforms;
    u.uLowHealth.value = damp(u.uLowHealth.value, 0.85, 1.5, dt);
    u.uDamage.value = damp(u.uDamage.value, 0.15, 2, dt);
    G.hud.setScope(false);
  }
}
