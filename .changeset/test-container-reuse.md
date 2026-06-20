---
'@backstage/backend-test-utils': patch
---

Enabled container reuse so that parallel Jest workers share a single database container instead of each starting their own, reducing memory pressure during local test runs.
