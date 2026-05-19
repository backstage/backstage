---
id: configure-app-with-plugins
title: Configuring App with plugins
description: Documentation on How Configuring App with plugins
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./configure-app-with-plugins--old.md)
instead.
::::

Audience: Developers

:::note Note
Backstage plugins are primarily written using [TypeScript](https://www.typescriptlang.org), [Node.js](https://nodejs.org) and [React](https://reactjs.org). Having an understanding of these technologies will be beneficial on your journey to customizing Backstage!
:::

## Summary

Backstage plugins customize the app for your needs. There is a
[plugin directory](https://backstage.io/plugins) with plugins for many common
infrastructure needs - CI/CD, monitoring, auditing, and more.

## Adding existing plugins to your app

The following steps assume that you have
[created a Backstage app](./index.md) and want to add an existing plugin
to it.

You can find many wonderful plugins out there for Backstage, for example through the [Community Plugins Repository](https://github.com/backstage/community-plugins) and the [Backstage Plugin Directory](https://backstage.io/plugins).

Adding plugins to your Backstage app is generally a simple process, and ideally each plugin will come with its own documentation on how to install and configure it. In this example we will add the [Tech Radar plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/tech-radar/plugins/tech-radar) to our Backstage app.

### 1. Install the plugin package

Add the plugin's npm package to the repo:

```bash title="From your Backstage root directory"
yarn --cwd packages/app add @backstage-community/plugin-tech-radar
```

Note the plugin is added to the `app` package, rather than the root
`package.json`. Backstage Apps are set up as monorepos with
[Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). Frontend UI plugins are generally added to the `app` folder, while backend plugins are added to the `backend` folder.

### 2. Verify the plugin is available

With the new frontend system, plugins are automatically discovered and installed in your app through [feature discovery](../frontend-system/building-apps/05-installing-plugins.md#feature-discovery). This is enabled by the default `app-config.yaml` setting:

```yaml title="app-config.yaml"
app:
  packages: all
```

Once the package is installed, the plugin is ready to use — no code changes needed! Start your app with `yarn start` and navigate to `/tech-radar` to see the plugin in action.

This is just one example, and if you'd like to continue adding the Tech Radar plugin you can do so by going [here](https://github.com/backstage/community-plugins/tree/main/workspaces/tech-radar/plugins/tech-radar). Keep in mind each Backstage instance may integrate content or cards to suit their needs on different pages, tabs, etc. In addition, while some plugins such as this example are designed to be used in a stand-alone fashion, others may be intended to annotate or support specific software catalog entities and would be added elsewhere in the app.

### 3. Optional: Configure the plugin

Plugins can be further customized through configuration in your `app-config.yaml`. For example, you can configure extension settings under the `app.extensions` section:

```yaml title="app-config.yaml"
app:
  extensions:
    - page:tech-radar:
        config:
          path: /tech-radar
```

For details on what configuration options are available, refer to the plugin's own documentation or the [Configuring Extensions](../frontend-system/building-apps/02-configuring-extensions.md) guide.

### 4. Optional: Manually install a plugin

If you need more control over plugin installation, or if [feature discovery](../frontend-system/building-apps/05-installing-plugins.md#feature-discovery) is not enabled, you can install plugins manually by importing them and passing them to `createApp`:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import techRadarPlugin from '@backstage-community/plugin-tech-radar/alpha';

const app = createApp({
  features: [techRadarPlugin],
});

export default app.createRoot();
```

For more details and alternative installation methods, see [Installing Plugins](../frontend-system/building-apps/05-installing-plugins.md).

## How the sidebar works

In the new frontend system, plugins that provide a page automatically register a navigation item in the sidebar. You don't need to manually add `SidebarItem` elements for most plugins.

If you want to customize sidebar behavior — for example, reordering items, grouping them, or adding custom entries — you can override the built-in `app/nav` extension. See the [migration guide's sidebar section](../frontend-system/building-apps/08-migrating.md#app-root-sidebar) for details on how to create a custom sidebar layout.
