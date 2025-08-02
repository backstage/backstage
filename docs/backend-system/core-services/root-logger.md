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

The Root Logger Service can be configured with the `backend.logger` section of your `app-config.yaml`.

The following parameters are available:

- `level` (string, optional): Sets the global log level. Possible values are 'debug', 'info', 'warn', or 'error'. Only messages at or above this level will be logged. This can also be set via the `LOG_LEVEL` environment variable, which takes precedence. Defaults to 'info'.

- `meta` (object, optional): Additional metadata to include with every log entry.

- `overrides` (array, optional): Allows you to specify logger overrides for specific plugins or messages. Each override can match on plugin names, message patterns, or any field contained in the log, and set a custom log level for those matches. The override log level must be higher than the global log level to take effect.

Log level overrides can be helpful to reduce the amount of logs produced by Backstage.
For example, it allows to have a global `info` log level but apply the `warn` level to logs originating from verbose plugins.

Example:

```yaml
backend:
  logger:
    meta:
      env: prod # Every log message will have `env="prod"`

    level: debug # Set the global log level to debug

    overrides:
      # Set the log level to 'warn' for the catalog plugin logs
      - matchers:
          plugin: catalog
        level: warn

      # Ignore 'info' incoming HTTP requests logs from the rootHttpRouter service
      - matchers:
          service: rootHttpRouter
          type: incomingRequest
        level: warn

      # Ignore logs starting with "Task worker starting", unless they're warnings or errors
      - matchers:
          message: ['/^Task worker starting/']
        level: warn
```

## Overriding the service

The following example is how you can override the root logger service to add additional metadata to all log lines.

```ts
import { coreServices } from '@backstage/backend-plugin-api';
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
