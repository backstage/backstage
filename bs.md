**Status:** Open for comments

<!--- Open for comments |Closed for comments (RFC no longer maintained) --->

## Need

- Simplified installations - it should not require changes in several files to install a backend plugin
- Sane defaults - it should be easy to stay up to date with new backend plugin versions
- Extendable - it should be easy to create extensions for other plugins
- Dev friendly - it should be easy to develop and run plugins individually
- Easy to understand - it should be easy for new users to understand how to install and use plugins. Plugin developers should see familiar concepts to creating frontend plugins.

## Proposal

### Plugin users

Our main focus is to simplify the installation of plugins. We want to make it as easy as possible to install plugins and to keep them up to date.
Previously plugin installations required changes and several files often with many dependency classes manually wired up leading to breaking changes when new class parameters where added and removed.

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

The register function is passed an BackendEnv(`env`) parameter which `registerInit` which must be called once for the plugin to be registered.

Dependencies to the plugin are referenced in the `deps` object containing the name later used in the init function and a corresponding `serviceRef` which is imported from the relevant package. The backend framework then takes care of initializing dependencies prior to calling the init function.

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

#### Extension points

Plugins are able to provide extension points which can be interacted with by other plugins or modules as dependencies.

Plugins can therefore register several init apis which can be used to extend the plugin.

```ts
  register(env) {
    env.registerInitApi(myPluginCustomHelloInitApiRef, processingExtensions);
}

```

Here's an example providing a extension point.

```ts
export interface GreetingsApi {
  addGreeting(greeting: string): void;
}

export const greetingsInitApiRef =
  createApiRef<GreetingsApi>({
    id: 'example.hello',
});

export const examplePlugin = createBackendPlugin({
  id: 'example',
  register(env) {
    // contains Hello world by default
    const greetingApi = new Greeting();
    // Exposing this init api for modules to use to add greetings.

    env.registerInitApi(helloInitApiRef, greetingApi);
    env.registerInit({
      deps: {
        router: httpRouterServiceRef,
      },
      async init({ router }) {
        // return a random greeting
        router.use('/hello', async (req, res) => res.json({greeting: greetingApi.random()});
      },
    });
  },
});


```

### Creating backend plugins

```ts
// catalog-node
interface CatalogProcessingInitApi {
  addProcessor(processor: CatalogProcessor): void;
}

export const catalogProcessingInitApiRef =
  createApiRef<CatalogProcessingInitApi>({
    id: 'catalog.processing',
  });

// plugin-catalog

export type CatalogPluginOptions = {
  disableProcessing?: boolean;
};

export const catalogPlugin = createBackendPlugin({
  id: 'catalog',
  register(env, options?: CatalogPluginOptions) {
    const processingExtensions = new CatalogExtensionPointImpl();

    // plugins depending on this API will be initialized before this plugins init method is executed.
    env.registerInitApi(catalogProcessingInitApiRef, processingExtensions);

    env.registerInit({
      deps: {
        logger: loggerApiRef,
      },
      async init({ logger }) {
        const catalog = new Catalog(processingExtensions.processors);
        if (!options?.disableProcessing) {
          await catalog.start();
        }
      },
    });
  },
});

// plugin-scaffolder
export const scaffolderCatalogExtension = createBackendExtension({
  id: 'scaffolder.extensions.catalog',
  register(env: BackendEnv) {
    env.registerInit({
      deps: {
        catalogProcessingInitApi: catalogProcessingInitApiRef,
      },
      async init({ catalogProcessingInitApi }) {
        catalogProcessingInitApi.addProcessor({
          process() {
            console.log('Running scaffolder processor');
          },
        });
      },
    });
  },
});
```

### Providing APIs

```ts
export const loggerApiRef = createApiRef<Logger>({
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

const backend = createBackend({
  apis: [loggerFactory],
});
```

## Alternatives

Several experiments on different setups where conducted in the [backend-system-exploration](https://github.com/backstage/backend-system-exploration/tree/main/experiments)’s repository where we looked at different approaches for wiring up plugins and providing dependencies.

## Risks

<!--- What other things happening could conflict or compete (for example for resources) with the proposal? What risk are there and how do we plan to handle them --->

Massive backend plugin migration
Increased complexity
