// ===== AI controllers: racers, police, traffic =====
import { clamp, wrapAngle, lerp } from './util.js';
import { projectOnRoute, pointAtDist } from './roads.js';

const P = {}; const P2 = {};

function steerToward(car, tx, tz, gain = 2.6) {
  const desired = Math.atan2(tx - car.pos.x, tz - car.pos.z);
  const diff = wrapAngle(desired - car.yaw);
  return { steer: clamp(diff * gain, -1, 1), diff };
}
function speedControl(car, desired) {
  const v = car.vF;
  if (v < desired - 1) { car.input.throttle = clamp((desired - v) / 6, 0.35, 1); car.input.brake = 0; }
  else if (v > desired + 4) { car.input.throttle = 0; car.input.brake = clamp((v - desired) / 12, 0.2, 1); }
  else { car.input.throttle = 0.3; car.input.brake = 0; }
}

// lateral avoidance of cars ahead
function avoidance(car, cars, range = 32) {
  const fx = Math.sin(car.yaw), fz = Math.cos(car.yaw);
  const rx = -fz, rz = fx;
  let push = 0, block = 999;
  for (const o of cars) {
    if (o === car || !o.active) continue;
    const dx = o.pos.x - car.pos.x, dz = o.pos.z - car.pos.z;
    const fwd = dx * fx + dz * fz;
    if (fwd < 2 || fwd > range) continue;
    const lat = dx * rx + dz * rz;
    if (Math.abs(lat) > 4) continue;
    const relV = car.vF - (o.vel.x * fx + o.vel.y * fz);
    if (relV < 2 && fwd > 10) continue;
    const w = (1 - fwd / range) * (1 - Math.abs(lat) / 4);
    push += (lat >= 0 ? -1 : 1) * w;
    if (Math.abs(lat) < 2.2) block = Math.min(block, fwd);
  }
  return { push, block };
}

function curvatureSpeed(route, prog, latA) {
  const a = pointAtDist(route, prog + 8, P);
  const ax = a.dx, az = a.dz;
  let vmax = 999;
  for (const d of [25, 50, 80, 120, 170]) {
    const b = pointAtDist(route, prog + 8 + d, P2);
    const ang = Math.abs(wrapAngle(Math.atan2(b.dx, b.dz) - Math.atan2(ax, az)));
    if (ang < 0.03) continue;
    const R = d / ang;
    // allow braking distance
    const v = Math.sqrt(latA * R) + d * 0.18;
    vmax = Math.min(vmax, v);
  }
  return vmax;
}

export class RacerAI {
  constructor(car, route, skill = 1) {
    this.car = car; this.route = route; this.skill = skill;
    this.idx = 0; this.progress = 0; this.lane = (Math.random() - 0.5) * 6; this.laneT = this.lane;
    this.stuck = 0; this.reverseT = 0; this.finished = false;
  }
  update(dt, game) {
    const car = this.car;
    if (car.wrecked || this.finished) { car.input.throttle = 0; car.input.brake = 1; car.input.nitro = 0; return; }
    const pr = projectOnRoute(this.route, car.pos.x, car.pos.z, this.idx, 30);
    this.idx = pr.index; this.progress = pr.dist;
    const sp = car.speed;
    const look = 10 + sp * 0.5;
    const t = pointAtDist(this.route, this.progress + look, P);
    const av = avoidance(car, game.cars);
    const lim = Math.abs(car.pos.x) < 640 && Math.abs(car.pos.z) < 640 ? 4.5 : 8.5;
    this.laneT = clamp(this.laneT + av.push * dt * 14, -lim, lim);
    if (Math.abs(av.push) < 0.01) this.laneT = lerp(this.laneT, clamp(this.lane, -lim, lim), dt * 0.5);
    const rx = -t.dz, rz = t.dx;
    let tx = t.x + rx * this.laneT, tz = t.z + rz * this.laneT;
    if (pr.off > 30) { const q = pointAtDist(this.route, this.progress + 8, P2); tx = q.x; tz = q.z; }
    const s = steerToward(car, tx, tz, 2.4);
    car.input.steer = s.steer;
    let desired = Math.min(car.spec.top, curvatureSpeed(this.route, this.progress, 26 * car.spec.steer)) * this.skill;
    // rubber band relative to player
    const pl = game.player;
    if (pl && game.mode !== 'cop') {
      const pp = game.playerProgress ?? this.progress;
      const gap = pp - this.progress;
      desired *= 1 + clamp(gap / 900, -0.12, 0.14);
      car.boost = 1 + clamp(gap / 1500, -0.05, 0.12);
    } else if (game.mode === 'cop') { const d = game.player.pos.distanceTo(car.pos); car.boost = d < 60 ? 1.09 : 1.04; if (d < 80) car.nitro = Math.min(1, car.nitro + dt * 0.06); }
    if (av.block < 14 && sp > 10) desired = Math.min(desired, sp * 0.9);
    if (Math.abs(s.diff) > 0.6) desired = Math.min(desired, 18);
    speedControl(car, desired);
    car.input.handbrake = Math.abs(s.diff) > 0.5 && sp > 22 ? 1 : 0;
    car.input.nitro = car.nitro > 0.2 && desired > car.spec.top * 0.85 && Math.abs(s.diff) < 0.1 ? 1 : 0;
    car.nitro = Math.min(1, car.nitro + dt * 0.035);
    this.handleStuck(dt, game);
  }
  handleStuck(dt, game) {
    const car = this.car;
    if (this.reverseT > 0) {
      this.reverseT -= dt;
      car.input.throttle = 0; car.input.brake = 1; car.input.steer = -car.input.steer; car.input.handbrake = 0; car.input.nitro = 0;
      return;
    }
    if (car.speed < 2.5 && car.input.throttle > 0.2) this.stuck += dt; else this.stuck = Math.max(0, this.stuck - dt * 2);
    if (this.stuck > 1.6) { this.reverseT = 1.1; this.stuck = 0; this.stuckCount = (this.stuckCount || 0) + 1; }
    if (this.stuckCount > 3) {
      this.stuckCount = 0;
      if (game.distToCamera(car) > 60) {
        const p = pointAtDist(this.route, this.progress + 20, P);
        car.place(p.x, p.z, Math.atan2(p.dx, p.dz), 15);
      }
    }
  }
}

export class CopAI {
  constructor(car, game) {
    this.car = car; this.target = null; this.path = null; this.pathIdx = 0; this.replan = 0;
    this.mode = 'pursue'; this.stuck = 0; this.reverseT = 0; this.spikeCd = 6 + Math.random() * 6; this.direct = false;
    this.parked = false;
  }
  update(dt, game) {
    const car = this.car;
    if (car.wrecked) { car.input.throttle = 0; car.input.brake = 1; car.input.nitro = 0; return; }
    if (this.patrol && this.trafficAI) { this.trafficAI.update(dt, game); return; }
    if (this.parked) { car.input.throttle = 0; car.input.brake = 1; car.input.steer = 0; car.input.handbrake = 1; return; }
    const tg = this.target;
    if (!tg || tg.wrecked) { car.input.throttle = 0; car.input.brake = 0.5; return; }
    const dx = tg.pos.x - car.pos.x, dz = tg.pos.z - car.pos.z;
    const dist = Math.hypot(dx, dz);
    this.dist = dist;
    this.replan -= dt;
    if (this.replan <= 0) {
      this.replan = 0.8 + Math.random() * 0.4;
      this.direct = dist < 110 && game.world.statics.los(car.pos.x, car.pos.z, tg.pos.x, tg.pos.z);
      if (!this.direct) {
        const nav = game.world.nav;
        const a = nav.nearest(car.pos.x, car.pos.z), b = nav.nearest(tg.pos.x + tg.vel.x * 1.5, tg.pos.z + tg.vel.y * 1.5);
        const ids = a && b ? nav.astar(a.id, b.id) : null;
        if (ids && ids.length > 1) {
          let d = 0; const pts = ids.map((id, i) => { const n = nav.nodes[id]; if (i) { const q = nav.nodes[ids[i - 1]]; d += Math.hypot(n.x - q.x, n.z - q.z); } return { x: n.x, z: n.z, d }; });
          this.path = { pts, length: d }; this.pathIdx = 0;
        } else this.path = null;
      }
    }
    let tx, tz, desired;
    const sp = car.speed;
    if (this.direct || !this.path) {
      const lead = clamp(dist / 55, 0, 1.3);
      tx = tg.pos.x + tg.vel.x * lead; tz = tg.pos.z + tg.vel.y * lead;
      if (dist < 16) {
        // aim slightly toward the target's rear corner for PIT style hits
        const tfx = Math.sin(tg.yaw), tfz = Math.cos(tg.yaw);
        const side = (dx * -tfz + dz * tfx) > 0 ? -1 : 1;
        tx = tg.pos.x - tfx * 1.5 + -tfz * side * 1.2; tz = tg.pos.z - tfz * 1.5 + tfx * side * 1.2;
      }
      desired = tg.speed + clamp(dist * 0.6, 4, 30);
      // avoid suicidal head-on: when approaching from the front, pass alongside then turn around
      const hd = Math.cos(car.yaw - tg.yaw);
      const cfx = Math.sin(car.yaw), cfz = Math.cos(car.yaw);
      const inFront = (dx * cfx + dz * cfz) > 0;
      if (hd < -0.4 && inFront && dist < 90 && dist > 8) {
        const trx = -Math.cos(tg.yaw), trz = Math.sin(tg.yaw);
        const side = ((car.pos.x - tg.pos.x) * trx + (car.pos.z - tg.pos.z) * trz) >= 0 ? 1 : -1;
        tx = tg.pos.x + trx * 8 * side; tz = tg.pos.z + trz * 8 * side;
        desired = 14;
      }
    } else {
      const pr = projectOnRoute(this.path, car.pos.x, car.pos.z, this.pathIdx, 20);
      this.pathIdx = pr.index;
      const t = pointAtDist(this.path, pr.dist + 10 + sp * 0.45, P);
      tx = t.x; tz = t.z;
      desired = Math.min(car.spec.top, curvatureSpeed(this.path, pr.dist, 26));
      if (pr.dist > this.path.length - 30) this.replan = 0;
    }
    const s = steerToward(car, tx, tz, 2.6);
    const av = avoidance(car, game.traffic, 26);
    car.input.steer = clamp(s.steer + av.push * 0.5, -1, 1);
    if (Math.abs(s.diff) > 0.7) desired = Math.min(desired, 16);
    desired = Math.min(desired, car.spec.top * 1.1);
    speedControl(car, desired);
    car.input.handbrake = Math.abs(s.diff) > 0.55 && sp > 22 ? 1 : 0;
    car.input.nitro = car.nitro > 0.2 && dist > 45 && Math.abs(s.diff) < 0.1 ? 1 : 0;
    car.nitro = Math.min(1, car.nitro + dt * 0.05);
    // rubber band
    car.boost = dist > 250 ? 1.18 : dist > 120 ? 1.1 : dist > 40 ? 1.04 : 1.0;
    // spike strip decision: cop ahead of target and target approaching
    this.spikeCd -= dt;
    if (this.spikeCd < 0 && game.heat >= 2 && dist < 70 && dist > 20) {
      const tfx = Math.sin(tg.yaw), tfz = Math.cos(tg.yaw);
      const ahead = (-dx) * tfx + (-dz) * tfz;
      if (ahead > 20 && tg.speed > 20) { game.dropSpike(car, tg); this.spikeCd = 14 + Math.random() * 8; }
    }
    // stuck
    if (this.reverseT > 0) { this.reverseT -= dt; car.input.throttle = 0; car.input.brake = 1; car.input.steer = -s.steer; car.input.nitro = 0; return; }
    if (sp < 2.5 && car.input.throttle > 0.2) this.stuck += dt; else this.stuck = Math.max(0, this.stuck - dt * 2);
    if (this.stuck > 1.4) { this.reverseT = 1.0; this.stuck = 0; }
  }
}

export class TrafficAI {
  constructor(car, game) {
    this.car = car; this.game = game; this.cur = null; this.next = null; this.prev = null; this.stunned = 0;
    this.cruise = 14;
  }
  spawnAt(node, game) {
    const nav = game.world.nav;
    this.prev = null; this.cur = node;
    const e = node.edges[Math.floor(Math.random() * node.edges.length)];
    this.next = nav.nodes[e.to];
    const dx = this.next.x - node.x, dz = this.next.z - node.z; const l = Math.hypot(dx, dz) || 1;
    const lane = this.lane = this.laneFor(node);
    const x = node.x + (-dz / l) * lane, z = node.z + (dx / l) * lane;
    this.car.place(x, z, Math.atan2(dx, dz), this.cruise * 0.8);
    this.car.health = 1; this.car.wrecked = false; this.stunned = 0;
  }
  laneFor(n) {
    const city = Math.abs(n.x) <= 600 && Math.abs(n.z) <= 600;
    if (city) { this.cruise = 13 + Math.random() * 4; return 5; }
    const hw = n.h !== undefined && n.h > 0 && this.game.world.hf.roadDist(n.x, n.z) < 0 && Math.hypot(n.x, n.z) > 1000;
    this.cruise = hw ? 24 + Math.random() * 5 : 19 + Math.random() * 4;
    return hw ? 6.5 : 4.8;
  }
  update(dt, game) {
    const car = this.car;
    if (this.stunned > 0) { this.stunned -= dt; car.input.throttle = 0; car.input.brake = 1; car.input.steer = 0; return; }
    if (!this.next) return;
    const nav = game.world.nav;
    const c = this.cur, n = this.next;
    let dx = n.x - c.x, dz = n.z - c.z; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    const lane = this.lane;
    const tx = n.x - dz * lane, tz = n.z + dx * lane;
    const dd = Math.hypot(tx - car.pos.x, tz - car.pos.z);
    if (dd < 9 || ((tx - car.pos.x) * dx + (tz - car.pos.z) * dz) < 0) {
      // advance
      const opts = n.edges.filter((e) => e.to !== c.id);
      const pick = opts.length ? opts[Math.floor(Math.random() * opts.length)] : n.edges[0];
      // prefer straight
      let best = pick;
      if (opts.length > 1 && Math.random() < 0.65) {
        let bs = -2;
        for (const e of opts) { const m = nav.nodes[e.to]; const ex = m.x - n.x, ez = m.z - n.z; const el = Math.hypot(ex, ez) || 1; const d = (ex * dx + ez * dz) / el; if (d > bs) { bs = d; best = e; } }
      }
      this.prev = c; this.cur = n; this.next = nav.nodes[best.to]; this.lane = this.laneFor(n);
    }
    // steer to look-ahead point on lane
    const s = steerToward(car, tx, tz, 2.0);
    car.input.steer = s.steer;
    let desired = this.cruise;
    if (Math.abs(s.diff) > 0.35) desired = Math.min(desired, 9);
    const av = avoidance(car, game.carsNear(car, 30), 22);
    if (av.block < 20) desired = Math.min(desired, Math.max(0, (av.block - 7) * 1.2));
    speedControl(car, desired);
    car.input.handbrake = 0; car.input.nitro = 0;
  }
}
