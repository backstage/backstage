---
'@backstage/cli': patch
---

Fixed the `new-frontend-plugin` template that was incorrectly passing `id` instead of `pluginId` to `createFrontendPlugin` and unnecessarily importing `React`.
