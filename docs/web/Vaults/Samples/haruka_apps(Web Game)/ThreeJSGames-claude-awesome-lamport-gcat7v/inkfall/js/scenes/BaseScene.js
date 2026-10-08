// =========================================================
// BaseScene — すべてのシーンの共通部分
// =========================================================
import * as THREE from 'three';
import { Tweens, clamp } from '../core/Tween.js';
import { InkFX } from '../vfx/InkFX.js';

export class BaseScene {
  constructor(ctx) {
    this.ctx = ctx;
    this.engine = ctx.engine;
    this.audio = ctx.audio;
    this.input = ctx.input;
    this.ui = ctx.ui;
    this.subs = ctx.subtitles;
    this.net = ctx.net;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.engine.width / this.engine.height, 0.08, 1500);
    this.tweens = new Tweens();
    this.time = 0;
    this._disposed = false;
    this._timers = [];
  }

  setupFX(max) {
    this.fx = new InkFX(this.scene, max ?? this.engine.quality.particles);
    this.onResize();
  }

  onResize() {
    this.fx?.setViewport(this.engine.height * this.engine.renderer.getPixelRatio(), this.camera.fov);
  }

  later(sec, fn) {
    const id = setTimeout(() => { if (!this._disposed) fn(); }, sec * 1000);
    this._timers.push(id);
    return id;
  }

  wait(sec) { return this.tweens.wait(sec); }

  async enter() {}

  update(dt) {
    this.time += dt;
    this.tweens.update(dt);
    this.fx?.update(dt);
  }

  exit() {}

  dispose() {
    this._disposed = true;
    this._timers.forEach(clearTimeout);
    this.tweens.clear();
    this.fx?.dispose();
    this.scene.traverse((o) => {
      o.geometry?.dispose?.();
      if (o.material) [].concat(o.material).forEach((m) => m.dispose?.());
    });
  }
}

/** ムービーシーン: beats を順番に(1 beat = max(min, ボイスの長さ)) */
export class CineScene extends BaseScene {
  setupCine({ skip = true, bars = true } = {}) {
    const s = this.ui.screen(bars ? 'cine-bars' : '');
    this.cineScreen = s;
    if (skip) s.append(this.ui.button({ label: this.ctx.t('skip'), icon: 'skip', cls: 'ghost small skip-btn', onClick: () => this.skip() }));
    this.look = new THREE.Vector3();
  }

  async runBeats(beats) {
    for (const b of beats) {
      if (this._disposed || this.skipped) return false;
      this.beat = b;
      b.t = 0;
      b.start?.();
      const jobs = [this.wait(b.min ?? 3)];
      if (b.line) jobs.push(this.subs.say(b.line));
      await Promise.all(jobs);
    }
    this.beat = null;
    return !this._disposed && !this.skipped;
  }

  skip() {
    if (this.skipped) return;
    this.skipped = true;
    this.subs.clear();
    this.onSkip?.();
  }

  cam(fromPos, toPos, fromLook, toLook, p, ease = (x) => x * x * (3 - 2 * x)) {
    const e = ease(clamp(p, 0, 1));
    this.camera.position.set(...fromPos).lerp(new THREE.Vector3(...toPos), e);
    this.look.set(...fromLook).lerp(new THREE.Vector3(...toLook), e);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.look);
  }

  update(dt) {
    super.update(dt);
    if (this.beat) {
      this.beat.t += dt;
      this.beat.cam?.(clamp(this.beat.t / (this.beat.min ?? 3), 0, 1), this.beat.t);
    }
    if (this.input.pause && !this.skipped) this.skip();
  }
}
