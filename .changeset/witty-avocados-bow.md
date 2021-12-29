---
'@backstage/plugin-app-backend': patch
---

Added a new asset cache that stores static assets from previous deployments in the database. This fixes an issue where users have old browser tabs open and try to lazy-load static assets that no longer exist in the latest version.

The asset cache is enabled by passing the `database` option to `createRouter`.
