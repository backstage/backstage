---
'@backstage/frontend-test-utils': patch
---

Fixed `renderInTestApp` rendering nothing when the element was mounted at the app root with `mountPath: '/'` and the location pointed anywhere below it. The element was rendered only while the location was the root itself, so pairing `mountPath: '/'` with a deeper `initialRouteEntries` failed with an unhelpful "unable to find element". `'/'` and `'/*'` now describe the same mount, and both host the locations below it.
