// =========================================================
// Backdrop — ムービー / メニュー用の背景(夜空 + 浮かぶキューブ + スタジアム)
// =========================================================
import * as THREE from 'three';
import { Sky } from '../vfx/Sky.js';
import { Decor } from '../vfx/Decor.js';
import { Stadium } from '../vfx/Stadium.js';
import { Robot } from '../game/Robot.js';
import { settings } from '../core/Settings.js';

export function buildBackdrop(scene, { stadium = true, size = 20, fill = 0.35, robots = true } = {}) {
  const teams = settings.teams();
  const sky = new Sky({ top: '#05061a', mid: '#1b1450', bottom: '#5a1f6e', stars: 1.4, aurora: 0.8, sunDir: [0.3, 0.25, -1], sunColor: '#ff6fd0' });
  scene.add(sky);
  const decor = new Decor({ rMin: 45, rMax: 170, cubes: 70, clouds: 18, colors: ['#2a2f55', '#3b2a66', '#1f3a66', '#4a2050'], cloudColor: '#6a4fd0', cloudOpacity: 0.28 });
  scene.add(decor);
  scene.add(new THREE.HemisphereLight('#8fa8ff', '#ff5fb0', 1.2));
  const key = new THREE.DirectionalLight('#ffffff', 1.4);
  key.position.set(12, 20, 16);
  scene.add(key);
  const rimA = new THREE.PointLight(teams[0].color, 80, 60, 1.6);
  rimA.position.set(-size, size * 0.3, size * 0.6);
  const rimB = new THREE.PointLight(teams[1].color, 80, 60, 1.6);
  rimB.position.set(size, size * 0.2, -size * 0.6);
  scene.add(rimA, rimB);
  scene.fog = new THREE.FogExp2('#0b0a24', 0.006);

  let st = null;
  const bots = [];
  if (stadium) {
    st = new Stadium({ size, colorA: teams[0].color, colorB: teams[1].color });
    st.setFill(fill);
    scene.add(st);
    if (robots) {
      // 上の面と横の面に立つ選手(重力が自由なイメージ)
      const top = new Robot(teams[0].color);
      top.position.set(-2, size * 0.35 + 0.5, 2);
      top.rotation.y = 0.6;
      const side = new Robot(teams[1].color);
      side.position.set(size / 2 + 0.5, 1.5, -2);
      side.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0));
      side.rotateY(-0.8);
      st.add(top, side);
      bots.push(top, side);
    }
  }
  return {
    sky, decor, stadium: st, bots,
    update(dt, camera) {
      sky.update(dt, camera);
      decor.update(dt);
      st?.update(dt);
      for (const b of bots) b.update(dt, { speed: 0, grounded: true, pitch: Math.sin(performance.now() * 0.001) * 0.2 });
    },
    dispose() { bots.forEach((b) => b.dispose()); decor.dispose(); st?.dispose(); },
  };
}
