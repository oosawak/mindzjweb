// =========================================================
// TitleScene — タイトル画面
//  あそぶ / あそびかた / せってい / クレジット
//  うしろでは キューブの しまが「くるっ」と まわり、ころりんが のっている。
// =========================================================
import * as THREE from 'three';
import { BaseScene } from './BaseScene.js';
import { buildCineWorld } from './CineWorld.js';
import { Level } from '../game/Level.js';
import stage1 from '../game/levels/stage1.js';
import { Kororin } from '../game/Kororin.js';
import { StarPickup } from '../game/Entities.js';
import { el } from '../ui/UI.js';
import { openHowto, openSettings, openCredits } from '../ui/Panels.js';
import { t } from '../core/I18n.js';
import { settings } from '../core/Settings.js';
import { Ease, rand } from '../core/Tween.js';
import { fmtTime } from './GameScene.js';

export class TitleScene extends BaseScene {
  async enter() {
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();
    this.world = buildCineWorld(this.scene, this.engine, {
      sky: { top: '#4b6fe0', mid: '#9cc8ff', bottom: '#ffd6ec', stars: 0.25 },
      islands: [],
    });
    this.engine.postfx.setBloomParams({ strength: 0.7, radius: 0.55, threshold: 0.82 });

    // まわる しま
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);
    this.island = new Level({
      palette: stage1.palette,
      lights: { hemi: 0, sunIntensity: 0 },
      build(b) {
        b.block([0, 0, 0], [4, 4, 4], { c: 3 });
        b.block([1.2, 2.5, -1.2], [1, 1, 1], { c: 1 });
        b.block([-2.5, 0.9, 1.2], [1, 1.2, 1.2], { c: 2 });
        b.block([1.1, -2.5, 1.1], [1.2, 1, 1.2], { c: 4 });
        b.block([2.5, -1, -1], [1, 1.4, 1], { c: 5 });
        b.block([-1.1, 0.9, 2.5], [1.2, 1.2, 1], { c: 0 });
        b.block([1, -1, -2.5], [1.4, 1, 1], { c: 2 });
      },
    });
    this.island.hemi.visible = false;
    this.island.sun.visible = false;
    this.pivot.add(this.island.group);
    this.pivot.position.set(0, -0.4, 0);

    this.kororin = new Kororin();
    this.kororin.position.set(0, 1.6 + 0.45, 0);
    this.kororin.rotation.y = 0.35;
    this.scene.add(this.kororin);

    // まわりを とぶ ほし
    this.orbiters = [];
    for (let i = 0; i < 5; i++) {
      const s = new StarPickup(new THREE.Vector3());
      s.userData = { r: 4.2 + i * 0.5, sp: 0.35 + i * 0.07, ph: (i / 5) * Math.PI * 2, tilt: rand(-0.5, 0.5) };
      this.scene.add(s);
      this.orbiters.push(s);
    }

    this.setupFX(600);
    this.camera.position.set(0, 2.2, 11);
    this.camera.lookAt(0, 0.8, 0);

    this.turn = null;
    this.nextTurn = 2.5;
    this.audio.playBGM('title');
    this.buildUI();
  }

  buildUI() {
    this.screenEl?.remove();
    const s = this.ui.screen('title-screen');
    this.screenEl = s;

    const jp = el('span', { class: 'jp' });
    let i = 0;
    ['そらキューブ', 'ころりん'].forEach((word, w) => {
      const span = el('span', { class: 'word' });
      for (const ch of word) {
        span.append(el('span', { class: `ch${w === 1 ? ' accent' : ''}`, text: ch, style: { animationDelay: `${i++ * 0.12}s` } }));
      }
      if (w === 1) jp.append(document.createTextNode(' '));
      jp.append(span);
    });
    const logo = el('div', { class: 'title-logo' }, jp, el('br'), el('span', { class: 'en', text: 'SKY CUBE KORORIN' }));

    const menu = el('div', { class: 'title-menu' },
      this.ui.button({ label: t('play'), icon: 'play', cls: 'primary', onClick: () => this.start() }),
      this.ui.button({ label: t('howto'), icon: 'help', cls: 'mint', onClick: () => openHowto(this.ui) }),
      this.ui.button({ label: t('settings'), icon: 'gear', cls: 'sky', onClick: () => openSettings(this.ui, { onLangChange: () => this.buildUI() }) }),
      this.ui.button({ label: t('credits'), icon: 'star', cls: 'pink', onClick: () => openCredits(this.ui, this.ctx.data.credits) }),
    );
    s.append(logo, menu);
    s.append(el('div', { class: 'title-footer', text: `© 2026 haruka_apps  ·  v${this.ctx.version}` }));

    const best = settings.getBest();
    if (best) s.append(el('div', { class: 'title-best', text: `${t('best')}  ${best.rank}  ·  ${fmtTime(best.time)}` }));
  }

  start() {
    if (this.starting) return;
    this.starting = true;
    this.kororin.squash(-0.5);
    this.kororin.spin();
    this.engine.postfx.doFlash('#ffffff', 0.4, 1.5);
    this.particles.emit({ pos: this.kororin.position, count: 40, color: '#ffe066', color2: '#ff9cd0', speed: 7, size: 0.4, life: 0.9, drag: 2, shape: 1 });
    this.audio.sfx('sparkle');
    this.ctx.manager.go('intro', {}, { out: 0.7 });
  }

  update(dt) {
    super.update(dt);
    this.world.update(dt, this.camera);

    // タイトルコール(最初の1回だけ)
    if (this.audio.unlocked && !this.ctx.flags.titleCalled) {
      this.ctx.flags.titleCalled = true;
      this.later(0.5, () => this.subs.say('title_call', { show: false }));
    }

    // しまが 90° ずつ くるっと まわる(じゅうりょく きりかえ の イメージ)
    this.nextTurn -= dt;
    if (!this.turn && this.nextTurn <= 0) {
      const axes = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, -1)];
      const axis = axes[Math.floor(Math.random() * axes.length)];
      this.turn = { t: 0, from: this.pivot.quaternion.clone(), to: new THREE.Quaternion().setFromAxisAngle(axis, Math.PI / 2).multiply(this.pivot.quaternion) };
      this.kororin.squash(-0.45);
      this.kororin.spin();
      this.audio.sfx('gravity', { volume: 0.35 });
      this.engine.postfx.pulseChroma(0.8);
    }
    if (this.turn) {
      this.turn.t += dt / 0.9;
      const e = Ease.inOutCubic(Math.min(1, this.turn.t));
      this.pivot.quaternion.slerpQuaternions(this.turn.from, this.turn.to, e);
      // ジャンプしている あいだに まわる
      this.kororin.position.y = 2.05 + Math.sin(Math.min(1, this.turn.t) * Math.PI) * 1.1;
      if (this.turn.t >= 1) {
        this.turn = null;
        this.nextTurn = 2.8;
        this.kororin.squash(0.35);
        this.rings.spawn({ pos: new THREE.Vector3(0, 1.62, 0), normal: new THREE.Vector3(0, 1, 0), color: '#ffffff', size: 1.6, life: 0.5 });
      }
    }
    this.kororin.update(dt, { speed: 0, grounded: !this.turn });

    for (const s of this.orbiters) {
      const d = s.userData;
      const a = this.time * d.sp + d.ph;
      s.base.set(Math.cos(a) * d.r, 0.8 + Math.sin(a * 1.3) * 0.8 + d.tilt * Math.sin(a) * 2, Math.sin(a) * d.r);
      s.update(dt, new THREE.Vector3(0, 1, 0));
    }

    // カメラを ゆっくり ゆらす
    const t = this.time;
    const narrow = this.engine.width / this.engine.height < 0.8;
    const dist = narrow ? 17 : 11;
    this.camera.position.set(Math.sin(t * 0.12) * 2.5, 2.2 + Math.sin(t * 0.2) * 0.5, dist);
    this.camera.lookAt(0, narrow ? -1.6 : 0.8, 0);

    if (Math.random() < dt * 6) {
      this.particles.emit({ pos: new THREE.Vector3(rand(-8, 8), rand(-4, 6), rand(-6, 4)), color: '#ffffff', color2: '#ffe6a8', size: 0.18, life: 3, speed: 0.3 });
    }
  }

  dispose() {
    this.world.dispose();
    this.island.dispose();
    this.kororin.dispose();
    this.orbiters.forEach((s) => s.dispose());
    super.dispose();
  }
}
