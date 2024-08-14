---
'@backstage/backend-test-utils': minor
---

**BREAKING**: Removed these deprecated helpers:

- `setupRequestMockHandlers` Use `CreateMockDirectoryOptions` instead.
- `CreateMockDirectoryOptions` Use `registerMswTestHooks` instead.

Stopped exporting the deprecated and internal `isDockerDisabledForTests` helper.

Removed `get` method from `ServiceFactoryTester` which is replaced by `getSubject`
