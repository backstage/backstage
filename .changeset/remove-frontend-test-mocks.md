---
'@backstage/frontend-test-utils': minor
---

Removed the deprecated standalone mock API type exports. Use the corresponding `mockApis` helpers to create instances and derive types as follows:

| Removed type                 | Replacement type                                                     |
| ---------------------------- | -------------------------------------------------------------------- |
| `MockAlertApi`               | `ReturnType<typeof mockApis.alert>`                                  |
| `MockAnalyticsApi`           | `ReturnType<typeof mockApis.analytics>`                              |
| `MockConfigApi`              | `ReturnType<typeof mockApis.config>`                                 |
| `MockErrorApi`               | `ReturnType<typeof mockApis.error>`                                  |
| `MockFeatureFlagsApi`        | `ReturnType<typeof mockApis.featureFlags>`                           |
| `MockFetchApi`               | `ReturnType<typeof mockApis.fetch>`                                  |
| `MockPermissionApi`          | `ReturnType<typeof mockApis.permission>`                             |
| `MockStorageApi`             | `ReturnType<typeof mockApis.storage>`                                |
| `MockTranslationApi`         | `ReturnType<typeof mockApis.translation>`                            |
| `MockErrorApiOptions`        | `NonNullable<Parameters<typeof mockApis.error>[0]>`                  |
| `MockFeatureFlagsApiOptions` | `NonNullable<Parameters<typeof mockApis.featureFlags>[0]>`           |
| `ErrorWithContext`           | `ReturnType<ReturnType<typeof mockApis.error>['getErrors']>[number]` |

Import `mockApis` from `@backstage/frontend-test-utils`. For example, use `mockApis.analytics()` to create an analytics mock and `ReturnType<typeof mockApis.analytics>` when you need an explicit instance type. Existing calls to the helpers require no changes. Inspection methods such as `getEvents`, `getErrors`, and `getAlerts`, along with legacy alert support, remain available. `MockFetchApiOptions` remains exported for configuring `mockApis.fetch`.
