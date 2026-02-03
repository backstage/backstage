---
id: app
title: App Instances
sidebar_label: App
description: App instances
---

## The App Instance

The app instance is the main entry point for creating a frontend app. It doesn't do much on its own, but is instead responsible for wiring things together that have been provided as features from other parts of the system.

Below is a simple example of how to create and render an app instance:

```ts
import ReactDOM from 'react-dom/client';
import { createApp } from '@backstage/frontend-defaults';

// Create your app instance
const app = createApp({
  // Features such as plugins can be installed explicitly, but we will explore other options later on
  features: [catalogPlugin],
});

// This creates a React element that renders the entire app
const root = app.createRoot();

// Just like any other React we need a root element. No server side rendering is used.
const rootEl = document.getElementById('root')!;

ReactDOM.createRoot(rootEl).render(root);
```

We call `createApp` to create a new app instance, which is responsible for wiring together all of the features that we provide to the app. It also provides a set of built-in [Extensions](./20-extensions.md) that help build out the foundations of the app, as well as defaults for many other systems such as [Utility API](./33-utility-apis.md) implementations, components, icons, themes, and how to load configuration. No real work is done at the point of creating the app though, it's all deferred to the rendering of the element returned from `app.createRoot()`.

It is possible to explicitly install features when creating the app, although typically these will instead be discovered automatically which we'll explore later on. Nevertheless these features are what build out the actual functionality of the app by providing [Extensions](./20-extensions.md). These extensions are wired together by the app into a tree structure known as the app extension tree. Each node in this tree receives data from its child nodes, and passes along data to its parent. The following diagram illustrates the shape of a small app extension tree.

![frontend system app structure diagram](../../assets/frontend-system/architecture-app.drawio.svg)

Each node in this tree is an extension with a parent node and children. The colored shapes represent extension data inputs and output, where each color is one unique type of data. You can see that there are both extensions that output data that is ignored by the parent, as well as extensions that accept inputs but do not have any children. There are a couple of different tools at your disposal when creating and extension that lets you define different requirements for your inputs and output, which we will cover in greater details in the [Extensions](./20-extensions.md) section.

A common type of data that is shared between extensions is React elements and components. These can in turn be rendered by each other in their own React components, which ends up forming a parallel tree of React components that is similar in shape to that of the app extension tree. At the top of the app extension tree is a built-in root extension that among other things outputs a React element. This element also ends up being the root of the parallel React tree, and is rendered by the React element returned by `app.createRoot()`.

## Feature Discovery

App feature discovery lets you automatically discover and install features provided by dependencies in your app. In practice, it means that you don't need to manually `import` features in code, but they are instead installed as soon as you add them as a dependency in your `package.json`.

Because feature discovery needs to interact with the compilation process, it is only available when using the `@backstage/cli` to build your app. It is hooked into the WebPack compilation process by scanning your app package for compatible dependencies, which are then made part of the app compilation bundle.

To enable frontend feature discovery, add the following configuration to your `app-config.yaml`:

```yaml
app:
  packages: all
```

This will cause all dependencies in your app package to be installed automatically. If this is not desired, you can use include or exclude filters to narrow down the set of packages:

```yaml
app:
  packages:
    # Only the following packages will be included
    include:
      - '@backstage/plugin-catalog'
      - '@backstage/plugin-scaffolder'
---
app:
  packages:
    # All but the following package will be included
    exclude:
      - '@backstage/plugin-catalog'
```

Note that you do not need to manually exclude packages that you also import explicitly in code, since plugin instances are deduplicated by the app. You will never end up with duplicate plugin installations except if they are in fact two different plugin instances with different IDs.

## Plugin Info Resolution

When a plugin is installed in an app it may provide sources of information about the plugin that can be useful to end users and admins. This includes things like what version of a plugin is running, what team owns the plugin, and who to contact for support. You can read more about how the plugins provide this information in the [plugins `info` option section](./15-plugins.md#info).

By default the app will pick a few common fields from `package.json` files, and assume that the opaque manifests are `catalog-info.yaml` files that some information can be gathered from too. This information will then be available via the `info()` method on plugin instances, returning a structure of the `FrontendPluginInfo` type.

### Extending Plugin Info

The default plugin info is intended as a base to build upon. As part of setting up an app you can both customize the way that the plugin info is resolved, as well as extend the `FrontendPluginInfo` type to include more information.

In order to extend the `FrontendPluginInfo` type you use [TypeScript module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation). This makes it possible to extend the `FrontendPluginInfo` interface with additional fields, which you can then add custom resolution logic for as well as access within the app. For example, you might add a `slackChannel` field as follows:

```ts
declare module '@backstage/frontend-plugin-api' {
  interface FrontendPluginInfo {
    /**
     * The slack channel to use for support requests for this plugin.
     */
    slackChannel?: string;
  }
}
```

### Customizing Plugin Info Resolution

With the new `slackChannel` field in place, we now need to provide a custom resolver that knows how to extract this information from the plugin information sources. This is done by passing a custom `pluginInfoResolver` to `createApp`, which in our example is declared like this:

```ts title="pluginInfoResolver.ts"
import { createPluginInfoResolver } from '@backstage/frontend-plugin-api';

// It is recommended to keep the above module augmentation in this file too

export const pluginInfoResolver: FrontendPluginInfoResolver = async ctx => {
  // In our particular example app we assume that all plugin manifests are catalog-info.yaml files
  const manifest = (await ctx.manifest?.()) as Entity | undefined;

  // Call the default resolver to populate common fields
  const { info } = await ctx.defaultResolver({
    packageJson: await ctx.packageJson(),
    manifest: manifest,
  });

  // In this example the catalog model has been extended with a metadata.slackChannel field
  const slackChannel = manifest?.metadata?.slackChannel?.toString();

  if (slackChannel) {
    info.slackChannel = slackChannel;
    info.links = [
      ...(info.links ?? []),
      {
        title: 'Slack Channel',
        url: `https://our-workspace.enterprise.slack.com/archives/${slackChannel}`,
      },
    ];
  }

  return { info };
};
```

And included in the app as follows:

```ts title="App.tsx"
import { pluginInfoResolver } from './pluginInfoResolver';

const app = createApp({
  pluginInfoResolver,
  // ... other options
});
```

### Overriding Plugin Info

Another way to customize the plugin info is to use the `app.pluginOverrides` static configuration key. These overrides are applied after the plugin info has been resolved as a final step before making it available to users. These overrides are particularly useful to override information in third-party plugins. For example, if your organization has an individual team that is responsible for the maintenance of the Software Catalog, you might configure the following override:

```yaml
app:
  pluginOverrides:
    - match:
        pluginId: catalog
      info:
        ownerEntityRefs: [catalog-owners]
```

You can match on both the `pluginId` and/or `packageName` of the plugin, although the `packageName` will only be supported if the plugin provides an loader for the `package.json` file. Using `/<pattern>/` you are also able to use a regex pattern for this matching. For example, if you wanted to override the owner for all plugins from the `@acme` namespace, you could do the following:

```yaml
app:
  pluginOverrides:
    - match:
        packageName: /@acme/.*/
      info:
        ownerEntityRefs: [acme-owners]
```
