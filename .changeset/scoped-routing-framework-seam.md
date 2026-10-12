---
'@backstage/frontend-plugin-api': minor
---

Added `RouterLink`, a routing anchor with no styles for composing custom UI components, including React Aria links, tabs, and menu items through their `render` prop. It accepts app-absolute destinations, query/hash targets, and external URLs and preserves native browser link interactions.

Added router-independent navigation through `AppHistoryApi`, `appHistoryApiRef`, `useAppNavigate`, `useAppHref`, `useAppLocation`, and `useAppSearchParams`. `RouteLink` supports route-reference links, while `useRouteRef` and `useAppNavigate` can be combined for programmatic navigation.

Added `RouteResolutionApi.resolvePath` to resolve an app-relative pathname into a matched route branch, optionally scoped to an app node and its ancestors. Matches include base paths, route patterns, and decoded parameters, and can be resolved independently of the browser location. `AppHistoryApi.navigate` now handles external URLs through browser navigation, honoring `replace`. Both `navigate` and `createHref` sanitize executable URL schemes. The `useRouteResolution` hook provides the current extension’s matched routing ancestry at the current location.

Framework path destinations must start with `/` and exclude the deployment basename. Route-ref paths work unchanged across pages. Empty, query-only, and hash-only targets use the current pathname; path-relative targets are rejected. Use a page adapter for library-relative navigation. `useAppNavigate` reads the latest history location when invoked.

Framework routing hooks work without a page adapter and retain old frontend compatibility. Existing pages keep implicit React Router v6 routing, with development warnings to guide migration to explicit adapters. Page headers remain visible during content loading and errors, and sub-page breadcrumbs point to their matched routes.

**BREAKING**: `useRouteRefParams` returns only parameters declared by the supplied route ref, with `undefined` for unmatched parameters. It no longer includes the undeclared splat `*`; use your page router's APIs if you need that value.

See [scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing) for navigation semantics and [page routers](https://backstage.io/docs/frontend-system/building-plugins/page-routers) for integration examples.

Added `useNavigation` and `NavigationProvider` for component-library-neutral navigation bound to each consumer’s route scope. `RouterLink` now follows this context, including adapter-relative targets. Explicit framework navigation hooks remain app-absolute. Generated hrefs include the deployment basename; navigation accepts the original target.
