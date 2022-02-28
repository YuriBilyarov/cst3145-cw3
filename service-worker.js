let cacheName = 'schoolcache';
let cacheFiles = [
    'index.html',
    'books192.png',
    'books512.png',
    'app.webmanifest',
    'service-worker.js',
];

// install listener that caches specified files
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(caches.open(cacheName).then((cache) => {
        console.log('[Service Worker] Caching all the files');
        return cache.addAll(cacheFiles);
    })
    );
});

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