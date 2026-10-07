/* =========================================================
 *  CHEAT JANKI! — 「バレずに決めろ！」タイミングミニゲーム
 *  針が往復するゲージの緑ゾーンで止める。中央の金色は PERFECT。
 *  ゾーンの幅と針の速さは RiotGame.challenge() が決める（疑惑ゲージ・相手の観察眼）。
 *  Minigame.run(opt) -> Promise<'perfect' | 'ok' | 'fail'>
 * ========================================================= */
(function (root) {
  'use strict';
  const { el, esc } = root.U;
  const Minigame = { forceResult: null, active: false, limit: 4.5 };   // limit: 秒。時間切れはバレる
  const LOCK = 0.3;             // 開始直後の誤タップ防止

  Minigame.run = function (o) {
    // o: { kanji, name, color, zone, speed, watcher: {art, name, color}, auto }
    return new Promise(resolve => {
      const zone = Math.max(0.06, Math.min(0.6, o.zone));
      const center = zone / 2 + 0.06 + Math.random() * (1 - zone - 0.12);
      const perfect = zone * 0.3;
      const t = root.t;
      const ov = el(`<div class="mg-overlay" style="--c:${o.color};--wc:${o.watcher.color}">
        <div class="mg-vignette"></div>
        <div class="mg-panel">
          <div class="mg-head"><span class="mg-kanji">${esc(o.kanji)}</span><div><div class="mg-title">${esc(t('mg.title'))}</div><div class="mg-cheat">${esc(o.name)}</div></div></div>
          <div class="mg-watch"><img src="${o.watcher.art}" alt=""><div class="mg-eye"><i></i></div><span>${esc(t('mg.watch', { name: o.watcher.name }))}</span></div>
          <div class="mg-gauge">
            <div class="mg-zone" style="left:${(center - zone / 2) * 100}%;width:${zone * 100}%"><b style="width:${perfect / zone * 100}%"></b></div>
            <div class="mg-ticks"></div>
            <div class="mg-needle"></div>
          </div>
          <div class="mg-timer"><i></i></div>
          <div class="mg-hint">${esc(t('mg.tap'))}</div>
          <div class="mg-result"></div>
        </div>
      </div>`);
      document.getElementById('app').appendChild(ov);
      Minigame.active = true;
      const needle = ov.querySelector('.mg-needle'), pupil = ov.querySelector('.mg-eye i'), timer = ov.querySelector('.mg-timer i');
      let hb = null;
      root.Sound && Sound.sfx('heartbeat', { loop: true, handle: (h) => { hb = h; } });
      root.Scene3D && Scene3D.post && Scene3D.post('uDesat', 0.65, 0.25);
      const t0 = performance.now();
      let x = 0, done = false, lastTick = 0;
      const cps = 0.62 * o.speed;           // 1秒あたりの往復回数
      function frame() {
        if (done) return;
        const s = (performance.now() - t0) / 1000;
        const ph = (s * cps * 2) % 2;
        x = ph < 1 ? ph : 2 - ph;
        x = 0.5 - 0.5 * Math.cos(x * Math.PI);  // 端で少しゆっくり
        needle.style.left = (x * 100) + '%';
        pupil.style.transform = `translateX(${(x - 0.5) * 14}px)`;
        timer.style.transform = `scaleX(${Math.max(0, 1 - s / Minigame.limit)})`;
        if (Math.floor(s * cps * 2) !== lastTick) { lastTick = Math.floor(s * cps * 2); root.Sound && Sound.sfx('needle'); }
        if (s >= Minigame.limit) return finish(true);
        if (o.auto && s > 0.6 + Math.random() * 0.4 && Math.abs(x - center) < zone * 0.3) return finish();
        requestAnimationFrame(frame);
      }
      function finish(timeout) {
        if (done) return;
        done = true;
        const d = Math.abs(x - center);
        let res = timeout ? 'fail' : d <= perfect / 2 ? 'perfect' : d <= zone / 2 ? 'ok' : 'fail';
        if (Minigame.forceResult) res = Minigame.forceResult;
        hb && hb.stop();
        removeEventListener('keydown', onKey, true);
        const r = ov.querySelector('.mg-result');
        r.textContent = t('mg.' + res);
        ov.classList.add('done', res);
        root.Sound && Sound.sfx(res === 'perfect' ? 'mg_perfect' : res === 'ok' ? 'mg_success' : 'mg_fail');
        if (res === 'fail') { root.FX.flash('#ff2244', 0.35); root.FX.shakeScreen(document.getElementById('app'), 12); }
        else if (res === 'perfect') { const b = needle.getBoundingClientRect(); root.FX.sparkles(b.left, b.top + b.height / 2, 60, ['#fff', '#ffe066', o.color], 500); }
        root.Scene3D && Scene3D.post && Scene3D.post('uDesat', 0, 0.4);
        setTimeout(() => { ov.classList.add('out'); }, 620 / (root.FX.speed || 1));
        setTimeout(() => { ov.remove(); Minigame.active = false; resolve(res); }, 860 / (root.FX.speed || 1));
      }
      const ok = () => (performance.now() - t0) / 1000 > LOCK;
      ov.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); if (ok()) finish(); });
      function onKey(e) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); e.stopPropagation(); if (ok()) finish(); }
      }
      addEventListener('keydown', onKey, true);
      requestAnimationFrame(frame);
    });
  };

  root.Minigame = Minigame;
})(typeof window !== 'undefined' ? window : globalThis);
