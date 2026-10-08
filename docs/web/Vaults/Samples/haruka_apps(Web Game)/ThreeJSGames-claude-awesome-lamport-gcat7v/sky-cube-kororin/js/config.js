// =========================================================
// ゲーム全体の調整用パラメータ
// 数字を変えるだけで手ざわりを調整できるように、ここに集約しています。
// =========================================================

export const CONFIG = {
  version: '1.0.0',
  storageKey: 'skycube-kororin',

  physics: {
    gravity: 26,          // じゅうりょくの つよさ
    maxFall: 30,          // さいだい らっか そくど
    moveSpeed: 6.8,       // ころがる はやさ
    accelGround: 42,
    accelAir: 16,
    friction: 18,
    jumpSpeed: 9.6,
    radius: 0.45,
    coyoteTime: 0.12,     // あしばから はなれても ジャンプできる よゆう
    jumpBuffer: 0.14,
    switchCooldown: 0.32, // じゅうりょく きりかえの クールタイム
    switchDamp: 0.35,     // きりかえ時に いまの そくどを どれだけ のこすか
    substep: 1 / 120,
    hazardKnock: 9,       // やさしいモードで ビリビリに あたった時の はねかえり
  },

  camera: {
    fov: 60,
    fovBoost: 14,         // はやく おちている時に ひろがる 視野角
    distance: 6.8,
    minDistance: 1.4,
    pitch: 0.38,
    minPitch: -0.7,
    maxPitch: 1.15,
    rotateDuration: 0.55, // じゅうりょく きりかえ時の カメラ回転時間
    followLambda: 11,
    dragSensitivity: 0.0055,
    keySpeed: 2.4,
  },

  // 画質プリセット
  quality: {
    low:    { pixelRatio: 1.0, bloom: false, shadows: false, particles: 500,  antialias: false },
    medium: { pixelRatio: 1.5, bloom: true,  shadows: false, particles: 1400, antialias: true },
    high:   { pixelRatio: 2.0, bloom: true,  shadows: true,  particles: 2600, antialias: true },
  },

  // ランク判定(スター総数 15)
  rank: [
    { id: 'S', minStars: 13, maxTime: 240 },
    { id: 'A', minStars: 8,  maxTime: 360 },
    { id: 'B', minStars: 0,  maxTime: Infinity },
  ],

  // ステージの順番(js/game/levels/ のファイル名)
  stageOrder: ['stage1', 'stage2', 'stage3'],
};
