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
import { rootConfigServiceFactory } from '@backstage/backend-app-api';

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
