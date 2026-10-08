// =========================================================
// Tween / Easing ユーティリティ
// =========================================================

export const Ease = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  outElastic: (t) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
};

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
/** フレームレートに依存しない指数減衰の補間係数 */
export const dampFactor = (lambda, dt) => 1 - Math.exp(-lambda * dt);
export const damp = (a, b, lambda, dt) => lerp(a, b, dampFactor(lambda, dt));
export const rand = (a, b) => a + Math.random() * (b - a);

/** シーンの update で進める軽量 Tween マネージャ */
export class Tweens {
  constructor() { this.list = []; }

  to({ duration = 1, delay = 0, ease = Ease.inOutCubic, onUpdate, onComplete }) {
    return new Promise((resolve) => {
      this.list.push({ t: -delay, duration, ease, onUpdate, onComplete, resolve });
    });
  }

  wait(seconds) { return this.to({ duration: seconds, ease: Ease.linear }); }

  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const tw = this.list[i];
      tw.t += dt;
      if (tw.t < 0) continue;
      const p = clamp(tw.t / tw.duration, 0, 1);
      tw.onUpdate?.(tw.ease(p), p);
      if (p >= 1) {
        this.list.splice(i, 1);
        tw.onComplete?.();
        tw.resolve();
      }
    }
  }

  clear() { this.list.length = 0; }
}
