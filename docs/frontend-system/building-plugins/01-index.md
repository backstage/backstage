---
id: index
title: Building Frontend Plugins
sidebar_label: Overview
description: Building frontend plugins using the new frontend system
---

This section covers how to build your own frontend [plugins](../architecture/15-plugins.md) and
[overrides](../architecture/25-extension-overrides.md). They are sometimes collectively referred to as
frontend _features_, and what you install to build up a Backstage frontend [app](../architecture/10-app.md).

## Creating a new plugin

This guide assumes that you already have a Backstage project set up. Even if you only want to develop a single plugin for publishing, we still recommend that you do so in a standard Backstage monorepo project, as you often end up needing multiple packages. For instructions on how to set up a new project, see our [getting started](../../getting-started/index.md) documentation.

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
  pluginId: 'example',
  extensions: [],
});
```

```tsx title="in src/index.ts"
export { examplePlugin as default } from './plugin';
```

Note that we export the plugin as the default export of our package from `src/index.ts`. This is important, as it is how users of our plugin are able to seamlessly install the plugin package in a Backstage app without having to reference the plugin instance through code.

The plugin ID should be a lowercase dash-separated string, while the plugin instance variable should be the camel case version of the ID with a `Plugin` suffix. For more details on naming patterns within the frontend system, see [the article on naming patterns](../architecture/50-naming-patterns.md). By sticking to these naming patterns you ensure that users of your plugin more easily recognize the exports and features provided by your plugin.

## Adding extensions

The plugin that we created above is empty, and doesn't provide any actual functionality. To add functionality to a plugin you need to create and provide it with one or more [extensions](../architecture/20-extensions.md). Let's continue by adding a standalone page to our plugin, with a title and icon that appear in the app sidebar.

To create a new extension you typically use pre-defined [extension blueprints](../architecture/23-extension-blueprints.md), provided either by the framework itself or by other plugins. In this case we'll use `PageBlueprint` from `@backstage/frontend-plugin-api`. We will also need to [create a route reference](../architecture/36-routes.md#creating-a-route-reference) to use as a reference for our page, allowing us to dynamically create URLs that link to our page.

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
} from '@backstage/frontend-plugin-api';
import { RiPuzzleLine } from '@remixicon/react';
import { rootRouteRef } from './routes';

// Note that these extensions aren't exported, only the plugin itself is.
// You can export it locally for testing purposes, but don't export it from the plugin package.
const examplePage = PageBlueprint.make({
  params: {
    routeRef: rootRouteRef,

    // This is the default path of this page, but integrators are free to override it
    path: '/example',

    // The title and icon are used to populate the app sidebar automatically
    title: 'Example',
    icon: <RiPuzzleLine />,

    // Page extensions are always dynamically loaded using React.lazy().
    // All of the functionality of this page is implemented in the
    // ExamplePage component, which is a regular React component.
    // highlight-next-line
    loader: () =>
      import('./components/ExamplePage').then(m => <m.ExamplePage />),
  },
});

// The same plugin as above, now with the extensions added
export const examplePlugin = createFrontendPlugin({
  pluginId: 'example',
  extensions: [examplePage],
  // We can also make routes available to other plugins.
  // highlight-start
  routes: {
    root: rootRouteRef,
  },
  // highlight-end
});
```

What we've built here is a very common type of plugin. It's a top-level tool that provides a single page, which the app discovers and links to from the sidebar automatically. The implementation of the page component, in this case the highlighted `ExamplePage`, can be arbitrarily complex. It can be anything from a single simple information page, to a full-blown application with multiple sub-pages.

We have also provided external access to our route reference by passing it to the plugin `routes` option. This makes it possible for app integrators to bind an external link from a different plugin to our plugin page. You can read more about how this works in the [External Route References](../architecture/36-routes.md#external-route-references) section.

## Running a dev server

Each frontend plugin package has a `dev/` folder that is used as the entry point when you run `yarn start`. This is a convenient way to run your plugin in isolation during development. The `@backstage/frontend-dev-utils` package provides a `createDevApp` helper that sets up a minimal app for this purpose:

```tsx title="in dev/index.ts"
import { createDevApp } from '@backstage/frontend-dev-utils';
import myPlugin from '../src';

createDevApp({ features: [myPlugin] });
```

This will create and render a Backstage app with only your plugin installed. If you need to include additional features that your plugin depends on, pass them along in the `features` array. You can also use `bindRoutes` to wire up any external routes that your plugin depends on.

The dev setup is started by running `yarn start` in the plugin directory, which uses the `backstage-cli package start` command. It sets up a local development server with hot reloading, just like a full app.

## Utility APIs

Another type of extensions that is commonly used are [Utility APIs](../utility-apis/01-index.md). They can encapsulate shared pieces of functionality of your plugin, for example an API client for a backend service. You can optionally export your Utility API for other plugins to use, or allow integrators to replace the implementation of your Utility API with their own. For details on how to define and provide your own Utility API in your plugin, see the section on [creating Utility APIs](../utility-apis/02-creating.md).

What we'll show here is a complete example of a simple Utility API used only within the plugin itself:

```tsx title="src/api.ts - Defining an interface, API reference, and default implementation"
import { createApiRef } from '@backstage/frontend-plugin-api';

export interface ExampleApi {
  getExample(): { example: string };
}

export const exampleApiRef = createApiRef<ExampleApi>({
  id: 'plugin.example.api',
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
import { ApiBlueprint } from '@backstage/frontend-plugin-api';
import { exampleApiRef, DefaultExampleApi } from './api';

// highlight-add-start
const exampleApi = ApiBlueprint.make({
  name: 'example',
  params: defineParams =>
    defineParams({
      api: exampleApiRef,
      deps: {},
      factory: () => new DefaultExampleApi(),
    }),
});
// highlight-add-end

/* Omitted definitions for examplePage and rootRouteRef. */

export const examplePlugin = createFrontendPlugin({
  pluginId: 'example',
  extensions: [
    // highlight-add-next-line
    exampleApi,
    examplePage,
  ],
  routes: {
    root: rootRouteRef,
  },
});
```

## Plugin specific extensions

There are many different plugins that you can extend with additional functionality through extensions. One such plugin is [the catalog plugin](../../features/software-catalog/index.md), one of the core features of Backstage. It lets you catalog the software in your organization, where each item in the catalog has its own page that can be populated with tools and information relating to that catalog entity. In this example we will explore how our plugin can provide such a tool to display on an entity page.

```tsx title="in src/plugin.ts - An example entity content extension"
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

// Entity content extensions are similar to page extensions in that they are rendered at a route,
// although they also have a title to support in-line navigation between the different content.
// Just like a page extension the content is lazy loaded, and you can also provide a
// route reference if you want to be able to generate a URL that links to the content.
const exampleEntityContent = EntityContentBlueprint.make({
  params: {
    path: 'example',
    title: 'Example',
    loader: () =>
      import('./components/ExampleEntityContent').then(m => (
        <m.ExampleEntityContent />
      )),
  },
});

export const examplePlugin = createFrontendPlugin({
  pluginId: 'example',
  extensions: [
    // highlight-add-next-line
    exampleEntityContent,
    exampleApi,
    examplePage,
  ],
  routes: {
    root: rootRouteRef,
  },
});
```

The `ExampleEntityContent` itself is again a regular React component where you can implement any functionality you want. To access the entity that the content is being rendered for, you can use the `useEntity` hook from `@backstage/plugin-catalog-react`. You can see a full list of APIs provided by the catalog React library in [the API reference](https://backstage.io/api/stable/modules/_backstage_plugin-catalog-react.index.html).

For a more complete list of the different kinds of extensions that you can create for your plugin, see the [extension blueprints](./03-common-extension-blueprints.md) section.

## Deferred loading

:::note
Deferred loading is experimental, and the details described here may change.
:::

An app that loads your plugin as a [module federation remote](../building-apps/07-module-federation.md#deferred-loading) and enables `app.experimental.deferredRemotes` can defer loading it. So can an app that installs your plugin through [feature discovery](../building-apps/05-installing-plugins.md#deferred-loading) and enables `app.experimental.deferredPackages`, in which case the app build turns your plugin into a remote. A _deferred plugin_ starts out as a stand-in that is built from a manifest, and the real plugin code is loaded the first time one of its pages is visited or one of its elements is rendered. If loading the code fails, for example because of a network error, it is retried a couple of times before an error is shown.

The CLI creates the manifest by analyzing the source code of your plugin without running it. If your plugin is in the workspace of the app, this happens when the app is built or started. When you build your plugin with `backstage-cli package build --module-federation` or `backstage-cli package bundle`, it writes the manifest to `dist/backstage-manifest.json`, next to the module federation manifest. The same file is written to the `dist` folder of your package when it is packed for publishing with `backstage-cli package prepack`, so that published packages carry it. A published package or remote without this file is loaded together with the app.

A plugin can be deferred if its default export is a direct call to `createFrontendPlugin`, and each of its extensions is one of the following:

- An extension made with the `make` method of a blueprint whose factory can be evaluated without running it, see [Deferred loading of blueprint extensions](../architecture/23-extension-blueprints.md#deferred-loading-of-blueprint-extensions). This includes `PageBlueprint`, `SubPageBlueprint`, and the `EntityCardBlueprint` and `EntityContentBlueprint` from `@backstage/plugin-catalog-react/alpha`.
- An extension made with the `makeWithOverrides` method of such a blueprint, as long as its factory does nothing but return `originalFactory({ ... })` with the params, and it only adds a `configSchema`, not `inputs` or `output`. The added config can only be used in the loader of the element.
- A utility API made with `ApiBlueprint.make`. The app registers a stand-in for the API, which loads your plugin the first time the API is used, and then creates the API with your factory. The API ref and its dependencies must be constants created with `createApiRef`, which can be imported from other packages. Code that uses the API must do so through `useApi` while rendering, or through an async API that depends on it. A synchronous lookup with `apis.get`, or a synchronous API that depends on it, fails with an error that asks for the lookup to be made async. See [Lazy API implementations](../utility-apis/02-creating.md#lazy-api-implementations).

The params that the factory of a blueprint outputs, such as `path` and `title`, and the extension `name`, `attachTo`, and `disabled` options, must be literal values or constants that hold literal values, which can be imported from other modules of your package. A `routeRef` param must be one of the route refs in the `routes` of the plugin. Params that are only used to create the element, such as `loader`, can be anything. A param that is output but isn't a literal value, such as the `icon` of a page or sub-page, or an entity card `filter` that is a function or a predicate object rather than a string, prevents the plugin from being deferred. So do extensions made with `createExtension` or with blueprints whose factory can't be evaluated, and an `if` predicate on the plugin or on any of its extensions.

The analysis fails closed: if any of these values can't be read, the plugin is loaded together with the app, and the manifest records the reason in its `notDeferrableReason` field, along with the location in your source code.

The stand-in of an element applies the config in `app.extensions` that the factory of its blueprint outputs as is, such as the `filter` and `type` of an entity card, and the config from the `configSchema` that you add with `makeWithOverrides` is applied once your plugin is loaded. If an app has any other config for an element of your plugin, or a config value of a type that the stand-in can't apply, or an empty string or zero, the plugin is loaded right after the app has started. Config for the pages of your plugin is applied to the stand-in of the page.

## Related topics

The following guides cover cross-cutting concerns for building frontend plugins:

- [Internationalization (i18n)](./07-internationalization.md) — Adding translations to your plugin using `createTranslationRef` and `useTranslationRef`.
- [Plugin Analytics](./08-analytics.md) — Instrumenting user interactions with the Analytics API using `AnalyticsImplementationBlueprint`.
- [Feature Flags](./09-feature-flags.md) — Defining and using feature flags via the `featureFlags` option of `createFrontendPlugin`.
