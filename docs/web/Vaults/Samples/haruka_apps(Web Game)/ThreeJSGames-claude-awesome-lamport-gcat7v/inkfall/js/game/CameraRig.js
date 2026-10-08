// =========================================================
// CameraRig — 肩ごしの三人称カメラ(重力に合わせて世界ごと回る)
// =========================================================
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { Ease, clamp, damp, dampFactor } from '../core/Tween.js';
import { settings } from '../core/Settings.js';

const C = CONFIG.camera;
const Y = new THREE.Vector3(0, 1, 0);
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _d = new THREE.Vector3();

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.frame = new THREE.Quaternion();
    this.from = new THREE.Quaternion();
    this.target = new THREE.Quaternion();
    this.t = 1;
    this.yaw = 0;
    this.pitch = C.pitch;
    this.curDist = C.distance;
    this.focus = new THREE.Vector3();
    this.forward = new THREE.Vector3();
    this.right = new THREE.Vector3();
    this.upWorld = new THREE.Vector3(0, 1, 0);
    this.lookDir = new THREE.Vector3(0, 0, -1);
    this.shakeAmp = 0;
    this.fovKick = 0;
  }

  snap(up, focus, yaw = 0, pitch = C.pitch) {
    this.frame.setFromUnitVectors(Y, up.clone().normalize());
    this.from.copy(this.frame);
    this.target.copy(this.frame);
    this.t = 1;
    this.yaw = yaw;
    this.pitch = pitch;
    this.focus.copy(focus);
  }

  /** ワールドの向きから yaw / pitch を合わせる(スポーン時) */
  faceDirection(dir) {
    const inv = this.frame.clone().invert();
    const l = dir.clone().applyQuaternion(inv);
    this.yaw = Math.atan2(-l.x, -l.z);
  }

  setUp(newUp) {
    const curUp = _a.copy(Y).applyQuaternion(this.target);
    const d = curUp.dot(newUp);
    if (d > 0.999) return;
    let rot;
    if (d < -0.999) {
      const fwd = _b.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).applyQuaternion(this.target);
      rot = new THREE.Quaternion().setFromAxisAngle(fwd, Math.PI);
    } else {
      rot = new THREE.Quaternion().setFromUnitVectors(curUp, newUp);
    }
    this.from.copy(this.frame);
    this.target.premultiply(rot);
    this.t = 0;
  }

  shake(a) { if (!settings.get('reduceMotion')) this.shakeAmp = Math.max(this.shakeAmp, a); }
  kick(a) { if (!settings.get('reduceMotion')) this.fovKick = Math.max(this.fovKick, a); }

  basis() { return { forward: this.forward, right: this.right }; }

  update(dt, { focusPos, look, arena }) {
    if (this.t < 1) {
      const dur = settings.get('reduceMotion') ? C.rotateDuration * 1.6 : C.rotateDuration;
      this.t = Math.min(1, this.t + dt / dur);
      this.frame.slerpQuaternions(this.from, this.target, Ease.inOutCubic(this.t));
    } else this.frame.copy(this.target);

    if (look) {
      this.yaw -= look.x;
      this.pitch = clamp(this.pitch - look.y, C.minPitch, C.maxPitch);
    }

    this.upWorld.copy(Y).applyQuaternion(this.frame);
    this.forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).applyQuaternion(this.frame);
    this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).applyQuaternion(this.frame);
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    this.lookDir.set(-Math.sin(this.yaw) * cp, sp, -Math.cos(this.yaw) * cp).applyQuaternion(this.frame).normalize();

    _a.copy(focusPos).addScaledVector(this.upWorld, C.height);
    this.focus.lerp(_a, dampFactor(C.followLambda, dt));

    // カメラの位置: 注視点から 後ろ + 右肩
    _d.copy(this.lookDir).negate().multiplyScalar(C.distance).addScaledVector(this.right, C.shoulder);
    const want = _d.length();
    _d.normalize();
    let dist = want;
    const hit = arena?.raycast(this.focus, _d, want + 0.3);
    if (hit) dist = Math.max(C.minDistance, hit.t - 0.3);
    this.curDist = dist < this.curDist ? dist : damp(this.curDist, dist, 6, dt);

    const cam = this.camera;
    cam.position.copy(this.focus).addScaledVector(_d, this.curDist);
    this.shakeAmp *= Math.exp(-9 * dt);
    if (this.shakeAmp > 0.002) {
      cam.position.x += (Math.random() - 0.5) * this.shakeAmp;
      cam.position.y += (Math.random() - 0.5) * this.shakeAmp;
      cam.position.z += (Math.random() - 0.5) * this.shakeAmp;
    }
    cam.up.copy(this.upWorld);
    _b.copy(cam.position).addScaledVector(this.lookDir, 10);
    cam.lookAt(_b);

    this.fovKick *= Math.exp(-6 * dt);
    const aspect = cam.aspect || 1;
    const base = aspect < 0.8 ? C.fov + 12 : aspect < 1.1 ? C.fov + 5 : C.fov;
    const fov = base + this.fovKick;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
  }
}
