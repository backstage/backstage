---
id: installing-plugins
title: Installing Plugins
sidebar_label: Installing Plugins
description: How to install frontend plugins in a Backstage app
---

Frontend plugins are installed in your Backstage app by adding them as dependencies of your app package. Most of the time this is all you need to do, as the app will automatically discover and install the plugin.

## Install a plugin package

To install a plugin, add it as a dependency to your app package. For example, to install the catalog plugin:

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage/plugin-catalog
```

If your app is set up with [feature discovery](#feature-discovery), the plugin will be automatically detected and installed in the app. No additional code changes are needed.

## Feature discovery

Feature discovery lets the app automatically discover and install plugins from the dependencies of your app package. This is enabled by setting `app.packages` to `all` in your `app-config.yaml`:

```yaml title="app-config.yaml"
app:
  packages: all
```

This is the recommended setup and is the default for all new Backstage apps. With this enabled, any plugin that is added as a dependency of your app package will be automatically discovered and installed. You can use include or exclude filters to control which packages are discovered:

```yaml title="app-config.yaml"
app:
  packages:
    include:
      - '@backstage/plugin-catalog'
      - '@backstage/plugin-scaffolder'
```

```yaml title="app-config.yaml"
app:
  packages:
    exclude:
      - '@backstage/plugin-catalog'
```

Feature discovery requires that your app is built using the `@backstage/cli`, which is the default for all Backstage apps. Note that you do not need to exclude packages that you also install manually in code, since plugin instances are deduplicated by the app.

For more details on how feature discovery works under the hood, see the [Feature Discovery](../architecture/10-app.md#feature-discovery) architecture documentation.

### Deferred loading

:::note
Deferred loading is experimental, and the details described here may change.
:::

You can let the app load discovered plugins on demand, rather than loading them all before the app starts. The plugins are then loaded in the same way as [deferred module federation remotes](./07-module-federation.md#deferred-loading), so your app must install the `dynamicFrontendFeaturesLoader` and your backend must include the dynamic features service, see [Module federation](./07-module-federation.md). Enable this by setting `app.experimental.deferredPackages` together with `app.packages` and `app.experimental.deferredRemotes`:

```yaml title="app-config.yaml"
app:
  packages: all
  experimental:
    deferredPackages: true
    deferredRemotes: true
```

When you build or start the app, the CLI leaves each package whose plugins support deferred loading out of the app bundle, and builds it as a module federation remote in the `dist/remotes` folder of your app instead. The dynamic features backend lists these remotes in its `/remotes` endpoint together with your dynamic plugins, as long as `app.packageName` names your app package and the backend can resolve that package. The app then loads a plugin from its remote the first time one of its pages is visited or one of its elements is rendered.

Whether a plugin supports deferred loading is decided by analyzing its source code, see [Deferred loading](../building-plugins/01-index.md#deferred-loading). Plugins in your workspace are analyzed when you build or start the app. Plugins that you install from npm must include the `dist/backstage-manifest.json` file that is written when they are packed for publishing, otherwise they are bundled with the app. A package is only built as a remote if all of its plugins and modules support deferred loading. When you build or start the app, the CLI prints which packages are built as remotes and why the others are not. During `yarn start`, the remotes are built once when the app starts, so you need to restart the app to pick up changes to a deferred plugin.

To always bundle some plugins with the app, list their packages in `exclude`:

```yaml title="app-config.yaml"
app:
  packages: all
  experimental:
    deferredPackages:
      exclude:
        - '@backstage/plugin-catalog'
```

A plugin that you pass to `createApp` in the `features` option is used instead of a deferred plugin with the same plugin ID. If you pass a module for a deferred plugin, that plugin is loaded together with the app so that the module applies to it.

The stand-in of an element of a deferred plugin applies the config in `app.extensions` that the factory of its blueprint outputs as is, such as the `filter` and `type` of an entity card, and config that only affects the element is applied once the plugin is loaded. If you have any other config for an element of a deferred plugin, the plugin is loaded right after the app has started, since the config can only be applied once the plugin is loaded. Config for the pages of a plugin is applied to their stand-ins. A deferred plugin that provides utility APIs is loaded the first time one of its APIs is used.

## Manual installation

If your app does not have [feature discovery](#feature-discovery) enabled, or if you need more control over the plugin installation, you can install plugins manually. This is done by importing the plugin and passing it to `createApp`:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';

const app = createApp({
  features: [catalogPlugin],
});

export default app.createRoot();
```

Manual installation may also be necessary if you need to control the ordering of plugins, for example when customizing route priorities. Since manually installed plugins are deduplicated against automatically discovered ones, you can safely install a plugin both manually and through feature discovery without causing conflicts.

If you need to use a 3rd-party plugin that does not yet support the new frontend system, you can use the conversion utilities from `@backstage/core-compat-api` to wrap it. See [Converting 3rd-party Plugins](./06-plugin-conversion.md) for details.

## Configuring installed plugins

Once a plugin is installed, you can configure its extensions through the `app.extensions` section of your `app-config.yaml`. See [Configuring Extensions](./02-configuring-extensions.md) for details.
