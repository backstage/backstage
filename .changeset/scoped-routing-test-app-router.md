---
'@backstage/frontend-test-utils': minor
---

Added the `renderAs: 'chrome'` option to `renderInTestApp` and mock utilities for navigation tests: `mockApis.appHistory()` and `mockApis.routeResolution()`. Page matching uses framework routing; wrap test elements in their page adapter when they need routing-library context. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [routing test guide](https://backstage.io/docs/frontend-system/building-plugins/testing#navigation-and-app-history) for examples.
