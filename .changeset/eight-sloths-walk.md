---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the deprecated `createFrontendPlugin` variant where the plugin ID is passed via an `id` option. To update existing code, switch to using the `pluginId` option instead.
