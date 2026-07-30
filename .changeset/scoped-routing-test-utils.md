---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: Simplifies the mock helpers for scoped plugin routing tests (RFC #33603) to match the thinner `AppHistoryApi`.

`createMockNavigationController` and `mockApis.navigationController()` are replaced by `createMockAppHistory` and `mockApis.appHistory()`, which mock `navigate`, `location$`, and `createHref` (with an optional `basename`). `createMockContract` and `createMockRouteResolutionApi`'s pairing with a routing contract are removed — pair `createMockRouteResolutionApi` with `createMockAppHistory` for `RouteLink` / `useNavigateRouteRef` tests instead.

Test apps still drive navigation through the framework app history with in-memory history instead of a root `MemoryRouter`. `renderInTestApp` / `renderTestApp` still accept `initialRouteEntries` and return a `navigationController` for assertions (now typed as `AppHistoryApi`).
