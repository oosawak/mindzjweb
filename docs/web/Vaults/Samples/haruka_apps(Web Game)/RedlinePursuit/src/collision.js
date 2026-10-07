// ===== Procedural car models =====
import * as THREE from 'three';
import { glowTexture, textTexture } from './textures.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function mergeByMaterial(group) {
  const byMat = new Map();
  for (const c of [...group.children]) {
    if (!c.isMesh) continue;
    let a = byMat.get(c.material); if (!a) byMat.set(c.material, (a = [])); a.push(c);
  }
  const out = new Map();
  for (const [mat, list] of byMat) {
    if (list.length < 2) { out.set(mat, list[0]); continue; }
    const geos = list.map((m) => { m.updateMatrix(); const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()); g.applyMatrix4(m.matrix); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k); if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); return g; });
    const merged = mergeGeometries(geos);
    list.forEach((m) => group.remove(m));
    const mm = new THREE.Mesh(merged, mat);
    group.add(mm); out.set(mat, mm);
  }
  return out;
}

const shared = {};
function S() {
  if (shared.ready) return shared;
  shared.glass = new THREE.MeshPhysicalMaterial({ color: 0x0a0e14, metalness: 0.2, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.6 });
  shared.tire = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.92 });
  shared.rim = new THREE.MeshStandardMaterial({ color: 0xc8ccd0, metalness: 1, roughness: 0.22 });
  shared.darkRim = new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.9, roughness: 0.3 });
  shared.black = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.6, metalness: 0.3 });
  shared.chrome = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.1 });
  shared.head = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff4e0, emissiveIntensity: 3.5 });
  shared.glowW = glowTexture('rgba(255,250,235,1)', 'rgba(255,240,220,0)', 128);
  shared.glowR = glowTexture('rgba(255,40,30,1)', 'rgba(255,0,0,0)', 128);
  shared.glowB = glowTexture('rgba(40,90,255,1)', 'rgba(0,40,255,0)', 128);
  shared.policeTex = textTexture('POLICE', { bg: 'rgba(0,0,0,0)', fg: '#0a0a0a', font: 'bold 90px Arial Black, Arial', border: false });
  shared.interior = new THREE.MeshStandardMaterial({ color: 0x1a1b1e, roughness: 0.8 });
  shared.ready = true;
  return shared;
}

const PROFILES = {
  super: { L: 4.55, W: 1.98, roofH: 1.18, belt: 0.86, hoodFront: 0.6, wsBase: 0.45, roofF: -0.35, roofR: -1.05, rearWin: -1.85, deck: 0.92, tail: 0.86, wheelR: 0.36, wb: 1.38, spoiler: true, cabinW: 1.5 },
  gt: { L: 4.7, W: 1.96, roofH: 1.28, belt: 0.9, hoodFront: 0.66, wsBase: 0.55, roofF: -0.15, roofR: -1.0, rearWin: -1.95, deck: 0.95, tail: 0.9, wheelR: 0.37, wb: 1.45, spoiler: false, cabinW: 1.52 },
  muscle: { L: 4.8, W: 1.98, roofH: 1.34, belt: 0.98, hoodFront: 0.82, wsBase: 0.3, roofF: -0.35, roofR: -1.25, rearWin: -1.9, deck: 1.0, tail: 0.98, wheelR: 0.38, wb: 1.5, spoiler: true, cabinW: 1.55 },
  sedan: { L: 4.7, W: 1.85, roofH: 1.48, belt: 0.95, hoodFront: 0.78, wsBase: 0.85, roofF: 0.25, roofR: -1.1, rearWin: -1.7, deck: 1.0, tail: 0.98, wheelR: 0.34, wb: 1.42, spoiler: false, cabinW: 1.6 },
  suv: { L: 4.8, W: 1.95, roofH: 1.85, belt: 1.15, hoodFront: 1.0, wsBase: 1.0, roofF: 0.5, roofR: -2.1, rearWin: -2.3, deck: 1.8, tail: 1.2, wheelR: 0.42, wb: 1.5, spoiler: false, cabinW: 1.75 },
};

function bodyShape(p) {
  const hl = p.L / 2;
  const s = new THREE.Shape();
  const g = 0.26, r = p.wheelR + 0.08;
  s.moveTo(-hl + 0.12, g);
  s.lineTo(-p.wb - r - 0.02, g);
  s.absarc(-p.wb, g + 0.06, r, Math.PI, 0, true);
  s.lineTo(p.wb - r, g);
  s.absarc(p.wb, g + 0.06, r, Math.PI, 0, true);
  s.lineTo(hl - 0.1, g);
  s.quadraticCurveTo(hl + 0.05, g + 0.05, hl + 0.02, g + 0.22);
  s.quadraticCurveTo(hl, p.hoodFront, hl - 0.28, p.hoodFront + 0.02);
  s.quadraticCurveTo(p.wsBase + 0.6, p.belt + 0.02, p.wsBase, p.belt + 0.04);
  s.lineTo(p.rearWin, p.belt + 0.06);
  s.quadraticCurveTo(-hl + 0.3, p.deck + 0.02, -hl + 0.05, p.tail);
  s.quadraticCurveTo(-hl - 0.04, (p.tail + g) / 2, -hl + 0.02, g + 0.12);
  s.lineTo(-hl + 0.12, g);
  return s;
}
function cabinShape(p) {
  const s = new THREE.Shape();
  s.moveTo(p.wsBase + 0.05, p.belt);
  s.quadraticCurveTo((p.wsBase + p.roofF) / 2 + 0.1, (p.belt + p.roofH) / 2 + 0.12, p.roofF, p.roofH);
  s.lineTo(p.roofR, p.roofH + 0.01);
  s.quadraticCurveTo((p.roofR + p.rearWin) / 2 - 0.1, (p.roofH + p.belt) / 2 + 0.1, p.rearWin - 0.05, p.belt + 0.04);
  s.lineTo(p.wsBase + 0.05, p.belt);
  return s;
}

function extrude(shape, width, bevel = 0.1) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: width - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.9, bevelSegments: 4, curveSegments: 14 });
  g.translate(0, 0, -(width - bevel * 2) / 2);
  g.rotateY(-Math.PI / 2); // shape x -> world z ; extrude z -> world -x
  g.computeVertexNormals();
  return g;
}

export { extrude };
export function makePaint(color, livery = 'plain', color2 = 0xffffff) {
  const m = new THREE.MeshPhysicalMaterial({ color, metalness: 0.55, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.25 });
  const u = { uC2: { value: new THREE.Color(color2) }, uLiv: { value: { plain: 0, stripe: 1, police: 2, taxi: 3, split: 4 }[livery] || 0 }, uDmg: { value: 0 } };
  m.userData.u = u;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vLoc;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvLoc = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vLoc; uniform vec3 uC2; uniform float uLiv; uniform float uDmg;
      float dh(vec3 p){ vec3 p3 = fract(p * 0.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
      float m2 = 0.0;
      if (uLiv > 0.5 && uLiv < 1.5) { float ax = abs(vLoc.x); m2 = step(0.1, ax) * step(ax, 0.26) * step(0.7, vLoc.y); }
      else if (uLiv > 1.5 && uLiv < 2.5) { m2 = step(abs(vLoc.z - 0.1), 1.05) * step(vLoc.y, 0.84) + step(1.1, vLoc.y); m2 = clamp(m2, 0.0, 1.0); }
      else if (uLiv > 2.5 && uLiv < 3.5) { m2 = step(abs(vLoc.y - 0.62), 0.05) * step(0.9, abs(vLoc.x)); }
      else if (uLiv > 3.5) { m2 = step(vLoc.y, 0.62); }
      diffuseColor.rgb = mix(diffuseColor.rgb, uC2, m2);
      float scr = dh(floor(vLoc * 18.0));
      diffuseColor.rgb *= 1.0 - uDmg * (0.55 + 0.35 * scr);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      roughnessFactor = mix(roughnessFactor, 0.85, uDmg * scr);`);
  };
  return m;
}

function makeWheel(r, w, rimMat) {
  const sh = S();
  const g = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 18, 1), sh.tire);
  tire.rotation.z = Math.PI / 2;
  g.add(tire);
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.68, r * 0.68, w + 0.02, 18, 1), sh.darkRim);
  rim.rotation.z = Math.PI / 2;
  g.add(rim);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.2, r * 0.2, w + 0.06, 8), rimMat); hub.rotation.z = Math.PI / 2; g.add(hub);
  for (let i = 0; i < 5; i++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, r * 1.2, 0.07), rimMat);
    sp.rotation.x = (i / 5) * Math.PI;
    g.add(sp);
  }
  mergeByMaterial(g);
  return g;
}

function sprite(tex, size, color = 0xffffff) {
  const m = new THREE.SpriteMaterial({ map: tex, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: true });
  const s = new THREE.Sprite(m); s.scale.set(size, size, 1);
  return s;
}

// kind: super|gt|muscle|sedan|suv|truck ; opts: {color, color2, livery, police, taxi}
export function buildCar(kind, opts = {}) {
  const sh = S();
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  let p = PROFILES[kind] || PROFILES.sedan;
  const paint = makePaint(opts.color ?? 0xcc1010, opts.livery || 'plain', opts.color2 ?? 0xffffff);
  const parts = [];
  if (kind === 'truck') {
    p = { L: 6.6, W: 2.3, wheelR: 0.45, wb: 2.2 };
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.9, 1.9), paint); cab.position.set(0, 1.45, 2.2);
    const win = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 0.05), sh.glass); win.position.set(0, 1.95, 3.16);
    const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 4.3), new THREE.MeshStandardMaterial({ color: opts.color2 ?? 0xe8e8e8, roughness: 0.6 })); box.position.set(0, 1.85, -1.0);
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 6.4), sh.black); chassis.position.set(0, 0.55, 0);
    parts.push(cab, win, box, chassis);
    body.add(cab, win, box, chassis);
  } else {
    const bg = extrude(bodyShape(p), p.W, 0.14);
    const bm = new THREE.Mesh(bg, paint);
    body.add(bm); parts.push(bm);
    const cg = extrude(cabinShape(p), p.cabinW, 0.12);
    const cm = new THREE.Mesh(cg, sh.glass); body.add(cm); parts.push(cm);
    // roof panel
    const roofLen = p.roofF - p.roofR;
    const roof = new THREE.Mesh(new THREE.BoxGeometry(p.cabinW - 0.18, 0.06, roofLen * 0.95), paint);
    roof.geometry.translate(0, p.roofH + 0.08, (p.roofF + p.roofR) / 2 - 0.02);
    body.add(roof); parts.push(roof);
    // lower skirt / diffuser
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(p.W - 0.1, 0.12, p.L - 0.4), sh.black); skirt.position.y = 0.24; body.add(skirt);
    // grille
    const gr = new THREE.Mesh(new THREE.BoxGeometry(p.W * 0.6, 0.16, 0.08), sh.black); gr.position.set(0, 0.4, p.L / 2 + 0.02); body.add(gr);
    // mirrors
    for (const sx of [-1, 1]) {
      const mir = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.16), paint); mir.geometry.translate(sx * (p.W / 2 + 0.06), p.belt + 0.1, p.wsBase - 0.2); body.add(mir);
    }
    // exhausts
    for (const sx of [-0.45, 0.45]) {
      const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 10), sh.chrome); ex.rotation.x = Math.PI / 2; ex.position.set(sx, 0.34, -p.L / 2 - 0.02); body.add(ex);
    }
    if (p.spoiler && !opts.police) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(p.W - 0.1, 0.05, 0.36), paint);
      wing.geometry.translate(0, p.tail + 0.32, -p.L / 2 + 0.3); body.add(wing);
      for (const sx of [-0.55, 0.55]) { const st = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.12), sh.black); st.position.set(sx, p.tail + 0.16, -p.L / 2 + 0.32); body.add(st); }
    }
    if (opts.taxi) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.22, 0.35), new THREE.MeshStandardMaterial({ color: 0xffdd55, emissive: 0xffcc33, emissiveIntensity: 1.2 }));
      t.position.set(0, p.roofH + 0.22, (p.roofF + p.roofR) / 2); body.add(t);
    }
  }
  const hl = p.L / 2;
  // lights
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x300000, emissive: 0xff1010, emissiveIntensity: 1.2 });
  const tailY = kind === 'truck' ? 0.9 : p.tail - 0.1;
  const tail = new THREE.Mesh(new THREE.BoxGeometry(p.W * 0.82, 0.08, 0.05), tailMat);
  tail.position.set(0, tailY, -hl - 0.03); body.add(tail);
  for (const sx of [-1, 1]) {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.06), tailMat); tl.position.set(sx * (p.W / 2 - 0.3), tailY, -hl - 0.03); body.add(tl);
  }
  const headY = kind === 'truck' ? 0.95 : p.hoodFront - 0.08;
  const headZ = kind === 'truck' ? 3.17 : hl - 0.2;
  const heads = [];
  for (const sx of [-1, 1]) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.2), sh.head);
    h.position.set(sx * (p.W / 2 - 0.38), headY, headZ); h.rotation.x = -0.25; body.add(h);
    const sp = sprite(sh.glowW, 0.75, 0xfff2dd); sp.material.opacity = 0.6; sp.position.set(sx * (p.W / 2 - 0.38), headY, headZ + 0.25); body.add(sp);
    heads.push(sp);
    const ts = sprite(sh.glowR, 0.5); ts.material.opacity = 0.7; ts.position.set(sx * (p.W / 2 - 0.3), tailY, -hl - 0.15); body.add(ts); heads.push(ts);
  }
  // police light bar + decals
  const siren = {};
  if (opts.police) {
    const barY = (p.roofH || 1.3) + 0.14;
    const barZ = ((p.roofF ?? 0) + (p.roofR ?? -1)) / 2;
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.3), sh.black); base.position.set(0, barY, barZ); body.add(base);
    const rMat = new THREE.MeshStandardMaterial({ color: 0x400000, emissive: 0xff0000, emissiveIntensity: 0 });
    const bMat = new THREE.MeshStandardMaterial({ color: 0x000040, emissive: 0x0030ff, emissiveIntensity: 0 });
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.26), rMat); r.position.set(0.32, barY + 0.08, barZ); body.add(r);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.26), bMat); b.position.set(-0.32, barY + 0.08, barZ); body.add(b);
    const rs = sprite(sh.glowR, 5); rs.position.set(0.35, barY + 0.15, barZ); body.add(rs);
    const bs = sprite(sh.glowB, 5); bs.position.set(-0.35, barY + 0.15, barZ); body.add(bs);
    // grille strobes
    const rs2 = sprite(sh.glowR, 1.5); rs2.position.set(0.3, 0.45, hl + 0.1); body.add(rs2);
    const bs2 = sprite(sh.glowB, 1.5); bs2.position.set(-0.3, 0.45, hl + 0.1); body.add(bs2);
    Object.assign(siren, { rMat, bMat, rs, bs, rs2, bs2 });
    // POLICE text
    for (const sx of [-1, 1]) {
      const d = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshStandardMaterial({ map: sh.policeTex, transparent: true, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 }));
      d.position.set(sx * (p.W / 2 + 0.005), 0.58, 0.1); d.rotation.y = sx * Math.PI / 2; body.add(d);
    }
  }
  // merge static body meshes per material to cut draw calls
  const merged = mergeByMaterial(body);
  const partsOut = [merged.get(paint), merged.get(sh.glass)].filter(Boolean);
  if (kind !== 'truck') { parts.length = 0; parts.push(...partsOut); }
  // wheels
  const wheels = [];
  const rimMat = opts.police ? sh.darkRim : sh.rim;
  const wx = p.W / 2 - 0.2;
  for (const [sx, sz, front] of [[1, 1, true], [-1, 1, true], [1, -1, false], [-1, -1, false]]) {
    const pivot = new THREE.Group();
    pivot.position.set(sx * wx, p.wheelR, sz * p.wb);
    const w = makeWheel(p.wheelR, 0.3, rimMat);
    pivot.add(w);
    root.add(pivot);
    wheels.push({ pivot, spin: w, front, side: sx });
  }
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  return { root, body, wheels, paint, tailMat, heads, siren, dims: { L: p.L, W: p.W, wheelR: p.wheelR, wb: p.wb, roofH: p.roofH || 2.5 }, profile: p, parts };
}

// Cockpit interior for first person view
export function buildInterior(model) {
  const sh = S();
  const p = model.profile;
  const g = new THREE.Group();
  const hl = p.L / 2;
  // hood (visible through windshield) - separate so the body shell can be hidden
  const hs = new THREE.Shape();
  hs.moveTo(hl - 0.06, p.hoodFront - 0.3);
  hs.lineTo(hl - 0.06, p.hoodFront - 0.04);
  hs.quadraticCurveTo(hl - 0.1, p.hoodFront + 0.02, hl - 0.28, p.hoodFront + 0.02);
  hs.quadraticCurveTo(p.wsBase + 0.6, p.belt + 0.02, p.wsBase, p.belt + 0.04);
  hs.lineTo(p.wsBase, p.belt - 0.3);
  hs.lineTo(hl - 0.06, p.hoodFront - 0.3);
  const hood = new THREE.Mesh(extrude(hs, p.W - 0.06, 0.08), model.paint);
  g.add(hood);
  // door tops (paint) and inner door panels
  const len = p.wsBase - p.rearWin;
  for (const sx of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, len), model.paint);
    rail.geometry.translate(sx * (p.W / 2 - 0.1), p.belt + 0.02, (p.wsBase + p.rearWin) / 2);
    g.add(rail);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, len), sh.interior);
    door.position.set(sx * (p.W / 2 - 0.2), p.belt - 0.2, (p.wsBase + p.rearWin) / 2); g.add(door);
  }
  const dash = new THREE.Mesh(new THREE.BoxGeometry(p.W - 0.3, 0.16, 0.5), sh.interior);
  dash.position.set(0, p.belt - 0.04, p.wsBase - 0.15);
  g.add(dash);
  const cluster = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.16), sh.interior); cluster.position.set(0.38, p.belt + 0.07, p.wsBase - 0.34); g.add(cluster);
  const gauge = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.07), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.15, 0.4, 0.7) }));
  gauge.position.set(0.38, p.belt + 0.07, p.wsBase - 0.425); gauge.rotation.y = Math.PI; g.add(gauge);
  const wheel = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.024, 8, 32), sh.interior);
  wheel.add(rim);
  const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.03), sh.interior); wheel.add(spoke);
  const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.17, 0.03), sh.interior); spoke2.position.y = -0.085; wheel.add(spoke2);
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), new THREE.MeshStandardMaterial({ color: 0xff9a1a, emissive: 0xff6a00, emissiveIntensity: 0.2 }));
  logo.position.z = -0.02; logo.rotation.y = Math.PI; wheel.add(logo);
  wheel.position.set(0.38, p.belt - 0.06, p.wsBase - 0.62);
  wheel.rotation.x = -0.3;
  g.add(wheel);
  // pillars & roof frame
  for (const sx of [-1, 1]) {
    const pl = Math.hypot(p.wsBase - p.roofF, p.roofH - p.belt);
    const pil = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, pl), sh.interior);
    pil.position.set(sx * (p.cabinW / 2 - 0.06), (p.belt + p.roofH) / 2, (p.wsBase + p.roofF) / 2);
    pil.rotation.x = Math.atan2(p.roofH - p.belt, p.wsBase - p.roofF);
    g.add(pil);
  }
  g.visible = false;
  model.body.add(g);
  return { group: g, wheel };
}
