// =========================================================
// Settings — せってい(localStorage に保存)
// =========================================================
import { CONFIG } from '../config.js';

const KEY = `${CONFIG.storageKey}.settings.v1`;
const BEST_KEY = `${CONFIG.storageKey}.best.v1`;

function detectLang() {
  const l = (navigator.language || 'ja').toLowerCase();
  return l.startsWith('ja') ? 'ja' : 'en';
}

const DEFAULTS = {
  bgm: 0.7,
  sfx: 0.85,
  voice: 1.0,
  lang: detectLang(),
  easy: false,
  reduceMotion: false,
  subtitles: true,
  quality: 'auto',
};

function safeRead(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
function safeWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode etc. */ }
}

class Settings extends EventTarget {
  constructor() {
    super();
    const saved = safeRead(KEY) || {};
    this.data = { ...DEFAULTS, ...saved };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches && saved.reduceMotion === undefined) {
      this.data.reduceMotion = true;
    }
  }

  get(key) { return this.data[key]; }

  set(key, value) {
    if (this.data[key] === value) return;
    this.data[key] = value;
    safeWrite(KEY, this.data);
    this.dispatchEvent(new CustomEvent('change', { detail: { key, value } }));
  }

  /** 実際に使う画質プリセット名 */
  resolvedQuality() {
    const q = this.data.quality;
    if (q !== 'auto') return q;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    const mem = navigator.deviceMemory || 4;
    if (coarse && mem <= 3) return 'low';
    if (coarse) return 'medium';
    return 'high';
  }

  getBest() { return safeRead(BEST_KEY); }

  /** ベスト記録を更新したら true */
  saveBest(result) {
    const best = this.getBest();
    const order = { S: 3, A: 2, B: 1 };
    const better = !best
      || order[result.rank] > order[best.rank]
      || (order[result.rank] === order[best.rank] && result.time < best.time);
    if (better) safeWrite(BEST_KEY, result);
    return better;
  }
}

export const settings = new Settings();
