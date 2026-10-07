---
'@backstage/frontend-test-utils': minor
---

Added `router` and `renderAs: 'chrome'` options to `renderInTestApp` for testing page adapters and app-wide components. `renderInTestApp` and `renderTestApp` now return `appHistory` for navigation and location assertions.

Added `createMockAppHistory`, `createMockRouteResolutionApi`, `mockApis.appHistory()`, and `mockApis.routeResolution()` for tests that need memory history or fixed route-reference paths. Route resolution mocks accept fixed matches through `resolvePath: { matches: [...] }` or a custom `resolvePath` callback, returning no matches by default. Fixed matches require only `node` and `basePath`; `routePattern` defaults to `basePath`, `params` to `{}`, and `contributesPath` to `true`.

App history mocks record external navigation without changing the location or leaving the test page.

Route resolution fakes also resolve authored targets using their configured matches, with a `resolveTarget` override for custom behavior.

Root mounts (`mountPath: '/'` or `'/*'`) now render at descendant locations. Isolated extension tests select attached sub-pages using app route matching and preserve query strings and fragments during parent index redirects.

See the [routing test guide](https://backstage.io/docs/frontend-system/building-plugins/testing#navigation-and-app-history) for examples.
