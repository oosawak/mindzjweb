// =========================================================
// SynthFallback — mp3 が無いときの代わりの音(エレクトロ寄り)
//  ElevenLabs で作った mp3 を assets/audio/ に置くと自動でそちらが優先される
// =========================================================
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

export class SynthFallback {
  constructor(ctx, sfxBus, bgmBus) {
    this.ctx = ctx;
    this.sfxBus = sfxBus;
    this.bgmBus = bgmBus;
    const len = ctx.sampleRate;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.bgm = null;
  }

  _tone({ type = 'sine', f0, f1 = f0, t = 0, dur = 0.2, vol = 0.3, attack = 0.004, out = this.sfxBus }) {
    const c = this.ctx, now = c.currentTime + t;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, now);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(out);
    o.start(now);
    o.stop(now + dur + 0.05);
  }

  _noise({ t = 0, dur = 0.2, vol = 0.3, type = 'lowpass', f0 = 1200, f1 = f0, q = 1, out = this.sfxBus }) {
    const c = this.ctx, now = c.currentTime + t;
    const s = c.createBufferSource();
    s.buffer = this.noise;
    const f = c.createBiquadFilter();
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, now);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), now + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    s.connect(f).connect(g).connect(out);
    s.start(now, Math.random() * 0.5);
    s.stop(now + dur + 0.05);
  }

  sfx(id) {
    const T = (o) => this._tone(o), N = (o) => this._noise(o);
    switch (id) {
      case 'ui_select': T({ type: 'square', f0: 880, f1: 1760, dur: 0.08, vol: 0.08 }); T({ type: 'sine', f0: 1760, dur: 0.12, t: 0.04, vol: 0.1 }); break;
      case 'ui_back': T({ type: 'square', f0: 700, f1: 350, dur: 0.1, vol: 0.07 }); break;
      case 'ui_hover': T({ type: 'sine', f0: 2200, dur: 0.03, vol: 0.04 }); break;
      case 'ui_toggle': T({ type: 'square', f0: 1100, dur: 0.05, vol: 0.06 }); break;
      case 'shot': N({ dur: 0.08, vol: 0.18, type: 'bandpass', f0: 2400, f1: 900, q: 2 }); T({ type: 'triangle', f0: 520, f1: 260, dur: 0.07, vol: 0.08 }); break;
      case 'splat': N({ dur: 0.12, vol: 0.12, type: 'lowpass', f0: 1800, f1: 300 }); break;
      case 'hit': T({ type: 'square', f0: 300, f1: 120, dur: 0.12, vol: 0.12 }); N({ dur: 0.1, vol: 0.15, f0: 2000, f1: 400 }); break;
      case 'hit_confirm': T({ type: 'sine', f0: 1600, dur: 0.05, vol: 0.12 }); T({ type: 'sine', f0: 2400, dur: 0.06, t: 0.03, vol: 0.08 }); break;
      case 'inkout': N({ dur: 0.5, vol: 0.35, type: 'lowpass', f0: 3000, f1: 150 }); T({ type: 'sawtooth', f0: 400, f1: 60, dur: 0.5, vol: 0.12 }); break;
      case 'respawn': T({ type: 'sine', f0: 300, f1: 1200, dur: 0.4, vol: 0.15 }); N({ dur: 0.4, vol: 0.08, type: 'highpass', f0: 3000, f1: 8000 }); break;
      case 'jump': T({ type: 'sine', f0: 280, f1: 620, dur: 0.14, vol: 0.14 }); break;
      case 'land': N({ dur: 0.1, vol: 0.18, f0: 900, f1: 200 }); T({ type: 'sine', f0: 140, f1: 60, dur: 0.12, vol: 0.2 }); break;
      case 'land_big': N({ dur: 0.3, vol: 0.3, f0: 1400, f1: 100 }); T({ type: 'sine', f0: 110, f1: 35, dur: 0.35, vol: 0.4 }); break;
      case 'flip':
        N({ dur: 0.4, vol: 0.2, type: 'bandpass', f0: 250, f1: 3500, q: 4 });
        T({ type: 'sawtooth', f0: 110, f1: 440, dur: 0.3, vol: 0.08 });
        T({ type: 'sine', f0: 880, f1: 1760, dur: 0.2, t: 0.12, vol: 0.06 });
        break;
      case 'flip_fail': T({ type: 'square', f0: 180, dur: 0.08, vol: 0.06 }); break;
      case 'stamp':
        T({ type: 'sine', f0: 160, f1: 30, dur: 0.6, vol: 0.55 });
        N({ dur: 0.5, vol: 0.4, type: 'lowpass', f0: 4000, f1: 120 });
        T({ type: 'square', f0: 220, f1: 55, dur: 0.3, vol: 0.08 });
        break;
      case 'special_ready': [72, 79, 84, 91].forEach((n, i) => T({ type: 'square', f0: NOTE(n), dur: 0.1, t: i * 0.05, vol: 0.06 })); break;
      case 'bomb_throw': N({ dur: 0.3, vol: 0.15, type: 'bandpass', f0: 600, f1: 2000, q: 3 }); break;
      case 'bomb_boom': T({ type: 'sine', f0: 90, f1: 25, dur: 0.9, vol: 0.6 }); N({ dur: 0.8, vol: 0.45, f0: 3000, f1: 80 }); break;
      case 'count': T({ type: 'square', f0: NOTE(72), dur: 0.12, vol: 0.09 }); break;
      case 'go': T({ type: 'square', f0: NOTE(84), dur: 0.35, vol: 0.1 }); T({ type: 'sawtooth', f0: NOTE(72), dur: 0.35, vol: 0.06 }); N({ dur: 0.3, vol: 0.1, type: 'highpass', f0: 4000, f1: 9000 }); break;
      case 'overdrive': [60, 63, 67, 72, 75, 79].forEach((n, i) => T({ type: 'sawtooth', f0: NOTE(n), dur: 0.15, t: i * 0.06, vol: 0.07 })); N({ dur: 0.6, vol: 0.12, type: 'highpass', f0: 2000, f1: 9000, t: 0.2 }); break;
      case 'round_end': [72, 67, 64, 60].forEach((n, i) => T({ type: 'square', f0: NOTE(n), dur: 0.2, t: i * 0.1, vol: 0.07 })); break;
      case 'win': [60, 64, 67, 72, 76, 79, 84].forEach((n, i) => T({ type: 'square', f0: NOTE(n), dur: 0.25, t: i * 0.08, vol: 0.07 })); break;
      case 'lose': [67, 63, 60, 55].forEach((n, i) => T({ type: 'triangle', f0: NOTE(n), dur: 0.3, t: i * 0.14, vol: 0.1 })); break;
      case 'tag_pass': T({ type: 'square', f0: 660, f1: 1320, dur: 0.12, vol: 0.1 }); N({ dur: 0.15, vol: 0.12, type: 'bandpass', f0: 3000, q: 5 }); break;
      case 'tag_tick': T({ type: 'square', f0: 1400, dur: 0.04, vol: 0.06 }); break;
      case 'tag_boom': T({ type: 'sine', f0: 120, f1: 30, dur: 1.0, vol: 0.6 }); N({ dur: 1.0, vol: 0.5, f0: 5000, f1: 60 }); break;
      case 'shove': N({ dur: 0.2, vol: 0.2, type: 'bandpass', f0: 400, f1: 1200, q: 2 }); T({ type: 'sine', f0: 200, f1: 90, dur: 0.15, vol: 0.18 }); break;
      case 'whoosh': N({ dur: 0.9, vol: 0.2, type: 'bandpass', f0: 200, f1: 2600, q: 2 }); break;
      case 'sparkle': [91, 96, 100, 103].forEach((n, i) => T({ type: 'sine', f0: NOTE(n), dur: 0.25, t: i * 0.05, vol: 0.06 })); break;
      case 'rank': T({ type: 'sine', f0: 120, f1: 50, dur: 0.3, vol: 0.4 }); [79, 84, 88, 91].forEach((n, i) => T({ type: 'square', f0: NOTE(n), dur: 0.3, t: 0.12 + i * 0.06, vol: 0.06 })); break;
      case 'lobby_join': T({ type: 'sine', f0: 660, dur: 0.1, vol: 0.1 }); T({ type: 'sine', f0: 990, dur: 0.15, t: 0.08, vol: 0.1 }); break;
      default: T({ type: 'sine', f0: 660, dur: 0.08, vol: 0.06 });
    }
  }

  // ---------- 簡易 BGM(ドラムつきシーケンサー) ----------
  static TRACKS = {
    title:    { bpm: 118, root: 45, prog: [[0, 3, 7, 10], [-4, 0, 3, 7], [-2, 2, 5, 9], [-5, -1, 2, 5]], arp: [0, 2, 1, 3, 2, 1, 3, 2], drums: 'k-h-s-h-k-h-s-hh' },
    intro:    { bpm: 92,  root: 45, prog: [[0, 3, 7, 10], [-4, 0, 3, 7], [-7, -3, 0, 3], [-5, -1, 2, 5]], arp: [0, 1, 2, 3, 2, 1, 2, 3], drums: 'k---h---k---h---' },
    lobby:    { bpm: 110, root: 48, prog: [[0, 4, 7, 11], [-3, 0, 4, 7], [-7, -3, 0, 4], [-5, -1, 2, 7]], arp: [0, 2, 3, 2, 1, 2, 3, 2], drums: 'k-h-k-h-k-h-k-hh' },
    match:    { bpm: 128, root: 43, prog: [[0, 3, 7, 10], [0, 3, 7, 10], [-4, 0, 3, 7], [-2, 2, 5, 9]], arp: [0, 1, 2, 3, 1, 2, 3, 1], drums: 'k-hhs-hhk-hhs-hh' },
    overdrive:{ bpm: 140, root: 46, prog: [[0, 3, 7, 10], [-2, 2, 5, 9], [-4, 0, 3, 7], [-5, -1, 2, 5]], arp: [0, 2, 1, 3, 0, 2, 1, 3], drums: 'khhhskhhkhhhskhh' },
    tag:      { bpm: 134, root: 41, prog: [[0, 3, 6, 9], [1, 4, 7, 10], [0, 3, 6, 9], [-1, 2, 5, 8]], arp: [0, 1, 2, 3, 3, 2, 1, 0], drums: 'k-h-s-hkk-h-s-hh' },
    training: { bpm: 104, root: 48, prog: [[0, 4, 7, 11], [2, 5, 9, 12], [-3, 0, 4, 7], [-5, -1, 2, 5]], arp: [0, 1, 2, 3, 2, 1, 2, 3], drums: 'k---h---s---h---' },
    result:   { bpm: 112, root: 48, prog: [[0, 4, 7, 11], [5, 9, 12, 16], [7, 11, 14, 17], [0, 4, 7, 12]], arp: [0, 1, 2, 3, 2, 1, 0, 2], drums: 'k-h-s-h-k-h-s-h-' },
    ending:   { bpm: 84,  root: 45, prog: [[0, 3, 7, 10], [-4, 0, 3, 7], [-2, 2, 5, 9], [-7, -3, 0, 3]], arp: [0, 2, 3, 2, 1, 2, 3, 2], drums: 'k-------s-------' },
    credits:  { bpm: 96,  root: 48, prog: [[0, 4, 7, 11], [-3, 0, 4, 7], [-7, -3, 0, 4], [-5, -1, 2, 7]], arp: [0, 1, 2, 3, 2, 3, 1, 2], drums: 'k---h-h-s---h-h-' },
  };

  playBGM(id) {
    this.stopBGM(0.4);
    const def = SynthFallback.TRACKS[id] || SynthFallback.TRACKS.title;
    const c = this.ctx;
    const out = c.createGain();
    out.gain.setValueAtTime(0.0001, c.currentTime);
    out.gain.linearRampToValueAtTime(0.5, c.currentTime + 1.0);
    out.connect(this.bgmBus);
    const step = 60 / def.bpm / 4; // 16分
    let next = c.currentTime + 0.1, i = 0;
    const st = { out, timer: null };
    const schedule = () => {
      while (next < c.currentTime + 0.25) {
        const t = next - c.currentTime;
        const s16 = i % 16;
        const bar = Math.floor(i / 16) % def.prog.length;
        const chord = def.prog[bar];
        const d = def.drums[s16];
        if (d === 'k') this._tone({ type: 'sine', f0: 150, f1: 42, dur: 0.18, vol: 0.32, out, t });
        if (d === 'h') this._noise({ dur: 0.04, vol: 0.05, type: 'highpass', f0: 7500, f1: 9000, out, t });
        if (d === 's') this._noise({ dur: 0.14, vol: 0.12, type: 'bandpass', f0: 1800, f1: 1200, q: 0.8, out, t });
        if (s16 % 2 === 0) {
          const n = def.root + 24 + chord[def.arp[(s16 / 2) % 8] % chord.length];
          this._tone({ type: 'square', f0: NOTE(n), dur: step * 1.6, vol: 0.035, out, t });
        }
        if (s16 % 4 === 0) this._tone({ type: 'sawtooth', f0: NOTE(def.root + chord[0]), dur: step * 3.4, vol: 0.07, out, t, attack: 0.01 });
        if (s16 === 0) chord.forEach((cn) => this._tone({ type: 'triangle', f0: NOTE(def.root + 12 + cn), dur: step * 15, vol: 0.02, out, t, attack: 0.2 }));
        next += step;
        i++;
      }
    };
    schedule();
    st.timer = setInterval(schedule, 50);
    this.bgm = st;
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
