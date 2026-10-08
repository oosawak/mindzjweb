// =========================================================
// I18n — ことば(にほんご / English)
// UI の文字は data/i18n/*.json、セリフは data/script.json
// =========================================================
import { settings } from './Settings.js';

const dict = { ja: {}, en: {} };

export async function loadI18n() {
  const [ja, en] = await Promise.all([
    fetch('data/i18n/ja.json').then((r) => r.json()),
    fetch('data/i18n/en.json').then((r) => r.json()),
  ]);
  dict.ja = ja;
  dict.en = en;
}

export function lang() {
  return settings.get('lang') === 'en' ? 'en' : 'ja';
}

/** UI テキストを取得。{name} 形式の差し込みに対応 */
export function t(key, vars) {
  const l = lang();
  let s = dict[l][key] ?? dict.ja[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.replaceAll(`{${k}}`, vars[k]);
  return s;
}

/** {ja: '...', en: '...'} 形式のオブジェクトから現在の言語を取り出す */
export function pick(obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang()] ?? obj.ja ?? '';
}

/** PC かタッチかで文言を切り替えるときに使う */
export function isTouch() {
  return document.body.classList.contains('touch');
}
