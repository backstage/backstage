---
'@backstage/plugin-catalog-node': minor
---

The `catalogServiceRef` now have its own accompanying `CatalogService` interface, which also supports passing Backstage `credentials` objects in addition to tokens. In addition, it has been promoted from the `/alpha` export and is now available from the main `@backstage/plugin-catalog-node` entry point.
