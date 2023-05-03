---
id: discovery
title: Azure BlobStorage Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from an Azure BlobStorage container
---

The Azure BlobStorage integration has a special entity provider for discovering
catalog entities within an Azure BlobStorage. The provider will crawl your provided Azure
BlobStorage container and register entities matching the configured path. This can
be useful as an alternative to static locations or manually adding things to the
catalog.

This guide explains how to install and configure the Azure BlobStorage Entity Provider.

## Dependencies

### Azure Integration

Setup [Azure integration](locations.md) with `accountName` and `secretAccessKey`. Host will than
be `{accountName}.blob.core.windows.net`.

## Installation

At your configuration, you add one or more provider configs:

```yaml title="app-config.yaml"
catalog:
  providers:
    azureBlobStorage:
      yourProviderId: # identifies your dataset / provider independent of config changes
        accountName: account
        containerName: container
        prefix: dir/path # optional, allows to specify a prefix-directory where files can be found
        schedule: # optional; same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
      yourSecondProviderId: # identifies your dataset / provider independent of config changes
        accountName: account2
        containerName: mycontainer
```

The parameters available are:

- **`accountName:`** _(required)_ AccountName of BlobStorage
- **`containerName:`** _(required)_ Your Organization slug (or Collection for on-premise users). Required.
- **`prefix:`** _(optional)_ allows to specify a prefix-directory where files can be found
- **`schedule`** _(optional)_:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.

As this provider is not one of the default providers, you will first need to install
the AzureBlobStorage catalog plugin:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-azure-blobstorage
```

Once you've done that, you'll also need to add the segment below to `packages/backend/src/plugins/catalog.ts`:

```ts title="packages/backend/src/plugins/catalog.ts"
/* highlight-add-next-line */
import { AzureBlobStorageEntityProvider } from '@backstage/plugin-catalog-backend-module-azure-blobstorage';

const builder = await CatalogBuilder.create(env);
/** ... other processors and/or providers ... */
/* highlight-add-start */
builder.addEntityProvider(
  AzureBlobStorageEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    // optional: alternatively, use scheduler with schedule defined in app-config.yaml
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
    // optional: alternatively, use schedule
    scheduler: env.scheduler,
  }),
);
/* highlight-add-end */
```
