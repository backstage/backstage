---
'@backstage/backend-defaults': patch
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
---

Add task metrics as two gauges that track the last start and end timestamps as epoch seconds.
