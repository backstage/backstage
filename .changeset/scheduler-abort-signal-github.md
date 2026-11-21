---
'@backstage/plugin-catalog-backend-module-github': patch
---

The scheduled refreshes of the GitHub entity providers now stop when the scheduler aborts the task, for example when it times out or the backend shuts down. An aborted refresh no longer applies a partial result to the catalog.
