/* RB DBMS PWA service worker
 * Cache the app shell and all local brand assets for offline launch.
 * Firebase/auth/database requests and personal records are never cached.
 */
"use strict";
const CACHE_NAME = "rb-dbms-pwa-shell-v2";
const APP_SHELL_URL = "./";
const ASSETS = [
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
    await Promise.all([APP_SHELL_URL, ...ASSETS].map(async url => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (response && response.ok) await cache.put(url, response);
      } catch (_) { /* Keep installation resilient to secondary asset failures. */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("rb-dbms-pwa-shell-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
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
        return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline · RB DBMS</title><body style="font:16px system-ui;padding:2rem;line-height:1.5"><h1>You’re offline</h1><p>Connect to the internet to open the DBMS directory and sync records.</p></body></html>', {headers:{"Content-Type":"text/html; charset=utf-8"},status:503});
      }
    })());
    return;
  }
  if (ASSETS.some(asset => new URL(asset,self.location.href).pathname === url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && response.ok) (await caches.open(CACHE_NAME)).put(request,response.clone());
        return response;
      } catch (_) { return new Response("",{status:504,statusText:"Offline"}); }
    })());
  }
});
