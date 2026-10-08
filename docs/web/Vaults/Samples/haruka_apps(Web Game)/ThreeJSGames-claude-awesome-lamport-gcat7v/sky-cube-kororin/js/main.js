// =========================================================
// SKY CUBE KORORIN — エントリーポイント
// © 2026 haruka_apps
//
// デバッグ用 URL パラメータ:
//   ?scene=game&stage=2   … ステージ2から
//   ?scene=outro|ending|credits|intro
//   ?autostart=1          … 「タップして はじめる」を省略(音は鳴りません)
// =========================================================
import { CONFIG } from './config.js';
import { Engine } from './core/Engine.js';
import { Input } from './core/Input.js';
import { AudioManager } from './core/AudioManager.js';
import { SceneManager } from './core/SceneManager.js';
import { settings } from './core/Settings.js';
import { loadI18n, t } from './core/I18n.js';
import { UI } from './ui/UI.js';
import { Subtitles } from './ui/Subtitles.js';
import { TitleScene } from './scenes/TitleScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { GameScene } from './scenes/GameScene.js';
import { OutroScene } from './scenes/OutroScene.js';
import { EndingScene } from './scenes/EndingScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';

async function boot() {
  const bar = document.getElementById('boot-bar-fill');
  const msg = document.getElementById('boot-msg');
  const startBtn = document.getElementById('boot-start');
  const bootEl = document.getElementById('boot');
  const setProgress = (p) => { bar.style.width = `${Math.round(p * 100)}%`; };

  try {
    const [script, credits] = await Promise.all([
      fetch('data/script.json').then((r) => r.json()),
      fetch('data/credits.json').then((r) => r.json()),
      loadI18n(),
    ]);
    setProgress(0.1);

    const canvas = document.getElementById('game-canvas');
    const engine = new Engine(canvas);
    engine.applyQuality(settings.resolvedQuality());

    const audio = new AudioManager();
    await audio.init('assets/audio/manifest.json', script.lines.map((l) => l.id));
    msg.textContent = t('loading');
    await audio.preload((p) => setProgress(0.1 + p * 0.85));
    setProgress(1);

    const input = new Input(canvas);
    const ui = new UI(document.getElementById('ui-root'), audio);
    const subtitles = new Subtitles(document.getElementById('subtitle-root'), audio, script);

    const ctx = {
      version: CONFIG.version,
      engine, audio, input, ui, subtitles,
      data: { script, credits },
      flags: {},
    };
    const manager = new SceneManager(engine, ctx);
    ctx.manager = manager;
    manager.register('title', TitleScene);
    manager.register('intro', IntroScene);
    manager.register('game', GameScene);
    manager.register('outro', OutroScene);
    manager.register('ending', EndingScene);
    manager.register('credits', CreditsScene);

    settings.addEventListener('change', (e) => {
      if (e.detail.key === 'quality') engine.applyQuality(settings.resolvedQuality());
      if (e.detail.key === 'lang') document.documentElement.lang = e.detail.value;
    });
    document.documentElement.lang = settings.get('lang');

    engine.start((dt, rawDt) => {
      input.update();
      manager.update(dt, rawDt);
      input.endFrame();
    });

    const params = new URLSearchParams(location.search);
    const first = params.get('scene') || 'title';
    const firstParams = first === 'game' ? { stage: Math.max(0, (Number(params.get('stage')) || 1) - 1) } : {};
    // タイトル(または指定シーン)を 起動画面の うしろで 準備
    await manager.go(first, firstParams);

    const begin = () => {
      audio.unlock();
      bootEl.classList.add('fade');
      setTimeout(() => bootEl.remove(), 700);
    };
    if (params.get('autostart')) {
      begin();
    } else {
      msg.textContent = '';
      startBtn.textContent = t('tapToStart');
      startBtn.classList.remove('hidden');
      startBtn.addEventListener('click', begin, { once: true });
      startBtn.focus();
    }
    window.__skycube = ctx; // デバッグ用
  } catch (err) {
    console.error(err);
    msg.textContent = `${t('bootError')} (${err.message})`;
  }
}

boot();
