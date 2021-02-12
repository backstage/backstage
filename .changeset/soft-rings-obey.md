---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed the `prepare` step for when using local templates that were added to the catalog using the `file:` target configuration.
No more `EPERM: operation not permitted` error messages.
