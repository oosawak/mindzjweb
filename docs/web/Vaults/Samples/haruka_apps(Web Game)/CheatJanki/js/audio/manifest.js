/* =========================================================
 *  サウンドの ID とファイルの対応（assets/audio/ 以下）
 *  プロンプトは elevenlabs/*.json（同じ ID）。生成されたファイルだけが
 *  assets/audio/available.js に載り、載っていない音は鳴りません（仮サウンドなし）。
 * ========================================================= */
(function (root) {
  'use strict';
  const BGM = {
    bgm_title:   { file: 'bgm/bgm_title.mp3', vol: 0.7 },
    bgm_game:    { file: 'bgm/bgm_game.mp3', vol: 0.55 },
    bgm_tension: { file: 'bgm/bgm_tension.mp3', vol: 0.6 },
    bgm_cheat:   { file: 'bgm/bgm_cheat.mp3', vol: 0.65 },
    bgm_result:  { file: 'bgm/bgm_result.mp3', vol: 0.6 },
    bgm_ending:  { file: 'bgm/bgm_ending.mp3', vol: 0.75 },
  };
  const S = (id, vol) => [id, { file: `sfx/${id}.mp3`, vol }];
  const SFX = Object.fromEntries([
    S('sfx_ui_click', 0.7), S('sfx_ui_hover', 0.35), S('sfx_ui_start', 0.7),
    S('sfx_deal', 0.8), S('sfx_draw', 0.7), S('sfx_tile', 0.9), S('sfx_tile_hard', 1.0), S('sfx_call', 0.7), S('sfx_riichi', 0.8),
    S('sfx_stick', 0.8), S('sfx_dora', 0.6), S('sfx_ryuukyoku', 0.7), S('sfx_win_impact', 0.9), S('sfx_yakuman_thunder', 0.9),
    S('sfx_stamp', 0.8), S('sfx_whoosh', 0.6), S('sfx_sparkle', 0.6), S('sfx_tick', 0.4), S('sfx_fanfare_win', 0.8), S('sfx_fanfare_yakuman', 0.9),
    S('sfx_timestop', 0.8), S('sfx_swap', 0.7), S('sfx_xray', 0.7), S('sfx_magnet', 0.7), S('sfx_slam', 0.95), S('sfx_bomb', 0.9), S('sfx_table_flip', 1.0),
    S('sfx_needle', 0.35), S('sfx_mg_perfect', 0.8), S('sfx_mg_success', 0.7), S('sfx_mg_fail', 0.8), S('sfx_heartbeat', 0.6),
    S('sfx_whistle', 0.85), S('sfx_card', 0.8), S('sfx_glint', 0.6), S('sfx_accuse', 0.9), S('sfx_banned', 0.9), S('sfx_countdown', 0.6), S('sfx_coin', 0.7),
  ]);
  /** 旧コード（fx.js など）が使う名前 → SFX ID */
  const ALIAS = {
    click: 'sfx_ui_click', hover: 'sfx_ui_hover', deal: 'sfx_deal', draw: 'sfx_draw', tile: 'sfx_tile', tileHard: 'sfx_tile_hard', call: 'sfx_call',
    riichi: 'sfx_riichi', coin: 'sfx_stick', dora: 'sfx_dora', ryuukyoku: 'sfx_ryuukyoku', impact: 'sfx_win_impact', thunder: 'sfx_yakuman_thunder',
    stamp: 'sfx_stamp', whoosh: 'sfx_whoosh', sparkle: 'sfx_sparkle', fever: 'sfx_sparkle', reveal: 'sfx_sparkle', tick: 'sfx_tick',
    timestop: 'sfx_timestop', swap: 'sfx_swap', xray: 'sfx_xray', magnet: 'sfx_magnet', slam: 'sfx_slam', bomb: 'sfx_bomb', flip: 'sfx_table_flip',
  };
  /** ボイス: voice/<lang>/<character|announcer>/<key>.mp3 */
  const voiceFile = (lang, who, key) => `voice/${lang}/${who}/${key}.mp3`;
  root.AudioManifest = { BASE: 'assets/audio/', BGM, SFX, ALIAS, voiceFile };
})(typeof window !== 'undefined' ? window : globalThis);
