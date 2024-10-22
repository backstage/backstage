---
'@backstage/plugin-catalog-node': minor
---

The `catalogServiceRef` now has its own accompanying `CatalogService` interface that requires Backstage `credentials` objects to be passed. This new version of the `catalogServiceRef` has been promoted and is now available via the main `@backstage/plugin-catalog-node` entry point.

The old `catalogServiceRef` with the old `CatalogApi` type is still available from the `/alpha` entry point.
