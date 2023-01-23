---
id: plugins
title: Backend Plugins
sidebar_label: Plugins
# prettier-ignore
description: Backend plugins
---

## Creating Plugins

Plugins are created using the `createBackendPlugin` function. All plugins must have an ID and a register method. Plugins may also accept an options object, which can be either optional or required. The options are passed to the second parameter of the register method, and the options type is inferred and forwarded to the returned plugin factory function.

```ts
import {
  configServiceRef,
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

// export type ExamplePluginOptions = { exampleOption: boolean };
export const examplePlugin = createBackendPlugin({
  // unique id for the plugin
  id: 'example',
  // It's possible to provide options to the plugin
  // register(env, options: ExamplePluginOptions) {
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
      },
      // logger is provided by the backend based on the dependency on loggerServiceRef above.
      async init({ logger }) {
        logger.info('Hello from example plugin');
      },
    });
  },
});
```

The plugin can then be installed in the backend using the returned plugin factory function:

```ts
backend.add(examplePlugin());
```

If we wanted our plugin to accept options as well, we'd accept the options as the second parameter of the register method:

```ts
export const examplePlugin = createBackendPlugin({
  id: 'example',
  register(env, options?: { silent?: boolean }) {
    env.registerInit({
      deps: { logger: coreServices.logger },
      async init({ logger }) {
        if (!options?.silent) {
          logger.info('Hello from example plugin');
        }
      },
    });
  },
});
```

Passing the option to the plugin during installation looks like this:

```ts
backend.add(examplePlugin({ silent: true }));
```
