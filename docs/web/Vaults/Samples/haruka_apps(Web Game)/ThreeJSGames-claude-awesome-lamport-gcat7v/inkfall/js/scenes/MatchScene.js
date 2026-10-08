// =========================================================
// MatchScene — 試合(オンライン / CPU戦 / ばくだん鬼 / 練習 / スコアチャレンジ)
// =========================================================
import * as THREE from 'three';
import { BaseScene } from './BaseScene.js';
import { CONFIG } from '../config.js';
import { Match, offlineNet } from '../game/Match.js';
import { CameraRig } from '../game/CameraRig.js';
import { LandingMarker } from '../vfx/Rings.js';
import { settings } from '../core/Settings.js';
import { t } from '../core/I18n.js';
import { clamp } from '../core/Tween.js';
import { el } from '../ui/UI.js';
import { Icons } from '../ui/Icons.js';
import { openPause } from '../ui/Panels.js';
import { TouchControls } from '../ui/TouchControls.js';
import { WD } from '../net/Wavedash.js';

const _v = new THREE.Vector3(), _w = new THREE.Vector3(), _ndc = new THREE.Vector2();
const fmt = (s) => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

export class MatchScene extends BaseScene {
  async enter({ cfg, online = false }) {
    this.cfg = cfg;
    this.mode = cfg.mode;
    this.online = online;
    this.paused = false;
    this.camera.fov = CONFIG.camera.fov;
    this.camera.near = 0.05;
    this.camera.updateProjectionMatrix();
    this.engine.postfx.setBloomParams({ strength: 0.85, radius: 0.5, threshold: 0.7 });

    // ライト
    const teams = settings.teams();
    this.scene.background = new THREE.Color('#07081a');
    this.scene.fog = new THREE.Fog('#0b0d24', 26, 70);
    this.scene.add(new THREE.HemisphereLight('#a8b8ff', '#3a2050', 1.25));
    const key = new THREE.DirectionalLight('#ffffff', 1.1);
    key.position.set(6, 30, 10);
    key.castShadow = this.engine.quality.shadows;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 70 });
    this.scene.add(key, key.target);
    for (const [x, c] of [[-11, teams[0].color], [11, teams[1].color]]) {
      const p = new THREE.PointLight(c, 40, 22, 1.5);
      p.position.set(x, 4, 0);
      this.scene.add(p);
    }

    this.setupFX();

    // 通信
    let netAdapter;
    if (online) {
      const s = this.net;
      netAdapter = {
        online: true,
        isHost: s.isHost,
        get selfId() { return s.selfId; },
        get hostId() { return s.hostId; },
        send: (obj) => s.send(null, obj),
        toHost: (obj) => s.toHost(obj),
        sendBytes: (rel, b) => s.sendBytes(null, rel, b),
        on: (k, f) => s.on(k, f),
        get maxPayload() { return WD.maxPayload; },
      };
    } else netAdapter = offlineNet();

    this.match = new Match({ cfg, net: netAdapter, fx: this._fx(), scene: this.scene });
    this.me = this.match.me;
    if (this.me) this.me.onJump = () => { this.audio.sfx('jump'); this.me.model.squash(-0.3); };
    this.rig = new CameraRig(this.camera);
    this.match.meBasis = this.rig.basis();
    this.aimMarker = new LandingMarker();
    this.scene.add(this.aimMarker);
    this.lastUp = new THREE.Vector3(0, 1, 0);
    this.spec = null;

    this.buildHUD();
    this.touch = document.body.classList.contains('touch') ? new TouchControls(document.getElementById('touch-root'), this.input, { mode: this.mode }) : null;
    document.body.classList.add('in-game');
    this.input.gameplay = true;
    this.input.wantLock = true;

    const bgm = { turf: 'match', tag: 'tag', training: 'training', challenge: 'match' }[this.mode];
    this.audio.playBGM(bgm);

    // 開幕(スタジアムを見せる)
    this.introT = 0;
    this.begun = false;
    this.showCard();

    if (online) {
      this._subs = [
        (() => { const f = (e) => { if (e.detail?.changeType === 'LEFT') { this.match.userLeft(e.detail.userId); this.feed(t('feed.left', { n: e.detail.username || 'Player' })); } }; this.net.addEventListener('users', f); return () => this.net.removeEventListener('users', f); })(),
      ];
      if (!this.match.isHost) this.later(0.6, () => this.net.send(this.net.hostId, { k: 'loaded' }));
      WD.presence('In match', this.mode === 'tag' ? 'Gravity Bomb Tag' : 'Turf War');
    }

    if (this.mode === 'training') this.setupTraining();
  }

  // =========================================================
  // 演出コールバック(Match から呼ばれる)
  // =========================================================
  _fx() {
    const near = (p) => (p ? clamp(1 - p.distanceTo(this.camera.position) / 28, 0.08, 1) : 1);
    return {
      shotFired: (a) => {
        if (a === this.me) { this.audio.sfx('shot', { minGap: 0.05 }); this.fx.muzzle(a.muzzle(_v), a.color); }
        else this.audio.sfx('shot', { volume: near(a.pos) * 0.5, minGap: 0.06 });
      },
      splat: (p, n, c, s) => { this.fx.splat(p, n, c, s); if (Math.random() < 0.35) this.audio.sfx('splat', { volume: near(p) * 0.6, minGap: 0.05 }); },
      hitConfirm: (owner) => { if (owner === this.me) this.hitMarker(); },
      hit: (v, a) => {
        if (a === this.me) { this.hitMarker(); this.audio.sfx('hit_confirm'); }
        if (v === this.me) { this.audio.sfx('hit'); this.engine.postfx.doFlash(v.color, 0.18, 2.5); this.rig.shake(0.12); }
      },
      myHp: (hp) => this.setHp(hp),
      inkout: (v, by) => {
        this.fx.inkout(v.pos, by ? by.color : v.color);
        this.audio.sfx('inkout', { volume: near(v.pos) });
        this.feed(`<b style="color:${by?.color || '#fff'}">${esc(by?.name || '???')}</b> ${Icons.fire} <b style="color:${v.color}">${esc(v.name)}</b>`, true);
        if (v === this.me) {
          this.big(t('inked', { n: by?.name || '' }), 'bad');
          this.engine.postfx.doFlash(by?.color || '#ffffff', 0.45, 1.5);
          this.respawnAt = performance.now() / 1000 + CONFIG.combat.respawnTime;
        }
        if (by === this.me) { this.toast(t('youInked', { n: v.name })); if (Math.random() < 0.5) this.subs.say('vo_splat'); }
      },
      respawn: (a) => {
        this.fx.respawn(a.pos, a.up, a.color);
        if (a === this.me) {
          this.rig.snap(a.up, a.pos, 0, CONFIG.camera.pitch);
          this.rig.faceDirection(a.aim);
          this.lastUp.copy(a.up);
          this.audio.sfx('respawn');
          this.respawnAt = 0;
          this.setHp(a.hp);
        }
      },
      flip: (a, forced) => {
        if (a === this.me) {
          if (forced) {
            this.rig.setUp(a.up);
            this.lastUp.copy(a.up);
            this.big(t('hijacked'), 'bad');
            this.audio.sfx('flip');
            this.engine.postfx.pulseChroma(2.4);
          }
          return;
        }
        this.fx.flipTrail(a.pos, a.color);
        this.audio.sfx('flip', { volume: near(a.pos) * 0.35, minGap: 0.1 });
      },
      land: (a, impact) => {
        if (a !== this.me || impact < 4) return;
        a.model.squash(Math.min(0.4, impact * 0.02));
        this.audio.sfx(impact > 14 ? 'land_big' : 'land', { volume: clamp(impact / 16, 0.3, 1) });
        if (impact > 12) this.rig.shake(Math.min(0.45, impact * 0.015));
      },
      stamp: (a, p, n) => {
        this.fx.stamp(p, n, a.color);
        this.audio.sfx('stamp', { volume: near(p) });
        const d = p.distanceTo(this.camera.position);
        if (d < 14) { this.rig.shake(0.5 * (1 - d / 14)); this.engine.postfx.pulseRadial(0.8 * (1 - d / 14)); }
        if (a === this.me) { this.big(t('stamp'), 'good'); this.subs.say('vo_stamp'); this.rig.kick(6); }
      },
      bombThrown: (a) => this.audio.sfx('bomb_throw', { volume: near(a.pos) }),
      bombBoom: (p, c) => {
        this.fx.bombBoom(p, c);
        this.audio.sfx('bomb_boom', { volume: near(p) });
        const d = p.distanceTo(this.camera.position);
        if (d < 18) { this.rig.shake(0.6 * (1 - d / 18)); this.engine.postfx.pulseChroma(2); }
      },
      overdrive: () => {
        this.big(t('overdrive'), 'od');
        this.audio.sfx('overdrive');
        this.audio.playBGM('overdrive');
        this.subs.say('ann_overdrive');
        this.hudRoot.classList.add('od');
        this.engine.postfx.doFlash('#ffffff', 0.25, 1.5);
      },
      phase: (m, prev) => this.onPhase(m, prev),
      end: (results) => this.onEnd(results),
      tagWave: (m) => {
        const names = m.holders.map((i) => this.match.actors[i]?.name).join(' / ');
        this.big(t('tag.wave', { n: names }), 'od');
        this.audio.sfx('tag_pass');
        if (m.holders.includes(this.me?.idx)) this.subs.say('vo_bomb_mine');
      },
      pass: (f, to) => {
        this.audio.sfx('tag_pass', { volume: to ? near(to.pos) : 1 });
        if (to) this.fx.splat(to.pos, to.up, '#ffb31f', 1.4);
        if (to === this.me) { this.big(t('tag.got'), 'bad'); this.engine.postfx.doFlash('#ffb31f', 0.3, 2); }
        if (f === this.me) this.toast(t('tag.passed', { n: to?.name || '' }));
      },
      boom: (a) => {
        this.fx.boom(a.pos);
        this.audio.sfx('tag_boom', { volume: near(a.pos) });
        this.feed(`${Icons.bomb} <b style="color:${a.color}">${esc(a.name)}</b> ${t('feed.out')}`, true);
        const d = a.pos.distanceTo(this.camera.position);
        this.rig.shake(Math.max(0, 0.7 * (1 - d / 20)));
        if (a === this.me) { this.big(t('tag.out'), 'bad'); this.subs.say('vo_boom'); }
      },
      shove: (a, p) => { this.fx.shove(p, a.up, a.color); this.audio.sfx('shove', { volume: near(p) }); },
    };
  }

  // =========================================================
  // 進行
  // =========================================================
  showCard() {
    const c = this.cfg;
    const teams = settings.teams();
    const card = el('div', { class: 'vs-card in' });
    if (this.mode === 'turf') {
      const side = (team) => el('div', { class: `vs-side t${team}`, style: { '--tc': teams[team - 1].color } },
        el('div', { class: 'vs-team', text: teams[team - 1].name }),
        ...c.slots.filter((s) => s.team === team).map((s) => el('div', { class: `vs-name${s.bot ? ' bot' : ''}`, text: s.name })));
      card.append(side(1), el('div', { class: 'vs-mid', text: 'VS' }), side(2));
    } else {
      card.append(el('div', { class: 'vs-title', text: t(`mode.${this.mode === 'tag' ? 'tagTitle' : this.mode}`) }));
      if (this.mode === 'tag') card.append(el('div', { class: 'vs-list', text: c.slots.map((s) => s.name).join(' · ') }));
    }
    this.hud.append(card);
    this.vsCard = card;
    this.subs.say({ turf: 'ann_turf', tag: 'ann_tag', training: 'navi_training', challenge: 'ann_challenge' }[this.mode]);
  }

  maybeBegin(dt) {
    if (this.begun) return;
    this.introT += dt;
    const m = this.match;
    if (!m.isHost) return;
    const humans = this.cfg.slots.filter((s) => !s.bot && s.id !== this.net?.selfId).map((s) => s.id);
    const allLoaded = !this.online || humans.every((id) => m.loaded.has(id));
    if (this.introT > 2.8 && (allLoaded || this.introT > 14)) {
      this.begun = true;
      m.hostBegin();
    }
  }

  onPhase(m) {
    if (this.vsCard) { this.vsCard.classList.add('out'); const c = this.vsCard; this.later(0.5, () => c.remove()); this.vsCard = null; }
    this.begun = true;
    if (m.phase === 'countdown') {
      this.hudRoot.classList.remove('od');
      if (m.round > 1) this.audio.playBGM('match');
      const roundLabel = this.mode === 'turf' ? (m.round >= this.match.rounds ? t('finalRound') : t('round', { n: m.round })) : '';
      if (roundLabel) this.big(roundLabel, 'info');
      if (this.mode === 'turf') this.subs.say(m.round >= this.match.rounds ? 'ann_final' : 'ann_round1');
      let n = 3;
      const tick = () => {
        if (this._disposed || this.match.phase !== 'countdown') return;
        this.countEl.textContent = String(n);
        this.countEl.className = 'count pop';
        this.audio.sfx('count');
        n--;
        if (n > 0) this.later(1, tick);
      };
      this.later(0.05, tick);
    } else if (m.phase === 'play') {
      this.countEl.textContent = this.mode === 'tag' ? 'RUN!' : 'INK!';
      this.countEl.className = 'count go';
      this.later(0.9, () => { this.countEl.className = 'count'; this.countEl.textContent = ''; });
      this.audio.sfx('go');
      this.engine.postfx.doFlash('#ffffff', 0.25, 2);
      if (this.mode !== 'training') this.subs.say('ann_go');
    } else if (m.phase === 'roundEnd') {
      this.audio.sfx('round_end');
      const teams = settings.teams();
      const pa = Math.round((m.a / m.tot) * 100), pb = Math.round((m.b / m.tot) * 100);
      const w = m.winner ? teams[m.winner - 1] : null;
      this.big(w ? t('roundWin', { n: w.name }) : t('draw'), 'info', w?.color);
      this.toast(`${teams[0].name} ${pa}%  —  ${pb}% ${teams[1].name}`);
      this.subs.say(m.winner === 1 ? 'ann_round_a' : m.winner === 2 ? 'ann_round_b' : 'ann_draw');
    }
  }

  onEnd(results) {
    this.audio.sfx('round_end');
    this.big(t('finish'), 'info');
    this.subs.say('ann_finish');
    this.input.exitLock();
    const owners = Array.from(this.match.arena.owner);
    this.later(2.2, () => this.ctx.manager.go('outro', { results: { ...results, owners }, cfg: this.cfg, online: this.online }, { out: 0.7 }));
  }

  // =========================================================
  // HUD
  // =========================================================
  buildHUD() {
    const s = this.ui.screen('hud-screen');
    s.style.padding = '0';
    const teams = settings.teams();
    this.hudRoot = s;
    this.hud = el('div', { class: `hud mode-${this.mode}` });
    const top = el('div', { class: 'hud-top' });
    if (this.mode === 'turf') {
      this.scoreBar = el('div', { class: 'scorebar', style: { '--ca': teams[0].color, '--cb': teams[1].color } },
        el('span', { class: 'sb-name a', text: teams[0].name }),
        el('div', { class: 'sb-track' }, el('div', { class: 'sb-a' }), el('div', { class: 'sb-b' }), el('div', { class: 'sb-mid' })),
        el('span', { class: 'sb-name b', text: teams[1].name }));
      this.sbA = this.scoreBar.querySelector('.sb-a');
      this.sbB = this.scoreBar.querySelector('.sb-b');
      this.pctA = el('span', { class: 'sb-pct a' });
      this.pctB = el('span', { class: 'sb-pct b' });
      this.scoreBar.prepend(this.pctA);
      this.scoreBar.append(this.pctB);
      top.append(el('div', { class: 'hud-center' }, this.scoreBar, el('div', { class: 'hud-time' }, (this.timeEl = el('span')), (this.roundEl = el('small')))));
    } else if (this.mode === 'tag') {
      top.append(el('div', { class: 'hud-center' }, el('div', { class: 'tag-fuse' }, el('span', { html: Icons.bomb }), (this.fuseEl = el('b'))), (this.aliveEl = el('div', { class: 'hud-sub' }))));
    } else if (this.mode === 'challenge') {
      top.append(el('div', { class: 'hud-center' }, el('div', { class: 'chal-score' }, (this.chalEl = el('b', { text: '0' })), el('small', { text: t('cells') })), el('div', { class: 'hud-time' }, (this.timeEl = el('span')))));
    } else {
      top.append(el('div', { class: 'hud-center' }, el('div', { class: 'hud-mode', text: t('mode.training') })));
    }
    const pauseBtn = this.ui.button({ icon: 'pause', cls: 'round ghost pause-btn', title: t('paused'), onClick: () => this.openPause() });
    pauseBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    top.append(el('div', { class: 'hud-right' }, pauseBtn));
    this.feedEl = el('div', { class: 'killfeed' });

    // 照準
    this.cross = el('div', { class: 'crosshair' }, el('i', { class: 'c1' }), el('i', { class: 'c2' }), el('i', { class: 'c3' }), el('i', { class: 'c4' }), el('b', { class: 'cdot' }));
    this.flipHint = el('div', { class: 'flip-hint' });
    this.countEl = el('div', { class: 'count' });
    this.bigEl = el('div', { class: 'big-msg' });
    this.toastEl = el('div', { class: 'toast' });
    this.respawnEl = el('div', { class: 'respawn-msg' });

    // 下
    const bottom = el('div', { class: 'hud-bottom' });
    if (this.mode !== 'tag') {
      this.hpFill = el('div', { class: 'hp-fill' });
      this.spFill = el('div', { class: 'sp-fill' });
      this.spLabel = el('span', { class: 'sp-label', text: t('special') });
      bottom.append(el('div', { class: 'hp-bar' }, this.hpFill), el('div', { class: 'sp-bar' }, this.spFill, this.spLabel));
    }
    if (!document.body.classList.contains('touch')) {
      bottom.append(el('div', { class: 'keys', html: t(this.mode === 'tag' ? 'keys.tag' : 'keys.turf') }));
    }
    this.lockHint = el('div', { class: 'lock-hint', text: t('clickToAim') });
    this.hud.append(top, this.feedEl, this.cross, this.flipHint, this.countEl, this.bigEl, this.toastEl, this.respawnEl, bottom, this.lockHint);
    s.append(this.hud);
    this.setHp(CONFIG.combat.hp);
  }

  setHp(hp) {
    if (this.hpFill) this.hpFill.style.width = `${clamp(hp / CONFIG.combat.hp, 0, 1) * 100}%`;
  }

  hitMarker() {
    this.cross.classList.remove('hit');
    void this.cross.offsetWidth;
    this.cross.classList.add('hit');
  }

  big(text, kind = 'info', color) {
    const n = el('div', { class: `big ${kind}`, text });
    if (color) n.style.color = color;
    this.bigEl.innerHTML = '';
    this.bigEl.append(n);
    clearTimeout(this._bigT);
    this._bigT = setTimeout(() => n.remove(), 1800);
  }

  toast(text) {
    const n = el('div', { class: 'toast-line', text });
    this.toastEl.append(n);
    setTimeout(() => n.remove(), 2200);
  }

  feed(html, isHtml = false) {
    const n = el('div', { class: 'feed-line' });
    if (isHtml) n.innerHTML = html; else n.textContent = html;
    this.feedEl.prepend(n);
    while (this.feedEl.children.length > 5) this.feedEl.lastChild.remove();
    setTimeout(() => n.remove(), 6000);
  }

  updateHUD() {
    const m = this.match;
    if (this.mode === 'turf') {
      const tot = m.score.tot || 1;
      const a = m.score.a / tot, b = m.score.b / tot;
      this.sbA.style.width = `${a * 100}%`;
      this.sbB.style.width = `${b * 100}%`;
      this.pctA.textContent = `${Math.round(a * 100)}%`;
      this.pctB.textContent = `${Math.round(b * 100)}%`;
      this.timeEl.textContent = fmt(m.phase === 'play' ? m.timeLeft : m.phase === 'countdown' ? m.duration : m.timeLeft);
      this.roundEl.textContent = `R${m.round || 1}/${m.rounds}  ${m.wins[1]}-${m.wins[2]}`;
    } else if (this.mode === 'tag') {
      this.fuseEl.textContent = m.phase === 'play' && m.tag.fuse < 60 ? Math.max(0, m.tag.fuse).toFixed(1) : '--';
      const alive = m.actors.filter((a) => !a.out).length;
      const holders = m.actors.filter((a) => a.holding).map((a) => a.name).join(' / ');
      this.aliveEl.textContent = `${t('tag.alive', { n: alive })}${holders ? `  ·  ${Icons ? '' : ''}${holders}` : ''}`;
      if (m.phase === 'play' && m.tag.fuse < 5 && m.tag.fuse > 0) {
        const s = Math.ceil(m.tag.fuse * 2);
        if (s !== this._tick) { this._tick = s; this.audio.sfx('tag_tick'); }
      }
    } else if (this.mode === 'challenge') {
      this.chalEl.textContent = String(m.arena.counts[1]);
      this.timeEl.textContent = fmt(m.timeLeft);
    }
    if (this.me && this.spFill) {
      this.spFill.style.width = `${Math.min(1, this.me.special) * 100}%`;
      const ready = this.me.special >= 1;
      if (ready && !this._spReady) { this.audio.sfx('special_ready'); this.toast(t('specialReady')); }
      this._spReady = ready;
      this.spLabel.classList.toggle('ready', ready);
    }
    if (this.respawnAt) {
      const r = this.respawnAt - performance.now() / 1000;
      this.respawnEl.textContent = r > 0 ? t('respawnIn', { n: r.toFixed(1) }) : '';
    } else this.respawnEl.textContent = '';
    this.lockHint.classList.toggle('show', !this.input.isTouch && !this.input.locked && !this.paused && !this.ui.hasModal());
    this.touch?.update({
      flipReady: this.me ? clamp(1 - this.me.flipCD / CONFIG.physics.flipCooldown, 0, 1) : 1,
      special: this.me?.special || 0,
      cooldownShove: this.me ? clamp(1 - (this.me.shoveCD || 0) / CONFIG.tag.shoveCooldown, 0, 1) : 1,
    });
  }

  // =========================================================
  // 操作
  // =========================================================
  canAct() {
    const m = this.match, me = this.me;
    return me && me.alive && !me.out && !(this.paused && !this.online) && !this.ui.hasModal() && (m.phase === 'play' || this.mode === 'training');
  }

  pickScreen(x, y) {
    _ndc.set((x / this.engine.width) * 2 - 1, -(y / this.engine.height) * 2 + 1);
    this.ray ||= new THREE.Raycaster();
    this.ray.setFromCamera(_ndc, this.camera);
    return this.match.arena.raycast(this.ray.ray.origin, this.ray.ray.direction, 120);
  }

  tryFlip(hit) {
    const me = this.me;
    if (!hit) { this.audio.sfx('flip_fail'); return false; }
    const g = hit.normal.clone().negate();
    if (g.dot(me.gravity) > 0.99 || me.flipCD > 0) { this.audio.sfx('flip_fail'); return false; }
    if (!this.match.flip(me, g)) return false;
    this.rig.setUp(hit.normal);
    this.lastUp.copy(me.up);
    this.flips = (this.flips || 0) + 1;
    this.audio.sfx('flip');
    this.engine.postfx.pulseChroma(1.8);
    this.engine.postfx.pulseRadial(0.9);
    this.fx.rings.spawn({ pos: hit.point, normal: hit.normal, color: me.color, size: 2.6, life: 0.55, width: 0.14, fill: 0.5 });
    for (let i = 0; i <= 18; i++) {
      _v.lerpVectors(me.pos, hit.point, i / 18);
      this.fx.particles.emit({ pos: _v, color: me.color, color2: '#ffffff', size: 0.25, life: 0.3 + i * 0.02, speed: 0.4, shape: 1 });
    }
    if (Math.random() < 0.25) this.subs.say('vo_flip');
    return true;
  }

  controlMe(dt) {
    const me = this.me, inp = this.input, m = this.match;
    if (!me) return;
    const act = this.canAct();
    me.ctrl.moveX = act ? inp.move.x : 0;
    me.ctrl.moveY = act ? inp.move.y : 0;
    me.ctrl.jump = act && inp.jump;
    me.ctrl.jumpHeld = act && inp.jumpHeld;
    me.aim.copy(this.rig.lookDir);

    // 照準の先
    const hit = m.arena.raycast(this.camera.position, this.rig.lookDir, 90);
    this.aimHit = hit;
    const aimPoint = hit ? hit.point : _w.copy(this.camera.position).addScaledVector(this.rig.lookDir, 60);
    const canFlipThere = hit && hit.normal.clone().negate().dot(me.gravity) < 0.99 && hit.t > 1.5;
    if (canFlipThere && act) {
      this.aimMarker.place(hit.point, hit.normal, Math.min(30, hit.t), dt, me.flipCD > 0 ? '#666a80' : me.color);
      this.flipHint.className = `flip-hint show${me.flipCD > 0 ? ' cd' : ''}`;
    } else {
      this.aimMarker.visible = false;
      this.flipHint.className = 'flip-hint';
    }

    if (!act) { me.firing = false; return; }
    if (this.mode === 'tag') {
      if (inp.special || (inp.fireHeld && !this._fireLatch)) m.shove(me);
      this._fireLatch = inp.fireHeld;
    } else {
      me.firing = inp.fireHeld;
      if (inp.fireHeld) m.fire(me, aimPoint);
      if (inp.special) { if (!m.throwBomb(me)) this.audio.sfx('flip_fail'); else this.bombs = (this.bombs || 0) + 1; }
    }
    if (inp.flip) this.tryFlip(hit);
    for (const tap of inp.taps) this.tryFlip(this.pickScreen(tap.x, tap.y));
  }

  openPause() {
    if (this.paused || this.ui.hasModal()) return;
    this.paused = true;
    this.input.exitLock();
    this.input.gameplay = false;
    openPause(this.ui, {
      online: this.online,
      onResume: () => { this.paused = false; this.input.gameplay = true; this.pauseBlock = 0.3; },
      onRestart: this.online ? null : () => this.ctx.manager.go('match', { cfg: this.ctx.makeSoloCfg(this.mode), online: false }),
      onLeave: async () => {
        if (this.online) await this.net.leave();
        this.ctx.manager.go('title');
      },
      onLangChange: () => {},
    });
  }

  // =========================================================
  // 練習モード
  // =========================================================
  setupTraining() {
    this.steps = [
      { id: 'move', line: 'navi_t_move', done: () => (this.moved || 0) > 6 },
      { id: 'look', line: 'navi_t_look', done: () => (this.looked || 0) > 1.5 },
      { id: 'paint', line: 'navi_t_paint', done: () => this.me.stats.cells > 40 },
      { id: 'flip', line: 'navi_t_flip', done: () => (this.flips || 0) >= 2 },
      { id: 'stamp', line: 'navi_t_stamp', done: () => this.me.stats.stamps >= 1 },
      { id: 'bomb', line: 'navi_t_bomb', done: () => (this.bombs || 0) >= 1, prep: () => { this.me.special = 1; } },
      { id: 'ink', line: 'navi_t_ink', done: () => this.me.stats.inks >= 1 },
    ];
    this.stepIdx = -1;
    this.stepEl = el('div', { class: 'training-panel' });
    this.hud.append(this.stepEl);
    this.later(3.2, () => this.nextStep());
  }

  nextStep() {
    this.stepIdx++;
    const s = this.steps[this.stepIdx];
    this.renderSteps();
    if (!s) {
      this.subs.say('navi_t_done');
      this.big(t('t.done'), 'good');
      this.audio.sfx('win');
      settings.set('seenTraining', true);
      return;
    }
    s.prep?.();
    this.subs.say(s.line);
  }

  renderSteps() {
    this.stepEl.innerHTML = '';
    this.stepEl.append(el('div', { class: 'tp-title', text: t('t.title') }));
    this.steps.forEach((s, i) => {
      this.stepEl.append(el('div', { class: `tp-step${i < this.stepIdx ? ' done' : i === this.stepIdx ? ' now' : ''}`, html: `${i < this.stepIdx ? Icons.check : `<em>${i + 1}</em>`}<span>${t(`t.${s.id}`)}</span>` }));
    });
  }

  updateTraining(dt) {
    if (!this.steps) return;
    const me = this.me;
    if (me.grounded && me.speed01 > 0.3) this.moved = (this.moved || 0) + me.speed01 * dt * 7;
    this.looked = (this.looked || 0) + Math.abs(this.input.look.x) + Math.abs(this.input.look.y);
    const s = this.steps[this.stepIdx];
    if (s && s.done()) {
      this.audio.sfx('special_ready');
      this.nextStep();
    }
  }

  // =========================================================
  update(dt) {
    super.update(dt);
    const now = performance.now() / 1000;
    const m = this.match;
    this.pauseBlock = Math.max(0, (this.pauseBlock || 0) - dt);
    if (this.input.pause && this.pauseBlock <= 0 && !this.paused) this.openPause();

    this.maybeBegin(dt);
    const frozen = this.paused && !this.online;
    if (!frozen) {
      this.controlMe(dt);
      m.update(dt, now);
      if (this.mode === 'training') this.updateTraining(dt);
    }

    // カメラ
    const me = this.me;
    let focus = me?.pos;
    if (me && me.out) {
      // 脱落したら観戦
      const alive = m.actors.filter((a) => !a.out && a.alive);
      if (!this.spec || this.spec.out) this.spec = alive[0] || null;
      if (this.input.jump || this.input.taps.length) { const k = alive.indexOf(this.spec); this.spec = alive[(k + 1) % alive.length] || null; }
      if (this.spec) { focus = this.spec.pos; if (this.spec.up.dot(this.lastUp) < 0.99) { this.rig.setUp(this.spec.up); this.lastUp.copy(this.spec.up); } }
    } else if (me && me.up.dot(this.lastUp) < 0.99) {
      this.rig.setUp(me.up);
      this.lastUp.copy(me.up);
    }
    if (!this.begun && m.phase === 'wait') {
      // 開幕: スタジアムをぐるっと
      const a = this.time * 0.25;
      this.camera.position.set(Math.cos(a) * 9, 9 + Math.sin(a * 0.7) * 2, Math.sin(a) * 9);
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(0, 6, 0);
    } else {
      const look = (!frozen && !this.ui.hasModal()) ? this.input.look : null;
      this.rig.update(dt, { focusPos: focus || m.arena.center, look, arena: m.arena });
    }

    // カメラが近すぎるときは自分のモデルを消す
    if (me && me.alive) me.model.root.visible = this.rig.curDist > 1.25 && me.model.root.visible;
    this.fx.drawShots(m.shots, m.bombs, dt);
    this.fx.ambient(m.arena.center, dt);
    this.engine.postfx.speed = me && !me.grounded && me.fallSpeed > 14 ? clamp((me.fallSpeed - 14) / 14, 0, 0.8) : 0;
    this.updateHUD();
  }

  dispose() {
    this._subs?.forEach((f) => f());
    clearTimeout(this._bigT);
    this.input.wantLock = false;
    this.input.exitLock();
    this.engine.postfx.speed = 0;
    this.touch?.dispose();
    this.match.dispose(this.scene);
    super.dispose();
  }
}

function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
