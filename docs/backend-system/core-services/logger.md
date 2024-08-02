---
id: logger
title: Logger Service
sidebar_label: Logger
description: Documentation for the Logger service
---

This service allows plugins to output logging information. There are actually two logger services: a root logger, and a plugin logger which is bound to individual plugins, so that you will get nice messages with the plugin ID referenced in the log lines.

## Using the service

The following example shows how to get the logger in your `example` backend plugin and create a warning message that will be printed nicely to the console.

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
        log: coreServices.logger,
      },
      async init({ log }) {
        log.warn("Here's a nice log line that's a warning!");
      },
    });
  },
});
```
