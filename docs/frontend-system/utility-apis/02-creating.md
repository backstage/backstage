---
id: creating
title: Creating Utility APIs
sidebar_label: Creating APIs
description: Creating new utility APIs in your plugins and app
---

This section describes how to make a Utility API from scratch, or to add configurability and inputs to an existing one. If you are instead interested in migrating an existing Utility API from the old frontend system, check out the [Migrating APIs section](../building-plugins/05-migrating.md#migrating-apis).

## Creating the Utility API contract

The first step toward exposing a utility API is to define its TypeScript contract, as well as an API reference for consumers use to access the implementation. If you want your API to be accessible by other plugins this should be done in [your plugin's `-react` package](../../architecture-decisions/adr011-plugin-package-structure.md), so that it can be imported separately. If you just want to use the API within your own plugin it is fine to place the definition within the plugin itself. In this example, we have an Example plugin that wants to expose a utility API for performing some type of work.

```tsx title="in @internal/plugin-example-react"
import { createApiRef } from '@backstage/frontend-plugin-api';

/**
 * The work interface for the Example plugin.
 * @public
 */
export interface WorkApi {
  /**
   * Performs some work.
   */
  doWork(): Promise<void>;
}

/**
 * API Reference for {@link WorkApi}.
 * @public
 */
export const workApiRef = createApiRef<WorkApi>({
  id: 'plugin.example.work',
});
```

Both of these are properly exported publicly from the package, so that consumers can reach them.

The frontend system infers the owning plugin for an API from the `ApiRef` id, so
use the pattern `plugin.<plugin-id>.*` to make ownership explicit. This ensures that other plugins can't mistakenly override your API.

## Providing an extension through your plugin

The plugin itself now wants to provide this API and its default implementation, in the form of an API extension. Doing so means that when users install the Example plugin, an instance of the Work utility API will also be automatically available in their apps - both to the Example plugin itself, and to others. We do this in the main plugin package, not the `-react` package.

```tsx title="in @internal/plugin-example"
import {
  ApiBlueprint,
  createFrontendPlugin,
  storageApiRef,
  StorageApi,
} from '@backstage/frontend-plugin-api';
import { WorkApi, workApiRef } from '@internal/plugin-example-react';

class WorkImpl implements WorkApi {
  constructor(options: { storageApiRef: StorageApi }) {
    /* TODO */
  }
  async doWork() {
    /* TODO */
  }
}

const workApi = ApiBlueprint.make({
  name: 'work',
  params: defineParams =>
    defineParams({
      api: workApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) => {
        return new WorkImpl({ storageApi });
      },
    }),
});

/**
 * The Example plugin.
 * @public
 */
export default createFrontendPlugin({
  pluginId: 'example',
  extensions: [exampleWorkApi],
});
```

For illustration we make a skeleton implementation class and the API extension and factory for it, in the same file. These are not exported to the public surface of the plugin package; only the plugin is, as the default export. Users who install the plugin will now get the utility API automatically as well.

The code also illustrates how the API factory declares a dependency on another utility API - the core storage API in this case. An instance of that utility API is then provided to the factory function.

The extension ID of the work API will be the kind `api:` followed by the plugin ID as the namespace, a `/` separator, and lastly the name we used of the extension. In this case we end up with `api:example/work`. Check out [the naming patterns doc](../architecture/50-naming-patterns.md) for more information on how this works. You can now use this ID to refer to the API in app-config and elsewhere. In case there is a single API that is a central to the functionality of the plugin, most typically an API client, you can choose to omit the name of the extension so that you end up with just `api:<pluginId>`.

## Lazy API implementations

To load an API implementation asynchronously, declare its value as a promise:

```ts
export const workApiRef = createApiRef<Promise<WorkApi>>().with({
  id: 'plugin.example.work',
});
```

The promise is the API value. Factories, direct holder lookups, and dependencies
all retain that declared type. The `useApi` hook from
`@backstage/frontend-plugin-api` unwraps it and suspends until it resolves.

For example, use a dynamic import to defer loading an implementation until the
API is first requested:

```ts
import { ApiBlueprint, coreApis } from '@backstage/frontend-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';

const workApi = ApiBlueprint.make({
  name: 'work',
  params: defineParams =>
    defineParams({
      api: workApiRef,
      deps: { storageApi: coreApis.storage },
      factory: async ({ storageApi }) => {
        const { WorkImpl } = await import('./WorkImpl');
        return new WorkImpl({ storageApi });
      },
    }),
});
```

Keep the implementation out of static imports in the plugin entry point so it
can be loaded separately. The framework calls the factory on demand and caches
its return value, including the promise. Repeated lookups share that promise and
its resolved implementation or rejection.

A factory that depends on this API receives `Promise<WorkApi>`. It can await the
promise when it needs the implementation, or retain the promise for later use.
The framework does not await factory dependencies. If the dependent factory also
returns a promise, declare its API value as a promise too. Use `Promise.all` when
you want to await several dependencies together.

### Changing an API to a promise

Changing `ApiRef<WorkApi>` to `ApiRef<Promise<WorkApi>>` changes its public
contract. Direct lookups and factory dependencies now receive a promise, and
`useApi` consumers may suspend. Update consumers and custom factories together;
an override for the promise-valued API must also return a promise.

For refs exported from a library package or another public surface outside the
owning plugin package, this requires a breaking release. Refs that are not
exported, or are exported only by the owning plugin package, follow the
breaking-producers exception when the plugin updates its own consumers and
default implementation together.

The `useApi` hook from `@backstage/core-plugin-api` keeps the old frontend
system's behavior and returns promise-valued APIs directly. Automatic unwrapping
is specific to the hook from `@backstage/frontend-plugin-api`; holders and legacy
conversion helpers continue passing API values through unchanged.

See [consuming promise-valued APIs](./03-consuming.md#promise-valued-apis) for
Suspense and error handling.

## Adding configurability

Here we will describe how to amend a utility API with the capability of having extension config, which is driven by [your app-config](../../conf/writing.md). You do this by giving an extension config schema to your API extension factory function. Let's refactor the example above to also accept configuration, which will require us to use the [override method of the blueprint](../architecture/23-extension-blueprints.md#creating-an-extension-from-a-blueprint-with-overrides).

```tsx title="in @internal/plugin-example"
import { z } from 'zod';

const exampleWorkApi = ApiBlueprint.makeWithOverrides({
  configSchema: {
    goSlow: z.boolean().default(false),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      factory: createApiFactory({
        api: workApiRef,
        deps: { storageApi: storageApiRef },
        factory: ({ storageApi }) => {
          return new WorkImpl({
            storageApi,
            goSlow: config.goSlow,
          });
        },
      }),
    });
  },
});
```

We wanted users to be able to set a `goSlow` extension config parameter for our API instances, which we declared in our new configuration schema. The actual extension config values will then be passed in a type safe manner in to the blueprint `factory`, wherein we can use them to create our API factory and pass as our blueprint parameters.

Note that the expression "extension config" as used here, is _not_ the same thing as the `configApi` which gives you access to the full app-config. The extension config discussed here is instead the particular configuration settings given to your utility API instance. This is discussed more [in the Configuring section](./04-configuring.md).

Note also that the extension config schema contained a default value for the `goSlow` field. This is an important consideration. You want users of your API to be able to get maximum value out of it, without having to dive deep into how to configure it. For that reason you generally want to provide as many sane defaults as possible, while letting users override them rarely but with purpose, only when called for. If you have an extension config schema without defaults, the framework will refuse to instantiate the utility API on startup unless the user had configured those values explicitly. Since it had a default value, the TypeScript code and interfaces also don't have to defensively allow `undefined` - we know that it'll have either the default value or an overridden value when we start consuming the extension config data.

## Adding inputs

Inputs are added to Utility APIs in the same way as other extension blueprints:

- Use `.makeWithOverrides` and declare a set of `inputs` for your extension.
- If needed, create custom extension data types to be used in those inputs.
- If needed, create and export an [extension blueprint](../architecture/23-extension-blueprints.md#creating-an-extension-blueprint) for creating that particular attachment type.

This is a power use case and not very commonly used.

<!-- TODO: link to main article -->

## Next steps

See [the Consuming section](./03-consuming.md) to see how to consume this new utility API in various ways. If you wish to configure and add inputs to it, check out [the Configuring section](./04-configuring.md).
