---
'@backstage/plugin-catalog-backend': minor
---

Add API endpoint for requesting a catalog refresh at `/refresh`, which is activated if a `CatalogProcessingEngine` is passed to `createRouter`.

The `CatalogProcessingEngine` interface has also received a new `refresh` method, meaning this is a breaking change if you have a custom implementation of it. The new method is used to trigger a refresh of an entity in an as localized was as possible, usually by refreshing the parent location.
