---
id: root-instance-metadata
title: Root Instance Metadata Service
sidebar_label: Root Instance Metadata
description: Documentation for the Root Instance Metadata service
---

The root instance metadata service provides information about the running Backstage backend instance. Currently, it provides a list of all installed backend plugins.

:::note Note

The root instance metadata service only provides information about the specific Backstage instance you're running on. In more complex deployments with multiple Backstage instances, this service will not provide a complete list of all plugins across all instances.

:::

## Using the service

The following example shows how to use the root instance metadata service in your `example` backend plugin to access the list of installed backend plugins.

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
        const plugins = instanceMetadata.getInstalledPlugins();
        console.log('Installed plugins:', plugins);
      },
    });
  },
});
```

## Dynamic plugin registration

The root instance metadata service picks up plugins that are registered at start time through a `backend.start()` call. You need to restart the running backend instance to pick up newly installed plugins.
