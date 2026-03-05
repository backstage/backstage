---
'@backstage/frontend-test-utils': patch
---

Deprecated standalone mock API exports in favor of the `mockApis` namespace. This includes the mock classes (`MockAlertApi`, `MockAnalyticsApi`, `MockConfigApi`, `MockErrorApi`, `MockFeatureFlagsApi`, `MockPermissionApi`, `MockStorageApi`, `MockTranslationApi`), their option types (`MockErrorApiOptions`, `MockFeatureFlagsApiOptions`), and the `ErrorWithContext` type. `MockFetchApi`, `MockFetchApiOptions` are kept as non-deprecated exports. Use the `mockApis` namespace instead, for example `mockApis.alert()` or `mockApis.alert.mock()`.
