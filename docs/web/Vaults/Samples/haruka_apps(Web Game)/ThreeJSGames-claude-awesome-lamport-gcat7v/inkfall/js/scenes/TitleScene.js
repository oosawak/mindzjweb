// =========================================================
// TitleScene — タイトル
//  ONLINE / SOLO / HOW TO PLAY / SETTINGS / CREDITS
// =========================================================
import * as THREE from 'three';
import { BaseScene } from './BaseScene.js';
import { buildBackdrop } from './Backdrop.js';
import { settings } from '../core/Settings.js';
import { t } from '../core/I18n.js';
import { el } from '../ui/UI.js';
import { openHowto, openSettings, openCredits, openSolo, openLeaderboard } from '../ui/Panels.js';
import { WD } from '../net/Wavedash.js';
import { CONFIG } from '../config.js';

export class TitleScene extends BaseScene {
  async enter() {
    this.camera.fov = 45;
    this.camera.updateProjectionMatrix();
    this.engine.postfx.setBloomParams({ strength: 0.9, radius: 0.6, threshold: 0.6 });
    this.back = buildBackdrop(this.scene, { size: 20, fill: 0.3 });
    this.setupFX(800);
    this.audio.playBGM('title');
    this.buildUI();
    if (WD.available) WD.presence('In menu', 'INKFALL');
    // 招待リンクから起動したらロビーへ
    const launchLobby = WD.sdk?.getLaunchParams?.()?.lobby || new URLSearchParams(location.search).get('lobby');
    if (launchLobby && WD.available && !this.ctx.flags.launchHandled) {
      this.ctx.flags.launchHandled = true;
      this.later(0.3, () => this.ctx.manager.go('lobby', { autoJoin: launchLobby }));
    }
  }

  buildUI() {
    this.screenEl?.remove();
    const s = this.ui.screen('title-screen');
    this.screenEl = s;
    const logo = el('div', { class: 'logo' },
      el('div', { class: 'logo-main', 'data-text': 'INKFALL', text: 'INKFALL' }),
      el('div', { class: 'logo-sub', text: t('tagline') }));
    const menu = el('div', { class: 'title-menu' },
      this.ui.button({ label: t('online'), icon: 'online', cls: 'primary', onClick: () => this.go('online') }),
      this.ui.button({ label: t('solo'), icon: 'solo', cls: 'accent', onClick: () => this.openSoloMenu() }),
      el('div', { class: 'row' },
        this.ui.button({ label: t('howto'), icon: 'help', cls: 'ghost', onClick: () => openHowto(this.ui) }),
        this.ui.button({ label: t('settings'), icon: 'gear', cls: 'ghost', onClick: () => openSettings(this.ui, { onLangChange: () => this.buildUI() }) }),
        this.ui.button({ label: t('credits'), icon: 'star', cls: 'ghost', onClick: () => openCredits(this.ui, this.ctx.data.credits) })));
    s.append(logo, menu, el('div', { class: 'title-foot', text: `© 2026 haruka_apps · v${CONFIG.version}${WD.isFake ? ' · DEV SDK' : ''}` }));
  }

  openSoloMenu() {
    openSolo(this.ui, {
      best: settings.getBest(),
      onPick: (mode) => this.go(mode),
      onLeaderboard: () => this.showLeaderboard(),
    });
  }

  async showLeaderboard() {
    if (!WD.available) {
      const best = settings.getBest().challenge;
      openLeaderboard(this.ui, best ? [{ rank: 1, username: t('you'), score: best }] : [], { error: t('lb.offline') });
      return;
    }
    try {
      const list = await WD.topScores(CONFIG.challenge.leaderboard, 10);
      openLeaderboard(this.ui, list, { mine: WD.userId });
    } catch {
      openLeaderboard(this.ui, [], { error: t('err.generic') });
    }
  }

  go(dest) {
    if (dest === 'online' && !WD.available) {
      const m = this.ui.modal({ title: t('online'), icon: 'online' });
      m.body.append(el('p', { text: t('onlineUnavailable') }));
      m.foot.append(this.ui.button({ label: t('solo'), icon: 'solo', cls: 'primary small', onClick: () => { m.close(); this.openSoloMenu(); } }));
      return;
    }
    this.audio.sfx('whoosh');
    this.engine.postfx.doFlash('#ffffff', 0.3, 2);
    if (!settings.get('seenIntro')) {
      settings.set('seenIntro', true);
      this.ctx.manager.go('intro', { next: dest });
      return;
    }
    this.ctx.goDest(dest);
  }

  update(dt) {
    super.update(dt);
    const a = this.time * 0.07;
    const narrow = this.engine.width / this.engine.height < 0.9;
    const r = narrow ? 64 : 46;
    this.camera.position.set(Math.cos(a) * r, 14 + Math.sin(a * 1.7) * 4, Math.sin(a) * r);
    this.camera.lookAt(0, narrow ? -4 : -2, 0);
    // インクがじわじわ広がったり引いたり
    this.back.stadium.setFill(0.32 + Math.sin(this.time * 0.25) * 0.08, 0.5 + Math.sin(this.time * 0.17) * 0.3);
    this.back.update(dt, this.camera);
    if (Math.random() < dt * 2.5) {
      const st = this.back.stadium;
      const n = new THREE.Vector3([-1, 1][Math.random() * 2 | 0], 0, 0);
      if (Math.random() < 0.5) n.set(0, 1, 0);
      const p = new THREE.Vector3((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 18);
      if (n.y) p.y = st.size * 0.35; else p.x = n.x * st.size / 2;
      const teams = settings.teams();
      this.fx.splat(p, n, teams[Math.random() * 2 | 0].color, 3);
    }
  }

  dispose() { this.back.dispose(); super.dispose(); }
}
