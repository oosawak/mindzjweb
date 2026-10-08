// =========================================================
// StarGeometry — ぷっくりした ほしの かたち
// =========================================================
import * as THREE from 'three';

const cache = new Map();

export function createStarGeometry(outer = 0.5, inner = 0.22, depth = 0.18, points = 5) {
  const key = `${outer}|${inner}|${depth}|${points}`;
  if (cache.has(key)) return cache.get(key);
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.6,
    bevelSize: outer * 0.12,
    bevelSegments: 3,
    curveSegments: 1,
  });
  geo.center();
  geo.computeVertexNormals();
  cache.set(key, geo);
  return geo;
}
