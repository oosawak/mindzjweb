// =========================================================
// Panels — あそびかた / せってい / クレジット / ひとやすみ
// =========================================================
import { el } from './UI.js';
import { HowtoArt } from './Icons.js';
import { t, pick, isTouch } from '../core/I18n.js';
import { settings } from '../core/Settings.js';

// ---------- あそびかた ----------
export function openHowto(ui, { onClose } = {}) {
  const pages = [
    { art: 'move', title: 'howto.move.title', text: isTouch() ? 'howto.move.touch' : 'howto.move.pc' },
    { art: 'gravity', title: 'howto.gravity.title', text: isTouch() ? 'howto.gravity.touch' : 'howto.gravity.pc' },
    { art: 'look', title: 'howto.look.title', text: isTouch() ? 'howto.look.touch' : 'howto.look.pc' },
    { art: 'goal', title: 'howto.goal.title', text: 'howto.goal.text' },
  ];
  let index = 0;
  const m = ui.modal({ title: t('howto'), icon: 'help', onClose });
  const render = () => {
    const p = pages[index];
    m.body.innerHTML = '';
    const page = el('div', { class: 'howto-page' });
    page.innerHTML = HowtoArt[p.art];
    page.append(el('h3', { text: t(p.title) }));
    const para = el('p');
    para.innerHTML = t(p.text); // i18n 側で <span class="kbd"> を使う
    page.append(para);
    const dots = el('div', { class: 'dots' }, pages.map((_, i) => el('span', { class: i === index ? 'on' : '' })));
    page.append(dots);
    m.body.append(page);

    m.foot.innerHTML = '';
    if (index > 0) m.foot.append(ui.button({ label: t('prev'), icon: 'back', cls: 'sky small', sfx: 'ui_back', onClick: () => { index--; render(); } }));
    if (index < pages.length - 1) m.foot.append(ui.button({ label: t('next'), icon: 'next', cls: 'primary small', onClick: () => { index++; render(); } }));
    else m.foot.append(ui.button({ label: t('ok'), icon: 'star', cls: 'primary small', onClick: () => m.close() }));
  };
  render();
  return m;
}

// ---------- せってい ----------
export function openSettings(ui, { onClose, onLangChange } = {}) {
  const m = ui.modal({ title: t('settings'), icon: 'gear', onClose });

  const slider = (key) => {
    const input = el('input', { type: 'range', class: 'slider', min: 0, max: 1, step: 0.05, value: settings.get(key), 'aria-label': t(`set.${key}`) });
    const sync = () => input.style.setProperty('--p', `${input.value * 100}%`);
    sync();
    input.addEventListener('input', () => { settings.set(key, Number(input.value)); sync(); });
    input.addEventListener('change', () => ui.audio.sfx(key === 'voice' ? 'pop' : 'ui_toggle'));
    return input;
  };

  const seg = (key, options) => {
    const wrap = el('div', { class: 'seg' });
    const btns = options.map((o) => {
      const b = el('button', { type: 'button', text: o.label });
      b.addEventListener('click', () => {
        ui.audio.sfx('ui_toggle');
        settings.set(key, o.value);
        btns.forEach((x, i) => x.classList.toggle('on', options[i].value === o.value));
        o.after?.();
      });
      b.classList.toggle('on', settings.get(key) === o.value);
      return b;
    });
    wrap.append(...btns);
    return wrap;
  };

  const row = (labelKey, control, descKey) =>
    el('div', { class: 'set-row' },
      el('div', { class: 'set-label' }, t(labelKey), descKey ? el('small', { text: t(descKey) }) : null),
      control);

  const onOff = (key) => seg(key, [{ label: t('on'), value: true }, { label: t('off'), value: false }]);

  const render = () => {
    m.body.innerHTML = '';
    m.body.append(
      row('set.bgm', slider('bgm')),
      row('set.sfx', slider('sfx')),
      row('set.voice', slider('voice')),
      row('set.lang', seg('lang', [
        { label: 'にほんご', value: 'ja', after: () => { onLangChange?.(); rerender(); } },
        { label: 'English', value: 'en', after: () => { onLangChange?.(); rerender(); } },
      ])),
      row('set.easy', onOff('easy'), 'set.easyDesc'),
      row('set.reduceMotion', onOff('reduceMotion'), 'set.reduceMotionDesc'),
      row('set.subtitles', onOff('subtitles')),
      row('set.quality', seg('quality', [
        { label: t('q.auto'), value: 'auto' },
        { label: t('q.low'), value: 'low' },
        { label: t('q.medium'), value: 'medium' },
        { label: t('q.high'), value: 'high' },
      ])),
    );
    m.foot.innerHTML = '';
    m.foot.append(ui.button({ label: t('ok'), icon: 'star', cls: 'primary small', onClick: () => m.close() }));
  };
  // 言語を変えたらパネルの文字も更新
  const rerender = () => {
    m.panel.querySelector('.panel-head .title').textContent = t('settings');
    render();
  };
  render();
  return m;
}

// ---------- クレジット(タイトル画面用の一覧) ----------
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
  m.foot.append(ui.button({ label: t('close'), icon: 'back', cls: 'sky small', sfx: 'ui_back', onClick: () => m.close() }));
  return m;
}

// ---------- ひとやすみ(ポーズ) ----------
export function openPause(ui, { onResume, onRespawn, onRestart, onTitle, onLangChange }) {
  let silent = false;
  const m = ui.modal({ title: t('paused'), icon: 'pause', onClose: () => { if (!silent) onResume?.(); } });
  // onResume を呼ばずに閉じる
  m.closeSilently = () => { silent = true; m.close(); };
  m.body.style.display = 'none';
  const col = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', width: 'min(80vw, 340px)' } });
  col.append(
    ui.button({ label: t('resume'), icon: 'play', cls: 'primary', onClick: () => m.close() }),
    ui.button({ label: t('respawn'), icon: 'retry', cls: 'mint', onClick: () => { m.close(); onRespawn?.(); } }),
    ui.button({ label: t('restartStage'), icon: 'retry', cls: 'sky', onClick: () => { m.closeSilently(); onRestart?.(); } }),
    ui.button({ label: t('settings'), icon: 'gear', cls: 'sky', onClick: () => openSettings(ui, { onLangChange }) }),
    ui.button({ label: t('toTitle'), icon: 'home', cls: 'pink', sfx: 'ui_back', onClick: () => { m.closeSilently(); onTitle?.(); } }),
  );
  m.foot.append(col);
  return m;
}
