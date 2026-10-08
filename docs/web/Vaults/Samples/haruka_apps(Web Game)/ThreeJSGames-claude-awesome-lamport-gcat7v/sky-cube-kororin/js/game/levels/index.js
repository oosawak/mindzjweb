// =========================================================
// ステージ一覧 — 新しいステージを足すときは
//  1) levels/stageN.js を作る
//  2) ここに import して STAGES に追加
//  3) config.js の stageOrder に ID を追加
// =========================================================
import stage1 from './stage1.js';
import stage2 from './stage2.js';
import stage3 from './stage3.js';

export const STAGES = { stage1, stage2, stage3 };
