// =========================================================
// INKFALL — エントリーポイント
// © 2026 haruka_apps
//
// 開発用 URL パラメータ:
//   ?fakesdk=alice     … にせ Wavedash(同じブラウザのタブ同士で対戦テスト)
//   ?scene=match&mode=turf|tag|training|challenge   … いきなり試合
//   ?autostart=1       … 「クリックして開始」を省略
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
import { WD } from './net/Wavedash.js';
import { installFakeSdk } from './net/FakeSdk.js';
import { NetSession } from './net/NetSession.js';
import { TitleScene } from './scenes/TitleScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { LobbyScene, buildSlots, BOT_NAMES } from './scenes/LobbyScene.js';
import { MatchScene } from './scenes/MatchScene.js';
import { OutroScene } from './scenes/OutroScene.js';
import { EndingScene } from './scenes/EndingScene.js';
import { CreditsScene } from './scenes/CreditsScene.js';

const params = new URLSearchParams(location.search);
if (params.get('fakesdk') && !window.Wavedash) installFakeSdk(params.get('fakesdk').replace(/[^\w-]/g, '').slice(0, 16) || 'dev');

function playerName() { return WD.username() || 'YOU'; }

function makeSoloCfg(mode) {
  const me = { id: 'local', name: playerName(), team: 1 };
  let slots;
  if (mode === 'training') {
    slots = [{ idx: 0, ...me }, ...[0, 1, 2].map((k) => ({ idx: k + 1, bot: true, ai: 'dummy', team: 2, name: `DUMMY-${k + 1}` }))];
  } else if (mode === 'challenge') {
    slots = [{ idx: 0, ...me }];
  } else if (mode === 'tag') {
    slots = [{ idx: 0, ...me, team: 0 }, ...[1, 2, 3, 4, 5].map((k) => ({ idx: k, bot: true, team: 0, name: BOT_NAMES[k] }))];
  } else {
    slots = buildSlots('turf', [me], { bots: true });
  }
  return {
    mode, arena: 'cube', slots,
    rounds: mode === 'turf' ? CONFIG.turf.rounds : 1,
    duration: mode === 'challenge' ? CONFIG.challenge.duration : CONFIG.turf.duration,
  };
}

async function boot() {
  const bar = document.getElementById('boot-bar-fill');
  const msg = document.getElementById('boot-msg');
  const startBtn = document.getElementById('boot-start');
  const bootEl = document.getElementById('boot');
  const progress = (p) => { bar.style.width = `${Math.round(p * 100)}%`; WD.progress(p); };

  try {
    const [script, credits] = await Promise.all([
      fetch('data/script.json').then((r) => r.json()),
      fetch('data/credits.json').then((r) => r.json()),
      loadI18n(),
    ]);
    progress(0.1);
    const canvas = document.getElementById('game-canvas');
    const engine = new Engine(canvas);
    engine.applyQuality(settings.resolvedQuality());
    const audio = new AudioManager();
    await audio.init('assets/audio/manifest.json', script.lines.map((l) => l.id));
    msg.textContent = t('loading');
    await audio.preload((p) => progress(0.1 + p * 0.85));
    progress(1);

    const input = new Input(canvas);
    const ui = new UI(document.getElementById('ui-root'), audio);
    const subtitles = new Subtitles(document.getElementById('subtitle-root'), audio, script);
    const net = new NetSession();

    const ctx = { version: CONFIG.version, engine, audio, input, ui, subtitles, net, t, data: { script, credits }, flags: {}, makeSoloCfg };
    const manager = new SceneManager(engine, ctx);
    ctx.manager = manager;
    ctx.goDest = (dest) => {
      if (dest === 'online') return manager.go('lobby');
      if (['training', 'turf', 'tag', 'challenge'].includes(dest)) return manager.go('match', { cfg: makeSoloCfg(dest), online: false });
      return manager.go('title');
    };
    manager.register('title', TitleScene);
    manager.register('intro', IntroScene);
    manager.register('lobby', LobbyScene);
    manager.register('match', MatchScene);
    manager.register('outro', OutroScene);
    manager.register('ending', EndingScene);
    manager.register('credits', CreditsScene);

    // オンライン: ホストが開始したら全員を試合へ
    net.start();
    net.on('start', (m, from) => {
      if (from !== net.hostId) return;
      if (manager.currentName === 'match' && !manager.current?.match?.ended) return;
      ui.clear();
      manager.go('match', { cfg: m.cfg, online: true });
    });
    const kicked = () => {
      if (!['match', 'lobby'].includes(manager.currentName)) return;
      ui.clear();
      manager.go('title').then(() => {
        const mm = ui.modal({ title: t('online'), icon: 'online' });
        mm.body.textContent = t('hostLeft');
      });
    };
    net.addEventListener('hostleft', kicked);
    net.addEventListener('closed', kicked);

    settings.addEventListener('change', (e) => {
      if (e.detail.key === 'quality') engine.applyQuality(settings.resolvedQuality());
      if (e.detail.key === 'language') document.documentElement.lang = settings.resolvedLang();
    });
    document.documentElement.lang = settings.resolvedLang();

    engine.start((dt, rawDt) => {
      input.update(rawDt);
      net.update();
      manager.update(dt, rawDt);
      input.endFrame();
    });

    // Wavedash に「読み込み完了」を伝える(SDK が無ければ何もしない)
    WD.init();

    const first = params.get('scene');
    if (first === 'match') await manager.go('match', { cfg: makeSoloCfg(params.get('mode') || 'turf'), online: false });
    else if (first && ['intro', 'lobby', 'credits', 'ending'].includes(first)) await manager.go(first, {});
    else await manager.go('title');

    const begin = () => {
      audio.unlock();
      bootEl.classList.add('fade');
      setTimeout(() => bootEl.remove(), 600);
    };
    if (params.get('autostart')) begin();
    else {
      msg.textContent = '';
      startBtn.textContent = t('clickToStart');
      startBtn.classList.remove('hidden');
      startBtn.addEventListener('click', begin, { once: true });
      startBtn.focus();
    }
    window.__inkfall = ctx;
  } catch (err) {
    console.error(err);
    msg.textContent = `${t('bootError')} (${err.message})`;
  }
}

boot();
