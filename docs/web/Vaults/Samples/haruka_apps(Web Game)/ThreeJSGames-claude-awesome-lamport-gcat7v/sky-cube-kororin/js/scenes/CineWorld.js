// =========================================================
// CineWorld — タイトル / ムービー用の 3D 背景セット
//  ・空 / 雲 / うかぶ しま / ライト をまとめて作る
//  ・「ゆめぼし」(おおきな ほし のキャラクター)
// =========================================================
import * as THREE from 'three';
import { Level } from '../game/Level.js';
import { Sky } from '../vfx/Sky.js';
import { Decor } from '../vfx/Decor.js';
import { glowTexture } from '../vfx/Textures.js';
import { createStarGeometry } from '../game/StarGeometry.js';
import stage1 from '../game/levels/stage1.js';

export function buildCineWorld(scene, engine, {
  sky = stage1.sky,
  palette = stage1.palette,
  lights = stage1.lights,
  islands = [],
  decor = stage1.decor,
  fog = null,
} = {}) {
  const skyMesh = new Sky(sky);
  scene.add(skyMesh);
  const level = new Level({
    palette,
    lights,
    build(b) { for (const [c, s, ci] of islands) b.block(c, s, { c: ci ?? 0 }); },
    bounds: { center: [0, 0, 0], radius: 9999 },
  });
  scene.add(level.group);
  level.sun.castShadow = engine.quality.shadows;
  level.sun.shadow.camera.left = level.sun.shadow.camera.bottom = -30;
  level.sun.shadow.camera.right = level.sun.shadow.camera.top = 30;
  level.sun.shadow.camera.far = 120;
  level.sun.shadow.camera.updateProjectionMatrix();
  level.sunOffset.multiplyScalar(2.5);
  level.followLight(new THREE.Vector3());
  const dec = new Decor({ ...decor });
  scene.add(dec);
  if (fog) scene.fog = new THREE.Fog(fog.color, fog.near, fog.far);

  return {
    sky: skyMesh,
    level,
    decor: dec,
    update(dt, camera) {
      skyMesh.update(dt, camera);
      dec.update(dt);
      level.update(dt, null);
    },
    dispose() {
      level.dispose();
      dec.dispose();
    },
  };
}

/** ゆめぼし — 空を てらす おおきな ほし(やさしい顔つき) */
export class Yumeboshi extends THREE.Group {
  constructor(size = 3) {
    super();
    this.mat = new THREE.MeshStandardMaterial({ color: '#fff3a0', emissive: '#ffbb00', emissiveIntensity: 1.4, roughness: 0.3 });
    this.star = new THREE.Mesh(createStarGeometry(size, size * 0.45, size * 0.3), this.mat);
    this.add(this.star);
    // かお
    const face = new THREE.MeshBasicMaterial({ color: '#7a4a00' });
    this.faceMat = face;
    const z = size * 0.3 * 0.5 + size * 0.3 * 0.6 + 0.02;
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.TorusGeometry(size * 0.09, size * 0.022, 8, 16, Math.PI), face);
      eye.position.set(sx * size * 0.2, size * 0.08, z);
      this.star.add(eye);
    }
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(size * 0.08, size * 0.02, 8, 16, Math.PI), face);
    mouth.rotation.z = Math.PI;
    mouth.position.set(0, -size * 0.12, z);
    this.star.add(mouth);
    const cheekMat = new THREE.MeshBasicMaterial({ color: '#ff9cc2', transparent: true, opacity: 0.6 });
    this.cheekMat = cheekMat;
    for (const sx of [-1, 1]) {
      const ch = new THREE.Mesh(new THREE.CircleGeometry(size * 0.07, 16), cheekMat);
      ch.position.set(sx * size * 0.34, -size * 0.06, z);
      this.star.add(ch);
    }
    this.glowMat = new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffe27a', transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
    this.glow = new THREE.Sprite(this.glowMat);
    this.glow.scale.setScalar(size * 6);
    this.add(this.glow);
    this.size = size;
    this.t = 0;
    this.brightness = 1;
  }

  setBrightness(v) {
    this.brightness = v;
    this.mat.emissiveIntensity = 0.1 + v * 1.4;
    this.mat.color.setRGB(0.6 + v * 0.4, 0.6 + v * 0.35, 0.65 + v * 0.0);
    this.glowMat.opacity = v * 0.9;
  }

  update(dt) {
    this.t += dt;
    this.star.rotation.z = Math.sin(this.t * 0.8) * 0.08;
    this.star.position.y = Math.sin(this.t * 1.1) * this.size * 0.05;
    this.glow.scale.setScalar(this.size * (6 + Math.sin(this.t * 2) * 0.3));
  }

  dispose() {
    this.traverse((o) => { if (o.geometry && o !== this.star) o.geometry.dispose(); });
    [this.mat, this.faceMat, this.cheekMat, this.glowMat].forEach((m) => m.dispose());
  }
}
