/* =========================================================
 *  i18n — 日本語 / English
 *  t('key', {vars}) / I18N.apply(root) で [data-i18n] を一括置換
 * ========================================================= */
(function (root) {
  'use strict';
  const JA = {
    'misc.loading': '読み込み中…', 'misc.tapSound': 'タップでサウンドON', 'misc.clickSound': 'クリックでサウンドON',
    'title.sub': '無法地帯の3D麻雀', 'title.start': '▶ 対局スタート', 'title.howto': '遊び方', 'title.settings': '設定', 'title.credits': 'クレジット',
    'title.record': '対局 {games}回 ／ トップ {tops}回 ／ 最高ランク {rank}',
    'setup.title': '対局設定', 'setup.back': '← 戻る', 'setup.players': '人数', 'setup.p4': '4人麻雀', 'setup.p3': '3人麻雀（北抜き）',
    'setup.length': '東風戦（親が一周したら終局）', 'setup.you': 'あなたのキャラ', 'setup.outfit': '衣装', 'setup.opps': '対戦相手', 'setup.shuffle': 'シャッフル',
    'setup.start': '対局開始！', 'setup.eye': '観察眼', 'setup.sly': 'イカサマ癖', 'setup.sig': '固有技', 'setup.note3p': '3人麻雀: 2〜8萬なし・チーなし・北は抜きドラ。全3局。', 'setup.note4p': '4人麻雀: 東1〜東4局。赤ドラ・喰いタンあり。',
    'howto.title': '遊び方', 'ai.swap': 'すり替え！', 'sig.paid': '{name} が {n}点ばらまいた！（供託へ）', 'sig.drain': '{name} がゲージを{n}吸い取った！', 'sig.luck': '{name} の次の2ツモは奇跡の牌！', 'chaos.meteor': '隕石が落ちた！ {tile} がぜんぶドラ', 'flip.cost': 'ゲージ{n}消費',
    'set.title': '設定', 'set.master': '全体音量', 'set.bgm': 'BGM', 'set.sfx': '効果音', 'set.voice': 'ボイス', 'set.voiceOn': 'キャラボイス', 'set.voiceLang': 'ボイスの言語',
    'set.lang': '表示言語', 'set.auto': '自動', 'set.follow': '表示言語に合わせる', 'set.speed': '演出スピード', 'set.slow': 'ゆっくり', 'set.normal': 'ふつう', 'set.fast': 'はやい', 'set.faster': 'さらに速い',
    'set.assist': 'アシスト（向聴数・待ち表示）', 'set.autoskip': '鳴きを自動でスキップ（ロンは除く）', 'set.tapconfirm': 'タッチ操作: 1回目で選択・2回目で打牌', 'set.lite': '軽量モード（演出控えめ）', 'set.close': '閉じる',
    'cred.title': 'クレジット',
    'hud.round': '{wind}{n}局', 'hud.of': '全{n}局', 'hud.honba': '{n}本場', 'hud.kyotaku': '供託 {n}', 'hud.remain': '残 {n}', 'hud.dora': 'ドラ表示',
    'hud.heat': '疑惑', 'hud.flip': 'ちゃぶ台返し', 'hud.riichi': 'リーチ', 'hud.you': 'あなた', 'hud.accuse': '告発！', 'hud.accuseHint': '怪しい相手をタップで告発',
    'hud.cheatBar': '反則技', 'hud.tip': 'ここは無法地帯！ 技ゲージ●を払えば反則技（1〜6キー）は必ず成功。和了ったら役をでっち上げよう！', 'hud.yourTurn': 'あなたの番',
    'act.tsumo': 'ツモ', 'act.riichi': 'リーチ', 'act.cancel': 'やめる', 'act.kan': 'カン', 'act.nuki': '北抜き', 'act.tsumogiri': 'ツモ切り', 'act.kyuushu': '九種九牌',
    'act.ron': 'ロン', 'act.pon': 'ポン', 'act.chi': 'チー', 'act.skip': 'スキップ', 'act.back': '戻る', 'act.next': '次へ ▶',
    'hint.riichi': '光っている牌を切ってリーチ！', 'hint.call': '{tile} を{what}できます', 'hint.ron': 'ロン', 'hint.naki': '鳴き',
    'hint.tenpai': '聴牌', 'hint.wait': '待ち', 'hint.left': '残{n}枚', 'hint.shanten': '{n}向聴', 'hint.agari': '和了形！', 'hint.choosing': '（打牌選択中）', 'hint.cut': '切り →', 'hint.ukeire': '受入{n}枚',
    'cheat.pickHand': 'すり替える手牌をタップ', 'cheat.pickWall': '山から欲しい牌を選んで！', 'cheat.wallLabel': '山の次の6枚', 'cheat.pickRiver': '回収する捨て牌を選んで！',
    'cheat.pickGive': '代わりに河へ置く手牌をタップ', 'cheat.cancel': 'やめる', 'cheat.notTurn': 'あなたの番に使えます',
    'block.gauge': '技ゲージが足りない', 'block.nouse': 'いまは使えない', 'block.once': '反則技は1巡に1回まで', 'block.riichi': 'リーチ中は手牌を変える技は使えない', 'block.wall': '山が残っていない', 'block.river': '拾える捨て牌がない', 'block.dora': 'ドラ表示牌はもう限界',
    'mg.title': 'バレずに決めろ！', 'mg.tap': 'タップ / スペースで止める', 'mg.watch': '{name} が見ている…', 'mg.perfect': 'PERFECT!!', 'mg.ok': 'セーフ！', 'mg.fail': 'バレた！！', 'mg.zone': '安全ゾーン',
    'pen.caught': 'イカサマ発覚！', 'pen.pay': '罰符 {n}点', 'pen.card': '警告 {n}/3', 'pen.aiCaught': '見抜いた！', 'pen.gain': '+{n}点', 'pen.false': '濡れ衣！', 'pen.red': '退場勧告！ +{n}点',
    'flip.ask': '{name} が{what}！', 'flip.btn': 'ちゃぶ台返し!!', 'flip.pass': '見逃す', 'flip.void': 'この局は無効！', 'flip.left': '1試合1回',
    'win.tsumo': 'ツモ', 'win.ron': 'ロン', 'win.riichi': 'リーチ', 'win.tsumoWin': 'ツモ和了', 'win.ronWin': 'ロン和了', 'win.dora': 'ドラ表示牌', 'win.ura': '裏ドラ表示牌',
    'win.han': '{n}翻', 'win.fu': '{fu}符 {han}翻', 'win.all': '{n}点オール', 'win.pts': '{n}点', 'win.split': '{a} / {b}点',
    'draw.title': '流局', 'draw.none': '全員ノーテン（点数移動なし）', 'draw.all': '全員テンパイ（点数移動なし）', 'draw.pay': 'ノーテン罰符 計{n}点', 'draw.tenpai': '聴牌', 'draw.noten': '不聴',
    'call.pon': 'ポン！', 'call.chi': 'チー！', 'call.kan': 'カン！', 'call.nuki': '北！',
    'banner.start': '対局開始！', 'banner.sub': '{n}人麻雀・東風戦', 'banner.round': '東 {n} 局', 'banner.roundSub': '{honba}本場　親: {name}', 'banner.allLast': 'オーラス',
    'end.top': '🏆 トップ！', 'end.place': '{n}位', 'end.you': '（あなた）', 'end.cheatRank': '反則王ランク', 'end.stats': '反則 {ok}/{tried} 成功（PERFECT {perfect}） ／ 告発 的中 {aok}・外れ {ang} ／ ちゃぶ台返し {flips} ／ バレた {caught}',
    'end.again': 'もう一度', 'end.roll': 'スタッフロール', 'end.title': 'タイトルへ', 'end.basic': '和了 {wins}回 ／ 放銃 {dealIns}回 ／ リーチ {riichi}回',
    'rank.S': '伝説のイカサマ雀姫', 'rank.A': '凄腕イカサマ師', 'rank.B': '見習いイカサマ師', 'rank.C': '正直者（たぶん）', 'rank.X': '出入り禁止',
    'ban.title': '出入り禁止', 'ban.sub': '警告3枚で退場です…', 'ban.retry': 'この局から再挑戦', 'ban.quit': 'タイトルへ',
    'roll.skip': 'スキップ ▶▶', 'roll.thanks': 'ご来店\u200Bありがとう\u200Bございました', 'roll.again': 'イカサマは、\u200Bゲームの中だけで。',
    'set.reset': 'セーブ初期化', 'set.resetConfirm': '本当に初期化？', 'set.sound': 'サウンドファイル: {n}個', 'set.soundNone': 'サウンドファイルはまだありません（無音で遊べます）', 'set.test': '試聴 ▶',
    'cred.roll': 'スタッフロール', 'title.lang': 'English', 'setup.random': 'おまかせ', 'setup.charPick': 'キャラを選ぶ',
    'hud.howto': '遊び方', 'hud.settings': '設定', 'hud.quit': '中断', 'hud.auto': 'オート',
    'hud.gauge': '技ゲージ', 'hud.sig': '固有技', 'hud.words': '言葉カード', 'hud.rule': '謎ルール', 'hud.extraDora': '特別ドラ', 'hud.frozen': '凍結中', 'hud.cost': 'ゲージ{n}',
    'block.gauge': '技ゲージが足りない（自分の番ごとに1たまる）', 'block.nouse': '今は使えない',
    'fake.title': 'でっち上げ役を作れ！', 'fake.sub': '言葉カードを最大4枚えらんで、存在しない役を申告しよう。★は手牌と噛み合う言葉（+2翻）。頭・中身・締めがそろうと+1翻（最大6翻）。',
    'fake.declare': '申告！', 'fake.auto': 'おまかせ', 'fake.none': '言葉をえらんでね', 'fake.han': '{n}翻', 'fake.ok': '認定！', 'fake.mul': '謎ルールで2倍！',
    'fake.cat.pre': '頭', 'fake.cat.core': '中身', 'fake.cat.suf': '締め', 'fake.label': 'でっち上げ役',
    'sig.by': '{name} の固有技！', 'chaos.frozen': '凍結！手番はおあずけ', 'chaos.gravityEnd': '重力が元に戻った',
    'end.style': '反則 {cheats}回 ／ 固有技 {sigs}回 ／ でっち上げ 合計{fake}翻', 'end.best': '最高のでっち上げ役', 'end.rankNote': '派手さで決まる反則王ランク',
    'quit.confirm': 'もう一度押すと対局を中断してタイトルに戻ります', 'auto.on': 'AUTO ON', 'auto.off': 'AUTO OFF',
  };
  const EN = {
    'misc.loading': 'Loading…', 'misc.tapSound': 'Tap to turn sound on', 'misc.clickSound': 'Click to turn sound on',
    'title.sub': 'Lawless 3D Mahjong', 'title.start': '▶ Start Match', 'title.howto': 'How to Play', 'title.settings': 'Settings', 'title.credits': 'Credits',
    'title.record': 'Games {games} / Tops {tops} / Best rank {rank}',
    'setup.title': 'Match Setup', 'setup.back': '← Back', 'setup.players': 'Players', 'setup.p4': '4 players', 'setup.p3': '3 players (Kita dora)',
    'setup.length': 'East-only (ends after every player has been dealer once)', 'setup.you': 'Your character', 'setup.outfit': 'Outfit', 'setup.opps': 'Opponents', 'setup.shuffle': 'Shuffle',
    'setup.start': 'Start!', 'setup.eye': 'Sharp eyes', 'setup.sly': 'Sneakiness', 'setup.sig': 'Signature', 'setup.note3p': '3 players: no 2–8 man, no chii, North tiles become Kita dora. 3 hands.', 'setup.note4p': '4 players: East 1–4. Red fives and open tanyao.',
    'howto.title': 'How to Play', 'ai.swap': 'SWAP!', 'sig.paid': '{name} threw {n} points on the table! (into the pot)', 'sig.drain': '{name} drained {n} gauge!', 'sig.luck': "{name}'s next 2 draws are miracles!", 'chaos.meteor': 'Meteor strike! Every {tile} is dora', 'flip.cost': 'Costs {n} gauge',
    'set.title': 'Settings', 'set.master': 'Master', 'set.bgm': 'Music', 'set.sfx': 'Sound FX', 'set.voice': 'Voice', 'set.voiceOn': 'Character voices', 'set.voiceLang': 'Voice language',
    'set.lang': 'Language', 'set.auto': 'Auto', 'set.follow': 'Same as language', 'set.speed': 'Animation speed', 'set.slow': 'Slow', 'set.normal': 'Normal', 'set.fast': 'Fast', 'set.faster': 'Faster',
    'set.assist': 'Assist (shanten & waits)', 'set.autoskip': 'Auto-skip calls (except ron)', 'set.tapconfirm': 'Touch: first tap selects, second tap discards', 'set.lite': 'Lite mode (fewer effects)', 'set.close': 'Close',
    'cred.title': 'Credits',
    'hud.round': '{wind} {n}', 'hud.of': 'of {n}', 'hud.honba': '{n} honba', 'hud.kyotaku': 'Pot {n}', 'hud.remain': 'Wall {n}', 'hud.dora': 'Dora',
    'hud.heat': 'Suspicion', 'hud.flip': 'Table Flip', 'hud.riichi': 'Riichi', 'hud.you': 'You', 'hud.accuse': 'Accuse!', 'hud.accuseHint': 'Tap a suspicious opponent to accuse',
    'hud.cheatBar': 'Cheats', 'hud.tip': 'Anything goes here! Spend gauge ● and every cheat (keys 1–6) always works. When you win, make up a yaku!', 'hud.yourTurn': 'Your turn',
    'act.tsumo': 'Tsumo', 'act.riichi': 'Riichi', 'act.cancel': 'Cancel', 'act.kan': 'Kan', 'act.nuki': 'Kita', 'act.tsumogiri': 'Discard draw', 'act.kyuushu': 'Nine terminals',
    'act.ron': 'Ron', 'act.pon': 'Pon', 'act.chi': 'Chii', 'act.skip': 'Skip', 'act.back': 'Back', 'act.next': 'Next ▶',
    'hint.riichi': 'Discard a glowing tile to declare riichi!', 'hint.call': 'You can {what} on {tile}', 'hint.ron': 'ron', 'hint.naki': 'call',
    'hint.tenpai': 'Tenpai', 'hint.wait': 'waits', 'hint.left': '{n} left', 'hint.shanten': '{n}-shanten', 'hint.agari': 'Winning hand!', 'hint.choosing': '(choose a discard)', 'hint.cut': 'discard →', 'hint.ukeire': '{n} useful tiles',
    'cheat.pickHand': 'Tap the tile in your hand to swap out', 'cheat.pickWall': 'Pick the tile you want from the wall!', 'cheat.wallLabel': 'Next 6 tiles in the wall', 'cheat.pickRiver': 'Pick a discard to pull back!',
    'cheat.pickGive': 'Tap the tile in your hand to leave in the river', 'cheat.cancel': 'Cancel', 'cheat.notTurn': 'Use it on your turn',
    'block.gauge': 'Not enough gauge', 'block.nouse': "Can't use that now", 'block.once': 'One cheat per turn', 'block.riichi': "Can't change your hand during riichi", 'block.wall': 'No tiles left in the wall', 'block.river': 'No discards to grab', 'block.dora': 'No more dora indicators',
    'mg.title': "Don't get caught!", 'mg.tap': 'Tap / Space to stop', 'mg.watch': '{name} is watching…', 'mg.perfect': 'PERFECT!!', 'mg.ok': 'SAFE!', 'mg.fail': 'BUSTED!!', 'mg.zone': 'Safe zone',
    'pen.caught': 'Caught cheating!', 'pen.pay': 'Penalty {n}', 'pen.card': 'Warning {n}/3', 'pen.aiCaught': 'Got you!', 'pen.gain': '+{n}', 'pen.false': 'False accusation!', 'pen.red': 'Red card! +{n}',
    'flip.ask': '{name} calls {what}!', 'flip.btn': 'TABLE FLIP!!', 'flip.pass': 'Let it go', 'flip.void': 'This hand is void!', 'flip.left': 'Once per match',
    'win.tsumo': 'TSUMO', 'win.ron': 'RON', 'win.riichi': 'RIICHI', 'win.tsumoWin': 'Tsumo win', 'win.ronWin': 'Ron win', 'win.dora': 'Dora indicators', 'win.ura': 'Ura dora',
    'win.han': '{n} han', 'win.fu': '{fu} fu {han} han', 'win.all': '{n} all', 'win.pts': '{n}', 'win.split': '{a} / {b}',
    'draw.title': 'Draw', 'draw.none': 'Nobody in tenpai (no payment)', 'draw.all': 'Everyone in tenpai (no payment)', 'draw.pay': 'No-ten penalty: {n} total', 'draw.tenpai': 'Tenpai', 'draw.noten': 'No-ten',
    'call.pon': 'PON!', 'call.chi': 'CHII!', 'call.kan': 'KAN!', 'call.nuki': 'KITA!',
    'banner.start': 'Match start!', 'banner.sub': '{n} players · East-only', 'banner.round': 'East {n}', 'banner.roundSub': '{honba} honba   Dealer: {name}', 'banner.allLast': 'All Last',
    'end.top': '🏆 1st place!', 'end.place': '{n} place', 'end.you': '(you)', 'end.cheatRank': 'Cheat King Rank', 'end.stats': 'Cheats {ok}/{tried} (PERFECT {perfect}) / Accusations hit {aok}, miss {ang} / Table flips {flips} / Caught {caught}',
    'end.again': 'Play again', 'end.roll': 'Staff roll', 'end.title': 'Title', 'end.basic': 'Wins {wins} / Deal-ins {dealIns} / Riichi {riichi}',
    'rank.S': 'Legendary Tile Trickster', 'rank.A': 'Slick Tile Swindler', 'rank.B': 'Apprentice Trickster', 'rank.C': 'Honest Player (Probably)', 'rank.X': 'Banned',
    'ban.title': 'BANNED', 'ban.sub': 'Three warnings and you are out…', 'ban.retry': 'Retry from this hand', 'ban.quit': 'Title',
    'roll.skip': 'Skip ▶▶', 'roll.thanks': 'Thank you for playing', 'roll.again': 'Please keep the cheating inside the game.',
    'set.reset': 'Reset save', 'set.resetConfirm': 'Really reset?', 'set.sound': 'Sound files: {n}', 'set.soundNone': 'No sound files yet (the game plays silently)', 'set.test': 'Test ▶',
    'cred.roll': 'Staff Roll', 'title.lang': '日本語', 'setup.random': 'Random', 'setup.charPick': 'Choose a character',
    'hud.howto': 'How to play', 'hud.settings': 'Settings', 'hud.quit': 'Quit', 'hud.auto': 'Auto',
    'hud.gauge': 'Gauge', 'hud.sig': 'Signature', 'hud.words': 'Word cards', 'hud.rule': 'House rule', 'hud.extraDora': 'Special dora', 'hud.frozen': 'Frozen', 'hud.cost': 'Gauge {n}',
    'block.gauge': 'Not enough gauge (you gain 1 every turn)', 'block.nouse': "Can't use that now",
    'fake.title': 'Make up a yaku!', 'fake.sub': 'Pick up to 4 word cards and declare a yaku that does not exist. ★ words match your hand (+2 han); a head, core and finish together add +1 (max 6 han).',
    'fake.declare': 'Declare!', 'fake.auto': 'Auto', 'fake.none': 'Pick some words', 'fake.han': '{n} han', 'fake.ok': 'APPROVED!', 'fake.mul': 'Doubled by the house rule!',
    'fake.cat.pre': 'Head', 'fake.cat.core': 'Core', 'fake.cat.suf': 'Finish', 'fake.label': 'Made-up yaku',
    'sig.by': "{name}'s signature move!", 'chaos.frozen': 'Frozen! Turn skipped', 'chaos.gravityEnd': 'Gravity is back to normal',
    'end.style': 'Cheats {cheats} / Signatures {sigs} / Made-up yaku total {fake} han', 'end.best': 'Best made-up yaku', 'end.rankNote': 'Cheat King Rank is all about style',
    'quit.confirm': 'Press again to quit and return to the title', 'auto.on': 'AUTO ON', 'auto.off': 'AUTO OFF',
  };
  const PLACES_EN = ['1st', '2nd', '3rd', '4th'];
  let lang = 'ja';
  function resolve(setting) {
    if (setting === 'ja' || setting === 'en') return setting;
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'ja';
    return /^ja/i.test(nav) ? 'ja' : 'en';
  }
  const I18N = {
    setLang(setting) { lang = resolve(setting); document.documentElement.lang = lang; return lang; },
    get lang() { return lang; },
    t(key, vars) {
      let s = (lang === 'en' ? EN : JA)[key];
      if (s == null) s = JA[key] != null ? JA[key] : key;
      if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
      return s;
    },
    place(n) { return lang === 'en' ? I18N.t('end.place', { n: PLACES_EN[n - 1] }) : I18N.t('end.place', { n }); },
    apply(el) {
      (el || document).querySelectorAll('[data-i18n]').forEach(e => { e.textContent = I18N.t(e.dataset.i18n); });
      (el || document).querySelectorAll('[data-i18n-title]').forEach(e => { e.title = I18N.t(e.dataset.i18nTitle); });
    },
    term(ja) { return lang === 'en' && root.TermsEn && root.TermsEn[ja] ? root.TermsEn[ja] : ja; },
  };
  root.I18N = I18N;
  root.t = I18N.t;
})(typeof window !== 'undefined' ? window : globalThis);
