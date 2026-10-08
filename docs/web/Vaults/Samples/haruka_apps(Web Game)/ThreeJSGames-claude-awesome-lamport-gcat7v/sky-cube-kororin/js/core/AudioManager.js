// =========================================================
// AudioManager — BGM / SFX / Voice
//  ・assets/audio/manifest.json の ID でならす
//  ・ファイルが無い場合は SynthFallback の音で代用
//  ・ボイスは data/script.json の ID と同じファイル名
//    (例: assets/audio/voice/ja/intro_01.mp3)
// =========================================================
import { settings } from './Settings.js';
import { SynthFallback } from './SynthFallback.js';

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.manifest = null;
    this.base = 'assets/audio/';
    this.buffers = new Map();   // key → AudioBuffer | null
    this.voiceIds = [];
    this.unlocked = false;
    this.pendingBGM = null;
    this.currentBGM = null;     // { id, src, gain }
    this.currentVoice = null;
    this.lastSfxTime = new Map();
    this.loadedLangs = new Set();
  }

  async init(manifestUrl, voiceIds) {
    this.manifest = await fetch(manifestUrl).then((r) => r.json());
    this.base = this.manifest.basePath || this.base;
    this.voiceIds = voiceIds;

    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.connect(ctx.destination);
    this.bgmBus = ctx.createGain();
    this.bgmDuck = ctx.createGain();
    this.sfxBus = ctx.createGain();
    this.voiceBus = ctx.createGain();
    this.bgmBus.connect(this.bgmDuck).connect(this.master);
    this.sfxBus.connect(this.master);
    this.voiceBus.connect(this.master);
    // 音割れ防止
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.ratio.value = 4;
    this.master.disconnect();
    this.master.connect(comp).connect(ctx.destination);

    this.synth = new SynthFallback(ctx, this.sfxBus, this.bgmBus);
    this.applyVolumes();
    settings.addEventListener('change', (e) => {
      if (['bgm', 'sfx', 'voice'].includes(e.detail.key)) this.applyVolumes();
      if (e.detail.key === 'lang') this.loadVoices(e.detail.value);
    });
    document.addEventListener('visibilitychange', () => {
      if (!this.unlocked) return;
      if (document.hidden) this.ctx.suspend(); else this.ctx.resume();
    });
  }

  applyVolumes() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.bgmBus.gain.setTargetAtTime(settings.get('bgm') * 0.9, t, 0.05);
    this.sfxBus.gain.setTargetAtTime(settings.get('sfx'), t, 0.05);
    this.voiceBus.gain.setTargetAtTime(settings.get('voice') * 1.1, t, 0.05);
  }

  // ---------- 読み込み ----------
  async _load(key, path) {
    if (this.buffers.has(key)) return this.buffers.get(key);
    let buf = null;
    try {
      const res = await fetch(this.base + path);
      if (res.ok) {
        const type = res.headers.get('content-type') || '';
        if (!type.includes('text/html')) {
          const arr = await res.arrayBuffer();
          buf = await this.ctx.decodeAudioData(arr);
        }
      }
    } catch { buf = null; }
    this.buffers.set(key, buf);
    return buf;
  }

  voicePath(id, lang) {
    return (this.manifest.voice?.pattern || 'voice/{lang}/{id}.mp3').replace('{lang}', lang).replace('{id}', id);
  }

  async preload(onProgress) {
    const jobs = [];
    for (const [id, e] of Object.entries(this.manifest.bgm || {})) jobs.push(() => this._load(`bgm:${id}`, e.file));
    for (const [id, e] of Object.entries(this.manifest.sfx || {})) jobs.push(() => this._load(`sfx:${id}`, e.file));
    const lang = settings.get('lang');
    for (const id of this.voiceIds) jobs.push(() => this._load(`voice:${lang}:${id}`, this.voicePath(id, lang)));
    this.loadedLangs.add(lang);
    let done = 0;
    const total = jobs.length;
    const worker = async () => {
      while (jobs.length) {
        const job = jobs.shift();
        await job();
        done++;
        onProgress?.(done / total);
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
  }

  async loadVoices(lang) {
    if (this.loadedLangs.has(lang)) return;
    this.loadedLangs.add(lang);
    await Promise.all(this.voiceIds.map((id) => this._load(`voice:${lang}:${id}`, this.voicePath(id, lang))));
  }

  /** ユーザー操作の中で呼ぶ(スマホの音声ロック解除) */
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.ctx.resume();
    // iOS 対策: 無音を一度鳴らす
    const b = this.ctx.createBuffer(1, 1, 22050);
    const s = this.ctx.createBufferSource();
    s.buffer = b;
    s.connect(this.ctx.destination);
    s.start(0);
    if (this.pendingBGM) {
      const id = this.pendingBGM;
      this.pendingBGM = null;
      this.playBGM(id);
    }
  }

  // ---------- BGM ----------
  playBGM(id, { fade = 1.0, restart = false } = {}) {
    if (!this.unlocked) { this.pendingBGM = id; return; }
    if (!restart && this.currentBGM?.id === id) return;
    this.stopBGM(fade);
    const entry = this.manifest.bgm?.[id];
    const buf = this.buffers.get(`bgm:${id}`);
    if (!buf) {
      this.synth.playBGM(entry?.fallback || id);
      this.currentBGM = { id, synth: true };
      return;
    }
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = entry?.loop !== false;
    if (entry?.loopStart) src.loopStart = entry.loopStart;
    if (entry?.loopEnd) src.loopEnd = entry.loopEnd;
    const g = ctx.createGain();
    const vol = entry?.volume ?? 0.8;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + fade);
    src.connect(g).connect(this.bgmBus);
    src.start();
    this.currentBGM = { id, src, gain: g };
  }

  stopBGM(fade = 1.0) {
    const cur = this.currentBGM;
    this.currentBGM = null;
    this.pendingBGM = null;
    if (!cur) return;
    if (cur.synth) { this.synth.stopBGM(fade); return; }
    const now = this.ctx.currentTime;
    cur.gain.gain.cancelScheduledValues(now);
    cur.gain.gain.setValueAtTime(cur.gain.gain.value, now);
    cur.gain.gain.linearRampToValueAtTime(0.0001, now + fade);
    cur.src.stop(now + fade + 0.05);
  }

  // ---------- SFX ----------
  sfx(id, { volume = 1, rate = 1, jitter = 0.04, minGap = 0.03 } = {}) {
    if (!this.unlocked) return;
    const now = this.ctx.currentTime;
    if (now - (this.lastSfxTime.get(id) || 0) < minGap) return;
    this.lastSfxTime.set(id, now);
    const entry = this.manifest.sfx?.[id];
    const buf = this.buffers.get(`sfx:${id}`);
    if (!buf) { this.synth.sfx(entry?.fallback || id); return; }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * jitter);
    const g = this.ctx.createGain();
    g.gain.value = (entry?.volume ?? 1) * volume;
    src.connect(g).connect(this.sfxBus);
    src.start();
  }

  // ---------- Voice ----------
  hasVoice(id) {
    return !!this.buffers.get(`voice:${settings.get('lang')}:${id}`);
  }

  /**
   * ボイス再生。ファイルが無いときは null を返す(字幕だけ表示される)。
   * @returns {{duration:number, ended:Promise<void>}|null}
   */
  voice(id, { duck = true } = {}) {
    if (!this.unlocked) return null;
    const buf = this.buffers.get(`voice:${settings.get('lang')}:${id}`);
    if (!buf) return null;
    this.stopVoice();
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = this.manifest.voice?.volume ?? 1;
    src.connect(g).connect(this.voiceBus);
    src.start();
    if (duck) {
      const now = ctx.currentTime;
      this.bgmDuck.gain.cancelScheduledValues(now);
      this.bgmDuck.gain.setTargetAtTime(0.45, now, 0.08);
    }
    const ended = new Promise((resolve) => {
      src.onended = () => {
        if (this.currentVoice?.src === src) {
          this.currentVoice = null;
          this.bgmDuck.gain.setTargetAtTime(1, ctx.currentTime, 0.25);
        }
        resolve();
      };
    });
    this.currentVoice = { id, src };
    return { duration: buf.duration, ended };
  }

  stopVoice() {
    if (!this.currentVoice) return;
    try { this.currentVoice.src.stop(); } catch { /* already stopped */ }
    this.currentVoice = null;
    this.bgmDuck.gain.setTargetAtTime(1, this.ctx.currentTime, 0.25);
  }
}
