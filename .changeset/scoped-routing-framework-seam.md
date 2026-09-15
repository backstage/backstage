---
'@backstage/frontend-plugin-api': minor
---

Added router-independent navigation through `AppHistoryApi`, `appHistoryApiRef`, `useAppNavigate`, `useHref`, `useAppLocation`, and `useAppSearchParams`. `RouteLink` and `useNavigateRouteRef` support route-reference navigation, and `useAppRouting` provides matching href and navigation callbacks for React Aria integration.

Framework routing hooks work without a page adapter and retain old frontend compatibility. Existing pages keep implicit React Router v6 routing, with development warnings to guide migration to explicit adapters. Page headers remain visible during content loading and errors, and sub-page breadcrumbs point to their matched routes.

**BREAKING**: `useRouteRefParams` returns only parameters declared by the supplied route ref, with `undefined` for unmatched parameters. It no longer includes the undeclared splat `*`; use your page router's APIs if you need that value.

See [scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing) for navigation semantics and [page routers](https://backstage.io/docs/frontend-system/building-plugins/page-routers) for integration examples.
