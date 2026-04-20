const CACHE_NAME = 'prompts-ia-v1.9';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './ui.js',
  './api.js',
  './state.js',
  './brain.svg',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Ignora requisições POST ou APIs
  if (event.request.method !== 'GET' || event.request.url.includes('openrouter.ai')) return;
  
  // Estratégia Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(err => {
        console.warn('[SW] Offline/Network error:', err);
      });
      
      // Retorna o cache IMEDIATAMENTE (se existir), enquanto baixa o novo por baixo dos panos na fetchPromise
      return cachedResponse || fetchPromise;
    })
  );
});
