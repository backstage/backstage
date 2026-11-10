---
'@backstage/frontend-plugin-api': minor
---

Added `RouterLink`, a routing anchor with no styles for composing custom UI components, including React Aria links, tabs, and menu items through their `render` prop. It accepts app-absolute destinations, query/hash targets, and external URLs and preserves native browser link interactions.

Added router-independent navigation through `AppHistoryApi`, `coreApis.appHistory` (also available as `appHistoryApiRef`), `useAppNavigate`, `useAppHref`, `useAppLocation`, and `useAppSearchParams`. `AppHistoryApi` exposes a synchronous `getSnapshot()` / `subscribe()` store, including optional history action, entry identity, index, and tracked history length for routing adapters. Use `useRouteRef` with BUI links for declarative navigation or with `useAppNavigate` for programmatic navigation.

Added `RouteResolutionApi.resolvePath` to resolve an app-relative pathname into a matched route branch, optionally scoped to an app node and its ancestors. Matches include base paths, route patterns, and decoded parameters, and can be resolved independently of the browser location. `AppHistoryApi.navigate` now handles external URLs through browser navigation, honoring `replace`. Both `navigate` and `createHref` sanitize executable URL schemes. The `useRouteResolution` hook provides the current extension’s matched routing ancestry at the current location.

Framework path destinations must start with `/` and exclude the deployment basename. Route-ref paths work unchanged across pages. Empty, query-only, and hash-only targets use the current pathname; path-relative targets are rejected. Use a page adapter for library-relative navigation. `useAppNavigate` reads the latest history location when invoked.

Framework routing hooks work without a page adapter and retain old frontend compatibility. Existing pages keep implicit React Router v6 routing, including consumer-scoped relative BUI links, with development warnings to guide migration to explicit adapters. The app supplies this compatibility around each route-bearing extension’s complete output, so headers from older published blueprints also retain their page scope. Explicit adapters override this navigation context; framework navigation hooks remain strict. Page headers remain visible during content loading and errors, and sub-page breadcrumbs point to their matched routes.

**BREAKING**: `useRouteRefParams` returns only parameters declared by the supplied route ref, with `undefined` for unmatched parameters. It no longer includes the undeclared splat `*`; use your page router's APIs if you need that value.

See [scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing) for navigation semantics and [page routers](https://backstage.io/docs/frontend-system/building-plugins/page-routers) for integration examples.

Added `useNavigation` and `NavigationProvider` for component-library-neutral navigation bound to each consumer’s route scope. `RouterLink` now follows this context, including adapter-relative targets. Explicit framework navigation hooks remain app-absolute. Generated hrefs include the deployment basename; navigation accepts the original target.

The implicit compatibility peer accepts React Router v6 (`^6.30.2`) or v7 (`^7.18.3`). Apps must supply React Router DOM even when using another page router.

In old frontend apps, `useAppNavigate` and `useAppHref` also accept legacy route-ref URLs that already contain the configured deployment basename, without adding that basename twice.
