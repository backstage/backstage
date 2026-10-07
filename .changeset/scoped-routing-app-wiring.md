---
'@backstage/frontend-app-api': patch
---

The new frontend system now owns app history independently of page routing libraries. Page matching, route references, and navigation analytics use the same location and route hierarchy, including nested extensions, encoded paths, and browser Back and Forward navigation.

Href creation and navigation require app-absolute paths starting with `/`, excluding the deployment basename. Query-only and hash-only targets use the current pathname. Relative paths must be resolved by a page routing adapter. Both methods replace executable URL schemes with `about:blank` and a warning. External URLs use browser navigation, honoring the `replace` option.

Default history is created only when requested. Disposing it preserves other listeners that share the underlying history.

Custom `appHistoryApiRef` factories must be available during initialization. Factories gated by an `if` predicate are rejected; remove predicates from the factory extension and its attachment path. See the [app migration guide](https://backstage.io/docs/frontend-system/building-apps/migrating#components).
