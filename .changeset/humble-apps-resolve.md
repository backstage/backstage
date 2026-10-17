---
'@backstage/plugin-app-backend': patch
---

The app backend now finds the app package it serves when that package is only installed in the `node_modules` of the backend package, which can happen with pnpm or with Yarn hoisting limits. An app package that was found before is found the same way.
