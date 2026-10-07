/* =========================================================
 *  無法地帯のデータ: キャラ固有技 / 卓が荒れるイベント / 今局だけの謎ルール
 *  数値・効果は js/engine/riot.js、演出は js/render/cheat3d.js
 * ========================================================= */
(function (root) {
  'use strict';
  /** キャラ固有技（コスト SIG_COST） */
  const SIGS = {
    karen:   { kanji: '豪', color: '#ff3b3b', ja: { name: '豪快チェンジ', desc: '卓を叩いて手牌を大入れ替え。山の手前12枚から欲しい牌を2枚まで奪う。' }, en: { name: 'Wild Reshuffle', desc: 'Slam the table and grab up to 2 useful tiles from the next 12 in the wall.' } },
    reika:   { kanji: '金', color: '#f5b400', ja: { name: '札束ドラ買い', desc: '2,000点を卓にばらまいて、自分の手に合うドラ表示牌を2枚めくる。' }, en: { name: 'Dora Buyout', desc: 'Throw 2,000 points on the table and flip 2 dora indicators that suit your hand.' } },
    mira:    { kanji: '奇', color: '#ff5fd2', ja: { name: '奇跡の流れ星', desc: '次の2回のツモが、必ず手を進める牌になる。' }, en: { name: 'Wishing Star', desc: 'Your next 2 draws are guaranteed to improve your hand.' } },
    shizuku: { kanji: '算', color: '#3a7bff', ja: { name: '完全計算', desc: '相手全員の一番大事な牌を、山の牌とすり替える。' }, en: { name: 'Perfect Calculation', desc: "Swap every opponent's most important tile with one from the wall." } },
    hiyori:  { kanji: '拾', color: '#ff5fa2', ja: { name: 'ドジっ子拾い', desc: '牌をばらまいて、全員の河から一番欲しい牌を拾う。' }, en: { name: 'Clumsy Pickup', desc: "Scatter the tiles and pick the best one from everyone's discards." } },
    myao:    { kanji: '猫', color: '#ff9f2e', ja: { name: '猫の手', desc: '相手の手牌から一番欲しい牌を1枚盗む（代わりにいらない牌を押しつける）。' }, en: { name: 'Cat Paw', desc: "Steal the tile you want most from an opponent's hand (and leave junk behind)." } },
    mahiru:  { kanji: '闇', color: '#c2185b', ja: { name: '夜の帳', desc: '闇で包んで、相手全員の技ゲージを2ずつ吸い取る。' }, en: { name: 'Nightfall', desc: "Shroud the table and drain 2 gauge from every opponent." } },
    luna:    { kanji: '月', color: '#8b5cff', ja: { name: 'ムーンライトステージ', desc: '月光を浴びた牌（自分の手に一番多い牌）が、この局の間ずっとドラになる。' }, en: { name: 'Moonlight Stage', desc: 'Your most common tile becomes dora for the rest of the hand.' } },
    nono:    { kanji: '蔓', color: '#2fbf71', ja: { name: '蔓たぐり', desc: '蔓を伸ばして、山のどこからでも一番欲しい牌を引き寄せる。' }, en: { name: 'Vine Pull', desc: 'Stretch vines and pull the best tile from anywhere in the wall.' } },
    natsu:   { kanji: '速', color: '#ff8a00', ja: { name: '高速ツモ', desc: '目にも止まらぬ速さで山の次の6枚を見て、良い牌を2枚まで取る。' }, en: { name: 'Speed Draw', desc: 'Check the next 6 wall tiles in a flash and take up to 2 good ones.' } },
    airi:    { kanji: '凍', color: '#5ac8fa', ja: { name: '絶対零度', desc: '相手全員を凍らせる。次の手番は強制ツモ切り、鳴きもできない。' }, en: { name: 'Absolute Zero', desc: 'Freeze every opponent: their next turn is a forced draw-and-discard, and they cannot call.' } },
    yukari:  { kanji: '権', color: '#a26bff', ja: { name: '生徒会権限', desc: '「今局だけの謎ルール」ルーレットを回す。' }, en: { name: 'Council Authority', desc: 'Spin the "rule of this hand" roulette.' } },
  };
  /** 卓が荒れるイベント */
  const EVENTS = [
    { id: 'rotate', kanji: '回', color: '#ff5fa2', ja: { name: '卓が大回転！', desc: '全員の手牌が、となりの席へ移動！' }, en: { name: 'Table Spin!', desc: "Everyone's hand slides to the next seat!" } },
    { id: 'gravity', kanji: '浮', color: '#7dd3ff', ja: { name: '重力反転！', desc: '牌が宙に浮く！ しばらく全員の手牌が丸見え。' }, en: { name: 'Zero Gravity!', desc: 'Tiles float up! Every hand is visible for a while.' } },
    { id: 'meteor', kanji: '隕', color: '#ff7a3d', ja: { name: '隕石ドラ！', desc: '隕石が落ちた牌の種類が、全部ドラになる！' }, en: { name: 'Meteor Dora!', desc: 'The tile type hit by the meteor becomes dora!' } },
    { id: 'migrate', kanji: '走', color: '#ffd23f', ja: { name: '牌の大移動！', desc: '牌に足が生えて、手牌から1枚ずつとなりへ逃げ出す！' }, en: { name: 'Tile Stampede!', desc: 'Tiles grow legs and one from each hand runs to the next player!' } },
    { id: 'roulette', kanji: '律', color: '#c08bff', ja: { name: '謎ルールルーレット！', desc: '今局だけの謎ルールが決まる！' }, en: { name: 'Rule Roulette!', desc: 'A strange rule for this hand only!' } },
    { id: 'melt', kanji: '溶', color: '#ff9f2e', ja: { name: '熱波で牌が溶ける！', desc: '全員の一番いらない牌が溶けて、一番欲しい牌に生まれ変わる！' }, en: { name: 'Heat Wave!', desc: "Everyone's worst tile melts and reforms as the tile they need most!" } },
    { id: 'rewind', kanji: '戻', color: '#5ad1ff', ja: { name: '時間が巻き戻る！', desc: '全員の直前の打牌が手に戻り、直前のツモは山へ帰る！' }, en: { name: 'Time Rewind!', desc: "Everyone's last discard returns to their hand, and their last draw goes back to the wall!" } },
    { id: 'words', kanji: '言', color: '#7dffb0', ja: { name: '言葉カードの雨！', desc: 'でっち上げ役に使える言葉カードが、全員に2枚ずつ降ってくる！' }, en: { name: 'Word Shower!', desc: 'Everyone gets 2 word cards for making up yaku!' } },
  ];
  /** 今局だけの謎ルール */
  const RULES = [
    { id: 'seven', short: { ja: '七ドラ', en: '7s dora' }, ja: '七はぜんぶドラ', en: 'All 7s are dora' },
    { id: 'honor', short: { ja: '字牌ドラ', en: 'Honor dora' }, ja: '字牌はぜんぶドラ', en: 'All honor tiles are dora' },
    { id: 'term', short: { ja: '一九ドラ', en: '1-9 dora' }, ja: '一と九はぜんぶドラ', en: 'All 1s and 9s are dora' },
    { id: 'double', short: { ja: '点数×2', en: 'Points x2' }, ja: '和了点が2倍', en: 'Winning points doubled' },
    { id: 'fake', short: { ja: 'でっち×2', en: 'Fake x2' }, ja: 'でっち上げ役の翻数が2倍', en: 'Made-up yaku han doubled' },
    { id: 'gauge', short: { ja: 'ゲージMAX', en: 'Full gauge' }, ja: '全員の技ゲージが満タン', en: "Everyone's gauge is full" },
  ];
  const evById = {}; for (const e of EVENTS) evById[e.id] = e;
  const ruleById = {}; for (const r of RULES) ruleById[r.id] = r;
  const Chaos = { SIGS, EVENTS, RULES, evById, ruleById };
  if (typeof module !== 'undefined' && module.exports) module.exports = Chaos;
  else root.Chaos = Chaos;
})(typeof window !== 'undefined' ? window : globalThis);
