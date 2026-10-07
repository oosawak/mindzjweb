/* =========================================================
 *  CHEAT JANKI! — 反則まわりの2D演出（カットイン・カード・字幕・トースト）
 *  すべて #fx-layer に重ねる。クリックでスキップできるものは FX.wait を使う。
 * ========================================================= */
(function (root) {
  'use strict';
  const { el, esc } = root.U;
  const FXC = {};
  const layer = () => document.getElementById('fx-layer');
  const T = (ms) => ms / (root.FX.speed || 1);
  const wait = (ms) => root.FX.wait(T(ms));

  /** 技名スプラッシュ（成功時） */
  FXC.splash = async function ({ kanji, name, sub, color }) {
    const d = el(`<div class="cutin cx-splash" style="--c:${color}">
      <div class="cx-slash"></div>
      <div class="cx-band"><div class="cx-kanji"><span>${esc(kanji)}</span></div>
        <div class="cx-name">${esc(name)}${sub ? `<small>${esc(sub)}</small>` : ''}</div></div>
    </div>`);
    layer().appendChild(d);
    root.Sound && Sound.sfx('whoosh');
    root.FX.speedLines(0.5, color);
    await wait(1150);
    d.classList.add('out');
    await root.U.sleep(T(220));
    d.remove();
  };

  /** 大きなスタンプ（濡れ衣・無効など） */
  FXC.stamp = async function ({ text, sub, color }) {
    const d = el(`<div class="cutin cx-stamp" style="--c:${color || '#ff3355'}"><div class="cx-stamp-in">${esc(text)}</div>${sub ? `<div class="cx-stamp-sub">${esc(sub)}</div>` : ''}</div>`);
    layer().appendChild(d);
    root.Sound && Sound.sfx('stamp');
    await wait(1300);
    d.remove();
  };

  /** 審判の字幕（ボイスがなくても読めるように） */
  let refTimer = null;
  FXC.ref = function (text) {
    let bar = document.getElementById('ref-caption');
    if (!bar) { bar = el('<div id="ref-caption"><span class="ref-ico">REF</span><span class="ref-text"></span></div>'); document.getElementById('app').appendChild(bar); }
    bar.querySelector('.ref-text').textContent = text;
    bar.classList.remove('show'); void bar.offsetWidth; bar.classList.add('show');
    clearTimeout(refTimer);
    refTimer = setTimeout(() => bar.classList.remove('show'), T(2400));
  };

  /** 短いお知らせ */
  let toastTimer = null;
  FXC.toast = function (text, kind, ms) {
    let tst = document.getElementById('toast');
    if (!tst) { tst = el('<div id="toast"></div>'); document.getElementById('app').appendChild(tst); }
    tst.textContent = text;
    tst.className = 'show ' + (kind || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { tst.className = ''; }, ms || 1900);
  };

  /** キャラのセリフ吹き出し（席の近く） */
  FXC.bubble = function (x, y, text, color) {
    if (!text) return;
    const b = el(`<div class="seat-bubble" style="--c:${color};left:${x}px;top:${y}px">${esc(text)}</div>`);
    layer().appendChild(b);
    // 画面からはみ出さないように寄せる
    const w = b.offsetWidth, m = 8;
    b.style.left = Math.max(m + w / 2, Math.min(innerWidth - m - w / 2, x)) + 'px';
    b.style.top = Math.max(m, Math.min(innerHeight - b.offsetHeight - m, y)) + 'px';
    setTimeout(() => b.classList.add('out'), T(2200));
    setTimeout(() => b.remove(), T(2600));
  };

  /** 点数移動の数字を各席から浮かべる */
  FXC.deltas = function (before, after, seatEl) {
    if (after[0] > before[0]) root.Sound && Sound.sfx('sfx_coin');
    before.forEach((b, p) => {
      const df = after[p] - b; if (!df) return;
      const e = seatEl(p); if (!e) return;
      const r = e.getBoundingClientRect();
      root.FX.floatText(r.left + r.width / 2, r.top + r.height / 2, (df > 0 ? '+' : '') + df.toLocaleString(), df > 0 ? '#7dffb0' : '#ff6b8a', true);
    });
  };

  /** キャラ固有技のカットイン（立ち絵＋技名） */
  FXC.sigCut = async function ({ art, who, name, kanji, color, line }) {
    const d = el(`<div class="cutin cx-sig" style="--c:${color}">
      <div class="cx-sig-bg"></div><div class="cx-split"></div>
      <img class="cx-sig-art" src="${art}" alt="">
      <div class="cx-sig-box"><div class="cx-sig-who">${esc(who)}</div>
        <div class="cx-sig-name"><span class="cx-sig-kanji">${esc(kanji)}</span>${esc(name)}</div></div>
      ${line ? `<div class="ci-bubble cx-sig-line">${esc(line)}</div>` : ''}
    </div>`);
    layer().appendChild(d);
    root.Sound && Sound.sfx('whoosh');
    root.FX.flash(color, 0.3);
    root.FX.speedLines(0.7, color);
    await wait(1500);
    d.classList.add('out');
    await root.U.sleep(T(220));
    d.remove();
  };

  /** 卓が荒れるイベントの見出し */
  FXC.chaos = async function ({ kanji, name, desc, color }) {
    const d = el(`<div class="cutin cx-chaos" style="--c:${color}">
      <div class="cx-chaos-warn"><span>WARNING</span><span>WARNING</span><span>WARNING</span><span>WARNING</span></div>
      <div class="cx-chaos-body"><div class="cx-chaos-kanji">${esc(kanji)}</div>
        <div><div class="cx-chaos-name">${esc(name)}</div><div class="cx-chaos-desc">${esc(desc)}</div></div></div>
    </div>`);
    layer().appendChild(d);
    root.Sound && Sound.sfx('countdown');
    setTimeout(() => root.Sound && Sound.sfx('stamp'), T(450));
    root.FX.shakeScreen(document.getElementById('app'), 12);
    await wait(1700);
    d.classList.add('out');
    await root.U.sleep(T(220));
    d.remove();
  };

  /** でっち上げ役の認定 */
  FXC.fake = async function ({ name, han, label, ok, color, mulText }) {
    const d = el(`<div class="cutin cx-fake" style="--c:${color}">
      <div class="cx-fake-label">${esc(label)}</div>
      <div class="cx-fake-name">${esc(name)}</div>
      <div class="cx-fake-han">${esc(han)}</div>
      ${mulText ? `<div class="cx-fake-mul">${esc(mulText)}</div>` : ''}
      <div class="cx-fake-ok">${esc(ok)}</div>
    </div>`);
    layer().appendChild(d);
    root.Sound && Sound.sfx('fanfare_win');
    setTimeout(() => { root.Sound && Sound.sfx('stamp'); root.FX.shakeScreen(document.getElementById('app'), 14); root.FX.sparkles(innerWidth / 2, innerHeight * 0.5, 90, ['#fff', '#ffe066', color], 700); }, T(1050));
    await wait(2300);
    d.classList.add('out');
    await root.U.sleep(T(250));
    d.remove();
  };

  root.FXC = FXC;
})(typeof window !== 'undefined' ? window : globalThis);
