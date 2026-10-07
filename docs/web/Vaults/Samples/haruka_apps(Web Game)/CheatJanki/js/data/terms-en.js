/* 麻雀用語の英語表記（役名・満貫など・流局理由） */
(function (root) {
  'use strict';
  const T = {
    '立直': 'Riichi', 'ダブル立直': 'Double Riichi', '一発': 'Ippatsu', '門前清自摸和': 'Menzen Tsumo', '平和': 'Pinfu', '断么九': 'Tanyao',
    '一盃口': 'Iipeikou', '役牌 白': 'Yakuhai: White Dragon', '役牌 發': 'Yakuhai: Green Dragon', '役牌 中': 'Yakuhai: Red Dragon',
    '場風牌': 'Round Wind', '自風牌': 'Seat Wind', '海底摸月': 'Haitei', '河底撈魚': 'Houtei', '嶺上開花': 'Rinshan Kaihou', '槍槓': 'Chankan',
    '七対子': 'Chiitoitsu', '三色同順': 'Sanshoku Doujun', '一気通貫': 'Ittsu', '混全帯么九': 'Chanta', '対々和': 'Toitoi', '三暗刻': 'San Ankou',
    '三色同刻': 'Sanshoku Doukou', '三槓子': 'San Kantsu', '小三元': 'Shousangen', '混老頭': 'Honroutou', '二盃口': 'Ryanpeikou', '混一色': 'Honitsu',
    '純全帯么九': 'Junchan', '清一色': 'Chinitsu', '天和': 'Tenhou', '地和': 'Chiihou', '国士無双': 'Kokushi Musou', '国士無双十三面待ち': 'Kokushi 13-Wait',
    '四暗刻': 'Suuankou', '四暗刻単騎': 'Suuankou Tanki', '大三元': 'Daisangen', '小四喜': 'Shousuushii', '大四喜': 'Daisuushii', '字一色': 'Tsuuiisou',
    '緑一色': 'Ryuuiisou', '清老頭': 'Chinroutou', '九蓮宝燈': 'Chuuren Poutou', '純正九蓮宝燈': 'Pure Chuuren Poutou', '四槓子': 'Suukantsu',
    'ドラ': 'Dora', '裏ドラ': 'Ura Dora', '赤ドラ': 'Red Five', '抜きドラ': 'Kita Dora',
    '満貫': 'Mangan', '跳満': 'Haneman', '倍満': 'Baiman', '三倍満': 'Sanbaiman', '数え役満': 'Kazoe Yakuman', '役満': 'Yakuman',
    'ダブル役満': 'Double Yakuman', 'トリプル役満': 'Triple Yakuman', 'ダブル': 'Double', '役満級': 'Yakuman',
    '荒牌流局': 'Exhaustive Draw', '九種九牌': 'Nine Terminals', '四風連打': 'Four Winds', '四家立直': 'Four Riichi', '四槓散了': 'Four Kans',
  };
  root.TermsEn = T;
})(typeof window !== 'undefined' ? window : globalThis);
