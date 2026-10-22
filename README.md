# Raptakos, Brett & Co. Ltd. DBMS

A lightweight doctor directory and visit-history PWA, backed by Firebase Authentication and Cloud Firestore.

## Design system

The interface uses a tactile, mineral-inspired glass language: warm paper neutrals, botanical sage, muted pastel atmosphere and restrained champagne-gold accents. Light and dark palettes follow `prefers-color-scheme`, with safe-area-aware spacing and reduced-motion support.

### Design principles
- Preserve the existing directory, visit history, sign-in, backup and offline workflows.
- Use translucent layered surfaces with a low-noise paper-grain background and clear text contrast.
- Keep touch feedback subtle and spring-like, without forcing animation on users who prefer reduced motion.
- Respect iOS safe-area insets and keep the logo asset itself unframed.
- Keep the static site lightweight; the design layer is CSS and does not add a UI framework or animation dependency.

## Project files

- `index.html` — app markup, Firebase integration, existing application logic and design tokens.
- `manifest.webmanifest` — installable PWA metadata, icons and launch colors.
- `sw.js` — app-shell/offline caching and static icon/logo cache.
- `logo.png` — primary brand artwork.
- `icons/` — PWA and Apple touch icon PNGs.

## Publishing

GitHub Pages serves the static app from the repository root. The current redesign branch is intended for review before merging to `main`.
