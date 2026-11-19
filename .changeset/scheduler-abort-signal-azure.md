---
'@backstage/plugin-catalog-backend-module-azure': patch
---

The scheduled refreshes of the Azure DevOps and Azure Blob Storage entity providers now stop when the scheduler aborts the task, for example when it times out or the backend shuts down. An aborted refresh no longer applies a partial result to the catalog.
