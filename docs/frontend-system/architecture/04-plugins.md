---
id: plugins
title: Frontend Plugins
sidebar_label: Plugins
# prettier-ignore
description: Frontend plugins
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

In addition to the existing [`plugins`](../../plugins/index.md) documentation let's take a look at what changes for plugins in the new frontend system. If you already created a plugin yourself you will recognise a lot of similarity in the new architecture with the existing one.

Backstage is a single-page application composed of a set of plugins. Each of this plugins should solve exactly one responsibility & follow our suggested [plugin package structure & naming](../../architecture-decisions/adr011-plugin-package-structure.md).

For frontend plugins each plugin should only export a single plugin instance. The new frontend system can detect plugins, if they are exported as `default`, from the plugin package. This is also possible during runtime allowing you to add plugins to your Backstage instance without requiring a restart.

## Creating a Plugin

A plugin is can easily be created, it only requires a plugin `id`:

```ts title="plugins/tech-radar/src/index.ts"
export const techRadarPlugin = createPlugin({
  id: 'tech-radar',
});
```

The created plugin does not yet do anything, it will need some plugin options to be useful:

- Extend it's functionality, through pages, navigation items or entity cards, using `extensions`
- You can make it reachable through `routes`
- Link to other plugins in Backstage using `externalRoutes`
- Pass `featureFlags` to it

### Plugin ID

You will decide on the `id` when you [create a plugin](../../). The plugin `id` should follow the respective [naming pattern](./08-naming-patterns.md#plugins) of the new frontend system. To give you an example the GraphiQL plugin has the `id` `tech-radar` & as it follows the naming convention we know that the `techRadarPlugin` is the symbol for the default package export containing the plugin.

### Plugin Extensions

So let's make our plugin a bit more useful! Imagine we want to have a TechRadar plugin that displays the recommended technologies at our organisation, [just like in the Backstage demo instance](https://demo.backstage.io/tech-radar). We want the plugin to be displayed on a page & have a navigation item directing to it. This can be achieved by creating a page extension & a navigation item extension. When adding those to the plugin they will be imported with the plugin package & can be discovered.

```ts title="plugins/tech-radar/src/index.ts"
export const techRadarPlugin = createPlugin({
  id: 'tech-radar',
  extensions: [techRadarPage, techRadarNavItem],
});
```

### Plugin Routes

Now that we have a page extension in our plugin the route of the page is detected & the page is available. Thought to make the route easy accessible through the plugin you are required to additionally add those routes on the plugin level. If we have a `techRadarRootRef`, that is the route reference for the `techRadarPage`, we would add it to `createPlugin` like the following:

```ts title="plugins/tech-radar/src/index.ts"
export const techRadarPlugin = createPlugin({
  id: 'tech-radar',
  extensions: [techRadarPage, techRadarNavItem],
  routes: {
    root: techRadarRootRef,
  },
});
```

### Plugin External Routes

For referencing pages outside of the current plugin `externalRoutes` can be provided. Through this it is possible to map those route refs inside the plugin to the routes outside of the plugin. Your configuration might look something like this, where the `externalRouteRef` is the external link to a page outside of the plugin that can be reconfigured.

```ts title="plugins/tech-radar/src/routes.ts"
export const externalRouteRef = createExternalRouteRef({
  id: 'external-component',
  optional: true,
});
```

```ts title="plugins/tech-radar/src/index.ts"
export const techRadarPlugin = createPlugin({
  id: 'tech-radar',
  extensions: [techRadarPage, techRadarNavItem],
  routes: {
    root: techRadarRootRef,
  },
  externalRoutes: [
    {
      external: externalRouteRef,
    },
  ],
});
```

A route ref to an external route can be than used just like an internal route ref.

```tsx title="plugins/tech-radar/src/components/SomePage.tsx"
...
const SomePage = createPageExtension({
  ...
  loader: async () => {
    const Component = () => {
      const externalLink = useRouteRef(externalRouteRef);

      ...
      return (
        ...
        <Link to={externalLink()}>External Page</Link>
        ...
      );
    }
    return <Component />;
  }
...
```

#### External Routes Configuration

Something special with the external routes is, that they will be discovered and can be configured directly through the `app-config.yaml` outside of the specific plugin context. Imagine that the TechRadar has an external route that links to a documentation on the TechRadar. You could configure the external route like the following:

```yaml title="app-config.yaml"
app:
  routes:
    bindings:
      plugin.techRadar.externalRoutes.external: plugin.other.routes.docOnTechRadar
```

### Plugin Feature Flags

With the `featureFlags` array we can pass feature flags into the plugin. Imagine you are planning to update your TechRadar, but you only want to allow people with the `show-future-tech` flag to see the current draft to give feedback. Your plugin could expect the flag like the following:

```ts title="plugins/tech-radar/src/index.ts"
export const techRadarPlugin = createPlugin({
  id: 'tech-radar',
  extensions: [techRadarPage, techRadarNavItem],
  featureFlags: [{ showFutureTech: 'show-future-tech' }],
});
```

Now the feature flag can be consumed inside of the plugin using the `FeatureFlagsApi`.

## Installing a Plugin in an App

For a more detailed introduction to the architecture of the app & how plugins fit in there please refer to [the "app" documentation](./02-app.md). There are 2 ways to install a plugin in the new frontend system.

### Package Discovery

As mentioned in the beginning of this documentation each plugin should be exported by default from an individual package. The default exported plugins will be discovered in the frontend system. If they are not actively disabled in the `app-config.yaml` & the `app.experimental.packages` rule does not exclude them, the plugins will be installed in the app by default. more on this

### Manual installation

If you don't want to your plugins to be detected automatically you can deactivate this by setting `app.experimental.packages` `include` or `exclude` property to the plugins you want to have included/excluded. If the package is not discovered it can still be installed like the following:

```ts title="app/App.tsx"
const app = createApp({
  features: [
    techRadarPlugin,
    ...
  ],
  ...
});
```

It will be discovered & included in the build. Still it can deactivated through config.
