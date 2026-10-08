// =========================================================
// Icons — すべて自作のシンプルな SVG アイコン
// =========================================================

const svg = (inner, vb = '0 0 24 24') =>
  `<svg class="ico" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

export const Icons = {
  play: svg('<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>'),
  help: svg('<circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.2a2.8 2.8 0 1 1 3.9 2.6c-.8.4-1.2 1-1.2 1.9v.6"/><circle cx="12" cy="17.6" r="1.3" fill="currentColor" stroke="none"/>'),
  gear: svg('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/>'),
  star: svg('<path d="M12 2.6l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.9l-5.8 3.2 1.4-6.4-4.9-4.4 6.5-.7z" fill="currentColor" stroke="none"/>'),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
  next: svg('<path d="M9 5l7 7-7 7"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  pause: svg('<rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" stroke="none"/>'),
  home: svg('<path d="M3.5 11.5 12 4l8.5 7.5"/><path d="M6 10v9.5h12V10"/>'),
  retry: svg('<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 4v4.5h4.5"/>'),
  skip: svg('<path d="M4 5l8 7-8 7z" fill="currentColor" stroke="none"/><path d="M12 5l8 7-8 7z" fill="currentColor" stroke="none"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
  jump: svg('<path d="M12 19V6"/><path d="M6.5 11.5 12 6l5.5 5.5"/>'),
  sparkle: svg('<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
  cube: svg('<path d="M12 2.8 20.5 7.5v9L12 21.2 3.5 16.5v-9z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9.2"/>'),
};

/** あそびかた ページ用のイラスト(SVG) */
export const HowtoArt = {
  move: `<svg class="art" viewBox="0 0 300 200" aria-hidden="true">
    <rect x="10" y="150" width="280" height="30" rx="10" fill="#9cc8ff"/>
    <circle cx="150" cy="122" r="28" fill="#fff3d6" stroke="#2b2d5c" stroke-width="3"/>
    <ellipse cx="141" cy="118" rx="4" ry="6" fill="#2b2d5c"/><ellipse cx="159" cy="118" rx="4" ry="6" fill="#2b2d5c"/>
    <circle cx="133" cy="130" r="5" fill="#ff9cc2" opacity=".7"/><circle cx="167" cy="130" r="5" fill="#ff9cc2" opacity=".7"/>
    <path d="M92 122h-40M60 112l-10 10 10 10" stroke="#ffaa1f" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M208 122h40M240 112l10 10-10 10" stroke="#ffaa1f" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="60" cy="50" r="34" fill="#fff" opacity=".7" stroke="#2b2d5c" stroke-width="3"/><circle cx="72" cy="44" r="15" fill="#ffe27a" stroke="#2b2d5c" stroke-width="3"/>
    <circle cx="240" cy="50" r="30" fill="#ffb3d1" stroke="#2b2d5c" stroke-width="3"/><path d="M240 64V38M229 48l11-11 11 11" stroke="#6a1840" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  gravity: `<svg class="art" viewBox="0 0 300 200" aria-hidden="true">
    <rect x="40" y="20" width="220" height="160" rx="12" fill="#d8ebff" stroke="#2b2d5c" stroke-width="3"/>
    <rect x="40" y="160" width="220" height="20" fill="#9cc8ff"/>
    <rect x="240" y="20" width="20" height="160" fill="#ffe27a"/>
    <circle cx="110" cy="138" r="20" fill="#fff3d6" stroke="#2b2d5c" stroke-width="3"/>
    <path d="M135 120q50-40 90-30" stroke="#ff6f9f" stroke-width="5" fill="none" stroke-dasharray="8 8" stroke-linecap="round"/>
    <path d="M214 80l14 10-16 6" stroke="#ff6f9f" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="250" cy="80" r="16" fill="none" stroke="#ff6f9f" stroke-width="4"/><circle cx="250" cy="80" r="6" fill="#ff6f9f"/>
    <path d="M262 112l10 20 6-8 10 2z" fill="#fff" stroke="#2b2d5c" stroke-width="3" stroke-linejoin="round"/>
  </svg>`,
  look: `<svg class="art" viewBox="0 0 300 200" aria-hidden="true">
    <ellipse cx="150" cy="110" rx="110" ry="40" fill="none" stroke="#9cc8ff" stroke-width="6" stroke-dasharray="12 10"/>
    <path d="M250 96l12 14-18 4" stroke="#4b6fe0" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="150" cy="104" r="26" fill="#fff3d6" stroke="#2b2d5c" stroke-width="3"/>
    <ellipse cx="142" cy="100" rx="4" ry="6" fill="#2b2d5c"/><ellipse cx="158" cy="100" rx="4" ry="6" fill="#2b2d5c"/>
    <path d="M210 40q30-10 50 10" stroke="#ffaa1f" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M196 30l10 18 6-9 11 1z" fill="#fff" stroke="#2b2d5c" stroke-width="3" stroke-linejoin="round"/>
  </svg>`,
  goal: `<svg class="art" viewBox="0 0 300 200" aria-hidden="true">
    <path d="M70 60l8 16 18 2-13 12 4 18-17-9-17 9 4-18-13-12 18-2z" fill="#ffd447" stroke="#c97a00" stroke-width="3" stroke-linejoin="round"/>
    <path d="M230 30l16 33 36 4-27 24 8 35-33-18-33 18 8-35-27-24 36-4z" fill="#fff07a" stroke="#c97a00" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="230" cy="80" r="70" fill="none" stroke="#ffd447" stroke-width="3" opacity=".6"/>
    <rect x="60" y="150" width="120" height="16" rx="6" fill="#b56cff"/>
    <path d="M70 158l10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8 10-8 10 8" stroke="#fff" stroke-width="3" fill="none"/>
    <path d="M120 140v-14M112 132l8-8 8 8" stroke="#ff4f6f" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,
};
