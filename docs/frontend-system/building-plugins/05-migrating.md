---
id: migrating
title: Migrating Plugins
sidebar_label: Migration Guide
description: How to migrate an existing frontend plugin to the new frontend system
---

This guide allows you to migrate a frontend plugin and its own components, routes, apis to the new frontend system.

The main concept is that routes, components, apis are now extensions. You can use the appropriate [extension blueprints](../architecture/23-extension-blueprints.md) to migrate all of them to extensions.

## Migrating the plugin

:::note

Unless you are migrating a plugin that is only used within your own project, we recommend all plugins to keep support for the old system intact. The code added in these examples should be added to a new `src/alpha.tsx` entry point of your plugin.

:::

In the legacy frontend system a plugin was defined in its own `plugin.ts` file as following:

```ts title="my-plugin/src/plugin.ts"
  import { createPlugin } from '@backstage/core-plugin-api';

  export const myPlugin = createPlugin({
    id: 'my-plugin',
    apis: [ ... ],
    routes: {
      ...
    },
    externalRoutes: {
      ...
    },
  });
```

In order to migrate the actual definition of the plugin you need to recreate the plugin using the new `createFrontendPlugin` utility exported by `@backstage/frontend-plugin-api`. The new `createFrontendPlugin` function doesn't accept apis anymore as apis are now extensions.

```ts title="my-plugin/src/alpha.tsx"
  import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

  export default createFrontendPlugin({
    // The plugin ID is now provided as `pluginId` instead of `id`
    /* highlight-next-line */
    pluginId: 'my-plugin',
    // bind all the extensions to the plugin
    /* highlight-next-line */
    extensions: [/* APIs will go here, but don't worry about those yet */],
    routes: {
      ...
    },
    externalRoutes: {
      ...
    },
  });
```

The code above binds all the extensions to the plugin. _Important_: Make sure to export the plugin as default export of your package as a separate entrypoint, preferably `/alpha`, as suggested by the code snippet above. Make sure `src/alpha.tsx` is exported in your `package.json`:

```ts title="my-plugin/package.json"
  "exports": {
    ".": "./src/index.ts",
    /* highlight-add-next-line */
    "./alpha": "./src/alpha.tsx",
    "./package.json": "./package.json"
  },
  "typesVersions": {
    "*": {
      /* highlight-add-start */
      "alpha": [
        "src/alpha.tsx"
      ],
      /* highlight-add-end */
      "package.json": [
        "package.json"
      ]
    }
  },
```

## Migrating pages

Keep the legacy route and page exports when adding new frontend system support
to a shared plugin. Convert the route reference for the new plugin entry point
and register it on the new page.

For example, start with this legacy route:

```ts title="my-plugin/src/routes.ts"
import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({ id: 'my-plugin' });
```

The legacy plugin exposes the route and uses it as the page's mount point:

```ts title="my-plugin/src/plugin.ts"
import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const myPlugin = createPlugin({
  id: 'my-plugin',
  routes: { root: rootRouteRef },
});

export const FooPage = myPlugin.provide(
  createRoutableExtension({
    name: 'FooPage',
    component: () => import('./components').then(m => m.FooPage),
    mountPoint: rootRouteRef,
  }),
);
```

If apps mount this page at `/foo`, use `/foo` as the new page's default path.
Apps can customize that path through extension configuration.

Add the new frontend entry point:

```tsx title="my-plugin/src/alpha.tsx"
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';

const convertedRootRouteRef = convertLegacyRouteRef(rootRouteRef);

const fooPage = PageBlueprint.make({
  params: {
    path: '/foo',
    routeRef: convertedRootRouteRef,
    loader: () => import('./components').then(m => <m.FooPage />),
  },
});

export default createFrontendPlugin({
  pluginId: 'my-plugin',
  routes: { root: convertedRootRouteRef },
  extensions: [fooPage],
});
```

The converted reference retains its association with the page's `routeRef`
output. Keep that registration when reusing a legacy reference. Apply the same
conversion to other legacy route references exposed by the new plugin.

### Updating a shared reference to target an extension ID

Once the new page has a stable extension ID, create the shared route reference
with the new frontend API:

```ts title="my-plugin/src/routes.ts"
import { createRouteRef } from '@backstage/frontend-plugin-api';

export const rootRouteRef = createRouteRef({ extensionId: 'page:my-plugin' });
```

Move the conversion to the legacy plugin entry point, using the converted
reference for its `routes` and `mountPoint`:

```ts title="my-plugin/src/plugin.ts"
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { rootRouteRef as rootRouteRefNew } from './routes';

const rootRouteRef = convertLegacyRouteRef(rootRouteRefNew);
```

In the new frontend entry point, import `rootRouteRef` directly from `./routes`
and use it in place of `convertedRootRouteRef`, removing the conversion there.
The conversion preserves object identity, so both entry points share the same
reference. Shared components that still use legacy routing hooks can import
converted references from a separate `legacyRoutes.ts` module.

Keep any route `params` when changing the declaration. For pages with a `name`,
include it in the ID, for example `page:my-plugin/details` for
`PageBlueprint.make({ name: 'details', ... })`.

Keep the new page's `routeRef` registration to support older versions of the
new frontend system, as described in the [release migration guide](../architecture/60-migrations.md#supporting-older-frontend-system-versions).
It is also needed when supporting hybrid conversion utilities such as
`convertLegacyPageExtension`. Converted pages can have
generated or overridden extension IDs. If the reference's target extension is not mounted, its explicit registration provides the fallback mount. Multiple
different fallback mounts for the same target are ambiguous and throw when
that fallback is needed.

A mounted target takes precedence over fallback mounts. A disabled or
conditionally unavailable target can instead resolve through a unique mounted
replacement registering the same reference. For plugins that use only the new frontend
system, follow the [route reference migration](../architecture/60-migrations.md#route-references-target-extension-ids).

## Migrating Components

The equivalent utility to replace components created with `createComponentExtension` depends on the context within which the component is used, typically indicated by the naming pattern of the export. Many of these can be migrated to one of the [existing blueprints](03-common-extension-blueprints.md), but in rare cases it may be necessary to use [`createExtension`](../architecture/20-extensions.md#creating-an-extension) directly.

## Migrating APIs

There are a few things to keep in mind in regards to utility APIs.

### React package interface and ref changes

Let's begin with [your `-react` package](../../architecture-decisions/adr011-plugin-package-structure.md). The act of exporting TypeScript interfaces and API refs have not changed from the old system. You can typically keep those as-is. For illustrative purposes, this is an example of an interface and its API ref:

```tsx title="in @internal/plugin-example-react"
import { createApiRef } from '@backstage/frontend-plugin-api';

/**
 * Performs some work.
 * @public
 */
export interface WorkApi {
  doWork(): Promise<void>;
}

/**
 * The work interface for the Example plugin.
 * @public
 */
export const workApiRef = createApiRef<WorkApi>({
  id: 'plugin.example.work',
});
```

Note at the top of the file that it uses the updated import from `@backstage/frontend-plugin-api` that we migrated in the previous section, instead of the old `@backstage/core-plugin-api`.

Now let's migrate the implementation of the api. Before we changed the `core-plugin-api` imports the api would have looked somewhat similar to the following:

```tsx title="in @internal/plugin-example, NOTE THIS IS LEGACY CODE"
import { storageApiRef, createApiFactory } from '@backstage/core-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';
import { WorkImpl } from './WorkImpl';

const exampleWorkApi = createApiFactory({
  api: workApiRef,
  deps: { storageApi: storageApiRef },
  factory: ({ storageApi }) => new WorkImpl({ storageApi }),
});
```

The major changes we'll make are

- Change the old `@backstage/core-plugin-api` imports to the new `@backstage/frontend-plugin-api` package as per the top section of this guide
- Wrap the existing API factory in a `ApiBlueprint`

The end result, after simplifying imports and cleaning up a bit, might look like this:

```tsx title="in @internal/plugin-example"
import { storageApiRef, ApiBlueprint } from '@backstage/frontend-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';
import { WorkImpl } from './WorkImpl';

const exampleWorkApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: workApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) => new WorkImpl({ storageApi }),
    }),
});
```

Finally, let's add the `exampleWorkApi` extension to the plugin:

```ts title="my-plugin/src/alpha.tsx"
  import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

  export default createFrontendPlugin({
    pluginId: 'my-plugin',
    // bind all the extensions to the plugin
    /* highlight-remove-next-line */
    extensions: [fooPage],
    /* highlight-add-next-line */
    extensions: [exampleWorkApi, fooPage],
    ...
  });
```

### Further work

Since utility APIs are now complete extensions, you may want to take a bigger look at how they used to be used, and what the new frontend system offers. You may for example consider [adding configurability or inputs](../utility-apis/02-creating.md) to your API, if that makes sense for your current application.
