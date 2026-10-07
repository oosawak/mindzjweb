/* =========================================================
 *  反則技の表示データ（数値は js/engine/riot.js の CHEAT_RULES）
 *  新しい技を足すときは: ここに表示とコスト → riot.js に処理 → game-ui.js / cheat3d.js に演出
 * ========================================================= */
(function (root) {
  'use strict';
  const CHEATS = [
    { id: 'swap', kanji: '燕', color: '#5ad1ff', key: '1', cost: 1,
      ja: { name: '燕返し', desc: '手牌1枚を、山の次の6枚から好きな牌とすり替える。' },
      en: { name: 'Swallow Swap', desc: 'Swap one tile in your hand with any of the next 6 tiles in the wall.' } },
    { id: 'peek', kanji: '眼', color: '#7dffb0', key: '2', cost: 1,
      ja: { name: '千里眼', desc: '相手全員の手牌が透けて見える（次の自分の番まで）。' },
      en: { name: 'Clairvoyance', desc: "See through every opponent's hand until your next turn." } },
    { id: 'raid', kanji: '河', color: '#ffd23f', key: '3', cost: 2,
      ja: { name: '河拾い', desc: '誰かの河（捨て牌）から好きな牌を磁力で回収し、手牌1枚と入れ替える。' },
      en: { name: 'River Raid', desc: 'Magnet any discarded tile back into your hand, swapping out one of yours.' } },
    { id: 'slam', kanji: '叩', color: '#ff7a3d', key: '4', cost: 2,
      ja: { name: '強打', desc: '卓を叩いて衝撃波！相手の牌が3枚ずつ表向きに倒れ、相手はしばらく鳴けない。' },
      en: { name: 'Table Slam', desc: "Shockwave! 3 tiles of each opponent flip face-up, and they can't call until your next turn." } },
    { id: 'dora', kanji: '爆', color: '#ff5fa2', key: '5', cost: 2,
      ja: { name: 'ドラ爆弾', desc: '自分の手に一番多い牌がドラになる表示牌を、追加でめくる。' },
      en: { name: 'Dora Bomb', desc: 'Flip an extra dora indicator that turns your most common tile into dora.' } },
    { id: 'flip', kanji: '返', color: '#c08bff', key: 'F', cost: 4,
      ja: { name: 'ちゃぶ台返し', desc: '相手が和了った瞬間だけ使える。卓ごとひっくり返して、その局をなかったことに。' },
      en: { name: 'Table Flip', desc: 'Only when an opponent wins: flip the whole table and void the hand.' } },
  ];
  const byId = {}; for (const c of CHEATS) byId[c.id] = c;
  /** 技ゲージ: 自分の番ごとに +GAUGE_GAIN、最大 GAUGE_MAX。固有技は SIG_COST */
  const Cheats = { CHEATS, byId, SIG_COST: 3, GAUGE_MAX: 5, GAUGE_GAIN: 1, GAUGE_START: 2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = Cheats;
  else root.Cheats = Cheats;
})(typeof window !== 'undefined' ? window : globalThis);
