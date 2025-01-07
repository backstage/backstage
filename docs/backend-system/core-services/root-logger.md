---
id: root-logger
title: Root Logger Service
sidebar_label: Root Logger
description: Documentation for the Root Logger service
---

## Root Logger

The root logger is the logger that is used by other root services. It's where the implementation lies for creating child loggers around the backstage ecosystem including child loggers for plugins with the correct metadata and annotations.

If you want to override the implementation for logging across all of the backend, this is the service that you should override.

## Configuring the service

The following example is how you can override the root logger service to add additional metadata to all log lines.

```ts
import { coreServices, createServiceFactory } from '@backstage/backend-plugin-api';
import { WinstonLogger } from '@backstage/backend-defaults/rootLogger';
import { createConfigSecretEnumerator } from '@backstage/backend-defaults/rootConfig';

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

      const secretEnumerator = await createConfigSecretEnumerator({
        logger,
      });
      logger.addRedactions(secretEnumerator(config));
      config.subscribe?.(() => logger.addRedactions(secretEnumerator(config)));

      return logger;
    },
  }),
);
```
