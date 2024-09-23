---
'@backstage/backend-dynamic-feature-service': patch
---

Enhance the API of the `DynamicPluginProvider` (available as a service) to:

- expose the new `getScannedPackage()` method that returns the `ScannedPluginPackage` from which a given plugin has been loaded,
- add an optional `includeFailed` argument in the plugins list retrieval methods, to include the plugins that could be successfully loaded (`false` by default).
