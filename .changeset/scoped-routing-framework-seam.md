---
'@backstage/frontend-plugin-api': minor
---

Added router-independent navigation through `AppHistoryApi`, `appHistoryApiRef`, `useAppNavigate`, `useHref`, `useAppLocation`, and `useAppSearchParams`. `RouteLink` supports route-reference links, while `useRouteRef` and `useAppNavigate` can be combined for programmatic navigation.

Added `RouteResolutionApi.resolvePath` to resolve an app-relative pathname into a matched route branch, optionally scoped to an app node and its ancestors. Matches include base paths, route patterns, and decoded parameters, and can be resolved independently of the browser location. `RouteResolutionApi.resolveTarget` resolves authored links against a node’s route ancestry, using app-root scope when no node is supplied. `AppHistoryApi.navigate` now handles external URLs through browser navigation, honoring `replace`. Both `navigate` and `createHref` sanitize executable URL schemes. The `useRouteResolution` hook provides the current extension’s matched routing ancestry at the current location.

Framework routing hooks work without a page adapter and retain old frontend compatibility. Existing pages keep implicit React Router v6 routing, with development warnings to guide migration to explicit adapters. Page headers remain visible during content loading and errors, and sub-page breadcrumbs point to their matched routes.

**BREAKING**: `useRouteRefParams` returns only parameters declared by the supplied route ref, with `undefined` for unmatched parameters. It no longer includes the undeclared splat `*`; use your page router's APIs if you need that value.

See [scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing) for navigation semantics and [page routers](https://backstage.io/docs/frontend-system/building-plugins/page-routers) for integration examples.
