const CACHE_NAME = 'workout-counter-v1';
const STATIC_CACHE = 'workout-static-v1';
const DYNAMIC_CACHE = 'workout-dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // API requests - network only (don't cache API responses)
    if (url.pathname.startsWith('/api')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(
                    JSON.stringify({ error: 'You are offline' }),
                    {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            })
        );
        return;
    }

    // Static assets - stale while revalidate
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    // Cache the new response
                    if (networkResponse.ok) {
                        const clonedResponse = networkResponse.clone();
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, clonedResponse);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // If network fails, return cached response or offline page
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // For navigation requests, return index.html
                    if (request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return new Response('Offline', { status: 503 });
                });

            // Return cached response immediately, update in background
            return cachedResponse || fetchPromise;
        })
    );
});

// Background sync for workout data (future feature)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-workouts') {
        console.log('[SW] Syncing workouts...');
        // Implement background sync logic here
    }
});

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'Workout Counter';
    const options = {
        body: data.body || 'Time for your workout!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: data.url || '/',
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});
