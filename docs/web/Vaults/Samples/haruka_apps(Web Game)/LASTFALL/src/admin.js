// 管理者モード（チート機能）
import * as THREE from 'three';
import { G } from './state.js';
import { WEAPONS } from './weapons.js';
import { traceShot } from './combat.js';
import { angleDiff } from './util.js';

const KEY = 'lastfall_admin';
const DEF = {
  on: false, god: true, ammo: true, explosive: false, norecoil: false, onehit: false, esp: false, freeze: false, zone: false,
  speed: 1, jump: 1, rof: 1, timescale: 1,
};
export const A = { ...DEF };
try { const raw = localStorage.getItem(KEY); if (raw) Object.assign(A, JSON.parse(raw)); } catch (e) { /* ignore */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(A)); } catch (e) { /* ignore */ } }
G.admin = A;

export const on = (k) => A.on && !!A[k];
export const mul = (k) => (A.on ? A[k] || 1 : 1);

export function login(pw) {
  if (pw !== 'admin') return false;
  A.on = true; save(); return true;
}
export function logout() { A.on = false; save(); }

// ---- 殲滅：近い敵から順番に、自動で照準を合わせて撃ち抜く ----
let annihilate = null;
export function startAnnihilate() {
  if (!A.on || !G.player || !G.player.actor.alive) return;
  const n = enemies().length;
  if (!n) { G.hud.toast('敵がいません'); return; }
  annihilate = { phase: 'pick', t: 0, total: n, done: 0, target: null };
  G.hud.bigMessage('殲滅開始', `${n} 体を近い順に排除する`);
  G.audio.play('wave');
}
function enemies() {
  const P = G.player.actor;
  return G.actors.filter((a) => a.alive && a !== P && a.team !== P.team && !a.dropState && a.dummy === undefined);
}
function laser(from, to) {
  const d = new THREE.Vector3().subVectors(to, from); const L = d.length();
  const g = new THREE.CylinderGeometry(0.035, 0.035, L, 6, 1, true); g.translate(0, L / 2, 0); g.rotateX(Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color(9, 2.2, 0.8), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.position.copy(from); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.normalize()); m.frustumCulled = false;
  G.scene.add(m);
  let life = 0.18;
  const fade = () => { life -= 0.016; m.material.opacity = Math.max(0, life / 0.18); m.scale.x = m.scale.y = 1 + (0.18 - life) * 10; if (life > 0) requestAnimationFrame(fade); else { G.scene.remove(m); g.dispose(); m.material.dispose(); } };
  fade();
}
function headPoint(e) { const p = e.center(); p.y += (e.isMonster ? 0.62 : 0.72) * e.scale * (1 - e.crouch * 0.3); return p; }
function annihilateUpdate(dt) {
  const S = annihilate, P = G.player.actor, pl = G.player;
  if (!P.alive) { annihilate = null; return; }
  S.t -= dt;
  if (S.phase === 'pick') {
    const list = enemies();
    if (!list.length) {
      annihilate = null;
      G.hud.bigMessage('殲滅完了', `${S.done} 体を排除`);
      G.audio.play('victory');
      G.engine.final.uniforms.uKill.value = 1;
      return;
    }
    let best = null, bd = 1e9;
    for (const e of list) { const d = e.pos.distanceTo(P.pos); if (d < bd) { bd = d; best = e; } }
    const e0 = P.eyePos(new THREE.Vector3()), hp = headPoint(best);
    const dx = hp.x - e0.x, dy = hp.y - e0.y, dz = hp.z - e0.z;
    const yawT = P.yaw + angleDiff(P.yaw, Math.atan2(-dx, -dz));
    // 振り向く角度に応じて照準時間を変える（近い＝素早く、背後＝ゆっくり回す）
    const turn = Math.abs(yawT - P.yaw);
    S.target = best; S.phase = 'aim'; S.t = S.dur = Math.min(0.32, 0.09 + turn * 0.07);
    S.y0 = P.yaw; S.p0 = P.pitch; S.y1 = yawT; S.p1 = Math.atan2(dy, Math.hypot(dx, dz));
  } else if (S.phase === 'aim') {
    const e = S.target;
    if (!e.alive) { S.phase = 'pick'; return; }
    // 動く敵を追いながら滑らかに照準
    const e0 = P.eyePos(new THREE.Vector3()), hp = headPoint(e);
    const dx = hp.x - e0.x, dy = hp.y - e0.y, dz = hp.z - e0.z;
    S.y1 = S.y0 + angleDiff(S.y0, Math.atan2(-dx, -dz)); S.p1 = Math.atan2(dy, Math.hypot(dx, dz));
    const k = 1 - Math.max(0, S.t) / S.dur, ek = 1 - Math.pow(1 - k, 3);
    P.yaw = S.y0 + (S.y1 - S.y0) * ek; P.pitch = S.p0 + (S.p1 - S.p0) * ek;
    if (S.t <= 0) {
      // 発砲
      const from = new THREE.Vector3(); P.muzzlePos(from);
      if (pl.view === 'fp') { from.copy(e0).addScaledVector(new THREE.Vector3(-Math.sin(P.yaw), 0, -Math.cos(P.yaw)), 0.6); from.y -= 0.1; }
      const dir = new THREE.Vector3().subVectors(hp, e0).normalize();
      laser(from, hp);
      G.vfx.tracer(from, hp, 900);
      if (pl.view !== 'fp') G.vfx.muzzle(from, dir, true, true);
      pl.vm.fire(); P.recoil = 1;
      G.audio.play('gun', null, { type: 'sniper', self: true, vol: 0.8 });
      G.engine.addShake(0.12);
      e.takeDamage({ amount: 1e6, part: 'head', dir, point: hp, attacker: P, weapon: { type: 'sniper', name: '殲滅' }, dist: e.pos.distanceTo(P.pos) });
      G.vfx.blood(hp, dir, 160, { monster: e.isMonster });
      G.hud.hitmarker(true, true);
      S.done++;
      G.hud.toast(`殲滅 ${S.done} / ${S.done + enemies().length}`);
      S.phase = 'recover'; S.t = 0.16;
    }
  } else if (S.phase === 'recover') {
    if (S.t <= 0) S.phase = 'pick';
  }
}

// ---- 毎フレーム ----
const espEls = [];
export function update(dt) {
  if (!A.on) { hideEsp(); return; }
  const P = G.player && G.player.actor;
  if (P && P.alive) {
    if (A.god) { P.health = P.maxHealth; }
    if (A.ammo) { for (const w of P.weapons) if (w) { w.reserve = Math.max(w.reserve, w.def.mag * 3); } P.grenades = Math.max(P.grenades, 3); }
  }
  if (annihilate) annihilateUpdate(dt);
  const I = G.input;
  if (I && P && P.alive) {
    if (I.hit('KeyX')) startAnnihilate();
    if (I.hit('KeyT')) teleport();
    if (I.hit('KeyP')) { G.input.unlock(); setTimeout(() => G.ui.openAdmin && G.ui.openAdmin(), 50); }
  }
  if (A.esp) drawEsp(); else hideEsp();
}
function teleport() {
  const cam = G.camera, P = G.player.actor;
  const d = new THREE.Vector3(); cam.getWorldDirection(d);
  const r = traceShot(cam.position, d, 600, P);
  const p = r.point.clone().addScaledVector(d, -0.8);
  const gy = G.world.groundAt(p.x, p.z, p.y + 1, 0.3, 1.5);
  P.setPos(p.x, Math.max(gy, p.y - 1.5), p.z); P.onGround = false;
  G.vfx.smokePuff(P.pos, [0.3, 0.5, 1.0], 8, 0.8);
  G.audio.play('chute');
}
function hideEsp() { for (const e of espEls) e.style.display = 'none'; }
function drawEsp() {
  const P = G.player && G.player.actor; if (!P) return;
  const list = G.actors.filter((a) => a.alive && a !== P && a.team !== P.team && !a.dropState);
  const root = document.getElementById('esp');
  while (espEls.length < list.length) { const e = document.createElement('div'); e.className = 'esp'; root.appendChild(e); espEls.push(e); }
  const v = new THREE.Vector3();
  espEls.forEach((e, i) => {
    const a = list[i];
    if (!a) { e.style.display = 'none'; return; }
    a.center(v); v.y += 1.05 * a.scale;
    const dist = Math.round(a.pos.distanceTo(P.pos));
    v.project(G.camera);
    if (v.z > 1 || Math.abs(v.x) > 1.1 || Math.abs(v.y) > 1.1) { e.style.display = 'none'; return; }
    e.style.display = 'block';
    e.style.left = ((v.x * 0.5 + 0.5) * innerWidth) + 'px'; e.style.top = ((-v.y * 0.5 + 0.5) * innerHeight) + 'px';
    const html = `<b></b><span>${a.name} ${dist}m</span><i style="width:${Math.max(0, a.health / a.maxHealth) * 100}%"></i>`;
    if (e._h !== html) { e.innerHTML = html; e._h = html; }
  });
}

// ---- UI ----
const OPTS = [
  ['god', '無敵', 'toggle'], ['ammo', '弾薬無限・リロード不要', 'toggle'], ['explosive', '炸裂弾（着弾で爆発）', 'toggle'],
  ['norecoil', '反動・拡散ゼロ', 'toggle'], ['onehit', '一撃必殺', 'toggle'], ['esp', '敵の位置を表示（透視）', 'toggle'],
  ['freeze', '敵AIを停止', 'toggle'], ['zone', 'ゾーン収縮を停止', 'toggle'],
  ['speed', '移動速度', [1, 1.5, 2, 3, 5]], ['jump', 'ジャンプ力', [1, 1.5, 2.5, 4]], ['rof', '連射速度', [1, 2, 4]], ['timescale', 'ゲーム速度', [0.5, 1, 1.5]],
];
export function buildPanel(box) {
  box.innerHTML = '';
  for (const [k, label, kind] of OPTS) {
    const row = document.createElement('div'); row.className = 'opt';
    row.innerHTML = `<span>${label}</span>`;
    const seg = document.createElement('div'); seg.className = 'seg'; seg.style.margin = 0;
    const choices = kind === 'toggle' ? [['オフ', false], ['オン', true]] : kind.map((v) => ['×' + v, v]);
    for (const [n, v] of choices) {
      const b = document.createElement('button'); b.textContent = n; if (A[k] === v) b.classList.add('on');
      b.onclick = () => { A[k] = v; save(); [...seg.children].forEach((x) => x.classList.remove('on')); b.classList.add('on'); refreshBadge(); };
      seg.appendChild(b);
    }
    row.appendChild(seg); box.appendChild(row);
  }
  // 武器付与
  const row = document.createElement('div'); row.className = 'opt'; row.innerHTML = '<span>武器を入手（現在のスロット）</span>';
  const seg = document.createElement('div'); seg.className = 'seg'; seg.style.margin = 0; seg.style.flexWrap = 'wrap';
  for (const id of Object.keys(WEAPONS)) {
    const b = document.createElement('button'); b.textContent = WEAPONS[id].cls;
    b.onclick = () => { if (!G.player) { G.hud.toast('ゲーム中に使用してください'); return; } const P = G.player.actor; P.giveWeapon(id, P.weapons[P.cur] ? P.cur : null); G.player.onWeaponChanged(); G.hud.toast(WEAPONS[id].name + ' を入手'); };
    seg.appendChild(b);
  }
  row.appendChild(seg); box.appendChild(row);
  refreshBadge();
}
export function action(act) {
  if (!G.player) return;
  const P = G.player.actor;
  if (act === 'annihilate') startAnnihilate();
  else if (act === 'heal') { if (P.alive) { P.health = P.maxHealth; P.armor = 100; P.armorMax = 100; P.medkits += 3; P.bandages += 5; P.grenades += 5; G.hud.toast('全回復・物資補充'); } }
  else if (act === 'skipwave' && G.mode.id === 'pve') { G.mode.toSpawn = []; for (const a of G.actors) if (a.alive && a.isMonster) a.takeDamage({ amount: 1e6, part: 'torso', dir: new THREE.Vector3(0, 1, 0), explosive: true }); G.hud.toast('ウェーブをスキップ'); }
  else if (act === 'killall') { for (const a of enemies()) a.takeDamage({ amount: 1e6, part: 'torso', dir: new THREE.Vector3(0, 1, 0), point: a.center(), attacker: P, explosive: true, weapon: { name: '管理者' } }); }
}
export function refreshBadge() {
  const b = document.getElementById('adminbadge'); if (!b) return;
  if (!A.on) { b.classList.add('hidden'); return; }
  const tags = [];
  if (A.god) tags.push('無敵'); if (A.ammo) tags.push('弾無限'); if (A.explosive) tags.push('炸裂弾'); if (A.norecoil) tags.push('反動0'); if (A.onehit) tags.push('一撃'); if (A.esp) tags.push('透視'); if (A.freeze) tags.push('AI停止'); if (A.zone) tags.push('ゾーン停止');
  if (A.speed !== 1) tags.push('速度×' + A.speed); if (A.jump !== 1) tags.push('跳躍×' + A.jump); if (A.rof !== 1) tags.push('連射×' + A.rof); if (A.timescale !== 1) tags.push('時間×' + A.timescale);
  b.innerHTML = `<b>ADMIN</b> ${tags.join(' ・ ')}<br><small>[X] 殲滅 ・ [T] テレポート ・ [P] 管理者パネル</small>`;
  b.classList.remove('hidden');
}
export function resetRuntime() { annihilate = null; hideEsp(); }
export const annihilating = () => !!annihilate;
