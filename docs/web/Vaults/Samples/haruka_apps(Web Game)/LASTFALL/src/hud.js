// HUD: 体力・弾薬・ミニマップ・コンパス・キルフィード・被弾表示・画面の血
import * as THREE from 'three';
import { G } from './state.js';
import { clamp, rand } from './util.js';
import { TIER_COLORS } from './weapons.js';
import { traceShot } from './combat.js';

const $ = (id) => document.getElementById(id);
export class HUD {
  constructor() {
    this.el = $('hud');
    this.hm = $('hitmarker'); this.hmT = 0;
    this.ch = $('crosshair'); this.chKick = 0;
    this.mm = $('minimap').getContext('2d');
    this.cp = $('compass').getContext('2d');
    this.sb = $('screenblood'); this.sbc = this.sb.getContext('2d');
    this.dns = []; this.dirs = [];
    this.toastT = 0; this.bigT = 0; this.kbT = 0;
    this.fpsAcc = 0; this.fpsN = 0;
    this.lastHp = 100;
    this.pings = [];
    this.boss = null;
    this.resize();
    addEventListener('resize', () => this.resize());
  }
  resize() { this.sb.width = innerWidth / 2; this.sb.height = innerHeight / 2; document.documentElement.style.setProperty('--hs', Math.min(1, innerHeight / 900, innerWidth / 1500).toFixed(3)); }
  show(v) { this.el.classList.toggle('hidden', !v); if (!v) { $('bigmap').classList.add('hidden'); $('scoreboard').classList.add('hidden'); } }
  reset() {
    this.el.classList.remove('dead'); document.getElementById('deathbanner').classList.remove('show');
    $('killfeed').innerHTML = ''; $('dmgnums').innerHTML = ''; this.dns = []; $('dmgdirs').innerHTML = ''; this.dirs = [];
    this.sbc.clearRect(0, 0, this.sb.width, this.sb.height); this.bossBar(null); $('bigmsg').style.opacity = 0; $('toast').style.opacity = 0; this.progress(null);
    $('fps').classList.toggle('hidden', !G.settings.showFps);
  }
  hitmarker(kill, head) { this.hm.className = kill ? 'kill' : head ? 'head' : ''; this.hm.style.opacity = 1; this.hmT = kill ? 0.35 : 0.18; this.hm.style.transform = `scale(${kill ? 1.4 : 1})`; }
  deathBanner(killer, wname, head) {
    const e = document.getElementById('deathbanner');
    const esc = (s) => String(s || '').replace(/[<>&]/g, '');
    e.innerHTML = `<div class="t">${head ? 'HEADSHOT — ' : ''}あなたは倒れた</div>` + (killer ? `<div class="k">キラー <b>${esc(killer)}</b>${wname ? ` <span>[${esc(wname)}]</span>` : ''}</div>` : wname ? `<div class="k">${esc(wname)}</div>` : '');
    this.el.classList.add('dead');
    e.classList.remove('show'); void e.offsetWidth; e.classList.add('show');
  }
  killConfirm(streak, head, monster) {
    const e = document.getElementById('killconfirm');
    const names = ['', '', 'ダブルキル', 'トリプルキル', 'クアドラキル', 'ペンタキル'];
    e.innerHTML = `<div class="skull">${monster ? '✖' : '☠'}</div>` + (streak >= 2 ? `<div class="streak">${names[Math.min(5, streak)] || streak + '連続キル'}</div>` : '') + (head ? '<div class="hs">HEADSHOT</div>' : '');
    e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop');
  }
  crosshairKick() { this.chKick = Math.min(1, this.chKick + 0.35); }
  damageNumber(p, n, head, kill) {
    if (!n || n <= 0) return;
    const d = document.createElement('div');
    d.className = 'dn' + (kill ? ' kill' : head ? ' head' : '');
    d.textContent = n;
    $('dmgnums').appendChild(d);
    this.dns.push({ d, p: p.clone(), t: 0, vx: rand(-0.4, 0.4) });
    if (this.dns.length > 30) { const o = this.dns.shift(); o.d.remove(); }
  }
  damageIndicator(dir, attacker) {
    const d = document.createElement('div'); d.className = 'dmgdir';
    $('dmgdirs').appendChild(d);
    this.dirs.push({ d, src: attacker ? attacker.pos.clone() : null, dir: dir ? dir.clone() : null, t: 1.6 });
    if (this.dirs.length > 6) { const o = this.dirs.shift(); o.d.remove(); }
  }
  screenBlood(dmg, melee) {
    if (G.settings.gore === 0) return;
    const c = this.sbc, W = this.sb.width, H = this.sb.height;
    const n = Math.min(6, Math.ceil(dmg / (melee ? 9 : 16)));
    for (let i = 0; i < n; i++) {
      const edge = Math.random();
      const x = edge < 0.5 ? (Math.random() < 0.5 ? rand(0, W * 0.25) : rand(W * 0.75, W)) : rand(0, W);
      const y = edge < 0.5 ? rand(0, H) : Math.random() < 0.5 ? rand(0, H * 0.25) : rand(H * 0.75, H);
      const r = rand(10, 34) * (melee ? 1.4 : 1);
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(80,0,0,0.75)'); g.addColorStop(0.55, 'rgba(110,4,4,0.5)'); g.addColorStop(1, 'rgba(100,0,0,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      for (let k = 0; k < 8; k++) { c.fillStyle = 'rgba(110,0,0,0.8)'; c.beginPath(); c.arc(x + rand(-r, r) * 1.3, y + rand(-r, r) * 1.3, rand(1, 6), 0, 7); c.fill(); }
      if (melee) { c.strokeStyle = 'rgba(140,0,0,0.8)'; c.lineWidth = rand(3, 8); c.beginPath(); c.moveTo(x - r, y - r * 0.5); c.lineTo(x + r, y + r * 0.6); c.stroke(); }
      // 滴り
      if (Math.random() < 0.5) { c.fillStyle = 'rgba(100,0,0,0.7)'; c.fillRect(x - 2, y, 4, rand(20, 80)); }
    }
  }
  toast(t) { const e = $('toast'); e.textContent = t; e.style.opacity = 1; this.toastT = 2.6; }
  bigMessage(t, s) { $('bigmsg').querySelector('h1').textContent = t; $('bigmsg').querySelector('p').textContent = s || ''; $('bigmsg').style.opacity = 1; this.bigT = 3.5; }
  progress(label, f) {
    const e = $('progress');
    if (!label) { e.classList.add('hidden'); return; }
    e.classList.remove('hidden'); e.querySelector('.l').textContent = label; e.querySelector('b').style.width = (f * 100).toFixed(1) + '%';
  }
  setScope(on, def) { $('scope').classList.toggle('hidden', !on); this.ch.style.visibility = on ? 'hidden' : 'visible'; }
  killfeed(k, w, v, hs, me, mon) {
    const d = document.createElement('div'); d.className = 'kf' + (me ? ' me' : '');
    const esc = (s) => String(s).replace(/[<>&]/g, '');
    d.innerHTML = k ? `<span>${esc(k)}</span><span class="w">[${esc(w)}]</span><span style="color:${mon ? '#ff7060' : '#fff'}">${esc(v)}</span>${hs ? '<span class="hs">◎HS</span>' : ''}` : `<span style="color:${mon ? '#ff7060' : '#fff'}">${esc(v)}</span><span class="w">[${esc(w || '死亡')}]</span>`;
    $('killfeed').appendChild(d);
    setTimeout(() => d.remove(), 6000);
    const kf = $('killfeed'); while (kf.children.length > 6) kf.firstChild.remove();
  }
  killBanner(name, hs) {
    $('killbanner').innerHTML = `<div class="k">${hs ? 'HEADSHOT' : 'ELIMINATED'}</div><div class="n">${String(name).replace(/[<>&]/g, '')}</div>`;
    $('killbanner').style.opacity = 1; this.kbT = 2;
  }
  bossBar(a) { this.boss = a; $('bossbar').classList.toggle('hidden', !a); if (a) $('bossbar').querySelector('.n').textContent = a.name; }

  update(dt) {
    const P = G.player; if (!P) return;
    const A = P.actor;
    // FPS
    if (G.settings.showFps) { this.fpsAcc += dt; this.fpsN++; if (this.fpsAcc > 0.5) { $('fps').textContent = `${Math.round(this.fpsN / this.fpsAcc)} FPS`; this.fpsAcc = 0; this.fpsN = 0; } }
    // 体力
    const hp = Math.max(0, A.health);
    $('hpnum').textContent = Math.ceil(hp);
    const hb = $('hpbar'); hb.querySelector('b').style.width = hp + '%'; hb.querySelector('s').style.width = hp + '%';
    hb.classList.toggle('low', hp < 30);
    $('armorbar').querySelector('b').style.width = (A.armor) + '%';
    $('armornum').textContent = A.armor > 0 ? `ARMOR ${Math.ceil(A.armor)}` : '';
    const itemsHtml = `<div class="item">包帯 <b>${A.bandages}</b></div><div class="item">救急 <b>${A.medkits}</b><kbd>H</kbd></div><div class="item">グレ <b>${A.grenades}</b><kbd>G</kbd></div>`;
    if (this._items !== itemsHtml) { $('items').innerHTML = itemsHtml; this._items = itemsHtml; }
    // 武器
    const w = A.weapon;
    const ammo = $('ammo');
    const ah = w ? `${w.mag}<small> / ${G.mode.infiniteAmmo ? '∞' : w.reserve}</small>` : '<small>素手</small>';
    if (this._ammo !== ah) { ammo.innerHTML = ah; this._ammo = ah; }
    ammo.classList.toggle('low', !!w && w.mag <= Math.ceil(w.def.mag * 0.25));
    const wn = w ? `<span style="color:${TIER_COLORS[w.def.tier]}">${w.def.name}</span> <span style="color:var(--dim);font-size:14px">${w.def.cls}${A.reloading > 0 ? ' ・ リロード中' : ''}</span>` : '';
    if (this._wn !== wn) { $('wname').innerHTML = wn; this._wn = wn; }
    const sl = A.weapons.map((x, i) => `<div class="slot${i === A.cur ? ' on' : ''}"><kbd>${i + 1}</kbd>${x ? x.def.name : '—'}</div>`).join('');
    if (this._sl !== sl) { $('slots').innerHTML = sl; this._sl = sl; }
    // クロスヘア
    this.chKick = Math.max(0, this.chKick - dt * 5);
    let gap = 6;
    if (w && A.alive) { gap = 4 + P.currentSpread() * 420 + this.chKick * 8; }
    gap = clamp(gap, 3, 90);
    const ads = P.ads;
    const els = this.ch.children;
    els[1].style.left = -(gap + 9) + 'px'; els[2].style.left = gap + 'px'; els[3].style.top = -(gap + 9) + 'px'; els[4].style.top = gap + 'px';
    // 照準が敵に重なったら赤く
    this.aimT = (this.aimT || 0) - dt;
    if (this.aimT <= 0 && A.alive && !A.dropState) {
      this.aimT = 0.05;
      const d = new THREE.Vector3(); G.camera.getWorldDirection(d);
      const r = traceShot(G.camera.position, d, w ? w.def.range : 200, A);
      const on = !!(r.actor && r.actor.alive && r.actor.team !== A.team);
      this.ch.classList.toggle('enemy', on);
      document.getElementById('scope').classList.toggle('enemy', on);
    }
    this.ch.style.opacity = A.dropState ? 0 : (w ? 1 - ads * (w.def.model.optic !== 'none' ? 0.95 : 0.6) : 0.6);
    if (this.ch.classList.contains('enemy')) { gap *= 0.7; els[1].style.left = -(gap + 9) + 'px'; els[2].style.left = gap + 'px'; els[3].style.top = -(gap + 9) + 'px'; els[4].style.top = gap + 'px'; }
    if (this.hmT > 0) { this.hmT -= dt; if (this.hmT <= 0) this.hm.style.opacity = 0; }
    // 被弾方向
    const cam = G.camera;
    for (let i = this.dirs.length - 1; i >= 0; i--) {
      const o = this.dirs[i]; o.t -= dt;
      if (o.t <= 0) { o.d.remove(); this.dirs.splice(i, 1); continue; }
      let dx, dz;
      if (o.src) { dx = o.src.x - A.pos.x; dz = o.src.z - A.pos.z; } else if (o.dir) { dx = -o.dir.x; dz = -o.dir.z; } else { dx = 0; dz = -1; }
      const ang = Math.atan2(dx, -dz) + A.yaw;
      o.d.style.transform = `rotate(${ang}rad)`; o.d.style.opacity = Math.min(1, o.t);
    }
    // ダメージ数字
    const v = new THREE.Vector3();
    for (let i = this.dns.length - 1; i >= 0; i--) {
      const o = this.dns[i]; o.t += dt;
      if (o.t > 0.9) { o.d.remove(); this.dns.splice(i, 1); continue; }
      v.copy(o.p); v.y += o.t * 0.8; v.x += o.vx * o.t;
      v.project(cam);
      if (v.z > 1) { o.d.style.opacity = 0; continue; }
      o.d.style.left = ((v.x * 0.5 + 0.5) * innerWidth) + 'px'; o.d.style.top = ((-v.y * 0.5 + 0.5) * innerHeight) + 'px';
      o.d.style.opacity = 1 - Math.max(0, o.t - 0.5) * 2.5;
    }
    // 画面の血（徐々に消える）
    const c = this.sbc;
    c.globalCompositeOperation = 'destination-out'; c.fillStyle = `rgba(0,0,0,${Math.min(1, dt * 0.45)})`; c.fillRect(0, 0, this.sb.width, this.sb.height); c.globalCompositeOperation = 'source-over';
    if (this.toastT > 0) { this.toastT -= dt; if (this.toastT <= 0) $('toast').style.opacity = 0; }
    if (this.bigT > 0) { this.bigT -= dt; if (this.bigT <= 0) $('bigmsg').style.opacity = 0; }
    if (this.kbT > 0) { this.kbT -= dt; if (this.kbT <= 0) $('killbanner').style.opacity = 0; }
    // インタラクト表示
    const pr = $('prompt');
    const it = A.alive && !A.dropState && G.loot ? G.loot.nearest(A) : null;
    if (it) { pr.classList.remove('hidden'); const t = `<kbd>E</kbd><span style="color:${G.loot.itemColor(it)}">${G.loot.itemName(it)}</span> ${it.rack ? 'を装備' : it.type === 'weapon' && A.weapons.some((x) => x && x.def.id === it.id) ? 'の弾薬を拾う' : 'を拾う'}`; if (this._pr !== t) { pr.innerHTML = t; this._pr = t; } }
    else pr.classList.add('hidden');
    if (A.dropState === 'plane') { pr.classList.remove('hidden'); pr.innerHTML = '<kbd>Space</kbd> 降下する'; this._pr = ''; }
    else if (A.dropState === 'freefall') { pr.classList.remove('hidden'); pr.innerHTML = '<kbd>Space</kbd> パラシュート展開 ・ <kbd>W</kbd> 急降下'; this._pr = ''; }
    // ボス
    if (this.boss) { const b = $('bossbar'); const f = Math.max(0, this.boss.health / this.boss.maxHealth) * 100; b.querySelector('b').style.width = f + '%'; b.querySelector('s').style.width = f + '%'; }
    // 情報
    const info = G.mode.hudInfo ? G.mode.hudInfo() : null;
    if (info) {
      let h = '<div class="big">';
      if (info.alive !== undefined) h += `<div><b>${info.alive}</b>生存</div>`;
      if (info.wave) h += `<div><b>${info.wave}</b></div>`;
      if (info.kills !== undefined) h += `<div><b>${info.kills}</b>キル</div>`;
      h += '</div>' + info.lines.map((l) => `<div class="line">${l}</div>`).join('');
      if (this._info !== h) { $('info').innerHTML = h; this._info = h; }
    }
    this.drawCompass(A);
    this.drawMinimap(A, dt);
    // 全体マップ・スコアボード
    const I = G.input;
    const showMap = I.down('KeyM');
    $('bigmap').classList.toggle('hidden', !showMap);
    if (showMap) this.drawBigmap(A);
    const showSb = I.down('Tab') && G.mode.id === 'br';
    $('scoreboard').classList.toggle('hidden', !showSb);
    if (showSb) this.drawScoreboard();
  }
  drawCompass(A) {
    const c = this.cp, W = 520, H = 34;
    c.clearRect(0, 0, W, H);
    const heading = ((-A.yaw * 180 / Math.PI) % 360 + 360) % 360;
    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.2, 'rgba(0,0,0,.45)'); g.addColorStop(0.8, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, 24);
    const pxPerDeg = 3.2;
    c.textAlign = 'center'; c.font = '600 14px Oswald, sans-serif';
    for (let d = -90; d <= 90; d += 5) {
      const deg = Math.round(heading / 5) * 5 + d;
      const x = W / 2 + (deg - heading) * pxPerDeg;
      if (x < 10 || x > W - 10) continue;
      const nd = ((deg % 360) + 360) % 360;
      const a = 1 - Math.abs(x - W / 2) / (W / 2);
      c.globalAlpha = a;
      if (nd % 45 === 0) { c.fillStyle = nd === 0 ? '#ff6040' : '#fff'; c.fillText({ 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' }[nd], x, 18); }
      else if (nd % 15 === 0) { c.fillStyle = '#aaa'; c.font = '12px Oswald, Arial Narrow, sans-serif'; c.fillText(nd, x, 17); c.font = '600 14px Oswald, sans-serif'; }
      else { c.fillStyle = '#888'; c.fillRect(x - 0.5, 3, 1, 6); }
    }
    c.globalAlpha = 1; c.fillStyle = '#ff6040'; c.beginPath(); c.moveTo(W / 2 - 5, 30); c.lineTo(W / 2 + 5, 30); c.lineTo(W / 2, 24); c.fill();
  }
  drawMinimap(A, dt) {
    const c = this.mm, W = 210, S = G.map.S, img = G.map.minimap;
    const ms = img.width / (2 * S);
    const range = G.map.id === 'range' ? 60 : 110;
    const ppm = (W / 2) / range;
    c.save(); c.fillStyle = '#0a0c10'; c.fillRect(0, 0, W, W);
    c.translate(W / 2, W / 2); c.rotate(A.yaw);
    c.scale(ppm / ms, ppm / ms);
    c.translate(-(A.pos.x + S) * ms, -(A.pos.z + S) * ms);
    c.drawImage(img, 0, 0);
    const Z = G.zone;
    if (Z) {
      c.lineWidth = 2.5 * ms / ppm;
      c.strokeStyle = '#a060ff'; c.beginPath(); c.arc((Z.center.x + S) * ms, (Z.center.y + S) * ms, Z.radius * ms, 0, 7); c.stroke();
      c.strokeStyle = '#fff'; c.setLineDash([6 * ms / ppm, 4 * ms / ppm]); c.beginPath(); c.arc((Z.targetCenter.x + S) * ms, (Z.targetCenter.y + S) * ms, Z.targetRadius * ms, 0, 7); c.stroke(); c.setLineDash([]);
    }
    // 銃声・敵反応
    const now = G.time;
    for (const n of G.noises) {
      if (!n.src || n.src === A || now - n.t > 1.5) continue;
      if (n.pos.distanceTo(A.pos) > 90) continue;
      c.fillStyle = `rgba(255,60,40,${1 - (now - n.t) / 1.5})`; c.beginPath(); c.arc((n.pos.x + S) * ms, (n.pos.z + S) * ms, 4 * ms / ppm, 0, 7); c.fill();
    }
    if (G.mode.id !== 'br') for (const m of G.actors) {
      if (!m.alive || m === A || !(m.isMonster || m.brain)) continue;
      if (m.pos.distanceTo(A.pos) > (G.mode.id === 'pve' ? 45 : 120)) continue;
      c.fillStyle = m.kind === 'boss' ? '#ff2020' : '#ff5a40'; c.beginPath(); c.arc((m.pos.x + S) * ms, (m.pos.z + S) * ms, (m.kind === 'boss' ? 6 : 3.5) * ms / ppm, 0, 7); c.fill();
    }
    // 補給物資
    if (G.mode.flares) for (const f of G.mode.flares) { c.fillStyle = '#ff3030'; c.fillRect((f.p.x + S) * ms - 3 * ms / ppm, (f.p.z + S) * ms - 3 * ms / ppm, 6 * ms / ppm, 6 * ms / ppm); }
    c.restore();
    // プレイヤー
    c.fillStyle = '#ffd040'; c.strokeStyle = '#000'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(W / 2, W / 2 - 8); c.lineTo(W / 2 + 6, W / 2 + 6); c.lineTo(W / 2, W / 2 + 3); c.lineTo(W / 2 - 6, W / 2 + 6); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.font = '600 12px Oswald, Arial Narrow, sans-serif'; c.textAlign = 'center';
    c.fillStyle = '#ff6040';
    c.fillText('N', W / 2 + Math.sin(A.yaw) * 92, W / 2 - Math.cos(A.yaw) * 92 + 4);
  }
  drawBigmap(A) {
    const cv = $('bigmapc'), c = cv.getContext('2d'), W = cv.width, S = G.map.S, img = G.map.minimap;
    const k = W / (2 * S);
    c.drawImage(img, 0, 0, W, W);
    c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 1;
    for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(i * W / 8, 0); c.lineTo(i * W / 8, W); c.moveTo(0, i * W / 8); c.lineTo(W, i * W / 8); c.stroke(); }
    const Z = G.zone;
    if (Z) {
      c.fillStyle = 'rgba(90,30,160,.25)'; c.beginPath(); c.rect(0, 0, W, W); c.arc((Z.center.x + S) * k, (Z.center.y + S) * k, Z.radius * k, 0, 7, true); c.fill();
      c.lineWidth = 3; c.strokeStyle = '#a060ff'; c.beginPath(); c.arc((Z.center.x + S) * k, (Z.center.y + S) * k, Z.radius * k, 0, 7); c.stroke();
      c.strokeStyle = '#fff'; c.setLineDash([8, 6]); c.beginPath(); c.arc((Z.targetCenter.x + S) * k, (Z.targetCenter.y + S) * k, Z.targetRadius * k, 0, 7); c.stroke(); c.setLineDash([]);
    }
    const D = G.mode.drop;
    if (D && !D.done) { c.strokeStyle = 'rgba(255,220,80,.8)'; c.lineWidth = 2; c.setLineDash([10, 8]); c.beginPath(); c.moveTo((D.start.x + S) * k, (D.start.z + S) * k); c.lineTo((D.end.x + S) * k, (D.end.z + S) * k); c.stroke(); c.setLineDash([]); c.fillStyle = '#ffd040'; c.beginPath(); c.arc((D.pos.x + S) * k, (D.pos.z + S) * k, 6, 0, 7); c.fill(); }
    c.save(); c.translate((A.pos.x + S) * k, (A.pos.z + S) * k); c.rotate(-A.yaw);
    c.fillStyle = '#ffd040'; c.strokeStyle = '#000'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -12); c.lineTo(8, 8); c.lineTo(0, 4); c.lineTo(-8, 8); c.closePath(); c.fill(); c.stroke();
    c.restore();
  }
  drawScoreboard() {
    const list = G.actors.filter((a) => !a.isMonster).sort((a, b) => (b.alive - a.alive) || (b.kills - a.kills));
    const h = `<h3>生存者 ${list.filter((a) => a.alive).length} / ${list.length}</h3>` + list.slice(0, 24).map((a) => `<div class="r${a.alive ? '' : ' dead'}${a.isPlayer ? ' me' : ''}"><span>${a.name}</span><span>${a.kills} キル</span></div>`).join('');
    if (this._sb !== h) { $('scoreboard').innerHTML = h; this._sb = h; }
  }
}
