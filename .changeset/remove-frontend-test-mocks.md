---
'@backstage/frontend-test-utils': minor
---

Removed the deprecated standalone mock API types, `MockErrorApiOptions`, `MockFeatureFlagsApiOptions`, and `ErrorWithContext`. Use `ReturnType<typeof mockApis.analytics>` and the corresponding helpers for instance types, or `Parameters<typeof mockApis.error>[0]` and `Parameters<typeof mockApis.featureFlags>[0]` for options. Derive collected error types from the return type of `getErrors`. `MockFetchApiOptions` and all `mockApis` helpers, including their inspection methods and legacy alert support, remain available.
