---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: Removed the following deprecated symbols:

- `catalogBuilder.setRefreshInterval`, use `catalogBuilder.setProcessingInterval` instead.
- `catalogBuilder.setRefreshIntervalSeconds`, use `catalogBuilder.setProcessingIntervalSeconds` instead.
- `createRandomRefreshInterval`, use `createRandomProcessingInterval` instead.
- `RefreshIntervalFunction`, use `ProcessingIntervalFunction` instead.
