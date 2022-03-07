---
'@backstage/backend-test-utils': patch
---

Add `setupRequestMockHandlers` which sets up a good `msw` server foundation, copied from `@backstage/test-utils` which is a frontend-only package and should not be used from backends.
