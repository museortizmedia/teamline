self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    clients.claim();
});

// Estrategia: NETWORK FIRST (todo online)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            // fallback básico si falla red
            return new Response("Offline", {
                status: 503,
                statusText: "Offline"
            });
        })
    );
});