---
id: migrating
title: Migrating Plugins
sidebar_label: Migration Guide
# prettier-ignore
description: How to migrate an existing frontend plugin to the new frontend system
---

This guide allows you to migrate a frontend plugin and its own components, routes, apis to the new frontend system.

The main concept is that routes, components, apis are now extensions. You can use the appropriate [extension blueprints](../architecture/23-extension-blueprints.md) to migrate all of them to extensions.

## Migrating the plugin

In the legacy frontend system a plugin was defined in its own `plugin.ts` file as following:

```ts title="my-plugin/src/plugin.ts"
  import { createPlugin } from '@backstage/core-plugin-api';

  export const myPlugin = createPlugin({
    id: 'my-plugin',
    apis: [],
    routes: {
      ...
    },
    externalRoutes: {
      ...
    },
  });
```

In order to migrate the actual definition of the plugin you need to recreate the plugin using the new `createFrontendPlugin` utility exported by `@backstage/frontend-plugin-api`.
The new `createFrontendPlugin` function doesn't accept apis anymore as apis are now extensions.

```ts title="my-plugin/src/alpha.ts"
  import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

  export default createFrontendPlugin({
    id: 'my-plugin',
    // bind all the extensions to the plugin
    /* highlight-next-line */
    extensions: [],
    // convert old route refs to the new system
    /* highlight-next-line */
    routes: convertLegacyRouteRefs({
      ...
    }),
    /* highlight-next-line */
    externalRoutes: convertLegacyRouteRefs({
      ...
    }),
  });
```

The code above binds all the extensions to the plugin. _Important_: Make sure to export the plugin as default export of your package as a separate entrypoint, preferably `/alpha`, as suggested by the code snippet above. Make sure `src/alpha.ts` is exported in your `package.json`:

```ts title="my-plugin/package.json"
  "exports": {
    ".": "./src/index.ts",
    /* highlight-add-next-line */
    "./alpha": "./src/alpha.ts",
    "./package.json": "./package.json"
  },
  "typesVersions": {
    "*": {
      /* highlight-add-start */
      "alpha": [
        "src/alpha.ts"
      ],
      /* highlight-add-end */
      "package.json": [
        "package.json"
      ]
    }
  },
```

## Migrating Pages

Pages that were previously created using the `createRoutableExtension` extension function can be migrated to the new Frontend System using the `PageBlueprint` [extension blueprint](../architecture/23-extension-blueprints.md), exported by `@backstage/frontend-plugin-api`.

For example, given the following page:

```ts
export const FooPage = fooPlugin.provide(
  createRoutableExtension({
    name: 'FooPage',
    component: () => import('./components').then(m => m.FooPage),
    mountPoint: rootRouteRef,
  }),
);
```

it can be migrated as the following:

```tsx
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';

const fooPage = PageBlueprint.make({
  params: {
    defaultPath: '/foo',
    // you can reuse the existing routeRef
    // by wrapping into the convertLegacyRouteRef.
    routeRef: convertLegacyRouteRef(rootRouteRef),
    // these inputs usually match the props required by the component.
    loader: ({ inputs }) =>
      import('./components/').then(m =>
        // The compatWrapper utility allows you to use the existing
        // legacy frontend utilities used internally by the components.
        compatWrapper(<m.FooPage />),
      ),
  },
});
```

Then add the `fooPage` extension to the plugin:

```ts title="my-plugin/src/alpha.ts"
  import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

  export default createFrontendPlugin({
    id: 'my-plugin',
    // bind all the extensions to the plugin
    /* highlight-remove-next-line */
    extensions: [],
    /* highlight-add-next-line */
    extensions: [fooPage],
    ...
  });
```

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
import {
  storageApiRef,
  createApiFactory,
  ApiBlueprint,
} from '@backstage/frontend-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';
import { WorkImpl } from './WorkImpl';

const exampleWorkApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: workApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) => new WorkImpl({ storageApi }),
    }),
  },
});
```

Finally, let's add the `exampleWorkApi` extension to the plugin:

```ts title="my-plugin/src/alpha.ts"
  import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

  export default createFrontendPlugin({
    id: 'my-plugin',
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
