---
id: discovery
title: Discovery Service
sidebar_label: Discovery
description: Documentation for the Discovery service
---

When building plugins, you might find that you will need to look up another plugin's base URL to be able to communicate with it. This could be for example an HTTP route or some `ws` protocol URL. For this we have a discovery service which can provide both internal and external base URLs for a given a plugin ID.

## Using the service

The following example shows how to get the discovery service in your `example` backend plugin and making a request to both the internal and external base URLs for the `derp` plugin.

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
        discovery: coreServices.discovery,
      },
      async init({ discovery }) {
        const url = await discovery.getBaseUrl('derp'); // can also use discovery.getExternalBaseUrl to retrieve external URL
        const response = await fetch(`${url}/hello`);
      },
    });
  },
});
```
