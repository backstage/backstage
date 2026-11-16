---
'@backstage/frontend-test-utils': patch
---

Added `apis` to the results of `renderInTestApp` and `renderTestApp`, providing access to the app's Utility APIs using API refs. The holder exposes the same instances used by components, including registered APIs and test overrides.
