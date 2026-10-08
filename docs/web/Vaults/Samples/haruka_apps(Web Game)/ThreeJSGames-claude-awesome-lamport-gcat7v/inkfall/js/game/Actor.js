// =========================================================
// Actor — プレイヤー / CPU / ほかのプレイヤー 共通の選手
//  ・ローカル(自分 or ホストが動かす CPU): 物理シミュレーション
//  ・リモート: 受け取った状態を 100ms 遅らせて補間
// =========================================================
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { Robot } from './Robot.js';
import { dampFactor } from '../core/Tween.js';

const P = CONFIG.physics;
const _w = new THREE.Vector3(), _vt = new THREE.Vector3(), _t = new THREE.Vector3(), _x = new THREE.Vector3();
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion();

export const GRAVITY_DIRS = [
  new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 1),
];
export function gravityIndex(v) {
  let best = 0, bd = -2;
  GRAVITY_DIRS.forEach((g, i) => { const d = g.dot(v); if (d > bd) { bd = d; best = i; } });
  return best;
}

export class Actor {
  constructor({ idx, team = 1, color, name = '', isBot = false, isLocal = false, userId = null }) {
    this.idx = idx;
    this.team = team;
    this.name = name;
    this.isBot = isBot;
    this.isLocal = isLocal;      // このマシンで物理を計算するか
    this.userId = userId;
    this.color = color;
    this.model = new Robot(color, { name, showName: !isLocal || isBot });
    this.model.visible = false; // 出撃するまでは見せない
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.gravity = new THREE.Vector3(0, -1, 0);
    this.up = new THREE.Vector3(0, 1, 0);
    this.aim = new THREE.Vector3(0, 0, 1);
    this.modelUp = new THREE.Vector3(0, 1, 0);
    this.hp = CONFIG.combat.hp;
    this.alive = true;
    this.out = false;            // ばくだん鬼で脱落
    this.respawnT = 0;
    this.shield = 0;
    this.flipCD = 0;
    this.grounded = false;
    this.groundNormal = null;
    this.coyote = 0;
    this.jumpBuf = 0;
    this.jumping = false;
    this.fallSpeed = 0;
    this.speed01 = 0;
    this.firing = false;
    this.fireCD = 0;
    this.special = 0;
    this.holding = false;        // ばくだんを持っている
    this.stats = { cells: 0, inks: 0, outs: 0, stamps: 0 };
    this.contact = {};
    this.buf = [];               // リモート補間用
    this.lastRecv = 0;
    this.ctrl = { moveX: 0, moveY: 0, jump: false, jumpHeld: false };
  }

  spawn(pos, gravity, aim) {
    this.pos.copy(pos);
    this.vel.set(0, 0, 0);
    this.gravity.copy(gravity).normalize();
    this.up.copy(this.gravity).negate();
    this.modelUp.copy(this.up);
    if (aim) this.aim.copy(aim).normalize();
    this.hp = CONFIG.combat.hp;
    this.alive = true;
    this.shield = CONFIG.combat.spawnShield;
    this.flipCD = 0;
    this.grounded = false;
    this.buf.length = 0;
    this.model.visible = true;
    this.model.position.copy(pos);
    this._orient(1);
  }

  setGravity(dir, force = false) {
    if (!force && this.flipCD > 0) return false;
    if (dir.dot(this.gravity) > 0.99) return false;
    this.gravity.copy(dir).normalize();
    this.up.copy(this.gravity).negate();
    this.vel.multiplyScalar(P.flipDamp);
    this.grounded = false;
    this.coyote = 0;
    this.jumping = false;
    if (!force) this.flipCD = P.flipCooldown;
    return true;
  }

  /**
   * 物理シミュレーション(自分 / CPU)
   * @returns {{landed:number}|null} 着地したら衝撃の速さ
   */
  simulate(dt, basis, arena, speedMul = 1) {
    const c = this.ctrl;
    const up = this.up;
    this.flipCD -= dt;
    this.coyote -= dt;
    this.jumpBuf -= dt;
    this.shield -= dt;
    if (c.jump) this.jumpBuf = P.jumpBuffer;

    _w.set(0, 0, 0).addScaledVector(basis.right, c.moveX).addScaledVector(basis.forward, c.moveY);
    _w.addScaledVector(up, -_w.dot(up));
    const mag = Math.min(1, Math.hypot(c.moveX, c.moveY));
    const wl = _w.length();
    if (wl > 1e-4) _w.multiplyScalar(mag / wl);

    let vUp = this.vel.dot(up);
    _vt.copy(this.vel).addScaledVector(up, -vUp);
    const target = _t.copy(_w).multiplyScalar(P.moveSpeed * speedMul);
    const accel = this.grounded ? (mag > 0.05 ? P.accelGround : P.friction) : P.accelAir;
    const diff = target.sub(_vt);
    const dl = diff.length(), step = accel * dt;
    if (dl > step) diff.multiplyScalar(step / dl);
    _vt.add(diff);

    vUp -= P.gravity * dt;
    if (vUp < -P.maxFall) vUp = -P.maxFall;
    if (this.jumpBuf > 0 && this.coyote > 0) {
      vUp = P.jumpSpeed; this.jumpBuf = 0; this.coyote = 0; this.jumping = true; this.grounded = false;
      this.onJump?.();
    }
    if (this.jumping && !c.jumpHeld && vUp > 0) { vUp *= 0.55; this.jumping = false; }
    if (vUp <= 0) this.jumping = false;
    this.vel.copy(_vt).addScaledVector(up, vUp);
    const impact = Math.max(0, -vUp);
    this.fallSpeed = impact;

    const was = this.grounded;
    const steps = Math.max(1, Math.ceil(dt / P.substep));
    const h = dt / steps;
    let grounded = false;
    for (let i = 0; i < steps; i++) {
      this.pos.addScaledVector(this.vel, h);
      arena.collideSphere(this.pos, P.radius, this.vel, up, this.contact);
      if (this.contact.grounded) { grounded = true; this.groundNormal = this.contact.groundNormal; }
    }
    this.grounded = grounded;
    let landed = null;
    if (grounded) {
      this.coyote = P.coyoteTime;
      if (!was) landed = { landed: impact };
    }
    _vt.copy(this.vel).addScaledVector(up, -this.vel.dot(up));
    this.speed01 = Math.min(1, _vt.length() / P.moveSpeed);
    return landed;
  }

  // ---------- リモート ----------
  pushState(s, now) {
    this.buf.push({ t: now, ...s });
    if (this.buf.length > 12) this.buf.shift();
    this.lastRecv = now;
  }

  interpolate(now) {
    const b = this.buf;
    if (!b.length) return;
    const rt = now - 0.1;
    let a = b[0], c = b[b.length - 1];
    for (let i = 0; i < b.length - 1; i++) {
      if (b[i].t <= rt && b[i + 1].t >= rt) { a = b[i]; c = b[i + 1]; break; }
    }
    const last = b[b.length - 1];
    if (rt >= last.t) {
      const ex = Math.min(0.15, rt - last.t);
      this.pos.set(last.px + last.vx * ex, last.py + last.vy * ex, last.pz + last.vz * ex);
      this._applyMeta(last);
    } else if (rt <= b[0].t) {
      this.pos.set(b[0].px, b[0].py, b[0].pz);
      this._applyMeta(b[0]);
    } else {
      const k = (rt - a.t) / Math.max(1e-4, c.t - a.t);
      this.pos.set(a.px + (c.px - a.px) * k, a.py + (c.py - a.py) * k, a.pz + (c.pz - a.pz) * k);
      this._applyMeta(k < 0.5 ? a : c);
      this.aim.set(a.ax + (c.ax - a.ax) * k, a.ay + (c.ay - a.ay) * k, a.az + (c.az - a.az) * k).normalize();
      return;
    }
  }

  _applyMeta(s) {
    this.vel.set(s.vx, s.vy, s.vz);
    if (s.g !== undefined) { this.gravity.copy(GRAVITY_DIRS[s.g]); this.up.copy(this.gravity).negate(); }
    this.aim.set(s.ax, s.ay, s.az).normalize();
    this.grounded = !!(s.flags & 1);
    this.firing = !!(s.flags & 2);
    this.speed01 = Math.min(1, Math.hypot(s.vx, s.vy, s.vz) / P.moveSpeed) * (this.grounded ? 1 : 0.3);
  }

  // ---------- 見た目 ----------
  _orient(k) {
    const up = this.modelUp;
    const f = _t.copy(this.aim).addScaledVector(up, -this.aim.dot(up));
    if (f.lengthSq() < 1e-4) f.set(1, 0, 0).addScaledVector(up, -up.x);
    f.normalize();
    _x.crossVectors(up, f).normalize();
    _m.makeBasis(_x, up, f);
    _q.setFromRotationMatrix(_m);
    this.model.quaternion.slerp(_q, k >= 1 ? 1 : Math.min(1, dampFactor(16, k)));
  }

  updateModel(dt) {
    if (!this.alive) return;
    this.model.position.copy(this.pos);
    this.modelUp.lerp(this.up, dampFactor(10, dt)).normalize();
    this._orient(dt);
    const pitch = Math.asin(THREE.MathUtils.clamp(this.aim.dot(this.up), -1, 1));
    this.model.update(dt, { speed: this.grounded ? this.speed01 : 0.2, grounded: this.grounded, pitch });
    // 無敵中はちかちか
    this.model.root.visible = this.shield > 0 ? Math.sin(performance.now() * 0.03) > -0.3 : true;
  }

  /** ブラスターの先端(ワールド座標) */
  muzzle(out = new THREE.Vector3()) {
    this.model.updateMatrixWorld(true);
    return this.model.muzzle.getWorldPosition(out);
  }

  dispose() { this.model.dispose(); }
}
