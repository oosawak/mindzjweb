// 2 タブ対戦テスト(にせ Wavedash SDK)
//   1) cd inkfall && python3 -m http.server 8766
//   2) node tests/mp-fake-sdk.mjs   (Playwright が必要: npm i -g playwright)
// ロビー作成 → 一覧から参加 → 準備完了 → 開始 → 移動/射撃 → 塗りの同期を確認する。
import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:8766/index.html';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 480, height: 270 } });
await ctx.addInitScript(() => localStorage.setItem('inkfall.settings.v1', JSON.stringify({ quality: 'low', language: 'en', seenIntro: true })));
const logs = [];
const mk = async (name) => {
  const p = await ctx.newPage();
  p.on('pageerror', (e) => logs.push(`[${name} pageerror] ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404') && !m.text().includes('Failed to load')) logs.push(`[${name}] ${m.text()}`); });
  await p.goto(`${base}?fakesdk=${name}&autostart=1`);
  await p.waitForFunction(() => window.__inkfall && __inkfall.manager.currentName === 'title', null, { timeout: 60000 });
  return p;
};
const A = await mk('alice');
const B = await mk('bob');
await A.evaluate(() => __inkfall.manager.go('lobby'));
await B.evaluate(() => __inkfall.manager.go('lobby'));
await A.waitForFunction(() => __inkfall.manager.currentName === 'lobby');
await B.waitForFunction(() => __inkfall.manager.currentName === 'lobby');
await A.evaluate(() => __inkfall.net.create('turf'));
await B.waitForTimeout(1500);
const list = await B.evaluate(() => __inkfall.net.refreshList().then((l) => l.map((x) => x.id)));
console.log('lobbies seen by bob:', list);
await B.evaluate((id) => __inkfall.net.join(id), list[0]);
await A.waitForFunction(() => __inkfall.net.roster.length === 2, null, { timeout: 15000 });
await B.waitForFunction(() => __inkfall.net.roster.length === 2, null, { timeout: 15000 });
console.log('roster A:', JSON.stringify(await A.evaluate(() => __inkfall.net.roster)));
await B.evaluate(() => __inkfall.net.setReady(true));
await A.waitForFunction(() => __inkfall.net.roster.every((r) => r.ready) && __inkfall.net.allConnected, null, { timeout: 15000 });
await A.evaluate(() => __inkfall.manager.current.hostStart());
await A.waitForFunction(() => __inkfall.manager.currentName === 'match', null, { timeout: 20000 });
await B.waitForFunction(() => __inkfall.manager.currentName === 'match', null, { timeout: 20000 });
console.log('both in match');
// wait until play
await A.waitForFunction(() => __inkfall.manager.current.match?.phase === 'play', null, { timeout: 120000 });
await B.waitForFunction(() => __inkfall.manager.current.match?.phase === 'play', null, { timeout: 60000 });
console.log('both playing');
// bob moves forward & fires for a while
await B.bringToFront();
const t0 = Date.now();
while (Date.now() - t0 < 12000) {
  await B.evaluate(() => { const i = __inkfall.input; i.keys.add('KeyW'); i.btn.fire = true; i.look.x += 0.02; });
  await B.waitForTimeout(250);
}
console.log('B dbg', JSON.stringify(await B.evaluate(() => { const s = __inkfall.manager.current, m = s.match, i = __inkfall.input; return { canAct: s.canAct(), move: i.move, ctrl: m.me.ctrl, modal: s.ui.hasModal(), paused: s.paused, alive: m.me.alive, phase: m.phase, gameplay: i.gameplay, meIdx: m.me.idx, isLocal: m.me.isLocal, pos: m.me.pos.toArray(), basis: !!m.meBasis }; })));
await B.evaluate(() => { const i = __inkfall.input; i.keys.delete('KeyW'); i.btn.fire = false; });
console.log('bob focus?', await B.evaluate(() => document.hasFocus()), 'A focus?', await A.evaluate(() => document.hasFocus()));
await B.waitForTimeout(3000);
const state = async (p) => p.evaluate(() => {
  const m = __inkfall.manager.current.match;
  const bob = m.actors.find((a) => a.userId === 'u_bob');
  const alice = m.actors.find((a) => a.userId === 'u_alice');
  const own = Array.from(m.arena.owner);
  let h = 0; for (let i = 0; i < own.length; i++) h = (h * 31 + own[i]) >>> 0;
  return { host: m.isHost, phase: m.phase, t: +m.timeLeft.toFixed(1), counts: m.arena.counts.slice(), bob: bob.pos.toArray().map((v) => +v.toFixed(1)), bobCells: bob.stats.cells, alice: alice.pos.toArray().map((v) => +v.toFixed(1)), bot0: m.actors.find((a) => a.isBot)?.pos.toArray().map((v) => +v.toFixed(1)), hash: h, score: m.score };
});
const sa = await state(A), sb = await state(B);
console.log('A(host):', JSON.stringify(sa));
console.log('B(client):', JSON.stringify(sb));
// ownership agreement
const agree = await Promise.all([A, B].map((p) => p.evaluate(() => Array.from(__inkfall.manager.current.match.arena.owner))));
let diff = 0; for (let i = 0; i < agree[0].length; i++) if (agree[0][i] !== agree[1][i]) diff++;
console.log('paint cells differing:', diff, 'of', agree[0].length, '(数マスは送信中の差分。2〜3秒で再同期される)');
if (sa.t - sb.t > 1 || diff > 120) { console.error('SYNC FAILED'); process.exitCode = 1; }
console.log(logs.join('\n') || 'no errors');
await browser.close();
