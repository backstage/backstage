**Status:** Open for comments

<!--- Open for comments |Closed for comments (RFC no longer maintained) --->

## Need

The new Backend system stems from a couple of needs identified prior to writing this RFC.

### Simplified installations

The perhaps most important of these is to make it easy for integrators to install new backend plugins without having to jump around in multiple files to wire up the plugin.

The current process is both time consuming and prone to errors in some cases. Ideally the installation should not require more than a few lines of code excluding the configuration itself.

### Sane defaults

It should be easy to stay up to date with new backend plugin when upgrading.

Today plugins often have their dependencies constructed in the plugins setup file leading to a high risk of breaking changes and manual labour during upgrades when a plugin starts taking additional dependencies or when constructor parameters change.

We need to be able to introduce new default APIs without having to change the existing code in order to consume them.

### Extending plugins

It should be easy for integrators to install extensions to existing plugins in order to gain new functionality.

Plugin developers should be able to provide extensions points for modules to use.

#### Developer friendly

The concept of installing, extending and providing extension points should be similar across the system and easy for developers to understand.

The development experience should be easy and quick.

## Proposal

The proposal is divided into several sections as the use cases for integrators and plugin developers are different.

### Plugin usage

In it's simplest form new plugins can be installed by adding them to the backend.

```ts
//src/packages/backend/index.ts
import { createBackend } from '@backstage/backend-common';
import { catalogPlugin } from '@backstage/plugin-catalog-backend';
import { catalogGithubModule } from '@backstage/plugin-catalog-github-module';

async function main() {
  const backend = createBackend();
  // installs the catalogPlugin
  backend.add(catalogPlugin);
  // installs the GitHub org discovery plugin and automatically adds the required processor to the catalog.
  backend.add(catalogGithubModule.orgDiscovery);
  await backend.start();
}
```

Plugin authors can expose options that can be used alter the default setup.

```ts
backend.add(catalogPlugin, { disableProcessing: true });
```

### Plugin authors

New plugins are created by exporting the result of `createBackendPlugin`.

`createBackendPlugin` accept a `register` function which takes care of wiring up the plugin to the backend once it has been installed.

The register function is passed a backend environment (`env`) parameter.
The environment can then be used to register the plugins init function which is called on every startup. `registerInit` must be called once for the plugin to be registered.

Dependencies to the plugin provided in the `deps` section by mapping them to a name for reference in the init function and the corresponding `serviceRef`. The backend framework then takes care of initializing dependencies prior to calling the init function.

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
        router.use('/hello', async (req, res) =>
          res.json({ message: 'Hello World' }),
        );
      },
    });
  },
});
```

#### Plugins providing extension points

There is a need for plugins to expose extension points which can be extended by other plugins.
The software catalog is an example of such a plugin which today is extended with custom processors and entity providers.

A plugin can register multiple extension points which act similar to service APIs for other plugins meaning they can be depended on and called in the same way.

Please note that the `serviceRef` for the extension point is imported from the plugins `node` package as we discourage plugin to plugin imports.

```ts
// exported from @backstage/plugin-example-hello-world-node

export interface GreetApi {
  addGreeting(greeting: string): void;
}

export const greetingsInitApiRef = createServiceRef<GreetApi>({
  id: 'example.greetings',
});
```

```ts
import { greetingsInitApiRef } from '@backstage/plugin-example-hello-world-node';

export const examplePlugin = createBackendPlugin({
  id: 'example',
  register(env) {
    // implements the GreetApi
    const greetApi = new GreetApiImpl();
    env.registerInitApi(myPluginCustomHelloInitApiRef, greetApi);

    env.registerInit({
      async init() {
        // greetApi is in scope as it's referenced above.
        // uses the private .greet method which is not exposed in the public API.
        greetApi.greet();
      },
    });
});
```

### Providing APIs

There is going to be a set of default APIs provided by the framework such as routing, logging and many others. What's common for many of these APIs are that there is a need to scope the API to a plugin. For example the logging API is more useful when it's able to tell which plugin is outputting a particular log line. To accommodate this use case the API factory is expected to always an instance scoped to the plugin that requests the API.

APIs are created using the `createApiFactory` function connecting the `factory` implementation to the `serviceRef`. The factory function returned is expected to produce an instance of the API given a plugin id.

```ts
export const loggerApiRef = createServiceRef<Logger>({
  id: 'core.logging',
});

const loggerFactory = createApiFactory({
  api: loggerApiRef,
  deps: {},
  factory: async () => {
    const rootLogger = new ToyLogger();
    return async (pluginId: string) => rootLogger.child({ pluginId });
  },
});

// The backend is then passed the loggerFactory to register it with the backend.
const backend = createBackend({
  apis: [loggerFactory],
});
```

### Developer experience

Many have several backend wired together in the same main process. To accommodate for a leaner and less noisy development experience it is desirable to have an option to run a specific set of plugins of those wired up to the backend.

For example this would just start the catalog and scaffolder backend.

```console
yarn backstage-cli start-backend --backend catalog --backend scaffolder
```

## Alternatives

Several experiments on different setups where conducted in the [backend-system-exploration](https://github.com/backstage/backend-system-exploration/tree/main/experiments)’s repository where we looked at different approaches for wiring up plugins and providing dependencies.

Roadie has also helped out prototyping what the backend system would look like with an off the shelf DI framework added on top of the existing backend system. See #TODO for more information.

## Risks

<!--- What other things happening could conflict or compete (for example for resources) with the proposal? What risk are there and how do we plan to handle them --->

### Massive backend plugin migration

The intention is to gradually let existing plugins implement the new Backend API while still exposing the old API for backwards compatibility.

There should be a way to install and wire a "legacy" plugin into the new backend system. We don't see a risk supporting the use case as the existing plugin setups are mostly relying on the old environment for configuration.
