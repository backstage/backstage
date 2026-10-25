---
'@backstage/frontend-test-utils': patch
---

Added `mockApis` helpers for all APIs in `coreApis`, including app state, dialogs, icons, OAuth requests, plugin wrappers and header actions, route resolution, swappable components, and toast notifications. Each helper provides typed Jest mocks that can be registered directly with frontend test utilities.

Added functional in-memory fakes for language, lifecycle, themes, icons, OAuth requests, plugin header actions, and toast notifications. Test apps now use fakes for alerts, errors, OAuth requests, storage, and toasts by default, with explicit API overrides taking precedence. Jest `.mock()` helpers remain plain stubs without default behavior.
