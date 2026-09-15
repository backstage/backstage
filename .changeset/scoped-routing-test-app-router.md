---
'@backstage/frontend-test-utils': minor
---

Added `router` and `renderAs: 'chrome'` options to `renderInTestApp` for testing page adapters and app-wide components. `renderInTestApp` and `renderTestApp` now return `appHistory` for navigation and location assertions.

Added `createMockAppHistory`, `createMockRouteResolutionApi`, `mockApis.appHistory()`, and `mockApis.routeResolution()` for tests that need memory history or fixed route-reference paths.

Root mounts (`mountPath: '/'` or `'/*'`) now render at descendant locations. Isolated extension tests select attached sub-pages using app route matching and preserve query strings and fragments during parent index redirects.

See the [routing test guide](https://backstage.io/docs/frontend-system/building-plugins/testing#navigation-and-app-history) for examples.
