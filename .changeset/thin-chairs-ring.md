---
'@backstage/test-utils': minor
'@backstage/frontend-test-utils': patch
---

Added a `mockApis` export, which will replace the `MockX` API implementation classes and their related types. This is analogous with the backend's `mockServices`.

- Deprecated `MockAnalyticsApi`, please use `mockApis.analytics` instead.
- Deprecated `MockConfigApi`, please use `mockApis.config` instead.
- Deprecated `MockPermissionApi`, please use `mockApis.permission` instead.
