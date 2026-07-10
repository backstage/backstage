---
'@backstage/frontend-test-utils': patch
---

Adds mock helpers for scoped plugin routing tests: mock routing contracts (including stack helpers, namespaced adapter state, and pre-navigation blockers), `createMockRouteResolutionApi` / `createMockNavigationController`, and `mockApis.routeResolution()` / `mockApis.navigationController()`.

Test apps drive navigation through the framework navigation controller with in-memory history instead of a root MemoryRouter. `renderInTestApp` / `renderTestApp` still accept `initialRouteEntries` and return a `navigationController` for assertions; React Router context is projected through the v6 adapter backed by that controller, matching production page routing.
