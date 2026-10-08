// =========================================================
// Sky — グラデーションの空 + またたく星 + 太陽の光
// =========================================================
import * as THREE from 'three';

export class Sky extends THREE.Mesh {
  constructor({
    top = '#3d5bd8', mid = '#9cc8ff', bottom = '#ffd6ec',
    sunDir = [0.4, 0.35, -0.8], sunColor = '#fff2c4', stars = 0.3, aurora = 0.0,
  } = {}) {
    const uniforms = {
      uTop: { value: new THREE.Color(top) },
      uMid: { value: new THREE.Color(mid) },
      uBottom: { value: new THREE.Color(bottom) },
      uSunDir: { value: new THREE.Vector3(...sunDir).normalize() },
      uSunColor: { value: new THREE.Color(sunColor) },
      uStars: { value: stars },
      uAurora: { value: aurora },
      uTime: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = position;
          vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = p.xyww;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop, uMid, uBottom, uSunDir, uSunColor;
        uniform float uStars, uTime, uAurora;
        varying vec3 vDir;
        float hash3(vec3 p) {
          p = fract(p * 0.3183099 + 0.1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          vec3 col = h > 0.0 ? mix(uMid, uTop, pow(h, 0.55)) : mix(uMid, uBottom, pow(-h, 0.45));
          float s = max(dot(d, uSunDir), 0.0);
          col += uSunColor * (pow(s, 90.0) * 2.2 + pow(s, 8.0) * 0.25);
          // オーロラのような帯
          if (uAurora > 0.0) {
            float band = sin(d.x * 6.0 + uTime * 0.25 + sin(d.z * 4.0 + uTime * 0.2) * 1.5);
            float mask = smoothstep(0.1, 0.5, h) * smoothstep(0.95, 0.5, h);
            col += mix(vec3(0.3, 1.0, 0.8), vec3(1.0, 0.5, 0.9), 0.5 + 0.5 * band) * mask * (0.5 + 0.5 * band) * 0.18 * uAurora;
          }
          // 星
          vec3 p = d * 230.0;
          vec3 cell = floor(p);
          float r = hash3(cell);
          if (r > 0.982) {
            vec3 f = fract(p) - 0.5;
            float st = smoothstep(0.32, 0.0, length(f));
            float tw = 0.55 + 0.45 * sin(uTime * (1.5 + r * 3.0) + r * 90.0);
            col += vec3(1.0, 0.95, 0.85) * st * tw * uStars * 2.0 * smoothstep(-0.3, 0.3, h);
          }
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    super(new THREE.SphereGeometry(500, 48, 24), material);
    this.frustumCulled = false;
    this.renderOrder = -10;
    this.uniforms = uniforms;
  }

  setColors({ top, mid, bottom, stars, sunColor, aurora }) {
    if (top) this.uniforms.uTop.value.set(top);
    if (mid) this.uniforms.uMid.value.set(mid);
    if (bottom) this.uniforms.uBottom.value.set(bottom);
    if (sunColor) this.uniforms.uSunColor.value.set(sunColor);
    if (stars !== undefined) this.uniforms.uStars.value = stars;
    if (aurora !== undefined) this.uniforms.uAurora.value = aurora;
  }

  update(dt, camera) {
    this.uniforms.uTime.value += dt;
    this.position.copy(camera.position);
  }
}
