/* =========================================================
 *  小さな共通ヘルパー
 * ========================================================= */
(function (root) {
  'use strict';
  const U = {
    $: (s, r) => (r || document).querySelector(s),
    $$: (s, r) => Array.from((r || document).querySelectorAll(s)),
    sleep: (ms) => new Promise(r => setTimeout(r, ms)),
    esc: (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; },
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    isTouch: () => !!(root.matchMedia && matchMedia('(hover: none)').matches),
    /** 数字のカウントアップ */
    countUp(el, from, to, ms) {
      const t0 = performance.now();
      const f = () => { const k = Math.min(1, (performance.now() - t0) / ms); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))).toLocaleString(); if (k < 1) requestAnimationFrame(f); };
      f();
    },
  };
  root.U = U;
})(typeof window !== 'undefined' ? window : globalThis);
