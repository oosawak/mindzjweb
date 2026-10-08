// =========================================================
// CineScene — ムービーシーンの共通部分
//  beats: [{ line, min, start(), cam(p, t) }] を じゅんばんに再生。
//  1つの beat の長さ = max(min, ボイスの長さ)
// =========================================================
import * as THREE from 'three';
import { BaseScene } from './BaseScene.js';
import { t } from '../core/I18n.js';
import { Ease, clamp } from '../core/Tween.js';
import { settings } from '../core/Settings.js';

const _p = new THREE.Vector3();
const _l = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _x = new THREE.Vector3();

export class CineScene extends BaseScene {
  setupCineUI({ bars = true, skip = true } = {}) {
    const s = this.ui.screen(bars ? 'cine-bars' : '');
    this.cineScreen = s;
    if (skip) {
      const b = this.ui.button({ label: t('skip'), icon: 'skip', cls: 'small sky skip-btn', onClick: () => this.skip() });
      s.append(b);
    }
    this.look = new THREE.Vector3();
    this.shakeAmp = 0;
  }

  async runBeats(beats) {
    for (const beat of beats) {
      if (this._disposed || this.skipped) return false;
      this.beat = beat;
      beat.t = 0;
      beat.start?.();
      const jobs = [this.wait(beat.min ?? 3)];
      if (beat.line) jobs.push(this.subs.say(beat.line));
      await Promise.all(jobs);
      beat.end?.();
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

  /** p (0..1) で カメラを 補間 */
  camLerp(fromPos, toPos, fromLook, toLook, p, ease = Ease.inOutSine) {
    const e = ease(clamp(p, 0, 1));
    _p.set(...fromPos).lerp(_l.set(...toPos), e);
    this.camera.position.copy(_p);
    _p.set(...fromLook).lerp(_l.set(...toLook), e);
    this.look.copy(_p);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(this.look);
  }

  shake(a) { if (!settings.get('reduceMotion')) this.shakeAmp = Math.max(this.shakeAmp, a); }

  update(dt) {
    super.update(dt);
    if (this.beat) {
      this.beat.t += dt;
      this.beat.cam?.(clamp(this.beat.t / (this.beat.min ?? 3), 0, 1), this.beat.t);
    }
    if (this.shakeAmp > 0.002) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeAmp;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeAmp;
      this.shakeAmp *= Math.exp(-5 * dt);
    }
    if (this.input.pause && !this.skipped) this.skip();
  }
}

/** モデルを「うえ」と「まえ」にあわせて向ける */
export function orient(obj, up, facing) {
  _x.crossVectors(up, facing).normalize();
  const f = facing.clone().addScaledVector(up, -facing.dot(up)).normalize();
  _m.makeBasis(_x, up, f);
  obj.quaternion.setFromRotationMatrix(_m);
}
