---
id: backend
title: Backend
description: About Backend
---

## Backend System

**DISCLAMER: The new backend system is under active development and is not considered stable** 

This is an example of how you create, start and add existing plugins to your backend.

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// backend.add(catalogPlugin());
await backend.start();
```

### Overview

The default backend provides several _services_ out of the box which includes access to config, logging, scheduling and more.
Service are declared using their _serviceRef_ in the `deps` section of plugin or module requiring them and are then available in the `init` method of the plugin or module.

### Service Refs

A serviceRef is a named reference to an interface which are later used to resolve the concrete service implementation. Conceptually this is very similar to `ApiRef`s in the frontend.
Services is what provides common utilities that previously resided in the `PluginEnvironment` such as Config, Logging and Database.

On startup the backend will make sure that the services are initialized before being passed to the plugin/module that depend on them.
ServiceRefs contain a scope which is used to determine if the serviceFactory creating the service will create a new instance scoped per plugin/module or if it will be shared. `plugin` scoped services will be created once per plugin/module and `root` scoped services will be created once per backend instance.

#### Defining a ServiceRef

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

In this example replace the default log implementation with a custom logger.

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

## Writing Plugins

```ts
import { configServiceRef, createBackendPlugin } from '@backstage/backend-plugin-api';

// export type ExamplePluginOptions = { exampleOption: boolean };
export const examplePlugin = createBackendPlugin({
  // unique id for the plugin
  id: 'example',
  // It's possible to provide options to the plugin
  // register(env, options: ExamplePluginOptions) {
  register(env) {
    env.registerInit({
      deps: {
        logger: loggerServiceRef,
      },
      // logger is provided by the backend based on the dependency on loggerServiceRef above.
      async init({ logger }) {
        logger.info('Hello from example plugin');
      },
    });
  },
});
```

The plugin can then be installed to the backend using

```ts
backend.add(examplePlugin());
// Options can be passed to the plugin
// backend.add(examplePlugin({ exampleOption: true}));
```
## Writing Modules

Some facts about modules

- A Module is able to extend a plugin with additional functionality using the `ExtensionPoint`s registered by the plugin.
- A module can only extend one plugin but can interact with multiple `ExtensionPoint`s registered by that plugin.
- A module is always initialized before the plugin it extends.

A module depend on the extensionPoint exported by the plugins library package(eg `catalog-node`, `scaffolder-backend`) and does not directly declare a dependency on the plugin package itself.

Here's an example on how to create a module that adds a new processor using the `catalogProcessingExtensionPoint`

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { MyCustomProcessor } from './processor';

export const exampleCustomProcessorCatalogModule = createBackendModule({
  moduleId: 'exampleCustomProcessor',
  pluginId: 'catalog',
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

Modules depend on extension points just as a regular dependency but specifying it in the `deps` section.

#### Defining an Extension Point

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

#### Registering an Extension Point

Extension points are registered by a plugin and extended by modules.


### Testing

Utilities for testing backend plugins and modules are available in `@backstage/backend-test-utils`.

```ts
import { startTestBackend } from '@backstage/backend-test-utils';

describe('Example', () => {
  it('should do something', async () => {
    await startTestBackend({
      // mock services can be provided to the backend
      services: [someServiceFactory],
      // plugins and modules for testing
      features: [testModule()],
    });
    // assertions 
  });
});
```


## Package structure

The package relationship between plugins, modules and extension are illustrated in the following diagram.

Taken with an artificial foobar backend plugin.

- `plugin-foobar-backend` houses the plugin and registers the extension points into the backend system.
- `plugin-foobar-common` houses the shared types including the Extension Point registered by the backend.
- `plugin-foobar-XYZ-module` houses the modules that extend the foobar backend with extension points imported from `plugin-foobar-common`
