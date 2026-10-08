// =========================================================
// I18n — English / 日本語(Auto はブラウザの言語)
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

export function lang() { return settings.resolvedLang(); }

export function t(key, vars) {
  const l = lang();
  let s = dict[l][key] ?? dict.en[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.replaceAll(`{${k}}`, vars[k]);
  return s;
}

export function pick(obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang()] ?? obj.en ?? obj.ja ?? '';
}

export function isTouch() { return document.body.classList.contains('touch'); }
