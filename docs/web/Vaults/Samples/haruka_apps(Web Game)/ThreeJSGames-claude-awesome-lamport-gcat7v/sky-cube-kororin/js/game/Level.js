// =========================================================
// Level — ステージの組み立て・あたり判定・ギミック
//  ステージは js/game/levels/*.js にデータとして書きます。
//  すべてのブロックは「軸にそった箱(AABB)」なので、
//  どの面にも立てる(=どの面も ゆか になれる)。
// =========================================================
import * as THREE from 'three';
import { createBlockMaterial, createBoxInstances, createSingleBox } from '../vfx/Materials.js';
import { StarPickup, Goal } from './Entities.js';

export const DIRS = {
  '+x': new THREE.Vector3(1, 0, 0), '-x': new THREE.Vector3(-1, 0, 0),
  '+y': new THREE.Vector3(0, 1, 0), '-y': new THREE.Vector3(0, -1, 0),
  '+z': new THREE.Vector3(0, 0, 1), '-z': new THREE.Vector3(0, 0, -1),
};
export const dirVec = (s) => (typeof s === 'string' ? DIRS[s].clone() : new THREE.Vector3(...s).normalize());
const V = (a) => (a.isVector3 ? a.clone() : new THREE.Vector3(a[0], a[1], a[2]));
const AXES = ['x', 'y', 'z'];

// ---------------------------------------------------------
// ステージを組み立てるためのビルダー(levels/*.js から使う)
// ---------------------------------------------------------
class LevelBuilder {
  constructor(level) {
    this.level = level;
    this.palette = level.def.palette.blocks;
  }

  _color(o) {
    if (o.color) return o.color;
    const i = o.c ?? 0;
    return this.palette[i % this.palette.length];
  }

  /** min/max で箱を置く */
  box(min, max, o = {}) {
    const b = {
      min: V(min), max: V(max), kind: 'static', hazard: !!o.hazard, active: true,
      color: this._color(o),
    };
    this.level.boxes.push(b);
    return b;
  }

  /** 中心とサイズで箱を置く */
  block(center, size, o = {}) {
    const c = V(center), s = V(size).multiplyScalar(0.5);
    return this.box(c.clone().sub(s), c.clone().add(s), o);
  }

  hazard(center, size, o = {}) { return this.block(center, size, { ...o, hazard: true }); }

  /** 内側が inner サイズの部屋(6まいの かべ) */
  room(center, inner, t = 1, o = {}) {
    const c = V(center), h = V(inner).multiplyScalar(0.5);
    const skip = o.skip || [];
    const out = h.clone().addScalar(t);
    const faces = {
      '-y': [[-out.x, -out.y, -out.z], [out.x, -h.y, out.z], 0],
      '+y': [[-out.x, h.y, -out.z], [out.x, out.y, out.z], 1],
      '-x': [[-out.x, -h.y, -h.z], [-h.x, h.y, h.z], 2],
      '+x': [[h.x, -h.y, -h.z], [out.x, h.y, h.z], 3],
      '-z': [[-out.x, -h.y, -out.z], [out.x, h.y, -h.z], 4],
      '+z': [[-out.x, -h.y, h.z], [out.x, h.y, out.z], 5],
    };
    for (const [k, [a, b, ci]] of Object.entries(faces)) {
      if (skip.includes(k)) continue;
      this.box(c.clone().add(V(a)), c.clone().add(V(b)), { ...o, c: o.colors ? o.colors[ci] : (o.c ?? ci) });
    }
  }

  /**
   * あなの あいた いた(y 方向の しきり)
   * @param {number} y0 下面の高さ
   * @param {number[]} rect [x0, x1, z0, z1] いた全体
   * @param {number[]} hole [x0, x1, z0, z1] あな
   */
  slabY(y0, thickness, rect, hole, o = {}) {
    const [X0, X1, Z0, Z1] = rect;
    const [hx0, hx1, hz0, hz1] = hole;
    const y1 = y0 + thickness;
    if (hz0 > Z0) this.box([X0, y0, Z0], [X1, y1, hz0], o);
    if (hz1 < Z1) this.box([X0, y0, hz1], [X1, y1, Z1], o);
    if (hx0 > X0) this.box([X0, y0, hz0], [hx0, y1, hz1], o);
    if (hx1 < X1) this.box([hx1, y0, hz0], [X1, y1, hz1], o);
  }

  /** 行ったり来たりする ブロック */
  mover(center, size, { axis = 'x', amp = 3, period = 4, phase = 0, hazard = false, c = 2, color } = {}) {
    const b = this.block(center, size, { hazard, c, color });
    b.kind = 'mover';
    b.mover = { base: V(center), half: V(size).multiplyScalar(0.5), axis, amp, period, phase, delta: new THREE.Vector3(), offset: 0 };
    return b;
  }

  /** のると くずれる ブロック */
  crumble(center, size, { delay = 0.75, respawn = 3.5, color = '#ffc98a' } = {}) {
    const b = this.block(center, size, { color });
    b.kind = 'crumble';
    b.crumble = { state: 'idle', t: 0, delay, respawn, center: V(center), half: V(size).multiplyScalar(0.5) };
    return b;
  }

  star(pos) {
    const s = new StarPickup(V(pos));
    this.level.stars.push(s);
    return s;
  }

  goal(pos, normal = '+y', need = 0) {
    this.level.goal = new Goal(V(pos), dirVec(normal), need);
    return this.level.goal;
  }
}

// ---------------------------------------------------------
export class Level {
  constructor(def) {
    this.def = def;
    this.group = new THREE.Group();
    this.boxes = [];
    this.stars = [];
    this.goal = null;
    this.dynamic = [];   // mover / crumble
    this.time = 0;

    const builder = new LevelBuilder(this);
    def.build(builder);
    this._buildMeshes();
    this._buildLights();

    if (this.stars.length) this.group.add(...this.stars);
    if (this.goal) this.group.add(this.goal);

    const b = def.bounds || { center: [0, 0, 0], radius: 80 };
    this.boundsCenter = V(b.center);
    this.boundsRadius = b.radius;
  }

  _buildMeshes() {
    const p = this.def.palette;
    const common = {
      tintX: p.tintX, tintY: p.tintY, tintZ: p.tintZ,
      edgeColor: p.edge, gridColor: p.grid, edgeStrength: p.edgeStrength ?? 0.9, gridStrength: p.gridStrength ?? 0.18,
    };
    this.blockMat = createBlockMaterial(common);
    this.hazardMat = createBlockMaterial({ ...common, hazard: true, hazardColor: p.hazard || '#c070ff', edgeColor: p.hazard || '#c070ff', edgeStrength: 1.4 });
    this.crumbleMatBase = { ...common, edgeColor: '#ffb35c', edgeStrength: 1.1, gridStrength: 0.05 };

    const statics = this.boxes.filter((b) => b.kind === 'static' && !b.hazard);
    const hazards = this.boxes.filter((b) => b.kind === 'static' && b.hazard);
    this.staticMesh = createBoxInstances(this.blockMat, statics);
    this.hazardMesh = createBoxInstances(this.hazardMat, hazards, { castShadow: false });
    this.group.add(this.staticMesh, this.hazardMesh);

    this.crumbleMats = [];
    for (const b of this.boxes) {
      if (b.kind === 'mover') {
        const size = b.mover.half.clone().multiplyScalar(2);
        b.mesh = createSingleBox(b.hazard ? this.hazardMat : this.blockMat, size, b.color);
        b.mesh.position.copy(b.mover.base);
        this.group.add(b.mesh);
        this.dynamic.push(b);
      } else if (b.kind === 'crumble') {
        const size = b.crumble.half.clone().multiplyScalar(2);
        const mat = createBlockMaterial({ ...this.crumbleMatBase, transparent: true });
        this.crumbleMats.push(mat);
        b.mesh = createSingleBox(mat, size, b.color);
        b.mesh.position.copy(b.crumble.center);
        this.group.add(b.mesh);
        this.dynamic.push(b);
      }
    }
  }

  _buildLights() {
    const L = this.def.lights || {};
    this.hemi = new THREE.HemisphereLight(L.sky || '#dff0ff', L.ground || '#ffd6ec', L.hemi ?? 1.6);
    this.sun = new THREE.DirectionalLight(L.sun || '#fff6e0', L.sunIntensity ?? 1.6);
    this.sunOffset = V(L.sunDir || [8, 20, 10]);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    const s = 18;
    Object.assign(this.sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 80 });
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.03;
    this.group.add(this.hemi, this.sun, this.sun.target);
  }

  /** 影のカメラをプレイヤーに追従させる */
  followLight(pos) {
    this.sun.target.position.copy(pos);
    this.sun.position.copy(pos).add(this.sunOffset);
  }

  // ---------------------------------------------------------
  update(dt, player) {
    this.time += dt;
    for (const b of this.dynamic) {
      if (b.kind === 'mover') {
        const m = b.mover;
        const prev = m.offset;
        m.offset = Math.sin((this.time / m.period) * Math.PI * 2 + m.phase) * m.amp;
        m.delta.set(0, 0, 0);
        m.delta[m.axis] = m.offset - prev;
        const c = m.base.clone();
        c[m.axis] += m.offset;
        b.min.copy(c).sub(m.half);
        b.max.copy(c).add(m.half);
        b.mesh.position.copy(c);
      } else if (b.kind === 'crumble') {
        this._updateCrumble(b, dt);
      }
    }
    const up = player ? player.up : DIRS['+y'];
    for (const s of this.stars) s.update(dt, up);
    this.goal?.update(dt);
  }

  _updateCrumble(b, dt) {
    const c = b.crumble;
    const mat = b.mesh.material;
    c.t += dt;
    if (c.state === 'shaking') {
      const k = Math.min(1, c.t / c.delay);
      b.mesh.position.copy(c.center).add(new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).multiplyScalar(0.12 * k));
      mat.userData.uniforms.uPulse.value = k * 1.5 * (0.5 + 0.5 * Math.sin(c.t * 40));
      if (c.t >= c.delay) {
        c.state = 'falling';
        c.t = 0;
        b.active = false;
        this.onCrumble?.(b);
      }
    } else if (c.state === 'falling') {
      b.mesh.position.y -= dt * (4 + c.t * 14);
      b.mesh.rotation.x += dt * 1.5;
      mat.opacity = Math.max(0, 1 - c.t / 0.9);
      if (c.t > 0.9) { c.state = 'gone'; c.t = 0; b.mesh.visible = false; }
    } else if (c.state === 'gone') {
      if (c.t > c.respawn) {
        c.state = 'idle';
        c.t = 0;
        b.active = true;
        b.mesh.visible = true;
        b.mesh.rotation.set(0, 0, 0);
        b.mesh.position.copy(c.center);
        b.mesh.scale.setScalar(0.01);
        c.pop = 0;
        mat.opacity = 1;
        mat.userData.uniforms.uPulse.value = 0;
      }
    } else if (c.state === 'idle' && c.pop !== undefined && c.pop < 1) {
      c.pop = Math.min(1, c.pop + dt / 0.35);
      const e = 1 + Math.sin(c.pop * Math.PI) * 0.15;
      b.mesh.scale.setScalar(c.pop * e);
    }
  }

  /** プレイヤーが くずれる床に のったとき */
  touchCrumble(b) {
    if (b.kind === 'crumble' && b.crumble.state === 'idle') {
      b.crumble.state = 'shaking';
      b.crumble.t = 0;
      return true;
    }
    return false;
  }

  // ---------------------------------------------------------
  // あたり判定: 球 vs 箱
  // ---------------------------------------------------------
  collideSphere(pos, r, vel, up, out) {
    out.grounded = false;
    out.ground = null;
    out.hazard = null;
    out.hazardNormal = null;
    out.groundNormal = null;
    const r2 = r * r;
    for (let iter = 0; iter < 2; iter++) {
      for (const b of this.boxes) {
        if (!b.active) continue;
        const cx = Math.max(b.min.x, Math.min(pos.x, b.max.x));
        const cy = Math.max(b.min.y, Math.min(pos.y, b.max.y));
        const cz = Math.max(b.min.z, Math.min(pos.z, b.max.z));
        let dx = pos.x - cx, dy = pos.y - cy, dz = pos.z - cz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= r2) continue;
        let nx, ny, nz, pen;
        if (d2 > 1e-10) {
          const d = Math.sqrt(d2);
          nx = dx / d; ny = dy / d; nz = dz / d;
          pen = r - d;
        } else {
          // 中心が箱の中: いちばん近い面から押し出す
          let best = Infinity;
          for (const a of AXES) {
            const toMin = pos[a] - b.min[a];
            const toMax = b.max[a] - pos[a];
            if (toMin < best) { best = toMin; nx = a === 'x' ? -1 : 0; ny = a === 'y' ? -1 : 0; nz = a === 'z' ? -1 : 0; }
            if (toMax < best) { best = toMax; nx = a === 'x' ? 1 : 0; ny = a === 'y' ? 1 : 0; nz = a === 'z' ? 1 : 0; }
          }
          pen = best + r;
        }
        pos.x += nx * pen; pos.y += ny * pen; pos.z += nz * pen;
        const vn = vel.x * nx + vel.y * ny + vel.z * nz;
        if (vn < 0) { vel.x -= nx * vn; vel.y -= ny * vn; vel.z -= nz * vn; }
        if (b.hazard) { out.hazard = b; out.hazardNormal = new THREE.Vector3(nx, ny, nz); }
        const upDot = nx * up.x + ny * up.y + nz * up.z;
        if (upDot > 0.65) {
          out.grounded = true;
          out.ground = b;
          out.groundNormal = new THREE.Vector3(nx, ny, nz);
        }
      }
    }
    return out;
  }

  // ---------------------------------------------------------
  // レイキャスト(タップした面を調べる / カメラのめりこみ防止)
  // ---------------------------------------------------------
  raycast(o, d, maxDist = 250, { includeHazard = true } = {}) {
    let best = null;
    let bestT = maxDist;
    for (const b of this.boxes) {
      if (!b.active) continue;
      if (!includeHazard && b.hazard) continue;
      let tmin = -Infinity, tmax = bestT;
      let nAxis = null, nSign = 0, ok = true;
      for (const a of AXES) {
        const da = d[a];
        if (Math.abs(da) < 1e-9) {
          if (o[a] < b.min[a] || o[a] > b.max[a]) { ok = false; break; }
          continue;
        }
        let t1 = (b.min[a] - o[a]) / da;
        let t2 = (b.max[a] - o[a]) / da;
        let sign = -1; // min 面に入る = 法線は -a
        if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; sign = 1; }
        if (t1 > tmin) { tmin = t1; nAxis = a; nSign = sign; }
        if (t2 < tmax) tmax = t2;
        if (tmin > tmax) { ok = false; break; }
      }
      if (!ok || nAxis === null || tmin <= 0 || tmin >= bestT) continue;
      bestT = tmin;
      const normal = new THREE.Vector3();
      normal[nAxis] = nSign;
      best = { t: tmin, box: b, normal, point: o.clone().addScaledVector(d, tmin) };
    }
    return best;
  }

  isOut(pos) {
    return pos.distanceTo(this.boundsCenter) > this.boundsRadius;
  }

  dispose() {
    this.staticMesh.geometry.dispose();
    this.hazardMesh.geometry.dispose();
    this.dynamic.forEach((b) => b.mesh.geometry.dispose());
    this.blockMat.dispose();
    this.hazardMat.dispose();
    this.crumbleMats.forEach((m) => m.dispose());
    this.stars.forEach((s) => s.dispose());
    this.goal?.dispose();
    this.sun.shadow.map?.dispose();
  }
}
