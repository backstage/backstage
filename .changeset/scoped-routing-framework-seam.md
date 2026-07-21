---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Extends the scoped routing contract and navigation controller with required stack helpers (`go`, `canGoBack`, `canGoForward`, `historyLength`), namespaced adapter state, and a shared pre-navigation blocker API (blockers run for push/replace only — never for go or browser back/forward).

Introduces the framework seam for scoped plugin routing (RFC #33603): navigation controller API, optional page `router` input (empty input resolves the app default via `pageRouterApiRef`), library-agnostic route descriptors, `AppRouteSwitch` / `RouteTable` for top-level page matching, and `RouteLink` / `useNavigateRouteRef` for cross-plugin navigation.

Plugin navigation uses `useAppNavigate` (framework controller when present, React Router otherwise) and `useOptionalFrameworkNavigate` for soft-fail shared components. Location and navigate option types are `FrameworkLocation` and `FrameworkNavigateOptions`. App chrome that requires the new frontend system should use `useFrameworkLocation` or `navigationControllerApiRef` directly — there is no React Router fallback for location.

Page routers can declare capabilities; contracts stay stable across concrete base path changes under the same page pattern; subpages receive their own scoped contract and resolve an empty router input the same way pages do.

Adapter compiler helpers (path segment utilities, lazy descriptor element, nested contract provider) are package-internal; first-party adapters reach them via monorepo imports.
