// ===== Synthesized audio: engine, sirens, SFX, procedural BGM =====
import { clamp } from './util.js';

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class AudioSys {
  constructor() { this.ready = false; this.settings = { master: 0.8, music: 0.6, sfx: 0.9 }; }

  init() {
    if (this.ready) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
    this.master.connect(comp); comp.connect(ctx.destination);
    this.musicBus = ctx.createGain(); this.musicBus.connect(this.master);
    this.sfxBus = ctx.createGain(); this.sfxBus.connect(this.master);
    // noise buffer
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // reverb
    this.reverb = ctx.createConvolver();
    const rl = ctx.sampleRate * 2.2; const ir = ctx.createBuffer(2, rl, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < rl; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rl, 3); }
    this.reverb.buffer = ir;
    this.revSend = ctx.createGain(); this.revSend.gain.value = 0.35;
    this.revSend.connect(this.reverb); this.reverb.connect(this.musicBus);
    this.sfxRev = ctx.createGain(); this.sfxRev.gain.value = 0.25; this.sfxRev.connect(this.reverb);
    // delay for arps
    this.delay = ctx.createDelay(1); this.delay.delayTime.value = (60 / 128) * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.35;
    const dl = ctx.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 2500;
    this.delay.connect(dl); dl.connect(fb); fb.connect(this.delay); dl.connect(this.musicBus);
    this.delaySend = ctx.createGain(); this.delaySend.gain.value = 0.3; this.delaySend.connect(this.delay);
    this.ready = true;
    this.applyVolumes();
    this.buildLoops();
    this.music = new Music(this);
  }

  applyVolumes() {
    if (!this.ready) return;
    const s = this.settings;
    this.master.gain.value = s.master;
    this.musicBus.gain.value = s.music * 0.55;
    this.sfxBus.gain.value = s.sfx;
  }

  noiseSrc(loop = true) {
    const s = this.ctx.createBufferSource(); s.buffer = this.noise; s.loop = loop;
    s.loopStart = Math.random(); s.loopEnd = s.loopStart + 0.9;
    return s;
  }

  // continuous voices
  buildLoops() {
    const ctx = this.ctx;
    const mk = (type, f) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; return o; };
    // ENGINE
    const e = (this.engine = {});
    e.out = ctx.createGain(); e.out.gain.value = 0; e.out.connect(this.sfxBus);
    e.filter = ctx.createBiquadFilter(); e.filter.type = 'lowpass'; e.filter.Q.value = 2.5;
    e.shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = (i / 512) - 1; curve[i] = Math.tanh(x * 2.6); }
    e.shaper.curve = curve;
    e.am = ctx.createGain(); e.am.gain.value = 0.7;
    e.o1 = mk('sawtooth', 60); e.o2 = mk('sawtooth', 60.6); e.o3 = mk('square', 30); e.o4 = mk('triangle', 120);
    e.lfo = mk('sine', 30); e.lfoG = ctx.createGain(); e.lfoG.gain.value = 0.3;
    e.lfo.connect(e.lfoG); e.lfoG.connect(e.am.gain);
    const g3 = ctx.createGain(); g3.gain.value = 0.6; const g4 = ctx.createGain(); g4.gain.value = 0.25;
    e.o1.connect(e.am); e.o2.connect(e.am); e.o3.connect(g3); g3.connect(e.am); e.o4.connect(g4); g4.connect(e.am);
    e.am.connect(e.shaper); e.shaper.connect(e.filter); e.filter.connect(e.out);
    // intake noise
    e.nz = this.noiseSrc(); e.nzF = ctx.createBiquadFilter(); e.nzF.type = 'bandpass'; e.nzF.frequency.value = 600; e.nzF.Q.value = 0.8;
    e.nzG = ctx.createGain(); e.nzG.gain.value = 0; e.nz.connect(e.nzF); e.nzF.connect(e.nzG); e.nzG.connect(e.out);
    // turbo whistle
    e.turbo = mk('sine', 3000); e.turboG = ctx.createGain(); e.turboG.gain.value = 0; e.turbo.connect(e.turboG); e.turboG.connect(this.sfxBus);
    [e.o1, e.o2, e.o3, e.o4, e.lfo, e.nz, e.turbo].forEach((o) => o.start());

    // TIRES
    const t = (this.tire = {});
    t.src = this.noiseSrc(); t.f1 = ctx.createBiquadFilter(); t.f1.type = 'bandpass'; t.f1.frequency.value = 1100; t.f1.Q.value = 3;
    t.f2 = ctx.createBiquadFilter(); t.f2.type = 'bandpass'; t.f2.frequency.value = 2600; t.f2.Q.value = 4;
    t.g = ctx.createGain(); t.g.gain.value = 0;
    t.src.connect(t.f1); t.src.connect(t.f2); t.f1.connect(t.g); t.f2.connect(t.g); t.g.connect(this.sfxBus);
    t.src.start();
    // WIND
    const w = (this.wind = {});
    w.src = this.noiseSrc(); w.f = ctx.createBiquadFilter(); w.f.type = 'lowpass'; w.f.frequency.value = 400;
    w.g = ctx.createGain(); w.g.gain.value = 0; w.src.connect(w.f); w.f.connect(w.g); w.g.connect(this.sfxBus); w.src.start();
    // OFFROAD rumble
    const r = (this.rumble = {});
    r.src = this.noiseSrc(); r.f = ctx.createBiquadFilter(); r.f.type = 'lowpass'; r.f.frequency.value = 180;
    r.g = ctx.createGain(); r.g.gain.value = 0; r.src.connect(r.f); r.f.connect(r.g); r.g.connect(this.sfxBus); r.src.start();
    // NITRO
    const n = (this.nitro = {});
    n.src = this.noiseSrc(); n.f = ctx.createBiquadFilter(); n.f.type = 'bandpass'; n.f.frequency.value = 350; n.f.Q.value = 0.7;
    n.g = ctx.createGain(); n.g.gain.value = 0; n.src.connect(n.f); n.f.connect(n.g); n.g.connect(this.sfxBus); n.src.start();
    // SIRENS (2 voices)
    this.sirens = [0, 1].map((i) => {
      const o = mk('square', 800), o2 = mk('sawtooth', 803);
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2200;
      const g = ctx.createGain(); g.gain.value = 0;
      const p = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
      const g2 = ctx.createGain(); g2.gain.value = 0.4;
      o.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(p); p.connect(this.sfxBus);
      o.start(); o2.start();
      return { o, o2, g, p, mode: i, t: i * 1.3 };
    });
    this.lastThrottle = 0;
  }

  // per-frame update of continuous sounds
  update(dt, st) {
    if (!this.ready) return;
    const ctx = this.ctx, now = ctx.currentTime;
    const e = this.engine;
    const on = st.active ? 1 : 0;
    const rpm = st.rpm ?? 0.2, thr = st.throttle ?? 0;
    const f = 34 + rpm * 175;
    const k = 0.05;
    e.o1.frequency.setTargetAtTime(f, now, k); e.o2.frequency.setTargetAtTime(f * 1.008, now, k);
    e.o3.frequency.setTargetAtTime(f * 0.5, now, k); e.o4.frequency.setTargetAtTime(f * 2, now, k);
    e.lfo.frequency.setTargetAtTime(f * 0.5, now, k);
    e.filter.frequency.setTargetAtTime(300 + thr * 2200 + rpm * 1600, now, 0.06);
    e.out.gain.setTargetAtTime(on * (0.14 + thr * 0.1 + rpm * 0.05), now, 0.08);
    e.nzG.gain.setTargetAtTime(on * thr * rpm * 0.12, now, 0.08);
    e.nzF.frequency.setTargetAtTime(400 + rpm * 1400, now, 0.1);
    e.turbo.frequency.setTargetAtTime(1800 + rpm * 3200, now, 0.2);
    e.turboG.gain.setTargetAtTime(on * thr * rpm * rpm * 0.012, now, 0.15);
    if (this.lastThrottle > 0.8 && thr < 0.2 && rpm > 0.6 && on) { this.blowoff(); if (Math.random() < 0.6) this.backfire(); }
    this.lastThrottle = thr;
    if (st.shifted && on) { this.shiftPop(); }
    // tires
    const sk = on * clamp(st.skid ?? 0, 0, 1) * clamp((st.speed ?? 0) / 12, 0, 1);
    this.tire.g.gain.setTargetAtTime(sk * 0.22, now, 0.05);
    this.tire.f1.frequency.setTargetAtTime(900 + sk * 500 + Math.random() * 60, now, 0.05);
    // wind
    const sp = st.speed ?? 0;
    this.wind.g.gain.setTargetAtTime(on * clamp(sp / 90, 0, 1) ** 2 * 0.22, now, 0.1);
    this.wind.f.frequency.setTargetAtTime(250 + sp * 14, now, 0.1);
    this.rumble.g.gain.setTargetAtTime(on * (st.offroad ? clamp(sp / 30, 0, 1) * 0.5 : 0), now, 0.08);
    this.nitro.g.gain.setTargetAtTime(on * (st.nitro ? 0.28 : 0), now, 0.06);
    this.nitro.f.frequency.setTargetAtTime(st.nitro ? 700 : 300, now, 0.3);
    // sirens
    const list = st.sirens || [];
    this.sirens.forEach((s, i) => {
      const c = list[i];
      if (!c || !on) { s.g.gain.setTargetAtTime(0, now, 0.1); return; }
      s.t += dt;
      const mode = c.mode ?? s.mode;
      let base;
      if (mode === 0) base = 650 + 520 * (0.5 - 0.5 * Math.cos((s.t / 3.4) * Math.PI * 2));
      else base = 700 + 480 * (((s.t / 0.32) % 1));
      const dop = clamp(343 / (343 + (c.vrel || 0)), 0.8, 1.25);
      s.o.frequency.setTargetAtTime(base * dop, now, 0.02);
      s.o2.frequency.setTargetAtTime(base * dop * 1.005, now, 0.02);
      s.g.gain.setTargetAtTime(c.gain * 0.09, now, 0.08);
      if (s.p.pan) s.p.pan.setTargetAtTime(clamp(c.pan, -0.9, 0.9), now, 0.05);
    });
  }

  silence() {
    if (!this.ready) return;
    this.update(0.016, { active: false });
  }

  // ---------- one-shots ----------
  env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  burst({ t = 0, dur = 0.3, type = 'lowpass', f0 = 1000, f1 = null, q = 1, gain = 0.5, attack = 0.002, bus = null, rev = 0 }) {
    const ctx = this.ctx; const now = ctx.currentTime + t;
    const s = this.noiseSrc(false); const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, now); f.Q.value = q;
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, now + dur);
    const g = ctx.createGain(); this.env(g, now, attack, gain, dur);
    s.connect(f); f.connect(g); g.connect(bus || this.sfxBus);
    if (rev) { const r = ctx.createGain(); r.gain.value = rev; g.connect(r); r.connect(this.sfxRev); }
    s.start(now, Math.random()); s.stop(now + dur + attack + 0.05);
  }
  tone({ t = 0, type = 'sine', f0 = 440, f1 = null, dur = 0.2, gain = 0.3, attack = 0.005, bus = null, rev = 0 }) {
    const ctx = this.ctx; const now = ctx.currentTime + t;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, now);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, now + dur);
    const g = ctx.createGain(); this.env(g, now, attack, gain, dur);
    o.connect(g); g.connect(bus || this.sfxBus);
    if (rev) { const r = ctx.createGain(); r.gain.value = rev; g.connect(r); r.connect(this.sfxRev); }
    o.start(now); o.stop(now + dur + attack + 0.05);
  }
  crash(power = 1) {
    if (!this.ready) return;
    const p = clamp(power, 0.1, 1.5);
    this.burst({ dur: 0.25 + p * 0.35, f0: 2500, f1: 300, gain: 0.35 * p, rev: 0.4 });
    this.tone({ type: 'sine', f0: 90, f1: 38, dur: 0.35, gain: 0.6 * p });
    for (let i = 0; i < 3; i++) this.tone({ type: 'square', f0: 300 + Math.random() * 900, f1: 200 + Math.random() * 200, dur: 0.12 + Math.random() * 0.2, gain: 0.05 * p, t: Math.random() * 0.05 });
    if (p > 0.7) for (let i = 0; i < 5; i++) this.burst({ t: 0.03 + Math.random() * 0.25, dur: 0.06, type: 'highpass', f0: 5000, gain: 0.12 * p });
  }
  scrape(power = 0.5) { if (this.ready) this.burst({ dur: 0.2, type: 'bandpass', f0: 1800, q: 4, gain: 0.2 * power }); }
  landing(power = 1) { if (!this.ready) return; this.tone({ f0: 70, f1: 35, dur: 0.3, gain: 0.5 * power }); this.burst({ dur: 0.2, f0: 400, gain: 0.25 * power }); }
  blowoff() { if (this.ready) this.burst({ dur: 0.35, type: 'highpass', f0: 2500, f1: 5000, gain: 0.07 }); }
  backfire() { if (!this.ready) return; for (let i = 0; i < 2 + Math.random() * 3; i++) this.burst({ t: 0.05 + i * (0.06 + Math.random() * 0.07), dur: 0.05, f0: 900, gain: 0.3 }); }
  shiftPop() { if (this.ready) { this.burst({ dur: 0.06, f0: 1200, gain: 0.12 }); } }
  nitroStart() { if (this.ready) { this.burst({ dur: 0.6, type: 'bandpass', f0: 300, f1: 2000, q: 1, gain: 0.35 }); this.tone({ f0: 60, f1: 120, dur: 0.5, gain: 0.25 }); } }
  nearMiss() { if (this.ready) this.burst({ dur: 0.35, type: 'bandpass', f0: 600, f1: 2400, q: 2, gain: 0.25 }); }
  checkpoint() { if (!this.ready) return; [0, 4, 7, 12].forEach((n, i) => this.tone({ t: i * 0.06, type: 'triangle', f0: mtof(76 + n), dur: 0.25, gain: 0.18, rev: 0.4 })); }
  beep(high = false) { if (this.ready) this.tone({ type: 'square', f0: high ? 1320 : 660, dur: high ? 0.6 : 0.18, gain: 0.12, rev: 0.3 }); }
  click() { if (this.ready) this.tone({ type: 'triangle', f0: 1200, f1: 800, dur: 0.05, gain: 0.08 }); }
  hover() { if (this.ready) this.tone({ type: 'sine', f0: 1800, dur: 0.03, gain: 0.03 }); }
  spikes() { if (!this.ready) return; for (let i = 0; i < 4; i++) this.burst({ t: i * 0.07, dur: 0.1, type: 'highpass', f0: 1500, gain: 0.35 }); this.burst({ t: 0.1, dur: 1.2, type: 'bandpass', f0: 3000, f1: 600, gain: 0.15 }); }
  takedown() {
    if (!this.ready) return;
    this.crash(1.4);
    this.tone({ type: 'sine', f0: 160, f1: 30, dur: 1.2, gain: 0.7 });
    this.burst({ dur: 1.5, f0: 6000, f1: 200, gain: 0.25, rev: 0.8 });
    [0, 3, 7].forEach((n, i) => this.tone({ t: 0.15, type: 'sawtooth', f0: mtof(45 + n), dur: 1.4, gain: 0.08, rev: 0.6 }));
  }
  busted() { if (!this.ready) return; [0, 3, 6, 10].forEach((n) => this.tone({ type: 'sawtooth', f0: mtof(40 + n), dur: 2.5, attack: 0.05, gain: 0.1, rev: 0.8 })); this.tone({ f0: 80, f1: 30, dur: 2, gain: 0.5 }); }
  victory() { if (!this.ready) return; [0, 4, 7, 12, 16, 19, 24].forEach((n, i) => this.tone({ t: i * 0.09, type: 'square', f0: mtof(64 + n), dur: 0.4, gain: 0.08, rev: 0.5 })); [0, 4, 7].forEach((n) => this.tone({ t: 0.65, type: 'sawtooth', f0: mtof(52 + n), dur: 2, attack: 0.05, gain: 0.08, rev: 0.6 })); }
  empCharge(t) { if (this.ready) this.tone({ type: 'sine', f0: 300 + t * 1500, dur: 0.08, gain: 0.05 }); }
  empFire() { if (!this.ready) return; this.tone({ type: 'square', f0: 2000, f1: 80, dur: 0.6, gain: 0.25 }); this.burst({ dur: 0.5, type: 'bandpass', f0: 4000, f1: 500, q: 3, gain: 0.3 }); }
  radio() { if (this.ready) { this.burst({ dur: 0.18, type: 'bandpass', f0: 2500, q: 2, gain: 0.12 }); this.tone({ type: 'square', f0: 1400, dur: 0.05, gain: 0.04 }); } }
  whoosh() { if (this.ready) this.burst({ dur: 0.5, type: 'bandpass', f0: 300, f1: 1500, q: 1, gain: 0.3 }); }
}

// ================= Procedural music =================
class Music {
  constructor(a) {
    this.a = a; this.ctx = a.ctx;
    this.bpm = 128; this.step = 0; this.nextTime = 0; this.level = 0; this.targetLevel = 0; this.playing = false;
    this.bar = 0;
    this.prog = [
      { root: 45, tones: [0, 3, 7] }, // Am
      { root: 41, tones: [0, 4, 7] }, // F
      { root: 48, tones: [0, 4, 7] }, // C
      { root: 43, tones: [0, 4, 7] }, // G
    ];
    this.progB = [
      { root: 45, tones: [0, 3, 7] }, { root: 45, tones: [0, 3, 7] }, { root: 41, tones: [0, 4, 7] }, { root: 43, tones: [0, 4, 7] },
      { root: 38, tones: [0, 3, 7] }, { root: 41, tones: [0, 4, 7] }, { root: 40, tones: [0, 4, 7] }, { root: 40, tones: [0, 4, 7] },
    ];
    this.lead = [12, -1, 10, 12, -1, 15, -1, 12, 10, -1, 7, -1, 10, -1, 12, -1, 7, -1, 5, 7, -1, 10, -1, 7, 3, -1, 5, -1, 7, -1, -1, -1];
    this.out = this.ctx.createGain(); this.out.gain.value = 0.9; this.out.connect(a.musicBus);
    this.bassDist = this.ctx.createWaveShaper();
    const c = new Float32Array(512); for (let i = 0; i < 512; i++) { const x = i / 256 - 1; c[i] = Math.tanh(x * 3); } this.bassDist.curve = c;
    this.bassBus = this.ctx.createGain(); this.bassBus.connect(this.out);
    this.bassDist.connect(this.bassBus);
  }
  start() {
    if (this.playing) return;
    this.playing = true; this.nextTime = this.ctx.currentTime + 0.1; this.step = 0; this.bar = 0;
    this.timer = setInterval(() => this.schedule(), 25);
  }
  stop() { this.playing = false; clearInterval(this.timer); }
  setLevel(l) { this.targetLevel = l; }
  schedule() {
    const spb = 60 / this.bpm / 4;
    while (this.nextTime < this.ctx.currentTime + 0.15) {
      this.playStep(this.step, this.nextTime, spb);
      this.nextTime += spb;
      this.step++;
      if (this.step % 16 === 0) { this.bar++; this.level = this.targetLevel; }
    }
  }
  playStep(step, t, spb) {
    const s = step % 16, lv = this.level;
    const useB = lv >= 2;
    const prog = useB ? this.progB : this.prog;
    const ch = prog[this.bar % prog.length];
    // pads at bar start
    if (s === 0) this.pad(t, ch, spb * 16, lv);
    // drums
    if (lv >= 1) {
      if (s % 4 === 0) this.kick(t, 1);
      if (lv >= 2 && (s === 4 || s === 12)) this.snare(t, 1);
      if (lv >= 2 && this.bar % 4 === 3 && s >= 12) this.snare(t, 0.4 + (s - 12) * 0.15);
      if (lv >= 3 && s === 0 && this.bar % 4 === 0) this.crash(t);
    }
    if (s % 2 === 1 || lv >= 2) this.hat(t, s % 4 === 2 ? 0.6 : 0.3, lv >= 1 && s % 4 === 2);
    if (lv === 0 && s % 4 === 2) this.hat(t, 0.15, false);
    // bass
    if (lv === 0) { if (s === 0) this.bass(t, ch.root - 12, spb * 14, 0.5, lv); }
    else if (lv === 1) { if (s % 4 === 2 || s % 8 === 0) this.bass(t, ch.root - 12 + (s % 8 === 6 ? 12 : 0), spb * 1.6, 0.8, lv); }
    else { const oct = [0, 0, 12, 0, 0, 12, 0, 7, 0, 0, 12, 0, 0, 12, 3, 0][s]; this.bass(t, ch.root - 12 + oct, spb * 0.9, 0.85, lv); }
    // arp
    if (lv >= 2) {
      const seq = [0, 1, 2, 3, 2, 1, 0, 2, 1, 2, 3, 4, 3, 2, 1, 2];
      const idx = seq[s];
      const tone = ch.tones[idx % 3] + 12 * Math.floor(idx / 3);
      this.arp(t, ch.root + 12 + tone, spb * 0.9);
    } else if (lv === 1 && s % 2 === 0) {
      const tone = ch.tones[(s / 2) % 3];
      this.arp(t, ch.root + 24 + tone, spb * 0.7, 0.5);
    }
    // lead
    if (lv >= 3 && s % 2 === 0) {
      const li = ((this.bar % 4) * 8 + s / 2) % this.lead.length;
      const n = this.lead[li];
      if (n >= 0) this.leadNote(t, 57 + n, spb * 2.2);
    }
  }
  vgain(v) { const g = this.ctx.createGain(); g.gain.value = v; return g; }
  kick(t, v) {
    const c = this.ctx; const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.9 * v, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + 0.4);
  }
  snare(t, v) {
    const c = this.ctx; const s = this.a.noiseSrc(false); const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1400;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.35 * v, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    s.connect(f); f.connect(g); g.connect(this.out); g.connect(this.a.revSend); s.start(t, Math.random()); s.stop(t + 0.25);
    const o = c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.1);
    const g2 = c.createGain(); g2.gain.setValueAtTime(0.3 * v, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g2); g2.connect(this.out); o.start(t); o.stop(t + 0.15);
  }
  hat(t, v, open) {
    const c = this.ctx; const s = this.a.noiseSrc(false); const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7500;
    const d = open ? 0.22 : 0.045;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.13 * v, t + 0.001); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f); f.connect(g); g.connect(this.out); s.start(t, Math.random()); s.stop(t + d + 0.02);
  }
  crash(t) {
    const c = this.ctx; const s = this.a.noiseSrc(false); const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4000;
    const g = c.createGain(); g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    s.connect(f); f.connect(g); g.connect(this.out); g.connect(this.a.revSend); s.start(t, Math.random()); s.stop(t + 1.7);
  }
  bass(t, note, dur, v, lv) {
    const c = this.ctx; const f = mtof(note);
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
    const o2 = c.createOscillator(); o2.type = 'square'; o2.frequency.value = f / 2;
    const flt = c.createBiquadFilter(); flt.type = 'lowpass'; flt.Q.value = 6;
    const peak = lv >= 2 ? 1600 : 900;
    flt.frequency.setValueAtTime(120, t); flt.frequency.linearRampToValueAtTime(peak, t + 0.01); flt.frequency.exponentialRampToValueAtTime(180, t + Math.max(0.08, dur));
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.28 * v, t + 0.005); g.gain.setValueAtTime(0.28 * v, t + dur * 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const g2 = this.vgain(0.5);
    o.connect(flt); o2.connect(g2); g2.connect(flt); flt.connect(g);
    g.connect(lv >= 3 ? this.bassDist : this.bassBus);
    o.start(t); o2.start(t); o.stop(t + dur + 0.02); o2.stop(t + dur + 0.02);
  }
  arp(t, note, dur, v = 1) {
    const c = this.ctx; const o = c.createOscillator(); o.type = 'square'; o.frequency.value = mtof(note);
    const flt = c.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.setValueAtTime(3200, t); flt.frequency.exponentialRampToValueAtTime(700, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05 * v, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(flt); flt.connect(g); g.connect(this.out); g.connect(this.a.delaySend);
    o.start(t); o.stop(t + dur + 0.02);
  }
  leadNote(t, note, dur) {
    const c = this.ctx; const f = mtof(note);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06, t + 0.02); g.gain.setValueAtTime(0.05, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const flt = c.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 2800;
    const vib = c.createOscillator(); vib.frequency.value = 5.5; const vg = c.createGain(); vg.gain.value = f * 0.01; vib.connect(vg);
    for (const d of [0, 7, -7]) {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; vg.connect(o.frequency);
      o.connect(flt); o.start(t); o.stop(t + dur + 0.02);
    }
    flt.connect(g); g.connect(this.out); g.connect(this.a.delaySend); g.connect(this.a.revSend);
    vib.start(t); vib.stop(t + dur + 0.02);
  }
  pad(t, ch, dur, lv) {
    const c = this.ctx;
    const g = c.createGain(); const peak = lv >= 2 ? 0.035 : 0.05;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + 0.5); g.gain.setValueAtTime(peak, t + dur - 0.3); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.4);
    const flt = c.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = lv >= 2 ? 1400 : 900; flt.Q.value = 1;
    flt.connect(g); g.connect(this.out); g.connect(this.a.revSend);
    for (const tn of ch.tones) for (const d of [-8, 8]) {
      const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(ch.root + 12 + tn); o.detune.value = d;
      o.connect(flt); o.start(t); o.stop(t + dur + 0.5);
    }
  }
}
