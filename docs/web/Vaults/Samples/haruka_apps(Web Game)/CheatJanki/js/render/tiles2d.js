/* =========================================================
 *  牌の絵柄（Canvas 描画）
 * ========================================================= */
(function (root) {
  'use strict';
  const W = 256, H = 344;
  const FONT_SERIF = '"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP","MS PMincho",serif';
  const FONT_SANS = '"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",sans-serif';

  const C_RED = '#d8263a', C_GREEN = '#0f8f5a', C_BLUE = '#1f4fb8', C_NAVY = '#1a2340';

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function base(ctx, opt) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#fffdf6'); g.addColorStop(1, '#f1ead8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (opt && opt.border) {
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 6;
      roundRect(ctx, 3, 3, W - 6, H - 6, 26); ctx.stroke();
    }
  }

  function pinCircle(ctx, x, y, r, color, red) {
    const col = red ? C_RED : color;
    ctx.save();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fffdf6'; ctx.beginPath(); ctx.arc(x, y, r * 0.72, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = r * 0.12;
    ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, Math.PI * 2); ctx.stroke();
    // 花びら模様
    ctx.fillStyle = col;
    for (let k = 0; k < 8; k++) {
      const a = k / 8 * Math.PI * 2;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.08, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function bamboo(ctx, x, y, len, color, red, angle) {
    const col = red ? C_RED : color;
    ctx.save();
    ctx.translate(x, y); if (angle) ctx.rotate(angle);
    const w = 20;
    ctx.fillStyle = col;
    roundRect(ctx, -w / 2, -len / 2, w, len, 9); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    roundRect(ctx, -w / 2 + 4, -len / 2 + 6, 5, len - 12, 3); ctx.fill();
    ctx.strokeStyle = '#fffdf6'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(0, 0, w * 0.62, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -len / 2 + 3, w * 0.6, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, len / 2 - 3, w * 0.6, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function bird(ctx) {
    // 一索: 可愛い孔雀
    ctx.save();
    ctx.translate(W / 2, H / 2 + 6);
    // 尾羽
    for (let k = -3; k <= 3; k++) {
      ctx.save(); ctx.rotate(k * 0.22 + Math.PI);
      ctx.fillStyle = k % 2 ? C_GREEN : '#1aa37a';
      ctx.beginPath(); ctx.ellipse(0, 70, 16, 58, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C_BLUE; ctx.beginPath(); ctx.arc(0, 108, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C_RED; ctx.beginPath(); ctx.arc(0, 108, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // 体
    ctx.fillStyle = C_RED; ctx.beginPath(); ctx.ellipse(0, 20, 34, 44, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C_GREEN; ctx.beginPath(); ctx.ellipse(-4, 24, 22, 34, -0.2, 0, Math.PI * 2); ctx.fill();
    // 頭
    ctx.fillStyle = C_BLUE; ctx.beginPath(); ctx.arc(10, -34, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(16, -38, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(17, -38, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f5b400'; ctx.beginPath(); ctx.moveTo(28, -32); ctx.lineTo(46, -28); ctx.lineTo(28, -24); ctx.fill();
    ctx.strokeStyle = C_RED; ctx.lineWidth = 4;
    for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(8, -52); ctx.lineTo(8 + k * 10, -70); ctx.stroke(); ctx.fillStyle = C_RED; ctx.beginPath(); ctx.arc(8 + k * 10, -72, 4, 0, Math.PI * 2); ctx.fill(); }
    // 脚
    ctx.strokeStyle = '#f5b400'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-8, 60); ctx.lineTo(-12, 84); ctx.moveTo(10, 60); ctx.lineTo(14, 84); ctx.stroke();
    ctx.restore();
  }

  function kanji(ctx, text, x, y, size, color, font) {
    ctx.save();
    ctx.font = `900 ${size}px ${font || FONT_SERIF}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.strokeStyle = color; ctx.lineWidth = size * 0.03;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function draw(ctx, t, red, opt) {
    base(ctx, opt);
    const NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (t < 9) {
      kanji(ctx, NUM[t], W / 2, H * 0.3, 118, red ? C_RED : C_NAVY);
      kanji(ctx, '萬', W / 2, H * 0.7, 124, C_RED);
      if (red) { ctx.fillStyle = C_RED; ctx.beginPath(); ctx.arc(W - 30, 30, 10, 0, Math.PI * 2); ctx.fill(); }
      return;
    }
    if (t < 18) {
      const n = t - 9 + 1;
      const cx = W / 2, cy = H / 2;
      const P = (x, y, r, c, rd) => pinCircle(ctx, x, y, r, c, rd || red);
      const dx = 58, dy = 70;
      switch (n) {
        case 1: {
          P(cx, cy, 96, C_BLUE, false);
          pinCircle(ctx, cx, cy, 58, C_GREEN, red);
          pinCircle(ctx, cx, cy, 24, C_RED, true);
          break;
        }
        case 2: P(cx, cy - 72, 50, C_GREEN); P(cx, cy + 72, 50, C_BLUE); break;
        case 3: P(cx - 70, cy - 100, 40, C_BLUE); P(cx, cy, 40, C_RED, true); P(cx + 70, cy + 100, 40, C_GREEN); break;
        case 4: P(cx - dx, cy - dy, 44, C_BLUE); P(cx + dx, cy - dy, 44, C_GREEN); P(cx - dx, cy + dy, 44, C_GREEN); P(cx + dx, cy + dy, 44, C_BLUE); break;
        case 5: P(cx - 64, cy - 94, 40, C_BLUE); P(cx + 64, cy - 94, 40, C_GREEN); P(cx, cy, 40, C_RED, true); P(cx - 64, cy + 94, 40, C_GREEN); P(cx + 64, cy + 94, 40, C_BLUE); break;
        case 6: for (const s of [-1, 1]) P(cx + s * 56, cy - 100, 36, C_GREEN); for (const s of [-1, 1]) for (const r of [0, 1]) P(cx + s * 56, cy + 10 + r * 82, 36, C_RED, true); break;
        case 7: for (let k = 0; k < 3; k++) P(cx - 76 + k * 76, cy - 118 + k * 34, 30, C_GREEN); for (const s of [-1, 1]) for (const r of [0, 1]) P(cx + s * 52, cy + 38 + r * 74, 34, C_RED, true); break;
        case 8: for (const s of [-1, 1]) for (let r = 0; r < 4; r++) P(cx + s * 54, cy - 116 + r * 77, 34, C_BLUE); break;
        case 9: {
          const cols = [C_BLUE, C_RED, C_GREEN];
          for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 3; c2++) P(cx - 74 + c2 * 74, cy - 104 + r * 104, 32, cols[r], r === 1);
          break;
        }
      }
      return;
    }
    if (t < 27) {
      const n = t - 18 + 1;
      const cx = W / 2, cy = H / 2;
      const B = (x, y, len, c, rd, a) => bamboo(ctx, x, y, len || 96, c === C_BLUE ? C_GREEN : (c || C_GREEN), rd || red, a);
      switch (n) {
        case 1: bird(ctx); break;
        case 2: B(cx, cy - 70, 110); B(cx, cy + 70, 110, C_BLUE); break;
        case 3: B(cx, cy - 72, 108); B(cx - 44, cy + 70, 108, C_BLUE); B(cx + 44, cy + 70, 108, C_BLUE); break;
        case 4: for (const s of [-1, 1]) { B(cx + s * 50, cy - 72, 108, C_GREEN); B(cx + s * 50, cy + 72, 108, C_BLUE); } break;
        case 5: for (const s of [-1, 1]) { B(cx + s * 70, cy - 72, 108, C_GREEN); B(cx + s * 70, cy + 72, 108, C_BLUE); } B(cx, cy, 108, C_RED, true); break;
        case 6: for (let k = -1; k <= 1; k++) { B(cx + k * 62, cy - 72, 108, C_GREEN); B(cx + k * 62, cy + 72, 108, C_BLUE); } break;
        case 7: B(cx, cy - 104, 76, C_RED, true); for (let k = -1; k <= 1; k++) { B(cx + k * 62, cy - 4, 86, C_GREEN); B(cx + k * 62, cy + 100, 86, C_BLUE); } break;
        case 8: {
          const L = 100;
          B(cx - 88, cy - 76, L, C_GREEN); B(cx + 88, cy - 76, L, C_GREEN);
          B(cx - 36, cy - 76, L, C_GREEN, false, 0.45); B(cx + 36, cy - 76, L, C_GREEN, false, -0.45);
          B(cx - 88, cy + 76, L, C_BLUE); B(cx + 88, cy + 76, L, C_BLUE);
          B(cx - 36, cy + 76, L, C_BLUE, false, -0.45); B(cx + 36, cy + 76, L, C_BLUE, false, 0.45);
          break;
        }
        case 9: for (let r = -1; r <= 1; r++) for (let k = -1; k <= 1; k++) B(cx + k * 64, cy + r * 104, 84, k === 0 ? C_RED : (r === 0 ? C_BLUE : C_GREEN), k === 0); break;
      }
      return;
    }
    // 字牌
    const H_ = ['東', '南', '西', '北'];
    if (t <= 30) { kanji(ctx, H_[t - 27], W / 2, H / 2 + 6, 178, C_NAVY); return; }
    if (t === 31) {
      // Japanese haku is a blank white face; the pink tile back remains distinct.
      return;
    }
    if (t === 32) { kanji(ctx, '發', W / 2, H / 2 + 6, 176, C_GREEN); return; }
    if (t === 33) { kanji(ctx, '中', W / 2, H / 2 + 6, 190, C_RED); return; }
  }

  const canvases = new Map();
  function faceCanvas(t, red) {
    const key = t + (red ? 'r' : '');
    if (canvases.has(key)) return canvases.get(key);
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    draw(cv.getContext('2d'), t, red, {});
    canvases.set(key, cv);
    return cv;
  }
  const urls = new Map();
  function faceURL(t, red) {
    const key = t + (red ? 'r' : '');
    if (urls.has(key)) return urls.get(key);
    const cv = document.createElement('canvas');
    cv.width = W / 2; cv.height = H / 2;
    const ctx = cv.getContext('2d');
    ctx.scale(0.5, 0.5);
    draw(ctx, t, red, { border: true });
    const u = cv.toDataURL();
    urls.set(key, u);
    return u;
  }
  /** 2D 表示用 <img> HTML */
  function tileHTML(id, opt) {
    opt = opt || {};
    const t = id >> 2;
    const red = t < 27 && t % 9 === 4 && id % 4 === 0;
    const cls = ['tile2d'];
    if (opt.side) cls.push('side');
    if (opt.back) cls.push('back');
    if (opt.win) cls.push('win');
    if (opt.dora) cls.push('dora');
    if (opt.small) cls.push('small');
    const name = opt.back ? '伏せ牌' : (red ? '赤' : '') + root.MJ.tileName(t);
    if (opt.back) return `<span class="${cls.join(' ')}" role="img" aria-label="${name}"></span>`;
    return `<span class="${cls.join(' ')}" title="${name}"><img src="${faceURL(t, red)}" alt="${name}"></span>`;
  }
  function typeHTML(t, opt) { return tileHTML(t * 4 + 1, opt); }
  function meldHTML(meld, player, count, opt) {
    return `<span class="meld">${root.TileLayout.meldTiles(meld, player, count).map(tile => {
      const face = tileHTML(tile.id, { ...opt, side: tile.side, back: tile.back });
      return tile.addedId == null ? face : `<span class="meld-stack">${tileHTML(tile.addedId, { ...opt, side: true })}${face}</span>`;
    }).join('')}</span>`;
  }

  root.Tiles2D = { faceCanvas, faceURL, tileHTML, typeHTML, meldHTML, W, H };
})(typeof window !== 'undefined' ? window : globalThis);
