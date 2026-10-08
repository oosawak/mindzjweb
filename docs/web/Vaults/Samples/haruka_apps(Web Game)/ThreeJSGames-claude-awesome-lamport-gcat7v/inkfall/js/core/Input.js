// =========================================================
// Input — PC(マウス+キーボード / ポインターロック)、タッチ、ゲームパッド
//  look は「ラジアン」で積算して渡す(感度はここで反映)
// =========================================================
import { CONFIG } from '../config.js';
import { settings } from './Settings.js';

const TAP_MOVE = 12;
const TAP_TIME = 320;
const JOY_R = 56;

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.move = { x: 0, y: 0 };
    this.look = { x: 0, y: 0 };
    this.taps = [];
    this.fireHeld = false;
    this.jump = false;
    this.jumpHeld = false;
    this.flip = false;
    this.special = false;
    this.pause = false;
    this.anyPress = false;
    this.gameplay = false;
    this.wantLock = false;
    this.locked = false;
    this.mouseFire = false;
    this.btn = { fire: false, jump: false };
    this.joy = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
    this.pointers = new Map();
    this._pad = {};
    this.isTouch = this._detectTouch();
    this._applyTouch();

    window.addEventListener('keydown', (e) => this._key(e, true));
    window.addEventListener('keyup', (e) => this._key(e, false));
    window.addEventListener('blur', () => this.releaseAll());
    canvas.addEventListener('pointerdown', (e) => this._down(e));
    window.addEventListener('pointermove', (e) => this._move(e));
    window.addEventListener('pointerup', (e) => this._up(e));
    window.addEventListener('pointercancel', (e) => this._up(e, true));
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => {
      const was = this.locked;
      this.locked = document.pointerLockElement === canvas;
      if (was && !this.locked && this.gameplay) this.pause = true;
      if (!this.locked) this.mouseFire = false;
    });
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    settings.addEventListener('change', (e) => { if (e.detail.key === 'controls') { this.isTouch = this._detectTouch(); this._applyTouch(); } });
  }

  _detectTouch() {
    const c = settings.get('controls');
    if (c === 'touch') return true;
    if (c === 'mouse') return false;
    return window.matchMedia?.('(pointer: coarse)').matches || false;
  }

  _applyTouch() { document.body.classList.toggle('touch', this.isTouch); }

  _key(e, down) {
    const k = e.code;
    if (this.gameplay && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(k)) e.preventDefault();
    if (down && !this.keys.has(k)) {
      if (k === 'Space') this.jump = true;
      if (k === 'ShiftLeft' || k === 'ShiftRight' || k === 'KeyF') this.flip = true;
      if (k === 'KeyQ' || k === 'KeyE') this.special = true;
      if (k === 'Escape' || k === 'KeyP') this.pause = true;
      this.anyPress = true;
      if (this.isTouch && settings.get('controls') === 'auto') { this.isTouch = false; this._applyTouch(); }
    }
    if (down) this.keys.add(k); else this.keys.delete(k);
  }

  requestLock() {
    if (this.isTouch || !this.wantLock || this.locked) return;
    try { const p = this.canvas.requestPointerLock?.({ unadjustedMovement: true }); p?.catch?.(() => this.canvas.requestPointerLock?.()); } catch { /* 非対応 */ }
  }

  exitLock() { if (this.locked) document.exitPointerLock?.(); }

  _down(e) {
    const touch = e.pointerType === 'touch' || e.pointerType === 'pen';
    if (settings.get('controls') === 'auto' && touch !== this.isTouch) { this.isTouch = touch; this._applyTouch(); }
    this.anyPress = true;
    if (!touch) {
      if (this.gameplay && this.wantLock && !this.locked) { this.requestLock(); return; }
      if (this.locked) {
        if (e.button === 0) this.mouseFire = true;
        if (e.button === 2) this.flip = true;
        return;
      }
    }
    try { this.canvas.setPointerCapture(e.pointerId); } catch { /* noop */ }
    if (touch && this.gameplay && e.clientX < window.innerWidth * 0.42 && this.joy.id === null) {
      this.joy = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0, active: true };
      return;
    }
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: false, touch });
  }

  _move(e) {
    if (this.locked && e.pointerType === 'mouse') {
      this._addLook(e.movementX, e.movementY, false);
      return;
    }
    if (this.joy.id === e.pointerId) {
      let dx = e.clientX - this.joy.ox, dy = e.clientY - this.joy.oy;
      const len = Math.hypot(dx, dy);
      if (len > JOY_R) {
        this.joy.ox += (dx / len) * (len - JOY_R);
        this.joy.oy += (dy / len) * (len - JOY_R);
        dx = e.clientX - this.joy.ox; dy = e.clientY - this.joy.oy;
      }
      this.joy.x = dx / JOY_R;
      this.joy.y = -dy / JOY_R;
      return;
    }
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (!p.moved && Math.hypot(p.x - p.sx, p.y - p.sy) > TAP_MOVE) p.moved = true;
    if (p.moved) this._addLook(dx, dy, p.touch);
  }

  /** タッチ UI(射撃ボタンのドラッグ照準)からも呼ばれる */
  _addLook(dx, dy, touch) {
    const base = touch ? CONFIG.camera.touchSensitivity : CONFIG.camera.mouseSensitivity;
    const s = base * settings.get('sensitivity');
    this.look.x += dx * s;
    this.look.y += dy * s * (settings.get('invertY') ? -1 : 1);
  }

  _up(e, cancel = false) {
    if (e.pointerType === 'mouse' && this.locked) {
      if (e.button === 0) this.mouseFire = false;
      return;
    }
    if (this.joy.id === e.pointerId) { this.joy = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false }; return; }
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (!cancel && !p.moved && performance.now() - p.t < TAP_TIME * (p.touch ? 1 : 2)) this.taps.push({ x: e.clientX, y: e.clientY });
  }

  releaseAll() {
    this.keys.clear();
    this.mouseFire = false;
    this.btn.fire = false;
    this.btn.jump = false;
    this.joy = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
    this.pointers.clear();
  }

  update(dt) {
    const k = this.keys;
    let x = 0, y = 0;
    if (k.has('KeyA') || k.has('ArrowLeft')) x -= 1;
    if (k.has('KeyD') || k.has('ArrowRight')) x += 1;
    if (k.has('KeyW') || k.has('ArrowUp')) y += 1;
    if (k.has('KeyS') || k.has('ArrowDown')) y -= 1;
    if (this.joy.active) { x += this.joy.x; y += this.joy.y; }
    this.fireHeld = this.mouseFire || this.btn.fire || k.has('KeyJ');
    this.jumpHeld = k.has('Space') || this.btn.jump;

    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const pad of pads) {
      if (!pad) continue;
      const dz = (v) => (Math.abs(v) < 0.18 ? 0 : v);
      x += dz(pad.axes[0] || 0);
      y -= dz(pad.axes[1] || 0);
      const s = 2.6 * settings.get('sensitivity') * dt;
      this.look.x += dz(pad.axes[2] || 0) * s;
      this.look.y += dz(pad.axes[3] || 0) * s * (settings.get('invertY') ? -1 : 1);
      const pr = (i) => !!pad.buttons[i]?.pressed;
      const edge = (i) => pr(i) && !this._pad[i];
      if (edge(0)) { this.jump = true; this.anyPress = true; }
      if (pr(0)) this.jumpHeld = true;
      if (pr(7)) this.fireHeld = true;
      if (edge(6) || edge(5)) this.flip = true;
      if (edge(3) || edge(4)) this.special = true;
      if (edge(9)) this.pause = true;
      for (let i = 0; i < pad.buttons.length; i++) this._pad[i] = pr(i);
      break;
    }
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    this.move.x = x;
    this.move.y = y;
  }

  endFrame() {
    this.jump = false;
    this.flip = false;
    this.special = false;
    this.pause = false;
    this.anyPress = false;
    this.look.x = 0;
    this.look.y = 0;
    this.taps.length = 0;
  }

  reset() {
    this.endFrame();
    this.releaseAll();
  }
}
