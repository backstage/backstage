---
id: index
title: Building Frontend Plugins
sidebar_label: Overview
# prettier-ignore
description: Building frontend plugins using the new frontend system
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

This section covers how to build your own frontend [plugins](../architecture/15-plugins.md) and
[overrides](../architecture/25-extension-overrides.md). They are sometimes collectively referred to as
frontend _features_, and what you install to build up a Backstage frontend [app](../architecture/10-app.md).

## Creating a new plugin

This guide assumes that you already have a Backstage project set up. Even if you only want to develop a single plugin for publishing, we still recommend that you do so in a standard Backstage monorepo project, as you often end up needing multiple packages. For instructions on how to set up a new project, see our [getting started](../../getting-started/index.md#prerequisites) documentation.

To create a frontend plugin, run `yarn new`, select `plugin`, and fill out the rest of the prompts. This will create a new package at `plugins/<pluginId>`, which will be the main entrypoint for your plugin.

:::info
The created plugin will currently be templated for use in the legacy frontend system, and you will need to replace the existing plugin wiring code.
:::

## The plugin instance

The starting point of a frontend plugin is the `createFrontendPlugin` function, which accepts a single options object as its only parameter. It is imported from `@backstage/frontend-plugin-api`, which is where you will find most of the common APIs for building plugins.

This is how to create a minimal plugin:

```tsx title="in src/plugin.ts"
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

export const examplePlugin = createFrontendPlugin({
  id: 'example',
  extensions: [],
});
```

```tsx title="in src/index.ts"
export { examplePlugin as default } from './plugin';
```

Note that we export the plugin as the default export of our package from `src/index.ts`. This is important, as it is how users of our plugin are able to seamlessly install the plugin package in a Backstage app without having to reference the plugin instance through code.

The plugin ID should be a lowercase dash-separated string, while the plugin instance variable should be the camel case version of the ID with a `Plugin` suffix. For more details on naming patterns within the frontend system, see [the article on naming patterns](../architecture/50-naming-patterns.md). By sticking to these naming patterns you ensure that users of your plugin more easily recognize the exports and features provided by your plugin.

## Adding extensions

The plugin that we created above is empty, and doesn't provide any actual functionality. To add functionality to a plugin you need to create and provide it with one or more [extensions](../architecture/20-extensions.md). Let's continue by adding a standalone page to our plugin, as well as a navigation item that allows users to navigate to the page.

To create a new extension you typically use pre-defined [extension blueprints](../architecture/23-extension-blueprints.md), provided either by the framework itself or by other plugins. In this case we'll use `PageBlueprint` and `NavItemBlueprint`, both from `@backstage/frontend-plugin-api`. We will also need to [create a route reference](../architecture/36-routes.md#creating-a-route-reference) to use as a reference for our page, allowing us to dynamically create URLs that link to our page.

```tsx title="in src/routes.ts"
import { createRouteRef } from '@backstage/frontend-plugin-api';

// Typically all routes are defined in src/routes.ts, in order to avoid circular imports.

// This will be the route reference for our example page. If you want to link
// to the page from somewhere else, you can use this reference to generate the target path.
export const rootRouteRef = createRouteRef();
```

```tsx title="in src/plugin.ts"
import {
  createFrontendPlugin,
  PageBlueprint,
  NavItemBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';

// Note that these extensions aren't exported, only the plugin itself is.
// You can export it locally for testing purposes, but don't export it from the plugin package.
const examplePage = PageBlueprint.make({
  params: {
    routeRef: rootRouteRef,

    // This is the default path of this page, but integrators are free to override it
    defaultPath: '/example',

    // Page extensions are always dynamically loaded using React.lazy().
    // All of the functionality of this page is implemented in the
    // ExamplePage component, which is a regular React component.
    // highlight-next-line
    loader: () =>
      import('./components/ExamplePage').then(m => <m.ExamplePage />),
  },
});

// This nav item is provided to the app.nav extension, and will by default be rendered as a sidebar item
const exampleNavItem = NavItemBlueprint.make({
  params: {
    routeRef: rootRouteRef,
    title: 'Example',
    icon: ExampleIcon, // Custom SvgIcon, or one from the Material UI icon library
  },
});

// The same plugin as above, now with the extensions added
export const examplePlugin = createFrontendPlugin({
  id: 'example',
  extensions: [examplePage, exampleNavItem],
  // We can also make routes available to other plugins.
  // highlight-start
  routes: {
    root: rootRouteRef,
  },
  // highlight-end
});
```

What we've built here is a very common type of plugin. It's a top-level tool that provides a single page, along with a method for navigating to that page. The implementation of the page component, in this case the highlighted `ExamplePage`, can be arbitrarily complex. It can be anything from a single simple information page, to a full-blown application with multiple sub-pages.

We have also provided external access to our route reference by passing it to the plugin `routes` option. This makes it possible for app integrators to bind an external link from a different plugin to our plugin page. You can read more about how this works in the [External Route References](../architecture/36-routes.md#external-route-references) section.

## Utility APIs

Another type of extensions that is commonly used are [Utility APIs](../utility-apis/01-index.md). They can encapsulate shared pieces of functionality of your plugin, for example an API client for a backend service. You can optionally export your Utility API for other plugins to use, or allow integrators to replace the implementation of your Utility API with their own. For details on how to define and provide your own Utility API in your plugin, see the section on [creating Utility APIs](../utility-apis/02-creating.md).

What we'll show here is a complete example of a simple Utility API used only within the plugin itself:

```tsx title="src/api.ts - Defining an interface, API reference, and default implementation"
import { createApiRef } from '@backstage/frontend-plugin-api';

export interface ExampleApi {
  getExample(): { example: string };
}

export const exampleApiRef = createApiRef<ExampleApi>({
  id: 'plugin.example',
});

export class DefaultExampleApi implements ExampleApi {
  getExample(): { example: string } {
    return { example: 'Hello World!' };
  }
}
```

```tsx title="src/components/ExamplePage.tsx - Using the API in our page component"
import { useApi } from '@backstage/frontend-plugin-api';
import { exampleApiRef } from '../api';

export function ExamplePage() {
  // highlight-next-line
  const exampleApi = useApi(exampleApiRef);

  return (
    <div>
      <h1>Example Page</h1>
      <p>Example: {exampleApi.getExample().example}</p>
    </div>
  );
}
```

```tsx title="in src/plugin.ts - Registering a factory for our API"
import { createApiFactory, ApiBlueprint } from '@backstage/frontend-plugin-api';
import { exampleApiRef, DefaultExampleApi } from './api';

// highlight-add-start
const exampleApi = ApiBlueprint.make({
  name: 'example',
  params: {
    factory: createApiFactory({
      api: exampleApiRef,
      deps: {},
      factory: () => new DefaultExampleApi(),
    }),
  },
});
// highlight-add-end

/* Omitted definitions for examplePage, exampleNavItem, and rootRouteRef. */

export const examplePlugin = createFrontendPlugin({
  id: 'example',
  extensions: [
    // highlight-add-next-line
    exampleApi,
    examplePage,
    exampleNavItem,
  ],
  routes: {
    root: rootRouteRef,
  },
});
```

## Plugin specific extensions

There are many different plugins that you can extend with additional functionality through extensions. One such plugin is [the catalog plugin](../../features/software-catalog/), one of the core features of Backstage. It lets you catalog the software in your organization, where each item in the catalog has its own page that can be populated with tools and information relating to that catalog entity. In this example we will explore how our plugin can provide such a tool to display on an entity page.

```tsx title="in src/plugin.ts - An example entity content extension"
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

// Entity content extensions are similar to page extensions in that they are rendered at a route,
// although they also have a title to support in-line navigation between the different content.
// Just like a page extension the content is lazy loaded, and you can also provide a
// route reference if you want to be able to generate a URL that links to the content.
const exampleEntityContent = EntityContentBlueprint.make({
  params: {
    defaultPath: 'example',
    defaultTitle: 'Example',
    loader: () =>
      import('./components/ExampleEntityContent').then(m => (
        <m.ExampleEntityContent />
      )),
  },
});

export const examplePlugin = createFrontendPlugin({
  id: 'example',
  extensions: [
    // highlight-add-next-line
    exampleEntityContent,
    exampleApi,
    examplePage,
    exampleNavItem,
  ],
  routes: {
    root: rootRouteRef,
  },
});
```

The `ExampleEntityContent` itself is again a regular React component where you can implement any functionality you want. To access the entity that the content is being rendered for, you can use the `useEntity` hook from `@backstage/plugin-catalog-react`. You can see a full list of APIs provided by the catalog React library in [the API reference](../../reference/plugin-catalog-react.md).

For a more complete list of the different kinds of extensions that you can create for your plugin, see the [extension blueprints](./03-common-extension-blueprints.md) section.
