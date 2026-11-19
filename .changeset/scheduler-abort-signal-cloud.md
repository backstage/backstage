---
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/plugin-catalog-backend-module-gcp': patch
---

The scheduled refreshes of the AWS S3 and GKE entity providers now stop when the scheduler aborts the task, for example when it times out or the backend shuts down. An aborted refresh no longer applies a partial result to the catalog.
