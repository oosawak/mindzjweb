// =========================================================
// STAGE 3 「ほしの めいろ」
//  よぞらに うかぶ しまを、じゅうりょくを きりかえて とびうつる。
//  くずれる しま に きをつけて!
// =========================================================
export default {
  id: 'stage3',
  number: 3,
  name: { ja: 'ほしの めいろ', en: 'Starry Maze' },
  titleVoice: 'stage3_title',
  bgm: 'stage3',
  sky: { top: '#0f1442', mid: '#4a3f9e', bottom: '#ff8fb8', stars: 1.0, aurora: 1.0 },
  fog: { color: '#3a3480', near: 60, far: 240 },
  palette: {
    blocks: ['#e6dcff', '#ffd6ee', '#cfe4ff', '#fff0b8', '#cff5e4', '#ffdcc4'],
    tintX: '#ffd0e8', tintY: '#ffffff', tintZ: '#c8d8ff',
    edge: '#ffe27a', edgeStrength: 1.1, grid: '#b8a8ff', gridStrength: 0.22, hazard: '#c070ff',
    dust: '#ffe27a',
  },
  lights: { sky: '#c8d0ff', ground: '#ff9cc2', hemi: 1.2, sun: '#ffe8d0', sunIntensity: 1.8, sunDir: [-8, 18, 12] },
  decor: { colors: ['#c8c4ff', '#ffd6ec', '#8fa8ff', '#fff3b0'], cloudColor: '#b8a8ff', cloudOpacity: 0.45 },
  start: { pos: [0, 4.55, 3], gravity: '-y', yaw: 0, pitch: 0.12 },
  bounds: { center: [10, 16, -8], radius: 48 },

  build(b) {
    // しま1(スタート)
    b.block([0, 0, 0], [8, 8, 10], { c: 0 });
    b.block([2.5, 5, -3], [2, 2, 2], { c: 3 });
    b.block([-3, 4.5, 3.5], [1.5, 1, 1.5], { c: 5 });

    // しま2(くずれる タイル 3×3)— したから「うえへ おちて」つかまる
    for (const x of [-2, 0, 2]) {
      for (const z of [-2, 0, 2]) b.crumble([x, 16, z + 1], [2, 2, 2], { delay: 1.3, respawn: 3 });
    }

    // しま3(みぎ)— よこへ おちて とびうつる
    b.block([16, 15, 0], [6, 10, 6], { c: 2 });
    b.block([18, 21, 0], [2, 2, 2], { c: 4 });

    // しま4(おく)
    b.block([15, 14, -18], [10, 8, 6], { c: 1 });
    b.hazard([15, 10.4, -14.6], [10, 0.8, 0.8]);
    b.block([11, 12, -14.5], [1, 1, 1], { c: 3 });

    // しま5(ゴールの しま)
    b.block([16, 32, -14], [10, 4, 10], { c: 5 });
    b.block([16, 35, -14], [4, 2, 4], { c: 3 });

    // きらきら
    b.star([-2, 4.8, -1]);        // しま1 の うえ
    b.star([0, 10, 2]);           // そらの とちゅう(うえへ)
    b.star([6.5, 14.55, 1]);      // そらの とちゅう(よこへ)
    b.star([12.2, 18, -2]);       // しま3 の かべ
    b.star([15, 23, -14.55]);     // そらの とちゅう(うえへ)

    // ゴール(しま5 の うら)
    b.goal([16, 28.4, -14], '-y', 0);
  },

  hints: [
    { id: 'st3_intro', when: 'start', delay: 0.8 },
    { id: 'st3_crumble', when: 'crumble', count: 1 },
    { id: 'st3_side', when: 'zone', min: [-4, 13, -3], max: [4, 16, 5] },
    { id: 'st3_look', when: 'zone', min: [11, 9, -4], max: [14, 21, 4] },
    { id: 'st3_marker', when: 'zone', min: [9, 9, -16], max: [21, 19, -13] },
  ],
};
