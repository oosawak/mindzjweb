// =========================================================
// BaseScene — すべてのシーンの共通部分
// =========================================================
import * as THREE from 'three';
import { Tweens } from '../core/Tween.js';
import { Particles } from '../vfx/Particles.js';
import { Rings } from '../vfx/Rings.js';
import { updateMaterialTime } from '../vfx/Materials.js';

export class BaseScene {
  constructor(ctx) {
    this.ctx = ctx;
    this.engine = ctx.engine;
    this.audio = ctx.audio;
    this.input = ctx.input;
    this.ui = ctx.ui;
    this.subs = ctx.subtitles;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, this.engine.width / this.engine.height, 0.1, 1200);
    this.tweens = new Tweens();
    this.time = 0;
    this._disposed = false;
    this._timers = [];
  }

  /** パーティクルと衝撃波リングを使うシーン用 */
  setupFX(maxParticles) {
    const max = maxParticles ?? this.engine.quality.particles;
    this.particles = new Particles(max);
    this.scene.add(this.particles.points);
    this.rings = new Rings(this.scene);
    this.onResize();
  }

  onResize() {
    this.particles?.setViewport(this.engine.height * this.engine.renderer.getPixelRatio(), this.camera.fov);
  }

  /** dispose されたら発火しない setTimeout */
  later(seconds, fn) {
    const id = setTimeout(() => { if (!this._disposed) fn(); }, seconds * 1000);
    this._timers.push(id);
    return id;
  }

  /** シーン内の時間で待つ(ポーズ・スローに追従) */
  wait(seconds) { return this.tweens.wait(seconds); }

  async enter() {}

  update(dt) {
    this.time += dt;
    updateMaterialTime(this.engine.time);
    this.tweens.update(dt);
    this.particles?.update(dt);
    this.rings?.update(dt);
  }

  exit() {}

  dispose() {
    this._disposed = true;
    this._timers.forEach(clearTimeout);
    this.tweens.clear();
    this.particles?.dispose();
    this.scene.traverse((o) => {
      if (o.geometry && !o.geometry.userData?.shared) o.geometry.dispose?.();
      if (o.material) [].concat(o.material).forEach((m) => m.dispose?.());
    });
  }
}
