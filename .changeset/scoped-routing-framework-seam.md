---
'@backstage/frontend-plugin-api': minor
---

Added router-independent navigation and routing APIs: `RouterLink`, `AppHistoryApi` (also available as `coreApis.appHistory`), `useAppNavigate`, `useAppHref`, `useAppLocation`, `useAppSearchParams`, and `RouteResolutionApi.resolvePath` for matched routing ancestry. **BREAKING**: `useRouteRefParams` returns only parameters declared by the supplied route ref, with `undefined` for unmatched parameters, and no longer includes the splat `*`. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps.

The stable public `/routing` entry point exposes `RoutingProvider`, `RoutingIntegration`, and `useRoutingIntegration` for router and component-library integrations. It has the same stability and compatibility guarantees as the main entry point; app history APIs, plugin navigation hooks, and route refs remain in the main entry point. `AppNavigate` describes the navigation function returned by `useAppNavigate`.
