---
'@backstage/test-utils': patch
'@backstage/test-utils-core': patch
---

Migrates all utility methods from `test-utils-core` into `test-utils`.
The entire `@backstage/test-utils-core` is considered deprecated. The package will be removed in a few weeks time.
This should have almost no impact since this package is primarily used internally by core packages.

Notable changes are that the testing tool `msw.setupDefaultHandlers()` have been deprecated in favour of `setupRequestMockHandlers()`.
