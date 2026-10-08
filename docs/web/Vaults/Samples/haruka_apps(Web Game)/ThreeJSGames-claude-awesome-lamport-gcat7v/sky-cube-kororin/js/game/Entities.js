// =========================================================
// Entities — きらきら(ほしのかけら) / ゴールの おおぼし
// =========================================================
import * as THREE from 'three';
import { createStarGeometry } from './StarGeometry.js';
import { glowTexture } from '../vfx/Textures.js';

const starMat = () => new THREE.MeshStandardMaterial({ color: '#ffe066', emissive: '#ffb300', emissiveIntensity: 1.1, roughness: 0.25, metalness: 0.1 });

/** あつめる ほしのかけら */
export class StarPickup extends THREE.Group {
  constructor(pos) {
    super();
    this.position.copy(pos);
    this.base = pos.clone();
    this.mesh = new THREE.Mesh(createStarGeometry(0.34, 0.15, 0.12), starMat());
    this.mesh.castShadow = true;
    this.add(this.mesh);
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffd447', transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.glow.scale.setScalar(1.8);
    this.add(this.glow);
    this.t = Math.random() * 10;
    this.collected = false;
    this.radius = 0.9;
  }

  update(dt, up) {
    if (this.collected) return;
    this.t += dt;
    this.mesh.rotation.y += dt * 2.4;
    this.mesh.rotation.z = Math.sin(this.t * 1.3) * 0.2;
    // いまの「うえ」方向にぷかぷか
    this.position.copy(this.base).addScaledVector(up, Math.sin(this.t * 2.2) * 0.12);
    const s = 1 + Math.sin(this.t * 4) * 0.08;
    this.glow.scale.setScalar(1.8 * s);
  }

  dispose() {
    this.mesh.material.dispose();
    this.glow.material.dispose();
  }
}

/** ゴール: おおきな ほしのかけら + まわる リング */
export class Goal extends THREE.Group {
  constructor(pos, normal, need = 0) {
    super();
    this.position.copy(pos);
    this.normal = normal.clone();
    this.need = need;
    this.open = need === 0;
    this.radius = 1.5;
    this.t = 0;

    const align = new THREE.Group();
    align.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    this.add(align);
    this.align = align;

    this.starMat = new THREE.MeshStandardMaterial({ color: '#fff3a0', emissive: '#ffbb00', emissiveIntensity: 1.6, roughness: 0.2 });
    this.star = new THREE.Mesh(createStarGeometry(0.9, 0.4, 0.3), this.starMat);
    this.star.castShadow = true;
    align.add(this.star);

    this.ringMat = new THREE.MeshBasicMaterial({ color: '#ffe27a', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    this.rings = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.35 + i * 0.25, 0.035, 8, 64), this.ringMat);
      r.rotation.x = Math.PI / 2 + i * 0.5;
      r.rotation.y = i * 0.7;
      align.add(r);
      this.rings.push(r);
    }
    // 足元の光の柱
    const beamGeo = new THREE.CylinderGeometry(1.2, 1.6, 6, 32, 1, true);
    beamGeo.translate(0, 3, 0);
    this.beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#ffe27a') }, uA: { value: 0.5 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float uTime; uniform vec3 uColor; uniform float uA; varying vec2 vUv;
        void main(){
          float stripes = 0.6 + 0.4 * sin(vUv.y * 20.0 - uTime * 6.0 + vUv.x * 6.2831 * 3.0);
          float a = (1.0 - vUv.y) * stripes * uA;
          gl_FragColor = vec4(uColor * 1.5, a);
        }`,
    });
    this.beam = new THREE.Mesh(beamGeo, this.beamMat);
    this.beam.position.y = -1.6;
    align.add(this.beam);

    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffd447', transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.glow.scale.setScalar(5);
    this.add(this.glow);
    this.setOpen(this.open, true);
  }

  setOpen(open, instant = false) {
    this.open = open;
    this.starMat.emissiveIntensity = open ? 1.6 : 0.15;
    this.starMat.color.set(open ? '#fff3a0' : '#9aa0c8');
    this.ringMat.color.set(open ? '#ffe27a' : '#8088c0');
    this.ringMat.opacity = open ? 0.9 : 0.35;
    this.glow.material.opacity = open ? 0.9 : 0.15;
    this.beamMat.uniforms.uA.value = open ? 0.5 : 0.08;
    if (!instant) this.popT = 0;
  }

  update(dt) {
    this.t += dt;
    this.beamMat.uniforms.uTime.value = this.t;
    this.star.rotation.y += dt * (this.open ? 1.6 : 0.4);
    this.star.position.y = Math.sin(this.t * 1.8) * 0.15;
    this.rings.forEach((r, i) => { r.rotation.z += dt * (0.8 + i * 0.4) * (i % 2 ? -1 : 1); });
    let s = 1;
    if (this.popT !== undefined && this.popT < 1) {
      this.popT += dt / 0.6;
      s = 1 + Math.sin(Math.min(1, this.popT) * Math.PI) * 0.5;
    }
    this.star.scale.setScalar(s);
    this.glow.scale.setScalar((5 + Math.sin(this.t * 3) * 0.4) * s);
  }

  dispose() {
    this.traverse((o) => { if (o.geometry && o !== this.star) o.geometry.dispose(); });
    [this.starMat, this.ringMat, this.beamMat, this.glow.material].forEach((m) => m.dispose());
  }
}
