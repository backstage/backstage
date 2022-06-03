---
'@backstage/plugin-catalog-backend-module-azure': patch
---

Add a new provider `AzureDevOpsEntityProvider` as replacement for `AzureDevOpsDiscoveryProcessor`.

In order to migrate from the `AzureDevOpsDiscoveryProcessor` you need to apply
the following changes:

**Before:**

```yaml
# app-config.yaml

catalog:
  locations:
    - type: azure-discovery
      target: https://dev.azure.com/myorg/myproject/_git/service-*?path=/catalog-info.yaml
```

```ts
/* packages/backend/src/plugins/catalog.ts */

import { AzureDevOpsDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-azure';

const builder = await CatalogBuilder.create(env);
/** ... other processors ... */
builder.addProcessor(new AzureDevOpsDiscoveryProcessor(env.reader));
```

**After:**

```yaml
# app-config.yaml

catalog:
  providers:
    azureDevOps:
      anyProviderId:
        host: selfhostedazure.yourcompany.com # This is only really needed for on-premise user, defaults to dev.azure.com
        organization: myorg # For on-premise this would be your Collection
        project: myproject
        repository: service-*
        path: /catalog-info.yaml
```

```ts
/* packages/backend/src/plugins/catalog.ts */

import { AzureDevOpsEntityProvider } from '@backstage/plugin-catalog-backend-module-azure';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
builder.addEntityProvider(
  AzureDevOpsEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
```

Visit [https://backstage.io/docs/integrations/azure/discovery](https://backstage.io/docs/integrations/azure/discovery) for more details and options on configuration.
