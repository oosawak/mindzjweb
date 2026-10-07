// 安全地帯（収縮するストーム）
import * as THREE from 'three';
import { G } from './state.js';
import { rand, lerp, smoothstep } from './util.js';

const PHASES = [
  { wait: 70, shrink: 55, r: 0.6, dps: 1 },
  { wait: 50, shrink: 45, r: 0.34, dps: 2 },
  { wait: 40, shrink: 35, r: 0.18, dps: 4 },
  { wait: 30, shrink: 30, r: 0.09, dps: 7 },
  { wait: 25, shrink: 25, r: 0.035, dps: 11 },
  { wait: 20, shrink: 30, r: 0.0, dps: 16 },
];

export class Zone {
  constructor(S) {
    this.S = S;
    this.center = new THREE.Vector2(0, 0); this.radius = S * 1.45;
    this.startCenter = this.center.clone(); this.startRadius = this.radius;
    this.targetCenter = new THREE.Vector2(rand(-S * 0.3, S * 0.3), rand(-S * 0.3, S * 0.3));
    this.targetRadius = S * PHASES[0].r;
    this.phase = 0; this.state = 'wait'; this.timer = PHASES[0].wait; this.active = true; this.dps = 0.5;
    this.tickT = 0;
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
      uniforms: { uTime: { value: 0 }, uVis: { value: 0 } },
      vertexShader: `varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform float uTime; uniform float uVis; varying vec2 vUv; varying vec3 vW;
        void main(){ float y=vUv.y;
          float b=pow(0.5+0.5*sin(vW.y*0.35-uTime*2.5+sin(vUv.x*60.0+uTime*0.7)*1.8),3.0);
          float near=1.0-smoothstep(10.0,160.0,distance(vW,cameraPosition));
          float a=(0.08+0.3*b)*(1.0-smoothstep(0.3,0.85,y))*mix(0.06,1.0,near*near)*uVis;
          gl_FragColor=vec4(vec3(0.5,0.25,1.0)*(1.0+b*1.5),a); }`,
    });
    this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 400, 128, 1, true), mat);
    this.mesh.position.y = 150; this.mesh.renderOrder = 5; this.mesh.frustumCulled = false;
    G.scene.add(this.mesh);
    this.announce = 'ゾーン収縮まで';
  }
  dist(p) { return Math.hypot(p.x - this.center.x, p.z - this.center.y) - this.radius; }
  update(dt) {
    if (!this.active) return;
    if (!(G.admin && G.admin.on && G.admin.zone)) this.timer -= dt;
    const P = PHASES[this.phase];
    if (this.state === 'wait') {
      if (this.timer <= 0) { this.state = 'shrink'; this.timer = P.shrink; this.startCenter.copy(this.center); this.startRadius = this.radius; G.hud.bigMessage('ゾーン縮小開始', '安全地帯へ移動せよ'); G.audio.play('alarm'); }
    } else if (this.state === 'shrink') {
      const t = 1 - Math.max(0, this.timer) / P.shrink;
      this.center.lerpVectors(this.startCenter, this.targetCenter, t);
      this.radius = lerp(this.startRadius, this.targetRadius, t);
      this.dps = P.dps;
      if (this.timer <= 0) {
        this.phase++;
        if (this.phase >= PHASES.length) { this.state = 'final'; this.timer = 1e9; }
        else {
          const N = PHASES[this.phase];
          this.state = 'wait'; this.timer = N.wait;
          const nr = this.S * N.r;
          const maxOff = Math.max(0, this.radius - nr);
          const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * maxOff * 0.9;
          this.targetCenter.set(this.center.x + Math.cos(a) * r, this.center.y + Math.sin(a) * r);
          this.targetRadius = nr;
          G.hud.toast('次の安全地帯が表示されました');
        }
      }
    }
    this.mesh.scale.set(Math.max(0.1, this.radius), 1, Math.max(0.1, this.radius));
    this.mesh.position.x = this.center.x; this.mesh.position.z = this.center.y;
    this.mesh.material.uniforms.uTime.value += dt;
    const vis = this.phase > 0 || this.state !== 'wait' ? 1 : 0;
    const U = this.mesh.material.uniforms.uVis; U.value += (vis - U.value) * Math.min(1, dt * 0.5);
    // ダメージ
    this.tickT -= dt;
    if (this.tickT <= 0) {
      this.tickT = 1;
      for (const a of G.actors) {
        if (!a.alive || a.dropState) continue;
        if (this.dist(a.pos) > 0) a.takeDamage({ amount: Math.max(1, this.dps), part: 'torso', zone: true, dir: new THREE.Vector3(), attacker: null, weapon: { name: 'ストーム' } });
      }
    }
    // プレイヤーの画面効果
    if (G.player) {
      const d = this.dist(G.player.actor.pos);
      const u = G.engine.final.uniforms.uZone;
      u.value += ((d > 0 ? 1 : 0) - u.value) * Math.min(1, dt * 3);
      G.audio.loop('zone', d > -30, d > 0 ? 0.35 : 0.12 * smoothstep(-30, 0, d));
    }
  }
  dispose() { G.scene.remove(this.mesh); this.mesh.geometry.dispose(); this.mesh.material.dispose(); G.audio.loop('zone', false); G.engine.final.uniforms.uZone.value = 0; }
}
