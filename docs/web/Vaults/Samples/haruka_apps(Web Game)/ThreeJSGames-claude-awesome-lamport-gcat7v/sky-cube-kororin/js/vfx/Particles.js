// =========================================================
// Particles — 1つの Points で大量のパーティクルを管理
//  shape 0: ふんわり丸 / 1: キラキラ十字 / 2: リング
// =========================================================
import * as THREE from 'three';

const _v = new THREE.Vector3();

export class Particles {
  constructor(max = 1500) {
    this.max = max;
    this.cursor = 0;
    const geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.alpha = new Float32Array(max);
    this.shape = new Float32Array(max);
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('shape', new THREE.BufferAttribute(this.shape, 1).setUsage(THREE.DynamicDrawUsage));

    // CPU 側データ
    this.vel = new Float32Array(max * 3);
    this.grav = new Float32Array(max * 3);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max);
    this.size0 = new Float32Array(max);
    this.size1 = new Float32Array(max);
    this.drag = new Float32Array(max);
    this.spin = new Float32Array(max);

    this.uniforms = { uScale: { value: 600 } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float size;
        attribute float alpha;
        attribute float shape;
        attribute vec3 color;
        uniform float uScale;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vShape;
        void main() {
          vColor = color;
          vShape = shape;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vAlpha = alpha * smoothstep(0.6, 3.0, -mv.z);
          gl_PointSize = alpha <= 0.0 ? 0.0 : min(size * uScale / max(0.1, -mv.z), 160.0);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vShape;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float r = length(c);
          float a;
          if (vShape < 0.5) {
            a = smoothstep(0.5, 0.0, r);
            a *= a;
          } else if (vShape < 1.5) {
            float cx = smoothstep(0.07, 0.0, abs(c.x)) * smoothstep(0.5, 0.0, abs(c.y));
            float cy = smoothstep(0.07, 0.0, abs(c.y)) * smoothstep(0.5, 0.0, abs(c.x));
            a = max(max(cx, cy), smoothstep(0.2, 0.0, r));
          } else {
            a = smoothstep(0.06, 0.0, abs(r - 0.4));
          }
          if (a < 0.01) discard;
          gl_FragColor = vec4(vColor * 1.6, a * vAlpha);
        }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    this._c0 = new THREE.Color();
    this._c1 = new THREE.Color();
  }

  setViewport(heightPx, fovDeg) {
    this.uniforms.uScale.value = heightPx / (2 * Math.tan(THREE.MathUtils.degToRad(fovDeg) / 2));
  }

  /**
   * @param {object} o
   * @param {THREE.Vector3} o.pos
   * @param {THREE.Vector3} [o.vel]   基本の速度
   * @param {number} [o.speed]        ランダム方向の速さ
   * @param {THREE.Vector3} [o.gravity]
   */
  emit(o) {
    const count = o.count ?? 1;
    const c0 = this._c0.set(o.color ?? '#ffffff');
    const c1 = this._c1.set(o.color2 ?? o.color ?? '#ffffff');
    for (let n = 0; n < count; n++) {
      const i = this.cursor;
      this.cursor = (this.cursor + 1) % this.max;
      const i3 = i * 3;
      const spread = o.spread ?? 0;
      this.pos[i3] = o.pos.x + (Math.random() - 0.5) * spread;
      this.pos[i3 + 1] = o.pos.y + (Math.random() - 0.5) * spread;
      this.pos[i3 + 2] = o.pos.z + (Math.random() - 0.5) * spread;
      _v.set(0, 0, 0);
      if (o.vel) _v.copy(o.vel);
      const sp = (o.speed ?? 0) * (0.4 + Math.random() * 0.6);
      if (sp > 0) {
        const u = Math.random() * 2 - 1;
        const th = Math.random() * Math.PI * 2;
        const s = Math.sqrt(1 - u * u);
        _v.x += Math.cos(th) * s * sp;
        _v.y += u * sp;
        _v.z += Math.sin(th) * s * sp;
      }
      this.vel[i3] = _v.x; this.vel[i3 + 1] = _v.y; this.vel[i3 + 2] = _v.z;
      const g = o.gravity;
      this.grav[i3] = g ? g.x : 0; this.grav[i3 + 1] = g ? g.y : 0; this.grav[i3 + 2] = g ? g.z : 0;
      const t = Math.random();
      this.col[i3] = c0.r + (c1.r - c0.r) * t;
      this.col[i3 + 1] = c0.g + (c1.g - c0.g) * t;
      this.col[i3 + 2] = c0.b + (c1.b - c0.b) * t;
      const life = (o.life ?? 1) * (1 - (o.lifeVar ?? 0.3) * Math.random());
      this.life[i] = life;
      this.maxLife[i] = life;
      this.size0[i] = (o.size ?? 0.3) * (0.7 + Math.random() * 0.6);
      this.size1[i] = o.sizeEnd ?? 0;
      this.drag[i] = o.drag ?? 0;
      this.shape[i] = o.shape ?? 0;
      this.alpha[i] = 1;
      this.size[i] = this.size0[i];
    }
  }

  update(dt) {
    const { pos, vel, grav, life, maxLife } = this;
    for (let i = 0; i < this.max; i++) {
      if (life[i] <= 0) { if (this.alpha[i] !== 0) this.alpha[i] = 0; continue; }
      life[i] -= dt;
      const i3 = i * 3;
      const d = Math.exp(-this.drag[i] * dt);
      vel[i3] = (vel[i3] + grav[i3] * dt) * d;
      vel[i3 + 1] = (vel[i3 + 1] + grav[i3 + 1] * dt) * d;
      vel[i3 + 2] = (vel[i3 + 2] + grav[i3 + 2] * dt) * d;
      pos[i3] += vel[i3] * dt;
      pos[i3 + 1] += vel[i3 + 1] * dt;
      pos[i3 + 2] += vel[i3 + 2] * dt;
      const p = Math.max(0, life[i] / maxLife[i]); // 1 → 0
      this.size[i] = this.size1[i] + (this.size0[i] - this.size1[i]) * p;
      this.alpha[i] = life[i] <= 0 ? 0 : Math.min(1, p * 2.2) * (p > 0.92 ? (1 - p) / 0.08 : 1);
    }
    const a = this.points.geometry.attributes;
    a.position.needsUpdate = true;
    a.color.needsUpdate = true;
    a.size.needsUpdate = true;
    a.alpha.needsUpdate = true;
    a.shape.needsUpdate = true;
  }

  clear() { this.life.fill(0); this.alpha.fill(0); }

  dispose() {
    this.points.geometry.dispose();
    this.points.material.dispose();
  }
}
