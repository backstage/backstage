---
id: new-backend-system
title: New Backend System
description: Details of the new backend system
---

## Status

The new backend system is released and ready for production use, and many plugins and modules have already been migrated. We recommend all plugins and deployments to migrate to the new system.

You can find an example backend setup in [the backend package](https://github.com/backstage/backstage/tree/master/packages/backend).

## Overview

The new Backstage backend system was built to help make it simpler to install backend plugins and to keep projects up to date. It also changed the foundation to one that makes it a lot easier to evolve plugins and the system itself with minimal disruption or cause for breaking changes. You can read more about the reasoning in the [original RFC](https://github.com/backstage/backstage/issues/11611).

One of the goals of the new system was to reduce the code needed for setting up a Backstage backend and installing plugins. This is an example of how you create, add features, and start up your backend in the new system:

```ts
import { createBackend } from '@backstage/backend-defaults';

// Create your backend instance
const backend = createBackend();

// Install all desired features
backend.add(import('@backstage/plugin-catalog-backend'));

// Start up the backend
backend.start();
```

One notable change that helped achieve this much slimmer backend setup is the introduction of a system for dependency injection, which is very similar to the one in the Backstage frontend.

## Building Blocks

This section introduces the high-level building blocks upon which this new system is built. These are all concepts that exist in our current system in one way or another, but they have all been lifted up to be first class concerns in the new system.

### Backend

This is the backend instance itself, which you can think of as the unit of deployment. It does not have any functionality in and of itself, but is simply responsible for wiring things together.

It is up to you to decide how many different backends you want to deploy. You can have all features in a single one, or split things out into multiple smaller deployments. All depending on your need to scale and isolate individual features.

### Plugins

Plugins provide the actual features, just like in our existing system. They operate completely independently of each other. If plugins want to communicate with each other, they must do so over the wire. There can be no direct communication between plugins through code. Because of this constraint, each plugin can be considered to be its own microservice.

### Services

Services provide utilities to help make it simpler to implement plugins, so that each plugin doesn't need to implement everything from scratch. There are both many built-in services, like the ones for logging, database access, and reading configuration, but you can also import third-party services, or create your own.

Services are also a customization point for individual backend installations. You can both override services with your own implementations, as well as make smaller customizations to existing services.

### Extension Points

Many plugins have ways in which you can extend them, for example entity providers for the Catalog, or custom actions for the Scaffolder. These extension patterns are now encoded into Extension Points.

Extension Points look a little bit like services, since you depended on them just like you would a service. A key difference is that extension points are registered and provided by plugins themselves, based on what customizations each individual plugin wants to expose.

Extension Points are also exported separately from the plugin instance itself, and a single plugin can also expose multiple different extension points at once. This makes it easier to evolve and deprecated individual Extension Points over time, rather than dealing with a single large API surface.

### Modules

Modules use the plugin Extension Points to add new features for plugins. They might for example add an individual Catalog Entity Provider, or one or more Scaffolder Actions. Modules are basically plugins for plugins.

Each module may only extend a single plugin, and the module must be deployed together with that plugin in the same backend instance. Modules may however only communicate with their plugin through its registered extension points.

Just like plugins, modules also have access to services and can depend on their own service implementations. They will however share services with the plugin that they extend, there are no module-specific service implementations.

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
  pluginId: 'example',
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
backend.add(examplePlugin);
```

If we wanted our plugin to accept options as well, we'd accept the options as the second parameter of the register method:

```ts
export const examplePlugin = createBackendPlugin({
  pluginId: 'example',
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

## Creating Modules

Some facts about modules

- A Module is able to extend a plugin with additional functionality using the `ExtensionPoint`s registered by the plugin.
- A module can only extend one plugin but can interact with multiple `ExtensionPoint`s registered by that plugin.
- A module is always initialized before the plugin it extends.

A module depends on the `ExtensionPoint`s exported by the target plugin's library package, for example `@backstage/plugin-catalog-node`, and does not directly declare a dependency on the plugin package itself.

Here's an example on how to create a module that adds a new processor using the `catalogProcessingExtensionPoint`:

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { MyCustomProcessor } from './processor';

export const exampleCustomProcessorCatalogModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'example-custom-processor',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new MyCustomProcessor());
      },
    });
  },
});
```

### Extension Points

Modules depend on extension points just as a regular dependency by specifying it in the `deps` section.

#### Defining an Extension Point

```ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface ScaffolderActionsExtensionPoint {
  addAction(action: ScaffolderAction): void;
}

export const scaffolderActionsExtensionPoint =
  createExtensionPoint<ScaffolderActionsExtensionPoint>({
    id: 'scaffolder.actions',
  });
```

#### Registering an Extension Point

Extension points are registered by a plugin and extended by modules.

## Backend Services

The default backend provides several [core services](https://github.com/backstage/backstage/blob/master/packages/backend-plugin-api/src/services/definitions/coreServices.ts) out of the box which includes access to configuration, logging, databases and more.
Service dependencies are declared using their `ServiceRef`s in the `deps` section of the plugin or module, and the implementations are then forwarded to the `init` method of the plugin or module.

### Service References

A `ServiceRef` is a named reference to an interface which are later used to resolve the concrete service implementation. Conceptually this is very similar to `ApiRef`s in the frontend.
Services is what provides common utilities that previously resided in the `PluginEnvironment` such as Config, Logging and Database.

On startup the backend will make sure that the services are initialized before being passed to the plugin/module that depend on them.
ServiceRefs contain a scope which is used to determine if the serviceFactory creating the service will create a new instance scoped per plugin/module or if it will be shared. `plugin` scoped services will be created once per plugin/module and `root` scoped services will be created once per backend instance.

#### Defining a Service

```ts
import {
  createServiceFactory,
  coreServices,
} from '@backstage/backend-plugin-api';
import { ExampleImpl } from './ExampleImpl';

export interface ExampleApi {
  doSomething(): Promise<void>;
}

export const exampleServiceRef = createServiceRef<ExampleApi>({
  id: 'example',
  scope: 'plugin', // can be 'root' or 'plugin'

  // The defaultFactory is optional to implement but it will be used if no other factory is provided to the backend.
  // This is allows for the backend to provide a default implementation of the service without having to wire it beforehand.
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        logger: coreServices.logger,
        plugin: coreServices.pluginMetadata,
      },
      // Logger is available directly in the factory as it's a root scoped service and will be created once per backend instance.
      async factory({ logger, plugin }) {
        // plugin is available as it's a plugin scoped service and will be created once per plugin.
        return async ({ plugin }) => {
          // This block will be executed once for every plugin that depends on this service
          logger.info('Initializing example service plugin instance');
          return new ExampleImpl({ logger, plugin });
        };
      },
    }),
});
```

### Overriding Services

In this example we replace the default root logger service implementation with a custom one that streams logs to GCP. The `rootLoggerServiceRef` has a `'root'` scope, meaning there are no plugin-specific instances of this service.

```ts
import {
  createServiceFactory,
  rootLoggerServiceRef,
  LoggerService,
} from '@backstage/backend-plugin-api';

// This custom implementation would typically live separately from
// the backend setup code, either nearby such as in
//   packages/backend/src/services/logger/GoogleCloudLogger.ts
// Or you can let it live in its own library package.
class GoogleCloudLogger implements LoggerService {
  static factory = createServiceFactory({
    service: rootLoggerServiceRef,
    deps: {},
    async factory() {
      return new GoogleCloudLogger();
    },
  });
  // custom implementation here ...
}

// packages/backend/src/index.ts
const backend = createBackend();

// supplies additional or replacement services to the backend
backend.add(GoogleCloudLogger.factory);
```

## Testing

Utilities for testing backend plugins and modules are available in `@backstage/backend-test-utils`.
`startTestBackend` returns the HTTP which can be used together with `supertest` to test the plugin.

```ts
import { startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';

describe('My plugin tests', () => {
  it('should return 200', async () => {
    const { server } = await startTestBackend({
      features: [myPlugin()],
    });

    const response = await request(server).get('/api/example/hello');
    expect(response.status).toBe(200);
  });
});
```

## Package structure

A detailed explanation of the package architecture can be found in the [Backstage Architecture Overview](../overview/architecture-overview.md#package-architecture). The most important packages to consider for this system are `backend`, `plugin-<pluginId>-backend`, `plugin-<pluginId>-node`, and `plugin-<pluginId>-backend-module-<moduleId>`.

- `plugin-<pluginId>-backend` houses the implementation of the plugins themselves.
- `plugin-<pluginId>-node` houses the extension points and any other utilities that modules or other plugins might need.
- `plugin-<pluginId>-backend-module-<moduleId>` houses the modules that extend the plugins via the extension points.
- `backend` is the backend itself that wires everything together to something that you can deploy.
