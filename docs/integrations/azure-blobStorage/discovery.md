---
id: discovery
title: Azure Blob Storage Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering catalog entities from an Azure Blob Storage account
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./discovery--old.md) instead, and [consider migrating](../../backend-system/building-backends/08-migrating.md)!
:::

The Azure Blob Storage account integration has a special entity provider for discovering catalog
entities located in a storage account container. If you have a container that contains multiple
catalog files, and you want to automatically discover them, you can use this
provider. The provider will crawl your Blob Storage account container and register entities
matching the configured path. This can be useful as an alternative to static
locations or manually adding things to the catalog.

To use the entity provider, you'll need an Azure Blob Storage account integration
[set up](locations.md) with `accountName` and either `aadCredential`, `sasToken`, or `accountKey`

At production deployments, you likely manage these with the permissions attached
to your instance.

In your configuration, you add a provider config per bucket:

```yaml
# app-config.yaml

catalog:
  providers:
    azureBlob:
      providerId:
        accountName: ${ACCOUNT_NAME}
        containerName: ${CONTAINER_NAME}
        schedule: # same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```

For simple setups, you can omit the provider ID at the config
which has the same effect as using `default` for it.

```yaml
# app-config.yaml

catalog:
  providers:
    azureBlob:
      accountName: ${ACCOUNT_NAME}
      containerName: ${CONTAINER_NAME}
      schedule: # same options as in TaskScheduleDefinition
        # supports cron, ISO duration, "human duration" as used in code
        frequency: { minutes: 30 }
        # supports ISO duration, "human duration" as used in code
        timeout: { minutes: 3 }
```

As this provider is not one of the default providers, you will first need to install
the Azure catalog plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-azure
```

Then updated your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-azure'));
/* highlight-add-end */
```
