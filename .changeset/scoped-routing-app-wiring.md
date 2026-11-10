---
'@backstage/frontend-app-api': patch
---

The new frontend system now owns app history independently of page routing libraries. Page matching, route references, and navigation analytics use the same location and route hierarchy, including nested extensions, encoded paths, and browser Back and Forward navigation.

Href creation and navigation require app-absolute paths starting with `/`, excluding the deployment basename. Empty, query-only, and hash-only targets use the current pathname. Relative paths must be resolved by a page routing adapter. Both methods replace executable URL schemes with `about:blank` and a warning. External URLs use browser navigation, honoring the `replace` option.

Runaway synchronous navigation cycles triggered by history subscribers now fail with a diagnostic error.

Default history is created only when requested. Disposing it preserves other listeners that share the underlying history.

Custom `appHistoryApiRef` factories must be available during initialization. Factories gated by an `if` predicate are rejected; remove predicates from the factory extension and its attachment path. See the [app migration guide](https://backstage.io/docs/frontend-system/building-apps/migrating#components).

History entries reached outside app-owned navigation omit index, length, and back availability when these cannot be known, rather than reporting guessed positions.

Configured redirects and pages are ranked together by specificity, with redirects winning equal-pattern ties. Redirect templates support embedded route parameters and repeated splats in paths, queries, and fragments. Authored trailing slashes are preserved, and explicitly empty query or fragment components clear incoming values.

Deployment basename matching is case-insensitive. Persisted React Router history entries retain their user state when reloading or navigating Back after upgrading. React Router location keys refresh on replacement independently of stable framework history entry keys.

Implicit React Router v6 compatibility now covers the complete React element output of every route-bearing extension, including empty-path mounts and headers from older published blueprints. Extensions without a route path inherit their enclosing routing scope.

Development compatibility warnings are emitted when an extension uses native React Router APIs or implicit relative navigation. BUI links with app-absolute paths, external URLs, or empty/query/hash targets use framework navigation without a compatibility warning. Empty targets keep the current pathname and clear its query and fragment.
