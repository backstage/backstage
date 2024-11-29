---
id: plugin-metadata
title: Plugin Metadata Service
sidebar_label: Plugin Metadata
description: Documentation for the Plugin Metadata service
---

This service allows you to query for metadata about the current plugin. In particular, this service is used by other plugin-scoped services, if they need to know what the ID is of the plugin that they are being instantiated for.

## Using the service

The following example shows a fake plugin-scoped service which wants to know what plugin it "belongs" to.

```ts
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

export const myServiceFactory = createServiceFactory({
  service: myServiceRef,
  deps: {
    logger: coreServices.logger,
    plugin: coreServices.pluginMetadata,
  },
  async factory({ logger, plugin }) {
    const pluginId = plugin.getId();
    logger.info(`Creating an instance of my service for plugin '${id}'`);
    return ...; // TODO
  },
});
```
