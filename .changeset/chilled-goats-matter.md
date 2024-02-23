---
'@backstage/plugin-lighthouse-backend': patch
---

**BREAKING**: The `createScheduler` function now requires the `discovery` service to be forwarded from the plugin environment. This is part of the migration to support new auth services.
