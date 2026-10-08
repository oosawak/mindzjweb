import { useTouchControls } from './device.js';

// Desktop pointer lock and touch share the same gameplay input interface.
export class Input {
  constructor(canvas, preference = 'auto') {
    this.canvas = canvas;
    this.keys = new Set(); this.touchKeys = new Set(); this.pressed = new Set();
    this.move = { x: 0, y: 0 };
    this.mouse = { dx: 0, dy: 0, left: false, right: false, leftPressed: false, rightPressed: false, wheel: 0 };
    this.locked = false; this.touch = useTouchControls(preference);
    this.onLockChange = null; this.onReset = null;
    document.documentElement.classList.toggle('touch-ui', this.touch);
    addEventListener('keydown', (event) => {
      if (!this.locked || event.target.closest('input, select, textarea')) return;
      if (['Tab', 'Space', 'ControlLeft', 'KeyF', 'AltLeft'].includes(event.code)) event.preventDefault();
      if (event.repeat) return;
      this.keys.add(event.code); this.pressed.add(event.code);
    });
    addEventListener('keyup', (event) => this.keys.delete(event.code));
    addEventListener('blur', () => this.reset());
    addEventListener('mousemove', (event) => {
      if (!this.locked || this.touch) return;
      if (Math.abs(event.movementX) > 400 || Math.abs(event.movementY) > 400) return;
      this.mouse.dx += event.movementX; this.mouse.dy += event.movementY;
    });
    addEventListener('mousedown', (event) => {
      if (!this.locked || this.touch) return;
      if (event.button === 0) this.setMouse('left', true);
      if (event.button === 2) this.setMouse('right', true);
    });
    addEventListener('mouseup', (event) => {
      if (this.touch) return;
      if (event.button === 0) this.setMouse('left', false);
      if (event.button === 2) this.setMouse('right', false);
    });
    addEventListener('wheel', (event) => { if (this.locked && !this.touch) this.mouse.wheel += Math.sign(event.deltaY); }, { passive: true });
    canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    document.addEventListener('pointerlockchange', () => {
      if (this.touch) return;
      this.setLocked(document.pointerLockElement === this.canvas);
    });
  }
  reset() {
    this.keys.clear(); this.touchKeys.clear(); this.pressed.clear();
    this.move.x = this.move.y = 0;
    this.mouse.dx = this.mouse.dy = this.mouse.wheel = 0;
    this.mouse.left = this.mouse.right = this.mouse.leftPressed = this.mouse.rightPressed = false;
    this.onReset?.();
  }
  setLocked(value) {
    this.reset(); this.locked = value;
    this.onLockChange?.(value);
  }
  setTouchMode(preference) {
    this.unlock(); this.touch = useTouchControls(preference);
    document.documentElement.classList.toggle('touch-ui', this.touch);
  }
  lock() {
    this.reset();
    if (this.touch) { this.setLocked(true); return; }
    const fallback = () => {
      try { const request = this.canvas.requestPointerLock(); request?.catch?.(() => this.onLockChange?.(false)); }
      catch { this.onLockChange?.(false); }
    };
    try { const request = this.canvas.requestPointerLock({ unadjustedMovement: true }); request?.catch?.(fallback); }
    catch { fallback(); }
  }
  unlock() {
    if (document.pointerLockElement) document.exitPointerLock();
    if (this.touch) this.setLocked(false);
    else this.reset();
  }
  setKey(code, held) {
    if (held) { if (!this.touchKeys.has(code)) this.pressed.add(code); this.touchKeys.add(code); }
    else this.touchKeys.delete(code);
  }
  tap(code) { this.pressed.add(code); }
  setMouse(button, held) {
    if (held && !this.mouse[button]) this.mouse[button + 'Pressed'] = true;
    this.mouse[button] = held;
  }
  down(code) { return this.keys.has(code) || this.touchKeys.has(code); }
  hit(code) { return this.pressed.has(code); }
  movement() {
    let x = this.move.x + Number(this.down('KeyD')) - Number(this.down('KeyA'));
    let y = this.move.y + Number(this.down('KeyS')) - Number(this.down('KeyW'));
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    return { x, y };
  }
  endFrame() {
    this.pressed.clear(); this.mouse.dx = this.mouse.dy = 0;
    this.mouse.leftPressed = this.mouse.rightPressed = false; this.mouse.wheel = 0;
  }
}
