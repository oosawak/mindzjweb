/* =========================================================
 *  3D 卓 (Three.js)
 *  Originally from JANKI STARLIGHT (haruka_apps). CHEAT JANKI! additions:
 *  CheatPass (time-stop / x-ray / chroma post effect), timeScale (slow motion),
 *  tableGroup (flippable), face-up exposed / peeked tiles, seat standees,
 *  syncWall(fromIndex), setHand, replaceDiscard, internals() for js/render/cheat3d.js
 * ========================================================= */
(function (root) {
  'use strict';
  const THREE = root.THREE;
  const TW = 0.9, TH = 1.2, TD = 0.66;
  const S = {};
  let renderer, scene, camera, composer, bloom, clock, container;
  let tileGeo, matSide, matBack, matHidden;
  const faceMats = new Map();
  const tiles = new Map(); // id -> mesh
  const tweens = [];
  let camBase = { pos: new THREE.Vector3(0, 15, 19.5), look: new THREE.Vector3(0, 0, 2.0) };
  const camCur = { pos: camBase.pos.clone(), look: camBase.look.clone() };
  let shakeAmt = 0;
  let centerTex, centerCanvas, centerMesh;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-9, -9);
  let hovered = null;
  let n = 4, is3p = false;
  const st = { revealed: [], doraTypes: new Set(), hands: [], drawn: [], discards: [], melds: [], nuki: [], wall: [], deadStart: 0, sticks: [], interactive: false, allowed: null, dim: null, danger: null, riichiPending: [] };
  const glowMats = [];
  let particles, bgSparkles;
  let auraList = [];
  let tableGroup, tablePivot, cheatPass;
  const physics = [];       // 飛び散る牌（ちゃぶ台返し）
  const updaters = [];      // cheat3d.js などが登録するフレーム処理 (dt) => bool(続けるか)
  st.exposed = new Map();   // p -> Set(id) 表向きに倒れた牌
  st.peek = false;          // 千里眼中

  /* ---------------- 座標 ---------------- */
  function seatPos(p) { if (!is3p) return p; return [0, 1, 3][p]; }
  function seatAngle(p) { return seatPos(p) * Math.PI / 2; }
  function toWorld(p, x, y, z) {
    const a = seatAngle(p), c = Math.cos(a), s = Math.sin(a);
    return new THREE.Vector3(x * c + z * s, y, -x * s + z * c);
  }
  S.seatWorld = (p, x, y, z) => toWorld(p, x, y, z);
  const Q = {
    stand: (p, tilt) => new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt || 0, seatAngle(p), 0, 'YXZ')),
    flat: (p, extraY) => new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, seatAngle(p) + (extraY || 0), 0, 'YXZ')),
    down: (p, extraY) => new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, seatAngle(p) + (extraY || 0), 0, 'YXZ')),
  };

  /* ---------------- 初期化 ---------------- */
  S.init = function (el) {
    container = el;
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, root.devicePixelRatio || 1));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.3;
    scene.background = makeBgTexture();
    scene.fog = new THREE.Fog(0x1a0f33, 40, 90);

    camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 300);
    fitCamera();

    // ライト
    scene.add(new THREE.HemisphereLight(0xfff0ff, 0x2a1c4a, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(6, 22, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const sc = key.shadow.camera; sc.left = -15; sc.right = 15; sc.top = 15; sc.bottom = -15; sc.near = 1; sc.far = 60;
    key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
    scene.add(key);
    const p1 = new THREE.PointLight(0xff6fb5, 60, 40, 2); p1.position.set(-12, 6, -8); scene.add(p1);
    const p2 = new THREE.PointLight(0x6fd5ff, 50, 40, 2); p2.position.set(12, 6, -8); scene.add(p2);

    buildTable();
    buildTiles();
    buildParticles();

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bloom = new THREE.UnrealBloomPass(new THREE.Vector2(el.clientWidth / 2, el.clientHeight / 2), 0.42, 0.5, 1.25);
    composer.addPass(bloom);
    cheatPass = makeCheatPass();
    composer.addPass(cheatPass);
    composer.addPass(new THREE.OutputPass());

    clock = new THREE.Timer();
    root.addEventListener('resize', onResize);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', () => { pointer.set(-9, -9); });
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('pointerdown', (e) => { lastPointerType = e.pointerType || 'mouse'; });
    renderer.domElement.style.touchAction = 'manipulation';
    renderer.setAnimationLoop(loop);
  };

  function fitCamera() {
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    camera.aspect = aspect;
    // 横長: 通常カメラ / 縦長(スマホ縦): 真上寄りから自分の手牌が画面幅に収まる距離へ
    const wasPortrait = portraitMode;
    portraitMode = aspect < 1.25;
    HUMAN_SCALE = portraitMode ? CFG.portrait.handScale : HUMAN_SCALE_WIDE;
    HAND_TILT = portraitMode ? CFG.portrait.handTilt : null;
    if (wasPortrait !== portraitMode && st.hands && st.hands[0]) layoutHand(0, 0);
    if (aspect >= 1.25) {
      // スマホ横など極端に横長な画面では、上下を詰めて寄る
      const W = CFG.wide, t = Math.max(0, Math.min(1, (aspect - 1.6) / (1.9 - 1.6)));
      camBase.pos.set(0, CFG.camY + (W.camY - CFG.camY) * t, CFG.camZ + (W.camZ - CFG.camZ) * t);
      camBase.look.set(0, 0, CFG.lookZ + (W.lookZ - CFG.lookZ) * t);
      camera.fov = 42;
    } else {
      const P = CFG.portrait;
      const t = Math.max(0, Math.min(1, (1.25 - aspect) / (1.25 - 0.46))); // 1.25→0, 0.46(スマホ縦)→1
      const lerp = (a, b) => a + (b - a) * t;
      camera.fov = lerp(42, P.fov);
      // 手牌の横幅(約16.5)が収まる距離
      const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * aspect);
      const need = (P.fitWidth / 2) / Math.tan(hfov / 2);
      const dir = new THREE.Vector3(0, lerp(CFG.camY, P.camY), lerp(CFG.camZ, P.camZ) - P.handZ).normalize();
      const handPt = new THREE.Vector3(0, 0.6, P.handZ);
      camBase.pos.copy(handPt).addScaledVector(dir, need);
      camBase.look.set(0, 0, lerp(CFG.lookZ, P.lookZ));
    }
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    updateHandTopVar();
  }
  /** 手牌上端の画面Y座標を CSS 変数 --hand-top / --hand-h に出す（HUD配置用） */
  function updateHandTopVar() {
    if (!container) return;
    const cam = camera.clone();
    cam.position.copy(camBase.pos); cam.lookAt(camBase.look); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const H = container.clientHeight;
    const top = new THREE.Vector3(0, TH * HUMAN_SCALE + 0.15, CFG.handZ - 0.35).project(cam);
    const y = Math.round((1 - top.y) / 2 * H);
    const clamped = Math.max(H * 0.45, Math.min(H - 40, y));
    document.documentElement.style.setProperty('--hand-top', clamped + 'px');
    document.documentElement.style.setProperty('--hand-h', Math.max(40, H - clamped) + 'px');
  }
  function onResize() {
    if (!renderer) return;
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
    fitCamera();
    if (!idleOrbit && !camAnim) { camCur.pos.copy(camBase.pos); camCur.look.copy(camBase.look); }
  }

  function makeBgTexture() {
    const c = document.createElement('canvas'); c.width = 16; c.height = 512;
    const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#0d0826'); gr.addColorStop(0.5, '#2a1450'); gr.addColorStop(1, '#4a1f5e');
    g.fillStyle = gr; g.fillRect(0, 0, 16, 512);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function feltTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(512, 512, 60, 512, 512, 720);
    gr.addColorStop(0, '#3b6fb0'); gr.addColorStop(0.55, '#24477e'); gr.addColorStop(1, '#152a52');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
    // 布目
    for (let i = 0; i < 26000; i++) {
      g.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
      g.fillRect(Math.random() * 1024, Math.random() * 1024, 1.5, 1.5);
    }
    // 星柄
    g.save(); g.globalAlpha = 0.07; g.fillStyle = '#ffffff';
    for (let y = 40; y < 1024; y += 80) for (let x = (y / 80 % 2) * 40 + 20; x < 1024; x += 80) star(g, x, y, 7, 3);
    g.restore();
    // 中央の輪
    g.strokeStyle = 'rgba(255,215,120,0.55)'; g.lineWidth = 5;
    g.beginPath(); g.arc(512, 512, 330, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.arc(512, 512, 345, 0, Math.PI * 2); g.stroke();
    g.font = '900 64px "Hiragino Mincho ProN","Yu Mincho",serif'; g.textAlign = 'center';
    g.fillStyle = 'rgba(255,230,160,0.18)';
    g.save(); g.translate(512, 512);
    for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.fillText(k % 2 ? 'CHEAT' : 'イカサマ', 0, -262); }
    g.restore();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }
  function star(g, x, y, r1, r2) {
    g.beginPath();
    for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 - Math.PI / 2; const r = k % 2 ? r2 : r1; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
    g.closePath(); g.fill();
  }

  function buildTable() {
    // 卓の上面（フェルト・枠・中央パネル）はちゃぶ台返し用に1つのグループにまとめる（奥の辺を軸に回転）
    tablePivot = new THREE.Group(); tablePivot.position.set(0, 0, -12.5); scene.add(tablePivot);
    tableGroup = new THREE.Group(); tableGroup.position.set(0, 0, 12.5); tablePivot.add(tableGroup);
    const scene_ = scene;
    const add = (o) => tableGroup.add(o);
    const felt = new THREE.Mesh(new THREE.PlaneGeometry(23, 23), new THREE.MeshStandardMaterial({ map: feltTexture(), roughness: 0.95, metalness: 0, side: THREE.DoubleSide }));
    felt.rotation.x = -Math.PI / 2; felt.receiveShadow = true;
    add(felt);
    // 枠
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xfff1f7, roughness: 0.25, metalness: 0.1 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffc85a, roughness: 0.25, metalness: 0.9, emissive: 0x3a2200 });
    for (let k = 0; k < 4; k++) {
      const m = new THREE.Mesh(new THREE.RoundedBoxGeometry(25, 0.9, 1.1, 3, 0.35), frameMat);
      const a = k * Math.PI / 2;
      m.position.set(Math.sin(a) * 12, 0.3, Math.cos(a) * 12);
      m.rotation.y = a; m.castShadow = true; m.receiveShadow = true;
      add(m);
      const gl = new THREE.Mesh(new THREE.BoxGeometry(23.2, 0.08, 0.12), goldMat);
      gl.position.set(Math.sin(a) * 11.48, 0.62, Math.cos(a) * 11.48); gl.rotation.y = a;
      add(gl);
    }
    // 台
    const base = new THREE.Mesh(new THREE.CylinderGeometry(19, 22, 1.4, 64), new THREE.MeshStandardMaterial({ color: 0x2c1848, roughness: 0.6 }));
    base.position.y = -0.8; scene.add(base);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(80, 64), new THREE.MeshStandardMaterial({ color: 0x160c2c, roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1.5; scene.add(floor);
    // 中央パネル
    const box = new THREE.Mesh(new THREE.RoundedBoxGeometry(4.6, 0.4, 4.6, 3, 0.15), new THREE.MeshStandardMaterial({ color: 0x1b1433, roughness: 0.3, metalness: 0.4 }));
    box.position.y = 0.2; box.castShadow = true; add(box);
    centerCanvas = document.createElement('canvas'); centerCanvas.width = centerCanvas.height = 512;
    centerTex = new THREE.CanvasTexture(centerCanvas); centerTex.colorSpace = THREE.SRGBColorSpace; centerTex.anisotropy = 8;
    centerMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 4.3), new THREE.MeshStandardMaterial({ map: centerTex, emissiveMap: centerTex, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.4 }));
    centerMesh.rotation.x = -Math.PI / 2; centerMesh.position.y = 0.41;
    add(centerMesh);
    void scene_;
  }

  function buildTiles() {
    tileGeo = new THREE.RoundedBoxGeometry(TW, TH, TD, 3, 0.1);
    matSide = new THREE.MeshStandardMaterial({ color: 0xf3ecdc, roughness: 0.45, metalness: 0 });
    matBack = new THREE.MeshStandardMaterial({ color: 0xff78b4, roughness: 0.28, metalness: 0.05 });
    matHidden = matSide;
    for (let id = 0; id < 136; id++) {
      const t = id >> 2;
      const red = t < 27 && t % 9 === 4 && id % 4 === 0;
      const mesh = new THREE.Mesh(tileGeo, [matSide, matSide, matSide, matSide, faceMat(t, red), matBack]);
      mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.userData = { id, t, red, lift: 0, liftTarget: 0 };
      mesh.visible = false;
      scene.add(mesh);
      tiles.set(id, mesh);
    }
  }
  function faceMat(t, red, glow) {
    const key = t + (red ? 'r' : '') + (glow ? 'g' : '');
    if (faceMats.has(key)) return faceMats.get(key);
    const tex = new THREE.CanvasTexture(root.Tiles2D.faceCanvas(t, red));
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const m = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0 });
    if (glow) { m.emissive = new THREE.Color(0xffcc55); m.emissiveIntensity = 0.3; glowMats.push(m); }
    faceMats.set(key, m);
    return m;
  }
  function setFace(mesh, mode) { // 'real' | 'hidden' | 'glow'
    const { t, red } = mesh.userData;
    mesh.material[4] = mode === 'hidden' ? matHidden : faceMat(t, red, mode === 'glow');
  }

  /* ---------------- パーティクル ---------------- */
  function spriteTex(kind) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    if (kind === 'star') {
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      g.fillStyle = 'rgba(255,255,255,0.9)';
      g.beginPath(); g.moveTo(32, 0); g.lineTo(35, 29); g.lineTo(64, 32); g.lineTo(35, 35); g.lineTo(32, 64); g.lineTo(29, 35); g.lineTo(0, 32); g.lineTo(29, 29); g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    return t;
  }
  function buildParticles() {
    const MAX = 4000;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3));
    geo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(MAX), 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(MAX), 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: spriteTex('star') }, scale: { value: 600 } },
      vertexShader: `attribute float size; attribute float alpha; attribute vec3 color; varying vec3 vC; varying float vA; uniform float scale;
        void main(){ vC=color; vA=alpha; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=size*scale/(-mv.z); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform sampler2D map; varying vec3 vC; varying float vA; void main(){ vec4 t=texture2D(map, gl_PointCoord); gl_FragColor=vec4(vC*t.rgb*2.0, t.a*vA); }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    particles = { pts, geo, MAX, list: [] };
    // 背景のきらめき
    const bgN = 260;
    const bg = new THREE.BufferGeometry();
    const pos = new Float32Array(bgN * 3), col = new Float32Array(bgN * 3), sz = new Float32Array(bgN), al = new Float32Array(bgN);
    const pal = [[1, 0.6, 0.85], [0.6, 0.85, 1], [1, 0.9, 0.6]];
    for (let i = 0; i < bgN; i++) {
      const r = 22 + Math.random() * 40, a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = -2 + Math.random() * 30; pos[i * 3 + 2] = Math.sin(a) * r - 10;
      const c = pal[i % 3]; col.set(c, i * 3); sz[i] = 0.3 + Math.random() * 0.9; al[i] = 0.3 + Math.random() * 0.7;
    }
    bg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    bg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    bg.setAttribute('size', new THREE.BufferAttribute(sz, 1));
    bg.setAttribute('alpha', new THREE.BufferAttribute(al, 1));
    bgSparkles = new THREE.Points(bg, mat.clone());
    bgSparkles.material.uniforms.map.value = mat.uniforms.map.value;
    bgSparkles.frustumCulled = false;
    scene.add(bgSparkles);
  }
  function emit(opt) {
    const L = particles.list;
    for (let i = 0; i < opt.count; i++) {
      if (L.length >= particles.MAX) L.shift();
      const a = Math.random() * Math.PI * 2, e = (Math.random() - 0.2) * Math.PI * 0.5;
      const sp = opt.speed * (0.4 + Math.random() * 0.8);
      const col = Array.isArray(opt.colors) ? opt.colors[Math.floor(Math.random() * opt.colors.length)] : opt.colors;
      L.push({
        p: new THREE.Vector3(opt.pos.x + (Math.random() - 0.5) * (opt.spread || 0), opt.pos.y + (Math.random() - 0.5) * (opt.spreadY || 0), opt.pos.z + (Math.random() - 0.5) * (opt.spread || 0)),
        v: opt.dir ? opt.dir.clone().multiplyScalar(sp).add(new THREE.Vector3((Math.random() - .5) * sp * .5, (Math.random() - .5) * sp * .5, (Math.random() - .5) * sp * .5))
          : new THREE.Vector3(Math.cos(a) * Math.cos(e) * sp, Math.sin(e) * sp + (opt.up || 0), Math.sin(a) * Math.cos(e) * sp),
        life: 0, max: opt.life * (0.6 + Math.random() * 0.6), size: opt.size * (0.5 + Math.random()),
        c: new THREE.Color(col), g: opt.gravity == null ? -4 : opt.gravity, drag: opt.drag || 0.98,
      });
    }
  }
  S.burst = function (pos, colors, count, opt) {
    opt = opt || {};
    emit(Object.assign({ pos, colors, count: count || 60, speed: 6, life: 1.2, size: 0.5 }, opt));
  };
  S.burstAtSeat = function (p, colors, count, opt) {
    S.burst(toWorld(p, 0, 1.2, 9.2), colors, count, opt);
  };
  S.aura = function (p, color, on) {
    auraList = auraList.filter(a => a.p !== p);
    if (on) auraList.push({ p, color, acc: 0 });
  };
  S.clearAuras = function () { auraList = []; };

  function updateParticles(dt) {
    const L = particles.list;
    const pos = particles.geo.attributes.position.array, col = particles.geo.attributes.color.array;
    const size = particles.geo.attributes.size.array, alpha = particles.geo.attributes.alpha.array;
    let w = 0;
    for (let i = 0; i < L.length; i++) {
      const q = L[i];
      q.life += dt;
      if (q.life >= q.max) continue;
      q.v.y += q.g * dt; q.v.multiplyScalar(Math.pow(q.drag, dt * 60));
      q.p.addScaledVector(q.v, dt);
      L[w++] = q;
    }
    L.length = w;
    for (let i = 0; i < particles.MAX; i++) {
      if (i < L.length) {
        const q = L[i], k = q.life / q.max;
        pos[i * 3] = q.p.x; pos[i * 3 + 1] = q.p.y; pos[i * 3 + 2] = q.p.z;
        col[i * 3] = q.c.r; col[i * 3 + 1] = q.c.g; col[i * 3 + 2] = q.c.b;
        size[i] = q.size * (k < 0.15 ? k / 0.15 : 1);
        alpha[i] = (1 - k) * (0.6 + 0.4 * Math.sin(q.life * 30 + i));
      } else { alpha[i] = 0; size[i] = 0; }
    }
    particles.geo.attributes.position.needsUpdate = true; particles.geo.attributes.color.needsUpdate = true;
    particles.geo.attributes.size.needsUpdate = true; particles.geo.attributes.alpha.needsUpdate = true;
    particles.geo.setDrawRange(0, Math.max(1, L.length));
  }

  /* ---------------- トゥイーン ---------------- */
  const EASE = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outBounce: t => { const n1 = 7.5625, d1 = 2.75; if (t < 1 / d1) return n1 * t * t; if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75; if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375; return n1 * (t -= 2.625 / d1) * t + 0.984375; },
    linear: t => t,
  };
  S.speed = 1;
  function tweenMesh(mesh, pos, quat, dur, opt) {
    opt = opt || {};
    for (let i = tweens.length - 1; i >= 0; i--) if (tweens[i].mesh === mesh) { tweens[i].res(); tweens.splice(i, 1); }
    return new Promise(res => {
      tweens.push({ mesh, fromP: null, fromQ: null, toP: pos.clone(), toQ: quat.clone(), t: -(opt.delay || 0), dur: Math.max(0.001, dur / S.speed), ease: EASE[opt.ease || 'outCubic'], arc: opt.arc || 0, res, scale: opt.scale });
    });
  }
  function place(mesh, pos, quat) { mesh.position.copy(pos); mesh.quaternion.copy(quat); mesh.userData.basePos = pos.clone(); }
  function updateTweens(dt) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      tw.t += dt;
      if (tw.t < 0) continue;
      if (!tw.fromP) { tw.fromP = tw.mesh.position.clone(); tw.fromQ = tw.mesh.quaternion.clone(); tw.fromScale = tw.mesh.scale.x; tw.mesh.visible = true; }
      const k = Math.min(1, tw.t / tw.dur), e = tw.ease(k);
      tw.mesh.position.lerpVectors(tw.fromP, tw.toP, e);
      if (tw.arc) tw.mesh.position.y += Math.sin(k * Math.PI) * tw.arc;
      tw.mesh.quaternion.slerpQuaternions(tw.fromQ, tw.toQ, e);
      if (tw.scale != null) tw.mesh.scale.setScalar(tw.fromScale + (tw.scale - tw.fromScale) * e);
      if (k >= 1) { tw.mesh.userData.basePos = tw.toP.clone(); tweens.splice(i, 1); tw.res(); }
    }
  }

  /* ---------------- ループ ---------------- */
  let time = 0;
  function loop() {
    clock.update();
    const rawDt = Math.min(0.1, clock.getDelta());
    const dt = rawDt * S.timeScale;
    time += dt;
    updatePhysics(dt);
    for (let i = updaters.length - 1; i >= 0; i--) { if (!updaters[i](dt, rawDt)) updaters.splice(i, 1); }
    if (cheatPass) cheatPass.uniforms.uTime.value += rawDt;
    updateTweens(dt);
    updateHover(dt);
    updateParticles(dt);
    for (const m of glowMats) m.emissiveIntensity = 0.25 + 0.2 * Math.sin(time * 3.5);
    for (const a of auraList) {
      a.acc += dt;
      while (a.acc > 0.05) {
        a.acc -= 0.05;
        const x = (Math.random() - 0.5) * 12;
        emit({ pos: toWorld(a.p, x, 0.1, 9.9 + (Math.random() - 0.5)), colors: a.color, count: 1, speed: 0.3, up: 2.2, life: 1.4, size: 0.35, gravity: 0.5 });
      }
    }
    updateStandees(dt);
    if (bgSparkles) {
      bgSparkles.rotation.y += dt * 0.02;
      const al = bgSparkles.geometry.attributes.alpha;
      for (let i = 0; i < al.count; i += 7) al.array[i] = 0.35 + 0.35 * Math.sin(time * 2 + i);
      al.needsUpdate = true;
    }
    // カメラ
    const shake = new THREE.Vector3((Math.random() - 0.5) * shakeAmt, (Math.random() - 0.5) * shakeAmt, (Math.random() - 0.5) * shakeAmt);
    shakeAmt *= Math.pow(0.02, dt);
    if (shakeAmt < 0.002) shakeAmt = 0;
    const sway = new THREE.Vector3(Math.sin(time * 0.3) * 0.15, Math.sin(time * 0.23) * 0.08, 0);
    if (idleOrbit) {
      idleAng += dt * 0.08;
      camCur.pos.set(Math.sin(idleAng) * 24, 12 + Math.sin(idleAng * 0.7) * 2, Math.cos(idleAng) * 24);
      camCur.look.set(0, 0, 0);
    } else if (camAnim) {
      camAnim.t += dt;
      const k = EASE.inOut(Math.min(1, camAnim.t / camAnim.dur));
      camCur.pos.lerpVectors(camAnim.fromP, camAnim.toP, k);
      camCur.look.lerpVectors(camAnim.fromL, camAnim.toL, k);
      if (k >= 1) { const r = camAnim.res; camAnim = null; r(); }
    }
    camera.position.copy(camCur.pos).add(shake).add(sway);
    camera.lookAt(camCur.look);
    composer.render();
  }
  let camAnim = null;
  let idleOrbit = false, idleAng = 0;
  S.idle = function (on) {
    if (on === idleOrbit) return;
    idleOrbit = on;
    if (on) { for (const m of tiles.values()) m.visible = false; for (const s of st.sticks) scene.remove(s); st.sticks = []; S.clearAuras(); physics.length = 0; if (tablePivot) tablePivot.rotation.set(0, 0, 0); for (const sd of standees) scene.remove(sd.group); standees.length = 0; }
    else camTo(camBase.pos, camBase.look, 1.2);
  };
  function camTo(pos, look, dur) {
    if (camAnim) camAnim.res();
    return new Promise(res => { camAnim = { fromP: camCur.pos.clone(), fromL: camCur.look.clone(), toP: pos.clone(), toL: look.clone(), t: 0, dur: dur, res }; });
  }
  S.focusSeat = function (p, dur) {
    // 和了者の背後・上方から手牌を見下ろす（持ち主の向きで読める）
    const handC = toWorld(p, 0, 0.4, p === 0 ? CFG.handZ : 9.9);
    const dir = toWorld(p, 0, 0, 1).normalize();
    const pos = handC.clone().addScaledVector(dir, p === 0 ? 6.5 : 5.2).add(new THREE.Vector3(0, p === 0 ? 8.5 : 8, 0));
    const look = handC.clone().addScaledVector(dir, -1.4);
    return camTo(pos, look, dur || 1.1);
  };
  S.resetCamera = function (dur) { return camTo(camBase.pos, camBase.look, dur || 0.9); };
  S.shake = function (a) { shakeAmt = Math.max(shakeAmt, a); };
  S.setBloom = function (s) { if (bloom) bloom.strength = s; };
  S.pulseBloom = function (peak, dur) {
    const b0 = 0.45; const t0 = performance.now();
    const f = () => { const k = (performance.now() - t0) / (dur * 1000); if (k >= 1) { bloom.strength = b0; return; } bloom.strength = b0 + (peak - b0) * Math.sin(k * Math.PI); requestAnimationFrame(f); };
    f();
  };

  /* ---------------- ホバー / クリック ---------------- */
  function onPointerMove(e) {
    const r = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  function pickHand() {
    if (!st.interactive) return null;
    raycaster.setFromCamera(pointer, camera);
    const meshes = (st.hands[0] || []).map(id => tiles.get(id)).filter(Boolean);
    const hit = raycaster.intersectObjects(meshes, false)[0];
    if (!hit) return null;
    const id = hit.object.userData.id;
    if (st.allowed && !st.allowed.has(id)) return null;
    return id;
  }
  function updateHover(dt) {
    let id = pickHand();
    if (touchSel != null) {
      if (!st.interactive || (st.allowed && !st.allowed.has(touchSel)) || !(st.hands[0] || []).includes(touchSel)) touchSel = null;
      else id = touchSel;
    }
    if (id !== hovered) {
      hovered = id;
      if (id != null && S.onHover) S.onHover(id);
      if (id == null && S.onHover) S.onHover(null);
      renderer.domElement.style.cursor = id != null ? 'pointer' : 'default';
    }
    for (const hid of st.hands[0] || []) {
      const m = tiles.get(hid);
      if (!m || !m.userData.basePos) continue;
      if (tweens.some(t => t.mesh === m)) continue;
      const target = (hid === hovered ? 0.45 : 0) + (st.dim && st.dim.has(hid) ? -0.25 : 0);
      m.userData.lift += (target - m.userData.lift) * Math.min(1, dt * 14);
      m.position.copy(m.userData.basePos);
      m.position.y += m.userData.lift;
    }
  }
  let lastPointerType = 'mouse', touchSel = null;
  S.tapConfirm = true;
  function onClick(e) {
    onPointerMove(e);
    const id = pickHand();
    const touch = lastPointerType === 'touch' || lastPointerType === 'pen';
    if (touch) pointer.set(-9, -9); // タッチ後にホバーが残らないように
    if (id == null) { if (touch) { touchSel = null; } return; }
    if (touch && S.tapConfirm && touchSel !== id) {
      touchSel = id;
      if (S.onHover) S.onHover(id);
      return;
    }
    touchSel = null;
    if (S.onTileClick) S.onTileClick(id);
  }
  S.setInteractive = function (on, allowedIds, dimIds) {
    touchSel = null;
    st.interactive = on;
    st.allowed = allowedIds ? new Set(allowedIds) : null;
    st.dim = dimIds ? new Set(dimIds) : null;
    for (const hid of st.hands[0] || []) {
      const m = tiles.get(hid); if (!m) continue;
      const dimmed = on && st.allowed && !st.allowed.has(hid);
      m.material[4] = dimmed ? dimFace(m) : faceMat(m.userData.t, m.userData.red, st.doraTypes && st.doraTypes.has(m.userData.t));
    }
    if (!on) { hovered = null; renderer.domElement.style.cursor = 'default'; }
  };
  const dimMats = new Map();
  function dimFace(m) {
    const key = m.userData.t + (m.userData.red ? 'r' : '');
    if (!dimMats.has(key)) { const mm = faceMat(m.userData.t, m.userData.red).clone(); mm.color = new THREE.Color(0x777788); dimMats.set(key, mm); }
    return dimMats.get(key);
  }
  S.projectTile = function (id) {
    const m = tiles.get(id); if (!m) return null;
    const v = m.position.clone(); v.y += TH * 0.75;
    v.project(camera);
    const r = renderer.domElement.getBoundingClientRect();
    return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
  };
  S.projectWorld = function (v3) {
    const v = v3.clone().project(camera);
    const r = renderer.domElement.getBoundingClientRect();
    return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
  };

  /* ---------------- レイアウト ---------------- */
  const CFG = { handZ: 9.8, handTilt: -0.72, handY: 0, camY: 15, camZ: 19.5, lookZ: 2.0,
    wide: { camY: 16, camZ: 16.5, lookZ: 2.2 },
    portrait: { fov: 60, camY: 36, camZ: 14, lookZ: -1.5, handZ: 9.8, fitWidth: 15.4, handScale: 1.0, handTilt: -1.05 } };
  S.cfg = CFG;
  const HUMAN_SCALE_WIDE = 1.22;
  let HUMAN_SCALE = HUMAN_SCALE_WIDE, HAND_TILT = null, portraitMode = false;
  function handTransforms(p) {
    const ids = st.hands[p];
    const drawn = st.drawn[p];
    const res = [];
    const human = p === 0;
    const sc = human ? HUMAN_SCALE : 1;
    const w = TW * sc;
    const gap = human ? 0.6 : 0.45;
    const nMeld = st.melds[p].length;
    const others = ids.filter(id => id !== drawn);
    const cnt = others.length + (drawn != null && ids.includes(drawn) ? 1 : 0);
    const total = cnt * w + (drawn != null ? gap : 0);
    let x0 = -total / 2 + w / 2 - (human ? 0.4 : 0);
    if (nMeld) {
      const meldStart = (human ? 10.4 : 9.6) - st.melds[p].reduce((sum, m) => sum + root.TileLayout.meldWidth(m, p, n) + 0.15, 0);
      x0 = Math.min(x0, meldStart - 0.4 - total + w / 2);
    }
    const z = human ? CFG.handZ : 9.9;
    const y = TH * sc / 2 + (human ? CFG.handY : 0);
    const q = human ? Q.stand(p, HAND_TILT != null ? HAND_TILT : CFG.handTilt) : Q.stand(p, 0);
    const ex = !human ? st.exposed.get(p) : null;
    const up = (id, pos) => {
      if (human || !(st.peek || (ex && ex.has(id)))) return { id, pos, quat: q };
      return { id, pos: new THREE.Vector3(pos.x, TD / 2 + 0.02, pos.z), quat: Q.stand(p, -Math.PI / 2), faceUp: true };
    };
    others.forEach((id, i) => res.push(up(id, toWorld(p, x0 + i * w, y, z))));
    if (drawn != null && ids.includes(drawn)) res.push(up(drawn, toWorld(p, x0 + others.length * w + gap, y, z)));
    return res;
  }
  function layoutHand(p, dur, opt) {
    const tr = handTransforms(p);
    const human = p === 0;
    const ps = [];
    for (const t of tr) {
      const m = tiles.get(t.id);
      m.visible = true;
      m.scale.setScalar(human ? HUMAN_SCALE : 1);
      if (!st.revealed[p]) setFace(m, human ? (st.doraTypes && st.doraTypes.has(m.userData.t) ? 'glow' : 'real') : (t.faceUp ? 'real' : 'hidden'));
      if (!human && t.faceUp && st.peek && !(st.exposed.get(p) || new Set()).has(t.id)) m.material[4] = xrayFace(m);
      if (dur) ps.push(tweenMesh(m, t.pos, t.quat, dur, opt));
      else place(m, t.pos, t.quat);
    }
    return Promise.all(ps);
  }
  function discardTransform(p, idx) {
    const tile = root.TileLayout.riverTile(st.discards[p], idx);
    return { pos: toWorld(p, tile.x, TD / 2, tile.z), quat: Q.flat(p, tile.side ? Math.PI / 2 : 0) };
  }
  function meldTransforms(p) {
    const res = [];
    const human = p === 0;
    let x = human ? 10.4 : 9.6;
    const z = human ? 9.15 : 8.8;
    for (const m of st.melds[p]) {
      const seq = root.TileLayout.meldTiles(m, p, n);
      // 右から左へ並べるので逆順
      for (let i = seq.length - 1; i >= 0; i--) {
        const { id, side, back: faceDown, addedId } = seq[i];
        const w = side ? TH : TW;
        x -= w / 2;
        const zz = side ? z + (TH - TW) / 2 : z;
        res.push({ id, pos: toWorld(p, x, TD / 2, zz), quat: faceDown ? Q.down(p) : Q.flat(p, side ? Math.PI / 2 : 0) });
        if (side && addedId != null) res.push({ id: addedId, pos: toWorld(p, x, TD / 2, zz - TW - 0.04), quat: Q.flat(p, Math.PI / 2) });
        x -= w / 2;
      }
      x -= 0.15;
    }
    // 抜きドラ
    let nx = human ? -10.2 : -9.4;
    for (const id of st.nuki[p]) { res.push({ id, pos: toWorld(p, nx + TW / 2, TD / 2, z), quat: Q.flat(p) }); nx += TW; }
    return res;
  }
  function wallTransform(i) {
    const { p, stack: k, level, stacks } = root.TileLayout.wallSlot(i, n, st.wallBreak);
    const off = is3p ? 1.3 : 1.0;
    const x = ((stacks - 1) / 2 - k) * TW - off;
    const y = level === 0 ? TD * 1.5 : TD / 2;
    return { pos: toWorld(p, x, y, 7.5), quat: Q.down(p, 0), p };
  }

  /* ---------------- CHEAT JANKI! 追加 ---------------- */
  S.timeScale = 1;
  function makeCheatPass() {
    const uniforms = {
      tDiffuse: { value: null }, uTime: { value: 0 }, uInvert: { value: 0 }, uScan: { value: 0 }, uChroma: { value: 0 },
      uRed: { value: 0 }, uGold: { value: 0 }, uDesat: { value: 0 }, uWarp: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime, uInvert, uScan, uChroma, uRed, uGold, uDesat, uWarp; varying vec2 vUv;
        void main(){
          vec2 uv = vUv; vec2 d = uv - 0.5; float r = length(d);
          uv += d * uWarp * 0.08 * sin(r * 30.0 - uTime * 10.0);
          vec2 off = d * (0.006 + 0.012 * uChroma) * (uChroma + uInvert);
          vec3 c = vec3(texture2D(tDiffuse, uv + off).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - off).b);
          float g = dot(c, vec3(0.299, 0.587, 0.114));
          c = mix(c, vec3(g), clamp(uDesat + uInvert * 0.85, 0.0, 1.0));
          vec3 inv = vec3(0.10, 0.16, 0.30) + (1.0 - clamp(c, 0.0, 1.0)) * vec3(0.55, 0.85, 1.25);
          c = mix(c, inv, uInvert);
          float scan = 0.5 + 0.5 * sin((uv.y + uTime * 0.25) * 420.0);
          float band = 1.0 - smoothstep(0.0, 0.035, abs(fract(uv.y * 0.6 - uTime * 0.7) - 0.5));
          c = mix(c, c * (0.75 + 0.25 * scan) + vec3(0.1, 0.9, 0.7) * band * 0.25, uScan);
          c += vec3(0.1, 0.55, 0.45) * uScan * 0.05 * smoothstep(0.3, 0.8, r);
          c = mix(c, c * vec3(1.35, 0.55, 0.55) + vec3(0.12, 0.0, 0.0), uRed);
          c += vec3(1.0, 0.75, 0.25) * uGold * (0.35 + 0.65 * (1.0 - smoothstep(0.0, 0.8, r)));
          c *= 1.0 - 0.35 * (uInvert + uRed) * smoothstep(0.35, 0.85, r);
          gl_FragColor = vec4(c, 1.0);
        }`,
      depthTest: false, depthWrite: false,
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
    const quad = new THREE.Mesh(geo, mat); quad.frustumCulled = false;
    const qScene = new THREE.Scene(); qScene.add(quad);
    const qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    return {
      enabled: true, needsSwap: true, clear: false, renderToScreen: false, uniforms,
      setSize() {}, dispose() { geo.dispose(); mat.dispose(); },
      render(r, writeBuffer, readBuffer) {
        uniforms.tDiffuse.value = readBuffer.texture;
        r.setRenderTarget(this.renderToScreen ? null : writeBuffer);
        r.render(qScene, qCam);
      },
    };
  }
  /** ポスト効果のパラメータをなめらかに変更 */
  const postTok = {};
  S.post = function (key, target, dur) {
    const u = cheatPass && cheatPass.uniforms[key]; if (!u) return Promise.resolve();
    const from = u.value, t0 = performance.now();
    const tok = postTok[key] = {};                    // 同じキーの新しい指示が来たら古いほうは止める
    return new Promise(res => updaters.push(() => {
      if (postTok[key] !== tok) { res(); return false; }
      const k = Math.min(1, (performance.now() - t0) / ((dur || 0.3) * 1000));
      u.value = from + (target - from) * k;
      if (k >= 1) { res(); return false; }
      return true;
    }));
  };
  S.postValue = (key) => cheatPass ? cheatPass.uniforms[key].value : 0;
  function updatePhysics(dt) {
    for (let i = physics.length - 1; i >= 0; i--) {
      const b = physics[i];
      b.t += dt;
      b.v.y -= 22 * dt;
      b.m.position.addScaledVector(b.v, dt);
      b.m.rotation.x += b.w.x * dt; b.m.rotation.y += b.w.y * dt; b.m.rotation.z += b.w.z * dt;
      if (b.m.position.y < b.floor) { b.m.position.y = b.floor; b.v.y *= -0.32; b.v.x *= 0.7; b.v.z *= 0.7; b.w.multiplyScalar(0.6); }
      if (b.t > b.life) physics.splice(i, 1);
    }
  }
  S.addPhysics = function (mesh, v, w, life, floor) { physics.push({ m: mesh, v, w, t: 0, life: life || 3, floor: floor == null ? -1.5 + TD / 2 : floor }); };
  S.clearPhysics = function () { physics.length = 0; };
  S.addUpdater = function (fn) { updaters.push(fn); };
  S.internals = function () {
    return { THREE, scene, camera, renderer, tiles, tweenMesh, place, toWorld, seatAngle, Q, emit, setFace, faceMat, st, TW, TH, TD, EASE,
      wallTransform, handTransforms, layoutHand, discardTransform, meldTransforms, CFG, tableGroup, tablePivot, camCur, camBase, camTo };
  };
  /** 山の並びを同期（fromIndex より前＝既にツモった位置は動かさない） */
  S.syncWall = function (wall, fromIndex) {
    const from = fromIndex || 0;
    const changed = wall.map((id, i) => (i >= from && st.wall[i] !== id) ? i : -1).filter(i => i >= 0);
    st.wall = wall.slice();
    for (const i of changed) {
      const m = tiles.get(wall[i]);
      const tr = wallTransform(i);
      setFace(m, 'real');
      m.scale.setScalar(1);
      place(m, tr.pos, tr.quat);
      m.visible = true;
    }
    return changed;
  };
  /** 手牌を差し替えて並べ直す（drawnId は右端に離して置く） */
  S.setHand = function (p, ids, drawnId, dur) {
    st.hands[p] = ids.slice();
    st.drawn[p] = drawnId != null && ids.includes(drawnId) ? drawnId : null;
    return layoutHand(p, dur == null ? 0.3 : dur, { arc: 0.6 });
  };
  /** 河の牌を差し替える（河拾い） */
  S.replaceDiscard = function (q, idx, newId, dur) {
    const d = st.discards[q][idx]; if (!d) return Promise.resolve();
    d.id = newId;
    const m = tiles.get(newId); setFace(m, 'real'); m.scale.setScalar(1);
    const tr = discardTransform(q, idx);
    return tweenMesh(m, tr.pos, tr.quat, dur || 0.5, { arc: 2.2 });
  };
  S.findDiscard = function (id) {
    for (let q = 0; q < st.discards.length; q++) { const i = st.discards[q].findIndex(d => d.id === id); if (i >= 0) return { p: q, idx: i }; }
    return null;
  };
  S.setExposed = function (p, ids) { st.exposed.set(p, new Set(ids)); return layoutHand(p, 0.35, { arc: 1.2, ease: 'outBounce' }); };
  /**
   * エンジンの状態に3D卓をまるごと合わせる（イベント・固有技のあと用）
   * d: { hands[p], drawn[p], melds[p], nuki[p], rivers[p] ([{id, riichi}]), wall, drawPtr }
   */
  S.syncAll = function (d, dur, opt) {
    dur = dur == null ? 0.6 : dur;
    opt = opt || {};
    const ps = [];
    if (d.wall) S.syncWall(d.wall, d.drawPtr);
    for (let p = 0; p < n; p++) {
      if (d.hands && d.hands[p]) { st.hands[p] = d.hands[p].slice(); const dr = d.drawn ? d.drawn[p] : null; st.drawn[p] = dr != null && d.hands[p].includes(dr) ? dr : null; }
      if (d.melds && d.melds[p]) st.melds[p] = d.melds[p].map(m => ({ type: m.type, t: m.t, ids: m.ids.slice(), from: m.from, calledId: m.calledId, addedId: m.addedId }));
      if (d.nuki && d.nuki[p]) st.nuki[p] = d.nuki[p].slice();
      if (d.rivers && d.rivers[p]) st.discards[p] = d.rivers[p].map(x => ({ id: x.id, riichi: !!x.riichi }));
    }
    for (let p = 0; p < n; p++) {
      ps.push(layoutHand(p, dur, { arc: opt.arc != null ? opt.arc : 2.2 }));
      for (const t of meldTransforms(p)) { const m = tiles.get(t.id); if (!m) continue; m.visible = true; setFace(m, 'real'); m.scale.setScalar(1); ps.push(tweenMesh(m, t.pos, t.quat, dur, { arc: opt.arc != null ? opt.arc : 2.2 })); }
      st.discards[p].forEach((x, i) => { const m = tiles.get(x.id); if (!m) return; m.visible = true; setFace(m, 'real'); m.scale.setScalar(1); const tr = discardTransform(p, i); ps.push(tweenMesh(m, tr.pos, tr.quat, dur, { arc: (opt.arc != null ? opt.arc : 2.2) * 0.6 })); });
    }
    return Promise.all(ps);
  };
  /** 文字入りのキャンバステクスチャ（ルーレット・時計・言葉カード用） */
  S.textTexture = function (draw, w, h) {
    const c = document.createElement('canvas'); c.width = w || 512; c.height = h || 512;
    draw(c.getContext('2d'), c.width, c.height);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    return tex;
  };
  S.spriteTex = (kind) => spriteTex(kind);
  S.setPeek = function (on) {
    st.peek = !!on;
    const ps = [];
    for (let p = 1; p < n; p++) if (st.hands[p]) ps.push(layoutHand(p, 0.45, { arc: on ? 1.6 : 0.8 }));
    return Promise.all(ps);
  };
  const xrayMats = new Map();
  function xrayFace(m) {
    const key = m.userData.t + (m.userData.red ? 'r' : '');
    if (!xrayMats.has(key)) { const mm = faceMat(m.userData.t, m.userData.red).clone(); mm.emissive = new THREE.Color(0x35ffd0); mm.emissiveIntensity = 0.45; xrayMats.set(key, mm); }
    return xrayMats.get(key);
  }
  S.tilePos = function (id) { const m = tiles.get(id); return m ? m.position.clone() : null; };
  S.tileMesh = (id) => tiles.get(id);
  S.cfgScale = () => HUMAN_SCALE;

  /* ---------------- 立ち絵スタンド（各席の後ろ） ---------------- */
  const standees = [];
  const texLoader = new THREE.TextureLoader();
  S.setStandees = function (list) {
    // list: [{p, url, color}] (自分以外)
    for (const s of standees) scene.remove(s.group);
    standees.length = 0;
    for (const it of list) {
      const group = new THREE.Group();
      const mat = new THREE.SpriteMaterial({ map: null, transparent: true, depthWrite: false, opacity: 0 });
      const spr = new THREE.Sprite(mat);
      spr.scale.set(6.2, 8.06, 1);
      spr.center.set(0.5, 0);
      group.add(spr);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: spriteTex('star'), color: new THREE.Color(it.color), transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.set(9, 9, 1); glow.position.y = 4; group.add(glow);
      const home = toWorld(it.p, 0, -0.6, 14.2);
      group.position.copy(home);
      scene.add(group);
      const sd = { p: it.p, group, spr, glow, home: home.clone(), mode: 'idle', t: Math.random() * 6, react: 0, flyV: null };
      standees.push(sd);
      texLoader.load(it.url, (tex) => { tex.colorSpace = THREE.SRGBColorSpace; mat.map = tex; mat.needsUpdate = true; mat.opacity = 1; });
    }
  };
  /** kind: 'bounce' | 'shake' | 'glow' | 'fly' | 'reset' */
  S.standee = function (p, kind) {
    const sd = standees.find(s => s.p === p); if (!sd) return;
    if (kind === 'reset') { sd.mode = 'idle'; sd.group.position.copy(sd.home); sd.group.rotation.set(0, 0, 0); sd.spr.material.rotation = 0; sd.flyV = null; sd.spr.material.color.set(0xffffff); return; }
    if (kind === 'fly') { sd.mode = 'fly'; sd.flyV = new THREE.Vector3((Math.random() - 0.5) * 6, 16 + Math.random() * 6, (Math.random() - 0.5) * 6); sd.spin = (Math.random() - 0.5) * 8; return; }
    sd.mode = kind; sd.react = 0;
  };
  function updateStandees(dt) {
    for (const sd of standees) {
      sd.t += dt; sd.react += dt;
      const g = sd.group;
      if (sd.mode === 'fly' && sd.flyV) {
        sd.flyV.y -= 20 * dt; g.position.addScaledVector(sd.flyV, dt); sd.spr.material.rotation += sd.spin * dt;
        if (g.position.y < -30) sd.flyV = null;
        continue;
      }
      g.position.copy(sd.home);
      g.position.y += Math.sin(sd.t * 1.6 + sd.p) * 0.12;
      sd.spr.material.rotation = 0;
      sd.glow.material.opacity = Math.max(0, sd.glow.material.opacity - dt * 1.2);
      if (sd.mode === 'bounce') { const k = sd.react; g.position.y += Math.abs(Math.sin(k * 14)) * 1.2 * Math.max(0, 1 - k / 0.9); if (k > 0.9) sd.mode = 'idle'; }
      if (sd.mode === 'shake') { const k = sd.react; g.position.x += Math.sin(k * 60) * 0.35 * Math.max(0, 1 - k / 1.2); sd.spr.material.color.setRGB(1, 0.75 + 0.25 * Math.min(1, k), 0.75 + 0.25 * Math.min(1, k)); if (k > 1.2) { sd.mode = 'idle'; sd.spr.material.color.set(0xffffff); } }
      if (sd.mode === 'glow') { sd.glow.material.opacity = 0.9; sd.mode = 'idle'; }
    }
  }
  S.standeePos = function (p) { const sd = standees.find(s => s.p === p); return sd ? sd.group.position.clone().add(new THREE.Vector3(0, 5, 0)) : toWorld(p, 0, 5, 13); };

  /* ---------------- 公開API ---------------- */
  S.setupSeats = function (numPlayers) {
    n = numPlayers; is3p = n === 3;
  };
  S.newHand = async function (d) {
    // d: {wall, deadStart, dealer, wallBreak, dealBatches, hands, doraIds}
    for (const m of tiles.values()) { m.visible = false; m.scale.setScalar(1); m.rotation.set(0, 0, 0); }
    for (const tw of tweens) tw.res();
    tweens.length = 0;
    physics.length = 0;
    st.exposed = new Map(); st.peek = false;
    if (tablePivot) tablePivot.rotation.set(0, 0, 0);
    for (const sd of standees) S.standee(sd.p, 'reset');
    S.timeScale = 1;
    st.riichiPending = new Array(n).fill(false);
    st.interactive = false; st.allowed = null; st.dim = null; hovered = null;
    st.hands = []; st.drawn = []; st.discards = []; st.melds = []; st.nuki = []; st.revealed = [];
    for (let p = 0; p < n; p++) { st.hands.push([]); st.drawn.push(null); st.discards.push([]); st.melds.push([]); st.nuki.push([]); st.revealed.push(false); }
    for (const s of st.sticks) scene.remove(s);
    st.sticks = [];
    st.wall = d.wall.slice(); st.deadStart = d.deadStart;
    st.wallBreak = d.wallBreak || { side: d.dealer, stack: 7 };
    st.doraTypes = new Set();
    d.wall.forEach((id, i) => {
      const m = tiles.get(id);
      const tr = wallTransform(i);
      m.visible = true; m.scale.setScalar(1);
      setFace(m, 'real');
      place(m, tr.pos, tr.quat);
    });
    S.setDora(d.doraIds, true);
    // Animate consecutive packets from the opening, in dealer/seat order.
    const ps = [];
    const targets = new Map();
    for (let p = 0; p < n; p++) {
      st.hands[p] = d.hands[p].slice();
      for (const t of handTransforms(p)) targets.set(t.id, { ...t, p });
    }
    const batches = d.dealBatches || d.wall.filter(id => targets.has(id)).map(id => ({ p: targets.get(id).p, ids: [id] }));
    batches.forEach((batch, step) => {
      batch.ids.forEach((id, j) => {
        const t = targets.get(id);
        if (!t) return;
        const m = tiles.get(t.id);
        setFace(m, t.p === 0 ? 'real' : 'hidden');
        ps.push(tweenMesh(m, t.pos, t.quat, 0.32, { delay: (step * 0.13 + j * 0.012) / S.speed, arc: 1.2, scale: t.p === 0 ? HUMAN_SCALE : 1 }));
      });
    });
    await Promise.all(ps);
  };
  S.setDoraTypes = function (types) { st.doraTypes = new Set(types); layoutHand(0, 0); };
  S.setDora = function (doraIds, instant) {
    for (const id of doraIds) {
      const m = tiles.get(id); if (!m) continue;
      const i = st.wall.indexOf(id);
      const tr = wallTransform(i);
      const q = Q.flat(tr.p);
      if (instant) place(m, tr.pos, q); else tweenMesh(m, tr.pos, q, 0.5, { arc: 0.8 });
      if (!instant) S.burst(tr.pos.clone().add(new THREE.Vector3(0, 0.5, 0)), ['#fff3a0', '#ffd24d'], 40, { speed: 3, life: 0.9, size: 0.4 });
    }
  };
  S.draw = async function (p, id) {
    st.hands[p].push(id);
    st.drawn[p] = id;
    const m = tiles.get(id);
    if (p === 0) m.scale.setScalar(HUMAN_SCALE);
    const trs = handTransforms(p);
    const tr = trs.find(t => t.id === id);
    setFace(m, p === 0 ? (st.doraTypes.has(m.userData.t) ? 'glow' : 'real') : (tr.faceUp ? 'real' : 'hidden'));
    if (p !== 0 && tr.faceUp && st.peek) m.material[4] = xrayFace(m);
    const prs = [tweenMesh(m, tr.pos, tr.quat, 0.28, { arc: 1.4 })];
    for (const t of trs) {
      if (t.id !== id) {
        const om = tiles.get(t.id);
        if (om) prs.push(tweenMesh(om, t.pos, t.quat, 0.2));
      }
    }
    await Promise.all(prs);
  };
  S.discard = async function (p, id, riichi, sortedHand) {
    st.hands[p] = sortedHand.slice();
    st.drawn[p] = null;
    st.discards[p].push({ id, riichi: riichi || st.riichiPending[p] });
    st.riichiPending[p] = false;
    const m = tiles.get(id);
    setFace(m, 'real');
    m.scale.setScalar(1);
    const tr = discardTransform(p, st.discards[p].length - 1);
    const pr = tweenMesh(m, tr.pos, tr.quat, riichi ? 0.45 : 0.3, { arc: riichi ? 2.2 : 0.8, ease: riichi ? 'outBounce' : 'outCubic' });
    layoutHand(p, 0.22);
    await pr;
    if (riichi) S.burst(tr.pos, ['#ff5fa2', '#ffffff', '#8be9ff'], 70, { speed: 5, life: 1, size: 0.45 });
  };
  S.riichiStick = function (p, color) {
    const g = new THREE.Group();
    const stick = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.26), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(color || 0xff5fa2), emissiveIntensity: 0.6, roughness: 0.3 }));
    const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xff2040, emissive: 0xff2040, emissiveIntensity: 1 }));
    dot.position.y = 0.02; g.add(stick); g.add(dot);
    const pos = toWorld(p, 0, 0.05, 2.55);
    g.position.copy(pos).add(new THREE.Vector3(0, 3, 0));
    g.rotation.y = seatAngle(p);
    scene.add(g);
    st.sticks.push(g);
    const t0 = performance.now();
    const f = () => { const k = Math.min(1, (performance.now() - t0) / 450); g.position.y = pos.y + 3 * (1 - EASE.outBounce(k)); if (k < 1) requestAnimationFrame(f); else { stick.material.emissiveIntensity = 0.15; } };
    f();
  };
  S.call = async function (p, meld, from, handAfter) {
    // 鳴かれた捨て牌を河から外す
    if (meld.calledId != null && from !== p) {
      const list = st.discards[from];
      const idx = list.findIndex(d => d.id === meld.calledId);
      if (idx >= 0) {
        if (list[idx].riichi) st.riichiPending[from] = true;
        list.splice(idx, 1);
      }
    }
    const existing = st.melds[p].find(x => x.t === meld.t && (x.type === 'pon') && meld.type === 'kakan');
    if (existing) { existing.type = 'kakan'; existing.addedId = meld.addedId; existing.ids = meld.ids.slice(); }
    else if (meld.type === 'kakan') { /* noop */ }
    else st.melds[p].push({ type: meld.type, t: meld.t, ids: meld.ids.slice(), from: meld.from, calledId: meld.calledId, addedId: meld.addedId });
    if (meld.type === 'kakan' && !existing) {
      const m0 = st.melds[p].find(x => x.t === meld.t); if (m0) { m0.type = 'kakan'; m0.addedId = meld.addedId; }
    }
    st.hands[p] = handAfter.slice();
    st.drawn[p] = null;
    const ps = [];
    for (const t of meldTransforms(p)) {
      const m = tiles.get(t.id);
      m.scale.setScalar(1);
      setFace(m, 'real');
      ps.push(tweenMesh(m, t.pos, t.quat, 0.4, { arc: 1 }));
    }
    ps.push(layoutHand(p, 0.3));
    await Promise.all(ps);
    // 河の詰め直し
    relayoutDiscards(from);
  };
  function relayoutDiscards(p) {
    st.discards[p].forEach((d, i) => { const tr = discardTransform(p, i); tweenMesh(tiles.get(d.id), tr.pos, tr.quat, 0.2); });
  }
  S.nuki = async function (p, id, handAfter) {
    st.nuki[p].push(id);
    st.hands[p] = handAfter.slice();
    st.drawn[p] = null;
    const m = tiles.get(id); setFace(m, 'real'); m.scale.setScalar(1);
    const tr = meldTransforms(p).find(t => t.id === id);
    await Promise.all([tweenMesh(m, tr.pos, tr.quat, 0.4, { arc: 1 }), layoutHand(p, 0.25)]);
  };
  S.syncHand = function (p, ids) { st.hands[p] = ids.slice(); st.drawn[p] = null; return layoutHand(p, 0.2); };
  S.revealHand = async function (p, ids, winId) {
    st.revealed[p] = true;
    st.hands[p] = ids.slice();
    st.drawn[p] = null;
    const tr = handTransforms(p);
    const ps = [];
    tr.forEach((t, i) => {
      const m = tiles.get(t.id);
      setFace(m, 'real');
      m.scale.setScalar(1);
      const pos = t.pos.clone(); pos.y = TD / 2;
      const q = Q.flat(p, 0);
      ps.push(tweenMesh(m, pos, q, 0.35, { delay: i * 0.03, ease: 'outBack' }));
    });
    if (winId != null) {
      const m = tiles.get(winId);
      setFace(m, 'real'); m.scale.setScalar(1); m.visible = true;
      const last = tr.length ? tr[tr.length - 1].pos.clone() : toWorld(p, 0, 0, 9.9);
      const dir = toWorld(p, 1, 0, 0).sub(toWorld(p, 0, 0, 0)).normalize();
      last.addScaledVector(dir, TW + 0.5); last.y = TD / 2 + 0.02;
      ps.push(tweenMesh(m, last, Q.flat(p, 0), 0.5, { delay: tr.length * 0.03 + 0.1, arc: 2.5, ease: 'outBounce' }));
      setTimeout(() => S.burst(last, ['#ffe066', '#ffffff', '#ff8fd0'], 90, { speed: 7, life: 1.3, size: 0.55 }), (tr.length * 0.03 + 0.5) * 1000 / S.speed);
    }
    await Promise.all(ps);
  };
  S.flipUra = function (uraIds) {
    for (const id of uraIds) {
      const m = tiles.get(id); if (!m) continue;
      const i = st.wall.indexOf(id);
      const tr = wallTransform(i);
      const pos = tr.pos.clone(); pos.y = TD / 2;
      // 表ドラの手前に並べる
      const dir = toWorld(tr.p, 0, 0, -1).sub(toWorld(tr.p, 0, 0, 0)).normalize();
      pos.addScaledVector(dir, TH + 0.2);
      tweenMesh(m, pos, Q.flat(tr.p), 0.5, { arc: 1.5 });
    }
  };

  /* ---------------- 中央パネル ---------------- */
  S.setCenter = function (info) {
    // info: {roundText, honba, kyotaku, remaining, scores[], winds[], turn, riichi[], names[]}
    const g = centerCanvas.getContext('2d');
    g.clearRect(0, 0, 512, 512);
    const gr = g.createLinearGradient(0, 0, 512, 512);
    gr.addColorStop(0, '#231a44'); gr.addColorStop(1, '#130d2a');
    g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(255,200,120,0.6)'; g.lineWidth = 6; g.strokeRect(10, 10, 492, 492);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#ffe9a8';
    g.font = '900 64px "Hiragino Mincho ProN","Yu Mincho",serif';
    g.fillText(info.roundText, 256, 214);
    g.font = '700 30px "Hiragino Sans","Yu Gothic",sans-serif';
    g.fillStyle = '#ffffff';
    g.fillText(info.line2 || `${info.honba}本場  供託${info.kyotaku}`, 256, 272);
    g.fillStyle = '#8be9ff';
    g.fillText(info.line3 || `残り ${info.remaining}`, 256, 312);
    for (let p = 0; p < n; p++) {
      const a = seatAngle(p);
      g.save(); g.translate(256, 256); g.rotate(-a);
      const turn = info.turn === p;
      if (turn) {
        const lg = g.createLinearGradient(-150, 0, 150, 0);
        lg.addColorStop(0, 'rgba(255,95,162,0)'); lg.addColorStop(0.5, 'rgba(255,95,162,1)'); lg.addColorStop(1, 'rgba(255,95,162,0)');
        g.fillStyle = lg; g.fillRect(-170, 222, 340, 16);
      }
      g.fillStyle = info.winds[p] === '東' ? '#ff6f8f' : '#ffffff';
      g.font = '900 46px "Hiragino Mincho ProN","Yu Mincho",serif';
      g.fillText(info.winds[p], -120, 180);
      g.fillStyle = turn ? '#ffe066' : '#e8e3ff';
      g.font = '800 40px "Hiragino Sans","Yu Gothic",sans-serif';
      g.fillText(String(info.scores[p]), 40, 182);
      if (info.riichi && info.riichi[p]) { g.fillStyle = '#ff5fa2'; g.fillRect(-60, 206, 120, 8); }
      g.restore();
    }
    centerTex.needsUpdate = true;
  };

  S.applyCfg = function () { portraitMode = !portraitMode; fitCamera(); camCur.pos.copy(camBase.pos); camCur.look.copy(camBase.look); layoutHand(0, 0); };
  S.dangerPositions = function () { return (st.hands[0] || []).map(id => ({ id, pos: S.projectTile(id) })); };
  S.handIds = (p) => (st.hands[p] || []).slice();
  S.renderer = () => renderer;
  root.Scene3D = S;
})(typeof window !== 'undefined' ? window : globalThis);
