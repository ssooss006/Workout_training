// Service Worker для кэширования заглушки и превью
const CACHE_NAME = 'workout-videos-cache-v1';
const PLACEHOLDER_URL = '/Workout_training/20240813_200751.jpg';
// Добавьте сюда пути к другим превью, если появятся
const PRECACHE_URLS = [
  PLACEHOLDER_URL,
  // Можно добавить другие локальные превью, если появятся
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  // Кэшируем только локальные изображения превью/заглушки
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(response =>
        response || fetch(event.request).then(fetchRes => {
          // Кэшируем только локальные изображения
          if (event.request.url.startsWith(self.location.origin)) {
            const resClone = fetchRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
          }
          return fetchRes;
        })
      )
    );
  }
});
