// node --test tests/  … 通信データ形式のテスト(three.js 不要)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeStates, decodeStates, encodePaint, decodePaint, encodeJSON, decodeJSON, MSG, MAX_PAYLOAD, STATE_BYTES } from '../js/net/Wire.js';

test('state roundtrip (8 actors, quantized)', () => {
  const list = Array.from({ length: 8 }, (_, i) => ({ idx: i, flags: 5, g: i % 6, px: -12.34 + i, py: 17.5, pz: 3.21, vx: 30.1, vy: -31.99, vz: 0, ax: 0.6, ay: -0.8, az: 0, hp: 66 }));
  const bytes = encodeStates(list, 65537);
  assert.equal(bytes[0], MSG.STATE);
  assert.equal(bytes.byteLength, 4 + 8 * STATE_BYTES);
  const d = decodeStates(bytes);
  assert.equal(d.seq, 1);
  assert.equal(d.list.length, 8);
  for (let i = 0; i < 8; i++) {
    const s = d.list[i];
    assert.equal(s.idx, i);
    assert.equal(s.g, i % 6);
    assert.ok(Math.abs(s.px - list[i].px) < 0.011);
    assert.ok(Math.abs(s.vy - list[i].vy) < 0.011);
    assert.ok(Math.abs(s.ax - 0.6) < 0.01);
    assert.equal(s.hp, 66);
  }
});

test('paint deltas are split under the Wavedash payload limit', () => {
  const n = 3700;
  const cells = Array.from({ length: n }, (_, i) => i);
  const owners = cells.map((c) => (c % 3));
  const chunks = encodePaint(cells, owners);
  assert.ok(chunks.length > 1);
  let back = [];
  for (const c of chunks) {
    assert.ok(c.byteLength <= MAX_PAYLOAD);
    const d = decodePaint(c);
    back = back.concat(d.cells.map((cell, i) => [cell, d.owners[i]]));
  }
  assert.equal(back.length, n);
  assert.deepEqual(back[1234], [1234, 1234 % 3]);
});

test('json events roundtrip and reject oversize', () => {
  const m = { k: 'shots', i: 3, s: [[1.25, 2, 3, 0.1, 0.2, 0.97]] };
  assert.deepEqual(decodeJSON(encodeJSON(m)), m);
  assert.throws(() => encodeJSON({ k: 'big', d: 'x'.repeat(3000) }));
});

test('decoders survive garbage', () => {
  assert.equal(decodeJSON(new Uint8Array([3, 0xff, 0xfe])), null);
  assert.equal(decodeStates(new Uint8Array([1, 0, 0, 9])), null);
  assert.equal(decodePaint(new Uint8Array([2, 0, 50])), null);
});
