---
'@backstage/plugin-app-backend': patch
---

The app backend now finds the app package it serves when that package is only installed in the backend package's `node_modules`, which is how pnpm installs workspace packages. An app package that was found before is found the same way.
