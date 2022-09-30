---
id: backend
title: Backend
description: About Backend
---

## Backend System

**DISCLAMER: The new backend system is under active development and is not considered stable** 

### Overview

The default backend provides several services out of the box which are available to all plugins but there might cases where you want to provide a completely new service in your installation.

### Service Refs

A serviceRef is a named reference to an interface which are later used to resolve the actual service implementation. Conceptually this is very similar to `ApiRef`s in the frontend.
Services is what provides common utilities that previously resided in the `PluginEnvironment` such as Config, Logging and Database.

On startup the backend will make sure that the services are initialized before being passed to the plugin/module that depend on them.
ServiceRefs does contain a scope which is used to determine if the serviceFactory creating the service will create a new instance for each plugin/module or if it will be shared. `plugin` scoped services will be created once per plugin and `root` scoped services will be created once per backend instance.

#### Defining a ServiceRef

In its simplest form the serviceRef can be defined like this referencing the type of the actual implementation.

```ts
import {
  createServiceFactory,
  pluginMetadataServiceRef,
  loggerServiceRef,
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
        logger: loggerServiceRef,
        plugin: pluginMetadataServiceRef,
      },
      // Logger is available directly in the factory as it's a root scoped service and will be created once per backend instance.
      async factory({ logger }) {

        // plugin is available as it's a plugin scoped service and will be created once per plugin.
        return async ({ plugin }) => {
          // This block will be executed once per plugin depending on this serviceRef
          logger.info(`Creating example service for for plugin ${plugin.id}`);
          return new ExampleImpl({logger});
        };
      },
    }),
}),
```

### Overriding services

In this example replace the default log implementation with a custom one.

```ts
import {
  createServiceFactory,
  loggerServiceRef,
} from '@backstage/backend-plugin-api';
export const gcpLoggerFactory = createServiceFactory({
  service: loggerServiceRef,
  deps: {},
  async factory({}) {
    return async ({}) => {
      // This custom implementation conform with the type of the loggerServiceRef
      return new GoogleCloudLogger();
    };
  },
});

// packages/backend/src/index.ts
const backend = createBackend({
  services: [
    // supplies additional/replacement services to the backend
    gcpLoggerFactory,
  ],
})
```

#### API Overview
`createBackend`
`createBackendPlugin`
`createBackendModule`
`createServiceRef`
`createExtensionPoint`
### Writing Plugins

### Writing modules

Some facts about modules

- A Module is able to extend a plugin with additional functionality using the `ExtensionPoint`s registered by the plugin.
- A module can only extend one plugin but can interact with multiple `ExtensionPoint`s registered by that plugin.
- A module is always initialized before the plugin it extends.

A module depend on the extensionPoint exported by the plugins library package(eg `catalog-node`, `scaffolder-backend`) and does not directly declare a dependency on the plugin package itself.



### Overwriting services


### Extension Points

```ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface ScaffolderActionsExtensionPoint {
 addAction(action: ScaffolderAction): void;
}

export const ScaffolderActionsExtensionPoint =
  createExtensionPoint<ScaffolderActionsExtensionPoint>({
    id: 'scaffolder.actions',
  });
```

### Testing
