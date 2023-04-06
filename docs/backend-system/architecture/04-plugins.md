---
id: plugins
title: Backend Plugins
sidebar_label: Plugins
# prettier-ignore
description: Backend plugins
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

Plugins provide the actual base features of a Backstage backend. Each plugin operates completely independently of all other plugins and they only communicate with each other through network calls. This means that there is a strong degree of isolation between plugins, and that each plugin can be considered a separate microservice. While a default Backstage project has all plugins installed within a single backend, it is also possible to split this setup into multiple backends, with each backend housing one or more plugins.

## Defining a Plugin

Plugins are created using the `createBackendPlugin` function, and should typically be exported from a plugin package. All plugins must have an ID and a `register` method, where the ID matches the plugin ID in the package name, without the `-backend` suffix. See also the [dedicated section](./07-naming-patterns.md) about proper naming patterns.

```ts
// plugins/example-backend/src/plugin.ts
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';

export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
      },
      async init({ logger }) {
        logger.info('Hello from example plugin');
      },
    });
  },
});
```

The `env` object passed to the `register` callback contains different methods that declare the external surface of the plugin. The `env.registerInit` method is used to register an initialization function that is run when the backend starts up. The `deps` argument is used to declare service dependencies, and the `init` callback is passed an object with the resolved dependencies. In this case, we declare a dependency on the logger service, which is one of the core services available to all Backstage backend plugins. For a full list of core services as well as documentation for each services, see the [core services section](../core-services/01-index.md). Plugins can of course also depend on services exported by other libraries.

The `createBackendPlugin` return value is exported as `examplePlugin`, which is a factory function used to create the actual plugin instance. For example, to install the plugin in your backend instance, you would do the following:

```ts
backend.add(examplePlugin());
```

The reason for why our plugin instance has been wrapped up in a factory function is so that you can always chose to add options to your plugin in the future, without breaking existing usage. To add options you wrap the object passed to `createBackendPlugin` in a callback that accepts the desired options. For example:

```ts
export interface ExamplePluginOptions {
  skipHello: boolean;
}

export const examplePlugin = createBackendPlugin(
  (options?: ExamplePluginOptions) => ({
    pluginId: 'example',
    register(env) {
      env.registerInit({
        deps: {
          logger: coreServices.logger,
        },
        async init({ logger }) {
          if (!options?.skipHello) {
            logger.info('Hello from example plugin');
          }
        },
      });
    },
  }),
);
```

Now your plugin accepts an optional options object, which can be used to configure each plugin instance. To supply options to the plugin, you pass them to the plugin factory method:

```ts
backend.add(examplePlugin({ skipHello: true }));
```

It is also possible to make the options required, simply remove the `?` from the parameter declaration. This will be reflected in the returned factory function, which will now require the options parameter.

Options are a simple way to allow for more lightweight customization of a plugin, but they do not allow for more complex extensions that require access to services. For that, you need to create and register extension points for your plugin, which are covered in the [next section](./05-extension-points.md).

## Rules of Plugins

The following rules apply to the production setup of Backstage plugins in the broader Backstage plugin ecosystem. Any plugin that is maintained under the `@backstage` package namespace should follow these rules, and it is recommended that all widely distributed plugins follow these rules as well.

An exception to these rules are made for development or test setups, where shortcuts can be take in order to streamline development and keep things simple.

### Scalable

Plugins must always be designed to be horizontally scalable. This means that you should not keep any state in memory, or make sure that replicating this state across multiple instances is not an issue. Plugins should either be stateless, or store their state in an external service, such as a database.

### Isolated

Plugins must never communicate with each other directly through code, they may only communicate over the network. Plugins that wish to expose an external interface for other plugins and modules to use are recommended to do so though a [node-library](../../local-dev/cli-build-system.md#package-roles) package. The library should export an API client service to make calls to your plugin, or similar construct.
