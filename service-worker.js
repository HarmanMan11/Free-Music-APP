const CACHE_NAME = 'free-music-app-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  // сюда можно добавить стили, скрипты, шрифты, иконки
];

// Установим кэш при установке воркера
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(STATIC_ASSETS))
    .then(() => self.skipWaiting())
  );
});

// Активируем новый сервис-воркер и очищаем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
    .then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
    ))
    .then(() => self.clients.claim())
  );
});

// Перехват запросов и отдача из кэша
self.addEventListener('fetch', event => {
  // Кэшируем только GET запросы
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
    .then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          // Кэшируем новые ресурсы
          return caches.open(CACHE_NAME).then(cache => {
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
        .catch(() => {
          // fallback если оффлайн и нет в кэше
          if (event.request.destination === 'document') {
            return caches.match('./');
          }
        });
    })
  );
});
