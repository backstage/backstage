---
'@backstage/plugin-catalog-react': minor
---

Added `getCatalogQuery` to `EntityFilter`, which lets filters express their backend constraints as a filter predicate. This supports logical operators such as `$any` and `$not`, as well as matchers like `$hasPrefix`, that cannot be expressed with `getCatalogFilters`. All builtin filters now implement it, and `getCatalogFilters` is deprecated. If a filter implements both, only `getCatalogQuery` is used.

The `EntityListProvider` and related components combine the predicates of all active filters into a `query`, and send it to the catalog backend alongside a `filter` built from any remaining legacy filters. When not paginating, entities are now fetched using `streamEntities` instead of `getEntities`, since the latter does not support predicate queries. Tests that mock `getEntities` to provide entities to an `EntityListProvider` need to mock `streamEntities` instead.

This requires a catalog backend from Backstage release 1.49 or later, which added support for predicate queries.

Since entities are now fetched using `queryEntities` also when not paginating, an `EntityOrderFilter` that orders by a field that some entities lack now excludes those entities from the result, consistent with paginated mode. Previously they were placed last.

Some builtin filters became more precise as part of this change:

- `EntityTagFilter` with multiple tags now requires all of them on the backend, matching its frontend behavior.
- `EntityUserFilter.starred` matches the full starred entity refs rather than just their names, and the starred count is computed by the backend.
