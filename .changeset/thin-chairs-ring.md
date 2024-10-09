---
'@backstage/test-utils': minor
'@backstage/frontend-test-utils': patch
---

Added a `mockApis` export, which will replace the `MockX` API implementation classes and their related types. This is analogous with the backend's `mockServices`.

**DEPRECATED** several old helpers:

- Deprecated `MockAnalyticsApi`, please use `mockApis.analytics` instead.
- Deprecated `MockConfigApi`, please use `mockApis.config` instead.
- Deprecated `MockPermissionApi`, please use `mockApis.permission` instead.
- Deprecated `MockStorageApi`, please use `mockApis.storage` instead.
- Deprecated `MockTranslationApi`, please use `mockApis.translation` instead.
