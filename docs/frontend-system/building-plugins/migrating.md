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

Let's imagine we have the following API:

```ts
const myApi = createApiFactory(myApiRef, new SampleMyApi());
```

you can transform the API above to an extension using the `createApiExtension` creator:

```ts
export const myApi = createApiExtension({
  factory: createApiFactory(myApiRef, new SampleMyApi()),
});
```

## Plugin

In the legacy frontend system a plugin was defined in its own `plugin.ts` file as following:

```ts title="my-plugin/src/plugin.ts"
  import { createPlugin } from '@backstage/core-plugin-api';

  export const myPlugin = createPlugin({
    id: 'my-plugin',
    apis: [myApi],
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
    extensions: [homePage, myApi],
    routes: {
      ...
    },
    externalRoutes: {
      ...
    },
  });
```

The code above binds all the extensions to the plugin. _Important_: Make sure to export the plugin as default export of your package in `src/index.ts`.
