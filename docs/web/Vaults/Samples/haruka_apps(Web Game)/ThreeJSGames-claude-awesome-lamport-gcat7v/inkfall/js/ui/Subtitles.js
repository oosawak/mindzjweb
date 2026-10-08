// =========================================================
// Subtitles — ボイス再生 + 字幕表示
//  セリフは data/script.json の id で呼び出す
// =========================================================
import { settings } from '../core/Settings.js';
import { lang, pick } from '../core/I18n.js';
import { el } from './UI.js';

export class Subtitles {
  constructor(root, audio, script) {
    this.root = root;
    this.audio = audio;
    this.lines = new Map(script.lines.map((l) => [l.id, l]));
    this.speakers = script.speakers || {};
    this.current = null;
    this.token = 0;
  }

  line(id) { return this.lines.get(id); }

  /** 字幕だけの推定表示時間 */
  estimate(text) {
    if (lang() === 'ja') return Math.max(2.0, text.replace(/\s/g, '').length * 0.16 + 1.0);
    return Math.max(2.0, text.split(/\s+/).length * 0.4 + 1.0);
  }

  /**
   * セリフを再生
   * @returns {Promise<void>} 読み終わったら resolve
   */
  say(id, { voice = true, hold = 0.25, show = true } = {}) {
    const line = this.lines.get(id);
    if (!line) return Promise.resolve();
    const token = ++this.token;
    const text = pick(line.text);
    const v = voice ? this.audio.voice(id) : null;
    const duration = v ? v.duration + hold : this.estimate(text);
    if (show) this._show(line, text); else this._hide(true);
    return new Promise((resolve) => {
      const done = () => {
        if (token === this.token) this._hide();
        resolve();
      };
      this._pending = { token, resolve: done };
      setTimeout(() => { if (this._pending?.token === token) this._pending = null; done(); }, duration * 1000);
    });
  }

  _show(line, text) {
    this._hide(true);
    if (!settings.get('subtitles')) return;
    const node = el('div', { class: 'sub-line' });
    const spk = this.speakers[line.speaker];
    if (spk && line.speaker !== 'narrator') node.append(el('span', { class: `who ${line.speaker}`, text: pick(spk) }));
    node.append(el('span', { class: 'txt', text }));
    this.root.append(node);
    this.current = node;
  }

  _hide(immediate = false) {
    const n = this.current;
    this.current = null;
    if (!n) return;
    if (immediate) { n.remove(); return; }
    n.classList.add('out');
    setTimeout(() => n.remove(), 260);
  }

  clear() {
    this.token++;
    const p = this._pending;
    this._pending = null;
    this.audio.stopVoice();
    this._hide(true);
    this.root.innerHTML = '';
    p?.resolve();
  }
}
