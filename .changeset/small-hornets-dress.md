---
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-common': patch
---

**DEPRECATION**: Moved the `CatalogEntityDocument` to `@backstage/plugin-catalog-common` and deprecated the export from `@backstage/plugin-catalog-backend`.

A new `type` field has also been added to `CatalogEntityDocument` as a replacement for `componentType`, which is now deprecated. Both fields are still present and should be set to the same value in order to avoid issues with indexing.

Any search customizations need to be updated to use this new `type` field instead, including any custom frontend filters, custom frontend result components, custom search decorators, or non-default Catalog collator implementations.
