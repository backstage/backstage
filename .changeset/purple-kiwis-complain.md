---
'@backstage/plugin-catalog-backend': minor
---

Migrated to support new auth services. The `CatalogBuilder.create` method now accepts a `discovery` option, which is recommended to forward from the plugin environment, as it will otherwise fall back to use the `HostDiscovery` implementation.
