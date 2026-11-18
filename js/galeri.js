/* Galeri pribadi: paket gambar disimpan di IndexedDB perangkat, tidak pernah di repo. */
'use strict';
window.GAL = (() => {
  const DB = 'btkv-galeri', V = 1;
  let man = null, urls = new Map();
  const open = () => new Promise((res, rej) => {
    if (!('indexedDB' in window)) return rej(new Error('IndexedDB tidak tersedia'));
    const r = indexedDB.open(DB, V);
    r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('img')) d.createObjectStore('img'); if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta'); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  const tx = async (store, mode, fn) => { const d = await open(); return new Promise((res, rej) => { const t = d.transaction(store, mode), s = t.objectStore(store), out = fn(s); t.oncomplete = () => res(out instanceof IDBRequest ? out.result : out); t.onerror = () => rej(t.error); }); };
  async function load() { try { const r = await tx('meta', 'readonly', s => s.get('man')); man = r && r.imgs && r.items ? r : null; } catch (e) { man = null; } return man; }
  async function importFile(file, onProg) {
    const buf = await file.arrayBuffer(), u8 = new Uint8Array(buf);
    if (new TextDecoder().decode(u8.slice(0, 8)) !== 'BTKVPK01') throw new Error('Berkas ini bukan paket galeri BTKV Saku.');
    const len = new DataView(buf).getUint32(8, true), m = JSON.parse(new TextDecoder().decode(u8.slice(12, 12 + len))), base = 12 + len;
    if (navigator.storage && navigator.storage.persist) { try { await navigator.storage.persist(); } catch (e) {} }
    const d = await open(), B = 40;
    for (let i = 0; i < m.imgs.length; i += B) {
      await new Promise((res, rej) => { const t = d.transaction('img', 'readwrite'), s = t.objectStore('img');
        m.imgs.slice(i, i + B).forEach(im => s.put(new Blob([u8.slice(base + im.o, base + im.o + im.n)], {type: 'image/jpeg'}), im.id));
        t.oncomplete = res; t.onerror = () => rej(t.error); });
      onProg && onProg(Math.min(1, (i + B) / m.imgs.length));
    }
    m.imgs.forEach(im => { delete im.o; delete im.n; });
    await tx('meta', 'readwrite', s => s.put(m, 'man')); man = m; return m;
  }
  async function clear() { urls.forEach(u => URL.revokeObjectURL(u)); urls.clear(); await tx('img', 'readwrite', s => s.clear()); await tx('meta', 'readwrite', s => s.clear()); man = null; }
  async function url(id) {
    if (urls.has(id)) return urls.get(id);
    const b = await tx('img', 'readonly', s => s.get(id)); if (!b) return null;
    const u = URL.createObjectURL(b); urls.set(id, u); return u;
  }
  const info = id => man && man.imgs.find(i => i.id === id);
  const forItem = key => (man && man.items && man.items[key]) || [];
  return {load, importFile, clear, url, info, forItem, get man() { return man; }};
})();
