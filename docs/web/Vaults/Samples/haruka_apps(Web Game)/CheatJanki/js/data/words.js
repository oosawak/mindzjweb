/* =========================================================
 *  でっち上げ役の「言葉カード」
 *  cat: 'pre'（頭）/ 'core'（中身）/ 'suf'（締め）
 *  tag: 和了形と噛み合うと翻数が増える（js/engine/riot.js の handTags() を参照）
 *  char: そのキャラが和了ると翻数が増える
 *  言葉を足すときはここに1行追加するだけでOK。
 * ========================================================= */
(function (root) {
  'use strict';
  const W = (id, cat, ja, en, extra) => Object.assign({ id, cat, ja, en }, extra || {});
  const WORDS = [
    // ---- 頭（1翻） ----
    W('bakuretsu', 'pre', '爆裂', 'Explosive'), W('chou', 'pre', '超', 'Ultra'), W('shin', 'pre', '真・', 'True'),
    W('geki', 'pre', '激', 'Raging'), W('hiden', 'pre', '秘伝', 'Secret'), W('densetsu', 'pre', '伝説の', 'Legendary'),
    W('shinya', 'pre', '深夜', 'Midnight'), W('zenryoku', 'pre', '全力', 'All-Out'), W('otome', 'pre', '乙女', 'Maiden'),
    W('muteki', 'pre', '無敵', 'Invincible'), W('kiseki', 'pre', '奇跡の', 'Miraculous'), W('gouka', 'pre', '豪華', 'Deluxe'),
    // ---- 中身（1翻、手と噛み合えば +2） ----
    W('guren', 'core', '紅蓮', 'Crimson', { tag: 'red' }), W('kogane', 'core', '黄金', 'Golden', { tag: 'dora' }),
    W('mansatsu', 'core', '万札', 'Moneybag', { tag: 'man' }), W('enbu', 'core', '円舞', 'Waltz', { tag: 'pin' }),
    W('chikurin', 'core', '竹林', 'Bamboo Grove', { tag: 'sou' }), W('tengen', 'core', '天元', 'Heavenly', { tag: 'honor' }),
    W('senpuu', 'core', '旋風', 'Whirlwind', { tag: 'wind' }), W('ryuujin', 'core', '龍神', 'Dragon God', { tag: 'dragon' }),
    W('shichisei', 'core', '七星', 'Seven Stars', { tag: 'seven' }), W('ikkitousen', 'core', '一騎当千', 'Lone Warrior', { tag: 'term' }),
    W('jisaku', 'core', '自作自演', 'Self-Made', { tag: 'tsumo' }), W('sogeki', 'core', '狙撃', 'Sniper', { tag: 'ron' }),
    W('sengen', 'core', '宣言', 'Proclaimed', { tag: 'riichi' }), W('hakoiri', 'core', '箱入り', 'Sheltered', { tag: 'closed' }),
    W('nakimushi', 'core', '泣き虫', 'Crybaby', { tag: 'open' }), W('futago', 'core', '双子', 'Twin', { tag: 'pair' }),
    W('daikaiten', 'core', '大回転', 'Spinning', { tag: 'chaos' }), W('ikasama', 'core', 'イカサマ', 'Swindle', { tag: 'cheat' }),
    // ---- キャラの言葉（中身、本人が和了ると +2） ----
    W('sakura', 'core', '桜吹雪', 'Cherry Storm', { char: 'hiyori' }), W('ronri', 'core', '論理', 'Logic', { char: 'shizuku' }),
    W('mangetsu', 'core', '満月', 'Full Moon', { char: 'luna' }), W('shakunetsu', 'core', '灼熱', 'Scorching', { char: 'karen' }),
    W('nekojarashi', 'core', '猫じゃらし', 'Cat Teaser', { char: 'myao' }), W('shinryoku', 'core', '新緑', 'Fresh Green', { char: 'nono' }),
    W('ojousama', 'core', 'お嬢様', 'Heiress', { char: 'reika' }), W('hyouketsu', 'core', '氷結', 'Frozen', { char: 'airi' }),
    W('yami', 'core', '漆黒', 'Jet-Black', { char: 'mahiru' }), W('taiyou', 'core', '太陽', 'Sunshine', { char: 'natsu' }),
    W('ryuusei', 'core', '流れ星', 'Shooting Star', { char: 'mira' }), W('seitokai', 'core', '生徒会', 'Council', { char: 'yukari' }),
    // ---- 締め（1翻） ----
    W('sanrenda', 'suf', '三連打', 'Triple Strike'), W('daisharin', 'suf', '大車輪', 'Grand Wheel'), W('ranbu', 'suf', '乱舞', 'Frenzy'),
    W('gaeshi', 'suf', '返し', 'Reversal'), W('musou', 'suf', '無双', 'Unrivaled'), W('bakudan', 'suf', '爆弾', 'Bomb'),
    W('matsuri', 'suf', '祭り', 'Festival'), W('ipponzuri', 'suf', '一本釣り', 'Catch'), W('kourin', 'suf', '降臨', 'Descent'),
    W('ressha', 'suf', '特急', 'Express'), W('sakusen', 'suf', '大作戦', 'Operation'), W('kakumei', 'suf', '革命', 'Revolution'),
  ];
  const byId = {};
  for (const w of WORDS) byId[w.id] = w;
  const Words = { WORDS, byId, MAX_HAND: 6, MAX_PICK: 4 };
  if (typeof module !== 'undefined' && module.exports) module.exports = Words;
  else root.Words = Words;
})(typeof window !== 'undefined' ? window : globalThis);
