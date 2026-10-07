/* =========================================================
 *  雀姫☆スターライト - 麻雀ルールエンジン
 *  牌: 0-8 萬子 / 9-17 筒子 / 18-26 索子 / 27東 28南 29西 30北 31白 32發 33中
 *  牌インスタンスID: 0..135 (type = id>>2, id%4==0 の5は赤)
 * ========================================================= */
(function (root) {
  'use strict';
  const MJ = {};

  MJ.SHORT = [];
  for (const s of ['m', 'p', 's']) for (let n = 1; n <= 9; n++) MJ.SHORT.push(n + s);
  MJ.SHORT.push('E', 'S', 'W', 'N', 'P', 'F', 'C');
  MJ.HONOR_JP = ['東', '南', '西', '北', '白', '發', '中'];
  MJ.WIND_JP = ['東', '南', '西', '北'];
  MJ.NUM_JP = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  MJ.tileName = function (t) {
    if (t >= 27) return MJ.HONOR_JP[t - 27];
    return (t % 9 + 1) + ['萬', '筒', '索'][Math.floor(t / 9)];
  };
  MJ.typeOf = (id) => id >> 2;
  MJ.isRedId = (id) => (id >> 2) < 27 && (id >> 2) % 9 === 4 && id % 4 === 0;
  MJ.isHonor = (t) => t >= 27;
  MJ.isTerminal = (t) => t < 27 && (t % 9 === 0 || t % 9 === 8);
  MJ.isYaochu = (t) => t >= 27 || t % 9 === 0 || t % 9 === 8;
  MJ.isDragon = (t) => t >= 31;
  MJ.isWind = (t) => t >= 27 && t <= 30;
  MJ.GREEN = new Set([19, 20, 21, 23, 25, 32]);
  MJ.YAOCHU = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33];

  /** 3人麻雀で使わない牌 (2m-8m) */
  MJ.isRemoved3p = (t) => t >= 1 && t <= 7;

  MJ.doraFromIndicator = function (ind, is3p) {
    if (ind < 27) {
      const base = ind - (ind % 9);
      if (is3p && base === 0) return ind === 0 ? 8 : 0;
      return base + ((ind % 9) + 1) % 9;
    }
    if (ind <= 30) return 27 + ((ind - 27 + 1) % 4);
    return 31 + ((ind - 31 + 1) % 3);
  };

  MJ.countsFromIds = function (ids) {
    const c = new Array(34).fill(0);
    for (const id of ids) c[id >> 2]++;
    return c;
  };

  /** 開門: 親を1として出目の席を選び、その席の右端から出目の幢を残す。 */
  MJ.wallBreak = function (count, dealer, dice) {
    const total = dice[0] + dice[1];
    return { side: (dealer + total - 1) % count, stack: total };
  };

  /** 配牌順。山の添字を保持し、配牌補正後の描画でも同じ順序を使う。 */
  MJ.dealBatches = function (count, dealer) {
    const batches = [];
    let index = 0;
    for (let round = 0; round < 4; round++) for (let seat = 0; seat < count; seat++) {
      const size = round < 3 ? 4 : 1;
      batches.push({ p: (dealer + seat) % count, indices: Array.from({ length: size }, () => index++) });
    }
    return batches;
  };

  /* ---------------- 向聴数 ---------------- */
  function shantenNormal(c, melds) {
    let best = 8;
    let m = 0, t = 0, p = 0;
    function scanTaatsu(i) {
      while (i < 34 && !c[i]) i++;
      if (i >= 34) {
        const mm = m + melds;
        const tt = Math.min(t, 4 - mm);
        const s = 8 - 2 * mm - tt - p;
        if (s < best) best = s;
        return;
      }
      if (m + melds + t < 4) {
        if (c[i] >= 2) { c[i] -= 2; t++; scanTaatsu(i); t--; c[i] += 2; }
        if (i < 27) {
          const r = i % 9;
          if (r < 8 && c[i + 1]) { c[i]--; c[i + 1]--; t++; scanTaatsu(i); t--; c[i]++; c[i + 1]++; }
          if (r < 7 && c[i + 2]) { c[i]--; c[i + 2]--; t++; scanTaatsu(i); t--; c[i]++; c[i + 2]++; }
        }
      }
      scanTaatsu(i + 1);
    }
    function scanMentsu(i) {
      while (i < 34 && !c[i]) i++;
      if (i >= 34) { scanTaatsu(0); return; }
      if (c[i] >= 3) { c[i] -= 3; m++; scanMentsu(i); m--; c[i] += 3; }
      if (i < 27 && i % 9 < 7 && c[i + 1] && c[i + 2]) {
        c[i]--; c[i + 1]--; c[i + 2]--; m++; scanMentsu(i); m--; c[i]++; c[i + 1]++; c[i + 2]++;
      }
      scanMentsu(i + 1);
    }
    scanMentsu(0);
    for (let i = 0; i < 34; i++) {
      if (c[i] >= 2) { c[i] -= 2; p = 1; scanMentsu(0); p = 0; c[i] += 2; }
    }
    return best;
  }
  /* 高速版: 色ごとに (面子, 塔子, 雀頭) の組を列挙してキャッシュ */
  const partCache = new Map();
  function partOptions(c, off, len, seq) {
    let key = seq ? 's' : 'h';
    for (let k = 0; k < len; k++) key += c[off + k];
    const hit = partCache.get(key);
    if (hit) return hit;
    const a = [];
    for (let k = 0; k < len; k++) a.push(c[off + k]);
    const found = [[], []]; // p=0, p=1 : list of [m,t]
    let m = 0, t = 0, p = 0;
    function push() {
      const L = found[p];
      for (const q of L) if (q[0] >= m && q[1] >= t) return;
      for (let i = L.length - 1; i >= 0; i--) if (m >= L[i][0] && t >= L[i][1]) L.splice(i, 1);
      L.push([m, t]);
    }
    function scanT(i) {
      while (i < len && !a[i]) i++;
      if (i >= len) { push(); return; }
      if (a[i] >= 2) {
        a[i] -= 2; t++; scanT(i); t--;
        if (!p) { p = 1; scanT(i); p = 0; }
        a[i] += 2;
      }
      if (seq) {
        if (i < len - 1 && a[i + 1]) { a[i]--; a[i + 1]--; t++; scanT(i); t--; a[i]++; a[i + 1]++; }
        if (i < len - 2 && a[i + 2]) { a[i]--; a[i + 2]--; t++; scanT(i); t--; a[i]++; a[i + 2]++; }
      }
      scanT(i + 1);
    }
    function scanM(i) {
      while (i < len && !a[i]) i++;
      if (i >= len) { scanT(0); return; }
      if (a[i] >= 3) { a[i] -= 3; m++; scanM(i); m--; a[i] += 3; }
      if (seq && i < len - 2 && a[i + 1] && a[i + 2]) {
        a[i]--; a[i + 1]--; a[i + 2]--; m++; scanM(i); m--; a[i]++; a[i + 1]++; a[i + 2]++;
      }
      scanM(i + 1);
    }
    scanM(0);
    const res = [];
    for (const [mm, tt] of found[0]) res.push([mm, tt, 0]);
    for (const [mm, tt] of found[1]) res.push([mm, tt, 1]);
    partCache.set(key, res);
    return res;
  }
  function shantenNormalFast(c, melds) {
    const parts = [partOptions(c, 0, 9, true), partOptions(c, 9, 9, true), partOptions(c, 18, 9, true), partOptions(c, 27, 7, false)];
    let best = 8;
    for (const A of parts[0]) for (const B of parts[1]) {
      const p2 = A[2] + B[2]; if (p2 > 1) continue;
      for (const C of parts[2]) {
        const p3 = p2 + C[2]; if (p3 > 1) continue;
        for (const D of parts[3]) {
          const p = p3 + D[2]; if (p > 1) continue;
          const mm = A[0] + B[0] + C[0] + D[0] + melds;
          const tt = Math.min(A[1] + B[1] + C[1] + D[1], 4 - mm);
          const s = 8 - 2 * mm - Math.max(0, tt) - p;
          if (s < best) best = s;
        }
      }
    }
    return best;
  }
  function shantenChiitoi(c) {
    let pairs = 0, kinds = 0;
    for (let i = 0; i < 34; i++) { if (c[i] >= 1) kinds++; if (c[i] >= 2) pairs++; }
    return 6 - pairs + Math.max(0, 7 - kinds);
  }
  function shantenKokushi(c) {
    let kinds = 0, pair = 0;
    for (const i of MJ.YAOCHU) { if (c[i] >= 1) kinds++; if (c[i] >= 2) pair = 1; }
    return 13 - kinds - pair;
  }
  MJ.shanten = function (c, melds) {
    melds = melds || 0;
    let s = shantenNormalFast(c, melds);
    if (melds === 0) {
      s = Math.min(s, shantenChiitoi(c), shantenKokushi(c));
    }
    return s;
  };
  MJ.shantenNormal = shantenNormal;
  MJ.shantenNormalFast = shantenNormalFast;
  MJ.shantenChiitoi = shantenChiitoi;
  MJ.shantenKokushi = shantenKokushi;

  /* ---------------- 和了判定 ---------------- */
  function canMentsu(c, i) {
    while (i < 34 && !c[i]) i++;
    if (i >= 34) return true;
    if (c[i] >= 3) { c[i] -= 3; const ok = canMentsu(c, i); c[i] += 3; if (ok) return true; }
    if (i < 27 && i % 9 < 7 && c[i + 1] && c[i + 2]) {
      c[i]--; c[i + 1]--; c[i + 2]--;
      const ok = canMentsu(c, i);
      c[i]++; c[i + 1]++; c[i + 2]++;
      if (ok) return true;
    }
    return false;
  }
  MJ.isAgariNormal = function (c) {
    for (let i = 0; i < 34; i++) {
      if (c[i] >= 2) { c[i] -= 2; const ok = canMentsu(c, 0); c[i] += 2; if (ok) return true; }
    }
    return false;
  };
  MJ.isAgari = function (c, melds) {
    melds = melds || 0;
    if (!Number.isInteger(melds) || melds < 0 || melds > 4 || c.length !== 34 || c.some(n => !Number.isInteger(n) || n < 0 || n > 4)) return false;
    let total = 0; for (let i = 0; i < 34; i++) total += c[i];
    if (total !== 14 - melds * 3) return false;
    if (MJ.isAgariNormal(c)) return true;
    if (!melds && total === 14) {
      let pairs = 0; for (let i = 0; i < 34; i++) if (c[i] === 2) pairs++;
      if (pairs === 7) return true;
      if (shantenKokushi(c) === -1) return true;
    }
    return false;
  };

  /** 13枚(3n+1)の待ち牌 */
  MJ.waits = function (c, melds, is3p) {
    const res = [];
    const exposed = Array(34).fill(0);
    if (Array.isArray(melds)) {
      for (const m of melds) {
        if (m.type === 'chi') { exposed[m.t]++; exposed[m.t + 1]++; exposed[m.t + 2]++; }
        else exposed[m.t] += m.type === 'pon' ? 3 : 4;
      }
      melds = melds.length;
    }
    for (let t = 0; t < 34; t++) {
      if (is3p && MJ.isRemoved3p(t)) continue;
      if (c[t] + exposed[t] >= 4) continue;
      c[t]++;
      if (MJ.isAgari(c, melds)) res.push(t);
      c[t]--;
    }
    return res;
  };

  /** 面子分解（全パターン） */
  MJ.decompose = function (c) {
    const results = [];
    const groups = [];
    let pair = -1;
    function rec(i) {
      while (i < 34 && !c[i]) i++;
      if (i >= 34) { results.push({ pair, groups: groups.slice() }); return; }
      if (c[i] >= 3) { c[i] -= 3; groups.push({ k: 'kou', t: i }); rec(i); groups.pop(); c[i] += 3; }
      if (i < 27 && i % 9 < 7 && c[i + 1] && c[i + 2]) {
        c[i]--; c[i + 1]--; c[i + 2]--; groups.push({ k: 'shun', t: i });
        rec(i);
        groups.pop(); c[i]++; c[i + 1]++; c[i + 2]++;
      }
    }
    for (let p = 0; p < 34; p++) {
      if (c[p] >= 2) { c[p] -= 2; pair = p; rec(0); c[p] += 2; }
    }
    return results;
  };

  /* ---------------- 役定義 ---------------- */
  const Y = {
    riichi: ['立直', 1], dRiichi: ['ダブル立直', 2], ippatsu: ['一発', 1], tsumo: ['門前清自摸和', 1],
    pinfu: ['平和', 1], tanyao: ['断么九', 1], iipeikou: ['一盃口', 1],
    haku: ['役牌 白', 1], hatsu: ['役牌 發', 1], chun: ['役牌 中', 1],
    bakaze: ['場風牌', 1], jikaze: ['自風牌', 1],
    haitei: ['海底摸月', 1], houtei: ['河底撈魚', 1], rinshan: ['嶺上開花', 1], chankan: ['槍槓', 1],
    chiitoi: ['七対子', 2], sanshoku: ['三色同順', 2, 1], ittsu: ['一気通貫', 2, 1], chanta: ['混全帯么九', 2, 1],
    toitoi: ['対々和', 2], sanankou: ['三暗刻', 2], sanshokuDoukou: ['三色同刻', 2], sankantsu: ['三槓子', 2],
    shousangen: ['小三元', 2], honroutou: ['混老頭', 2],
    ryanpeikou: ['二盃口', 3], honitsu: ['混一色', 3, 2], junchan: ['純全帯么九', 3, 2],
    chinitsu: ['清一色', 6, 5],
  };
  MJ.YAKU = Y;
  const YM = {
    tenhou: ['天和', 1], chiihou: ['地和', 1], kokushi: ['国士無双', 1], kokushi13: ['国士無双十三面待ち', 2],
    suuankou: ['四暗刻', 1], suuankouTanki: ['四暗刻単騎', 2], daisangen: ['大三元', 1],
    shousuushi: ['小四喜', 1], daisuushi: ['大四喜', 2], tsuuiisou: ['字一色', 1], ryuuiisou: ['緑一色', 1],
    chinroutou: ['清老頭', 1], chuuren: ['九蓮宝燈', 1], junseiChuuren: ['純正九蓮宝燈', 2], suukantsu: ['四槓子', 1],
  };
  MJ.YAKUMAN = YM;

  function ceil100(x) { return Math.ceil(x / 100) * 100; }
  function ceil10(x) { return Math.ceil(x / 10) * 10; }

  MJ.basePoints = function (han, fu, yakuman) {
    if (yakuman > 0) return { base: 8000 * yakuman, name: yakuman >= 2 ? (['', '', 'ダブル', 'トリプル', '四倍', '五倍', '六倍'][yakuman] || yakuman + '倍') + '役満' : '役満' };
    if (han >= 13) return { base: 8000, name: '数え役満' };
    if (han >= 11) return { base: 6000, name: '三倍満' };
    if (han >= 8) return { base: 4000, name: '倍満' };
    if (han >= 6) return { base: 3000, name: '跳満' };
    if (han >= 5) return { base: 2000, name: '満貫' };
    const b = fu * Math.pow(2, han + 2);
    if (b >= 2000) return { base: 2000, name: '満貫' };
    return { base: b, name: '' };
  };
  MJ.payments = function (base, isDealer) {
    return {
      ron: ceil100(base * (isDealer ? 6 : 4)),
      tsumoAll: ceil100(base * 2), // 親ツモ時 各自
      tsumoDealer: ceil100(base * 2), // 子ツモ時 親の支払い
      tsumoChild: ceil100(base), // 子ツモ時 子の支払い
    };
  };

  /**
   * 和了評価
   * ctx: { counts(34, 和了牌込みの手牌), melds:[{type,t}], winTile, tsumo, seatWind, roundWind,
   *        riichi(0/1/2), ippatsu, haitei, houtei, rinshan, chankan, tenhou, chiihou,
   *        doraInd:[], uraInd:[], redCount, nukiCount, is3p, isDealer }
   */
  MJ.evaluate = function (ctx) {
    const c = ctx.counts.slice();
    const melds = ctx.melds || [];
    if (!MJ.isAgari(c, melds.length) || !c[ctx.winTile]) return null;
    const menzen = melds.every(m => m.type === 'ankan');
    const cands = [];

    // 全牌カウント（ドラ計算・一色判定用）
    const all = c.slice();
    for (const m of melds) {
      if (m.type === 'chi') { all[m.t]++; all[m.t + 1]++; all[m.t + 2]++; }
      else if (m.type === 'pon') all[m.t] += 3;
      else all[m.t] += 4;
    }
    if (all.some(n => n > 4)) return null;

    // --- 状況役・ドラ（共通）---
    function situational(list) {
      if (ctx.riichi === 2) list.push(Y.dRiichi);
      else if (ctx.riichi === 1) list.push(Y.riichi);
      if (ctx.riichi && ctx.ippatsu) list.push(Y.ippatsu);
      if (menzen && ctx.tsumo) list.push(Y.tsumo);
      if (ctx.haitei && ctx.tsumo && !ctx.rinshan) list.push(Y.haitei);
      if (ctx.houtei && !ctx.tsumo) list.push(Y.houtei);
      if (ctx.rinshan) list.push(Y.rinshan);
      if (ctx.chankan) list.push(Y.chankan);
    }
    function colorYaku(list, open) {
      let suits = new Set(), honor = false;
      for (let i = 0; i < 34; i++) if (all[i]) { if (i >= 27) honor = true; else suits.add(Math.floor(i / 9)); }
      if (suits.size === 1) {
        if (honor) list.push(yk(Y.honitsu, open)); else list.push(yk(Y.chinitsu, open));
      }
      let allY = true, allSimple = true;
      for (let i = 0; i < 34; i++) if (all[i]) { if (!MJ.isYaochu(i)) allY = false; else allSimple = false; }
      return { allY, allSimple, suits, honor };
    }
    function yk(y, open) { return open && y.length > 2 ? [y[0], y[2]] : [y[0], y[1]]; }

    function doraCount() {
      let d = 0;
      for (const ind of ctx.doraInd || []) d += all[MJ.doraFromIndicator(ind, ctx.is3p)];
      let x = 0;
      for (const t of ctx.extraDoraTypes || []) x += all[t];
      let u = 0;
      if (ctx.riichi) for (const ind of ctx.uraInd || []) u += all[MJ.doraFromIndicator(ind, ctx.is3p)];
      let nuki = 0;
      if (ctx.nukiCount) {
        nuki = ctx.nukiCount;
        for (const ind of ctx.doraInd || []) if (MJ.doraFromIndicator(ind, ctx.is3p) === 30) nuki += ctx.nukiCount;
        if (ctx.riichi) for (const ind of ctx.uraInd || []) if (MJ.doraFromIndicator(ind, ctx.is3p) === 30) nuki += ctx.nukiCount;
      }
      return { dora: d, ura: u, red: ctx.redCount || 0, nuki, extra: x };
    }

    function commonYakuman(list, isChiitoi) {
      if (ctx.tenhou) list.push(YM.tenhou);
      if (ctx.chiihou) list.push(YM.chiihou);
      let allHonor = true, allGreen = true, allTerm = true;
      for (let i = 0; i < 34; i++) if (all[i]) {
        if (i < 27) allHonor = false;
        if (!MJ.GREEN.has(i)) allGreen = false;
        if (!MJ.isTerminal(i)) allTerm = false;
      }
      if (allHonor) list.push(YM.tsuuiisou);
      if (allGreen) list.push(YM.ryuuiisou);
      if (allTerm) list.push(YM.chinroutou);
    }

    function finish(yakuList, yakumanList, fu, extra) {
      const dc = doraCount();
      let result;
      if (yakumanList.length) {
        const n = yakumanList.reduce((a, y) => a + y[1], 0);
        const bp = MJ.basePoints(0, 0, n);
        result = { yaku: yakumanList.map(y => ({ name: y[0], han: y[1] >= 2 ? 'ダブル役満' : '役満', yakuman: y[1] })), han: 0, fu: 0, yakuman: n, base: bp.base, limitName: bp.name };
      } else {
        const han0 = yakuList.reduce((a, y) => a + y[1], 0);
        if (han0 <= 0 && !ctx.allowNoYaku) return null;
        const yk2 = yakuList.map(y => ({ name: y[0], han: y[1] }));
        let han = han0;
        if (dc.dora) { yk2.push({ name: 'ドラ', han: dc.dora }); han += dc.dora; }
        if (dc.red) { yk2.push({ name: '赤ドラ', han: dc.red }); han += dc.red; }
        if (dc.ura) { yk2.push({ name: '裏ドラ', han: dc.ura }); han += dc.ura; }
        if (dc.nuki) { yk2.push({ name: '抜きドラ', han: dc.nuki }); han += dc.nuki; }
        if (dc.extra) { yk2.push({ name: '特別ドラ', han: dc.extra }); han += dc.extra; }
        const bp = MJ.basePoints(han, fu, 0);
        result = { yaku: yk2, han, fu, yakuman: 0, base: bp.base, limitName: bp.name };
      }
      Object.assign(result, extra || {});
      result.pay = MJ.payments(result.base, ctx.isDealer);
      return result;
    }

    // ---- 国士無双 ----
    if (melds.length === 0 && shantenKokushi(c) === -1) {
      const list = [];
      commonYakuman(list, false);
      list.push(c[ctx.winTile] === 2 ? YM.kokushi13 : YM.kokushi);
      cands.push(finish([], list, 0, { form: 'kokushi' }));
    }

    // ---- 七対子 ----
    if (melds.length === 0) {
      let pairs = 0; for (let i = 0; i < 34; i++) if (c[i] === 2) pairs++;
      if (pairs === 7) {
        const ym = [];
        commonYakuman(ym, true);
        const list = [];
        situational(list);
        list.push(Y.chiitoi);
        const col = colorYaku(list, false);
        if (col.allSimple) list.push(Y.tanyao);
        if (col.allY) list.push(Y.honroutou);
        cands.push(finish(list, ym, 25, { form: 'chiitoi' }));
      }
    }

    // ---- 通常形 ----
    const decs = MJ.decompose(c);
    const yakuhaiSet = (t) => {
      let v = 0;
      if (t >= 31) v++;
      if (t === ctx.seatWind) v++;
      if (t === ctx.roundWind) v++;
      return v;
    };
    for (const d of decs) {
      // 和了牌の所属先候補
      const choices = [];
      d.groups.forEach((g, gi) => {
        if (g.k === 'kou' && g.t === ctx.winTile) choices.push({ gi, wait: 'shanpon' });
        if (g.k === 'shun' && ctx.winTile >= g.t && ctx.winTile <= g.t + 2) {
          let w = 'ryanmen';
          if (ctx.winTile === g.t + 1) w = 'kanchan';
          else if (ctx.winTile === g.t && g.t % 9 === 6) w = 'penchan';
          else if (ctx.winTile === g.t + 2 && g.t % 9 === 0) w = 'penchan';
          choices.push({ gi, wait: w });
        }
      });
      if (d.pair === ctx.winTile) choices.push({ gi: -1, wait: 'tanki' });

      for (const ch of choices) {
        // グループ一覧 (open: 副露か, conc: 暗刻扱いか)
        const G = d.groups.map((g, gi) => ({ k: g.k, t: g.t, open: false, anko: g.k === 'kou' && !(gi === ch.gi && !ctx.tsumo) }));
        for (const m of melds) {
          if (m.type === 'chi') G.push({ k: 'shun', t: m.t, open: true, anko: false });
          else if (m.type === 'pon') G.push({ k: 'kou', t: m.t, open: true, anko: false });
          else if (m.type === 'ankan') G.push({ k: 'kan', t: m.t, open: false, anko: true });
          else G.push({ k: 'kan', t: m.t, open: true, anko: false });
        }
        const pair = d.pair;
        const kous = G.filter(g => g.k !== 'shun');
        const shuns = G.filter(g => g.k === 'shun');
        const ankouN = G.filter(g => g.anko).length;
        const kanN = G.filter(g => g.k === 'kan').length;

        // --- 役満 ---
        const ym = [];
        commonYakuman(ym, false);
        if (ankouN === 4) ym.push(ch.wait === 'tanki' ? YM.suuankouTanki : YM.suuankou);
        const dragonKou = kous.filter(g => g.t >= 31).length;
        if (dragonKou === 3) ym.push(YM.daisangen);
        const windKou = kous.filter(g => g.t >= 27 && g.t <= 30).length;
        if (windKou === 4) ym.push(YM.daisuushi);
        else if (windKou === 3 && pair >= 27 && pair <= 30) ym.push(YM.shousuushi);
        if (kanN === 4) ym.push(YM.suukantsu);
        if (melds.length === 0) {
          let suit = -1, ok = true;
          for (let i = 0; i < 34; i++) if (c[i]) { const s = i < 27 ? Math.floor(i / 9) : 3; if (suit < 0) suit = s; else if (suit !== s) ok = false; }
          if (ok && suit < 3) {
            const b = suit * 9;
            const need = [3, 1, 1, 1, 1, 1, 1, 1, 3];
            let pat = true;
            for (let k = 0; k < 9; k++) if (c[b + k] < need[k]) pat = false;
            if (pat) {
              const before = c.slice(); before[ctx.winTile]--;
              let junsei = true;
              for (let k = 0; k < 9; k++) if (before[b + k] !== need[k]) junsei = false;
              ym.push(junsei ? YM.junseiChuuren : YM.chuuren);
            }
          }
        }
        if (ym.length) { cands.push(finish([], ym, 0, { form: 'normal' })); continue; }

        // --- 通常役 ---
        const list = [];
        situational(list);
        const open = !menzen;
        const isPinfu = menzen && shuns.length === 4 && yakuhaiSet(pair) === 0 && ch.wait === 'ryanmen';
        if (isPinfu) list.push(Y.pinfu);
        const col = colorYaku(list, open);
        if (col.allSimple) list.push(Y.tanyao);
        // 一盃口/二盃口
        if (menzen) {
          const cnt = {};
          for (const s of shuns) cnt[s.t] = (cnt[s.t] || 0) + 1;
          let peiko = 0;
          for (const k in cnt) peiko += Math.floor(cnt[k] / 2);
          if (peiko >= 2) list.push(Y.ryanpeikou);
          else if (peiko === 1) list.push(Y.iipeikou);
        }
        // 役牌
        for (const g of kous) {
          if (g.t === 31) list.push(Y.haku);
          if (g.t === 32) list.push(Y.hatsu);
          if (g.t === 33) list.push(Y.chun);
          if (g.t === ctx.roundWind) list.push(Y.bakaze);
          if (g.t === ctx.seatWind) list.push(Y.jikaze);
        }
        // 三色同順
        for (let n = 0; n < 7; n++) {
          if (shuns.some(s => s.t === n) && shuns.some(s => s.t === n + 9) && shuns.some(s => s.t === n + 18)) { list.push(yk(Y.sanshoku, open)); break; }
        }
        // 一気通貫
        for (let s = 0; s < 3; s++) {
          if ([0, 3, 6].every(k => shuns.some(x => x.t === s * 9 + k))) { list.push(yk(Y.ittsu, open)); break; }
        }
        // チャンタ / 純チャン
        const grpHasY = (g) => g.k === 'shun' ? (MJ.isTerminal(g.t) || MJ.isTerminal(g.t + 2)) : MJ.isYaochu(g.t);
        if (G.every(grpHasY) && MJ.isYaochu(pair) && shuns.length > 0) {
          const hasHonor = pair >= 27 || G.some(g => g.k !== 'shun' && g.t >= 27);
          list.push(hasHonor ? yk(Y.chanta, open) : yk(Y.junchan, open));
        }
        if (kous.length === 4) list.push(Y.toitoi);
        if (ankouN === 3) list.push(Y.sanankou);
        for (let n = 0; n < 9; n++) {
          if ([0, 9, 18].every(o => kous.some(g => g.t === n + o))) { list.push(Y.sanshokuDoukou); break; }
        }
        if (kanN === 3) list.push(Y.sankantsu);
        if (dragonKou === 2 && pair >= 31) list.push(Y.shousangen);
        if (col.allY) list.push(Y.honroutou);

        // --- 符 ---
        let fu;
        if (isPinfu) fu = ctx.tsumo ? 20 : 30;
        else {
          fu = 20;
          if (menzen && !ctx.tsumo) fu += 10;
          if (ctx.tsumo) fu += 2;
          for (const g of G) {
            if (g.k === 'shun') continue;
            let f = 2;
            if (MJ.isYaochu(g.t)) f *= 2;
            if (g.anko) f *= 2;
            if (g.k === 'kan') f *= 4;
            fu += f;
          }
          fu += 2 * yakuhaiSet(pair);
          if (ch.wait === 'kanchan' || ch.wait === 'penchan' || ch.wait === 'tanki') fu += 2;
          if (fu === 20) fu = 30; // 喰い平和形
          fu = ceil10(fu);
        }
        cands.push(finish(list, [], fu, { form: 'normal', wait: ch.wait }));
      }
    }

    let best = null;
    for (const r of cands) {
      if (!r) continue;
      if (!best || r.base > best.base || (r.base === best.base && (r.han > best.han || (r.han === best.han && r.fu > best.fu)))) best = r;
    }
    return best;
  };

  /* ---------------- 山 ---------------- */
  MJ.buildWall = function (is3p, rng) {
    rng = rng || Math.random;
    const ids = [];
    for (let id = 0; id < 136; id++) {
      const t = id >> 2;
      if (is3p && MJ.isRemoved3p(t)) continue;
      ids.push(id);
    }
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  };

  MJ.sortIds = function (ids) {
    return ids.slice().sort((a, b) => (a >> 2) - (b >> 2) || (MJ.isRedId(b) - MJ.isRedId(a)) || a - b);
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MJ;
  else root.MJ = MJ;
})(typeof window !== 'undefined' ? window : globalThis);
