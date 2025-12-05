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

Backstage provides a list of default shared dependencies and allows you to configure additional ones at multiple levels.

### Configuration Levels and Merging

Module federation shared dependencies can be configured at three levels:

1. **Default Configuration**: Backstage provides default shared dependencies for common packages like React, React Router, and Material-UI
2. **Build-time Configuration**: when building, configuration can be provided for both the host and remotes to specify additional shared dependencies, update properties of some default shared dependency or even remove it. At build-time the `version` field is automatically resolved from your `package.json` files.
3. **Runtime Configuration** (Host Only): The host can override shared dependencies via runtime application configuration files, using the same configuration schema as the build-time configuration. Runtime configuration cannot add new shared dependencies because:
   - versions need to be resolved at build time
   - related packages need to be bundled into the host frontend application bundle during the build

## Building the Module Federation Host

The module federation host is your main frontend application. By default, Backstage frontend applications include a default list of module federation shared dependencies.

### Build-time Configuration

You can override the default shared dependencies list using the `app.moduleFederation.sharedDependencies` configuration in your `app-config.yaml`:

```yaml
app:
  moduleFederation:
    sharedDependencies:
      # Override a default shared dependency
      '@emotion/react':
        eager: false

      # Remove a default shared dependency
      '@emotion/react': false

      # Add a new shared dependency
      '@backstage/core-components':
        singleton: true
```

When building and bundling the frontend application, the resulting list of shared dependencies will be resolved and made available for the frontend application to use at runtime.

The CLI automatically:

1. Merges default shared dependencies with any configured ones in the build-time application configuration
2. Resolves versions of the merged shared dependencies based on the monorepo dependencies
3. Adds an additional entrypoint to the frontend application bundle with the list of resolved runtime shared dependencies

### Runtime Configuration

At runtime, any shared dependency mentioned in the runtime application configuration using the `app.moduleFederation.sharedDependencies` key, will override the shared dependencies resolved at build time and included in the frontend application bundle. However, new shared dependencies cannot be added at runtime, and will be skipped with a console warning.

## Building Module Federation Remotes

Plugin packages can be built as module federation remotes, allowing them to be loaded dynamically by a host application.

### Using the CLI

To build a plugin as a module federation remote, use the `--module-federation` option with the `package build` command:

```bash
cd plugins/my-plugin
yarn build --module-federation
```

If you need to configure the shared dependencies for the remote, you can use the `--module-federation.shared-dependencies` option:

```bash
# Add or override a shared dependency
yarn build --module-federation.shared-dependencies '{"@backstage/core-components":{"singleton":true}}'

# Set requiredVersion to null to auto-fill from package.json
yarn build --module-federation.shared-dependencies '{"react":{"singleton":true,"requiredVersion":null}}'
```

As shown in the example above, remote-specific optional fields like `requiredVersion` can be set to `null` in order to explicitly remove them from the Backstage default configuration and switch to the module federation standard default behavior.

### Build Output

When building a plugin as a module federation remote, the CLI:

1. Merges default shared dependencies with any configured ones in the command-line argument configuration
2. Resolves versions of the merged shared dependencies based on the monorepo dependencies (done automatically by the Rsack/Webpack module federation plugin)
3. Produces the bundle assets in the `dist` folder, including:
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
import { ConfigApi } from '@backstage/frontend-plugin-api';

export async function initializeModuleFederation(
  config: ConfigApi,
): Promise<ModuleFederation> {
  // Build the shared dependencies configuration
  const { shared, errors } = await buildRuntimeSharedUserOption(config);

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
  async loader({ config }) {
    moduleFederationInstance.registerShared(
      (await buildRuntimeSharedUserOption(config)).shared,
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

## Configuration Reference

### Host Configuration Schema

The host configuration is specified in `app-config.yaml`:

```yaml
app:
  moduleFederation:
    sharedDependencies:
      # Package name as key
      <package-name>:
        # Whether this must be a singleton (optional)
        singleton: boolean
        # Version of the shared dependency (optional, use to override the auto-filled value)
        version: string
        # Semver version requirement (required, false to completely disable version checking)
        requiredVersion: false | string
        # Whether to load eagerly (optional)
        eager: boolean
      # Or false to remove a dependency
      <package-name>: false
```

### Remote Configuration Schema

The remote configuration is specified as an inline JSON string:

```json
{
  "<package-name>": {
    "singleton": boolean (optional),
    "version": false | string | null (optional),
    "requiredVersion": false | string | null (optional),
    "import": false | string | null (optional)
  },
  "<package-name>": false
}
```

**Note about `null` values**: For remote configurations, remote-specific optional fields can be set to `null`
to explicitly remove them from the Backstage default configuration, thus switching to the module federation standard default behavior.
In the case of the `requiredVersion` and `import` fields, this allows them to be auto-filled at build time by the module federation plugin.

### Configuration Fields

| Field             | Type            | Host | Remote | Description                                                                                          |
| ----------------- | --------------- | ---- | ------ | ---------------------------------------------------------------------------------------------------- |
| `requiredVersion` | false \| string | ✓    | ✓      | Semver range (required for host, optional for remote).                                               |
| `singleton`       | boolean         | ✓    | ✓      | Whether only one version should be loaded                                                            |
| `eager`           | boolean         | ✓    | ✗      | Whether to load at app startup (host only)                                                           |
| `import`          | false \| string | ✗    | ✓      | Whether to bundle inside the remote module (optional, `false` = must come from host).                |
| `version`         | false \| string | ✓    | ✓      | Optional version to override the auto-filled value. Can be set to `false` for consumer-only remotes. |

### Default Shared Dependencies

Default shared dependencies are the same for both the host and remotes, and the list can be found in the [`@backstage/module-federation-common`](https://github.com/backstage/backstage/blob/master/packages/module-federation-common/src/defaults.ts) package.
