---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: `renderInTestApp` no longer creates a React Router page match from `mountPath`. It provides the same root routing context as the app, and adds `router` and `renderAs` options for testing page adapters and app chrome.

Pages that declare their own adapter can be rendered directly. When testing content that consumes native router APIs without an adapter of its own, pass `router`, for example `renderInTestApp(<Content />, { router: ReactRouterV6PageRouter })`. Without an adapter, React Router sees the root context but no page match: route parameters are empty and relative links resolve from the app root. Framework hooks such as `useHref` and `useRouteRefParams` use the page's mount without an adapter. Use `renderAs: 'chrome'` for content that belongs above page routes.

Added `createMockAppHistory` and `mockApis.appHistory()` for memory-backed app history, plus `createMockRouteResolutionApi` and `mockApis.routeResolution()` for tests with fixed route-ref paths. The history helpers use the same memory history behavior as the app test harness, including deployment prefixes, relative href options, navigation state and replacement.

`renderInTestApp` and `renderTestApp` return `appHistory` alongside the React Testing Library result. Navigate through it and assert on its location; `initialRouteEntries` sets the starting history. A `mountPath` identifies one page route even when its pattern spans several URL segments, so a parent-relative href climbs that route as a whole.
