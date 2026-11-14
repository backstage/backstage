---
'@backstage/frontend-plugin-api': minor
---

Added router-independent navigation and routing APIs: `RouterLink`, `AppHistoryApi` with `useAppNavigate`, `useAppHref`, `useAppLocation`, `useAppSearchParams`, `useRouteContext` for the current extension's matched routing ancestry, and `RouteResolutionApi.resolvePath` for explicit pathname matching. **BREAKING**: `useRouteRefParams` returns only parameters declared by the supplied route ref, with `undefined` for unmatched parameters, and no longer includes the splat `*`. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps.
