// =========================================================
// Decor — 遠くに浮かぶキューブと雲(背景演出)
// =========================================================
import * as THREE from 'three';
import { cloudTexture } from './Textures.js';
import { rand } from '../core/Tween.js';

export class Decor extends THREE.Group {
  constructor({
    center = new THREE.Vector3(), cubes = 60, clouds = 26,
    rMin = 70, rMax = 200, colors = ['#ffffff', '#ffd6ec', '#c8e4ff', '#fff3b0'],
    cloudColor = '#ffffff', cloudOpacity = 0.75,
  } = {}) {
    super();
    this.position.copy(center);

    // 浮かぶキューブ
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, emissive: '#2a3a7a', emissiveIntensity: 0.25 });
    this.cubes = new THREE.InstancedMesh(geo, mat, cubes);
    this.cubeData = [];
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    for (let i = 0; i < cubes; i++) {
      const r = rand(rMin, rMax);
      const th = Math.random() * Math.PI * 2;
      const ph = rand(-0.9, 0.9);
      const d = {
        pos: new THREE.Vector3(Math.cos(th) * Math.cos(ph) * r, Math.sin(ph) * r, Math.sin(th) * Math.cos(ph) * r),
        rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        spin: new THREE.Vector3(rand(-0.3, 0.3), rand(-0.3, 0.3), rand(-0.3, 0.3)),
        size: rand(2, 9),
        bob: Math.random() * 6,
      };
      this.cubeData.push(d);
      m.compose(d.pos, new THREE.Quaternion().setFromEuler(d.rot), new THREE.Vector3().setScalar(d.size));
      this.cubes.setMatrixAt(i, m);
      this.cubes.setColorAt(i, c.set(colors[i % colors.length]));
    }
    this.cubes.frustumCulled = false;
    this.add(this.cubes);

    // 雲
    this.clouds = [];
    const tex = cloudTexture();
    for (let i = 0; i < clouds; i++) {
      const mat2 = new THREE.SpriteMaterial({ map: tex, color: cloudColor, transparent: true, opacity: cloudOpacity * rand(0.5, 1), depthWrite: false, fog: false });
      const s = new THREE.Sprite(mat2);
      const r = rand(rMin * 0.8, rMax * 1.1);
      const th = Math.random() * Math.PI * 2;
      s.position.set(Math.cos(th) * r, rand(-60, 30), Math.sin(th) * r);
      const sc = rand(30, 80);
      s.scale.set(sc, sc * 0.55, 1);
      s.userData.speed = rand(0.005, 0.02) * (Math.random() < 0.5 ? -1 : 1);
      s.userData.r = r;
      s.userData.th = th;
      this.clouds.push(s);
      this.add(s);
    }
    this._m = m;
    this._q = new THREE.Quaternion();
    this._s = new THREE.Vector3();
    this._p = new THREE.Vector3();
    this.t = 0;
  }

  update(dt) {
    this.t += dt;
    const m = this._m;
    for (let i = 0; i < this.cubeData.length; i++) {
      const d = this.cubeData[i];
      d.rot.x += d.spin.x * dt;
      d.rot.y += d.spin.y * dt;
      d.rot.z += d.spin.z * dt;
      this._q.setFromEuler(d.rot);
      this._p.copy(d.pos);
      this._p.y += Math.sin(this.t * 0.4 + d.bob) * 1.5;
      m.compose(this._p, this._q, this._s.setScalar(d.size));
      this.cubes.setMatrixAt(i, m);
    }
    this.cubes.instanceMatrix.needsUpdate = true;
    for (const s of this.clouds) {
      s.userData.th += s.userData.speed * dt;
      s.position.x = Math.cos(s.userData.th) * s.userData.r;
      s.position.z = Math.sin(s.userData.th) * s.userData.r;
    }
  }

  dispose() {
    this.cubes.geometry.dispose();
    this.cubes.material.dispose();
    for (const s of this.clouds) s.material.dispose();
  }
}
