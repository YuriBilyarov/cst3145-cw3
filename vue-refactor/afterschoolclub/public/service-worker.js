// cache storage name
let cacheName = 'schoolcache';

// fetch listener to cache any missing files and use them when available
self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(function (r) {
        console.log('[Service Worker] Download the file if it is not in the cache');
        return r || fetch(e.request).then(function (response) {
            console.log('[Service Worker] Add the new file to cache');
            return caches.open(cacheName).then(function (cache) {
                cache.put(e.request, response.clone());
                return response;
            });
        });
    })
    );
});