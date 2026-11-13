---
'@backstage/frontend-test-utils': minor
---

Added `router` and `renderAs: 'chrome'` options to `renderInTestApp`, an `appHistory` return value on `renderInTestApp` and `renderTestApp`, and mock utilities for navigation tests: `createMockAppHistory`, `createMockRouteResolutionApi`, `mockApis.appHistory()`, and `mockApis.routeResolution()`. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [routing test guide](https://backstage.io/docs/frontend-system/building-plugins/testing#navigation-and-app-history) for examples.
