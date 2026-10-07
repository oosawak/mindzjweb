// 共有ゲーム状態
export const G = {
  scene: null, camera: null, renderer: null, engine: null,
  world: null, map: null, mode: null, player: null,
  actors: [], time: 0, dt: 0, paused: true, running: false,
  audio: null, vfx: null, hud: null, input: null, loot: null, zone: null,
  settings: null,
};

const DEFAULTS = {
  sens: 1.0, adsSens: 0.8, fov: 85, invertY: false,
  view: 'fp', headBob: 0.25, cameraShake: 0.7,
  gore: 2, // 0=オフ 1=標準 2=過激
  master: 0.8, music: 0.55, sfx: 0.9, bgm: false, aimAssist: 2,
  quality: 2, // 0 低 1 中 2 高 3 最高
  showFps: false, difficulty: 1,
  shoulder: 1,
};

export function loadSettings() {
  let s = { ...DEFAULTS };
  try {
    const raw = localStorage.getItem('lastfall_settings');
    if (raw) s = { ...s, ...JSON.parse(raw) };
  } catch (e) { /* 保存不可の環境 */ }
  G.settings = s;
  return s;
}
export function saveSettings() {
  try { localStorage.setItem('lastfall_settings', JSON.stringify(G.settings)); } catch (e) { /* ignore */ }
}
export const SETTINGS_DEFAULTS = DEFAULTS;
