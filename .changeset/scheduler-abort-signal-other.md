---
'@backstage/plugin-catalog-backend-module-gerrit': patch
'@backstage/plugin-catalog-backend-module-gitea': patch
'@backstage/plugin-catalog-backend-module-puppetdb': patch
'@backstage/plugin-catalog-backend-module-backstage-openapi': patch
---

The scheduled refreshes of the Gerrit, Gitea, PuppetDB and Backstage OpenAPI entity providers now stop when the scheduler aborts the task, for example when it times out or the backend shuts down. An aborted refresh no longer applies a partial result to the catalog.
