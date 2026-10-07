/* =========================================================
 *  CHEAT JANKI! — セリフ・キャラ追加データ（日本語 / English）
 *  - en.*        : 英語ボイス／字幕（既存の日本語セリフ11種 + 反則セリフ8種）
 *  - ja.*        : 反則セリフ（日本語）。[表示テキスト, 読み上げ用テキスト|null, 正しい読み(ひらがな)]
 *                  既存の日本語セリフ11種は js/data/characters.js の lines と assets/audio/voice/ja/<id>/ を使用
 *  - eye         : 観察眼（高いほどイカサマを見抜く＝ミニゲームの緑ゾーンが狭くなる）
 *  - sly         : 自分の手番でイカサマをする確率
 *  このファイルから elevenlabs/build_voice_specs.js が voice_*.json を作ります。
 * ========================================================= */
(function (root) {
  'use strict';
  const BASE_KEYS = ['start', 'riichi', 'tsumo', 'ron', 'pon', 'chi', 'kan', 'nuki', 'yakuman', 'win', 'lose'];
  const CHEAT_KEYS = ['cheat', 'safe', 'caught', 'accuse', 'innocent', 'flip', 'flipped', 'banned'];

  const LINES = {
    hiyori: {
      nameEn: 'Hiyori Sakurai', titleEn: 'Rookie Idol Mahjong Player', eye: 0.78, sly: 0.06,
      en: {
        start: 'Here I go! Nice to meet you!', riichi: 'Riichi! Here I go!', tsumo: 'Tsumo! Yay!', ron: 'Ron! Hehe!', pon: 'Pon!', chi: 'Chii!', kan: 'Kan!', nuki: 'Kita!',
        yakuman: 'Y-Yakuman?! No way!', win: 'Hiyori wins!', lose: "Ugh... I'll win next time!",
        cheat: 'Hehe, just a teeny little cheat!', safe: 'Safe! Nobody saw that, right?', caught: 'Eek! I got caught!', accuse: "I saw that! That's cheating!",
        innocent: "What?! I didn't do anything!", flip: 'Nope! Table flip!', flipped: 'Noooo! My winning hand!', banned: 'Banned...? No fair...',
      },
      ja: {
        cheat: ['えへへ、ちょっとだけ…ズルしちゃお♪', null, 'えへへちょっとだけずるしちゃお'],
        safe: ['セーフ！バレてないよね？', null, 'せーふばれてないよね'],
        caught: ['あわわっ、バレちゃった〜！', null, 'あわわっばれちゃった'],
        accuse: ['見ちゃった！それイカサマだよ！', null, 'みちゃったそれいかさまだよ'],
        innocent: ['ええっ！？ひより、何もしてないよぉ！', null, 'ええっひよりなにもしてないよお'],
        flip: ['こんなの、ちゃぶ台返しだーっ！', 'こんなの、ちゃぶだいがえしだーっ！', 'こんなのちゃぶだいがえしだ'],
        flipped: ['えーっ！？ひよりのアガリがーっ！', null, 'えーっひよりのあがりがー'],
        banned: ['出禁…そんなぁ…', 'できん…そんなぁ…', 'できんそんなあ'],
      },
    },
    shizuku: {
      nameEn: 'Shizuku Tsukishiro', titleEn: 'Cool-Headed Literature Club President', eye: 1.35, sly: 0.03,
      en: {
        start: "Let's have a good game.", riichi: 'Riichi.', tsumo: 'Tsumo. Exactly as calculated.', ron: 'Ron. I was waiting for that tile.', pon: 'Pon.', chi: 'Chii.', kan: 'Kan.', nuki: 'Kita.',
        yakuman: 'Impossible... a yakuman?', win: 'The logical outcome.', lose: '...I misread the table.',
        cheat: 'Let me adjust the probabilities a little.', safe: 'Flawless. No one noticed.', caught: '...How careless of me.', accuse: "I saw your hands move. That's cheating.",
        innocent: 'Accusations without evidence are unbecoming.', flip: 'This hand never happened.', flipped: "The whole table? That's absurd.", banned: "Banned... I can't argue with that logic.",
      },
      ja: {
        cheat: ['…確率を、少しだけ修正するわ', null, 'かくりつをすこしだけしゅうせいするわ'],
        safe: ['計算通り。誰も気づかない', null, 'けいさんどおりだれもきづかない'],
        caught: ['…私としたことが', null, 'わたしとしたことが'],
        accuse: ['今の手つき、見逃さないわ。イカサマね', null, 'いまのてつきみのがさないわいかさまね'],
        innocent: ['根拠のない告発は、感心しないわね', null, 'こんきょのないこくはつはかんしんしないわね'],
        flip: ['この局は、なかったことにするわ', null, 'このきょくはなかったことにするわ'],
        flipped: ['…卓ごと？非常識にも程があるわ', null, 'たくごとひじょうしきにもほどがあるわ'],
        banned: ['出禁…論理的に、反論できないわね', 'できん…論理的に、反論できないわね', 'できんろんりてきにはんろんできないわね'],
      },
    },
    luna: {
      nameEn: 'Luna Amane', titleEn: 'Top Idol of the Moonlit Night', eye: 0.92, sly: 0.08,
      en: {
        start: "Welcome to Luna's stage tonight!", riichi: 'Riichi! Let me cast a moonlight spell.', tsumo: 'Tsumo! Luna wins tonight.', ron: 'Ron! Sparkle!', pon: 'Pon!', chi: 'Chii!', kan: 'Kan!', nuki: 'Kita!',
        yakuman: "Yakuman...! Tonight's star is Luna!", win: 'No encore this time!', lose: 'Sorry, everyone...',
        cheat: 'A little moon magic to rewrite fate!', safe: "On stage, Luna's always the star!", caught: 'Eek! The spotlight was too bright!', accuse: "You can't fool Luna's eyes! Cheater!",
        innocent: 'Luna would never do such a thing!', flip: 'No encore! Table flip!', flipped: 'Hey! That was my big moment!', banned: 'Banned? My fans will cry...',
      },
      ja: {
        cheat: ['月の魔法で、ちょっとだけ書き換えちゃう☆', null, 'つきのまほうでちょっとだけかきかえちゃう'],
        safe: ['ステージの上は、ルナが主役♪', null, 'すてーじのうえはるながしゅやく'],
        caught: ['きゃっ、スポットライトが眩しすぎた…！', 'きゃっ、スポットライトがまぶしすぎた…！', 'きゃっすぽっとらいとがまぶしすぎた'],
        accuse: ['ルナの目はごまかせないわ！イカサマよ☆', null, 'るなのめはごまかせないわいかさまよ'],
        innocent: ['ルナがそんなことするわけないでしょ？', null, 'るながそんなことするわけないでしょ'],
        flip: ['アンコールはなし！ちゃぶ台返しよ☆', 'アンコールはなし！ちゃぶだいがえしよ☆', 'あんこーるはなしちゃぶだいがえしよ'],
        flipped: ['ちょっと！ルナの見せ場がっ！', null, 'ちょっとるなのみせばが'],
        banned: ['出禁なんて…ファンが泣いちゃう…', 'できんなんて…ファンが泣いちゃう…', 'できんなんてふぁんがないちゃう'],
      },
    },
    karen: {
      nameEn: 'Karen Kureha', titleEn: 'Blazing Crimson Gambler', eye: 0.82, sly: 0.12,
      en: {
        start: "Come at me with everything you've got!", riichi: "Riichi! Don't you dare run!", tsumo: "Tsumo! Now I'm fired up!", ron: "Ron! That's mine!", pon: 'Pon!', chi: 'Chii!', kan: 'Kan!', nuki: 'Kita!',
        yakuman: 'Yakumaaan! Burn to ashes!', win: "I'm the strongest!", lose: "Grr... You'll pay for this!",
        cheat: 'Winning is all that matters!', safe: 'Hmph, easy as pie!', caught: 'Tch! What are you looking at?!', accuse: 'You did something just now! Cheater!',
        innocent: 'Huh?! I play fair and square!', flip: "I'll flip this whole table over!", flipped: 'Hey! What do you think you\'re doing?!', banned: "Banned?! You'll regret this!",
      },
      ja: {
        cheat: ['勝てばいいのよ、勝てば！', null, 'かてばいいのよかてば'],
        safe: ['ふふん、ちょろいもんね！', null, 'ふふんちょろいもんね'],
        caught: ['ちっ…！見てんじゃないわよ！', null, 'ちっみてんじゃないわよ'],
        accuse: ['あんた今、何かしたでしょ！イカサマよ！', null, 'あんたいまなにかしたでしょいかさまよ'],
        innocent: ['はぁ！？あたしは正々堂々よ！', null, 'はあ あたしはせいせいどうどうよ'],
        flip: ['こんな卓、ひっくり返してやるわ！', null, 'こんなたくひっくりかえしてやるわ'],
        flipped: ['ちょっと！何すんのよーっ！', null, 'ちょっとなにすんのよ'],
        banned: ['出禁！？覚えてなさいよーっ！', 'できん！？覚えてなさいよーっ！', 'できんおぼえてなさいよ'],
      },
    },
    myao: {
      nameEn: 'Myao Nekomiya', titleEn: 'Whimsical Cat-Eared Gamer', eye: 0.9, sly: 0.09,
      en: {
        start: 'Nice to meet you, nya!', riichi: 'Riichi, nya!', tsumo: 'Tsumo, nyaaan!', ron: 'Ron, nya!', pon: 'Pon, nya!', chi: 'Chii, nya.', kan: 'Kan, nya!', nuki: 'Kita, nya!',
        yakuman: 'Nya nya nya?! Yakuman, nyaaa!', win: 'Myao wins, nya!', lose: 'Nyau... so sleepy...',
        cheat: "A cat's paw can borrow a tile, nya!", safe: 'Nobody saw, nya!', caught: 'Nya?! My tail was showing...', accuse: "I saw it, nya! That's cheating!",
        innocent: 'Myao is innocent, nya!', flip: 'Cat punch! Table flip, nya!', flipped: 'Nyaaa! My winning hand!', banned: "Banned, nya... I'll go nap at home...",
      },
      ja: {
        cheat: ['ねこの手もかりたいにゃ〜♪', null, 'ねこのてもかりたいにゃ'],
        safe: ['ばれてないにゃ♪', null, 'ばれてないにゃ'],
        caught: ['にゃっ！？しっぽが出てたにゃ…', null, 'にゃっしっぽがでてたにゃ'],
        accuse: ['見てたにゃ！イカサマだにゃ！', null, 'みてたにゃいかさまだにゃ'],
        innocent: ['みゃおは無実にゃ〜！', null, 'みゃおはむじつにゃ'],
        flip: ['ねこパンチ！ちゃぶ台返しにゃ！', 'ねこパンチ！ちゃぶだいがえしにゃ！', 'ねこぱんちちゃぶだいがえしにゃ'],
        flipped: ['にゃーっ！みゃおのアガリがー！', null, 'にゃーみゃおのあがりがー'],
        banned: ['出禁にゃ…おうちで寝るにゃ…', 'できんにゃ…おうちで寝るにゃ…', 'できんにゃおうちでねるにゃ'],
      },
    },
    nono: {
      nameEn: 'Nono Midorikawa', titleEn: 'Shy Library Committee Member', eye: 1.12, sly: 0.03,
      en: {
        start: 'N-Nice to meet you...', riichi: 'R-Riichi...!', tsumo: 'Tsumo... I did it.', ron: 'U-Um... ron...', pon: 'P-Pon...', chi: 'Chii...', kan: 'Kan... I think.', nuki: 'K-Kita...',
        yakuman: 'Eh?! A yakuman?!', win: 'I-I won...!', lose: "I'm sorry...",
        cheat: 'S-Sorry... just a little...', safe: 'Phew... nobody noticed...', caught: "Eep! I-I'm so sorry!", accuse: "U-Um... you just swapped a tile, didn't you?",
        innocent: "I-I didn't do anything!", flip: 'H-Hyaa! Table flip!', flipped: 'N-No way... my winning hand...', banned: "Banned... I'll hide in the library...",
      },
      ja: {
        cheat: ['ご、ごめんなさい…ちょっとだけ…', null, 'ごめんなさいちょっとだけ'],
        safe: ['よ、よかった…ばれてない…', null, 'よかったばれてない'],
        caught: ['ひゃっ！？ご、ごめんなさいぃ…！', null, 'ひゃっごめんなさい'],
        accuse: ['あ、あの…今、すり替えましたよね…？', null, 'あのいますりかえましたよね'],
        innocent: ['わ、わたし、何もしてないです…！', null, 'わたしなにもしてないです'],
        flip: ['え、えいっ！ちゃぶ台返しですっ！', 'え、えいっ！ちゃぶだいがえしですっ！', 'えいっちゃぶだいがえしです'],
        flipped: ['そ、そんな…わたしのアガリ…', null, 'そんなわたしのあがり'],
        banned: ['出禁…図書室にこもります…', 'できん…図書室にこもります…', 'できんとしょしつにこもります'],
      },
    },
    reika: {
      nameEn: 'Reika Kongouin', titleEn: 'High-Scoring Heiress', eye: 1.0, sly: 0.1,
      en: {
        start: 'Good day. Do try to entertain me.', riichi: 'Riichi, darling!', tsumo: 'Tsumo. Ohohoho!', ron: 'Ron! Pardon me!', pon: 'Pon, if you please.', chi: 'Chii, if you please.', kan: 'Kan!', nuki: 'Kita, thank you.',
        yakuman: 'Yakuman! This is how a Kongouin plays!', win: 'A victory befitting me!', lose: 'M-Me? Lose?!',
        cheat: 'Behold the secret art of the Kongouin family!', safe: "Ohohoho! Elegant, wasn't it?", caught: 'Wh-What?! Me, caught?!', accuse: 'Hold it! That was against the rules!',
        innocent: 'How rude! You suspect a Kongouin?', flip: 'I refuse to accept such a cheap hand!', flipped: 'My baiman! Gone?!', banned: "Banned?! I'm telling Father!",
      },
      ja: {
        cheat: ['金剛院家の秘技、お見せしますわ', 'こんごういん家の秘技、お見せしますわ', 'こんごういんけのひぎおみせしますわ'],
        safe: ['おーっほっほ！優雅でしょう？', null, 'おーっほっほゆうがでしょう'],
        caught: ['な、なんですって！？わたくしが！？', null, 'なんですってわたくしが'],
        accuse: ['お待ちなさい！今のは反則ですわ！', null, 'おまちなさいいまのははんそくですわ'],
        innocent: ['失礼な！金剛院家を疑うおつもり？', '失礼な！こんごういん家を疑うおつもり？', 'しつれいなこんごういんけをうたがうおつもり'],
        flip: ['こんな安い局、認めませんわ！', null, 'こんなやすいきょくみとめませんわ'],
        flipped: ['わたくしの倍満がーっ！？', 'わたくしのばいまんがーっ！？', 'わたくしのばいまんがー'],
        banned: ['出禁！？お父様に言いつけますわ！', 'できん！？お父様に言いつけますわ！', 'できんおとうさまにいいつけますわ'],
      },
    },
    airi: {
      nameEn: 'Airi Yukishiro', titleEn: 'The Cool Ice Queen', eye: 1.25, sly: 0.04,
      en: {
        start: '...Nice to meet you.', riichi: 'Riichi.', tsumo: 'Tsumo. ...Heh.', ron: 'Ron. Freeze.', pon: 'Pon.', chi: 'Chii.', kan: 'Kan.', nuki: 'Kita.',
        yakuman: "...Yakuman. Even I'm a little surprised.", win: '...I won.', lose: "...Next time I won't lose.",
        cheat: '...Freeze it. Swap it.', safe: '...No one saw.', caught: '...Oops.', accuse: '...I saw that. Cheating.',
        innocent: "...It wasn't me.", flip: '...Flip the whole table.', flipped: '...Huh. The table...', banned: "...Banned. That's a little lonely.",
      },
      ja: {
        cheat: ['…凍らせて、すり替える', null, 'こおらせてすりかえる'],
        safe: ['…誰も見てない', null, 'だれもみてない'],
        caught: ['…しまった', null, 'しまった'],
        accuse: ['…見えた。イカサマね', null, 'みえたいかさまね'],
        innocent: ['…私じゃない', null, 'わたしじゃない'],
        flip: ['…卓ごと、ひっくり返す', null, 'たくごとひっくりかえす'],
        flipped: ['…え。卓が…', null, 'えたくが'],
        banned: ['…出禁。少し、寂しい', '…できん。少し、さびしい', 'できんすこしさびしい'],
      },
    },
    mahiru: {
      nameEn: 'Mahiru Yayoi', titleEn: 'Gothic Girl Enchanted by Darkness', eye: 1.05, sly: 0.1,
      en: {
        start: 'I commend your courage to sit at my table.', riichi: 'A pact with darkness... Riichi!', tsumo: 'Tsumo... Fate is in my hands.', ron: 'Ron! Fall into the abyss!', pon: 'Pon...', chi: 'Chii...', kan: 'Kan of darkness!', nuki: 'Kita... sealed.',
        yakuman: 'Fuhahaha! Behold, the forbidden yakuman!', win: 'Victory belongs to darkness...!', lose: 'Ugh... the light is too bright...',
        cheat: 'Forbidden art of darkness... activate!', safe: 'Heh heh... the abyss hides all.', caught: 'Impossible! My art was seen through?!', accuse: 'Your hand reeks of darkness! Cheater!',
        innocent: 'You dare suspect me? Foolish.', flip: 'World, turn upside down! Table flip!', flipped: 'My forbidden win...?!', banned: 'Banned... the world of light is harsh...',
      },
      ja: {
        cheat: ['闇の秘術…発動！', null, 'やみのひじゅつはつどう'],
        safe: ['ふふふ…深淵は全てを隠す', null, 'ふふふしんえんはすべてをかくす'],
        caught: ['ば、馬鹿な…我が術が見破られただと！？', null, 'ばかなわがじゅつがみやぶられただと'],
        accuse: ['その手…闇の気配がするぞ！イカサマだ！', null, 'そのてやみのけはいがするぞいかさまだ'],
        innocent: ['我を疑うとは…愚かな', null, 'われをうたがうとはおろかな'],
        flip: ['世界よ、反転せよ！ちゃぶ台返し！', '世界よ、反転せよ！ちゃぶだいがえし！', 'せかいよはんてんせよちゃぶだいがえし'],
        flipped: ['我が禁断のアガリが…！？', null, 'わがきんだんのあがりが'],
        banned: ['出禁…光の世界は、厳しい…', 'できん…光の世界は、厳しい…', 'できんひかりのせかいはきびしい'],
      },
    },
    natsu: {
      nameEn: 'Natsu Hinata', titleEn: 'Sunny Track Team Ace', eye: 0.72, sly: 0.06,
      en: {
        start: 'Ready, set, go!', riichi: 'Riichi! Full sprint!', tsumo: 'Tsumo! Goal!', ron: 'Ron! I passed you!', pon: 'Pon!', chi: 'Chii!', kan: 'Kan!', nuki: 'Kita!',
        yakuman: 'Yakumaaan! New record!', win: 'First across the line!', lose: "I won't lose next time!",
        cheat: 'False start? Never heard of it!', safe: 'Safe! Just barely safe!', caught: 'Whoa! Disqualified for a false start?!', accuse: 'That was a cheat! Foul!',
        innocent: 'I always race fair and square!', flip: 'Ready, set... table flip!', flipped: 'I was right at the finish line!', banned: "Banned... I'm gonna run ten laps...",
      },
      ja: {
        cheat: ['フライング気味でいくよ！', null, 'ふらいんぐぎみでいくよ'],
        safe: ['セーフ！ギリギリセーフ！', null, 'せーふぎりぎりせーふ'],
        caught: ['うわっ、フライングで失格！？', null, 'うわっふらいんぐでしっかく'],
        accuse: ['今のズルだよね！反則だよ！', null, 'いまのずるだよねはんそくだよ'],
        innocent: ['なつは正々堂々走ってるよ！', null, 'なつはせいせいどうどうはしってるよ'],
        flip: ['よーい、ちゃぶ台返しっ！', 'よーい、ちゃぶだいがえしっ！', 'よーいちゃぶだいがえし'],
        flipped: ['ゴール直前だったのにーっ！', null, 'ごーるちょくぜんだったのに'],
        banned: ['出禁…グラウンド十周してくる…', 'できん…グラウンドじゅっしゅうしてくる…', 'できんぐらうんどじゅっしゅうしてくる'],
      },
    },
    mira: {
      nameEn: 'Mira Hoshino', titleEn: 'Starlit Songstress of Miracles', eye: 0.86, sly: 0.07,
      en: {
        start: "Let's start a miracle stage!", riichi: 'Riichi! Make a wish!', tsumo: 'Tsumo! My wish came true!', ron: 'Ron! Twinkle twinkle!', pon: 'Pon!', chi: 'Chii!', kan: 'Kan!', nuki: 'Kita!',
        yakuman: 'Yakuman! This is the sparkle of a miracle!', win: 'Thank you, everyone!', lose: 'I missed the shooting star...',
        cheat: 'Wishing on a shooting star! Just a little!', safe: "That's what a miracle looks like!", caught: 'Huh? Did my stars show...?', accuse: "I saw a sparkle! That's cheating!",
        innocent: 'Mira never tells lies!', flip: 'Miracle table flip!', flipped: 'My miracle!', banned: "Banned... my shooting star didn't make it...",
      },
      ja: {
        cheat: ['流れ星にお願い☆ちょっとだけ！', null, 'ながれぼしにおねがいちょっとだけ'],
        safe: ['奇跡って、こういうことだよね☆', null, 'きせきってこういうことだよね'],
        caught: ['あれれ？星が見えちゃってた…？', null, 'あれれほしがみえちゃってた'],
        accuse: ['キラッと見えたよ！イカサマだね☆', null, 'きらっとみえたよいかさまだね'],
        innocent: ['ミラはうそつかないよ〜！', null, 'みらはうそつかないよ'],
        flip: ['ミラクル・ちゃぶ台返し☆', 'ミラクル・ちゃぶだいがえし☆', 'みらくるちゃぶだいがえし'],
        flipped: ['ミラの奇跡がぁ〜！', null, 'みらのきせきが'],
        banned: ['出禁…流れ星、届かなかった…', 'できん…流れ星、届かなかった…', 'できんながれぼしとどかなかった'],
      },
    },
    yukari: {
      nameEn: 'Yukari Fujisaki', titleEn: 'Gentle Student Council President', eye: 1.15, sly: 0.05,
      en: {
        start: "Let's all play nicely together!", riichi: 'My my, riichi.', tsumo: 'Tsumo! Ufufu.', ron: "Ron! I'm so sorry.", pon: 'Pon!', chi: 'Chii!', kan: 'Kan.', nuki: 'Kita.',
        yakuman: 'Oh my... a yakuman! Ufufufu.', win: 'Everyone did so well!', lose: 'Oh dear, I lost.',
        cheat: "My my, let's keep this a secret, okay?", safe: "Ufufu, a student council president's privilege!", caught: "Oh my... you saw that, didn't you?", accuse: "That was... a naughty thing to do, wasn't it?",
        innocent: "You suspect me? Ufufu... I'll get angry, you know?", flip: "Everyone, it's clean-up time!", flipped: 'Oh dear... the table flipped over.', banned: "Banned, you say... I'll have to write an apology.",
      },
      ja: {
        cheat: ['あらあら、内緒よ？', null, 'あらあらないしょよ'],
        safe: ['うふふ、生徒会長の特権です♪', null, 'うふふせいとかいちょうのとっけんです'],
        caught: ['あらまぁ…見られちゃったわね', null, 'あらまあみられちゃったわね'],
        accuse: ['今のは…いけないことよね？', null, 'いまのはいけないことよね'],
        innocent: ['わたしを疑うの？…うふふ、怒るわよ？', null, 'わたしをうたがうのうふふおこるわよ'],
        flip: ['みんな、お片付けの時間よ♪', null, 'みんなおかたづけのじかんよ'],
        flipped: ['あらあら…卓がひっくり返っちゃった', null, 'あらあらたくがひっくりかえっちゃった'],
        banned: ['出禁ですって…反省文、書かなきゃ', 'できんですって…反省文、書かなきゃ', 'できんですってはんせいぶんかかなきゃ'],
      },
    },
  };

  /** 審判（アナウンサー）: [日本語表示, 読み上げ用|null, 読み] / 英語 */
  const ANNOUNCER = {
    title: { ja: ['イカサマ☆雀姫！', 'イカサマ、ジャンキ！', 'いかさまじゃんき'], en: 'Cheat Janki!' },
    start: { ja: ['これより対局を開始します。イカサマは厳禁です！', null, 'これよりたいきょくをかいしします いかさまはげんきんです'], en: 'The match begins. Cheating is strictly forbidden!' },
    alllast: { ja: ['オーラス！', null, 'おーらす'], en: 'All last! Final hand!' },
    foul: { ja: ['反則！', null, 'はんそく'], en: 'Foul!' },
    warning: { ja: ['イエローカード！警告です！', null, 'いえろーかーどけいこくです'], en: "Yellow card! That's a warning!" },
    banned: { ja: ['レッドカード！出入り禁止！', 'レッドカード！でいり、きんし！', 'れっどかーどでいりきんし'], en: "Red card! You're banned!" },
    caught_ai: { ja: ['イカサマ発覚！罰符です！', 'イカサマ発覚！ばっぷです！', 'いかさまはっかくばっぷです'], en: 'Cheater caught! Penalty points!' },
    false_acc: { ja: ['証拠不十分！濡れ衣の罰符です！', '証拠不十分！ぬれぎぬのばっぷです！', 'しょうこふじゅうぶんぬれぎぬのばっぷです'], en: 'Insufficient evidence! False accusation penalty!' },
    flip_ok: { ja: ['ちゃぶ台返し！この局は無効！', 'ちゃぶだいがえし！この局は無効！', 'ちゃぶだいがえしこのきょくはむこう'], en: 'Table flip! This hand is void!' },
    swap: { ja: ['燕返し！', 'つばめがえし！', 'つばめがえし'], en: 'Swallow Swap!' },
    peek: { ja: ['千里眼！', 'せんりがん！', 'せんりがん'], en: 'Clairvoyance!' },
    raid: { ja: ['河拾い！', 'かわひろい！', 'かわひろい'], en: 'River Raid!' },
    slam: { ja: ['強打！', 'きょうだ！', 'きょうだ'], en: 'Table Slam!' },
    dora: { ja: ['ドラ爆弾！', null, 'どらばくだん'], en: 'Dora Bomb!' },
    flip: { ja: ['ちゃぶ台返し！', 'ちゃぶだいがえし！', 'ちゃぶだいがえし'], en: 'Table Flip!' },
    end: { ja: ['対局終了！', null, 'たいきょくしゅうりょう'], en: 'Game over!' },
    king: { ja: ['反則王、決定！', null, 'はんそくおうけってい'], en: 'The Cheat King is crowned!' },
  };

  const Lines = { LINES, ANNOUNCER, BASE_KEYS, CHEAT_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = Lines;
  else root.Lines = Lines;
})(typeof window !== 'undefined' ? window : globalThis);
