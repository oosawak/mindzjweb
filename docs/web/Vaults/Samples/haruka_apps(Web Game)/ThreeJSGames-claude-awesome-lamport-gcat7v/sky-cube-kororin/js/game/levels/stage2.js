// =========================================================
// STAGE 2 「ねじれ タワー」
//  たかい とうの中を「うえに おちて」のぼっていく。
//  しきりの あなを くぐり、ビリビリと うごく ブロックを よけよう。
// =========================================================
const RECT = [-6, 6, -6, 6];

export default {
  id: 'stage2',
  number: 2,
  name: { ja: 'ねじれ タワー', en: 'Twisty Tower' },
  titleVoice: 'stage2_title',
  bgm: 'stage2',
  sky: { top: '#3b3a8f', mid: '#ff9fb8', bottom: '#ffcf8a', stars: 0.4 },
  fog: { color: '#d8c8ff', near: 25, far: 120 },
  palette: {
    blocks: ['#d8dcff', '#ffd6e6', '#c8ecff', '#ffe4bf', '#e4d4ff', '#c9f5e2'],
    tintX: '#ffd8e8', tintY: '#ffffff', tintZ: '#d2e0ff',
    edge: '#c8d4ff', grid: '#9a8cff', gridStrength: 0.24, hazard: '#c070ff',
    dust: '#ffe6f6',
  },
  lights: { sky: '#e8e4ff', ground: '#ffc8a8', hemi: 1.25, sun: '#ffe2c8', sunIntensity: 1.6, sunDir: [10, 16, 6] },
  decor: { colors: ['#ffd6ec', '#c8c4ff', '#ffe2b8', '#ffffff'], cloudColor: '#ffd6e8' },
  start: { pos: [-2.5, 0.55, -2.5], gravity: '-y', yaw: Math.PI / 4, pitch: 0.2 },
  camera: { distance: 5.6 },
  bounds: { center: [0, 30, 0], radius: 70 },

  build(b) {
    // とう(内側 x,z: -6〜6 / y: 0〜60)
    b.room([0, 30, 0], [12, 60, 12], 1, { colors: [0, 1, 2, 3, 4, 5] });

    // しきり 1(y=12)… みぎおくに あな
    b.slabY(12, 1, RECT, [2, 6, 2, 6], { c: 3 });
    // しきり 2(y=24)… ひだりてまえに あな + うらがわに ビリビリ
    b.slabY(24, 1, RECT, [-6, -2, -6, -2], { c: 4 });
    b.box([-0.5, 23.35, -6], [0.5, 24, 2.5], { hazard: true });
    b.box([-6, 23.35, -0.5], [-3, 24, 0.5], { hazard: true });
    // しきり 3(y=36)… まんなかに あな + うごく ふた
    b.slabY(36, 1, RECT, [-1.5, 1.5, -1.5, 1.5], { c: 5 });
    b.mover([0, 35.5, 0], [3, 1, 3], { axis: 'x', amp: 4.4, period: 3.4, c: 3 });
    // しきり 4(y=48)… みぎてまえに あな + ビリビリ バーが いったりきたり
    b.slabY(48, 1, RECT, [2, 6, -6, -2], { c: 2 });
    b.mover([0, 47.7, 0], [12, 0.6, 0.8], { axis: 'z', amp: 4.6, period: 4.2, hazard: true });

    // かべの でっぱり(あしば)
    b.block([-5.5, 6, 3], [1, 1, 3], { c: 1 });
    b.block([5.5, 18, -3], [1, 1, 3], { c: 1 });
    b.block([-3, 30, 5.5], [3, 1, 1], { c: 0 });
    b.block([3, 42, -5.5], [3, 1, 1], { c: 0 });

    // きらきら
    b.star([-5.2, 5, 0]);       // ひだりの かべ
    b.star([0, 18, 5.2]);       // てまえの かべ
    b.star([-1.5, 23.25, 4.4]); // しきり2 の うら(ビリビリの すきま)
    b.star([3, 30, -5.2]);      // おくの かべ
    b.star([5.2, 42, 0]);       // みぎの かべ

    // ゴール(てっぺんの てんじょう)
    b.goal([0, 58.4, 0], '-y', 0);
  },

  hints: [
    { id: 'st2_intro', when: 'start', delay: 0.8 },
    { id: 'st2_hazard', when: 'zone', min: [-6, 16, -6], max: [6, 24, 6] },
    { id: 'st2_mover', when: 'zone', min: [-6, 28, -6], max: [6, 36, 6] },
  ],
};
