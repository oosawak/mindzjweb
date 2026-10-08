// =========================================================
// Stadium — タイトル / ムービー用の「キューブ・スタジアム」外観
//  パネル + ネオンの継ぎ目 + 2 色のインクがシェーダーでじわじわ広がる
// =========================================================
import * as THREE from 'three';
import { glowTexture } from './Textures.js';

export class Stadium extends THREE.Group {
  constructor({ size = 20, colorA = '#ff3fa4', colorB = '#25d9ff' } = {}) {
    super();
    this.uniforms = {
      uTime: { value: 0 },
      uA: { value: new THREE.Color(colorA) },
      uB: { value: new THREE.Color(colorB) },
      uFill: { value: 0.35 },
      uBias: { value: 0.5 },
    };
    const mat = new THREE.MeshStandardMaterial({ color: '#1e2236', metalness: 0.4, roughness: 0.45 });
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, this.uniforms);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vLP; varying vec3 vLN;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLP = position; vLN = normal;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform float uTime, uFill, uBias; uniform vec3 uA, uB; varying vec3 vLP; varying vec3 vLN;
          float h3(vec3 p){ p = fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
          float vn(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
            return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
                       mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z); }`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          vec3 lp = vLP * ${(1 / size).toFixed(4)} * 6.0;
          float n1 = vn(lp * 0.9 + vec3(0.0, uTime * 0.05, 0.0)) * 0.65 + vn(lp * 2.7) * 0.35;
          float n2 = vn(lp * 1.1 + vec3(7.3, -uTime * 0.04, 2.1)) * 0.65 + vn(lp * 3.1 + 4.0) * 0.35;
          float pa = smoothstep(0.5, 0.53, n1 * uFill * 1.6 + (1.0 - uBias) * 0.25);
          float pb = smoothstep(0.5, 0.53, n2 * uFill * 1.6 + uBias * 0.25) * (1.0 - pa);
          vec3 an = abs(vLN);
          vec2 q = an.x > 0.5 ? lp.yz : (an.y > 0.5 ? lp.xz : lp.xy);
          vec2 gq = abs(fract(q * 1.2) - 0.5);
          float seam = smoothstep(0.455, 0.5, max(gq.x, gq.y));
          diffuseColor.rgb = mix(diffuseColor.rgb, uA * 0.9, pa);
          diffuseColor.rgb = mix(diffuseColor.rgb, uB * 0.9, pb);
          float gInk = pa + pb; vec3 gCol = uA * pa + uB * pb; float gSeam = seam;`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          totalEmissiveRadiance += gCol * 0.45 + vec3(0.55, 0.9, 1.0) * gSeam * 0.35 * (1.0 - gInk);`);
    };
    this.box = new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.7, size), mat);
    this.add(this.box);
    this.mat = mat;

    // ネオンのふち
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(this.box.geometry), new THREE.LineBasicMaterial({ color: '#9fe8ff', toneMapped: false }));
    edges.material.color.multiplyScalar(2.2);
    this.add(edges);
    this.edges = edges;

    // まわるリング
    this.halo = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(size * (0.85 + i * 0.12), 0.08, 6, 96),
        new THREE.MeshBasicMaterial({ color: i === 1 ? colorB : colorA, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
      r.rotation.x = Math.PI / 2 + (i - 1) * 0.25;
      this.add(r);
      this.halo.push(r);
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#8f7bff', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.setScalar(size * 3.2);
    this.add(glow);
    this.glow = glow;
    this.size = size;
  }

  setColors(a, b) { this.uniforms.uA.value.set(a); this.uniforms.uB.value.set(b); }
  setFill(v, bias = 0.5) { this.uniforms.uFill.value = v; this.uniforms.uBias.value = bias; }

  update(dt) {
    this.uniforms.uTime.value += dt;
    this.halo.forEach((r, i) => { r.rotation.z += dt * (0.1 + i * 0.05) * (i % 2 ? -1 : 1); });
  }

  dispose() {
    this.traverse((o) => { o.geometry?.dispose(); if (o.material) o.material.dispose(); });
  }
}
