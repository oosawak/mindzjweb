// =========================================================
// CreditsScene — スタッフロール
//  ゆめぼしに のった ころりんと いっしょに よぞらを とぶ。
//  画面を おしている あいだは はやおくり。
// =========================================================
import * as THREE from 'three';
import { BaseScene } from './BaseScene.js';
import { Yumeboshi } from './CineWorld.js';
import { Sky } from '../vfx/Sky.js';
import { Decor } from '../vfx/Decor.js';
import { Kororin } from '../game/Kororin.js';
import { el } from '../ui/UI.js';
import { t, pick } from '../core/I18n.js';
import { rand } from '../core/Tween.js';

const DURATION = 38; // 秒

export class CreditsScene extends BaseScene {
  async enter() {
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();
    this.sky = new Sky({ top: '#0a0d33', mid: '#2c2a78', bottom: '#7a4fa8', stars: 1.4, aurora: 1.0, sunColor: '#c8b8ff' });
    this.scene.add(this.sky);
    this.decor = new Decor({ rMin: 40, rMax: 160, colors: ['#c8c4ff', '#ffd6ec', '#8fa8ff', '#fff3b0'], cloudColor: '#8f80d8', cloudOpacity: 0.35 });
    this.scene.add(this.decor);
    this.scene.add(new THREE.HemisphereLight('#c8d0ff', '#ff9cc2', 1.6));
    const sun = new THREE.DirectionalLight('#fff0d8', 1.4);
    sun.position.set(5, 10, 8);
    this.scene.add(sun);
    this.setupFX(800);
    this.audio.playBGM('credits');

    this.rider = new THREE.Group();
    this.yume = new Yumeboshi(1.6);
    this.yume.star.rotation.x = -1.2;
    this.rider.add(this.yume);
    this.kororin = new Kororin();
    this.kororin.position.set(0, 0.95, 0.1);
    this.kororin.setHappy(true);
    this.rider.add(this.kororin);
    this.scene.add(this.rider);

    this.camera.position.set(0, 1.5, 9);
    this.camera.lookAt(0, 1, 0);

    this.progress = 0;
    this.speed = 1;
    this.done = false;
    this.buildRoll();
    this.layout();
  }

  buildRoll() {
    const credits = this.ctx.data.credits;
    const s = this.ui.screen('credits-screen');
    s.style.padding = '0';
    const wrap = el('div', { class: 'roll-wrap' });
    const roll = el('div', { class: 'roll' });
    roll.append(el('div', { class: 'r-title', html: 'そらキューブ ころりん<br><small style="font-size:.45em;letter-spacing:.3em">SKY CUBE KORORIN</small>' }));
    for (const sec of credits.sections) {
      roll.append(el('div', { class: 'r-role', text: pick(sec.role) }));
      for (const n of sec.names) {
        roll.append(el('div', { class: 'r-name', text: pick(n.name ?? n) }));
        if (n.note) roll.append(el('div', { class: 'r-note', text: pick(n.note) }));
      }
    }
    roll.append(el('div', { class: 'r-role', text: t('thanksTitle') }));
    roll.append(el('div', { class: 'r-name', text: t('thanksPlayer') }));
    roll.append(el('div', { class: 'r-copy', text: pick(credits.copyright) }));
    wrap.append(roll);
    s.append(wrap);
    s.append(el('div', { class: 'hold-hint', text: t('holdToSpeed') }));
    const skip = this.ui.button({ label: t('skip'), icon: 'skip', cls: 'small sky skip-btn', onClick: () => { this.progress = 1; } });
    s.append(skip);
    this.screenEl = s;
    this.roll = roll;
    this.holding = false;
    const down = (e) => { if (e.target.closest('button')) return; this.holding = true; };
    const up = () => { this.holding = false; };
    s.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    this._up = up;
    s.style.pointerEvents = 'auto';
  }

  layout() {
    this.rollHeight = this.roll.offsetHeight;
  }

  onResize() {
    super.onResize();
    if (this.roll) this.layout();
  }

  finishRoll() {
    if (this.done) return;
    this.done = true;
    this.screenEl.querySelector('.skip-btn')?.remove();
    this.screenEl.querySelector('.hold-hint')?.remove();
    const wrap = this.screenEl.querySelector('.roll-wrap');
    wrap.style.transition = 'opacity 0.8s ease';
    wrap.style.opacity = '0';
    this.subs.say('credits_thanks');
    const end = el('div', { class: 'the-end' },
      el('div', { class: 'big', text: t('theEnd') }),
      this.ui.button({ label: t('toTitle'), icon: 'home', cls: 'primary', onClick: () => this.ctx.manager.go('title', {}, { out: 0.8 }) }));
    this.screenEl.append(end);
    this.audio.sfx('sparkle');
    this.engine.postfx.doFlash('#fff6c8', 0.4, 1.5);
    this.particles.emit({ pos: this.rider.position, count: 80, color: '#ffe066', color2: '#ff9cd0', speed: 8, size: 0.5, life: 1.5, drag: 1.5, shape: 1 });
  }

  update(dt) {
    super.update(dt);
    this.sky.update(dt, this.camera);
    this.decor.update(dt * (this.holding ? 4 : 1));
    this.yume.update(dt);
    this.kororin.update(dt, { grounded: true });

    // ゆらゆら とぶ
    const tt = this.time;
    // テキストに かさならないよう 横に よせる(縦画面では 下に)
    const portrait = this.engine.width / this.engine.height < 1;
    const bx = this.done ? 0 : portrait ? 0 : 3.6;
    const by = this.done ? -0.6 : portrait ? -2.4 : -0.6;
    this.riderBase = this.riderBase || new THREE.Vector2(bx, by);
    this.riderBase.lerp(new THREE.Vector2(bx, by), 1 - Math.exp(-2 * dt));
    this.rider.position.set(this.riderBase.x + Math.sin(tt * 0.4) * 0.4, this.riderBase.y + Math.sin(tt * 0.9) * 0.3, 0);
    this.rider.rotation.set(Math.sin(tt * 0.7) * 0.08, Math.sin(tt * 0.3) * 0.5, Math.sin(tt * 0.5) * 0.1);
    this.decor.rotation.y += dt * 0.03;

    // ながれる ほし(上に とんでいる かんじ)
    const sp = this.holding ? 4 : 1;
    if (Math.random() < dt * 30 * sp) {
      this.particles.emit({ pos: new THREE.Vector3(rand(-14, 14), 12, rand(-12, 2)), vel: new THREE.Vector3(0, -18 * sp, 0), color: '#ffffff', color2: '#ffe6a8', size: 0.12, life: 1.6, lifeVar: 0.2 });
    }

    if (!this.done) {
      this.speed = this.holding ? 4 : 1;
      this.progress = Math.min(1, this.progress + (dt * this.speed) / DURATION);
      const h = this.rollHeight + this.engine.height;
      this.roll.style.transform = `translateY(${-this.progress * h}px)`;
      if (this.progress >= 1 || this.input.pause) this.finishRoll();
    }
  }

  dispose() {
    window.removeEventListener('pointerup', this._up);
    this.yume.dispose();
    this.kororin.dispose();
    this.decor.dispose();
    super.dispose();
  }
}
