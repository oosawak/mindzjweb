// =========================================================
// EndingScene — エンディング
//  ゆめぼしが よぞらを てらし、キューブの せかいに ひかりが もどる。
// =========================================================
import * as THREE from 'three';
import { CineScene, orient } from './CineScene.js';
import { buildCineWorld, Yumeboshi } from './CineWorld.js';
import { Kororin } from '../game/Kororin.js';
import { Ease, rand } from '../core/Tween.js';

export class EndingScene extends CineScene {
  async enter() {
    this.camera.fov = 55;
    this.camera.updateProjectionMatrix();
    this.world = buildCineWorld(this.scene, this.engine, {
      sky: { top: '#1a2070', mid: '#5d58c0', bottom: '#ffc0d8', stars: 1.2, aurora: 1.2, sunDir: [0, 0.4, -1], sunColor: '#fff0c0' },
      islands: [
        [[0, 0, 0], [6, 6, 6], 3], [[2, 3.5, 1.5], [1, 1, 1], 1],
        [[16, 6, -4], [6, 8, 6], 2], [[-14, -4, -8], [8, 4, 8], 1],
        [[6, -10, 14], [5, 5, 5], 4], [[-8, 10, -20], [4, 4, 4], 5], [[20, -6, 16], [6, 3, 6], 0],
        [[-20, 6, 10], [5, 5, 5], 2], [[10, 16, -24], [6, 4, 6], 3],
      ],
      decor: { colors: ['#fff3b0', '#ffd6ec', '#c8e4ff', '#ffffff'], cloudColor: '#e8d8ff', cloudOpacity: 0.5 },
    });
    this.world.level.hemi.intensity = 2.2;
    this.setupFX();
    this.setupCineUI();
    this.audio.playBGM('ending');

    this.yume = new Yumeboshi(5);
    this.yume.position.set(0, 34, -60);
    this.yume.setBrightness(1);
    this.scene.add(this.yume);

    this.kororin = new Kororin();
    this.kororin.position.set(0, 3.45, 0);
    orient(this.kororin, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
    this.scene.add(this.kororin);
    this.kororin.setHappy(true);

    this.onSkip = () => this.finish();
    this.play();
  }

  async play() {
    const k = this.kororin;
    const ok = await this.runBeats([
      {
        line: 'ending_01', min: 5.5,
        cam: (p) => this.camLerp([0, 14, 0.5], [0, 10, 12], [0, 30, -60], [0, 22, -50], p),
      },
      {
        line: 'ending_02', min: 5.5,
        start: () => { this.fireworks = true; },
        cam: (p) => this.camLerp([0, 10, 12], [26, 18, 40], [0, 22, -50], [0, 4, -4], p),
      },
      {
        line: 'ending_03', min: 4.5,
        start: () => { k.wave(true); k.squash(-0.4); this.audio.sfx('jump'); },
        cam: (p) => this.camLerp([3, 5.5, 8], [2, 4.6, 5.5], [0, 4, 0], [0, 4, 0], p, Ease.outCubic),
      },
      { min: 1.5, cam: (p) => this.camLerp([2, 4.6, 5.5], [2, 4.6, 5.5], [0, 4, 0], [0, 5, 0], p) },
    ]);
    if (ok) this.finish();
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.ctx.manager.go('credits', {}, { color: 'white', out: 1.0, in: 1.0 });
  }

  update(dt) {
    super.update(dt);
    this.world.update(dt, this.camera);
    this.yume.update(dt);
    this.kororin.update(dt, { grounded: true });
    if (this.fireworks && Math.random() < dt * 2.5) {
      const p = new THREE.Vector3(rand(-40, 40), rand(15, 40), rand(-70, -20));
      const colors = ['#ffe066', '#ff9cd0', '#9cf0ff', '#c8a8ff', '#a8ffcf'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      this.particles.emit({ pos: p, count: 60, color: c, color2: '#ffffff', speed: 12, size: 1, life: 1.6, drag: 1.4, shape: 1, gravity: new THREE.Vector3(0, -3, 0) });
      this.audio.sfx('pop', { volume: 0.25 });
    }
    if (Math.random() < dt * 8) {
      this.particles.emit({ pos: new THREE.Vector3(rand(-30, 30), rand(-5, 30), rand(-40, 20)), color: '#fff3b0', size: 0.3, life: 3, speed: 0.4 });
    }
  }

  dispose() {
    this.world.dispose();
    this.yume.dispose();
    this.kororin.dispose();
    super.dispose();
  }
}
