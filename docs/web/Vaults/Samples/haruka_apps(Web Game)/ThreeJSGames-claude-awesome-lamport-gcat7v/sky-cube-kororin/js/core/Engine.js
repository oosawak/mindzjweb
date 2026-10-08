// =========================================================
// Engine — レンダラー・ループ・リサイズ・時間制御
// =========================================================
import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { PostFX } from '../vfx/PostFX.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // ポストエフェクト側の MSAA を使う
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.setClearColor(0x1b1f4a, 1);

    this.qualityName = 'medium';
    this.quality = CONFIG.quality.medium;
    this.postfx = new PostFX(this.renderer, this.quality);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

    this.width = 1;
    this.height = 1;
    this.time = 0;
    this.timeScale = 1;
    this._slow = { t: 0, scale: 1 };
    this.onResize = null;

    const onResize = () => this.resize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', () => setTimeout(onResize, 200));
    window.visualViewport?.addEventListener('resize', onResize);
    this.resize();
  }

  applyQuality(name) {
    const q = CONFIG.quality[name] || CONFIG.quality.medium;
    const changedAA = !!q.antialias !== !!this.quality.antialias;
    this.qualityName = name;
    this.quality = q;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pixelRatio));
    this.renderer.shadowMap.enabled = q.shadows;
    if (changedAA) this.postfx.rebuild(q);
    this.postfx.setBloom(q.bloom);
    this.resize();
    // 影の設定変更はマテリアル再コンパイルが必要
    this.scene?.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => { m.needsUpdate = true; }); });
  }

  setView(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.postfx.setView(scene, camera);
    this.resize();
  }

  resize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    this.width = w;
    this.height = h;
    this.renderer.setSize(w, h, false);
    this.postfx.setSize(w, h, this.renderer.getPixelRatio());
    if (this.camera?.isPerspectiveCamera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    this.onResize?.(w, h);
  }

  /** ヒットストップ / スローモーション(リアル時間で指定) */
  slowMo(seconds, scale = 0.2) {
    this._slow.t = Math.max(this._slow.t, seconds);
    this._slow.scale = Math.min(this._slow.scale === 1 ? scale : this._slow.scale, scale);
  }

  start(update) {
    let last = performance.now();
    const loop = (now) => {
      requestAnimationFrame(loop);
      const rawDt = Math.min((now - last) / 1000, 1 / 20);
      last = now;

      if (this._slow.t > 0) {
        this._slow.t -= rawDt;
        this.timeScale = this._slow.scale;
        if (this._slow.t <= 0) { this._slow.scale = 1; this.timeScale = 1; }
      }
      const dt = rawDt * this.timeScale;
      this.time += dt;

      update(dt, rawDt);
      this.postfx.render(rawDt, this.time);
    };
    requestAnimationFrame(loop);
  }
}
