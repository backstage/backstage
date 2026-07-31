---
'@backstage/frontend-test-utils': patch
---

Added test helpers for the app history introduced with scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)).

`createMockAppHistory` and `mockApis.appHistory()` provide an `AppHistoryApi` backed by in-memory history that records the navigation it receives, and `createMockRouteResolutionApi` and `mockApis.routeResolution()` provide a route resolution mock with a fixed set of route ref paths. Pair the two to test `RouteLink` and `useNavigateRouteRef` without rendering a full app.

`renderInTestApp` and `renderTestApp` now drive navigation through an in-memory app history and return it as `appHistory` on the render result, next to the usual React Testing Library result. Use it to navigate and to assert on the resulting location. The `initialRouteEntries` option sets the starting entries as before.
