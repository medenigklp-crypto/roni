const CACHE_NAME = 'roni-cache-v1.1'; // Versiyonu güncelledik ki tarayıcı logoyu yenilesin

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png?v=1.1' // Logonun yeni versiyonu
];

// Kurulum: Dosyaları hafızaya al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Aktivasyon: Eski logoyu ve önbelleği temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// İstekleri Yakalama: Çevrimdışı destek sağla
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
