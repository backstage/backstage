---
'@backstage/plugin-app-backend': patch
'@backstage/plugin-auth-backend-module-gcp-iap-provider': patch
'@backstage/plugin-auth-backend-module-github-provider': patch
'@backstage/plugin-auth-backend-module-gitlab-provider': patch
'@backstage/plugin-auth-backend-module-google-provider': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog-backend-module-aws': patch
'@backstage/plugin-catalog-backend-module-azure': patch
'@backstage/plugin-catalog-backend-module-bitbucket-cloud': patch
'@backstage/plugin-catalog-backend-module-bitbucket-server': patch
'@backstage/plugin-catalog-backend-module-gcp': patch
'@backstage/plugin-catalog-backend-module-gerrit': patch
'@backstage/plugin-catalog-backend-module-github': patch
'@backstage/plugin-catalog-backend-module-gitlab': patch
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
'@backstage/plugin-catalog-backend-module-msgraph': patch
'@backstage/plugin-catalog-backend-module-puppetdb': patch
'@backstage/plugin-events-backend': patch
'@backstage/plugin-events-backend-module-aws-sqs': patch
'@backstage/plugin-kubernetes-backend': patch
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-permission-backend-module-allow-all-policy': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-search-backend': patch
'@backstage/plugin-search-backend-module-catalog': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-explore': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-search-backend-module-techdocs': patch
'@backstage/plugin-techdocs-backend': patch
---

The export for the new backend system has been moved to be the `default` export.

For example, if you are currently importing the plugin using the following pattern:

```ts
import { examplePlugin } from '@backstage/plugin-example-backend';

backend.add(examplePlugin);
```

It should be migrated to this:

```ts
backend.add(import('@backstage/plugin-example-backend'));
```
