// =========================================================
// IntroScene — オープニングムービー
//  ゆめぼしが われて、かけらが キューブの せかいに ちらばる。
//  ころりんは「すきな ほうこうに おちる」ちからで たびに でる!
// =========================================================
import * as THREE from 'three';
import { CineScene, orient } from './CineScene.js';
import { buildCineWorld, Yumeboshi } from './CineWorld.js';
import { Kororin } from '../game/Kororin.js';
import { CameraRig } from '../game/CameraRig.js';
import { createStarGeometry } from '../game/StarGeometry.js';
import { Ease, rand } from '../core/Tween.js';

const Y = new THREE.Vector3(0, 1, 0);

export class IntroScene extends CineScene {
  async enter() {
    this.camera.fov = 55;
    this.camera.updateProjectionMatrix();
    this.world = buildCineWorld(this.scene, this.engine, {
      sky: { top: '#1d2470', mid: '#7a6cd0', bottom: '#ffb0c8', stars: 0.8, sunDir: [0, 0.3, -1], sunColor: '#ffc8e0' },
      islands: [
        [[0, 0, 0], [6, 6, 6], 3], [[2, 3.5, -1.8], [1, 1, 1], 1],
        [[16, 6, -4], [6, 8, 6], 2], [[-14, -4, -8], [8, 4, 8], 1],
        [[6, -10, 14], [5, 5, 5], 4], [[-8, 10, -20], [4, 4, 4], 5], [[20, -6, 16], [6, 3, 6], 0],
      ],
      decor: { colors: ['#c8c4ff', '#ffd6ec', '#8fa8ff', '#fff3b0'], cloudColor: '#d8c8ff', cloudOpacity: 0.5 },
    });
    this.setupFX();
    this.setupCineUI();
    this.audio.playBGM('story');

    this.yume = new Yumeboshi(4);
    this.yume.position.set(0, 38, -70);
    this.scene.add(this.yume);

    this.kororin = new Kororin();
    this.kpos = new THREE.Vector3(0, 3.45, 0);
    this.kup = new THREE.Vector3(0, 1, 0);
    this.kface = new THREE.Vector3(0, 0, 1);
    this.kororin.position.copy(this.kpos);
    orient(this.kororin, this.kup, this.kface);
    this.scene.add(this.kororin);

    this.fragMat = new THREE.MeshStandardMaterial({ color: '#ffe066', emissive: '#ffb300', emissiveIntensity: 1.6 });
    this.frags = [];
    this.rig = new CameraRig(this.camera);
    this.camMode = 'manual';

    this.onSkip = () => this.finish();
    this.play();
  }

  shatter() {
    const p = this.yume.position;
    this.yume.visible = false;
    this.audio.sfx('shatter');
    this.engine.postfx.doFlash('#ffffff', 0.85, 1.4);
    this.engine.postfx.pulseChroma(2.5);
    this.engine.postfx.pulseRadial(1.5);
    this.shake(0.6);
    this.particles.emit({ pos: p, count: 160, color: '#ffe066', color2: '#ffffff', speed: 30, size: 3, life: 1.8, drag: 1.5, shape: 1 });
    this.particles.emit({ pos: p, count: 40, color: '#ffd6ec', speed: 12, size: 6, life: 1.2, drag: 2 });
    this.rings.spawn({ pos: p, normal: new THREE.Vector3(0, 0, 1), color: '#ffe27a', size: 40, life: 1.2, width: 0.05 });
    const targets = [
      [-2, 3.6, -2.2], [16, 10.5, -4], [-14, -1.5, -8], [6, -7, 14], [-8, 12.5, -20], [20, -4, 16],
      [3, -3.5, 0], [12.5, 6, -4], [-10, -4, -8], [8.5, -10, 14], [-6, 10, -20], [17, -6, 16],
    ];
    for (let i = 0; i < 18; i++) {
      const m = new THREE.Mesh(createStarGeometry(0.6, 0.27, 0.2), this.fragMat);
      m.position.copy(p);
      const tgt = targets[i % targets.length];
      m.userData = {
        vel: new THREE.Vector3(rand(-1, 1), rand(-0.3, 1), rand(-0.2, 0.6)).normalize().multiplyScalar(rand(14, 26)),
        target: new THREE.Vector3(tgt[0] + rand(-1.5, 1.5), tgt[1], tgt[2] + rand(-1.5, 1.5)),
        t: 0,
        mid: null,
      };
      this.scene.add(m);
      this.frags.push(m);
    }
    this.fragPhase = 'burst';
  }

  async play() {
    const k = this.kororin;
    const ok = await this.runBeats([
      {
        line: 'intro_01', min: 5.5,
        cam: (p) => this.camLerp([40, 22, 46], [16, 10, 24], [0, 2, 0], [0, 3, 0], p),
      },
      {
        line: 'intro_02', min: 5,
        start: () => this.later(1.6, () => this.shatter()),
        cam: (p) => this.camLerp([6, 6, 20], [4, 9, 15], [0, 34, -70], [0, 30, -60], p),
      },
      {
        line: 'intro_03', min: 5,
        start: () => { this.fragPhase = 'fall'; this.audio.sfx('whoosh'); },
        cam: (p) => this.camLerp([4, 9, 15], [-6, 14, 30], [0, 26, -50], [2, 0, -2], p),
      },
      {
        line: 'intro_04', min: 4,
        start: () => {
          k.setSurprised(true);
          this.later(1.6, () => { k.setSurprised(false); k.squash(-0.5); this.audio.sfx('jump'); this.hop = 0; });
        },
        cam: (p) => this.camLerp([3.2, 4.4, 6], [2.2, 4.2, 4.6], [0, 3.8, 0], [0, 3.7, 0], p),
      },
      {
        line: 'intro_05', min: 6.5,
        start: () => {
          this.camMode = 'rig';
          this.rig.distance = 6;
          this.rig.snap(Y, this.kpos, Math.PI * 0.2, 0.3);
          this.later(1.6, () => this.flyToWall());
        },
      },
      {
        line: 'intro_06', min: 3.5,
        start: () => { k.wave(true); k.setHappy(true); this.rig.distance = 9; },
      },
    ]);
    if (ok) this.finish();
  }

  flyToWall() {
    // ころりんが「よこに おちる」
    const k = this.kororin;
    const from = this.kpos.clone();
    const to = new THREE.Vector3(12.55, 6, -2.5);
    const newUp = new THREE.Vector3(-1, 0, 0);
    this.rig.setUp(newUp);
    this.audio.sfx('gravity');
    this.engine.postfx.pulseChroma(2);
    this.engine.postfx.pulseRadial(1.3);
    k.spin();
    k.squash(-0.4);
    const upFrom = this.kup.clone();
    this.rings.spawn({ pos: new THREE.Vector3(13, 6, -2.5), normal: new THREE.Vector3(-1, 0, 0), color: '#ff8fc0', size: 3, life: 0.7, fill: 0.6 });
    this.tweens.to({
      duration: 1.3,
      ease: Ease.inQuad,
      onUpdate: (e, raw) => {
        this.kpos.lerpVectors(from, to, e);
        this.kpos.y += Math.sin(raw * Math.PI) * 1.2;
        this.kup.copy(upFrom).lerp(newUp, Ease.inOutCubic(Math.min(1, raw * 1.6))).normalize();
        this.particles.emit({ pos: this.kpos, color: '#cfe6ff', size: 0.25, life: 0.4, speed: 0.4 });
      },
      onComplete: () => {
        this.kup.copy(newUp);
        this.kface.set(0, 0, 1);
        k.squash(0.4);
        this.audio.sfx('land_big');
        this.rig.shake(0.3);
        this.rings.spawn({ pos: new THREE.Vector3(13, 6, -2.5), normal: newUp, color: '#ffe27a', size: 2.4, life: 0.5 });
        this.particles.emit({ pos: this.kpos, count: 20, color: '#ffffff', speed: 4, size: 0.4, life: 0.5, drag: 4 });
      },
    });
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.ctx.manager.go('game', { stage: 0 }, { out: 0.8 });
  }

  update(dt) {
    super.update(dt);
    this.world.update(dt, this.camera);
    this.yume.update(dt);

    const k = this.kororin;
    if (this.hop !== undefined && this.hop < 1) {
      this.hop += dt / 0.6;
      this.kpos.y = 3.45 + Math.sin(Math.min(1, this.hop) * Math.PI) * 1.0;
      if (this.hop >= 1) { k.squash(0.35); this.audio.sfx('land'); }
    }
    k.position.copy(this.kpos);
    orient(k, this.kup, this.kface);
    k.update(dt, { grounded: true });

    // かけら
    for (const m of this.frags) {
      const d = m.userData;
      m.rotation.x += dt * 3;
      m.rotation.y += dt * 4;
      if (this.fragPhase === 'burst') {
        d.vel.multiplyScalar(Math.exp(-1.6 * dt));
        m.position.addScaledVector(d.vel, dt);
      } else if (this.fragPhase === 'fall' && d.t < 1) {
        if (!d.mid) { d.from = m.position.clone(); d.mid = d.from.clone().lerp(d.target, 0.5).add(new THREE.Vector3(0, 8, 0)); d.dur = rand(2.4, 3.6); }
        d.t = Math.min(1, d.t + dt / d.dur);
        const e = Ease.inOutSine(d.t);
        const a = d.from.clone().lerp(d.mid, e);
        const b = d.mid.clone().lerp(d.target, e);
        m.position.copy(a.lerp(b, e));
        if (Math.random() < 0.6) this.particles.emit({ pos: m.position, color: '#ffe066', color2: '#ffffff', size: 0.5, life: 0.6, speed: 0.4, shape: 1 });
        if (d.t >= 1) this.particles.emit({ pos: m.position, count: 12, color: '#ffe066', speed: 3, size: 0.4, life: 0.6, shape: 1 });
      }
    }

    if (this.camMode === 'rig') {
      this.rig.update(dt, { focusPos: this.kpos, level: this.world.level, speed: 0 });
    }
  }

  dispose() {
    this.world.dispose();
    this.yume.dispose();
    this.kororin.dispose();
    this.fragMat.dispose();
    super.dispose();
  }
}
