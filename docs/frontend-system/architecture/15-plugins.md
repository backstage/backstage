---
id: plugins
title: Frontend Plugins
sidebar_label: Plugins
description: Frontend plugins
---

## Introduction

Frontend plugins are a foundational building block in Backstage and the frontend system. They are used to encapsulate and provide functionality for a Backstage app, such as new pages, navigational elements, and APIs; as well as extensions and features for other plugins, such as entity page cards and content for the Software Catalog, or result list items for the search plugin.

Each plugin is typically shipped in a separate NPM package, whether that's a published package, or just in the local workspace. The plugin instance should always the `default` export of the package, either via the main entry-point or the `/alpha` sub-path export. Each plugin package is limited to exporting a single plugin instance. In a local workspace you could use a different structure if preferred, but this is considered a non-standard layout and should be avoided in published packages.

## Creating a Plugin

Frontend plugin instances are created with the `createFrontendPlugin` function, which is provided by the `@backstage/frontend-plugin-api` package. It takes a single options object that provides all of the necessary configuration for the plugin. In particular you will want to provide [extensions](./20-extensions.md) for your plugin, as that is the way that you can provide new functionality to the app.

```tsx
// This creates a new extension, see "Extension Blueprints" documentation for more details
const myPage = PageBlueprint.make({
  params: {
    path: '/my-page',
    loader: () => import('./MyPage').then(m => <m.MyPage />),
  },
});

export default createFrontendPlugin({
  pluginId: 'my-plugin',
  extensions: [myPage],
});
```

### `pluginId` option

Each plugin needs an ID, which is used to uniquely identify the plugin within an entire Backstage system. The ID does not have to be globally unique across all of the NPM ecosystem, although you generally want to strive for that. It is not possible to install multiple plugins with the same ID in a single Backstage app.

The plugin ID should generally be part of the of the package name and use kebab-case. See both the [frontend naming patterns section](./50-naming-patterns.md), as well as the [package metadata section](../../tooling/package-metadata.md#name) for more information.

### `extensions` option

These are the [extensions](./20-extensions.md) that the plugin provides to the app. Note that you should not export any of these extensions separately from the plugin package, as they can already by accessed via the `getExtension` method of the plugin instance using the extension ID.

The extensions that you provide to a plugin will have their `namespace` set to the plugin ID by default. For example, if you create an extension using the `PageBlueprint` without any particular naming options and install that via a plugin with the ID `my-plugin`, the final extension ID will be `page:my-plugin`. You can read more about how this works in the [extension structure documentation](./20-extensions.md#extension-structure).

### `routes` and `externalRoutes` options

These are the routes that the plugin exposes to the app. The `routes` option declares all of the target routes that your plugin provides, i.e. routes that other plugins link to. The `externalRoutes` option instead declares all the outgoing routes, i.e. routes that your plugins links to, which you can bind to the `routes` of other plugins. See the [routes documentation](./36-routes.md) for more information how to set up cross-plugin navigation.

### `featureFlags` option

This is a list of feature flag declarations that your plugin provides to the app. This makes sure that the feature flags are correctly registered and can be toggled in the app. To read a feature flag you can use the feature flags [Utility API](../architecture/33-utility-apis.md), accessible via `featureFlagsApiRef`.

### `info` option

This options is used to provide loaders for different sources of information about the plugin that may be useful to users and admins. The two available loaders are `packageJson` and `manifest`, and a plugin can use either or both as needed. The resulting information is available via the `info()` method on the plugin instance once it is installed in an app, but it is up to each app to decide how to derive the information from the provided sources.

The `info.packageJson` loader **MUST** be used by all plugins that are implemented within their own package, and it should load the `package.json` file for the plugin package. Typical usage looks like this:

```ts
export default createFrontendPlugin({
  pluginId: 'my-plugin',
  info: {
    packageJson: () => import('../package.json'),
  },
  extensions: [...],
});
```

The `info.manifest` loader is used to point to an opaque plugin manifest. This **MUST ONLY** be used by plugins that are intended for use within a single organization. Plugins that are published to an open package registry should **NOT** use this loader. The loader is useful for adding additional internal metadata associated with the plugin, and it is up to the Backstage app to decide how these manifests are parsed and used. The default manifest parser in an app created with `createApp` from `@backstage/frontend-defaults` is able to parse the default `catalog-info.yaml` format and built-in fields such as `metadata.links` and `spec.owner`.

Typical usage looks like this:

```ts
export default createFrontendPlugin({
  pluginId: '...',
  info: {
    manifest: () => import('../catalog-info.yaml'),
  },
});
```

## Installing a Plugin in an App

A plugin instance is considered a frontend feature and can be installed directly in any Backstage frontend app. See the [app documentation](./10-app.md) for more information about the different ways in which you can install new features in an app.

## Overriding a Plugin

A plugin might not always behave exactly the way you want. It could be that you want to remove particular extensions, decorate them a bit, replace them with your own, or simply add new ones. Regardless of your exact use-case, you can use the `plugin.withOverrides` method to create a new copy of the plugin with the desired changes. When doing so you can also access the original extensions provided by the plugin, and use the [extension override](./25-extension-overrides.md) API to make changes to individual extensions:

```tsx
import plugin from '@backstage/plugin-catalog';

export default plugin.withOverrides({
  // These overrides are merged with the original extensions
  extensions: [
    // Override the catalog nav item to use a custom icon
    plugin.getExtension('nav-item:catalog').override({
      factory: origFactory => [
        NavItemBlueprint.dataRefs.target({
          ...origFactory().get(NavItemBlueprint.dataRefs.target),
          icon: CustomCatalogIcon,
        }),
      ],
    }),
    // Override the catalog index page with a completely custom implementation
    PageBlueprint.make({
      params: {
        path: '/catalog',
        routeRef: plugin.routes.catalogIndex,
        loader: () => import('./CustomCatalogIndexPage').then(m => <m.Page />),
      },
    }),
  ],
});
```

You can keep the plugin override in your app package, but it can often be a good idea to separate it out into its own package, especially if the overrides are complex or you want distinct ownership of the override. For example, if you are overriding the `@backstage/plugin-catalog` plugin, you might create a new package called `@internal/plugin-catalog` at `plugins/catalog` in your workspace, which exports the overridden plugin instance.
