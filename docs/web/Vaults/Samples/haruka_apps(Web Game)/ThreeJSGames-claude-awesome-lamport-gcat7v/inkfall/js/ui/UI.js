// =========================================================
// UI — DOM ヘルパー
// =========================================================
import { Icons } from './Icons.js';

/** 小さな DOM ビルダー */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style' && typeof v === 'object') { for (const [sk, sv] of Object.entries(v)) { if (sk.startsWith('--')) node.style.setProperty(sk, sv); else node.style[sk] = sv; } }
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

export class UI {
  constructor(root, audio) {
    this.root = root;
    this.audio = audio;
    this.modals = [];
  }

  clear() {
    this.root.innerHTML = '';
    this.modals = [];
    document.body.classList.remove('modal-open');
  }

  screen(cls = '') {
    const s = el('div', { class: `screen ${cls}` });
    this.root.append(s);
    return s;
  }

  /** 大きなボタン(SFX つき) */
  button({ label, icon, cls = '', onClick, sfx = 'ui_select', title }) {
    const b = el('button', { class: `btn ${cls}`, type: 'button', title: title || label, 'aria-label': title || label });
    if (icon) b.insertAdjacentHTML('beforeend', Icons[icon] || '');
    if (label) b.append(el('span', { class: 'label', text: label }));
    b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') this.audio.sfx('ui_hover', { minGap: 0.06 }); });
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sfx) this.audio.sfx(sfx);
      onClick?.(e);
    });
    return b;
  }

  /**
   * モーダルパネル
   * @returns {{root:HTMLElement, body:HTMLElement, foot:HTMLElement, close:Function}}
   */
  modal({ title, icon, onClose, closable = true, cls = '' }) {
    const wrap = el('div', { class: 'modal' });
    const panel = el('div', { class: `panel ${cls}`, role: 'dialog', 'aria-label': title });
    const head = el('div', { class: 'panel-head' });
    if (icon) head.insertAdjacentHTML('beforeend', Icons[icon] || '');
    head.append(el('div', { class: 'title', text: title }));
    const body = el('div', { class: 'panel-body' });
    const foot = el('div', { class: 'panel-foot' });
    panel.append(head, body, foot);
    wrap.append(panel);
    this.root.append(wrap);

    const api = {
      root: wrap,
      panel,
      body,
      foot,
      closed: false,
      close: () => {
        if (api.closed) return;
        api.closed = true;
        wrap.remove();
        this.modals = this.modals.filter((m) => m !== api);
        document.removeEventListener('keydown', onKey);
        document.body.classList.toggle('modal-open', this.modals.length > 0);
        onClose?.();
      },
    };
    const onKey = (e) => { if (e.key === 'Escape' && closable && this.modals.at(-1) === api) { this.audio.sfx('ui_back'); api.close(); } };
    document.addEventListener('keydown', onKey);
    if (closable) {
      const x = this.button({ icon: 'close', cls: 'round small', title: 'close', sfx: 'ui_back', onClick: () => api.close() });
      head.append(x);
      wrap.addEventListener('pointerdown', (e) => { if (e.target === wrap) { this.audio.sfx('ui_back'); api.close(); } });
    }
    this.modals.push(api);
    document.body.classList.add('modal-open');
    // 最初のボタンにフォーカス(キーボード操作用)
    setTimeout(() => foot.querySelector('button')?.focus({ preventScroll: true }), 50);
    return api;
  }

  hasModal() { return this.modals.length > 0; }

  iconHTML(name) { return Icons[name] || ''; }
}
