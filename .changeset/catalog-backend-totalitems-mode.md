---
'@backstage/plugin-catalog-backend': minor
---

`/entities/by-query` now accepts a `totalItems` parameter (`'include'` or `'exclude'`, default `'include'`) that controls whether the response's `totalItems` count is computed. Pass `'exclude'` to skip the count entirely when the caller doesn't need it — useful for cursor-paginated user interfaces that only display the count cosmetically. The accepted values list is forward-compatible: future modes (e.g. approximate counts) can be added without breaking existing callers.

The internal `QueryEntitiesInitialRequest.skipTotalItems` option has been replaced by `totalItems: 'include' | 'exclude'`. Note that `skipTotalItems` was never exposed as a REST API parameter, so this is only a TypeScript-level change affecting direct callers of `EntitiesCatalog.queryEntities`.

Sort field keys are now lowercased before comparing against `search.key`, fixing silent mismatches for camelCase field names. The `NULLS LAST` ordering clause has been removed since NULL sort values are already excluded by the `WHERE` clause.
