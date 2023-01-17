---
id: services
title: Backend Service APIs
sidebar_label: Service APIs
# prettier-ignore
description: Service APIs for backend plugins
---

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

  // The defaultFactory is optional to implement but it will be used if no
  // other factory is provided to the backend. This allows for the backend
  // to provide a default implementation of the service without having to wire
  // it beforehand.
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        logger: coreServices.logger,
        plugin: coreServices.pluginMetadata,
      },
      // This root context method is only available for plugin scoped services.
      // It's only called once per backend instance.
      // Logger is available at the root context level as it's also a root
      // scoped service.
      createRootContext({ logger }) {
        return new ExampleImplFactory({ logger });
      },
      // Plugin is available as it's a plugin scoped service and will be
      // created once per plugin. The logger can be had here too if needed.
      // Both this anc the root context can also be async.
      factory({ logger, plugin }, rootContext) {
        // This block will be executed once for every plugin that depends on
        // this service
        logger.info('Initializing example service plugin instance');
        return rootContext.forPlugin(plugin.getId());
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
    factory() {
      return new GoogleCloudLogger();
    },
  });
  // custom implementation here ...
}

// packages/backend/src/index.ts
const backend = createBackend({
  services: [
    // supplies additional or replacement services to the backend
    GoogleCloudLogger.factory(),
  ],
});
```
