// =========================================================
// IntroScene — オープニング
//  夜空のスタジアム → 中へ → 重力切り替え → 塗り合い → スタンプ → ロゴ
// =========================================================
import * as THREE from 'three';
import { CineScene } from './BaseScene.js';
import { buildBackdrop } from './Backdrop.js';
import { Arena } from '../game/Arena.js';
import { Robot } from '../game/Robot.js';
import cube from '../game/arenas/cube.js';
import { settings } from '../core/Settings.js';
import { Ease } from '../core/Tween.js';
import { el } from '../ui/UI.js';

const _m = new THREE.Matrix4(), _x = new THREE.Vector3(), _f = new THREE.Vector3();
function orient(obj, up, face) {
  _f.copy(face).addScaledVector(up, -face.dot(up)).normalize();
  _x.crossVectors(up, _f).normalize();
  _m.makeBasis(_x, up, _f);
  obj.quaternion.setFromRotationMatrix(_m);
}

export class IntroScene extends CineScene {
  async enter({ next = 'title' } = {}) {
    this.next = next;
    this.camera.fov = 55;
    this.camera.updateProjectionMatrix();
    const teams = settings.teams();
    this.colors = [teams[0].color, teams[1].color];
    this.back = buildBackdrop(this.scene, { size: 20, fill: 0.05, robots: false });
    this.arena = new Arena(cube);
    this.arena.setTeamColors(...this.colors);
    this.arena.group.visible = false;
    this.scene.add(this.arena.group);
    this.inner = new THREE.Group();
    this.inner.visible = false;
    this.inner.add(new THREE.PointLight(this.colors[0], 50, 24, 1.5), new THREE.PointLight(this.colors[1], 50, 24, 1.5));
    this.inner.children[0].position.set(-10, 5, 0);
    this.inner.children[1].position.set(10, 12, 0);
    this.scene.add(this.inner);
    this.setupFX();
    this.setupCine();
    this.audio.playBGM('intro');

    this.A = new Robot(this.colors[0]);
    this.B = new Robot(this.colors[1]);
    this.inner.add(this.A, this.B);
    this.aPos = new THREE.Vector3(-8, 0.5, 4);
    this.aUp = new THREE.Vector3(0, 1, 0);
    this.bPos = new THREE.Vector3(4, 17.5, -3);
    this.bUp = new THREE.Vector3(0, -1, 0);
    this.paintT = 0;
    this.onSkip = () => this.finish();
    this.play();
  }

  toInside() {
    this.back.stadium.visible = false;
    this.back.decor.visible = false;
    this.arena.group.visible = true;
    this.inner.visible = true;
    this.scene.fog = new THREE.Fog('#0b0d24', 26, 70);
    this.engine.postfx.doFlash('#ffffff', 0.6, 2.5);
    this.audio.sfx('whoosh');
  }

  async play() {
    const ok = await this.runBeats([
      { line: 'ann_intro_1', min: 6, cam: (p) => this.cam([0, 40, 140], [26, 10, 40], [0, 0, 0], [0, 0, 0], p) },
      {
        line: 'navi_intro_2', min: 6.5,
        start: () => { this.toInside(); this.walkA = true; this.later(2.2, () => this.flipA()); },
        cam: (p) => { this.cam([-11, 3, 11], [-3, 5, 12], [-4, 1.5, 4], [6, 5, 3], p); this.camera.lookAt(this.aPos); },
      },
      {
        line: 'ann_intro_3', min: 5.5,
        start: () => { this.painting = true; },
        cam: (p) => this.cam([0, 9, 12], [0, 9, -12], [0, 6, 0], [0, 5, 0], p, Ease.inOutSine),
      },
      {
        line: 'navi_intro_4', min: 5,
        start: () => { this.painting = false; this.later(1.4, () => this.dropB()); },
        cam: (p) => { this.cam([10, 3, 4], [9, 2.5, 3], [4, 6, -3], [4, 2, -3], p); this.camera.lookAt(this.bPos); },
      },
      {
        line: 'ann_intro_5', min: 3.8,
        start: () => this.showLogo(),
        cam: (p) => this.cam([0, 9, 0.1], [0, 9, 0.1], [0, 0, 0], [0, 0, 0], p),
      },
    ]);
    if (ok) this.finish();
  }

  flipA() {
    this.walkA = false;
    const from = this.aPos.clone(), to = new THREE.Vector3(12.5, 6, 4);
    const upFrom = this.aUp.clone(), upTo = new THREE.Vector3(-1, 0, 0);
    this.audio.sfx('flip');
    this.engine.postfx.pulseChroma(2);
    this.fx.rings.spawn({ pos: new THREE.Vector3(13, 6, 4), normal: upTo, color: this.colors[0], size: 3, life: 0.6, fill: 0.5 });
    this.tweens.to({
      duration: 1.1, ease: Ease.inQuad,
      onUpdate: (e, raw) => {
        this.aPos.lerpVectors(from, to, e);
        this.aUp.copy(upFrom).lerp(upTo, Ease.inOutCubic(Math.min(1, raw * 1.5))).normalize();
        this.fx.particles.emit({ pos: this.aPos, color: this.colors[0], size: 0.3, life: 0.4 });
      },
      onComplete: () => {
        this.audio.sfx('land_big');
        this.fx.stamp(new THREE.Vector3(13, 6, 4), upTo, this.colors[0]);
        this.arena.paintSphere(new THREE.Vector3(13, 6, 4), 3.2, 1);
      },
    });
  }

  dropB() {
    const from = this.bPos.clone(), to = new THREE.Vector3(4, 0.5, -3);
    this.audio.sfx('flip');
    this.tweens.to({
      duration: 0.9, ease: Ease.inQuad,
      onUpdate: (e) => { this.bPos.lerpVectors(from, to, e); this.bUp.set(0, 1, 0); this.fx.particles.emit({ pos: this.bPos, color: this.colors[1], size: 0.35, life: 0.4 }); },
      onComplete: () => {
        const p = new THREE.Vector3(4, 0, -3), n = new THREE.Vector3(0, 1, 0);
        this.fx.stamp(p, n, this.colors[1]);
        this.audio.sfx('stamp');
        this.engine.postfx.pulseRadial(1.4);
        this.shakeT = 0.5;
        this.arena.paintSphere(p, 4.5, 2);
      },
    });
  }

  showLogo() {
    const logo = el('div', { class: 'intro-logo' }, el('div', { class: 'logo-main', 'data-text': 'INKFALL', text: 'INKFALL' }));
    this.cineScreen.append(logo);
    this.audio.sfx('overdrive');
    this.engine.postfx.doFlash('#ffffff', 0.7, 1.5);
    for (let i = 0; i < 30; i++) {
      const c = this.arena.randomCell();
      this.arena.paintSphere(this.arena.cellCenter(c), 2.5, 1 + (i % 2));
    }
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.ctx.goDest(this.next);
  }

  update(dt) {
    super.update(dt);
    if (this.painting) {
      this.paintT -= dt;
      if (this.paintT <= 0) {
        this.paintT = 0.06;
        const c = this.arena.randomCell();
        const team = 1 + (Math.random() < 0.5 ? 0 : 1);
        const p = this.arena.cellCenter(c);
        const n = this.arena.cellNormalVec(c);
        this.arena.paintSphere(p, 2, team);
        this.fx.splat(p, n, this.colors[team - 1], 1.4);
        if (Math.random() < 0.3) this.audio.sfx('splat', { volume: 0.4 });
      }
    }
    if (this.walkA) this.aPos.x += dt * 3.6;
    if (this.shakeT > 0) { this.shakeT -= dt; this.camera.position.x += (Math.random() - 0.5) * this.shakeT; }
    this.A.position.copy(this.aPos);
    orient(this.A, this.aUp, new THREE.Vector3(1, 0, 0));
    this.B.position.copy(this.bPos);
    orient(this.B, this.bUp, new THREE.Vector3(-1, 0, 0));
    this.A.update(dt, { speed: 0.6, grounded: true, pitch: 0 });
    this.B.update(dt, { speed: 0, grounded: true, pitch: -0.3 });
    this.arena.update(dt);
    this.back.update(dt, this.camera);
  }

  dispose() {
    this.back.dispose();
    this.arena.dispose();
    this.A.dispose();
    this.B.dispose();
    super.dispose();
  }
}
