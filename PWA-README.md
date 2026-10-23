# RB DBMS — PWA deployment

Package target: https://chamanlal1972.github.io/ChamanLal/

## Upload
Upload/replace the files and the `icons/` folder at the repository's `ChamanLal/` site root, at the same level as `index.html`. Keep the four supplied PNG files inside `icons/` with their exact filenames.

Included:
- `index.html` — existing application preserved; only favicon and Apple touch-icon paths point to `./icons/`.
- `manifest.webmanifest` — all icon URLs point to `./icons/`.
- `sw.js` — caches the app shell, logo, manifest, and four static icons; Firebase authentication and database requests are not cached.
- `logo.png` — original logo, unchanged.
- `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png`, `icons/apple-touch-icon.png` — exact icon files supplied by the user.

## Offline behavior
The app shell and listed static assets are available after the service worker installs successfully while online. Firebase sign-in, live database syncing, and cloud records still require a network connection; their requests and responses are not cached by this service worker.

## Deploy and verify
1. Upload all root files and the complete `icons/` folder, preserving the folder structure, then commit to the branch used by GitHub Pages.
2. Open `https://chamanlal1972.github.io/ChamanLal/` online and reload once.
3. Confirm `https://chamanlal1972.github.io/ChamanLal/manifest.webmanifest` and `/sw.js` load.
4. In browser developer tools, verify the active service worker and `rb-dbms-pwa-shell-v3` cache.
5. Test sign-in, directory/listing, visit logging, account actions, and syncing while online; then test that the app shell opens offline. Cloud data is not available offline.

Local consistency and syntax checks are performed on this package, but it has not been deployed to or tested against the live GitHub Pages site.
