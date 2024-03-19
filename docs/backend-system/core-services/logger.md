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

## Root Logger

The root logger is the logger that is used by other root services. It's where the implementation lies for creating child loggers around the backstage ecosystem including child loggers for plugins with the correct metadata and annotations.

If you want to override the implementation for logging across all of the backend, this is the service that you should override.

## Configuring the service

The following example is how you can override the root logger service to add additional metadata to all log lines.

```ts
import { coreServices } from '@backstage/backend-plugin-api';
import { WinstonLogger } from '@backstage/backend-app-api';

const backend = createBackend();

backend.add(
  createServiceFactory({
    service: coreServices.rootLogger,
    deps: {
      config: coreServices.rootConfig,
    },
    async factory({ config }) {
      const logger = WinstonLogger.create({
        meta: {
          service: 'backstage',
          // here's some additional information that is not part of the
          // original implementation
          podName: 'myk8spod',
        },
        level: process.env.LOG_LEVEL || 'info',
        format:
          process.env.NODE_ENV === 'production'
            ? format.json()
            : WinstonLogger.colorFormat(),
        transports: [new transports.Console()],
      });

      return logger;
    },
  }),
);
```
