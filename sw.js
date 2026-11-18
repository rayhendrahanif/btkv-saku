/* Service worker: simpan semua berkas agar aplikasi jalan offline.
   Naikkan VERSION setiap kali isi materi diubah supaya HP mengunduh versi baru. */
const VERSION = 'btkv-v2';
const FILES = [
  './',
  'css/app.css',
  'data/abbr-src.js',
  'data/abbr.js',
  'data/d1-dasar.js',
  'data/d2-dewasa.js',
  'data/d3-perio.js',
  'data/d4-kongenital.js',
  'data/d5-toraks.js',
  'data/d6-vaskular.js',
  'data/p1-jantung.js',
  'data/p2-kongenital.js',
  'data/p3-toraks.js',
  'data/p4-vaskular.js',
  'data/semester.js',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'index.html',
  'js/app.js',
  'js/galeri.js',
  'js/viz1.js',
  'js/viz2.js',
  'manifest.webmanifest',
];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
