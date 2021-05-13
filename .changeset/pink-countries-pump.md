---
'@backstage/plugin-catalog': minor
'@backstage/plugin-catalog-react': minor
---

Reworks how catalog entities are fetched from the `catalog-backend` for the main
catalog homepage. This enables easier customization of the catalog, and supports
showing all types of catalog entities rather than just components.

This change only affects those that have replaced the default `CatalogPage` with
a custom implementation.

The `useFilteredEntities` and `useEntityFilterGroups` hooks have been replaced
with a `useEntityListProvider` hook and wrapping `EntityListProvider` context.
This handles querying the `catalog-backend` and applying filters that can either
provide query parameters or a frontend filtering function.
