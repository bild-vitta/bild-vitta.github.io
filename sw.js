const VERSAO = 'bild-v1';
const ARQUIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
/* Rede primeiro (dados sempre atualizados); sem internet, usa a última versão guardada. */
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok && r.status === 200 && new URL(e.request.url).origin === location.origin) { const c = r.clone(); caches.open(VERSAO).then((ca) => ca.put(e.request, c)); } return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match('./'))));
});
