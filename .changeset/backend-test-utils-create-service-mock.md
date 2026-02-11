---
'@backstage/backend-test-utils': minor
---

Added `createServiceMock`, a public utility for creating `ServiceMock` instances for custom service refs. This allows plugin authors to define mock creators for their own services following the same pattern as the built-in `mockServices` mocks.
