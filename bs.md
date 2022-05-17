**Status:** Open for comments

<!--- Open for comments |Closed for comments (RFC no longer maintained) --->

## Need

The new Backend system stems from a couple of needs identified prior to writing this RFC.

### Simplified Installations

The perhaps most important of these is to make it easy for integrators to install new backend plugins without having to jump around in multiple files to wire up the plugin.

The current process is both time consuming and prone to errors. Ideally the installation should not require more than a few lines of code excluding the configuration itself.

### Sane Defaults

It should be easy to stay up to date with new backend plugin when upgrading.

Today plugins often have their dependencies constructed in the plugins setup file leading to a high risk of breaking changes and manual labour during upgrades when a plugin starts taking additional dependencies or when constructor parameters change.

We need to be able to introduce new default APIs without having to change the existing code in order to consume them.

### Extending Plugins

It should be easy for integrators to install extensions to existing plugins in order to gain new functionality.

Plugin developers should be able to provide extension points for other modules to use.

### Developer Friendly

The concept of installing, extending and providing extension points should be similar across the system and easy for developers to understand.

The development experience should be easy and quick.

## Proposal

The proposal is divided into several sections as the use cases for integrators and plugin developers are different.

### Plugin Usage

In its simplest form new plugins can be installed by adding them to the backend.

```ts
import { createBackend } from '@backstage/backend-common';
import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import { catalogGithubModule } from '@backstage/plugin-catalog-github-module';

async function main() {
  const backend = createBackend();
  // Adds the catalogPlugin
  backend.add(catalogPlugin());
  // Installs GitHub org discovery, which adds the entity provider to the catalog
  backend.add(catalogGithubModule.orgDiscovery());
  await backend.start();
}
```

Plugin authors can expose options that can be used alter the default setup.

```ts
backend.add(catalogPlugin({ disableProcessing: true }));
```

### Plugin Authors

New plugins are created by exporting the result of `createBackendPlugin`.

`createBackendPlugin` accept a `register` function which takes care of wiring up the plugin to the backend once it has been installed.

The register function is passed a backend environment (`env`) parameter.
The environment can then be used to register the plugin's init function which is called on startup.

The init function uses a dependency injection system similar to the Utility APIs found in the frontend core library. For now we refer to these as "Services" rather than "APIs", but naming is to be determined. This is to help separate the concepts, as they don't function in the exact same way.

Dependencies to the plugin provided in the `deps` section by mapping them to a name for reference in the init function and the corresponding `ServiceRef`. The backend framework then takes care of initializing dependencies prior to calling the init function.

```ts
export const examplePlugin = createBackendPlugin({
  id: 'example',
  register(env) {
    env.registerInit({
      deps: {
        router: httpRouterServiceRef,
      },
      async init({ router }) {
        // plugin specific setup code.
        router.use('/hello', async (_req, res) =>
          res.json({ message: 'Hello World' }),
        );
      },
    });
  },
});
```

### Plugins Providing Extension Points

There is a need for plugins to expose extension points which can be extended by other plugins.
The software catalog is an example of such a plugin, which today is extended with custom processors and entity providers.

A plugin can register multiple extension points, each of which can be depended on by other plugins through a service reference.

Please note that the `ServiceRef` for the extension point is imported from the plugins `node` package as we should avoid plugin to plugin imports.

```ts
// exported from @backstage/plugin-example-hello-world-node

export interface GreetService {
  addGreeting(greeting: string): void;
}

export const greetingsExtensionPoint = createServiceRef<GreetService>({
  id: 'example.greetings',
});
```

```ts
import { greetingsExtensionPoint } from '@backstage/plugin-example-hello-world-node';

export const examplePlugin = createBackendPlugin({
  id: 'example',
  register(env) {
    // implements the GreetService
    const greetApi = new GreetApiImpl();

    env.registerExtensionPoint(greetingsExtensionPoint, greetApi);

    env.registerInit({
      async init() {
        // greetApi is in scope as it's referenced above.
        // uses the private .greet method which is not exposed in the public API.
        greetApi.greet();
      },
    });
});
```

### Providing Services

There is going to be a set of default services provided by the framework and surrounding packages, such as routing, logging and many others. What's common for many of these services are that there is a need to scope the service implementation to each plugin. For example the logging service is more useful when it's able to tell which plugin is outputting a particular log line. To accommodate this use case, the service factory always creates an instance scoped to the plugin requesting the service.

Service factories are created using the `createServiceFactory` function connecting the `factory` implementation to the `ServiceRef`. The factory function returned is expected to produce an instance of the service given a plugin ID.

```ts
export const loggerServiceRef = createServiceRef<LoggerService>({
  id: 'core.logging',
});

const loggerServiceFactory = createServiceFactory({
  api: loggerServiceRef,
  deps: {},
  factory: async () => {
    const rootLogger = new RootLogger();
    return async (pluginId = 'root') => rootLogger.child({ pluginId });
  },
});

// The backend is then passed the loggerFactory to register it with the backend.
const backend = createBackend({
  apis: [loggerServiceFactory],
});
```

Similar to frontend Utility APIs, service factories may depend on other services. The dependency mechanism is slightly different though, as we receive a factory function rather than the concrete implementation of the service dependency. This factory function is then used to request a service instance for a given plugin ID. Services may also support un-scoped instances, which are retrieved by omitting the plugin ID.

```ts
export const dbServiceRef = createServiceRef<DbService>({
  id: 'core.db',
});

const dbServiceFactory = createServiceFactory({
  api: dbServiceRef,
  deps: {
    loggerFactory: loggerServiceRef,
  },
  factory: async ({ loggerFactory }) => {
    const rootLogger = await loggerFactory();
    const dbManager = new DbManager(rootLogger);

    return async (pluginId?: string) => {
      if (!pluginId) {
        throw new Error('DB Service must be scoped to a plugin');
      }
      const logger = await loggerFactory(pluginId);
      return dbManager.forPlugin(pluginId, { logger });
    };
  },
});
```

### Developer Experience

Many installations have several backend plugins running together in the same main process. To accommodate for a leaner and less noisy development experience it is desirable to have an option to run a specific set of plugins of those wired up to the backend.

For example this would just start the catalog and scaffolder backend.

```console
yarn backstage-cli start-backend --backend catalog --backend scaffolder
```

## Alternatives

Several experiments on different setups where conducted in the [backend-system-exploration](https://github.com/backstage/backend-system-exploration/tree/main/experiments)’s repository where we looked at different approaches for wiring up plugins and providing dependencies.

Roadie has also helped out prototyping what the backend system would look like with an off the shelf DI framework added on top of the existing backend system. See #TODO for more information.

## Risks

<!--- What other things happening could conflict or compete (for example for resources) with the proposal? What risk are there and how do we plan to handle them --->

### Massive Backend Plugin Migration

The intention is to gradually let existing plugins implement the new Backend API while still exposing the old API for backwards compatibility.

There should be a way to install and wire a "legacy" plugin into the new backend system. We don't see a risk supporting the use case as the existing plugin setups are mostly relying on the old environment for configuration.
