const CACHE_NAME = 'mkslb-solat-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://arleta.site/interactivelink/1610/LOGO-MKSLB.png',
    'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Pasang (Install) Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Fail di-cache dengan jayanya');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Ambil data (Fetch) 
self.addEventListener('fetch', event => {
    // API waktu solat JAKIM perlu sentiasa guna internet (Network First) 
    // supaya waktu sentiasa tepat
    if (event.request.url.includes('api.waktusolat.app')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(event.request);
            })
        );
        return;
    }

    // Untuk fail lain, guna Cache First (Fallback kepada Internet jika tiada cache)
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});