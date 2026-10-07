/* =========================================================
 *  AI 思考ルーチン
 *  style: 'balance' | 'attack' | 'defense' | 'speed' | 'value'
 * ========================================================= */
(function (root) {
  'use strict';
  const MJ = root.MJ || (typeof require !== 'undefined' ? require('./mahjong.js') : null);
  const AI = {};

  /** p から見えている牌の枚数（自分の手牌・全員の河・副露・ドラ表示・抜き） */
  AI.visibleCounts = function (g, p) {
    const v = new Array(34).fill(0);
    const h = g.h;
    for (const id of h.players[p].hand) v[id >> 2]++;
    for (const pl of h.players) {
      for (const d of pl.discards) if (!d.called) v[d.id >> 2]++;
      for (const m of pl.melds) for (const id of m.ids) v[id >> 2]++;
      for (const id of pl.nuki) v[id >> 2]++;
    }
    for (const ind of g.doraIndicators()) v[ind]++;
    return v;
  };

  function ukeire(c, melds, sh, visible, is3p) {
    let n = 0; const tiles = [];
    for (let t = 0; t < 34; t++) {
      if (is3p && MJ.isRemoved3p(t)) continue;
      const left = 4 - visible[t];
      if (left <= 0) continue;
      c[t]++;
      if (MJ.shanten(c, melds) < sh) { n += left; tiles.push(t); }
      c[t]--;
    }
    return { n, tiles };
  }
  AI.ukeire = ukeire;

  /** 危険度 0(安全)〜12 */
  AI.danger = function (g, t, q, visible) {
    const pl = g.h.players[q];
    const safe = pl.safeTypes; // 現物 + リーチ後通過牌
    if (safe.has(t)) return 0;
    let d;
    if (t >= 27) {
      const v = visible[t];
      d = v >= 3 ? 1 : v === 2 ? 3 : 6;
      if (t >= 31 || t === g.h.roundWindTile || t === g.seatWind(q)) d += 2;
    } else {
      const n = t % 9, b = t - n;
      const disc = (k) => k >= 0 && k <= 8 && safe.has(b + k);
      if (n === 0 || n === 8) d = disc(n === 0 ? 3 : 5) ? 2 : 5;
      else if (n === 1 || n === 7) d = disc(n === 1 ? 4 : 4) ? 3 : 7;
      else if (n === 2 || n === 6) d = disc(n === 2 ? 5 : 3) ? 3 : 8;
      else {
        const a = disc(n - 3), c2 = disc(n + 3);
        d = a && c2 ? 4 : (a || c2) ? 7 : 10;
      }
      // ワンチャンス/ノーチャンス
      if (n >= 1 && n <= 7) {
        if (visible[t - 1] >= 4 || visible[t + 1] >= 4) d = Math.max(1, d - 3);
      }
    }
    if (g.isDoraType(t)) d += 1;
    return d;
  };

  function threatPlayers(g, p) {
    const res = [];
    g.h.players.forEach((pl, q) => {
      if (q === p) return;
      if (pl.riichi) res.push({ q, w: 1 });
      else if (pl.melds.filter(m => m.type !== 'ankan').length >= 3) res.push({ q, w: 0.6 });
    });
    return res;
  }

  function isYakuhaiType(g, p, t) {
    return t >= 31 || t === g.h.roundWindTile || t === g.seatWind(p);
  }

  /** 打牌選択 */
  AI.chooseDiscard = function (g, p, allowedIds, opts) {
    opts = opts || {};
    const pl = g.h.players[p];
    const style = pl.style || 'balance';
    const c = MJ.countsFromIds(pl.hand);
    const melds = pl.melds.length;
    const visible = AI.visibleCounts(g, p);
    const threats = threatPlayers(g, p);
    const target = pl.feverTarget;
    const byType = new Map();
    for (const id of allowedIds) {
      const t = id >> 2;
      if (!byType.has(t)) byType.set(t, []);
      byType.get(t).push(id);
    }
    const cur = MJ.shanten(c, melds);
    const evals = [];
    for (const [t, ids] of byType) {
      c[t]--;
      const sh = MJ.shanten(c, melds);
      const uk = sh <= 3 ? ukeire(c, melds, sh, visible, g.is3p).n : 0;
      c[t]++;
      let score = -sh * 1000 + uk * 8;
      // 価値
      if (g.isDoraType(t)) score -= (sh >= 2 ? 40 : 25);
      if (ids.every(id => MJ.isRedId(id))) score -= 30;
      if (t >= 27) {
        if (isYakuhaiType(g, p, t)) { score -= c[t] >= 2 ? 60 : 8; }
        else score += c[t] === 1 ? 18 : 0; // 客風の孤立牌は早めに
      } else {
        const n = t % 9;
        if (c[t] === 1) {
          const iso = !((n > 0 && c[t - 1]) || (n < 8 && c[t + 1]) || (n > 1 && c[t - 2]) || (n < 7 && c[t + 2]));
          if (iso) score += (n === 0 || n === 8) ? 14 : 6;
        }
      }
      if (style === 'value' && g.isDoraType(t)) score -= 30;
      // 役満フィーバー: 狙い牌は残す
      if (target && target.types.has(t)) score -= 90 * (target.strength || 1);
      // 守備
      let danger = 0;
      for (const th of threats) danger = Math.max(danger, AI.danger(g, t, th.q, visible) * th.w);
      evals.push({ t, ids, sh, uk, score, danger });
    }
    if (threats.length) {
      const bestSh = Math.min(...evals.map(e => e.sh));
      let fold = bestSh >= 2 || (bestSh === 1 && (style === 'defense' || style === 'balance'));
      if (style === 'attack' && bestSh <= 1) fold = false;
      if (pl.riichi) fold = false;
      for (const e of evals) {
        if (fold) e.score = -e.danger * 1000 - e.sh * 10 + e.uk * 0.1;
        else {
          const w = style === 'attack' ? 12 : style === 'defense' ? 60 : 30;
          e.score -= e.danger * w * (bestSh === 0 ? 0.6 : 1);
        }
      }
    }
    evals.sort((a, b) => b.score - a.score);
    const best = evals[0];
    // 赤5は非赤を優先して切る
    const id = best.ids.slice().sort((a, b) => MJ.isRedId(a) - MJ.isRedId(b))[0];
    return { id, sh: best.sh, cur };
  };

  /** 自分の手番の行動 */
  AI.selfDecision = function (g, p, opt) {
    const pl = g.h.players[p];
    if (opt.canTsumo) return { action: 'tsumo' };
    if (opt.canKyuushu && !g.fever && MJ.shantenKokushi(MJ.countsFromIds(pl.hand)) >= 3) return { action: 'kyuushu' };
    if (opt.canNuki) return { action: 'nuki' };
    if (pl.riichi) {
      if (opt.kanOptions && opt.kanOptions.length) return { action: 'kan', kan: opt.kanOptions[0] };
      return { action: 'discard', id: opt.drawnId };
    }
    // カン
    if (opt.kanOptions && opt.kanOptions.length) {
      for (const k of opt.kanOptions) {
        if (k.type === 'kakan') return { action: 'kan', kan: k };
        const c = MJ.countsFromIds(pl.hand);
        const m = pl.melds.length;
        let bestNow = 99;
        for (let t = 0; t < 34; t++) if (c[t]) { c[t]--; bestNow = Math.min(bestNow, MJ.shanten(c, m)); c[t]++; }
        c[k.t] -= 4;
        const after = MJ.shanten(c, m + 1);
        c[k.t] += 4;
        if (after <= bestNow && threatPlayers(g, p).length === 0) return { action: 'kan', kan: k };
      }
    }
    // リーチ
    if (opt.riichiIds && opt.riichiIds.length) {
      const dama = pl.style === 'value' && g.rng() < 0.2;
      if (!dama) {
        const visible = AI.visibleCounts(g, p);
        let best = null, bestN = -1;
        const c = MJ.countsFromIds(pl.hand);
        const seen = new Set();
        for (const id of opt.riichiIds) {
          const t = id >> 2; if (seen.has(t)) continue; seen.add(t);
          c[t]--;
          const w = MJ.waits(c, pl.melds, g.is3p);
          let n = 0; for (const x of w) n += Math.max(0, 4 - visible[x] - (x === t ? 0 : 0));
          c[t]++;
          if (n > bestN) { bestN = n; best = id; }
        }
        if (bestN > 0) return { action: 'riichi', id: best };
      }
    }
    const d = AI.chooseDiscard(g, p, opt.discardable);
    return { action: 'discard', id: d.id };
  };

  /** 鳴いた後に役が付きそうか */
  function yakuPotential(g, p, c, meldsAfter, calledType, callType) {
    // 役牌
    for (const m of meldsAfter) if (m.type !== 'chi' && isYakuhaiType(g, p, m.t)) return true;
    for (let t = 27; t < 34; t++) if (isYakuhaiType(g, p, t) && c[t] >= 2) return true;
    // 断么九
    let simple = true, yaoN = 0;
    for (const m of meldsAfter) {
      if (m.type === 'chi') { if (MJ.isTerminal(m.t) || MJ.isTerminal(m.t + 2)) simple = false; }
      else if (MJ.isYaochu(m.t)) simple = false;
    }
    for (let t = 0; t < 34; t++) if (c[t] && MJ.isYaochu(t)) yaoN += c[t];
    if (simple && yaoN <= 1) return true;
    // 混一色/清一色
    const suitCnt = [0, 0, 0]; let honor = 0;
    const addT = (t, k) => { if (t >= 27) honor += k; else suitCnt[Math.floor(t / 9)] += k; };
    for (let t = 0; t < 34; t++) if (c[t]) addT(t, c[t]);
    for (const m of meldsAfter) addT(m.t, 3);
    const total = suitCnt[0] + suitCnt[1] + suitCnt[2] + honor;
    const mx = Math.max(...suitCnt);
    if ((mx + honor) >= total - 1 && mx >= 6) return true;
    // 対々和
    if (callType === 'pon' && meldsAfter.every(m => m.type !== 'chi')) {
      let pairs = 0; for (let t = 0; t < 34; t++) if (c[t] >= 2) pairs++;
      if (pairs + meldsAfter.length >= 4) return true;
    }
    return false;
  }

  /** 他家の打牌に対する行動 */
  AI.callDecision = function (g, p, opt) {
    if (opt.ron) return { action: 'ron' };
    const pl = g.h.players[p];
    if (pl.riichi) return { action: 'skip' };
    const style = pl.style || 'balance';
    const t = opt.tile >> 2;
    const c = MJ.countsFromIds(pl.hand);
    const m = pl.melds.length;
    const before = MJ.shanten(c, m);
    const threats = threatPlayers(g, p);
    const target = pl.feverTarget;
    const tryCall = (remove, type, mt) => {
      const c2 = c.slice();
      for (const rt of remove) c2[rt]--;
      const meldsAfter = pl.melds.map(x => ({ type: x.type, t: x.t })).concat([{ type, t: mt }]);
      let best = 99;
      for (let x = 0; x < 34; x++) if (c2[x]) { c2[x]--; best = Math.min(best, MJ.shanten(c2, m + 1)); c2[x]++; }
      return { sh: best, ok: yakuPotential(g, p, c2, meldsAfter, t, type) };
    };
    // 役満フィーバー狙い（大三元・四喜和・字一色など）
    if (target && opt.pon && target.types.has(t) && target.allowCall) return { action: 'pon' };
    if (opt.pon) {
      const r = tryCall([t, t], 'pon', t);
      const yakuhai = isYakuhaiType(g, p, t);
      let want = r.ok && r.sh < before;
      if (yakuhai && r.sh <= before) want = true;
      if (style === 'defense' && !yakuhai) want = want && r.sh <= 1;
      if (target && !target.allowCall) want = false;
      if (threats.length && r.sh >= 2) want = false;
      if (want) return { action: 'pon' };
    }
    if (opt.chi && opt.chi.length && !(target && !target.allowCall)) {
      let bestChoice = null, bestSh = before;
      for (const ch of opt.chi) {
        const types = ch.map(id => id >> 2);
        const mt = Math.min(t, ...types);
        const r = tryCall(types, 'chi', mt);
        if (r.ok && r.sh < bestSh) { bestSh = r.sh; bestChoice = ch; }
      }
      let want = !!bestChoice;
      if (style === 'defense' || style === 'value') want = want && bestSh <= 1;
      if (style !== 'speed' && style !== 'attack' && before >= 3) want = false;
      if (threats.length && bestSh >= 2) want = false;
      if (want) return { action: 'chi', ids: bestChoice };
    }
    if (opt.minkan && t >= 31 && threats.length === 0) return { action: 'kan' };
    return { action: 'skip' };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = AI;
  else root.AI = AI;
})(typeof window !== 'undefined' ? window : globalThis);
