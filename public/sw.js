/* Service Worker de Red Técnico Fulltech
 * Estrategia: cache-first para recursos estáticos, network-first para navegación.
 * No se cachean documentos sensibles de forma permanente.
 */

const CACHE_NAME = "red-fulltech-v2";
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline",
];

// Instalación: precache de recursos estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activación: limpiar cachés antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first para estáticos, network-first para navegación
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo manejar GET
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // No cachear llamadas a Supabase (datos sensibles)
  if (url.hostname.includes("supabase.co")) return;

  // Navegación: siempre red primero, sin guardar HTML de la app.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(() =>
          caches.match("/offline")
        )
    );
    return;
  }

  if (url.pathname.startsWith("/_next/")) {
    return;
  }

  // Recursos estáticos: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
