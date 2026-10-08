// =========================================================
// INKFALL — 調整用パラメータ
// =========================================================

export const CONFIG = {
  version: '1.0.0',
  storageKey: 'inkfall',
  netVersion: 1,

  physics: {
    gravity: 28,
    maxFall: 32,
    moveSpeed: 7.4,
    ownInkBoost: 1.22,     // 自チームのインクの上では速い
    enemyInkSlow: 0.8,     // 敵のインクの上では遅い
    accelGround: 46,
    accelAir: 16,
    friction: 20,
    jumpSpeed: 9.4,
    radius: 0.5,
    coyoteTime: 0.12,
    jumpBuffer: 0.14,
    flipCooldown: 0.75,    // 重力切り替えのクールダウン
    flipDamp: 0.3,
    substep: 1 / 120,
    stampSpeed: 15,        // この速さ以上で着地すると INK STAMP
  },

  combat: {
    hp: 100,
    shotDamage: 34,
    fireInterval: 0.13,
    shotSpeed: 46,
    shotRange: 34,
    shotSplat: 1.35,       // 着弾時の塗り半径
    rollerRadius: 0.75,    // 足元の塗り半径
    stampRadius: 3.2,
    stampKillRadius: 2.4,
    respawnTime: 3,
    spawnShield: 2,
    specialCost: 160,      // スペシャル(グラビティボム)に必要な塗りマス数
    bombRadius: 4.2,
    bombFlipRadius: 5.5,
    overdriveMul: 1.5,
  },

  turf: {
    rounds: 2,
    duration: 120,
    overdrive: 20,         // 残り何秒から OVERDRIVE
    teamSize: 4,
  },

  tag: {
    fuse: 18,
    passCooldown: 1.0,
    shoveCooldown: 1.4,
    shoveForce: 13,
    minPlayers: 4,
    maxPlayers: 8,
  },

  challenge: { duration: 60, leaderboard: 'inkfall_challenge_60s' },

  camera: {
    fov: 66,
    distance: 3.9,
    height: 1.2,
    shoulder: 0.7,
    minDistance: 1.0,
    pitch: 0.12,
    minPitch: -1.35,
    maxPitch: 1.35,
    rotateDuration: 0.5,
    followLambda: 16,
    mouseSensitivity: 0.0024,
    touchSensitivity: 0.0058,
  },

  net: {
    stateHz: 20,
    paintHz: 10,
    shotBatchHz: 12,
    maxPayload: 2004,      // Wavedash P2P の上限(LASTFALL で確認済み)
    hostTimeout: 6,
  },

  teams: {
    standard: [{ id: 'A', name: 'NEON', color: '#ff3fa4' }, { id: 'B', name: 'AQUA', color: '#25d9ff' }],
    accessible: [{ id: 'A', name: 'NEON', color: '#ff9a1f' }, { id: 'B', name: 'AQUA', color: '#3d7bff' }],
  },
  // ばくだん鬼(個人戦)のプレイヤー色
  ffaColors: ['#ff3fa4', '#25d9ff', '#b6ff3d', '#ffb31f', '#a86bff', '#ff5a3d', '#3dffc4', '#ffffff'],

  quality: {
    low:    { pixelRatio: 1.0, bloom: false, shadows: false, particles: 700,  antialias: false },
    medium: { pixelRatio: 1.5, bloom: true,  shadows: false, particles: 1800, antialias: true },
    high:   { pixelRatio: 2.0, bloom: true,  shadows: true,  particles: 3200, antialias: true },
  },
};
