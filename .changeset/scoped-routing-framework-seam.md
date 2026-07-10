---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Extends the scoped routing contract and navigation controller with required stack helpers (`go`, `canGoBack`, `canGoForward`, `historyLength`), namespaced adapter state, and a shared pre-navigation blocker API (blockers run for push/replace only — never for go or browser back/forward).

Introduces the framework seam for scoped plugin routing (RFC #33603): routing contracts, navigation controller API, optional page `router` input (empty input resolves the app default via `pageRouterApiRef`), library-agnostic route descriptors and path helpers, nested contract providers for page adapters, `RouteLink` / `useNavigateRouteRef` for cross-plugin navigation, and `useFrameworkLocation` / `useFrameworkNavigate` for chrome that should follow the navigation controller.

Adds `useCompatNavigate` / `useOptionalFrameworkNavigate` so shared plugin code can use framework navigation when a navigation controller is present and fall back to React Router when it is not (dual-path for new and old frontend apps). Page routers can declare capabilities; contracts stay stable across concrete basePath changes under the same page pattern; subpages receive their own scoped contract and resolve an empty router input the same way pages do.
