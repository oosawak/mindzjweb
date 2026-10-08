// =========================================================
// Player — ころりんの うごき(じゅうりょく きりかえ つき)
// =========================================================
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { Kororin } from './Kororin.js';
import { dampFactor } from '../core/Tween.js';

const P = CONFIG.physics;
const _wish = new THREE.Vector3();
const _vt = new THREE.Vector3();
const _tmp = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _x = new THREE.Vector3();

export class Player {
  constructor(level) {
    this.level = level;
    this.model = new Kororin();
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.gravity = new THREE.Vector3(0, -1, 0);
    this.up = new THREE.Vector3(0, 1, 0);
    this.facing = new THREE.Vector3(0, 0, -1);
    this.grounded = false;
    this.ground = null;
    this.coyote = 0;
    this.jumpBuf = 0;
    this.jumping = false;
    this.switchCD = 0;
    this.groundTime = 0;
    this.airTime = 0;
    this.hazardCD = 0;
    this.lastSafe = { pos: new THREE.Vector3(), gravity: new THREE.Vector3(0, -1, 0) };
    this.contact = {};
    this.speed01 = 0;
    this.fallSpeed = 0;
    this.frozen = false;
    // コールバック(GameScene が設定)
    this.on = {};
  }

  spawn(pos, gravity, facing) {
    this.pos.copy(pos);
    this.vel.set(0, 0, 0);
    this.gravity.copy(gravity).normalize();
    this.up.copy(this.gravity).negate();
    if (facing) this.facing.copy(facing);
    this._fixFacing();
    this.grounded = false;
    this.jumping = false;
    this.switchCD = 0;
    this.lastSafe.pos.copy(pos);
    this.lastSafe.gravity.copy(this.gravity);
    this._orientModel(1);
    this.model.position.copy(this.pos);
  }

  /** じゅうりょくを きりかえる。成功したら true */
  setGravity(dir) {
    if (this.switchCD > 0) return false;
    if (dir.dot(this.gravity) > 0.99) return false;
    this.gravity.copy(dir).normalize();
    this.up.copy(this.gravity).negate();
    this.vel.multiplyScalar(P.switchDamp);
    this.grounded = false;
    this.coyote = 0;
    this.jumping = false;
    this.switchCD = P.switchCooldown;
    this._fixFacing();
    return true;
  }

  _fixFacing() {
    // facing を いまの「ゆか」に そわせる
    this.facing.addScaledVector(this.up, -this.facing.dot(this.up));
    if (this.facing.lengthSq() < 1e-4) {
      // 真上/真下を向いてしまったら、適当な直交ベクトル
      this.facing.set(1, 0, 0).addScaledVector(this.up, -this.up.x);
      if (this.facing.lengthSq() < 1e-4) this.facing.set(0, 0, 1).addScaledVector(this.up, -this.up.z);
    }
    this.facing.normalize();
  }

  /**
   * @param {number} dt
   * @param {import('../core/Input.js').Input} input
   * @param {{forward:THREE.Vector3, right:THREE.Vector3}} basis カメラ基準の前/右
   */
  update(dt, input, basis, { easy = false } = {}) {
    const up = this.up;
    this.switchCD -= dt;
    this.coyote -= dt;
    this.jumpBuf -= dt;
    this.hazardCD -= dt;

    if (this.frozen) {
      this.model.update(dt, { speed: 0, grounded: true });
      this._orientModel(dampFactor(10, dt));
      return;
    }

    if (input.jump) this.jumpBuf = P.jumpBuffer;

    // 動く床に のっていたら いっしょに動く
    if (this.grounded && this.ground?.kind === 'mover') this.pos.add(this.ground.mover.delta);

    // 入力 → 地面に そった方向
    _wish.set(0, 0, 0)
      .addScaledVector(basis.right, input.move.x)
      .addScaledVector(basis.forward, input.move.y);
    _wish.addScaledVector(up, -_wish.dot(up));
    const wl = _wish.length();
    const inputMag = Math.min(1, Math.hypot(input.move.x, input.move.y));
    if (wl > 1e-4) _wish.multiplyScalar(inputMag / wl);

    let vUp = this.vel.dot(up);
    _vt.copy(this.vel).addScaledVector(up, -vUp);

    const target = _tmp.copy(_wish).multiplyScalar(P.moveSpeed * (easy ? 0.92 : 1));
    const accel = this.grounded ? (inputMag > 0.05 ? P.accelGround : P.friction) : P.accelAir;
    const diff = target.sub(_vt);
    const dl = diff.length();
    const maxStep = accel * dt;
    if (dl > maxStep) diff.multiplyScalar(maxStep / dl);
    _vt.add(diff);

    // じゅうりょく
    vUp -= P.gravity * dt;
    if (vUp < -P.maxFall) vUp = -P.maxFall;

    // ジャンプ
    if (this.jumpBuf > 0 && this.coyote > 0) {
      vUp = P.jumpSpeed;
      this.jumpBuf = 0;
      this.coyote = 0;
      this.jumping = true;
      this.grounded = false;
      this.on.jump?.();
    }
    if (this.jumping && !input.jumpHeld && vUp > 0) { vUp *= 0.5; this.jumping = false; }
    if (vUp <= 0) this.jumping = false;

    this.vel.copy(_vt).addScaledVector(up, vUp);
    const impact = Math.max(0, -vUp);
    this.fallSpeed = impact;

    // サブステップで移動 + あたり判定
    const wasGrounded = this.grounded;
    const steps = Math.max(1, Math.ceil(dt / P.substep));
    const h = dt / steps;
    let grounded = false, ground = null, hazard = null, hazardNormal = null;
    for (let i = 0; i < steps; i++) {
      this.pos.addScaledVector(this.vel, h);
      this.level.collideSphere(this.pos, P.radius, this.vel, up, this.contact);
      if (this.contact.grounded) { grounded = true; ground = this.contact.ground; }
      if (this.contact.hazard) { hazard = this.contact.hazard; hazardNormal = this.contact.hazardNormal; }
    }
    this.grounded = grounded;
    this.ground = ground;

    if (grounded) {
      this.coyote = P.coyoteTime;
      if (!wasGrounded) this.on.land?.(impact, ground);
      this.airTime = 0;
    } else {
      this.airTime += dt;
    }

    if (ground?.kind === 'crumble' && this.level.touchCrumble(ground)) this.on.crumble?.(ground);

    if (hazard && this.hazardCD <= 0) {
      this.hazardCD = 0.5;
      if (easy) {
        this.vel.copy(hazardNormal).multiplyScalar(P.hazardKnock).addScaledVector(up, 4);
        this.grounded = false;
      }
      this.on.hazard?.(hazard, hazardNormal);
    }

    // 安全な場所を記録(リスポーン用)
    if (grounded && ground.kind === 'static' && !ground.hazard) {
      this.groundTime += dt;
      if (this.groundTime > 0.3) {
        this.lastSafe.pos.copy(this.pos).addScaledVector(up, 0.05);
        this.lastSafe.gravity.copy(this.gravity);
      }
    } else {
      this.groundTime = 0;
    }

    // 向き
    _vt.copy(this.vel).addScaledVector(up, -this.vel.dot(up));
    const hs = _vt.length();
    this.speed01 = Math.min(1, hs / P.moveSpeed);
    if (wl > 1e-3 && inputMag > 0.1) {
      _tmp.copy(_wish).normalize();
      this.facing.lerp(_tmp, dampFactor(12, dt));
    }
    this._fixFacing();
    this._orientModel(dampFactor(12, dt));

    this.model.position.copy(this.pos);
    this.model.update(dt, { speed: this.grounded ? this.speed01 : this.speed01 * 0.3, grounded: this.grounded, fall: impact });
  }

  _orientModel(k) {
    // 右 = up × forward(モデルの前方は +Z)
    _x.crossVectors(this.up, this.facing).normalize();
    _m.makeBasis(_x, this.up, this.facing);
    _q.setFromRotationMatrix(_m);
    if (k >= 1) this.model.quaternion.copy(_q);
    else this.model.quaternion.slerp(_q, k);
  }
}
