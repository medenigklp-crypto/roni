const CACHE_NAME = 'derspanel-cache-v1';

// Önbelleğe alınacak kritik dosyalar
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png?v=1.1'
];

// 1. Kurulum (Install): Dosyaları tarayıcı hafızasına al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Dosyalar önbelleğe alınıyor...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Yeni versiyonun hemen aktif olmasını sağlar
  );
});

// 2. Aktivasyon (Activate): Eski önbellekleri temizle ve güncel tut
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eski önbellek temizleniyor:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Açık olan sekmeleri hemen kontrolü altına alır
  );
});

// 3. İstekleri Yakalama (Fetch): Çevrimdışı (Offline) desteği sun
self.addEventListener('fetch', (event) => {
  // Sadece GET isteklerini önbelleğe al (Hataları önlemek için)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Eğer dosya önbellekte varsa oradan getir, yoksa internetten çek
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
