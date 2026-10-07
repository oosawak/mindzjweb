/* =========================================================
 *  CHEAT JANKI! — 無法地帯ルール層（UI 非依存）
 *  Game (game.js) を拡張:
 *    - 反則技はゲージを払えば必ず成功（疑い・罰則なし）
 *    - キャラ固有技（相手も派手に使ってくる）
 *    - 卓が荒れるイベント（1局に2回）
 *    - でっち上げ役（言葉カードを組み合わせて存在しない役を作る。役なしでも和了れる）
 *  ui 追加インターフェース:
 *    await ui.event('aiCheat' | 'sig' | 'chaos' | 'frozenTurn' | 'checkpoint' | 'tableFlip' | 'fakeYaku', data)
 *    await ui.askFlip(wins, tsumo) -> 'flip' | 'no'
 *    await ui.askFake({ p, words, tags, mul }) -> [wordId...] | null（null ならおまかせ）
 * ========================================================= */
(function (root) {
  'use strict';
  const MJ = root.MJ || require('./mahjong.js');
  const { Game } = root.GameMod || require('./game.js');
  const Cheats = root.Cheats || require('../data/cheats.js');
  const Words = root.Words || require('../data/words.js');
  const Chaos = root.Chaos || require('../data/chaos.js');
  const { SIG_COST, GAUGE_MAX, GAUGE_GAIN, GAUGE_START } = Cheats;
  const COST = {}; for (const c of Cheats.CHEATS) COST[c.id] = c.cost;
  const EVENT_IDS = Chaos.EVENTS.map(e => e.id);
  const RULE_IDS = Chaos.RULES.map(r => r.id);
  const FAKE_CAP = 6;                         // でっち上げ役の上限（謎ルールで2倍になると12）

  class RiotGame extends Game {
    constructor(cfg) {
      super(cfg);
      this.lastRoundWind = 0;                       // 東風戦固定
      this.allowNoYaku = true;                      // でっち上げ役があるので役なしでも和了れる
      this.chars = this.players.map(p => p.char || null);
      this.gauge = new Array(this.n).fill(GAUGE_START);
      this.words = this.players.map(() => []);
      this.style = this.players.map(() => ({ cheats: 0, sigs: 0, fakeTotal: 0, best: null }));
      this.extraDoraTypes = new Set();
      this.rule = null; this.payMul = 1; this.fakeMul = 1;
      this.riot = { exposed: new Map(), stunned: new Set(), frozen: new Set(), luck: new Map(), turnNo: 0, plan: [], done: [], cheatedHand: new Set() };
      this.handsDone = 0;
    }
    /** 東風戦の進捗 */
    progress() {
      const idx = ((this.dealer - this.firstDealer + this.n) % this.n) + 1;
      return { index: idx, total: this.n, isLast: idx === this.n };
    }
    /** 無法地帯なのでハコ割れでも東風戦を最後まで続ける */
    advance(res) { const f = this.fever; this.fever = true; const r = super.advance(res); this.fever = f; return r; }

    async playHand() {
      const R = this.riot;
      R.exposed = new Map(); R.stunned.clear(); R.frozen.clear(); R.luck.clear(); R.cheatedHand.clear();
      R.done = [];
      this.extraDoraTypes = new Set();
      this.rule = null; this.payMul = 1; this.fakeMul = 1;
      for (let p = 0; p < this.n; p++) while (this.words[p].length < 3) this.giveWord(p);
      // この局のイベント（2回）
      const ids = EVENT_IDS.slice();
      for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(this.rng() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
      const t1 = R.turnNo + 5 + Math.floor(this.rng() * 8), t2 = R.turnNo + 18 + Math.floor(this.rng() * 12);
      R.plan = [{ id: ids[0], at: t1 }, { id: ids[1], at: t2 }];
      const res = await super.playHand();
      if (res.type !== 'abort') this.handsDone++;
      return res;
    }

    /* ---------------- 言葉カード ---------------- */
    giveWord(p) {
      const W = Words.WORDS;
      const r = this.rng();
      const cat = r < 0.25 ? 'pre' : r < 0.5 ? 'suf' : 'core';
      const pool = W.filter(w => w.cat === cat);
      const w = pool[Math.floor(this.rng() * pool.length)];
      this.words[p].push(w.id);
      if (this.words[p].length > Words.MAX_HAND) this.words[p].shift();
      return w.id;
    }

    /* ---------------- フック ---------------- */
    async afterDraw(p, drawnId) {
      const R = this.riot, pl = this.h.players[p];
      R.turnNo++;
      this.gauge[p] = Math.min(GAUGE_MAX, this.gauge[p] + GAUGE_GAIN);
      this.giveWord(p);
      pl.lastDraw = drawnId;
      if (p === 0) R.stunned.clear();
      if (!pl.human && !pl.riichi && this.remaining() > 3) {
        if (this.gauge[p] >= SIG_COST && this.rng() < 0.3) {
          const r = this.doSig(p);
          if (r) await this.ui.event('sig', r);
        } else if (this.gauge[p] >= 1 && this.rng() < 0.18) {
          const k = this.aiSwap(p);
          if (k) { this.gauge[p] -= 1; this.style[p].cheats++; R.cheatedHand.add(p); await this.ui.event('aiCheat', { p, kind: k }); }
        }
      }
      return pl.hand.includes(drawnId) ? null : pl.hand[pl.hand.length - 1];
    }
    async afterDiscard(cur, resp) {
      const R = this.riot;
      const pending = resp && (resp.call || (resp.rons && resp.rons.length));   // 鳴き・ロンの処理前に卓をいじらない
      if (!pending && R.plan.length && R.turnNo >= R.plan[0].at && this.remaining() > 4) {
        const ev = R.plan.shift();
        await this.runEvent(ev.id);
      }
      await this.ui.event('checkpoint', {});
    }
    isStunned(p) { return this.riot.stunned.has(p) || this.riot.frozen.has(p); }
    async forceDecision(p, opt) {
      if (!this.riot.frozen.has(p)) return null;
      this.riot.frozen.delete(p);
      await this.ui.event('frozenTurn', { p });
      const id = opt.drawnId != null && opt.discardable.includes(opt.drawnId) ? opt.drawnId : opt.discardable[opt.discardable.length - 1];
      return { action: 'discard', id };
    }
    applyLuck(p) {
      const R = this.riot, h = this.h;
      const n = R.luck.get(p) || 0;
      if (n <= 0) return super.applyLuck(p);
      const pl = h.players[p];
      const best = this.bestFromList(pl, this.liveIndices(), true);
      if (best) [h.wall[h.drawPtr], h.wall[best.k]] = [h.wall[best.k], h.wall[h.drawPtr]];
      R.luck.set(p, n - 1);
    }
    async beforeWin(wins, tsumo) {
      if (!this.h.players[0].human || !wins.some(w => w.p !== 0)) return null;
      if (this.gauge[0] < COST.flip) return null;
      const r = await this.ui.askFlip(wins, tsumo);
      if (r !== 'flip') return null;
      this.gauge[0] -= COST.flip;
      this.style[0].cheats++;
      this.h.voided = true;
      await this.ui.event('tableFlip', { wins });
      return 'flip';
    }

    /* ---------------- 評価ヘルパー ---------------- */
    liveIndices() { const h = this.h, r = []; for (let k = h.drawPtr; k < h.liveEnd; k++) r.push(k); return r; }
    /** 手牌で一番いらない牌のインデックス */
    worstIndex(pl) {
      const c = MJ.countsFromIds(pl.hand), m = pl.melds.length;
      let best = -1, bestSh = 99, bestIso = -99;
      for (let i = 0; i < pl.hand.length; i++) {
        const t = pl.hand[i] >> 2;
        c[t]--;
        const sh = MJ.shanten(c, m);
        c[t]++;
        const near = t < 27 && ((t % 9 > 0 && c[t - 1] > 0) || (t % 9 < 8 && c[t + 1] > 0));
        const iso = (c[t] === 1 ? 2 : 0) + (t >= 27 ? 1 : 0) + (near ? -1 : 1);
        if (sh < bestSh || (sh === bestSh && iso > bestIso)) { best = i; bestSh = sh; bestIso = iso; }
      }
      return best;
    }
    /** 一番大事な牌（抜くと向聴数が一番悪くなる牌）のインデックス */
    keyIndex(pl) {
      const c = MJ.countsFromIds(pl.hand), m = pl.melds.length;
      let best = -1, worst = -99;
      for (let i = 0; i < pl.hand.length; i++) {
        const t = pl.hand[i] >> 2;
        c[t]--;
        const sh = MJ.shanten(c, m);
        c[t]++;
        if (sh > worst) { worst = sh; best = i; }
      }
      return best;
    }
    /** 候補（壁の位置）から、一番いらない牌と入れ替えると向聴数が一番良くなるもの */
    bestFromList(pl, wallIdx, allowEqual) {
      const h = this.h, m = pl.melds.length;
      const wi = this.worstIndex(pl);
      if (wi < 0) return null;
      const base = pl.hand.slice(); base.splice(wi, 1);
      const c = MJ.countsFromIds(base);
      const cur = MJ.shanten(MJ.countsFromIds(pl.hand), m);
      let best = null;
      for (const k of wallIdx) {
        const t = h.wall[k] >> 2;
        if (c[t] >= 4) continue;
        c[t]++;
        const sh = MJ.shanten(c, m);
        c[t]--;
        if ((sh < cur || (allowEqual && sh <= cur)) && (!best || sh < best.sh)) best = { k, sh, wi };
      }
      return best;
    }
    /** 任意の牌ID候補（他人の手牌・河）から一番欲しいもの */
    bestFromIds(pl, ids) {
      const m = pl.melds.length, wi = this.worstIndex(pl);
      if (wi < 0) return null;
      const base = pl.hand.slice(); base.splice(wi, 1);
      const c = MJ.countsFromIds(base);
      let best = null;
      for (const id of ids) {
        const t = id >> 2;
        if (c[t] >= 4) continue;
        c[t]++;
        const sh = MJ.shanten(c, m);
        c[t]--;
        if (!best || sh < best.sh) best = { id, sh, wi };
      }
      return best;
    }

    /* ---------------- AI の小さなイカサマ ---------------- */
    aiSwap(p) {
      const pl = this.h.players[p];
      const b = this.bestFromList(pl, this.liveIndices(), false);
      if (!b) return null;
      this.swapHandWithWall(pl, b.wi, b.k);
      pl.hand = MJ.sortIds(pl.hand);
      return 'swap';
    }

    /* ---------------- 人間の反則技（必ず成功） ---------------- */
    cheatBlockedReason(id, p) {
      p = p || 0;
      const h = this.h; if (!h) return 'nohand';
      if (id === 'flip') return 'nouse';
      if (id === 'sig' && !this.chars[p]) return 'nouse';
      if (this.gauge[p] < (id === 'sig' ? SIG_COST : COST[id])) return 'gauge';
      if (id === 'swap' && this.remaining() < 1) return 'wall';
      if (id === 'raid' && !this.raidable().length) return 'river';
      if (id === 'dora' && h.doraCount >= 5) return 'dora';
      return null;
    }
    /** ゲージを払う */
    pay(id, p) {
      p = p || 0;
      this.gauge[p] -= id === 'sig' ? SIG_COST : COST[id];
      if (id === 'sig') this.style[p].sigs++; else this.style[p].cheats++;
      this.riot.cheatedHand.add(p);
    }
    swapCandidates(count) {
      const h = this.h; const res = [];
      for (let k = h.drawPtr; k < Math.min(h.liveEnd, h.drawPtr + (count || 6)); k++) res.push({ wallIndex: k, id: h.wall[k] });
      return res;
    }
    doSwap(handId, wallIndex) {
      const h = this.h, pl = h.players[0];
      const i = pl.hand.indexOf(handId);
      if (i < 0 || wallIndex < h.drawPtr || wallIndex >= h.liveEnd) return null;
      const inId = h.wall[wallIndex];
      this.swapHandWithWall(pl, i, wallIndex);
      return { inId, outId: handId, wallIndex };
    }
    raidable() {
      const res = [];
      this.h.players.forEach((pl, q) => pl.discards.forEach((d, idx) => { if (!d.called) res.push({ p: q, idx, id: d.id }); }));
      return res;
    }
    doRaid(handId, q, idx, p) {
      const pl = this.h.players[p || 0];
      const d = this.h.players[q].discards[idx];
      const i = pl.hand.indexOf(handId);
      if (!d || d.called || i < 0) return null;
      const inId = d.id;
      pl.hand[i] = inId;
      d.id = handId;
      return { inId, outId: handId, p: q, idx };
    }
    doDora(p) {
      const h = this.h, pl = h.players[p || 0];
      if (h.doraCount >= 5) return null;
      const slot = h.deadStart + 8 - 2 * h.doraCount;
      const all = pl.hand.concat(...pl.melds.map(m => m.ids));
      const c = MJ.countsFromIds(all);
      const order = [...Array(34).keys()].filter(t => c[t] > 0).sort((a, b) => c[b] - c[a]);
      for (const t of order) {
        const inds = [...Array(34).keys()].filter(it => MJ.doraFromIndicator(it, this.is3p) === t);
        for (let k = h.drawPtr; k < h.liveEnd; k++) {
          if (!inds.includes(h.wall[k] >> 2)) continue;
          [h.wall[slot], h.wall[k]] = [h.wall[k], h.wall[slot]];
          h.doraCount++;
          return { id: h.wall[slot], t, gain: c[t] };
        }
      }
      return null;
    }
    doSlam(p) {
      p = p || 0;
      const R = this.riot, h = this.h;
      const exposed = {};
      for (let q = 0; q < this.n; q++) {
        if (q === p) continue;
        const hand = h.players[q].hand.slice();
        for (let i = hand.length - 1; i > 0; i--) { const j = Math.floor(this.rng() * (i + 1)); [hand[i], hand[j]] = [hand[j], hand[i]]; }
        const set = R.exposed.get(q) || new Set();
        for (const id of hand.slice(0, 3)) set.add(id);
        R.exposed.set(q, set);
        exposed[q] = [...set];
        R.stunned.add(q);
      }
      return exposed;
    }
    /** 手牌が変わったあとに自分の手番の選択肢を作り直す（opt は game.js と共有） */
    refreshOpt(opt, newDrawnId) {
      if (newDrawnId !== undefined) opt.drawnId = newDrawnId;
      const pl = this.h.players[0];
      if (opt.drawnId != null && !pl.hand.includes(opt.drawnId)) opt.drawnId = pl.hand[pl.hand.length - 1];
      const afterDraw = opt._afterDraw != null ? opt._afterDraw : opt.drawnId != null;
      const fresh = this.selfOptions(0, opt.drawnId, afterDraw, false);
      Object.assign(opt, fresh, { _afterDraw: afterDraw });
      return opt;
    }

    /* ---------------- キャラ固有技 ---------------- */
    doSig(p) {
      const ch = this.chars[p]; if (!ch || this.gauge[p] < SIG_COST) return null;
      const h = this.h, pl = h.players[p], R = this.riot;
      const out = { p, kind: ch, changes: [] };
      const swapIn = (b) => { const outId = pl.hand[b.wi], inId = h.wall[b.k]; this.swapHandWithWall(pl, b.wi, b.k); out.changes.push({ p, outId, inId }); };
      switch (ch) {
        case 'karen': for (let i = 0; i < 2; i++) { const b = this.bestFromList(pl, this.liveIndices().slice(0, 12), false); if (!b) break; swapIn(b); } break;
        case 'nono': { const b = this.bestFromList(pl, this.liveIndices(), true); if (b) swapIn(b); break; }
        case 'natsu': for (let i = 0; i < 2; i++) { const b = this.bestFromList(pl, this.liveIndices().slice(0, 6), false); if (!b) break; swapIn(b); } break;
        case 'reika': {
          this.scores[p] -= 2000; this.kyotaku += 2;
          out.dora = [];
          for (let i = 0; i < 2; i++) { const d = this.doDora(p); if (d) out.dora.push(d.id); }
          out.paid = 2000;
          break;
        }
        case 'mira': R.luck.set(p, (R.luck.get(p) || 0) + 2); break;
        case 'shizuku':
          for (let q = 0; q < this.n; q++) {
            if (q === p) continue;
            const op = h.players[q];
            const ki = this.keyIndex(op), live = this.liveIndices();
            if (ki < 0 || !live.length) continue;
            const k = live[Math.floor(this.rng() * live.length)];
            const outId = op.hand[ki], inId = h.wall[k];
            this.swapHandWithWall(op, ki, k);
            op.hand = MJ.sortIds(op.hand);
            out.changes.push({ p: q, outId, inId });
          }
          break;
        case 'hiyori': {
          const list = this.raidable(); if (!list.length) break;
          const b = this.bestFromIds(pl, list.map(x => x.id)); if (!b) break;
          const src = list.find(x => x.id === b.id);
          const r = this.doRaid(pl.hand[b.wi], src.p, src.idx, p);
          if (r) { out.raid = r; out.changes.push({ p, outId: r.outId, inId: r.inId }); }
          break;
        }
        case 'myao': {
          const cand = [];
          for (let q = 0; q < this.n; q++) if (q !== p) for (const id of h.players[q].hand) cand.push({ q, id });
          const b = this.bestFromIds(pl, cand.map(x => x.id)); if (!b) break;
          const src = cand.find(x => x.id === b.id), victim = h.players[src.q];
          const vi = victim.hand.indexOf(b.id), give = pl.hand[b.wi];
          pl.hand[b.wi] = b.id; victim.hand[vi] = give;
          victim.hand = MJ.sortIds(victim.hand);
          out.steal = { from: src.q, id: b.id, give };
          out.changes.push({ p, outId: give, inId: b.id }, { p: src.q, outId: b.id, inId: give });
          break;
        }
        case 'mahiru': {
          let got = 0;
          for (let q = 0; q < this.n; q++) if (q !== p) { const d = Math.min(2, this.gauge[q]); this.gauge[q] -= d; got += d; }
          out.drained = got;
          break;
        }
        case 'luna': {
          const c = MJ.countsFromIds(pl.hand.concat(...pl.melds.map(m => m.ids)));
          let t = 0; for (let k = 1; k < 34; k++) if (c[k] > c[t]) t = k;
          this.extraDoraTypes.add(t);
          out.t = t;
          break;
        }
        case 'airi': for (let q = 0; q < this.n; q++) if (q !== p) R.frozen.add(q); out.frozen = [...R.frozen]; break;
        case 'yukari': out.rule = this.applyRule(); break;
        default: return null;
      }
      pl.hand = MJ.sortIds(pl.hand);
      this.pay('sig', p);
      if (ch === 'mahiru') this.gauge[p] = Math.min(GAUGE_MAX, this.gauge[p] + out.drained);
      return out;
    }

    /* ---------------- 卓が荒れるイベント ---------------- */
    applyRule(id) {
      id = id || RULE_IDS[Math.floor(this.rng() * RULE_IDS.length)];
      this.rule = id;
      const add = (ts) => { for (const t of ts) if (!(this.is3p && MJ.isRemoved3p(t))) this.extraDoraTypes.add(t); };
      if (id === 'seven') add([6, 15, 24]);
      if (id === 'honor') add([27, 28, 29, 30, 31, 32, 33]);
      if (id === 'term') add([0, 8, 9, 17, 18, 26]);
      if (id === 'double') this.payMul = 2;
      if (id === 'fake') this.fakeMul = 2;
      if (id === 'gauge') this.gauge = this.gauge.map(() => GAUGE_MAX);
      return id;
    }
    async runEvent(id) {
      const h = this.h, n = this.n, R = this.riot;
      const data = { id };
      if (id === 'rotate') {
        const KEYS = ['hand', 'melds', 'nuki', 'riichi', 'ippatsu', 'riichiFuriten', 'kanCount', 'feverTarget', 'lastDraw', 'forbidden'];
        const old = h.players.map(pl => { const o = {}; for (const k of KEYS) o[k] = pl[k]; return o; });
        for (let p = 0; p < n; p++) {
          const src = old[(p - 1 + n) % n], pl = h.players[p];
          for (const k of KEYS) pl[k] = src[k];
          pl.melds = src.melds.map(m => ({ ...m, from: m.from != null ? (m.from + 1) % n : m.from }));
        }
        R.exposed = new Map(); R.stunned.clear();
      } else if (id === 'gravity') {
        data.turns = n;
      } else if (id === 'meteor') {
        const types = [];
        for (let t = 0; t < 34; t++) if (!(this.is3p && MJ.isRemoved3p(t)) && !this.extraDoraTypes.has(t)) types.push(t);
        data.t = types[Math.floor(this.rng() * types.length)];
        this.extraDoraTypes.add(data.t);
      } else if (id === 'migrate') {
        const picks = h.players.map(pl => pl.hand[Math.floor(this.rng() * pl.hand.length)]);
        data.moves = [];
        for (let p = 0; p < n; p++) {
          const to = (p + 1) % n, tid = picks[p];
          h.players[p].hand.splice(h.players[p].hand.indexOf(tid), 1);
          h.players[to].hand.push(tid);
          data.moves.push({ from: p, to, id: tid });
        }
        for (const pl of h.players) pl.hand = MJ.sortIds(pl.hand);
      } else if (id === 'roulette') {
        data.rule = this.applyRule();
      } else if (id === 'melt') {
        data.changes = [];
        for (let p = 0; p < n; p++) {
          const pl = h.players[p];
          const b = this.bestFromList(pl, this.liveIndices(), true);
          if (!b) continue;
          const outId = pl.hand[b.wi], inId = h.wall[b.k];
          this.swapHandWithWall(pl, b.wi, b.k);
          pl.hand = MJ.sortIds(pl.hand);
          data.changes.push({ p, outId, inId });
        }
      } else if (id === 'rewind') {
        data.returns = [];
        for (let p = 0; p < n; p++) {
          const pl = h.players[p];
          const d = pl.discards[pl.discards.length - 1];
          if (!d || d.called || d.riichi || pl.riichi || pl.lastDraw == null) continue;
          const wi = h.wall.indexOf(pl.lastDraw);
          if (wi < 0 || wi >= h.drawPtr) continue;            // 嶺上牌・北抜きの補充牌は戻さない
          const back = d.id, toWall = pl.lastDraw;
          if (back !== toWall && !pl.hand.includes(toWall)) continue;
          pl.discards.pop();
          if (back !== toWall) { pl.hand.splice(pl.hand.indexOf(toWall), 1); pl.hand.push(back); pl.hand = MJ.sortIds(pl.hand); }
          // 山の次にツモる位置へ戻す（壁の並びは常に全牌の並べ替えのまま）
          const j = h.drawPtr - 1;
          [h.wall[wi], h.wall[j]] = [h.wall[j], h.wall[wi]];
          h.drawPtr--;
          pl.lastDraw = null;
          data.returns.push({ p, back, toWall });
        }
      } else if (id === 'words') {
        data.given = h.players.map((_, p) => [this.giveWord(p), this.giveWord(p)]);
      }
      R.done.push(id);
      await this.ui.event('chaos', data);
      return data;
    }

    /* ---------------- でっち上げ役 ---------------- */
    handTags(p, w, tsumo) {
      const h = this.h, pl = h.players[p];
      const ids = pl.hand.slice();
      if (!tsumo && w && w.winId != null && !ids.includes(w.winId)) ids.push(w.winId);
      const all = ids.concat(...pl.melds.map(m => m.ids));
      const c = MJ.countsFromIds(all);
      const suit = (s) => c.slice(s * 9, s * 9 + 9).reduce((a, b) => a + b, 0);
      const tags = new Set();
      if (suit(0) >= 6) tags.add('man');
      if (suit(1) >= 6) tags.add('pin');
      if (suit(2) >= 6) tags.add('sou');
      if (c.slice(27).some(x => x > 0)) tags.add('honor');
      if (c.slice(27, 31).some(x => x >= 2)) tags.add('wind');
      if (c.slice(31, 34).some(x => x >= 2)) tags.add('dragon');
      if (all.some(MJ.isRedId)) tags.add('red');
      let dora = 0;
      for (const ind of this.doraIndicators()) dora += c[MJ.doraFromIndicator(ind, this.is3p)];
      for (const t of this.extraDoraTypes) dora += c[t];
      if (dora > 0) tags.add('dora');
      if (c[6] + c[15] + c[24] > 0) tags.add('seven');
      if ([0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33].reduce((a, t) => a + c[t], 0) >= 4) tags.add('term');
      tags.add(tsumo ? 'tsumo' : 'ron');
      if (pl.riichi) tags.add('riichi');
      if (pl.melds.every(m => m.type === 'ankan')) tags.add('closed'); else tags.add('open');
      if (c.filter(x => x >= 2).length >= 3) tags.add('pair');
      if (this.riot.done.length) tags.add('chaos');
      if (this.riot.cheatedHand.has(p)) tags.add('cheat');
      return tags;
    }
    /** 言葉の組み合わせ → { han, ja, en } */
    fakeScore(p, wordIds, tags) {
      const ws = wordIds.map(id => Words.byId[id]).filter(Boolean);
      if (!ws.length) return { han: 0, ja: '', en: '' };
      const order = { pre: 0, core: 1, suf: 2 };
      const sorted = ws.slice().sort((a, b) => order[a.cat] - order[b.cat]);
      let han = 0;
      for (const w of sorted) han += this.wordMatches(p, w.id, tags) ? 2 : 0;
      if (sorted.some(w => w.cat === 'pre') && sorted.some(w => w.cat === 'core') && sorted.some(w => w.cat === 'suf')) han += 1;
      han = Math.min(FAKE_CAP, han) * this.fakeMul;
      return { han, ja: sorted.map(w => w.ja).join(''), en: sorted.map(w => w.en).join(' ') };
    }
    wordMatches(p, id, tags) { const w = Words.byId[id]; return !!w && w.cat === 'core' && ((!!w.tag && tags.has(w.tag)) || (!!w.char && w.char === this.chars[p])); }
    /** おまかせ: 一番翻数が高い組み合わせ（同点なら言葉が少ないほう） */
    bestFake(p, tags) {
      const list = [...new Set(this.words[p])];
      let best = { ids: [], han: 0 };
      const rec = (start, pick) => {
        if (pick.length) {
          const s = this.fakeScore(p, pick, tags);
          if (s.han > best.han || (s.han === best.han && pick.length < best.ids.length)) best = { ids: pick.slice(), han: s.han };
        }
        if (pick.length >= Words.MAX_PICK) return;
        for (let i = start; i < list.length; i++) { pick.push(list[i]); rec(i + 1, pick); pick.pop(); }
      };
      rec(0, []);
      return best.ids;
    }
    async decorateWin(w, tsumo) {
      const p = w.p, pl = this.h.players[p];
      const tags = this.handTags(p, w, tsumo);
      let ids = null;
      if (pl.human && this.ui.askFake) ids = await this.ui.askFake({ p, words: this.words[p].slice(), tags, mul: this.fakeMul, result: w.result });
      if (!ids) ids = this.bestFake(p, tags);
      ids = [...new Set(ids)].filter(id => this.words[p].includes(id)).slice(0, Words.MAX_PICK);
      const r = w.result;
      // 本物の役がひとつもないときは、でっち上げ役が最低1つ必要
      if (!ids.length && !r.yakuman && !r.yaku.some(y => typeof y.han === 'number' && !/ドラ$/.test(y.name))) ids = this.bestFake(p, tags);
      const s = this.fakeScore(p, ids, tags);
      if (s.han > 0) {
        for (const id of ids) { const i = this.words[p].indexOf(id); if (i >= 0) this.words[p].splice(i, 1); }
        r.yaku.unshift({ name: s.ja, nameEn: s.en, han: s.han, fake: true });
        if (!r.yakuman) {
          r.han += s.han;
          const bp = MJ.basePoints(r.han, r.fu, 0);
          r.base = bp.base; r.limitName = bp.name;
        }
        const st = this.style[p];
        st.fakeTotal += s.han;
        if (!st.best || s.han > st.best.han) st.best = { ja: s.ja, en: s.en, han: s.han };
      }
      r.pay = MJ.payments(r.base, this.isDealer(p));
      if (this.payMul !== 1) for (const k of Object.keys(r.pay)) r.pay[k] *= this.payMul;
      if (s.han > 0) await this.ui.event('fakeYaku', { p, ja: s.ja, en: s.en, han: s.han, words: ids, tsumo });
    }

    /** 反則王ランク（派手さ） */
    cheatRank(myPlace) {
      const s = this.style[0];
      const pts = s.cheats + 2 * s.sigs + s.fakeTotal + [6, 3, 1, 0][myPlace];
      const rank = pts >= 30 ? 'S' : pts >= 18 ? 'A' : pts >= 9 ? 'B' : 'C';
      return { pts, rank };
    }
  }

  const RiotMod = { RiotGame, COST, SIG_COST };
  if (typeof module !== 'undefined' && module.exports) module.exports = RiotMod;
  else root.RiotMod = RiotMod;
})(typeof window !== 'undefined' ? window : globalThis);
