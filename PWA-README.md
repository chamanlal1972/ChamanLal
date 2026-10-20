# RB DBMS — PWA deployment

This package adds an installable Progressive Web App layer to the existing DBMS page.

## Files
- `index.html` — original page with only a manifest link and service-worker registration added.
- `manifest.webmanifest` — app name, standalone display mode, launch scope, and icon definitions.
- `sw.js` — network-first navigation shell and icon caching. It does **not** cache Firebase requests or authenticated records.
- `icons/` — launcher, maskable, and Apple touch icons made from the supplied logo.

## Deploy to GitHub Pages
1. Keep the repository/project path as `ChamanLal` if the published URL remains `https://chamanlal1972.github.io/ChamanLal/`.
2. Upload/replace `index.html` and add `manifest.webmanifest`, `sw.js`, and the complete `icons/` folder at the same directory level as `index.html`.
3. Keep the existing `logo.png` beside `index.html`, as the current page references `./logo.png`.
4. Commit and wait for GitHub Pages to publish.
5. Open `https://chamanlal1972.github.io/ChamanLal/` in Chrome on Android, refresh, and check Chrome's menu for **Install app** or **Add to Home screen**.

## Important behavior notes
- The current page's UI and application logic have not been rewritten.
- Firebase authentication/database requests are deliberately not cached by the service worker.
- Offline mode can display the cached app shell, but cloud sign-in, live syncing, and cloud records still require a connection.
- The worker caches the shell under version `rb-dbms-pwa-shell-v1`. If you later need to change the worker's caching strategy, bump that version.
- The site must be served over HTTPS (GitHub Pages does this automatically for the `github.io` domain).
- PWA installation UI can vary by Chrome version/device and may take a refresh or a short wait after deployment.

## Verification checklist
- Open `/ChamanLal/manifest.webmanifest` and confirm valid JSON is displayed.
- Open `/ChamanLal/sw.js` and confirm the JavaScript loads.
- In Chrome, verify that the site is secure and that app installation is offered.
- Test sign-in, city/doctor listing, visit logging, account actions, and syncing after installation.
