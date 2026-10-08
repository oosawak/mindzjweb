// =========================================================
// Materials — キューブ用のカスタムマテリアル
//  MeshStandardMaterial を拡張して
//  ・面の向きごとの色味(向きがわかりやすい)
//  ・ワールド座標のグリッド線(発光)
//  ・ふちの発光
//  ・ビリビリブロック用のアニメーション
// =========================================================
import * as THREE from 'three';

const sharedTime = { value: 0 };
export function updateMaterialTime(t) { sharedTime.value = t; }

export function createBlockMaterial({
  tintX = '#ffffff', tintY = '#ffffff', tintZ = '#ffffff',
  edgeColor = '#ffffff', edgeStrength = 0.9,
  gridColor = '#ffffff', gridStrength = 0.18,
  hazard = false, hazardColor = '#c070ff',
  roughness = 0.6, emissive = '#000000', transparent = false, opacity = 1,
} = {}) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness, metalness: 0, emissive, transparent, opacity });
  const uniforms = {
    uTime: sharedTime,
    uTintX: { value: new THREE.Color(tintX) },
    uTintY: { value: new THREE.Color(tintY) },
    uTintZ: { value: new THREE.Color(tintZ) },
    uEdgeColor: { value: new THREE.Color(edgeColor) },
    uEdgeStrength: { value: edgeStrength },
    uGridColor: { value: new THREE.Color(gridColor) },
    uGridStrength: { value: gridStrength },
    uHazard: { value: hazard ? 1 : 0 },
    uHazColor: { value: new THREE.Color(hazardColor) },
    uPulse: { value: 0 },
  };
  mat.userData.uniforms = uniforms;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', /* glsl */ `#include <common>
        attribute vec3 aSize;
        varying vec3 vBWorld;
        varying vec3 vBLocal;
        varying vec3 vBSize;
        varying vec3 vBNormal;`)
      .replace('#include <project_vertex>', /* glsl */ `#include <project_vertex>
        {
          vec4 bw = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            bw = instanceMatrix * bw;
          #endif
          bw = modelMatrix * bw;
          vBWorld = bw.xyz;
        }
        vBLocal = position;
        vBSize = aSize;
        vBNormal = normal;`);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform float uTime;
        uniform vec3 uTintX, uTintY, uTintZ, uEdgeColor, uGridColor, uHazColor;
        uniform float uEdgeStrength, uGridStrength, uHazard, uPulse;
        varying vec3 vBWorld;
        varying vec3 vBLocal;
        varying vec3 vBSize;
        varying vec3 vBNormal;`)
      .replace('#include <emissivemap_fragment>', /* glsl */ `#include <emissivemap_fragment>
        {
          vec3 an = abs(vBNormal);
          vec3 d = (0.5 - abs(vBLocal)) * vBSize;
          float e = an.x > 0.5 ? min(d.y, d.z) : (an.y > 0.5 ? min(d.x, d.z) : min(d.x, d.y));
          float edge = 1.0 - smoothstep(0.03, 0.11, e);
          vec2 g2 = an.x > 0.5 ? vBWorld.yz : (an.y > 0.5 ? vBWorld.xz : vBWorld.xy);
          vec2 gw = abs(fract(g2 - 0.5) - 0.5) / max(fwidth(g2), vec2(1e-4));
          float grid = 1.0 - min(min(gw.x, gw.y), 1.0);
          float chk = mod(floor(g2.x) + floor(g2.y), 2.0);
          vec3 tint = an.x > 0.5 ? uTintX : (an.y > 0.5 ? uTintY : uTintZ);
          diffuseColor.rgb *= tint * (0.93 + 0.07 * chk);
          if (uHazard > 0.5) {
            float s = sin((g2.x + g2.y) * 4.0 - uTime * 9.0);
            float zap = smoothstep(0.3, 1.0, s);
            float flick = 0.75 + 0.25 * sin(uTime * 37.0 + g2.x * 3.0);
            diffuseColor.rgb *= 0.35;
            totalEmissiveRadiance += uHazColor * (0.25 + zap * 1.8) * flick;
          }
          totalEmissiveRadiance += uEdgeColor * edge * (uEdgeStrength + uPulse) + uGridColor * grid * uGridStrength;
        }`);
  };
  mat.customProgramCacheKey = () => (hazard ? 'skycube-block-hazard' : 'skycube-block');
  return mat;
}

/** BoxGeometry に aSize を持たせた InstancedMesh を作る */
export function createBoxInstances(material, boxes, { castShadow = true, receiveShadow = true } = {}) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const count = Math.max(1, boxes.length);
  const sizes = new Float32Array(count * 3);
  const mesh = new THREE.InstancedMesh(geo, material, count);
  const m = new THREE.Matrix4();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const col = new THREE.Color();
  boxes.forEach((b, i) => {
    pos.addVectors(b.min, b.max).multiplyScalar(0.5);
    scl.subVectors(b.max, b.min);
    m.compose(pos, q, scl);
    mesh.setMatrixAt(i, m);
    sizes[i * 3] = scl.x; sizes[i * 3 + 1] = scl.y; sizes[i * 3 + 2] = scl.z;
    col.set(b.color || '#ffffff');
    mesh.setColorAt(i, col);
  });
  if (!boxes.length) mesh.count = 0;
  geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(sizes, 3));
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();
  return mesh;
}

/** 1つだけのブロック(動く床・くずれる床用)。位置はメッシュの position で動かす */
export function createSingleBox(material, size, color) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.setAttribute('aSize', new THREE.InstancedBufferAttribute(new Float32Array([size.x, size.y, size.z]), 3));
  const mesh = new THREE.InstancedMesh(geo, material, 1);
  mesh.setMatrixAt(0, new THREE.Matrix4().makeScale(size.x, size.y, size.z));
  mesh.setColorAt(0, new THREE.Color(color || '#ffffff'));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  return mesh;
}
