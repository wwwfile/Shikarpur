const CACHE_NAME = 'shikarpur-sweets-v2';
const urlsToCache = [
  'index.html',
  'logi.png',
  'manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network First: Pehle naya code internet se layega, offline hone par cache dikhayega
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
