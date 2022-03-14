---
'@backstage/plugin-techdocs-node': patch
---

Deprecations cleaned up.

- `DirectoryPreparer` now uses private constructor. Use static fromConfig method to instantiate.
- `UrlPreparer` now uses private constructor. Use static fromConfig method to instantiate.
