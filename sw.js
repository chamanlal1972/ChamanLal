/* RB DBMS PWA service worker.
 * Caches only the static app shell and explicitly listed local assets.
 * Firebase authentication, Firestore/database records, and all other API
 * requests are never intercepted or stored by this worker.
 */
"use strict";

const CACHE_NAME = "rb-dbms-pwa-shell-v4";
const APP_SHELL = "./index.html";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./logo.png",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Install all required static files together, so missing assets are visible
    // as an installation failure instead of silently producing a partial cache.
    await cache.addAll(STATIC_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("rb-dbms-pwa-shell-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never handle cross-origin requests (including Firebase SDK/API endpoints).
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          // Cache only same-origin navigations within this app's scope.
          if (url.pathname.startsWith(new URL("./", self.registration.scope).pathname)) {
            await cache.put(APP_SHELL, response.clone());
          }
        }
        return response;
      } catch (_) {
        const cached = await caches.match(APP_SHELL);
        if (cached) return cached;
        return new Response(
          '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline · RB DBMS</title><body style="font:16px system-ui;padding:2rem;line-height:1.5"><h1>You’re offline</h1><p>Connect to the internet to open the DBMS directory and sync records.</p></body></html>',
          { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
    })());
    return;
  }

  // Cache-first only for explicitly approved static assets. No generic
  // same-origin caching: Firebase/auth/database and personal records bypass us.
  const staticPaths = new Set(STATIC_ASSETS.map(path =>
    new URL(path, self.registration.scope).pathname
  ));
  if (!staticPaths.has(url.pathname)) return;

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return new Response("", { status: 504, statusText: "Offline" });
    }
  })());
});
