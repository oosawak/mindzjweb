// 手続き型オーディオエンジン（BGM・SFXを全てWebAudioで生成）
import { G } from './state.js';
import { rand, pick, clamp } from './util.js';

export class AudioEngine {
  constructor() {
    this.ctx = null; this.ready = false; this.voices = 0;
    this.track = null; this.nextStepTime = 0; this.step = 0;
    this.intensity = 0; this.loops = {};
    this.listenerPos = { x: 0, y: 0, z: 0 };
  }
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = this.ctx = new AC();
    this.master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -8; comp.knee.value = 6; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.25;
    this.master.connect(comp); comp.connect(ctx.destination);
    this.music = ctx.createGain(); this.music.connect(this.master);
    this.sfx = ctx.createGain(); this.sfx.connect(this.master);
    this.ui = ctx.createGain(); this.ui.connect(this.master);
    // リバーブ
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.makeIR(2.6, 2.2);
    this.revSend = ctx.createGain(); this.revSend.gain.value = 0.5;
    this.revSend.connect(this.reverb); this.reverb.connect(this.master);
    this.musicRev = ctx.createGain(); this.musicRev.gain.value = 0.6; this.musicRev.connect(this.reverb);
    // ノイズバッファ
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.brown = ctx.createBuffer(1, len, ctx.sampleRate);
    const b = this.brown.getChannelData(0); let last = 0;
    for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; b[i] = last * 3.5; }
    this.distCurve = this.makeDist(40);
    this.hardCurve = this.makeDist(400);
    this.samples = {}; this.active = [];
    this.applyVolumes();
    this.prerender();
    this.ready = true;
    this.sched = setInterval(() => this.schedule(), 25);
  }
  applyVolumes() {
    if (!this.ctx) return;
    const s = G.settings;
    this.master.gain.value = s.master;
    const m = this.mulTarget ?? 1;
    this.music.gain.cancelScheduledValues(this.ctx.currentTime);
    this.music.gain.value = s.music * 0.55 * m;
    this.musicRev.gain.value = s.music * 0.35 * m;
    this.sfx.gain.value = s.sfx;
    this.ui.gain.value = s.sfx * 0.6;
  }
  makeIR(sec, decay) {
    const ctx = this.ctx, len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }
  makeDist(k) {
    const n = 1024, c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; c[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x)); }
    return c;
  }
  get t() { return this.ctx.currentTime; }

  setListener(pos, fwd) {
    if (!this.ready) return;
    const L = this.ctx.listener, t = this.ctx.currentTime;
    this.listenerPos = pos;
    if (L.positionX) {
      L.positionX.setTargetAtTime(pos.x, t, 0.02); L.positionY.setTargetAtTime(pos.y, t, 0.02); L.positionZ.setTargetAtTime(pos.z, t, 0.02);
      L.forwardX.setTargetAtTime(fwd.x, t, 0.02); L.forwardY.setTargetAtTime(fwd.y, t, 0.02); L.forwardZ.setTargetAtTime(fwd.z, t, 0.02);
      L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0;
    } else { L.setPosition(pos.x, pos.y, pos.z); L.setOrientation(fwd.x, fwd.y, fwd.z, 0, 1, 0); }
  }

  // ---- 出力チェーン -------------------------------------------------
  // pos が null なら2D（プレイヤー自身の音）
  out(pos, opts = {}) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = opts.gain ?? 1;
    let node = g;
    let dist = 0;
    if (pos) {
      const lp = this.listenerPos;
      dist = Math.hypot(pos.x - lp.x, pos.y - lp.y, pos.z - lp.z);
      const lpF = ctx.createBiquadFilter();
      lpF.type = 'lowpass';
      lpF.frequency.value = clamp(22000 * Math.exp(-dist / (opts.muffle ?? 90)), 350, 22000);
      const p = ctx.createPanner();
      p.panningModel = dist < 40 ? 'HRTF' : 'equalpower';
      p.distanceModel = opts.model || 'exponential'; p.refDistance = opts.ref ?? 4; p.rolloffFactor = opts.rolloff ?? 1.25; p.maxDistance = 10000;
      if (p.positionX) { p.positionX.value = pos.x; p.positionY.value = pos.y; p.positionZ.value = pos.z; } else p.setPosition(pos.x, pos.y, pos.z);
      g.connect(lpF); lpF.connect(p); p.connect(this.sfx);
      if (opts.rev !== 0) { const rs = ctx.createGain(); rs.gain.value = (opts.rev ?? 0.25) * clamp(0.3 + dist / 60, 0.3, 1.6); lpF.connect(rs); rs.connect(this.revSend); }
    } else {
      g.connect(opts.bus || this.sfx);
      if (opts.rev) { const rs = ctx.createGain(); rs.gain.value = opts.rev; g.connect(rs); rs.connect(this.revSend); }
    }
    return { node, dist };
  }
  noiseSrc(t, dur, rate = 1, brown = false) {
    const s = this.ctx.createBufferSource();
    s.buffer = brown ? this.brown : this.noise; s.playbackRate.value = rate;
    s.start(t, Math.random() * 1.5, dur + 0.1); s.stop(t + dur + 0.05);
    return s;
  }
  env(param, t, a, peak, d, sustainEnd) {
    param.setValueAtTime(0.0001, t);
    param.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
    param.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  filt(type, f, q = 1) { const b = this.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  osc(type, f, t, dur) { const o = this.ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(t); o.stop(t + dur + 0.05); return o; }
  voice(dur) {
    if (this.voices > 48) return false;
    this.voices++; setTimeout(() => this.voices--, dur * 1000 + 100);
    return true;
  }
  // 汎用: ノイズバースト
  burst(dst, t, { dur = 0.1, type = 'bandpass', f = 1000, q = 1, gain = 1, a = 0.002, f2 = null, rate = 1, brown = false }) {
    const n = this.noiseSrc(t, dur, rate, brown);
    const fl = this.filt(type, f, q);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = this.ctx.createGain(); this.env(g.gain, t, a, gain, dur);
    n.connect(fl); fl.connect(g); g.connect(dst);
  }
  tone(dst, t, { type = 'sine', f = 440, f2 = null, dur = 0.2, gain = 0.5, a = 0.003, curve = 'exp' }) {
    const o = this.osc(type, f, t, dur + a);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = this.ctx.createGain(); this.env(g.gain, t, a, gain, dur);
    o.connect(g); g.connect(dst);
    return o;
  }

  // ---- 効果音 -----------------------------------------------------------
  play(name, pos = null, opts = {}) {
    if (!this.ready) return;
    const fn = this['sfx_' + name];
    if (!fn) return;
    let d = 0;
    if (pos) {
      const lp = this.listenerPos;
      d = Math.hypot(pos.x - lp.x, pos.y - lp.y, pos.z - lp.z);
      if (d > (opts.maxDist ?? 320)) return;
    }
    // 事前レンダリング済みサンプルがあれば軽量再生（連射でも音声スレッドが詰まらない）
    const key = this.sampleKey(name, opts);
    const set = key && this.samples[key];
    if (set && set.length) return this.playSample(name, set, pos, opts, d);
    if (!this.voice(1.5)) return;
    fn.call(this, pos, opts, this.ctx.currentTime + (opts.delay || 0));
  }
  // ---- サンプルキャッシュ ----
  sampleKey(name, o) {
    switch (name) {
      case 'gun': return `gun:${o.type}:${o.self ? 1 : 0}`;
      case 'whiz': return `whiz:${o.crack ? 1 : 0}`;
      case 'impact': { const m = o.mat || 'concrete'; return 'impact:' + (m === 'metal' ? 'metal' : m === 'wood' ? 'wood' : ['foliage', 'dirt', 'sand', 'grass', 'water'].includes(m) ? 'soft' : 'hard'); }
      case 'step': return 'step:' + (o.surf || 'dirt');
      case 'whizAway': case 'flesh': case 'hit': case 'headshot': case 'shell': case 'magIn': case 'magOut': case 'dry': return name;
      default: return null;
    }
  }
  async renderSample(fn, opts, dur) {
    const sr = 44100;
    const off = new OfflineAudioContext(1, Math.ceil(sr * dur), sr);
    const saved = { ctx: this.ctx, sfx: this.sfx, ui: this.ui, revSend: this.revSend };
    const bus = off.createGain(); bus.connect(off.destination);
    const sink = off.createGain(); sink.gain.value = 0; sink.connect(off.destination);
    this.ctx = off; this.sfx = bus; this.ui = bus; this.revSend = sink;
    try { fn.call(this, null, opts, 0.004); } finally { Object.assign(this, saved); }
    return off.startRendering();
  }
  async prerender() {
    const jobs = [];
    const add = (key, name, opts, dur, n) => { for (let i = 0; i < n; i++) jobs.push([key, name, opts, dur]); };
    for (const type of ['pistol', 'smg', 'ar', 'lmg', 'shotgun', 'dmr', 'sniper']) {
      const dur = type === 'sniper' || type === 'dmr' || type === 'shotgun' ? 1.1 : 0.7;
      add(`gun:${type}:1`, 'gun', { type, self: true }, dur, 3); add(`gun:${type}:0`, 'gun', { type, self: false }, dur, 3);
    }
    add('whiz:0', 'whiz', {}, 0.3, 3); add('whiz:1', 'whiz', { crack: true }, 0.3, 3); add('whizAway', 'whizAway', {}, 0.35, 3);
    add('flesh', 'flesh', {}, 0.3, 3); add('hit', 'hit', {}, 0.12, 1); add('headshot', 'headshot', {}, 0.5, 1); add('shell', 'shell', {}, 0.2, 3);
    add('magIn', 'magIn', {}, 0.2, 1); add('magOut', 'magOut', {}, 0.25, 1); add('dry', 'dry', {}, 0.08, 1);
    for (const [k, mat] of [['hard', 'concrete'], ['metal', 'metal'], ['wood', 'wood'], ['soft', 'dirt']]) add('impact:' + k, 'impact', { mat }, 0.45, 4);
    for (const surf of ['dirt', 'grass', 'sand', 'concrete', 'wood', 'metal', 'water']) add('step:' + surf, 'step', { surf, vol: 1 }, 0.2, 3);
    for (const [key, name, opts, dur] of jobs) {
      try {
        const buf = await this.renderSample(this['sfx_' + name], opts, dur);
        (this.samples[key] = this.samples[key] || []).push(buf);
      } catch (e) { console.warn('prerender', key, e); }
    }
  }
  playSample(name, set, pos, o, d) {
    const ctx = this.ctx;
    // 同時発音の管理：上限を超えたら優先度の低い古い音を止める
    const prio = name === 'gun' ? (o.self ? 3 : 2) : name === 'whiz' ? 2 : 1;
    this.active = this.active.filter((v) => !v.done);
    if (this.active.length >= 40) {
      let victim = null;
      for (const v of this.active) if (v.prio <= prio && (!victim || v.prio < victim.prio || (v.prio === victim.prio && v.t < victim.t))) victim = v;
      if (!victim) return;
      try { victim.src.stop(); } catch (e) {}
      victim.done = true;
    }
    const P = {
      gun: { gain: (o.vol || 1), ref: 5, rolloff: 1.35, muffle: 65, rev: 0.35 }, whiz: { gain: 1, ref: 2, rolloff: 1, rev: 0.05 },
      whizAway: { gain: o.vol || 1, ref: 3, rolloff: 1, rev: 0.1, model: 'inverse' }, flesh: { gain: o.vol || 1, ref: 3 },
      impact: { gain: 1, ref: 2.5, rev: 0.1 }, step: { gain: (o.vol || 0.5) * (pos ? 1.4 : 1), ref: 2, rolloff: 1.4, rev: 0.05 },
    }[name] || { gain: o.vol || 1 };
    const opts = pos ? P : { ...P, bus: name === 'hit' || name === 'headshot' ? this.ui : this.sfx, rev: name === 'gun' ? 0.18 : 0 };
    const { node } = this.out(pos, opts);
    const src = ctx.createBufferSource();
    src.buffer = set[(Math.random() * set.length) | 0];
    src.playbackRate.value = 0.95 + Math.random() * 0.1;
    src.connect(node);
    const v = { src, prio, t: ctx.currentTime, done: false };
    src.onended = () => { v.done = true; try { node.disconnect(); } catch (e) {} };
    src.start(ctx.currentTime + (o.delay || 0));
    this.active.push(v);
  }
  sfx_gun(pos, o, t) {
    const p = { pistol: [0.14, 1500, 1.0, 110], smg: [0.12, 1900, 0.85, 120], ar: [0.2, 1200, 1.1, 90], lmg: [0.22, 1000, 1.15, 80],
      shotgun: [0.38, 800, 1.5, 65], dmr: [0.35, 1000, 1.3, 70], sniper: [0.6, 800, 1.7, 55] }[o.type] || [0.2, 1200, 1, 90];
    const { node, dist } = this.out(pos, { gain: (o.self ? 0.9 : 1.5) * (o.vol || 1), ref: 5, rolloff: 1.35, muffle: 65, rev: 0.35 });
    const [dur, f, g, thump] = p;
    // 破裂音
    this.burst(node, t, { dur: 0.035, type: 'highpass', f: 2500, gain: g * 0.9 });
    // 本体
    this.burst(node, t, { dur, type: 'lowpass', f: f * 2.2, f2: 180, q: 0.7, gain: g * 1.3 });
    this.burst(node, t, { dur: dur * 0.5, type: 'bandpass', f, q: 0.9, gain: g * 0.8 });
    // 低音の衝撃
    this.tone(node, t, { f: thump * 2.2, f2: thump * 0.5, dur: dur * 0.8, gain: g * (o.self ? 1.1 : 0.7) });
    // 遠距離の残響（エコー）
    if (o.self && (o.type === 'sniper' || o.type === 'dmr')) {
      this.burst(node, t + 0.12, { dur: dur * 2.5, type: 'lowpass', f: 500, f2: 120, gain: g * 0.25, a: 0.03 });
    }
    // 機構音
    if (o.self) this.burst(this.sfx, t + 0.01, { dur: 0.03, type: 'bandpass', f: 4200, q: 3, gain: 0.15 });
  }
  sfx_dry(pos, o, t) { const { node } = this.out(pos, { gain: 0.4 }); this.burst(node, t, { dur: 0.02, type: 'bandpass', f: 3500, q: 4, gain: 0.8 }); }
  sfx_magOut(pos, o, t) {
    const { node } = this.out(pos, { gain: 0.5 });
    this.burst(node, t, { dur: 0.03, type: 'bandpass', f: 2800, q: 5, gain: 0.9 });
    this.burst(node, t + 0.05, { dur: 0.12, type: 'bandpass', f: 900, q: 2, gain: 0.4 });
  }
  sfx_magIn(pos, o, t) {
    const { node } = this.out(pos, { gain: 0.55 });
    this.burst(node, t, { dur: 0.05, type: 'bandpass', f: 1500, q: 3, gain: 0.6 });
    this.burst(node, t + 0.06, { dur: 0.025, type: 'bandpass', f: 3800, q: 6, gain: 1 });
    this.tone(node, t + 0.06, { f: 2900, dur: 0.06, gain: 0.1 });
  }
  sfx_bolt(pos, o, t) {
    const { node } = this.out(pos, { gain: 0.55 });
    this.burst(node, t, { dur: 0.09, type: 'bandpass', f: 1800, f2: 3500, q: 4, gain: 0.7 });
    this.burst(node, t + 0.18, { dur: 0.08, type: 'bandpass', f: 3500, f2: 1600, q: 4, gain: 0.7 });
    this.burst(node, t + 0.27, { dur: 0.02, type: 'highpass', f: 4000, gain: 0.8 });
  }
  sfx_pump(pos, o, t) {
    const { node } = this.out(pos, { gain: 0.7 });
    this.burst(node, t, { dur: 0.08, type: 'bandpass', f: 1200, f2: 700, q: 3, gain: 0.9 });
    this.burst(node, t + 0.17, { dur: 0.07, type: 'bandpass', f: 800, f2: 1600, q: 3, gain: 1 });
    this.burst(node, t + 0.24, { dur: 0.02, type: 'highpass', f: 3000, gain: 0.7 });
  }
  sfx_shell(pos, o, t) {
    const { node } = this.out(pos, { gain: 0.25 });
    this.tone(node, t, { f: rand(3800, 5200), dur: 0.08, gain: 0.3 });
    this.tone(node, t + 0.09, { f: rand(4200, 5600), dur: 0.05, gain: 0.15 });
  }
  sfx_step(pos, o, t) {
    const surf = o.surf || 'dirt';
    const { node } = this.out(pos, { gain: (o.vol || 0.5) * (pos ? 1.4 : 1), ref: 2, rolloff: 1.4, rev: 0.05 });
    const F = { dirt: [700, 0.07], grass: [1600, 0.09], sand: [2200, 0.1], concrete: [1300, 0.045], wood: [500, 0.06], metal: [2600, 0.05], water: [1200, 0.15] }[surf] || [900, 0.06];
    this.burst(node, t, { dur: F[1], type: 'bandpass', f: F[0] * rand(0.8, 1.2), q: 0.8, gain: 0.6 });
    this.burst(node, t, { dur: 0.04, type: 'lowpass', f: 300, gain: 0.5, brown: true });
    if (surf === 'wood') this.tone(node, t, { f: rand(140, 180), dur: 0.08, gain: 0.2 });
    if (surf === 'metal') this.tone(node, t, { f: rand(900, 1300), dur: 0.12, gain: 0.05 });
  }
  sfx_land(pos, o, t) { const { node } = this.out(pos, { gain: 0.8 }); this.burst(node, t, { dur: 0.15, type: 'lowpass', f: 500, gain: 1, brown: true }); this.tone(node, t, { f: 90, f2: 40, dur: 0.15, gain: 0.5 }); }
  sfx_jump(pos, o, t) { const { node } = this.out(pos, { gain: 0.3 }); this.burst(node, t, { dur: 0.1, type: 'bandpass', f: 900, gain: 0.5 }); }
  sfx_hit(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.5 });
    this.tone(node, t, { type: 'triangle', f: 1900, dur: 0.05, gain: 0.35 });
    this.burst(node, t, { dur: 0.02, type: 'highpass', f: 5000, gain: 0.3 });
  }
  sfx_headshot(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.55 });
    this.tone(node, t, { f: 2637, dur: 0.35, gain: 0.3 }); this.tone(node, t, { f: 3950, dur: 0.25, gain: 0.18 }); this.tone(node, t, { f: 5270, dur: 0.12, gain: 0.08 });
  }
  sfx_kill(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.85, rev: 0.25 });
    const k = Math.pow(1.12246, Math.min(6, (o.streak || 1) - 1)); // 連続キルで音程が上がる
    // 重いインパクト
    this.tone(node, t, { f: 150, f2: 42, dur: 0.28, gain: 1.1 });
    this.burst(node, t, { dur: 0.2, type: 'lowpass', f: 900, f2: 120, gain: 0.9, brown: true });
    this.burst(node, t, { dur: 0.025, type: 'highpass', f: 3000, gain: 0.7 });
    // 確認チャイム
    this.tone(node, t + 0.03, { type: 'triangle', f: 1046 * k, dur: 0.14, gain: 0.32 });
    this.tone(node, t + 0.09, { type: 'triangle', f: 1568 * k, dur: 0.32, gain: 0.3 });
    this.tone(node, t + 0.09, { type: 'sine', f: 3136 * k, dur: 0.25, gain: 0.08 });
    if (o.head) { this.tone(node, t + 0.02, { f: 2637, dur: 0.5, gain: 0.25 }); this.tone(node, t + 0.02, { f: 3951, dur: 0.35, gain: 0.14 }); }
  }
  sfx_deathHit(pos, o, t) { // 死亡時：重い衝撃＋耳鳴り
    const { node } = this.out(null, { bus: this.ui, gain: 0.9, rev: 0.7 });
    this.tone(node, t, { f: 70, f2: 25, dur: 1.6, gain: 1.2 });
    this.burst(node, t, { dur: 1.2, type: 'lowpass', f: 600, f2: 60, gain: 0.9, brown: true });
    this.tone(node, t + 0.1, { f: 3520, dur: 3.5, gain: 0.05, a: 0.3 });
    this.tone(node, t + 0.1, { f: 3530, dur: 3.2, gain: 0.03, a: 0.4 });
    this.burst(node, t + 0.05, { dur: 3, type: 'lowpass', f: 180, gain: 0.5, brown: true, a: 0.4 });
  }
  sfx_multikill(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.7, rev: 0.6 });
    const n = Math.min(5, o.streak || 2);
    const base = [0, 0, 523, 587, 659, 784][n];
    [1, 1.25, 1.5, 2].forEach((m, i) => this.tone(node, t + 0.16 + i * 0.06, { type: 'sawtooth', f: base * m, dur: 0.5, gain: 0.05 }));
    this.tone(node, t + 0.16, { f: 60, f2: 35, dur: 0.6, gain: 0.8 });
    this.burst(node, t + 0.16, { dur: 0.6, type: 'lowpass', f: 1200, f2: 100, gain: 0.5, brown: true });
  }
  sfx_armorHit(pos, o, t) { const { node } = this.out(pos, { gain: 0.5 }); this.tone(node, t, { type: 'square', f: 1200, f2: 800, dur: 0.06, gain: 0.08 }); this.burst(node, t, { dur: 0.05, type: 'highpass', f: 3000, gain: 0.5 }); }
  sfx_flesh(pos, o, t) {
    const { node } = this.out(pos, { gain: (o.vol || 1) * 1.0, ref: 3 });
    this.burst(node, t, { dur: 0.12, type: 'lowpass', f: 1400, f2: 180, q: 3, gain: 1.1 });
    this.tone(node, t, { f: 160, f2: 60, dur: 0.1, gain: 0.5 });
  }
  sfx_splat(pos, o, t) { // 過激ゴア音
    const { node } = this.out(pos, { gain: (o.vol || 1) * 1.2, ref: 4 });
    for (let i = 0; i < 4; i++) this.burst(node, t + i * rand(0.02, 0.05), { dur: rand(0.08, 0.18), type: 'bandpass', f: rand(300, 900), f2: rand(90, 200), q: 4, gain: rand(0.5, 1) });
    this.burst(node, t, { dur: 0.3, type: 'lowpass', f: 600, f2: 80, gain: 1, brown: true });
    for (let i = 0; i < 5; i++) this.burst(node, t + rand(0, 0.12), { dur: 0.015, type: 'bandpass', f: rand(1800, 3200), q: 6, gain: 0.6 }); // 骨の砕ける音
  }
  sfx_impact(pos, o, t) {
    const m = o.mat || 'concrete';
    const { node } = this.out(pos, { gain: 0.55, ref: 2.5, rev: 0.1 });
    if (m === 'metal') { this.tone(node, t, { f: rand(1800, 3200), dur: 0.25, gain: 0.12 }); this.burst(node, t, { dur: 0.04, type: 'highpass', f: 3000, gain: 0.6 }); }
    else if (m === 'wood') { this.burst(node, t, { dur: 0.08, type: 'bandpass', f: 700, q: 2, gain: 0.8 }); }
    else if (m === 'foliage' || m === 'dirt' || m === 'sand' || m === 'grass') { this.burst(node, t, { dur: 0.1, type: 'lowpass', f: 1200, gain: 0.5 }); }
    else { this.burst(node, t, { dur: 0.05, type: 'bandpass', f: 2200, q: 1, gain: 0.8 }); }
    if (Math.random() < 0.18 && m !== 'foliage') this.sfx_ricochet(pos, o, t + 0.02);
  }
  sfx_ricochet(pos, o, t) {
    const { node } = this.out(pos, { gain: 0.25 });
    const osc = this.tone(node, t, { f: rand(2600, 4000), f2: rand(900, 1400), dur: rand(0.2, 0.35), gain: 0.2 });
  }
  sfx_whiz(pos, o, t) {
    const { node } = this.out(pos, { gain: 1.1, ref: 2, rolloff: 1, rev: 0.05 });
    if (o.crack) this.burst(node, t, { dur: 0.018, type: 'highpass', f: 3500, gain: 1.4 }); // 超音速のクラック
    this.burst(node, t, { dur: 0.16, type: 'bandpass', f: rand(4200, 5200), f2: rand(900, 1400), q: 6, gain: 1.2, a: 0.02 });
    this.tone(node, t, { type: 'sawtooth', f: rand(2600, 3400), f2: rand(500, 800), dur: 0.16, gain: 0.05, a: 0.015 });
  }
  sfx_whizAway(pos, o, t) { // 自分の撃った弾が飛んでいく音
    const { node } = this.out(pos, { gain: 0.55 * (o.vol || 1), ref: 3, rolloff: 1, rev: 0.1, model: 'inverse' });
    this.burst(node, t, { dur: 0.22, type: 'bandpass', f: rand(3800, 4600), f2: rand(700, 1000), q: 5, gain: 1, a: 0.01 });
    this.tone(node, t, { f: rand(2400, 3000), f2: rand(400, 600), dur: 0.2, gain: 0.05, a: 0.01 });
  }
  sfx_explosion(pos, o, t) {
    const { node, dist } = this.out(pos, { gain: 2.4, ref: 9, rolloff: 1.15, muffle: 120, rev: 0.6 });
    this.burst(node, t, { dur: 1.8, type: 'lowpass', f: 2500, f2: 60, gain: 1.6, a: 0.005 });
    this.burst(node, t, { dur: 2.5, type: 'lowpass', f: 400, f2: 40, gain: 1.4, brown: true });
    this.tone(node, t, { f: 90, f2: 22, dur: 1.2, gain: 1.2 });
    for (let i = 0; i < 12; i++) this.burst(node, t + 0.1 + rand(0, 0.9), { dur: 0.03, type: 'highpass', f: 2500, gain: rand(0.1, 0.35) });
  }
  sfx_pin(pos, o, t) { const { node } = this.out(pos, { gain: 0.5 }); this.tone(node, t, { f: 3200, dur: 0.1, gain: 0.2 }); this.burst(node, t + 0.08, { dur: 0.05, type: 'bandpass', f: 2000, q: 3, gain: 0.5 }); }
  sfx_throw(pos, o, t) { const { node } = this.out(pos, { gain: 0.5 }); this.burst(node, t, { dur: 0.25, type: 'bandpass', f: 500, f2: 1800, q: 1.5, gain: 0.6, a: 0.05 }); }
  sfx_clink(pos, o, t) { const { node } = this.out(pos, { gain: 0.4 }); this.tone(node, t, { f: rand(1400, 2000), dur: 0.12, gain: 0.25 }); this.burst(node, t, { dur: 0.04, type: 'bandpass', f: 1000, gain: 0.5 }); }
  sfx_pickup(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.5 });
    this.burst(node, t, { dur: 0.12, type: 'bandpass', f: 1200, q: 1, gain: 0.5 });
    this.tone(node, t + 0.02, { type: 'triangle', f: 660, f2: 990, dur: 0.1, gain: 0.2 });
  }
  sfx_heal(pos, o, t) {
    const { node } = this.out(null, { gain: 0.5 });
    for (let i = 0; i < 6; i++) this.burst(node, t + i * 0.18, { dur: 0.14, type: 'bandpass', f: rand(1500, 3000), q: 1, gain: 0.35 });
  }
  sfx_healDone(pos, o, t) { const { node } = this.out(null, { bus: this.ui, gain: 0.4 }); this.tone(node, t, { type: 'triangle', f: 523, dur: 0.15, gain: 0.3 }); this.tone(node, t + 0.1, { type: 'triangle', f: 784, dur: 0.3, gain: 0.3 }); }
  sfx_armorEquip(pos, o, t) { const { node } = this.out(null, { gain: 0.6 }); this.burst(node, t, { dur: 0.2, type: 'bandpass', f: 600, gain: 0.8 }); this.burst(node, t + 0.15, { dur: 0.05, type: 'highpass', f: 2500, gain: 0.5 }); }
  sfx_hurt(pos, o, t) {
    const { node } = this.out(null, { gain: 0.6 });
    this.burst(node, t, { dur: 0.1, type: 'lowpass', f: 600, gain: 1, brown: true });
    const o1 = this.osc('sawtooth', rand(120, 150), t, 0.22);
    o1.frequency.exponentialRampToValueAtTime(90, t + 0.2);
    const f1 = this.filt('bandpass', 700, 5), f2 = this.filt('bandpass', 1200, 6);
    const g = this.ctx.createGain(); this.env(g.gain, t, 0.01, 0.25, 0.2);
    o1.connect(f1); o1.connect(f2); f1.connect(g); f2.connect(g); g.connect(node);
  }
  sfx_death(pos, o, t) {
    const { node } = this.out(pos, { gain: 0.8 });
    const o1 = this.osc('sawtooth', rand(170, 200), t, 0.6);
    o1.frequency.exponentialRampToValueAtTime(70, t + 0.55);
    const f1 = this.filt('bandpass', 800, 4);
    const g = this.ctx.createGain(); this.env(g.gain, t, 0.02, 0.3, 0.55);
    o1.connect(f1); f1.connect(g); g.connect(node);
  }
  sfx_heartbeat(pos, o, t) {
    const { node } = this.out(null, { gain: o.vol || 0.8 });
    this.tone(node, t, { f: 60, f2: 40, dur: 0.12, gain: 0.9 }); this.tone(node, t + 0.22, { f: 55, f2: 38, dur: 0.14, gain: 0.7 });
  }
  // モンスター
  monsterVoice(node, t, { base = 80, dur = 1.2, formants = [500, 1100], dist = 0.5, gain = 0.7, sweep = 1, noise = 0.4, wob = 12 }) {
    const ctx = this.ctx;
    const o1 = this.osc('sawtooth', base, t, dur), o2 = this.osc('square', base * 1.013, t, dur);
    o1.frequency.setValueAtTime(base, t);
    o1.frequency.linearRampToValueAtTime(base * sweep, t + dur * 0.4);
    o1.frequency.linearRampToValueAtTime(base * 0.7, t + dur);
    o2.frequency.setValueAtTime(base * 1.01, t);
    o2.frequency.linearRampToValueAtTime(base * sweep * 1.02, t + dur * 0.4);
    const lfo = this.osc('sine', wob, t, dur); const lg = ctx.createGain(); lg.gain.value = base * 0.25; lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency);
    const ws = ctx.createWaveShaper(); ws.curve = this.hardCurve;
    const mix = ctx.createGain(); mix.gain.value = 0.5;
    o1.connect(mix); o2.connect(mix);
    const nsrc = this.noiseSrc(t, dur); const ng = ctx.createGain(); ng.gain.value = noise; nsrc.connect(ng); ng.connect(mix);
    mix.connect(ws);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.08); g.gain.setValueAtTime(gain, t + dur * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const f of formants) { const bp = this.filt('bandpass', f, 6); ws.connect(bp); bp.connect(g); }
    const lp = this.filt('lowpass', 400); ws.connect(lp); lp.connect(g);
    g.connect(node);
  }
  sfx_growl(pos, o, t) { const { node } = this.out(pos, { gain: 1.3, ref: 5, rev: 0.4 }); this.monsterVoice(node, t, { base: rand(55, 85), dur: rand(0.8, 1.6), formants: [rand(350, 600), rand(900, 1400)], sweep: rand(0.8, 1.3), wob: rand(7, 16) }); }
  sfx_shriek(pos, o, t) { const { node } = this.out(pos, { gain: 1.2, ref: 6, rev: 0.6 }); this.monsterVoice(node, t, { base: rand(280, 380), dur: rand(0.7, 1.1), formants: [rand(1200, 1800), rand(2500, 3200)], sweep: rand(1.6, 2.2), wob: rand(20, 35), noise: 0.8 }); }
  sfx_roar(pos, o, t) {
    const { node } = this.out(pos, { gain: 2.2, ref: 12, rolloff: 0.7, rev: 0.8, muffle: 200 });
    this.monsterVoice(node, t, { base: rand(38, 48), dur: 2.4, formants: [300, 700, 1300], sweep: 1.5, wob: 5, noise: 0.7, gain: 0.9 });
    this.burst(node, t, { dur: 2.2, type: 'lowpass', f: 300, gain: 0.8, brown: true, a: 0.2 });
  }
  // ---- 怪物の声（リングモジュレーション・声帯のガラガラ・フォルマント） ----
  jitterCurve(base, n, amt, shape) {
    const c = new Float32Array(n); let v = 0;
    for (let i = 0; i < n; i++) { v += (Math.random() - 0.5) * amt; v *= 0.85; const sh = shape ? shape(i / (n - 1)) : 1; c[i] = Math.max(10, base * sh * (1 + v)); }
    return c;
  }
  vox(dst, t, { f0, dur, shape, jit = 0.25, ring = 40, ringMix = 0.5, fry = 30, fryDepth = 0.6, formants = [450, 1100, 2500], q = 6, noise = 0.3, gain = 0.8, a = 0.06, dist = true, types = ['sawtooth', 'sawtooth'], ratios = [1, 1.49] }) {
    const ctx = this.ctx;
    const mix = ctx.createGain(); mix.gain.value = 0.4;
    types.forEach((ty, i) => {
      const o = this.osc(ty, f0 * ratios[i], t, dur + 0.1);
      o.frequency.setValueCurveAtTime(this.jitterCurve(f0 * ratios[i], 48, jit, shape), t, dur);
      o.connect(mix);
    });
    if (noise > 0) { const n = this.noiseSrc(t, dur); const ng = ctx.createGain(); ng.gain.value = noise; n.connect(ng); ng.connect(mix); }
    // リングモジュレーション（非人間的な金属質）
    const rm = ctx.createGain(); rm.gain.value = 0; const ro = this.osc('sine', ring, t, dur + 0.1); ro.connect(rm.gain); mix.connect(rm);
    const dry = ctx.createGain(); dry.gain.value = 1 - ringMix; mix.connect(dry);
    const wet = ctx.createGain(); wet.gain.value = ringMix * 1.6; rm.connect(wet);
    const pre = ctx.createGain(); dry.connect(pre); wet.connect(pre);
    let src = pre;
    if (dist) { const ws = ctx.createWaveShaper(); ws.curve = this.hardCurve; pre.connect(ws); src = ws; }
    // 声帯のガラガラ（不規則なAM）
    const am = ctx.createGain(); am.gain.value = 1 - fryDepth * 0.5;
    const lfo = this.osc('square', fry, t, dur + 0.1); lfo.frequency.setValueCurveAtTime(this.jitterCurve(fry, 24, 0.6), t, dur);
    const lg = ctx.createGain(); lg.gain.value = fryDepth * 0.5; lfo.connect(lg); lg.connect(am.gain);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(gain, t + a);
    env.gain.setValueAtTime(gain, t + dur * 0.65); env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const f of formants) { const bp = this.filt('bandpass', f * (0.9 + Math.random() * 0.2), q); src.connect(bp); bp.connect(am); }
    const lp = this.filt('lowpass', 500); src.connect(lp); const lpg = ctx.createGain(); lpg.gain.value = 0.5; lp.connect(lpg); lpg.connect(am);
    am.connect(env); env.connect(dst);
  }
  bubbles(dst, t, dur, n = 10, lo = 160, hi = 480, g = 0.5) {
    for (let i = 0; i < n; i++) this.burst(dst, t + Math.random() * dur, { dur: rand(0.03, 0.08), type: 'bandpass', f: rand(lo, hi), f2: rand(lo * 0.6, lo), q: 9, gain: rand(g * 0.5, g) });
  }
  sfx_mgrowl(pos, o, t) {
    const big = o.big || 0;
    const dur = o.short ? rand(0.45, 0.75) : rand(1.0, 1.9);
    const { node } = this.out(pos, { gain: 1.5 + big * 0.5, ref: 5 + big * 3, rolloff: 1.1, rev: 0.45 });
    this.vox(node, t, { f0: rand(62, 92) / (1 + big * 0.55), dur, jit: 0.35, ring: rand(28, 55), ringMix: 0.45, fry: rand(22, 38), fryDepth: 0.8, formants: [rand(350, 520), rand(850, 1250), 2300], q: 5, noise: 0.45, gain: 0.9, shape: (x) => 0.9 + Math.sin(x * Math.PI) * 0.25 });
    this.bubbles(node, t, dur, 9, 150, 420, 0.45);
  }
  sfx_mscream(pos, o, t) {
    const dur = o.short ? rand(0.45, 0.7) : rand(0.85, 1.35);
    const { node } = this.out(pos, { gain: 1.4, ref: 7, rolloff: 1.0, rev: 0.75 });
    // 吸い込み（前兆）
    this.burst(node, t, { dur: 0.3, type: 'bandpass', f: 900, f2: 2600, q: 2, gain: 0.35, a: 0.28 });
    const t2 = t + 0.28;
    const f0 = rand(480, 720);
    this.vox(node, t2, { f0, dur, jit: 0.18, ring: rand(85, 170), ringMix: 0.55, fry: rand(55, 80), fryDepth: 0.35, formants: [rand(950, 1250), rand(2400, 2900), 3800], q: 4, noise: 0.35, gain: 0.95, a: 0.03, types: ['sawtooth', 'sawtooth', 'square'], ratios: [1, 1.07, 1.52], shape: (x) => (x < 0.2 ? 1 + x * 2.2 : 1.44 - (x - 0.2) * 0.9) });
    this.burst(node, t2, { dur, type: 'highpass', f: 3200, gain: 0.35, a: 0.04 });
  }
  sfx_mbreath(pos, o, t) {
    const { node } = this.out(pos, { gain: 1.2, ref: 3, rolloff: 1.3, rev: 0.3 });
    this.burst(node, t, { dur: 0.9, type: 'bandpass', f: 800, f2: 1500, q: 3, gain: 0.5, a: 0.6 });
    this.vox(node, t + 1.05, { f0: rand(55, 75), dur: 1.1, jit: 0.3, ring: 33, ringMix: 0.3, fry: 28, fryDepth: 0.9, formants: [500, 1200], q: 4, noise: 0.9, gain: 0.55, dist: false, shape: (x) => 1 - x * 0.3 });
    this.bubbles(node, t + 1.05, 1.0, 6, 180, 380, 0.3);
  }
  sfx_mclick(pos, o, t) {
    const { node } = this.out(pos, { gain: 1.3, ref: 4, rolloff: 1.2, rev: 0.3 });
    let tt = t; const n = Math.floor(rand(10, 20));
    for (let i = 0; i < n; i++) {
      this.burst(node, tt, { dur: 0.012, type: 'bandpass', f: rand(1800, 4200), q: 9, gain: rand(0.6, 1.1) });
      if (Math.random() < 0.3) this.tone(node, tt, { f: rand(2500, 4000), f2: rand(900, 1500), dur: 0.03, gain: 0.05 });
      tt += rand(0.02, 0.07) * (1 - i / n * 0.6);
    }
    if (!o.short && Math.random() < 0.5) this.vox(node, tt, { f0: rand(300, 420), dur: 0.5, jit: 0.4, ring: 140, ringMix: 0.6, fry: 60, formants: [1200, 2800], q: 5, noise: 0.3, gain: 0.5 });
  }
  sfx_mroar(pos, o, t) {
    const big = o.big || 1;
    const dur = o.short ? 1.1 : rand(2.0, 2.8);
    const { node } = this.out(pos, { gain: 2.4 + big * 0.4, ref: 10 + big * 4, rolloff: 0.9, rev: 0.9, muffle: 160 });
    this.vox(node, t, { f0: rand(40, 55) / (big > 1 ? 1.35 : 1), dur, jit: 0.22, ring: rand(19, 29), ringMix: 0.4, fry: rand(16, 26), fryDepth: 0.7, formants: [rand(260, 340), rand(600, 760), 1300], q: 4, noise: 0.6, gain: 1.0, a: 0.15, types: ['sawtooth', 'square', 'sawtooth'], ratios: [1, 0.5, 1.51], shape: (x) => 0.8 + Math.sin(Math.min(1, x * 1.6) * Math.PI * 0.5) * 0.45 - x * 0.25 });
    this.burst(node, t, { dur: dur * 0.9, type: 'lowpass', f: 320, gain: 0.9, brown: true, a: 0.2 });
    this.tone(node, t, { f: 55, f2: 30, dur: dur * 0.7, gain: 0.6, a: 0.2 });
  }
  sfx_mgurgle(pos, o, t) {
    const { node } = this.out(pos, { gain: 1.3, ref: 4, rolloff: 1.2, rev: 0.5 });
    this.bubbles(node, t, 1.3, 16, 140, 520, 0.6);
    this.vox(node, t + 0.1, { f0: rand(80, 110), dur: 1.2, jit: 0.4, ring: 45, ringMix: 0.35, fry: 30, fryDepth: 0.9, formants: [420, 900], q: 5, noise: 0.5, gain: 0.55, shape: (x) => 1.1 - x * 0.4 });
  }
  sfx_mdeath(pos, o, t) {
    const big = o.big || 0;
    const { node } = this.out(pos, { gain: 1.5 + big * 0.5, ref: 6 + big * 4, rolloff: 1.0, rev: 0.7 });
    if (big) this.vox(node, t, { f0: rand(45, 60) / big, dur: 2.2, jit: 0.3, ring: 22, ringMix: 0.4, fry: 20, fryDepth: 0.8, formants: [300, 700], q: 4, noise: 0.6, gain: 1.0, types: ['sawtooth', 'square'], ratios: [1, 0.5], shape: (x) => 1.2 - x * 0.7 });
    else this.vox(node, t, { f0: rand(420, 600), dur: 1.2, jit: 0.25, ring: rand(90, 150), ringMix: 0.5, fry: 50, fryDepth: 0.5, formants: [1000, 2500], q: 4, noise: 0.4, gain: 0.9, a: 0.02, shape: (x) => 1.2 - x * 0.85 });
    this.bubbles(node, t + 0.5, 1.2, 10, 120, 380, 0.5);
  }
  sfx_swipe(pos, o, t) { const { node } = this.out(pos, { gain: 0.8 }); this.burst(node, t, { dur: 0.2, type: 'bandpass', f: 400, f2: 2000, q: 2, gain: 0.9, a: 0.04 }); }
  sfx_slam(pos, o, t) { const { node } = this.out(pos, { gain: 1.6, ref: 8, rev: 0.5 }); this.burst(node, t, { dur: 0.5, type: 'lowpass', f: 300, f2: 50, gain: 1.4, brown: true }); this.tone(node, t, { f: 70, f2: 30, dur: 0.4, gain: 1 }); }
  sfx_monsterStep(pos, o, t) { const { node } = this.out(pos, { gain: o.vol || 0.6, ref: 3 }); this.burst(node, t, { dur: 0.12, type: 'lowpass', f: 250, gain: 1, brown: true }); }
  // UI
  sfx_uiHover() { const t = this.ctx.currentTime; const { node } = this.out(null, { bus: this.ui, gain: 0.25 }); this.tone(node, t, { type: 'triangle', f: 1400, dur: 0.04, gain: 0.3 }); }
  sfx_uiClick() { const t = this.ctx.currentTime; const { node } = this.out(null, { bus: this.ui, gain: 0.45 }); this.tone(node, t, { type: 'triangle', f: 700, f2: 1100, dur: 0.08, gain: 0.4 }); this.burst(node, t, { dur: 0.05, type: 'highpass', f: 4000, gain: 0.2 }); }
  sfx_alarm(pos, o, t) { const { node } = this.out(null, { bus: this.ui, gain: 0.35, rev: 0.3 }); for (let i = 0; i < 3; i++) this.tone(node, t + i * 0.35, { type: 'square', f: i % 2 ? 660 : 880, dur: 0.25, gain: 0.15 }); }
  sfx_wave(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.9, rev: 0.8 });
    this.tone(node, t, { type: 'sawtooth', f: 55, dur: 2.5, gain: 0.5, a: 0.05 }); this.tone(node, t, { type: 'sawtooth', f: 55 * 1.5 * 1.006, dur: 2.5, gain: 0.3, a: 0.05 });
    this.burst(node, t, { dur: 2, type: 'lowpass', f: 800, f2: 60, gain: 0.8, brown: true });
  }
  sfx_victory(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.6, rev: 0.8 });
    [523, 659, 784, 1047].forEach((f, i) => this.tone(node, t + i * 0.12, { type: 'triangle', f, dur: 1.4 - i * 0.1, gain: 0.25 }));
  }
  sfx_defeat(pos, o, t) {
    const { node } = this.out(null, { bus: this.ui, gain: 0.6, rev: 0.8 });
    [392, 311, 262, 196].forEach((f, i) => this.tone(node, t + i * 0.25, { type: 'sawtooth', f, dur: 1.2, gain: 0.08 }));
  }
  sfx_supply(pos, o, t) { const { node } = this.out(null, { bus: this.ui, gain: 0.5 }); this.tone(node, t, { f: 1046, dur: 0.2, gain: 0.3 }); this.tone(node, t + 0.15, { f: 1318, dur: 0.3, gain: 0.3 }); }
  sfx_target(pos, o, t) { const { node } = this.out(pos, { gain: 0.9, ref: 10, rolloff: 0.5 }); this.tone(node, t, { f: rand(1500, 1700), dur: 0.6, gain: 0.35 }); this.tone(node, t, { f: rand(2400, 2600), dur: 0.35, gain: 0.15 }); }
  sfx_scream(pos, o, t) { this.sfx_shriek(pos, o, t); }
  sfx_flashlight(pos, o, t) { const { node } = this.out(null, { gain: 0.3 }); this.burst(node, t, { dur: 0.02, type: 'bandpass', f: 3000, q: 4, gain: 0.9 }); }
  sfx_chute(pos, o, t) { const { node } = this.out(null, { gain: 0.9 }); this.burst(node, t, { dur: 0.6, type: 'bandpass', f: 400, f2: 150, q: 1, gain: 1, a: 0.02 }); }

  // ---- ループ環境音 -------------------------------------------------------
  loop(name, on, gainV = 0.3) {
    if (!this.ready) return;
    const L = this.loops[name];
    if (on && !L) {
      const ctx = this.ctx, g = ctx.createGain(); g.gain.value = 0;
      const nodes = [];
      if (name === 'wind' || name === 'freefall' || name === 'rain') {
        const s = ctx.createBufferSource(); s.buffer = name === 'wind' ? this.brown : this.noise; s.loop = true; s.start();
        const f = this.filt(name === 'rain' ? 'highpass' : 'bandpass', name === 'rain' ? 1500 : name === 'freefall' ? 700 : 400, 0.6);
        s.connect(f); f.connect(g); nodes.push(s);
        if (name === 'wind') { const l = this.osc('sine', 0.13, ctx.currentTime, 99999); const lg = ctx.createGain(); lg.gain.value = 200; l.connect(lg); lg.connect(f.frequency); nodes.push(l); }
      } else if (name === 'plane') {
        for (const fr of [42, 42.7, 84.3]) { const o = this.osc('sawtooth', fr, ctx.currentTime, 99999); const f = this.filt('lowpass', 300); o.connect(f); f.connect(g); nodes.push(o); }
      } else if (name === 'drone') { // ホラー環境音
        for (const fr of [36.7, 55.2, 73.1, 110.8]) { const o = this.osc('sawtooth', fr, ctx.currentTime, 99999); const f = this.filt('lowpass', 180); o.connect(f); f.connect(g); nodes.push(o); }
      } else if (name === 'zone') {
        const o = this.osc('sawtooth', 58, ctx.currentTime, 99999); const o2 = this.osc('sine', 3.5, ctx.currentTime, 99999);
        const f = this.filt('bandpass', 400, 2); const lg = ctx.createGain(); lg.gain.value = 300; o2.connect(lg); lg.connect(f.frequency);
        const s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true; s.start(); s.connect(f);
        o.connect(f); f.connect(g); nodes.push(o, o2, s);
      }
      g.connect(this.sfx);
      g.gain.setTargetAtTime(gainV, ctx.currentTime, 0.5);
      this.loops[name] = { g, nodes };
    } else if (L) {
      if (on) L.g.gain.setTargetAtTime(gainV, this.ctx.currentTime, 0.3);
      else {
        L.g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
        const nodes = L.nodes; delete this.loops[name];
        setTimeout(() => nodes.forEach((n) => { try { n.stop(); } catch (e) {} }), 1500);
      }
    }
  }
  stopAllLoops() { for (const k of Object.keys(this.loops)) this.loop(k, false); }

  // ---- 音楽シーケンサー ---------------------------------------------------
  // force=true: 設定に関わらず鳴らす（タイトル・降下前・勝利）
  setMusic(name, force = false) {
    this.forced = force;
    const mul = force || G.settings.bgm ? 1 : 0;
    if (!this.ready) { this.pendingTrack = name; this.pendingForce = force; return; }
    const same = this.track && this.track.name === name;
    if (!same) { const T = TRACKS[name]; this.track = T ? { name, ...T } : null; this.step = 0; this.nextStepTime = this.ctx.currentTime + 0.1; }
    const t = this.ctx.currentTime, g = this.music.gain, r = this.musicRev.gain, v = G.settings.music;
    this.mulTarget = mul; this.mulFadeEnd = t + 1.5;
    g.cancelScheduledValues(t); r.cancelScheduledValues(t);
    if (!same) g.setValueAtTime(0.0001, t); else g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(v * 0.55 * mul + 0.0001, t + 1.5);
    r.setValueAtTime(r.value, t); r.linearRampToValueAtTime(v * 0.35 * mul + 0.0001, t + 1.5);
  }
  // 音楽を徐々に変化（降下後のフェードアウト等）
  fadeMusic(mul, sec) {
    if (!this.ready) return;
    const t = this.ctx.currentTime, g = this.music.gain, r = this.musicRev.gain, v = G.settings.music;
    this.mulTarget = mul; this.mulFadeEnd = t + sec;
    g.cancelScheduledValues(t); r.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(v * 0.55 * mul + 0.0001, t + sec);
    r.setValueAtTime(r.value, t); r.linearRampToValueAtTime(v * 0.35 * mul + 0.0001, t + sec);
  }
  schedule() {
    if (!this.track || !this.ctx) return;
    if (this.mulTarget === 0 && this.ctx.currentTime > (this.mulFadeEnd || 0)) { this.nextStepTime = this.ctx.currentTime + 0.1; return; }
    const spb = 60 / this.track.bpm / 4;
    while (this.nextStepTime < this.ctx.currentTime + 0.15) {
      try { this.track.step(this, this.step, this.nextStepTime, spb); } catch (e) { console.warn(e); }
      this.step++; this.nextStepTime += spb;
    }
  }
  // 楽器
  mOut(gain = 1, rev = 0.5) { const g = this.ctx.createGain(); g.gain.value = gain; g.connect(this.music); const r = this.ctx.createGain(); r.gain.value = rev; g.connect(r); r.connect(this.musicRev); return g; }
  pad(t, freqs, dur, gain = 0.08, cutoff = 900, type = 'sawtooth') {
    const out = this.mOut(1, 0.8);
    const f = this.filt('lowpass', cutoff, 0.7);
    f.frequency.setValueAtTime(cutoff * 0.5, t); f.frequency.linearRampToValueAtTime(cutoff, t + dur * 0.5); f.frequency.linearRampToValueAtTime(cutoff * 0.6, t + dur);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + dur * 0.3); g.gain.linearRampToValueAtTime(gain * 0.8, t + dur * 0.8); g.gain.linearRampToValueAtTime(0.0001, t + dur * 1.05);
    for (const fr of freqs) for (const det of [-7, 6]) { const o = this.osc(type, fr, t, dur * 1.1); o.detune.value = det + rand(-2, 2); o.connect(f); }
    f.connect(g); g.connect(out);
  }
  bass(t, f, dur, gain = 0.25, cutoff = 500) {
    const out = this.mOut(1, 0.05);
    const o = this.osc('sawtooth', f, t, dur), s = this.osc('sine', f / 2, t, dur);
    const fl = this.filt('lowpass', cutoff, 4); fl.frequency.setValueAtTime(cutoff * 2.5, t); fl.frequency.exponentialRampToValueAtTime(cutoff * 0.4, t + dur);
    const g = this.ctx.createGain(); this.env(g.gain, t, 0.005, gain, dur);
    o.connect(fl); s.connect(g); fl.connect(g); g.connect(out);
  }
  kick(t, gain = 0.9) { const out = this.mOut(1, 0.05); this.tone(out, t, { f: 160, f2: 38, dur: 0.35, gain }); this.burst(out, t, { dur: 0.01, type: 'highpass', f: 3000, gain: 0.2 }); }
  snare(t, gain = 0.45) { const out = this.mOut(1, 0.35); this.burst(out, t, { dur: 0.18, type: 'bandpass', f: 1800, q: 0.7, gain }); this.tone(out, t, { f: 210, f2: 150, dur: 0.1, gain: gain * 0.6, type: 'triangle' }); }
  hat(t, open = false, gain = 0.12) { const out = this.mOut(1, 0.1); this.burst(out, t, { dur: open ? 0.25 : 0.04, type: 'highpass', f: 8000, gain }); }
  pluck(t, f, gain = 0.1, dur = 0.3, type = 'sawtooth', cutoff = 2500) {
    const out = this.mOut(1, 0.6);
    const o = this.osc(type, f, t, dur); const fl = this.filt('lowpass', cutoff, 3); fl.frequency.setValueAtTime(cutoff, t); fl.frequency.exponentialRampToValueAtTime(200, t + dur);
    const g = this.ctx.createGain(); this.env(g.gain, t, 0.003, gain, dur);
    o.connect(fl); fl.connect(g); g.connect(out);
  }
  braam(t, f, dur = 3, gain = 0.2) {
    const out = this.mOut(1, 1);
    const fl = this.filt('lowpass', 150, 2); fl.frequency.setValueAtTime(120, t); fl.frequency.exponentialRampToValueAtTime(1400, t + 0.4); fl.frequency.exponentialRampToValueAtTime(200, t + dur);
    const ws = this.ctx.createWaveShaper(); ws.curve = this.distCurve;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const m of [0.5, 1, 1.5, 2]) for (const d of [-10, 10]) { const o = this.osc('sawtooth', f * m, t, dur); o.detune.value = d; o.connect(ws); }
    ws.connect(fl); fl.connect(g); g.connect(out);
  }
  metalHit(t, gain = 0.1) { // 不協和の金属音（ホラー）
    const out = this.mOut(1, 1.2);
    const base = rand(180, 400);
    for (const r of [1, 2.76, 5.4, 8.93]) this.tone(out, t, { f: base * r, dur: rand(1.5, 3), gain: gain / r });
  }
  swell(t, f, dur, gain = 0.1) { // 逆再生風スウェル
    const out = this.mOut(1, 1);
    const o = this.osc('sawtooth', f, t, dur), o2 = this.osc('sawtooth', f * 1.06, t, dur);
    const fl = this.filt('lowpass', 200); fl.frequency.setValueAtTime(200, t); fl.frequency.exponentialRampToValueAtTime(3000, t + dur);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.97); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(fl); o2.connect(fl); fl.connect(g); g.connect(out);
  }
}

const N = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDIノート→Hz

const TRACKS = {
  // メニュー: 重厚なシネマティック
  menu: {
    bpm: 72,
    step(a, s, t, spb) {
      const bar = Math.floor(s / 16), st = s % 16;
      const prog = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]]; // Dm Bb Gm A
      const ch = prog[bar % 4];
      if (st === 0) { a.pad(t, ch.map((n) => N(n)), spb * 16, 0.05, 1000); a.bass(t, N(ch[0] - 12), spb * 14, 0.2, 200); }
      if (st === 0 && bar % 4 === 0) a.braam(t, N(26), 4, 0.12);
      if (bar >= 2 && st % 2 === 0) { const arp = [0, 1, 2, 1, 0, 2, 1, 2]; a.pluck(t, N(ch[arp[(st / 2) % 8]] + 12), 0.035, 0.4, 'triangle', 3000); }
      if (bar >= 4 && (st === 0 || st === 10)) a.kick(t, 0.5);
      if (bar >= 4 && st === 8) a.snare(t, 0.2);
      if (st === 12 && bar % 2 === 1) a.metalHit(t, 0.03);
    },
  },
  // 戦闘: 緊張感のあるドライブ。intensityで層を追加
  battle: {
    bpm: 124,
    step(a, s, t, spb) {
      const bar = Math.floor(s / 16), st = s % 16;
      const I = a.intensity;
      const prog = [[40, 43, 47], [36, 40, 43], [43, 47, 50], [38, 42, 45]]; // Em C G D
      const ch = prog[Math.floor(bar / 2) % 4];
      if (st === 0 && bar % 2 === 0) a.pad(t, ch.map((n) => N(n + 12)), spb * 32, 0.035 + I * 0.02, 700 + I * 900);
      // ベースオスティナート
      const bp = [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1];
      if (bp[st]) a.bass(t, N(ch[0] - 12 + (st === 14 ? 7 : 0)), spb * 0.9, 0.14 + I * 0.08, 300 + I * 500);
      if (I > 0.25) { if (st % 4 === 0) a.kick(t, 0.7); if (st === 4 || st === 12) a.snare(t, 0.35); }
      else if (st === 0 || st === 8) a.kick(t, 0.45);
      if (st % 2 === 0) a.hat(t, st === 14, 0.05 + I * 0.06);
      if (I > 0.6 && st % 2 === 1) a.pluck(t, N(ch[(st >> 1) % 3] + 24), 0.03, 0.15, 'sawtooth', 4000);
      if (I > 0.8 && st === 0 && bar % 4 === 0) a.braam(t, N(28), 2.5, 0.1);
    },
  },
  // ホラー: 不協和音・ドローン・心音
  horror: {
    bpm: 60,
    step(a, s, t, spb) {
      const bar = Math.floor(s / 16), st = s % 16;
      const I = a.intensity;
      if (st === 0 && bar % 2 === 0) a.pad(t, [N(38), N(39), N(45), N(50)], spb * 32, 0.03 + I * 0.02, 400 + I * 600);
      if (st === 0 || st === 3) a.kick(t, 0.25 + I * 0.4); // 心音
      if (Math.random() < 0.05) a.metalHit(t, 0.04 + I * 0.04);
      if (st === 8 && bar % 4 === 3) a.swell(t, N(rand(40, 52) | 0), spb * 8, 0.06);
      if (I > 0.5 && st % 2 === 0) a.pluck(t, N(pick([62, 63, 69, 70])), 0.02 + I * 0.02, 0.12, 'square', 1500);
      if (I > 0.5 && (st === 4 || st === 12)) a.snare(t, 0.12);
      if (I > 0.7 && st === 0 && bar % 2 === 0) a.braam(t, N(25), 3, 0.1);
    },
  },
  // 訓練場: 軽快なエレクトロ
  range: {
    bpm: 112,
    step(a, s, t, spb) {
      const bar = Math.floor(s / 16), st = s % 16;
      const prog = [[45, 48, 52], [41, 45, 48], [43, 47, 50], [40, 43, 47]];
      const ch = prog[bar % 4];
      if (st === 0) a.pad(t, ch.map((n) => N(n + 12)), spb * 16, 0.025, 1500, 'triangle');
      if (st % 4 === 0) a.kick(t, 0.5);
      if (st === 4 || st === 12) a.snare(t, 0.18);
      if (st % 2 === 1) a.hat(t, false, 0.05);
      if ([0, 3, 6, 10, 12].includes(st)) a.bass(t, N(ch[0] - 12), spb * 1.5, 0.15, 500);
      if (st % 2 === 0 && bar % 8 >= 4) a.pluck(t, N(ch[(st / 2) % 3] + 24), 0.03, 0.2, 'square', 2500);
    },
  },
  victory: {
    bpm: 90,
    step(a, s, t, spb) {
      const bar = Math.floor(s / 16), st = s % 16;
      const prog = [[48, 52, 55], [53, 57, 60], [55, 59, 62], [48, 52, 55]];
      const ch = prog[bar % 4];
      if (st === 0) { a.pad(t, ch.map((n) => N(n)), spb * 16, 0.05, 2000); a.bass(t, N(ch[0] - 12), spb * 12, 0.15); }
      if (st % 2 === 0) a.pluck(t, N(ch[(st / 2) % 3] + 12), 0.04, 0.5, 'triangle', 5000);
    },
  },
};
