// ===== Post-processing chain =====
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const FinalShader = {
  uniforms: {
    tDiffuse: { value: null }, uSpeed: { value: 0 }, uBlur: { value: 1 }, uTime: { value: 0 },
    uDamage: { value: 0 }, uNitro: { value: 0 }, uVig: { value: 1 }, uRes: { value: new THREE.Vector2(1, 1) }, uSiren: { value: new THREE.Vector3() },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uSpeed, uBlur, uTime, uDamage, uNitro, uVig; uniform vec2 uRes; uniform vec3 uSiren;
    varying vec2 vUv;
    float h(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    void main(){
      vec2 c = vec2(0.5, 0.52);
      vec2 d = vUv - c;
      float r = length(d);
      float mask = smoothstep(0.18, 0.75, r);
      float amt = uSpeed * uBlur;
      vec3 col = vec3(0.0);
      if (amt > 0.01) {
        float st = 0.028 * amt * mask;
        float tot = 0.0;
        for (int i = 0; i < 8; i++) { float f = float(i) / 7.0; float w = 1.0 - f * 0.6; col += texture2D(tDiffuse, vUv - d * st * f).rgb * w; tot += w; }
        col /= tot;
      } else col = texture2D(tDiffuse, vUv).rgb;
      // chromatic aberration toward edges
      float ca = (0.0012 + 0.0035 * amt) * mask;
      col.r = mix(col.r, texture2D(tDiffuse, vUv + d * ca * 2.0).r, 0.7);
      col.b = mix(col.b, texture2D(tDiffuse, vUv - d * ca * 2.0).b, 0.7);
      // speed streaks
      if (amt > 0.05) {
        float ang = atan(d.y, d.x);
        float lane = floor(ang * 70.0);
        float s = step(0.965, h(vec2(lane + 300.0, mod(floor(uTime * 14.0 + lane * 0.37), 997.0))));
        float along = fract(r * 3.0 - uTime * 4.0 + h(vec2(lane, 1.0)));
        col += vec3(0.7, 0.8, 1.0) * s * smoothstep(0.35, 0.9, r) * smoothstep(0.0, 0.3, along) * (1.0 - along) * amt * 0.5;
      }
      // grading: slight saturation + contrast in linear
      float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(l), col, 1.12);
      // vignette
      float vig = 1.0 - smoothstep(0.45, 1.05, r * 1.25) * 0.55 * uVig;
      col *= vig;
      // damage & nitro & siren edge glow
      float edge = smoothstep(0.35, 0.85, r);
      col = mix(col, col * vec3(1.6, 0.3, 0.3) + vec3(0.25, 0.0, 0.0), edge * uDamage);
      col += vec3(0.1, 0.3, 1.0) * edge * uNitro * 0.35;
      col += vec3(uSiren.x, 0.0, uSiren.y) * edge * 0.25 * uSiren.z;
      // grain
      col += (h(vUv * uRes + fract(uTime * 7.0) * 311.0) - 0.5) * 0.015;
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`,
};

export class Post {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    const size = renderer.getSize(new THREE.Vector2());
    const pr = renderer.getPixelRatio();
    const rt = new THREE.WebGLRenderTarget(size.x * pr, size.y * pr, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(renderer, rt);
    this.render = new RenderPass(scene, camera);
    this.composer.addPass(this.render);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.5, 0.5, 1.0);
    this.composer.addPass(this.bloom);
    this.final = new ShaderPass(FinalShader);
    this.composer.addPass(this.final);
    this.composer.addPass(new OutputPass());
    this.u = this.final.uniforms;
  }
  setSize(w, h) { this.composer.setSize(w, h); this.u.uRes.value.set(w, h); }
  setQuality(q) { this.bloom.enabled = q > 0; }
  draw(dt) { this.u.uTime.value += dt; this.composer.render(dt); }
}
