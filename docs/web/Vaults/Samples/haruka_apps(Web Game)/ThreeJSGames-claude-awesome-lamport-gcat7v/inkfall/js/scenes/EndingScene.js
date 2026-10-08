// =========================================================
// EndingScene — エンディング
//  試合後のスタジアムが夜空でかがやき、実況が締めくくる
// =========================================================
import * as THREE from 'three';
import { CineScene } from './BaseScene.js';
import { buildBackdrop } from './Backdrop.js';
import { Ease } from '../core/Tween.js';

export class EndingScene extends CineScene {
  async enter({ online, winnerColor = '#ff3fa4' } = {}) {
    this.online = online;
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();
    this.back = buildBackdrop(this.scene, { size: 20, fill: 0.1 });
    this.winnerColor = winnerColor;
    this.setupFX();
    this.setupCine();
    this.audio.playBGM('ending');
    this.onSkip = () => this.finish();
    this.fill = 0.1;
    this.play();
  }

  async play() {
    const ok = await this.runBeats([
      { line: 'ann_end_1', min: 5.5, start: () => this.tweens.to({ duration: 5, ease: Ease.inOutSine, onUpdate: (e) => { this.fill = 0.1 + e * 0.5; } }), cam: (p) => this.cam([30, 4, 34], [22, 14, 26], [0, 0, 0], [0, 2, 0], p) },
      { line: 'navi_end_2', min: 5.5, start: () => { this.fireworks = true; }, cam: (p) => this.cam([22, 14, 26], [-30, 30, 40], [0, 2, 0], [0, 0, 0], p) },
      { line: 'ann_end_3', min: 4.5, cam: (p) => this.cam([-30, 30, 40], [0, 70, 90], [0, 0, 0], [0, 0, 0], p, Ease.inOutCubic) },
    ]);
    if (ok) this.finish();
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.ctx.manager.go('credits', { online: this.online }, { color: 'white', out: 1, in: 1 });
  }

  update(dt) {
    super.update(dt);
    this.back.stadium.setFill(this.fill, 0.5 + Math.sin(this.time * 0.4) * 0.2);
    this.back.update(dt, this.camera);
    if (this.fireworks && Math.random() < dt * 3) {
      const p = new THREE.Vector3((Math.random() - 0.5) * 70, 15 + Math.random() * 30, (Math.random() - 0.5) * 70);
      const colors = [this.winnerColor, '#ff3fa4', '#25d9ff', '#b6ff3d', '#ffffff'];
      this.fx.particles.emit({ pos: p, count: 70, color: colors[Math.random() * colors.length | 0], color2: '#ffffff', speed: 14, size: 1.1, life: 1.6, drag: 1.3, shape: 1, gravity: new THREE.Vector3(0, -4, 0) });
      this.audio.sfx('splat', { volume: 0.3, minGap: 0.1 });
    }
  }

  dispose() { this.back.dispose(); super.dispose(); }
}
