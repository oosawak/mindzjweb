// =========================================================
// Match — 試合の進行(すべてのモード共通)
//  ホスト(オフラインでは自分)が「正解」を決める:
//    弾の当たり / 塗り / インクアウト / スタンプ / スコア / 時間 / ばくだん
//  参加者は自分の移動を計算して送り、ホストの結果を受け取る。
// =========================================================
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { settings } from '../core/Settings.js';
import { Arena } from './Arena.js';
import { Actor, GRAVITY_DIRS, gravityIndex } from './Actor.js';
import { Bot } from './Bot.js';
import cubeArena from './arenas/cube.js';
import { MSG, encodeStates, decodeStates, encodePaint, decodePaint, vec } from '../net/Wire.js';

const CB = CONFIG.combat, PH = CONFIG.physics;
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _seg = new THREE.Vector3();
const ARENAS = { cube: cubeArena };

/** オフライン用の「なにもしない」通信 */
export function offlineNet() {
  return { online: false, isHost: true, selfId: 'local', send() {}, toHost() {}, sendBytes() {}, on() { return () => {}; }, maxPayload: 2004 };
}

export class Match {
  /**
   * @param {object} o
   * @param {object} o.cfg   { mode, slots:[{idx,id,name,team,bot}], rounds, duration }
   * @param {object} o.net   offlineNet() か NetSession のアダプタ
   * @param {object} o.fx    演出(MatchScene が実装)
   */
  constructor({ cfg, net, fx, scene }) {
    this.cfg = cfg;
    this.mode = cfg.mode;
    this.net = net;
    this.fx = fx;
    this.isHost = net.isHost;
    this.arena = new Arena(ARENAS[cfg.arena || 'cube']);
    scene.add(this.arena.group);
    const teams = settings.teams();
    this.teamColors = [null, teams[0].color, teams[1].color];
    this.arena.setTeamColors(teams[0].color, teams[1].color);

    this.actors = cfg.slots.map((s) => {
      const color = this.mode === 'tag' ? CONFIG.ffaColors[s.idx % CONFIG.ffaColors.length] : this.teamColors[s.team];
      const isMe = !s.bot && s.id === net.selfId;
      const a = new Actor({ idx: s.idx, team: s.team, color, name: s.name, isBot: !!s.bot, isLocal: isMe || (s.bot && this.isHost), userId: s.id });
      scene.add(a.model);
      if (a.isBot && this.isHost) a.brain = new Bot(a, this, { kind: s.ai || (this.mode === 'tag' ? 'tag' : 'turf'), skill: s.skill ?? 0.7 });
      return a;
    });
    this.me = this.actors.find((a) => !a.isBot && a.userId === net.selfId) || null;
    this.byUser = new Map(this.actors.filter((a) => a.userId).map((a) => [a.userId, a]));

    this.shots = [];
    this.bombs = [];
    this.phase = 'wait';
    this.round = 0;
    this.rounds = cfg.rounds ?? 1;
    this.duration = cfg.duration ?? 120;
    this.timeLeft = this.duration;
    this.phaseT = 0;
    this.wins = [0, 0, 0];
    this.roundLog = [];
    this.overdrive = false;
    this.score = { a: 0, b: 0, tot: this.arena.paintable };
    this.tag = { fuse: 0, wave: 0, order: [] };
    this.loaded = new Set();
    this.pendingCells = [];
    this.pendingOwners = [];
    this.resyncCursor = 0;
    this.timers = { state: 0, paint: 0, score: 0, shots: 0, roller: 0 };
    this.outgoingShots = [];
    this.seq = 0;
    this.ended = false;
    this.deadUntil = new Map();

    this._bindNet();
  }

  // =========================================================
  // 通信
  // =========================================================
  _bindNet() {
    const n = this.net;
    const subs = [];
    const on = (k, f) => subs.push(n.on(k, f));
    this.unsubs = subs;
    on('#bin', (bytes, from) => this._onBinary(bytes, from));
    on('shots', (m, from) => this._onShots(m, from));
    on('hp', (m) => { const a = this.actors[m.i]; if (a) a.hp = m.hp; if (a === this.me) this.fx.myHp?.(m.hp); });
    on('out', (m) => this._onOut(m));
    on('stamp', (m, from) => this._onStamp(m, from));
    on('bomb', (m, from) => this._onBomb(m, from));
    on('flip', (m) => this._onForcedFlip(m));
    on('score', (m) => { if (!this.isHost) this._applyScore(m); });
    on('phase', (m) => { if (!this.isHost) this._applyPhase(m); });
    on('tag', (m) => { if (!this.isHost) this._applyTag(m); });
    on('pass', (m) => { if (!this.isHost) this._applyPass(m); });
    on('boom', (m) => { if (!this.isHost) this._applyBoom(m); });
    on('knock', (m) => { if (this.me && m.i === this.me.idx) this.me.vel.add(_a.fromArray(m.v)); });
    on('shove', (m, from) => this._onShove(m, from));
    on('loaded', (m, from) => { if (this.isHost) this.loaded.add(from); });
    on('end', (m) => { if (!this.isHost) this._finish(m.results); });
  }

  _ownerOk(actor, from) {
    if (!actor) return false;
    if (from === this.net.hostId || (this.net.isHostId && this.net.isHostId(from))) return true;
    return actor.userId === from;
  }

  _onBinary(bytes, from) {
    if (bytes[0] === MSG.STATE) {
      const d = decodeStates(bytes);
      if (!d) return;
      const now = performance.now() / 1000;
      for (const s of d.list) {
        const a = this.actors[s.idx];
        if (!a || a.isLocal || !this._ownerOk(a, from)) continue;
        const prevG = a.buf.length ? a.buf[a.buf.length - 1].g : s.g;
        a.pushState(s, now);
        if (prevG !== s.g) this.fx.flip?.(a);
        const dead = this.deadUntil.get(a.idx) || 0;
        const alive = !!(s.flags & 4);
        if (alive && !a.alive && now > dead) { a.alive = true; a.model.visible = true; a.shield = CB.spawnShield; this.fx.respawn?.(a); }
        if (!this.isHost) { a.holding = !!(s.flags & 8); a.out = !!(s.flags & 16); a.hp = s.hp; }
      }
    } else if (bytes[0] === MSG.PAINT && !this.isHost) {
      const d = decodePaint(bytes);
      if (!d) return;
      for (let i = 0; i < d.cells.length; i++) this.arena.setOwner(d.cells[i], d.owners[i], 0.5);
    }
  }

  _stateOf(a) {
    return {
      idx: a.idx,
      flags: (a.grounded ? 1 : 0) | (a.firing ? 2 : 0) | (a.alive ? 4 : 0) | (a.holding ? 8 : 0) | (a.out ? 16 : 0),
      g: gravityIndex(a.gravity),
      px: a.pos.x, py: a.pos.y, pz: a.pos.z,
      vx: a.vel.x, vy: a.vel.y, vz: a.vel.z,
      ax: a.aim.x, ay: a.aim.y, az: a.aim.z,
      hp: a.hp,
    };
  }

  _sendNet(dt) {
    const T = this.timers, N = CONFIG.net;
    T.state -= dt; T.paint -= dt; T.score -= dt; T.shots -= dt;
    if (T.state <= 0) {
      T.state = 1 / N.stateHz;
      const mine = this.actors.filter((a) => a.isLocal);
      if (mine.length) this.net.sendBytes(false, encodeStates(mine.map((a) => this._stateOf(a)), ++this.seq));
    }
    if (T.shots <= 0 && this.outgoingShots.length) {
      T.shots = 1 / N.shotBatchHz;
      // 弾は撃った本人(CPU はホスト)がまとめて送る
      const byOwner = new Map();
      for (const s of this.outgoingShots) { if (!byOwner.has(s.i)) byOwner.set(s.i, []); byOwner.get(s.i).push(s.s); }
      for (const [i, list] of byOwner) for (let k = 0; k < list.length; k += 8) this.net.send({ k: 'shots', i, s: list.slice(k, k + 8) });
      this.outgoingShots.length = 0;
    }
    if (!this.isHost) return;
    if (T.paint <= 0) {
      T.paint = 1 / N.paintHz;
      // ずれ防止: 毎回すこしずつ全マスを送り直す
      const ar = this.arena;
      for (let k = 0; k < 140; k++) {
        const c = this.resyncCursor;
        this.resyncCursor = (this.resyncCursor + 1) % ar.cellCount;
        if (ar.owner[c] === Arena.DISABLED) continue;
        this.pendingCells.push(c);
        this.pendingOwners.push(ar.owner[c]);
      }
      if (this.pendingCells.length) {
        for (const chunk of encodePaint(this.pendingCells, this.pendingOwners, this.net.maxPayload)) this.net.sendBytes(true, chunk);
        this.pendingCells.length = 0;
        this.pendingOwners.length = 0;
      }
    }
    if (T.score <= 0) {
      T.score = 0.25;
      this.net.send(this._scoreMsg());
    }
  }

  _scoreMsg() {
    return {
      k: 'score', a: this.arena.counts[1], b: this.arena.counts[2], tot: this.arena.paintable,
      t: Math.round(this.timeLeft * 10) / 10, od: this.overdrive ? 1 : 0,
      sp: this.actors.map((x) => Math.round(Math.min(1, x.special) * 100)),
      st: this.actors.map((x) => [x.stats.cells, x.stats.inks, x.stats.outs, x.stats.stamps]),
    };
  }

  _applyScore(m) {
    this.score = { a: m.a, b: m.b, tot: m.tot };
    this.timeLeft = m.t;
    if (m.od && !this.overdrive) { this.overdrive = true; this.fx.overdrive?.(); }
    m.sp?.forEach((v, i) => { if (this.actors[i]) this.actors[i].special = v / 100; });
    m.st?.forEach((v, i) => { const a = this.actors[i]; if (a) { a.stats.cells = v[0]; a.stats.inks = v[1]; a.stats.outs = v[2]; a.stats.stamps = v[3]; } });
  }

  // =========================================================
  // 弾
  // =========================================================
  /** ローカルの選手(自分 / CPU)が撃つ */
  fire(actor, target) {
    if (!actor.alive || actor.out || actor.fireCD > 0 || this.phase !== 'play') return false;
    if (this.mode === 'tag') return false;
    actor.fireCD = CB.fireInterval;
    const o = actor.muzzle(_a);
    const d = _b.subVectors(target, o).normalize();
    // ほんの少しばらける
    d.x += (Math.random() - 0.5) * 0.025; d.y += (Math.random() - 0.5) * 0.025; d.z += (Math.random() - 0.5) * 0.025;
    d.normalize();
    this._spawnShot(actor, o, d, this.isHost);
    this.outgoingShots.push({ i: actor.idx, s: [...vec(o), Math.round(d.x * 1000) / 1000, Math.round(d.y * 1000) / 1000, Math.round(d.z * 1000) / 1000] });
    actor.model.fire();
    this.fx.shotFired?.(actor);
    return true;
  }

  _onShots(m, from) {
    const a = this.actors[m.i];
    if (!a || a.isLocal || !this._ownerOk(a, from)) return;
    for (const s of m.s || []) {
      _a.set(s[0], s[1], s[2]);
      _b.set(s[3], s[4], s[5]).normalize();
      this._spawnShot(a, _a, _b, this.isHost);
      a.model.fire();
    }
  }

  _spawnShot(actor, origin, dir, auth) {
    this.shots.push({
      owner: actor, team: actor.team, pos: origin.clone(), prev: origin.clone(),
      vel: dir.clone().multiplyScalar(CB.shotSpeed), life: CB.shotRange / CB.shotSpeed, auth,
      color: actor.color,
    });
  }

  _updateShots(dt) {
    const ar = this.arena;
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i];
      s.life -= dt;
      s.prev.copy(s.pos);
      const step = s.vel.length() * dt;
      _seg.copy(s.vel).normalize();
      let done = s.life <= 0;
      // 選手に当たったか
      if (!done) {
        for (const o of this.actors) {
          if (o === s.owner || !o.alive || o.out || o.team === s.team) continue;
          const t = segSphere(s.pos, _seg, step, o.pos, 0.6);
          if (t !== null) {
            done = true;
            s.pos.addScaledVector(_seg, t);
            this.fx.splat?.(s.pos, _seg.clone().negate(), s.color, 0.7);
            if (s.auth) this._damage(o, s.owner, CB.shotDamage);
            else this.fx.hitConfirm?.(s.owner, o);
            break;
          }
        }
      }
      if (!done) {
        const hit = ar.raycast(s.pos, _seg, step);
        if (hit) {
          done = true;
          s.pos.copy(hit.point);
          const r = CB.shotSplat * (this.overdrive ? CB.overdriveMul : 1);
          this._paint(hit.point, r, s.team, s.owner, s.auth, 0.6);
          this.fx.splat?.(hit.point, hit.normal, s.color, 1);
        } else s.pos.addScaledVector(_seg, step);
      }
      if (done) this.shots.splice(i, 1);
    }
  }

  /** 塗る。ホストなら差分を送る。参加者は見た目だけ先に塗る */
  _paint(center, radius, team, actor, auth, fresh = 1) {
    if (this.mode === 'tag' || !team) return;
    const changed = this.arena.paintSphere(center, radius, team);
    if (!changed.length) return;
    if (auth && this.isHost) {
      for (const c of changed) { this.pendingCells.push(c); this.pendingOwners.push(team); }
      if (actor) {
        actor.stats.cells += changed.length;
        actor.special = Math.min(1, actor.special + changed.length / CB.specialCost);
      }
    }
  }

  _damage(victim, attacker, amount) {
    if (!this.isHost || victim.shield > 0 || !victim.alive || this.phase !== 'play') return;
    victim.hp = Math.max(0, victim.hp - amount);
    this.net.send({ k: 'hp', i: victim.idx, hp: victim.hp });
    this.fx.hit?.(victim, attacker);
    if (victim === this.me) this.fx.myHp?.(victim.hp);
    if (victim.hp <= 0) this._inkout(victim, attacker);
  }

  _inkout(victim, attacker) {
    const m = { k: 'out', i: victim.idx, by: attacker ? attacker.idx : -1, p: vec(victim.pos) };
    this.net.send(m);
    this._onOut(m);
    if (attacker) this._paint(victim.pos, 2.2, attacker.team, attacker, true);
  }

  _onOut(m) {
    const v = this.actors[m.i];
    if (!v) return;
    const by = this.actors[m.by];
    if (v.alive) {
      v.alive = false;
      v.model.visible = false;
      v.respawnT = CB.respawnTime;
      v.holding = false;
      this.deadUntil.set(v.idx, performance.now() / 1000 + CB.respawnTime - 0.4);
      if (this.isHost) { v.stats.outs++; if (by) by.stats.inks++; }
      this.fx.inkout?.(v, by);
    }
  }

  // =========================================================
  // 重力 / スタンプ / スペシャル / 押し出し
  // =========================================================
  /** 自分が面をねらって重力を切り替える */
  flip(actor, newGravity) {
    if (!actor.alive || actor.out || (this.phase !== 'play' && this.mode !== 'training')) return false;
    if (!actor.setGravity(newGravity)) return false;
    this.fx.flip?.(actor);
    return true;
  }

  botFlip(actor, g) { return this.flip(actor, g); }

  /** 着地したとき(ローカルの選手) */
  landed(actor, impact) {
    this.fx.land?.(actor, impact);
    if (impact < PH.stampSpeed || this.phase !== 'play' || this.mode === 'tag') return;
    const n = actor.up.clone();
    const p = actor.pos.clone().addScaledVector(n, -PH.radius);
    const m = { k: 'stamp', i: actor.idx, p: vec(p), n: [n.x, n.y, n.z] };
    this.net.send(m);
    this._onStamp(m, this.net.selfId);
  }

  _onStamp(m, from) {
    const a = this.actors[m.i];
    if (!a || (from !== this.net.selfId && !this._ownerOk(a, from))) return;
    const p = new THREE.Vector3().fromArray(m.p), n = new THREE.Vector3().fromArray(m.n);
    this.fx.stamp?.(a, p, n);
    if (!this.isHost) { this._paint(p, CB.stampRadius, a.team, a, false); return; }
    a.stats.stamps++;
    this._paint(p, CB.stampRadius * (this.overdrive ? 1.25 : 1), a.team, a, true);
    for (const o of this.actors) {
      if (o.team === a.team || !o.alive || o.shield > 0) continue;
      if (o.pos.distanceTo(p) < CB.stampKillRadius) this._damage(o, a, 999);
    }
  }

  throwBomb(actor) {
    if (actor.special < 1 || !actor.alive || this.phase !== 'play' || this.mode === 'tag') return false;
    const o = actor.muzzle(_a).clone();
    const v = actor.aim.clone().multiplyScalar(20).addScaledVector(actor.up, 5);
    const m = { k: 'bomb', i: actor.idx, o: vec(o), v: vec(v), g: gravityIndex(actor.gravity) };
    actor.special = 0;
    this.net.send(m);
    this._onBomb(m, this.net.selfId, true);
    return true;
  }

  _onBomb(m, from, local = false) {
    const a = this.actors[m.i];
    if (!a || (!local && !this._ownerOk(a, from))) return;
    if (this.isHost) a.special = 0;
    this.bombs.push({ owner: a, pos: new THREE.Vector3().fromArray(m.o), vel: new THREE.Vector3().fromArray(m.v), g: GRAVITY_DIRS[m.g].clone(), life: 3, auth: this.isHost });
    this.fx.bombThrown?.(a);
  }

  _updateBombs(dt) {
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      const b = this.bombs[i];
      b.life -= dt;
      b.vel.addScaledVector(b.g, PH.gravity * 0.8 * dt);
      const step = b.vel.length() * dt;
      _seg.copy(b.vel).normalize();
      const hit = this.arena.raycast(b.pos, _seg, step + 0.2);
      if (hit || b.life <= 0) {
        const p = hit ? hit.point : b.pos;
        this.fx.bombBoom?.(p, b.owner.color);
        if (b.auth) {
          this._paint(p, CB.bombRadius, b.owner.team, b.owner, true);
          for (const o of this.actors) {
            if (o.team === b.owner.team || !o.alive) continue;
            if (o.pos.distanceTo(p) < CB.bombFlipRadius) {
              const m = { k: 'flip', i: o.idx, g: gravityIndex(o.gravity.clone().negate()) };
              this.net.send(m);
              this._onForcedFlip(m);
              this._damage(o, b.owner, 50);
            }
          }
        } else this._paint(p, CB.bombRadius, b.owner.team, b.owner, false);
        this.bombs.splice(i, 1);
      } else b.pos.addScaledVector(b.vel, dt);
    }
  }

  _onForcedFlip(m) {
    const a = this.actors[m.i];
    if (!a || !a.isLocal) return;
    a.setGravity(GRAVITY_DIRS[m.g], true);
    this.fx.flip?.(a, true);
  }

  shove(actor) {
    if (this.mode !== 'tag' || !actor.alive || actor.out || (actor.shoveCD || 0) > 0 || this.phase !== 'play') return false;
    actor.shoveCD = CONFIG.tag.shoveCooldown;
    const m = { k: 'shove', i: actor.idx, p: vec(actor.pos) };
    this.net.send(m);
    this._onShove(m, this.net.selfId, true);
    return true;
  }

  _onShove(m, from, local = false) {
    const a = this.actors[m.i];
    if (!a || (!local && !this._ownerOk(a, from))) return;
    const p = new THREE.Vector3().fromArray(m.p);
    this.fx.shove?.(a, p);
    if (!this.isHost) return;
    for (const o of this.actors) {
      if (o === a || !o.alive || o.out) continue;
      const d = o.pos.distanceTo(p);
      if (d > 3) continue;
      const v = o.pos.clone().sub(p).normalize().multiplyScalar(CONFIG.tag.shoveForce).addScaledVector(o.up, 4);
      if (o.isLocal) o.vel.add(v);
      else this.net.send({ k: 'knock', i: o.idx, v: vec(v) });
    }
  }

  // =========================================================
  // ばくだん鬼(ホスト)
  // =========================================================
  _tagWave() {
    const alive = this.actors.filter((a) => !a.out);
    for (const a of this.actors) a.holding = false;
    const n = alive.length >= 6 ? 2 : 1;
    const pool = [...alive].sort(() => Math.random() - 0.5);
    const holders = pool.slice(0, n).map((a) => a.idx);
    const m = { k: 'tag', holders, fuse: CONFIG.tag.fuse, wave: ++this.tag.wave };
    this.net.send(m);
    this._applyTag(m);
  }

  _applyTag(m) {
    for (const a of this.actors) a.holding = m.holders.includes(a.idx);
    this.tag.fuse = m.fuse;
    this.tag.wave = m.wave;
    this.tag.lastPass = new Map();
    this.fx.tagWave?.(m);
  }

  _updateTag(dt) {
    this.tag.fuse -= dt;
    if (!this.isHost) return;
    const now = performance.now() / 1000;
    for (const h of this.actors.filter((a) => a.holding && !a.out)) {
      for (const o of this.actors) {
        if (o === h || o.holding || o.out || !o.alive) continue;
        if (o.pos.distanceTo(h.pos) > 1.35) continue;
        const back = this.tag.lastPass.get(o.idx);
        if (back && back.to === h.idx && now - back.t < CONFIG.tag.passCooldown) continue;
        const m = { k: 'pass', from: h.idx, to: o.idx };
        this.net.send(m);
        this._applyPass(m);
        this.tag.lastPass.set(h.idx, { to: o.idx, t: now });
        break;
      }
    }
    if (this.tag.fuse <= 0) {
      for (const h of this.actors.filter((a) => a.holding && !a.out)) {
        const m = { k: 'boom', i: h.idx };
        this.net.send(m);
        this._applyBoom(m);
      }
      const left = this.actors.filter((a) => !a.out);
      if (left.length <= 1) this._endMatch();
      else { this.tag.fuse = 99; this._later(2.2, () => { if (this.phase === 'play') this._tagWave(); }); }
    }
  }

  _applyPass(m) {
    const f = this.actors[m.from], t = this.actors[m.to];
    if (f) f.holding = false;
    if (t) t.holding = true;
    this.fx.pass?.(f, t);
  }

  _applyBoom(m) {
    const a = this.actors[m.i];
    if (!a || a.out) return;
    a.out = true;
    a.alive = false;
    a.holding = false;
    a.model.visible = false;
    this.tag.order.push(a.idx);
    this.fx.boom?.(a);
  }

  // =========================================================
  // 進行
  // =========================================================
  _later(sec, fn) { (this._timers ||= []).push({ t: sec, fn }); }

  /** ホストが試合を始める(全員の読み込み後) */
  hostBegin() {
    if (!this.isHost) return;
    this.round = 0;
    if (this.mode === 'training') { this._spawnAll(); this._setPhase({ phase: 'play', round: 1, t: 0 }); }
    else this._nextRound();
  }

  _nextRound() {
    this.round++;
    this._setPhase({ phase: 'countdown', round: this.round, t: 3, wins: this.wins });
    this._later(3, () => {
      this._setPhase({ phase: 'play', round: this.round, t: this.mode === 'tag' ? 0 : this.duration });
      if (this.mode === 'tag') this._tagWave();
    });
  }

  _setPhase(m) {
    m.k = 'phase';
    this.net.send(m);
    this._applyPhase(m);
  }

  _applyPhase(m) {
    const prev = this.phase;
    this.phase = m.phase;
    this.phaseT = 0;
    if (m.wins) this.wins = m.wins.slice();
    if (m.phase === 'countdown') {
      this.round = m.round;
      this.timeLeft = this.duration;
      this.overdrive = false;
      if (m.round > 1 || prev === 'roundEnd') this._resetRound();
      else this._spawnAll();
    }
    if (m.phase === 'play' && m.t) this.timeLeft = m.t;
    this.fx.phase?.(m, prev);
  }

  _resetRound() {
    this.arena.reset();
    this.shots.length = 0;
    this.bombs.length = 0;
    for (const a of this.actors) { a.special = 0; a.hp = CB.hp; }
    this._spawnAll();
  }

  /** 出撃地点(全員が同じ計算をする) */
  spawnPoint(a) {
    const def = this.arena.def;
    if (this.mode === 'tag') {
      const s = def.ffaSpawns[a.idx % def.ffaSpawns.length];
      const g = s[3] === 'up' ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, -1, 0);
      return { pos: new THREE.Vector3(s[0], s[1], s[2]), g, aim: new THREE.Vector3(-s[0], 0, -s[2]).normalize() };
    }
    const key = a.team === 2 ? 'B' : 'A';
    const list = def.spawns[key];
    const sameTeam = this.actors.filter((x) => x.team === a.team);
    const k = Math.max(0, sameTeam.indexOf(a)) % list.length;
    return { pos: new THREE.Vector3(...list[k]), g: new THREE.Vector3(0, -1, 0), aim: new THREE.Vector3(...def.spawnFacing[key]) };
  }

  _spawnAll() {
    for (const a of this.actors) {
      a.out = false;
      a.holding = false;
      if (a.isLocal) {
        const s = this.spawnPoint(a);
        a.spawn(s.pos, s.g, s.aim);
        this.fx.respawn?.(a);
      } else { a.alive = true; a.hp = CB.hp; }
    }
    // 出撃地点はチームの色で少し塗っておく
    if (this.mode === 'turf' || this.mode === 'training') {
      for (const key of ['A', 'B']) {
        const team = key === 'A' ? 1 : 2;
        if (!this.actors.some((x) => x.team === team)) continue;
        const sp = this.arena.def.spawns[key];
        const mid = new THREE.Vector3(sp[0][0], 0, 0);
        this.arena.paintSphere(mid, 3.2, team);
      }
    }
  }

  _endRound() {
    const a = this.arena.counts[1], b = this.arena.counts[2];
    const winner = a > b ? 1 : b > a ? 2 : 0;
    if (winner) this.wins[winner]++;
    this.roundLog.push({ a, b, tot: this.arena.paintable, winner });
    this._setPhase({ phase: 'roundEnd', round: this.round, wins: this.wins, a, b, winner, tot: this.arena.paintable });
    // 最終ラウンド前に勝負が決まったら終了
    const need = Math.floor(this.rounds / 2) + 1;
    const decided = this.wins[1] >= need || this.wins[2] >= need;
    this._later(4.5, () => {
      if (this.round >= this.rounds || decided) this._endMatch();
      else this._nextRound();
    });
  }

  _endMatch() {
    if (!this.isHost || this.ended) return;
    const results = this.results();
    this.net.send({ k: 'end', results });
    this._finish(results);
  }

  _finish(results) {
    if (this.ended) return;
    this.ended = true;
    this.phase = 'end';
    this.fx.end?.(results);
  }

  results() {
    const players = this.actors.map((a) => ({ idx: a.idx, name: a.name, team: a.team, bot: a.isBot, color: a.color, ...a.stats }));
    if (this.mode === 'tag') {
      const alive = this.actors.filter((a) => !a.out);
      return { mode: 'tag', winner: alive[0]?.idx ?? -1, order: [...this.tag.order], players };
    }
    if (this.mode === 'challenge') {
      return { mode: 'challenge', score: this.arena.counts[1], tot: this.arena.paintable, players };
    }
    let winner = this.wins[1] > this.wins[2] ? 1 : this.wins[2] > this.wins[1] ? 2 : 0;
    if (!winner) {
      const ta = this.roundLog.reduce((s, r) => s + r.a, 0), tb = this.roundLog.reduce((s, r) => s + r.b, 0);
      winner = ta > tb ? 1 : tb > ta ? 2 : 0;
    }
    return { mode: this.mode, winner, wins: this.wins, rounds: this.roundLog, players, owners: Array.from(this.arena.owner) };
  }

  /** 参加者が抜けた → その選手は CPU が引き継ぐ(ホスト) */
  userLeft(userId) {
    const a = this.byUser.get(userId);
    if (!a || !this.isHost) return;
    a.isBot = true;
    a.isLocal = true;
    a.userId = null;
    a.name = `${a.name} (CPU)`;
    a.model.setName(a.name);
    a.brain = new Bot(a, this, { kind: this.mode === 'tag' ? 'tag' : 'turf' });
    if (!a.alive && !a.out) a.respawnT = 1;
  }

  // =========================================================
  // 毎フレーム
  // =========================================================
  update(dt, now) {
    this.phaseT += dt;
    if (this._timers) {
      for (let i = this._timers.length - 1; i >= 0; i--) {
        const t = this._timers[i];
        t.t -= dt;
        if (t.t <= 0) { this._timers.splice(i, 1); t.fn(); }
      }
    }

    // 時間
    if (this.phase === 'play') {
      if (this.mode === 'turf' || this.mode === 'challenge') {
        this.timeLeft = Math.max(0, this.timeLeft - dt);
        if (this.mode === 'turf' && !this.overdrive && this.timeLeft <= CONFIG.turf.overdrive) {
          this.overdrive = true;
          this.fx.overdrive?.();
        }
        if (this.isHost && this.timeLeft <= 0) {
          if (this.mode === 'challenge') this._endMatch();
          else this._endRound();
        }
      }
      if (this.mode === 'tag') this._updateTag(dt);
    }

    // CPU
    const canMove = this.phase === 'play' || this.mode === 'training';
    for (const a of this.actors) {
      if (!a.isLocal) { a.interpolate(now); a.model.visible = a.alive && !a.out && a.buf.length > 0; continue; }
      a.fireCD -= dt;
      a.shoveCD = (a.shoveCD || 0) - dt;
      if (!a.alive) {
        if (a.out) continue;
        a.respawnT -= dt;
        if (a.respawnT <= 0) {
          const s = this.spawnPoint(a);
          a.spawn(s.pos, s.g, s.aim);
          this.fx.respawn?.(a);
        }
        continue;
      }
      if (a.brain && canMove) {
        a.brain.update(dt);
        if (a.brain.fireWant) {
          const t = _b.copy(a.pos).addScaledVector(a.aim, 20);
          const hit = this.arena.raycast(a.pos, a.aim, 30);
          this.fire(a, hit ? hit.point : t);
        }
      }
      if (a.brain || a === this.me) {
        if (!canMove) { a.ctrl.moveX = 0; a.ctrl.moveY = 0; a.ctrl.jump = false; }
        const basis = a.brain ? a.brain.basis : this.meBasis;
        if (!basis) continue;
        const mul = this._speedMul(a);
        const land = a.simulate(dt, basis, this.arena, mul);
        if (land) this.landed(a, land.landed);
      }
    }

    // ホスト: 足元の塗り(全員ぶん)
    if (this.isHost && this.phase === 'play' && this.mode !== 'tag') {
      this.timers.roller -= dt;
      if (this.timers.roller <= 0) {
        this.timers.roller = 0.1;
        const r = CB.rollerRadius * (this.overdrive ? CB.overdriveMul : 1);
        for (const a of this.actors) {
          if (!a.alive || !a.grounded || a.speed01 < 0.12) continue;
          _a.copy(a.pos).addScaledVector(a.up, -PH.radius);
          this._paint(_a, r, a.team, a, true, 0.3);
        }
      }
    }

    this._updateShots(dt);
    this._updateBombs(dt);
    this.arena.update(dt);
    for (const a of this.actors) a.updateModel(dt);
    if (this.isHost) this._scoreLocal();
    this._sendNet(dt);
  }

  _scoreLocal() {
    this.score = { a: this.arena.counts[1], b: this.arena.counts[2], tot: this.arena.paintable };
  }

  _speedMul(a) {
    if (this.mode === 'tag') return a.holding ? 1.08 : 1;
    if (!a.grounded) return 1;
    _a.copy(a.pos).addScaledVector(a.up, -PH.radius - 0.02);
    const o = this.arena.ownerAt(_a, a.up);
    if (o === a.team) return PH.ownInkBoost;
    if (o && o !== a.team) return PH.enemyInkSlow;
    return 1;
  }

  dispose(scene) {
    this.unsubs?.forEach((f) => f());
    for (const a of this.actors) { scene.remove(a.model); a.dispose(); }
    scene.remove(this.arena.group);
    this.arena.dispose();
  }
}

/** 線分(origin + dir * t, 0<=t<=len)と球の交差 */
function segSphere(o, d, len, c, r) {
  const ox = o.x - c.x, oy = o.y - c.y, oz = o.z - c.z;
  const b = ox * d.x + oy * d.y + oz * d.z;
  const cc = ox * ox + oy * oy + oz * oz - r * r;
  const disc = b * b - cc;
  if (disc < 0) return null;
  const t = -b - Math.sqrt(disc);
  if (t < 0 || t > len) return cc < 0 ? 0 : null;
  return t;
}
