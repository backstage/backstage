---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': patch
---

Deprecated the `namespace` option for `createExtensionBlueprint` and `createExtension`, these are no longer required and will default to the `pluginId` instead
