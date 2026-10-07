// ===== Road network: highway loop, connectors, city grid, nav graph, A* =====
import { CITY_HALF, STREET_SPACING, rawHeight } from './terrain.js';
import { clamp, lerp } from './util.js';

export const LOOP_HALF_W = 13;
export const CONN_HALF_W = 10;

export function loopRadius(t) {
  return 1320 + 110 * Math.sin(3 * t + 0.5) + 50 * Math.sin(7 * t + 1.3) + 22 * Math.sin(11 * t + 2.1);
}
function loopPoint(t) {
  const r = loopRadius(t);
  return { x: Math.cos(t) * r, z: Math.sin(t) * r };
}

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    z: 0.5 * (2 * p1.z + (-p0.z + p2.z) * t + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * t2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * t3),
  };
}

function resample(poly, spacing) {
  const out = [{ x: poly[0].x, z: poly[0].z }];
  let prev = poly[0], acc = 0;
  for (let i = 1; i < poly.length; i++) {
    const b = poly[i];
    let start = prev;
    let seg = Math.hypot(b.x - start.x, b.z - start.z);
    while (acc + seg >= spacing && seg > 1e-9) {
      const t = (spacing - acc) / seg;
      const p = { x: start.x + (b.x - start.x) * t, z: start.z + (b.z - start.z) * t };
      out.push(p);
      start = p; seg = Math.hypot(b.x - start.x, b.z - start.z); acc = 0;
    }
    acc += seg; prev = b;
  }
  const last = poly[poly.length - 1];
  const lo = out[out.length - 1];
  if (Math.hypot(last.x - lo.x, last.z - lo.z) > spacing * 0.4) out.push({ x: last.x, z: last.z });
  else out[out.length - 1] = { x: last.x, z: last.z };
  return out;
}

function smoothHeights(pts, closed, radius, passes) {
  const n = pts.length;
  let h = pts.map((p) => p.h);
  for (let p = 0; p < passes; p++) {
    const nh = new Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0, c = 0;
      for (let k = -radius; k <= radius; k++) {
        let j = i + k;
        if (closed) j = (j + n) % n; else j = clamp(j, 0, n - 1);
        s += h[j]; c++;
      }
      nh[i] = s / c;
    }
    h = nh;
  }
  for (let i = 0; i < n; i++) pts[i].h = h[i];
}

export function buildRoads() {
  const roads = [];
  // ---- Highway loop ----
  const dense = [];
  const N = 4000;
  for (let i = 0; i <= N; i++) dense.push(loopPoint((i / N) * Math.PI * 2));
  let loopPts = resample(dense, 10);
  loopPts.pop(); // closed
  for (const p of loopPts) p.h = Math.max(rawHeight(p.x, p.z), 3);
  smoothHeights(loopPts, true, 10, 4);
  for (const p of loopPts) p.h = Math.max(p.h, 3.5);
  const loop = { name: 'COAST HIGHWAY', pts: loopPts, halfW: LOOP_HALF_W, closed: true, kind: 'highway' };
  roads.push(loop);

  const loopIndexAtAngle = (ang) => {
    const target = loopPoint(ang);
    let best = 0, bd = 1e18;
    loopPts.forEach((p, i) => { const d = (p.x - target.x) ** 2 + (p.z - target.z) ** 2; if (d < bd) { bd = d; best = i; } });
    return best;
  };

  // ---- Connectors ----
  const connDefs = [
    { name: 'NORTH AVE', s: { x: 0, z: -CITY_HALF }, dir: { x: 0, z: -1 }, ang: -Math.PI / 2, wig: 60, freq: 1 },
    { name: 'SOUTH AVE', s: { x: 0, z: CITY_HALF }, dir: { x: 0, z: 1 }, ang: Math.PI / 2, wig: -70, freq: 1 },
    { name: 'OCEAN BLVD', s: { x: CITY_HALF, z: 0 }, dir: { x: 1, z: 0 }, ang: 0, wig: 50, freq: 1 },
    { name: 'WEST PARKWAY', s: { x: -CITY_HALF, z: 0 }, dir: { x: -1, z: 0 }, ang: Math.PI, wig: -60, freq: 1 },
    { name: 'CANYON ROAD', s: { x: -CITY_HALF, z: -CITY_HALF }, dir: { x: -0.7071, z: -0.7071 }, ang: -Math.PI * 0.75, wig: 90, freq: 3 },
    { name: 'HARBOR DRIVE', s: { x: CITY_HALF, z: CITY_HALF }, dir: { x: 0.7071, z: 0.7071 }, ang: Math.PI * 0.25, wig: 70, freq: 2 },
  ];
  const connectors = [];
  const ramps = [];
  const nL = loopPts.length;
  const loopTan = (i) => { const a = loopPts[(i - 1 + nL) % nL], b = loopPts[(i + 1) % nL]; const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz); return { x: dx / l, z: dz / l }; };
  for (const c of connDefs) {
    const li = loopIndexAtAngle(c.ang);
    const e = loopPts[li];
    const s = c.s;
    // connector ends at a fork point inside the loop, then splits into two merging ramps
    const er = Math.hypot(e.x, e.z);
    const F = { x: e.x - (e.x / er) * 190, z: e.z - (e.z / er) * 190 };
    const s1 = { x: s.x + c.dir.x * 70, z: s.z + c.dir.z * 70 };
    const ex = F.x - s1.x, ez = F.z - s1.z; const el = Math.hypot(ex, ez);
    const nx = -ez / el, nz = ex / el;
    const ctrl = [s, s1];
    const K = 4;
    for (let k = 1; k < K; k++) {
      const t = k / K;
      const w = Math.sin(t * Math.PI * c.freq) * c.wig * (k % 2 === 0 && c.freq > 1 ? -1 : 1);
      ctrl.push({ x: s1.x + ex * t + nx * w, z: s1.z + ez * t + nz * w });
    }
    const f0 = { x: F.x - (e.x / er) * 50, z: F.z - (e.z / er) * 50 };
    ctrl.push(f0, { x: F.x, z: F.z });
    const dense2 = [];
    const P = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]];
    for (let i = 1; i < P.length - 2; i++) for (let t = 0; t < 1; t += 0.02) dense2.push(catmull(P[i - 1], P[i], P[i + 1], P[i + 2], t));
    dense2.push({ x: F.x, z: F.z });
    const pts = resample(dense2, 10);
    pts[0] = { x: s.x, z: s.z };
    pts[pts.length - 1] = { x: F.x, z: F.z };
    for (const p of pts) p.h = rawHeight(p.x, p.z);
    smoothHeights(pts, false, 8, 4);
    const targetH = e.h;
    const h0 = pts[0].h, h1 = pts[pts.length - 1].h;
    const t0 = 0 - h0, t1 = targetH - h1;
    pts.forEach((p, i) => { const t = i / (pts.length - 1); p.h += lerp(t0, t1, t); if (i >= 12) p.h = Math.max(p.h, 2.5); });
    for (let i = 0; i < Math.min(8, pts.length); i++) pts[i].h *= i / 8;
    const road = { name: c.name, pts, halfW: CONN_HALF_W, closed: false, kind: 'conn', loopIndex: li };
    roads.push(road);
    connectors.push(road);
    // ramps (bezier merge tangentially into loop)
    const dirF = { x: e.x / er, z: e.z / er };
    road.ramps = [];
    for (const sg of [1, -1]) {
      const lp = (li + sg * 20 + nL) % nL;
      const L = loopPts[lp];
      const tg = loopTan(lp); const tx = tg.x * sg, tz = tg.z * sg;
      const C1 = { x: F.x + dirF.x * 80, z: F.z + dirF.z * 80 };
      const C2 = { x: L.x - tx * 90, z: L.z - tz * 90 };
      const dense = [];
      for (let t = 0; t <= 1.0001; t += 0.01) {
        const u = 1 - t;
        dense.push({ x: u * u * u * F.x + 3 * u * u * t * C1.x + 3 * u * t * t * C2.x + t * t * t * L.x, z: u * u * u * F.z + 3 * u * u * t * C1.z + 3 * u * t * t * C2.z + t * t * t * L.z });
      }
      const rp = resample(dense, 10);
      rp[0] = { x: F.x, z: F.z }; rp[rp.length - 1] = { x: L.x, z: L.z };
      const hA = pts[pts.length - 1].h, hB = L.h;
      rp.forEach((p, i) => { const t = i / (rp.length - 1); const k = t * t * (3 - 2 * t); p.h = lerp(hA, hB, k); });
      const ramp = { name: c.name + ' RAMP', pts: rp, halfW: 9, closed: false, kind: 'ramp', loopIndex: lp, parent: road };
      roads.push(ramp); ramps.push(ramp); road.ramps.push(ramp);
    }
  }
  return { roads, loop, connectors, ramps, loopIndexAtAngle };
}

// ---------------- Navigation graph -----------------
export class NavGraph {
  constructor() { this.nodes = []; this.keyMap = new Map(); }
  add(x, z, h = 0, key = null) {
    if (key && this.keyMap.has(key)) return this.keyMap.get(key);
    const id = this.nodes.length;
    this.nodes.push({ id, x, z, h, edges: [] });
    if (key) this.keyMap.set(key, id);
    return id;
  }
  link(a, b) {
    if (a === b) return;
    const A = this.nodes[a], B = this.nodes[b];
    if (A.edges.some((e) => e.to === b)) return;
    const c = Math.hypot(A.x - B.x, A.z - B.z);
    A.edges.push({ to: b, cost: c });
    B.edges.push({ to: a, cost: c });
  }
  buildGrid() {
    const cs = 60;
    this.grid = new Map();
    for (const n of this.nodes) {
      const k = Math.floor(n.x / cs) * 10007 + Math.floor(n.z / cs);
      let a = this.grid.get(k); if (!a) this.grid.set(k, (a = [])); a.push(n);
    }
    this.gcs = cs;
  }
  nearest(x, z, maxR = 400) {
    const cs = this.gcs;
    const ci = Math.floor(x / cs), cj = Math.floor(z / cs);
    let best = null, bd = 1e18;
    for (let r = 0; r <= Math.ceil(maxR / cs); r++) {
      for (let i = ci - r; i <= ci + r; i++) for (let j = cj - r; j <= cj + r; j++) {
        if (Math.max(Math.abs(i - ci), Math.abs(j - cj)) !== r) continue;
        const a = this.grid.get(i * 10007 + j); if (!a) continue;
        for (const n of a) { const d = (n.x - x) ** 2 + (n.z - z) ** 2; if (d < bd) { bd = d; best = n; } }
      }
      if (best && Math.sqrt(bd) < r * cs) break;
    }
    return best;
  }
  astar(start, goal) {
    const nodes = this.nodes;
    const g = new Float64Array(nodes.length).fill(Infinity);
    const came = new Int32Array(nodes.length).fill(-1);
    const closed = new Uint8Array(nodes.length);
    const G = nodes[goal];
    const heap = [];
    const push = (id, f) => { heap.push([f, id]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const top = heap[0]; const last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
    g[start] = 0; push(start, 0);
    let iter = 0;
    while (heap.length && iter++ < 20000) {
      const [, cur] = pop();
      if (cur === goal) break;
      if (closed[cur]) continue; closed[cur] = 1;
      for (const e of nodes[cur].edges) {
        const ng = g[cur] + e.cost;
        if (ng < g[e.to]) {
          g[e.to] = ng; came[e.to] = cur;
          const n = nodes[e.to];
          push(e.to, ng + Math.hypot(n.x - G.x, n.z - G.z));
        }
      }
    }
    if (came[goal] === -1 && start !== goal) return null;
    const path = [goal];
    let c = goal;
    while (c !== start) { c = came[c]; if (c < 0) return null; path.push(c); }
    path.reverse();
    return path;
  }
}

export function buildNav(net) {
  const nav = new NavGraph();
  const S = STREET_SPACING, H = CITY_HALF, step = 20;
  const ck = (x, z) => `c${Math.round(x)},${Math.round(z)}`;
  // city grid
  for (let j = -H; j <= H; j += S) {
    let prevA = -1, prevB = -1;
    for (let x = -H; x <= H; x += step) {
      const a = nav.add(x, j, 0, ck(x, j));
      if (prevA >= 0) nav.link(prevA, a); prevA = a;
      const b = nav.add(j, x, 0, ck(j, x));
      if (prevB >= 0) nav.link(prevB, b); prevB = b;
    }
  }
  // loop
  const loopIds = net.loop.pts.map((p, i) => nav.add(p.x, p.z, p.h, `l${i}`));
  for (let i = 0; i < loopIds.length; i++) nav.link(loopIds[i], loopIds[(i + 1) % loopIds.length]);
  net.loop.navIds = loopIds;
  // connectors
  for (const c of net.connectors) {
    const ids = c.pts.map((p, i) => {
      if (i === 0) return nav.keyMap.get(ck(p.x, p.z));
      return nav.add(p.x, p.z, p.h);
    });
    for (let i = 0; i < ids.length - 1; i++) nav.link(ids[i], ids[i + 1]);
    c.navIds = ids;
    const fork = ids[ids.length - 1];
    for (const r of c.ramps) {
      const rid = r.pts.map((p, i) => (i === 0 ? fork : i === r.pts.length - 1 ? loopIds[r.loopIndex] : nav.add(p.x, p.z, p.h)));
      for (let i = 0; i < rid.length - 1; i++) nav.link(rid[i], rid[i + 1]);
      r.navIds = rid;
    }
  }
  nav.buildGrid();
  nav.cityId = (x, z) => nav.keyMap.get(ck(x, z));
  nav.loopId = (ang) => loopIds[net.loopIndexAtAngle(ang)];
  return nav;
}

// Build a route polyline from a list of nav node ids (waypoints)
export function buildRoute(nav, wps) {
  const ids = [];
  for (let i = 0; i < wps.length - 1; i++) {
    const p = nav.astar(wps[i], wps[i + 1]);
    if (!p) continue;
    if (ids.length) p.shift();
    ids.push(...p);
  }
  const pts = ids.map((id) => ({ x: nav.nodes[id].x, z: nav.nodes[id].z }));
  // chamfer sharp corners slightly for smoother AI lines
  const out = [];
  for (let i = 0; i < pts.length; i++) out.push(pts[i]);
  // cumulative distance
  let d = 0;
  out[0].d = 0;
  for (let i = 1; i < out.length; i++) { d += Math.hypot(out[i].x - out[i - 1].x, out[i].z - out[i - 1].z); out[i].d = d; }
  return { pts: out, length: d, ids };
}

// Projects a position onto route, searching near a hint index.
export function projectOnRoute(route, x, z, hint = 0, window = 40) {
  const pts = route.pts;
  let best = hint, bd = 1e18, bt = 0;
  const lo = Math.max(0, hint - window), hi = Math.min(pts.length - 2, hint + window);
  for (let i = lo; i <= hi; i++) {
    const a = pts[i], b = pts[i + 1];
    const dx = b.x - a.x, dz = b.z - a.z; const l2 = dx * dx + dz * dz || 1e-6;
    let t = ((x - a.x) * dx + (z - a.z) * dz) / l2; t = clamp(t, 0, 1);
    const cx = a.x + dx * t, cz = a.z + dz * t;
    const dd = (x - cx) ** 2 + (z - cz) ** 2;
    if (dd < bd) { bd = dd; best = i; bt = t; }
  }
  const a = pts[best], b = pts[Math.min(best + 1, pts.length - 1)];
  return { index: best, dist: a.d + (b.d - a.d) * bt, off: Math.sqrt(bd) };
}

export function pointAtDist(route, dist, out = {}) {
  const pts = route.pts;
  dist = clamp(dist, 0, route.length);
  // binary search
  let lo = 0, hi = pts.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pts[m].d <= dist) lo = m; else hi = m; }
  const a = pts[lo], b = pts[hi];
  const t = (dist - a.d) / (b.d - a.d || 1);
  out.x = a.x + (b.x - a.x) * t; out.z = a.z + (b.z - a.z) * t;
  out.dx = (b.x - a.x); out.dz = (b.z - a.z);
  const l = Math.hypot(out.dx, out.dz) || 1; out.dx /= l; out.dz /= l;
  out.index = lo;
  return out;
}
