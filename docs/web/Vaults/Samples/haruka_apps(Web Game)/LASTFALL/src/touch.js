import { G } from './state.js';
import { t } from './i18n.js';

// Replace keyboard hints with the corresponding touch button labels.
export function controlHint(message) {
  const text = t(message);
  if (!G.input?.touch) return text;
  const labels = { V: '視点切替', F: 'ライト', M: 'マップ', G: 'グレネード', E: '拾う',
    Space: G.player?.actor.dropState === 'freefall' ? 'パラシュート展開' : 'ジャンプ', W: '前進', S: '後退', B: 'ボット', N: 'モンスター', K: '全消去',
    P: '管理者パネル', X: '殲滅', T: 'テレポート' };
  return text.replace(/\[(\w+)\]/g, (token, key) => labels[key] ? '[' + t(labels[key]) + ']' : token);
}

export class TouchControls {
  constructor(input) {
    this.input = input;
    this.root = document.getElementById('touch-controls');
    this.stick = document.getElementById('move-stick');
    this.knob = this.stick.querySelector('i');
    this.more = document.getElementById('touch-more');
    this.pointers = new Map(); this.visible = false;
    this.blockClick = false;
    // A control may hide itself on pointerdown (Pause). Consume its synthesized
    // click so it cannot activate a menu button underneath on pointerup.
    document.addEventListener('pointerdown', () => { this.blockClick = false; }, true);
    document.addEventListener('click', (event) => {
      if (!this.blockClick) return;
      this.blockClick = false; event.preventDefault(); event.stopImmediatePropagation();
    }, true);
    input.onReset = () => this.reset();
    for (const surface of this.root.querySelectorAll('[data-touch], #move-stick, #look-pad')) {
      surface.addEventListener('pointerdown', (event) => this.start(event, surface));
      surface.addEventListener('pointermove', (event) => this.move(event));
      surface.addEventListener('pointerup', (event) => this.end(event));
      surface.addEventListener('pointercancel', (event) => this.end(event));
      surface.addEventListener('lostpointercapture', (event) => this.end(event));
      surface.addEventListener('contextmenu', (event) => event.preventDefault());
    }
  }
  setVisible(visible) {
    const next = !!(visible && this.input.touch);
    if (this.visible === next) return;
    this.visible = next;
    this.root.classList.toggle('hidden', !next);
    if (!next) { this.input.reset(); this.more.classList.add('hidden'); }
  }
  reset() {
    const pointers = [...this.pointers.entries()]; this.pointers.clear();
    for (const [id, pointer] of pointers) {
      try { if (pointer.surface.hasPointerCapture(id)) pointer.surface.releasePointerCapture(id); } catch { /* already released */ }
    }
    this.knob.style.transform = 'translate(-50%, -50%)';
    this.root.querySelectorAll('.held').forEach((button) => button.classList.remove('held'));
  }
  start(event, surface) {
    if (!this.visible || !this.input.locked || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault(); event.stopPropagation();
    this.blockClick = true;
    const action = surface.dataset.touch;
    const kind = surface === this.stick ? 'stick' : surface.id === 'look-pad' ? 'look' : 'button';
    if (kind !== 'button' && [...this.pointers.values()].some((pointer) => pointer.kind === kind)) return;
    const pointer = { surface, action, kind, x: event.clientX, y: event.clientY };
    this.pointers.set(event.pointerId, pointer);
    try { surface.setPointerCapture(event.pointerId); } catch { /* synthetic test events */ }
    if (kind === 'stick') this.updateStick(event);
    else if (kind === 'button') {
      if (action === 'fire') { this.input.setMouse('left', true); surface.classList.add('held'); }
      else if (action === 'aim') { this.input.setMouse('right', !this.input.mouse.right); surface.classList.toggle('held', this.input.mouse.right); }
      else if (action === 'sprint') { this.input.setKey('ShiftLeft', !this.input.down('ShiftLeft')); surface.classList.toggle('held', this.input.down('ShiftLeft')); }
      else if (action === 'map' || action === 'score') { const key = action === 'map' ? 'KeyM' : 'Tab'; this.input.setKey(key, !this.input.down(key)); surface.classList.toggle('held', this.input.down(key)); }
      else if (action === 'more') this.more.classList.toggle('hidden');
      else if (action === 'pause') this.input.unlock();
      else this.input.tap(action);
    }
  }
  updateStick(event) {
    const rect = this.stick.getBoundingClientRect();
    const radius = rect.width * 0.36;
    let x = (event.clientX - rect.left - rect.width / 2) / radius;
    let y = (event.clientY - rect.top - rect.height / 2) / radius;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    const magnitude = Math.min(length, 1);
    const scale = magnitude > 0.14 ? (magnitude - 0.14) / (0.86 * magnitude) : 0;
    this.input.move.x = x * scale; this.input.move.y = y * scale;
    this.knob.style.transform = `translate(calc(-50% + ${x * radius}px), calc(-50% + ${y * radius}px))`;
  }
  move(event) {
    const pointer = this.pointers.get(event.pointerId);
    if (!pointer) return;
    event.preventDefault();
    if (pointer.kind === 'stick') this.updateStick(event);
    if (pointer.kind === 'look' || pointer.action === 'fire') {
      const scale = 1.7 * G.settings.touchSens;
      this.input.mouse.dx += (event.clientX - pointer.x) * scale;
      this.input.mouse.dy += (event.clientY - pointer.y) * scale;
    }
    pointer.x = event.clientX; pointer.y = event.clientY;
  }
  end(event) {
    const pointer = this.pointers.get(event.pointerId);
    if (!pointer) return;
    this.pointers.delete(event.pointerId);
    if (pointer.kind === 'stick') { this.input.move.x = this.input.move.y = 0; this.knob.style.transform = 'translate(-50%, -50%)'; }
    if (pointer.action === 'fire' && ![...this.pointers.values()].some((p) => p.action === 'fire')) {
      this.input.setMouse('left', false); pointer.surface.classList.remove('held');
    }
    try { if (pointer.surface.hasPointerCapture(event.pointerId)) pointer.surface.releasePointerCapture(event.pointerId); } catch { /* already released */ }
  }
  update() {
    const actor = G.player?.actor;
    this.setVisible(G.running && !G.paused && actor?.alive);
    if (!this.visible) return;
    const jump = this.root.querySelector('[data-touch="Space"] span');
    const label = t(actor?.dropState === 'freefall' ? 'パラシュート展開' : actor?.dropState === 'plane' ? '降下する' : 'ジャンプ');
    if (jump.textContent !== label) jump.textContent = label;
    this.root.querySelectorAll('[data-training]').forEach((button) => button.classList.toggle('hidden', G.mode?.id !== 'range'));
    this.root.querySelectorAll('[data-admin]').forEach((button) => button.classList.toggle('hidden', !G.admin?.on));
    this.root.querySelector('[data-touch="score"]').classList.toggle('hidden', G.mode?.id !== 'br');
  }
}
