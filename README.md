# RB DBMS — offline logo and offline screen update

Replace the existing deployed `index.html`, `manifest.webmanifest`, and `sw.js` with these files, and upload `logo.png` plus the complete `icons/` folder beside them.

## What changed
- The logo used inside the app is embedded directly in `index.html` as a data URI, so the visible app logo does not need a network request.
- The PWA service worker caches the local logo, manifest, app shell, and launcher icons. The cache version is bumped to `v2` so existing installs can refresh their cached shell.
- When the device is offline, a large glass-style card appears with a crossed-out Wi-Fi symbol and concise offline instructions. It disappears immediately when the browser reports that connectivity is back.
- When the device reconnects, the app page is shown directly; Firebase updates continue in the background. Firebase data/auth requests are not cached, and the app still needs internet for live cloud data and saving changes.
- Existing directory data and Firebase application logic are otherwise unchanged.

## Deploy
Upload all listed files to the same GitHub Pages project directory, commit, then open the published app online once so the new service worker installs and caches the shell. Refresh once after the worker activates. An already-installed PWA updates its shell after it next opens online and the new service worker activates.
