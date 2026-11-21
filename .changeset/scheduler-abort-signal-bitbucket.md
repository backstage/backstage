---
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-catalog-backend-module-bitbucket-server': patch
---

The scheduled refreshes of the Bitbucket Cloud and Bitbucket Server entity providers now stop when the scheduler aborts the task, for example when it times out or the backend shuts down. An aborted refresh no longer applies a partial result to the catalog.
