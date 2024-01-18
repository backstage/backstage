---
id: plugins
title: Frontend Plugins
sidebar_label: Plugins
# prettier-ignore
description: Frontend plugins
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

In addition to the existing [`plugins`](../../plugins/index.md) documentation we now want to take a look at plugins in the new frontend system. If you already created a plugin yourself you will recognise a lot of similarity in the new architecture with the existing one.

Backstage is a single-page application composed of a set of plugins. Each of this plugins should solve exactly one responsibility & follow our suggested [plugin package structure & naming](../../architecture-decisions/adr011-plugin-package-structure.md).

For frontend plugins each plugin should only export a single plugin instance. The new frontend system can detect plugins, if they are exported as `default`, from the plugin package. This is also possible during runtime allowing you to add plugins to your Backstage instance without requiring a restart.

## Creating a Plugin

A plugin is can easily be created, it only requires a plugin `id`:

```ts
export const techRadarPlugin = createPlugin({
  id: 'tech-radar',
});
```

The created plugin does not yet do anything, it will need some plugin options to be usefull. You can make it reachable through `routes`, link to other parts inside Backstage using `externalRoutes`, provide it `featureFlags` and most importantly give it functionallty, like pages, navigation items or entity cards, through `extensions`.

### Plugin ID

You will decide on the `id` when you [create a plugin](../../). The plugin `id` should follow the respective [naming pattern](./08-naming-patterns.md#plugins) of the new frontend system. To give you an example the GraphiQL plugin has the `id` `tech-radar` & as it follows the naming convention we know that the `techRadarPlugin` is the symbol for the default package export containing the plugin.

### Plugin Extensions

So let's make our plugin a bit more useful! Imagine we want to have a TechRadar plugin that displays the recommended technologies at our organisation, [just like in the Backstage demo instance](https://demo.backstage.io/tech-radar). We want the plugin to be displayed on a page & have a navigation item directing to it. This can be achieved by creating a page extension & a navigation item extenssion. When adding those to the plugin they will be imported with the plugin package & can be discovered.

```ts
export const techRadarPlugin = createPlugin({
  id: 'tech-radar',
  extensions: [techRadarPage, techRadarNavItem],
});
```

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

### Plugin Routes

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

```ts
export const myPlugin = createPlugin({
  id: 'my-plugin',
});
```

### Plugin External Routes

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

### Plugin Feature Flags

<!--

 - Example of how this option is used in `createPlugin`

link to relevant docs

-->

## Installing a Plugin in an App

<!--

Quick intro, but link back to app docs for more details

 -->
