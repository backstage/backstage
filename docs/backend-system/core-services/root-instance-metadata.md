---
id: root-instance-metadata
title: Root Instance Metadata Service
sidebar_label: Root Instance Metadata
description: Documentation for the Root Instance Metadata service
---

The root instance metadata service provides information about a specific running Backstage backend instance, including its globally unique instance ID and a list of all installed backend plugins.

A _backend instance_ is the individual `Backend` object returned by each call to `createBackend` or `createSpecializedBackend`. Every backend instance has its own ID, including multiple instances created in the same process. An instance ID must never be shared with or reused for another backend instance, even after the original instance has stopped.

:::note

The root instance metadata service only provides information about the specific Backstage instance you're running on. In more complex deployments with multiple Backstage instances, this service will not provide a complete list of all plugins across all instances.

:::

## Using the service

The following example shows how to use the root instance metadata service in your `example` backend plugin to access the instance ID and the list of installed backend plugins.

```ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        instanceMetadata: coreServices.rootInstanceMetadata,
      },
      async init({ instanceMetadata }) {
        const instanceId = instanceMetadata.getId();
        const plugins = await instanceMetadata.getInstalledPlugins();
        console.log('Instance ID:', instanceId);
        console.log('Installed plugins:', plugins);
      },
    });
  },
});
```

The instance ID is stable for the lifetime of the backend instance and should be treated as an opaque string. By default, a new random UUID is generated separately for every backend instance that is created.

## Setting the instance ID

You can provide the instance ID when you create the backend. This is useful when your deployment environment assigns a fresh, globally unique identifier to every backend instance.

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend({
  instanceId: process.env.BACKSTAGE_INSTANCE_ID,
});
```

A configured instance ID must be globally unique and must not be reused by another backend instance. Backstage does not validate the uniqueness of provided IDs, so the caller is responsible for upholding this requirement.

## Dynamic plugin registration

The root instance metadata service picks up plugins that are registered at start time through a `backend.start()` call. You need to restart the running backend instance to pick up newly installed plugins.
