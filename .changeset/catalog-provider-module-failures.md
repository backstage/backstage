---
'@backstage/plugin-catalog-backend': minor
---

Failure to connect catalog providers are now attributed to the module that provided the failing provider. This means that such failures will be reported as module startup failures rather than a failure to start the catalog plugin, and will therefore respect `onPluginModuleBootFailure` configuration instead.
