/* =========================================================
 *  CHEAT JANKI! — 対局画面（RiotGame の ui 実装）・無法地帯版
 *  - 反則技・固有技は技ゲージを払えば必ず成功（疑い・罰則なし）
 *  - 相手も派手に固有技を使う／卓が荒れるイベント／でっち上げ役
 *  new GameUI(game, seats, app)
 *    seats[p] = { char, variant, human }
 *    app = { save, onFinal(action) }
 * ========================================================= */
(function (root) {
  'use strict';
  /** 言葉カードの文字が1語ごとに収まる縮小率（全角=1, 半角≈0.6 で幅を見積もる） */
  const fitK = (text) => {
    const units = Math.max(...String(text).split(/\s+/).map(w => [...w].reduce((n, c) => n + (c.charCodeAt(0) > 0x2e7f ? 1 : 0.6), 0)));
    return Math.min(1, 4.4 / Math.max(units, 0.1)).toFixed(2);
  };
  const { $, $$, sleep, esc } = root.U;
  const S = root.Scene3D;
  const WIND = ['東', '南', '西', '北'], WIND_EN = ['E', 'S', 'W', 'N'];
  const t = (k, v) => root.I18N.t(k, v);
  const L = () => root.I18N.lang;
  const CH = root.Cheats, CX = root.Chaos, WD = root.Words;

  class GameUI {
    constructor(g, seats, app) {
      this.g = g; this.seats = seats; this.n = seats.length; this.app = app;
      this.pending = null; this.aborted = false; this.busy = false;
      this.auto = /[?&]auto=1/.test(location.search);
      this.doraIds = []; this.turn = -1;
      this.riichi = new Array(this.n).fill(false);
      this.scores = null; this.tensionOn = false; this.bgmMode = null;
      this.peekOn = false; this.gravityLeft = 0; this.fakeShow = {};
      $('#btn-auto').classList.toggle('on', this.auto);
      this.buildHUD();
      S.onTileClick = null;
      S.onHover = (id) => this.onHover(id);
      this.keyHandler = (e) => this.onKey(e);
      addEventListener('keydown', this.keyHandler);
    }
    get speed() { return this.app.save.settings.speed || 1; }
    wait(ms) { return sleep(ms / this.speed); }

    /* ---------- 名前・セリフ・ボイス ---------- */
    nm(p) { const c = this.seats[p].char; return L() === 'en' ? root.Lines.LINES[c.id].nameEn : c.name; }
    ln(p, key) {
      const c = this.seats[p].char, X = root.Lines.LINES[c.id];
      if (L() === 'en') return X.en[key] || '';
      if (root.Lines.BASE_KEYS.includes(key)) return c.lines[key] || '';
      return X.ja[key] ? X.ja[key][0] : '';
    }
    say(p, key, pri) { root.Audio2.voice(this.seats[p].char.id, key, { priority: pri || 1 }); return this.ln(p, key); }
    ref(key) {
      const a = root.Lines.ANNOUNCER[key]; if (!a) return;
      root.FXC.ref(L() === 'en' ? a.en : a.ja[0]);
      root.Audio2.voice('announcer', key, { priority: 3, force: true });
    }
    art(p, expr) { const s = this.seats[p]; return root.Chars.artURL(s.char, { expr: expr || 'normal', outfit: s.char.outfits[s.variant || 0], variant: s.variant }); }
    seatPos(p) { return this.n === 3 ? [0, 1, 3][p] : p; }
    seatEl(p) { return $(`.seat[data-p="${p}"]`); }
    sigOf(p) { return CX.SIGS[this.seats[p].char.id]; }
    bubbleAt(p, text) {
      const e = this.seatEl(p); if (!e || !text) return;
      const r = e.getBoundingClientRect();
      root.FXC.bubble(r.left + r.width / 2, p === 0 ? r.top - 44 : r.bottom + 6, text, this.seats[p].char.color);
    }
    bgm(mode) { if (this.bgmMode === mode) return; this.bgmMode = mode; root.Sound.playBGM(mode); }
    baseBgm() { return this.g.h && this.g.progress().isLast ? 'cheat' : this.tensionOn ? 'tension' : 'game'; }

    /** エンジンの状態をまるごと3D卓へ */
    snapshot() {
      const h = this.g.h;
      return {
        wall: h.wall, drawPtr: h.drawPtr,
        hands: h.players.map(pl => root.MJ.sortIds(pl.hand)),
        drawn: h.players.map((pl, p) => (p === this.turn && pl.hand.length % 3 === 2 && pl.lastDraw != null && pl.hand.includes(pl.lastDraw)) ? pl.lastDraw : null),
        melds: h.players.map(pl => pl.melds), nuki: h.players.map(pl => pl.nuki),
        rivers: h.players.map(pl => pl.discards.filter(d => !d.called)),
      };
    }
    sync(dur, opt) { return S.syncAll(this.snapshot(), dur, opt); }
    doraTypes() { return this.doraIds.map(id => root.MJ.doraFromIndicator(id >> 2, this.g.is3p)).concat([...(this.g.extraDoraTypes || [])]); }
    refreshDora() { this.doraIds = this.g.doraIndicatorIds(); S.setDoraTypes(this.doraTypes()); }

    /* ---------- 片付け ---------- */
    abort() {
      this.aborted = true;
      clearTimeout(this.autoTimer);
      if (this.pending) { const p = this.pending; p.resolve(p.type === 'self' ? { action: 'discard', id: p.opt ? p.opt.discardable[0] : -1 } : p.type === 'flip' ? 'no' : p.type === 'fake' ? null : { action: 'skip' }); this.pending = null; }
      S.setInteractive(false);
      S.onTileClick = null; S.onHover = null;
      removeEventListener('keydown', this.keyHandler);
      this.clearActions();
      $$('#result, #final').forEach(e => e.classList.remove('open'));
      $$('#flip-prompt, #pick-panel, #fake-picker').forEach(e => e.remove());
    }

    /* ---------- HUD ---------- */
    buildHUD() {
      $('#seats').innerHTML = this.seats.map((s, p) => `
        <div class="seat sp${this.seatPos(p)}" data-p="${p}" style="--c:${s.char.color}">
          <div class="seat-portrait"><img src="${this.art(p)}" alt=""></div>
          <div class="seat-info">
            <div class="seat-top"><span class="seat-wind">東</span><span class="seat-name">${esc(this.nm(p))}</span></div>
            <div class="seat-score">25000</div>
            <div class="seat-tags"><span class="tag-riichi">${esc(t('hud.riichi'))}</span><span class="tag-frozen">${esc(t('hud.frozen'))}</span><span class="seat-gauge"></span></div>
          </div>
        </div>`).join('');
      const sig = this.sigOf(0);
      $('#cheatbar').innerHTML = CH.CHEATS.filter(c => c.id !== 'flip').map(c => `
        <button class="cheat-btn" data-id="${c.id}" style="--c:${c.color}"><span class="ck">${esc(c.kanji)}</span><span class="cn">${esc(c[L()].name)}</span><span class="cost">${'●'.repeat(c.cost)}</span><kbd>${c.key}</kbd></button>`).join('') +
        (sig ? `<button class="cheat-btn sig" data-id="sig" style="--c:${sig.color}"><span class="ck">${esc(sig.kanji)}</span><span class="cn">${esc(sig[L()].name)}</span><span class="cost">${'●'.repeat(CH.SIG_COST)}</span><kbd>6</kbd></button>` : '');
      $$('#cheatbar .cheat-btn').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); this.useCheat(b.dataset.id); }));
      $('#gauge .gauge-label').textContent = t('hud.gauge');
      $('#gauge .pips').innerHTML = '<i></i>'.repeat(CH.GAUGE_MAX);
      const fc = CH.byId.flip;
      $('#flip-ind').innerHTML = `<span class="ck" style="--c:${fc.color}">${fc.kanji}</span><span class="fl-name">${esc(fc[L()].name)}</span><b class="fl-left">${'●'.repeat(fc.cost)}</b>`;
      $('#flip-ind').title = fc[L()].desc;
      $('#actions').innerHTML = '';
      $('#hint').textContent = '';
      this.updateRiot();
    }
    windLabel(p) { const w = (p - this.g.h.dealer + this.n) % this.n; return L() === 'en' ? WIND_EN[w] : WIND[w]; }
    roundText() {
      const g = this.g, h = g.h, k = ((h.dealer - g.firstDealer + this.n) % this.n) + 1;
      return t('hud.round', { wind: L() === 'en' ? 'East' : WIND[g.roundWind], n: k });
    }
    updateHUD() {
      const g = this.g, h = g.h;
      if (!h) return;
      const scores = this.scores || g.scores;
      this.seats.forEach((s, p) => {
        const el = this.seatEl(p); if (!el) return;
        const w = (p - h.dealer + this.n) % this.n;
        $('.seat-wind', el).textContent = this.windLabel(p);
        $('.seat-wind', el).classList.toggle('dealer', w === 0);
        $('.seat-score', el).textContent = scores[p].toLocaleString();
        el.classList.toggle('turn', this.turn === p);
        el.classList.toggle('riichi', !!this.riichi[p]);
      });
      const pr = g.progress();
      S.setCenter({
        roundText: this.roundText(), honba: g.honba, kyotaku: g.kyotaku, remaining: Math.max(0, g.remaining()),
        line2: L() === 'en' ? `${t('hud.honba', { n: g.honba })} · ${t('hud.kyotaku', { n: g.kyotaku })}` : null,
        line3: L() === 'en' ? t('hud.remain', { n: Math.max(0, g.remaining()) }) : null,
        scores: scores.slice(), winds: this.seats.map((_, p) => WIND[(p - h.dealer + this.n) % this.n]), turn: this.turn, riichi: this.riichi,
      });
      $('#round-info').innerHTML = `<b>${esc(this.roundText())}</b><span class="of${pr.isLast ? ' last' : ''}">${esc(pr.isLast ? t('banner.allLast') : t('hud.of', { n: pr.total }))}</span> ${esc(t('hud.honba', { n: g.honba }))} <span class="kyotaku">${esc(t('hud.kyotaku', { n: g.kyotaku }))}</span> <span class="remain">${esc(t('hud.remain', { n: Math.max(0, g.remaining()) }))}</span>`;
      const T2 = root.Tiles2D;
      const extra = [...(g.extraDoraTypes || [])];
      const rule = g.rule ? CX.ruleById[g.rule] : null;
      $('#dora-box').innerHTML = `<span class="lbl">${esc(t('hud.dora'))}</span>${this.doraIds.map(id => T2.tileHTML(id, { small: true })).join('')}` +
        (extra.length ? `<span class="lbl x">${esc(t('hud.extraDora'))}</span>${extra.slice(0, 8).map(x => T2.typeHTML(x, { small: true })).join('')}${extra.length > 8 ? '<span class="lbl">…</span>' : ''}` : '') +
        (rule ? `<span class="rule-chip">${esc(t('hud.rule'))}: ${esc(rule[L()])}</span>` : '');
      this.updateRiot();
    }
    /** 技ゲージ・言葉カード・反則ボタン */
    updateRiot() {
      const g = this.g; if (!g.gauge) return;
      const G = g.gauge[0];
      $$('#gauge .pips i').forEach((e, i) => e.classList.toggle('on', i < G));
      $('#gauge .gauge-val').textContent = `${G}/${CH.GAUGE_MAX}`;
      this.seats.forEach((_, p) => {
        const el = this.seatEl(p); if (!el) return;
        $('.seat-gauge', el).innerHTML = '<i></i>'.repeat(g.gauge[p] || 0);
        el.classList.toggle('frozen', !!(g.riot && g.riot.frozen.has(p)));
      });
      const words = (g.words && g.words[0]) || [];
      $('#words').innerHTML = `<span class="w-label">${esc(t('hud.words'))}</span>` + words.map(id => { const w = WD.byId[id]; return w ? `<span class="wchip ${w.cat}">${esc(w[L()])}</span>` : ''; }).join('');
      $('#flip-ind').classList.toggle('ready', G >= CH.byId.flip.cost);
      const myTurn = this.pending && this.pending.type === 'self' && !this.busy && !this.pending.riichiMode;
      $$('#cheatbar .cheat-btn').forEach(b => {
        const why = g.h ? g.cheatBlockedReason(b.dataset.id, 0) : 'nohand';
        b.classList.toggle('ready', !!myTurn && !why);
        b.classList.toggle('blocked', !!why && why !== 'nohand');
        const info = b.dataset.id === 'sig' ? this.sigOf(0) : CH.byId[b.dataset.id];
        b.title = info[L()].desc + (why && why !== 'nohand' ? '\n× ' + t('block.' + why) : '');
      });
    }

    /* ---------- イベント ---------- */
    async event(name, d) {
      if (this.aborted) return;
      const fn = this['on_' + name];
      if (!fn) return;
      try { await fn.call(this, d); } catch (e) { console.error(name, e); }
    }
    async on_gameStart() {
      this.scores = this.g.scores.slice();
      const ids = this.seats.map(s => s.char.id);
      root.Audio2.preloadVoices(ids, root.Lines.BASE_KEYS.concat(root.Lines.CHEAT_KEYS));
      root.Audio2.preloadVoices(['announcer'], Object.keys(root.Lines.ANNOUNCER));
      this.bgm('game');
      S.setStandees(this.seats.map((s, p) => ({ p, url: this.art(p), color: s.char.color })).filter(x => x.p !== 0));
      this.ref('lawless');
      await root.FX.cutIn({ kind: 'banner', text: t('banner.start'), sub: t('banner.sub', { n: this.n }), color: this.seats[0].char.color });
      this.say(0, 'start');
    }
    async on_handStart(d) {
      const g = this.g;
      this.riichi = new Array(this.n).fill(false);
      this.turn = d.dealer;
      this.doraIds = d.doraIds.slice();
      this.scores = d.scores.slice();
      this.tensionOn = false; this.peekOn = false; this.gravityLeft = 0; this.fakeShow = {};
      S.clearAuras();
      S.resetCamera(0.6);
      this.updateHUD();
      this.bgm(this.baseBgm());
      await S.newHand({ wall: d.wall, deadStart: d.deadStart, dealer: d.dealer, wallBreak: d.wallBreak, dealBatches: d.dealBatches, hands: d.hands, doraIds: d.doraIds });
      S.setDoraTypes(this.doraTypes());
      root.Sound.sfx('deal');
      const pr = g.progress();
      await root.FX.cutIn({ kind: 'banner', text: (L() === 'en' ? 'East ' : '東 ') + (d.dealerIdx + 1) + (L() === 'en' ? '' : ' 局'), sub: `${t('hud.of', { n: pr.total })} · ${t('banner.roundSub', { honba: d.honba, name: this.nm(d.dealer) })}`, color: this.seats[d.dealer].char.color });
      if (pr.isLast) { this.ref('alllast'); await root.FX.cutIn({ kind: 'stamp', text: t('banner.allLast'), color: '#ff5fa2' }); }
      this.updateHint();
    }
    async on_draw(d) {
      this.turn = d.p;
      S.syncWall(this.g.h.wall, this.g.h.drawPtr);
      if (this.gravityLeft > 0 && --this.gravityLeft === 0 && !this.peekOn) { S.setPeek(false); root.FXC.toast(t('chaos.gravityEnd')); }
      this.updateHUD();
      if (d.p === 0) {
        if (this.peekOn) { this.peekOn = false; if (!this.gravityLeft) root.Cheat3D.peek(false); }
        root.Sound.sfx('draw');
        await S.draw(0, d.id);
        this.updateHint();
      } else {
        S.draw(d.p, d.id);
        await this.wait(this.g.h.players[d.p].riichi ? 380 : 480);
      }
    }
    /** AI の小さなすり替え（見せびらかす） */
    async on_aiCheat(d) {
      const h = this.g.h;
      S.syncWall(h.wall, h.drawPtr);
      const st = S.internals().st;
      S.setHand(d.p, root.MJ.sortIds(h.players[d.p].hand), st.drawn[d.p], 0.3);
      root.Cheat3D.glint(d.p);
      root.Sound.sfx('swap');
      const e = this.seatEl(d.p);
      if (e) { const r = e.getBoundingClientRect(); root.FX.floatText(r.left + r.width / 2, r.bottom + 10, t('ai.swap'), this.seats[d.p].char.color, true); }
      this.updateRiot();
      await this.wait(260);
    }
    async on_checkpoint() { this.updateRiot(); }
    async on_discard(d) {
      if (d.riichi) {
        const line = this.say(d.p, 'riichi');
        const s = this.seats[d.p];
        await root.FX.cutIn({ kind: 'riichi', art: this.art(d.p, 'determined'), text: t('win.riichi'), line, color: s.char.color });
      }
      root.Sound.sfx(d.riichi ? 'tileHard' : 'tile');
      await S.discard(d.p, d.id, d.riichi, d.hand);
      if (d.p === 0) this.updateHint();
    }
    async on_riichi(d) {
      this.riichi[d.p] = true;
      S.aura(d.p, [this.seats[d.p].char.color, '#ffffff'], true);
      if (!this.tensionOn) { this.tensionOn = true; this.bgm(this.baseBgm()); }
      this.updateHUD();
    }
    async on_riichiStick(d) {
      this.scores = d.scores.slice();
      S.riichiStick(d.p, this.seats[d.p].char.color);
      root.Sound.sfx('coin');
      this.updateHUD();
    }
    async on_call(d) {
      const key = { pon: 'pon', chi: 'chi', minkan: 'kan', ankan: 'kan', kakan: 'kan' }[d.type];
      this.say(d.p, key);
      root.FX.cutIn({ kind: 'call', art: this.art(d.p, 'smug'), text: t('call.' + key), color: this.seats[d.p].char.color });
      await this.wait(250);
      await S.call(d.p, d.meld, d.from, d.hand);
      this.turn = d.p;
      this.updateHUD();
      if (d.p === 0) this.updateHint();
    }
    async on_nuki(d) {
      this.say(d.p, 'nuki');
      root.FX.cutIn({ kind: 'call', art: this.art(d.p, 'happy'), text: t('call.nuki'), color: this.seats[d.p].char.color });
      await S.nuki(d.p, d.id, this.g.h.players[d.p].hand);
    }
    async on_dora(d) {
      const newIds = d.doraIds.filter(x => !this.doraIds.includes(x));
      this.doraIds = d.doraIds.slice();
      S.setDora(newIds);
      S.setDoraTypes(this.doraTypes());
      root.Sound.sfx('dora');
      this.updateHUD();
      await this.wait(300);
    }
    async on_scores(d) { this.scores = d.scores.slice(); this.updateHUD(); }

    /* ---------- 無法地帯のイベント ---------- */
    /** キャラ固有技（自分・相手共通） */
    async on_sig(d) {
      const p = d.p, sig = CX.SIGS[d.kind]; if (!sig) return;
      const line = this.say(p, 'sig', 2);
      this.ref('sig');
      await root.FXC.sigCut({ art: this.art(p, 'smug'), who: t('sig.by', { name: this.nm(p) }), name: sig[L()].name, kanji: sig.kanji, color: sig.color, line });
      await root.Cheat3D.sig(d, (dur, opt) => this.sync(dur, opt), sig.color, { n: this.n });
      if (d.kind === 'reika' || d.kind === 'luna') { this.refreshDora(); this.scores = this.g.scores.slice(); }
      if (d.kind === 'airi') for (const q of (d.frozen || [])) S.standee(q, 'shake');
      if (d.kind === 'yukari' && d.rule) await this.showRoulette(d.rule, sig.color);
      if (d.kind === 'reika') root.FXC.toast(t('sig.paid', { name: this.nm(p), n: (d.paid || 0).toLocaleString() }));
      if (d.kind === 'mahiru') root.FXC.toast(t('sig.drain', { name: this.nm(p), n: d.drained || 0 }));
      if (d.kind === 'mira') root.FXC.toast(t('sig.luck', { name: this.nm(p) }));
      this.sync(0.3);
      this.updateHUD(); this.updateHint();
    }
    async showRoulette(ruleId, color) {
      const rules = CX.RULES, idx = rules.findIndex(r => r.id === ruleId);
      await root.Cheat3D.roulette(rules, Math.max(0, idx), rules.map(r => r.short[L()]), color);
      const r = CX.ruleById[ruleId];
      await root.FXC.stamp({ text: r[L()], color: color || '#c08bff' });
      this.refreshDora();
    }
    /** 卓が荒れるイベント */
    async on_chaos(d) {
      const ev = CX.evById[d.id]; if (!ev) return;
      S.setInteractive(false);
      this.ref('ev_' + d.id);
      await root.FXC.chaos({ kanji: ev.kanji, name: ev[L()].name, desc: ev[L()].desc, color: ev.color });
      const C3 = root.Cheat3D, sync = (dur, opt) => this.sync(dur, opt);
      switch (d.id) {
        case 'rotate': await C3.evRotate(sync); break;
        case 'gravity': await C3.evGravity(); this.gravityLeft = d.turns || this.n; break;
        case 'meteor': await C3.evMeteor(d.t); this.refreshDora(); break;
        case 'migrate': await C3.evMigrate(d.moves || [], sync); break;
        case 'roulette': await this.showRoulette(d.rule, ev.color); break;
        case 'melt': await C3.evMelt(d.changes || [], sync); break;
        case 'rewind': await C3.evRewind(sync); break;
        case 'words': await C3.evWords(WD.WORDS.filter(() => Math.random() < 0.4).map(w => w[L()]).slice(0, 8)); break;
      }
      // だれか一人がリアクション
      const q = Math.floor(Math.random() * this.n);
      this.bubbleAt(q, this.say(q, 'chaos', 1));
      if (d.id === 'meteor' && d.t != null) root.FXC.toast(t('chaos.meteor', { tile: root.I18N.term(root.MJ.tileName(d.t)) }));
      this.sync(0.3);
      this.updateHUD(); this.updateHint();
    }
    async on_frozenTurn(d) {
      this.ref('frozen');
      const e = this.seatEl(d.p);
      if (e) { const r = e.getBoundingClientRect(); root.FX.floatText(r.left + r.width / 2, r.bottom + 10, t('chaos.frozen'), '#8be9ff', true); }
      S.standee(d.p, 'shake');
      root.Sound.sfx('xray');
      await this.wait(400);
    }
    async on_fakeYaku(d) { this.fakeShow[d.p] = d; }
    async on_tableFlip(d) {
      this.clearActions();
      S.setInteractive(false);
      const fc = CH.byId.flip;
      this.say(0, 'flip', 3);
      await root.FXC.splash({ kanji: fc.kanji, name: fc[L()].name, color: fc.color });
      await root.Cheat3D.tableFlip();
      const w = d.wins.find(x => x.p !== 0);
      if (w) this.bubbleAt(w.p, this.say(w.p, 'flipped', 2));
      await root.FXC.stamp({ text: t('flip.void'), color: fc.color });
      this.updateRiot();
      await this.wait(500);
    }

    /* ---------- 和了・流局 ---------- */
    async on_win(d) {
      S.setInteractive(false);
      this.clearActions();
      root.Sound.stopBGM(0.2);
      this.bgmMode = 'result';
      for (let i = 0; i < d.wins.length; i++) {
        const w = d.wins[i];
        if (this.aborted) return;
        const s = this.seats[w.p];
        const r = w.result;
        const ym = r.yakuman > 0;
        const vkey = ym ? 'yakuman' : (w.tsumo ? 'tsumo' : 'ron');
        const line = this.say(w.p, vkey, 2);
        S.pulseBloom(ym ? 2.2 : 1.4, ym ? 3 : 1.5);
        if (w.p !== 0) S.standee(w.p, 'bounce');
        if (!w.tsumo && w.from !== 0) S.standee(w.from, 'shake');
        if (ym) {
          root.Sound.sfx('fanfare_yakuman');
          await root.FX.cutIn({ kind: 'yakuman', art: this.art(w.p, 'happy'), names: r.yaku.map(y => this.yakuName(y)), line, color: s.char.color });
        } else {
          root.Sound.sfx('fanfare_win');
          await root.FX.cutIn({ kind: 'win', art: this.art(w.p, 'happy'), text: w.tsumo ? t('win.tsumo') : t('win.ron'), line, color: s.char.color });
        }
        // でっち上げ役の認定
        const fk = this.fakeShow[w.p];
        if (fk && !this.aborted) {
          this.say(w.p, 'fake', 2);
          setTimeout(() => this.ref('fake_ok'), 900 / this.speed);
          await root.FXC.fake({ name: L() === 'en' ? fk.en : fk.ja, han: t('fake.han', { n: fk.han }), label: t('fake.label'), ok: t('fake.ok'), color: s.char.color, mulText: this.g.fakeMul > 1 ? t('fake.mul') : '' });
          delete this.fakeShow[w.p];
        }
        if (this.aborted) return;
        S.focusSeat(w.p, 1.0);
        await S.revealHand(w.p, w.hand, w.winId);
        if (w.uraIds && w.uraIds.length) { S.flipUra(w.uraIds); root.Sound.sfx('dora'); }
        S.burstAtSeat(w.p, [s.char.color, '#ffffff', '#ffe066'], ym ? 260 : 140, { speed: 8, life: 1.6, size: 0.6, up: 4 });
        if (ym) root.FX.confetti(160);
        await this.wait(700);
        root.Sound.playBGM('result');
        await this.showWinResult(w, d, i === d.wins.length - 1);
      }
      this.scores = d.after.slice();
      S.resetCamera(0.8);
      this.bgmMode = null;
      this.updateHUD();
    }
    yakuName(y) { return y.fake ? (L() === 'en' ? y.nameEn : y.name) : root.I18N.term(y.name); }
    async on_ryuukyoku(d) {
      S.setInteractive(false);
      this.clearActions();
      root.Sound.stopBGM(0.4);
      this.bgmMode = 'result';
      root.Sound.sfx('ryuukyoku');
      await root.FX.cutIn({ kind: 'stamp', text: t('draw.title'), sub: root.I18N.term(d.reason), color: '#6fd5ff' });
      await Promise.all(d.tenpai.map((on, p) => on ? S.revealHand(p, d.hands[p], null) : null).filter(Boolean));
      root.Sound.playBGM('result');
      const tn = d.tenpai.filter(Boolean).length;
      const note = tn === 0 ? t('draw.none') : tn === this.n ? t('draw.all') : t('draw.pay', { n: this.n === 3 ? '2,000' : '3,000' });
      $('#result-body').innerHTML = `<div class="res-draw">
        <h2>${esc(t('draw.title'))} <small>${esc(root.I18N.term(d.reason))}</small></h2>
        <div class="dr-note">${esc(note)}</div>
        <div class="dr-list">${this.seats.map((s, p) => {
          const on = !!d.tenpai[p], df = d.deltas[p] || 0;
          return `<div class="dr-row ${on ? 'on' : ''}" style="--c:${s.char.color}">
            <img class="dr-art" src="${this.art(p)}" alt="">
            <div class="dr-who"><b class="dr-name">${esc(this.nm(p))}</b><i class="dr-state">${esc(on ? t('draw.tenpai') : t('draw.noten'))}</i></div>
            <div class="dr-hand">${on ? root.MJ.sortIds(d.hands[p]).map(id => root.Tiles2D.tileHTML(id, { small: true })).join('') : ''}</div>
            <div class="dr-score"><span class="sc" data-from="${d.before[p]}" data-to="${d.after[p]}">${d.before[p].toLocaleString()}</span><em class="df ${df > 0 ? 'plus' : df < 0 ? 'minus' : ''}">${df > 0 ? '+' : ''}${df ? Math.round(df).toLocaleString() : '±0'}</em></div>
          </div>`;
        }).join('')}</div></div>`;
      await this.openResult();
      this.scores = d.after.slice();
      this.bgmMode = null;
      this.updateHUD();
    }
    deltaHTML(deltas, before, after) {
      return `<div class="res-deltas">${this.seats.map((s, p) => `<div class="dl" style="--c:${s.char.color}"><img src="${this.art(p)}" alt=""><span class="nm">${esc(this.nm(p))}</span><span class="sc" data-from="${before[p]}" data-to="${after[p]}">${before[p].toLocaleString()}</span><span class="df ${deltas[p] > 0 ? 'plus' : deltas[p] < 0 ? 'minus' : ''}">${deltas[p] > 0 ? '+' : ''}${deltas[p] ? deltas[p].toLocaleString() : '±0'}</span></div>`).join('')}</div>`;
    }
    async showWinResult(w, d, last) {
      const s = this.seats[w.p], r = w.result, ym = r.yakuman > 0;
      const T2 = root.Tiles2D, term = root.I18N.term;
      const handIds = root.MJ.sortIds(w.hand);
      const meldsHTML = w.melds.map(m => T2.meldHTML(m, w.p, this.n, { small: true })).join('');
      const isDealer = w.p === this.g.h.dealer;
      const payText = w.tsumo ? (isDealer ? t('win.all', { n: r.pay.tsumoAll.toLocaleString() }) : t('win.split', { a: r.pay.tsumoChild.toLocaleString(), b: r.pay.tsumoDealer.toLocaleString() })) : t('win.pts', { n: r.pay.ron.toLocaleString() });
      const loser = !w.tsumo ? w.from : null;
      $('#result-body').innerHTML = `<div class="res-win ${ym ? 'yakuman' : ''}" style="--c:${s.char.color}">
        <div class="res-head">
          <img class="res-art" src="${this.art(w.p, 'happy')}" alt="">
          <div class="res-who"><div class="res-name">${esc(this.nm(w.p))}</div><div class="res-type">${esc(w.tsumo ? t('win.tsumoWin') : t('win.ronWin'))}${loser != null ? `<span class="from">← ${esc(this.nm(loser))}</span>` : ''}</div></div>
          ${loser != null ? `<img class="res-loser" src="${this.art(loser, 'sad')}" alt="">` : ''}
        </div>
        <div class="res-hand">${handIds.map(id => T2.tileHTML(id)).join('')}<span class="gap"></span>${T2.tileHTML(w.winId, { win: true })}${meldsHTML ? `<span class="gap"></span>${meldsHTML}` : ''}${w.nuki.length ? `<span class="gap"></span><span class="meld">${w.nuki.map(id => T2.tileHTML(id, { small: true })).join('')}</span>` : ''}</div>
        <div class="res-dora"><span>${esc(t('win.dora'))}</span>${w.doraIds.map(id => T2.tileHTML(id, { small: true })).join('')}${w.uraIds.length ? `<span>${esc(t('win.ura'))}</span>${w.uraIds.map(id => T2.tileHTML(id, { small: true })).join('')}` : ''}</div>
        <div class="res-yaku">${r.yaku.map((y, i) => `<div class="yk${y.fake ? ' fake' : ''}" style="animation-delay:${0.15 + i * 0.22}s">${y.fake ? `<i>${esc(t('fake.label'))}</i>` : ''}<span>${esc(this.yakuName(y))}</span><b>${typeof y.han === 'number' ? esc(t('win.han', { n: y.han })) : esc(term(y.han))}</b></div>`).join('')}</div>
        <div class="res-total" style="animation-delay:${0.3 + r.yaku.length * 0.22}s">
          ${ym ? '' : `<span class="hf">${esc(t('win.fu', { fu: r.fu, han: r.han }))}</span>`}
          ${r.limitName ? `<span class="limit">${esc(term(r.limitName))}</span>` : ''}
          <span class="pts">${esc(payText)}</span>
          ${this.g.payMul > 1 ? `<span class="limit">×${this.g.payMul}</span>` : ''}
        </div>
        ${last ? this.deltaHTML(d.deltas, d.before, d.after) : ''}
      </div>`;
      r.yaku.forEach((y, i) => setTimeout(() => root.Sound.sfx('tick'), (150 + i * 220) / this.speed));
      setTimeout(() => { root.Sound.sfx(ym || r.base >= 2000 ? 'stamp' : 'coin'); if (r.base >= 3000) root.FX.sparkles(innerWidth / 2, innerHeight * 0.62, 60); }, (300 + r.yaku.length * 220) / this.speed);
      await this.openResult();
    }
    openResult() {
      const ov = $('#result');
      $('#result-next').textContent = t('act.next');
      ov.classList.add('open');
      setTimeout(() => $$('.sc[data-from]', ov).forEach(el => root.U.countUp(el, +el.dataset.from, +el.dataset.to, 900)), 900);
      return new Promise(res => {
        const btn = $('#result-next');
        const rb = $('.result-box', ov); if (rb) rb.scrollTop = 0;
        try { btn.focus({ preventScroll: true }); } catch (e) { /* */ }
        const fin = () => { root.Sound.sfx('click'); ov.classList.remove('open'); btn.onclick = null; this.pending = null; res(); };
        btn.onclick = fin;
        this.pending = { type: 'result', resolve: fin };
        if (this.auto) setTimeout(() => { if (this.pending && this.pending.resolve === fin) fin(); }, 3500 / this.speed);
      });
    }
    async on_gameEnd(d) {
      if (this.aborted) return;
      removeEventListener('keydown', this.keyHandler);
      S.clearAuras();
      root.Sound.playBGM('result');
      const g = this.g, rank = d.ranking, myRank = rank.indexOf(0);
      const cr = g.cheatRank(myRank), st = g.style[0], bs = d.stats[0];
      const sv = this.app.save;
      sv.stats.games++; if (myRank === 0) sv.stats.tops++;
      sv.stats.bestRank = root.Save.betterRank(cr.rank, sv.stats.bestRank);
      sv.stats.cheatsOK += st.cheats + st.sigs;
      if (st.best && (!sv.stats.bestFake || st.best.han > sv.stats.bestFake.han)) sv.stats.bestFake = st.best;
      root.Save.persist();
      const start = g.startScore;
      this.ref('end');
      const wl = myRank === 0 ? 'win' : 'lose';
      setTimeout(() => this.say(0, wl, 2), 1600);
      $('#final-body').innerHTML = `<h2>${esc(myRank === 0 ? t('end.top') : root.I18N.place(myRank + 1))}</h2>
        <div class="final-list">${rank.map((p, i) => `<div class="fr r${i}" style="--c:${this.seats[p].char.color};animation-delay:${0.2 + i * 0.25}s"><div class="rk">${i + 1}</div><img src="${this.art(p)}" alt=""><div class="nm">${esc(this.nm(p))}${p === 0 ? ` <small>${esc(t('end.you'))}</small>` : ''}</div><div class="sc">${d.scores[p].toLocaleString()}</div><div class="pt ${d.scores[p] - start >= 0 ? 'plus' : 'minus'}">${d.scores[p] - start >= 0 ? '+' : ''}${((d.scores[p] - start) / 1000).toFixed(1)}</div></div>`).join('')}</div>
        <div class="cheat-rank rank-${cr.rank}">
          <div class="cr-label">${esc(t('end.cheatRank'))}</div>
          <div class="cr-letter">${cr.rank}</div>
          <div class="cr-title">${esc(t('rank.' + cr.rank))}</div>
        </div>
        ${st.best ? `<div class="final-best"><span>${esc(t('end.best'))}</span><b>${esc(L() === 'en' ? st.best.en : st.best.ja)}</b><i>${esc(t('fake.han', { n: st.best.han }))}</i></div>` : ''}
        <div class="final-stats">${esc(t('end.style', { cheats: st.cheats, sigs: st.sigs, fake: st.fakeTotal }))}<br>${esc(t('end.basic', { wins: bs.wins, dealIns: bs.dealIns, riichi: bs.riichi }))}</div>
        <div class="final-btns"><button class="btn" id="final-again">${esc(t('end.again'))}</button><button class="btn" id="final-roll">${esc(t('end.roll'))}</button><button class="btn primary" id="final-title">${esc(t('end.title'))}</button></div>`;
      $('#final').classList.add('open');
      setTimeout(() => {
        root.Sound.sfx('stamp');
        $('#final .cheat-rank').classList.add('in');
        if (cr.rank === 'S') { this.ref('king'); root.FX.fireworksShow(3); root.FX.confetti(220); }
        else if (cr.rank === 'A') root.FX.confetti(140);
      }, 1300 / this.speed);
      if (myRank === 0) { root.FX.confetti(160); root.FX.fireworksShow(2.5); } else root.FX.petals(40);
      await new Promise(res => {
        const go = (a) => () => { root.Sound.sfx('click'); $('#final').classList.remove('open'); res(); this.app.onFinal(a); };
        $('#final-title').onclick = go('title');
        $('#final-again').onclick = go('again');
        $('#final-roll').onclick = go('roll');
      });
    }

    /* ---------- 人間の選択 ---------- */
    clearActions() { $('#actions').innerHTML = ''; $('#danger-layer').innerHTML = ''; }
    showActions(btns) {
      const box = $('#actions');
      box.innerHTML = '';
      for (const b of btns) {
        const el = document.createElement('button');
        el.className = 'act ' + (b.cls || '');
        el.innerHTML = b.html || esc(b.label);
        el.onclick = (e) => { e.stopPropagation(); root.Sound.sfx('click'); b.fn(el); };
        box.appendChild(el);
      }
    }
    askSelf(p, opt) {
      return new Promise(resolve => {
        if (this.aborted) return resolve({ action: 'discard', id: opt.discardable[0] });
        opt._afterDraw = opt.drawnId != null;
        const done = (dec) => {
          if (!this.pending || this.pending.resolve !== done) return;
          clearTimeout(this.autoTimer);
          this.pending = null; this.clearActions(); S.setInteractive(false); S.onTileClick = null; $('#hint-hover').textContent = '';
          this.updateRiot();
          resolve(dec);
        };
        this.pending = { type: 'self', resolve: done, opt, riichiMode: false, autoFn: () => setTimeout(() => done(root.AI.selfDecision(this.g, 0, opt)), 300 / this.speed) };
        if (this.auto) { this.pending.autoFn(); return; }
        if (!this.tipShown && !this.app.save.stats.games) { this.tipShown = true; setTimeout(() => root.FXC.toast(t('hud.tip'), '', 5200), 300); }
        this.renderSelf(true);
      });
    }
    /** 自分の手番のボタンと打牌受付（反則技のあとにも呼び直す） */
    renderSelf(first) {
      const P = this.pending; if (!P || P.type !== 'self') return;
      const opt = P.opt, done = P.resolve, pl = this.g.h.players[0];
      P.riichiMode = false;
      this.updateRiot();
      const nothing = opt.mustTsumogiri && !opt.canTsumo && !opt.kanOptions.length && !opt.canNuki;
      if (nothing) {
        // リーチ中: 少し待ってから自動ツモ切り（その間に反則技を使える）
        const id0 = opt.drawnId != null ? opt.drawnId : opt.discardable[0];
        this.showActions([{ label: t('act.tsumogiri'), cls: 'skip', fn: () => done({ action: 'discard', id: id0 }) }]);
        if (first) this.autoTimer = setTimeout(() => done({ action: 'discard', id: id0 }), 1400 / this.speed);
        S.setInteractive(true, opt.discardable);
        S.onTileClick = (id) => { if (opt.discardable.includes(id)) done({ action: 'discard', id }); };
        return;
      }
      const btns = [];
      if (opt.canTsumo) btns.push({ label: t('act.tsumo'), cls: 'win', fn: () => done({ action: 'tsumo' }) });
      if (opt.canKyuushu) btns.push({ label: t('act.kyuushu'), cls: 'skip', fn: () => done({ action: 'kyuushu' }) });
      if (opt.riichiIds.length) btns.push({ label: t('act.riichi'), cls: 'riichi', fn: (el) => {
        P.riichiMode = !P.riichiMode;
        el.textContent = P.riichiMode ? t('act.cancel') : t('act.riichi');
        el.classList.toggle('active', P.riichiMode);
        S.setInteractive(true, P.riichiMode ? opt.riichiIds : opt.discardable);
        $('#hint-hover').textContent = P.riichiMode ? t('hint.riichi') : '';
        this.updateRiot();
      } });
      for (const k of opt.kanOptions) btns.push({ html: `${esc(t('act.kan'))} ${root.Tiles2D.typeHTML(k.t, { small: true })}`, cls: 'call', fn: () => done({ action: 'kan', kan: k }) });
      if (opt.canNuki) btns.push({ html: `${esc(t('act.nuki'))} ${root.Tiles2D.typeHTML(30, { small: true })}`, cls: 'call', fn: () => done({ action: 'nuki' }) });
      if (pl.riichi && (opt.canTsumo || opt.kanOptions.length || opt.canNuki)) btns.push({ label: t('act.tsumogiri'), cls: 'skip', fn: () => done({ action: 'discard', id: opt.drawnId }) });
      this.showActions(btns);
      if (opt.canTsumo) root.FX.sparkles(innerWidth / 2, innerHeight - 90, 30);
      S.onTileClick = (id) => {
        if (P.riichiMode) { if (opt.riichiIds.includes(id)) done({ action: 'riichi', id }); }
        else if (opt.discardable.includes(id)) done({ action: 'discard', id });
      };
      S.setInteractive(true, opt.discardable);
    }
    askCall(p, opt) {
      return new Promise(resolve => {
        if (this.aborted) return resolve({ action: 'skip' });
        if (this.app.save.settings.autoSkipCall && !opt.ron) return resolve({ action: 'skip' });
        const done = (dec) => { if (!this.pending || this.pending.resolve !== done) return; this.pending = null; this.clearActions(); $('#hint-hover').textContent = ''; resolve(dec); };
        this.pending = { type: 'call', resolve: done, autoFn: () => setTimeout(() => done(root.AI.callDecision(this.g, 0, opt)), 250 / this.speed) };
        if (this.auto) { this.pending.autoFn(); return; }
        const btns = [];
        if (opt.ron) btns.push({ label: t('act.ron'), cls: 'win', fn: () => done({ action: 'ron' }) });
        if (opt.pon) btns.push({ label: t('act.pon'), cls: 'call', fn: () => done({ action: 'pon' }) });
        if (opt.minkan) btns.push({ label: t('act.kan'), cls: 'call', fn: () => done({ action: 'kan' }) });
        if (opt.chi.length === 1) btns.push({ label: t('act.chi'), cls: 'call', fn: () => done({ action: 'chi', ids: opt.chi[0] }) });
        else if (opt.chi.length > 1) {
          btns.push({ label: t('act.chi'), cls: 'call', fn: () => {
            const b2 = opt.chi.map(ids => ({ html: ids.concat([opt.tile]).sort((a, b) => a - b).map(id => root.Tiles2D.tileHTML(id, { small: true, win: id === opt.tile })).join(''), cls: 'chi-opt', fn: () => done({ action: 'chi', ids }) }));
            b2.push({ label: t('act.back'), cls: 'skip', fn: () => this.showActions(btns) });
            this.showActions(b2);
          } });
        }
        btns.push({ label: t('act.skip'), cls: 'skip', fn: () => done({ action: 'skip' }) });
        this.showActions(btns);
        if (opt.ron) root.Sound.sfx('sparkle');
        $('#hint-hover').innerHTML = esc(t('hint.call', { tile: '§', what: opt.ron ? t('hint.ron') : t('hint.naki') })).replace('§', root.Tiles2D.tileHTML(opt.tile, { small: true }));
      });
    }

    /* ---------- ちゃぶ台返し（ゲージ4） ---------- */
    askFlip(wins, tsumo) {
      return new Promise(resolve => {
        if (this.aborted || this.auto) return resolve('no');
        const w = wins.find(x => x.p !== 0);
        const s = this.seats[w.p];
        const what = tsumo ? t('win.tsumo') : t('win.ron');
        this.say(w.p, tsumo ? 'tsumo' : 'ron', 2);
        root.FX.cutIn({ kind: 'call', art: this.art(w.p, 'happy'), text: what + '!', color: s.char.color });
        const fc = CH.byId.flip;
        const ov = root.U.el(`<div id="flip-prompt" style="--c:${fc.color}">
          <div class="fp-text">${esc(t('flip.ask', { name: this.nm(w.p), what }))}</div>
          <button class="fp-btn"><span class="ck">${fc.kanji}</span>${esc(t('flip.btn'))}<kbd>F</kbd></button>
          <button class="btn fp-pass">${esc(t('flip.pass'))}</button>
          <div class="fp-timer"><i></i></div>
          <div class="fp-note">${esc(t('flip.cost', { n: fc.cost }))}</div>
        </div>`);
        $('#app').appendChild(ov);
        root.Sound.sfx('countdown');
        const LIMIT = 4000 / Math.min(this.speed, 1.5);
        const t0 = performance.now();
        let finished = false;
        const bar = ov.querySelector('.fp-timer i');
        const tick = () => { if (finished) return; const k = (performance.now() - t0) / LIMIT; bar.style.transform = `scaleX(${Math.max(0, 1 - k)})`; if (k >= 1) end('no'); else requestAnimationFrame(tick); };
        const end = (choice) => {
          if (finished) return;
          finished = true;
          this.pending = null;
          ov.remove();
          resolve(choice === 'flip' ? 'flip' : 'no');
        };
        ov.querySelector('.fp-btn').onclick = (e) => { e.stopPropagation(); root.Sound.sfx('click'); end('flip'); };
        ov.querySelector('.fp-pass').onclick = (e) => { e.stopPropagation(); root.Sound.sfx('click'); end('no'); };
        this.pending = { type: 'flip', resolve: () => end('no'), flip: () => end('flip') };
        requestAnimationFrame(tick);
      });
    }

    /* ---------- でっち上げ役 ---------- */
    askFake({ p, words, tags, mul }) {
      return new Promise(resolve => {
        if (this.aborted || this.auto || !words.length) return resolve(null);
        const g = this.g, uniq = [...new Set(words)];
        const pick = new Set(g.bestFake(p, tags));
        const ov = root.U.el(`<div id="fake-picker"><div class="fk-box">
          <div class="fk-title">${esc(t('fake.title'))}</div>
          <div class="fk-sub">${esc(t('fake.sub'))}</div>
          <div class="fk-preview"><div class="fk-name"></div><div class="fk-han"></div></div>
          <div class="fk-cards">${uniq.map(id => { const w = WD.byId[id]; const star = g.wordMatches(p, id, tags); return `<button class="fk-card ${w.cat}${star ? ' star' : ''}" data-id="${id}" style="--k:${fitK(w[L()])}"><i>${esc(t('fake.cat.' + w.cat))}</i><b>${esc(w[L()])}</b>${star ? '<em>★</em>' : ''}</button>`; }).join('')}</div>
          <div class="fk-btns"><button class="btn" id="fk-auto">${esc(t('fake.auto'))}</button><button class="btn big primary" id="fk-ok">${esc(t('fake.declare'))}</button></div>
        </div></div>`);
        $('#app').appendChild(ov);
        root.Sound.sfx('sparkle');
        const render = () => {
          const ids = [...pick];
          const sc = g.fakeScore(p, ids, tags);
          $('.fk-name', ov).textContent = ids.length ? (L() === 'en' ? sc.en : sc.ja) : t('fake.none');
          $('.fk-han', ov).textContent = ids.length ? t('fake.han', { n: sc.han }) + (mul > 1 ? ' ' + t('fake.mul') : '') : '';
          $$('.fk-card', ov).forEach(b => b.classList.toggle('on', pick.has(b.dataset.id)));
          $('#fk-ok', ov).disabled = !ids.length;
        };
        const finish = (v) => { this.pending = null; ov.remove(); resolve(v); };
        $$('.fk-card', ov).forEach(b => b.onclick = (e) => {
          e.stopPropagation(); root.Sound.sfx('click');
          const id = b.dataset.id;
          if (pick.has(id)) pick.delete(id); else if (pick.size < WD.MAX_PICK) pick.add(id);
          render();
        });
        $('#fk-ok', ov).onclick = (e) => { e.stopPropagation(); root.Sound.sfx('ui_start'); finish([...pick]); };
        $('#fk-auto', ov).onclick = (e) => { e.stopPropagation(); root.Sound.sfx('click'); finish(null); };
        this.pending = { type: 'fake', resolve: () => finish(null) };
        render();
      });
    }

    /* ---------- 反則技（必ず成功） ---------- */
    async useCheat(id) {
      if (this.aborted || id === 'flip') return;
      const P = this.pending;
      if (!P || P.type !== 'self' || this.busy || P.riichiMode) { if (!this.busy) root.FXC.toast(t('cheat.notTurn')); return; }
      const why = this.g.cheatBlockedReason(id, 0);
      if (why) { root.FXC.toast(t('block.' + why), 'bad'); return; }
      clearTimeout(this.autoTimer);
      this.busy = true;
      this.clearActions(); S.setInteractive(false); S.onTileClick = null; $('#hint-hover').textContent = '';
      this.updateRiot();
      const g = this.g, opt = P.opt;
      try {
        if (id === 'sig') {
          const d = g.doSig(0);
          if (d) { g.refreshOpt(opt); await this.on_sig(d); }
          return;
        }
        let sel = null;
        if (id === 'swap') { sel = await this.pickSwap(); if (!sel) return; }
        if (id === 'raid') { sel = await this.pickRaid(); if (!sel) return; }
        const c = CH.byId[id];
        this.ref(id);
        this.say(0, 'cheat');
        await root.FXC.splash({ kanji: c.kanji, name: c[L()].name, color: c.color });
        await this.applyCheat(id, sel, opt);
        if (Math.random() < 0.5) this.bubbleAt(0, this.say(0, 'safe'));
      } catch (e) { console.error('cheat', id, e); }
      finally {
        $$('#pick-panel').forEach(e => e.remove());
        this.busy = false;
        if (!this.aborted && this.pending === P) { this.updateHint(); this.updateHUD(); this.renderSelf(false); }
      }
    }
    async applyCheat(id, sel, opt) {
      const g = this.g, h = g.h, pl = h.players[0], MJ = root.MJ, C3 = root.Cheat3D;
      if (id === 'swap') {
        const r = g.doSwap(sel.handId, sel.wallIndex); if (!r) return;
        g.pay('swap');
        g.refreshOpt(opt, opt.drawnId === sel.handId ? r.inId : undefined);
        await C3.swap({ wall: h.wall, drawPtr: h.drawPtr, hand: MJ.sortIds(pl.hand), drawnId: opt.drawnId, inId: r.inId, outId: r.outId, wallIndex: r.wallIndex });
      } else if (id === 'raid') {
        const r = g.doRaid(sel.handId, sel.q, sel.idx); if (!r) return;
        g.pay('raid');
        g.refreshOpt(opt, opt.drawnId === sel.handId ? r.inId : undefined);
        const loc = S.findDiscard(r.inId);           // 3D側の河は鳴かれた牌を詰めているので位置を引き直す
        await C3.raid({ hand: MJ.sortIds(pl.hand), drawnId: opt.drawnId, inId: r.inId, outId: r.outId, p: loc ? loc.p : sel.q, idx: loc ? loc.idx : sel.idx });
      } else if (id === 'peek') {
        g.pay('peek');
        this.peekOn = true;
        await C3.peek(true);
      } else if (id === 'slam') {
        const ex = g.doSlam(0);
        g.pay('slam');
        await C3.slam(ex);
        for (let q = 1; q < this.n; q++) S.standee(q, 'shake');
      } else if (id === 'dora') {
        const r = g.doDora(0);
        if (!r) { root.FXC.toast(t('block.dora'), 'bad'); return; }
        g.pay('dora');
        g.refreshOpt(opt);
        await C3.doraBomb({ wall: h.wall, drawPtr: h.drawPtr, id: r.id });
        this.refreshDora();
      }
    }
    pickPanel(html) {
      $$('#pick-panel').forEach(e => e.remove());
      const p = root.U.el(`<div id="pick-panel">${html}<button class="btn tiny pk-cancel">${esc(t('cheat.cancel'))}</button></div>`);
      $('#app').appendChild(p);
      return p;
    }
    /** 燕返し: 山の次の6枚から1枚 → 手牌から1枚 */
    pickSwap() {
      return new Promise(resolve => {
        const g = this.g, cands = g.swapCandidates(6);
        const c = CH.byId.swap;
        const panel = this.pickPanel(`<div class="pk-title" style="--c:${c.color}"><span class="ck">${c.kanji}</span>${esc(t('cheat.pickWall'))}</div>
          <div class="pk-sub">${esc(t('cheat.wallLabel'))}</div>
          <div class="pk-row">${cands.map((x, i) => `<button class="pk-tile" data-i="${i}">${root.Tiles2D.tileHTML(x.id)}</button>`).join('')}</div>`);
        let chosen = null;
        const finish = (v) => { this.pickCancel = null; S.setInteractive(false); S.onTileClick = null; panel.remove(); resolve(v); };
        this.pickCancel = () => finish(null);
        panel.querySelector('.pk-cancel').onclick = (e) => { e.stopPropagation(); root.Sound.sfx('click'); finish(null); };
        $$('.pk-tile', panel).forEach(b => b.onclick = (e) => {
          e.stopPropagation(); root.Sound.sfx('click');
          chosen = cands[+b.dataset.i];
          $$('.pk-tile', panel).forEach(x => x.classList.toggle('on', x === b));
          panel.querySelector('.pk-sub').textContent = t('cheat.pickHand');
          panel.classList.add('step2');
          S.setInteractive(true, this.g.h.players[0].hand.slice());
          S.onTileClick = (id) => { if (chosen) finish({ handId: id, wallIndex: chosen.wallIndex }); };
        });
      });
    }
    /** 河拾い: 誰かの河から1枚 → 手牌から1枚 */
    pickRaid() {
      return new Promise(resolve => {
        const g = this.g, list = g.raidable();
        const c = CH.byId.raid;
        const byP = {};
        list.forEach((x, i) => { (byP[x.p] = byP[x.p] || []).push({ ...x, i }); });
        const panel = this.pickPanel(`<div class="pk-title" style="--c:${c.color}"><span class="ck">${c.kanji}</span>${esc(t('cheat.pickRiver'))}</div>
          <div class="pk-sub"></div>
          <div class="pk-rivers">${Object.keys(byP).map(p => `<div class="pk-river" style="--pc:${this.seats[p].char.color}"><span class="pk-who">${esc(this.nm(+p))}</span><div class="pk-row small">${byP[p].map(x => `<button class="pk-tile" data-i="${x.i}">${root.Tiles2D.tileHTML(x.id, { small: true })}</button>`).join('')}</div></div>`).join('')}</div>`);
        let chosen = null;
        const finish = (v) => { this.pickCancel = null; S.setInteractive(false); S.onTileClick = null; panel.remove(); resolve(v); };
        this.pickCancel = () => finish(null);
        panel.querySelector('.pk-cancel').onclick = (e) => { e.stopPropagation(); root.Sound.sfx('click'); finish(null); };
        $$('.pk-tile', panel).forEach(b => b.onclick = (e) => {
          e.stopPropagation(); root.Sound.sfx('click');
          chosen = list[+b.dataset.i];
          $$('.pk-tile', panel).forEach(x => x.classList.toggle('on', x === b));
          panel.querySelector('.pk-sub').textContent = t('cheat.pickGive');
          panel.classList.add('step2');
          S.setInteractive(true, this.g.h.players[0].hand.slice());
          S.onTileClick = (id) => { if (chosen) finish({ handId: id, q: chosen.p, idx: chosen.idx }); };
        });
      });
    }

    /* ---------- キー操作 ---------- */
    onKey(e) {
      if (e.repeat || this.aborted) return;
      if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === '6') { e.preventDefault(); this.useCheat('sig'); return; }
      const c = CH.CHEATS.find(x => x.key === e.key);
      if (c && c.id !== 'flip') { e.preventDefault(); this.useCheat(c.id); return; }
      if ((e.key === 'f' || e.key === 'F') && this.pending && this.pending.type === 'flip') { e.preventDefault(); this.pending.flip(); return; }
      if (e.key === 'Escape' && this.pickCancel) { this.pickCancel(); return; }
      if ((e.key === 'Enter' || e.key === ' ') && this.pending && this.pending.type === 'result') { e.preventDefault(); this.pending.resolve(); }
    }

    /* ---------- アシスト ---------- */
    updateHint() {
      const el = $('#hint');
      if (!this.app.save.settings.assist || !this.g.h) { el.textContent = ''; return; }
      const MJ = root.MJ, T2 = root.Tiles2D;
      const pl = this.g.h.players[0];
      const c = MJ.countsFromIds(pl.hand);
      if (pl.hand.length % 3 === 1) {
        const w = MJ.waits(c, pl.melds, this.g.is3p);
        if (w.length) {
          const vis = root.AI.visibleCounts(this.g, 0);
          const left = w.reduce((a, x) => a + Math.max(0, 4 - vis[x]), 0);
          el.innerHTML = `<b class="tenpai">${esc(t('hint.tenpai'))}</b> ${esc(t('hint.wait'))} ${w.map(x => T2.typeHTML(x, { small: true })).join('')} ${esc(t('hint.left', { n: left }))}`;
        } else el.innerHTML = `<b>${esc(t('hint.shanten', { n: MJ.shanten(c, pl.melds.length) }))}</b>`;
      } else {
        const sh = MJ.shanten(c, pl.melds.length);
        el.innerHTML = sh === -1 ? `<b class="tenpai">${esc(t('hint.agari'))}</b>` : `<b>${esc(sh === 0 ? t('hint.tenpai') : t('hint.shanten', { n: sh }))}</b> ${esc(t('hint.choosing'))}`;
      }
    }
    onHover(id) {
      const el = $('#hint-hover');
      if (this.busy) return;
      if (id == null || !this.app.save.settings.assist || !this.g.h) { if (el && !(this.pending && (this.pending.type === 'call' || this.pending.riichiMode))) el.innerHTML = ''; return; }
      root.Sound.sfx('hover');
      const MJ = root.MJ, T2 = root.Tiles2D;
      const pl = this.g.h.players[0];
      if (pl.hand.length % 3 !== 2) return;
      const c = MJ.countsFromIds(pl.hand);
      c[id >> 2]--;
      const sh = MJ.shanten(c, pl.melds.length);
      const vis = root.AI.visibleCounts(this.g, 0);
      if (sh === 0) {
        const w = MJ.waits(c, pl.melds, this.g.is3p);
        const left = w.reduce((a, x) => a + Math.max(0, 4 - vis[x]), 0);
        el.innerHTML = `${T2.tileHTML(id, { small: true })}${esc(t('hint.cut'))} <b class="tenpai">${esc(t('hint.tenpai'))}</b> ${esc(t('hint.wait'))} ${w.map(x => T2.typeHTML(x, { small: true })).join('')} ${esc(t('hint.left', { n: left }))}`;
      } else {
        const uk = root.AI.ukeire(c, pl.melds.length, sh, vis, this.g.is3p);
        el.innerHTML = `${T2.tileHTML(id, { small: true })}${esc(t('hint.cut'))} ${esc(t('hint.shanten', { n: sh }))} ${esc(t('hint.ukeire', { n: uk.n }))}`;
      }
    }
  }

  root.GameUI = GameUI;
})(typeof window !== 'undefined' ? window : globalThis);
