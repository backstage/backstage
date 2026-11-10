---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/plugin-app': patch
---

Added experimental support for deferred plugins. When `app.experimental.deferredPackages` is enabled, plugins that only provide pages start out as stand-in pages built from their build-time manifest, and the real plugin code is loaded the first time one of its pages is visited. The navigation sidebar now also updates when a deferred plugin is loaded.
