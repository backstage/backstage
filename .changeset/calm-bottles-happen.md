---
'@backstage/backend-common': minor
---

**BREAKING CHANGE**: The `UrlReader` interface has been updated to require that `readUrl` is implemented. `readUrl` has previously been optional to implement but a warning has been logged when calling its predecessor `read`.
The `read` method is now deprecated and will be removed in a future release.
