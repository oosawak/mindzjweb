// =========================================================
// Rings — しょうげきは / タップした場所のマーカー
// =========================================================
import * as THREE from 'three';
import { Ease } from '../core/Tween.js';

const Z = new THREE.Vector3(0, 0, 1);

function ringMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#ffffff') },
      uR: { value: 0.5 },
      uW: { value: 0.1 },
      uA: { value: 1 },
      uFill: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uR, uW, uA, uFill;
      varying vec2 vUv;
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float ring = smoothstep(uW, 0.0, abs(r - uR));
        float fill = uFill * smoothstep(uR, 0.0, r) * 0.35;
        float a = (ring + fill) * uA;
        if (a < 0.005) discard;
        gl_FragColor = vec4(uColor * 1.8, a);
      }`,
  });
}

export class Rings {
  constructor(parent, count = 18) {
    this.pool = [];
    const geo = new THREE.PlaneGeometry(2, 2);
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, ringMaterial());
      m.visible = false;
      m.renderOrder = 6;
      m.frustumCulled = false;
      parent.add(m);
      this.pool.push({ mesh: m, t: 0, life: 0, size: 1, active: false, width: 0.1, fill: 0 });
    }
    this.cursor = 0;
  }

  spawn({ pos, normal = Z, color = '#ffffff', size = 3, life = 0.6, width = 0.12, fill = 0, offset = 0.04 }) {
    const r = this.pool[this.cursor];
    this.cursor = (this.cursor + 1) % this.pool.length;
    r.active = true;
    r.t = 0;
    r.life = life;
    r.size = size;
    r.width = width;
    r.fill = fill;
    r.mesh.visible = true;
    r.mesh.position.copy(pos).addScaledVector(normal, offset);
    r.mesh.quaternion.setFromUnitVectors(Z, normal);
    r.mesh.scale.setScalar(size);
    r.mesh.material.uniforms.uColor.value.set(color);
    r.mesh.material.uniforms.uW.value = width;
    r.mesh.material.uniforms.uFill.value = fill;
    return r;
  }

  update(dt) {
    for (const r of this.pool) {
      if (!r.active) continue;
      r.t += dt;
      const p = Math.min(1, r.t / r.life);
      const u = r.mesh.material.uniforms;
      u.uR.value = 0.05 + Ease.outCubic(p) * 0.9;
      u.uA.value = 1 - Ease.inQuad(p);
      if (p >= 1) { r.active = false; r.mesh.visible = false; }
    }
  }

  clear() { for (const r of this.pool) { r.active = false; r.mesh.visible = false; } }
}

/** 落下地点マーカー(常に1つ) */
export class LandingMarker extends THREE.Mesh {
  constructor() {
    const mat = ringMaterial();
    super(new THREE.PlaneGeometry(2, 2), mat);
    mat.uniforms.uColor.value.set('#ffffff');
    mat.uniforms.uW.value = 0.12;
    mat.uniforms.uR.value = 0.75;
    mat.uniforms.uFill.value = 1;
    this.renderOrder = 4;
    this.frustumCulled = false;
    this.visible = false;
    this.t = 0;
  }

  place(pos, normal, distance, dt, color = '#ffffff') {
    this.t += dt;
    this.visible = true;
    this.position.copy(pos).addScaledVector(normal, 0.03);
    this.quaternion.setFromUnitVectors(Z, normal);
    const s = THREE.MathUtils.clamp(0.35 + distance * 0.02, 0.35, 0.9);
    this.scale.setScalar(s);
    const u = this.material.uniforms;
    u.uColor.value.set(color);
    u.uA.value = THREE.MathUtils.clamp(0.25 + 0.4 * (1 - distance / 40), 0.15, 0.6) * (0.8 + 0.2 * Math.sin(this.t * 8));
  }
}
