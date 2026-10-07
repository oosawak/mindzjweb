// ===== Game orchestration: modes, pursuit rules, spawning, collisions =====
import * as THREE from 'three';
import { Car, PLAYER_CARS, RACER_COLORS, TRAFFIC_SPECS } from './car.js';
import { RacerAI, CopAI, TrafficAI } from './ai.js';
import { buildRoute, projectOnRoute, pointAtDist } from './roads.js';
import { clamp, lerp, wrapAngle } from './util.js';
import { WATER_LEVEL } from './terrain.js';
import { glowTexture } from './textures.js';

const COP_SPEC = { name: 'INTERCEPTOR', kind: 'gt', top: 91, accel: 17, grip: 9.6, steer: 1.0, mass: 1.25, armor: 1.0 };
const COP_SPEC2 = { name: 'PURSUIT SPEC', kind: 'super', top: 94, accel: 18, grip: 10, steer: 1.05, mass: 1.15, armor: 0.9 };
const COP_HEAVY = { name: 'HEAVY SUV', kind: 'suv', top: 84, accel: 15, grip: 9, steer: 0.9, mass: 2.0, armor: 1.8 };
const RACER_NAMES = ['KAZE', 'NOVA', 'VIPERA', 'GHOST', 'RAVEN', 'ZERO'];
const DIRS = ['north', 'north east', 'east', 'south east', 'south', 'south west', 'west', 'north west'];

const tmp = new THREE.Vector3();

export class Game {
  constructor(ctx) {
    Object.assign(this, ctx); // renderer, scene, camera, world, audio, input, settings, rig, vfx, hud
    this.cars = []; this.traffic = []; this.cops = []; this.racers = []; this.spikes = []; this.roadblocks = [];
    this.player = null; this.state = 'idle'; this.time = 0; this.timeScale = 1; this.slowmo = 0;
    this.idc = 1; this.acc = 0; this.heat = 0;
    this.gates = this.makeGate();
    this.copLights = [new THREE.PointLight(0xff0000, 0, 30, 2), new THREE.PointLight(0x0033ff, 0, 30, 2)];
    this.copLights.forEach((l) => this.scene.add(l));
    this.headlight = new THREE.SpotLight(0xfff2e0, 0, 90, 0.5, 0.6, 1.5);
    this.scene.add(this.headlight); this.scene.add(this.headlight.target);
    this.radioCd = 0;
  }

  // ---------------- helpers ----------------
  addCar(spec, opts) {
    const c = new Car(this, spec, opts);
    c.id = this.idc++;
    this.cars.push(c);
    return c;
  }
  removeCar(c) {
    c.dispose();
    this.cars = this.cars.filter((x) => x !== c);
    this.cops = this.cops.filter((x) => x !== c);
    this.traffic = this.traffic.filter((x) => x !== c);
  }
  distToCamera(c) { return this.camera.position.distanceTo(c.pos); }
  carsNear(car, r) { return this.cars.filter((o) => o !== car && Math.abs(o.pos.x - car.pos.x) < r && Math.abs(o.pos.z - car.pos.z) < r); }
  notify(t, sub = '', color = '#ffb400', big = false) { this.hud.notify(t, sub, color, big); }

  radio(text) {
    if (!this.settings.voice || this.radioCd > 0) return;
    this.radioCd = 5;
    this.audio.radio();
    this.hud.radio(text);
    try {
      if (!window.speechSynthesis) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 1.12; u.pitch = 0.85; u.volume = 0.55 * this.settings.master;
      const v = speechSynthesis.getVoices().find((v) => /en-US/.test(v.lang) && /Male|David|Alex|Daniel|Fred/i.test(v.name)) || speechSynthesis.getVoices().find((v) => /en/.test(v.lang));
      if (v) u.voice = v;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }
  headingWord(car) {
    const a = Math.atan2(car.vel.x, -car.vel.y); // 0 = north (-z)
    const i = Math.round(((a + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) % 8;
    return DIRS[i];
  }
  areaName(car) {
    const p = car.pos;
    if (Math.abs(p.x) < 640 && Math.abs(p.z) < 640) return 'downtown';
    if (Math.hypot(p.x, p.z) > 1100) return p.x > 1000 ? 'the coast highway' : 'the highway';
    return 'the hills';
  }

  makeGate() {
    const g = new THREE.Group();
    const beamMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 0.9, 0.2), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xff9a20, emissiveIntensity: 3 });
    const L = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7, 0.6), pylonMat); L.position.set(-12, 3.5, 0);
    const R = L.clone(); R.position.x = 12;
    const top = new THREE.Mesh(new THREE.BoxGeometry(24.6, 0.6, 0.6), pylonMat); top.position.y = 7;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 400, 16, 1, true), beamMat); beam.position.y = 200;
    const tex = glowTexture('rgba(255,180,60,1)', 'rgba(255,120,0,0)', 128);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xffffff }));
    sp.scale.set(14, 14, 1); sp.position.y = 7;
    const curtain = new THREE.Mesh(new THREE.PlaneGeometry(24, 7), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.5, 0.1), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    curtain.position.y = 3.5;
    g.add(L, R, top, beam, sp, curtain);
    g.visible = false;
    this.scene.add(g);
    this.gateMats = { pylonMat, beamMat };
    return g;
  }

  // ---------------- lifecycle ----------------
  clear() {
    for (const c of [...this.cars]) c.dispose();
    this.cars = []; this.traffic = []; this.cops = []; this.racers = [];
    for (const s of this.spikes) this.scene.remove(s.mesh);
    this.spikes = []; this.roadblocks = [];
    this.player = null; this.gates.visible = false;
    this.vfx.skids.clear();
    this.rig.endCine();
    this.timeScale = 1; this.slowmo = 0;
    this.copLights.forEach((l) => (l.intensity = 0));
    this.headlight.intensity = 0;
  }

  raceRoute() {
    if (this._route) return this._route;
    const nav = this.world.nav;
    const C = (x, z) => nav.cityId(x, z);
    const L = (d) => nav.loopId((d * Math.PI) / 180);
    const wps = [C(0, 360), C(0, -600), L(-115), L(-135), L(-160), L(180), L(155), L(130), L(108), C(0, 600), C(360, 600), C(360, 240), C(120, 240), C(120, -120), C(-240, -120), C(-240, 120)];
    this._route = buildRoute(nav, wps);
    return this._route;
  }

  start(mode, carIdx) {
    this.clear();
    this.mode = mode;
    this.carIdx = carIdx;
    this.time = 0; this.raceTime = 0; this.heat = 0; this.bounty = 0; this.takedowns = 0; this.maxSpeed = 0;
    this.bust = 0; this.finished = []; this.pursuit = false; this.pursuitTime = 0; this.lastSeen = 0; this.cooldown = 0;
    this.roadblockCd = 30; this.nearMiss = new Map(); this.driftT = 0; this.escapes = 0; this.checkIdx = 0;
    this.result = null; this.copSpawnCd = 0; this.trafficCd = 0; this.patrolSpawned = false; this.bustedRacers = 0; this.escapedRacers = 0;
    this.empState = { lock: 0, target: null, cd: 0 }; this.spikeCd = 0;
    this.playerFinished = false; this.playerPlace = 0; this.plIdx = 0; this.playerProgress = 0; this.lastHeat = undefined; this.drown = 0;
    this.position = 0; this.standings = []; this.wrongWay = false; this.drafting = false; this.sirenGlow = null; this.lastHitWith = null;
    const spec = PLAYER_CARS[carIdx];
    const route = mode === 'free' ? null : this.raceRoute();
    this.route = route;
    const police = mode === 'cop';
    this.demo = mode === 'demo';
    if (this.demo) return this.startDemo();
    const pl = this.addCar(police ? { ...spec, armor: spec.armor * 1.3 } : spec, { role: 'player', police, name: 'YOU' });
    pl.addInterior();
    this.player = pl;
    pl.nitro = police ? 1 : 0.6;
    const P = {};
    if (route) {
      // checkpoints
      this.checkpoints = [];
      const N = 9;
      for (let i = 1; i <= N; i++) this.checkpoints.push((route.length - 60) * (i / N) + 30);
      this.finishDist = this.checkpoints[N - 1];
      const place = (car, dist, lat) => {
        const p = pointAtDist(route, dist, P);
        car.place(p.x + -p.dz * lat, p.z + p.dx * lat, Math.atan2(p.dx, p.dz), 0);
      };
      if (mode === 'race') {
        const grid = [[34, -3.5], [34, 3.5], [22, -3.5], [22, 3.5]];
        const pIdx = 3;
        let ri = 0;
        grid.forEach((g, i) => {
          if (i === pIdx) { place(pl, g[0], g[1]); return; }
          const ms = PLAYER_CARS[(carIdx + 1 + ri) % 3];
          const col = RACER_COLORS[ri % RACER_COLORS.length];
          const r = this.addCar({ ...ms, top: ms.top * (0.985 + ri * 0.012) }, { role: 'racer', color: col[0], color2: col[1], livery: 'stripe', name: RACER_NAMES[ri] });
          place(r, g[0], g[1]);
          r.ai = new RacerAI(r, route, 0.97 + ri * 0.02);
          r.ai.lane = g[1];
          r.nitro = 0.5;
          this.racers.push(r); ri++;
        });
        this.racers.push(pl);
      } else {
        // cop mode: 4 racers ahead, player + 2 partners behind
        for (let i = 0; i < 4; i++) {
          const ms = PLAYER_CARS[i % 3];
          const col = RACER_COLORS[i];
          const r = this.addCar({ ...ms, top: ms.top * (0.99 + i * 0.008), armor: ms.armor * 1.0 }, { role: 'racer', color: col[0], color2: col[1], livery: 'stripe', name: RACER_NAMES[i] });
          place(r, 95 + Math.floor(i / 2) * 12, i % 2 ? 3.5 : -3.5);
          r.ai = new RacerAI(r, route, 0.99 + i * 0.012);
          r.ai.lane = i % 2 ? 3.5 : -3.5;
          r.nitro = 0.6;
          this.racers.push(r);
        }
        place(pl, 40, 0);
        for (let i = 0; i < 2; i++) {
          const c = this.spawnCop(null, i ? COP_SPEC2 : COP_SPEC);
          place(c, 26 - i * 12, i ? 4 : -4);
          c.ai.target = this.racers[i];
        }
      }
    } else {
      pl.place(0, 0, Math.PI, 0);
      this.heat = 1;
    }
    this.spawnInitialTraffic();
    this.rig.setMode(this.settings.camMode || 0);
    this.rig.snap = true;
    this.state = 'countdown';
    this.countdown = 3.99;
    this.lastCount = 4;
    this.audio.music && this.audio.music.setLevel(1);
    this.hud.setMode(mode, this);
    this.updateGate();
  }

  startDemo() {
    const route = this.raceRoute();
    this.route = null; this.demoRoute = route;
    const pl = this.addCar(PLAYER_CARS[Math.floor(Math.random() * 3)], { role: 'player', name: 'DEMO' });
    this.player = pl;
    const P = {};
    const start = 200 + Math.random() * (route.length - 1500);
    const p = pointAtDist(route, start, P);
    pl.place(p.x, p.z, Math.atan2(p.dx, p.dz), 30);
    pl.ai = new RacerAI(pl, route, 0.95); pl.ai.idx = p.index; pl.ai.lane = 0; pl.nitro = 1;
    for (let i = 0; i < 2; i++) {
      const q = pointAtDist(route, start - 30 - i * 25, {});
      const c = this.spawnCop({ x: q.x + (i ? 3 : -3) * -q.dz, z: q.z + (i ? 3 : -3) * q.dx, yaw: Math.atan2(q.dx, q.dz), speed: 28 });
      c.ai.target = pl;
    }
    const r2 = this.addCar({ ...PLAYER_CARS[1] }, { role: 'racer', color: 0x1ec8ff, color2: 0x101010, livery: 'stripe', name: 'NOVA' });
    const q = pointAtDist(route, start + 20, {});
    r2.place(q.x + 3 * -q.dz, q.z + 3 * q.dx, Math.atan2(q.dx, q.dz), 30);
    r2.ai = new RacerAI(r2, route, 0.97); r2.ai.idx = q.index; r2.ai.lane = 3;
    this.racers = [r2, pl];
    this.spawnInitialTraffic();
    this.state = 'playing'; this.pursuit = true; this.heat = 2;
    this.demoStart = start;
  }

  // ---------------- spawning ----------------
  spawnCop(pos, spec = COP_SPEC) {
    const c = this.addCar(spec, { role: 'cop' });
    c.ai = new CopAI(c, this);
    c.health = 1;
    this.cops.push(c);
    if (pos) c.place(pos.x, pos.z, pos.yaw || 0, pos.speed || 0);
    return c;
  }
  spawnInitialTraffic() {
    const nav = this.world.nav;
    const count = this.settings.quality === 0 ? 18 : 30;
    for (let i = 0; i < count; i++) {
      const ts = TRAFFIC_SPECS[Math.floor(Math.random() * TRAFFIC_SPECS.length)];
      const spec = { kind: ts.kind, top: 34, accel: 8, grip: 8, steer: 0.8, mass: ts.kind === 'truck' ? 3 : ts.kind === 'suv' ? 1.6 : 1.1, armor: 1 };
      const c = this.addCar(spec, { role: 'traffic', color: ts.colors[Math.floor(Math.random() * ts.colors.length)], color2: 0xeeeeee, taxi: ts.taxi, livery: ts.taxi ? 'taxi' : 'plain' });
      c.ai = new TrafficAI(c, this);
      this.traffic.push(c);
      this.respawnTraffic(c, true);
    }
  }
  respawnTraffic(c, initial = false) {
    const nav = this.world.nav, pl = this.player;
    const camF = new THREE.Vector3(); this.camera.getWorldDirection(camF);
    for (let tries = 0; tries < 30; tries++) {
      const n = nav.nodes[Math.floor(Math.random() * nav.nodes.length)];
      const dx = n.x - pl.pos.x, dz = n.z - pl.pos.z; const d = Math.hypot(dx, dz);
      if (initial ? (d < 40 || d > 700) : (d < 260 || d > 650)) continue;
      if (!initial && (dx * camF.x + dz * camF.z) / d > 0.5 && d < 400) continue;
      if (this.cars.some((o) => o !== c && (o.pos.x - n.x) ** 2 + (o.pos.z - n.z) ** 2 < 400)) continue;
      c.ai.spawnAt(n, this);
      return;
    }
  }
  spawnPursuitCop() {
    const nav = this.world.nav, pl = this.player;
    if (this.route && Math.random() < 0.6) {
      const d = (this.playerProgress || 0) + 320 + Math.random() * 260;
      if (d < this.route.length - 80) {
        const p = pointAtDist(this.route, d, {});
        const inCity = Math.abs(p.x) < 640 && Math.abs(p.z) < 640;
        const oncoming = !inCity && Math.random() < 0.35;
        const lat = (oncoming ? -1 : 1) * (3 + Math.random() * 3);
        const x = p.x + -p.dz * lat, z = p.z + p.dx * lat;
        if (!this.cars.some((o) => (o.pos.x - x) ** 2 + (o.pos.z - z) ** 2 < 100)) {
          const heavy = this.heat >= 4 && Math.random() < 0.3;
          const c = this.spawnCop(null, heavy ? COP_HEAVY : Math.random() < 0.5 ? COP_SPEC : COP_SPEC2);
          c.place(x, z, Math.atan2(p.dx, p.dz) + (oncoming ? Math.PI : 0), oncoming ? 18 : 32);
          c.ai.target = this.pickTarget(c);
          return c;
        }
      }
    }
    const fx = Math.sin(pl.yaw), fz = Math.cos(pl.yaw);
    for (let tries = 0; tries < 40; tries++) {
      const n = nav.nodes[Math.floor(Math.random() * nav.nodes.length)];
      const dx = n.x - pl.pos.x, dz = n.z - pl.pos.z; const d = Math.hypot(dx, dz);
      if (d < 220 || d > 480) continue;
      const ahead = (dx * fx + dz * fz) / d;
      if (Math.random() < 0.6 && ahead > 0.2) continue; // prefer behind/side
      if (this.cars.some((o) => (o.pos.x - n.x) ** 2 + (o.pos.z - n.z) ** 2 < 100)) continue;
      const heavy = this.heat >= 4 && Math.random() < 0.3;
      const c = this.spawnCop(null, heavy ? COP_HEAVY : Math.random() < 0.5 ? COP_SPEC : COP_SPEC2);
      const e = n.edges[0]; const m = nav.nodes[e.to];
      c.place(n.x, n.z, Math.atan2(pl.pos.x - n.x, pl.pos.z - n.z), 20);
      c.ai.target = this.pickTarget(c);
      return c;
    }
    return null;
  }
  pickTarget(cop) {
    if (this.mode === 'free' || !this.racers.length) return this.player;
    let best = null, bs = 1e9;
    for (const r of this.racers) {
      if (r.wrecked || (r.ai && r.ai.finished) || (r === this.player && this.playerFinished)) continue;
      let d = r.pos.distanceTo(cop.pos);
      if (r === this.player) d *= 0.45;
      if (d < bs) { bs = d; best = r; }
    }
    return best;
  }

  spawnRoadblock() {
    const pl = this.player, nav = this.world.nav;
    let px, pz, dx, dz;
    if (this.route) {
      const p = pointAtDist(this.route, this.playerProgress + 520, {});
      if (this.playerProgress + 520 > this.route.length - 50) return;
      px = p.x; pz = p.z; dx = p.dx; dz = p.dz;
    } else {
      const fx = pl.vel.x / (pl.speed || 1), fz = pl.vel.y / (pl.speed || 1);
      const n = nav.nearest(pl.pos.x + fx * 420, pl.pos.z + fz * 420);
      if (!n) return;
      let bestE = null, bd = -2;
      for (const e of n.edges) { const m = nav.nodes[e.to]; const ex = m.x - n.x, ez = m.z - n.z, el = Math.hypot(ex, ez); const d = (ex * fx + ez * fz) / el; if (d > bd) { bd = d; bestE = { ex: ex / el, ez: ez / el }; } }
      if (!bestE) return;
      px = n.x; pz = n.z; dx = bestE.ex; dz = bestE.ez;
    }
    if (Math.hypot(px - pl.pos.x, pz - pl.pos.z) < 250) return;
    const rx = -dz, rz = dx;
    const hw = this.world.hf.roadDist(px, pz) < -11 ? 13 : 10;
    const slots = hw > 12 ? [-9.5, -3.5, 6] : [-6.5, 3];
    const rb = { cars: [], x: px, z: pz };
    slots.forEach((lat, i) => {
      const c = this.spawnCop(null, i === 1 && this.heat >= 4 ? COP_HEAVY : COP_SPEC);
      const yaw = Math.atan2(dx, dz) + Math.PI / 2 + (i % 2 ? 0.35 : -0.35);
      c.place(px + rx * lat, pz + rz * lat, yaw, 0);
      c.ai.parked = true; c.ai.target = this.player;
      rb.cars.push(c);
    });
    if (this.heat >= 4) {
      const fake = { pos: new THREE.Vector3(px - dx * 25 + rx * 1, 0, pz - dz * 25 + rz * 1), yaw: Math.atan2(dx, dz) + Math.PI };
      this.dropSpike(fake, null, true);
    }
    this.roadblocks.push(rb);
    this.notify('ROADBLOCK AHEAD', '前方に検問！隙間を抜けろ', '#ff4040');
    this.radio(`Roadblock is set up ahead. All units hold position.`);
  }

  dropSpike(cop, target, silent = false) {
    const fx = Math.sin(cop.yaw), fz = Math.cos(cop.yaw);
    const x = cop.pos.x - fx * 7, z = cop.pos.z - fz * 7;
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(8, 0.06, 0.45), new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.6 }));
    g.add(base);
    const spikeG = new THREE.ConeGeometry(0.06, 0.22, 4);
    const sm = new THREE.InstancedMesh(spikeG, new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1, roughness: 0.2 }), 40);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 40; i++) { m4.makeTranslation(-3.9 + (i % 20) * 0.41, 0.12, i < 20 ? -0.12 : 0.12); sm.setMatrixAt(i, m4); }
    g.add(sm);
    const warn = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.03, 0.12), new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffa000, emissiveIntensity: 2 }));
    warn.position.y = 0.05; g.add(warn);
    const y = this.world.heightAt(x, z) + 0.18;
    g.position.set(x, y, z); g.rotation.y = cop.yaw;
    this.scene.add(g);
    this.spikes.push({ mesh: g, x, z, yaw: cop.yaw, t: 25, hit: new Set() });
    if (!silent && target === this.player) { this.notify('SPIKE STRIP', 'スパイクストリップ設置！', '#ff4040'); this.radio('Spike strip deployed!'); }
  }

  // ---------------- events ----------------
  onLanding(car, air) {
    if (car === this.player) {
      this.audio.landing(clamp(air, 0.3, 1));
      this.rig.addShake(0.5);
      if (air > 0.6) { this.notify('AIR TIME', `${air.toFixed(1)}s`, '#40d0ff'); car.nitro = Math.min(1, car.nitro + 0.1); this.bounty += 500; }
    }
  }
  onImpact(car, other, impact, x, z, tag) {
    const pl = this.player;
    const near = car.pos.distanceTo(this.camera.position) < 120;
    if (near) {
      this.vfx.sparks(x, car.pos.y, z, (car.pos.x - x), (car.pos.z - z), Math.min(30, impact * 1.2), 0.7);
      if (impact > 10) this.vfx.impactFlash(x, car.pos.y, z, clamp(impact / 40, 0.3, 1));
      const dist = car.pos.distanceTo(pl.pos);
      const vol = clamp(1 - dist / 120, 0, 1);
      if (vol > 0) this.audio.crash(clamp(impact / 35, 0.1, 1.2) * vol);
    }
    if (car === pl) { this.rig.addShake(clamp(impact / 25, 0.1, 1)); this.hud.flashDamage(clamp(impact / 30, 0.2, 1)); }
    // static damage
    if (!other) {
      const dmg = Math.max(0, impact - 7) * 0.006 / (car.spec.armor || 1) * (car.role === 'traffic' ? 0 : 1) * (car.role === 'cop' ? 1.2 : car.role === 'racer' ? 0.5 : 1);
      this.damage(car, dmg, null);
    }
  }
  damage(car, amt, by) {
    if (car.wrecked || amt <= 0 || this.demo) return;
    if (this.state !== 'playing') return;
    // cap damage per crash event (0.4s window) so multi-substep contacts don't stack
    const cap = car === this.player ? 0.3 : 0.6;
    if (!car.dmgWin || this.time - car.dmgWin.t > 0.4) car.dmgWin = { t: this.time, sum: 0 };
    amt = Math.min(amt, cap - car.dmgWin.sum);
    if (amt <= 0) return;
    car.dmgWin.sum += amt;
    car.health -= amt;
    if (car.health <= 0) { car.health = 0; this.wreck(car, by); }
  }
  wreck(car, by) {
    car.wrecked = true; car.wreckTime = this.time;
    car.angVel += (Math.random() - 0.5) * 6; car.vy = 5 + Math.random() * 3; car.grounded = false;
    car.sirenOn = false;
    this.vfx.explosion(car.pos.x, car.pos.y, car.pos.z, car.vel.x, car.vel.y);
    const pl = this.player;
    const byPlayer = by === pl;
    if (car.pos.distanceTo(pl.pos) < 200) this.audio.takedown();
    if (car === pl) {
      this.endGame(this.mode === 'cop' ? 'wrecked_cop' : 'wrecked');
      return;
    }
    if (car.role === 'cop') {
      if (byPlayer) {
        this.takedowns++; this.bounty += 2500; pl.nitro = Math.min(1, pl.nitro + 0.35);
        this.notify('TAKEDOWN!', 'パトカー撃破  +2500', '#ff3060', true);
        this.radio(['Unit down! Unit down!', 'We lost a unit!', 'Officer down, requesting backup!'][Math.floor(Math.random() * 3)]);
        this.takedownCam(car);
      }
    } else if (car.role === 'racer') {
      if (this.mode === 'cop') {
        this.bustedRacers++;
        if (byPlayer) { this.takedowns++; pl.nitro = Math.min(1, pl.nitro + 0.4); this.takedownCam(car); }
        this.notify('BUSTED!', `${car.name} を摘発 (${this.bustedRacers}/4)`, '#3aa0ff', true);
        this.radio('Suspect is down. Nice work.');
      } else {
        this.notify('RACER WRECKED', `${car.name} がリタイア`, '#ffb400');
        if (byPlayer) { this.takedowns++; pl.nitro = Math.min(1, pl.nitro + 0.3); this.takedownCam(car); }
      }
    }
  }
  takedownCam(car) {
    if (!this.settings.cinematic) { this.slowmo = 0.5; return; }
    this.slowmo = 1.3;
    const pl = this.player;
    const d = { x: Math.sin(pl.yaw), z: Math.cos(pl.yaw) };
    this.rig.startCine({ type: 'side', target: () => car.pos, dir: d, dur: 1.3 });
  }

  // ---------------- collisions between cars ----------------
  carCollisions() {
    const cars = this.cars;
    const n = cars.length;
    for (let i = 0; i < n; i++) {
      const a = cars[i]; if (!a.active) continue;
      for (let j = i + 1; j < n; j++) {
        const b = cars[j]; if (!b.active) continue;
        const dx0 = b.pos.x - a.pos.x, dz0 = b.pos.z - a.pos.z;
        if (Math.abs(dx0) > 9 || Math.abs(dz0) > 9) continue;
        if (Math.abs(b.pos.y - a.pos.y) > 2.5) continue;
        const afx = Math.sin(a.yaw), afz = Math.cos(a.yaw), bfx = Math.sin(b.yaw), bfz = Math.cos(b.yaw);
        let hit = false, maxImp = 0, hn = null, hx = 0, hz = 0;
        for (const sa of [1, -1]) for (const sb of [1, -1]) {
          const ax = a.pos.x + afx * a.circOff * sa, az = a.pos.z + afz * a.circOff * sa;
          const bx = b.pos.x + bfx * b.circOff * sb, bz = b.pos.z + bfz * b.circOff * sb;
          let dx = bx - ax, dz = bz - az; const d = Math.hypot(dx, dz); const min = a.radius + b.radius;
          if (d >= min || d < 1e-4) continue;
          dx /= d; dz /= d;
          const pen = min - d;
          const ia = 1 / a.mass, ib = 1 / b.mass, s = ia + ib;
          a.pos.x -= dx * pen * (ia / s); a.pos.z -= dz * pen * (ia / s);
          b.pos.x += dx * pen * (ib / s); b.pos.z += dz * pen * (ib / s);
          const rel = (b.vel.x - a.vel.x) * dx + (b.vel.y - a.vel.y) * dz;
          if (rel < 0) {
            const jimp = (-(1 + 0.3) * rel) / s;
            a.vel.x -= dx * jimp * ia; a.vel.y -= dz * jimp * ia;
            b.vel.x += dx * jimp * ib; b.vel.y += dz * jimp * ib;
            // friction-ish tangential coupling
            const tx = -dz, tz = dx;
            const relT = (b.vel.x - a.vel.x) * tx + (b.vel.y - a.vel.y) * tz;
            const f = relT * 0.15;
            a.vel.x += tx * f * ia / s; a.vel.y += tz * f * ia / s; b.vel.x -= tx * f * ib / s; b.vel.y -= tz * f * ib / s;
            a.angVel += (afx * dz - afz * dx) * sa * -rel * 0.03 * ia;
            b.angVel += (bfx * -dz - bfz * -dx) * sb * -rel * 0.03 * ib;
            if (-rel > maxImp) { maxImp = -rel; hn = { x: dx, z: dz }; hx = (ax + bx) / 2; hz = (az + bz) / 2; }
            hit = true;
          }
        }
        if (hit && maxImp > 2.5) this.onCarHit(a, b, maxImp, hn, hx, hz);
      }
    }
  }
  onCarHit(a, b, impact, n, x, z) {
    const pl = this.player;
    // who is the aggressor: the one whose velocity points more into the other
    const aInto = a.vel.x * n.x + a.vel.y * n.z;
    const bInto = -(b.vel.x * n.x + b.vel.y * n.z);
    const att = aInto >= bInto ? a : b, vic = att === a ? b : a;
    const involvesPlayer = a === pl || b === pl;
    if (involvesPlayer || a.pos.distanceTo(this.camera.position) < 100) {
      this.vfx.sparks(x, (a.pos.y + b.pos.y) / 2, z, -n.x, -n.z, Math.min(40, impact * 1.5), 0.8);
      if (impact > 12) this.vfx.impactFlash(x, a.pos.y, z, clamp(impact / 40, 0.3, 1));
      if (impact > 18) this.vfx.debrisBurst(x, a.pos.y, z, att.vel.x, att.vel.y, 3);
      const vol = clamp(1 - a.pos.distanceTo(pl.pos) / 120, 0, 1);
      this.audio.crash(clamp(impact / 30, 0.15, 1.3) * vol);
    }
    if (involvesPlayer) {
      this.rig.addShake(clamp(impact / 20, 0.15, 1.1));
      const other = a === pl ? b : a;
      this.lastHitWith = other; this.lastHitT = this.time;
      if (vic === pl) this.hud.flashDamage(clamp(impact / 25, 0.2, 1));
    }
    for (const c of [a, b]) if (c.role === 'traffic' && impact > 6) { c.ai.stunned = 2 + Math.random() * 2; }
    const roleDmg = (victim, attacker) => {
      const base = impact * 0.016 * (attacker.mass / victim.mass) / (victim.spec.armor || 1);
      if (victim.role === 'traffic') return 0;
      if (attacker.role === 'traffic') return base * 0.25;
      if (victim.role === 'cop' && attacker.role === 'cop') return 0;
      if (victim === pl && this.mode !== 'cop') return base * (attacker.role === 'cop' ? 0.4 : 0.3);
      if (victim.role === 'cop' && attacker === pl) return base * 1.7;
      if (victim.role === 'racer' && attacker === pl && this.mode === 'cop') return base * 1.7;
      if (victim.role === 'racer' && attacker.role === 'cop') return base * (this.mode === 'cop' ? 0.45 : 0.4);
      if (victim.role === 'cop' && attacker.role === 'racer') return base * 0.9;
      if (victim.role === 'racer' && attacker.role === 'racer') return base * 0.3;
      return base * 0.5;
    };
    if (impact > 4) {
      this.damage(vic, roleDmg(vic, att), att);
      this.damage(att, roleDmg(att, vic) * 0.35, vic);
    }
  }

  // ---------------- main update ----------------
  update(dtReal) {
    const input = this.input;
    if (this.slowmo > 0) { this.slowmo -= dtReal; this.timeScale = lerp(this.timeScale, 0.22, 0.2); if (this.slowmo <= 0) { this.rig.endCine(); } }
    else this.timeScale = lerp(this.timeScale, 1, 0.12);
    const dt = dtReal * this.timeScale;
    const pl = this.player;
    if (!pl) return;
    this.radioCd -= dtReal;

    if (this.state === 'countdown') {
      this.countdown -= dtReal;
      const n = Math.ceil(this.countdown);
      if (n !== this.lastCount && n >= 1) { this.lastCount = n; this.hud.countdown(n); this.audio.beep(false); }
      if (this.countdown <= 0) {
        this.state = 'playing'; this.hud.countdown('GO!'); this.audio.beep(true);
        if (this.mode === 'free') this.radio('All units, be advised. Street racers reported downtown.');
        else if (this.mode === 'cop') this.radio('All units, racers are on the move. Take them down!');
      }
      // hold cars in place but let player rev
      const d = input.drive(dtReal);
      pl.rpm = lerp(pl.rpm, d.throttle ? 0.9 : 0.22, 0.1);
      pl.input.throttle = d.throttle;
      for (const c of this.cars) c.syncVisual(dtReal, this.time);
      this.updateTraffic(dtReal, true);
      this.physics(dtReal * 0.0001);
    }

    if (this.state === 'playing' || this.state === 'ending') {
      this.time += dt;
      if (this.state === 'playing') this.raceTime += dt;
      // player input
      if (this.demo) { /* AI drives */ }
      else if (this.state === 'playing' && !pl.wrecked) {
        const d = input.drive(dtReal);
        Object.assign(pl.input, d);
        if (pl.nitroActive === false && d.nitro && pl.nitro > 0.05 && !this._nitroWas) { this.audio.nitroStart(); this.rig.addShake(0.3); }
        this._nitroWas = d.nitro && pl.nitro > 0.05;
        if (input.hit('KeyR', 'PadBack')) this.resetPlayer();
        if (this.mode === 'cop') this.copAbilities(dt);
      } else { pl.input.throttle = 0; pl.input.brake = 0.6; pl.input.nitro = 0; }
      // AI
      for (const c of this.cars) if (c.ai && (c !== pl || this.demo)) c.ai.update(dt, this);
      this.physics(dt);
      if (this.demo) this.demoRules(dt); else this.rules(dt);
      this.updateTraffic(dt);
      this.updateSpikes(dt);
      for (const c of this.cars) { c.syncVisual(dt, this.time); this.vfx.carEffects(c, dt, this.world); }
    }
    this.updateLights();
    this.maxSpeed = Math.max(this.maxSpeed, pl.speed);
    this.updateAudio(dtReal);
  }

  physics(dt) {
    this.acc += dt;
    const h = 1 / 120;
    let steps = 0;
    while (this.acc >= h && steps < 10) {
      for (const c of this.cars) c.step(h);
      this.carCollisions();
      this.acc -= h; steps++;
    }
    if (steps >= 10) this.acc = 0;
  }

  resetPlayer() {
    const pl = this.player;
    if (this.route) {
      const p = pointAtDist(this.route, Math.max(0, this.playerProgress - 10), {});
      pl.place(p.x, p.z, Math.atan2(p.dx, p.dz), 0);
    } else {
      const n = this.world.nav.nearest(pl.pos.x, pl.pos.z);
      const m = this.world.nav.nodes[n.edges[0].to];
      pl.place(n.x, n.z, Math.atan2(m.x - n.x, m.z - n.z), 0);
    }
    this.rig.snap = true;
    this.notify('RESET', 'リセット', '#aaaaaa');
  }

  copAbilities(dt) {
    const pl = this.player, input = this.input, e = this.empState;
    this.spikeCd = Math.max(0, this.spikeCd - dt);
    e.cd = Math.max(0, e.cd - dt);
    if (input.hit('KeyQ', 'PadLB') && this.spikeCd <= 0) {
      this.dropSpike(pl, null, true); this.spikeCd = 12; this.audio.spikes();
      this.notify('SPIKE STRIP', '後方にスパイク設置', '#3aa0ff');
    }
    // EMP: hold E to lock onto racer ahead
    const holding = input.k('KeyE', 'PadRB');
    if (holding && e.cd <= 0) {
      let best = null, bd = 1e9;
      const fx = Math.sin(pl.yaw), fz = Math.cos(pl.yaw);
      for (const r of this.racers) {
        if (r.wrecked || r.ai?.finished) continue;
        const dx = r.pos.x - pl.pos.x, dz = r.pos.z - pl.pos.z, d = Math.hypot(dx, dz);
        if (d > 130 || d < 5) continue;
        if ((dx * fx + dz * fz) / d < 0.9) continue;
        if (d < bd) { bd = d; best = r; }
      }
      if (best && best === e.target) { e.lock += dt; this.audio.empCharge(e.lock / 2); }
      else { e.target = best; e.lock = 0; }
      if (e.target && e.lock >= 2) {
        const r = e.target;
        this.vfx.empBurst(r.pos.x, r.pos.y, r.pos.z);
        this.audio.empFire();
        r.empTimer = 2.5;
        this.damage(r, 0.3, pl);
        this.notify('EMP HIT!', `${r.name} にEMP命中`, '#40a0ff');
        e.cd = 14; e.lock = 0; e.target = null;
      }
    } else { e.lock = Math.max(0, e.lock - dt * 2); if (!holding) e.target = null; }
    this.vfx.empMesh.visible = !!(e.target && e.lock > 0);
    if (e.target && e.lock > 0) { this.vfx.empMesh.position.copy(e.target.pos).y += 1; this.vfx.empMesh.rotation.y += dt * 3; this.vfx.empMesh.scale.setScalar(1.6 - e.lock * 0.3); }
    pl.nitro = Math.min(1, pl.nitro + dt * 0.03);
  }

  rules(dt) {
    const pl = this.player;
    // progress for route modes
    if (this.route) {
      const pr = projectOnRoute(this.route, pl.pos.x, pl.pos.z, this.plIdx || 0, 40);
      if (pr.off < 120) { this.plIdx = pr.index; this.playerProgress = pr.dist; }
      this.playerOff = pr.off;
      // wrong way
      const p = pointAtDist(this.route, this.playerProgress, {});
      this.wrongWay = pl.speed > 8 && (pl.vel.x * p.dx + pl.vel.y * p.dz) / pl.speed < -0.5;
      // checkpoints
      if (this.state === 'playing' && this.checkIdx < this.checkpoints.length && this.playerProgress >= this.checkpoints[this.checkIdx]) {
        this.checkIdx++;
        if (this.checkIdx >= this.checkpoints.length) {
          if (this.mode === 'race') this.finishRace();
          else { this.audio.checkpoint(); }
        } else {
          this.audio.checkpoint();
          this.notify('CHECKPOINT', `${this.checkIdx}/${this.checkpoints.length - 1}   ${fmtTime(this.raceTime)}`, '#ffb400');
          if (this.mode === 'race') pl.nitro = Math.min(1, pl.nitro + 0.1);
        }
        this.updateGate();
      }
      // AI racers finishing
      for (const r of this.racers) {
        if (r === pl || !r.ai || r.ai.finished || r.wrecked) continue;
        if (r.ai.progress >= this.finishDist) {
          r.ai.finished = true; this.finished.push(r);
          if (this.mode === 'cop') {
            this.escapedRacers++;
            this.notify('RACER ESCAPED', `${r.name} が逃走に成功`, '#ff6040');
          }
        }
      }
      // positions
      const standings = this.racers.filter((r) => r !== pl || true).map((r) => ({ r, p: r === pl ? (this.playerFinished ? 1e9 - this.playerPlace : this.playerProgress) : r.ai.finished ? 1e9 - this.finished.indexOf(r) : r.wrecked ? -1 : r.ai.progress }));
      standings.sort((a, b) => b.p - a.p);
      this.standings = standings.map((s) => s.r);
      this.position = this.standings.indexOf(pl) + 1;
      if (this.mode === 'cop') {
        const remaining = this.racers.filter((r) => !r.wrecked && !r.ai.finished).length;
        if (remaining === 0 && this.state === 'playing') this.endGame('cop_done');
      }
    }
    // --- pursuit (race & free) ---
    if (this.mode !== 'cop') this.pursuitRules(dt);
    else {
      // partner cops retarget
      for (const c of this.cops) if (!c.ai.target || c.ai.target.wrecked || c.ai.target.ai?.finished || Math.random() < dt * 0.1) c.ai.target = this.pickCopModeTarget(c);
      if (this.raceTime > 45 && this.cops.filter((c) => !c.wrecked).length < 3 && this.copSpawnCd <= 0) {
        this.copSpawnCd = 25;
        const lead = this.standings.find((r) => r !== pl && !r.wrecked && !r.ai.finished);
        if (lead) {
          const p = pointAtDist(this.route, lead.ai.progress + 350, {});
          const c = this.spawnCop({ x: p.x, z: p.z, yaw: Math.atan2(-p.dx, -p.dz), speed: 0 });
          c.ai.target = lead;
          this.radio('Unit in position ahead of the lead racer.');
        }
      }
      this.copSpawnCd -= dt;
    }
    // near misses / drift / draft (racer roles)
    if (this.mode !== 'cop') this.styleRules(dt);
    // water / out of world
    if (pl.pos.y < WATER_LEVEL + 0.2) { this.drown = (this.drown || 0) + dt; if (this.drown > 1) { this.drown = 0; this.resetPlayer(); pl.health -= 0.1; } }
    // cleanup wrecked
    for (const c of [...this.cars]) {
      if (c.wrecked && c !== pl && c.role !== 'racer' && this.time - c.wreckTime > 8 && this.distToCamera(c) > 40) this.removeCar(c);
    }
    // roadblock activation & cleanup
    for (const rb of this.roadblocks) {
      for (const c of rb.cars) {
        if (!c.ai.parked) continue;
        const d = c.pos.distanceTo(pl.pos);
        const fx = Math.sin(pl.yaw), fz = Math.cos(pl.yaw);
        const passed = ((c.pos.x - pl.pos.x) * fx + (c.pos.z - pl.pos.z) * fz) < -10;
        if (d < 30 && passed) c.ai.parked = false;
        if (c.speed > 3) c.ai.parked = false;
      }
    }
    this.roadblocks = this.roadblocks.filter((rb) => {
      const far = rb.cars.every((c) => !this.cars.includes(c) || c.pos.distanceTo(pl.pos) > 700);
      if (far) rb.cars.forEach((c) => this.cars.includes(c) && this.removeCar(c));
      return !far;
    });
  }

  demoRules(dt) {
    const pl = this.player;
    for (const c of this.cars) c.health = Math.max(c.health, 0.8);
    if (pl.ai.progress > this.demoRoute.length - 200 || (pl.speed < 1 && this.time > 5 && Math.random() < dt * 0.2)) { this.start('demo'); }
    for (const c of this.cops) if (c.pos.distanceTo(pl.pos) > 400) { const q = pointAtDist(this.demoRoute, pl.ai.progress - 60, {}); c.place(q.x, q.z, Math.atan2(q.dx, q.dz), pl.speed); }
  }

  pickCopModeTarget(c) {
    let best = null, bs = 1e9;
    for (const r of this.racers) { if (r.wrecked || r.ai.finished) continue; const d = r.pos.distanceTo(c.pos); if (d < bs) { bs = d; best = r; } }
    return best;
  }

  pursuitRules(dt) {
    const pl = this.player;
    const active = this.cops.filter((c) => !c.wrecked);
    if (this.mode === 'race') {
      this.pursuit = this.raceTime > 8;
      this.heat = this.pursuit ? clamp(1 + Math.floor(this.raceTime / 32), 1, 5) : 0;
    } else {
      // free roam: detection & escape
      let seen = false;
      for (const c of active) {
        if (c.ai.parked) continue;
        const d = c.pos.distanceTo(pl.pos);
        if (d < 70 || (d < 230 && this.world.statics.los(c.pos.x, c.pos.z, pl.pos.x, pl.pos.z))) { seen = true; break; }
      }
      if (this.pursuit) {
        this.pursuitTime += dt;
        if (seen) this.lastSeen = 0; else this.lastSeen += dt;
        this.heat = clamp(Math.max(this.heat, 1 + Math.floor(this.pursuitTime / 40) + Math.floor(this.takedowns / 3)), 1, 5);
        this.bounty += dt * (10 + this.heat * 15) * (pl.speed > 30 ? 2 : 1);
        if (this.lastSeen > 14 && !active.some((c) => !c.ai.retire && !c.ai.parked && c.pos.distanceTo(pl.pos) < 160)) {
          // escaped
          this.pursuit = false; this.escapes++;
          const bonus = 3000 * this.heat;
          this.bounty += bonus;
          this.notify('ESCAPED!', `逃走成功  +${bonus}`, '#30ff90', true);
          this.audio.victory();
          this.radio('We lost the suspect. All units return to patrol.');
          for (const c of [...this.cops]) if (c.pos.distanceTo(pl.pos) > 100 || true) { c.sirenOn = false; c.ai.target = null; c.ai.retire = true; }
          this.cooldown = 20; this.heat = Math.max(1, this.heat - 1);
        }
      } else {
        this.cooldown -= dt;
        if (this.cooldown < -28 && this.raceTime > 10) {
          // dispatch: a witness reported the player
          this.pursuit = true; this.lastSeen = -20; this.pursuitTime = 0; this.cooldown = 0;
          for (const k of active) if (k.ai.patrol) { k.ai.patrol = false; k.sirenOn = true; k.ai.target = pl; }
          this.notify('PURSUIT!', '通報により追跡開始', '#ff3050', true);
          this.radio(`Dispatch, we have a report of a street racer near ${this.areaName(pl)}. All units respond.`);
        }
        // patrols
        const patrols = active.filter((c) => c.ai.patrol);
        if (this.cooldown <= 0 && patrols.length < 2 && this.raceTime > 3) {
          const c = this.spawnPursuitCop();
          if (c) { c.ai.patrol = true; c.sirenOn = false; c.ai.target = null; c.ai.trafficAI = new TrafficAI(c, this); const n = this.world.nav.nearest(c.pos.x, c.pos.z); c.ai.trafficAI.spawnAt(n, this); c.ai.trafficAI.cruise = 16; }
        }
        for (const c of patrols) {
          const d = c.pos.distanceTo(pl.pos);
          const sees = d < 40 || (d < 120 && this.world.statics.los(c.pos.x, c.pos.z, pl.pos.x, pl.pos.z));
          if (sees && (pl.speed > 22 || d < 25)) {
            this.pursuit = true; this.lastSeen = 0; this.pursuitTime = 0;
            for (const k of patrols) { k.ai.patrol = false; k.sirenOn = true; k.ai.target = pl; }
            this.notify('PURSUIT!', '追跡開始！逃げ切れ', '#ff3050', true);
            this.radio(`Suspect spotted heading ${this.headingWord(pl)} through ${this.areaName(pl)}. In pursuit!`);
            break;
          }
        }
      }
      // retire cops after escape
      for (const c of [...this.cops]) if (c.ai.retire && c.pos.distanceTo(pl.pos) > 160 && this.distToCamera(c) > 120) this.removeCar(c);
    }
    // spawn cops per heat
    this.copSpawnCd -= dt;
    if (this.pursuit) {
      const want = [0, 2, 3, 4, 5, 6][this.heat] + (this.mode === 'race' ? 0 : 0);
      const chasing = active.filter((c) => !c.ai.parked && !c.ai.retire).length;
      if (chasing < want && this.copSpawnCd <= 0) {
        const c = this.spawnPursuitCop();
        this.copSpawnCd = 4;
        if (c && Math.random() < 0.4) this.radio(`Unit responding. Suspect heading ${this.headingWord(pl)}.`);
      }
      // heat change notifications
      if (this.heat !== this.lastHeat) {
        if (this.lastHeat !== undefined && this.heat > this.lastHeat) {
          this.notify(`HEAT LEVEL ${this.heat}`, ['', '', '応援パトカー接近', 'ロードブロック展開開始', '重装甲SUV出動', '全車両出動'][this.heat], '#ff4040');
          this.radio(['', '', 'Requesting backup!', 'Setting up roadblocks!', 'Sending in the heavies!', 'All units, maximum pursuit authorized!'][this.heat]);
        }
        this.lastHeat = this.heat;
      }
      // roadblocks
      this.roadblockCd -= dt;
      if (this.heat >= 3 && this.roadblockCd <= 0) { this.roadblockCd = 40 - this.heat * 4; this.spawnRoadblock(); }
      // retarget
      for (const c of active) {
        if (c.ai.patrol || c.ai.retire) continue;
        if (!c.ai.target || c.ai.target.wrecked || c.ai.target.ai?.finished || Math.random() < dt * 0.15) c.ai.target = this.pickTarget(c);
      }
    }
    // bust meter
    let copNear = false;
    for (const c of active) if (!c.ai.patrol && c.pos.distanceTo(pl.pos) < 11) copNear = true;
    if (this.state === 'playing' && copNear && pl.speed < 6 && this.pursuit) this.bust += dt / 3.2;
    else this.bust = Math.max(0, this.bust - dt * 0.6);
    if (this.bust >= 1 && this.state === 'playing') this.endGame('busted');
    // too many cops far away -> recycle
    for (const c of [...this.cops]) {
      if (c.wrecked || c.ai.parked || c.ai.patrol) continue;
      if (c.pos.distanceTo(pl.pos) > (this.route ? 650 : 900) && this.distToCamera(c) > 250) this.removeCar(c);
    }
  }

  styleRules(dt) {
    const pl = this.player;
    const fx = Math.sin(pl.yaw), fz = Math.cos(pl.yaw), rx = -fz, rz = fx;
    // near miss
    for (const o of this.cars) {
      if (o === pl || o.wrecked) continue;
      const dx = o.pos.x - pl.pos.x, dz = o.pos.z - pl.pos.z;
      if (Math.abs(dx) > 14 || Math.abs(dz) > 14) { this.nearMiss.delete(o.id); continue; }
      const along = dx * fx + dz * fz, lat = Math.abs(dx * rx + dz * rz);
      const prev = this.nearMiss.get(o.id);
      const relSpeed = Math.hypot(pl.vel.x - o.vel.x, pl.vel.y - o.vel.y);
      if (prev !== undefined && prev > 0 && along <= 0 && lat < 3.6 && relSpeed > 20 && !(this.lastHitWith === o && this.time - this.lastHitT < 1.5)) {
        this.audio.nearMiss();
        pl.nitro = Math.min(1, pl.nitro + 0.08); this.bounty += 250;
        this.notify('NEAR MISS', '+250', '#40d0ff');
      }
      this.nearMiss.set(o.id, along);
    }
    // drift
    if (pl.drifting && pl.speed > 15) {
      this.driftT += dt; pl.nitro = Math.min(1, pl.nitro + dt * 0.09); this.bounty += dt * 120;
    } else if (this.driftT > 0) {
      if (this.driftT > 1.2) this.notify('DRIFT', `${this.driftT.toFixed(1)}s  +${Math.round(this.driftT * 120)}`, '#ffd040');
      this.driftT = 0;
    }
    // drafting
    this.drafting = false;
    if (pl.speed > 28) for (const o of this.cars) {
      if (o === pl) continue;
      const dx = o.pos.x - pl.pos.x, dz = o.pos.z - pl.pos.z;
      const along = dx * fx + dz * fz, lat = Math.abs(dx * rx + dz * rz);
      if (along > 5 && along < 20 && lat < 1.8) { this.drafting = true; pl.nitro = Math.min(1, pl.nitro + dt * 0.07); break; }
    }
    if (!pl.grounded) pl.nitro = Math.min(1, pl.nitro + dt * 0.1);
    // speed bounty
    if (pl.speed > 55) this.bounty += dt * 40;
  }

  updateSpikes(dt) {
    for (const s of this.spikes) {
      s.t -= dt;
      const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw), rx = -fz, rz = fx;
      for (const c of this.cars) {
        if (c.role === 'cop' || c.role === 'traffic' || s.hit.has(c.id)) continue;
        const dx = c.pos.x - s.x, dz = c.pos.z - s.z;
        if (Math.abs(dx) > 8 || Math.abs(dz) > 8) continue;
        const along = dx * fx + dz * fz, lat = dx * rx + dz * rz;
        if (Math.abs(along) < 1.6 && Math.abs(lat) < 4.4) {
          s.hit.add(c.id);
          c.flatTimer = 9;
          this.damage(c, 0.22, null);
          this.vfx.sparks(c.pos.x, c.pos.y, c.pos.z, 0, 0, 30, 1);
          if (c === this.player) { this.audio.spikes(); this.notify('SPIKED!', 'タイヤがパンク！', '#ff3030'); this.rig.addShake(0.6); this.hud.flashDamage(0.6); }
          else if (c.pos.distanceTo(this.player.pos) < 150) { this.audio.spikes(); if (this.mode === 'cop') this.notify('SPIKED!', `${c.name} がスパイクを踏んだ`, '#3aa0ff'); }
        }
      }
    }
    this.spikes = this.spikes.filter((s) => { if (s.t <= 0) { this.scene.remove(s.mesh); return false; } return true; });
  }

  updateTraffic(dt, frozen = false) {
    if (frozen) return;
    this.trafficCd -= dt;
    if (this.trafficCd > 0) return;
    this.trafficCd = 0.4;
    const pl = this.player;
    for (const c of this.traffic) {
      const d = c.pos.distanceTo(pl.pos);
      const stuck = c.speed < 0.5 && !c.ai.stunned;
      c.stuckT = stuck ? (c.stuckT || 0) + 0.4 : 0;
      if ((d > 700 || c.stuckT > 12) && this.distToCamera(c) > 150) { this.respawnTraffic(c); c.stuckT = 0; }
    }
  }

  updateGate() {
    if (!this.route || this.checkIdx >= this.checkpoints.length) { this.gates.visible = false; return; }
    const d = this.checkpoints[this.checkIdx];
    const p = pointAtDist(this.route, d, {});
    const final = this.checkIdx === this.checkpoints.length - 1;
    this.gates.visible = true;
    this.gates.position.set(p.x, this.world.heightAt(p.x, p.z), p.z);
    this.gates.rotation.y = Math.atan2(p.dx, p.dz);
    const w = this.world.hf.onRoad(p.x, p.z) && Math.abs(p.x) < 640 && Math.abs(p.z) < 640 ? 0.85 : 1.05;
    this.gates.scale.set(w, 1, 1);
    this.gateMats.pylonMat.emissive.set(final ? 0x30ff60 : this.mode === 'cop' ? 0x3080ff : 0xff9a20);
    this.gateMats.beamMat.color.set(final ? new THREE.Color(0.3, 1.5, 0.5) : this.mode === 'cop' ? new THREE.Color(0.3, 0.7, 1.8) : new THREE.Color(1.5, 0.9, 0.2));
    this.gatePos = p;
  }

  finishRace() {
    const pl = this.player;
    this.playerFinished = true;
    this.finished.push(pl);
    this.playerPlace = this.finished.indexOf(pl) + 1;
    this.endGame('finish');
  }

  endGame(reason) {
    if (this.state === 'ending' || this.state === 'result') return;
    this.state = 'ending';
    const pl = this.player;
    this.result = { reason, time: this.raceTime, place: this.playerPlace || this.position, takedowns: this.takedowns, bounty: Math.round(this.bounty), maxSpeed: this.maxSpeed * 3.6, busted: this.bustedRacers, escaped: this.escapedRacers, escapes: this.escapes, heat: this.heat };
    if (reason === 'busted') { this.audio.busted(); this.notify('BUSTED', '逮捕された…', '#ff3050', true); this.radio('Suspect is in custody. Good work everyone.'); }
    else if (reason === 'wrecked' || reason === 'wrecked_cop') { this.audio.busted(); this.notify('WRECKED', '車両大破', '#ff3050', true); }
    else if (reason === 'finish') { this.audio.victory(); this.notify(this.playerPlace === 1 ? 'VICTORY!' : `FINISH  ${this.playerPlace}位`, fmtTime(this.raceTime), '#30ff90', true); }
    else if (reason === 'cop_done') { this.audio.victory(); this.notify('EVENT COMPLETE', `摘発 ${this.bustedRacers}/4`, '#3aa0ff', true); }
    // orbit camera on player
    this.rig.startCine({ type: 'orbit', target: () => pl.pos, r: 8, h: 2.2, speed: 0.3, a0: pl.yaw + Math.PI * 0.8 });
    this.audio.music && this.audio.music.setLevel(0);
    setTimeout(() => { this.state = 'result'; this.onResult && this.onResult(this.result); }, 3200);
  }

  // ---------------- lights, audio ----------------
  updateLights() {
    const pl = this.player;
    // nearest two cops get real point lights
    const cops = this.cops.filter((c) => !c.wrecked && c.sirenOn !== false).sort((a, b) => a.pos.distanceToSquared(this.camera.position) - b.pos.distanceToSquared(this.camera.position));
    const pc = pl.police ? pl : cops[0];
    const L = this.copLights;
    const own = pc === pl;
    const fp = own && (this.rig.mode === 'cockpit' || this.rig.mode === 'hood') && !this.rig.cine;
    if (pc && !fp && pc.pos.distanceTo(this.camera.position) < 150) {
      L[0].position.set(pc.pos.x, pc.pos.y + (own ? 3 : 2), pc.pos.z); L[1].position.copy(L[0].position);
      const k = own ? 0.45 : 1;
      L[0].intensity = pc.flashA ? 40 * k : 0; L[1].intensity = pc.flashB ? 55 * k : 0;
    } else { L[0].intensity = L[1].intensity = 0; }
    // player headlight
    const fx = Math.sin(pl.yaw), fz = Math.cos(pl.yaw);
    this.headlight.intensity = 60;
    this.headlight.position.set(pl.pos.x + fx * 2.2, pl.pos.y + 0.8, pl.pos.z + fz * 2.2);
    this.headlight.target.position.set(pl.pos.x + fx * 30, pl.pos.y - 1, pl.pos.z + fz * 30);
    // siren edge glow on screen when close
    let near = 0, fl = 0;
    for (const c of cops.slice(0, 1)) { const d = c.pos.distanceTo(pl.pos); near = clamp(1 - d / 25, 0, 1); fl = c.flashA ? 1 : c.flashB ? -1 : 0; }
    this.sirenGlow = { r: fl > 0 ? 1 : 0, b: fl < 0 ? 1 : 0, a: near };
  }

  updateAudio(dt) {
    const pl = this.player; const a = this.audio;
    if (!a.ready) return;
    const sir = [];
    const cops = this.cops.filter((c) => !c.wrecked && c.sirenOn !== false);
    if (pl.police) cops.unshift(pl);
    cops.sort((x, y) => x.pos.distanceToSquared(pl.pos) - y.pos.distanceToSquared(pl.pos));
    const camR = new THREE.Vector3(); this.camera.getWorldDirection(camR);
    for (const c of cops.slice(0, 2)) {
      const dx = c.pos.x - pl.pos.x, dz = c.pos.z - pl.pos.z, d = Math.hypot(dx, dz) || 1;
      const gain = c === pl ? 0.55 : clamp(1 - d / 420, 0, 1) ** 1.6;
      const vrel = ((c.vel.x - pl.vel.x) * dx + (c.vel.y - pl.vel.y) * dz) / d;
      const pan = (dx * -camR.z + dz * camR.x) / d;
      sir.push({ gain, vrel: c === pl ? 0 : vrel, pan: c === pl ? 0 : -pan, mode: c.id % 2 === 0 && d < 60 ? 1 : 0 });
    }
    const active = !this.demo && (this.state === 'playing' || this.state === 'countdown' || this.state === 'ending');
    a.update(dt, { active, rpm: pl.rpm, throttle: pl.input.throttle, speed: pl.speed, skid: pl.skidAmt || 0, offroad: pl.offroad && pl.grounded, nitro: pl.nitroActive, shifted: pl.shifted, sirens: sir });
    pl.shifted = 0;
    // music intensity
    if (a.music && this.state === 'playing') {
      let lvl = 1;
      if (this.mode === 'cop') lvl = 2 + (this.raceTime > 60 ? 1 : 0);
      else if (this.pursuit) lvl = this.heat >= 3 ? 3 : 2;
      a.music.setLevel(lvl);
    }
  }
}

export function fmtTime(t) {
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s < 10 ? '0' : ''}${s.toFixed(2)}`;
}
