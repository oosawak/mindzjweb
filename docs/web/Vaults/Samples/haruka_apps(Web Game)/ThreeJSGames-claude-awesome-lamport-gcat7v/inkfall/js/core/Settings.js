// =========================================================
// Settings — 設定(localStorage に保存)
// =========================================================
import { CONFIG } from '../config.js';

const KEY = `${CONFIG.storageKey}.settings.v1`;
const BEST_KEY = `${CONFIG.storageKey}.best.v1`;

const DEFAULTS = {
  bgm: 0.7,
  sfx: 0.85,
  voice: 1.0,
  language: 'auto',      // auto / en / ja
  quality: 'auto',
  reduceMotion: false,
  subtitles: true,
  colorMode: 'standard', // standard / accessible
  sensitivity: 1.0,
  invertY: false,
  controls: 'auto',      // auto / mouse / touch
  seenIntro: false,
  seenTraining: false,
};

function safeRead(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
function safeWrite(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}

class Settings extends EventTarget {
  constructor() {
    super();
    this.data = { ...DEFAULTS, ...(safeRead(KEY) || {}) };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches && safeRead(KEY)?.reduceMotion === undefined) {
      this.data.reduceMotion = true;
    }
  }

  get(key) {
    // 既存モジュール(PostFX など)は 'lang' を参照する
    if (key === 'lang') return this.resolvedLang();
    return this.data[key];
  }

  set(key, value) {
    if (this.data[key] === value) return;
    this.data[key] = value;
    safeWrite(KEY, this.data);
    this.dispatchEvent(new CustomEvent('change', { detail: { key, value } }));
    if (key === 'language') this.dispatchEvent(new CustomEvent('change', { detail: { key: 'lang', value: this.resolvedLang() } }));
  }

  resolvedLang() {
    const l = this.data.language;
    if (l === 'en' || l === 'ja') return l;
    return (navigator.language || 'en').toLowerCase().startsWith('ja') ? 'ja' : 'en';
  }

  resolvedQuality() {
    const q = this.data.quality;
    if (q !== 'auto') return q;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (coarse) return (navigator.deviceMemory || 4) <= 3 ? 'low' : 'medium';
    return 'high';
  }

  teams() { return CONFIG.teams[this.data.colorMode] || CONFIG.teams.standard; }

  getBest() { return safeRead(BEST_KEY) || {}; }
  saveBest(key, value, higherIsBetter = true) {
    const best = this.getBest();
    const prev = best[key];
    const better = prev === undefined || (higherIsBetter ? value > prev : value < prev);
    if (better) { best[key] = value; safeWrite(BEST_KEY, best); }
    return better;
  }
}

export const settings = new Settings();
