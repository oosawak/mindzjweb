// ===== Camera rig: chase (near/far), cockpit, hood, cinematic, orbit =====
import * as THREE from 'three';
import { damp, dampAngle, clamp, lerp, wrapAngle } from './util.js';

export const CAM_MODES = [
  { id: 'chase', label: '3人称 (近)' },
  { id: 'far', label: '3人称 (遠)' },
  { id: 'cockpit', label: '1人称 (コックピット)' },
  { id: 'hood', label: '1人称 (ボンネット)' },
];

const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

export class CameraRig {
  constructor(camera, world, settings) {
    this.cam = camera; this.world = world; this.settings = settings;
    this.modeIndex = 0;
    this.yaw = 0; this.pitch = 0;
    this.pos = new THREE.Vector3(0, 50, 0);
    this.look = new THREE.Vector3();
    this.shake = 0; this.shakeT = 0;
    this.fov = 65;
    this.lookBack = false;
    this.cine = null; // cinematic override
    this.orbitT = 0;
  }
  get mode() { return CAM_MODES[this.modeIndex].id; }
  cycle() { this.modeIndex = (this.modeIndex + 1) % CAM_MODES.length; this.snap = true; return CAM_MODES[this.modeIndex]; }
  setMode(i) { this.modeIndex = i; this.snap = true; }
  addShake(a) { const k = this.settings.shake; if (!k) return; this.shake = Math.min(1.2, this.shake + a * (k === 2 ? 1 : 0.45)); }

  applyCarVisibility(car) {
    const fp = this.mode === 'cockpit' && !this.cine;
    if (car.interior) car.interior.group.visible = fp;
    const parts = car.model.parts;
    for (let i = 0; i < 2; i++) if (parts[i]) parts[i].visible = !fp;
    // hide siren sprites / heads in cockpit to avoid glare
    for (const h of car.model.heads) h.visible = !fp;
  }

  update(dt, car, time) {
    const cam = this.cam;
    const s = this.settings;
    if (this.cine) { this.updateCine(dt, time); return; }
    if (!car) return;
    this.applyCarVisibility(car);
    const fx = Math.sin(car.yaw), fz = Math.cos(car.yaw);
    const speed = car.speed;
    const snap = this.snap; this.snap = false;
    const k = snap ? 1000 : 1;
    let fovTarget = s.fov;
    if (s.speedFx) fovTarget += clamp((speed - 20) / 70, 0, 1) * 9 + (car.nitroActive ? 5 : 0);
    const mode = this.mode;
    if (mode === 'chase' || mode === 'far') {
      // follow heading blended with velocity direction for drifts
      let tYaw = car.yaw;
      if (speed > 5) { const vy = Math.atan2(car.vel.x, car.vel.y); if (car.vF > 0) tYaw = car.yaw + wrapAngle(vy - car.yaw) * 0.45; }
      if (this.lookBack) tYaw += Math.PI;
      this.yaw = snap ? tYaw : dampAngle(this.yaw, tYaw, this.lookBack ? 30 : 4.2, dt);
      const far = mode === 'far';
      const dist = (far ? 9.5 : 6.3) + clamp(speed * 0.012, 0, 1.0);
      const h = far ? 3.4 : 2.05;
      const tx = car.pos.x - Math.sin(this.yaw) * dist, tz = car.pos.z - Math.cos(this.yaw) * dist;
      let ty = car.pos.y + h;
      const gy = this.world.heightAt(tx, tz) + 1.0;
      if (ty < gy) ty = gy;
      if (snap) this.pos.set(tx, ty, tz);
      else { this.pos.x = damp(this.pos.x, tx, 18, dt); this.pos.z = damp(this.pos.z, tz, 18, dt); this.pos.y = damp(this.pos.y, ty, 7, dt); }
      this.look.set(car.pos.x + Math.sin(this.yaw) * 4, car.pos.y + (far ? 1.3 : 1.15), car.pos.z + Math.cos(this.yaw) * 4);
      cam.position.copy(this.pos);
      cam.up.set(0, 1, 0);
      cam.lookAt(this.look);
    } else {
      const p = car.model.profile;
      let lx, ly, lz;
      if (mode === 'cockpit') { lx = 0.38; ly = p.belt + (p.roofH - p.belt) * 0.62; lz = p.roofF - 0.4; fovTarget += 6; }
      else { lx = 0; ly = (p.hoodFront || 0.9) + 0.3; lz = p.L / 2 - 0.42; fovTarget += 4; }
      // world pos using yaw + damped pitch, no roll (stable horizon)
      const tp = car.pitch * 0.5 + car.bodyPitch * 0.3;
      this.pitch = snap ? tp : damp(this.pitch, tp, 6, dt);
      const cy = Math.cos(car.yaw), sy = Math.sin(car.yaw);
      // local -> world (yaw only, then pitch small)
      const wx = car.pos.x + lx * cy + lz * sy;
      const wz = car.pos.z - lx * sy + lz * cy;
      const wy = car.pos.y + ly - lz * Math.sin(this.pitch);
      cam.position.set(wx, wy, wz);
      let yawL = car.yaw + clamp(car.angVel * 0.12, -0.2, 0.2);
      if (this.lookBack) yawL += Math.PI;
      cam.up.set(0, 1, 0);
      v1.set(wx + Math.sin(yawL) * 10, wy - Math.tan(this.pitch) * 10 - 0.35, wz + Math.cos(yawL) * 10);
      cam.lookAt(v1);
      this.yaw = car.yaw; this.pos.copy(cam.position);
    }
    // shake (yaw/pitch micro jitter only, never roll)
    const sk = s.shake ? this.shake + (s.shake === 2 ? clamp((speed - 55) / 40, 0, 1) * 0.08 : 0) : 0;
    if (sk > 0.001) {
      this.shakeT += dt * 30;
      cam.rotateY(Math.sin(this.shakeT * 1.3) * 0.012 * sk);
      cam.rotateX(Math.sin(this.shakeT * 1.7 + 1) * 0.012 * sk);
    }
    this.shake = damp(this.shake, 0, 5, dt);
    this.fov = snap ? fovTarget : damp(this.fov, fovTarget, 3, dt);
    if (Math.abs(cam.fov - this.fov) > 0.01) { cam.fov = this.fov; cam.updateProjectionMatrix(); }
  }

  // cinematic: {type:'orbit'|'flyby', target: Vector3 getter, t, dur}
  startCine(c) { this.cine = { t: 0, ...c }; }
  endCine() { this.cine = null; this.snap = true; }
  updateCine(dt, time) {
    const c = this.cine; c.t += dt;
    const cam = this.cam;
    const tp = c.target();
    if (c.type === 'orbit') {
      const a = (c.a0 || 0) + c.t * (c.speed ?? 0.25);
      const r = c.r || 9, h = c.h || 2.5;
      const x = tp.x + Math.sin(a) * r, z = tp.z + Math.cos(a) * r;
      const y = Math.max(tp.y + h, this.world.heightAt(x, z) + 1.2);
      cam.position.set(x, y, z);
      cam.lookAt(tp.x, tp.y + (c.ly ?? 0.9), tp.z);
    } else if (c.type === 'attract') {
      const path = c.path;
      const u = (time * 0.012) % 1;
      const n = path.length;
      const f = u * n, i = Math.floor(f), t = f - i;
      const a = path[i % n], b = path[(i + 1) % n];
      const x = lerp(a.x, b.x, t), z = lerp(a.z, b.z, t);
      const y = Math.max(lerp(a.y, b.y, t), this.world.heightAt(x, z) + 4);
      this.pos.set(x, y, z);
      cam.position.copy(this.pos);
      const la = path[(i + 2) % n];
      v2.set(lerp(b.x, la.x, t), lerp(b.y, la.y, t) - 8, lerp(b.z, la.z, t));
      if (!this.look.lengthSq()) this.look.copy(v2);
      this.look.lerp(v2, Math.min(1, dt * 1.5));
      cam.lookAt(this.look);
    } else if (c.type === 'side') {
      // takedown cam: side view tracking target
      const d = c.dir || { x: 1, z: 0 };
      const x = c.px ?? (tp.x + d.z * 8 - d.x * 3), z = c.pz ?? (tp.z - d.x * 8 - d.z * 3);
      if (c.px === undefined) { c.px = x; c.pz = z; c.py = Math.max(tp.y + 1.6, this.world.heightAt(x, z) + 1.2); }
      cam.position.set(c.px, c.py, c.pz);
      cam.lookAt(tp.x, tp.y + 0.8, tp.z);
    }
    if (Math.abs(cam.fov - 60) > 0.01) { cam.fov = 60; cam.updateProjectionMatrix(); }
  }
}
