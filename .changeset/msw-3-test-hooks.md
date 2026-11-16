---
'@backstage/test-utils': patch
'@backstage/backend-test-utils': patch
---

`registerMswTestHooks` now also fails tests on unhandled requests when used with msw 3.
