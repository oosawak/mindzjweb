// =========================================================
// OutroScene — アウトロ + けっか はっぴょう
//  あつめた かけらが ゆめぼしに もどり、ひかりを とりもどす。
// =========================================================
import * as THREE from 'three';
import { CineScene, orient } from './CineScene.js';
import { buildCineWorld, Yumeboshi } from './CineWorld.js';
import { Kororin } from '../game/Kororin.js';
import { createStarGeometry } from '../game/StarGeometry.js';
import { CONFIG } from '../config.js';
import { settings } from '../core/Settings.js';
import { t } from '../core/I18n.js';
import { Ease, rand } from '../core/Tween.js';
import { el } from '../ui/UI.js';
import { fmtTime } from './GameScene.js';

export function calcRank(stars, time) {
  for (const r of CONFIG.rank) if (stars >= r.minStars && time <= r.maxTime) return r.id;
  return 'B';
}

export class OutroScene extends CineScene {
  async enter({ results } = {}) {
    this.results = results || { stars: [5, 5, 5], totals: [5, 5, 5], time: 200, respawns: 0 };
    const stars = this.results.stars.reduce((a, b) => a + (b || 0), 0);
    const total = this.results.totals.reduce((a, b) => a + (b || 0), 0) || 15;
    this.summary = { stars, total, time: this.results.time, respawns: this.results.respawns, rank: calcRank(stars, this.results.time) };

    this.camera.fov = 52;
    this.camera.updateProjectionMatrix();
    this.world = buildCineWorld(this.scene, this.engine, {
      sky: { top: '#0f1442', mid: '#4a3f9e', bottom: '#ff8fb8', stars: 1, aurora: 0.6, sunDir: [0, 0.5, -1], sunColor: '#ffd6ec' },
      islands: [
        [[0, 0, 0], [6, 6, 6], 3], [[-2, 3.5, -1.5], [1.2, 1, 1.2], 1],
        [[14, -4, -10], [6, 6, 6], 2], [[-14, 2, -14], [5, 8, 5], 5], [[8, -12, 10], [7, 4, 7], 4],
      ],
      decor: { colors: ['#c8c4ff', '#ffd6ec', '#8fa8ff', '#fff3b0'], cloudColor: '#b8a8ff', cloudOpacity: 0.4 },
    });
    this.setupFX();
    this.setupCineUI();
    this.audio.playBGM('story');

    this.yume = new Yumeboshi(4);
    this.yume.position.set(0, 26, -40);
    this.yume.setBrightness(0.12);
    this.scene.add(this.yume);

    this.kororin = new Kororin();
    this.kororin.position.set(0, 3.45, 0);
    orient(this.kororin, new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
    this.scene.add(this.kororin);

    this.fragMat = new THREE.MeshStandardMaterial({ color: '#ffe066', emissive: '#ffb300', emissiveIntensity: 1.6 });
    const n = Math.max(3, Math.min(15, stars));
    this.frags = [];
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(createStarGeometry(0.28, 0.12, 0.1), this.fragMat);
      m.userData = { a: (i / n) * Math.PI * 2, r: 1.4 + (i % 3) * 0.35, h: 3.8 + (i % 4) * 0.25, state: 'orbit', t: 0 };
      this.scene.add(m);
      this.frags.push(m);
    }
    this.onSkip = () => this.showResult();
    this.play();
  }

  async play() {
    const k = this.kororin;
    const ok = await this.runBeats([
      {
        line: 'outro_01', min: 4,
        start: () => { k.setHappy(true); k.wave(true); },
        cam: (p) => this.camLerp([0, 5.2, 8], [1.5, 4.6, 6], [0, 3.8, 0], [0, 4, 0], p),
      },
      {
        line: 'outro_02', min: 5.5,
        start: () => {
          k.wave(false);
          this.frags.forEach((m, i) => this.later(0.25 + i * 0.18, () => { m.userData.state = 'rise'; m.userData.from = m.position.clone(); this.audio.sfx('sparkle', { volume: 0.5, minGap: 0.1 }); }));
        },
        cam: (p) => this.camLerp([1.5, 4.6, 6], [0, 6, 14], [0, 4, 0], [0, 20, -36], p),
      },
      {
        line: 'outro_03', min: 4.5,
        start: () => this.restore(),
        cam: (p) => this.camLerp([0, 6, 14], [0, 10, 6], [0, 20, -36], [0, 24, -40], p, Ease.outCubic),
      },
    ]);
    if (ok) this.showResult();
  }

  restore() {
    const p = this.yume.position;
    this.audio.sfx('goal');
    this.engine.postfx.doFlash('#fff6c8', 0.7, 1.0);
    this.engine.postfx.pulseRadial(1.2);
    this.tweens.to({ duration: 1.2, ease: Ease.outCubic, onUpdate: (e) => this.yume.setBrightness(0.12 + e * 0.88) });
    for (let i = 0; i < 4; i++) {
      this.later(i * 0.2, () => this.rings.spawn({ pos: p, normal: new THREE.Vector3(0, 0, 1), color: i % 2 ? '#ff9cc2' : '#ffe27a', size: 14 + i * 8, life: 1.3, width: 0.05 }));
    }
    this.particles.emit({ pos: p, count: 140, color: '#ffe066', color2: '#ff9cd0', speed: 22, size: 1.4, life: 2, drag: 1.5, shape: 1 });
  }

  showResult() {
    if (this.resultShown) return;
    this.resultShown = true;
    this.cineScreen?.querySelector('.skip-btn')?.remove();
    this.subs.clear();
    this.yume.setBrightness(1);
    this.audio.playBGM('result');
    const s = this.summary;
    const isBest = settings.saveBest({ rank: s.rank, time: s.time, stars: s.stars });

    const m = this.ui.modal({ title: t('result'), icon: 'star', closable: false, cls: 'result-card' });
    const grid = el('div', { class: 'result-grid' },
      el('div', { class: 'result-item' }, el('div', { class: 'k', text: t('result.stars') }), el('div', { class: 'v', text: `★ ${s.stars} / ${s.total}` })),
      el('div', { class: 'result-item' }, el('div', { class: 'k', text: t('result.time') }), el('div', { class: 'v', text: fmtTime(s.time) })),
    );
    m.body.append(grid);
    const stampWrap = el('div', { style: { minHeight: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' } });
    m.body.append(stampWrap);
    if (isBest) m.body.append(el('div', { style: { color: '#ff6f9f', fontWeight: 800 }, text: t('newRecord') }));

    this.later(0.9, () => {
      const stamp = el('div', { class: `rank-stamp ${s.rank}` }, el('div', { class: 'r', text: s.rank }), el('div', { class: 'l', text: t(`rank.${s.rank}`) }));
      stampWrap.append(stamp);
      this.audio.sfx('rank');
      this.engine.postfx.doFlash('#fff6c8', 0.35, 2);
      this.subs.say(`rank_${s.rank.toLowerCase()}`);
      m.foot.append(this.ui.button({ label: t('next'), icon: 'next', cls: 'primary', onClick: () => this.ctx.manager.go('ending', {}, { out: 0.9 }) }));
    });
  }

  update(dt) {
    super.update(dt);
    this.world.update(dt, this.camera);
    this.yume.update(dt);
    this.kororin.update(dt, { grounded: true });
    const target = this.yume.position;
    for (const m of this.frags) {
      const d = m.userData;
      m.rotation.y += dt * 3;
      if (d.state === 'orbit') {
        d.a += dt * 1.2;
        m.position.set(Math.cos(d.a) * d.r, d.h + Math.sin(d.a * 2) * 0.2, Math.sin(d.a) * d.r);
      } else if (d.state === 'rise') {
        d.t = Math.min(1, d.t + dt / 1.6);
        const e = Ease.inCubic(d.t);
        m.position.lerpVectors(d.from, target, e);
        m.position.x += Math.sin(d.t * Math.PI * 3 + d.a) * (1 - d.t) * 2;
        if (Math.random() < 0.7) this.particles.emit({ pos: m.position, color: '#ffe066', color2: '#ffffff', size: 0.5, life: 0.6, speed: 0.3, shape: 1 });
        if (d.t >= 1) {
          d.state = 'done';
          m.visible = false;
          this.yume.setBrightness(Math.min(0.6, this.yume.brightness + 0.04));
          this.particles.emit({ pos: target, count: 14, color: '#ffe066', speed: 8, size: 0.9, life: 0.7, shape: 1 });
        }
      }
    }
    if (this.resultShown) {
      this.camera.position.set(Math.sin(this.time * 0.15) * 3, 9, 8);
      this.camera.lookAt(0, 16, -30);
      if (Math.random() < dt * 2) this.firework();
    }
  }

  firework() {
    const p = new THREE.Vector3(rand(-20, 20), rand(18, 34), rand(-50, -30));
    const colors = ['#ffe066', '#ff9cd0', '#9cf0ff', '#c8a8ff'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    this.particles.emit({ pos: p, count: 50, color: c, color2: '#ffffff', speed: 10, size: 0.8, life: 1.4, drag: 1.6, shape: 1, gravity: new THREE.Vector3(0, -3, 0) });
    this.audio.sfx('pop', { volume: 0.3 });
  }

  dispose() {
    this.world.dispose();
    this.yume.dispose();
    this.kororin.dispose();
    this.fragMat.dispose();
    super.dispose();
  }
}
