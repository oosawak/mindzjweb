/* =========================================================
 *  セーブ（設定と戦績）— localStorage。使えない環境でもメモリ上で動く
 * ========================================================= */
(function (root) {
  'use strict';
  const KEY = 'cheat_janki_save_v1';
  const DEFAULTS = () => ({
    settings: {
      lang: 'auto', master: 0.9, bgm: 0.7, sfx: 0.8, voice: 0.95, voiceOn: true, voiceLang: 'follow',
      speed: 1, assist: true, autoSkipCall: false, tapConfirm: true, lite: false,
    },
    stats: { games: 0, tops: 0, bestRank: '-', banned: 0, cheatsOK: 0, flips: 0, accuseOK: 0 },
    last: { mode: '4p', me: 'hiyori', outfit: 1 },
  });
  const RANK_ORDER = ['X', 'C', 'B', 'A', 'S'];
  let data = DEFAULTS();
  const Save = {
    get data() { return data; },
    load() {
      try {
        const raw = root.localStorage && localStorage.getItem(KEY);
        if (raw) {
          const d = JSON.parse(raw), def = DEFAULTS();
          data = { settings: { ...def.settings, ...(d.settings || {}) }, stats: { ...def.stats, ...(d.stats || {}) }, last: { ...def.last, ...(d.last || {}) } };
        }
      } catch (e) { data = DEFAULTS(); }
      return data;
    },
    persist() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* 保存できない環境 */ } },
    reset() { data = DEFAULTS(); try { localStorage.removeItem(KEY); } catch (e) { /* */ } },
    /** 最高ランクを更新 */
    betterRank(a, b) { return RANK_ORDER.indexOf(a) >= RANK_ORDER.indexOf(b) ? a : b; },
  };
  root.Save = Save;
})(typeof window !== 'undefined' ? window : globalThis);
