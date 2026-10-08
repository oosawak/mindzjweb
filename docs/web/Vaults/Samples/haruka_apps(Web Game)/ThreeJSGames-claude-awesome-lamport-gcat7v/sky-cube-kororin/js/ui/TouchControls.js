// =========================================================
// TouchControls — バーチャルスティック + ジャンプボタン(表示担当)
// 入力の計算は core/Input.js が行う
// =========================================================
import { el } from './UI.js';
import { Icons } from './Icons.js';
import { t } from '../core/I18n.js';

export class TouchControls {
  constructor(root, input) {
    this.root = root;
    this.input = input;
    this.base = el('div', { class: 'joy-base' }, el('div', { class: 'joy-knob' }));
    this.knob = this.base.firstChild;
    this.jumpBtn = el('button', { class: 'jump-btn', type: 'button', 'aria-label': 'jump' });
    this.jumpBtn.innerHTML = Icons.jump;
    this.jumpLabel = el('span', { text: t('jump') });
    this.jumpBtn.append(this.jumpLabel);
    this.tip = el('div', { class: 'touch-tip', text: t('touchTip') });
    root.append(this.base, this.jumpBtn, this.tip);

    const down = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.jumpBtn.classList.add('pressed');
      input.pressJump();
    };
    const up = (e) => {
      e.preventDefault();
      this.jumpBtn.classList.remove('pressed');
      input.releaseJump();
    };
    this.jumpBtn.addEventListener('pointerdown', down);
    this.jumpBtn.addEventListener('pointerup', up);
    this.jumpBtn.addEventListener('pointercancel', up);
    this.jumpBtn.addEventListener('pointerleave', up);
  }

  refreshText() {
    this.jumpLabel.textContent = t('jump');
    this.tip.textContent = t('touchTip');
  }

  update() {
    const j = this.input.joy;
    const restX = 40 + 64;
    const restY = window.innerHeight - 40 - 64;
    if (j.active) {
      this.base.classList.add('active');
      this.base.style.left = `${j.ox}px`;
      this.base.style.top = `${j.oy}px`;
      this.knob.style.transform = `translate(${j.x * 50}px, ${-j.y * 50}px)`;
    } else {
      this.base.classList.remove('active');
      this.base.style.left = `${restX}px`;
      this.base.style.top = `${restY}px`;
      this.knob.style.transform = 'translate(0,0)';
    }
  }
}
