/**
 * SERVICE WORKER
 * PWA offline functionality and caching
 */

const CACHE_NAME = 'bloodbridge-v1.0.0';
const RUNTIME_CACHE = 'bloodbridge-runtime';

// Files to cache on install
const STATIC_ASSETS = [
    '/index-modern.html',
    '/src/css/modern-styles.css',
    '/src/js/app-modern.js',
    '/src/js/state-manager.js',
    '/src/js/utils.js',
    '/src/js/services/notifications.js',
    '/src/js/services/donors.js',
    '/src/js/services/map.js',
    '/src/js/services/chat.js',
    '/src/js/services/video.js',
    '/src/js/services/analytics.js',
    '/manifest.json',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                        .map(name => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // API requests - network first
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Static assets - cache first
    event.respondWith(cacheFirst(request));
});

// Cache first strategy
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
        console.log('[SW] Serving from cache:', request.url);
        return cached;
    }
    
    try {
        const response = await fetch(request);
        
        // Cache successful responses
        if (response.ok) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('[SW] Fetch failed:', error);
        
        // Return offline page if available
        const offlinePage = await cache.match('/offline.html');
        if (offlinePage) {
            return offlinePage;
        }
        
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network first strategy
async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    
    try {
        const response = await fetch(request);
        
        // Cache successful API responses
        if (response.ok) {
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('[SW] Network request failed:', error);
        
        // Fallback to cached version
        const cached = await cache.match(request);
        if (cached) {
            console.log('[SW] Serving stale API data from cache');
            return cached;
        }
        
        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-donations') {
        event.waitUntil(syncDonations());
    }
    
    if (event.tag === 'sync-requests') {
        event.waitUntil(syncRequests());
    }
});

async function syncDonations() {
    console.log('[SW] Syncing offline donations...');
    // Implement offline donation sync
}

async function syncRequests() {
    console.log('[SW] Syncing offline requests...');
    // Implement offline request sync
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'BloodBridge Notification';
    const options = {
        body: data.body || 'You have a new notification',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-96x96.png',
        vibrate: [200, 100, 200],
        data: data.url || '/',
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Dismiss' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        const urlToOpen = event.notification.data || '/';
        
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then(clientList => {
                    // Focus existing window if available
                    for (const client of clientList) {
                        if (client.url === urlToOpen && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // Open new window
                    if (clients.openWindow) {
                        return clients.openWindow(urlToOpen);
                    }
                })
        );
    }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(event.data.urls))
        );
    }
});
