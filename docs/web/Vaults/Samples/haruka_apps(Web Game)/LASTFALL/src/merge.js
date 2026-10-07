// 子メッシュをマテリアルごとに結合してドローコールを削減
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function mergeChildren(group, exclude = new Set(), shadow = true) {
  const byMat = new Map();
  const keep = [];
  for (const c of [...group.children]) {
    if (!c.isMesh || exclude.has(c) || c.children.length) { keep.push(c); continue; }
    c.updateMatrix();
    const g = c.geometry.clone();
    g.applyMatrix4(c.matrix);
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    const ng = g.index ? g.toNonIndexed() : g;
    if (!byMat.has(c.material)) byMat.set(c.material, []);
    byMat.get(c.material).push(ng);
    group.remove(c);
  }
  for (const [mat, geos] of byMat) {
    const m = new THREE.Mesh(geos.length === 1 ? geos[0] : mergeGeometries(geos, false), mat);
    m.castShadow = shadow; m.receiveShadow = false;
    group.add(m);
  }
  return group;
}
