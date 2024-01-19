---
id: migrating
title: Migrating an existing Frontend Plugin to the New Frontend System
sidebar_label: Migration Guide
# prettier-ignore
description: How to migrate an existing frontend plugin to the new frontend system
---

This guide allows you to migrate a frontend plugin and its own components, routes, apis to the new frontend system.

The main concept is that routes, components, apis are now extensions. You can use the appropriate extension creators to migrate all of them to extensions.

## Pages

Pages that were previously created using the `createRoutableExtension` extension function can be migrated to the new Frontend System using the `createPageExtension` extension creator, exported by `@backstage/frontend-plugin-api`.

For example, given the following page:

```ts
export const HomepageRoot = homePlugin.provide(
  createRoutableExtension({
    name: 'HomepageRoot',
    component: () => import('./components').then(m => m.HomepageRoot),
    mountPoint: rootRouteRef,
  }),
);
```

it can be migrated as the following:

```tsx
const homePage = createPageExtension({
  defaultPath: '/home',
  // you can reuse the existing routeRef
  // by wrapping into the convertLegacyRouteRef.
  routeRef: convertLegacyRouteRef(rootRouteRef),
  // these inputs usually match the props required by the component.
  inputs: {
    props: createExtensionInput(
      {
        children: coreExtensionData.reactElement.optional(),
        title: titleExtensionDataRef.optional(),
      },

      {
        singleton: true,
        optional: true,
      },
    ),
  },
  loader: ({ inputs }) =>
    import('./components/').then(m =>
      // The compatWrapper utility allows you to use the existing
      // legacy frontend utilities used internally by the components.
      compatWrapper(
        <m.HomepageCompositionRoot
          // make sure to properly map the inputs defined above
          children={inputs.props?.output.children}
          title={inputs.props?.output.title}
        />,
      ),
    ),
});
```

## Components

TODO

## APIs

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

In this example, the plugin ID already follows the [Frontend System Naming Patterns](../architecture/naming-patterns). If it doesn't, you may want to consider renaming that ID at this point. Don't worry, this won't hurt consumers in the old frontend system since the ID is mostly used for debugging purposes there. In the new system, it's much more important and appears in app-config files and similar.

Note at the top of the file that it uses the updated import from `@backstage/frontend-plugin-api` that we migrated in the previous section, instead of the old `@backstage/core-plugin-api`.

### Plugin package changes

Now let's turn to the main plugin package where the plugin itself is exported. You will probably already have a `createPlugin` call in here. Before we changed the `core-plugin-api` imports it'll have looked somewhat similar to the following:

```tsx title="in @internal/plugin-example, NOTE THIS IS LEGACY CODE"
import {
  storageApiRef,
  createPlugin,
  createApiFactory,
} from '@backstage/core-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';
import { WorkImpl } from './WorkImpl';

const exampleWorkApi = createApiFactory({
  api: workApiRef,
  deps: { storageApi: storageApiRef },
  factory: ({ storageApi }) => new WorkImpl({ storageApi }),
});

/** @public */
export const catalogPlugin = createPlugin({
  id: 'example',
  apis: [exampleWorkApi],
});
```

The major changes we'll make are

- Optionally change the old imports to the new package as per the top section of this guide
- Wrap the existing API factory in a `createApiExtension`
- Change to the new version of `createPlugin` which exports this extension
- Change the plugin export to be the default instead

The end result, after simplifying imports and cleaning up a bit, might look like this:

```tsx title="in @internal/plugin-example"
import {
  storageApiRef,
  createPlugin,
  createApiFactory,
  createApiExtension,
} from '@backstage/frontend-plugin-api';
import { workApiRef } from '@internal/plugin-example-react';
import { WorkImpl } from './WorkImpl';

const exampleWorkApi = createApiExtension({
  factory: createApiFactory({
    api: workApiRef,
    deps: { storageApi: storageApiRef },
    factory: ({ storageApi }) => new WorkImpl({ storageApi }),
  }),
});
```

### Further work

Since utility APIs are now complete extensions, you may want to take a bigger look at how they used to be used, and what the new frontend system offers. You may for example consider [adding configurability or inputs](../utility-apis/02-creating.md) to your API, if that makes sense for your current application.

## Plugin

In the legacy frontend system a plugin was defined in its own `plugin.ts` file as following:

```ts title="my-plugin/src/plugin.ts"
  import { createPlugin } from '@backstage/core-plugin-api';

  export const myPlugin = createPlugin({
    id: 'my-plugin',
    apis: [exampleWorkApi],
    routes: {
      ...
    },
    externalRoutes: {
      ...
    },
  });
```

In order to migrate the actual definition of the plugin you need to recreate the plugin using the new `createPlugin` utility exported by `@backstage/frontend-plugin-api`.
The new `createPlugin` function doesn't accept apis anymore as apis are now extensions.

```ts title="my-plugin/src/index.ts"
  import { createPlugin } from '@backstage/frontend-plugin-api';

  export default createPlugin({
    id: 'my-plugin',
    // bind all the extensions to the plugin
    /* highlight-next-line */
    extensions: [homePage, exampleWorkApi],
    routes: {
      ...
    },
    externalRoutes: {
      ...
    },
  });
```

The code above binds all the extensions to the plugin. _Important_: Make sure to export the plugin as default export of your package in `src/index.ts`.
