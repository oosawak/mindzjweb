// エントリーポイント: 起動・メニュー・ゲームループ
import * as THREE from 'three';
import { G, loadSettings, saveSettings } from './state.js';
import { Engine } from './engine.js';
import { Input } from './input.js';
import { AudioEngine } from './audio.js';
import { VFX } from './vfx.js';
import { HUD } from './hud.js';
import { buildMap, updateMap, MAPS } from './maps.js';
import { BattleRoyale, Survival, Training } from './modes.js';
import { Actor } from './actor.js';
import { rand, pick, clamp } from './util.js';
import * as Admin from './admin.js';

const $ = (id) => document.getElementById(id);
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

loadSettings();
const engine = new Engine($('game'));
G.engine = engine; G.scene = engine.scene; G.camera = engine.camera; G.renderer = engine.renderer;
G.input = new Input($('game'));
G.audio = new AudioEngine();
G.vfx = new VFX(G.scene);
G.hud = new HUD();
G.actors = []; G.corpses = []; G.grenades = []; G.noises = []; G.targets = []; G.frame = 0;
G.fires = [];
const persistent = new Set(G.scene.children);

let state = 'boot';
let menuT = 0;
let pending = { mode: 'br', map: 'dust', diff: G.settings.difficulty };
let lastStart = null;

// ---- ユーティリティ ----
function show(id, v = true) { $(id).classList.toggle('hidden', !v); }
function clearGame() {
  if (G.mode) { G.mode.dispose(); G.mode = null; }
  if (G.player) { G.player.dispose(); G.player = null; }
  for (const a of G.actors) a.dispose();
  for (const c of G.corpses) c.disposeCorpse();
  for (const g of G.grenades) G.scene.remove(g.mesh);
  G.actors = []; G.corpses = []; G.grenades = []; G.noises = []; G.targets = [];
  G.vfx.clear();
  G.audio.stopAllLoops();
  if (G.map) { G.map.dispose(); G.map = null; }
  for (const o of [...G.scene.children]) if (!persistent.has(o) && o !== engine.sky) G.scene.remove(o);
  G.zone = null; G.loot = null;
  const u = engine.final.uniforms; u.uDamage.value = 0; u.uLowHealth.value = 0; u.uZone.value = 0; u.uFlash.value = 0;
  G.hud.reset();
}
function setupMapExtras(map) {
  G.fires = [];
  G.cullDist = map.pve ? 90 : { dust: 280, forest: 170, city: 220, range: 200 }[map.id];
  for (const f of map.fires || []) {
    const l = new THREE.PointLight(0xff8a3a, 20, 16, 1.6); l.position.set(f[0], f[1] + 0.8, f[2]); G.scene.add(l);
    G.fires.push({ p: new THREE.Vector3(...f), l });
  }
  const night = map.env.moon;
  G.vfx.setLight(night ? (map.pve ? 0.35 : 0.55) : 1);
  if (map.id === 'city') G.audio.loop('rain', true, 0.18);
  else if (map.id !== 'range') G.audio.loop('wind', true, map.id === 'forest' ? 0.12 : 0.08);
}

// ---- メニュー背景 ----
async function buildMenuScene() {
  clearGame();
  const map = buildMap('city', false);
  G.map = map; G.world = map.world;
  engine.setEnvironment(map.env);
  setupMapExtras(map);
  // ポーズを取る兵士たち
  const C = new THREE.Vector3(30, 0.0, 30);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0x6a3a22, roughness: 0.8, metalness: 0.4 }));
  barrel.position.set(C.x, 0.45 + map.hm.sample(C.x, C.z), C.z); barrel.castShadow = true; G.scene.add(barrel);
  const fl = new THREE.PointLight(0xff8a3a, 30, 14, 1.5); fl.position.set(C.x, 1.4, C.z); fl.castShadow = false; G.scene.add(fl);
  G.fires.push({ p: new THREE.Vector3(C.x, 0.9, C.z), l: fl });
  const spots = [[0.3, 'ar', 0.2], [1.5, 'sniper', 0.1], [2.6, 'shotgun', -0.25], [4.4, 'lmg', 0]];
  spots.forEach(([ang, w, p], i) => {
    const a = new Actor({ kind: 'soldier', name: 'm', look: { seed: i * 13 + 3, hat: i === 2 ? 'cap' : 'helmet' } });
    const r = 1.5 + (i % 2) * 0.3;
    { const x = C.x + Math.sin(ang) * r, z = C.z + Math.cos(ang) * r; a.setPos(x, map.hm.sample(x, z), z); }
    a.yaw = Math.atan2(Math.sin(ang), Math.cos(ang)) + (i === 1 ? 0.9 : 0); a.bodyYaw = a.yaw; a.giveWeapon(w); a.pitch = p;
    if (i === 3) a.crouch = 1;
    G.actors.push(a);
  });
  const m = new Actor({ kind: 'ghoul' }); m.setPos(C.x - 9, 0.0, C.z + 7); m.yaw = -2.2; m.bodyYaw = m.yaw; G.actors.push(m);
  const m2 = new Actor({ kind: 'brute' }); m2.setPos(C.x - 14, 0.0, C.z - 4); m2.yaw = -1.6; m2.bodyYaw = m2.yaw; G.actors.push(m2);
  for (const a of G.actors) a.onGround = true;
  G.menuActors = [...G.actors];
}
function updateMenu(dt) {
  menuT += dt;
  G.time += dt; G.frame++;
  const t = menuT * 0.05;
  const cam = engine.camera;
  cam.fov = 60; cam.updateProjectionMatrix();
  const ang = 0.6 + Math.sin(t) * 0.7;
  cam.position.set(30 + Math.sin(ang) * 6.5, 1.7 + Math.sin(t * 1.3) * 0.25, 30 + Math.cos(ang) * 6.5);
  cam.lookAt(29.2, 1.15, 29.4);
  for (const a of G.actors) { a.anim.speed = 0; a.updateVisual(dt); }
  for (const f of G.fires) { G.vfx.fire(f.p, dt); f.l.intensity = 26 + Math.sin(menuT * 17) * 5 + Math.sin(menuT * 7.3) * 6; }
  G.vfx.update(dt);
  updateMap(G.map, dt, menuT);
  engine.updateShadow(cam.position);
  G.audio.setListener(cam.position, cam.getWorldDirection(new THREE.Vector3()));
}

// ---- ゲーム開始 ----
const TIPS = [
  '[V] で一人称と三人称を切り替えられます。酔いやすい場合は三人称がおすすめ。',
  'しゃがむと敵に発見されにくく、反動も小さくなります。',
  'ヘッドショットは大ダメージ。スナイパーなら一撃で倒せます。',
  'アーマーは胴体へのダメージを45%軽減します。',
  'ゾーン外では継続ダメージ。フェーズが進むほど痛くなります。',
  'ショットガンの至近距離の一撃は…過激ゴア設定で真価を発揮します。',
  'サバイバルでは [F] のフラッシュライトが命綱です。',
  'グレネード [G] は遮蔽物に隠れた敵をあぶり出すのに有効です。',
  '銃声はミニマップに赤く表示されます。',
];
async function startGame(mode, mapId, diff) {
  lastStart = { mode, mapId, diff };
  state = 'loading';
  G.running = false;
  ['menu', 'mapsel', 'results', 'pause', 'settings', 'controls'].forEach((i) => show(i, false));
  show('loading'); G.hud.show(false);
  $('loading').querySelector('.tip').textContent = pick(TIPS);
  const bar = $('loading').querySelector('b');
  bar.style.width = '10%';
  await nextFrame();
  clearGame();
  bar.style.width = '30%';
  await nextFrame();
  const pve = mode === 'pve';
  const map = buildMap(mode === 'range' ? 'range' : mapId, pve);
  G.map = map; G.world = map.world;
  bar.style.width = '75%';
  await nextFrame();
  engine.setEnvironment(map.env);
  setupMapExtras(map);
  G.time = 0;
  G.mode = mode === 'br' ? new BattleRoyale(map, diff) : mode === 'pve' ? new Survival(map, diff) : new Training(map);
  bar.style.width = '100%';
  G.vfx.resize();
  // シェーダーのウォームアップ
  engine.camera.position.copy(G.player.actor.pos).add(new THREE.Vector3(0, 2, 0));
  engine.render(0.016);
  await nextFrame();
  show('loading', false);
  state = 'ready';
  show('clickstart');
  G.hud.show(true);
  G.hud.update(0.016);
}
function beginPlay() {
  show('clickstart', false);
  G.audio.init();
  state = 'play'; G.running = true; G.paused = true;
  G.input.lock();
  setTimeout(() => { if (state === 'play' && !G.input.locked && G.paused) show('pause'); }, 700);
}

// ---- ループ ----
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  G.dt = dt;
  try {
    const tu = performance.now();
    if (state === 'play' && G.running && !G.paused) { let ts = 1; if (G.hitstop > 0) { G.hitstop -= dt; ts = 0.25; } if (G.slowmo > 0) { G.slowmo -= dt; ts = Math.min(ts, 0.3); } if (G.admin.on) ts *= G.admin.timescale; update(dt * ts); }
    else if (state === 'menu') updateMenu(dt);
    else if (state === 'ready' && G.player) { G.player.updateCamera(0.016, G.input); engine.updateShadow(G.player.actor.pos); }
    else if (state === 'results' && G.player) { G.time += dt; G.frame++; updateWorldOnly(dt); G.player.updateDeathCam ? (G.player.actor.alive ? G.player.updateCamera(dt, G.input) : G.player.updateDeathCam(dt)) : 0; }
    G.perfUpdate = (G.perfUpdate || 0) * 0.9 + (performance.now() - tu) * 0.1;
    engine.render(dt);
  } catch (e) { console.error(e); }
  G.input.endFrame();
}
function updateWorldOnly(dt) {
  for (const a of G.actors) if (!a.isPlayer && a.alive && a.brain) a.brain.update(dt);
  for (const c of G.corpses) if (c.ragdoll) c.ragdoll.update(dt);
  G.vfx.update(dt);
  updateMap(G.map, dt, G.time);
  engine.updateShadow(G.player.actor.pos);
}
function update(dt) {
  G.time += dt; G.frame++;
  const I = G.input;
  G.player.update(dt, I);
  const frozen = G.admin.on && G.admin.freeze;
  for (const a of G.actors) if (!a.isPlayer && a.alive && a.brain && !(frozen && a.team !== G.player.actor.team && !a.dropState)) a.brain.update(dt);
  for (const c of G.corpses) if (c.ragdoll) c.ragdoll.update(dt);
  for (const g of G.grenades) g.update(dt);
  Admin.update(dt);
  G.grenades = G.grenades.filter((g) => !g.dead);
  G.mode.update(dt);
  G.loot && G.loot.update(dt);
  G.vfx.update(dt);
  updateMap(G.map, dt, G.time);
  for (const f of G.fires) { G.vfx.fire(f.p, dt); f.l.intensity = 16 + Math.sin(G.time * 17) * 3 + Math.sin(G.time * 7.3) * 4; }
  if (G.noises.length > 40 || (G.noises[0] && G.time - G.noises[0].t > 3)) G.noises = G.noises.filter((n) => G.time - n.t < 3);
  // 死体の整理
  const cam = engine.camera;
  G.audio.setListener(cam.position, cam.getWorldDirection(new THREE.Vector3()));
  G.hud.update(dt);
  engine.updateShadow(G.player.actor.alive ? G.player.actor.pos : cam.position);
  G.actors = G.actors.filter((a) => a.alive || a.isPlayer || G.time - a.deathTime < 1);
}
requestAnimationFrame(frame);

// ---- UI ----
G.ui = {
  showResults(r) {
    if (state !== 'play') return;
    state = 'results';
    G.input.unlock();
    const el = $('results');
    el.className = 'screen ' + (r.win ? 'win' : 'lose');
    el.querySelector('h1').textContent = r.title;
    el.querySelector('.sub').textContent = r.sub;
    el.querySelector('.stats').innerHTML = r.stats.map(([k, v]) => `<div><b>${v}</b>${k}</div>`).join('');
    G.hud.show(false);
  },
};
G.input.onLockChange = (locked) => {
  if (!locked && state === 'play') { G.paused = true; show('pause'); }
  if (locked && state === 'play') { G.paused = false; show('pause', false); ['settings', 'controls'].forEach((i) => show(i, false)); }
};
function openPanel(id) { show(id); }
function mapPreview(canvas, id) {
  const c = canvas.getContext('2d'); const W = canvas.width = 400, H = canvas.height = 200;
  const pal = { dust: ['#2f6fc4', '#ecc890', '#b07848', '#6a4428'], forest: ['#3a4a66', '#d89a70', '#2a3a26', '#121a12'], city: ['#05060f', '#3a2050', '#16121e', '#08070c'] }[id];
  let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal[0]); g.addColorStop(0.62, pal[1]); g.addColorStop(1, pal[2]);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.fillStyle = pal[3];
  if (id === 'dust') {
    c.beginPath(); c.moveTo(0, 150); c.lineTo(60, 110); c.lineTo(80, 110); c.lineTo(110, 140); c.lineTo(250, 130); c.lineTo(290, 90); c.lineTo(340, 90); c.lineTo(360, 125); c.lineTo(400, 130); c.lineTo(400, 200); c.lineTo(0, 200); c.fill();
    c.fillStyle = '#ffe0a0'; c.beginPath(); c.arc(320, 55, 18, 0, 7); c.fill();
    c.fillStyle = '#3a2618'; for (let i = 0; i < 6; i++) c.fillRect(140 + i * 18, 150 - (i % 3) * 8, 14, 50);
  } else if (id === 'forest') {
    for (let i = 0; i < 40; i++) { const x = (i * 37) % 420 - 10, h = 50 + ((i * 53) % 60), y = 200 - ((i * 17) % 30); c.beginPath(); c.moveTo(x, y - h); c.lineTo(x - 14, y); c.lineTo(x + 14, y); c.fill(); }
    c.fillStyle = 'rgba(200,200,210,.15)'; c.fillRect(0, 120, 400, 80);
  } else {
    for (let i = 0; i < 14; i++) { const x = i * 30, h = 60 + ((i * 71) % 110); c.fillStyle = '#0c0a14'; c.fillRect(x, 200 - h, 26, h); for (let k = 0; k < 20; k++) { if ((i * 7 + k * 3) % 5 === 0) { c.fillStyle = ['#ffd9a0', '#a0c8ff', '#ff60c0'][k % 3]; c.fillRect(x + 4 + (k % 3) * 7, 200 - h + 8 + Math.floor(k / 3) * 12, 4, 5); } } }
    c.fillStyle = '#ff3080'; c.shadowColor = '#ff3080'; c.shadowBlur = 20; c.fillRect(60, 110, 50, 12); c.fillStyle = '#30c0ff'; c.shadowColor = '#30c0ff'; c.fillRect(250, 90, 40, 10); c.shadowBlur = 0;
    c.strokeStyle = 'rgba(150,170,220,.3)'; for (let i = 0; i < 80; i++) { const x = (i * 97) % 400, y = (i * 61) % 200; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 2, y + 10); c.stroke(); }
  }
  g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.6)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function openMapSel(mode) {
  pending.mode = mode;
  $('mapselTitle').innerHTML = (mode === 'br' ? 'バトルロワイヤル' : 'サバイバル') + ' <small>マップを選択</small>';
  const cards = $('cards'); cards.innerHTML = '';
  for (const id of ['dust', 'forest', 'city']) {
    const M = MAPS[id];
    const d = document.createElement('div'); d.className = 'card' + (pending.map === id ? ' sel' : '');
    const cv = document.createElement('canvas'); mapPreview(cv, id);
    d.appendChild(cv);
    const t = document.createElement('div'); t.className = 't';
    t.innerHTML = `<b>${M.name}</b><i>${M.en}</i><p>${M.desc}${mode === 'pve' ? '<br><span style="color:#ff7060">※サバイバルでは血の月が昇る深夜になります</span>' : ''}</p>`;
    d.appendChild(t);
    d.onclick = () => { pending.map = id; [...cards.children].forEach((c) => c.classList.remove('sel')); d.classList.add('sel'); G.audio.ready && G.audio.sfx_uiClick(); };
    d.ondblclick = () => startGame(pending.mode, pending.map, pending.diff);
    cards.appendChild(d);
  }
  segSet('diffseg', String(pending.diff));
  segSet('viewseg', G.settings.view);
  show('mapsel');
}
function segSet(id, v) { for (const b of $(id).children) b.classList.toggle('on', b.dataset.v === v); }
$('diffseg').onclick = (e) => { if (e.target.dataset.v) { pending.diff = +e.target.dataset.v; G.settings.difficulty = pending.diff; saveSettings(); segSet('diffseg', e.target.dataset.v); } };
$('viewseg').onclick = (e) => { if (e.target.dataset.v) { G.settings.view = e.target.dataset.v; saveSettings(); segSet('viewseg', e.target.dataset.v); } };

// 設定画面
const OPTS = [
  ['sens', 'マウス感度', 0.1, 3, 0.05], ['adsSens', 'エイム時感度', 0.2, 2, 0.05], ['fov', '視野角 (FOV)', 60, 115, 1], ['headBob', '頭の揺れ（酔い対策で0推奨）', 0, 1, 0.05],
  ['cameraShake', '画面シェイク', 0, 1, 0.05], ['invertY', '上下反転', null, null, null, [['オフ', false], ['オン', true]]],
  ['view', 'デフォルト視点', null, null, null, [['一人称', 'fp'], ['三人称', 'tp']]], ['shoulder', '三人称の肩', null, null, null, [['右', 1], ['左', -1]]],
  ['gore', 'ゴア表現', null, null, null, [['オフ', 0], ['標準', 1], ['過激', 2]]], ['quality', '画質', null, null, null, [['低', 0], ['中', 1], ['高', 2], ['最高', 3]]],
  ['aimAssist', 'エイムアシスト（オートエイム）', null, null, null, [['オフ', 0], ['弱', 1], ['強', 2], ['オートロック', 3]]], ['bgm', 'BGM', null, null, null, [['オフ', false], ['オン', true]]],
  ['master', 'マスター音量', 0, 1, 0.05], ['music', 'BGM音量', 0, 1, 0.05], ['sfx', '効果音音量', 0, 1, 0.05], ['showFps', 'FPS表示', null, null, null, [['オフ', false], ['オン', true]]],
];
function buildSettings() {
  const box = $('opts'); box.innerHTML = '';
  for (const [k, label, mn, mx, st, choices] of OPTS) {
    const row = document.createElement('div'); row.className = 'opt';
    row.innerHTML = `<span>${label}</span>`;
    if (choices) {
      const seg = document.createElement('div'); seg.className = 'seg'; seg.style.margin = 0;
      for (const [n, v] of choices) {
        const b = document.createElement('button'); b.textContent = n; if (G.settings[k] === v) b.classList.add('on');
        b.onclick = () => { G.settings[k] = v; saveSettings(); [...seg.children].forEach((x) => x.classList.remove('on')); b.classList.add('on'); applySetting(k); };
        seg.appendChild(b);
      }
      row.appendChild(seg);
    } else {
      const wrap = document.createElement('div'); wrap.style.display = 'flex'; wrap.style.alignItems = 'center'; wrap.style.gap = '8px';
      const r = document.createElement('input'); r.type = 'range'; r.min = mn; r.max = mx; r.step = st; r.value = G.settings[k];
      const o = document.createElement('output'); o.textContent = (+G.settings[k]).toFixed(st < 1 ? 2 : 0);
      r.oninput = () => { G.settings[k] = +r.value; o.textContent = (+r.value).toFixed(st < 1 ? 2 : 0); saveSettings(); applySetting(k); };
      wrap.append(r, o); row.appendChild(wrap);
    }
    box.appendChild(row);
  }
}
function applySetting(k) {
  if (['master', 'music', 'sfx'].includes(k)) G.audio.applyVolumes();
  if (k === 'bgm' && state !== 'menu' && !G.audio.forced) G.audio.fadeMusic(G.settings.bgm ? 1 : 0, 1);
  if (k === 'quality') { engine.buildComposer(); G.vfx.resize(); }
  if (k === 'view' && G.player) G.player.view = G.settings.view;
  if (k === 'showFps') $('fps').classList.toggle('hidden', !G.settings.showFps);
}

let panelReturn = 'menu';
function openAdmin() { Admin.buildPanel($('adminopts')); show('adminlogin', false); show('pause', false); show('adminpanel'); }
G.ui.openAdmin = () => { if (state !== 'play' || !G.admin.on) return; panelReturn = 'pause'; openAdmin(); };
function adminLogin() {
  if (Admin.login($('adminpw').value)) { G.audio.ready && G.audio.sfx_uiClick(); openAdmin(); G.hud.toast && G.hud.toast('管理者モード有効'); }
  else { $('adminmsg').textContent = 'パスワードが違います'; $('adminpw').value = ''; }
}
$('adminpw').addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') adminLogin(); });
$('adminpw').addEventListener('keyup', (e) => e.stopPropagation());
Admin.refreshBadge();
document.addEventListener('click', (e) => {
  G.audio.init();
  if (G.audio.pendingTrack) { G.audio.setMusic(G.audio.pendingTrack, G.audio.pendingForce); G.audio.pendingTrack = null; }
  const b = e.target.closest('[data-act]');
  if (!b) return;
  G.audio.ready && G.audio.sfx_uiClick();
  const act = b.dataset.act;
  if (act === 'br' || act === 'pve') openMapSel(act);
  else if (act === 'range') startGame('range', 'range', 1);
  else if (act === 'settings') { panelReturn = state === 'play' ? 'pause' : 'menu'; show('pause', false); buildSettings(); openPanel('settings'); }
  else if (act === 'controls') { panelReturn = state === 'play' ? 'pause' : 'menu'; show('pause', false); openPanel('controls'); }
  else if (act === 'back') { ['mapsel', 'settings', 'controls', 'adminlogin'].forEach((i) => show(i, false)); if (panelReturn === 'pause' && state === 'play') show('pause'); panelReturn = 'menu'; }
  else if (act === 'go') startGame(pending.mode, pending.map, pending.diff);
  else if (act === 'resume') { G.input.lock(); }
  else if (act === 'quit') { toMenu(); }
  else if (act === 'admin') { panelReturn = state === 'play' ? 'pause' : 'menu'; show('pause', false); if (G.admin.on) openAdmin(); else { show('adminlogin'); $('adminmsg').textContent = ''; $('adminpw').value = ''; setTimeout(() => $('adminpw').focus(), 50); } }
  else if (act === 'adminLogin') adminLogin();
  else if (act === 'adminClose') { show('adminpanel', false); if (panelReturn === 'pause' && state === 'play') show('pause'); }
  else if (act === 'adminLogout') { Admin.logout(); Admin.resetRuntime(); Admin.refreshBadge(); show('adminpanel', false); if (panelReturn === 'pause' && state === 'play') show('pause'); }
  else if (act === 'adminAct') { Admin.action(b.dataset.v); if (state === 'play') { show('adminpanel', false); G.input.lock(); } }
  else if (act === 'again' && lastStart) startGame(lastStart.mode, lastStart.mapId, lastStart.diff);
});
document.addEventListener('mouseover', (e) => { const b = e.target.closest('.mbtn, .card'); if (b && b !== G._hov) { G._hov = b; G.audio.ready && G.audio.sfx_uiHover(); } });
$('clickstart').addEventListener('click', (e) => { e.stopPropagation(); beginPlay(); });
addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && state === 'menu') ['mapsel', 'settings', 'controls'].forEach((i) => show(i, false));
});
$('game').addEventListener('click', () => { if (state === 'play' && !G.input.locked && $('pause').classList.contains('hidden')) G.input.lock(); });

async function toMenu() {
  G.running = false; G.paused = false;
  ['pause', 'results', 'settings', 'controls', 'clickstart'].forEach((i) => show(i, false));
  G.hud.show(false);
  G.input.unlock();
  state = 'loading';
  show('loading'); $('loading').querySelector('.tip').textContent = '';
  await nextFrame();
  await buildMenuScene();
  show('loading', false);
  show('menu');
  state = 'menu';
  G.audio.setMusic('menu', true);
}

// 起動
(async () => {
  show('menu', false); show('loading'); $('loading').querySelector('.tip').textContent = 'シェーダーとワールドを構築中…';
  $('loading').querySelector('b').style.width = '40%';
  await nextFrame();
  await buildMenuScene();
  G.vfx.resize();
  show('loading', false); show('menu');
  state = 'menu';
  G.audio.setMusic('menu', true);
  window.__G = G; // デバッグ用
  window.__state = () => state;
  window.__sim = (sec) => { const t0 = performance.now(); const n = Math.round(sec * 60); for (let i = 0; i < n; i++) { update(1 / 60); G.input.endFrame(); } return performance.now() - t0; };
  window.__info = () => ({ calls: G.renderer.info.render.calls, tris: G.renderer.info.render.triangles, geos: G.renderer.info.memory.geometries, tex: G.renderer.info.memory.textures });
  // テスト用フック
  window.__start = (m, map, d = 1) => startGame(m, map, d).then(() => { beginPlay(); G.paused = false; });
})();
