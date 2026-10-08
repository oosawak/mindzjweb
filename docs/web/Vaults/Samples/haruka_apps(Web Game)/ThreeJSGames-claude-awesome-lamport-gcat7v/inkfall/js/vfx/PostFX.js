// =========================================================
// PostFX — ブルーム + 自作フィニッシュシェーダ
//  (色収差 / ズームブラー / スピードライン / フラッシュ / ビネット / グレイン)
// =========================================================
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { settings } from '../core/Settings.js';

const FinishShader = {
  name: 'SkyCubeFinishShader',
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uVignette: { value: 0.35 },
    uChroma: { value: 0 },
    uRadial: { value: 0 },
    uSpeed: { value: 0 },
    uFlash: { value: 0 },
    uFlashColor: { value: new THREE.Color(1, 1, 1) },
    uSaturation: { value: 1.08 },
    uGrain: { value: 0.025 },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uAspect, uVignette, uChroma, uRadial, uSpeed, uFlash, uSaturation, uGrain;
    uniform vec3 uFlashColor;
    uniform vec2 uCenter;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    vec3 sampleChroma(vec2 uv, vec2 dir) {
      float k = uChroma * 0.012;
      return vec3(
        texture2D(tDiffuse, uv + dir * k).r,
        texture2D(tDiffuse, uv).g,
        texture2D(tDiffuse, uv - dir * k).b
      );
    }

    void main() {
      vec2 c = vUv - uCenter;
      vec2 dir = c * 2.0;
      vec3 col;

      if (uRadial > 0.002) {
        col = vec3(0.0);
        for (int i = 0; i < 10; i++) {
          float s = 1.0 - uRadial * 0.09 * float(i) / 9.0;
          col += sampleChroma(uCenter + c * s, dir);
        }
        col /= 10.0;
      } else {
        col = sampleChroma(vUv, dir);
      }

      // スピードライン(放射状の流れる線)
      if (uSpeed > 0.01) {
        vec2 p = vec2(c.x * uAspect, c.y);
        float r = length(p);
        float a = atan(p.y, p.x);
        float fa = a * 12.0;
        float n = hash(vec2(floor(fa), 3.7));
        float dash = fract(r * 1.6 - uTime * (2.5 + n * 3.0) + n * 13.0);
        float thin = 1.0 - smoothstep(0.04, 0.16, abs(fract(fa) - 0.5));
        float line = step(0.66, n) * thin * smoothstep(0.5, 0.0, abs(dash - 0.5));
        line *= smoothstep(0.2, 0.75, r);
        col += vec3(0.9, 0.95, 1.0) * line * uSpeed * 0.55;
      }

      float l = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(l), col, uSaturation);

      float v = smoothstep(0.95, 0.25, length(c * vec2(uAspect * 0.75, 1.0)));
      col *= mix(1.0, v, uVignette);

      col = mix(col, uFlashColor, clamp(uFlash, 0.0, 1.0));
      col += (hash(vUv * vec2(1931.7, 1137.3) + fract(uTime)) - 0.5) * uGrain;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class PostFX {
  constructor(renderer, quality) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    // 減衰していくパルス値
    this.chroma = 0;
    this.radial = 0;
    this.flash = 0;
    this.flashDecay = 2.5;
    this.speed = 0;        // 毎フレーム外から設定
    this.baseVignette = 0.35;
    this.baseSaturation = 1.08;
    this.build(quality);
  }

  build(quality) {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), {
      type: THREE.HalfFloatType,
      samples: quality.antialias ? 4 : 0,
    });
    this.composer = new EffectComposer(this.renderer, rt);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.75, 0.55, 0.82);
    this.finishPass = new ShaderPass(FinishShader);
    this.outputPass = new OutputPass();
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.finishPass);
    this.composer.addPass(this.outputPass);
    this.bloomPass.enabled = quality.bloom;
  }

  rebuild(quality) {
    const { scene, camera } = this;
    this.composer.dispose?.();
    this.bloomPass.dispose?.();
    this.build(quality);
    this.setView(scene, camera);
    if (this._size) this.setSize(...this._size);
  }

  setView(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.renderPass.scene = scene;
    this.renderPass.camera = camera;
  }

  setBloom(on) { this.bloomPass.enabled = on; }

  /** ブルームの強さ等をシーンごとに調整 */
  setBloomParams({ strength, radius, threshold } = {}) {
    if (strength !== undefined) this.bloomPass.strength = strength;
    if (radius !== undefined) this.bloomPass.radius = radius;
    if (threshold !== undefined) this.bloomPass.threshold = threshold;
  }

  setSize(w, h, pr) {
    this._size = [w, h, pr];
    this.composer.setPixelRatio(pr);
    this.composer.setSize(w, h);
    this.finishPass.uniforms.uAspect.value = w / h;
  }

  // ---- 演出パルス ----
  pulseChroma(v) { if (!settings.get('reduceMotion')) this.chroma = Math.max(this.chroma, v); }
  pulseRadial(v) { if (!settings.get('reduceMotion')) this.radial = Math.max(this.radial, v); }
  doFlash(color = 0xffffff, amount = 0.8, decay = 2.5) {
    this.finishPass.uniforms.uFlashColor.value.set(color);
    this.flash = Math.max(this.flash, settings.get('reduceMotion') ? amount * 0.5 : amount);
    this.flashDecay = decay;
  }

  render(dt, time) {
    const u = this.finishPass.uniforms;
    this.chroma *= Math.exp(-5 * dt);
    this.radial *= Math.exp(-4 * dt);
    this.flash = Math.max(0, this.flash - this.flashDecay * dt);
    u.uTime.value = time;
    u.uChroma.value = this.chroma + 0.12;
    u.uRadial.value = this.radial;
    u.uSpeed.value = settings.get('reduceMotion') ? 0 : this.speed;
    u.uFlash.value = this.flash;
    u.uVignette.value = this.baseVignette;
    u.uSaturation.value = this.baseSaturation;
    this.composer.render(dt);
  }
}
