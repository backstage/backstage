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

- **Host**: The main frontend application that loads and consumes remote modules. In Backstage, this is your app package (typically `packages/app-next`).
- **Remote**: A separately built module that can be loaded by the host at runtime. In Backstage, these are typically plugin packages built as module federation remotes.

### Shared Dependencies

A critical aspect of module federation is **shared dependencies**. When a host loads remote modules, both need to share common dependencies (like React, React Router, Material-UI) to:

- Avoid loading the same dependency multiple times
- Ensure singleton dependencies (like React) only have one instance
- Enable context sharing between host and remotes

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

## Runtime Usage

To use module federation in your Backstage app, you need to initialize the Module Federation Runtime with the shared dependencies configuration.

### Basic Usage

Here's how to initialize module federation in your app, and load remote modules:

```typescript title="packages/app/src/moduleFederation.ts"
import {
  createInstance,
  ModuleFederation,
} from '@module-federation/enhanced/runtime';
import { buildRuntimeSharedUserOption } from '@backstage/module-federation-common';

export async function initializeModuleFederation(): Promise<ModuleFederation> {
  // Build the shared dependencies configuration
  const { shared, errors } = await buildRuntimeSharedUserOption();

  // Log any errors loading shared dependencies
  if (errors.length > 0) {
    for (const err of errors) {
      console.error(err.message, err.cause);
    }
  }

  // Initialize Module Federation Runtime
  return createInstance({
    name: 'app-next',
    remotes: [
      {
        name: 'my_plugin',
        entry: 'http://localhost:3001/mf-manifest.json',
      },
    ],
    shared,
  });
}

export async function loadRemote(
  instance: ModuleFederation,
  name: string,
): Promise<any> {
  return await instance.loadRemote<any>(name);
}
```

### Integration with Feature Loaders

Integration with frontend feature loaders is straightforward:

```typescript title="packages/app/src/App.tsx"
import { createInstance } from '@module-federation/enhanced/runtime';
import { buildRuntimeSharedUserOption } from '@backstage/module-federation-common';
import { createFrontendFeatureLoader } from '@backstage/frontend-plugin-api';

const moduleFederationInstance = createInstance({
  name: 'app-next',
  remotes: [],
});

const moduleFederationLoader = createFrontendFeatureLoader({
  async loader() {
    moduleFederationInstance.registerShared(
      (await buildRuntimeSharedUserOption()).shared,
    );
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
      'myFirstRemoteWith2Exposes/module1',
    );
    const myFirstRemoteModule2 = await moduleFederationInstance.loadRemote<any>(
      'myFirstRemoteWith2Exposes/module2',
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

The [`dynamicFrontendFeaturesLoader`](https://github.com/backstage/backstage/blob/master/packages/frontend-dynamic-feature-loader/src/loader.ts) provided in the [`@backstage/frontend-dynamic-feature-loader`](https://github.com/backstage/backstage/blob/master/packages/frontend-dynamic-feature-loader/README.md) package, which provides an integrated solution to load module federation remotes as dynamic frontend plugins, is a more complete example of a feature loader based on the module federation support.

## Default Shared Dependencies

Default shared dependencies are the same for both the host and remotes, and the list can be found in the [`@backstage/module-federation-common`](https://github.com/backstage/backstage/blob/master/packages/module-federation-common/src/defaults.ts) package.
