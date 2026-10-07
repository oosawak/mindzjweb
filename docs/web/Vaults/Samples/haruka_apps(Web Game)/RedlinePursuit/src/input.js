// ===== HUD: speedometer, minimap, notifications, markers =====
import * as THREE from 'three';
import { clamp } from './util.js';
import { fmtTime } from '../game.js';
import { WORLD_HALF } from './terrain.js';

const $ = (id) => document.getElementById(id);
const v = new THREE.Vector3();

export class HUD {
  constructor() {
    this.root = $('hud');
    this.speedo = $('speedo').getContext('2d');
    this.mini = $('minimap').getContext('2d');
    this.notifyBox = $('notify');
    this.markers = $('markers');
    this.markerPool = [];
    this.dmgFlash = 0;
    this.radioBox = $('radio');
  }
  show(b) { this.root.classList.toggle('hidden', !b); }
  setMode(mode, game) {
    this.mode = mode;
    $('hud-mode').textContent = { race: 'HOT PURSUIT RACE', cop: 'INTERCEPTOR', free: 'FREE RUN' }[mode];
    $('abilities').classList.toggle('hidden', mode !== 'cop');
    $('pos-box').classList.toggle('hidden', mode !== 'race');
    $('bounty-box').classList.toggle('hidden', mode !== 'free');
    $('busted-box').classList.toggle('hidden', mode !== 'cop');
    $('heat').classList.toggle('hidden', mode === 'cop');
    this.notifyBox.innerHTML = '';
  }
  notify(t, sub, color, big) {
    const d = document.createElement('div');
    d.className = 'note' + (big ? ' big' : '');
    d.style.setProperty('--c', color);
    d.innerHTML = `<div class="nt">${t}</div>${sub ? `<div class="ns">${sub}</div>` : ''}`;
    this.notifyBox.appendChild(d);
    while (this.notifyBox.children.length > 4) this.notifyBox.removeChild(this.notifyBox.firstChild);
    setTimeout(() => d.classList.add('out'), big ? 2600 : 1700);
    setTimeout(() => d.remove(), big ? 3200 : 2300);
  }
  radio(text) {
    const r = this.radioBox;
    r.innerHTML = `<span class="rtag">POLICE RADIO</span> ${text}`;
    r.classList.remove('hidden'); r.classList.remove('rfade'); void r.offsetWidth; r.classList.add('rfade');
  }
  countdown(n) {
    const c = $('countdown');
    c.textContent = n; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
    if (n === 'GO!') setTimeout(() => (c.textContent = ''), 900);
  }
  flashDamage(a) { this.dmgFlash = Math.max(this.dmgFlash, a); }
  camLabel(text) {
    const c = $('camlabel'); c.textContent = '視点: ' + text; c.classList.remove('rfade'); void c.offsetWidth; c.classList.add('rfade');
  }

  update(dt, g, camera, world, settings) {
    const pl = g.player; if (!pl) return;
    this.dmgFlash = Math.max(0, this.dmgFlash - dt * 1.5);
    const kmh = Math.round(pl.speed * 3.6);
    this.drawSpeedo(kmh, pl.rpm, pl.gear, pl.nitro, pl.health, pl.nitroActive, pl.vF < -0.5);
    // top-left info
    $('hud-time').textContent = fmtTime(g.raceTime || 0);
    if (g.mode === 'race') {
      $('pos-num').textContent = g.position || '-';
      $('cp').textContent = `CP ${Math.min(g.checkIdx, g.checkpoints.length - 1)}/${g.checkpoints.length - 1}`;
      $('dist').textContent = `残り ${Math.max(0, (g.finishDist - g.playerProgress) / 1000).toFixed(1)} km`;
    } else if (g.mode === 'cop') {
      $('busted-num').textContent = `${g.bustedRacers}/4`;
      $('cp').textContent = `逃走 ${g.escapedRacers}`;
      $('dist').textContent = '';
    } else {
      $('bounty-num').textContent = Math.round(g.bounty).toLocaleString();
      $('cp').textContent = g.pursuit ? `追跡 ${fmtTime(g.pursuitTime)}` : g.cooldown > 0 ? 'クールダウン中' : 'パトロール警戒';
      $('dist').textContent = `逃走成功 ${g.escapes}回`;
    }
    // heat
    const heatEl = $('heat');
    if (g.mode !== 'cop') {
      const bars = heatEl.querySelectorAll('.hb');
      bars.forEach((b, i) => b.classList.toggle('on', i < g.heat && g.pursuit));
      $('heat-label').textContent = g.pursuit ? (g.mode === 'free' && g.lastSeen > 2 ? `見失い中… ${Math.max(0, 14 - g.lastSeen).toFixed(0)}` : 'PURSUIT') : g.mode === 'free' ? 'UNDETECTED' : 'STANDBY';
      heatEl.classList.toggle('active', g.pursuit);
      heatEl.classList.toggle('evade', g.mode === 'free' && g.pursuit && g.lastSeen > 2);
    }
    const bb = $('bustbar');
    bb.classList.toggle('hidden', g.bust <= 0.01);
    $('bustfill').style.width = `${Math.round(g.bust * 100)}%`;
    $('wrongway').classList.toggle('hidden', !g.wrongWay);
    $('draft').classList.toggle('hidden', !g.drafting);
    $('centerdot').classList.toggle('hidden', !settings.centerDot);
    // abilities (cop)
    if (g.mode === 'cop') {
      const sc = g.spikeCd, ec = g.empState.cd;
      $('ab-spike').style.setProperty('--p', `${(1 - sc / 12) * 100}%`);
      $('ab-spike').classList.toggle('ready', sc <= 0);
      $('ab-emp').style.setProperty('--p', `${(1 - ec / 14) * 100}%`);
      $('ab-emp').classList.toggle('ready', ec <= 0);
      $('ab-emp').classList.toggle('locking', g.empState.lock > 0);
      $('emp-lock').style.width = `${Math.min(100, (g.empState.lock / 2) * 100)}%`;
    }
    // checkpoint arrow
    const arrow = $('arrow');
    if (g.gatePos && g.gates.visible) {
      const dx = g.gatePos.x - pl.pos.x, dz = g.gatePos.z - pl.pos.z;
      camera.getWorldDirection(v);
      const camYaw = Math.atan2(v.x, v.z);
      const a = Math.atan2(dx, dz) - camYaw;
      arrow.classList.remove('hidden');
      arrow.style.transform = `translateX(-50%) rotate(${-a}rad)`;
      $('arrow-d').textContent = `${Math.round(Math.hypot(dx, dz))} m`;
    } else arrow.classList.add('hidden');
    this.drawMinimap(g, world);
    this.updateMarkers(g, camera);
  }

  drawSpeedo(kmh, rpm, gear, nitro, health, nitroOn, rev) {
    const c = this.speedo, W = 300, H = 300, cx = 150, cy = 158;
    c.clearRect(0, 0, W, H);
    const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
    // background ring
    c.lineCap = 'round';
    c.lineWidth = 16; c.strokeStyle = 'rgba(255,255,255,0.08)';
    c.beginPath(); c.arc(cx, cy, 118, a0, a1); c.stroke();
    // rpm arc
    const r = clamp(rpm, 0, 1);
    const grad = c.createLinearGradient(30, 0, 270, 0);
    grad.addColorStop(0, '#ffb000'); grad.addColorStop(0.75, '#ff5a00'); grad.addColorStop(1, '#ff1030');
    c.strokeStyle = grad; c.shadowColor = '#ff6a00'; c.shadowBlur = 16;
    c.beginPath(); c.arc(cx, cy, 118, a0, a0 + (a1 - a0) * r); c.stroke();
    c.shadowBlur = 0;
    // ticks
    c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
      const a = a0 + (a1 - a0) * (i / 10);
      const r1 = 100, r2 = i % 2 ? 94 : 88;
      c.beginPath(); c.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); c.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); c.stroke();
    }
    // nitro arc (inner)
    c.lineWidth = 8; c.strokeStyle = 'rgba(80,160,255,0.15)';
    c.beginPath(); c.arc(cx, cy, 78, Math.PI * 0.8, Math.PI * 1.2); c.stroke();
    c.strokeStyle = nitroOn ? '#9fe0ff' : '#2f8cff'; c.shadowColor = '#3fa0ff'; c.shadowBlur = nitroOn ? 20 : 8;
    c.beginPath(); c.arc(cx, cy, 78, Math.PI * 1.2 - Math.PI * 0.4 * clamp(nitro, 0, 1), Math.PI * 1.2); c.stroke();
    // damage arc
    c.shadowBlur = 0; c.strokeStyle = 'rgba(255,60,60,0.15)';
    c.beginPath(); c.arc(cx, cy, 78, Math.PI * 1.8, Math.PI * 2.2); c.stroke();
    const hcol = health > 0.5 ? '#3cff8a' : health > 0.25 ? '#ffc400' : '#ff3030';
    c.strokeStyle = hcol; c.shadowColor = hcol; c.shadowBlur = 8;
    c.beginPath(); c.arc(cx, cy, 78, Math.PI * 1.8, Math.PI * 1.8 + Math.PI * 0.4 * clamp(health, 0, 1)); c.stroke();
    c.shadowBlur = 0;
    // text
    c.fillStyle = '#fff'; c.textAlign = 'center';
    c.font = 'italic 800 78px Rajdhani, "Arial Narrow", sans-serif';
    c.fillText(String(kmh), cx, cy + 22);
    c.font = '700 16px Rajdhani, sans-serif'; c.fillStyle = 'rgba(255,255,255,0.6)';
    c.fillText('km/h', cx, cy + 46);
    c.font = 'italic 800 34px Rajdhani, sans-serif'; c.fillStyle = '#ffb000';
    c.fillText(rev ? 'R' : String(gear), cx, cy + 96);
    c.font = '700 12px Rajdhani, sans-serif'; c.fillStyle = '#6fb8ff'; c.fillText('NITRO', cx - 70, cy + 4 - 40);
    c.fillStyle = hcol; c.fillText('DAMAGE', cx + 70, cy - 36);
  }

  drawMinimap(g, world) {
    const c = this.mini, S = 240, R = S / 2;
    const pl = g.player;
    c.clearRect(0, 0, S, S);
    c.save();
    c.beginPath(); c.arc(R, R, R - 4, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#0b0f14'; c.fillRect(0, 0, S, S);
    const range = 260 + clamp(pl.speed * 3, 0, 220); // meters radius
    const scale = (R - 4) / range; // px per meter
    c.translate(R, R);
    c.rotate(Math.PI + pl.yaw); // heading up
    // map image
    const img = world.minimapCanvas, ms = world.minimapScale;
    const sx = (pl.pos.x + WORLD_HALF) * ms, sz = (pl.pos.z + WORLD_HALF) * ms;
    const k = scale / ms;
    c.globalAlpha = 0.95;
    c.drawImage(img, sx - range * 1.5 * ms, sz - range * 1.5 * ms, range * 3 * ms, range * 3 * ms, -range * 1.5 * scale, -range * 1.5 * scale, range * 3 * scale, range * 3 * scale);
    c.globalAlpha = 1;
    const P = (x, z) => [(x - pl.pos.x) * scale, (z - pl.pos.z) * scale];
    // route
    if (g.route) {
      c.strokeStyle = g.mode === 'cop' ? 'rgba(80,160,255,0.9)' : 'rgba(255,180,0,0.9)'; c.lineWidth = 3.5; c.lineJoin = 'round';
      c.beginPath();
      const pts = g.route.pts; const i0 = Math.max(0, (g.plIdx || 0) - 5);
      let first = true;
      for (let i = i0; i < pts.length; i++) {
        const p = pts[i];
        if (Math.abs(p.x - pl.pos.x) > range * 1.6 || Math.abs(p.z - pl.pos.z) > range * 1.6) { if (!first) break; continue; }
        const [x, y] = P(p.x, p.z);
        if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y);
      }
      c.stroke();
      if (g.gatePos && g.gates.visible) { const [x, y] = P(g.gatePos.x, g.gatePos.z); c.fillStyle = '#ffd000'; c.beginPath(); c.arc(x, y, 6, 0, 7); c.fill(); }
    }
    // spikes
    c.fillStyle = '#ff9020';
    for (const s of g.spikes) { const [x, y] = P(s.x, s.z); c.fillRect(x - 4, y - 1.5, 8, 3); }
    // cars
    const blink = (performance.now() / 250) % 2 < 1;
    for (const o of g.cars) {
      if (o === pl) continue;
      const dx = o.pos.x - pl.pos.x, dz = o.pos.z - pl.pos.z;
      if (Math.abs(dx) > range * 1.5 || Math.abs(dz) > range * 1.5) continue;
      let [x, y] = P(o.pos.x, o.pos.z);
      if (o.role === 'traffic') { c.fillStyle = 'rgba(200,200,200,0.5)'; c.fillRect(x - 2, y - 2, 4, 4); continue; }
      const d = Math.hypot(x, y);
      if (d > R - 12) { x *= (R - 12) / d; y *= (R - 12) / d; }
      if (o.role === 'cop') {
        c.fillStyle = o.wrecked ? '#555' : o.ai?.patrol ? '#9aa6ff' : blink ? '#ff2a2a' : '#2a5aff';
        c.beginPath(); c.arc(x, y, 5.5, 0, 7); c.fill();
        if (o.ai?.patrol && !o.wrecked) { c.strokeStyle = 'rgba(160,170,255,0.25)'; c.beginPath(); c.arc(x, y, 120 * scale, 0, 7); c.stroke(); }
      } else if (o.role === 'racer') {
        c.fillStyle = o.wrecked ? '#555' : '#' + o.model.paint.color.getHexString();
        c.save(); c.translate(x, y); c.rotate(-o.yaw); c.beginPath(); c.moveTo(0, 7); c.lineTo(5, -5); c.lineTo(-5, -5); c.closePath(); c.fill();
        c.strokeStyle = '#000'; c.lineWidth = 1; c.stroke(); c.restore();
      }
    }
    c.restore();
    // player arrow
    c.fillStyle = pl.police ? '#4aa0ff' : '#ffb000';
    c.beginPath(); c.moveTo(R, R - 10); c.lineTo(R + 7, R + 7); c.lineTo(R, R + 3); c.lineTo(R - 7, R + 7); c.closePath(); c.fill();
    // ring
    c.strokeStyle = g.pursuit && g.mode !== 'cop' ? (blink ? '#ff3040' : '#3060ff') : 'rgba(255,255,255,0.35)';
    c.lineWidth = 3; c.beginPath(); c.arc(R, R, R - 3, 0, Math.PI * 2); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.6)'; c.font = '700 12px Rajdhani, sans-serif'; c.textAlign = 'center';
    // north indicator
    const na = Math.PI + pl.yaw; // rotate
    const nx = R + Math.sin(-na + Math.PI) * (R - 16) * 0, ny = 0;
    void nx; void ny;
  }

  updateMarkers(g, camera) {
    const list = [];
    const pl = g.player;
    for (const o of g.cars) {
      if (o === pl || o.wrecked) continue;
      if (o.role === 'racer' || (o.role === 'cop' && g.mode !== 'cop')) {
        const d = o.pos.distanceTo(pl.pos);
        if (d > 450 || d < 6) continue;
        list.push({ o, d });
      }
    }
    list.sort((a, b) => a.d - b.d);
    const W = window.innerWidth, H = window.innerHeight;
    let used = 0;
    for (const { o, d } of list.slice(0, 8)) {
      v.copy(o.pos); v.y += 2.4;
      v.project(camera);
      if (v.z > 1 || Math.abs(v.x) > 1.1 || Math.abs(v.y) > 1.1) continue;
      let el = this.markerPool[used];
      if (!el) { el = document.createElement('div'); el.className = 'mk'; el.innerHTML = '<div class="mk-n"></div><div class="mk-h"><i></i></div><div class="mk-t"></div>'; this.markers.appendChild(el); this.markerPool.push(el); }
      used++;
      el.style.display = 'block';
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * W}px, ${(-v.y * 0.5 + 0.5) * H}px) translate(-50%, -100%)`;
      const cop = o.role === 'cop';
      el.className = 'mk ' + (cop ? 'cop' : 'racer');
      el.querySelector('.mk-n').textContent = cop ? 'POLICE' : o.name;
      el.querySelector('.mk-t').textContent = `${Math.round(d)}m`;
      const hb = el.querySelector('.mk-h');
      const showH = (g.mode === 'cop' && !cop) || (cop && d < 120) || (!cop && d < 150);
      hb.style.display = showH ? 'block' : 'none';
      hb.firstChild.style.width = `${Math.round(o.health * 100)}%`;
      el.style.opacity = clamp(1.3 - d / 450, 0.35, 1);
    }
    for (let i = used; i < this.markerPool.length; i++) this.markerPool[i].style.display = 'none';
  }
}
