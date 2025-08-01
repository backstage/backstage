---
id: root-config
title: Root Config Service
sidebar_label: Root Config
description: Documentation for the Root Config service
---

This service allows you to read configuration values out of your `app-config` YAML files.

## Using the service

The following example shows how you can use the default config service to be able to get a config value, and then log it to the console.

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
        config: coreServices.rootConfig,
      },
      async init({ log, config }) {
        const baseUrl = config.getString('backend.baseUrl');
        log.warn(`The backend is running at ${baseUrl}`);
      },
    });
  },
});
```

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

      # Ignore logs starting with "Task worker starting", unless they're warnings or errors.
      - matchers:
          message: ['/^Task worker starting/']
        level: warn
```

## Overriding the service

There's additional configuration that you can optionally pass to setup the `config` core service.

- `argv` - Override the arguments that are passed to the config loader, instead of using `process.argv`
- `remote` - Configure remote configuration loading

You can configure these additional options by adding an override for the core service when calling `createBackend` like follows:

```ts
import { rootConfigServiceFactory } from '@backstage/backend-defaults/rootConfig';

const backend = createBackend();

backend.add(
  rootConfigServiceFactory({
    argv: [
      '--config',
      '/backstage/app-config.development.yaml',
      '--config',
      '/backstage/app-config.yaml',
    ],
    remote: { reloadIntervalSeconds: 60 },
  }),
);
```

For more advanced customization, there are several APIs from the `@backstage/config-loader` package that allow you to customize the implementation of the config service. The default implementation uses the `ConfigSources.default` method, which has the same options as the `rootConfigServiceFactory` function. You can use these to create your own config service implementation:

```ts
import { ConfigSources } from '@backstage/config-loader';
import { createServiceFactory } from '@backstage/backend-plugin-api';

const backend = createBackend();

backend.add(
  createServiceFactory({
    service: coreServices.rootConfig,
    deps: {},
    async factory() {
      const source = ConfigSources.default({
        argv: [
          '--config',
          '/backstage/app-config.development.yaml',
          '--config',
          '/backstage/app-config.yaml',
        ],
        remote: { reloadIntervalSeconds: 60 },
      });
      console.log(`Loading config from ${source}`);
      return await ConfigSources.toConfig(source);
    },
  }),
);
```

You can also use other config source such as `StaticConfigSource` and combine them with other sources using `ConfigSources.merge(...)`. You can also create your own config source by implementing the `ConfigSource` interface.
