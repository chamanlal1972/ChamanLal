/* RB DBMS PWA service worker.
 * Caches the static app shell, logo, manifest, and local icons only.
 * Firebase authentication, Firestore/database records, and other API requests
 * are not intercepted or stored by this worker.
 */
"use strict";

const CACHE_NAME = "rb-dbms-pwa-shell-v3";
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
  // Do not intercept cross-origin traffic, including Firebase SDK/API endpoints.
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        return await fetch(request);
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

  // Only explicitly listed static paths are cache-first; no generic API caching.
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
