/* =========================================================
 *  CHEAT JANKI! — 反則技の3D演出
 *  Scene3D.internals() を使って、時間停止・残像・磁力ビーム・X線スキャン・
 *  衝撃波・ドラ爆発・ちゃぶ台返し（物理）を描く。
 * ========================================================= */
(function (root) {
  'use strict';
  const S = root.Scene3D;
  const C = {};
  const sleep = (ms) => new Promise(r => setTimeout(r, ms / (S.speed || 1)));
  let I = null;
  const in_ = () => (I || (I = S.internals()));

  /* ---------- 共通パーツ ---------- */
  function ghostTrail(mesh, dur, color) {
    const { THREE, scene } = in_();
    let acc = 0, t = 0;
    const ghosts = [];
    S.addUpdater((dt, raw) => {
      t += raw; acc += raw;
      if (t < dur && acc > 0.035) {
        acc = 0;
        const g = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color: color || 0x6fe0ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
        g.position.copy(mesh.position); g.quaternion.copy(mesh.quaternion); g.scale.copy(mesh.scale);
        scene.add(g); ghosts.push({ g, life: 0 });
      }
      for (let i = ghosts.length - 1; i >= 0; i--) {
        const q = ghosts[i]; q.life += raw;
        q.g.material.opacity = Math.max(0, 0.5 * (1 - q.life / 0.4));
        q.g.scale.multiplyScalar(1 + raw * 0.6);
        if (q.life > 0.4) { scene.remove(q.g); q.g.material.dispose(); ghosts.splice(i, 1); }
      }
      return t < dur + 0.45 || ghosts.length > 0;
    });
  }
  function ring(pos, color, maxR, dur, width) {
    const { THREE, scene } = in_();
    const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.8 + (width || 0.6), 64), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2; m.position.copy(pos); scene.add(m);
    let t = 0;
    S.addUpdater((dt, raw) => {
      t += raw; const k = Math.min(1, t / dur);
      const r = 1 + (maxR - 1) * (1 - Math.pow(1 - k, 3));
      m.scale.setScalar(r); m.material.opacity = 0.9 * (1 - k);
      if (k >= 1) { scene.remove(m); m.geometry.dispose(); m.material.dispose(); return false; }
      return true;
    });
  }
  function handCenter() { const { toWorld, CFG } = in_(); return toWorld(0, 0, 1.0, CFG.handZ); }
  async function pushIn(amount, dur) {
    const { camBase, camTo } = in_();
    const target = camBase.pos.clone().lerp(handCenter(), amount);
    await camTo(target, camBase.look.clone().lerp(handCenter(), amount * 0.6), dur);
  }
  C.timeStop = function (on) { S.post('uInvert', on ? 1 : 0, on ? 0.18 : 0.35); S.post('uWarp', on ? 1 : 0, on ? 0.15 : 0.4); };

  /* ---------- 燕返し ---------- */
  C.swap = async function ({ wall, drawPtr, hand, drawnId, inId, outId, wallIndex }) {
    const { tiles, tweenMesh, wallTransform, setFace } = in_();
    root.Sound && Sound.sfx('timestop');
    C.timeStop(true);
    pushIn(0.18, 0.35);
    await sleep(320);
    const outM = tiles.get(outId), inM = tiles.get(inId);
    const fromPos = outM.position.clone(), fromQ = outM.quaternion.clone();
    S.syncWall(wall, drawPtr);                      // 内部状態を更新（outId は壁へ瞬間移動する）
    outM.position.copy(fromPos); outM.quaternion.copy(fromQ); outM.scale.setScalar(S.cfgScale());
    const tr = wallTransform(wallIndex);
    ghostTrail(outM, 0.55, 0x6fe0ff); ghostTrail(inM, 0.55, 0xffe066);
    setFace(inM, 'real');
    root.Sound && Sound.sfx('swap');
    const p1 = tweenMesh(outM, tr.pos, tr.quat, 0.55, { arc: 3.2, scale: 1 });
    const p2 = S.setHand(0, hand, drawnId, 0.55);
    S.burst(fromPos, ['#6fe0ff', '#ffffff'], 40, { speed: 4, life: 0.7, size: 0.4 });
    await Promise.all([p1, p2]);
    S.burst(tr.pos, ['#6fe0ff', '#ffffff'], 30, { speed: 3, life: 0.6, size: 0.35 });
    await sleep(150);
    C.timeStop(false);
    S.resetCamera(0.5);
  };

  /* ---------- 河拾い ---------- */
  C.raid = async function ({ hand, drawnId, inId, outId, p, idx }) {
    const { THREE, scene, tiles } = in_();
    const inM = tiles.get(inId);
    const from = inM.position.clone(), to = handCenter();
    // 磁力ビーム
    const len = from.distanceTo(to);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.5, len, 16, 1, true), beamMat);
    beam.position.copy(from).lerp(to, 0.5);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    scene.add(beam);
    root.Sound && Sound.sfx('magnet');
    S.post('uChroma', 0.8, 0.2);
    let t = 0, acc = 0;
    S.addUpdater((dt, raw) => {
      t += raw; acc += raw;
      beamMat.opacity = Math.min(0.75, t * 3) * (t > 1.0 ? Math.max(0, 1 - (t - 1.0) * 3) : 1) * (0.7 + 0.3 * Math.sin(t * 40));
      if (acc > 0.03 && t < 1.0) { acc = 0; const k = Math.random(); S.burst(from.clone().lerp(to, k), ['#ffd23f', '#fff6c2'], 3, { speed: 1.5, life: 0.5, size: 0.3, gravity: 0 }); }
      if (t > 1.4) { scene.remove(beam); beam.geometry.dispose(); beamMat.dispose(); return false; }
      return true;
    });
    await sleep(380);
    ghostTrail(inM, 0.6, 0xffd23f);
    const a = S.setHand(0, hand, drawnId, 0.6);
    const b = S.replaceDiscard(p, idx, outId, 0.6);
    await Promise.all([a, b]);
    S.burst(to, ['#ffd23f', '#ffffff'], 50, { speed: 4, life: 0.8, size: 0.45 });
    S.post('uChroma', 0, 0.4);
    await sleep(250);
  };

  /* ---------- 千里眼 ---------- */
  C.peek = async function (on) {
    if (!on) { S.post('uScan', 0, 0.5); await S.setPeek(false); return; }
    const { THREE } = in_();
    root.Sound && Sound.sfx('xray');
    ring(new THREE.Vector3(0, 0.6, 0), 0x35ffd0, 18, 1.1, 1.2);
    S.post('uScan', 1, 0.3);
    await sleep(250);
    await S.setPeek(true);
    setTimeout(() => S.post('uScan', 0.22, 0.8), 700);
  };

  /* ---------- 強打 ---------- */
  C.slam = async function (exposed) {
    const { THREE, scene, tiles, tweenMesh, st } = in_();
    const big = new THREE.Mesh(tiles.get(0).geometry, tiles.get(0).material.slice ? tiles.get(0).material.slice() : tiles.get(0).material);
    big.scale.setScalar(3.2);
    big.rotation.set(-Math.PI / 2, 0, 0);
    big.position.set(0, 16, 3);
    scene.add(big);
    pushIn(0.12, 0.25);
    const t0 = performance.now();
    await new Promise(res => S.addUpdater(() => {
      const k = Math.min(1, (performance.now() - t0) / 380);
      big.position.y = 16 - 15 * k * k; big.rotation.z = (1 - k) * 2.5;
      if (k >= 1) { res(); return false; }
      return true;
    }));
    root.Sound && Sound.sfx('slam');
    S.shake(1.3); S.pulseBloom(1.6, 0.6);
    S.post('uChroma', 1.5, 0.05).then(() => S.post('uChroma', 0, 0.6));
    ring(new THREE.Vector3(0, 0.5, 2), 0xffb35a, 22, 0.9, 1.0);
    ring(new THREE.Vector3(0, 0.6, 2), 0xffffff, 14, 0.6, 0.4);
    S.burst(new THREE.Vector3(0, 0.8, 2), ['#ffb35a', '#ffffff', '#ffe066'], 160, { speed: 10, life: 1.0, size: 0.5, up: 3 });
    // 相手の牌が跳ねる
    for (const q of Object.keys(exposed).map(Number)) {
      for (const id of st.hands[q] || []) { const m = tiles.get(id); if (!m) continue; const p = m.position.clone(); p.y += 1.6 + Math.random(); tweenMesh(m, p, m.quaternion, 0.18, { ease: 'outCubic' }); }
    }
    await sleep(260);
    scene.remove(big);
    await Promise.all(Object.entries(exposed).map(([q, ids]) => S.setExposed(Number(q), ids)));
    S.resetCamera(0.5);
  };

  /* ---------- ドラ爆弾 ---------- */
  C.doraBomb = async function ({ wall, drawPtr, id }) {
    const { THREE, tiles } = in_();
    S.syncWall(wall, drawPtr);
    await sleep(120);
    S.setDora([id]);
    root.Sound && Sound.sfx('bomb');
    await sleep(450);
    const pos = tiles.get(id).position.clone().add(new THREE.Vector3(0, 0.5, 0));
    S.shake(1.0); S.pulseBloom(2.0, 0.8);
    S.post('uGold', 1, 0.08).then(() => S.post('uGold', 0, 0.9));
    ring(pos, 0xffd23f, 12, 0.8, 0.9);
    S.burst(pos, ['#ffe066', '#ff9f2e', '#ffffff', '#ff5fa2'], 220, { speed: 11, life: 1.4, size: 0.6, up: 5 });
    await sleep(500);
  };

  /* ---------- AI のイカサマのきらめき ---------- */
  C.glint = function (p) {
    const { toWorld } = in_();
    const pos = toWorld(p, (Math.random() - 0.5) * 4, 1.4, 9.9);
    S.burst(pos, ['#ffffff', '#fff6a8', '#8be9ff'], 26, { speed: 2.2, life: 0.7, size: 0.5, gravity: 0 });
    S.standee(p, 'glow');
  };

  /* ---------- ちゃぶ台返し ---------- */
  C.tableFlip = async function () {
    const { THREE, tiles, tablePivot, st } = in_();
    root.Sound && Sound.sfx('flip');
    S.shake(1.6);
    S.post('uChroma', 1.4, 0.1);
    // 卓の天板を奥の辺を軸に起こす
    const t0 = performance.now();
    S.addUpdater(() => {
      const k = Math.min(1, (performance.now() - t0) / 900);
      const e = 1 - Math.pow(1 - k, 3);
      tablePivot.rotation.x = -1.72 * e + Math.sin(k * Math.PI) * -0.15;
      return k < 1;
    });
    // 牌が全部飛ぶ
    for (const m of tiles.values()) {
      if (!m.visible) continue;
      const v = new THREE.Vector3((Math.random() - 0.5) * 10, 9 + Math.random() * 12, -4 - Math.random() * 12 + (m.position.z > 0 ? 6 : 0));
      const w = new THREE.Vector3((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18);
      S.addPhysics(m, v, w, 4.5);
    }
    for (const s of st.sticks) S.addPhysics(s, new THREE.Vector3((Math.random() - 0.5) * 6, 14, -8), new THREE.Vector3(5, 3, 7), 4.5);
    for (let p = 1; p < 4; p++) S.standee(p, 'fly');
    S.burst(new THREE.Vector3(0, 2, 4), ['#ffffff', '#ff5fa2', '#8be9ff', '#ffe066', '#c08bff'], 300, { speed: 14, life: 1.8, size: 0.6, up: 8 });
    S.pulseBloom(2.2, 1.2);
    await sleep(180);
    S.timeScale = 0.28;
    await sleep(900);
    S.timeScale = 1;
    S.post('uChroma', 0, 0.6);
    await sleep(1200);
  };

  /* =========================================================
   *  無法地帯: 卓が荒れるイベント / キャラ固有技の演出
   *  sync(dur, opt) は UI 側が渡す「エンジンの状態に卓を合わせる」関数
   * ========================================================= */
  const sfx = (n) => root.Sound && Sound.sfx(n);
  const rnd = (a, b) => a + Math.random() * (b - a);
  function tween(dur, fn) {
    const t0 = performance.now();
    return new Promise(res => S.addUpdater(() => {
      const k = Math.min(1, (performance.now() - t0) / (dur * 1000 / (S.speed || 1)));
      fn(k);
      if (k >= 1) { res(); return false; }
      return true;
    }));
  }
  const easeOut = (k) => 1 - Math.pow(1 - k, 3);
  const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  function billboard(mesh) {
    const { camera } = in_();
    S.addUpdater(() => { if (!mesh.parent) return false; mesh.quaternion.copy(camera.quaternion); return true; });
  }
  function seatPos(p, y) { return in_().toWorld(p, 0, y == null ? 1.5 : y, 9.5); }
  /** 2点間のビーム（磁力・猫の手・蔓など） */
  function beam(from, to, color, dur) {
    const { THREE, scene } = in_();
    const len = from.distanceTo(to);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.42, len, 14, 1, true), mat);
    m.position.copy(from).lerp(to, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    scene.add(m);
    let t = 0;
    S.addUpdater((dt, raw) => {
      t += raw;
      mat.opacity = Math.min(0.8, t * 4) * (t > dur ? Math.max(0, 1 - (t - dur) * 4) : 1) * (0.7 + 0.3 * Math.sin(t * 50));
      if (Math.random() < 0.6 && t < dur) S.burst(from.clone().lerp(to, Math.random()), ['#ffffff', '#' + new THREE.Color(color).getHexString()], 2, { speed: 1.2, life: 0.5, size: 0.3, gravity: 0 });
      if (t > dur + 0.3) { scene.remove(m); m.geometry.dispose(); mat.dispose(); return false; }
      return true;
    });
  }
  /** 浮かぶ大きな文字板（ルーレット・時計など） */
  function panel(tex, size, pos) {
    const { THREE, scene } = in_();
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false }));
    m.renderOrder = 50;
    m.position.copy(pos);
    scene.add(m);
    billboard(m);
    return m;
  }
  function dispose(m) { const { scene } = in_(); scene.remove(m); m.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); }

  /* ---------- 1. 卓が大回転 ---------- */
  C.evRotate = async function (sync) {
    const { THREE, tableGroup } = in_();
    sfx('whoosh'); sfx('magnet');
    S.post('uWarp', 0.7, 0.3);
    ring(new THREE.Vector3(0, 0.4, 0), 0xff5fa2, 16, 1.6, 1.2);
    const spin = tween(1.8, (k) => { tableGroup.rotation.y = easeInOut(k) * Math.PI * 2; });
    const swirl = setInterval(() => S.burst(new THREE.Vector3(rnd(-8, 8), 0.6, rnd(-8, 8)), ['#ff5fa2', '#ffffff', '#8be9ff'], 8, { speed: 3, life: 0.8, size: 0.4, up: 2 }), 60);
    await sleep(350);
    const mv = sync(1.3, { arc: 6 });
    await Promise.all([spin, mv]);
    clearInterval(swirl);
    tableGroup.rotation.y = 0;
    S.post('uWarp', 0, 0.5);
    S.shake(0.6);
  };

  /* ---------- 2. 重力反転 ---------- */
  C.evGravity = async function () {
    const { THREE, tiles } = in_();
    sfx('xray');
    S.post('uWarp', 0.35, 0.6);
    const list = [...tiles.values()].filter(m => m.visible).map(m => ({ m, y: m.position.y, rx: m.rotation.x, rz: m.rotation.z, ph: Math.random() * 6.28, h: rnd(1.5, 4.5), sx: rnd(-1, 1), sz: rnd(-1, 1) }));
    const base = list.map(o => o.m.quaternion.clone());
    for (let i = 0; i < 40; i++) S.burst(new THREE.Vector3(rnd(-10, 10), 0.3, rnd(-10, 10)), ['#7dd3ff', '#ffffff'], 3, { speed: 1, life: 2, size: 0.35, up: 4, gravity: -1 });
    await S.setPeek(true);
    await tween(3.2, (k) => {
      const lift = Math.sin(Math.min(1, k * 1.25) * Math.PI);           // 浮いて、戻る
      for (const o of list) {
        o.m.position.y = o.y + lift * (o.h + 0.4 * Math.sin(k * 12 + o.ph));
        o.m.rotation.x = o.rx + lift * o.sx * 0.9; o.m.rotation.z = o.rz + lift * o.sz * 0.9;
      }
    });
    list.forEach((o, i) => { o.m.position.y = o.y; o.m.quaternion.copy(base[i]); });
    S.post('uWarp', 0, 0.5);
    S.shake(0.4);
  };

  /* ---------- 3. 隕石ドラ ---------- */
  C.evMeteor = async function (t) {
    const { THREE, scene, tiles } = in_();
    const from = new THREE.Vector3(22, 42, -30), to = new THREE.Vector3(0, 0.6, 0);
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3, 1), new THREE.MeshBasicMaterial({ color: 0xffb35a }));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.spriteTex('star'), color: 0xff7a3d, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.set(9, 9, 1);
    g.add(core); g.add(glow); g.position.copy(from); scene.add(g);
    sfx('whoosh');
    S.post('uRed', 0.35, 0.6);
    await tween(1.15, (k) => {
      const e = k * k;
      g.position.lerpVectors(from, to, e);
      core.rotation.x += 0.2; core.rotation.y += 0.15;
      S.burst(g.position.clone(), ['#ff7a3d', '#ffd23f', '#ffffff'], 6, { speed: 1.5, life: 0.7, size: 0.7, gravity: 0 });
    });
    dispose(g);
    sfx('bomb'); sfx('slam');
    S.shake(1.8); S.pulseBloom(2.6, 1.0);
    S.post('uRed', 0, 0.8);
    S.post('uGold', 1, 0.08).then(() => S.post('uGold', 0, 1.0));
    ring(new THREE.Vector3(0, 0.5, 0), 0xff7a3d, 24, 1.1, 1.4);
    ring(new THREE.Vector3(0, 0.6, 0), 0xffffff, 14, 0.7, 0.5);
    S.burst(to, ['#ff7a3d', '#ffd23f', '#ffffff', '#ff3b3b'], 320, { speed: 15, life: 1.6, size: 0.7, up: 9 });
    // 当たった種類の牌が跳ねて光る
    for (const m of tiles.values()) {
      if (!m.visible || m.userData.t !== t) continue;
      const p0 = m.position.clone();
      S.burst(p0.clone().add(new THREE.Vector3(0, 0.6, 0)), ['#ffe066', '#ffffff'], 30, { speed: 3, life: 1, size: 0.45 });
      tween(0.6, (k) => { m.position.y = p0.y + Math.sin(k * Math.PI) * 1.6; }).then(() => { m.position.y = p0.y; });
    }
    await sleep(900);
  };

  /* ---------- 4. 牌の大移動 ---------- */
  C.evMigrate = async function (moves, sync) {
    const { THREE, tiles } = in_();
    sfx('swap');
    const movers = moves.map(mv => tiles.get(mv.id)).filter(Boolean);
    // その場で小刻みに足踏みしてから走り出す
    const p0 = movers.map(m => m.position.clone());
    await tween(0.6, (k) => movers.forEach((m, i) => { m.position.y = p0[i].y + Math.abs(Math.sin(k * Math.PI * 6)) * 0.5; }));
    const dust = setInterval(() => movers.forEach(m => S.burst(m.position.clone().setY(0.3), ['#d9c9a8', '#ffffff'], 2, { speed: 0.8, life: 0.6, size: 0.35, gravity: 0 })), 50);
    await sync(1.6, { arc: 2.5 });
    clearInterval(dust);
    movers.forEach(m => S.burst(m.position.clone(), ['#ffd23f', '#ffffff'], 30, { speed: 3, life: 0.8, size: 0.4 }));
    S.shake(0.4);
  };

  /* ---------- 5. 謎ルールルーレット ---------- */
  C.roulette = async function (rules, chosenIdx, labels, color) {
    const { THREE } = in_();
    const N = rules.length;
    const cols = ['#ff5fa2', '#5ad1ff', '#ffd23f', '#7dffb0', '#c08bff', '#ff9f2e'];
    const tex = S.textTexture((g, W, H) => {
      const cx = W / 2, cy = H / 2, R = W / 2 - 8;
      for (let i = 0; i < N; i++) {
        const a0 = -Math.PI / 2 + (i - 0.5) * (Math.PI * 2 / N), a1 = a0 + Math.PI * 2 / N;
        g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0, a1); g.closePath();
        g.fillStyle = cols[i % cols.length]; g.fill();
        g.strokeStyle = '#1a0f2e'; g.lineWidth = 6; g.stroke();
        g.save(); g.translate(cx, cy); g.rotate(-Math.PI / 2 + i * Math.PI * 2 / N + Math.PI / 2);
        g.fillStyle = '#1a0f2e'; g.font = '900 34px "M PLUS Rounded 1c","Hiragino Sans",sans-serif'; g.textAlign = 'center';
        g.fillText(labels[i], 0, -R * 0.62);
        g.restore();
      }
      g.beginPath(); g.arc(cx, cy, 40, 0, 6.29); g.fillStyle = '#fff'; g.fill();
      g.strokeStyle = '#ffd23f'; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy, R, 0, 6.29); g.stroke();
    }, 512, 512);
    const group = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false }));
    disc.renderOrder = 50;
    const ptr = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 3), new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }));
    ptr.renderOrder = 51; ptr.rotation.z = Math.PI; ptr.position.set(0, 4.1, 0.1);
    group.add(disc); group.add(ptr);
    group.position.set(0, 5.2, 4.5);
    in_().scene.add(group);
    billboard(group);
    group.scale.setScalar(0.01);
    sfx('whoosh');
    await tween(0.35, (k) => group.scale.setScalar(Math.max(0.01, easeOut(k))));
    const target = Math.PI * 2 * 5 + chosenIdx * (Math.PI * 2 / N);
    let lastTick = 0;
    await tween(3.0, (k) => {
      disc.rotation.z = easeOut(k) * target;
      const seg = Math.floor(disc.rotation.z / (Math.PI * 2 / N));
      if (seg !== lastTick) { lastTick = seg; sfx('tick'); }
    });
    sfx('stamp');
    S.burst(group.position.clone(), [color || '#c08bff', '#ffffff', '#ffe066'], 120, { speed: 8, life: 1.2, size: 0.5 });
    S.pulseBloom(1.8, 0.6);
    await sleep(900);
    await tween(0.3, (k) => group.scale.setScalar(Math.max(0.01, 1 - k)));
    dispose(group);
  };

  /* ---------- 6. 熱波で牌が溶ける ---------- */
  C.evMelt = async function (changes, sync) {
    const { tiles } = in_();
    sfx('bomb');
    S.post('uWarp', 0.5, 0.3);
    S.post('uGold', 0.45, 0.4);
    const outs = changes.map(c => tiles.get(c.outId)).filter(Boolean);
    const s0 = outs.map(m => m.scale.clone());
    await tween(0.8, (k) => outs.forEach((m, i) => {
      m.scale.set(s0[i].x * (1 + k * 0.4), s0[i].y * (1 - k * 0.85), s0[i].z * (1 + k * 0.3));
      if (Math.random() < 0.5) S.burst(m.position.clone(), ['#ff7a3d', '#ffd23f', '#ff3b3b'], 3, { speed: 1.5, life: 0.6, size: 0.45, up: 2, gravity: -1 });
    }));
    const ins = changes.map(c => tiles.get(c.inId)).filter(Boolean);
    const mv = sync(0.7, { arc: 1.5 });
    const target = ins.map(m => m.scale.x);
    await tween(0.7, (k) => ins.forEach((m, i) => m.scale.setScalar(Math.max(0.05, target[i] * easeOut(k)))));
    await mv;
    ins.forEach(m => S.burst(m.position.clone(), ['#ffe066', '#ffffff'], 26, { speed: 3, life: 0.8, size: 0.4 }));
    S.post('uWarp', 0, 0.5); S.post('uGold', 0, 0.6);
  };

  /* ---------- 7. 時間が巻き戻る ---------- */
  C.evRewind = async function (sync) {
    const { THREE } = in_();
    const face = S.textTexture((g, W, H) => {
      const cx = W / 2, cy = H / 2, R = W / 2 - 10;
      g.fillStyle = 'rgba(255,250,235,0.95)'; g.beginPath(); g.arc(cx, cy, R, 0, 6.29); g.fill();
      g.strokeStyle = '#5ad1ff'; g.lineWidth = 16; g.stroke();
      g.fillStyle = '#1a2340'; g.font = '900 54px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; g.fillText(String(i), cx + Math.cos(a) * R * 0.78, cy + Math.sin(a) * R * 0.78); }
    }, 512, 512);
    const group = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), new THREE.MeshBasicMaterial({ map: face, transparent: true, depthTest: false, depthWrite: false }));
    disc.renderOrder = 50; group.add(disc);
    const handMat = new THREE.MeshBasicMaterial({ color: 0x1a2340, depthTest: false });
    const hh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.7, 0.05), handMat); hh.geometry.translate(0, 0.85, 0); hh.renderOrder = 51;
    const mh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.5, 0.05), handMat); mh.geometry.translate(0, 1.25, 0); mh.renderOrder = 51;
    group.add(hh); group.add(mh);
    group.position.set(0, 5.2, 4.5);
    in_().scene.add(group);
    billboard(group);
    sfx('timestop');
    S.post('uInvert', 0.38, 0.3); S.post('uWarp', 0.8, 0.3); S.post('uChroma', 1, 0.3);
    S.timeScale = 1;
    const spin = tween(2.2, (k) => { mh.rotation.z = k * Math.PI * 8; hh.rotation.z = k * Math.PI * 1.4; });
    await sleep(500);
    await sync(1.3, { arc: 3 });
    await spin;
    dispose(group);
    S.post('uInvert', 0, 0.4); S.post('uWarp', 0, 0.5); S.post('uChroma', 0, 0.5);
    S.shake(0.5);
  };

  /* ---------- 8. 言葉カードの雨 ---------- */
  C.evWords = async function (texts) {
    const { THREE, scene } = in_();
    sfx('sparkle');
    const texes = texts.slice(0, 8).map(txt => S.textTexture((g, W, H) => {
      g.fillStyle = '#fffaf0'; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#ff5fa2'; g.lineWidth = 14; g.strokeRect(7, 7, W - 14, H - 14);
      g.fillStyle = '#1a0f2e'; g.textAlign = 'center'; g.textBaseline = 'middle';
      const fs = Math.min(70, Math.floor((W - 30) / Math.max(1, [...txt].length) * 1.05));
      g.font = `900 ${fs}px "M PLUS Rounded 1c","Hiragino Sans",sans-serif`;
      g.fillText(txt, W / 2, H / 2);
    }, 256, 160));
    const cards = [];
    for (let i = 0; i < 26; i++) {
      // 裏から見ても文字が反転しないよう、表と裏の2枚を背中合わせにする
      const mat = new THREE.MeshBasicMaterial({ map: texes[i % texes.length], side: THREE.FrontSide, transparent: true });
      const geo = new THREE.PlaneGeometry(2.4, 1.5);
      const m = new THREE.Group(), back = new THREE.Mesh(geo, mat);
      back.rotation.y = Math.PI; m.add(new THREE.Mesh(geo, mat)); m.add(back);
      m.material = mat;
      m.position.set(rnd(-11, 11), rnd(16, 30), rnd(-11, 11));
      m.rotation.set(rnd(0, 6), rnd(0, 6), rnd(0, 6));
      scene.add(m);
      cards.push({ m, vy: rnd(5, 8), sw: rnd(1, 3), ph: rnd(0, 6), rv: new THREE.Vector3(rnd(-3, 3), rnd(-3, 3), rnd(-3, 3)) });
    }
    let lastK = 0;
    await tween(3.0, (k) => {
      const dts = (k - lastK) * 3.0; lastK = k;   // フレームレートに依存しない落下
      for (const c of cards) {
        c.m.position.y = Math.max(0.3, c.m.position.y - c.vy * 1.45 * dts);
        c.m.position.x += Math.sin(k * 12 + c.ph) * 1.8 * c.sw * dts;
        c.m.rotation.x += c.rv.x * dts; c.m.rotation.y += c.rv.y * dts;
        c.m.material.opacity = k > 0.8 ? (1 - k) * 5 : 1;
      }
    });
    cards.forEach(c => dispose(c.m));
    texes.forEach(t => t.dispose());
  };

  /* ---------- キャラ固有技 ---------- */
  C.sig = async function (d, sync, color, extra) {
    const { THREE, toWorld } = in_();
    const p = d.p, at = seatPos(p, 1.8);
    S.standee(p, 'glow'); S.standee(p, 'bounce');
    S.burst(at, [color, '#ffffff', '#ffe066'], 140, { speed: 7, life: 1.2, size: 0.55, up: 4 });
    ring(seatPos(p, 0.4), new THREE.Color(color).getHex(), 10, 0.8, 0.8);
    S.pulseBloom(1.8, 0.7);
    const others = [];
    for (let q = 0; q < (extra && extra.n || 4); q++) if (q !== p) others.push(q);
    switch (d.kind) {
      case 'karen':
        sfx('slam'); S.shake(1.4); S.post('uChroma', 1.2, 0.05).then(() => S.post('uChroma', 0, 0.5));
        ring(new THREE.Vector3(0, 0.5, 0), 0xff3b3b, 20, 0.9, 1.2);
        await sync(0.7, { arc: 4 });
        break;
      case 'reika': {
        sfx('coin');
        const coins = [];
        for (let i = 0; i < 26; i++) {
          const c = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 18), new THREE.MeshStandardMaterial({ color: 0xffd24d, metalness: 0.9, roughness: 0.25, emissive: 0x6a4a00, emissiveIntensity: 0.4 }));
          c.position.copy(at).add(new THREE.Vector3(rnd(-1, 1), rnd(1, 3), rnd(-1, 1)));
          in_().scene.add(c); coins.push(c);
          S.addPhysics(c, new THREE.Vector3(rnd(-6, 6), rnd(6, 12), rnd(-6, 6)), new THREE.Vector3(rnd(-8, 8), rnd(-8, 8), rnd(-8, 8)), 3.5, 0.06);
        }
        await sleep(700);
        if (d.dora && d.dora.length) { sync(0.3); S.setDora(d.dora); sfx('bomb'); S.post('uGold', 1, 0.08).then(() => S.post('uGold', 0, 0.9)); }
        await sleep(1300);
        coins.forEach(c => dispose(c));
        break;
      }
      case 'mira': {
        sfx('sparkle');
        const star = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.spriteTex('star'), color: 0xfff3a0, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        star.scale.set(4, 4, 1); in_().scene.add(star);
        const from = new THREE.Vector3(-26, 26, -24), to = at.clone();
        await tween(1.2, (k) => { star.position.lerpVectors(from, to, easeOut(k)); S.burst(star.position.clone(), ['#fff3a0', '#ff5fd2', '#8be9ff'], 5, { speed: 1, life: 0.9, size: 0.5, gravity: 0 }); });
        dispose(star);
        S.burst(to, ['#fff3a0', '#ff5fd2', '#ffffff'], 160, { speed: 8, life: 1.4, size: 0.5, up: 3 });
        break;
      }
      case 'shizuku':
        sfx('xray'); S.post('uScan', 1, 0.2);
        for (const c of d.changes) beam(seatPos(c.p, 1.4), new THREE.Vector3(0, 1, 0), 0x3a7bff, 0.8);
        await sleep(400);
        await sync(0.8, { arc: 3 });
        S.post('uScan', 0, 0.6);
        break;
      case 'hiyori': case 'nono': case 'natsu': {
        const col = d.kind === 'nono' ? 0x2fbf71 : d.kind === 'natsu' ? 0xff8a00 : 0xff5fa2;
        sfx(d.kind === 'natsu' ? 'whoosh' : 'magnet');
        if (d.kind === 'natsu' && root.FX) FX.speedLines(0.8, color);
        const src = d.kind === 'hiyori' ? new THREE.Vector3(0, 0.6, 0) : toWorld(p, 0, 1.2, -2);
        beam(src, seatPos(p, 1.2), col, d.kind === 'natsu' ? 0.4 : 0.9);
        if (d.kind === 'hiyori') S.burst(new THREE.Vector3(0, 0.8, 0), ['#ff5fa2', '#ffffff', '#ffe066'], 120, { speed: 9, life: 1, size: 0.45, up: 6 });
        await sleep(d.kind === 'natsu' ? 150 : 400);
        await sync(d.kind === 'natsu' ? 0.3 : 0.8, { arc: 3 });
        break;
      }
      case 'myao':
        sfx('magnet');
        if (d.steal) beam(seatPos(d.steal.from, 1.2), seatPos(p, 1.2), 0xff9f2e, 0.9);
        if (d.steal) S.standee(d.steal.from, 'shake');
        await sleep(400);
        await sync(0.8, { arc: 4 });
        break;
      case 'mahiru':
        sfx('timestop');
        S.post('uDesat', 0.7, 0.3); S.post('uRed', 0.5, 0.3);
        for (const q of others) beam(seatPos(q, 1.4), seatPos(p, 1.6), 0x8b0040, 1.1);
        await sleep(1300);
        S.post('uDesat', 0, 0.6); S.post('uRed', 0, 0.6);
        break;
      case 'luna': {
        sfx('sparkle');
        const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.spriteTex('star'), color: 0xe6dcff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        moon.scale.set(14, 14, 1); in_().scene.add(moon);
        await tween(1.2, (k) => { moon.position.set(0, 6 + k * 8, -14); moon.material.opacity = Math.sin(k * Math.PI); });
        dispose(moon);
        S.pulseBloom(2.2, 0.8);
        break;
      }
      case 'airi':
        sfx('xray');
        S.post('uDesat', 0.4, 0.2);
        for (const q of others) {
          S.burst(seatPos(q, 1.4), ['#e3f6ff', '#5ac8fa', '#ffffff'], 90, { speed: 5, life: 1.4, size: 0.5, up: 2 });
          ring(seatPos(q, 0.5), 0x5ac8fa, 6, 0.8, 0.6);
          S.standee(q, 'shake');
        }
        await sleep(1100);
        S.post('uDesat', 0, 0.6);
        break;
      default:
        await sleep(600);
    }
  };

  root.Cheat3D = C;
})(typeof window !== 'undefined' ? window : globalThis);
