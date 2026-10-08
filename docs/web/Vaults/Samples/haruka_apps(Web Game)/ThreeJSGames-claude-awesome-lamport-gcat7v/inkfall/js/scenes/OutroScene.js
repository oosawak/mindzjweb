// =========================================================
// OutroScene — 結果発表
//  塗り終わったスタジアムの内側をぐるっと見せ、勝者を表彰台に。
// =========================================================
import * as THREE from 'three';
import { BaseScene } from './BaseScene.js';
import { Arena } from '../game/Arena.js';
import { Robot } from '../game/Robot.js';
import cube from '../game/arenas/cube.js';
import { settings } from '../core/Settings.js';
import { t } from '../core/I18n.js';
import { el } from '../ui/UI.js';
import { WD } from '../net/Wavedash.js';
import { CONFIG } from '../config.js';

export class OutroScene extends BaseScene {
  async enter({ results, cfg, online }) {
    this.results = results;
    this.cfg = cfg;
    this.online = online;
    this.camera.fov = 60;
    this.camera.updateProjectionMatrix();
    this.engine.postfx.setBloomParams({ strength: 0.9, radius: 0.55, threshold: 0.65 });
    const teams = settings.teams();
    this.teams = teams;
    this.scene.background = new THREE.Color('#07081a');
    this.scene.fog = new THREE.Fog('#0b0d24', 26, 70);
    this.scene.add(new THREE.HemisphereLight('#a8b8ff', '#3a2050', 1.3));
    const key = new THREE.DirectionalLight('#ffffff', 1.2);
    key.position.set(4, 30, 8);
    this.scene.add(key);
    this.spot = new THREE.PointLight('#ffffff', 120, 14, 1.4);
    this.spot.position.set(0, 15, 0);
    this.scene.add(this.spot);

    this.arena = new Arena(cube);
    this.arena.setTeamColors(teams[0].color, teams[1].color);
    this.scene.add(this.arena.group);
    this.setupFX();

    // 塗りを少しずつ見せる
    this.reveal = [];
    if (results.owners) results.owners.forEach((o, c) => { if (o === 1 || o === 2) this.reveal.push([c, o]); });
    this.reveal.sort(() => Math.random() - 0.5);
    this.revealRate = this.reveal.length / 2.4;

    // 表彰台の選手
    this.podium = [];
    const winners = this.winnerPlayers();
    winners.forEach((p, i) => {
      const r = new Robot(p.color, { name: p.name, showName: true });
      const a = (i / Math.max(1, winners.length)) * Math.PI * 2;
      r.position.set(Math.cos(a) * (winners.length > 1 ? 1.4 : 0), 10.5, Math.sin(a) * (winners.length > 1 ? 1.4 : 0));
      r.rotation.y = a + Math.PI / 2;
      this.scene.add(r);
      this.podium.push(r);
    });

    this.audio.playBGM('result');
    this.later(0.4, () => this.announce());
    this.later(2.6, () => this.showPanel());
  }

  winnerPlayers() {
    const r = this.results;
    if (r.mode === 'tag') return r.players.filter((p) => p.idx === r.winner);
    if (r.mode === 'challenge') return r.players;
    if (!r.winner) return [];
    return r.players.filter((p) => p.team === r.winner);
  }

  myTeam() {
    const me = this.results.players.find((p) => this.cfg.slots.find((s) => s.idx === p.idx && !s.bot && s.id === (this.online ? this.net.selfId : 'local')));
    return me;
  }

  announce() {
    const r = this.results;
    this.audio.sfx('win');
    this.engine.postfx.doFlash('#ffffff', 0.35, 1.5);
    if (r.mode === 'tag') this.subs.say('ann_tag_winner');
    else if (r.mode === 'challenge') this.subs.say('ann_chal_end');
    else this.subs.say(r.winner === 1 ? 'ann_win_a' : r.winner === 2 ? 'ann_win_b' : 'ann_draw_final');
  }

  async showPanel() {
    const r = this.results;
    const me = this.myTeam();
    const s = this.ui.screen('outro-screen');
    const card = el('div', { class: 'result-panel' });
    s.append(card);
    let headline = '', color = '#ffffff';
    if (r.mode === 'tag') {
      const w = r.players.find((p) => p.idx === r.winner);
      headline = w ? t('res.tagWin', { n: w.name }) : t('draw');
      color = w?.color || color;
    } else if (r.mode === 'challenge') {
      headline = t('res.challenge');
    } else if (r.winner) {
      headline = t('res.teamWin', { n: this.teams[r.winner - 1].name });
      color = this.teams[r.winner - 1].color;
    } else headline = t('draw');
    card.append(el('div', { class: 'res-head', text: headline, style: { color } }));
    if (me && r.mode === 'turf') {
      const won = r.winner === me.team;
      card.append(el('div', { class: `res-sub ${won ? 'win' : r.winner ? 'lose' : ''}`, text: won ? t('res.youWin') : r.winner ? t('res.youLose') : t('draw') }));
      this.later(1.2, () => this.subs.say(won ? 'navi_win' : r.winner ? 'navi_lose' : 'ann_draw_final'));
    }

    if (r.mode === 'turf') {
      const rounds = el('div', { class: 'res-rounds' });
      r.rounds.forEach((rd, i) => {
        const a = Math.round((rd.a / rd.tot) * 100), b = Math.round((rd.b / rd.tot) * 100);
        rounds.append(el('div', { class: 'res-round', style: { '--ca': this.teams[0].color, '--cb': this.teams[1].color } },
          el('span', { text: `R${i + 1}` }),
          el('div', { class: 'rr-bar' }, el('i', { class: 'a', style: { width: `${a}%` } }), el('i', { class: 'b', style: { width: `${b}%` } })),
          el('span', { class: 'rr-pct', text: `${a}% · ${b}%` })));
      });
      card.append(rounds);
    }

    if (r.mode === 'challenge') {
      const score = r.score;
      const better = settings.saveBest('challenge', score, true);
      card.append(el('div', { class: 'res-score' }, el('b', { text: String(score) }), el('small', { text: t('cells') })));
      card.append(el('div', { class: 'res-sub', text: better ? t('newBest') : `${t('best')}: ${settings.getBest().challenge}` }));
      const lb = el('div', { class: 'res-sub lb', text: WD.available ? t('lb.sending') : t('lb.offline') });
      card.append(lb);
      if (WD.available) {
        WD.submitScore(CONFIG.challenge.leaderboard, score)
          .then((e) => { lb.textContent = e?.submittedRank ? t('lb.rank', { n: e.submittedRank }) : t('lb.sent'); })
          .catch(() => { lb.textContent = t('lb.failed'); });
      }
    } else if (r.mode !== 'training') {
      const table = el('div', { class: 'res-table' });
      table.append(el('div', { class: 'rt-row head' }, el('span', { text: t('player') }), el('span', { text: r.mode === 'tag' ? t('rank') : t('cells') }), el('span', { text: r.mode === 'tag' ? '' : t('inks') }), el('span', { text: r.mode === 'tag' ? '' : t('stamps') })));
      let rows = [...r.players];
      if (r.mode === 'tag') {
        const order = [...r.order].reverse();
        rows.sort((x, y) => (x.idx === r.winner ? -1 : y.idx === r.winner ? 1 : order.indexOf(x.idx) - order.indexOf(y.idx)));
        rows.forEach((p, i) => table.append(el('div', { class: 'rt-row', style: { '--pc': p.color } }, el('span', { class: 'rt-name', text: p.name }), el('span', { text: `#${i + 1}` }), el('span'), el('span'))));
      } else {
        rows.sort((x, y) => y.cells - x.cells);
        const mvp = rows[0];
        rows.forEach((p) => table.append(el('div', { class: `rt-row${p === mvp ? ' mvp' : ''}`, style: { '--pc': p.color } },
          el('span', { class: 'rt-name', text: `${p === mvp ? 'MVP ' : ''}${p.name}` }), el('span', { text: String(p.cells) }), el('span', { text: String(p.inks) }), el('span', { text: String(p.stamps) }))));
      }
      card.append(table);
    }

    const btns = el('div', { class: 'res-btns' });
    const showEnding = !this.ctx.flags.endingShown;
    if (showEnding) btns.append(this.ui.button({ label: t('next'), icon: 'next', cls: 'primary', onClick: () => { this.ctx.flags.endingShown = true; this.ctx.manager.go('ending', { online: this.online, mode: this.cfg.mode, winnerColor: this.winnerColor() }); } }));
    if (this.online) {
      btns.append(this.ui.button({ label: t('backToLobby'), icon: 'users', cls: showEnding ? 'ghost' : 'primary', onClick: () => this.ctx.manager.go(this.net.active ? 'lobby' : 'title') }));
    } else {
      btns.append(this.ui.button({ label: t('playAgain'), icon: 'retry', cls: showEnding ? 'ghost' : 'primary', onClick: () => this.ctx.goDest(this.cfg.mode) }));
      btns.append(this.ui.button({ label: t('toTitle'), icon: 'home', cls: 'ghost', onClick: () => this.ctx.manager.go('title') }));
    }
    card.append(btns);
    if (this.online && this.net.isHost) this.net.setMeta({ phase: 'waiting' });
  }

  winnerColor() {
    const r = this.results;
    if (r.mode === 'tag') return r.players.find((p) => p.idx === r.winner)?.color || '#ffffff';
    if (r.mode === 'turf' && r.winner) return this.teams[r.winner - 1].color;
    return this.teams[0].color;
  }

  update(dt) {
    super.update(dt);
    // 塗りの公開
    if (this.reveal.length) {
      const n = Math.ceil(this.revealRate * dt);
      for (let i = 0; i < n && this.reveal.length; i++) {
        const [c, o] = this.reveal.pop();
        this.arena.setOwner(c, o, 1);
      }
      if (Math.random() < 0.5) this.audio.sfx('splat', { volume: 0.25, minGap: 0.08 });
    }
    this.arena.update(dt);
    const a = this.time * 0.18;
    this.camera.position.set(Math.cos(a) * 7.5, 12.5 + Math.sin(this.time * 0.3) * 0.8, Math.sin(a) * 7.5);
    this.camera.lookAt(0, 10.6, 0);
    for (const r of this.podium) {
      r.update(dt, { speed: 0, grounded: true, pitch: Math.sin(this.time * 4) * 0.4 });
      r.root.position.y = Math.abs(Math.sin(this.time * 4)) * 0.25;
    }
    if (Math.random() < dt * 3) {
      const p = new THREE.Vector3((Math.random() - 0.5) * 20, 3 + Math.random() * 12, (Math.random() - 0.5) * 20);
      this.fx.particles.emit({ pos: p, count: 40, color: this.winnerColor(), color2: '#ffffff', speed: 7, size: 0.5, life: 1.1, drag: 1.6, shape: 1, gravity: new THREE.Vector3(0, -4, 0) });
    }
  }

  dispose() {
    this.arena.dispose();
    this.podium.forEach((r) => r.dispose());
    super.dispose();
  }
}
