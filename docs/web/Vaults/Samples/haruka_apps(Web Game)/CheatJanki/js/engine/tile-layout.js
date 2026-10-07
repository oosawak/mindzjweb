/* Shared, renderer-independent tile placement conventions. */
(function (root) {
  'use strict';
  const TW = 0.9, TH = 1.2;

  function wallSlot(index, count, opening) {
    const stacks = count === 3 ? 18 : 17;
    const total = stacks * count;
    // Taking right-to-left continues onto the wall at kamicha, not shimocha.
    const start = ((count - opening.side) % count) * stacks + opening.stack;
    const slot = (start + Math.floor(index / 2)) % total;
    return { p: (count - Math.floor(slot / stacks)) % count, stack: slot % stacks, level: index % 2, stacks };
  }

  function meldTiles(meld, player, count) {
    const called = meld.calledId;
    const ids = meld.ids.filter(id => id !== called && id !== meld.addedId).sort((a, b) => a - b);
    if (meld.type === 'ankan') {
      // Keep the red five visible between the two face-down outer tiles.
      const red = ids.findIndex(id => (id >> 2) < 27 && (id >> 2) % 9 === 4 && id % 4 === 0);
      if (red >= 0) [ids[1], ids[red]] = [ids[red], ids[1]];
    } else if (called != null) {
      const relative = (meld.from - player + count) % count;
      const index = relative === count - 1 ? 0 : relative === 1 ? ids.length : 1;
      ids.splice(index, 0, called);
    }
    return ids.map((id, index) => ({
      id, side: id === called,
      back: meld.type === 'ankan' && (index === 0 || index === ids.length - 1),
      addedId: id === called ? meld.addedId : null,
    }));
  }

  function meldWidth(meld, player, count) {
    return meldTiles(meld, player, count).reduce((sum, tile) => sum + (tile.side ? TH : TW), 0);
  }

  function riverTile(list, index) {
    // Six tiles per row. Extra discards continue along the third row.
    const row = Math.min(2, Math.floor(index / 6));
    const start = row * 6;
    let x = -2.7;
    for (let i = start; i < index; i++) x += list[i].riichi ? TH : TW;
    const side = !!list[index].riichi;
    x += (side ? TH : TW) / 2;
    return { x, z: 2.95 + TH / 2 + row * (TH + 0.06), side };
  }

  const api = { TW, TH, wallSlot, meldTiles, meldWidth, riverTile };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TileLayout = api;
})(typeof window !== 'undefined' ? window : globalThis);
