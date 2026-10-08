// =========================================================
// Wire — P2P で送るデータの形式(1 パケット 2004 バイト以内)
//  type 1: 選手の状態(バイナリ・信頼しない通信)
//  type 2: 塗りの差分(バイナリ・信頼する通信)
//  type 3: イベント(JSON・信頼する通信)
//  three.js に依存しないので Node のテストでも使える
// =========================================================

export const MSG = { STATE: 1, PAINT: 2, JSON: 3 };
export const STATE_BYTES = 19;
export const MAX_PAYLOAD = 2004;

const enc = new TextEncoder();
const dec = new TextDecoder();
const clamp16 = (v) => Math.max(-32767, Math.min(32767, Math.round(v)));
const clamp8 = (v) => Math.max(-127, Math.min(127, Math.round(v)));

/**
 * 選手の状態をまとめて エンコード
 * @param {Array<{idx,flags,g,px,py,pz,vx,vy,vz,ax,ay,az,hp}>} list
 */
export function encodeStates(list, seq) {
  const n = Math.min(list.length, Math.floor((MAX_PAYLOAD - 4) / STATE_BYTES));
  const buf = new ArrayBuffer(4 + n * STATE_BYTES);
  const dv = new DataView(buf);
  dv.setUint8(0, MSG.STATE);
  dv.setUint16(1, seq & 0xffff);
  dv.setUint8(3, n);
  let o = 4;
  for (let i = 0; i < n; i++) {
    const s = list[i];
    dv.setUint8(o, s.idx); dv.setUint8(o + 1, s.flags & 0xff); dv.setUint8(o + 2, s.g & 0xff);
    dv.setInt16(o + 3, clamp16(s.px * 100)); dv.setInt16(o + 5, clamp16(s.py * 100)); dv.setInt16(o + 7, clamp16(s.pz * 100));
    dv.setInt16(o + 9, clamp16(s.vx * 100)); dv.setInt16(o + 11, clamp16(s.vy * 100)); dv.setInt16(o + 13, clamp16(s.vz * 100));
    dv.setInt8(o + 15, clamp8(s.ax * 127)); dv.setInt8(o + 16, clamp8(s.ay * 127)); dv.setInt8(o + 17, clamp8(s.az * 127));
    dv.setUint8(o + 18, Math.max(0, Math.min(255, Math.round(s.hp))));
    o += STATE_BYTES;
  }
  return new Uint8Array(buf);
}

export function decodeStates(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const seq = dv.getUint16(1);
  const n = dv.getUint8(3);
  if (bytes.byteLength < 4 + n * STATE_BYTES) return null;
  const list = [];
  let o = 4;
  for (let i = 0; i < n; i++) {
    list.push({
      idx: dv.getUint8(o), flags: dv.getUint8(o + 1), g: dv.getUint8(o + 2),
      px: dv.getInt16(o + 3) / 100, py: dv.getInt16(o + 5) / 100, pz: dv.getInt16(o + 7) / 100,
      vx: dv.getInt16(o + 9) / 100, vy: dv.getInt16(o + 11) / 100, vz: dv.getInt16(o + 13) / 100,
      ax: dv.getInt8(o + 15) / 127, ay: dv.getInt8(o + 16) / 127, az: dv.getInt8(o + 17) / 127,
      hp: dv.getUint8(o + 18),
    });
    o += STATE_BYTES;
  }
  return { seq, list };
}

/**
 * 塗りの差分(マス番号 + 持ち主)を、上限サイズごとに分割してエンコード
 * @returns {Uint8Array[]}
 */
export function encodePaint(cells, owners, maxPayload = MAX_PAYLOAD) {
  const per = Math.floor((maxPayload - 3) / 3);
  const out = [];
  for (let s = 0; s < cells.length; s += per) {
    const n = Math.min(per, cells.length - s);
    const buf = new Uint8Array(3 + n * 3);
    const dv = new DataView(buf.buffer);
    dv.setUint8(0, MSG.PAINT);
    dv.setUint16(1, n);
    for (let i = 0; i < n; i++) {
      dv.setUint16(3 + i * 3, cells[s + i]);
      dv.setUint8(5 + i * 3, owners[s + i]);
    }
    out.push(buf);
  }
  return out;
}

export function decodePaint(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const n = dv.getUint16(1);
  if (bytes.byteLength < 3 + n * 3) return null;
  const cells = new Array(n), owners = new Array(n);
  for (let i = 0; i < n; i++) { cells[i] = dv.getUint16(3 + i * 3); owners[i] = dv.getUint8(5 + i * 3); }
  return { cells, owners };
}

export function encodeJSON(obj) {
  const body = enc.encode(JSON.stringify(obj));
  const buf = new Uint8Array(body.byteLength + 1);
  buf[0] = MSG.JSON;
  buf.set(body, 1);
  if (buf.byteLength > MAX_PAYLOAD) throw new Error(`message too large: ${obj.k} (${buf.byteLength}B)`);
  return buf;
}

export function decodeJSON(bytes) {
  try { return JSON.parse(dec.decode(bytes.subarray(1))); } catch { return null; }
}

/** 小数を 2 桁に丸める(JSON を小さくする) */
export const r2 = (v) => Math.round(v * 100) / 100;
export const vec = (v) => [r2(v.x), r2(v.y), r2(v.z)];
