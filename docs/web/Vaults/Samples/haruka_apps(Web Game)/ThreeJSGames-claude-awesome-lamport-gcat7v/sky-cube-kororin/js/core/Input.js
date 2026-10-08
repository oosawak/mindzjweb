// =========================================================
// Input — キーボード / マウス / タッチ / ゲームパッド
//  ・左半分のタッチ: バーチャルスティック
//  ・右半分のタッチ/マウス: ドラッグ=カメラ、タップ=じゅうりょく きりかえ
// =========================================================

const TAP_MAX_MOVE = 12;   // px
const TAP_MAX_TIME = 350;  // ms
const JOY_RADIUS = 56;

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.move = { x: 0, y: 0 };
    this.look = { x: 0, y: 0 };
    this.taps = [];
    this.hover = { x: 0, y: 0, active: false };
    this.jump = false;
    this.jumpHeld = false;
    this.pause = false;
    this.anyPress = false;
    this.gameplay = false; // ゲーム中だけ true

    this.joy = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
    this.pointers = new Map(); // id → {x, y, sx, sy, t, moved, type}
    this._touchJump = false;
    this._padPrev = {};

    this.isTouch = window.matchMedia?.('(pointer: coarse)').matches || false;
    this._applyTouchClass();

    window.addEventListener('keydown', (e) => this._onKey(e, true));
    window.addEventListener('keyup', (e) => this._onKey(e, false));
    window.addEventListener('blur', () => { this.keys.clear(); this.jumpHeld = false; });

    canvas.addEventListener('pointerdown', (e) => this._onDown(e));
    window.addEventListener('pointermove', (e) => this._onMove(e));
    window.addEventListener('pointerup', (e) => this._onUp(e));
    window.addEventListener('pointercancel', (e) => this._onUp(e, true));
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerleave', () => { this.hover.active = false; });
    // iOS のダブルタップズーム・ピンチ防止
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('dblclick', (e) => e.preventDefault());
  }

  _applyTouchClass() {
    document.body.classList.toggle('touch', this.isTouch);
  }

  _onKey(e, down) {
    const k = e.code;
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k) && this.gameplay) e.preventDefault();
    if (down) {
      if (!this.keys.has(k)) {
        if (k === 'Space' || k === 'KeyZ' || k === 'KeyJ') { this.jump = true; }
        if (k === 'Escape' || k === 'KeyP') this.pause = true;
        this.anyPress = true;
      }
      this.keys.add(k);
    } else {
      this.keys.delete(k);
    }
    if (this.isTouch && down) { this.isTouch = false; this._applyTouchClass(); }
  }

  _onDown(e) {
    const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
    if (isTouch !== this.isTouch) { this.isTouch = isTouch; this._applyTouchClass(); }
    this.anyPress = true;
    try { this.canvas.setPointerCapture(e.pointerId); } catch { /* noop */ }

    if (isTouch && this.gameplay && e.clientX < window.innerWidth * 0.45 && this.joy.id === null) {
      this.joy = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0, active: true };
      return;
    }
    this.pointers.set(e.pointerId, {
      x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY,
      t: performance.now(), moved: false, button: e.button, type: e.pointerType,
    });
  }

  _onMove(e) {
    if (e.pointerType === 'mouse') {
      this.hover.x = e.clientX;
      this.hover.y = e.clientY;
      this.hover.active = true;
    }
    if (this.joy.id === e.pointerId) {
      let dx = e.clientX - this.joy.ox;
      let dy = e.clientY - this.joy.oy;
      const len = Math.hypot(dx, dy);
      if (len > JOY_RADIUS) {
        // スティックの中心を指についてこさせる
        const over = len - JOY_RADIUS;
        this.joy.ox += (dx / len) * over;
        this.joy.oy += (dy / len) * over;
        dx = e.clientX - this.joy.ox;
        dy = e.clientY - this.joy.oy;
      }
      this.joy.x = dx / JOY_RADIUS;
      this.joy.y = -dy / JOY_RADIUS;
      return;
    }
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;
    if (!p.moved && Math.hypot(p.x - p.sx, p.y - p.sy) > TAP_MAX_MOVE) p.moved = true;
    if (p.moved) {
      const k = p.type === 'mouse' ? 1 : 1.35;
      this.look.x += dx * k;
      this.look.y += dy * k;
    }
  }

  _onUp(e, cancelled = false) {
    if (this.joy.id === e.pointerId) {
      this.joy = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
      return;
    }
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (cancelled) return;
    const dt = performance.now() - p.t;
    if (!p.moved && dt < TAP_MAX_TIME * (p.type === 'mouse' ? 2 : 1)) {
      this.taps.push({ x: e.clientX, y: e.clientY });
    }
  }

  /** タッチのジャンプボタンから呼ばれる */
  pressJump() { this.jump = true; this._touchJump = true; this.anyPress = true; }
  releaseJump() { this._touchJump = false; }

  update() {
    const k = this.keys;
    let x = 0, y = 0;
    if (k.has('KeyA') || k.has('ArrowLeft')) x -= 1;
    if (k.has('KeyD') || k.has('ArrowRight')) x += 1;
    if (k.has('KeyW') || k.has('ArrowUp')) y += 1;
    if (k.has('KeyS') || k.has('ArrowDown')) y -= 1;
    if (this.joy.active) { x += this.joy.x; y += this.joy.y; }
    if (k.has('KeyQ')) this.look.x -= 9;
    if (k.has('KeyE')) this.look.x += 9;
    if (k.has('KeyR')) this.look.y -= 6;
    if (k.has('KeyF')) this.look.y += 6;
    this.jumpHeld = k.has('Space') || k.has('KeyZ') || k.has('KeyJ') || this._touchJump;

    // ゲームパッド
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const pad of pads) {
      if (!pad) continue;
      const dz = (v) => (Math.abs(v) < 0.18 ? 0 : v);
      x += dz(pad.axes[0] || 0);
      y -= dz(pad.axes[1] || 0);
      this.look.x += dz(pad.axes[2] || 0) * 14;
      this.look.y += dz(pad.axes[3] || 0) * 10;
      const pressed = (i) => !!pad.buttons[i]?.pressed;
      const edge = (i) => pressed(i) && !this._padPrev[i];
      if (edge(0)) { this.jump = true; this.anyPress = true; }
      if (pressed(0)) this.jumpHeld = true;
      if (edge(9)) this.pause = true;
      // RB / RT: 画面中央をタップしたのと同じ
      if (edge(5) || edge(7)) this.taps.push({ x: window.innerWidth / 2, y: window.innerHeight / 2, center: true });
      for (let i = 0; i < pad.buttons.length; i++) this._padPrev[i] = pressed(i);
      break;
    }

    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    this.move.x = x;
    this.move.y = y;
  }

  /** フレームの最後に呼ぶ */
  endFrame() {
    this.jump = false;
    this.pause = false;
    this.anyPress = false;
    this.look.x = 0;
    this.look.y = 0;
    this.taps.length = 0;
  }

  reset() {
    this.endFrame();
    this.joy = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
    this.pointers.clear();
    this._touchJump = false;
  }
}
