// =========================================================
// Kororin — オリジナルキャラクター「ころりん」(すべてコードで生成)
//  まあるい おもちのような からだに、ほしの アンテナ。
//  原点 = からだの中心 / 前方 = +Z
// =========================================================
import * as THREE from 'three';
import { glowTexture } from '../vfx/Textures.js';
import { createStarGeometry } from './StarGeometry.js';

const BODY_R = 0.45;

export class Kororin extends THREE.Group {
  constructor({ bodyColor = '#fff4dc', accent = '#ffb37a' } = {}) {
    super();
    this.rig = new THREE.Group();       // つぶれ・のび用(足元が支点)
    this.rig.position.y = -BODY_R;
    this.add(this.rig);
    this.inner = new THREE.Group();
    this.inner.position.y = BODY_R;
    this.rig.add(this.inner);

    const skin = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.42, emissive: '#ffb08a', emissiveIntensity: 0.12 });
    const dark = new THREE.MeshStandardMaterial({ color: '#2b2140', roughness: 0.3 });
    const white = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const pink = new THREE.MeshBasicMaterial({ color: '#ff8fb0', transparent: true, opacity: 0.55, depthWrite: false });
    const foot = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5 });
    this.materials = [skin, dark, white, pink, foot];

    // からだ
    this.body = new THREE.Mesh(new THREE.SphereGeometry(BODY_R, 40, 28), skin);
    this.body.scale.set(1.04, 0.96, 1.0);
    this.body.castShadow = true;
    this.inner.add(this.body);

    // め
    this.eyes = [];
    for (const sx of [-1, 1]) {
      const eye = new THREE.Group();
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.066, 20, 14), dark);
      ball.scale.set(1, 1.4, 0.6);
      const hi = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), white);
      hi.position.set(0.018, 0.035, 0.035);
      eye.add(ball, hi);
      eye.position.set(sx * 0.145, 0.07, 0.405);
      eye.lookAt(eye.position.clone().multiplyScalar(2));
      this.inner.add(eye);
      this.eyes.push(eye);
    }
    // にっこり目(クリア時)
    this.happyEyes = [];
    for (const sx of [-1, 1]) {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 16, Math.PI), dark);
      arc.position.set(sx * 0.145, 0.06, 0.415);
      arc.visible = false;
      this.inner.add(arc);
      this.happyEyes.push(arc);
    }

    // ほっぺ
    for (const sx of [-1, 1]) {
      const ch = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20), pink);
      ch.position.set(sx * 0.255, -0.04, 0.345);
      ch.lookAt(ch.position.clone().multiplyScalar(2));
      ch.position.multiplyScalar(1.01);
      this.inner.add(ch);
    }

    // くち
    this.mouth = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.013, 8, 16, Math.PI), dark);
    this.mouth.position.set(0, -0.05, 0.43);
    this.mouth.rotation.z = Math.PI;
    this.inner.add(this.mouth);
    this.mouthO = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), dark);
    this.mouthO.scale.set(1, 1.2, 0.4);
    this.mouthO.position.set(0, -0.07, 0.425);
    this.mouthO.visible = false;
    this.inner.add(this.mouthO);

    // アンテナ + ほし
    this.antenna = new THREE.Group();
    this.antenna.position.set(0, BODY_R * 0.92, -0.02);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.02, 0.12, 0), new THREE.Vector3(0.09, 0.22, -0.02), new THREE.Vector3(0.12, 0.27, -0.03),
    ]);
    this.antenna.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.016, 6), skin));
    const starMat = new THREE.MeshStandardMaterial({ color: '#ffd447', emissive: '#ffb300', emissiveIntensity: 1.4, roughness: 0.3 });
    this.materials.push(starMat);
    this.tipStar = new THREE.Mesh(createStarGeometry(0.08, 0.036, 0.03), starMat);
    this.tipStar.position.copy(curve.getPoint(1));
    this.antenna.add(this.tipStar);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: '#ffe27a', transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.setScalar(0.5);
    glow.position.copy(this.tipStar.position);
    this.antenna.add(glow);
    this.materials.push(glow.material);
    this.inner.add(this.antenna);

    // て
    this.hands = [];
    for (const sx of [-1, 1]) {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10), skin);
      h.position.set(sx * 0.43, -0.1, 0.06);
      h.castShadow = true;
      this.inner.add(h);
      this.hands.push(h);
    }

    // あし
    this.feet = [];
    for (const sx of [-1, 1]) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), foot);
      f.scale.set(1, 0.55, 1.3);
      f.position.set(sx * 0.17, 0.035, 0.07);
      f.castShadow = true;
      this.rig.add(f);
      this.feet.push(f);
    }

    // アニメーション状態
    this.t = Math.random() * 10;
    this.blinkT = 2 + Math.random() * 2;
    this.sq = 1;
    this.sqVel = 0;
    this.spinT = 1;
    this.waveT = 0;
    this.waving = false;
    this.happy = false;
    this.surprised = false;
    this.walkPhase = 0;
  }

  /** ぷにっと つぶれる(マイナスで のびる) */
  squash(amount) { this.sqVel -= amount * 9; }

  spin() { this.spinT = 0; }

  setHappy(v) {
    this.happy = v;
    this.eyes.forEach((e) => { e.visible = !v; });
    this.happyEyes.forEach((e) => { e.visible = v; });
  }

  setSurprised(v) {
    this.surprised = v;
    this.mouth.visible = !v;
    this.mouthO.visible = v;
  }

  wave(on = true) { this.waving = on; }

  /**
   * @param {number} dt
   * @param {{speed?:number, grounded?:boolean, fall?:number}} s  speed 0..1
   */
  update(dt, s = {}) {
    const speed = s.speed ?? 0;
    const grounded = s.grounded ?? true;
    this.t += dt;

    // まばたき
    this.blinkT -= dt;
    let blink = 1;
    if (this.blinkT < 0.12) blink = Math.abs(this.blinkT - 0.06) / 0.06;
    if (this.blinkT < 0) this.blinkT = 2 + Math.random() * 3;
    this.eyes.forEach((e) => { e.scale.y = Math.max(0.1, blink); });

    // つぶれ(ばね)
    const k = 180, c = 11;
    this.sqVel += (-(this.sq - 1) * k - this.sqVel * c) * dt;
    this.sq += this.sqVel * dt;
    this.sq = THREE.MathUtils.clamp(this.sq, 0.55, 1.5);
    let sy = this.sq;
    // いきづかい
    if (grounded) sy *= 1 + Math.sin(this.t * 3) * 0.015;
    else sy *= 1 + Math.min(0.18, (s.fall ?? 0) * 0.008);
    const sxz = 1 / Math.sqrt(sy);
    this.rig.scale.set(sxz, sy, sxz);

    // あるき
    this.walkPhase += dt * (4 + speed * 10) * (speed > 0.05 ? 1 : 0);
    const w = Math.sin(this.walkPhase);
    this.inner.rotation.z = w * 0.1 * speed;
    this.inner.rotation.x = speed * 0.18;
    this.feet[0].position.z = 0.07 + w * 0.09 * speed;
    this.feet[1].position.z = 0.07 - w * 0.09 * speed;
    this.feet[0].position.y = 0.035 + Math.max(0, w) * 0.06 * speed;
    this.feet[1].position.y = 0.035 + Math.max(0, -w) * 0.06 * speed;

    // て
    const air = grounded ? 0 : 1;
    this.hands[0].position.y = -0.1 + air * 0.22 + Math.sin(this.t * 2) * 0.01;
    this.hands[1].position.y = -0.1 + air * 0.22 + Math.cos(this.t * 2) * 0.01;
    if (this.waving) {
      this.waveT += dt;
      this.hands[1].position.set(0.45, 0.28 + Math.sin(this.waveT * 12) * 0.04, 0.05 + Math.sin(this.waveT * 12) * 0.06);
    } else {
      this.hands[1].position.x = 0.43;
      this.hands[1].position.z = 0.06;
    }

    // アンテナのゆれ
    this.antenna.rotation.z = Math.sin(this.t * 2.2) * 0.12 - this.inner.rotation.z * 1.5;
    this.antenna.rotation.x = Math.sin(this.t * 1.7) * 0.08 - speed * 0.3 + air * 0.25;
    this.tipStar.rotation.y += dt * 2;

    // くるりん
    if (this.spinT < 1) {
      this.spinT = Math.min(1, this.spinT + dt / 0.45);
      const e = 1 - Math.pow(1 - this.spinT, 3);
      this.inner.rotation.y = e * Math.PI * 2;
    } else {
      this.inner.rotation.y = 0;
    }
  }

  dispose() {
    this.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.materials.forEach((m) => m.dispose());
  }
}
