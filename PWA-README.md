# RB DBMS PWA package

This package preserves the existing application and adds offline app-shell assets plus a lightweight city-tab cache.

## Files to upload to the root of the `ChamanLal` GitHub repository
- `index.html`
- `logo.png`
- `manifest.webmanifest`
- `sw.js`
- `icons/` (complete folder)

Keep `import-firebase.html` and all other existing files in the repository; this package does not replace or remove them.

## Offline behavior
- The service worker caches the app shell, `logo.png`, manifest, and launcher icons.
- The last server-confirmed city list is stored locally per signed-in account so city tabs can appear offline. Only city-tab metadata is cached by this addition; doctor records and visit history are not added to localStorage or service-worker caches.
- When offline, the empty “No cities yet” state and add-city button are suppressed. A small reconnecting notice is shown if there is no cached city list.
- Firebase synchronization and data changes still require an internet connection.

## Deploy safely
1. Download/keep a backup of the current repository first.
2. Upload these files and the complete `icons` folder to the same root level as the current `index.html`.
3. Do not delete `import-firebase.html` or other existing files.
4. Commit the changes, wait for GitHub Pages to publish, then open the site online once to let the new service worker cache its assets.
5. Test the installed PWA by opening it online, then enabling airplane mode. Existing city tabs should remain visible if that account's city list has been cached on the device.

The first-ever launch on a device still needs internet at least once to download the app shell and cache the city list.
