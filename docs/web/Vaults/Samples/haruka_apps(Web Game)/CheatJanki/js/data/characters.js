/* =========================================================
 *  キャラクター定義 & アニメ調SVG立ち絵ジェネレーター
 *  assets/chars/<id>.png (または <id>_<variant>.png) があれば差し替え
 * ========================================================= */
(function (root) {
  'use strict';

  const SKILLS = {
    speed: { name: 'スピードスター', desc: '有効牌を引きやすくなる' },
    defense: { name: '鉄壁ガード', desc: '誰かがリーチすると手牌の危険度を表示' },
    ippatsu: { name: '一発の魔法', desc: 'リーチ直後の一発ツモ率アップ' },
    dora: { name: 'ドラゴンハート', desc: 'ドラを引きやすくなる' },
    haipai: { name: '幸運の配牌', desc: '配牌が良くなる' },
    yakuman: { name: '役満の申し子', desc: '通常モードでも役満の手が入ることがある' },
  };

  const CHARS = [
    {
      id: 'hiyori', name: '桜井ひより', kana: 'さくらい ひより', title: '元気いっぱい新人アイドル雀士', age: 16,
      hair: '#ff9cc4', eye: '#ff3f86', hairStyle: 'twintail', acc: ['ribbon', 'ahoge'], accColor: '#ff2f72',
      outfits: ['sailor', 'idol', 'yukata'], color: '#ff5fa2', color2: '#ffd1e6', skill: 'speed', ai: 'speed', mouth: 'open',
      voice: { pitch: 1.75, rate: 1.15 }, bio: 'ポジティブ全開の新人。鳴いて鳴いてとにかく速攻！決め台詞は「いっくよー！」',
      lines: { riichi: 'リーチだよっ！', tsumo: 'ツモっ！やったぁ！', ron: 'ロン！えへへ♪', pon: 'ポン！', chi: 'チー！', kan: 'カン！', nuki: 'ペーっ！', yakuman: 'や、役満だよぉ〜！！', win: 'ひよりの勝ちっ！', lose: 'うぅ…次は負けないもん！', start: 'いっくよー！よろしくね！' },
    },
    {
      id: 'shizuku', name: '月城しずく', kana: 'つきしろ しずく', title: '冷静沈着な文芸部部長', age: 17,
      hair: '#2c3f7a', eye: '#3aa0ff', hairStyle: 'long', acc: ['glasses', 'hairpin'], accColor: '#9ad0ff',
      outfits: ['blazer', 'idol', 'miko'], color: '#3a7bff', color2: '#cfe2ff', skill: 'defense', ai: 'defense', mouth: 'smile',
      voice: { pitch: 1.2, rate: 1.0 }, bio: '確率と読みで振り込まない守備の達人。眼鏡の奥で全てを見通す。',
      lines: { riichi: 'リーチ、します。', tsumo: 'ツモ。計算通りね。', ron: 'ロン。その牌、待っていたわ。', pon: 'ポン。', chi: 'チー。', kan: 'カン。', nuki: 'ペー、抜きます。', yakuman: 'まさか…役満、ですって…？', win: '当然の結果よ。', lose: '…読み違えたわね。', start: 'よろしくお願いします。' },
    },
    {
      id: 'luna', name: '天音ルナ', kana: 'あまね るな', title: '月夜のトップアイドル', age: 18,
      hair: '#d9d4ff', eye: '#8b5cff', hairStyle: 'wavy', acc: ['tiara'], accColor: '#ffd86b',
      outfits: ['idol', 'dress', 'gothic'], color: '#8b5cff', color2: '#e6dcff', skill: 'ippatsu', ai: 'attack', mouth: 'smile',
      voice: { pitch: 1.5, rate: 1.05 }, bio: 'ステージでも卓でも主役。リーチ一発ツモは彼女の十八番。',
      lines: { riichi: 'リーチ☆月の魔法、かけてあげる', tsumo: 'ツモ♪ ルナの勝ちね', ron: 'ロン！キラっ☆', pon: 'ポン♪', chi: 'チー♪', kan: 'カン☆', nuki: 'ペー☆', yakuman: '役満…！今夜の主役はルナよ！', win: 'アンコールはまた今度ね♪', lose: 'ファンのみんな、ごめんね…', start: '今夜もルナのステージへようこそ☆' },
    },
    {
      id: 'karen', name: '紅羽かれん', kana: 'くれは かれん', title: '燃える紅蓮の勝負師', age: 17,
      hair: '#e0283a', eye: '#ffb300', hairStyle: 'side', acc: ['hairpin'], accColor: '#ffd23f',
      outfits: ['blazer', 'idol', 'yukata'], color: '#ff3b3b', color2: '#ffd6d6', skill: 'dora', ai: 'attack', mouth: 'smirk',
      voice: { pitch: 1.35, rate: 1.1 }, bio: 'ドラを抱えて全ツッパ！負けず嫌いの熱血ギャンブラー。',
      lines: { riichi: 'リーチ！逃げんじゃないわよ！', tsumo: 'ツモ！燃えてきた！', ron: 'ロン！もらったわ！', pon: 'ポンッ！', chi: 'チー！', kan: 'カンッ！', nuki: 'ペーッ！', yakuman: '役満だぁぁぁっ！！燃え尽きなさい！', win: 'あたしが最強よ！', lose: 'くっ…覚えてなさい！', start: '全力でかかってきなさい！' },
    },
    {
      id: 'myao', name: '猫宮みゃお', kana: 'ねこみや みゃお', title: '気まぐれ猫耳ゲーマー', age: 15,
      hair: '#ffa94d', eye: '#3ecf6e', hairStyle: 'bob', acc: ['catEars', 'headphones'], accColor: '#ff6fae',
      outfits: ['hoodie', 'idol', 'maid'], color: '#ff9f2e', color2: '#ffe8cc', skill: 'haipai', ai: 'balance', mouth: 'cat',
      voice: { pitch: 1.9, rate: 1.2 }, bio: '配牌がいつも良い謎の強運ネコ。語尾に「にゃ」がつく。',
      lines: { riichi: 'リーチにゃ！', tsumo: 'ツモだにゃ〜ん♪', ron: 'ロンにゃっ！', pon: 'ポンにゃ！', chi: 'チーにゃ', kan: 'カンにゃ！', nuki: 'ペーにゃ！', yakuman: 'にゃにゃにゃ！？役満にゃーー！！', win: 'みゃおの勝ちにゃ♪', lose: 'にゃう…ねむいにゃ…', start: 'よろしくにゃ〜' },
    },
    {
      id: 'nono', name: '翠川のの', kana: 'みどりかわ のの', title: '恥ずかしがり屋の図書委員', age: 15,
      hair: '#4fbf7a', eye: '#1f9d6a', hairStyle: 'braid', acc: ['flower'], accColor: '#ffe066',
      outfits: ['sailor', 'idol', 'miko'], color: '#2fbf71', color2: '#d3f5e2', skill: 'haipai', ai: 'defense', mouth: 'small',
      voice: { pitch: 1.6, rate: 0.95 }, bio: '緑一色に憧れる内気な少女。実は牌効率がすごい。',
      lines: { riichi: 'り、リーチです…！', tsumo: 'ツモ…しちゃいました', ron: 'あ、あの…ロンです…', pon: 'ポ、ポン…', chi: 'チー…', kan: 'カン…です', nuki: 'ぺ、ペー…', yakuman: 'え、えぇっ！？役満…！？', win: 'か、勝っちゃいました…！', lose: 'ごめんなさい…', start: 'よ、よろしくお願いします…' },
    },
    {
      id: 'reika', name: '金剛院レイカ', kana: 'こんごういん れいか', title: '高打点至上主義のお嬢様', age: 18,
      hair: '#ffd24d', eye: '#2f7dff', hairStyle: 'drill', acc: ['headband'], accColor: '#c2185b',
      outfits: ['dress', 'idol', 'gothic'], color: '#f5b400', color2: '#fff1c2', skill: 'dora', ai: 'value', mouth: 'smirk',
      voice: { pitch: 1.3, rate: 0.95 }, bio: '安い手なんてお断り。倍満以上しか和了らない（つもり）のお嬢様。',
      lines: { riichi: 'リーチですわ！', tsumo: 'ツモ。おーっほっほ！', ron: 'ロン！ごめんあそばせ♪', pon: 'ポン、ですわ', chi: 'チー、ですわ', kan: 'カンですわ！', nuki: 'ペー、いただきますわ', yakuman: '役満！これこそ金剛院家の麻雀ですわ！', win: '当然の勝利ですわ♪', lose: 'わ、わたくしが…！？', start: 'ごきげんよう。楽しませてくださいまし' },
    },
    {
      id: 'airi', name: '雪代あいり', kana: 'ゆきしろ あいり', title: '氷の女王と呼ばれるクール系', age: 16,
      hair: '#cfeaff', eye: '#58c4ff', hairStyle: 'short', acc: ['hairpin'], accColor: '#7fd8ff',
      outfits: ['blazer', 'idol', 'dress'], color: '#5ac8fa', color2: '#e3f6ff', skill: 'defense', ai: 'defense', mouth: 'small',
      voice: { pitch: 1.25, rate: 0.95 }, bio: '表情はクール、でも心はぽかぽか。放銃率は驚異の一桁。',
      lines: { riichi: 'リーチ。', tsumo: 'ツモ。…ふふ', ron: 'ロン。凍えなさい', pon: 'ポン', chi: 'チー', kan: 'カン', nuki: 'ペー', yakuman: '…役満。私も、少しだけ驚いた', win: '…勝った。', lose: '…次は負けない', start: '…よろしく' },
    },
    {
      id: 'mahiru', name: '夜宵まひる', kana: 'よるよい まひる', title: '闇に魅入られしゴスロリ少女', age: 16,
      hair: '#2a1f33', eye: '#ff2d55', hairStyle: 'long', acc: ['batClip', 'ahoge'], accColor: '#ff2d55',
      outfits: ['gothic', 'idol', 'maid'], color: '#c2185b', color2: '#f3c6d8', skill: 'ippatsu', ai: 'attack', mouth: 'smirk',
      voice: { pitch: 1.45, rate: 1.0 }, bio: '自称・深淵の雀士。リーチの宣言がやたら仰々しい。',
      lines: { riichi: '闇の契約…リーチ！', tsumo: 'ツモ…運命は我が手に', ron: 'ロン！深淵に堕ちるがいい！', pon: 'ポン…', chi: 'チー…', kan: '闇のカン！', nuki: 'ペー…封印', yakuman: 'ふははは！これぞ禁断の役満！', win: '闇の勝利だ…！', lose: 'く…光が眩しい…', start: '我と卓を囲む勇気、褒めてやろう' },
    },
    {
      id: 'natsu', name: '陽向なつ', kana: 'ひなた なつ', title: '太陽みたいな陸上部エース', age: 16,
      hair: '#a0602e', eye: '#ff8a00', hairStyle: 'ponytail', acc: ['headband'], accColor: '#ff6b00',
      outfits: ['hoodie', 'idol', 'yukata'], color: '#ff8a00', color2: '#ffe3c2', skill: 'speed', ai: 'speed', mouth: 'open',
      voice: { pitch: 1.55, rate: 1.2 }, bio: '1巡でも速く！スピード命の体育会系。',
      lines: { riichi: 'リーチ！全力疾走！', tsumo: 'ツモ！ゴールイン！', ron: 'ロン！追い抜いたよ！', pon: 'ポン！', chi: 'チー！', kan: 'カン！', nuki: 'ペー！', yakuman: 'やっくまーん！！新記録だー！', win: '一着ゴール！', lose: '次は負けないぞー！', start: 'よーい、ドン！' },
    },
    {
      id: 'mira', name: '星乃ミラ', kana: 'ほしの みら', title: '奇跡を呼ぶ星の歌姫', age: 17, legend: true,
      hair: 'rainbow', eye: '#ff5fd2', hairStyle: 'twintail', acc: ['tiara', 'starClip'], accColor: '#ffe45c', starEyes: true,
      outfits: ['idol', 'dress', 'yukata'], color: '#ff5fd2', color2: '#fff0fb', skill: 'yakuman', ai: 'balance', mouth: 'open',
      voice: { pitch: 1.8, rate: 1.05 }, bio: '彼女が卓につくと役満が生まれると噂される伝説の歌姫。',
      lines: { riichi: 'リーチ☆願いを込めて！', tsumo: 'ツモ！星に願いが届いた！', ron: 'ロン☆キラキラ〜！', pon: 'ポン☆', chi: 'チー☆', kan: 'カン☆', nuki: 'ペー☆', yakuman: '役満☆これが奇跡の輝きだよ！！', win: 'みんな、ありがとう☆', lose: '流れ星、見逃しちゃった…', start: '奇跡のステージ、はじめよう☆' },
    },
    {
      id: 'yukari', name: '藤咲ゆかり', kana: 'ふじさき ゆかり', title: 'ほんわか生徒会長お姉さん', age: 18,
      hair: '#b48cff', eye: '#9b59d0', hairStyle: 'wavy', acc: ['flower'], accColor: '#ff8fc7',
      outfits: ['dress', 'idol', 'miko'], color: '#a26bff', color2: '#efe3ff', skill: 'haipai', ai: 'value', mouth: 'smile',
      voice: { pitch: 1.3, rate: 0.9 }, bio: 'おっとり笑顔で高い手を仕上げるお姉さん。怒らせてはいけない。',
      lines: { riichi: 'あらあら、リーチね', tsumo: 'ツモ♪ うふふ', ron: 'ロン♪ ごめんなさいね', pon: 'ポン♪', chi: 'チー♪', kan: 'カンよ', nuki: 'ペーね', yakuman: 'まぁ…役満ですって♪ うふふふ', win: 'みんなよく頑張ったわね♪', lose: 'あらあら、負けちゃった', start: 'みんなで仲良く打ちましょうね♪' },
    },
  ];

  const OUTFIT_NAMES = { sailor: 'セーラー服', blazer: 'ブレザー', idol: 'ステージ衣装', hoodie: 'パーカー', gothic: 'ゴシックドレス', dress: 'ドレス', miko: '巫女装束', yukata: '浴衣', maid: 'メイド服' };

  /* ---------------- 色ユーティリティ ---------------- */
  function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgbToHex(r, g, b) { return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  function shade(hex, amt) { // amt -1..1
    const [r, g, b] = hexToRgb(hex);
    if (amt >= 0) return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
    return rgbToHex(r * (1 + amt), g * (1 + amt), b * (1 + amt));
  }
  function mix(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }

  let uidCounter = 0;

  /* ---------------- SVG 立ち絵 ---------------- */
  function portrait(ch, opt) {
    opt = opt || {};
    const expr = opt.expr || 'normal';
    const outfit = opt.outfit || ch.outfits[0];
    const U = 'c' + (++uidCounter) + '_';
    const skin = '#ffe9dc', skinS = '#f7c9b5', skinL = '#fff6ef';
    const rainbow = ch.hair === 'rainbow';
    const hairBase = rainbow ? '#ffb3e6' : ch.hair;
    const hairD = shade(hairBase, -0.28), hairDD = shade(hairBase, -0.5), hairL = shade(hairBase, 0.45);
    const lineCol = shade(hairBase, -0.62);
    const eye = ch.eye;
    const defs = [];
    // グラデーション
    if (rainbow) {
      defs.push(`<linearGradient id="${U}hair" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#fff0fb"/><stop offset=".22" stop-color="#ffb3e6"/><stop offset=".45" stop-color="#c7b3ff"/><stop offset=".65" stop-color="#9fe3ff"/><stop offset=".85" stop-color="#b8ffd9"/><stop offset="1" stop-color="#fff6a8"/></linearGradient>`);
    } else {
      defs.push(`<linearGradient id="${U}hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(hairBase, 0.12)}"/><stop offset=".55" stop-color="${hairBase}"/><stop offset="1" stop-color="${hairD}"/></linearGradient>`);
    }
    defs.push(`<linearGradient id="${U}hairBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${rainbow ? '#e9c2ff' : hairD}"/><stop offset="1" stop-color="${rainbow ? '#b3f0ff' : hairDD}"/></linearGradient>`);
    defs.push(`<linearGradient id="${U}iris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(eye, -0.6)}"/><stop offset=".45" stop-color="${eye}"/><stop offset="1" stop-color="${shade(eye, 0.55)}"/></linearGradient>`);
    defs.push(`<radialGradient id="${U}blush" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff6f91" stop-opacity=".55"/><stop offset="1" stop-color="#ff6f91" stop-opacity="0"/></radialGradient>`);
    defs.push(`<linearGradient id="${U}skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skinL}"/><stop offset="1" stop-color="${skin}"/></linearGradient>`);

    const parts = [];
    const hairFill = `url(#${U}hair)`;
    const hairBackFill = `url(#${U}hairBack)`;
    const stroke = `stroke="${lineCol}" stroke-width="2.2" stroke-linejoin="round"`;

    /* ---- 後ろ髪 ---- */
    const hs = ch.hairStyle;
    const back = [];
    if (hs === 'long' || hs === 'wavy' || hs === 'drill' || hs === 'twintail' || hs === 'side' || hs === 'braid' || hs === 'ponytail') {
      if (hs === 'long') back.push(`<path d="M104 150 C 84 250 92 380 76 520 L 324 520 C 308 380 316 250 296 150 Z" fill="${hairBackFill}" ${stroke}/>`);
      if (hs === 'wavy') back.push(`<path d="M104 150 C 70 230 100 290 78 350 C 60 400 96 440 74 520 L 326 520 C 304 440 340 400 322 350 C 300 290 330 230 296 150 Z" fill="${hairBackFill}" ${stroke}/>`);
      if (hs === 'drill') back.push(`<path d="M106 150 C 90 230 100 300 96 360 L 304 360 C 300 300 310 230 294 150 Z" fill="${hairBackFill}" ${stroke}/>`);
      if (hs === 'braid' || hs === 'ponytail' || hs === 'twintail' || hs === 'side') back.push(`<path d="M108 150 C 100 210 106 250 124 272 C 150 262 250 262 276 272 C 294 250 300 210 292 150 Z" fill="${hairBackFill}" ${stroke}/>`);
    } else if (hs === 'bob') {
      back.push(`<path d="M100 150 C 88 230 96 290 122 312 C 160 300 240 300 278 312 C 304 290 312 230 300 150 Z" fill="${hairBackFill}" ${stroke}/>`);
    } else if (hs === 'short') {
      back.push(`<path d="M106 150 C 98 220 108 262 126 282 L 274 282 C 292 262 302 220 294 150 Z" fill="${hairBackFill}" ${stroke}/>`);
    }
    // ツインテール
    const tails = [];
    if (hs === 'twintail') {
      tails.push(`<path d="M112 118 C 40 120 14 250 36 360 C 50 430 28 480 56 520 C 70 460 112 420 108 330 C 104 250 124 190 138 146 Z" fill="${hairFill}" ${stroke}/>`);
      tails.push(`<path d="M288 118 C 360 120 386 250 364 360 C 350 430 372 480 344 520 C 330 460 288 420 292 330 C 296 250 276 190 262 146 Z" fill="${hairFill}" ${stroke}/>`);
      tails.push(`<path d="M70 200 C 60 260 62 320 74 380" fill="none" stroke="${hairL}" stroke-width="4" stroke-linecap="round" opacity=".55"/><path d="M330 200 C 340 260 338 320 326 380" fill="none" stroke="${hairL}" stroke-width="4" stroke-linecap="round" opacity=".55"/>`);
    }
    if (hs === 'side') {
      tails.push(`<path d="M300 110 C 380 110 392 230 372 320 C 358 390 380 440 352 500 C 330 440 300 400 298 330 C 296 250 282 180 262 140 Z" fill="${hairFill}" ${stroke}/>`);
      tails.push(`<path d="M348 190 C 360 250 356 310 344 370" fill="none" stroke="${hairL}" stroke-width="4" stroke-linecap="round" opacity=".55"/>`);
    }
    if (hs === 'ponytail') {
      tails.push(`<path d="M250 70 C 330 40 380 120 360 220 C 346 290 372 340 350 400 C 320 340 300 300 306 220 C 312 160 290 120 250 110 Z" fill="${hairFill}" ${stroke}/>`);
    }
    if (hs === 'drill') {
      for (const side of [-1, 1]) {
        const x = 200 + side * 112;
        let s = '';
        for (let k = 0; k < 5; k++) {
          const y = 250 + k * 44, rx = 30 - k * 3.5, ry = 26 - k * 2;
          s += `<ellipse cx="${x + side * (k % 2 ? 4 : -4)}" cy="${y}" rx="${rx}" ry="${ry}" fill="${hairFill}" ${stroke}/>`;
          s += `<path d="M${x - rx * 0.6} ${y - 4} Q ${x} ${y + ry * 0.7} ${x + rx * 0.6} ${y - 4}" fill="none" stroke="${hairD}" stroke-width="2.5"/>`;
          s += `<path d="M${x - rx * 0.4} ${y - ry * 0.5} Q ${x} ${y - ry * 0.8} ${x + rx * 0.3} ${y - ry * 0.6}" fill="none" stroke="${hairL}" stroke-width="3" opacity=".7"/>`;
        }
        tails.push(s);
      }
    }

    /* ---- 体 ---- */
    const oc = ch.color, oc2 = ch.color2;
    const body = [];
    body.push(`<path d="M182 262 L 182 330 L 218 330 L 218 262 Z" fill="${skin}"/>`);
    body.push(`<path d="M182 280 Q 200 300 218 280 L 218 300 Q 200 312 182 300 Z" fill="${skinS}" opacity=".8"/>`);
    const shoulders = 'M 26 520 C 30 432 66 378 136 356 C 158 349 172 338 180 326 L 220 326 C 228 338 242 349 264 356 C 334 378 370 432 374 520 Z';
    function outfitSvg(o) {
      const s = [];
      if (o === 'sailor') {
        s.push(`<path d="${shoulders}" fill="#ffffff" ${stroke}/>`);
        s.push(`<path d="M 120 352 L 180 326 L 200 420 L 220 326 L 280 352 C 300 380 290 400 262 408 L 200 460 L 138 408 C 110 400 100 380 120 352 Z" fill="${shade(oc, -0.35)}" ${stroke}/>`);
        s.push(`<path d="M 132 372 L 186 344 M 268 372 L 214 344" stroke="#fff" stroke-width="3"/>`);
        s.push(`<path d="M200 430 L 168 412 L 172 450 Z M200 430 L 232 412 L 228 450 Z" fill="${ch.accColor}" ${stroke}/><circle cx="200" cy="430" r="8" fill="${shade(ch.accColor, -0.2)}"/><path d="M194 436 L 184 486 L 200 474 L 216 486 L 206 436 Z" fill="${ch.accColor}" ${stroke}/>`);
      } else if (o === 'blazer') {
        s.push(`<path d="${shoulders}" fill="${shade(oc, -0.45)}" ${stroke}/>`);
        s.push(`<path d="M 172 330 L 200 420 L 228 330 Z" fill="#fff" ${stroke}/>`);
        s.push(`<path d="M 172 330 L 150 350 L 196 460 L 200 420 Z M 228 330 L 250 350 L 204 460 L 200 420 Z" fill="${shade(oc, -0.3)}" ${stroke}/>`);
        s.push(`<path d="M195 344 L 205 344 L 210 410 L 200 425 L 190 410 Z" fill="${ch.accColor}" ${stroke}/>`);
        s.push(`<circle cx="190" cy="480" r="4" fill="#ffd66b"/><circle cx="190" cy="505" r="4" fill="#ffd66b"/>`);
        s.push(`<path d="M 250 420 l 28 -4 l 2 10 l -28 4 z" fill="#ffd66b" opacity=".85"/>`);
      } else if (o === 'idol') {
        s.push(`<path d="${shoulders}" fill="${oc}" ${stroke}/>`);
        s.push(`<path d="M 150 340 C 170 360 230 360 250 340 L 262 356 C 232 384 168 384 138 356 Z" fill="#fff" ${stroke}/>`);
        let fr = '';
        for (let k = 0; k < 7; k++) { const x = 146 + k * 18; fr += `<circle cx="${x}" cy="${372 + Math.sin(k / 6 * Math.PI) * 12}" r="9" fill="#fff" ${stroke}/>`; }
        s.push(fr);
        s.push(`<path d="M200 400 C 170 370 140 390 150 412 C 160 432 190 418 200 404 C 210 418 240 432 250 412 C 260 390 230 370 200 400 Z" fill="${oc2}" ${stroke}/><circle cx="200" cy="404" r="10" fill="${ch.accColor}" ${stroke}/>`);
        s.push(`<path d="M 60 470 Q 200 440 340 470" fill="none" stroke="#fff" stroke-width="6" opacity=".7"/>`);
        s.push(`<path d="M 90 430 l 5 12 l 12 5 l -12 5 l -5 12 l -5 -12 l -12 -5 l 12 -5 z M 305 440 l 4 9 l 9 4 l -9 4 l -4 9 l -4 -9 l -9 -4 l 9 -4 z" fill="#fff" opacity=".9"/>`);
      } else if (o === 'hoodie') {
        s.push(`<path d="${shoulders}" fill="${oc}" ${stroke}/>`);
        s.push(`<path d="M 130 344 C 150 380 250 380 270 344 C 262 332 238 326 220 326 L 180 326 C 162 326 138 332 130 344 Z" fill="${shade(oc, -0.2)}" ${stroke}/>`);
        s.push(`<path d="M186 360 L 180 440 M 214 360 L 220 440" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="180" cy="444" r="5" fill="#fff"/><circle cx="220" cy="444" r="5" fill="#fff"/>`);
        s.push(`<path d="M 150 470 L 250 470 L 256 520 L 144 520 Z" fill="${shade(oc, -0.12)}" ${stroke}/>`);
        s.push(`<text x="200" y="420" font-size="28" text-anchor="middle" fill="#fff" font-weight="900" font-family="sans-serif" opacity=".9">${ch.id === 'myao' ? 'NYA' : 'GO!'}</text>`);
      } else if (o === 'gothic') {
        s.push(`<path d="${shoulders}" fill="#1b1522" ${stroke}/>`);
        let lace = '';
        for (let k = 0; k < 9; k++) { const x = 136 + k * 16; lace += `<path d="M ${x} 350 q 8 16 16 0" fill="#fff" stroke="#fff" stroke-width="1"/>`; }
        s.push(`<path d="M 136 340 L 264 340 L 264 352 L 136 352 Z" fill="#fff"/>` + lace);
        s.push(`<path d="M200 380 L 176 364 L 178 398 Z M200 380 L 224 364 L 222 398 Z" fill="${oc}" ${stroke}/><circle cx="200" cy="381" r="7" fill="${shade(oc, -0.3)}"/>`);
        s.push(`<path d="M196 404 h8 v18 h14 v8 h-14 v30 h-8 v-30 h-14 v-8 h14 z" fill="#c9b8ff" opacity=".9"/>`);
        s.push(`<path d="M 80 440 Q 200 470 320 440" stroke="${oc}" stroke-width="4" fill="none"/>`);
      } else if (o === 'dress') {
        s.push(`<path d="${shoulders}" fill="${skin}" ${stroke}/>`);
        s.push(`<path d="M 60 520 C 70 450 110 410 140 404 C 170 424 230 424 260 404 C 290 410 330 450 340 520 Z" fill="${oc}" ${stroke}/>`);
        s.push(`<path d="M 140 404 C 170 424 230 424 260 404" fill="none" stroke="${oc2}" stroke-width="6"/>`);
        s.push(`<path d="M 170 340 Q 200 372 230 340" fill="none" stroke="#ffe08a" stroke-width="3"/><path d="M200 366 l 7 10 l -7 10 l -7 -10 z" fill="${ch.accColor}" stroke="#ffe08a" stroke-width="2"/>`);
        s.push(`<path d="M 150 360 C 130 372 120 390 118 410" fill="none" stroke="${skinS}" stroke-width="3" opacity=".6"/><path d="M 250 360 C 270 372 280 390 282 410" fill="none" stroke="${skinS}" stroke-width="3" opacity=".6"/>`);
      } else if (o === 'miko') {
        s.push(`<path d="${shoulders}" fill="#fff" ${stroke}/>`);
        s.push(`<path d="M 170 326 L 232 470 L 250 470 L 196 326 Z" fill="#ffffff" ${stroke}/><path d="M 230 326 L 168 470 L 150 470 L 204 326 Z" fill="#f4f4f4" ${stroke}/>`);
        s.push(`<path d="M 172 330 L 226 456 M 228 330 L 174 456" stroke="#e53950" stroke-width="5"/>`);
        s.push(`<path d="M 100 490 L 300 490 L 306 520 L 94 520 Z" fill="#e53950" ${stroke}/>`);
        s.push(`<path d="M 80 400 C 70 440 70 480 76 520" stroke="${skinS}" stroke-width="2" fill="none"/>`);
      } else if (o === 'yukata') {
        s.push(`<path d="${shoulders}" fill="${oc2}" ${stroke}/>`);
        let fl = '';
        const pts = [[90, 440], [140, 480], [260, 470], [310, 430], [120, 400], [290, 500], [70, 500]];
        for (const [x, y] of pts) { for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; fl += `<ellipse cx="${x + Math.cos(a) * 8}" cy="${y + Math.sin(a) * 8}" rx="7" ry="5" transform="rotate(${a * 57.3} ${x + Math.cos(a) * 8} ${y + Math.sin(a) * 8})" fill="${oc}" opacity=".75"/>`; } fl += `<circle cx="${x}" cy="${y}" r="4" fill="#ffe066"/>`; }
        s.push(fl);
        s.push(`<path d="M 172 326 L 226 450 L 242 450 L 196 326 Z" fill="${shade(oc, -0.2)}" ${stroke}/><path d="M 228 326 L 174 450 L 158 450 L 204 326 Z" fill="${shade(oc, -0.2)}" ${stroke}/>`);
        s.push(`<path d="M 70 450 L 330 450 L 334 490 L 66 490 Z" fill="${oc}" ${stroke}/><path d="M 70 470 L 330 470" stroke="${oc2}" stroke-width="4"/>`);
      } else if (o === 'maid') {
        s.push(`<path d="${shoulders}" fill="#1f1b2e" ${stroke}/>`);
        s.push(`<path d="M 140 520 L 160 360 L 240 360 L 260 520 Z" fill="#fff" ${stroke}/>`);
        let fr = '';
        for (let k = 0; k < 6; k++) fr += `<circle cx="${165 + k * 14}" cy="360" r="8" fill="#fff" ${stroke}/>`;
        s.push(fr);
        s.push(`<path d="M 150 336 L 250 336 L 244 350 L 156 350 Z" fill="#fff" ${stroke}/>`);
        s.push(`<path d="M200 344 L 182 334 L 184 356 Z M200 344 L 218 334 L 216 356 Z" fill="${oc}" ${stroke}/>`);
        s.push(`<path d="M 170 420 L 230 420" stroke="${oc}" stroke-width="3"/>`);
      }
      return s.join('');
    }
    body.push(outfitSvg(outfit));

    /* ---- 顔 ---- */
    const face = [];
    face.push(`<path d="M 132 150 C 126 216 148 262 178 286 C 192 296 208 296 222 286 C 252 262 274 216 268 150 C 268 96 132 96 132 150 Z" fill="url(#${U}skin)" ${stroke}/>`);
    // 耳
    face.push(`<path d="M 134 200 C 118 196 116 226 138 236" fill="${skin}" ${stroke}/><path d="M 266 200 C 282 196 284 226 262 236" fill="${skin}" ${stroke}/>`);
    // 頬
    const blushK = (expr === 'embarrassed' || expr === 'happy' || ch.id === 'nono') ? 1.3 : 1;
    face.push(`<ellipse cx="156" cy="246" rx="${22 * blushK}" ry="${11 * blushK}" fill="url(#${U}blush)"/><ellipse cx="244" cy="246" rx="${22 * blushK}" ry="${11 * blushK}" fill="url(#${U}blush)"/>`);
    face.push(`<path d="M148 244 l-4 6 M156 244 l-4 6 M164 244 l-4 6 M236 244 l-4 6 M244 244 l-4 6 M252 244 l-4 6" stroke="#ff6f91" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`);
    // 鼻
    face.push(`<path d="M 200 238 l -2 6 l 3 1" fill="none" stroke="${skinS}" stroke-width="2" stroke-linecap="round"/>`);

    /* ---- 目 ---- */
    function eyeSvg(cx, cy, dir, mode) {
      const s = [];
      const x = (dx) => cx + dx * dir;
      if (mode === 'closed') {
        s.push(`<path d="M ${x(-20)} ${cy + 2} Q ${cx} ${cy - 16} ${x(20)} ${cy + 2}" fill="none" stroke="${lineCol}" stroke-width="5" stroke-linecap="round"/>`);
        s.push(`<path d="M ${x(18)} ${cy} l ${7 * dir} -5" stroke="${lineCol}" stroke-width="3" stroke-linecap="round"/>`);
        return s.join('');
      }
      if (mode === 'line') {
        s.push(`<path d="M ${x(-18)} ${cy + 4} Q ${cx} ${cy + 10} ${x(18)} ${cy + 4}" fill="none" stroke="${lineCol}" stroke-width="4.5" stroke-linecap="round"/>`);
        return s.join('');
      }
      const surpr = mode === 'surprised';
      const irx = surpr ? 11 : 15, iry = surpr ? 14 : 20;
      const sclera = `M ${x(-21)} ${cy - 8} C ${x(-18)} ${cy - 26} ${x(18)} ${cy - 28} ${x(22)} ${cy - 10} C ${x(24)} ${cy + 10} ${x(14)} ${cy + 24} ${cx} ${cy + 24} C ${x(-14)} ${cy + 24} ${x(-23)} ${cy + 10} ${x(-21)} ${cy - 8} Z`;
      const clipId = U + 'eye' + (dir > 0 ? 'R' : 'L');
      defs.push(`<clipPath id="${clipId}"><path d="${sclera}"/></clipPath>`);
      s.push(`<path d="${sclera}" fill="#fff"/>`);
      s.push(`<g clip-path="url(#${clipId})">`);
      s.push(`<ellipse cx="${x(1)}" cy="${cy + 3}" rx="${irx}" ry="${iry}" fill="url(#${U}iris)"/>`);
      s.push(`<ellipse cx="${x(1)}" cy="${cy + 4}" rx="${irx * 0.48}" ry="${iry * 0.52}" fill="${shade(eye, -0.7)}" opacity=".85"/>`);
      s.push(`<path d="M ${x(-irx + 3)} ${cy + 10} Q ${x(1)} ${cy + iry + 2} ${x(irx - 2)} ${cy + 10}" fill="none" stroke="${shade(eye, 0.7)}" stroke-width="3" opacity=".8"/>`);
      if (ch.starEyes) {
        s.push(`<path d="M ${x(1)} ${cy - 5} l 3 7 l 7 1 l -5 5 l 2 7 l -7 -4 l -7 4 l 2 -7 l -5 -5 l 7 -1 z" fill="#fff" opacity=".95"/>`);
      }
      s.push(`<rect x="${cx - 26}" y="${cy - 30}" width="52" height="12" fill="${shade(eye, -0.5)}" opacity=".25"/>`);
      if (mode === 'half') s.push(`<rect x="${cx - 26}" y="${cy - 30}" width="52" height="22" fill="${skin}"/>`);
      s.push(`</g>`);
      // ハイライト
      s.push(`<ellipse cx="${x(-6)}" cy="${cy - 6}" rx="6.5" ry="8" fill="#fff" opacity=".95"/>`);
      s.push(`<circle cx="${x(7)}" cy="${cy + 11}" r="3" fill="#fff" opacity=".9"/>`);
      s.push(`<circle cx="${x(-9)}" cy="${cy + 9}" r="1.6" fill="#fff" opacity=".8"/>`);
      // まつげ
      const lidY = mode === 'half' ? cy - 6 : cy - 10;
      s.push(`<path d="M ${x(-24)} ${lidY + 6} C ${x(-20)} ${lidY - 16} ${x(16)} ${lidY - 20} ${x(26)} ${lidY - 2} L ${x(30)} ${lidY - 8} L ${x(27)} ${lidY + 4} C ${x(14)} ${lidY - 12} ${x(-16)} ${lidY - 10} ${x(-22)} ${lidY + 8} Z" fill="${lineCol}"/>`);
      s.push(`<path d="M ${x(24)} ${lidY + 2} l ${6 * dir} 2 M ${x(20)} ${lidY - 6} l ${7 * dir} -3" stroke="${lineCol}" stroke-width="2.4" stroke-linecap="round"/>`);
      s.push(`<path d="M ${x(-12)} ${cy + 24} Q ${cx} ${cy + 27} ${x(12)} ${cy + 23}" fill="none" stroke="${lineCol}" stroke-width="1.8" opacity=".7"/>`);
      if (surpr) s.push(`<path d="M ${x(-16)} ${lidY - 14} Q ${cx} ${lidY - 22} ${x(16)} ${lidY - 14}" fill="none" stroke="${lineCol}" stroke-width="1.5" opacity=".6"/>`);
      return s.join('');
    }
    let modeL = 'open', modeR = 'open';
    if (expr === 'happy' || expr === 'laugh') { modeL = modeR = 'closed'; }
    if (expr === 'wink') modeR = 'closed';
    if (expr === 'surprised') modeL = modeR = 'surprised';
    if (expr === 'smug' || expr === 'determined') modeL = modeR = 'half';
    if (expr === 'sad') modeL = modeR = 'open';
    if (expr === 'sleepy') modeL = modeR = 'line';
    face.push(`<g transform="translate(166 208) scale(1.14) translate(-166 -208)">${eyeSvg(166, 206, -1, modeL)}</g>`);
    face.push(`<g transform="translate(234 208) scale(1.14) translate(-234 -208)">${eyeSvg(234, 206, 1, modeR)}</g>`);

    // 眉
    let browTilt = 0, browY = 0;
    if (expr === 'determined' || expr === 'smug') browTilt = 7;
    if (expr === 'sad' || expr === 'embarrassed') browTilt = -7;
    if (expr === 'surprised') browY = -10;
    face.push(`<path d="M ${146} ${172 + browY - browTilt * 0.2} Q 166 ${164 + browY - browTilt * 0.5} ${184} ${170 + browY + browTilt}" fill="none" stroke="${shade(hairBase, -0.45)}" stroke-width="3.2" stroke-linecap="round"/>`);
    face.push(`<path d="M ${254} ${172 + browY - browTilt * 0.2} Q 234 ${164 + browY - browTilt * 0.5} ${216} ${170 + browY + browTilt}" fill="none" stroke="${shade(hairBase, -0.45)}" stroke-width="3.2" stroke-linecap="round"/>`);
    if (expr === 'sad') face.push(`<path d="M 150 232 q -4 10 0 14 q 5 -4 0 -14 z" fill="#8fd3ff" opacity=".85"/>`);
    if (expr === 'embarrassed') face.push(`<path d="M 270 150 q 10 -6 14 4 q -8 6 -14 -4 z" fill="#8fd3ff" opacity=".8"/>`);

    // 口
    let mouth = ch.mouth || 'smile';
    if (expr === 'happy' || expr === 'laugh' || expr === 'wink') mouth = ch.mouth === 'cat' ? 'catOpen' : 'open';
    if (expr === 'surprised') mouth = 'o';
    if (expr === 'sad') mouth = 'frown';
    if (expr === 'determined') mouth = ch.mouth === 'cat' ? 'cat' : 'grit';
    if (expr === 'smug') mouth = ch.mouth === 'cat' ? 'cat' : 'smirk';
    if (expr === 'embarrassed') mouth = 'wavy';
    const mc = '#b8334a';
    const M = {
      smile: `<path d="M 188 262 Q 200 272 212 262" fill="none" stroke="${mc}" stroke-width="3" stroke-linecap="round"/>`,
      small: `<path d="M 193 264 Q 200 268 207 264" fill="none" stroke="${mc}" stroke-width="2.6" stroke-linecap="round"/>`,
      open: `<path d="M 184 258 Q 200 286 216 258 Q 200 262 184 258 Z" fill="#9c1f3a" stroke="${mc}" stroke-width="2"/><path d="M 191 272 Q 200 280 209 272 Q 200 268 191 272 Z" fill="#ff8aa6"/>`,
      o: `<ellipse cx="200" cy="268" rx="7" ry="9" fill="#9c1f3a" stroke="${mc}" stroke-width="2"/>`,
      cat: `<path d="M 186 262 q 7 8 14 0 q 7 8 14 0" fill="none" stroke="${mc}" stroke-width="2.8" stroke-linecap="round"/>`,
      catOpen: `<path d="M 186 260 q 7 8 14 0 q 7 8 14 0 Q 200 290 186 260 Z" fill="#9c1f3a" stroke="${mc}" stroke-width="2"/><path d="M 194 274 Q 200 280 206 274" fill="#ff8aa6"/>`,
      smirk: `<path d="M 188 264 Q 202 270 214 258" fill="none" stroke="${mc}" stroke-width="3" stroke-linecap="round"/>`,
      frown: `<path d="M 190 270 Q 200 262 210 270" fill="none" stroke="${mc}" stroke-width="3" stroke-linecap="round"/>`,
      grit: `<path d="M 186 262 L 214 262 L 210 272 L 190 272 Z" fill="#fff" stroke="${mc}" stroke-width="2.4" stroke-linejoin="round"/><path d="M 186 267 L 214 267" stroke="${mc}" stroke-width="1"/>`,
      wavy: `<path d="M 186 266 q 5 -5 9 0 q 5 5 10 0 q 5 -5 9 0" fill="none" stroke="${mc}" stroke-width="2.6" stroke-linecap="round"/>`,
    };
    face.push(M[mouth] || M.smile);

    /* ---- 前髪 ---- */
    const front = [];
    // ネコミミ（前髪の後ろ）
    const accs = ch.acc || [];
    if (accs.includes('catEars')) {
      front.push(`<path d="M 116 118 L 102 36 L 170 84 Z" fill="${hairFill}" ${stroke}/><path d="M 122 104 L 114 56 L 156 86 Z" fill="#ffc2d6"/>`);
      front.push(`<path d="M 284 118 L 298 36 L 230 84 Z" fill="${hairFill}" ${stroke}/><path d="M 278 104 L 286 56 L 244 86 Z" fill="#ffc2d6"/>`);
    }
    if (accs.includes('headphones')) {
      front.push(`<path d="M 110 170 C 100 60 300 60 290 170" fill="none" stroke="#3b3b4f" stroke-width="12" stroke-linecap="round"/>`);
    }
    const tips = hs === 'short' || hs === 'bob'
      ? [[112, 212], [124, 170], [142, 196], [156, 150], [172, 192], [186, 148], [200, 186], [214, 150], [230, 194], [246, 152], [260, 196], [276, 170], [288, 212]]
      : [[110, 226], [124, 172], [140, 200], [154, 150], [170, 196], [184, 146], [198, 190], [212, 148], [228, 198], [244, 150], [260, 202], [276, 172], [290, 226]];
    let bang = `M 104 230 C 86 110 140 58 200 56 C 260 58 314 110 296 230`;
    for (let i = tips.length - 1; i >= 1; i--) {
      const [x1, y1] = tips[i], [x0, y0] = tips[i - 1];
      bang += ` Q ${(x0 + x1) / 2 + (i % 2 ? 4 : -4)} ${Math.min(y0, y1) - 6} ${x0} ${y0}`;
    }
    bang += ' Z';
    front.push(`<path d="${bang}" fill="${hairFill}" ${stroke}/>`);
    // 前髪の影
    front.push(`<path d="M 150 150 Q 160 170 170 190 M 212 150 Q 220 170 226 194 M 184 146 Q 190 166 196 186" stroke="${hairD}" stroke-width="3" fill="none" opacity=".6"/>`);
    // 横髪
    const sideLen = hs === 'short' ? 280 : hs === 'bob' ? 300 : 330;
    front.push(`<path d="M 116 130 C 102 200 108 260 112 ${sideLen} C 124 ${sideLen - 30} 134 250 138 190 Z" fill="${hairFill}" ${stroke}/>`);
    front.push(`<path d="M 284 130 C 298 200 292 260 288 ${sideLen} C 276 ${sideLen - 30} 266 250 262 190 Z" fill="${hairFill}" ${stroke}/>`);
    // 天使の輪
    front.push(`<path d="M 132 110 Q 200 78 268 110" fill="none" stroke="${rainbow ? '#ffffff' : hairL}" stroke-width="7" stroke-linecap="round" opacity=".7"/>`);
    front.push(`<path d="M 150 104 l 8 -6 M 176 94 l 10 -3 M 226 94 l 10 3 M 250 102 l 8 6" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`);
    if (hs === 'braid') {
      let br = '';
      for (let k = 0; k < 6; k++) br += `<ellipse cx="${272 + k * 5}" cy="${320 + k * 30}" rx="${20 - k}" ry="18" fill="${hairFill}" ${stroke}/><path d="M ${258 + k * 5} ${316 + k * 30} q 14 10 28 0" fill="none" stroke="${hairD}" stroke-width="2"/>`;
      br += `<path d="M 290 494 l -10 22 l 10 -6 l 10 6 z" fill="${hairFill}" ${stroke}/><circle cx="296" cy="484" r="7" fill="${ch.accColor}" ${stroke}/>`;
      front.push(br);
    }
    // アホ毛
    if (accs.includes('ahoge')) front.push(`<path d="M 204 60 C 210 20 250 22 236 44 C 230 30 214 36 212 60 Z" fill="${hairFill}" ${stroke}/>`);

    /* ---- アクセサリー ---- */
    const ac = ch.accColor;
    const acc = [];
    if (accs.includes('ribbon')) {
      const rb = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M0 0 C -30 -34 -62 -10 -48 14 C -38 30 -12 16 0 4 Z" fill="${ac}" ${stroke}/><path d="M0 0 C 30 -34 62 -10 48 14 C 38 30 12 16 0 4 Z" fill="${ac}" ${stroke}/><path d="M -6 6 L -22 44 L -8 36 L 0 50 L 4 8 Z" fill="${shade(ac, -0.15)}" ${stroke}/><circle cx="0" cy="3" r="9" fill="${shade(ac, -0.2)}" ${stroke}/><path d="M -38 -4 Q -24 -12 -14 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/></g>`;
      if (hs === 'twintail') { acc.push(rb(114, 120, 0.8)); acc.push(rb(286, 120, 0.8)); }
      else acc.push(rb(140, 84, 1));
    }
    if (accs.includes('glasses')) {
      acc.push(`<rect x="138" y="186" width="54" height="40" rx="12" fill="#bfe3ff" fill-opacity=".18" stroke="#3a3f58" stroke-width="3"/><rect x="208" y="186" width="54" height="40" rx="12" fill="#bfe3ff" fill-opacity=".18" stroke="#3a3f58" stroke-width="3"/><path d="M 192 200 Q 200 194 208 200" fill="none" stroke="#3a3f58" stroke-width="3"/><path d="M 146 192 l 10 -4 M 216 192 l 10 -4" stroke="#fff" stroke-width="3" opacity=".7"/>`);
    }
    if (accs.includes('hairpin')) {
      acc.push(`<path d="M 238 118 L 272 104" stroke="${ac}" stroke-width="6" stroke-linecap="round"/><path d="M 244 128 L 276 114" stroke="${shade(ac, -0.2)}" stroke-width="6" stroke-linecap="round"/>`);
    }
    if (accs.includes('tiara')) {
      acc.push(`<path d="M 146 86 L 158 50 L 176 74 L 200 34 L 224 74 L 242 50 L 254 86 Q 200 70 146 86 Z" fill="${ac}" stroke="#b8860b" stroke-width="2.5" stroke-linejoin="round"/><circle cx="200" cy="66" r="7" fill="#ff5fd2" stroke="#fff" stroke-width="2"/><circle cx="160" cy="70" r="4" fill="#7ad7ff"/><circle cx="240" cy="70" r="4" fill="#7ad7ff"/>`);
    }
    if (accs.includes('starClip')) {
      acc.push(`<path d="M 262 132 l 7 14 l 16 2 l -12 11 l 3 16 l -14 -8 l -14 8 l 3 -16 l -12 -11 l 16 -2 z" fill="#ffe45c" stroke="#e0a800" stroke-width="2"/>`);
    }
    if (accs.includes('flower')) {
      let f = '';
      for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 - Math.PI / 2; f += `<ellipse cx="${258 + Math.cos(a) * 11}" cy="${112 + Math.sin(a) * 11}" rx="10" ry="8" transform="rotate(${a * 57.3 + 90} ${258 + Math.cos(a) * 11} ${112 + Math.sin(a) * 11})" fill="${ac}" stroke="${shade(ac, -0.3)}" stroke-width="1.5"/>`; }
      f += `<circle cx="258" cy="112" r="6" fill="#fff5b0" stroke="${shade(ac, -0.3)}" stroke-width="1.5"/>`;
      acc.push(f);
    }
    if (accs.includes('headband')) {
      acc.push(`<path d="M 112 126 C 130 70 270 70 288 126" fill="none" stroke="${ac}" stroke-width="10" stroke-linecap="round"/>`);
      if (ch.id === 'reika') acc.push(`<path d="M 250 86 C 240 60 270 56 272 76 C 290 60 304 84 280 94 Z" fill="${ac}" ${stroke}/>`);
    }
    if (accs.includes('batClip')) {
      acc.push(`<path d="M 244 112 q 8 -12 16 -4 q 6 -10 12 0 q 8 -8 16 4 q -8 -2 -12 6 q -4 -6 -8 0 q -4 -6 -8 0 q -4 -8 -16 -6 z" fill="#2a1f33" stroke="${ac}" stroke-width="2"/>`);
    }
    if (accs.includes('headphones')) {
      acc.push(`<rect x="94" y="170" width="30" height="50" rx="12" fill="#3b3b4f" stroke="#1c1c28" stroke-width="2"/><rect x="276" y="170" width="30" height="50" rx="12" fill="#3b3b4f" stroke="#1c1c28" stroke-width="2"/><circle cx="109" cy="195" r="8" fill="${ac}"/><circle cx="291" cy="195" r="8" fill="${ac}"/>`);
    }

    const bg = opt.bg ? `<rect width="400" height="520" fill="${opt.bg}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520"><defs>${defs.join('')}</defs>${bg}${tails.join('')}${back.join('')}${body.join('')}${face.join('')}${front.join('')}${acc.join('')}</svg>`;
  }

  const cache = new Map();
  function portraitURL(ch, opt) {
    const key = ch.id + '|' + JSON.stringify(opt || {});
    if (cache.has(key)) return cache.get(key);
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(portrait(ch, opt));
    cache.set(key, url);
    return url;
  }

  /** 外部PNG（Gemini等で生成）があれば優先 */
  const external = {};
  function probeExternal() {
    // assets/chars/manifest.js で登録された画像のみ使用（file:// でも動作）
    const list = root.CHAR_ART || {};
    return Promise.all(Object.keys(list).map(key => new Promise(resolve => {
      const img = new Image();
      img.onload = () => { external[key] = img.src; resolve(true); };
      img.onerror = () => { console.warn('キャラクター画像を読み込めません:', list[key]); resolve(false); };
      img.src = 'assets/chars/' + list[key];
    })));
  }
  function artURL(ch, opt) {
    const v = opt && opt.variant ? '_' + opt.variant : '';
    if (external[ch.id + v]) return external[ch.id + v];
    if (external[ch.id]) return external[ch.id];
    return portraitURL(ch, opt);
  }

  const byId = {};
  for (const c of CHARS) byId[c.id] = c;

  root.Chars = { CHARS, SKILLS, OUTFIT_NAMES, byId, portrait, portraitURL, artURL, probeExternal, shade, mix };
})(typeof window !== 'undefined' ? window : globalThis);
