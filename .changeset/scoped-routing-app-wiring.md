---
'@backstage/frontend-app-api': patch
---

The new frontend system now owns app history independently of page routing libraries. Page matching, route references, and navigation analytics use the same location and route hierarchy, including nested extensions, encoded paths, and browser Back and Forward navigation.

Default history is created only when requested. Disposing it preserves other listeners that share the underlying history.

Custom `appHistoryApiRef` factories must be available during initialization. Factories gated by an `if` predicate are rejected; remove predicates from the factory extension and its attachment path. See the [app migration guide](https://backstage.io/docs/frontend-system/building-apps/migrating#components).
