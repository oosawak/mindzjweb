/* =========================================================
 *  CHEAT JANKI! — アプリ本体（画面遷移・設定・対局の開始/終了）
 * ========================================================= */
(function (root) {
  'use strict';
  const { $, $$, sleep, esc } = root.U;
  const t = (k, v) => root.I18N.t(k, v);
  const L = () => root.I18N.lang;
  const { CHARS, byId: charById } = root.Chars;
  const LINES = root.Lines.LINES;
  let save, game = null, gameUI = null, audioUnlocked = false, currentScreen = null;
  let setupState = null, lastSetup = null;

  /* ---------------- 起動 ---------------- */
  async function boot() {
    save = root.Save.load();
    root.I18N.setLang(save.settings.lang);
    applySettings();
    root.Scene3D.init($('#scene'));
    root.FX.init($('#fx-canvas'), $('#fx-layer'));
    await root.Chars.probeExternal();
    root.Scene3D.setupSeats(4);
    root.Scene3D.idle(true);
    bindGlobal();
    applyLang();
    showScreen('title');
    $('#loading').classList.add('done');
    setTimeout(() => $('#loading') && $('#loading').remove(), 800);
  }
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    root.Audio2.unlock();
    root.Audio2.preloadCore && root.Audio2.preloadCore();
    applySettings();
    $('.tap-hint') && $('.tap-hint').classList.add('gone');
    if (currentScreen === 'title' || currentScreen === 'setup') {
      root.Sound.playBGM('title');
      if (currentScreen === 'title') setTimeout(() => root.Audio2.voice('announcer', 'title', { priority: 2 }), 400);
    }
  }
  function applySettings() {
    const s = save.settings;
    root.Audio2.setSettings({ master: s.master, bgm: s.bgm, sfx: s.sfx, voice: s.voice, voiceOn: s.voiceOn, voiceLang: s.voiceLang === 'follow' ? root.I18N.lang : s.voiceLang });
    root.Scene3D.speed = s.speed;
    root.FX.speed = s.speed;
    root.FX.lite = s.lite;
    document.body.classList.toggle('lite', !!s.lite);
    root.Scene3D.tapConfirm = s.tapConfirm !== false;
  }
  function applyLang() {
    root.I18N.apply();
    document.title = L() === 'en' ? 'CHEAT JANKI! — 3D Mahjong of Forbidden Moves' : 'イカサマ☆雀姫 — CHEAT JANKI!';
    $('.tap-hint').textContent = root.U.isTouch() ? t('misc.tapSound') : t('misc.clickSound');
    buildHowto(); buildCredits(); refreshTitle(); syncSettingsForm();
    if (currentScreen === 'setup') buildSetup();
    if (gameUI && game && game.h) { gameUI.buildHUD(); gameUI.updateHUD(); gameUI.updateHint(); }
  }
  function setLang(v) {
    save.settings.lang = v; root.Save.persist();
    root.I18N.setLang(v);
    applySettings();
    applyLang();
  }

  function showScreen(name) {
    currentScreen = name;
    $$('.screen').forEach(el => el.classList.toggle('active', el.id === name));
    $('#hud').classList.toggle('hidden', name !== 'game');
    if (name === 'title') { buildTitle(); refreshTitle(); if (audioUnlocked) root.Sound.playBGM('title'); root.Scene3D.idle(true); }
    if (name === 'setup') { buildSetup(); if (audioUnlocked) root.Sound.playBGM('title'); }
  }

  function bindGlobal() {
    const unlock = () => unlockAudio();
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (b) { root.Sound.sfx('click'); showScreen(b.dataset.go); }
      const m = e.target.closest('[data-modal]');
      if (m) { root.Sound.sfx('click'); openModal(m.dataset.modal); }
      const c = e.target.closest('[data-close]');
      if (c) { root.Sound.sfx('click'); closeModal(c.closest('.modal')); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { const open = $('.modal.open'); if (open) closeModal(open); }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) root.Audio2.suspend(); else root.Audio2.resume(); });
    $('#btn-lang').addEventListener('click', () => { root.Sound.sfx('click'); setLang(L() === 'en' ? 'ja' : 'en'); });
    // 設定
    const s = save.settings;
    const upd = () => {
      s.master = +$('#set-master').value; s.bgm = +$('#set-bgm').value; s.sfx = +$('#set-sfx').value; s.voice = +$('#set-voice').value;
      s.voiceOn = $('#set-voiceon').checked; s.voiceLang = $('#set-voicelang').value;
      s.speed = +$('#set-speed').value; s.assist = $('#set-assist').checked; s.lite = $('#set-lite').checked;
      s.autoSkipCall = $('#set-autoskip').checked; s.tapConfirm = $('#set-tapconfirm').checked;
      applySettings(); root.Save.persist();
      if (gameUI) gameUI.updateHint();
    };
    $$('#settings input, #settings select:not(#set-lang)').forEach(i => i.addEventListener('input', upd));
    $('#set-lang').addEventListener('input', () => setLang($('#set-lang').value));
    $('#set-test').addEventListener('click', () => { unlockAudio(); const id = (setupState && setupState.me) || save.last.me; root.Audio2.voice(id, 'cheat', { force: true }); });
    let armed = false, armT = null;
    $('#set-reset').addEventListener('click', () => {
      if (!armed) { armed = true; $('#set-reset').textContent = t('set.resetConfirm'); clearTimeout(armT); armT = setTimeout(() => { armed = false; $('#set-reset').textContent = t('set.reset'); }, 4000); return; }
      root.Save.reset(); location.reload();
    });
    let quitArmed = false, quitT = null;
    $('#btn-quit').addEventListener('click', () => {
      if (!quitArmed) { quitArmed = true; root.FXC.toast(t('quit.confirm')); clearTimeout(quitT); quitT = setTimeout(() => { quitArmed = false; }, 3000); return; }
      quitArmed = false; toTitle();
    });
    $('#btn-auto').addEventListener('click', () => {
      if (!gameUI) return;
      gameUI.auto = !gameUI.auto;
      $('#btn-auto').classList.toggle('on', gameUI.auto);
      root.FX.cutIn({ kind: 'stamp', text: gameUI.auto ? t('auto.on') : t('auto.off'), color: '#6fd5ff' });
      if (gameUI.auto && gameUI.pending && gameUI.pending.autoFn) gameUI.pending.autoFn();
    });
    $('#cred-roll').addEventListener('click', () => { closeModal($('#credits')); showRoll(() => showScreen('title')); });
  }
  function openModal(id) { if (id === 'settings') syncSettingsForm(); $('#' + id).classList.add('open'); }
  function closeModal(el) { if (el) el.classList.remove('open'); }
  function syncSettingsForm() {
    const s = save.settings;
    $('#set-lang').value = s.lang; $('#set-master').value = s.master; $('#set-bgm').value = s.bgm; $('#set-sfx').value = s.sfx; $('#set-voice').value = s.voice;
    $('#set-voiceon').checked = s.voiceOn; $('#set-voicelang').value = s.voiceLang; $('#set-speed').value = String(s.speed);
    $('#set-assist').checked = s.assist; $('#set-lite').checked = s.lite; $('#set-autoskip').checked = s.autoSkipCall; $('#set-tapconfirm').checked = s.tapConfirm !== false;
    const n = root.Audio2.count();
    $('#set-soundinfo').textContent = n ? t('set.sound', { n }) : t('set.soundNone');
    $('#set-reset').textContent = t('set.reset');
  }

  /* ---------------- タイトル ---------------- */
  function buildTitle() {
    const picks = root.U.shuffle(CHARS).slice(0, 5);
    $('#title-chars').innerHTML = picks.map((ch, i) => `<img class="tc tc${i}" src="${root.Chars.artURL(ch, { variant: i % 3 })}" style="--d:${i * 0.35}s" alt="">`).join('');
  }
  function refreshTitle() {
    const st = save.stats;
    $('#title-record').textContent = st.games ? t('title.record', { games: st.games, tops: st.tops, rank: st.bestRank }) : '';
  }

  /* ---------------- 対局設定 ---------------- */
  const nameOf = (ch) => L() === 'en' ? LINES[ch.id].nameEn : ch.name;
  const titleOf = (ch) => L() === 'en' ? LINES[ch.id].titleEn : ch.title;
  const sigHTML = (id) => { const g = root.Chaos.SIGS[id]; return g ? `<div class="sig-chip" style="--c:${g.color}" title="${esc(g[L()].desc)}"><span class="ck">${esc(g.kanji)}</span><span><i>${esc(t('setup.sig'))}</i><b>${esc(g[L()].name)}</b></span></div>` : ''; };
  const meter = (v, max) => `<span class="meter"><i style="width:${Math.min(100, v / max * 100)}%"></i></span>`;
  function buildSetup() {
    setupState = setupState || { mode: save.last.mode, me: save.last.me, outfit: save.last.outfit, opponents: null };
    if (!charById[setupState.me]) setupState.me = 'hiyori';
    const me = charById[setupState.me];
    const n = setupState.mode === '3p' ? 3 : 4;
    $$('#setup .seg[data-key="mode"] button').forEach(b => {
      b.classList.toggle('on', b.dataset.val === setupState.mode);
      b.onclick = () => { root.Sound.sfx('click'); setupState.mode = b.dataset.val; setupState.opponents = null; buildSetup(); };
    });
    $('#setup-note').textContent = t(n === 3 ? 'setup.note3p' : 'setup.note4p') + ' ' + t('setup.length');
    const X = LINES[me.id];
    $('#me-card').innerHTML = `<div class="me-art" style="--c:${me.color}"><img src="${root.Chars.artURL(me, { variant: setupState.outfit })}" alt=""></div>
      <div class="me-info" style="--c:${me.color}"><div class="me-name">${esc(nameOf(me))}</div><div class="me-title">${esc(titleOf(me))}</div>
      <div class="me-line">「${esc(L() === 'en' ? X.en.sig : X.ja.sig[0])}」</div>${sigHTML(me.id)}</div>`;
    $('#outfit-seg').innerHTML = [0, 1, 2].map(v => `<button data-v="${v}" class="${v === setupState.outfit ? 'on' : ''}"><img src="${root.Chars.artURL(me, { variant: v })}" alt=""></button>`).join('');
    $$('#outfit-seg button').forEach(b => b.onclick = () => { root.Sound.sfx('click'); setupState.outfit = +b.dataset.v; buildSetup(); });
    $('#char-grid').innerHTML = CHARS.map(c => `<button class="cg ${c.id === me.id ? 'on' : ''}" data-id="${c.id}" style="--c:${c.color}" title="${esc(nameOf(c))}"><img src="${root.Chars.artURL(c, { variant: 0 })}" alt=""><span>${esc(nameOf(c))}</span></button>`).join('');
    $$('#char-grid .cg').forEach(b => b.onclick = () => {
      root.Sound.sfx('click');
      setupState.me = b.dataset.id;
      if (setupState.opponents && setupState.opponents.includes(b.dataset.id)) setupState.opponents = null;
      buildSetup();
      if (audioUnlocked) root.Audio2.voice(b.dataset.id, 'start', { force: true });
    });
    if (!setupState.opponents || setupState.opponents.length !== n - 1 || setupState.opponents.includes(me.id)) {
      setupState.opponents = root.U.shuffle(CHARS.filter(c => c.id !== me.id)).slice(0, n - 1).map(c => c.id);
    }
    $('#setup-opps').innerHTML = setupState.opponents.map(id => {
      const c = charById[id];
      return `<div class="opp" style="--c:${c.color}"><img src="${root.Chars.artURL(c, { variant: 0 })}" alt=""><span>${esc(nameOf(c))}</span><small>${esc(titleOf(c))}</small>${sigHTML(id)}</div>`;
    }).join('');
    $('#setup-shuffle').onclick = () => { root.Sound.sfx('click'); setupState.opponents = null; buildSetup(); };
    $('#setup-start').onclick = () => {
      root.Sound.sfx('ui_start');
      save.last = { mode: setupState.mode, me: setupState.me, outfit: setupState.outfit };
      root.Save.persist();
      startGame();
    };
  }

  /* ---------------- 遊び方 ---------------- */
  const HOWTO = {
    ja: {
      intro: '<b>東風戦のリーチ麻雀</b>（4人：東1〜東4局 ／ 3人：東1〜東3局）。ただしこの卓は<b>無法地帯</b>。全員がイカサマし放題で、バレることも罰もありません。',
      gauge: '自分の番が来るたびに<b>技ゲージ</b>が1たまります（最大5）。技ごとに決まった数（●）を払えば、反則技は<b>必ず成功</b>します。',
      cheats: '反則技（自分の番に、画面の反則技ボタン or 数字キー）',
      sig: '12人それぞれに<b>固有技</b>があります（ゲージ3・キー6）。相手も遠慮なく使ってきます。',
      events: '1局に2回、<b>卓が荒れるイベント</b>が起きます。',
      fake: ['和了ったら、手持ちの<b>言葉カード</b>（毎巡1枚もらえる）を最大4枚組み合わせて、存在しない役を<b>でっち上げ</b>ます。',
        '手牌と噛み合う言葉（★）は+2翻、頭・中身・締めがそろうと+1翻（最大6翻）。役がひとつもない手でも、でっち上げ役で和了れます。'],
      flip: '相手が和了った瞬間、ゲージが4あれば「ちゃぶ台返し!!」でその局をなかったことにできます。',
      rank: '終局後、使った反則技・固有技・でっち上げ役の翻数・順位から、派手さで<b>反則王ランク</b>（S/A/B/C）が決まります。',
      keys: 'キー操作: 1〜5 反則技 ／ 6 固有技 ／ F ちゃぶ台返し ／ Esc やめる',
      h: ['ルール', '技ゲージ', '反則技', '固有技', '卓が荒れるイベント', 'でっち上げ役', 'ちゃぶ台返し', '反則王ランク'],
    },
    en: {
      intro: '<b>East-only riichi mahjong</b> (4 players: East 1–4 / 3 players: East 1–3). But this table is <b>lawless</b>: everyone cheats freely, and nobody ever gets caught or punished.',
      gauge: 'Your <b>gauge</b> fills by 1 every turn (max 5). Pay a cheat\'s cost (●) and it <b>always works</b>.',
      cheats: 'Cheats (on your turn, use the cheat buttons or number keys)',
      sig: 'Each of the 12 characters has a <b>signature move</b> (3 gauge, key 6). Your opponents use theirs without hesitation.',
      events: 'Twice every hand, <b>chaos events</b> shake up the table.',
      fake: ['When you win, combine up to 4 <b>word cards</b> (you get one every turn) to <b>make up</b> a yaku that does not exist.',
        'Words that match your hand (★) add 2 han; a head, core and finish together add 1 more (max 6). You can even win a hand with no real yaku.'],
      flip: 'When an opponent wins and you have 4 gauge, "TABLE FLIP!!" makes the hand never happen.',
      rank: 'After the match, your cheats, signature moves, made-up han and placing decide your <b>Cheat King Rank</b> (S/A/B/C). It is all about style.',
      keys: 'Keys: 1–5 cheats / 6 signature / F table flip / Esc cancels',
      h: ['Rules', 'Gauge', 'Cheats', 'Signature Moves', 'Chaos Events', 'Made-up Yaku', 'Table Flip', 'Cheat King Rank'],
    },
  };
  function buildHowto() {
    const H = HOWTO[L()];
    const card = (c, cost, key) => `<div class="hw-cheat" style="--c:${c.color}"><span class="ck">${esc(c.kanji)}</span><div><b>${esc(c[L()].name)}</b> ${key ? `<kbd>${key}</kbd>` : ''} ${cost ? `<em class="cost">${'●'.repeat(cost)}</em>` : ''}<br><span>${esc(c[L()].desc)}</span></div></div>`;
    const cheats = root.Cheats.CHEATS.map(c => card(c, c.cost, c.key)).join('');
    const sigs = root.Chars.CHARS.map(ch => { const g = root.Chaos.SIGS[ch.id]; return g ? card(Object.assign({}, g, { ja: { name: `${ch.name}「${g.ja.name}」`, desc: g.ja.desc }, en: { name: `${LINES[ch.id].nameEn}: ${g.en.name}`, desc: g.en.desc } }), 0, '') : ''; }).join('');
    const evs = root.Chaos.EVENTS.map(e => card(e, 0, '')).join('');
    $('#howto-body').innerHTML = `<h4>${H.h[0]}</h4><p>${H.intro}</p>
      <h4>${H.h[1]}</h4><p>${H.gauge}</p>
      <h4>${H.h[2]}</h4><p class="hw-sub">${esc(H.cheats)}</p><div class="hw-cheats">${cheats}</div>
      <h4>${H.h[3]}</h4><p>${H.sig}</p><div class="hw-cheats">${sigs}</div>
      <h4>${H.h[4]}</h4><p>${H.events}</p><div class="hw-cheats">${evs}</div>
      <h4>${H.h[5]}</h4><ul>${H.fake.map(x => `<li>${x}</li>`).join('')}</ul>
      <h4>${H.h[6]}</h4><p>${H.flip}</p>
      <h4>${H.h[7]}</h4><p>${H.rank}</p>
      <p class="hw-keys">${esc(H.keys)}</p>`;
  }

  /* ---------------- クレジット・スタッフロール ---------------- */
  const credText = (x) => typeof x === 'string' ? x : x[L()];
  function buildCredits() {
    $('#credits-body').innerHTML = root.Credits.CREDITS.map(sec => `<div class="cr-sec"><h4>${esc(credText(sec.head))}</h4>${sec.lines.map(l => `<div>${esc(credText(l))}</div>`).join('')}</div>`).join('') +
      `<div class="cr-copy">${esc(root.Credits.COPYRIGHT)}</div>`;
  }
  function showRoll(after) {
    const ov = $('#roll');
    const lines = root.Credits.CREDITS.map(sec => `<div class="rl-sec"><h4>${esc(credText(sec.head))}</h4>${sec.lines.map(l => `<p>${esc(credText(l))}</p>`).join('')}</div>`).join('');
    const arts = root.U.shuffle(CHARS).slice(0, 6).map((c, i) => `<img class="rl-art rl-a${i}" src="${root.Chars.artURL(c, { variant: i % 3 })}" alt="">`).join('');
    ov.innerHTML = `<div class="rl-arts">${arts}</div><div class="rl-mask"></div>
      <div class="rl-track"><div class="rl-logo"><span>イカサマ☆雀姫</span><small>CHEAT JANKI!</small></div>${lines}
      <div class="rl-end"><div class="rl-thanks">${esc(t('roll.thanks'))}</div><div class="rl-again">${esc(t('roll.again'))}</div><div class="rl-copy">${esc(root.Credits.COPYRIGHT)}</div></div></div>
      <button class="btn tiny rl-skip">${esc(t('roll.skip'))}</button>`;
    ov.classList.add('open');
    root.Sound.playBGM('ending');
    const track = $('.rl-track', ov);
    let y = innerHeight, last = performance.now(), done = false;
    const total = () => track.offsetHeight;
    const finish = () => { if (done) return; done = true; ov.classList.remove('open'); setTimeout(() => { ov.innerHTML = ''; }, 400); after && after(); };
    const step = (now) => {
      if (done) return;
      const dt = Math.min(0.25, (now - last) / 1000); last = now;
      const endY = innerHeight / 2 - total() + $('.rl-end', ov).offsetHeight / 2;
      y = Math.max(endY, y - dt * Math.max(46, innerHeight / 14));
      track.style.transform = `translate(-50%, ${y}px)`;
      if (y <= endY) { if (!step.hold) step.hold = now; if (now - step.hold > 4500) return finish(); }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    $('.rl-skip', ov).onclick = (e) => { e.stopPropagation(); root.Sound.sfx('click'); finish(); };
  }

  /* =========================================================
   *  対局
   * ========================================================= */
  function startGame(resume) {
    cleanupGame();
    const st = resume ? lastSetup : (lastSetup = { mode: setupState.mode, me: setupState.me, outfit: setupState.outfit, opponents: setupState.opponents.slice(), variants: setupState.opponents.map(() => Math.floor(Math.random() * 3)) });
    const n = st.mode === '3p' ? 3 : 4;
    const seats = [{ char: charById[st.me], variant: st.outfit, human: true }]
      .concat(st.opponents.slice(0, n - 1).map((id, i) => ({ char: charById[id], variant: st.variants[i], human: false })));
    const players = seats.map(s => ({ name: s.char.name, human: s.human, style: s.char.ai, char: s.char.id }));
    const G = new root.RiotMod.RiotGame({ mode: st.mode, length: 'east', players, ui: null, resume: resume || null });
    gameUI = new root.GameUI(G, seats, { save, onFinal });
    G.ui = gameUI;
    game = G;
    showScreen('game');
    root.Scene3D.idle(false);
    root.Scene3D.setupSeats(n);
    G.run().catch(e => console.error(e));
  }
  function cleanupGame() {
    if (game) game.aborted = true;
    if (gameUI) gameUI.abort();
    game = null; gameUI = null;
  }
  function toTitle() {
    cleanupGame();
    root.Sound.stopBGM();
    root.Scene3D.clearAuras();
    root.Scene3D.resetCamera(0.4);
    showScreen('title');
  }
  function onFinal(action) {
    if (action === 'again') { startGame(); return; }
    if (action === 'roll') { cleanupGame(); showRoll(() => toTitle()); return; }
    toTitle();
  }

  window.addEventListener('DOMContentLoaded', boot);
  root.App = {
    showScreen, setLang,
    get game() { return game; }, get ui() { return gameUI; },
    /** テスト用: 設定画面を経由せずに開始 */
    quickStart(mode) { setupState = setupState || { mode: mode || '4p', me: 'hiyori', outfit: 1, opponents: null }; setupState.mode = mode || setupState.mode; buildSetup(); startGame(); },
    showRoll,
  };
})(typeof window !== 'undefined' ? window : globalThis);
