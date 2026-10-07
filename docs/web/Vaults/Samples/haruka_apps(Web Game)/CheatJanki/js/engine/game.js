/* =========================================================
 *  対局進行エンジン (UI 非依存 / async)
 *  Originally from JANKI STARLIGHT (haruka_apps). CHEAT JANKI! adds hooks:
 *    afterDraw(p, drawnId) / afterDiscard(p) / beforeWin(wins, tsumo) -> 'flip'
 *    isStunned(p) (skip calls), h.voided (hand cancelled by a table flip)
 *    afterDraw may return a new drawn id; forceDecision(p, opt) -> decision|null (frozen turns)
 *    decorateWin(w, tsumo) (fake yaku etc.), this.extraDoraTypes (Set), this.allowNoYaku
 *  ui インターフェース:
 *    await ui.event(name, data)
 *    await ui.askSelf(p, opt)  -> {action, id?, kan?}
 *    await ui.askCall(p, opt)  -> {action, ids?}
 * ========================================================= */
(function (root) {
  'use strict';
  const MJ = root.MJ || require('./mahjong.js');
  const AI = root.AI || require('./ai.js');

  const FEVER_TARGETS = [
    { key: 'daisangen', name: '大三元', types: [31, 32, 33], per: 3, allowCall: true },
    { key: 'shousuushi', name: '四喜和', types: [27, 28, 29, 30], per: 3, allowCall: true },
    { key: 'tsuuiisou', name: '字一色', types: [27, 28, 29, 30, 31, 32, 33], per: 2, allowCall: true },
    { key: 'kokushi', name: '国士無双', types: MJ.YAOCHU, per: 1, allowCall: false },
    { key: 'ryuuiisou', name: '緑一色', types: [19, 20, 21, 23, 25, 32], per: 2, allowCall: true },
    { key: 'suuankou', name: '四暗刻', types: null, per: 3, allowCall: false },
    { key: 'chuuren', name: '九蓮宝燈', types: null, per: 0, allowCall: false },
    { key: 'chinroutou', name: '清老頭', types: [0, 8, 9, 17, 18, 26], per: 3, allowCall: true },
  ];

  class Game {
    constructor(cfg) {
      this.cfg = cfg;
      this.is3p = cfg.mode === '3p';
      this.n = this.is3p ? 3 : 4;
      this.ui = cfg.ui;
      this.rng = cfg.rng || Math.random;
      this.fever = !!cfg.fever;
      this.startScore = this.is3p ? 35000 : 25000;
      this.scores = new Array(this.n).fill(this.startScore);
      this.players = cfg.players.slice(0, this.n);
      this.roundWind = 0;
      this.dealer = Math.floor(this.rng() * this.n);
      this.firstDealer = this.dealer;
      this.honba = 0;
      this.kyotaku = 0;
      this.handCount = 0;
      this.lastRoundWind = cfg.length === 'south' ? 1 : 0;
      this.stats = this.players.map(() => ({ wins: 0, dealIns: 0, riichi: 0, yakuman: 0, bestHand: null }));
      this.aborted = false;
    }

    seatWind(p) { return 27 + ((p - this.h.dealer + this.n) % this.n); }
    isDealer(p) { return p === this.h.dealer; }
    doraIndicators() {
      return this.doraIndicatorIds().map(id => id >> 2);
    }
    uraIndicators() {
      return this.uraIndicatorIds().map(id => id >> 2);
    }
    doraIndicatorIds() {
      const h = this.h; const res = [];
      for (let i = 0; i < h.doraCount; i++) res.push(h.wall[h.deadStart + 8 - 2 * i]);
      return res;
    }
    isDoraType(t) {
      if (this.extraDoraTypes && this.extraDoraTypes.has(t)) return true;
      for (const ind of this.doraIndicators()) if (MJ.doraFromIndicator(ind, this.is3p) === t) return true;
      return false;
    }
    remaining() { return this.h.liveEnd - this.h.drawPtr; }
    next(p) { return (p + 1) % this.n; }

    async run() {
      await this.ui.event('gameStart', { game: this });
      while (!this.aborted) {
        const res = await this.playHand();
        if (this.aborted) break;
        const cont = this.advance(res);
        await this.ui.event('scores', { scores: this.scores.slice() });
        if (!cont) break;
      }
      const ranking = this.ranking();
      if (!this.aborted && this.kyotaku) {
        this.scores[ranking[0]] += this.kyotaku * 1000;
        this.kyotaku = 0;
      }
      await this.ui.event('gameEnd', { ranking, scores: this.scores.slice(), stats: this.stats });
      return ranking;
    }

    ranking() {
      const order = [...Array(this.n).keys()].sort((a, b) => this.scores[b] - this.scores[a] || ((a - this.firstDealer + this.n) % this.n) - ((b - this.firstDealer + this.n) % this.n));
      return order;
    }

    advance(res) {
      if (!this.fever && this.scores.some(s => s < 0)) return false;
      const renchan = res.dealerKeeps;
      const isLast = this.roundWind === this.lastRoundWind && this.dealer === (this.firstDealer + this.n - 1) % this.n;
      if (renchan) {
        this.honba++;
        if (isLast && this.ranking()[0] === this.dealer && res.type === 'win') return false; // アガリやめ
      } else {
        this.honba = res.type === 'draw' ? this.honba + 1 : 0;
        this.dealer = this.next(this.dealer);
        if (this.dealer === this.firstDealer) {
          this.roundWind++;
          if (this.roundWind > this.lastRoundWind) return false;
        }
      }
      return true;
    }

    /* ---------------- 1局 ---------------- */
    async playHand() {
      const n = this.n;
      const wall = MJ.buildWall(this.is3p, this.rng);
      const N = wall.length;
      const dice = [1 + Math.floor(this.rng() * 6), 1 + Math.floor(this.rng() * 6)];
      const h = this.h = {
        wall, dealer: this.dealer, roundWind: this.roundWind, roundWindTile: 27 + this.roundWind,
        dice, wallBreak: MJ.wallBreak(n, this.dealer, dice),
        drawPtr: 0, deadStart: N - 14, liveEnd: N - 14, rinshanUsed: 0, doraCount: 1, kanCount: 0,
        turn: 0, firstGoAround: true, lastDiscard: null,
        players: [],
      };
      this.handCount++;
      for (let p = 0; p < n; p++) {
        h.players.push({
          hand: [], melds: [], discards: [], nuki: [], riichi: 0, ippatsu: false, riichiFuriten: false, tempFuriten: false,
          safeTypes: new Set(), style: this.players[p].style || 'balance', human: !!this.players[p].human,
          skill: this.players[p].skill || null, feverTarget: null, forbidden: new Set(), drawnFirst: false, kanCount: 0,
        });
      }
      // 配牌 (親から4枚ずつ×3 + 1枚)
      const batches = MJ.dealBatches(n, h.dealer);
      for (const batch of batches) for (const i of batch.indices) h.players[batch.p].hand.push(wall[i]);
      h.drawPtr = 13 * n;

      // 役満フィーバー & スキル（配牌補正）
      for (let p = 0; p < n; p++) {
        if (this.fever) this.seedFever(p);
        const sk = h.players[p].skill;
        if (sk && sk.type === 'haipai') this.improveHaipai(p, sk.level);
        if (sk && sk.type === 'yakuman' && !this.fever && this.rng() < 0.12 + 0.04 * sk.level) this.seedFever(p, 0.6);
      }
      for (const pl of h.players) pl.hand = MJ.sortIds(pl.hand);

      await this.ui.event('handStart', {
        dealer: h.dealer, roundWind: this.roundWind, dealerIdx: (h.dealer - this.firstDealer + n) % n, honba: this.honba,
        kyotaku: this.kyotaku, scores: this.scores.slice(), wall: wall.slice(), deadStart: h.deadStart,
        wallBreak: h.wallBreak, dice: h.dice,
        dealBatches: batches.map(b => ({ p: b.p, ids: b.indices.map(i => wall[i]) })),
        hands: h.players.map(pl => pl.hand.slice()), doraIds: this.doraIndicatorIds(),
        fever: h.players.map(pl => pl.feverTarget ? pl.feverTarget.name : null),
      });

      let cur = h.dealer;
      let needDraw = true;
      let rinshanDraw = false;
      let nukiDraw = false;
      while (true) {
        if (this.aborted) return { type: 'abort', dealerKeeps: true };
        const pl = h.players[cur];
        let drawnId = null;
        if (needDraw) {
          if (!rinshanDraw && this.remaining() <= 0) return await this.exhaustiveDraw();
          drawnId = nukiDraw ? this.drawNuki(cur) : rinshanDraw ? this.drawRinshan(cur) : this.drawLive(cur);
          pl.tempFuriten = false;
          await this.ui.event('draw', { p: cur, id: drawnId, rinshan: rinshanDraw, remaining: this.remaining() });
          if (this.afterDraw) { const nd = await this.afterDraw(cur, drawnId); if (nd != null) drawnId = nd; }
          if (h.voided) return { type: 'flip', dealerKeeps: true };
        }
        const isRinshan = rinshanDraw;
        rinshanDraw = false;
        nukiDraw = false;

        // ---- 自分の手番の選択 ----
        const opt = this.selfOptions(cur, drawnId, needDraw, isRinshan);
        const forced = this.forceDecision ? await this.forceDecision(cur, opt) : null;
        const dec = forced || (pl.human ? await this.ui.askSelf(cur, opt) : AI.selfDecision(this, cur, opt));
        if (this.aborted) return { type: 'abort', dealerKeeps: true };
        if (h.voided) return { type: 'flip', dealerKeeps: true };
        // a cheat may have replaced the drawn tile (opt is refreshed in place by the UI)
        if (opt.drawnId !== undefined) drawnId = opt.drawnId;

        if (dec.action === 'tsumo' && opt.canTsumo) {
          return await this.doWin([{ p: cur, from: cur, result: opt.tsumoResult, winId: drawnId }], true);
        }
        if (dec.action === 'kyuushu' && opt.canKyuushu) return await this.abortiveDraw('九種九牌');
        if (dec.action === 'nuki' && opt.canNuki) {
          const id = pl.riichi ? drawnId : pl.hand.find(x => (x >> 2) === 30);
          const resp = await this.collectResponses(cur, id, { ronOnly: true, kokushiOnly: true });
          if (resp.rons.length) return await this.doWin(resp.rons.map(r => ({ p: r.p, from: cur, result: r.result, winId: id })), false);
          pl.hand.splice(pl.hand.indexOf(id), 1);
          pl.nuki.push(id);
          this.breakIppatsu();
          h.firstGoAround = false;
          await this.ui.event('nuki', { p: cur, id, nukiCount: pl.nuki.length });
          needDraw = true; nukiDraw = true;
          continue;
        }
        if (dec.action === 'kan' && dec.kan && opt.kanOptions.some(k => k.type === dec.kan.type && k.t === dec.kan.t)) {
          const id = dec.kan.type === 'ankan' ? drawnId : pl.hand.find(x => (x >> 2) === dec.kan.t);
          const robId = (id >> 2) === dec.kan.t ? id : pl.hand.find(x => (x >> 2) === dec.kan.t);
          const resp = await this.collectResponses(cur, robId, { ronOnly: true, chankan: dec.kan.type === 'kakan', kokushiOnly: dec.kan.type === 'ankan' });
          if (resp.rons.length) return await this.doWin(resp.rons.map(r => ({ p: r.p, from: cur, result: r.result, winId: robId })), false);
          await this.doSelfKan(cur, dec.kan);
          needDraw = true; rinshanDraw = true;
          continue;
        }
        let discardId = dec.id;
        let declareRiichi = false;
        if (dec.action === 'riichi' && opt.riichiIds.includes(dec.id)) declareRiichi = true;
        if (!opt.discardable.includes(discardId) && !(declareRiichi)) discardId = opt.discardable[opt.discardable.length - 1];

        // ---- 打牌 ----
        pl.hand.splice(pl.hand.indexOf(discardId), 1);
        pl.hand = MJ.sortIds(pl.hand);
        const tsumogiri = discardId === drawnId;
        if (pl.ippatsu && !declareRiichi) pl.ippatsu = false;
        if (declareRiichi) {
          pl.riichi = (h.firstGoAround && pl.discards.length === 0 && this.noCallsYet()) ? 2 : 1;
          pl.ippatsu = true;
          this.stats[cur].riichi++;
        }
        pl.discards.push({ id: discardId, riichi: declareRiichi, called: false, tsumogiri });
        pl.safeTypes.add(discardId >> 2);
        pl.forbidden = new Set();
        h.players.forEach((o, q) => { if (q !== cur && o.riichi) o.safeTypes.add(discardId >> 2); });
        h.lastDiscard = { p: cur, id: discardId };
        await this.ui.event('discard', { p: cur, id: discardId, riichi: declareRiichi, tsumogiri, hand: pl.hand.slice() });
        if (declareRiichi) await this.ui.event('riichi', { p: cur, double: pl.riichi === 2 });

        // ---- 他家の反応 ----
        const resp = await this.collectResponses(cur, discardId);
        if (this.aborted) return { type: 'abort', dealerKeeps: true };
        if (this.afterDiscard) await this.afterDiscard(cur, resp);
        if (h.voided) return { type: 'flip', dealerKeeps: true };
        if (resp.rons.length) {
          return await this.doWin(resp.rons.map(r => ({ p: r.p, from: cur, result: r.result, winId: discardId })), false);
        }
        if (h.kanCount === 4 && h.players.filter(x => x.kanCount > 0).length > 1) return await this.abortiveDraw('四槓散了');
        // リーチ成立
        if (declareRiichi) {
          this.scores[cur] -= 1000; this.kyotaku++;
          await this.ui.event('riichiStick', { p: cur, scores: this.scores.slice(), kyotaku: this.kyotaku });
        }
        // 最初の一巡終了判定
        if (cur === (h.dealer + n - 1) % n) h.firstGoAround = false;

        if (resp.call) {
          const { p: q, action, ids } = resp.call;
          this.breakIppatsu();
          h.firstGoAround = false;
          pl.discards[pl.discards.length - 1].called = true;
          await this.doCall(q, cur, discardId, action, ids);
          if (action === 'kan') { cur = q; needDraw = true; rinshanDraw = true; }
          else { cur = q; needDraw = false; }
          continue;
        }
        if (n === 4 && this.noCallsYet() && h.players.every(x => x.discards.length === 1)) {
          const first = h.players.map(x => x.discards[0].id >> 2);
          if (MJ.isWind(first[0]) && first.every(t => t === first[0])) return await this.abortiveDraw('四風連打');
        }
        if (h.players.every(x => x.riichi) && n === 4) return await this.abortiveDraw('四家立直');
        cur = this.next(cur);
        needDraw = true;
      }
    }

    noCallsYet() { return this.h.players.every(pl => pl.melds.length === 0 && pl.nuki.length === 0); }
    breakIppatsu() { for (const pl of this.h.players) pl.ippatsu = false; }

    drawLive(p) {
      const h = this.h;
      this.applyLuck(p);
      const id = h.wall[h.drawPtr++];
      h.players[p].hand.push(id);
      h.players[p].drawnFirst = true;
      return id;
    }
    drawRinshan(p) {
      const h = this.h;
      const order = [12, 13, 10, 11];
      if (h.rinshanUsed >= 4 || this.remaining() <= 0) throw new Error('嶺上牌を補充できません');
      const id = h.wall[h.deadStart + order[h.rinshanUsed]];
      // Keep fourteen tiles reserved: the live wall's last tile joins the dead wall.
      h.liveEnd--;
      h.rinshanUsed++;
      h.players[p].hand.push(id);
      return id;
    }

    drawNuki(p) {
      if (this.remaining() <= 0) throw new Error('北抜きの補充牌がありません');
      // Kita takes a live-wall tile and never consumes the four kan replacements.
      const id = this.h.wall[--this.h.liveEnd];
      this.h.players[p].hand.push(id);
      return id;
    }

    swapHandWithWall(pl, handIndex, wallIndex) {
      const wall = this.h.wall, out = pl.hand[handIndex];
      const oldIndex = wall.indexOf(out);
      pl.hand[handIndex] = wall[wallIndex];
      [wall[oldIndex], wall[wallIndex]] = [wall[wallIndex], wall[oldIndex]];
    }

    /* ---- 運・フィーバー ---- */
    seedFever(p, strengthMul) {
      const h = this.h;
      const pl = h.players[p];
      const human = pl.human;
      const pool = FEVER_TARGETS.filter(t => !(this.is3p && t.key === 'chuuren' && false));
      const tpl = pool[Math.floor(this.rng() * pool.length)];
      let types = tpl.types;
      if (tpl.key === 'suuankou') {
        const c = MJ.countsFromIds(pl.hand);
        const cand = [];
        for (let t = 0; t < 34; t++) if (c[t] >= 1 && !(this.is3p && MJ.isRemoved3p(t))) cand.push(t);
        cand.sort((a, b) => c[b] - c[a]);
        types = cand.slice(0, 5);
      }
      if (tpl.key === 'chuuren') {
        const suits = this.is3p ? [1, 2] : [0, 1, 2];
        const s = suits[Math.floor(this.rng() * suits.length)];
        types = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(k => s * 9 + k);
      }
      types = types.filter(t => !(this.is3p && MJ.isRemoved3p(t)));
      const target = { key: tpl.key, name: tpl.name, types: new Set(types), allowCall: tpl.allowCall, strength: 1, per: tpl.per };
      pl.feverTarget = target;
      // 配牌に狙い牌を仕込む
      const want = Math.floor((human ? 8 : 6) * (strengthMul || 1));
      const need = [];
      if (tpl.key === 'kokushi') for (const t of types) need.push(t);
      else if (tpl.key === 'chuuren') { const b = types[0]; need.push(b, b, b, b + 1, b + 2, b + 3, b + 4, b + 5, b + 6, b + 7, b + 8, b + 8, b + 8); }
      else for (const t of types) for (let k = 0; k < Math.max(2, tpl.per); k++) need.push(t);
      for (let i = need.length - 1; i > 0; i--) { const j = Math.floor(this.rng() * (i + 1)); [need[i], need[j]] = [need[j], need[i]]; }
      if (tpl.key === 'chuuren') need.sort(() => 0);
      let placed = 0;
      const c = MJ.countsFromIds(pl.hand);
      for (const t of need) {
        if (placed >= want) break;
        const limit = tpl.key === 'kokushi' ? 1 : (tpl.key === 'chuuren' ? 3 : 3);
        if (c[t] >= limit) continue;
        // 山の未使用部分から探す
        let wi = -1;
        for (let k = h.drawPtr; k < h.deadStart; k++) if ((h.wall[k] >> 2) === t) { wi = k; break; }
        if (wi < 0) continue;
        // 手牌の中で狙い外の牌と交換
        const outIdx = pl.hand.findIndex(id => !target.types.has(id >> 2));
        if (outIdx < 0) break;
        const out = pl.hand[outIdx];
        this.swapHandWithWall(pl, outIdx, wi);
        c[t]++; c[out >> 2]--;
        placed++;
      }
    }

    improveHaipai(p, level) {
      const h = this.h, pl = h.players[p];
      const swaps = 1 + Math.floor(level / 2);
      for (let s = 0; s < swaps; s++) {
        const c = MJ.countsFromIds(pl.hand);
        const cur = MJ.shanten(c, 0);
        // 孤立牌を1枚、有効牌と交換
        let outIdx = -1;
        for (let i = 0; i < pl.hand.length; i++) {
          const t = pl.hand[i] >> 2; c[t]--;
          if (MJ.shanten(c, 0) === cur) { outIdx = i; c[t]++; break; }
          c[t]++;
        }
        if (outIdx < 0) return;
        const out = pl.hand[outIdx];
        c[out >> 2]--;
        for (let k = h.drawPtr; k < h.deadStart; k++) {
          const t = h.wall[k] >> 2;
          c[t]++;
          const ok = MJ.shanten(c, 0) < cur;
          c[t]--;
          if (ok) { this.swapHandWithWall(pl, outIdx, k); break; }
        }
      }
    }

    applyLuck(p) {
      const h = this.h, pl = h.players[p];
      let prob = 0;
      const desired = new Set();
      const c = MJ.countsFromIds(pl.hand);
      const melds = pl.melds.length;
      const addShantenReducers = () => {
        const sh = MJ.shanten(c, melds);
        for (let t = 0; t < 34; t++) {
          if (this.is3p && MJ.isRemoved3p(t)) continue;
          c[t]++;
          if (MJ.shanten(c, melds) < sh) desired.add(t);
          c[t]--;
        }
        return sh;
      };
      if (pl.feverTarget) {
        const tg = pl.feverTarget;
        prob = pl.human ? 0.42 : 0.3;
        if (tg.key === 'kokushi') { for (const t of tg.types) if (c[t] === 0) desired.add(t); if (![...tg.types].some(t => c[t] >= 2)) for (const t of tg.types) desired.add(t); }
        else if (tg.key === 'chuuren') { const b = [...tg.types][0]; const need = [3, 1, 1, 1, 1, 1, 1, 1, 3]; for (let k = 0; k < 9; k++) if (c[b + k] < need[k]) desired.add(b + k); if (!desired.size) for (const t of tg.types) desired.add(t); }
        else for (const t of tg.types) if (c[t] >= 1 && c[t] < 3) desired.add(t);
        if (!desired.size) for (const t of tg.types) if (c[t] < 3) desired.add(t);
        const sh = MJ.shanten(c, melds);
        if (sh <= 1 && (tg.key === 'suuankou' || tg.key === 'daisangen' || tg.key === 'tsuuiisou')) {
          // 最後のひと押し: 和了牌も候補に
          for (let t = 0; t < 34; t++) if (c[t] >= 2 && tg.types.has(t)) desired.add(t);
        }
      }
      const sk = pl.skill;
      if (sk) {
        const lv = sk.level || 1;
        if (sk.type === 'speed' && this.rng() < 0.06 + 0.035 * lv) { prob = Math.max(prob, 1); addShantenReducers(); }
        if (sk.type === 'dora' && this.rng() < 0.05 + 0.03 * lv) {
          prob = Math.max(prob, 1);
          for (const ind of this.doraIndicators()) desired.add(MJ.doraFromIndicator(ind, this.is3p));
        }
        if (sk.type === 'ippatsu' && pl.riichi && pl.ippatsu && this.rng() < 0.15 + 0.07 * lv) {
          prob = 1;
          desired.clear();
          for (const w of MJ.waits(c, pl.melds, this.is3p)) desired.add(w);
        }
        if (sk.type === 'yakuman' && pl.feverTarget) prob = Math.min(0.6, prob + 0.05 * lv);
      }
      if (!desired.size || this.rng() >= prob) return;
      const cands = [];
      for (let k = h.drawPtr; k < h.liveEnd; k++) if (desired.has(h.wall[k] >> 2)) cands.push(k);
      if (!cands.length) return;
      const k = cands[Math.floor(this.rng() * cands.length)];
      [h.wall[h.drawPtr], h.wall[k]] = [h.wall[k], h.wall[h.drawPtr]];
    }

    /* ---- 自分の手番の選択肢 ---- */
    selfOptions(p, drawnId, afterDraw, isRinshan) {
      const h = this.h, pl = h.players[p];
      const opt = { drawnId, canTsumo: false, tsumoResult: null, riichiIds: [], kanOptions: [], canNuki: false, canKyuushu: false, discardable: [], mustTsumogiri: false };
      const c = MJ.countsFromIds(pl.hand);
      const melds = pl.melds.length;
      opt.canKyuushu = afterDraw && h.firstGoAround && !pl.discards.length && this.noCallsYet() && MJ.YAOCHU.filter(t => c[t] > 0).length >= 9;
      if (afterDraw && drawnId != null) {
        const res = this.evalWin(p, drawnId >> 2, true, { rinshan: isRinshan });
        if (res) { opt.canTsumo = true; opt.tsumoResult = res; }
      }
      // 抜きドラ
      if (this.is3p && c[30] > 0 && afterDraw && this.remaining() > 0) {
        if (!pl.riichi) opt.canNuki = true;
        else {
          const before = MJ.waits((() => { const x = c.slice(); x[drawnId >> 2]--; return x; })(), pl.melds, true).join();
          const x = c.slice(); x[30]--;
          if ((drawnId >> 2) === 30 && before === MJ.waits(x, pl.melds, true).join()) opt.canNuki = true;
        }
      }
      // カン
      if (afterDraw && this.remaining() > 0 && h.kanCount < 4) {
        for (let t = 0; t < 34; t++) {
          if (c[t] === 4) {
            if (pl.riichi) {
              if ((drawnId >> 2) !== t) continue;
              const x = c.slice(); x[t]--;
              const waits = MJ.waits(x, pl.melds, this.is3p);
              const w1 = waits.join();
              const y = c.slice(); y[t] -= 4;
              const w2 = MJ.waits(y, pl.melds.concat({ type: 'ankan', t }), this.is3p).join();
              if (w1 !== w2 || !w1) continue;
              // Every winning interpretation must keep these three tiles as a triplet.
              // Equal waits alone would permit changing 111222333 into three sequences.
              const fixedTriplet = waits.every(w => {
                const winning = x.slice(); winning[w]++;
                return MJ.decompose(winning).every(d => d.groups.some(g => g.k === 'kou' && g.t === t));
              });
              if (!fixedTriplet) continue;
            }
            opt.kanOptions.push({ type: 'ankan', t });
          }
        }
        if (!pl.riichi) for (const m of pl.melds) if (m.type === 'pon' && c[m.t] >= 1) opt.kanOptions.push({ type: 'kakan', t: m.t });
      }
      // 打牌候補
      if (pl.riichi) {
        opt.discardable = drawnId != null ? [drawnId] : [pl.hand[pl.hand.length - 1]];
        opt.mustTsumogiri = true;
      } else {
        opt.discardable = pl.hand.filter(id => !pl.forbidden.has(id >> 2));
        if (!opt.discardable.length) opt.discardable = pl.hand.slice();
      }
      // リーチ
      const menzen = pl.melds.every(m => m.type === 'ankan');
      if (!pl.riichi && menzen && this.scores[p] >= 1000 && this.remaining() >= this.n && afterDraw) {
        const seen = new Map();
        for (const id of pl.hand) {
          const t = id >> 2;
          if (!seen.has(t)) {
            c[t]--;
            seen.set(t, MJ.shanten(c, melds) === 0 && MJ.waits(c, pl.melds, this.is3p).length > 0);
            c[t]++;
          }
          if (seen.get(t)) opt.riichiIds.push(id);
        }
      }
      return opt;
    }

    /** 和了評価（役がなければ null） */
    evalWin(p, winTile, tsumo, extra) {
      const h = this.h, pl = h.players[p];
      extra = extra || {};
      const ids = tsumo ? pl.hand.slice() : pl.hand.concat([extra.winId]);
      const c = MJ.countsFromIds(ids);
      if (!MJ.isAgari(c, pl.melds.length)) return null;
      let red = 0;
      for (const id of ids) if (MJ.isRedId(id)) red++;
      for (const m of pl.melds) for (const id of m.ids) if (MJ.isRedId(id)) red++;
      const first = h.firstGoAround && this.noCallsYet() && pl.discards.length === 0;
      const ctx = {
        counts: c, melds: pl.melds.map(m => ({ type: m.type, t: m.t })), winTile, tsumo,
        seatWind: this.seatWind(p), roundWind: h.roundWindTile, isDealer: this.isDealer(p),
        riichi: pl.riichi, ippatsu: pl.ippatsu,
        haitei: tsumo && this.remaining() === 0 && !extra.rinshan, houtei: !tsumo && this.remaining() === 0 && !extra.chankan,
        rinshan: !!extra.rinshan, chankan: !!extra.chankan,
        tenhou: tsumo && first && this.isDealer(p), chiihou: tsumo && first && !this.isDealer(p),
        doraInd: this.doraIndicators(), uraInd: this.uraIndicators(), redCount: red, nukiCount: pl.nuki.length, is3p: this.is3p,
        extraDoraTypes: this.extraDoraTypes ? [...this.extraDoraTypes] : null, allowNoYaku: !!this.allowNoYaku,
      };
      return MJ.evaluate(ctx);
    }

    isFuriten(p) {
      const pl = this.h.players[p];
      if (pl.riichiFuriten || pl.tempFuriten) return true;
      const c = MJ.countsFromIds(pl.hand);
      const w = MJ.waits(c, pl.melds, this.is3p);
      for (const d of pl.discards) if (w.includes(d.id >> 2)) return true;
      return false;
    }

    async collectResponses(from, id, options = {}) {
      const h = this.h;
      const t = id >> 2;
      const opts = [];
      for (let k = 1; k < this.n; k++) {
        const q = (from + k) % this.n;
        const pl = h.players[q];
        const o = { p: q, tile: id, ron: false, ronResult: null, pon: false, chi: [], minkan: false };
        const c = MJ.countsFromIds(pl.hand);
        // ロン
        c[t]++;
        const agari = MJ.isAgari(c, pl.melds.length);
        c[t]--;
        if (agari) {
          let res = this.evalWin(q, t, false, { winId: id, chankan: options.chankan });
          if (options.kokushiOnly && res && res.form !== 'kokushi') res = null;
          if (res && !this.isFuriten(q)) { o.ron = true; o.ronResult = res; }
          else if (res || (agari && !options.kokushiOnly)) {
            // 見逃し/フリテン
            pl.tempFuriten = true;
            if (pl.riichi) pl.riichiFuriten = true;
          }
        }
        if (!options.ronOnly && !pl.riichi && this.remaining() > 0) {
          if (c[t] >= 2) o.pon = true;
          if (c[t] >= 3 && h.kanCount < 4) o.minkan = true;
          if (!this.is3p && k === 1 && t < 27) {
            const n9 = t % 9;
            const pick = (tt) => pl.hand.filter(x => (x >> 2) === tt).sort((a, b) => MJ.isRedId(a) - MJ.isRedId(b));
            const pats = [[-2, -1], [-1, 1], [1, 2]];
            for (const [a, b] of pats) {
              if (n9 + a < 0 || n9 + b > 8) continue;
              const A = pick(t + a), B = pick(t + b);
              const forbidden = this.chiForbidden(t, [t + a, t + b]);
              if (A.length && B.length && pl.hand.some(x => x !== A[0] && x !== B[0] && !forbidden.has(x >> 2))) {
                o.chi.push([A[0], B[0]]);
                if (A.some(MJ.isRedId) && A.length > 1 && MJ.isRedId(A[A.length - 1])) o.chi.push([A[A.length - 1], B[0]]);
                if (B.length > 1 && MJ.isRedId(B[B.length - 1])) o.chi.push([A[0], B[B.length - 1]]);
              }
            }
          }
        }
        if (o.ron || o.pon || o.chi.length || o.minkan) opts.push(o);
      }
      const decisions = [];
      for (const o of opts) {
        const pl = h.players[o.p];
        const stunned = !pl.human && this.isStunned && this.isStunned(o.p);
        const d = pl.human ? await this.ui.askCall(o.p, o) : (stunned ? { action: o.ron ? 'ron' : 'skip' } : AI.callDecision(this, o.p, o));
        if (this.aborted) return { rons: [], call: null };
        if (o.ron && d.action !== 'ron') { pl.tempFuriten = true; if (pl.riichi) pl.riichiFuriten = true; }
        decisions.push({ o, d });
      }
      const rons = decisions.filter(x => x.d.action === 'ron' && x.o.ron).map(x => ({ p: x.o.p, result: x.o.ronResult }));
      if (rons.length) return { rons, call: null };
      const kan = decisions.find(x => x.d.action === 'kan' && x.o.minkan);
      const pon = decisions.find(x => x.d.action === 'pon' && x.o.pon);
      const chi = decisions.find(x => x.d.action === 'chi' && x.o.chi.length);
      if (kan) return { rons: [], call: { p: kan.o.p, action: 'kan' } };
      if (pon) return { rons: [], call: { p: pon.o.p, action: 'pon' } };
      if (chi) {
        let ids = chi.d.ids;
        if (!ids || !chi.o.chi.some(x => x[0] === ids[0] && x[1] === ids[1])) ids = chi.o.chi[0];
        return { rons: [], call: { p: chi.o.p, action: 'chi', ids } };
      }
      return { rons: [], call: null };
    }

    chiForbidden(t, others) {
      others = others.slice().sort((a, b) => a - b);
      const forbidden = new Set([t]);
      if (t < others[0] && others[1] % 9 < 8) forbidden.add(others[1] + 1);
      if (t > others[1] && others[0] % 9 > 0) forbidden.add(others[0] - 1);
      return forbidden;
    }

    async doCall(q, from, id, action, ids) {
      const pl = this.h.players[q];
      const t = id >> 2;
      let meld;
      if (action === 'pon' || action === 'kan') {
        const take = pl.hand.filter(x => (x >> 2) === t).sort((a, b) => MJ.isRedId(b) - MJ.isRedId(a)).slice(0, action === 'pon' ? 2 : 3);
        for (const x of take) pl.hand.splice(pl.hand.indexOf(x), 1);
        meld = { type: action === 'pon' ? 'pon' : 'minkan', t, ids: take.concat([id]), from, calledId: id };
        pl.forbidden = new Set([t]);
      } else {
        for (const x of ids) pl.hand.splice(pl.hand.indexOf(x), 1);
        const types = ids.map(x => x >> 2).concat([t]).sort((a, b) => a - b);
        meld = { type: 'chi', t: types[0], ids: ids.concat([id]), from, calledId: id };
        pl.forbidden = this.chiForbidden(t, ids.map(x => x >> 2));
      }
      pl.melds.push(meld);
      if (action === 'kan') {
        this.h.kanCount++; pl.kanCount++;
        this.h.doraCount = Math.min(5, this.h.doraCount + 1);
      }
      await this.ui.event('call', { p: q, from, type: meld.type, meld, hand: pl.hand.slice() });
      if (action === 'kan') await this.ui.event('dora', { doraIds: this.doraIndicatorIds() });
    }

    async doSelfKan(p, k) {
      const h = this.h, pl = h.players[p];
      if (k.type === 'ankan') {
        const take = pl.hand.filter(x => (x >> 2) === k.t);
        for (const x of take) pl.hand.splice(pl.hand.indexOf(x), 1);
        pl.melds.push({ type: 'ankan', t: k.t, ids: take, from: p, calledId: null });
      } else {
        const m = pl.melds.find(x => x.type === 'pon' && x.t === k.t);
        const id = pl.hand.find(x => (x >> 2) === k.t);
        pl.hand.splice(pl.hand.indexOf(id), 1);
        m.type = 'kakan'; m.ids.push(id); m.addedId = id;
      }
      h.kanCount++; pl.kanCount++;
      h.doraCount = Math.min(5, h.doraCount + 1);
      this.breakIppatsu();
      h.firstGoAround = false;
      await this.ui.event('call', { p, from: p, type: k.type, meld: pl.melds.find(x => x.t === k.t && (x.type === 'ankan' || x.type === 'kakan')), hand: pl.hand.slice() });
      await this.ui.event('dora', { doraIds: this.doraIndicatorIds() });
    }

    /* ---- 和了処理 ---- */
    async doWin(wins, tsumo) {
      const h = this.h;
      if (this.beforeWin && (await this.beforeWin(wins, tsumo)) === 'flip') return { type: 'flip', dealerKeeps: true };
      const deltas = new Array(this.n).fill(0);
      let dealerKeeps = false;
      let honbaDone = false;
      const detailed = [];
      for (const w of wins) {
        if (this.decorateWin) await this.decorateWin(w, tsumo);
        if (this.aborted) return { type: 'abort', dealerKeeps: true };
        const r = w.result;
        const isD = this.isDealer(w.p);
        if (isD) dealerKeeps = true;
        const hb = honbaDone ? 0 : this.honba;
        let gain = 0;
        if (tsumo) {
          for (let q = 0; q < this.n; q++) {
            if (q === w.p) continue;
            let pay = isD ? r.pay.tsumoAll : (this.isDealer(q) ? r.pay.tsumoDealer : r.pay.tsumoChild);
            pay += hb * 100;
            deltas[q] -= pay; gain += pay;
          }
        } else {
          const pay = r.pay.ron + hb * 300;
          deltas[w.from] -= pay; gain += pay;
          this.stats[w.from].dealIns++;
        }
        if (!honbaDone) { gain += this.kyotaku * 1000; this.kyotaku = 0; }
        honbaDone = true;
        deltas[w.p] += gain;
        const pl = h.players[w.p];
        this.stats[w.p].wins++;
        if (r.yakuman) this.stats[w.p].yakuman += r.yakuman;
        if (!this.stats[w.p].bestHand || r.base > this.stats[w.p].bestHand.base) this.stats[w.p].bestHand = { base: r.base, name: r.limitName || (r.han + '翻'), yaku: r.yaku.map(y => y.name) };
        detailed.push({
          p: w.p, from: w.from, tsumo, result: r, winId: w.winId, gain,
          hand: tsumo ? pl.hand.filter(x => x !== w.winId) : pl.hand.slice(),
          melds: pl.melds.map(m => ({ ...m, ids: m.ids.slice() })), nuki: pl.nuki.slice(),
          uraIds: pl.riichi ? this.uraIndicatorIds() : [], doraIds: this.doraIndicatorIds(), riichi: pl.riichi,
        });
      }
      const before = this.scores.slice();
      for (let q = 0; q < this.n; q++) this.scores[q] += deltas[q];
      await this.ui.event('win', { wins: detailed, deltas, before, after: this.scores.slice(), tsumo });
      return { type: 'win', dealerKeeps };
    }
    uraIndicatorIds() {
      const h = this.h; const res = [];
      for (let i = 0; i < h.doraCount; i++) res.push(h.wall[h.deadStart + 2 * (4 - i) + 1]);
      return res;
    }

    async exhaustiveDraw() {
      const h = this.h;
      const tenpai = h.players.map(pl => {
        const c = MJ.countsFromIds(pl.hand);
        return MJ.waits(c, pl.melds, this.is3p).length > 0;
      });
      const deltas = new Array(this.n).fill(0);
      const tn = tenpai.filter(Boolean).length;
      if (tn > 0 && tn < this.n) {
        const total = 3000;
        const plus = total / tn, minus = total / (this.n - tn);
        for (let q = 0; q < this.n; q++) deltas[q] = tenpai[q] ? plus : -minus;
      }
      const before = this.scores.slice();
      for (let q = 0; q < this.n; q++) this.scores[q] += Math.round(deltas[q]);
      await this.ui.event('ryuukyoku', { reason: '荒牌流局', tenpai, hands: h.players.map(pl => pl.hand.slice()), deltas, before, after: this.scores.slice() });
      return { type: 'draw', dealerKeeps: tenpai[h.dealer] };
    }
    async abortiveDraw(reason) {
      await this.ui.event('ryuukyoku', { reason, tenpai: this.h.players.map(() => false), hands: this.h.players.map(pl => pl.hand.slice()), deltas: new Array(this.n).fill(0), before: this.scores.slice(), after: this.scores.slice() });
      return { type: 'draw', dealerKeeps: true };
    }
  }

  const GameMod = { Game, FEVER_TARGETS };
  if (typeof module !== 'undefined' && module.exports) module.exports = GameMod;
  else root.GameMod = GameMod;
})(typeof window !== 'undefined' ? window : globalThis);
