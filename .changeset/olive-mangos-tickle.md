---
'@backstage/backend-app-api': patch
---

Export a new `VoidLogger` implementation and stop using `getVoidLogger` in tests to reduce the dependecy on the soon-to-deprecate `backstage-common` package.
