self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    clients.claim();
});

// Estrategia: NETWORK FIRST (todo online)
self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.destination === "image") {
        event.respondWith(
            fetch(request, { cache: "no-store" }).catch(() => {
                return new Response("Offline", {
                    status: 503,
                    statusText: "Offline"
                });
            })
        );
        return;
    }

    event.respondWith(
        fetch(request).catch(() => {
            return new Response("Offline", {
                status: 503,
                statusText: "Offline"
            });
        })
    );
});