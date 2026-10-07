// ===== Entry: renderer, loop, menus =====
import * as THREE from 'three';
import { World } from './world.js';
import { Post } from './post.js';
import { CameraRig, CAM_MODES } from './camera.js';
import { Input } from './input.js';
import { AudioSys } from './audio.js';
import { VFX } from './vfx.js';
import { HUD } from './hud.js';
import { Game, fmtTime } from '../game.js';
import { PLAYER_CARS } from './car.js';
import { clamp, lerp } from './util.js';

const $ = (id) => document.getElementById(id);
const DEFAULTS = { camMode: 0, fov: 65, shake: 0, speedFx: true, centerDot: false, cinematic: true, voice: true, quality: 1, master: 0.8, music: 0.6, sfx: 0.9 };
let settings = { ...DEFAULTS };
try { const s = JSON.parse(localStorage.getItem('redline-settings') || '{}'); settings = { ...DEFAULTS, ...s }; } catch (e) { /* ignore */ }
const saveSettings = () => { try { localStorage.setItem('redline-settings', JSON.stringify(settings)); } catch (e) { /* ignore */ } };

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', stencil: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.62;
renderer.outputColorSpace = THREE.SRGBColorSpace;
$('app').prepend(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 14000);
camera.position.set(0, 80, 300);

const world = new World(renderer, scene);
const input = new Input();
const audio = new AudioSys();
audio.settings = settings;
const vfx = new VFX(scene);
const hud = new HUD();
const rig = new CameraRig(camera, world, settings);
let post = null;
let game = null;
let app = 'loading'; // loading | title | menu | garage | game | paused | result
let selMode = 'race', selCar = 0;

function applyQuality() {
  const q = settings.quality;
  const dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(q === 0 ? Math.min(dpr, 1) * 0.75 : q === 1 ? Math.min(dpr, 1.25) : Math.min(dpr, 2));
  renderer.shadowMap.enabled = true;
  if (world.sunLight) {
    const ms = q === 0 ? 1024 : 2048;
    if (world.sunLight.shadow.mapSize.x !== ms) { world.sunLight.shadow.mapSize.set(ms, ms); if (world.sunLight.shadow.map) { world.sunLight.shadow.map.dispose(); world.sunLight.shadow.map = null; } }
  }
  if (post) {
    post.setQuality(q);
    const samples = q === 0 ? 0 : 4;
    for (const rt of [post.composer.renderTarget1, post.composer.renderTarget2]) { if (rt.samples !== samples) { rt.samples = samples; rt.dispose(); } }
    onResize();
  }
}
function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  if (post) { post.composer.setPixelRatio(renderer.getPixelRatio()); post.setSize(w, h); }
}
window.addEventListener('resize', onResize);

// ---------- boot ----------
async function boot() {
  const bar = $('load-bar'), txt = $('load-text');
  await world.build((p, t) => { bar.style.width = `${Math.round(p * 100)}%`; txt.textContent = t; });
  post = new Post(renderer, scene, camera);
  applyQuality();
  game = new Game({ renderer, scene, camera, world, audio, input, settings, rig, vfx, hud });
  game.onResult = showResult;
  window.__rp = { game, rig, world, camera, post, input, settings, renderer, scene };
  // warm up: start demo so materials compile
  game.start('demo');
  for (let i = 0; i < 3; i++) { game.update(1 / 60); }
  renderer.compile(scene, camera);
  bar.style.width = '100%'; txt.textContent = '準備完了';
  await new Promise((r) => setTimeout(r, 250));
  $('loading').classList.add('hidden');
  $('title').classList.remove('hidden');
  app = 'title';
  demoShotT = 0;
  requestAnimationFrame(loop);
}

// ---------- demo camera ----------
let demoShot = -1, demoShotT = 0;
function demoCamera(dt) {
  demoShotT -= dt;
  const car = game.player;
  if (!car) return;
  if (demoShotT <= 0 || (rig.cine && rig.cine.type === 'side' && rig.cine.px !== undefined && car.pos.distanceTo(new THREE.Vector3(rig.cine.px, rig.cine.py, rig.cine.pz)) > 140)) {
    demoShot = (demoShot + 1) % 5; demoShotT = 5.5 + Math.random() * 2;
    const fx = car.vel.x / (car.speed || 1), fz = car.vel.y / (car.speed || 1);
    if (demoShot === 0) { rig.endCine(); rig.setMode(1); }
    else if (demoShot === 1) rig.startCine({ type: 'orbit', target: () => car.pos, r: 7, h: 1.3, speed: 0.3, a0: Math.random() * 6 });
    else if (demoShot === 2) {
      const px = car.pos.x + fx * 70 + -fz * 9, pz = car.pos.z + fz * 70 + fx * 9;
      rig.startCine({ type: 'side', target: () => car.pos, px, pz, py: world.heightAt(px, pz) + 1.2 });
    } else if (demoShot === 3) rig.startCine({ type: 'orbit', target: () => car.pos, r: 34, h: 16, speed: 0.07, a0: car.yaw + Math.PI, ly: 0 });
    else { rig.endCine(); rig.setMode(0); }
  }
}

// ---------- main loop ----------
let last = performance.now(), time = 0;
const center = new THREE.Vector3();
let nitroFx = 0;
let perfT = 0, perfN = 0, perfChecked = false;
function loop(now) {
  requestAnimationFrame(loop);
  const rawDt = (now - last) / 1000;
  let dt = Math.min(0.05, rawDt); last = now;
  if (app === 'game' && !perfChecked && game.state === 'playing') {
    perfT += rawDt; perfN++;
    if (perfT > 8) {
      perfChecked = true;
      const fps = perfN / perfT;
      if (fps < 38 && settings.quality > 0) { settings.quality--; applyQuality(); saveSettings(); game.notify('画質を自動調整', `平均 ${Math.round(fps)} FPS → 品質「${['低', '中', '高'][settings.quality]}」`, '#aaaaaa'); }
    }
  }
  time += dt;
  input.pollPad();
  handleGlobalKeys();
  const sh = $('sound-hint'); const needHint = audio.ready && audio.ctx.state === 'suspended'; if (sh.classList.contains('hidden') === needHint) sh.classList.toggle('hidden', !needHint);
  if (app === 'game' || app === 'result' || app === 'title' || app === 'menu') {
    game.update(dt);
  }
  if (app === 'game' && game.state !== 'ending' && game.state !== 'result') {
    rig.lookBack = input.k('KeyV', 'PadDown');
  } else rig.lookBack = false;
  if ((app === 'title' || app === 'menu') && game.demo) demoCamera(dt);
  if (app === 'garage') garageSpin(dt);
  const pl = game.player;
  rig.update(dt, app === 'garage' ? null : pl, time);
  if (app === 'game' || app === 'paused' || app === 'result') hud.update(dt, game, camera, world, settings);
  // sun follows camera focus
  if (pl) center.copy(pl.pos); else center.copy(camera.position);
  world.updateSun(center);
  world.update(dt, time);
  vfx.update(app === 'paused' ? 0 : dt * (game.timeScale || 1));
  vfx.setScale(renderer.domElement.height / (2 * Math.tan((camera.fov * Math.PI) / 360)));
  // post fx uniforms
  const u = post.u;
  const inGame = app === 'game' && pl && !game.demo;
  const sp = inGame ? pl.speed : 0;
  u.uSpeed.value = lerp(u.uSpeed.value, settings.speedFx && inGame ? clamp((sp - 35) / 55, 0, 1) * (rig.mode === 'cockpit' || rig.mode === 'hood' ? 0.6 : 1) : 0, 0.1);
  u.uBlur.value = settings.speedFx ? 1 : 0;
  nitroFx = lerp(nitroFx, inGame && pl.nitroActive ? 1 : 0, 0.12);
  u.uNitro.value = nitroFx;
  const low = inGame && pl.health < 0.25 ? 0.25 + Math.sin(time * 6) * 0.15 : 0;
  u.uDamage.value = inGame ? Math.max(hud.dmgFlash * 0.8, low) : 0;
  const sg = inGame && game.sirenGlow;
  u.uSiren.value.set(sg ? sg.r : 0, sg ? sg.b : 0, sg ? sg.a : 0);
  post.draw(dt);
  input.endFrame();
}

function handleGlobalKeys() {
  const scr = visibleScreen();
  if (app === 'title') {
    if (input.hit('Enter', 'Space', 'PadA', 'PadB', 'PadX', 'PadY', 'PadStart')) enterMenu();
    return;
  }
  if (app === 'game') {
    if (input.hit('KeyC', 'PadY')) { const m = rig.cycle(); settings.camMode = rig.modeIndex; saveSettings(); hud.camLabel(m.label); }
    if (input.hit('Escape', 'KeyP', 'PadStart') && game.state !== 'ending') pause(true);
    if (input.hit('KeyM')) { settings.music = settings.music > 0 ? 0 : 0.6; audio.applyVolumes(); }
    return;
  }
  if (!scr) return;
  if (scr === 'garage') {
    if (input.hit('ArrowLeft', 'KeyA', 'NavLeft', 'PadLB')) { setNavMode(); selectCar(selCar - 1); }
    if (input.hit('ArrowRight', 'KeyD', 'NavRight', 'PadRB')) { setNavMode(); selectCar(selCar + 1); }
  }
  if (app === 'paused' && scr === 'pause' && input.hit('KeyP', 'PadStart')) { pause(false); return; }
  menuNav(scr);
}

// ---------- menu navigation (keyboard arrows / gamepad D-pad & stick) ----------
const navIdx = {};
let navMode = false;
function setNavMode() { if (!navMode) { navMode = true; document.body.classList.add('nav-mode'); } }
window.addEventListener('mousemove', (e) => { if (navMode && (Math.abs(e.movementX) + Math.abs(e.movementY) > 2)) { navMode = false; document.body.classList.remove('nav-mode'); } });
function visibleScreen() {
  for (const id of ['settings', 'controls', 'pause', 'result', 'garage', 'menu', 'title']) if (!$(id).classList.contains('hidden')) return id;
  return null;
}
function focusables(scr) {
  const root = $(scr);
  let els = [...root.querySelectorAll('button, input[type=range]')].filter((e) => e.offsetParent !== null && !e.disabled);
  if (scr === 'garage') els = els.filter((e) => e.id === 'btn-start' || e.id === 'btn-garage-back');
  return els;
}
const DEFAULT_FOCUS = { result: 'btn-retry', garage: 'btn-start', pause: 'btn-resume', controls: 'btn-controls-back' };
const BACK = {
  settings: () => closeSettings(),
  controls: () => { show('menu'); audio.click(); },
  pause: () => pause(false),
  result: () => backToMenu(),
  garage: () => backToMenu(),
};
function menuNav(scr) {
  const els = focusables(scr);
  if (!els.length) return;
  let i = navIdx[scr];
  if (i === undefined || i >= els.length) { const d = DEFAULT_FOCUS[scr]; i = Math.max(0, d ? els.findIndex((e) => e.id === d) : 0); }
  let cur = els[i];
  for (const d of ['Up', 'Down', 'Left', 'Right']) {
    const keys = scr === 'garage' ? ['Nav' + d, 'Arrow' + d].filter((k) => !/Left|Right/.test(k)) : ['Nav' + d, 'Arrow' + d];
    if (!input.hit(...keys)) continue;
    setNavMode();
    if (cur.type === 'range' && (d === 'Left' || d === 'Right')) {
      const step = parseFloat(cur.step) * (parseFloat(cur.max) > 1 ? 1 : 1);
      cur.value = Math.min(parseFloat(cur.max), Math.max(parseFloat(cur.min), parseFloat(cur.value) + (d === 'Right' ? step : -step)));
      cur.dispatchEvent(new Event('input'));
      continue;
    }
    const j = spatialMove(els, i, d);
    if (j === i && (d === 'Up' || d === 'Down')) { const pnl = $(scr).querySelector('.panel'); if (pnl) pnl.scrollBy({ top: d === 'Down' ? 120 : -120, behavior: 'smooth' }); }
    if (j !== i) { i = j; cur = els[i]; audio.hover(); cur.scrollIntoView({ block: 'nearest' }); }
  }
  navIdx[scr] = i;
  if (input.hit('PadA', 'Enter')) {
    setNavMode();
    if (cur.type !== 'range') { cur.click(); const again = focusables(scr); if (again.length && navIdx[scr] >= again.length) navIdx[scr] = 0; }
  } else if (input.hit('PadB', 'Escape') && BACK[scr]) BACK[scr]();
  // highlight
  document.querySelectorAll('.pad-focus').forEach((e) => { if (e !== cur) e.classList.remove('pad-focus'); });
  const nowScr = visibleScreen();
  if (nowScr === scr) cur.classList.add('pad-focus');
}
function spatialMove(els, i, dir) {
  const r0 = els[i].getBoundingClientRect();
  const cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
  let best = i, bs = Infinity;
  els.forEach((e, j) => {
    if (j === i) return;
    const r = e.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const dx = x - cx, dy = y - cy;
    let main, off;
    // gap between rects on the cross axis (0 when they overlap)
    const gapX = Math.max(0, Math.max(r.left, r0.left) - Math.min(r.right, r0.right));
    const gapY = Math.max(0, Math.max(r.top, r0.top) - Math.min(r.bottom, r0.bottom));
    if (dir === 'Up') { main = -dy; off = gapX; } else if (dir === 'Down') { main = dy; off = gapX; }
    else if (dir === 'Left') { main = -dx; off = gapY; } else { main = dx; off = gapY; }
    if (main <= 4) return;
    // vertical moves: prefer rows (ignore horizontal offset mostly); horizontal: stay on same row
    const score = dir === 'Up' || dir === 'Down' ? main + off * 0.3 : main + off * 3;
    if ((dir === 'Left' || dir === 'Right') && off > 0) return;
    if (score < bs) { bs = score; best = j; }
  });
  if (best === i && (dir === 'Up' || dir === 'Down')) {
    // wrap around
    const sorted = els.map((e, j) => ({ j, y: e.getBoundingClientRect().top })).sort((a, b) => a.y - b.y);
    best = dir === 'Down' ? sorted[0].j : sorted[sorted.length - 1].j;
  }
  return best;
}
document.addEventListener('mouseover', (e) => {
  const b = e.target.closest && e.target.closest('button, input[type=range]');
  if (!b) return;
  const scr = visibleScreen(); if (!scr) return;
  const j = focusables(scr).indexOf(b); if (j >= 0) navIdx[scr] = j;
});
// mouse clicks shouldn't leave DOM focus on buttons (avoids double activation with Enter)
document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('button'); if (b) b.blur(); });
document.addEventListener('pointerup', (e) => { const r = e.target.closest && e.target.closest('input[type=range]'); if (r) r.blur(); });
// audio unlock: gamepad input alone may not count as a user gesture in browsers
const unlockAudio = () => { if (audio.ready && audio.ctx.state === 'suspended') audio.ctx.resume(); };
window.addEventListener('pointerdown', unlockAudio);
window.addEventListener('keydown', unlockAudio);
window.addEventListener('gamepadconnected', (e) => { const g = $('pad-badge'); g.textContent = '🎮 ゲームパッド接続: 十字キー/スティックで選択・Aで決定・Bで戻る'; g.classList.remove('hidden'); g.classList.remove('rfade'); void g.offsetWidth; g.classList.add('rfade'); });

// ---------- UI flow ----------
function show(id) { for (const p of ['title', 'menu', 'garage', 'pause', 'result', 'settings', 'controls']) $(p).classList.toggle('hidden', p !== id); if (id) delete navIdx[id]; document.querySelectorAll('.pad-focus').forEach((e) => e.classList.remove('pad-focus')); }
function enterMenu() {
  audio.init();
  audio.settings = settings; audio.applyVolumes();
  if (audio.music) { audio.music.start(); audio.music.setLevel(0); }
  audio.click();
  app = 'menu'; show('menu');
  if (!game.demo) { game.start('demo'); demoShotT = 0; }
}
function backToMenu() {
  audio.click();
  hud.show(false);
  app = 'menu'; show('menu');
  game.start('demo'); demoShotT = 0;
  if (audio.music) audio.music.setLevel(0);
  audio.silence();
}

let garageCar = null, garageA = 0;
function enterGarage(mode) {
  selMode = mode; audio.click();
  app = 'garage'; show('garage');
  $('garage-mode').textContent = { race: 'HOT PURSUIT RACE', cop: 'INTERCEPTOR', free: 'FREE RUN' }[mode];
  $('garage-sub').textContent = { race: 'レーサーとして参戦。追ってくる警察を振り切り1位でゴールせよ。', cop: '警察として出動。違法レーサー4台を全員摘発せよ。', free: '広大なマップを自由に走行。パトロールに見つかったら逃げ切れ。' }[mode];
  game.clear();
  audio.silence();
  selectCar(selCar);
}
function selectCar(i) {
  selCar = (i + PLAYER_CARS.length) % PLAYER_CARS.length;
  if (garageCar) { game.removeCar(garageCar); }
  const spec = PLAYER_CARS[selCar];
  garageCar = game.addCar(spec, { role: 'player', police: selMode === 'cop' });
  garageCar.place(0, 180, 0.6, 0);
  garageCar.sirenOn = true;
  game.player = null;
  $('car-name').textContent = (selMode === 'cop' ? 'POLICE ' : '') + spec.name;
  $('car-desc').textContent = spec.desc;
  const stats = [['最高速', spec.top / 96], ['加速', spec.accel / 19], ['ハンドリング', (spec.grip * spec.steer) / 9.5], ['耐久・体当たり', spec.armor * spec.mass / 2.2]];
  $('car-stats').innerHTML = stats.map(([n, v]) => `<div class="st"><span>${n}</span><div class="sb"><i style="width:${Math.round(clamp(v, 0.1, 1) * 100)}%"></i></div></div>`).join('') + `<div class="st topspeed"><span>TOP SPEED</span><b>${Math.round(spec.top * 3.6)} km/h</b></div>`;
  $('car-idx').textContent = `${selCar + 1} / ${PLAYER_CARS.length}`;
  audio.hover();
}
function garageSpin(dt) {
  garageA += dt * 0.25;
  if (garageCar) {
    garageCar.syncVisual(dt, time);
    const p = garageCar.pos;
    const r = 7.2;
    camera.position.set(p.x + Math.sin(garageA) * r, p.y + 1.5 + Math.sin(garageA * 0.7) * 0.4, p.z + Math.cos(garageA) * r);
    camera.lookAt(p.x, p.y + 0.6, p.z);
    if (camera.fov !== 50) { camera.fov = 50; camera.updateProjectionMatrix(); }
    game.headlight.intensity = 60;
    const fx = Math.sin(garageCar.yaw), fz = Math.cos(garageCar.yaw);
    game.headlight.position.set(p.x + fx * 2.2, p.y + 0.8, p.z + fz * 2.2);
    game.headlight.target.position.set(p.x + fx * 30, p.y - 1, p.z + fz * 30);
    if (garageCar.police) {
      const L = game.copLights; L[0].position.set(p.x, p.y + 2, p.z); L[1].position.copy(L[0].position);
      L[0].intensity = garageCar.flashA ? 30 : 0; L[1].intensity = garageCar.flashB ? 40 : 0;
    }
  }
}
function startGame() {
  audio.click();
  garageCar = null;
  show(null);
  hud.show(true);
  app = 'game';
  game.start(selMode, selCar);
  rig.setMode(settings.camMode || 0);
  hud.camLabel(CAM_MODES[rig.modeIndex].label);
}
function pause(p) {
  if (p) { app = 'paused'; show('pause'); audio.silence(); audio.click(); }
  else { app = 'game'; show(null); audio.click(); }
}
function showResult(r) {
  if (app !== 'game') return;
  app = 'result'; show('result');
  const title = { finish: r.place === 1 ? 'VICTORY' : `${r.place}位 フィニッシュ`, busted: 'BUSTED', wrecked: 'WRECKED', wrecked_cop: 'WRECKED', cop_done: 'EVENT COMPLETE' }[r.reason] || 'RESULT';
  const good = r.reason === 'finish' || r.reason === 'cop_done';
  $('res-title').textContent = title;
  $('res-title').className = good ? 'good' : 'bad';
  const rows = [];
  if (selMode === 'race') { rows.push(['順位', r.reason === 'finish' ? `${r.place} / 4` : 'リタイア'], ['タイム', fmtTime(r.time)]); }
  if (selMode === 'cop') { rows.push(['摘発', `${r.busted} / 4`], ['逃走されたレーサー', r.escaped], ['タイム', fmtTime(r.time)]); const medal = r.busted >= 4 ? 'GOLD' : r.busted >= 3 ? 'SILVER' : r.busted >= 2 ? 'BRONZE' : '-'; rows.push(['評価', medal]); }
  if (selMode === 'free') { rows.push(['バウンティ', r.bounty.toLocaleString()], ['逃走成功', r.escapes], ['走行時間', fmtTime(r.time)], ['最大ヒート', r.heat]); }
  rows.push(['テイクダウン', r.takedowns], ['最高速度', `${Math.round(r.maxSpeed)} km/h`]);
  $('res-rows').innerHTML = rows.map(([a, b]) => `<div class="rr"><span>${a}</span><b>${b}</b></div>`).join('');
}

// ---------- settings UI ----------
function buildSettings() {
  const el = $('settings-body');
  const opts = [
    { k: 'camMode', label: '初期視点', type: 'sel', vals: CAM_MODES.map((m, i) => [i, m.label]) },
    { k: 'fov', label: '視野角 (FOV)', type: 'range', min: 55, max: 90, step: 1 },
    { k: 'shake', label: 'カメラ揺れ', type: 'sel', vals: [[0, 'OFF'], [1, '弱'], [2, '強']] },
    { k: 'speedFx', label: 'スピードエフェクト (ブラー/FOV変化)', type: 'bool' },
    { k: 'centerDot', label: '酔い止めセンタードット', type: 'bool' },
    { k: 'cinematic', label: 'テイクダウン演出 (スローモーション)', type: 'bool' },
    { k: 'voice', label: '警察無線ボイス (英語)', type: 'bool' },
    { k: 'quality', label: 'グラフィック品質', type: 'sel', vals: [[0, '低'], [1, '中'], [2, '高']] },
    { k: 'master', label: 'マスター音量', type: 'range', min: 0, max: 1, step: 0.05 },
    { k: 'music', label: 'BGM音量', type: 'range', min: 0, max: 1, step: 0.05 },
    { k: 'sfx', label: '効果音音量', type: 'range', min: 0, max: 1, step: 0.05 },
  ];
  el.innerHTML = '';
  for (const o of opts) {
    const row = document.createElement('div'); row.className = 'set-row';
    const lab = document.createElement('label'); lab.textContent = o.label; row.appendChild(lab);
    let ctl;
    if (o.type === 'bool') {
      ctl = document.createElement('button'); ctl.className = 'tog';
      const upd = () => { ctl.textContent = settings[o.k] ? 'ON' : 'OFF'; ctl.classList.toggle('on', !!settings[o.k]); };
      ctl.onclick = () => { settings[o.k] = !settings[o.k]; upd(); changed(o.k); };
      upd();
    } else if (o.type === 'sel') {
      ctl = document.createElement('div'); ctl.className = 'segs';
      for (const [v, t] of o.vals) {
        const b = document.createElement('button'); b.textContent = t; b.classList.toggle('on', settings[o.k] === v);
        b.onclick = () => { settings[o.k] = v; [...ctl.children].forEach((c) => c.classList.remove('on')); b.classList.add('on'); changed(o.k); };
        ctl.appendChild(b);
      }
    } else {
      ctl = document.createElement('div'); ctl.className = 'rng';
      const r = document.createElement('input'); r.type = 'range'; r.min = o.min; r.max = o.max; r.step = o.step; r.value = settings[o.k];
      const val = document.createElement('span'); val.textContent = o.max > 1 ? settings[o.k] : Math.round(settings[o.k] * 100) + '%';
      r.oninput = () => { settings[o.k] = parseFloat(r.value); val.textContent = o.max > 1 ? r.value : Math.round(r.value * 100) + '%'; changed(o.k); };
      ctl.append(r, val);
    }
    row.appendChild(ctl); el.appendChild(row);
  }
}
function changed(k) {
  saveSettings();
  audio.settings = settings; audio.applyVolumes();
  if (k === 'quality') applyQuality();
  if (k === 'camMode' && app !== 'game') rig.setMode(settings.camMode);
  audio.click();
}
let settingsReturn = 'menu';
function openSettings(from) { settingsReturn = from; buildSettings(); show('settings'); audio.click(); }
function closeSettings() { show(settingsReturn); audio.click(); }

// buttons
document.querySelectorAll('[data-mode]').forEach((b) => { b.onclick = () => enterGarage(b.dataset.mode); b.onmouseenter = () => audio.hover(); });
document.querySelectorAll('button').forEach((b) => b.addEventListener('mouseenter', () => audio.hover()));
$('title').onclick = () => enterMenu();
$('btn-settings').onclick = () => openSettings('menu');
$('btn-controls').onclick = () => { show('controls'); audio.click(); };
$('btn-controls-back').onclick = () => { show('menu'); audio.click(); };
$('btn-settings-back').onclick = () => closeSettings();
$('car-prev').onclick = () => selectCar(selCar - 1);
$('car-next').onclick = () => selectCar(selCar + 1);
$('btn-start').onclick = () => startGame();
$('btn-garage-back').onclick = () => backToMenu();
$('btn-resume').onclick = () => pause(false);
$('btn-restart').onclick = () => startGame();
$('btn-pause-settings').onclick = () => openSettings('pause');
$('btn-quit').onclick = () => backToMenu();
$('btn-retry').onclick = () => startGame();
$('btn-res-menu').onclick = () => backToMenu();

boot().catch((e) => { console.error(e); $('load-text').textContent = 'エラー: ' + e.message; });
