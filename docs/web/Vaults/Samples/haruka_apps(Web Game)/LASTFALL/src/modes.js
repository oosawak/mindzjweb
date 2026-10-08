// ゲームモード: バトルロワイヤル(PvP) / サバイバル(PvE) / 射撃訓練場
import * as THREE from 'three';
import { G } from './state.js';
import { Actor } from './actor.js';
import { BotBrain, MonsterBrain } from './ai.js';
import { Player } from './player.js';
import { Zone } from './zone.js';
import { Loot } from './loot.js';
import { WEAPONS, buildGun } from './weapons.js';
import { targetTex } from './textures.js';
import { rand, pick, clamp, formatTime, lerp, dampAngle } from './util.js';

const NAMES = ['Kage', 'Raiden_07', 'ShadowFox', 'Yuki_Snipe', 'Hayabusa', 'NightOwl', 'Ronin', 'Kitsune', 'Tetsuo', 'Ghost_Ops', 'Viper', 'Sakura_X', 'Blitz', 'Oni', 'Taka', 'Reaper', 'HunterX', 'Mamba', 'Koji', 'Nova', 'Zero', 'Ren_JP', 'Akira', 'Hawk', 'Riku', 'Sora', 'Wolf', 'Kaiser', 'Mirage', 'Tanto'];

class BaseMode {
  constructor() { this.friendlyFire = false; this.infiniteAmmo = false; this.over = false; this.time = 0; }
  makePlayer(x, y, z) {
    const a = new Actor({ kind: 'soldier', name: 'あなた', team: 0, isPlayer: true, look: { camo: ['#6b7350', '#8a8a64', '#4f563c', '#a09874'], seed: 7, vest: '#4a4a36', helmet: 0x5a5a44, skin: 0xc89878 } });
    a.setPos(x, y, z);
    G.actors.push(a);
    G.player = new Player(a);
    return a;
  }
  onDeath(a, info) {
    const k = info.attacker;
    const wn = info.zone ? 'ストーム' : info.fall ? '落下' : info.weapon ? (info.weapon.name || '') : info.melee ? '引き裂き' : '';
    if (k && k !== a) k.kills++;
    G.hud.killfeed(k && k !== a ? k.name : '', wn, a.name, info.part === 'head' && !info.explosive, (k && k.isPlayer) || a.isPlayer, a.isMonster);
    if (k && k.isPlayer && k !== a) { G.hud.killBanner(a.name, info.part === 'head'); G.player.onKill(a, info); }
  }
  update(dt) { this.time += dt; }
  dispose() {}
}

// ============================================================================
// 降下（飛行機・パラシュート）
// ============================================================================
class Drop {
  constructor(S) {
    const ang = Math.random() * Math.PI * 2;
    const off = rand(-0.35, 0.35) * S;
    const dir = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));
    const perp = new THREE.Vector3(-dir.z, 0, dir.x);
    this.dir = dir;
    this.start = dir.clone().multiplyScalar(-S * 1.25).addScaledVector(perp, off); this.start.y = 230;
    this.end = dir.clone().multiplyScalar(S * 1.25).addScaledVector(perp, off); this.end.y = 230;
    this.speed = 48; this.len = this.start.distanceTo(this.end); this.t = 0;
    this.pos = this.start.clone();
    this.plane = this.makePlane();
    this.plane.rotation.y = Math.atan2(-dir.x, -dir.z);
    G.scene.add(this.plane);
    this.done = false;
    G.audio.loop('plane', true, 0.5);
  }
  makePlane() {
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: 0x5a6068, roughness: 0.5, metalness: 0.6 });
    const d = new THREE.MeshStandardMaterial({ color: 0x2a2e33, roughness: 0.6, metalness: 0.4 });
    const f = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.0, 26, 16), m); f.rotation.x = Math.PI / 2; g.add(f);
    const n = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 10, 0, 6.3, 0, 1.6), m); n.rotation.x = -Math.PI / 2; n.position.z = -13; g.add(n);
    const w = new THREE.Mesh(new THREE.BoxGeometry(36, 0.4, 4.5), m); w.position.set(0, 1.4, -2); g.add(w);
    const t = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 2.5), m); t.position.set(0, 1.5, 12); g.add(t);
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 3), m); v.position.set(0, 4, 12); g.add(v);
    this.props = [];
    for (const x of [-11, -5.5, 5.5, 11]) {
      const e = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 4, 12), d); e.rotation.x = Math.PI / 2; e.position.set(x, 0.8, -3); g.add(e);
      const p = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.25, 0.1), d); p.position.set(x, 0.8, -5.1); g.add(p); this.props.push(p);
    }
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    g.scale.setScalar(1.2);
    return g;
  }
  makeChute(color) {
    // ラムエア型パラシュート（セル構造のキャノピー）
    const g = new THREE.Group();
    const c1 = new THREE.MeshStandardMaterial({ color, roughness: 0.75, side: THREE.DoubleSide });
    const c2 = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.75, side: THREE.DoubleSide });
    const canopy = new THREE.Group();
    const N = 9, R = 4.6, span = 1.35;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / (N - 1) - 0.5) * span;
      const cell = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 2.6), i % 2 ? c2 : c1);
      cell.position.set(Math.sin(a) * R, Math.cos(a) * R, 0);
      cell.rotation.z = -a; cell.castShadow = true;
      canopy.add(cell);
      for (const z of [-1.1, 0.2, 1.1]) pts.push(new THREE.Vector3(0, 1.45, 0), new THREE.Vector3(Math.sin(a) * (R - 0.18), Math.cos(a) * (R - 0.18), z));
    }
    // 前縁の丸み
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 2 * R * Math.sin(span / 2) + 0.7, 10, 1), c1);
    nose.rotation.z = Math.PI / 2; nose.position.set(0, R * Math.cos(span / 2) + 0.35, -1.3); nose.visible = false;
    canopy.add(nose);
    g.add(canopy);
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.8 })));
    canopy.position.y = 0.2;
    g.scale.set(0.2, 0.3, 0.2);
    return g;
  }
  update(dt) {
    if (this.done) return;
    this.t += dt;
    const k = Math.min(1, (this.t * this.speed) / this.len);
    this.pos.lerpVectors(this.start, this.end, k);
    this.plane.position.copy(this.pos);
    for (const p of this.props) p.rotation.z += dt * 40;
    for (const a of G.actors) {
      if (a.dropState !== 'plane') continue;
      a.pos.copy(this.pos); a.body.root.visible = false;
      if (!a.isPlayer && a.dropJumpK !== undefined && k >= a.dropJumpK) this.jump(a);
    }
    if (k > 0.5 && !this.canJump()) for (const a of G.actors) if (a.dropState === 'plane') this.jump(a, true);
    if (k >= 1) {
      for (const a of G.actors) if (a.dropState === 'plane') this.jump(a, true);
      if (!this.leaving) { this.leaving = true; }
    }
    if (k >= 1 && this.t * this.speed > this.len + 300) { this.done = true; G.scene.remove(this.plane); G.audio.loop('plane', false); }
    if (k >= 1 && !this.done) this.plane.position.addScaledVector(this.dir, (this.t * this.speed - this.len));
  }
  canJump() { const L = G.map.S - 25; return Math.abs(this.pos.x) < L && Math.abs(this.pos.z) < L; }
  jump(a, force = false) {
    if (!force && !this.canJump()) { if (a.isPlayer) G.hud.toast('まだマップの外です'); return; }
    a.dropState = 'freefall'; a.dropT = 0;
    a.pos.copy(this.pos); a.pos.y -= 4;
    a.vel.copy(this.dir).multiplyScalar(18);
    a.body.root.visible = true;
    if (a.isPlayer) { G.audio.loop('freefall', true, 0.45); G.hud.toast('降下開始 — [Space] でパラシュート展開'); G.audio.forced = false; G.audio.fadeMusic(G.settings.bgm ? 1 : 0, 12); }
  }
  steer(a, dt, wx, wz, deploy, dive) {
    const W = G.world;
    a.dropT += dt;
    const gh = W.groundAt(a.pos.x, a.pos.z, a.pos.y, 0.3, 0.5);
    const hAbove = a.pos.y - gh;
    // 入力を体の向き基準に分解（バンク・前傾）
    const rx = Math.cos(a.yaw), rz = -Math.sin(a.yaw), fx = -Math.sin(a.yaw), fz = -Math.cos(a.yaw);
    a.bank = clamp(wx * rx + wz * rz, -1, 1);
    const fwd = clamp(wx * fx + wz * fz, -1, 1);
    if (a.dropState === 'freefall') {
      a.diving = !!dive;
      const hs = dive ? 26 : 16;
      a.vel.x += (wx * hs - a.vel.x) * Math.min(1, dt * 1.2); a.vel.z += (wz * hs - a.vel.z) * Math.min(1, dt * 1.2);
      const vy = dive ? -60 : -38;
      a.vel.y += (vy - a.vel.y) * Math.min(1, dt * 1.6);
      if (hAbove < 85 || (deploy && a.dropT > 1.2)) {
        a.dropState = 'chute'; a.diving = false; a.chuteT = 0;
        a.chute = this.makeChute(pick([0xd04030, 0x3060c0, 0xe0a020, 0x30a060, 0x9040c0, 0x202428])); a.body.root.add(a.chute);
        if (a.isPlayer) { G.audio.play('chute'); G.audio.loop('freefall', false); G.audio.loop('wind', true, 0.18); G.engine.addShake(0.35); G.hud.toast('パラシュート展開 — [W] 早く降下 / [S] ゆっくり'); }
      }
      if (a.isPlayer) G.audio.loop('freefall', true, clamp(-a.vel.y / 60, 0.25, 0.7));
    } else {
      // ふわっと滑空：ゆっくり降下し、慣性の大きい横移動
      a.chuteTilt += (fwd - a.chuteTilt) * Math.min(1, dt * 1.5);
      const glide = 7 + Math.max(0, fwd) * 4;
      a.vel.x += (wx * glide - a.vel.x) * Math.min(1, dt * 0.6); a.vel.z += (wz * glide - a.vel.z) * Math.min(1, dt * 0.6);
      const vy = fwd > 0.3 ? -6.5 : fwd < -0.3 ? -2.6 : -3.6;
      const open = Math.min(1, (a.chuteT || 0) / 1.2);
      a.vel.y += (vy + Math.sin(a.dropT * 1.1) * 0.45 - a.vel.y) * Math.min(1, dt * (0.8 + open * 1.2));
    }
    a.pos.addScaledVector(a.vel, dt);
    if (a.dropState === 'chute') W.collide(a.pos, a.radius, 1.8, 0.5);
    const g2 = W.groundAt(a.pos.x, a.pos.z, a.pos.y + 1, a.radius, 1);
    if (a.pos.y <= g2) {
      a.pos.y = g2; a.vel.set(a.vel.x * 0.3, 0, a.vel.z * 0.3);
      if (a.dropState === 'freefall') a.takeDamage({ amount: 35, part: 'leg', fall: true, dir: new THREE.Vector3(0, -1, 0) });
      this.land(a);
    }
    if (!a.isPlayer) { const hv = Math.hypot(a.vel.x, a.vel.z); if (hv > 1) a.yaw = dampAngle(a.yaw, Math.atan2(-a.vel.x, -a.vel.z), 2, dt); }
  }
  land(a) {
    a.dropState = null; a.onGround = true; a.landT = G.time; a.bank = 0; a.diving = false; a.chuteTilt = 0;
    if (a.body.root) { a.body.root.rotation.x = 0; a.body.root.rotation.z = 0; }
    if (a.chute) { a.body.root.remove(a.chute); a.chute = null; }
    if (a.isPlayer) { G.audio.loop('wind', false); G.audio.loop('freefall', false); G.audio.play('land'); G.hud.toast('着地 — 武器を探せ！'); }
  }
  botSteer(a, dt) {
    if (a.dropState === 'plane') return;
    const t = a.dropTarget;
    let wx = 0, wz = 0;
    if (t) { const dx = t.x - a.pos.x, dz = t.z - a.pos.z, d = Math.hypot(dx, dz); if (d > 2) { wx = dx / d; wz = dz / d; } }
    const gh = G.world.groundAt(a.pos.x, a.pos.z, a.pos.y, 0.3, 0.5);
    this.steer(a, dt, wx, wz, a.pos.y - gh < 110 + (a.id % 5) * 10, t && Math.hypot(t.x - a.pos.x, t.z - a.pos.z) < 60);
  }
  dispose() { G.scene.remove(this.plane); G.audio.loop('plane', false); G.audio.loop('freefall', false); G.audio.loop('wind', false); }
}

// ============================================================================
// バトルロワイヤル
// ============================================================================
export class BattleRoyale extends BaseMode {
  constructor(map, diff) {
    super();
    this.id = 'br'; this.map = map; this.diff = diff;
    this.total = 24;
    G.loot = new Loot(); G.loot.populate(map, 1);
    G.zone = new Zone(map.S);
    this.drop = new Drop(map.S);
    const pa = this.makePlayer(this.drop.pos.x, this.drop.pos.y, this.drop.pos.z);
    pa.dropState = 'plane';
    G.player.freeLookYaw = Math.atan2(-this.drop.dir.x, -this.drop.dir.z);
    const names = [...NAMES].sort(() => Math.random() - 0.5);
    for (let i = 0; i < this.total - 1; i++) {
      const b = new Actor({ kind: 'soldier', name: names[i % names.length], team: i + 1, look: { seed: i + 11, hat: Math.random() < 0.25 ? 'cap' : 'helmet', backpack: Math.random() < 0.7 } });
      new BotBrain(b, diff);
      b.dropState = 'plane'; b.dropJumpK = rand(0.1, 0.9);
      const p = map.loot.length ? pick(map.loot) : map.randomOutdoor();
      b.dropTarget = new THREE.Vector3(p[0], 0, p[1]);
      // 降下地点が飛行ルートに近くなるように
      const k = clamp(new THREE.Vector3(p[0], 0, p[1]).sub(this.drop.start).setY(0).dot(this.drop.dir) / this.drop.len, 0.05, 0.95);
      b.dropJumpK = clamp(k - 0.15 + rand(-0.05, 0.05), 0.02, 0.95);
      b.setPos(this.drop.pos.x, this.drop.pos.y, this.drop.pos.z);
      b.bandages = Math.random() < 0.5 ? 2 : 0;
      G.actors.push(b);
    }
    G.audio.setMusic('battle', true); // 降下前は流し、飛び降りたらフェードアウト
    G.hud.bigMessage('バトルロワイヤル', `${this.total}人の生存者 — 最後の1人になれ`);
    setTimeout(() => { if (G.player && G.player.actor.dropState === 'plane') G.hud.toast('[Space] で飛行機から降下（マップ上空に入ってから）'); }, 2500);
  }
  alive() { return G.actors.filter((a) => a.alive).length; }
  update(dt) {
    super.update(dt);
    this.drop.update(dt);
    G.zone.update(dt);
    // 戦闘強度 → BGM
    const P = G.player.actor;
    let inten = 0;
    if (G.time - P.lastDamage < 6) inten = 1;
    else if (G.noises.some((n) => G.time - n.t < 4 && n.pos.distanceTo(P.pos) < 80)) inten = 0.6;
    else inten = G.zone.state === 'shrink' ? 0.3 : 0.1;
    if (this.alive() <= 5) inten = Math.max(inten, 0.7);
    G.audio.intensity += (inten - G.audio.intensity) * Math.min(1, dt * 0.5);
    if (!this.over) {
      if (!P.alive) this.finish(false);
      else if (this.alive() === 1) this.finish(true);
    }
  }
  onDeath(a, info) {
    super.onDeath(a, info);
    G.loot.dropAll(a);
  }
  finish(win) {
    this.over = true;
    const P = G.player.actor;
    const place = win ? 1 : this.alive() + 1;
    const stats = [['順位', `#${place} / ${this.total}`], ['キル', P.kills], ['与ダメージ', Math.round(P.damageDealt)], ['生存時間', formatTime(this.time)]];
    setTimeout(() => G.ui.showResults({
      win, title: win ? '#1 VICTORY' : `#${place} 敗北`, sub: win ? '最後の生存者 — おめでとう！' : '次はもっと上手くやれる', stats,
    }), win ? 1500 : 5200);
    G.audio.play(win ? 'victory' : 'defeat');
    if (win) G.audio.setMusic('victory', true);
  }
  hudInfo() {
    const Z = G.zone;
    const zs = Z.state === 'wait' ? `ゾーン収縮まで ${formatTime(Z.timer)}` : Z.state === 'shrink' ? `ゾーン収縮中 ${formatTime(Z.timer)}` : '最終ゾーン';
    return { alive: this.alive(), kills: G.player.actor.kills, lines: [zs] };
  }
  dispose() { this.drop.dispose(); G.zone && G.zone.dispose(); G.zone = null; G.loot && G.loot.dispose(); }
}

// ============================================================================
// サバイバル（PvE）
// ============================================================================
export class Survival extends BaseMode {
  constructor(map, diff) {
    super();
    this.id = 'pve'; this.map = map; this.diff = diff;
    G.loot = new Loot(); G.loot.populate(map, 0.5);
    const p = map.loot.length ? pick(map.loot) : map.randomOutdoor();
    const sp = map.randomOutdoor();
    const a = this.makePlayer(sp[0], sp[1] + 0.5, sp[2]);
    a.giveWeapon('pistol', 1); a.giveWeapon('ar', 0);
    a.bandages = 4; a.medkits = 1; a.grenades = 2; a.armor = 50; a.armorMax = 50;
    G.player.onWeaponChanged();
    G.player.setFlashlight(true);
    this.wave = 0; this.maxWave = 10; this.toSpawn = []; this.spawnT = 0; this.breakT = 8; this.state = 'break'; this.score = 0;
    this.monsterMul = [0.75, 1, 1.35][diff];
    G.audio.setMusic('horror');
    G.audio.loop('drone', true, 0.12);
    G.hud.bigMessage('サバイバル', '夜明けまで生き延びろ — 全10ウェーブ');
    this.flares = [];
  }
  startWave() {
    this.wave++; this.state = 'wave';
    const n = this.wave;
    const list = [];
    const g = Math.round((5 + n * 2.6) * this.monsterMul);
    for (let i = 0; i < g; i++) list.push(n >= 2 && Math.random() < 0.3 + n * 0.02 ? 'crawler' : 'ghoul');
    if (n >= 3) for (let i = 0; i < Math.floor(n / 3) * (this.diff === 2 ? 2 : 1); i++) list.push('brute');
    if (n === 5) list.push('brute', 'brute');
    if (n === this.maxWave) list.push('boss');
    this.toSpawn = list.sort(() => Math.random() - 0.5);
    if (n === this.maxWave) { this.toSpawn = this.toSpawn.filter((k) => k !== 'boss'); this.toSpawn.unshift('boss'); }
    this.spawnT = 1;
    G.hud.bigMessage(n === this.maxWave ? 'FINAL WAVE' : `WAVE ${n}`, n === this.maxWave ? '巨大な何かが近づいてくる…' : `${list.length} 体の敵性反応`);
    G.audio.play('wave');
    G.audio.intensity = 0.4 + n * 0.05;
  }
  spawnMonster(kind, near = null) {
    const P = G.player.actor;
    let pos = null;
    for (let i = 0; i < 14; i++) {
      const base = near || P.pos;
      const ang = Math.random() * Math.PI * 2, d = near ? rand(3, 7) : rand(38, 65);
      const x = clamp(base.x + Math.cos(ang) * d, -this.map.S + 15, this.map.S - 15), z = clamp(base.z + Math.sin(ang) * d, -this.map.S + 15, this.map.S - 15);
      const y = G.world.groundAt(x, z, 200, 0.4, 1);
      if (G.world.waterLevel > -900 && y < G.world.waterLevel - 0.5) continue;
      const p = new THREE.Vector3(x, y, z);
      const probe = p.clone(); G.world.collide(probe, 0.6, 2, 0.3);
      if (probe.distanceTo(p) > 0.1) continue;
      pos = p;
      if (near || !G.world.lineOfSight(P.eyePos(new THREE.Vector3()), p.clone().setY(y + 1.2))) break;
    }
    if (!pos) return null;
    const m = new Actor({ kind });
    m.name = m.stats.name;
    m.team = 99;
    m.maxHealth = m.health = m.stats.hp * (this.diff === 2 ? 1.25 : this.diff === 0 ? 0.8 : 1) * (1 + this.wave * 0.04);
    m.setPos(pos.x, pos.y, pos.z);
    m.yaw = Math.atan2(-(P.pos.x - pos.x), -(P.pos.z - pos.z));
    new MonsterBrain(m);
    m.brain.startEmerge();
    G.actors.push(m);
    G.vfx.smokePuff(pos, [0.05, 0.02, 0.02], kind === 'boss' ? 40 : 10, kind === 'boss' ? 4 : 1.2);
    if (m.pos.distanceTo(P.pos) < 45) G.audio.play('mgurgle', pos);
    if (kind === 'boss') { G.hud.bossBar(m); G.audio.play('roar', pos); G.engine.addShake(0.8); }
    return m;
  }
  bossSummon(boss) { for (let i = 0; i < 3; i++) this.spawnMonster('ghoul', boss.pos); }
  supplyDrop() {
    const P = G.player.actor;
    const c = P.pos.clone().add(new THREE.Vector3(rand(-6, 6), 0, rand(-6, 6)));
    const items = [{ type: 'ammo' }, { type: 'ammo' }, { type: 'bandage' }, { type: 'grenade' }];
    if (this.wave % 2 === 0) items.push({ type: 'medkit' });
    if (this.wave % 3 === 0) items.push({ type: 'weapon', id: pick(['lmg', 'shotgun', 'dmr', 'sniper', 'smg']) });
    if (this.wave === 4 || this.wave === 7) items.push({ type: 'armor', level: this.wave === 4 ? 2 : 3 });
    for (const it of items) { const x = c.x + rand(-1.5, 1.5), z = c.z + rand(-1.5, 1.5); const y = G.world.groundAt(x, z, P.pos.y + 1, 0.1, 1.5); G.loot.spawn(x, y + 0.02, z, it); }
    this.flares.push({ p: new THREE.Vector3(c.x, G.world.groundAt(c.x, c.z, P.pos.y + 1, 0.1, 1.5), c.z), t: 25 });
    G.vfx.light(c.clone().setY(c.y + 2), 0xff3020, 60, 2, 20);
    G.hud.toast('補給物資が投下された（赤い発煙筒）');
    G.audio.play('supply');
  }
  update(dt) {
    super.update(dt);
    const P = G.player.actor;
    const alive = G.actors.filter((a) => a.alive && a.isMonster);
    if (this.state === 'break') {
      this.breakT -= dt;
      if (this.breakT <= 0) this.startWave();
      G.audio.intensity += (0.15 - G.audio.intensity) * dt * 0.3;
    } else if (this.state === 'wave') {
      this.spawnT -= dt;
      if (this.toSpawn.length && this.spawnT <= 0 && alive.length < 14 + this.diff * 3) { const k = this.toSpawn.shift(); if (!this.spawnMonster(k)) this.toSpawn.push(k); this.spawnT = rand(0.6, 2.2) / (1 + this.wave * 0.08); }
      const near = alive.filter((m) => m.pos.distanceTo(P.pos) < 25).length;
      G.audio.intensity += (clamp(0.35 + near * 0.15, 0, 1) - G.audio.intensity) * dt * 0.8;
      if (!this.toSpawn.length && alive.length === 0) {
        if (this.wave >= this.maxWave) { this.finish(true); }
        else { this.state = 'break'; this.breakT = 18; G.hud.bigMessage(`WAVE ${this.wave} クリア`, '次のウェーブまで 18 秒'); this.supplyDrop(); G.hud.bossBar(null); }
      }
    }
    // 遠くから聞こえる不気味な声
    this.ambT = (this.ambT ?? 6) - dt;
    if (this.ambT <= 0) { this.ambT = rand(8, 18); const a = Math.random() * 6.28, r = rand(55, 85); G.audio.play(pick(['mscream', 'mroar', 'mgurgle', 'mscream', 'mclick']), P.pos.clone().add(new THREE.Vector3(Math.cos(a) * r, 2, Math.sin(a) * r)), { maxDist: 200, big: 1 }); }
    for (const f of this.flares) { f.t -= dt; if (f.t > 0) G.vfx.fire(f.p, dt * 0.5), Math.random() < dt * 8 && G.vfx.norm.spawn(f.p.x, f.p.y + 0.3, f.p.z, rand(-0.3, 0.3), rand(2, 3), rand(-0.3, 0.3), { color: [0.6, 0.08, 0.05], life: 4, size: 0.5, size1: 3, alpha: 0.5, tile: 1, drag: 0.4, fadeIn: 0.1 }); }
    this.flares = this.flares.filter((f) => f.t > 0);
    // 古い死体を片付け（パフォーマンス）
    if (!this.over && !P.alive) this.finish(false);
  }
  onDeath(a, info) {
    super.onDeath(a, info);
    if (a.isMonster && info.attacker && info.attacker.isPlayer) { this.score += a.stats.score * (info.part === 'head' ? 1.5 : 1); if (Math.random() < 0.12) G.loot.spawn(a.pos.x, G.world.groundAt(a.pos.x, a.pos.z, a.pos.y + 1, 0.1, 1.5) + 0.02, a.pos.z, pick([{ type: 'ammo' }, { type: 'bandage' }, { type: 'grenade' }])); }
    if (a.kind === 'boss') { G.hud.bossBar(null); G.engine.addShake(1); }
    // モンスター死体は数秒で崩れて消える
    if (a.isMonster) setTimeout(() => { if (a.ragdoll) { const p = a.ragdoll.point('pelvis'); G.vfx.smokePuff(p, [0.08, 0.03, 0.03], 5, 0.8); } }, 12000);
  }
  finish(win) {
    this.over = true;
    const P = G.player.actor;
    G.audio.play(win ? 'victory' : 'defeat');
    if (win) G.audio.setMusic('victory', true);
    const stats = [['到達ウェーブ', `${this.wave} / ${this.maxWave}`], ['キル', P.kills], ['スコア', Math.round(this.score)], ['生存時間', formatTime(this.time)]];
    setTimeout(() => G.ui.showResults({
      win, title: win ? '夜明け — 生還' : '死亡', sub: win ? `全${this.maxWave}ウェーブを生き延びた` : `ウェーブ ${this.wave} で力尽きた`, stats,
    }), win ? 2500 : 5200);
  }
  hudInfo() {
    const alive = G.actors.filter((a) => a.alive && a.isMonster).length + this.toSpawn.length;
    return { wave: `WAVE ${this.wave}/${this.maxWave}`, kills: G.player.actor.kills, lines: [this.state === 'break' ? `次のウェーブまで ${Math.ceil(this.breakT)}秒` : `残り ${alive} 体`, `スコア ${Math.round(this.score)}`] };
  }
  dispose() { G.audio.loop('drone', false); G.hud.bossBar(null); G.loot && G.loot.dispose(); }
}

// ============================================================================
// 射撃訓練場
// ============================================================================
export class Training extends BaseMode {
  constructor(map) {
    super();
    this.id = 'range'; this.map = map; this.infiniteAmmo = true; this.rangeRack = true;
    G.loot = new Loot();
    const a = this.makePlayer(2.5, 0.05, 40);
    a.giveWeapon('pistol', 1); a.giveWeapon('ar', 0);
    a.grenades = 99; a.bandages = 99; a.medkits = 99; a.armor = 100; a.armorMax = 100;
    G.player.onWeaponChanged();
    // 武器棚
    const ids = Object.keys(WEAPONS);
    ids.forEach((id, i) => { const it = G.loot.spawn(-29 + i * 3, 0.95, 47, { type: 'weapon', id }); it.rack = true; });
    this.shots = 0; this.hits = 0; this.dmgLog = [];
    this.targets = [];
    // 鉄板ターゲット
    const lanes = [10, 25, 50, 75, 100];
    lanes.forEach((d, i) => {
      for (const x of [-18, 18]) this.addPlate(x + (i - 2) * 1.2, 35 - d, 0.3 + d * 0.004);
    });
    // ポップアップ（人型シルエット）
    [[-8, 20], [-3, 5], [3, -15], [8, -40], [0, -65]].forEach(([x, z]) => this.addPopup(x, z));
    // 動く的
    this.addMover(0, 10, 8); this.addMover(0, -25, 12);
    // ダミー（ゴア確認用）
    this.dummySpots = [[-24, 22], [-26, 12], [-22, 2], [24, 22]];
    this.dummies = [];
    this.dummySpots.forEach((s, i) => this.spawnDummy(i));
    G.targets = this.targets;
    this.spawned = [];
    G.audio.setMusic('range');
    G.hud.bigMessage('射撃訓練場', '後ろの武器棚で [E] 武器変更 / [B] ボット出現 / [N] モンスター出現');
  }
  addPlate(x, z, r) {
    const g = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6 }));
    post.position.y = 0.6; g.add(post);
    const pivot = new THREE.Group(); pivot.position.y = 1.2; g.add(pivot);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.03, 24), new THREE.MeshStandardMaterial({ color: 0xd8d0c0, metalness: 0.5, roughness: 0.4 }));
    plate.rotation.x = Math.PI / 2; plate.position.y = -r - 0.05; pivot.add(plate);
    g.position.set(x, 0, z); G.scene.add(g);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    const t = { g, pivot, swing: 0, sv: 0, r, center: () => new THREE.Vector3(x, 1.2 - r - 0.05, z),
      ray: (o, d, max) => { const c = t.center(); if (Math.abs(d.z) < 1e-4) return null; const tt = (c.z - o.z) / d.z; if (tt < 0 || tt > max) return null; const px = o.x + d.x * tt - c.x, py = o.y + d.y * tt - c.y; return px * px + py * py < r * r ? tt : null; },
      hit: (p, d, def, dist, sh) => { t.sv += 2 + def.dmg * 0.05; G.audio.play('target', p); this.logHit(def.dmg, sh, p); G.vfx.impact(p, new THREE.Vector3(0, 0, 1), 'metal'); },
      update: (dt) => { t.sv += -t.swing * 40 * dt; t.sv *= Math.exp(-2 * dt); t.swing += t.sv * dt; t.pivot.rotation.x = -t.swing; } };
    this.targets.push(t);
  }
  addPopup(x, z) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 256; const g2 = c.getContext('2d');
    g2.fillStyle = '#6a5a40'; g2.fillRect(0, 0, 128, 256); g2.fillStyle = '#222';
    g2.beginPath(); g2.arc(64, 50, 32, 0, 7); g2.fill(); g2.fillRect(20, 85, 88, 171);
    g2.strokeStyle = '#eee'; g2.lineWidth = 3; g2.beginPath(); g2.arc(64, 150, 30, 0, 7); g2.stroke(); g2.beginPath(); g2.arc(64, 50, 16, 0, 7); g2.stroke();
    const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
    const grp = new THREE.Group();
    const pivot = new THREE.Group(); grp.add(pivot);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.8), new THREE.MeshStandardMaterial({ map: tx, side: THREE.DoubleSide }));
    m.position.y = 0.9; m.castShadow = true; pivot.add(m);
    grp.position.set(x, 0, z); G.scene.add(grp);
    const t = { up: true, downT: 0, ang: 0,
      ray: (o, d, max) => { if (!t.up) return null; if (Math.abs(d.z) < 1e-4) return null; const tt = (z - o.z) / d.z; if (tt < 0 || tt > max) return null; const px = o.x + d.x * tt - x, py = o.y + d.y * tt; return Math.abs(px) < 0.3 && py > 0 && py < 1.8 ? tt : null; },
      hit: (p, d, def, dist, sh) => { const head = p.y > 1.45; t.up = false; t.downT = 2.5; G.audio.play('target', p); this.logHit(def.dmg * (head ? def.head : 1), sh, p, head); },
      update: (dt) => { if (!t.up) { t.downT -= dt; if (t.downT <= 0) t.up = true; } t.ang += ((t.up ? 0 : -Math.PI / 2) - t.ang) * Math.min(1, dt * 10); pivot.rotation.x = t.ang; } };
    this.targets.push(t);
  }
  addMover(x, z, amp) {
    const grp = new THREE.Group();
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24), new THREE.MeshStandardMaterial({ map: targetTex(), side: THREE.DoubleSide }));
    m.position.y = 1.3; grp.add(m);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(amp * 2 + 1, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7 }));
    rail.position.set(x, 0.8, z - 0.1); G.scene.add(rail);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.05), new THREE.MeshStandardMaterial({ color: 0x333333 })); post.position.y = 0.4; grp.add(post);
    G.scene.add(grp);
    const t = { ph: Math.random() * 6, px: x,
      ray: (o, d, max) => { if (Math.abs(d.z) < 1e-4) return null; const tt = (z - o.z) / d.z; if (tt < 0 || tt > max) return null; const px = o.x + d.x * tt - t.px, py = o.y + d.y * tt - 1.3; return px * px + py * py < 0.2 ? tt : null; },
      hit: (p, d, def, dist, sh) => { G.audio.play('target', p); this.logHit(def.dmg, sh, p); },
      update: (dt) => { t.ph += dt * 0.9; t.px = x + Math.sin(t.ph) * amp; grp.position.set(t.px, 0, z); } };
    this.targets.push(t);
  }
  spawnDummy(i) {
    const [x, z] = this.dummySpots[i];
    const d = new Actor({ kind: i === 3 ? 'brute' : 'soldier', name: i === 3 ? 'モンスター標的' : `ダミー${i + 1}`, team: 50 + i, look: { seed: 90 + i } });
    if (i === 3) { d.stats = { ...d.stats }; d.maxHealth = d.health = 600; }
    if (i === 1) { d.armor = 100; d.armorMax = 100; d.name = 'ダミー（アーマー）'; }
    if (i !== 3) d.giveWeapon(['ar', 'smg', 'shotgun'][i]);
    d.setPos(x, 0.05, z); d.yaw = Math.PI; d.bodyYaw = Math.PI; d.onGround = true; d.dummy = i;
    G.actors.push(d);
    this.dummies[i] = d;
  }
  logHit(dmg, shooter, p, head = false) {
    if (!shooter || !shooter.isPlayer) return;
    this.hits++; this.dmgLog.push([G.time, dmg]);
    G.hud.hitmarker(false, head); G.hud.damageNumber(p, Math.round(dmg), head, false);
    G.audio.play(head ? 'headshot' : 'hit');
  }
  update(dt) {
    super.update(dt);
    for (const t of this.targets) t.update(dt);
    const I = G.input;
    for (const d of this.dummies) if (d && d.alive) { d.updateVisual(dt); d.anim.speed = 0; }
    this.dummies.forEach((d, i) => { if (d && !d.alive && G.time - d.deathTime > 3.5) this.spawnDummy(i); });
    if (G.player.actor.alive && I) {
      if (I.hit('KeyB')) { const b = new Actor({ kind: 'soldier', name: pick(NAMES), team: 70 + this.spawned.length, look: { seed: this.spawned.length + 40 } }); b.giveWeapon(pick(['ar', 'smg', 'shotgun'])); b.setPos(rand(26, 38), 0.05, rand(-70, -20)); new BotBrain(b, 0); b.brain.target = G.player.actor; G.actors.push(b); this.spawned.push(b); G.hud.toast('敵ボットが出現（右側の障害物コース）'); }
      if (I.hit('KeyN')) { const k = pick(['ghoul', 'ghoul', 'crawler', 'brute']); const m = new Actor({ kind: k }); m.name = m.stats.name; m.team = 99; m.setPos(rand(-10, 10), 0.05, -60); new MonsterBrain(m); G.actors.push(m); this.spawned.push(m); G.hud.toast(m.name + ' が出現！'); G.vfx.smokePuff(m.pos); }
      if (I.hit('KeyK')) { for (const s of this.spawned) if (s.alive) s.takeDamage({ amount: 9999, part: 'torso', dir: new THREE.Vector3(0, 1, 0), explosive: true }); this.spawned = []; }
    }
    // 射撃数の集計
    const P = G.player.actor;
    if (P.weapon && P._lastMag !== undefined && P.weapon.mag < P._lastMag && P._lastW === P.weapon) this.shots += P.weapon.def.pellets > 1 ? 1 : P._lastMag - P.weapon.mag;
    P._lastMag = P.weapon ? P.weapon.mag : 0; P._lastW = P.weapon;
    this.dmgLog = this.dmgLog.filter(([t]) => G.time - t < 3);
    if (!P.alive && !this.respawning) { this.respawning = true; setTimeout(() => { this.respawning = false; this.respawnPlayer(); }, 3000); }
  }
  respawnPlayer() {
    const old = G.player.actor;
    G.player.dispose();
    G.actors = G.actors.filter((a) => a !== old);
    const a = this.makePlayer(2.5, 0.05, 40);
    a.giveWeapon('pistol', 1); a.giveWeapon('ar', 0); a.grenades = 99; a.bandages = 99; a.medkits = 99; a.armor = 100; a.armorMax = 100;
    G.player.onWeaponChanged();
    G.engine.final.uniforms.uLowHealth.value = 0;
  }
  onDeath(a, info) { super.onDeath(a, info); if (a.dummy === undefined && !a.isPlayer) G.hud.toast(`${a.name} を撃破`); }
  hudInfo() {
    const dps = this.dmgLog.reduce((s, [, d]) => s + d, 0) / 3;
    return { lines: [`命中率 ${this.shots ? Math.round((this.hits / this.shots) * 100) : 0}%  (${this.hits}/${this.shots})`, `DPS ${Math.round(dps)}`, '[B]ボット [N]モンスター [K]全消去'] };
  }
  dispose() { G.targets = []; G.loot && G.loot.dispose(); }
}
