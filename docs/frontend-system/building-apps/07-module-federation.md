---
id: module-federation
title: Module Federation
sidebar_label: Module Federation
description: Using Module Federation in Backstage
---

## Introduction

Module Federation is a feature that enables sharing code and dependencies between separately built JavaScript applications at runtime. In Backstage, module federation support allows you to:

- Build your frontend application as a **module federation host** that can load remote modules at runtime
- Package individual plugins or bundles of several plugins as **module federation remotes** that can be loaded dynamically
- Share dependencies efficiently between the host and remotes to avoid code duplication

This guide explains how to configure and build both module federation hosts and remotes in Backstage, and how to initialize module federation at runtime using the standard Module Federation Runtime API.

## Overview

### Module Federation Host vs Remotes

In module federation terminology:

- **Host**: The main frontend application that loads and consumes remote modules. In Backstage, this is your app package (typically `packages/app`).
- **Remote**: A separately built module that can be loaded by the host at runtime. In Backstage, these are typically plugin packages built as module federation remotes.

### Shared Dependencies

A critical aspect of module federation is **shared dependencies**. When a host loads remote modules, both need to share common dependencies (like React, React Router, Material-UI) in order to ensure singleton dependencies only have one instance.

Backstage provides a list of default shared dependencies for common packages like React, React Router, and Material-UI. At build-time the `version` field is automatically resolved from your `package.json` files.

## Building the Module Federation Host

The module federation host is your main frontend application. By default, Backstage frontend applications include a default list of module federation shared dependencies.

When building and bundling the frontend application, the CLI automatically:

1. Resolves versions of the shared dependencies based on the monorepo dependencies
2. Adds an additional entrypoint to the frontend application bundle with the list of resolved runtime shared dependencies

## Building Module Federation Remotes

Plugin packages can be built as module federation remotes, allowing them to be loaded dynamically by a host application.

### Using the CLI

To build a plugin as a module federation remote, use the `--module-federation` option with the `package build` command:

```bash
cd plugins/my-plugin
yarn build --module-federation
```

### Build Output

When building a plugin as a module federation remote, the CLI:

1. Resolves versions of the shared dependencies based on the monorepo dependencies (done automatically by the Rspack/Webpack module federation plugin)
2. Produces the bundle assets in the `dist` folder, including:
   - a `mf-manifest.json` file which contains the module federation manifest
   - a `remoteEntry.js` file which is the main entrypoint for the remote module
   - a `frontend-manifest.json` file which describes the frontend plugins and modules that the remote exposes, which lets an app [defer loading them](#deferred-loading)

The `package bundle` command builds frontend plugins the same way, so its output includes these files too.

## Runtime Usage

To use module federation in your Backstage app, you need to initialize the Module Federation Runtime with the shared dependencies configuration.

### Basic Usage

Here's how to initialize module federation in your app, and load remote modules:

```typescript title="packages/app/src/moduleFederation.ts"
import {
  createInstance,
  ModuleFederation,
} from '@module-federation/enhanced/runtime';
import { loadModuleFederationHostShared } from '@backstage/module-federation-common';

export async function initializeModuleFederation(): Promise<ModuleFederation> {
  return createInstance({
    name: 'app',
    remotes: [
      {
        name: 'my_plugin',
        entry: 'http://localhost:3001/mf-manifest.json',
      },
    ],
    shared: await loadModuleFederationHostShared(),
  });
}

export async function loadRemote(
  instance: ModuleFederation,
  name: string,
): Promise<any> {
  return await instance.loadRemote<any>(name);
}
```

The `loadModuleFederationHostShared` function loads all shared dependencies in parallel and returns them in the format expected by the Module Federation Runtime. By default it will throw if any shared dependency fails to load. You can pass an `onError` callback to handle errors gracefully instead:

```typescript
const shared = await loadModuleFederationHostShared({
  onError: error => console.error(error.message, error.cause),
});
```

### Integration with Feature Loaders

Standard Module Federation runtime API integrates very well with frontend feature loaders,
as shown in the example below:

```typescript title="packages/app/src/loader.tsx"
import { createInstance } from '@module-federation/enhanced/runtime';
import { loadModuleFederationHostShared } from '@backstage/module-federation-common';
import { createFrontendFeatureLoader } from '@backstage/frontend-plugin-api';

export const moduleFederationLoader = createFrontendFeatureLoader({
  async loader() {
    const moduleFederationInstance = createInstance({
      name: 'app',
      remotes: [],
      shared: await loadModuleFederationHostShared(),
    });
    moduleFederationInstance.registerRemotes([
      {
        name: 'myFirstRemoteWith2ExposedModules',
        entry:
          'https://someCDN.org/myFirstRemoteWith2ExposedModules/mf-manifest.json',
      },
      {
        name: 'mySecondRemote',
        entry: 'https://someCDN.org/mySecondRemote/mf-manifest.json',
      },
    ]);
    const myFirstRemoteModule1 = await moduleFederationInstance.loadRemote<any>(
      'myFirstRemoteWith2ExposedModules/module1',
    );
    const myFirstRemoteModule2 = await moduleFederationInstance.loadRemote<any>(
      'myFirstRemoteWith2ExposedModules/module2',
    );
    const mySecondRemoteModule = await moduleFederationInstance.loadRemote<any>(
      'mySecondRemote',
    );
    return [
      myFirstRemoteModule1.default,
      myFirstRemoteModule2.default,
      mySecondRemoteModule.default,
    ];
  },
});

const app = createApp({
  features: [moduleFederationLoader],
});

export default app.createRoot();
```

Note that, on top of the standard API, we plan to provide a more simplified way to configure module federation remotes.

Additionally, the [`dynamicFrontendFeaturesLoader`](https://github.com/backstage/backstage/blob/master/packages/frontend-dynamic-feature-loader/src/loader.ts) provided in the [`@backstage/frontend-dynamic-feature-loader`](https://github.com/backstage/backstage/blob/master/packages/frontend-dynamic-feature-loader/README.md) package, which provides an integrated solution to load module federation remotes as dynamic frontend plugins, is a more complete example of a feature loader based on the module federation support.

## Deferred loading

:::note
Deferred loading is experimental, and the details described here may change.
:::

An app that loads remotes with the `dynamicFrontendFeaturesLoader` can defer loading the plugins of the remotes until they are used, rather than loading all of them before the app starts. This is enabled with the `app.experimental.deferredRemotes` config:

```yaml title="app-config.yaml"
app:
  experimental:
    deferredRemotes: true
```

The app then installs a stand-in for each plugin that supports deferred loading, and loads the exposed module of the plugin from its remote the first time one of its pages is visited or one of its elements is rendered. If loading the module fails, for example because of a network error, it is retried a couple of times before an error is shown.

Whether a plugin supports deferred loading is decided when its remote is built, by analyzing its source code. The result is written to the `frontend-manifest.json` file of the remote, which the dynamic features backend serves together with the remote. See [Deferred loading](../building-plugins/01-index.md#deferred-loading) for which plugins can be deferred. Remotes without this file, modules, and plugins that can't be deferred are loaded before the app starts, as before.

To always load the plugins of some remotes before the app starts, list their package names in `exclude`:

```yaml title="app-config.yaml"
app:
  experimental:
    deferredRemotes:
      exclude:
        - '@internal/plugin-my-plugin'
```

A plugin that you pass to `createApp` in the `features` option is used instead of a deferred plugin with the same plugin ID. If you pass a module for a deferred plugin, that plugin is loaded before the app starts so that the module applies to it.

If you have any config in `app.extensions` for an element of a deferred plugin, such as a sub-page, the plugin is loaded right after the app has started, since the config can only be applied once the plugin is loaded. Config for the pages of a plugin does not have this effect.

## Default Shared Dependencies

Default shared dependencies are the same for both the host and remotes, and the list can be found in the [`@backstage/module-federation-common`](https://github.com/backstage/backstage/blob/master/packages/module-federation-common/src/defaults.ts) package.
