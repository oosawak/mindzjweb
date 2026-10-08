// =========================================================
// Robot — オリジナルの選手「インクランナー」(すべてコードで生成)
//  背中にインクタンク、右手にインクブラスター、顔はチーム色に光るバイザー。
//  原点 = あたり判定の球の中心 / 前方 = +Z
// =========================================================
import * as THREE from 'three';
import { glowTexture } from '../vfx/Textures.js';

const shared = {};
function geo(key, make) { return shared[key] || (shared[key] = make()); }

export class Robot extends THREE.Group {
  constructor(color = '#ff3fa4', { name = '', showName = false } = {}) {
    super();
    this.color = new THREE.Color(color);
    this.root = new THREE.Group();     // つぶれ・ゆれ用
    this.add(this.root);

    const shell = new THREE.MeshStandardMaterial({ color: '#454b66', metalness: 0.45, roughness: 0.35 });
    const trim = new THREE.MeshStandardMaterial({ color: '#d9dcea', metalness: 0.3, roughness: 0.4 });
    const glow = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6, roughness: 0.2 });
    const ink = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7, roughness: 0.1, transparent: true, opacity: 0.85 });
    this.mats = { shell, trim, glow, ink };

    // からだ
    const torso = new THREE.Mesh(geo('torso', () => new THREE.CapsuleGeometry(0.26, 0.22, 6, 14)), shell);
    torso.position.y = -0.02;
    torso.castShadow = true;
    this.root.add(torso);
    const chest = new THREE.Mesh(geo('chest', () => new THREE.BoxGeometry(0.34, 0.16, 0.08)), glow);
    chest.position.set(0, 0.04, 0.22);
    this.root.add(chest);

    // あたま
    this.head = new THREE.Group();
    this.head.position.y = 0.42;
    this.root.add(this.head);
    const skull = new THREE.Mesh(geo('skull', () => new THREE.SphereGeometry(0.22, 20, 14)), trim);
    skull.scale.set(1.05, 0.9, 1);
    skull.castShadow = true;
    this.head.add(skull);
    const visor = new THREE.Mesh(geo('visor', () => new THREE.CapsuleGeometry(0.07, 0.2, 4, 10).rotateZ(Math.PI / 2)), glow);
    visor.position.set(0, 0.01, 0.19);
    visor.scale.set(1, 1, 0.55);
    this.head.add(visor);
    const fin = new THREE.Mesh(geo('fin', () => new THREE.BoxGeometry(0.04, 0.12, 0.2)), glow);
    fin.position.set(0, 0.2, -0.02);
    this.head.add(fin);

    // インクタンク
    const tank = new THREE.Mesh(geo('tank', () => new THREE.CylinderGeometry(0.12, 0.12, 0.36, 14)), ink);
    tank.position.set(0, 0.04, -0.3);
    this.root.add(tank);
    const cap = new THREE.Mesh(geo('cap', () => new THREE.CylinderGeometry(0.13, 0.13, 0.05, 14)), trim);
    cap.position.set(0, 0.24, -0.3);
    this.root.add(cap);
    this.tankInk = tank;

    // うで + ブラスター
    this.armR = new THREE.Group();
    this.armR.position.set(0.3, 0.06, 0.02);
    this.root.add(this.armR);
    const upper = new THREE.Mesh(geo('arm', () => new THREE.CapsuleGeometry(0.07, 0.16, 4, 8)), shell);
    upper.rotation.x = Math.PI / 2;
    upper.position.z = 0.1;
    this.armR.add(upper);
    this.blaster = new THREE.Group();
    this.blaster.position.set(0, 0, 0.26);
    this.armR.add(this.blaster);
    const body = new THREE.Mesh(geo('gun', () => new THREE.BoxGeometry(0.13, 0.14, 0.3)), trim);
    this.blaster.add(body);
    const barrel = new THREE.Mesh(geo('barrel', () => new THREE.CylinderGeometry(0.045, 0.055, 0.22, 10).rotateX(Math.PI / 2)), shell);
    barrel.position.z = 0.24;
    this.blaster.add(barrel);
    const ring = new THREE.Mesh(geo('ring', () => new THREE.TorusGeometry(0.06, 0.016, 6, 14)), glow);
    ring.position.z = 0.35;
    this.blaster.add(ring);
    this.muzzle = new THREE.Object3D();
    this.muzzle.position.z = 0.4;
    this.blaster.add(this.muzzle);

    this.armL = new THREE.Mesh(geo('arm', () => new THREE.CapsuleGeometry(0.07, 0.16, 4, 8)), shell);
    this.armL.position.set(-0.3, 0.0, 0.04);
    this.armL.rotation.x = 0.4;
    this.root.add(this.armL);

    // あし
    this.legs = [-1, 1].map((s) => {
      const leg = new THREE.Mesh(geo('leg', () => new THREE.CapsuleGeometry(0.08, 0.14, 4, 8)), shell);
      leg.position.set(s * 0.13, -0.36, 0);
      leg.castShadow = true;
      this.root.add(leg);
      const shoe = new THREE.Mesh(geo('shoe', () => new THREE.BoxGeometry(0.14, 0.07, 0.22)), glow);
      shoe.position.set(0, -0.13, 0.03);
      leg.add(shoe);
      return leg;
    });

    // ひかり
    this.aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.aura.scale.setScalar(1.8);
    this.root.add(this.aura);

    // 名前
    if (showName && name) this.setName(name);

    this.t = Math.random() * 10;
    this.walk = 0;
    this.recoil = 0;
    this.sq = 1;
    this.sqVel = 0;
    this.aimPitch = 0;
  }

  setName(name) {
    if (this.nameTag) { this.remove(this.nameTag); this.nameTag.material.map.dispose(); this.nameTag.material.dispose(); }
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const g = c.getContext('2d');
    g.font = '700 30px "Rajdhani", "M PLUS 1p", system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const w = Math.min(240, g.measureText(name).width + 28);
    g.fillStyle = 'rgba(8,10,22,0.7)';
    g.beginPath();
    g.roundRect?.(128 - w / 2, 10, w, 44, 12);
    g.fill();
    g.fillStyle = `#${this.color.getHexString()}`;
    g.fillText(name.slice(0, 16), 128, 33);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.nameTag = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }));
    this.nameTag.scale.set(1.6, 0.4, 1);
    this.nameTag.position.y = 1.05;
    this.nameTag.renderOrder = 20;
    this.add(this.nameTag);
  }

  setColor(color) {
    this.color.set(color);
    for (const m of [this.mats.glow, this.mats.ink]) { m.color.set(color); m.emissive.set(color); }
    this.aura.material.color.set(color);
  }

  fire() { this.recoil = 1; }
  squash(a) { this.sqVel -= a * 9; }

  /**
   * @param {number} dt
   * @param {{speed:number, grounded:boolean, pitch:number}} s
   */
  update(dt, s) {
    this.t += dt;
    const speed = s.speed || 0;
    this.walk += dt * (6 + speed * 9) * (speed > 0.05 && s.grounded ? 1 : 0);
    const w = Math.sin(this.walk);
    this.legs[0].rotation.x = w * 0.7 * speed;
    this.legs[1].rotation.x = -w * 0.7 * speed;
    this.root.position.y = Math.abs(Math.cos(this.walk)) * 0.04 * speed + (s.grounded ? 0 : 0.04);
    this.root.rotation.z = w * 0.05 * speed;
    // ばね
    this.sqVel += (-(this.sq - 1) * 170 - this.sqVel * 12) * dt;
    this.sq = THREE.MathUtils.clamp(this.sq + this.sqVel * dt, 0.6, 1.4);
    this.root.scale.set(1 / Math.sqrt(this.sq), this.sq, 1 / Math.sqrt(this.sq));
    // ねらい
    this.aimPitch += ((s.pitch || 0) - this.aimPitch) * Math.min(1, dt * 18);
    this.armR.rotation.x = -this.aimPitch;
    this.head.rotation.x = -this.aimPitch * 0.45;
    this.recoil = Math.max(0, this.recoil - dt * 9);
    this.blaster.position.z = 0.26 - this.recoil * 0.08;
    this.aura.material.opacity = 0.25 + Math.sin(this.t * 3) * 0.06;
    this.tankInk.scale.y = 0.85 + Math.sin(this.t * 2.2) * 0.05;
  }

  dispose() {
    Object.values(this.mats).forEach((m) => m.dispose());
    this.aura.material.dispose();
    if (this.nameTag) { this.nameTag.material.map.dispose(); this.nameTag.material.dispose(); }
  }
}
