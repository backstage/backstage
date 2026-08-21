---
'@backstage/frontend-test-utils': patch
---

Added test helpers for the app history introduced with scoped plugin routing ([RFC #33603](https://github.com/backstage/backstage/issues/33603)).

`createMockAppHistory` and `mockApis.appHistory()` provide an `AppHistoryApi` backed by in-memory history that records the navigation it receives, and `createMockRouteResolutionApi` and `mockApis.routeResolution()` provide a route resolution mock with a fixed set of route ref paths. Pair the two to test `RouteLink` and `useNavigateRouteRef` without rendering a full app.

The mock app history behaves like the real one rather than approximating it. It resolves hrefs against an optional deploy base path, passes targets that are not app-relative through unchanged, and rejects those same targets when asked to navigate to them, so a test cannot pass against navigation that production would refuse. A `basename` is treated the way the browser URL carries it: it is stripped from the starting location, and every location the mock hands out is app-relative. Passing your own `navigate` observes the call rather than replacing the mock's own behavior around it, so options such as `replace` and `state` reach it exactly as the caller wrote them.

`renderInTestApp` and `renderTestApp` now drive navigation through an in-memory app history and return it as `appHistory` on the render result, next to the usual React Testing Library result. Use it to navigate and to assert on the resulting location. The `initialRouteEntries` option sets the starting entries as before.

An element rendered with `mountPath` is now treated as a page mounted at that pattern, and not only as a route that supplies `useParams`. Targets written relative to the page therefore resolve against it, as they do in a real app: a page's own tab hrefs keep the address of the page they belong to instead of collapsing to the app root, and a leading `..` climbs the whole mount, so an element at `/catalog/:namespace/:kind/:name` is one route however many segments its address has.
