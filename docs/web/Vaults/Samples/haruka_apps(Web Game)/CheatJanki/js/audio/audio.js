/* =========================================================
 *  AudioManager — BGM / SFX / ボイス
 *  http(s) では Web Audio（fetch + decode・遅延読み込み）、file:// では HTMLAudio。
 *  assets/audio/available.js に載っているファイルだけを鳴らします（無いものは無音）。
 *  window.Sound は旧コード（fx.js）互換の窓口です。
 * ========================================================= */
(function (root) {
  'use strict';
  const M = root.AudioManifest;
  const available = new Set((root.AUDIO_AVAILABLE && root.AUDIO_AVAILABLE.files) || []);
  const useWebAudio = location.protocol !== 'file:' && !!(root.AudioContext || root.webkitAudioContext);

  const A = {
    settings: { master: 0.9, bgm: 0.6, sfx: 0.8, voice: 0.9, voiceLang: 'ja', voiceOn: true },
    ctx: null, unlocked: false, buffers: new Map(), loading: new Map(),
    bgm: null, bgmId: null, wantBgm: null, voiceNode: null, voicePri: -1, duck: 1,
  };
  A.has = (file) => available.has(file);
  A.count = () => available.size;

  function url(file) { return M.BASE + file; }
  function gains() {
    const s = A.settings;
    return { bgm: s.master * s.bgm, sfx: s.master * s.sfx, voice: s.master * s.voice };
  }

  A.unlock = function () {
    if (A.unlocked) return;
    A.unlocked = true;
    if (useWebAudio) {
      try {
        const AC = root.AudioContext || root.webkitAudioContext;
        A.ctx = new AC();
        A.master = A.ctx.createGain(); A.master.connect(A.ctx.destination);
        A.bgmBus = A.ctx.createGain(); A.bgmBus.connect(A.master);
        A.sfxBus = A.ctx.createGain(); A.sfxBus.connect(A.master);
        A.voiceBus = A.ctx.createGain(); A.voiceBus.connect(A.master);
        A.applyVolumes();
      } catch (e) { A.ctx = null; }
    }
    if (A.wantBgm) { const w = A.wantBgm; A.wantBgm = null; A.playBgm(w.id, w.opt); }
  };
  A.applyVolumes = function () {
    const g = gains();
    if (A.ctx) {
      A.master.gain.value = 1;
      A.bgmBus.gain.value = g.bgm * A.duck;
      A.sfxBus.gain.value = g.sfx;
      A.voiceBus.gain.value = g.voice;
    }
    if (A.bgm && A.bgm.el) A.bgm.el.volume = Math.min(1, g.bgm * A.bgm.vol * A.duck);
  };
  A.setSettings = function (s) { Object.assign(A.settings, s); A.applyVolumes(); };

  function load(file) {
    if (!A.ctx || !available.has(file)) return Promise.resolve(null);
    if (A.buffers.has(file)) return Promise.resolve(A.buffers.get(file));
    if (A.loading.has(file)) return A.loading.get(file);
    const p = fetch(url(file)).then(r => r.ok ? r.arrayBuffer() : null)
      .then(ab => ab ? new Promise((ok, ko) => A.ctx.decodeAudioData(ab, ok, ko)) : null)
      .then(buf => { if (buf) A.buffers.set(file, buf); A.loading.delete(file); return buf; })
      .catch(() => { A.loading.delete(file); return null; });
    A.loading.set(file, p);
    return p;
  }
  A.preload = function (files) { if (A.ctx) for (const f of files) load(f); };
  A.preloadCore = function () {
    A.preload(Object.values(M.BGM).map(b => b.file).concat(Object.values(M.SFX).map(s => s.file)));
  };

  /* ---------- BGM ---------- */
  A.playBgm = function (id, opt) {
    opt = opt || {};
    if (!A.unlocked) { A.wantBgm = { id, opt }; return; }
    if (A.bgmId === id && A.bgm) return;
    A.stopBgm(opt.fadeOut == null ? 0.6 : opt.fadeOut);
    const def = M.BGM[id]; A.bgmId = id;
    if (!def || !available.has(def.file)) return;
    const token = {}; A.bgmToken = token;
    if (A.ctx) {
      load(def.file).then(buf => {
        if (!buf || A.bgmToken !== token) return;
        const src = A.ctx.createBufferSource(); src.buffer = buf; src.loop = opt.loop !== false;
        const g = A.ctx.createGain(); g.gain.value = 0;
        g.gain.linearRampToValueAtTime(def.vol, A.ctx.currentTime + (opt.fadeIn == null ? 0.8 : opt.fadeIn));
        src.connect(g).connect(A.bgmBus); src.start();
        A.bgm = { src, g, vol: def.vol };
        if (opt.then) src.onended = () => { if (A.bgm && A.bgm.src === src) { A.bgm = null; A.bgmId = null; A.playBgm(opt.then); } };
      });
    } else {
      const el = new Audio(url(def.file)); el.loop = opt.loop !== false;
      el.volume = Math.min(1, gains().bgm * def.vol);
      el.play().catch(() => {});
      A.bgm = { el, vol: def.vol };
      if (opt.then) el.onended = () => { A.bgm = null; A.bgmId = null; A.playBgm(opt.then); };
    }
  };
  A.stopBgm = function (fade) {
    const b = A.bgm; A.bgm = null; A.bgmId = null; A.bgmToken = null;
    if (!b) return;
    if (b.src) {
      const t = A.ctx.currentTime, f = fade == null ? 0.5 : fade;
      b.g.gain.cancelScheduledValues(t); b.g.gain.setValueAtTime(b.g.gain.value, t); b.g.gain.linearRampToValueAtTime(0, t + f);
      b.src.onended = null;
      try { b.src.stop(t + f + 0.05); } catch (e) { /* */ }
    } else if (b.el) {
      const el = b.el, v0 = el.volume, t0 = performance.now(), f = (fade == null ? 0.5 : fade) * 1000;
      const step = () => { const k = Math.min(1, (performance.now() - t0) / Math.max(1, f)); el.volume = v0 * (1 - k); if (k < 1) requestAnimationFrame(step); else el.pause(); };
      step();
    }
  };

  /* ---------- SFX ---------- */
  A.sfx = function (id, opt) {
    if (!A.unlocked) return;
    opt = opt || {};
    const def = M.SFX[id]; if (!def || !available.has(def.file)) return;
    const vol = (opt.vol == null ? 1 : opt.vol) * def.vol;
    if (A.ctx) {
      load(def.file).then(buf => {
        if (!buf) return;
        const src = A.ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = opt.rate || 1;
        const g = A.ctx.createGain(); g.gain.value = vol;
        src.connect(g).connect(A.sfxBus); src.start();
        if (opt.loop) { src.loop = true; opt.handle && opt.handle({ stop: () => { try { src.stop(); } catch (e) { /* */ } } }); }
      });
    } else {
      const el = new Audio(url(def.file)); el.volume = Math.min(1, gains().sfx * vol); el.playbackRate = opt.rate || 1;
      if (opt.loop) { el.loop = true; opt.handle && opt.handle({ stop: () => el.pause() }); }
      el.play().catch(() => {});
    }
  };

  /* ---------- ボイス ---------- */
  A.voiceLang = function () { return A.settings.voiceLang === 'en' ? 'en' : 'ja'; };
  /** who: キャラID または 'announcer'。選んだ言語のファイルが無ければもう一方の言語を使う */
  A.voice = function (who, key, opt) {
    if (!A.unlocked || !A.settings.voiceOn) return false;
    opt = opt || {};
    const lang = A.voiceLang(), other = lang === 'ja' ? 'en' : 'ja';
    let file = M.voiceFile(lang, who, key);
    if (!available.has(file)) file = M.voiceFile(other, who, key);
    if (!available.has(file)) return false;
    const pri = opt.priority || 1;
    if (A.voiceNode && pri < A.voicePri && !opt.force) return false;
    if (A.voiceNode) A.voiceNode.stop();
    A.voicePri = pri;
    const done = () => { A.voiceNode = null; A.voicePri = -1; setDuck(1); };
    setDuck(0.55);
    if (A.ctx) {
      const handle = { stop: () => {} };
      A.voiceNode = handle;
      load(file).then(buf => {
        if (!buf || A.voiceNode !== handle) return;
        const src = A.ctx.createBufferSource(); src.buffer = buf;
        src.connect(A.voiceBus); src.start(A.ctx.currentTime + (opt.delay || 0));
        handle.stop = () => { try { src.stop(); } catch (e) { /* */ } };
        src.onended = () => { if (A.voiceNode === handle) done(); };
      });
    } else {
      const el = new Audio(url(file)); el.volume = Math.min(1, gains().voice);
      const handle = { stop: () => el.pause() };
      A.voiceNode = handle;
      el.onended = () => { if (A.voiceNode === handle) done(); };
      setTimeout(() => el.play().catch(() => {}), (opt.delay || 0) * 1000);
    }
    return true;
  };
  A.preloadVoices = function (whoList, keys) {
    const lang = A.voiceLang(), other = lang === 'ja' ? 'en' : 'ja';
    const files = [];
    for (const who of whoList) for (const k of keys) {
      const f = M.voiceFile(lang, who, k);
      files.push(available.has(f) ? f : M.voiceFile(other, who, k));
    }
    A.preload(files);
  };
  function setDuck(v) {
    A.duck = v;
    if (A.ctx && A.bgmBus) { const t = A.ctx.currentTime; A.bgmBus.gain.cancelScheduledValues(t); A.bgmBus.gain.setTargetAtTime(gains().bgm * v, t, 0.08); }
    else if (A.bgm && A.bgm.el) A.bgm.el.volume = Math.min(1, gains().bgm * A.bgm.vol * v);
  }
  A.suspend = () => { if (A.ctx) A.ctx.suspend(); };
  A.resume = () => { if (A.ctx) A.ctx.resume(); };

  root.Audio2 = A;
  /* 旧コード互換の窓口 */
  root.Sound = {
    sfx: (name, o) => A.sfx(M.ALIAS[name] || (M.SFX[name] ? name : 'sfx_' + name), typeof o === 'object' ? o : undefined),
    voice: (ch, text, key) => A.voice(ch && ch.id ? ch.id : ch, key),
    playBGM: (id, opt) => A.playBgm(id.startsWith('bgm_') ? id : 'bgm_' + id, opt),
    stopBGM: (f) => A.stopBgm(f),
  };
})(typeof window !== 'undefined' ? window : globalThis);
