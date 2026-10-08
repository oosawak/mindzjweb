// =========================================================
// CreditsScene — スタッフロール(押している間は早送り)
// =========================================================
import { BaseScene } from './BaseScene.js';
import { buildBackdrop } from './Backdrop.js';
import { t, pick } from '../core/I18n.js';
import { el } from '../ui/UI.js';

const DURATION = 36;

export class CreditsScene extends BaseScene {
  async enter({ online } = {}) {
    this.online = online;
    this.camera.fov = 45;
    this.camera.updateProjectionMatrix();
    this.back = buildBackdrop(this.scene, { size: 14, fill: 0.45 });
    this.setupFX(600);
    this.audio.playBGM('credits');
    this.progress = 0;
    this.holding = false;
    const credits = this.ctx.data.credits;
    const s = this.ui.screen('credits-screen');
    s.style.pointerEvents = 'auto';
    this.screenEl = s;
    const wrap = el('div', { class: 'roll-wrap' });
    const roll = el('div', { class: 'roll' });
    roll.append(el('div', { class: 'r-title logo-main', 'data-text': 'INKFALL', text: 'INKFALL' }));
    for (const sec of credits.sections) {
      roll.append(el('div', { class: 'r-role', text: pick(sec.role) }));
      for (const n of sec.names) {
        roll.append(el('div', { class: 'r-name', text: pick(n.name ?? n) }));
        if (n.note) roll.append(el('div', { class: 'r-note', text: pick(n.note) }));
      }
    }
    roll.append(el('div', { class: 'r-role', text: t('thanksTitle') }), el('div', { class: 'r-name', text: t('thanksPlayer') }));
    roll.append(el('div', { class: 'r-copy', text: pick(credits.copyright) }));
    wrap.append(roll);
    s.append(wrap, el('div', { class: 'hold-hint', text: t('holdToSpeed') }));
    s.append(this.ui.button({ label: t('skip'), icon: 'skip', cls: 'ghost small skip-btn', onClick: () => { this.progress = 1; } }));
    this.roll = roll;
    s.addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) this.holding = true; });
    this._up = () => { this.holding = false; };
    window.addEventListener('pointerup', this._up);
  }

  finishRoll() {
    if (this.done) return;
    this.done = true;
    this.screenEl.querySelector('.roll-wrap').classList.add('fade');
    this.screenEl.querySelector('.skip-btn')?.remove();
    this.screenEl.querySelector('.hold-hint')?.remove();
    this.subs.say('navi_thanks');
    const end = el('div', { class: 'the-end' }, el('div', { class: 'big logo-main', 'data-text': 'THANK YOU', text: 'THANK YOU' }));
    end.append(this.online && this.net.active
      ? this.ui.button({ label: t('backToLobby'), icon: 'users', cls: 'primary', onClick: () => this.ctx.manager.go('lobby') })
      : this.ui.button({ label: t('toTitle'), icon: 'home', cls: 'primary', onClick: () => this.ctx.manager.go('title') }));
    this.screenEl.append(end);
    this.audio.sfx('win');
  }

  update(dt) {
    super.update(dt);
    const a = this.time * 0.1;
    this.camera.position.set(Math.cos(a) * 40 + 12, 8, Math.sin(a) * 40);
    this.camera.lookAt(12, 0, 0);
    this.back.update(dt, this.camera);
    if (!this.done) {
      this.progress = Math.min(1, this.progress + (dt * (this.holding ? 4 : 1)) / DURATION);
      const h = this.roll.offsetHeight + this.engine.height;
      this.roll.style.transform = `translateY(${-this.progress * h}px)`;
      if (this.progress >= 1 || this.input.pause) this.finishRoll();
    }
  }

  dispose() {
    window.removeEventListener('pointerup', this._up);
    this.back.dispose();
    super.dispose();
  }
}
