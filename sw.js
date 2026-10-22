/* RB DBMS PWA service worker
 * Strategy:
 * - Navigation: network-first, cached app-shell fallback only when offline.
 * - App icons & logo: cache-first (guaranteed offline availability).
 * - Other requests (including Firebase/auth/database traffic): browser default network behavior.
 * No authenticated API responses or personal visit records are cached by this worker.
 */
"use strict";

const CACHE_NAME = "rb-dbms-pwa-shell-v14";
const APP_SHELL_URL = "./";
const PRECACHE_URLS = [
  "./",
  "./logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Pre-cache all shell assets including the logo so the brand is always
    // available even when the device is completely offline.
    await Promise.all(
      PRECACHE_URLS.map(async url => {
        try {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) await cache.put(url, response);
        } catch (_) {
          // Non-fatal: the app remains usable when a single asset is temporarily unavailable.
        }
      })
    );
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key =>
      key.startsWith("rb-dbms-pwa-shell-") && key !== CACHE_NAME
    ).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first, fall back to cached app-shell.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(APP_SHELL_URL, fresh.clone());
        }
        return fresh;
      } catch (_) {
        const cached = await caches.match(APP_SHELL_URL);
        if (cached) return cached;
        // Minimal fallback only if the app-shell was never cached.
        return new Response(
          '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline \xb7 RB DBMS</title><body style="font:16px system-ui;padding:2rem;line-height:1.5"><h1>You\'re offline</h1><p>Connect to the internet to open the DBMS directory and sync records.</p></body></html>',
          { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 503 }
        );
      }
    })());
    return;
  }

  // Static assets (logo + icons): cache-first so they are always available offline.
  if (/\/(logo\.png|icons\/(icon-192|icon-512|icon-maskable-192|icon-maskable-512|apple-touch-icon)\.png)$/.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch (_) {
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })());
  }
});
