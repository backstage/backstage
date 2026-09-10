---
id: root-instance-metadata
title: Root Instance Metadata Service
sidebar_label: Root Instance Metadata
description: Documentation for the Root Instance Metadata service
---

The root instance metadata service provides information about the running Backstage backend instance, including its globally unique instance ID and a list of all installed backend plugins.

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

The instance ID is stable for the lifetime of the backend instance and should be treated as an opaque string. By default, each backend instance is assigned a random UUID.

## Setting the instance ID

You can provide the instance ID when you create the backend. This is useful when your deployment environment already provides a suitable identifier, such as a Kubernetes pod UID.

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend({
  instanceId: process.env.POD_UID,
});
```

A configured instance ID must be globally unique. Backstage does not validate the uniqueness of provided IDs.

## Dynamic plugin registration

The root instance metadata service picks up plugins that are registered at start time through a `backend.start()` call. You need to restart the running backend instance to pick up newly installed plugins.
