---
'@backstage/backend-app-api': minor
---

Introduced backend startup result tracking and error handling. The `Backend.start()` method now returns a `BackendStartupResult` with detailed success/failure status and timing information for all plugins and modules. When startup fails, a `BackendStartupError` is thrown that includes the complete startup results, making it easier to diagnose which plugins or modules failed.

This also improves the default error message when backend startup fails, and of course makes it possible to craft your own custom error reporting based on the startup results.
