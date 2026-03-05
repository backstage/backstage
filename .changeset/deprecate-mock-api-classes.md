---
'@backstage/frontend-test-utils': patch
---

Deprecated standalone mock API exports in favor of the `mockApis` namespace. This includes the mock classes (`MockAlertApi`, `MockAnalyticsApi`, `MockConfigApi`, `MockErrorApi`, `MockFetchApi`, `MockFeatureFlagsApi`, `MockPermissionApi`, `MockStorageApi`, `MockTranslationApi`), their option types (`MockErrorApiOptions`, `MockFeatureFlagsApiOptions`), and the `ErrorWithContext` type. `MockFetchApiOptions` is kept as a non-deprecated export. Use the `mockApis` namespace instead, for example `mockApis.alert()` or `mockApis.alert.mock()`.
