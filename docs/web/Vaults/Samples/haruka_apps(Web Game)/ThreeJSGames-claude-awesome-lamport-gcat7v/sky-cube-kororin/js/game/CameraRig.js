// =========================================================
// CameraRig — じゅうりょくに あわせて 世界ごと くるっと回るカメラ
//  frame: ローカル(Y=うえ)→ ワールドへの回転
// =========================================================
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { Ease, clamp, damp, dampFactor } from '../core/Tween.js';
import { settings } from '../core/Settings.js';

const C = CONFIG.camera;
const Y = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _off = new THREE.Vector3();

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.frame = new THREE.Quaternion();
    this.from = new THREE.Quaternion();
    this.target = new THREE.Quaternion();
    this.t = 1;
    this.yaw = 0;
    this.pitch = C.pitch;
    this.distance = C.distance;
    this.curDist = C.distance;
    this.focus = new THREE.Vector3();
    this.shakeAmp = 0;
    this.fovExtra = 0;
    this.idleLook = 0;
    this.forward = new THREE.Vector3();
    this.right = new THREE.Vector3();
    this.upWorld = new THREE.Vector3(0, 1, 0);
    this.intro = null;
  }

  /** いっきに合わせる(スタート/リスポーン) */
  snap(up, focusPos, yaw = this.yaw, pitch = C.pitch) {
    this.frame.setFromUnitVectors(Y, up.clone().normalize());
    this.from.copy(this.frame);
    this.target.copy(this.frame);
    this.t = 1;
    this.yaw = yaw;
    this.pitch = pitch;
    this.focus.copy(focusPos);
    this.curDist = this.distance;
  }

  /** あたらしい「うえ」へ なめらかに回転 */
  setUp(newUp) {
    const curUp = _a.copy(Y).applyQuaternion(this.target);
    const d = curUp.dot(newUp);
    if (d > 0.999) return;
    let rot;
    if (d < -0.999) {
      // 真逆: 前方を軸にくるっとロール(向いている方向はそのまま)
      const fwd = this.localForward(_b).applyQuaternion(this.target);
      rot = new THREE.Quaternion().setFromAxisAngle(fwd, Math.PI);
    } else {
      rot = new THREE.Quaternion().setFromUnitVectors(curUp, newUp);
    }
    this.from.copy(this.frame);
    this.target.premultiply(rot);
    this.t = 0;
  }

  localForward(out) { return out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)); }

  /** プレイヤー入力に使う 前/右(ワールド) */
  basis() { return { forward: this.forward, right: this.right }; }

  shake(amount) {
    if (settings.get('reduceMotion')) return;
    this.shakeAmp = Math.max(this.shakeAmp, amount);
  }

  /** ステージ開始時の 空からのズームイン */
  startIntro(fromPos, duration = 2.4) {
    this.intro = { from: fromPos.clone(), t: 0, duration };
  }

  update(dt, { focusPos, look, level, speed = 0, facing = null, moving = false }) {
    // フレーム回転
    if (this.t < 1) {
      const dur = settings.get('reduceMotion') ? C.rotateDuration * 1.6 : C.rotateDuration;
      this.t = Math.min(1, this.t + dt / dur);
      this.frame.slerpQuaternions(this.from, this.target, Ease.inOutCubic(this.t));
    } else {
      this.frame.copy(this.target);
    }

    // ドラッグで まわす
    if (look && (look.x || look.y)) {
      this.yaw -= look.x * C.dragSensitivity;
      this.pitch = clamp(this.pitch + look.y * C.dragSensitivity, C.minPitch, C.maxPitch);
      this.idleLook = 0;
    } else {
      this.idleLook += dt;
    }

    // うごいている方向へ ゆっくり カメラを回りこませる
    if (moving && facing && this.idleLook > 1.2 && this.t >= 1) {
      const inv = _a.copy(facing).applyQuaternion(_q.copy(this.frame).invert());
      const targetYaw = Math.atan2(-inv.x, -inv.z);
      let dy = targetYaw - this.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      if (Math.abs(dy) < 2.2) this.yaw += dy * dampFactor(1.1, dt);
    }

    this.upWorld.copy(Y).applyQuaternion(this.frame);
    this.localForward(this.forward).applyQuaternion(this.frame);
    this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).applyQuaternion(this.frame);

    // 注視点
    _a.copy(focusPos).addScaledVector(this.upWorld, 0.6);
    this.focus.lerp(_a, dampFactor(C.followLambda, dt));

    // カメラ位置
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    _off.set(Math.sin(this.yaw) * cp, sp, Math.cos(this.yaw) * cp).applyQuaternion(this.frame).normalize();
    let want = this.distance;
    const hit = level?.raycast(this.focus, _off, this.distance + 0.4);
    if (hit) want = Math.max(C.minDistance, hit.t - 0.4);
    this.curDist = want < this.curDist ? want : damp(this.curDist, want, 3, dt);

    const cam = this.camera;
    cam.position.copy(this.focus).addScaledVector(_off, this.curDist);

    if (this.intro) {
      const it = this.intro;
      it.t += dt;
      const p = Ease.inOutCubic(Math.min(1, it.t / it.duration));
      cam.position.lerpVectors(it.from, cam.position, p);
      if (it.t >= it.duration) this.intro = null;
    }

    // ゆれ
    this.shakeAmp *= Math.exp(-7 * dt);
    if (this.shakeAmp > 0.002) {
      cam.position.x += (Math.random() - 0.5) * this.shakeAmp;
      cam.position.y += (Math.random() - 0.5) * this.shakeAmp;
      cam.position.z += (Math.random() - 0.5) * this.shakeAmp;
    }

    cam.up.copy(this.upWorld);
    cam.lookAt(this.focus);

    // スピード感の 視野角
    const boost = settings.get('reduceMotion') ? 0 : clamp((speed - 8) / 20, 0, 1) * C.fovBoost;
    this.fovExtra = damp(this.fovExtra, boost, 4, dt);
    const aspect = cam.aspect || 1;
    const baseFov = aspect < 0.8 ? C.fov + 12 : aspect < 1.1 ? C.fov + 6 : C.fov;
    const fov = baseFov + this.fovExtra;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
  }
}

const _q = new THREE.Quaternion();
