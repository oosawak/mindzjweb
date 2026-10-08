// =========================================================
// STAGE 1 「はじまりの へや」— チュートリアル
//  18×18×18 の へやの中。かべ・てんじょう すべてが ゆか になる。
//  きらきらを 3こ あつめると てんじょうの ゴールが ひらく。
// =========================================================
export default {
  id: 'stage1',
  number: 1,
  name: { ja: 'はじまりの へや', en: 'The First Room' },
  titleVoice: 'stage1_title',
  bgm: 'stage1',
  sky: { top: '#5a8cf0', mid: '#a8d4ff', bottom: '#ffe0f0', stars: 0.15 },
  fog: { color: '#cfe4ff', near: 30, far: 160 },
  palette: {
    blocks: ['#ffe2b8', '#ffd0e4', '#cfe6ff', '#fff0a8', '#cdf5d8', '#e2d4ff'],
    tintX: '#ffd6e6', tintY: '#ffffff', tintZ: '#cfe0ff',
    edge: '#ffffff', grid: '#8fbfff', gridStrength: 0.22, hazard: '#c070ff',
    dust: '#ffffff',
  },
  lights: { sky: '#eaf4ff', ground: '#ffd6ec', hemi: 1.15, sun: '#fff4e0', sunIntensity: 1.8, sunDir: [6, 14, 9] },
  decor: { colors: ['#ffffff', '#ffd6ec', '#c8e4ff', '#fff3b0'], cloudColor: '#ffffff' },
  start: { pos: [0, -8.5, 4], gravity: '-y', yaw: 0, pitch: 0.3 },
  bounds: { center: [0, 0, 0], radius: 40 },

  build(b) {
    // へや(内側 -9〜9)
    b.room([0, 0, 0], [18, 18, 18], 1, { colors: [0, 1, 2, 3, 4, 5] });

    // まんなかに うかぶ キューブ(どの面にも のれる!)
    b.block([0, -1, 0], [4, 4, 4], { c: 3 });

    // ゆか の だん
    b.block([5, -8, -5], [3, 2, 3], { c: 2 });
    b.block([-6, -8.5, 5], [2, 1, 2], { c: 4 });
    // かべ / てんじょう の でっぱり
    b.block([8, 3, 4], [2, 2, 2], { c: 1 });
    b.block([-8, -4, -4], [2, 3, 3], { c: 5 });
    b.block([-5, 8, -5], [2, 2, 2], { c: 0 });
    b.block([3, 4, -8], [3, 2, 2], { c: 2 });

    // きらきら(5こ)
    b.star([-4, -8.2, -2]);   // ゆか
    b.star([0, -3.8, 0]);     // まんなかキューブの うら
    b.star([8.2, -3, 0]);     // みぎの かべ
    b.star([-3, 2, -8.2]);    // おくの かべ
    b.star([4, 8.2, 4]);      // てんじょう

    // ゴール(てんじょう)— 3こ あつめると ひらく
    b.goal([-3, 7.5, 3], '-y', 3);
  },

  // ヒント(セリフ ID は data/script.json)
  hints: [
    { id: 'tut_move', when: 'start', delay: 0.6 },
    { id: 'tut_look', when: 'start', delay: 6 },
    { id: 'tut_tap', when: 'start', delay: 11, unlessSwitched: true },
    { id: 'tut_ceiling', when: 'switch', count: 1 },
    { id: 'tut_goal', when: 'star', count: 1 },
    { id: 'tut_goal_open', when: 'goalOpen' },
  ],
};
