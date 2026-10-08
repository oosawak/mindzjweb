// =========================================================
// TouchControls — スマホ用のボタン(表示と押下の受け取り)
//  左: スティック / 右下: 射撃(押したままドラッグで照準)・ジャンプ・重力・スペシャル
// =========================================================
import { el } from './UI.js';
import { Icons } from './Icons.js';
import { t } from '../core/I18n.js';

export class TouchControls {
  constructor(root, input, { mode = 'turf' } = {}) {
    this.root = root;
    this.input = input;
    root.innerHTML = '';
    this.base = el('div', { class: 'joy-base' }, el('div', { class: 'joy-knob' }));
    this.knob = this.base.firstChild;
    root.append(this.base);

    const mk = (cls, icon, label) => {
      const b = el('button', { class: `tbtn ${cls}`, type: 'button', 'aria-label': label });
      b.innerHTML = `${Icons[icon]}<span>${label}</span>`;
      root.append(b);
      return b;
    };
    this.fireBtn = mk('t-fire', mode === 'tag' ? 'jump' : 'fire', mode === 'tag' ? t('btn.shove') : t('btn.fire'));
    this.jumpBtn = mk('t-jump', 'jump', t('btn.jump'));
    this.flipBtn = mk('t-flip', 'flip', t('btn.flip'));
    this.spBtn = mode === 'turf' || mode === 'training' ? mk('t-sp', 'bomb', t('btn.special')) : null;
    this.mode = mode;

    // 射撃ボタン: 押したまま指を動かすと照準
    let fireId = null, fx = 0, fy = 0;
    this.fireBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      fireId = e.pointerId; fx = e.clientX; fy = e.clientY;
      this.fireBtn.setPointerCapture(e.pointerId);
      this.fireBtn.classList.add('on');
      if (mode === 'tag') input.special = true; else input.btn.fire = true;
    });
    this.fireBtn.addEventListener('pointermove', (e) => {
      if (e.pointerId !== fireId) return;
      input._addLook(e.clientX - fx, e.clientY - fy, true);
      fx = e.clientX; fy = e.clientY;
    });
    const fireUp = (e) => { if (e.pointerId !== fireId) return; fireId = null; input.btn.fire = false; this.fireBtn.classList.remove('on'); };
    this.fireBtn.addEventListener('pointerup', fireUp);
    this.fireBtn.addEventListener('pointercancel', fireUp);

    const hold = (btn, down, up) => {
      btn.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); btn.classList.add('on'); down(); });
      const u = () => { btn.classList.remove('on'); up?.(); };
      btn.addEventListener('pointerup', u);
      btn.addEventListener('pointercancel', u);
      btn.addEventListener('pointerleave', u);
    };
    hold(this.jumpBtn, () => { input.jump = true; input.btn.jump = true; }, () => { input.btn.jump = false; });
    hold(this.flipBtn, () => { input.flip = true; });
    if (this.spBtn) hold(this.spBtn, () => { input.special = true; });
  }

  update({ flipReady = 1, special = 0, cooldownShove = 1 } = {}) {
    const j = this.input.joy;
    if (j.active) {
      this.base.classList.add('active');
      this.base.style.left = `${j.ox}px`;
      this.base.style.top = `${j.oy}px`;
      this.knob.style.transform = `translate(${j.x * 50}px, ${-j.y * 50}px)`;
    } else {
      this.base.classList.remove('active');
      this.base.style.left = '';
      this.base.style.top = '';
      this.knob.style.transform = '';
    }
    this.flipBtn.style.setProperty('--cd', `${Math.round(flipReady * 100)}%`);
    this.flipBtn.classList.toggle('ready', flipReady >= 1);
    if (this.spBtn) {
      this.spBtn.style.setProperty('--cd', `${Math.round(special * 100)}%`);
      this.spBtn.classList.toggle('ready', special >= 1);
    }
    if (this.mode === 'tag') this.fireBtn.style.setProperty('--cd', `${Math.round(cooldownShove * 100)}%`);
  }

  dispose() { this.root.innerHTML = ''; }
}
