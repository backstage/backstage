---
'@backstage/frontend-test-utils': minor
---

**BREAKING** Updated `renderInTestApp` and `renderTestApp` to provide default API implementations that are more suitable for testing. This may break existing tests that rely on the previous defaults:

- **Toasts** are collected in memory instead of being displayed. Tests that assert on visible notifications need to provide an API implementation that forwards toasts to the UI, or assert on an explicitly supplied toast fake instead.
- **Storage** is isolated in memory for each test app instead of using browser `localStorage`. Tests that seed or inspect `localStorage`, or rely on storage persisting between test apps, need to supply an explicit storage implementation.
- **Errors** are collected without forwarding them to alerts or installing global error handlers. Error subscriptions no longer receive events from the default implementation. Tests that rely on these behaviors need an explicit error API implementation; tests can also supply a collecting error fake to assert on reported errors.
- **Alerts** are collected and delivered to current subscribers, but earlier alerts are no longer replayed to new subscribers. Tests that rely on replay need an explicit alert API implementation.
- **OAuth requests** use an in-memory coordinator with the same request coordination behavior as before.

Explicit API overrides continue to take precedence over the defaults.

Added `mockApis` helpers for all APIs in `coreApis`, including app state, dialogs, icons, OAuth requests, plugin wrappers and header actions, route resolution, swappable components, and toast notifications. Each `.mock()` helper provides typed Jest stubs without default behavior that can be registered directly with frontend test utilities.

Added functional in-memory fakes for language, lifecycle, themes, icons, OAuth requests, plugin header actions, and toast notifications. Except for lifecycle, these can be supplied explicitly through the test app's `apis` option to configure behavior and inspect state. Use `TestApiProvider` for the lifecycle fake, since test apps manage their own lifecycle.

Fixed storage fake isolation for nested buckets with the same name under different parents.
