---
'@backstage/plugin-catalog-node': patch
---

Updated `catalogServiceMock.mock` to use `createServiceMock` from `@backstage/backend-test-utils`, replacing the internal copy of `simpleMock`. Added `@backstage/backend-test-utils` as an optional peer dependency.
