---
'@backstage/plugin-catalog-backend-module-gitlab': patch
---

Added try catch around fetching gitlab group users to prevent refresh from failing completely while only a select number of groups might not be able to load correctly.
