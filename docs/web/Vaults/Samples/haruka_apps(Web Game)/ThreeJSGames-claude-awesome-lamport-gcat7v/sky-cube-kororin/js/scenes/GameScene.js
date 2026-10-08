// =========================================================
// GameScene — ゲームプレイ(ステージ 1〜3 を つづけて あそぶ)
// =========================================================
import * as THREE from 'three';
import { BaseScene } from './BaseScene.js';
import { CONFIG } from '../config.js';
import { STAGES } from '../game/levels/index.js';
import { Level, dirVec } from '../game/Level.js';
import { Player } from '../game/Player.js';
import { CameraRig } from '../game/CameraRig.js';
import { Sky } from '../vfx/Sky.js';
import { Decor } from '../vfx/Decor.js';
import { LandingMarker } from '../vfx/Rings.js';
import { settings } from '../core/Settings.js';
import { t, pick } from '../core/I18n.js';
import { clamp, Ease, rand } from '../core/Tween.js';
import { el } from '../ui/UI.js';
import { Icons } from '../ui/Icons.js';
import { openPause } from '../ui/Panels.js';
import { TouchControls } from '../ui/TouchControls.js';

const Y = new THREE.Vector3(0, 1, 0);
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _ndc = new THREE.Vector2();

export function fmtTime(sec) {
  const s = Math.floor(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export class GameScene extends BaseScene {
  async enter(params = {}) {
    this.camera.fov = CONFIG.camera.fov;
    this.camera.updateProjectionMatrix();
    this.stageIndex = params.stage ?? 0;
    this.results = params.results ?? { stars: [], totals: [], time: 0, respawns: 0, switches: 0 };
    this.state = 'loading';
    this.paused = false;

    this.sky = new Sky();
    this.scene.add(this.sky);
    this.setupFX();
    this.marker = new LandingMarker();
    this.hoverMarker = new LandingMarker();
    this.scene.add(this.marker, this.hoverMarker);
    this.rig = new CameraRig(this.camera);
    this.raycaster = new THREE.Raycaster();

    this.buildHUD();
    this.touchRoot = document.getElementById('touch-root');
    this.touch = new TouchControls(this.touchRoot, this.input);
    document.body.classList.add('in-game');
    this.input.gameplay = true;

    this.lastVoice = -10;
    this.lastHint = -10;
    this.lastLocked = -10;
    this._dustT = 0;
    this._ambT = 0;

    this.setupStage(this.stageIndex);
    this.stageIntro();
  }

  // ---------------------------------------------------------
  // ステージ準備
  // ---------------------------------------------------------
  setupStage(index) {
    if (this.level) {
      this.scene.remove(this.level.group, this.player.model, this.decor);
      this.level.dispose();
      this.player.model.dispose();
      this.decor.dispose();
    }
    this.stageIndex = index;
    const def = STAGES[CONFIG.stageOrder[index]];
    this.def = def;

    this.level = new Level(def);
    this.scene.add(this.level.group);
    this.level.sun.castShadow = this.engine.quality.shadows;
    this.level.onCrumble = (b) => {
      this.audio.sfx('crumble');
      _v.addVectors(b.min, b.max).multiplyScalar(0.5);
      this.particles.emit({ pos: _v, spread: 2, count: 18, color: '#ffc98a', color2: '#fff3d0', speed: 3, size: 0.4, life: 0.8, drag: 2 });
    };

    this.sky.setColors({ aurora: 0, stars: 0.2, ...def.sky });
    this.scene.fog = new THREE.Fog(def.fog.color, def.fog.near, def.fog.far);
    this.decor = new Decor({ center: this.level.boundsCenter, ...def.decor });
    this.scene.add(this.decor);

    this.player = new Player(this.level);
    this.scene.add(this.player.model);
    const up = dirVec(def.start.gravity).negate();
    const frame = new THREE.Quaternion().setFromUnitVectors(Y, up);
    const yaw = def.start.yaw ?? 0;
    const facing = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).applyQuaternion(frame);
    this.player.spawn(new THREE.Vector3(...def.start.pos), dirVec(def.start.gravity), facing);
    this.player.frozen = true;
    this.bindPlayer();
    this.rig.distance = def.camera?.distance ?? CONFIG.camera.distance;
    this.rig.snap(this.player.up, this.player.pos, yaw, def.start.pitch ?? CONFIG.camera.pitch);

    this.collected = 0;
    this.total = this.level.stars.length;
    this.stageTime = 0;
    this.switchCount = 0;
    this.crumbleCount = 0;
    this.hintsDone = new Set();
    this.particles.clear();
    this.rings.clear();
    this.updateHUD(true);
    this.audio.playBGM(def.bgm);
  }

  bindPlayer() {
    const p = this.player;
    p.on.jump = () => {
      this.audio.sfx('jump');
      p.model.squash(-0.3);
      this.emitDust(5, 2);
    };
    p.on.land = (impact) => {
      if (impact < 3) return;
      p.model.squash(Math.min(0.42, impact * 0.022));
      const big = impact > 16;
      this.audio.sfx(big ? 'land_big' : 'land', { volume: clamp(impact / 14, 0.4, 1) });
      this.emitDust(Math.min(26, 4 + impact * 0.9), 2 + impact * 0.18);
      if (impact > 8) {
        _v.copy(p.pos).addScaledVector(p.up, -0.43);
        this.rings.spawn({ pos: _v, normal: p.up, color: big ? '#ffe27a' : '#ffffff', size: 1.2 + impact * 0.07, life: 0.5, width: 0.1 });
      }
      if (big) {
        this.rig.shake(Math.min(0.5, impact * 0.018));
        this.engine.postfx.pulseChroma(0.8);
      }
    };
    p.on.hazard = (box, normal) => {
      this.audio.sfx('hazard');
      this.particles.emit({ pos: p.pos, count: 26, color: '#d48cff', color2: '#ffffff', speed: 8, size: 0.32, life: 0.5, drag: 3, shape: 1 });
      this.engine.postfx.doFlash('#b070ff', 0.3, 2);
      this.rig.shake(0.35);
      p.model.setSurprised(true);
      this.later(0.6, () => p.model.setSurprised(false));
      if (settings.get('easy')) {
        this.callout('vo_ouch', 1.5);
      } else {
        this.respawn('hazard');
      }
    };
    p.on.crumble = () => {
      this.audio.sfx('crack');
      this.crumbleCount++;
      this.fireHintEvent('crumble', this.crumbleCount);
    };
  }

  async stageIntro() {
    const def = this.def;
    this.state = 'intro';
    this.player.frozen = true;
    // 空から ズームイン
    // 部屋の中のステージでは かべの外に出ないように レイで距離を制限
    const dir = new THREE.Vector3(Math.sin(this.rig.yaw) * 20, 14, Math.cos(this.rig.yaw) * 20).applyQuaternion(this.rig.frame);
    let dist = dir.length();
    dir.normalize();
    const hit = this.level.raycast(this.player.pos, dir, dist);
    if (hit) dist = Math.max(2, hit.t - 0.8);
    const from = this.player.pos.clone().addScaledVector(dir, dist);
    this.rig.startIntro(from, settings.get('reduceMotion') ? 1.2 : 2.6);
    this.audio.sfx('whoosh');

    const card = el('div', { class: 'stage-card in' },
      el('span', { class: 'num', text: `${t('stage')} ${def.number}` }),
      el('span', { class: 'name', text: pick(def.name) }));
    this.hud.append(card);
    this.subs.say(def.titleVoice);
    await this.wait(2.3);
    if (this._disposed) return;
    card.classList.remove('in');
    card.classList.add('out');
    this.later(0.5, () => card.remove());
    await this.wait(0.3);
    this.bigCall(t('go'));
    this.subs.say('go');
    this.audio.sfx('go');
    this.player.frozen = false;
    this.state = 'play';
  }

  // ---------------------------------------------------------
  // HUD
  // ---------------------------------------------------------
  buildHUD() {
    const s = this.ui.screen('hud-screen');
    s.style.padding = '0';
    this.hud = el('div', { class: 'hud' });
    const top = el('div', { class: 'hud-top' });
    this.stageChip = el('div', { class: 'chip stage' });
    this.starChip = el('div', { class: 'chip stars' });
    this.starChip.innerHTML = `<span style="color:#ffb31f;display:inline-flex">${Icons.star}</span><span class="v"></span>`;
    this.timeChip = el('div', { class: 'chip time' });
    this.timeChip.innerHTML = `${Icons.clock}<span class="v"></span>`;
    const pauseBtn = this.ui.button({ icon: 'pause', cls: 'round small pause-btn', title: t('paused'), onClick: () => this.openPauseMenu() });
    pauseBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    top.append(
      el('div', { class: 'hud-left' }, this.stageChip),
      el('div', { class: 'hud-center' }, this.starChip),
      el('div', { class: 'hud-right' }, this.timeChip, pauseBtn),
    );
    this.hintBox = el('div', { class: 'hud-hint' });
    this.hud.append(top, this.hintBox);
    s.append(this.hud);
  }

  updateHUD(full = false) {
    if (full) {
      this.stageChip.textContent = `${this.def.number}. ${pick(this.def.name)}`;
    }
    this.starChip.querySelector('.v').textContent = `${this.collected} / ${this.total}`;
    const tt = fmtTime(this.results.time);
    if (tt !== this._lastTimeText) {
      this._lastTimeText = tt;
      this.timeChip.querySelector('.v').textContent = tt;
    }
  }

  refreshTexts() {
    this.updateHUD(true);
    this.touch.refreshText();
  }

  showHint(text, seconds = 3) {
    this.hintBox.textContent = text;
    this.hintBox.classList.add('show');
    clearTimeout(this._hintTimer);
    this._hintTimer = setTimeout(() => this.hintBox.classList.remove('show'), seconds * 1000);
  }

  bigCall(text) {
    const n = el('div', { class: 'big-call', text });
    this.hud.append(n);
    this.later(1.2, () => n.remove());
  }

  popup(text, worldPos) {
    _v.copy(worldPos).project(this.camera);
    if (_v.z > 1) return;
    const x = (_v.x * 0.5 + 0.5) * this.engine.width;
    const y = (-_v.y * 0.5 + 0.5) * this.engine.height;
    const n = el('div', { class: 'popup', text, style: { left: `${x}px`, top: `${y}px` } });
    this.hud.append(n);
    this.later(0.95, () => n.remove());
  }

  // ---------------------------------------------------------
  // セリフ / ヒント
  // ---------------------------------------------------------
  callout(id, minGap = 2.5) {
    if (this.time - this.lastVoice < minGap || this.time - this.lastHint < 3.5) return;
    this.lastVoice = this.time;
    this.subs.say(id);
  }

  fireHint(h) {
    this.hintsDone.add(h.id);
    this.lastHint = this.time;
    this.lastVoice = this.time;
    this.subs.say(h.id);
  }

  fireHintEvent(kind, count = 1) {
    if (this.state !== 'play') return;
    for (const h of this.def.hints || []) {
      if (this.hintsDone.has(h.id) || h.when !== kind) continue;
      if (h.count && count < h.count) continue;
      this.fireHint(h);
      return;
    }
  }

  updateHints() {
    const pos = this.player.pos;
    for (const h of this.def.hints || []) {
      if (this.hintsDone.has(h.id)) continue;
      if (h.when === 'start' && this.stageTime >= (h.delay ?? 0)) {
        if (h.unlessSwitched && this.switchCount > 0) { this.hintsDone.add(h.id); continue; }
        if (this.time - this.lastHint < 2.5) continue;
        this.fireHint(h);
        return;
      }
      if (h.when === 'zone'
        && pos.x >= h.min[0] && pos.x <= h.max[0]
        && pos.y >= h.min[1] && pos.y <= h.max[1]
        && pos.z >= h.min[2] && pos.z <= h.max[2]) {
        this.fireHint(h);
        return;
      }
    }
  }

  // ---------------------------------------------------------
  // じゅうりょく きりかえ(タップ / クリック)
  // ---------------------------------------------------------
  pick(x, y) {
    _ndc.set((x / this.engine.width) * 2 - 1, -(y / this.engine.height) * 2 + 1);
    this.raycaster.setFromCamera(_ndc, this.camera);
    return this.level.raycast(this.raycaster.ray.origin, this.raycaster.ray.direction, 400);
  }

  handleTaps() {
    for (const tap of this.input.taps) {
      const hit = this.pick(tap.x, tap.y);
      if (!hit) { this.audio.sfx('gravity_fail'); continue; }
      const newG = hit.normal.clone().negate();
      if (newG.dot(this.player.gravity) > 0.99) {
        this.rings.spawn({ pos: hit.point, normal: hit.normal, color: '#ffffff', size: 0.8, life: 0.35 });
        continue;
      }
      if (!this.player.setGravity(newG)) continue;
      this.onSwitch(hit);
    }
  }

  onSwitch(hit) {
    const p = this.player;
    this.switchCount++;
    this.results.switches++;
    this.rig.setUp(hit.normal);
    this.audio.sfx('gravity');
    p.model.spin();
    p.model.squash(-0.35);

    // ねらった面に リング + きらきらの線
    this.rings.spawn({ pos: hit.point, normal: hit.normal, color: '#ff8fc0', size: 2.6, life: 0.6, width: 0.14, fill: 0.6 });
    this.later(0.12, () => this.rings.spawn({ pos: hit.point, normal: hit.normal, color: '#ffe27a', size: 4.2, life: 0.7, width: 0.08 }));
    const n = 26;
    for (let i = 0; i <= n; i++) {
      _v.lerpVectors(p.pos, hit.point, i / n);
      this.particles.emit({ pos: _v, count: 1, color: '#ff9cd0', color2: '#ffe27a', speed: 0.6, size: 0.28, life: 0.35 + (i / n) * 0.35, shape: 1 });
    }
    this.particles.emit({ pos: hit.point, count: 20, color: '#ffd1e8', color2: '#ffffff', speed: 5, size: 0.3, life: 0.6, drag: 3, shape: 1 });
    this.particles.emit({ pos: p.pos, count: 12, color: '#ffffff', speed: 4, size: 0.35, life: 0.4, drag: 4 });
    this.engine.postfx.pulseChroma(1.8);
    this.engine.postfx.pulseRadial(1.1);
    this.rig.shake(0.12);
    if (Math.random() < 0.35) this.callout(Math.random() < 0.5 ? 'vo_switch_1' : 'vo_switch_2', 5);
    this.fireHintEvent('switch', this.switchCount);
  }

  // ---------------------------------------------------------
  // できごと
  // ---------------------------------------------------------
  collectStar(star) {
    star.collected = true;
    star.visible = false;
    this.collected++;
    this.audio.sfx('star');
    this.engine.slowMo(0.12, 0.25);
    this.engine.postfx.doFlash('#fff2b0', 0.18, 1.5);
    this.particles.emit({ pos: star.position, count: 34, color: '#ffe066', color2: '#ffffff', speed: 7, size: 0.45, life: 0.9, drag: 2.5, shape: 1 });
    this.particles.emit({ pos: star.position, count: 10, color: '#fff3b0', speed: 2, size: 0.9, life: 0.5, drag: 3 });
    _v.subVectors(this.camera.position, star.position).normalize();
    this.rings.spawn({ pos: star.position, normal: _v, color: '#ffe27a', size: 2.8, life: 0.5, width: 0.12 });
    this.popup('+1', star.position);
    this.starChip.classList.remove('bump');
    void this.starChip.offsetWidth;
    this.starChip.classList.add('bump');
    this.updateHUD();

    const goal = this.level.goal;
    if (goal && !goal.open && this.collected >= goal.need) {
      goal.setOpen(true);
      this.later(0.4, () => {
        this.audio.sfx('goal_open');
        this.rings.spawn({ pos: goal.position, normal: goal.normal, color: '#ffe27a', size: 6, life: 1.0, width: 0.06 });
        this.particles.emit({ pos: goal.position, count: 40, color: '#ffe27a', color2: '#ffffff', speed: 6, size: 0.4, life: 1, drag: 2, shape: 1 });
        this.fireHintEvent('goalOpen');
      });
    } else {
      this.fireHintEvent('star', this.collected);
      this.callout(['vo_star_1', 'vo_star_2', 'vo_star_3'][Math.floor(Math.random() * 3)], 2);
    }
  }

  async respawn(reason) {
    if (this.state !== 'play') return;
    this.state = 'respawn';
    this.results.respawns++;
    const p = this.player;
    p.frozen = true;
    if (reason === 'fall') {
      this.audio.sfx('fall_out');
      this.callout('vo_oops', 0);
    } else if (reason === 'hazard') {
      this.callout('vo_ouch', 0);
    }
    this.particles.emit({ pos: p.pos, count: 24, color: '#ffffff', color2: '#bfe0ff', speed: 5, size: 0.4, life: 0.6, drag: 3 });
    p.model.visible = false;
    this.marker.visible = false;
    await this.wait(0.65);
    if (this._disposed) return;
    p.spawn(p.lastSafe.pos, p.lastSafe.gravity, p.facing);
    this.rig.setUp(p.up);
    p.model.visible = true;
    p.model.squash(-0.45);
    this.audio.sfx('respawn');
    this.rings.spawn({ pos: _v.copy(p.pos).addScaledVector(p.up, -0.43), normal: p.up, color: '#bfe0ff', size: 2.2, life: 0.6 });
    this.particles.emit({ pos: p.pos, count: 20, color: '#bfe0ff', color2: '#ffffff', speed: 3, size: 0.3, life: 0.6, shape: 1, drag: 2 });
    p.frozen = false;
    this.state = 'play';
  }

  async clearStage() {
    this.state = 'clear';
    const p = this.player;
    const goal = this.level.goal;
    p.frozen = true;
    this.results.stars[this.stageIndex] = this.collected;
    this.results.totals[this.stageIndex] = this.total;
    this.marker.visible = false;
    this.hoverMarker.visible = false;

    this.audio.sfx('goal');
    this.subs.say('stage_clear');
    p.model.setHappy(true);
    p.model.spin();
    this.engine.slowMo(0.35, 0.3);
    this.engine.postfx.doFlash('#fff6c8', 0.6, 1.2);
    this.engine.postfx.pulseRadial(1.5);
    for (let i = 0; i < 3; i++) {
      this.later(i * 0.15, () => this.rings.spawn({ pos: goal.position, normal: goal.normal, color: i % 2 ? '#ff9cc2' : '#ffe27a', size: 4 + i * 2.5, life: 0.9, width: 0.07 }));
    }
    this.particles.emit({ pos: goal.position, count: 80, color: '#ffe066', color2: '#ff9cd0', speed: 10, size: 0.5, life: 1.4, drag: 1.8, shape: 1 });
    this.bigCall(t('stageClear'));

    // ゴールに すいこまれる
    const start = p.model.position.clone();
    await this.wait(0.5);
    await this.tweens.to({
      duration: 1.1,
      ease: Ease.inOutCubic,
      onUpdate: (e) => {
        p.model.position.lerpVectors(start, goal.position, e);
        p.model.scale.setScalar(1 - e * 0.85);
        p.model.rotation.y += 0.25;
      },
    });
    if (this._disposed) return;
    p.model.visible = false;
    this.particles.emit({ pos: goal.position, count: 40, color: '#ffffff', color2: '#ffe27a', speed: 6, size: 0.4, life: 0.8, shape: 1 });
    this.audio.sfx('sparkle');
    await this.wait(1.2);
    if (this._disposed) return;

    const next = this.stageIndex + 1;
    if (next < CONFIG.stageOrder.length) {
      await this.ctx.manager.fader.to(1, 0.5, 'white');
      if (this._disposed) return;
      this.setupStage(next);
      this.ctx.manager.fader.to(0, 0.6, 'white');
      this.stageIntro();
    } else {
      this.ctx.manager.go('outro', { results: this.results }, { color: 'white', out: 0.8 });
    }
  }

  // ---------------------------------------------------------
  // ポーズ
  // ---------------------------------------------------------
  openPauseMenu() {
    if (this.paused || this.ui.hasModal() || !['play', 'intro'].includes(this.state)) return;
    this.paused = true;
    this.input.gameplay = false;
    this.input.reset();
    openPause(this.ui, {
      onResume: () => { this.paused = false; this.input.gameplay = true; this.pauseBlock = 0.3; },
      onRespawn: () => { this.paused = false; this.input.gameplay = true; this.respawn('manual'); },
      onRestart: async () => {
        await this.ctx.manager.fader.to(1, 0.4);
        this.paused = false;
        this.input.gameplay = true;
        this.setupStage(this.stageIndex);
        this.ctx.manager.fader.to(0, 0.5);
        this.stageIntro();
      },
      onTitle: () => { this.ctx.manager.go('title'); },
      onLangChange: () => this.refreshTexts(),
    });
  }

  // ---------------------------------------------------------
  // VFX ヘルパー
  // ---------------------------------------------------------
  emitDust(count, speed) {
    const p = this.player;
    _v.copy(p.pos).addScaledVector(p.up, -0.4);
    this.particles.emit({
      pos: _v, count: Math.round(count), spread: 0.5, color: this.def.palette.dust || '#ffffff', color2: '#ffffff',
      speed, size: 0.38, sizeEnd: 0.6, life: 0.5, drag: 5, gravity: _v2.copy(p.up).multiplyScalar(1.5),
    });
  }

  updateVFX(dt) {
    const p = this.player;
    // 落下中の すじ
    if (!p.grounded && p.fallSpeed > 9 && this.state === 'play') {
      for (let i = 0; i < 2; i++) {
        _v.copy(p.pos).add(_v2.set(rand(-0.4, 0.4), rand(-0.4, 0.4), rand(-0.4, 0.4)));
        this.particles.emit({ pos: _v, vel: _v2.copy(p.vel).multiplyScalar(-0.05), color: '#cfe6ff', size: 0.22, life: 0.35 });
      }
    }
    // ころがり ほこり
    this._dustT -= dt;
    if (p.grounded && p.speed01 > 0.55 && this._dustT <= 0) {
      this._dustT = 0.09;
      this.emitDust(1, 1);
    }
    // ただよう ひかり
    this._ambT -= dt;
    if (this._ambT <= 0) {
      this._ambT = 0.1;
      _v.copy(this.rig.focus).add(_v2.set(rand(-14, 14), rand(-10, 10), rand(-14, 14)));
      this.particles.emit({ pos: _v, color: '#ffffff', color2: '#ffe6a8', size: 0.14, life: 3, speed: 0.25 });
    }

    // 落下地点マーカー
    if (!p.grounded && this.state === 'play') {
      const hit = this.level.raycast(p.pos, p.gravity, 140);
      if (hit && hit.t > 1.2) this.marker.place(hit.point, hit.normal, hit.t, dt, '#ffffff');
      else this.marker.visible = false;
    } else {
      this.marker.visible = false;
    }

    // マウスの ねらい表示(PC)
    const hv = this.input.hover;
    let aim = false;
    if (!this.input.isTouch && hv.active && this.state === 'play' && !this.input.pointers.size) {
      const hit = this.pick(hv.x, hv.y);
      if (hit && hit.normal.dot(p.gravity) < 0.99 && -hit.normal.dot(p.gravity) < 0.99) {
        this.hoverMarker.place(hit.point, hit.normal, hit.t * 0.6, dt, '#ff8fc0');
        aim = true;
      }
    }
    if (!aim) this.hoverMarker.visible = false;
    this.engine.canvas.style.cursor = aim ? 'crosshair' : '';

    // スピードライン
    this.engine.postfx.speed = this.state === 'play' && !p.grounded ? clamp((p.fallSpeed - 11) / 14, 0, 1) : 0;
  }

  // ---------------------------------------------------------
  update(dt, rawDt) {
    this.touch.update();
    if (this.paused) { this.engine.postfx.speed = 0; return; }
    super.update(dt);
    if (!this.level) return;

    this.pauseBlock = Math.max(0, (this.pauseBlock || 0) - rawDt);
    if (this.input.pause && this.pauseBlock <= 0) this.openPauseMenu();

    this.level.update(dt, this.player);
    const p = this.player;

    if (this.state === 'play') {
      this.stageTime += dt;
      this.results.time += dt;
      this.handleTaps();
    }
    p.update(dt, this.input, this.rig.basis(), { easy: settings.get('easy') });

    if (this.state === 'play') {
      for (const s of this.level.stars) {
        if (!s.collected && s.position.distanceTo(p.pos) < s.radius + CONFIG.physics.radius) this.collectStar(s);
      }
      const goal = this.level.goal;
      if (goal && goal.position.distanceTo(p.pos) < goal.radius + CONFIG.physics.radius) {
        if (goal.open) this.clearStage();
        else if (this.time - this.lastLocked > 5) {
          this.lastLocked = this.time;
          this.showHint(t('goalLocked', { n: goal.need - this.collected }), 3);
          this.callout('goal_locked', 0);
        }
      }
      if (this.state === 'play' && this.level.isOut(p.pos)) this.respawn('fall');
      if (this.state === 'play') this.updateHints();
    }

    this.rig.update(dt, {
      focusPos: p.pos,
      look: this.state === 'play' ? this.input.look : null,
      level: this.level,
      speed: p.grounded ? 0 : p.fallSpeed,
      facing: p.facing,
      moving: p.grounded && p.speed01 > 0.3,
    });
    this.level.followLight(p.pos);
    this.updateVFX(dt);
    this.sky.update(dt, this.camera);
    this.decor.update(dt);
    this.updateHUD();
  }

  dispose() {
    clearTimeout(this._hintTimer);
    this.engine.postfx.speed = 0;
    this.engine.canvas.style.cursor = '';
    this.touchRoot.innerHTML = '';
    this.level?.dispose();
    this.player?.model.dispose();
    this.decor?.dispose();
    super.dispose();
  }
}
