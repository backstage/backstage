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

For information on how to configure feature discovery and other installation options, see [Installing Plugins](../building-apps/05-installing-plugins.md).

## Preparing an App in Phases

Most apps should use `createApp` from `@backstage/frontend-defaults`, which takes care of all app preparation internally. For more advanced use cases there is also a lower-level `prepareSpecializedApp` API in `@backstage/frontend-app-api`.

This API is useful when you need to render a bootstrap tree before the full app can be finalized, for example while waiting for sign-in or other session-dependent state. It gives you access to a bootstrap app tree immediately, lets you either subscribe to finalization with `onFinalized()` or finalize synchronously with `finalize()`, and lets you reuse a prepared session in a later app instance.

```tsx
import {
  FinalizedSpecializedApp,
  prepareSpecializedApp,
} from '@backstage/frontend-app-api';

const preparedApp = prepareSpecializedApp({
  config,
  features: [appPlugin, ...features],
});

const bootstrapApp = preparedApp.getBootstrapApp();

const unsubscribe = preparedApp.onFinalized(
  (finalizedApp: FinalizedSpecializedApp) => {
    console.log(finalizedApp.sessionState);
  },
);
```

The `getBootstrapApp()` method exposes the partial app tree that is available during bootstrap. If you call `onFinalized()`, you are subscribing to the bootstrap-owned finalization flow. In the sign-in case, the sign-in page receives an `onSignInSuccess` callback, and once it provides an identity through that callback the full app is finalized and `onFinalized()` subscribers are notified.

If you instead call `finalize()`, you are taking ownership of finalization yourself. This only works when the app can be finalized synchronously, for example when all predicate context is already available or when you passed a reusable session state to `prepareSpecializedApp()` up front:

```tsx
const preparedApp = prepareSpecializedApp({
  config,
  features: [appPlugin, ...features],
  advanced: {
    sessionState,
  },
});

const app = preparedApp.finalize();
```

When using phased app preparation, `app/root.children` acts as the main session boundary. Conditional extensions behind that boundary are evaluated during finalization. Conditional `app/root.elements` and API branches are also deferred until finalization, while other bootstrap-visible predicates are ignored and reported as warnings.

Utility APIs that are first materialized during bootstrap are frozen for the lifetime of that app instance. Finalization may still add new APIs and may override existing API refs that were not materialized during bootstrap, but any deferred override of an already materialized bootstrap API is ignored and reported as an app error.

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
