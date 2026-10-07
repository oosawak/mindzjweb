/* =========================================================
 *  無法地帯の追加セリフ（js/data/lines.js に合体させる）
 *  sig   : 固有技を使うとき
 *  fake  : でっち上げ役を申告するとき
 *  chaos : 卓が荒れるイベントへのリアクション
 *  日本語は [表示, 読み上げ用|null, 正しい読み(ひらがな)]
 * ========================================================= */
(function (root) {
  'use strict';
  const Lines = root.Lines || require('./lines.js');
  const ADD = {
    hiyori: {
      en: { sig: "Oops, I dropped everything! ...Oh, but this one's mine now!", fake: "I just made this yaku up! It totally counts!", chaos: "Whaaat?! What's happening?!" },
      ja: { sig: ['わわっ、ばらまいちゃった！…でもこれ、もらいっ！', null, 'わわっばらまいちゃったでもこれもらいっ'], fake: ['今考えた役だけど、ちゃんと役だよね！', null, 'いまかんがえたやくだけどちゃんとやくだよね'], chaos: ['えええっ！？なになに！？', null, 'えええっなになに'] },
    },
    shizuku: {
      en: { sig: "Recalculating. Your best tiles are now gone.", fake: "A new yaku, logically derived. Any objections?", chaos: "...This is beyond any calculation." },
      ja: { sig: ['再計算完了。あなたたちの急所は、もうないわ', '再計算完了。あなたたちのきゅうしょは、もうないわ', 'さいけいさんかんりょうあなたたちのきゅうしょはもうないわ'], fake: ['論理的に導いた新しい役よ。異論は？', null, 'ろんりてきにみちびいたあたらしいやくよいろんは'], chaos: ['…計算の範囲外ね', null, 'けいさんのはんいがいね'] },
    },
    luna: {
      en: { sig: "Moonlight Stage! Everything I touch turns to dora!", fake: "This yaku was born tonight, just for Luna!", chaos: "Wow! What a dramatic stage!" },
      ja: { sig: ['ムーンライトステージ！月の光で、ぜんぶドラよ☆', 'ムーンライトステージ！月の光で、ぜんぶドラよ', 'むーんらいとすてーじつきのひかりでぜんぶどらよ'], fake: ['今夜生まれたルナだけの役よ☆', '今夜生まれたルナだけの役よ', 'こんやうまれたるなだけのやくよ'], chaos: ['すごーい！ドラマチックなステージね！', null, 'すごーいどらまちっくなすてーじね'] },
    },
    karen: {
      en: { sig: "Out of my way! I'm swapping my whole hand!", fake: "If I say it's a yaku, it's a yaku!", chaos: "Bring it on! The wilder the better!" },
      ja: { sig: ['どけどけっ！手牌まるごと入れ替えだ！', null, 'どけどけっていはいまるごといれかえだ'], fake: ['あたしが役だって言ったら役なんだよ！', null, 'あたしがやくだっていったらやくなんだよ'], chaos: ['上等だ！荒れるほど燃えるぜ！', null, 'じょうとうだあれるほどもえるぜ'] },
    },
    myao: {
      en: { sig: "Cat paw! This tile is mine, nya!", fake: "A brand-new yaku, nya! It's super strong!", chaos: "Nyaaa?! The table's going crazy!" },
      ja: { sig: ['猫の手にゃ！この牌、もらっていくにゃ！', null, 'ねこのてにゃこのはいもらっていくにゃ'], fake: ['新しい役にゃ！すっごく強いにゃ！', null, 'あたらしいやくにゃすっごくつよいにゃ'], chaos: ['にゃにゃっ！？卓が大変にゃ！', null, 'にゃにゃったくがたいへんにゃ'] },
    },
    nono: {
      en: { sig: "Little vines, bring me that tile, please.", fake: "Um... I think this yaku just grew.", chaos: "Eek... the table is so lively today..." },
      ja: { sig: ['つるさん、あの牌を連れてきて…', null, 'つるさんあのはいをつれてきて'], fake: ['えっと…この役、いま芽が出ました', null, 'えっとこのやくいまめがでました'], chaos: ['ひゃっ…今日の卓、元気すぎます…', null, 'ひゃっきょうのたくげんきすぎます'] },
    },
    reika: {
      en: { sig: "Money solves everything. I'll buy the dora, all of it!", fake: "This yaku is a Kongouin family secret. Ohohoho!", chaos: "How vulgar! ...But rather amusing." },
      ja: { sig: ['お金で解決ですわ！ドラ、ぜんぶ買い占めますわ！', null, 'おかねでかいけつですわどらぜんぶかいしめますわ'], fake: ['金剛院家に伝わる秘伝の役ですわ！おーっほっほ！', null, 'こんごういんけにつたわるひでんのやくですわおーっほっほ'], chaos: ['なんて品のない…でも、面白いですわね', null, 'なんてひんのないでもおもしろいですわね'] },
    },
    airi: {
      en: { sig: "Absolute zero. ...Don't move.", fake: "...A new yaku. I named it myself.", chaos: "...The table melted. Interesting." },
      ja: { sig: ['絶対零度。…動かないで', null, 'ぜったいれいどうごかないで'], fake: ['…新しい役。わたしが名付けた', null, 'あたらしいやくわたしがなづけた'], chaos: ['…卓が騒がしい。悪くない', null, 'たくがさわがしいわるくない'] },
    },
    mahiru: {
      en: { sig: "Nightfall... Your power belongs to me now.", fake: "A forbidden yaku from the depths of darkness...", chaos: "Heh... chaos suits the night." },
      ja: { sig: ['夜の帳よ…あなたたちの力、いただくわ', null, 'よるのとばりよあなたたちのちからいただくわ'], fake: ['闇の底から呼び起こした、禁断の役…', null, 'やみのそこからよびおこしたきんだんのやく'], chaos: ['ふふ…混沌は夜によく似合う', null, 'ふふこんとんはよるによくにあう'] },
    },
    natsu: {
      en: { sig: "Speed draw! Too fast for you to see!", fake: "A sprinter's yaku! First place, here I come!", chaos: "Whoa! This is like an obstacle race!" },
      ja: { sig: ['高速ツモ！目にも止まらぬ速さだよ！', null, 'こうそくつもめにもとまらぬはやさだよ'], fake: ['短距離走者の役だよ！一着いただき！', null, 'たんきょりそうしゃのやくだよいっちゃくいただき'], chaos: ['うわっ！障害物競走みたい！', null, 'うわっしょうがいぶつきょうそうみたい'] },
    },
    mira: {
      en: { sig: "I wished on a shooting star! My next draws are miracles!", fake: "A miracle yaku, straight from the stars!", chaos: "Wow! It's a miracle stage!" },
      ja: { sig: ['流れ星にお願いしたよ！次のツモは奇跡だよ☆', '流れ星にお願いしたよ！次のツモは奇跡だよ', 'ながれぼしにおねがいしたよつぎのつもはきせきだよ'], fake: ['星から届いた奇跡の役だよ☆', '星から届いた奇跡の役だよ', 'ほしからとどいたきせきのやくだよ'], chaos: ['わぁ！ミラクルなステージだね！', null, 'わあみらくるなすてーじだね'] },
    },
    yukari: {
      en: { sig: "By the authority of the student council, a new rule!", fake: "The council has officially approved this yaku.", chaos: "My my, the table is getting lively." },
      ja: { sig: ['生徒会権限により、新しいルールを定めます♪', '生徒会権限により、新しいルールを定めます', 'せいとかいけんげんによりあたらしいるーるをさだめます'], fake: ['この役、生徒会で正式に承認しました', null, 'このやくせいとかいでせいしきにしょうにんしました'], chaos: ['あらあら、卓がにぎやかね', null, 'あらあらたくがにぎやかね'] },
    },
  };
  /** 審判（アナウンサー）の追加 */
  const ANN = {
    lawless: { ja: ['この卓は無法地帯！なんでもありです！', null, 'このたくはむほうちたいなんでもありです'], en: 'This table is lawless! Anything goes!' },
    ev_rotate: { ja: ['卓が大回転！', 'たくがだいかいてん！', 'たくがだいかいてん'], en: 'Table spin!' },
    ev_gravity: { ja: ['重力反転！', 'じゅうりょくはんてん！', 'じゅうりょくはんてん'], en: 'Zero gravity!' },
    ev_meteor: { ja: ['隕石ドラ！', 'いんせきドラ！', 'いんせきどら'], en: 'Meteor dora!' },
    ev_migrate: { ja: ['牌の大移動！', 'はいのだいいどう！', 'はいのだいいどう'], en: 'Tile stampede!' },
    ev_roulette: { ja: ['謎ルールルーレット！', 'なぞルール、ルーレット！', 'なぞるーるるーれっと'], en: 'Rule roulette!' },
    ev_melt: { ja: ['熱波で牌が溶ける！', 'ねっぱで、はいがとける！', 'ねっぱではいがとける'], en: 'Heat wave! The tiles are melting!' },
    ev_rewind: { ja: ['時間が巻き戻る！', 'じかんがまきもどる！', 'じかんがまきもどる'], en: 'Time rewind!' },
    ev_words: { ja: ['言葉カードの雨！', 'ことばカードのあめ！', 'ことばかーどのあめ'], en: 'Word shower!' },
    fake_ok: { ja: ['ただいまの役、認定！', 'ただいまのやく、にんてい！', 'ただいまのやくにんてい'], en: 'That yaku is officially approved!' },
    sig: { ja: ['出た！固有技！', '出た！こゆうわざ！', 'でたこゆうわざ'], en: 'Here comes a signature move!' },
    frozen: { ja: ['凍結！手番はおあずけ！', 'とうけつ！てばんはおあずけ！', 'とうけつてばんはおあずけ'], en: 'Frozen! Turn skipped!' },
  };
  for (const [id, x] of Object.entries(ADD)) {
    const L = Lines.LINES[id]; if (!L) continue;
    Object.assign(L.en, x.en); Object.assign(L.ja, x.ja);
  }
  Object.assign(Lines.ANNOUNCER, ANN);
  for (const k of ['sig', 'fake', 'chaos']) if (!Lines.CHEAT_KEYS.includes(k)) Lines.CHEAT_KEYS.push(k);
  if (typeof module !== 'undefined' && module.exports) module.exports = Lines;
})(typeof window !== 'undefined' ? window : globalThis);
