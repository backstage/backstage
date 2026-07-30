---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Simplifies the scoped plugin routing framework seam (RFC #33603) introduced in a previous release.

The `navigationControllerApiRef` / `NavigationControllerApi` are replaced by a much thinner `appHistoryApiRef` / `AppHistoryApi`, exposing only `navigate`, `location$`, and `createHref`. `RoutingContract`, `createRouteDescriptor` / `RouteDescriptor`, and `NavigationControllerApi.createContract` are removed — plugin code should use `useAppNavigate` (or the new `useHref` hook, the `useHref`-plus-`navigate` counterpart for resolving links) instead of a page-scoped contract. `RouteLink` and `useNavigateRouteRef` are unaffected.

`AppRouteSwitch` no longer mints per-page routing contracts; it takes an `AppHistoryApi` (`history` prop, renamed from `controller`) and provides matched pages with a lightweight page-mount context instead.

`PageRouterApi.getDefaultRouter()` components now receive `basePath`, `routePattern`, and `appBasename` directly instead of a `RoutingContract`, and no longer receive compiled route descriptors. `PageBlueprint` and `SubPageBlueprint` compose sub-pages into a native React Router `<Routes>` tree instead of compiling library-agnostic route descriptors, so sub-page content works as opaque React Router children under any compatible page router adapter.

Programmatic back/forward (`go`, `canGoBack`, `canGoForward`, `historyLength`), namespaced per-adapter history state, and the shared pre-navigation blocker API are no longer part of the public framework navigation surface.
