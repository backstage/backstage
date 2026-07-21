---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Extends the scoped routing contract and navigation controller with required stack helpers (`go`, `canGoBack`, `canGoForward`, `historyLength`), namespaced adapter state, and a shared pre-navigation blocker API (blockers run for push/replace only — never for go or browser back/forward).

Introduces the framework seam for scoped plugin routing (RFC #33603): navigation controller API, optional page `router` input (empty input resolves the app default via `pageRouterApiRef`), library-agnostic route descriptors, `AppRouteSwitch` / `RouteTable` for top-level page matching, and `RouteLink` / `useNavigateRouteRef` for cross-plugin navigation.

Adds `useAppNavigate` / `useOptionalFrameworkNavigate` so shared plugin code can use framework navigation when a navigation controller is present and fall back to React Router when it is not. App chrome can read location with `useFrameworkLocation` or call the navigation controller API directly. Location/options types are named `FrameworkLocation` and `FrameworkNavigateOptions`. Page routers can declare capabilities; contracts stay stable across concrete base path changes under the same page pattern; subpages receive their own scoped contract and resolve an empty router input the same way pages do.

Adapter compiler helpers (path segment utilities, lazy descriptor element, nested contract provider) are package-internal; first-party adapters reach them via monorepo imports.
