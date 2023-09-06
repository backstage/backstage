---
'@backstage/plugin-adr-backend': minor
'@backstage/plugin-airbrake-backend': minor
'@backstage/plugin-auth-backend': minor
'@backstage/plugin-azure-devops-backend': minor
'@backstage/plugin-badges-backend': minor
'@backstage/plugin-bazaar-backend': minor
'@backstage/plugin-catalog-backend-module-unprocessed': minor
'@backstage/plugin-devtools-backend': minor
'@backstage/plugin-entity-feedback-backend': minor
'@backstage/plugin-kafka-backend': minor
'@backstage/plugin-lighthouse-backend': minor
'@backstage/plugin-linguist-backend': minor
'@backstage/plugin-periskop-backend': minor
'@backstage/plugin-proxy-backend': minor
'@backstage/plugin-todo-backend': minor
'@backstage/plugin-user-settings-backend': minor
---

**BREAKING**: The export for the new backend system has been moved to be the `default` export.

For example, if you are currently importing the plugin using the following pattern:

```ts
import { examplePlugin } from '@backstage/plugin-example-backend';

backend.add(examplePlugin);
```

It should be migrated to this:

```ts
backend.add(import('@backstage/plugin-example-backend'));
```
