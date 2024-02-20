---
id: creating
title: Creating Utility APIs
sidebar_label: Creating APIs
# prettier-ignore
description: Creating new utility APIs in your plugins and app
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

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

## Providing an extension through your plugin

The plugin itself now wants to provide this API and its default implementation, in the form of an API extension. Doing so means that when users install the Example plugin, an instance of the Work utility API will also be automatically available in their apps - both to the Example plugin itself, and to others. We do this in the main plugin package, not the `-react` package.

```tsx title="in @internal/plugin-example"
import {
  createApiExtension,
  createApiFactory,
  createPlugin,
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

const exampleWorkApi = createApiExtension({
  factory: createApiFactory({
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
export default createPlugin({
  id: 'example',
  extensions: [exampleWorkApi],
});
```

For illustration we make a skeleton implementation class and the API extension and factory for it, in the same file. These are not exported to the public surface of the plugin package; only the plugin is, as the default export. Users who install the plugin will now get the utility API automatically as well.

The code also illustrates how the API factory declares a dependency on another utility API - the core storage API in this case. An instance of that utility API is then provided to the factory function.

The resulting extension ID of the work API will be the kind `api:` followed by the plugin ID as the namespace, in this case ending up as `api:plugin.example.work`. Check out [the naming patterns doc](../architecture/08-naming-patterns.md) for more information on how this works. You can now use this ID to refer to the API in app-config and elsewhere.

## Adding configurability

Here we will describe how to amend a utility API with the capability of having extension config, which is driven by [your app-config](../../conf/writing.md). You do this by giving an extension config schema to your API extension factory function. Let's make the required additions to our original work example API.

```tsx title="in @internal/plugin-example"
/* highlight-add-next-line */
import { createSchemaFromZod } from '@backstage/frontend-plugin-api';

const exampleWorkApi = createApiExtension({
  /* highlight-add-start */
  api: workApiRef,
  configSchema: createSchemaFromZod(z =>
    z.object({
      goSlow: z.boolean().default(false),
    }),
  ),
  /* highlight-add-end */
  /* highlight-remove-next-line */
  factory: createApiFactory({
  /* highlight-add-next-line */
  factory: ({ config }) => createApiFactory({
    api: workApiRef,
    deps: { storageApi: storageApiRef },
    factory: ({ storageApi }) => {
      /* highlight-add-start */
      if (config.goSlow) {
        /* ... */
      }
      /* highlight-add-end */
    },
  }),
});
```

We wanted users to be able to set a `goSlow` extension config parameter for our API instances. So we passed in a `configSchema` to `createApiExtension` which matches that interface. This example builds it using [the zod library](https://zod.dev/). The actual extension config values will then be passed in a type safe manner in to the `factory` which is now a callback, wherein we can do what we wish with them. When changing to the callback form, we also had to add a top level `api: workApiRef` under `createApiExtension`.

Note that the expression "extension config" as used here, is _not_ the same thing as the `configApi` which gives you access to the full app-config. The extension config discussed here is instead the particular configuration settings given to your utility API instance. This is discussed more [in the Configuring section](./04-configuring.md).

Note also that the extension config schema contained a default value fo the `goSlow` field. This is an important consideration. You want users of your API to be able to get maximum value out of it, without having to dive deep into how to configure it. For that reason you generally want to provide as many sane defaults as possible, while letting users override them rarely but with purpose, only when called for. If you have an extension config schema without defaults, the framework will refuse to instantiate the utility API on startup unless the user had configured those values explicitly. Since it had a default value, the TypeScript code and interfaces also don't have to defensively allow `undefined` - we know that it'll have either the default value or an overridden value when we start consuming the extension config data.

## Adding inputs

Inputs are added to Utility APIs in the same way as other extension types:

- Declaring a set of `inputs` on your extension
- If needed, create custom extension data types to be used in those inputs
- If needed, export an extension creator function for creating that particular attachment type

This is a power use case and not very commonly used.

<!-- TODO: link to main article -->

## Next steps

See [the Consuming section](./03-consuming.md) to see how to consume this new utility API in various ways. If you wish to configure and add inputs to it, check out [the Configuring section](./04-configuring.md).
