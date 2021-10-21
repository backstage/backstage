---
'@backstage/test-utils': patch
'@backstage/test-utils-core': patch
---

Migrates all utility methods from `test-utils-core` into `test-utils` and delete exports from the old package.
This should have no impact since this package is considered internal and have no usages outside core packages.

Notable changes are that the testing tool `msw.setupDefaultHandlers()` have been deprecated in favour of `setupRequestMockHandlers()`.
