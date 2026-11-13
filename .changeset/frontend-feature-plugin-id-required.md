---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: The `pluginId` property of plugins passed as a `FrontendFeature` is now required. Plugins built against framework versions that predate `pluginId` must be rebuilt against a current version.
