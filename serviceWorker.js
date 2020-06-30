const cacheName = 'v1';

self.addEventListener('install', (event) => {
  console.log('👷 Installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) return caches.delete(cache);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const appClone = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, appClone);
        });
        return response;
      })
      .catch((error) =>
        caches.match(event.request).then((response) => response)
      )
  );
});
