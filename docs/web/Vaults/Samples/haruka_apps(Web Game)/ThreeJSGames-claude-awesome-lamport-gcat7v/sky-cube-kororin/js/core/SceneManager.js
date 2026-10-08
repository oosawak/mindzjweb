// =========================================================
// SceneManager — シーン切り替え(フェードつき)
// =========================================================

class Fader {
  constructor(el) { this.el = el; }

  to(opacity, duration = 0.5, color = 'black') {
    return new Promise((resolve) => {
      const el = this.el;
      el.classList.toggle('white', color === 'white');
      el.classList.toggle('block', opacity > 0);
      el.style.transitionDuration = `${duration}s`;
      // reflow してからトランジション
      void el.offsetWidth;
      el.style.opacity = String(opacity);
      setTimeout(resolve, duration * 1000 + 30);
    });
  }
}

export class SceneManager {
  constructor(engine, ctx) {
    this.engine = engine;
    this.ctx = ctx;
    this.registry = new Map();
    this.current = null;
    this.currentName = null;
    this.busy = false;
    this.fader = new Fader(document.getElementById('fader'));
    engine.onResize = (w, h) => this.current?.onResize?.(w, h);
  }

  register(name, SceneClass) { this.registry.set(name, SceneClass); }

  /**
   * @param {string} name シーン名
   * @param {object} params enter() に渡す
   * @param {{color?:string, out?:number, in?:number}} fade
   */
  async go(name, params = {}, fade = {}) {
    if (this.busy) return;
    this.busy = true;
    const color = fade.color || 'black';
    const ctx = this.ctx;
    if (this.current) await this.fader.to(1, fade.out ?? 0.5, color);

    ctx.subtitles?.clear();
    ctx.audio?.stopVoice();
    ctx.input.gameplay = false;
    ctx.input.reset();
    document.body.classList.remove('in-game');
    if (this.current) {
      this.current.exit?.();
      this.current.dispose?.();
    }
    ctx.ui.clear();

    const SceneClass = this.registry.get(name);
    const scene = new SceneClass(ctx);
    this.current = scene;
    this.currentName = name;
    await scene.enter(params);
    this.engine.setView(scene.scene, scene.camera);
    // 1フレーム描画してからフェードイン
    await new Promise((r) => requestAnimationFrame(() => r()));
    this.busy = false;
    await this.fader.to(0, fade.in ?? 0.6, color);
  }

  update(dt, rawDt) {
    if (this.current && !this.current._disposed) this.current.update(dt, rawDt);
  }
}
