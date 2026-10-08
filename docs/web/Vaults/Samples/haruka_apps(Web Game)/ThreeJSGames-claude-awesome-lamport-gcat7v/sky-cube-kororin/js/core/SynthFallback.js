// =========================================================
// SynthFallback — mp3 がまだ無いときの「かわりの音」
// ElevenLabs で生成したファイルを assets/audio/ に置くと、
// 自動的にそちらが優先されます。
// =========================================================

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI → Hz

export class SynthFallback {
  constructor(ctx, sfxBus, bgmBus) {
    this.ctx = ctx;
    this.sfxBus = sfxBus;
    this.bgmBus = bgmBus;
    this.noiseBuffer = this._makeNoise();
    this.bgm = null;
  }

  _makeNoise() {
    const len = this.ctx.sampleRate * 1.0;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---------- 基本パーツ ----------
  _tone({ type = 'sine', f0, f1 = f0, t = 0, dur = 0.2, vol = 0.3, attack = 0.005, out = this.sfxBus, curve = 'exp' }) {
    const ctx = this.ctx;
    const now = ctx.currentTime + t;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, now);
    if (f1 !== f0) {
      if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), now + dur);
      else o.frequency.linearRampToValueAtTime(f1, now + dur);
    }
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(out);
    o.start(now);
    o.stop(now + dur + 0.05);
  }

  _noise({ t = 0, dur = 0.2, vol = 0.3, type = 'lowpass', f0 = 1200, f1 = f0, q = 1, out = this.sfxBus }) {
    const ctx = this.ctx;
    const now = ctx.currentTime + t;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filt = ctx.createBiquadFilter();
    filt.type = type;
    filt.Q.value = q;
    filt.frequency.setValueAtTime(f0, now);
    filt.frequency.exponentialRampToValueAtTime(Math.max(20, f1), now + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filt).connect(g).connect(out);
    src.start(now);
    src.stop(now + dur + 0.05);
  }

  // ---------- 効果音 ----------
  sfx(id) {
    const T = (o) => this._tone(o);
    const N = (o) => this._noise(o);
    switch (id) {
      case 'ui_select':
        T({ type: 'triangle', f0: 880, f1: 1320, dur: 0.12, vol: 0.25 });
        T({ type: 'sine', f0: 1760, dur: 0.1, t: 0.05, vol: 0.12 });
        break;
      case 'ui_back':
        T({ type: 'triangle', f0: 760, f1: 480, dur: 0.14, vol: 0.22 });
        break;
      case 'ui_hover':
        T({ type: 'sine', f0: 1200, dur: 0.05, vol: 0.06 });
        break;
      case 'ui_toggle':
        T({ type: 'square', f0: 660, dur: 0.06, vol: 0.08 });
        T({ type: 'square', f0: 990, dur: 0.06, t: 0.05, vol: 0.08 });
        break;
      case 'jump':
        T({ type: 'sine', f0: 320, f1: 820, dur: 0.18, vol: 0.28 });
        T({ type: 'triangle', f0: 640, f1: 1300, dur: 0.12, vol: 0.08 });
        break;
      case 'land':
        N({ dur: 0.14, vol: 0.35, f0: 900, f1: 200 });
        T({ type: 'sine', f0: 180, f1: 70, dur: 0.16, vol: 0.35 });
        break;
      case 'land_big':
        N({ dur: 0.35, vol: 0.5, f0: 1400, f1: 120 });
        T({ type: 'sine', f0: 140, f1: 40, dur: 0.4, vol: 0.55 });
        break;
      case 'gravity':
        N({ dur: 0.45, vol: 0.28, type: 'bandpass', f0: 300, f1: 3200, q: 3 });
        T({ type: 'sine', f0: 220, f1: 880, dur: 0.35, vol: 0.22 });
        T({ type: 'triangle', f0: 1320, f1: 2640, dur: 0.2, t: 0.12, vol: 0.06 });
        break;
      case 'gravity_fail':
        T({ type: 'square', f0: 220, f1: 180, dur: 0.12, vol: 0.08 });
        break;
      case 'star': {
        const notes = [84, 88, 91, 96];
        notes.forEach((n, i) => T({ type: 'triangle', f0: NOTE(n), dur: 0.22, t: i * 0.055, vol: 0.22 }));
        T({ type: 'sine', f0: NOTE(103), dur: 0.5, t: 0.22, vol: 0.08 });
        break;
      }
      case 'goal_open':
        [72, 76, 79, 84, 88].forEach((n, i) => T({ type: 'sine', f0: NOTE(n), dur: 0.5, t: i * 0.08, vol: 0.18 }));
        break;
      case 'goal':
        [72, 76, 79, 84].forEach((n, i) => T({ type: 'triangle', f0: NOTE(n), dur: 0.35, t: i * 0.09, vol: 0.22 }));
        [84, 88, 91].forEach((n) => T({ type: 'sine', f0: NOTE(n), dur: 1.4, t: 0.38, vol: 0.12 }));
        N({ dur: 1.2, vol: 0.12, type: 'highpass', f0: 3000, f1: 8000, t: 0.3 });
        break;
      case 'hazard':
        T({ type: 'sawtooth', f0: 110, f1: 90, dur: 0.35, vol: 0.18 });
        T({ type: 'square', f0: 1480, f1: 300, dur: 0.25, vol: 0.06 });
        N({ dur: 0.3, vol: 0.2, type: 'bandpass', f0: 2400, f1: 1200, q: 6 });
        break;
      case 'respawn':
        T({ type: 'sine', f0: 400, f1: 1200, dur: 0.4, vol: 0.2 });
        N({ dur: 0.4, vol: 0.1, type: 'highpass', f0: 2000, f1: 6000 });
        break;
      case 'fall_out':
        T({ type: 'sine', f0: 900, f1: 120, dur: 0.8, vol: 0.22, curve: 'lin' });
        break;
      case 'crumble':
        N({ dur: 0.5, vol: 0.3, f0: 600, f1: 100 });
        T({ type: 'triangle', f0: 90, f1: 50, dur: 0.4, vol: 0.2 });
        break;
      case 'crack':
        N({ dur: 0.08, vol: 0.25, type: 'highpass', f0: 2500, f1: 1500 });
        break;
      case 'count':
        T({ type: 'square', f0: NOTE(76), dur: 0.12, vol: 0.1 });
        break;
      case 'go':
        T({ type: 'square', f0: NOTE(84), dur: 0.3, vol: 0.12 });
        T({ type: 'triangle', f0: NOTE(88), dur: 0.3, vol: 0.12 });
        break;
      case 'stage_clear':
        [67, 72, 76, 79, 84].forEach((n, i) => T({ type: 'triangle', f0: NOTE(n), dur: 0.25, t: i * 0.1, vol: 0.2 }));
        [72, 76, 79, 84].forEach((n) => T({ type: 'sine', f0: NOTE(n), dur: 1.2, t: 0.55, vol: 0.1 }));
        break;
      case 'whoosh':
        N({ dur: 0.8, vol: 0.25, type: 'bandpass', f0: 200, f1: 2400, q: 2 });
        break;
      case 'shatter':
        N({ dur: 1.0, vol: 0.4, type: 'highpass', f0: 1500, f1: 5000 });
        [96, 100, 103, 108, 101, 98].forEach((n, i) => T({ type: 'sine', f0: NOTE(n), dur: 0.4, t: i * 0.04, vol: 0.07 }));
        T({ type: 'sine', f0: 120, f1: 40, dur: 0.6, vol: 0.4 });
        break;
      case 'sparkle':
        [91, 96, 100, 103].forEach((n, i) => T({ type: 'sine', f0: NOTE(n), dur: 0.3, t: i * 0.07, vol: 0.08 }));
        break;
      case 'rank':
        T({ type: 'sine', f0: 120, f1: 60, dur: 0.3, vol: 0.4 });
        N({ dur: 0.2, vol: 0.3, f0: 2000, f1: 300 });
        [79, 84, 88, 91].forEach((n, i) => T({ type: 'triangle', f0: NOTE(n), dur: 0.5, t: 0.15 + i * 0.07, vol: 0.15 }));
        break;
      case 'pop':
        T({ type: 'sine', f0: 500, f1: 1100, dur: 0.08, vol: 0.2 });
        break;
      default:
        T({ type: 'sine', f0: 660, dur: 0.1, vol: 0.1 });
    }
  }

  // ---------- 簡易 BGM(ループシーケンサー) ----------
  static TRACKS = {
    title:   { bpm: 96,  root: 60, prog: [[0, 4, 7, 11], [5, 9, 12, 16], [2, 5, 9, 12], [7, 11, 14, 17]], arp: [0, 1, 2, 3, 2, 1, 2, 3], lead: 'triangle' },
    story:   { bpm: 72,  root: 57, prog: [[0, 3, 7, 10], [5, 8, 12, 15], [3, 7, 10, 14], [7, 10, 14, 17]], arp: [0, 2, 1, 3, 0, 2, 1, 3], lead: 'sine' },
    stage1:  { bpm: 112, root: 62, prog: [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]], arp: [0, 1, 2, 1, 3, 2, 1, 2], lead: 'triangle' },
    stage2:  { bpm: 120, root: 57, prog: [[0, 3, 7, 10], [8, 12, 15, 19], [5, 8, 12, 15], [7, 11, 14, 17]], arp: [0, 2, 1, 2, 3, 2, 1, 2], lead: 'square' },
    stage3:  { bpm: 128, root: 64, prog: [[0, 4, 7, 11], [5, 9, 12, 16], [9, 12, 16, 19], [7, 11, 14, 17]], arp: [0, 1, 2, 3, 1, 2, 3, 2], lead: 'triangle' },
    result:  { bpm: 104, root: 65, prog: [[0, 4, 7, 11], [5, 9, 12, 16], [7, 11, 14, 17], [0, 4, 7, 12]], arp: [0, 1, 2, 3, 2, 1, 0, 2], lead: 'triangle' },
    ending:  { bpm: 80,  root: 60, prog: [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]], arp: [0, 2, 3, 2, 1, 2, 3, 2], lead: 'sine' },
    credits: { bpm: 88,  root: 62, prog: [[0, 4, 7, 11], [5, 9, 12, 16], [2, 5, 9, 12], [7, 11, 14, 17]], arp: [0, 1, 2, 3, 2, 3, 1, 2], lead: 'sine' },
  };

  playBGM(id) {
    this.stopBGM(0.4);
    const def = SynthFallback.TRACKS[id] || SynthFallback.TRACKS.title;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.2);
    out.connect(this.bgmBus);
    const step = 60 / def.bpm / 2; // 8分音符
    let next = ctx.currentTime + 0.1;
    let i = 0;
    const state = { out, timer: null };
    const schedule = () => {
      while (next < ctx.currentTime + 0.25) {
        const bar = Math.floor(i / 8) % def.prog.length;
        const chord = def.prog[bar];
        const s = i % 8;
        const note = def.root + chord[def.arp[s] % chord.length] + 12;
        this._tone({ type: def.lead, f0: NOTE(note), dur: step * 1.6, vol: 0.07, out, t: next - ctx.currentTime });
        if (s === 0 || s === 4) this._tone({ type: 'sine', f0: NOTE(def.root + chord[0] - 12), dur: step * 3.5, vol: 0.12, out, t: next - ctx.currentTime, attack: 0.02 });
        if (s === 0) chord.forEach((c) => this._tone({ type: 'sine', f0: NOTE(def.root + c), dur: step * 8, vol: 0.025, out, t: next - ctx.currentTime, attack: 0.3 }));
        if (s % 2 === 1 && def.bpm >= 110) this._noise({ dur: 0.04, vol: 0.03, type: 'highpass', f0: 7000, f1: 9000, out, t: next - ctx.currentTime });
        next += step;
        i++;
      }
    };
    schedule();
    state.timer = setInterval(schedule, 60);
    this.bgm = state;
  }

  stopBGM(fade = 0.8) {
    if (!this.bgm) return;
    const { out, timer } = this.bgm;
    clearInterval(timer);
    const now = this.ctx.currentTime;
    out.gain.cancelScheduledValues(now);
    out.gain.setValueAtTime(out.gain.value, now);
    out.gain.linearRampToValueAtTime(0.0001, now + fade);
    setTimeout(() => out.disconnect(), (fade + 0.6) * 1000);
    this.bgm = null;
  }
}
