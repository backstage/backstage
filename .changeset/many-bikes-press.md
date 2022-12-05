---
'@backstage/backend-plugin-api': minor
---

**BREAKING**: All core service references are now exported via a single `coreServices` object. For example, the `loggerServiceRef` is now accessed via `coreServices.logger` instead.
