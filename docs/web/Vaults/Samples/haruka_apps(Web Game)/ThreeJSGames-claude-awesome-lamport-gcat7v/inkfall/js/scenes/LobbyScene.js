// =========================================================
// LobbyScene — オンライン対戦のロビー
//  クイックマッチ / ロビー作成 / ID で参加 / 一覧 / 招待リンク
//  ロビー内: モード選択(ホスト)・チーム・準備完了・開始
// =========================================================
import { BaseScene } from './BaseScene.js';
import { buildBackdrop } from './Backdrop.js';
import { CONFIG } from '../config.js';
import { settings } from '../core/Settings.js';
import { t } from '../core/I18n.js';
import { el } from '../ui/UI.js';
import { Icons } from '../ui/Icons.js';
import { WD } from '../net/Wavedash.js';

export const BOT_NAMES = ['VOLT', 'MOCHA', 'PIXEL', 'NOVA', 'BOLT', 'ECHO', 'RIOT', 'KIWI', 'ZIGZAG', 'LUMEN'];

export function buildSlots(mode, humans, { bots = true } = {}) {
  const slots = [];
  let idx = 0, b = 0;
  const botName = () => `${BOT_NAMES[b++ % BOT_NAMES.length]}`;
  if (mode === 'tag') {
    for (const h of humans) slots.push({ idx: idx++, id: h.id, name: h.name, team: 0 });
    const target = bots ? Math.max(CONFIG.tag.minPlayers, Math.min(6, humans.length + 3)) : humans.length;
    while (slots.length < Math.min(target, CONFIG.tag.maxPlayers)) slots.push({ idx: idx++, bot: true, name: botName(), team: 0 });
    return slots;
  }
  for (const team of [1, 2]) {
    const mine = humans.filter((h) => h.team === team);
    for (const h of mine) slots.push({ idx: idx++, id: h.id, name: h.name, team });
    if (bots) for (let k = mine.length; k < CONFIG.turf.teamSize; k++) slots.push({ idx: idx++, bot: true, name: botName(), team });
  }
  return slots;
}

export class LobbyScene extends BaseScene {
  async enter({ autoJoin } = {}) {
    this.camera.fov = 50;
    this.camera.updateProjectionMatrix();
    this.back = buildBackdrop(this.scene, { size: 18, fill: 0.25 });
    this.setupFX(500);
    this.audio.playBGM('lobby');
    this.screen = this.ui.screen('lobby-screen');
    this.panel = el('div', { class: 'lobby-panel' });
    this.screen.append(this.panel);
    this._onChange = () => this.render();
    this.net.addEventListener('change', this._onChange);
    this.net.start();
    if (this.net.active) {
      if (this.net.isHost) {
        this.net.setMeta({ phase: 'waiting' });
        this.net.roster.forEach((r) => { r.ready = r.id === this.net.selfId; });
        this.net._pushRoster();
      } else this.net.setReady(false);
      WD.presence('In lobby', 'INKFALL');
    }
    this.render();
    if (autoJoin) this.run(() => this.net.join(autoJoin));
    else if (!this.net.active) this.net.joinFromLaunch().catch((e) => this.err(e));
  }

  err(e) {
    const map = { timeout: 'err.timeout', version: 'err.version', playing: 'err.playing', busy: 'err.busy', id: 'err.id' };
    this.errorText = t(map[e?.message] || 'err.generic');
    this.audio.sfx('flip_fail');
    this.render();
  }

  async run(fn) {
    this.errorText = '';
    try { await fn(); this.audio.sfx('lobby_join'); } catch (e) { this.err(e); }
    this.render();
  }

  render() {
    if (this._disposed) return;
    const n = this.net;
    const p = this.panel;
    p.innerHTML = '';
    const head = el('div', { class: 'lp-head' }, el('span', { class: 'lp-title', html: `${Icons.online}<b>${t('online')}</b>` }));
    p.append(head);
    if (this.errorText) p.append(el('div', { class: 'lp-error', text: this.errorText }));

    if (!n.active) {
      const modeSel = el('div', { class: 'seg mode-seg' });
      this.newMode ||= 'turf';
      for (const m of ['turf', 'tag']) {
        const b = el('button', { type: 'button', class: this.newMode === m ? 'on' : '', text: t(m === 'turf' ? 'mode.turf' : 'mode.tagTitle') });
        b.addEventListener('click', () => { this.newMode = m; this.audio.sfx('ui_toggle'); this.render(); });
        modeSel.append(b);
      }
      const idInput = el('input', { class: 'lp-input', placeholder: t('lobbyId'), maxlength: 128, value: this.idDraft || '' });
      idInput.addEventListener('input', () => { this.idDraft = idInput.value; });
      p.append(
        el('div', { class: 'lp-section', text: t('mode') }), modeSel,
        el('div', { class: 'lp-actions' },
          this.ui.button({ label: t('quickMatch'), icon: 'play', cls: 'primary', onClick: () => this.run(() => n.quickMatch(this.newMode)) }),
          this.ui.button({ label: t('createLobby'), icon: 'users', cls: 'ghost', onClick: () => this.run(() => n.create(this.newMode)) })),
        el('div', { class: 'lp-join' }, idInput, this.ui.button({ label: t('join'), icon: 'next', cls: 'ghost small', onClick: () => this.run(() => n.join(this.idDraft || '')) })),
        el('div', { class: 'lp-section' }, t('publicLobbies'), this.ui.button({ icon: 'refresh', cls: 'round ghost small', title: t('refresh'), onClick: () => this.run(() => n.refreshList()) })),
      );
      const list = el('div', { class: 'lp-list' });
      for (const l of n.list) {
        const b = el('button', { class: 'lp-room', type: 'button' },
          el('span', { text: l.host }), el('small', { text: `${t(l.meta.mode === 'tag' ? 'mode.tagTitle' : 'mode.turf')} · ${l.count}/${l.max}` }));
        b.addEventListener('click', () => this.run(() => n.join(l.id)));
        list.append(b);
      }
      if (!n.list.length) list.append(el('div', { class: 'lp-empty', text: t('noLobbies') }));
      p.append(list, el('div', { class: 'lp-foot' }, this.ui.button({ label: t('back'), icon: 'back', cls: 'ghost small', sfx: 'ui_back', onClick: () => this.ctx.manager.go('title') })));
      if (n.busy) p.append(el('div', { class: 'lp-busy', text: t('connecting') }));
      return;
    }

    // ---- ロビーの中 ----
    const mode = n.mode;
    const me = n.roster.find((r) => r.id === n.selfId);
    head.append(el('span', { class: 'lp-id', text: `ID ${n.lobbyId}` }),
      this.ui.button({ icon: 'link', label: t('invite'), cls: 'ghost small', onClick: async () => { const link = await n.inviteLink(); this.inviteText = link ? t('inviteCopied') : t('err.generic'); this.render(); } }));
    if (this.inviteText) p.append(el('div', { class: 'lp-note', text: this.inviteText }));

    const modeRow = el('div', { class: 'seg mode-seg' });
    for (const m of ['turf', 'tag']) {
      const b = el('button', { type: 'button', class: mode === m ? 'on' : '', text: t(m === 'turf' ? 'mode.turf' : 'mode.tagTitle') });
      b.disabled = !n.isHost;
      b.addEventListener('click', () => { n.setMeta({ mode: m }); this.audio.sfx('ui_toggle'); });
      modeRow.append(b);
    }
    const botsOn = n.metadata.bots !== false;
    const botBtn = el('button', { type: 'button', class: `chip-toggle${botsOn ? ' on' : ''}`, text: `${t('fillCpu')}: ${botsOn ? t('on') : t('off')}` });
    botBtn.disabled = !n.isHost;
    botBtn.addEventListener('click', () => { n.setMeta({ bots: !botsOn }); this.audio.sfx('ui_toggle'); });
    p.append(el('div', { class: 'lp-section', text: t('mode') }), modeRow, botBtn);

    const teams = settings.teams();
    const memberRow = (r) => el('div', { class: `lp-member${r.ready ? ' ready' : ''}` },
      el('span', { class: 'lm-name', text: `${r.name}${r.id === n.selfId ? ` (${t('you')})` : ''}` }),
      r.id === n.hostId ? el('span', { class: 'lm-tag', text: t('host') }) : null,
      el('span', { class: 'lm-state', html: n.reachable.has(r.id) || r.id === n.selfId ? (r.ready ? Icons.check : '…') : '⌛' }));
    if (mode === 'turf') {
      const cols = el('div', { class: 'lp-teams' });
      for (const team of [1, 2]) {
        const c = el('div', { class: 'lp-team', style: { '--tc': teams[team - 1].color } }, el('div', { class: 'lt-name', text: teams[team - 1].name }));
        const members = n.roster.filter((r) => r.team === team);
        members.forEach((r) => c.append(memberRow(r)));
        if (botsOn) for (let k = members.length; k < CONFIG.turf.teamSize; k++) c.append(el('div', { class: 'lp-member bot', text: 'CPU' }));
        cols.append(c);
      }
      p.append(cols);
    } else {
      const list = el('div', { class: 'lp-team single' });
      n.roster.forEach((r) => list.append(memberRow(r)));
      p.append(list);
    }

    const humans = n.roster.length;
    const allReady = n.roster.every((r) => r.ready);
    const canStart = n.isHost && allReady && n.allConnected && (humans >= 2 || botsOn);
    const actions = el('div', { class: 'lp-actions' });
    if (me) actions.append(this.ui.button({ label: me.ready ? t('notReady') : t('ready'), icon: 'check', cls: me.ready ? 'ghost' : 'primary', onClick: () => n.setReady(!me.ready) }));
    if (mode === 'turf') actions.append(this.ui.button({ label: t('switchTeam'), icon: 'team', cls: 'ghost', onClick: () => n.switchTeam() }));
    if (n.isHost) {
      const start = this.ui.button({ label: t('start'), icon: 'play', cls: 'primary big-start', onClick: () => this.hostStart() });
      start.disabled = !canStart;
      actions.append(start);
    }
    p.append(actions);
    const note = n.isHost
      ? (canStart ? t('hostCanStart') : (n.allConnected ? t('waitReady') : t('waitPeers')))
      : (me ? t('waitHost') : t('connectingHost'));
    p.append(el('div', { class: 'lp-note', text: note }));
    p.append(el('div', { class: 'lp-foot' }, this.ui.button({ label: t('leave'), icon: 'back', cls: 'danger small', sfx: 'ui_back', onClick: async () => { await n.leave(); this.render(); } })));
  }

  hostStart() {
    const n = this.net;
    if (!n.isHost) return;
    const botsOn = n.metadata.bots !== false;
    const slots = buildSlots(n.mode, n.roster, { bots: botsOn });
    const cfg = { mode: n.mode, arena: 'cube', slots, rounds: CONFIG.turf.rounds, duration: CONFIG.turf.duration, seed: Math.floor(Math.random() * 1e9) };
    n.setMeta({ phase: 'playing' });
    n.broadcastAll({ k: 'start', cfg });
  }

  update(dt) {
    super.update(dt);
    const a = this.time * 0.08;
    this.camera.position.set(Math.cos(a) * 38, 10 + Math.sin(a * 2) * 3, Math.sin(a) * 38);
    this.camera.lookAt(0, 0, 0);
    this.back.update(dt, this.camera);
  }

  dispose() {
    this.net.removeEventListener('change', this._onChange);
    this.back.dispose();
    super.dispose();
  }
}
