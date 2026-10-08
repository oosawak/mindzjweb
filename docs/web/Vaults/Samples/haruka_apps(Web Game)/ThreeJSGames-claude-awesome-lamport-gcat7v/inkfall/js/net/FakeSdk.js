// =========================================================
// FakeSdk — 開発用の「にせ Wavedash」
//  ?fakesdk=名前 を付けたときだけ有効。同じブラウザのタブ同士を
//  BroadcastChannel でつなぎ、ロビーと P2P を再現する。
//  本物の Wavedash 上では window.Wavedash があるので使われない。
// =========================================================

const EVENTS = {
  LOBBY_JOINED: 'LobbyJoined', LOBBY_USERS_UPDATED: 'LobbyUsersUpdated', LOBBY_DATA_UPDATED: 'LobbyDataUpdated',
  LOBBY_KICKED: 'LobbyKicked', LOBBY_INVITE: 'LobbyInvite', LOBBY_MESSAGE: 'LobbyMessage',
  P2P_CONNECTION_ESTABLISHED: 'P2PConnectionEstablished', P2P_CONNECTION_FAILED: 'P2PConnectionFailed',
  P2P_PEER_DISCONNECTED: 'P2PPeerDisconnected', P2P_PEER_RECONNECTING: 'P2PPeerReconnecting',
  P2P_PEER_RECONNECTED: 'P2PPeerReconnected', P2P_PACKET_DROPPED: 'P2PPacketDropped',
};

export function installFakeSdk(name) {
  const bc = new BroadcastChannel('inkfall-fake-wavedash');
  const me = `u_${name}`;
  const handlers = new Map();
  const queues = [[], []];
  const known = new Map();       // lobbyId → { lobby, seen }
  const boards = new Map();
  let lobby = null;              // 参加中のロビー(ホストなら正本)
  let pendingJoin = null;
  // 本物と同じく、P2P は入室から少し遅れてつながる。つながる前の送信は捨てられる。
  const P2P_DELAY = Number(new URLSearchParams(location.search).get('p2pdelay') ?? 1500);
  const established = new Set();
  const timers = new Map();

  const emit = (ev, payload) => { for (const f of handlers.get(ev) || []) setTimeout(() => f(payload), 0); };
  const isHost = () => lobby && lobby.hostId === me;
  const announce = () => { if (isHost()) bc.postMessage({ t: 'lobby', lobby }); };
  const user = (id) => ({ userId: id, username: id.replace(/^u_/, '') });
  const connect = (u) => {
    if (u.userId === me || established.has(u.userId) || timers.has(u.userId)) return;
    timers.set(u.userId, setTimeout(() => {
      timers.delete(u.userId);
      if (!lobby?.users.some((x) => x.userId === u.userId)) return;
      established.add(u.userId);
      emit(EVENTS.P2P_CONNECTION_ESTABLISHED, u);
    }, P2P_DELAY));
  };
  const disconnect = (id) => {
    clearTimeout(timers.get(id));
    timers.delete(id);
    if (established.delete(id)) emit(EVENTS.P2P_PEER_DISCONNECTED, user(id));
  };
  const dropAll = () => { for (const id of [...established, ...timers.keys()]) disconnect(id); };

  setInterval(announce, 800);

  bc.onmessage = (e) => {
    const m = e.data;
    if (m.t === 'lobby') {
      known.set(m.lobby.id, { lobby: m.lobby, seen: performance.now() });
      if (pendingJoin === m.lobby.id && m.lobby.users.some((u) => u.userId === me)) {
        lobby = structuredClone(m.lobby);
        pendingJoin = null;
        emit(EVENTS.LOBBY_JOINED, { lobbyId: lobby.id, hostId: lobby.hostId, users: lobby.users, metadata: lobby.data });
        for (const u of lobby.users) connect(u);
        return;
      }
      if (lobby && m.lobby.id === lobby.id && !isHost()) {
        const before = new Set(lobby.users.map((u) => u.userId));
        const after = new Set(m.lobby.users.map((u) => u.userId));
        const dataChanged = JSON.stringify(lobby.data) !== JSON.stringify(m.lobby.data);
        lobby = structuredClone(m.lobby);
        for (const u of m.lobby.users) if (!before.has(u.userId)) { emit(EVENTS.LOBBY_USERS_UPDATED, { ...u, changeType: 'JOINED' }); connect(u); }
        for (const id of before) if (!after.has(id)) { emit(EVENTS.LOBBY_USERS_UPDATED, { ...user(id), changeType: 'LEFT' }); disconnect(id); }
        if (dataChanged) emit(EVENTS.LOBBY_DATA_UPDATED, { ...lobby.data });
      }
    } else if (m.t === 'join' && isHost() && m.lobbyId === lobby.id) {
      if (!lobby.users.some((u) => u.userId === m.user.userId) && lobby.users.length < lobby.max) {
        lobby.users.push(m.user);
        emit(EVENTS.LOBBY_USERS_UPDATED, { ...m.user, changeType: 'JOINED' });
        connect(m.user);
      }
      announce();
    } else if (m.t === 'leave' && lobby && m.lobbyId === lobby.id) {
      if (m.userId === lobby.hostId && !isHost()) {
        // ホストがいなくなった
        const id = lobby.id;
        lobby = null;
        dropAll();
        emit(EVENTS.LOBBY_KICKED, { lobbyId: id, reason: 'ERROR' });
        return;
      }
      if (isHost()) {
        lobby.users = lobby.users.filter((u) => u.userId !== m.userId);
        emit(EVENTS.LOBBY_USERS_UPDATED, { ...user(m.userId), changeType: 'LEFT' });
        disconnect(m.userId);
        announce();
      }
    } else if (m.t === 'p2p' && m.from !== me && (m.to === me || (m.to === null && lobby && m.lobbyId === lobby.id)) && established.has(m.from)) {
      queues[m.ch].push({ fromUserId: m.from, channel: m.ch, payload: new Uint8Array(m.payload) });
    }
  };
  window.addEventListener('beforeunload', () => { if (lobby) bc.postMessage({ t: 'leave', lobbyId: lobby.id, userId: me }); });

  const ok = (data) => ({ success: true, data });

  window.Wavedash = {
    __fake: true,
    Events: EVENTS,
    LobbyVisibility: { PUBLIC: 0, FRIENDS_ONLY: 1, PRIVATE: 2 },
    LeaderboardSortOrder: { ASC: 0, DESC: 1 },
    LeaderboardDisplayType: { NUMERIC: 0, TIME_SECONDS: 1 },
    init: () => true,
    readyForEvents() {},
    updateLoadProgressZeroToOne() {},
    getUserId: () => me,
    getUsername: (id) => (id || me).replace(/^u_/, ''),
    getLaunchParams: () => ({}),
    getP2PMaxPayloadSize: () => 2004,
    on(ev, f) { const s = handlers.get(ev) || new Set(); s.add(f); handlers.set(ev, s); return () => s.delete(f); },
    off(ev, f) { handlers.get(ev)?.delete(f); },
    async createLobby(visibility, max = 8) {
      lobby = { id: `L_${Math.random().toString(36).slice(2, 8)}`, hostId: me, users: [user(me)], data: {}, max, hostUsername: name };
      announce();
      emit(EVENTS.LOBBY_JOINED, { lobbyId: lobby.id, hostId: me, users: lobby.users, metadata: lobby.data });
      return ok(lobby.id);
    },
    async joinLobby(id) {
      pendingJoin = id;
      bc.postMessage({ t: 'join', lobbyId: id, user: user(me) });
      return ok(true);
    },
    async leaveLobby(id) {
      if (lobby) bc.postMessage({ t: 'leave', lobbyId: lobby.id, userId: me });
      lobby = null;
      dropAll();
      return ok(id);
    },
    async listAvailableLobbies() {
      const now = performance.now();
      const list = [...known.values()].filter((k) => now - k.seen < 3000).map(({ lobby: l }) => ({
        lobbyId: l.id, playerCount: l.users.length, maxPlayers: l.max, hostUsername: l.hostUsername, metadata: l.data,
      }));
      return ok(list);
    },
    getLobbyUsers: () => (lobby ? lobby.users.map((u) => ({ ...u })) : []),
    getNumLobbyUsers: () => (lobby ? lobby.users.length : 0),
    getLobbyHostId: () => lobby?.hostId || null,
    getLobbyData: (id, k) => lobby?.data[k] ?? null,
    setLobbyData(id, k, v) {
      if (!isHost()) return false;
      if (v === null) delete lobby.data[k]; else lobby.data[k] = v;
      announce();
      emit(EVENTS.LOBBY_DATA_UPDATED, { ...lobby.data });
      return true;
    },
    async getLobbyInviteLink() { return ok(`${location.origin}${location.pathname}?fakesdk=friend&lobby=${lobby?.id || ''}`); },
    p2pManager: { isPeerReady: (id) => established.has(id) },
    sendP2PMessage(to, ch = 0, reliable = true, payload) { if (!established.has(to)) return false; bc.postMessage({ t: 'p2p', from: me, to, ch, lobbyId: lobby?.id, payload: Array.from(payload) }); return true; },
    broadcastP2PMessage(ch = 0, reliable = true, payload) { if (!established.size) return false; bc.postMessage({ t: 'p2p', from: me, to: null, ch, lobbyId: lobby?.id, payload: Array.from(payload) }); return true; },
    readP2PMessageFromChannel: (ch) => queues[ch]?.shift() || null,
    async updateUserPresence() { return ok(true); },
    async getOrCreateLeaderboard(n) { if (!boards.has(n)) boards.set(n, []); return ok({ id: n }); },
    async uploadLeaderboardScore(id, score) {
      const b = boards.get(id) || [];
      const e = b.find((x) => x.userId === me);
      if (e) e.score = Math.max(e.score, score); else b.push({ userId: me, username: name, score });
      b.sort((x, y) => y.score - x.score);
      boards.set(id, b);
      return ok({ submittedScore: score, submittedRank: b.findIndex((x) => x.userId === me) + 1 });
    },
    async listLeaderboardEntries(id, offset, limit) { return ok((boards.get(id) || []).slice(offset, offset + limit).map((e, i) => ({ ...e, globalRank: i + 1 }))); },
  };
  return window.Wavedash;
}
