// =========================================================
// Wavedash — SDK との境界
//  Wavedash 上では SDK が window.Wavedash に自動で注入される。
//  それ以外(GitHub Pages / ローカル)ではすべて「なにもしない」動作になる。
//  ※ SDK のコードはリポジトリに含めない(Apache-2.0 / © Wavedash)
// =========================================================

export const CH_RELIABLE = 0;
export const CH_FAST = 1;

class WavedashBridge {
  constructor() {
    this._inited = false;
    this.unsubs = [];
  }

  get sdk() { return typeof window !== 'undefined' ? window.Wavedash : undefined; }
  get available() { return !!this.sdk; }
  get isFake() { return !!this.sdk?.__fake; }

  /** 読み込み完了後に 1 回だけ呼ぶ */
  init() {
    if (this._inited) return true;
    const w = this.sdk;
    if (!w) return false;
    try {
      const ok = w.init({ p2p: { enableReliableChannel: true, enableUnreliableChannel: true, messageSize: 2048, maxIncomingMessages: 1024 } });
      this._inited = ok !== false;
      return this._inited;
    } catch (e) { console.warn('[wavedash] init', e); return false; }
  }

  progress(v) {
    try { this.sdk?.updateLoadProgressZeroToOne?.(Math.max(0, Math.min(1, v))); } catch { /* noop */ }
  }

  get userId() { try { return this.sdk?.getUserId?.() || null; } catch { return null; } }
  username(id) {
    try { return (id ? this.sdk?.getUsername?.(id) : this.sdk?.getUsername?.()) || null; } catch { return null; }
  }

  on(name, fn) {
    const w = this.sdk;
    const ev = w?.Events?.[name];
    if (!w || ev === undefined) return () => {};
    const off = w.on(ev, fn);
    return typeof off === 'function' ? off : () => w.off?.(ev, fn);
  }

  async request(method, ...args) {
    const w = this.sdk;
    if (typeof w?.[method] !== 'function') throw new Error('Wavedash is not available');
    const res = await w[method](...args);
    if (res?.success === false) throw new Error(res.error?.message || res.message || `${method} failed`);
    return res && typeof res === 'object' && 'success' in res ? res.data : res;
  }

  get maxPayload() {
    try { return this.sdk?.getP2PMaxPayloadSize?.() ?? 2004; } catch { return 2004; }
  }

  /** P2P の通り道が開いているか(わからない SDK では null) */
  peerReady(id) {
    try {
      const f = this.sdk?.p2pManager?.isPeerReady;
      return typeof f === 'function' ? !!f.call(this.sdk.p2pManager, id) : null;
    } catch { return null; }
  }

  send(to, reliable, bytes) {
    const w = this.sdk;
    if (!w || bytes.byteLength > this.maxPayload) return false;
    try { return w.sendP2PMessage(to, reliable ? CH_RELIABLE : CH_FAST, reliable, bytes) !== false; } catch { return false; }
  }

  broadcast(reliable, bytes) {
    const w = this.sdk;
    if (!w || bytes.byteLength > this.maxPayload) return false;
    try { return w.broadcastP2PMessage(reliable ? CH_RELIABLE : CH_FAST, reliable, bytes) !== false; } catch { return false; }
  }

  /** 届いたメッセージを全部読む */
  poll(cb) {
    const w = this.sdk;
    if (!w?.readP2PMessageFromChannel) return;
    for (const ch of [CH_RELIABLE, CH_FAST]) {
      for (let i = 0; i < 512; i++) {
        let m;
        try { m = w.readP2PMessageFromChannel(ch); } catch { m = null; }
        if (!m) break;
        cb(m.fromUserId, m.payload, ch);
      }
    }
  }

  async presence(status, details = '') {
    try { await this.sdk?.updateUserPresence?.({ status, details }); } catch { /* noop */ }
  }

  // ---------- リーダーボード(ソロのスコアチャレンジだけ) ----------
  async submitScore(name, score) {
    const w = this.sdk;
    if (!w?.getOrCreateLeaderboard) return null;
    const desc = w.LeaderboardSortOrder?.DESC ?? 1;
    const numeric = w.LeaderboardDisplayType?.NUMERIC ?? 0;
    const lb = await this.request('getOrCreateLeaderboard', name, desc, numeric);
    return this.request('uploadLeaderboardScore', lb.id ?? lb._id ?? lb.leaderboardId, Math.round(score), true);
  }

  async topScores(name, limit = 10) {
    const w = this.sdk;
    if (!w?.getOrCreateLeaderboard) return [];
    const desc = w.LeaderboardSortOrder?.DESC ?? 1;
    const numeric = w.LeaderboardDisplayType?.NUMERIC ?? 0;
    const lb = await this.request('getOrCreateLeaderboard', name, desc, numeric);
    const list = await this.request('listLeaderboardEntries', lb.id ?? lb._id ?? lb.leaderboardId, 0, limit, false);
    return Array.isArray(list) ? list : list?.entries || [];
  }
}

export const WD = new WavedashBridge();
