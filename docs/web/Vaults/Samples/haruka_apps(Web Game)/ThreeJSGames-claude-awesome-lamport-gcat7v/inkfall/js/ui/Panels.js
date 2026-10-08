// =========================================================
// Panels — あそびかた / 設定 / クレジット / ポーズ / ソロメニュー
// =========================================================
import { el } from './UI.js';
import { t, pick, isTouch } from '../core/I18n.js';
import { settings } from '../core/Settings.js';
import { CONFIG } from '../config.js';

export function openHowto(ui, { onClose } = {}) {
  const touch = isTouch();
  const pages = [
    { title: 'howto.p1.title', text: touch ? 'howto.p1.touch' : 'howto.p1.pc', art: 'move' },
    { title: 'howto.p2.title', text: touch ? 'howto.p2.touch' : 'howto.p2.pc', art: 'paint' },
    { title: 'howto.p3.title', text: touch ? 'howto.p3.touch' : 'howto.p3.pc', art: 'flip' },
    { title: 'howto.p4.title', text: touch ? 'howto.p4.touch' : 'howto.p4.pc', art: 'stamp' },
    { title: 'howto.p5.title', text: touch ? 'howto.p5.touch' : 'howto.p5.pc', art: 'tag' },
  ];
  let i = 0;
  const m = ui.modal({ title: t('howto'), icon: 'help', onClose });
  const render = () => {
    const p = pages[i];
    m.body.innerHTML = '';
    const page = el('div', { class: 'howto-page' });
    page.append(el('div', { class: `howto-art art-${p.art}` }), el('h3', { text: t(p.title) }));
    const para = el('p');
    para.innerHTML = t(p.text);
    page.append(para, el('div', { class: 'dots' }, pages.map((_, k) => el('span', { class: k === i ? 'on' : '' }))));
    m.body.append(page);
    m.foot.innerHTML = '';
    if (i > 0) m.foot.append(ui.button({ label: t('prev'), icon: 'back', cls: 'ghost small', sfx: 'ui_back', onClick: () => { i--; render(); } }));
    if (i < pages.length - 1) m.foot.append(ui.button({ label: t('next'), icon: 'next', cls: 'primary small', onClick: () => { i++; render(); } }));
    else m.foot.append(ui.button({ label: t('ok'), icon: 'check', cls: 'primary small', onClick: () => m.close() }));
  };
  render();
  return m;
}

export function openSettings(ui, { onClose, onLangChange } = {}) {
  const m = ui.modal({ title: t('settings'), icon: 'gear', onClose });
  const slider = (key, min = 0, max = 1, step = 0.05) => {
    const input = el('input', { type: 'range', class: 'slider', min, max, step, value: settings.get(key), 'aria-label': key });
    const sync = () => input.style.setProperty('--p', `${((input.value - min) / (max - min)) * 100}%`);
    sync();
    input.addEventListener('input', () => { settings.set(key, Number(input.value)); sync(); });
    input.addEventListener('change', () => ui.audio.sfx('ui_toggle'));
    return input;
  };
  const seg = (key, options, after) => {
    const wrap = el('div', { class: 'seg' });
    const btns = options.map((o) => {
      const b = el('button', { type: 'button', text: o.label });
      b.classList.toggle('on', settings.data[key] === o.value);
      b.addEventListener('click', () => {
        ui.audio.sfx('ui_toggle');
        settings.set(key, o.value);
        btns.forEach((x, k) => x.classList.toggle('on', options[k].value === o.value));
        after?.();
      });
      return b;
    });
    wrap.append(...btns);
    return wrap;
  };
  const row = (label, control, desc) => el('div', { class: 'set-row' }, el('div', { class: 'set-label' }, t(label), desc ? el('small', { text: t(desc) }) : null), control);
  const onOff = (key) => seg(key, [{ label: t('on'), value: true }, { label: t('off'), value: false }]);
  const render = () => {
    m.panel.querySelector('.panel-head .title').textContent = t('settings');
    m.body.innerHTML = '';
    m.body.append(
      el('div', { class: 'set-group', text: t('set.audio') }),
      row('set.bgm', slider('bgm')),
      row('set.sfx', slider('sfx')),
      row('set.voice', slider('voice')),
      el('div', { class: 'set-group', text: t('set.controls') }),
      row('set.sens', slider('sensitivity', 0.3, 2.5, 0.05)),
      row('set.invertY', onOff('invertY')),
      row('set.controlType', seg('controls', [{ label: t('auto'), value: 'auto' }, { label: t('mouse'), value: 'mouse' }, { label: t('touch'), value: 'touch' }])),
      el('div', { class: 'set-group', text: t('set.display') }),
      row('set.lang', seg('language', [{ label: t('auto'), value: 'auto' }, { label: 'English', value: 'en' }, { label: '日本語', value: 'ja' }], () => { onLangChange?.(); render(); })),
      row('set.colors', seg('colorMode', [{ label: t('colors.standard'), value: 'standard' }, { label: t('colors.accessible'), value: 'accessible' }]), 'set.colorsDesc'),
      row('set.subtitles', onOff('subtitles')),
      row('set.reduceMotion', onOff('reduceMotion'), 'set.reduceMotionDesc'),
      row('set.quality', seg('quality', [{ label: t('auto'), value: 'auto' }, { label: t('q.low'), value: 'low' }, { label: t('q.medium'), value: 'medium' }, { label: t('q.high'), value: 'high' }])),
    );
    m.foot.innerHTML = '';
    m.foot.append(ui.button({ label: t('ok'), icon: 'check', cls: 'primary small', onClick: () => m.close() }));
  };
  render();
  return m;
}

export function openCredits(ui, credits, { onClose } = {}) {
  const m = ui.modal({ title: t('credits'), icon: 'star', onClose });
  const list = el('div', { class: 'credit-list' });
  for (const s of credits.sections) {
    list.append(el('div', { class: 'role', text: pick(s.role) }));
    for (const n of s.names) {
      list.append(el('div', { class: 'name', text: pick(n.name ?? n) }));
      if (n.note) list.append(el('div', { class: 'note', text: pick(n.note) }));
    }
  }
  list.append(el('div', { class: 'copyright', text: pick(credits.copyright) }));
  if (credits.notice) list.append(el('div', { class: 'note', text: pick(credits.notice) }));
  m.body.append(list);
  m.foot.append(ui.button({ label: t('close'), icon: 'back', cls: 'ghost small', sfx: 'ui_back', onClick: () => m.close() }));
  return m;
}

export function openPause(ui, { online, onResume, onLeave, onRestart, onLangChange }) {
  let silent = false;
  const m = ui.modal({ title: t('paused'), icon: 'pause', onClose: () => { if (!silent) onResume?.(); } });
  m.closeSilently = () => { silent = true; m.close(); };
  if (online) m.body.append(el('p', { class: 'note-online', text: t('pause.online') }));
  else m.body.style.display = 'none';
  const col = el('div', { class: 'menu-col' });
  col.append(ui.button({ label: t('resume'), icon: 'play', cls: 'primary', onClick: () => m.close() }));
  if (onRestart) col.append(ui.button({ label: t('restart'), icon: 'retry', cls: 'ghost', onClick: () => { m.closeSilently(); onRestart(); } }));
  col.append(ui.button({ label: t('settings'), icon: 'gear', cls: 'ghost', onClick: () => openSettings(ui, { onLangChange }) }));
  col.append(ui.button({ label: online ? t('leaveMatch') : t('toTitle'), icon: 'home', cls: 'danger', sfx: 'ui_back', onClick: () => { m.closeSilently(); onLeave?.(); } }));
  m.foot.append(col);
  return m;
}

/** ソロメニュー */
export function openSolo(ui, { onPick, best = {}, onLeaderboard }) {
  const m = ui.modal({ title: t('solo'), icon: 'solo' });
  const card = (id, icon, title, desc, extra) => {
    const b = el('button', { class: 'mode-card', type: 'button' });
    b.innerHTML = `<span class="mc-ico">${''}</span>`;
    b.querySelector('.mc-ico').innerHTML = ui.iconHTML(icon);
    b.append(el('span', { class: 'mc-title', text: t(title) }), el('span', { class: 'mc-desc', text: t(desc) }));
    if (extra) b.append(el('span', { class: 'mc-extra', text: extra }));
    b.addEventListener('click', () => { ui.audio.sfx('ui_select'); m.close(); onPick(id); });
    return b;
  };
  const grid = el('div', { class: 'mode-grid' },
    card('training', 'target', 'mode.training', 'mode.trainingDesc'),
    card('turf', 'team', 'mode.cpuTurf', 'mode.cpuTurfDesc'),
    card('tag', 'bomb', 'mode.cpuTag', 'mode.cpuTagDesc'),
    card('challenge', 'trophy', 'mode.challenge', 'mode.challengeDesc', best.challenge ? `${t('best')}: ${best.challenge}` : ''),
  );
  m.body.append(grid);
  m.foot.append(ui.button({ label: t('leaderboard'), icon: 'trophy', cls: 'ghost small', onClick: () => onLeaderboard?.() }));
  m.foot.append(ui.button({ label: t('close'), icon: 'back', cls: 'ghost small', sfx: 'ui_back', onClick: () => m.close() }));
  return m;
}

export function openLeaderboard(ui, entries, { error, mine } = {}) {
  const m = ui.modal({ title: t('leaderboard'), icon: 'trophy' });
  m.body.append(el('p', { class: 'lb-sub', text: t('lb.sub', { s: CONFIG.challenge.duration }) }));
  if (error) m.body.append(el('p', { class: 'note-online', text: error }));
  const list = el('ol', { class: 'lb-list' });
  for (const e of entries) {
    const li = el('li', { class: e.userId && e.userId === mine ? 'me' : '' },
      el('span', { class: 'lb-rank', text: `#${e.globalRank ?? e.rank ?? ''}` }),
      el('span', { class: 'lb-name', text: e.username || e.name || 'Player' }),
      el('span', { class: 'lb-score', text: String(e.score ?? e.value ?? '') }));
    list.append(li);
  }
  if (!entries.length && !error) list.append(el('li', { class: 'empty', text: t('lb.empty') }));
  m.body.append(list);
  m.foot.append(ui.button({ label: t('close'), icon: 'back', cls: 'ghost small', sfx: 'ui_back', onClick: () => m.close() }));
  return m;
}
