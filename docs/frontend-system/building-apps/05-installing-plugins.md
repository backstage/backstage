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
