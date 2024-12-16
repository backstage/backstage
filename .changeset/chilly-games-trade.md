---
'@backstage/backend-defaults': minor
---

Added a new `backend.health.headers` configuration that can be used to set additional headers to include in health check responses.

**BREAKING CONSUMERS**: As part of this change the `createHealthRouter` function exported from `@backstage/backend-defaults/rootHttpRouter` now requires the root config service to be passed through the `config` option.
