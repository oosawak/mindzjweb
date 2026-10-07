/* =========================================================
 *  クレジット（ゲーム内クレジット画面・スタッフロール・CREDITS.md）
 *  外部リンクは載せない方針です。素材を追加したらここを更新してください。
 * ========================================================= */
(function (root) {
  'use strict';
  const CREDITS = [
    { head: { ja: 'ゲームデザイン・プログラム・演出', en: 'Game Design · Programming · Direction' }, lines: ['haruka_apps'] },
    { head: { ja: '麻雀ルールエンジン・AI', en: 'Mahjong Rules Engine · AI' }, lines: ['haruka_apps'] },
    { head: { ja: 'キャラクター・イラスト', en: 'Characters · Illustrations' }, lines: ['haruka_apps', { ja: '（画像生成AIで制作）', en: '(created with AI image generation)' }] },
    { head: { ja: '3D・牌・エフェクト', en: '3D Table · Tiles · Effects' }, lines: ['haruka_apps', { ja: '（すべてプログラムで描画したオリジナル）', en: '(all original, drawn in code)' }] },
    { head: { ja: '音楽・効果音・ボイス', en: 'Music · Sound Effects · Voices' }, lines: [{ ja: 'ElevenLabs で生成（haruka_apps）', en: 'Generated with ElevenLabs for haruka_apps' }, { ja: 'キャラクターボイス・審判ボイス（日本語 / 英語）: ElevenLabs Eleven v4', en: 'Character & referee voices (Japanese / English): ElevenLabs Eleven v4' }] },
    { head: { ja: '3Dエンジン', en: '3D Engine' }, lines: ['three.js r186', { ja: '© 2010-2026 three.js authors / MIT License', en: '© 2010-2026 three.js authors / MIT License' }] },
    { head: { ja: 'フォント', en: 'Fonts' }, lines: ['M PLUS Rounded 1c — M+ Fonts Project', 'Dela Gothic One — artakana', { ja: 'SIL Open Font License 1.1', en: 'SIL Open Font License 1.1' }] },
    { head: { ja: 'おことわり', en: 'Notice' }, lines: [{ ja: '登場人物・団体はすべて架空です。', en: 'All characters and organizations are fictional.' }, { ja: 'イカサマは、ゲームの中だけにしましょう。', en: 'Please keep the cheating inside the game.' }] },
  ];
  const COPYRIGHT = '© 2026 haruka_apps. All rights reserved.';
  root.Credits = { CREDITS, COPYRIGHT };
})(typeof window !== 'undefined' ? window : globalThis);
