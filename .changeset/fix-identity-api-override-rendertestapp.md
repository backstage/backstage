---
'@backstage/core-app-api': patch
'@backstage/frontend-test-utils': patch
---

Identity mocks passed to `renderInTestApp` (for example via `mockApis.identity(...)`) are now applied before the app's built-in guest fallback, so the configured `userEntityRef` reliably takes effect in tests instead of being silently overwritten by the default guest user.
