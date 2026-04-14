---
'@backstage/backend-plugin-api': patch
'@backstage/backend-app-api': patch
'@backstage/backend-test-utils': patch
---

Split `BackendInitializer.ts` into focused internal modules, centralized internal backend feature types into a new `@internal/backend` package using `OpaqueType` helpers, and removed redundant type aliases in favor of deriving types from `OpaqueBackendFeature` at call sites.
