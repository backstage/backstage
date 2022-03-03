---
'@backstage/plugin-catalog-backend': patch
---

**DEPRECATION**: Deprecated the `RefreshIntervalFunction` and `createRandomRefreshInterval` in favour of the `ProcessingIntervalFunction` and `createRandomProcessingInterval` type and method respectively. Please migrate to use the new names.

**DEPRECATION**: Deprecated the `setRefreshInterval` and `setRefreshIntervalSeconds` methods on the `CatalogBuilder` for the new `setProcessingInterval` and `setProcessingIntervalSeconds` methods. Please migrate to use the new names.
