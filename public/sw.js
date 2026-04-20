const CACHE_NAME = 'prompts-ia-v1.7';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './ui.js',
  './api.js',
  './brain.svg',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  // Ignora requisições POST ou APIs para só cachear recursos estáticos da UI
  if (event.request.method !== 'GET' || event.request.url.includes('openrouter.ai')) return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      // Usa a rede se disponível (Network-first p/ facilitar atualização em dev), senao cai pro cache
      return fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => response);
    })
  );
});
