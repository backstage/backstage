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
