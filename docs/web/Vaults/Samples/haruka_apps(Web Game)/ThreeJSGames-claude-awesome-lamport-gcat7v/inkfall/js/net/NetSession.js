// =========================================================
// NetSession + Lobby — オンライン対戦のロビーとメッセージ配送
//  ・ホスト固定(ホストが抜けたら試合終了)
//  ・ロビーの設定(モード / 進行状態)はロビーデータに保存
//  ・参加者の名簿(チーム / 準備完了)はホストが管理して全員に配る
// =========================================================
import { CONFIG } from '../config.js';
import { WD } from './Wavedash.js';
import { MSG, encodeJSON, decodeJSON } from './Wire.js';

export class NetSession extends EventTarget {
  constructor() {
    super();
    this.handlers = new Map();
    this.lobbyId = null;
    this.hostId = null;
    this.users = [];
    this.metadata = {};
    this.reachable = new Set();
    this.roster = [];          // [{id, name, team, ready}]
    this.mode = 'turf';
    this.busy = false;
    this.error = '';
    this.list = [];
    this._subs = [];
    this._waiting = null;
    this.started = false;
    this.myReady = false;      // 自分の準備完了(ゲスト側の正本)
    this._lastSync = 0;
  }

  get available() { return WD.available; }
  get active() { return !!this.lobbyId; }
  get selfId() { return WD.userId; }
  get isHost() { return this.active && this.hostId === this.selfId; }
  get others() { return this.users.filter((u) => u.userId !== this.selfId); }
  get allConnected() { return this.others.every((u) => this.reachable.has(u.userId)); }

  changed() { this.dispatchEvent(new Event('change')); }

  // ---------- メッセージ ----------
  on(kind, fn) {
    const set = this.handlers.get(kind) || new Set();
    set.add(fn);
    this.handlers.set(kind, set);
    return () => set.delete(fn);
  }

  _dispatch(kind, msg, from) {
    for (const fn of this.handlers.get(kind) || []) {
      try { fn(msg, from); } catch (e) { console.error('[net]', kind, e); }
    }
  }

  send(to, obj) {
    if (!this.active) return false;
    const bytes = encodeJSON(obj);
    return to ? WD.send(to, true, bytes) : WD.broadcast(true, bytes);
  }

  sendBytes(to, reliable, bytes) {
    if (!this.active) return false;
    return to ? WD.send(to, reliable, bytes) : WD.broadcast(reliable, bytes);
  }

  /** ホストへ送る(自分がホストなら自分で受け取る) */
  toHost(obj) {
    if (this.isHost) { this._dispatch(obj.k, obj, this.selfId); return true; }
    return this.send(this.hostId, obj);
  }

  /** 全員へ送り、自分でも受け取る */
  broadcastAll(obj) {
    this.send(null, obj);
    this._dispatch(obj.k, obj, this.selfId);
  }

  update() {
    if (!this.active) return;
    this._syncPeers();
    WD.poll((from, payload) => {
      if (!payload?.byteLength) return;
      if (!this.users.some((u) => u.userId === from)) return; // ロビー外からは受け取らない
      if (payload[0] === MSG.JSON) {
        const obj = decodeJSON(payload);
        if (obj?.k) this._dispatch(obj.k, obj, from);
      } else {
        this._dispatch('#bin', payload, from);
      }
    });
  }

  // ---------- ロビー ----------
  start() {
    if (this.started || !WD.available) return;
    this.started = true;
    const on = (n, f) => this._subs.push(WD.on(n, f));
    on('LOBBY_JOINED', (p) => this._joined(p));
    on('LOBBY_USERS_UPDATED', (p) => this._usersChanged(p));
    on('LOBBY_DATA_UPDATED', (p) => { if (this.active) { this.metadata = { ...p }; this.mode = p.mode || this.mode; this.changed(); } });
    on('LOBBY_KICKED', (p) => { if (p.lobbyId === this.lobbyId) { this._reset(); this.error = 'kicked'; this.changed(); this.dispatchEvent(new Event('closed')); } });
    for (const n of ['P2P_CONNECTION_ESTABLISHED', 'P2P_PEER_RECONNECTED']) on(n, (p) => this._peerUp(p?.userId));
    for (const n of ['P2P_PEER_DISCONNECTED', 'P2P_CONNECTION_FAILED', 'P2P_PEER_RECONNECTING']) on(n, (p) => { this.reachable.delete(p?.userId); this.changed(); });

    // 名簿のやりとり
    this.on('roster', (m, from) => {
      if (from !== this.hostId || this.isHost) return;
      this.roster = m.roster;
      this.mode = m.mode;
      // ホストの名簿と自分の準備状態がずれていたら送り直す
      const me = this.roster.find((r) => r.id === this.selfId);
      if (me && me.ready !== this.myReady) { me.ready = this.myReady; this.send(this.hostId, { k: 'ready', ready: this.myReady }); }
      this.changed();
    });
    this.on('ready', (m, from) => { if (this.isHost) { const r = this.roster.find((x) => x.id === from); if (r) { r.ready = !!m.ready; this._pushRoster(); } } });
    this.on('team', (m, from) => {
      if (!this.isHost) return;
      const r = this.roster.find((x) => x.id === from);
      if (r && (m.team === 1 || m.team === 2) && this.roster.filter((x) => x.team === m.team).length < CONFIG.turf.teamSize) { r.team = m.team; this._pushRoster(); }
    });
    this.on('hello', (m, from) => { if (this.isHost) { const r = this.roster.find((x) => x.id === from); if (r && m.name) r.name = String(m.name).slice(0, 20); this._pushRoster(); } });
  }

  _joined(p) {
    if (!p?.lobbyId) return;
    if (!this._waiting) { if (p.lobbyId !== this.lobbyId) WD.request('leaveLobby', p.lobbyId).catch(() => {}); return; }
    this.lobbyId = p.lobbyId;
    this.hostId = p.hostId;
    this.users = p.users || [];
    this.metadata = { ...(p.metadata || {}) };
    this.mode = this.metadata.mode || 'turf';
    this.myReady = false;
    this._waiting.resolve();
    // P2P はこのあと少し遅れてつながる。つながる前に送ったものは SDK に捨てられるので、
    // 名簿・あいさつは _peerUp(接続できたとき)で送る。
    if (this.isHost) this._rebuildRoster();
    this._syncPeers(true);
    this.changed();
  }

  /** 相手との P2P が使えるようになった */
  _peerUp(id) {
    if (!id || !this.active || id === this.selfId) return;
    const fresh = !this.reachable.has(id);
    this.reachable.add(id);
    if (fresh) {
      if (this.isHost) this.send(id, { k: 'roster', roster: this.roster, mode: this.mode });
      else if (id === this.hostId) this._greetHost();
    }
    this.changed();
  }

  _greetHost() {
    this.send(this.hostId, { k: 'hello', name: WD.username() || 'Player', v: CONFIG.netVersion });
    this.send(this.hostId, { k: 'ready', ready: this.myReady });
  }

  /**
   * 接続状態を SDK に直接たずねて合わせる(イベントの取りこぼし対策)。
   * あわせて、ロビー待機中はホストが名簿を、ゲストがあいさつを定期的に送り直す。
   */
  _syncPeers(force = false) {
    const now = performance.now();
    if (!force && now - this._lastSync < 500) return;
    const tick = Math.floor(now / 2000) !== Math.floor(this._lastSync / 2000);
    this._lastSync = now;
    for (const u of this.others) {
      const ok = WD.peerReady(u.userId);
      if (ok === true) this._peerUp(u.userId);
      else if (ok === false && this.reachable.delete(u.userId)) this.changed();
    }
    if (!tick || (this.metadata.phase && this.metadata.phase !== 'waiting')) return;
    if (this.isHost) { if (this.others.length) this.send(null, { k: 'roster', roster: this.roster, mode: this.mode }); }
    else if (this.reachable.has(this.hostId) && !this.roster.some((r) => r.id === this.selfId)) this._greetHost();
  }

  _usersChanged(p) {
    if (!this.active) return;
    const w = WD.sdk;
    this.users = w.getLobbyUsers(this.lobbyId) || [];
    const newHost = w.getLobbyHostId(this.lobbyId);
    if (p?.changeType === 'LEFT') this.reachable.delete(p.userId);
    if (p?.changeType === 'LEFT' && p.userId === this.hostId) {
      // ホストが抜けた: 試合は終了。ロビーからも出る
      this.dispatchEvent(new CustomEvent('hostleft'));
      this.leave().catch(() => {});
      return;
    }
    this.hostId = newHost || this.hostId;
    this.dispatchEvent(new CustomEvent('users', { detail: p }));
    if (this.isHost) this._rebuildRoster();
    this.changed();
  }

  _rebuildRoster() {
    const ids = new Set(this.users.map((u) => u.userId));
    this.roster = this.roster.filter((r) => ids.has(r.id));
    for (const u of this.users) {
      if (this.roster.some((r) => r.id === u.userId)) continue;
      const a = this.roster.filter((r) => r.team === 1).length;
      const b = this.roster.filter((r) => r.team === 2).length;
      this.roster.push({ id: u.userId, name: u.username || WD.username(u.userId) || 'Player', team: a <= b ? 1 : 2, ready: u.userId === this.selfId });
    }
    this._pushRoster();
  }

  _pushRoster() {
    if (!this.isHost) return;
    this.send(null, { k: 'roster', roster: this.roster, mode: this.mode });
    this.changed();
  }

  async _enter(method, ...args) {
    if (this.busy) throw new Error('busy');
    if (this.active) throw new Error('already in lobby');
    this.start();
    this.busy = true;
    this.error = '';
    this.changed();
    let timer;
    const confirmed = new Promise((resolve, reject) => {
      this._waiting = { resolve, reject };
      timer = setTimeout(() => reject(new Error('timeout')), 15000);
    });
    try {
      await Promise.all([WD.request(method, ...args), confirmed]);
      if (method === 'createLobby') {
        this.setMeta({ ver: CONFIG.netVersion, mode: this.mode, phase: 'waiting', game: 'inkfall' });
      } else {
        if (this.metadata.ver !== undefined && this.metadata.ver !== CONFIG.netVersion) throw new Error('version');
        if (this.metadata.phase && this.metadata.phase !== 'waiting') throw new Error('playing');
      }
    } catch (e) {
      this.error = e.message;
      if (this.active) { try { await WD.request('leaveLobby', this.lobbyId); } catch { /* noop */ } this._reset(); }
      throw e;
    } finally {
      clearTimeout(timer);
      this._waiting = null;
      this.busy = false;
      this.changed();
    }
  }

  create(mode = 'turf') {
    this.mode = mode;
    const vis = WD.sdk?.LobbyVisibility?.PUBLIC ?? 0;
    return this._enter('createLobby', vis, CONFIG.tag.maxPlayers);
  }

  join(id) {
    if (typeof id !== 'string' || !id.trim()) return Promise.reject(new Error('id'));
    return this._enter('joinLobby', id.trim());
  }

  async refreshList() {
    this.start();
    const list = (await WD.request('listAvailableLobbies')) || [];
    this.list = list.map((l) => ({
      id: l.lobbyId || l._id || l.id,
      host: l.hostUsername || l.name || 'Lobby',
      count: l.playerCount ?? l.numUsers ?? l.users?.length ?? '?',
      max: l.maxPlayers ?? CONFIG.tag.maxPlayers,
      meta: l.metadata || {},
    })).filter((l) => l.id);
    this.changed();
    return this.list;
  }

  /** あいているロビーに入る。なければ作る */
  async quickMatch(mode = 'turf') {
    const list = await this.refreshList().catch(() => []);
    const ok = list.find((l) => (l.meta.phase || 'waiting') === 'waiting' && (l.meta.ver ?? CONFIG.netVersion) === CONFIG.netVersion && (l.meta.game ?? 'inkfall') === 'inkfall' && (typeof l.count !== 'number' || l.count < l.max));
    if (ok) {
      try { await this.join(ok.id); return; } catch { /* 作る */ }
    }
    await this.create(mode);
  }

  async inviteLink() {
    try { return await WD.request('getLobbyInviteLink', true); } catch { return null; }
  }

  async joinFromLaunch() {
    const id = WD.sdk?.getLaunchParams?.()?.lobby || new URLSearchParams(location.search).get('lobby');
    if (id && !this.active) { await this.join(id); return true; }
    return false;
  }

  setMeta(values) {
    if (!this.isHost) return;
    for (const [k, v] of Object.entries(values)) {
      WD.sdk.setLobbyData(this.lobbyId, k, v);
      this.metadata[k] = v;
    }
    if (values.mode) { this.mode = values.mode; this._pushRoster(); }
    this.changed();
  }

  setReady(ready) {
    this.myReady = !!ready;
    const me = this.roster.find((r) => r.id === this.selfId);
    if (me) me.ready = ready;
    if (this.isHost) this._pushRoster(); else this.send(this.hostId, { k: 'ready', ready });
    this.changed();
  }

  switchTeam() {
    const me = this.roster.find((r) => r.id === this.selfId);
    if (!me) return;
    const team = me.team === 1 ? 2 : 1;
    if (this.isHost) {
      if (this.roster.filter((x) => x.team === team).length < CONFIG.turf.teamSize) { me.team = team; this._pushRoster(); }
    } else this.send(this.hostId, { k: 'team', team });
  }

  async leave() {
    if (!this.active) return;
    const id = this.lobbyId;
    this._reset();
    this.changed();
    try { await WD.request('leaveLobby', id); } catch { /* noop */ }
  }

  _reset() {
    this.lobbyId = null;
    this.hostId = null;
    this.users = [];
    this.metadata = {};
    this.roster = [];
    this.reachable.clear();
  }

  nameOf(id) {
    return this.roster.find((r) => r.id === id)?.name || this.users.find((u) => u.userId === id)?.username || WD.username(id) || 'Player';
  }
}
