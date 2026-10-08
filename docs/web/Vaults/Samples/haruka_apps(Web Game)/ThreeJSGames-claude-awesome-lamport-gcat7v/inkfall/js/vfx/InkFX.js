// =========================================================
// InkFX — インクの演出
//  弾(光る球 + 軌跡)/ しぶき / インクアウト / スタンプ / ボム / 重力切り替え
// =========================================================
import * as THREE from 'three';
import { Particles } from './Particles.js';
import { Rings } from './Rings.js';
import { glowTexture } from './Textures.js';

const MAX_SHOTS = 256;
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _v = new THREE.Vector3();

export class InkFX {
  constructor(scene, maxParticles = 2000) {
    this.scene = scene;
    this.particles = new Particles(maxParticles);
    scene.add(this.particles.points);
    this.rings = new Rings(scene, 24);

    // 弾
    const geo = new THREE.SphereGeometry(0.13, 10, 8);
    this.shotMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    this.shotMesh = new THREE.InstancedMesh(geo, this.shotMat, MAX_SHOTS);
    this.shotMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.shotMesh.frustumCulled = false;
    this.shotMesh.count = 0;
    scene.add(this.shotMesh);
    this._col = new THREE.Color();

    // ボム
    this.bombMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2 });
    this.bombGeo = new THREE.IcosahedronGeometry(0.3, 1);
    this.bombMeshes = [];

    this.glowTex = glowTexture();
  }

  setViewport(h, fov) { this.particles.setViewport(h, fov); }

  /** 弾と軌跡を描く(Match.shots / bombs をそのまま読む) */
  drawShots(shots, bombs, dt) {
    const n = Math.min(MAX_SHOTS, shots.length);
    for (let i = 0; i < n; i++) {
      const s = shots[i];
      _s.setScalar(1);
      _m.compose(s.pos, _q, _s);
      this.shotMesh.setMatrixAt(i, _m);
      this.shotMesh.setColorAt(i, this._col.set(s.color).multiplyScalar(2.2));
      if (Math.random() < 0.7) this.particles.emit({ pos: s.pos, color: s.color, size: 0.22, sizeEnd: 0.05, life: 0.22 });
    }
    this.shotMesh.count = n;
    this.shotMesh.instanceMatrix.needsUpdate = true;
    if (this.shotMesh.instanceColor) this.shotMesh.instanceColor.needsUpdate = true;

    while (this.bombMeshes.length < bombs.length) {
      const m = new THREE.Mesh(this.bombGeo, this.bombMat.clone());
      this.scene.add(m);
      this.bombMeshes.push(m);
    }
    this.bombMeshes.forEach((m, i) => {
      const b = bombs[i];
      m.visible = !!b;
      if (!b) return;
      m.position.copy(b.pos);
      m.rotation.x += dt * 8;
      m.rotation.y += dt * 6;
      m.material.color.set(b.owner.color);
      m.material.emissive.set(b.owner.color);
      this.particles.emit({ pos: b.pos, color: b.owner.color, color2: '#ffffff', size: 0.5, life: 0.4, speed: 0.6, shape: 1 });
    });
  }

  splat(pos, normal, color, scale = 1) {
    _v.copy(normal).multiplyScalar(4 * scale);
    this.particles.emit({ pos, vel: _v, speed: 3.5 * scale, count: Math.round(9 * scale), color, color2: '#ffffff', size: 0.28 * scale, sizeEnd: 0.05, life: 0.45, drag: 3, gravity: normal.clone().multiplyScalar(-14) });
    this.rings.spawn({ pos, normal, color, size: 1.1 * scale, life: 0.3, width: 0.2, fill: 0.5 });
  }

  muzzle(pos, color) {
    this.particles.emit({ pos, count: 3, color, color2: '#ffffff', speed: 1.5, size: 0.25, life: 0.12 });
  }

  inkout(pos, color) {
    this.particles.emit({ pos, count: 60, color, color2: '#ffffff', speed: 9, size: 0.45, sizeEnd: 0.1, life: 0.9, drag: 2.5, shape: 0 });
    this.particles.emit({ pos, count: 20, color: '#ffffff', speed: 5, size: 0.3, life: 0.5, drag: 3, shape: 1 });
    for (const n of [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]) {
      this.rings.spawn({ pos, normal: n, color, size: 3.2, life: 0.5, width: 0.1 });
    }
  }

  stamp(pos, normal, color) {
    this.rings.spawn({ pos, normal, color, size: 6.5, life: 0.55, width: 0.09 });
    this.rings.spawn({ pos, normal, color: '#ffffff', size: 4, life: 0.35, width: 0.12, fill: 0.4 });
    _v.copy(normal).multiplyScalar(6);
    this.particles.emit({ pos, vel: _v, speed: 10, count: 50, color, color2: '#ffffff', size: 0.5, sizeEnd: 0.1, life: 0.8, drag: 2.2, gravity: normal.clone().multiplyScalar(-16) });
  }

  bombBoom(pos, color) {
    this.particles.emit({ pos, count: 90, color, color2: '#ffffff', speed: 14, size: 0.6, sizeEnd: 0.1, life: 1.0, drag: 2, shape: 1 });
    for (let i = 0; i < 3; i++) {
      const n = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      this.rings.spawn({ pos, normal: n, color, size: 9, life: 0.7, width: 0.06 });
    }
  }

  flipTrail(pos, color) {
    this.particles.emit({ pos, count: 14, color, color2: '#ffffff', speed: 2.5, size: 0.3, life: 0.5, drag: 3, shape: 1 });
  }

  respawn(pos, up, color) {
    _v.copy(up).multiplyScalar(5);
    this.particles.emit({ pos, vel: _v, speed: 1.5, count: 30, color, color2: '#ffffff', size: 0.3, life: 0.8, spread: 0.8, shape: 1 });
    this.rings.spawn({ pos: pos.clone().addScaledVector(up, -0.48), normal: up, color, size: 2.2, life: 0.6 });
  }

  boom(pos) {
    this.particles.emit({ pos, count: 120, color: '#ffb31f', color2: '#ff3d3d', speed: 16, size: 0.8, sizeEnd: 0.2, life: 1.1, drag: 1.8 });
    this.particles.emit({ pos, count: 30, color: '#ffffff', speed: 8, size: 1.2, life: 0.4, drag: 3 });
    for (let i = 0; i < 3; i++) {
      const n = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      this.rings.spawn({ pos, normal: n, color: '#ffb31f', size: 8, life: 0.6, width: 0.08 });
    }
  }

  shove(pos, up, color) {
    this.rings.spawn({ pos, normal: up, color, size: 5.5, life: 0.35, width: 0.12, fill: 0.3 });
  }

  ambient(center, dt) {
    if (Math.random() < dt * 14) {
      _v.set(center.x + (Math.random() - 0.5) * 24, center.y + (Math.random() - 0.5) * 16, center.z + (Math.random() - 0.5) * 24);
      this.particles.emit({ pos: _v, color: '#8fe8ff', color2: '#ff9fd2', size: 0.12, life: 3, speed: 0.3 });
    }
  }

  update(dt) {
    this.particles.update(dt);
    this.rings.update(dt);
  }

  dispose() {
    this.particles.dispose();
    this.shotMesh.geometry.dispose();
    this.shotMat.dispose();
    this.bombGeo.dispose();
    this.bombMeshes.forEach((m) => m.material.dispose());
  }
}
